import type {SiteLanguage} from './site-languages';
import {fillText} from './copy-fill';

/**
 * Lektion 1 „Willkommen!“, Lektion 2 „Berufe“ and Lektion 15 „Wege in der Stadt“ in English, Arabic and Ukrainian (the
 * learner asked, 2 November 2026). The lessons are written in Turkish (lib/willkommen*-course.ts, lib/berufe*-course.ts,
 * lib/stadt-course.ts and the Turkish texts of their pages); each of these languages has a pack
 * `lib/unit-packs/<id>.json` = {Turkish: translation}, loaded with the language (`useLanguageSwitch(setLanguage,
 * loadUnitPack)`). A page shows a text through `unitT(language)`: German material is never in a pack and stays as it is;
 * a text with no translation, and every language without a pack, is shown in Turkish. {name} marks are filled in.
 */
export type UnitPack=Record<string,string>;

const loaders:Partial<Record<SiteLanguage,()=>Promise<unknown>>>={
 en:()=>import('./unit-packs/en.json'),ar:()=>import('./unit-packs/ar.json'),uk:()=>import('./unit-packs/uk.json'),
 // German explanations (the learner asked, 3 November 2026: every unit in tr, en, ar, uk and de).
 de:()=>import('./unit-packs/de.json'),
};
/** The languages with a pack for these lessons (Turkish is the original). */
export const unitPackLanguages=Object.keys(loaders) as SiteLanguage[];

const packs=new Map<string,UnitPack>();
const pending=new Map<string,Promise<void>>();
export function registerUnitPack(language:string,pack:UnitPack){packs.set(language,pack);}
export function hasUnitPack(language:string){return language==='tr'||packs.has(language);}
/** Loads the language's pack once. Never rejects: on failure the Turkish texts are shown and a later call retries. */
export function loadUnitPack(language:string):Promise<void>{
 const load=loaders[language as SiteLanguage];
 if(!load||packs.has(language))return Promise.resolve();
 let job=pending.get(language);
 if(!job){
  job=load().then(module=>{const data=((module as {default?:unknown}).default??module) as UnitPack;registerUnitPack(language,data&&typeof data==='object'?data:{});}).catch(()=>{}).finally(()=>{pending.delete(language);});
  pending.set(language,job);
 }
 return job;
}

/** One Turkish text of these lessons in the language (the text itself when the pack has none). */
export function unitText<T extends string|undefined>(language:string,text:T,params?:Record<string,string|number>):T{
 if(text===undefined)return text;
 const pack=language==='tr'?undefined:packs.get(language);
 const out=pack&&Object.prototype.hasOwnProperty.call(pack,text)?pack[text]:text;
 return (params?fillText(out,params):out) as T;
}
/** The translator of a page or a step: `const u=unitT(language)`, then `u('Türkçe metin')` or `u(item.tr)`. */
export const unitT=(language:string)=><T extends string|undefined>(text:T,params?:Record<string,string|number>):T=>unitText(language,text,params);
export type UnitT=ReturnType<typeof unitT>;

/*
 * The language of the lesson page on the screen. A lesson page only mounts in the browser, one at a time, and holds the
 * language in its own state, so it sets it here while it renders (`setUnitLanguage`) and every step, exercise and helper
 * below it shows its texts with `ut('Türkçe metin')` without passing the language down. Texts kept in state (the line
 * under an exercise) stay Turkish with their {marks} and are translated where they are shown.
 */
let current='tr';
export function setUnitLanguage(language:string){current=language;}
export function ut<T extends string|undefined>(text:T,params?:Record<string,string|number>):T{return unitText(current,text,params);}
/** Loose comparison: case, a leading article, markup and punctuation do not count. */
const loose=(text:string)=>text.toLowerCase().replace(/[*~_|·]/g,' ').replace(/^\s*(der|die|das)\s+/,'').replace(/[.!?,;:„“"()…–—-]+/g,' ').replace(/\s+/g,' ').trim();
/**
 * A meaning shown beside German, or a prompt whose answer is German: nothing when, in the help language, it would only
 * repeat that German (with German help „Italien – Italien“, or a „build this sentence“ prompt that gives the answer away).
 */
export function utBeside(german:string,text:string,params?:Record<string,string|number>):string{
 const shown=unitText(current,text,params);return current!=='tr'&&loose(shown)===loose(german)?'':shown;
}
/** The lang of a Turkish text where it is shown: 'tr' while it is still Turkish, otherwise the page's language. */
export function utLang(text:string){return unitText(current,text)===text?'tr':current;}
