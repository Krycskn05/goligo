'use client';
import type {ReactNode} from 'react';
import {ArrowRight,CheckCircle2,Volume2,X} from 'lucide-react';
import {verbMeaning,perfektLabel,type Verb} from '@/lib/verb-course';
import {familyRule,familyTitle,type VerbFamily} from '@/lib/verb-families';
import {sentenceChunks,sentenceText,verbRules,verbPrefix,verbPicture,type VerbTense} from '@/lib/verb-logic';
import {type LearnStage,type PathPlace,type WorkshopStep} from '@/lib/verb-workshop';
import {personSentences,personMode,personLabel,conjugationRows,learnSpeech,type PersonKey,type PersonTense} from '@/lib/verb-persons';
import {verbText,type VerbCopyKey} from '@/lib/verb-copy';
import {vaultDirection,type VaultLanguage} from '@/lib/object-vault-copy';
import {VerbPicture,RuleBox} from './verb-games';

type Speech={speak:(text:string)=>void;busy:boolean};
const stepLabels:Record<WorkshopStep,VerbCopyKey>={meaning:'stepMeaning',write:'stepSpelling',perfekt:'stepPerfekt','write-perfekt':'stepSpelling'};

/** One example sentence with the verb parts highlighted and a speaker button (kept for the later sentence practice). */
export function ExampleSentence({verb,tense,speech,label}:{verb:Verb;tense:VerbTense;speech:Speech;label?:string}){
 const text=sentenceText(verb,tense);
 return <div className="verb-example">{label&&<small>{label}</small>}<p lang="de" dir="ltr">{sentenceChunks(verb,tense).map((chunk,i)=><span key={i} className={'verb-chunk '+(chunk.role==='subject'||chunk.role==='middle'?'':'mark '+chunk.role)}>{chunk.text}</span>)}.</p><button type="button" className="verb-speak" disabled={speech.busy} aria-label={text} title={text} onClick={()=>speech.speak(text)}><Volume2 size={17}/></button></div>;
}
/** The Präsens forms of the verb for every person, singular on the left, plural on the right; tap a form to hear it. */
export function ConjugationTable({verb,language,speech}:{verb:Verb;language:VaultLanguage;speech:Speech}){
 // The spoken texts come from the lib, so each one has a natural site-voice clip.
 const rows=conjugationRows(verb);
 return <div className="verb-conj" data-verb-conjugation={verb.id}>
  <small lang={language} dir={vaultDirection(language)}>{verbText(language,'conjugationTitle')}</small>
  <div className="verb-conj-grid" lang="de" dir="ltr">{rows.map(({pronoun,form,spoken})=><button type="button" key={pronoun} className="verb-conj-cell" disabled={speech.busy} aria-label={spoken} onClick={()=>speech.speak(spoken)}><span className="verb-conj-pronoun">{pronoun}</span><span className="verb-conj-form">{form}</span><Volume2 size={15} aria-hidden="true"/></button>)}</div>
 </div>;
}
/** After an answer: one example sentence for every person (ich … Sie), Präsens or Perfekt; tap a sentence to hear it. */
export function PersonSentences({verb,tense,language,speech}:{verb:Verb;tense:PersonTense;language:VaultLanguage;speech:Speech}){
 const rows=personSentences(verb,tense);const mode=personMode(verb);const dir=vaultDirection(language);
 if(!rows.length)return null;
 const hint=(person:PersonKey)=>person==='sie-plural'?verbText(language,'pronounPlural'):person==='Sie'?verbText(language,'pronounFormal'):'';
 return <div className="verb-persons" data-verb-persons={verb.id+':'+tense}>
  <small lang={language} dir={dir}>{verbText(language,'examplesTitle',{t:tense==='perfekt'?'Perfekt':'Präsens'})}</small>
  <ul lang="de" dir="ltr">{rows.map(row=><li key={row.person}><button type="button" className="verb-person-row" disabled={speech.busy} aria-label={row.text} onClick={()=>speech.speak(row.text)}>
   <span className="verb-person-pronoun">{personLabel(row.person)}{hint(row.person)&&<small lang={language} dir={dir}>{hint(row.person)}</small>}</span>
   <span className="verb-person-text">{row.parts.flatMap((part,i)=>[i?' ':null,<span key={i} className={part.role==='plain'?undefined:'mark '+part.role}>{part.text}</span>])}.</span>
   <Volume2 size={15} aria-hidden="true"/>
  </button></li>)}</ul>
  {mode!=='subject'&&<p className="verb-persons-note" lang={language} dir={dir}>{verbText(language,mode==='dative'?'personDative':'personFuer')}</p>}
 </div>;
}
/** The card shown before the questions of a stage: meaning, Präsens or Perfekt of one verb. */
export function LearnCard({verb,stage,language,speech,onContinue}:{verb:Verb;stage:LearnStage;language:VaultLanguage;speech:Speech;onContinue:()=>void}){
 const t=(key:VerbCopyKey,params?:Record<string,string|number>)=>verbText(language,key,params);
 const dir=vaultDirection(language);const prefix=verbPrefix(verb);
 const form=stage==='praesens'?verb.praesens:stage==='perfekt'?perfektLabel(verb):verb.display;
 const spoken=learnSpeech(verb,stage);
 const title=stage==='meaning'?t('learnNew'):stage==='praesens'?t('stepPraesens'):t('stepPerfekt');
 return <article className={'verb-learn panel stage-'+stage} aria-labelledby="verb-learn-heading" data-verb-learn={stage}>
  <p className="verb-learn-kicker">{title}</p>
  <div className="verb-learn-body">
   <VerbPicture verb={verb} language={language}/>
   <div className="verb-learn-text">
    {stage!=='meaning'&&<p className="verb-learn-infinitive" lang="de" dir="ltr">{verb.display}</p>}
    <div className="verb-learn-title"><h1 id="verb-learn-heading" tabIndex={-1} className="verb-learn-form" lang="de" dir="ltr">{stage==='meaning'?verb.display:<><span className="verb-learn-subject">{verb.subject}</span> {form}</>}</h1><button type="button" className="verb-learn-speak" disabled={speech.busy} aria-label={spoken} title={spoken} onClick={()=>speech.speak(spoken)}><Volume2 size={20}/></button></div>
    <p className="verb-learn-meaning" lang={language} dir={dir}>{verbMeaning(verb,language)}</p>
    {stage==='meaning'&&prefix&&<p className="verb-learn-note">{t('separableNote',{p:prefix})}</p>}
   </div>
  </div>
  {/* No example sentences while learning; the meaning card shows the Präsens forms for every person instead. */}
  {stage==='meaning'?<ConjugationTable verb={verb} language={language} speech={speech}/>:<RuleBox lines={verbRules(verb,stage,language)} language={language}/>}
  {stage==='perfekt'&&verb.alsoIst&&<p className="verb-note">{t('liegenNote')}</p>}
  <button type="button" className="btn verb-learn-next" onClick={onContinue}>{t('gotIt')}<ArrowRight size={18} className="vault-direction-icon"/></button>
 </article>;
}
/** After a test answer, in one card that fits a phone screen: the picture and the verb at the top (tap the speaker to hear it again), right or wrong, then one example sentence per person. */
export function AnswerResult({verb,stage,language,speech,correct,status,chosen,spoken,note,nextLabel,onNext,busy}:{verb:Verb;stage:LearnStage;language:VaultLanguage;speech:Speech;correct:boolean;status:string;chosen?:ReactNode;spoken:string;note?:string;nextLabel:string;onNext:()=>void;busy:boolean}){
 const dir=vaultDirection(language);
 const form=stage==='perfekt'?verb.subject+' '+perfektLabel(verb):stage==='praesens'?verb.subject+' '+verb.praesens:'';
 return <div id="object-feedback" tabIndex={-1} className={'verb-result '+(correct?'success':'retry')} role="status" aria-live="polite" data-verb-result={stage}>
  <div className="verb-result-head">
   <VerbPicture verb={verb} language={language}/>
   <div className="verb-result-text">
    <p className={'verb-result-status '+(correct?'right':'wrong')}>{correct?<CheckCircle2 size={18}/>:<X size={18}/>}{status}</p>
    <div className="verb-result-title"><strong lang="de" dir="ltr">{form||verb.display}</strong><button type="button" className="verb-result-speak" disabled={speech.busy} aria-label={spoken} title={spoken} onClick={()=>speech.speak(spoken)}><Volume2 size={18}/></button></div>
    <span className="verb-result-meaning">{form&&<b className="verb-result-infinitive" lang="de" dir="ltr">{verb.display} · </b>}<span lang={language} dir={dir}>{verbMeaning(verb,language)}</span></span>
    {chosen&&<span className="verb-result-chosen">{chosen}</span>}
   </div>
  </div>
  <PersonSentences verb={verb} tense={stage==='perfekt'?'perfekt':'praesens'} language={language} speech={speech}/>
  {note&&<p className="verb-note">{note}</p>}
  <button type="button" className="btn object-next verb-result-next" disabled={busy} onClick={onNext}>{nextLabel}<ArrowRight size={18} className="vault-direction-icon"/></button>
 </div>;
}
/** The card that opens a stage of a part: what comes now (the meanings, or the Perfekt forms) and the verbs that follow. */
export function ChapterCard({family,stage,verbs,language,onContinue}:{family:VerbFamily;stage:LearnStage;verbs:readonly Verb[];language:VaultLanguage;onContinue:()=>void}){
 const t=(key:VerbCopyKey,params?:Record<string,string|number>)=>verbText(language,key,params);
 const perfekt=stage==='perfekt';
 return <article className={'verb-chapter panel tone-'+family.tone} aria-labelledby="verb-chapter-heading" data-verb-chapter={family.id} data-verb-stage={stage}>
  <p className="verb-learn-kicker">{t('chapterOf',{n:family.number})} · {t('verbsCount',{n:verbs.length})}</p>
  <h1 id="verb-chapter-heading" tabIndex={-1}><span lang="de" dir="ltr">{familyTitle(family,language)}</span> · {perfekt?t('stepPerfekt'):t('stageMeanings')}</h1>
  <p className="verb-chapter-rule">{perfekt?t('perfektChapter'):familyRule(family,language)}</p>
  <ul className="verb-chapter-verbs">{verbs.map(verb=><li key={verb.id}>{verbPicture(verb)&&<img src={verbPicture(verb)!} alt="" width={96} height={96} loading="lazy" decoding="async"/>}<span lang="de" dir="ltr">{verb.display}</span>{perfekt&&<small lang="de" dir="ltr">{verb.subject} {perfektLabel(verb)}</small>}</li>)}</ul>
  <button type="button" className="btn verb-learn-next" onClick={onContinue}>{t('chapterStart')}<ArrowRight size={18} className="vault-direction-icon"/></button>
 </article>;
}
/** Where the learner is on the path: the verb and the steps of its current stage. */
export function PathStepper({place,language}:{place:PathPlace;language:VaultLanguage}){
 const t=(key:VerbCopyKey,params?:Record<string,string|number>)=>verbText(language,key,params);
 return <div className="verb-stepper" data-verb-step={place.step} data-verb-stage={place.stage}>
  <div className="verb-stepper-head"><span className="verb-stepper-verb" lang="de" dir="ltr">{place.verb.display}</span><span className="verb-stepper-count">{place.stage==='perfekt'?t('stepPerfekt'):t('stageMeanings')} · {t('verbOf',{n:place.verbNumber,total:place.family.verbs.length})}</span></div>
  <ol className="verb-stepper-steps" style={{gridTemplateColumns:'repeat('+place.steps.length+',minmax(0,1fr))'}}>{place.steps.map((step,i)=><li key={step} className={i<place.step?'done':i===place.step?'current':''} aria-current={i===place.step?'step':undefined}><span className="verb-stepper-dot"/><span className="verb-stepper-label">{t(stepLabels[step])}</span></li>)}</ol>
 </div>;
}
