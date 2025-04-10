import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Camera, Database, BarChart3, Users } from "lucide-react"
import HeroSection from "@/components/hero-section"
import FeatureCard from "@/components/feature-card"

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <HeroSection />

      <section className="container py-12 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Discover the Power of Stamps of Approval</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Our AI-powered platform revolutionizes how collectors catalog, identify, and trade stamps worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
          <FeatureCard
            icon={<Users className="h-10 w-10 text-primary" />}
            title="Trading Platform"
            description="Connect with collectors worldwide to trade or sell stamps securely."
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
              <img
                src="/how-it-works.jpg"
                alt="Stamp recognition demo"
                className="rounded-md w-full"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
