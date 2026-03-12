export function JavaScriptIcon({ className = "w-5 h-5", color = "#f7df1e" }: { className?: string, color?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={color}>
      <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"/>
    </svg>
  )
}

export function PythonIcon({ className = "w-5 h-5", color = "#3776ab" }: { className?: string, color?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={color}>
      <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.9S0 5.789 0 11.969c0 6.18 3.403 5.963 3.403 5.963h2.031v-2.867s-.109-3.403 3.347-3.403h5.764s3.236.052 3.236-3.13V3.395S18.28 0 11.914 0zm-3.21 1.96a1.042 1.042 0 1 1 0 2.084 1.042 1.042 0 0 1 0-2.083zM12.086 24c6.094 0 5.714-2.656 5.714-2.656l-.007-2.752h-5.814v-.826h8.121S24 18.211 24 12.031c0-6.18-3.403-5.963-3.403-5.963h-2.031v2.867s.109 3.403-3.347 3.403h-5.764s-3.236-.052-3.236 3.13v5.137S5.72 24 12.086 24zm3.21-1.96a1.042 1.042 0 1 1 0-2.084 1.042 1.042 0 0 1 0 2.083z"/>
    </svg>
  )
}

export function AlgorithmsIcon({ className = "w-5 h-5", color = "#a89cf7" }: { className?: string, color?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  )
}

export const langIcons: Record<string, React.ComponentType<{ className?: string, color?: string }>> = {
  javascript: JavaScriptIcon,
  python: PythonIcon,
  algorithms: AlgorithmsIcon,
}

export const langColors: Record<string, string> = {
  javascript: '#f7df1e',
  python: '#3776ab',
  algorithms: '#a89cf7',
}