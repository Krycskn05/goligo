"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADMIN_EMAILS = void 0;
exports.isAdminEmail = isAdminEmail;
// Yönetici paneline (/yonetim) girebilen hesaplar: yalnızca site sahibinin e-postaları.
exports.ADMIN_EMAILS = ['kooraycoskun@gmail.com', 'koraycoskun@hotmail.com'];
/** Is this the e-mail of a signed-in account that may open the admin panel? (case and spaces do not matter) */
function isAdminEmail(email) { return typeof email === 'string' && exports.ADMIN_EMAILS.includes(email.trim().toLowerCase()); }
