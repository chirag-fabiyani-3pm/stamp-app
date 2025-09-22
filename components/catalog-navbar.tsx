"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import Image from "next/image"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebarContext } from "./app-content"

interface CatalogNavbarProps {
  className?: string
}

export function CatalogNavbar({ className }: CatalogNavbarProps) {
  const { resolvedTheme } = useTheme()
  const { sidebarCollapsed } = useSidebarContext()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by only showing theme-dependent content after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Use light theme as default during SSR to prevent hydration mismatch
  const logoSrc = mounted && resolvedTheme === "dark" ? "/icons/logo-dark.png" : "/icons/logo-light.png"

  return (
    <nav className={cn(
      "w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border hidden md:block",
      className
    )}>
      <div className="container flex h-16 items-center justify-end">
        <ModeToggle />
      </div>
    </nav>
  )
}
