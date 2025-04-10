"use client"

import { usePathname, useRouter } from "next/navigation"
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
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, User, LogOut, ShoppingBag, MessageSquare, LayoutDashboard, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

export function HeaderActions() {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is logged in
    const loggedInStatus = localStorage.getItem("isLoggedIn")
    const storedUserRole = localStorage.getItem("userRole")
    const storedUserName = localStorage.getItem("userName")

    setIsLoggedIn(loggedInStatus === "true")
    setUserRole(storedUserRole)
    setUserName(storedUserName)
  }, [pathname]) // Re-check when pathname changes

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userName")

    setIsLoggedIn(false)
    setUserRole(null)

    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    })

    // Redirect to home page
    router.push("/")
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
        <Link
          href="/catalog"
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-colors",
            pathname === "/catalog" || pathname.startsWith("/catalog/")
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:text-primary hover:bg-accent",
          )}
        >
          Catalog
        </Link>
        <Link
          href="/marketplace"
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-colors",
            pathname === "/marketplace" || pathname.startsWith("/marketplace/")
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:text-primary hover:bg-accent",
          )}
        >
          Marketplace
        </Link>
        <Link
          href="/community"
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-colors",
            pathname === "/community" || pathname.startsWith("/community/")
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:text-primary hover:bg-accent",
          )}
        >
          Community
        </Link>

        <ScanButton />
      </nav>

      <ModeToggle />

      {isLoggedIn ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/man-avatar-profile-picture.avif" alt={userName || "User"} />
                <AvatarFallback>{userName?.substring(0, 2) || "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userName || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userRole === "admin" ? "Administrator" : "Member"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              {userRole === "admin" && (
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link href="/marketplace/create" className="cursor-pointer">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  <span>Create Listing</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/community/new-topic" className="cursor-pointer">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>New Topic</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      ) : (
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Sign up</Button>
          </Link>
        </div>
      )}

      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <nav className="flex flex-col gap-4">
            <Link
              href="/"
              className={cn(
                "text-lg font-medium transition-colors hover:text-primary",
                pathname === "/" ? "text-primary font-semibold" : "text-muted-foreground",
              )}
            >
              Home
            </Link>
            <Link
              href="/catalog"
              className={cn(
                "text-lg font-medium transition-colors hover:text-primary",
                pathname === "/catalog" || pathname.startsWith("/catalog/")
                  ? "text-primary font-semibold"
                  : "text-muted-foreground",
              )}
            >
              Catalog
            </Link>
            <Link
              href="/marketplace"
              className={cn(
                "text-lg font-medium transition-colors hover:text-primary",
                pathname === "/marketplace" || pathname.startsWith("/marketplace/")
                  ? "text-primary font-semibold"
                  : "text-muted-foreground",
              )}
            >
              Marketplace
            </Link>
            <Link
              href="/community"
              className={cn(
                "text-lg font-medium transition-colors hover:text-primary",
                pathname === "/community" || pathname.startsWith("/community/")
                  ? "text-primary font-semibold"
                  : "text-muted-foreground",
              )}
            >
              Community
            </Link>

            {/* Mobile Scan Button */}
            <div className="relative">
              <Link
                href="/scan"
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md text-lg font-medium",
                  pathname === "/scan" ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-accent",
                )}
              >
                <Sparkles className="h-5 w-5 text-amber-500" />
                <span>Scan</span>
                <span className="text-sm text-amber-500 font-normal ml-0.5">✦</span>
              </Link>
            </div>

            {isLoggedIn && (
              <>
                <Link
                  href="/profile"
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-primary",
                    pathname === "/profile" ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  Profile
                </Link>

                {userRole === "admin" && (
                  <Link
                    href="/admin"
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-primary",
                      pathname.startsWith("/admin") ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    Admin Dashboard
                  </Link>
                )}

                <Button variant="outline" onClick={handleLogout} className="mt-4">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </>
            )}

            {!isLoggedIn && (
              <div className="flex flex-col gap-2 mt-4">
                <Link href="/login">
                  <Button variant="outline" className="w-full">
                    Log in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="w-full">Sign up</Button>
                </Link>
              </div>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}
