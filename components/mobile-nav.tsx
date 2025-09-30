"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  Menu,
  LogOut,
  User,
  LayoutDashboard,
  HelpCircle,
  FileText,
  Shield,
  Cookie,
  Mail,
  Layers,
  CircleDollarSign,
} from "lucide-react"
import Image from "next/image"
import { useTheme } from "next-themes"
import { useToast } from "@/components/ui/use-toast"
import { ModeToggle } from "@/components/mode-toggle"

interface MobileNavProps {
  setIsOpen: (isOpen: boolean) => void;
}

export function MobileNav({ setIsOpen }: MobileNavProps) {
  const pathname = usePathname()
  const { toast } = useToast()
  const { resolvedTheme } = useTheme()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userIsAdmin, setUserIsAdmin] = useState(false)
  const [userName, setUserName] = useState<string>("")
  const [userAvatar, setUserAvatar] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
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


    checkAuth()
  }, [pathname])

  const handleLogout = () => {
    signOut()
    setIsLoggedIn(false)
    setUserIsAdmin(false)
    setUserName("")
    setUserAvatar(null)
    setIsSheetOpen(false)

    toast({
      title: "Signed out successfully",
      description: "You have been signed out of your account",
    })
  }

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
      special: true
    }
  ]

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
    <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background">
      <Link href="/" className="flex items-center gap-2">
        <Image src={logoSrc} alt="Stamps of Approval" width={120} height={30} className="h-8 w-auto" />
      </Link>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors bg-primary/10 text-primary hover:bg-primary/20"
          title="AI Chat"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">AI Chat</span>
        </button>
        <ModeToggle />
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
        <SheetContent side="right" className="w-72">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="pb-6 border-b border-border/60">
              <div className="flex items-center">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Menu</h2>
                  <p className="text-xs text-muted-foreground">Navigate your stamp collection</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="space-y-1">
                {/* Main Nav Section */}
                <div className="mb-6">
                  <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Main
                  </h3>
                  {mainNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsSheetOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors mb-2",
                        item.active
                          ? "bg-[#F4831F12] border-l-2 border-primary text-primary"
                          : "text-foreground hover:bg-[#F4831F08] hover:border-l-2 hover:border-primary hover:text-primary",
                        item.special && "relative"
                      )}
                    >
                      <item.icon className={cn("h-4 w-4", item.special && "text-amber-500")} />
                      <div className="flex items-center gap-2">
                        <span>{item.title}</span>
                        {item.special && <span className="text-xs text-amber-500">✦</span>}
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Catalog Section - Only show when logged in */}
                {isLoggedIn && (
                  <div className="mb-6">
                    <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Catalog
                    </h3>
                    {catalogNavItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsSheetOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors mb-2",
                          item.active
                            ? "bg-[#F4831F12] border-l-2 border-primary text-primary"
                            : "text-foreground hover:bg-[#F4831F08] hover:border-l-2 hover:border-primary hover:text-primary"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Profile Section - Only show when logged in */}
                {isLoggedIn && (
                  <div className="mb-6">
                    <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Profile
                    </h3>
                    {profileNavItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsSheetOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors mb-2",
                          item.active
                            ? "bg-[#F4831F12] border-l-2 border-primary text-primary"
                            : "text-foreground hover:bg-[#F4831F08] hover:border-l-2 hover:border-primary hover:text-primary"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </nav>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-border pt-4 space-y-4">
              {/* User Section */}
              {isLoggedIn ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#F4831F08] border border-primary/20">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userAvatar || "/man-avatar-profile-picture.avif"} alt={userName || "User"} />
                      <AvatarFallback>{getUserInitials(userName)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start min-w-0">
                      <p className="text-sm font-medium leading-none truncate w-full">{userName || "User"}</p>
                      <p className="text-xs text-muted-foreground">
                        {userIsAdmin ? "Admin" : "Member"}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-red-50 hover:text-red-700 text-red-600 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link href="/login" onClick={() => setIsSheetOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsSheetOpen(false)}>
                    <Button size="sm" className="w-full">
                      Sign up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
