// The visitor's first page (the learner chose, 22 October 2026: design 2 "Önce dene" with the sign-up form of design 1,
// then asked for the form small and next to the title).
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const compiled=process.env.STUDY_CHECK_DIR;if(!compiled)throw Error('Set STUDY_CHECK_DIR to compiled lib directory.');
const load=name=>require(path.join(compiled,name+'.js'));
const read=file=>fs.readFileSync(file,'utf8');

test('picture, title and try it beside a small sign-up form; picture tiles for every part; what an account adds',()=>{
 const page=read('app/landing.tsx');
 const order=['<img src={pictures.welcome}','<h1 id="lk-hero-title">','data-landing-try-top','<div className="lk-hero-form" id="uye-ol" data-landing-register>','<AuthForm mode="register" returnTo="/" texts={authFormTexts(language)}/>','<ul className="lk-parts">','lk-perks'];
 let at=-1;for(const piece of order){const next=page.indexOf(piece);assert.ok(next>at,piece);at=next;}
 assert.equal(page.split('data-landing-register').length-1,1,'one sign-up button for the site check');
 assert.ok(page.includes("{part:'mistakes',title:verbText(language,'mistakesTitle'),de:'Fehler'}")&&page.includes("href={item.href??'#uye-ol'}"),'Yanlışlarım needs an account: its tile leads to the form');
 assert.ok(page.includes("de:objectVocabulary.length+' Gegenstände'")&&page.includes("de:verbs.length+' Verben'")&&page.includes("de:gameIds.length+' Spiele'"),'the counts follow the site');
 for(const key of ['perkProgress','step3','perkStreak'])assert.ok(page.includes(`key:'${key}'`),key);
 const css=read('app/members.css');
 assert.ok(css.includes('.lk-parts { list-style:none; margin:0; padding:0; display:grid; grid-template-columns:repeat(5,minmax(0,1fr));')&&css.includes('.lk-parts { grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; }'),'five tiles in a row, two on phones');
 assert.ok(css.includes('.lk-hero { display:grid; grid-template-columns:minmax(0,1.25fr) minmax(300px,.75fr);'),'the form beside the title on wide screens');
 assert.ok(css.includes('.lk-hero-form .lk-field input,.lk-hero-form .lk-password input { min-height:42px;'),'small fields');
});

test('every text of the page in every site language',()=>{
 const copy=load('guest-copy'),site=load('site-languages');
 for(const key of ['guestPickPart','guestTryShort','guestMemberTitle','guestTryText','guestTryTitle','guestLocked']){
  const tuple=copy.guestCopy[key];assert.equal(tuple.length,12,key);
  for(const language of site.packLanguages.filter(id=>site.siteLanguageIndex(id)>=12))assert.ok(JSON.parse(read('lib/language-packs/'+language+'.json'))[tuple[2]]?.trim(),language+' '+key);
 }
});
