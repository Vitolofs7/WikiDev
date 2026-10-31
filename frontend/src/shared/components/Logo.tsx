import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  compact?: boolean;
  variant?: "default" | "full";
  className?: string;
};

export function Logo({
  compact = false,
  variant = "default",
  className = "",
}: LogoProps) {
  if (variant === "full") {
    return (
      <Link
        href="/"
        aria-label="WikiDev - Inicio"
        className={`inline-flex items-center transition-opacity duration-200 hover:opacity-80 ${className}`}
      >
        <Image
          src="/images/branding/wikidev-logo.svg"
          alt="WikiDev"
          width={280}
          height={90}
          className="h-auto w-64 object-contain sm:w-72"
        />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      aria-label="WikiDev - Inicio"
      className={`flex shrink-0 items-center ${
        compact ? "gap-2.5" : "gap-3.5"
      } ${className}`}
    >
      <div
        className={`relative shrink-0 ${
          compact ? "h-11 w-11" : "h-14 w-14"
        }`}
      >
        <Image
          src="/images/branding/wikidev-icon.svg"
          alt=""
          fill
          className="object-contain"
          sizes={compact ? "44px" : "56px"}
        />
      </div>

      <span
        className={`font-extrabold tracking-tight text-(--text) ${
          compact ? "text-xl" : "text-[26px]"
        }`}
      >
        Wiki
        <span
          className="bg-clip-text text-transparent"
          style={{ backgroundImage: "var(--gradient-brand)" }}
        >
          Dev
        </span>
      </span>
    </Link>
  );
}
