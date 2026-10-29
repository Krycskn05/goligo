// The home page on a computer is one screen (the learner asked, 25 and 29 October 2026: no scrolling down): the page is
// exactly as high as the window, the pictures take the height that is left, phones are left alone.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=file=>fs.readFileSync(file,'utf8');

/** The body of the first @media block that starts with the given text. */
function block(css,start){
 const at=css.indexOf(start);assert.ok(at>=0,start);
 let depth=0;for(let i=css.indexOf('{',at);i<css.length;i++){if(css[i]==='{')depth++;else if(css[i]==='}'&&--depth===0)return css.slice(at,i+1);}
 throw new Error('unclosed '+start);
}

test('computers: header, cards and footer share the window height',()=>{
 const css=read('app/home-tour.css');
 const wide=block(css,'@media (min-width:761px) {\n .category-app:has(.ht)');
 assert.ok(wide.includes('.category-app:has(.ht) { display:flex; flex-direction:column; height:100vh; height:100dvh; min-height:600px; }'),'the page is the window high');
 assert.ok(wide.includes('.category-app:has(.ht)>.work-layout { flex:1 1 0; min-height:0;'),'the cards get what is left');
 assert.ok(wide.includes('.category-app:has(.ht)>.site-copyright { flex:none;'),'the footer stays on the screen');
 assert.ok(wide.includes('grid-template-rows:repeat(2,minmax(0,auto)); align-content:start;'),'two rows that may shrink but never stretch');
 assert.ok(wide.includes('container-type:inline-size;')&&wide.includes('height:50cqw; min-height:64px;'),'pictures at most 2 : 1, shrinking with the window');
 assert.ok(wide.includes('.ht .ht-grid>li:first-child .ht-art { height:calc(25cqw - 10.5px); }'),'the wide card picture is as high as its neighbour');
 assert.ok(wide.includes('min-height:calc(3 * 1.45em)'),'the same text block on every card keeps the pictures of a row equally high');
 assert.ok(!/\(100d?vh - \d+px\) \/ 2/.test(css),'no guessed header height any more');
 // Low windows: two text lines and the short left menu, also on tablets.
 assert.ok(css.includes('@media (min-width:761px) and (max-height:700px) { .ht-text { min-height:calc(2 * 1.45em); -webkit-line-clamp:2; } }'));
 const low=block(css,'@media (min-width:761px) and (max-height:860px) {\n .category-app:has(.ht) .work-sidebar');
 assert.ok(low.includes('.category-app:has(.ht) .work-sidebar .work-nav { min-height:0; padding:.38rem .8rem; }'));
});

test('phones keep the long home page',()=>{
 const css=read('app/home-tour.css');
 const phone=block(css,'@media (max-width:760px) {\n .ht-hero');
 assert.ok(!phone.includes(':has(.ht)')&&!phone.includes('100dvh'),'nothing of the one-screen layout below 761 px');
});
