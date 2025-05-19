import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

// Mock function to get catalog data
function getCatalogData(stampId: string) {
  // Map stamp IDs to catalog IDs
  const stampToCatalogMap: Record<string, string> = {
    "nz-chalon-head": "cp",
    "nz-penny-universal": "sg-nz",
    "nz-kiwi": "nzpost",
    "nz-silver-jubilee": "scott-nz",
    "nz-health-stamps": "michel-nz",
    "nz-coat-of-arms": "specialized-nz"
  };

  // Get the catalog ID from the mapping, or use the stampId directly
  const catalogId = stampToCatalogMap[stampId] || stampId;

  const catalogs = {
    cp: {
      id: "cp",
      title: "Campbell Paterson",
      description: "The definitive specialized catalog for New Zealand stamps",
      image: "/images/catalogs/campbell-paterson-2023.png",
      publisher: "Campbell Paterson Ltd.",
      year: "2023",
      edition: "75th Anniversary Edition",
      type: "Specialized",
      coverage: "Complete New Zealand",
      lastUpdated: "January 2023",
      history:
        "First published in 1952, the Campbell Paterson catalog has become the standard reference for New Zealand philately. It uses a unique numbering system that has been widely adopted by specialists and dealers in New Zealand stamps.",
      features: [
        "Comprehensive listing of all New Zealand stamps",
        "Detailed information on varieties and errors",
        "Market valuations updated annually",
        "Color illustrations throughout",
        "Specialized sections on postal history",
        "In-depth articles on significant issues",
      ],
      format: "Loose-leaf binder with annual updates",
      pages: 750,
      isbn: "978-0-9876543-2-1",
      website: "www.campbellpaterson.co.nz",
    },
    "sg-nz": {
      id: "sg-nz",
      title: "Stanley Gibbons New Zealand",
      description: "Comprehensive catalog of New Zealand stamps by the world's leading stamp catalog publisher",
      image: "/images/catalogs/stanley-gibbons-nz-2022.png",
      publisher: "Stanley Gibbons Ltd.",
      year: "2022",
      edition: "7th Edition",
      type: "Country Specific",
      coverage: "New Zealand and Dependencies",
      lastUpdated: "November 2022",
      history:
        "Stanley Gibbons has been publishing stamp catalogs since 1865 and is considered the world's oldest stamp dealer. Their New Zealand catalog provides a comprehensive listing using the internationally recognized SG numbering system.",
      features: [
        "Complete listings of all New Zealand stamps",
        "Pricing for mint and used conditions",
        "Special attention to watermarks and perforations",
        "Coverage of Ross Dependency and Tokelau Islands",
        "Illustrations for all major stamp designs",
        "Identification guide for difficult issues",
      ],
      format: "Perfect bound, full color",
      pages: 320,
      isbn: "978-1-8395432-5-7",
      website: "www.stanleygibbons.com",
    },
    nzpost: {
      id: "nzpost",
      title: "New Zealand Post Stamps",
      description: "Official catalog of stamps issued by New Zealand Post",
      image: "/images/catalogs/nzpost-2023.png",
      publisher: "New Zealand Post",
      year: "2023",
      edition: "Annual Edition",
      type: "Official",
      coverage: "Modern New Zealand Issues",
      lastUpdated: "March 2023",
      history:
        "The New Zealand Post catalog provides official information on all stamps issued by New Zealand Post since its formation. It serves as both a collector's guide and an official record of New Zealand's philatelic history.",
      features: [
        "Official issue information and specifications",
        "Background stories on stamp designs",
        "First day cover details",
        "Special postmarks and commemorative items",
        "Limited edition collectibles",
        "Upcoming issues preview",
      ],
      format: "Saddle-stitched, glossy paper",
      pages: 120,
      isbn: "978-0-4765321-9-8",
      website: "www.nzpost.co.nz/stamps",
    },
    "scott-nz": {
      id: "scott-nz",
      title: "Scott New Zealand",
      description: "Part of the Scott Standard Postage Stamp Catalogue covering New Zealand",
      image: "/images/catalogs/scott-nz-2023.png",
      publisher: "Amos Media",
      year: "2023",
      edition: "2023 Edition",
      type: "Country Section",
      coverage: "New Zealand and Pacific Islands",
      lastUpdated: "December 2022",
      history:
        "The Scott catalog has been the primary reference for American stamp collectors since 1868. The New Zealand section is part of the larger Scott Standard Postage Stamp Catalogue, which covers the entire world.",
      features: [
        "Scott numbering system used worldwide",
        "Values in US dollars",
        "Simplified listings for general collectors",
        "Major varieties identified",
        "Historical notes on significant issues",
        "Consistent format with other Scott catalogs",
      ],
      format: "Hardbound, part of Volume 5",
      pages: "85 (New Zealand section)",
      isbn: "978-0-8940-7589-3",
      website: "www.scottonline.com",
    },
    "michel-nz": {
      id: "michel-nz",
      title: "Michel New Zealand",
      description: "German-published catalog with detailed listings of New Zealand stamps",
      image: "/images/catalogs/michel-nz-2022.png",
      publisher: "Schwaneberger Verlag",
      year: "2022",
      edition: "42nd Edition",
      type: "Country Volume",
      coverage: "New Zealand and Oceania",
      lastUpdated: "October 2022",
      history:
        "Michel catalogs are renowned for their precision and detail. First published in 1910, they have become the standard reference for European collectors. The New Zealand section is included in the Overseas volume covering Australia and Oceania.",
      features: [
        "Highly detailed technical information",
        "Specialized listings of varieties",
        "Values in Euros",
        "Extensive coverage of postal stationery",
        "Detailed perforation and paper variations",
        "Recognized by international auction houses",
      ],
      format: "Hardbound, two-column format",
      pages: "110 (New Zealand section)",
      isbn: "978-3-9542-1876-4",
      website: "www.michel.de",
    },
    "specialized-nz": {
      id: "specialized-nz",
      title: "Specialized Catalog of NZ Errors",
      description: "Detailed catalog focusing on New Zealand stamp errors and varieties",
      image: "/images/catalogs/specialized-nz-errors-2023.png",
      publisher: "Royal Philatelic Society of NZ",
      year: "2023",
      edition: "3rd Edition",
      type: "Specialized",
      coverage: "Errors and Varieties",
      lastUpdated: "February 2023",
      history:
        "This specialized catalog was first published in 2010 by the Royal Philatelic Society of New Zealand to document the numerous errors, varieties, and printing anomalies found in New Zealand stamps throughout their history.",
      features: [
        "Comprehensive listing of known errors",
        "High-resolution magnified images",
        "Rarity scale for each variety",
        "Discovery information when known",
        "Auction realizations for significant items",
        "Printing and production explanations",
      ],
      format: "Hardbound, archival paper",
      pages: 280,
      isbn: "978-0-9087-6543-2",
      website: "www.rpsnz.org.nz/publications",
    },
  }

  return catalogs[catalogId as keyof typeof catalogs] || null;
}

export default function CatalogDetailPage({ params }: { params: { stampId: string } }) {
  const { stampId } = params;
  const catalog = getCatalogData(stampId);

  if (!catalog) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Catalog Not Found</h1>
        <p className="mb-8">The catalog you are looking for does not exist or has been removed.</p>
        <Link href="/catalog">
          <Button>Return to Catalog Listing</Button>
        </Link>
      </div>
    )
  }

  // Sample stamps for this catalog
  const sampleStamps = [
    {
      id: "1",
      title: "Queen Victoria Chalon Head",
      image: "/images/stamps/new-zealand/1855-queen-victoria-chalon.png",
      catalogNumber: `${catalog.id.toUpperCase()}-001`,
      year: "1855",
      denomination: "1d",
      price: "$2,500",
    },
    {
      id: "2",
      title: "Penny Universal",
      image: "/images/stamps/new-zealand/1901-penny-universal.png",
      catalogNumber: `${catalog.id.toUpperCase()}-145`,
      year: "1901",
      denomination: "1d",
      price: "$85",
    },
    {
      id: "3",
      title: "Kiwi Definitive",
      image: "/images/stamps/new-zealand/1935-kiwi-definitive.png",
      catalogNumber: `${catalog.id.toUpperCase()}-287`,
      year: "1935",
      denomination: "6d",
      price: "$45",
    },
    {
      id: "4",
      title: "Health Stamp - Children",
      image: "/images/stamps/new-zealand/1942-health-stamp-children.png",
      catalogNumber: `${catalog.id.toUpperCase()}-H42`,
      year: "1942",
      denomination: "1d+½d",
      price: "$12",
    },
  ]

  return (
    <div className="container mx-auto py-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="sticky top-24">
            <div className="relative w-full h-64 mb-4 overflow-hidden rounded-lg">
              <Image
                src={`/abstract-geometric-shapes.png?height=300&width=400&query=${catalog.title} Stamp Catalog ${catalog.year}`}
                alt={catalog.title}
                fill
                className="object-cover"
              />
            </div>
            <h1 className="text-2xl font-bold mb-2">{catalog.title}</h1>
            <p className="text-muted-foreground mb-4">{catalog.description}</p>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="font-medium">Publisher:</span>
                <span>{catalog.publisher}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Year:</span>
                <span>{catalog.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Edition:</span>
                <span>{catalog.edition}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Pages:</span>
                <span>{catalog.pages}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">ISBN:</span>
                <span className="font-mono text-sm">{catalog.isbn}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button className="w-full">Purchase Catalog</Button>
              <Button variant="outline" className="w-full">Visit Publisher</Button>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="samples">Sample Stamps</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="space-y-6">
                <Card>
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">About This Catalog</h2>
                    <p className="mb-4">{catalog.history}</p>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-medium mb-2">Catalog Type</h3>
                        <div className="flex gap-2 mb-4">
                          <Badge>{catalog.type}</Badge>
                          {catalog.type === "Specialized" && <Badge variant="destructive">Expert Level</Badge>}
                        </div>

                        <h3 className="font-medium mb-2">Coverage</h3>
                        <p className="text-sm text-muted-foreground">{catalog.coverage}</p>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">Format</h3>
                        <p className="text-sm text-muted-foreground mb-4">{catalog.format}</p>

                        <h3 className="font-medium mb-2">Last Updated</h3>
                        <p className="text-sm text-muted-foreground">{catalog.lastUpdated}</p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">Comparing with Other Catalogs</h2>
                    <div className="relative overflow-x-auto rounded-md border">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase bg-slate-50 dark:bg-slate-800">
                          <tr>
                            <th scope="col" className="px-6 py-3">
                              Catalog
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Region Focus
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Numbering Style
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Detail Level
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-white dark:bg-slate-900 border-b">
                            <td className="px-6 py-4 font-medium">Campbell Paterson</td>
                            <td className="px-6 py-4">New Zealand</td>
                            <td className="px-6 py-4">Unique CP system</td>
                            <td className="px-6 py-4">
                              <Badge className="bg-green-700">Very High</Badge>
                            </td>
                          </tr>
                          <tr className="bg-white dark:bg-slate-900 border-b">
                            <td className="px-6 py-4 font-medium">Stanley Gibbons</td>
                            <td className="px-6 py-4">British Commonwealth</td>
                            <td className="px-6 py-4">SG numbers</td>
                            <td className="px-6 py-4">
                              <Badge className="bg-green-600">High</Badge>
                            </td>
                          </tr>
                          <tr className="bg-white dark:bg-slate-900 border-b">
                            <td className="px-6 py-4 font-medium">Scott</td>
                            <td className="px-6 py-4">Worldwide (US focus)</td>
                            <td className="px-6 py-4">Sequential numbers</td>
                            <td className="px-6 py-4">
                              <Badge className="bg-yellow-600">Medium</Badge>
                            </td>
                          </tr>
                          <tr className="bg-white dark:bg-slate-900">
                            <td className="px-6 py-4 font-medium">Michel</td>
                            <td className="px-6 py-4">Worldwide (European focus)</td>
                            <td className="px-6 py-4">Complex alphanumeric</td>
                            <td className="px-6 py-4">
                              <Badge className="bg-green-700">Very High</Badge>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="features">
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-6">Key Features</h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    {catalog.features.map((feature, index) => (
                      <div key={index} className="flex">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3 mt-0.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <p>{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Card>
                  <div className="p-6">
                    <h2 className="text-lg font-bold mb-4">Who Should Use This Catalog</h2>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>
                          <span className="font-medium">Specialized Collectors:</span> Those focusing on {catalog.coverage}{" "}
                          issues
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>
                          <span className="font-medium">Dealers:</span> For accurate pricing and identification
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>
                          <span className="font-medium">Researchers:</span> Studying postal history or specific stamp
                          issues
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>
                          <span className="font-medium">Auction Houses:</span> For proper identification and valuation
                        </span>
                      </li>
                    </ul>
                  </div>
                </Card>

                <Card>
                  <div className="p-6">
                    <h2 className="text-lg font-bold mb-4">Additional Resources</h2>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>
                          <span className="font-medium">Online Supplements:</span> Available at {catalog.website}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>
                          <span className="font-medium">Update Service:</span> Annual updates available
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>
                          <span className="font-medium">Research Articles:</span> Deep dives into specific issues
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>
                          <span className="font-medium">Digital Edition:</span> Available for subscribers
                        </span>
                      </li>
                    </ul>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="samples">
              <h2 className="text-xl font-bold mb-6">Sample Stamps Listed in {catalog.title}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sampleStamps.map((stamp) => (
                  <Card key={stamp.id} className="overflow-hidden">
                    <div className="flex">
                      <div className="w-1/3 relative">
                        <Image
                          src={`/vintage-postage-stamp.png?height=150&width=120&query=Stamp ${stamp.catalogNumber} ${stamp.title}`}
                          alt={stamp.title}
                          width={100}
                          height={100}
                          className="object-cover h-full"
                        />
                      </div>
                      <div className="w-2/3 p-4">
                        <h3 className="font-medium">{stamp.title}</h3>
                        <div className="text-sm text-muted-foreground mt-1">
                          <p>Catalog #: {stamp.catalogNumber}</p>
                          <p>Year: {stamp.year}</p>
                          <p>Denomination: {stamp.denomination}</p>
                          <p className="font-medium text-primary mt-1">Value: {stamp.price}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link href="/stamps">
                  <Button>Browse All Stamps</Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 