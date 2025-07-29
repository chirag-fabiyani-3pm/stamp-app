"use client"

import React from "react"
import Link from "next/link"
import { HeaderActions } from "./header-actions"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"

export default function Header() {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith('/admin')
  const { theme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link href={isAdminRoute ? "/admin" : "/"} className="flex items-center gap-2 font-semibold">
          <Image src={theme === "dark" ? "/icons/logo-dark.png" : "/icons/logo-light.png"} alt="Stamps of Approval" width={320} height={320} />
          <span className="hidden font-bold sm:inline-block text-primary">
            {isAdminRoute ? "SOA Admin" : ""}
          </span>
        </Link>
        <HeaderActions />
      </div>
    </header>
  )
}
