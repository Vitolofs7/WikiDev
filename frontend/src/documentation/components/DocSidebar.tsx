/**
 * Ruta: frontend/src/documentation/components/DocSidebar.tsx
 *
 * Implementa la barra lateral de navegación del módulo de documentación de WikiDev,
 * integrando el acceso a la página principal, las categorías documentales y el buscador
 * global. Permite abrir el modal de búsqueda mediante interacción directa, utilizando
 * el contexto global SearchProvider. Identifica la categoría activa según la ruta actual
 * y aplica los estilos e iconos correspondientes a cada sección. También muestra el
 * historial de documentos visitados mediante el hook useHistory, permite eliminar
 * los registros recientes y organiza los elementos en una interfaz fija con navegación
 * desplazable y una sección de pie de página con la versión de la aplicación.
 */

"use client";

import { langIcons, langColors } from "@/shared/components/LangIcons";
import { Logo } from "@/shared/components/Logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { navConfig } from "@/navigation/config/nav.config";
import { cn } from "@/shared/utils/cn";
import { useHistory } from "@/history/hooks/useHistory";
import { useSearchModal } from "@/search/components/SearchProvider";
import { Clock, Search, Home } from "lucide-react";
import { docPath } from "@/shared/utils/routes";

function subscribeToMount() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function DocSidebar() {
  const pathname = usePathname();
  const { open } = useSearchModal();
  const { history = [], clearHistory } = useHistory();

  const mounted = useSyncExternalStore(
    subscribeToMount,
    getClientSnapshot,
    getServerSnapshot,
  );

  return (
    <aside
      className="w-80 shrink-0 sticky top-0 h-screen overflow-y-auto border-r border-white/5 flex flex-col"
      style={{ background: "#0a0a14" }}
    >
      <div className="p-5 flex flex-col h-full">
        <Logo compact className="mb-5 px-2 py-1" />

        {/* Search */}
        <button
          type="button"
          onClick={open}
          className="flex items-center gap-3 px-4 py-3 rounded-xl mb-2 w-full text-left transition-all group"
          style={{
            background: "#14141f",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Search className="w-5 h-5 text-[#7c6dfa] shrink-0" />

          <span className="flex-1 text-base text-[#52526e]">Buscar...</span>

          <kbd className="px-2 py-0.5 rounded text-xs bg-[rgba(124,109,250,0.1)] text-[#7c6dfa] border border-[rgba(124,109,250,0.2)] font-mono">
            Ctrl+K
          </kbd>
        </button>

        {/* Home */}
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl mb-4 text-base transition-all",
            pathname === "/"
              ? "text-white bg-white/8"
              : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5",
          )}
        >
          <Home className="w-5 h-5" />
          <span className="font-medium">Inicio</span>
        </Link>

        {/* Divider */}
        <div className="h-px bg-white/5 mb-4" />

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto space-y-1">
          {navConfig.categories.map((category) => {
            const isActive = pathname.startsWith(docPath(category.slug));

            const color = langColors[category.slug] || "#a89cf7";
            const Icon = langIcons[category.slug];

            return (
              <Link
                key={category.slug}
                href={docPath(category.slug)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-base transition-all group relative",
                  isActive
                    ? "text-white"
                    : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5",
                )}
              >
                {isActive && (
                  <span
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(124,109,250,0.12), rgba(6,214,160,0.04))",
                      border: "1px solid rgba(124,109,250,0.2)",
                    }}
                  />
                )}

                <span
                  className="relative z-10 w-5 h-5 flex items-center justify-center shrink-0"
                  style={{ color: isActive ? color : "#52526e" }}
                >
                  {Icon ? (
                    <Icon className="w-5 h-5" />
                  ) : (
                    <span className="text-sm">{category.emoji}</span>
                  )}
                </span>

                <span className="relative z-10 font-medium">
                  {category.title}
                </span>

                {isActive && (
                  <span className="ml-auto relative z-10 w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Recent */}
        {mounted && history.length > 0 && (
          <div className="pt-4 border-t border-white/5 mb-4">
            <div className="flex items-center justify-between mb-2 px-2">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">
                Recientes
              </p>

              <button
                type="button"
                onClick={clearHistory}
                className="text-xs text-zinc-600 hover:text-violet-400 transition-colors"
              >
                limpiar
              </button>
            </div>

            <ul className="space-y-0.5">
              {history.map(
                (item: import("@/history/hooks/useHistory").HistoryItem) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all group",
                        pathname === item.href
                          ? "text-white bg-white/5"
                          : "text-zinc-600 hover:text-zinc-300 hover:bg-white/5",
                      )}
                    >
                      <Clock className="w-4 h-4 shrink-0 text-zinc-700 group-hover:text-violet-400 transition-colors" />

                      <span className="truncate">{item.title}</span>
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-white/5">
          <p className="text-xs text-zinc-700 px-2 font-mono">wikidev v0.1.0</p>
        </div>
      </div>
    </aside>
  );
}
