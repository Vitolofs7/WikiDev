import createMDX from "@next/mdx";

const withMDX = createMDX({});

const isProd = process.env.NODE_ENV === "production";

function resolveApiOrigins() {
  const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  try {
    const parsed = new URL(raw);
    const origins = new Set([parsed.origin]);
    // En desarrollo local permite tanto localhost como 127.0.0.1 para evitar bloqueos cross-site de cookies
    if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
      const alt = new URL(parsed.origin);
      alt.hostname = parsed.hostname === "localhost" ? "127.0.0.1" : "localhost";
      origins.add(alt.origin);
    }
    return Array.from(origins).join(" ");
  } catch {
    return "http://localhost:8000 http://127.0.0.1:8000";
  }
}

const apiOrigins = resolveApiOrigins();

const cspDirectives = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${apiOrigins}`,
  "font-src 'self' data:",
  `connect-src 'self' ${apiOrigins}${isProd ? "" : " ws://localhost:3000 ws://127.0.0.1:3000"}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspDirectives },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  ...(isProd
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains",
        },
      ]
    : []),
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default withMDX(nextConfig);
