'use client';
import {ArrowLeft,ArrowRight,Volume2} from 'lucide-react';
import {housingSections,housingRules,housingVerbCards,housingQuestions,housingMeaning,type HousingSection} from '@/lib/housing-course';
import {housingLessons,lessonCopy,type LessonLabel} from '@/lib/housing-lessons';
import {translate,type StudyLanguage} from '@/lib/study-languages';
import {vaultText} from '@/lib/object-vault-copy';
import {languageDirection} from '@/lib/site-languages';

export function HousingLessonNotes({section,language,onBack,onContinue,onSpeak,speaking=false,hasNext=false}:{section:HousingSection;language:StudyLanguage;onBack:()=>void;onContinue:()=>void;onSpeak:(text:string)=>void;speaking?:boolean;hasNext?:boolean}){
 const info=housingSections.find(item=>item.id===section)!;const lesson=housingLessons[section];
 const l=(key:LessonLabel)=>translate(lessonCopy[key],language);
 const sentenceMeaning=(de:string)=>{const q=housingQuestions.find(item=>item.resultDe===de);return q?housingMeaning(q,language):'';};
 const go=(id:string)=>document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'});
 const contents=[...lesson.steps.map((item,i)=>({id:'lesson-step-'+(i+1),title:translate(item.title,language)})),{id:'lesson-build',title:l('build')},{id:'lesson-examples',title:l('examples')},{id:'lesson-mistakes',title:l('mistakes')}];
 // An open notebook (the same markup as LessonBook in app/lesson-book.tsx, written out so this file
 // loads on its own in the render test): the left page names the lesson and lists its cards.
 return <section className="housing-lesson" aria-labelledby="housing-heading"><div className="lb lb-wide"><div className="lb-spread">
  <div className="lb-page lb-left"><div className="lb-sticky">
   <button type="button" className="text-button vault-back-categories" onClick={onBack}><ArrowLeft size={18}/>{vaultText(language,'backCategories')}</button>
   <header className="housing-lesson-intro"><span className="eyebrow">A1.2 · 11 · {section.toUpperCase()}</span><h1 id="housing-heading" tabIndex={-1} className="lb-title">{l('title')}</h1><h2 className="lb-sub" lang="de" dir="ltr">{info.de}</h2><p className="lb-lead">{translate(info.title,language)}</p><p className="lb-lead">{l('intro')}</p></header>
   <ol className="lb-contents">{contents.map((item,i)=><li key={item.id}><button type="button" onClick={()=>go(item.id)}><span aria-hidden="true">{i+1}</span>{item.title}</button></li>)}</ol>
  </div></div>
  <div className="lb-rings" aria-hidden="true"/>
  <div className="lb-page lb-right">
  <div className="housing-lesson-stack">{lesson.steps.map((item,i)=><article className="panel housing-teaching-card" key={i} id={'lesson-step-'+(i+1)} data-lesson-step={i+1}>
   <h2>{translate(item.title,language)}</h2><p>{translate(item.text,language)}</p>
   {item.frame&&<><h3>{l('structure')}</h3><div className="housing-sentence-frame" dir="ltr" lang="de">{item.frame.parts.map((part,j)=><div className={'housing-sentence-part housing-part-'+part.label} key={j}><span className="housing-part-number">{j+1}</span><strong>{part.de}</strong><small lang={language} dir={languageDirection(language)}>{l(part.label)}</small></div>)}</div>{language!=='de'&&<p className="housing-frame-meaning">{translate(item.frame.meaning,language)}</p>}<button type="button" className="btn secondary small" disabled={speaking} onClick={()=>onSpeak(item.frame!.parts.map(part=>part.de).join(' '))}><Volume2 size={17}/>{vaultText(language,'repeatAudio')}</button></>}
   {item.table&&<div className="housing-lesson-table-wrap"><table className="housing-lesson-table"><caption>{l('table')}</caption><thead><tr>{item.table.heads.map(head=><th key={head} lang="de" dir="ltr" scope="col">{head}</th>)}{item.table.heads[0]==='Infinitiv'&&language!=='de'&&<th scope="col">{l('meaning')}</th>}</tr></thead><tbody>{item.table.rows.map((row,j)=><tr key={j}>{row.map((cell,k)=><td key={k} lang="de" dir="ltr">{cell}{k===0&&language!=='de'&&item.table?.meanings?.[j]&&<small className="housing-table-meaning" lang={language} dir={languageDirection(language)}>{translate(item.table.meanings[j],language)}</small>}</td>)}{item.table!.heads[0]==='Infinitiv'&&language!=='de'&&<td>{translate(housingVerbCards.find(card=>card.verb===row[0])?.meaning??['','','','','',''],language)}</td>}</tr>)}</tbody></table></div>}
   {item.rule&&<p className="housing-rule-reminder">{translate(housingRules[item.rule],language)}</p>}
  </article>)}</div>
  <article className="panel housing-teaching-card" id="lesson-build"><h2>{l('build')}</h2><ol className="housing-build-steps">{lesson.build.map((item,i)=><li key={i}>{translate(item,language)}</li>)}</ol></article>
  <article className="panel housing-teaching-card" id="lesson-examples"><h2>{l('examples')}</h2>{lesson.examples.map((item,i)=><div className="housing-lesson-example" key={i}><div><p lang="de" dir="ltr"><strong>{item.de}</strong></p>{language!=='de'&&<p>{translate(item.meaning,language)}</p>}</div><button type="button" className="icon-btn" aria-label={vaultText(language,'repeatAudio')} disabled={speaking} onClick={()=>onSpeak(item.de)}><Volume2 size={20}/></button></div>)}</article>
  <article className="panel housing-teaching-card" id="lesson-mistakes"><h2>{l('mistakes')}</h2>{lesson.mistakes.map((item,i)=><div className="housing-lesson-mistake" key={i}><p><span>{l('wrong')}:</span> <del lang="de" dir="ltr">{item.wrong}</del></p><p><span>{l('correct')}:</span> <strong lang="de" dir="ltr">{item.correct}</strong></p>{language!=='de'&&sentenceMeaning(item.correct)&&<p>{sentenceMeaning(item.correct)}</p>}<p>{translate(item.meaning,language)}</p></div>)}</article>
  <div className="panel housing-lesson-next"><p>{l('intro')}</p><button type="button" className="btn" onClick={onContinue}>{l(hasNext?'next':'ready')}<ArrowRight size={18}/></button></div>
  </div>
 </div></div></section>;
}
