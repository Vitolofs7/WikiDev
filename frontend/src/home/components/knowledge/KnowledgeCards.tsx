/**
* Define los componentes visuales CodeCard e InfoTag utilizados en la escena
* de conocimiento de WikiDev, junto con los tipos y utilidades necesarios
* para representar fragmentos de código y etiquetas informativas.
*
* CodeCard muestra una tarjeta de código con numeración de líneas, resaltado
* de sintaxis, indicadores de archivo y lenguaje, y un panel de resultados
* que aparece al finalizar la escritura animada. Implementa el efecto de
* escritura progresiva mediante el hook useTypewriter, que conserva el
* progreso cuando la tarjeta deja de estar activa y permite mostrar el código
* completo cuando las animaciones están deshabilitadas. También incorpora
* un reflejo dinámico que sigue el movimiento del puntero mediante Motion.
*
* InfoTag presenta etiquetas con iconos SVG específicos para documentación
* o terminal, un texto descriptivo y un indicador opcional de actividad.
* Ambos componentes admiten variantes de acento violeta o menta y utilizan
* los estilos definidos en KnowledgeCards.module.css.

*/
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";

import styles from "./KnowledgeCards.module.css";

/* ═══════════════════════════════════════════════════════════
   Tipos
   ═══════════════════════════════════════════════════════════ */

export type Accent = "violet" | "mint";

type Tone = "keyword" | "string" | "function";
type Token = { text: string; tone?: Tone };

export type CodeLine = {
  tokens: readonly Token[];
  indent?: boolean;
};

const lineLength = (line: CodeLine) =>
  line.tokens.reduce((sum, token) => sum + token.text.length, 0);

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/* ═══════════════════════════════════════════════════════════
   Efecto de escritura
   Corre una sola vez, cuando la escena entra en pantalla. El
   tiempo transcurrido se guarda en un ref: si la escena sale de
   pantalla a mitad, al volver continúa donde se quedó.
   ═══════════════════════════════════════════════════════════ */

type TypewriterOptions = {
  delay: number;
  charMs: number;
  active: boolean;
  animated: boolean;
};

function useTypewriter(
  total: number,
  { delay, charMs, active, animated }: TypewriterOptions,
) {
  const [count, setCount] = useState(animated ? 0 : total);
  const elapsed = useRef(0);

  useEffect(() => {
    if (!animated) {
      return;
    }

    const duration = delay + total * charMs;

    if (!active || elapsed.current >= duration) return;

    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      elapsed.current += Math.min(now - last, 100);
      last = now;

      const next = clamp(
        Math.floor((elapsed.current - delay) / charMs),
        0,
        total,
      );

      setCount((prev) => (prev === next ? prev : next));

      if (elapsed.current < duration) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [active, animated, total, delay, charMs]);

  return count;
}

/** Devuelve solo los primeros `budget` caracteres de la línea, con su color. */
function renderTokens(tokens: readonly Token[], budget: number) {
  let remaining = budget;

  return tokens.map((token, index) => {
    if (remaining <= 0) return null;

    const text = token.text.slice(0, remaining);
    remaining -= text.length;

    return (
      <span key={index} className={token.tone ? styles[token.tone] : undefined}>
        {text}
      </span>
    );
  });
}

/* ═══════════════════════════════════════════════════════════
   Tarjeta de código
   ═══════════════════════════════════════════════════════════ */

type CodeCardProps = {
  file: string;
  /** Etiqueta del lenguaje, p. ej. "JS". */
  badge: string;
  accent: Accent;
  /** Giro 2D de la tarjeta (grados). */
  rotation: number;
  lines: readonly CodeLine[];
  /** Resultado que aparece al terminar de escribir. */
  output: { label: string; value: string };
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  /** false cuando la escena está fuera de pantalla. */
  active: boolean;
  /** false con prefers-reduced-motion: el código aparece completo. */
  animated: boolean;
  /** Retraso antes de empezar a escribir (ms). */
  delay?: number;
};

export function CodeCard({
  file,
  badge,
  accent,
  rotation,
  lines,
  output,
  pointerX,
  pointerY,
  active,
  animated,
  delay = 0,
}: CodeCardProps) {
  // El reflejo de la tarjeta sigue al cursor
  const glareX = useTransform(pointerX, [-0.5, 0.5], ["-22%", "22%"]);
  const glareY = useTransform(pointerY, [-0.5, 0.5], ["-22%", "22%"]);

  const total = lines.reduce((sum, line) => sum + lineLength(line), 0);
  const count = useTypewriter(total, { delay, charMs: 38, active, animated });
  const done = count >= total;

  const renderedLines = lines.map((line, index) => {
    const length = lineLength(line);

    const consumed = lines
      .slice(0, index)
      .reduce((sum, previousLine) => sum + lineLength(previousLine), 0);

    const typed = clamp(count - consumed, 0, length);

    const firstUnfinishedIndex = lines.findIndex(
      (currentLine, currentIndex) => {
        const previousChars = lines
          .slice(0, currentIndex)
          .reduce((sum, previousLine) => sum + lineLength(previousLine), 0);

        return count < previousChars + lineLength(currentLine);
      },
    );

    const showCaret =
      animated &&
      (firstUnfinishedIndex === index ||
        (firstUnfinishedIndex === -1 && index === lines.length - 1));

    return (
      <div key={index} className={styles.line}>
        <span className={styles.lineNo}>{index + 1}</span>

        <span className={line.indent ? styles.indent : undefined}>
          {renderTokens(line.tokens, typed)}
          {showCaret && <span className={styles.caret} />}
        </span>
      </div>
    );
  });

  return (
    <div
      className={`${styles.card} ${styles[accent]}`}
      style={{ rotate: `${rotation}deg` }}
    >
      <motion.span className={styles.glare} style={{ x: glareX, y: glareY }} />

      <div className={styles.header}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.fileName}>{file}</span>
        <span className={styles.badge}>{badge}</span>
      </div>

      <div className={styles.code}>{renderedLines}</div>

      <div className={styles.output} data-visible={done ? "true" : "false"}>
        <span className={styles.outputLabel}>{output.label}</span>
        <span className={styles.outputValue}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            focusable="false"
          >
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
          {output.value}
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Etiqueta
   ═══════════════════════════════════════════════════════════ */

type IconName = "docs" | "terminal";

function TagIcon({ name }: { name: IconName }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
    >
      {name === "docs" ? (
        <>
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5" />
          <path d="M9 13h6M9 17h4" />
        </>
      ) : (
        <>
          <rect x="3" y="4" width="18" height="16" rx="3" />
          <path d="m8 10 3 2-3 2" />
          <path d="M13 15h3" />
        </>
      )}
    </svg>
  );
}

type InfoTagProps = {
  icon: IconName;
  label: string;
  accent: Accent;
  /** Muestra un indicador verde que late, como "en vivo". */
  live?: boolean;
};

export function InfoTag({ icon, label, accent, live = false }: InfoTagProps) {
  return (
    <div className={`${styles.tag} ${styles[accent]}`}>
      <span className={styles.tagIcon}>
        <TagIcon name={icon} />
      </span>
      <span>{label}</span>
      {live && <span className={styles.live} />}
    </div>
  );
}
