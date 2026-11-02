"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GUEST_L12_PART = exports.GUEST_GAMES = exports.GUEST_VERB_PART = exports.GUEST_OBJECT_GROUP = exports.GUEST_HOUSING_TOPIC = exports.GUEST_HOUSING_SECTION = void 0;
/**
 * Üye olmadan tadımlık (the learner asked, 21 October 2026): the part of each section a visitor without an account may
 * open — the first one; nothing is saved, and the rest shows "üyelere açık" with a free sign-up. Kept apart from the
 * question bank so the pages stay light; lib/guest-taste.ts checks a visitor's rounds against it on the server.
 */
exports.GUEST_HOUSING_SECTION = 'a';
exports.GUEST_HOUSING_TOPIC = 'book-11-a';
exports.GUEST_OBJECT_GROUP = 'objects-house';
/** verbFamilies[0].id (tests/guest-taste.test.cjs checks it). */
exports.GUEST_VERB_PART = 'verbs-w1';
exports.GUEST_GAMES = ['match'];
exports.GUEST_L12_PART = 'a';
