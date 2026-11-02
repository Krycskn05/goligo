"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAnswerFeedbackPlayer = createAnswerFeedbackPlayer;
/** One submitted answer: finish its effect, then pronounce its correct form. */
function createAnswerFeedbackPlayer(sound, speech, onCueChange) {
    let generation = 0;
    let waiting = false;
    function update(value) { waiting = value; onCueChange(value); }
    function stop() {
        generation++;
        // Invalidate the callback before cancelling either audio source.
        sound.stop();
        speech.stop();
        update(false);
    }
    function answer(correct, correctText) {
        stop();
        const token = generation;
        update(true);
        // Run before any timer, promise or effect completion loses the tap gesture.
        speech.prepare();
        sound.prepare();
        const after = () => {
            if (token !== generation || !waiting)
                return;
            // Speech enters its loading state before we release the effect lock.
            // This also works when effects are muted or unavailable.
            try {
                if (correctText.trim())
                    speech.speak(correctText);
            }
            finally {
                update(false);
            }
        };
        if (correct)
            sound.correct(after);
        else
            sound.wrong(after);
    }
    return { answer, stop, complete: () => { stop(); sound.complete(); }, isWaiting: () => waiting };
}
