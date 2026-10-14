'use client';
import {Volume2,Square,ChevronDown} from 'lucide-react';
import {chooseGermanVoice,germanSpeechPreview,defaultSpeechRate} from '@/lib/german-speech';
import {vaultText,type VaultLanguage,type VaultCopyKey} from '@/lib/object-vault-copy';
import {effectsText} from '@/lib/effects-copy';
import {DEFAULT_SITE_VOICE} from '@/lib/site-voices';
import type {useGermanSpeech} from './study-shared';

export function GermanSpeechSettings({speech,language,disabled=false}:{speech:ReturnType<typeof useGermanSpeech>;language:VaultLanguage;disabled?:boolean}){
 const text=(key:VaultCopyKey)=>vaultText(language,key);
 const known=speech.voices.some(v=>v.name===speech.voiceName)||speech.siteVoices.some(v=>v.id===speech.voiceName);
 const selected=known?speech.voiceName:'';
 const voices=[...speech.voices].sort((a,b)=>a.name.localeCompare(b.name));
 const site=speech.siteVoices.find(v=>v.id===DEFAULT_SITE_VOICE)??speech.siteVoices[0];
 const automatic=site?site.name:chooseGermanVoice(speech.voices)?.name;
 const gender=(value:'female'|'male')=>effectsText(language,value==='female'?'voiceFemale':'voiceMale');
 const comfortable=String(defaultSpeechRate('de'));
 return <details className="vault-speech-settings">
  <summary><Volume2 size={18}/>{text('speechSettings')}<ChevronDown className="vault-speech-chevron" size={16} aria-hidden="true"/></summary>
  <div className="vault-speech-controls">
   <label>{text('speechVoice')}<select className="native-select" value={selected} disabled={disabled} onChange={e=>speech.setVoiceName(e.target.value)}>
    <option value="">{text('speechNatural')}{automatic?' · '+automatic:''}</option>
    {speech.siteVoices.length>0&&<optgroup label={effectsText(language,'voiceSiteGroup')}>{speech.siteVoices.map(voice=><option key={voice.id} value={voice.id}>{voice.name} · {gender(voice.gender)}</option>)}</optgroup>}
    {voices.length>0&&<optgroup label={effectsText(language,'voiceDeviceGroup')}>{voices.map(voice=><option key={voice.name+'-'+voice.lang} value={voice.name}>{voice.name}</option>)}</optgroup>}
   </select></label>
   <label>{text('speechPace')}<select className="native-select" value={speech.rate} disabled={disabled} onChange={e=>speech.setRate(e.target.value)}>
    <option value="0.65">{text('speechSlow')}</option><option value={comfortable}>{text('speechComfortable')}</option><option value="1">{text('speechNormal')}</option>
    {!['0.65',comfortable,'1'].includes(speech.rate)&&<option value={speech.rate}>{speech.rate}×</option>}
   </select></label>
   <div className="vault-speech-actions">
    <button type="button" className="btn secondary small" disabled={disabled||speech.busy} onClick={()=>speech.speak(germanSpeechPreview)}><Volume2 size={17}/>{text('speechPreview')}</button>
    {speech.busy&&<button type="button" className="btn secondary small" onClick={speech.stop}><Square size={16}/>{text('speechStop')}</button>}
   </div>
  </div>
  <div className="vault-speech-example"><p lang="de" dir="ltr">{germanSpeechPreview}</p>{language!=='de'&&<p lang={language}>{text('speechPreviewMeaning')}</p>}</div>
  <p className="tiny muted">{text('speechHint')}</p>
 </details>;
}
