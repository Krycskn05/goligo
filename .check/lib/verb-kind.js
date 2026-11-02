"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modalVerbs = void 0;
exports.verbKindInfo = verbKindInfo;
exports.verbKind = verbKind;
const verb_course_1 = require("./verb-course");
const verb_logic_1 = require("./verb-logic");
exports.modalVerbs = new Set(['können', 'müssen', 'dürfen', 'sollen', 'wollen', 'mögen', 'möchten']);
const inseparable = /^(be|emp|ent|er|ge|miss|ver|zer)/;
function verbKindInfo(verb) {
    const prefix = (0, verb_logic_1.verbPrefix)(verb);
    const base = verb.infinitive.slice(prefix.length);
    const stem = base.replace(/e?n$/, '');
    if (exports.modalVerbs.has(base))
        return { kind: 'modal', stemChange: false, irregularPartizip: false, changedPersons: [] };
    const forms = (0, verb_course_1.praesensPersons)(verb);
    const strip = (form) => prefix ? form.slice(0, -(prefix.length + 1)) : form;
    const dt = /[dt]$/.test(stem) || /[^aeiouäöülrhmn][mn]$/.test(stem);
    const regularEr = stem + (dt ? 'et' : 't');
    const regularDu = stem + (dt ? 'est' : /[sßxz]$/.test(stem) ? 't' : 'st');
    // ich changes only in a few verbs (wissen → ich weiß); du and er change in the strong verbs (fahren → du fährst, er fährt).
    const changedPersons = [['ich', strip(forms.ich) !== stem + 'e'], ['du', strip(forms.du) !== regularDu], ['er', strip(forms.er) !== regularEr]].filter(([, changed]) => changed).map(([person]) => person);
    const stemChange = changedPersons.length > 0;
    const regularPartizip = prefix + (inseparable.test(base) || /ieren$/.test(base) ? '' : 'ge') + stem + (dt ? 'et' : 't');
    const irregularPartizip = verb.participle !== regularPartizip;
    return { kind: stemChange || irregularPartizip ? 'irregular' : 'regular', stemChange, irregularPartizip, changedPersons };
}
function verbKind(verb) { return verbKindInfo(verb).kind; }
