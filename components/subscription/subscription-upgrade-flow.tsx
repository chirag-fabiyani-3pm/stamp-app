"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
    ArrowLeft,
    Globe,
    CheckCircle,
    AlertCircle,
    ArrowRight,
    CreditCard,
    Shield,
    Zap,
    TrendingUp
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { PaymentScreen } from "./payment-screen"

interface SubscriptionUpgradeFlowProps {
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
    upgradeTier: {
        id: string
        countries: string
        price: number
        description: string
        features: string[]
    }
    onBack: () => void
    onSuccess: () => void
}

// List of available countries for stamp catalogs
const availableCountries = [
    { id: 'usa', name: 'United States', flag: '🇺🇸', popular: true },
    { id: 'uk', name: 'United Kingdom', flag: '🇬🇧', popular: true },
    { id: 'canada', name: 'Canada', flag: '🇨🇦', popular: true },
    { id: 'australia', name: 'Australia', flag: '🇦🇺', popular: true },
    { id: 'germany', name: 'Germany', flag: '🇩🇪', popular: true },
    { id: 'france', name: 'France', flag: '🇫🇷', popular: true },
    { id: 'japan', name: 'Japan', flag: '🇯🇵', popular: false },
    { id: 'china', name: 'China', flag: '🇨🇳', popular: false },
    { id: 'india', name: 'India', flag: '🇮🇳', popular: false },
    { id: 'brazil', name: 'Brazil', flag: '🇧🇷', popular: false },
    { id: 'russia', name: 'Russia', flag: '🇷🇺', popular: false },
    { id: 'italy', name: 'Italy', flag: '🇮🇹', popular: false },
    { id: 'spain', name: 'Spain', flag: '🇪🇸', popular: false },
    { id: 'netherlands', name: 'Netherlands', flag: '🇳🇱', popular: false },
    { id: 'switzerland', name: 'Switzerland', flag: '🇨🇭', popular: false },
    { id: 'sweden', name: 'Sweden', flag: '🇸🇪', popular: false },
    { id: 'norway', name: 'Norway', flag: '🇳🇴', popular: false },
    { id: 'denmark', name: 'Denmark', flag: '🇩🇰', popular: false },
    { id: 'belgium', name: 'Belgium', flag: '🇧🇪', popular: false },
    { id: 'austria', name: 'Austria', flag: '🇦🇹', popular: false },
]

export function SubscriptionUpgradeFlow({ currentSubscription, upgradeTier, onBack, onSuccess }: SubscriptionUpgradeFlowProps) {
    const { toast } = useToast()
    const [currentStep, setCurrentStep] = useState<'confirm' | 'countries' | 'payment'>('confirm')
    const [selectedCountries, setSelectedCountries] = useState<string[]>(
        currentSubscription.selectedCountries?.map(c => c.id) || []
    )
    const [isProcessing, setIsProcessing] = useState(false)

    const currentPrice = currentSubscription.isDealer ? 2 : currentSubscription.price
    const upgradePrice = currentSubscription.isDealer ? 2 : upgradeTier.price
    const priceDifference = upgradePrice - currentPrice

    // Determine if country selection is needed
    const needsCountrySelection = upgradeTier.id !== 'all-countries'
    const maxCountries = upgradeTier.id === '1-country' ? 1 :
                        upgradeTier.id === '2-countries' ? 2 :
                        upgradeTier.id === '3-countries' ? 3 : 0

    const handleCountryToggle = (countryId: string) => {
        setSelectedCountries(prev => {
            if (prev.includes(countryId)) {
                return prev.filter(id => id !== countryId)
            } else if (prev.length < maxCountries) {
                return [...prev, countryId]
            }
            return prev
        })
    }

    const handleConfirmUpgrade = () => {
        if (needsCountrySelection && selectedCountries.length < maxCountries) {
            setCurrentStep('countries')
        } else {
            setCurrentStep('payment')
        }
    }

    const handleCountriesComplete = () => {
        if (selectedCountries.length === maxCountries) {
            setCurrentStep('payment')
        }
    }

    const handleUpgradeComplete = async () => {
        setIsProcessing(true)
        try {
            // Simulate upgrade processing
            await new Promise(resolve => setTimeout(resolve, 2000))

            // TODO: Replace with actual API call to:
            // - Update subscription tier immediately
            // - Process payment for price difference (prorated)
            // - Update country selections if applicable
            // - Send confirmation email
            // - Update user's subscription status

            toast({
                title: "Subscription upgraded successfully!",
                description: `You now have access to ${upgradeTier.countries.toLowerCase()}. Your upgrade is active immediately.`,
            })

            onSuccess()

        } catch (error) {
            toast({
                title: "Upgrade failed",
                description: "There was an error upgrading your subscription. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsProcessing(false)
        }
    }

    // Confirm Upgrade Step
    if (currentStep === 'confirm') {
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
                            Back to Management
                        </Button>

                        <div className="text-center">
                            <h1 className="text-3xl font-bold mb-2">Confirm Your Upgrade</h1>
                            <p className="text-muted-foreground">
                                Review the changes to your subscription
                            </p>
                        </div>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Current vs New Comparison */}
                            <div className="space-y-6">
                                {/* Current Plan */}
                                <Card className="border-muted">
                                    <CardHeader>
                                        <CardTitle className="text-lg">Current Plan</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">{currentSubscription.countries}</span>
                                            <Badge variant="secondary">${currentPrice}/month</Badge>
                                        </div>
                                        
                                        {currentSubscription.selectedCountries && (
                                            <div>
                                                <p className="text-sm font-medium mb-2">Your Countries:</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {currentSubscription.selectedCountries.map(country => (
                                                        <Badge key={country.id} variant="outline" className="text-xs">
                                                            {country.flag} {country.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Upgrade To */}
                                <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5 text-green-600" />
                                            Upgrading To
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">{upgradeTier.countries}</span>
                                            <Badge className="bg-green-100 text-green-800 border-green-200">
                                                ${upgradePrice}/month
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{upgradeTier.description}</p>
                                        
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium">New Features:</p>
                                            <ul className="space-y-1">
                                                {upgradeTier.features.map((feature, index) => (
                                                    <li key={index} className="flex items-center gap-2 text-sm">
                                                        <CheckCircle className="w-3 h-3 text-green-600" />
                                                        <span>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Upgrade Summary */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Upgrade Summary</CardTitle>
                                    <CardDescription>
                                        Your upgrade will be effective immediately
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Zap className="w-4 h-4 text-green-600" />
                                            <span className="font-medium text-green-800 dark:text-green-200">Instant Upgrade</span>
                                        </div>
                                        <p className="text-sm text-green-700 dark:text-green-300">
                                            Your new features will be available immediately after payment confirmation.
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span>Current Plan</span>
                                            <span>${currentPrice}/month</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>New Plan</span>
                                            <span>${upgradePrice}/month</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between font-semibold text-green-600">
                                            <span>Additional Cost</span>
                                            <span>+${priceDifference}/month</span>
                                        </div>
                                    </div>

                                    {currentSubscription.isDealer && (
                                        <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg">
                                            <p className="text-sm text-amber-700 dark:text-amber-300">
                                                <strong>Dealer Pricing:</strong> You'll continue paying just $2/month regardless of the tier you choose.
                                            </p>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <p className="text-sm font-medium">Next Steps:</p>
                                        <ol className="text-sm space-y-1 text-muted-foreground">
                                            {needsCountrySelection && selectedCountries.length < maxCountries && (
                                                <li>1. Select your countries for the new plan</li>
                                            )}
                                            <li>{needsCountrySelection && selectedCountries.length < maxCountries ? '2' : '1'}. Complete payment for the upgrade</li>
                                            <li>{needsCountrySelection && selectedCountries.length < maxCountries ? '3' : '2'}. Instant access to new features</li>
                                        </ol>
                                    </div>

                                    <Button 
                                        onClick={handleConfirmUpgrade}
                                        className="w-full"
                                        size="lg"
                                    >
                                        {needsCountrySelection && selectedCountries.length < maxCountries ? 
                                            'Continue to Country Selection' : 
                                            'Continue to Payment'
                                        }
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Country Selection Step
    if (currentStep === 'countries') {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <Button
                            variant="ghost"
                            onClick={() => setCurrentStep('confirm')}
                            className="mb-4"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Upgrade Confirmation
                        </Button>

                        <div className="text-center">
                            <h1 className="text-3xl font-bold mb-2">Select Your Countries</h1>
                            <p className="text-muted-foreground mb-4">
                                Choose {maxCountries === 1 ? 'the country' : `${maxCountries} countries`} for your upgraded {upgradeTier.countries} plan
                            </p>
                            <div className="flex justify-center">
                                <Badge variant="secondary" className="text-sm">
                                    <Globe className="w-4 h-4 mr-1" />
                                    {upgradeTier.countries} - ${upgradePrice}/month
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Selection Progress */}
                    <div className="max-w-2xl mx-auto mb-8">
                        <div className="flex items-center justify-center gap-4 p-4 bg-primary/5 rounded-lg">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-primary">{selectedCountries.length}</p>
                                <p className="text-sm text-muted-foreground">Selected</p>
                            </div>
                            <div className="text-muted-foreground">/</div>
                            <div className="text-center">
                                <p className="text-2xl font-bold">{maxCountries}</p>
                                <p className="text-sm text-muted-foreground">Required</p>
                            </div>
                            {selectedCountries.length === maxCountries && (
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            )}
                        </div>
                    </div>

                    {/* Current Countries Notice */}
                    {currentSubscription.selectedCountries && (
                        <Card className="max-w-4xl mx-auto mb-8 border-blue-200 bg-blue-50 dark:bg-blue-950/20">
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-medium text-blue-800 dark:text-blue-200">Current Selection</h3>
                                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1 mb-2">
                                            Your current countries are pre-selected. You can keep them or change to different countries.
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                            {currentSubscription.selectedCountries.map(country => (
                                                <Badge key={country.id} variant="outline" className="text-xs border-blue-300">
                                                    {country.flag} {country.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="max-w-6xl mx-auto">
                        {/* Countries Grid */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">Available Countries</h2>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {availableCountries.map((country) => {
                                    const isSelected = selectedCountries.includes(country.id)
                                    const canSelect = selectedCountries.length < maxCountries || isSelected

                                    return (
                                        <Card
                                            key={country.id}
                                            className={`cursor-pointer transition-all duration-200 ${isSelected
                                                ? 'ring-2 ring-primary bg-primary/5'
                                                : canSelect
                                                    ? 'hover:bg-muted/50'
                                                    : 'opacity-50 cursor-not-allowed'
                                                }`}
                                            onClick={() => canSelect && handleCountryToggle(country.id)}
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-2xl">{country.flag}</span>
                                                        <div>
                                                            <p className="font-medium">{country.name}</p>
                                                        </div>
                                                    </div>
                                                    <Checkbox
                                                        checked={isSelected}
                                                        disabled={!canSelect}
                                                        onChange={() => { }} // Handled by card click
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Selected Countries Summary */}
                        {selectedCountries.length > 0 && (
                            <Card className="mb-8">
                                <CardHeader>
                                    <CardTitle>Your Selection</CardTitle>
                                    <CardDescription>
                                        Countries included in your {upgradeTier.countries} subscription
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedCountries.map(countryId => {
                                            const country = availableCountries.find(c => c.id === countryId)!
                                            return (
                                                <Badge key={countryId} variant="default" className="text-sm">
                                                    {country.flag} {country.name}
                                                </Badge>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Continue Button */}
                        <div className="text-center">
                            <Button
                                onClick={handleCountriesComplete}
                                disabled={selectedCountries.length !== maxCountries}
                                size="lg"
                                className="px-8"
                            >
                                Continue to Payment
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>

                            {selectedCountries.length !== maxCountries && (
                                <p className="text-sm text-muted-foreground mt-2">
                                    Please select {maxCountries === 1 ? '1 country' : `all ${maxCountries} countries`} to continue
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Payment Step
    if (currentStep === 'payment') {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <Button
                            variant="ghost"
                            onClick={() => setCurrentStep(needsCountrySelection ? 'countries' : 'confirm')}
                            className="mb-4"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {needsCountrySelection ? 'Back to Country Selection' : 'Back to Upgrade Confirmation'}
                        </Button>

                        <div className="text-center">
                            <h1 className="text-3xl font-bold mb-2">Complete Your Upgrade</h1>
                            <p className="text-muted-foreground">
                                Process payment to upgrade your subscription immediately
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {/* Upgrade Summary */}
                        <Card className="h-fit">
                            <CardHeader>
                                <CardTitle>Upgrade Summary</CardTitle>
                                <CardDescription>Review your subscription upgrade</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-medium">{upgradeTier.countries} Plan</h3>
                                        <p className="text-sm text-muted-foreground">{upgradeTier.description}</p>
                                        {needsCountrySelection && (
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {selectedCountries.map(countryId => {
                                                    const country = availableCountries.find(c => c.id === countryId)!
                                                    return (
                                                        <span key={countryId} className="text-xs bg-primary/10 px-2 py-1 rounded">
                                                            {country.flag} {country.name}
                                                        </span>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">${upgradePrice}/month</p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Current Plan ({currentSubscription.countries})</span>
                                        <span>${currentPrice}/month</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>New Plan ({upgradeTier.countries})</span>
                                        <span>${upgradePrice}/month</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-semibold text-green-600">
                                        <span>Additional Monthly Cost</span>
                                        <span>+${priceDifference}/month</span>
                                    </div>
                                </div>

                                {/* Instant Upgrade Notice */}
                                <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Zap className="w-4 h-4 text-green-600" />
                                        <span className="text-sm font-medium text-green-700 dark:text-green-400">
                                            Instant Upgrade
                                        </span>
                                    </div>
                                    <p className="text-xs text-green-600 dark:text-green-400">
                                        Your upgrade will be active immediately after payment confirmation.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="w-5 h-5" />
                                    Payment Information
                                </CardTitle>
                                <CardDescription>
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-4 h-4" />
                                        Secure payment processing for your upgrade
                                    </div>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                        <strong>One-time charge:</strong> ${priceDifference.toFixed(2)} for the immediate upgrade.
                                        Your next billing cycle will be ${upgradePrice}/month starting {currentSubscription.nextBillingDate}.
                                    </p>
                                </div>

                                {/* Simple payment button for demo */}
                                <Button
                                    onClick={handleUpgradeComplete}
                                    disabled={isProcessing}
                                    className="w-full"
                                    size="lg"
                                >
                                    {isProcessing ? (
                                        "Processing Upgrade..."
                                    ) : (
                                        <>
                                            <CreditCard className="w-4 h-4 mr-2" />
                                            Complete Upgrade - ${priceDifference.toFixed(2)}
                                        </>
                                    )}
                                </Button>

                                <p className="text-xs text-muted-foreground text-center">
                                    By completing this upgrade, you agree to the new subscription terms and pricing.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

    return null
}
