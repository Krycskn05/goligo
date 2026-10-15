import type {Question} from './course';
import type {Topic} from './lessons';
import type {VaultLanguage,VaultTranslations} from './object-vault-copy';
import {verbFamilyOf} from './verb-families';

/**
 * Fiiller: the 38 verbs from the learner's textbook page (infinitive, 3rd person
 * Präsens, Perfekt with hat/ist). Only new IDs are added here: topics `verbs-*`,
 * questions `verb-*`. Answer options stay German; meanings follow the interface language.
 */
export type VerbAux='hat'|'ist';
export type VerbTask='meaning'|'word'|'fit'|'praesens'|'perfekt'|'write'|'write-praesens'|'write-perfekt'|'hear'|'hear-praesens'|'hear-perfekt';
export type Verb={id:string;display:string;infinitive:string;subject:'sie/er'|'es';praesens:string;perfekt:string;aux:VerbAux;participle:string;alsoIst:boolean;group:string;number:number;praesensWrong:readonly string[];perfektWrong:readonly string[];meanings:VaultTranslations};

type Spec=readonly [display:string,praesens:string,perfekt:string,praesensWrong:readonly [string,string,string],perfektWrong:readonly [string,string,string],meanings:VaultTranslations];
// Meaning order: tr, de, en, ar, uk, fr, es, ru, fa, pl, it, pt (same as the vault languages).
const specs:readonly Spec[]=[
 ['ab|fahren','fährt ab','ist abgefahren',['fahrt ab','abfährt','fährst ab'],['hat abgefahren','ist abgefahrt','ist geabfahren'],['kalkmak, yola çıkmak (araç)','losfahren, wegfahren','to depart, to leave','يغادر، ينطلق','відправлятися, від’їжджати','partir (en véhicule)','salir, partir','отправляться, уезжать','حرکت کردن، راه افتادن','odjeżdżać','partire','partir, sair']],
 ['ab|geben','gibt ab','hat abgegeben',['gebt ab','abgibt','gibst ab'],['ist abgegeben','hat abgegebt','hat geabgeben'],['teslim etmek','übergeben, abliefern','to hand in, to hand over','يسلّم','здавати, віддавати','remettre, rendre','entregar','сдавать, отдавать','تحویل دادن','oddawać','consegnare','entregar']],
 ['an|bieten','bietet an','hat angeboten',['biet an','anbietet','bietest an'],['hat angebietet','ist angeboten','hat angebieten'],['teklif etmek, ikram etmek','offerieren, vorschlagen','to offer','يعرض، يقدّم','пропонувати','offrir, proposer','ofrecer','предлагать','پیشنهاد دادن، تعارف کردن','oferować, częstować','offrire','oferecer']],
 ['an|fangen','fängt an','hat angefangen',['fangt an','anfängt','fängst an'],['ist angefangen','hat angefängt','hat geanfangen'],['başlamak','starten, loslegen','to start','يبدأ','починати','commencer','empezar','начинать','شروع کردن','zaczynać','cominciare','começar']],
 ['an|kommen','kommt an','ist angekommen',['kömmt an','ankommt','kommst an'],['hat angekommen','ist angekommt','ist geankommen'],['varmak, ulaşmak','das Ziel erreichen','to arrive','يصل','прибувати, приїжджати','arriver','llegar','прибывать, приезжать','رسیدن','przyjeżdżać, docierać','arrivare','chegar']],
 ['an|rufen','ruft an','hat angerufen',['rüft an','anruft','rufst an'],['ist angerufen','hat angeruft','hat geanrufen'],['telefonla aramak','telefonieren','to call (on the phone)','يتصل هاتفيًا','телефонувати','téléphoner, appeler','llamar por teléfono','звонить (по телефону)','تلفن زدن','dzwonić','telefonare','telefonar, ligar']],
 ['an|ziehen','zieht an','hat angezogen',['ziet an','anzieht','ziehst an'],['ist angezogen','hat angezieht','hat angeziehen'],['giymek','Kleidung anlegen','to put on (clothes)','يرتدي (ملابس)','одягати','mettre (un vêtement)','ponerse (ropa)','надевать','پوشیدن (لباس)','ubierać, zakładać','mettersi, indossare','vestir']],
 ['auf|stehen','steht auf','ist aufgestanden',['stäht auf','aufsteht','stehst auf'],['hat aufgestanden','ist aufgesteht','ist aufgestehen'],['(yataktan) kalkmak','sich erheben, das Bett verlassen','to get up','ينهض (من النوم)','вставати','se lever','levantarse','вставать','بلند شدن (از خواب)','wstawać','alzarsi','levantar-se']],
 ['aus|sehen','sieht aus','hat ausgesehen',['seht aus','aussieht','siehst aus'],['ist ausgesehen','hat ausgesieht','hat ausgesahen'],['görünmek','wirken, scheinen','to look (like), to appear','يبدو','виглядати','avoir l’air','parecer, tener aspecto','выглядеть','به نظر رسیدن','wyglądać','sembrare, avere l’aspetto','parecer, ter aspecto']],
 ['aus|steigen','steigt aus','ist ausgestiegen',['stiegt aus','aussteigt','steigst aus'],['hat ausgestiegen','ist ausgesteigt','ist ausgestiegt'],['(araçtan) inmek','ein Fahrzeug verlassen','to get off, to get out','ينزل (من وسيلة نقل)','виходити (з транспорту)','descendre (d’un véhicule)','bajarse (de un vehículo)','выходить (из транспорта)','پیاده شدن','wysiadać','scendere (da un mezzo)','descer, sair (de um veículo)']],
 ['aus|ziehen','zieht aus','ist ausgezogen',['ziet aus','auszieht','ziehst aus'],['ist ausgezieht','ist ausgeziehen','ist ausgezugen'],['(evden) taşınmak','die Wohnung verlassen','to move out','ينتقل من السكن','виїжджати (з квартири)','déménager (quitter un logement)','mudarse (dejar la vivienda)','съезжать (с квартиры)','از خانه اسباب‌کشی کردن','wyprowadzać się','traslocare (lasciare casa)','mudar-se (sair de casa)']],
 ['beginnen','beginnt','hat begonnen',['beginnet','begint','beginnst'],['ist begonnen','hat begannen','hat gebeginnt'],['başlamak (daha resmî)','starten (eher formell)','to begin','يشرع، يبتدئ','розпочинати','débuter','comenzar','приступать','آغاز کردن','rozpoczynać','iniziare','iniciar']],
 ['bekommen','bekommt','hat bekommen',['bekömmt','bekommst','bekomt'],['hat gebekommen','ist bekommen','hat bekommt'],['almak, elde etmek','erhalten','to get, to receive','يحصل على','отримувати','recevoir','recibir','получать','دریافت کردن','dostawać','ricevere','receber']],
 ['bleiben','bleibt','ist geblieben',['bliebt','bleibst','bleibet'],['hat geblieben','ist gebleibt','ist gebleiben'],['kalmak','nicht weggehen','to stay','يبقى','залишатися','rester','quedarse','оставаться','ماندن','zostawać','rimanere','ficar']],
 ['bringen','bringt','hat gebracht',['brängt','bringst','bracht'],['hat gebringt','ist gebracht','hat gebrungen'],['getirmek, götürmek','irgendwohin tragen','to bring, to take','يُحضِر','приносити','apporter','traer, llevar','приносить','آوردن','przynosić','portare','trazer, levar']],
 ['denken','denkt','hat gedacht',['dächt','denkst','denket'],['hat gedenkt','ist gedacht','hat gedunken'],['düşünmek','überlegen, meinen','to think','يفكّر','думати','penser','pensar','думать','فکر کردن','myśleć','pensare','pensar']],
 ['ein|laden','lädt ein','hat eingeladen',['ladet ein','einlädt','lädst ein'],['ist eingeladen','hat eingeladet','hat geeinladen'],['davet etmek','zu sich bitten','to invite','يدعو','запрошувати','inviter','invitar','приглашать','دعوت کردن','zapraszać','invitare','convidar']],
 ['empfehlen','empfiehlt','hat empfohlen',['empfehlt','empfiehlst','empfahlt'],['hat geempfohlen','ist empfohlen','hat empfehlt'],['tavsiye etmek','raten, einen Tipp geben','to recommend','يوصي، ينصح','рекомендувати','recommander','recomendar','рекомендовать','توصیه کردن','polecać','consigliare','recomendar']],
 ['essen','isst','hat gegessen',['esst','isset','ässt'],['hat geesst','ist gegessen','hat gegassen'],['yemek yemek','Nahrung zu sich nehmen','to eat','يأكل','їсти','manger','comer','есть, кушать','خوردن','jeść','mangiare','comer']],
 ['fahren','fährt','ist gefahren',['fahrt','fährst','fuhrt'],['ist gefahrt','ist gefuhren','ist gefährt'],['(araçla) gitmek, sürmek','mit einem Fahrzeug unterwegs sein','to go (by vehicle), to drive','يذهب بمركبة، يقود','їхати','aller (en véhicule), conduire','ir (en vehículo), conducir','ехать','(با وسیلهٔ نقلیه) رفتن، رانندگی کردن','jechać','andare (con un mezzo), guidare','ir (de veículo), conduzir']],
 ['finden','findet','hat gefunden',['fint','findest','fandet'],['hat gefindet','ist gefunden','hat gefanden'],['bulmak','entdecken','to find','يجد','знаходити','trouver','encontrar','находить','پیدا کردن','znajdować','trovare','encontrar, achar']],
 ['fliegen','fliegt','ist geflogen',['flügt','fliegst','flogt'],['ist gefliegt','ist gefliegen','ist geflügen'],['uçmak','durch die Luft reisen','to fly','يطير','летіти','voler, prendre l’avion','volar','лететь','پرواز کردن','lecieć','volare','voar']],
 ['geben','gibt','hat gegeben',['gebt','gibst','gäbt'],['ist gegeben','hat gegibt','hat gegaben'],['vermek','reichen, schenken','to give','يعطي','давати','donner','dar','давать','دادن','dawać','dare','dar']],
 ['gefallen','gefällt','hat gefallen',['gefallt','gefällst','gefallet'],['ist gefallen','hat gegefallen','hat gefällt'],['hoşa gitmek','jemandem zusagen','to please, to be liked','يُعجِب','подобатися','plaire','gustar','нравиться','خوش آمدن، پسندیدن','podobać się','piacere','agradar']],
 ['gehen','geht','ist gegangen',['gehet','gehst','gieht'],['hat gegangen','ist gegeht','ist gegingen'],['gitmek (yürüyerek)','zu Fuß unterwegs sein','to go, to walk','يذهب (مشيًا)','іти','aller (à pied)','ir (a pie)','идти','رفتن (پیاده)','iść','andare (a piedi)','ir (a pé)']],
 ['gelten','gilt','hat gegolten',['geltet','giltet','geltst'],['ist gegolten','hat gegeltet','hat gegalten'],['geçerli olmak','gültig sein','to be valid, to apply','يكون ساريًا','бути чинним, діяти','être valable','ser válido','действовать, быть действительным','معتبر بودن','obowiązywać','valere, essere valido','valer, ser válido']],
 ['heißen','heißt','hat geheißen',['heißet','hießt','heißst'],['ist geheißen','hat geheißt','hat gehießen'],['adı … olmak','den Namen … haben','to be called','يُسمّى','називатися','s’appeler','llamarse','называться, зваться','نام داشتن','nazywać się','chiamarsi','chamar-se']],
 ['herunter|laden','lädt herunter','hat heruntergeladen',['ladet herunter','herunterlädt','lädst herunter'],['ist heruntergeladen','hat heruntergeladet','hat geherunterladen'],['(internetten) indirmek','aus dem Internet speichern','to download','يُنزّل (من الإنترنت)','завантажувати','télécharger','descargar','скачивать','دانلود کردن','pobierać','scaricare','baixar, descarregar']],
 ['helfen','hilft','hat geholfen',['helft','hilfst','hilfet'],['ist geholfen','hat gehelft','hat gehalfen'],['yardım etmek','unterstützen','to help','يساعد','допомагати','aider','ayudar','помогать','کمک کردن','pomagać','aiutare','ajudar']],
 ['kennen','kennt','hat gekannt',['kännt','kennst','kannt'],['hat gekennt','ist gekannt','hat gekennen'],['tanımak, bilmek','vertraut sein mit','to know (be familiar with)','يعرف','знати (бути знайомим)','connaître','conocer','знать (быть знакомым)','شناختن','znać','conoscere','conhecer']],
 ['kommen','kommt','ist gekommen',['kömmt','kommst','kamt'],['hat gekommen','ist gekommt','ist gekammen'],['gelmek','sich hierher bewegen','to come','يأتي','приходити','venir','venir','приходить','آمدن','przychodzić','venire','vir']],
 ['laufen','läuft','ist gelaufen',['lauft','läufst','läuf'],['hat gelaufen','ist geläuft','ist gelieft'],['koşmak, yürümek','rennen, spazieren','to run, to walk','يركض، يمشي','бігти, ходити','courir, marcher','correr, caminar','бегать, идти пешком','دویدن، پیاده رفتن','biegać, chodzić','correre, camminare','correr, andar']],
 ['leid|tun','tut leid','hat leidgetan',['leidtut','tut leiden','tust leid'],['ist leidgetan','hat leidgetut','hat geleidtan'],['üzgün olmak (Es tut mir leid: Üzgünüm.)','bedauern','to be sorry','يأسف','шкодувати (мені шкода)','regretter (je suis désolé)','sentir, lamentar (lo siento)','сожалеть (мне жаль)','متأسف بودن','żałować (przykro mi)','dispiacere','lamentar (sinto muito)']],
 ['leihen','leiht','hat geliehen',['lieht','leihst','leihet'],['ist geliehen','hat geleiht','hat geleihen'],['ödünç vermek / almak','für kurze Zeit geben','to lend, to borrow','يُعير، يستعير','позичати','prêter, emprunter','prestar','одалживать','قرض دادن، قرض گرفتن','pożyczać','prestare','emprestar']],
 ['lesen','liest','hat gelesen',['lest','liesst','lieset'],['ist gelesen','hat geliest','hat gelasen'],['okumak','einen Text ansehen und verstehen','to read','يقرأ','читати','lire','leer','читать','خواندن','czytać','leggere','ler']],
 ['liegen','liegt','hat gelegen',['lägt','liegst','lieget'],['hat geliegt','hat gelagen','hat geliegen'],['yatmak, bulunmak','sich waagerecht befinden','to lie, to be located','يستلقي، يقع','лежати','être couché, se trouver','estar tumbado, estar situado','лежать','دراز کشیدن، قرار داشتن','leżeć','giacere, trovarsi','estar deitado, ficar (situado)']],
 ['mit|bringen','bringt mit','hat mitgebracht',['mitbringt','bringst mit','brängt mit'],['ist mitgebracht','hat mitgebringt','hat gemitbracht'],['yanında getirmek','dabeihaben und übergeben','to bring along','يُحضِر معه','приносити з собою','apporter (avec soi)','traer (consigo)','приносить с собой','با خود آوردن','przynosić ze sobą','portare con sé','trazer consigo']],
 ['mit|kommen','kommt mit','ist mitgekommen',['mitkommt','kommst mit','kömmt mit'],['hat mitgekommen','ist mitgekommt','ist gemitkommen'],['birlikte gelmek','begleiten','to come along','يأتي مع','іти разом','venir avec, accompagner','venir (con alguien)','идти вместе','همراه آمدن','iść razem','venire con','vir junto']],
];

/** Four groups in the order of the textbook page; `verbs-all` practises every verb. */
export const verbGroups=[{id:'verbs-1',from:0,to:10},{id:'verbs-2',from:10,to:20},{id:'verbs-3',from:20,to:30},{id:'verbs-4',from:30,to:38}] as const;
/** Some meanings overlap; these verbs never appear together in a meaning question. */
const sameMeaning=[['anfangen','beginnen'],['geben','abgeben'],['bringen','mitbringen'],['kommen','ankommen','mitkommen'],['gehen','laufen','fahren'],['fahren','abfahren'],['abfahren','aufstehen']];
// Southern German, Austrian and Swiss usage also forms the Perfekt of liegen with ist.
const alsoIst=new Set(['liegen']);
const impersonal=new Set(['gefallen','leidtun']);

export const verbs:Verb[]=specs.map(([display,praesens,perfekt,praesensWrong,perfektWrong,meanings],index)=>{
 const id=display.replace('|','');const [aux,...rest]=perfekt.split(' ');
 return {id,display,infinitive:id,subject:impersonal.has(id)?'es':'sie/er',praesens,perfekt,aux:aux as VerbAux,participle:rest.join(' '),alsoIst:alsoIst.has(id),group:verbGroups.find(group=>index>=group.from&&index<group.to)!.id,number:index+1,praesensWrong,perfektWrong,meanings};
});
export const verbMap=new Map(verbs.map(verb=>[verb.id,verb]));
const languageIndex:Record<VaultLanguage,number>={tr:0,de:1,en:2,ar:3,uk:4,fr:5,es:6,ru:7,fa:8,pl:9,it:10,pt:11};
export function verbMeaning(verb:Verb,language:VaultLanguage){return verb.meanings[languageIndex[language]];}
/** Spoken subject: one clear singular pronoun (the page writes "sie/er"). */
export function spokenSubject(verb:Verb){return verb.subject==='es'?'es':'er';}
/** The Perfekt as the page shows it, e.g. "hat/ist gelegen". */
export function perfektLabel(verb:Verb){return verb.alsoIst?'hat/ist '+verb.participle:verb.perfekt;}
/** One spoken row for the verb list: infinitive, Präsens, Perfekt. */
export function verbRowSpeech(verb:Verb){const subject=spokenSubject(verb);return verb.infinitive+' – '+subject+' '+verb.praesens+' – '+subject+' '+verb.perfekt;}

export const verbTopics:Topic[]=[...verbGroups.map(group=>group.id),'verbs-all'].map((id,index)=>({id,title:id==='verbs-all'?'Fiiller':'Fiiller '+(index+1),de:id==='verbs-all'?'Verben':'Verben '+(index+1),unit:0,section:'V'+(index+1),pages:'Fiil listesi',minutes:8,lead:'Fiilleri anlamı, Präsens ve Perfekt biçimleriyle çalış.',blocks:[]}));

function hash(value:string){let result=2166136261;for(const character of value)result=Math.imul(result^character.charCodeAt(0),16777619);return result>>>0;}
function seeded<T>(items:readonly T[],seed:string){return [...items].sort((a,b)=>hash(seed+':'+String(a))-hash(seed+':'+String(b)));}
function conflicts(id:string){return new Set(sameMeaning.filter(set=>set.includes(id)).flat().concat(id));}
/** Three other verbs whose meanings cannot be confused with this one. */
function meaningDistractors(verb:Verb,seed:string){const blocked=conflicts(verb.id);return seeded(verbs.filter(other=>!blocked.has(other.id)).map(other=>other.id),seed).slice(0,3);}
const stem=(id:string)=>id.replace(/^(ab|an|auf|aus|ein|herunter|mit|be)(?=[a-zäöüß]{4,})/,'');
/** For heard forms: verbs built on the same stem first (fahren ↔ ab|fahren), then others. */
function formDistractors(verb:Verb,seed:string){
 const near=verbs.filter(other=>other.id!==verb.id&&stem(other.id)===stem(verb.id)).map(other=>other.id);
 const rest=seeded(verbs.filter(other=>other.id!==verb.id&&!near.includes(other.id)).map(other=>other.id),seed);
 return [...seeded(near,seed),...rest].slice(0,3);
}

/** Verbs that fit a sentence question as wrong options: same workshop first (so the blank count gives nothing away), never a confusable meaning. */
function fitDistractors(verb:Verb,seed:string){
 const blocked=conflicts(verb.id);const family=verbFamilyOf(verb.id);const separable=verb.display.includes('|');
 const near=verbs.filter(other=>!blocked.has(other.id)&&family?.verbs.includes(other.id)).map(other=>other.id);
 const rest=verbs.filter(other=>!blocked.has(other.id)&&!near.includes(other.id)&&other.display.includes('|')===separable).map(other=>other.id);
 return [...seeded(near,seed),...seeded(rest,seed)].slice(0,3);
}
const verbBank:Question[]=[];
for(const verb of verbs){
 const meaning=verb.meanings[0];const subject=verb.subject;
 const explanation=verb.display+' = '+meaning+'. Präsens: '+subject+' '+verb.praesens+' · Perfekt: '+subject+' '+perfektLabel(verb)+'.';
 const shared={topic:verb.group,verbId:verb.id,explanation};
 const add=(id:string,task:VerbTask,question:Omit<Question,'id'|'topic'|'explanation'>)=>verbBank.push({id,...shared,verbTask:task,...question});
 add('verb-meaning-'+verb.id,'meaning',{kind:'choice',prompt:verb.display+' ne demek?',answer:verb.infinitive,options:[verb.infinitive,...meaningDistractors(verb,'meaning-'+verb.id)]});
 add('verb-word-'+verb.id,'word',{kind:'choice',prompt:'“'+meaning+'” anlamındaki Almanca fiil hangisi?',answer:verb.infinitive,options:[verb.infinitive,...meaningDistractors(verb,'word-'+verb.id)]});
 add('verb-fit-'+verb.id,'fit',{kind:'choice',prompt:'Resme ve cümleye uyan fiil hangisi?',answer:verb.infinitive,options:[verb.infinitive,...fitDistractors(verb,'fit-'+verb.id)]});
 add('verb-praesens-'+verb.id,'praesens',{kind:'choice',prompt:verb.display+' · Präsens: '+subject+' …',answer:verb.praesens,options:[verb.praesens,...verb.praesensWrong]});
 add('verb-perfekt-'+verb.id,'perfekt',{kind:'choice',prompt:verb.display+' · Perfekt: '+subject+' …',answer:verb.perfekt,options:[verb.perfekt,...verb.perfektWrong]});
 add('verb-write-'+verb.id,'write',{kind:'write',writingTask:'word',prompt:'“'+meaning+'” anlamındaki fiili yaz.',answer:verb.infinitive});
 add('verb-write-praesens-'+verb.id,'write-praesens',{kind:'write',writingTask:'gap',prompt:verb.display+' · Präsens yaz.',gap:subject+' ___',answer:verb.praesens});
 add('verb-write-perfekt-'+verb.id,'write-perfekt',{kind:'write',writingTask:'gap',prompt:verb.display+' · Perfekt yaz.',gap:subject+' ___ ___',answer:verb.perfekt,...(verb.alsoIst?{accepted:['ist '+verb.participle]}:{})});
 add('verb-hear-'+verb.id,'hear',{kind:'listen',prompt:'Dinle ve anlamını seç.',audio:verb.infinitive,answer:verb.infinitive,options:[verb.infinitive,...meaningDistractors(verb,'hear-'+verb.id)]});
 add('verb-hear-praesens-'+verb.id,'hear-praesens',{kind:'listen',prompt:'Dinle: bu biçim hangi fiile ait?',audio:spokenSubject(verb)+' '+verb.praesens,answer:verb.infinitive,options:[verb.infinitive,...formDistractors(verb,'hear-praesens-'+verb.id)]});
 add('verb-hear-perfekt-'+verb.id,'hear-perfekt',{kind:'listen',prompt:'Dinle: bu biçim hangi fiile ait?',audio:spokenSubject(verb)+' '+verb.perfekt,answer:verb.infinitive,options:[verb.infinitive,...formDistractors(verb,'hear-perfekt-'+verb.id)]});
}
export const verbQuestions:Question[]=verbBank;
export const isVerbTopic=(topic:string)=>topic==='verbs-all'||verbGroups.some(group=>group.id===topic);
export const inVerbTopic=(questionTopic:string,topic:string)=>topic==='verbs-all'?questionTopic.startsWith('verbs-'):questionTopic===topic;
/** Keeps the given order where it can, but never asks about the same verb twice in a row when that is avoidable. */
export function spreadVerbRound<T extends {verbId?:string}>(items:readonly T[]):T[]{
 const rest=[...items];const result:T[]=[];const left=new Map<string,number>();
 for(const item of rest)left.set(item.verbId??'',(left.get(item.verbId??'')??0)+1);
 while(rest.length){
  const last=result.at(-1)?.verbId;
  // Take the verb with the most questions left (ties: the earliest one), so no verb is stuck at the end.
  let at=-1;let most=-1;
  rest.forEach((item,index)=>{if(last&&item.verbId===last)return;const count=left.get(item.verbId??'')??0;if(count>most){most=count;at=index;}});
  if(at<0)at=0;const [item]=rest.splice(at,1);left.set(item.verbId??'',(left.get(item.verbId??'')??1)-1);result.push(item);
 }
 return result;
}
