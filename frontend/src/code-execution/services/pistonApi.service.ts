const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface ExecutionResult {
  stdout: string
  stderr: string
  code: number | null
  signal: string | null
}

export interface RunCodeParams {
  language: 'javascript' | 'python'
  code: string
  stdin?: string
}

export async function runCode({ language, code, stdin }: RunCodeParams): Promise<ExecutionResult> {
  const response = await fetch(`${API_URL}/api/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ language, code, stdin: stdin ?? '' }),
  })

  if (!response.ok) {
    throw new Error(`Error ejecutando código: ${response.statusText}`)
  }

  const data = await response.json()

  return {
    stdout: data.stdout ?? '',
    stderr: data.stderr ?? '',
    code: data.exit_code ?? null,
    signal: null,
  }
}