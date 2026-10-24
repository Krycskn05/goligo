'use client';
import {browserLanguage,rememberSiteLanguage} from '@/lib/device-language';
import {useCallback,useEffect,useMemo,useRef,useState,type ReactNode} from 'react';
import {ArrowLeft,ArrowRight,Check,Play,RotateCcw,Trash2,Volume2,X} from 'lucide-react';
import {SITE_NAME} from '@/lib/site-brand';
import {studyLanguages,isStudyLanguage,type StudyLanguage} from '@/lib/study-languages';
import {languageDirection} from '@/lib/site-languages';
import {c} from '@/lib/category-copy';
import {turkishNote} from '@/lib/ausbildung-course';
import {WILLKOMMEN_PATH,steps,stepIndex,greetings,namePhrases,originPhrases,countries,articleCountries,articleGroups,noArticleSay,verbForms,dialogue,people,personSpeech,greetingsAround,words,lettersExercise,matchPairs,orderSentences,gluedText,gluedSentences,gluedSay,articleOptions,articleRows,articleRowSpeech,listenItems,questionLines,questionSay,wordBox,boxLines,boxSay,ownPrompts,testQuestions,testSpeech,acceptsAnswer,normalizeLoose,willkommenPictures,portraitSrc,type GapLine,type Step} from '@/lib/willkommen-course';
import {L1A_STEP_KEY,readL1AScores,saveL1AScore,willkommenProgress,type L1AScoreMap} from '@/lib/willkommen-progress';
import {useLanguageSwitch} from './language-switch';
import {useAnswerSound,useGermanSpeech} from './study-shared';
import {SiteHeader} from './site-header';
import {SiteFooter} from './site-footer';
import {SiteMenuAside} from './site-menu';
import {ProgressMeter} from './progress-ui';
import {PaulHoca} from './paul-hoca';
import {GuestBanner} from './guest-taste';

/**
 * Lektion 1 „Willkommen!“, Teil A – Ich heiße … (the learner's own lesson page, 24 October 2026): 22 steps, one at
 * a time — the cover, ten short teaching steps, nine exercises, a test and the end. German is read with the site
 * voices; answers get the site's sounds and Paul; scores stay in the browser (lib/willkommen-progress.ts).
 */
export default function WillkommenStudy({guest=false}:{guest?:boolean}){
 const [language,setLanguage]=useState<StudyLanguage>('de');const [loaded,setLoaded]=useState(false);
 const switchLanguage=useLanguageSwitch(setLanguage);
 useEffect(()=>{switchLanguage(browserLanguage(),()=>setLoaded(true));},[switchLanguage]);
 useEffect(()=>{if(!loaded)return;document.documentElement.lang=language;document.documentElement.dir=languageDirection(language);document.title='Lektion 1A · Willkommen! · '+SITE_NAME;rememberSiteLanguage(language);},[language,loaded]);
 if(!loaded)return <div className="course-loading" role="status">{SITE_NAME}…</div>;
 return <WillkommenLesson language={language} onLanguage={switchLanguage} guest={guest}/>;
}

/** Site speech plus "read these one after the other" (dialogues, the learner's own sentences). */
type Speech={speak:(text:string)=>void;speakAll:(texts:string[])=>void;busy:boolean;activeText?:string;stop:()=>void;prepare:()=>void};
function useLessonSpeech():Speech&{warning?:string}{
 const german=useGermanSpeech('de');const {speak,busy,activeText,stop,prepare,warning}=german;
 const queue=useRef<string[]>([]);const waiting=useRef<ReturnType<typeof setTimeout>|null>(null);
 const next=useCallback(()=>{
  const text=queue.current.shift();if(!text)return;
  speak(text);
  // If the voice never starts (no sound support), go on after a moment so the queue never sticks.
  waiting.current=setTimeout(()=>{waiting.current=null;if(!busyRef.current)next();},1500);
 },[speak]);
 const busyRef=useRef(busy);
 useEffect(()=>{const was=busyRef.current;busyRef.current=busy;if(busy&&waiting.current){clearTimeout(waiting.current);waiting.current=null;}if(was&&!busy)next();},[busy,next]);
 const speakAll=useCallback((texts:string[])=>{stop();queue.current=texts.filter(Boolean);next();},[stop,next]);
 const speakOne=useCallback((text:string)=>{queue.current=[];speak(text);},[speak]);
 const stopAll=useCallback(()=>{queue.current=[];if(waiting.current){clearTimeout(waiting.current);waiting.current=null;}stop();},[stop]);
 useEffect(()=>()=>{if(waiting.current)clearTimeout(waiting.current);},[]);
 return useMemo(()=>({speak:speakOne,speakAll,busy,activeText,stop:stopAll,prepare,warning}),[speakOne,speakAll,busy,activeText,stopAll,prepare,warning]);
}

function readStep():number{
 const params=new URLSearchParams(window.location.search);const fromUrl=stepIndex(params.get('adim')??'');
 if(fromUrl>=0)return fromUrl;
 try{const saved=stepIndex(localStorage.getItem(L1A_STEP_KEY)??'');return saved>=0?saved:0;}catch{return 0;}
}

function WillkommenLesson({language,onLanguage,guest}:{language:StudyLanguage;onLanguage:(value:StudyLanguage)=>void;guest:boolean}){
 const [index,setIndex]=useState(0);const [scores,setScores]=useState<L1AScoreMap>({});
 const speech=useLessonSpeech();const sound=useAnswerSound();
 useEffect(()=>{setIndex(readStep());setScores(readL1AScores());const pop=()=>setIndex(readStep());window.addEventListener('popstate',pop);return()=>window.removeEventListener('popstate',pop);},[]);
 const go=useCallback((next:number)=>{
  const target=Math.max(0,Math.min(steps.length-1,next));speech.stop();sound.stop();setIndex(target);
  try{localStorage.setItem(L1A_STEP_KEY,steps[target].id);}catch{}
  try{const url=new URL(window.location.href);if(target===0)url.searchParams.delete('adim');else url.searchParams.set('adim',steps[target].id);window.history.pushState(null,'',url);}catch{}
  requestAnimationFrame(()=>{window.scrollTo({top:0,behavior:'instant'});document.getElementById('l1a-heading')?.focus({preventScroll:true});});
 },[speech,sound]);
 const score=useCallback((id:string,right:number,total:number)=>setScores(saveL1AScore(id,right,total)),[]);
 const step=steps[index];const progress=willkommenProgress(scores);
 const dir=languageDirection(language);
 return <div className="category-app toon-app housing-app l12-app l1a-app" lang={language} dir={dir}>
  <a className="skip-link" href="#l1a-main">{c(language,'catalogTitle')}</a>
  <SiteHeader language={language} languages={studyLanguages} onLanguage={value=>{if(isStudyLanguage(value)){speech.stop();onLanguage(value);}}} homeHref="/konular?level=A1.1" homeLabel={c(language,'catalogTitle')} guest={guest}/>
  <div className="work-layout site-layout"><SiteMenuAside language={language} current="units"/>
  <main id="l1a-main" className="object-page housing-page l1a-page" lang={language} dir={dir}>
   <div className="object-breadcrumb"><a href="/konular?level=A1.1">A1.1</a><span aria-hidden="true">›</span><span lang="de">Lektion 1 · Willkommen!</span><span aria-hidden="true">›</span><span lang="de">Teil A</span></div>
   {guest&&<GuestBanner language={language} back={WILLKOMMEN_PATH}/>}
   {language!=='tr'&&turkishNote[language]&&<p className="object-alert l12-language-note" lang={language} dir={dir}>{turkishNote[language]}</p>}
   {speech.warning&&<p className="object-alert" role="status">{speech.warning}</p>}
   <section className="panel l1a-card" aria-labelledby="l1a-heading" data-l1a-step={step.id}>
    <header className="l1a-top">
     <div className="l1a-top-row"><span className="eyebrow" lang="de">A1.1 · Lektion 1A</span><span className="l1a-where">{step.title} · {index+1}/{steps.length}</span></div>
     <div className="l1a-bar" role="progressbar" aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={index+1} aria-label={step.title}><i style={{width:((index+1)/steps.length*100)+'%'}}/></div>
    </header>
    <StepView step={step} speech={speech} sound={sound} scores={scores} progress={progress} onScore={score} onGo={go} language={language}/>
    <nav className="l1a-pager" aria-label="Adımlar">
     <button type="button" className="btn secondary" disabled={index===0} onClick={()=>go(index-1)}><ArrowLeft size={18} className="vault-direction-icon" aria-hidden="true"/>Geri</button>
     <button type="button" className="btn" onClick={()=>go(index===steps.length-1?0:index+1)}>{index===steps.length-1?<><RotateCcw size={18} aria-hidden="true"/>Başa dön</>:<>İleri<ArrowRight size={18} className="vault-direction-icon" aria-hidden="true"/></>}</button>
    </nav>
   </section>
  </main></div>
  <SiteFooter language={language}/>
 </div>;
}

type Sound=ReturnType<typeof useAnswerSound>;
type StepProps={step:Step;speech:Speech;sound:Sound;scores:L1AScoreMap;progress:ReturnType<typeof willkommenProgress>;onScore:(id:string,right:number,total:number)=>void;onGo:(index:number)=>void;language:StudyLanguage};
function StepView(props:StepProps){
 const {step}=props;
 switch(step.id){
  case 'kapak':return <Cover {...props}/>;
  case 'selam':return <Teach title="Selamlaşma" speech={props.speech} phrases={greetings} note={<><b lang="de">Guten Tag</b> resmî selamdır, gün boyu kullanılır. Arkadaşlar arasında <b lang="de">Hallo!</b> denir. Biri sana <b lang="de">Herzlich willkommen!</b> derse cevabın: <b lang="de">Danke!</b></>}/>;
  case 'ad':return <Names speech={props.speech}/>;
  case 'nereden':return <Origin speech={props.speech}/>;
  case 'ulkeler':return <Countries speech={props.speech}/>;
  case 'artikel':return <ArticleRule speech={props.speech}/>;
  case 'fiiller':return <Verbs speech={props.speech}/>;
  case 'diyalog':return <Dialogue speech={props.speech}/>;
  case 'kisiler':return <People speech={props.speech}/>;
  case 'diller':return <Languages/>;
  case 'kelimeler':return <WordList speech={props.speech}/>;
  case 'harfler':return <GapExercise key={step.id} id={step.id} kicker="Alıştırma 1 · Ergänzen Sie" title="Eksik harfleri tamamla" lines={lettersExercise.lines} say={lettersExercise.say} {...props}/>;
  case 'eslestir':return <MatchExercise key={step.id} {...props}/>;
  case 'sirala':return <OrderExercise key={step.id} {...props}/>;
  case 'ayir':return <GapExercise key={step.id} id={step.id} kicker="Alıştırma 4 · Markieren Sie" title="Kelimeleri ayır, cümleleri yaz" lead="Bu metinde boşluk yok. 5 cümleyi ayırıp aşağıya yaz." before={<div className="l1a-glued" lang="de" dir="ltr">{gluedText}</div>} lines={gluedSentences.map(line=>({who:line.who,text:'___',answers:[line.answers]}))} wide say={gluedSay} {...props}/>;
  case 'aus':return <ArticleExercise key={step.id} {...props}/>;
  case 'dinle':return <ListenExercise key={step.id} {...props}/>;
  case 'soru':return <GapExercise key={step.id} id={step.id} kicker="Alıştırma 7 · Schreiben Sie Fragen" title="Cevap var, soruyu yaz" lead="Cevaba bakıp soruyu yaz. (İpucu: Herr / Frau + soyadı ekleyebilirsin.)" lines={questionLines.flatMap(line=>[{who:'a' as const,text:'___',answers:[line.answers]},{who:'b' as const,text:line.reply,answers:[]}])} wide say={questionSay} {...props}/>;
  case 'kutu':return <GapExercise key={step.id} id={step.id} kicker="Alıştırma 8 · Was passt?" title="Kutudan doğru kelimeyi seç" lead={'Kelimeler: '+wordBox.join(' · ')} lines={boxLines} choices={wordBox} say={boxSay} {...props}/>;
  case 'sen':return <OwnExercise key={step.id} {...props}/>;
  case 'test':return <TestStep key={step.id} {...props}/>;
  case 'bitti':return <End {...props}/>;
 }
 return null;
}

/* ---------- small pieces ---------- */
function Say({text,speech,label='Dinle',wide=false}:{text:string;speech:Speech;label?:string;wide?:boolean}){
 const playing=speech.busy&&speech.activeText===text;
 return <button type="button" className={(wide?'btn secondary small l1a-say-wide':'l12-say')+(playing?' playing':'')} disabled={speech.busy&&!playing} aria-label={label+': '+text} title={label} onClick={()=>speech.speak(text)}><Volume2 size={18} aria-hidden="true"/>{wide&&label}</button>;
}
function Phrases({items,speech}:{items:readonly (readonly [string,string])[];speech:Speech}){
 return <>{items.map(([de,tr])=><div className="l1a-phrase" key={de}><div className="l1a-phrase-text"><span className="l1a-de" lang="de" dir="ltr">{de}</span><span className="l1a-tr">{tr}</span></div><Say text={de} speech={speech}/></div>)}</>;
}
const Note=({children}:{children:ReactNode})=><div className="l1a-note"><PaulHoca pose="tip" className="l1a-paul"/><p>{children}</p></div>;
/** `**bold**` inside a text. */
function Rich({text}:{text:string}){const parts=text.split(/(\*\*[^*]+\*\*)/g);return <>{parts.map((part,i)=>part.startsWith('**')&&part.endsWith('**')&&part.length>4?<b key={i}>{part.slice(2,-2)}</b>:part)}</>;}
function Heading({children}:{children:ReactNode}){return <h1 id="l1a-heading" tabIndex={-1} className="l1a-heading">{children}</h1>;}
function Portrait({who,name}:{who:string;name:string}){return <img className="l1a-portrait" src={portraitSrc(who)} alt={name} width={64} height={64} loading="lazy" decoding="async"/>;}

/* ---------- teaching steps ---------- */
function Cover({progress,onGo,scores}:StepProps){
 const started=Object.keys(scores).length>0;
 return <>
  <p className="kicker" lang="de">Lektion 1 · Willkommen!</p>
  <Heading><span lang="de">A — Ich heiße …</span></Heading>
  <img className="l1a-cover" src={willkommenPictures.cover.src} alt="Süpermarket önünde tokalaşan iki kişi: Sabine ve Omar" width={willkommenPictures.cover.width} height={willkommenPictures.cover.height} decoding="async"/>
  <p>Bu derste öğreneceklerin:</p>
  <ul className="l1a-list"><li>Selamlaşma: <b lang="de">Guten Tag!</b></li><li>Adını söylemek ve sormak</li><li>Nereden geldiğini söylemek</li><li>Ülke adları ve <b lang="de">aus</b></li></ul>
  <p className="l1a-tr">Önce konuyu öğren (10 kısa adım), sonra alıştırmaları yap (9 alıştırma + test). Alttaki “İleri” ile ilerle.</p>
  {started&&<ProgressMeter progress={progress} language={'tr'} label="Lektion 1A"/>}
  <div className="l1a-jump">
   <button type="button" className="btn small" onClick={()=>onGo(1)}><Play size={16} aria-hidden="true"/>Konuyu öğren</button>
   <button type="button" className="btn secondary small" onClick={()=>onGo(stepIndex('harfler'))}>Alıştırmalara geç</button>
   <button type="button" className="btn secondary small" onClick={()=>onGo(stepIndex('test'))}>Teste geç</button>
  </div>
 </>;
}
function Teach({title,phrases,note,speech}:{title:string;phrases:readonly (readonly [string,string])[];note?:ReactNode;speech:Speech}){
 return <><Heading>{title}</Heading><Phrases items={phrases} speech={speech}/>{note&&<Note>{note}</Note>}</>;
}
function Names({speech}:{speech:Speech}){
 return <><Heading>Adınız ne?</Heading>
  <Phrases items={[namePhrases[0]]} speech={speech}/>
  <p className="l1a-tr">İki cevap da doğru:</p>
  <Phrases items={namePhrases.slice(1)} speech={speech}/>
  <table className="l1a-table"><tbody><tr><td><b lang="de">wie</b></td><td>nasıl</td><td><b lang="de">Sie</b></td><td>siz</td></tr><tr><td><b lang="de">heißen</b></td><td>adı … olmak</td><td><b lang="de">ich bin</b></td><td>ben … -im</td></tr></tbody></table>
  <Note><b lang="de">Herr</b> = Bay, <b lang="de">Frau</b> = Bayan. Soyadıyla birlikte kullanılır: <b lang="de">Herr Nasser</b>, <b lang="de">Frau Krüger</b>.</Note></>;
}
function Origin({speech}:{speech:Speech}){
 return <><Heading>Nereden geliyorsunuz?</Heading>
  <Phrases items={originPhrases.slice(0,2)} speech={speech}/>
  <p className="l1a-tr">Soyadıyla sorabilirsin:</p><Phrases items={[originPhrases[2]]} speech={speech}/>
  <p className="l1a-tr">Ülkeden sonra şehri de söyleyebilirsin:</p><Phrases items={[originPhrases[3]]} speech={speech}/>
  <table className="l1a-table"><tbody><tr><td><b lang="de">woher</b></td><td>nereden</td><td><b lang="de">kommen</b></td><td>gelmek</td><td><b lang="de">aus</b></td><td>-den / -dan</td></tr></tbody></table></>;
}
function Countries({speech}:{speech:Speech}){
 const flag=(c:readonly [string,string,string,string],art:boolean)=><button type="button" key={c[1]} className={'l1a-flag'+(art?' art':'')+(speech.busy&&speech.activeText===c[3]?' playing':'')} onClick={()=>speech.speak(c[3])} aria-label={'Dinle: '+c[3]}><span className="l1a-flag-emoji" aria-hidden="true">{c[0]}</span><b lang="de">{c[1]}</b><small>{c[2]}</small></button>;
 return <><Heading>Ülkeler</Heading><p className="l1a-tr">Dokun, dinle: “aus …” biçimiyle okunur.</p>
  <h2 className="l1a-h2">Artikel yok: <span lang="de">aus</span> + ülke</h2><div className="l1a-flags">{countries.map(c=>flag(c,false))}</div>
  <h2 className="l1a-h2">Artikel var: <span lang="de">aus der / dem / den …</span></h2><p className="l1a-mini">Mavi yazılı ülkeler artikel alır. Kuralı bir sonraki adımda göreceksin.</p><div className="l1a-flags">{articleCountries.map(c=>flag(c,true))}</div></>;
}
function ArticleRule({speech}:{speech:Speech}){
 return <><Heading>Dikkat: <span lang="de">aus</span> + artikel</Heading>
  <p>Çoğu ülke artikel almaz:</p>
  <div className="l1a-phrase"><div className="l1a-phrase-text"><span className="l1a-de" lang="de">aus Deutschland · aus Polen · aus Syrien</span></div><Say text={noArticleSay} speech={speech}/></div>
  <p>Bazı ülkeler artikel alır. <b lang="de">aus</b>’tan sonra artikel değişir:</p>
  {articleGroups.map(group=><div className="l1a-phrase" key={group.rule}><div className="l1a-phrase-text"><span className="l1a-de" lang="de">{group.rule}</span><span className="l1a-tr" lang="de"><Rich text={group.examples}/></span></div><Say text={group.say} speech={speech}/></div>)}
  <Note>Neden değişiyor? <b lang="de">aus</b> kelimesinden sonra Dativ gelir. A1’de bunu sadece ezberle: <b lang="de">der Türkei, dem Irak, den USA</b>.</Note></>;
}
function Verbs({speech}:{speech:Speech}){
 const cell=(text:string)=><td><span lang="de">{text}</span> <Say text={text} speech={speech}/></td>;
 return <><Heading>Üç fiil: <span lang="de">ich / Sie</span></Heading>
  <table className="l1a-table l1a-verbs"><thead><tr><th></th><th><span lang="de">ich</span> (ben)</th><th><span lang="de">Sie</span> (siz)</th></tr></thead>
  <tbody>{verbForms.map(form=><tr key={form.verb}><td><b lang="de">{form.verb}</b><br/><span className="l1a-mini">{form.tr}</span></td>{cell(form.ich)}{cell(form.sie)}</tr>)}</tbody></table>
  <Note>Kural: <b lang="de">ich</b> → fiil <b>-e</b> ile biter (<span lang="de">heiß<b>e</b>, komm<b>e</b></span>). <b lang="de">Sie</b> → fiil <b>-en</b> ile biter (<span lang="de">heiß<b>en</b>, komm<b>en</b></span>). <b lang="de">sein</b> düzensizdir: <span lang="de">bin / sind</span>.</Note></>;
}
function Dialogue({speech}:{speech:Speech}){
 return <><Heading>Diyalog: Sabine ve Omar</Heading><p className="l1a-tr">Sabine Krüger bir süpermarket işletiyor. Omar Nasser yeni geldi.</p>
  <div className="l1a-dialogue">{dialogue.map(([who,de,tr],i)=><div className={'l1a-line '+(who==='S'?'a':'b')} key={i}><Portrait who={who==='S'?'sabine':'omar'} name={who==='S'?'Sabine':'Omar'}/><div className="l1a-bubble"><span className="l1a-de" lang="de" dir="ltr">{de}</span><span className="l1a-tr">{tr}</span></div><Say text={de} speech={speech}/></div>)}</div>
  <div className="l1a-actions"><button type="button" className="btn secondary small" disabled={speech.busy} onClick={()=>speech.speakAll(dialogue.map(line=>line[1]))}><Play size={16} aria-hidden="true"/>Tümünü dinle</button></div></>;
}
function People({speech}:{speech:Speech}){
 return <><Heading>Kişiler nereden geliyor?</Heading><p className="l1a-tr">Önce ülke, sonra şehir: <b lang="de">aus Kenia, aus Nairobi</b>.</p>
  {people.map(p=><div className="l1a-person" key={p.key}><Portrait who={p.key} name={p.name.split(' ')[0]}/><div className="l1a-phrase-text"><span className="l1a-de"><span aria-hidden="true">{p.flag} </span><span lang="de">{p.name}</span></span><span className="l1a-tr" lang="de" dir="ltr">Ich komme aus {p.land}, aus {p.city}.</span></div><Say text={personSpeech(p)} speech={speech}/></div>)}</>;
}
function Languages(){
 return <><Heading>Farklı dillerde “Guten Tag”</Heading>
  <img className="l1a-cover" src={willkommenPictures.map.src} alt="Paul Hoca dünya haritasını gösteriyor" width={willkommenPictures.map.width} height={willkommenPictures.map.height} loading="lazy" decoding="async"/>
  <table className="l1a-table"><tbody>{greetingsAround.map(([lang,greeting])=><tr key={lang}><td><b>{lang}</b></td><td>{greeting}</td></tr>)}</tbody></table>
  <Note>Sınıfta herkes kendi dilinde “Guten Tag” yazıp tahtaya asar ve kendini tanıtır: <b lang="de">Ich heiße … Ich komme aus …</b></Note></>;
}
function WordList({speech}:{speech:Speech}){
 return <><Heading>Kelime listesi</Heading>
  <table className="l1a-table l1a-words"><tbody>{words.map(([de,tr])=><tr key={de}><td><span className="l1a-de" lang="de">{de}</span></td><td>{tr}</td><td><Say text={de} speech={speech}/></td></tr>)}</tbody></table>
  <p className="l1a-tr">Konu bitti. Şimdi alıştırmalar başlıyor.</p></>;
}

/* ---------- exercises ---------- */
type Feedback={ok:boolean;text:string}|null;
function FeedbackLine({feedback}:{feedback:Feedback}){return <p className={'l1a-feedback'+(feedback?feedback.ok?' ok':' bad':'')} role="status" aria-live="polite">{feedback?.text??''}</p>;}
/** Finishes an exercise: saves the score, plays the sound and reads the solution after a full score. */
function useFinish(props:StepProps){
 const {sound,speech,onScore,step}=props;
 return useCallback((right:number,total:number,say?:string[])=>{
  onScore(step.id,right,total);
  if(right===total){sound.correct(()=>{if(say?.length)speech.speakAll(say);});}else sound.wrong();
 },[sound,speech,onScore,step.id]);
}
/** Gaps in a text: letters inside a word, whole sentences (wide) or a word chosen from a box. */
function GapExercise(props:StepProps&{id:string;kicker:string;title:string;lead?:string;before?:ReactNode;lines:GapLine[];wide?:boolean;choices?:string[];say:string[]}){
 const {kicker,title,lead,before,lines,wide=false,choices,say,sound,speech}=props;
 const gaps=useMemo(()=>lines.flatMap((line,l)=>line.answers.map((answers,g)=>({line:l,gap:g,answers}))),[lines]);
 const [values,setValues]=useState<string[]>(()=>gaps.map(()=>''));const [checked,setChecked]=useState<(boolean|null)[]>(()=>gaps.map(()=>null));
 const [feedback,setFeedback]=useState<Feedback>(null);const finish=useFinish(props);
 const at=(l:number,g:number)=>gaps.findIndex(item=>item.line===l&&item.gap===g);
 const check=()=>{
  sound.prepare();speech.prepare();
  const result=gaps.map((gap,i)=>acceptsAnswer(values[i],gap.answers));setChecked(result);
  const right=result.filter(Boolean).length;
  setFeedback(right===gaps.length?{ok:true,text:'Hepsi doğru!'}:{ok:false,text:`${right} / ${gaps.length} doğru. Kırmızıları düzelt; doğrusu yanında yazıyor.`});
  finish(right,gaps.length,say);
 };
 const reveal=()=>{setValues(gaps.map(gap=>gap.answers[0]));setChecked(gaps.map(()=>true));setFeedback({ok:true,text:'Cevaplar gösterildi.'});};
 const field=(l:number,g:number)=>{const i=at(l,g);const state=checked[i];const cls='l1a-gap'+(wide?' wide':'')+(state===true?' ok':state===false?' bad':'');
  const input=choices?<select className={cls} value={values[i]} aria-label={`Boşluk ${i+1}`} onChange={event=>{const next=values.slice();next[i]=event.target.value;setValues(next);const ok=acceptsAnswer(event.target.value,gaps[i].answers);const nextChecked=checked.slice();nextChecked[i]=event.target.value?ok:null;setChecked(nextChecked);}}><option value="">…</option>{choices.map(word=><option key={word} value={word}>{word}</option>)}</select>
   :<input className={cls} value={values[i]} lang="de" dir="ltr" autoCapitalize="off" autoComplete="off" spellCheck={false} placeholder={wide?'Buraya yaz…':''} aria-label={`Boşluk ${i+1}`} onChange={event=>{const next=values.slice();next[i]=event.target.value;setValues(next);if(checked[i]!==null){const nextChecked=checked.slice();nextChecked[i]=null;setChecked(nextChecked);}}}/>;
  return <span className="l1a-gap-wrap" key={g}>{input}{state===false&&<span className="l1a-hint" lang="de">→ {gaps[i].answers[0]}</span>}</span>;};
 const line=(item:GapLine,l:number)=>{const parts=item.text.split('___');return <span className="l1a-de l1a-gap-text" lang="de" dir="ltr">{parts.map((part,g)=><span key={g}>{part}{g<parts.length-1&&field(l,g)}</span>)}</span>;};
 return <>
  <p className="kicker" lang="de">{kicker}</p><Heading>{title}</Heading>{lead&&<p className="l1a-tr">{lead}</p>}{before}
  <div className="l1a-dialogue">{lines.map((item,l)=>item.who?<div className={'l1a-line '+item.who} key={l}><div className="l1a-bubble">{line(item,l)}</div></div>:<div className="l1a-row" key={l}>{line(item,l)}</div>)}</div>
  <div className="l1a-actions"><button type="button" className="btn small" onClick={check}><Check size={16} aria-hidden="true"/>Kontrol et</button><button type="button" className="btn secondary small" onClick={reveal}>Cevapları göster</button></div>
  <FeedbackLine feedback={feedback}/>
 </>;
}
function MatchExercise(props:StepProps){
 const {speech,sound}=props;const finish=useFinish(props);
 const [order]=useState(()=>shuffle(matchPairs.map((_,i)=>i)));
 const [selected,setSelected]=useState<number|null>(null);const [done,setDone]=useState<number[]>([]);const [wrongAt,setWrongAt]=useState<number|null>(null);const [misses,setMisses]=useState(0);
 const [feedback,setFeedback]=useState<Feedback>(null);
 const pickRight=(i:number)=>{
  if(selected===null||done.includes(i))return;sound.prepare();speech.prepare();
  if(i===selected){const next=[...done,i];setDone(next);setSelected(null);speech.speakAll([matchPairs[i][0],matchPairs[i][1]]);
   if(next.length===matchPairs.length){const right=Math.max(0,matchPairs.length-misses);setFeedback({ok:true,text:'Hepsi eşleşti!'});finish(right,matchPairs.length);}}
  else{setWrongAt(i);setMisses(m=>m+1);setFeedback({ok:false,text:'Bu ikisi uymuyor.'});sound.wrong();setTimeout(()=>setWrongAt(null),600);}
 };
 return <>
  <p className="kicker" lang="de">Alıştırma 2 · Verbinden Sie</p><Heading>Soruyu cevapla eşleştir</Heading><p className="l1a-tr">Önce soldan, sonra sağdan dokun.</p>
  <div className="l1a-match">
   <div>{matchPairs.map((pair,i)=><button type="button" key={i} className={'l1a-mbtn'+(selected===i?' sel':'')+(done.includes(i)?' done':'')} disabled={done.includes(i)} aria-pressed={selected===i} lang="de" dir="ltr" onClick={()=>setSelected(i)}>{pair[0]}</button>)}</div>
   <div>{order.map(i=><button type="button" key={i} className={'l1a-mbtn'+(done.includes(i)?' done':'')+(wrongAt===i?' bad':'')} disabled={done.includes(i)} lang="de" dir="ltr" onClick={()=>pickRight(i)}>{matchPairs[i][1]}</button>)}</div>
  </div>
  <FeedbackLine feedback={feedback}/>
 </>;
}
function OrderExercise(props:StepProps){
 const {speech,sound}=props;const finish=useFinish(props);
 const [round,setRound]=useState(0);const [chips,setChips]=useState<{word:string;i:number}[]>(()=>shuffle(orderSentences[0].map((word,i)=>({word,i}))));
 const [picked,setPicked]=useState<number[]>([]);const [state,setState]=useState<'open'|'ok'|'bad'>('open');const [right,setRight]=useState(0);const [feedback,setFeedback]=useState<Feedback>(null);
 const sentence=orderSentences[round];const text=picked.map(i=>sentence[i]).join(' ');
 const check=()=>{sound.prepare();speech.prepare();const ok=text===sentence.join(' ');setState(ok?'ok':'bad');
  if(ok){const total=right+1;setRight(total);setFeedback({ok:true,text:round===orderSentences.length-1?'Tüm cümleler doğru!':'Doğru!'});
   if(round===orderSentences.length-1)finish(total,orderSentences.length,[sentence.join(' ')]);else sound.correct(()=>speech.speak(sentence.join(' ')));}
  else{setFeedback({ok:false,text:'Sırayı kontrol et.'});sound.wrong();}};
 const next=()=>{const r=round+1;setRound(r);setChips(shuffle(orderSentences[r].map((word,i)=>({word,i}))));setPicked([]);setState('open');setFeedback(null);};
 return <>
  <p className="kicker" lang="de">Alıştırma 3 · Ordnen Sie</p><Heading>Kelimeleri sıraya koy</Heading><p className="l1a-tr">Cümle {round+1} / {orderSentences.length}</p>
  <div className={'l1a-answer'+(state==='ok'?' ok':state==='bad'?' bad':'')} lang="de" dir="ltr" aria-live="polite">{text}</div>
  <div className="l1a-chips">{chips.map(chip=><button type="button" key={chip.i} className="l1a-chip" lang="de" dir="ltr" disabled={picked.includes(chip.i)||state==='ok'} onClick={()=>{setPicked([...picked,chip.i]);setState('open');}}>{chip.word}</button>)}</div>
  <div className="l1a-actions">
   <button type="button" className="btn secondary small" disabled={!picked.length||state==='ok'} onClick={()=>{setPicked(picked.slice(0,-1));setState('open');}}><Trash2 size={16} aria-hidden="true"/>Sil</button>
   <button type="button" className="btn small" disabled={picked.length!==sentence.length||state==='ok'} onClick={check}><Check size={16} aria-hidden="true"/>Kontrol et</button>
   {state==='ok'&&round<orderSentences.length-1&&<button type="button" className="btn small" onClick={next}>Sonraki<ArrowRight size={16} className="vault-direction-icon" aria-hidden="true"/></button>}
  </div>
  <FeedbackLine feedback={feedback}/>
 </>;
}
function ArticleExercise(props:StepProps){
 const {speech,sound}=props;const finish=useFinish(props);
 const [answers,setAnswers]=useState<Record<number,string>>({});const [feedback,setFeedback]=useState<Feedback>(null);
 const answer=(i:number,value:string)=>{if(answers[i]!==undefined)return;sound.prepare();speech.prepare();
  const next={...answers,[i]:value};setAnswers(next);const ok=value===articleRows[i][1];
  const done=Object.keys(next).length;const right=articleRows.filter((row,j)=>next[j]===row[1]).length;
  if(done===articleRows.length){setFeedback({ok:right===articleRows.length,text:`${right} / ${articleRows.length} doğru`});finish(right,articleRows.length);}
  else if(ok)sound.correct(()=>speech.speak(articleRowSpeech(articleRows[i])));else sound.wrong(()=>speech.speak(articleRowSpeech(articleRows[i])));};
 return <>
  <p className="kicker" lang="de">Alıştırma 5 · Artikel</p><Heading><span lang="de">aus</span> + ?</Heading><p className="l1a-tr">Doğru olanı seç. “–” = artikel yok.</p>
  {articleRows.map(([land,right],i)=><div className="l1a-arow" key={land} data-done={answers[i]!==undefined?'':undefined}><span className="l1a-land" lang="de">aus</span><div className="l1a-opts" role="group" aria-label={'aus … '+land}>{articleOptions.map(option=><button type="button" key={option} className={'l1a-opt'+(answers[i]!==undefined&&option===right?' ok':answers[i]===option?' bad':'')} disabled={answers[i]!==undefined} lang="de" onClick={()=>answer(i,option)}>{option}</button>)}</div><span className="l1a-land" lang="de">{land}</span></div>)}
  <FeedbackLine feedback={feedback}/>
 </>;
}
function ListenExercise(props:StepProps){
 const {speech,sound}=props;const finish=useFinish(props);
 const [answers,setAnswers]=useState<Record<number,number>>({});const [feedback,setFeedback]=useState<Feedback>(null);
 const answer=(i:number,j:number)=>{if(answers[i]!==undefined)return;sound.prepare();const next={...answers,[i]:j};setAnswers(next);
  const ok=j===listenItems[i].answer;const done=Object.keys(next).length;const right=listenItems.filter((item,k)=>next[k]===item.answer).length;
  if(done===listenItems.length){setFeedback({ok:right===listenItems.length,text:`${right} / ${listenItems.length} doğru`});finish(right,listenItems.length);}else if(ok)sound.correct();else sound.wrong();};
 return <>
  <p className="kicker" lang="de">Alıştırma 6 · Hören Sie</p><Heading>Dinle ve işaretle</Heading><p className="l1a-tr">Kişiler nereden geliyor? Önce dinle, sonra seç.</p>
  {listenItems.map((item,i)=><div className="l1a-listen" key={item.key}>
   <div className="l1a-person"><Portrait who={item.key} name={item.name.split(' ')[0]}/><div className="l1a-phrase-text"><span className="l1a-de">{i+1}. <span lang="de">{item.name}</span></span><span className="l1a-tr" lang="de">Ich komme …</span></div><Say text={item.text} speech={speech} wide/></div>
   <div className="l1a-opts wrap" role="group" aria-label={item.name}>{item.options.map((option,j)=><button type="button" key={option} className={'l1a-opt'+(answers[i]!==undefined&&j===item.answer?' ok':answers[i]===j?' bad':'')} disabled={answers[i]!==undefined} lang="de" onClick={()=>answer(i,j)}>{option}</button>)}</div>
   {answers[i]!==undefined&&<p className="l1a-mini">Metin: <span lang="de" dir="ltr">{item.text}</span></p>}
  </div>)}
  <FeedbackLine feedback={feedback}/>
 </>;
}
function OwnExercise({speech}:StepProps){
 const [values,setValues]=useState(['','']);const [state,setState]=useState<(boolean|null)[]>([null,null]);
 const change=(i:number,value:string)=>{const next=values.slice();next[i]=value;setValues(next);const s=state.slice();s[i]=value.trim()?ownPrompts[i].pattern.test(normalizeLoose(value)):null;setState(s);};
 return <>
  <p className="kicker" lang="de">Alıştırma 9 · Sprechen Sie</p><Heading>Şimdi sen cevap ver</Heading><p className="l1a-tr">Kendi adınla ve ülkenle yaz, sonra dinle.</p>
  <div className="l1a-dialogue">{ownPrompts.map((prompt,i)=><div key={prompt.question}>
   <div className="l1a-line a"><div className="l1a-bubble"><span className="l1a-de" lang="de">{prompt.question}</span></div><Say text={prompt.question} speech={speech}/></div>
   <div className="l1a-line b"><div className="l1a-bubble"><input className={'l1a-gap wide'+(state[i]===true?' ok':state[i]===false?' bad':'')} value={values[i]} lang="de" dir="ltr" autoCapitalize="off" autoComplete="off" placeholder={prompt.placeholder} aria-label={prompt.question} onChange={event=>change(i,event.target.value)}/>{state[i]===false&&<span className="l1a-mini">Kalıp: <span lang="de">{prompt.placeholder}</span></span>}</div></div>
  </div>)}</div>
  <div className="l1a-actions"><button type="button" className="btn secondary small" disabled={speech.busy||!values.some(v=>v.trim())} onClick={()=>speech.speakAll(values.map(v=>v.trim()).filter(Boolean))}><Volume2 size={16} aria-hidden="true"/>Cümlelerimi dinle</button></div>
  <Note>Hatırla: Türkiye → <b lang="de">aus der Türkei</b>, Irak → <b lang="de">aus dem Irak</b>, Almanya → <b lang="de">aus Deutschland</b>.</Note>
 </>;
}
function TestStep(props:StepProps){
 const {speech,sound,onScore,step}=props;
 const [i,setI]=useState(0);const [score,setScore]=useState(0);const [picked,setPicked]=useState<string|null>(null);const [options,setOptions]=useState(()=>shuffle(testQuestions[0][1]));const [over,setOver]=useState(false);
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
 const question=testQuestions[i];
 const answer=(option:string)=>{if(picked!==null)return;sound.prepare();speech.prepare();setPicked(option);const ok=option===question[2];const total=score+(ok?1:0);setScore(total);
  const say=testSpeech(question);const after=()=>{if(say)speech.speak(say);};if(ok)sound.correct(after);else sound.wrong(after);
  timer.current=setTimeout(()=>{if(i+1<testQuestions.length){setI(i+1);setPicked(null);setOptions(shuffle(testQuestions[i+1][1]));}else{setOver(true);onScore(step.id,total,testQuestions.length);if(total===testQuestions.length)sound.complete();}},1600);};
 const again=()=>{setI(0);setScore(0);setPicked(null);setOptions(shuffle(testQuestions[0][1]));setOver(false);};
 if(over){const percent=Math.round(score/testQuestions.length*100);return <>
  <p className="kicker" lang="de">Lektion 1A · Test</p><Heading>Sonuç</Heading>
  <p className="l1a-score">{score} / {testQuestions.length}</p>
  <p className="l1a-big">{percent>=80?'Harika! Bu konuyu öğrendin.':percent>=60?'İyi. Yanlışlarına bir daha bak.':'Konuyu bir kez daha oku, sonra tekrar dene.'}</p>
  {percent>=80&&<PaulHoca pose="cheer" className="l1a-paul-big"/>}
  <div className="l1a-actions"><button type="button" className="btn" onClick={again}><RotateCcw size={18} aria-hidden="true"/>Testi tekrarla</button></div></>;}
 return <>
  <p className="kicker" lang="de">Lektion 1A · Test</p><Heading>Soru {i+1} / {testQuestions.length}</Heading>
  <p className="l1a-question" lang={/[çğışöüİ]|hangisi|nedir|nasıl/.test(question[0])?'tr':'de'}>{question[0]}</p>
  <div className="l1a-opts column" role="group" aria-label={'Soru '+(i+1)}>{options.map(option=><button type="button" key={option} className={'l1a-opt'+(picked!==null&&option===question[2]?' ok':picked===option?' bad':'')} disabled={picked!==null} lang={/^[A-Za-zÄÖÜäöüß–]/.test(option)&&!/^(Hoş|İyi|Teşekkürler)/.test(option)?'de':'tr'} onClick={()=>answer(option)}>{option}</button>)}</div>
  <p className="l1a-mini">Puan: {score}</p>
 </>;
}
function End({progress,onGo}:StepProps){
 return <>
  <Heading>Lektion 1A tamam! 🎉</Heading>
  <PaulHoca pose="cheer" className="l1a-paul-big" sound="appear"/>
  <p>Artık şunları söyleyebilirsin:</p>
  <ul className="l1a-list" lang="de"><li><b>Guten Tag!</b> <span lang="tr">– selamlaşma</span></li><li><b>Ich heiße … / Ich bin …</b> <span lang="tr">– adını söyleme</span></li><li><b>Wie heißen Sie?</b> <span lang="tr">– ad sorma</span></li><li><b>Ich komme aus …</b> <span lang="tr">– nereden geldiğini söyleme</span></li><li><b>Woher kommen Sie?</b> <span lang="tr">– nereden sorma</span></li><li><b>aus der Türkei, aus dem Irak, aus den USA</b> <span lang="tr">– artikelli ülkeler</span></li></ul>
  <ProgressMeter progress={progress} language={'tr'} label="Lektion 1A"/>
  <p className="l1a-tr">Bir sonraki bölüm: <b>1B</b> (yakında).</p>
  <div className="l1a-actions"><button type="button" className="btn secondary small" onClick={()=>onGo(stepIndex('harfler'))}>Alıştırmaları tekrar yap</button><a className="btn small" href="/konular?level=A1.1">Ünitelere dön</a></div>
 </>;
}
function shuffle<T>(list:readonly T[]):T[]{const out=list.slice();for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
