/**
* Declara el módulo TypeScript correspondiente a los archivos con extensión
* `.mdx`, permitiendo importar su contenido como componentes React dentro
* de la aplicación.
*
* Define `MDXContent` como la exportación predeterminada de cada módulo MDX,
* utilizando `MDXProps` para tipar las propiedades admitidas por el contenido
* generado. El componente devuelve un elemento JSX y puede integrarse en
* componentes y páginas de Next.js como cualquier otro componente React.
*
* Esta declaración proporciona el soporte de tipado necesario para que
* TypeScript reconozca los imports de archivos MDX y reduzca los errores
* de tipos durante el desarrollo.

*/


declare module "*.mdx" {
  import type { MDXProps } from "mdx/types.js";

  export default function MDXContent(props: MDXProps): JSX.Element;
}