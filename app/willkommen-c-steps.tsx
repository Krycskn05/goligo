'use client';
import {useEffect,useRef,useState,type ReactNode} from 'react';
import {ArrowRight,Play,RotateCcw,Volume2} from 'lucide-react';
import {normalizeLoose} from '@/lib/willkommen-course';
import {
 willkommenCPictures,timeGreetings,hellos,goodbyes,dialogueGoodbye,moods,howAreYou,dialogueMorning,dialoguePark,bonusAnswers,verbPositions,positionSay,
 dialogueNew,worldGreetings,wordsC,wordSayC,timeOptions,timeQuestions,registerQuestions,gluedGreetings,gluedGreetingAnswers,gluedGreetingLines,moodHearing,
 boxWordsC,boxLinesC,boxSayC,orderVerbSentences,punctuationQuestions,lowercaseText,capitalLines,capitalSay,dictationLines,ownPromptsC,testQuestionsC,stepIndexC,
 type Register,
} from '@/lib/willkommen-c-course';
import {lineSay} from '@/lib/willkommen-b-course';
import {ProgressMeter} from './progress-meter';
import {TalkStep} from './talk-step';
import {talkScenarios} from '@/lib/talk-scenarios';
import {Applause} from './study-shared';
import {Say,Note,Tx,Heading,Portrait,FeedbackLine,useFinish,GapExercise,MatchExercise,OrderExercise,ChoiceRows,TestStep,shuffle,type Speech,type StepProps,type Feedback} from './willkommen-ui';
import {ut,utBeside} from '@/lib/unit-i18n';
import {DialogueLines,ListenAll,Picture} from './willkommen-b-steps';

/**
 * Lektion 1, Teil C – Guten Tag! (the learner's lesson page, 25 October 2026): the steps. The page around them
 * (notebook, tabs, pager, scores) is app/willkommen-study.tsx; the texts are lib/willkommen-c-course.ts.
 */
export function StepViewC(props:StepProps){
 const {step,speech}=props;
 switch(step.id){
  case 'kapak':return <CoverC {...props}/>;
  case 'tageszeit':return <TimeOfDay speech={speech}/>;
  case 'gruesse':return <HelloBye speech={speech}/>;
  case 'abschied':return <><Heading>{ut('Vedalaşma')}</Heading><Picture {...willkommenCPictures.goodbye} alt="Mei trenden el sallıyor, Rami peronda"/><DialogueLines lines={dialogueGoodbye} speech={speech}/><ListenAll lines={dialogueGoodbye} speech={speech}/><Note><Tx text="*Gute Reise!* = İyi yolculuklar! · *Bis bald!* = Yakında görüşürüz! (resmî ve samimi, ikisinde de olur)"/></Note></>;
  case 'befinden':return <HowAreYou speech={speech}/>;
  case 'dialoge':return <Dialogues speech={speech}/>;
  case 'bonus':return <Bonus speech={speech}/>;
  case 'verbposition':return <VerbPosition speech={speech}/>;
  case 'neu-hier':return <><Heading><span lang="de">Ich bin neu hier.</span></Heading><p className="l1a-tr">{ut('Şimdiye kadar öğrendiklerinle kendini tanıtabilirsin. Mei kursa yeni geldi:')}</p><DialogueLines lines={dialogueNew} speech={speech}/><Note><Tx text="Sıra: **selam → ad → yeni olduğun → ülke (şehir) → diller.** Her cümlede fiil 2. pozisyonda!"/></Note></>;
  case 'welt':return <World speech={speech}/>;
  case 'schreiben':return <Writing/>;
  case 'kelimeler':return <WordListC speech={speech}/>;
  case 'tageszeit-uebung':return <ChoiceRows kicker="Alıştırma 1 · Wann sagt man was?" title="Saate göre selamı seç" wide rows={timeQuestions.map((item,i)=>({key:String(i),label:ut(item.time),before:<span className="l1a-land">{ut(item.time)}</span>,options:timeOptions.map(option=>({value:option,label:option})),answer:item.answer,say:item.answer}))} {...props}/>;
  case 'sie-du-beide':return <ChoiceRows kicker="Alıştırma 2 · Sie oder du?" title="Bu selam kime söylenir?" lead="Sie = resmî, du = samimi, beide = ikisi de." rows={registerQuestions.map((item,i)=>({key:String(i),label:item.greeting,before:<span className="l1a-land" lang="de">{item.greeting}</span>,options:(['Sie','du','beide'] as Register[]).map(option=>({value:option,label:option})),answer:item.answer,say:item.greeting}))} {...props}/>;
  case 'ayir':return <GapExercise kicker="Alıştırma 3 · Markieren Sie" title="Selamları ayır" lead="Bu metinde 6 selam ya da veda var. Sırayla yaz." before={<div className="l1a-glued" lang="de" dir="ltr">{gluedGreetings}</div>} lines={gluedGreetingLines} wide say={gluedGreetingAnswers} {...props}/>;
  case 'gesichter':return <MatchExercise kicker="Alıştırma 4 · Wie geht es?" title="Yüzü kelimeyle eşleştir" pairs={moods.map(([emoji,de])=>[emoji,de] as const)} sayFor={i=>[moods[i][1]]} {...props}/>;
  case 'memory':return <MemoryGame {...props}/>;
  case 'hoeren':return <ChoiceRows kicker="Alıştırma 6 · Hören Sie" title="Dinle: nasıllar?" lead="Dinle, kişinin nasıl olduğunu seç." wide rows={moodHearing.map((item,i)=>({key:item.key,label:item.name,before:<div className="l1a-person"><Portrait who={item.key} name={item.name.split(' ')[0]}/><div className="l1a-phrase-text"><span className="l1a-de">{i+1}. <span lang="de">{item.name}</span></span></div><Say text={item.text} who={item.key} speech={speech} wide secret/></div>,options:item.options.map((option,j)=>({value:String(j),label:option})),answer:String(item.answer),reveal:<span className="l1a-mini">{ut('Metin:')} <span lang="de" dir="ltr">{item.text}</span></span>}))} {...props}/>;
  case 'kutu':return <GapExercise kicker="Alıştırma 7 · Was passt?" title="Kutudan doğru kelimeyi seç" bank lines={boxLinesC} choices={boxWordsC} say={boxSayC} speakers={{a:'nikos',b:'nora'}} {...props}/>;
  case 'sirala':return <OrderExercise kicker="Alıştırma 8 · Verben im Satz" title="Cümleyi kur — fiil 2. pozisyonda" sentences={orderVerbSentences.map(item=>item.words)} verbs={orderVerbSentences.map(item=>item.verb)} meanings={orderVerbSentences.map(item=>item.tr)} sayFor={sentence=>sentence} {...props}/>;
  case 'punkt':return <ChoiceRows kicker="Alıştırma 9 · Punkt oder Fragezeichen?" title="Nokta mı, soru işareti mi?" rows={punctuationQuestions.map((item,i)=>({key:String(i),label:item.sentence,before:<span className="l1a-land" lang="de">{item.sentence} …</span>,options:[{value:'.',label:'.'},{value:'?',label:'?'}],answer:item.answer,say:item.sentence+item.answer}))} {...props}/>;
  case 'gross-klein':return <GapExercise kicker="Alıştırma 10 · Groß oder klein?" title="Büyük harfleri düzelt" lead="Metin tamamen küçük yazılmış. Her cümleyi doğru büyük harflerle yaz (büyük-küçük harf sayılır)." before={<div className="l1a-glued l1a-lower" lang="de" dir="ltr">{lowercaseText}</div>} lines={capitalLines} wide exact say={[{text:capitalSay,who:'nora'}]} {...props}/>;
  case 'diktat':return <GapExercise kicker="Alıştırma 11 · Diktat" title="Dinle ve yaz" lead="İstediğin kadar dinle, cümleyi kutuya yaz." lines={dictationLines} wide say={[]} {...props}/>;
  case 'sen':return <OwnC {...props}/>;
  case 'test':return <TestStep label="Lektion 1C · Test" questions={testQuestionsC} sayFor={i=>testQuestionsC[i][3]} {...props}/>;
  case 'konus':return <TalkStep scenario={talkScenarios.l1c} {...props}/>;
  case 'bitti':return <EndC {...props}/>;
 }
 return null;
}

const registerLabel:Record<Register,string>={Sie:'Sie',du:'du',beide:'beide'};
function PhraseRow({de,tr,badge,emoji,speech}:{de:string;tr:ReactNode;badge?:string;emoji?:string;speech:Speech}){
 return <div className="l1a-phrase">{emoji&&<span className="l1a-emoji" aria-hidden="true">{emoji}</span>}<div className="l1a-phrase-text"><span className="l1a-de" lang="de" dir="ltr">{de}{badge&&<span className="l1a-badge">{badge}</span>}</span><span className="l1a-tr">{typeof tr==='string'?ut(tr):tr}</span></div><Say text={de} speech={speech}/></div>;
}

/* ---------- teaching steps ---------- */
function CoverC(_props:StepProps){ // the part's progress is on the left page (no second bar here, 30 October 2026)
 return <>
  <p className="kicker" lang="de">Lektion 1 · Willkommen!</p>
  <Heading><span lang="de">C — Guten Tag!</span></Heading>
  <p>{ut('Bu derste öğreneceklerin:')}</p>
  <ul className="l1a-list"><li><Tx text="Günün saatine göre selam: *Guten Morgen / Tag / Abend*"/></li><li><Tx text="Vedalaşma: *Auf Wiedersehen, Tschüs, Bis bald*"/></li><li><Tx text="Hâl hatır: *Wie geht es dir? / Wie geht es Ihnen?*"/></li><li>{ut('Fiil her zaman 2. pozisyonda')}</li><li>{ut('Doğru yazma: nokta, soru işareti, büyük harf')}</li></ul>
 </>;
}
function TimeOfDay({speech}:{speech:Speech}){
 return <><Heading>{ut('Günün saatine göre selam')}</Heading>
  {timeGreetings.map(([emoji,de,tr,when])=><PhraseRow key={de} emoji={emoji} de={de} tr={<>{ut(tr)} · <i>{ut(when)}</i></>} speech={speech}/>)}
  <Note><Tx text="*Gute Nacht!* selam değil, vedadır: yatmaya giderken ya da gece geç ayrılırken söylenir. Gece karşılaştığında yine *Guten Abend!* dersin."/></Note></>;
}
function HelloBye({speech}:{speech:Speech}){
 return <><Heading>{ut('Merhaba ve hoşça kal')}</Heading>
  <h3 className="l1a-h2">{ut('Karşılaşınca')}</h3>{hellos.map(([de,tr,register])=><PhraseRow key={de} de={de} tr={tr} badge={registerLabel[register]} speech={speech}/>)}
  <h3 className="l1a-h2">{ut('Ayrılırken')}</h3>{goodbyes.map(([de,tr,register])=><PhraseRow key={de} de={de} tr={tr} badge={registerLabel[register]} speech={speech}/>)}
  <Note><Tx text="*Sie* = resmî, *du* = samimi, *beide* = ikisi de olur. Resmî ortamda: *Guten Tag! … Auf Wiedersehen!* Arkadaşla: *Hallo! … Tschüs!*"/></Note></>;
}
function HowAreYou({speech}:{speech:Speech}){
 return <><Heading>{ut('Nasılsın? Nasılsınız?')}</Heading>
  <div className="l1a-two">
   <div><p className="l1a-two-head"><b lang="de">Sie</b></p><p className="l1a-de" lang="de">{howAreYou.sie} <Say text={howAreYou.sie} speech={speech}/></p><p className="l1a-tr">{ut('Nasılsınız?')}</p></div>
   <div><p className="l1a-two-head"><b lang="de">du</b></p><p className="l1a-de" lang="de">{howAreYou.du} <Say text={howAreYou.du} speech={speech}/></p><p className="l1a-tr">{ut('Nasılsın?')}</p></div>
  </div>
  <p className="l1a-tr">{ut('Kısa hâli (samimi):')} <b lang="de">{howAreYou.short}</b> <Say text={howAreYou.short} speech={speech}/></p>
  <h3 className="l1a-h2">{ut('Cevaplar — dokun, dinle')}</h3>
  <div className="l1a-moods">{moods.map(([emoji,de,tr])=><button type="button" key={de} className={'l1a-mood'+(speech.busy&&speech.activeText===de?' playing':'')} onClick={()=>speech.speak(de)} aria-label={ut('Dinle')+': '+de}><span className="l1a-mood-emoji" aria-hidden="true">{emoji}</span><b lang="de">{de}</b><small>{ut(tr)}</small></button>)}</div>
  <Note><Tx text="Genelde *Danke* ile başlar, sonra geri sorarsın: *Danke, gut. Und Ihnen?* (Sie) · *Danke, gut. Und dir?* (du)"/></Note></>;
}
function Dialogues({speech}:{speech:Speech}){
 return <><Heading>{ut('Resmî: Sabine ve Omar')}</Heading>
  <Picture {...willkommenCPictures.morning} alt="Sabine ve Omar sabah sokakta karşılaşıyor"/>
  <DialogueLines lines={dialogueMorning} speech={speech}/>
  <Note><Tx text="*Sagen wir du?* = “Sen diyelim mi?” Almanlar bunu sorduktan sonra isimle ve *du* ile konuşur. Cevap: *Ja, gern!*"/></Note>
  <h3 className="l1a-h2">{ut('Samimi: Yasemin ve Aisha')}</h3>
  <Picture {...willkommenCPictures.park} alt="Yasemin ve Aisha parkta bankta oturuyor"/>
  <DialogueLines lines={dialoguePark} speech={speech}/>
  <div className="l1a-actions"><button type="button" className="btn secondary small" disabled={speech.busy} onClick={()=>speech.speakAll([...dialogueMorning,...dialoguePark].map(lineSay))}><Play size={16} aria-hidden="true"/>{ut('Tümünü dinle')}</button></div></>;
}
function Bonus({speech}:{speech:Speech}){
 return <><Heading>{ut('Bonus: Almanlar böyle de der')}</Heading><p className="l1a-tr"><Tx text="“_Wie geht’s?_” sorusuna günlük hayatta duyacağın cevaplar:"/></p>
  {bonusAnswers.map(([de,tr,mark])=><PhraseRow key={de} de={de} tr={tr} badge={mark} speech={speech}/>)}</>;
}
function VerbPosition({speech}:{speech:Speech}){
 return <><Heading>{ut('Fiil her zaman 2. pozisyonda')}</Heading>
  <p className="l1a-tr"><Tx text="Düz cümlede de, W-sorusunda da fiil **2. sırada** durur:"/></p>
  <div className="l1a-positions" role="table" aria-label={ut('Fiilin yeri')}>
   <div className="l1a-pos-row l1a-pos-head" role="row"><span role="columnheader">{ut('1. pozisyon')}</span><span role="columnheader">{ut('2. pozisyon = fiil')}</span><span role="columnheader">{ut('gerisi')}</span><span aria-hidden="true"/></div>
   {verbPositions.map(row=><div className="l1a-pos-row" role="row" key={positionSay(row)} lang="de"><span role="cell">{row[0]}</span><span role="cell" className="l1a-pos-verb">{row[1]}</span><span role="cell">{row[2]}</span><Say text={positionSay(row)} speech={speech}/></div>)}
  </div>
  <Note><Tx text="“*Welche Sprachen*” iki kelime ama **tek** soru öğesi — 1. pozisyonu birlikte doldurur, fiil hemen arkasından gelir."/></Note></>;
}
function World({speech}:{speech:Speech}){
 return <><Heading>{ut('Dünyada selamlaşma')}</Heading>
  <Picture {...willkommenCPictures.world} alt="Dünyada selamlaşma biçimleri: el sıkma, sarılma, el sallama, yanaktan öpme, eğilme"/>
  <table className="l1a-table"><tbody>{worldGreetings.map(([emoji,de,tr])=><tr key={de}><td className="l1a-emoji-cell" aria-hidden="true">{emoji}</td><td><b lang="de">{de}</b> <Say text={de} speech={speech}/></td><td className="l1a-tr">{utBeside(de,tr)}</td></tr>)}</tbody></table>
  <Note><Tx text="Almanya’da ilk karşılaşmada ve resmî ortamda **el sıkılır**, göz teması kurulur. Yanaktan öpme sadece yakın arkadaşlar arasında olur."/></Note></>;
}
function Writing(){
 return <><Heading><span lang="de">Richtig schreiben</span> — {ut('doğru yazma')}</Heading>
  <h3 className="l1a-h2">{ut('Cümle sonu')}</h3>
  <table className="l1a-table"><tbody>
   <tr><td><Tx text="**.** nokta"/></td><td><Tx text="düz cümle: ~Ich komme aus Polen.~"/></td></tr>
   <tr><td><Tx text="**?** soru işareti"/></td><td><Tx text="soru: ~Woher kommen Sie?~ — ~Und Sie?~"/></td></tr>
   <tr><td><Tx text="**!** ünlem"/></td><td><Tx text="selam, veda: ~Hallo! Tschüs!~"/></td></tr>
  </tbody></table>
  <h3 className="l1a-h2">{ut('Büyük harf')}</h3>
  <ul className="l1a-list"><li><Tx text="Cümle başı: _**I**ch komme …_"/></li><li><Tx text="Kişi adları: _**N**ora **W**eiß_"/></li><li><Tx text="Ülke ve dil adları: _**P**olen, **P**olnisch_"/></li><li><Tx text="Resmî “siz”: _**S**ie, **I**hnen_ (her zaman büyük!)"/></li><li><Tx text="Almancada **bütün isimler** büyük yazılır: _der **N**ame, das **L**and, die **S**prache_"/></li></ul>
  <Note><Tx text="Yanlış: ~ich spreche polnisch und ein bisschen deutsch~"/><br/><Tx text="Doğru: *Ich spreche Polnisch und ein bisschen Deutsch.*"/></Note></>;
}
function WordListC({speech}:{speech:Speech}){
 return <><Heading>{ut('Kelime listesi')}</Heading>
  <table className="l1a-table l1a-words"><tbody>{wordsC.map(([de,tr])=><tr key={de}><td><span className="l1a-de" lang="de">{de}</span></td><td>{ut(tr)}</td><td><Say text={wordSayC(de)} speech={speech}/></td></tr>)}</tbody></table>
  <p className="l1a-tr">{ut('Konu bitti. Şimdi alıştırmalar başlıyor.')}</p></>;
}

/* ---------- Teil C's own exercises ---------- */
/** Exercise 5 · memory: open two cards, a face and its word stay open. Not scored; the word is read when a pair is found. */
function MemoryGame(props:StepProps){
 const {speech,sound}=props;
 type Card={key:string;mood:number;face:boolean};
 const deal=()=>shuffle(moods.flatMap((_,mood)=>[{key:mood+'f',mood,face:true},{key:mood+'w',mood,face:false}]));
 const [cards,setCards]=useState<Card[]>(deal);const [open,setOpen]=useState<string[]>([]);const [found,setFound]=useState<number[]>([]);const [moves,setMoves]=useState(0);
 const [feedback,setFeedback]=useState<Feedback>(null);const lock=useRef(false);const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
 const flip=(card:Card)=>{
  if(lock.current||open.includes(card.key)||found.includes(card.mood))return;sound.prepare();speech.prepare();
  const next=[...open,card.key];setOpen(next);if(next.length<2)return;
  setMoves(m=>m+1);const [a,b]=next.map(key=>cards.find(item=>item.key===key)!);
  if(a.mood===b.mood){const done=[...found,a.mood];setFound(done);setOpen([]);
   if(done.length===moods.length){props.onScore(props.step.id,1,1);setFeedback({ok:true,text:'6 çift bulundu — {n} hamle!',params:{n:moves+1}});sound.correct(()=>speech.speak(moods[a.mood][1]));}else speech.speak(moods[a.mood][1]);}
  else{lock.current=true;timer.current=setTimeout(()=>{setOpen([]);lock.current=false;},900);}
 };
 const again=()=>{setCards(deal());setOpen([]);setFound([]);setMoves(0);setFeedback(null);lock.current=false;};
 return <>
  <p className="kicker">{ut('Alıştırma 5 · Memory-Spiel')}</p><Heading>{ut('Hafıza oyunu: yüz + kelime')}</Heading>
  <p className="l1a-tr">{ut('Kartlar kapalı. İki kart aç: yüz ve kelimesi eşleşirse açık kalır. 6 çifti bul!')}</p>
  <div className="l1a-memory">{cards.map(card=>{const shown=open.includes(card.key)||found.includes(card.mood);return <button type="button" key={card.key} className={'l1a-mcard'+(shown?' open':'')+(found.includes(card.mood)?' done':'')} aria-label={shown?(card.face?moods[card.mood][0]+' '+ut(moods[card.mood][2]):moods[card.mood][1]):ut('Kapalı kart')} disabled={found.includes(card.mood)} onClick={()=>flip(card)}>{shown?(card.face?<span className="l1a-mood-emoji" aria-hidden="true">{moods[card.mood][0]}</span>:<b lang="de">{moods[card.mood][1]}</b>):<span aria-hidden="true">?</span>}</button>;})}</div>
  <div className="l1a-actions"><button type="button" className="btn secondary small" onClick={again}><RotateCcw size={16} aria-hidden="true"/>{ut('Yeniden karıştır')}</button><span className="l1a-mini">{ut('{n} hamle',{n:moves})}</span></div>
  <FeedbackLine feedback={feedback}/>
 </>;
}
/** Exercise 12 · Das bin ich! Four sentences about yourself (not scored), then hear them. */
function OwnC({speech,onScore,step}:StepProps){
 const [values,setValues]=useState(()=>ownPromptsC.map(()=>''));const [state,setState]=useState<(boolean|null)[]>(()=>ownPromptsC.map(()=>null));
 const change=(i:number,value:string)=>{const next=values.slice();next[i]=value;setValues(next);const s=state.slice();s[i]=value.trim()?ownPromptsC[i].pattern.test(normalizeLoose(value)):null;setState(s);if(s.every(value=>value===true))onScore(step.id,s.length,s.length);}; // all sentences fit: the step shows done
 return <>
  <p className="kicker">{ut('Alıştırma 12 · Das bin ich!')}</p><Heading>{ut('Şimdi sen: kendini tanıt')}</Heading><p className="l1a-tr">{ut('4 cümle yaz, sonra tanıtımını dinle.')}</p>
  {ownPromptsC.map((prompt,i)=><div className="l1a-row" key={prompt.placeholder}><input className={'l1a-gap wide'+(state[i]===true?' ok':state[i]===false?' bad':'')} value={values[i]} lang="de" dir="ltr" autoCapitalize="sentences" autoComplete="off" placeholder={prompt.placeholder} aria-label={prompt.placeholder} onChange={event=>change(i,event.target.value)}/>{state[i]===false&&<span className="l1a-mini">{ut('Kalıp:')} <span lang="de">{prompt.placeholder}</span></span>}</div>)}
  <div className="l1a-actions"><button type="button" className="btn secondary small" disabled={speech.busy||!values.some(value=>value.trim())} onClick={()=>speech.speakAll(values.map(value=>value.trim()).filter(Boolean))}><Volume2 size={16} aria-hidden="true"/>{ut('Tanıtımımı dinle')}</button></div>
  <Note><Tx text="İstersen ekle: *Ich bin neu hier.* Fiiller 2. pozisyonda mı? Kontrol et!"/></Note>
 </>;
}
function EndC({progress,onGo,onPart,language}:StepProps){
 return <>
  <Heading>{ut('Lektion 1C tamam! 🎉')}</Heading>
  <Applause/>
  <p>{ut('Artık şunları yapabilirsin:')}</p>
  <ul className="l1a-list"><li>{ut('Günün saatine göre selam vermek')}</li><li>{ut('Resmî ve samimi vedalaşmak')}</li><li><Tx text="*Wie geht es dir / Ihnen?* sorup cevaplamak"/></li><li>{ut('Fiili 2. pozisyona koymak')}</li><li>{ut('Nokta, soru işareti ve büyük harfleri doğru kullanmak')}</li><li>{ut('Kendini 4–5 cümleyle tanıtmak')}</li></ul>
  <ProgressMeter progress={progress} language={language} label="Lektion 1C"/>
  <p className="l1a-tr"><Tx text="Sıradaki bölüm: *Teil D – Ich bin neu hier.*"/></p>
  <div className="l1a-actions"><button type="button" className="btn small" onClick={()=>onPart('d',0)}>{ut('Teil D\'ye geç')}<ArrowRight size={16} className="vault-direction-icon" aria-hidden="true"/></button><button type="button" className="btn secondary small" onClick={()=>onGo(stepIndexC('tageszeit-uebung'))}>{ut('Alıştırmaları tekrar yap')}</button><button type="button" className="btn secondary small" onClick={()=>onGo(-1)}>{ut('Lektion 1 içindekiler')}</button></div>
 </>;
}
