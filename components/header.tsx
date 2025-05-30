"use client"

import Link from "next/link"
import { HeaderActions } from "./header-actions"
import Image from "next/image"
import { usePathname } from "next/navigation"

export default function Header() {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith('/admin')

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link href={isAdminRoute ? "/admin" : "/"} className="flex items-center gap-2 font-semibold">
          <Image src="/icons/icon-512x512.png" alt="Stamps of Approval" width={32} height={32} />
          <span className="hidden font-bold sm:inline-block text-primary">
            {isAdminRoute ? "SOA Admin" : "Stamps of Approval"}
          </span>
        </Link>
        <HeaderActions />
      </div>
    </header>
  )
}
