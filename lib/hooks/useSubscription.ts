import { useState, useEffect } from 'react'
import { isAuthenticated, getUserData, getAuthToken, signOut } from '@/lib/api/auth'

export interface SubscriptionStatus {
  isSubscribed: boolean
  subscriptionTier: 'none' | '1-country' | '2-countries' | '3-countries' | 'all-countries'
  isDealer: boolean
  referralCount: number
  monthlyCommission: number
  subscriptionCost: number
  nextBillingDate: string | null
  accountBalance: number
  referralToken: string | null
}

// Mock subscription data for frontend showcase
const MOCK_SUBSCRIPTION_DATA: SubscriptionStatus = {
  isSubscribed: false, // Change this to true to test subscribed state
  subscriptionTier: 'none',
  isDealer: false,
  referralCount: 0,
  monthlyCommission: 0,
  subscriptionCost: 0,
  nextBillingDate: null,
  accountBalance: 0,
  referralToken: null
}

const MOCK_SUBSCRIBED_DATA: SubscriptionStatus = {
  isSubscribed: true,
  subscriptionTier: '2-countries',
  isDealer: false,
  referralCount: 8,
  monthlyCommission: 24.80,
  subscriptionCost: 8,
  nextBillingDate: '2024-10-18',
  accountBalance: 156.40,
  referralToken: 'REF-ABC123'
}

export function useSubscription() {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>(MOCK_SUBSCRIPTION_DATA)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      console.log
      setIsLoading(true)
      setError(null)

      const userData = getUserData()
      const token = getAuthToken();

      const userDataResponse = await fetch(`https://decoded-app-stamp-api-dev.azurewebsites.net/api/v1/User/${userData?.userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(res => res.json()).catch(err => {
        setIsLoading(false)
      })

      try {
        if (!isAuthenticated()) {
          return
        }

        setSubscriptionStatus({
          accountBalance: userDataResponse.walletBalance,
          isDealer: userDataResponse.isDealer,
          isSubscribed: userDataResponse.subscriptionStatus === "Inactive" ? false : true,
          monthlyCommission: 0,
          nextBillingDate: null,
          referralCount: userDataResponse.activeReferralCount,
          referralToken: userDataResponse.myReferralCode,
          subscriptionCost: 0,
          subscriptionTier: 'none'
        })

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch subscription status')
        setIsLoading(false)
        signOut()
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubscriptionStatus()
  }, [])

  const updateSubscriptionStatus = (newStatus: Partial<SubscriptionStatus>) => {
    setSubscriptionStatus(prev => ({ ...prev, ...newStatus }))
  }

  // Helper functions
  const canAccessFeatures = () => {
    return isAuthenticated() && subscriptionStatus.isSubscribed
  }

  const getPricingTier = () => {
    switch (subscriptionStatus.subscriptionTier) {
      case '1-country': return { countries: 1, price: 6 }
      case '2-countries': return { countries: 2, price: 8 }
      case '3-countries': return { countries: 3, price: 10 }
      case 'all-countries': return { countries: 'all', price: 12 }
      default: return { countries: 0, price: 0 }
    }
  }

  const getReferralProgress = () => {
    const progress = (subscriptionStatus.referralCount / 20) * 100
    const remaining = Math.max(0, 20 - subscriptionStatus.referralCount)
    return { progress, remaining }
  }

  return {
    subscriptionStatus,
    isLoading,
    error,
    canAccessFeatures,
    getPricingTier,
    getReferralProgress,
    updateSubscriptionStatus
  }
}
