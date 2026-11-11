# Kurulum sonucu

- Calisma: 43114553375 / commit 081829deaee8daacb389f9dee03b12128470cea2
- Tarih (UTC): 2026-11-11 22:52

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
v24.22.2
Preparing pnpm@11.25.0 for immediate activation...
11.25.0
```
## 02-install.log
```
? Verifying lockfile against supply-chain policies (842 entries)...
Lockfile is up to date, resolution step is skipped
Progress: resolved 1, reused 0, downloaded 0, added 0
Packages: +640
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Packages are hard linked from the content-addressable store to the virtual store.
  Content-addressable store is at: /home/runner/work/goligo/goligo/.sites-runtime/pnpm-store/v11
  Virtual store is at:             node_modules/.pnpm
Progress: resolved 640, reused 0, downloaded 44, added 8
Progress: resolved 640, reused 0, downloaded 121, added 12
Progress: resolved 640, reused 0, downloaded 249, added 24
Progress: resolved 640, reused 0, downloaded 432, added 40
Progress: resolved 640, reused 0, downloaded 639, added 119
Progress: resolved 640, reused 0, downloaded 640, added 262
✓ Lockfile passes supply-chain policies (842 entries in 6.3s)
Progress: resolved 640, reused 0, downloaded 640, added 640, done
.../node_modules/workerd postinstall$ node install.js
.../esbuild@0.27.3/node_modules/esbuild postinstall$ node install.js
.../esbuild@0.18.20/node_modules/esbuild postinstall$ node install.js
.../esbuild@0.28.0/node_modules/esbuild postinstall$ node install.js
.../esbuild@0.25.12/node_modules/esbuild postinstall$ node install.js
.../node_modules/workerd postinstall: Done
.../esbuild@0.27.3/node_modules/esbuild postinstall: Done
.../node_modules/unrs-resolver postinstall$ napi-postinstall unrs-resolver 1.11.1 check
.../esbuild@0.18.20/node_modules/esbuild postinstall: Done
.../node_modules/unrs-resolver postinstall: Done
.../esbuild@0.28.0/node_modules/esbuild postinstall: Done
.../esbuild@0.25.12/node_modules/esbuild postinstall: Done

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

Done in 8.8s using pnpm v11.25.0
```
## 03-build.log
```
[2Ktransforming...✓ 524 modules transformed.
[33m[lightningcss minify] 'highlight' is not recognized as a valid pseudo-element. Did you mean ':highlight' (pseudo-class) or is this a typo?
2662 |  .l1a-line.l1a-reading .l1a-bubble { box-shadow:0 0 0 3px var(--blue-2,#2f7fd6), 0 6px 18px rgba(47,127,214,.18); }
2663 |  /* Read-along by word ("Vurgu", 8 November 2026; app/willkommen-ui.tsx showWord): a soft blue strip behind the word b...
2664 |  ::highlight(l1a-word) { background-color:#cfe6ff; }
     |              ^
2665 |  @media (prefers-reduced-motion:reduce) { .l1a-line .l1a-bubble { transition:none; } }
2666 |  [39m
rendering chunks...
[32m✓ built in 1.77s[39m
[34m[2/5] analyze server references...[39m
[2Ktransforming...✓ 468 modules transformed.
rendering chunks...
[32m✓ built in 1.31s[39m
[34m[3/5] build rsc environment...[39m
[2Ktransforming...✓ 521 modules transformed.
[33m[lightningcss minify] 'highlight' is not recognized as a valid pseudo-element. Did you mean ':highlight' (pseudo-class) or is this a typo?
2662 |  .l1a-line.l1a-reading .l1a-bubble { box-shadow:0 0 0 3px var(--blue-2,#2f7fd6), 0 6px 18px rgba(47,127,214,.18); }
2663 |  /* Read-along by word ("Vurgu", 8 November 2026; app/willkommen-ui.tsx showWord): a soft blue strip behind the word b...
2664 |  ::highlight(l1a-word) { background-color:#cfe6ff; }
     |              ^
2665 |  @media (prefers-reduced-motion:reduce) { .l1a-line .l1a-bubble { transition:none; } }
2666 |  [39m
rendering chunks...
computing gzip size...
[32m✓ built in 1.71s[39m
[34m[4/5] build client environment...[39m
[2Ktransforming...✓ 2233 modules transformed.
rendering chunks...
computing gzip size...
[33m[33m[PLUGIN_TIMINGS] [0mYour build spent significant time in plugins. Here is a breakdown:
  - vinext:middleware-server-only (36%)
  - alias (11%)
  - rsc:virtual-client-package (10%)
  - vinext:css-data-url (7%)
  - vinext:image-imports (6%)
See https://rolldown.rs/options/checks#plugintimings for more details.
[39m
[32m✓ built in 3.20s[39m
[34m[5/5] build ssr environment...[39m
[2Ktransforming...✓ 474 modules transformed.
rendering chunks...
computing gzip size...
[32m✓ built in 2.18s[39m
[0m
  Route (app)
  ┌ ƒ /                        
  ├ ƒ /a1-1/alltag-und-freizeit
  ├ ƒ /a1-1/berufe             
  ├ ƒ /a1-1/familie            
  ├ ƒ /a1-1/orte-und-dinge     
  ├ ƒ /a1-1/willkommen         
  ├ ƒ /a1-2/ausbildung         
  ├ ƒ /a1-2/ausbildung/hoeren  
  ├ ƒ /a1-2/ev-ve-yasam        
  ├ ƒ /a1-2/wege-in-der-stadt  
  ├ ƒ /a1-sinavi               
  ├ λ /api/auth                
  ├ λ /api/ilerleme            
  ├ λ /api/konus               
  ├ λ /api/study               
  ├ λ /api/ziyaret             
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
✔ article questions are answered with the tap on der/die/das (0.987967ms)
✔ Dinle ve Bul plays the first word and every next word by itself (1.390639ms)
✔ the results screen goes back to the category that was just practised (0.78693ms)
✔ every category is under exactly one heading, in a sensible place (1.744494ms)
✔ the page: no "Tüm kelimeler" card, a heading per section (0.585216ms)
✔ the headings in every site language (170.41598ms)
✔ a normal round keeps the questions solved before in its strip, done and not asked again (0.608725ms)
✔ done questions open to look at; the current one comes back; later ones stay closed (0.191945ms)
✔ the strip texts exist in every site language (37.03296ms)
✔ the strip stays one row high and slides sideways (0.324028ms)
✔ the top: the topic, the picture strip of the verbs, "Fiil n / N", the steps as chips (0.938201ms)
✔ the question card keeps one place for the question and the result; no next button; the next question after 3 s (1.533641ms)
✔ every verb of the strip opens its card; the round waits and comes back where it was (0.652889ms)
✔ every workshop verb is in exactly one topic; the map is the six topics, the book parts stay for old rounds (1.583698ms)
✔ the matching cards of a topic use only its verbs; Oyunlar offers all verbs and every topic (1.007237ms)
✔ the page: the topics are the map; no group cards and no game left in Fiil Atölyesi (0.817754ms)
✔ every topic name and the Oyunlar chips in every site language (198.686327ms)
✔ progress by topic: what was done in the book parts, in topic rounds and by answers counts once (18.180027ms)
✔ every verb has its own meaning in all 31 languages, in the language's script (38.02506ms)
✔ every example sentence after an answer has its meaning in every language that shows one (118.650761ms)
✔ Fiiller keeps the 72 verbs of the two pages with Präsens, Perfekt and a meaning in every language (5.6531ms)
✔ every verb has choice, writing and listening exercises with new IDs only (10.473344ms)
✔ grading checks hat or ist, the umlaut and the separable prefix (0.319167ms)
✔ rounds follow the chosen group and mode, solved questions wait and the same verb never comes twice in a row (25.025071ms)
✔ every text of the page exists in every site language (18.487706ms)
✔ a Fiiller round starts, saves answers and stars, resumes and finishes through the study API (184.324488ms)
✔ Yanlışlarım: the workshop mistakes make their own round, and a right answer takes a question off the list (40.073626ms)
✔ the page is linked from home, only the correct answer is spoken, and verb audio is in the voice list (305.244121ms)
✔ sentences, form pieces and rules explain every verb (22.953857ms)
✔ the writing puzzles use sentences, the prefix choice and the | mark of separable verbs (0.601289ms)
✔ Fiil Atölyesi: six topics on the map (the four book parts only read older rounds), each verb in turn: card, meaning test, spelling, past form (19.467147ms)
✔ after an answer every person gets an example sentence: Präsens after meanings, Perfekt after Perfekt (27.75501ms)
✔ the cards say regular, irregular or modal; irregular names and forms get their own colour (1.11288ms)
✔ a part opens its verb list with what is done; a verb opens its own card (0.417577ms)
✔ letter puzzles: a wrong letter goes back and counts, hints help, a full word is checked by itself (5.837727ms)
✔ games write one pronoun for a verb, like its picture: sie for a woman, er for a man, never "sie/er" (25 October 2026) (3.301225ms)
✔ what is kept of a visit: a known page, the site name it came from, device, country, language — never the query, an IP or a cookie (2.802362ms)
✔ visits are counted per day with a key that changes every day; the IP is never stored and the old salts are deleted (62.277973ms)
✔ the panel numbers: online now, today, 7 and 30 days, pages, sources, devices, countries, languages, guests to members (22.793823ms)
✔ the signal, the endpoint, the panel and the privacy text (37.375036ms)
✔ a person who names themselves is found: full name, first name, Frau/Herr + surname, anywhere in the text (3.600913ms)
✔ the voice of a text: the person it names wins over the given speaker; otherwise the given speaker, else the chosen voice (0.754776ms)
✔ the lessons read every self-introduction with the person's own voice, and nobody borrows a voice next to its owner (13.091014ms)
✔ Lektion 12: every person of the listening texts keeps one voice in every task, of their own kind, never shared in a task (0.665754ms)
✔ the speech of every lesson uses the name rule, and Teil B reads the whole solved ending sentences (1.660507ms)
✔ the manifest lists the voices with word times; an old manifest has none (3.064493ms)
✔ a times table keeps only well-formed entries: a clip id and shares 0–1, one per word (0.481892ms)
✔ a voice's word times are fetched once, when its first clip is asked for; a voice without them costs no request (1.825065ms)
✔ the site wires the times into the player and the render script writes them (1.387586ms)
✔ the alignment helper passes its own check on a fake transcript (python3 where available) (344.05635ms)
✔ site voice manifest: normalised lookup, default voice and safe parsing (3.199278ms)
✔ an old device-voice choice moves once to the natural site voice; later choices are kept (0.316882ms)
✔ a natural clip plays when available and the device voice is the fallback (3.365567ms)
✔ when the chosen voice has no clip yet, another natural voice plays it before the device voice (0.504445ms)
✔ a clip that is still downloading keeps the chosen voice longer before another voice is tried (0.568013ms)
✔ late clip events after stop or a newer request are ignored (0.572932ms)
✔ every effect has a rendered sound, a fallback recipe and readable labels (535.423396ms)
✔ the voice list covers each greeting, the speech pages and the deploy step (275.392526ms)
✔ 22 steps in the order of the learner's page: cover, 9 teaching steps, 9 exercises, test, talk, end ("Dikkat: aus + artikel" removed, 30 October 2026) (1.288454ms)
✔ typed answers are compared loosely; the right answer is read after a test question (0.345798ms)
✔ every German text the lesson speaks is listed for the site voices (0.534976ms)
✔ scores stay in the browser and make the progress of the unit card (0.409133ms)
✔ a man is read by a man, a woman by a woman, and two people in one step never share a voice (25 October 2026) (3.376896ms)
✔ the entry is a notebook like Lektion 11 and 12: contents with Teil A–D, Teil A on a wide spread with three tabs (25 October 2026) (3.385874ms)
✔ the page, its pictures, the units link, guest access and the menu (1.177728ms)
✔ Teil B „Ich spreche ein bisschen Deutsch.“ (25 October 2026): 24 steps, letters read by their German names, a voice per person (1.951808ms)
✔ the lesson page does not draw itself again and again (no effect that depends on the new-every-render sound object) (0.382015ms)
✔ "Bu ünitede": what units 1–3 teach, in our own words (no sentences, names or titles copied from the book) (0.407018ms)
✔ Teil C „Guten Tag!“ (25 October 2026): 26 steps, greetings by the time of day, Wie geht’s?, the verb in position 2, writing right (1.979202ms)
✔ Teil D „Ich bin neu hier.“ (25 October 2026): the comic, the summary, Alles klar? with points, and the end of Lektion 1 (1.770142ms)
✔ phone check (30 October 2026): words wrap between words, dialogue bubbles get the line, Lektion 15 card opens Teil A (2.133221ms)
✔ exercise fixes (30 October 2026): mixed word boxes, clear Sie/du rows, every right card sentence, Ä read as a long e, every finished step shows done (4.755773ms)
ℹ tests 506
ℹ suites 0
ℹ pass 506
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 11455.66942
```
## 05-voices.log
```
eksik: dick ≠ dünn
eksik: groß ≠ klein
eksik: jung ≠ alt
eksik: lang ≠ kurz
eksik: neu ≠ alt
eksik: schlank ≠ dick
Doğal sesi eksik metin: 6
https://github.com/Krycskn05/goligo/actions/runs/43114709178
Ses iş akışı başlatıldı (eksik sesler üretilecek).
```
## 06-db.log
```
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
 POST /api/ziyaret 204 in 25ms
 GET /a1-1/familie 200 in 258ms (compile: 1794437263.4s, render: 228ms)
 POST /api/ilerleme 200 in 22ms
 POST /api/ziyaret 204 in 8ms
 GET /a1-1/familie?adim=aile 200 in 34ms (compile: 1794437263.3s, render: 22ms)
 POST /api/ilerleme 200 in 29ms
 POST /api/ziyaret 204 in 9ms
 GET /a1-1/alltag-und-freizeit 200 in 267ms (compile: 1794437263.4s, render: 233ms)
 POST /api/ilerleme 200 in 23ms
 POST /api/ziyaret 204 in 8ms
 GET /a1-1/alltag-und-freizeit?adim=gunluk 200 in 30ms (compile: 1794437263.3s, render: 21ms)
 POST /api/ilerleme 200 in 31ms
 POST /api/ziyaret 204 in 10ms
 GET /a1-sinavi 200 in 41ms (compile: 1794437263.3s, render: 32ms)
 POST /api/ilerleme 200 in 28ms
 POST /api/ziyaret 204 in 8ms
 GET /a1-sinavi?sinav=1&bolum=hoeren 200 in 40ms (compile: 1794437263.3s, render: 29ms)
 POST /api/ilerleme 200 in 40ms
 POST /api/ziyaret 204 in 8ms
 GET /a1-sinavi?sinav=1 200 in 86ms (compile: 1794437263.3s, render: 77ms)
 POST /api/ilerleme 200 in 19ms
 POST /api/ilerleme 200 in 34ms
 POST /api/ziyaret 204 in 8ms
 GET /a1-sinavi?sinav=1&bolum=schreiben 200 in 37ms (compile: 1794437263.3s, render: 25ms)
 POST /api/ilerleme 200 in 19ms
 POST /api/ilerleme 200 in 24ms
 POST /api/ziyaret 204 in 10ms
 GET /a1-sinavi?sinav=1&bolum=buchstabieren 200 in 32ms (compile: 1794437263.3s, render: 23ms)
 POST /api/ilerleme 200 in 20ms
 POST /api/ilerleme 200 in 22ms
 POST /api/ziyaret 204 in 8ms
 GET / 200 in 45ms (compile: 1794437263.3s, render: 32ms)
 POST /api/ilerleme 200 in 16ms
 POST /api/ilerleme 200 in 32ms
 GET /api/study?note=tour 200 in 12ms
 POST /api/study?learn=de 200 in 15ms
 POST /api/ziyaret 204 in 7ms
 GET /api/study 200 in 13ms
 POST /api/study 201 in 79ms
 POST /api/study 200 in 12ms
 GET /api/study 200 in 11ms
 GET /fiiller 200 in 39ms (compile: 1794437263.3s, render: 32ms)
 POST /api/ilerleme 200 in 21ms
 GET /api/study?stats=1&tz=0&learn=de 200 in 48ms
 POST /api/ziyaret 204 in 8ms
 GET / 200 in 62ms (compile: 1794437263.4s, render: 35ms)
 POST /api/ilerleme 401 in 15ms
 POST /api/ziyaret 204 in 14ms
 GET /fiiller 200 in 36ms (compile: 1794437263.3s, render: 26ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 37ms
 POST /api/ziyaret 204 in 17ms
 GET /fiiller 200 in 35ms (compile: 1794437263.3s, render: 24ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 37ms
 POST /api/ziyaret 204 in 12ms
 POST /api/study?learn=de 201 in 21ms
 POST /api/study?learn=de 200 in 25ms
 GET /fiiller?bolum=oyunlar 200 in 50ms (compile: 1794437263.3s, render: 26ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 45ms
 GET /oyunlar 200 in 115ms (compile: 1794437263.4s, render: 31ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 23ms
 GET /oyunlar 200 in 89ms (compile: 1794437263.3s, render: 78ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 19ms
 POST /api/ziyaret 204 in 14ms
 GET /oyunlar 200 in 39ms (compile: 1794437263.3s, render: 25ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 17ms
 POST /api/ziyaret 204 in 18ms
 GET /oyunlar 200 in 45ms (compile: 1794437263.3s, render: 33ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 22ms
 POST /api/ziyaret 204 in 13ms
 GET /oyunlar 200 in 46ms (compile: 1794437263.3s, render: 35ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 24ms
 POST /api/ziyaret 204 in 14ms
 GET /oyunlar 200 in 32ms (compile: 1794437263.3s, render: 23ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 20ms
 POST /api/ziyaret 204 in 14ms
 GET /oyunlar 200 in 45ms (compile: 1794437263.3s, render: 34ms)
 GET /api/study?stats=1&tz=0&learn=de 200 in 27ms
 POST /api/ziyaret 204 in 15ms
[2m10:52:51 PM[22m [36m[1m[vite][22m[39m [34m[2m(rsc)[22m[39m [32mhmr update [39m[2m/app/globals.css[22m
[2m10:52:51 PM[22m [36m[1m[vite][22m[39m [90m[2m(client)[22m[39m [32mhmr update [39m[2m/app/globals.css?direct[22m
```
## 08-smoke.log
```
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
GECTI  Uyesiz: Fiil Atolyesi'nin 6 konusu da acik — {"banner":1,"open":6,"locked":0}
GECTI  Uyesiz: Nesne Kasasi'nda ilk grup acik — {"banner":1,"open":1}
GECTI  Uyesiz: kilitli kisim acilmiyor, kayit tutulmuyor — baslat HTTP 401, guest true
GECTI  Yerel giris taklidi — son adres http://localhost:5173/ev-esyalar
GECTI  Sayfa /ev-esyalar — HTTP 200, baslik "Kelime Kasası · Goliqo", hata 0, metin: İçeriğe geç NOV 11 Mittwoch Nacht 11. November, 22:50 Türkçe Deutsch English العربية Українська Français Español Русский فارسی Polski Italiano Português Kurdî (
GECTI  Nesne Kasasi: Ders kelimeleri 5 kart, Yazarak Pekistir yok — {"cards":5,"modes":10,"write":0,"houseWrite":1}
GECTI  Sayfa /a1-2/ev-ve-yasam — HTTP 200, baslik "Ev ve Yaşam · Goliqo", hata 0, metin: İçeriğe geç NOV 11 Mittwoch Nacht 11. November, 22:50 Türkçe Deutsch English العربية Українська Français Español Русский فارسی Polski Italiano Português Kurdî (
GECTI  Sayfa /a1-1/willkommen — HTTP 200, baslik "Lektion 1 · Willkommen! · Goliqo", hata 0, metin: İçeriğe geç NOV 11 Mittwoch Nacht 11. November, 22:50 Türkçe Deutsch English العربية Українська Français Español Русский فارسی Polski Italiano Português Kurdî (
GECTI  Lektion 1: defter girisi (Teil A-D acik)
GECTI  Lektion 1A: kapak, 21 adim, uc sekme (Konus simdilik kapali) — Kapak · 1/21
GECTI  Lektion 1B: alfabe adimi aciliyor (30 harf) — 7 / 10
GECTI  Lektion 1C: Wie geht's adimi aciliyor (6 duygu) — 4 / 11
GECTI  Lektion 1D: cizgi roman adimi aciliyor (4 kare) — 1 / 5
GECTI  Lektion 1: sayfa bostayken kendini yeniden cizmiyor — 0 okuma / saniye
GECTI  Lektion 1A: adim adresi aciliyor (diyalog, 6 satir, dinle dugmeleri)
GECTI  Sayfa /a1-2/wege-in-der-stadt — HTTP 200, baslik "Lektion 15 · Wege in der Stadt · Goliqo", hata 0, metin: İçeriğe geç NOV 11 Mittwoch Nacht 11. November, 22:50 Türkçe Deutsch English العربية Українська Français Español Русский فارسی Polski Italiano Português Kurdî (
GECTI  Lektion 15: defter girisi (Teil A acik, B-D yakinda)
GECTI  Lektion 15A: kapak, 24 adim, uc sekme (Konus simdilik kapali) — Kapak · 1/24
GECTI  Lektion 15A: diyalog adimi aciliyor (pano, 15 satir, dinle dugmeleri)
GECTI  Lektion 15A: alistirmalar bitmeden test kilitli
GECTI  Ozel harf satiri: Almanca kutuda cikiyor, harfi yaziyor
GECTI  Lektion 15A: katlar adimi aciliyor (bina, 7 kat ve cati)
GECTI  Lektion 15A: secimler hemen kontrol ediliyor (yesil / kirmizi)
GECTI  Lektion 15A telefonda yana tasmiyor — 0 px
GECTI  Sayfa /a1-1/berufe — HTTP 200, baslik "Lektion 2 · Berufe · Goliqo", hata 0, metin: İçeriğe geç NOV 11 Mittwoch Nacht 11. November, 22:50 Türkçe Deutsch English العربية Українська Français Español Русский فارسی Polski Italiano Português Kurdî (
GECTI  Lektion 2: defter girisi (Teil A-D acik)
GECTI  Lektion 2A: kapak, 19 adim, dort sekme (Konus dahil) — Kapak · 1/19
GECTI  Lektion 2A: meslek kartlari (15 resim, her biri iki satir)
GECTI  Lektion 2B: Teil B aciliyor (6 resimli kart)
GECTI  Lektion 2C: 21 sayi ve iki el resmi
GECTI  Lektion 2D: Rami'nin formu (7 satir) ve dort sekme
GECTI  Uniteler: Lektion 15 karti Lektion 15A'ya aciliyor
GECTI  Uniteler: Lektion 1 karti Lektion 1A'ya acliyor
GECTI  Uniteler: Lektion 2 karti Lektion 2'ye aciliyor
GECTI  Uniteler: Lektion 4 karti Lektion 4'e aciliyor
GECTI  Uniteler: Lektion 5 karti Lektion 5'e aciliyor
GECTI  Sayfa /a1-1/familie — HTTP 200, baslik "Lektion 4 · Familie · Goliqo", hata 0, metin: İçeriğe geç NOV 11 Mittwoch Nacht 11. November, 22:51 Türkçe Deutsch English العربية Українська Français Español Русский فارسی Polski Italiano Português Kurdî (
GECTI  Lektion 4: defter girisi (Teil A-D acik)
GECTI  Lektion 4A: aile kartlari (18 kart) ve dort sekme
GECTI  Sayfa /a1-1/alltag-und-freizeit — HTTP 200, baslik "Lektion 5 · Alltag und Freizeit · Goliqo", hata 0, metin: İçeriğe geç NOV 11 Mittwoch Nacht 11. November, 22:51 Türkçe Deutsch English العربية Українська Français Español Русский فارسی Polski Italiano Português Kurdî (
GECTI  Lektion 5: defter girisi (Teil A-D acik)
GECTI  Lektion 5A: gunluk isler kartlari (16 kart) ve dort sekme
GECTI  Sayfa /a1-sinavi — HTTP 200, baslik "A1 sınavı · Goliqo", hata 0, metin: İçeriğe geç NOV 11 Mittwoch Nacht 11. November, 22:51 Türkçe Deutsch English العربية Українська Français Español Русский فارسی Polski Italiano Português Kurdî (
GECTI  A1 sinavi: 10 sinav, 30 kagit (Hören + Lesen + Schreiben) acik
GECTI  A1 sinavi 1 Hören: kagit aciliyor (Teil 1: ornek + 6 soru, 7 dinle dugmesi, isaretlenebilir a/b/c kutulari)
GECTI  A1 sinavi 1 Lesen: kagit aciliyor (Teil 1: ornek + 5 soru, e-posta penceresi, isaretlenebilir kutular)
GECTI  A1 sinavi 1 Schreiben: kagit aciliyor (Teil 1: form, yazilacak 5 bosluk; secenek yok; 2 Teil)
GECTI  A1 sinavi Buchstabieren 1: kagit aciliyor (ornek + 10 ad, 11 dinle dugmesi, isaretlenebilir ad kartlari)
GECTI  Sayfa / — HTTP 200, baslik "Goliqo", hata 0, metin: İçeriğe geç NOV 11 Mittwoch Nacht 11. November, 22:51 Türkçe Deutsch English العربية Українська Français Español Русский فارسی Polski Italiano Português Kurdî (
GECTI  Giris yapinca ana sayfada dersler var (tanitim yok)
GECTI  Giristen sonra kayitlar okunuyor — HTTP 200
GECTI  Test oturumu basliyor (veritabanina yazma) — HTTP 201, soru housing-11-c-word-zucker-test
GECTI  Cevap kaydediliyor ve dogru cevap donuyor — HTTP 200, dogru mu: 1
GECTI  Kayit geri okunuyor (gecmis) — cevaplanan 1/1
GECTI  Sayfa /fiiller — HTTP 200, baslik "Fiil Atölyesi · Goliqo", hata 0, metin: İçeriğe geç NOV 11 Mittwoch Nacht 11. November, 22:51 Türkçe Deutsch English العربية Українська Français Español Русский فارسی Polski Italiano Português Kurdî (
GECTI  Fiil Atolyesi sayfasinda baslik ve alti konu var — atolye 1, konu 6
GECTI  Telefonda tanitim sayfasi yana tasmiyor — fazla genislik 0px
UYARI  Telefon: ogrenme karti (resim, anlam, cekim) tek ekrana sigiyor — ust 339, alt 736, ekran 664
BILGI  Telefon: yeni fiilin karti acilinca fiil kendiliginden okunuyor — http://localhost:5173/sfx/tap.wav | http://localhost:5173/sfx/tap2.wav | tts:abfahren
UYARI  Telefon: test sorusu tek ekrana sigiyor — ust 209, alt 765, ekran 664
UYARI  Telefon: test sonucu ve ornek cumleler tek ekrana sigiyor — ust 209, alt 765, ekran 664
UYARI  Telefon: atolye adimlari — locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('.verb-result-next')

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
