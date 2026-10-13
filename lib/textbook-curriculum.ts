import type {Translations} from './study-languages';

export type CourseLevel='A1.1'|'A1.2';
export type CourseUnit={id:string;level:CourseLevel;number:number;title:string;de:string;names:Translations;legacyTopics:string[]};

// Catalogue only: textbook chapter order, headings and language variants.
export const courseUnits:CourseUnit[]=[
  {
    "id": "book-01",
    "level": "A1.1",
    "number": 1,
    "title": "Hoş geldin!",
    "de": "Willkommen!",
    "names": [
      "Hoş geldin!",
      "Willkommen!",
      "Welcome!",
      "مرحباً!",
      "Ласкаво просимо!",
      "Bienvenue !"
    ],
    "legacyTopics": [
      "a11-01",
      "names",
      "origin",
      "languages",
      "address",
      "alphabet",
      "greetings",
      "intro",
      "reading",
      "writing",
      "wellbeing",
      "verbs",
      "order"
    ]
  },
  {
    "id": "book-02",
    "level": "A1.1",
    "number": 2,
    "title": "Meslekler",
    "de": "Berufe",
    "names": [
      "Meslekler",
      "Berufe",
      "Professions",
      "المهن",
      "Професії",
      "Métiers"
    ],
    "legacyTopics": [
      "a12-03"
    ]
  },
  {
    "id": "book-03",
    "level": "A1.1",
    "number": 3,
    "title": "Yerler ve nesneler",
    "de": "Orte und Dinge",
    "names": [
      "Yerler ve nesneler",
      "Orte und Dinge",
      "Places and things",
      "الأماكن والأشياء",
      "Місця та речі",
      "Lieux et objets"
    ],
    "legacyTopics": [
      "a11-03",
      "a11-04",
      "u9-esyalar"
    ]
  },
  {
    "id": "book-04",
    "level": "A1.1",
    "number": 4,
    "title": "Aile",
    "de": "Familie",
    "names": [
      "Aile",
      "Familie",
      "Family",
      "العائلة",
      "Сім’я",
      "Famille"
    ],
    "legacyTopics": [
      "a11-02"
    ]
  },
  {
    "id": "book-05",
    "level": "A1.1",
    "number": 5,
    "title": "Günlük yaşam ve boş zaman",
    "de": "Alltag und Freizeit",
    "names": [
      "Günlük yaşam ve boş zaman",
      "Alltag und Freizeit",
      "Daily life and leisure",
      "الحياة اليومية ووقت الفراغ",
      "Повсякдення та дозвілля",
      "Vie quotidienne et loisirs"
    ],
    "legacyTopics": [
      "a11-06"
    ]
  },
  {
    "id": "book-06",
    "level": "A1.1",
    "number": 6,
    "title": "Çalışma saatleri",
    "de": "Arbeitszeiten",
    "names": [
      "Çalışma saatleri",
      "Arbeitszeiten",
      "Working hours",
      "أوقات العمل",
      "Робочий час",
      "Horaires de travail"
    ],
    "legacyTopics": [
      "a11-05",
      "u9-fiiller",
      "u9-ayrilan"
    ]
  },
  {
    "id": "book-07",
    "level": "A1.1",
    "number": 7,
    "title": "Yemek",
    "de": "Essen",
    "names": [
      "Yemek",
      "Essen",
      "Food",
      "الطعام",
      "Їжа",
      "Alimentation"
    ],
    "legacyTopics": [
      "a11-07",
      "a11-10",
      "meals"
    ]
  },
  {
    "id": "book-08",
    "level": "A1.1",
    "number": 8,
    "title": "Bir parti",
    "de": "Eine Party",
    "names": [
      "Bir parti",
      "Eine Party",
      "A party",
      "حفلة",
      "Вечірка",
      "Une fête"
    ],
    "legacyTopics": [
      "a11-08",
      "invitations",
      "can",
      "compounds",
      "food-acc",
      "nehmen",
      "compliments",
      "ordering",
      "u9-nehmen"
    ]
  },
  {
    "id": "book-09",
    "level": "A1.1",
    "number": 9,
    "title": "Randevular",
    "de": "Termine",
    "names": [
      "Randevular",
      "Termine",
      "Appointments",
      "المواعيد",
      "Зустрічі",
      "Rendez-vous"
    ],
    "legacyTopics": [
      "a11-09",
      "a12-10",
      "appointments",
      "u9-telefon",
      "u9-zaman",
      "u9-acilis",
      "u9-modal",
      "u9-artikel",
      "u9-yer",
      "u9-zamir",
      "u9-kurumlar",
      "u9-planlar",
      "u9-mesajlar",
      "u9-sesler"
    ]
  },
  {
    "id": "book-10",
    "level": "A1.1",
    "number": 10,
    "title": "Otobüs ve trenle",
    "de": "Mit Bus und Bahn",
    "names": [
      "Otobüs ve trenle",
      "Mit Bus und Bahn",
      "By bus and train",
      "بالحافلة والقطار",
      "Автобусом і потягом",
      "En bus et en train"
    ],
    "legacyTopics": [
      "a12-01"
    ]
  },
  {
    "id": "book-11",
    "level": "A1.2",
    "number": 11,
    "title": "Ev ve yaşam",
    "de": "Wohnen",
    "names": [
      "Ev ve yaşam",
      "Wohnen",
      "Housing",
      "السكن",
      "Житло",
      "Logement"
    ],
    "legacyTopics": [
      "a12-09",
      "a12-07",
      "book-11-a",
      "book-11-b",
      "book-11-c",
      "book-11-d"
    ]
  },
  {
    "id": "book-12",
    "level": "A1.2",
    "number": 12,
    "title": "Eğitim",
    "de": "Ausbildung",
    "names": [
      "Eğitim",
      "Ausbildung",
      "Education and training",
      "التعليم والتدريب",
      "Освіта та навчання",
      "Formation"
    ],
    "legacyTopics": []
  },
  {
    "id": "book-13",
    "level": "A1.2",
    "number": 13,
    "title": "Doktorda",
    "de": "Beim Arzt",
    "names": [
      "Doktorda",
      "Beim Arzt",
      "At the doctor’s",
      "عند الطبيب",
      "У лікаря",
      "Chez le médecin"
    ],
    "legacyTopics": [
      "a12-04"
    ]
  },
  {
    "id": "book-14",
    "level": "A1.2",
    "number": 14,
    "title": "Hastalık raporu",
    "de": "Die Krankschreibung",
    "names": [
      "Hastalık raporu",
      "Die Krankschreibung",
      "Sick leave",
      "الإجازة المرضية",
      "Лікарняний",
      "Arrêt maladie"
    ],
    "legacyTopics": []
  },
  {
    "id": "book-15",
    "level": "A1.2",
    "number": 15,
    "title": "Şehirde yollar",
    "de": "Wege in der Stadt",
    "names": [
      "Şehirde yollar",
      "Wege in der Stadt",
      "Getting around town",
      "الطرق في المدينة",
      "Шлях містом",
      "Itinéraires en ville"
    ],
    "legacyTopics": [
      "a12-02"
    ]
  },
  {
    "id": "book-16",
    "level": "A1.2",
    "number": 16,
    "title": "Mağazada",
    "de": "Im Geschäft",
    "names": [
      "Mağazada",
      "Im Geschäft",
      "In the shop",
      "في المتجر",
      "У магазині",
      "Dans un magasin"
    ],
    "legacyTopics": [
      "a12-05"
    ]
  },
  {
    "id": "book-17",
    "level": "A1.2",
    "number": 17,
    "title": "Çalışmak",
    "de": "Arbeiten",
    "names": [
      "Çalışmak",
      "Arbeiten",
      "Working",
      "العمل",
      "Робота",
      "Travailler"
    ],
    "legacyTopics": []
  },
  {
    "id": "book-18",
    "level": "A1.2",
    "number": 18,
    "title": "Resmî kurumda",
    "de": "Beim Amt",
    "names": [
      "Resmî kurumda",
      "Beim Amt",
      "At the municipal office",
      "في الدائرة الحكومية",
      "В установі",
      "À l’administration"
    ],
    "legacyTopics": []
  },
  {
    "id": "book-19",
    "level": "A1.2",
    "number": 19,
    "title": "Almanya’da yolculuk",
    "de": "Unterwegs in Deutschland",
    "names": [
      "Almanya’da yolculuk",
      "Unterwegs in Deutschland",
      "Travelling in Germany",
      "السفر في ألمانيا",
      "Подорож Німеччиною",
      "Voyager en Allemagne"
    ],
    "legacyTopics": [
      "a12-06"
    ]
  },
  {
    "id": "book-20",
    "level": "A1.2",
    "number": 20,
    "title": "Kutlamalar ve bayramlar",
    "de": "Feste und Feiertage",
    "names": [
      "Kutlamalar ve bayramlar",
      "Feste und Feiertage",
      "Celebrations and holidays",
      "الأعياد والاحتفالات",
      "Свята та урочистості",
      "Fêtes et jours fériés"
    ],
    "legacyTopics": [
      "a12-08"
    ]
  }
];
