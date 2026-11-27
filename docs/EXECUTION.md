# WikiDev — Code Execution

Este documento describe cómo funciona la **ejecución de código** en WikiDev para **Python y JavaScript**, sus modos de aislamiento y las medidas de seguridad implementadas.

---

## 1. Overview

WikiDev permite a los usuarios autenticados ejecutar fragmentos de código directamente desde los artículos MDX a través del backend.

- **Lenguajes soportados:** Python 3.10+, JavaScript (Node.js 20+)
- **Modos de ejecución (`CODE_EXECUTION_MODE`):**
  - `disabled` *(por defecto en `ENVIRONMENT=production`)*: deshabilita la ejecución devolviendo HTTP 503.
  - `docker` *(recomendado para red/producción)*: ejecuta cada petición en un contenedor efímero aislado (`--network=none`, `--read-only`, `--cap-drop=ALL`, `--security-opt=no-new-privileges:true`, `--pids-limit=32`, `--memory=128m`, `--cpus=0.5`, usuario no privilegiado `65534:65534`).
  - `local_unsafe` *(solo para desarrollo local)*: ejecuta un subproceso local en un directorio temporal aislado con variables de entorno mínimas (sin heredar secretos) y Python en modo `-I`. **No constituye un sandbox del sistema operativo y nunca debe exponerse a usuarios no confiables.**

---

## 2. Execution Flow

1. El **Frontend** envía `POST /api/execute` con cookie de sesión `HttpOnly` y cabecera `X-CSRF-Token`.
2. El **Backend** verifica autenticación, protección CSRF, rate limiting (20 peticiones/minuto) y validación de esquema (`code <= 10 KB`, `stdin <= 10 KB`).
3. El servicio ejecuta el código de forma no bloqueante con límite de concurrencia y timeout de 5 segundos.
4. El **Backend** devuelve `stdout` (máx. 50 KB), `stderr` (máx. 10 KB) y `exit_code`.

---

## 3. Security Measures

- **Autenticación y CSRF obligatorios:** solo usuarios autenticados con sesión válida y token CSRF pueden invocar `POST /api/execute`.
- **Secure by Default en producción:** `CODE_EXECUTION_MODE` toma el valor `disabled` si `ENVIRONMENT=production` salvo que se configure explícitamente `docker`.
- **Timeout y concurrencia:** límite de 5 segundos por ejecución y semáforo de ejecuciones simultáneas (`MAX_CONCURRENT_EXECUTIONS`).
- **Rate limit:** máximo 20 ejecuciones por minuto por IP.
- **Límites de entrada y salida:** código ≤ 10 KB, `stdin` ≤ 10 KB, `stdout` ≤ 50 KB, `stderr` ≤ 10 KB.
- **Entorno mínimo:** en modo local no se heredan secretos ni credenciales del proceso backend.

> ⚠️ Nunca utilices `CODE_EXECUTION_MODE=local_unsafe` en un servidor expuesto a red o multiusuario. Utiliza `docker` (o un runner aislado dedicado) o mantén `disabled`.

---

## 4. API Endpoint

**POST `/api/execute`** *(requiere sesión autenticada y cabecera `X-CSRF-Token`)*

### Request Body

```json
{
  "language": "python",
  "code": "print('Hola Mundo')",
  "stdin": ""
}
```

### Response Body

```json
{
  "stdout": "Hola Mundo\n",
  "stderr": "",
  "exit_code": 0
}
```
