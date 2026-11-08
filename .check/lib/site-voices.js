"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VOICE_PREFERENCE_VERSION = exports.SITE_CLIP_BASE_RATE = exports.DEFAULT_SITE_VOICE = exports.siteVoices = exports.SITE_VOICE_PREFIX = void 0;
exports.voiceGroups = voiceGroups;
exports.voiceGreeting = voiceGreeting;
exports.isSiteVoice = isSiteVoice;
exports.siteVoiceById = siteVoiceById;
exports.savedVoiceName = savedVoiceName;
exports.normalizeSpeechText = normalizeSpeechText;
exports.parseVoiceManifest = parseVoiceManifest;
exports.parseWordTimes = parseWordTimes;
exports.currentVoiceManifest = currentVoiceManifest;
exports.setVoiceManifest = setVoiceManifest;
exports.onVoiceManifest = onVoiceManifest;
exports.loadVoiceManifest = loadVoiceManifest;
exports.availableSiteVoices = availableSiteVoices;
exports.resolveSiteVoice = resolveSiteVoice;
exports.siteClipUrl = siteClipUrl;
exports.siteClipUrls = siteClipUrls;
exports.voiceSample = voiceSample;
exports.clipPlaybackRate = clipPlaybackRate;
exports.clipWordTimes = clipWordTimes;
exports.warmClip = warmClip;
exports.clipSource = clipSource;
exports.createClipPlayer = createClipPlayer;
/**
 * Natural "site voices": every German text the site speaks is pre-rendered by
 * scripts/voices (Supertonic 3 preset voices) and served from /voices.
 * When a clip or the manifest is missing, speech falls back to the device voice.
 */
exports.SITE_VOICE_PREFIX = 'site:';
/** The voices carry the names of the people of Lektion 1A (the learner asked, 25 October 2026): the voice that
 * reads Sabine in the lesson is called Sabine in the settings too (lib/willkommen-course.ts `speakers`), and shows
 * her picture. Ids and styles never change, so a saved choice (for example site:F4) keeps working. */
const portrait = (name) => '/toon/lektion1/' + name.toLowerCase() + '.webp';
exports.siteVoices = [
    { id: 'site:F1', style: 'F1', name: 'Sabine', gender: 'female', picture: portrait('Sabine') },
    { id: 'site:F2', style: 'F2', name: 'Yasemin', gender: 'female', picture: portrait('Yasemin') },
    { id: 'site:F3', style: 'F3', name: 'Aisha', gender: 'female', picture: portrait('Aisha') },
    { id: 'site:F4', style: 'F4', name: 'Nora', gender: 'female', picture: portrait('Nora') },
    { id: 'site:F5', style: 'F5', name: 'Mei', gender: 'female', picture: portrait('Mei') },
    { id: 'site:M1', style: 'M1', name: 'Rami', gender: 'male', picture: portrait('Rami') },
    { id: 'site:M2', style: 'M2', name: 'Omar', gender: 'male', picture: portrait('Omar') },
    { id: 'site:M3', style: 'M3', name: 'Paul', gender: 'male', picture: portrait('Paul') },
    { id: 'site:M4', style: 'M4', name: 'Nikos', gender: 'male', picture: portrait('Nikos') },
    { id: 'site:M5', style: 'M5', name: 'Tomasz', gender: 'male', picture: portrait('Tomasz') },
];
/** The voice choice shows women and men apart (the learner asked, 25 October 2026): women first, then men. */
function voiceGroups(list) {
    return ['female', 'male'].map(gender => ({ gender, voices: list.filter(voice => voice.gender === gender) })).filter(group => group.voices.length > 0);
}
exports.DEFAULT_SITE_VOICE = 'site:F1';
/** Each site voice introduces itself when it is chosen in the settings. */
function voiceGreeting(voice) { return `Hallo, ich bin ${voice.name}. Lass uns zusammen Deutsch lernen!`; }
/** Clips are rendered at a calm pace; the "comfortable" speed plays them unchanged. */
exports.SITE_CLIP_BASE_RATE = 0.94;
function isSiteVoice(name) { return typeof name === 'string' && name.startsWith(exports.SITE_VOICE_PREFIX); }
function siteVoiceById(id) { return exports.siteVoices.find(voice => voice.id === id); }
/** Preferences saved since the natural site voices arrived carry this version. German offers only
 * the natural site voices now (the learner asked to drop the "Cihaz sesi" choice): a saved German
 * device-voice choice (for example "Helena") is dropped, so the learner hears the default site voice.
 * The device voice stays only as the silent fallback when a natural clip cannot play. */
exports.VOICE_PREFERENCE_VERSION = 2;
function savedVoiceName(saved, course) {
    if (!saved || typeof saved !== 'object')
        return '';
    const { voiceName, voices } = saved;
    if (typeof voiceName !== 'string')
        return '';
    void voices;
    return course !== 'de' || isSiteVoice(voiceName) ? voiceName : '';
}
/** The same normalisation is used when the clips are rendered and when they are looked up. */
function normalizeSpeechText(text) { return text.replace(/\s+/g, ' ').trim(); }
function parseVoiceManifest(value) {
    if (!value || typeof value !== 'object')
        return null;
    const data = value;
    if (!Array.isArray(data.voices) || !data.clips || typeof data.clips !== 'object')
        return null;
    const voices = data.voices.filter((style) => typeof style === 'string' && /^[A-Z][0-9]$/.test(style));
    const clips = {};
    for (const [text, id] of Object.entries(data.clips))
        if (typeof id === 'string' && /^[a-f0-9]{8,40}$/.test(id))
            clips[normalizeSpeechText(text)] = id;
    const times = Array.isArray(data.times) ? data.times.filter((style) => typeof style === 'string' && /^[A-Z][0-9]$/.test(style)) : [];
    return { version: Number(data.version) || 0, settings: typeof data.settings === 'string' ? data.settings : undefined, voices, clips, times };
}
function parseWordTimes(value) {
    const table = {};
    if (!value || typeof value !== 'object')
        return table;
    for (const [id, starts] of Object.entries(value)) {
        if (!/^[a-f0-9]{8,40}$/.test(id) || !Array.isArray(starts) || !starts.length)
            continue;
        if (starts.every(start => typeof start === 'number' && Number.isFinite(start) && start >= 0 && start <= 1))
            table[id] = starts;
    }
    return table;
}
const timesTables = new Map();
const timesLoading = new Map();
let manifest = null;
let loading = null;
const listeners = new Set();
function currentVoiceManifest() { return manifest; }
function setVoiceManifest(value) { manifest = value; timesTables.clear(); timesLoading.clear(); listeners.forEach(listener => listener(value)); }
function onVoiceManifest(listener) { listeners.add(listener); return () => { listeners.delete(listener); }; }
function loadVoiceManifest(fetcher = fetch) {
    if (manifest)
        return Promise.resolve(manifest);
    if (!loading)
        loading = fetcher('/voices/manifest.json', { cache: 'no-cache' })
            .then(response => response.ok ? response.json() : null)
            .then(data => { const parsed = parseVoiceManifest(data); setVoiceManifest(parsed); if (!parsed)
            loading = null; return parsed; })
            .catch(() => { loading = null; return null; });
    return loading;
}
/** Site voices whose clips are actually available. */
function availableSiteVoices(value = manifest) { return value ? exports.siteVoices.filter(voice => value.voices.includes(voice.style)) : []; }
/** The site voice to use for a stored preference: an explicit site voice, or the default when "automatic". */
function resolveSiteVoice(preference, value = manifest) {
    const available = availableSiteVoices(value);
    if (isSiteVoice(preference))
        return available.find(voice => voice.id === preference);
    if (preference === '')
        return available.find(voice => voice.id === exports.DEFAULT_SITE_VOICE) ?? available[0];
    return undefined;
}
function siteClipUrl(voice, text, value = manifest) {
    const id = value?.clips[normalizeSpeechText(text)];
    return id && value?.voices.includes(voice.style) ? `/voices/${voice.style}/${id}.mp3` : null;
}
/** The clips to try for a text, in order: the chosen voice, then another voice of the same kind (a man stays a
 * man, a woman a woman), then the default voice. New texts are rendered voice by voice, so while one voice is
 * still missing a clip another natural voice plays it; the device voice (silent on some phones) is the very last fallback. */
function siteClipUrls(preference, text, value = manifest) {
    const voice = resolveSiteVoice(preference, value);
    const id = value?.clips[normalizeSpeechText(text)];
    if (!voice || !id || !value)
        return [];
    const others = availableSiteVoices(value).filter(other => other.id !== voice.id);
    const backups = [others.find(other => other.gender === voice.gender), others.find(other => other.id === exports.DEFAULT_SITE_VOICE)];
    const chain = [voice, ...backups.filter((item) => !!item)].filter((item, index, list) => list.indexOf(item) === index);
    return chain.map(item => `/voices/${item.style}/${id}.mp3`);
}
/** What a voice says when it is chosen or previewed: its greeting when that clip exists (or while the clip list is
 * still unknown), otherwise `fallback` — a sentence that has a clip — so a renamed voice is never read by the device voice. */
function voiceSample(voice, fallback, value = manifest) {
    const greeting = voiceGreeting(voice);
    return !value || siteClipUrls(voice.id, greeting, value).length ? greeting : fallback;
}
function clipPlaybackRate(rate) {
    const value = rate / exports.SITE_CLIP_BASE_RATE;
    return Number.isFinite(value) ? Math.max(0.5, Math.min(1.3, value)) : 1;
}
const clipAddress = /^\/voices\/([A-Z][0-9])\/([a-f0-9]{8,40})\.mp3$/;
/** Read-along by word (lib/read-along.ts `measuredTimeline`): the measured word starts of a clip, when its voice is in the
 * manifest's `times`. A voice's times.json is fetched once, when its first clip is asked for, and kept for the page (the
 * manifest's version in the address, so a new deploy is not read from the cache); a voice without one costs no request.
 * A known table answers at once (the starts, or null), a table still loading answers with a promise. */
function clipWordTimes(url, value = manifest, fetcher = fetch) {
    const found = clipAddress.exec(url);
    if (!found || !value || !value.times?.includes(found[1]) || typeof fetcher !== 'function')
        return null;
    const [, style, id] = found;
    const table = timesTables.get(style);
    if (table)
        return table[id] ?? null;
    let pending = timesLoading.get(style);
    if (!pending) {
        pending = fetcher(`/voices/${style}/times.json?v=${value.version}`).then(response => response.ok ? response.json() : null).then(parseWordTimes).catch(() => ({}))
            .then(parsed => { timesTables.set(style, parsed); timesLoading.delete(style); return parsed; });
        timesLoading.set(style, pending);
    }
    return pending.then(parsed => parsed[id] ?? null);
}
/** Clips that are on the page are loaded before the tap (the learner heard late voices, 30 October 2026): a few at a
 * time, each once, kept in memory; the player then plays the loaded copy instead of downloading first. */
const loadedClips = new Map();
const wantedClips = new Set();
const clipQueue = [];
let clipsLoading = 0;
function warmClip(url) {
    if (!url || wantedClips.has(url) || typeof fetch !== 'function' || typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function')
        return;
    wantedClips.add(url);
    clipQueue.push(url);
    pumpClips();
    void clipWordTimes(url); // the voice's word times come along with its first clip, before the tap
}
function pumpClips() {
    while (clipsLoading < 3 && clipQueue.length) {
        const url = clipQueue.shift();
        clipsLoading++;
        void fetch(url).then(response => response.ok ? response.blob() : null).then(blob => {
            if (!blob || !blob.size)
                return;
            if (loadedClips.size >= 200) {
                const oldest = loadedClips.keys().next().value;
                const copy = loadedClips.get(oldest);
                loadedClips.delete(oldest);
                wantedClips.delete(oldest);
                if (copy)
                    setTimeout(() => URL.revokeObjectURL(copy), 60000);
            }
            loadedClips.set(url, URL.createObjectURL(blob));
        }).catch(() => { wantedClips.delete(url); }).finally(() => { clipsLoading--; pumpClips(); });
    }
}
/** The loaded copy of a clip, or the clip's own address. */
function clipSource(url) { return loadedClips.get(url) ?? url; }
// 50 ms of silence: playing it inside a tap lets the same element play the
// answer later, after the sound effect (needed on iPhone and iPad).
const SILENCE = 'data:audio/wav;base64,UklGRrQBAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YZABAACA' + 'gICA'.repeat(133);
function createClipPlayer(createAudio = () => new Audio()) {
    let element = null;
    let token = 0;
    const media = () => {
        if (!element) {
            element = createAudio();
            element.preload = 'auto';
            try {
                element.setAttribute('playsinline', '');
            }
            catch { }
        }
        return element;
    };
    let ticker = null;
    const stopTicking = () => { if (ticker !== null) {
        clearInterval(ticker);
        ticker = null;
    } };
    const detach = (audio) => { stopTicking(); audio.onplaying = null; audio.onended = null; audio.onerror = null; };
    return {
        unlock() {
            const audio = media();
            if (!audio.paused)
                return;
            try {
                detach(audio);
                audio.muted = true;
                audio.src = SILENCE;
                const started = audio.play();
                if (started)
                    void started.then(() => { if (audio.src === SILENCE) {
                        audio.pause();
                        audio.muted = false;
                    } }, () => { audio.muted = false; });
            }
            catch {
                audio.muted = false;
            }
        },
        play(url, rate, events, speed = 1) {
            const audio = media();
            const mine = ++token;
            detach(audio);
            try {
                audio.pause();
            }
            catch { }
            audio.muted = false;
            audio.src = clipSource(url);
            const pitch = audio;
            try {
                pitch.preservesPitch = true;
                pitch.webkitPreservesPitch = true;
                pitch.mozPreservesPitch = true;
            }
            catch { }
            // speed: a listening player's 0.5×–2× on top of the reading rate.
            audio.playbackRate = clipPlaybackRate(rate) * (Number.isFinite(speed) ? Math.max(0.5, Math.min(2, speed)) : 1);
            audio.defaultPlaybackRate = audio.playbackRate;
            audio.onplaying = () => {
                if (mine !== token)
                    return;
                events.onStart();
                // Read-along by word: how far the clip is, a few times a second, while it plays.
                const progress = events.onProgress;
                if (!progress)
                    return;
                stopTicking();
                ticker = setInterval(() => { if (mine !== token) {
                    stopTicking();
                    return;
                } const { currentTime, duration } = audio; if (Number.isFinite(duration) && duration > 0)
                    progress(currentTime / duration); }, 70);
                ticker.unref?.();
            };
            audio.onended = () => { if (mine === token) {
                detach(audio);
                events.onEnd();
            } };
            audio.onerror = () => { if (mine === token) {
                detach(audio);
                events.onError();
            } };
            try {
                const started = audio.play();
                if (started)
                    void started.catch(() => { if (mine === token) {
                        detach(audio);
                        events.onError();
                    } });
            }
            catch {
                if (mine === token) {
                    detach(audio);
                    events.onError();
                }
            }
        },
        stop() { token++; if (element) {
            detach(element);
            try {
                element.pause();
            }
            catch { }
        } },
        // Still downloading the clip (a slow connection), not yet able to play: the chosen voice gets a little more time.
        loading() { const audio = element; return !!audio && !!audio.src && audio.src !== SILENCE && audio.networkState === 2 && audio.readyState < 3; },
    };
}
