"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    ArrowLeft,
    CreditCard,
    Shield,
    CheckCircle,
    Gift
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Appearance, loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./checkout-form"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

interface PaymentScreenProps {
    selectedTier: {
        id: string
        countries: string
        price: number
        description: string
        selectedCountries?: Array<{
            id: string
            name: string
            flag: string
        }>
    }
    onBack: () => void
    userReferralCode?: string
}

export function PaymentScreen({ selectedTier, onBack, userReferralCode }: PaymentScreenProps) {
    const { toast } = useToast()
    const [isProcessing, setIsProcessing] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [paymentData, setPaymentData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardName: ''
    })
    const [clientSecret, setClientSecret] = useState<string | null>(null)

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault()

        // For demo purposes, we'll skip validation and auto-fill
        setIsProcessing(true)

        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000))

            // TODO: Replace with actual payment API call that collects:
            // - Selected tier (number of countries)
            // - Referral token (if provided)
            // - Payment information
            // - Generate unique referral token for new user
            // - Set up subscription billing
            // - Create commission tracking if referral code was used

            toast({
                title: "Payment successful!",
                description: "Welcome to Stamps of Approval! Your subscription is now active.",
            })

            // Update localStorage for demo
            localStorage.setItem('demo_subscribed', 'true')
            localStorage.setItem('demo_tier', selectedTier.id)
            if (userReferralCode) {
                localStorage.setItem('demo_used_referral', userReferralCode)
            }

            setShowSuccess(true)

        } catch (error) {
            toast({
                title: "Payment failed",
                description: "There was an error processing your payment. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsProcessing(false)
        }
    }

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        fetch("/api/stripe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: [{ id: "xl-tshirt", amount: 1000 }] }),
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret));
    }, []);

    if (showSuccess) {
        // Redirect to home page to show the main catalog
        window.location.href = "/"
        return null
    }

    const appearance: Appearance = {
        // theme: 'stripe',
    };
    // Enable the skeleton loader UI for optimal loading.
    const loader = 'auto';

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
                        Back to Plans
                    </Button>

                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-2">Complete Your Subscription</h1>
                        <p className="text-muted-foreground">
                            You're just one step away from accessing our premium stamp catalog
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Order Summary */}
                    <Card className="h-fit">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                            <CardDescription>Review your subscription details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-medium">{selectedTier.countries}</h3>
                                    <p className="text-sm text-muted-foreground">{selectedTier.description}</p>
                                    {selectedTier.selectedCountries && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {selectedTier.selectedCountries.map(country => (
                                                <span key={country.id} className="text-xs bg-primary/10 px-2 py-1 rounded">
                                                    {country.flag} {country.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">${selectedTier.price}/month</p>
                                </div>
                            </div>

                            <Separator />

                            {userReferralCode && (
                                <>
                                    <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Gift className="w-4 h-4 text-green-600" />
                                            <span className="text-sm font-medium text-green-700 dark:text-green-400">
                                                Referral Applied
                                            </span>
                                        </div>
                                        <p className="text-xs text-green-600 dark:text-green-400">
                                            Code: {userReferralCode} • You'll start earning 20% commission immediately!
                                        </p>
                                    </div>
                                    <Separator />
                                </>
                            )}

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Subscription ({selectedTier.countries})</span>
                                    <span>${selectedTier.price}.00</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Tax (15%)</span>
                                    <span>$1.92</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-semibold">
                                    <span>Total (Monthly)</span>
                                    <span>${(selectedTier.price + selectedTier.price * 0.15).toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Benefits Reminder */}
                            <div className="bg-primary/5 p-4 rounded-lg">
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                    What you get:
                                </h4>
                                <ul className="text-sm space-y-1">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-3 h-3 text-green-600" />
                                        Full access to {selectedTier.countries.toLowerCase()} stamp catalog
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-3 h-3 text-green-600" />
                                        Advanced search and identification tools
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-3 h-3 text-green-600" />
                                        20% commission on all referrals
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-3 h-3 text-green-600" />
                                        Path to Dealer status ($2/month at 20 referrals)
                                    </li>
                                </ul>
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
                                    Your payment information is secure and encrypted
                                </div>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {clientSecret && <Elements options={{ clientSecret, appearance, loader }} stripe={stripePromise}>
                                <CheckoutForm selectedTier={selectedTier} userReferralCode={userReferralCode} />
                            </Elements>}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
