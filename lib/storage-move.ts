/**
 * Moving to the new address (the learner renamed the site Goligo and asked for the free address
 * goligo.<account>.workers.dev): the old address (lernkoko.<account>.workers.dev, ci/eski-adres) sends every request
 * to the same page on the new one. A page opened in a browser first carries that browser's saved settings along, once
 * (sounds and voice, site language, Lektion 12 progress, game records …), in the address fragment, which never reaches
 * a server. The new address takes them only when they come from its own old address, only the site's keys, never over
 * a value it already has, and only once. Sign-ins do not move: everybody signs in once more (the progress in the
 * account stays, it is in the database).
 */
export const MOVE_HASH='#goligo-tasi=';
export const MOVE_DONE_KEY='goligo-tasindi';
/** The site's own browser keys (lernkoko-…, german-…, a1-…). */
export const MOVE_KEY_PATTERN=/^(lernkoko|german|a1)[-:]/;
export const OLD_WORKER='lernkoko';

const json=(value:unknown)=>JSON.stringify(value).replace(/</g,'\\u003c');

/** Runs in the <head> of every page of the new address, before the page reads its settings. */
export const STORAGE_MOVE_SCRIPT=`(function(){try{var h=location.hash,p=${json(MOVE_HASH)};if(h.indexOf(p)!==0)return;history.replaceState(null,'',location.pathname+location.search);var host=location.host.split('.');host[0]=${json(OLD_WORKER)};var from='https://'+host.join('.')+'/';if(document.referrer.indexOf(from)!==0||localStorage.getItem(${json(MOVE_DONE_KEY)}))return;var data=JSON.parse(decodeURIComponent(h.slice(p.length)));for(var k in data){if(${MOVE_KEY_PATTERN}.test(k)&&typeof data[k]==='string'&&data[k].length<200000&&localStorage.getItem(k)===null)localStorage.setItem(k,data[k]);}localStorage.setItem(${json(MOVE_DONE_KEY)},'1');}catch(e){}})();`;

const escapeHtml=(text:string)=>text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

/** The page the old address shows for a moment: it packs this browser's settings (once) and goes to the new address. */
export function oldAddressPage(target:string){
 const script=`(function(){var to=${json(target)};try{if(!localStorage.getItem(${json(MOVE_DONE_KEY)})){var data={},n=0;for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&${MOVE_KEY_PATTERN}.test(k)){data[k]=localStorage.getItem(k);n++;}}var text=JSON.stringify(data);if(n&&text.length<1500000)to+=${json(MOVE_HASH)}+encodeURIComponent(text);localStorage.setItem(${json(MOVE_DONE_KEY)},'1');}}catch(e){}location.replace(to);})();`;
 const link=escapeHtml(target);
 return `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Goligo</title><noscript><meta http-equiv="refresh" content="0;url=${link}"></noscript><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#fdf8ec;color:#1f3b5c;font:600 18px/1.5 system-ui,sans-serif;text-align:center;padding:24px}a{color:#2f7fd6}</style></head><body><p>Goligo ist umgezogen …<br><span lang="tr">Goligo yeni adresine taşındı…</span><br><a href="${link}">${link}</a></p><script>${script}</script></body></html>`;
}

/** Where a request to the old address goes on the new one (same path and query). */
export function newAddress(requestUrl:string,newOrigin:string){
 const url=new URL(requestUrl);
 return new URL(url.pathname+url.search,newOrigin).toString();
}
