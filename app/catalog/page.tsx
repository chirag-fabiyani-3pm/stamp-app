import type { Metadata } from "next"
import CatalogList from "@/components/catalog-list"

export const metadata: Metadata = {
  title: "Stamp Catalogs - Stamps of Approval",
  description: "Browse our comprehensive collection of stamp catalogs from around the world",
}

export default function CatalogPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Stamp Catalogs</h1>
        <p className="text-muted-foreground max-w-3xl">
          Browse our comprehensive collection of stamp catalogs from around the world. Each catalog offers unique
          numbering systems, valuations, and specialized information for collectors.
        </p>
      </div>

      <CatalogList />
    </div>
  )
}
