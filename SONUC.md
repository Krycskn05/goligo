# Kurulum sonucu

- Calisma: 41108996815 / commit 6a224adf5b8072f82f2295db9b3074506f80ddb1
- Tarih (UTC): 2026-10-30 18:47

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
v24.22.1
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
Progress: resolved 640, reused 0, downloaded 29, added 0
Progress: resolved 640, reused 0, downloaded 60, added 0
Packages are hard linked from the content-addressable store to the virtual store.
  Content-addressable store is at: /home/runner/work/goligo/goligo/.sites-runtime/pnpm-store/v11
  Virtual store is at:             node_modules/.pnpm
Progress: resolved 640, reused 0, downloaded 121, added 4
Progress: resolved 640, reused 0, downloaded 187, added 12
Progress: resolved 640, reused 0, downloaded 341, added 20
Progress: resolved 640, reused 0, downloaded 458, added 30
Progress: resolved 640, reused 0, downloaded 623, added 43
✓ Lockfile passes supply-chain policies (842 entries in 8.9s)
Progress: resolved 640, reused 0, downloaded 640, added 360
Progress: resolved 640, reused 0, downloaded 640, added 640, done
.../esbuild@0.28.0/node_modules/esbuild postinstall$ node install.js
.../esbuild@0.27.3/node_modules/esbuild postinstall$ node install.js
.../node_modules/workerd postinstall$ node install.js
.../esbuild@0.18.20/node_modules/esbuild postinstall$ node install.js
.../esbuild@0.25.12/node_modules/esbuild postinstall$ node install.js
.../esbuild@0.18.20/node_modules/esbuild postinstall: Done
.../esbuild@0.28.0/node_modules/esbuild postinstall: Done
.../esbuild@0.27.3/node_modules/esbuild postinstall: Done
.../node_modules/unrs-resolver postinstall$ napi-postinstall unrs-resolver 1.11.1 check
.../esbuild@0.25.12/node_modules/esbuild postinstall: Done
.../node_modules/workerd postinstall: Done
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

Done in 11.4s using pnpm v11.25.0
```
## 03-build.log
```
$ node scripts/sounds/make-sounds.mjs && node scripts/run-framework.mjs build
Goliqo sesleri hazır: tap 0.24s, tap2 0.24s, tap3 0.24s, whoosh 0.55s, correct 0.95s, complete 1.65s, soft 0.8s, beep 0.7s, retro 0.55s, low 0.95s, cartoon 0.85s, tapWood 0.22s, tapPop 0.22s, tapDrop 0.26s, tapBell 0.4s, tapChip 0.12s, pageFlip 0.177s, pageSlide 0.48s, pageHarp 0.75s, pageBubbles 0.42s, pageChip 0.17s, correctMarimba 0.95s, correctCoin 0.62s, correctDing 1.2s, correctFanfare 0.95s, correctBubbles 0.95s, completeFanfare 1.6s, completeLevel 0.89s, completeChimes 1.65s, completeHarp 1.6s, paulHello 0.85s, paulTip 0.75s, paulHmm 0.95s, paulClap 1.55s, paulDrum 1.05s, completeMarimba 1.6s

  vinext build  (Vite 8.0.13)

[34m[1/5] analyze client references...[39m
[2Ktransforming...✓ 495 modules transformed.
rendering chunks...
[32m✓ built in 2.36s[39m
[34m[2/5] analyze server references...[39m
[2Ktransforming...✓ 355 modules transformed.
rendering chunks...
[32m✓ built in 1.13s[39m
[34m[3/5] build rsc environment...[39m
[2Ktransforming...✓ 492 modules transformed.
rendering chunks...
computing gzip size...
[32m✓ built in 2.04s[39m
[34m[4/5] build client environment...[39m
[2Ktransforming...✓ 2125 modules transformed.
rendering chunks...
computing gzip size...
[33m[33m[PLUGIN_TIMINGS] [0mYour build spent significant time in plugins. Here is a breakdown:
  - vinext:middleware-server-only (20%)
  - vinext:css-data-url (14%)
  - rsc:virtual-client-package (13%)
  - alias (11%)
  - vinext:jsx-in-js (10%)
See https://rolldown.rs/options/checks#plugintimings for more details.
[39m
[32m✓ built in 3.51s[39m
[34m[5/5] build ssr environment...[39m
[2Ktransforming...✓ 361 modules transformed.
rendering chunks...
computing gzip size...
[32m✓ built in 1.87s[39m
[0m
  Route (app)
  ┌ ƒ /                      
  ├ ƒ /a1-1/willkommen       
  ├ ƒ /a1-2/ausbildung       
  ├ ƒ /a1-2/ausbildung/hoeren
  ├ ƒ /a1-2/ev-ve-yasam      
  ├ ƒ /a1-2/wege-in-der-stadt
  ├ λ /api/auth              
  ├ λ /api/ilerleme          
  ├ λ /api/konus             
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
✔ the exercises have one right answer each, among their options (1.153144ms)
✔ after a test answer only the right answer is read — in German, never a Turkish answer, never the question (0.743449ms)
✔ a man is read by a man, a woman by a woman: every person of the lesson is one of the site's people (2.18451ms)
✔ every German text the lesson speaks is listed for the site voices (1.151952ms)
✔ scores stay in the browser and make the progress of the unit card (0.810764ms)
✔ the page: a notebook like Lektion 1 (Teil A open, B–D coming), its pictures, guest access and the menu (1.619696ms)
✔ "Bu ünitede" for Lektion 15 is in our own words, and the test listens with Omar (0.537604ms)
✔ İleri at the bottom goes on inside an exercise that shows one item at a time (the learner asked, 30 October 2026) (1.280292ms)
✔ a test or a one-at-a-time exercise left in the middle goes on where it was (30 October 2026) (2.421043ms)
✔ the steps of the open tab sit inside the blue progress bar, in every lesson (the learner chose it, 30 October 2026, option C) (8.910746ms)
✔ the site address is goliqo.com; the old ones and www go to the same page there (46.863425ms)
✔ the browser settings move once, only from the old addresses, never over newer ones (8.473579ms)
✔ visible practice choices match server selection, including empty and active review pools (732.868015ms)
✔ every ready topic has questions and supported mode pools are nonempty (32.183301ms)
✔ start, wrong explanation, correct answer, finish, history and saved progress work end to end (225.187037ms)
✔ out-of-order answers, invalid options and answers from another account are rejected (58.597403ms)
✔ question IDs, canonical answers, supported variants, audio and images stay valid (20.760725ms)
✔ retry identifiers change with practice configuration instead of resuming a different test (0.359732ms)
✔ category rounds stay inside the chosen topic and automatically cover available activity types (271.614186ms)
✔ saved vocabulary and all listening or reading texts have meanings in each helper language (27.201835ms)
✔ feedback is specific to the question rather than an unrelated topic rule (2.198838ms)
✔ A1.1 and A1.2 contain only their twenty catalogue headings (21.562162ms)
✔ written gap answers, incorrect answers, saved mode and continuation persist through the study API (57.278805ms)
✔ object picture tests retain four choices and writing includes both names and article gaps (20.473326ms)
✔ every lesson part has a talk: its partner is one of the lesson people, with a voice of their own kind (2.744136ms)
✔ the prompt: easy German, corrections in Turkish, the last turns only, and JSON back (1.324555ms)
✔ the server: members only, same origin, a daily limit, the prompt from the scenario id, Workers AI only when published (0.502779ms)
✔ the page: a Konuş tab and step after the test in every lesson part, the microphone or typing (11.40724ms)
✔ Konuş waits and stays on the lesson (30 October 2026): at least eight answers, the lesson topic only, the microphone listens until tapped (0.655304ms)
✔ the eight icons are small, sharp and see-through (3.687769ms)
✔ they are used in the header, the sound settings, the clock, the tour and Hesabım (2.132825ms)
✔ article questions are answered with the tap on der/die/das (1.45067ms)
✔ Dinle ve Bul plays the first word and every next word by itself (0.588329ms)
✔ the results screen goes back to the category that was just practised (1.590952ms)
✔ Fiiller keeps the 72 verbs of the two pages with Präsens, Perfekt and a meaning in every language (4.269476ms)
✔ every verb has choice, writing and listening exercises with new IDs only (14.221898ms)
✔ grading checks hat or ist, the umlaut and the separable prefix (0.34772ms)
✔ rounds follow the chosen group and mode, solved questions wait and the same verb never comes twice in a row (20.047851ms)
✔ every text of the page exists in every site language (6.028331ms)
✔ a Fiiller round starts, saves answers and stars, resumes and finishes through the study API (218.354885ms)
✔ Yanlışlarım: the workshop mistakes make their own round, and a right answer takes a question off the list (69.636928ms)
✔ the page is linked from home, only the correct answer is spoken, and verb audio is in the voice list (488.744935ms)
✔ sentences, form pieces and rules explain every verb (38.72408ms)
✔ the writing puzzles use sentences, the prefix choice and the | mark of separable verbs (0.742286ms)
✔ Fiil Atölyesi: four parts in book order, each verb in turn: card, meaning test, spelling, past form (14.864108ms)
✔ after an answer every person gets an example sentence: Präsens after meanings, Perfekt after Perfekt (47.602986ms)
✔ the cards say regular, irregular or modal; irregular names and forms get their own colour (2.723738ms)
✔ a part opens its verb list with what is done; a verb opens its own card (0.516325ms)
✔ letter puzzles: a wrong letter goes back and counts, hints help, a full word is checked by itself (7.883066ms)
✔ games write one pronoun for a verb, like its picture: sie for a woman, er for a man, never "sie/er" (25 October 2026) (3.93442ms)
✔ site voice manifest: normalised lookup, default voice and safe parsing (5.962879ms)
✔ an old device-voice choice moves once to the natural site voice; later choices are kept (0.431086ms)
✔ a natural clip plays when available and the device voice is the fallback (4.841334ms)
✔ when the chosen voice has no clip yet, another natural voice plays it before the device voice (1.0657ms)
✔ a clip that is still downloading keeps the chosen voice longer before another voice is tried (0.963841ms)
✔ late clip events after stop or a newer request are ignored (1.210682ms)
✔ every effect has a rendered sound, a fallback recipe and readable labels (1261.687203ms)
✔ the voice list covers each greeting, the speech pages and the deploy step (411.476083ms)
✔ 22 steps in the order of the learner's page: cover, 9 teaching steps, 9 exercises, test, talk, end ("Dikkat: aus + artikel" removed, 30 October 2026) (2.056772ms)
✔ typed answers are compared loosely; the right answer is read after a test question (0.521634ms)
✔ every German text the lesson speaks is listed for the site voices (0.739632ms)
✔ scores stay in the browser and make the progress of the unit card (0.494794ms)
✔ a man is read by a man, a woman by a woman, and two people in one step never share a voice (25 October 2026) (2.213355ms)
✔ the entry is a notebook like Lektion 11 and 12: contents with Teil A–D, Teil A on a wide spread with three tabs (25 October 2026) (3.962312ms)
✔ the page, its pictures, the units link, guest access and the menu (0.977596ms)
✔ Teil B „Ich spreche ein bisschen Deutsch.“ (25 October 2026): 24 steps, letters read by their German names, a voice per person (2.405413ms)
✔ the lesson page does not draw itself again and again (no effect that depends on the new-every-render sound object) (0.445572ms)
✔ "Bu ünitede": what units 1–3 teach, in our own words (no sentences, names or titles copied from the book) (0.527857ms)
✔ Teil C „Guten Tag!“ (25 October 2026): 26 steps, greetings by the time of day, Wie geht’s?, the verb in position 2, writing right (2.47865ms)
✔ Teil D „Ich bin neu hier.“ (25 October 2026): the comic, the summary, Alles klar? with points, and the end of Lektion 1 (2.345662ms)
✔ phone check (30 October 2026): words wrap between words, dialogue bubbles get the line, Lektion 15 card opens Teil A (1.158414ms)
✔ exercise fixes (30 October 2026): mixed word boxes, clear Sie/du rows, every right card sentence, Ä read as a long e, every finished step shows done (5.601875ms)
ℹ tests 326
ℹ suites 0
ℹ pass 326
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 10949.695545
```
## 05-voices.log
```
Doğal sesi eksik metin: 0
```
## 06-db.log
```
      "duration": 1
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

 ⛅️ wrangler 4.92.0 (update available 4.156.0)
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
 GET /ev-esyalar 200 in 41ms (compile: 1793385742.3s, render: 30ms)
 POST /api/ilerleme 200 in 23ms
 GET /api/study?stats=1&tz=0&learn=de 200 in 61ms
 GET /a1-2/ev-ve-yasam 200 in 42ms (compile: 1793385742.3s, render: 31ms)
 POST /api/ilerleme 200 in 39ms
 GET /api/study?stats=1&tz=0&learn=de 200 in 27ms
 GET /a1-1/willkommen 200 in 38ms (compile: 1793385742.3s, render: 26ms)
 POST /api/ilerleme 200 in 24ms
 GET /a1-1/willkommen?teil=b&adim=alfabe 200 in 41ms (compile: 1793385742.3s, render: 29ms)
 POST /api/ilerleme 200 in 24ms
 POST /api/ilerleme 200 in 36ms
 GET /a1-1/willkommen?teil=c&adim=befinden 200 in 48ms (compile: 1793385742.3s, render: 37ms)
 POST /api/ilerleme 200 in 27ms
 GET /a1-1/willkommen?teil=d&adim=cizgi-roman 200 in 41ms (compile: 1793385742.3s, render: 30ms)
 POST /api/ilerleme 200 in 30ms
 GET /a1-1/willkommen?adim=diyalog 200 in 56ms (compile: 1793385742.3s, render: 43ms)
 POST /api/ilerleme 200 in 35ms
 GET /a1-2/wege-in-der-stadt 200 in 41ms (compile: 1793385742.3s, render: 29ms)
 POST /api/ilerleme 200 in 23ms
 GET /a1-2/wege-in-der-stadt?adim=diyalog-amt 200 in 61ms (compile: 1793385742.3s, render: 47ms)
 POST /api/ilerleme 200 in 30ms
 POST /api/ilerleme 200 in 33ms
 GET /a1-2/wege-in-der-stadt?adim=konus 200 in 45ms (compile: 1793385742.3s, render: 34ms)
 POST /api/ilerleme 200 in 39ms
 GET /a1-2/wege-in-der-stadt?adim=konus 200 in 45ms (compile: 1793385742.3s, render: 34ms)
 POST /api/ilerleme 200 in 27ms
 POST /api/ilerleme 200 in 27ms
 GET /a1-2/wege-in-der-stadt?adim=katlar 200 in 46ms (compile: 1793385742.3s, render: 30ms)
 POST /api/ilerleme 200 in 33ms
 GET /a1-2/wege-in-der-stadt?adim=wohin 200 in 41ms (compile: 1793385742.3s, render: 28ms)
 POST /api/ilerleme 200 in 26ms
 GET /a1-2/wege-in-der-stadt?adim=rami 200 in 103ms (compile: 1793385742.4s, render: 55ms)
 POST /api/ilerleme 401 in 32ms
 POST /api/ilerleme 200 in 50ms
 GET /api/study?stats=1&tz=0&learn=de 200 in 33ms
 POST /api/ilerleme 200 in 27ms
 GET /api/study?stats=1&tz=0&learn=de 200 in 38ms
 GET / 200 in 69ms (compile: 1793385742.3s, render: 49ms)
 POST /api/ilerleme 200 in 31ms
 GET /api/study?note=tour 200 in 14ms
 POST /api/study?learn=de 200 in 30ms
 GET /api/study 200 in 15ms
 POST /api/study 201 in 33ms
 POST /api/study 200 in 16ms
 GET /api/study 200 in 14ms
 GET /fiiller 200 in 38ms (compile: 1793385742.3s, render: 28ms)
 POST /api/ilerleme 200 in 21ms
 GET /api/study?stats=1&tz=0&learn=de 200 in 53ms
 GET / 200 in 113ms (compile: 1793385742.3s, render: 95ms)
 POST /api/ilerleme 401 in 28ms
 GET /fiiller 200 in 48ms (compile: 1793385742.3s, render: 37ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 57ms
 GET /fiiller 200 in 78ms (compile: 1793385742.3s, render: 43ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 64ms
 POST /api/study?learn=de 201 in 31ms
 POST /api/study?learn=de 200 in 33ms
 POST /api/study?learn=de 200 in 19ms
 POST /api/study?learn=de 200 in 24ms
 GET /fiiller 200 in 50ms (compile: 1793385742.3s, render: 36ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 76ms
 GET /yanlislarim 200 in 72ms (compile: 1793385742.3s, render: 46ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 36ms
 GET /fiiller?bolum=oyunlar 200 in 41ms (compile: 1793385742.3s, render: 30ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 83ms
 GET /oyunlar 200 in 173ms (compile: 1793385742.4s, render: 60ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 29ms
 GET /oyunlar 200 in 50ms (compile: 1793385742.3s, render: 39ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 26ms
 GET /oyunlar 200 in 46ms (compile: 1793385742.3s, render: 30ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 33ms
 GET /oyunlar 200 in 109ms (compile: 1793385742.4s, render: 48ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 37ms
 GET /oyunlar 200 in 44ms (compile: 1793385742.3s, render: 33ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 29ms
 GET /oyunlar 200 in 39ms (compile: 1793385742.3s, render: 28ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 37ms
 GET /oyunlar 200 in 77ms (compile: 1793385742.3s, render: 47ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 25ms
[2m6:47:04 PM[22m [36m[1m[vite][22m[39m [34m[2m(rsc)[22m[39m [32mhmr update [39m[2m/app/globals.css[22m
[2m6:47:04 PM[22m [36m[1m[vite][22m[39m [90m[2m(client)[22m[39m [32mhmr update [39m[2m/app/globals.css?direct[22m
```
## 08-smoke.log
```
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
GECTI  Uyelik: Hesabim sayfasi ad ve e-postayi gosteriyor — Deneme Öğrenci · deneme-1793385821641@example.test
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
GECTI  Sayfa /ev-esyalar — HTTP 200, baslik "Nesne Kasası · Goliqo", hata 0, metin: İçeriğe geç OKT 30 Freitag Abend 30. Oktober, 18:44 Türkçe Deutsch English العربية Українська Français Español Русский فارسی Polski Italiano Português Kurdî (Ku
GECTI  Sayfa /a1-2/ev-ve-yasam — HTTP 200, baslik "Ev ve Yaşam · Goliqo", hata 0, metin: Ana sayfa OKT 30 Freitag Abend 30. Oktober, 18:45 Türkçe Deutsch English العربية Українська Français Español Русский فارسی Polski Italiano Português Kurdî (Kurm
GECTI  Sayfa /a1-1/willkommen — HTTP 200, baslik "Lektion 1 · Willkommen! · Goliqo", hata 0, metin: Üniteler ve konular OKT 30 Freitag Abend 30. Oktober, 18:45 Türkçe Deutsch English العربية Українська Français Español Русский فارسی Polski Italiano Português K
GECTI  Lektion 1: defter girisi (Teil A-D acik)
GECTI  Lektion 1A: kapak, 22 adim, dort sekme (Konus dahil) — Kapak · 1/22
GECTI  Lektion 1B: alfabe adimi aciliyor (30 harf) — 7 / 10
GECTI  Lektion 1C: Wie geht's adimi aciliyor (6 duygu) — 4 / 11
GECTI  Lektion 1D: cizgi roman adimi aciliyor (4 kare) — 1 / 5
GECTI  Lektion 1: sayfa bostayken kendini yeniden cizmiyor — 0 okuma / saniye
GECTI  Lektion 1A: adim adresi aciliyor (diyalog, 6 satir, dinle dugmeleri)
GECTI  Sayfa /a1-2/wege-in-der-stadt — HTTP 200, baslik "Lektion 15 · Wege in der Stadt · Goliqo", hata 0, metin: Üniteler ve konular OKT 30 Freitag Abend 30. Oktober, 18:45 Türkçe Deutsch English العربية Українська Français Español Русский فارسی Polski Italiano Português K
GECTI  Lektion 15: defter girisi (Teil A acik, B-D yakinda)
GECTI  Lektion 15A: kapak, 25 adim, dort sekme (Konus dahil) — Kapak · 1/25
GECTI  Lektion 15A: diyalog adimi aciliyor (pano, 15 satir, dinle dugmeleri)
GECTI  Lektion 15A: alistirmalar bitmeden Konus kilitli
GECTI  Lektion 15A: Konus adimi aciliyor (Omar'in ilk cumlesi, yazma kutusu)
GECTI  Ozel harf satiri: Almanca kutuda cikiyor, harfi yaziyor
GECTI  Lektion 15A: katlar adimi aciliyor (bina, 7 kat ve cati)
GECTI  Lektion 15A: secimler hemen kontrol ediliyor (yesil / kirmizi)
GECTI  Lektion 15A telefonda yana tasmiyor — 0 px
GECTI  Uniteler: Lektion 15 karti Lektion 15A'ya aciliyor
GECTI  Uniteler: Lektion 1 karti Lektion 1A'ya acliyor
GECTI  Sayfa / — HTTP 200, baslik "Goliqo", hata 0, metin: İçeriğe geç OKT 30 Freitag Abend 30. Oktober, 18:45 Türkçe Deutsch English العربية Українська Français Español Русский فارسی Polski Italiano Português Kurdî (Ku
GECTI  Giris yapinca ana sayfada dersler var (tanitim yok)
GECTI  Giristen sonra kayitlar okunuyor — HTTP 200
GECTI  Test oturumu basliyor (veritabanina yazma) — HTTP 201, soru obj-scene-moving-besen
GECTI  Cevap kaydediliyor ve dogru cevap donuyor — HTTP 200, dogru mu: 0
GECTI  Kayit geri okunuyor (gecmis) — cevaplanan 1/1
GECTI  Sayfa /fiiller — HTTP 200, baslik "Fiil Atölyesi · Goliqo", hata 0, metin: İçeriğe geç OKT 30 Freitag Abend 30. Oktober, 18:45 Türkçe Deutsch English العربية Українська Français Español Русский فارسی Polski Italiano Português Kurdî (Ku
GECTI  Fiil Atolyesi sayfasinda baslik ve dort bolum var — atolye 1, bolum 4
GECTI  Telefonda tanitim sayfasi yana tasmiyor — fazla genislik 0px
UYARI  Telefon: ogrenme karti (resim, anlam, cekim) tek ekrana sigiyor — ust 550, alt 1049, ekran 664
BILGI  Telefon: yeni fiilin karti acilinca fiil kendiliginden okunuyor — http://localhost:5173/sfx/tap.wav | http://localhost:5173/sfx/tap2.wav | tts:abfahren
BILGI  Telefon: test sorusu tek ekrana sigiyor — ust 175, alt 537, ekran 664
BILGI  Telefon: test sonucu ve ornek cumleler tek ekrana sigiyor — ust 98, alt 649, ekran 664
BILGI  Telefon: yazim tek ekrana sigiyor — ust 98, alt 479, ekran 664
BILGI  Telefon: yazim dolunca dugmeye basmadan kontrol ediliyor — ab|fahren · 5 kutu
BILGI  Telefon: yazimdan sonra gecmis hali sorusu (hat/ist yok) — Bu fiilin geçmiş hali (Partizip II) hangisi? · geabfahren, abgefahren, abgefahrt, abfahren
BILGI  Telefon: gecmis hali testinden sonra gecmis hali yazimi — Bu fiilin geçmiş halini (Partizip II) yaz. · adim: Geçmiş yazım
BILGI  Telefon: bolum listesinde fiiller gorunuyor — 19 fiil
BILGI  Telefon: fiil kartinda ornek cumlelerin anlami site dilinde — site dili tr, 9 anlam satiri
BILGI  Telefon: Yanlislarim bolumu var ve calisiliyor — 0 yanlis · yanlis yok
GECTI  Eski /fiiller?bolum=oyunlar adresi /oyunlar bolumune gidiyor — http://localhost:5173/oyunlar
GECTI  Oyunlar: yedi oyun listeleniyor — 7 oyun
GECTI  Eslestirme: kartlar once acik, sonra kapaniyor — 12/12 acik → 0
GECTI  Oyunlar: her oyun telefonda aciliyor ve cevap aliyor — rain, catch, quick, search, rescue, plural
```
## 08b-playwright.log
```
Selecting previously unselected package xfonts-encodings.
Preparing to unpack .../5-xfonts-encodings_1%3a1.0.5-0ubuntu3_all.deb ...
Unpacking xfonts-encodings (1:1.0.5-0ubuntu3) ...
Selecting previously unselected package xfonts-utils.
Preparing to unpack .../6-xfonts-utils_1%3a7.7+7build1_amd64v3.deb ...
Unpacking xfonts-utils (1:7.7+7build1) ...
Selecting previously unselected package xfonts-cyrillic.
Preparing to unpack .../7-xfonts-cyrillic_1%3a1.0.5+nmu1build1_all.deb ...
Unpacking xfonts-cyrillic (1:1.0.5+nmu1build1) ...
Selecting previously unselected package xfonts-scalable.
Preparing to unpack .../8-xfonts-scalable_1%3a1.0.3-1.3build1_all.deb ...
Unpacking xfonts-scalable (1:1.0.3-1.3build1) ...
Setting up fonts-wqy-zenhei (0.9.45-8build1) ...
Setting up fonts-freefont-ttf (20211204+svn4273-4build1) ...
Setting up fonts-tlwg-loma-otf (1:0.7.3-1build1) ...
Setting up xfonts-encodings (1:1.0.5-0ubuntu3) ...
Setting up fonts-ipafont-gothic (00303-23ubuntu1) ...
update-alternatives: using /usr/share/fonts/opentype/ipafont-gothic/ipag.ttf to provide /usr/share/fonts/truetype/fonts-japanese-gothic.ttf (fonts-japanese-gothic.ttf) in auto mode
Setting up fonts-unifont (1:16.0.04-1build1) ...
Setting up xfonts-utils (1:7.7+7build1) ...
Setting up xfonts-cyrillic (1:1.0.5+nmu1build1) ...
Setting up xfonts-scalable (1:1.0.3-1.3build1) ...
Processing triggers for man-db (2.13.1-1build1) ...
Not building database; man-db/auto-update is not 'true'.
Processing triggers for fontconfig (2.17.1-3ubuntu1) ...

Running kernel seems to be up-to-date.

Restarting services...

Service restarts being deferred:
 systemctl restart hosted-compute-agent.service

No containers need to be restarted.

No user sessions are running outdated binaries.

No VM guests are running outdated hypervisor (qemu) binaries on this host.
BEWARE: your OS is not officially supported by Playwright; downloading fallback build for ubuntu24.04-x64.
Downloading Chromium 140.0.7339.186 (playwright build v1193) from https://cdn.playwright.dev/dbazure/download/playwright/builds/chromium/1193/chromium-linux.zip
|                                                                                |   0% of 173.8 MiB
|■■■■■■■■                                                                        |  10% of 173.8 MiB
|■■■■■■■■■■■■■■■■                                                                |  20% of 173.8 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■                                                        |  30% of 173.8 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                                                |  40% of 173.8 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                                        |  50% of 173.8 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                                |  60% of 173.8 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                        |  70% of 173.8 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                |  80% of 173.8 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■        |  90% of 173.8 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■| 100% of 173.8 MiB
Chromium 140.0.7339.186 (playwright build v1193) downloaded to /home/runner/.cache/ms-playwright/chromium-1193
BEWARE: your OS is not officially supported by Playwright; downloading fallback build for ubuntu24.04-x64.
Downloading FFMPEG playwright build v1011 from https://cdn.playwright.dev/dbazure/download/playwright/builds/ffmpeg/1011/ffmpeg-linux.zip
|                                                                                |   0% of 2.3 MiB
|■■■■■■■■                                                                        |  10% of 2.3 MiB
|■■■■■■■■■■■■■■■■                                                                |  20% of 2.3 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■                                                        |  30% of 2.3 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                                                |  40% of 2.3 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                                        |  50% of 2.3 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                                |  60% of 2.3 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                        |  70% of 2.3 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                |  80% of 2.3 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■        |  90% of 2.3 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■| 100% of 2.3 MiB
FFMPEG playwright build v1011 downloaded to /home/runner/.cache/ms-playwright/ffmpeg-1011
BEWARE: your OS is not officially supported by Playwright; downloading fallback build for ubuntu24.04-x64.
Downloading Chromium Headless Shell 140.0.7339.186 (playwright build v1193) from https://cdn.playwright.dev/dbazure/download/playwright/builds/chromium/1193/chromium-headless-shell-linux.zip
|                                                                                |   0% of 104.3 MiB
|■■■■■■■■                                                                        |  10% of 104.3 MiB
|■■■■■■■■■■■■■■■■                                                                |  20% of 104.3 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■                                                        |  30% of 104.3 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                                                |  40% of 104.3 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                                        |  50% of 104.3 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                                |  60% of 104.3 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                        |  70% of 104.3 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                |  80% of 104.3 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■        |  90% of 104.3 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■| 100% of 104.3 MiB
Chromium Headless Shell 140.0.7339.186 (playwright build v1193) downloaded to /home/runner/.cache/ms-playwright/chromium_headless_shell-1193
```
