import {configureAudioSession} from './audio-session';
import {isSiteVoice,type ClipPlayer} from './site-voices';
/** Pre-rendered natural clips (site voices); resolve gives the clip URLs to try in order (none: no clip). */
export type SpeechClips={player:ClipPlayer;resolve:(text:string,voiceName:string)=>string|readonly string[]|null};
export type SpeechPlayback = {
  status: 'idle' | 'loading' | 'speaking';
  text: string;
  warning: string;
};

export const idlePlayback: SpeechPlayback = {status: 'idle', text: '', warning: ''};
export const germanSpeechPreview='Hallo! Schön, dass du da bist. Wir lernen zusammen Deutsch. Ganz in Ruhe, Schritt für Schritt.';
export const defaultSpeechRate=(language:'de'|'en')=>language==='de'?0.94:0.85;
export function studyVoices(voices:SpeechSynthesisVoice[],language:'de'|'en'='de'){return voices.filter(voice=>new RegExp('^'+language+'(?:[-_]|$)','i').test(voice.lang));}
function germanVoiceScore(voice:SpeechSynthesisVoice){
 const name=(voice.name+' '+voice.voiceURI).toLowerCase();
 // Prefer the richer voices that the browser actually advertises. An explicit
 // learner choice always wins; unavailable online voices still fall back locally.
 const quality=/natural|neural|premium/.test(name)?400:/enhanced|erweitert/.test(name)?300:/siri/.test(name)?250:/google/.test(name)?200:!voice.localService?100:0;
 // Apple's Siri identifiers can advertise their richer voices without the
 // word "Enhanced". Within the same quality tier, favour these familiar
 // conversational German voices rather than synthetic/novelty variants.
 const conversational=/\b(katja|helena|petra|anna)\b/.test(name)?15:0;
 const novelty=/eloquence|novelty/.test(name)?-600:0;
 return quality+novelty+(/^de[-_]de$/i.test(voice.lang)?40:0)+conversational+(voice.default?5:0);
}
export function chooseStudyVoice(voices:SpeechSynthesisVoice[],language:'de'|'en'='de',name=''){
 const matches=studyVoices(voices,language);const locale=language==='de'?'de-DE':'en-GB';
 const selected=matches.find(v=>v.name===name);if(selected)return selected;
 if(language==='de')return [...matches].sort((a,b)=>germanVoiceScore(b)-germanVoiceScore(a))[0];
 return matches.find(v=>v.name===name)??matches.find(v=>v.localService&&v.lang.toLowerCase()===locale.toLowerCase())??matches.find(v=>v.localService)??matches.find(v=>v.lang.toLowerCase()===locale.toLowerCase())??matches[0];
}

export function germanVoices(voices: SpeechSynthesisVoice[]) {
  return voices.filter(voice => /^de(?:[-_]|$)/i.test(voice.lang));
}

export function chooseGermanVoice(voices: SpeechSynthesisVoice[], name = '') {
  return chooseStudyVoice(voices,'de',name);
}

// Keep short passages together for flowing intonation. Longer passages still
// split at sentence boundaries so device engines can finish reliably.
export function splitSpeechText(text: string, limit = 180) {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) return [];
  const parts: string[] = [];
  for (const sentence of normalized.replace(/([.!?])\s+/g, '$1\n').split('\n')) {
    let part = '';
    for (const word of sentence.split(' ')) {
      if (part && part.length + word.length + 1 > limit) {
        parts.push(part);
        part = '';
      }
      part += (part ? ' ' : '') + word;
    }
    if (part) parts.push(part);
  }
  const chunks:string[]=[];
  for(const part of parts){
    const last=chunks.length-1;
    if(last>=0&&chunks[last].length+part.length+1<=limit)chunks[last]+=' '+part;
    else chunks.push(part);
  }
  return chunks;
}

export function createGermanSpeechPlayer(
  synthesis: SpeechSynthesis,
  createUtterance: (text: string) => SpeechSynthesisUtterance,
  onChange: (playback: SpeechPlayback) => void,
  language:'de'|'en'='de',
  engineOptions:{cancelDelayMs?:number}={},
  clips?:SpeechClips,
) {
  let generation = 0;
  let playback = idlePlayback;
  let current: SpeechSynthesisUtterance | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let prepared = false;
  let cancelledAt:number|null=null;let unlockRequest:SpeechSynthesisUtterance|null=null;
  const cancelDelay=Math.max(0,Math.min(250,engineOptions.cancelDelayMs??0));
  function cancelEngine(){synthesis.cancel();cancelledAt=Date.now();}

  function clearTimer() {
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
  }

  function update(next: SpeechPlayback) {
    playback = next;
    onChange(next);
  }

  function stop(warning = '') {
    // Invalidate events before cancel(): browsers may dispatch them later.
    const needsCancel = current !== null || synthesis.speaking || synthesis.pending;
    generation++;
    clearTimer();
    current = null;
    clips?.player.stop();
    if (needsCancel) cancelEngine();
    update({...idlePlayback, warning});
  }

  function prepare() {
    configureAudioSession();
    // The natural-voice element is unlocked inside every tap as well.
    try { clips?.player.unlock(); } catch {}
    if (prepared || current || synthesis.speaking || synthesis.pending) return;
    // iOS grants speech permission on the first speak() inside a user gesture.
    // An effect's later onended callback is outside that gesture. Unlock here
    // with an empty, silent utterance; the real answer still waits for the cue.
    const unlock = createUtterance('');
    unlock.lang = language === 'de' ? 'de-DE' : 'en-GB';
    unlock.volume = 0;
    unlockRequest=unlock;
    const release=()=>{if(unlockRequest===unlock)unlockRequest=null;};
    unlock.onend=release;unlock.onerror=release;
    try {
      if (synthesis.paused) synthesis.resume();
      synthesis.speak(unlock);
      prepared = true;
    } catch {
      // Keep the normal player available to show its readable retry warning.
    }
  }

  /** `speed`: a listening player's 0.5×–2× on top of the reading rate (clips and the device voice alike). */
  function speak(text: string, options: {voiceName?: string; rate?: number; speed?: number} = {}) {
    configureAudioSession();
    stop();
    if (!text.trim()) return;
    const requestedRate=options.rate??defaultSpeechRate(language);
    const rate = Number.isFinite(requestedRate)?Math.max(0.5, Math.min(1.2, requestedRate)):defaultSpeechRate(language);
    const speed = options.speed !== undefined && Number.isFinite(options.speed) ? Math.max(0.5, Math.min(2, options.speed)) : 1;
    const found = clips ? clips.resolve(text, options.voiceName ?? '') : null;
    const urls = found == null ? [] : typeof found === 'string' ? [found] : found.filter(Boolean);
    if (urls.length) playClip(text, urls, rate, options, speed);
    else speakWithEngine(text, rate * speed, options.voiceName);
  }

  /** Natural site-voice clips: when one fails before it starts the next voice is tried; the device voice comes last. */
  function playClip(text: string, urls: readonly string[], rate: number, options: {voiceName?: string}, speed = 1) {
    const token = generation;
    let started = false;
    let attempt = 0;
    update({status: 'loading', text, warning: ''});
    const fallback = () => {
      if (token !== generation || started) return;
      clearTimer();
      clips?.player.stop();
      if (attempt + 1 < urls.length) { attempt++; tryClip(); return; }
      speakWithEngine(text, rate * speed, isSiteVoice(options.voiceName) ? '' : options.voiceName);
    };
    const tryClip = () => {
    clips!.player.play(urls[attempt], rate, {
      onStart: () => {
        if (token !== generation) return;
        started = true;
        clearTimer();
        update({status: 'speaking', text, warning: ''});
        timer = setTimeout(() => { if (token === generation) stop('Dinleme kesildi. Dinle düğmesine yeniden dokun.'); }, 60000 / speed);
      },
      onEnd: () => {
        if (token !== generation) return;
        clearTimer();
        update({...idlePlayback});
      },
      onError: () => {
        if (token !== generation) return;
        if (!started) { fallback(); return; }
        clearTimer();
        update({...idlePlayback});
      },
    }, speed);
    if (token === generation && !started) timer = setTimeout(fallback, 4000);
    };
    tryClip();
  }

  function speakWithEngine(text: string, rate: number, voiceName?: string) {
    const parts = splitSpeechText(text);
    if (!parts.length) { update({...idlePlayback}); return; }
    const token = generation;
    let index = 0;
    let retried = false;
    let voice = chooseStudyVoice(synthesis.getVoices(), language, isSiteVoice(voiceName) ? '' : voiceName ?? '');
    update({status: 'loading', text, warning: ''});

    function retryPart() {
      if (retried || token !== generation) return false;
      const local = chooseStudyVoice(studyVoices(synthesis.getVoices(), language).filter(candidate => candidate.localService && candidate !== voice), language);
      // With no advertised voice at all, another queued request cannot improve
      // the attempt. Otherwise a device-selected voice is a useful final fallback.
      if (!voice && !local) return false;
      retried = true;
      voice = local;
      clearTimer();
      current = null; // Ignore synchronous or late events from cancel().
      cancelEngine();
      update({status: 'loading', text, warning: ''});
      playPart();
      return true;
    }

    function playPart() {
      if (token !== generation) return;
      clearTimer();
      const wait=cancelledAt===null?0:cancelDelay-(Date.now()-cancelledAt);
      if(wait>0){timer=setTimeout(playPart,wait);return;}
      const utterance = createUtterance(parts[index]);
      current = utterance; // Keep a strong reference until end or cancellation.
      utterance.lang = language==='de'?'de-DE':'en-GB';
      if (voice) utterance.voice = voice;
      // If voices are still loading, let the device select a voice for de-DE.
      utterance.rate = rate;
      utterance.pitch = 1;
      utterance.volume = 1;
      const isCurrent = () => token === generation && current === utterance;
      utterance.onstart = () => {
        if (!isCurrent()) return;
        clearTimer();
        update({status: 'speaking', text, warning: ''});
        timer = setTimeout(() => {
          if (isCurrent()) stop('Dinleme kesildi. Dinle düğmesine yeniden dokun.');
        }, Math.max(30000, parts[index].length * 220 / rate));
      };
      utterance.onend = () => {
        if (!isCurrent()) return;
        clearTimer();
        current = null;
        index++;
        if (index < parts.length) playPart();
        else update({...idlePlayback});
      };
      utterance.onerror = event => {
        if (!isCurrent()) return;
        clearTimer();
        const recoverable = ['network', 'voice-unavailable', 'language-unavailable', 'synthesis-failed'].includes(event.error);
        if (recoverable && retryPart()) return;
        const warning = event.error === 'language-unavailable' || event.error === 'voice-unavailable'
          ? (language==='de'?'Almanca':'İngilizce')+' ses kullanılamıyor. Dinleme ayarlarından başka bir ses seçip yeniden dene.'
          : 'Ses çalınamadı. Ses seviyeni kontrol edip Dinle düğmesine yeniden dokun.';
        stop(warning);
      };
      timer = setTimeout(() => {
        if (!isCurrent()) return;
        if (retryPart()) return;
        stop('Ses başlamadı. Dinle düğmesine yeniden dokun; gerekirse dinleme ayarlarından sesi değiştir.');
      }, 7000);
      try {
        if (synthesis.paused) synthesis.resume();
        // Start from the button gesture, rather than waiting for voiceschanged.
        synthesis.speak(utterance);
      } catch {
        if (isCurrent()) stop('Ses başlatılamadı. Dinle düğmesine yeniden dokun.');
      }
    }

    playPart();
  }

  return {prepare,resetPreparation:()=>{prepared=false;},speak,stop:()=>stop(),isActive:()=>playback.status!=='idle'};
}
