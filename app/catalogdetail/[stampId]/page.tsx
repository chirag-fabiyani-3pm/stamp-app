import type { Metadata } from "next"
import StampCatalog from "@/components/stamp-catalog"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

// Sample mapping of stamp IDs to catalog IDs (if needed)
const stampToCatalogMap: Record<string, string> = {
  // Add mappings if needed
}

function getCatalogData(stampId: string) {
  // Sample catalog data
  const catalogs = {
    "classic-gb": {
      title: "Classic Great Britain",
      description: "Early British stamps from 1840-1901",
      image: "/images/catalogs/classic-gb.jpg"
    },
    "early-nz": {
      title: "Early New Zealand",
      description: "First issues of New Zealand from 1855-1873",
      image: "/images/catalogs/early-nz.jpg"
    },
    "victoria": {
      title: "Queen Victoria Era",
      description: "Stamps from the Victorian period",
      image: "/images/catalogs/victoria.jpg"
    }
  }

  return catalogs[stampId as keyof typeof catalogs] || null;
}

export const metadata: Metadata = {
  title: "Stamp Catalog Detail",
  description: "Detailed view of a specific stamp catalog"
}

export default function CatalogDetailPage({ params }: { params: { stampId: string } }) {
  const { stampId } = params;
  const catalog = getCatalogData(stampId);

  if (!catalog) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-4">Catalog Not Found</h1>
        <p>The requested catalog could not be found.</p>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">{catalog.title}</h1>
        <p className="text-muted-foreground">{catalog.description}</p>
      </div>

      <StampCatalog catalogId={stampId} />
    </div>
  )
} 