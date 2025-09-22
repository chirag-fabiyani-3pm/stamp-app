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
  setIsOpen: (isOpen: boolean) => void;
  onCollapseChange?: (collapsed: boolean) => void;
}

export function Sidebar({ setIsOpen, onCollapseChange }: SidebarProps) {
  const pathname = usePathname()
  const { toast } = useToast()
  const { resolvedTheme } = useTheme()
  const [currentTab, setCurrentTab] = useState('countries')
  
  const [isCollapsed, setIsCollapsed] = useState(false)
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
    {
      title: "Pricing",
      href: "/pricing",
      icon: DollarSign,
      active: pathname === "/pricing"
    }
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

  const bottomNavItems = [
    {
      title: "Help",
      href: "/help",
      icon: HelpCircle,
      active: pathname === "/help"
    },
    {
      title: "FAQ",
      href: "/faq",
      icon: FileText,
      active: pathname === "/faq"
    },
    {
      title: "Contact",
      href: "/contact",
      icon: Mail,
      active: pathname === "/contact"
    },
    {
      title: "Privacy",
      href: "/privacy",
      icon: Shield,
      active: pathname === "/privacy"
    },
    {
      title: "Terms",
      href: "/terms",
      icon: FileText,
      active: pathname === "/terms"
    },
    {
      title: "Cookies",
      href: "/cookies",
      icon: Cookie,
      active: pathname === "/cookies"
    }
  ]

  if (!mounted) {
    return null
  }

  return (
    <div className={cn(
      "bg-background border-r border-border transition-all duration-300 ease-in-out flex flex-col shrink-0",
      isCollapsed ? "w-16" : "w-64",
      "hidden md:flex" // Hide on mobile, show on desktop
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-2">
            <Image src={logoSrc} alt="Stamps of Approval" width={120} height={30} className="h-8 w-auto" />
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            const newCollapsed = !isCollapsed;
            setIsCollapsed(newCollapsed);
            onCollapseChange?.(newCollapsed);
          }}
          className="h-8 w-8"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-2 space-y-1">
          {/* Main Nav Section */}
          <div className="mb-4">
            {!isCollapsed && (
              <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Main
              </h3>
            )}
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  item.active
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground",
                  item.special && "relative",
                  isCollapsed && "justify-center"
                )}
                title={isCollapsed ? item.title : ""}
              >
                <item.icon className={cn("h-4 w-4", item.special && "text-amber-500")} />
                {!isCollapsed && (
                  <div className="flex items-center gap-2">
                    <span>{item.title}</span>
                    {item.special && <span className="text-xs text-amber-500">✦</span>}
                  </div>
                )}
              </Link>
            ))}
          </div>

          {/* Catalog Section - Only show when logged in */}
          {isLoggedIn && (
            <div className="mb-4">
              {!isCollapsed && (
                <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Catalog
                </h3>
              )}
              {catalogNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    item.active
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground",
                    isCollapsed && "justify-center"
                  )}
                  title={isCollapsed ? item.title : ""}
                >
                  <item.icon className="h-4 w-4" />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              ))}
            </div>
          )}

          {/* AI Chat - Only show when logged in */}
          {isLoggedIn && (
            <div className="mb-4">
              <button
                onClick={() => setIsOpen(true)}
                className={cn(
                  "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors bg-primary/10 text-primary hover:bg-primary/20",
                  isCollapsed && "justify-center"
                )}
                title={isCollapsed ? "AI Chat" : ""}
              >
                <MessageSquare className="h-4 w-4" />
                {!isCollapsed && <span>AI Chat</span>}
              </button>
            </div>
          )}

          {/* Support Section */}
          <div className="mb-4">
            {!isCollapsed && (
              <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Support
              </h3>
            )}
            {bottomNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  item.active
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground",
                  isCollapsed && "justify-center"
                )}
                title={isCollapsed ? item.title : ""}
              >
                <item.icon className="h-4 w-4" />
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            ))}
          </div>
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
                  isCollapsed && "justify-center"
                )}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userAvatar || "/man-avatar-profile-picture.avif"} alt={userName || "User"} />
                    <AvatarFallback>{getUserInitials(userName)}</AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
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
          <div className={cn("space-y-2", isCollapsed && "space-y-1")}>
            <Link href="/login">
              <Button variant="ghost" size="sm" className={cn("w-full", isCollapsed && "px-2")}>
                {isCollapsed ? "LI" : "Log in"}
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className={cn("w-full", isCollapsed && "px-2")}>
                {isCollapsed ? "SU" : "Sign up"}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
