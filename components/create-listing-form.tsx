"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Upload, X } from "lucide-react"

export default function CreateListingForm() {
  const router = useRouter()
  const [listingType, setListingType] = useState<string>("sale")
  const [saleType, setSaleType] = useState<string>("fixed-price")
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

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
      router.push("/marketplace?success=true")
    }, 1500)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-background p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-medium mb-4">Listing Type</h2>

        <RadioGroup value={listingType} onValueChange={setListingType} className="space-y-3">
          <div className="flex items-start space-x-3">
            <RadioGroupItem value="sale" id="sale" className="mt-1" />
            <div>
              <Label htmlFor="sale" className="text-base">
                Sell Stamp
              </Label>
              <p className="text-sm text-muted-foreground">
                List your stamp for sale at a fixed price or as an auction
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <RadioGroupItem value="trade" id="trade" className="mt-1" />
            <div>
              <Label htmlFor="trade" className="text-base">
                Trade Stamp
              </Label>
              <p className="text-sm text-muted-foreground">
                Offer your stamp for trade with other collectors instead of selling
              </p>
            </div>
          </div>
        </RadioGroup>

        {listingType === "sale" && (
          <div className="mt-4 pl-7">
            <RadioGroup value={saleType} onValueChange={setSaleType} className="space-y-3">
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="fixed-price" id="fixed-price" className="mt-1" />
                <div>
                  <Label htmlFor="fixed-price" className="text-base">
                    Fixed Price
                  </Label>
                  <p className="text-sm text-muted-foreground">Set a specific price for your stamp</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <RadioGroupItem value="auction" id="auction" className="mt-1" />
                <div>
                  <Label htmlFor="auction" className="text-base">
                    Auction
                  </Label>
                  <p className="text-sm text-muted-foreground">Let collectors bid on your stamp</p>
                </div>
              </div>
            </RadioGroup>
          </div>
        )}
      </div>

      <div className="bg-background p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-medium mb-4">Stamp Details</h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Listing Title</Label>
            <Input id="title" placeholder="e.g., Silver Jubilee 1935 - New Zealand" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="country">Country</Label>
              <Input id="country" placeholder="Country of origin" required />
            </div>

            <div>
              <Label htmlFor="year">Year</Label>
              <Input id="year" type="number" placeholder="Year of issue" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="denomination">Denomination</Label>
              <Input id="denomination" placeholder="e.g., 1d, 5c, etc." required />
            </div>

            <div>
              <Label htmlFor="condition">Condition</Label>
              <Select required>
                <SelectTrigger id="condition">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mint">Mint</SelectItem>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="very-good">Very Good</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="catalog-reference">Catalog Reference (Optional)</Label>
            <Input id="catalog-reference" placeholder="e.g., SG 573, Scott 185" />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              className="w-full border rounded-md p-3 h-24 resize-none"
              placeholder="Describe your stamp, its condition, and any notable features..."
              required
            ></textarea>
          </div>
        </div>
      </div>

      <div className="bg-background p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-medium mb-4">Images</h2>

        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
          <div className="flex flex-wrap gap-3 mb-3">
            {uploadedImages.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Uploaded stamp ${index + 1}`}
                  className="h-24 w-24 object-cover rounded-md"
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
            <p className="text-xs text-muted-foreground mt-2">
              Upload clear images of your stamp (front and back if possible)
            </p>
          </div>
        </div>
      </div>

      {listingType === "sale" && (
        <div className="bg-background p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium mb-4">Pricing</h2>

          {saleType === "fixed-price" ? (
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input id="price" type="number" min="0.01" step="0.01" placeholder="Enter price" required />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="starting-bid">Starting Bid ($)</Label>
                <Input
                  id="starting-bid"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Enter starting bid"
                  required
                />
              </div>

              <div>
                <Label htmlFor="reserve-price">Reserve Price ($) (Optional)</Label>
                <Input
                  id="reserve-price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Minimum price you'll accept"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  The item won't sell if bidding doesn't reach this price
                </p>
              </div>

              <div>
                <Label htmlFor="auction-duration">Auction Duration</Label>
                <Select required>
                  <SelectTrigger id="auction-duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3-days">3 Days</SelectItem>
                    <SelectItem value="5-days">5 Days</SelectItem>
                    <SelectItem value="7-days">7 Days</SelectItem>
                    <SelectItem value="10-days">10 Days</SelectItem>
                    <SelectItem value="14-days">14 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      )}

      {listingType === "trade" && (
        <div className="bg-background p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium mb-4">Trade Preferences</h2>

          <div>
            <Label htmlFor="trade-preferences">What are you looking for?</Label>
            <textarea
              id="trade-preferences"
              className="w-full border rounded-md p-3 h-24 resize-none"
              placeholder="Describe what stamps you're interested in trading for..."
              required
            ></textarea>
          </div>
        </div>
      )}

      <div className="bg-background p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-medium mb-4">Shipping & Policies</h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="shipping-options">Shipping Options</Label>
            <div className="space-y-2 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="domestic-shipping" />
                <label htmlFor="domestic-shipping" className="text-sm">
                  Domestic Shipping
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="international-shipping" />
                <label htmlFor="international-shipping" className="text-sm">
                  International Shipping
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="terms" required />
            <label htmlFor="terms" className="text-sm">
              I agree to the Stamps of Approval marketplace terms and conditions
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isSubmitting || uploadedImages.length === 0}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Listing
            </>
          ) : (
            "Create Listing"
          )}
        </Button>
      </div>
    </form>
  )
}
