"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSubscription } from "@/lib/hooks/useSubscription"
import { isAuthenticated } from "@/lib/api/auth"
import { Spinner } from "@/components/ui/spinner"

interface SubscriptionGuardProps {
  children: React.ReactNode
  redirectTo?: string
}

export function SubscriptionGuard({ children, redirectTo = "/" }: SubscriptionGuardProps) {
  const router = useRouter()
  const { isLoading, canAccessFeatures } = useSubscription()

  useEffect(() => {
    if (!isLoading) {
      // If user is not authenticated, redirect to login
      if (!isAuthenticated()) {
        router.push('/login')
        return
      }

      // If user is authenticated but not subscribed, redirect to home (subscription screen)
      if (!canAccessFeatures()) {
        router.push(redirectTo)
        return
      }
    }
  }, [isLoading, canAccessFeatures, router, redirectTo])

  // Show loading while checking subscription status
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  // If user is not authenticated, show nothing (redirect will happen)
  if (!isAuthenticated()) {
    return null
  }

  // If user is authenticated but not subscribed, show nothing (redirect will happen)
  if (!canAccessFeatures()) {
    return null
  }

  // User has access, render children
  return <>{children}</>
}
