"use client";

import { useState } from "react";
import { Lock, X } from "lucide-react";
import { useAuth } from "../context/AuthProvider";
import { ModalShell } from "@/shared/components/ModalShell";

interface AuthModalProps {
  open: boolean;
  initialMode?: "login" | "register";
  onClose: () => void;
}

const INPUT_CLASS =
  "w-full rounded-xl border border-(--border) bg-(--bg) px-4 py-2.5 text-sm text-(--text) outline-none transition-colors placeholder:text-(--text-muted) focus:border-(--accent)/70";

export function AuthModal({
  open,
  initialMode = "login",
  onClose,
}: AuthModalProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [wasOpen, setWasOpen] = useState(open);
  const [identifier, setIdentifier] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setMode(initialMode);
      setError(null);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === "login") {
        await login(identifier, password);
      } else {
        await register(username, email, password);
      }
      setPassword("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error inesperado de autenticación",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      labelledBy="auth-modal-title"
      maxWidthClass="max-w-md"
    >
      <div className="flex items-center justify-between border-b border-(--border) px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--accent-soft) text-(--accent-light)">
            <Lock className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <h2
              id="auth-modal-title"
              className="font-display text-lg font-semibold text-(--text)"
            >
              {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
            </h2>
            <p className="text-xs text-(--text-muted)">
              Accede a tus notas privadas y ejecución de código
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-(--text-muted) transition-colors hover:bg-(--bg-3) hover:text-(--text) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
          aria-label="Cerrar ventana"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
        {mode === "login" ? (
          <div>
            <label
              htmlFor="auth-identifier"
              className="mb-1.5 block text-xs font-medium text-(--text-secondary)"
            >
              Usuario o correo electrónico
            </label>
            <input
              id="auth-identifier"
              name="identifier"
              type="text"
              required
              autoComplete="username"
              spellCheck={false}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className={INPUT_CLASS}
              placeholder="usuario o correo@ejemplo.com"
            />
          </div>
        ) : (
          <>
            <div>
              <label
                htmlFor="auth-username"
                className="mb-1.5 block text-xs font-medium text-(--text-secondary)"
              >
                Nombre de usuario
              </label>
              <input
                id="auth-username"
                name="username"
                type="text"
                required
                minLength={3}
                maxLength={50}
                autoComplete="username"
                spellCheck={false}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={INPUT_CLASS}
                placeholder="mi_usuario"
              />
            </div>
            <div>
              <label
                htmlFor="auth-email"
                className="mb-1.5 block text-xs font-medium text-(--text-secondary)"
              >
                Correo electrónico
              </label>
              <input
                id="auth-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                spellCheck={false}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={INPUT_CLASS}
                placeholder="correo@ejemplo.com"
              />
            </div>
          </>
        )}

        <div>
          <label
            htmlFor="auth-password"
            className="mb-1.5 block text-xs font-medium text-(--text-secondary)"
          >
            Contraseña
          </label>
          <input
            id="auth-password"
            name="password"
            type="password"
            required
            minLength={mode === "register" ? 10 : 1}
            maxLength={128}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={INPUT_CLASS}
            placeholder="••••••••••"
          />
          {mode === "register" && (
            <p className="mt-1.5 text-xs text-(--text-muted)">
              Mínimo 10 caracteres con mayúsculas, minúsculas, números y símbolo.
            </p>
          )}
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-(--error)/30 bg-(--error)/10 px-3.5 py-2.5 text-xs text-(--error)"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="h-10 w-full rounded-lg bg-(--accent) text-sm font-semibold text-(--accent-fg) transition-colors hover:bg-(--accent-light) disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
        >
          {submitting
            ? "Procesando…"
            : mode === "login"
              ? "Entrar"
              : "Crear cuenta"}
        </button>

        <div className="pt-1 text-center">
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError(null);
            }}
            className="rounded text-xs text-(--text-secondary) transition-colors hover:text-(--accent-light) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
          >
            {mode === "login"
              ? "¿No tienes cuenta? Regístrate"
              : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
