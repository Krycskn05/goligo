import type {ObjectWord} from './object-course';

type Meanings=readonly [en:string,ar:string,uk:string,fr:string,es:string,ru:string,fa:string,pl:string,it:string,pt:string];
type Spec=readonly [id:string,de:string,tr:string,description:string,descriptionTr:string,meanings:Meanings];

// Missing objects from the 9B construction illustration. Previously learned
// house and furniture objects retain their IDs and existing categories.
const specs:Spec[]=[
 ['nagel','der Nagel','çivi','Er ist aus Metall und hat eine Spitze. Du schlägst ihn mit einem Hammer ins Holz.','Metaldendir ve sivri bir ucu vardır. Çekiçle ahşaba çakarsın.',
  ['nail','مسمار','цвях','clou','clavo','гвоздь','میخ','gwóźdź','chiodo','prego']],
 ['dachfenster','das Dachfenster','çatı penceresi','Dieses Fenster ist im Dach. Licht kommt durch das Glas in den Dachboden.','Bu pencere çatıdadır. Camından çatı katına ışık girer.',
  ['roof window / skylight','نافذة سقفية','дахове вікно','fenêtre de toit','ventana de tejado','мансардное окно','پنجرهٔ سقفی','okno dachowe','finestra sul tetto','janela de telhado']],
 ['regenrinne','die Regenrinne','yağmur oluğu','Sie ist am Rand des Daches. Sie sammelt das Regenwasser.','Çatının kenarındadır. Yağmur suyunu toplar.',
  ['rain gutter','مزراب','водостічний жолоб','gouttière','canalón','водосточный жёлоб','ناودان','rynna','grondaia','calha de chuva']],
 ['fallrohr','das Fallrohr','yağmur iniş borusu','Dieses Rohr führt Regenwasser vom Dach nach unten. Es ist an der Hauswand.','Bu boru yağmur suyunu çatıdan aşağıya taşır. Evin duvarındadır.',
  ['downpipe / downspout','أنبوب تصريف مياه المطر','водостічна труба','tuyau de descente','bajante pluvial','водосточная труба','لولهٔ عمودی ناودان','rura spustowa','pluviale','tubo de descida pluvial']],
 ['zementsack','der Zementsack','çimento torbası','In diesem Sack ist Zement. Auf der Baustelle brauchst du ihn zum Bauen.','Bu torbanın içinde çimento vardır. İnşaatta yapı işleri için kullanırsın.',
  ['bag of cement','كيس إسمنت','мішок цементу','sac de ciment','saco de cemento','мешок цемента','کیسهٔ سیمان','worek cementu','sacco di cemento','saco de cimento']],
 ['kabel','das Kabel','elektrik kablosu','Es verbindet ein elektrisches Gerät mit der Steckdose. Am Ende ist ein Stecker.','Elektrikli bir cihazı prize bağlar. Ucunda bir fiş vardır.',
  ['electrical cable','كابل كهربائي','електричний кабель','câble électrique','cable eléctrico','электрический кабель','کابل برق','kabel elektryczny','cavo elettrico','cabo elétrico']],
 ['schild','das Schild','tabela / levha','Du siehst darauf eine Warnung oder eine Information. Auf der Baustelle steht es am Eingang.','Üzerinde bir uyarı veya bilgi görürsün. İnşaat alanının girişinde bulunur.',
  ['sign','لافتة','табличка','panneau','cartel','табличка','تابلو','tablica','cartello','placa']],
];

export const buildingObjectAdditions:ObjectWord[]=specs.map(([id,de,tr,description,descriptionTr])=>({
 id,de,tr,description,descriptionTr,topic:'objects-building',image:'/objects/toon/building-'+id+'.webp',extra:true,
}));
export const buildingObjectMeanings:Record<string,readonly [string,string,string,string]>=Object.fromEntries(
 specs.map(([id,,,,,meanings])=>[id,meanings.slice(0,4) as unknown as readonly [string,string,string,string]]),
);
export const buildingExtraMeanings:Record<string,readonly [string,string,string,string,string,string]>=Object.fromEntries(
 specs.map(([id,,,,,meanings])=>[id,meanings.slice(4) as unknown as readonly [string,string,string,string,string,string]]),
);
