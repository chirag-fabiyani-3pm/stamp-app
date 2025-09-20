"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Camera, Database, BarChart3, Users } from "lucide-react"
import HeroSection from "@/components/hero-section"
import FeatureCard from "@/components/feature-card"
import { isUserLoggedIn } from "@/lib/client/auth-utils"
import { ModernCatalogContent } from "@/components/catalog/modern-catalog-content"
import TestUI from "@/components/catalog/stamp-collection"
import { Suspense, useState, useEffect } from "react"
import { Spinner } from "@/components/ui/spinner"
import { useSubscription } from "@/lib/hooks/useSubscription"
import { SubscriptionRequired } from "@/components/subscription/subscription-required"
import { useParams, usePathname, useSearchParams } from "next/navigation"

// Separate component to handle search params with Suspense
function SearchParamsHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const payment_intent = searchParams.get('payment_intent');
    const payment_intent_client_secret = searchParams.get('payment_intent_client_secret');
    const redirect_status = searchParams.get('redirect_status');
    if (payment_intent && payment_intent_client_secret && redirect_status) {
      localStorage.setItem('demo_subscribed', 'true')
      window.location.href = '/'
    }
  }, [searchParams])

  return null; // This component doesn't render anything
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const { subscriptionStatus, isLoading: subscriptionLoading, canAccessFeatures } = useSubscription();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = isUserLoggedIn();
      setIsLoggedIn(loggedIn);
      setLoading(false);
    };
    checkLoginStatus();
  }, []);

  if (loading || subscriptionLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Suspense fallback={null}>
        <SearchParamsHandler />
      </Suspense>
      {isLoggedIn ? (
        // Check if user has subscription access
        canAccessFeatures() ? (
          <Suspense fallback={<div>Loading...</div>}>
            <ModernCatalogContent />
          </Suspense>
        ) : (
          // Show subscription required screen
          <SubscriptionRequired userReferralCode={subscriptionStatus.referralToken || undefined} />
        )
      ) : (
        <div className="flex flex-col items-center">
          <HeroSection />

          <section className="container py-12 md:py-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Discover the Power of Stamps of Approval</h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                Our AI-powered platform revolutionizes how collectors catalog, identify, and trade stamps worldwide.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Camera className="h-10 w-10 text-primary" />}
                title="AI Recognition"
                description="Upload images of your stamps and let our AI identify them with over 90% accuracy."
              />
              <FeatureCard
                icon={<Database className="h-10 w-10 text-primary" />}
                title="Master Catalog"
                description="Access our comprehensive database with 10,000+ stamp records and historical data."
              />
              <FeatureCard
                icon={<BarChart3 className="h-10 w-10 text-primary" />}
                title="Value Estimation"
                description="Get accurate market value estimates for your stamp collection."
              />
            </div>

            <div className="flex justify-center mt-12">
              <Link href="/scan">
                <Button size="lg" className="gap-2">
                  Try Stamp Recognition <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </section>

          <section className="w-full bg-muted py-12 md:py-24">
            <div className="container">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight mb-4">How It Works</h2>
                  <ul className="space-y-4">
                    <li className="flex gap-3">
                      <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                        1
                      </div>
                      <div>
                        <h3 className="font-medium">Upload Your Stamp</h3>
                        <p className="text-muted-foreground">Take a photo or upload an image of your stamp</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                        2
                      </div>
                      <div>
                        <h3 className="font-medium">AI Analysis</h3>
                        <p className="text-muted-foreground">
                          Our AI extracts details like country, year, and denomination
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                        3
                      </div>
                      <div>
                        <h3 className="font-medium">Catalog Match</h3>
                        <p className="text-muted-foreground">The system matches your stamp with our master catalog</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                        4
                      </div>
                      <div>
                        <h3 className="font-medium">Add to Collection</h3>
                        <p className="text-muted-foreground">
                          Save the stamp to your digital collection or list it for trade
                        </p>
                      </div>
                    </li>
                  </ul>
                  <div className="mt-6">
                    <Link href="/register">
                      <Button variant="outline" size="lg">
                        Create Free Account
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="bg-background p-6 rounded-lg shadow-lg">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="font-semibold text-lg mb-4">Visual Guide</h3>
                    </div>

                    {/* Step 1 Visual */}
                    <div className="flex items-center justify-center p-4 bg-muted rounded-lg">
                      <div className="text-center">
                        <Camera className="h-12 w-12 text-primary mx-auto mb-2" />
                        <p className="text-sm font-medium">Upload Stamp Image</p>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex justify-center">
                      <ArrowRight className="h-6 w-6 text-muted-foreground" />
                    </div>

                    {/* Step 2 Visual */}
                    <div className="flex items-center justify-center p-4 bg-muted rounded-lg">
                      <div className="text-center">
                        <div className="relative">
                          <BarChart3 className="h-12 w-12 text-primary mx-auto mb-2" />
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                        <p className="text-sm font-medium">AI Processing</p>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex justify-center">
                      <ArrowRight className="h-6 w-6 text-muted-foreground" />
                    </div>

                    {/* Step 3 Visual */}
                    <div className="flex items-center justify-center p-4 bg-muted rounded-lg">
                      <div className="text-center">
                        <Database className="h-12 w-12 text-primary mx-auto mb-2" />
                        <p className="text-sm font-medium">Catalog Match Found</p>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex justify-center">
                      <ArrowRight className="h-6 w-6 text-muted-foreground" />
                    </div>

                    {/* Step 4 Visual */}
                    <div className="flex items-center justify-center p-4 bg-primary/10 rounded-lg border-2 border-primary/20">
                      <div className="text-center">
                        <Users className="h-12 w-12 text-primary mx-auto mb-2" />
                        <p className="text-sm font-medium text-primary">Added to Collection</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  )
}
