/**

ruta: frontend/src/theming/components/ThemeProvider.tsx

* Define el proveedor de temas de la aplicación mediante `next-themes`,
* centralizando la gestión del modo visual y permitiendo que los componentes
* descendientes accedan a la configuración de apariencia compartida.
*
* Configura el atributo `class` para aplicar el tema seleccionado a través
* de las clases CSS del documento, establece el modo oscuro como tema
* predeterminado y desactiva la detección automática del tema del sistema
* para mantener una apariencia inicial consistente.
*
* Recibe `children` como contenido React y lo renderiza dentro de
* `NextThemesProvider`, permitiendo que toda la interfaz incluida en este
* proveedor utilice el sistema de temas de forma uniforme.

**/


'use client'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {children}
    </NextThemesProvider>
  )
}