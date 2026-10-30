/**

ruta: frontend/src/shared/components/home/HomeFooter.tsx

* Renderiza el pie de página de WikiDev, proporcionando acceso a la identidad
* visual del proyecto, sus secciones principales y su repositorio en GitHub.
* Organiza el contenido en tres áreas: presentación de la aplicación con su
* logotipo y descripción, navegación hacia la documentación y las notas, y
* enlaces relacionados con el proyecto. Define los enlaces de navegación en
* una estructura de datos reutilizable que asocia cada destino con su título
* e icono correspondiente. Incorpora elementos decorativos mediante degradados
* y efectos visuales coherentes con la identidad gráfica de WikiDev, además
* de adaptar la distribución a distintos tamaños de pantalla. La barra inferior
* muestra automáticamente el año actual y las tecnologías principales utilizadas
* en la aplicación.

**/


import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  FileText,
  Github,
} from "lucide-react";

const footerLinks = [
  {
    title: "Documentación",
    href: "/docs",
    icon: BookOpen,
  },
  {
    title: "Notas",
    href: "/notes",
    icon: FileText,
  },
];

export default function HomeFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-(--border) bg-(--bg-2)/70 px-6">
      {/* Subtle top accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(124,109,250,0.45), rgba(6,214,160,0.3), transparent)",
        }}
      />

      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/4 h-64 w-96 rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse, rgba(124,109,250,0.18), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-360">
        {/* Main footer */}
        <div className="grid gap-14 py-16 md:grid-cols-[1.5fr_1fr] md:gap-20 md:py-20">
          {/* Brand */}
          <div className="flex max-w-xl flex-col items-start">
            <Link
              href="/"
              aria-label="Ir al inicio"
              className="inline-flex items-center transition-opacity duration-200 hover:opacity-80"
            >
              <Image
                src="/images/branding/wikidev-logo.svg"
                alt="WikiDev"
                width={280}
                height={90}
                priority={false}
                className="h-auto w-64 object-contain sm:w-72"
              />
            </Link>

            <p className="mt-6 max-w-md text-sm leading-7 text-(--text-muted)">
              Un espacio para consultar documentación técnica, comprender
              conceptos y experimentar con código. Conocimiento organizado
              para aprender y construir.
            </p>

            <a
              href="https://github.com/Vitolofs7/WikiDev"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-7 inline-flex items-center gap-3 rounded-xl border border-(--border-hover) bg-white/2 px-4 py-3 text-sm font-medium text-(--text-secondary) transition-all duration-200 hover:border-(--accent)/40 hover:bg-white/4 hover:text-(--text)"
            >
              <Github className="h-4 w-4 text-(--text-muted) transition-colors group-hover:text-(--text)" />

              <span>Explorar el repositorio</span>

              <ArrowUpRight className="h-4 w-4 text-(--text-muted) transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 gap-8 md:justify-self-end md:gap-16">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-(--text-muted)">
                Explorar
              </h2>

              <nav
                aria-label="Enlaces de navegación del pie de página"
                className="mt-6 flex flex-col gap-5"
              >
                {footerLinks.map(({ title, href, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="group inline-flex w-fit items-center gap-3 text-sm text-(--text-secondary) transition-colors duration-200 hover:text-(--text)"
                  >
                    <Icon className="h-4 w-4 text-(--text-muted) transition-colors group-hover:text-(--accent-light)" />
                    <span>{title}</span>
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-(--text-muted)">
                Proyecto
              </h2>

              <div className="mt-6 flex flex-col gap-5">
                <a
                  href="https://github.com/Vitolofs7/WikiDev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex w-fit items-center gap-2 text-sm text-(--text-secondary) transition-colors duration-200 hover:text-(--text)"
                >
                  GitHub
                  <ArrowUpRight className="h-3.5 w-3.5 text-(--text-muted) transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t border-(--border) py-6 text-xs text-(--text-muted) sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} WikiDev. Todos los derechos reservados.
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <span>Construido con</span>
            <span className="text-(--text-secondary)">Next.js</span>
            <span className="text-(--accent)">·</span>
            <span className="text-(--text-secondary)">MDX</span>
          </div>
        </div>
      </div>
    </footer>
  );
}