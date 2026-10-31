/**
* Implementa una barra de progreso de lectura que representa el porcentaje del
* contenido de un documento recorrido por el usuario. Calcula el progreso a partir
* de las dimensiones y la posición del elemento asociado a `articleRef`, actualizando
* su valor durante el desplazamiento y los cambios de tamaño de la ventana. Optimiza
* las actualizaciones mediante `requestAnimationFrame` para reducir cálculos repetidos
* y elimina los eventos registrados al desmontarse el componente. La barra permanece
* fija en la parte superior de la pantalla y utiliza un degradado visual para indicar
* el avance de la lectura.

*/


"use client";

import { useEffect, useState } from "react";

interface ReadingProgressProps {
  articleRef: { current: HTMLElement | null };
  docKey: string;
}

export function ReadingProgress({
  articleRef,
  docKey,
}: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    function updateProgress() {
      const el = articleRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = Math.min(
        Math.max(-rect.top, 0),
        Math.max(total, 0),
      );

      setProgress(total > 0 ? (scrolled / total) * 100 : 100);
    }

    function onScroll() {
      if (ticking) return;

      ticking = true;
      requestAnimationFrame(() => {
        updateProgress();
        ticking = false;
      });
    }

    updateProgress();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateProgress);
    };
  }, [docKey, articleRef]);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[3px] z-50"
      style={{ background: "rgba(255,255,255,0.05)" }}
    >
      <div
        className="h-full transition-[width] duration-150 ease-out"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, #7c6dfa, #06d6a0)",
        }}
      />
    </div>
  );
}