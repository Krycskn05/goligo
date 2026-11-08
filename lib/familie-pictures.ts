/**
 * The pictures of Lektion 4: the learner's 3D pictures (GOLIQO-Lektion4-3D-Tum-Gorseller.zip, 8 November 2026, made in
 * ChatGPT from our list Claude outputs/lektion4-resim-listesi.txt; the ten 2 × 3 sheets were cut along their ivory gaps
 * and the four covers resized by a scratch script) live in public/toon/lektion4 — the things 640 × 480, the part covers
 * 960 × 540. The course room and a few things keep the pictures the site already had (Lektion 2 and 3, the Kelime
 * Kasası). A word without a picture would show its emoji (app/familie-steps.tsx `Thing`).
 */
const own=(name:string)=>'/toon/lektion4/'+name+'.webp';
const l3=(name:string)=>'/toon/lektion3/'+name+'.webp';
const vault=(name:string)=>'/objects/toon/'+name+'.webp';
export const familiePic={
 // Teil A: the family
 familie:own('familie'),eltern:own('eltern'),mutter:own('mutter'),vater:own('vater'),kind:own('kind'),baby:own('baby'),
 sohn:own('sohn'),tochter:own('tochter'),geschwister:own('geschwister'),bruder:own('bruder'),schwester:own('schwester'),grosseltern:own('grosseltern'),
 oma:own('oma'),opa:own('opa'),tante:own('tante'),onkel:own('onkel'),cousine:own('cousine'),cousin:own('cousin'),
 // Teil B: Familienstand, the house, the job
 ehemann:own('ehemann'),ehefrau:own('ehefrau'),enkel:own('enkel'),enkelin:own('enkelin'),garten:own('garten'),auto:own('auto'),
 chef:own('chef'),chefin:own('chefin'),job:own('job'),ledig:own('ledig'),verheiratet:own('verheiratet'),geschieden:own('geschieden'),
 haus:'/toon/lektion2/haus.webp',kiosk:l3('kiosk'),laptop:l3('laptop'),handy:l3('handy'),computer:l3('computer'),
 // Teil C: neighbours, the café, the interview
 nachbar:own('nachbar'),nachbarin:own('nachbarin'),cafe:own('cafe'),exfrau:own('ex-frau'),exmann:own('ex-mann'),besuchen:own('besuchen'),gespraech:own('gespraech'),privat:own('privat'),million:own('million'),
 kennen:own('kennen'),leben:own('leben'),denken:'/verbs/denken.webp',woerterbuch:l3('woerterbuch'),
 // Teil D: the course room (the Kelime Kasası draws most of it), the shapes and the opposites of the board
 tafel:vault('schule-tafel'),lampe:vault('3d-lampe'),heizung:vault('3d-heizung'),steckdose:vault('3d-steckdose'),lichtschalter:vault('schule-lichtschalter'),
 landkarte:vault('schule-landkarte'),kreide:vault('schule-kreide'),lineal:vault('schule-lineal'),radiergummi:vault('schule-radiergummi'),papierkorb:vault('schule-papierkorb'),
 kabel:vault('3d-kabel'),tuerklinke:vault('schule-tuerklinke'),fenster:l3('fenster'),tuer:vault('schule-tuer'),
 wanduhr:own('wanduhr'),klimaanlage:own('klimaanlage'),lautsprecher:own('lautsprecher'),leinwand:own('leinwand'),garderobe:own('garderobe'),smartboard:own('smartboard'),
 gedicht:own('gedicht'),
 rund:own('rund'),oval:own('oval'),quadratisch:own('quadratisch'),rechteckig:own('rechteckig'),dreieckig:own('dreieckig'),gemustert:own('gemustert'),
 grossKlein:own('gross-klein'),jungAlt:own('jung-alt'),neuAlt:own('neu-alt'),langKurz:own('lang-kurz'),dickDuenn:own('dick-duenn'),schlankDick:own('schlank-dick'),
 // things of the exercises and the summary
 tisch:l3('tisch'),stuhl:l3('stuhl'),bett:l3('bett'),sofa:l3('sofa'),regal:l3('regal'),schrank:l3('schrank'),schere:vault('gesundheit-schere'),
 buch:vault('schule-buch'),heft:vault('schule-heft'),foto:vault('schule-foto'),
} as const;

/** The part covers (960 × 540): A Rami and Nikos in the park, B Mei's future, C Nora's interview, D the course room. */
const cover=(part:string)=>({src:own('kapak-'+part),width:960,height:540});
export const familieCovers={a:cover('a'),b:cover('b'),c:cover('c'),d:cover('d')} as const;
