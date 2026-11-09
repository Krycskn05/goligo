// placeholder until the generated data is written
type Meanings=readonly [en:string,ar:string,uk:string,fr:string,es:string,ru:string,fa:string,pl:string,it:string,pt:string];
export type Spec=readonly [id:string,de:string,tr:string,description:string,descriptionTr:string,meanings:Meanings,note?:string];
export type LessonWordSet={topic:string;prefix:string;specs:readonly Spec[];phrases:readonly string[]};
export const lessonWordSets:readonly LessonWordSet[]=[];
export const lessonPlurals:Record<string,string>={};
