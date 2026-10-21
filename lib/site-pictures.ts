/**
 * The learner's pictures for the parts of the site (made in ChatGPT): the home page set (public/toon/home), the
 * introduction page set (public/toon/landing), the first drawings (*-2) and the simple drawings (*-3, only for the
 * parts they fit: welcome, Nesne Kasası, Oyunlar). The learner asked to mix them so the pages do not always look the
 * same, and to change them every 30 minutes: every half hour each part shows its next picture, the parts each at
 * their own step, so the pages mix the sets.
 */
export const PART_PICTURES={
 welcome:['/toon/landing/karsilama.webp','/toon/landing/karsilama-2.webp','/toon/landing/karsilama-3.webp'],
 units:['/toon/home/units.webp','/toon/landing/uniteler.webp','/toon/landing/uniteler-2.webp'],
 vault:['/toon/home/vault.webp','/toon/landing/nesne-kasasi.webp','/toon/landing/nesne-kasasi-2.webp','/toon/landing/nesne-kasasi-3.webp'],
 verbs:['/toon/home/verbs.webp','/toon/landing/fiil-atolyesi.webp','/toon/landing/fiil-atolyesi-2.webp'],
 games:['/toon/home/games.webp','/toon/landing/oyunlar.webp','/toon/landing/oyunlar-2.webp','/toon/landing/oyunlar-3.webp'],
 mistakes:['/toon/home/mistakes.webp','/toon/landing/yanlislarim.webp','/toon/landing/yanlislarim-2.webp'],
} as const;
export type PicturePart=keyof typeof PART_PICTURES;
export type PicturePick=Record<PicturePart,string>;
/** The pictures change every 30 minutes (the learner asked). */
export const PICTURE_PERIOD_MS=30*60*1000;
/** Each part starts at its own step, so one half hour shows pictures from different sets. */
const STEP:Record<PicturePart,number>={welcome:0,units:1,vault:2,verbs:0,games:1,mistakes:2};

/** The pictures for this half hour (`now` in milliseconds, Date.now()). */
export function pickPictures(now:number=Date.now()):PicturePick{
 const slot=Math.floor(now/PICTURE_PERIOD_MS);
 const pick={} as PicturePick;
 for(const part of Object.keys(PART_PICTURES) as PicturePart[]){const list=PART_PICTURES[part];pick[part]=list[(slot+STEP[part])%list.length];}
 return pick;
}
/** Milliseconds until the pictures change next. */
export function nextPictureChange(now:number=Date.now()){return PICTURE_PERIOD_MS-now%PICTURE_PERIOD_MS;}
