"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.guestQuestion = guestQuestion;
exports.guestRound = guestRound;
const course_1 = require("./course");
const verb_families_1 = require("./verb-families");
const verb_workshop_1 = require("./verb-workshop");
const guest_parts_1 = require("./guest-parts");
__exportStar(require("./guest-parts"), exports);
/**
 * The server side of the guest taste (lib/guest-parts.ts): which questions and rounds a visitor without an account may
 * use. The pages that open for visitors are GUEST_PAGES in lib/member-auth.ts; app/api/study grades a visitor's answers
 * without writing anything.
 */
const verbFamily = verb_families_1.verbFamilies.find(family => family.id === guest_parts_1.GUEST_VERB_PART) ?? verb_families_1.verbFamilies[0];
const verbIds = new Set((0, verb_workshop_1.partIds)(verbFamily));
/** A question a visitor may answer: the first group of Nesne Kasası, part 1 of Fiil Atölyesi (Ev ve Yaşam is a unit:
 * members only since 3 November 2026). */
function guestQuestion(id) {
    const q = course_1.questionMap.get(id);
    if (!q)
        return false;
    return q.topic === guest_parts_1.GUEST_OBJECT_GROUP || verbIds.has(id);
}
/** The rounds a visitor may start: only those, chosen by the page (onlyIds), never the whole bank or a review. */
function guestRound(mode, topic, onlyIds) {
    const allowed = (topic === guest_parts_1.GUEST_OBJECT_GROUP && (mode === 'visual' || mode === 'write' || mode === 'listen')) || (topic === verb_workshop_1.WORKSHOP_TOPIC && mode === verb_workshop_1.WORKSHOP_MODE);
    return allowed && onlyIds.length > 0 && onlyIds.every(guestQuestion);
}
