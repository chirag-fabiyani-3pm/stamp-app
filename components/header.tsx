"use client"

import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { HeaderActions } from "./header-actions"

interface HeaderProps {
  setIsOpen: (isOpen: boolean) => void;
}

export default function Header({ setIsOpen }: HeaderProps) {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith('/admin')
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by only showing theme-dependent content after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Use light theme as default during SSR to prevent hydration mismatch
  const logoSrc = mounted && resolvedTheme === "dark" ? "/icons/logo-dark.png" : "/icons/logo-light.png"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link href={isAdminRoute ? "/admin" : "/"} className="flex items-center gap-2 font-semibold">
          <Image src={logoSrc} alt="Stamps of Approval" width={220} height={220} />
          <span className="hidden font-bold sm:inline-block text-primary">
            {isAdminRoute ? "SOA Admin" : ""}
          </span>
        </Link>
        <HeaderActions setIsOpen={setIsOpen} />
      </div>
    </header>
  )
}
