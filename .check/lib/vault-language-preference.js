"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readVaultLanguage = readVaultLanguage;
exports.saveVaultLanguage = saveVaultLanguage;
const study_languages_1 = require("./study-languages");
const object_vault_copy_1 = require("./object-vault-copy");
const device_language_1 = require("./device-language");
const sharedKey = 'german-study-language';
const vaultKey = 'german-vault-language';
/** The saved site language; `fallback` (the device language, see lib/device-language.ts) when none is saved. */
function readVaultLanguage(storage, fallback = 'de') {
    const shared = storage.getItem(sharedKey);
    try {
        const saved = JSON.parse(storage.getItem(vaultKey) ?? 'null');
        if (saved?.language && (0, object_vault_copy_1.isVaultLanguage)(saved.language)) {
            if (shared && (0, study_languages_1.isStudyLanguage)(shared) && shared !== saved.shared)
                return shared;
            return saved.language;
        }
    }
    catch { }
    return shared && (0, object_vault_copy_1.isVaultLanguage)(shared) ? shared : fallback;
}
function saveVaultLanguage(storage, language) {
    let shared = storage.getItem(sharedKey);
    if ((0, study_languages_1.isStudyLanguage)(language)) {
        storage.setItem(sharedKey, language);
        shared = language;
    }
    storage.setItem(vaultKey, JSON.stringify({ language, shared }));
    (0, device_language_1.rememberSiteLanguage)(language);
}
