const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');
const read=file=>fs.readFileSync(file,'utf8');

// Site check, 5 November 2026: on Arabic (and the other right-to-left) pages German lines lost their order —
// "?Guten Tag! Wie heißen Sie", "!Tschüss", "!A1.1 · LEKTION 1 · WILLKOMMEN" — and the page said lang="de".
test('German keeps its own order on right-to-left pages',()=>{
 const css=read('app/globals.css');
 assert.ok(css.includes('[dir=rtl] :is(b,strong,i,em,mark,cite,q),\n[dir=rtl] [lang=de]:not([dir]):not(:has([lang]:not([lang=de]))) { unicode-bidi:plaintext; }'),'bold, italic and German pieces take their direction from their own text');
 assert.ok(css.includes(':where([dir=rtl] :is(b,strong):not([dir=ltr] *)) { text-align:right; }'),'a German title in the contents or a verb in the list stays on the right');
 // The lesson texts mark German in bold or with lang="de" (app/willkommen-ui.tsx), so the rule reaches them.
 const ui=read('app/willkommen-ui.tsx');
 assert.ok(ui.includes('<b key={key+i} lang="de">')&&ui.includes('<i key={key+i} lang="de">'));
});

test('the page is written in the visitor\'s language and direction',()=>{
 const layout=read('app/layout.tsx');
 assert.ok(layout.includes('export default async function RootLayout'));
 assert.ok(layout.includes('<html lang={language} dir={languageDirection(language)} suppressHydrationWarning>'));
});
