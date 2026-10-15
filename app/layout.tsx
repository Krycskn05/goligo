import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site-brand";
import "./globals.css";
import "./learning-effects.css";
import "./progress.css";
import "./verbs.css";
import "./koko-theme.css";
import LearningEffects from './learning-effects';

export const metadata: Metadata = {
  title: `${SITE_NAME} · Almanca ve İngilizce Eğitimi`,
  applicationName: SITE_NAME,
  description: "Almanca ve İngilizce eğitim seçenekleri, ünite ve konu başlıkları, özgün resimli Nesne Kasası, testler ve harf bulmacaları. Learn German and English with picture vocabulary tests and letter puzzles.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">{children}<LearningEffects/></body>
    </html>
  );
}
