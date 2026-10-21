/**
 * The welcome tour (the learner asked: after signing up, everyone is first asked about the sounds and then shown
 * around the site). Design "Spot ışığı" (the learner chose it): the page dims, the real part of the page lights up and
 * Paul explains it in a card next to it. Shown once in each browser (new members right after signing up, members
 * who were already there on their next visit to the home page); Hesabım can start it again ("/?tur=1"). Once per
 * member (the learner asked: not on every visit): the account keeps a note `tour` = done as soon as the tour opens,
 * so it does not come back on another device or after leaving it half way.
 */
export const TOUR_KEY='lernkoko-tour-v1';
export const TOUR_DONE='done';
export const TOUR_PARAM='tur';

export type TourStepId='sounds'|'clock'|'language'|'effects'|'account'|'units'|'vault'|'verbs'|'games'|'mistakes'|'install'|'done';
/** The steps in order: the sound window first, then the header from left to right, then the menu from top to bottom,
 * then "Hazırsın!". `target` is the part of the page that lights up (none for the two windows); a step whose part is
 * not on the screen (for example "Uygulama olarak indir" inside the installed app) is left out. */
export const TOUR_STEPS:readonly {id:TourStepId;target:string|null}[]=[
 {id:'sounds',target:null},
 {id:'clock',target:'.site-greeting'},
 {id:'language',target:'.site-language'},
 {id:'effects',target:'.lk-effects-button'},
 {id:'account',target:'.site-account'},
 {id:'units',target:'.work-nav[href="/konular"]'},
 {id:'vault',target:'.work-nav[href^="/ev-esyalar"]'},
 {id:'verbs',target:'.work-nav.verb-nav-link'},
 {id:'games',target:'[data-verb-section-link="games"]'},
 {id:'mistakes',target:'[data-verb-section-link="mistakes"]'},
 {id:'install',target:'.ig-trigger'},
 {id:'done',target:null},
];

/** The member's note in the account (app/api/study: GET ?note=tour, POST action note). */
export const TOUR_NOTE='tour';
/** Hesabım's "Site turunu başlat" opens it again (?tur=1). */
export function tourReplay(search:string){return new URLSearchParams(search).get(TOUR_PARAM)==='1';}
/**
 * What the home page does: `skip` when the account has seen the tour; `sync` when only this browser has (from before
 * the account kept it) — tell the account and skip; otherwise `show` it and tell the account at once.
 */
export function tourPlan(account:string|null|undefined,browser:string|null):'show'|'sync'|'skip'{
 if(account===TOUR_DONE)return 'skip';
 return browser===TOUR_DONE?'sync':'show';
}

export type Box={left:number;top:number;width:number;height:number};
export type TipSide='right'|'left'|'below'|'above';
export type TipPlace={left:number;top:number;side:TipSide;arrow:number};
const clamp=(value:number,low:number,high:number)=>Math.max(low,Math.min(high,value));

/**
 * Where Paul's card goes next to the lit part: on a wide screen beside a menu item (left or, right to left, right); otherwise below it,
 * above it, or beside it — the first place where the whole card fits on the screen (kept 12 px from the edges).
 * `arrow` is how far along the card's edge its little arrow points at the middle of the part.
 */
export function placeTip(target:Box,tip:{width:number;height:number},view:{width:number;height:number},gap=18,margin=12):TipPlace{
 const right=target.left+target.width,bottom=target.top+target.height;
 const middleX=target.left+target.width/2,middleY=target.top+target.height/2;
 const across=(top:number,side:TipSide):TipPlace=>{const left=clamp(middleX-tip.width/2,margin,view.width-margin-tip.width);return {left,top,side,arrow:clamp(middleX-left,24,tip.width-24)};};
 const beside=(left:number,side:TipSide):TipPlace=>{const top=clamp(middleY-tip.height/2,margin,view.height-margin-tip.height);return {left,top,side,arrow:clamp(middleY-top,24,tip.height-24)};};
 const options:Record<TipSide,()=>TipPlace|null>={
  right:()=>right+gap+tip.width<=view.width-margin?beside(right+gap,'right'):null,
  left:()=>target.left-gap-tip.width>=margin?beside(target.left-gap-tip.width,'left'):null,
  below:()=>bottom+gap+tip.height<=view.height-margin?across(bottom+gap,'below'):null,
  above:()=>target.top-gap-tip.height>=margin?across(target.top-gap-tip.height,'above'):null,
 };
 // The side menu: on the left, or on the right in right-to-left languages (Arabic, Persian, Dari, Pashto, Urdu).
 const wide=view.width>=761&&target.top>view.height*.15,menuLeft=wide&&right<view.width*.3,menuRight=wide&&target.left>view.width*.7;
 const order:TipSide[]=menuLeft?['right','below','above','left']:menuRight?['left','below','above','right']:['below','above','right','left'];
 for(const side of order){const place=options[side]();if(place)return place;}
 return across(clamp(bottom+gap,margin,Math.max(margin,view.height-margin-tip.height)),'below');
}
