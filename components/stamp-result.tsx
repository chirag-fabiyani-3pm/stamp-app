import React from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Bookmark, Book, Tag, DollarSign, ExternalLink, AlertTriangle, Info, ImagePlus } from "lucide-react"

interface StampResultProps {
  data: {
    country: string
    year: number
    denomination: string
    color: string
    condition?: string
    rarity?: string
    designElements: string[]
    historicalSignificance: string
    estimatedValue?: string
    catalogReference?: string
    soaCode?: string
    similarVarieties?: Array<{
      id: string
      name: string
      differentiatingFeatures: string[]
    }>
    possibleVarieties?: Array<{
      name: string
      probability: number
      id: string
    }>
  }
}

export default function StampResult({ data }: StampResultProps) {
  return (
    <div className="space-y-6">
      <div className="bg-primary/5 p-6 rounded-lg">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold">Stamp Identified!</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Book className="h-3 w-3 mr-1" /> Image Recognition
              </Badge>
              {data.soaCode && (
                <Badge variant="outline" className="font-mono bg-blue-50 text-blue-700 border-blue-200">
                  <Tag className="h-3 w-3 mr-1" /> {data.soaCode}
                </Badge>
              )}
            </div>
          </div>
          {data.estimatedValue && (
            <div className="text-lg font-medium text-primary">
              <DollarSign className="h-4 w-4 inline-block" /> {data.estimatedValue}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="col-span-1">
            <div className="bg-card border rounded-md p-2 mb-3">
              <img 
                src="/placeholder.svg?height=300&width=300&query=Stamp Silver Jubilee" 
                alt="Identified Stamp" 
                className="w-full h-auto"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="w-full text-xs">
                <Bookmark className="h-3 w-3 mr-1" /> Save to Collection
              </Button>
              <Button variant="outline" size="sm" className="w-full text-xs">
                <ImagePlus className="h-3 w-3 mr-1" /> Upload Better Image
              </Button>
            </div>
          </div>
          
          <div className="col-span-2">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Country</h4>
                <p className="font-medium">{data.country}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Year of Issue</h4>
                <p className="font-medium">{data.year}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Denomination</h4>
                <p className="font-medium">{data.denomination}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Color</h4>
                <p className="font-medium">{data.color}</p>
              </div>

              {data.condition && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Condition</h4>
                  <Badge variant="outline">{data.condition}</Badge>
                </div>
              )}

              {data.rarity && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Rarity</h4>
                  <Badge variant="outline">{data.rarity}</Badge>
                </div>
              )}

              {data.catalogReference && (
                <div className="col-span-2">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Catalog References</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.catalogReference.split(',').map((ref, index) => (
                      <Badge key={index} variant="outline" className="bg-muted/50">
                        {ref.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Design Elements</h4>
              <ul className="list-disc pl-5 space-y-1">
                {data.designElements.map((element, index) => (
                  <li key={index}>{element}</li>
                ))}
              </ul>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Historical Significance</h4>
              <p>{data.historicalSignificance}</p>
            </div>
          </div>
        </div>
        
        {data.possibleVarieties && data.possibleVarieties.length > 0 && (
          <div className="mt-6 p-4 border rounded-lg bg-amber-50/50">
            <div className="flex items-start gap-2 mb-3">
              <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800">Variety Identification</h4>
                <p className="text-sm text-amber-700">
                  This stamp belongs to a known group, but specific varieties exist with slight differences.
                  Use the &quot;Refine Identification&quot; button to examine specific features like watermarks and perforations.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
              {data.possibleVarieties.map((variety) => (
                <div key={variety.id} className="border bg-card rounded p-2 text-sm">
                  <div className="font-medium">{variety.name}</div>
                  <div className="flex justify-between items-center mt-1">
                    <Badge variant="outline" className="text-xs">
                      {variety.probability}% match
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Tabs defaultValue="similar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="similar">Similar Stamps</TabsTrigger>
          <TabsTrigger value="varieties">Varieties</TabsTrigger>
          <TabsTrigger value="catalog">Catalog Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="similar" className="space-y-4">
          <h3 className="text-lg font-medium mb-4">Similar Stamps in Catalog</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              {
                id: 1,
                name: "Silver Jubilee",
                country: "New Zealand",
                year: 1935,
                image: "/images/silver-jubilee.png",
                series: "Silver Jubilee Series",
              },
              {
                id: 2,
                name: "Coronation Series",
                country: "United Kingdom",
                year: 1953,
                image: "/images/coronation-series.png",
                series: "Coronation Series",
              },
              {
                id: 3,
                name: "Independence Issue",
                country: "India",
                year: 1947,
                image: "/images/independence-issue.png",
                series: "Independence Series",
              },
            ].map((stamp) => (
              <Card key={stamp.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <img
                    src={`/placeholder.svg?height=300&width=300&query=Stamp ${stamp.id} ${stamp.name}`}
                    alt={`${stamp.country} ${stamp.name} stamp`}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardContent className="p-3">
                  <h4 className="font-medium text-sm truncate">
                    {stamp.country} - {stamp.year} - {stamp.id}d
                  </h4>
                  <p className="text-xs text-muted-foreground">{stamp.series}</p>
                </CardContent>
                <CardFooter className="p-3 pt-0">
                  <Link href={`/catalog/stamp-${stamp.id}`} className="text-xs text-primary hover:underline">
                    View Details
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="varieties" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Known Varieties</h3>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              Silver Jubilee Series
            </Badge>
          </div>
          
          {data.similarVarieties && data.similarVarieties.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {data.similarVarieties.map((variety) => (
                <div key={variety.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                      <img 
                        src={`/placeholder.svg?height=60&width=60&query=Stamp Variety ${variety.name}`} 
                        alt={variety.name} 
                        className="max-w-full max-h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{variety.name}</h4>
                      <div className="mt-2">
                        <h5 className="text-xs font-medium text-muted-foreground uppercase">
                          Differentiating Features
                        </h5>
                        <ul className="mt-1 space-y-1">
                          {variety.differentiatingFeatures.map((feature, index) => (
                            <li key={index} className="text-sm flex items-start gap-2">
                              <span className="text-primary">•</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/catalog/nz-silver-jubilee/${variety.id}`}>
                          <span className="text-xs">View Details</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border rounded-lg bg-muted/30">
              <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <h4 className="font-medium">No Known Varieties</h4>
              <p className="text-sm text-muted-foreground mt-1">
                This stamp issue doesn&apos;t have any documented varieties in our database.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="catalog" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Catalog Information</h3>
            <Badge variant="outline" className="font-mono">
              {data.soaCode || "SOA-NZ-004.1"}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Stanley Gibbons</h4>
                  <Badge variant="outline">SG 573</Badge>
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  1935 Silver Jubilee Issue, King George V
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <span className="font-medium">Catalog Value:</span> £12.50
                  </div>
                  <Button variant="outline" size="sm" className="text-xs">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View In SG
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Scott</h4>
                  <Badge variant="outline">Scott 145</Badge>
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  1935 King George V Silver Jubilee
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <span className="font-medium">Catalog Value:</span> $15.00
                  </div>
                  <Button variant="outline" size="sm" className="text-xs">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View In Scott
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Recent Auction Results</h4>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    <DollarSign className="h-3 w-3 mr-1" />
                    Market Data
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm border-b pb-2">
                    <div>Cherrystone Auction, Dec 2023</div>
                    <div className="font-medium">$18.50</div>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b pb-2">
                    <div>Sandafayre, Oct 2023</div>
                    <div className="font-medium">£14.00</div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div>Spink & Son, Aug 2023</div>
                    <div className="font-medium">£15.50</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
