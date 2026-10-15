'use client';
import {ArrowRight,Volume2} from 'lucide-react';
import {verbMeaning,perfektLabel,spokenSubject,type Verb} from '@/lib/verb-course';
import {familyRule,familyTitle,type VerbFamily} from '@/lib/verb-families';
import {sentenceChunks,sentenceText,verbRules,verbPrefix,verbPicture,type VerbTense} from '@/lib/verb-logic';
import {type LearnStage,type PathPlace,type WorkshopStep} from '@/lib/verb-workshop';
import {verbText,type VerbCopyKey} from '@/lib/verb-copy';
import {vaultDirection,type VaultLanguage} from '@/lib/object-vault-copy';
import {VerbPicture,RuleBox} from './verb-games';

type Speech={speak:(text:string)=>void;busy:boolean};
const stepLabels:Record<WorkshopStep,VerbCopyKey>={meaning:'stepMeaning',word:'stepPick',write:'stepSpelling',perfekt:'stepPerfekt','write-perfekt':'stepSpelling'};

/** One example sentence with the verb parts highlighted and a speaker button (kept for the later sentence practice). */
export function ExampleSentence({verb,tense,speech,label}:{verb:Verb;tense:VerbTense;speech:Speech;label?:string}){
 const text=sentenceText(verb,tense);
 return <div className="verb-example">{label&&<small>{label}</small>}<p lang="de" dir="ltr">{sentenceChunks(verb,tense).map((chunk,i)=><span key={i} className={'verb-chunk '+(chunk.role==='subject'||chunk.role==='middle'?'':'mark '+chunk.role)}>{chunk.text}</span>)}.</p><button type="button" className="verb-speak" disabled={speech.busy} aria-label={text} title={text} onClick={()=>speech.speak(text)}><Volume2 size={17}/></button></div>;
}
/** The card shown before the questions of a stage: meaning, Präsens or Perfekt of one verb. */
export function LearnCard({verb,stage,language,speech,onContinue}:{verb:Verb;stage:LearnStage;language:VaultLanguage;speech:Speech;onContinue:()=>void}){
 const t=(key:VerbCopyKey,params?:Record<string,string|number>)=>verbText(language,key,params);
 const dir=vaultDirection(language);const prefix=verbPrefix(verb);const subject=spokenSubject(verb);
 const form=stage==='praesens'?verb.praesens:stage==='perfekt'?perfektLabel(verb):verb.display;
 const spoken=stage==='praesens'?subject+' '+verb.praesens:stage==='perfekt'?subject+' '+verb.perfekt:verb.infinitive;
 const title=stage==='meaning'?t('learnNew'):stage==='praesens'?t('stepPraesens'):t('stepPerfekt');
 return <article className={'verb-learn panel stage-'+stage} aria-labelledby="verb-learn-heading" data-verb-learn={stage}>
  <p className="verb-learn-kicker">{title}</p>
  <div className="verb-learn-body">
   <VerbPicture verb={verb} language={language}/>
   <div className="verb-learn-text">
    {stage!=='meaning'&&<p className="verb-learn-infinitive" lang="de" dir="ltr">{verb.display}</p>}
    <h1 id="verb-learn-heading" tabIndex={-1} className="verb-learn-form" lang="de" dir="ltr">{stage==='meaning'?verb.display:<><span className="verb-learn-subject">{verb.subject}</span> {form}</>}</h1>
    <p className="verb-learn-meaning" lang={language} dir={dir}>{verbMeaning(verb,language)}</p>
    <button type="button" className="btn secondary small verb-learn-speak" disabled={speech.busy} onClick={()=>speech.speak(spoken)}><Volume2 size={18}/>{spoken}</button>
    {stage==='meaning'&&prefix&&<p className="verb-learn-note">{t('separableNote',{p:prefix})}</p>}
   </div>
  </div>
  {/* No conjugated example sentences while learning meanings and forms; sentences come later. */}
  {stage!=='meaning'&&<RuleBox lines={verbRules(verb,stage,language)} language={language}/>}
  <button type="button" className="btn verb-learn-next" onClick={onContinue}>{t('gotIt')}<ArrowRight size={18} className="vault-direction-icon"/></button>
 </article>;
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
