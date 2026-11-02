'use client';
import {useEffect,useRef,useState} from 'react';
import {BookOpen,Eye,Play,RotateCcw,Volume2} from 'lucide-react';
import {acceptsAnswer} from '@/lib/willkommen-course';
import {alphabet,spellItems} from '@/lib/willkommen-b-course';
import {isTurkishText,personName} from '@/lib/berufe-course';
import {phoneDigits} from '@/lib/berufe-c-course';
import {
 berufeDPictures,castL2D,ramiForm,wordsD,wordSayD,phrasesD,wordChecksD,verbChecksD,formChecksD,longChecks,personRows,regularVerbsD,
 specialVerbsD,conjugationSay,regularFormsD,formNames,ramiSentences,syllableWords,syllableSay,longWordSteps,pardonPhrases,noraRami,
 mimePhrases,firstDay,firstDayRows,formTalk,formFields,tableVerbs,tableCells,personNames,mimeRows,syllableOrder,syllableMeanings,
 L2D_FORM_KEY,ownFields,ownFieldOk,vocabLinesD,grammarLinesD,grammarSpeakersD,grammarSayD,talkQuestionsD,talkAnswersD,tomaszExam,
 tomaszExamSay,examFormD,berufeTestD,checkSectionsD,checkPointsD,examTalk,berufeStepIndexD,type OwnField,
} from '@/lib/berufe-d-course';
import {ProgressMeter} from './progress-ui';
import {PaulHoca} from './paul-hoca';
import {ChoiceExercise} from './stadt-a-steps';
import {Art,PhraseRow,QuickChecks,Conversation,SpeakStep,ownJobSentence} from './berufe-a-steps';
import {Marked} from './berufe-b-steps';
import {Say,Note,Heading,Portrait,FeedbackLine,useSelfCheck,selfCheckNote,type SelfCheckResult,WordChoice,GapExercise,ChoiceRows,OrderExercise,TestStep,shuffle,type Speech,type Sound,type StepProps,type Feedback} from './willkommen-ui';

/**
 * Lektion 2 „Berufe“, Teil D – Ich verstehe das nicht. (the learner's lesson page, 2 November 2026): the steps. The
 * notebook around them is app/berufe-study.tsx; the texts are lib/berufe-d-course.ts. „Alles klar?“ works like Lektion
 * 1D (app/willkommen-d-steps.tsx): four sections with points and the test, then the points page. The learner's own form
 * (Alıştırma 6) stays on this device only; Konuş (Sprechen Teil 1) shows it next to Rami's answers.
 */
export function StepViewL2D(props:StepProps){
 const {step,speech,sound}=props;
 switch(step.id){
  case 'kapak':return <CoverL2D/>;
  case 'kelimeler':return <WordsD speech={speech}/>;
  case 'kontrol':return <><p className="kicker" lang="de">Wortschatz · Kontrolle</p><Heading>Kelimeleri hatırlıyor musun?</Heading>
   <p className="l1a-tr">Hızlı bir kontrol, puanı yok. Yanlış olursa doğrusu yeşil görünür.</p>
   <QuickChecks items={wordChecksD} speech={speech} sound={sound} title="8 kısa soru"/>
   <div className="l1a-actions"><button type="button" className="btn secondary small" onClick={()=>props.onGo(berufeStepIndexD('kelimeler'))}>Kelimelere dön</button></div></>;
  case 'fiil-tablo':return <AllVerbs speech={speech} sound={sound}/>;
  case 'personalformular':return <PersonalForm speech={speech} sound={sound}/>;
  case 'uzun-kelimeler':return <LongWords speech={speech} sound={sound}/>;
  case 'wie-bitte':return <Pardon speech={speech}/>;
  case 'hoeren':return <FirstDay {...props}/>;
  case 'form-dinle':return <FormListen {...props}/>;
  case 'fiil-yaz':return <VerbGaps {...props}/>;
  case 'pantomim':return <ChoiceRows kicker="Alıştırma 4 · Was machen wir? Raten Sie." title="İkisi ne yapıyor? „Ihr …“ ile tahmin et" lead="Resim iki kişiyi gösteriyor; sen onlara ihr ile söylüyorsun. Doğru cümleyi seç; cevaptan sonra doğru cümle okunur."
   rows={mimeRows.map(([emoji,answer,options,tr])=>({key:answer,label:tr,before:<span className="l2-mime" role="img" aria-label={tr}>{emoji}</span>,options:options.map(value=>({value,label:value})),answer,say:answer}))} wide {...props}/>;
  case 'heceler':return <OrderExercise kicker="Alıştırma 5 · Lange Wörter" title="Heceleri sıraya koy" sentences={syllableOrder} meanings={syllableMeanings} word sayFor={sentence=>sentence.replace(/ /g,'')} {...props}/>;
  case 'dein-formular':return <OwnForm {...props}/>;
  case 'wortschatz':return <ChoiceExercise kicker="Alles klar? · 1 Wortschatz · 5 Punkte" title="Kelime: doğru kelimeyi seç" bankLead="Kutu:" lines={vocabLinesD} dialogue
   after={()=><p className="l1a-mini">Her boşluğun ilk seçimi sayılır: ilk seferde doğru = 1 puan.</p>} {...props}/>;
  case 'grammatik':return <GapExercise kicker="Alles klar? · 2 Grammatik · 5 Punkte" title="Dilbilgisi: fiili doğru çek" lead="Parantezdeki fiili doğru biçimde yaz. 10 boşluk; ilk denemede doğru olan her boşluk yarım puan." lines={grammarLinesD} speakers={grammarSpeakersD} say={grammarSayD} {...props}
   onScore={(id,right,total)=>props.onScore(id,Math.floor(right*5/total),5)}/>;
  case 'kommunikation':return <OrderExercise kicker="Alles klar? · 3 Kommunikation · 5 Punkte" title="İletişim: cevaba göre soruyu kur" sentences={talkQuestionsD} meanings={talkAnswersD} goalLabel="Cevap:" strict sayFor={sentence=>({text:sentence,who:'paul'})} {...props}/>;
  case 'schreiben':return <GapExercise kicker="Prüfungstraining · Schreiben Teil 1 · 5 Punkte" title="Sınav provası: metni oku, formu doldur" lead="Start Deutsch A1 / telc A1 yazma sınavının ilk bölümü böyle: kısa bir metin ve bir form. Metindeki bilgileri bul ve forma yaz. İpucu: önce metinde bilgileri bul." before={<TomaszText speech={speech}/>} lines={examFormD} wide say={[]} {...props}/>;
  case 'test':return <TestStep label="Alles klar? · 5 Test · 12 Punkte" questions={berufeTestD} sayFor={i=>berufeTestD[i][3]} langOf={text=>isTurkishText(text)?'tr':'de'} {...props}/>;
  case 'puanlar':return <PointsD {...props}/>;
  case 'konus':return <KonusL2D {...props}/>;
  case 'bitti':return <EndL2D {...props}/>;
 }
 return null;
}

/* ---------- small pieces ---------- */
function SayRow({de,tr,say,speech}:{de:string;tr?:string;say:string;speech:Speech}){
 return <div className="l1a-phrase"><div className="l1a-phrase-text"><span className="l1a-de" lang="de" dir="ltr">{de}</span>{tr&&<span className="l1a-tr">{tr}</span>}</div><Say text={say} speech={speech}/></div>;
}
const personLabels=['ich','du','er / sie','wir','ihr','sie / Sie'];

/* ---------- teaching steps ---------- */
function CoverL2D(){ // the cover picture and the part's progress are on the notebook's left page
 return <>
  <p className="kicker" lang="de">Lektion 2 · Berufe</p>
  <Heading><span lang="de">D — Ich verstehe das nicht.</span></Heading>
  <p>Rami iş buldu: Altenpflege-Service „Sonnenblick“te ilk günü. Nora (hemşire) ona bir form uzatıyor.</p>
  <p>Bu bölümde öğreneceklerin:</p>
  <ul className="l1a-list">
   <li>Bütün fiil tablosu: <b lang="de">ich · du · er/sie · wir · ihr · sie/Sie</b></li>
   <li>Personalformular doldurma ve bilgi aktarma: <b lang="de">Familienname · Wohnort</b></li>
   <li>Uzun kelimeleri öğrenme: <b lang="de">Kran-ken-pfle-ge-rin</b></li>
   <li>Anlamadığında: <b lang="de">Wie bitte? Wie schreibt man das?</b></li>
   <li><b lang="de">Alles klar?</b> — puanlı ünite sınavı ve sınav provası</li>
  </ul>
  <h2 className="l1a-h2">Bu dersteki kişiler</h2>
  <ul className="l15-cast">{castL2D.map(key=><li key={key}><Portrait who={key} name={personName(key)}/><span>{personName(key)}</span></li>)}</ul>
 </>;
}
function WordsD({speech}:{speech:Speech}){
 return <><p className="kicker" lang="de">Wortschatz · Wörter</p><Heading>Bu bölümün kelimeleri</Heading>
  <p className="l1a-tr">İş yerinde ilk gün ve form kelimeleri; sonda pantomim oyununun fiilleri. Satıra dokununca örnek okunur.</p>
  <div className="l15-word-grid">{wordsD.map(row=>{const [de,tr,example,exampleTr]=row;return <div className="l1a-phrase" key={de}><div className="l1a-phrase-text"><span className="l1a-de" lang="de"><Art de={de}/></span><span className="l1a-tr">{tr}</span><span className="l15-example" lang="de">{example}</span><span className="l1a-mini">{exampleTr}</span></div><Say text={wordSayD(row)} speech={speech}/></div>;})}</div></>;
}
function AllVerbs({speech,sound}:{speech:Speech;sound:Sound}){
 return <><p className="kicker" lang="de">Konu 1 · Verben: Präsens</p><Heading>Fiil çekimi: altı kişi, bir tablo</Heading>
  <p>Lektion 1 ve 2 boyunca parça parça öğrendik; şimdi hepsi bir arada. Düzenli bir fiilde gövdeye (<i lang="de">schreib-</i>) şu ekler gelir:</p>
  <div className="l1a-scroll"><table className="l1a-table l2-verbs"><thead><tr><th>kişi</th><th>ek</th>{regularVerbsD.map(verb=><th key={verb} lang="de">{verb}</th>)}</tr></thead>
   <tbody>{personRows.map(([person,tr,ending,forms])=><tr key={person}><td><b lang="de">{person}</b> ({tr})</td><td lang="de"><b>{ending}</b></td>{forms.map(form=><td key={form} lang="de"><Marked text={form}/></td>)}</tr>)}</tbody></table></div>
  <div className="l1a-actions">{regularVerbsD.map((verb,i)=><Say key={verb} text={conjugationSay(regularFormsD(i))} speech={speech} label={verb} wide/>)}</div>
  <p>Ezber ipucu: ekler ikişer ikişer eşleşir. <b lang="de">er/sie</b> ile <b lang="de">ihr</b> aynı (<b lang="de">-t</b>); <b lang="de">wir</b> ile <b lang="de">sie/Sie</b> aynı (<b lang="de">-en</b>, fiilin sözlük hâli). Yani aslında dört ek var: <b lang="de">-e, -st, -t, -en</b>.</p>
  <h2 className="l1a-h2">Dört özel fiil</h2>
  <div className="l1a-scroll"><table className="l1a-table l2-verbs"><thead><tr><th/>{specialVerbsD.map(([verb])=><th key={verb} lang="de">{verb}</th>)}</tr></thead>
   <tbody>{personLabels.map((person,row)=><tr key={person}><td><b lang="de">{person}</b></td>{specialVerbsD.map(([verb,forms])=><td key={verb} lang="de"><Marked text={forms[row]}/></td>)}</tr>)}</tbody></table></div>
  <div className="l1a-actions">{specialVerbsD.map(([verb,forms])=><Say key={verb} text={conjugationSay(forms)} speech={speech} label={verb} wide/>)}</div>
  <ul className="l1a-list">
   <li><b lang="de">arbeiten:</b> gövde <b>-t</b> ile bitiyor → <span lang="de">du / er / ihr</span>’de araya <b>e</b>: <i lang="de">arbeit<b>est</b>, arbeit<b>et</b>, arbeit<b>et</b></i>.</li>
   <li><b lang="de">sprechen:</b> sadece <span lang="de">du</span> ve <span lang="de">er/sie</span>’de <b>e → i</b>: <i lang="de">spr<b>i</b>chst, spr<b>i</b>cht</i>. <span lang="de">ihr</span>’de değişmez: <i lang="de">ihr sprecht</i>.</li>
   <li><b lang="de">heißen:</b> <span lang="de">du</span> ve <span lang="de">er</span> aynı görünür: <i lang="de">du heißt, er heißt</i> (ß’ten sonra tek t).</li>
   <li><b lang="de">sein:</b> tamamen kuralsız; altı biçimi şarkı gibi ezberle: <i lang="de">bin, bist, ist, sind, seid, sind</i>.</li>
  </ul>
  <QuickChecks items={verbChecksD} speech={speech} sound={sound}/></>;
}
function PersonalForm({speech,sound}:{speech:Speech;sound:Sound}){
 return <><p className="kicker" lang="de">Konu 2 · Beim Altenpflege-Service</p><Heading>Personalformular: işe giriş formu</Heading>
  <p>Rami iş buldu: Altenpflege-Service „Sonnenblick“te başlıyor. İlk gün <b lang="de">Personalformular</b> (personel formu) doldurulur. Alanlar 2C’dekiyle aynı; sadece iki yeni ad var:</p>
  <table className="l1a-table"><thead><tr><th>formda</th><th>2C’de</th><th>anlamı</th></tr></thead>
   <tbody>{formNames.map(([form,inC,tr],i)=><tr key={form}><td lang="de">{i<2?<b>{form}</b>:form}</td><td lang={inC==='aynı'?'tr':'de'}>{inC}</td><td>{tr}</td></tr>)}</tbody></table>
  <h2 className="l1a-h2">Rami’nin formu</h2>
  <div className="l2-card"><Portrait who="rami" name="Rami"/><dl>{ramiForm.map(([label,value])=><div key={label}><dt lang="de">{label}:</dt><dd lang="de">{value}</dd></div>)}</dl></div>
  <h2 className="l1a-h2">Formdan cümleye: bilgi aktarma</h2>
  <p>Formdaki bilgiyi başkasına aktarırken <b lang="de">er / sie</b> ile cümle kurarsın (2B’den). Alan adıyla da söylenebilir: <i lang="de">„Die Telefonnummer ist …“</i></p>
  {ramiSentences.map(([de,tr,say])=><SayRow key={de} de={de} tr={tr} say={say} speech={speech}/>)}
  <Note>Kapı numarası 25: <i lang="de">„fünfundzwanzig“</i> — 20’den büyük sayıları sonraki derslerde öğreneceğiz; şimdilik sadece dinle. <i lang="de">„in der Kastanienallee“</i> kalıbını da olduğu gibi ezberle.</Note>
  <QuickChecks items={formChecksD} speech={speech} sound={sound}/></>;
}
function LongWords({speech,sound}:{speech:Speech;sound:Sound}){
 return <><p className="kicker" lang="de">Konu 3 · Strategie: Lange Wörter lernen</p><Heading>Uzun kelimeler nasıl öğrenilir?</Heading>
  <p>Almanca kelimeler uzun görünür, çünkü birkaç kelime yapıştırılarak yazılır: <i lang="de">Telefon + Nummer = <b>Telefonnummer</b></i>. Strateji: kelimeyi <b>hecelere</b> böl, hece hece söyle, sonra hızlan.</p>
  <table className="l1a-table"><tbody>{syllableWords.map(row=><tr key={row[1]}><td lang="de">{row[0].map(part=><span className="l2-syl" key={part}>{part}</span>)}</td><td lang="de">{row[1]}</td><td><Say text={syllableSay(row)} speech={speech}/></td></tr>)}</tbody></table>
  <ol className="l1a-list l1a-steps-list">{longWordSteps.map(([title,text])=><li key={title}><b>{title}</b> {text}</li>)}</ol>
  <Note>Kitabın sorusu: <i lang="de">„Welche Wörter in Kapitel 1 und 2 sind für Sie schwer?“</i> — Lektion 1 ve 2’de senin için zor olan kelimeleri bir listeye yaz ve bu yöntemle çalış. Senin için zor olan kelimeler başka öğrenciler için de zordur.</Note>
  <QuickChecks items={longChecks} speech={speech} sound={sound}/></>;
}
function Pardon({speech}:{speech:Speech}){
 return <><p className="kicker" lang="de">Konu 4 · Wie bitte? Wie schreibt man das?</p><Heading>Anlamadığında: tekrar ve heceleme isteme</Heading>
  <p>Biri çok hızlı konuştu, adı duyamadın, yazılışını bilmiyorsun. Bu küçük cümleler yardım eder:</p>
  {pardonPhrases.map(([de,tr,say])=><SayRow key={de} de={de} tr={tr} say={say} speech={speech}/>)}
  <h2 className="l1a-h2">Diyalog: Nora ve Rami</h2>
  <Conversation lines={noraRami} speech={speech}/>
  <p className="l1a-tr">Nora iş yerinde Rami’ye <b lang="de">Sie</b> diyor: <i lang="de">„Wie ist <b>Ihr</b> Nachname?“</i> (<span lang="de">Ihr</span> = sizin). Kurstaki arkadaşlar arasında <i lang="de">„dein Nachname“</i>.</p>
  <h2 className="l1a-h2">Alfabe hatırlatması (Lektion 1B)</h2>
  <p className="l1a-tr">Bir harfe dokun, adını dinle.</p>
  <div className="l2-letters">{alphabet.map(([letter,,say])=><button type="button" key={letter} className="l2-letter" lang="de" aria-label={'Dinle: '+letter} onClick={()=>speech.speak({text:say,slow:true})}>{letter}</button>)}</div>
  <h2 className="l1a-h2">Pantomim oyunu: <span lang="de">Was machen wir?</span></h2>
  <p>Kitaptaki oyun: iki kişi bir fiili canlandırır, diğerleri <b lang="de">ihr</b> ile tahmin eder.</p>
  {mimePhrases.map(([de,tr])=><PhraseRow key={de} de={de} tr={tr} speech={speech}/>)}
  <h2 className="l1a-h2">Bu ünitenin kalıpları</h2>
  {phrasesD.map(([de,tr,say])=><SayRow key={de} de={de} tr={tr} say={say} speech={speech}/>)}
  <div className="l1a-actions"><button type="button" className="btn secondary small" disabled={speech.busy} onClick={()=>speech.speakAll(phrasesD.map(([,,say])=>say))}><Play size={16} aria-hidden="true"/>Tümünü dinle</button></div>
  <p className="l1a-tr">Şimdi alıştırmalar, sonra <b lang="de">Alles klar?</b> sınavı. Sırayla yapılır.</p></>;
}

/* ---------- exercises ---------- */
/** Alıştırma 1 · Rami's first day: heard first (the text stays hidden until the learner shows it), then richtig / falsch.
 * After an answer only the right answer is read ("Richtig!" or "Falsch." with the fact). */
function FirstDay(props:StepProps){
 const {speech}=props;const [shown,setShown]=useState(false);
 const rows=firstDayRows.map(([statement,answer,say,note])=>({key:statement,label:statement,before:<span className="l15-row-sentence" lang="de">{statement}</span>,options:[{value:'Richtig',label:'Richtig'},{value:'Falsch',label:'Falsch'}],answer,say,reveal:<p className="l1a-mini">{note}</p>}));
 return <ChoiceRows kicker="Alıştırma 1 · Beim Altenpflege-Service. Richtig oder falsch?" title="Dinle: doğru mu, yanlış mı?" lead="Rami’nin iş yerindeki ilk günü. Önce diyaloğu dinle (metin gizli; istersen sonra aç), sonra dört cümle için Richtig ya da Falsch seç."
  before={<>
   {shown?<Conversation lines={firstDay} speech={speech} actions={false}/>
   :<div className="l1a-dialogue">{firstDay.map((line,i)=><div className={'l1a-line '+(line.who==='nora'?'a':'b')} key={i}><Portrait who={line.who} name={personName(line.who)}/><div className="l1a-bubble"><span className="l15-name">{personName(line.who)}</span><span className="l2-secret" aria-hidden="true" lang="de">{line.de}</span></div></div>)}<span className="lk-visually-hidden">Metin gizli; önce dinle.</span></div>}
   <div className="l1a-actions">
    <button type="button" className="btn small" disabled={speech.busy} onClick={()=>speech.speakAll(firstDay.map(line=>({text:line.de,who:line.who})))}><Play size={16} aria-hidden="true"/>Dinle</button>
    <button type="button" className="btn secondary small" disabled={shown} onClick={()=>setShown(true)}><Eye size={16} aria-hidden="true"/>Metni göster</button>
   </div>
   <h2 className="l1a-h2" lang="de">Richtig oder falsch?</h2>
  </>} rows={rows} wide {...props}/>;
}
/** Alıştırma 2 · Nora asks, Rami answers (heard); the learner fills in Rami's form: names chosen from three words, the
 * numbers and the street typed. Every field checks itself; a right typed field is read. */
function FormListen(props:StepProps){
 const {speech,sound,onScore,step}=props;const total=formFields.length;
 const [orders]=useState(()=>formFields.map(field=>field.options?shuffle(field.options):[]));
 const [feedback,setFeedback]=useState<Feedback>(null);const spoken=useRef<boolean[]>(formFields.map(()=>false));
 const isRight=(i:number,value:string)=>{const field=formFields[i];return field.digits?phoneDigits(value)===phoneDigits(field.answer):field.options?value===field.answer:acceptsAnswer(value,[field.answer]);};
 const self=useSelfCheck(total,isRight,firstRight=>{onScore(step.id,firstRight,total);setFeedback({ok:true,text:firstRight===total?'Form tamam! Rami artık çalışabilir.':`Form tamam! İlk denemede ${firstRight} / ${total} doğruydu.`});});
 const note=(result:SelfCheckResult)=>selfCheckNote(result,self,'Kırmızıyı düzelt: diyaloğu bir daha dinle.',setFeedback);
 const after=(i:number,result:SelfCheckResult,choice:boolean)=>{
  note(result);
  if(result==='wrong'&&choice){sound.wrong();return;}
  if(result!=='right'||spoken.current[i])return;spoken.current[i]=true;
  const say=formFields[i].say;sound.correct(say?()=>speech.speak({text:say,who:'rami'}):undefined);
 };
 const choose=(i:number,word:string)=>{sound.prepare();speech.prepare();after(i,self.change(i,word,true),true);};
 const type=(i:number,value:string)=>{sound.prepare();speech.prepare();const field=formFields[i];after(i,self.change(i,value,!!field.digits&&phoneDigits(value).length>=phoneDigits(field.answer).length),false);};
 return <>
  <p className="kicker" lang="de">Alıştırma 2 · Hören Sie weiter. Ergänzen Sie.</p><Heading>Rami’nin formunu doldur</Heading>
  <p className="l1a-tr">Nora soruyor, Rami cevaplıyor. Dinle (istediğin kadar) ve formu doldur: isimler için boşluğa dokun ve seç; sayıları ve adresi yaz. Numaraları boşluklu ya da boşluksuz yazabilirsin.</p>
  <div className="l1a-dialogue"><div className="l1a-line a"><Portrait who="nora" name="Nora"/><div className="l1a-bubble l15-say-bubble"><div className="l15-say-text"><span className="l15-name">Nora</span><span className="l1a-de" lang="de">Also, Familienname? …</span></div><button type="button" className="l12-say" disabled={speech.busy} aria-label="Diyaloğu dinle" onClick={()=>speech.speakAll(formTalk)}><Volume2 size={18} aria-hidden="true"/></button></div></div></div>
  <div className="l2-formcard"><p className="l2-formcard-head" lang="de">Altenpflege-Service Sonnenblick · Personalformular</p>
   {formFields.map((field,i)=>{const state=self.state[i];return <div className="l2-formrow" key={field.label}>
    <span className="l2-formlabel" lang="de">{field.label}:</span>
    {field.options?<WordChoice value={self.values[i]} options={orders[i]} state={state} label={field.label} onChoose={word=>choose(i,word)}/>
    :<span className="l1a-gap-wrap"><input className={'l1a-gap'+(field.digits?'':' wide')+(state===true?' ok':state===false?' bad':'')} value={self.values[i]} lang="de" dir="ltr" inputMode={field.digits?'tel':undefined} autoCapitalize="off" autoComplete="off" spellCheck={false} aria-label={field.label}
      onChange={event=>type(i,event.target.value)} onBlur={()=>note(self.leave(i))} onKeyDown={event=>{if(event.key==='Enter'){event.preventDefault();note(self.leave(i));}}}/>{self.hinted[i]&&state!==true&&<span className="l1a-hint" lang="de">→ {field.answer}</span>}</span>}
   </div>;})}
  </div>
  <FeedbackLine feedback={feedback}/>
 </>;
}
/** Alıştırma 3 · the verb table (schreiben, sprechen, sein for all six persons): a right form turns green at once and is
 * read; a wrong one turns red when the learner leaves the box, with the right form next to it. */
function VerbGaps(props:StepProps){
 const {speech,sound,onScore,step}=props;const total=tableCells.length;
 const [feedback,setFeedback]=useState<Feedback>(null);
 const refs=useRef<(HTMLInputElement|null)[]>([]);const spoken=useRef<boolean[]>(tableCells.map(()=>false));
 const self=useSelfCheck(total,(i,value)=>acceptsAnswer(value,[tableCells[i].answer,tableCells[i].say]),firstRight=>{
  onScore(step.id,firstRight,total);setFeedback({ok:true,text:firstRight===total?'Hepsi doğru!':`Hepsi doğru! İlk denemede ${firstRight} / ${total} doğruydu.`});
 });
 const note=(result:SelfCheckResult)=>selfCheckNote(result,self,'Kırmızıyı düzelt; doğrusu yanında yazıyor.',setFeedback);
 const focusNext=(i:number)=>{const target=tableCells.findIndex((_,k)=>k>i&&self.stateNow(k)!==true);if(target>=0)refs.current[target]?.focus();};
 const change=(i:number,value:string)=>{
  sound.prepare();speech.prepare();const result=self.change(i,value);note(result);
  if(result!=='right'||spoken.current[i])return;spoken.current[i]=true;sound.correct(()=>speech.speak(tableCells[i].say));
 };
 const restart=()=>{self.reset();setFeedback(null);spoken.current=tableCells.map(()=>false);};
 const cell=(row:number,col:number)=>{const i=tableCells.findIndex(item=>item.row===row&&item.col===col);
  if(i<0)return <span lang="de">{tableVerbs[col].forms[row]}</span>;const state=self.state[i];
  return <span className="l1a-gap-wrap"><input ref={element=>{refs.current[i]=element;}} className={'l1a-gap'+(state===true?' ok':state===false?' bad':'')} value={self.values[i]} lang="de" dir="ltr" autoCapitalize="off" autoComplete="off" spellCheck={false} aria-label={personNames[row]+' · '+tableVerbs[col].verb} enterKeyHint="next"
   onChange={event=>change(i,event.target.value)} onBlur={()=>note(self.leave(i))} onKeyDown={event=>{if(event.key==='Enter'){event.preventDefault();note(self.leave(i));focusNext(i);}}}/>{self.hinted[i]&&state!==true&&<span className="l1a-hint" lang="de">→ {tableCells[i].answer}</span>}</span>;};
 return <>
  <p className="kicker" lang="de">Alıştırma 3 · Wie sind die Verbformen?</p><Heading>Tabloyu doldur</Heading>
  <p className="l1a-tr">Altı kişi için doğru biçimi yaz. Doğru yazınca kutu hemen yeşil olur ve okunur. (ß yerine ss de yazabilirsin.)</p>
  <div className="l1a-scroll"><table className="l1a-table l2-verb-gaps"><thead><tr><th/>{tableVerbs.map(verb=><th key={verb.verb} lang="de">{verb.verb}</th>)}</tr></thead>
   <tbody>{personLabels.map((person,row)=><tr key={person}><td><b lang="de">{person}</b></td>{tableVerbs.map((_,col)=><td key={col}>{cell(row,col)}</td>)}</tr>)}</tbody></table></div>
  <FeedbackLine feedback={feedback}/>
  <div className="l1a-actions"><button type="button" className="btn secondary small" onClick={restart}><RotateCcw size={16} aria-hidden="true"/>Baştan</button></div>
 </>;
}
/** The learner's own form (Alıştırma 6), on this device only. */
type OwnValues=Record<OwnField['key'],string>;
const emptyForm=():OwnValues=>({vor:'',nach:'',str:'',plz:'',ort:'',beruf:'',tel:''});
function readForm():OwnValues{
 const out=emptyForm();
 try{const saved=JSON.parse(localStorage.getItem(L2D_FORM_KEY)??'{}') as unknown;if(saved&&typeof saved==='object')for(const field of ownFields){const value=(saved as Record<string,unknown>)[field.key];if(typeof value==='string')out[field.key]=value;}}catch{}
 return out;
}
/** Alıştırma 6 · Dein Formular: the learner fills in their own Personalformular (kept on this device only, never sent);
 * a filled field turns green; then they listen to it and hear their first name spelled. Done when all seven are filled. */
function OwnForm({speech,sound,onScore,step}:StepProps){
 const [values,setValues]=useState<OwnValues>(readForm);const [spelled,setSpelled]=useState('');
 const scored=useRef(false);const total=ownFields.length;
 const allOk=ownFields.every(field=>ownFieldOk(field,values[field.key]));
 // All seven filled: the step shows done (once per visit).
 // eslint-disable-next-line react-hooks/exhaustive-deps
 useEffect(()=>{if(allOk&&!scored.current){scored.current=true;onScore(step.id,total,total);sound.correct();}},[allOk]);
 const change=(key:OwnField['key'],value:string)=>{const next={...values,[key]:value};setValues(next);try{localStorage.setItem(L2D_FORM_KEY,JSON.stringify(next));}catch{}};
 const listen=()=>{sound.prepare();speech.prepare();const v=(key:OwnField['key'])=>values[key].trim();
  speech.speakAll([v('vor')&&`Mein Vorname ist ${v('vor')}.`,v('nach')&&`Mein Familienname ist ${v('nach')}.`,v('str')&&`Meine Adresse ist ${v('str')}.`,
   v('plz')&&`Die Postleitzahl ist ${[...v('plz').replace(/\D/g,'')].join(' ')}.`,v('ort')&&`Mein Wohnort ist ${v('ort')}.`,v('beruf')&&`Ich bin ${v('beruf')} von Beruf.`,
   v('tel')&&`Meine Telefonnummer ist ${[...v('tel').replace(/\D/g,'')].join(' ')}.`].filter(Boolean) as string[]);};
 const spell=()=>{const name=values.vor.trim();if(!name)return;sound.prepare();speech.prepare();setSpelled(alphabetOf(name));speech.speakAll([{text:'Ich buchstabiere'},...spellItems(name)]);};
 return <>
  <p className="kicker" lang="de">Alıştırma 6 · Entschuldigung, ich brauche Hilfe.</p><Heading>Kendi personel formunu doldur</Heading>
  <p className="l1a-tr">Bilgilerin <b>yalnızca bu cihazda</b> kalır; hesabına ya da başka bir yere gönderilmez. Her alan dolunca yeşil olur (PLZ 5 rakam, telefon en az 8 rakam). Sonra formunu dinle ve adını harf harf dinle: <i lang="de">„Wie schreibt man das?“</i> sorusuna böyle cevap verirsin.</p>
  <div className="l2-formcard"><p className="l2-formcard-head" lang="de">Personalformular</p>
   {ownFields.map(field=>{const value=values[field.key];const ok=ownFieldOk(field,value);return <div className="l2-formrow" key={field.key}>
    <label className="l2-formlabel" htmlFor={'l2d-own-'+field.key} lang="de">{field.label}:</label>
    <input id={'l2d-own-'+field.key} className={'l1a-gap wide'+(ok?' ok':value.trim()&&!ok&&(field.key==='plz'||field.key==='tel')?' bad':'')} value={value} lang="de" dir="ltr" inputMode={field.numeric?'tel':undefined} autoComplete="off" spellCheck={false} onChange={event=>change(field.key,event.target.value)}/>
   </div>;})}
  </div>
  <FeedbackLine feedback={allOk?{ok:true,text:'Form tamam! Şimdi formunu ve adını dinle.'}:null}/>
  <div className="l1a-actions">
   <button type="button" className="btn secondary small" disabled={speech.busy||!Object.values(values).some(value=>value.trim())} onClick={listen}><Volume2 size={16} aria-hidden="true"/>Formumu dinle</button>
   <button type="button" className="btn secondary small" disabled={speech.busy||!values.vor.trim()} onClick={spell}>🔤 <span lang="de">Vornamen buchstabieren</span></button>
  </div>
  {spelled&&<p className="l1a-mini" lang="de">{spelled}</p>}
 </>;
}
/** A name letter by letter for the eye: "K – H – A – L – I – L". */
const alphabetOf=(name:string)=>[...name.replace(/[^A-Za-zÄÖÜäöüß]/g,'')].map(letter=>letter==='ß'?letter:letter.toUpperCase()).join(' – ');
/** Prüfung: Schreiben — the text about Tomasz (read by Paul Hoca) and the given name of the form. */
function TomaszText({speech}:{speech:Speech}){
 return <>
  <div className="l1a-dialogue"><div className="l1a-line a"><Portrait who="tomasz" name="Tomasz"/><div className="l1a-bubble"><span className="l15-name">Tomasz Nowak</span><span className="l1a-de" lang="de" dir="ltr">{tomaszExam}</span></div><Say text={tomaszExamSay} who="paul" speech={speech}/></div></div>
  <p className="l2-formcard-head" lang="de">Formular · Name: Tomasz Nowak</p>
 </>;
}
/** The points of "Alles klar?" (like Lektion 1D: under half the points of a section → "Bitte noch üben!"). */
function PointsD({scores,onGo}:StepProps){
 const rows=checkSectionsD.map(section=>({...section,score:scores[section.id]}));
 const done=rows.filter(row=>row.score);
 const total=done.reduce((n,row)=>n+Math.min(row.points,row.score!.right),0);const max=done.reduce((n,row)=>n+row.points,0);
 const verdict=max===0?'Henüz bir bölüm yapılmadı. Alles klar? 1 ile başla.':total>=max*.8?'🎉 Lektion 2 geschafft! Sırada Lektion 3.':total>=max*.5?'👍 İyi gidiyor. Zayıf bölümleri bir daha yap.':'📖 Bitte noch üben! Konu adımlarına dön.';
 const trophy=berufeDPictures.trophy;
 return <>
  <p className="kicker" lang="de">Alles klar? · Ergebnis</p><Heading>Lektion 2 puanların</Heading>
  <img className="l2-plain l2-trophy" src={trophy.src} alt="Paul Hoca kupayı başının üstüne kaldırmış: Lektion 2 geschafft!" width={trophy.width} height={trophy.height} loading="lazy" decoding="async"/>
  <table className="l1a-table l1a-points"><thead><tr><th>Bölüm</th><th/><th>Punkte</th></tr></thead><tbody>
   {rows.map(row=>{const low=!!row.score&&row.score.right<row.points/2;return <tr key={row.id} data-l2-points={row.id}>
    <td lang="de">{row.label}</td>
    <td>{row.score?low?<button type="button" className="btn secondary small" lang="de" onClick={()=>onGo(berufeStepIndexD(row.id))}>Bitte noch üben!</button>:<span className="l1a-ok-text">✓</span>:<button type="button" className="text-button l1a-mini" onClick={()=>onGo(berufeStepIndexD(row.id))}>henüz yapılmadı</button>}</td>
    <td className={row.score?low?'l1a-bad-text':'l1a-ok-text':''}>{row.score?`${Math.min(row.points,row.score.right)} / ${row.points}`:`– / ${row.points}`}</td>
   </tr>;})}
   <tr className="l1a-points-total"><td><b>Toplam</b></td><td/><td><b>{total} / {checkPointsD}</b></td></tr>
  </tbody></table>
  <p className="l1a-big" role="status">{verdict}</p>
  <Note>Kitaptaki gibi: bir bölümde puanın yarıdan azsa <b lang="de">Bitte noch üben!</b> — o konuya dön, sonra bölümü tekrar yap.</Note>
 </>;
}
/** Konuş · Sprechen Teil 1 (the exam): Paul Hoca asks five topics, Rami answers first, then the learner — with their own
 * form (Alıştırma 6) and their job sentence of Teil A when they are there (read from this device only). */
function KonusL2D(props:StepProps){
 const [own]=useState(()=>({form:readForm(),job:ownJobSentence()}));
 const {form,job}=own;const name=[form.vor.trim(),form.nach.trim()].filter(Boolean).join(' ');
 const answers:Record<string,string>={name:name?`Ich heiße ${name}.`:'',land:'',wohnort:form.ort.trim()?`Ich wohne in ${form.ort.trim()}.`:'',sprachen:'',beruf:job||(form.beruf.trim()?`Ich bin ${form.beruf.trim()} von Beruf.`:'')};
 const rows=examTalk.map(item=>({key:item.key,who:'paul',question:item.question,model:{who:'rami',text:item.rami},answer:answers[item.key]}));
 return <SpeakStep kicker="Konuş · Prüfungstraining: Sprechen Teil 1" title="Sınav provası: kendini tanıt"
  lead={<>Sınavın ilk bölümünde beş başlıkla kendini tanıtırsın: <b lang="de">Name · Land · Wohnort · Sprachen · Beruf</b>. Önce Rami’yi dinle, sonra sen söyle. Kendi formun (Alıştırma 6) ve 2A’daki meslek cümlen varsa burada görünür; bu bilgiler yalnızca bu cihazda.</>}
  rows={rows} after={<Note>İpucu (kitaptan): cümleleri ezberle, bir arkadaşınla pratik yap, sonra serbest konuş. Kendini telefonuna kaydet ve dinle.</Note>}
  replies={['🎉 Süper! Sınavın ilk bölümü hazır.','👍 İyi. Bir kez daha dinle ve söyle.','Sorun değil. Beş cümleni yaz, kaydet, yarın tekrar söyle.']} {...props}/>;
}
/** The end of Lektion 2. */
function EndL2D({progress,onGo,onPart}:StepProps){
 return <>
  <p className="kicker" lang="de">Bitti</p>
  <Heading>Lektion 2 tamam! 🎉</Heading>
  <PaulHoca pose="cheer" className="l1a-paul-big" sound="appear"/>
  <p>A’dan D’ye kadar bitirdin. Artık şunları yapabilirsin:</p>
  <ul className="l1a-list">
   <li>Mesleğini ve işini söylemek: <b lang="de">Ich bin … von Beruf. Ich arbeite als …</b></li>
   <li>Başkasını tanıtmak: <b lang="de">Das ist … Er / Sie kommt aus …</b></li>
   <li>0–20 saymak, telefon numaranı söylemek, yardım istemek</li>
   <li>Formları anlamak ve doldurmak: <b lang="de">Vorname, Familienname, Wohnort, PLZ</b></li>
   <li>Altı kişi için fiil çekmek: <b lang="de">ich, du, er/sie, wir, ihr, sie/Sie</b></li>
  </ul>
  <ProgressMeter progress={progress} language={'tr'} label="Lektion 2D"/>
  <p className="l1a-tr">Sırada: <b lang="de">Lektion 3</b>.</p>
  <div className="l1a-actions">
   <button type="button" className="btn secondary small" onClick={()=>onGo(berufeStepIndexD('puanlar'))}>Puanlarım</button>
   <button type="button" className="btn secondary small" onClick={()=>onPart('a',0)}>Teil A</button>
   <button type="button" className="btn small" onClick={()=>onGo(-1)}><BookOpen size={16} aria-hidden="true"/>Lektion 2 içindekiler</button>
  </div>
 </>;
}
