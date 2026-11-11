/**
 * How a name is spelled aloud in A1 sınavı — in the spelling practice (lib/a1-exam-spell.ts, where the measuring of
 * the voices is written down) and in the Hören exams' question „Wie buchstabiert man den Namen?“. A spelled name has
 * three texts: on the paper "K – R – Ü – G – E – R", for the natural site voices "Kah, Err, Üh, Geh, E, Err", for the
 * device voice "K, R, Ü, G, E, R".
 */
/** The German name of every letter as it is shown with an answer ("W = Weh"): the names of the alphabet lesson
 * (lib/willkommen-b-course.ts), and "A-Umlaut" for Ä. */
export const LETTER_NAME:Readonly<Record<string,string>>={
 A:'Ah',B:'Beh',C:'Zeh',D:'Deh',E:'Eh',F:'Eff',G:'Geh',H:'Hah',I:'Ih',J:'Jot',K:'Kah',L:'Ell',M:'Emm',N:'Enn',O:'Oh',P:'Peh',Q:'Kuh',R:'Err',S:'Ess',T:'Teh',
 U:'Uh',V:'Vau',W:'Weh',X:'Ix',Y:'Ypsilon',Z:'Zett','Ä':'A-Umlaut','Ö':'Öh','Ü':'Üh','ß':'Eszett',
};
/** What the natural site voices read for a letter: its name, except E (the plain letter) and Ä ("Ah Umlaut") — see above. */
export const LETTER_SAY:Readonly<Record<string,string>>={...LETTER_NAME,E:'E','Ä':'Ah Umlaut'};
/** The letters of a name in capitals (ß stays ß). */
export const nameLetters=(name:string)=>[...name].filter(letter=>/[A-Za-zÄÖÜäöüß]/.test(letter)).map(letter=>letter==='ß'?'ß':letter.toUpperCase());
/** "Krüger" → "K – R – Ü – G – E – R" (shown after the practice). */
export const spellShown=(name:string)=>nameLetters(name).join(' – ');
/** "Krüger" → "Kah, Err, Üh, Geh, E, Err" (read by the natural site voices). */
export const spellSay=(name:string)=>nameLetters(name).map(letter=>LETTER_SAY[letter]).join(', ');
/** "Krüger" → "K, R, Ü, G, E, R" (read by the device voice). */
export const spellDevice=(name:string)=>nameLetters(name).join(', ');
