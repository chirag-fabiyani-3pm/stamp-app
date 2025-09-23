"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import {
  getUserAvatar,
  getUserDisplayName,
  isAdmin,
  isAuthenticated,
  signOut
} from "@/lib/api/auth"
import {
  Home,
  Sparkles,
  DollarSign,
  Globe,
  Eye,
  Archive,
  Search,
  Archive as Collection,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  User,
  Menu,
  Settings,
  HelpCircle,
  FileText,
  Shield,
  Cookie,
  Mail
} from "lucide-react"
import Image from "next/image"
import { useTheme } from "next-themes"

interface SidebarProps {
  sidebarCollapsed: boolean;
  setActiveSection: (activeSection: 'countries' | 'visual' | 'list' | 'investigate' | 'stamp-collection') => void;
}

export function Sidebar({ sidebarCollapsed, setActiveSection }: SidebarProps) {
  const pathname = usePathname()
  const { toast } = useToast()
  const { resolvedTheme } = useTheme()
  const [currentTab, setCurrentTab] = useState('countries')
  
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userIsAdmin, setUserIsAdmin] = useState(false)
  const [userName, setUserName] = useState<string>("")
  const [userAvatar, setUserAvatar] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by only showing theme-dependent content after mount
  useEffect(() => {
    setMounted(true)
    
    // Check authentication status
    const checkAuth = () => {
      const authenticated = isAuthenticated()
      const adminStatus = isAdmin()
      const displayName = getUserDisplayName()
      const avatar = getUserAvatar()

      setIsLoggedIn(authenticated)
      setUserIsAdmin(adminStatus)
      setUserName(displayName)
      setUserAvatar(avatar)
    }

    // Update current tab from URL
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search)
      const tab = searchParams.get('tab') || 'countries'
      setCurrentTab(tab)
    }

    checkAuth()
  }, [pathname])

  const handleLogout = () => {
    signOut()
    setIsLoggedIn(false)
    setUserIsAdmin(false)
    setUserName("")
    setUserAvatar(null)

    toast({
      title: "Signed out successfully",
      description: "You have been signed out of your account",
    })
  }

  // Get user initials for avatar fallback
  const getUserInitials = (name: string): string => {
    if (!name) return "U"
    const names = name.split(" ")
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const logoSrc = mounted && resolvedTheme === "dark" ? "/icons/logo-dark.png" : "/icons/logo-light.png"

  const mainNavItems = [
    {
      title: "Home",
      href: "/",
      icon: Home,
      active: pathname === "/"
    },
    {
      title: "Scan",
      href: "/scan",
      icon: Sparkles,
      active: pathname === "/scan",
      special: true // Special styling for scan
    },
  ]

  const catalogNavItems = [
    {
      title: "Country Catalogs",
      href: "/?tab=countries",
      icon: Globe,
      active: pathname === "/" && currentTab === "countries"
    },
    {
      title: "Visual Catalog",
      href: "/?tab=visual",
      icon: Eye,
      active: pathname === "/" && currentTab === "visual"
    },
    {
      title: "List Catalog",
      href: "/?tab=list",
      icon: Archive,
      active: pathname === "/" && currentTab === "list"
    },
    {
      title: "Investigate Search",
      href: "/?tab=investigate",
      icon: Search,
      active: pathname === "/" && currentTab === "investigate"
    },
    {
      title: "Stamp Collection",
      href: "/?tab=stamp-collection",
      icon: Collection,
      active: pathname === "/" && currentTab === "stamp-collection"
    }
  ]

  if (!mounted) {
    return null
  }

  return (
    <div className={cn(
      "bg-background border-r border-border transition-all duration-300 ease-in-out flex flex-col shrink-0",
      sidebarCollapsed ? "w-16" : "w-64",
      "hidden md:flex" // Hide on mobile, show on desktop
    )}>
      {/* Header */}
      <div className={cn("flex items-center justify-between p-3 border-b border-border", sidebarCollapsed && "px-1.5 py-3")}>
        {!sidebarCollapsed && (
          <Link href="/" className="flex items-center gap-2">
            <Image src={logoSrc} alt="Stamps of Approval" width={230} height={40} className="h-10" />
          </Link>
        )}
        {sidebarCollapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="h-10 bg-primary rounded-md text-white font-bold flex items-center justify-center px-2">
              <span>SOA</span>
            </div>
          </Link>
        )}
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-2 space-y-1">
          {/* Catalog Section - Only show when logged in */}
          {isLoggedIn && (
            <div className="mb-4">
              {!sidebarCollapsed && (
                <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Catalog
                </h3>
              )}
              {catalogNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    setActiveSection(item.href.split('=')[1] as 'countries' | 'visual' | 'list' | 'investigate' | 'stamp-collection')
                    setCurrentTab(item.href.split('=')[1] as 'countries' | 'visual' | 'list' | 'investigate' | 'stamp-collection')
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors mb-2",
                    item.active
                      ? "bg-[#F4831F12] border border-primary text-primary"
                      : "text-foreground hover:bg-[#F4831F0D] hover:text-primary",
                    sidebarCollapsed && "justify-center"
                  )}
                  title={sidebarCollapsed ? item.title : ""}
                >
                  <item.icon className="h-4 w-4" />
                  {!sidebarCollapsed && <span>{item.title}</span>}
                </Link>
              ))}
            </div>
          )}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-border p-2 space-y-2">
        {/* User Section */}
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start p-2 h-auto",
                  sidebarCollapsed && "justify-center"
                )}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userAvatar || "/man-avatar-profile-picture.avif"} alt={userName || "User"} />
                    <AvatarFallback>{getUserInitials(userName)}</AvatarFallback>
                  </Avatar>
                  {!sidebarCollapsed && (
                    <div className="flex flex-col items-start min-w-0">
                      <p className="text-sm font-medium leading-none truncate w-full">{userName || "User"}</p>
                      <p className="text-xs text-muted-foreground">
                        {userIsAdmin ? "Admin" : "Member"}
                      </p>
                    </div>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" side="right">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userName || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userIsAdmin ? "Administrator" : "Member"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              {userIsAdmin && (
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="cursor-pointer flex items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer flex items-center">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className={cn("space-y-2", sidebarCollapsed && "space-y-1")}>
            <Link href="/login">
              <Button variant="ghost" size="sm" className={cn("w-full", sidebarCollapsed && "px-2")}>
                {sidebarCollapsed ? "LI" : "Log in"}
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className={cn("w-full", sidebarCollapsed && "px-2")}>
                {sidebarCollapsed ? "SU" : "Sign up"}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
