/**
 * Posiciona la barra de navegación según la ruta actual. En la página principal
 * se superpone al inicio de la página con su diseño ampliado; en el resto de
 * rutas ocupa su propio espacio en el flujo del documento y adopta el diseño
 * compacto. En ambos casos se desplaza junto con el contenido, por lo que nunca
 * queda flotando sobre otros elementos al hacer scroll.
 */

"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";

export function ConditionalNavbar() {
  const isHome = usePathname() === "/";

  return (
    <div
      className={`z-50 ${isHome ? "absolute inset-x-0 top-0" : "relative"}`}
    >
      <Navbar compact={!isHome} />
    </div>
  );
}