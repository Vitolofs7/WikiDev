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
        className={`inline-flex items-center transition-opacity duration-200 hover:opacity-85 ${className}`}
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
      className={`flex shrink-0 items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light) ${
        compact ? "gap-2.5" : "gap-3.5"
      } ${className}`}
    >
      <div
        className={`relative shrink-0 ${
          compact ? "h-8 w-8" : "h-12 w-12"
        }`}
      >
        <Image
          src="/images/branding/wikidev-icon.svg"
          alt=""
          fill
          className="object-contain"
          sizes={compact ? "32px" : "48px"}
        />
      </div>

      <span
        translate="no"
        className={`font-display font-semibold tracking-[-0.02em] text-(--text) ${
          compact ? "text-[17px]" : "text-2xl"
        }`}
      >
        Wiki<span className="text-(--accent-light)">Dev</span>
      </span>
    </Link>
  );
}
