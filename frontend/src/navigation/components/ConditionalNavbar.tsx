/**
* Gestiona la visibilidad y la presentación de la barra de navegación según la ruta
* actual y la dirección del desplazamiento del usuario. En la página principal,
* posiciona la barra de forma absoluta y utiliza su diseño ampliado; en las páginas
* internas, adopta una posición fija al desplazamiento superior y activa el diseño
* compacto. Oculta la navegación cuando el usuario se desplaza hacia abajo y la muestra
* al subir, manteniéndola visible cerca del inicio de la página. Aplica transiciones
* CSS para suavizar los cambios de visibilidad y elimina el evento de desplazamiento
* al desmontarse el componente.

*/
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";

export function ConditionalNavbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let previousScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDifference = currentScrollY - previousScrollY;

      // Mantener visible el navbar cerca del inicio.
      if (currentScrollY < 80) {
        setHidden(false);
      } else if (scrollDifference > 5) {
        // Bajando: ocultar.
        setHidden(true);
      } else if (scrollDifference < -5) {
        // Subiendo: mostrar.
        setHidden(false);
      }

      previousScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`z-50 transition-transform duration-300 ease-in-out ${
        isHome
          ? "absolute inset-x-0 top-0"
          : "sticky top-0"
      } ${hidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      <Navbar compact={!isHome} />
    </div>
  );
}