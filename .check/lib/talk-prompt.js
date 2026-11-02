"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.talkReplySchema = exports.talkHelpLanguage = exports.TALK_HELP_LANGUAGES = exports.TALK_MODEL = exports.TALK_TURNS = exports.TALK_DAILY_LIMIT = exports.TALK_TEXT_MAX = exports.TALK_HISTORY_MAX = void 0;
exports.talkSystemPrompt = talkSystemPrompt;
exports.talkMessages = talkMessages;
exports.talkDone = talkDone;
exports.parseTalkReply = parseTalkReply;
/** At most this many turns of the conversation go to the model; a learner's line is cut at TALK_TEXT_MAX characters. */
exports.TALK_HISTORY_MAX = 16;
exports.TALK_TEXT_MAX = 300;
/** How many lines a member may send in a day (Workers AI costs a little per line). */
exports.TALK_DAILY_LIMIT = 120;
/** After this many learner lines the partner closes the conversation. */
exports.TALK_TURNS = 8;
exports.TALK_MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';
/** The languages a learner may get the translation and the notes in (the lesson's language; Turkish when unknown). */
exports.TALK_HELP_LANGUAGES = { tr: 'Turkish', en: 'English', ar: 'Arabic', uk: 'Ukrainian' };
const talkHelpLanguage = (value) => typeof value === 'string' && Object.prototype.hasOwnProperty.call(exports.TALK_HELP_LANGUAGES, value) ? value : 'tr';
exports.talkHelpLanguage = talkHelpLanguage;
function talkSystemPrompt(scenario, learnerTurns = 0, language = 'tr') {
    const turn = learnerTurns + 1;
    const help = exports.TALK_HELP_LANGUAGES[language];
    return [
        `You are the conversation partner in a short spoken role play for a ${help}-speaking adult who learns German at level A1. ${scenario.brief}`,
        'Rules:',
        '- Stay in your role and in this situation. Talk ONLY about the topic of this lesson (the situation above). Never start another topic (work, hobbies, family, weather, food, travel …). If the learner talks about something else, answer in one short sentence and come back to the lesson topic with a question.',
        '- Use only the German of this lesson: the words and sentence patterns listed under "Language taught" and the learner\'s own words. No other verbs, tenses or difficult words. One or two short sentences per turn, then exactly one question from the lesson.',
        `- The learner must speak at least ${exports.TALK_TURNS} times. This is the learner's turn ${turn} of ${exports.TALK_TURNS}. ${turn < exports.TALK_TURNS ? 'Do NOT say goodbye yet and set "done" to false: always end with a new question about the lesson topic (ask the lesson questions you have not asked yet, ask again in another way, ask the learner to spell a word, or ask about another person in the course).' : 'Now thank the learner, say goodbye with a phrase of the lesson and set "done" to true.'}`,
        '- The learner speaks into a microphone, so their text may have no punctuation or capital letters and small recognition errors: never correct punctuation, capital letters or obvious recognition errors.',
        `- If the learner's German has a real mistake (word, ending, article, word order, a missing word such as "und"), put a very short explanation in ${help} (max 12 words) into "correction" and the corrected German sentence into "better"; otherwise both are null. Do not correct the same thing twice.`,
        `- If you do not understand the learner, say "Wie bitte?" and ask your last question again in easier words. If the learner writes ${language === 'en' || language === 'tr' ? 'Turkish or English' : help + ', Turkish or English'} or says they do not understand, answer in easier German and put a short ${help} help into "correction".`,
        `- "tr" is the ${help} translation of your WHOLE German reply (every sentence).`,
        'Answer only with JSON: {"de": string, "tr": string, "correction": string|null, "better": string|null, "done": boolean}.',
    ].join('\n');
}
/** The messages for the model: the system prompt, the opening line and the last turns (trimmed and cut). */
function talkMessages(scenario, history, language = 'tr') {
    const real = history.filter(turn => turn && (turn.role === 'partner' || turn.role === 'learner') && typeof turn.text === 'string' && turn.text.trim());
    const learnerTurns = Math.max(0, real.filter(turn => turn.role === 'learner').length - 1);
    const turns = real.slice(-exports.TALK_HISTORY_MAX).map(turn => ({ role: turn.role === 'partner' ? 'assistant' : 'user', content: turn.text.trim().slice(0, exports.TALK_TEXT_MAX) }));
    const first = turns[0]?.role === 'assistant' ? [] : [{ role: 'assistant', content: scenario.opening.de }];
    return [{ role: 'system', content: talkSystemPrompt(scenario, learnerTurns, language) }, ...first, ...turns];
}
/** The conversation never ends before the learner has spoken TALK_TURNS times (the learner asked, 30 October 2026: it
 * ended after three answers), whatever the model says. */
function talkDone(history, modelDone) {
    return modelDone && history.filter(turn => turn && turn.role === 'learner' && typeof turn.text === 'string' && turn.text.trim()).length >= exports.TALK_TURNS;
}
/** JSON schema for Workers AI JSON mode. */
exports.talkReplySchema = { type: 'object', properties: { de: { type: 'string' }, tr: { type: 'string' }, correction: { type: ['string', 'null'] }, better: { type: ['string', 'null'] }, done: { type: 'boolean' } }, required: ['de', 'tr', 'correction', 'better', 'done'] };
/** Reads the model's answer (an object, or a JSON text, perhaps with words around it); null when there is no German reply. */
function parseTalkReply(raw) {
    let value = raw;
    if (value && typeof value === 'object' && 'response' in value)
        value = value.response;
    if (typeof value === 'string') {
        const text = value.trim();
        const start = text.indexOf('{'), end = text.lastIndexOf('}');
        if (start < 0 || end <= start)
            return text ? { de: clean(text, 400), tr: '', correction: null, better: null, done: false } : null;
        try {
            value = JSON.parse(text.slice(start, end + 1));
        }
        catch {
            return null;
        }
    }
    if (!value || typeof value !== 'object')
        return null;
    const data = value;
    const de = clean(data.de, 400);
    if (!de)
        return null;
    const optional = (item, max) => { const text = clean(item, max); return text && text.toLowerCase() !== 'null' ? text : null; };
    return { de, tr: clean(data.tr, 400), correction: optional(data.correction, 200), better: optional(data.better, 300), done: data.done === true };
}
function clean(value, max) { return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, max) : ''; }
