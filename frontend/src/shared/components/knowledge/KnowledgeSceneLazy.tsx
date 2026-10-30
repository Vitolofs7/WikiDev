/**

ruta: frontend/src/shared/components/knowledge/KnowledgeSceneLazy.tsx

* Proporciona una carga diferida del componente `KnowledgeScene` mediante
* `next/dynamic`, evitando que se renderice durante la generación del HTML
* en el servidor. Esta configuración permite que la escena interactiva,
* dependiente de funcionalidades del navegador, se inicialice únicamente
* en el cliente.
*
* Mientras se descarga el componente, muestra un contenedor vacío con
* proporción cuadrada para reservar el espacio correspondiente y reducir
* los cambios de diseño durante la carga.
*
* Este componente actúa como una capa de abstracción ligera que facilita
* la integración de `KnowledgeScene` en otras partes de la aplicación,
* manteniendo su implementación principal separada y optimizando la carga
* inicial de la página.

**/


"use client";

import dynamic from "next/dynamic";

const KnowledgeScene = dynamic(
  () => import("@/shared/components/knowledge/KnowledgeScene"),
  {
    ssr: false,
    loading: () => <div className="aspect-square w-full" />,
  }
);

export default function KnowledgeSceneLazy() {
  return <KnowledgeScene />;
}