import {questionMap} from './course';
import {verbFamilies} from './verb-families';
import {partIds,WORKSHOP_MODE,WORKSHOP_TOPIC,PART_ROUND_TOPIC} from './verb-workshop';
import {GUEST_OBJECT_GROUP,GUEST_VERB_PART} from './guest-parts';
export * from './guest-parts';

/**
 * The server side of the guest taste (lib/guest-parts.ts): which questions and rounds a visitor without an account may
 * use. The pages that open for visitors are GUEST_PAGES in lib/member-auth.ts; app/api/study grades a visitor's answers
 * without writing anything.
 */
const verbFamily=verbFamilies.find(family=>family.id===GUEST_VERB_PART)??verbFamilies[0];
const verbIds=new Set(partIds(verbFamily));
/** A question a visitor may answer: the first group of Nesne Kasası, topic 1 of Fiil Atölyesi (Ev ve Yaşam is a unit:
 * members only since 3 November 2026). */
export function guestQuestion(id:string){
 const q=questionMap.get(id);if(!q)return false;
 return q.topic===GUEST_OBJECT_GROUP||verbIds.has(id);
}
/** The rounds a visitor may start: only those, chosen by the page (onlyIds), never the whole bank or a review. */
export function guestRound(mode:string,topic:string,onlyIds:readonly string[]){
 const allowed=(topic===GUEST_OBJECT_GROUP&&(mode==='visual'||mode==='write'||mode==='listen'))||((topic===PART_ROUND_TOPIC||topic===WORKSHOP_TOPIC)&&mode===WORKSHOP_MODE);
 return allowed&&onlyIds.length>0&&onlyIds.every(guestQuestion);
}
