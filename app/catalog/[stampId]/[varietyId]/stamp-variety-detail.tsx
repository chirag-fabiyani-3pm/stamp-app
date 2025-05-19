"use client"

import Link from "next/link"
import {
  ChevronLeft,
  Map,
  Calendar,
  Palette,
  Star,
  Bookmark,
  Share2,
  Printer,
  Ruler,
  BookOpen,
  Award,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { generateStamps } from "@/components/stamp-datastore"
import { notFound } from "next/navigation"

const getRarityColor = (rarity: string) => {
  switch (rarity.toLowerCase()) {
    case "extremely rare":
      return "bg-red-600 text-white"
    case "very rare":
      return "bg-rose-500 text-white"
    case "rare":
      return "bg-orange-500 text-white"
    case "scarce":
      return "bg-amber-500 text-black"
    case "uncommon":
      return "bg-yellow-500 text-black"
    default:
      return "bg-green-500 text-white"
  }
}

const getRarityScore = (rarity: string): number => {
  switch (rarity.toLowerCase()) {
    case "extremely rare":
      return 100
    case "very rare":
      return 80
    case "rare":
      return 60
    case "scarce":
      return 40
    case "uncommon":
      return 20
    default:
      return 10
  }
}

export default function StampVarietyDetailClient({ stampId, varietyId }: { stampId: string; varietyId: string }) {
  const stamps = generateStamps()
  const stamp = stamps.find((s) => s.id === stampId)
  const variety = stamp?.varieties.find((v) => v.id === varietyId)

  if (!stamp || !variety) {
    notFound()
  }

  const rarityScore = getRarityScore(variety.rarity)

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-6">
        <Link href={`/catalog/${stamp.id}`}>
          <Button variant="ghost" className="pl-0 mb-4 hover:bg-transparent hover:text-primary">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to {stamp.title} Varieties
          </Button>
        </Link>

        <div className="bg-white dark:bg-slate-900 border rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 pb-0">
            <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
              <div>
                <Badge variant="default" className={`${getRarityColor(variety.rarity)} mb-2`}>
                  {variety.rarity}
                </Badge>
                <h1 className="text-3xl font-bold tracking-tight">{variety.name}</h1>
                <div className="flex items-center text-sm text-muted-foreground mt-1 gap-2">
                  <Badge variant="outline" className="font-mono">
                    {variety.code}
                  </Badge>
                  <span>•</span>
                  <div className="flex items-center">
                    <Map className="h-4 w-4 mr-1 text-slate-500" />
                    {stamp.country}
                  </div>
                  <span>•</span>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-slate-500" />
                    {variety.year}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant="outline" className="h-9 w-9 p-0">
                        <Bookmark className="h-4 w-4" />
                        <span className="sr-only">Bookmark</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Save to collection</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant="outline" className="h-9 w-9 p-0">
                        <Share2 className="h-4 w-4" />
                        <span className="sr-only">Share</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share this stamp</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row mt-4">
            <div className="lg:w-2/5 xl:w-1/3 p-6 lg:border-r">
              <div className="sticky top-20">
                <div className="aspect-[3/4] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 shadow-md mb-6">
                  <img
                    src={variety.image || "/placeholder.svg"}
                    alt={variety.name}
                    className="h-full w-full object-cover object-center hover:scale-150 transition-transform duration-500 cursor-zoom-in"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Card className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <Palette className="h-5 w-5 text-slate-500 mb-2" />
                      <p className="text-xs text-muted-foreground">Color</p>
                      <p className="font-medium text-center">{variety.color}</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <Star className="h-5 w-5 text-slate-500 mb-2" />
                      <p className="text-xs text-muted-foreground">Condition</p>
                      <p className="font-medium text-center">{variety.condition}</p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 mb-6">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">Rarity Assessment</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Common</span>
                      <span className="text-sm text-muted-foreground">Extremely Rare</span>
                    </div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full mb-4">
                      <div
                        className={`h-full rounded-full ${getRarityColor(variety.rarity)}`}
                        style={{ width: `${rarityScore}%` }}
                      />
                    </div>
                    <p className="text-sm">
                      This {variety.rarity.toLowerCase()} stamp variety is considered a
                      {rarityScore > 50 ? " significant find" : " common addition"} for collectors of {stamp.country}{" "}
                      postal history.
                    </p>
                  </CardContent>
                </Card>

                <div className="flex gap-2">
                  <Button className="flex-1">Add to Collection</Button>
                  <Button variant="outline" className="flex-1">
                    <Link href="/scan" className="flex items-center">
                      Authenticate
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1 p-6">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="mb-6 w-full justify-start">
                  <TabsTrigger value="details" className="text-base">
                    Details
                  </TabsTrigger>
                  <TabsTrigger value="catalogs" className="text-base">
                    Catalog References
                  </TabsTrigger>
                  <TabsTrigger value="history" className="text-base">
                    Historical Context
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="pt-2">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-3">About This Variety</h2>
                      <p className="text-muted-foreground">{variety.description}</p>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                        <dl className="space-y-4">
                          <div className="flex items-start">
                            <dt className="w-40 flex-shrink-0 flex items-center">
                              <Map className="h-4 w-4 mr-2 text-slate-500" />
                              <span className="text-sm font-medium">Country</span>
                            </dt>
                            <dd className="flex-1">{stamp.country}</dd>
                          </div>

                          <div className="flex items-start">
                            <dt className="w-40 flex-shrink-0 flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-slate-500" />
                              <span className="text-sm font-medium">Year</span>
                            </dt>
                            <dd className="flex-1">{variety.year}</dd>
                          </div>

                          <div className="flex items-start">
                            <dt className="w-40 flex-shrink-0 flex items-center">
                              <Palette className="h-4 w-4 mr-2 text-slate-500" />
                              <span className="text-sm font-medium">Color</span>
                            </dt>
                            <dd className="flex-1">{variety.color}</dd>
                          </div>

                          <div className="flex items-start">
                            <dt className="w-40 flex-shrink-0 flex items-center">
                              <Star className="h-4 w-4 mr-2 text-slate-500" />
                              <span className="text-sm font-medium">Condition</span>
                            </dt>
                            <dd className="flex-1">{variety.condition}</dd>
                          </div>
                        </dl>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">Production Details</h3>
                        <dl className="space-y-4">
                          <div className="flex items-start">
                            <dt className="w-40 flex-shrink-0 flex items-center">
                              <Printer className="h-4 w-4 mr-2 text-slate-500" />
                              <span className="text-sm font-medium">Print Method</span>
                            </dt>
                            <dd className="flex-1">{stamp.printMethod || "Not specified"}</dd>
                          </div>

                          <div className="flex items-start">
                            <dt className="w-40 flex-shrink-0 flex items-center">
                              <BookOpen className="h-4 w-4 mr-2 text-slate-500" />
                              <span className="text-sm font-medium">Series</span>
                            </dt>
                            <dd className="flex-1">{stamp.issueSeries || "Not specified"}</dd>
                          </div>

                          <div className="flex items-start">
                            <dt className="w-40 flex-shrink-0 flex items-center">
                              <Ruler className="h-4 w-4 mr-2 text-slate-500" />
                              <span className="text-sm font-medium">Denomination</span>
                            </dt>
                            <dd className="flex-1">{stamp.denomination}</dd>
                          </div>

                          <div className="flex items-start">
                            <dt className="w-40 flex-shrink-0 flex items-center">
                              <Award className="h-4 w-4 mr-2 text-slate-500" />
                              <span className="text-sm font-medium">Rarity</span>
                            </dt>
                            <dd className="flex-1">
                              <Badge variant="default" className={`${getRarityColor(variety.rarity)}`}>
                                {variety.rarity}
                              </Badge>
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>

                    <Separator />
                  </div>
                </TabsContent>

                <TabsContent value="catalogs" className="pt-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Catalog References</CardTitle>
                      <CardDescription>
                        Cross-reference this stamp variety across major catalog systems worldwide
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl border overflow-hidden">
                          <div className="p-4 bg-slate-100 dark:bg-slate-700 border-b">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mr-3">
                                  <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                  <h3 className="font-medium">Stamps Of Approval</h3>
                                  <p className="text-xs text-muted-foreground">Our proprietary catalog system</p>
                                </div>
                              </div>
                              <Badge className="font-mono bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 border-amber-300">
                                {variety.code}
                              </Badge>
                            </div>
                          </div>

                          <div className="divide-y">
                            {Object.entries(variety.catalogReferences).map(([catalog, code]) => (
                              <div key={catalog} className="p-4 flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium">{catalog}</h4>
                                  <p className="text-xs text-muted-foreground">
                                    {catalog === "Campbell Paterson"
                                      ? "New Zealand specialized catalog"
                                      : catalog === "Stanley Gibbons"
                                        ? "British Commonwealth catalog"
                                        : catalog === "Scott"
                                          ? "US-published worldwide catalog"
                                          : catalog === "Michel"
                                            ? "German-published European catalog"
                                            : catalog === "Yvert"
                                              ? "French-published worldwide catalog"
                                              : "International catalog"}
                                  </p>
                                </div>
                                <Badge variant="outline" className="font-mono">
                                  {code}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="history" className="pt-2">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-3">Historical Context</h2>
                      <div className="prose dark:prose-invert max-w-none">
                        <p>
                          {stamp.title === "Coat of Arms" ? (
                            <>
                              The Coat of Arms stamp was a high-value definitive issued in {variety.year}, featuring New Zealand's national coat of arms. This stamp was primarily used for official mail and higher-value postage items.
                              <br /><br />
                              The {variety.name} variety in {variety.color.toLowerCase()} represents one of the noteworthy versions of this issue, with its distinctive coloration and printing characteristics.
                            </>
                          ) : (
                            <>
                              The {stamp.title} stamps of {stamp.country} issued in {stamp.issueDate.split("-")[0]}{" "}
                              represent an important part of the country's postal history. This period was marked by
                              significant developments in printing technology and postal services.
                              <br /><br />
                              The {variety.name} variety from {variety.year}
                              features {variety.description.toLowerCase()} and is considered{" "}
                              {variety.rarity.toLowerCase()} among collectors, representing both the technical
                              capabilities and artistic sensibilities of its era.
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-8 bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Other Varieties of {stamp.title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stamp.varieties
                    .filter((v) => v.id !== variety.id)
                    .slice(0, 3)
                    .map((otherVariety) => (
                      <Link href={`/catalog/${stamp.id}/${otherVariety.id}`} key={otherVariety.id}>
                        <Card className="h-full transition-all hover:shadow-md hover:border-slate-400 dark:hover:border-slate-600">
                          <div className="p-3">
                            <div className="aspect-square overflow-hidden rounded-md mb-3">
                              <img
                                src={otherVariety.image || "/placeholder.svg"}
                                alt={otherVariety.name}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <div>
                              <Badge
                                variant="default"
                                className={`mb-1 text-xs ${getRarityColor(otherVariety.rarity)}`}
                              >
                                {otherVariety.rarity}
                              </Badge>
                              <h3 className="font-medium line-clamp-1">{otherVariety.name}</h3>
                              <div className="flex justify-between items-center mt-1">
                                <p className="text-xs text-muted-foreground">
                                  {otherVariety.year} • {otherVariety.color}
                                </p>
                                <Badge variant="outline" className="font-mono text-xs">
                                  {otherVariety.code}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                </div>
                {stamp.varieties.length > 4 && (
                  <div className="mt-4 text-center">
                    <Button variant="outline" asChild>
                      <Link href={`/catalog/${stamp.id}`}>View All {stamp.varieties.length} Varieties</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 