"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultEffects = exports.LEARNING_REACTION = exports.EFFECTS_CHANGED = exports.EFFECTS_KEY = exports.SOUND_FOLDER = void 0;
exports.soundUrl = soundUrl;
exports.warmEffects = warmEffects;
exports.normalizeEffects = normalizeEffects;
exports.readEffects = readEffects;
exports.saveEffects = saveEffects;
exports.motionAllowed = motionAllowed;
exports.learningReaction = learningReaction;
exports.prepareEffects = prepareEffects;
exports.canPlayEffects = canPlayEffects;
exports.stopAllEffects = stopAllEffects;
exports.playLearningSound = playLearningSound;
const effect_sounds_1 = require("./effect-sounds");
/** Generated at build time by scripts/sounds/make-sounds.mjs. */
exports.SOUND_FOLDER = '/sfx/';
function soundUrl(id) { return exports.SOUND_FOLDER + id + '.wav'; }
let warmed = false;
/** Fetch every effect once (after the first tap) so later sounds start instantly. */
function warmEffects() {
    if (warmed || typeof window === 'undefined' || typeof fetch !== 'function')
        return;
    warmed = true;
    for (const id of Object.keys(effect_sounds_1.soundRecipes))
        void fetch(soundUrl(id)).catch(() => { });
}
const audio_session_1 = require("./audio-session");
exports.EFFECTS_KEY = 'lernkoko-effects-v1';
exports.EFFECTS_CHANGED = 'lernkoko-effects-changed';
exports.LEARNING_REACTION = 'lernkoko-learning-reaction';
exports.defaultEffects = { enabled: true, motion: true, volume: .65, wrong: 'soft', tap: 'tap', page: 'whoosh', correct: 'correct', complete: 'complete' };
const pick = (list, value, fallback) => list.includes(value) ? value : fallback;
function normalizeEffects(value) {
    const data = value && typeof value === 'object' ? value : {};
    return { enabled: typeof data.enabled === 'boolean' ? data.enabled : exports.defaultEffects.enabled, motion: typeof data.motion === 'boolean' ? data.motion : exports.defaultEffects.motion, volume: typeof data.volume === 'number' && Number.isFinite(data.volume) ? Math.min(1, Math.max(0, data.volume)) : exports.defaultEffects.volume, wrong: pick(effect_sounds_1.wrongSoundIds, data.wrong, exports.defaultEffects.wrong), tap: pick(effect_sounds_1.tapChoiceIds, data.tap, exports.defaultEffects.tap), page: pick(effect_sounds_1.pageSoundIds, data.page, exports.defaultEffects.page), correct: pick(effect_sounds_1.correctSoundIds, data.correct, exports.defaultEffects.correct), complete: pick(effect_sounds_1.completeSoundIds, data.complete, exports.defaultEffects.complete) };
}
let memory = { ...exports.defaultEffects };
function readEffects() {
    if (typeof window === 'undefined')
        return { ...exports.defaultEffects };
    try {
        const saved = window.localStorage.getItem(exports.EFFECTS_KEY);
        if (saved)
            memory = normalizeEffects(JSON.parse(saved));
    }
    catch { }
    return { ...memory };
}
function saveEffects(value) {
    memory = normalizeEffects(value);
    try {
        window.localStorage.setItem(exports.EFFECTS_KEY, JSON.stringify(memory));
    }
    catch { }
    if (!memory.enabled || memory.volume === 0)
        stopAllEffects();
    window.dispatchEvent(new CustomEvent(exports.EFFECTS_CHANGED));
}
function motionAllowed() {
    return typeof window !== 'undefined' && readEffects().motion && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
function learningReaction(kind) {
    if (typeof window !== 'undefined')
        window.dispatchEvent(new CustomEvent(exports.LEARNING_REACTION, { detail: kind }));
}
let audio = null;
const active = new Set();
/** Ready audio elements per sound (the learner heard late taps, 30 October 2026): a new element for every tap had to
 * load first; a free ready one starts at once. A busy one is never taken over (a few per sound, then a fresh one). */
const ready = new Map();
function readyAudio(id) {
    const list = ready.get(id) ?? [];
    ready.set(id, list);
    const free = list.find(item => item.paused || item.ended);
    if (free) {
        try {
            free.currentTime = 0;
        }
        catch { }
        return free;
    }
    const media = new window.Audio(soundUrl(id));
    media.preload = 'auto';
    if (list.length < 3)
        list.push(media);
    return media;
}
/** Loads the chosen sounds once, inside the first tap, so the next ones play at once. */
let primed = false;
function primeSounds() {
    if (primed || typeof window === 'undefined' || typeof window.Audio !== 'function')
        return;
    primed = true;
    const chosen = readEffects();
    for (const id of [chosen.tap === 'tap' ? 'tap' : chosen.tap, chosen.page, chosen.correct, chosen.wrong, chosen.complete, 'paulDrum']) {
        if (!(id in effect_sounds_1.soundRecipes) || ready.get(id)?.length)
            continue;
        try {
            const media = new window.Audio(soundUrl(id));
            media.preload = 'auto';
            media.load?.();
            ready.set(id, [media]);
        }
        catch { }
    }
}
function prepareEffects() {
    if (typeof window === 'undefined')
        return null;
    (0, audio_session_1.configureAudioSession)();
    primeSounds();
    const Constructor = window.AudioContext ?? window.webkitAudioContext;
    if (!Constructor)
        return null;
    try {
        if (audio && String(audio.state) === 'interrupted') {
            void audio.close().catch(() => { });
            audio = null;
        }
        if (!audio || audio.state === 'closed')
            audio = new Constructor();
        if (audio.state === 'suspended')
            void audio.resume().catch(() => { });
        return audio;
    }
    catch {
        return null;
    }
}
function canPlayEffects() { return typeof window !== 'undefined' && !!(window.Audio || window.AudioContext || window.webkitAudioContext); }
function stopAllEffects() { [...active].forEach(stop => stop()); }
/** Audio starts only from a user gesture. Cancellation never invokes an answer callback. */
function playLearningSound(id, after, preview = false) {
    const preferences = readEffects();
    if (typeof window === 'undefined' || (!preferences.enabled && !preview) || preferences.volume === 0 || document.hidden) {
        after?.();
        return () => { };
    }
    (0, audio_session_1.configureAudioSession)();
    let finished = false;
    let media = null;
    let toneStarted = false;
    let timer;
    const nodes = [];
    const finish = (notify) => {
        if (finished)
            return;
        finished = true;
        if (timer !== undefined)
            clearTimeout(timer);
        active.delete(end);
        if (media) {
            media.onended = null;
            media.onerror = null;
            media.onplaying = null;
            try {
                media.pause();
            }
            catch { }
            media = null;
        }
        nodes.forEach(({ oscillator, gain }) => { oscillator.onended = null; try {
            oscillator.stop();
        }
        catch { } try {
            oscillator.disconnect();
            gain.disconnect();
        }
        catch { } });
        if (notify)
            after?.();
    };
    const stop = () => finish(false);
    const end = () => finish(true);
    active.add(end);
    const fallback = () => {
        if (finished)
            return;
        if (toneStarted)
            return;
        toneStarted = true;
        if (timer !== undefined)
            clearTimeout(timer);
        if (media) {
            media.onended = null;
            media.onerror = null;
            media.onplaying = null;
            try {
                media.pause();
            }
            catch { }
            media = null;
        }
        const context = prepareEffects();
        if (!context) {
            finish(true);
            return;
        }
        const schedule = () => {
            if (finished)
                return;
            if (context.state !== 'running') {
                finish(true);
                return;
            }
            try {
                const base = context.currentTime + .012;
                for (const note of effect_sounds_1.soundRecipes[id]) {
                    const oscillator = context.createOscillator(), gain = context.createGain();
                    const start = base + note.start, end = start + note.duration;
                    oscillator.type = note.type;
                    oscillator.frequency.setValueAtTime(note.f, start);
                    if (note.end)
                        oscillator.frequency.exponentialRampToValueAtTime(note.end, end);
                    gain.gain.setValueAtTime(.0001, start);
                    gain.gain.exponentialRampToValueAtTime(Math.max(.0001, note.gain * preferences.volume), start + .012);
                    gain.gain.exponentialRampToValueAtTime(.0001, end);
                    oscillator.connect(gain);
                    gain.connect(context.destination);
                    nodes.push({ oscillator, gain });
                    oscillator.start(start);
                    oscillator.stop(end + .008);
                }
                const last = nodes[effect_sounds_1.soundRecipes[id].reduce((index, note, i, notes) => note.start + note.duration > notes[index].start + notes[index].duration ? i : index, 0)];
                last.oscillator.onended = () => finish(true);
                if (timer !== undefined)
                    clearTimeout(timer);
                timer = setTimeout(() => finish(true), (0, effect_sounds_1.soundDuration)(id) * 1000 + 200);
            }
            catch {
                finish(true);
            }
        };
        timer = setTimeout(() => finish(true), 1200);
        if (context.state === 'running')
            schedule();
        else
            void context.resume().then(schedule, () => finish(true));
    };
    // Start the real uploaded clip directly in the tap. This remains independent
    // of a Web Audio context suspended by the app, silent mode or tab switching.
    if (typeof window.Audio === 'function') {
        try {
            media = readyAudio(id);
            media.volume = preferences.volume;
            const clip = media;
            // Ends on the clip's real length when it is known (the next voice is not kept waiting); otherwise on the recipe's.
            const playing = () => { if (finished || toneStarted)
                return; if (timer !== undefined)
                clearTimeout(timer); const length = Number.isFinite(clip.duration) && clip.duration > 0 ? clip.duration * 1000 + 250 : (0, effect_sounds_1.soundDuration)(id) * 1000 + 1200; timer = setTimeout(() => finish(true), length); };
            media.onplaying = playing;
            media.onended = () => finish(true);
            media.onerror = fallback;
            timer = setTimeout(fallback, 1000);
            const started = media.play();
            if (started)
                void started.then(playing, fallback);
        }
        catch {
            fallback();
        }
    }
    else
        fallback();
    return stop;
}
