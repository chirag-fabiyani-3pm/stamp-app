"use client"

import React, { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { ModeToggle } from "@/components/mode-toggle"
import { Home, MessageSquare, Sparkles, PanelLeft, SeparatorVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSubscription } from "@/lib/hooks/useSubscription"

interface CatalogNavbarProps {
  className?: string
  setIsOpen: (isOpen: boolean) => void
  isCollapsed: boolean
  onCollapseChange: (isCollapsed: boolean) => void
}

const PathToNavMap: Record<string,string> = {
  '/catalog/country-catalog': 'Country Catalog',
  '/catalog/visual-catalog': 'Visual Catalog',
  '/catalog/list-catalog': 'List Catalog',
  '/catalog/investigate-search': 'Investigate Search',
  '/profile/account': 'Account',
  '/profile/collection': 'My Collection',
  '/profile/subscription': 'Subscription',
  '/scan': 'Scan',
  '/': 'Home',
}

export function CatalogNavbar({ className, setIsOpen, isCollapsed, onCollapseChange }: CatalogNavbarProps) {
  const pathname = usePathname()
  const { canAccessFeatures } = useSubscription()

  return (
    <nav className={cn(
      "w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border hidden md:block",
      className
    )}>
      <div className="flex h-16 items-center justify-between px-10">
        <div className="flex items-center">
          <button onClick={() => onCollapseChange(!isCollapsed)}>
            <PanelLeft className="h-4 w-4" />
          </button>
          {PathToNavMap[pathname] && <div className="border-l border-gray-300 h-4 mx-4" ></div>}
          <span className="text-sm font-medium transition-colors text-foreground">{PathToNavMap[pathname]}</span>
        </div>
        <div className="flex justify-end gap-3">
          <Link
            href={"/"}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors",
              pathname === "/"
                ? "text-primary border-b-2 border-primary"
                : "text-foreground hover:text-primary",
            )}
            title={"Home"}
          >
            <Home className={cn("h-4 w-4")} />
            <div className="flex items-center gap-2">
              <span>Home</span>
            </div>
          </Link>
          <Link
            href={"/scan"}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors",
              pathname === "/scan"
                ? "text-primary border-b-2 border-primary"
                : "text-foreground hover:text-primary",
            )}
            title={"Scan"}
          >
            <Sparkles className={cn("h-4 w-4 text-amber-500")} />
            <div className="flex items-center gap-2">
              <span>Scan</span>
            </div>
            <span className="text-xs text-amber-500">✦</span>
          </Link>
          <ModeToggle />
          <button
            onClick={() => {
              setIsOpen(true)
              onCollapseChange(true)
            }}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors bg-primary/10 text-primary hover:bg-primary/20",
              !canAccessFeatures() && "opacity-50 cursor-not-allowed"
            )}
            title={"AI Chat"}
            disabled={!canAccessFeatures()}
          >
            <MessageSquare className="h-4 w-4" />
            <span>AI Chat</span>
          </button>
        </div>
      </div>
    </nav>
  )
}
