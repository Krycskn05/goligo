'use client';
import {useEffect,useRef,useState,type ReactNode} from 'react';
import {ArrowRight,BookOpen,Play,RotateCcw} from 'lucide-react';
import {normalizeLoose} from '@/lib/willkommen-course';
import {isTurkishText,personName} from '@/lib/berufe-course';
import {
 berufeCPictures,castL2C,numberWords,countAll,teenRows,phones,phoneSay,phonePhrases,wordsC,wordSayC,phrasesC,
 wordChecksC,numberChecks,plusChecks,helpChecks,formChecksC,wirChecks,plusPhrases,helpPhrases,helpDialogue,meaningRows,meaningSay,
 formRows,possessiveRows,possessivePhrases,wirIhrVerbs,wirIhrSay,wirIhrRows,flatDialogue,allPersons,allPersonsSay,stressRows,
 listenNumbers,numberRows,numberRowSay,phoneDigits,dice,diceSentence,diceLines,helpLines,helpSay,fieldQuestions,fieldSay,
 possessiveLines,wirIhrLines,berufeTestC,practiceItemsC,berufeStepIndexC,type PersonGapLine,
} from '@/lib/berufe-c-course';
import {ProgressMeter} from './progress-ui';
import {PaulHoca} from './paul-hoca';
import {ChoiceExercise} from './stadt-a-steps';
import {Art,PhraseRow,QuickChecks,Conversation,SpeakStep} from './berufe-a-steps';
import {Marked} from './berufe-b-steps';
import {Say,Note,Heading,Portrait,FeedbackLine,scoreFeedback,useSelfCheck,selfCheckNote,type SelfCheckResult,GapExercise,ChoiceRows,TestStep,shuffle,useFinish,useInnerNext,type Speech,type Sound,type StepProps,type Feedback} from './willkommen-ui';

/**
 * Lektion 2 „Berufe“, Teil C – Wir brauchen Hilfe. (the learner's lesson page, 2 November 2026): the steps. The notebook
 * around them is app/berufe-study.tsx; the texts are lib/berufe-c-course.ts; the shared pieces come from
 * app/willkommen-ui.tsx, app/stadt-a-steps.tsx (sentence choices) and app/berufe-a-steps.tsx (quick checks, phrase rows,
 * dialogues, Konuş). A number heard in Alıştırma 1 is read as soon as its question opens; numbers above 20 are only heard.
 */
export function StepViewL2C(props:StepProps){
 const {step,speech,sound}=props;
 switch(step.id){
  case 'kapak':return <CoverL2C/>;
  case 'sayilar':return <Numbers speech={speech}/>;
  case 'kelimeler':return <WordsC speech={speech}/>;
  case 'kontrol':return <><p className="kicker" lang="de">Wortschatz · Kontrolle</p><Heading>Kelimeleri hatırlıyor musun?</Heading>
   <p className="l1a-tr">Hızlı bir kontrol, puanı yok. Yanlış olursa doğrusu yeşil görünür.</p>
   <QuickChecks items={wordChecksC} speech={speech} sound={sound} title="8 kısa soru"/>
   <div className="l1a-actions"><button type="button" className="btn secondary small" onClick={()=>props.onGo(berufeStepIndexC('sayilar'))}>Sayılara dön</button></div></>;
  case 'sayi-kurali':return <NumberRules speech={speech} sound={sound}/>;
  case 'toplama':return <Plus speech={speech} sound={sound}/>;
  case 'yardim':return <Help speech={speech} sound={sound}/>;
  case 'form':return <FormTopic speech={speech} sound={sound}/>;
  case 'wir-ihr':return <WirIhr speech={speech} sound={sound}/>;
  case 'vurgu':return <Stress speech={speech}/>;
  case 'sayi-dinle':return <NumberListen {...props}/>;
  case 'dizi':return <GapExercise kicker="Alıştırma 2 · Welche Zahl passt?" title="Eksik sayıları yaz" lead="Diziyi tamamla; sayıyı yazıyla yaz (zwei, vier …). Doğru kutu hemen yeşil olur. ü ve ö için alttaki harf düğmeleri." lines={numberRows} say={numberRowSay} {...props}/>;
  case 'telefon':return <PhoneExercise {...props}/>;
  case 'zar':return <GapExercise kicker="Alıştırma 4 · Wie viel ist das?" title="Zarları topla" lead="Üç zar. Toplamı yazıyla yaz (elf, zwölf …); rakamla da olur. Hepsi doğru olunca cümleler okunur." lines={diceLines} say={dice.map(row=>({text:diceSentence(row),who:'nikos'}))} {...props}/>;
  case 'yardim-diyalog':return <HelpExercise {...props}/>;
  case 'form-soru':return <FieldExercise {...props}/>;
  case 'mein-dein':return <ChoiceExercise kicker="Alıştırma 7 · mein, meine oder dein, deine?" title="mein / meine · dein / deine" lead={<>Paul Hoca soruyor, kişi cevaplıyor. Her boşluğa dokun ve iki kelimeden birini seç. İpucu: <b lang="de">die</b> kelimelerde <b lang="de">-e</b> gelir; cümle başında büyük harf.</>} lines={possessiveLines} dialogue {...props}/>;
  case 'wir-ihr-yaz':return <PersonGaps kicker="Alıştırma 8 · Ergänzen Sie." title="Fiilleri wir ve ihr için çek" lead={<>Parantezdeki fiili doğru biçimde yaz. <b lang="de">wir → -en</b>, <b lang="de">ihr → -t</b>; <span lang="de">sein</span>: <i lang="de">wir sind, ihr seid</i>. Doğru yazılan satır, kişinin sesiyle okunur.</>} lines={wirIhrLines} {...props}/>;
  case 'test':return <TestStep label="Lektion 2C · Test" questions={berufeTestC} sayFor={i=>berufeTestC[i][3]} langOf={text=>isTurkishText(text)?'tr':'de'} {...props}/>;
  case 'konus':return <SpeakStep lead="Soruyu dinle, cevabı dinle, sonra sen yüksek sesle söyle. Telefon numarasında kendi numaranı söyleyebilirsin (yazma, sadece söyle; numaran bu cihazda bile kaydedilmez)."
   rows={practiceItemsC.map(item=>({key:item.question,who:item.who,question:item.question,answer:item.answer,say:item.answerSay}))}
   replies={['🎉 Süper! Telefon numaranı artık Almanca söyleyebilirsin.','👍 İyi. Bir kez daha dinle ve söyle.','Sorun değil. Sayılar adımına dön, yarın tekrar dene.']} {...props}/>;
  case 'bitti':return <EndL2C {...props}/>;
 }
 return null;
}

/* ---------- small pieces ---------- */
/** A text with struck-through letters between ~ ("sech~s~ + zehn"). */
function Struck({text}:{text:string}){return <>{text.split('~').map((part,i)=>i%2?<s key={i}>{part}</s>:part)}</>;}
/** A picture without the scene frame (the hands, the form). */
function Plain({src,width,height,alt}:{src:string;width:number;height:number;alt:string}){return <img className="l2-plain" src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async"/>;}
/** German, meaning and what is read (digits as words). */
function SayRow({de,tr,say,speech}:{de:string;tr?:ReactNode;say:string;speech:Speech}){
 return <div className="l1a-phrase"><div className="l1a-phrase-text"><span className="l1a-de" lang="de" dir="ltr">{de}</span>{tr&&<span className="l1a-tr">{tr}</span>}</div><Say text={say} speech={speech}/></div>;
}

/* ---------- teaching steps ---------- */
function CoverL2C(){ // the cover picture and the part's progress are on the notebook's left page
 return <>
  <p className="kicker" lang="de">Lektion 2 · Berufe</p>
  <Heading><span lang="de">C — Wir brauchen Hilfe.</span></Heading>
  <p>Yasemin formu anlamıyor; Omar ve Nikos yardım ediyor. Bu bölümde sayıları, formları ve yardım istemeyi öğreniyoruz.</p>
  <p>Bu bölümde öğreneceklerin:</p>
  <ul className="l1a-list">
   <li>Sayılar 0–20 ve telefon numarası: <b lang="de">Wie ist deine Telefonnummer?</b></li>
   <li>Toplama: <b lang="de">Sechs plus fünf ist elf.</b></li>
   <li>Yardım isteme: <b lang="de">Entschuldigung, ich brauche Hilfe.</b> · <b lang="de">Ich verstehe das nicht.</b></li>
   <li>Form doldurma: <b lang="de">Vorname · Nachname · Adresse · PLZ</b> ve <b lang="de">mein / dein</b></li>
   <li>Biz ve siz: <b lang="de">wir wohnen · ihr wohnt</b></li>
  </ul>
  <h2 className="l1a-h2">Bu dersteki kişiler</h2>
  <ul className="l15-cast">{castL2C.map(key=><li key={key}><Portrait who={key} name={personName(key)}/><span>{personName(key)}</span></li>)}</ul>
 </>;
}
/** The numbers 0–20 (a tap reads one), all of them in a row, and counting on the fingers (the German way). */
function Numbers({speech}:{speech:Speech}){
 const warm=speech.warm;useEffect(()=>{warm?.([...numberWords]);},[warm]);
 return <><p className="kicker" lang="de">Wortschatz · Die Zahlen</p><Heading>Sayılar 0–20</Heading>
  <p className="l1a-tr">Bir sayıya dokun: okunur. Hepsini sırayla dinle, sonra kendin say.</p>
  <div className="l2-numgrid">{numberWords.map((word,n)=><button type="button" key={word} className={'l2-num'+(speech.busy&&speech.activeText===word?' playing':'')} aria-label={n+': '+word} onClick={()=>speech.speak(word)}><span className="l2-num-d">{n}</span><span className="l2-num-w" lang="de">{word}</span></button>)}</div>
  <div className="l1a-actions"><button type="button" className="btn secondary small" disabled={speech.busy} onClick={()=>speech.speak(countAll)}><Play size={16} aria-hidden="true"/>0’dan 20’ye dinle</button></div>
  <h2 className="l1a-h2">Parmakla sayma</h2>
  <p>Almanlar parmakla sayarken <b>başparmaktan</b> başlar: 1 = başparmak, 2 = başparmak + işaret parmağı, 3 = üç parmak. Kafede <i lang="de">„zwei Kaffee“</i> derken başparmak ve işaret parmağını kaldırırsın. Türkiye’deki gibi işaret ve orta parmağı kaldırırsan garson anlar ama biraz şaşırabilir.</p>
  <figure className="l2-hands"><Plain {...berufeCPictures.hands05} alt="Eller: 0’dan 5’e Alman usulü parmakla sayma; yumruk 0, başparmak 1, başparmak ve işaret parmağı 2, üç parmak 3, dört parmak 4, açık el 5"/><figcaption>0 · 1 · 2 · 3 · 4 · 5</figcaption></figure>
  <figure className="l2-hands"><Plain {...berufeCPictures.hands610} alt="Eller: 6’dan 10’a iki elle sayma; bir açık el ve diğer elde 1’den 5’e kadar parmak"/><figcaption>6 · 7 · 8 · 9 · 10</figcaption></figure></>;
}
function WordsC({speech}:{speech:Speech}){
 return <><p className="kicker" lang="de">Wortschatz · Wörter</p><Heading>Bu bölümün kelimeleri</Heading>
  <p className="l1a-tr">Formdaki alanlar ve yardım isteme kelimeleri. Her satırda kelime, anlamı ve bir örnek var; satıra dokununca örnek okunur.</p>
  <div className="l15-word-grid">{wordsC.map(row=>{const [de,tr,example,exampleTr]=row;return <div className="l1a-phrase" key={de}><div className="l1a-phrase-text"><span className="l1a-de" lang="de"><Art de={de}/></span><span className="l1a-tr">{tr}</span><span className="l15-example" lang="de">{example}</span><span className="l1a-mini">{exampleTr}</span></div><Say text={wordSayC(row)} speech={speech}/></div>;})}</div></>;
}
function NumberRules({speech,sound}:{speech:Speech;sound:Sound}){
 return <><p className="kicker" lang="de">Konu 1 · Zahlen 0–20</p><Heading>Sayılar nasıl kurulur?</Heading>
  <p><b>0’dan 12’ye</b> kadar her sayının kendi adı var; bunları ezberlemek gerekiyor: <i lang="de">null, eins, zwei, drei, vier, fünf, sechs, sieben, acht, neun, zehn, <b>elf</b>, <b>zwölf</b></i>. 11 ve 12 kurala uymaz; Türkçedeki „on bir, on iki“ gibi kurulmaz.</p>
  <h2 className="l1a-h2">13–19: birler + <span lang="de">zehn</span></h2>
  <p>13’ten 19’a kadar kural var: önce birler basamağı, sonra <b lang="de">-zehn</b>. Türkçenin tersi: biz „on üç“ deriz, Almanlar „üç-on“ (<i lang="de">drei-zehn</i>).</p>
  <table className="l1a-table"><tbody>{teenRows.map(([n,built,word,warn])=><tr key={n}><td>{n}</td><td lang="de"><Struck text={built}/></td><td lang="de"><b>{word}</b>{warn&&' ⚠️'}</td><td><Say text={word} speech={speech}/></td></tr>)}</tbody></table>
  <p className="l15-warn">İki istisna: <b lang="de">16 = sechzehn</b> (<i lang="de">sechs</i>’in s’si düşer) ve <b lang="de">17 = siebzehn</b> (<i lang="de">sieben</i>’in -en’i düşer). <i lang="de">„sechszehn“</i> ve <i lang="de">„siebenzehn“</i> yanlıştır.</p>
  <h2 className="l1a-h2">Telefon numarası</h2>
  <p>Telefon numarası <b>rakam rakam</b> okunur, gruplar arasında küçük bir duraklama yapılır. Sıfır <b lang="de">null</b>’dur.</p>
  {phonePhrases.map(([de,tr,say])=><SayRow key={de} de={de} tr={tr} say={say} speech={speech}/>)}
  <Note>Almanya’da cep numaraları <b>015, 016, 017</b> ile başlar; Berlin’in sabit hatları <b>030</b> ile. Yurt dışından ararken baştaki 0 düşer ve <b>+49</b> gelir: +49 176 … (Bu dersteki bütün numaralar uydurmadır.)</Note>
  <QuickChecks items={numberChecks} speech={speech} sound={sound}/></>;
}
function Plus({speech,sound}:{speech:Speech;sound:Sound}){
 return <><p className="kicker" lang="de">Konu 2 · Rechnen</p><Heading>Kaç eder? Toplama</Heading>
  <p>Kitaptaki zar oyunu için iki kelime yeter: <b lang="de">plus</b> (artı) ve <b lang="de">ist</b> (eder, eşittir). Soru: <b lang="de">Wie viel ist das?</b> (Bu kaç eder?)</p>
  {plusPhrases.map(([de,tr])=><PhraseRow key={de} de={de} tr={tr} speech={speech}/>)}
  <h2 className="l1a-h2">Zar oyunu</h2>
  <p>Kitaptaki oyun: üç zar atılır, herkes toplar, ilk doğru söyleyen kazanır. <span className="l2-dice" aria-label="altı, beş, bir">⚅ ⚄ ⚀</span> → <i lang="de">„Sechs plus fünf plus eins ist zwölf.“</i> Sitede bu oyun Alıştırma 4’te.</p>
  <Note>Eksi için <b lang="de">minus</b> denir (<i lang="de">sieben minus zwei ist fünf</i>), ama kitap bu ünitede sadece toplama yapıyor.</Note>
  <QuickChecks items={plusChecks} speech={speech} sound={sound}/></>;
}
function Help({speech,sound}:{speech:Speech;sound:Sound}){
 return <><p className="kicker" lang="de">Konu 3 · Wir verstehen das nicht.</p><Heading>Yardım isteme ve anlamadığını söyleme</Heading>
  <p>Bir form, bir kelime, bir soru… Anlamadığında bu dört cümle hayat kurtarır. Önce hepsini dinle, sonra diyaloğu oku.</p>
  {helpPhrases.map(([de,tr,say])=><SayRow key={de} de={de} tr={tr} say={say} speech={speech}/>)}
  <h2 className="l1a-h2">Diyalog: formun başında</h2>
  <p className="l1a-tr">Yasemin formu anlamıyor, Nikos yardım ediyor.</p>
  <Conversation lines={helpDialogue} speech={speech}/>
  <h2 className="l1a-h2"><span lang="de">„… bedeutet: …“</span> kalıbı</h2>
  <p>Bir kelimeyi açıklamanın en kolay yolu: kelime + <b lang="de">bedeutet</b> + soru.</p>
  <table className="l1a-table"><tbody lang="de">{meaningRows.map(row=><tr key={row[0]}><td>{row[0]} bedeutet:</td><td>{row[1]}</td><td><Say text={meaningSay(row)} speech={speech}/></td></tr>)}</tbody></table>
  <h2 className="l1a-h2">Biz: <span lang="de">„Wir verstehen das nicht.“</span></h2>
  <p>Birden çok kişi anlamıyorsa <b lang="de">wir</b> (biz) kullanılır; fiil <b lang="de">-en</b> alır: <i lang="de"><b>Wir</b> brauch<b>en</b> Hilfe. <b>Wir</b> versteh<b>en</b> das nicht.</i> (<span lang="de">wir</span>’i Konu 5’te ayrıntılı göreceğiz.)</p>
  <QuickChecks items={helpChecks} speech={speech} sound={sound}/></>;
}
function FormTopic({speech,sound}:{speech:Speech;sound:Sound}){
 return <><p className="kicker" lang="de">Konu 4 · Das Formular</p><Heading>Formdaki alanlar ve soruları</Heading>
  <p>Almanya’da her yerde form var: kurs, doktor, belediye, iş. Alanların adını ve her alanın hangi soruya karşılık geldiğini bilirsen formu kolayca doldurursun. Omar’ın formuna bak:</p>
  <figure className="l2-figure"><Plain {...berufeCPictures.form} alt="Paul Hoca elinde boş bir kayıt formu ve kalem tutuyor"/></figure>
  <div className="l1a-scroll"><table className="l1a-table l2-form-table"><thead><tr><th>Alan</th><th>Soru</th><th>Omar</th><th/></tr></thead>
   <tbody>{formRows.map(([field,question,omar,say])=><tr key={field}><td lang="de"><b>{field}</b></td><td lang="de">{question}</td><td lang="de">{omar}</td><td><Say text={say} speech={speech}/></td></tr>)}</tbody></table></div>
  <p>Adres iki satırdır: önce <b lang="de">Straße + Hausnummer</b> (<i lang="de">Siemensstraße 12</i>), sonra <b lang="de">PLZ + Ort</b> (<i lang="de">13629 Berlin</i>). Posta kodu Almanya’da 5 rakamdır ve şehirden önce yazılır.</p>
  <h2 className="l1a-h2"><span lang="de">mein / dein</span> — benim / senin</h2>
  <p>Kelimenin artikeline göre iki biçim var:</p>
  <table className="l1a-table"><thead><tr><th>artikel</th><th>benim</th><th>senin</th><th>kelimeler</th></tr></thead>
   <tbody>{possessiveRows.map(([article,mine,yours,words])=><tr key={article}><td lang="de">{article.split(' / ').map((a,i)=><span key={a}>{i>0&&' / '}<span className={'l15-'+a}>{a}</span></span>)}</td><td lang="de"><b>{mine}</b></td><td lang="de"><b>{yours}</b></td><td lang="de">{words}</td></tr>)}</tbody></table>
  {possessivePhrases.map(([de,tr,say])=><SayRow key={de} de={de} tr={tr} say={say} speech={speech}/>)}
  <Note>Kısa yol: kelime <b lang="de">die</b> ise sonuna <b>-e</b> gelir (<i lang="de">mein<b>e</b>, dein<b>e</b></i>). Formdaki kelimelerin çoğu <span lang="de">die</span> (<i lang="de">Adresse</i> ve <i lang="de">-nummer, -zahl</i> ile bitenler); <span lang="de">der</span> olanlar: <i lang="de">Name, Vorname, Nachname, Beruf, Ort</i>.</Note>
  <QuickChecks items={formChecksC} speech={speech} sound={sound}/></>;
}
function WirIhr({speech,sound}:{speech:Speech;sound:Sound}){
 return <><p className="kicker" lang="de">Konu 5 · Woher kommt ihr?</p><Heading>Biz ve siz: <span lang="de">wir / ihr</span></Heading>
  <p>Lektion 2B’de <b lang="de">er / sie / sie</b> geldi; şimdi son iki kişi: <b lang="de">wir</b> (biz) ve <b lang="de">ihr</b> (siz — birden çok arkadaşa, samimi). Böylece tablo tamamlanıyor.</p>
  <div className="l1a-scroll"><table className="l1a-table"><thead><tr><th/>{wirIhrVerbs.map(([verb])=><th key={verb} lang="de">{verb}</th>)}</tr></thead>
   <tbody>{(['wir','ihr'] as const).map((person,col)=><tr key={person}><td><b lang="de">{person}</b> ({person==='wir'?'biz':'siz'})</td>{wirIhrVerbs.map(row=><td key={row[0]} lang="de"><Marked text={row[col+1]}/></td>)}</tr>)}</tbody></table></div>
  <div className="l1a-actions"><Say text={wirIhrSay} speech={speech} label="Tabloyu dinle" wide/></div>
  <p><b lang="de">wir → -en</b>: „onlar“ ve <span lang="de">Sie</span> ile aynı; <b lang="de">ihr → -t</b>: <span lang="de">er / sie</span> ile aynı. Yani yeni ek yok, sadece iki yeni kelime. Tek istisna yine <b lang="de">sein</b>: <i lang="de">wir sind, ihr seid</i>.</p>
  <h2 className="l1a-h2">Kime <span lang="de">„ihr“</span> denir?</h2>
  <p>Birden çok kişiye, hepsine <span lang="de">du</span> diyebiliyorsan: kurstaki arkadaşlara, çocuklara, aileye. Resmî ortamda (iki memura, iki müşteriye) yine <b lang="de">Sie</b> dersin: <i lang="de">Woher kommen Sie?</i></p>
  <h2 className="l1a-h2">Sorular ve cevaplar</h2>
  <table className="l1a-table"><thead><tr><th><span lang="de">ihr</span> ile soru</th><th><span lang="de">wir</span> ile cevap</th><th/></tr></thead>
   <tbody>{wirIhrRows.map(([question,answer,say])=><tr key={question}><td lang="de">{question}</td><td lang="de">{answer}</td><td><Say text={say} speech={speech}/></td></tr>)}</tbody></table>
  <p className="l1a-tr"><i lang="de">„in der Siemensstraße 12“</i> kalıbını olduğu gibi ezberle: sokak adıyla oturduğun yeri söylerken <b lang="de">in der …straße</b> denir.</p>
  <h2 className="l1a-h2">Diyalog: ev arkadaşları</h2>
  <p className="l1a-tr">Omar ve Nikos aynı evde oturuyor; Yasemin ve Mei de öyle.</p>
  <Conversation lines={flatDialogue} speech={speech}/>
  <h2 className="l1a-h2">Bütün tablo (Lektion 1 + 2)</h2>
  <table className="l1a-table"><thead><tr><th/><th lang="de">kommen</th><th lang="de">sein</th></tr></thead>
   <tbody lang="de">{allPersons.map(([person,kommen,sein,isNew])=><tr key={person}><td>{isNew?<b>{person}</b>:person}</td><td><Marked text={kommen}/></td><td>{isNew?<b>{sein}</b>:sein}</td></tr>)}</tbody></table>
  <div className="l1a-actions"><Say text={allPersonsSay} speech={speech} label="Tabloyu dinle" wide/></div>
  <QuickChecks items={wirChecks} speech={speech} sound={sound}/></>;
}
function Stress({speech}:{speech:Speech}){
 return <><p className="kicker" lang="de">Konu 6 · Phonetik: Wortakzent</p><Heading>Uzun kelimelerde vurgu</Heading>
  <p>Almancada her kelimenin <b>bir hecesi</b> daha kuvvetli söylenir. Birleşik kelimelerde vurgu genelde <b>ilk parçadadır</b>. Büyük yazılan heceyi vurgulayarak söyle; istersen o hecede elini masaya vur (kitapta <i lang="de">klatschen</i> = alkışla).</p>
  <table className="l1a-table l2-stress"><tbody>{stressRows.map(([shown,word])=><tr key={word}><td lang="de">{shown.split('·').map((part,i)=><span key={i}>{i>0&&'·'}{part===part.toUpperCase()?<b>{part}</b>:part}</span>)}</td><td lang="de">{word}</td><td><Say text={word} speech={speech}/></td></tr>)}</tbody></table>
  <Note>İki istisna: <b lang="de">Adresse</b> Fransızcadan gelir, vurgu ortada: <i lang="de">a-DRES-se</i>. <b lang="de">Beruf</b>’ta ise <i lang="de">be-</i> ön eki hiç vurgulanmaz: <i lang="de">be-RUF</i>.</Note>
  <h2 className="l1a-h2">Bu ünitenin kalıpları</h2>
  {phrasesC.map(([de,tr,say])=><SayRow key={de} de={de} tr={tr} say={say} speech={speech}/>)}
  <div className="l1a-actions"><button type="button" className="btn secondary small" disabled={speech.busy} onClick={()=>speech.speakAll(phrasesC.map(([,,say])=>say))}><Play size={16} aria-hidden="true"/>Tümünü dinle</button></div>
  <p className="l1a-tr">Şimdi alıştırmalar. Sırayla yapılır; bir alıştırma bitmeden sonraki açılmaz.</p></>;
}

/* ---------- exercises ---------- */
/** Alıştırma 1 · Welche Zahl? The number is read as soon as its question opens (a listening exercise; again on a tap),
 * then the learner taps the digits. After the answer the site's sound and the number are read; the next question opens by
 * itself (or with İleri). */
function NumberListen(props:StepProps){
 const {speech,sound}=props;const finish=useFinish(props);
 const [round,setRound]=useState(0);const [options,setOptions]=useState(()=>shuffle(listenNumbers[0][1]));
 const [picked,setPicked]=useState<string|null>(null);const [right,setRight]=useState(0);const [feedback,setFeedback]=useState<Feedback>(null);
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const item=listenNumbers[round];const heard=numberWords[item[0]];const last=round===listenNumbers.length-1;const ended=last&&picked!==null;
 const latest=useRef(speech);latest.current=speech;
 useEffect(()=>{latest.current.speak(heard);},[heard,round]);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
 const next=()=>{if(timer.current){clearTimeout(timer.current);timer.current=null;}if(last)return;const r=round+1;setRound(r);setOptions(shuffle(listenNumbers[r][1]));setPicked(null);setFeedback(null);};
 const answer=(option:string)=>{
  if(picked!==null)return;sound.prepare();speech.prepare();setPicked(option);
  const ok=option===String(item[0]);const total=right+(ok?1:0);setRight(total);
  if(last){setFeedback(scoreFeedback(total,listenNumbers.length));finish(total,listenNumbers.length,[heard],ok);return;}
  setFeedback(ok?{ok:true,text:'Doğru!'}:{ok:false,text:'Doğrusu yeşil olan.'});
  if(ok)sound.correct(()=>speech.speak(heard));else sound.wrong(()=>speech.speak(heard));
  timer.current=setTimeout(next,1800);
 };
 const again=()=>{setRound(0);setOptions(shuffle(listenNumbers[0][1]));setPicked(null);setRight(0);setFeedback(null);};
 useInnerNext(props.setInnerNext,()=>{if(ended)return false;if(picked===null){setFeedback({ok:false,text:'Önce dinle ve bir sayı seç.'});return true;}next();return true;});
 return <>
  <p className="kicker" lang="de">Alıştırma 1 · Hören Sie. Welche Zahl?</p><Heading>Sayıyı dinle, rakamı seç</Heading>
  <p className="l1a-tr">Her soruda bir sayı okunur; istersen tekrar dinle, sonra doğru rakama dokun. Sayı {round+1} / {listenNumbers.length}</p>
  <div className="l1a-actions l1a-test-listen"><Say text={heard} speech={speech} label="Tekrar dinle" wide secret/></div>
  <div className="l1a-opts l2-num-opts" role="group" aria-label={'Sayı '+(round+1)}>{options.map(option=><button type="button" key={option} className={'l1a-opt'+(picked!==null&&option===String(item[0])?' ok':picked===option?' bad':'')} disabled={picked!==null} onClick={()=>answer(option)}>{option}</button>)}</div>
  <p className="l1a-mini">Puan: {right}</p>
  <FeedbackLine feedback={feedback}/>
  {ended&&<div className="l1a-actions"><button type="button" className="btn secondary small" onClick={again}><RotateCcw size={16} aria-hidden="true"/>Baştan</button></div>}
 </>;
}
/** Alıştırma 3 · the phone numbers: listen to each person (as often as needed) and write the digits; spaces and dashes do
 * not matter. A right number turns green and is read by its person. */
function PhoneExercise(props:StepProps){
 const {speech,sound,onScore,step}=props;
 const [feedback,setFeedback]=useState<Feedback>(null);
 const refs=useRef<(HTMLInputElement|null)[]>([]);const spoken=useRef<boolean[]>(phones.map(()=>false));
 const self=useSelfCheck(phones.length,(i,value)=>phoneDigits(value)===phoneDigits(phones[i].number),firstRight=>{
  onScore(step.id,firstRight,phones.length);setFeedback({ok:true,text:firstRight===phones.length?'Hepsi doğru!':`Hepsi doğru! İlk denemede ${firstRight} / ${phones.length} doğruydu.`});
 });
 const note=(result:SelfCheckResult)=>selfCheckNote(result,self,'Kırmızıyı düzelt: numarayı bir daha dinle.',setFeedback);
 const change=(i:number,value:string)=>{
  sound.prepare();speech.prepare();
  // A number is final once it has as many digits as the right one (or the learner leaves the box).
  const result=self.change(i,value,phoneDigits(value).length>=phoneDigits(phones[i].number).length);note(result);
  if(result!=='right'||spoken.current[i])return;
  spoken.current[i]=true;sound.correct(()=>speech.speak({text:phoneSay(phones[i].number),who:phones[i].who}));
  const target=phones.findIndex((_,k)=>k>i&&self.stateNow(k)!==true);if(target>=0)refs.current[target]?.focus();
 };
 return <>
  <p className="kicker" lang="de">Alıştırma 3 · Wie ist die Telefonnummer?</p><Heading>Numarayı dinle, rakamlarla yaz</Heading>
  <p className="l1a-tr">Hoparlöre dokun, numarayı dinle (istediğin kadar), rakamları yaz. Boşluklu ya da boşluksuz yazabilirsin.</p>
  {phones.map((phone,i)=>{const state=self.state[i];return <div className="l2-phone" key={phone.who}>
   <div className="l1a-dialogue"><div className="l1a-line a"><Portrait who={phone.who} name={phone.name}/><div className="l1a-bubble l15-say-bubble"><div className="l15-say-text"><span className="l15-name">{phone.name}</span><span className="l1a-de" lang="de">Meine Telefonnummer ist …</span></div><Say text={phoneSay(phone.number)} who={phone.who} speech={speech} secret/></div></div></div>
   <div className="l1a-row"><label className="l1a-mini" htmlFor={'l2c-phone-'+i} lang="de">Telefonnummer:</label>
    <span className="l1a-gap-wrap"><input id={'l2c-phone-'+i} ref={element=>{refs.current[i]=element;}} className={'l1a-gap l2-phone-gap'+(state===true?' ok':state===false?' bad':'')} value={self.values[i]} inputMode="tel" autoComplete="off" spellCheck={false} placeholder="0…" enterKeyHint="next"
     onChange={event=>change(i,event.target.value)} onBlur={()=>note(self.leave(i))} onKeyDown={event=>{if(event.key==='Enter'){event.preventDefault();note(self.leave(i));}}}/>{self.hinted[i]&&state!==true&&<span className="l1a-hint">→ {phone.number}</span>}</span></div>
  </div>;})}
  <FeedbackLine feedback={feedback}/>
 </>;
}
/** Alıştırma 5 · the verbs of the box into Mei and Omar's dialogue, then listen to it. */
function HelpExercise(props:StepProps){
 const {speech}=props;
 return <ChoiceExercise kicker="Alıştırma 5 · Was passt?" title="Diyaloğu tamamla" bankLead="Kutudaki kelimeler:" lines={helpLines} dialogue
  after={done=><div className="l1a-actions"><button type="button" className="btn secondary small" disabled={!done||speech.busy} onClick={()=>speech.speakAll(helpSay)}><Play size={16} aria-hidden="true"/>Tamamlanan diyaloğu dinle</button></div>}
  {...props}/>;
}
/** Alıştırma 6 · which question does each field of the form ask? One row per field; the finished sentence is read. */
function FieldExercise(props:StepProps){
 const rows=fieldQuestions.map(row=>({key:row[0],label:row[0],before:<span className="l15-row-sentence" lang="de">{row[0]} bedeutet: …</span>,options:row[2].map(value=>({value,label:value})),answer:row[1],say:{text:fieldSay(row),who:'paul'}}));
 return <ChoiceRows kicker="Alıştırma 6 · Welche Frage passt?" title="Formdaki alan hangi soruyu soruyor?" lead="Her alan için doğru soruyu seç. Cevaptan sonra cümle okunur." rows={rows} wide {...props}/>;
}
/** Typed gaps in a conversation of several people (each line by its own voice): a right gap turns green at once, a wrong one
 * turns red when the learner leaves it, with the right form next to it. A finished line is read by its person. */
export function PersonGaps(props:StepProps&{kicker:string;title:string;lead:ReactNode;lines:readonly PersonGapLine[]}){
 const {speech,sound,onScore,step,kicker,title,lead,lines}=props;
 const gaps=lines.flatMap((line,l)=>line.answers.map((answers,g)=>({line:l,gap:g,answers})));const total=gaps.length;
 const [feedback,setFeedback]=useState<Feedback>(null);
 const refs=useRef<(HTMLInputElement|null)[]>([]);const spoken=useRef<boolean[]>(lines.map(()=>false));
 const self=useSelfCheck(total,(i,value)=>gaps[i].answers.some(answer=>normalizeLoose(answer)===normalizeLoose(value)),firstRight=>{
  onScore(step.id,firstRight,total);setFeedback({ok:true,text:firstRight===total?'Hepsi doğru!':`Hepsi doğru! İlk denemede ${firstRight} / ${total} doğruydu.`});
 });
 const note=(result:SelfCheckResult)=>selfCheckNote(result,self,'Kırmızıyı düzelt; doğrusu yanında yazıyor.',setFeedback);
 const at=(l:number,g:number)=>gaps.findIndex(item=>item.line===l&&item.gap===g);
 const focusNext=(i:number)=>{const target=gaps.findIndex((_,k)=>k>i&&self.stateNow(k)!==true);if(target>=0)refs.current[target]?.focus();};
 const change=(i:number,value:string)=>{
  sound.prepare();speech.prepare();const result=self.change(i,value);note(result);
  if(result!=='right')return;
  const l=gaps[i].line;const lineDone=gaps.every((gap,k)=>gap.line!==l||self.stateNow(k)===true);
  if(lineDone&&!spoken.current[l]){spoken.current[l]=true;sound.correct(()=>speech.speak({text:lines[l].say,who:lines[l].who}));}
 };
 const restart=()=>{self.reset();setFeedback(null);spoken.current=lines.map(()=>false);};
 const field=(l:number,g:number)=>{const i=at(l,g);const state=self.state[i];
  return <span className="l1a-gap-wrap" key={'g'+g}><input ref={element=>{refs.current[i]=element;}} className={'l1a-gap l2-person-gap'+(state===true?' ok':state===false?' bad':'')} value={self.values[i]} lang="de" dir="ltr" autoCapitalize="off" autoComplete="off" spellCheck={false} aria-label={`Boşluk ${i+1}`} enterKeyHint="next"
   onChange={event=>change(i,event.target.value)} onBlur={()=>note(self.leave(i))} onKeyDown={event=>{if(event.key==='Enter'){event.preventDefault();note(self.leave(i));focusNext(i);}}}/>{self.hinted[i]&&state!==true&&<span className="l1a-hint" lang="de">→ {gaps[i].answers[0]}</span>}</span>;};
 const done=self.state.every(value=>value===true);
 return <>
  <p className="kicker" lang="de">{kicker}</p><Heading>{title}</Heading><p className="l1a-tr">{lead}</p>
  <div className="l1a-dialogue">{lines.map((line,l)=>{const parts=line.text.split('___');return <div className={'l1a-line '+(line.who===lines[0].who?'a':'b')} key={l}>
   <Portrait who={line.who} name={personName(line.who)}/>
   <div className="l1a-bubble"><span className="l15-name">{personName(line.who)}</span><span className="l1a-de l1a-gap-text" lang="de" dir="ltr">{parts.map((part,g)=><span key={g}>{part}{g<parts.length-1&&field(l,g)}</span>)}</span></div>
  </div>;})}</div>
  <FeedbackLine feedback={feedback}/>
  <div className="l1a-actions">
   <button type="button" className="btn secondary small" disabled={!done||speech.busy} onClick={()=>speech.speakAll(lines.map(line=>({text:line.say,who:line.who})))}><Play size={16} aria-hidden="true"/>Diyaloğu dinle</button>
   <button type="button" className="btn secondary small" onClick={restart}><RotateCcw size={16} aria-hidden="true"/>Baştan</button>
  </div>
 </>;
}
/** The end: what the learner can do now and what comes next (Teil D). */
function EndL2C({progress,onGo,onPart}:StepProps){
 return <>
  <p className="kicker" lang="de">Bitti</p>
  <Heading>Lektion 2C tamam! 🎉</Heading>
  <PaulHoca pose="cheer" className="l1a-paul-big" sound="appear"/>
  <p>Artık şunları yapabilirsin:</p>
  <ul className="l1a-list">
   <li>0’dan 20’ye saymak ve telefon numaranı söylemek: <b lang="de">null eins sieben sechs …</b></li>
   <li>Toplamak: <b lang="de">Sechs plus fünf ist elf.</b></li>
   <li>Yardım istemek: <b lang="de">Entschuldigung, ich brauche Hilfe. Ich verstehe das nicht.</b></li>
   <li>Formu anlamak: <b lang="de">Vorname, Nachname, Adresse, PLZ</b> ve <b lang="de">mein / dein</b></li>
   <li>Biz ve siz: <b lang="de">Wir wohnen … Wo wohnt ihr?</b></li>
  </ul>
  <Note><b>Kısa özet:</b> <span lang="de">13–19 = birler + zehn</span> (<span lang="de">sechzehn, siebzehn</span>) · telefon numarası rakam rakam · <span lang="de">… bedeutet: …</span> · <span lang="de">die</span> kelimede <span lang="de">meine / deine</span> · <span lang="de">wir -en, ihr -t</span>, <span lang="de">wir sind, ihr seid</span></Note>
  <ProgressMeter progress={progress} language={'tr'} label="Lektion 2C"/>
  <p className="l1a-tr">Sıradaki bölüm: <b lang="de">Teil D – Ich verstehe das nicht.</b> (bütün fiil tablosu, Personalformular, uzun kelimeler ve <span lang="de">Alles klar?</span> sınavı)</p>
  <div className="l1a-actions">
   <button type="button" className="btn small" onClick={()=>onPart('d',0)}>Teil D’ye geç<ArrowRight size={16} className="vault-direction-icon" aria-hidden="true"/></button>
   <button type="button" className="btn secondary small" onClick={()=>onGo(berufeStepIndexC('sayi-dinle'))}>Alıştırmaları tekrar yap</button>
   <button type="button" className="btn secondary small" onClick={()=>onGo(-1)}><BookOpen size={16} aria-hidden="true"/>Lektion 2 içindekiler</button>
  </div>
 </>;
}
