import {t,type StudyLanguage} from '@/lib/study-languages';
export const signData:Record<string,{title:string;rows:string[][]}>={
 market:{title:'Supermarkt',rows:[['Mo–Sa','07:00–22:00'],['So','geschlossen']]},
 salon:{title:'Friseur',rows:[['Di–Sa','08:00–20:00'],['Mo','geschlossen']]},
 doctor:{title:'Arztpraxis',rows:[['Mo–Do','09:00–12:00'],['Fr','09:00–11:00']]},
 post:{title:'Post',rows:[['Mo–Fr','07:30–18:00'],['Sa','10:00–12:00'],['So','geschlossen']]},
 pharmacy:{title:'Apotheke',rows:[['Mo–Fr','09:00–19:00'],['Sa','09:00–15:00'],['So','geschlossen']]},
 office:{title:'Bürgerbüro',rows:[['Mo, Mi, Fr','09:00–19:00'],['Di, Do','11:00–18:00'],['Sa, So','geschlossen']]},
};
export function StudyVisual({image,language='tr'}:{image:{src:string;alt:string;caption?:string};language?:StudyLanguage}){
 const file=image.src.split('/').pop()?.split('.')[0]??'';const sign=signData[file];
 const sceneDescription:Record<string,string>={kolja:'Ein Mann sitzt krank im Bett und hält sich die Stirn.',suri:'Eine müde Frau liegt im Bett; ein Wecker steht daneben.',germain:'Ein Mann schaut in einen leeren Kühlschrank.'};
 return sign?<figure className="study-sign" dir="ltr" lang="de"><header><svg viewBox="0 0 64 64" aria-hidden="true" width="44" height="44"><path d="M10 27h44M13 27v29h38V27M8 27l7-17h34l7 17M23 56V37h18v19" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/><path d="M17 10v17m10-17v17m10-17v17m10-17v17" stroke="currentColor" strokeWidth="2"/></svg><div><h3>{sign.title}</h3><p>Öffnungszeiten</p></div></header><table><caption className="sr-only">{sign.title} · Öffnungszeiten</caption><thead className="sr-only"><tr><th scope="col">Tag</th><th scope="col">Uhrzeit</th></tr></thead><tbody>{sign.rows.map(([day,time])=><tr key={day}><th scope="row">{day}</th><td>{time}</td></tr>)}</tbody></table><figcaption>Beispielschild · A1.1</figcaption></figure>:<figure className="visual-question"><img src={image.src} width="768" height="512" alt={sceneDescription[file]??image.alt} lang="de"/><figcaption>{t(language,'originalArt')}</figcaption></figure>;
}
