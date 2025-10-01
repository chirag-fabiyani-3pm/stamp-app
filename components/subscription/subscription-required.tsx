"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Crown,
  DollarSign,
  Users,
  CheckCircle,
  ArrowRight,
  Gift,
} from "lucide-react"
import { CountrySelectionScreen } from "./country-selection-screen"
import { getAuthToken } from "@/lib/api/auth"
import { Spinner } from "../ui/spinner"

interface SubscriptionRequiredProps {
  userReferralCode?: string
}

// const pricingTiers = [
//   {
//     id: '1-country',
//     countries: "1 Country",
//     price: 6,
//     description: "Perfect for focused collectors",
//   },
//   {
//     id: '2-countries',
//     countries: "2 Countries",
//     price: 8,
//     description: "Great for regional collectors",
//   },
//   {
//     id: '3-countries',
//     countries: "3 Countries",
//     price: 10,
//     description: "Ideal for serious collectors",
//   },
//   {
//     id: 'all-countries',
//     countries: "All Countries",
//     price: 12,
//     description: "Complete access for enthusiasts",
//   }
// ]

export function SubscriptionRequired({ userReferralCode }: SubscriptionRequiredProps) {
  const [selectedTier, setSelectedTier] = useState<string>('2-countries')
  const [showCountrySelection, setShowCountrySelection] = useState(false)
  const [pricingTiers, setPricingTiers] = useState<{ id: string, countries: string, price: number, description: string, countryCount: number }[]>([])
  const [loadingPricingTier, setLoadingPricingTier] = useState(false)

  useEffect(() => {
    setLoadingPricingTier(true)
    const token = getAuthToken()
    if (!token) return
    fetch(`https://decoded-app-stamp-api-prod-01.azurewebsites.net/api/v1/UserSubscriptionPlan`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => res.json()).then(res => {
      setSelectedTier(res.items[1].id)
      setPricingTiers(res.items.map((i: any) => ({
        id: i.id,
        countries: i.countryCountDisplay,
        price: i.regularPrice,
        description: i.description,
        countryCount: i.countryCount
      })))
    }).finally(() => {
      setLoadingPricingTier(false)
    })
  }, [])

  const handleSubscribe = () => {
    const tier = pricingTiers.find(tier => tier.id === selectedTier)!

    // If "All Countries" is selected, skip country selection
    if (selectedTier === 'all-countries') {
      // TODO: Go directly to payment for all countries
      setShowCountrySelection(true) // For now, still show selection screen
    } else {
      // Show country selection for limited tiers
      setShowCountrySelection(true)
    }
  }

  if (showCountrySelection) {
    return (
      <CountrySelectionScreen
        selectedTier={pricingTiers.find(tier => tier.id === selectedTier)!}
        onBack={() => setShowCountrySelection(false)}
        userReferralCode={userReferralCode}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 container mx-auto px-4 md:px-10 py-4">
      <div>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
            Welcome to Stamps of Approval
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            To access our premium stamp catalog and features, please choose a subscription plan that fits your collecting interests.
          </p>
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-amber-800 dark:text-amber-200 text-sm">
              <strong>Signature Offering:</strong> Start earning 20% commission on referrals from day one, and unlock Dealer pricing ($2/month) after just 20 referrals!
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        {loadingPricingTier ? <div className="flex justify-center items-center w-full"><Spinner size="lg" /></div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">{pricingTiers.map((tier) => (
          <Card
            key={tier.id}
            className={`relative cursor-pointer transition-all duration-300 hover:shadow-lg ${selectedTier === tier.id
              ? 'ring-2 ring-primary shadow-lg scale-105'
              : 'hover:scale-102'
              }`}
            onClick={() => setSelectedTier(tier.id)}
          >
            <CardContent className="text-center p-3">
              <CardTitle className="text-2xl font-bold text-primary">
                ${tier.price}
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </CardTitle>
              <CardDescription className="font-medium">{tier.countries}</CardDescription>
              <p className="text-sm text-muted-foreground">{tier.description}</p>
              {selectedTier === tier.id && (
                <div className="mt-2">
                  <CheckCircle className="w-5 h-5 text-primary mx-auto" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        </div>
        }
      </div>

      {/* Referral Benefits */}
      <Card className="max-w-4xl mx-auto mb-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-green-600" />
            Referral Program Benefits
          </CardTitle>
          <CardDescription>
            Start earning from your first referral and unlock exclusive Dealer status
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">20% Commission</h3>
            <p className="text-sm text-muted-foreground">
              Earn 20% of each referral's monthly subscription as rewards
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Grow Your Network</h3>
            <p className="text-sm text-muted-foreground">
              Share your passion and build a community of collectors
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <Crown className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-semibold mb-2">Dealer Status</h3>
            <p className="text-sm text-muted-foreground">
              Reach 20 referrals and get $2/month subscription + continued commissions
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Section */}
      <div className="text-center">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Ready to Start Collecting?</h3>
              <p className="text-muted-foreground">
                Selected: <span className="font-medium text-primary">
                  {pricingTiers.find(tier => tier.id === selectedTier)?.countries}
                </span> for <span className="font-bold text-primary">
                  ${pricingTiers.find(tier => tier.id === selectedTier)?.price}/month
                </span>
              </p>
            </div>

            <Button
              onClick={handleSubscribe}
              size="lg"
              className="w-full md:w-auto"
            >
              Subscribe Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
