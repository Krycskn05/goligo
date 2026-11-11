/**
 * The pictures of Lektion 5 „Alltag und Freizeit“: the learner's 3D pictures (lektion5-tum-gorseller.zip, 9 November
 * 2026, made in ChatGPT from our list Claude outputs/lektion5-resim-listesi.txt; the eleven sheets were cut along their
 * ivory gaps and the four covers resized by a scratch script) live in public/toon/lektion5 — the things 640 × 480, the
 * part covers 960 × 540. A few words keep the site's picture of the same verb (public/verbs, Lektion 2 and 4).
 */
const own=(name:string)=>'/toon/lektion5/'+name+'.webp';
const verb=(name:string)=>'/verbs/'+name+'.webp';
const l4=(name:string)=>'/toon/lektion4/'+name+'.webp';
// spaziergang-2 and unterrichten-2: the two pictures that showed the teacher were made again without him (11 November
// 2026, cut from the site's own pictures: Nora with the dog, Nora at the board) until the learner's new ones come.
export const alltagPic={
 // Teil A: the day
 duschen:own('duschen'),fruehstuecken:own('fruehstuecken'),zurArbeit:own('zur-arbeit-gehen'),insBett:own('ins-bett-gehen'),
 surfen:own('im-internet-surfen'),kochen:own('kochen'),lebensmittel:own('lebensmittel-kaufen'),musik:own('musik-hoeren'),
 putzen:own('putzen'),schlafen:verb('schlafen'),telefonieren:own('telefonieren'),tischtennis:own('tischtennis-spielen'),
 sport:own('sport-machen'),arbeiten:own('arbeiten'),kaffee:own('kaffee-trinken'),lernen:own('deutsch-lernen'),
 morgen:own('morgen'),vormittag:own('vormittag'),mittag:own('mittag'),nachmittag:own('nachmittag'),abend:own('abend'),nacht:own('nacht'),
 // Teil B: free time and the city
 film:own('film-sehen'),fahrrad:own('fahrrad-fahren'),laufen:verb('laufen'),essen:verb('essen'),treffen:verb('treffen'),lesen:verb('lesen'),
 sprechen:verb('sprechen'),schwimmen:verb('schwimmen'),spaziergang:own('spaziergang-2'),picknick:own('picknick'),fussball:own('fussball-spielen'),grillen:own('grillen'),
 tanzen:'/toon/lektion2/b-tanzen.webp',
 stadt:own('stadt'),park:own('park'),zoo:own('zoo'),kino:own('kino'),schwimmbad:own('schwimmbad'),bibliothek:own('bibliothek'),
 cafe:l4('cafe'),restaurant:own('restaurant'),sprachcafe:own('sprachcafe'),
 // Teil C: the boxing club and the week
 boxen:own('boxen'),verein:own('verein'),kinderkurs:own('kinderkurs'),hausaufgaben:own('hausaufgaben'),jugendliche:own('jugendliche'),trainieren:own('trainieren'),
 woche:own('woche'),wochenende:own('wochenende'),anmeldung:own('anmeldung'),preis:own('preis'),
 // Teil C: what you think (the faces of Alıştırma 5)
 spass:own('spass'),interessant:own('interessant'),langweilig:own('langweilig'),weissNicht:own('weiss-nicht'),nichtSoGern:own('nicht-so-gern'),kommeAuch:own('ich-komme-auch'),
 // Teil D: a hobby that is a job
 kochkurs:own('kochkurs'),kellnerin:own('kellnerin'),interview:own('interview'),trainer:own('basketball-trainer'),schwimmkurs:own('schwimmkurs'),pantomime:own('pantomime'),
 unterrichten:own('unterrichten-2'),plakate:own('plakate'),langeSchlafen:own('lange-schlafen'),hobby:own('hobby'),beruf:own('beruf'),
} as const;

/** The part covers (960 × 540): A Mei and Nikos at the café, B Sabine's tips in the park, C the boxing club, D Mei's cooking course. */
const cover=(part:string)=>({src:own('kapak-'+part),width:960,height:540});
export const alltagCovers={a:cover('a'),b:cover('b'),c:cover('c'),d:cover('d')} as const;
