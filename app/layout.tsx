import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site-brand";
import { publicText } from "@/lib/public-copy";
import "./globals.css";
import "./learning-effects.css";
import "./progress.css";
import "./verbs.css";
import "./koko-theme.css";
import "./members.css";
import "./ausbildung.css";
import "./willkommen.css";
import "./stadt.css";
import "./berufe.css";
import "./orte.css";
import "./notebook.css";
import "./lesson-book.css";
import "./home-tour.css";
import "./admin.css";
import "./paul-hoca.css";
import "./site-tour.css";
import "./games.css";
import LearningEffects from './learning-effects';
import { OptionFit } from './option-fit';
import { LetterBar } from './letter-bar';
import { LessonSync } from './lesson-sync';
import { TapToSay } from './tap-to-say';
import { VisitBeacon } from './visit-beacon';
import { STORAGE_MOVE_SCRIPT } from "@/lib/storage-move";
import { languageDirection } from "@/lib/site-languages";
import { pageLanguage } from "./page-language";

export const metadata: Metadata = {
  // Only the site name in the browser tab (the learner removed the tagline after it).
  title: SITE_NAME,
  applicationName: SITE_NAME,
  // German, the site's main language; the pages give their own description in the visitor's language.
  description: publicText("de", "landingLead", { site: SITE_NAME }),
  // Koko on a dark background: browser tab, phone home screen (apple-touch-icon) and installed app (manifest).
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The visitor's language (their choice, else the browser's languages, else German; app/page-language.ts) is written
  // into the page itself (site check, 5 November 2026: every page said lang="de"): Arabic, Persian, Dari, Pashto and
  // Urdu are right to left from the first moment, and screen readers and search engines get the right language. The
  // study pages set it again in the browser when the language saved there differs.
  const language = await pageLanguage();
  return (
    <html lang={language} dir={languageDirection(language)} suppressHydrationWarning>
      <head>
        {/* Moving from the old address: takes this browser's settings along once (lib/storage-move.ts). */}
        <script dangerouslySetInnerHTML={{ __html: STORAGE_MOVE_SCRIPT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..800&family=Lora:ital,wght@0,500..700;1,500..700&display=swap" rel="stylesheet" />
        {/* Phone home screen: icon, name and colour when the site is added as an app (see app/install-guide.tsx). */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-title" content={SITE_NAME} />
        <meta name="theme-color" content="#fdf8ec" />
      </head>
      <body className="antialiased">{children}<LearningEffects/><OptionFit/><LetterBar/><LessonSync/><TapToSay/><VisitBeacon/></body>
    </html>
  );
}
