"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchesPracticeMode = void 0;
exports.buildWritingQuestions = buildWritingQuestions;
exports.writingFamily = writingFamily;
/** Separate retrieval tasks keep previous choice answers and session IDs intact. */
function buildWritingQuestions(source) {
    const generated = source.flatMap(q => {
        if (!q.options || q.objectId)
            return [];
        if (/_{3,}/.test(q.prompt)) {
            return [{ id: 'reinforce-gap-' + q.id, topic: q.topic, kind: 'write', prompt: 'Boşluğu tamamla: ' + q.prompt, gap: q.prompt, writingTask: 'gap', answer: q.answer, answerTr: q.answerTr, explanation: q.explanation, ...(q.accepted ? { accepted: q.accepted } : {}) }];
        }
        if (/^(?:lvl-.+|bookq-\d+)-word-/.test(q.id) && q.answerTr) {
            return [{ id: 'reinforce-word-' + q.id, topic: q.topic, kind: 'write', prompt: 'Almanca kelimeyi veya ifadeyi yaz.', writingTask: 'word', answer: q.answer, answerTr: q.answerTr, explanation: q.explanation }];
        }
        return [];
    });
    const celebrationGaps = source.some(q => q.topic === 'book-20') ? [
        { id: 'reinforce-book-20-gap-du', topic: 'book-20', kind: 'write', writingTask: 'gap', prompt: 'Boşluğu tamamla.', gap: '___ bitte ein Geschenk! (kaufen · du)', answer: 'Kauf', explanation: 'du için kaufen fiilinin emir biçimi Kauf! olur. Kauf bitte ein Geschenk! = Lütfen bir hediye al!' },
        { id: 'reinforce-book-20-gap-ihr', topic: 'book-20', kind: 'write', writingTask: 'gap', prompt: 'Boşluğu tamamla.', gap: '___ bitte morgen! (kommen · ihr)', answer: 'Kommt', explanation: 'ihr için emir biçimi Kommt! olur. Kommt bitte morgen! = Lütfen yarın gelin!' },
        { id: 'reinforce-book-20-gap-wen', topic: 'book-20', kind: 'write', writingTask: 'gap', prompt: 'Boşluğu tamamla.', gap: '___ besuchst du heute? (bir kişiyi sor)', answer: 'Wen', explanation: 'Bir kişiyi Akkusativ nesne olarak sormak için wen kullanılır: Wen besuchst du heute? = Bugün kimi ziyaret ediyorsun?' },
        { id: 'reinforce-book-20-gap-doch', topic: 'book-20', kind: 'write', writingTask: 'gap', prompt: 'Boşluğu tamamla.', gap: 'Kommst du nicht? — ___, ich komme!', answer: 'Doch', explanation: 'Olumsuz soruya olumlu cevap verirken doch kullanılır: Gelmiyor musun? — Geliyorum!' },
    ] : [];
    return [...generated, ...celebrationGaps];
}
const matchesPracticeMode = (q, mode) => mode === 'test' ? !!q.options : mode === 'listen' ? !!q.audio : q.kind === 'write' && !q.options && !q.sceneFind;
exports.matchesPracticeMode = matchesPracticeMode;
function writingFamily(q) { return q.gap || /_{3,}/.test(q.prompt) ? 'gap' : q.practice === 'dictation' || q.audio && !q.practice ? 'dictation' : q.writingTask === 'word' || q.objectId ? 'word' : 'sentence'; }
