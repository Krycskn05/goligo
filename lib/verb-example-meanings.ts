import type {VaultLanguage} from './object-vault-copy';

/**
 * The meanings of the example sentences (verb-examples.json) in the helper languages: one file per
 * language, the same order (verb → [Präsens 9, Perfekt 9]). Only the language the learner reads is
 * loaded. German needs no meaning line.
 */
export type ExampleMeanings=Record<string,readonly [readonly string[],readonly string[]]>;
type Loader=()=>Promise<{default:unknown}>;
const loaders:Partial<Record<VaultLanguage,Loader>>={
 tr:()=>import('./verb-examples.tr.json'),
 en:()=>import('./verb-examples.en.json'),
 ar:()=>import('./verb-examples.ar.json'),
 uk:()=>import('./verb-examples.uk.json'),
 fr:()=>import('./verb-examples.fr.json'),
 es:()=>import('./verb-examples.es.json'),
 ru:()=>import('./verb-examples.ru.json'),
 fa:()=>import('./verb-examples.fa.json'),
 pl:()=>import('./verb-examples.pl.json'),
 it:()=>import('./verb-examples.it.json'),
 pt:()=>import('./verb-examples.pt.json'),
 ku:()=>import('./verb-examples.ku.json'),
 sq:()=>import('./verb-examples.sq.json'),
 ro:()=>import('./verb-examples.ro.json'),
 bg:()=>import('./verb-examples.bg.json'),
 hbs:()=>import('./verb-examples.hbs.json'),
 el:()=>import('./verb-examples.el.json'),
 vi:()=>import('./verb-examples.vi.json'),
 prs:()=>import('./verb-examples.prs.json'),
 ps:()=>import('./verb-examples.ps.json'),
 ti:()=>import('./verb-examples.ti.json'),
 so:()=>import('./verb-examples.so.json'),
 zh:()=>import('./verb-examples.zh.json'),
 hi:()=>import('./verb-examples.hi.json'),
 ur:()=>import('./verb-examples.ur.json'),
 ja:()=>import('./verb-examples.ja.json'),
 ko:()=>import('./verb-examples.ko.json'),
 nl:()=>import('./verb-examples.nl.json'),
 hu:()=>import('./verb-examples.hu.json'),
 cs:()=>import('./verb-examples.cs.json'),
};
export const exampleMeaningLanguages=Object.keys(loaders) as VaultLanguage[];
const cache=new Map<VaultLanguage,Promise<ExampleMeanings|null>>();
/** The meanings in one language (null for German or when the file cannot be loaded). */
export function loadExampleMeanings(language:VaultLanguage):Promise<ExampleMeanings|null>{
 const load=loaders[language];if(!load)return Promise.resolve(null);
 let pending=cache.get(language);
 if(!pending){pending=load().then(module=>module.default as ExampleMeanings).catch(()=>{cache.delete(language);return null;});cache.set(language,pending);}
 return pending;
}
/** The meaning of one sentence: verb, tense and the person's place (0 = ich … 8 = Sie). */
export function exampleMeaning(meanings:ExampleMeanings|null|undefined,verbId:string,tense:'praesens'|'perfekt',index:number):string{
 return meanings?.[verbId]?.[tense==='praesens'?0:1]?.[index]??'';
}
