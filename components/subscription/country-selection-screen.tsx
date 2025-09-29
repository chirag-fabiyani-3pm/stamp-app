"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  ArrowLeft, 
  Globe,
  CheckCircle, 
  AlertCircle,
  ArrowRight
} from "lucide-react"
import { PaymentScreen } from "./payment-screen"

interface CountrySelectionScreenProps {
  selectedTier: {
    id: string
    countries: string
    price: number
    description: string
    countryCount: number
  }
  onBack: () => void
  userReferralCode?: string
}

// List of available countries for stamp catalogs
const availableCountries = [
  { id: 'usa', name: 'United States', countryCode: 'US', flag: '🇺🇸', popular: true },
  { id: 'uk', name: 'United Kingdom', countryCode: 'UK', flag: '🇬🇧', popular: true },
  { id: 'canada', name: 'Canada', countryCode: 'CA', flag: '🇨🇦', popular: true },
  { id: 'australia', name: 'Australia', countryCode: 'AU', flag: '🇦🇺', popular: true },
  { id: 'newzealand', name: 'New Zealand', countryCode: 'NZ', flag: '🇳🇿', popular: true },
  { id: 'germany', name: 'Germany', countryCode: 'DE', flag: '🇩🇪', popular: true },
  { id: 'france', name: 'France', countryCode: 'FR', flag: '🇫🇷', popular: true },
  { id: 'japan', name: 'Japan', countryCode: 'JP', flag: '🇯🇵', popular: false },
  { id: 'china', name: 'China', countryCode: 'CN', flag: '🇨🇳', popular: false },
  { id: 'india', name: 'India', countryCode: 'IN', flag: '🇮🇳', popular: false },
  { id: 'brazil', name: 'Brazil', countryCode: 'BR', flag: '🇧🇷', popular: false },
  { id: 'russia', name: 'Russia', countryCode: 'RU', flag: '🇷🇺', popular: false },
  { id: 'italy', name: 'Italy', countryCode: 'IT', flag: '🇮🇹', popular: false },
  { id: 'spain', name: 'Spain', countryCode: 'ES', flag: '🇪🇸', popular: false },
  { id: 'netherlands', name: 'Netherlands', countryCode: 'NL', flag: '🇳🇱', popular: false },
  { id: 'switzerland', name: 'Switzerland', countryCode: 'CH', flag: '🇨🇭', popular: false },
  { id: 'sweden', name: 'Sweden', countryCode: 'SE', flag: '🇸🇪', popular: false },
  { id: 'norway', name: 'Norway', countryCode: 'NO', flag: '🇳🇴', popular: false },
  { id: 'denmark', name: 'Denmark', countryCode: 'DK', flag: '🇩🇰', popular: false },
  { id: 'belgium', name: 'Belgium', countryCode: 'BE', flag: '🇧🇪', popular: false },
  { id: 'austria', name: 'Austria', countryCode: 'AT', flag: '🇦🇹', popular: false },
]

export function CountrySelectionScreen({ selectedTier, onBack, userReferralCode }: CountrySelectionScreenProps) {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [showPayment, setShowPayment] = useState(false)

  const maxCountries = selectedTier.countryCount

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

  const handleContinue = () => {
    if (selectedCountries.length === maxCountries) {
      // Store selected countries for later use
      localStorage.setItem('demo_selected_countries', JSON.stringify(selectedCountries))
      setShowPayment(true)
    }
  }

  if (showPayment) {
    return (
      <PaymentScreen 
        selectedTier={{
          ...selectedTier,
          selectedCountries: selectedCountries.map(id => 
            availableCountries.find(country => country.id === id)!
          )
        }}
        onBack={() => setShowPayment(false)}
        userReferralCode={userReferralCode}
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
            Back to Plans
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Select Your Countries</h1>
            <p className="text-muted-foreground mb-4">
              Choose {maxCountries === 1 ? 'the country' : `${maxCountries} countries`} you want to focus your stamp collection on
            </p>
            <div className="flex justify-center">
              <Badge variant="secondary" className="text-sm">
                <Globe className="w-4 h-4 mr-1" />
                {selectedTier.countries} - ${selectedTier.price}/month
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

        {/* Important Notice */}
        <Card className="max-w-4xl mx-auto mb-8 border-amber-200 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-amber-800 dark:text-amber-200">Important Notice</h3>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  Once you subscribe, your country selection cannot be changed. You can only upgrade to a higher tier by paying the difference to access more countries.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="max-w-6xl mx-auto">
          {/* Other Countries */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Countries</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {availableCountries.map((country) => {
                const isSelected = selectedCountries.includes(country.id)
                const canSelect = selectedCountries.length < maxCountries || isSelected
                
                return (
                  <Card 
                    key={country.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      isSelected 
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
                          onChange={() => {}} // Handled by card click
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
                  Countries included in your {selectedTier.countries} subscription
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
              onClick={handleContinue}
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
