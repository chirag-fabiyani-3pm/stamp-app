"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, User, LogOut, LayoutDashboard, Sparkles, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import {
  isAuthenticated,
  isAdmin,
  getUserDisplayName,
  getUserAvatar,
  signOut
} from "@/lib/api/auth"

interface HeaderActionsProps {
  setIsOpen: (isOpen: boolean) => void;
}

export function HeaderActions({ setIsOpen }: HeaderActionsProps) {
  const pathname = usePathname()

  const { toast } = useToast()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userIsAdmin, setUserIsAdmin] = useState(false)
  const [userName, setUserName] = useState<string>("")
  const [userAvatar, setUserAvatar] = useState<string | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  useEffect(() => {
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

    // Check on mount
    checkAuth()

    // Check when pathname changes (in case of login/logout)
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

  // Scan button with sparkle icon
  const ScanButton = () => (
    <Link
      href="/scan"
      className={cn(
        "group px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5",
        pathname === "/scan" ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-accent",
      )}
    >
      <Sparkles className="h-4 w-4 text-amber-500" />
      <span>Scan</span>
      <span className="text-xs text-amber-500 font-normal ml-0.5">✦</span>
    </Link>
  )

  return (
    <div className="flex items-center gap-2">
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-1">
        <ScanButton />
      </nav>

      <ModeToggle />

      <button
        onClick={() => setIsOpen(true)}
        className="mr-2.5 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-300 ease-in-out group"
      >
        <MessageSquare className="w-4 h-4 mr-1 opacity-90 group-hover:opacity-100 transition-opacity" />
        <span className="text-sm font-medium">AI Chat</span>
      </button>

      {isLoggedIn ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userAvatar || "/man-avatar-profile-picture.avif"} alt={userName || "User"} />
                <AvatarFallback>{getUserInitials(userName)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
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
        <Link href="/login">
          <Button>Sign in</Button>
        </Link>
      )}

      {/* Mobile Menu */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger className="md:hidden outline-none">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <nav className="flex flex-col gap-4">
            {/* Mobile Scan Button */}
            <div className="relative">
              <Link
                href="/scan"
                className={cn(
                  "text-lg font-medium transition-colors hover:text-primary",
                  pathname === "/scan" ? "text-primary" : "text-muted-foreground",
                )}
                onClick={() => setIsSheetOpen(false)}
              >
                Scan
              </Link>
            </div>

            <button
              onClick={() => {
                setIsOpen(true);
                setIsSheetOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-primary/10 text-primary hover:bg-primary/20 md:hidden"
            >
              <MessageSquare className="w-4 h-4 mr-1 opacity-70 group-hover:opacity-100 transition-opacity" />
              <span className="text-xs">AI Chat</span>
            </button>

            {isLoggedIn && (
              <>
                <Link
                  href="/profile"
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-primary",
                    pathname === "/profile" ? "text-primary" : "text-muted-foreground",
                  )}
                  onClick={() => setIsSheetOpen(false)}
                >
                  Profile
                </Link>

                {userIsAdmin && (
                  <Link
                    href="/admin"
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-primary",
                      pathname.startsWith("/admin") ? "text-primary" : "text-muted-foreground",
                    )}
                    onClick={() => setIsSheetOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}

                <Button
                  variant="outline"
                  onClick={() => {
                    handleLogout()
                    setIsSheetOpen(false)
                  }}
                  className="mt-4"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </>
            )}

            {!isLoggedIn && (
              <div className="mt-4">
                <Link href="/login" onClick={() => setIsSheetOpen(false)}>
                  <Button className="w-full">Sign in</Button>
                </Link>
              </div>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}
