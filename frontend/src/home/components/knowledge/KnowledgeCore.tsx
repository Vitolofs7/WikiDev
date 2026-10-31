/**

ruta: frontend/src/shared/components/knowledge/KnowledgeCore.tsx

* Implementa el núcleo visual interactivo de la escena de conocimiento de
* WikiDev mediante una esfera de nodos conectados, una gema central y varias
* órbitas animadas. Genera de forma determinista la distribución tridimensional
* de los nodos y sus conexiones, utilizando una esfera de Fibonacci y un
* generador pseudoaleatorio con semilla fija para garantizar resultados
* reproducibles. Calcula una paleta cromática progresiva entre tonos violetas,
* lavanda y verde menta.
*
* El componente KnowledgeCore proyecta los nodos 3D sobre dos canvas,
* separando las capas delanteras y traseras según su profundidad. En cada
* fotograma calcula la rotación, la perspectiva, los colores y la intensidad
* de los puntos y sus conexiones. Añade pulsos luminosos que recorren la red
* entre nodos vecinos, mientras la gema y sus reflejos responden al movimiento
* del puntero mediante Motion.
*
* El componente auxiliar Orbits representa las órbitas elípticas mediante SVG,
* con estelas y puntos luminosos animados que quedan ocultos al pasar por
* detrás del núcleo. La simulación adapta la resolución de los canvas al
* tamaño del contenedor y al dispositivo, limita la frecuencia de actualización
* y utiliza ResizeObserver y requestAnimationFrame para gestionar el dibujo.
* Las animaciones pueden desactivarse para mostrar una representación estática
* y se detiene el bucle de renderizado cuando la escena está inactiva.
* La composición de capas y los efectos visuales se apoyan en los estilos
* definidos en KnowledgeCore.module.css.

**/


"use client";

import { useEffect, useId, useRef } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";

import styles from "./KnowledgeCore.module.css";

/* ═══════════════════════════════════════════════════════════
   1. Red de nodos (esfera)
   Datos deterministas: no usan Math.random, así que son
   idénticos en servidor y cliente.
   ═══════════════════════════════════════════════════════════ */

type Vec3 = readonly [number, number, number];

const NODE_COUNT = 64;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

function mulberry32(seed: number) {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Esfera de Fibonacci con un poco de ruido para que parezca orgánica. */
const NODES: readonly Vec3[] = (() => {
  const rand = mulberry32(7);
  return Array.from({ length: NODE_COUNT }, (_, i): Vec3 => {
    const y = 1 - (2 * (i + 0.5)) / NODE_COUNT;
    const ring = Math.sqrt(1 - y * y);
    const theta = GOLDEN_ANGLE * i;

    let x = Math.cos(theta) * ring + (rand() - 0.5) * 0.14;
    let yy = y + (rand() - 0.5) * 0.14;
    let z = Math.sin(theta) * ring + (rand() - 0.5) * 0.14;

    const length = Math.hypot(x, yy, z);
    const radius = (0.93 + rand() * 0.1) / length;
    x *= radius;
    yy *= radius;
    z *= radius;

    return [x, yy, z];
  });
})();

/** Cada nodo se conecta con sus 3 vecinos más cercanos. */
const EDGES: readonly (readonly [number, number])[] = (() => {
  const seen = new Set<string>();
  const edges: [number, number][] = [];

  NODES.forEach((a, i) => {
    NODES.map((b, j) => ({
      j,
      d: Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]),
    }))
      .filter(({ j }) => j !== i)
      .sort((p, q) => p.d - q.d)
      .slice(0, 3)
      .forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (seen.has(key)) return;
        seen.add(key);
        edges.push(i < j ? [i, j] : [j, i]);
      });
  });

  return edges;
})();

const NEIGHBORS: readonly (readonly number[])[] = (() => {
  const lists: number[][] = NODES.map(() => []);
  EDGES.forEach(([a, b]) => {
    lists[a].push(b);
    lists[b].push(a);
  });
  return lists;
})();

/* Paleta: púrpura → lavanda → verde (igual que el fondo) */
const STOPS: readonly Vec3[] = [
  [124, 109, 250],
  [168, 156, 247],
  [6, 214, 160],
];

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function gradientColor(t: number, out: number[]) {
  const p = clamp01(t) * 2;
  const i = p >= 2 ? 1 : Math.floor(p);
  const f = p - i;
  const a = STOPS[i];
  const b = STOPS[i + 1];
  out[0] = lerp(a[0], b[0], f);
  out[1] = lerp(a[1], b[1], f);
  out[2] = lerp(a[2], b[2], f);
}

const rgba = (c: readonly number[], alpha: number) =>
  `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${alpha.toFixed(3)})`;

/* Parámetros de la animación */
const CAMERA = 3.2;
const BASE_PITCH = 0.32;
/** Radianes por milisegundo (≈ 40 s por vuelta). */
const SPIN = 0.00016;
const INTRO_MS = 1700;
const STATIC_TIME = 5200;
const PULSE_COUNT = 5;

type Pulse = { from: number; to: number; t: number; speed: number };

type SimState = {
  time: number;
  pulses: Pulse[];
  flash: Float32Array;
};

function createSimState(animated: boolean): SimState {
  const pulses: Pulse[] = [];

  if (animated) {
    for (let i = 0; i < PULSE_COUNT; i++) {
      const from = Math.floor(Math.random() * NODES.length);
      const options = NEIGHBORS[from];
      pulses.push({
        from,
        to: options[Math.floor(Math.random() * options.length)],
        t: Math.random(),
        speed: 0.00035 + Math.random() * 0.00025,
      });
    }
  }

  return {
    time: animated ? 0 : STATIC_TIME,
    pulses,
    flash: new Float32Array(NODES.length),
  };
}

/* ═══════════════════════════════════════════════════════════
   2. Órbitas con estela de cometa
   ═══════════════════════════════════════════════════════════ */

type OrbitSpec = {
  /** Semiejes en unidades del viewBox (100 = ancho del núcleo). */
  rx: number;
  ry: number;
  tilt: number;
  color: string;
  dotColor: string;
  frontOpacity: number;
  backOpacity: number;
  duration: number;
  /** Desfase negativo para que los puntos no arranquen juntos. */
  begin: number;
  reverse?: boolean;
};

const ORBITS: readonly OrbitSpec[] = [
  {
    rx: 62.5,
    ry: 24,
    tilt: -25,
    color: "#7c6dfa",
    dotColor: "#a89cf7",
    frontOpacity: 0.7,
    backOpacity: 0.28,
    duration: 14,
    begin: 0,
  },
  {
    rx: 57.5,
    ry: 32.5,
    tilt: 58,
    color: "#06d6a0",
    dotColor: "#6ee7b7",
    frontOpacity: 0.48,
    backOpacity: 0.18,
    duration: 20,
    begin: -7,
    reverse: true,
  },
];

/** Tres trazos superpuestos y alineados en la cabeza: la estela se desvanece. */
const TRAIL = [
  { length: 16, width: 0.5, opacity: 0.2 },
  { length: 9, width: 0.7, opacity: 0.35 },
  { length: 4, width: 0.95, opacity: 0.6 },
] as const;

const fullEllipsePath = ({ rx, ry, reverse }: OrbitSpec) => {
  const sweep = reverse ? 0 : 1;
  return `M ${-rx} 0 A ${rx} ${ry} 0 1 ${sweep} ${rx} 0 A ${rx} ${ry} 0 1 ${sweep} ${-rx} 0`;
};

/** Mitad "delantera" de la elipse (la que pasa por delante del núcleo). */
const frontArcPath = ({ rx, ry }: OrbitSpec) =>
  `M ${-rx} 0 A ${rx} ${ry} 0 0 0 ${rx} 0`;

/**
 * Se dibuja dos veces: una capa tras el núcleo (elipse completa, tenue) y
 * otra por delante (solo la mitad cercana). Los cometas desaparecen tras
 * el núcleo al recorrer la mitad trasera.
 */
function Orbits({
  layer,
  animated,
}: {
  layer: "back" | "front";
  animated: boolean;
}) {
  const clipId = `${useId().replace(/:/g, "")}-front-half`;
  const isFront = layer === "front";

  return (
    <svg
      className={`${styles.orbits} ${isFront ? styles.orbitsFront : styles.orbitsBack}`}
      viewBox="-50 -50 100 100"
      focusable="false"
    >
      {isFront && (
        <defs>
          <clipPath id={clipId}>
            <rect x={-100} y={0} width={200} height={100} />
          </clipPath>
        </defs>
      )}

      {ORBITS.map((orbit) => {
        const dur = `${orbit.duration}s`;
        const begin = `${orbit.begin}s`;

        return (
          <g
            key={orbit.color}
            transform={`rotate(${orbit.tilt})`}
            clipPath={isFront ? `url(#${clipId})` : undefined}
          >
            <path
              d={isFront ? frontArcPath(orbit) : fullEllipsePath(orbit)}
              fill="none"
              stroke={orbit.color}
              strokeOpacity={isFront ? orbit.frontOpacity : orbit.backOpacity}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />

            <g opacity={isFront ? 1 : 0.55}>
              {animated &&
                TRAIL.map(({ length, width, opacity }) => (
                  <path
                    key={length}
                    d={fullEllipsePath(orbit)}
                    pathLength={100}
                    fill="none"
                    stroke={orbit.dotColor}
                    strokeWidth={width}
                    strokeOpacity={opacity}
                    strokeLinecap="round"
                    strokeDasharray={`${length} ${100 - length}`}
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from={length}
                      to={length - 100}
                      dur={dur}
                      begin={begin}
                      repeatCount="indefinite"
                    />
                  </path>
                ))}

              {/* Sin animación, el punto queda fijo en la mitad delantera */}
              <g
                transform={
                  animated
                    ? undefined
                    : `translate(${orbit.rx * 0.5} ${orbit.ry * 0.87})`
                }
              >
                <circle r={4} fill={orbit.dotColor} opacity={0.18} />
                <circle r={1.5} fill={orbit.dotColor} />
                <circle r={0.6} fill="#ffffff" opacity={0.9} />
                {animated && (
                  <animateMotion
                    dur={dur}
                    begin={begin}
                    repeatCount="indefinite"
                    path={fullEllipsePath(orbit)}
                  />
                )}
              </g>
            </g>
          </g>
        );
      })}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   3. Núcleo
   Capas (de atrás hacia delante):
   órbitas traseras → cuerpo de cristal → nodos traseros → gema
   → nodos delanteros → órbitas delanteras
   ═══════════════════════════════════════════════════════════ */

type KnowledgeCoreProps = {
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  /** false cuando la escena está fuera de pantalla: se detiene el bucle. */
  active: boolean;
  /** false con prefers-reduced-motion: se dibuja un único fotograma. */
  animated: boolean;
};

export default function KnowledgeCore({
  pointerX,
  pointerY,
  active,
  animated,
}: KnowledgeCoreProps) {
  const backRef = useRef<HTMLCanvasElement>(null);
  const frontRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<SimState | null>(null);

  const sheenX = useTransform(pointerX, [-0.5, 0.5], ["-16%", "16%"]);
  const sheenY = useTransform(pointerY, [-0.5, 0.5], ["-16%", "16%"]);
  const gemX = useTransform(pointerX, (value) => value * 12);
  const gemY = useTransform(pointerY, (value) => value * 12);

  useEffect(() => {
    const back = backRef.current;
    const front = frontRef.current;
    if (!back || !front) return;

    const ctxBack = back.getContext("2d");
    const ctxFront = front.getContext("2d");
    if (!ctxBack || !ctxFront) return;

    const state = (simRef.current ??= createSimState(animated));
    const count = NODES.length;

    // Buffers reutilizados en cada fotograma (sin asignaciones)
    const px = new Float32Array(count);
    const py = new Float32Array(count);
    const pz = new Float32Array(count);
    const colors = Array.from({ length: count }, () => [0, 0, 0]);
    const order = Array.from({ length: count }, (_, i) => i);
    const scratch = [0, 0, 0];

    let size = 0;

    const draw = (dt: number) => {
      if (!size) return;
      if (animated) state.time += dt;

      const { time, pulses, flash } = state;
      const intro = easeOutCubic(clamp01(time / INTRO_MS));
      const edgeIntro = clamp01((intro - 0.25) / 0.75);

      const center = size / 2;
      const unit = size / 260;
      const radius = size * 0.4 * (0.6 + 0.4 * intro);

      const yaw = 0.5 + time * SPIN + pointerX.get() * 1.1;
      const pitch = BASE_PITCH + pointerY.get() * 0.9;
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const cosX = Math.cos(pitch);
      const sinX = Math.sin(pitch);

      // Rotación + proyección en perspectiva
      for (let i = 0; i < count; i++) {
        const [nx, ny, nz] = NODES[i];
        const x = nx * cosY + nz * sinY;
        const z1 = -nx * sinY + nz * cosY;
        const y = ny * cosX - z1 * sinX;
        const z = ny * sinX + z1 * cosX;
        const scale = CAMERA / (CAMERA - z);

        px[i] = center + x * radius * scale;
        py[i] = center + y * radius * scale;
        pz[i] = z;

        // Color en espacio de pantalla: púrpura arriba-izquierda → verde abajo-derecha
        const t =
          (((px[i] - center) / radius) * 0.7 +
            ((py[i] - center) / radius) * 0.3 +
            1) /
          2;
        gradientColor(t, colors[i]);
      }

      ctxBack.clearRect(0, 0, size, size);
      ctxFront.clearRect(0, 0, size, size);

      // Conexiones
      for (const [a, b] of EDGES) {
        const zm = (pz[a] + pz[b]) / 2;
        const depth = (zm + 1) / 2;
        const ctx = zm >= 0 ? ctxFront : ctxBack;

        scratch[0] = (colors[a][0] + colors[b][0]) / 2;
        scratch[1] = (colors[a][1] + colors[b][1]) / 2;
        scratch[2] = (colors[a][2] + colors[b][2]) / 2;

        ctx.strokeStyle = rgba(scratch, (0.06 + 0.3 * depth) * edgeIntro);
        ctx.lineWidth = (0.6 + depth * 0.6) * unit;
        ctx.beginPath();
        ctx.moveTo(px[a], py[a]);
        ctx.lineTo(px[b], py[b]);
        ctx.stroke();
      }

      // Nodos (de atrás hacia delante)
      order.sort((a, b) => pz[a] - pz[b]);
      for (const i of order) {
        const depth = (pz[i] + 1) / 2;
        const ctx = pz[i] >= 0 ? ctxFront : ctxBack;
        const f = flash[i];
        const r = (1 + 1.6 * depth) * unit * (1 + f * 0.9);
        const alpha = Math.min(1, (0.28 + 0.72 * depth) * intro + f * 0.4);

        ctx.fillStyle = rgba(colors[i], alpha * (0.16 + f * 0.3));
        ctx.beginPath();
        ctx.arc(px[i], py[i], r * 3.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = rgba(colors[i], alpha);
        ctx.beginPath();
        ctx.arc(px[i], py[i], r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Señales que viajan de nodo en nodo
      for (let i = 0; i < count; i++) {
        flash[i] = Math.max(0, flash[i] - dt * 0.0022);
      }

      for (const pulse of pulses) {
        pulse.t += dt * pulse.speed;

        if (pulse.t >= 1) {
          flash[pulse.to] = 1;
          const options = NEIGHBORS[pulse.to].filter((n) => n !== pulse.from);
          const pool = options.length ? options : NEIGHBORS[pulse.to];
          pulse.from = pulse.to;
          pulse.to = pool[Math.floor(Math.random() * pool.length)];
          pulse.t -= 1;
        }

        const { from, to, t } = pulse;
        const x = lerp(px[from], px[to], t);
        const y = lerp(py[from], py[to], t);
        const z = lerp(pz[from], pz[to], t);
        const tail = Math.max(0, t - 0.16);
        const depth = (z + 1) / 2;
        const alpha = (0.45 + 0.55 * depth) * edgeIntro;
        const ctx = z >= 0 ? ctxFront : ctxBack;

        scratch[0] = lerp(colors[from][0], colors[to][0], t);
        scratch[1] = lerp(colors[from][1], colors[to][1], t);
        scratch[2] = lerp(colors[from][2], colors[to][2], t);

        ctx.strokeStyle = rgba(scratch, alpha * 0.55);
        ctx.lineWidth = 1.3 * unit;
        ctx.beginPath();
        ctx.moveTo(lerp(px[from], px[to], tail), lerp(py[from], py[to], tail));
        ctx.lineTo(x, y);
        ctx.stroke();

        ctx.fillStyle = rgba(scratch, alpha * 0.22);
        ctx.beginPath();
        ctx.arc(x, y, 5 * unit, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255,255,255,${(alpha * 0.95).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(x, y, 1.6 * unit, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const resize = () => {
      size = back.clientWidth;
      if (!size) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      for (const canvas of [back, front]) {
        canvas.width = Math.round(size * dpr);
        canvas.height = Math.round(size * dpr);
      }
      ctxBack.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctxFront.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(0);
    };

    // clientWidth ignora las transformaciones 3D del padre
    const observer = new ResizeObserver(resize);
    observer.observe(back);
    resize();

    let frame = 0;
    let last = 0;

    const loop = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      draw(dt);
      frame = requestAnimationFrame(loop);
    };

    if (animated && active) {
      last = performance.now();
      frame = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [animated, active, pointerX, pointerY]);

  return (
    <div className={styles.root} data-active={active ? "true" : "false"}>
      <Orbits layer="back" animated={animated} />

      {/* Cuerpo de cristal */}
      <div className={styles.body}>
        <motion.div className={styles.sheen} style={{ x: sheenX, y: sheenY }} />
      </div>

      <canvas ref={backRef} className={`${styles.canvas} ${styles.canvasBack}`} />

      {/* Gema central */}
      <motion.div className={styles.gemStage} style={{ x: gemX, y: gemY }}>
        <div className={styles.gemGlow} />
        <div className={styles.gem}>
          <span className={styles.gemSymbol}>{"</>"}</span>
        </div>
      </motion.div>

      <canvas
        ref={frontRef}
        className={`${styles.canvas} ${styles.canvasFront}`}
      />

      <Orbits layer="front" animated={animated} />
    </div>
  );
}