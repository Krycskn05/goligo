import type {Question} from './course';
import {pluralNouns} from './article-challenges';
import type {Topic,Word} from './lessons';
import sceneData from './object-scenes.json';
import {movingObjectAdditions} from './object-moving-additions';
import {buildingObjectAdditions} from './object-building-additions';
import {toolObjectAdditions} from './object-tool-additions';
import {bodyObjectAdditions} from './object-body-additions';
import {everydayObjectAdditions} from './object-everyday-additions';

export type ObjectCrop={x:number;y:number;width:number;height:number;sheetWidth:number;sheetHeight:number};
export type SceneKey='building'|'moving';
export type ObjectWord={id:string;de:string;tr:string;topic:string;description:string;descriptionTr:string;note?:string;image:string;crop?:ObjectCrop;extra?:boolean};
export type SceneMark={id:string;x:number;y:number};
export const objectGroups=[
 {id:'objects-house',title:'Ev ve yapı',de:'Das Haus',subtitle:'Odalar, çatı, su ve elektrik'},
 {id:'objects-furniture',title:'Mobilya ve ev eşyaları',de:'Die Einrichtung',subtitle:'Mobilya, dekorasyon ve elektronik'},
 {id:'objects-kitchen',title:'Mutfak ve sofra',de:'Küche und Tisch',subtitle:'Mutfak aletleri ve sofra eşyaları'},
 {id:'objects-cleaning',title:'Temizlik ve çamaşır',de:'Putzen und Wäsche',subtitle:'Temizlik ve çamaşır eşyaları'},
 {id:'objects-tools',title:'Tamir ve boya aletleri',de:'Werkzeug und Malerbedarf',subtitle:'Aletler, vidalar ve boya'},
 {id:'objects-building',title:'İnşaat alanı',de:'Auf der Baustelle',subtitle:'İnşaat makineleri ve malzemeleri'},
 {id:'objects-nature',title:'Bitkiler ve hayvanlar',de:'Pflanzen und Tiere',subtitle:'Bitkiler, çiçekler ve hayvanlar'},
 {id:'objects-moving',title:'Taşınma ve günlük eşyalar',de:'Umzug und Alltag',subtitle:'Taşınma ve günlük eşyalar'},
 {id:'objects-body',title:'Vücut',de:'Der Körper',subtitle:'Baş, gövde, kollar ve bacaklar'},
 {id:'objects-health',title:'Sağlık ve ilk yardım',de:'Gesundheit und Erste Hilfe',subtitle:'İlk yardım, ilaçlar ve tıbbi araçlar'},
 {id:'objects-food',title:'Yiyecekler',de:'Lebensmittel',subtitle:'Kahvaltılıklar, et, sebze ve meyve'},
 {id:'objects-drinks',title:'İçecekler ve sofra',de:'Getränke und Geschirr',subtitle:'İçecekler, sofra eşyaları ve çatal bıçak'},
 {id:'objects-cooking',title:'Mutfak araçları ve ambalajlar',de:'Küchengeräte und Verpackungen',subtitle:'Mutfak gereçleri, aletler ve ambalajlar'},
 {id:'objects-school',title:'Okul ve sınıf',de:'Schule und Klassenzimmer',subtitle:'Sınıf, okul eşyaları ve kişiler'},
 {id:'objects-outdoors',title:'Doğa, şehir ve diğerleri',de:'Natur, Stadt und mehr',subtitle:'Doğa, şehir ve günlük kavramlar'},
];
type Spec=[string,string,string,string,string,string?];
const house:Spec[]=[
 ['bad','das Bad','banyo','In diesem Raum kannst du dich waschen und duschen.','Bu odada yıkanabilir ve duş alabilirsin.'],
 ['brett','das Brett','tahta','Es ist lang und flach. Es ist aus Holz.','Uzun ve yassıdır. Ahşaptandır.'],
 ['dach','das Dach','çatı','Es ist ganz oben auf dem Haus. Es schützt das Haus vor Regen.','Evin en üstündedir. Evi yağmurdan korur.'],
 ['dachboden','der Dachboden','çatı arası','Dieser Raum ist direkt unter dem Dach. Hier stehen oft alte Kisten.','Bu oda doğrudan çatının altındadır. Burada genellikle eski kasalar bulunur.'],
 ['dusche','die Dusche','duş','Du stehst darunter und wäschst dich mit Wasser.','Altında durur ve suyla yıkanırsın.'],
 ['fenster','das Fenster','pencere','Es hat Glas. Du kannst dadurch nach draußen sehen.','Camı vardır. İçinden dışarıya bakabilirsin.'],
 ['haustuer','die Haustür','evin giriş kapısı','Du öffnest sie und gehst ins Haus.','Onu açıp eve girersin.'],
 ['heizung','die Heizung','kalorifer','Sie macht das Zimmer im Winter warm.','Kışın odayı ısıtır.'],
 ['herd','der Herd','ocak','In der Küche kochst du darauf das Essen.','Mutfakta üzerinde yemek pişirirsin.','Herd: ocak; Backofen: fırın. Çizimde fırınlı bir ocak var.'],
 ['kamin','der Kamin','baca','Er steht auf dem Dach. Rauch kommt aus ihm.','Çatının üstündedir. İçinden duman çıkar.','Bu sayfadaki Kamin çizimi bacayı gösterir. Kamin başka bağlamlarda şömine de demektir.'],
 ['keller','der Keller','bodrum','Dieser Raum ist unter dem Haus. Dort stehen oft Getränke und Kisten.','Bu oda evin altındadır. Orada genellikle içecekler ve kasalar bulunur.'],
 ['kueche','die Küche','mutfak','In diesem Raum kochst du. Dort stehen der Herd und der Kühlschrank.','Bu odada yemek pişirirsin. Orada ocak ve buzdolabı bulunur.'],
 ['mauer','die Mauer','tuğla duvar','Sie ist aus vielen Ziegelsteinen gebaut.','Çok sayıda tuğladan yapılmıştır.','Mauer: örülmüş duvar. Wand: bir odanın duvarı gibi daha genel duvar.'],
 ['rohr','das Rohr','boru','Wasser fließt durch dieses lange, runde Teil.','Su, bu uzun ve yuvarlak parçanın içinden akar.'],
 ['steckdose','die Steckdose','priz','Sie ist an der Wand. Hier steckst du den Stecker hinein.','Duvardadır. Elektrik fişini buraya takarsın.','Steckdose = priz; Stecker = fiş.'],
 ['stecker','der Stecker','fiş','Er ist am Ende des Kabels. Du steckst ihn in die Steckdose.','Kablonun ucundadır. Onu prize takarsın.','Stecker = fiş; Steckdose = priz.'],
 ['treppe','die Treppe','sabit merdiven','Sie hat Stufen. Du gehst darauf in die nächste Etage.','Basamakları vardır. Üzerinden bir sonraki kata çıkarsın.','Treppe sabit merdivendir. Taşınabilir merdiven: die Leiter.'],
 ['waschbecken','das Waschbecken','lavabo','Hier wäschst du deine Hände. Es ist unter dem Wasserhahn.','Burada ellerini yıkarsın. Musluğun altındadır.'],
 ['wasserhahn','der Wasserhahn','musluk','Du drehst ihn auf. Dann kommt Wasser heraus.','Onu açarsın. Sonra içinden su çıkar.'],
 ['ziegelstein','der Ziegelstein','tuğla','Er ist ein einzelner Stein. Mit vielen solchen Steinen baust du eine Mauer.','Tek bir yapı taşıdır. Böyle çok sayıda taşla duvar örersin.','Ziegelstein = tuğla; Dachziegel = çatı kiremidi.'],
];
const furniture:Spec[]=[
 ['bett','das Bett','yatak','Du schläfst nachts darin. Es hat eine Matratze und ein Kissen.','Gece içinde uyursun. Bir döşeği ve yastığı vardır.','Bett tüm yataktır; Matratze yatağın döşeğidir.'],
 ['bild','das Bild','resim / tablo','Es hängt an der Wand. Du siehst darauf zum Beispiel ein Haus und Berge.','Duvarda asılıdır. Üzerinde örneğin bir ev ve dağlar görürsün.'],
 ['fernseher','der Fernseher','televizyon','Du siehst darauf Filme und Nachrichten.','Üzerinden filmler ve haberler izlersin.'],
 ['hocker','der Hocker','tabure','Du sitzt darauf. Er hat keine Rückenlehne.','Üzerine oturursun. Sırt dayanağı yoktur.','Hocker: tabure; Stuhl: sırt dayanağı olan sandalye.'],
 ['kofferradio','das Kofferradio','taşınabilir radyo','Es hat einen Griff. Du hörst damit Radio und kannst es mitnehmen.','Bir taşıma sapı vardır. Onunla radyo dinler ve onu yanında taşıyabilirsin.'],
 ['kuehlschrank','der Kühlschrank','buzdolabı','Er hält Milch, Käse und andere Lebensmittel kalt.','Sütü, peyniri ve diğer yiyecekleri soğuk tutar.'],
 ['lampe','die Lampe','lamba','Sie macht Licht. Du kannst sie anmachen und ausmachen.','Işık verir. Onu açabilir ve kapatabilirsin.'],
 ['matratze','die Matratze','yatak döşeği / şilte','Sie liegt im Bett. Du liegst beim Schlafen darauf.','Yatağın içinde bulunur. Uyurken üzerine uzanırsın.','Matratze döşektir; Bett tüm yataktır.'],
 ['plattenspieler','der Plattenspieler','pikap','Du legst eine Schallplatte darauf und hörst Musik.','Üzerine bir plak koyar ve müzik dinlersin.'],
 ['regal','das Regal','raf / açık raflı dolap','Es hat offene Fächer. Du stellst Bücher darauf.','Açık rafları vardır. Üzerine kitaplar koyarsın.','Regal açık raflıdır; Schrank genellikle kapaklıdır.'],
 ['schrank','der Schrank','dolap','Er hat Türen. Du legst zum Beispiel deine Kleidung hinein.','Kapakları vardır. Örneğin kıyafetlerini içine koyarsın.'],
 ['sessel','der Sessel','tek kişilik koltuk','Er ist weich und bequem. Eine Person kann darin sitzen.','Yumuşak ve rahattır. İçinde bir kişi oturabilir.','Sessel tek kişiliktir; Sofa birkaç kişinin oturabildiği kanepedir.'],
 ['sofa','das Sofa','kanepe','Es ist weich. Zwei oder drei Personen können darauf sitzen.','Yumuşaktır. Üzerinde iki veya üç kişi oturabilir.'],
 ['spiegel','der Spiegel','ayna','Du siehst dich selbst darin.','İçinde kendini görürsün.'],
 ['stuhl','der Stuhl','sandalye','Du sitzt darauf. Er hat eine Rückenlehne und steht oft am Tisch.','Üzerine oturursun. Sırt dayanağı vardır ve genellikle masanın yanında durur.','Doğru yazım: Stuhl. Sthull değil.'],
 ['teppich','der Teppich','halı','Er liegt auf dem Fußboden. Du gehst darauf.','Yerdedir. Üzerinde yürürsün.'],
 ['tisch','der Tisch','masa','Du stellst Teller darauf. Du kannst daran essen oder arbeiten.','Üzerine tabaklar koyarsın. Başında yemek yiyebilir veya çalışabilirsin.'],
 ['truhe','die Truhe','sandık','Sie hat einen Deckel. Du bewahrst Dinge darin auf.','Bir kapağı vardır. İçinde eşyalar saklarsın.'],
 ['vorhang','der Vorhang','perde','Er hängt vor dem Fenster. Du kannst ihn aufziehen und zuziehen.','Pencerenin önünde asılıdır. Onu açabilir ve kapatabilirsin.'],
 ['waschmaschine','die Waschmaschine','çamaşır makinesi','Du wäschst deine Kleidung darin.','İçinde kıyafetlerini yıkarsın.'],
];
function fromSpec(spec:Spec,topic:string):ObjectWord{const [id,de,tr,description,descriptionTr,note]=spec;return {id,de,tr,description,descriptionTr,note,topic,image:'/objects/drawn/'+id+'.svg'};}
// Each object is shown in the category that matches its meaning. Object and question IDs
// never change; only the category (topic) does, so saved answers, stars and mistakes stay.
const objectCategory:Record<string,string>={
 dachfenster:'objects-house',dachziegel:'objects-house',regenrinne:'objects-house',fallrohr:'objects-house',antenne:'objects-house',
 bilderrahmen:'objects-furniture',kissen:'objects-furniture',
 herd:'objects-kitchen',kuehlschrank:'objects-kitchen',tasse:'objects-kitchen',teekanne:'objects-kitchen',teller:'objects-kitchen',tischdecke:'objects-kitchen',flasche:'objects-kitchen',apfel:'objects-kitchen',
 besen:'objects-cleaning',buerste:'objects-cleaning',kehrblech:'objects-cleaning',putzeimer:'objects-cleaning',staubsauger:'objects-cleaning',teppichklopfer:'objects-cleaning',buegeleisen:'objects-cleaning',waschmaschine:'objects-cleaning',
 saege:'objects-tools',nagel:'objects-tools',pinsel:'objects-tools',farbrolle:'objects-tools',eimer:'objects-tools',
 brett:'objects-building',
 pflanze:'objects-nature',palme:'objects-nature',blumentopf:'objects-nature',kaktus:'objects-nature',vogel:'objects-nature',vogelkaefig:'objects-nature',feder:'objects-nature',fisch:'objects-nature',aquarium:'objects-nature',
};
export const objectVocabulary:ObjectWord[]=[...house.map(s=>fromSpec(s,'objects-house')),...furniture.map(s=>fromSpec(s,'objects-furniture')),...sceneData.extraWords as ObjectWord[],...movingObjectAdditions,...buildingObjectAdditions,...toolObjectAdditions,...bodyObjectAdditions,...everydayObjectAdditions]
 .map(word=>objectCategory[word.id]?{...word,topic:objectCategory[word.id]}:word);
export const objectWordMap=new Map(objectVocabulary.map(w=>[w.id,w]));
export const objectScenes:{key:SceneKey;title:string;de:string;src:string;width:number;height:number;marks:SceneMark[]}[]=[
 {key:'building',title:'Ev yenileme sahnesi',de:'Auf der Baustelle',src:'/objects/source/building.jpg',width:2048,height:1482,marks:sceneData.building as SceneMark[]},
 {key:'moving',title:'Taşınma sahnesi',de:'Beim Umzug',src:'/objects/source/moving.jpg',width:2048,height:1432,marks:sceneData.moving as SceneMark[]},
];
export const objectWords:Word[]=objectVocabulary.map(w=>({de:w.de,tr:w.tr,topic:w.topic}));
export const objectTopics:Topic[]=[...objectGroups,{id:'objects-all',title:'Nesne Kasası',de:'Gegenstände üben',subtitle:''}].map((g,i)=>({id:g.id,title:g.title,de:g.de,unit:0,section:String(i+1),pages:'Nesne Kasası görselleri',minutes:8,lead:'Nesneleri resimli testlerle çalış; cevabından sonra anlamını çalışma dilinde gör.',blocks:[{heading:'Kelimeyi artikeliyle öğren',text:'Resme bak; doğru Almanca kelimeyi dört seçenekten seç. Cevabından sonra anlamını çalışma dilinde görebilirsin.'}]}));
const imageOf=(w:ObjectWord)=>({src:w.image,alt:w.tr,caption:w.crop?'Yüklediğin resimden nesne ayrıntısı':'Bu çalışma için çizilmiş nesne',...(w.crop?{crop:w.crop}:{})});
// Pictures that also show another object of the list are never offered together (a thumb is also a finger,
// a whole head also shows the eyes and the nose).
const nearPairs:[string,string[]][]=[['daumen',['finger','hand']],['finger',['daumen','hand']],['hand',['finger','daumen','arm']],['arm',['hand','ellbogen','schulter']],['ellbogen',['arm']],['schulter',['arm','koerper']],
 ['fuss',['zeh','bein']],['zeh',['fuss']],['bein',['knie','fuss','koerper']],['knie',['bein']],['kopf',['auge','ohr','nase','mund','haar','hals']],['hals',['kopf']],['brust',['koerper','bauch']],['bauch',['koerper','brust']],['koerper',['arm','auge','bauch','bein','brust','daumen','finger','fuss','ellbogen','haar','hals','hand','knie','kopf','mund','nase','ohr','schulter','zeh']],
 ['verband',['gips','verbandskasten']],['gips',['verband']],['verbandskasten',['verband','pflaster','schere']],['tablette',['kapsel']],['kapsel',['tablette']],['zahn',['mund']],
 // The 3D sheets (22 October 2026): pictures that look alike, or where one word is the general word for the other.
 ['ei',['spiegelei','eierschale']],['brot',['broetchen','baguette','brotscheibe']],['brotscheibe',['wurstbrot','kaesebrot']],['zucker',['wuerfelzucker','salz']],
 ['bratwurst',['wuerstchen','salami','wurstbrot']],['fleisch',['braten','kotelett','schinken']],['nudeln',['spaghetti']],['kuchen',['torte']],['gemuese',['karotte','gurke','erbse','tomate','zwiebel','blumenkohl','kartoffel','salat']],
 ['salat',['blumenkohl']],['kaese',['kaesebrot']],
 ['apfelsaft',['orangensaft']],['wein',['rotwein','weisswein']],['rotwein',['weisswein']],['glas',['bierglas','weinglas']],['krug',['milchkaennchen','kaffeekanne']],['loeffel',['teeloeffel']],['zuckerdose',['butterdose']],
 ['dose',['einmachglas']],['korken',['kronkorken']],['flaschenoeffner',['dosenoeffner','korkenzieher']],['topf',['deckel']],['mixer',['schneebesen']],
 ['buch',['heft','woerterbuch']],['heft',['woerterbuch']],['bleistift',['buntstift']],['kugelschreiber',['fueller']],['radio',['kassettenrekorder']],['tuer',['tuerklinke']],
 ['tafel',['kreide','schwamm']],['tasche',['rucksack']],['schueler',['schuelerin']],['decke',['ecke','fussboden']],['blume',['gras']],['stadt',['turm']]];
// Categories whose wrong choices come from the same category (an eye among other body parts, a fork among tableware).
const ownChoices=new Set(['objects-body','objects-health','objects-food','objects-drinks','objects-cooking','objects-school','objects-outdoors']);
const nearObjects:Record<string,string[]>={};
for(const [id,others] of nearPairs)for(const other of others){(nearObjects[id]??=[]).push(other);(nearObjects[other]??=[]).push(id);}
function distractors(w:ObjectWord){
 // A removal van is also a truck: never offer both names for the same picture.
 const excluded=new Set([w.id,...(w.id==='lastwagen'?['umzugswagen']:w.id==='umzugswagen'?['lastwagen']:[])]);
 const same=objectVocabulary.filter(x=>x.topic===w.topic&&!excluded.has(x.id));
 const all=[...same,...objectVocabulary.filter(x=>x.topic!==w.topic&&!excluded.has(x.id))];
 // Body parts, health things and the 3D-sheet categories take their wrong choices from their own category (an eye
 // among other body parts, not among building tools); the older categories keep the choices they always had.
 if(ownChoices.has(w.topic)){
  const near=new Set(nearObjects[w.id]??[]);const at=objectVocabulary.filter(x=>x.topic===w.topic).indexOf(w);
  const picked=[...same.slice(at),...same.slice(0,at)].filter(x=>!near.has(x.id)).slice(0,3);
  // The whole body shows every body part: its wrong choices come from the health things.
  return picked.length===3?picked:[...picked,...objectVocabulary.filter(x=>x.topic==='objects-health')].slice(0,3);
 }
 const at=objectVocabulary.indexOf(w)%Math.max(1,all.length-3);return all.slice(at,at+3);
}
const objectBank:Question[]=[];
for(const w of objectVocabulary){
 const other=distractors(w);const options=[w.de,...other.map(x=>x.de)];const explanation=w.de+' = '+w.tr+'.'+(w.note?' '+w.note:'');
 const base={topic:w.topic,objectId:w.id,explanation};
 objectBank.push(
  {...base,id:'obj-picture-'+w.id,kind:'choice',prompt:'Resimdeki nesnenin Almanca adını artikeliyle seç.',answer:w.de,options,image:imageOf(w),practice:'visual'},
  {...base,id:'obj-article-'+w.id,kind:'choice',prompt:'Nesnenin sözlük biçiminde doğru belirli artikelini seç.',answer:w.de,options:[w.de,...['der','die','das','den'].filter(a=>a!==w.de.split(' ')[0]).map(a=>a+' '+w.de.slice(w.de.indexOf(' ')+1)).slice(0,3)],image:imageOf(w),practice:'visual'},
  {...base,id:'obj-write-'+w.id,kind:'write',prompt:'Bu nesnenin Almanca adını artikeliyle yaz.',answer:w.de,image:imageOf(w),practice:'visual',writingTask:'word'},
  {...base,id:'obj-gap-'+w.id,kind:'write',prompt:'Boşluğu doğru artikel ile tamamla.',gap:'___ '+w.de.slice(w.de.indexOf(' ')+1),writingTask:'gap',answer:w.de.split(' ')[0],image:imageOf(w)},
  {...base,id:'obj-hear-picture-'+w.id,kind:'listen',prompt:'Dinlediğin nesnenin resmini seç.',answer:w.de,options,audio:w.de,audioTr:w.tr,pictureOptions:[w.id,...other.map(x=>x.id)]},
  {...base,id:'obj-read-'+w.id,kind:'read',prompt:'Bu kısa açıklama hangi nesneyi anlatıyor?',answer:w.de,options,passage:w.description,passageTr:w.descriptionTr},
  {...base,id:'obj-hear-description-'+w.id,kind:'listen',prompt:'Dinlediğin açıklama hangi nesneyi anlatıyor?',answer:w.de,options,audio:w.description,audioTr:w.descriptionTr},
  {...base,id:'obj-dictation-'+w.id,kind:'write',prompt:'Duyduğun kelimeyi artikeliyle yaz.',answer:w.de,audio:w.de,audioTr:w.tr,practice:'dictation'},
 );
 const plural=pluralNouns[w.id];if(plural)objectBank.push({...base,id:'obj-puzzle-plural-'+w.id,kind:'write',writingTask:'gap',prompt:'Çoğul kelimenin artikelini seç.',gap:'___ '+plural,answer:'die',articlePuzzle:{variant:'plural',noun:plural,fullAnswer:'die '+plural},image:imageOf(w),explanation:'Çoğul isimlerde Nominativ belirli artikel die olur: die '+plural+'. Tekil artikel ile karıştırma.'});
}
for(const scene of objectScenes){for(const mark of scene.marks){const w=objectWordMap.get(mark.id);if(!w)continue;const base={topic:w.topic,objectId:w.id,answer:w.de,explanation:w.de+' = '+w.tr+'.',sceneFind:{key:scene.key,target:w.id}};
 objectBank.push({...base,id:'obj-scene-'+scene.key+'-'+w.id,kind:'write',prompt:'Gösterilen nesneyi kalabalık resimde bul ve numarasına dokun.'},{...base,id:'obj-scene-hear-'+scene.key+'-'+w.id,kind:'listen',prompt:'Duyduğun nesneyi kalabalık resimde bul ve numarasına dokun.',audio:w.de,audioTr:w.tr});
}}
export const objectQuestions=objectBank;
export type ObjectMode='mixed'|'visual'|'listen'|'read'|'write'|'dictation'|'review'|'scene';
export function objectQuestionPool(mode:ObjectMode,group='all',scene?:SceneKey){return objectQuestions.filter(q=>(group==='all'||q.topic===group)&&(!scene||q.sceneFind?.key===scene)&&(mode==='mixed'||mode==='review'?true:mode==='scene'?!!q.sceneFind&&!q.audio:mode==='visual'?q.kind==='choice'&&!!q.image:mode==='listen'?!!q.audio&&q.kind==='listen':mode==='read'?q.kind==='read':mode==='write'?q.kind==='write'&&!q.audio&&!q.sceneFind:q.practice==='dictation'));}
