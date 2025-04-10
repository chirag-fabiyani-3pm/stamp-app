import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import StampCatalog from "@/components/stamp-catalog"

// Sample data for catalog information
const getCatalogData = (catalogId: string) => {
  const catalogs = {
    cp: {
      name: "Campbell Paterson Catalogue",
      shortName: "CP Catalogue",
      country: "New Zealand",
      publisher: "Campbell Paterson Ltd",
      established: 1952,
      lastUpdated: "2023",
      description:
        "The definitive specialized catalog for New Zealand stamps, featuring detailed listings of all New Zealand stamps with specialized varieties, errors, and detailed pricing information.",
    },
    "sg-nz": {
      name: "Stanley Gibbons New Zealand",
      shortName: "SG New Zealand",
      country: "New Zealand",
      publisher: "Stanley Gibbons Ltd",
      established: 1865,
      lastUpdated: "2022",
      description:
        "The New Zealand section of the renowned Stanley Gibbons catalog, offering comprehensive coverage of New Zealand stamps with the internationally recognized SG numbering system.",
    },
    nzpost: {
      name: "New Zealand Post Stamps Catalogue",
      shortName: "NZ Post Catalogue",
      country: "New Zealand",
      publisher: "New Zealand Post",
      established: 1988,
      lastUpdated: "2023",
      description:
        "The official catalog from New Zealand Post, featuring all commemorative and definitive stamps issued by New Zealand, with official issue information and background stories.",
    },
    "scott-nz": {
      name: "Scott New Zealand Listings",
      shortName: "Scott NZ",
      country: "New Zealand",
      publisher: "Amos Media Company",
      established: 1868,
      lastUpdated: "2023",
      description:
        "The New Zealand section of the Scott Standard Postage Stamp Catalogue, using the Scott numbering system widely recognized by collectors worldwide.",
    },
    "sg-world": {
      name: "Stanley Gibbons Simplified Catalogue",
      shortName: "SG World",
      country: "Worldwide",
      publisher: "Stanley Gibbons Ltd",
      established: 1865,
      lastUpdated: "2023",
      description:
        "A comprehensive worldwide stamp catalog covering stamps from all countries, with the internationally recognized Stanley Gibbons numbering system.",
    },
    "scott-world": {
      name: "Scott Standard Postage Stamp Catalogue",
      shortName: "Scott World",
      country: "Worldwide",
      publisher: "Amos Media Company",
      established: 1868,
      lastUpdated: "2023",
      description:
        "The most comprehensive catalog of worldwide stamps, published annually in multiple volumes with detailed listings and pricing information.",
    },
    michel: {
      name: "MICHEL Overseas Catalogue",
      shortName: "MICHEL",
      country: "Worldwide",
      publisher: "Schwaneberger Verlag GmbH",
      established: 1910,
      lastUpdated: "2023",
      description:
        "A detailed European catalog with comprehensive coverage of worldwide stamps, particularly strong in European and former colonial territories.",
    },
    australia: {
      name: "Australian Commonwealth Specialists' Catalogue",
      shortName: "ACSC",
      country: "Australia",
      publisher: "Brusden-White",
      established: 1926,
      lastUpdated: "2022",
      description:
        "The definitive specialized catalog for Australian stamps, with detailed information on varieties, errors, and printing details.",
    },
  }

  return catalogs[catalogId as keyof typeof catalogs] || null
}

type Props = {
  params: { catalogId: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const catalogData = getCatalogData(params.catalogId)

  if (!catalogData) {
    return {
      title: "Catalog Not Found - Stamps of Approval",
      description: "The requested stamp catalog could not be found",
    }
  }

  return {
    title: `${catalogData.name} - Stamps of Approval`,
    description: `Browse stamps from the ${catalogData.name}, published by ${catalogData.publisher} since ${catalogData.established}`,
  }
}

export default function CatalogDetailPage({ params }: Props) {
  const catalogData = getCatalogData(params.catalogId)

  if (!catalogData) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Catalog Not Found</h1>
        <p className="text-muted-foreground mb-6">The catalog you're looking for could not be found.</p>
        <Link href="/catalog">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Catalogs
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-6">
        <Link href="/catalog">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Catalogs
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">{catalogData.name}</h1>
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-muted-foreground mb-4">
          <p>{catalogData.country}</p>
          <p>Published by {catalogData.publisher}</p>
          <p>Est. {catalogData.established}</p>
          <p>Last updated: {catalogData.lastUpdated}</p>
        </div>
        <p className="max-w-3xl">{catalogData.description}</p>
      </div>

      <div className="border-t pt-8">
        <h2 className="text-2xl font-semibold mb-6">Stamps in this Catalog</h2>
        <StampCatalog catalogId={params.catalogId} />
      </div>
    </div>
  )
}
