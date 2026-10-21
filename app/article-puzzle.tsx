'use client';
import {useEffect,useMemo,useState} from 'react';
import {seededOrder} from '@/lib/letter-puzzle';
import {vaultText,type VaultLanguage} from '@/lib/object-vault-copy';

/**
 * Choose the article (or the plural's article) for the noun. The learner asked to check right away: a tap on der/die/das
 * is the answer (no "Kontrol et" button); the tap also lets the phone play the answer sound.
 */
export function ArticlePuzzle({noun,variant,storageKey,language,onChange,onSubmit,busy=false,locked=false,result}:{noun:string;variant:'article'|'plural'|'compound';storageKey:string;language:VaultLanguage;onChange:(value:string)=>void;onSubmit:(value:string)=>void;busy?:boolean;locked?:boolean;result?:boolean}){
 const text=(key:Parameters<typeof vaultText>[1])=>vaultText(language,key);
 const [selected,setSelected]=useState('');const [ready,setReady]=useState(false);
 const choices=useMemo(()=>seededOrder(['der','die','das'],storageKey+':article'),[storageKey]);
 useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem(storageKey)??'{}');if(choices.includes(saved.article))setSelected(saved.article);}catch{}setReady(true);},[storageKey,choices]);
 useEffect(()=>{onChange(selected);},[selected,onChange]);
 useEffect(()=>{if(!ready)return;try{if(result!==undefined)localStorage.removeItem(storageKey);else localStorage.setItem(storageKey,JSON.stringify({article:selected}));}catch{}},[selected,ready,storageKey,result]);
 const unavailable=busy||locked||!ready;
 function choose(value:string){if(unavailable)return;setSelected(value);onSubmit(value);}
 return <form className="article-puzzle" onSubmit={event=>{event.preventDefault();if(selected&&!unavailable)onSubmit(selected);}}>
  <p className="puzzle-hint">{text(variant==='plural'?'pluralTask':'articleTask')}</p>
  <div className="article-sentence" lang="de" dir="ltr"><span className={'article-whole-slot '+(selected?'filled ':'')+(result!==undefined?(result?'right':'wrong'):'')} aria-label={text('articleTrap')}>{selected||'___'}</span><strong>{noun}</strong></div>
  <div className="article-bank" role="group" aria-label={text('articleBank')} dir="ltr" lang="de">{choices.map(value=><button type="button" key={value} className={'article-choice '+(selected===value?'selected '+(result!==undefined?(result?'right':'wrong'):''):'')} disabled={unavailable} aria-pressed={selected===value} onClick={()=>choose(value)} data-article-answer>{value}</button>)}</div>
 </form>;
}
