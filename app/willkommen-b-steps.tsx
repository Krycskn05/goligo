'use client';
import {useRef,useState,type ReactNode} from 'react';
import {Check,Play,Volume2} from 'lucide-react';
import {normalizeLoose,acceptsAnswer,type SayItem} from '@/lib/willkommen-course';
import {
 willkommenBPictures,alphabet,hardLetters,letterSay,spellItems,languagePhrases,languageWords,languages,languageSay,sieDu,lineSay,
 dialogueSie,dialogueDu,verbTable,spellPhrases,dialogueSpell,nikosCard,ramiCard,dialogueCheck,yesNoWords,intonation,wordsB,wordSay,
 landLanguage,sieOrDu,sieOrDuSay,endingLines,endingSay,hearItems,spellNames,letterQuestions,boxWordsB,boxLinesB,boxSayB,turnLines,turnSay,
 cardLines,cardSay,checkItems,ownPromptsB,testQuestionsB,stepIndexB,type Line,type Profile,
} from '@/lib/willkommen-b-course';
import {ProgressMeter} from './progress-meter';
import {TalkStep} from './talk-step';
import {talkScenarios} from '@/lib/talk-scenarios';
import {Applause} from './study-shared';
import {Say,Phrases,Note,Rich,Tx,Heading,Portrait,FeedbackLine,scoreFeedback,useFinish,useSelfCheck,selfCheckNote,GapExercise,MatchExercise,ChoiceRows,TestStep,shuffle,type Speech,type SelfCheckResult,type StepProps,type Feedback} from './willkommen-ui';
import {ut,utBeside} from '@/lib/unit-i18n';

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
  case 'diyalog-du':return <DialogueStep speech={speech} title="Samimi diyalog (du)" picture={willkommenBPictures.du} alt="Tomasz ve Aisha kurs molasında, ellerinde kahve" lead="Tomasz kursa yeni geldi." lines={dialogueDu} note={<Tx text="*Ich bin neu hier.* = Burada yeniyim. · *Interessant!* = İlginç!"/>}/>;
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
 return <button type="button" className={label?'btn secondary small l1a-say-wide':'l12-say'} disabled={speech.busy} aria-label={ut('Harf harf dinle')+': '+word} title={ut('Harf harf dinle')} onClick={()=>speech.speakAll(spellItems(word))}>{label?<Play size={16} aria-hidden="true"/>:<Volume2 size={18} aria-hidden="true"/>}{label}</button>;
}
/** A dialogue: each line with the speaker's portrait and voice; "Tümünü dinle" reads it as a conversation. */
export function DialogueLines({lines,speech}:{lines:Line[];speech:Speech}){
 const first=lines[0]?.who;
 return <div className="l1a-dialogue">{lines.map((line,i)=><div className={'l1a-line '+(line.who===first?'a':'b')} key={i}><Portrait who={line.who} name={line.who[0].toUpperCase()+line.who.slice(1)}/><div className="l1a-bubble"><span className="l1a-de" lang="de" dir="ltr">{line.de}</span><span className="l1a-tr">{utBeside(line.de,line.tr)}</span></div><Say text={line.say??line.de} who={line.who} speech={speech}/></div>)}</div>;
}
export function ListenAll({lines,speech}:{lines:Line[];speech:Speech}){
 return <div className="l1a-actions"><button type="button" className="btn secondary small" disabled={speech.busy} onClick={()=>speech.speakAll(lines.map(lineSay))}><Play size={16} aria-hidden="true"/>{ut('Tümünü dinle')}</button></div>;
}
export function Picture({src,width,height,alt}:{src:string;width:number;height:number;alt:string}){
 return <img className="l1a-cover l1a-scene" src={src} alt={ut(alt)} width={width} height={height} loading="lazy" decoding="async"/>;
}
export function WordTable({items}:{items:readonly (readonly [string,string])[]}){
 const rows:(readonly [string,string])[][]=[];for(let i=0;i<items.length;i+=2)rows.push(items.slice(i,i+2));
 return <table className="l1a-table"><tbody>{rows.map((row,i)=><tr key={i}>{row.map(([de,tr])=><td key={de} colSpan={1}><b lang="de">{de}</b> <span className="l1a-mini">{utBeside(de,tr)}</span></td>)}</tr>)}</tbody></table>;
}
export function ProfileCard({card}:{card:Profile}){
 return <div className="l1a-profile"><Portrait who={card.who} name={card.name.split(' ')[0]}/><dl lang="de"><dt>Name:</dt><dd>{card.name}</dd><dt>Land:</dt><dd>{card.land}</dd><dt>Sprachen:</dt><dd>{card.languages}</dd></dl></div>;
}

/* ---------- teaching steps ---------- */
function CoverB(_props:StepProps){ // the part's progress is on the left page (no second bar here, 30 October 2026)
 return <>
  <p className="kicker" lang="de">Lektion 1 · Willkommen!</p>
  <Heading><span lang="de">B — Ich spreche ein bisschen Deutsch.</span></Heading>
  <p>{ut('Bu derste öğreneceklerin:')}</p>
  <ul className="l1a-list"><li><Tx text="Hangi dilleri konuştuğunu söylemek: *Ich spreche …*"/></li><li><Tx text="*Sie* mi, *du* mu? Resmî ve samimi konuşma"/></li><li><Tx text="Fiil çekimi: _ich / du / Sie_"/></li><li>{ut('Alfabe ve adını harf harf söylemek')}</li><li><Tx text="Anlamadığında sormak: *Wie bitte?*"/></li></ul>
 </>;
}
function Languages({speech}:{speech:Speech}){
 return <><Heading>{ut('Hangi dilleri konuşuyorsunuz?')}</Heading>
  <Phrases items={languagePhrases} speech={speech}/>
  <WordTable items={languageWords}/>
  <Note><Tx text="Dil adları büyük harfle yazılır ve çoğu ülke adından gelir: _Türkei → **Türkisch**, Polen → **Polnisch**, Griechenland → **Griechisch**_. Dikkat: _Deutschland → **Deutsch**, Iran → **Farsi**, Thailand → **Thai**_."/></Note></>;
}
function LanguageGrid({speech}:{speech:Speech}){
 return <><Heading>{ut('Diller')}</Heading><p className="l1a-tr">{ut('Dokun, dinle.')}</p>
  <div className="l1a-langs">{languages.map(([de,tr])=>{const say=languageSay(de);return <button type="button" key={de} className={'l1a-flag l1a-lang'+(speech.busy&&speech.activeText===say?' playing':'')} onClick={()=>speech.speak(say)} aria-label={ut('Dinle')+': '+say}><b lang="de">{de}</b><small>{ut(tr)}</small></button>;})}</div></>;
}
function SieDu({speech}:{speech:Speech}){
 return <><Heading><Tx text="_Sie_ mi, _du_ mu?"/></Heading>
  <div className="l1a-two">
   <div><p className="l1a-two-head"><Tx text="*Sie* — resmî (siz)"/></p><p className="l1a-tr"><Tx text="Tanımadığın yetişkinler, resmî yerler. *Herr / Frau* + soyadı."/></p></div>
   <div><p className="l1a-two-head"><Tx text="*du* — samimi (sen)"/></p><p className="l1a-tr">{ut('Arkadaşlar, aile, çocuklar, kurs arkadaşları. İsimle.')}</p></div>
  </div>
  <table className="l1a-table l1a-sie-du"><thead><tr><th lang="de">Sie</th><th lang="de">du</th></tr></thead>
   <tbody>{sieDu.map(([sie,du])=><tr key={sie}><td><span lang="de">{sie}</span> <Say text={sie} speech={speech}/></td><td><span lang="de">{du}</span> <Say text={du} speech={speech}/></td></tr>)}</tbody></table>
  <Note><Tx text="Selam da değişir: resmîde *Guten Tag!*, samimide *Hallo!*"/></Note></>;
}
function DialogueStep({speech,title,picture,alt,lead,lines,note}:{speech:Speech;title:string;picture:{src:string;width:number;height:number};alt:string;lead?:string;lines:Line[];note?:ReactNode}){
 return <><Heading>{ut(title)}</Heading>
  <Picture {...picture} alt={alt}/>
  {lead&&<p className="l1a-tr">{ut(lead)}</p>}
  <DialogueLines lines={lines} speech={speech}/>
  <ListenAll lines={lines} speech={speech}/>
  {note&&<Note>{note}</Note>}</>;
}
function VerbsB({speech}:{speech:Speech}){
 return <><Heading><Tx text="Fiil çekimi: _ich / du / Sie_"/></Heading>
  <div className="l1a-scroll"><table className="l1a-table l1a-verb-grid" lang="de"><thead><tr><th></th>{verbTable.map(row=><th key={row.verb}>{row.verb}</th>)}</tr></thead>
   <tbody>{(['ich','du','sie'] as const).map(person=><tr key={person}><td><b>{person==='sie'?'Sie':person}</b></td>{verbTable.map(row=><td key={row.verb}><Rich text={row[person]}/></td>)}</tr>)}</tbody></table></div>
  <div className="l1a-actions">{verbTable.map(row=><Say key={row.verb} text={row.say} speech={speech} label={row.verb} wide/>)}</div>
  <Note><Tx text="Kural: *ich → -e*, *du → -st*, *Sie → -en*. İstisnalar: *heißen* → _du heiß**t**_ (ß’den sonra sadece **-t**). *sprechen* → _du spr**i**chst_ (e → i). *sein* düzensiz: _bin / bist / sind_."/></Note></>;
}
function Alphabet({speech}:{speech:Speech}){
 return <><Heading><span lang="de">Das Alphabet</span></Heading>
  <Picture {...willkommenBPictures.alphabet} alt="Paul Hoca alfabe tahtasının önünde"/>
  <p className="l1a-tr">{ut('Harfe dokun, Almanca adını dinle. Mavi çerçeveliler Türkçeden farklı okunur.')}</p>
  <div className="l1a-abc">{alphabet.map(([letter,hint,say])=><button type="button" key={letter} className={'l1a-letter'+(hardLetters.includes(letter)?' hard':'')+(speech.busy&&speech.activeText===say?' playing':'')} onClick={()=>speech.speak(say)} aria-label={ut('Dinle')+': '+letter+' ('+ut(hint)+')'}><b lang="de">{letter}</b><small>{ut(hint)}</small></button>)}</div>
  <Note><Tx text="Dikkat: **J** = yot, **V** = fau, **W** = ve, **Y** = üpsilon, **Z** = tset, **C** = tse, **E** ince “e”, **I** “i”. Umlautlar: **Ä, Ö, Ü**. **ß** = estset, “ss” gibi okunur."/></Note></>;
}
function Spelling({speech}:{speech:Speech}){
 return <><Heading>{ut('Harf harf söyleme')}</Heading>
  {spellPhrases.map(([de,tr,say])=><div className="l1a-phrase" key={de}><div className="l1a-phrase-text"><span className="l1a-de" lang="de" dir="ltr">{de}</span><span className="l1a-tr">{utBeside(de,tr)}</span></div><Say text={say} speech={speech}/></div>)}
  <h3 className="l1a-h2">{ut('Diyalog: Yasemin ve Nikos')}</h3>
  <DialogueLines lines={dialogueSpell} speech={speech}/>
  <ListenAll lines={dialogueSpell} speech={speech}/>
  <p className="l1a-tr l1a-spell-row">{ut('Harfleri tek tek dinle:')} <b lang="de">NIKOS</b> <SpellButton word="Nikos" speech={speech}/> · <b lang="de">PAPADAKIS</b> <SpellButton word="Papadakis" speech={speech}/></p></>;
}
function ProfileStep({speech}:{speech:Speech}){
 return <><Heading><span lang="de">Steckbrief</span> ({ut('kimlik kartı')})</Heading>
  <p className="l1a-tr">{ut('Bir kişinin bilgilerini kısaca yazarsın:')}</p>
  <ProfileCard card={nikosCard}/>
  <h3 className="l1a-h2"><span lang="de">Alles richtig?</span> ({ut('Hepsi doğru mu?')})</h3>
  <p className="l1a-tr">{ut('Karttan cümle kurar, karşındaki doğrular ya da düzeltir:')}</p>
  <DialogueLines lines={dialogueCheck} speech={speech}/>
  <ListenAll lines={dialogueCheck} speech={speech}/>
  <WordTable items={yesNoWords}/>
  <Note><Tx text="W-soruları (*Wie? Woher? Welche?*) söylenirken ses sonda **düşer**:"/> {intonation.map(text=><span className="l1a-into" key={text}><span lang="de">{text}</span> ↘ <Say text={text} speech={speech}/></span>)}</Note></>;
}
function WordListB({speech}:{speech:Speech}){
 return <><Heading>{ut('Kelime listesi')}</Heading>
  <table className="l1a-table l1a-words"><tbody>{wordsB.map(([de,tr])=><tr key={de}><td><span className="l1a-de" lang="de">{de}</span></td><td>{ut(tr)}</td><td><Say text={wordSay(de)} speech={speech}/></td></tr>)}</tbody></table>
  <p className="l1a-tr">{ut('Konu bitti. Şimdi alıştırmalar başlıyor.')}</p></>;
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
  if(done===hearItems.length){setFeedback(scoreFeedback(right,hearItems.length));finish(right,hearItems.length,undefined,ok);}
  else if(ok)sound.correct();else sound.wrong();};
 return <>
  <p className="kicker">{ut('Alıştırma 4 · Hören Sie')}</p><Heading>{ut('Dinle: hangi dilleri konuşuyorlar?')}</Heading>
  <p className="l1a-tr">{ut('Dinle, doğru olanların hepsini işaretle, sonra “Kontrol”.')}</p>
  {hearItems.map((item,i)=><div className="l1a-listen" key={item.key}>
   <div className="l1a-person"><Portrait who={item.key} name={item.name.split(' ')[0]}/><div className="l1a-phrase-text"><span className="l1a-de">{i+1}. <span lang="de">{item.name}</span></span><span className="l1a-tr" lang="de">Ich spreche …</span></div><Say text={item.text} who={item.key} speech={speech} wide secret/></div>
   <div className="l1a-opts wrap" role="group" aria-label={item.name}>{item.options.map((option,j)=>{const on=ticked[i].includes(j);const state=checked[i]===null?'':item.answers.includes(j)?' ok':on?' bad':'';return <button type="button" key={option} className={'l1a-opt l1a-tick'+(on?' on':'')+state} aria-pressed={on} disabled={checked[i]!==null} lang="de" onClick={()=>toggle(i,j)}>{on?<Check size={15} aria-hidden="true"/>:null}{option}</button>;})}
    <button type="button" className="btn small" disabled={checked[i]!==null||!ticked[i].length} onClick={()=>check(i)}>{ut('Kontrol')}</button></div>
   {checked[i]!==null&&<p className={'l1a-mini'+(checked[i]?' l1a-ok-text':' l1a-bad-text')}>{ut(checked[i]?'Doğru!':'Doğrusu yeşil olanlar.')} {ut('Metin:')} <span lang="de" dir="ltr">{item.text}</span></p>}
  </div>)}
  <FeedbackLine feedback={feedback}/>
 </>;
}
/** Exercise 5 · hear the letters, write the name. Every name checks itself (useSelfCheck, 30 October 2026). */
function NamesExercise(props:StepProps){
 const {speech,sound,onScore,step}=props;
 const [feedback,setFeedback]=useState<Feedback>(null);
 const refs=useRef<(HTMLInputElement|null)[]>([]);
 const total=spellNames.length;
 const self=useSelfCheck(total,(i,value)=>acceptsAnswer(value,[spellNames[i]]),firstRight=>{
  onScore(step.id,firstRight,total);setFeedback({ok:true,text:firstRight===total?'Hepsi doğru!':'Hepsi doğru! İlk denemede {right} / {total} doğruydu.',params:{right:firstRight,total}});sound.correct();
 });
 const note=(result:SelfCheckResult)=>selfCheckNote(result,self,'Kırmızıyı düzelt; doğrusu yanında yazıyor.',setFeedback);
 const focusNext=(i:number)=>{const target=spellNames.findIndex((_,k)=>k>i&&self.stateNow(k)!==true);if(target>=0)refs.current[target]?.focus();};
 return <>
  <p className="kicker">{ut('Alıştırma 5 · Buchstabieren')}</p><Heading>{ut('Harf harf dinle, adı yaz')}</Heading>
  <p className="l1a-tr">{ut('Harfleri dinle, adı kutuya yaz. (ß yerine ss, ü yerine ue yazabilirsin.)')}</p>
  {spellNames.map((name,i)=><div className="l1a-arow l1a-name-row" key={name}>
   <SpellButton word={name} speech={speech} label={String(i+1)}/>
   <span className="l1a-gap-wrap"><input ref={element=>{refs.current[i]=element;}} className={'l1a-gap l1a-name-gap'+(self.state[i]===true?' ok':self.state[i]===false?' bad':'')} value={self.values[i]} lang="de" dir="ltr" autoCapitalize="off" autoComplete="off" spellCheck={false} aria-label={ut('Ad {n}',{n:i+1})} enterKeyHint="next"
    onChange={event=>{sound.prepare();speech.prepare();note(self.change(i,event.target.value));}} onBlur={()=>note(self.leave(i))} onKeyDown={event=>{if(event.key==='Enter'){event.preventDefault();note(self.leave(i));focusNext(i);}}}/>{self.hinted[i]&&self.state[i]!==true&&<span className="l1a-hint" lang="de">→ {name}</span>}</span>
  </div>)}
  <FeedbackLine feedback={feedback}/>
 </>;
}
/** Exercise 6 · which letter? (the options are shuffled once). */
function LetterExercise(props:StepProps){
 const {speech}=props;
 // The options are shuffled once; the say buttons are made on every render (they show whether the voice is busy).
 const [options]=useState(()=>letterQuestions.map(item=>shuffle(item.options)));
 const rows=letterQuestions.map((item,i)=>({key:String(i),label:ut('Harf {n}',{n:i+1}),before:<Say text={letterSay(item.answer)} speech={speech} label={String(i+1)} wide secret/>,options:options[i].map(option=>({value:option,label:option})),answer:item.answer,say:letterSay(item.answer) as SayItem}));
 return <ChoiceRows kicker="Alıştırma 6 · Welcher Buchstabe?" title="Dinle: hangi harf?" lead="Dinle, duyduğun harfi seç." rows={rows} {...props}/>;
}
/** Exercise 11 · now you: write your languages and spell your name (not scored). */
function OwnB({speech,onScore,step}:StepProps){
 const [values,setValues]=useState(['','']);const [state,setState]=useState<(boolean|null)[]>([null,null]);
 const change=(i:number,value:string)=>{const next=values.slice();next[i]=value;setValues(next);const s=state.slice();s[i]=value.trim()?ownPromptsB[i].pattern.test(normalizeLoose(value)):null;setState(s);if(s.every(value=>value===true))onScore(step.id,s.length,s.length);}; // all sentences fit: the step shows done
 const letters=values[1].replace(/^\s*ich\s+buchstabiere\s*:?/i,'').trim();
 return <>
  <p className="kicker">{ut('Alıştırma 11 · Jetzt du')}</p><Heading>{ut('Şimdi sen')}</Heading><p className="l1a-tr">{ut('Kendi dillerinle ve adınla yaz, sonra dinle.')}</p>
  <div className="l1a-dialogue">{ownPromptsB.map((prompt,i)=><div key={prompt.question}>
   <div className="l1a-line a"><div className="l1a-bubble l15-say-bubble"><div className="l15-say-text"><span className="l1a-de" lang="de">{prompt.question}</span></div><Say text={prompt.question} who="paul" speech={speech}/></div></div>
   <div className="l1a-line b"><div className="l1a-bubble"><input className={'l1a-gap wide'+(state[i]===true?' ok':state[i]===false?' bad':'')} value={values[i]} lang="de" dir="ltr" autoCapitalize="off" autoComplete="off" placeholder={prompt.placeholder} aria-label={prompt.question} onChange={event=>change(i,event.target.value)}/>{state[i]===false&&<span className="l1a-mini">{ut('Kalıp:')} <span lang="de">{prompt.placeholder}</span></span>}</div></div>
  </div>)}</div>
  <div className="l1a-actions">
   <button type="button" className="btn secondary small" disabled={speech.busy||!values[0].trim()} onClick={()=>speech.speak(values[0].trim())}><Volume2 size={16} aria-hidden="true"/>{ut('Cümlemi dinle')}</button>
   <button type="button" className="btn secondary small" disabled={speech.busy||!letters} onClick={()=>speech.speakAll(spellItems(letters))}><Volume2 size={16} aria-hidden="true"/>{ut('Adımı harf harf dinle')}</button>
  </div>
  <Note><Tx text="Harfleri Almanca adlarıyla söylemeyi unutma: **J** = yot, **Y** = üpsilon, **V** = fau."/></Note>
 </>;
}
function EndB({progress,onGo,onPart,language}:StepProps){
 return <>
  <Heading>{ut('Lektion 1B tamam! 🎉')}</Heading>
  <Applause/>
  <p>{ut('Artık şunları yapabilirsin:')}</p>
  <ul className="l1a-list"><li><Tx text="*Ich spreche … und ein bisschen Deutsch.* – dillerini söyleme"/></li><li><Tx text="*Sie* ve *du* ile soru sorma"/></li><li><Tx text="_ich / du / Sie_ fiil çekimi (*-e / -st / -en*)"/></li><li><Tx text="Alfabe ve *Ich buchstabiere: …*"/></li><li><Tx text="*Wie bitte? Wie schreibt man das?* – anlamadığında sorma"/></li><li><Tx text="*Ja, richtig! / Nein, …* – doğrulama"/></li></ul>
  <ProgressMeter progress={progress} language={language} label="Lektion 1B"/>
  <p className="l1a-tr"><Tx text="Sıradaki bölüm: *Teil C – Guten Tag!*"/></p>
  <div className="l1a-actions"><button type="button" className="btn small" onClick={()=>onPart('c',0)}>{ut('Teil C\'ye geç')}</button><button type="button" className="btn secondary small" onClick={()=>onGo(stepIndexB('land-sprache'))}>{ut('Alıştırmaları tekrar yap')}</button><button type="button" className="btn secondary small" onClick={()=>onGo(-1)}>{ut('Lektion 1 içindekiler')}</button></div>
 </>;
}
