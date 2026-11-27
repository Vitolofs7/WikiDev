import type { ReactNode } from "react";

export default function DocSlugLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-5 py-8 text-lg sm:px-8 lg:px-12 lg:py-10">
      {children}
    </div>
  );
}
