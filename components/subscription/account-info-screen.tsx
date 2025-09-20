"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  CheckCircle, 
  Crown, 
  DollarSign, 
  Users, 
  Copy,
  ArrowRight,
  Gift,
  TrendingUp,
  Calendar,
  Target
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface AccountInfoScreenProps {
  selectedTier: {
    id: string
    countries: string
    price: number
    description: string
  }
  userReferralCode?: string
}

export function AccountInfoScreen({ selectedTier, userReferralCode }: AccountInfoScreenProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [referralToken] = useState('REF-' + Math.random().toString(36).substring(2, 8).toUpperCase())
  
  // Mock referral data
  const referralCount = 0
  const referralProgress = (referralCount / 20) * 100
  const monthlyCommission = 0
  const nextBillingDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralToken)
    toast({
      title: "Referral code copied!",
      description: "Share this code with friends to start earning commissions.",
    })
  }

  const handleGetStarted = () => {
    // Reload the page to trigger the subscription check and show the main app
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-green-600 mb-2">Welcome to Stamps of Approval!</h1>
          <p className="text-xl text-muted-foreground">
            Your subscription is now active. Here's everything you need to know.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Subscription Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-primary" />
                Your Subscription
              </CardTitle>
              <CardDescription>Active subscription details and billing information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{selectedTier.countries}</h3>
                  <p className="text-sm text-muted-foreground">{selectedTier.description}</p>
                </div>
                <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                  Active
                </Badge>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Cost</p>
                  <p className="font-semibold">${selectedTier.price}/month</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Next Billing</p>
                  <p className="font-semibold">{nextBillingDate}</p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-700 dark:text-blue-400">What's Next?</span>
                </div>
                <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                  <li>• Start exploring our comprehensive stamp catalog</li>
                  <li>• Use advanced search and identification tools</li>
                  <li>• Share your referral code to earn commissions</li>
                  <li>• Work towards Dealer status (20 referrals = $2/month)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Referral Program */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-green-600" />
                Your Referral Program
              </CardTitle>
              <CardDescription>Start earning 20% commission on referrals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-primary/5 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Your Referral Code</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={copyReferralCode}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <div className="bg-background p-3 rounded border font-mono text-center text-lg font-bold">
                  {referralToken}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress to Dealer Status</span>
                    <span>{referralCount}/20 referrals</span>
                  </div>
                  <Progress value={referralProgress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-1" />
                    <p className="text-sm text-muted-foreground">Monthly Commission</p>
                    <p className="font-bold text-green-600">${monthlyCommission.toFixed(2)}</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                    <p className="text-sm text-muted-foreground">Total Referrals</p>
                    <p className="font-bold text-blue-600">{referralCount}</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-amber-600" />
                  <span className="font-medium text-amber-700 dark:text-amber-400">Dealer Benefits</span>
                </div>
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  Reach 20 referrals to unlock $2/month subscription + continued 20% commissions on all referrals!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Commission Calculator */}
        <Card className="max-w-4xl mx-auto mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Commission Calculator
            </CardTitle>
            <CardDescription>See your earning potential with referrals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">5 Referrals</p>
                <p className="text-2xl font-bold text-green-600">$10/mo</p>
                <p className="text-xs text-muted-foreground">Avg commission</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">10 Referrals</p>
                <p className="text-2xl font-bold text-blue-600">$20/mo</p>
                <p className="text-xs text-muted-foreground">Avg commission</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">20 Referrals</p>
                <p className="text-2xl font-bold text-purple-600">$40/mo</p>
                <p className="text-xs text-muted-foreground">+ $2 subscription</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/20 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">50 Referrals</p>
                <p className="text-2xl font-bold text-amber-600">$100/mo</p>
                <p className="text-xs text-muted-foreground">+ $2 subscription</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="text-center mt-8">
          <Button 
            onClick={handleGetStarted}
            size="lg" 
            className="px-8"
          >
            Start Exploring Your Catalog
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            You can access all features and manage your subscription from your profile.
          </p>
        </div>
      </div>
    </div>
  )
}
