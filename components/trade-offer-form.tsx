"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Upload, X } from "lucide-react"

interface TradeOfferFormProps {
  listing: any // In a real app, this would be properly typed
}

export default function TradeOfferForm({ listing }: TradeOfferFormProps) {
  const [offerType, setOfferType] = useState<string>("stamp")
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    // In a real app, we would upload these to a server
    // For this demo, we'll just create object URLs
    const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
    setUploadedImages((prev) => [...prev, ...newImages])
  }

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

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
          Your trade offer has been sent successfully!
        </div>
        <p className="text-muted-foreground mb-4">
          The seller will be notified of your offer and will contact you if they're interested.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setSuccess(false)
            setUploadedImages([])
          }}
        >
          Make Another Offer
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="offer-type">What would you like to offer?</Label>
        <Select value={offerType} onValueChange={setOfferType}>
          <SelectTrigger id="offer-type">
            <SelectValue placeholder="Select offer type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="stamp">Stamp for Trade</SelectItem>
            <SelectItem value="collection">Multiple Stamps</SelectItem>
            <SelectItem value="cash-plus-stamp">Cash + Stamp</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {offerType === "cash-plus-stamp" && (
        <div>
          <Label htmlFor="cash-amount">Cash Amount ($)</Label>
          <Input id="cash-amount" type="number" min="0" step="0.01" placeholder="Enter amount" />
        </div>
      )}

      <div>
        <Label>Upload Images of Your Stamp(s)</Label>
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 mt-1">
          <div className="flex flex-wrap gap-3 mb-3">
            {uploadedImages.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Uploaded stamp ${index + 1}`}
                  className="h-20 w-20 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("stamp-images")?.click()}
              className="gap-2"
            >
              <Upload className="h-4 w-4" /> Upload Images
            </Button>
            <input
              id="stamp-images"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
            <p className="text-xs text-muted-foreground mt-2">Upload clear images of the stamp(s) you're offering</p>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="stamp-details">Stamp Details</Label>
        <Input id="stamp-details" placeholder="Country, Year, Denomination, Condition" />
      </div>

      <div>
        <Label htmlFor="offer-message">Message to Seller</Label>
        <textarea
          id="offer-message"
          className="w-full border rounded-md p-3 h-24 resize-none"
          placeholder="Describe your offer and why you're interested in this stamp..."
        ></textarea>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting || uploadedImages.length === 0}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting Offer
          </>
        ) : (
          "Submit Trade Offer"
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        By submitting this offer, you agree to the Stamps of Approval trading terms and conditions.
      </p>
    </form>
  )
}
