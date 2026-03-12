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