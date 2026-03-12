'use client'
import { usePathname } from 'next/navigation'
import { Navbar } from './Navbar'

export function ConditionalNavbar() {
  const pathname = usePathname()
  if (pathname.startsWith('/docs') || pathname.startsWith('/notes')) return null
  return <Navbar />
}