'use client';
import {createContext,useContext,useMemo,type ReactNode} from 'react';
import {l12Ui,localizeL12Parts,localizeL12Tasks} from '@/lib/l12-i18n';
import {lessonParts,type L12Part,type L12PartId} from '@/lib/ausbildung-course';
import {hoerenTasks,type HoerenTask} from '@/lib/ausbildung-hoeren';

/**
 * Lektion 12 in the site language (lib/l12-i18n.ts): the pages' Turkish texts through `t`, and the lesson data
 * (parts, listening tasks) with their Turkish texts translated. The page loads the language's pack before it switches
 * (`useLanguageSwitch(setLanguage,loadL12Pack)`), so everything changes at once.
 */
export type L12Texts={
 language:string;
 t:(text:string,params?:Record<string,string|number>)=>string;
 parts:readonly L12Part[];partMap:ReadonlyMap<L12PartId,L12Part>;
 tasks:readonly HoerenTask[];taskMap:ReadonlyMap<number,HoerenTask>;
};
function build(language:string):L12Texts{
 const parts=localizeL12Parts(lessonParts,language);const tasks=localizeL12Tasks(hoerenTasks,language);
 return {language,t:(text,params)=>l12Ui(language,text,params),parts,partMap:new Map(parts.map(part=>[part.id,part])),tasks,taskMap:new Map(tasks.map(task=>[task.number,task]))};
}
const L12Context=createContext<L12Texts|null>(null);
export function L12Provider({language,children}:{language:string;children:ReactNode}){
 const value=useMemo(()=>build(language),[language]);
 return <L12Context.Provider value={value}>{children}</L12Context.Provider>;
}
let turkish:L12Texts|null=null;
/** The lesson's texts in the page's language (Turkish outside a provider). */
export function useL12():L12Texts{return useContext(L12Context)??(turkish??=build('tr'));}
