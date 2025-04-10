import type { Metadata } from "next"
import MarketplaceList from "@/components/marketplace-list"

export const metadata: Metadata = {
  title: "Marketplace - Stamps of Approval",
  description: "Buy, sell, and trade stamps with collectors worldwide",
}

export default function MarketplacePage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Stamp Marketplace</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Connect with collectors worldwide to buy, sell, and trade stamps securely
        </p>
      </div>

      <MarketplaceList />
    </div>
  )
}
