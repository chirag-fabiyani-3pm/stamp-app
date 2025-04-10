"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ReviewerBadge } from "./reviewer-badge"
import { CheckCircle2, Info, ShieldAlert, XCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface AuthenticationFormProps {
  listingId: string | number
  listingTitle: string
  listingImage: string
}

export function AuthenticationForm({ listingId, listingTitle, listingImage }: AuthenticationFormProps) {
  const [verdict, setVerdict] = useState<string>("")
  const [confidence, setConfidence] = useState<string>("medium")
  const [catalogReference, setCatalogReference] = useState<string>("")
  const [notes, setNotes] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!verdict) {
      toast({
        title: "Please select a verdict",
        description: "You must select whether the stamp is authentic or not",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)

      toast({
        title: "Authentication submitted",
        description: "Your authentication has been submitted for review",
      })

      // Reset form
      setVerdict("")
      setConfidence("medium")
      setCatalogReference("")
      setNotes("")
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Authenticate Stamp</CardTitle>
            <CardDescription>Provide your expert assessment of this stamp's authenticity</CardDescription>
          </div>
          <ReviewerBadge level="apprentice" showLabel />
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="aspect-square relative rounded-md overflow-hidden border mb-4">
                <img
                  src={listingImage || "/placeholder.svg?height=300&width=300&text=Stamp+Image"}
                  alt={listingTitle}
                  className="object-contain w-full h-full"
                />
              </div>

              <div className="text-sm">
                <p className="font-medium">{listingTitle}</p>
                <p className="text-muted-foreground mt-1">Listing #{listingId}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verdict" className="text-base font-medium">
                  Authentication Verdict
                </Label>
                <div className="bg-muted/50 p-4 rounded-md space-y-4">
                  <RadioGroup id="verdict" value={verdict} onValueChange={setVerdict} className="gap-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="authentic" id="authentic" />
                      <Label htmlFor="authentic" className="flex items-center gap-1.5 cursor-pointer">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Authentic</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="counterfeit" id="counterfeit" />
                      <Label htmlFor="counterfeit" className="flex items-center gap-1.5 cursor-pointer">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span>Counterfeit</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="suspicious" id="suspicious" />
                      <Label htmlFor="suspicious" className="flex items-center gap-1.5 cursor-pointer">
                        <ShieldAlert className="h-4 w-4 text-amber-500" />
                        <span>Suspicious Elements</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="uncertain" id="uncertain" />
                      <Label htmlFor="uncertain" className="flex items-center gap-1.5 cursor-pointer">
                        <Info className="h-4 w-4 text-blue-500" />
                        <span>Cannot Determine</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confidence" className="text-base font-medium">
                  Confidence Level
                </Label>
                <Select value={confidence} onValueChange={setConfidence}>
                  <SelectTrigger id="confidence">
                    <SelectValue placeholder="Select your confidence level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - I'm not very confident</SelectItem>
                    <SelectItem value="medium">Medium - Reasonably confident</SelectItem>
                    <SelectItem value="high">High - Very confident</SelectItem>
                    <SelectItem value="certain">Certain - Beyond reasonable doubt</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="catalog-reference" className="text-base font-medium">
                  Catalog Reference (Optional)
                </Label>
                <Input
                  id="catalog-reference"
                  placeholder="e.g., Scott #123, SG 456"
                  value={catalogReference}
                  onChange={(e) => setCatalogReference(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-base font-medium">
              Authentication Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Provide details about your authentication assessment. What features did you examine? What led to your conclusion?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
            />
            <p className="text-xs text-muted-foreground">
              Your notes will be visible to other authenticators and may be used for educational purposes.
            </p>
          </div>

          <div className="bg-muted/50 p-4 rounded-md text-sm">
            <p className="font-medium">Authentication Guidelines:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
              <li>Examine perforations, paper quality, and printing method</li>
              <li>Check for watermarks using appropriate tools</li>
              <li>Compare with known authentic examples when possible</li>
              <li>Consider the historical context and production methods of the era</li>
              <li>Be honest about your confidence level and limitations</li>
            </ul>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Authentication"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="bg-muted/30 flex justify-between text-sm text-muted-foreground">
        <p>Your current level: Apprentice Authenticator</p>
        <p>Reviews completed: 12</p>
      </CardFooter>
    </Card>
  )
}
