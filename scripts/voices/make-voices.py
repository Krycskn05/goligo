#!/usr/bin/env python3
"""Render Goliqo's German texts with the Supertonic 3 preset voices.

Usage: make-voices.py TEXTS.json OUTPUT_DIR

OUTPUT_DIR holds the previous "sesler" branch. Only missing clips are rendered,
clips that are no longer needed are removed, and manifest.json + RAPOR.md are
rewritten. OUTPUT_DIR/.changed receives the number of added/removed files.

A run stops rendering after VOICE_BUDGET_MIN minutes (default 90) so the job never hits
its time limit; what is done is kept, and OUTPUT_DIR/.more tells build.sh to start the
workflow again for the rest. Voices are rendered one after the other (F1 first).

Word times (read-along by word, lib/read-along.ts): every rendered clip of two or more words is
measured with faster-whisper (word_times.py — a few clips in one window, the heard words aligned
to the written ones) while less than 92 % of the budget is used; the time that is left after
rendering measures the clips that have no times yet (older clips; the next run continues, .more,
while any are left). The times are <voice>/times.json (clip id → each word's start as a share of the clip), the manifest
lists the voices that have one under "times", and a clip without times keeps the site's letter
estimate. VOICE_TIMES=0 skips measuring; VOICE_TIMES_MODEL picks the whisper model (default base: it places
the words like small at a third of the time; small is the slower, slightly more thorough choice).
"""
import difflib
import hashlib
import inspect
import json
import os
import random
import re
import sys
import tempfile
import time

import numpy as np

import word_times  # beside this script

SETTINGS = 'supertonic3-de-speed0.92-steps10-v1'
VOICES = ['F1', 'F2', 'F3', 'F4', 'F5', 'M1', 'M2', 'M3', 'M4', 'M5']
SPEED = 0.92
STEPS = 10
BITRATE = 64
MEASURE_SHARE = 0.92  # measuring in the render pass stops at this share of the budget; rendering gets the rest


def speakable(text):
    """The text the model reads: quotation marks it cannot read are left out (the clip id keeps the full text)."""
    return re.sub(r'[„“”‚‘’«»"]', '', text).strip()


def clip_id(text):
    return hashlib.sha1(f'{SETTINGS}|{text}'.encode('utf-8')).hexdigest()[:16]


def log(*parts):
    print(*parts, flush=True)


def load_tts(report):
    import supertonic
    from supertonic import TTS
    report['package'] = getattr(supertonic, '__version__', '?')
    init = inspect.signature(TTS.__init__)
    report['init_signature'] = str(init)
    attempts = []
    if 'model' in init.parameters:
        attempts.append({'model': 'supertonic-3', 'auto_download': True})
    attempts.append({'auto_download': True})
    attempts.append({})
    last = None
    for kwargs in attempts:
        usable = {k: v for k, v in kwargs.items() if k in init.parameters}
        try:
            tts = TTS(**usable)
            report['init_used'] = usable
            return tts
        except Exception as error:  # noqa: BLE001 - report every attempt
            last = error
            report.setdefault('init_errors', []).append(f'{usable}: {error!r}')
    raise RuntimeError(f'Supertonic could not start: {last!r}')


def make_synth(tts, report):
    signature = inspect.signature(tts.synthesize)
    params = signature.parameters
    report['synthesize_signature'] = str(signature)

    def synth(text, voice, style):
        kwargs = {}
        if 'lang' in params:
            kwargs['lang'] = 'de'
        elif 'language' in params:
            kwargs['language'] = 'de'
        if 'voice_style' in params:
            kwargs['voice_style'] = style
        if 'voice_name' in params:
            kwargs['voice_name'] = voice
        if 'total_steps' in params:
            kwargs['total_steps'] = STEPS
        if 'speed' in params:
            kwargs['speed'] = SPEED
        result = tts.synthesize(text, **kwargs)
        return result[0] if isinstance(result, tuple) else result

    return synth


def to_samples(tts, wav):
    """Return (float32 mono samples, sample rate) using the library's own writer."""
    import soundfile as sf
    with tempfile.TemporaryDirectory() as folder:
        path = os.path.join(folder, 'clip.wav')
        if hasattr(tts, 'save_audio'):
            tts.save_audio(wav, path)
            data, rate = sf.read(path, dtype='float32', always_2d=True)
            return data.mean(axis=1), int(rate)
    data = np.asarray(wav, dtype=np.float32).squeeze()
    rate = int(getattr(tts, 'sample_rate', 0) or getattr(tts, 'sr', 0) or 44100)
    if np.abs(data).max(initial=0) > 1.5:
        data = data / 32768.0
    return data, rate


def tidy(samples, rate):
    samples = np.nan_to_num(samples.astype(np.float32))
    peak = float(np.abs(samples).max(initial=0))
    if peak <= 1e-6:
        raise ValueError('silent clip')
    loud = np.where(np.abs(samples) > peak * 0.02)[0]
    start = max(0, loud[0] - int(0.04 * rate))
    end = min(len(samples), loud[-1] + int(0.14 * rate))
    samples = samples[start:end]
    rms = float(np.sqrt(np.mean(samples ** 2)))
    gain = min(0.12 / max(rms, 1e-6), 0.93 / float(np.abs(samples).max()))
    samples = samples * gain
    fade = int(0.006 * rate)
    if len(samples) > 2 * fade:
        ramp = np.linspace(0, 1, fade, dtype=np.float32)
        samples[:fade] *= ramp
        samples[-fade:] *= ramp[::-1]
    return samples


def encode_mp3(samples, rate):
    import lameenc
    encoder = lameenc.Encoder()
    encoder.set_bit_rate(BITRATE)
    encoder.set_in_sample_rate(rate)
    encoder.set_channels(1)
    encoder.set_quality(2)
    pcm = (np.clip(samples, -1, 1) * 32767).astype('<i2').tobytes()
    return bytes(encoder.encode(pcm) + encoder.flush())


def median_pitch(samples, rate):
    """Rough median F0 of voiced 40 ms frames (autocorrelation), for the report."""
    frame = int(0.04 * rate)
    hop = frame // 2
    found = []
    for start in range(0, max(0, len(samples) - frame), hop):
        chunk = samples[start:start + frame]
        chunk = chunk - chunk.mean()
        if float(np.sqrt(np.mean(chunk ** 2))) < 0.03:
            continue
        corr = np.correlate(chunk, chunk, mode='full')[frame - 1:]
        lo, hi = int(rate / 400), int(rate / 70)
        if hi >= len(corr):
            continue
        lag = lo + int(np.argmax(corr[lo:hi]))
        if corr[lag] > 0.3 * corr[0]:
            found.append(rate / lag)
    return round(float(np.median(found)), 1) if found else None


def letters(text):
    return re.sub(r'[^a-zäöüß]+', ' ', text.lower()).strip()


def load_timer(report):
    """The speech model that measures the word times (faster-whisper on the CPU, int8); None when it cannot start."""
    name = os.environ.get('VOICE_TIMES_MODEL', 'base')
    try:
        from faster_whisper import WhisperModel
        model = WhisperModel(name, device='cpu', compute_type='int8')
    except Exception as error:  # noqa: BLE001
        report['times_error'] = repr(error)
        return None
    report['times_model'] = name
    return model


def check_with_whisper(samples_by_voice, report, model=None):
    """Transcribe a few clips per voice so the report shows how clear German is."""
    if model is None:
        try:
            from faster_whisper import WhisperModel
            model = WhisperModel('small', device='cpu', compute_type='int8')
        except Exception as error:  # noqa: BLE001
            report['asr_error'] = repr(error)
            return
    for voice, items in samples_by_voice.items():
        rows = []
        for text, path in items:
            try:
                segments, _ = model.transcribe(path, language='de', beam_size=5)
                heard = ' '.join(segment.text.strip() for segment in segments).strip()
            except Exception as error:  # noqa: BLE001
                heard = f'<error {error!r}>'
            score = difflib.SequenceMatcher(None, letters(text), letters(heard)).ratio()
            rows.append({'text': text, 'heard': heard, 'score': round(score, 3)})
        report['voices'].setdefault(voice, {})['asr'] = rows
        report['voices'][voice]['asr_mean'] = round(sum(r['score'] for r in rows) / max(1, len(rows)), 3)


def times_path(out, voice):
    return os.path.join(out, voice, 'times.json')


def load_times(out, voice):
    """The word times a voice already has: clip id → starts (shares of the clip)."""
    path = times_path(out, voice)
    if not os.path.exists(path):
        return {}
    try:
        data = json.load(open(path, encoding='utf-8'))
    except Exception:  # noqa: BLE001
        return {}
    return {key: value for key, value in data.items() if isinstance(value, list)} if isinstance(data, dict) else {}


def save_times(out, voice, times):
    with open(times_path(out, voice), 'w', encoding='utf-8') as handle:
        json.dump(dict(sorted(times.items())), handle, ensure_ascii=False, separators=(',', ':'))


def needs_times(text):
    """A one-word clip needs no measuring: its word begins with the clip (lib/read-along.ts gives it index 0)."""
    return len(word_times.words_of(text)) > 1


def main():
    texts = json.load(open(sys.argv[1], encoding='utf-8'))
    out = sys.argv[2]
    os.makedirs(out, exist_ok=True)
    report = {'started': time.strftime('%Y-%m-%d %H:%M UTC', time.gmtime()), 'settings': SETTINGS,
              'texts': len(texts), 'voices': {}, 'errors': []}
    began_run = time.time()
    budget = float(os.environ.get('VOICE_BUDGET_MIN', '90')) * 60
    more = False
    clips = {text: clip_id(text) for text in texts}
    wanted = set(clips.values())
    changed = 0

    for voice in VOICES:
        folder = os.path.join(out, voice)
        os.makedirs(folder, exist_ok=True)
        for name in os.listdir(folder):
            if name.endswith('.mp3') and name[:-4] not in wanted:
                os.remove(os.path.join(folder, name))
                changed += 1

    missing = {voice: [t for t, i in clips.items() if not os.path.exists(os.path.join(out, voice, i + '.mp3'))]
               for voice in VOICES}
    total_missing = sum(len(v) for v in missing.values())
    log(f'{len(texts)} texts, {total_missing} clips to render')

    # Word times: what each voice already has, without the clips that are gone.
    measuring = os.environ.get('VOICE_TIMES', '1') == '1'
    times = {voice: load_times(out, voice) for voice in VOICES}
    times_dirty = set()
    for voice in VOICES:
        for key in list(times[voice]):
            if key not in wanted:
                del times[voice][key]
                times_dirty.add(voice)
    timer = {'model': None, 'tried': False}

    def model():
        if not timer['tried']:
            timer['tried'] = True
            timer['model'] = load_timer(report)
        return timer['model']

    def keep(voice, results):
        stats = report['voices'].setdefault(voice, {}).setdefault('times', {'measured': 0, 'words': 0, 'placed': 0, 'seconds': 0})
        for key, shares, matched, count in results:
            times[voice][key] = shares
            times_dirty.add(voice)
            stats['measured'] += 1
            stats['words'] += count
            stats['placed'] += matched

    def measure(voice, measurer, key, text, path):
        """Measure one clip (the batch before it is transcribed when it is full); a clip that cannot be read keeps the estimate."""
        began = time.time()
        try:
            keep(voice, measurer.add(key, text, path))
        except Exception as error:  # noqa: BLE001
            report['errors'].append(f'{voice}: times {text[:40]!r}: {error!r}')
            keep(voice, [(key, word_times.estimate(word_times.words_of(text)), 0, len(word_times.words_of(text)))])
        report['voices'][voice]['times']['seconds'] += time.time() - began

    def finish(voice, measurer):
        if measurer is None:
            return
        began = time.time()
        keep(voice, measurer.flush())
        stats = report['voices'][voice].get('times')
        if stats is not None:
            stats['seconds'] = round(stats['seconds'] + time.time() - began, 1)
        for error in measurer.errors:
            report['errors'].append(f'{voice}: times batch {error}')

    checks = {}
    if total_missing:
        tts = load_tts(report)
        synth = make_synth(tts, report)
        rng = random.Random(7)
        for voice in VOICES:
            todo = missing[voice]
            if not todo:
                continue
            try:
                style = tts.get_voice_style(voice_name=voice) if hasattr(tts, 'get_voice_style') else None
            except Exception as error:  # noqa: BLE001
                report['errors'].append(f'{voice}: style {error!r}')
                continue
            began = time.time()
            stats = report['voices'].setdefault(voice, {})
            samples_for_pitch = None
            done = 0
            measurer = None
            for index, text in enumerate(todo):
                if time.time() - began_run > budget:
                    more = True
                    log(f'{voice}: time budget reached after {done} clips; the next run continues')
                    break
                done += 1
                try:
                    wav = synth(speakable(text), voice, style)
                    samples, rate = to_samples(tts, wav)
                    samples = tidy(samples, rate)
                    path = os.path.join(out, voice, clips[text] + '.mp3')
                    with open(path, 'wb') as handle:
                        handle.write(encode_mp3(samples, rate))
                    changed += 1
                    stats['rate'] = rate
                    if samples_for_pitch is None or len(samples) > len(samples_for_pitch):
                        samples_for_pitch = samples
                    # Word times in the same pass, while the budget allows; later clips wait for the backfill below.
                    if measuring and needs_times(text) and time.time() - began_run < budget * MEASURE_SHARE:
                        if measurer is None and model() is not None:
                            measurer = word_times.Measurer(model())
                        if measurer is not None:
                            measure(voice, measurer, clips[text], text, path)
                except Exception as error:  # noqa: BLE001
                    report['errors'].append(f'{voice}: {text[:40]!r}: {error!r}')
                if index % 50 == 0:
                    log(f'{voice}: {index + 1}/{len(todo)}')
            finish(voice, measurer)
            stats['rendered'] = done
            stats['seconds'] = round(time.time() - began, 1)
            if samples_for_pitch is not None:
                stats['median_pitch_hz'] = median_pitch(samples_for_pitch, stats.get('rate', 44100))
            sample_texts = rng.sample(todo, min(3, len(todo)))
            checks[voice] = [(t, os.path.join(out, voice, clips[t] + '.mp3')) for t in sample_texts
                             if os.path.exists(os.path.join(out, voice, clips[t] + '.mp3'))]
            if more:
                break
        if os.environ.get('VOICE_ASR', '1') == '1':
            check_with_whisper(checks, report, timer['model'])

    # Backfill: clips that have no word times yet (older clips, or clips rendered after the measuring share of the
    # budget), voice by voice, until the budget is used; what is left waits for the next run.
    times_pending = 0
    if measuring and not more:
        for voice in VOICES:
            todo = [(clips[text], text) for text in texts
                    if needs_times(text) and clips[text] not in times[voice]
                    and os.path.exists(os.path.join(out, voice, clips[text] + '.mp3'))]
            if not todo:
                continue
            if model() is None:
                break
            measurer = word_times.Measurer(model())
            began = time.time()
            done = 0
            for key, text in todo:
                if time.time() - began_run > budget:
                    break
                measure(voice, measurer, key, text, os.path.join(out, voice, key + '.mp3'))
                done += 1
                if done % 500 == 0:
                    log(f'{voice}: word times {done}/{len(todo)}')
            finish(voice, measurer)
            log(f'{voice}: word times for {done} of {len(todo)} clips in {round(time.time() - began)} s')
            if done < len(todo):
                times_pending += len(todo) - done
                break
    measured = sum(stats.get('times', {}).get('measured', 0) for stats in report['voices'].values())
    if times_pending:
        # Only when this run made progress: a model that cannot measure must not start run after run.
        report['times_pending'] = times_pending
        if measured:
            more = True
            log(f'{times_pending} clips still need word times; the next run continues')
    for voice in times_dirty:
        if times[voice]:
            save_times(out, voice, times[voice])
            changed += 1
        elif os.path.exists(times_path(out, voice)):
            os.remove(times_path(out, voice))
            changed += 1
    with_times = [voice for voice in VOICES if times[voice] and os.path.exists(times_path(out, voice))]

    previous = {}
    manifest_path = os.path.join(out, 'manifest.json')
    if os.path.exists(manifest_path):
        try:
            previous = json.load(open(manifest_path, encoding='utf-8'))
        except Exception:  # noqa: BLE001
            previous = {}
    # A voice stays ready while new texts are still being rendered: it keeps the clips of the
    # texts it already had (a text without a clip yet plays with the device voice, as before).
    was_ready = set(previous.get('voices') or [])
    kept = [clips[t] for t in (previous.get('clips') or {}) if t in clips]
    ready = []
    for voice in VOICES:
        have = sum(1 for i in clips.values() if os.path.exists(os.path.join(out, voice, i + '.mp3')))
        report['voices'].setdefault(voice, {})['available'] = have
        had = sum(1 for i in kept if os.path.exists(os.path.join(out, voice, i + '.mp3')))
        if texts and (have >= 0.95 * len(texts) or (voice in was_ready and kept and had >= 0.95 * len(kept))):
            ready.append(voice)
    # "times": the voices whose folder has a times.json (lib/site-voices.ts loads it for their clips); the version
    # changes with the times too, so the site fetches a fresh times.json after a deploy.
    manifest = {'version': int(time.time()), 'settings': SETTINGS, 'voices': ready, 'clips': clips, 'times': with_times}
    if previous.get('clips') != clips or previous.get('voices') != ready or (previous.get('times') or []) != with_times or times_dirty:
        changed += 1
    else:
        manifest['version'] = previous.get('version', manifest['version'])
    with open(manifest_path, 'w', encoding='utf-8') as handle:
        json.dump(manifest, handle, ensure_ascii=False, separators=(',', ':'))
    report['ready_voices'] = ready
    report['times_voices'] = with_times
    report['finished'] = time.strftime('%Y-%m-%d %H:%M UTC', time.gmtime())
    if total_missing or measured:
        with open(os.path.join(out, 'report.json'), 'w', encoding='utf-8') as handle:
            json.dump(report, handle, ensure_ascii=False, indent=1)
    with open(os.path.join(out, '.changed'), 'w') as handle:
        handle.write(str(changed))
    report['more'] = more
    if more:
        with open(os.path.join(out, '.more'), 'w') as handle:
            handle.write('1')
    log(json.dumps({k: v for k, v in report.items() if k != 'voices'}, ensure_ascii=False)[:2000])
    for voice, stats in report['voices'].items():
        log(voice, json.dumps({k: v for k, v in stats.items() if k != 'asr'}))
    if not ready:
        sys.exit('No voice is ready.')


if __name__ == '__main__':
    main()
