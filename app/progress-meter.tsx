'use client';
import {Crown,Star} from 'lucide-react';
import type {VaultLanguage} from '@/lib/object-vault-copy';
import type {TopicProgress} from '@/lib/progress-core';
import {progressText,stageText,formatPercent} from '@/lib/progress-copy';

/**
 * The progress bar of a topic, apart from app/progress-ui.tsx (3 November 2026): it needs only the texts, so the lesson
 * pages that show it do not load the question bank (lib/progress.ts) with it.
 */
export function Stars({count}:{count:number}){
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
