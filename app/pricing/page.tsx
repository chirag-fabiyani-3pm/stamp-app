import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  DollarSign,
  Users,
  Crown,
  Gift,
  TrendingUp,
  CheckCircle,
  Star,
  Target,
  Calculator,
  ArrowRight,
  Zap,
  X
} from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Pricing & Referral Program - Stamps of Approval",
  description: "Explore our subscription pricing, referral program, and commission structure"
}

// Master feature list - all features available across all tiers
const allFeatures = [
  "Country catalog access",
  "Basic search & filtering",
  "Stamp identification",
  "Collection tracking",
  "Advanced search filters",
  "Cross-country comparisons",
  "Market value estimates",
  "Expert analysis",
  "Priority support"
]

const pricingTiers = [
  {
    countries: "1 Country",
    price: "$6",
    description: "Perfect for collectors focused on a single country's stamps",
    availableFeatures: ["Country catalog access", "Basic search & filtering", "Stamp identification", "Collection tracking"]
  },
  {
    countries: "2 Countries",
    price: "$8",
    description: "Great for collectors interested in two regions",
    availableFeatures: ["Country catalog access", "Basic search & filtering", "Stamp identification", "Collection tracking", "Advanced search filters", "Cross-country comparisons"]
  },
  {
    countries: "3 Countries",
    price: "$10",
    description: "Ideal for serious collectors exploring multiple regions",
    availableFeatures: ["Country catalog access", "Basic search & filtering", "Stamp identification", "Collection tracking", "Advanced search filters", "Cross-country comparisons", "Market value estimates"]
  },
  {
    countries: "All Countries",
    price: "$12",
    description: "Complete access for passionate philatelists",
    availableFeatures: ["Country catalog access", "Basic search & filtering", "Stamp identification", "Collection tracking", "Advanced search filters", "Cross-country comparisons", "Market value estimates", "Expert analysis", "Priority support"]
  }
]

const dealerPricing = {
  price: "$2",
  description: "Exclusive pricing for our top promoters",
  features: ["All premium features", "Reduced monthly cost", "Continued commission earnings", "Dealer status badge", "Priority customer support"]
}

const faqs = [
  {
    question: "How does the referral system work?",
    answer: "Every subscriber gets a unique referral token. Share it with friends and family. When they sign up using your token, you earn 20% commission on their subscription fee every month they remain active."
  },
  {
    question: "When do I become a Dealer?",
    answer: "You automatically become a Dealer when you reach 20 successful referrals (paid subscribers who used your referral token). Your subscription cost drops to $2/month, and you continue earning commissions."
  },
  {
    question: "How are commissions calculated?",
    answer: "You earn 20% of each referral's monthly subscription fee. For example, if you refer someone on the $10/month plan, you get $2/month. Commissions are credited monthly as account balance rewards."
  },
  {
    question: "Can I change my country selection?",
    answer: "Yes, you can modify your country selection anytime from your account settings. You need to pay the difference in price between the new and old plan."
  },
  {
    question: "What happens to my commissions after becoming a Dealer?",
    answer: "You continue earning the same 20% commission on all your referrals, PLUS your subscription drops to $2/month. This creates unlimited earning potential as you grow your referral network."
  },
  {
    question: "How do I track my referrals and earnings?",
    answer: "Your dashboard shows your referral count, monthly commission earnings, and current status (Normal Subscriber or Dealer). You'll also see your account balance and earning history."
  }
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <Badge variant="secondary" className="text-sm font-medium">
              <Star className="w-4 h-4 mr-1" />
              Subscription & Referral Program
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Choose Your Plan
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start your stamp collecting journey with flexible pricing based on your interests.
              Plus, earn commissions by referring friends and unlock exclusive Dealer pricing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Collecting
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#referral-program">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Learn About Referrals
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Countries</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select the number of countries you want to explore. More countries = more stamps to discover!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {pricingTiers.map((tier, index) => (
              <Card key={index} className="relative group hover:shadow-lg transition-all duration-300 flex flex-col">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-primary">
                    {tier.price}
                    <span className="text-sm font-normal text-muted-foreground">/month</span>
                  </CardTitle>
                  <CardDescription className="font-medium">{tier.countries}</CardDescription>
                  <p className="text-sm text-muted-foreground">{tier.description}</p>
                </CardHeader>
                <CardContent className="flex flex-col justify-between flex-grow">
                  <ul className="space-y-2">
                    {allFeatures.map((feature, featureIndex) => {
                      const isAvailable = tier.availableFeatures.includes(feature)

                      // Special handling for catalog access to show specific country count
                      let displayFeature = feature
                      if (feature === "Country catalog access") {
                        if (tier.countries === "1 Country") displayFeature = "1 country catalog access"
                        else if (tier.countries === "2 Countries") displayFeature = "2 countries catalog access"
                        else if (tier.countries === "3 Countries") displayFeature = "3 countries catalog access"
                        else if (tier.countries === "All Countries") displayFeature = "All countries catalog access"
                      }

                      return (
                        <li key={featureIndex} className={`flex items-center text-sm ${!isAvailable ? 'opacity-50' : ''}`}>
                          {isAvailable ? (
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                          ) : (
                            <X className="w-4 h-4 text-muted-foreground mr-2 flex-shrink-0" />
                          )}
                          <span className={!isAvailable ? 'line-through text-muted-foreground' : ''}>
                            {displayFeature}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                  <Link href="/signup" className="w-full mt-6 inline-block">
                    <Button className="w-full group-hover:scale-105 transition-transform">
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Referral Program Section */}
      <section id="referral-program" className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Referral Program</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Share the joy of stamp collecting and earn commissions. Every new subscriber you bring gets you closer to exclusive Dealer status.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Referral Token */}
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Get Your Referral Token</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Every subscriber receives a unique referral token. Share it with friends, family, or fellow collectors.
                </p>
              </CardContent>
            </Card>

            {/* Earn Commissions */}
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Earn 20% Commissions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get 20% of each referral's monthly subscription fee. Commissions start with your very first referral!
                </p>
              </CardContent>
            </Card>

            {/* Become Dealer */}
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-6 h-6 text-amber-600" />
                </div>
                <CardTitle>Unlock Dealer Status</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Reach 20 successful referrals and become a Dealer. Your subscription drops to just $2/month!
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Commission Calculator */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Calculator className="w-5 h-5" />
                Commission Calculator
              </CardTitle>
              <CardDescription>
                See how much you can earn with our referral program
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <p className="text-2xl font-bold text-primary">$6 plan</p>
                  <p className="text-sm text-muted-foreground">Your monthly commission</p>
                  <p className="text-lg font-semibold text-green-600">$1.20</p>
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <p className="text-2xl font-bold text-primary">$12 plan</p>
                  <p className="text-sm text-muted-foreground">Your monthly commission</p>
                  <p className="text-lg font-semibold text-green-600">$2.40</p>
                </div>
              </div>
              <Separator />
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">With 20 referrals on $10/month plans:</p>
                <p className="text-3xl font-bold text-green-600">$40/month</p>
                <p className="text-sm text-muted-foreground">+ $2/month subscription (Dealer pricing)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Dealer Benefits */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Dealer Benefits</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              When you reach 20 successful referrals, you unlock exclusive Dealer status with amazing benefits.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Dealer Pricing */}
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">$2/Month Subscription</CardTitle>
                    <CardDescription>Regardless of countries selected</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {dealerPricing.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Continued Earnings */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle>Continued Commissions</CardTitle>
                    <CardDescription>Keep earning 20% on all referrals</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  After becoming a Dealer, you continue earning commissions on all your referrals while enjoying reduced subscription costs.
                </p>
                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <p className="text-sm font-medium">Example:</p>
                  <p className="text-lg font-bold text-green-600">
                    $40/month commissions - $2/month subscription = $38/month net earnings
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about our pricing and referral program
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-left text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-primary/20">
            <CardContent className="text-center py-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Start Your Collection?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of stamp collectors worldwide. Choose your plan, start collecting, and earn commissions by sharing your passion.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Sign Up Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
