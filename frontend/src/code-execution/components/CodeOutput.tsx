import { CheckCircle2, XCircle, Terminal } from 'lucide-react'
import type { ExecutionResult } from '../services/pistonApi.service'

interface CodeOutputProps {
  result: ExecutionResult | null
  isRunning: boolean
  error: string | null
}

export function CodeOutput({ result, isRunning, error }: CodeOutputProps) {
  if (isRunning) {
    return (
      <div className="flex items-center gap-3 p-5">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span key={i}
              className="w-2 h-2 rounded-full bg-violet-500 animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }} />
          ))}
        </div>
        <span className="text-zinc-600 text-sm" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          ejecutando...
        </span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-5 flex items-start gap-2.5">
        <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
        <span className="text-red-400 text-sm" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          {error}
        </span>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="p-5 flex items-center gap-2.5 text-zinc-700">
        <Terminal className="w-4 h-4" />
        <span className="text-sm" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          output aparecerá aquí...
        </span>
      </div>
    )
  }

  return (
    <div className="p-5">
      {result.stdout && (
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
          <pre className="text-emerald-300 text-sm whitespace-pre-wrap leading-relaxed"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            {result.stdout}
          </pre>
        </div>
      )}
      {result.stderr && (
        <div className="flex items-start gap-3 mt-2">
          <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
          <pre className="text-red-400 text-sm whitespace-pre-wrap leading-relaxed"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            {result.stderr}
          </pre>
        </div>
      )}
      {!result.stdout && !result.stderr && (
        <span className="text-zinc-700 text-sm" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          (sin salida)
        </span>
      )}
    </div>
  )
}