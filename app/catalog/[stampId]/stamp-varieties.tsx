"use client"

import Link from "next/link"
import { ChevronLeft, Map, Calendar, BookOpen, Printer, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { generateStamps, type Stamp, type StampVariety } from "@/components/stamp-datastore"
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

export default function StampVarietiesClient({ stampId }: { stampId: string }) {
  const stamps = generateStamps()
  const stamp = stamps.find((s) => s.id === stampId)

  if (!stamp) {
    notFound()
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-6">
        <Link href="/catalog">
          <Button variant="ghost" className="pl-0 mb-4 hover:bg-transparent hover:text-primary">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Catalog
          </Button>
        </Link>

        <div className="bg-white dark:bg-slate-900 border rounded-xl shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 lg:w-1/4 p-6 bg-slate-50 dark:bg-slate-800 relative">
              <div className="aspect-[3/4] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 shadow-md">
                <img
                  src={stamp.image || "/placeholder.svg"}
                  alt={stamp.title}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <Badge variant="outline" className="absolute top-8 right-8 font-mono text-xs">
                {stamp.code}
              </Badge>
            </div>

            <div className="flex-1 p-6">
              <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                <h1 className="text-3xl font-bold tracking-tight">{stamp.title}</h1>
                <Button size="sm" variant="outline" className="gap-1">
                  <Bookmark className="h-4 w-4" />
                  Save
                </Button>
              </div>

              <div className="flex flex-wrap items-center text-sm text-muted-foreground mb-4 gap-x-3 gap-y-1">
                <div className="flex items-center">
                  <Map className="h-4 w-4 mr-1 text-slate-500" />
                  {stamp.country}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-slate-500" />
                  {stamp.issueDate}
                </div>
                {stamp.issueSeries && (
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1 text-slate-500" />
                    {stamp.issueSeries}
                  </div>
                )}
                {stamp.printMethod && (
                  <div className="flex items-center">
                    <Printer className="h-4 w-4 mr-1 text-slate-500" />
                    {stamp.printMethod}
                  </div>
                )}
              </div>

              <p className="text-muted-foreground">{stamp.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
                <Card className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Denomination</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-lg font-medium">{stamp.denomination}</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Varieties</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-lg font-medium">{stamp.varieties.length}</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Year</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-lg font-medium">{new Date(stamp.issueDate).getFullYear()}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="varieties" className="mt-8">
        <TabsList className="mb-6">
          <TabsTrigger value="varieties" className="text-base">
            Varieties
          </TabsTrigger>
          <TabsTrigger value="about" className="text-base">
            About This Stamp
          </TabsTrigger>
          <TabsTrigger value="catalogs" className="text-base">
            Catalogs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="varieties">
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Stamp Varieties</h2>
              <p className="text-muted-foreground">Browse all known varieties of the {stamp.title} stamp.</p>
            </div>

            <div className="w-full sm:w-auto">
              <Input placeholder="Search varieties..." className="max-w-xs" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {stamp.varieties.map((variety) => (
              <Link href={`/catalog/${stamp.id}/${variety.id}`} key={variety.id}>
                <Card className="h-full transition-all hover:shadow-md hover:border-slate-400 dark:hover:border-slate-600 overflow-hidden">
                  <div className="aspect-[3/4] relative">
                    <img
                      src={variety.image || "/placeholder.svg"}
                      alt={variety.name}
                      className="h-full w-full object-cover object-center transition-transform hover:scale-105 duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-4 py-4 flex flex-col justify-end">
                      <Badge variant="default" className={`self-start mb-2 ${getRarityColor(variety.rarity)}`}>
                        {variety.rarity}
                      </Badge>
                      <h3 className="text-white font-medium mb-1 drop-shadow-md">{variety.name}</h3>
                      <div className="flex justify-between items-center">
                        <p className="text-white/90 text-sm">
                          {variety.year} • {variety.color}
                        </p>
                        <Badge variant="outline" className="font-mono bg-white/20 backdrop-blur-sm text-white text-xs">
                          {variety.code}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="line-clamp-2 text-sm text-muted-foreground">{variety.description}</div>

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Condition:</span>
                        <span className="font-medium">{variety.condition}</span>
                      </div>

                      <Separator />

                      <div className="text-xs">
                        <span className="text-muted-foreground block mb-1">Catalog References:</span>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                          {Object.entries(variety.catalogReferences).map(([catalog, code]) => (
                            <div key={catalog} className="flex justify-between">
                              <span className="text-muted-foreground truncate">{catalog}:</span>
                              <span className="font-mono">{code}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button variant="secondary" className="w-full hover:bg-slate-200 dark:hover:bg-slate-700">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="about">
          {/* About content */}
          <div>About content for {stamp.title}</div>
        </TabsContent>

        <TabsContent value="catalogs">
          {/* Catalogs content */}
          <div>Catalog references for {stamp.title}</div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 