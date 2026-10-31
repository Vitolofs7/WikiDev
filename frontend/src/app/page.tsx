/**
* Define la página principal de WikiDev, organizando los componentes visuales que
* conforman la portada de la aplicación. Integra el fondo decorativo, la sección
* principal de presentación, el resumen de funcionalidades y el pie de página,
* estableciendo la estructura y distribución general del contenido mediante
* contenedores y estilos adaptados al diseño de la interfaz.

*/


import HomeBackground from "@/home/components/home/HomeBackground";
import HomeHero from "@/home/components/home/HomeHero";
import HomeCapabilities from "@/home/components/home/HomeCapabilities";
import HomeFooter from "@/home/components/home/HomeFooter";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden bg-(--bg)">
      <HomeBackground />

      <main className="relative z-10 mx-auto w-full max-w-360 px-8 pb-24 pt-38">
        <HomeHero />
        <HomeCapabilities />
      </main>

      <div className="relative z-10">
        <HomeFooter />
      </div>
    </div>
  );
}