"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.talkGroup = exports.talkStep = exports.TALK_ON = void 0;
/** The AI talk step ("Konuş", app/talk-step.tsx) is switched off for now (the learner asked, 2 November 2026). true brings
 * the fourth tab and the step back in every lesson part (Lektion 1 A–D, Lektion 15 A); the step itself and its server
 * route stay in the code. */
exports.TALK_ON = false;
const talkStep = () => exports.TALK_ON ? [{ id: 'konus', title: 'Konuşma', kind: 'speak' }] : [];
exports.talkStep = talkStep;
const talkGroup = () => exports.TALK_ON ? [{ id: 'konus', label: 'Konuş', ids: ['konus'] }] : [];
exports.talkGroup = talkGroup;
