"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureAudioSession = configureAudioSession;
/** Prefer media playback on devices that expose the optional Audio Session API. */
function configureAudioSession() {
    if (typeof navigator === 'undefined')
        return;
    try {
        const session = navigator.audioSession;
        if (session && session.type !== 'playback')
            session.type = 'playback';
    }
    catch { }
}
