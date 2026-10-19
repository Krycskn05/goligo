import type {Question} from './course';
import type {Topic} from './lessons';
import type {VaultLanguage,VaultTranslations} from './object-vault-copy';
import {pickText} from './site-languages';

/**
 * Fiiller: the 72 verbs from the learner's two textbook pages (infinitive, 3rd person
 * Präsens, Perfekt with hat/ist): 38 from the first page, 34 from the second (mit|nehmen → zurück|kommen). Only new IDs are added here: topics `verbs-*`,
 * questions `verb-*`. Answer options stay German; meanings follow the interface language.
 */
export type VerbAux='hat'|'ist';
export type VerbTask='meaning'|'word'|'fit'|'praesens'|'perfekt'|'meaning-perfekt'|'partizip'|'write'|'write-praesens'|'write-perfekt'|'write-partizip'|'hear'|'hear-praesens'|'hear-perfekt';
export type Verb={id:string;display:string;infinitive:string;subject:'sie/er'|'es'|'sie';praesens:string;perfekt:string;aux:VerbAux;participle:string;alsoIst:boolean;group:string;number:number;praesensWrong:readonly string[];perfektWrong:readonly string[];meanings:VaultTranslations};

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
 // The learner's second page (mit|nehmen → zurück|kommen).
 ['mit|nehmen','nimmt mit','hat mitgenommen',['nehmt mit','mitnimmt','nimmst mit'],['ist mitgenommen','hat mitgenehmt','hat gemitnommen'],['yanına almak, yanında götürmek','einpacken und dabeihaben','to take along','يأخذ معه','брати з собою','emporter, emmener','llevarse, llevar consigo','брать с собой','با خود بردن','zabierać ze sobą','portare con sé','levar consigo']],
 ['nehmen','nimmt','hat genommen',['nehmt','nimmst','nahmt'],['ist genommen','hat genehmt','hat genehmen'],['almak','greifen, an sich nehmen','to take','يأخذ','брати','prendre','tomar, coger','брать','برداشتن، گرفتن','brać','prendere','pegar, tomar']],
 ['rufen','ruft','hat gerufen',['rüft','rufst','rief'],['ist gerufen','hat geruft','hat gerifen'],['seslenmek, çağırmak','laut nach jemandem sprechen','to call (out)','ينادي','кликати, гукати','appeler (à voix haute)','llamar (en voz alta)','звать, окликать','صدا زدن','wołać','chiamare (a voce)','chamar (em voz alta)']],
 ['scheinen','scheint','hat geschienen',['scheinet','scheinst','schient'],['ist geschienen','hat gescheint','hat gescheinen'],['parlamak (güneş)','hell leuchten (die Sonne)','to shine','تشرق، تسطع (الشمس)','світити (про сонце)','briller (le soleil)','brillar (el sol)','светить (о солнце)','تابیدن (خورشید)','świecić (słońce)','splendere (il sole)','brilhar (o sol)']],
 ['schlafen','schläft','hat geschlafen',['schlaft','schläfst','schlieft'],['ist geschlafen','hat geschlaft','hat geschliefen'],['uyumak','ruhen, nicht wach sein','to sleep','ينام','спати','dormir','dormir','спать','خوابیدن','spać','dormire','dormir']],
 ['schließen','schließt','hat geschlossen',['schließet','schloss','schließst'],['ist geschlossen','hat geschließt','hat geschließen'],['kapatmak','zumachen','to close, to shut','يغلق','зачиняти','fermer','cerrar','закрывать','بستن','zamykać','chiudere','fechar']],
 ['schneiden','schneidet','hat geschnitten',['schneidt','schneidest','schnittet'],['ist geschnitten','hat geschneidet','hat geschnieden'],['kesmek','mit dem Messer teilen','to cut','يقطع','різати','couper','cortar','резать','بریدن','kroić, ciąć','tagliare','cortar']],
 ['schreiben','schreibt','hat geschrieben',['schriebt','schreibst','schreibet'],['ist geschrieben','hat geschreibt','hat geschreiben'],['yazmak','Wörter auf Papier bringen','to write','يكتب','писати','écrire','escribir','писать','نوشتن','pisać','scrivere','escrever']],
 ['schwimmen','schwimmt','ist geschwommen',['schwämmt','schwimmst','schwammt'],['hat geschwommen','ist geschwimmt','ist geschwammen'],['yüzmek','sich im Wasser bewegen','to swim','يسبح','плавати','nager','nadar','плавать','شنا کردن','pływać','nuotare','nadar']],
 ['sehen','sieht','hat gesehen',['seht','siehst','sah'],['ist gesehen','hat gesieht','hat gesahen'],['görmek','mit den Augen wahrnehmen','to see','يرى','бачити','voir','ver','видеть','دیدن','widzieć','vedere','ver']],
 ['singen','singt','hat gesungen',['sängt','singst','sang'],['ist gesungen','hat gesingt','hat gesangen'],['şarkı söylemek','ein Lied mit der Stimme machen','to sing','يغني','співати','chanter','cantar','петь','آواز خواندن','śpiewać','cantare','cantar']],
 ['sitzen','sitzt','hat gesessen',['sitzet','setzt','saß'],['hat gesitzt','hat gesetzt','hat gesatzen'],['oturmak','auf einem Stuhl oder einer Bank sein','to sit','يجلس','сидіти','être assis','estar sentado','сидеть','نشستن','siedzieć','stare seduto','estar sentado']],
 ['sprechen','spricht','hat gesprochen',['sprecht','sprichst','sprach'],['ist gesprochen','hat gesprecht','hat gesprachen'],['konuşmak','reden','to speak, to talk','يتكلم','говорити, розмовляти','parler','hablar','говорить','صحبت کردن','mówić, rozmawiać','parlare','falar']],
 ['stehen','steht','hat gestanden',['stäht','stehst','stand'],['hat gesteht','hat gestehen','hat gestunden'],['ayakta durmak','auf den Beinen sein, nicht sitzen','to stand','يقف','стояти','être debout','estar de pie','стоять','ایستادن','stać','stare in piedi','estar de pé']],
 ['stoßen','stößt','hat gestoßen',['stoßt','stößst','stieß'],['ist gestoßen','hat gestößt','hat gestoßt'],['çarpmak, itmek','kräftig gegen etwas kommen','to bump, to push','يصطدم، يدفع','вдарятися, штовхати','cogner, pousser','golpearse, empujar','ударяться, толкать','خوردن به، هل دادن','uderzać się, pchać','urtare, spingere','bater, empurrar']],
 ['tragen','trägt','hat getragen',['tragt','trägst','trug'],['ist getragen','hat getragt','hat geträgen'],['taşımak; giymek','in der Hand halten und bringen; anhaben','to carry; to wear','يحمل؛ يرتدي','нести; носити (одяг)','porter','llevar, cargar','нести; носить (одежду)','حمل کردن؛ پوشیدن','nieść; nosić','portare (in mano, addosso)','carregar; usar (roupa)']],
 ['treffen','trifft','hat getroffen',['trefft','triffst','traf'],['ist getroffen','hat getrefft','hat getreffen'],['buluşmak, karşılaşmak','mit jemandem zusammenkommen','to meet','يقابل، يلتقي','зустрічати','rencontrer, retrouver','quedar con, encontrarse con','встречать','ملاقات کردن','spotykać','incontrare','encontrar-se com']],
 ['trinken','trinkt','hat getrunken',['tränkt','trinkst','trank'],['ist getrunken','hat getrinkt','hat getranken'],['içmek','Wasser oder Saft zu sich nehmen','to drink','يشرب','пити','boire','beber','пить','نوشیدن','pić','bere','beber']],
 ['tun','tut','hat getan',['tunt','tust','tat'],['ist getan','hat getut','hat getunt'],['yapmak, etmek','machen','to do','يفعل','робити','faire','hacer','делать','انجام دادن','robić','fare','fazer']],
 ['überweisen','überweist','hat überwiesen',['überweisst','überweisest','überwies'],['ist überwiesen','hat überweist','hat geüberwiesen'],['havale etmek (para göndermek)','Geld vom Konto schicken','to transfer (money)','يحوّل (مالًا)','переказувати (гроші)','virer (de l’argent)','transferir (dinero)','переводить (деньги)','حواله کردن (پول)','przelewać (pieniądze)','trasferire (denaro)','transferir (dinheiro)']],
 ['um|steigen','steigt um','ist umgestiegen',['stiegt um','umsteigt','steigst um'],['hat umgestiegen','ist umgesteigt','ist geumstiegen'],['aktarma yapmak','in einen anderen Zug oder Bus wechseln','to change (trains, buses)','يغيّر وسيلة النقل','робити пересадку','changer (de train, de bus)','hacer transbordo','делать пересадку','عوض کردن قطار یا اتوبوس','przesiadać się','cambiare (treno, autobus)','fazer transbordo']],
 ['um|ziehen','zieht um','ist umgezogen',['ziet um','umzieht','ziehst um'],['hat umgezogen','ist umgezieht','ist umgeziehen'],['taşınmak (yeni eve)','in eine neue Wohnung gehen','to move (house)','ينتقل إلى سكن جديد','переїжджати','déménager','mudarse de casa','переезжать','اسباب‌کشی کردن','przeprowadzać się','traslocare','mudar de casa']],
 ['unterschreiben','unterschreibt','hat unterschrieben',['unterschriebt','unterschreibst','schreibt unter'],['ist unterschrieben','hat untergeschrieben','hat unterschreibt'],['imzalamak','seinen Namen unter etwas schreiben','to sign','يوقّع','підписувати','signer','firmar','подписывать','امضا کردن','podpisywać','firmare','assinar']],
 ['vergessen','vergisst','hat vergessen',['vergesst','vergißt','vergass'],['ist vergessen','hat vergesst','hat gevergessen'],['unutmak','nicht mehr daran denken','to forget','ينسى','забувати','oublier','olvidar','забывать','فراموش کردن','zapominać','dimenticare','esquecer']],
 ['verlieren','verliert','hat verloren',['verlort','verlierst','verlierte'],['ist verloren','hat verliert','hat geverloren'],['kaybetmek','etwas nicht mehr haben','to lose','يفقد، يُضيّع','губити, втрачати','perdre','perder','терять','گم کردن، از دست دادن','gubić, tracić','perdere','perder']],
 ['verstehen','versteht','hat verstanden',['verstäht','verstehst','verstand'],['ist verstanden','hat versteht','hat geverstanden'],['anlamak','den Sinn kennen, begreifen','to understand','يفهم','розуміти','comprendre','entender','понимать','فهمیدن','rozumieć','capire','entender, compreender']],
 ['weh|tun','tut weh','hat wehgetan',['wehtut','tut wehe','tust weh'],['ist wehgetan','hat wehgetut','hat gewehtan'],['acımak, ağrımak','Schmerzen machen','to hurt','يؤلم','боліти','faire mal','doler','болеть','درد کردن','boleć','fare male','doer']],
 ['werden','wird','ist geworden',['werdet','wirst','wurde'],['hat geworden','ist gewird','ist gewerden'],['olmak (bir şey haline gelmek)','sich zu etwas verändern','to become','يصبح','ставати','devenir','llegar a ser, hacerse','становиться','شدن','stawać się','diventare','tornar-se']],
 ['wissen','weiß','hat gewusst',['wisst','weißt','wusste'],['ist gewusst','hat gewisst','hat gewissen'],['bilmek (bir bilgiyi)','eine Information im Kopf haben','to know (a fact)','يعرف (معلومة)','знати (факт)','savoir','saber','знать (факт)','دانستن','wiedzieć','sapere','saber']],
 ['ziehen','zieht','ist gezogen',['ziet','ziehst','zog'],['ist gezieht','ist geziehen','ist gezugen'],['(bir yere) taşınmak; çekmek','woandershin gehen und dort wohnen; auch: zerren','to move (to a place); to pull','ينتقل (إلى مكان)؛ يسحب','переїжджати (кудись); тягнути','aller vivre (ailleurs) ; tirer','irse a vivir (a otro lugar); tirar','переезжать (куда-то); тянуть','نقل مکان کردن؛ کشیدن','przenosić się (dokądś); ciągnąć','trasferirsi; tirare','mudar-se (para um lugar); puxar']],
 ['zurück|geben','gibt zurück','hat zurückgegeben',['gebt zurück','zurückgibt','gibst zurück'],['ist zurückgegeben','hat zurückgegebt','hat gezurückgeben'],['geri vermek','wiedergeben, was man geliehen hat','to give back, to return','يُرجع، يُعيد','повертати (віддавати)','rendre','devolver','возвращать (отдавать)','پس دادن','oddawać, zwracać','restituire','devolver']],
 ['zurück|gehen','geht zurück','ist zurückgegangen',['gehet zurück','zurückgeht','gehst zurück'],['hat zurückgegangen','ist zurückgegeht','ist gezurückgangen'],['geri gitmek (yürüyerek)','zu Fuß wieder an den alten Ort','to go back (on foot)','يعود (مشيًا)','повертатися (пішки)','retourner (à pied)','volver (a pie)','возвращаться (пешком)','برگشتن (پیاده)','wracać (pieszo)','tornare indietro (a piedi)','voltar (a pé)']],
 ['zurück|fahren','fährt zurück','ist zurückgefahren',['fahrt zurück','zurückfährt','fährst zurück'],['hat zurückgefahren','ist zurückgefahrt','ist gezurückfahren'],['(araçla) geri dönmek','mit dem Auto, Bus oder Zug zurück','to go back (by vehicle), to drive back','يعود (بمركبة)','їхати назад','rentrer (en véhicule)','volver (en vehículo)','ехать обратно','برگشتن (با وسیلهٔ نقلیه)','wracać (pojazdem)','tornare (con un mezzo)','voltar (de veículo)']],
 ['zurück|kommen','kommt zurück','ist zurückgekommen',['kömmt zurück','zurückkommt','kommst zurück'],['hat zurückgekommen','ist zurückgekommt','ist gezurückkommen'],['geri gelmek','wieder hierher kommen','to come back','يرجع، يعود','повертатися (сюди)','revenir','regresar, volver','возвращаться (сюда)','برگشتن (به اینجا)','wracać (tu)','tornare (qui)','regressar, voltar']],
];

/** Groups in the order of the textbook pages (1–4: first page, 5–8: second page); `verbs-all` practises every verb. */
export const verbGroups=[{id:'verbs-1',from:0,to:10},{id:'verbs-2',from:10,to:20},{id:'verbs-3',from:20,to:30},{id:'verbs-4',from:30,to:38},{id:'verbs-5',from:38,to:47},{id:'verbs-6',from:47,to:56},{id:'verbs-7',from:56,to:64},{id:'verbs-8',from:64,to:72}] as const;
/** Some meanings overlap; these verbs never appear together in a meaning question. */
const sameMeaning=[['anfangen','beginnen'],['geben','abgeben','zurückgeben'],['bringen','mitbringen','tragen','mitnehmen'],['kommen','ankommen','mitkommen','zurückkommen'],['gehen','laufen','fahren','zurückgehen'],['fahren','abfahren','zurückfahren'],['abfahren','aufstehen'],
 ['zurückgehen','zurückfahren','zurückkommen'],['nehmen','mitnehmen','bekommen'],['rufen','anrufen'],['stehen','aufstehen'],['tragen','anziehen'],['treffen','finden'],['wissen','kennen'],['ziehen','umziehen','ausziehen'],['sehen','aussehen']];
// Southern German, Austrian and Swiss usage also forms the Perfekt of liegen, sitzen and stehen with ist (the book writes hat/ist).
const alsoIst=new Set(['liegen','sitzen','stehen']);
const impersonal=new Set(['gefallen','leidtun','wehtun']);
// The book writes "sie scheint" (die Sonne).
const femininSubject=new Set(['scheinen']);

export const verbs:Verb[]=specs.map(([display,praesens,perfekt,praesensWrong,perfektWrong,meanings],index)=>{
 const id=display.replace('|','');const [aux,...rest]=perfekt.split(' ');
 return {id,display,infinitive:id,subject:impersonal.has(id)?'es':femininSubject.has(id)?'sie':'sie/er',praesens,perfekt,aux:aux as VerbAux,participle:rest.join(' '),alsoIst:alsoIst.has(id),group:verbGroups.find(group=>index>=group.from&&index<group.to)!.id,number:index+1,praesensWrong,perfektWrong,meanings};
});
export const verbMap=new Map(verbs.map(verb=>[verb.id,verb]));
export function verbMeaning(verb:Verb,language:VaultLanguage){return pickText(verb.meanings,language);}
/** Spoken subject: one clear singular pronoun (the page writes "sie/er"; "es" and "sie" stay as written). */
export function spokenSubject(verb:Verb){return verb.subject==='es'?'es':verb.subject==='sie'?'sie':'er';}
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
const stem=(id:string)=>id.replace(/^(ab|an|auf|aus|ein|herunter|mit|um|zurück|be)(?=[a-zäöüß]{4,})/,'');
/** For heard forms: verbs built on the same stem first (fahren ↔ ab|fahren), then others. */
function formDistractors(verb:Verb,seed:string,count=3){
 const near=verbs.filter(other=>other.id!==verb.id&&stem(other.id)===stem(verb.id)).map(other=>other.id);
 const rest=seeded(verbs.filter(other=>other.id!==verb.id&&!near.includes(other.id)).map(other=>other.id),seed);
 return [...seeded(near,seed),...rest].slice(0,count);
}

/** The Perfekt forms of three other verbs (a verb with the same stem first, e.g. fahren for ab|fahren), all different from the right one. */
function perfektDistractors(verb:Verb,seed:string){
 const taken=new Set([verb.perfekt]);const result:string[]=[];
 for(const id of formDistractors(verb,seed,8)){const other=verbs.find(item=>item.id===id)!;if(taken.has(other.perfekt))continue;taken.add(other.perfekt);result.push(other.perfekt);if(result.length===3)break;}
 return result;
}
// Past forms that are wrong for these verbs (their Partizip II looks like the infinitive).
const extraPartizipWrong:Record<string,string>={bekommen:'gebekommt',gefallen:'gefallt',vergessen:'vergissen'};
/** Three wrong past forms of the same verb, without hat/ist: the made-up forms of the book list (abgefahrt, geabfahren), then the infinitive. */
export function partizipDistractors(verb:Verb){
 const taken=new Set([verb.participle]);const result:string[]=[];
 const wrong=verb.perfektWrong.map(form=>form.split(' ').slice(1).join(' '));
 for(const form of [wrong[0],wrong[1],verb.infinitive,...wrong.slice(2),extraPartizipWrong[verb.id]??'']){if(!form||taken.has(form))continue;taken.add(form);result.push(form);if(result.length===3)break;}
 return result;
}
/** Präsens forms of the other persons (du, ich, wir, ihr), the prefix at the end: the wrong options of the sentence task. */
/** wissen keeps the old singular: ich weiß, du weißt, er weiß (no -e, no -t). */
const personForms:Record<string,{er:string;du:string;ich:string;wir:string;ihr:string}>={wissen:{er:'weiß',du:'weißt',ich:'weiß',wir:'wissen',ihr:'wisst'}};
export function praesensPersons(verb:Verb){
 const fixed=personForms[verb.id];if(fixed)return {...fixed};
 const prefix=verb.display.includes('|')?verb.display.split('|')[0]:'';const tail=prefix?' '+prefix:'';
 const er=prefix?verb.praesens.slice(0,-(prefix.length+1)):verb.praesens;
 const base=verb.infinitive.slice(prefix.length);const stem=base.replace(/e?n$/,'');
 // du: isst/liest keep the er form; findet/bietet → findest; gilt (stem gelt-) → giltst; lädt → lädst; otherwise fährt → fährst.
 const du=/[sßzx]t$/.test(er)?er:/[dt]$/.test(stem)&&er.endsWith('et')?er.slice(0,-2)+'est':stem.endsWith('t')?er+'st':er.slice(0,-1)+'st';
 return {er:er+tail,du:du+tail,ich:stem+'e'+tail,wir:base+tail,ihr:stem+(/[dt]$/.test(stem)?'et':'t')+tail};
}
/** Three forms that do not fit the subject: the other persons first, then the old spelling traps when a person form repeats. */
function personDistractors(verb:Verb){
 const forms=praesensPersons(verb);const seen=new Set([verb.praesens]);const result:string[]=[];
 for(const form of [forms.du,forms.ich,forms.wir,forms.ihr,...verb.praesensWrong]){if(seen.has(form))continue;seen.add(form);result.push(form);if(result.length===3)break;}
 return result;
}
/** Shuffle a question's options the same way for one round, so a saved round keeps its order without the server. */
export function seededOptions(options:readonly string[],seed:string){return seeded(options,seed);}
const verbBank:Question[]=[];
for(const verb of verbs){
 const meaning=verb.meanings[0];const subject=verb.subject;
 const explanation=verb.display+' = '+meaning+'. Präsens: '+subject+' '+verb.praesens+' · Perfekt: '+subject+' '+perfektLabel(verb)+'.';
 const shared={topic:verb.group,verbId:verb.id,explanation};
 const add=(id:string,task:VerbTask,question:Omit<Question,'id'|'topic'|'explanation'>)=>verbBank.push({id,...shared,verbTask:task,...question});
 add('verb-meaning-'+verb.id,'meaning',{kind:'choice',prompt:verb.display+' ne demek?',answer:verb.infinitive,options:[verb.infinitive,...meaningDistractors(verb,'meaning-'+verb.id)]});
 add('verb-word-'+verb.id,'word',{kind:'choice',prompt:'“'+meaning+'” anlamındaki Almanca fiil hangisi?',answer:verb.infinitive,options:[verb.infinitive,...meaningDistractors(verb,'word-'+verb.id)]});
 add('verb-fit-'+verb.id,'fit',{kind:'choice',prompt:verb.display+' · Özneye göre boşluğa uyan biçim hangisi?',answer:verb.praesens,options:[verb.praesens,...personDistractors(verb)]});
 add('verb-praesens-'+verb.id,'praesens',{kind:'choice',prompt:verb.display+' · Präsens: '+subject+' …',answer:verb.praesens,options:[verb.praesens,...verb.praesensWrong]});
 add('verb-perfekt-'+verb.id,'perfekt',{kind:'choice',prompt:verb.display+' · Perfekt: '+subject+' …',answer:verb.perfekt,options:[verb.perfekt,...verb.perfektWrong]});
 // The last step of the Perfekt stage: the meaning is shown, the Perfekt of that verb is chosen among the Perfekt forms of other verbs.
 add('verb-meaning-perfekt-'+verb.id,'meaning-perfekt',{kind:'choice',prompt:'“'+meaning+'” anlamındaki fiilin Perfekt biçimi: '+subject+' …',answer:verb.perfekt,options:[verb.perfekt,...perfektDistractors(verb,'meaning-perfekt-'+verb.id)]});
 // The past form of the verb alone: the infinitive is shown, the Partizip II is chosen (no hat/ist, no other verbs).
 add('verb-partizip-'+verb.id,'partizip',{kind:'choice',prompt:verb.display+' · geçmiş hali (Partizip II) hangisi?',answer:verb.participle,options:[verb.participle,...partizipDistractors(verb)]});
 // The past form spelled with letters: the infinitive is shown, the Partizip II is written (no hat/ist).
 add('verb-write-partizip-'+verb.id,'write-partizip',{kind:'write',writingTask:'word',prompt:verb.display+' · geçmiş halini (Partizip II) yaz.',answer:verb.participle});
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
