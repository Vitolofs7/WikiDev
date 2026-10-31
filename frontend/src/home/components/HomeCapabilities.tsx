/**
* Renderiza la sección de capacidades de la página principal de WikiDev,
* presentando visualmente las principales herramientas que ofrece la aplicación:
* Code Runner, notas personales y documentación enriquecida mediante MDX.
* Organiza cada funcionalidad en tarjetas con descripciones, características
* destacadas y vistas previas de su interfaz, utilizando iconos de Lucide y
* estilos adaptables a distintos tamaños de pantalla. El componente Code Runner
* incluye una demostración interactiva que actualiza el estado de ejecución y
* muestra una salida de ejemplo al pulsar el botón correspondiente. Las secciones
* de notas y MDX ilustran sus posibilidades de edición, formato, incorporación
* de imágenes e integración de componentes React en el contenido documental.
* Su finalidad es comunicar las funcionalidades de WikiDev mediante ejemplos
* visuales representativos, sin implementar dentro de estas vistas previas la
* funcionalidad completa de las herramientas que describen.

*/
"use client";

import { useState } from "react";
import {
  BookOpen,
  Code2,
  ArrowRight,
  Terminal,
  Bold,
  Download,
  Maximize2,
  FileText,
} from "lucide-react";

import { Image as ImageIcon } from "lucide-react";


export default function HomeCapabilities() {
  const [hasRun, setHasRun] = useState(false);

  return (
    <section className="mt-16 mb-24">
      {/* Section heading */}
      <div className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-10 bg-(--accent)/50" />
          <span className="font-mono text-base uppercase tracking-[0.2em] text-(--accent-light)">
            Capacidades
          </span>
        </div>

        <h2
          className="mb-4 text-4xl font-bold tracking-tight text-(--text) sm:text-5xl"
        >
          Herramientas para trabajar
          <br className="hidden sm:block" /> con el conocimiento.
        </h2>

        <p
          className="max-w-2xl text-lg leading-relaxed text-(--text-muted)"
        >
          WikiDev combina documentación técnica con herramientas integradas para
          consultar, entender y experimentar con el contenido.
        </p>
      </div>

      {/* Code Runner */}
      <div
        className="group relative mb-6 overflow-hidden rounded-3xl p-5 sm:p-8 lg:p-10"
        style={{
          background:
            "linear-gradient(135deg, rgba(124,109,250,0.12), rgba(14,14,26,0.97) 45%, rgba(6,214,160,0.06))",
          border: "1px solid rgba(124,109,250,0.2)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.24)",
        }}
      >
        {/* Ambient decoration */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-(--accent)/10 blur-3xl transition-opacity duration-500 group-hover:opacity-80"
        />

        <div className="relative grid items-center gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
          {/* Feature description */}
          <div className="flex flex-col items-start">
            <div className="mb-6 flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{
                  background: "rgba(124,109,250,0.13)",
                  border: "1px solid rgba(124,109,250,0.22)",
                  boxShadow: "0 8px 28px rgba(124,109,250,0.10)",
                }}
              >
                <Code2 className="h-6 w-6 text-(--accent-light)" />
              </div>

              <div>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-(--accent-light)">
                  Aprende haciendo
                </p>
                <h3
                  className="text-2xl font-semibold tracking-tight text-(--text)"
                >
                  Code Runner
                </h3>
              </div>
            </div>

            <h4
              className="mb-4 max-w-md text-3xl font-bold leading-tight tracking-tight text-(--text) sm:text-4xl"
            >
              Del código a la práctica,{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "var(--gradient-brand)" }}
              >
                sin salir de WikiDev.
              </span>
            </h4>

            <p
              className="mb-7 max-w-lg text-base leading-7 text-(--text-secondary)"
            >
              Experimenta con ejemplos directamente desde la documentación,
              modifica el código y comprueba los resultados sin interrumpir tu
              lectura.
            </p>

            {/* Feature highlights */}
            <div className="mb-8 grid w-full max-w-lg gap-5 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <div
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: "rgba(6,214,160,0.09)" }}
                >
                  <Terminal className="h-4 w-4 text-(--accent-2-light)" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-(--text)">
                    Prueba el código
                  </p>
                  <p className="mt-1 text-sm leading-5 text-(--text-muted)">
                    Explora ejemplos y observa su salida.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: "rgba(124,109,250,0.12)" }}
                >
                  <BookOpen className="h-4 w-4 text-(--accent-light)" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-(--text)">
                    Aprende con contexto
                  </p>
                  <p className="mt-1 text-sm leading-5 text-(--text-muted)">
                    Conecta la teoría con ejemplos concretos.
                  </p>
                </div>
              </div>
            </div>

            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-2"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-(--accent-2)" />
              <span className="font-mono text-[11px] text-(--text-muted)">
                Código · Ejecución · Resultado
              </span>
            </div>
          </div>

          {/* Editor preview */}
          <div
            className="min-w-0 overflow-hidden rounded-2xl"
            style={{
              background: "var(--bg)",
              border: "1px solid rgba(255,255,255,0.09)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            {/* Editor title bar */}
            <div
              className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5"
              style={{
                background: "rgba(255,255,255,0.018)",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="flex shrink-0 items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
                </div>

                <span className="ml-2 truncate font-mono text-xs text-(--text-secondary)">
                  hello.js
                </span>
              </div>

              <span
                className="shrink-0 rounded-md px-2.5 py-1 font-mono text-[10px] font-medium"
                style={{
                  color: "var(--accent-light)",
                  background: "rgba(124,109,250,0.10)",
                  border: "1px solid rgba(124,109,250,0.15)",
                }}
              >
                JavaScript
              </span>
            </div>

            {/* Editor and console */}
            <div className="grid sm:grid-cols-[1.1fr_0.9fr]">
              {/* Code panel */}
              <div className="flex min-w-0 flex-col p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-(--text-muted)">
                    Editor
                  </span>
                  <span className="font-mono text-[10px] text-(--text-muted)">
                    Línea 1
                  </span>
                </div>

                <div
                  className="min-h-28 overflow-x-auto rounded-xl p-4"
                  style={{
                    background: "rgba(255,255,255,0.018)",
                    border: "1px solid rgba(255,255,255,0.045)",
                  }}
                >
                  <pre className="font-mono text-xs leading-7 sm:text-sm">
                    <code>
                      <span className="mr-4 select-none text-(--text-muted)/50">
                        1
                      </span>
                      <span className="text-(--accent-light)">console</span>
                      <span className="text-(--text-secondary)">.</span>
                      <span className="text-(--accent-2-light)">log</span>
                      <span className="text-(--text-secondary)">(</span>
                      <span className="text-amber-200">
                        &quot;Hello, WikiDev!&quot;
                      </span>
                      <span className="text-(--text-secondary)">);</span>
                    </code>
                  </pre>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[11px] text-(--text-muted)">
                    {hasRun ? "Ejecución completada" : "Ejemplo preparado"}
                  </span>

                  <button
                    type="button"
                    onClick={() => setHasRun(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0"
                    style={{
                      background: "var(--gradient-brand)",
                      boxShadow: "0 5px 20px rgba(124,109,250,0.18)",
                    }}
                  >
                    <Terminal className="h-3.5 w-3.5" />
                    Ejecutar
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Output panel */}
              <div
                className="min-w-0 p-4 sm:p-5 sm:border-l"
                style={{
                  background: "rgba(255,255,255,0.012)",
                  borderColor: "rgba(255,255,255,0.06)",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="mb-4 flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-(--text-muted)">
                    Consola
                  </span>

                  <span className="inline-flex items-center gap-1.5 text-[10px] text-(--accent-2-light)">
                    <span className="h-1.5 w-1.5 rounded-full bg-(--accent-2)" />
                    Salida
                  </span>
                </div>

                <div
                  className="min-h-28 rounded-xl p-4"
                  style={{
                    background: "rgba(6,214,160,0.035)",
                    border: "1px solid rgba(6,214,160,0.10)",
                  }}
                >
                  <p className="mb-3 font-mono text-[10px] text-(--text-muted)">
                    {">"} node hello.js
                  </p>

                  <p
                    aria-live="polite"
                    className="wrap-break-word font-mono text-sm leading-6 text-(--accent-2-light)"
                  >
                    {hasRun
                      ? "Hello, WikiDev!"
                      : "Pulsa Ejecutar para ver la salida."}
                  </p>

                  {hasRun && (
                    <p className="mt-3 font-mono text-[10px] text-(--text-muted)">
                      Process finished with exit code 0
                    </p>
                  )}
                </div>

                <p className="mt-4 text-xs leading-5 text-(--text-muted)">
                  Vista de ejemplo del resultado en consola.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes + MDX */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Notes */}
        <div
          className="group relative overflow-hidden rounded-3xl p-6 transition-colors duration-300 sm:p-7"
          style={{
            background:
              "linear-gradient(145deg, rgba(6,214,160,0.08), var(--bg-2) 48%, rgba(124,109,250,0.04))",
            border: "1px solid rgba(6,214,160,0.18)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
          }}
        >
          {/* Ambient decoration */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-(--accent-2)/10 blur-3xl transition-opacity duration-500 group-hover:opacity-80"
          />

          {/* Header */}
          <div className="relative mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-[0.16em] text-(--accent-2-light)">
                Tu espacio personal
              </p>

              <h3
                className="text-2xl font-semibold tracking-tight text-(--text)"
              >
                Notas
              </h3>
            </div>

            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
              style={{
                background: "rgba(6,214,160,0.10)",
                border: "1px solid rgba(6,214,160,0.20)",
              }}
            >
              <BookOpen className="h-5 w-5 text-(--accent-2-light)" />
            </div>
          </div>

          <p className="relative mb-6 max-w-xl text-sm leading-6 text-(--text-secondary)">
            Un espacio flexible para desarrollar tus ideas, dar formato a tus
            apuntes, incorporar imágenes y conservar toda la información en un
            mismo documento.
          </p>

          {/* Document editor preview */}
          <div
            className="relative overflow-hidden rounded-2xl"
            style={{
              background: "var(--bg)",
              border: "1px solid var(--border-hover)",
              boxShadow: "0 16px 40px rgba(0,0,0,0.2)",
            }}
          >
            {/* Document title bar */}
            <div
              className="flex items-center justify-between gap-3 px-4 py-3"
              style={{
                background: "rgba(255,255,255,0.018)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <FileText className="h-4 w-4 shrink-0 text-(--accent-2-light)" />

                <span className="truncate font-mono text-xs text-(--text-secondary)">
                  Mis apuntes
                </span>
              </div>

              <span
                className="shrink-0 rounded-md px-2 py-1 font-mono text-[10px]"
                style={{
                  color: "var(--accent-2-light)",
                  background: "rgba(6,214,160,0.08)",
                  border: "1px solid rgba(6,214,160,0.14)",
                }}
              >
                Documento
              </span>
            </div>

            {/* Formatting toolbar */}
            <div
              className="flex flex-wrap items-center gap-1.5 px-3 py-2.5"
              style={{
                background: "rgba(255,255,255,0.012)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span
                className="mr-1 rounded-md px-2 py-1.5 font-mono text-[10px] text-(--text-secondary)"
                style={{ background: "rgba(255,255,255,0.035)" }}
              >
                Texto
              </span>

              <span
                className="flex h-7 w-7 items-center justify-center rounded-md text-(--text-secondary)"
                style={{ background: "rgba(255,255,255,0.035)" }}
              >
                <Bold className="h-3.5 w-3.5" />
              </span>

              <span
                className="flex h-7 w-7 items-center justify-center rounded-md font-serif text-sm italic text-(--text-secondary)"
                style={{ background: "rgba(255,255,255,0.035)" }}
              >
                I
              </span>

              <span
                className="flex h-7 w-7 items-center justify-center rounded-md text-(--text-secondary)"
                style={{ background: "rgba(255,255,255,0.035)" }}
              >
                <ImageIcon className="h-3.5 w-3.5" />
              </span>

              <span className="mx-1 h-5 w-px bg-white/10" />

              <span
                className="flex h-7 items-center gap-1.5 rounded-md px-2 text-[10px] text-(--text-muted)"
                style={{ background: "rgba(255,255,255,0.025)" }}
              >
                <Download className="h-3 w-3" />
                Exportar
              </span>
            </div>

            {/* Page content */}
            <div className="p-4 sm:p-5">
              <div className="grid gap-4 sm:grid-cols-[1fr_0.85fr]">
                {/* Text content */}
                <div className="min-w-0">
                  <h4
                    className="mb-3 text-base font-semibold tracking-tight text-(--text)"
                  >
                    Conceptos de Python
                  </h4>

                  <p className="mb-3 text-xs leading-5 text-(--text-secondary)">
                    La función{" "}
                    <code className="rounded bg-white/5 px-1 py-0.5 text-(--accent-2-light)">
                      print()
                    </code>{" "}
                    permite mostrar información en la salida estándar.
                  </p>

                  <p className="mb-4 text-xs leading-5 text-(--text-muted)">
                    Recuerda diferenciar entre el código que se ejecuta y los
                    comentarios que explican su propósito.
                  </p>

                  {/* Highlighted note */}
                  <div
                    className="rounded-lg px-3 py-2.5"
                    style={{
                      background: "rgba(6,214,160,0.045)",
                      borderLeft: "2px solid rgba(6,214,160,0.65)",
                    }}
                  >
                    <p className="text-[11px] leading-5 text-(--text-secondary)">
                      <span className="font-semibold text-(--accent-2-light)">
                        Idea clave:
                      </span>{" "}
                      un buen comentario explica el porqué de una decisión.
                    </p>
                  </div>
                </div>

                {/* Image gallery preview */}
                <div className="min-w-0">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.13em] text-(--text-muted)">
                      Galería de imágenes
                    </span>

                    <span className="font-mono text-[10px] text-(--text-muted)">
                      03
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Main image placeholder */}
                    <div
                      className="relative col-span-2 flex h-24 items-center justify-center overflow-hidden rounded-xl"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(124,109,250,0.14), rgba(6,214,160,0.08))",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <ImageIcon className="h-5 w-5 text-(--accent-light)" />

                        <span className="text-[10px] text-(--text-muted)">
                          Imagen insertada
                        </span>
                      </div>

                      <span
                        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-md text-(--text-secondary)"
                        style={{
                          background: "rgba(14,14,26,0.75)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <Maximize2 className="h-3 w-3" />
                      </span>
                    </div>

                    {/* Additional images */}
                    <div
                      className="flex h-14 items-center justify-center rounded-lg"
                      style={{
                        background: "rgba(124,109,250,0.07)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <ImageIcon className="h-4 w-4 text-(--accent-light)" />
                    </div>

                    <div
                      className="flex h-14 items-center justify-center rounded-lg"
                      style={{
                        background: "rgba(6,214,160,0.05)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <ImageIcon className="h-4 w-4 text-(--accent-2-light)" />
                    </div>
                  </div>

                  <p className="mt-2 text-[10px] leading-4 text-(--text-muted)">
                    Varias imágenes en un mismo documento.
                  </p>
                </div>
              </div>

              {/* Document footer */}
              <div
                className="mt-5 flex flex-wrap items-center justify-between gap-2 pt-3"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <span className="flex items-center gap-2 text-[10px] text-(--text-muted)">
                  <span className="h-1.5 w-1.5 rounded-full bg-(--accent-2)" />
                  Texto e imágenes en un solo lugar
                </span>

                <span className="font-mono text-[10px] text-(--text-muted)">
                  Vista previa
                </span>
              </div>
            </div>
          </div>

          {/* Planned capabilities */}
          <div className="relative mt-5 flex flex-wrap gap-2">
            {[
              "Formato de texto",
              "Imágenes múltiples",
              "Vista ampliada",
              "Exportación",
            ].map((feature) => (
              <span
                key={feature}
                className="rounded-full px-3 py-1.5 text-[11px] text-(--text-secondary)"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid var(--border)",
                }}
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* MDX */}
        <div
          className="group relative overflow-hidden rounded-3xl p-6 transition-colors duration-300 sm:p-7"
          style={{
            background:
              "linear-gradient(145deg, rgba(124,109,250,0.09), var(--bg-2) 48%, rgba(6,214,160,0.035))",
            border: "1px solid rgba(124,109,250,0.2)",
          }}
        >
          {/* Ambient decoration */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-(--accent)/10 blur-3xl transition-opacity duration-500 group-hover:opacity-80"
          />

          {/* Header */}
          <div className="relative mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-[0.16em] text-(--accent-light)">
                Documentación enriquecida
              </p>

              <h3
                className="text-2xl font-semibold tracking-tight text-(--text)"
              >
                MDX
              </h3>
            </div>

            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
              style={{
                background: "rgba(124,109,250,0.12)",
                border: "1px solid rgba(124,109,250,0.2)",
              }}
            >
              <BookOpen className="h-5 w-5 text-(--accent-light)" />
            </div>
          </div>

          {/* Description */}
          <p className="relative mb-6 max-w-xl text-sm leading-6 text-(--text-secondary)">
            Combina texto, bloques de código y componentes interactivos en una
            misma página para crear documentación técnica más clara y práctica.
          </p>

          {/* MDX editor preview */}
          <div
            className="relative overflow-hidden rounded-2xl"
            style={{
              background: "var(--bg)",
              border: "1px solid var(--border-hover)",
              boxShadow: "0 16px 40px rgba(0,0,0,0.18)",
            }}
          >
            {/* Editor title bar */}
            <div
              className="flex items-center justify-between gap-3 px-4 py-3"
              style={{
                background: "rgba(255,255,255,0.018)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="flex shrink-0 items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-400/70" />
                  <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
                  <span className="h-2 w-2 rounded-full bg-green-400/70" />
                </div>

                <span className="truncate font-mono text-xs text-(--text-secondary)">
                  composicion-de-funciones.mdx
                </span>
              </div>

              <span
                className="shrink-0 rounded-md px-2 py-1 font-mono text-[10px]"
                style={{
                  color: "var(--accent-light)",
                  background: "rgba(124,109,250,0.10)",
                  border: "1px solid rgba(124,109,250,0.15)",
                }}
              >
                MDX
              </span>
            </div>

            {/* Source and rendered document */}
            <div className="grid sm:grid-cols-2">
              {/* Source */}
              <div className="min-w-0 p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-(--text-muted)">
                    Código fuente
                  </span>

                  <Code2 className="h-3.5 w-3.5 text-(--text-muted)" />
                </div>

                <div
                  className="min-h-40 overflow-x-auto rounded-xl p-3.5 sm:p-4"
                  style={{
                    background: "rgba(255,255,255,0.018)",
                    border: "1px solid rgba(255,255,255,0.045)",
                  }}
                >
                  <div className="space-y-3 font-mono text-xs leading-5">
                    <p className="whitespace-nowrap">
                      <span className="mr-3 select-none text-(--text-muted)/50">
                        1
                      </span>
                      <span className="text-(--accent-light)">## </span>
                      <span className="text-(--text)">
                        Composición de funciones
                      </span>
                    </p>

                    <p>
                      <span className="mr-3 select-none text-(--text-muted)/50">
                        2
                      </span>
                      <span className="text-(--text-muted)">
                        Combina funciones para...
                      </span>
                    </p>

                    <p className="whitespace-nowrap">
                      <span className="mr-3 select-none text-(--text-muted)/50">
                        3
                      </span>
                      <span className="text-(--accent-light)">
                        {"<CodeRunner"}
                      </span>
                      <span className="text-(--text-secondary)">{" />"}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-(--accent)" />
                  <span className="text-[11px] text-(--text-muted)">
                    Markdown + componentes React
                  </span>
                </div>
              </div>

              {/* Rendered preview */}
              <div
                className="min-w-0 p-4 sm:border-l sm:p-5"
                style={{
                  background: "rgba(255,255,255,0.012)",
                  borderColor: "var(--border)",
                  borderTop: "1px solid var(--border)",
                }}
              >
                <div className="mb-4 flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-(--text-muted)">
                    Vista del documento
                  </span>

                  <span className="inline-flex items-center gap-1.5 text-[10px] text-(--accent-2-light)">
                    <span className="h-1.5 w-1.5 rounded-full bg-(--accent-2)" />
                    Renderizado
                  </span>
                </div>

                <div className="min-h-40">
                  <h4
                    className="mb-3 text-base font-semibold tracking-tight text-(--text)"
                  >
                    Composición de funciones
                  </h4>

                  <p className="mb-4 text-xs leading-5 text-(--text-muted)">
                    Combina funciones para construir operaciones más complejas a
                    partir de otras más simples.
                  </p>

                  <div
                    className="overflow-hidden rounded-xl"
                    style={{
                      background: "rgba(124,109,250,0.07)",
                      border: "1px solid rgba(124,109,250,0.13)",
                    }}
                  >
                    <div
                      className="flex items-center gap-2 px-3 py-2"
                      style={{
                        borderBottom: "1px solid rgba(124,109,250,0.12)",
                      }}
                    >
                      <Code2 className="h-3.5 w-3.5 text-(--accent-light)" />
                      <span className="text-[11px] font-medium text-(--text-secondary)">
                        Ejemplo interactivo
                      </span>
                    </div>

                    <div className="px-3 py-3">
                      <div className="mb-2 font-mono text-xs text-(--accent-2-light)">
                        f(g(x))
                      </div>

                      <p className="text-[11px] leading-5 text-(--text-muted)">
                        El componente se integra dentro del contenido de la
                        lección.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature footer */}
          <div className="relative mt-5 flex flex-wrap gap-2">
            {[
              "Contenido estructurado",
              "Código integrado",
              "Componentes React",
            ].map((feature) => (
              <span
                key={feature}
                className="rounded-full px-3 py-1.5 text-[11px] text-(--text-secondary)"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid var(--border)",
                }}
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
        
        
      </div>
    </section>
  );
}
