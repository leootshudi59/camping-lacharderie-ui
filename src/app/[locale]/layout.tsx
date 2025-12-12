// src/app/layout.tsx  (⚠️ pas de "use client")
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import ClientLayout from "./ClientLayout";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  // ✅ pas de hardcode — marche en local, preview, prod
  metadataBase: new URL("https://camping-lacharderie-ui.vercel.app/"),
  title: {
    default: "Camping La Charderie",
    template: "%s - Camping La Charderie",
  },
  description: "Camping La Charderie : réservez vos emplacements et gérez vos séjours facilement.",
  alternates: { canonical: "/" },
  // En preview/sans domaine, on évite l’indexation ; en prod avec domaine, on ouvre
  robots: { index: true, follow: true },
  openGraph: {
    title: "Camping La Charderie",
    description:
      "Réservez vos emplacements et gérez vos séjours facilement au Camping La Charderie.",
    url: "https://camping-lacharderie-ui.vercel.app/",
    siteName: "Camping La Charderie",
    locale: "fr_FR",
    type: "website",
  },
};

export default async function RootLayout({ children, params }: { 
  children: React.ReactNode 
  params: {locale: string};
}) {

  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Toute la partie client (providers, pathname, toaster) */}
        <NextIntlClientProvider messages={messages}>
          <ClientLayout>{children}</ClientLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}