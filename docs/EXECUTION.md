# WikiDev — Code Execution

Este documento describe cómo funciona la **ejecución de código** en WikiDev, incluyendo **Python y JavaScript**, limitaciones de seguridad y ejemplos de uso.

---

## 1. Overview

WikiDev permite a los usuarios ejecutar fragmentos de código directamente desde los artículos MDX o desde notas, enviándolos al **backend** para su procesamiento seguro.

- **Lenguajes soportados:** Python 3.10+, JavaScript (Node.js 18+)  
- **Modo de ejecución:** local, mediante subprocess  
- **Entorno:** controlado para evitar riesgos de seguridad  

---

## 2. Execution Flow

1. **Frontend** envía una petición HTTP al backend (`POST /code-execution`) con el código a ejecutar y el lenguaje seleccionado.  
2. **Backend** valida el input y ejecuta el código en un **subprocess seguro**.  
3. **Backend** devuelve la salida estándar, errores y metadatos al frontend.  
4. **Frontend** muestra los resultados en la interfaz de usuario.

---

## 3. Security Measures

- **Timeout:** 5 segundos por ejecución  
- **Rate limit:** máximo 20 ejecuciones por minuto por IP  
- **Sandboxing:** ejecución local, sin acceso a archivos del sistema ni red  
- **Tamaño de entrada:** limitado para evitar sobrecarga del backend  

> ⚠️ Nunca exponer la ejecución de código directamente a internet sin medidas de seguridad adicionales.

---

## 4. API Endpoint

**POST `/code-execution`**

### Request Body

```json
{
  "language": "python", // "python" o "javascript"
  "code": "print('Hola Mundo')"
}
````

### Response Body

```json
{
  "stdout": "Hola Mundo\n",
  "stderr": "",
  "exit_code": 0,
  "execution_time_ms": 12
}
```

* **stdout:** salida estándar
* **stderr:** mensajes de error
* **exit_code:** código de salida del proceso
* **execution_time_ms:** tiempo de ejecución en milisegundos

---

## 5. Frontend Integration

* Los snippets de código en los artículos MDX se envían al backend mediante **hooks o funciones utilitarias** en `code-execution/`
* Resultados se muestran de forma **dinámica y segura**, con logs de errores visibles para el usuario

### Ejemplo de uso en Frontend (TypeScript)

```ts
import { executeCode } from '@/src/code-execution/api';

const result = await executeCode({
  language: 'python',
  code: 'print("Hola Mundo")'
});

console.log(result.stdout); // "Hola Mundo"
```

---

## 6. Limitations

| Restricción             | Valor                                              |
| ----------------------- | -------------------------------------------------- |
| Timeout                 | 5 segundos por ejecución                           |
| Máx. ejecuciones        | 20/minuto por IP                                   |
| Tamaño máximo de imagen | 5 MB                                               |
| Entorno                 | Local, sin acceso a internet ni archivos sensibles |
| Lenguajes soportados    | Python 3.10+, JavaScript (Node.js 18+)             |

---

## 7. Best Practices

* Mantener el código **simple y conciso** para no exceder el timeout
* Evitar loops infinitos o llamadas bloqueantes
* Revisar errores devueltos en `stderr` para debugging
* Usar **pequeños snippets de ejemplo** en MDX o notas

---

Este documento complementa `ARCHITECTURE.md` y `DESCRIPTION_AND_SCOPE.md`, y asegura que los desarrolladores y usuarios comprendan **cómo ejecutar código de forma segura y eficiente en WikiDev**.