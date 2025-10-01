import { useState, useEffect } from 'react'
import { isAuthenticated, getUserData, getAuthToken, signOut } from '@/lib/api/auth'

export interface SubscriptionStatus {
  isSubscribed: boolean
  isDealer: boolean
  referralCount: number
  subscriptionCost: number
  nextBillingDate: string | null
  accountBalance: number
  referralToken: string | null
  referralByToken: string | null
  countryCount: number
  countryCodes: string,
  currentMonthCommission: number,
  lastMonthCommission: number,
  totalWithdrawalAmount: number,
  totalEarnings: number,
  totalWalletBalance: number,
  referralActivity: {
    name: string,
    plan: string,
    commission: string,
    date: string
  }[]
}

// Mock subscription data for frontend showcase
const MOCK_SUBSCRIPTION_DATA: SubscriptionStatus = {
  isSubscribed: false, // Change this to true to test subscribed state
  isDealer: false,
  referralCount: 0,
  subscriptionCost: 0,
  nextBillingDate: null,
  accountBalance: 0,
  referralToken: null,
  referralByToken: null,
  countryCount: 0,
  countryCodes: '',
  currentMonthCommission: 0,
  lastMonthCommission: 0,
  totalWithdrawalAmount: 0,
  totalEarnings: 0,
  totalWalletBalance: 0,
  referralActivity: []
} as SubscriptionStatus

export function useSubscription() {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>(MOCK_SUBSCRIPTION_DATA)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      setIsLoading(true)
      setError(null)

      const userData = getUserData()
      const token = getAuthToken();

      try {
      const [userDataResponse, subscriptionDataResponse, DashboardDataResponse] = await Promise.all([
        fetch(`https://decoded-app-stamp-api-prod-01.azurewebsites.net/api/v1/User/${userData?.userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(res => res.json()),
        fetch(`https://decoded-app-stamp-api-prod-01.azurewebsites.net/api/v1/UserSubscription/Active/${userData?.userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(res => res.json()),
        fetch(`https://decoded-app-stamp-api-prod-01.azurewebsites.net/api/v1/Wallet/Dashboard/${userData?.userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(res => res.json())
      ])

      try {
        if (!isAuthenticated()) {
          return
        }

        setSubscriptionStatus({
          accountBalance: userDataResponse.walletBalance,
          isDealer: userDataResponse.isDealer,
          isSubscribed: userDataResponse.subscriptionStatus === "Active" ? true : false,
          currentMonthCommission: DashboardDataResponse.thisMonthCommission,
          lastMonthCommission: DashboardDataResponse.lastMonthCommission,
          totalWithdrawalAmount: DashboardDataResponse.totalWithdrawalAmount,
          totalEarnings: DashboardDataResponse.totalWalletBalance + DashboardDataResponse.totalWithdrawalAmount,
          totalWalletBalance: DashboardDataResponse.totalWalletBalance,
          nextBillingDate: subscriptionDataResponse?.nextPaymentDate,
          referralCount: userDataResponse.activeReferralCount,
          referralToken: userDataResponse.myReferralCode,
          referralByToken: userDataResponse.referredByCode,
          subscriptionCost: subscriptionDataResponse?.price,
          countryCount: subscriptionDataResponse?.countryCount,
          countryCodes: subscriptionDataResponse?.countryCodes,
          referralActivity: DashboardDataResponse.topReferrals.map((d: any) => ({
            name: d.referredUserName,
            plan: `$${d.totalCommission * 5}/month`,
            commission: `$${d.totalCommission}`,
            date: d.lastCommissionDate.slice(0,10),
          }))
        })

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch subscription status')
        setIsLoading(false)
      } finally {
        setIsLoading(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch subscription status')
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
    return {
      countries: subscriptionStatus.countryCount, 
      price: subscriptionStatus.subscriptionCost,
      countryCodes: subscriptionStatus.countryCodes
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
