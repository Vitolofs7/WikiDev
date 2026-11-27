import {
  extractApiError,
  getApiBaseUrl,
  getCsrfToken,
} from "@/auth/services/auth.service";

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  code: number | null;
  signal: string | null;
}

export interface RunCodeParams {
  language: "javascript" | "python";
  code: string;
  stdin?: string;
}

export async function runCode({
  language,
  code,
  stdin,
}: RunCodeParams): Promise<ExecutionResult> {
  const csrf = getCsrfToken();
  const response = await fetch(`${getApiBaseUrl()}/api/execute`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(csrf ? { "X-CSRF-Token": csrf } : {}),
    },
    body: JSON.stringify({ language, code, stdin: stdin ?? "" }),
  });

  if (!response.ok) {
    throw await extractApiError(
      response,
      `Error ejecutando código (${response.status})`,
    );
  }

  const data = await response.json();

  return {
    stdout: data.stdout ?? "",
    stderr: data.stderr ?? "",
    code: data.exit_code ?? null,
    signal: null,
  };
}
