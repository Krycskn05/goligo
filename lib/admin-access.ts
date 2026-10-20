// Yönetici paneline (/yonetim) girebilen hesaplar: yalnızca site sahibinin e-postaları.
export const ADMIN_EMAILS:readonly string[]=['kooraycoskun@gmail.com','koraycoskun@hotmail.com'];
/** Is this the e-mail of a signed-in account that may open the admin panel? (case and spaces do not matter) */
export function isAdminEmail(email:unknown):boolean{return typeof email==='string'&&ADMIN_EMAILS.includes(email.trim().toLowerCase());}
