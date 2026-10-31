/**

ruta: frontend/src/code-execution/services/execution.service.ts

* Define el servicio de comunicación con la API de ejecución de código, enviando
* solicitudes al endpoint `/api/execute` para ejecutar código JavaScript o Python.
* Establece los tipos de parámetros de entrada y de resultados, incluyendo la salida
* estándar, los errores, el código de finalización y la señal de terminación. Gestiona
* las respuestas HTTP no satisfactorias mediante excepciones y normaliza los datos
* recibidos para garantizar una estructura de resultado consistente, contemplando
* también la entrada estándar opcional y la configuración de la URL del backend.

**/


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