import type {Question} from './course';

export const pluralNouns:Record<string,string>={bett:'Betten',brett:'Bretter',bild:'Bilder',fenster:'Fenster',herd:'Herde',stuhl:'Stühle',tisch:'Tische',regal:'Regale',schrank:'Schränke',lampe:'Lampen',teller:'Teller',tasse:'Tassen',apfel:'Äpfel',vogel:'Vögel',fisch:'Fische',blumentopf:'Blumentöpfe',teekanne:'Teekannen',spiegel:'Spiegel',sofa:'Sofas',kissen:'Kissen',karton:'Kartons',eimer:'Eimer',leiter:'Leitern',schaufel:'Schaufeln',schubkarre:'Schubkarren',hammer:'Hämmer',bohrmaschine:'Bohrmaschinen',spaten:'Spaten',ziegelstein:'Ziegelsteine'};

/** The final noun determines the gender of a German compound. */
export const compoundHeads:Record<string,string>={dachboden:'der Boden',wasserhahn:'der Hahn',waschbecken:'das Becken',kofferradio:'das Radio',kuehlschrank:'der Schrank',plattenspieler:'der Spieler',ziegelstein:'der Stein',haustuer:'die Tür',blumentopf:'der Topf',teekanne:'die Kanne',tischdecke:'die Decke',bilderrahmen:'der Rahmen',buegeleisen:'das Eisen'};

export const isArticleChallenge=(q:Question|undefined)=>!!q&&!!q.objectId&&q.kind==='write'&&!!q.gap&&/^(der|die|das)$/.test(q.answer);
export const articleNoun=(q:Question)=>q.articlePuzzle?.noun??q.gap?.replace(/^___\s*/,'')??'';
export const articleFullAnswer=(q:Question)=>q.articlePuzzle?.fullAnswer??q.answer+' '+articleNoun(q);
export const articleChallengeKind=(q:Question)=>q.articlePuzzle?.variant==='plural'?'plural':compoundHeads[q.objectId??'']?'compound':'article';

export const wordContrasts:Record<string,string>={bett:'brett',brett:'bett',stecker:'steckdose',steckdose:'stecker',sessel:'sofa',sofa:'sessel',schrank:'regal',regal:'schrank',stuhl:'hocker',hocker:'stuhl',matratze:'bett',treppe:'leiter'};
