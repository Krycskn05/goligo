'use client';
import {useState} from 'react';
import {Check,Eye,EyeOff,Play,Volume2} from 'lucide-react';
import {normalizeLoose} from '@/lib/willkommen-course';
import {
 willkommenDPictures,comicPanels,comicLines,importantSentences,importantSay,meiExample,strategySteps,summaryHellos,summaryGoodbyes,summaryQuestions,
 summaryVerbs,summaryVerbSay,summaryRules,wordsD,wordSayD,comicBox,comicGapLines,comicGapSay,ichSentences,ownPromptsD,selfRatings,vocabBox,vocabLines,
 vocabSay,grammarLines,grammarSay,talkLines,talkSay,profileLines,testQuestionsD,checkSections,checkPoints,stepIndexD,lineSayD,
} from '@/lib/willkommen-d-course';
import {ProgressMeter} from './progress-ui';
import {TalkStep} from './talk-step';
import {talkScenarios} from '@/lib/talk-scenarios';
import {PaulHoca} from './paul-hoca';
import {Say,Note,Rich,Heading,FeedbackLine,useFinish,GapExercise,TestStep,type Speech,type StepProps,type Feedback} from './willkommen-ui';
import {DialogueLines,Picture} from './willkommen-b-steps';

/**
 * Lektion 1, Teil D – Ich bin neu hier. (the learner's lesson page, 25 October 2026): the steps. The page around them
 * (notebook, tabs, pager, scores) is app/willkommen-study.tsx; the texts are lib/willkommen-d-course.ts.
 */
export function StepViewD(props:StepProps){
 const {step,speech}=props;
 switch(step.id){
  case 'kapak':return <CoverD {...props}/>;
  case 'cizgi-roman':return <Comic speech={speech}/>;
  case 'onemli':return <Important speech={speech}/>;
  case 'strateji':return <Strategy/>;
  case 'ozet':return <Summary speech={speech}/>;
  case 'kelimeler':return <WordListD speech={speech}/>;
  case 'tamamla':return <GapExercise kicker="Alıştırma 1 · Was sagen die Personen?" title="Çizgi romanı tamamla" lead="Kutudan doğru cümleyi seç." lines={comicGapLines} choices={comicBox} say={comicGapSay} speakers={{a:'nora',b:'yasemin'}} {...props}/>;
  case 'ich':return <IchSentences {...props}/>;
  case 'sen':return <OwnD {...props}/>;
  case 'wortschatz':return <GapExercise kicker="Alles klar? · 1 Wortschatz · 5 Punkte" title="Kelime: doğru kelimeyi seç" lines={vocabLines} choices={vocabBox} say={vocabSay} speakers={{a:'tomasz',b:'sabine'}} {...props}/>;
  case 'grammatik':return <GapExercise kicker="Alles klar? · 2 Grammatik · 8 Punkte" title="Dilbilgisi: fiili doğru çek" lead="Parantezdeki fiili doğru biçimde yaz." lines={grammarLines} say={grammarSay} {...props}/>;
  case 'kommunikation':return <GapExercise kicker="Alles klar? · 3 Kommunikation · 6 Punkte" title="İletişim: diyaloğu tamamla" lead="Boşluklara uygun cümleyi ya da cümle parçasını yaz." lines={talkLines} wide say={talkSay} speakers={{a:'nora',b:'rami'}} {...props}/>;
  case 'steckbrief':return <GapExercise kicker="Alles klar? · 4 Steckbrief · 4 Punkte" title="Kimlik kartlarını doldur" lead="Bir önceki diyaloğa göre: ülke ve diller." lines={profileLines} wide say={[]} {...props}/>;
  case 'test':return <TestStep label="Alles klar? · 5 Lektion 1 Test · 15 Punkte" questions={testQuestionsD} sayFor={i=>testQuestionsD[i][3]} {...props}/>;
  case 'puanlar':return <Points {...props}/>;
  case 'konus':return <TalkStep scenario={talkScenarios.l1d} {...props}/>;
  case 'bitti':return <EndD {...props}/>;
 }
 return null;
}

/* ---------- teaching steps ---------- */
function CoverD({progress,onGo,scores}:StepProps){
 const started=Object.keys(scores).length>0;
 return <>
  <p className="kicker" lang="de">Lektion 1 · Willkommen!</p>
  <Heading><span lang="de">D — Ich bin neu hier.</span></Heading>
  <p>Bu bölümde:</p>
  <ul className="l1a-list"><li>Çizgi roman: yeni komşuyla tanışma</li><li>Lektion 1’in en önemli cümleleri ve ezber stratejisi</li><li>Lektion 1 özeti</li><li><b lang="de">Alles klar?</b> — puanlı bölüm sınavı</li></ul>
  <p className="l1a-tr">Önce konuyu öğren (5 kısa adım), sonra 3 alıştırma ve <span lang="de">Alles klar?</span> (4 bölüm + test).</p>
  {started&&<ProgressMeter progress={progress} language={'tr'} label="Lektion 1D"/>}
  <div className="l1a-jump">
   <button type="button" className="btn small" onClick={()=>onGo(1)}><Play size={16} aria-hidden="true"/>Konuyu öğren</button>
   <button type="button" className="btn secondary small" onClick={()=>onGo(stepIndexD('tamamla'))}>Alıştırmalara geç</button>
   <button type="button" className="btn secondary small" onClick={()=>onGo(stepIndexD('wortschatz'))}>Alles klar?</button>
  </div>
 </>;
}
function Comic({speech}:{speech:Speech}){
 return <><Heading><span lang="de">Bis bald!</span> — çizgi roman</Heading>
  <p className="l1a-tr">Yasemin yeni dairesine taşınıyor. Merdivende komşusu Nora ile karşılaşıyor.</p>
  {comicPanels.map((panel,i)=><section className="l1a-panel" key={i} aria-label={'Kare '+(i+1)}>
   <span className="l1a-panel-num" aria-hidden="true">{i+1}</span>
   <Picture {...willkommenDPictures.comic[i]} alt={panel.alt}/>
   <DialogueLines lines={panel.lines} speech={speech}/>
  </section>)}
  <div className="l1a-actions"><button type="button" className="btn secondary small" disabled={speech.busy} onClick={()=>speech.speakAll(comicLines.map(lineSayD))}><Play size={16} aria-hidden="true"/>Tümünü dinle</button></div>
 </>;
}
function Important({speech}:{speech:Speech}){
 return <><Heading><span lang="de">Wichtige Sätze</span> — önemli cümleler</Heading>
  <p className="l1a-tr">Çizgi romandaki <b lang="de">ich</b> ile başlayan cümleler, kendini tanıtmanın iskeleti:</p>
  {importantSentences.map(sentence=><div className="l1a-phrase" key={sentence}><div className="l1a-phrase-text"><span className="l1a-de" lang="de" dir="ltr">{sentence}</span></div><Say text={importantSay(sentence)} speech={speech}/></div>)}
  <h3 className="l1a-h2">Örnek: Mei</h3>
  <DialogueLines lines={[meiExample]} speech={speech}/>
  <Note>Bu üç cümleyi <b>ezbere</b> bilmelisin: adın, ülken, dillerin. Her yerde sorulur.</Note></>;
}
function Strategy(){
 return <><Heading>Strateji: telefonla ezberle</Heading>
  <Picture {...willkommenDPictures.strategy} alt="Nikos telefona kendini kaydediyor, sonra kulaklıkla dinliyor"/>
  <ol className="l1a-list l1a-steps-list">{strategySteps.map(([title,text])=><li key={title}><b>{title}</b> {text}</li>)}</ol>
  <Note>Bu yöntem her ders için geçerli: yeni kalıpları ezberlerken hep kendi sesinle çalış.</Note></>;
}
function Summary({speech}:{speech:Speech}){
 return <><Heading>Lektion 1 özeti</Heading>
  <h3 className="l1a-h2">Selam ve veda</h3>
  <div className="l1a-two">
   <div><p className="l1a-two-head">Karşılaşınca</p><ul className="l1a-say-list" lang="de">{summaryHellos.map(text=><li key={text}><span>{text}</span><Say text={text} speech={speech}/></li>)}</ul></div>
   <div><p className="l1a-two-head">Ayrılırken</p><ul className="l1a-say-list" lang="de">{summaryGoodbyes.map(text=><li key={text}><span>{text}</span><Say text={text} speech={speech}/></li>)}</ul></div>
  </div>
  <h3 className="l1a-h2">Dört temel soru</h3>
  <table className="l1a-table l1a-sie-du"><thead><tr><th lang="de">Sie</th><th lang="de">du</th></tr></thead>
   <tbody lang="de">{summaryQuestions.map(([sie,du])=><tr key={sie}><td>{sie} <Say text={sie} speech={speech}/></td><td>{du} <Say text={du} speech={speech}/></td></tr>)}</tbody></table>
  <h3 className="l1a-h2">Fiiller</h3>
  <div className="l1a-scroll"><table className="l1a-table l1a-verb-grid" lang="de"><thead><tr><th/>{summaryVerbs.map(row=><th key={row.verb}>{row.verb}</th>)}</tr></thead>
   <tbody>{(['ich','du','sie'] as const).map(person=><tr key={person}><td><b>{person==='sie'?'Sie':person}</b></td>{summaryVerbs.map(row=><td key={row.verb}>{row[person]}</td>)}</tr>)}</tbody></table></div>
  <div className="l1a-actions">{summaryVerbs.map(row=><Say key={row.verb} text={summaryVerbSay(row)} speech={speech} label={row.verb} wide/>)}</div>
  <h3 className="l1a-h2">Kurallar</h3>
  <ul className="l1a-list">{summaryRules.map(rule=><li key={rule}><Rich text={rule}/></li>)}</ul></>;
}
function WordListD({speech}:{speech:Speech}){
 return <><Heading>Kelime listesi</Heading>
  <table className="l1a-table l1a-words"><tbody>{wordsD.map(([de,tr])=><tr key={de}><td><span className="l1a-de" lang="de">{de}</span></td><td>{tr}</td><td><Say text={wordSayD(de)} speech={speech}/></td></tr>)}</tbody></table>
  <p className="l1a-tr">Şimdi alıştırmalar ve <b lang="de">Alles klar?</b> sınavı.</p></>;
}

/* ---------- Teil D's own exercises ---------- */
/** Exercise 2 · tick the sentences with "ich"; every sentence decided right is a point. */
function IchSentences(props:StepProps){
 const {speech,sound}=props;const finish=useFinish(props);
 const [ticked,setTicked]=useState<boolean[]>(()=>ichSentences.map(()=>false));const [checked,setChecked]=useState(false);const [feedback,setFeedback]=useState<Feedback>(null);
 const check=()=>{
  sound.prepare();speech.prepare();setChecked(true);
  const right=ichSentences.filter((item,i)=>ticked[i]===item.ich).length;
  setFeedback(right===ichSentences.length?{ok:true,text:'Doğru: 4 cümle “ich” ile başlıyor.'}:{ok:false,text:`${right} / ${ichSentences.length} doğru. Yeşiller “ich” cümleleri; kırmızılar yanlış seçildi.`});
  finish(right,ichSentences.length,ichSentences.filter(item=>item.ich).map(item=>({text:item.text,who:item.who})));
 };
 const again=()=>{setTicked(ichSentences.map(()=>false));setChecked(false);setFeedback(null);};
 return <>
  <p className="kicker" lang="de">Alıştırma 2 · Sätze mit „ich“</p><Heading>“ich” ile kurulan cümleleri işaretle</Heading>
  <p className="l1a-tr">Hepsini seç, sonra “Kontrol et”. (İpucu: <b lang="de">Ich</b> cümle başında büyük yazılır.)</p>
  <div className="l1a-opts column" role="group" aria-label="Cümleler">{ichSentences.map((item,i)=>{const state=!checked?'':item.ich?' ok':ticked[i]?' bad':'';return <button type="button" key={item.text} className={'l1a-opt l1a-tick'+(ticked[i]?' on':'')+state} aria-pressed={ticked[i]} disabled={checked} lang="de" onClick={()=>{const next=ticked.slice();next[i]=!next[i];setTicked(next);}}>{ticked[i]?<Check size={15} aria-hidden="true"/>:null}{item.text}</button>;})}</div>
  <div className="l1a-actions">{checked?<button type="button" className="btn secondary small" onClick={again}>Yeniden dene</button>:<button type="button" className="btn small" onClick={check}><Check size={16} aria-hidden="true"/>Kontrol et</button>}</div>
  <FeedbackLine feedback={feedback}/>
 </>;
}
/** Exercise 3 · Und Sie? Write three sentences, listen, hide them and say them by heart, then rate yourself (not scored). */
function OwnD({speech}:StepProps){
 const [values,setValues]=useState(()=>ownPromptsD.map(()=>''));const [hidden,setHidden]=useState(false);const [rating,setRating]=useState<number|null>(null);
 const state=(i:number)=>values[i].trim()?ownPromptsD[i].pattern.test(normalizeLoose(values[i])):null;
 return <>
  <p className="kicker" lang="de">Alıştırma 3 · Und Sie?</p><Heading>Şimdi sen: üç cümlen</Heading>
  <p className="l1a-tr">Yaz → dinle → gizle → ezberden söyle → kendini değerlendir.</p>
  {hidden?<Note>Cümlelerin gizlendi. Şimdi üçünü ezberden yüksek sesle söyle.</Note>:ownPromptsD.map((prompt,i)=>{const ok=state(i);return <div className="l1a-row" key={prompt.placeholder}>
   <input className={'l1a-gap wide'+(ok===true?' ok':ok===false?' bad':'')} value={values[i]} lang="de" dir="ltr" autoCapitalize="sentences" autoComplete="off" placeholder={prompt.placeholder} aria-label={prompt.placeholder} onChange={event=>{const next=values.slice();next[i]=event.target.value;setValues(next);}}/>
   {ok===false&&<span className="l1a-mini">Kalıp: <span lang="de">{prompt.placeholder}</span></span>}
  </div>;})}
  <div className="l1a-actions">
   <button type="button" className="btn secondary small" disabled={speech.busy||!values.some(value=>value.trim())} onClick={()=>speech.speakAll(values.map(value=>value.trim()).filter(Boolean))}><Volume2 size={16} aria-hidden="true"/>Dinle</button>
   <button type="button" className="btn secondary small" disabled={!values.some(value=>value.trim())} onClick={()=>setHidden(!hidden)}>{hidden?<><Eye size={16} aria-hidden="true"/>Göster</>:<><EyeOff size={16} aria-hidden="true"/>Gizle</>}</button>
  </div>
  <h3 className="l1a-h2">Nasıl gitti?</h3>
  <div className="l1a-opts" role="group" aria-label="Kendini değerlendir">{selfRatings.map(([mark,de],i)=><button type="button" key={de} className={'l1a-opt'+(rating===i?' ok':'')} aria-pressed={rating===i} lang="de" onClick={()=>{setRating(i);speech.speak(de);}}><span aria-hidden="true">{mark}</span> {de}</button>)}</div>
  {rating!==null&&<p className="l1a-feedback ok" role="status">{selfRatings[rating][2]}</p>}
 </>;
}
/** The points of "Alles klar?" (like the book: under half the points of a section → "Bitte noch üben!"). */
function Points({scores,onGo}:StepProps){
 const rows=checkSections.map(section=>({...section,score:scores[section.id]}));
 const done=rows.filter(row=>row.score);
 const total=done.reduce((n,row)=>n+Math.min(row.points,row.score!.right),0);const max=done.reduce((n,row)=>n+row.points,0);
 const verdict=max===0?'Henüz bir bölüm yapılmadı. Alles klar? 1 ile başla.':total>=max*.8?'🎉 Lektion 1 geschafft! Sırada Lektion 2.':total>=max*.5?'👍 İyi gidiyor. Zayıf bölümleri bir daha yap.':'📖 Bitte noch üben! Özet adımına dön.';
 return <>
  <p className="kicker" lang="de">Alles klar? · Ergebnis</p><Heading>Puanların</Heading>
  <Picture {...willkommenDPictures.trophy} alt="Paul Hoca kupayla: Lektion 1 geschafft!"/>
  <table className="l1a-table l1a-points"><thead><tr><th>Bölüm</th><th/><th>Punkte</th></tr></thead><tbody>
   {rows.map(row=>{const low=!!row.score&&row.score.right<row.points/2;return <tr key={row.id} data-l1a-points={row.id}>
    <td lang="de">{row.label}</td>
    <td>{row.score?low?<button type="button" className="btn secondary small" lang="de" onClick={()=>onGo(stepIndexD(row.id))}>Bitte noch üben!</button>:<span className="l1a-ok-text">✓</span>:<button type="button" className="text-button l1a-mini" onClick={()=>onGo(stepIndexD(row.id))}>henüz yapılmadı</button>}</td>
    <td className={row.score?low?'l1a-bad-text':'l1a-ok-text':''}>{row.score?`${Math.min(row.points,row.score.right)} / ${row.points}`:`– / ${row.points}`}</td>
   </tr>;})}
   <tr className="l1a-points-total"><td><b>Toplam</b></td><td/><td><b>{total} / {checkPoints}</b></td></tr>
  </tbody></table>
  <p className="l1a-big" role="status">{verdict}</p>
  <Note>Kitaptaki gibi: bir bölümde puanın yarıdan azsa <b lang="de">Bitte noch üben!</b> — o konuya dön, sonra bölümü tekrar yap.</Note>
 </>;
}
function EndD({progress,onGo,onPart}:StepProps){
 return <>
  <Heading>Lektion 1 tamam! 🎉</Heading>
  <PaulHoca pose="cheer" className="l1a-paul-big" sound="appear"/>
  <p>A’dan D’ye kadar bitirdin. Artık:</p>
  <ul className="l1a-list"><li>Selamlaşıp vedalaşabilirsin</li><li>Adını, ülkeni, dillerini söyleyebilirsin</li><li><b lang="de">Sie</b> ve <b lang="de">du</b> ile soru sorabilirsin</li><li>Hâl hatır sorabilirsin</li><li>Adını harf harf söyleyebilirsin</li><li>Fiili doğru çekip 2. pozisyona koyabilirsin</li></ul>
  <ProgressMeter progress={progress} language={'tr'} label="Lektion 1D"/>
  <p className="l1a-tr">Sırada: <b lang="de">Lektion 2</b>.</p>
  <div className="l1a-actions"><button type="button" className="btn secondary small" onClick={()=>onGo(stepIndexD('puanlar'))}>Puanlarım</button><button type="button" className="btn secondary small" onClick={()=>onPart('c',0)}>Teil C</button><button type="button" className="btn small" onClick={()=>onGo(-1)}>Lektion 1 içindekiler</button></div>
 </>;
}
