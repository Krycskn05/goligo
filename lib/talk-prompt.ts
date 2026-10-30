import type {TalkScenario} from './talk-scenarios';

/**
 * The prompt and the answer of a "Konuş" role play (app/api/konus/route.ts). Pure functions, checked by tests/talk.test.cjs.
 */
export type TalkTurn={role:'partner'|'learner';text:string};
export type TalkReply={de:string;tr:string;correction:string|null;better:string|null;done:boolean};

/** At most this many turns of the conversation go to the model; a learner's line is cut at TALK_TEXT_MAX characters. */
export const TALK_HISTORY_MAX=16;
export const TALK_TEXT_MAX=300;
/** How many lines a member may send in a day (Workers AI costs a little per line). */
export const TALK_DAILY_LIMIT=120;
/** After this many learner lines the partner closes the conversation. */
export const TALK_TURNS=8;
export const TALK_MODEL='@cf/meta/llama-3.3-70b-instruct-fp8-fast';

export function talkSystemPrompt(scenario:TalkScenario){
 return [
  `You are the conversation partner in a short spoken role play for a Turkish-speaking adult who learns German at level A1. ${scenario.brief}`,
  'Rules:',
  '- Stay in your role. Speak only easy German (A1): one or two short sentences per turn, then usually one question. Use the language of the lesson.',
  '- The learner speaks into a microphone, so their text may have no punctuation or capital letters and small recognition errors: never correct punctuation, capital letters or obvious recognition errors.',
  '- If the learner\'s German has a real mistake (word, ending, article, word order), put a very short explanation in Turkish (max 12 words) into "correction" and the corrected German sentence into "better"; otherwise both are null. Do not correct the same thing twice.',
  '- If the learner writes Turkish or English or says they do not understand, answer in easier German and put a short Turkish help into "correction".',
  `- After about ${TALK_TURNS} learner turns, or when the task is done, say goodbye in German and set "done" to true.`,
  '- "tr" is the Turkish translation of your German reply.',
  'Answer only with JSON: {"de": string, "tr": string, "correction": string|null, "better": string|null, "done": boolean}.',
 ].join('\n');
}

/** The messages for the model: the system prompt, the opening line and the last turns (trimmed and cut). */
export function talkMessages(scenario:TalkScenario,history:readonly TalkTurn[]){
 const turns=history.filter(turn=>turn&&(turn.role==='partner'||turn.role==='learner')&&typeof turn.text==='string'&&turn.text.trim())
  .slice(-TALK_HISTORY_MAX).map(turn=>({role:turn.role==='partner'?'assistant' as const:'user' as const,content:turn.text.trim().slice(0,TALK_TEXT_MAX)}));
 const first=turns[0]?.role==='assistant'?[]:[{role:'assistant' as const,content:scenario.opening.de}];
 return [{role:'system' as const,content:talkSystemPrompt(scenario)},...first,...turns];
}

/** JSON schema for Workers AI JSON mode. */
export const talkReplySchema={type:'object',properties:{de:{type:'string'},tr:{type:'string'},correction:{type:['string','null']},better:{type:['string','null']},done:{type:'boolean'}},required:['de','tr','correction','better','done']} as const;

/** Reads the model's answer (an object, or a JSON text, perhaps with words around it); null when there is no German reply. */
export function parseTalkReply(raw:unknown):TalkReply|null{
 let value:unknown=raw;
 if(value&&typeof value==='object'&&'response' in (value as Record<string,unknown>))value=(value as Record<string,unknown>).response;
 if(typeof value==='string'){const text=value.trim();const start=text.indexOf('{'),end=text.lastIndexOf('}');
  if(start<0||end<=start)return text?{de:clean(text,400),tr:'',correction:null,better:null,done:false}:null;
  try{value=JSON.parse(text.slice(start,end+1));}catch{return null;}}
 if(!value||typeof value!=='object')return null;
 const data=value as Record<string,unknown>;const de=clean(data.de,400);if(!de)return null;
 const optional=(item:unknown,max:number)=>{const text=clean(item,max);return text&&text.toLowerCase()!=='null'?text:null;};
 return {de,tr:clean(data.tr,400),correction:optional(data.correction,200),better:optional(data.better,300),done:data.done===true};
}
function clean(value:unknown,max:number){return typeof value==='string'?value.replace(/\s+/g,' ').trim().slice(0,max):'';}
