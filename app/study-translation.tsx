'use client';
import {useEffect,useState} from 'react';
import {lessonTranslation} from '@/lib/lesson-translations';
import {c} from '@/lib/category-copy';
import type {StudyLanguage} from '@/lib/study-languages';
import {englishMeaning} from '@/lib/english-translations';

type LocalTranslator={translate:(text:string)=>Promise<string>};
type TranslatorFactory={availability:(options:{sourceLanguage:string;targetLanguage:string})=>Promise<string>;create:(options:{sourceLanguage:string;targetLanguage:string})=>Promise<LocalTranslator>};
const localEngines=new Map<string,LocalTranslator>();
const localResults=new Map<string,string>();
const factory=()=>typeof window==='undefined'?undefined:(window as unknown as {Translator?:TranslatorFactory}).Translator;
/** No lesson text or written answer is sent to a translation service. */
export function TranslationLine({text,language,source='de',fallback,label}: {text:string;language:StudyLanguage;source?:'de'|'tr'|'en';fallback?:string;label?:string}){
 const [local,setLocal]=useState<{key:string;value:string}>({key:'',value:''});const [working,setWorking]=useState(false);const [available,setAvailable]=useState(false);
 const key=source+':'+language+':'+text;const prepared=(source==='en'?englishMeaning(text,language):lessonTranslation(text,language,source))??(language==='tr'?fallback:undefined);
 useEffect(()=>{let active=true;setLocal({key,value:localResults.get(key)??''});setAvailable(false);if(prepared||!text.trim()||language===source)return;
  const engine=localEngines.get(source+':'+language);let debounce:ReturnType<typeof setTimeout>|undefined;if(engine){debounce=setTimeout(()=>{engine.translate(text).then(result=>{if(active&&result.trim()){localResults.set(key,result);setLocal({key,value:result});}}).catch(()=>{});},400);}
  else factory()?.availability({sourceLanguage:source,targetLanguage:language}).then(status=>{if(active)setAvailable(status!=='unavailable');}).catch(()=>{});
  return()=>{active=false;if(debounce)clearTimeout(debounce);};
 },[key,language,source,text,prepared]);
 async function translateLocally(){if(working||!factory())return;setWorking(true);try{const pair=source+':'+language;let engine=localEngines.get(pair);if(!engine){engine=await factory()!.create({sourceLanguage:source,targetLanguage:language});localEngines.set(pair,engine);}const result=await engine.translate(text);if(result.trim()){localResults.set(key,result);setLocal({key,value:result});}}catch{setAvailable(false);}finally{setWorking(false);}}
 if(!text.trim()||language===source)return null;
 const localValue=local.key===key?local.value:'';const result=prepared??localValue;
 return <span className={'meaning-line '+(!result?'translation-pending':'')} dir={language==='ar'?'rtl':'ltr'} lang={language}><span className="meaning-label">{label??c(language,'meaning')}</span> {result||c(language,'missing')}{localValue&&!prepared&&<small className="local-note">{c(language,'localNote')}</small>}{!result&&available&&<button type="button" className="text-button" disabled={working} onClick={()=>void translateLocally()}>{c(language,working?'translating':'localTranslate')}</button>}</span>;
}
export function GermanText({text,language,fallback,className=''}:{text:string;language:StudyLanguage;fallback?:string;className?:string}){return <span className={'translated-german '+className}><span className="german-line" lang="de" dir="ltr">{text}</span><TranslationLine text={text} language={language} fallback={fallback}/></span>;}
