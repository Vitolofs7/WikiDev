/**

ruta: frontend/src/shared/utils/cn.ts

* Proporciona la utilidad `cn` para combinar y normalizar clases CSS
* de forma segura en los componentes de la aplicación.
*
* Utiliza `clsx` para construir una cadena de clases a partir de distintos
* tipos de valores, incluidos strings, objetos condicionales y arrays.
* Posteriormente, aplica `twMerge` para detectar y resolver conflictos
* entre clases de Tailwind CSS, conservando las reglas compatibles y
* dando prioridad a las clases que deben prevalecer.
*
* Centraliza esta lógica en una función reutilizable, simplificando la
* composición de estilos y evitando duplicar código al gestionar clases
* dinámicas o condicionales en la interfaz.

**/


import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}