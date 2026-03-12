import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/theming/components/ThemeProvider";
import { ConditionalNavbar } from "@/navigation/components/ConditionalNavbar";
import { SearchProvider } from "@/search/components/SearchProvider";
import { HistoryTracker } from "@/history/components/HistoryTracker";
import "./globals.css";

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "WikiDev — Tu base de conocimiento",
  description:
    "Documentación personal de programación con ejemplos interactivos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${fontMono.variable} bg-zinc-950 text-zinc-100 antialiased`}
      >
        <ThemeProvider>
          <SearchProvider>
            <ConditionalNavbar />
            <HistoryTracker />
            <main className="flex-1">{children}</main>
          </SearchProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
