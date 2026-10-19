/**
 * The site languages: one list for every page (lessons, Ev ve Yaşam, Nesne Kasası, Fiil Atölyesi).
 * The order matters: text tuples in the code are written in this order (tr de en ar uk fr, the vault
 * copy also es ru fa pl it pt). A language that a tuple does not contain reads its text from a
 * language pack (lib/language-packs/<id>.json, English text → translation) that is loaded on demand.
 */
export const siteLanguages=[
 {id:'tr',label:'Türkçe',dir:'ltr',locale:'tr-TR'},
 {id:'de',label:'Deutsch',dir:'ltr',locale:'de-DE'},
 {id:'en',label:'English',dir:'ltr',locale:'en-GB'},
 {id:'ar',label:'العربية',dir:'rtl',locale:'ar'},
 {id:'uk',label:'Українська',dir:'ltr',locale:'uk-UA'},
 {id:'fr',label:'Français',dir:'ltr',locale:'fr-FR'},
 {id:'es',label:'Español',dir:'ltr',locale:'es-ES'},
 {id:'ru',label:'Русский',dir:'ltr',locale:'ru-RU'},
 {id:'fa',label:'فارسی',dir:'rtl',locale:'fa-IR'},
 {id:'pl',label:'Polski',dir:'ltr',locale:'pl-PL'},
 {id:'it',label:'Italiano',dir:'ltr',locale:'it-IT'},
 {id:'pt',label:'Português',dir:'ltr',locale:'pt-BR'},
 {id:'ku',label:'Kurdî (Kurmancî)',dir:'ltr',locale:'ku'},
 {id:'sq',label:'Shqip',dir:'ltr',locale:'sq-AL'},
 {id:'ro',label:'Română',dir:'ltr',locale:'ro-RO'},
 {id:'bg',label:'Български',dir:'ltr',locale:'bg-BG'},
 {id:'hbs',label:'Bosanski / Hrvatski / Srpski',dir:'ltr',locale:'hr-HR'},
 {id:'el',label:'Ελληνικά',dir:'ltr',locale:'el-GR'},
 {id:'vi',label:'Tiếng Việt',dir:'ltr',locale:'vi-VN'},
 {id:'prs',label:'دری',dir:'rtl',locale:'fa-AF'},
 {id:'ps',label:'پښتو',dir:'rtl',locale:'ps-AF'},
 {id:'ti',label:'ትግርኛ',dir:'ltr',locale:'ti-ER'},
 {id:'so',label:'Soomaali',dir:'ltr',locale:'so-SO'},
 {id:'zh',label:'中文（简体）',dir:'ltr',locale:'zh-CN'},
 {id:'hi',label:'हिन्दी',dir:'ltr',locale:'hi-IN'},
 {id:'ur',label:'اردو',dir:'rtl',locale:'ur-PK'},
 {id:'ja',label:'日本語',dir:'ltr',locale:'ja-JP'},
 {id:'ko',label:'한국어',dir:'ltr',locale:'ko-KR'},
 {id:'nl',label:'Nederlands',dir:'ltr',locale:'nl-NL'},
 {id:'hu',label:'Magyar',dir:'ltr',locale:'hu-HU'},
 {id:'cs',label:'Čeština',dir:'ltr',locale:'cs-CZ'},
] as const;

export type SiteLanguage=typeof siteLanguages[number]['id'];
export type LanguagePack=Readonly<Record<string,string>>;

const positions=new Map<string,number>(siteLanguages.map((item,index)=>[item.id,index]));
export const isSiteLanguage=(value:unknown):value is SiteLanguage=>typeof value==='string'&&positions.has(value);
/** The language's place in the master order (= its index in the text tuples); 0 (Turkish) for unknown values. */
export const siteLanguageIndex=(language:SiteLanguage)=>positions.get(language)??0;
export const languageDirection=(language:SiteLanguage):'rtl'|'ltr'=>siteLanguages[siteLanguageIndex(language)].dir;
export const languageLocale=(language:SiteLanguage)=>siteLanguages[siteLanguageIndex(language)].locale;

/** Languages whose texts are written in the code tuples themselves (every tuple has at least these six). */
const builtIn=new Set<SiteLanguage>(['tr','de','en','ar','uk','fr']);
type PackLoader=()=>Promise<{default:unknown}>;
const loaders:Partial<Record<SiteLanguage,PackLoader>>={
 es:()=>import('./language-packs/es.json'),
 ru:()=>import('./language-packs/ru.json'),
 fa:()=>import('./language-packs/fa.json'),
 pl:()=>import('./language-packs/pl.json'),
 it:()=>import('./language-packs/it.json'),
 pt:()=>import('./language-packs/pt.json'),
 ku:()=>import('./language-packs/ku.json'),
 sq:()=>import('./language-packs/sq.json'),
 ro:()=>import('./language-packs/ro.json'),
 bg:()=>import('./language-packs/bg.json'),
 hbs:()=>import('./language-packs/hbs.json'),
 el:()=>import('./language-packs/el.json'),
 vi:()=>import('./language-packs/vi.json'),
 prs:()=>import('./language-packs/prs.json'),
 ps:()=>import('./language-packs/ps.json'),
 ti:()=>import('./language-packs/ti.json'),
 so:()=>import('./language-packs/so.json'),
 zh:()=>import('./language-packs/zh.json'),
 hi:()=>import('./language-packs/hi.json'),
 ur:()=>import('./language-packs/ur.json'),
 ja:()=>import('./language-packs/ja.json'),
 ko:()=>import('./language-packs/ko.json'),
 nl:()=>import('./language-packs/nl.json'),
 hu:()=>import('./language-packs/hu.json'),
 cs:()=>import('./language-packs/cs.json'),
};
/** Languages that read (part of) their texts from a language pack. */
export const packLanguages=Object.keys(loaders) as SiteLanguage[];

const packs=new Map<SiteLanguage,LanguagePack>();
const pending=new Map<SiteLanguage,Promise<void>>();
let listener:((language:SiteLanguage,english:string)=>void)|null=null;
/** Test/coverage hook: called with every English text that is looked up in a pack. */
export function setPackListener(next:((language:SiteLanguage,english:string)=>void)|null){listener=next;}
export function registerLanguagePack(language:SiteLanguage,pack:LanguagePack){packs.set(language,pack);}
export function hasLanguagePack(language:SiteLanguage){return builtIn.has(language)||!loaders[language]||packs.has(language);}
/** Loads the language's pack once. Never rejects: on failure the English texts are shown and a later call retries. */
export function loadLanguagePack(language:SiteLanguage):Promise<void>{
 const load=loaders[language];
 if(!load||packs.has(language))return Promise.resolve();
 let job=pending.get(language);
 if(!job){
  job=load().then(module=>{const data=(module.default??module) as LanguagePack;packs.set(language,data&&typeof data==='object'?data:{});}).catch(()=>{}).finally(()=>{pending.delete(language);});
  pending.set(language,job);
 }
 return job;
}
/** A text from the language pack, by its English original (the English text itself when missing). */
export function packText(language:SiteLanguage,english:string):string{
 listener?.(language,english);
 if(!english)return english;
 return packs.get(language)?.[english]||english;
}
/** Picks the language's text from a tuple ordered like siteLanguages; later languages use the pack. */
export function pickText(tuple:readonly string[],language:SiteLanguage):string{
 const index=siteLanguageIndex(language);
 return index<tuple.length?tuple[index]:packText(language,tuple[2]??'');
}
