#!/usr/bin/env python3
"""Render LernKoko's German texts with the Supertonic 3 preset voices.

Usage: make-voices.py TEXTS.json OUTPUT_DIR

OUTPUT_DIR holds the previous "sesler" branch. Only missing clips are rendered,
clips that are no longer needed are removed, and manifest.json + RAPOR.md are
rewritten. OUTPUT_DIR/.changed receives the number of added/removed files.

A run stops rendering after VOICE_BUDGET_MIN minutes (default 90) so the job never hits
its time limit; what is done is kept, and OUTPUT_DIR/.more tells build.sh to start the
workflow again for the rest. Voices are rendered one after the other (F1 first).
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

SETTINGS = 'supertonic3-de-speed0.92-steps10-v1'
VOICES = ['F1', 'F2', 'F3', 'F4', 'F5', 'M1', 'M2', 'M3', 'M4', 'M5']
SPEED = 0.92
STEPS = 10
BITRATE = 64


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


def check_with_whisper(samples_by_voice, report):
    """Transcribe a few clips per voice so the report shows how clear German is."""
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
            for index, text in enumerate(todo):
                if time.time() - began_run > budget:
                    more = True
                    log(f'{voice}: time budget reached after {done} clips; the next run continues')
                    break
                done += 1
                try:
                    wav = synth(text, voice, style)
                    samples, rate = to_samples(tts, wav)
                    samples = tidy(samples, rate)
                    path = os.path.join(out, voice, clips[text] + '.mp3')
                    with open(path, 'wb') as handle:
                        handle.write(encode_mp3(samples, rate))
                    changed += 1
                    stats['rate'] = rate
                    if samples_for_pitch is None or len(samples) > len(samples_for_pitch):
                        samples_for_pitch = samples
                except Exception as error:  # noqa: BLE001
                    report['errors'].append(f'{voice}: {text[:40]!r}: {error!r}')
                if index % 50 == 0:
                    log(f'{voice}: {index + 1}/{len(todo)}')
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
            check_with_whisper(checks, report)

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
    manifest = {'version': int(time.time()), 'settings': SETTINGS, 'voices': ready, 'clips': clips}
    if previous.get('clips') != clips or previous.get('voices') != ready:
        changed += 1
    else:
        manifest['version'] = previous.get('version', manifest['version'])
    with open(manifest_path, 'w', encoding='utf-8') as handle:
        json.dump(manifest, handle, ensure_ascii=False, separators=(',', ':'))
    report['ready_voices'] = ready
    report['finished'] = time.strftime('%Y-%m-%d %H:%M UTC', time.gmtime())
    if total_missing:
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
