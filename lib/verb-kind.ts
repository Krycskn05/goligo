import {praesensPersons,type Verb} from './verb-course';
import {verbPrefix} from './verb-logic';

/**
 * Regular (düzenli), irregular (düzensiz) or modal verb, worked out from the forms themselves:
 * a regular verb keeps its stem in the Präsens (er macht) and builds the Partizip with ge…t (gemacht).
 * Mixed verbs like bringen → gebracht or kennen → gekannt count as irregular, because the stem changes.
 */
export type VerbKind='regular'|'irregular'|'modal';
export const modalVerbs:ReadonlySet<string>=new Set(['können','müssen','dürfen','sollen','wollen','mögen','möchten']);
const inseparable=/^(be|emp|ent|er|ge|miss|ver|zer)/;
export type VerbKindInfo={kind:VerbKind;stemChange:boolean;irregularPartizip:boolean;changedPersons:readonly ('du'|'er')[]};
export function verbKindInfo(verb:Verb):VerbKindInfo{
 const prefix=verbPrefix(verb);const base=verb.infinitive.slice(prefix.length);const stem=base.replace(/e?n$/,'');
 if(modalVerbs.has(base))return {kind:'modal',stemChange:false,irregularPartizip:false,changedPersons:[]};
 const forms=praesensPersons(verb);const strip=(form:string)=>prefix?form.slice(0,-(prefix.length+1)):form;
 const dt=/[dt]$/.test(stem)||/[^aeiouäöülrhmn][mn]$/.test(stem);
 const regularEr=stem+(dt?'et':'t');const regularDu=stem+(dt?'est':/[sßxz]$/.test(stem)?'t':'st');
 const changedPersons=([['du',strip(forms.du)!==regularDu],['er',strip(forms.er)!==regularEr]] as const).filter(([,changed])=>changed).map(([person])=>person);
 const stemChange=changedPersons.length>0;
 const regularPartizip=prefix+(inseparable.test(base)||/ieren$/.test(base)?'':'ge')+stem+(dt?'et':'t');
 const irregularPartizip=verb.participle!==regularPartizip;
 return {kind:stemChange||irregularPartizip?'irregular':'regular',stemChange,irregularPartizip,changedPersons};
}
export function verbKind(verb:Verb):VerbKind{return verbKindInfo(verb).kind;}
