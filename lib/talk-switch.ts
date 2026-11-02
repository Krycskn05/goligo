import type {Step,StepGroup} from './willkommen-course';
/** The AI talk step ("Konuş", app/talk-step.tsx) is switched off for now (the learner asked, 2 November 2026). true brings
 * the fourth tab and the step back in every lesson part (Lektion 1 A–D, Lektion 15 A); the step itself and its server
 * route stay in the code. */
export const TALK_ON=false;
export const talkStep=():Step[]=>TALK_ON?[{id:'konus',title:'Konuşma',kind:'speak'}]:[];
export const talkGroup=():StepGroup[]=>TALK_ON?[{id:'konus',label:'Konuş',ids:['konus']}]:[];
