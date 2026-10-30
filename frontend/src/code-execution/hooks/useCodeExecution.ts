/**

ruta: frontend/src/code-execution/hooks/useCodeExecution.ts

* Proporciona un hook personalizado para gestionar el ciclo de ejecución de código,
* centralizando el estado de los resultados, la ejecución en curso y los posibles errores.
* Coordina las llamadas al servicio `runCode`, actualiza el estado según el resultado
* obtenido y gestiona las excepciones durante la ejecución. También expone una función
* para restablecer el estado inicial, facilitando la reutilización de esta lógica
* en los componentes que necesitan ejecutar código de forma asíncrona.

**/


import { useState, useCallback } from 'react'
import { runCode, type ExecutionResult, type RunCodeParams } from '../services/pistonApi.service'

interface UseCodeExecutionState {
  result: ExecutionResult | null
  isRunning: boolean
  error: string | null
}

export function useCodeExecution() {
  const [state, setState] = useState<UseCodeExecutionState>({
    result: null,
    isRunning: false,
    error: null,
  })

  const execute = useCallback(async (params: RunCodeParams) => {
    setState({ result: null, isRunning: true, error: null })

    try {
      const result = await runCode(params)
      setState({ result, isRunning: false, error: null })
    } catch (err) {
      setState({
        result: null,
        isRunning: false,
        error: err instanceof Error ? err.message : 'Error desconocido',
      })
    }
  }, [])

  const reset = useCallback(() => {
    setState({ result: null, isRunning: false, error: null })
  }, [])

  return { ...state, execute, reset }
}