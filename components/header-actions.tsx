"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/components/ui/use-toast"
import {
  getUserAvatar,
  getUserDisplayName,
  isAdmin,
  isAuthenticated,
  signOut
} from "@/lib/api/auth"
import { cn } from "@/lib/utils"
import { Home, LayoutDashboard, LogOut, Menu, MessageSquare, Sparkles, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

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
  const [mounted, setMounted] = useState(false)

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

  const HomeButton = () => (
    <Link
      href="/"
      className={cn(
        "group px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5",
        pathname === "/" ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-accent",
      )}
    >
      <Home className="h-4 w-4" />
      <span>Home</span>
    </Link>
  )

  // Show loading state during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <HomeButton />
          <ScanButton />
          <Link
            href="/pricing"
            className="group px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 text-foreground hover:bg-accent"
          >
            <span>Pricing</span>
          </Link>
        </nav>

        <ModeToggle />

        {/* Chat button will be conditionally rendered after auth check */}

        {/* Default to sign in/up buttons during SSR */}
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link href="/signup">
            <Button>Sign up</Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger className="md:hidden outline-none inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col gap-1 mt-2">
              <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2 text-base font-medium transition-colors hover:bg-accent">
                <Home className="h-5 w-5" />
                <span>Home</span>
              </Link>
              <Link href="/scan" className="flex items-center gap-3 rounded-xl px-3 py-2 text-base font-medium transition-colors hover:bg-accent">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <span>Scan</span>
                <span className="ml-auto text-xs text-amber-500">✦</span>
              </Link>
              <Link href="/pricing" className="flex items-center gap-3 rounded-xl px-3 py-2 text-base font-medium transition-colors hover:bg-accent">
                <span>Pricing</span>
              </Link>
              <div className="h-px bg-border my-2" />
              <div className="mt-1 space-y-2">
                <Link href="/signup">
                  <Button className="w-full" size="lg">Sign up</Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="w-full" size="lg">Log in</Button>
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-1">
        <HomeButton />
        <ScanButton />
        <Link
          href="/pricing"
          className={cn(
            "group px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5",
            pathname === "/pricing" ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-accent",
          )}
        >
          <span>Pricing</span>
        </Link>
      </nav>

      <ModeToggle />

      {isLoggedIn && (
        <button
          onClick={() => setIsOpen(true)}
          className="mr-2.5 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-300 ease-in-out group"
        >
          <MessageSquare className="w-4 h-4 mr-1 opacity-90 group-hover:opacity-100 transition-opacity" />
          <span className="text-sm font-medium">AI Chat</span>
        </button>
      )}

      {isLoggedIn ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none relative h-8 w-8 rounded-full p-0 inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userAvatar || "/man-avatar-profile-picture.avif"} alt={userName || "User"} />
              <AvatarFallback>{getUserInitials(userName)}</AvatarFallback>
            </Avatar>
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
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link href="/signup">
            <Button>Sign up</Button>
          </Link>
        </div>
      )}

      {/* Mobile Menu */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger className="md:hidden outline-none inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </SheetTrigger>
        <SheetContent side="right">
          <nav className="flex flex-col gap-1 mt-2">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-base font-medium transition-colors",
                pathname === "/" ? "bg-accent text-accent-foreground" : "hover:bg-accent text-foreground",
              )}
              onClick={() => setIsSheetOpen(false)}
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>

            <Link
              href="/scan"
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-base font-medium transition-colors",
                pathname === "/scan" ? "bg-accent text-accent-foreground" : "hover:bg-accent text-foreground",
              )}
              onClick={() => setIsSheetOpen(false)}
            >
              <Sparkles className="h-5 w-5 text-amber-500" />
              <span>Scan</span>
              <span className="ml-auto text-xs text-amber-500">✦</span>
            </Link>

            <Link
              href="/pricing"
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-base font-medium transition-colors",
                pathname === "/pricing" ? "bg-accent text-accent-foreground" : "hover:bg-accent text-foreground",
              )}
              onClick={() => setIsSheetOpen(false)}
            >
              <span>Pricing</span>
            </Link>

            {isLoggedIn && (
              <button
                onClick={() => {
                  setIsOpen(true)
                  setIsSheetOpen(false)
                }}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-base font-medium transition-colors bg-primary/10 text-primary hover:bg-primary/20 md:hidden"
              >
                <MessageSquare className="h-5 w-5" />
                <span>AI Chat</span>
              </button>
            )}

            {isLoggedIn && (
              <>
                <Link
                  href="/profile"
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-base font-medium transition-colors",
                    pathname === "/profile" ? "bg-accent text-accent-foreground" : "hover:bg-accent text-foreground",
                  )}
                  onClick={() => setIsSheetOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>

                {userIsAdmin && (
                  <Link
                    href="/admin"
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2 text-base font-medium transition-colors",
                      pathname.startsWith("/admin") ? "bg-accent text-accent-foreground" : "hover:bg-accent text-foreground",
                    )}
                    onClick={() => setIsSheetOpen(false)}
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}

                <div className="h-px bg-border my-2" />

                <Button
                  variant="outline"
                  onClick={() => {
                    handleLogout()
                    setIsSheetOpen(false)
                  }}
                  className="mt-2"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </>
            )}

            {!isLoggedIn && (
              <div className="mt-2 space-y-2">
                <Link href="/signup" onClick={() => setIsSheetOpen(false)}>
                  <Button className="w-full" size="lg">Sign up</Button>
                </Link>
                <Link href="/login" onClick={() => setIsSheetOpen(false)}>
                  <Button variant="outline" className="w-full" size="lg">Log in</Button>
                </Link>
              </div>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}
