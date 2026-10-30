/**

ruta: frontend/src/shared/components/home/HomeBackground.tsx

* Renderiza el fondo decorativo de la página principal de WikiDev mediante una
* composición de capas visuales que refuerzan la identidad tecnológica de la
* aplicación. Combina atmósferas difuminadas en tonos púrpura y verde, una rejilla
* técnica con máscara radial, una red de conocimiento construida con SVG y una
* viñeta que centra la atención en el contenido principal. Define los nodos, sus
* propiedades visuales y las conexiones primarias y secundarias mediante estructuras
* de datos reutilizables, junto con pequeños puntos decorativos distribuidos por
* el fondo. El subcomponente `Edges` representa las conexiones entre nodos mediante
* líneas con degradado. Utiliza `useId` para generar identificadores SVG únicos
* para los degradados y las máscaras, evitando conflictos cuando existen varias
* instancias del componente. El fondo es puramente decorativo, no intercepta
* interacciones y queda excluido del árbol de accesibilidad.

**/


import { useId } from "react";

/**
 * HomeBackground
 *
 * Capas:
 * 1. Atmósferas con blur (púrpura / verde)
 * 2. Rejilla técnica con máscara radial
 * 3. Red de conocimiento (SVG: conexiones, nodos y micro-estrellas)
 * 4. Viñeta suave para centrar la atención
 */

/* ── Datos ──────────────────────────────────────────────── */

type NetworkNode = {
  x: number;
  y: number;
  /** Radio del núcleo */
  r: number;
  /** Radio del halo */
  halo: number;
  color: string;
  opacity: number;
  haloOpacity: number;
};

const NODES = {
  A: {
    x: 115,
    y: 190,
    r: 2,
    halo: 7,
    color: "#a89cf7",
    opacity: 0.7,
    haloOpacity: 0.1,
  },
  B: {
    x: 300,
    y: 290,
    r: 2.5,
    halo: 8,
    color: "#7c6dfa",
    opacity: 0.75,
    haloOpacity: 0.1,
  },
  C: {
    x: 1120,
    y: 470,
    r: 2.5,
    halo: 8,
    color: "#06d6a0",
    opacity: 0.75,
    haloOpacity: 0.1,
  },
  D: {
    x: 1265,
    y: 650,
    r: 2,
    halo: 7,
    color: "#6ee7b7",
    opacity: 0.7,
    haloOpacity: 0.1,
  },
  E: {
    x: 220,
    y: 700,
    r: 1.5,
    halo: 6,
    color: "#a89cf7",
    opacity: 0.55,
    haloOpacity: 0.07,
  },
  F: {
    x: 605,
    y: 135,
    r: 2,
    halo: 7,
    color: "#7c6dfa",
    opacity: 0.6,
    haloOpacity: 0.08,
  },
  G: {
    x: 1060,
    y: 175,
    r: 1.5,
    halo: 6,
    color: "#6ee7b7",
    opacity: 0.55,
    haloOpacity: 0.07,
  },
  H: {
    x: 650,
    y: 520,
    r: 1.5,
    halo: 7,
    color: "#a89cf7",
    opacity: 0.55,
    haloOpacity: 0.07,
  },
  I: {
    x: 1260,
    y: 250,
    r: 1.5,
    halo: 6,
    color: "#06d6a0",
    opacity: 0.55,
    haloOpacity: 0.07,
  },
  J: {
    x: 780,
    y: 780,
    r: 1.25,
    halo: 5,
    color: "#6ee7b7",
    opacity: 0.5,
    haloOpacity: 0.06,
  },
} as const satisfies Record<string, NetworkNode>;

type NodeId = keyof typeof NODES;

type Edge = readonly [NodeId, NodeId];

const PRIMARY_EDGES: readonly Edge[] = [
  ["A", "B"],
  ["B", "F"],
  ["B", "H"],
  ["F", "G"],
  ["H", "G"],
  ["H", "C"],
  ["H", "E"],
  ["E", "A"],
  ["C", "I"],
  ["C", "D"],
  ["D", "H"],
  ["E", "J"],
  ["J", "D"],
];

const SECONDARY_EDGES: readonly Edge[] = [
  ["A", "F"],
  ["B", "E"],
  ["F", "H"],
  ["G", "I"],
  ["G", "C"],
  ["C", "J"],
];

/**
 * Micro-puntos independientes de la red.
 * Funcionan como pequeñas estrellas repartidas por el fondo.
 */
const MICRO_POINTS = [
  { x: 70, y: 110, r: 1, opacity: 0.32 },
  { x: 165, y: 95, r: 0.7, opacity: 0.24 },
  { x: 245, y: 155, r: 0.8, opacity: 0.28 },
  { x: 365, y: 95, r: 0.7, opacity: 0.2 },
  { x: 450, y: 185, r: 0.9, opacity: 0.28 },
  { x: 520, y: 75, r: 0.6, opacity: 0.22 },
  { x: 700, y: 90, r: 0.8, opacity: 0.25 },
  { x: 825, y: 135, r: 0.7, opacity: 0.22 },
  { x: 930, y: 80, r: 1, opacity: 0.3 },
  { x: 1010, y: 110, r: 0.6, opacity: 0.2 },
  { x: 1160, y: 90, r: 0.8, opacity: 0.25 },
  { x: 1340, y: 120, r: 0.7, opacity: 0.28 },

  { x: 55, y: 330, r: 0.7, opacity: 0.22 },
  { x: 175, y: 390, r: 0.9, opacity: 0.25 },
  { x: 390, y: 360, r: 0.6, opacity: 0.2 },
  { x: 480, y: 430, r: 0.8, opacity: 0.24 },
  { x: 555, y: 300, r: 0.7, opacity: 0.22 },
  { x: 760, y: 350, r: 0.8, opacity: 0.24 },
  { x: 850, y: 420, r: 0.6, opacity: 0.2 },
  { x: 950, y: 330, r: 0.9, opacity: 0.27 },
  { x: 1030, y: 390, r: 0.7, opacity: 0.22 },
  { x: 1180, y: 360, r: 0.8, opacity: 0.25 },
  { x: 1370, y: 390, r: 0.7, opacity: 0.2 },

  { x: 90, y: 520, r: 0.8, opacity: 0.24 },
  { x: 155, y: 590, r: 0.6, opacity: 0.2 },
  { x: 350, y: 540, r: 0.8, opacity: 0.23 },
  { x: 430, y: 625, r: 0.7, opacity: 0.21 },
  { x: 535, y: 575, r: 0.9, opacity: 0.27 },
  { x: 735, y: 610, r: 0.7, opacity: 0.21 },
  { x: 850, y: 560, r: 0.8, opacity: 0.25 },
  { x: 970, y: 650, r: 0.6, opacity: 0.2 },
  { x: 1050, y: 590, r: 0.8, opacity: 0.24 },
  { x: 1190, y: 570, r: 0.7, opacity: 0.22 },
  { x: 1360, y: 550, r: 0.9, opacity: 0.25 },

  { x: 65, y: 790, r: 0.7, opacity: 0.2 },
  { x: 150, y: 830, r: 0.8, opacity: 0.24 },
  { x: 330, y: 810, r: 0.6, opacity: 0.2 },
  { x: 460, y: 750, r: 0.8, opacity: 0.24 },
  { x: 575, y: 835, r: 0.7, opacity: 0.21 },
  { x: 900, y: 820, r: 0.8, opacity: 0.23 },
  { x: 1010, y: 760, r: 0.6, opacity: 0.2 },
  { x: 1150, y: 820, r: 0.8, opacity: 0.24 },
  { x: 1320, y: 760, r: 0.7, opacity: 0.22 },
  { x: 1390, y: 840, r: 0.9, opacity: 0.26 },
] as const;

/* ── Subcomponentes ─────────────────────────────────────── */

type EdgesProps = {
  edges: readonly Edge[];
  gradientId: string;
  strokeWidth: number;
  opacity: number;
};

function Edges({ edges, gradientId, strokeWidth, opacity }: EdgesProps) {
  return (
    <g
      stroke={`url(#${gradientId})`}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      fill="none"
      opacity={opacity}
    >
      {edges.map(([from, to]) => (
        <line
          key={`${from}-${to}`}
          x1={NODES[from].x}
          y1={NODES[from].y}
          x2={NODES[to].x}
          y2={NODES[to].y}
        />
      ))}
    </g>
  );
}

/* ── Componente principal ───────────────────────────────── */

export default function HomeBackground() {
  const uid = useId().replace(/:/g, "");

  const gradientId = `${uid}-network-gradient`;
  const fadeId = `${uid}-network-fade`;
  const maskId = `${uid}-network-mask`;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* ── Atmósferas ───────────────────────────────────── */}

      <div
        className="absolute left-1/2 -top-60 h-175 w-250 -translate-x-1/2 transform-gpu rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse, rgba(124,109,250,0.32) 0%, rgba(124,109,250,0.10) 38%, transparent 72%)",
        }}
      />

      <div
        className="absolute -left-30 top-[18%] h-125 w-125 transform-gpu rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(124,109,250,0.14) 0%, transparent 70%)",
        }}
      />

      <div
        className="absolute -right-30 top-[30%] h-150 w-150 transform-gpu rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(6,214,160,0.18) 0%, rgba(6,214,160,0.05) 42%, transparent 72%)",
        }}
      />

      <div
        className="absolute -bottom-45 left-1/2 h-150 w-150 -translate-x-1/2 transform-gpu rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(124,109,250,0.10) 0%, rgba(6,214,160,0.05) 45%, transparent 72%)",
        }}
      />

      <div
        className="absolute left-1/2 top-[38%] h-175 w-175 -translate-x-1/2 -translate-y-1/2 transform-gpu rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(124,109,250,0.075) 0%, rgba(6,214,160,0.025) 42%, transparent 72%)",
        }}
      />

      {/* ── Rejilla técnica ──────────────────────────────── */}

      <div
        className="absolute inset-0 opacity-3.5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.45) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(ellipse 85% 75% at 50% 28%, black 15%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 85% 75% at 50% 28%, black 15%, transparent 100%)",
        }}
      />

      {/* ── Red de conocimiento ──────────────────────────── */}

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
      >
        <defs>
          <linearGradient
            id={gradientId}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="1440"
            y2="900"
          >
            <stop offset="0%" stopColor="#7c6dfa" />
            <stop offset="50%" stopColor="#a89cf7" />
            <stop offset="100%" stopColor="#06d6a0" />
          </linearGradient>

          <radialGradient id={fadeId} cx="50%" cy="45%" r="70%">
            <stop offset="55%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0.35" />
          </radialGradient>

          <mask id={maskId}>
            <rect width="1440" height="900" fill={`url(#${fadeId})`} />
          </mask>
        </defs>

        <g mask={`url(#${maskId})`}>
          {/* Micro-estrellas */}

          <g>
            {MICRO_POINTS.map((point, index) => (
              <circle
                key={`${point.x}-${point.y}`}
                cx={point.x}
                cy={point.y}
                r={point.r}
                fill={index % 3 === 0 ? "#a89cf7" : "#6ee7b7"}
                opacity={point.opacity}
              />
            ))}
          </g>

          {/* Conexiones */}

          <Edges
            edges={SECONDARY_EDGES}
            gradientId={gradientId}
            strokeWidth={0.75}
            opacity={0.08}
          />

          <Edges
            edges={PRIMARY_EDGES}
            gradientId={gradientId}
            strokeWidth={1}
            opacity={0.16}
          />

          {/* Nodos */}

          {Object.entries(NODES).map(([id, node]) => (
            <g key={id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={node.halo}
                fill={node.color}
                opacity={node.haloOpacity}
              />

              <circle
                cx={node.x}
                cy={node.y}
                r={node.r}
                fill={node.color}
                opacity={node.opacity}
              />
            </g>
          ))}
        </g>
      </svg>

      {/* ── Viñeta ───────────────────────────────────────── */}

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 35%, rgba(8,8,16,0.35) 100%)",
        }}
      />
    </div>
  );
}
