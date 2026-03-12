import { langIcons, langColors } from "@/shared/components/LangIcons";
import Link from "next/link";
import {
  ArrowRight,
  Code2,
  BookOpen,
  Search,
  Zap,
  Terminal,
} from "lucide-react";
import { navConfig } from "@/navigation/config/nav.config";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background effects */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(ellipse, rgba(124,109,250,0.4) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-[30%] right-[5%] w-[400px] h-[400px] rounded-full opacity-10"
        style={{
          background:
            "radial-gradient(ellipse, rgba(6,214,160,0.4) 0%, transparent 70%)",
        }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-24">
        {/* Hero */}
        <div className="text-center mb-24">
          <p className="text-zinc-600 text-sm mb-8 font-mono">
            última actualización —{" "}
            {new Date().toLocaleDateString("es-ES", {
              month: "long",
              year: "numeric",
            })}
          </p>

          <h1
            className="text-9xl font-extrabold leading-none tracking-tighter mb-6"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            <span className="text-white">Wiki</span>
            <span
              style={{
                background: "linear-gradient(135deg, #7c6dfa 0%, #06d6a0 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Dev
            </span>
          </h1>

          <p
            className="text-zinc-500 text-2xl max-w-md mx-auto leading-relaxed mb-8"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            Apuntes y ejemplos que voy acumulando
          </p>

          <div className="flex items-center justify-center gap-3">
            <Link
              href="/docs/javascript"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-bold text-white transition-all hover:scale-105"
              style={{
                fontFamily: "Outfit, sans-serif",
                background: "linear-gradient(135deg, #7c6dfa, #06d6a0)",
                boxShadow: "0 0 30px rgba(124,109,250,0.25)",
              }}
            >
              Explorar apuntes
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/docs/javascript/arrays"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-medium text-zinc-500 border border-white/8 hover:text-zinc-200 hover:bg-white/5 transition-all"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              <Terminal className="w-5 h-5" />
              Ver ejemplo
            </Link>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <h2
              className="text-3xl font-bold text-white"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Explorar
            </h2>
            <div
              className="flex-1 h-px"
              style={{
                background:
                  "linear-gradient(90deg, rgba(124,109,250,0.3), transparent)",
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {navConfig.categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/docs/${cat.slug}`}
                className="relative rounded-2xl p-6 overflow-hidden group transition-all hover:scale-[1.02]"
                style={{
                  background: "#0e0e1a",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {/* Glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background:
                      "radial-gradient(ellipse at top left, rgba(124,109,250,0.1), transparent 60%)",
                  }}
                />

                {/* Top bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(124,109,250,0.5), transparent)",
                  }}
                />

                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        background: `${langColors[cat.slug]}15`,
                        border: `1px solid ${langColors[cat.slug]}30`,
                      }}
                    >
                      {(() => {
                        const Icon = langIcons[cat.slug];
                        return Icon ? (
                          <Icon
                            className="w-6 h-6"
                            color={langColors[cat.slug]}
                          />
                        ) : (
                          <span className="text-2xl">{cat.emoji}</span>
                        );
                      })()}
                    </div>
                    <span
                      className="text-xs font-mono px-2 py-1 rounded-full"
                      style={{
                        background: "rgba(124,109,250,0.1)",
                        color: "#a89cf7",
                        border: "1px solid rgba(124,109,250,0.2)",
                      }}
                    >
                      {cat.count} artículos
                    </span>
                  </div>

                  <h3
                    className="text-3xl font-bold text-white mb-2 group-hover:text-violet-300 transition-colors"
                    style={{ fontFamily: "Outfit, sans-serif" }}
                  >
                    {cat.title}
                  </h3>

                  <p
                    className="text-zinc-600 text-lg mb-6 leading-relaxed"
                    style={{ fontFamily: "Outfit, sans-serif" }}
                  >
                    {cat.description}
                  </p>

                  {/* Items preview */}
                  <div className="space-y-1.5 mb-6">
                    {cat.items.map((item) => (
                      <div
                        key={item.slug}
                        className="flex items-center gap-2 text-base text-zinc-600"
                      >
                        <span className="w-1 h-1 rounded-full bg-zinc-700" />
                        <span style={{ fontFamily: "Outfit, sans-serif" }}>
                          {item.title}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div
                    className="flex items-center gap-1 text-base font-medium text-violet-400 group-hover:gap-2 transition-all"
                    style={{ fontFamily: "Outfit, sans-serif" }}
                  >
                    Ver todos
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              icon: Code2,
              title: "Código ejecutable",
              desc: "JS y Python en el navegador",
            },
            {
              icon: BookOpen,
              title: "MDX nativo",
              desc: "Markdown + componentes React",
            },
            {
              icon: Search,
              title: "Búsqueda rápida",
              desc: "Fuzzy search instantáneo",
            },
            { icon: Zap, title: "Super rápido", desc: "Next.js estático" },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl p-4 group"
              style={{
                background: "#0e0e1a",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(124,109,250,0.15), rgba(6,214,160,0.15))",
                }}
              >
                <Icon className="w-4 h-4 text-violet-300" />
              </div>
              <h3
                className="text-white text-base font-semibold mb-1"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                {title}
              </h3>
              <p
                className="text-zinc-600 text-sm leading-relaxed"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}