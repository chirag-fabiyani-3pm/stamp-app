import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Discover, Catalog, and Trade Stamps with AI
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Stamps of Approval uses advanced image recognition to identify stamps, provide historical context, and
                connect collectors worldwide.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/scan">
                <Button size="lg" className="gap-2">
                  Try Stamp Recognition <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/list-catalogue">
                <Button variant="outline" size="lg">
                  Browse Catalog
                </Button>
              </Link>
            </div>
          </div>
          <div className="mx-auto lg:mx-0 relative">
            <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
            <div className="relative bg-background p-4 rounded-lg shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=80&w=600&h=500&auto=format&fit=crop"
                alt="Stamp collection showcase"
                className="mx-auto aspect-video overflow-hidden rounded-lg object-cover"
                width={600}
                height={500}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
