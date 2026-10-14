import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site-brand";
import "./globals.css";
import "./learning-effects.css";
import "./progress.css";
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
      <body className="antialiased">{children}<LearningEffects/></body>
    </html>
  );
}
