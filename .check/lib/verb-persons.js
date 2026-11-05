"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.personSentenceVerbs = exports.personLabel = exports.personKeys = void 0;
exports.personMode = personMode;
exports.personSentences = personSentences;
exports.conjugationRows = conjugationRows;
exports.learnSpeech = learnSpeech;
exports.workshopSpeechTexts = workshopSpeechTexts;
const verb_course_1 = require("./verb-course");
const verb_logic_1 = require("./verb-logic");
const verb_examples_json_1 = __importDefault(require("./verb-examples.json"));
exports.personKeys = ['ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'sie-plural', 'Sie'];
const exampleSets = verb_examples_json_1.default;
/** The person as an object instead of the subject: gefallen, leid|tun, weh|tun, scheinen (dative), gelten (für + accusative). */
const objectModes = { gefallen: 'dative', leidtun: 'dative', wehtun: 'dative', scheinen: 'dative', gelten: 'fuer' };
const datives = { ich: ['mir'], du: ['dir'], er: ['ihm'], sie: ['ihr'], es: ['ihm', 'dem'], wir: ['uns'], ihr: ['euch'], 'sie-plural': ['ihnen'], Sie: ['Ihnen'] };
const accusatives = { ich: ['mich'], du: ['dich'], er: ['ihn'], sie: ['sie'], es: ['es', 'das'], wir: ['uns'], ihr: ['euch'], 'sie-plural': ['sie'], Sie: ['Sie'] };
/** Which form of the verb a person takes: er/sie/es share one, wir/sie/Sie share one. */
const formOf = { ich: 'ich', du: 'du', er: 'er', sie: 'er', es: 'er', wir: 'wir', ihr: 'ihr', 'sie-plural': 'wir', Sie: 'wir' };
const helpers = { hat: { ich: 'habe', du: 'hast', er: 'hat', wir: 'haben', ihr: 'habt' }, ist: { ich: 'bin', du: 'bist', er: 'ist', wir: 'sind', ihr: 'seid' } };
/** The finite verb of the object verbs: it agrees with the thing (gefällt/gefallen), not with the person. */
const objectFinite = { gefallen: ['gefällt', 'gefallen'], leidtun: ['tut', 'tun'], wehtun: ['tut', 'tun'], scheinen: ['scheint', 'scheinen'], gelten: ['gilt', 'gelten'] };
/** The label of the row: the pronoun as the learner says it (sie-plural shows as "sie"). */
const personLabel = (key) => key === 'sie-plural' ? 'sie' : key;
exports.personLabel = personLabel;
/** Whether the person is the subject (most verbs) or an object (gefallen, leid|tun: dative; gelten: für + accusative). */
function personMode(verb) { return objectModes[verb.id] ?? 'subject'; }
const lower = (word) => word.toLocaleLowerCase('de');
/** Marks the verb, the end (prefix or Partizip) and, for the object verbs, the person in a written sentence. */
function sentenceParts(verb, person, tense, sentence) {
    const mark = /[.?!]$/.test(sentence) ? sentence.slice(-1) : '';
    const words = sentence.slice(0, mark ? -1 : undefined).trim().split(/\s+/);
    const roles = words.map(() => 'plain');
    const markFirst = (role, matches) => { const at = words.findIndex((word, i) => roles[i] === 'plain' && matches(word, i)); if (at >= 0)
        roles[at] = role; return at; };
    const last = words.length - 1;
    const mode = personMode(verb);
    if (mode === 'subject') {
        const form = formOf[person];
        if (tense === 'praesens') {
            const [finite, prefix] = (0, verb_course_1.praesensPersons)(verb)[form].split(' ');
            if (prefix && lower(words[last]) === lower(prefix))
                roles[last] = 'end';
            markFirst('verb', word => lower(word) === lower(finite));
        }
        else {
            if (lower(words[last]) === lower(verb.participle))
                roles[last] = 'end';
            const aux = [helpers[verb.aux][form], ...(verb.alsoIst ? [helpers.ist[form]] : [])];
            markFirst('verb', word => aux.includes(lower(word)));
        }
    }
    else {
        if (tense === 'praesens') {
            const prefix = (0, verb_logic_1.verbPrefix)(verb);
            if (prefix && lower(words[last]) === prefix)
                roles[last] = 'end';
            markFirst('verb', word => objectFinite[verb.id].includes(lower(word)));
        }
        else {
            if (lower(words[last]) === lower(verb.participle))
                roles[last] = 'end';
            markFirst('verb', word => ['hat', 'haben'].includes(lower(word)));
        }
        const objects = (mode === 'dative' ? datives : accusatives)[person];
        const at = mode === 'dative' ? markFirst('person', word => objects.includes(word)) : markFirst('person', (word, i) => i > 0 && lower(words[i - 1]) === 'für' && objects.includes(word));
        // "dem Kind" / "für das Kind": the noun belongs to the person too.
        if (at >= 0 && (words[at] === 'dem' || words[at] === 'das') && roles[at + 1] === 'plain')
            roles[at + 1] = 'person';
    }
    const parts = [];
    words.forEach((word, i) => { const previous = parts[parts.length - 1]; if (previous && previous.role === roles[i])
        previous.text += ' ' + word;
    else
        parts.push({ text: word, role: roles[i] }); });
    return { parts, mark };
}
/** Nine sentences, one for each person, in the order ich, du, er, sie, es, wir, ihr, sie, Sie; each one says something different. */
function personSentences(verb, tense) {
    const set = exampleSets[verb.id];
    if (!set)
        return [];
    const list = set[tense === 'praesens' ? 0 : 1];
    return exports.personKeys.map((person, index) => { const text = list[index]; return { person, index, text, ...sentenceParts(verb, person, tense, text) }; });
}
exports.personSentenceVerbs = Object.keys(exampleSets);
/** The Präsens table of the learning card: the label, the form, and what is read aloud (pronoun + form). */
function conjugationRows(verb) {
    const f = (0, verb_course_1.praesensPersons)(verb);
    const third = (0, verb_course_1.spokenSubject)(verb);
    return [{ pronoun: 'ich', form: f.ich, spoken: 'ich ' + f.ich }, { pronoun: 'du', form: f.du, spoken: 'du ' + f.du }, { pronoun: 'er/sie/es', form: f.er, spoken: third + ' ' + f.er },
        { pronoun: 'wir', form: f.wir, spoken: 'wir ' + f.wir }, { pronoun: 'ihr', form: f.ihr, spoken: 'ihr ' + f.ihr }, { pronoun: 'sie/Sie', form: f.wir, spoken: 'sie ' + f.wir }];
}
/** What the speaker button of a learning card reads: the infinitive, or er/es with the Präsens or Perfekt. */
function learnSpeech(verb, stage) {
    const subject = (0, verb_course_1.spokenSubject)(verb);
    return stage === 'praesens' ? subject + ' ' + verb.praesens : stage === 'perfekt' ? subject + ' ' + verb.perfekt : verb.infinitive;
}
/** Every German text the Fiil Atölyesi cards read aloud. The voice list renders a natural clip for each,
 * so they play on every phone (the device voice is only the fallback). */
function workshopSpeechTexts() {
    const texts = new Set();
    for (const verb of verb_course_1.verbs) {
        for (const stage of ['meaning', 'praesens', 'perfekt'])
            texts.add(learnSpeech(verb, stage));
        for (const row of conjugationRows(verb))
            texts.add(row.spoken);
        for (const tense of ['praesens', 'perfekt'])
            for (const row of personSentences(verb, tense))
                texts.add(row.text);
    }
    return [...texts];
}
