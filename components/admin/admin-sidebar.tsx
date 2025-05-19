"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Home, LayoutDashboard, Settings, Users, Stamp, Database, Upload, Code } from "lucide-react"
import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Catalog Management",
    icon: <Stamp className="h-5 w-5" />,
    submenu: [
      {
        title: "Catalog Browser",
        href: "/admin/catalog",
      },
      {
        title: "Catalog Ingestion",
        href: "/admin/catalog-ingestion",
      },
      {
        title: "Catalog Code System",
        href: "/admin/catalog-system",
      }
    ],
  },
  {
    title: "User Management",
    href: "/admin/users",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: <Settings className="h-5 w-5" />,
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  const isActive = (href: string) => {
    // Exact match
    if (pathname === href) return true

    // For the dashboard, only match exact path to avoid highlighting when in sub-routes
    if (href === "/admin") return pathname === "/admin"

    // For other routes, check if it's a sub-path
    return pathname.startsWith(`${href}/`)
  }

  return (
    <div className="w-64 border-r h-screen overflow-auto bg-background">
      <div className="p-6 border-b">
        <Link href="/admin" className="flex items-center gap-2 font-semibold text-lg">
          <Stamp className="h-6 w-6 text-primary" />
          <span>SOA Admin</span>
        </Link>
      </div>
      <div className="py-4">
        <nav className="space-y-1 px-2">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Home className="h-5 w-5" />
            <span>Back to Site</span>
          </Link>
        </nav>

        <div className="mt-6 px-3">
          <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Administration</h3>
          <nav className="mt-2 space-y-1">
            {sidebarLinks.map((link, index) => {
              if (link.submenu) {
                const isOpen = openSections[link.title] || false
                const hasActiveChild = link.submenu.some((sublink) => isActive(sublink.href))

                return (
                  <Collapsible
                    key={index}
                    open={isOpen || hasActiveChild}
                    onOpenChange={() => toggleSection(link.title)}
                    className="space-y-1"
                  >
                    <CollapsibleTrigger className="w-full">
                      <div
                        className={cn(
                          "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium cursor-pointer hover:bg-muted transition-colors",
                          hasActiveChild ? "text-primary" : "text-muted-foreground",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {link.icon}
                          <span>{link.title}</span>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-10 space-y-1">
                      {link.submenu.map((sublink, subindex) => {
                        const isSubmenuActive = isActive(sublink.href)

                        return (
                          <Link
                            key={subindex}
                            href={sublink.href}
                            className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                              isSubmenuActive
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                          >
                            {sublink.title}
                          </Link>
                        )
                      })}
                    </CollapsibleContent>
                  </Collapsible>
                )
              }

              return (
                <Link
                  key={index}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {link.icon}
                  <span>{link.title}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="mt-6 px-4 py-2">
          <div className="rounded-md bg-blue-50 dark:bg-blue-950 p-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                <Upload className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">Catalog Ingestion</h4>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Upload and process catalog data
                </p>
              </div>
            </div>
            <Button
              variant="link"
              className="text-xs text-blue-700 dark:text-blue-300 px-0 py-1 h-auto font-medium"
              asChild
            >
              <Link href="/admin/catalog-ingestion">Get Started →</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
