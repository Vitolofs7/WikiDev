import type { ComponentType } from "react";

export interface LangIconProps {
  className?: string;
  color?: string;
}

export function JavaScriptIcon({ className = "h-6 w-6" }: LangIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <rect width="24" height="24" rx="5" fill="#F0DB4F" />
      <path
        fill="#131B26"
        d="M15.86 18.08c.46.75 1.06 1.31 2.12 1.31.89 0 1.46-.45 1.46-1.06 0-.74-.58-1-1.56-1.43l-.54-.23c-1.55-.66-2.58-1.49-2.58-3.23 0-1.61 1.23-2.84 3.15-2.84 1.37 0 2.35.48 3.06 1.72l-1.67 1.07c-.37-.66-.76-.92-1.39-.92-.63 0-1.03.4-1.03.92 0 .65.4.91 1.33 1.31l.54.23c1.82.78 2.86 1.58 2.86 3.37 0 1.93-1.52 2.99-3.56 2.99-2 0-3.29-.95-3.92-2.2l1.73-1.01Zm-7.61.18c.33.59.63 1.09 1.36 1.09.69 0 1.13-.27 1.13-1.32V10.8h2.11v7.26c0 2.2-1.29 3.2-3.17 3.2-1.7 0-2.69-.88-3.19-1.94l1.76-1.06Z"
      />
    </svg>
  );
}

export function PythonIcon({ className = "h-6 w-6" }: LangIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        fill="#4B8BBE"
        d="M11.91 1C6.2 1 6.56 3.49 6.56 3.49l.01 2.58h5.45v.77H4.4S1 6.43 1 12.22s3.19 5.59 3.19 5.59h1.9v-2.69s-.1-3.19 3.14-3.19h5.4s3.04.05 3.04-2.93V4.18S18.13 1 11.91 1Zm-3.01 1.84a.98.98 0 1 1 0 1.95.98.98 0 0 1 0-1.95Z"
      />
      <path
        fill="#FFD43B"
        d="M12.09 23c5.71 0 5.35-2.49 5.35-2.49l-.01-2.58h-5.45v-.77h7.62s3.4.41 3.4-5.38-3.19-5.59-3.19-5.59h-1.9v2.69s.1 3.19-3.14 3.19h-5.4s-3.04-.05-3.04 2.93v4.82S5.87 23 12.09 23Zm3.01-1.84a.98.98 0 1 1 0-1.95.98.98 0 0 1 0 1.95Z"
      />
    </svg>
  );
}

export function AlgorithmsIcon({
  className = "h-6 w-6",
  color = "#69d2de",
}: LangIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 7.2 6.8 14.3M12 7.2l5.2 7.1M8.5 16.5h7"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle
        cx="12"
        cy="5.5"
        r="2.6"
        fill={color}
        fillOpacity="0.22"
        stroke={color}
        strokeWidth="1.75"
      />
      <circle
        cx="5.8"
        cy="16.5"
        r="2.6"
        fill={color}
        fillOpacity="0.22"
        stroke={color}
        strokeWidth="1.75"
      />
      <circle
        cx="18.2"
        cy="16.5"
        r="2.6"
        fill={color}
        fillOpacity="0.22"
        stroke={color}
        strokeWidth="1.75"
      />
    </svg>
  );
}

export const langIcons: Record<string, ComponentType<LangIconProps>> = {
  javascript: JavaScriptIcon,
  python: PythonIcon,
  algorithms: AlgorithmsIcon,
};

export const langColors: Record<string, string> = {
  javascript: "#f0db4f",
  python: "#4b8bbe",
  algorithms: "#69d2de",
};
