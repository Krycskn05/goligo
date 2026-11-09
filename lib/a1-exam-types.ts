/**
 * A1 sınavı (the learner asked, 9 November 2026): practice exams built like the written part of the Start Deutsch 1
 * exam (Goethe / telc) from the learner's photos — 1 Hören, 2 Lesen, 3 Schreiben. Lesen is written (10 exams,
 * lib/a1-exam-lesen-01.ts … -10.ts); Hören and Schreiben come later from new photos, so an exam has a place for them
 * (`hoeren`, `schreiben`) that stays empty for now.
 *
 * Every text of an exam is German and our own (the site's people, invented places, phone numbers from the ranges kept
 * free for films, invented web addresses). Every answer is a tap: Richtig / Falsch (`r` / `f`) or one of two ads
 * (`a` / `b`). `why` is the short Turkish explanation shown in the review; its translations are
 * lib/a1-exam-packs/<language>.json by item id. Markup: `**bold**` in German texts; `*German words*` in `why`
 * (kept as they are in every language).
 */
export type TrueFalse='r'|'f';
export type AdChoice='a'|'b';
export type ExamAnswer=TrueFalse|AdChoice;

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
 /** Not written yet: the learner sends the Hören photos later; Schreiben comes later too. */
 hoeren?:null;schreiben?:null;
};
