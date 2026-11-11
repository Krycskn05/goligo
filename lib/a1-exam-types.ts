/**
 * A1 sınavı (the learner asked, 9 November 2026): practice exams built like the written part of the Start Deutsch 1
 * exam (Goethe / telc) from the learner's photos — 1 Hören, 2 Lesen, 3 Schreiben. Lesen (10 exams,
 * lib/a1-exam-lesen-01.ts … -10.ts) and Hören (10 exams, lib/a1-exam-hoeren-01.ts … -10.ts, added on 9 November 2026 after
 * the telc and Goethe practice sets) came first; Schreiben (10 exams, lib/a1-exam-schreiben-01.ts … -10.ts) was added on
 * 11 November 2026 — a form and a short message, solved by taps like the rest (see `SchreibenExam` below).
 *
 * Every text of an exam is German and our own (the site's people, invented places, phone numbers from the ranges kept
 * free for films, invented web addresses). Every answer is a tap: Richtig / Falsch (`r` / `f`), one of two ads
 * (`a` / `b`) or, in Hören, one of three answers (`a` / `b` / `c`). `why` is the short Turkish explanation shown in the review; its translations are
 * lib/a1-exam-packs/<language>.json by item id. Markup: `**bold**` in German texts; `*German words*` in `why`
 * (kept as they are in every language).
 */
export type TrueFalse='r'|'f';
export type AdChoice='a'|'b';
/** Hören Teil 1 and Teil 3: one of three answers. */
export type AbcChoice='a'|'b'|'c';
export type ExamAnswer=TrueFalse|AdChoice|AbcChoice;

/** The frame of an ad or a notice, like the boxes on the exam paper. */
export type Frame='solid'|'dashed'|'dotted'|'double'|'shaded'|'round'|'bold';
/** Type face of a box: a printed notice (serif) or a modern one (sans). */
export type Face='serif'|'sans';

/** A statement to mark Richtig or Falsch (Lesen Teil 1 and Teil 3). */
export type TrueFalseItem={id:string;n:number;text:string;answer:TrueFalse;why:string};
/** A worked example (Beispiel 0): shown already marked, not scored. */
export type TrueFalseExample={text:string;answer:TrueFalse};

/** A Teil 1 text: an e-mail in a mail window, a letter, or a note on paper. */
export type ReadingText={
 kind:'mail'|'letter'|'note';
 /** mail: Von / An / Betreff. */
 from?:string;to?:string;subject?:string;
 /** Paragraphs; a line starting with "- " is a list item. */
 lines:readonly string[];
 example?:TrueFalseExample;
 items:readonly TrueFalseItem[];
};

/** A small ad of Teil 2. `label` is its answer line under the box: a phone number, or a web address (`web`). */
export type Ad={frame:Frame;face?:Face;lines:readonly string[];label:string};
export type AdItem={id:string;n:number;situation:string;ads:readonly [Ad,Ad];answer:AdChoice;why:string};
export type AdExample={situation:string;ads:readonly [Ad,Ad];answer:AdChoice};
/** `ad`: „Welche Anzeige passt?“ with phone numbers (the learner's paper); `web`: „Wo finden Sie Informationen?“ with
 * web addresses (the newer practice sets). */
export type AdMode='ad'|'web';

/** A notice of Teil 3 and where it hangs ("Am Eingang einer **Bäckerei**."). */
export type Notice={frame:Frame;face?:Face;title?:string;lines:readonly string[]};
export type NoticeItem={id:string;n:number;place:string;notice:Notice;text:string;answer:TrueFalse;why:string};
export type NoticeExample={place:string;notice:Notice;text:string;answer:TrueFalse};

export type LesenExam={
 teil1:readonly [ReadingText,ReadingText];
 teil2:{mode:AdMode;example:AdExample;items:readonly AdItem[]};
 teil3:{example:NoticeExample;items:readonly NoticeItem[]};
};
/** The parts of the written exam in the order of the exam paper. */
export type ExamModule='hoeren'|'lesen'|'schreiben';
export type A1Exam={
 id:string;number:number;
 /** A few German words that say what the texts are about (on the exam card). */
 topics:string;
 lesen:LesenExam;
 /** Kept from the time before Schreiben was written; Hören and Schreiben are their own files per exam
  * (`A1HoerenExam`, `A1SchreibenExam`). */
 schreiben?:null;
};

/* ---------- Hören (the site's voices read the texts; nothing is recorded) ---------- */
/** One spoken line: who speaks (shown with the text after the exam) and the site voice that reads it (F1 … M5). A name
 * letter by letter is not read as it is written (text "K – R – Ü – G – E – R"): `say` is what the natural site voices
 * read ("Kah, Err, Üh, …"), `device` what the device voice reads when the natural voices have no clip of the line
 * ("K, R, Ü, …"). */
export type AudioLine={who:string;voice:string;text:string;say?:string;device?:string};
/** An answer of a three-way question: its words and, in Teil 1, a small picture (an emoji) like the pictures of the paper. */
export type ListenOption={text:string;icon?:string};
/** Teil 1 (short talks) and Teil 3 (phone messages): a question and three answers; heard twice. `cards`: the answers are
 * name cards — the question „Wie buchstabiert man den Namen?“, the sixth of Teil 1 in every exam (11 November 2026). */
export type ListenChoiceItem={id:string;n:number;question:string;options:readonly [ListenOption,ListenOption,ListenOption];answer:AbcChoice;cards?:true;lines:readonly AudioLine[];why:string};
export type ListenChoiceExample=Omit<ListenChoiceItem,'id'|'n'|'why'>;
/** Teil 2 (announcements): a statement to mark Richtig or Falsch; heard once. */
export type ListenTrueFalseItem={id:string;n:number;text:string;answer:TrueFalse;lines:readonly AudioLine[];why:string};
export type ListenTrueFalseExample=Omit<ListenTrueFalseItem,'id'|'n'|'why'>;
export type HoerenExam={
 teil1:{example:ListenChoiceExample;items:readonly ListenChoiceItem[]};
 teil2:{example:ListenTrueFalseExample;items:readonly ListenTrueFalseItem[]};
 teil3:{items:readonly ListenChoiceItem[]};
};
/** How often a text of a Teil is heard in the exam. */
export const HOEREN_PLAYS:Record<1|2|3,number>={1:2,2:1,3:2};
export type A1HoerenExam={id:string;number:number;topics:string;hoeren:HoerenExam};

/* ---------- Buchstabieren (a listening practice beside the ten exams, 10 November 2026) ---------- */
/** One name of the spelling practice: a short talk in which the name is said letter by letter, and three spellings that
 * differ in one spot (the item "Wie buchstabiert man den Namen?" of Hören Teil 1). `spelled`: the right name as it is
 * shown after the practice ("K – R – Ü – G – E – R"); `focus`: the letters to listen for with their German names
 * ("Ö = Öh"), shown with the answer; `tip`: a hint in the site language for this kind of trap. */
export type SpellTip='double'|'count'|'umlaut';
export type SpellItem={id:string;n:number;names:readonly [string,string,string];answer:AbcChoice;lines:readonly AudioLine[];spelled:string;focus:readonly string[];tip?:SpellTip};
export type SpellExample=Omit<SpellItem,'id'|'n'>;
/** A sheet of the practice: one example and ten names. */
export type SpellSheet={id:string;number:number;topics:string;example:SpellExample;items:readonly SpellItem[]};

/* ---------- Schreiben (the learner asked, 11 November 2026) ---------- */
/**
 * Schreiben like the exam — Teil 1: a short text about someone and a form with five missing entries; Teil 2: a short
 * message (about 30 words) with three points to write about, a greeting and an ending. Nothing here is a choice (the
 * learner, 11 November 2026: „form doldurma seçmeli olmayacak … ben yazmalıyım, özgün bir şekilde, sen hiçbir şeye
 * karışmamalısın“): the form is filled in by typing and the message is written freely, as in the exam.
 *
 * The form is marked by the page: each gap has the entries that count (`accept`: the model entry first, then other right
 * ways to write it; a small spelling slip counts too — lib/a1-exam-course.ts `checkEntry`). `why` explains a gap after
 * handing in: a label of lib/a1-exam-copy.ts (`sw_text` / `sw_infer`, five languages) filled with the line of the text
 * (`quote`). The message cannot be marked by the page: after handing in the learner sees a sample answer (`model`) and
 * marks the own message with the exam's scale — 3 points for each of the three points (1,5 when it is incomplete or
 * has mistakes), 1 for greeting and ending. 5 + 10 = 15 points, as in the exam.
 */
export type GapWhyKind='text'|'infer';
export type GapWhy={kind:GapWhyKind;quote:string};
/** A gap of the form: the entries that count (the first is the model entry shown afterwards). */
export type FormGap={id:string;n:number;accept:readonly string[];why:GapWhy};
/** A row of the form: its label and what stands there; `{1}` … `{5}` mark the gaps. */
export type FormRow={label:string;value:string};
export type SchreibenExam={
 /** `text`: who needs the form and why; `form`: the form's title. */
 teil1:{text:string;form:string;rows:readonly FormRow[];items:readonly FormGap[]};
 /** `task`: the situation; `points`: the three points to write about; `model`: a sample answer, line by line. */
 teil2:{task:string;points:readonly [string,string,string];model:readonly string[]};
};
export type A1SchreibenExam={id:string;number:number;topics:string;schreiben:SchreibenExam};
