# Kurulum sonucu

- Calisma: 40134359878 / commit 5caf57b967c2f82f7487c6c429c80d277198feff
- Tarih (UTC): 2026-10-24 21:32

```
1-pnpm=basarili
2-kurulum=basarili
3-derleme=basarili
4-typescript=basarili
5-testler=basarili
5-sesler=basarili
6-veritabani=basarili
7-site=basarili
```
## 01-pnpm.log
```
v24.21.0
Preparing pnpm@11.25.0 for immediate activation...
11.25.0
```
## 02-install.log
```
Lockfile is up to date, resolution step is skipped
Progress: resolved 1, reused 0, downloaded 0, added 0
Packages: +640
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Progress: resolved 640, reused 0, downloaded 0, added 0
Progress: resolved 640, reused 0, downloaded 41, added 0
Progress: resolved 640, reused 0, downloaded 59, added 0
Packages are hard linked from the content-addressable store to the virtual store.
  Content-addressable store is at: /home/runner/work/goligo/goligo/.sites-runtime/pnpm-store/v11
  Virtual store is at:             node_modules/.pnpm
Progress: resolved 640, reused 0, downloaded 126, added 8
Progress: resolved 640, reused 0, downloaded 181, added 8
Progress: resolved 640, reused 0, downloaded 234, added 12
Progress: resolved 640, reused 0, downloaded 382, added 24
Progress: resolved 640, reused 0, downloaded 508, added 33
Progress: resolved 640, reused 0, downloaded 640, added 63
✓ Lockfile passes supply-chain policies (842 entries in 9.5s)
Progress: resolved 640, reused 0, downloaded 640, added 640, done
.../node_modules/workerd postinstall$ node install.js
.../esbuild@0.28.0/node_modules/esbuild postinstall$ node install.js
.../esbuild@0.27.3/node_modules/esbuild postinstall$ node install.js
.../esbuild@0.18.20/node_modules/esbuild postinstall$ node install.js
.../esbuild@0.25.12/node_modules/esbuild postinstall$ node install.js
.../esbuild@0.27.3/node_modules/esbuild postinstall: Done
.../esbuild@0.28.0/node_modules/esbuild postinstall: Done
.../node_modules/workerd postinstall: Done
.../esbuild@0.18.20/node_modules/esbuild postinstall: Done
.../node_modules/unrs-resolver postinstall$ napi-postinstall unrs-resolver 1.11.1 check
.../esbuild@0.25.12/node_modules/esbuild postinstall: Done
.../node_modules/unrs-resolver postinstall: Done

dependencies:
+ @base-ui/react 1.7.0
+ @hookform/resolvers 5.7.1
+ @shadcn/react 0.3.0
+ class-variance-authority 0.7.1
+ clsx 2.1.1
+ cmdk 1.1.1
+ date-fns 4.4.0
+ drizzle-orm 0.45.2
+ embla-carousel-react 8.6.0
+ input-otp 1.4.2
+ lucide-react 1.31.0
+ next 16.3.4
+ next-themes 0.4.6
+ radix-ui 1.6.7
+ react 19.2.6
+ react-day-picker 10.0.1
+ react-dom 19.2.6
+ react-hook-form 7.85.0
+ react-resizable-panels 4.12.2
+ recharts 3.8.0
+ sonner 2.0.8
+ tailwind-merge 3.6.0
+ vaul 1.1.2
+ zod 3.25.76

devDependencies:
+ @cloudflare/vite-plugin 1.37.1
+ @cloudflare/workers-types 4.20260515.1
+ @tailwindcss/postcss 4.2.1
+ @types/node 22.19.19
+ @types/react 19.2.14
+ @types/react-dom 19.2.3
+ @vitejs/plugin-react 6.0.2
+ @vitejs/plugin-rsc 0.5.26
+ drizzle-kit 0.31.10
+ eslint 9.39.4
+ eslint-config-next 16.3.4
+ json-rpc-2.0 1.7.1
+ raw-body 3.0.2
+ react-server-dom-webpack 19.2.6
+ tailwindcss 4.2.1
+ tw-animate-css 1.4.0
+ typescript 5.9.3
+ vinext 1.0.0-beta.5
+ vite 8.0.13
+ wrangler 4.92.0

Done in 11.6s using pnpm v11.25.0
```
## 03-build.log
```
$ node scripts/sounds/make-sounds.mjs && node scripts/run-framework.mjs build
Goliqo sesleri hazır: tap 0.24s, tap2 0.24s, tap3 0.24s, whoosh 0.55s, correct 0.95s, complete 1.65s, soft 0.8s, beep 0.7s, retro 0.55s, low 0.95s, cartoon 0.85s, tapWood 0.22s, tapPop 0.22s, tapDrop 0.26s, tapBell 0.4s, tapChip 0.12s, pageFlip 0.177s, pageSlide 0.48s, pageHarp 0.75s, pageBubbles 0.42s, pageChip 0.17s, correctMarimba 0.95s, correctCoin 0.62s, correctDing 1.2s, correctFanfare 0.95s, correctBubbles 0.95s, completeFanfare 1.6s, completeLevel 0.89s, completeChimes 1.65s, completeHarp 1.6s, paulHello 0.85s, paulTip 0.75s, paulHmm 0.95s, paulClap 1.55s, paulDrum 1.05s, completeMarimba 1.6s

  vinext build  (Vite 8.0.13)

[34m[1/5] analyze client references...[39m
[2Ktransforming...✓ 485 modules transformed.
rendering chunks...
[32m✓ built in 2.07s[39m
[34m[2/5] analyze server references...[39m
[2Ktransforming...✓ 336 modules transformed.
rendering chunks...
[32m✓ built in 988ms[39m
[34m[3/5] build rsc environment...[39m
[2Ktransforming...✓ 482 modules transformed.
rendering chunks...
computing gzip size...
[32m✓ built in 1.78s[39m
[34m[4/5] build client environment...[39m
[2Ktransforming...✓ 2107 modules transformed.
rendering chunks...
computing gzip size...
[32m✓ built in 2.99s[39m
[34m[5/5] build ssr environment...[39m
[2Ktransforming...✓ 342 modules transformed.
rendering chunks...
computing gzip size...
[32m✓ built in 1.64s[39m
[0m
  Route (app)
  ┌ ƒ /                      
  ├ ƒ /a1-1/willkommen       
  ├ ƒ /a1-2/ausbildung       
  ├ ƒ /a1-2/ausbildung/hoeren
  ├ ƒ /a1-2/ev-ve-yasam      
  ├ λ /api/auth              
  ├ λ /api/study             
  ├ ƒ /ev-esyalar            
  ├ ƒ /fiiller               
  ├ ƒ /giris                 
  ├ ƒ /gizlilik              
  ├ ƒ /hesabim               
  ├ ƒ /impressum             
  ├ ƒ /konular               
  ├ ƒ /kullanim-kosullari    
  ├ ƒ /oyunlar               
  ├ ƒ /sifre-yenile          
  ├ ƒ /uye-ol                
  ├ ƒ /yanlislarim           
  └ ƒ /yonetim               

  λ API  ƒ Dynamic

  Build complete. Run `vinext start` to start the production server.

```
## 04-typescript.log
```
```
## 05-tests.log
```
✔ Lektion 12 packs: every Turkish text, with its marks, and German answers are never translated (43.513608ms)
✔ phones: the speed choices in one even row under their title; der / die / das about 48 px high (0.925345ms)
✔ Oyunlar and Yanlışlarım are parts of their own; Yanlışlarım shows the mistakes of every part (110.261317ms)
✔ Paul keeps off the answers on phones; pages wait for the chosen language; "Alıştırma hazırlanıyor…" while a round starts (24.224326ms)
✔ Yanlışlarım: every mistake of the site in one round (30.557078ms)
✔ the tab title of /oyunlar and /yanlislarim names that part, not Fiil Atölyesi (0.339747ms)
✔ answer choices never break inside a word: one line, else the article above the noun, else one choice per row (0.877325ms)
✔ tablets show the lesson book one page under the other; touch targets are at least 40 px; files are cached (0.581661ms)
✔ every page offers the same 31 site languages in one fixed order (20.080907ms)
✔ texts come from the tuple first, then from the language pack, then in English (0.259487ms)
✔ every language that needs a pack has one, and packs keep the placeholders (125.005599ms)
✔ pages switch the language only after its pack is loaded and use the language direction (0.756758ms)
✔ object meanings and verb example sentences exist for every site language (37.34331ms)
✔ the site name is Goliqo everywhere a learner can see it (37.440703ms)
✔ the learner's Goliqo logo and animations are used in many places (6.282158ms)
✔ internal names stay, so saved settings and data keep working; the address is goliqo.com now (0.3149ms)
✔ every half hour each part shows its next picture, and the parts mix the sets (3.988297ms)
✔ the sounds come first, then the header, the menu and "Hazırsın!" (2.579757ms)
✔ shown once per member (the account remembers it); ?tur=1 starts it again (0.886662ms)
✔ Paul's card goes where it fits next to the lit part (0.685575ms)
✔ the tour speaks every site language and asks about the sounds (35.046304ms)
✔ the account keeps the tour note for the member (234.620948ms)
✔ letter banks contain exactly the required copies, stable token IDs and complete German articles (55.195801ms)
✔ repeated letters use one remaining choice and removing a placed token restores its count (0.529673ms)
✔ the screenshot answer has letters out of order while the correctly spelled Toilette is accepted (0.318908ms)
✔ whole-article, plural and compound challenges use correct complete answers and mix with spelling (5.454296ms)
✔ letter-bank and article instructions are available in every helper language (2.252202ms)
✔ the site address is goliqo.com; the old ones and www go to the same page there (37.843078ms)
✔ the browser settings move once, only from the old addresses, never over newer ones (8.680173ms)
✔ visible practice choices match server selection, including empty and active review pools (709.455042ms)
✔ every ready topic has questions and supported mode pools are nonempty (31.334976ms)
✔ start, wrong explanation, correct answer, finish, history and saved progress work end to end (217.082454ms)
✔ out-of-order answers, invalid options and answers from another account are rejected (58.098352ms)
✔ question IDs, canonical answers, supported variants, audio and images stay valid (21.442621ms)
✔ retry identifiers change with practice configuration instead of resuming a different test (0.296445ms)
✔ category rounds stay inside the chosen topic and automatically cover available activity types (228.233491ms)
✔ saved vocabulary and all listening or reading texts have meanings in each helper language (26.657918ms)
✔ feedback is specific to the question rather than an unrelated topic rule (2.367439ms)
✔ A1.1 and A1.2 contain only their twenty catalogue headings (17.408176ms)
✔ written gap answers, incorrect answers, saved mode and continuation persist through the study API (47.459306ms)
✔ object picture tests retain four choices and writing includes both names and article gaps (21.32485ms)
✔ the eight icons are small, sharp and see-through (2.293901ms)
✔ they are used in the header, the sound settings, the clock, the tour and Hesabım (0.495799ms)
✔ article questions are answered with the tap on der/die/das (1.036984ms)
✔ Dinle ve Bul plays the first word and every next word by itself (0.423485ms)
✔ Fiiller keeps the 72 verbs of the two pages with Präsens, Perfekt and a meaning in every language (4.767608ms)
✔ every verb has choice, writing and listening exercises with new IDs only (18.081519ms)
✔ grading checks hat or ist, the umlaut and the separable prefix (0.371376ms)
✔ rounds follow the chosen group and mode, solved questions wait and the same verb never comes twice in a row (23.949086ms)
✔ every text of the page exists in every site language (7.012246ms)
✔ a Fiiller round starts, saves answers and stars, resumes and finishes through the study API (256.242621ms)
✔ Yanlışlarım: the workshop mistakes make their own round, and a right answer takes a question off the list (61.050016ms)
✔ the page is linked from home, only the correct answer is spoken, and verb audio is in the voice list (494.3195ms)
✔ sentences, form pieces and rules explain every verb (46.318542ms)
✔ the writing puzzles use sentences, the prefix choice and the | mark of separable verbs (0.72022ms)
✔ Fiil Atölyesi: four parts in book order, each verb in turn: card, meaning test, spelling, past form (17.684886ms)
✔ after an answer every person gets an example sentence: Präsens after meanings, Perfekt after Perfekt (52.653013ms)
✔ the cards say regular, irregular or modal; irregular names and forms get their own colour (3.419772ms)
✔ a part opens its verb list with what is done; a verb opens its own card (0.467186ms)
✔ letter puzzles: a wrong letter goes back and counts, hints help, a full word is checked by itself (8.409016ms)
✔ site voice manifest: normalised lookup, default voice and safe parsing (2.733675ms)
✔ an old device-voice choice moves once to the natural site voice; later choices are kept (0.449233ms)
✔ a natural clip plays when available and the device voice is the fallback (4.884407ms)
✔ when the chosen voice has no clip yet, another natural voice plays it before the device voice (1.042394ms)
✔ late clip events after stop or a newer request are ignored (0.550502ms)
✔ every effect has a rendered sound, a fallback recipe and readable labels (1197.621801ms)
✔ the voice list covers each greeting, the speech pages and the deploy step (447.4379ms)
✔ 22 steps in the order of the learner's page: cover, 10 teaching steps, 9 exercises, test, end (2.120666ms)
✔ typed answers are compared loosely; the right answer is read after a test question (0.658033ms)
✔ every German text the lesson speaks is listed for the site voices (0.704992ms)
✔ scores stay in the browser and make the progress of the unit card (0.443281ms)
✔ the page, its pictures, the units link, guest access and the menu (0.483927ms)
ℹ tests 278
ℹ suites 0
ℹ pass 278
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 10388.64008
```
## 05-voices.log
```
eksik: Aus Griechenland. Herzlich willkommen!
eksik: Danke!
eksik: Frau
eksik: Guten Tag!
eksik: Guten Tag. Ich bin Mei Suwan. Ich komme aus Thailand, aus Bangkok.
eksik: Guten Tag. Ich bin Nikos Papadakis. Wie heißen Sie?
eksik: Guten Tag. Ich bin Nora Weiß. Ich komme aus Österreich, aus Wien.
eksik: Guten Tag. Ich bin Sabine Krüger. Wie heißen Sie?
eksik: Guten Tag. Ich heiße Mira Fuchs. Und Sie?
eksik: Guten Tag. Ich heiße Omar Nasser.
eksik: Guten Tag. Wie heißen Sie?
eksik: Hallo. Ich heiße Rami Khalil. Ich komme aus dem Libanon, aus Beirut.
eksik: Herr
eksik: Herzlich willkommen!
eksik: Ich bin Lena Vogt.
eksik: Ich bin Lena Vogt. Und Sie?
eksik: Ich bin Mira Fuchs. Und Sie?
eksik: Ich bin Omar Nasser.
eksik: Ich bin Sabine Krüger.
eksik: Ich bin Tarek Salim.
Doğal sesi eksik metin: 96
https://github.com/Krycskn05/goligo/actions/runs/40134434538
Ses iş akışı başlatıldı (eksik sesler üretilecek).
```
## 06-db.log
```
      "duration": 0
    }
  },
  {
    "results": [],
    "success": true,
    "meta": {
      "duration": 0
    }
  }
]
Yerel veritabanı: migration/database/members.sql

 ⛅️ wrangler 4.92.0 (update available 4.152.0)
──────────────────────────────────────────────
Resource location: local 

Use --remote if you want to access the remote instance.

🌀 Executing on local database DB (00000000-0000-4000-8000-000000000000) from .wrangler/state/v3/d1:
🌀 To execute on your remote database, add a --remote flag to your wrangler command.
🚣 8 commands executed successfully.
[
  {
    "results": [],
    "success": true,
    "meta": {
      "duration": 0
    }
  },
  {
    "results": [],
    "success": true,
    "meta": {
      "duration": 0
    }
  },
  {
    "results": [],
    "success": true,
    "meta": {
      "duration": 0
    }
  },
  {
    "results": [],
    "success": true,
    "meta": {
      "duration": 1
    }
  },
  {
    "results": [],
    "success": true,
    "meta": {
      "duration": 0
    }
  },
  {
    "results": [],
    "success": true,
    "meta": {
      "duration": 0
    }
  },
  {
    "results": [],
    "success": true,
    "meta": {
      "duration": 0
    }
  },
  {
    "results": [],
    "success": true,
    "meta": {
      "duration": 0
    }
  }
]
```
## 07-dev-server.log
```
 GET /api/study?stats=1&tz=0&learn=de 200 in 79ms
 GET /api/study 200 in 17ms
 GET /hesabim 200 in 144ms (compile: 1792877370.7s, render: 75ms)
 POST /api/auth 200 in 28ms
 GET / 200 in 95ms (compile: 1792877370.6s, render: 72ms)
 GET /api/study 200 in 10ms
 GET /giris?return_to=%2Fhesabim 200 in 54ms (compile: 1792877370.6s, render: 43ms)
 POST /api/auth 401 in 56ms
 POST /api/auth 200 in 39ms
 GET /hesabim 200 in 60ms (compile: 1792877370.6s, render: 47ms)
 POST /api/auth 200 in 39ms
 GET / 200 in 65ms (compile: 1792877370.6s, render: 47ms)
 POST /api/auth 401 in 46ms
 GET / 200 in 87ms (compile: 1792877370.6s, render: 71ms)
 GET /giris 200 in 57ms (compile: 1792877370.6s, render: 43ms)
 GET /uye-ol 200 in 59ms (compile: 1792877370.6s, render: 47ms)
 GET /uye-ol 200 in 57ms (compile: 1792877370.6s, render: 43ms)
 GET /uye-ol 200 in 116ms (compile: 1792877370.6s, render: 99ms)
 GET /uye-ol 200 in 47ms (compile: 1792877370.6s, render: 35ms)
 GET /gizlilik 200 in 66ms (compile: 1792877370.6s, render: 54ms)
 GET /gizlilik 200 in 50ms (compile: 1792877370.6s, render: 37ms)
 GET /giris 200 in 44ms (compile: 1792877370.6s, render: 34ms)
 POST /api/auth 200 in 26ms
 GET /sifre-yenile?anahtar=bozuk 200 in 69ms (compile: 1792877370.7s, render: 30ms)
 GET /fiiller 200 in 38ms (compile: 1792877370.6s, render: 25ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 50ms
 GET /ev-esyalar 200 in 37ms (compile: 1792877370.6s, render: 26ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 24ms
 POST /api/study 401 in 10ms
 GET /api/study?stats=1&tz=0 200 in 7ms
 GET /ev-esyalar 200 in 82ms (compile: 1792877370.6s, render: 64ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 45ms
 GET /ev-esyalar 200 in 37ms (compile: 1792877370.6s, render: 27ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 38ms
 GET /a1-2/ev-ve-yasam 200 in 49ms (compile: 1792877370.6s, render: 37ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 32ms
 GET /a1-1/willkommen 200 in 44ms (compile: 1792877370.6s, render: 28ms)
 GET /a1-1/willkommen?adim=diyalog 200 in 45ms (compile: 1792877370.6s, render: 25ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 83ms
 GET / 200 in 39ms (compile: 1792877370.6s, render: 26ms)
 GET /api/study?note=tour 200 in 39ms
 POST /api/study?learn=de 200 in 28ms
 GET /api/study 200 in 16ms
 POST /api/study 201 in 40ms
 POST /api/study 200 in 37ms
 GET /api/study 200 in 17ms
 GET /fiiller 200 in 38ms (compile: 1792877370.6s, render: 29ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 137ms
 GET / 200 in 53ms (compile: 1792877370.6s, render: 37ms)
 GET /fiiller 200 in 101ms (compile: 1792877370.6s, render: 74ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 41ms
 GET /fiiller 200 in 67ms (compile: 1792877370.7s, render: 33ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 61ms
 POST /api/study?learn=de 201 in 21ms
 POST /api/study?learn=de 200 in 20ms
 POST /api/study?learn=de 200 in 22ms
 POST /api/study?learn=de 200 in 20ms
 GET /fiiller 200 in 40ms (compile: 1792877370.6s, render: 29ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 61ms
 GET /yanlislarim 200 in 62ms (compile: 1792877370.7s, render: 32ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 30ms
 POST /api/study?learn=de 201 in 31ms
 GET /fiiller?bolum=oyunlar 200 in 40ms (compile: 1792877370.6s, render: 29ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 75ms
 GET /oyunlar 200 in 141ms (compile: 1792877370.7s, render: 34ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 34ms
 GET /oyunlar 200 in 43ms (compile: 1792877370.6s, render: 32ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 47ms
 GET /oyunlar 200 in 43ms (compile: 1792877370.6s, render: 31ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 42ms
 GET /oyunlar 200 in 40ms (compile: 1792877370.6s, render: 30ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 45ms
 GET /oyunlar 200 in 121ms (compile: 1792877370.7s, render: 43ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 53ms
 GET /oyunlar 200 in 39ms (compile: 1792877370.6s, render: 26ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 67ms
 GET /oyunlar 200 in 45ms (compile: 1792877370.6s, render: 33ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 36ms
[2m9:32:04 PM[22m [36m[1m[vite][22m[39m [34m[2m(rsc)[22m[39m [32mhmr update [39m[2m/app/globals.css[22m
[2m9:32:04 PM[22m [36m[1m[vite][22m[39m [90m[2m(client)[22m[39m [32mhmr update [39m[2m/app/globals.css?direct[22m
```
## 08-smoke.log
```
curl: (7) Failed to connect to localhost port 5173 after 0 ms: Couldn't connect to server
curl: (7) Failed to connect to localhost port 5173 after 0 ms: Couldn't connect to server
curl: (7) Failed to connect to localhost port 5173 after 0 ms: Couldn't connect to server
curl: (7) Failed to connect to localhost port 5173 after 0 ms: Couldn't connect to server
Site 5. denemede acildi
GECTI  Sayfa / — HTTP 200, baslik "Goliqo", hata 0, metin: İçeriğe geç Site dili Türkçe Deutsch English العربية Українська Français Español Русский فارسی Polski Italiano Português Kurdî (Kurmancî) Shqip Română Български
GECTI  Girissiz ana sayfada tanitim ve uye ol dugmesi var
GECTI  Girissiz /ev-esyalar tadimlik olarak aciliyor — http://localhost:5173/ev-esyalar · not 1
GECTI  Girissiz /fiiller tadimlik olarak aciliyor — http://localhost:5173/fiiller · not 1
GECTI  Girissiz /a1-2/ev-ve-yasam tadimlik olarak aciliyor — http://localhost:5173/a1-2/ev-ve-yasam · not 1
GECTI  Girissiz /a1-1/willkommen tadimlik olarak aciliyor — http://localhost:5173/a1-1/willkommen · not 1
GECTI  Girissiz /hesabim giris sayfasina yonleniyor — http://localhost:5173/giris?return_to=%2Fhesabim
GECTI  Sayfa /giris — HTTP 200, baslik "Giriş yap · Goliqo", hata 0, metin: İçeriğe geç Site dili Türkçe Deutsch English العربية Українська Français Español Русский فارسی Polski Italiano Português Kurdî (Kurmancî) Shqip Română Български
GECTI  Sayfa /uye-ol — HTTP 200, baslik "Üye ol · Goliqo", hata 0, metin: İçeriğe geç Site dili Türkçe Deutsch English العربية Українська Français Español Русский فارسی Polski Italiano Português Kurdî (Kurmancî) Shqip Română Български
GECTI  Sayfa /gizlilik — HTTP 200, baslik "Gizlilik ve kişisel veriler · Goliqo", hata 0, metin: İçeriğe geç Site dili Türkçe Deutsch English العربية Українська Français Español Русский فارسی Polski Italiano Português Kurdî (Kurmancî) Shqip Română Български
GECTI  Sayfa /kullanim-kosullari — HTTP 200, baslik "Kullanım koşulları · Goliqo", hata 0, metin: İçeriğe geç Site dili Türkçe Deutsch English العربية Українська Français Español Русский فارسی Polski Italiano Português Kurdî (Kurmancî) Shqip Română Български
GECTI  Sayfa /impressum — HTTP 200, baslik "Impressum · Goliqo", hata 0, metin: İçeriğe geç Site dili Türkçe Deutsch English العربية Українська Français Español Русский فارسی Polski Italiano Português Kurdî (Kurmancî) Shqip Română Български
GECTI  Resimler onbellekte tutuluyor (public/_headers) — cache-control: no-cache — basliklar uygulanmamis olabilir
GECTI  Impressum acik, Almanca ve altbilgide baglantisi var
GECTI  Girissiz kayit istegi bos misafir cevabi aliyor, yazma 401 — {"status":200,"guest":true,"empty":true}, not HTTP 401
GECTI  Sahte kimlik basligi ise yaramiyor (yine misafir) — {"status":200,"guest":true,"empty":true}
GECTI  Uyelik: kosullar onaylanmadan hesap acilmiyor — Üye olmak için kullanım koşullarını ve gizlilik metnini kabul etmelisin.
GECTI  Uyelik: uye olunca istenen sayfaya donuluyor (/fiiller) — http://localhost:5173/fiiller
GECTI  Uyelik: oturum cerezi HttpOnly ve SameSite=Lax — httpOnly true, sameSite Lax
GECTI  Uyelik: uye kendi kayitlarini okuyabiliyor — HTTP 200
GECTI  Uyelik: Hesabim sayfasi ad ve e-postayi gosteriyor — Deneme Öğrenci · deneme-1792877426442@example.test
GECTI  Uyelik: cikis yapinca tanitim sayfasi ve kayitlar kapali — tanitim 1, kayitlar HTTP 200 misafir true
GECTI  Uyelik: yanlis sifreyle giris olmuyor — E-posta ya da şifre yanlış.
GECTI  Uyelik: dogru sifreyle giris yapinca istenen sayfaya donuluyor — http://localhost:5173/hesabim
GECTI  Uyelik: hesap silinince kayitlar gidiyor ve giris artik olmuyor — silindikten sonra giris HTTP 401
GECTI  Uyelik sayfalarinda betik hatasi yok
GECTI  Dil: / Turkce telefonda Turkce aciliyor — {"lang":"tr","dir":"ltr","h1":"Almancayı resimlerle, sesle ve küçük adımlarla öğren.","note":false}
GECTI  Dil: /giris Turkce telefonda Turkce aciliyor — {"lang":"tr","dir":"ltr","h1":"Giriş yap","note":false}
GECTI  Dil: /uye-ol Turkce telefonda Turkce aciliyor — {"lang":"tr","dir":"ltr","h1":"Ücretsiz üye ol","note":false}
GECTI  Dil: sitede olmayan telefon dilinde (Isvecce) Almanca aciliyor — {"lang":"de","h1":"Kostenlos registrieren"}
GECTI  Dil: dil paketi olan bir dil (Rusca) sunucuda da dogru — {"lang":"ru","dir":"ltr","h1":"Зарегистрироваться бесплатно","note":false}
GECTI  Dil: uye olmadan Arapca secilebiliyor (sagdan sola, cerezde kaliyor) — {"lang":"ar","dir":"rtl","h1":"إنشاء حساب مجاني","note":false}, cerez ar
GECTI  Dil: secilen dil gizlilik metninde de (ceviri notuyla) — {"lang":"ar","dir":"rtl","h1":"الخصوصية والبيانات الشخصية","note":true}
GECTI  Dil: Turkce asil metin, ceviri notu yok — {"lang":"tr","dir":"ltr","h1":"Gizlilik ve kişisel veriler","note":false}
GECTI  Sifremi unuttum: form calisiyor, cevap sayfanin dilinde — Bu adresle bir hesap varsa şifre yenileme bağlantısını gönderdik. Gelen kutunu ve istenmeyen e-posta klasörünü kontrol e
GECTI  Sifre yenileme: bozuk baglanti acikca soyleniyor, sayfa aramada cikmiyor — Bu bağlantı geçersiz ya da süresi dolmuş. Giriş sayfasından yeni bir bağlantı is · noindex, nofollow
GECTI  Uyesiz: Fiil Atolyesi'nin 1. bolumu acik, digerleri kilitli — {"banner":1,"open":1,"locked":3}
GECTI  Uyesiz: Nesne Kasasi'nda ilk grup acik — {"banner":1,"open":1}
GECTI  Uyesiz: kilitli kisim acilmiyor, kayit tutulmuyor — baslat HTTP 401, guest true
GECTI  Yerel giris taklidi — son adres http://localhost:5173/ev-esyalar
GECTI  Sayfa /ev-esyalar — HTTP 200, baslik "Nesne Kasası · Goliqo", hata 0, metin: İçeriğe geç Samstag Abend 21:30 Site dili Türkçe Deutsch English العربية Українська Français Español Русский فارسی Polski Italiano Português Kurdî (Kurmancî) Sh
GECTI  Sayfa /a1-2/ev-ve-yasam — HTTP 200, baslik "Ev ve Yaşam · Goliqo", hata 0, metin: Ana sayfa Samstag Abend 21:31 Site dili Türkçe Deutsch English العربية Українська Français Español Русский فارسی Polski Italiano Português Kurdî (Kurmancî) Shqi
GECTI  Sayfa /a1-1/willkommen — HTTP 200, baslik "Lektion 1A · Willkommen! · Goliqo", hata 0, metin: Üniteler ve konular Samstag Abend 21:31 Site dili Türkçe Deutsch English العربية Українська Français Español Русский فارسی Polski Italiano Português Kurdî (Kurm
GECTI  Lektion 1A: kapak, 22 adim ve Uniteler sayfasinda baglanti — Kapak · 1/22
GECTI  Lektion 1A: adim adresi aciliyor (diyalog, 6 satir, dinle dugmeleri)
GECTI  Uniteler: Lektion 1 karti Lektion 1A'ya acliyor
GECTI  Sayfa / — HTTP 200, baslik "Goliqo", hata 0, metin: İçeriğe geç Samstag Abend 21:31 Site dili Türkçe Deutsch English العربية Українська Français Español Русский فارسی Polski Italiano Português Kurdî (Kurmancî) Sh
GECTI  Giris yapinca ana sayfada dersler var (tanitim yok)
GECTI  Giristen sonra kayitlar okunuyor — HTTP 200
GECTI  Test oturumu basliyor (veritabanina yazma) — HTTP 201, soru obj-read-zuckerzange
GECTI  Cevap kaydediliyor ve dogru cevap donuyor — HTTP 200, dogru mu: 0
GECTI  Kayit geri okunuyor (gecmis) — cevaplanan 1/1
GECTI  Sayfa /fiiller — HTTP 200, baslik "Fiil Atölyesi · Goliqo", hata 0, metin: İçeriğe geç Samstag Abend 21:31 Site dili Türkçe Deutsch English العربية Українська Français Español Русский فارسی Polski Italiano Português Kurdî (Kurmancî) Sh
GECTI  Fiil Atolyesi sayfasinda baslik ve dort bolum var — atolye 1, bolum 4
GECTI  Telefonda tanitim sayfasi yana tasmiyor — fazla genislik 0px
BILGI  Telefon: ogrenme karti (resim, anlam, cekim) tek ekrana sigiyor — ust 92, alt 649, ekran 664
BILGI  Telefon: yeni fiilin karti acilinca fiil kendiliginden okunuyor — http://localhost:5173/sfx/tap.wav | http://localhost:5173/sfx/tap2.wav | tts:abfahren
BILGI  Telefon: test sorusu tek ekrana sigiyor — ust 183, alt 476, ekran 664
UYARI  Telefon: test sonucu ve ornek cumleler tek ekrana sigiyor — ust 99, alt 666, ekran 664
BILGI  Telefon: yazim tek ekrana sigiyor — ust 98, alt 479, ekran 664
BILGI  Telefon: yazim dolunca dugmeye basmadan kontrol ediliyor — ab|fahren · 5 kutu
BILGI  Telefon: yazimdan sonra gecmis hali sorusu (hat/ist yok) — Bu fiilin geçmiş hali (Partizip II) hangisi? · geabfahren, abgefahrt, abgefahren, abfahren
BILGI  Telefon: gecmis hali testinden sonra gecmis hali yazimi — Bu fiilin geçmiş halini (Partizip II) yaz. · adim: Geçmiş yazım
BILGI  Telefon: bolum listesinde fiiller gorunuyor — 19 fiil
BILGI  Telefon: fiil kartinda ornek cumlelerin anlami site dilinde — site dili tr, 9 anlam satiri
BILGI  Telefon: Yanlislarim bolumu var ve calisiliyor — 1 yanlis · Fiil Atölyesi1 / 1
GECTI  Eski /fiiller?bolum=oyunlar adresi /oyunlar bolumune gidiyor — http://localhost:5173/oyunlar
GECTI  Oyunlar: yedi oyun listeleniyor — 7 oyun
GECTI  Eslestirme: kartlar once acik, sonra kapaniyor — 12/12 acik → 0
GECTI  Oyunlar: her oyun telefonda aciliyor ve cevap aliyor — rain, catch, quick, search, rescue, plural
```
