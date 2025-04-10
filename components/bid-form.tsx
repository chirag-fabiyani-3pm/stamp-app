"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2 } from "lucide-react"

interface BidFormProps {
  listing: any // In a real app, this would be properly typed
}

export default function BidForm({ listing }: BidFormProps) {
  const [bidAmount, setBidAmount] = useState<string>(
    listing.currentBid ? (listing.currentBid + 2.5).toFixed(2) : listing.price?.toFixed(2) || "",
  )
  const [paymentMethod, setPaymentMethod] = useState<string>("credit-card")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)

  const isAuction = Boolean(listing.currentBid)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setSuccess(true)
    }, 1500)
  }

  if (success) {
    return (
      <div className="text-center py-6">
        <div className="bg-green-100 text-green-800 p-4 rounded-md mb-4">
          {isAuction ? "Your bid has been placed successfully!" : "Your purchase has been completed successfully!"}
        </div>
        <p className="text-muted-foreground mb-4">
          {isAuction
            ? "You will be notified if you are outbid or if you win the auction."
            : "The seller will be notified and will process your order soon."}
        </p>
        <Button variant="outline" onClick={() => setSuccess(false)}>
          Return to Listing
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isAuction ? (
        <div>
          <Label htmlFor="bid-amount">Your Bid Amount ($)</Label>
          <Input
            id="bid-amount"
            type="number"
            min={listing.currentBid + 0.01}
            step="0.01"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            required
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Current bid: ${listing.currentBid.toFixed(2)}</span>
            <span>Minimum bid: ${(listing.currentBid + 0.01).toFixed(2)}</span>
          </div>
        </div>
      ) : (
        <div className="bg-primary/5 p-4 rounded-md">
          <div className="flex justify-between items-center">
            <span>Purchase Price:</span>
            <span className="text-xl font-bold text-primary">${listing.price?.toFixed(2)}</span>
          </div>
        </div>
      )}

      <div>
        <Label>Payment Method</Label>
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mt-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="credit-card" id="credit-card" />
            <Label htmlFor="credit-card">Credit/Debit Card</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="paypal" id="paypal" />
            <Label htmlFor="paypal">PayPal</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="bank-transfer" id="bank-transfer" />
            <Label htmlFor="bank-transfer">Bank Transfer</Label>
          </div>
        </RadioGroup>
      </div>

      {paymentMethod === "credit-card" && (
        <>
          <div>
            <Label htmlFor="card-number">Card Number</Label>
            <Input id="card-number" placeholder="1234 5678 9012 3456" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input id="expiry" placeholder="MM/YY" required />
            </div>
            <div>
              <Label htmlFor="cvc">CVC</Label>
              <Input id="cvc" placeholder="123" required />
            </div>
          </div>
        </>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isAuction ? "Placing Bid" : "Processing Payment"}
          </>
        ) : isAuction ? (
          "Place Bid"
        ) : (
          "Complete Purchase"
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        By {isAuction ? "placing a bid" : "making this purchase"}, you agree to the Stamps of Approval terms and
        conditions.
      </p>
    </form>
  )
}
