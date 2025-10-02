"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { useSubscription } from "@/lib/hooks/useSubscription"
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
  Mail,
  PersonStanding,
  Layers,
  BadgeDollarSign,
  CircleDollarSign,
  Crown,
  Check
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
  
  // Subscription status
  const { subscriptionStatus } = useSubscription()

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
  const logoCollapsedSrc = mounted && resolvedTheme === "dark" ? "/icons/logo-collapsed-dark.png" : "/icons/logo-collapsed-light.png"

  const catalogNavItems = [
    {
      title: "Country Catalogs",
      href: "/catalog/country-catalog",
      icon: Globe,
      active: pathname === "/catalog/country-catalog"
    },
    {
      title: "Visual Catalog",
      href: "/catalog/visual-catalog",
      icon: Eye,
      active: pathname === "/catalog/visual-catalog"
    },
    {
      title: "List Catalog",
      href: "/catalog/list-catalog",
      icon: Archive,
      active: pathname === "/catalog/list-catalog"
    },
    {
      title: "Investigate Search",
      href: "/catalog/investigate-search",
      icon: Search,
      active: pathname === "/catalog/investigate-search"
    }
  ]

  const profileNavItems = [
    {
      title: "Account",
      href: "/profile/account",
      icon: User,
      active: pathname === "/profile/account"
    },
    {
      title: "My Collection",
      href: "/profile/collection",
      icon: Layers,
      active: pathname === "/profile/collection"
    },
    {
      title: "Subscription",
      href: "/profile/subscription",
      icon: CircleDollarSign,
      active: pathname === "/profile/subscription"
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
      <div className={cn("flex items-center justify-between p-3 border-b border-border", sidebarCollapsed && "px-0 py-3")}>
        {!sidebarCollapsed && (
          <Link href="/" className="flex items-center gap-2">
            <Image src={logoSrc} alt="Stamps of Approval" width={230} height={40} className="h-10" />
          </Link>
        )}
        {sidebarCollapsed && (
          <Link href="/" className="flex items-center gap-2">
            <Image src={logoCollapsedSrc} alt="Stamps of Approval" width={63} height={40} className="h-10" />
          </Link>
        )}
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="px-3 py-2 space-y-1">
          {/* Catalog Section - Only show when logged in */}
          {isLoggedIn && (
            <div className="mb-4">
              {!sidebarCollapsed && (
                <h3 className="py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Catalog
                </h3>
              )}
              {catalogNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    setActiveSection(item.href.split('/')[2] as 'countries' | 'visual' | 'list' | 'investigate' | 'stamp-collection')
                    setCurrentTab(item.href.split('/')[2] as 'countries' | 'visual' | 'list' | 'investigate' | 'stamp-collection')
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors mb-2",
                    item.active
                      ? "bg-[#F4831F12] border-l-2 border-primary text-primary"
                      : "text-foreground hover:bg-[#F4831F08] hover:border-l-2 hover:border-primary hover:text-primary",
                    sidebarCollapsed && "justify-center"
                  )}
                  title={sidebarCollapsed ? item.title : ""}
                >
                  <item.icon className="h-4 w-4" />
                  {!sidebarCollapsed && <span>{item.title}</span>}
                  {item.active && !sidebarCollapsed && <ChevronRight className="h-4 w-4 ml-auto" />}
                </Link>
              ))}

              {!sidebarCollapsed && (
                <h3 className="py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Profile
                </h3>
              )}
              {profileNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    setActiveSection(item.href.split('/')[2] as 'countries' | 'visual' | 'list' | 'investigate' | 'stamp-collection')
                    setCurrentTab(item.href.split('/')[2] as 'countries' | 'visual' | 'list' | 'investigate' | 'stamp-collection')
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors mb-2",
                    item.active
                      ? "bg-[#F4831F12] border-l-2 border-primary text-primary"
                      : "text-foreground hover:bg-[#F4831F08] hover:border-l-2 hover:border-primary hover:text-primary",
                    sidebarCollapsed && "justify-center"
                  )}
                  title={sidebarCollapsed ? item.title : ""}
                >
                  <item.icon className="h-4 w-4" />
                  {!sidebarCollapsed && <span>{item.title}</span>}
                  {item.active && !sidebarCollapsed && <ChevronRight className="h-4 w-4 ml-auto" />}
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
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userAvatar || "/man-avatar-profile-picture.avif"} alt={userName || "User"} />
                      <AvatarFallback>{getUserInitials(userName)}</AvatarFallback>
                    </Avatar>
                    {sidebarCollapsed && subscriptionStatus.isSubscribed && (
                      <div className="absolute -top-1 -right-1 bg-primary rounded-full p-0.5">
                        <Crown className="h-2.5 w-2.5 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  {!sidebarCollapsed && (
                    <div className="flex flex-col items-start min-w-0 flex-1">
                      <div className="flex items-center gap-2 w-full">
                        <p className="text-sm font-medium leading-none truncate">{userName || "User"}</p>
                        {subscriptionStatus.isSubscribed && (
                          <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary border-primary/20">
                            <Crown className="h-3 w-3 mr-1" />
                            Pro
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {userIsAdmin ? "Admin" : subscriptionStatus.isSubscribed ? "Subscribed Member" : "Free Member"}
                      </p>
                    </div>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" side="right">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium leading-none">{userName || "User"}</p>
                    {subscriptionStatus.isSubscribed && (
                      <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary border-primary/20">
                        <Crown className="h-3 w-3 mr-1" />
                        Pro
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userIsAdmin ? "Administrator" : subscriptionStatus.isSubscribed ? "Subscribed Member" : "Free Member"}
                  </p>
                  {subscriptionStatus.isSubscribed && subscriptionStatus.isDealer && (
                    <p className="text-xs leading-none text-primary font-medium">
                      <Check className="h-3 w-3 inline mr-1" />
                      Dealer Status
                    </p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
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
