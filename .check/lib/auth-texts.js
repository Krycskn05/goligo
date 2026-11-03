"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountTexts = exports.authFormTexts = exports.resetFormTexts = exports.forgotFormTexts = exports.RESET_FORM_KEYS = exports.FORGOT_FORM_KEYS = exports.ACCOUNT_KEYS = exports.AUTH_FORM_KEYS = void 0;
const public_copy_1 = require("./public-copy");
const copy_fill_1 = require("./copy-fill");
/**
 * The texts of the sign in / sign up form and of Hesabım. The server picks them in the page's language and hands them
 * to the form, so the browser needs no language pack; the membership service's messages arrive as codes
 * (app/api/auth) and the form shows them with these texts (authMessage in lib/copy-fill.ts).
 */
exports.AUTH_FORM_KEYS = ['nameLabel', 'emailLabel', 'passwordLabel', 'hidePassword', 'showPassword', 'passwordHelp', 'acceptText', 'genericError', 'offline', 'register', 'signIn', ...copy_fill_1.AUTH_CODES];
exports.ACCOUNT_KEYS = ['myAccount', 'memberSince', 'backToLessons', 'signOut', 'nameLabel', 'displayName', 'save', 'nameSaved', 'changePassword', 'currentPassword', 'newPassword', 'minChars', 'passwordChanged', 'tourCard', 'tourText', 'tourStart', 'dataCard', 'dataText', 'dataDownload', 'progressCard', 'progressSummary', 'progressWarning', 'progressConfirm', 'progressButton', 'progressDone', 'deleteCard', 'deleteSummary', 'deleteWarning', 'yourPassword', 'deleteConfirm', 'deleteButton', 'deleted', 'genericError', 'offline', ...copy_fill_1.AUTH_CODES];
/** "Şifremi unuttum" on the sign in page and the page of the emailed link (app/sifre-yenile). */
exports.FORGOT_FORM_KEYS = ['forgotLead', 'emailLabel', 'sendLink', 'forgotSent', 'genericError', 'offline', ...copy_fill_1.AUTH_CODES];
exports.RESET_FORM_KEYS = ['newPassword', 'hidePassword', 'showPassword', 'passwordHelp', 'resetSave', 'backToSignIn', 'genericError', 'offline', ...copy_fill_1.AUTH_CODES];
const forgotFormTexts = (language) => (0, public_copy_1.publicTexts)(language, exports.FORGOT_FORM_KEYS);
exports.forgotFormTexts = forgotFormTexts;
const resetFormTexts = (language) => (0, public_copy_1.publicTexts)(language, exports.RESET_FORM_KEYS);
exports.resetFormTexts = resetFormTexts;
const authFormTexts = (language) => (0, public_copy_1.publicTexts)(language, exports.AUTH_FORM_KEYS);
exports.authFormTexts = authFormTexts;
const accountTexts = (language) => (0, public_copy_1.publicTexts)(language, exports.ACCOUNT_KEYS);
exports.accountTexts = accountTexts;
