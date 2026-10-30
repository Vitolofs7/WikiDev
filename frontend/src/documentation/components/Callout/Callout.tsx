/**

ruta: frontend/src/documentation/components/Callout/Callout.tsx

* Define el sistema de cajas informativas de WikiDev para enriquecer el contenido
* de documentación con avisos de carácter pedagógico. Implementa cuatro categorías
* —contexto profesional, recordatorio, error común y consejo práctico—, cada una con
* su etiqueta, icono y estilos visuales específicos. El componente `Callout` permite
* personalizar el título y mostrar contenido arbitrario mediante `children`, mientras
* que los componentes auxiliares `ContextoProfesional`, `Recuerda`, `ErrorComun` y
* `ProTip` facilitan su utilización en archivos MDX sin necesidad de indicar el tipo
* manualmente en cada caso.

**/


import type { ReactNode } from "react";
import { Briefcase, History, TriangleAlert, Lightbulb } from "lucide-react";
import { cn } from "@/shared/utils/cn";

/**
 * Tipos de caja pedagógica usados en las notas de documentación.
 * Cada uno tiene un propósito fijo — no son estilos libres, son categorías de contenido:
 *
 * - contexto-profesional: conecta el concepto con situaciones reales del mercado laboral.
 * - recuerda:              referencia a conceptos de unidades anteriores (apuntes acumulativos).
 * - error-comun:           trampas típicas que cometen los principiantes.
 * - pro-tip:               consejos y buenas prácticas que usan los profesionales.
 */
export type CalloutType =
  | "contexto-profesional"
  | "recuerda"
  | "error-comun"
  | "pro-tip";

interface CalloutProps {
  type: CalloutType;
  /** Sobrescribe la etiqueta por defecto (p. ej. "Recuerda — Unidad 1.1"). */
  title?: string;
  children: ReactNode;
}

const CALLOUT_CONFIG: Record<
  CalloutType,
  { label: string; icon: typeof Briefcase; badge: string; accent: string }
> = {
  "contexto-profesional": {
    label: "Contexto Profesional",
    icon: Briefcase,
    badge: "bg-blue-300/10 border-blue-300/20 text-blue-300",
    accent: "#5eb1ff",
  },
  recuerda: {
    label: "Recuerda",
    icon: History,
    badge: "bg-violet-300/10 border-violet-300/20 text-violet-300",
    accent: "#7c6dfa",
  },
  "error-comun": {
    label: "Error común",
    icon: TriangleAlert,
    badge: "bg-red-300/10 border-red-300/20 text-red-300",
    accent: "#f16565",
  },
  "pro-tip": {
    label: "Pro-tip",
    icon: Lightbulb,
    badge: "bg-emerald-300/10 border-emerald-300/20 text-emerald-300",
    accent: "#06d6a0",
  },
};

/**
 * Caja de color con propósito pedagógico para usar dentro de contenido MDX.
 * Comparte paleta y tipografía con CodeRunner para que ambos se sientan
 * parte del mismo sistema de notas.
 *
 * Uso en un .mdx (registrado globalmente, sin import, igual que CodeRunner):
 *   <Callout type="pro-tip">
 *     Cuando algo falla, comprueba `sys.version_info` antes que nada.
 *   </Callout>
 */
export function Callout({ type, title, children }: CalloutProps) {
  const config = CALLOUT_CONFIG[type];
  const Icon = config.icon;

  return (
    <aside
      role="note"
      className="rounded-2xl overflow-hidden my-6"
      style={{
        border: "1px solid rgba(255,255,255,0.06)",
        borderLeft: `3px solid ${config.accent}`,
        boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
      }}
    >
      <div
        className="flex items-center gap-2.5 px-5 pt-4 pb-2"
        style={{ background: "#0e0e1a" }}
      >
        <span
          className={cn(
            "flex items-center gap-1.5 text-sm font-medium px-2.5 py-0.5 rounded-md border",
            config.badge,
          )}
          style={{ fontFamily: "Outfit, sans-serif" }}
        >
          <Icon className="w-3.5 h-3.5" />
          {title ?? config.label}
        </span>
      </div>
      <div
        className="px-5 pb-4 pt-1 text-[15px] leading-relaxed text-zinc-300"
        style={{ background: "#0e0e1a", fontFamily: "Outfit, sans-serif" }}
      >
        {children}
      </div>
    </aside>
  );
}

/** Atajos opcionales: <ProTip>...</ProTip> en vez de <Callout type="pro-tip">...</Callout> */
export const ContextoProfesional = (props: Omit<CalloutProps, "type">) => (
  <Callout type="contexto-profesional" {...props} />
);
export const Recuerda = (props: Omit<CalloutProps, "type">) => (
  <Callout type="recuerda" {...props} />
);
export const ErrorComun = (props: Omit<CalloutProps, "type">) => (
  <Callout type="error-comun" {...props} />
);
export const ProTip = (props: Omit<CalloutProps, "type">) => (
  <Callout type="pro-tip" {...props} />
);