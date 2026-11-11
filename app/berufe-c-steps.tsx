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
import {ProgressMeter} from './progress-meter';
import {Applause} from './study-shared';
import {ChoiceExercise} from './stadt-a-steps';
import {Art,PhraseRow,QuickChecks,Conversation,SpeakStep} from './berufe-a-steps';
import {Marked} from './berufe-b-steps';
import {Say,Note,Tx,Heading,Portrait,FeedbackLine,scoreFeedback,useSelfCheck,selfCheckNote,type SelfCheckResult,GapExercise,ChoiceRows,TestStep,shuffle,useFinish,useInnerNext,useAutoNext,AutoNextBar,type Speech,type Sound,type StepProps,type Feedback} from './willkommen-ui';
import {ut,utBeside} from '@/lib/unit-i18n';

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
  case 'kontrol':return <><p className="kicker" lang="de">Wortschatz · Kontrolle</p><Heading>{ut('Kelimeleri hatırlıyor musun?')}</Heading>
   <p className="l1a-tr">{ut('Hızlı bir kontrol, puanı yok. Yanlış olursa doğrusu yeşil görünür.')}</p>
   <QuickChecks items={wordChecksC} speech={speech} sound={sound} title="8 kısa soru"/>
   <div className="l1a-actions"><button type="button" className="btn secondary small" onClick={()=>props.onGo(berufeStepIndexC('sayilar'))}>{ut('Sayılara dön')}</button></div></>;
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
  case 'mein-dein':return <ChoiceExercise kicker="Alıştırma 7 · mein, meine oder dein, deine?" title="mein / meine · dein / deine" lead={<Tx text="Paul Hoca soruyor, kişi cevaplıyor. Her boşluğa dokun ve iki kelimeden birini seç. İpucu: *die* kelimelerde *-e* gelir; cümle başında büyük harf."/>} lines={possessiveLines} dialogue {...props}/>;
  case 'wir-ihr-yaz':return <PersonGaps kicker="Alıştırma 8 · Ergänzen Sie." title="Fiilleri wir ve ihr için çek" lead={<Tx text="Parantezdeki fiili doğru biçimde yaz. *wir → -en*, *ihr → -t*; _sein_: ~wir sind, ihr seid~. Doğru yazılan satır, kişinin sesiyle okunur."/>} lines={wirIhrLines} {...props}/>;
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
function Plain({src,width,height,alt}:{src:string;width:number;height:number;alt:string}){return <img className="l2-plain" src={src} alt={ut(alt)} width={width} height={height} loading="lazy" decoding="async"/>;}
/** German, meaning and what is read (digits as words). */
function SayRow({de,tr,say,speech}:{de:string;tr?:ReactNode;say:string;speech:Speech}){
 return <div className="l1a-phrase"><div className="l1a-phrase-text"><span className="l1a-de" lang="de" dir="ltr">{de}</span>{tr&&<span className="l1a-tr">{typeof tr==='string'?ut(tr):tr}</span>}</div><Say text={say} speech={speech}/></div>;
}

/* ---------- teaching steps ---------- */
function CoverL2C(){ // the cover picture and the part's progress are on the notebook's left page
 return <>
  <p className="kicker" lang="de">Lektion 2 · Berufe</p>
  <Heading><span lang="de">C — Wir brauchen Hilfe.</span></Heading>
  <p>{ut('Yasemin formu anlamıyor; Omar ve Nikos yardım ediyor. Bu bölümde sayıları, formları ve yardım istemeyi öğreniyoruz.')}</p>
  <p>{ut('Bu bölümde öğreneceklerin:')}</p>
  <ul className="l1a-list">
   <li><Tx text="Sayılar 0–20 ve telefon numarası: *Wie ist deine Telefonnummer?*"/></li>
   <li><Tx text="Toplama: *Sechs plus fünf ist elf.*"/></li>
   <li><Tx text="Yardım isteme: *Entschuldigung, ich brauche Hilfe.* · *Ich verstehe das nicht.*"/></li>
   <li><Tx text="Form doldurma: *Vorname · Nachname · Adresse · PLZ* ve *mein / dein*"/></li>
   <li><Tx text="Biz ve siz: *wir wohnen · ihr wohnt*"/></li>
  </ul>
  <h2 className="l1a-h2">{ut('Bu dersteki kişiler')}</h2>
  <ul className="l15-cast">{castL2C.map(key=><li key={key}><Portrait who={key} name={personName(key)}/><span>{personName(key)}</span></li>)}</ul>
 </>;
}
/** The numbers 0–20 (a tap reads one), all of them in a row, and counting on the fingers (the German way). */
function Numbers({speech}:{speech:Speech}){
 const warm=speech.warm;useEffect(()=>{warm?.([...numberWords]);},[warm]);
 return <><p className="kicker" lang="de">Wortschatz · Die Zahlen</p><Heading>{ut('Sayılar 0–20')}</Heading>
  <p className="l1a-tr">{ut('Bir sayıya dokun: okunur. Hepsini sırayla dinle, sonra kendin say.')}</p>
  <div className="l2-numgrid">{numberWords.map((word,n)=><button type="button" key={word} className={'l2-num'+(speech.busy&&speech.activeText===word?' playing':'')} aria-label={n+': '+word} onClick={()=>speech.speak(word)}><span className="l2-num-d">{n}</span><span className="l2-num-w" lang="de">{word}</span></button>)}</div>
  <div className="l1a-actions"><button type="button" className="btn secondary small" disabled={speech.busy} onClick={()=>speech.speak(countAll)}><Play size={16} aria-hidden="true"/>{ut('0’dan 20’ye dinle')}</button></div>
  <h2 className="l1a-h2">{ut('Parmakla sayma')}</h2>
  <p><Tx text="Almanlar parmakla sayarken **başparmaktan** başlar: 1 = başparmak, 2 = başparmak + işaret parmağı, 3 = üç parmak. Kafede ~„zwei Kaffee“~ derken başparmak ve işaret parmağını kaldırırsın. Türkiye’deki gibi işaret ve orta parmağı kaldırırsan garson anlar ama biraz şaşırabilir."/></p>
  <figure className="l2-hands"><Plain {...berufeCPictures.hands05} alt="Eller: 0’dan 5’e Alman usulü parmakla sayma; yumruk 0, başparmak 1, başparmak ve işaret parmağı 2, üç parmak 3, dört parmak 4, açık el 5"/><figcaption>0 · 1 · 2 · 3 · 4 · 5</figcaption></figure>
  <figure className="l2-hands"><Plain {...berufeCPictures.hands610} alt="Eller: 6’dan 10’a iki elle sayma; bir açık el ve diğer elde 1’den 5’e kadar parmak"/><figcaption>6 · 7 · 8 · 9 · 10</figcaption></figure></>;
}
function WordsC({speech}:{speech:Speech}){
 return <><p className="kicker" lang="de">Wortschatz · Wörter</p><Heading>{ut('Bu bölümün kelimeleri')}</Heading>
  <p className="l1a-tr">{ut('Formdaki alanlar ve yardım isteme kelimeleri. Her satırda kelime, anlamı ve bir örnek var; satıra dokununca örnek okunur.')}</p>
  <div className="l15-word-grid">{wordsC.map(row=>{const [de,tr,example,exampleTr]=row;return <div className="l1a-phrase" key={de}><div className="l1a-phrase-text"><span className="l1a-de" lang="de"><Art de={de}/></span><span className="l1a-tr">{utBeside(de,tr)}</span><span className="l15-example" lang="de">{example}</span><span className="l1a-mini">{utBeside(example,exampleTr)}</span></div><Say text={wordSayC(row)} speech={speech}/></div>;})}</div></>;
}
function NumberRules({speech,sound}:{speech:Speech;sound:Sound}){
 return <><p className="kicker">{ut('Konu 1 · Zahlen 0–20')}</p><Heading>{ut('Sayılar nasıl kurulur?')}</Heading>
  <p><Tx text="**0’dan 12’ye** kadar her sayının kendi adı var; bunları ezberlemek gerekiyor: ~null, eins, zwei, drei, vier, fünf, sechs, sieben, acht, neun, zehn, **elf**, **zwölf**~. 11 ve 12 kurala uymaz; Türkçedeki „on bir, on iki“ gibi kurulmaz."/></p>
  <h2 className="l1a-h2"><Tx text="13–19: birler + _zehn_"/></h2>
  <p><Tx text="13’ten 19’a kadar kural var: önce birler basamağı, sonra *-zehn*. Türkçenin tersi: biz „on üç“ deriz, Almanlar „üç-on“ (~drei-zehn~)."/></p>
  <table className="l1a-table"><tbody>{teenRows.map(([n,built,word,warn])=><tr key={n}><td>{n}</td><td lang="de"><Struck text={built}/></td><td lang="de"><b>{word}</b>{warn&&' ⚠️'}</td><td><Say text={word} speech={speech}/></td></tr>)}</tbody></table>
  <p className="l15-warn"><Tx text="İki istisna: *16 = sechzehn* (~sechs~’in s’si düşer) ve *17 = siebzehn* (~sieben~’in -en’i düşer). ~„sechszehn“~ ve ~„siebenzehn“~ yanlıştır."/></p>
  <h2 className="l1a-h2">{ut('Telefon numarası')}</h2>
  <p><Tx text="Telefon numarası **rakam rakam** okunur, gruplar arasında küçük bir duraklama yapılır. Sıfır *null*’dur."/></p>
  {phonePhrases.map(([de,tr,say])=><SayRow key={de} de={de} tr={tr} say={say} speech={speech}/>)}
  <Note><Tx text="Almanya’da cep numaraları **015, 016, 017** ile başlar; Berlin’in sabit hatları **030** ile. Yurt dışından ararken baştaki 0 düşer ve **+49** gelir: +49 176 … (Bu dersteki bütün numaralar uydurmadır.)"/></Note>
  <QuickChecks items={numberChecks} speech={speech} sound={sound}/></>;
}
function Plus({speech,sound}:{speech:Speech;sound:Sound}){
 return <><p className="kicker">{ut('Konu 2 · Rechnen')}</p><Heading>{ut('Kaç eder? Toplama')}</Heading>
  <p><Tx text="Kitaptaki zar oyunu için iki kelime yeter: *plus* (artı) ve *ist* (eder, eşittir). Soru: *Wie viel ist das?* (Bu kaç eder?)"/></p>
  {plusPhrases.map(([de,tr])=><PhraseRow key={de} de={de} tr={tr} speech={speech}/>)}
  <h2 className="l1a-h2">{ut('Zar oyunu')}</h2>
  <p>{ut('Kitaptaki oyun: üç zar atılır, herkes toplar, ilk doğru söyleyen kazanır.')} <span className="l2-dice" aria-label={ut('altı, beş, bir')}>⚅ ⚄ ⚀</span> → <i lang="de">„Sechs plus fünf plus eins ist zwölf.“</i> {ut('Sitede bu oyun Alıştırma 4’te.')}</p>
  <Note><Tx text="Eksi için *minus* denir (~sieben minus zwei ist fünf~), ama kitap bu ünitede sadece toplama yapıyor."/></Note>
  <QuickChecks items={plusChecks} speech={speech} sound={sound}/></>;
}
function Help({speech,sound}:{speech:Speech;sound:Sound}){
 return <><p className="kicker">{ut('Konu 3 · Wir verstehen das nicht.')}</p><Heading>{ut('Yardım isteme ve anlamadığını söyleme')}</Heading>
  <p>{ut('Bir form, bir kelime, bir soru… Anlamadığında bu dört cümle hayat kurtarır. Önce hepsini dinle, sonra diyaloğu oku.')}</p>
  {helpPhrases.map(([de,tr,say])=><SayRow key={de} de={de} tr={tr} say={say} speech={speech}/>)}
  <h2 className="l1a-h2">{ut('Diyalog: formun başında')}</h2>
  <p className="l1a-tr">{ut('Yasemin formu anlamıyor, Nikos yardım ediyor.')}</p>
  <Conversation lines={helpDialogue} speech={speech}/>
  <h2 className="l1a-h2"><Tx text="_„… bedeutet: …“_ kalıbı"/></h2>
  <p><Tx text="Bir kelimeyi açıklamanın en kolay yolu: kelime + *bedeutet* + soru."/></p>
  <table className="l1a-table"><tbody lang="de">{meaningRows.map(row=><tr key={row[0]}><td>{row[0]} bedeutet:</td><td>{row[1]}</td><td><Say text={meaningSay(row)} speech={speech}/></td></tr>)}</tbody></table>
  <h2 className="l1a-h2"><Tx text="Biz: _„Wir verstehen das nicht.“_"/></h2>
  <p><Tx text="Birden çok kişi anlamıyorsa *wir* (biz) kullanılır; fiil *-en* alır: ~**Wir** brauch**en** Hilfe. **Wir** versteh**en** das nicht.~ (_wir_’i Konu 5’te ayrıntılı göreceğiz.)"/></p>
  <QuickChecks items={helpChecks} speech={speech} sound={sound}/></>;
}
function FormTopic({speech,sound}:{speech:Speech;sound:Sound}){
 return <><p className="kicker">{ut('Konu 4 · Das Formular')}</p><Heading>{ut('Formdaki alanlar ve soruları')}</Heading>
  <p>{ut('Almanya’da her yerde form var: kurs, doktor, belediye, iş. Alanların adını ve her alanın hangi soruya karşılık geldiğini bilirsen formu kolayca doldurursun. Omar’ın formuna bak:')}</p>
  <figure className="l2-figure"><Plain {...berufeCPictures.form} alt="Paul Hoca elinde boş bir kayıt formu ve kalem tutuyor"/></figure>
  <div className="l1a-scroll"><table className="l1a-table l2-form-table"><thead><tr><th>{ut('Alan')}</th><th>{ut('Soru')}</th><th>Omar</th><th/></tr></thead>
   <tbody>{formRows.map(([field,question,omar,say])=><tr key={field}><td lang="de"><b>{field}</b></td><td lang="de">{question}</td><td lang="de">{omar}</td><td><Say text={say} speech={speech}/></td></tr>)}</tbody></table></div>
  <p><Tx text="Adres iki satırdır: önce *Straße + Hausnummer* (~Siemensstraße 12~), sonra *PLZ + Ort* (~13629 Berlin~). Posta kodu Almanya’da 5 rakamdır ve şehirden önce yazılır."/></p>
  <h2 className="l1a-h2"><Tx text="_mein / dein_ — benim / senin"/></h2>
  <p>{ut('Kelimenin artikeline göre iki biçim var:')}</p>
  <table className="l1a-table"><thead><tr><th>artikel</th><th>{ut('benim')}</th><th>{ut('senin')}</th><th>{ut('kelimeler')}</th></tr></thead>
   <tbody>{possessiveRows.map(([article,mine,yours,words])=><tr key={article}><td lang="de">{article.split(' / ').map((a,i)=><span key={a}>{i>0&&' / '}<span className={'l15-'+a}>{a}</span></span>)}</td><td lang="de"><b>{mine}</b></td><td lang="de"><b>{yours}</b></td><td lang="de">{words}</td></tr>)}</tbody></table>
  {possessivePhrases.map(([de,tr,say])=><SayRow key={de} de={de} tr={tr} say={say} speech={speech}/>)}
  <Note><Tx text="Kısa yol: kelime *die* ise sonuna **-e** gelir (~mein**e**, dein**e**~). Formdaki kelimelerin çoğu _die_ (~Adresse~ ve ~-nummer, -zahl~ ile bitenler); _der_ olanlar: ~Name, Vorname, Nachname, Beruf, Ort~."/></Note>
  <QuickChecks items={formChecksC} speech={speech} sound={sound}/></>;
}
function WirIhr({speech,sound}:{speech:Speech;sound:Sound}){
 return <><p className="kicker">{ut('Konu 5 · Woher kommt ihr?')}</p><Heading><Tx text="Biz ve siz: _wir / ihr_"/></Heading>
  <p><Tx text="Lektion 2B’de *er / sie / sie* geldi; şimdi son iki kişi: *wir* (biz) ve *ihr* (siz — birden çok arkadaşa, samimi). Böylece tablo tamamlanıyor."/></p>
  <div className="l1a-scroll"><table className="l1a-table"><thead><tr><th/>{wirIhrVerbs.map(([verb])=><th key={verb} lang="de">{verb}</th>)}</tr></thead>
   <tbody>{(['wir','ihr'] as const).map((person,col)=><tr key={person}><td><b lang="de">{person}</b> ({ut(person==='wir'?'biz':'siz')})</td>{wirIhrVerbs.map(row=><td key={row[0]} lang="de"><Marked text={row[col+1]}/></td>)}</tr>)}</tbody></table></div>
  <div className="l1a-actions"><Say text={wirIhrSay} speech={speech} label="Tabloyu dinle" wide/></div>
  <p><Tx text="*wir → -en*: „onlar“ ve _Sie_ ile aynı; *ihr → -t*: _er / sie_ ile aynı. Yani yeni ek yok, sadece iki yeni kelime. Tek istisna yine *sein*: ~wir sind, ihr seid~."/></p>
  <h2 className="l1a-h2"><Tx text="Kime _„ihr“_ denir?"/></h2>
  <p><Tx text="Birden çok kişiye, hepsine _du_ diyebiliyorsan: kurstaki arkadaşlara, çocuklara, aileye. Resmî ortamda (iki memura, iki müşteriye) yine *Sie* dersin: ~Woher kommen Sie?~"/></p>
  <h2 className="l1a-h2">{ut('Sorular ve cevaplar')}</h2>
  <table className="l1a-table"><thead><tr><th><Tx text="_ihr_ ile soru"/></th><th><Tx text="_wir_ ile cevap"/></th><th/></tr></thead>
   <tbody>{wirIhrRows.map(([question,answer,say])=><tr key={question}><td lang="de">{question}</td><td lang="de">{answer}</td><td><Say text={say} speech={speech}/></td></tr>)}</tbody></table>
  <p className="l1a-tr"><Tx text="~„in der Siemensstraße 12“~ kalıbını olduğu gibi ezberle: sokak adıyla oturduğun yeri söylerken *in der …straße* denir."/></p>
  <h2 className="l1a-h2">{ut('Diyalog: ev arkadaşları')}</h2>
  <p className="l1a-tr">{ut('Omar ve Nikos aynı evde oturuyor; Yasemin ve Mei de öyle.')}</p>
  <Conversation lines={flatDialogue} speech={speech}/>
  <h2 className="l1a-h2">{ut('Bütün tablo (Lektion 1 + 2)')}</h2>
  <table className="l1a-table"><thead><tr><th/><th lang="de">kommen</th><th lang="de">sein</th></tr></thead>
   <tbody lang="de">{allPersons.map(([person,kommen,sein,isNew])=><tr key={person}><td>{isNew?<b>{person}</b>:person}</td><td><Marked text={kommen}/></td><td>{isNew?<b>{sein}</b>:sein}</td></tr>)}</tbody></table>
  <div className="l1a-actions"><Say text={allPersonsSay} speech={speech} label="Tabloyu dinle" wide/></div>
  <QuickChecks items={wirChecks} speech={speech} sound={sound}/></>;
}
function Stress({speech}:{speech:Speech}){
 return <><p className="kicker">{ut('Konu 6 · Phonetik: Wortakzent')}</p><Heading>{ut('Uzun kelimelerde vurgu')}</Heading>
  <p><Tx text="Almancada her kelimenin **bir hecesi** daha kuvvetli söylenir. Birleşik kelimelerde vurgu genelde **ilk parçadadır**. Büyük yazılan heceyi vurgulayarak söyle; istersen o hecede elini masaya vur (kitapta ~klatschen~ = alkışla)."/></p>
  <table className="l1a-table l2-stress"><tbody>{stressRows.map(([shown,word])=><tr key={word}><td lang="de">{shown.split('·').map((part,i)=><span key={i}>{i>0&&'·'}{part===part.toUpperCase()?<b>{part}</b>:part}</span>)}</td><td lang="de">{word}</td><td><Say text={word} speech={speech}/></td></tr>)}</tbody></table>
  <Note><Tx text="İki istisna: *Adresse* Fransızcadan gelir, vurgu ortada: ~a-DRES-se~. *Beruf*’ta ise ~be-~ ön eki hiç vurgulanmaz: ~be-RUF~."/></Note>
  <h2 className="l1a-h2">{ut('Bu ünitenin kalıpları')}</h2>
  {phrasesC.map(([de,tr,say])=><SayRow key={de} de={de} tr={tr} say={say} speech={speech}/>)}
  <div className="l1a-actions"><button type="button" className="btn secondary small" disabled={speech.busy} onClick={()=>speech.speakAll(phrasesC.map(([,,say])=>say))}><Play size={16} aria-hidden="true"/>{ut('Tümünü dinle')}</button></div>
  <p className="l1a-tr">{ut('Şimdi alıştırmalar. Sırayla yapılır; bir alıştırma bitmeden sonraki açılmaz.')}</p></>;
}

/* ---------- exercises ---------- */
/** Alıştırma 1 · Welche Zahl? The number is read as soon as its question opens (a listening exercise; again on a tap),
 * then the learner taps the digits. After the answer the site's sound and the number are read; the next question opens by
 * itself (or with İleri). */
function NumberListen(props:StepProps){
 const {speech,sound}=props;const finish=useFinish(props);
 const [round,setRound]=useState(0);const [options,setOptions]=useState(()=>shuffle(listenNumbers[0][1]));
 const [picked,setPicked]=useState<string|null>(null);const [right,setRight]=useState(0);const [feedback,setFeedback]=useState<Feedback>(null);
 const item=listenNumbers[round];const heard=numberWords[item[0]];const last=round===listenNumbers.length-1;const ended=last&&picked!==null;
 const latest=useRef(speech);latest.current=speech;
 useEffect(()=>{latest.current.speak(heard);},[heard,round]);
 const next=()=>{if(last)return;const r=round+1;setRound(r);setOptions(shuffle(listenNumbers[r][1]));setPicked(null);setFeedback(null);};
 const answer=(option:string)=>{
  if(picked!==null)return;sound.prepare();speech.prepare();setPicked(option);
  const ok=option===String(item[0]);const total=right+(ok?1:0);setRight(total);
  if(last){setFeedback(scoreFeedback(total,listenNumbers.length));finish(total,listenNumbers.length,[heard],ok);return;}
  setFeedback(ok?{ok:true,text:'Doğru!'}:{ok:false,text:'Doğrusu yeşil olan.'});
  if(ok)sound.correct(()=>speech.speak(heard));else sound.wrong(()=>speech.speak(heard));
 };
 useAutoNext(picked!==null&&!ended,speech,next); // the next number comes by itself, 3 seconds after the answer
 const again=()=>{setRound(0);setOptions(shuffle(listenNumbers[0][1]));setPicked(null);setRight(0);setFeedback(null);};
 useInnerNext(props.setInnerNext,()=>{if(ended)return false;if(picked===null){setFeedback({ok:false,text:'Önce dinle ve bir sayı seç.'});return true;}next();return true;});
 return <>
  <p className="kicker">{ut('Alıştırma 1 · Hören Sie. Welche Zahl?')}</p><Heading>{ut('Sayıyı dinle, rakamı seç')}</Heading>
  <p className="l1a-tr">{ut('Her soruda bir sayı okunur; istersen tekrar dinle, sonra doğru rakama dokun. Sayı {n} / {total}',{n:round+1,total:listenNumbers.length})}</p>
  <div className="l1a-actions l1a-test-listen"><Say text={heard} speech={speech} label="Tekrar dinle" wide secret/></div>
  <div className="l1a-opts l2-num-opts" role="group" aria-label={ut('Sayı {n}',{n:round+1})}>{options.map(option=><button type="button" key={option} className={'l1a-opt'+(picked!==null&&option===String(item[0])?' ok':picked===option?' bad':'')} disabled={picked!==null} onClick={()=>answer(option)}>{option}</button>)}</div>
  <p className="l1a-mini">{ut('Puan: {n}',{n:right})}</p>
  <FeedbackLine feedback={feedback}/>
  {picked!==null&&!ended&&<AutoNextBar/>}
  {ended&&<div className="l1a-actions"><button type="button" className="btn secondary small" onClick={again}><RotateCcw size={16} aria-hidden="true"/>{ut('Baştan')}</button></div>}
 </>;
}
/** Alıştırma 3 · the phone numbers: listen to each person (as often as needed) and write the digits; spaces and dashes do
 * not matter. A right number turns green and is read by its person. */
function PhoneExercise(props:StepProps){
 const {speech,sound,onScore,step}=props;
 const [feedback,setFeedback]=useState<Feedback>(null);
 const refs=useRef<(HTMLInputElement|null)[]>([]);const spoken=useRef<boolean[]>(phones.map(()=>false));
 const self=useSelfCheck(phones.length,(i,value)=>phoneDigits(value)===phoneDigits(phones[i].number),firstRight=>{
  onScore(step.id,firstRight,phones.length);setFeedback({ok:true,text:firstRight===phones.length?'Hepsi doğru!':'Hepsi doğru! İlk denemede {right} / {total} doğruydu.',params:{right:firstRight,total:phones.length}});
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
  <p className="kicker">{ut('Alıştırma 3 · Wie ist die Telefonnummer?')}</p><Heading>{ut('Numarayı dinle, rakamlarla yaz')}</Heading>
  <p className="l1a-tr">{ut('Hoparlöre dokun, numarayı dinle (istediğin kadar), rakamları yaz. Boşluklu ya da boşluksuz yazabilirsin.')}</p>
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
  after={done=><div className="l1a-actions"><button type="button" className="btn secondary small" disabled={!done||speech.busy} onClick={()=>speech.speakAll(helpSay)}><Play size={16} aria-hidden="true"/>{ut('Tamamlanan diyaloğu dinle')}</button></div>}
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
  onScore(step.id,firstRight,total);setFeedback({ok:true,text:firstRight===total?'Hepsi doğru!':'Hepsi doğru! İlk denemede {right} / {total} doğruydu.',params:{right:firstRight,total}});
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
  return <span className="l1a-gap-wrap" key={'g'+g}><input ref={element=>{refs.current[i]=element;}} className={'l1a-gap l2-person-gap'+(state===true?' ok':state===false?' bad':'')} value={self.values[i]} lang="de" dir="ltr" autoCapitalize="off" autoComplete="off" spellCheck={false} aria-label={ut('Boşluk {n}',{n:i+1})} enterKeyHint="next"
   onChange={event=>change(i,event.target.value)} onBlur={()=>note(self.leave(i))} onKeyDown={event=>{if(event.key==='Enter'){event.preventDefault();note(self.leave(i));focusNext(i);}}}/>{self.hinted[i]&&state!==true&&<span className="l1a-hint" lang="de">→ {gaps[i].answers[0]}</span>}</span>;};
 const done=self.state.every(value=>value===true);
 return <>
  <p className="kicker">{ut(kicker)}</p><Heading>{ut(title)}</Heading><p className="l1a-tr">{typeof lead==='string'?ut(lead):lead}</p>
  <div className="l1a-dialogue">{lines.map((line,l)=>{const parts=line.text.split('___');return <div className={'l1a-line '+(line.who===lines[0].who?'a':'b')} key={l}>
   <Portrait who={line.who} name={personName(line.who)}/>
   <div className="l1a-bubble"><span className="l15-name">{personName(line.who)}</span><span className="l1a-de l1a-gap-text" lang="de" dir="ltr">{parts.map((part,g)=><span key={g}>{part}{g<parts.length-1&&field(l,g)}</span>)}</span></div>
  </div>;})}</div>
  <FeedbackLine feedback={feedback}/>
  <div className="l1a-actions">
   <button type="button" className="btn secondary small" disabled={!done||speech.busy} onClick={()=>speech.speakAll(lines.map(line=>({text:line.say,who:line.who})))}><Play size={16} aria-hidden="true"/>{ut('Diyaloğu dinle')}</button>
   <button type="button" className="btn secondary small" onClick={restart}><RotateCcw size={16} aria-hidden="true"/>{ut('Baştan')}</button>
  </div>
 </>;
}
/** The end: what the learner can do now and what comes next (Teil D). */
function EndL2C({progress,onGo,onPart,language}:StepProps){
 return <>
  <p className="kicker">{ut('Bitti')}</p>
  <Heading>{ut('Lektion 2C tamam! 🎉')}</Heading>
  <Applause/>
  <p>{ut('Artık şunları yapabilirsin:')}</p>
  <ul className="l1a-list">
   <li><Tx text="0’dan 20’ye saymak ve telefon numaranı söylemek: *null eins sieben sechs …*"/></li>
   <li><Tx text="Toplamak: *Sechs plus fünf ist elf.*"/></li>
   <li><Tx text="Yardım istemek: *Entschuldigung, ich brauche Hilfe. Ich verstehe das nicht.*"/></li>
   <li><Tx text="Formu anlamak: *Vorname, Nachname, Adresse, PLZ* ve *mein / dein*"/></li>
   <li><Tx text="Biz ve siz: *Wir wohnen … Wo wohnt ihr?*"/></li>
  </ul>
  <Note><Tx text="**Kısa özet:** _13–19 = birler + zehn_ (_sechzehn, siebzehn_) · telefon numarası rakam rakam · _… bedeutet: …_ · _die_ kelimede _meine / deine_ · _wir -en, ihr -t_, _wir sind, ihr seid_"/></Note>
  <ProgressMeter progress={progress} language={language} label="Lektion 2C"/>
  <p className="l1a-tr"><Tx text="Sıradaki bölüm: *Teil D – Ich verstehe das nicht.* (bütün fiil tablosu, Personalformular, uzun kelimeler ve _Alles klar?_ sınavı)"/></p>
  <div className="l1a-actions">
   <button type="button" className="btn small" onClick={()=>onPart('d',0)}>{ut('Teil D’ye geç')}<ArrowRight size={16} className="vault-direction-icon" aria-hidden="true"/></button>
   <button type="button" className="btn secondary small" onClick={()=>onGo(berufeStepIndexC('sayi-dinle'))}>{ut('Alıştırmaları tekrar yap')}</button>
   <button type="button" className="btn secondary small" onClick={()=>onGo(-1)}><BookOpen size={16} aria-hidden="true"/>{ut('Lektion 2 içindekiler')}</button>
  </div>
 </>;
}
