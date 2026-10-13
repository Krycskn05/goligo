# A1.1 / A1.2 textbook category illustrations

The 20 category covers follow the uploaded textbook contents: A1.1 chapters 1–10 and A1.2 chapters 11–20. Existing original animated-film-style illustrations are reused where their subject matches the chapter. Seven new illustrations were generated with the built-in Imagegen tool, then prepared as 768×768 WebP website assets.

Final website directory: `/workspace/sites/koray-almanca/public/toon/textbook/`.

| Chapter | Final asset | Subject prompt |
| --- | --- | --- |
| 2 Berufe | `berufe.webp` | A friendly male chef wearing a tall white chef hat and teal apron, holding a wooden spoon, next to a friendly woman mechanic in orange overalls holding a wrench. Two clearly recognizable professions. |
| 6 Arbeitszeiten | `arbeitszeiten.webp` | A miniature cozy cafe counter with a friendly baker at work, a large round analog clock behind the counter, and a small blank weekly shift schedule with colored blocks. Convey working hours and a workday. |
| 10 Mit Bus und Bahn | `busbahn.webp` | A compact friendly yellow city bus beside a yellow-and-white urban metro train on a short track, with a simple transit stop pole. Clearly illustrate city bus and underground public transportation. |
| 12 Ausbildung | `ausbildung.webp` | A smiling adult learner at a small wooden study desk with an open notebook and blue pen, beside a stack of colorful textbooks and a small graduation cap. Convey vocational education and learning. |
| 14 Die Krankschreibung | `krankschreibung.webp` | A person resting under a blanket in a cozy bed, a tissue box and thermometer on the bedside table, and a blank medical certificate with a small red medical cross beside the bed. Convey sick leave; gentle and reassuring. |
| 18 Beim Amt | `amt.webp` | A friendly citizen at a municipal service counter signing a blank form with a pen, an approachable clerk across the counter, a small blue folder and calendar nearby. Convey city office paperwork and asking for help. |
| 19 Unterwegs in Deutschland | `unterwegs.webp` | A compact modern white passenger train with red stripe, a teal suitcase, a simple folded map, and a small sun peeking from behind a cloud. Convey travel in Germany, trains and weather. |

Each subject was inserted into this shared final prompt:

> Use case: stylized-concept. Asset type: German A1 textbook topic category illustration for a learning website. Primary request: [subject prompt above] Style/medium: polished original Pixar-style 3D animated film illustration, rounded forms, expressive friendly faces, tactile clay-like materials, soft warm studio light. Square centered full scene on a uniform pale ivory background matching #fff9ec, generous clean margin on every edge, eye-level three-quarter view, readable as a small category card. Color palette: teal, amber, terracotta and warm ivory. Constraints: original characters only, no fox mascot, no visible text, no letters, no numbers, no logos, no watermark, nothing cut off at the edges.

Mappings for all 20 chapter covers are in `lib/toon-topic-art.json`, under `book-01` through `book-20`. Existing course and vault image mappings remain available.
