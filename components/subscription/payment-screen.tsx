"use client"

import { useEffect, useMemo, useRef, useState } from "react"
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
import { Appearance, loadStripe, StripeCardElement } from "@stripe/stripe-js";
import { Elements, CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import CheckoutForm from "./checkout-form"
import { getAuthToken, getUserData } from "@/lib/api/auth"

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
    const [clientSecret, setClientSecret] = useState<string | null>(null)
    const [subscriptionPaymentIntentId, setSubscriptionPaymentIntentId] = useState<string | null>(null)
    const initiateProcessOnceRef = useRef<boolean>(false)

    useEffect(() => {
        if(initiateProcessOnceRef?.current) return;
        initiateProcessOnceRef.current = true
        const userData = getUserData()
        // Create PaymentIntent as soon as the page loads
        fetch("https://decoded-app-stamp-api-prod-01.azurewebsites.net/api/v1/Subscription/InitiateProcess", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${getAuthToken()}` },
            body: JSON.stringify({
                userId: userData?.userId,
                planId: selectedTier.id,
                countryCode: selectedTier.selectedCountries?.map((c: any) => c.countryCode).join(',')
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setClientSecret(data.clientSecret)
                setSubscriptionPaymentIntentId(data.subscriptionPaymentIntentId)
            });
    }, []);

    return (
        <div className="min-h-screen bg-background container mx-auto px-4 md:px-10 py-4">
            <div>
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
                                <Separator />
                                <div className="flex justify-between font-semibold">
                                    <span>Total (Monthly)</span>
                                    <span>${selectedTier.price}.00</span>
                                </div>
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
                            {clientSecret && subscriptionPaymentIntentId && <Elements stripe={stripePromise}>
                                <CheckoutForm selectedTier={selectedTier} clientSecret={clientSecret} subscriptionPaymentIntentId={subscriptionPaymentIntentId} />
                            </Elements>}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
