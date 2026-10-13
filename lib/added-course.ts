import type {Topic,Word} from "./lessons";
import type {Question} from "./course";
export const addedTopics:Topic[]=[
  {
    "id": "meals",
    "title": "Öğünler ve yemek alışkanlıkları",
    "de": "Guten Appetit!",
    "section": "8 · A",
    "pages": "Ders 70–71",
    "minutes": 10,
    "lead": "Ne zaman, ne yiyip içtiğini anlat; sıcak–soğuk ve erken–geç ayrımını öğren.",
    "blocks": [
      {
        "heading": "Üç öğün",
        "table": {
          "heads": [
            "Öğün",
            "Fiil / ifade",
            "Türkçe"
          ],
          "rows": [
            [
              "das Frühstück",
              "frühstücken",
              "kahvaltı / kahvaltı yapmak"
            ],
            [
              "das Mittagessen",
              "zu Mittag essen",
              "öğle yemeği yemek"
            ],
            [
              "das Abendessen",
              "zu Abend essen",
              "akşam yemeği yemek"
            ],
            [
              "die Kaffeepause",
              "eine Kaffeepause machen",
              "kahve molası vermek"
            ]
          ]
        }
      },
      {
        "heading": "Ne zaman? Ne yiyorsun?",
        "examples": [
          {
            "de": "Ich frühstücke um sieben Uhr.",
            "tr": "Saat yedide kahvaltı yapıyorum."
          },
          {
            "de": "Ich esse zu Mittag Fisch mit Reis.",
            "tr": "Öğlen pilavlı balık yiyorum."
          },
          {
            "de": "Am Abend esse ich Brot und Käse.",
            "tr": "Akşam ekmek ve peynir yiyorum."
          },
          {
            "de": "Ich trinke gern Tee.",
            "tr": "Çay içmeyi seviyorum."
          }
        ],
        "tip": "um + saat; am Morgen/am Abend + günün bölümü. gern fiile duyulan isteği belirtir: Ich koche gern."
      },
      {
        "heading": "Lezzet ve görünüş",
        "examples": [
          {
            "de": "Ich habe Hunger.",
            "tr": "Açım."
          },
          {
            "de": "Der Salat sieht gut aus.",
            "tr": "Salata güzel görünüyor."
          },
          {
            "de": "Das Essen ist warm.",
            "tr": "Yemek sıcak."
          },
          {
            "de": "Guten Appetit!",
            "tr": "Afiyet olsun!"
          }
        ]
      },
      {
        "heading": "Okuma stratejisi",
        "text": "Kitaptaki erken kahvaltı ve saat 12’de öğle yemeği gibi ifadeler, okuma metninin anlattığı genellemelerdir. Her kişinin alışkanlığı farklıdır. Sorularda verilen metne göre cevapla; kişilerin alışkanlığını fotoğraftan tahmin etme.",
        "tip": "pünktlich = zamanında; früh = erken; spät = geç; warm = sıcak; kalt = soğuk."
      }
    ],
    "unit": 8
  },
  {
    "id": "compounds",
    "title": "Birleşik kelimeler ve artikeller",
    "de": "die Tomatensuppe",
    "section": "8 · A",
    "pages": "Ders 71",
    "minutes": 10,
    "lead": "İki ismi birleştir; son kelimenin artikelini ve kelime vurgusunu takip et.",
    "blocks": [
      {
        "heading": "Artikel son isimden gelir",
        "table": {
          "heads": [
            "Birleşim",
            "Son isim",
            "Sonuç"
          ],
          "rows": [
            [
              "Tomate + Suppe",
              "die Suppe",
              "die Tomatensuppe"
            ],
            [
              "Kartoffel + Salat",
              "der Salat",
              "der Kartoffelsalat"
            ],
            [
              "Käse + Brot",
              "das Brot",
              "das Käsebrot"
            ],
            [
              "Birne + Kuchen",
              "der Kuchen",
              "der Birnenkuchen"
            ],
            [
              "Milch + Kaffee",
              "der Kaffee",
              "der Milchkaffee"
            ]
          ]
        }
      },
      {
        "heading": "Yemek adları",
        "examples": [
          {
            "de": "die Fischsuppe · die Nudelsuppe",
            "tr": "balık çorbası · erişte çorbası"
          },
          {
            "de": "der Obstsalat · der Nudelsalat",
            "tr": "meyve salatası · makarna salatası"
          },
          {
            "de": "das Wurstbrot · der Apfelkuchen",
            "tr": "sosisli ekmek · elmalı kek"
          }
        ]
      },
      {
        "heading": "Bir bütün olarak öğren",
        "text": "Bazı birleşimlerde bağlantı harfi vardır: Birne → Birnenkuchen, Tomate → Tomatensuppe. Artikeli, yazılışı ve sesi birlikte çalış.",
        "tip": "Bu örneklerde temel vurgu ilk parçadadır: TOmaten-suppe, KARtoffel-salat. Kelimenin sesini dinleyip tekrar et."
      }
    ],
    "unit": 8
  },
  {
    "id": "can",
    "title": "können: yapabilmek ve cümle sırası",
    "de": "Ich kann einen Salat mitbringen.",
    "section": "8 · B",
    "pages": "Ders 72–73",
    "minutes": 10,
    "lead": "Yapabildiğini söyle; çekimli modal fiili ve mastarı doğru yerlere koy.",
    "blocks": [
      {
        "heading": "können çekimi",
        "table": {
          "heads": [
            "Özne",
            "Çekim"
          ],
          "rows": [
            [
              "ich",
              "kann"
            ],
            [
              "du",
              "kannst"
            ],
            [
              "er / sie / es",
              "kann"
            ],
            [
              "wir",
              "können"
            ],
            [
              "ihr",
              "könnt"
            ],
            [
              "sie / Sie",
              "können"
            ]
          ]
        }
      },
      {
        "heading": "İki fiil neden var?",
        "text": "Modal fiil özneye göre çekilir; eylemi anlatan ikinci fiil mastar hâlinde sona gider. Ich kann kochen. cümlesinde kann çekimlidir, kochen mastardır.",
        "examples": [
          {
            "de": "Ich kann einen Kuchen backen.",
            "tr": "Bir kek yapabilirim."
          },
          {
            "de": "Du kannst Getränke bestellen.",
            "tr": "İçecek sipariş edebilirsin."
          },
          {
            "de": "Wir können Musik organisieren.",
            "tr": "Müzik ayarlayabiliriz."
          },
          {
            "de": "Ich kann am Sonntag leider nicht kommen.",
            "tr": "Pazar günü maalesef gelemem."
          }
        ],
        "tip": "mitbringen ayrılabilen fiildir; modal fiille mastar tek parça kalır: Ich kann Essen mitbringen. Modal olmadan: Ich bringe Essen mit."
      },
      {
        "heading": "Soru ve kısa cevap",
        "examples": [
          {
            "de": "Kannst du eine Suppe kochen? — Ja, ich kann eine Suppe kochen.",
            "tr": "Çorba yapabilir misin? — Evet, çorba yapabilirim."
          },
          {
            "de": "Könnt ihr Musik mitbringen?",
            "tr": "Müzik getirebilir misiniz? (siz: ihr)"
          },
          {
            "de": "Können Sie am Freitag kommen?",
            "tr": "Cuma günü gelebilir misiniz? (resmî)"
          }
        ],
        "tip": "Evet/hayır sorusunda können en baştadır. ich kann nicht = yapamam; ich koche nicht gern = yemek yapmayı sevmiyorum. Anlamları farklıdır."
      }
    ],
    "unit": 8
  },
  {
    "id": "invitations",
    "title": "Parti planı, davet ve cevap",
    "de": "Wir feiern am Sonntag.",
    "section": "8 · B",
    "pages": "Ders 72–73",
    "minutes": 10,
    "lead": "Kim, ne zaman, nerede ve ne getirebilir sorularını cevapla; kısa davet ve yanıt yaz.",
    "blocks": [
      {
        "heading": "Davetin dört bilgisi",
        "examples": [
          {
            "de": "Wir feiern am Sonntag um 17 Uhr.",
            "tr": "Pazar günü saat 17’de kutlama yapıyoruz."
          },
          {
            "de": "Die Party ist im Kursraum.",
            "tr": "Parti sınıfta."
          },
          {
            "de": "Wir möchten euch einladen.",
            "tr": "Sizi davet etmek istiyoruz."
          },
          {
            "de": "Bitte antwortet bis Freitag.",
            "tr": "Lütfen cumaya kadar cevap verin."
          }
        ],
        "tip": "am + gün: am Sonntag; um + saat: um 17 Uhr; bis + son tarih: bis Freitag."
      },
      {
        "heading": "Gelmek veya gelememek",
        "examples": [
          {
            "de": "Vielen Dank für die Einladung. Ich komme gern.",
            "tr": "Davet için çok teşekkürler. Seve seve gelirim."
          },
          {
            "de": "Ich kann einen Salat mitbringen.",
            "tr": "Bir salata getirebilirim."
          },
          {
            "de": "Ich kann leider nicht kommen.",
            "tr": "Maalesef gelemem."
          },
          {
            "de": "Ich bin am Wochenende in Berlin.",
            "tr": "Hafta sonu Berlin’deyim."
          },
          {
            "de": "Viele Grüße und bis Sonntag!",
            "tr": "Selamlar, pazar görüşürüz!"
          }
        ]
      },
      {
        "heading": "feiern ve einladen",
        "table": {
          "heads": [
            "Özne",
            "feiern",
            "einladen"
          ],
          "rows": [
            [
              "ich",
              "feiere",
              "lade … ein"
            ],
            [
              "du",
              "feierst",
              "lädst … ein"
            ],
            [
              "er / sie / es",
              "feiert",
              "lädt … ein"
            ],
            [
              "wir",
              "feiern",
              "laden … ein"
            ],
            [
              "ihr",
              "feiert",
              "ladet … ein"
            ],
            [
              "sie / Sie",
              "feiern",
              "laden … ein"
            ]
          ]
        }
      },
      {
        "heading": "Senin için ne önemli?",
        "examples": [
          {
            "de": "Für mich ist Musik wichtig.",
            "tr": "Benim için müzik önemli."
          },
          {
            "de": "Das ist für mich nicht so wichtig.",
            "tr": "Bu benim için o kadar önemli değil."
          }
        ],
        "tip": "Kısa davet: Hallo Anna! Wir feiern am Samstag um 18 Uhr. Kannst du kommen? Viele Grüße, Koray. Tarih, saat ve yer bilgisini kontrol et."
      }
    ],
    "unit": 8
  },
  {
    "id": "food-acc",
    "title": "Yemek siparişinde Akkusativ",
    "de": "Ich möchte den Salat.",
    "section": "8 · C",
    "pages": "Ders 74–75",
    "minutes": 10,
    "lead": "der → den değişimini öğren; das, die ve çoğul die biçimlerini koru.",
    "blocks": [
      {
        "heading": "Belirli artikeller",
        "table": {
          "heads": [
            "Cinsiyet",
            "Nominativ",
            "Akkusativ",
            "Örnek"
          ],
          "rows": [
            [
              "eril",
              "der",
              "den",
              "Ich nehme den Salat."
            ],
            [
              "nötr",
              "das",
              "das",
              "Ich möchte das Hähnchen."
            ],
            [
              "dişil",
              "die",
              "die",
              "Ich esse die Suppe."
            ],
            [
              "çoğul",
              "die",
              "die",
              "Ich nehme die Nudeln."
            ]
          ]
        }
      },
      {
        "heading": "Belirsiz artikel ve olumsuzluk",
        "table": {
          "heads": [
            "Cinsiyet",
            "Belirsiz artikel",
            "kein"
          ],
          "rows": [
            [
              "eril",
              "einen Salat",
              "keinen Fisch"
            ],
            [
              "nötr",
              "ein Hähnchen",
              "kein Fleisch"
            ],
            [
              "dişil",
              "eine Suppe",
              "keine Suppe"
            ],
            [
              "çoğul",
              "Nudeln (ein yok)",
              "keine Nudeln"
            ]
          ]
        }
      },
      {
        "heading": "Fiilin nesnesi",
        "examples": [
          {
            "de": "Ich nehme einen Salat.",
            "tr": "Bir salata alıyorum."
          },
          {
            "de": "Ich esse kein Fleisch.",
            "tr": "Et yemiyorum."
          },
          {
            "de": "Ich möchte eine Pizza.",
            "tr": "Bir pizza istiyorum."
          },
          {
            "de": "Der Salat schmeckt gut.",
            "tr": "Salatanın tadı güzel."
          }
        ],
        "tip": "Der Salat schmeckt gut. cümlesinde salata öznedir, der kalır. Ich esse den Salat. cümlesinde nesnedir, den olur. “eine Pizza” doğrudur."
      },
      {
        "heading": "mit ve ohne",
        "text": "mit + Dativ; ohne + Akkusativ kullanılır. Bu ünitede kalıpları bir bütün öğren: mit Reis, mit Gemüse, ohne Fleisch, ohne Tomaten.",
        "examples": [
          {
            "de": "Ich möchte den Fisch mit Reis.",
            "tr": "Pilavlı balık istiyorum."
          },
          {
            "de": "Können Sie den Salat ohne Tomaten machen?",
            "tr": "Salatayı domates olmadan yapabilir misiniz?"
          }
        ]
      }
    ],
    "unit": 8
  },
  {
    "id": "nehmen",
    "title": "nehmen çekimi ve yemek seçme",
    "de": "Du nimmst den Fisch.",
    "section": "8 · C",
    "pages": "Ders 75",
    "minutes": 10,
    "lead": "nehmen fiilinin du ve er/sie/es biçimlerini kullan; yemek seçimini söyle.",
    "blocks": [
      {
        "heading": "nehmen çekimi",
        "table": {
          "heads": [
            "Özne",
            "Fiil"
          ],
          "rows": [
            [
              "ich",
              "nehme"
            ],
            [
              "du",
              "nimmst"
            ],
            [
              "er / sie / es",
              "nimmt"
            ],
            [
              "wir",
              "nehmen"
            ],
            [
              "ihr",
              "nehmt"
            ],
            [
              "sie / Sie",
              "nehmen"
            ]
          ]
        }
      },
      {
        "heading": "Yemeği seç",
        "examples": [
          {
            "de": "Ich nehme den Kartoffelsalat.",
            "tr": "Patates salatasını alıyorum."
          },
          {
            "de": "Du nimmst das Gulasch.",
            "tr": "Gulaşı alıyorsun."
          },
          {
            "de": "Er nimmt die Tomatensuppe.",
            "tr": "Domates çorbasını alıyor."
          },
          {
            "de": "Was nehmen Sie?",
            "tr": "Ne alırsınız?"
          }
        ],
        "tip": "du ve er/sie/es biçimlerinde e → i: nimmst / nimmt. ich neh me değil, tek kelime nehme; du nehmst biçimi yanlıştır."
      }
    ],
    "unit": 8
  },
  {
    "id": "compliments",
    "title": "Lezzet, iltifat ve teşekkür",
    "de": "Hm, das schmeckt super!",
    "section": "8 · C",
    "pages": "Ders 74–75",
    "minutes": 10,
    "lead": "Yemeği öv, yemek yapana iltifat et ve teşekkürle cevap ver.",
    "blocks": [
      {
        "heading": "İltifat yap",
        "examples": [
          {
            "de": "Du kochst sehr gut.",
            "tr": "Çok iyi yemek yapıyorsun."
          },
          {
            "de": "Die Suppe ist sehr lecker.",
            "tr": "Çorba çok lezzetli."
          },
          {
            "de": "Das sieht aber lecker aus!",
            "tr": "Bu gerçekten lezzetli görünüyor!"
          },
          {
            "de": "Mir schmeckt der Salat gut.",
            "tr": "Salatanın tadını beğeniyorum."
          },
          {
            "de": "Du bist ein guter Koch.",
            "tr": "Sen iyi bir aşçısın."
          }
        ]
      },
      {
        "heading": "Uygun cevap",
        "examples": [
          {
            "de": "Danke schön!",
            "tr": "Çok teşekkür ederim!"
          },
          {
            "de": "Vielen Dank!",
            "tr": "Çok teşekkürler!"
          },
          {
            "de": "Danke, das freut mich.",
            "tr": "Teşekkürler, buna sevindim."
          },
          {
            "de": "Ja? Findest du? Danke!",
            "tr": "Öyle mi? Sence de mi? Teşekkürler!"
          }
        ],
        "tip": "İltifat (Du kochst sehr gut.) ile cevap (Danke, das freut mich.) ayrı görevlerdir."
      },
      {
        "heading": "Tadına bakma ve kadeh kaldırma",
        "examples": [
          {
            "de": "Möchtest du die Suppe probieren?",
            "tr": "Çorbanın tadına bakmak ister misin?"
          },
          {
            "de": "Ja, gern.",
            "tr": "Evet, seve seve."
          },
          {
            "de": "Wie machst du den Salat?",
            "tr": "Salatayı nasıl yapıyorsun?"
          },
          {
            "de": "Mit Joghurt und Zwiebeln.",
            "tr": "Yoğurt ve soğanla."
          },
          {
            "de": "Prost! / Zum Wohl!",
            "tr": "Şerefe!"
          }
        ],
        "tip": "schmecken = tadı olmak / tat olarak beğenilmek; aussehen = görünmek. Der Salat schmeckt gut. = Tadı güzel; Der Salat sieht gut aus. = Görünüşü güzel."
      }
    ],
    "unit": 8
  },
  {
    "id": "ordering",
    "title": "Telefonla yemek siparişi",
    "de": "Ich möchte bestellen.",
    "section": "8 · D",
    "pages": "Ders 76–77",
    "minutes": 10,
    "lead": "Menüyü ve fiyatı anla; malzeme değişikliği ve içecek sor, sipariş ver.",
    "blocks": [
      {
        "heading": "Telefon konuşmasının akışı",
        "examples": [
          {
            "de": "Guten Tag. Ich möchte bestellen.",
            "tr": "İyi günler. Sipariş vermek istiyorum."
          },
          {
            "de": "Ich habe aber noch Fragen.",
            "tr": "Ama henüz sorularım var."
          },
          {
            "de": "Können Sie auch Salat ohne Tomaten machen?",
            "tr": "Domatessiz salata da yapabilir misiniz?"
          },
          {
            "de": "Ja, das ist möglich.",
            "tr": "Evet, bu mümkün."
          },
          {
            "de": "Haben Sie auch Saft?",
            "tr": "Meyve suyunuz da var mı?"
          },
          {
            "de": "Kann ich gleich bestellen?",
            "tr": "Hemen sipariş verebilir miyim?"
          }
        ]
      },
      {
        "heading": "Menü ve fiyat",
        "table": {
          "heads": [
            "Yemek",
            "Örnek fiyat"
          ],
          "rows": [
            [
              "Salat mit Tomaten und Paprika",
              "3,80 €"
            ],
            [
              "Fisch mit Reis",
              "8,90 €"
            ],
            [
              "Hähnchen mit Pommes",
              "7,20 €"
            ],
            [
              "Schokoladenkuchen",
              "2,90 €"
            ]
          ]
        }
      },
      {
        "heading": "Düzelt ve kontrol et",
        "examples": [
          {
            "de": "Ich nehme den Fisch mit Reis.",
            "tr": "Pilavlı balığı alıyorum."
          },
          {
            "de": "Ohne Fleisch, bitte.",
            "tr": "Et olmadan, lütfen."
          },
          {
            "de": "Haben Sie Apfelsaft oder Orangensaft?",
            "tr": "Elma suyu veya portakal suyunuz var mı?"
          }
        ],
        "tip": "Kitaptaki MENKEN fiyatları ders örneğidir, güncel satış fiyatı değildir. Dinleme metinleri yeni hazırlanmıştır; fotoğraftaki el yazısı cevapları kesin sesli cevap olarak kullanmıyoruz."
      }
    ],
    "unit": 8
  },
  {
    "id": "appointments",
    "title": "Randevu ve açılış saatleri",
    "de": "Ich möchte einen Termin vereinbaren.",
    "section": "9 · A",
    "pages": "Ders 80",
    "minutes": 10,
    "lead": "Kurumları, açılış saatlerini ve yapmak istediğin işlemi söyle.",
    "blocks": [
      {
        "heading": "Kurumlar ve işlemler",
        "table": {
          "heads": [
            "Kurum",
            "İşlem",
            "Türkçe"
          ],
          "rows": [
            [
              "das Bürgerbüro",
              "eine Wohnung anmelden",
              "adres kaydı yaptırmak"
            ],
            [
              "die Bank",
              "Geld überweisen",
              "para havale etmek"
            ],
            [
              "die Post",
              "ein Paket abgeben",
              "paket teslim etmek"
            ],
            [
              "die Apotheke",
              "Medikamente kaufen",
              "ilaç satın almak"
            ],
            [
              "die Agentur für Arbeit",
              "Informationen bekommen",
              "iş konusunda bilgi almak"
            ]
          ]
        }
      },
      {
        "heading": "möchte + mastar",
        "examples": [
          {
            "de": "Ich möchte einen Termin vereinbaren.",
            "tr": "Randevu ayarlamak istiyorum."
          },
          {
            "de": "Ich möchte ein Paket abgeben.",
            "tr": "Paket teslim etmek istiyorum."
          },
          {
            "de": "Ich möchte Geld überweisen.",
            "tr": "Para havale etmek istiyorum."
          }
        ],
        "tip": "möchte ikinci ögede, mastar sonda: Ich möchte heute ein Paket abgeben. ich möchte / du möchtest / er möchte / wir möchten / ihr möchtet / Sie möchten."
      },
      {
        "heading": "Açık ve kapalı",
        "examples": [
          {
            "de": "Wann hat die Post geöffnet?",
            "tr": "Postane ne zaman açık?"
          },
          {
            "de": "Die Post hat von halb acht bis sechs geöffnet.",
            "tr": "Postane yedi buçuktan altıya kadar açık."
          },
          {
            "de": "Am Sonntag ist die Post geschlossen.",
            "tr": "Pazar günü postane kapalı."
          }
        ],
        "tip": "halb acht = 07:30; halb sechs = 05:30. Günün bağlamıyla akşam 17:30 da olabilir. von … bis … = …den …e kadar; Montag bis Freitag = pazartesiden cumaya."
      },
      {
        "heading": "Fotoğraftaki örnek saatler",
        "table": {
          "heads": [
            "Kurum",
            "Gün",
            "Saat"
          ],
          "rows": [
            [
              "Bürgerbüro",
              "Mo, Mi, Fr",
              "09:00–19:00"
            ],
            [
              "Bürgerbüro",
              "Di, Do",
              "11:00–18:00"
            ],
            [
              "Bürgerbüro",
              "Sa, So",
              "kapalı"
            ],
            [
              "Post",
              "Mo–Fr",
              "07:30–18:00"
            ],
            [
              "Post",
              "Sa",
              "10:00–12:00"
            ],
            [
              "Post",
              "So",
              "kapalı"
            ],
            [
              "Flora Apotheke",
              "Mo–Fr",
              "09:00–19:00"
            ],
            [
              "Flora Apotheke",
              "Sa",
              "09:00–15:00"
            ],
            [
              "Flora Apotheke",
              "So",
              "kapalı"
            ],
            [
              "Agentur für Arbeit",
              "Mo–Mi",
              "08:00–18:00"
            ],
            [
              "Agentur für Arbeit",
              "Do, Fr",
              "11:00–17:00"
            ]
          ]
        }
      },
      {
        "heading": "Bu sayfanın kapsamı",
        "text": "Bu derste yalnızca paylaşılan 80. sayfa işlendi. Sağdaki 81. sayfa fotoğrafta tam görünmediği için tamamı kapsanmış sayılmaz. Kurum saatleri kitaptaki ders örnekleridir; gerçek ziyaret öncesinde güncel saatlerini ayrıca kontrol et."
      }
    ],
    "unit": 9
  }
];
export const addedWords:Word[]=[
  {
    "de": "das Frühstück",
    "tr": "kahvaltı",
    "topic": "meals"
  },
  {
    "de": "frühstücken",
    "tr": "kahvaltı yapmak",
    "topic": "meals"
  },
  {
    "de": "das Mittagessen",
    "tr": "öğle yemeği",
    "topic": "meals"
  },
  {
    "de": "das Abendessen",
    "tr": "akşam yemeği",
    "topic": "meals"
  },
  {
    "de": "die Kaffeepause",
    "tr": "kahve molası",
    "topic": "meals"
  },
  {
    "de": "Hunger haben",
    "tr": "aç olmak",
    "topic": "meals"
  },
  {
    "de": "warm",
    "tr": "sıcak",
    "topic": "meals"
  },
  {
    "de": "kalt",
    "tr": "soğuk",
    "topic": "meals"
  },
  {
    "de": "früh",
    "tr": "erken",
    "topic": "meals"
  },
  {
    "de": "spät",
    "tr": "geç",
    "topic": "meals"
  },
  {
    "de": "pünktlich",
    "tr": "zamanında",
    "topic": "meals"
  },
  {
    "de": "Guten Appetit!",
    "tr": "Afiyet olsun!",
    "topic": "meals"
  },
  {
    "de": "die Milch",
    "tr": "süt",
    "topic": "meals"
  },
  {
    "de": "der Käse",
    "tr": "peynir",
    "topic": "meals"
  },
  {
    "de": "das Brötchen",
    "tr": "küçük ekmek",
    "topic": "meals"
  },
  {
    "de": "der Tee",
    "tr": "çay",
    "topic": "meals"
  },
  {
    "de": "der Saft",
    "tr": "meyve suyu",
    "topic": "meals"
  },
  {
    "de": "die Tomatensuppe",
    "tr": "domates çorbası",
    "topic": "compounds"
  },
  {
    "de": "die Fischsuppe",
    "tr": "balık çorbası",
    "topic": "compounds"
  },
  {
    "de": "die Nudelsuppe",
    "tr": "erişte çorbası",
    "topic": "compounds"
  },
  {
    "de": "der Kartoffelsalat",
    "tr": "patates salatası",
    "topic": "compounds"
  },
  {
    "de": "der Nudelsalat",
    "tr": "makarna salatası",
    "topic": "compounds"
  },
  {
    "de": "der Obstsalat",
    "tr": "meyve salatası",
    "topic": "compounds"
  },
  {
    "de": "das Käsebrot",
    "tr": "peynirli ekmek",
    "topic": "compounds"
  },
  {
    "de": "das Wurstbrot",
    "tr": "sosisli ekmek",
    "topic": "compounds"
  },
  {
    "de": "der Birnenkuchen",
    "tr": "armutlu kek",
    "topic": "compounds"
  },
  {
    "de": "der Apfelkuchen",
    "tr": "elmalı kek",
    "topic": "compounds"
  },
  {
    "de": "der Milchkaffee",
    "tr": "sütlü kahve",
    "topic": "compounds"
  },
  {
    "de": "können",
    "tr": "yapabilmek",
    "topic": "can"
  },
  {
    "de": "mitbringen",
    "tr": "yanında getirmek",
    "topic": "can"
  },
  {
    "de": "backen",
    "tr": "fırında pişirmek",
    "topic": "can"
  },
  {
    "de": "kochen",
    "tr": "yemek pişirmek",
    "topic": "can"
  },
  {
    "de": "bestellen",
    "tr": "sipariş vermek",
    "topic": "can"
  },
  {
    "de": "organisieren",
    "tr": "organize etmek",
    "topic": "can"
  },
  {
    "de": "aufräumen",
    "tr": "toparlamak",
    "topic": "can"
  },
  {
    "de": "abholen",
    "tr": "gidip almak",
    "topic": "can"
  },
  {
    "de": "die Getränke",
    "tr": "içecekler",
    "topic": "can"
  },
  {
    "de": "die Gläser",
    "tr": "bardaklar",
    "topic": "can"
  },
  {
    "de": "die Einladung",
    "tr": "davet",
    "topic": "invitations"
  },
  {
    "de": "einladen",
    "tr": "davet etmek",
    "topic": "invitations"
  },
  {
    "de": "feiern",
    "tr": "kutlamak",
    "topic": "invitations"
  },
  {
    "de": "die Hochzeit",
    "tr": "düğün",
    "topic": "invitations"
  },
  {
    "de": "die Familienfeier",
    "tr": "aile kutlaması",
    "topic": "invitations"
  },
  {
    "de": "das Jubiläum",
    "tr": "yıl dönümü",
    "topic": "invitations"
  },
  {
    "de": "das Büfett",
    "tr": "büfe / açık büfe",
    "topic": "invitations"
  },
  {
    "de": "wichtig",
    "tr": "önemli",
    "topic": "invitations"
  },
  {
    "de": "leider",
    "tr": "maalesef",
    "topic": "invitations"
  },
  {
    "de": "antworten",
    "tr": "cevap vermek",
    "topic": "invitations"
  },
  {
    "de": "tanzen",
    "tr": "dans etmek",
    "topic": "invitations"
  },
  {
    "de": "der Salat",
    "tr": "salata",
    "topic": "food-acc"
  },
  {
    "de": "die Suppe",
    "tr": "çorba",
    "topic": "food-acc"
  },
  {
    "de": "die Pizza",
    "tr": "pizza",
    "topic": "food-acc"
  },
  {
    "de": "der Fisch",
    "tr": "balık",
    "topic": "food-acc"
  },
  {
    "de": "das Hähnchen",
    "tr": "tavuk",
    "topic": "food-acc"
  },
  {
    "de": "die Nudeln",
    "tr": "makarna",
    "topic": "food-acc"
  },
  {
    "de": "das Fleisch",
    "tr": "et",
    "topic": "food-acc"
  },
  {
    "de": "das Schweinefleisch",
    "tr": "domuz eti",
    "topic": "food-acc"
  },
  {
    "de": "das Gemüse",
    "tr": "sebze",
    "topic": "food-acc"
  },
  {
    "de": "der Reis",
    "tr": "pirinç / pilav",
    "topic": "food-acc"
  },
  {
    "de": "die Kartoffeln",
    "tr": "patatesler",
    "topic": "food-acc"
  },
  {
    "de": "das Gulasch",
    "tr": "gulaş",
    "topic": "food-acc"
  },
  {
    "de": "der Joghurt",
    "tr": "yoğurt",
    "topic": "food-acc"
  },
  {
    "de": "die Zwiebeln",
    "tr": "soğanlar",
    "topic": "food-acc"
  },
  {
    "de": "nehmen",
    "tr": "almak / seçmek",
    "topic": "nehmen"
  },
  {
    "de": "probieren",
    "tr": "denemek / tadına bakmak",
    "topic": "nehmen"
  },
  {
    "de": "schmecken",
    "tr": "tadı olmak",
    "topic": "compliments"
  },
  {
    "de": "lecker",
    "tr": "lezzetli",
    "topic": "compliments"
  },
  {
    "de": "Das freut mich.",
    "tr": "Buna sevindim.",
    "topic": "compliments"
  },
  {
    "de": "Prost!",
    "tr": "Şerefe!",
    "topic": "compliments"
  },
  {
    "de": "der Koch",
    "tr": "erkek aşçı",
    "topic": "compliments"
  },
  {
    "de": "die Köchin",
    "tr": "kadın aşçı",
    "topic": "compliments"
  },
  {
    "de": "möglich",
    "tr": "mümkün",
    "topic": "ordering"
  },
  {
    "de": "gleich",
    "tr": "hemen",
    "topic": "ordering"
  },
  {
    "de": "ohne",
    "tr": "olmadan",
    "topic": "ordering"
  },
  {
    "de": "mit",
    "tr": "ile",
    "topic": "ordering"
  },
  {
    "de": "die Frage",
    "tr": "soru",
    "topic": "ordering"
  },
  {
    "de": "der Apfelsaft",
    "tr": "elma suyu",
    "topic": "ordering"
  },
  {
    "de": "der Orangensaft",
    "tr": "portakal suyu",
    "topic": "ordering"
  },
  {
    "de": "die Pommes",
    "tr": "patates kızartması",
    "topic": "ordering"
  },
  {
    "de": "der Schokoladenkuchen",
    "tr": "çikolatalı kek",
    "topic": "ordering"
  },
  {
    "de": "der Preis",
    "tr": "fiyat",
    "topic": "ordering"
  },
  {
    "de": "der Termin",
    "tr": "randevu",
    "topic": "appointments"
  },
  {
    "de": "einen Termin vereinbaren",
    "tr": "randevu ayarlamak",
    "topic": "appointments"
  },
  {
    "de": "das Bürgerbüro",
    "tr": "vatandaş hizmetleri bürosu",
    "topic": "appointments"
  },
  {
    "de": "die Bank",
    "tr": "banka",
    "topic": "appointments"
  },
  {
    "de": "die Post",
    "tr": "postane",
    "topic": "appointments"
  },
  {
    "de": "die Apotheke",
    "tr": "eczane",
    "topic": "appointments"
  },
  {
    "de": "die Agentur für Arbeit",
    "tr": "iş ajansı",
    "topic": "appointments"
  },
  {
    "de": "geöffnet",
    "tr": "açık",
    "topic": "appointments"
  },
  {
    "de": "geschlossen",
    "tr": "kapalı",
    "topic": "appointments"
  },
  {
    "de": "ein Paket abgeben",
    "tr": "paket teslim etmek",
    "topic": "appointments"
  },
  {
    "de": "Geld überweisen",
    "tr": "para havale etmek",
    "topic": "appointments"
  },
  {
    "de": "eine Wohnung anmelden",
    "tr": "adres kaydı yaptırmak",
    "topic": "appointments"
  },
  {
    "de": "die Öffnungszeiten",
    "tr": "açılış saatleri",
    "topic": "appointments"
  }
];
export const addedQuestions:Question[]=[
  {
    "id": "u8-0",
    "topic": "can",
    "kind": "choice",
    "prompt": "ich + können: doğru çekimi seç.",
    "answer": "kann",
    "options": [
      "kann",
      "kannst",
      "können",
      "könnt"
    ],
    "explanation": "ich kann. Fiil özneye göre çekilir."
  },
  {
    "id": "new-write-1",
    "topic": "can",
    "kind": "write",
    "prompt": "Eksik fiili yaz: ich ___ (können).",
    "answer": "kann",
    "explanation": "ich kann."
  },
  {
    "id": "u8-2",
    "topic": "can",
    "kind": "choice",
    "prompt": "du + können: doğru çekimi seç.",
    "answer": "kannst",
    "options": [
      "kannst",
      "kann",
      "können",
      "könnt"
    ],
    "explanation": "du kannst. Fiil özneye göre çekilir."
  },
  {
    "id": "new-write-3",
    "topic": "can",
    "kind": "write",
    "prompt": "Eksik fiili yaz: du ___ (können).",
    "answer": "kannst",
    "explanation": "du kannst."
  },
  {
    "id": "u8-4",
    "topic": "can",
    "kind": "choice",
    "prompt": "er + können: doğru çekimi seç.",
    "answer": "kann",
    "options": [
      "kann",
      "kannst",
      "können",
      "könnt"
    ],
    "explanation": "er kann. Fiil özneye göre çekilir."
  },
  {
    "id": "new-write-5",
    "topic": "can",
    "kind": "write",
    "prompt": "Eksik fiili yaz: er ___ (können).",
    "answer": "kann",
    "explanation": "er kann."
  },
  {
    "id": "u8-6",
    "topic": "can",
    "kind": "choice",
    "prompt": "wir + können: doğru çekimi seç.",
    "answer": "können",
    "options": [
      "können",
      "kann",
      "kannst",
      "könnt"
    ],
    "explanation": "wir können. Fiil özneye göre çekilir."
  },
  {
    "id": "new-write-7",
    "topic": "can",
    "kind": "write",
    "prompt": "Eksik fiili yaz: wir ___ (können).",
    "answer": "können",
    "explanation": "wir können."
  },
  {
    "id": "u8-8",
    "topic": "can",
    "kind": "choice",
    "prompt": "ihr + können: doğru çekimi seç.",
    "answer": "könnt",
    "options": [
      "könnt",
      "kann",
      "kannst",
      "können"
    ],
    "explanation": "ihr könnt. Fiil özneye göre çekilir."
  },
  {
    "id": "new-write-9",
    "topic": "can",
    "kind": "write",
    "prompt": "Eksik fiili yaz: ihr ___ (können).",
    "answer": "könnt",
    "explanation": "ihr könnt."
  },
  {
    "id": "u8-10",
    "topic": "can",
    "kind": "choice",
    "prompt": "Sie + können: doğru çekimi seç.",
    "answer": "können",
    "options": [
      "können",
      "kann",
      "kannst",
      "könnt"
    ],
    "explanation": "Sie können. Fiil özneye göre çekilir."
  },
  {
    "id": "new-write-11",
    "topic": "can",
    "kind": "write",
    "prompt": "Eksik fiili yaz: Sie ___ (können).",
    "answer": "können",
    "explanation": "Sie können."
  },
  {
    "id": "u8-12",
    "topic": "nehmen",
    "kind": "choice",
    "prompt": "ich + nehmen: doğru çekimi seç.",
    "answer": "nehme",
    "options": [
      "nehme",
      "nimmst",
      "nimmt",
      "nehmen"
    ],
    "explanation": "ich nehme. Fiil özneye göre çekilir."
  },
  {
    "id": "new-write-13",
    "topic": "nehmen",
    "kind": "write",
    "prompt": "Eksik fiili yaz: ich ___ (nehmen).",
    "answer": "nehme",
    "explanation": "ich nehme."
  },
  {
    "id": "u8-14",
    "topic": "nehmen",
    "kind": "choice",
    "prompt": "du + nehmen: doğru çekimi seç.",
    "answer": "nimmst",
    "options": [
      "nimmst",
      "nehme",
      "nimmt",
      "nehmen"
    ],
    "explanation": "du nimmst. Fiil özneye göre çekilir."
  },
  {
    "id": "new-write-15",
    "topic": "nehmen",
    "kind": "write",
    "prompt": "Eksik fiili yaz: du ___ (nehmen).",
    "answer": "nimmst",
    "explanation": "du nimmst."
  },
  {
    "id": "u8-16",
    "topic": "nehmen",
    "kind": "choice",
    "prompt": "er + nehmen: doğru çekimi seç.",
    "answer": "nimmt",
    "options": [
      "nimmt",
      "nehme",
      "nimmst",
      "nehmen"
    ],
    "explanation": "er nimmt. Fiil özneye göre çekilir."
  },
  {
    "id": "new-write-17",
    "topic": "nehmen",
    "kind": "write",
    "prompt": "Eksik fiili yaz: er ___ (nehmen).",
    "answer": "nimmt",
    "explanation": "er nimmt."
  },
  {
    "id": "u8-18",
    "topic": "nehmen",
    "kind": "choice",
    "prompt": "wir + nehmen: doğru çekimi seç.",
    "answer": "nehmen",
    "options": [
      "nehmen",
      "nehme",
      "nimmst",
      "nimmt"
    ],
    "explanation": "wir nehmen. Fiil özneye göre çekilir."
  },
  {
    "id": "new-write-19",
    "topic": "nehmen",
    "kind": "write",
    "prompt": "Eksik fiili yaz: wir ___ (nehmen).",
    "answer": "nehmen",
    "explanation": "wir nehmen."
  },
  {
    "id": "u8-20",
    "topic": "nehmen",
    "kind": "choice",
    "prompt": "ihr + nehmen: doğru çekimi seç.",
    "answer": "nehmt",
    "options": [
      "nehmt",
      "nehme",
      "nimmst",
      "nimmt"
    ],
    "explanation": "ihr nehmt. Fiil özneye göre çekilir."
  },
  {
    "id": "new-write-21",
    "topic": "nehmen",
    "kind": "write",
    "prompt": "Eksik fiili yaz: ihr ___ (nehmen).",
    "answer": "nehmt",
    "explanation": "ihr nehmt."
  },
  {
    "id": "u8-22",
    "topic": "nehmen",
    "kind": "choice",
    "prompt": "Sie + nehmen: doğru çekimi seç.",
    "answer": "nehmen",
    "options": [
      "nehmen",
      "nehme",
      "nimmst",
      "nimmt"
    ],
    "explanation": "Sie nehmen. Fiil özneye göre çekilir."
  },
  {
    "id": "new-write-23",
    "topic": "nehmen",
    "kind": "write",
    "prompt": "Eksik fiili yaz: Sie ___ (nehmen).",
    "answer": "nehmen",
    "explanation": "Sie nehmen."
  },
  {
    "id": "u8-24",
    "topic": "invitations",
    "kind": "choice",
    "prompt": "ich + feiern: doğru çekimi seç.",
    "answer": "feiere",
    "options": [
      "feiere",
      "feierst",
      "feiert",
      "feiern"
    ],
    "explanation": "ich feiere. Fiil özneye göre çekilir."
  },
  {
    "id": "new-write-25",
    "topic": "invitations",
    "kind": "write",
    "prompt": "Eksik fiili yaz: ich ___ (feiern).",
    "answer": "feiere",
    "explanation": "ich feiere."
  },
  {
    "id": "u8-26",
    "topic": "invitations",
    "kind": "choice",
    "prompt": "du + feiern: doğru çekimi seç.",
    "answer": "feierst",
    "options": [
      "feierst",
      "feiere",
      "feiert",
      "feiern"
    ],
    "explanation": "du feierst. Fiil özneye göre çekilir."
  },
  {
    "id": "new-write-27",
    "topic": "invitations",
    "kind": "write",
    "prompt": "Eksik fiili yaz: du ___ (feiern).",
    "answer": "feierst",
    "explanation": "du feierst."
  },
  {
    "id": "u8-28",
    "topic": "invitations",
    "kind": "choice",
    "prompt": "er + feiern: doğru çekimi seç.",
    "answer": "feiert",
    "options": [
      "feiert",
      "feiere",
      "feierst",
      "feiern"
    ],
    "explanation": "er feiert. Fiil özneye göre çekilir."
  },
  {
    "id": "new-write-29",
    "topic": "invitations",
    "kind": "write",
    "prompt": "Eksik fiili yaz: er ___ (feiern).",
    "answer": "feiert",
    "explanation": "er feiert."
  },
  {
    "id": "u8-30",
    "topic": "invitations",
    "kind": "choice",
    "prompt": "wir + feiern: doğru çekimi seç.",
    "answer": "feiern",
    "options": [
      "feiern",
      "feiere",
      "feierst",
      "feiert"
    ],
    "explanation": "wir feiern. Fiil özneye göre çekilir."
  },
  {
    "id": "new-write-31",
    "topic": "invitations",
    "kind": "write",
    "prompt": "Eksik fiili yaz: wir ___ (feiern).",
    "answer": "feiern",
    "explanation": "wir feiern."
  },
  {
    "id": "u8-32",
    "topic": "invitations",
    "kind": "choice",
    "prompt": "ihr + feiern: doğru çekimi seç.",
    "answer": "feiert",
    "options": [
      "feiert",
      "feiere",
      "feierst",
      "feiern"
    ],
    "explanation": "ihr feiert. Fiil özneye göre çekilir."
  },
  {
    "id": "new-write-33",
    "topic": "invitations",
    "kind": "write",
    "prompt": "Eksik fiili yaz: ihr ___ (feiern).",
    "answer": "feiert",
    "explanation": "ihr feiert."
  },
  {
    "id": "u8-34",
    "topic": "invitations",
    "kind": "choice",
    "prompt": "Sie + feiern: doğru çekimi seç.",
    "answer": "feiern",
    "options": [
      "feiern",
      "feiere",
      "feierst",
      "feiert"
    ],
    "explanation": "Sie feiern. Fiil özneye göre çekilir."
  },
  {
    "id": "new-write-35",
    "topic": "invitations",
    "kind": "write",
    "prompt": "Eksik fiili yaz: Sie ___ (feiern).",
    "answer": "feiern",
    "explanation": "Sie feiern."
  },
  {
    "id": "u8-36",
    "topic": "compounds",
    "kind": "choice",
    "prompt": "___ Tomatensuppe: hangi artikel?",
    "answer": "die",
    "options": [
      "die",
      "der",
      "das",
      "den"
    ],
    "explanation": "die Tomatensuppe. Artikel son isimden gelir."
  },
  {
    "id": "new-write-37",
    "topic": "compounds",
    "kind": "write",
    "prompt": "Tomatensuppe kelimesini artikeliyle yaz.",
    "answer": "die Tomatensuppe",
    "explanation": "Son kelimenin artikelini kullan: die Tomatensuppe."
  },
  {
    "id": "u8-38",
    "topic": "compounds",
    "kind": "choice",
    "prompt": "___ Fischsuppe: hangi artikel?",
    "answer": "die",
    "options": [
      "die",
      "der",
      "das",
      "den"
    ],
    "explanation": "die Fischsuppe. Artikel son isimden gelir."
  },
  {
    "id": "new-write-39",
    "topic": "compounds",
    "kind": "write",
    "prompt": "Fischsuppe kelimesini artikeliyle yaz.",
    "answer": "die Fischsuppe",
    "explanation": "Son kelimenin artikelini kullan: die Fischsuppe."
  },
  {
    "id": "u8-40",
    "topic": "compounds",
    "kind": "choice",
    "prompt": "___ Kartoffelsalat: hangi artikel?",
    "answer": "der",
    "options": [
      "der",
      "das",
      "die",
      "den"
    ],
    "explanation": "der Kartoffelsalat. Artikel son isimden gelir."
  },
  {
    "id": "new-write-41",
    "topic": "compounds",
    "kind": "write",
    "prompt": "Kartoffelsalat kelimesini artikeliyle yaz.",
    "answer": "der Kartoffelsalat",
    "explanation": "Son kelimenin artikelini kullan: der Kartoffelsalat."
  },
  {
    "id": "u8-42",
    "topic": "compounds",
    "kind": "choice",
    "prompt": "___ Nudelsalat: hangi artikel?",
    "answer": "der",
    "options": [
      "der",
      "das",
      "die",
      "den"
    ],
    "explanation": "der Nudelsalat. Artikel son isimden gelir."
  },
  {
    "id": "new-write-43",
    "topic": "compounds",
    "kind": "write",
    "prompt": "Nudelsalat kelimesini artikeliyle yaz.",
    "answer": "der Nudelsalat",
    "explanation": "Son kelimenin artikelini kullan: der Nudelsalat."
  },
  {
    "id": "u8-44",
    "topic": "compounds",
    "kind": "choice",
    "prompt": "___ Obstsalat: hangi artikel?",
    "answer": "der",
    "options": [
      "der",
      "das",
      "die",
      "den"
    ],
    "explanation": "der Obstsalat. Artikel son isimden gelir."
  },
  {
    "id": "new-write-45",
    "topic": "compounds",
    "kind": "write",
    "prompt": "Obstsalat kelimesini artikeliyle yaz.",
    "answer": "der Obstsalat",
    "explanation": "Son kelimenin artikelini kullan: der Obstsalat."
  },
  {
    "id": "u8-46",
    "topic": "compounds",
    "kind": "choice",
    "prompt": "___ Käsebrot: hangi artikel?",
    "answer": "das",
    "options": [
      "das",
      "der",
      "die",
      "den"
    ],
    "explanation": "das Käsebrot. Artikel son isimden gelir."
  },
  {
    "id": "new-write-47",
    "topic": "compounds",
    "kind": "write",
    "prompt": "Käsebrot kelimesini artikeliyle yaz.",
    "answer": "das Käsebrot",
    "explanation": "Son kelimenin artikelini kullan: das Käsebrot."
  },
  {
    "id": "u8-48",
    "topic": "compounds",
    "kind": "choice",
    "prompt": "___ Wurstbrot: hangi artikel?",
    "answer": "das",
    "options": [
      "das",
      "der",
      "die",
      "den"
    ],
    "explanation": "das Wurstbrot. Artikel son isimden gelir."
  },
  {
    "id": "new-write-49",
    "topic": "compounds",
    "kind": "write",
    "prompt": "Wurstbrot kelimesini artikeliyle yaz.",
    "answer": "das Wurstbrot",
    "explanation": "Son kelimenin artikelini kullan: das Wurstbrot."
  },
  {
    "id": "u8-50",
    "topic": "compounds",
    "kind": "choice",
    "prompt": "___ Birnenkuchen: hangi artikel?",
    "answer": "der",
    "options": [
      "der",
      "das",
      "die",
      "den"
    ],
    "explanation": "der Birnenkuchen. Artikel son isimden gelir."
  },
  {
    "id": "new-write-51",
    "topic": "compounds",
    "kind": "write",
    "prompt": "Birnenkuchen kelimesini artikeliyle yaz.",
    "answer": "der Birnenkuchen",
    "explanation": "Son kelimenin artikelini kullan: der Birnenkuchen."
  },
  {
    "id": "u8-52",
    "topic": "compounds",
    "kind": "choice",
    "prompt": "___ Apfelkuchen: hangi artikel?",
    "answer": "der",
    "options": [
      "der",
      "das",
      "die",
      "den"
    ],
    "explanation": "der Apfelkuchen. Artikel son isimden gelir."
  },
  {
    "id": "new-write-53",
    "topic": "compounds",
    "kind": "write",
    "prompt": "Apfelkuchen kelimesini artikeliyle yaz.",
    "answer": "der Apfelkuchen",
    "explanation": "Son kelimenin artikelini kullan: der Apfelkuchen."
  },
  {
    "id": "u8-54",
    "topic": "compounds",
    "kind": "choice",
    "prompt": "___ Milchkaffee: hangi artikel?",
    "answer": "der",
    "options": [
      "der",
      "das",
      "die",
      "den"
    ],
    "explanation": "der Milchkaffee. Artikel son isimden gelir."
  },
  {
    "id": "new-write-55",
    "topic": "compounds",
    "kind": "write",
    "prompt": "Milchkaffee kelimesini artikeliyle yaz.",
    "answer": "der Milchkaffee",
    "explanation": "Son kelimenin artikelini kullan: der Milchkaffee."
  },
  {
    "id": "u8-56",
    "topic": "food-acc",
    "kind": "choice",
    "prompt": "Ich nehme ___ Salat. (der Salat)",
    "answer": "den",
    "options": [
      "den",
      "der",
      "das",
      "die"
    ],
    "explanation": "nehmen nesnesi Akkusativ: den Salat."
  },
  {
    "id": "new-write-57",
    "topic": "food-acc",
    "kind": "write",
    "prompt": "“Salat” için cümleyi tamamla: Ich nehme ___ . Belirli artikel kullan.",
    "answer": "den Salat",
    "explanation": "Ich nehme den Salat."
  },
  {
    "id": "u8-58",
    "topic": "food-acc",
    "kind": "choice",
    "prompt": "Ich nehme ___ Fisch. (der Fisch)",
    "answer": "den",
    "options": [
      "den",
      "der",
      "das",
      "die"
    ],
    "explanation": "nehmen nesnesi Akkusativ: den Fisch."
  },
  {
    "id": "new-write-59",
    "topic": "food-acc",
    "kind": "write",
    "prompt": "“Fisch” için cümleyi tamamla: Ich nehme ___ . Belirli artikel kullan.",
    "answer": "den Fisch",
    "explanation": "Ich nehme den Fisch."
  },
  {
    "id": "u8-60",
    "topic": "food-acc",
    "kind": "choice",
    "prompt": "Ich nehme ___ Kuchen. (der Kuchen)",
    "answer": "den",
    "options": [
      "den",
      "der",
      "das",
      "die"
    ],
    "explanation": "nehmen nesnesi Akkusativ: den Kuchen."
  },
  {
    "id": "new-write-61",
    "topic": "food-acc",
    "kind": "write",
    "prompt": "“Kuchen” için cümleyi tamamla: Ich nehme ___ . Belirli artikel kullan.",
    "answer": "den Kuchen",
    "explanation": "Ich nehme den Kuchen."
  },
  {
    "id": "u8-62",
    "topic": "food-acc",
    "kind": "choice",
    "prompt": "Ich nehme ___ Hähnchen. (das Hähnchen)",
    "answer": "das",
    "options": [
      "das",
      "der",
      "den",
      "die"
    ],
    "explanation": "nehmen nesnesi Akkusativ: das Hähnchen."
  },
  {
    "id": "new-write-63",
    "topic": "food-acc",
    "kind": "write",
    "prompt": "“Hähnchen” için cümleyi tamamla: Ich nehme ___ . Belirli artikel kullan.",
    "answer": "das Hähnchen",
    "explanation": "Ich nehme das Hähnchen."
  },
  {
    "id": "u8-64",
    "topic": "food-acc",
    "kind": "choice",
    "prompt": "Ich nehme ___ Gulasch. (das Gulasch)",
    "answer": "das",
    "options": [
      "das",
      "der",
      "den",
      "die"
    ],
    "explanation": "nehmen nesnesi Akkusativ: das Gulasch."
  },
  {
    "id": "new-write-65",
    "topic": "food-acc",
    "kind": "write",
    "prompt": "“Gulasch” için cümleyi tamamla: Ich nehme ___ . Belirli artikel kullan.",
    "answer": "das Gulasch",
    "explanation": "Ich nehme das Gulasch."
  },
  {
    "id": "u8-66",
    "topic": "food-acc",
    "kind": "choice",
    "prompt": "Ich nehme ___ Suppe. (die Suppe)",
    "answer": "die",
    "options": [
      "die",
      "der",
      "den",
      "das"
    ],
    "explanation": "nehmen nesnesi Akkusativ: die Suppe."
  },
  {
    "id": "new-write-67",
    "topic": "food-acc",
    "kind": "write",
    "prompt": "“Suppe” için cümleyi tamamla: Ich nehme ___ . Belirli artikel kullan.",
    "answer": "die Suppe",
    "explanation": "Ich nehme die Suppe."
  },
  {
    "id": "u8-68",
    "topic": "food-acc",
    "kind": "choice",
    "prompt": "Ich nehme ___ Pizza. (die Pizza)",
    "answer": "die",
    "options": [
      "die",
      "der",
      "den",
      "das"
    ],
    "explanation": "nehmen nesnesi Akkusativ: die Pizza."
  },
  {
    "id": "new-write-69",
    "topic": "food-acc",
    "kind": "write",
    "prompt": "“Pizza” için cümleyi tamamla: Ich nehme ___ . Belirli artikel kullan.",
    "answer": "die Pizza",
    "explanation": "Ich nehme die Pizza."
  },
  {
    "id": "u8-70",
    "topic": "food-acc",
    "kind": "choice",
    "prompt": "Ich nehme ___ Nudeln. (die Nudeln)",
    "answer": "die",
    "options": [
      "die",
      "der",
      "den",
      "das"
    ],
    "explanation": "nehmen nesnesi Akkusativ: die Nudeln."
  },
  {
    "id": "new-write-71",
    "topic": "food-acc",
    "kind": "write",
    "prompt": "“Nudeln” için cümleyi tamamla: Ich nehme ___ . Belirli artikel kullan.",
    "answer": "die Nudeln",
    "explanation": "Ich nehme die Nudeln."
  },
  {
    "id": "new-write-72",
    "topic": "meals",
    "kind": "write",
    "prompt": "“Saat sekizde kahvaltı yapıyorum.” Almanca yaz.",
    "answer": "Ich frühstücke um acht Uhr.",
    "explanation": "Örnek doğru cümle: Ich frühstücke um acht Uhr."
  },
  {
    "id": "new-write-73",
    "topic": "meals",
    "kind": "write",
    "prompt": "Dinlediğin cümleyi yaz.",
    "answer": "Ich frühstücke um acht Uhr.",
    "explanation": "Dikte: Ich frühstücke um acht Uhr.",
    "audio": "Ich frühstücke um acht Uhr."
  },
  {
    "id": "new-write-74",
    "topic": "meals",
    "kind": "write",
    "prompt": "“Akşam peynirli ekmek yiyorum.” Almanca yaz.",
    "answer": "Ich esse zu Abend Käsebrot.",
    "explanation": "Örnek doğru cümle: Ich esse zu Abend Käsebrot."
  },
  {
    "id": "new-write-75",
    "topic": "meals",
    "kind": "write",
    "prompt": "Dinlediğin cümleyi yaz.",
    "answer": "Ich esse zu Abend Käsebrot.",
    "explanation": "Dikte: Ich esse zu Abend Käsebrot.",
    "audio": "Ich esse zu Abend Käsebrot."
  },
  {
    "id": "new-write-76",
    "topic": "can",
    "kind": "write",
    "prompt": "“Bir salata getirebilirim.” Almanca yaz.",
    "answer": "Ich kann einen Salat mitbringen.",
    "explanation": "Örnek doğru cümle: Ich kann einen Salat mitbringen."
  },
  {
    "id": "new-write-77",
    "topic": "can",
    "kind": "write",
    "prompt": "Dinlediğin cümleyi yaz.",
    "answer": "Ich kann einen Salat mitbringen.",
    "explanation": "Dikte: Ich kann einen Salat mitbringen.",
    "audio": "Ich kann einen Salat mitbringen."
  },
  {
    "id": "new-write-78",
    "topic": "can",
    "kind": "write",
    "prompt": "“Pazar günü gelemem.” Almanca yaz.",
    "answer": "Ich kann am Sonntag nicht kommen.",
    "explanation": "Örnek doğru cümle: Ich kann am Sonntag nicht kommen."
  },
  {
    "id": "new-write-79",
    "topic": "can",
    "kind": "write",
    "prompt": "Dinlediğin cümleyi yaz.",
    "answer": "Ich kann am Sonntag nicht kommen.",
    "explanation": "Dikte: Ich kann am Sonntag nicht kommen.",
    "audio": "Ich kann am Sonntag nicht kommen."
  },
  {
    "id": "new-write-80",
    "topic": "can",
    "kind": "write",
    "prompt": "“İçecekleri sipariş edebiliriz.” Almanca yaz.",
    "answer": "Wir können die Getränke bestellen.",
    "explanation": "Örnek doğru cümle: Wir können die Getränke bestellen."
  },
  {
    "id": "new-write-81",
    "topic": "can",
    "kind": "write",
    "prompt": "Dinlediğin cümleyi yaz.",
    "answer": "Wir können die Getränke bestellen.",
    "explanation": "Dikte: Wir können die Getränke bestellen.",
    "audio": "Wir können die Getränke bestellen."
  },
  {
    "id": "new-write-82",
    "topic": "can",
    "kind": "write",
    "prompt": "“Çorba yapabilir misin?” Almanca yaz.",
    "answer": "Kannst du eine Suppe kochen?",
    "explanation": "Örnek doğru cümle: Kannst du eine Suppe kochen?"
  },
  {
    "id": "new-write-83",
    "topic": "can",
    "kind": "write",
    "prompt": "Dinlediğin cümleyi yaz.",
    "answer": "Kannst du eine Suppe kochen?",
    "explanation": "Dikte: Kannst du eine Suppe kochen?",
    "audio": "Kannst du eine Suppe kochen?"
  },
  {
    "id": "new-write-84",
    "topic": "invitations",
    "kind": "write",
    "prompt": "“Pazar günü saat 17’de kutlama yapıyoruz.” Almanca yaz.",
    "answer": "Wir feiern am Sonntag um 17 Uhr.",
    "explanation": "Örnek doğru cümle: Wir feiern am Sonntag um 17 Uhr."
  },
  {
    "id": "new-write-85",
    "topic": "invitations",
    "kind": "write",
    "prompt": "Dinlediğin cümleyi yaz.",
    "answer": "Wir feiern am Sonntag um 17 Uhr.",
    "explanation": "Dikte: Wir feiern am Sonntag um 17 Uhr.",
    "audio": "Wir feiern am Sonntag um 17 Uhr."
  },
  {
    "id": "new-write-86",
    "topic": "invitations",
    "kind": "write",
    "prompt": "“Davet için teşekkürler.” Almanca yaz.",
    "answer": "Vielen Dank für die Einladung.",
    "explanation": "Örnek doğru cümle: Vielen Dank für die Einladung."
  },
  {
    "id": "new-write-87",
    "topic": "invitations",
    "kind": "write",
    "prompt": "Dinlediğin cümleyi yaz.",
    "answer": "Vielen Dank für die Einladung.",
    "explanation": "Dikte: Vielen Dank für die Einladung.",
    "audio": "Vielen Dank für die Einladung."
  },
  {
    "id": "new-write-88",
    "topic": "invitations",
    "kind": "write",
    "prompt": "“Benim için müzik önemli.” Almanca yaz.",
    "answer": "Für mich ist Musik wichtig.",
    "explanation": "Örnek doğru cümle: Für mich ist Musik wichtig."
  },
  {
    "id": "new-write-89",
    "topic": "invitations",
    "kind": "write",
    "prompt": "Dinlediğin cümleyi yaz.",
    "answer": "Für mich ist Musik wichtig.",
    "explanation": "Dikte: Für mich ist Musik wichtig.",
    "audio": "Für mich ist Musik wichtig."
  },
  {
    "id": "new-write-90",
    "topic": "invitations",
    "kind": "write",
    "prompt": "“Seni davet ediyorum.” Almanca yaz.",
    "answer": "Ich lade dich ein.",
    "explanation": "Örnek doğru cümle: Ich lade dich ein."
  },
  {
    "id": "new-write-91",
    "topic": "invitations",
    "kind": "write",
    "prompt": "Dinlediğin cümleyi yaz.",
    "answer": "Ich lade dich ein.",
    "explanation": "Dikte: Ich lade dich ein.",
    "audio": "Ich lade dich ein."
  },
  {
    "id": "new-write-92",
    "topic": "food-acc",
    "kind": "write",
    "prompt": "“Et yemiyorum.” Almanca yaz.",
    "answer": "Ich esse kein Fleisch.",
    "explanation": "Örnek doğru cümle: Ich esse kein Fleisch."
  },
  {
    "id": "new-write-93",
    "topic": "food-acc",
    "kind": "write",
    "prompt": "Dinlediğin cümleyi yaz.",
    "answer": "Ich esse kein Fleisch.",
    "explanation": "Dikte: Ich esse kein Fleisch.",
    "audio": "Ich esse kein Fleisch."
  },
  {
    "id": "new-write-94",
    "topic": "food-acc",
    "kind": "write",
    "prompt": "“Bir pizza istiyorum.” Almanca yaz.",
    "answer": "Ich möchte eine Pizza.",
    "explanation": "Örnek doğru cümle: Ich möchte eine Pizza."
  },
  {
    "id": "new-write-95",
    "topic": "food-acc",
    "kind": "write",
    "prompt": "Dinlediğin cümleyi yaz.",
    "answer": "Ich möchte eine Pizza.",
    "explanation": "Dikte: Ich möchte eine Pizza.",
    "audio": "Ich möchte eine Pizza."
  },
  {
    "id": "new-write-96",
    "topic": "nehmen",
    "kind": "write",
    "prompt": "“Sen balığı alıyorsun.” Almanca yaz.",
    "answer": "Du nimmst den Fisch.",
    "explanation": "Örnek doğru cümle: Du nimmst den Fisch."
  },
  {
    "id": "new-write-97",
    "topic": "nehmen",
    "kind": "write",
    "prompt": "Dinlediğin cümleyi yaz.",
    "answer": "Du nimmst den Fisch.",
    "explanation": "Dikte: Du nimmst den Fisch.",
    "audio": "Du nimmst den Fisch."
  },
  {
    "id": "new-write-98",
    "topic": "compliments",
    "kind": "write",
    "prompt": "“Çok iyi yemek yapıyorsun.” Almanca yaz.",
    "answer": "Du kochst sehr gut.",
    "explanation": "Örnek doğru cümle: Du kochst sehr gut."
  },
  {
    "id": "new-write-99",
    "topic": "compliments",
    "kind": "write",
    "prompt": "Dinlediğin cümleyi yaz.",
    "answer": "Du kochst sehr gut.",
    "explanation": "Dikte: Du kochst sehr gut.",
    "audio": "Du kochst sehr gut."
  },
  {
    "id": "new-write-100",
    "topic": "compliments",
    "kind": "write",
    "prompt": "“Teşekkürler, buna sevindim.” Almanca yaz.",
    "answer": "Danke, das freut mich.",
    "explanation": "Örnek doğru cümle: Danke, das freut mich."
  },
  {
    "id": "new-write-101",
    "topic": "compliments",
    "kind": "write",
    "prompt": "Dinlediğin cümleyi yaz.",
    "answer": "Danke, das freut mich.",
    "explanation": "Dikte: Danke, das freut mich.",
    "audio": "Danke, das freut mich."
  },
  {
    "id": "new-write-102",
    "topic": "compliments",
    "kind": "write",
    "prompt": "“Çorba çok lezzetli.” Almanca yaz.",
    "answer": "Die Suppe ist sehr lecker.",
    "explanation": "Örnek doğru cümle: Die Suppe ist sehr lecker."
  },
  {
    "id": "new-write-103",
    "topic": "compliments",
    "kind": "write",
    "prompt": "Dinlediğin cümleyi yaz.",
    "answer": "Die Suppe ist sehr lecker.",
    "explanation": "Dikte: Die Suppe ist sehr lecker.",
    "audio": "Die Suppe ist sehr lecker."
  },
  {
    "id": "new-write-104",
    "topic": "ordering",
    "kind": "write",
    "prompt": "“Domatessiz salata yapabilir misiniz?” Almanca yaz.",
    "answer": "Können Sie Salat ohne Tomaten machen?",
    "explanation": "Örnek doğru cümle: Können Sie Salat ohne Tomaten machen?"
  },
  {
    "id": "new-write-105",
    "topic": "ordering",
    "kind": "write",
    "prompt": "Dinlediğin cümleyi yaz.",
    "answer": "Können Sie Salat ohne Tomaten machen?",
    "explanation": "Dikte: Können Sie Salat ohne Tomaten machen?",
    "audio": "Können Sie Salat ohne Tomaten machen?"
  },
  {
    "id": "new-write-106",
    "topic": "ordering",
    "kind": "write",
    "prompt": "“Meyve suyunuz da var mı?” Almanca yaz.",
    "answer": "Haben Sie auch Saft?",
    "explanation": "Örnek doğru cümle: Haben Sie auch Saft?"
  },
  {
    "id": "new-write-107",
    "topic": "ordering",
    "kind": "write",
    "prompt": "Dinlediğin cümleyi yaz.",
    "answer": "Haben Sie auch Saft?",
    "explanation": "Dikte: Haben Sie auch Saft?",
    "audio": "Haben Sie auch Saft?"
  },
  {
    "id": "new-write-108",
    "topic": "ordering",
    "kind": "write",
    "prompt": "“Sipariş vermek istiyorum.” Almanca yaz.",
    "answer": "Ich möchte bestellen.",
    "explanation": "Örnek doğru cümle: Ich möchte bestellen."
  },
  {
    "id": "new-write-109",
    "topic": "ordering",
    "kind": "write",
    "prompt": "Dinlediğin cümleyi yaz.",
    "answer": "Ich möchte bestellen.",
    "explanation": "Dikte: Ich möchte bestellen.",
    "audio": "Ich möchte bestellen."
  },
  {
    "id": "new-write-110",
    "topic": "appointments",
    "kind": "write",
    "prompt": "“Paket teslim etmek istiyorum.” Almanca yaz.",
    "answer": "Ich möchte ein Paket abgeben.",
    "explanation": "Örnek doğru cümle: Ich möchte ein Paket abgeben."
  },
  {
    "id": "new-write-111",
    "topic": "appointments",
    "kind": "write",
    "prompt": "Dinlediğin cümleyi yaz.",
    "answer": "Ich möchte ein Paket abgeben.",
    "explanation": "Dikte: Ich möchte ein Paket abgeben.",
    "audio": "Ich möchte ein Paket abgeben."
  },
  {
    "id": "new-write-112",
    "topic": "appointments",
    "kind": "write",
    "prompt": "“Randevu ayarlamak istiyorum.” Almanca yaz.",
    "answer": "Ich möchte einen Termin vereinbaren.",
    "explanation": "Örnek doğru cümle: Ich möchte einen Termin vereinbaren."
  },
  {
    "id": "new-write-113",
    "topic": "appointments",
    "kind": "write",
    "prompt": "Dinlediğin cümleyi yaz.",
    "answer": "Ich möchte einen Termin vereinbaren.",
    "explanation": "Dikte: Ich möchte einen Termin vereinbaren.",
    "audio": "Ich möchte einen Termin vereinbaren."
  },
  {
    "id": "new-write-114",
    "topic": "appointments",
    "kind": "write",
    "prompt": "“Postane ne zaman açık?” Almanca yaz.",
    "answer": "Wann hat die Post geöffnet?",
    "explanation": "Örnek doğru cümle: Wann hat die Post geöffnet?"
  },
  {
    "id": "new-write-115",
    "topic": "appointments",
    "kind": "write",
    "prompt": "Dinlediğin cümleyi yaz.",
    "answer": "Wann hat die Post geöffnet?",
    "explanation": "Dikte: Wann hat die Post geöffnet?",
    "audio": "Wann hat die Post geöffnet?"
  },
  {
    "id": "new-write-116",
    "topic": "appointments",
    "kind": "write",
    "prompt": "“Pazar günü postane kapalı.” Almanca yaz.",
    "answer": "Am Sonntag ist die Post geschlossen.",
    "explanation": "Örnek doğru cümle: Am Sonntag ist die Post geschlossen."
  },
  {
    "id": "new-write-117",
    "topic": "appointments",
    "kind": "write",
    "prompt": "Dinlediğin cümleyi yaz.",
    "answer": "Am Sonntag ist die Post geschlossen.",
    "explanation": "Dikte: Am Sonntag ist die Post geschlossen.",
    "audio": "Am Sonntag ist die Post geschlossen."
  },
  {
    "id": "u8-118",
    "topic": "can",
    "kind": "choice",
    "prompt": "Doğru cümle sırasını seç.",
    "answer": "Ich kann einen Salat mitbringen.",
    "options": [
      "Ich kann einen Salat mitbringen.",
      "Ich kann mitbringe einen Salat.",
      "Ich einen Salat kann mitbringen.",
      "Ich können einen Salat mitbringen."
    ],
    "explanation": "Çekimli fiilin ve mastarın yerini kontrol et: Ich kann einen Salat mitbringen."
  },
  {
    "id": "u8-119",
    "topic": "can",
    "kind": "choice",
    "prompt": "Doğru cümle sırasını seç.",
    "answer": "Kannst du Musik mitbringen?",
    "options": [
      "Kannst du Musik mitbringen?",
      "Du kannst mitbringst Musik?",
      "Kann du Musik mitbringen?",
      "Kannst du mitbringst Musik?"
    ],
    "explanation": "Çekimli fiilin ve mastarın yerini kontrol et: Kannst du Musik mitbringen?"
  },
  {
    "id": "u8-120",
    "topic": "invitations",
    "kind": "choice",
    "prompt": "Doğru cümle sırasını seç.",
    "answer": "Ich lade dich ein.",
    "options": [
      "Ich lade dich ein.",
      "Ich einlade dich.",
      "Ich lädt dich ein.",
      "Ich dich lade ein."
    ],
    "explanation": "Çekimli fiilin ve mastarın yerini kontrol et: Ich lade dich ein."
  },
  {
    "id": "u9-121",
    "topic": "appointments",
    "kind": "choice",
    "prompt": "Doğru cümle sırasını seç.",
    "answer": "Ich möchte heute Geld überweisen.",
    "options": [
      "Ich möchte heute Geld überweisen.",
      "Ich heute möchte überweise Geld.",
      "Ich möchte überweise heute Geld.",
      "Ich möchten heute Geld überweisen."
    ],
    "explanation": "Çekimli fiilin ve mastarın yerini kontrol et: Ich möchte heute Geld überweisen."
  },
  {
    "id": "u8-122",
    "topic": "food-acc",
    "kind": "choice",
    "prompt": "Ich esse ___ Fisch.",
    "answer": "keinen",
    "options": [
      "keinen",
      "kein",
      "keine",
      "nicht"
    ],
    "explanation": "der Fisch → Akkusativ keinen Fisch."
  },
  {
    "id": "u8-123",
    "topic": "food-acc",
    "kind": "choice",
    "prompt": "Ich möchte ___ Pizza.",
    "answer": "eine",
    "options": [
      "eine",
      "ein",
      "einen",
      "einem"
    ],
    "explanation": "die Pizza → Akkusativ eine Pizza."
  },
  {
    "id": "u8-124",
    "topic": "food-acc",
    "kind": "choice",
    "prompt": "Ich nehme ___ Salat.",
    "answer": "einen",
    "options": [
      "einen",
      "ein",
      "eine",
      "einem"
    ],
    "explanation": "der Salat → Akkusativ einen Salat."
  },
  {
    "id": "u8-125",
    "topic": "food-acc",
    "kind": "choice",
    "prompt": "___ Salat schmeckt gut.",
    "answer": "Der",
    "options": [
      "Der",
      "Den",
      "Dem",
      "Die"
    ],
    "explanation": "Salat burada özne olduğu için der kullanılır."
  },
  {
    "id": "u8-126",
    "topic": "compliments",
    "kind": "choice",
    "prompt": "İltifata cevap hangisi?",
    "answer": "Danke, das freut mich.",
    "options": [
      "Danke, das freut mich.",
      "Du kochst sehr gut.",
      "Die Suppe ist lecker.",
      "Das sieht lecker aus."
    ],
    "explanation": "Danke, das freut mich. bir teşekkür cevabıdır."
  },
  {
    "id": "u8-127",
    "topic": "compliments",
    "kind": "choice",
    "prompt": "Yemeğin tadını öven cümle hangisi?",
    "answer": "Das schmeckt super!",
    "options": [
      "Das schmeckt super!",
      "Wann hat die Post geöffnet?",
      "Ich kann nicht kommen.",
      "Das ist geschlossen."
    ],
    "explanation": "schmecken tat için kullanılır."
  },
  {
    "id": "u8-128",
    "topic": "compliments",
    "kind": "choice",
    "prompt": "Salatanın yapılışını nasıl sorarsın?",
    "answer": "Wie machst du den Salat?",
    "options": [
      "Wie machst du den Salat?",
      "Wann isst du?",
      "Woher kommst du?",
      "Wie heißt du?"
    ],
    "explanation": "Wie machst du …? = … nasıl yapıyorsun?"
  },
  {
    "id": "u8-129",
    "topic": "meals",
    "kind": "read",
    "prompt": "Lara kaçta kahvaltı yapıyor?",
    "answer": "Um sieben Uhr.",
    "options": [
      "Um sieben Uhr.",
      "Um acht Uhr.",
      "Um dreizehn Uhr.",
      "Um achtzehn Uhr."
    ],
    "explanation": "Metinde um sieben Uhr yazıyor.",
    "passage": "Ich heiße Lara. Ich frühstücke um sieben Uhr. Ich esse ein Brötchen und trinke Tee. Um dreizehn Uhr esse ich Fisch mit Reis. Am Abend esse ich Käsebrot."
  },
  {
    "id": "u8-130",
    "topic": "meals",
    "kind": "listen",
    "prompt": "Lara kaçta kahvaltı yapıyor?",
    "answer": "Um sieben Uhr.",
    "options": [
      "Um sieben Uhr.",
      "Um acht Uhr.",
      "Um dreizehn Uhr.",
      "Um achtzehn Uhr."
    ],
    "explanation": "Metinde um sieben Uhr yazıyor.",
    "audio": "Ich heiße Lara. Ich frühstücke um sieben Uhr. Ich esse ein Brötchen und trinke Tee. Um dreizehn Uhr esse ich Fisch mit Reis. Am Abend esse ich Käsebrot."
  },
  {
    "id": "u8-131",
    "topic": "meals",
    "kind": "read",
    "prompt": "Öğlen ne yiyor?",
    "answer": "Fisch mit Reis",
    "options": [
      "Fisch mit Reis",
      "Tomatensuppe",
      "Käsebrot",
      "Obstsalat"
    ],
    "explanation": "Öğlen pilavlı balık yiyor.",
    "passage": "Ich heiße Lara. Ich frühstücke um sieben Uhr. Ich esse ein Brötchen und trinke Tee. Um dreizehn Uhr esse ich Fisch mit Reis. Am Abend esse ich Käsebrot."
  },
  {
    "id": "u8-132",
    "topic": "meals",
    "kind": "listen",
    "prompt": "Öğlen ne yiyor?",
    "answer": "Fisch mit Reis",
    "options": [
      "Fisch mit Reis",
      "Tomatensuppe",
      "Käsebrot",
      "Obstsalat"
    ],
    "explanation": "Öğlen pilavlı balık yiyor.",
    "audio": "Ich heiße Lara. Ich frühstücke um sieben Uhr. Ich esse ein Brötchen und trinke Tee. Um dreizehn Uhr esse ich Fisch mit Reis. Am Abend esse ich Käsebrot."
  },
  {
    "id": "u8-133",
    "topic": "meals",
    "kind": "read",
    "prompt": "Kahvaltıda ne içiyor?",
    "answer": "Tee",
    "options": [
      "Tee",
      "Milch",
      "Saft",
      "Kaffee"
    ],
    "explanation": "trinke Tee = çay içiyorum.",
    "passage": "Ich heiße Lara. Ich frühstücke um sieben Uhr. Ich esse ein Brötchen und trinke Tee. Um dreizehn Uhr esse ich Fisch mit Reis. Am Abend esse ich Käsebrot."
  },
  {
    "id": "u8-134",
    "topic": "meals",
    "kind": "listen",
    "prompt": "Kahvaltıda ne içiyor?",
    "answer": "Tee",
    "options": [
      "Tee",
      "Milch",
      "Saft",
      "Kaffee"
    ],
    "explanation": "trinke Tee = çay içiyorum.",
    "audio": "Ich heiße Lara. Ich frühstücke um sieben Uhr. Ich esse ein Brötchen und trinke Tee. Um dreizehn Uhr esse ich Fisch mit Reis. Am Abend esse ich Käsebrot."
  },
  {
    "id": "u8-135",
    "topic": "compounds",
    "kind": "read",
    "prompt": "Hangi yemek sıcak?",
    "answer": "Die Tomatensuppe",
    "options": [
      "Die Tomatensuppe",
      "Der Kartoffelsalat",
      "Der Apfelkuchen",
      "Das Käsebrot"
    ],
    "explanation": "Suppe = çorba; metinde sıcak olduğu söyleniyor.",
    "passage": "Heute gibt es Tomatensuppe, Kartoffelsalat und Apfelkuchen. Die Suppe ist warm. Der Salat ist kalt. Der Kuchen ist sehr lecker."
  },
  {
    "id": "u8-136",
    "topic": "compounds",
    "kind": "listen",
    "prompt": "Hangi yemek sıcak?",
    "answer": "Die Tomatensuppe",
    "options": [
      "Die Tomatensuppe",
      "Der Kartoffelsalat",
      "Der Apfelkuchen",
      "Das Käsebrot"
    ],
    "explanation": "Suppe = çorba; metinde sıcak olduğu söyleniyor.",
    "audio": "Heute gibt es Tomatensuppe, Kartoffelsalat und Apfelkuchen. Die Suppe ist warm. Der Salat ist kalt. Der Kuchen ist sehr lecker."
  },
  {
    "id": "u8-137",
    "topic": "compounds",
    "kind": "read",
    "prompt": "Hangi kek var?",
    "answer": "Apfelkuchen",
    "options": [
      "Apfelkuchen",
      "Birnenkuchen",
      "Schokoladenkuchen",
      "Obstsalat"
    ],
    "explanation": "Metinde elmalı kek var.",
    "passage": "Heute gibt es Tomatensuppe, Kartoffelsalat und Apfelkuchen. Die Suppe ist warm. Der Salat ist kalt. Der Kuchen ist sehr lecker."
  },
  {
    "id": "u8-138",
    "topic": "compounds",
    "kind": "listen",
    "prompt": "Hangi kek var?",
    "answer": "Apfelkuchen",
    "options": [
      "Apfelkuchen",
      "Birnenkuchen",
      "Schokoladenkuchen",
      "Obstsalat"
    ],
    "explanation": "Metinde elmalı kek var.",
    "audio": "Heute gibt es Tomatensuppe, Kartoffelsalat und Apfelkuchen. Die Suppe ist warm. Der Salat ist kalt. Der Kuchen ist sehr lecker."
  },
  {
    "id": "u8-139",
    "topic": "can",
    "kind": "read",
    "prompt": "Çorbayı kim yapabilir?",
    "answer": "Emre",
    "options": [
      "Emre",
      "Anna",
      "Koray",
      "Niemand"
    ],
    "explanation": "Emre kann eine Suppe kochen.",
    "passage": "Wir machen eine Party. Emre kann eine Suppe kochen. Anna kann einen Kuchen backen. Koray kann Getränke mitbringen. Alle können den Kursraum aufräumen."
  },
  {
    "id": "u8-140",
    "topic": "can",
    "kind": "listen",
    "prompt": "Çorbayı kim yapabilir?",
    "answer": "Emre",
    "options": [
      "Emre",
      "Anna",
      "Koray",
      "Niemand"
    ],
    "explanation": "Emre kann eine Suppe kochen.",
    "audio": "Wir machen eine Party. Emre kann eine Suppe kochen. Anna kann einen Kuchen backen. Koray kann Getränke mitbringen. Alle können den Kursraum aufräumen."
  },
  {
    "id": "u8-141",
    "topic": "can",
    "kind": "read",
    "prompt": "Koray ne getirebilir?",
    "answer": "Getränke",
    "options": [
      "Getränke",
      "Einen Kuchen",
      "Eine Suppe",
      "Musik"
    ],
    "explanation": "Koray kann Getränke mitbringen.",
    "passage": "Wir machen eine Party. Emre kann eine Suppe kochen. Anna kann einen Kuchen backen. Koray kann Getränke mitbringen. Alle können den Kursraum aufräumen."
  },
  {
    "id": "u8-142",
    "topic": "can",
    "kind": "listen",
    "prompt": "Koray ne getirebilir?",
    "answer": "Getränke",
    "options": [
      "Getränke",
      "Einen Kuchen",
      "Eine Suppe",
      "Musik"
    ],
    "explanation": "Koray kann Getränke mitbringen.",
    "audio": "Wir machen eine Party. Emre kann eine Suppe kochen. Anna kann einen Kuchen backen. Koray kann Getränke mitbringen. Alle können den Kursraum aufräumen."
  },
  {
    "id": "u8-143",
    "topic": "can",
    "kind": "read",
    "prompt": "Herkes hangi işi yapabilir?",
    "answer": "Den Kursraum aufräumen",
    "options": [
      "Den Kursraum aufräumen",
      "Einen Kuchen backen",
      "Eine Suppe kochen",
      "Getränke bestellen"
    ],
    "explanation": "Alle können den Kursraum aufräumen.",
    "passage": "Wir machen eine Party. Emre kann eine Suppe kochen. Anna kann einen Kuchen backen. Koray kann Getränke mitbringen. Alle können den Kursraum aufräumen."
  },
  {
    "id": "u8-144",
    "topic": "can",
    "kind": "listen",
    "prompt": "Herkes hangi işi yapabilir?",
    "answer": "Den Kursraum aufräumen",
    "options": [
      "Den Kursraum aufräumen",
      "Einen Kuchen backen",
      "Eine Suppe kochen",
      "Getränke bestellen"
    ],
    "explanation": "Alle können den Kursraum aufräumen.",
    "audio": "Wir machen eine Party. Emre kann eine Suppe kochen. Anna kann einen Kuchen backen. Koray kann Getränke mitbringen. Alle können den Kursraum aufräumen."
  },
  {
    "id": "u8-145",
    "topic": "invitations",
    "kind": "read",
    "prompt": "Parti hangi gün?",
    "answer": "Am Samstag",
    "options": [
      "Am Samstag",
      "Am Sonntag",
      "Am Freitag",
      "Am Donnerstag"
    ],
    "explanation": "Kutlama cumartesi; perşembe cevap için son gün.",
    "passage": "Hallo Anna! Wir feiern am Samstag um achtzehn Uhr im Kursraum. Wir organisieren Getränke und Musik. Kannst du einen Salat mitbringen? Bitte antworte bis Donnerstag. Viele Grüße, Koray."
  },
  {
    "id": "u8-146",
    "topic": "invitations",
    "kind": "listen",
    "prompt": "Parti hangi gün?",
    "answer": "Am Samstag",
    "options": [
      "Am Samstag",
      "Am Sonntag",
      "Am Freitag",
      "Am Donnerstag"
    ],
    "explanation": "Kutlama cumartesi; perşembe cevap için son gün.",
    "audio": "Hallo Anna! Wir feiern am Samstag um achtzehn Uhr im Kursraum. Wir organisieren Getränke und Musik. Kannst du einen Salat mitbringen? Bitte antworte bis Donnerstag. Viele Grüße, Koray."
  },
  {
    "id": "u8-147",
    "topic": "invitations",
    "kind": "read",
    "prompt": "Saat kaçta?",
    "answer": "Um 18 Uhr",
    "options": [
      "Um 18 Uhr",
      "Um 17 Uhr",
      "Um 12 Uhr",
      "Um 20 Uhr"
    ],
    "explanation": "achtzehn Uhr = 18:00.",
    "passage": "Hallo Anna! Wir feiern am Samstag um achtzehn Uhr im Kursraum. Wir organisieren Getränke und Musik. Kannst du einen Salat mitbringen? Bitte antworte bis Donnerstag. Viele Grüße, Koray."
  },
  {
    "id": "u8-148",
    "topic": "invitations",
    "kind": "listen",
    "prompt": "Saat kaçta?",
    "answer": "Um 18 Uhr",
    "options": [
      "Um 18 Uhr",
      "Um 17 Uhr",
      "Um 12 Uhr",
      "Um 20 Uhr"
    ],
    "explanation": "achtzehn Uhr = 18:00.",
    "audio": "Hallo Anna! Wir feiern am Samstag um achtzehn Uhr im Kursraum. Wir organisieren Getränke und Musik. Kannst du einen Salat mitbringen? Bitte antworte bis Donnerstag. Viele Grüße, Koray."
  },
  {
    "id": "u8-149",
    "topic": "invitations",
    "kind": "read",
    "prompt": "Cevap için son gün hangisi?",
    "answer": "Donnerstag",
    "options": [
      "Donnerstag",
      "Samstag",
      "Sonntag",
      "Montag"
    ],
    "explanation": "bis Donnerstag = perşembeye kadar.",
    "passage": "Hallo Anna! Wir feiern am Samstag um achtzehn Uhr im Kursraum. Wir organisieren Getränke und Musik. Kannst du einen Salat mitbringen? Bitte antworte bis Donnerstag. Viele Grüße, Koray."
  },
  {
    "id": "u8-150",
    "topic": "invitations",
    "kind": "listen",
    "prompt": "Cevap için son gün hangisi?",
    "answer": "Donnerstag",
    "options": [
      "Donnerstag",
      "Samstag",
      "Sonntag",
      "Montag"
    ],
    "explanation": "bis Donnerstag = perşembeye kadar.",
    "audio": "Hallo Anna! Wir feiern am Samstag um achtzehn Uhr im Kursraum. Wir organisieren Getränke und Musik. Kannst du einen Salat mitbringen? Bitte antworte bis Donnerstag. Viele Grüße, Koray."
  },
  {
    "id": "u8-151",
    "topic": "invitations",
    "kind": "read",
    "prompt": "Anna’dan ne isteniyor?",
    "answer": "Einen Salat mitbringen",
    "options": [
      "Einen Salat mitbringen",
      "Musik organisieren",
      "Getränke bestellen",
      "Einen Kuchen backen"
    ],
    "explanation": "Kannst du einen Salat mitbringen?",
    "passage": "Hallo Anna! Wir feiern am Samstag um achtzehn Uhr im Kursraum. Wir organisieren Getränke und Musik. Kannst du einen Salat mitbringen? Bitte antworte bis Donnerstag. Viele Grüße, Koray."
  },
  {
    "id": "u8-152",
    "topic": "invitations",
    "kind": "listen",
    "prompt": "Anna’dan ne isteniyor?",
    "answer": "Einen Salat mitbringen",
    "options": [
      "Einen Salat mitbringen",
      "Musik organisieren",
      "Getränke bestellen",
      "Einen Kuchen backen"
    ],
    "explanation": "Kannst du einen Salat mitbringen?",
    "audio": "Hallo Anna! Wir feiern am Samstag um achtzehn Uhr im Kursraum. Wir organisieren Getränke und Musik. Kannst du einen Salat mitbringen? Bitte antworte bis Donnerstag. Viele Grüße, Koray."
  },
  {
    "id": "u8-153",
    "topic": "invitations",
    "kind": "read",
    "prompt": "Lena partiye geliyor mu?",
    "answer": "Nein, sie kann nicht kommen.",
    "options": [
      "Nein, sie kann nicht kommen.",
      "Ja, sie bringt Salat mit.",
      "Ja, um 17 Uhr.",
      "Sie organisiert Musik."
    ],
    "explanation": "leider nicht kommen = maalesef gelemem.",
    "passage": "Liebe Martina, vielen Dank für die Einladung. Ich kann am Sonntag leider nicht kommen. Ich bin am Wochenende in Madrid. Viele Grüße, Lena."
  },
  {
    "id": "u8-154",
    "topic": "invitations",
    "kind": "listen",
    "prompt": "Lena partiye geliyor mu?",
    "answer": "Nein, sie kann nicht kommen.",
    "options": [
      "Nein, sie kann nicht kommen.",
      "Ja, sie bringt Salat mit.",
      "Ja, um 17 Uhr.",
      "Sie organisiert Musik."
    ],
    "explanation": "leider nicht kommen = maalesef gelemem.",
    "audio": "Liebe Martina, vielen Dank für die Einladung. Ich kann am Sonntag leider nicht kommen. Ich bin am Wochenende in Madrid. Viele Grüße, Lena."
  },
  {
    "id": "u8-155",
    "topic": "invitations",
    "kind": "read",
    "prompt": "Hafta sonu nerede?",
    "answer": "In Madrid",
    "options": [
      "In Madrid",
      "In Berlin",
      "In Istanbul",
      "In Hamburg"
    ],
    "explanation": "Ich bin am Wochenende in Madrid.",
    "passage": "Liebe Martina, vielen Dank für die Einladung. Ich kann am Sonntag leider nicht kommen. Ich bin am Wochenende in Madrid. Viele Grüße, Lena."
  },
  {
    "id": "u8-156",
    "topic": "invitations",
    "kind": "listen",
    "prompt": "Hafta sonu nerede?",
    "answer": "In Madrid",
    "options": [
      "In Madrid",
      "In Berlin",
      "In Istanbul",
      "In Hamburg"
    ],
    "explanation": "Ich bin am Wochenende in Madrid.",
    "audio": "Liebe Martina, vielen Dank für die Einladung. Ich kann am Sonntag leider nicht kommen. Ich bin am Wochenende in Madrid. Viele Grüße, Lena."
  },
  {
    "id": "u8-157",
    "topic": "food-acc",
    "kind": "read",
    "prompt": "Salatada ne olmasın istiyor?",
    "answer": "Tomaten",
    "options": [
      "Tomaten",
      "Zwiebeln",
      "Joghurt",
      "Reis"
    ],
    "explanation": "ohne Tomaten = domatessiz.",
    "passage": "Guten Tag! Ich möchte den Salat ohne Tomaten und das Hähnchen mit Reis. Ich esse kein Schweinefleisch. Für meinen Freund nehme ich die Suppe."
  },
  {
    "id": "u8-158",
    "topic": "food-acc",
    "kind": "listen",
    "prompt": "Salatada ne olmasın istiyor?",
    "answer": "Tomaten",
    "options": [
      "Tomaten",
      "Zwiebeln",
      "Joghurt",
      "Reis"
    ],
    "explanation": "ohne Tomaten = domatessiz.",
    "audio": "Guten Tag! Ich möchte den Salat ohne Tomaten und das Hähnchen mit Reis. Ich esse kein Schweinefleisch. Für meinen Freund nehme ich die Suppe."
  },
  {
    "id": "u8-159",
    "topic": "food-acc",
    "kind": "read",
    "prompt": "Arkadaşı için ne alıyor?",
    "answer": "Die Suppe",
    "options": [
      "Die Suppe",
      "Den Salat",
      "Das Hähnchen",
      "Den Fisch"
    ],
    "explanation": "Für meinen Freund nehme ich die Suppe.",
    "passage": "Guten Tag! Ich möchte den Salat ohne Tomaten und das Hähnchen mit Reis. Ich esse kein Schweinefleisch. Für meinen Freund nehme ich die Suppe."
  },
  {
    "id": "u8-160",
    "topic": "food-acc",
    "kind": "listen",
    "prompt": "Arkadaşı için ne alıyor?",
    "answer": "Die Suppe",
    "options": [
      "Die Suppe",
      "Den Salat",
      "Das Hähnchen",
      "Den Fisch"
    ],
    "explanation": "Für meinen Freund nehme ich die Suppe.",
    "audio": "Guten Tag! Ich möchte den Salat ohne Tomaten und das Hähnchen mit Reis. Ich esse kein Schweinefleisch. Für meinen Freund nehme ich die Suppe."
  },
  {
    "id": "u8-161",
    "topic": "nehmen",
    "kind": "read",
    "prompt": "Lena ne alıyor?",
    "answer": "Das Gulasch",
    "options": [
      "Das Gulasch",
      "Den Fisch",
      "Die Nudeln",
      "Die Suppe"
    ],
    "explanation": "Lena nimmt das Gulasch.",
    "passage": "Was nehmt ihr? Ich nehme den Fisch mit Kartoffeln. Lena nimmt das Gulasch. Ali nimmt die Nudeln mit Gemüse."
  },
  {
    "id": "u8-162",
    "topic": "nehmen",
    "kind": "listen",
    "prompt": "Lena ne alıyor?",
    "answer": "Das Gulasch",
    "options": [
      "Das Gulasch",
      "Den Fisch",
      "Die Nudeln",
      "Die Suppe"
    ],
    "explanation": "Lena nimmt das Gulasch.",
    "audio": "Was nehmt ihr? Ich nehme den Fisch mit Kartoffeln. Lena nimmt das Gulasch. Ali nimmt die Nudeln mit Gemüse."
  },
  {
    "id": "u8-163",
    "topic": "nehmen",
    "kind": "read",
    "prompt": "Ali ne alıyor?",
    "answer": "Die Nudeln mit Gemüse",
    "options": [
      "Die Nudeln mit Gemüse",
      "Den Fisch mit Reis",
      "Das Gulasch",
      "Den Salat"
    ],
    "explanation": "Ali sebzeli makarnayı alıyor.",
    "passage": "Was nehmt ihr? Ich nehme den Fisch mit Kartoffeln. Lena nimmt das Gulasch. Ali nimmt die Nudeln mit Gemüse."
  },
  {
    "id": "u8-164",
    "topic": "nehmen",
    "kind": "listen",
    "prompt": "Ali ne alıyor?",
    "answer": "Die Nudeln mit Gemüse",
    "options": [
      "Die Nudeln mit Gemüse",
      "Den Fisch mit Reis",
      "Das Gulasch",
      "Den Salat"
    ],
    "explanation": "Ali sebzeli makarnayı alıyor.",
    "audio": "Was nehmt ihr? Ich nehme den Fisch mit Kartoffeln. Lena nimmt das Gulasch. Ali nimmt die Nudeln mit Gemüse."
  },
  {
    "id": "u8-165",
    "topic": "compliments",
    "kind": "read",
    "prompt": "Hangi yemek övülüyor?",
    "answer": "Die Suppe",
    "options": [
      "Die Suppe",
      "Der Kuchen",
      "Der Fisch",
      "Das Brot"
    ],
    "explanation": "Die Suppe schmeckt sehr gut.",
    "passage": "Die Suppe schmeckt sehr gut. Du kochst super! Danke, das freut mich. Möchtest du auch den Salat probieren? Ja, gern."
  },
  {
    "id": "u8-166",
    "topic": "compliments",
    "kind": "listen",
    "prompt": "Hangi yemek övülüyor?",
    "answer": "Die Suppe",
    "options": [
      "Die Suppe",
      "Der Kuchen",
      "Der Fisch",
      "Das Brot"
    ],
    "explanation": "Die Suppe schmeckt sehr gut.",
    "audio": "Die Suppe schmeckt sehr gut. Du kochst super! Danke, das freut mich. Möchtest du auch den Salat probieren? Ja, gern."
  },
  {
    "id": "u8-167",
    "topic": "compliments",
    "kind": "read",
    "prompt": "İltifata nasıl cevap veriyor?",
    "answer": "Danke, das freut mich.",
    "options": [
      "Danke, das freut mich.",
      "Ich kann nicht kommen.",
      "Prost!",
      "Guten Appetit!"
    ],
    "explanation": "Teşekkür ediyor ve sevindiğini söylüyor.",
    "passage": "Die Suppe schmeckt sehr gut. Du kochst super! Danke, das freut mich. Möchtest du auch den Salat probieren? Ja, gern."
  },
  {
    "id": "u8-168",
    "topic": "compliments",
    "kind": "listen",
    "prompt": "İltifata nasıl cevap veriyor?",
    "answer": "Danke, das freut mich.",
    "options": [
      "Danke, das freut mich.",
      "Ich kann nicht kommen.",
      "Prost!",
      "Guten Appetit!"
    ],
    "explanation": "Teşekkür ediyor ve sevindiğini söylüyor.",
    "audio": "Die Suppe schmeckt sehr gut. Du kochst super! Danke, das freut mich. Möchtest du auch den Salat probieren? Ja, gern."
  },
  {
    "id": "u8-169",
    "topic": "ordering",
    "kind": "read",
    "prompt": "Pilavlı balık kaç avro?",
    "answer": "8,90 €",
    "options": [
      "8,90 €",
      "7,20 €",
      "3,80 €",
      "2,90 €"
    ],
    "explanation": "Menüde Fisch mit Reis: 8,90 Euro.",
    "passage": "MENKEN Partyservice. Salat: 3,80 Euro. Nudelsalat: 3,50 Euro. Fisch mit Reis: 8,90 Euro. Hähnchen mit Pommes: 7,20 Euro. Schokoladenkuchen: 2,90 Euro. Obstsalat: 3,10 Euro. Die Preise sind pro Person."
  },
  {
    "id": "u8-170",
    "topic": "ordering",
    "kind": "listen",
    "prompt": "Pilavlı balık kaç avro?",
    "answer": "8,90 €",
    "options": [
      "8,90 €",
      "7,20 €",
      "3,80 €",
      "2,90 €"
    ],
    "explanation": "Menüde Fisch mit Reis: 8,90 Euro.",
    "audio": "MENKEN Partyservice. Salat: 3,80 Euro. Nudelsalat: 3,50 Euro. Fisch mit Reis: 8,90 Euro. Hähnchen mit Pommes: 7,20 Euro. Schokoladenkuchen: 2,90 Euro. Obstsalat: 3,10 Euro. Die Preise sind pro Person."
  },
  {
    "id": "u8-171",
    "topic": "ordering",
    "kind": "read",
    "prompt": "7,20 € olan yemek hangisi?",
    "answer": "Hähnchen mit Pommes",
    "options": [
      "Hähnchen mit Pommes",
      "Fisch mit Reis",
      "Nudelsalat",
      "Obstsalat"
    ],
    "explanation": "Hähnchen mit Pommes = patates kızartmalı tavuk.",
    "passage": "MENKEN Partyservice. Salat: 3,80 Euro. Nudelsalat: 3,50 Euro. Fisch mit Reis: 8,90 Euro. Hähnchen mit Pommes: 7,20 Euro. Schokoladenkuchen: 2,90 Euro. Obstsalat: 3,10 Euro. Die Preise sind pro Person."
  },
  {
    "id": "u8-172",
    "topic": "ordering",
    "kind": "listen",
    "prompt": "7,20 € olan yemek hangisi?",
    "answer": "Hähnchen mit Pommes",
    "options": [
      "Hähnchen mit Pommes",
      "Fisch mit Reis",
      "Nudelsalat",
      "Obstsalat"
    ],
    "explanation": "Hähnchen mit Pommes = patates kızartmalı tavuk.",
    "audio": "MENKEN Partyservice. Salat: 3,80 Euro. Nudelsalat: 3,50 Euro. Fisch mit Reis: 8,90 Euro. Hähnchen mit Pommes: 7,20 Euro. Schokoladenkuchen: 2,90 Euro. Obstsalat: 3,10 Euro. Die Preise sind pro Person."
  },
  {
    "id": "u8-173",
    "topic": "ordering",
    "kind": "read",
    "prompt": "Fiyatlar hangi birim için?",
    "answer": "Pro Person",
    "options": [
      "Pro Person",
      "Pro Woche",
      "Pro Monat",
      "Pro Paket"
    ],
    "explanation": "pro Person = kişi başı.",
    "passage": "MENKEN Partyservice. Salat: 3,80 Euro. Nudelsalat: 3,50 Euro. Fisch mit Reis: 8,90 Euro. Hähnchen mit Pommes: 7,20 Euro. Schokoladenkuchen: 2,90 Euro. Obstsalat: 3,10 Euro. Die Preise sind pro Person."
  },
  {
    "id": "u8-174",
    "topic": "ordering",
    "kind": "listen",
    "prompt": "Fiyatlar hangi birim için?",
    "answer": "Pro Person",
    "options": [
      "Pro Person",
      "Pro Woche",
      "Pro Monat",
      "Pro Paket"
    ],
    "explanation": "pro Person = kişi başı.",
    "audio": "MENKEN Partyservice. Salat: 3,80 Euro. Nudelsalat: 3,50 Euro. Fisch mit Reis: 8,90 Euro. Hähnchen mit Pommes: 7,20 Euro. Schokoladenkuchen: 2,90 Euro. Obstsalat: 3,10 Euro. Die Preise sind pro Person."
  },
  {
    "id": "u8-175",
    "topic": "ordering",
    "kind": "read",
    "prompt": "Hangi yemek sipariş ediliyor?",
    "answer": "Fisch mit Reis",
    "options": [
      "Fisch mit Reis",
      "Hähnchen mit Pommes",
      "Nudelsalat",
      "Gulasch"
    ],
    "explanation": "Siparişin sonunda pilavlı balık isteniyor.",
    "passage": "Guten Tag, ich möchte bestellen. Können Sie Salat ohne Tomaten machen? Ja, das ist möglich. Haben Sie auch Saft? Ja, wir haben Apfelsaft und Orangensaft. Gut, ich nehme den Fisch mit Reis und einen Apfelsaft."
  },
  {
    "id": "u8-176",
    "topic": "ordering",
    "kind": "listen",
    "prompt": "Hangi yemek sipariş ediliyor?",
    "answer": "Fisch mit Reis",
    "options": [
      "Fisch mit Reis",
      "Hähnchen mit Pommes",
      "Nudelsalat",
      "Gulasch"
    ],
    "explanation": "Siparişin sonunda pilavlı balık isteniyor.",
    "audio": "Guten Tag, ich möchte bestellen. Können Sie Salat ohne Tomaten machen? Ja, das ist möglich. Haben Sie auch Saft? Ja, wir haben Apfelsaft und Orangensaft. Gut, ich nehme den Fisch mit Reis und einen Apfelsaft."
  },
  {
    "id": "u8-177",
    "topic": "ordering",
    "kind": "read",
    "prompt": "Hangi içecek sipariş ediliyor?",
    "answer": "Apfelsaft",
    "options": [
      "Apfelsaft",
      "Orangensaft",
      "Cola",
      "Tee"
    ],
    "explanation": "Alternatifler arasında elma suyu seçiliyor.",
    "passage": "Guten Tag, ich möchte bestellen. Können Sie Salat ohne Tomaten machen? Ja, das ist möglich. Haben Sie auch Saft? Ja, wir haben Apfelsaft und Orangensaft. Gut, ich nehme den Fisch mit Reis und einen Apfelsaft."
  },
  {
    "id": "u8-178",
    "topic": "ordering",
    "kind": "listen",
    "prompt": "Hangi içecek sipariş ediliyor?",
    "answer": "Apfelsaft",
    "options": [
      "Apfelsaft",
      "Orangensaft",
      "Cola",
      "Tee"
    ],
    "explanation": "Alternatifler arasında elma suyu seçiliyor.",
    "audio": "Guten Tag, ich möchte bestellen. Können Sie Salat ohne Tomaten machen? Ja, das ist möglich. Haben Sie auch Saft? Ja, wir haben Apfelsaft und Orangensaft. Gut, ich nehme den Fisch mit Reis und einen Apfelsaft."
  },
  {
    "id": "u8-179",
    "topic": "ordering",
    "kind": "read",
    "prompt": "Domatessiz salata mümkün mü?",
    "answer": "Ja, das ist möglich.",
    "options": [
      "Ja, das ist möglich.",
      "Nein, nur mit Tomaten.",
      "Es gibt keinen Salat.",
      "Nur am Sonntag."
    ],
    "explanation": "Ja, das ist möglich. = Evet, mümkün.",
    "passage": "Guten Tag, ich möchte bestellen. Können Sie Salat ohne Tomaten machen? Ja, das ist möglich. Haben Sie auch Saft? Ja, wir haben Apfelsaft und Orangensaft. Gut, ich nehme den Fisch mit Reis und einen Apfelsaft."
  },
  {
    "id": "u8-180",
    "topic": "ordering",
    "kind": "listen",
    "prompt": "Domatessiz salata mümkün mü?",
    "answer": "Ja, das ist möglich.",
    "options": [
      "Ja, das ist möglich.",
      "Nein, nur mit Tomaten.",
      "Es gibt keinen Salat.",
      "Nur am Sonntag."
    ],
    "explanation": "Ja, das ist möglich. = Evet, mümkün.",
    "audio": "Guten Tag, ich möchte bestellen. Können Sie Salat ohne Tomaten machen? Ja, das ist möglich. Haben Sie auch Saft? Ja, wir haben Apfelsaft und Orangensaft. Gut, ich nehme den Fisch mit Reis und einen Apfelsaft."
  },
  {
    "id": "u9-181",
    "topic": "appointments",
    "kind": "read",
    "prompt": "Post belirtilen günlerde hangi saatlerde açık?",
    "answer": "07:30–18:00",
    "options": [
      "07:30–18:00",
      "11:00–18:00",
      "09:00–15:00",
      "11:00–17:00"
    ],
    "explanation": "Metindeki von … bis … aralığını takip et.",
    "passage": "Post: Montag bis Freitag, von halb acht bis achtzehn Uhr. Sonntag: geschlossen."
  },
  {
    "id": "u9-182",
    "topic": "appointments",
    "kind": "listen",
    "prompt": "Post belirtilen günlerde hangi saatlerde açık?",
    "answer": "07:30–18:00",
    "options": [
      "07:30–18:00",
      "11:00–18:00",
      "09:00–15:00",
      "11:00–17:00"
    ],
    "explanation": "Metindeki von … bis … aralığını takip et.",
    "audio": "Post: Montag bis Freitag, von halb acht bis achtzehn Uhr. Sonntag: geschlossen."
  },
  {
    "id": "u9-183",
    "topic": "appointments",
    "kind": "read",
    "prompt": "Bürgerbüro belirtilen günlerde hangi saatlerde açık?",
    "answer": "11:00–18:00",
    "options": [
      "11:00–18:00",
      "07:30–18:00",
      "09:00–15:00",
      "11:00–17:00"
    ],
    "explanation": "Metindeki von … bis … aralığını takip et.",
    "passage": "Bürgerbüro: Dienstag und Donnerstag, von elf bis achtzehn Uhr. Samstag und Sonntag: geschlossen."
  },
  {
    "id": "u9-184",
    "topic": "appointments",
    "kind": "listen",
    "prompt": "Bürgerbüro belirtilen günlerde hangi saatlerde açık?",
    "answer": "11:00–18:00",
    "options": [
      "11:00–18:00",
      "07:30–18:00",
      "09:00–15:00",
      "11:00–17:00"
    ],
    "explanation": "Metindeki von … bis … aralığını takip et.",
    "audio": "Bürgerbüro: Dienstag und Donnerstag, von elf bis achtzehn Uhr. Samstag und Sonntag: geschlossen."
  },
  {
    "id": "u9-185",
    "topic": "appointments",
    "kind": "read",
    "prompt": "Flora Apotheke belirtilen günlerde hangi saatlerde açık?",
    "answer": "09:00–15:00",
    "options": [
      "09:00–15:00",
      "07:30–18:00",
      "11:00–18:00",
      "11:00–17:00"
    ],
    "explanation": "Metindeki von … bis … aralığını takip et.",
    "passage": "Flora Apotheke: Samstag, von neun bis fünfzehn Uhr. Sonntag: geschlossen."
  },
  {
    "id": "u9-186",
    "topic": "appointments",
    "kind": "listen",
    "prompt": "Flora Apotheke belirtilen günlerde hangi saatlerde açık?",
    "answer": "09:00–15:00",
    "options": [
      "09:00–15:00",
      "07:30–18:00",
      "11:00–18:00",
      "11:00–17:00"
    ],
    "explanation": "Metindeki von … bis … aralığını takip et.",
    "audio": "Flora Apotheke: Samstag, von neun bis fünfzehn Uhr. Sonntag: geschlossen."
  },
  {
    "id": "u9-187",
    "topic": "appointments",
    "kind": "read",
    "prompt": "Agentur für Arbeit belirtilen günlerde hangi saatlerde açık?",
    "answer": "11:00–17:00",
    "options": [
      "11:00–17:00",
      "07:30–18:00",
      "11:00–18:00",
      "09:00–15:00"
    ],
    "explanation": "Metindeki von … bis … aralığını takip et.",
    "passage": "Agentur für Arbeit: Donnerstag und Freitag, von elf bis siebzehn Uhr."
  },
  {
    "id": "u9-188",
    "topic": "appointments",
    "kind": "listen",
    "prompt": "Agentur für Arbeit belirtilen günlerde hangi saatlerde açık?",
    "answer": "11:00–17:00",
    "options": [
      "11:00–17:00",
      "07:30–18:00",
      "11:00–18:00",
      "09:00–15:00"
    ],
    "explanation": "Metindeki von … bis … aralığını takip et.",
    "audio": "Agentur für Arbeit: Donnerstag und Freitag, von elf bis siebzehn Uhr."
  },
  {
    "id": "u9-189",
    "topic": "appointments",
    "kind": "choice",
    "prompt": "halb acht hangi saat?",
    "answer": "07:30",
    "options": [
      "07:30",
      "08:30",
      "07:00",
      "08:00"
    ],
    "explanation": "halb acht: sekize yarım saat var → 07:30."
  },
  {
    "id": "u9-190",
    "topic": "appointments",
    "kind": "choice",
    "prompt": "von neun bis fünfzehn Uhr",
    "answer": "09:00–15:00",
    "options": [
      "09:00–15:00",
      "09:00–17:00",
      "15:00–19:00",
      "08:00–15:00"
    ],
    "explanation": "neun = 9; fünfzehn = 15."
  },
  {
    "id": "u9-191",
    "topic": "appointments",
    "kind": "choice",
    "prompt": "Paket teslim etmek için hangi kurum?",
    "answer": "Die Post",
    "options": [
      "Die Post",
      "Die Bank",
      "Die Apotheke",
      "Das Bürgerbüro"
    ],
    "explanation": "ein Paket abgeben → die Post."
  },
  {
    "id": "u9-192",
    "topic": "appointments",
    "kind": "choice",
    "prompt": "Para havale etmek için hangi kurum?",
    "answer": "Die Bank",
    "options": [
      "Die Bank",
      "Die Post",
      "Die Apotheke",
      "Die Agentur für Arbeit"
    ],
    "explanation": "Geld überweisen → die Bank."
  },
  {
    "id": "u9-193",
    "topic": "appointments",
    "kind": "choice",
    "prompt": "Adresse kayıt yaptırmak için hangi kurum?",
    "answer": "Das Bürgerbüro",
    "options": [
      "Das Bürgerbüro",
      "Die Apotheke",
      "Die Post",
      "Die Bank"
    ],
    "explanation": "eine Wohnung anmelden → das Bürgerbüro."
  },
  {
    "id": "u9-194",
    "topic": "appointments",
    "kind": "choice",
    "prompt": "___ Sonntag ist die Post geschlossen.",
    "answer": "Am",
    "options": [
      "Am",
      "Um",
      "Von",
      "Aus"
    ],
    "explanation": "Günlerle am kullanılır."
  },
  {
    "id": "u9-195",
    "topic": "appointments",
    "kind": "choice",
    "prompt": "Ich möchte ___ Termin vereinbaren.",
    "answer": "einen",
    "options": [
      "einen",
      "ein",
      "eine",
      "einem"
    ],
    "explanation": "der Termin → Akkusativ einen Termin."
  }
];
