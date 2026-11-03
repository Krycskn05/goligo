'use client';
import {useRef,useState,type ReactNode} from 'react';
import {ArrowRight,BookOpen,Eye,Play,RotateCcw} from 'lucide-react';
import {acceptsAnswer,normalizeLoose} from '@/lib/willkommen-course';
import {jobPicture,isTurkishText} from '@/lib/berufe-course';
import {
 castL2B,NARRATOR,plainText,doings,wordsB,phrasesB,wordChecksB,pronounChecks,verbChecksB,introChecks,questionChecks,
 pronounRows,sieTwo,sieThree,dasIst,regularVerbs,specialVerbs,verbRowSay,verbExamples,introRows,cityPhrase,timePhrases,
 tomaszText,twoText,questionRows,questionRowSay,pluralQuestions,orderRowsB,orderRowSayB,capsWrong,capsRight,
 readTexts,whoOptions,whoRows,verbGaps,verbGapCells,doBox,doRows,doSay,ramiTalk,ramiAbout,hearLines,
 questionSentences,questionMeanings,questionSay,capsWords,capsNeed,capitalized,capsSolved,omarCard,omarPrompts,L2B_OWN_KEY,omarAll,
 berufeTestB,practiceItemsB,berufeStepIndexB,type Pronoun,type PersonText,type VerbRow,
} from '@/lib/berufe-b-course';
import {personName} from '@/lib/berufe-course';
import {ProgressMeter} from './progress-meter';
import {PaulHoca} from './paul-hoca';
import {ChoiceExercise} from './stadt-a-steps';
import {Art,PhraseRow,QuickChecks,SpeakStep} from './berufe-a-steps';
import {Say,Note,Tx,Heading,Portrait,FeedbackLine,useSelfCheck,selfCheckNote,type SelfCheckResult,ChoiceRows,OrderExercise,TestStep,mixedOrder,type Speech,type Sound,type StepProps,type Feedback} from './willkommen-ui';
import {ut,utBeside} from '@/lib/unit-i18n';

/**
 * Lektion 2 „Berufe“, Teil B – Wer ist das? (the learner's lesson page, 2 November 2026): the steps. The notebook around
 * them is app/berufe-study.tsx; the texts are lib/berufe-b-course.ts; the shared pieces come from app/willkommen-ui.tsx,
 * app/stadt-a-steps.tsx (sentence choices) and app/berufe-a-steps.tsx (quick checks, phrase rows). Texts about other
 * people are read by Paul Hoca; a person who talks about themselves (Rami) by their own voice.
 */
export function StepViewL2B(props:StepProps){
 const {step,speech,sound}=props;
 switch(step.id){
  case 'kapak':return <CoverL2B/>;
  case 'ne-yapiyor':return <Doings speech={speech}/>;
  case 'kelimeler':return <WordsB speech={speech}/>;
  case 'kontrol':return <><p className="kicker" lang="de">Wortschatz · Kontrolle</p><Heading>{ut('Kelimeleri hatırlıyor musun?')}</Heading>
   <p className="l1a-tr">{ut('Hızlı bir kontrol, puanı yok. Yanlış olursa doğrusu yeşil görünür.')}</p>
   <QuickChecks items={wordChecksB} speech={speech} sound={sound} title="8 kısa soru"/>
   <div className="l1a-actions"><button type="button" className="btn secondary small" onClick={()=>props.onGo(berufeStepIndexB('ne-yapiyor'))}>{ut('Kartlara dön')}</button></div></>;
  case 'er-sie':return <Pronouns speech={speech} sound={sound}/>;
  case 'fiiller':return <VerbsB speech={speech} sound={sound}/>;
  case 'tanitma':return <Intro speech={speech} sound={sound}/>;
  case 'sorular':return <Questions speech={speech} sound={sound}/>;
  case 'buyuk-harf':return <Capitals speech={speech}/>;
  case 'wer':return <WhoExercise {...props}/>;
  case 'fiil-tablo':return <VerbTable {...props}/>;
  case 'wer-macht':return <DoExercise {...props}/>;
  case 'hoeren':return <HearExercise {...props}/>;
  case 'soru-kur':return <OrderExercise kicker="Alıştırma 5 · Fragen Sie." title="Soruyu kur" sentences={questionSentences} meanings={questionMeanings} sayFor={questionSay} {...props}/>;
  case 'harf-yaz':return <CapsExercise {...props}/>;
  case 'omar':return <OmarExercise {...props}/>;
  case 'test':return <TestStep label="Lektion 2B · Test" questions={berufeTestB} sayFor={i=>berufeTestB[i][3]} langOf={text=>isTurkishText(text)?'tr':'de'} {...props}/>;
  case 'konus':return <KonusL2B {...props}/>;
  case 'ozet':return <EndL2B {...props}/>;
 }
 return null;
}

/* ---------- small pieces ---------- */
/** A form with its marked part in bold ("komm|t" → komm**t**; also used by Teil C and D). */
export function Marked({text}:{text:string}){return <>{text.split('|').map((part,i)=>i%2?<b key={i}>{part}</b>:part)}</>;}
/** er (blue), sie (red) and sie for more people (green), like the article colours. */
function Pron({kind,children}:{kind:Pronoun;children?:ReactNode}){return <span className={'l2-pron '+kind} lang="de">{children??(kind==='er'?'er':'sie')}</span>;}
/** A text about someone: their portraits, the name, German and Turkish; Paul Hoca reads it (a tap on the bubble too). */
function PersonCard({text,speech}:{text:PersonText;speech:Speech}){
 return <div className="l1a-dialogue"><div className="l1a-line a l2-person">
  <span className="l2-faces">{text.people.map(key=><Portrait key={key} who={key} name={personName(key)}/>)}</span>
  <div className="l1a-bubble"><span className="l15-name">{text.name}</span><span className="l1a-de" lang="de" dir="ltr">{text.de}</span><span className="l1a-tr">{utBeside(text.de,text.tr)}</span></div>
  <Say text={text.de} who={NARRATOR} speech={speech}/>
 </div></div>;
}
/** A table of verbs: one row per verb (the row reads "ich …, du …, er …, sie …"). */
function VerbTableView({rows,speech}:{rows:readonly VerbRow[];speech:Speech}){
 return <table className="l1a-table l2-verbs"><thead><tr><th/><th lang="de">ich</th><th lang="de">du</th><th><Pron kind="er"/> / <Pron kind="sie"/></th><th><Pron kind="pl"/> / <span lang="de">Sie</span></th><th/></tr></thead>
  <tbody>{rows.map(row=><tr key={row[0]}><td><b lang="de">{row[0]}</b></td>{row.slice(1).map((form,i)=><td key={i} lang="de"><Marked text={form}/></td>)}<td><Say text={verbRowSay(row)} speech={speech}/></td></tr>)}</tbody></table>;
}

/* ---------- teaching steps ---------- */
function CoverL2B(){ // the cover picture and the part's progress are on the notebook's left page
 return <>
  <p className="kicker" lang="de">Lektion 2 · Berufe</p>
  <Heading><span lang="de">B — Wer ist das?</span></Heading>
  <p><Tx text="Paul Hoca sınıfta bir fotoğraf gösteriyor: ~„Wer ist das?“~ Şimdi başkalarını tanıtmayı öğreniyoruz."/></p>
  <p>{ut('Bu bölümde öğreneceklerin:')}</p>
  <ul className="l1a-list">
   <li><Tx text="Birini tanıtmak: *Das ist Nikos. Er kommt aus Griechenland.*"/></li>
   <li><Tx text="O ve onlar: *er* · *sie* · *sie (Pl.)* — ~Sie wohnt. / Sie wohnen.~"/></li>
   <li><Tx text="Başkası hakkında sorular: *Woher kommt er? Wo wohnt sie? Wer ist das?*"/></li>
   <li><Tx text="Doğru yazmak: *Sie spricht Deutsch.* (büyük harf)"/></li>
  </ul>
  <h2 className="l1a-h2">{ut('Bu dersteki kişiler')}</h2>
  <ul className="l15-cast">{castL2B.map(key=><li key={key}><Portrait who={key} name={personName(key)}/><span>{personName(key)}</span></li>)}</ul>
 </>;
}
/** Who does what: a picture (a tap reads the job and the sentence), the job and the sentence as rows that read themselves. */
function Doings({speech}:{speech:Speech}){
 return <><p className="kicker" lang="de">Wortschatz · Was machen die Personen?</p><Heading>{ut('Kim ne yapıyor?')}</Heading>
  <p className="l1a-tr">{ut('Dört meslek, iki iş. Satıra ya da resme dokun, dinle ve yüksek sesle tekrar et.')}</p>
  <ul className="l2-jobs">{doings.map(doing=>{const picture=jobPicture(doing.key);const say=[...(doing.job?[doing.job]:[]),doing.sentence];return <li className="l2-job" key={doing.key}>
   <button type="button" className="l2-job-pic" aria-label={ut('Dinle')+': '+say.join(' ')} onClick={()=>speech.speakAll(say)}><img src={picture.src} alt={ut(doing.alt)} width={picture.width} height={picture.height} loading="lazy" decoding="async"/></button>
   <div className="l2-job-text">
    <span className="l15-name">{personName(doing.who)}</span>
    <ul className="l1a-say-list l2-forms">
     {doing.job&&<li><span lang="de"><Art de={doing.job}/></span><Say text={doing.job} speech={speech}/></li>}
     <li><span lang="de">{doing.sentence}</span><Say text={doing.sentence} speech={speech}/></li>
    </ul>
    <span className="l2-job-tr">{utBeside(doing.sentence,doing.tr)}</span>
   </div>
  </li>;})}</ul></>;
}
function WordsB({speech}:{speech:Speech}){
 return <><p className="kicker" lang="de">Wortschatz · Wörter</p><Heading>{ut('Bu bölümün kelimeleri')}</Heading>
  <p className="l1a-tr"><Tx text="Her satırda kelime, anlamı ve bir örnek cümle var. Satıra dokununca örnek cümle okunur. *er* ve *sie* bu bölümün en önemli kelimeleri."/></p>
  <div className="l15-word-grid">{wordsB.map(([de,tr,example,exampleTr])=><div className="l1a-phrase" key={de}><div className="l1a-phrase-text"><span className="l1a-de" lang="de"><Art de={de}/></span><span className="l1a-tr">{utBeside(de,tr)}</span><span className="l15-example" lang="de">{example}</span><span className="l1a-mini">{utBeside(example,exampleTr)}</span></div><Say text={example} speech={speech}/></div>)}</div></>;
}
function Pronouns({speech,sound}:{speech:Speech;sound:Sound}){
 return <><p className="kicker">{ut('Konu 1 · er, sie, sie')}</p><Heading><Tx text="Üçüncü kişi: _er · sie · sie_ (onlar)"/></Heading>
  <p><Tx text="Lektion 1’de hep *ich* (ben), *du* (sen) ve *Sie* (siz, resmî) ile konuştuk. Şimdi **başkasından bahsetmeyi** öğreniyoruz. Türkçede tek bir „o“ var; Almancada üç kelime var:"/></p>
  <table className="l1a-table"><thead><tr><th>{ut('Almanca')}</th><th>{ut('Türkçe')}</th><th>{ut('Örnek')}</th><th/></tr></thead>
   <tbody>{pronounRows.map(([kind,de,tr,example])=><tr key={kind}><td><Pron kind={kind}>{de}</Pron></td><td>{ut(tr)}</td><td lang="de"><Marked text={example}/></td><td><Say text={plainText(example)} speech={speech}/></td></tr>)}</tbody></table>
  <h2 className="l1a-h2"><Tx text="Aynı kelime, iki anlam: _sie_"/></h2>
  <p><Tx text="*sie* hem „o (kadın)“ hem „onlar“ demek. Hangisi olduğunu **fiilin eki** söyler:"/></p>
  {sieTwo.map(([de,tr])=><div className="l1a-phrase" key={de}><div className="l1a-phrase-text"><span className="l1a-de" lang="de"><Marked text={de}/></span><span className="l1a-tr">{utBeside(de,tr)}</span></div><Say text={plainText(de)} speech={speech}/></div>)}
  <h2 className="l1a-h2"><Tx text="Üçüncü _„Sie“_: siz (resmî)"/></h2>
  <p><Tx text="Lektion 1’den hatırla: *Sie* büyük harfle = siz (resmî). Fiili de „onlar“ gibi *-en* alır: ~Woher kommen Sie?~ Cümlenin ortasında büyük **S** görürsen „siz“, küçük **s** görürsen „o (kadın)“ ya da „onlar“ demektir."/></p>
  <table className="l1a-table"><thead><tr><th>{ut('kelime')}</th><th>{ut('anlam')}</th><th>{ut('fiil')}</th></tr></thead>
   <tbody>{sieThree.map(([kind,de,tr,verb])=><tr key={kind}><td>{kind==='Sie'?<b lang="de">Sie</b>:<Pron kind={kind}>{de}</Pron>}</td><td>{ut(tr)}</td><td lang="de"><Marked text={verb}/></td></tr>)}</tbody></table>
  <h2 className="l1a-h2"><Tx text="_„Das ist“_ ve _„Das sind“_"/></h2>
  <p><Tx text="Bir kişiyi tanıtırken *Das ist …* (Bu …), iki veya daha çok kişiyi tanıtırken *Das sind …* (Bunlar …) deriz."/></p>
  {dasIst.map(([de,tr])=><PhraseRow key={de} de={de} tr={tr} speech={speech}/>)}
  <QuickChecks items={pronounChecks} speech={speech} sound={sound}/></>;
}
function VerbsB({speech,sound}:{speech:Speech;sound:Sound}){
 return <><p className="kicker">{ut('Konu 2 · Verben')}</p><Heading><Tx text="Fiil çekimi: _er / sie / sie_ (Pl.)"/></Heading>
  <p><Tx text="Kural basit: *er* ve *sie* (o) için fiil *-t* alır, *sie* (onlar) için *-en* alır. „-en“ biçimi fiilin sözlükteki hâliyle ve _„Sie“_ (siz) biçimiyle aynıdır; yani yeni bir şey ezberlemiyorsun. Satıra dokun, dinle."/></p>
  <VerbTableView rows={regularVerbs} speech={speech}/>
  <div className="l1a-actions"><button type="button" className="btn secondary small" disabled={speech.busy} onClick={()=>speech.speakAll(regularVerbs.map(verbRowSay))}><Play size={16} aria-hidden="true"/>{ut('Tabloyu dinle')}</button></div>
  <h2 className="l1a-h2">{ut('Dikkat edilecek dört fiil')}</h2>
  <p><Tx text="*1. sprechen → er spricht.* İçerideki **e**, _„du“_ ve _„er/sie“_ için **i** olur: ~du spr**i**chst, er spr**i**cht~. „onlar“ için değişmez: ~sie sprechen~."/></p>
  <p><Tx text="*2. arbeiten → er arbeitet.* Gövde **-t** ile bittiği için araya **e** girer: ~er arbeit**et**, du arbeit**est**~."/></p>
  <p><Tx text="*3. heißen → er heißt.* _„du heißt“_ ile aynı görünür; **ß**’ten sonra sadece **t** gelir."/></p>
  <p><Tx text="*4. sein* kuralsız: *er ist* (o -dır), *sie sind* (onlar -dırlar)."/></p>
  <VerbTableView rows={specialVerbs} speech={speech}/>
  <div className="l1a-actions"><button type="button" className="btn secondary small" disabled={speech.busy} onClick={()=>speech.speakAll(specialVerbs.map(verbRowSay))}><Play size={16} aria-hidden="true"/>{ut('Tabloyu dinle')}</button></div>
  <p className="l15-warn"><Tx text="*sein* fiilini ezberle: ~Er ist Koch.~ · ~Sie sind neu im Kurs.~"/></p>
  <h2 className="l1a-h2">{ut('Örnekler')}</h2>
  {verbExamples.map(([de,tr])=><PhraseRow key={de} de={de} tr={tr} speech={speech}/>)}
  <QuickChecks items={verbChecksB} speech={speech} sound={sound}/></>;
}
function Intro({speech,sound}:{speech:Speech;sound:Sound}){
 return <><p className="kicker">{ut('Konu 3 · Das ist …')}</p><Heading>{ut('Birini tanıtma')}</Heading>
  <p><Tx text="Bir kişiyi tanıtmak için Lektion 1’deki cümleleri alıp *ich* yerine *er / sie* koyuyoruz. Fiil de ona göre değişiyor (_-e → -t_). Sıra hep aynı: kim, nereden, nerede, mesleği, dilleri, ne yapıyor."/></p>
  <table className="l1a-table"><thead><tr><th lang="de">ich (Lektion 1)</th><th lang="de">er / sie</th><th/></tr></thead>
   <tbody>{introRows.map(([ich,er,say])=><tr key={ich}><td lang="de">{ich}</td><td lang="de"><Marked text={er}/></td><td><Say text={say} speech={speech}/></td></tr>)}</tbody></table>
  <h2 className="l1a-h2"><Tx text="Şehir ve ülke: _„Das ist in …“_"/></h2>
  <p><Tx text="Önce şehri söyleyip sonra ülkeyi eklemek çok doğal bir kalıp: ~Er kommt aus Thessaloniki. Das ist in Griechenland.~ Böylece dinleyen kişi şehri bilmese de anlar."/></p>
  <PhraseRow de={cityPhrase[0]} tr={cityPhrase[1]} speech={speech}/>
  <h2 className="l1a-h2"><Tx text="Ne zamandır? _„schon lange“_ ve _„jetzt“_"/></h2>
  {timePhrases.map(([de,tr])=><div className="l1a-phrase" key={de}><div className="l1a-phrase-text"><span className="l1a-de" lang="de"><Marked text={de}/></span><span className="l1a-tr">{utBeside(de,tr)}</span></div><Say text={plainText(de)} speech={speech}/></div>)}
  <h2 className="l1a-h2">{ut('Bir kişi: Tomasz')}</h2>
  <PersonCard text={tomaszText} speech={speech}/>
  <h2 className="l1a-h2">{ut('İki kişi: Yasemin ve Mei')}</h2>
  <p><Tx text="İki kişiden bahsederken *Das sind …* ve fiil *-en*:"/></p>
  <PersonCard text={twoText} speech={speech}/>
  <Note><Tx text="İpucu: Bir kişiyi tanıtırken ilk cümlede adı söyle (~Das ist Tomasz.~), sonra hep *er* ya da *sie* ile devam et. Her cümlede adı tekrar etme."/></Note>
  <QuickChecks items={introChecks} speech={speech} sound={sound}/></>;
}
function Questions({speech,sound}:{speech:Speech;sound:Sound}){
 return <><p className="kicker">{ut('Konu 4 · W-Fragen')}</p><Heading>{ut('Başkası hakkında soru sorma')}</Heading>
  <p><Tx text="Soru kelimesi başta, fiil hemen arkasında (2. sırada), sonra kişi. Lektion 1’deki soruların aynısı; sadece *du/Sie* yerine *er/sie* var."/></p>
  <table className="l1a-table"><thead><tr><th>{ut('Soru')}</th><th>{ut('Cevap')}</th><th/></tr></thead>
   <tbody>{questionRows.map(row=><tr key={row[0]}><td><span lang="de"><Marked text={row[0]}/></span><br/><span className="l1a-mini">{utBeside(row[0],row[1])}</span></td><td lang="de">{row[2]}</td><td><Say text={questionRowSay(row)} speech={speech}/></td></tr>)}</tbody></table>
  <h2 className="l1a-h2"><Tx text="_Woher_ ve _Wo_’yu karıştırma"/></h2>
  <p><Tx text="*Woher* = nere**den** → cevap *aus* ile: ~Woher kommt er? – Aus Polen.~"/><br/><Tx text="*Wo* = nere**de** → cevap *in* ile: ~Wo wohnt er? – In Hamburg.~"/></p>
  <h2 className="l1a-h2"><Tx text="Onlar için: fiil _-en_"/></h2>
  {pluralQuestions.map(([de,tr])=><PhraseRow key={de} de={de} tr={tr} speech={speech}/>)}
  <h2 className="l1a-h2">{ut('Sıra: soru kelimesi · fiil · kişi')}</h2>
  <table className="l1a-table"><thead><tr><th>1</th><th>{ut('2 · fiil')}</th><th>3</th><th>…</th><th/></tr></thead>
   <tbody>{orderRowsB.map(row=><tr key={row.join(' ')}><td lang="de">{row[0]}</td><td lang="de"><b>{row[1]}</b></td><td lang="de">{row[2]}</td><td lang="de">{row[3]}</td><td><Say text={orderRowSayB(row)} speech={speech}/></td></tr>)}</tbody></table>
  <QuickChecks items={questionChecks} speech={speech} sound={sound}/></>;
}
function Capitals({speech}:{speech:Speech}){
 return <><p className="kicker">{ut('Konu 5 · Richtig schreiben')}</p><Heading>{ut('Doğru yazma: büyük harf')}</Heading>
  <p>{ut('Almancada büyük harf Türkçeden daha sık kullanılır. Bir metin yazarken şu dört yere bak:')}</p>
  <ol className="l1a-list">
   <li><Tx text="**Cümle başı:** _**D**as ist Sabine. **S**ie kommt aus Hamburg._"/></li>
   <li><Tx text="**İsimler, şehirler, ülkeler:** _**S**abine **K**rüger, **H**amburg, **D**eutschland_"/></li>
   <li><Tx text="**Diller:** _**D**eutsch, **E**nglisch, **T**ürkisch_"/></li>
   <li><Tx text="**Bütün isimler (Nomen):** _**V**erkäuferin, **T**ee, **B**uch, **F**ilm, **B**eruf_ — Almancada her isim büyük yazılır; Türkçede böyle bir kural yok, bu yüzden en çok burada hata yapılır."/></li>
  </ol>
  <p><Tx text="Küçük kalanlar: fiiller (_kommt, wohnt_), *er / sie* (cümle başında değilse), _aus / in / und / als_ gibi küçük kelimeler."/></p>
  <h2 className="l1a-h2">{ut('Örnek')}</h2>
  <p className="l1a-mini">{ut('yanlış:')}</p><p className="l2-caps-wrong" lang="de">{capsWrong}</p>
  <div className="l1a-phrase"><div className="l1a-phrase-text"><span className="l1a-mini">{ut('doğru:')}</span><span className="l1a-de" lang="de"><Marked text={capsRight}/></span></div><Say text={plainText(capsRight)} speech={speech}/></div>
  <Note><Tx text="*Sie* cümle ortasında büyükse „siz“ (resmî), küçükse „o / onlar“. Cümle başında ikisi de büyük yazılır; o zaman anlamı fiil ekinden ve bağlamdan çıkarırsın."/></Note>
  <h2 className="l1a-h2">{ut('Bu ünitenin kalıpları')}</h2>
  {phrasesB.map(([de,tr])=><PhraseRow key={de} de={de} tr={tr} speech={speech}/>)}
  <div className="l1a-actions"><button type="button" className="btn secondary small" disabled={speech.busy} onClick={()=>speech.speakAll(phrasesB.map(([de])=>de))}><Play size={16} aria-hidden="true"/>{ut('Tümünü dinle')}</button></div>
  <p className="l1a-tr">{ut('Şimdi alıştırmalar. Sırayla yapılır; bir alıştırma bitmeden sonraki açılmaz.')}</p></>;
}

/* ---------- exercises ---------- */
/** Alıştırma 1 · three texts (read by Paul Hoca), then who is it? One answer per row; the right sentence is read. */
function WhoExercise(props:StepProps){
 const {speech}=props;
 const rows=whoRows.map(([prompt,answer,say])=>({key:prompt,label:prompt,before:<span className="l15-row-sentence" lang="de">{prompt}</span>,options:whoOptions.map(value=>({value,label:value})),answer,say:{text:say,who:NARRATOR}}));
 return <ChoiceRows kicker="Alıştırma 1 · Lesen Sie. Wer ist das?" title="Üç metni oku, sonra kim olduğunu bul" lead="Önce üç kısa metni oku ve dinle. Sonra her cümle için doğru kişiyi seç."
  before={<>
   {readTexts.map(text=><PersonCard key={text.name} text={text} speech={speech}/>)}
   <div className="l1a-actions"><button type="button" className="btn secondary small" disabled={speech.busy} onClick={()=>speech.speakAll(readTexts.map(text=>({text:text.de,who:NARRATOR})))}><Play size={16} aria-hidden="true"/>{ut('Tümünü dinle')}</button></div>
   <h2 className="l1a-h2" lang="de">Wer …?</h2>
  </>} rows={rows} {...props}/>;
}
/** Alıştırma 2 · the verb table: er / sie (-t) and sie for more people (-en). A right form turns green at once and is
 * read with its person; a wrong one turns red when the learner leaves the box, with the right form next to it. */
function VerbTable(props:StepProps){
 const {speech,sound,onScore,step}=props;
 const total=verbGapCells.length;
 const [feedback,setFeedback]=useState<Feedback>(null);
 const refs=useRef<(HTMLInputElement|null)[]>([]);const spoken=useRef<boolean[]>(verbGapCells.map(()=>false));
 const self=useSelfCheck(total,(i,value)=>acceptsAnswer(value,[verbGapCells[i].answer,verbGapCells[i].say]),firstRight=>{
  onScore(step.id,firstRight,total);setFeedback({ok:true,text:firstRight===total?'Hepsi doğru!':'Hepsi doğru! İlk denemede {right} / {total} doğruydu.',params:{right:firstRight,total}});
 });
 const note=(result:SelfCheckResult)=>selfCheckNote(result,self,'Kırmızıyı düzelt; doğrusu yanında yazıyor.',setFeedback);
 const change=(i:number,value:string)=>{
  sound.prepare();speech.prepare();const result=self.change(i,value);note(result);
  if(result!=='right'||spoken.current[i])return;
  spoken.current[i]=true;sound.correct(()=>speech.speak(verbGapCells[i].say));
 };
 const focusNext=(i:number)=>{const target=verbGapCells.findIndex((_,k)=>k>i&&self.stateNow(k)!==true);if(target>=0)refs.current[target]?.focus();};
 const restart=()=>{self.reset();setFeedback(null);spoken.current=verbGapCells.map(()=>false);};
 const field=(i:number)=>{const cell=verbGapCells[i];const state=self.state[i]===true?' ok':self.state[i]===false?' bad':'';
  return <span className="l1a-gap-wrap"><input ref={element=>{refs.current[i]=element;}} className={'l1a-gap'+state} value={self.values[i]} lang="de" dir="ltr" autoCapitalize="off" autoComplete="off" spellCheck={false} aria-label={cell.verb+' · '+(cell.col?ut('sie (onlar)'):'er / sie')} enterKeyHint="next"
   onChange={event=>change(i,event.target.value)} onBlur={()=>note(self.leave(i))} onKeyDown={event=>{if(event.key==='Enter'){event.preventDefault();note(self.leave(i));focusNext(i);}}}/>{self.hinted[i]&&self.state[i]!==true&&<span className="l1a-hint" lang="de">→ {cell.answer}</span>}</span>;};
 return <>
  <p className="kicker">{ut('Alıştırma 2 · Verben')}</p><Heading>{ut('Fiil tablosunu doldur')}</Heading>
  <p className="l1a-tr"><Tx text="_er / sie_ için **-t**, _sie_ (onlar) için **-en**. Doğru yazınca kutu hemen yeşil olur ve okunur. (ß yerine ss de yazabilirsin.)"/></p>
  <table className="l1a-table l2-verb-gaps"><thead><tr><th>{ut('fiil')}</th><th><Pron kind="er"/> / <Pron kind="sie"/></th><th><Pron kind="pl"/> ({ut('onlar')})</th></tr></thead>
   <tbody>{verbGaps.map((row,r)=><tr key={row[0]}><td><b lang="de">{row[0]}</b></td><td>{field(r*2)}</td><td>{field(r*2+1)}</td></tr>)}</tbody></table>
  <FeedbackLine feedback={feedback}/>
  <div className="l1a-actions"><button type="button" className="btn secondary small" onClick={restart}><RotateCcw size={16} aria-hidden="true"/>{ut('Baştan')}</button></div>
 </>;
}
/** Alıştırma 3 · Wer macht was? A picture and the job; the four phrases are one box, mixed once (never in the order of the answers). */
function DoExercise(props:StepProps){
 const [order]=useState(()=>mixedOrder(doBox,doRows.map(row=>row[2])));
 const rows=doRows.map(row=>{const [key,subject,answer]=row;const picture=jobPicture(key);return {key,label:subject,
  before:<span className="l2-do-row"><img src={picture.src} alt="" width={picture.width} height={picture.height} loading="lazy" decoding="async"/><span className="l15-row-sentence" lang="de"><Art de={subject}/> …</span></span>,
  options:order.map(value=>({value,label:value})),answer,say:{text:doSay(row),who:NARRATOR}};});
 return <ChoiceRows kicker="Alıştırma 3 · Was machen die Personen?" title="Kim ne yapıyor?" lead="Resme bak ve kişinin ne yaptığını seç. Cevaptan sonra cümle okunur." rows={rows} wide {...props}/>;
}
/** Alıştırma 4 · Rami talks about himself (his own voice); the learner fills in the sentences about him (er). */
function HearExercise(props:StepProps){
 const {speech}=props;const [shown,setShown]=useState(false);
 return <ChoiceExercise kicker="Alıştırma 4 · Hören Sie. Ergänzen Sie." title="Rami kendini anlatıyor"
  lead={<Tx text="Rami *ich* ile konuşuyor; sen onun hakkında *er* ile yazıyorsun. Önce dinle (istediğin kadar), sonra boşluklara dokun ve seç."/>}
  before={<>
   <div className="l1a-dialogue"><div className="l1a-line a"><Portrait who="rami" name="Rami"/><div className="l1a-bubble"><span className="l15-name">Rami</span>
    {shown?<span className="l1a-de" lang="de" dir="ltr">{ramiTalk.join(' ')}</span>:<><span className="l2-secret" aria-hidden="true" lang="de">{ramiTalk.join(' ')}</span><span className="lk-visually-hidden">{ut('Metin gizli; önce dinle.')}</span></>}
   </div></div></div>
   <div className="l1a-actions">
    <button type="button" className="btn small" disabled={speech.busy} onClick={()=>speech.speakAll(ramiTalk.map(text=>({text,who:'rami'})))}><Play size={16} aria-hidden="true"/>{ut('Dinle')}</button>
    <button type="button" className="btn secondary small" disabled={shown} onClick={()=>setShown(true)}><Eye size={16} aria-hidden="true"/>{ut('Metni göster')}</button>
   </div>
  </>}
  lines={hearLines}
  after={done=>done?<div className="l1a-actions"><button type="button" className="btn secondary small" disabled={speech.busy} onClick={()=>speech.speak({text:ramiAbout,who:NARRATOR})}><Play size={16} aria-hidden="true"/><Tx text="Metni _er_ ile dinle"/></button></div>:null}
  {...props}/>;
}
/** Alıştırma 6 · capital letters: tap every word that is written with a capital. A right word turns green and big at
 * once; a word that stays small flashes red (a mistake). When all 16 are found the text is read. */
function CapsExercise(props:StepProps){
 const {speech,sound,onScore,step}=props;
 const total=capsNeed.length;
 const [found,setFound]=useState<number[]>([]);const [flash,setFlash]=useState<number|null>(null);
 const mistakes=useRef(0);const [over,setOver]=useState(false);const [feedback,setFeedback]=useState<Feedback>(null);
 const tap=(i:number)=>{
  if(over||found.includes(i))return;sound.prepare();speech.prepare();
  if(!capsNeed.includes(i)){mistakes.current++;setFlash(i);setTimeout(()=>setFlash(current=>current===i?null:current),700);setFeedback({ok:false,text:'Bu kelime küçük kalır.'});sound.wrong();return;}
  const next=[...found,i];setFound(next);setFeedback(null);
  if(next.length<total){sound.correct();return;}
  const right=Math.max(0,total-mistakes.current);setOver(true);onScore(step.id,right,total);
  setFeedback(right===total?{ok:true,text:'Hepsi doğru! {total} büyük harf.',params:{total}}:{ok:true,info:true,text:'Bitti: {total} büyük harfin hepsini buldun, {wrong} yanlış dokunuş.',params:{total,wrong:mistakes.current}});
  sound.correct(()=>speech.speak(capsSolved));
 };
 const again=()=>{setFound([]);setFlash(null);mistakes.current=0;setOver(false);setFeedback(null);};
 return <>
  <p className="kicker">{ut('Alıştırma 6 · Richtig schreiben')}</p><Heading>{ut('Büyük yazılması gereken kelimelere dokun')}</Heading>
  <p className="l1a-tr">{ut('Metin tamamen küçük harfle yazılmış. Cümle başlarına, isimlere, şehir/ülke ve dil adlarına ve bütün Nomen’lere dokun. Doğru kelime hemen büyür ve yeşil olur. Hepsi bulununca metin okunur.')}</p>
  <p className="l1a-mini">{ut('Bulunan: {n} / {total}',{n:found.length,total})}</p>
  <p className="l2-caps" lang="de">{capsWords.map((word,i)=><span key={i}>{i>0&&' '}<button type="button" className={'l2-cw'+(found.includes(i)?' up':'')+(flash===i?' bad':'')} disabled={over} aria-pressed={found.includes(i)} onClick={()=>tap(i)}>{found.includes(i)?capitalized(word):word}</button></span>)}</p>
  <FeedbackLine feedback={feedback}/>
  {over&&<div className="l1a-actions"><button type="button" className="btn secondary small" onClick={again}><RotateCcw size={16} aria-hidden="true"/>{ut('Baştan')}</button></div>}
 </>;
}
/** The learner's sentences about Omar (Alıştırma 7), kept in the browser. */
function readOmar():string[]{
 try{const saved=JSON.parse(localStorage.getItem(L2B_OWN_KEY)??'[]') as unknown;return omarPrompts.map((_,i)=>Array.isArray(saved)&&typeof saved[i]==='string'?saved[i] as string:'');}catch{return omarPrompts.map(()=>'');}
}
const fitsOmar=(i:number,value:string)=>!!value.trim()&&omarPrompts[i].pattern.test(normalizeLoose(value));
/** Alıştırma 7 · introduce Omar from his card: a sentence that fits turns green and, when the learner leaves the box,
 * is read; a wrong one shows the pattern. Done once all four fit. */
function OmarExercise({speech,sound,onScore,step}:StepProps){
 const [values,setValues]=useState<string[]>(readOmar);
 const [left,setLeft]=useState<boolean[]>(()=>omarPrompts.map(()=>false));
 const spoken=useRef<boolean[]>(omarPrompts.map(()=>false));const scored=useRef(false);
 const total=omarPrompts.length;const done=values.every((value,i)=>fitsOmar(i,value));
 const change=(i:number,value:string)=>{
  const next=values.slice();next[i]=value;setValues(next);
  try{localStorage.setItem(L2B_OWN_KEY,JSON.stringify(next));}catch{}
  if(!scored.current&&next.every((item,k)=>fitsOmar(k,item))){scored.current=true;onScore(step.id,total,total);}
 };
 const leave=(i:number)=>{
  const marks=left.slice();marks[i]=true;setLeft(marks);
  if(!fitsOmar(i,values[i])||spoken.current[i])return;
  spoken.current[i]=true;sound.prepare();speech.prepare();sound.correct(()=>speech.speak(omarPrompts[i].say));
 };
 return <>
  <p className="kicker">{ut('Alıştırma 7 · Schreiben Sie.')}</p><Heading>{ut('Karta bakarak Omar’ı tanıt')}</Heading>
  <p className="l1a-tr">{ut('Dört cümle yaz. Kalıba uyan cümle yeşil olur ve kutudan çıkınca okunur; uymuyorsa altında kalıp görünür.')}</p>
  <div className="l2-card"><Portrait who="omar" name="Omar"/><dl>{omarCard.map(([label,value])=><div key={label}><dt lang="de">{label}:</dt><dd lang="de">{value}</dd></div>)}</dl></div>
  {omarPrompts.map((prompt,i)=>{const fits=fitsOmar(i,values[i]);const state=fits?' ok':left[i]&&values[i].trim()?' bad':'';return <div className="l2-write" key={prompt.prompt}>
   <label className="l1a-mini" htmlFor={'l2b-omar-'+i}>{ut(prompt.prompt)}</label>
   <input id={'l2b-omar-'+i} className={'l1a-gap wide'+state} value={values[i]} lang="de" dir="ltr" autoCapitalize="sentences" autoComplete="off" spellCheck={false} placeholder={prompt.placeholder} onChange={event=>change(i,event.target.value)} onBlur={()=>leave(i)} onKeyDown={event=>{if(event.key==='Enter'){event.preventDefault();leave(i);}}}/>
   {state===' bad'&&<span className="l1a-mini">{ut('Kalıp:')} <span lang="de">{prompt.placeholder}</span></span>}
  </div>;})}
  <FeedbackLine feedback={done?{ok:true,text:'Süper! Omar’ı dört cümleyle tanıttın.'}:null}/>
  <Note><Tx text="İpucu: Sudan artikelli bir ülke: *aus dem Sudan* (Lektion 1’deki ~aus der Türkei~ gibi)."/></Note>
 </>;
}
/** Konuş of Teil B: introducing people; the last answer is Omar from Alıştırma 7 once all four sentences fit. */
function KonusL2B(props:StepProps){
 const [omarDone]=useState(()=>readOmar().every((value,i)=>fitsOmar(i,value)));
 const rows=practiceItemsB.map(item=>({key:item.question,who:item.who,question:item.question,answer:item.omar&&omarDone?omarAll:item.answer}));
 return <SpeakStep lead="Soruyu dinle, cevabı dinle, sonra sen yüksek sesle söyle. Son cevapta Alıştırma 7’deki Omar cümlelerin var." rows={rows}
  replies={['🎉 Süper! Artık başkasını tanıtabiliyorsun.','👍 İyi. Bir kez daha dinle ve söyle.','Sorun değil. Konu 3’e dön, yarın tekrar dene.']} {...props}/>;
}
/** The end: what the learner can do now and what comes next. */
function EndL2B({progress,onGo,onPart,language}:StepProps){
 return <>
  <p className="kicker">{ut('Bitti')}</p>
  <Heading>{ut('Lektion 2B tamam! 🎉')}</Heading>
  <PaulHoca pose="cheer" className="l1a-paul-big" sound="appear"/>
  <p>{ut('Artık şunları yapabilirsin:')}</p>
  <ul className="l1a-list">
   <li><Tx text="Birini tanıtmak: *Das ist … Er / Sie kommt aus … Das ist in …*"/></li>
   <li><Tx text="_er / sie / sie_ ile fiil çekmek: *-t* ve *-en*, *spricht*, *ist / sind*"/></li>
   <li><Tx text="Başkası hakkında soru sormak: *Woher kommt er? Wo wohnt sie? Wer ist das?*"/></li>
   <li>{ut('Doğru yazmak: cümle başı, isimler, ülkeler, diller ve bütün Nomen büyük')}</li>
  </ul>
  <Note><Tx text="**Kısa özet:** _er / sie + -t_ · _sie (Pl.) + -en_ · _er spricht, er arbeitet, er ist / sie sind_ · _Woher? → aus_ · _Wo? → in_ · her Nomen büyük"/></Note>
  <ProgressMeter progress={progress} language={language} label="Lektion 2B"/>
  <p className="l1a-tr"><Tx text="Sıradaki bölüm: *Teil C – Wir brauchen Hilfe.*"/></p>
  <div className="l1a-actions">
   <button type="button" className="btn small" onClick={()=>onPart('c',0)}>{ut('Teil C’ye geç')}<ArrowRight size={16} className="vault-direction-icon" aria-hidden="true"/></button>
   <button type="button" className="btn secondary small" onClick={()=>onGo(berufeStepIndexB('wer'))}>{ut('Alıştırmaları tekrar yap')}</button>
   <button type="button" className="btn secondary small" onClick={()=>onPart('a',0)}>Teil A</button>
   <button type="button" className="btn secondary small" onClick={()=>onGo(-1)}><BookOpen size={16} aria-hidden="true"/>{ut('Lektion 2 içindekiler')}</button>
  </div>
 </>;
}
