'use client';
import {useRef,useState,type ReactNode} from 'react';
import {ArrowRight,BookOpen,Eye,EyeOff,Play,RotateCcw,Volume2} from 'lucide-react';
import {acceptsAnswer,normalizeLoose} from '@/lib/willkommen-course';
import type {Line} from '@/lib/willkommen-b-course';
import {articleOf} from '@/lib/stadt-course';
import {
 jobPicture,castL2A,personName,jobs,jobOf,pairSay,otherWords,phrases,wordChecks,askChecks,formChecks,workChecks,verbChecks,
 askBeruf,askBeruflich,sayBeruf,sieDialogue,duDialogue,inRule,umlautRule,workSections,fourPeople,verbTable,verbSay,verbEnding,
 duArbeitest,orderRows,orderRowSay,pictureItems,chatLines,chatFill,otherForms,otherFormSay,letterLines,dialogueLines,dialogueSay,
 examLines,ownPrompts,L2A_OWN_KEY,berufeTest,isTurkishText,practiceItems,berufeStepIndex,type QuickCheck,type PracticeItem,
} from '@/lib/berufe-course';
import {ProgressMeter} from './progress-ui';
import {PaulHoca} from './paul-hoca';
import {ChoiceExercise} from './stadt-a-steps';
import {Say,Note,Heading,Portrait,Rich,FeedbackLine,scoreFeedback,useSelfCheck,selfCheckNote,type SelfCheckResult,GapExercise,TestStep,shuffle,useInnerNext,readRun,useRunSave,type Speech,type Sound,type StepProps,type Feedback} from './willkommen-ui';

/**
 * Lektion 2 „Berufe“, Teil A – Ich bin Koch. (the learner's lesson page, 2 November 2026): the steps. The page around
 * them (notebook, tabs, pager, scores) is app/berufe-study.tsx; the texts are lib/berufe-course.ts; the pieces shared
 * with Lektion 1 and 15 come from app/willkommen-ui.tsx (and the sentence choices from app/stadt-a-steps.tsx). Every
 * person is read with their own site voice (`who`): women by women's voices, men by men's.
 */
export function StepViewL2A(props:StepProps){
 const {step,speech,sound}=props;
 switch(step.id){
  case 'kapak':return <CoverL2A/>;
  case 'meslekler':return <JobWords speech={speech}/>;
  case 'kelimeler':return <OtherWords speech={speech}/>;
  case 'kontrol':return <WordCheck speech={speech} sound={sound} onGo={props.onGo}/>;
  case 'meslek-sor':return <AskJob speech={speech} sound={sound}/>;
  case 'kadin-erkek':return <Forms speech={speech} sound={sound}/>;
  case 'als-bei':return <Work speech={speech} sound={sound}/>;
  case 'fiiller':return <Verbs speech={speech} sound={sound}/>;
  case 'kaliplar':return <Phrases speech={speech}/>;
  case 'resim-sec':return <PictureQuiz {...props}/>;
  case 'kurs-chat':return <ChatExercise {...props}/>;
  case 'diger-bicim':return <FormWriting {...props}/>;
  case 'harfler':return <GapExercise kicker="Alıştırma 4 · Richtig schreiben" title="Eksik harfleri tamamla" lead="Kelimeyi dinle ve her kutuya bir harf yaz. Doğru kelime yeşil olur. (ä yerine ae de yazabilirsin.)" cells lines={letterLines} say={letterLines.map(line=>line.say)} {...props}/>;
  case 'diyalog':return <DialogueExercise {...props}/>;
  case 'sinav':return <ChoiceExercise kicker="Alıştırma 6 · Prüfung: Sprachbausteine" title="Sınav tipi: doğru kelimeyi seç" lead="Start Deutsch A1 sınavında böyle sorular var: metinde bir boşluk, iki seçenek. Boşluğa dokun ve doğrusunu seç." lines={examLines}
   after={()=><Note>Hatırlatma: <b lang="de">aus</b> = -den (nereden geldiğin), <b lang="de">in</b> = -de (nerede yaşadığın). <i lang="de">aus der Türkei</i>, <i lang="de">in der Schweiz</i> kalıplarını olduğu gibi ezberle.</Note>} {...props}/>;
  case 'und-du':return <OwnExercise {...props}/>;
  case 'test':return <TestStep label="Lektion 2A · Test" questions={berufeTest} sayFor={i=>berufeTest[i][3]} langOf={text=>isTurkishText(text)?'tr':'de'} {...props}/>;
  case 'ozet':return <EndL2A {...props}/>;
 }
 return null;
}

/* ---------- small pieces ---------- */
const lineSay=(line:Line)=>({text:line.say??line.de,who:line.who});
/** der, die and das in their colours (blue, red, green), the rest of the word as it is. */
function Art({de}:{de:string}){const article=articleOf(de);return article?<><span className={'l15-'+article}>{article}</span>{de.slice(article.length)}</>:<>{de}</>;}
/** The woman's form with its new letters in bold: + in (die Lehrer**in**) or the Umlaut (die K**ö**chin). */
function WomanForm({de,mark}:{de:string;mark:'in'|'umlaut'}){
 const rest=de.slice(4);
 if(mark==='in'&&rest.endsWith('in'))return <><span className="l15-die">die</span> {rest.slice(0,-2)}<b>in</b></>;
 return <><span className="l15-die">die</span> {rest.split(/([äöüÄÖÜ])/).map((part,i)=>i%2?<b key={i}>{part}</b>:part)}</>;
}
/** One German line with its meaning and a listen button (`who` reads it with that person's voice). */
function PhraseRow({de,tr,who,speech}:{de:string;tr?:ReactNode;who?:string;speech:Speech}){
 return <div className="l1a-phrase"><div className="l1a-phrase-text"><span className="l1a-de" lang="de" dir="ltr">{de}</span>{tr&&<span className="l1a-tr">{tr}</span>}</div><Say text={de} who={who} speech={speech}/></div>;
}
/** A dialogue: portrait, name, German and Turkish per line; "Tümünü dinle" reads it as a conversation and the
 * translation can be hidden to listen again. `actions={false}` for a short example. */
function Conversation({lines,speech,actions=true}:{lines:readonly (Line&{from?:string})[];speech:Speech;actions?:boolean}){
 const [hidden,setHidden]=useState(false);const first=lines[0]?.who;
 return <>
  <div className={'l1a-dialogue'+(hidden?' l15-hide-tr':'')}>{lines.map((line,i)=><div className={'l1a-line '+(line.who===first?'a':'b')} key={i}>
   <Portrait who={line.who} name={personName(line.who)}/>
   <div className="l1a-bubble"><span className="l15-name">{personName(line.who)}{line.from&&<span lang="tr"> · {line.from}</span>}</span><span className="l1a-de" lang="de" dir="ltr">{line.de}</span><span className="l1a-tr">{line.tr}</span></div>
   <Say text={line.say??line.de} who={line.who} speech={speech}/>
  </div>)}</div>
  {actions&&<div className="l1a-actions">
   <button type="button" className="btn secondary small" disabled={speech.busy} onClick={()=>speech.speakAll(lines.map(lineSay))}><Play size={16} aria-hidden="true"/>Tümünü dinle</button>
   <button type="button" className="btn secondary small" aria-pressed={hidden} onClick={()=>setHidden(!hidden)}>{hidden?<Eye size={16} aria-hidden="true"/>:<EyeOff size={16} aria-hidden="true"/>}{hidden?'Çeviriyi göster':'Çeviriyi gizle'}</button>
  </div>}
 </>;
}
/** Quick checks inside a teaching step (not scored): one tap per question, the site's sound, then the right answer is
 * read when it is German (never the question or a Turkish answer). The options are mixed once. */
function QuickChecks({items,speech,sound,title='Hemen kontrol'}:{items:readonly QuickCheck[];speech:Speech;sound:Sound;title?:string}){
 const [orders]=useState(()=>items.map(item=>shuffle(item.options)));
 const [answers,setAnswers]=useState<Record<number,string>>({});
 const answer=(i:number,value:string)=>{
  if(answers[i]!==undefined)return;sound.prepare();speech.prepare();setAnswers({...answers,[i]:value});
  const say=items[i].say;const after=say?()=>speech.speak(say):undefined;
  if(value===items[i].options[0])sound.correct(after);else sound.wrong(after);
 };
 return <section className="l2-checks" aria-label={title}>
  <h2 className="l1a-h2">{title}</h2>
  {items.map((item,i)=>{const picked=answers[i];const right=item.options[0];return <div className="l1a-arow wide" key={item.q} data-done={picked!==undefined?'':undefined}>
   <p className="l2-check-q" lang={isTurkishText(item.q)?'tr':'de'}>{item.q}</p>
   <div className="l1a-opts" role="group" aria-label={item.q}>{orders[i].map(option=><button type="button" key={option} className={'l1a-opt'+(picked!==undefined&&option===right?' ok':picked===option?' bad':'')} disabled={picked!==undefined} lang={item.say?'de':'tr'} onClick={()=>answer(i,option)}>{option}</button>)}</div>
   {picked!==undefined&&<p className={'l1a-feedback '+(picked===right?'ok':'bad')} role="status">{picked===right?'Doğru!':'Doğrusu yeşil olan.'}</p>}
  </div>;})}
 </section>;
}

/* ---------- teaching steps ---------- */
function CoverL2A(){ // the cover picture and the part's progress are on the notebook's left page
 return <>
  <p className="kicker" lang="de">Lektion 2 · Berufe</p>
  <Heading><span lang="de">A — Ich bin Koch.</span></Heading>
  <p>Kursta herkes birbirine mesleğini soruyor. Omar memleketinde kuaför, ama Almanya’da satış görevlisi olarak çalışıyor. Sen ne iş yapıyorsun?</p>
  <p>Bu bölümde öğreneceklerin:</p>
  <ul className="l1a-list">
   <li>Meslek sormak: <b lang="de">Was bist du von Beruf?</b></li>
   <li>Mesleğini söylemek: <b lang="de">Ich bin Köchin von Beruf.</b> (artikelsiz!)</li>
   <li>Kadın ve erkek meslek adları: <b lang="de">Lehrer → Lehrerin</b></li>
   <li>Şu anki işin: <b lang="de">Ich arbeite als … / bei …</b> · <b lang="de">Ich arbeite jetzt nicht.</b></li>
   <li>Fiiller: <i lang="de">ich arbeite, du arbeitest, Sie arbeiten</i></li>
  </ul>
  <h2 className="l1a-h2">Bu dersteki kişiler</h2>
  <ul className="l15-cast">{castL2A.map(key=><li key={key}><Portrait who={key} name={personName(key)}/><span>{personName(key)}</span></li>)}</ul>
 </>;
}
/** The jobs: a picture with a man and a woman, both forms (each row reads itself) and the meaning; the picture reads both. */
function JobWords({speech}:{speech:Speech}){
 return <><p className="kicker" lang="de">Wortschatz · Berufe</p><Heading>Meslekler</Heading>
  <p className="l1a-tr">Her meslek iki biçimde: <span className="l15-der" lang="de">der</span> erkek, <span className="l15-die" lang="de">die</span> kadın. Satıra ya da resme dokun, dinle ve yüksek sesle tekrar et.</p>
  <ul className="l2-jobs">{jobs.map(job=>{const picture=jobPicture(job.key);return <li className="l2-job" key={job.key}>
   <button type="button" className="l2-job-pic" aria-label={'Dinle: '+pairSay(job)} onClick={()=>speech.speak(pairSay(job))}><img src={picture.src} alt={job.alt} width={picture.width} height={picture.height} loading="lazy" decoding="async"/></button>
   <div className="l2-job-text">
    <ul className="l1a-say-list l2-forms">
     <li><span lang="de"><Art de={job.male}/></span><Say text={job.male} speech={speech}/></li>
     <li><span lang="de"><Art de={job.female}/></span><Say text={job.female} speech={speech}/></li>
    </ul>
    <span className="l2-job-tr">{job.emoji} {job.tr}</span>
   </div>
  </li>;})}</ul></>;
}
function OtherWords({speech}:{speech:Speech}){
 return <><p className="kicker" lang="de">Wortschatz · Wörter</p><Heading>Diğer kelimeler</Heading>
  <p className="l1a-tr">Her satırda kelime, anlamı ve bir örnek cümle var. Satıra dokununca örnek cümle okunur.</p>
  <div className="l15-word-grid">{otherWords.map(([de,tr,example,exampleTr])=><div className="l1a-phrase" key={de}><div className="l1a-phrase-text"><span className="l1a-de" lang="de"><Art de={de}/></span><span className="l1a-tr">{tr}</span><span className="l15-example" lang="de">{example}</span><span className="l1a-mini">{exampleTr}</span></div><Say text={example} speech={speech}/></div>)}</div></>;
}
function WordCheck({speech,sound,onGo}:{speech:Speech;sound:Sound;onGo:(index:number)=>void}){
 return <><p className="kicker" lang="de">Wortschatz · Kontrolle</p><Heading>Kelimeleri hatırlıyor musun?</Heading>
  <p className="l1a-tr">Hızlı bir kontrol, puanı yok. Yanlış olursa doğrusu yeşil görünür.</p>
  <QuickChecks items={wordChecks} speech={speech} sound={sound} title="8 kısa soru"/>
  <div className="l1a-actions"><button type="button" className="btn secondary small" onClick={()=>onGo(berufeStepIndex('meslekler'))}>Meslek kartlarına dön</button></div></>;
}
function AskJob({speech,sound}:{speech:Speech;sound:Sound}){
 return <><p className="kicker" lang="de">Konu 1 · Was bist du von Beruf?</p><Heading>Meslek sorma ve söyleme</Heading>
  <p>Almancada mesleği sormanın iki yolu var. İkisi de çok sık kullanılır; ikisini de tanı.</p>
  <h2 className="l1a-h2">1. Soru: <span lang="de">„von Beruf“</span> ile</h2>
  {askBeruf.map(([de,tr])=><PhraseRow key={de} de={de} tr={tr} speech={speech}/>)}
  <h2 className="l1a-h2">2. Soru: <span lang="de">„beruflich“</span> ile</h2>
  {askBeruflich.map(([de,tr])=><PhraseRow key={de} de={de} tr={tr} speech={speech}/>)}
  <h2 className="l1a-h2">Cevap</h2>
  {sayBeruf.map(([de,tr])=><PhraseRow key={de} de={de} tr={tr} speech={speech}/>)}
  <p>„<span lang="de">von Beruf</span>“ eklemek isteğe bağlı. <b lang="de">Ich bin Lehrerin.</b> ve <b lang="de">Ich bin Lehrerin von Beruf.</b> ikisi de doğru. „<span lang="de">von Beruf</span>“ dediğinde „bu benim mesleğim, öğrendiğim iş“ demiş olursun.</p>
  <p className="l15-warn"><b>En önemli kural: artikel yok!</b> Mesleğini söylerken <b lang="de">ein / eine / der / die</b> kullanılmaz:<br/>✅ <span lang="de">Ich bin Koch.</span> ❌ <s lang="de">Ich bin ein Koch.</s><br/>✅ <span lang="de">Ich bin Ärztin.</span> ❌ <s lang="de">Ich bin eine Ärztin.</s><br/>Tıpkı Türkçedeki gibi: „Ben aşçıyım“, „Ben bir aşçıyım“ değil.</p>
  <h2 className="l1a-h2">Örnek 1 — <span lang="de">Sie</span> (siz)</h2>
  <p className="l1a-tr">Yasemin ve komşusu Nora birbirine <span lang="de">„Sie“</span> der (Lektion 1’den hatırla).</p>
  <Conversation lines={sieDialogue} speech={speech}/>
  <h2 className="l1a-h2">Örnek 2 — <span lang="de">du</span> (sen)</h2>
  <p className="l1a-tr">Kursta herkes birbirine <span lang="de">„du“</span> der.</p>
  <Conversation lines={duDialogue} speech={speech}/>
  <QuickChecks items={askChecks} speech={speech} sound={sound}/></>;
}
function Forms({speech,sound}:{speech:Speech;sound:Sound}){
 const haus=jobOf('haus');
 return <><p className="kicker" lang="de">Konu 2 · Mann oder Frau?</p><Heading>Kadın ve erkek meslek adları</Heading>
  <p>Almancada her mesleğin <b>erkek</b> ve <b>kadın</b> biçimi ayrıdır. Erkek biçimi <b className="l15-der" lang="de">der</b>, kadın biçimi <b className="l15-die" lang="de">die</b> alır. Kendinden bahsederken sana uyan biçimi kullanırsın: bir erkek <i lang="de">„Ich bin Lehrer“</i>, bir kadın <i lang="de">„Ich bin Lehrerin“</i> der.</p>
  <h2 className="l1a-h2">Ana kural: + <span lang="de">in</span></h2>
  <p>Kadın biçimi = erkek biçimi + <b lang="de">-in</b>. Bu kural mesleklerin çoğunda işler:</p>
  <table className="l1a-table"><thead><tr><th><span className="l15-der" lang="de">der</span> erkek</th><th><span className="l15-die" lang="de">die</span> kadın</th><th/></tr></thead>
   <tbody>{inRule.map(key=>{const job=jobOf(key);return <tr key={key}><td lang="de"><Art de={job.male}/></td><td lang="de"><WomanForm de={job.female} mark="in"/></td><td><Say text={pairSay(job)} speech={speech}/></td></tr>;})}</tbody></table>
  <h2 className="l1a-h2">Dikkat 1: nokta nokta (Umlaut) gelir</h2>
  <p>Bazı kelimelerde <span lang="de">-in</span> eklenince içerideki <b>o → ö</b>, <b>a → ä</b> olur. Bunları ezberle, kuralı yok:</p>
  {umlautRule.map(key=>{const job=jobOf(key);return <div className="l1a-phrase" key={key}><div className="l1a-phrase-text"><span className="l1a-de" lang="de"><Art de={job.male}/> → <WomanForm de={job.female} mark="umlaut"/></span><span className="l1a-tr">{job.tr}</span></div><Say text={pairSay(job)} speech={speech}/></div>;})}
  <h2 className="l1a-h2">Dikkat 2: <span lang="de">Mann → Frau</span></h2>
  <p>„<span lang="de">-mann</span>“ ile biten kelimede <span lang="de">-in</span> eklenmez; <b lang="de">Mann</b> yerine <b lang="de">Frau</b> gelir:</p>
  <div className="l1a-phrase"><div className="l1a-phrase-text"><span className="l1a-de" lang="de"><Art de={haus.male}/> → <Art de={haus.female}/></span><span className="l1a-tr">ev erkeği → ev hanımı</span></div><Say text={pairSay(haus)} speech={speech}/></div>
  <h2 className="l1a-h2">Hepsi bir arada</h2>
  <table className="l1a-table"><tbody>{jobs.map(job=><tr key={job.key}><td lang="de"><Art de={job.male}/></td><td lang="de"><Art de={job.female}/></td><td className="l1a-mini">{job.tr}</td><td><Say text={pairSay(job)} speech={speech}/></td></tr>)}</tbody></table>
  <Note>Okurken ipucu: kelimenin sonunda <b lang="de">-in</b> görüyorsan kadından bahsediliyor: <i lang="de">die Verkäufer<b>in</b></i> = kadın satış görevlisi.</Note>
  <QuickChecks items={formChecks} speech={speech} sound={sound}/></>;
}
function Work({speech,sound}:{speech:Speech;sound:Sound}){
 return <><p className="kicker" lang="de">Konu 3 · Ich arbeite als …</p><Heading>Memleketteki meslek, Almanya’daki iş</Heading>
  <p>Almanya’ya gelen birçok insanın <b>mesleği</b> (öğrendiği iş) ile <b>şu an yaptığı iş</b> farklıdır. Almanca bu ikisini iki ayrı kalıpla söyler. Bu ayrım bu ünitenin kalbi.</p>
  {workSections.map(section=><section key={section.title}>
   <h2 className="l1a-h2">{section.title}</h2>
   {section.lead&&<p><Rich text={section.lead}/></p>}
   {section.rows.map(([de,tr])=><PhraseRow key={de} de={de} tr={tr} speech={speech}/>)}
  </section>)}
  <h2 className="l1a-h2">Dört kişi, dört durum</h2>
  <p className="l1a-tr">Her kişi kendi sesiyle konuşuyor.</p>
  <Conversation lines={fourPeople} speech={speech}/>
  <QuickChecks items={workChecks} speech={speech} sound={sound}/></>;
}
function Verbs({speech,sound}:{speech:Speech;sound:Sound}){
 return <><p className="kicker" lang="de">Konu 4 · Verben</p><Heading>Fiiller: <span lang="de">ich, du, Sie</span></Heading>
  <p>Bu ünitenin fiilleri Lektion 1’deki kurala uyar: <b lang="de">ich → -e</b>, <b lang="de">du → -st</b>, <b lang="de">Sie → -en</b>. Satıra dokun, dinle ve yüksek sesle oku.</p>
  <table className="l1a-table l2-verbs"><thead><tr><th/><th lang="de">ich</th><th lang="de">du</th><th lang="de">Sie</th><th/></tr></thead>
   <tbody>{verbTable.map(row=>{const [verb,...forms]=row;return <tr key={verb}><td><b lang="de">{verb}</b></td>{forms.map((form,i)=>{const [stem,end]=verbEnding(verb,form);return <td key={i} lang="de">{stem}<b>{end}</b></td>;})}<td><Say text={verbSay(row)} speech={speech}/></td></tr>;})}</tbody></table>
  <div className="l1a-actions"><button type="button" className="btn secondary small" disabled={speech.busy} onClick={()=>speech.speakAll(verbTable.map(verbSay))}><Play size={16} aria-hidden="true"/>Tabloyu dinle</button></div>
  <h2 className="l1a-h2">Dikkat: <span lang="de">du arbeit<b>est</b></span></h2>
  <p>Fiilin gövdesi <b>-t</b> ile bitiyorsa (<span lang="de">arbeit-</span>), <span lang="de">„du“</span> için araya bir <b>e</b> girer: <i lang="de">du arbeit<b>est</b></i>. „arbeitst“ söylemesi zor; bu yüzden „e“ eklenir.</p>
  <PhraseRow de={duArbeitest} tr="Garson olarak çalışıyorsun, doğru mu?" speech={speech}/>
  <h2 className="l1a-h2">Soruda fiil 2. sırada</h2>
  <p>Soru kelimesi önde, fiil hemen arkasında, sonra kişi:</p>
  <table className="l1a-table"><thead><tr><th>1</th><th>2 · fiil</th><th>3</th><th/></tr></thead>
   <tbody>{orderRows.map(row=><tr key={row.join(' ')}><td lang="de">{row[0]}</td><td lang="de"><b>{row[1]}</b></td><td lang="de">{row[2]}</td><td><Say text={orderRowSay(row)} speech={speech}/></td></tr>)}</tbody></table>
  <QuickChecks items={verbChecks} speech={speech} sound={sound}/></>;
}
function Phrases({speech}:{speech:Speech}){
 return <><p className="kicker" lang="de">Konu 5 · Redemittel</p><Heading>Bu ünitenin kalıpları</Heading>
  <p className="l1a-tr">Bunları ezbere bil: dinle → söyle → kaydet → bakmadan söyle.</p>
  {phrases.map(([de,tr])=><PhraseRow key={de} de={de} tr={tr} speech={speech}/>)}
  <div className="l1a-actions"><button type="button" className="btn secondary small" disabled={speech.busy} onClick={()=>speech.speakAll(phrases.map(([de])=>de))}><Play size={16} aria-hidden="true"/>Tümünü dinle</button></div>
  <Note>Tahmin oyunu: biri <i lang="de">„Was bin ich von Beruf?“</i> der, diğeri tahmin eder: <i lang="de">„Du bist Koch!“</i> — <b lang="de">„Stimmt! Richtig!“</b> ya da <b lang="de">„Leider falsch!“</b></Note>
  <p className="l1a-tr">Şimdi alıştırmalar. Sırayla yapılır; bir alıştırma bitmeden sonraki açılmaz.</p></>;
}

/* ---------- exercises ---------- */
/** Alıştırma 1 · Was ist das? One picture at a time: the hint, three forms; the right form is read after the sound. */
function PictureQuiz(props:StepProps){
 const {speech,sound,onScore,step,runKey}=props;
 const total=pictureItems.length;
 // Left in the middle, it goes on at its picture (an answered one: at the next).
 type Run={round:number;right:number;options:string[];picked:string|null};
 const [saved]=useState(()=>readRun<Run>(runKey,step.id,value=>{
  const round=Number(value.round),right=Number(value.right);if(!(round>=0&&round<total)||!(right>=0&&right<=round+1))return null;
  if(typeof value.picked==='string')return round+1<total?{round:round+1,right,options:shuffle(pictureItems[round+1].options),picked:null}:null;
  const kept=Array.isArray(value.options)&&value.options.length===pictureItems[round].options.length&&pictureItems[round].options.every(option=>(value.options as string[]).includes(option));
  return {round,right,options:kept?value.options as string[]:shuffle(pictureItems[round].options),picked:null};
 }));
 const [round,setRound]=useState(saved?.round??0);const [options,setOptions]=useState(()=>saved?.options??shuffle(pictureItems[0].options));
 const [picked,setPicked]=useState<string|null>(null);const [right,setRight]=useState(saved?.right??0);const [over,setOver]=useState(false);const [wait,setWait]=useState(false);
 useRunSave(runKey,step.id,!over&&(round>0||picked!==null)?{round,right,options,picked}:null);
 const item=pictureItems[round];const answer=item.options[0];const job=jobOf(item.job);const picture=jobPicture(job.key);
 const choose=(option:string)=>{
  if(picked!==null)return;sound.prepare();speech.prepare();setPicked(option);setWait(false);
  const ok=option===answer;const sum=right+(ok?1:0);setRight(sum);
  const after=()=>speech.speak(answer);if(ok)sound.correct(after);else sound.wrong(after);
  if(round===total-1){setOver(true);onScore(step.id,sum,total);}
 };
 const next=()=>{const r=round+1;setRound(r);setOptions(shuffle(pictureItems[r].options));setPicked(null);setWait(false);};
 const again=()=>{setRound(0);setOptions(shuffle(pictureItems[0].options));setPicked(null);setRight(0);setOver(false);};
 // İleri at the bottom opens the next picture once this one is answered; after the last one the next step.
 useInnerNext(props.setInnerNext,()=>{
  if(over)return false;
  if(picked!==null){next();return true;}
  setWait(true);return true;
 });
 const feedback:Feedback=over?(right===total?{ok:true,text:`Harika! ${right} / ${total}`}:scoreFeedback(right,total)):picked===null?(wait?{ok:false,text:'Önce bir cevap seç.'}:null):picked===answer?{ok:true,text:'Doğru!'}:{ok:false,text:'Doğrusu yeşil olan.'};
 return <>
  <p className="kicker" lang="de">Alıştırma 1 · Was ist das?</p><Heading>Resme bak, mesleği seç</Heading>
  <p className="l1a-tr">Resmin altındaki ipucuna bak: kadın mı, erkek mi? Doğru biçimi seç.</p>
  <p className="l1a-mini">Soru {round+1} / {total}</p>
  <img className="l1a-cover l1a-scene l2-quiz-pic" src={picture.src} alt={job.alt} width={picture.width} height={picture.height} decoding="async"/>
  <p className="l1a-question">{item.hint}</p>
  <div className="l1a-opts column" role="group" aria-label={'Soru '+(round+1)}>{options.map(option=><button type="button" key={option} className={'l1a-opt'+(picked!==null&&option===answer?' ok':picked===option?' bad':'')} disabled={picked!==null||over} lang="de" onClick={()=>choose(option)}><Art de={option}/></button>)}</div>
  <FeedbackLine feedback={feedback}/>
  <div className="l1a-actions">
   {picked!==null&&!over&&<button type="button" className="btn small" onClick={next}>Sonraki<ArrowRight size={16} className="vault-direction-icon" aria-hidden="true"/></button>}
   {over&&<button type="button" className="btn secondary small" onClick={again}><RotateCcw size={16} aria-hidden="true"/>Baştan</button>}
  </div>
 </>;
}
/** Alıştırma 2 · the course chat: read and listen, then each person's two sentences from their own word box. */
function ChatExercise(props:StepProps){
 const {speech}=props;
 return <ChoiceExercise kicker="Alıştırma 2 · Der A1-Kurs-Chat" title="Kurs sohbetini oku" lead="Üç kişi mesleğini yazıyor. Önce oku ve dinle, sonra alttaki cümleleri tamamla."
  before={<>
   <Conversation lines={chatLines} speech={speech}/>
   <p className="l1a-mini"><span lang="de">„Und ihr?“</span> = „Ya siz?“ (birden çok kişiye). <span lang="de">ihr</span>’i 2C’de öğreneceğiz; şimdilik tanı yeter.</p>
   <h2 className="l1a-h2" lang="de">Heimatland – Deutschland</h2>
   <p className="l1a-tr">Memleketteki mesleği ne? Almanya’da ne yapıyor? Boşluğa dokun ve seç. Cümle doğru olunca kişi onu okur.</p>
  </>}
  lines={chatFill} dialogue {...props}/>;
}
/** Alıştırma 3 · Mann oder Frau? Write the other form: a right one turns green at once and is read with its article; a
 * wrong one turns red when the learner leaves the box, with the right answer next to it. The score counts first tries. */
function FormWriting(props:StepProps){
 const {speech,sound,onScore,step}=props;
 const [feedback,setFeedback]=useState<Feedback>(null);
 const refs=useRef<(HTMLInputElement|null)[]>([]);const spoken=useRef<boolean[]>(otherForms.map(()=>false));
 const total=otherForms.length;
 const self=useSelfCheck(total,(i,value)=>acceptsAnswer(value,[otherForms[i][2],otherFormSay(otherForms[i])]),firstRight=>{
  onScore(step.id,firstRight,total);setFeedback({ok:true,text:firstRight===total?'Hepsi doğru!':`Hepsi doğru! İlk denemede ${firstRight} / ${total} doğruydu.`});
 });
 const note=(result:SelfCheckResult)=>selfCheckNote(result,self,'Kırmızıyı düzelt; doğrusu yanında yazıyor.',setFeedback);
 const change=(i:number,value:string)=>{
  sound.prepare();speech.prepare();const result=self.change(i,value);note(result);
  if(result!=='right'||spoken.current[i])return;
  spoken.current[i]=true;sound.correct(()=>speech.speak(otherFormSay(otherForms[i])));
 };
 const focusNext=(i:number)=>{const target=otherForms.findIndex((_,k)=>k>i&&self.stateNow(k)!==true);if(target>=0)refs.current[target]?.focus();};
 const restart=()=>{self.reset();setFeedback(null);spoken.current=otherForms.map(()=>false);};
 return <>
  <p className="kicker" lang="de">Alıştırma 3 · Mann oder Frau?</p><Heading>Diğer biçimi yaz</Heading>
  <p className="l1a-tr">Erkek verilmişse kadın biçimini, kadın verilmişse erkek biçimini yaz. Doğru yazınca kutu hemen yeşil olur ve okunur. (ä yerine ae de yazabilirsin.)</p>
  {otherForms.map((row,i)=>{const [given,article,answer]=row;const state=self.state[i]===true?' ok':self.state[i]===false?' bad':'';return <div className="l1a-arow l2-form-row" key={given}>
   <span className="l1a-de l2-form-given" lang="de"><Art de={given}/> → <b className={'l15-'+article}>{article}</b></span>
   <span className="l1a-gap-wrap"><input ref={element=>{refs.current[i]=element;}} className={'l1a-gap'+state} value={self.values[i]} lang="de" dir="ltr" autoCapitalize="off" autoComplete="off" spellCheck={false} aria-label={given+' → '+article} enterKeyHint="next"
    onChange={event=>change(i,event.target.value)} onBlur={()=>note(self.leave(i))} onKeyDown={event=>{if(event.key==='Enter'){event.preventDefault();note(self.leave(i));focusNext(i);}}}/>{self.hinted[i]&&self.state[i]!==true&&<span className="l1a-hint" lang="de">→ {answer}</span>}</span>
  </div>;})}
  <FeedbackLine feedback={feedback}/>
  <div className="l1a-actions"><button type="button" className="btn secondary small" onClick={restart}><RotateCcw size={16} aria-hidden="true"/>Baştan</button></div>
 </>;
}
/** Alıştırma 5 · the verbs of the box into the dialogue, then listen to it. */
function DialogueExercise(props:StepProps){
 const {speech}=props;
 return <ChoiceExercise kicker="Alıştırma 5 · Was passt?" title="Diyaloğu tamamla" bankLead="Kutudaki fiilleri yerleştir:" lines={dialogueLines} dialogue
  after={done=><div className="l1a-actions"><button type="button" className="btn secondary small" disabled={!done||speech.busy} onClick={()=>speech.speakAll(dialogueSay)}><Play size={16} aria-hidden="true"/>Tamamlanan diyaloğu dinle</button></div>}
  {...props}/>;
}
/** The learner's own sentences (Alıştırma 7), kept in the browser. */
function readOwn():string[]{
 try{const saved=JSON.parse(localStorage.getItem(L2A_OWN_KEY)??'[]') as unknown;return ownPrompts.map((_,i)=>Array.isArray(saved)&&typeof saved[i]==='string'?saved[i] as string:'');}catch{return ownPrompts.map(()=>'');}
}
const fitsOwn=(i:number,value:string)=>!!value.trim()&&ownPrompts[i].pattern.test(normalizeLoose(value));
/** Alıştırma 7 · Und du? The learner writes their own job and work; a sentence that fits the pattern turns green. Once the
 * first two fit, the exercise is done; then listen, hide them and say them by heart. */
function OwnExercise({speech,onScore,step}:StepProps){
 const [values,setValues]=useState<string[]>(readOwn);
 const [hidden,setHidden]=useState(false);
 const required=ownPrompts.filter(prompt=>!prompt.optional).length;
 const scored=useRef(false);
 const isDone=(list:readonly string[])=>ownPrompts.every((prompt,i)=>prompt.optional||fitsOwn(i,list[i]));
 const change=(i:number,value:string)=>{
  const next=values.slice();next[i]=value;setValues(next);
  try{localStorage.setItem(L2A_OWN_KEY,JSON.stringify(next));}catch{}
  if(!scored.current&&isDone(next)){scored.current=true;onScore(step.id,required,required);}
 };
 const mine=values.filter((value,i)=>fitsOwn(i,value)).map(value=>value.trim());
 const done=isDone(values);
 return <>
  <p className="kicker" lang="de">Alıştırma 7 · Und du?</p><Heading>Şimdi sen: mesleğin ve işin</Heading>
  <p className="l1a-tr">Kendi cevaplarını yaz. Kalıba uyan cümle yeşil olur. İlk iki cümle bitince alıştırma tamam; sonra dinle, gizle ve ezberden söyle.</p>
  {hidden?<p className="l2-hidden-note" role="status">🙈 Cümlelerin gizlendi. Şimdi hepsini ezberden yüksek sesle söyle.</p>
  :<div className="l1a-dialogue">{ownPrompts.map((prompt,i)=>{const state=values[i].trim()?fitsOwn(i,values[i]):null;return <div key={prompt.question}>
   <div className="l1a-line a"><Portrait who="paul" name="Paul Hoca"/><div className="l1a-bubble l15-say-bubble"><div className="l15-say-text"><span className="l15-name">Paul Hoca</span><span className="l1a-de" lang="de">{prompt.question}</span>{prompt.optional&&<span className="l1a-mini">(isteğe bağlı)</span>}</div><Say text={prompt.question} who="paul" speech={speech}/></div></div>
   <div className="l1a-line b"><div className="l1a-bubble"><input className={'l1a-gap wide'+(state===true?' ok':state===false?' bad':'')} value={values[i]} lang="de" dir="ltr" autoCapitalize="off" autoComplete="off" spellCheck={false} placeholder={prompt.placeholder} aria-label={prompt.question} onChange={event=>change(i,event.target.value)}/>{state===false&&<span className="l1a-mini">Kalıp: <span lang="de">{prompt.placeholder}</span></span>}</div></div>
  </div>;})}</div>}
  <FeedbackLine feedback={done?{ok:true,text:'Süper! Bunlar artık senin cümlelerin. Özet adımındaki konuşma pratiğinde yine karşına çıkacak.'}:null}/>
  <div className="l1a-actions">
   <button type="button" className="btn secondary small" disabled={speech.busy||!mine.length} onClick={()=>speech.speakAll(mine)}><Volume2 size={16} aria-hidden="true"/>Cümlelerimi dinle</button>
   <button type="button" className="btn secondary small" aria-pressed={hidden} onClick={()=>setHidden(!hidden)}>{hidden?<Eye size={16} aria-hidden="true"/>:<EyeOff size={16} aria-hidden="true"/>}{hidden?'Göster':'Gizle'}</button>
  </div>
  <Note>Hatırla: mesleğini söylerken artikel yok: <i lang="de">Ich bin Tierarzt.</i> Kadınsan <b lang="de">-in</b>: <i lang="de">Ich bin Tierärztin.</i></Note>
 </>;
}
/** The learner's answer in the speaking practice: their own sentence when it fits, else the example. */
function practiceAnswer(item:PracticeItem,own:readonly string[]){
 for(const i of item.own??[]){const value=own[i]?.trim();if(value&&fitsOwn(i,value))return value;}
 return item.answer;
}
/** The end: what the learner can say now, a speaking practice with their own sentences and what comes next. */
function EndL2A({progress,onGo,speech}:StepProps){
 const [own]=useState(readOwn);
 return <>
  <p className="kicker" lang="de">Zusammenfassung · Sprechen</p>
  <Heading>Lektion 2A tamam! 🎉</Heading>
  <PaulHoca pose="cheer" className="l1a-paul-big" sound="appear"/>
  <p>Artık şunları yapabilirsin:</p>
  <ul className="l1a-list">
   <li>Meslek sormak: <b lang="de">Was bist du von Beruf?</b> · <b lang="de">Was machen Sie beruflich?</b></li>
   <li>Mesleğini söylemek: <b lang="de">Ich bin … von Beruf.</b> (artikelsiz!)</li>
   <li>Kadın ve erkek biçimleri: <b lang="de">-in</b>, <b lang="de">Köchin</b>, <b lang="de">Ärztin</b>, <b lang="de">Hausfrau</b></li>
   <li>Şu anki işini anlatmak: <b lang="de">Ich arbeite als … bei …</b> · <b lang="de">Ich arbeite jetzt nicht.</b></li>
  </ul>
  <h2 className="l1a-h2">Konuşma pratiği</h2>
  <p className="l1a-tr">Soruyu dinle, cevabı dinle, sonra sen yüksek sesle söyle. İlk üç cevapta senin cümlelerin var (Alıştırma 7).</p>
  <div className="l1a-dialogue">{practiceItems.map(item=>{const answer=practiceAnswer(item,own);return <div className="l2-practice" key={item.question}>
   <div className="l1a-line a"><Portrait who={item.who} name={personName(item.who)}/><div className="l1a-bubble l15-say-bubble"><div className="l15-say-text"><span className="l15-name">{personName(item.who)}</span><span className="l1a-de" lang="de" dir="ltr">{item.question}</span></div><Say text={item.question} who={item.who} speech={speech}/></div></div>
   <div className="l1a-line b"><div className="l1a-bubble l15-say-bubble"><div className="l15-say-text"><span className="l15-name">Sen</span><span className="l1a-de" lang="de" dir="ltr">{answer}</span></div><Say text={answer} speech={speech}/></div></div>
  </div>;})}</div>
  <Note><b>Kısa özet:</b> <span lang="de">Ich bin Koch.</span> (artikel yok) · <span lang="de">Lehrer → Lehrerin</span>, <span lang="de">Koch → Köchin</span>, <span lang="de">Hausmann → Hausfrau</span> · <span lang="de">Ich arbeite als … bei …</span> · <span lang="de">aber</span> · <span lang="de">nicht</span> fiilden sonra · <span lang="de">du arbeitest</span></Note>
  <ProgressMeter progress={progress} language={'tr'} label="Lektion 2A"/>
  <p className="l1a-tr">Sıradaki bölüm: <b lang="de">Teil B – Wer ist das?</b> · yakında.</p>
  <div className="l1a-actions">
   <button type="button" className="btn secondary small" onClick={()=>onGo(berufeStepIndex('resim-sec'))}>Alıştırmaları tekrar yap</button>
   <button type="button" className="btn secondary small" onClick={()=>onGo(-1)}><BookOpen size={16} aria-hidden="true"/>Lektion 2 içindekiler</button>
  </div>
 </>;
}
