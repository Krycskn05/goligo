"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mixedOrder = mixedOrder;
/**
 * A word box in mixed order (the learner asked, 30 October 2026: the box listed the words in the order of the gaps, which
 * gave the answers away). Never the written order and never the order in which the answers come; checked by
 * tests/willkommen.test.cjs. Used by the word boxes of Lektion 1 (GapExercise) and Lektion 15 (ChoiceExercise).
 */
function shuffle(list) { const out = list.slice(); for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
} return out; }
function mixedOrder(list, answers = []) {
    const asked = answers.filter((answer, i) => list.includes(answer) && answers.indexOf(answer) === i);
    const same = (order) => order.join('\u0001') === list.join('\u0001') || (asked.length > 1 && order.filter(word => asked.includes(word)).join('\u0001') === asked.join('\u0001'));
    let order = shuffle(list);
    for (let tries = 0; tries < 50 && list.length > 2 && same(order); tries++)
        order = shuffle(list);
    return order;
}
