/**

ruta: frontend/src/shared/components/knowledge/KnowledgeScene.tsx

* Implementa la escena visual interactiva de conocimiento de WikiDev,
* coordinando el núcleo tridimensional, las tarjetas de código y las
* etiquetas informativas. Gestiona la interacción con el puntero, la
* inclinación de la escena y los movimientos de parallax mediante Motion,
* utilizando valores suavizados con resortes para obtener transiciones fluidas.
*
* El componente auxiliar Layer combina el desplazamiento asociado al puntero
* con una animación de flotación vertical configurable. Controla el inicio
* y la limpieza de estas animaciones según la visibilidad de la escena y
* la preferencia del usuario por reducir el movimiento.
*
* KnowledgeScene detecta cuándo entra en pantalla, escucha el movimiento
* global del ratón y calcula su posición relativa al contenedor para controlar
* la orientación del fondo y del núcleo. Organiza el contenido en dos capas:
* una tridimensional, con efectos de iluminación, conexiones SVG y el núcleo
* interactivo, y otra plana, con tarjetas de JavaScript y Python, resultados
* de ejemplo y etiquetas de documentación y código interactivo. Esta
* separación preserva la nitidez del texto al evitar que las tarjetas
* queden dentro del contexto de perspectiva 3D.
*
* Por último, centraliza los datos de ejemplo, las posiciones de las
* conexiones, los parámetros de movimiento y los colores de la escena.
* Desactiva las animaciones cuando corresponde y marca el conjunto como
* decorativo mediante `aria-hidden`, ya que su contenido es una representación
* visual ilustrativa y no una interfaz de interacción funcional.

**/


"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

import { CodeCard, InfoTag, type CodeLine } from "./KnowledgeCards";
import KnowledgeCore from "./KnowledgeCore";
import styles from "./KnowledgeScene.module.css";

/* ── Configuración ──────────────────────────────────────── */

const SPRING = { stiffness: 120, damping: 25 };

/** Inclinación máxima de la escena 3D (núcleo y fondo), en grados. */
const MAX_TILT = 7;

/** Destinos (en %) de las líneas que salen del núcleo hacia cada elemento. */
const LINK_TARGETS = [
  [22, 22.5], // JavaScript
  [78, 81], // Python
  [89, 11], // Documentación
  [15, 89], // Código interactivo
] as const;

/* ── Contenido de las tarjetas ──────────────────────────── */

const JS_LINES: readonly CodeLine[] = [
  {
    tokens: [
      { text: "const", tone: "keyword" },
      { text: " skills = [" },
    ],
  },
  {
    indent: true,
    tokens: [{ text: '"learn"', tone: "string" }, { text: "," }],
  },
  {
    indent: true,
    tokens: [{ text: '"build"', tone: "string" }],
  },
  { tokens: [{ text: "];" }] },
];

const PYTHON_LINES: readonly CodeLine[] = [
  {
    tokens: [
      { text: "def", tone: "keyword" },
      { text: " " },
      { text: "explore", tone: "function" },
      { text: "():" },
    ],
  },
  {
    indent: true,
    tokens: [
      { text: "return", tone: "keyword" },
      { text: " " },
      { text: '"ideas"', tone: "string" },
    ],
  },
];

/* ── Utilidades ─────────────────────────────────────────── */

const clamp = (value: number, min = -1, max = 1) =>
  Math.min(max, Math.max(min, value));

type FloatConfig = { distance: number; duration: number; delay?: number };

/* ── Capa con parallax y flotación ──────────────────────── */

type LayerProps = {
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  className: string;
  /** Desplazamiento por parallax (px por unidad de puntero). */
  depth: number;
  float: FloatConfig;
  /** false cuando la escena está fuera de pantalla. */
  active: boolean;
  /** false con prefers-reduced-motion. */
  animated: boolean;
  children: ReactNode;
};

/**
 * La flotación se anima con Motion (un solo `transform` que suma parallax
 * y flotación) y NO con una animación CSS: una animación CSS de `translate`
 * obliga a Chrome a tratar la capa como "en animación" y a dibujar el texto
 * con desplazamientos de subpíxel, lo que lo vuelve borroso.
 */
function Layer({
  pointerX,
  pointerY,
  className,
  depth,
  float,
  active,
  animated,
  children,
}: LayerProps) {
  const floatY = useMotionValue(0);

  const x = useTransform(pointerX, (value) => value * depth);
  const y = useTransform(
    [pointerY, floatY],
    ([pointer, bob]: number[]) => pointer * depth + bob,
  );

  useEffect(() => {
    if (!animated || !active) return;

    const controls = animate(floatY, [0, -float.distance, 0], {
      duration: float.duration,
      delay: float.delay ?? 0,
      ease: "easeInOut",
      repeat: Infinity,
    });

    return () => controls.stop();
  }, [animated, active, floatY, float.distance, float.duration, float.delay]);

  return (
    <motion.div className={className} style={{ x, y }}>
      {children}
    </motion.div>
  );
}

/* ── Escena ─────────────────────────────────────────────── */

export default function KnowledgeScene() {
  const shouldReduceMotion = useReducedMotion();
  const animated = !shouldReduceMotion;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapperRef);
  const linkGradientId = `${useId().replace(/:/g, "")}-link-gradient`;

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, SPRING);
  const smoothY = useSpring(pointerY, SPRING);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [MAX_TILT, -MAX_TILT]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-MAX_TILT, MAX_TILT]);

  /**
   * El puntero se escucha en la ventana (no solo sobre la escena) y se
   * mide respecto al centro del contenedor, que no está transformado.
   * Así no hay "zonas muertas" ni bucles de realimentación al inclinar.
   */
  useEffect(() => {
    const element = wrapperRef.current;
    if (!element || shouldReduceMotion) return;

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;

      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const reachX = Math.max(centerX, window.innerWidth - centerX);
      const reachY = Math.max(centerY, window.innerHeight - centerY);

      pointerX.set(clamp((event.clientX - centerX) / reachX) * 0.5);
      pointerY.set(clamp((event.clientY - centerY) / reachY) * 0.5);
    };

    const reset = () => {
      pointerX.set(0);
      pointerY.set(0);
    };

    const root = document.documentElement;
    window.addEventListener("pointermove", handleMove, { passive: true });
    root.addEventListener("pointerleave", reset);
    window.addEventListener("blur", reset);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      root.removeEventListener("pointerleave", reset);
      window.removeEventListener("blur", reset);
    };
  }, [pointerX, pointerY, shouldReduceMotion]);

  const layerProps = {
    pointerX: smoothX,
    pointerY: smoothY,
    active: inView,
    animated,
  };

  const cardProps = {
    pointerX: smoothX,
    pointerY: smoothY,
    active: inView,
    animated,
  };

  return (
    <div
      ref={wrapperRef}
      className={styles.sceneWrapper}
      data-active={inView ? "true" : "false"}
      aria-hidden="true"
    >
      {/* ── Capa 3D: fondo y núcleo (con perspectiva) ──────── */}
      <div className={styles.stage3d}>
        <motion.div className={styles.scene} style={{ rotateX, rotateY }}>
          <div className={styles.glow} />
          <div className={styles.coreHalo} />

          <svg
            className={styles.links}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            focusable="false"
          >
            <defs>
              <linearGradient
                id={linkGradientId}
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="0"
                x2="100"
                y2="100"
              >
                <stop offset="0%" stopColor="#7c6dfa" />
                <stop offset="50%" stopColor="#a89cf7" />
                <stop offset="100%" stopColor="#06d6a0" />
              </linearGradient>
            </defs>

            <g
              stroke={`url(#${linkGradientId})`}
              strokeWidth={1}
              strokeDasharray="3 5"
              strokeLinecap="round"
              fill="none"
            >
              {LINK_TARGETS.map(([x, y]) => (
                <line
                  key={`${x}-${y}`}
                  x1={50}
                  y1={50}
                  x2={x}
                  y2={y}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </g>
          </svg>

          <Layer
            {...layerProps}
            className={styles.corePosition}
            depth={12}
            float={{ distance: 10, duration: 7 }}
          >
            <KnowledgeCore
              pointerX={smoothX}
              pointerY={smoothY}
              active={inView}
              animated={animated}
            />
          </Layer>
        </motion.div>
      </div>

      {/* ── Capa plana: tarjetas y etiquetas (sin 3D) ──────────
          Fuera de cualquier contexto 3D el navegador dibuja el texto
          a la resolución real de la pantalla, así que se ve nítido. */}
      <div className={styles.flat}>
        <Layer
          {...layerProps}
          className={styles.javascriptPosition}
          depth={44}
          float={{ distance: 8, duration: 6 }}
        >
          <CodeCard
            {...cardProps}
            file="arrays.js"
            badge="JS"
            accent="violet"
            rotation={-5}
            lines={JS_LINES}
            output={{ label: "skills.length", value: "2" }}
            delay={900}
          />
        </Layer>

        <Layer
          {...layerProps}
          className={styles.pythonPosition}
          depth={50}
          float={{ distance: 10, duration: 7.5, delay: 0.5 }}
        >
          <CodeCard
            {...cardProps}
            file="main.py"
            badge="PY"
            accent="mint"
            rotation={5}
            lines={PYTHON_LINES}
            output={{ label: "explore()", value: '"ideas"' }}
            delay={1700}
          />
        </Layer>

        <Layer
          {...layerProps}
          className={styles.docsPosition}
          depth={62}
          float={{ distance: 6, duration: 5, delay: 0.8 }}
        >
          <InfoTag icon="docs" label="Documentación" accent="mint" />
        </Layer>

        <Layer
          {...layerProps}
          className={styles.codePosition}
          depth={56}
          float={{ distance: 7, duration: 6.5, delay: 1.2 }}
        >
          <InfoTag
            icon="terminal"
            label="Código interactivo"
            accent="violet"
            live
          />
        </Layer>
      </div>
    </div>
  );
}