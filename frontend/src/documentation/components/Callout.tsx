import type { ReactNode } from "react";
import { Briefcase, History, TriangleAlert, Lightbulb } from "lucide-react";

export type CalloutType =
  | "contexto-profesional"
  | "recuerda"
  | "error-comun"
  | "pro-tip";

interface CalloutProps {
  type: CalloutType;
  title?: string;
  children: ReactNode;
}

const CALLOUT_CONFIG: Record<
  CalloutType,
  {
    label: string;
    icon: typeof Briefcase;
    boxClass: string;
    titleClass: string;
  }
> = {
  "contexto-profesional": {
    label: "Contexto profesional",
    icon: Briefcase,
    boxClass: "border-[#78b7e8]/25 bg-[#78b7e8]/[0.06]",
    titleClass: "text-[#8dc6f2]",
  },
  recuerda: {
    label: "Recuerda",
    icon: History,
    boxClass: "border-(--border-hover) bg-(--bg-2)",
    titleClass: "text-(--text)",
  },
  "error-comun": {
    label: "Error común",
    icon: TriangleAlert,
    boxClass: "border-[#ea7878]/30 bg-[#ea7878]/[0.07]",
    titleClass: "text-[#f29595]",
  },
  "pro-tip": {
    label: "Consejo práctico",
    icon: Lightbulb,
    boxClass: "border-(--accent)/30 bg-(--accent)/[0.07]",
    titleClass: "text-(--accent-light)",
  },
};

export function Callout({ type, title, children }: CalloutProps) {
  const config = CALLOUT_CONFIG[type];
  const Icon = config.icon;

  return (
    <aside
      role="note"
      className={`my-6 rounded-xl border px-5 py-4 ${config.boxClass}`}
    >
      <div className="mb-1.5 flex items-center gap-2">
        <Icon className={`h-4 w-4 shrink-0 ${config.titleClass}`} aria-hidden="true" />
        <span className={`text-sm font-semibold ${config.titleClass}`}>
          {title ?? config.label}
        </span>
      </div>
      <div className="text-[15px] leading-relaxed text-(--text-secondary)">
        {children}
      </div>
    </aside>
  );
}

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
