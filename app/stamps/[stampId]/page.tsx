import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, Share2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StampHistorySection from "@/components/stamp-history-section"
import RelatedStamps from "@/components/related-stamps"
import { ReportDialog } from "@/components/report-dialog"

// This would typically come from a database
const getStampData = (stampId: string) => {
  // Sample data for demonstration
  const id = stampId.replace("stamp-", "")

  const stamps = {
    "cp-1": {
      id: 1,
      name: "Chalon Head",
      country: "New Zealand",
      year: 1855,
      denomination: "1d",
      color: "Red",
      condition: "Good",
      rarity: "Rare",
      dimensions: "18mm x 22mm",
      perforations: "Imperforate",
      printMethod: "Lithography",
      designer: "Charles Henry Jeens (based on Alfred Chalon painting)",
      printer: "Perkins Bacon & Co, London",
      image: "/chalon-head-new-zealand-red.jpg",
      description:
        "The iconic 'Chalon Head' features a portrait of Queen Victoria based on Alfred Chalon’s painting. It was the first postage stamp issued by New Zealand.",
      history:
        "Issued in 1855, these stamps are among the earliest from New Zealand and are notable for their beauty and historic value. Early issues were printed in London and shipped to New Zealand.",
      estimatedValue: "$500 - $1200",
      catalogReference: "SG 1, Scott 1",
    },
    "cp-3": {
      id: 2,
      name: "Health Stamp - Nurse and Boy",
      country: "New Zealand",
      year: 1931,
      denomination: "1d + 1d",
      color: "Carmine",
      condition: "Excellent",
      rarity: "Uncommon",
      dimensions: "24mm x 30mm",
      perforations: "14",
      printMethod: "Recess printing",
      designer: "L.C. Mitchell",
      printer: "Government Printing Office, Wellington",
      image: "/smiling-boys-health.jpg",
      description:
        "This semi-postal stamp raised funds for children’s health camps. It shows a nurse and young boy, symbolizing care and health support.",
      history:
        "Health stamps were a unique initiative from New Zealand, where part of the cost went toward health programs. This 1931 issue is one of the earliest and most collectible.",
      estimatedValue: "$60 - $90",
      catalogReference: "SG 548, Scott B3",
    },
  }

  return stamps[id as keyof typeof stamps] || null
}

type Props = {
  params: { stampId: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const stampData = getStampData(params.stampId)

  if (!stampData) {
    return {
      title: "Stamp Not Found - Stamps of Approval",
      description: "The requested stamp could not be found",
    }
  }

  return {
    title: `${stampData.name} (${stampData.country}, ${stampData.year}) - Stamps of Approval`,
    description: `View details of the ${stampData.name} stamp from ${stampData.country}, issued in ${stampData.year}`,
  }
}

export default function StampDetailPage({ params }: Props) {
  const stampData = getStampData(params.stampId)

  if (!stampData) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Stamp Not Found</h1>
        <p className="text-muted-foreground mb-6">The stamp you're looking for could not be found.</p>
        <Link href="/catalog">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Catalog
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
            <ArrowLeft className="h-4 w-4" /> Back to Catalog
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-background p-6 rounded-lg shadow-md">
          <div className="aspect-square relative mb-4">
            <img
              src={stampData.image || "/placeholder.svg"}
              alt={`${stampData.country} ${stampData.name} stamp`}
              className="object-contain w-full h-full"
            />
          </div>
          <div className="flex justify-center gap-3">
            <Button variant="outline" size="sm" className="gap-1">
              <Plus className="h-4 w-4" /> Add to Collection
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Share2 className="h-4 w-4" /> Share
            </Button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold">{stampData.name}</h1>
            <Badge className="text-sm">{stampData.condition}</Badge>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <span className="text-lg">
              {stampData.country}, {stampData.year}
            </span>
            <span className="text-lg font-medium text-primary">{stampData.denomination}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Color</h3>
              <p>{stampData.color}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Rarity</h3>
              <p>{stampData.rarity}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Dimensions</h3>
              <p>{stampData.dimensions}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Perforations</h3>
              <p>{stampData.perforations}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Print Method</h3>
              <p>{stampData.printMethod}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Designer</h3>
              <p>{stampData.designer}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Printer</h3>
              <p>{stampData.printer}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Catalog Reference</h3>
              <p>{stampData.catalogReference}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
            <p>{stampData.description}</p>
          </div>

          <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Estimated Value</h3>
              <span className="text-lg font-bold text-primary">{stampData.estimatedValue}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Value estimates are based on recent market data and auction results
            </p>
          </div>

          <div className="flex justify-end mt-4">
            <ReportDialog
              contentType="stamp"
              contentId={stampData.id}
              contentTitle={`${stampData.name} (${stampData.country}, ${stampData.year})`}
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="history" className="mb-12">
        <TabsList>
          <TabsTrigger value="history">History & Background</TabsTrigger>
          <TabsTrigger value="varieties">Varieties</TabsTrigger>
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
        </TabsList>
        <TabsContent value="history" className="pt-6">
          <StampHistorySection history={stampData.history} />
        </TabsContent>
        <TabsContent value="varieties" className="pt-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">No known varieties for this stamp.</p>
          </div>
        </TabsContent>
        <TabsContent value="discussions" className="pt-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No discussions yet. Be the first to start a conversation about this stamp.
            </p>
            <Button className="mt-4">Start Discussion</Button>
          </div>
        </TabsContent>
      </Tabs>

      <RelatedStamps currentStampId={stampData.id} />
    </div>
  )
}
