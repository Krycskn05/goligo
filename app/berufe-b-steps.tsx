'use client';
import {useRef,useState,type ReactNode} from 'react';
import {BookOpen,Eye,Play,RotateCcw} from 'lucide-react';
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
import {ProgressMeter} from './progress-ui';
import {PaulHoca} from './paul-hoca';
import {ChoiceExercise} from './stadt-a-steps';
import {Art,PhraseRow,QuickChecks} from './berufe-a-steps';
import {Say,Note,Heading,Portrait,FeedbackLine,useSelfCheck,selfCheckNote,type SelfCheckResult,ChoiceRows,OrderExercise,TestStep,mixedOrder,type Speech,type Sound,type StepProps,type Feedback} from './willkommen-ui';

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
  case 'kontrol':return <><p className="kicker" lang="de">Wortschatz · Kontrolle</p><Heading>Kelimeleri hatırlıyor musun?</Heading>
   <p className="l1a-tr">Hızlı bir kontrol, puanı yok. Yanlış olursa doğrusu yeşil görünür.</p>
   <QuickChecks items={wordChecksB} speech={speech} sound={sound} title="8 kısa soru"/>
   <div className="l1a-actions"><button type="button" className="btn secondary small" onClick={()=>props.onGo(berufeStepIndexB('ne-yapiyor'))}>Kartlara dön</button></div></>;
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
  case 'ozet':return <EndL2B {...props}/>;
 }
 return null;
}

/* ---------- small pieces ---------- */
/** A form with its marked part in bold ("komm|t" → komm**t**). */
function Marked({text}:{text:string}){return <>{text.split('|').map((part,i)=>i%2?<b key={i}>{part}</b>:part)}</>;}
/** er (blue), sie (red) and sie for more people (green), like the article colours. */
function Pron({kind,children}:{kind:Pronoun;children?:ReactNode}){return <span className={'l2-pron '+kind} lang="de">{children??(kind==='er'?'er':'sie')}</span>;}
/** A text about someone: their portraits, the name, German and Turkish; Paul Hoca reads it (a tap on the bubble too). */
function PersonCard({text,speech}:{text:PersonText;speech:Speech}){
 return <div className="l1a-dialogue"><div className="l1a-line a l2-person">
  <span className="l2-faces">{text.people.map(key=><Portrait key={key} who={key} name={personName(key)}/>)}</span>
  <div className="l1a-bubble"><span className="l15-name">{text.name}</span><span className="l1a-de" lang="de" dir="ltr">{text.de}</span><span className="l1a-tr">{text.tr}</span></div>
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
  <p>Paul Hoca sınıfta bir fotoğraf gösteriyor: <i lang="de">„Wer ist das?“</i> Şimdi başkalarını tanıtmayı öğreniyoruz.</p>
  <p>Bu bölümde öğreneceklerin:</p>
  <ul className="l1a-list">
   <li>Birini tanıtmak: <b lang="de">Das ist Nikos. Er kommt aus Griechenland.</b></li>
   <li>O ve onlar: <b lang="de">er</b> · <b lang="de">sie</b> · <b lang="de">sie (Pl.)</b> — <i lang="de">Sie wohnt. / Sie wohnen.</i></li>
   <li>Başkası hakkında sorular: <b lang="de">Woher kommt er? Wo wohnt sie? Wer ist das?</b></li>
   <li>Doğru yazmak: <b lang="de">Sie spricht Deutsch.</b> (büyük harf)</li>
  </ul>
  <h2 className="l1a-h2">Bu dersteki kişiler</h2>
  <ul className="l15-cast">{castL2B.map(key=><li key={key}><Portrait who={key} name={personName(key)}/><span>{personName(key)}</span></li>)}</ul>
 </>;
}
/** Who does what: a picture (a tap reads the job and the sentence), the job and the sentence as rows that read themselves. */
function Doings({speech}:{speech:Speech}){
 return <><p className="kicker" lang="de">Wortschatz · Was machen die Personen?</p><Heading>Kim ne yapıyor?</Heading>
  <p className="l1a-tr">Dört meslek, iki iş. Satıra ya da resme dokun, dinle ve yüksek sesle tekrar et.</p>
  <ul className="l2-jobs">{doings.map(doing=>{const picture=jobPicture(doing.key);const say=[...(doing.job?[doing.job]:[]),doing.sentence];return <li className="l2-job" key={doing.key}>
   <button type="button" className="l2-job-pic" aria-label={'Dinle: '+say.join(' ')} onClick={()=>speech.speakAll(say)}><img src={picture.src} alt={doing.alt} width={picture.width} height={picture.height} loading="lazy" decoding="async"/></button>
   <div className="l2-job-text">
    <span className="l15-name">{personName(doing.who)}</span>
    <ul className="l1a-say-list l2-forms">
     {doing.job&&<li><span lang="de"><Art de={doing.job}/></span><Say text={doing.job} speech={speech}/></li>}
     <li><span lang="de">{doing.sentence}</span><Say text={doing.sentence} speech={speech}/></li>
    </ul>
    <span className="l2-job-tr">{doing.tr}</span>
   </div>
  </li>;})}</ul></>;
}
function WordsB({speech}:{speech:Speech}){
 return <><p className="kicker" lang="de">Wortschatz · Wörter</p><Heading>Bu bölümün kelimeleri</Heading>
  <p className="l1a-tr">Her satırda kelime, anlamı ve bir örnek cümle var. Satıra dokununca örnek cümle okunur. <b lang="de">er</b> ve <b lang="de">sie</b> bu bölümün en önemli kelimeleri.</p>
  <div className="l15-word-grid">{wordsB.map(([de,tr,example,exampleTr])=><div className="l1a-phrase" key={de}><div className="l1a-phrase-text"><span className="l1a-de" lang="de"><Art de={de}/></span><span className="l1a-tr">{tr}</span><span className="l15-example" lang="de">{example}</span><span className="l1a-mini">{exampleTr}</span></div><Say text={example} speech={speech}/></div>)}</div></>;
}
function Pronouns({speech,sound}:{speech:Speech;sound:Sound}){
 return <><p className="kicker" lang="de">Konu 1 · er, sie, sie</p><Heading>Üçüncü kişi: <span lang="de">er · sie · sie</span> (onlar)</Heading>
  <p>Lektion 1’de hep <b lang="de">ich</b> (ben), <b lang="de">du</b> (sen) ve <b lang="de">Sie</b> (siz, resmî) ile konuştuk. Şimdi <b>başkasından bahsetmeyi</b> öğreniyoruz. Türkçede tek bir „o“ var; Almancada üç kelime var:</p>
  <table className="l1a-table"><thead><tr><th>Almanca</th><th>Türkçe</th><th>Örnek</th><th/></tr></thead>
   <tbody>{pronounRows.map(([kind,de,tr,example])=><tr key={kind}><td><Pron kind={kind}>{de}</Pron></td><td>{tr}</td><td lang="de"><Marked text={example}/></td><td><Say text={plainText(example)} speech={speech}/></td></tr>)}</tbody></table>
  <h2 className="l1a-h2">Aynı kelime, iki anlam: <span lang="de">sie</span></h2>
  <p><b lang="de">sie</b> hem „o (kadın)“ hem „onlar“ demek. Hangisi olduğunu <b>fiilin eki</b> söyler:</p>
  {sieTwo.map(([de,tr])=><div className="l1a-phrase" key={de}><div className="l1a-phrase-text"><span className="l1a-de" lang="de"><Marked text={de}/></span><span className="l1a-tr">{tr}</span></div><Say text={plainText(de)} speech={speech}/></div>)}
  <h2 className="l1a-h2">Üçüncü <span lang="de">„Sie“</span>: siz (resmî)</h2>
  <p>Lektion 1’den hatırla: <b lang="de">Sie</b> büyük harfle = siz (resmî). Fiili de „onlar“ gibi <b lang="de">-en</b> alır: <i lang="de">Woher kommen Sie?</i> Cümlenin ortasında büyük <b>S</b> görürsen „siz“, küçük <b>s</b> görürsen „o (kadın)“ ya da „onlar“ demektir.</p>
  <table className="l1a-table"><thead><tr><th>kelime</th><th>anlam</th><th>fiil</th></tr></thead>
   <tbody>{sieThree.map(([kind,de,tr,verb])=><tr key={kind}><td>{kind==='Sie'?<b lang="de">Sie</b>:<Pron kind={kind}>{de}</Pron>}</td><td>{tr}</td><td lang="de"><Marked text={verb}/></td></tr>)}</tbody></table>
  <h2 className="l1a-h2"><span lang="de">„Das ist“</span> ve <span lang="de">„Das sind“</span></h2>
  <p>Bir kişiyi tanıtırken <b lang="de">Das ist …</b> (Bu …), iki veya daha çok kişiyi tanıtırken <b lang="de">Das sind …</b> (Bunlar …) deriz.</p>
  {dasIst.map(([de,tr])=><PhraseRow key={de} de={de} tr={tr} speech={speech}/>)}
  <QuickChecks items={pronounChecks} speech={speech} sound={sound}/></>;
}
function VerbsB({speech,sound}:{speech:Speech;sound:Sound}){
 return <><p className="kicker" lang="de">Konu 2 · Verben</p><Heading>Fiil çekimi: <span lang="de">er / sie / sie</span> (Pl.)</Heading>
  <p>Kural basit: <b lang="de">er</b> ve <b lang="de">sie</b> (o) için fiil <b lang="de">-t</b> alır, <b lang="de">sie</b> (onlar) için <b lang="de">-en</b> alır. „-en“ biçimi fiilin sözlükteki hâliyle ve <span lang="de">„Sie“</span> (siz) biçimiyle aynıdır; yani yeni bir şey ezberlemiyorsun. Satıra dokun, dinle.</p>
  <VerbTableView rows={regularVerbs} speech={speech}/>
  <div className="l1a-actions"><button type="button" className="btn secondary small" disabled={speech.busy} onClick={()=>speech.speakAll(regularVerbs.map(verbRowSay))}><Play size={16} aria-hidden="true"/>Tabloyu dinle</button></div>
  <h2 className="l1a-h2">Dikkat edilecek dört fiil</h2>
  <p><b lang="de">1. sprechen → er spricht.</b> İçerideki <b>e</b>, <span lang="de">„du“</span> ve <span lang="de">„er/sie“</span> için <b>i</b> olur: <i lang="de">du spr<b>i</b>chst, er spr<b>i</b>cht</i>. „onlar“ için değişmez: <i lang="de">sie sprechen</i>.</p>
  <p><b lang="de">2. arbeiten → er arbeitet.</b> Gövde <b>-t</b> ile bittiği için araya <b>e</b> girer: <i lang="de">er arbeit<b>et</b>, du arbeit<b>est</b></i>.</p>
  <p><b lang="de">3. heißen → er heißt.</b> <span lang="de">„du heißt“</span> ile aynı görünür; <b>ß</b>’ten sonra sadece <b>t</b> gelir.</p>
  <p><b lang="de">4. sein</b> kuralsız: <b lang="de">er ist</b> (o -dır), <b lang="de">sie sind</b> (onlar -dırlar).</p>
  <VerbTableView rows={specialVerbs} speech={speech}/>
  <div className="l1a-actions"><button type="button" className="btn secondary small" disabled={speech.busy} onClick={()=>speech.speakAll(specialVerbs.map(verbRowSay))}><Play size={16} aria-hidden="true"/>Tabloyu dinle</button></div>
  <p className="l15-warn"><b lang="de">sein</b> fiilini ezberle: <i lang="de">Er ist Koch.</i> · <i lang="de">Sie sind neu im Kurs.</i></p>
  <h2 className="l1a-h2">Örnekler</h2>
  {verbExamples.map(([de,tr])=><PhraseRow key={de} de={de} tr={tr} speech={speech}/>)}
  <QuickChecks items={verbChecksB} speech={speech} sound={sound}/></>;
}
function Intro({speech,sound}:{speech:Speech;sound:Sound}){
 return <><p className="kicker" lang="de">Konu 3 · Das ist …</p><Heading>Birini tanıtma</Heading>
  <p>Bir kişiyi tanıtmak için Lektion 1’deki cümleleri alıp <b lang="de">ich</b> yerine <b lang="de">er / sie</b> koyuyoruz. Fiil de ona göre değişiyor (<span lang="de">-e → -t</span>). Sıra hep aynı: kim, nereden, nerede, mesleği, dilleri, ne yapıyor.</p>
  <table className="l1a-table"><thead><tr><th lang="de">ich (Lektion 1)</th><th lang="de">er / sie</th><th/></tr></thead>
   <tbody>{introRows.map(([ich,er,say])=><tr key={ich}><td lang="de">{ich}</td><td lang="de"><Marked text={er}/></td><td><Say text={say} speech={speech}/></td></tr>)}</tbody></table>
  <h2 className="l1a-h2">Şehir ve ülke: <span lang="de">„Das ist in …“</span></h2>
  <p>Önce şehri söyleyip sonra ülkeyi eklemek çok doğal bir kalıp: <i lang="de">Er kommt aus Thessaloniki. Das ist in Griechenland.</i> Böylece dinleyen kişi şehri bilmese de anlar.</p>
  <PhraseRow de={cityPhrase[0]} tr={cityPhrase[1]} speech={speech}/>
  <h2 className="l1a-h2">Ne zamandır? <span lang="de">„schon lange“</span> ve <span lang="de">„jetzt“</span></h2>
  {timePhrases.map(([de,tr])=><div className="l1a-phrase" key={de}><div className="l1a-phrase-text"><span className="l1a-de" lang="de"><Marked text={de}/></span><span className="l1a-tr">{tr}</span></div><Say text={plainText(de)} speech={speech}/></div>)}
  <h2 className="l1a-h2">Bir kişi: Tomasz</h2>
  <PersonCard text={tomaszText} speech={speech}/>
  <h2 className="l1a-h2">İki kişi: Yasemin ve Mei</h2>
  <p>İki kişiden bahsederken <b lang="de">Das sind …</b> ve fiil <b lang="de">-en</b>:</p>
  <PersonCard text={twoText} speech={speech}/>
  <Note>İpucu: Bir kişiyi tanıtırken ilk cümlede adı söyle (<i lang="de">Das ist Tomasz.</i>), sonra hep <b lang="de">er</b> ya da <b lang="de">sie</b> ile devam et. Her cümlede adı tekrar etme.</Note>
  <QuickChecks items={introChecks} speech={speech} sound={sound}/></>;
}
function Questions({speech,sound}:{speech:Speech;sound:Sound}){
 return <><p className="kicker" lang="de">Konu 4 · W-Fragen</p><Heading>Başkası hakkında soru sorma</Heading>
  <p>Soru kelimesi başta, fiil hemen arkasında (2. sırada), sonra kişi. Lektion 1’deki soruların aynısı; sadece <b lang="de">du/Sie</b> yerine <b lang="de">er/sie</b> var.</p>
  <table className="l1a-table"><thead><tr><th>Soru</th><th>Cevap</th><th/></tr></thead>
   <tbody>{questionRows.map(row=><tr key={row[0]}><td><span lang="de"><Marked text={row[0]}/></span><br/><span className="l1a-mini">{row[1]}</span></td><td lang="de">{row[2]}</td><td><Say text={questionRowSay(row)} speech={speech}/></td></tr>)}</tbody></table>
  <h2 className="l1a-h2"><span lang="de">Woher</span> ve <span lang="de">Wo</span>’yu karıştırma</h2>
  <p><b lang="de">Woher</b> = nere<b>den</b> → cevap <b lang="de">aus</b> ile: <i lang="de">Woher kommt er? – Aus Polen.</i><br/><b lang="de">Wo</b> = nere<b>de</b> → cevap <b lang="de">in</b> ile: <i lang="de">Wo wohnt er? – In Hamburg.</i></p>
  <h2 className="l1a-h2">Onlar için: fiil <span lang="de">-en</span></h2>
  {pluralQuestions.map(([de,tr])=><PhraseRow key={de} de={de} tr={tr} speech={speech}/>)}
  <h2 className="l1a-h2">Sıra: soru kelimesi · fiil · kişi</h2>
  <table className="l1a-table"><thead><tr><th>1</th><th>2 · fiil</th><th>3</th><th>…</th><th/></tr></thead>
   <tbody>{orderRowsB.map(row=><tr key={row.join(' ')}><td lang="de">{row[0]}</td><td lang="de"><b>{row[1]}</b></td><td lang="de">{row[2]}</td><td lang="de">{row[3]}</td><td><Say text={orderRowSayB(row)} speech={speech}/></td></tr>)}</tbody></table>
  <QuickChecks items={questionChecks} speech={speech} sound={sound}/></>;
}
function Capitals({speech}:{speech:Speech}){
 return <><p className="kicker" lang="de">Konu 5 · Richtig schreiben</p><Heading>Doğru yazma: büyük harf</Heading>
  <p>Almancada büyük harf Türkçeden daha sık kullanılır. Bir metin yazarken şu dört yere bak:</p>
  <ol className="l1a-list">
   <li><b>Cümle başı:</b> <span lang="de"><b>D</b>as ist Sabine. <b>S</b>ie kommt aus Hamburg.</span></li>
   <li><b>İsimler, şehirler, ülkeler:</b> <span lang="de"><b>S</b>abine <b>K</b>rüger, <b>H</b>amburg, <b>D</b>eutschland</span></li>
   <li><b>Diller:</b> <span lang="de"><b>D</b>eutsch, <b>E</b>nglisch, <b>T</b>ürkisch</span></li>
   <li><b>Bütün isimler (Nomen):</b> <span lang="de"><b>V</b>erkäuferin, <b>T</b>ee, <b>B</b>uch, <b>F</b>ilm, <b>B</b>eruf</span> — Almancada her isim büyük yazılır; Türkçede böyle bir kural yok, bu yüzden en çok burada hata yapılır.</li>
  </ol>
  <p>Küçük kalanlar: fiiller (<span lang="de">kommt, wohnt</span>), <b lang="de">er / sie</b> (cümle başında değilse), <span lang="de">aus / in / und / als</span> gibi küçük kelimeler.</p>
  <h2 className="l1a-h2">Örnek</h2>
  <p className="l1a-mini">yanlış:</p><p className="l2-caps-wrong" lang="de">{capsWrong}</p>
  <div className="l1a-phrase"><div className="l1a-phrase-text"><span className="l1a-mini">doğru:</span><span className="l1a-de" lang="de"><Marked text={capsRight}/></span></div><Say text={plainText(capsRight)} speech={speech}/></div>
  <Note><b lang="de">Sie</b> cümle ortasında büyükse „siz“ (resmî), küçükse „o / onlar“. Cümle başında ikisi de büyük yazılır; o zaman anlamı fiil ekinden ve bağlamdan çıkarırsın.</Note>
  <h2 className="l1a-h2">Bu ünitenin kalıpları</h2>
  {phrasesB.map(([de,tr])=><PhraseRow key={de} de={de} tr={tr} speech={speech}/>)}
  <div className="l1a-actions"><button type="button" className="btn secondary small" disabled={speech.busy} onClick={()=>speech.speakAll(phrasesB.map(([de])=>de))}><Play size={16} aria-hidden="true"/>Tümünü dinle</button></div>
  <p className="l1a-tr">Şimdi alıştırmalar. Sırayla yapılır; bir alıştırma bitmeden sonraki açılmaz.</p></>;
}

/* ---------- exercises ---------- */
/** Alıştırma 1 · three texts (read by Paul Hoca), then who is it? One answer per row; the right sentence is read. */
function WhoExercise(props:StepProps){
 const {speech}=props;
 const rows=whoRows.map(([prompt,answer,say])=>({key:prompt,label:prompt,before:<span className="l15-row-sentence" lang="de">{prompt}</span>,options:whoOptions.map(value=>({value,label:value})),answer,say:{text:say,who:NARRATOR}}));
 return <ChoiceRows kicker="Alıştırma 1 · Lesen Sie. Wer ist das?" title="Üç metni oku, sonra kim olduğunu bul" lead="Önce üç kısa metni oku ve dinle. Sonra her cümle için doğru kişiyi seç."
  before={<>
   {readTexts.map(text=><PersonCard key={text.name} text={text} speech={speech}/>)}
   <div className="l1a-actions"><button type="button" className="btn secondary small" disabled={speech.busy} onClick={()=>speech.speakAll(readTexts.map(text=>({text:text.de,who:NARRATOR})))}><Play size={16} aria-hidden="true"/>Tümünü dinle</button></div>
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
  onScore(step.id,firstRight,total);setFeedback({ok:true,text:firstRight===total?'Hepsi doğru!':`Hepsi doğru! İlk denemede ${firstRight} / ${total} doğruydu.`});
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
  return <span className="l1a-gap-wrap"><input ref={element=>{refs.current[i]=element;}} className={'l1a-gap'+state} value={self.values[i]} lang="de" dir="ltr" autoCapitalize="off" autoComplete="off" spellCheck={false} aria-label={cell.verb+(cell.col?' · sie (onlar)':' · er / sie')} enterKeyHint="next"
   onChange={event=>change(i,event.target.value)} onBlur={()=>note(self.leave(i))} onKeyDown={event=>{if(event.key==='Enter'){event.preventDefault();note(self.leave(i));focusNext(i);}}}/>{self.hinted[i]&&self.state[i]!==true&&<span className="l1a-hint" lang="de">→ {cell.answer}</span>}</span>;};
 return <>
  <p className="kicker" lang="de">Alıştırma 2 · Verben</p><Heading>Fiil tablosunu doldur</Heading>
  <p className="l1a-tr"><span lang="de">er / sie</span> için <b>-t</b>, <span lang="de">sie</span> (onlar) için <b>-en</b>. Doğru yazınca kutu hemen yeşil olur ve okunur. (ß yerine ss de yazabilirsin.)</p>
  <table className="l1a-table l2-verb-gaps"><thead><tr><th>fiil</th><th><Pron kind="er"/> / <Pron kind="sie"/></th><th><Pron kind="pl"/> (onlar)</th></tr></thead>
   <tbody>{verbGaps.map((row,r)=><tr key={row[0]}><td><b lang="de">{row[0]}</b></td><td>{field(r*2)}</td><td>{field(r*2+1)}</td></tr>)}</tbody></table>
  <FeedbackLine feedback={feedback}/>
  <div className="l1a-actions"><button type="button" className="btn secondary small" onClick={restart}><RotateCcw size={16} aria-hidden="true"/>Baştan</button></div>
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
  lead={<>Rami <b lang="de">ich</b> ile konuşuyor; sen onun hakkında <b lang="de">er</b> ile yazıyorsun. Önce dinle (istediğin kadar), sonra boşluklara dokun ve seç.</>}
  before={<>
   <div className="l1a-dialogue"><div className="l1a-line a"><Portrait who="rami" name="Rami"/><div className="l1a-bubble"><span className="l15-name">Rami</span>
    {shown?<span className="l1a-de" lang="de" dir="ltr">{ramiTalk.join(' ')}</span>:<><span className="l2-secret" aria-hidden="true" lang="de">{ramiTalk.join(' ')}</span><span className="lk-visually-hidden">Metin gizli; önce dinle.</span></>}
   </div></div></div>
   <div className="l1a-actions">
    <button type="button" className="btn small" disabled={speech.busy} onClick={()=>speech.speakAll(ramiTalk.map(text=>({text,who:'rami'})))}><Play size={16} aria-hidden="true"/>Dinle</button>
    <button type="button" className="btn secondary small" disabled={shown} onClick={()=>setShown(true)}><Eye size={16} aria-hidden="true"/>Metni göster</button>
   </div>
  </>}
  lines={hearLines}
  after={done=>done?<div className="l1a-actions"><button type="button" className="btn secondary small" disabled={speech.busy} onClick={()=>speech.speak({text:ramiAbout,who:NARRATOR})}><Play size={16} aria-hidden="true"/>Metni <span lang="de">er</span> ile dinle</button></div>:null}
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
  setFeedback(right===total?{ok:true,text:`Hepsi doğru! ${total} büyük harf.`}:{ok:true,info:true,text:`Bitti: ${total} büyük harfin hepsini buldun, ${mistakes.current} yanlış dokunuş.`});
  sound.correct(()=>speech.speak(capsSolved));
 };
 const again=()=>{setFound([]);setFlash(null);mistakes.current=0;setOver(false);setFeedback(null);};
 return <>
  <p className="kicker" lang="de">Alıştırma 6 · Richtig schreiben</p><Heading>Büyük yazılması gereken kelimelere dokun</Heading>
  <p className="l1a-tr">Metin tamamen küçük harfle yazılmış. Cümle başlarına, isimlere, şehir/ülke ve dil adlarına ve bütün Nomen’lere dokun. Doğru kelime hemen büyür ve yeşil olur. Hepsi bulununca metin okunur.</p>
  <p className="l1a-mini">Bulunan: {found.length} / {total}</p>
  <p className="l2-caps" lang="de">{capsWords.map((word,i)=><span key={i}>{i>0&&' '}<button type="button" className={'l2-cw'+(found.includes(i)?' up':'')+(flash===i?' bad':'')} disabled={over} aria-pressed={found.includes(i)} onClick={()=>tap(i)}>{found.includes(i)?capitalized(word):word}</button></span>)}</p>
  <FeedbackLine feedback={feedback}/>
  {over&&<div className="l1a-actions"><button type="button" className="btn secondary small" onClick={again}><RotateCcw size={16} aria-hidden="true"/>Baştan</button></div>}
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
  <p className="kicker" lang="de">Alıştırma 7 · Schreiben Sie.</p><Heading>Karta bakarak Omar’ı tanıt</Heading>
  <p className="l1a-tr">Dört cümle yaz. Kalıba uyan cümle yeşil olur ve kutudan çıkınca okunur; uymuyorsa altında kalıp görünür.</p>
  <div className="l2-card"><Portrait who="omar" name="Omar"/><dl>{omarCard.map(([label,value])=><div key={label}><dt lang="de">{label}:</dt><dd lang="de">{value}</dd></div>)}</dl></div>
  {omarPrompts.map((prompt,i)=>{const fits=fitsOmar(i,values[i]);const state=fits?' ok':left[i]&&values[i].trim()?' bad':'';return <div className="l2-write" key={prompt.prompt}>
   <label className="l1a-mini" htmlFor={'l2b-omar-'+i}>{prompt.prompt}</label>
   <input id={'l2b-omar-'+i} className={'l1a-gap wide'+state} value={values[i]} lang="de" dir="ltr" autoCapitalize="sentences" autoComplete="off" spellCheck={false} placeholder={prompt.placeholder} onChange={event=>change(i,event.target.value)} onBlur={()=>leave(i)} onKeyDown={event=>{if(event.key==='Enter'){event.preventDefault();leave(i);}}}/>
   {state===' bad'&&<span className="l1a-mini">Kalıp: <span lang="de">{prompt.placeholder}</span></span>}
  </div>;})}
  <FeedbackLine feedback={done?{ok:true,text:'Süper! Omar’ı dört cümleyle tanıttın.'}:null}/>
  <Note>İpucu: Sudan artikelli bir ülke: <b lang="de">aus dem Sudan</b> (Lektion 1’deki <i lang="de">aus der Türkei</i> gibi).</Note>
 </>;
}
/** The end: what the learner can do now, a speaking practice (Omar from Alıştırma 7) and what comes next. */
function EndL2B({progress,onGo,onPart,speech}:StepProps){
 const [omarDone]=useState(()=>readOmar().every((value,i)=>fitsOmar(i,value)));
 return <>
  <p className="kicker" lang="de">Zusammenfassung · Sprechen</p>
  <Heading>Lektion 2B tamam! 🎉</Heading>
  <PaulHoca pose="cheer" className="l1a-paul-big" sound="appear"/>
  <p>Artık şunları yapabilirsin:</p>
  <ul className="l1a-list">
   <li>Birini tanıtmak: <b lang="de">Das ist … Er / Sie kommt aus … Das ist in …</b></li>
   <li><span lang="de">er / sie / sie</span> ile fiil çekmek: <b lang="de">-t</b> ve <b lang="de">-en</b>, <b lang="de">spricht</b>, <b lang="de">ist / sind</b></li>
   <li>Başkası hakkında soru sormak: <b lang="de">Woher kommt er? Wo wohnt sie? Wer ist das?</b></li>
   <li>Doğru yazmak: cümle başı, isimler, ülkeler, diller ve bütün Nomen büyük</li>
  </ul>
  <h2 className="l1a-h2">Konuşma pratiği</h2>
  <p className="l1a-tr">Soruyu dinle, cevabı dinle, sonra sen yüksek sesle söyle. Son cevapta Alıştırma 7’deki Omar cümlelerin var.</p>
  <div className="l1a-dialogue">{practiceItemsB.map(item=>{const answer=item.omar&&omarDone?omarAll:item.answer;return <div className="l2-practice" key={item.question}>
   <div className="l1a-line a"><Portrait who={item.who} name={personName(item.who)}/><div className="l1a-bubble l15-say-bubble"><div className="l15-say-text"><span className="l15-name">{personName(item.who)}</span><span className="l1a-de" lang="de" dir="ltr">{item.question}</span></div><Say text={item.question} who={item.who} speech={speech}/></div></div>
   <div className="l1a-line b"><div className="l1a-bubble l15-say-bubble"><div className="l15-say-text"><span className="l15-name">Sen</span><span className="l1a-de" lang="de" dir="ltr">{answer}</span></div><Say text={answer} speech={speech}/></div></div>
  </div>;})}</div>
  <Note><b>Kısa özet:</b> <span lang="de">er / sie + -t</span> · <span lang="de">sie (Pl.) + -en</span> · <span lang="de">er spricht, er arbeitet, er ist / sie sind</span> · <span lang="de">Woher? → aus</span> · <span lang="de">Wo? → in</span> · her Nomen büyük</Note>
  <ProgressMeter progress={progress} language={'tr'} label="Lektion 2B"/>
  <p className="l1a-tr">Sıradaki bölüm: <b lang="de">Teil C – Wir brauchen Hilfe.</b> · yakında.</p>
  <div className="l1a-actions">
   <button type="button" className="btn secondary small" onClick={()=>onGo(berufeStepIndexB('wer'))}>Alıştırmaları tekrar yap</button>
   <button type="button" className="btn secondary small" onClick={()=>onPart('a',0)}>Teil A</button>
   <button type="button" className="btn secondary small" onClick={()=>onGo(-1)}><BookOpen size={16} aria-hidden="true"/>Lektion 2 içindekiler</button>
  </div>
 </>;
}
