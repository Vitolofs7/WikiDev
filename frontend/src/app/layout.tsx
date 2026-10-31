
 /**
 * ruta: frontend/src/app/layout.tsx
 *
 * Define el diseño raíz de la aplicación WikiDev, estableciendo los metadatos generales,
 * el idioma del documento y la configuración tipográfica global. Integra los proveedores
 * de tema y búsqueda, la barra de navegación condicional y el seguimiento del historial
 * de navegación, proporcionando el contexto compartido necesario para todas las páginas
 * y centralizando la estructura principal de la interfaz.
 */

import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import { ConditionalNavbar } from "@/navigation/components/ConditionalNavbar";
import { SearchProvider } from "@/search/components/SearchProvider";
import { HistoryTracker } from "@/history/components/HistoryTracker";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
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
    <html lang="es" data-scroll-behavior="smooth">
      <body
        className={`${outfit.variable} ${jetbrains.variable} bg-zinc-950 text-zinc-100 antialiased`}
      >
          <SearchProvider>
            <ConditionalNavbar />
            <HistoryTracker />
            <main className="flex-1">{children}</main>
          </SearchProvider>
      </body>
    </html>
  );
}
