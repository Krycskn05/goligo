#!/usr/bin/env python3
"""Word times for the site voices: where each word of a clip begins (read-along by word, lib/read-along.ts).

make-voices.py measures the clips it renders and, with the time that is left, the clips that have no times yet
(`Measurer`): a few clips of one voice are decoded, joined with short silences and transcribed once with
faster-whisper (word timestamps; one 30-second window instead of one per clip), the heard words are given back to
their clips by time, and each clip's heard words are aligned to the written words of its text (`align`): lowercase,
punctuation stripped, a tolerant match (difflib ratio), two heard tokens may be one written word (Deutsch + kurs)
and one heard token two written words (zuhause). Words the model did not place get the letter estimate between
their neighbours — the formula of lib/read-along.ts `wordTimeline` (`estimate`). A clip's result is one start per
written word as a share (0–1) of the clip's length; the first word begins with the clip. Words are counted like
`wordSpans` on the site: runs of non-space characters of the text (quotation marks the voice does not read stay
in the count, so the indexes match).

The times live beside the clips as <voice>/times.json (clip id → starts) and are read by lib/site-voices.ts
`clipWordTimes`. `python3 word_times.py --self-test` checks the alignment with a fake transcript, without any model
(tests/voice-word-times.test.cjs runs it).
"""
from __future__ import annotations

import difflib
import json
import re
import sys

SAMPLE_RATE = 16000
GAP_SECONDS = 0.6  # silence between the clips of one batch
BATCH_SECONDS = 26.0  # whisper hears 30-second windows: one window per batch
BATCH_CLIPS = 12
TAIL_UNITS = 2  # lib/read-along.ts TAIL_UNITS
MATCH_MIN = 0.6  # a heard word is this written word when the strings are at least this alike
JOIN_MIN = 0.9  # two tokens as one word (or one token as two words) need a near-exact match, so a short missing word is never swallowed by its neighbour
JOIN_BONUS = 0.25


def words_of(text):
    """The words of a text as the site counts them (lib/read-along.ts `wordSpans`)."""
    return text.split()


def word_units(word):
    """lib/read-along.ts `wordUnits`: an onset, the letters and digits, a pause after a comma, a longer one after a sentence."""
    letters = sum(1 for ch in word if ch.isalnum())
    units = 1 + letters
    if re.search(r'[,;:]["“”»)]*$', word):
        units += 2.5
    if re.search(r'[.!?…]["“”»)]*$', word):
        units += 4.5
    return units


def estimate(words):
    """lib/read-along.ts `wordTimeline`: each word's start as a share of the clip, from its letters."""
    weights = [word_units(word) for word in words]
    total = sum(weights) + TAIL_UNITS
    starts = []
    at = 0.0
    for weight in weights:
        starts.append(at / total)
        at += weight
    return starts


def norm(token):
    return ''.join(ch for ch in token.lower() if ch.isalnum())


ONES = ['null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn', 'elf', 'zwölf', 'dreizehn',
        'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn']
TENS = ['', '', 'zwanzig', 'dreißig', 'vierzig', 'fünfzig', 'sechzig', 'siebzig', 'achtzig', 'neunzig']


def spell_number(digits):
    """A number as the voice reads it (0–9999), so "9" heard for "neun" — or "zwanzig" for "20" — still matches."""
    value = int(digits)
    if value >= 10000:
        return digits
    if value >= 1000:
        head = 'ein' if value // 1000 == 1 else spell_number(str(value // 1000))
        return head + 'tausend' + (spell_number(str(value % 1000)) if value % 1000 else '')
    if value >= 100:
        head = 'ein' if value // 100 == 1 else spell_number(str(value // 100))
        return head + 'hundert' + (spell_number(str(value % 100)) if value % 100 else '')
    if value < 20:
        return ONES[value]
    unit = value % 10
    return ('ein' if unit == 1 else ONES[unit] if unit else '') + ('und' if unit else '') + TENS[value // 10]


def spoken(token):
    return spell_number(token) if token.isdigit() else token


def similar(a, b):
    if not a or not b:
        return 0.0
    if a == b:
        return 1.0
    a, b = spoken(a), spoken(b)
    if a == b:
        return 1.0
    return difflib.SequenceMatcher(None, a, b).ratio()


def align(words, heard, duration):
    """Align the heard words of a clip to its written words.

    words: the written words; heard: (start, end, token) in seconds from the clip's start; duration: seconds.
    Returns (starts, matched): one start per written word as a share of the clip (0–1, 3 decimals, never going
    back, the first 0) and how many written words the model placed. A clip with no heard words gets the estimate.
    """
    n = len(words)
    if n == 0:
        return [], 0
    if duration <= 0:
        return estimate(words), 0
    written = [norm(word) for word in words]
    tokens = [norm(token) for _, _, token in heard]
    m = len(tokens)
    best = [[0.0] * (m + 1) for _ in range(n + 1)]
    move = [[''] * (m + 1) for _ in range(n + 1)]
    for i in range(n + 1):
        for j in range(m + 1):
            if i == 0 and j == 0:
                continue
            options = []
            if i > 0:
                options.append((best[i - 1][j], 'skip-word'))
            if j > 0:
                options.append((best[i][j - 1], 'skip-token'))
            if i > 0 and j > 0:
                score = similar(written[i - 1], tokens[j - 1])
                if score >= MATCH_MIN:
                    options.append((best[i - 1][j - 1] + score, 'match'))
            if i > 0 and j > 1:  # one written word heard as two tokens
                score = similar(written[i - 1], tokens[j - 2] + tokens[j - 1])
                if score >= JOIN_MIN:
                    options.append((best[i - 1][j - 2] + score + JOIN_BONUS, 'two-tokens'))
            if i > 1 and j > 0:  # two written words heard as one token
                score = similar(written[i - 2] + written[i - 1], tokens[j - 1])
                if score >= JOIN_MIN:
                    options.append((best[i - 2][j - 1] + score + JOIN_BONUS, 'two-words'))
            best[i][j], move[i][j] = max(options, key=lambda option: option[0])
    starts = [None] * n
    ends = [None] * n
    i, j = n, m
    matched = 0
    while i > 0 or j > 0:
        step = move[i][j]
        if step == 'skip-word':
            i -= 1
        elif step == 'skip-token':
            j -= 1
        elif step == 'match':
            starts[i - 1], ends[i - 1] = heard[j - 1][0], heard[j - 1][1]
            matched += 1
            i -= 1
            j -= 1
        elif step == 'two-tokens':
            starts[i - 1], ends[i - 1] = heard[j - 2][0], heard[j - 1][1]
            matched += 1
            i -= 1
            j -= 2
        else:  # two-words
            start, end, _ = heard[j - 1]
            first, second = word_units(words[i - 2]), word_units(words[i - 1])
            cut = start + (end - start) * first / (first + second)
            starts[i - 2], ends[i - 2] = start, cut
            starts[i - 1], ends[i - 1] = cut, end
            matched += 2
            i -= 2
            j -= 1
    # Words the model did not place: the letter estimate between their neighbours (or the clip's start / end).
    k = 0
    while k < n:
        if starts[k] is not None:
            k += 1
            continue
        last = k
        while last + 1 < n and starts[last + 1] is None:
            last += 1
        left = ends[k - 1] if k > 0 else 0.0
        right = starts[last + 1] if last + 1 < n else duration
        if right < left:
            right = left
        weights = [word_units(word) for word in words[k:last + 1]]
        total = sum(weights) + (TAIL_UNITS if last + 1 >= n else 0)
        at = left
        for offset, weight in enumerate(weights):
            starts[k + offset] = at
            at += (right - left) * weight / total
        k = last + 1
    shares = []
    previous = 0.0
    for index, start in enumerate(starts):
        share = 0.0 if index == 0 else min(0.999, max(previous, start / duration))
        shares.append(round(share, 3))
        previous = share
    return shares, matched


def clip_words(heard, offset, duration):
    """The heard words that fall into one clip of a batch, with times from the clip's start."""
    found = []
    for start, end, token in heard:
        middle = (start + end) / 2
        if offset - 0.15 <= middle < offset + duration + 0.15:
            found.append((max(0.0, start - offset), min(duration, max(0.0, end - offset)), token))
    return found


class Measurer:
    """Collects clips of one voice and transcribes them a batch at a time.

    `add(key, text, path)` decodes the clip and returns the results of a batch when one became full; `flush()`
    returns the rest. A result is (key, shares, matched, word_count).
    """

    def __init__(self, model):
        self.model = model
        self.pending = []  # (key, text, audio)
        self.seconds = 0.0
        self.errors = []  # a batch the model could not transcribe keeps the estimate, so it is not tried again and again

    def add(self, key, text, path):
        import numpy as np
        from faster_whisper.audio import decode_audio
        audio = np.asarray(decode_audio(path, sampling_rate=SAMPLE_RATE), dtype=np.float32).reshape(-1)
        length = len(audio) / SAMPLE_RATE
        results = []
        if self.pending and (self.seconds + length + GAP_SECONDS > BATCH_SECONDS or len(self.pending) >= BATCH_CLIPS):
            results = self.flush()
        self.pending.append((key, text, audio))
        self.seconds += length + GAP_SECONDS
        return results

    def flush(self):
        import numpy as np
        if not self.pending:
            return []
        items, self.pending, self.seconds = self.pending, [], 0.0
        gap = np.zeros(int(GAP_SECONDS * SAMPLE_RATE), dtype=np.float32)
        parts = []
        offsets = []
        at = 0.0
        for _, _, audio in items:
            offsets.append(at)
            parts.append(audio)
            parts.append(gap)
            at += len(audio) / SAMPLE_RATE + GAP_SECONDS
        try:
            with np.errstate(all='ignore'):  # the silences between the clips make the log-mel step warn
                segments, _ = self.model.transcribe(np.concatenate(parts), language='de', beam_size=1, word_timestamps=True,
                                                    condition_on_previous_text=False, vad_filter=False)
                heard = [(word.start, word.end, word.word) for segment in segments for word in (segment.words or [])]
        except Exception as error:  # noqa: BLE001
            self.errors.append(repr(error))
            heard = []
        results = []
        for index, (key, text, audio) in enumerate(items):
            duration = len(audio) / SAMPLE_RATE
            words = words_of(text)
            shares, matched = align(words, clip_words(heard, offsets[index], duration), duration)
            results.append((key, shares, matched, len(words)))
        return results


def self_test():
    """The alignment on a fake transcript: exact, misheard, split, joined and missing words."""
    def check(condition, message):
        if not condition:
            raise SystemExit('word_times self-test failed: ' + message)

    check(words_of('Das ist  meine Familie.') == ['Das', 'ist', 'meine', 'Familie.'], 'words are runs of non-space characters')
    check(word_units('in') == 3 and word_units('Ja,') == 5.5 and word_units('Beirut.') == 11.5, 'word units as on the site')
    est = estimate(['Ja,', 'in', 'Beirut.'])
    check([round(v, 4) for v in est] == [0, round(5.5 / 22, 4), round(8.5 / 22, 4)], 'the estimate as on the site')
    # exact words, the first word begins with the clip
    shares, matched = align(['Ja,', 'in', 'Beirut.'], [(0.12, 0.4, ' Ja,'), (0.55, 0.7, ' in'), (0.8, 1.6, ' Beirut.')], 2.0)
    check(shares == [0, 0.275, 0.4] and matched == 3, f'exact words {shares} {matched}')
    # a misheard name and a compound split in two still match; a missing word is estimated between its neighbours
    shares, matched = align(['Der', 'Deutschkurs', 'beginnt', 'um', 'neun', 'Uhr.'],
                            [(0.0, 0.2, ' Der'), (0.3, 0.7, ' Deutsch'), (0.7, 1.0, 'kurs'), (1.1, 1.6, ' beginnt'), (2.0, 2.3, ' neun'), (2.4, 2.8, ' Uhr')], 3.0)
    check(matched == 5, f'five placed {matched}')
    check(shares[1] == 0.1 and shares[2] == round(1.1 / 3, 3) and shares[4] == round(2.0 / 3, 3) and shares[5] == 0.8, f'placed words keep their times {shares}')
    check(shares[3] == round(1.6 / 3, 3), f'the missing word starts where its neighbour ends {shares}')
    # two written words heard as one token share it by their letters
    shares, matched = align(['Ich', 'bin', 'zu', 'Hause.'], [(0.0, 0.3, ' Ich'), (0.4, 0.6, ' bin'), (0.8, 1.6, ' zuhause')], 2.0)
    check(matched == 4 and shares[2] == 0.4 and shares[3] == round((0.8 + 0.8 * 3 / (3 + 10.5)) / 2, 3), f'one token, two words {shares}')
    # nothing heard: the estimate; a word that comes back in time never goes back
    shares, matched = align(['Hallo', 'Welt.'], [], 1.0)
    check(matched == 0 and shares == [0, round(6 / 17.5, 3)], f'estimate without words {shares}')
    shares, _ = align(['Guten', 'Tag.'], [(0.9, 1.0, ' Guten'), (0.2, 0.5, ' Tag')], 1.0)
    check(shares[1] >= shares[0], 'never back in time')
    check(align([], [], 1.0) == ([], 0), 'no words')
    # numbers: the voice reads words, the model may write digits (or the other way round)
    check(spell_number('9') == 'neun' and spell_number('21') == 'einundzwanzig' and spell_number('100') == 'einhundert'
          and spell_number('2004') == 'zweitausendvier' and spell_number('1999') == 'eintausendneunhundertneunundneunzig', 'numbers spelt')
    shares, matched = align(['um', 'neun', 'Uhr.'], [(0.0, 0.2, ' um'), (0.3, 0.6, ' 9'), (0.7, 0.9, ' Uhr')], 1.0)
    check(matched == 3 and shares == [0, 0.3, 0.7], f'a digit heard for a number word {shares} {matched}')
    shares, matched = align(['um', '20', 'Uhr.'], [(0.0, 0.2, ' um'), (0.3, 0.6, ' zwanzig'), (0.7, 0.9, ' Uhr')], 1.0)
    check(matched == 3 and shares[1] == 0.3, 'a number word heard for digits')
    # a batch: heard words go back to their clips by time
    heard = [(0.1, 0.4, ' Hallo'), (0.5, 0.9, ' Welt'), (2.3, 2.6, ' Guten'), (2.7, 3.0, ' Tag')]
    check([t for _, _, t in clip_words(heard, 0.0, 1.5)] == [' Hallo', ' Welt'], 'first clip of a batch')
    check([(round(s, 3), round(e, 3), t) for s, e, t in clip_words(heard, 2.1, 1.0)] == [(0.2, 0.5, ' Guten'), (0.6, 0.9, ' Tag')], 'second clip, times from its start')
    print(json.dumps({'self_test': 'ok'}))


if __name__ == '__main__':
    if '--self-test' in sys.argv[1:]:
        self_test()
    else:
        sys.exit('usage: word_times.py --self-test (the measuring runs inside make-voices.py)')
