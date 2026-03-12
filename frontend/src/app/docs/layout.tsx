'use client'
import { DocSidebar } from '@/documentation/components/DocSidebar'

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <DocSidebar />
      <div className="flex-1 min-w-0 py-10 px-20 text-lg">
        {children}
      </div>
    </div>
  )
}