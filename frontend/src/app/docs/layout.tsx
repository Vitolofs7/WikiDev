import type { ReactNode } from "react";
import { DocsBackground } from "@/documentation/components/DocsBackground";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <DocsBackground />
      <div className="relative">{children}</div>
    </div>
  );
}
