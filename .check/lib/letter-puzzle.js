"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noHints = exports.noMistakes = exports.puzzleCharacter = void 0;
exports.makeLetterPuzzle = makeLetterPuzzle;
exports.completeLetterPuzzle = completeLetterPuzzle;
exports.readPuzzleDraft = readPuzzleDraft;
exports.seededOrder = seededOrder;
exports.makeLetterBank = makeLetterBank;
exports.remainingLetterChoices = remainingLetterChoices;
exports.placedLetters = placedLetters;
exports.readLetterBankDraft = readLetterBankDraft;
exports.letterFits = letterFits;
exports.tileForLetter = tileForLetter;
exports.scoredLetterAnswer = scoredLetterAnswer;
exports.hintLimit = hintLimit;
exports.readPuzzleExtras = readPuzzleExtras;
const puzzleCharacter = (value) => Array.from(value.normalize('NFC')).filter(character => /[\p{L}\p{N}]/u.test(character));
exports.puzzleCharacter = puzzleCharacter;
function seedNumber(value) { let result = 2166136261; for (const character of value) {
    result = Math.imul(result ^ character.charCodeAt(0), 16777619);
} return result >>> 0; }
/** Stable clues for a saved question; every word retains at least one gap. */
function makeLetterPuzzle(answer, seed = answer, course = 'de') {
    const characters = Array.from(answer.normalize('NFC'));
    const visible = new Set();
    let word = [];
    let wordNumber = 0;
    function finishWord() {
        const size = word.length;
        if (!size)
            return;
        if (course === 'de' && /\s/.test(answer) && /^(der|die|das)$/i.test(word.map(index => characters[index]).join(''))) {
            word.forEach(index => visible.add(index));
            word = [];
            wordNumber++;
            return;
        }
        const target = Math.min(size - 1, Math.max(1, Math.floor(size * 0.4)));
        const anchor = /[äöüÄÖÜß]/.test(characters[word[0]]) ? word[size - 1] : word[0];
        if (target > 0)
            visible.add(anchor);
        const interior = word.filter(index => index !== anchor && !/[äöüÄÖÜß]/.test(characters[index])).sort((a, b) => seedNumber(seed + ':' + wordNumber + ':' + a) - seedNumber(seed + ':' + wordNumber + ':' + b));
        for (const index of interior) {
            if (word.filter(i => visible.has(i)).length >= target)
                break;
            visible.add(index);
        }
        word = [];
        wordNumber++;
    }
    characters.forEach((character, index) => { if (/[\p{L}\p{N}]/u.test(character))
        word.push(index);
    else
        finishWord(); });
    finishWord();
    const parts = characters.map((character, index) => ({ index, character, editable: /[\p{L}\p{N}]/u.test(character) && !visible.has(index) }));
    return { parts, editable: parts.filter(part => part.editable).map(part => part.index) };
}
function completeLetterPuzzle(puzzle, letters) {
    const filled = puzzle.editable.filter(index => (0, exports.puzzleCharacter)(letters[index] ?? '').length === 1).length;
    const complete = filled === puzzle.editable.length;
    const answer = puzzle.parts.map(part => part.editable ? (letters[part.index] ?? '') : part.character).join('');
    return { filled, complete, answer };
}
function readPuzzleDraft(puzzle, key) {
    try {
        const data = JSON.parse(localStorage.getItem(key) ?? '{}');
        const result = {};
        for (const index of puzzle.editable) {
            const letter = typeof data?.[index] === 'string' ? (0, exports.puzzleCharacter)(data[index]) : [];
            if (letter.length === 1)
                result[index] = letter[0];
        }
        return result;
    }
    catch {
        return {};
    }
}
function seededOrder(items, seed) { const result = [...items]; let state = seedNumber(seed) || 1; for (let i = result.length - 1; i > 0; i--) {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    const j = (state >>> 0) % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
} return result; }
function makeLetterBank(puzzle, seed, _course = 'de') {
    // Keep required token IDs stable for saved drafts; only surplus tiles go away.
    const required = puzzle.editable.map(index => puzzle.parts[index].character);
    return seededOrder(required.map((letter, index) => ({ id: 'tile-' + index, letter })), seed + ':bank');
}
/** One compact choice per remaining letter, retaining its actual token count. */
function remainingLetterChoices(bank, placements) {
    const used = new Set(Object.values(placements));
    const groups = new Map();
    for (const token of bank) {
        let group = groups.get(token.letter);
        if (!group) {
            group = { id: '', letter: token.letter, count: 0 };
            groups.set(token.letter, group);
        }
        if (used.has(token.id))
            continue;
        if (group.count === 0)
            group.id = token.id;
        group.count++;
    }
    return [...groups.values()].filter(group => group.count > 0);
}
function placedLetters(placements, bank) { const byId = new Map(bank.map(token => [token.id, token.letter])); return Object.fromEntries(Object.entries(placements).flatMap(([index, id]) => byId.has(id) ? [[index, byId.get(id)]] : [])); }
function readLetterBankDraft(puzzle, bank, key) {
    try {
        const data = JSON.parse(localStorage.getItem(key) ?? '{}');
        const slots = data?.version === 2 || data?.version === 3 ? data.slots : null;
        const result = {};
        const used = new Set();
        for (const index of puzzle.editable) {
            const token = slots ? bank.find(item => item.id === slots[index]) : bank.find(item => item.letter.toLocaleLowerCase('de') === String(data?.[index] ?? '').toLocaleLowerCase('de') && !used.has(item.id));
            if (token && !used.has(token.id)) {
                result[index] = token.id;
                used.add(token.id);
            }
        }
        return result;
    }
    catch {
        return {};
    }
}
/** Whether a letter belongs in a box (case only counts when the answer is case-strict). */
function letterFits(puzzle, index, letter, strictCase = false, course = 'de') {
    const target = puzzle.parts[index]?.character ?? '';
    return strictCase ? letter === target : letter.toLocaleLowerCase(course) === target.toLocaleLowerCase(course);
}
/** The tile to place for a letter: the exact letter first, then the same letter in the other case. */
function tileForLetter(choices, letter, course = 'de') {
    return choices.find(choice => choice.letter === letter) ?? choices.find(choice => choice.letter.toLocaleLowerCase(course) === letter.toLocaleLowerCase(course));
}
exports.noMistakes = { count: 0, first: null, boxes: [] };
function scoredLetterAnswer(puzzle, letters, mistakes) {
    return puzzle.parts.map(part => mistakes.first && part.index === mistakes.first.index ? mistakes.first.letter : part.editable ? (letters[part.index] ?? '') : part.character).join('');
}
/** Hints place the next right letter; about a third of the boxes (at least one) can be helped. */
function hintLimit(puzzle) { return Math.max(1, Math.floor(puzzle.editable.length / 3)); }
exports.noHints = { used: 0, boxes: [] };
/** Mistakes and hints saved with the draft, so leaving and coming back keeps them. */
function readPuzzleExtras(puzzle, key) {
    try {
        const data = JSON.parse(localStorage.getItem(key) ?? '{}');
        if (data?.version !== 3)
            return { mistakes: exports.noMistakes, hints: exports.noHints };
        const inPuzzle = (value) => typeof value === 'number' && puzzle.editable.includes(value);
        const m = data.mistakes ?? {};
        const first = m.first && inPuzzle(m.first.index) && typeof m.first.letter === 'string' && (0, exports.puzzleCharacter)(m.first.letter).length === 1 ? { index: m.first.index, letter: (0, exports.puzzleCharacter)(m.first.letter)[0] } : null;
        const mistakes = { count: first ? Math.max(1, Number(m.count) || 1) : 0, first, boxes: Array.isArray(m.boxes) ? m.boxes.filter(inPuzzle) : [] };
        const h = data.hints ?? {};
        const hints = { used: Math.min(hintLimit(puzzle), Math.max(0, Number(h.used) || 0)), boxes: Array.isArray(h.boxes) ? h.boxes.filter(inPuzzle) : [] };
        return { mistakes, hints };
    }
    catch {
        return { mistakes: exports.noMistakes, hints: exports.noHints };
    }
}
