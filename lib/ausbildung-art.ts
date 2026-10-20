/**
 * Lektion 12 pictures (made for the learner as ChatGPT sheets and cut into single pictures in
 * public/toon/lektion12): one per part, one for the listening page and one per word that can be
 * drawn. Each picture sits on its own cream background (`fill`), so it can grow to any card box.
 */
import type {L12PartId} from './ausbildung-course';

export type L12Picture={src:string;width:number;height:number;crop:{x:number;y:number;width:number;height:number};fill:string};

/** The picture of each part; the „Alles klar?" test shows Koko instead. */
export const partPictures:Record<L12PartId,L12Picture|null>={
 a:{src:"/toon/lektion12/teil-a.webp",width:475,height:527,crop:{x:0,y:0,width:475,height:527},fill:"#fef9ec"},
 b:{src:"/toon/lektion12/teil-b.webp",width:413,height:542,crop:{x:0,y:0,width:413,height:542},fill:"#fef9ec"},
 c:{src:"/toon/lektion12/teil-c.webp",width:436,height:521,crop:{x:0,y:0,width:436,height:521},fill:"#fef9ec"},
 d:{src:"/toon/lektion12/teil-d.webp",width:459,height:508,crop:{x:0,y:0,width:459,height:508},fill:"#fef9ec"},
 schreiben:{src:"/toon/lektion12/teil-schreiben.webp",width:454,height:420,crop:{x:0,y:0,width:454,height:420},fill:"#fef9ec"},
 pruefung:{src:"/toon/lektion12/teil-pruefung.webp",width:422,height:435,crop:{x:0,y:0,width:422,height:435},fill:"#fef9ec"},
 magazin:{src:"/toon/lektion12/teil-magazin.webp",width:439,height:448,crop:{x:0,y:0,width:439,height:448},fill:"#fef9ec"},
 test:null,
};
export const hoerenPicture:L12Picture={src:"/toon/lektion12/teil-hoeren.webp",width:436,height:476,crop:{x:0,y:0,width:436,height:476},fill:"#fef9ec"};

/** Word pictures, keyed by the German column of the word tables. */
export const wordPictures:Record<string,L12Picture>={
 "die Berufsschule, -n":{src:"/toon/lektion12/berufsschule.webp",width:416,height:267,crop:{x:0,y:0,width:416,height:267},fill:"#fef8e9"},
 "die Sprachschule, -n":{src:"/toon/lektion12/sprachschule.webp",width:412,height:330,crop:{x:0,y:0,width:412,height:330},fill:"#fef8e9"},
 "die Universität, -en":{src:"/toon/lektion12/universitaet.webp",width:421,height:326,crop:{x:0,y:0,width:421,height:326},fill:"#fef8e9"},
 "die Firma, Firmen":{src:"/toon/lektion12/firma.webp",width:415,height:314,crop:{x:0,y:0,width:415,height:314},fill:"#fef8e9"},
 "die VHS (Volkshochschule)":{src:"/toon/lektion12/vhs.webp",width:444,height:349,crop:{x:0,y:0,width:444,height:349},fill:"#fef8e9"},
 "der Praktikant / die Praktikantin":{src:"/toon/lektion12/praktikant.webp",width:226,height:374,crop:{x:0,y:0,width:226,height:374},fill:"#fefaef"},
 "der Gärtner / die Gärtnerin":{src:"/toon/lektion12/gaertner.webp",width:293,height:377,crop:{x:0,y:0,width:293,height:377},fill:"#fefaef"},
 "der Kunde / die Kundin":{src:"/toon/lektion12/kunde.webp",width:251,height:385,crop:{x:0,y:0,width:251,height:385},fill:"#fefaef"},
 "der Tierarzt / die Tierärztin":{src:"/toon/lektion12/tierarzt.webp",width:214,height:386,crop:{x:0,y:0,width:214,height:386},fill:"#fefaef"},
 "fotografieren":{src:"/toon/lektion12/fotografieren.webp",width:245,height:371,crop:{x:0,y:0,width:245,height:371},fill:"#fefbf1"},
 "nähen":{src:"/toon/lektion12/naehen.webp",width:257,height:389,crop:{x:0,y:0,width:257,height:389},fill:"#fefbf1"},
 "reparieren":{src:"/toon/lektion12/reparieren.webp",width:406,height:365,crop:{x:0,y:0,width:406,height:365},fill:"#fefbf1"},
 "prüfen":{src:"/toon/lektion12/pruefen.webp",width:398,height:381,crop:{x:0,y:0,width:398,height:381},fill:"#fefbf1"},
 "korrigieren":{src:"/toon/lektion12/korrigieren.webp",width:405,height:337,crop:{x:0,y:0,width:405,height:337},fill:"#fefbf1"},
 "recherchieren":{src:"/toon/lektion12/recherchieren.webp",width:415,height:347,crop:{x:0,y:0,width:415,height:347},fill:"#fefbf1"},
 "speichern":{src:"/toon/lektion12/speichern.webp",width:424,height:362,crop:{x:0,y:0,width:424,height:362},fill:"#fefbf1"},
 "drucken":{src:"/toon/lektion12/drucken.webp",width:367,height:360,crop:{x:0,y:0,width:367,height:360},fill:"#fefbf1"},
 "studieren":{src:"/toon/lektion12/studieren.webp",width:421,height:397,crop:{x:0,y:0,width:421,height:397},fill:"#fefbf1"},
 "backen":{src:"/toon/lektion12/backen.webp",width:393,height:399,crop:{x:0,y:0,width:393,height:399},fill:"#fefbf1"},
 "die Bewerbung, -en":{src:"/toon/lektion12/bewerbung.webp",width:393,height:331,crop:{x:0,y:0,width:393,height:331},fill:"#fefaee"},
 "die Anzeige, -n":{src:"/toon/lektion12/anzeige.webp",width:370,height:328,crop:{x:0,y:0,width:370,height:328},fill:"#fefaee"},
 "die Kamera, -s":{src:"/toon/lektion12/kamera.webp",width:406,height:297,crop:{x:0,y:0,width:406,height:297},fill:"#fefaee"},
 "leicht ≠ schwer":{src:"/toon/lektion12/leicht-schwer.webp",width:387,height:279,crop:{x:0,y:0,width:387,height:279},fill:"#fefaee"},
 "bequem":{src:"/toon/lektion12/bequem.webp",width:380,height:365,crop:{x:0,y:0,width:380,height:365},fill:"#fefaee"},
 "das Abitur (Sg.)":{src:"/toon/lektion12/abitur.webp",width:387,height:251,crop:{x:0,y:0,width:387,height:251},fill:"#fefaee"},
 "die Abendschule, -n":{src:"/toon/lektion12/abendschule.webp",width:459,height:329,crop:{x:0,y:0,width:459,height:329},fill:"#fefaee"},
 "das Ziel, -e":{src:"/toon/lektion12/ziel.webp",width:355,height:335,crop:{x:0,y:0,width:355,height:335},fill:"#fefaee"},
 "der Laden, Läden":{src:"/toon/lektion12/laden.webp",width:409,height:350,crop:{x:0,y:0,width:409,height:350},fill:"#fefaee"},
 "schicken":{src:"/toon/lektion12/schicken.webp",width:421,height:401,crop:{x:0,y:0,width:421,height:401},fill:"#fefbf1"},
 "verdienen: Geld verdienen":{src:"/toon/lektion12/verdienen.webp",width:242,height:393,crop:{x:0,y:0,width:242,height:393},fill:"#fefbf1"},
 "der Friseur / die Friseurin":{src:"/toon/lektion12/friseur.webp",width:260,height:380,crop:{x:0,y:0,width:260,height:380},fill:"#fefaef"},
 "der Verkäufer / die Verkäuferin":{src:"/toon/lektion12/verkaeufer.webp",width:328,height:379,crop:{x:0,y:0,width:328,height:379},fill:"#fefaef"},
 "der Koch / die Köchin":{src:"/toon/lektion12/koch.webp",width:247,height:378,crop:{x:0,y:0,width:247,height:378},fill:"#fefaef"},
 "der Ingenieur / die Ingenieurin":{src:"/toon/lektion12/ingenieur.webp",width:281,height:379,crop:{x:0,y:0,width:281,height:379},fill:"#fefaef"},
 "der Mechatroniker / die Mechatronikerin":{src:"/toon/lektion12/mechatroniker.webp",width:344,height:376,crop:{x:0,y:0,width:344,height:376},fill:"#fefaef"},
 "das Hotel, -s":{src:"/toon/lektion12/hotel.webp",width:426,height:345,crop:{x:0,y:0,width:426,height:345},fill:"#fef8e9"},
 "die Prüfung, -en":{src:"/toon/lektion12/pruefung.webp",width:385,height:393,crop:{x:0,y:0,width:385,height:393},fill:"#fefaee"},
 "das Team, -s: im Team arbeiten":{src:"/toon/lektion12/team.webp",width:389,height:360,crop:{x:0,y:0,width:389,height:360},fill:"#fefaef"},
 "das Pflegeheim, -e":{src:"/toon/lektion12/pflegeheim.webp",width:445,height:340,crop:{x:0,y:0,width:445,height:340},fill:"#fef8e9"},
 "das Autohaus, -häuser":{src:"/toon/lektion12/autohaus.webp",width:430,height:337,crop:{x:0,y:0,width:430,height:337},fill:"#fef8e9"},
 "die Bäckerei, -en":{src:"/toon/lektion12/baeckerei.webp",width:426,height:336,crop:{x:0,y:0,width:426,height:336},fill:"#fef8e9"},
 "der Blumenladen, -läden":{src:"/toon/lektion12/blumenladen.webp",width:416,height:353,crop:{x:0,y:0,width:416,height:353},fill:"#fef8e9"},
 "die Tierklinik, -en · die Tierarztpraxis, -praxen":{src:"/toon/lektion12/tierklinik.webp",width:444,height:336,crop:{x:0,y:0,width:444,height:336},fill:"#fef8e9"},
 "die Rezeption":{src:"/toon/lektion12/rezeption.webp",width:352,height:372,crop:{x:0,y:0,width:352,height:372},fill:"#fefaef"},
 "der Florist / die Floristin":{src:"/toon/lektion12/florist.webp",width:314,height:374,crop:{x:0,y:0,width:314,height:374},fill:"#fefaef"},
 "die Gärtnerei, -en":{src:"/toon/lektion12/gaertnerei.webp",width:432,height:346,crop:{x:0,y:0,width:432,height:346},fill:"#fef8e9"},
 "die Notiz, -en: Notizen machen":{src:"/toon/lektion12/notiz.webp",width:361,height:356,crop:{x:0,y:0,width:361,height:356},fill:"#fefaee"},
 "müde":{src:"/toon/lektion12/muede.webp",width:229,height:375,crop:{x:0,y:0,width:229,height:375},fill:"#fefaee"},
};
export const wordPicture=(de:string):L12Picture|null=>wordPictures[de]??null;

/** Round speaker pictures for the listening dialogues (320×320). Speakers without one (the
 * teacher, Tom, Mina, the reporter, the narrator) show their first letter instead. */
export const speakerPictures:Record<string,string>={
 Marisol:"/toon/lektion12/kisi-marisol.webp",
 Arun:"/toon/lektion12/kisi-arun.webp",
 Amira:"/toon/lektion12/kisi-amira.webp",
 "Herr Berger":"/toon/lektion12/kisi-berger.webp",
 Selin:"/toon/lektion12/kisi-selin.webp",
 Samuel:"/toon/lektion12/kisi-samuel.webp",
 Amina:"/toon/lektion12/kisi-amina.webp",
 Beraterin:"/toon/lektion12/kisi-beraterin.webp",
 Marco:"/toon/lektion12/kisi-marco.webp",
 Jonas:"/toon/lektion12/kisi-jonas.webp",
};
export const speakerPicture=(who:string):string|null=>speakerPictures[who]??null;
