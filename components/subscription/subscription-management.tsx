"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import {
    ArrowLeft,
    Crown,
    TrendingUp,
    Star,
    Settings,
    AlertTriangle,
    Calendar,
    CheckCircle,
    X,
    CreditCard,
    ArrowRight,
    Zap
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { SubscriptionUpgradeFlow } from "./subscription-upgrade-flow"

interface SubscriptionManagementProps {
    onBack: () => void
    currentSubscription: {
        tier: string
        countries: string
        price: number
        selectedCountries?: Array<{
            id: string
            name: string
            flag: string
        }>
        nextBillingDate: string
        status: 'active' | 'cancelled' | 'past_due'
        isDealer: boolean
    }
}

// Available pricing tiers for upgrades
const availableTiers = [
    {
        id: '1-country',
        countries: '1 Country',
        price: 6,
        description: 'Perfect for collectors focused on a single country\'s stamps',
        features: ['Country catalog access', 'Basic search & filtering', 'Stamp identification', 'Collection tracking']
    },
    {
        id: '2-countries',
        countries: '2 Countries', 
        price: 8,
        description: 'Great for collectors interested in two regions',
        features: ['Country catalog access', 'Basic search & filtering', 'Stamp identification', 'Collection tracking', 'Advanced search filters', 'Cross-country comparisons']
    },
    {
        id: '3-countries',
        countries: '3 Countries',
        price: 10,
        description: 'Ideal for serious collectors exploring multiple regions',
        features: ['Country catalog access', 'Basic search & filtering', 'Stamp identification', 'Collection tracking', 'Advanced search filters', 'Cross-country comparisons', 'Market value estimates']
    },
    {
        id: 'all-countries',
        countries: 'All Countries',
        price: 12,
        description: 'Complete access for passionate philatelists',
        features: ['Country catalog access', 'Basic search & filtering', 'Stamp identification', 'Collection tracking', 'Advanced search filters', 'Cross-country comparisons', 'Market value estimates', 'Expert analysis', 'Priority support']
    }
]

export function SubscriptionManagement({ onBack, currentSubscription }: SubscriptionManagementProps) {
    const { toast } = useToast()
    const [showUpgradeFlow, setShowUpgradeFlow] = useState(false)
    const [selectedUpgradeTier, setSelectedUpgradeTier] = useState<typeof availableTiers[0] | null>(null)
    const [isCancelling, setIsCancelling] = useState(false)

    // Get current tier details
    const currentTier = availableTiers.find(tier => tier.id === currentSubscription.tier) || availableTiers[0]
    
    // Get available upgrade tiers (higher price only)
    const upgradeTiers = availableTiers.filter(tier => tier.price > (currentSubscription.isDealer ? 2 : currentTier.price))

    const handleCancelSubscription = async () => {
        setIsCancelling(true)
        try {
            // Simulate API call to cancel subscription
            await new Promise(resolve => setTimeout(resolve, 1500))
            
            // TODO: Replace with actual API call to:
            // - Mark subscription as cancelled
            // - Set cancellation effective date to next billing cycle
            // - Send confirmation email
            // - Update user's subscription status
            
            toast({
                title: "Subscription cancelled",
                description: `Your subscription will remain active until ${currentSubscription.nextBillingDate}. No further charges will occur.`,
            })
            
            // Update local state to reflect cancellation
            // In real app, this would trigger a re-fetch of subscription data
            onBack()
            
        } catch (error) {
            toast({
                title: "Cancellation failed",
                description: "There was an error cancelling your subscription. Please try again or contact support.",
                variant: "destructive",
            })
        } finally {
            setIsCancelling(false)
        }
    }

    const handleUpgradeTier = (tier: typeof availableTiers[0]) => {
        setSelectedUpgradeTier(tier)
        setShowUpgradeFlow(true)
    }

    if (showUpgradeFlow && selectedUpgradeTier) {
        return (
            <SubscriptionUpgradeFlow
                currentSubscription={currentSubscription}
                upgradeTier={selectedUpgradeTier}
                onBack={() => {
                    setShowUpgradeFlow(false)
                    setSelectedUpgradeTier(null)
                }}
                onSuccess={() => {
                    // Handle successful upgrade
                    toast({
                        title: "Subscription upgraded!",
                        description: "Your subscription has been upgraded and is now active.",
                    })
                    setShowUpgradeFlow(false)
                    setSelectedUpgradeTier(null)
                    onBack()
                }}
            />
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={onBack}
                        className="mb-4"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>

                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-2">Manage Subscription</h1>
                        <p className="text-muted-foreground">
                            Upgrade your plan or modify your subscription settings
                        </p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Current Subscription */}
                    <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 text-primary" />
                                    Your Current Subscription
                                </div>
                                <Badge 
                                    variant={currentSubscription.status === 'active' ? 'default' : 'destructive'}
                                    className={currentSubscription.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' : ''}
                                >
                                    {currentSubscription.status === 'active' ? 'Active' : 
                                     currentSubscription.status === 'cancelled' ? 'Cancelled' : 'Past Due'}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-lg">{currentSubscription.countries}</h3>
                                    <p className="text-sm text-muted-foreground mb-3">{currentTier.description}</p>
                                    
                                    {currentSubscription.selectedCountries && (
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium">Selected Countries:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {currentSubscription.selectedCountries.map(country => (
                                                    <Badge key={country.id} variant="secondary" className="text-xs">
                                                        {country.flag} {country.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Monthly Cost</span>
                                        <span className="font-semibold">
                                            ${currentSubscription.isDealer ? 2 : currentSubscription.price}/month
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Next Billing</span>
                                        <span className="font-semibold">{currentSubscription.nextBillingDate}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">User Type</span>
                                        <div className="flex items-center gap-1">
                                            {currentSubscription.isDealer && <Crown className="w-4 h-4 text-amber-600" />}
                                            <span className="font-semibold">
                                                {currentSubscription.isDealer ? 'Dealer' : 'Normal Subscriber'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {currentSubscription.isDealer && (
                                <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Crown className="w-4 h-4 text-amber-600" />
                                        <span className="font-medium text-amber-800 dark:text-amber-200">Dealer Benefits Active</span>
                                    </div>
                                    <p className="text-sm text-amber-700 dark:text-amber-300">
                                        You're enjoying $2/month pricing for any subscription tier and continue earning 20% commission on all referrals.
                                    </p>
                                </div>
                            )}

                            {/* Current Plan Features */}
                            <div>
                                <h4 className="font-medium mb-2">Current Plan Features:</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {currentTier.features.map((feature, index) => (
                                        <div key={index} className="flex items-center gap-2 text-sm">
                                            <CheckCircle className="w-3 h-3 text-green-600" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Upgrade Options */}
                    {upgradeTiers.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                    Upgrade Your Plan
                                </CardTitle>
                                <CardDescription>
                                    Instantly unlock more countries and features. 
                                    {currentSubscription.isDealer ? " As a dealer, you'll continue paying just $2/month." : " Upgrade takes effect immediately."}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {upgradeTiers.map((tier) => {
                                        const monthlyPrice = currentSubscription.isDealer ? 2 : tier.price
                                        const priceDifference = monthlyPrice - (currentSubscription.isDealer ? 2 : currentSubscription.price)
                                        
                                        return (
                                            <Card key={tier.id} className="hover:shadow-md transition-shadow cursor-pointer group">
                                                <CardHeader className="pb-3">
                                                    <CardTitle className="text-lg">{tier.countries}</CardTitle>
                                                    <div className="space-y-1">
                                                        <p className="text-2xl font-bold text-primary">
                                                            ${monthlyPrice}
                                                            <span className="text-sm font-normal text-muted-foreground">/month</span>
                                                        </p>
                                                        {priceDifference > 0 && (
                                                            <p className="text-sm text-green-600">
                                                                +${priceDifference}/month
                                                            </p>
                                                        )}
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-3">
                                                    <p className="text-sm text-muted-foreground">{tier.description}</p>
                                                    
                                                    <div className="space-y-1">
                                                        {tier.features.slice(0, 3).map((feature, index) => (
                                                            <div key={index} className="flex items-center gap-2 text-xs">
                                                                <CheckCircle className="w-3 h-3 text-green-600" />
                                                                <span>{feature}</span>
                                                            </div>
                                                        ))}
                                                        {tier.features.length > 3 && (
                                                            <p className="text-xs text-muted-foreground">
                                                                +{tier.features.length - 3} more features
                                                            </p>
                                                        )}
                                                    </div>

                                                    <Button 
                                                        className="w-full group-hover:scale-105 transition-transform"
                                                        onClick={() => handleUpgradeTier(tier)}
                                                    >
                                                        <Zap className="w-4 h-4 mr-2" />
                                                        Upgrade Now
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Subscription Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="w-5 h-5" />
                                Subscription Actions
                            </CardTitle>
                            <CardDescription>
                                Manage your subscription settings
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Cancel Subscription */}
                            <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                    <div className="flex-grow">
                                        <h4 className="font-medium text-red-800 dark:text-red-200 mb-1">
                                            Cancel Subscription
                                        </h4>
                                        <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                                            Your subscription will remain active until {currentSubscription.nextBillingDate}. 
                                            You'll lose access to premium features after this date, but your referral commissions will continue.
                                        </p>
                                        
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="sm">
                                                    Cancel Subscription
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure you want to cancel?</AlertDialogTitle>
                                                    <AlertDialogDescription className="space-y-2">
                                                        <p>
                                                            Your subscription will be cancelled effective {currentSubscription.nextBillingDate}. 
                                                            You'll continue to have access until then.
                                                        </p>
                                                        <p className="font-medium">
                                                            After cancellation:
                                                        </p>
                                                        <ul className="list-disc list-inside text-sm space-y-1">
                                                            <li>You'll lose access to premium stamp catalogs</li>
                                                            <li>Advanced search features will be disabled</li>
                                                            <li>You'll keep your referral commissions and account balance</li>
                                                            <li>You can resubscribe anytime to restore access</li>
                                                        </ul>
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                                                    <AlertDialogAction 
                                                        onClick={handleCancelSubscription}
                                                        disabled={isCancelling}
                                                        className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        {isCancelling ? "Cancelling..." : "Yes, Cancel Subscription"}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
