'use client';
import {useEffect,useState,type ReactNode} from 'react';
import {ArrowLeft,ArrowRight,Check,CheckCircle2,ChevronLeft,ChevronRight,Play,RotateCcw,Volume2,X} from 'lucide-react';
import {verbMeaning,perfektLabel,praesensPersons,type Verb} from '@/lib/verb-course';
import {familyRule,familyTitle,type VerbFamily} from '@/lib/verb-families';
import {sentenceChunks,sentenceText,verbRules,verbPrefix,verbPicture,type VerbTense} from '@/lib/verb-logic';
import {type LearnStage,type PathPlace,type VerbMarks,type WorkshopStep} from '@/lib/verb-workshop';
import {personSentences,personMode,personLabel,conjugationRows,learnSpeech,type PersonKey,type PersonTense} from '@/lib/verb-persons';
import {verbText,type VerbCopyKey} from '@/lib/verb-copy';
import {verbKindInfo} from '@/lib/verb-kind';
import {loadExampleMeanings,exampleMeaning,type ExampleMeanings} from '@/lib/verb-example-meanings';
import {vaultDirection,type VaultLanguage} from '@/lib/object-vault-copy';
import {VerbPicture,RuleBox} from './verb-games';

type Speech={speak:(text:string)=>void;busy:boolean};
const stepLabels:Record<WorkshopStep,VerbCopyKey>={meaning:'stepMeaning',write:'stepSpelling',partizip:'stepPartizip','write-partizip':'stepWritePartizip'};

/** One example sentence with the verb parts highlighted and a speaker button (kept for the later sentence practice). */
export function ExampleSentence({verb,tense,speech,label}:{verb:Verb;tense:VerbTense;speech:Speech;label?:string}){
 const text=sentenceText(verb,tense);
 return <div className="verb-example">{label&&<small>{label}</small>}<p lang="de" dir="ltr">{sentenceChunks(verb,tense).map((chunk,i)=><span key={i} className={'verb-chunk '+(chunk.role==='subject'||chunk.role==='middle'?'':'mark '+chunk.role)}>{chunk.text}</span>)}.</p><button type="button" className="verb-speak" disabled={speech.busy} aria-label={text} title={text} onClick={()=>speech.speak(text)}><Volume2 size={17}/></button></div>;
}
/** "kind-irregular" etc.: irregular verbs are shown in their own colour wherever their name appears. */
export function kindClass(verb:Verb){return 'kind-'+verbKindInfo(verb).kind;}
/** Regular, irregular or modal: a small badge, and (with note) one line saying what is irregular. */
export function VerbKindBadge({verb,language,note=false}:{verb:Verb;language:VaultLanguage;note?:boolean}){
 const info=verbKindInfo(verb);const t=(key:VerbCopyKey,params?:Record<string,string|number>)=>verbText(language,key,params);
 const label=t(info.kind==='modal'?'kindModal':info.kind==='irregular'?'kindIrregular':'kindRegular');
 const f=praesensPersons(verb);
 const lines=info.kind==='modal'?[t('kindModalNote')]:info.kind==='regular'?[t('kindRegularNote',{verb:verb.participle})]:[
  ...(info.stemChange?[t('kindStem',{verb:info.changedPersons.map(person=>person==='du'?'du '+f.du:'er '+f.er).join(', ')})]:[]),
  ...(info.irregularPartizip?[t('kindPartizip',{verb:verb.participle})]:[]),
 ];
 return <span className={'verb-kind kind-'+info.kind} data-verb-kind={info.kind}><span className="verb-kind-badge">{label}</span>{note&&lines.length>0&&<span className="verb-kind-note" lang={language} dir={vaultDirection(language)}>{lines.join(' · ')}</span>}</span>;
}
/** The Präsens forms of the verb for every person, singular on the left, plural on the right; tap a form to hear it. */
export function ConjugationTable({verb,language,speech}:{verb:Verb;language:VaultLanguage;speech:Speech}){
 // The spoken texts come from the lib, so each one has a natural site-voice clip.
 const rows=conjugationRows(verb);const changed=verbKindInfo(verb).changedPersons;
 const irregular=(pronoun:string)=>(pronoun==='du'&&changed.includes('du'))||(pronoun==='er/sie/es'&&changed.includes('er'));
 return <div className="verb-conj" data-verb-conjugation={verb.id}>
  <small lang={language} dir={vaultDirection(language)}>{verbText(language,'conjugationTitle')}</small>
  <div className="verb-conj-grid" lang="de" dir="ltr">{rows.map(({pronoun,form,spoken})=><button type="button" key={pronoun} className={'verb-conj-cell'+(irregular(pronoun)?' irregular':'')} disabled={speech.busy} aria-label={spoken} onClick={()=>speech.speak(spoken)}><span className="verb-conj-pronoun">{pronoun}</span><span className="verb-conj-form">{form}</span><Volume2 size={15} aria-hidden="true"/></button>)}</div>
 </div>;
}
/** The meanings of the example sentences in the learner's language (loaded once per language; none for German). */
export function useExampleMeanings(language:VaultLanguage){
 const [meanings,setMeanings]=useState<{language:VaultLanguage;value:ExampleMeanings|null}|null>(null);
 useEffect(()=>{let live=true;void loadExampleMeanings(language).then(value=>{if(live)setMeanings({language,value});});return()=>{live=false;};},[language]);
 return meanings?.language===language?meanings.value:null;
}
/** After an answer: one example sentence for every person (ich … Sie), each one different, Präsens or Perfekt,
 * with its meaning below in the learner's language; tap a sentence to hear it. */
export function PersonSentences({verb,tense,language,speech}:{verb:Verb;tense:PersonTense;language:VaultLanguage;speech:Speech}){
 const rows=personSentences(verb,tense);const mode=personMode(verb);const dir=vaultDirection(language);const meanings=useExampleMeanings(language);
 if(!rows.length)return null;
 const hint=(person:PersonKey)=>person==='sie-plural'?verbText(language,'pronounPlural'):person==='Sie'?verbText(language,'pronounFormal'):'';
 return <div className="verb-persons" data-verb-persons={verb.id+':'+tense}>
  <small lang={language} dir={dir}>{verbText(language,'examplesTitle',{t:tense==='perfekt'?'Perfekt':'Präsens'})}</small>
  <ul>{rows.map(row=>{const meaning=exampleMeaning(meanings,verb.id,tense,row.index);return <li key={row.person}><button type="button" className="verb-person-row" disabled={speech.busy} aria-label={row.text+(meaning?' – '+meaning:'')} onClick={()=>speech.speak(row.text)}>
   <span className="verb-person-pronoun" lang="de" dir="ltr">{personLabel(row.person)}{hint(row.person)&&<small lang={language} dir={dir}>{hint(row.person)}</small>}</span>
   <span className="verb-person-body"><span className="verb-person-text" lang="de" dir="ltr">{row.parts.flatMap((part,i)=>[i?' ':null,<span key={i} className={part.role==='plain'?undefined:'mark '+part.role}>{part.text}</span>])}{row.mark}</span>
    {meaning&&<span className="verb-person-meaning" lang={language} dir={dir}>{meaning}</span>}</span>
   <Volume2 size={15} aria-hidden="true"/>
  </button></li>;})}</ul>
  {mode!=='subject'&&<p className="verb-persons-note" lang={language} dir={dir}>{verbText(language,mode==='dative'?'personDative':'personFuer')}</p>}
 </div>;
}
/** The Präsens or Perfekt form, with the irregular part (changed stem, irregular Partizip) in the irregular colour. */
export function VerbForm({verb,stage}:{verb:Verb;stage:'praesens'|'perfekt'}){
 const info=verbKindInfo(verb);
 if(stage==='praesens')return <span className={info.changedPersons.includes('er')?'verb-irregular-form':undefined}>{verb.praesens}</span>;
 const label=perfektLabel(verb);const helper=label.slice(0,label.length-verb.participle.length).trim();
 return <>{helper} <span className={info.irregularPartizip?'verb-irregular-form':undefined}>{verb.participle}</span></>;
}
/** The card shown before the questions of a stage: meaning, Präsens or Perfekt of one verb. */
export function LearnCard({verb,stage,language,speech,onContinue}:{verb:Verb;stage:LearnStage;language:VaultLanguage;speech:Speech;onContinue:()=>void}){
 const t=(key:VerbCopyKey,params?:Record<string,string|number>)=>verbText(language,key,params);
 const dir=vaultDirection(language);const prefix=verbPrefix(verb);
 const spoken=learnSpeech(verb,stage);
 const title=stage==='meaning'?t('learnNew'):stage==='praesens'?t('stepPraesens'):t('stepPerfekt');
 return <article className={'verb-learn panel stage-'+stage} aria-labelledby="verb-learn-heading" data-verb-learn={stage}>
  <p className="verb-learn-kicker">{title}</p>
  <div className="verb-learn-body">
   <VerbPicture verb={verb} language={language}/>
   <div className="verb-learn-text">
    {stage!=='meaning'&&<p className="verb-learn-infinitive" lang="de" dir="ltr">{verb.display}</p>}
    <div className="verb-learn-title"><h1 id="verb-learn-heading" tabIndex={-1} className={'verb-learn-form'+(stage==='meaning'?' '+kindClass(verb):'')} lang="de" dir="ltr">{stage==='meaning'?verb.display:<><span className="verb-learn-subject">{verb.subject}</span> <VerbForm verb={verb} stage={stage}/></>}</h1><button type="button" className="verb-learn-speak" disabled={speech.busy} aria-label={spoken} title={spoken} onClick={()=>speech.speak(spoken)}><Volume2 size={20}/></button></div>
    <p className="verb-learn-meaning" lang={language} dir={dir}>{verbMeaning(verb,language)}</p>
    <VerbKindBadge verb={verb} language={language} note/>
    {stage==='meaning'&&prefix&&<p className="verb-learn-note">{t('separableNote',{p:prefix})}</p>}
   </div>
  </div>
  {/* No example sentences while learning; the meaning card shows the Präsens forms for every person instead. */}
  {stage==='meaning'?<ConjugationTable verb={verb} language={language} speech={speech}/>:<RuleBox lines={verbRules(verb,stage,language)} language={language}/>}
  {stage==='perfekt'&&verb.alsoIst&&<p className="verb-note">{t('liegenNote',{verb:'ist '+verb.participle})}</p>}
  <button type="button" className="btn verb-learn-next" onClick={onContinue}>{t('gotIt')}<ArrowRight size={18} className="vault-direction-icon"/></button>
 </article>;
}
/** After a test answer, in one card that fits a phone screen: the picture and the verb at the top (tap the speaker to hear it again), right or wrong,
 * then one example sentence per person (not after the last Perfekt step: the learner has just seen them). */
/** The card after a test answer. `past`: the past-form question — the infinitive → its Partizip II, with the past-tense example sentences. */
export function AnswerResult({verb,stage,language,speech,correct,status,chosen,spoken,note,nextLabel,onNext,busy,examples=true,past=false}:{verb:Verb;stage:LearnStage;language:VaultLanguage;speech:Speech;correct:boolean;status:string;chosen?:ReactNode;spoken:string;note?:string;nextLabel:string;onNext:()=>void;busy:boolean;examples?:boolean;past?:boolean}){
 const dir=vaultDirection(language);
 const form=past?'':stage==='perfekt'?verb.subject+' '+perfektLabel(verb):stage==='praesens'?verb.subject+' '+verb.praesens:'';
 return <div id="object-feedback" tabIndex={-1} className={'verb-result '+(correct?'success':'retry')} role="status" aria-live="polite" data-verb-result={stage}>
  <div className="verb-result-head">
   <VerbPicture verb={verb} language={language}/>
   <div className="verb-result-text">
    <div className="verb-result-line"><p className={'verb-result-status '+(correct?'right':'wrong')}>{correct?<CheckCircle2 size={18}/>:<X size={18}/>}{status}</p><VerbKindBadge verb={verb} language={language}/></div>
    <div className="verb-result-title"><strong lang="de" dir="ltr" className={stage==='meaning'&&!past?kindClass(verb):undefined}>{past?<><span className={kindClass(verb)}>{verb.display}</span> → <span className={verbKindInfo(verb).irregularPartizip?'verb-irregular-form':undefined}>{verb.participle}</span></>:stage==='meaning'?verb.display:<>{verb.subject} <VerbForm verb={verb} stage={stage}/></>}</strong><button type="button" className="verb-result-speak" disabled={speech.busy} aria-label={spoken} title={spoken} onClick={()=>speech.speak(spoken)}><Volume2 size={18}/></button></div>
    <span className="verb-result-meaning">{form&&<b className="verb-result-infinitive" lang="de" dir="ltr">{verb.display} · </b>}<span lang={language} dir={dir}>{verbMeaning(verb,language)}</span></span>
    {chosen&&<span className="verb-result-chosen">{chosen}</span>}
   </div>
  </div>
  {examples&&<PersonSentences verb={verb} tense={past||stage==='perfekt'?'perfekt':'praesens'} language={language} speech={speech}/>}
  {note&&<p className="verb-note">{note}</p>}
  <button type="button" className="btn object-next verb-result-next" disabled={busy} onClick={onNext}>{nextLabel}<ArrowRight size={18} className="vault-direction-icon"/></button>
 </div>;
}
/** The card that opens a part: its verbs and what each verb brings, one verb after the other (card, meaning test, spelling, past form). */
export function ChapterCard({family,verbs,language,onContinue}:{family:VerbFamily;verbs:readonly Verb[];language:VaultLanguage;onContinue:()=>void}){
 const t=(key:VerbCopyKey,params?:Record<string,string|number>)=>verbText(language,key,params);
 return <article className={'verb-chapter panel tone-'+family.tone} aria-labelledby="verb-chapter-heading" data-verb-chapter={family.id}>
  <p className="verb-learn-kicker">{t('chapterOf',{n:family.number})} · {t('verbsCount',{n:verbs.length})}</p>
  <h1 id="verb-chapter-heading" tabIndex={-1}><span lang="de" dir="ltr">{familyTitle(family,language)}</span> · {t('stageBoth')}</h1>
  <p className="verb-chapter-rule">{familyRule(family,language)}</p>
  <p className="verb-chapter-rule verb-chapter-flow">{t('verbFlow')}</p>
  <ul className="verb-chapter-verbs">{verbs.map(verb=><li key={verb.id}>{verbPicture(verb)&&<img src={verbPicture(verb)!} alt="" width={96} height={96} loading="lazy" decoding="async"/>}<span lang="de" dir="ltr" className={kindClass(verb)}>{verb.display}</span></li>)}</ul>
  <button type="button" className="btn verb-learn-next" onClick={onContinue}>{t('chapterStart')}<ArrowRight size={18} className="vault-direction-icon"/></button>
 </article>;
}
/** Where the learner is on the path: the verb and the steps of its current stage. */
export function PathStepper({place,language}:{place:PathPlace;language:VaultLanguage}){
 const t=(key:VerbCopyKey,params?:Record<string,string|number>)=>verbText(language,key,params);
 return <div className="verb-stepper" data-verb-step={place.step} data-verb-stage={place.stage}>
  <div className="verb-stepper-head"><span className="verb-stepper-verb" lang="de" dir="ltr">{place.verb.display}</span><span className="verb-stepper-count">{t('verbOf',{n:place.verbNumber,total:place.family.verbs.length})}</span></div>
  <ol className="verb-stepper-steps" style={{gridTemplateColumns:'repeat('+place.steps.length+',minmax(0,1fr))'}}>{place.steps.map((step,i)=><li key={step} className={i<place.step?'done':i===place.step?'current':''} aria-current={i===place.step?'step':undefined}><span className="verb-stepper-dot"/><span className="verb-stepper-label">{t(stepLabels[step])}</span></li>)}</ol>
 </div>;
}
type PartState={done:number;count:number;percent:number;finished:boolean;started:boolean;meaningDone:number;perfektDone:number};
/** Done or not, for one verb: the meaning and the Perfekt, each with a tick. */
function DoneMarks({marks,language}:{marks?:VerbMarks;language:VaultLanguage}){
 const t=(key:VerbCopyKey)=>verbText(language,key);
 const label=marks?.perfekt?t('verbDonePerfekt'):marks?.meaning?t('verbDoneMeaning'):t('verbNotDone');
 return <span className="verb-done-marks" aria-label={label} title={label}>
  <span className={'verb-done-mark'+(marks?.meaning?' on':'')} aria-hidden="true">{marks?.meaning&&<Check size={12}/>}{t('stepMeaning')}</span>
  <span className={'verb-done-mark'+(marks?.perfekt?' on':'')} aria-hidden="true">{marks?.perfekt&&<Check size={12}/>}Perfekt</span>
 </span>;
}
/** Inside a part: its verbs with what is done, the button that starts or continues the part, and a card for every verb. */
export function PartVerbs({family,part,verbs,marks,language,disabled,onStart,onOpen,onBack}:{family:VerbFamily;part:PartState;verbs:readonly Verb[];marks:ReadonlyMap<string,VerbMarks>;language:VaultLanguage;disabled:boolean;onStart:(restart:boolean)=>void;onOpen:(verb:Verb)=>void;onBack:()=>void}){
 const t=(key:VerbCopyKey,params?:Record<string,string|number>)=>verbText(language,key,params);const dir=vaultDirection(language);
 return <section className={'verb-part-view panel tone-'+family.tone} aria-labelledby="verb-part-heading" data-verb-part={family.id}>
  <button type="button" className="text-button verb-back" onClick={onBack}><ArrowLeft size={16} className="vault-direction-icon" aria-hidden="true"/>{t('backWorkshop')}</button>
  <div className="verb-part-head">
   <span className="verb-island-number" aria-hidden="true">{family.number}</span>
   <div>
    <p className="verb-learn-kicker">{t('chapterOf',{n:family.number})} · {t('verbsCount',{n:verbs.length})}</p>
    <h1 id="verb-part-heading" tabIndex={-1} lang="de" dir="ltr">{familyTitle(family,language)}</h1>
    <p className="verb-part-progress">{t('stageMeanings')} {part.meaningDone}/{verbs.length} · {t('stepPerfekt')} {part.perfektDone}/{verbs.length}</p>
   </div>
  </div>
  <div className="verb-energy" role="progressbar" aria-label={familyTitle(family,language)} aria-valuemin={0} aria-valuemax={part.count} aria-valuenow={part.done} aria-valuetext={part.percent+'%'}><span className="verb-energy-fill" style={{width:Math.max(3,part.percent)+'%'}}/><span className="verb-energy-ticks"/></div>
  <div className="verb-part-actions">
   <button type="button" className="btn verb-part-start" disabled={disabled} onClick={()=>onStart(part.finished)} data-verb-part-start={family.id}><Play size={18} fill="currentColor" aria-hidden="true"/>{t(part.finished?'chapterAgain':part.started?'chapterContinue':'chapterStart')}</button>
   {part.started&&!part.finished&&<button type="button" className="text-button verb-path-restart" disabled={disabled} onClick={()=>onStart(true)}><RotateCcw size={15}/>{t('workshopRestart')}</button>}
  </div>
  <h2 className="verb-part-list-title">{t('partVerbsTitle')}</h2>
  <p className="verb-part-lead" lang={language} dir={dir}>{t('partVerbsLead')}</p>
  <ol className="verb-part-list">{verbs.map((verb,i)=>{const mark=marks.get(verb.id);const picture=verbPicture(verb);return <li key={verb.id}>
   <button type="button" className={'verb-part-row'+(mark?.perfekt?' full':mark?.meaning?' half':'')} onClick={()=>onOpen(verb)} data-verb-open={verb.id}>
    <span className="verb-part-number" aria-hidden="true">{mark?.perfekt?<Check size={14}/>:i+1}</span>
    {picture?<img src={picture} alt="" width={96} height={96} loading="lazy" decoding="async"/>:<span className="verb-part-noimg"/>}
    <span className="verb-part-word"><strong lang="de" dir="ltr" className={kindClass(verb)}>{verb.display}</strong><span lang={language} dir={dir}>{verbMeaning(verb,language)}</span></span>
    <DoneMarks marks={mark} language={language}/>
   </button>
  </li>;})}</ol>
 </section>;
}
/** One verb's card, opened from its part: picture, meaning, regular or not, Präsens table, Perfekt and example sentences. */
export function VerbDetail({verb,family,position,total,marks,language,speech,onBack,onPrev,onNext}:{verb:Verb;family:VerbFamily;position:number;total:number;marks?:VerbMarks;language:VaultLanguage;speech:Speech;onBack:()=>void;onPrev?:()=>void;onNext?:()=>void}){
 const t=(key:VerbCopyKey,params?:Record<string,string|number>)=>verbText(language,key,params);const dir=vaultDirection(language);
 const [tense,setTense]=useState<PersonTense>('praesens');const prefix=verbPrefix(verb);
 const meaningSpeech=learnSpeech(verb,'meaning');const perfektSpeech=learnSpeech(verb,'perfekt');
 return <article className={'verb-detail panel tone-'+family.tone} aria-labelledby="verb-detail-heading" data-verb-detail={verb.id}>
  <div className="verb-detail-nav">
   <button type="button" className="text-button verb-back" onClick={onBack}><ArrowLeft size={16} className="vault-direction-icon" aria-hidden="true"/>{t('backToPart')}</button>
   <span className="verb-detail-count">{position}/{total}</span>
   <span className="verb-detail-arrows"><button type="button" className="verb-detail-arrow" disabled={!onPrev} onClick={onPrev} aria-label={t('prevVerb')} title={t('prevVerb')}><ChevronLeft size={20} className="vault-direction-icon"/></button><button type="button" className="verb-detail-arrow" disabled={!onNext} onClick={onNext} aria-label={t('nextVerb')} title={t('nextVerb')}><ChevronRight size={20} className="vault-direction-icon"/></button></span>
  </div>
  <div className="verb-learn-body">
   <VerbPicture verb={verb} language={language}/>
   <div className="verb-learn-text">
    <div className="verb-learn-title"><h1 id="verb-detail-heading" tabIndex={-1} className={'verb-learn-form '+kindClass(verb)} lang="de" dir="ltr">{verb.display}</h1><button type="button" className="verb-learn-speak" disabled={speech.busy} aria-label={meaningSpeech} title={meaningSpeech} onClick={()=>speech.speak(meaningSpeech)}><Volume2 size={20}/></button></div>
    <p className="verb-learn-meaning" lang={language} dir={dir}>{verbMeaning(verb,language)}</p>
    <VerbKindBadge verb={verb} language={language} note/>
    {prefix&&<p className="verb-learn-note">{t('separableNote',{p:prefix})}</p>}
    <DoneMarks marks={marks} language={language}/>
   </div>
  </div>
  <ConjugationTable verb={verb} language={language} speech={speech}/>
  <button type="button" className="verb-detail-perfekt" disabled={speech.busy} aria-label={perfektSpeech} onClick={()=>speech.speak(perfektSpeech)}><small>Perfekt</small><span lang="de" dir="ltr">{verb.subject} <VerbForm verb={verb} stage="perfekt"/></span><Volume2 size={16} aria-hidden="true"/></button>
  {verb.alsoIst&&<p className="verb-note">{t('liegenNote',{verb:'ist '+verb.participle})}</p>}
  <div className="verb-detail-tabs" role="group" aria-label={t('examplesTitle',{t:'Präsens / Perfekt'})}>{(['praesens','perfekt'] as const).map(item=><button type="button" key={item} className={'verb-detail-tab'+(tense===item?' active':'')} aria-pressed={tense===item} onClick={()=>setTense(item)}>{item==='praesens'?'Präsens':'Perfekt'}</button>)}</div>
  <PersonSentences verb={verb} tense={tense} language={language} speech={speech}/>
 </article>;
}
