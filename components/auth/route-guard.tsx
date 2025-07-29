"use client"

import React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated, isAdmin } from "@/lib/api/auth"
import { Loader2 } from "lucide-react"

interface RouteGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
  fallbackPath?: string
}

export function RouteGuard({ 
  children, 
  requireAuth = false, 
  requireAdmin = false,
  fallbackPath = "/login"
}: RouteGuardProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const checkAuthorization = () => {
      // If no protection is required, allow access
      if (!requireAuth && !requireAdmin) {
        setIsAuthorized(true)
        setIsLoading(false)
        return
      }

      // Check authentication
      const authenticated = isAuthenticated()
      
      if (!authenticated) {
        // Not authenticated, redirect to login
        const currentPath = window.location.pathname
        const loginUrl = `${fallbackPath}?redirect=${encodeURIComponent(currentPath)}`
        router.push(loginUrl)
        return
      }

      // If admin is required, check admin status
      if (requireAdmin) {
        const adminStatus = isAdmin()
        if (!adminStatus) {
          // Not admin, redirect to home
          router.push("/")
          return
        }
      }

      // All checks passed
      setIsAuthorized(true)
      setIsLoading(false)
    }

    checkAuthorization()
  }, [requireAuth, requireAdmin, fallbackPath, router])

  // Show loading spinner while checking authorization
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm text-muted-foreground">Checking authorization...</p>
        </div>
      </div>
    )
  }

  // If not authorized, don't render anything (redirect is happening)
  if (!isAuthorized) {
    return null
  }

  // Render children if authorized
  return <>{children}</>
}

// Convenience components for common use cases
export function AuthGuard({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard requireAuth={true}>
      {children}
    </RouteGuard>
  )
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard requireAuth={true} requireAdmin={true}>
      {children}
    </RouteGuard>
  )
} 