"use client"

import React, { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { ModeToggle } from "@/components/mode-toggle"
import { MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebarContext } from "./app-content"

interface CatalogNavbarProps {
  className?: string
  setIsOpen: (isOpen: boolean) => void
}

export function CatalogNavbar({ className, setIsOpen }: CatalogNavbarProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

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
      <div className="flex h-16 items-center justify-end gap-3 px-10">
        <ModeToggle />
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors bg-primary/10 text-primary hover:bg-primary/20",
            isCollapsed && "justify-center"
          )}
          title={isCollapsed ? "AI Chat" : ""}
        >
          <MessageSquare className="h-4 w-4" />
          {!isCollapsed && <span>AI Chat</span>}
        </button>
      </div>
    </nav>
  )
}
