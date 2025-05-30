"use client"

import type React from "react"

import { useState } from "react"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Bell, Menu, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from "@/components/mode-toggle"
import Link from "next/link"
import { AdminGuard } from "@/components/auth/route-guard"
import { getUserDisplayName, getUserAvatar, signOut } from "@/lib/api/auth"

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const userDisplayName = getUserDisplayName()
  const userAvatar = getUserAvatar()
  const userInitials = userDisplayName
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const handleSignOut = () => {
    signOut()
  }

  return (
    <AdminGuard>
      <div className="flex h-screen overflow-hidden">
        {/* Mobile sidebar */}
        <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-background">
            <div className="flex h-16 items-center justify-between px-4 border-b">
              <Link href="/admin" className="flex items-center gap-2 font-semibold text-lg">
                Admin Dashboard
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <AdminSidebar />
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </AdminGuard>
  )
}
