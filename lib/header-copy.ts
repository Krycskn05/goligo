import type {VaultTranslations} from './object-vault-copy';

/** "My account" and "Site language", ordered like the site languages; later languages read them from their language
 * pack. Here (not in app/site-header.tsx) so the pages the server writes can use them too. */
export const accountLabel:VaultTranslations=['Hesabım','Mein Konto','My account','حسابي','Мій акаунт','Mon compte','Mi cuenta','Мой аккаунт','حساب من','Moje konto','Il mio account','Minha conta'];
export const siteLanguageLabel:VaultTranslations=['Site dili','Seitensprache','Site language','لغة الموقع','Мова сайту','Langue du site','Idioma del sitio','Язык сайта','زبان سایت','Język strony','Lingua del sito','Idioma do site'];

/** The account button's menu (app/account-menu.tsx): the same words as on Hesabım (lib/public-copy.ts), ordered like the
 * site languages; later languages read them from their language pack. */
export const accountMenuCopy={
 changePassword:['Şifreyi değiştir','Passwort ändern','Change password','تغيير كلمة المرور','Змінити пароль','Changer le mot de passe','Cambiar contraseña','Сменить пароль','تغییر رمز عبور','Zmień hasło','Cambia password','Alterar senha'],
 tour:['Site turu','Rundgang','Site tour','جولة في الموقع','Огляд сайту','Visite du site','Recorrido por el sitio','Экскурсия по сайту','گشت در سایت','Wycieczka po stronie','Tour del sito','Tour pelo site'],
 data:['Verilerimi indir','Meine Daten herunterladen','Download my data','تنزيل بياناتي','Завантажити мої дані','Télécharger mes données','Descargar mis datos','Скачать мои данные','دانلود داده‌هایم','Pobierz moje dane','Scarica i miei dati','Baixar meus dados'],
 signOut:['Çıkış yap','Abmelden','Sign out','تسجيل الخروج','Вийти','Se déconnecter','Cerrar sesión','Выйти','خروج','Wyloguj się','Esci','Sair'],
} as const satisfies Record<string,VaultTranslations>;
export type AccountMenuKey=keyof typeof accountMenuCopy;
