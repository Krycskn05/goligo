/**
 * Üye olmadan tadımlık (the learner asked, 21 October 2026): the part of each section a visitor without an account may
 * open — the first one; nothing is saved, and the rest shows "üyelere açık" with a free sign-up. Kept apart from the
 * question bank so the pages stay light; lib/guest-taste.ts checks a visitor's rounds against it on the server.
 */
export const GUEST_HOUSING_SECTION='a';
export const GUEST_HOUSING_TOPIC='book-11-a';
export const GUEST_OBJECT_GROUP='objects-house';
/** verbFamilies[0].id (tests/guest-taste.test.cjs checks it). */
export const GUEST_VERB_PART='verbs-w1';
export const GUEST_GAMES:readonly string[]=['match'];
export const GUEST_L12_PART='a';
