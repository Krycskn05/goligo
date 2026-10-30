'use client';
import {useMemo,useRef,useState,type KeyboardEvent,type ReactNode} from 'react';
import {ArrowRight,BookOpen,Check,Eye,EyeOff,Play,RotateCcw,Trash2} from 'lucide-react';
import {acceptsAnswer,type SayItem} from '@/lib/willkommen-course';
import type {Line} from '@/lib/willkommen-b-course';
import {
 stadtPictures,castA,personName,buildingWords,officeWords,officeVerbs,directionWords,directionSay,articleOf,
 houseFloors,roofSay,floorRule,floorSynonyms,needDialogue,mustForms,tasks,instructions,upDown,checkDialogue,
 esGibtRule,esGibtDialogue,askWhere,achWords,ichWords,longWords,longWordSay,officeBoard,schoolBoard,officeDialogue,schoolDialogue,
 matchPictures,buildWords,joinParts,buildSay,wohinLines,floorLines,boardLines,ramiLines,ramiSay,esGibtRows,esGibtSay,
 hearItems,achIchRows,orderSentences,orderSay,roleQuestions,testQuestionsA,isTurkishText,summaryLines,stepIndexA,lineGaps,
 type Word,type BoardRow,type ChoiceLine,type ChoiceGap,
} from '@/lib/stadt-course';
import {ProgressMeter} from './progress-ui';
import {TalkStep} from './talk-step';
import {talkScenarios} from '@/lib/talk-scenarios';
import {PaulHoca} from './paul-hoca';
import {Say,Note,Heading,Portrait,FeedbackLine,WordChoice,useSelfCheck,selfCheckNote,type SelfCheckResult,MatchExercise,OrderExercise,ChoiceRows,TestStep,shuffle,mixedOrder,useInnerNext,readRun,useRunSave,type Speech,type StepProps,type Feedback} from './willkommen-ui';

/**
 * Lektion 15 „Wege in der Stadt“, Teil A – Gehen Sie die Treppe hoch. (the learner's lesson page, 30 October 2026):
 * the steps. The page around them (notebook, tabs, pager, scores) is app/stadt-study.tsx; the texts are
 * lib/stadt-course.ts; the pieces shared with Lektion 1 come from app/willkommen-ui.tsx. Every person is read with
 * their own site voice (`who`): women by women's voices, men by men's.
 */
export function StepViewL15A(props:StepProps){
 const {step,speech}=props;
 switch(step.id){
  case 'kapak':return <CoverA {...props}/>;
  case 'kelimeler-bina':return <BuildingWords speech={speech}/>;
  case 'kelimeler-amt':return <OfficeWords speech={speech}/>;
  case 'kelimeler-yon':return <Directions speech={speech}/>;
  case 'katlar':return <Floors speech={speech}/>;
  case 'zum-zur':return <ZumZur speech={speech}/>;
  case 'yol-tarifi':return <Instructions speech={speech}/>;
  case 'es-gibt':return <EsGibt speech={speech}/>;
  case 'telaffuz':return <Phonetics speech={speech}/>;
  case 'diyalog-amt':return <DialogueStep speech={speech} kicker="Dialog · Im Bürgeramt" title="An der Information" picture={stadtPictures.office} alt="Yasemin danışma gişesinde; Omar gişenin arkasında merdiveni gösteriyor, solda asansör" lead="Yasemin Bürgeramt’ın girişinde. Danışmada Omar çalışıyor. Önce dinle, sonra çeviriyi gizleyip tekrar dinle." board={officeBoard} lines={officeDialogue}/>;
  case 'diyalog-okul':return <DialogueStep speech={speech} kicker="Dialog · In der Sprachschule" title="Am Eingang" picture={stadtPictures.school} alt="Mei dil okulunun girişinde, elinde kâğıt; Sabine önlüğüyle Sprachcafé kapısında yolu gösteriyor" lead="Mei dil okulunda ilk günü. Girişte Sabine’ye soruyor." board={schoolBoard} lines={schoolDialogue}/>;
  case 'eslestir':return <MatchExercise kicker="Alıştırma 1 · Was ist was?" title="Resmi kelimeyle eşleştir" lead="Önce soldan resme, sonra sağdan doğru kelimeye dokun." pairs={matchPictures} sayFor={i=>[matchPictures[i][1]]} {...props}/>;
  case 'kelime-kur':return <BuildExercise {...props}/>;
  case 'wohin':return <ChoiceExercise kicker="Alıştırma 3 · Wohin müssen die Personen gehen?" title="Kim nereye gitmeli?" lead="Her satırı seçerek tamamla. Satır doğru olunca cümle okunur." lines={wohinLines} {...props}/>;
  case 'katlar-yaz':return <FloorWriting {...props}/>;
  case 'pano':return <ChoiceExercise kicker="Alıştırma 5 · Wo ist …?" title="Panoyu oku" lead="Bürgeramt panosuna bak ve cevapları seç. Satır doğru olunca Omar’ın cevabı okunur." before={<Board board={officeBoard}/>} lines={boardLines} {...props}/>;
  case 'rami':return <RamiExercise {...props}/>;
  case 'einen-eine':return <EsGibtExercise {...props}/>;
  case 'dinle':return <HearExercise {...props}/>;
  case 'ach-ich':return <AchIchExercise {...props}/>;
  case 'sirala':return <OrderExercise kicker="Alıştırma 10 · Sätze bauen" title="Cümleyi kur" sentences={orderSentences} sayFor={orderSay} {...props}/>;
  case 'rollenspiel':return <RoleExercise {...props}/>;
  case 'test':return <TestStep label="Lektion 15A · Test" questions={testQuestionsA} sayFor={i=>testQuestionsA[i][3]} listen={i=>testQuestionsA[i][4]} langOf={text=>isTurkishText(text)?'tr':'de'} {...props}/>;
  case 'konus':return <TalkStep scenario={talkScenarios.l15a} {...props}/>;
  case 'ozet':return <EndA {...props}/>;
 }
 return null;
}

/* ---------- small pieces ---------- */
const lineSay=(line:Line):SayItem=>({text:line.say??line.de,who:line.who});
/** der, die and das in their colours (blue, red, green), the rest of the word as it is. */
function Art({de}:{de:string}){const article=articleOf(de);return article?<><span className={'l15-'+article}>{article}</span>{de.slice(article.length)}</>:<>{de}</>;}
function Legend(){return <p className="l15-legend"><span className="l15-der">der = eril</span><span className="l15-die">die = dişil</span><span className="l15-das">das = nötr</span></p>;}
function Picture({src,width,height,alt}:{src:string;width:number;height:number;alt:string}){
 return <img className="l1a-cover l1a-scene l15-scene" src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async"/>;
}
/** Words with emoji, article colour, plural, meaning and example; the listen button reads the word with its article. */
function WordRows({words,speech}:{words:readonly Word[];speech:Speech}){
 return <ul className="l15-words">{words.map(word=><li className="l15-word" key={word.de}>
  <span className="l15-emoji" aria-hidden="true">{word.emoji}</span>
  <span className="l15-word-text">
   <span className="l1a-de" lang="de"><Art de={word.de}/></span>
   {word.plural&&<span className="l15-plural">Çoğul: <span lang="de">{word.plural}</span></span>}
   <span className="l15-word-tr">{word.tr}</span>
   {word.example&&<span className="l15-example" lang="de">{word.example}</span>}
  </span>
  <Say text={word.de} speech={speech}/>
 </li>)}</ul>;
}
/** One German line with its meaning and a listen button (`who` reads it with that person's voice). */
function PhraseRow({de,tr,who,speech,emoji}:{de:string;tr?:ReactNode;who?:string;speech:Speech;emoji?:string}){
 return <div className="l1a-phrase">{emoji&&<span className="l15-emoji" aria-hidden="true">{emoji}</span>}<div className="l1a-phrase-text"><span className="l1a-de" lang="de" dir="ltr">{de}</span>{tr&&<span className="l1a-tr">{tr}</span>}</div><Say text={de} who={who} speech={speech}/></div>;
}
/** A dialogue: portrait, name, German and Turkish per line; "Tümünü dinle" reads it as a conversation and the
 * translation can be hidden to listen again (the learner's page). `actions={false}` for a two-line example. */
function Conversation({lines,speech,actions=true}:{lines:readonly Line[];speech:Speech;actions?:boolean}){
 const [hidden,setHidden]=useState(false);const first=lines[0]?.who;
 return <>
  <div className={'l1a-dialogue'+(hidden?' l15-hide-tr':'')}>{lines.map((line,i)=><div className={'l1a-line '+(line.who===first?'a':'b')} key={i}>
   <Portrait who={line.who} name={personName(line.who)}/>
   <div className="l1a-bubble"><span className="l15-name">{personName(line.who)}</span><span className="l1a-de" lang="de" dir="ltr">{line.de}</span><span className="l1a-tr">{line.tr}</span></div>
   <Say text={line.say??line.de} who={line.who} speech={speech}/>
  </div>)}</div>
  {actions&&<div className="l1a-actions">
   <button type="button" className="btn secondary small" disabled={speech.busy} onClick={()=>speech.speakAll(lines.map(lineSay))}><Play size={16} aria-hidden="true"/>Tümünü dinle</button>
   <button type="button" className="btn secondary small" aria-pressed={hidden} onClick={()=>setHidden(!hidden)}>{hidden?<Eye size={16} aria-hidden="true"/>:<EyeOff size={16} aria-hidden="true"/>}{hidden?'Çeviriyi göster':'Çeviriyi gizle'}</button>
  </div>}
 </>;
}
/** An information board in a building: floor, rooms on the left (←) and on the right (→). */
function Board({board}:{board:{title:string;rows:readonly BoardRow[];foot?:string}}){
 return <figure className="l15-board" lang="de" dir="ltr">
  <figcaption className="l15-board-head"><span>INFORMATION</span><b>{board.title}</b></figcaption>
  {board.rows.map(([floor,left,right,tag])=><div className="l15-board-row" key={floor}>
   <span className="l15-board-floor">{floor}{tag&&<small>{tag}</small>}</span>
   <span className="l15-board-side"><span className="lk-visually-hidden" lang="tr">Sol: </span>{left.map(room=><span key={room}><span className="l15-board-arrow" aria-hidden="true">←</span> {room}</span>)}</span>
   <span className="l15-board-side l15-board-end"><span className="lk-visually-hidden" lang="tr">Sağ: </span>{right.map(room=><span key={room}>{room} <span className="l15-board-arrow" aria-hidden="true">→</span></span>)}</span>
  </div>)}
  {board.foot&&<p className="l15-board-foot">{board.foot}</p>}
 </figure>;
}
/** A grid of short rules (left: the form, right: what it means). */
function Rule({rows}:{rows:readonly (readonly [ReactNode,ReactNode])[]}){
 return <dl className="l15-rule">{rows.map(([term,meaning],i)=><div key={i}><dt>{term}</dt><dd>{meaning}</dd></div>)}</dl>;
}

/* ---------- teaching steps ---------- */
function CoverA({progress,scores}:StepProps){
 const started=Object.keys(scores).length>0;
 return <>
  <p className="kicker" lang="de">Lektion 15 · Wege in der Stadt</p>
  <Heading><span lang="de">A — Gehen Sie die Treppe hoch.</span></Heading>
  {/* The cover picture is on the notebook's left page, like Lektion 1. */}
  <p>Yasemin yeni dairesini kaydettirmek için <b lang="de">Bürgeramt</b>’a gidiyor. Bina büyük: Hangi kat? Sağa mı, sola mı?</p>
  <p>Bu bölümde öğreneceklerin:</p>
  <ul className="l1a-list">
   <li>Bir binada yol tarifini <b>anlamak</b> ve <b>vermek</b></li>
   <li>Danışmada (<span lang="de">Information</span>) soru sormak</li>
   <li>Katları söylemek: <i lang="de">im Erdgeschoss, im ersten Stock …</i></li>
   <li>Hangi daireye? <b lang="de">zum / zur</b> + <b lang="de">müssen</b></li>
   <li><b lang="de">es gibt</b> + Akkusativ: <i lang="de">Gibt es hier einen Aufzug?</i></li>
   <li>Telaffuz: Ach-Laut ve Ich-Laut, uzun kelimeler</li>
  </ul>
  <h2 className="l1a-h2">Bu dersteki kişiler</h2>
  <ul className="l15-cast">{castA.map(key=><li key={key}><Portrait who={key} name={personName(key)}/><span>{personName(key)}</span></li>)}</ul>
  <p className="l1a-mini">Her kişinin kendi sesi var: kadınları kadın sesi, erkekleri erkek sesi okur.</p>
  {started&&<ProgressMeter progress={progress} language={'tr'} label="Lektion 15A"/>}
 </>;
}
function BuildingWords({speech}:{speech:Speech}){
 return <><p className="kicker" lang="de">Wortschatz · Binada</p><Heading><span lang="de">Im Gebäude</span></Heading>
  <Picture {...stadtPictures.building} alt="Bina içi: asansör, bekleme koltukları, merdiven ve danışma masası"/>
  <Legend/>
  <WordRows words={buildingWords} speech={speech}/></>;
}
function OfficeWords({speech}:{speech:Speech}){
 return <><p className="kicker" lang="de">Wortschatz · Resmî işler</p><Heading><span lang="de">Im Amt</span></Heading>
  <p className="l1a-tr">Berlin’de bu işler için <b lang="de">Bürgeramt</b>’a, <b lang="de">Ausländerbehörde</b>’ye veya <b lang="de">Führerscheinstelle</b>’ye gidilir.</p>
  <Legend/>
  <WordRows words={officeWords} speech={speech}/>
  <h2 className="l1a-h2">Fiiller</h2>
  {officeVerbs.map(([de,tr,example])=><div className="l1a-phrase" key={de}><div className="l1a-phrase-text"><span className="l1a-de" lang="de">{de}</span><span className="l1a-tr">{tr}</span><span className="l15-example" lang="de">{example}</span></div><Say text={example} speech={speech}/></div>)}
  <Note><b lang="de">ab|holen, an|melden, ab|melden, hoch|gehen</b> ayrılabilen fiillerdir: <i lang="de">Ich <b>hole</b> meinen Ausweis <b>ab</b>.</i> — <i lang="de">Gehen Sie die Treppe <b>hoch</b>.</i></Note></>;
}
function Directions({speech}:{speech:Speech}){
 return <><p className="kicker" lang="de">Wortschatz · Yön</p><Heading><span lang="de">Wo? Wohin?</span></Heading>
  {directionWords.map(row=>{const [emoji,de,tr,example]=row;return <div className="l1a-phrase" key={de}><span className="l15-emoji" aria-hidden="true">{emoji}</span><div className="l1a-phrase-text"><span className="l1a-de" lang="de">{de}</span><span className="l1a-tr">{tr}</span>{example&&<span className="l15-example" lang="de">{example}</span>}</div><Say text={directionSay(row)} speech={speech}/></div>;})}
  <Note><b lang="de">links</b> = solda (<span lang="de">Wo?</span> Nerede?) · <b lang="de">nach links</b> = sola (<span lang="de">Wohin?</span> Nereye?)<br/><i lang="de">Der Aufzug ist links.</i> — <i lang="de">Gehen Sie nach links.</i></Note></>;
}
/** The floors of a house: tap a floor (or the roof) to hear it. */
function House({speech}:{speech:Speech}){
 const [on,setOn]=useState<string|null>(null);
 const tap=(label:string)=>{setOn(label);speech.speak(label);};
 const keys=(label:string)=>(event:KeyboardEvent)=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();tap(label);}};
 return <svg className="l15-house" viewBox="0 0 340 304" role="group" aria-label="Bina katları: dinlemek için bir kata dokun">
  <rect className="l15-earth" x="0" y="260" width="340" height="44"/>
  <polygon className="l15-roof" points="16,56 84,14 152,56"/>
  <g className={'l15-floor'+(on===roofSay?' on':'')} role="button" tabIndex={0} aria-label={roofSay} onClick={()=>tap(roofSay)} onKeyDown={keys(roofSay)}>
   <rect className="l15-hit" x="150" y="22" width="180" height="26"/><text className="l15-floor-label" x="158" y="40" lang="de">{roofSay}</text>
  </g>
  {houseFloors.map(([short,label],i)=>{const y=56+i*34;return <g key={label} className={'l15-floor'+(on===label?' on':'')} role="button" tabIndex={0} aria-label={label} onClick={()=>tap(label)} onKeyDown={keys(label)}>
   <rect x="24" y={y} width="120" height="34" rx="3"/><rect className="l15-hit" x="150" y={y+4} width="180" height="26"/>
   <text className="l15-floor-short" x="84" y={y+22} textAnchor="middle">{short}</text><text className="l15-floor-label" x="158" y={y+22} lang="de">{label}</text>
  </g>;})}
  <line className="l15-ground" x1="0" y1="260" x2="340" y2="260"/>
  <circle className="l15-tree" cx="300" cy="232" r="16"/><rect className="l15-trunk" x="297" y="244" width="6" height="16"/>
 </svg>;
}
function Floors({speech}:{speech:Speech}){
 return <><p className="kicker" lang="de">Konu 1 · Stockwerke</p><Heading><span lang="de">Im wievielten Stock?</span></Heading>
  <p className="l1a-tr">Bir kata dokun, Almancasını dinle.</p>
  <House speech={speech}/>
  <Rule rows={[
   [<b key="eg">EG</b>,<><i lang="de">das Erdgeschoss</i> = zemin kat → <b lang="de">im Erdgeschoss</b></>],
   [<b key="og">1. OG</b>,<><i lang="de">der erste Stock</i> = 1. kat → <b lang="de">im ersten Stock</b></>],
   [<b key="ug">UG</b>,<><i lang="de">der Keller / das Untergeschoss</i> = bodrum → <b lang="de">im Keller</b></>],
  ]}/>
  <h2 className="l1a-h2">Kural: <span lang="de">im</span> + sıra sayısı + <span lang="de">-en</span></h2>
  <table className="l1a-table"><thead><tr><th>Kat</th><th><span lang="de">Wo?</span> (Nerede?)</th><th/></tr></thead>
   <tbody>{floorRule.map(([floor,de,irregular])=><tr key={floor}><td><b>{floor}</b></td><td><span className="l1a-de" lang="de">{de}{irregular&&<span className="l15-irregular" title="Düzensiz"> ⚠️</span>}</span></td><td><Say text={de} speech={speech}/></td></tr>)}</tbody></table>
  <p className="l15-warn">⚠️ Düzensiz: <b lang="de">erst</b>- (1), <b lang="de">dritt</b>- (3), <b lang="de">siebt</b>- (7). Diğerleri düzenli: <span lang="de">zwei → <b>zweit</b>-, vier → <b>viert</b>-</span>.</p>
  <h2 className="l1a-h2">Aynı anlam, farklı kelime</h2>
  <ul className="l15-same" lang="de">{floorSynonyms.map(text=><li key={text}>= {text}</li>)}</ul>
  <Note><b>Türkçe ile karşılaştır:</b> Almancada da zemin kat sayılmaz. <i lang="de">Der erste Stock</i> = 1. kat, tıpkı Türkçedeki gibi. (Amerikan İngilizcesinde ise zemin kat “1st floor”dur.) Çatıda: <b lang="de">auf dem Dach</b>.</Note></>;
}
function ZumZur({speech}:{speech:Speech}){
 return <><p className="kicker" lang="de">Konu 2 · Wohin müssen Sie gehen?</p><Heading>Nereye gitmeniz gerekiyor?</Heading>
  <Conversation lines={needDialogue} speech={speech} actions={false}/>
  <h2 className="l1a-h2">1) <span lang="de">müssen</span> + mastar sonda</h2>
  <Rule rows={mustForms.map(([person,form])=>[<span key={person} lang="de">{person}</span>,<b key={form} lang="de">{form}</b>] as const)}/>
  <p><i lang="de">Sie <b>muss</b> zur Ausländerbehörde <b>gehen</b>.</i> — Çekimli fiil 2. sırada, asıl fiil en sonda. <i lang="de">möchte</i> da aynı: <i lang="de">Ich <b>möchte</b> meinen Ausweis <b>abholen</b>.</i></p>
  <h2 className="l1a-h2">2) <span lang="de">zu</span> + artikel</h2>
  <Rule rows={[
   [<b key="der" className="l15-der" lang="de">der</b>,<span lang="de">zu + dem = <b>zum</b> → zum Schalter</span>],
   [<b key="das" className="l15-das" lang="de">das</b>,<span lang="de">zu + dem = <b>zum</b> → zum Bürgerbüro</span>],
   [<b key="die" className="l15-die" lang="de">die</b>,<span lang="de">zu + der = <b>zur</b> → zur Information</span>],
   [<b key="pl">Çoğul</b>,<span lang="de">zu + den → <b>zu den</b> Fotoautomaten</span>],
  ]}/>
  <h2 className="l1a-h2">Hangi iş, hangi yer?</h2>
  <table className="l1a-table l15-tasks"><thead><tr><th lang="de">Ich möchte …</th><th lang="de">Dann müssen Sie …</th></tr></thead>
   <tbody>{tasks.map(([de,tr,place])=><tr key={de}><td><span lang="de">{de}</span><br/><span className="l1a-mini">{tr}</span></td><td lang="de"><b>{place}</b> gehen</td></tr>)}</tbody></table></>;
}
function Instructions({speech}:{speech:Speech}){
 return <><p className="kicker" lang="de">Konu 3 · Wegbeschreibung</p><Heading><span lang="de">Gehen Sie …!</span></Heading>
  <p><b lang="de">Sie</b> ile kibar talimat (Imperativ): <b>fiil başa</b>, sonra <b lang="de">Sie</b>.</p>
  {instructions.map(([de,tr])=><PhraseRow key={de} de={de} tr={tr} who="omar" emoji="👉" speech={speech}/>)}
  <Note><b lang="de">hochgehen</b> ayrılabilir: <i lang="de"><b>Gehen</b> Sie die Treppe <b>hoch</b>.</i> “hoch” cümlenin sonuna gider. Cümle <i lang="de">Im dritten Stock</i> ile başlarsa fiil hemen arkadan gelir (2. pozisyon): <i lang="de">Im dritten Stock <b>gehen</b> Sie nach rechts.</i></Note>
  <h2 className="l1a-h2">Nerede? <span lang="de">oben / unten</span></h2>
  {upDown.map(([de,tr])=><PhraseRow key={de} de={de} tr={tr} speech={speech}/>)}
  <h2 className="l1a-h2">Anladığını kontrol et: <span lang="de">Also …</span></h2>
  <Conversation lines={checkDialogue} speech={speech} actions={false}/></>;
}
function EsGibt({speech}:{speech:Speech}){
 return <><p className="kicker" lang="de">Konu 4 · es gibt + Akkusativ</p><Heading><span lang="de">Gibt es hier …?</span></Heading>
  <p><b lang="de">es gibt</b> = var. <b lang="de">Gibt es hier …?</b> = Burada … var mı? Arkasından gelen isim <b>Akkusativ</b> olur.</p>
  {esGibtRule.map(([article,change,example])=><div className="l1a-phrase" key={example}><span className="l15-rule-art">{article?<b className={'l15-'+article} lang="de">{article}</b>:<b>Çoğul</b>}</span><div className="l1a-phrase-text"><span className="l1a-tr">→ <b lang={article?'de':'tr'}>{change}</b></span><span className="l1a-de" lang="de">{example}</span></div><Say text={example} speech={speech}/></div>)}
  <p className="l1a-mini">Sadece <b lang="de">der</b> değişir (<span lang="de">ein → einen</span>). <span lang="de">die</span> ve <span lang="de">das</span> aynı kalır.</p>
  <Conversation lines={esGibtDialogue} speech={speech} actions={false}/>
  <h2 className="l1a-h2"><span lang="de">Wo ist …?</span> mi, <span lang="de">Gibt es …?</span> mi?</h2>
  {askWhere.map(([de,tr])=><PhraseRow key={de} de={de} tr={tr} speech={speech}/>)}</>;
}
function Phonetics({speech}:{speech:Speech}){
 return <><p className="kicker" lang="de">Konu 5 · Phonetik</p><Heading>Ach-Laut ve Ich-Laut</Heading>
  <p>Almancada <b lang="de">ch</b> iki farklı okunur. Kural, <b>ch’den önceki harfe</b> bakar:</p>
  <Rule rows={[
   [<b key="ach" lang="de">a, o, u, au + ch</b>,<><b lang="de">Ach-Laut</b>: boğazın arkasından, hırıltılı “h” (Arapçadaki <i>hı</i> gibi).</>],
   [<b key="ich">diğer her yerde</b>,<><b lang="de">Ich-Laut</b>: yumuşak, damağa yakın; Türkçe “<i>hiç</i>” kelimesinin başındaki “h”ye benzer.</>],
  ]}/>
  <table className="l1a-table l15-sounds"><thead><tr><th colSpan={2} lang="de">Ach-Laut</th><th colSpan={2} lang="de">Ich-Laut</th></tr></thead>
   <tbody>{achWords.map((ach,i)=><tr key={ach}><td><span className="l1a-de" lang="de">{ach}</span></td><td><Say text={ach} speech={speech}/></td><td><span className="l1a-de" lang="de">{ichWords[i]}</span></td><td><Say text={ichWords[i]} speech={speech}/></td></tr>)}</tbody></table>
  <Note><b>Paul Hoca’nın ipucu:</b> Umlaut sesi değiştirir! <i lang="de">das B<b>u</b>ch</i> → Ach-Laut, <i lang="de">die B<b>ü</b>cher</i> → Ich-Laut. <i lang="de">die Spr<b>a</b>che</i> → Ach, <i lang="de">spr<b>e</b>chen</i> → Ich.</Note>
  <h2 className="l1a-h2">Uzun kelimeler: vurgu ilk parçada</h2>
  <p>Birleşik isimlerde vurgu <b>ilk parçadadır</b>, artikel ise <b>son parçadan</b> gelir.</p>
  <table className="l1a-table"><tbody>{longWords.map(row=>{const [article,stressed,rest,base]=row;return <tr key={stressed+rest}><td><span className="l1a-de" lang="de"><span className={'l15-'+article}>{article}</span> <span className="l15-stress">{stressed}</span>{rest}</span><span className="l1a-mini" lang="de">← {base}</span></td><td><Say text={longWordSay(row)} speech={speech}/></td></tr>;})}</tbody></table>
  <p className="l1a-mini">Kelimeyi dinle, hecelerde el çırp, vurgulu hecede biraz daha güçlü çırp.</p></>;
}
function DialogueStep({speech,kicker,title,picture,alt,lead,board,lines}:{speech:Speech;kicker:string;title:string;picture:{src:string;width:number;height:number};alt:string;lead:string;board:{title:string;rows:readonly BoardRow[];foot?:string};lines:readonly Line[]}){
 return <><p className="kicker" lang="de">{kicker}</p><Heading><span lang="de">{title}</span></Heading>
  <Picture {...picture} alt={alt}/>
  <p className="l1a-tr">{lead}</p>
  <Board board={board}/>
  <Conversation lines={lines} speech={speech}/></>;
}

/* ---------- exercises ---------- */
/**
 * Choices inside sentences (Alıştırma 3, 5 and 6): every gap is checked as soon as it is chosen (green or red, with the
 * site's sound); a finished line is read by its person (`say`). The score is the gaps right at the first choice, saved
 * once every gap is right. `dialogue` shows the lines as a conversation with portraits. The choices are always mixed (the
 * learner asked, 30 October 2026: in the written order they gave the answers away); a word box shared by every gap is mixed
 * once, the same in every gap and in the list above (`bankLead`).
 */
function ChoiceExercise(props:StepProps&{kicker:string;title:string;lead?:ReactNode;bankLead?:string;before?:ReactNode;lines:readonly ChoiceLine[];dialogue?:boolean;after?:(done:boolean)=>ReactNode}){
 const {kicker,title,bankLead,before,lines,dialogue=false,after,speech,sound,onScore,step}=props;
 const gaps=useMemo(()=>lines.flatMap((line,l)=>lineGaps(line).map((gap,g)=>({line:l,gap:g,options:gap.options,answer:gap.answer}))),[lines]);
 const mix=()=>{const shared=gaps.length>1&&gaps.every(gap=>gap.options===gaps[0].options);const bank=shared?mixedOrder(gaps[0].options,gaps.map(gap=>gap.answer)):null;return gaps.map(gap=>bank??shuffle(gap.options));};
 const [orders,setOrders]=useState(mix);
 const lead=bankLead&&orders.length?<>{bankLead} <i lang="de">{orders[0].join(' · ')}</i></>:props.lead;
 const [values,setValues]=useState<string[]>(()=>gaps.map(()=>''));
 const first=useRef<(boolean|null)[]>(gaps.map(()=>null));const scored=useRef(false);
 const [feedback,setFeedback]=useState<Feedback>(null);
 const indexOf=(l:number,g:number)=>gaps.findIndex(item=>item.line===l&&item.gap===g);
 const done=gaps.every((gap,i)=>values[i]===gap.answer);
 const choose=(i:number,value:string)=>{
  sound.prepare();speech.prepare();
  const next=values.slice();next[i]=value;setValues(next);if(!value){setFeedback(null);return;}
  const ok=value===gaps[i].answer;if(first.current[i]===null)first.current[i]=ok;
  const okAll=gaps.map((gap,j)=>next[j]===gap.answer);
  const line=lines[gaps[i].line];const lineDone=gaps.every((gap,j)=>gap.line!==gaps[i].line||okAll[j]);
  const right=first.current.filter(Boolean).length;
  if(okAll.every(Boolean)){
   setFeedback({ok:true,text:right===gaps.length?'Hepsi doğru!':`Hepsi doğru! İlk seçimde ${right} / ${gaps.length} doğruydu.`});
   if(!scored.current){scored.current=true;onScore(step.id,right,gaps.length);}
  }else if(next.every(Boolean))setFeedback({ok:false,text:`${okAll.filter(Boolean).length} / ${gaps.length} doğru — kırmızıları düzelt.`});
  else setFeedback(null);
  if(!ok)sound.wrong();else if(lineDone&&line.say){const say=line.say;sound.correct(()=>speech.speak(say));}else sound.correct();
 };
 const restart=()=>{setValues(gaps.map(()=>''));setOrders(mix());first.current=gaps.map(()=>null);scored.current=false;setFeedback(null);};
 // The words open under the gap like in Lektion 1 (the learner chose it, 30 October 2026, option B).
 const field=(l:number,g:number,gap:ChoiceGap)=>{const i=indexOf(l,g);const value=values[i];
  return <WordChoice key={'gap'+g} value={value} options={orders[i]} used={values.filter((_,k)=>k!==i)} state={!value?null:value===gap.answer} label={`Boşluk ${i+1}`} onChoose={word=>choose(i,word)}/>;};
 const text=(line:ChoiceLine,l:number)=>{let g=0;return line.parts.map((part,p)=>typeof part==='string'?<span key={p}>{part}</span>:field(l,g++,part));};
 const lineOk=(l:number)=>gaps.every((gap,i)=>gap.line!==l||values[i]===gap.answer);
 return <>
  <p className="kicker" lang="de">{kicker}</p><Heading>{title}</Heading>{lead&&<p className="l1a-tr">{lead}</p>}{before}
  {dialogue?<div className="l1a-dialogue l15-choice-dialogue">{lines.map((line,l)=>{const who=line.who??'';return <div className={'l1a-line '+(who===lines[0].who?'a':'b')} key={line.key}>
   <Portrait who={who} name={personName(who)}/>
   <div className="l1a-bubble"><span className="l15-name">{personName(who)}</span><span className="l1a-de l15-choice-text" lang="de" dir="ltr">{text(line,l)}</span></div>
  </div>;})}</div>
  :<div className="l15-choice-list">{lines.map((line,l)=><div className={'l15-choice-row'+(lineOk(l)?' done':'')} key={line.key}>
   {line.prompt&&<div className="l15-choice-prompt"><span className="l1a-de" lang="de" dir="ltr">{line.prompt}</span><Say text={line.prompt} who={line.promptWho} speech={speech}/></div>}
   <div className="l15-choice-text" lang="de" dir="ltr">{text(line,l)}{lineOk(l)&&<Check size={18} className="l15-row-ok" aria-label="Doğru"/>}</div>
  </div>)}</div>}
  <FeedbackLine feedback={feedback}/>
  {after?.(done)}
  <div className="l1a-actions"><button type="button" className="btn secondary small" onClick={restart}><RotateCcw size={16} aria-hidden="true"/>Baştan</button></div>
 </>;
}
/** Alıştırma 2 · build the long word from its parts, then choose its article (it comes from the last part). */
function BuildExercise(props:StepProps){
 const {speech,sound,onScore,step,runKey}=props;
 const makeChips=(r:number)=>{const item=buildWords[r];const others=shuffle(buildWords.filter((_,j)=>j!==r).flatMap(word=>word.parts).filter(part=>!item.parts.includes(part))).slice(0,3);return shuffle([...item.parts,...others]).map((part,i)=>({part,i}));};
 // Left in the middle, it goes on at its word (a finished word: at the next one).
 type Run={round:number;right:number;chips:{part:string;i:number}[];picked:number[];stage:'parts'|'article'|'done';wrongArticles:string[];missed:boolean};
 const [saved]=useState(()=>readRun<Run>(runKey,step.id,value=>{
  const round=Number(value.round),right=Number(value.right);if(!(round>=0&&round<buildWords.length)||!(right>=0&&right<=round+1))return null;
  const chips=Array.isArray(value.chips)?value.chips as Run['chips']:[];if(!buildWords[round].parts.every(part=>chips.some(chip=>chip.part===part)))return null;
  if(value.stage==='done')return round+1<buildWords.length?{round:round+1,right,chips:makeChips(round+1),picked:[],stage:'parts',wrongArticles:[],missed:false}:null;
  const stage=value.stage==='article'?'article':'parts';
  return {round,right,chips,picked:stage==='parts'&&Array.isArray(value.picked)?value.picked as number[]:[],stage,wrongArticles:Array.isArray(value.wrongArticles)?value.wrongArticles as string[]:[],missed:!!value.missed};
 }));
 const [round,setRound]=useState(saved?.round??0);const [chips,setChips]=useState(()=>saved?.chips??makeChips(0));
 const [picked,setPicked]=useState<number[]>(saved?.picked??[]);const [stage,setStage]=useState<'parts'|'article'|'done'>(saved?.stage??'parts');
 const [wrongParts,setWrongParts]=useState(false);const [wrongArticles,setWrongArticles]=useState<string[]>(saved?.wrongArticles??[]);
 const [right,setRight]=useState(saved?.right??0);const [over,setOver]=useState(false);const [feedback,setFeedback]=useState<Feedback>(null);
 const missed=useRef(saved?.missed??false);
 useRunSave(runKey,step.id,!over&&(round>0||picked.length>0||stage!=='parts')?{round,right,chips,picked,stage,wrongArticles,missed:missed.current}:null);
 const item=buildWords[round];const partOf=(i:number)=>chips.find(chip=>chip.i===i)?.part??'';
 const pick=(i:number)=>{
  if(stage!=='parts'||picked.includes(i)||picked.length>=item.parts.length)return;sound.prepare();speech.prepare();
  const next=[...picked,i];setPicked(next);
  if(next.length<item.parts.length)return;
  if(joinParts(next.map(partOf))===item.word){setStage('article');setWrongParts(false);setFeedback({ok:true,text:'Doğru! Şimdi artikeli seç.'});sound.correct();}
  else{missed.current=true;setWrongParts(true);setFeedback({ok:false,text:'Sıra yanlış. Sil ve tekrar dene.'});sound.wrong();}
 };
 const remove=()=>{setPicked(picked.slice(0,-1));setWrongParts(false);setFeedback(null);};
 const choose=(article:string)=>{
  if(stage!=='article'||wrongArticles.includes(article))return;sound.prepare();speech.prepare();
  if(article!==item.article){missed.current=true;setWrongArticles([...wrongArticles,article]);setFeedback({ok:false,text:'Son parçaya bak: '+item.parts[item.parts.length-1]});sound.wrong();return;}
  const total=right+(missed.current?0:1);setRight(total);setStage('done');
  const last=round===buildWords.length-1;
  setFeedback({ok:true,text:last?`Hepsi tamam! ${total} / ${buildWords.length} kelime ilk denemede doğru.`:'Doğru!'});
  sound.correct(()=>speech.speak(buildSay(item)));
  if(last){setOver(true);onScore(step.id,total,buildWords.length);}
 };
 const open=(r:number)=>{setRound(r);setChips(makeChips(r));setPicked([]);setStage('parts');setWrongParts(false);setWrongArticles([]);setFeedback(null);missed.current=false;};
 const restart=()=>{setRight(0);setOver(false);open(0);};
 // İleri at the bottom opens the next word once this one is built (the learner asked, 30 October 2026: it went on to the
 // next exercise); a tap by mistake loses nothing. After the last word İleri opens the next step.
 useInnerNext(props.setInnerNext,()=>{
  if(over)return false;
  if(stage==='done'){open(round+1);return true;}
  setFeedback({ok:false,text:'Önce kelimeyi kur.'});return true;
 });
 return <>
  <p className="kicker" lang="de">Alıştırma 2 · Bilden Sie Wörter</p><Heading>Kelimeyi kur</Heading>
  <p className="l1a-tr">Parçalara sırayla dokun, sonra artikeli seç. İpucu: artikel son parçadan gelir.</p>
  <p className="l1a-mini">Kelime {round+1} / {buildWords.length}</p>
  <p className="l1a-question">{item.tr}</p>
  <div className={'l1a-answer'+(stage!=='parts'?' ok':wrongParts?' bad':'')} lang="de" dir="ltr" aria-live="polite">{stage==='done'?<Art de={buildSay(item)}/>:stage==='article'?item.word:picked.map(partOf).join(' + ')}</div>
  {stage==='parts'&&<div className="l1a-chips">{chips.map(chip=><button type="button" key={chip.i} className="l1a-chip" lang="de" dir="ltr" disabled={picked.includes(chip.i)} onClick={()=>pick(chip.i)}>{chip.part}</button>)}</div>}
  {stage!=='parts'&&<div className="l1a-opts l15-articles" role="group" aria-label="Artikel">{(['der','die','das'] as const).map(article=><button type="button" key={article} className={'l1a-opt l15-'+article+(stage==='done'&&article===item.article?' ok':wrongArticles.includes(article)?' bad':'')} disabled={stage==='done'||wrongArticles.includes(article)} lang="de" onClick={()=>choose(article)}>{article}</button>)}</div>}
  <FeedbackLine feedback={feedback}/>
  <div className="l1a-actions">
   {stage==='parts'&&<button type="button" className="btn secondary small" disabled={!picked.length} onClick={remove}><Trash2 size={16} aria-hidden="true"/>Sil</button>}
   {stage==='done'&&!over&&<button type="button" className="btn small" onClick={()=>open(round+1)}>Sonraki<ArrowRight size={16} className="vault-direction-icon" aria-hidden="true"/></button>}
   {(over||round>0)&&<button type="button" className="btn secondary small" onClick={restart}><RotateCcw size={16} aria-hidden="true"/>Baştan</button>}
  </div>
 </>;
}
/** Alıştırma 4 · write the floor: a right answer turns green at once and is read; a wrong one turns red when the learner
 * leaves the box, with the right answer next to it (no "Kontrol et", 30 October 2026). The score counts the first tries. */
function FloorWriting(props:StepProps){
 const {speech,sound,onScore,step}=props;
 const [feedback,setFeedback]=useState<Feedback>(null);
 const refs=useRef<(HTMLInputElement|null)[]>([]);const spoken=useRef<boolean[]>(floorLines.map(()=>false));
 const total=floorLines.length;
 const self=useSelfCheck(total,(i,value)=>acceptsAnswer(value,floorLines[i][1]),firstRight=>{
  onScore(step.id,firstRight,total);setFeedback({ok:true,text:firstRight===total?'Hepsi doğru!':`Hepsi doğru! İlk denemede ${firstRight} / ${total} doğruydu.`});
 });
 const note=(result:SelfCheckResult)=>selfCheckNote(result,self,'Kırmızıyı düzelt; doğrusu yanında yazıyor.',setFeedback);
 const change=(i:number,value:string)=>{
  sound.prepare();speech.prepare();const result=self.change(i,value);note(result);
  if(result!=='right'||spoken.current[i])return;
  spoken.current[i]=true;const said=floorLines[i][1].find(answer=>acceptsAnswer(value,[answer]))??floorLines[i][1][0];
  sound.correct(()=>speech.speak(said));
 };
 const focusNext=(i:number)=>{const target=floorLines.findIndex((_,k)=>k>i&&self.stateNow(k)!==true);if(target>=0)refs.current[target]?.focus();};
 const restart=()=>{self.reset();setFeedback(null);spoken.current=floorLines.map(()=>false);};
 return <>
  <p className="kicker" lang="de">Alıştırma 4 · Wo? Ergänzen Sie.</p><Heading>Katları yaz</Heading>
  <p className="l1a-tr">Doğru yazınca kutu hemen yeşil olur ve okunur. (ü yerine ue de yazabilirsin.)</p>
  {floorLines.map(([floor,answers],i)=>{const state=self.state[i]===true?' ok':self.state[i]===false?' bad':'';return <div className="l1a-arow l15-floor-row" key={floor}>
   <b className="l15-floor-tag">{floor}</b>
   <span className="l1a-gap-wrap l15-floor-field"><input ref={element=>{refs.current[i]=element;}} className={'l1a-gap wide'+state} value={self.values[i]} lang="de" dir="ltr" autoCapitalize="off" autoComplete="off" spellCheck={false} placeholder={i===0?'im …':''} aria-label={floor} enterKeyHint="next"
    onChange={event=>change(i,event.target.value)} onBlur={()=>note(self.leave(i))} onKeyDown={event=>{if(event.key==='Enter'){event.preventDefault();note(self.leave(i));focusNext(i);}}}/>{self.hinted[i]&&self.state[i]!==true&&<span className="l1a-hint" lang="de">→ {answers[0]}</span>}</span>
  </div>;})}
  <FeedbackLine feedback={feedback}/>
  <div className="l1a-actions"><button type="button" className="btn secondary small" onClick={restart}><RotateCcw size={16} aria-hidden="true"/>Baştan</button></div>
 </>;
}
/** Alıştırma 6 · Rami at the Bürgeramt: the words of the box into the dialogue, then listen to it. */
function RamiExercise(props:StepProps){
 const {speech}=props;
 return <ChoiceExercise kicker="Alıştırma 6 · Was passt?" title="Rami Bürgeramt’ta" bankLead="Kutudaki kelimeleri yerleştir:"
  before={<Picture {...stadtPictures.rami} alt="Rami danışmada, elinde vize evrakı; Omar soldaki asansörü gösteriyor"/>}
  lines={ramiLines} dialogue
  after={done=><div className="l1a-actions"><button type="button" className="btn secondary small" disabled={!done||speech.busy} onClick={()=>speech.speakAll(ramiSay)}><Play size={16} aria-hidden="true"/>Tamamlanan diyaloğu dinle</button></div>}
  {...props}/>;
}
/** Alıştırma 7 · es gibt: einen, eine or ein? (the finished question is read by Mei). */
function EsGibtExercise(props:StepProps){
 const rows=esGibtRows.map(row=>({key:row[0],label:'Gibt es hier … '+row[0]+'?',before:<span className="l15-row-sentence" lang="de">Gibt es hier ___ <b>{row[0]}</b>? <span className="l1a-mini">(<span className={'l15-'+row[1]}>{row[1]}</span>)</span></span>,options:['einen','eine','ein'].map(value=>({value,label:value})),answer:row[2],say:esGibtSay(row)}));
 return <ChoiceRows kicker="Alıştırma 7 · es gibt + Akkusativ" title="einen, eine veya ein?" before={<p className="l1a-tr">Artikele bak: <span lang="de"><span className="l15-der">der</span> → einen · <span className="l15-die">die</span> → eine · <span className="l15-das">das</span> → ein</span></p>} rows={rows} {...props}/>;
}
/** Alıştırma 8 · listen: where is it? (the sentence shows after the answer). */
function HearExercise(props:StepProps){
 const {speech}=props;
 const [orders]=useState(()=>hearItems.map(item=>shuffle(item.options)));
 const rows=hearItems.map((item,i)=>({key:item.who,label:(i+1)+'. '+personName(item.who),optionLang:'tr',
  before:<div className="l1a-person l15-hear"><Portrait who={item.who} name={personName(item.who)}/><span className="l1a-de">{i+1}. {personName(item.who)}</span><Say text={item.text} who={item.who} speech={speech} wide secret/></div>,
  options:orders[i].map(option=>({value:option,label:option})),answer:item.options[0],
  reveal:<p className="l1a-mini">Metin: <span lang="de" dir="ltr">„{item.text}“</span></p>}));
 return <ChoiceRows kicker="Alıştırma 8 · Hören" title="Dinle: Nereye?" lead="Dinle ve doğru yeri seç. Cevaptan sonra cümle görünür." rows={rows} wide {...props}/>;
}
/** Alıştırma 9 · Ach-Laut or Ich-Laut? (the word is read after the answer). */
function AchIchExercise(props:StepProps){
 const {speech}=props;
 const rows=achIchRows.map(([word,answer])=>({key:word,label:word,before:<span className="l15-row-text"><span className="l1a-land" lang="de">{word}</span> <Say text={word} speech={speech}/></span>,options:[{value:'Ach',label:'Ach'},{value:'Ich',label:'Ich'}],answer,say:word as SayItem}));
 return <ChoiceRows kicker="Alıştırma 9 · Phonetik" title="Ach-Laut mı, Ich-Laut mı?" lead="Kelimeyi dinle, ch’den önceki harfe bak ve seç. (a, o, u, au + ch = Ach)" rows={rows} {...props}/>;
}
/** Alıştırma 11 · role play: the learner is Sabine; Mei asks, the school's board has the answer. */
function RoleExercise(props:StepProps){
 const {speech,sound,onScore,step,runKey}=props;
 // Left in the middle, it goes on at Mei's question (an answered one: at the next).
 type Run={round:number;right:number;options:string[];picked:string|null};
 const [saved]=useState(()=>readRun<Run>(runKey,step.id,value=>{
  const round=Number(value.round),right=Number(value.right);if(!(round>=0&&round<roleQuestions.length)||!(right>=0&&right<=round+1))return null;
  if(typeof value.picked==='string')return round+1<roleQuestions.length?{round:round+1,right,options:shuffle(roleQuestions[round+1].options),picked:null}:null;
  const options=Array.isArray(value.options)&&value.options.length===roleQuestions[round].options.length&&roleQuestions[round].options.every(o=>(value.options as string[]).includes(o))?value.options as string[]:shuffle(roleQuestions[round].options);
  return {round,right,options,picked:null};
 }));
 const [round,setRound]=useState(saved?.round??0);const [options,setOptions]=useState(()=>saved?.options??shuffle(roleQuestions[0].options));
 const [picked,setPicked]=useState<string|null>(null);const [right,setRight]=useState(saved?.right??0);const [over,setOver]=useState(false);const [wait,setWait]=useState(false);
 useRunSave(runKey,step.id,!over&&(round>0||picked!==null)?{round,right,options,picked}:null);
 const item=roleQuestions[round];const answer=item.options[0];
 const choose=(option:string)=>{
  if(picked!==null)return;sound.prepare();speech.prepare();setPicked(option);setWait(false);
  const ok=option===answer;const total=right+(ok?1:0);setRight(total);
  const after=()=>speech.speak({text:answer,who:'sabine'});if(ok)sound.correct(after);else sound.wrong(after);
  if(round===roleQuestions.length-1){setOver(true);onScore(step.id,total,roleQuestions.length);}
 };
 const next=()=>{const r=round+1;setRound(r);setOptions(shuffle(roleQuestions[r].options));setPicked(null);setWait(false);};
 const again=()=>{setRound(0);setOptions(shuffle(roleQuestions[0].options));setPicked(null);setRight(0);setOver(false);};
 // İleri at the bottom opens Mei's next question once this one is answered; after the last one the next step.
 useInnerNext(props.setInnerNext,()=>{
  if(over)return false;
  if(picked!==null){next();return true;}
  setWait(true);return true;
 });
 const feedback:Feedback=over?{ok:right===roleQuestions.length,text:right===roleQuestions.length?`Harika, Mei yolunu buldu! ${right} / ${roleQuestions.length}`:`${right} / ${roleQuestions.length} doğru`}:picked===null?(wait?{ok:false,text:'Önce bir cevap seç.'}:null):picked===answer?{ok:true,text:'Doğru!'}:{ok:false,text:'Panoya bir daha bak. Doğrusu yeşil olan.'};
 return <>
  <p className="kicker" lang="de">Alıştırma 11 · Rollenspiel</p><Heading>Sabine sensin!</Heading>
  <p className="l1a-tr">Mei girişte soru soruyor. Panoya bak ve doğru cevabı seç.</p>
  <Board board={schoolBoard}/>
  <p className="l1a-mini">Soru {round+1} / {roleQuestions.length}</p>
  <div className="l1a-dialogue">
   <div className="l1a-line a"><Portrait who="mei" name="Mei"/><div className="l1a-bubble"><span className="l15-name">Mei</span><span className="l1a-de" lang="de" dir="ltr">{item.question}</span></div><Say text={item.question} who="mei" speech={speech}/></div>
   {picked!==null&&<div className="l1a-line b"><Portrait who="sabine" name="Sabine"/><div className="l1a-bubble"><span className="l15-name">Sabine</span><span className="l1a-de" lang="de" dir="ltr">{answer}</span></div></div>}
  </div>
  <div className="l1a-opts column" role="group" aria-label={'Soru '+(round+1)}>{options.map(option=><button type="button" key={option} className={'l1a-opt'+(picked!==null&&option===answer?' ok':picked===option?' bad':'')} disabled={picked!==null||over} lang="de" dir="ltr" onClick={()=>choose(option)}>{option}</button>)}</div>
  <FeedbackLine feedback={feedback}/>
  <div className="l1a-actions">
   {picked!==null&&!over&&<button type="button" className="btn small" onClick={next}>Sonraki<ArrowRight size={16} className="vault-direction-icon" aria-hidden="true"/></button>}
   {over&&<button type="button" className="btn secondary small" onClick={again}><RotateCcw size={16} aria-hidden="true"/>Baştan</button>}
  </div>
 </>;
}
/** The end: the important sentences to learn by heart, a short summary and what comes next. */
function EndA({progress,onGo,speech}:StepProps){
 return <>
  <p className="kicker" lang="de">Zusammenfassung · Ezberle</p>
  <Heading>Lektion 15A tamam! 🎉</Heading>
  <PaulHoca pose="cheer" className="l1a-paul-big" sound="appear"/>
  <h2 className="l1a-h2">Önemli cümleler</h2>
  <p className="l1a-tr">Bu cümleleri yüksek sesle tekrar et. Bürgeramt’ta hepsi işine yarar.</p>
  <Conversation lines={summaryLines} speech={speech}/>
  <Note><b>Kısa özet:</b> <span lang="de">im + ersten / zweiten / dritten Stock</span> · <span lang="de">zum</span> (der / das) / <span lang="de">zur</span> (die) · <span lang="de">Gehen Sie …!</span> · <span lang="de">es gibt einen / eine / ein</span> · <span lang="de">a / o / u / au + ch</span> = Ach-Laut</Note>
  <ProgressMeter progress={progress} language={'tr'} label="Lektion 15A"/>
  <p className="l1a-tr">Sıradaki bölüm: <b lang="de">Teil B</b> · yakında.</p>
  <div className="l1a-actions">
   <button type="button" className="btn secondary small" onClick={()=>onGo(stepIndexA('eslestir'))}>Alıştırmaları tekrar yap</button>
   <button type="button" className="btn secondary small" onClick={()=>onGo(-1)}><BookOpen size={16} aria-hidden="true"/>Lektion 15 içindekiler</button>
  </div>
 </>;
}
