'use client';
import {useState,type ReactNode} from 'react';
import {Check,Play,Volume2} from 'lucide-react';
import {normalizeLoose,acceptsAnswer,type SayItem} from '@/lib/willkommen-course';
import {
 willkommenBPictures,alphabet,hardLetters,letterSay,spellItems,languagePhrases,languageWords,languages,languageSay,sieDu,lineSay,
 dialogueSie,dialogueDu,verbTable,spellPhrases,dialogueSpell,nikosCard,ramiCard,dialogueCheck,yesNoWords,intonation,wordsB,wordSay,
 landLanguage,sieOrDu,sieOrDuSay,endingLines,endingSay,hearItems,spellNames,letterQuestions,boxWordsB,boxLinesB,boxSayB,turnLines,turnSay,
 cardLines,cardSay,checkItems,ownPromptsB,testQuestionsB,stepIndexB,type Line,type Profile,
} from '@/lib/willkommen-b-course';
import {ProgressMeter} from './progress-ui';
import {TalkStep} from './talk-step';
import {talkScenarios} from '@/lib/talk-scenarios';
import {PaulHoca} from './paul-hoca';
import {Say,Phrases,Note,Rich,Heading,Portrait,FeedbackLine,useFinish,GapExercise,MatchExercise,ChoiceRows,TestStep,shuffle,type Speech,type StepProps,type Feedback} from './willkommen-ui';

/**
 * Lektion 1, Teil B – Ich spreche ein bisschen Deutsch. (the learner's lesson page, 25 October 2026): the steps.
 * The page around them (notebook, tabs, pager, scores) is app/willkommen-study.tsx; the texts are
 * lib/willkommen-b-course.ts. Every person is read with their own voice (`who`); letters are read by their German names.
 */
export function StepViewB(props:StepProps){
 const {step,speech}=props;
 switch(step.id){
  case 'kapak':return <CoverB {...props}/>;
  case 'sprachen':return <Languages speech={speech}/>;
  case 'diller':return <LanguageGrid speech={speech}/>;
  case 'sie-du':return <SieDu speech={speech}/>;
  case 'diyalog-sie':return <DialogueStep speech={speech} title="Resmî diyalog (Sie)" picture={willkommenBPictures.sie} alt="Sabine ve Omar süpermarkette, kasada resmî sohbet" lines={dialogueSie}/>;
  case 'diyalog-du':return <DialogueStep speech={speech} title="Samimi diyalog (du)" picture={willkommenBPictures.du} alt="Tomasz ve Aisha kurs molasında, ellerinde kahve" lead="Tomasz kursa yeni geldi." lines={dialogueDu} note={<><b lang="de">Ich bin neu hier.</b> = Burada yeniyim. · <b lang="de">Interessant!</b> = İlginç!</>}/>;
  case 'fiiller':return <VerbsB speech={speech}/>;
  case 'alfabe':return <Alphabet speech={speech}/>;
  case 'buchstabieren':return <Spelling speech={speech}/>;
  case 'steckbrief':return <ProfileStep speech={speech}/>;
  case 'kelimeler':return <WordListB speech={speech}/>;
  case 'land-sprache':return <MatchExercise kicker="Alıştırma 1 · Land → Sprache" title="Ülkeyi diliyle eşleştir" pairs={landLanguage.map(([land,language])=>[land,language] as const)} sayFor={i=>[landLanguage[i][2]]} {...props}/>;
  case 'sie-oder-du':return <ChoiceRows kicker="Alıştırma 2 · Sie oder du?" title="Sie mi, du mu?" lead="Fiile bak: -st → du, -en → Sie. Fiil yoksa isme bak: ön ad → du, Frau / Herr → Sie." rows={sieOrDu.map((item,i)=>({key:String(i),label:item.before+' … '+item.after,before:<span className="l1a-land" lang="de">{item.before}</span>,after:<span className="l1a-land" lang="de">{item.after}</span>,options:[{value:'du',label:'du'},{value:'Sie',label:'Sie'}],answer:item.answer,say:sieOrDuSay(item)}))} {...props}/>;
  case 'endungen':return <GapExercise kicker="Alıştırma 3 · Verben" title="Fiil ekini yaz" lead="Kutuya sadece eki yaz (e, st, t, en) ya da sein’ı (bin, bist, sind)." lines={endingLines} say={endingSay} {...props}/>;
  case 'hoeren':return <HearExercise {...props}/>;
  case 'namen':return <NamesExercise {...props}/>;
  case 'buchstabe':return <LetterExercise {...props}/>;
  case 'kutu':return <GapExercise kicker="Alıştırma 7 · Was passt?" title="Kutudan doğru kelimeyi seç" bank lines={boxLinesB} choices={boxWordsB} say={boxSayB} speakers={{a:'aisha',b:'tomasz'}} {...props}/>;
  case 'umformen':return <GapExercise kicker="Alıştırma 8 · Sie ↔ du" title="Soruyu çevir" lead="Resmî soruyu samimiye (ya da tersine) çevir." lines={turnLines} wide say={turnSay} speakers={{a:'paul',b:'paul'}} {...props}/>;
  case 'karte':return <GapExercise kicker="Alıştırma 9 · Steckbrief" title="Karttan cümle kur" lead="Rami kendini tanıtıyor. 3 cümle yaz: ich ile ya da onun hakkında (er, Sie). İpucu: Libanon artikel alır." before={<ProfileCard card={ramiCard}/>} lines={cardLines} wide say={cardSay} speakers={{a:'rami',b:'rami'}} {...props}/>;
  case 'richtig':return <ChoiceRows kicker="Alıştırma 10 · Alles richtig?" title="Doğru mu? Nikos cevap veriyor." lead="Yasemin karttan cümle kuruyor. Doğruysa “Ja, richtig!”, yanlışsa “Nein.” seç." before={<ProfileCard card={nikosCard}/>} wide rows={checkItems.map((item,i)=>({key:String(i),label:item.statement,before:<span className="l1a-land l1a-statement" lang="de"><Say text={item.statement} who="yasemin" speech={speech}/>{item.statement}</span>,options:[{value:'ja',label:'Ja, richtig!'},{value:'nein',label:'Nein.'}],answer:item.answer,say:{text:item.reply,who:'nikos'},reveal:<span className="l1a-mini l1a-reply" lang="de">Nikos: {item.reply}</span>}))} {...props}/>;
  case 'sen':return <OwnB {...props}/>;
  case 'test':return <TestStep label="Lektion 1B · Test" questions={testQuestionsB} sayFor={i=>testQuestionsB[i][3]} {...props}/>;
  case 'konus':return <TalkStep scenario={talkScenarios.l1b} {...props}/>;
  case 'bitti':return <EndB {...props}/>;
 }
 return null;
}

/* ---------- small pieces ---------- */
/** Reads a word letter by letter (one clip per German letter name, slowly). */
export function SpellButton({word,speech,label}:{word:string;speech:Speech;label?:string}){
 return <button type="button" className={label?'btn secondary small l1a-say-wide':'l12-say'} disabled={speech.busy} aria-label={'Harf harf dinle: '+word} title="Harf harf dinle" onClick={()=>speech.speakAll(spellItems(word))}>{label?<Play size={16} aria-hidden="true"/>:<Volume2 size={18} aria-hidden="true"/>}{label}</button>;
}
/** A dialogue: each line with the speaker's portrait and voice; "Tümünü dinle" reads it as a conversation. */
export function DialogueLines({lines,speech}:{lines:Line[];speech:Speech}){
 const first=lines[0]?.who;
 return <div className="l1a-dialogue">{lines.map((line,i)=><div className={'l1a-line '+(line.who===first?'a':'b')} key={i}><Portrait who={line.who} name={line.who[0].toUpperCase()+line.who.slice(1)}/><div className="l1a-bubble"><span className="l1a-de" lang="de" dir="ltr">{line.de}</span><span className="l1a-tr">{line.tr}</span></div><Say text={line.say??line.de} who={line.who} speech={speech}/></div>)}</div>;
}
export function ListenAll({lines,speech}:{lines:Line[];speech:Speech}){
 return <div className="l1a-actions"><button type="button" className="btn secondary small" disabled={speech.busy} onClick={()=>speech.speakAll(lines.map(lineSay))}><Play size={16} aria-hidden="true"/>Tümünü dinle</button></div>;
}
export function Picture({src,width,height,alt}:{src:string;width:number;height:number;alt:string}){
 return <img className="l1a-cover l1a-scene" src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async"/>;
}
export function WordTable({items}:{items:readonly (readonly [string,string])[]}){
 const rows:(readonly [string,string])[][]=[];for(let i=0;i<items.length;i+=2)rows.push(items.slice(i,i+2));
 return <table className="l1a-table"><tbody>{rows.map((row,i)=><tr key={i}>{row.map(([de,tr])=><td key={de} colSpan={1}><b lang="de">{de}</b> <span className="l1a-mini">{tr}</span></td>)}</tr>)}</tbody></table>;
}
export function ProfileCard({card}:{card:Profile}){
 return <div className="l1a-profile"><Portrait who={card.who} name={card.name.split(' ')[0]}/><dl lang="de"><dt>Name:</dt><dd>{card.name}</dd><dt>Land:</dt><dd>{card.land}</dd><dt>Sprachen:</dt><dd>{card.languages}</dd></dl></div>;
}

/* ---------- teaching steps ---------- */
function CoverB({progress,scores}:StepProps){
 const started=Object.keys(scores).length>0;
 return <>
  <p className="kicker" lang="de">Lektion 1 · Willkommen!</p>
  <Heading><span lang="de">B — Ich spreche ein bisschen Deutsch.</span></Heading>
  <p>Bu derste öğreneceklerin:</p>
  <ul className="l1a-list"><li>Hangi dilleri konuştuğunu söylemek: <b lang="de">Ich spreche …</b></li><li><b lang="de">Sie</b> mi, <b lang="de">du</b> mu? Resmî ve samimi konuşma</li><li>Fiil çekimi: <span lang="de">ich / du / Sie</span></li><li>Alfabe ve adını harf harf söylemek</li><li>Anlamadığında sormak: <b lang="de">Wie bitte?</b></li></ul>
  {started&&<ProgressMeter progress={progress} language={'tr'} label="Lektion 1B"/>}
 </>;
}
function Languages({speech}:{speech:Speech}){
 return <><Heading>Hangi dilleri konuşuyorsunuz?</Heading>
  <Phrases items={languagePhrases} speech={speech}/>
  <WordTable items={languageWords}/>
  <Note>Dil adları büyük harfle yazılır ve çoğu ülke adından gelir: <span lang="de">Türkei → <b>Türkisch</b>, Polen → <b>Polnisch</b>, Griechenland → <b>Griechisch</b></span>. Dikkat: <span lang="de">Deutschland → <b>Deutsch</b>, Iran → <b>Farsi</b>, Thailand → <b>Thai</b></span>.</Note></>;
}
function LanguageGrid({speech}:{speech:Speech}){
 return <><Heading>Diller</Heading><p className="l1a-tr">Dokun, dinle.</p>
  <div className="l1a-langs">{languages.map(([de,tr])=>{const say=languageSay(de);return <button type="button" key={de} className={'l1a-flag l1a-lang'+(speech.busy&&speech.activeText===say?' playing':'')} onClick={()=>speech.speak(say)} aria-label={'Dinle: '+say}><b lang="de">{de}</b><small>{tr}</small></button>;})}</div></>;
}
function SieDu({speech}:{speech:Speech}){
 return <><Heading><span lang="de">Sie</span> mi, <span lang="de">du</span> mu?</Heading>
  <div className="l1a-two">
   <div><p className="l1a-two-head"><b lang="de">Sie</b> — resmî (siz)</p><p className="l1a-tr">Tanımadığın yetişkinler, resmî yerler. <b lang="de">Herr / Frau</b> + soyadı.</p></div>
   <div><p className="l1a-two-head"><b lang="de">du</b> — samimi (sen)</p><p className="l1a-tr">Arkadaşlar, aile, çocuklar, kurs arkadaşları. İsimle.</p></div>
  </div>
  <table className="l1a-table l1a-sie-du"><thead><tr><th lang="de">Sie</th><th lang="de">du</th></tr></thead>
   <tbody>{sieDu.map(([sie,du])=><tr key={sie}><td><span lang="de">{sie}</span> <Say text={sie} speech={speech}/></td><td><span lang="de">{du}</span> <Say text={du} speech={speech}/></td></tr>)}</tbody></table>
  <Note>Selam da değişir: resmîde <b lang="de">Guten Tag!</b>, samimide <b lang="de">Hallo!</b></Note></>;
}
function DialogueStep({speech,title,picture,alt,lead,lines,note}:{speech:Speech;title:string;picture:{src:string;width:number;height:number};alt:string;lead?:string;lines:Line[];note?:ReactNode}){
 return <><Heading>{title}</Heading>
  <Picture {...picture} alt={alt}/>
  {lead&&<p className="l1a-tr">{lead}</p>}
  <DialogueLines lines={lines} speech={speech}/>
  <ListenAll lines={lines} speech={speech}/>
  {note&&<Note>{note}</Note>}</>;
}
function VerbsB({speech}:{speech:Speech}){
 return <><Heading>Fiil çekimi: <span lang="de">ich / du / Sie</span></Heading>
  <div className="l1a-scroll"><table className="l1a-table l1a-verb-grid" lang="de"><thead><tr><th></th>{verbTable.map(row=><th key={row.verb}>{row.verb}</th>)}</tr></thead>
   <tbody>{(['ich','du','sie'] as const).map(person=><tr key={person}><td><b>{person==='sie'?'Sie':person}</b></td>{verbTable.map(row=><td key={row.verb}><Rich text={row[person]}/></td>)}</tr>)}</tbody></table></div>
  <div className="l1a-actions">{verbTable.map(row=><Say key={row.verb} text={row.say} speech={speech} label={row.verb} wide/>)}</div>
  <Note>Kural: <b lang="de">ich → -e</b>, <b lang="de">du → -st</b>, <b lang="de">Sie → -en</b>. İstisnalar: <b lang="de">heißen</b> → <span lang="de">du heiß<b>t</b></span> (ß’den sonra sadece <b>-t</b>). <b lang="de">sprechen</b> → <span lang="de">du spr<b>i</b>chst</span> (e → i). <b lang="de">sein</b> düzensiz: <span lang="de">bin / bist / sind</span>.</Note></>;
}
function Alphabet({speech}:{speech:Speech}){
 return <><Heading><span lang="de">Das Alphabet</span></Heading>
  <Picture {...willkommenBPictures.alphabet} alt="Paul Hoca alfabe tahtasının önünde"/>
  <p className="l1a-tr">Harfe dokun, Almanca adını dinle. Mavi çerçeveliler Türkçeden farklı okunur.</p>
  <div className="l1a-abc">{alphabet.map(([letter,hint,say])=><button type="button" key={letter} className={'l1a-letter'+(hardLetters.includes(letter)?' hard':'')+(speech.busy&&speech.activeText===say?' playing':'')} onClick={()=>speech.speak(say)} aria-label={'Dinle: '+letter+' ('+hint+')'}><b lang="de">{letter}</b><small>{hint}</small></button>)}</div>
  <Note>Dikkat: <b>J</b> = yot, <b>V</b> = fau, <b>W</b> = ve, <b>Y</b> = üpsilon, <b>Z</b> = tset, <b>C</b> = tse, <b>E</b> ince “e”, <b>I</b> “i”. Umlautlar: <b>Ä, Ö, Ü</b>. <b>ß</b> = estset, “ss” gibi okunur.</Note></>;
}
function Spelling({speech}:{speech:Speech}){
 return <><Heading>Harf harf söyleme</Heading>
  {spellPhrases.map(([de,tr,say])=><div className="l1a-phrase" key={de}><div className="l1a-phrase-text"><span className="l1a-de" lang="de" dir="ltr">{de}</span><span className="l1a-tr">{tr}</span></div><Say text={say} speech={speech}/></div>)}
  <h3 className="l1a-h2">Diyalog: Yasemin ve Nikos</h3>
  <DialogueLines lines={dialogueSpell} speech={speech}/>
  <ListenAll lines={dialogueSpell} speech={speech}/>
  <p className="l1a-tr l1a-spell-row">Harfleri tek tek dinle: <b lang="de">NIKOS</b> <SpellButton word="Nikos" speech={speech}/> · <b lang="de">PAPADAKIS</b> <SpellButton word="Papadakis" speech={speech}/></p></>;
}
function ProfileStep({speech}:{speech:Speech}){
 return <><Heading><span lang="de">Steckbrief</span> (kimlik kartı)</Heading>
  <p className="l1a-tr">Bir kişinin bilgilerini kısaca yazarsın:</p>
  <ProfileCard card={nikosCard}/>
  <h3 className="l1a-h2"><span lang="de">Alles richtig?</span> (Hepsi doğru mu?)</h3>
  <p className="l1a-tr">Karttan cümle kurar, karşındaki doğrular ya da düzeltir:</p>
  <DialogueLines lines={dialogueCheck} speech={speech}/>
  <ListenAll lines={dialogueCheck} speech={speech}/>
  <WordTable items={yesNoWords}/>
  <Note>W-soruları (<b lang="de">Wie? Woher? Welche?</b>) söylenirken ses sonda <b>düşer</b>: {intonation.map(text=><span className="l1a-into" key={text}><span lang="de">{text}</span> ↘ <Say text={text} speech={speech}/></span>)}</Note></>;
}
function WordListB({speech}:{speech:Speech}){
 return <><Heading>Kelime listesi</Heading>
  <table className="l1a-table l1a-words"><tbody>{wordsB.map(([de,tr])=><tr key={de}><td><span className="l1a-de" lang="de">{de}</span></td><td>{tr}</td><td><Say text={wordSay(de)} speech={speech}/></td></tr>)}</tbody></table>
  <p className="l1a-tr">Konu bitti. Şimdi alıştırmalar başlıyor.</p></>;
}

/* ---------- Teil B's own exercises ---------- */
/** Exercise 4 · listen and tick every language the person speaks, then check each person. */
function HearExercise(props:StepProps){
 const {speech,sound}=props;const finish=useFinish(props);
 const [ticked,setTicked]=useState<number[][]>(()=>hearItems.map(()=>[]));const [checked,setChecked]=useState<(boolean|null)[]>(()=>hearItems.map(()=>null));
 const [feedback,setFeedback]=useState<Feedback>(null);
 const toggle=(i:number,j:number)=>{if(checked[i]!==null)return;const next=ticked.map((list,k)=>k!==i?list:list.includes(j)?list.filter(x=>x!==j):[...list,j]);setTicked(next);};
 const check=(i:number)=>{if(checked[i]!==null)return;sound.prepare();speech.prepare();const item=hearItems[i];const chosen=ticked[i];
  const ok=chosen.length===item.answers.length&&chosen.every(j=>item.answers.includes(j));const next=checked.slice();next[i]=ok;setChecked(next);
  const done=next.filter(value=>value!==null).length;const right=next.filter(Boolean).length;
  if(done===hearItems.length){setFeedback({ok:right===hearItems.length,text:`${right} / ${hearItems.length} doğru`});finish(right,hearItems.length);}
  else if(ok)sound.correct();else sound.wrong();};
 return <>
  <p className="kicker" lang="de">Alıştırma 4 · Hören Sie</p><Heading>Dinle: hangi dilleri konuşuyorlar?</Heading>
  <p className="l1a-tr">Dinle, doğru olanların hepsini işaretle, sonra “Kontrol”.</p>
  {hearItems.map((item,i)=><div className="l1a-listen" key={item.key}>
   <div className="l1a-person"><Portrait who={item.key} name={item.name.split(' ')[0]}/><div className="l1a-phrase-text"><span className="l1a-de">{i+1}. <span lang="de">{item.name}</span></span><span className="l1a-tr" lang="de">Ich spreche …</span></div><Say text={item.text} who={item.key} speech={speech} wide secret/></div>
   <div className="l1a-opts wrap" role="group" aria-label={item.name}>{item.options.map((option,j)=>{const on=ticked[i].includes(j);const state=checked[i]===null?'':item.answers.includes(j)?' ok':on?' bad':'';return <button type="button" key={option} className={'l1a-opt l1a-tick'+(on?' on':'')+state} aria-pressed={on} disabled={checked[i]!==null} lang="de" onClick={()=>toggle(i,j)}>{on?<Check size={15} aria-hidden="true"/>:null}{option}</button>;})}
    <button type="button" className="btn small" disabled={checked[i]!==null||!ticked[i].length} onClick={()=>check(i)}>Kontrol</button></div>
   {checked[i]!==null&&<p className={'l1a-mini'+(checked[i]?' l1a-ok-text':' l1a-bad-text')}>{checked[i]?'Doğru!':'Doğrusu yeşil olanlar.'} Metin: <span lang="de" dir="ltr">{item.text}</span></p>}
  </div>)}
  <FeedbackLine feedback={feedback}/>
 </>;
}
/** Exercise 5 · hear the letters, write the name. */
function NamesExercise(props:StepProps){
 const {speech,sound}=props;const finish=useFinish(props);
 const [values,setValues]=useState<string[]>(()=>spellNames.map(()=>''));const [checked,setChecked]=useState<(boolean|null)[]>(()=>spellNames.map(()=>null));
 const [feedback,setFeedback]=useState<Feedback>(null);
 const check=()=>{sound.prepare();speech.prepare();const result=spellNames.map((name,i)=>acceptsAnswer(values[i],[name]));setChecked(result);const right=result.filter(Boolean).length;
  setFeedback(right===spellNames.length?{ok:true,text:'Hepsi doğru!'}:{ok:false,text:`${right} / ${spellNames.length} doğru. Kırmızıları düzelt; doğrusu yanında yazıyor.`});finish(right,spellNames.length);};
 const reveal=()=>{setValues(spellNames.slice());setChecked(spellNames.map(()=>true));setFeedback({ok:true,text:'Cevaplar gösterildi.'});};
 return <>
  <p className="kicker" lang="de">Alıştırma 5 · Buchstabieren</p><Heading>Harf harf dinle, adı yaz</Heading>
  <p className="l1a-tr">Harfleri dinle, adı kutuya yaz. (ß yerine ss, ü yerine ue yazabilirsin.)</p>
  {spellNames.map((name,i)=><div className="l1a-arow l1a-name-row" key={name}>
   <SpellButton word={name} speech={speech} label={String(i+1)}/>
   <span className="l1a-gap-wrap"><input className={'l1a-gap l1a-name-gap'+(checked[i]===true?' ok':checked[i]===false?' bad':'')} value={values[i]} lang="de" dir="ltr" autoCapitalize="off" autoComplete="off" spellCheck={false} aria-label={'Ad '+(i+1)} onChange={event=>{const next=values.slice();next[i]=event.target.value;setValues(next);if(checked[i]!==null){const state=checked.slice();state[i]=null;setChecked(state);}}}/>{checked[i]===false&&<span className="l1a-hint" lang="de">→ {name}</span>}</span>
  </div>)}
  <div className="l1a-actions"><button type="button" className="btn small" onClick={check}><Check size={16} aria-hidden="true"/>Kontrol et</button><button type="button" className="btn secondary small" onClick={reveal}>Cevapları göster</button></div>
  <FeedbackLine feedback={feedback}/>
 </>;
}
/** Exercise 6 · which letter? (the options are shuffled once). */
function LetterExercise(props:StepProps){
 const {speech}=props;
 // The options are shuffled once; the say buttons are made on every render (they show whether the voice is busy).
 const [options]=useState(()=>letterQuestions.map(item=>shuffle(item.options)));
 const rows=letterQuestions.map((item,i)=>({key:String(i),label:'Harf '+(i+1),before:<Say text={letterSay(item.answer)} speech={speech} label={String(i+1)} wide secret/>,options:options[i].map(option=>({value:option,label:option})),answer:item.answer,say:letterSay(item.answer) as SayItem}));
 return <ChoiceRows kicker="Alıştırma 6 · Welcher Buchstabe?" title="Dinle: hangi harf?" lead="Dinle, duyduğun harfi seç." rows={rows} {...props}/>;
}
/** Exercise 11 · now you: write your languages and spell your name (not scored). */
function OwnB({speech,onScore,step}:StepProps){
 const [values,setValues]=useState(['','']);const [state,setState]=useState<(boolean|null)[]>([null,null]);
 const change=(i:number,value:string)=>{const next=values.slice();next[i]=value;setValues(next);const s=state.slice();s[i]=value.trim()?ownPromptsB[i].pattern.test(normalizeLoose(value)):null;setState(s);if(s.every(value=>value===true))onScore(step.id,s.length,s.length);}; // all sentences fit: the step shows done
 const letters=values[1].replace(/^\s*ich\s+buchstabiere\s*:?/i,'').trim();
 return <>
  <p className="kicker" lang="de">Alıştırma 11 · Jetzt du</p><Heading>Şimdi sen</Heading><p className="l1a-tr">Kendi dillerinle ve adınla yaz, sonra dinle.</p>
  <div className="l1a-dialogue">{ownPromptsB.map((prompt,i)=><div key={prompt.question}>
   <div className="l1a-line a"><div className="l1a-bubble"><span className="l1a-de" lang="de">{prompt.question}</span></div><Say text={prompt.question} who="paul" speech={speech}/></div>
   <div className="l1a-line b"><div className="l1a-bubble"><input className={'l1a-gap wide'+(state[i]===true?' ok':state[i]===false?' bad':'')} value={values[i]} lang="de" dir="ltr" autoCapitalize="off" autoComplete="off" placeholder={prompt.placeholder} aria-label={prompt.question} onChange={event=>change(i,event.target.value)}/>{state[i]===false&&<span className="l1a-mini">Kalıp: <span lang="de">{prompt.placeholder}</span></span>}</div></div>
  </div>)}</div>
  <div className="l1a-actions">
   <button type="button" className="btn secondary small" disabled={speech.busy||!values[0].trim()} onClick={()=>speech.speak(values[0].trim())}><Volume2 size={16} aria-hidden="true"/>Cümlemi dinle</button>
   <button type="button" className="btn secondary small" disabled={speech.busy||!letters} onClick={()=>speech.speakAll(spellItems(letters))}><Volume2 size={16} aria-hidden="true"/>Adımı harf harf dinle</button>
  </div>
  <Note>Harfleri Almanca adlarıyla söylemeyi unutma: <b>J</b> = yot, <b>Y</b> = üpsilon, <b>V</b> = fau.</Note>
 </>;
}
function EndB({progress,onGo,onPart}:StepProps){
 return <>
  <Heading>Lektion 1B tamam! 🎉</Heading>
  <PaulHoca pose="cheer" className="l1a-paul-big" sound="appear"/>
  <p>Artık şunları yapabilirsin:</p>
  <ul className="l1a-list"><li><b lang="de">Ich spreche … und ein bisschen Deutsch.</b> – dillerini söyleme</li><li><b lang="de">Sie</b> ve <b lang="de">du</b> ile soru sorma</li><li><span lang="de">ich / du / Sie</span> fiil çekimi (<b lang="de">-e / -st / -en</b>)</li><li>Alfabe ve <b lang="de">Ich buchstabiere: …</b></li><li><b lang="de">Wie bitte? Wie schreibt man das?</b> – anlamadığında sorma</li><li><b lang="de">Ja, richtig! / Nein, …</b> – doğrulama</li></ul>
  <ProgressMeter progress={progress} language={'tr'} label="Lektion 1B"/>
  <p className="l1a-tr">Sıradaki bölüm: <b lang="de">Teil C – Guten Tag!</b></p>
  <div className="l1a-actions"><button type="button" className="btn small" onClick={()=>onPart('c',0)}>Teil C'ye geç</button><button type="button" className="btn secondary small" onClick={()=>onGo(stepIndexB('land-sprache'))}>Alıştırmaları tekrar yap</button><button type="button" className="btn secondary small" onClick={()=>onGo(-1)}>Lektion 1 içindekiler</button></div>
 </>;
}
