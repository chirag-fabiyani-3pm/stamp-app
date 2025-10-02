import React, { useMemo, useState } from "react";
import {
  useStripe,
  useElements,
  CardElement
} from "@stripe/react-stripe-js";
import { StripeCardElement, StripeCardElementOptions, StripePaymentElementOptions } from "@stripe/stripe-js";
import { getAuthToken, getUserData } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";

interface CheckoutFormProps {
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
}

export default function CheckoutForm({ selectedTier }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {theme} = useTheme()

  console.log(theme)

  const cardElementOptions: StripeCardElementOptions = useMemo(() => ({
    style: {
      base: {
        fontSize: '16px',
        color: theme === 'dark' ? '#F8FAFc' : '#020817',
        backgroundColor: 'hsl(var(--background))',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        fontWeight: '400',
        '::placeholder': {
          color: 'hsl(var(--muted-foreground))',
        },
        iconColor: theme === 'dark' ? '#F8FAFc' : '#020817',
      },
      invalid: {
        color: 'hsl(var(--destructive))',
      },
    },
    hidePostalCode: true
  }), [theme]);

  const handleCreatePaymentMethod = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsProcessing(true);

    const userData = await fetch(`https://decoded-app-stamp-api-prod-01.azurewebsites.net/api/v1/User/${getUserData()?.userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    })
    .then(res => res.json())

    const { clientSecret, subscriptionPaymentIntentId } = await fetch("https://decoded-app-stamp-api-prod-01.azurewebsites.net/api/v1/Subscription/InitiateProcess", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getAuthToken()}` },
      body: JSON.stringify({
          userId: userData?.id,
          planId: selectedTier.id,
          countryCode: selectedTier.selectedCountries?.map((c: any) => c.countryCode).join(',')
      }),
    }).then((res) => res.json())

    if (!stripe || !elements) {
      setErrorMessage('Payment system not ready. Please try again.');
      setIsProcessing(false);
      return;
    }

    if (!clientSecret) {
      setErrorMessage('Payment configuration error. Please contact support.');
      setIsProcessing(false);
      return;
    }

    try {
      // Check if it's a SetupIntent or PaymentIntent
      const isSetupIntent = clientSecret.startsWith('seti_');

      if (isSetupIntent) {
        // Confirm setup intent with client secret
        const { error: stripeError, setupIntent } = await stripe.confirmCardSetup(
          clientSecret,
          {
            payment_method: {
              card: elements.getElement(CardElement) as StripeCardElement,
              billing_details: {
                name: userData?.firstName + ' ' + userData?.lastName,
                email: userData?.email,
                phone: userData?.mobileNumber,
              },
            },
          }
        );

        if (stripeError) {
          setErrorMessage(stripeError.message || 'Payment failed. Please check your card details and try again.');
          setIsProcessing(false);
          return;
        }

        fetch("https://decoded-app-stamp-api-prod-01.azurewebsites.net/api/v1/Subscription/Finalize", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${getAuthToken()}` },
          body: JSON.stringify({
            userId: userData?.id,
            planId: selectedTier.id,
            paymentMethodId: setupIntent.payment_method,
            status: setupIntent.status,
            subscriptionPaymentIntentId,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.result.status === 'Active') {
              window.location.href = "/"
            } else {
              setErrorMessage('Subscription activation failed. Please contact support.');
            }
            setIsProcessing(false);
          })
          .catch(() => {
            setErrorMessage('Subscription activation failed. Please try again or contact support.');
            setIsProcessing(false);
          });
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred. Please try again.');
      setIsProcessing(false);
      console.log(`Error: ${err instanceof Error ? err.message : 'An unknown error occurred'}`)
    }
  };

  return (
    <form id="payment-form" onSubmit={handleCreatePaymentMethod} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Card Information
        </label>
        <div className="border border-input rounded-lg p-3 bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-colors">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || !elements || isProcessing}
        className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base shadow-sm transition-colors disabled:opacity-50"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          'Complete Subscription'
        )}
      </Button>

      <div className="text-center text-xs text-muted-foreground">
        By completing your purchase, you agree to our Terms of Service and Privacy Policy
      </div>
    </form>
  );
}