import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Source_Sans_3,
  JetBrains_Mono,
} from "next/font/google";
import { ConditionalNavbar } from "@/navigation/components/ConditionalNavbar";
import { SearchProvider } from "@/search/components/SearchProvider";
import { HistoryTracker } from "@/history/components/HistoryTracker";
import { AuthProvider } from "@/auth/context/AuthProvider";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const viewport: Viewport = {
  themeColor: "#0d1219",
};

export const metadata: Metadata = {
  title: "WikiDev — Documentación de programación",
  description:
    "Guías técnicas de Python, JavaScript y algoritmos con ejecución de código y notas privadas.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${bricolage.variable} ${sourceSans.variable} ${jetbrains.variable}`}
    >
      <body className="bg-(--bg) text-(--text) antialiased">
        <AuthProvider>
          <SearchProvider>
            <a href="#main-content" className="skip-link">
              Saltar al contenido principal
            </a>
            <ConditionalNavbar />
            <HistoryTracker />
            <main id="main-content" className="flex-1">
              {children}
            </main>
          </SearchProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
