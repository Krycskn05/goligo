'use client';
import {useRef,useState,type ReactNode} from 'react';
import {ArrowRight,BookOpen,Eye,EyeOff,Play,RotateCcw,Volume2} from 'lucide-react';
import {acceptsAnswer,normalizeLoose} from '@/lib/willkommen-course';
import {isFamilieTurkish,familieParts} from '@/lib/familie-course';
import {wordSay,type Block,type FamilieStep,type OwnPrompt,type PartId,type QuizItem,type SpeakRow as FamilieSpeakRow,type Word,type WriteRow} from '@/lib/familie-types';
import {personName} from '@/lib/berufe-course';
import {ProgressMeter} from './progress-meter';
import {PaulHoca} from './paul-hoca';
import {ChoiceExercise} from './stadt-a-steps';
import {Art,PhraseRow,Conversation,QuickChecks,SpeakStep} from './berufe-a-steps';
import {Say,Note,Heading,Portrait,Tx,FeedbackLine,scoreFeedback,useSelfCheck,selfCheckNote,type SelfCheckResult,GapExercise,TestStep,shuffle,useInnerNext,readRun,useRunSave,type Speech,type Sound,type StepProps,type Feedback} from './willkommen-ui';
import {ut,utBeside,utLang} from '@/lib/unit-i18n';

/**
 * Lektion 4 „Familie“: one view for every step of Teil A–D, drawn from the data (lib/familie-a.ts … familie-d.ts) with
 * the pieces of Lektion 1, 2, 3 and 15 (the same look: l1a-*, l15-*, l2-*; Lektion 4's own bits in app/familie.css,
 * the same as Lektion 3's). The page around it (notebook, tabs, pager, scores) is app/familie-study.tsx. Every person
 * is read with their own site voice; after an answer only the right answer is read, never the question.
 */
export function StepViewL4(props:StepProps&{familieStep:FamilieStep;part:PartId;badge:string;partTitle:string}){
 const {familieStep:step,speech,sound}=props;
 const head=<><p className="kicker" lang={step.kicker&&isFamilieTurkish(step.kicker)?utLang(step.kicker):'de'}>{step.kicker?ut(step.kicker):''}</p><Heading>{step.heading?<Tx text={step.heading}/>:ut(step.title)}</Heading>{step.lead&&<p className="l1a-tr"><Tx text={step.lead}/></p>}</>;
 switch(step.kind){
  case 'cover':return <Cover step={step} badge={props.badge} partTitle={props.partTitle}/>;
  case 'teach':return <>{head}<Blocks blocks={step.blocks??[]} speech={speech} sound={sound}/></>;
  case 'exercise':return <ExerciseStep {...props}/>;
  case 'test':return <TestStep label={'Lektion 4'+props.badge+' · '+step.title} questions={step.test??[]} sayFor={i=>step.test?.[i]?.[3]??''} listen={i=>step.test?.[i]?.[4]} langOf={text=>isFamilieTurkish(text)?'tr':'de'} {...props}/>;
  case 'speak':return <Speak {...props}/>;
  case 'end':return <End {...props}/>;
 }
 return null;
}

/* ---------- pieces ---------- */
/** A cell or a short text: Turkish through the packs, German as it is (der / das / die in their colours). */
function Cell({text}:{text:string}){return isFamilieTurkish(text)?<Tx text={text}/>:<span lang="de" dir="ltr"><Art de={text}/></span>;}
/** A picture of a thing, or its emoji while the picture is still to be made. */
function Thing({pic,emoji,alt,className}:{pic?:string;emoji?:string;alt:string;className?:string}){
 return pic?<img className={className} src={pic} alt={alt} width={640} height={480} loading="lazy" decoding="async"/>:<span className={'l4-emoji '+(className??'')} role="img" aria-label={alt}>{emoji}</span>;
}
/** The word cards: a picture (or emoji), the word with its article and plural, the meaning; a tap reads singular and plural. */
function Cards({words,speech}:{words:readonly Word[];speech:Speech}){
 return <ul className="l2-jobs l4-cards">{words.map(word=><li className="l2-job" key={word.de}>
  <button type="button" className="l2-job-pic l4-card-pic" aria-label={ut('Dinle')+': '+wordSay(word)} onClick={()=>speech.speak(wordSay(word))}><Thing pic={word.pic} emoji={word.emoji} alt={ut(word.tr)}/></button>
  <div className="l2-job-text">
   <span className="l4-word" lang="de"><Art de={word.de}/>{word.plural&&<span className="l4-plural">, <span className="l15-die">die</span> {word.plural}</span>}</span>
   <span className="l2-job-tr">{utBeside(word.de,word.tr)}</span>
  </div>
  <Say text={wordSay(word)} speech={speech}/>
 </li>)}</ul>;
}
/** The pieces of a teaching step. */
function Blocks({blocks,speech,sound}:{blocks:readonly Block[];speech:Speech;sound:Sound}){
 return <>{blocks.map((block,i)=>{switch(block.t){
  case 'p':return <p key={i}><Tx text={block.text}/></p>;
  case 'h':return <h2 className="l1a-h2" key={i}><Tx text={block.text}/></h2>;
  case 'note':return <Note key={i}><Tx text={block.text}/></Note>;
  case 'warn':return <p className="l15-warn" key={i}><Tx text={block.text}/></p>;
  case 'rows':return <section key={i}>{block.rows.map(([de,tr])=><PhraseRow key={de} de={de} tr={tr} who={block.who} speech={speech}/>)}
   {block.all&&<div className="l1a-actions"><button type="button" className="btn secondary small" disabled={speech.busy} onClick={()=>speech.speakAll(block.rows.map(([de])=>block.who?{text:de,who:block.who}:de))}><Play size={16} aria-hidden="true"/>{ut('Tümünü dinle')}</button></div>}</section>;
  case 'talk':return <Conversation key={i} lines={block.lines} speech={speech}/>;
  case 'table':return <table className="l1a-table l4-table" key={i}>{block.head.some(Boolean)&&<thead><tr>{block.head.map((cell,k)=><th key={k}>{cell?<Cell text={cell}/>:null}</th>)}{block.say&&<th/>}</tr></thead>}
   <tbody>{block.rows.map((cells,r)=><tr key={r}>{cells.map((cell,k)=><td key={k}><Cell text={cell}/></td>)}{block.say&&<td><Say text={block.say[r]} speech={speech}/></td>}</tr>)}</tbody></table>;
  case 'checks':return <QuickChecks key={i} items={block.items} speech={speech} sound={sound} title={block.title}/>;
  case 'cards':return <Cards key={i} words={block.words} speech={speech}/>;
  case 'list':return <div className="l15-word-grid" key={i}>{block.words.map(([de,tr,example,exampleTr])=><div className="l1a-phrase" key={de}><div className="l1a-phrase-text"><span className="l1a-de" lang="de"><Art de={de}/></span><span className="l1a-tr">{utBeside(de,tr)}</span><span className="l15-example" lang="de">{example}</span><span className="l1a-mini">{utBeside(example,exampleTr)}</span></div><Say text={example} speech={speech}/></div>)}</div>;
  case 'ads':return <div className="l15-word-grid l4-ads" key={i}>{block.items.map(item=><div className="l1a-phrase l4-ad" key={item.thing} lang="de" dir="ltr"><div className="l1a-phrase-text"><span className="l1a-de"><b>{item.thing}</b> <span className="l4-price">{item.price}</span></span><span className="l1a-mini">{item.details}</span><span className="l1a-mini">📍 {item.city}</span></div><Say text={item.say} speech={speech}/></div>)}</div>;
  case 'pic':return <img key={i} className="l1a-cover l1a-scene" src={block.src} alt={ut(block.alt)} width={block.width} height={block.height} loading="lazy" decoding="async"/>;
 }})}</>;
}

/* ---------- cover and end ---------- */
function Cover({step,badge,partTitle}:{step:FamilieStep;badge:string;partTitle:string}){ // the cover picture and the part's progress are on the notebook's left page
 const cover=step.cover;if(!cover)return null;
 return <>
  <p className="kicker" lang="de">Lektion 4 · Familie</p>
  <Heading><span lang="de">{badge} — {partTitle}</span></Heading>
  <p><Tx text={cover.intro}/></p>
  <p>{ut('Bu bölümde öğreneceklerin:')}</p>
  <ul className="l1a-list">{cover.learn.map(text=><li key={text}><Tx text={text}/></li>)}</ul>
  <h2 className="l1a-h2">{ut('Bu dersteki kişiler')}</h2>
  <ul className="l15-cast">{cover.cast.map(key=><li key={key}><Portrait who={key} name={personName(key)}/><span>{personName(key)}</span></li>)}</ul>
 </>;
}
function End({familieStep:step,part,badge,progress,onGo,onPart,language}:StepProps&{familieStep:FamilieStep;part:PartId;badge:string}){
 const end=step.end;if(!end)return null;
 const firstExercise=familieParts[part].steps.findIndex(item=>item.kind==='exercise');
 return <>
  <p className="kicker">{ut('Bitti')}</p>
  <Heading>{ut('Lektion 4{badge} tamam! 🎉',{badge})}</Heading>
  <PaulHoca pose="cheer" className="l1a-paul-big" sound="appear"/>
  <p>{ut('Artık şunları yapabilirsin:')}</p>
  <ul className="l1a-list">{end.can.map(text=><li key={text}><Tx text={text}/></li>)}</ul>
  <Note><Tx text={end.summary}/></Note>
  <ProgressMeter progress={progress} language={language} label={'Lektion 4'+badge}/>
  {end.next&&<p className="l1a-tr"><Tx text="Sıradaki bölüm: *Teil {badge} – {title}*" params={{badge:end.next.part.toUpperCase(),title:end.next.title}}/></p>}
  <div className="l1a-actions">
   {end.next&&<button type="button" className="btn small" onClick={()=>onPart(end.next!.part,0)}>{ut('Teil {badge}’ye geç',{badge:end.next.part.toUpperCase()})}<ArrowRight size={16} className="vault-direction-icon" aria-hidden="true"/></button>}
   {firstExercise>=0&&<button type="button" className="btn secondary small" onClick={()=>onGo(firstExercise)}>{ut('Alıştırmaları tekrar yap')}</button>}
   <button type="button" className="btn secondary small" onClick={()=>onGo(-1)}><BookOpen size={16} aria-hidden="true"/>{ut('Lektion 4 içindekiler')}</button>
  </div>
 </>;
}

/* ---------- exercises ---------- */
function ExerciseStep(props:StepProps&{familieStep:FamilieStep}){
 const {familieStep:step,speech,sound}=props;const exercise=step.exercise;if(!exercise)return null;
 const before=step.blocks?.length?<Blocks blocks={step.blocks} speech={speech} sound={sound}/>:undefined;
 const after=step.after?.length?<Blocks blocks={step.after} speech={speech} sound={sound}/>:null;
 const kicker=step.kicker??step.title,title=step.heading??step.title;
 switch(exercise.type){
  case 'choice':return <ChoiceExercise kicker={kicker} title={title} lead={step.lead?<Tx text={step.lead}/>:undefined} bankLead={exercise.bankLead} before={before} lines={exercise.lines} dialogue={exercise.dialogue}
   after={done=><>{exercise.dialogue&&<div className="l1a-actions"><button type="button" className="btn secondary small" disabled={!done||speech.busy} onClick={()=>speech.speakAll(exercise.lines.map(line=>line.say??''))}><Play size={16} aria-hidden="true"/>{ut('Tamamlanan diyaloğu dinle')}</button></div>}{after}</>} {...props}/>;
  case 'gaps':return <><GapExercise kicker={kicker} title={title} lead={step.lead} before={before} lines={exercise.lines} say={exercise.say} cells={exercise.cells} wide={exercise.wide} exact={exercise.exact} choices={exercise.choices} bank={exercise.bank} {...props}/>{after}</>;
  case 'quiz':return <><Quiz items={exercise.items} kicker={kicker} title={title} lead={step.lead} before={before} {...props}/>{after}</>;
  case 'write':return <><Write rows={exercise.rows} kicker={kicker} title={title} lead={step.lead} before={before} {...props}/>{after}</>;
  case 'own':return <><Own storeKey={exercise.key} prompts={exercise.prompts} kicker={kicker} title={title} lead={step.lead} before={before} {...props}/>{after}</>;
 }
}
type Head={kicker:string;title:string;lead?:string;before?:ReactNode};
function ExerciseHead({kicker,title,lead,before}:Head){
 return <><p className="kicker" lang={isFamilieTurkish(kicker)?utLang(kicker):'de'}>{ut(kicker)}</p><Heading><Tx text={title}/></Heading>{lead&&<p className="l1a-tr"><Tx text={lead}/></p>}{before}</>;
}
/** A quiz: one item at a time (a picture, a prompt or something to listen to), three options; after the answer the site's
 * sound, then the right answer is read (`say`, else the right option). Left in the middle it goes on at its item. */
function Quiz(props:StepProps&Head&{items:readonly QuizItem[]}){
 const {items,speech,sound,onScore,step,runKey}=props;const total=items.length;
 type Run={round:number;right:number;options:string[];picked:string|null};
 const [saved]=useState(()=>readRun<Run>(runKey,step.id,value=>{
  const round=Number(value.round),right=Number(value.right);if(!(round>=0&&round<total)||!(right>=0&&right<=round+1))return null;
  if(typeof value.picked==='string')return round+1<total?{round:round+1,right,options:shuffle(items[round+1].options),picked:null}:null;
  const kept=Array.isArray(value.options)&&value.options.length===items[round].options.length&&items[round].options.every(option=>(value.options as string[]).includes(option));
  return {round,right,options:kept?value.options as string[]:shuffle(items[round].options),picked:null};
 }));
 const [round,setRound]=useState(saved?.round??0);const [options,setOptions]=useState(()=>saved?.options??shuffle(items[0].options));
 const [picked,setPicked]=useState<string|null>(null);const [right,setRight]=useState(saved?.right??0);const [over,setOver]=useState(false);const [wait,setWait]=useState(false);
 useRunSave(runKey,step.id,!over&&(round>0||picked!==null)?{round,right,options,picked}:null);
 const item=items[round];const answer=item.options[0];
 const choose=(option:string)=>{
  if(picked!==null)return;sound.prepare();speech.prepare();setPicked(option);setWait(false);
  const ok=option===answer;const sum=right+(ok?1:0);setRight(sum);
  const say=item.say??answer;const after=say&&!isFamilieTurkish(say)?()=>speech.speak(say):undefined;if(ok)sound.correct(after);else sound.wrong(after);
  if(round===total-1){setOver(true);onScore(step.id,sum,total);}
 };
 const next=()=>{const r=round+1;setRound(r);setOptions(shuffle(items[r].options));setPicked(null);setWait(false);};
 const again=()=>{setRound(0);setOptions(shuffle(items[0].options));setPicked(null);setRight(0);setOver(false);};
 useInnerNext(props.setInnerNext,()=>{if(over)return false;if(picked!==null){next();return true;}setWait(true);return true;});
 const feedback:Feedback=over?(right===total?{ok:true,text:'Harika! {right} / {total}',params:{right,total}}:scoreFeedback(right,total)):picked===null?(wait?{ok:false,text:'Önce bir cevap seç.'}:null):picked===answer?{ok:true,text:'Doğru!'}:{ok:false,text:'Doğrusu yeşil olan.'};
 const listen=item.listen;
 return <>
  <ExerciseHead {...props}/>
  <p className="l1a-mini">{ut('Soru {n} / {total}',{n:round+1,total})}</p>
  {(item.pic||item.emoji)&&<Thing className="l1a-cover l1a-scene l2-quiz-pic l4-quiz-pic" pic={item.pic} emoji={item.emoji} alt={item.prompt?ut(item.prompt):ut('Resim')}/>}
  {item.prompt&&<p className="l1a-question" lang={isFamilieTurkish(item.prompt)?utLang(item.prompt):'de'}><Cell text={item.prompt}/></p>}
  {listen&&<div className="l1a-actions l1a-test-listen"><Say text={typeof listen==='string'?listen:listen.text} who={typeof listen==='string'?undefined:listen.who} speech={speech} secret wide/></div>}
  <div className="l1a-opts column" role="group" aria-label={ut('Soru {n}',{n:round+1})}>{options.map(option=><button type="button" key={option} className={'l1a-opt'+(picked!==null&&option===answer?' ok':picked===option?' bad':'')} disabled={picked!==null||over} lang={isFamilieTurkish(option)?utLang(option):'de'} onClick={()=>choose(option)}><Cell text={option}/></button>)}</div>
  <FeedbackLine feedback={feedback}/>
  <div className="l1a-actions">
   {picked!==null&&!over&&<button type="button" className="btn small" onClick={next}>{ut('Sonraki')}<ArrowRight size={16} className="vault-direction-icon" aria-hidden="true"/></button>}
   {over&&<button type="button" className="btn secondary small" onClick={again}><RotateCcw size={16} aria-hidden="true"/>{ut('Baştan')}</button>}
  </div>
 </>;
}
/** Rows to write: a right answer turns green at once and is read; a wrong one turns red when the learner leaves the box,
 * with the right answer next to it. The score counts first tries. */
function Write(props:StepProps&Head&{rows:readonly WriteRow[]}){
 const {rows,speech,sound,onScore,step}=props;
 const [feedback,setFeedback]=useState<Feedback>(null);
 const refs=useRef<(HTMLInputElement|null)[]>([]);const spoken=useRef<boolean[]>(rows.map(()=>false));
 const total=rows.length;
 const self=useSelfCheck(total,(i,value)=>acceptsAnswer(value,rows[i].answers),firstRight=>{
  onScore(step.id,firstRight,total);setFeedback({ok:true,text:firstRight===total?'Hepsi doğru!':'Hepsi doğru! İlk denemede {right} / {total} doğruydu.',params:{right:firstRight,total}});
 });
 const note=(result:SelfCheckResult)=>selfCheckNote(result,self,'Kırmızıyı düzelt; doğrusu yanında yazıyor.',setFeedback);
 const change=(i:number,value:string)=>{
  sound.prepare();speech.prepare();const result=self.change(i,value);note(result);
  if(result!=='right'||spoken.current[i])return;
  spoken.current[i]=true;sound.correct(()=>speech.speak(rows[i].say));
 };
 const focusNext=(i:number)=>{const target=rows.findIndex((_,k)=>k>i&&self.stateNow(k)!==true);if(target>=0)refs.current[target]?.focus();};
 const restart=()=>{self.reset();setFeedback(null);spoken.current=rows.map(()=>false);};
 return <>
  <ExerciseHead {...props}/>
  {rows.map((row,i)=>{const state=self.state[i]===true?' ok':self.state[i]===false?' bad':'';return <div className="l1a-arow l2-form-row l4-write-row" key={row.given+i}>
   {(row.pic||row.emoji)&&<Thing className="l4-write-pic" pic={row.pic} emoji={row.emoji} alt={row.given}/>}
   <span className="l1a-de l2-form-given"><Cell text={row.given}/></span>
   <span className="l1a-gap-wrap"><input ref={element=>{refs.current[i]=element;}} className={'l1a-gap'+state} value={self.values[i]} lang="de" dir="ltr" autoCapitalize="off" autoComplete="off" spellCheck={false} aria-label={ut(row.given)} enterKeyHint="next"
    onChange={event=>change(i,event.target.value)} onBlur={()=>note(self.leave(i))} onKeyDown={event=>{if(event.key==='Enter'){event.preventDefault();note(self.leave(i));focusNext(i);}}}/>{self.hinted[i]&&self.state[i]!==true&&<span className="l1a-hint" lang="de">→ {row.answers[0]}</span>}</span>
  </div>;})}
  <FeedbackLine feedback={feedback}/>
  <div className="l1a-actions"><button type="button" className="btn secondary small" onClick={restart}><RotateCcw size={16} aria-hidden="true"/>{ut('Baştan')}</button></div>
 </>;
}
/** The learner's own sentences, kept in this browser only (never sent to the account: lib/lesson-sync.ts). */
function readOwn(key:string,count:number):string[]{
 try{const saved=JSON.parse(localStorage.getItem(key)??'[]') as unknown;return Array.from({length:count},(_,i)=>Array.isArray(saved)&&typeof saved[i]==='string'?saved[i] as string:'');}catch{return Array.from({length:count},()=>'');}
}
const fits=(prompt:{pattern:RegExp},value:string)=>!!value.trim()&&prompt.pattern.test(normalizeLoose(value));
/** Und du? The learner writes their own sentences (in Teil D the five lines of an Elfchen); one that fits the pattern
 * turns green. Once the required ones fit, the exercise is done; then listen, hide them and say them by heart. */
function Own(props:StepProps&Head&{storeKey:string;prompts:readonly OwnPrompt[]}){
 const {storeKey,prompts,speech,onScore,step}=props;
 const [values,setValues]=useState<string[]>(()=>readOwn(storeKey,prompts.length));
 const [hidden,setHidden]=useState(false);
 const required=prompts.filter(prompt=>!prompt.optional).length;const scored=useRef(false);
 const isDone=(list:readonly string[])=>prompts.every((prompt,i)=>prompt.optional||fits(prompt,list[i]));
 const change=(i:number,value:string)=>{
  const next=values.slice();next[i]=value;setValues(next);
  try{localStorage.setItem(storeKey,JSON.stringify(next));}catch{}
  if(!scored.current&&isDone(next)){scored.current=true;onScore(step.id,required,required);}
 };
 const mine=values.filter((value,i)=>fits(prompts[i],value)).map(value=>value.trim());const done=isDone(values);
 return <>
  <ExerciseHead {...props}/>
  {hidden?<p className="l2-hidden-note" role="status">{ut('🙈 Cümlelerin gizlendi. Şimdi hepsini ezberden yüksek sesle söyle.')}</p>
  :<div className="l1a-dialogue">{prompts.map((prompt,i)=>{const state=values[i].trim()?fits(prompt,values[i]):null;return <div key={prompt.question}>
   <div className="l1a-line a"><Portrait who="paul" name="Paul Hoca"/><div className="l1a-bubble l15-say-bubble"><div className="l15-say-text"><span className="l15-name">Paul Hoca</span><span className="l1a-de" lang="de">{prompt.question}</span>{prompt.optional&&<span className="l1a-mini">{ut('(isteğe bağlı)')}</span>}</div><Say text={prompt.question} who="paul" speech={speech}/></div></div>
   <div className="l1a-line b"><div className="l1a-bubble"><input className={'l1a-gap wide'+(state===true?' ok':state===false?' bad':'')} value={values[i]} lang="de" dir="ltr" autoCapitalize="off" autoComplete="off" spellCheck={false} placeholder={prompt.placeholder} aria-label={prompt.question} onChange={event=>change(i,event.target.value)}/>{state===false&&<span className="l1a-mini">{ut('Kalıp:')} <span lang="de">{prompt.placeholder}</span></span>}</div></div>
  </div>;})}</div>}
  <FeedbackLine feedback={done?{ok:true,text:'Süper! Bunlar artık senin cümlelerin. Konuş adımında yine karşına çıkacak.'}:null}/>
  <div className="l1a-actions">
   <button type="button" className="btn secondary small" disabled={speech.busy||!mine.length} onClick={()=>speech.speakAll(mine)}><Volume2 size={16} aria-hidden="true"/>{ut('Cümlelerimi dinle')}</button>
   <button type="button" className="btn secondary small" aria-pressed={hidden} onClick={()=>setHidden(!hidden)}>{hidden?<Eye size={16} aria-hidden="true"/>:<EyeOff size={16} aria-hidden="true"/>}{ut(hidden?'Göster':'Gizle')}</button>
  </div>
 </>;
}
/** Konuş: a person asks, the learner answers (their own sentence from Und du? when it fits); not scored, a rating marks it done. */
function Speak(props:StepProps&{familieStep:FamilieStep}){
 const step=props.familieStep;
 const [rows]=useState(()=>(step.speak??[]).map((row:FamilieSpeakRow,i)=>{
  let answer=row.answer;
  if(row.own){const value=readOwn(row.own.key,row.own.index+1)[row.own.index]?.trim()??'';if(value&&fits(row.own,value))answer=value;}
  return {key:i+':'+row.question,who:row.who,question:row.question,answer};
 }));
 return <SpeakStep lead={step.lead??''} rows={rows} replies={['🎉 Süper! Bu kalıplar artık senin.','👍 İyi. Bir kez daha dinle ve söyle.','Sorun değil. Kalıplar adımına dön, yarın tekrar dene.']} {...props}/>;
}
