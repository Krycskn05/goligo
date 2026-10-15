'use client';
import {Crown,Flame,Sparkles,Star,Target,Trophy} from 'lucide-react';
import type {Review} from '@/lib/study';
import type {VaultLanguage} from '@/lib/object-vault-copy';
import {progressSummary,roundXp,topicProgress,housingProgress,objectProgress,verbProgress,housingProgressIds,objectProgressIds,verbProgressIds,type StudyStats,type TopicProgress} from '@/lib/progress';
import {progressText,stageText,formatPercent,type ProgressCopyKey} from '@/lib/progress-copy';

function Stars({count}:{count:number}){
 return <span className="progress-stars" aria-hidden="true">{[1,2,3].map(i=><Star key={i} size={13} className={i<=count?'on':''}/>)}</span>;
}
/** Percentage bar for one topic: solid = learned, light = tried. */
export function ProgressMeter({progress,language,label,compact=false}:{progress:TopicProgress;language:VaultLanguage;label:string;compact?:boolean}){
 const value=formatPercent(progress.percent,language);
 const learned=progressText(language,'learned',{n:progress.learned,total:progress.total});
 return <div className={'progress-meter stage-'+progress.stage+(compact?' compact':'')} data-progress={progress.percent}>
  <div className="progress-meter-head"><strong className="progress-meter-value">{value}</strong><span className="progress-badge">{progress.stage==='master'?<Crown size={14} aria-hidden="true"/>:<Stars count={progress.stars}/>}{stageText(language,progress.stage)}</span></div>
  <div className="progress-track" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress.percent} aria-valuetext={value+' · '+learned}><span className="progress-tried" style={{width:progress.triedPercent+'%'}}/><span className="progress-fill" style={{width:progress.percent+'%'}}/></div>
  {!compact&&<small className="progress-meter-note">{learned}</small>}
 </div>;
}
function GoalRing({percent}:{percent:number}){
 const radius=19,circle=2*Math.PI*radius;
 return <span className="progress-ring" aria-hidden="true"><svg className="progress-ring-svg" viewBox="0 0 46 46"><circle cx="23" cy="23" r={radius} className="progress-ring-bg"/><circle cx="23" cy="23" r={radius} className="progress-ring-fill" strokeDasharray={circle} strokeDashoffset={circle*(1-percent/100)}/></svg><Target size={18}/></span>;
}
/** Home page summary: level and XP, day streak, daily goal and the active areas (Ev ve Yaşam, Nesne Kasası, Fiiller). */
export function ProgressSummaryPanel({stats,reviews,language,housingLabel,vaultLabel,verbsLabel}:{stats:StudyStats;reviews:Review[];language:VaultLanguage;housingLabel:string;vaultLabel:string;verbsLabel?:string}){
 const p=(key:ProgressCopyKey,params?:Record<string,string|number>)=>progressText(language,key,params);
 const summary=progressSummary(stats);const level=summary.level;const goalDone=summary.goalPercent>=100;
 const housing=housingProgress('all',reviews);const objects=objectProgress('all',reviews);const verbsDone=verbProgress('verbs-all',reviews);
 const overall=topicProgress([...housingProgressIds('all'),...objectProgressIds('all'),...(verbsLabel?verbProgressIds('verbs-all'):[])],reviews);
 return <section className="progress-summary" aria-labelledby="progress-heading" data-progress-summary="">
  <div className="progress-summary-head"><h2 id="progress-heading"><Sparkles size={21} aria-hidden="true"/>{p('title')}</h2><span className="progress-overall">{p('overall')}: <strong>{formatPercent(overall.percent,language)}</strong></span></div>
  <div className="progress-stats">
   <div className="progress-stat progress-level"><span className="progress-stat-icon"><Trophy size={22} aria-hidden="true"/></span><div><strong>{p('level',{n:level.level})}</strong><div className="progress-track xp" role="progressbar" aria-label={p('level',{n:level.level})} aria-valuemin={0} aria-valuemax={level.span} aria-valuenow={level.intoLevel} aria-valuetext={level.xp+' XP'}><span className="progress-fill" style={{width:level.percent+'%'}}/></div><small>{level.xp} XP · {p('toNext',{n:level.toNext})}</small></div></div>
   <div className={'progress-stat progress-streak'+(summary.practisedToday?' lit':'')}><span className="progress-stat-icon"><Flame size={22} aria-hidden="true"/></span><div><strong>{p('streak',{n:summary.streak})}</strong><small>{p(summary.practisedToday?'streakDone':summary.streak?'streakKeep':'streakStart')}</small></div></div>
   <div className={'progress-stat progress-goal'+(goalDone?' done':'')}><GoalRing percent={summary.goalPercent}/><div><strong>{p('dailyGoal')}</strong><small>{goalDone?p('goalDone')+' · ':''}{p('dailyCount',{n:summary.todayAnswers,goal:summary.dailyGoal})}</small></div></div>
  </div>
  <div className={'progress-topics'+(verbsLabel?' three':'')}>
   <a className="progress-topic" href="/a1-2/ev-ve-yasam"><span className="progress-topic-name">{housingLabel}</span><ProgressMeter progress={housing} language={language} label={housingLabel}/></a>
   <a className="progress-topic" href="/ev-esyalar?learn=de"><span className="progress-topic-name">{vaultLabel}</span><ProgressMeter progress={objects} language={language} label={vaultLabel}/></a>
   {verbsLabel&&<a className="progress-topic" href="/fiiller"><span className="progress-topic-name">{verbsLabel}</span><ProgressMeter progress={verbsDone} language={language} label={verbsLabel}/></a>}
  </div>
  <p className="progress-help">{p('correctTotal',{n:summary.correct})} · {p('howItWorks')}</p>
 </section>;
}
/** Home page, at the bottom of the left menu (Üniteler ve konular, Nesne Kasası, Fiiller): the level and XP,
 * the day streak, the daily goal and the three areas, small and stacked. On a computer it stays in the
 * bottom-left corner while the page scrolls; on a phone it sits under the menu buttons. */
export function SidebarProgress({stats,reviews,language,housingLabel,vaultLabel,verbsLabel}:{stats:StudyStats;reviews:Review[];language:VaultLanguage;housingLabel:string;vaultLabel:string;verbsLabel?:string}){
 const p=(key:ProgressCopyKey,params?:Record<string,string|number>)=>progressText(language,key,params);
 const summary=progressSummary(stats);const level=summary.level;const goalDone=summary.goalPercent>=100;
 const areas=[{href:'/a1-2/ev-ve-yasam',label:housingLabel,progress:housingProgress('all',reviews)},{href:'/ev-esyalar?learn=de',label:vaultLabel,progress:objectProgress('all',reviews)},...(verbsLabel?[{href:'/fiiller',label:verbsLabel,progress:verbProgress('verbs-all',reviews)}]:[])];
 return <section className="sidebar-progress" aria-labelledby="progress-heading" data-progress-summary="">
  <h2 id="progress-heading"><Sparkles size={16} aria-hidden="true"/>{p('title')}</h2>
  <div className="sidebar-progress-level"><span className="sidebar-progress-badge"><Trophy size={14} aria-hidden="true"/>{p('level',{n:level.level})}</span><span className={'sidebar-progress-streak'+(summary.practisedToday?' lit':'')} title={p('streak',{n:summary.streak})} aria-label={p('streak',{n:summary.streak})}><Flame size={15} aria-hidden="true"/>{summary.streak}</span></div>
  <div className="progress-track xp" role="progressbar" aria-label={p('level',{n:level.level})} aria-valuemin={0} aria-valuemax={level.span} aria-valuenow={level.intoLevel} aria-valuetext={level.xp+' XP'}><span className="progress-fill" style={{width:level.percent+'%'}}/></div>
  <small className="sidebar-progress-xp">{level.xp} XP · {p('toNext',{n:level.toNext})}</small>
  <p className={'sidebar-progress-goal'+(goalDone?' done':'')}><Target size={14} aria-hidden="true"/>{p('dailyGoal')}: {p('dailyCount',{n:summary.todayAnswers,goal:summary.dailyGoal})}</p>
  <ul className="sidebar-progress-areas">{areas.map(area=><li key={area.href}><a href={area.href}><span>{area.label}</span><strong>{formatPercent(area.progress.percent,language)}</strong></a><div className="progress-track" role="progressbar" aria-label={area.label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={area.progress.percent}><span className="progress-tried" style={{width:area.progress.triedPercent+'%'}}/><span className="progress-fill" style={{width:area.progress.percent+'%'}}/></div></li>)}</ul>
 </section>;
}
/** Result screen reward: XP from this round and the topic's updated percentage. */
export function RoundReward({answers,progress,language,label}:{answers:readonly {correct:number|boolean}[];progress?:TopicProgress|null;language:VaultLanguage;label:string}){
 return <div className="round-reward" data-round-reward="">
  <div className="round-xp"><Sparkles size={22} aria-hidden="true"/><strong>+{roundXp(answers)} XP</strong><span>{progressText(language,'roundXp')}</span></div>
  {progress&&<div className="round-progress"><span className="round-progress-label">{progressText(language,'topicNow')} · {label}</span><ProgressMeter progress={progress} language={language} label={label}/></div>}
 </div>;
}
