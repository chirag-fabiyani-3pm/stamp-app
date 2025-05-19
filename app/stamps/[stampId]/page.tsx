import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import RelatedStamps from "@/components/related-stamps"
import StampHistorySection from "@/components/stamp-history-section"

// Mock data for stamp details
const stamps = [
  {
    id: "silver-jubilee",
    name: "Silver Jubilee",
    country: "New Zealand",
    year: 1935,
    denomination: "1 Penny",
    color: "Purple",
    condition: "Mint",
    description:
      "Commemorative stamp issued for the Silver Jubilee of King George V. Features a portrait of the King and Queen Mary.",
    catalogueNumbers: {
      "Stanley Gibbons": "SG 573",
      Scott: "145",
      Michel: "M 182",
    },
    certifications: ["RPSNZ (2018)"],
    rarity: "Uncommon",
    dimensions: "25mm x 30mm",
    printMethod: "Recess printing",
    perforations: "14 x 13.5",
    gumType: "Original gum",
    watermark: "Multiple NZ and Star",
    varieties: ["Plate flaw on King's ear (position 4/6)", "Re-entry on value tablet"],
    history: [
      { date: "1935-05-07", event: "First day of issue" },
      { date: "1935-12-31", event: "End of postal validity" },
      { date: "1978-03-15", event: "Featured in Auckland Philatelic Exhibition" },
      { date: "2018-09-22", event: "Certified by Royal Philatelic Society of New Zealand" },
    ],
    marketValue: {
      mint: 85,
      used: 45,
      "mint never hinged": 120,
      "first day cover": 150,
    },
    imageSrc: "/images/stamps/new-zealand/1935-silver-jubilee.png",
  },
  {
    id: "coronation-series",
    name: "Coronation Series",
    country: "United Kingdom",
    year: 1953,
    denomination: "2 Shillings 6 Pence",
    color: "Blue",
    condition: "Used",
    description:
      "Part of the series issued to commemorate the coronation of Queen Elizabeth II. Features a profile portrait of the young Queen.",
    catalogueNumbers: {
      "Stanley Gibbons": "SG 532",
      Scott: "302",
      Michel: "M 267",
    },
    certifications: [],
    rarity: "Common",
    dimensions: "22mm x 26mm",
    printMethod: "Photogravure",
    perforations: "15 x 14",
    gumType: "N/A (used)",
    watermark: "Tudor Crown",
    varieties: ["Shade variations in blue", "Phosphor tagging varieties"],
    history: [
      { date: "1953-06-03", event: "First day of issue" },
      { date: "1954-07-12", event: "Replaced by Wilding definitive series" },
      { date: "1967-04-30", event: "Featured in London Philatelic Exhibition" },
    ],
    marketValue: {
      mint: 25,
      used: 8,
      "mint never hinged": 35,
      "first day cover": 60,
    },
    imageSrc: "/images/stamps/uk/1953-coronation-series.png",
  },
  {
    id: "independence-issue",
    name: "Independence Issue",
    country: "India",
    year: 1947,
    denomination: "3.5 Annas",
    color: "Orange and Green",
    condition: "Mint Never Hinged",
    description:
      "First commemorative stamp issued after India's independence. Features the Indian flag and a map of the newly independent nation.",
    catalogueNumbers: {
      "Stanley Gibbons": "SG 301",
      Scott: "203",
      Michel: "M 196",
    },
    certifications: ["PF (2010)"],
    rarity: "Scarce",
    dimensions: "24mm x 29mm",
    printMethod: "Lithography",
    perforations: "13.5",
    gumType: "Original gum, never hinged",
    watermark: "Multiple Star",
    varieties: ["Color shift in flag", "Double impression"],
    history: [
      { date: "1947-08-15", event: "First day of issue" },
      { date: "1948-01-30", event: "Special cancellation for Gandhi's assassination" },
      { date: "2010-08-15", event: "Featured in Independence Day philatelic exhibition" },
    ],
    marketValue: {
      mint: 120,
      used: 75,
      "mint never hinged": 180,
      "first day cover": 250,
    },
    imageSrc: "/images/stamps/india/1947-independence-issue.png",
  },
  {
    id: "bicentennial",
    name: "Bicentennial",
    country: "United States",
    year: 1976,
    denomination: "13 Cents",
    color: "Red, White, and Blue",
    condition: "Mint Never Hinged",
    description:
      "Part of the series commemorating the 200th anniversary of American independence. Features the Liberty Bell and American flag.",
    catalogueNumbers: {
      "Stanley Gibbons": "SG 1685",
      Scott: "1631",
      Michel: "M 1257",
    },
    certifications: [],
    rarity: "Common",
    dimensions: "25mm x 40mm",
    printMethod: "Offset lithography",
    perforations: "11",
    gumType: "Self-adhesive",
    watermark: "None",
    varieties: ["Imperforate pairs", "Color shifts"],
    history: [
      { date: "1976-07-04", event: "First day of issue" },
      { date: "1976-12-31", event: "Special bicentennial cancellations ended" },
      { date: "2001-07-04", event: "Featured in American Philatelic Society exhibition" },
    ],
    marketValue: {
      mint: 2,
      used: 0.5,
      "mint never hinged": 2.5,
      "first day cover": 5,
    },
    imageSrc: "/images/stamps/usa/1976-bicentennial.png",
  },
  {
    id: "olympic-games",
    name: "Olympic Games",
    country: "Australia",
    year: 2000,
    denomination: "45 Cents",
    color: "Multicolor",
    condition: "Mint Never Hinged",
    description:
      "Commemorative stamp issued for the Sydney Olympic Games. Features the Sydney Opera House and Olympic rings.",
    catalogueNumbers: {
      "Stanley Gibbons": "SG 2025",
      Scott: "1875",
      Michel: "M 1965",
    },
    certifications: [],
    rarity: "Common",
    dimensions: "30mm x 25mm",
    printMethod: "Offset lithography",
    perforations: "14.5 x 14",
    gumType: "Self-adhesive",
    watermark: "None",
    varieties: ["Holographic version", "Miniature sheet"],
    history: [
      { date: "2000-09-15", event: "First day of issue" },
      { date: "2000-10-01", event: "Olympic Games closing ceremony special cancellation" },
      { date: "2004-08-13", event: "Featured in Olympic Philately exhibition" },
    ],
    marketValue: {
      mint: 3,
      used: 1,
      "mint never hinged": 3.5,
      "first day cover": 8,
    },
    imageSrc: "/images/stamps/australia/2000-olympic-games.png",
  },
  {
    id: "flora-series",
    name: "Flora Series",
    country: "South Africa",
    year: 1961,
    denomination: "12.5 Cents",
    color: "Green and Yellow",
    condition: "Mint",
    description:
      "Part of the definitive series featuring South African native plants. This stamp depicts the King Protea, South Africa's national flower.",
    catalogueNumbers: {
      "Stanley Gibbons": "SG 211",
      Scott: "254",
      Michel: "M 298",
    },
    certifications: [],
    rarity: "Uncommon",
    dimensions: "24mm x 30mm",
    printMethod: "Photogravure",
    perforations: "14 x 14.5",
    gumType: "Original gum",
    watermark: "RSA in script",
    varieties: ["Inverted watermark", "Color shifts"],
    history: [
      { date: "1961-11-01", event: "First day of issue" },
      { date: "1968-02-14", event: "Decimal currency conversion" },
      { date: "1993-05-20", event: "Featured in Cape Town Philatelic Exhibition" },
    ],
    marketValue: {
      mint: 15,
      used: 5,
      "mint never hinged": 25,
      "first day cover": 40,
    },
    imageSrc: "/images/stamps/south-africa/1961-flora-series.png",
  },
  {
    id: "maple-leaf",
    name: "Maple Leaf",
    country: "Canada",
    year: 1982,
    denomination: "30 Cents",
    color: "Red",
    condition: "Mint Never Hinged",
    description:
      "Definitive stamp featuring the iconic Canadian maple leaf. Part of the series celebrating Canadian national symbols.",
    catalogueNumbers: {
      "Stanley Gibbons": "SG 1055",
      Scott: "908",
      Michel: "M 823",
    },
    certifications: [],
    rarity: "Common",
    dimensions: "20mm x 24mm",
    printMethod: "Offset lithography",
    perforations: "13",
    gumType: "PVA gum, never hinged",
    watermark: "None",
    varieties: ["Fluorescent paper varieties", "Perforation varieties"],
    history: [
      { date: "1982-07-01", event: "First day of issue" },
      { date: "1987-06-30", event: "Replaced by new definitive series" },
      { date: "2005-07-01", event: "Featured in Canada Day philatelic exhibition" },
    ],
    marketValue: {
      mint: 1.5,
      used: 0.5,
      "mint never hinged": 2,
      "first day cover": 4,
    },
    imageSrc: "/images/stamps/canada/1982-maple-leaf.png",
  },
  {
    id: "emperor-series",
    name: "Emperor Series",
    country: "Japan",
    year: 1967,
    denomination: "50 Yen",
    color: "Purple and Gold",
    condition: "Used",
    description:
      "Part of the definitive series featuring the chrysanthemum imperial seal. Represents the long-standing tradition of the Japanese imperial family.",
    catalogueNumbers: {
      "Stanley Gibbons": "SG 1125",
      Scott: "877",
      Michel: "M 945",
    },
    certifications: [],
    rarity: "Uncommon",
    dimensions: "22mm x 26mm",
    printMethod: "Intaglio",
    perforations: "13.5 x 13",
    gumType: "N/A (used)",
    watermark: "Wavy lines",
    varieties: ["Paper thickness varieties", "Shade variations"],
    history: [
      { date: "1967-11-03", event: "First day of issue" },
      { date: "1967-11-03", event: "Culture Day special cancellation" },
      { date: "1989-01-07", event: "Last day of use after Emperor Hirohito's death" },
    ],
    marketValue: {
      mint: 35,
      used: 12,
      "mint never hinged": 45,
      "first day cover": 70,
    },
    imageSrc: "/images/stamps/japan/1967-emperor-series.png",
  },
  {
    id: "cultural-heritage",
    name: "Cultural Heritage",
    country: "China",
    year: 1990,
    denomination: "8 Fen",
    color: "Brown and Blue",
    condition: "Mint Never Hinged",
    description:
      "Part of the series celebrating Chinese cultural heritage. Features the Great Wall of China, one of the world's most iconic structures.",
    catalogueNumbers: {
      "Stanley Gibbons": "SG 3688",
      Scott: "2310",
      Michel: "M 2312",
    },
    certifications: ["APS (2015)"],
    rarity: "Scarce",
    dimensions: "30mm x 40mm",
    printMethod: "Photogravure",
    perforations: "11.5",
    gumType: "Original gum, never hinged",
    watermark: "None",
    varieties: ["Color variations", "Paper varieties"],
    history: [
      { date: "1990-06-15", event: "First day of issue" },
      { date: "1990-10-01", event: "National Day special cancellation" },
      { date: "2015-05-18", event: "Featured in Beijing International Stamp Exhibition" },
    ],
    marketValue: {
      mint: 45,
      used: 20,
      "mint never hinged": 60,
      "first day cover": 85,
    },
    imageSrc: "/images/stamps/china/1990-cultural-heritage.png",
  },
]

export async function generateMetadata({ params }: { params: { stampId: string } }): Promise<Metadata> {
  const stamp = stamps.find((s) => s.id === params.stampId)

  if (!stamp) {
    return {
      title: "Stamp Not Found",
      description: "The requested stamp could not be found.",
    }
  }

  return {
    title: `${stamp.name} (${stamp.country}, ${stamp.year})`,
    description: stamp.description,
  }
}

export default function StampPage({ params }: { params: { stampId: string } }) {
  const stamp = stamps.find((s) => s.id === params.stampId)

  if (!stamp) {
    notFound()
  }

  return (
    <main className="container mx-auto py-6 px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{stamp.name}</CardTitle>
              <CardDescription>
                {stamp.country}, {stamp.year}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-square relative mb-4 border rounded-md overflow-hidden">
                <img
                  src={`/abstract-geometric-shapes.png?height=500&width=500&query=${stamp.name} stamp from ${stamp.country}, ${stamp.year}`}
                  alt={`${stamp.name} stamp from ${stamp.country}, ${stamp.year}`}
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Denomination:</span>
                  <span title="New Zealand Dollars (NZD)">{stamp.denomination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Condition:</span>
                  <span>{stamp.condition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Color:</span>
                  <span>{stamp.color}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Rarity:</span>
                  <span>{stamp.rarity}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/catalog">Back to Catalog</Link>
              </Button>
              <Button asChild>
                <Link href={`/marketplace/create?stamp=${stamp.id}`}>List for Sale</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="catalogue">Catalogue</TabsTrigger>
              <TabsTrigger value="varieties">Varieties</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Stamp Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>{stamp.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold mb-2">Physical Characteristics</h4>
                      <ul className="space-y-1">
                        <li>
                          <span className="font-medium">Dimensions:</span> {stamp.dimensions}
                        </li>
                        <li>
                          <span className="font-medium">Print Method:</span> {stamp.printMethod}
                        </li>
                        <li>
                          <span className="font-medium">Perforations:</span> {stamp.perforations}
                        </li>
                        <li>
                          <span className="font-medium">Gum Type:</span> {stamp.gumType}
                        </li>
                        <li>
                          <span className="font-medium">Watermark:</span> {stamp.watermark}
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Market Information</h4>
                      <ul className="space-y-1">
                        <li>
                          <span className="font-medium">Mint:</span> NZ${stamp.marketValue.mint.toFixed(2)}
                        </li>
                        <li>
                          <span className="font-medium">Used:</span> NZ${stamp.marketValue.used.toFixed(2)}
                        </li>
                        <li>
                          <span className="font-medium">Mint Never Hinged:</span> NZ$
                          {stamp.marketValue["mint never hinged"].toFixed(2)}
                        </li>
                        <li>
                          <span className="font-medium">First Day Cover:</span> NZ$
                          {stamp.marketValue["first day cover"].toFixed(2)}
                        </li>
                      </ul>
                    </div>
                  </div>

                  {stamp.certifications.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Certifications</h4>
                      <ul className="list-disc list-inside">
                        {stamp.certifications.map((cert, i) => (
                          <li key={i}>{cert}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="catalogue" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Catalogue References</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(stamp.catalogueNumbers).map(([catalogue, number]) => (
                      <div key={catalogue} className="flex justify-between items-center pb-2 border-b">
                        <span className="font-medium">{catalogue}:</span>
                        <span>{number}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="varieties" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Known Varieties</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {stamp.varieties.map((variety, i) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{variety}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <StampHistorySection history={stamp.history} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Separator className="my-8" />

      <RelatedStamps currentStampId={stamp.id} />
    </main>
  )
}
