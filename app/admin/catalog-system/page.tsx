"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SOACode, Features } from "@/components/catalog/soa-code"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function CatalogSystemPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">SOA Catalog Code System</h1>
        <p className="text-muted-foreground mt-1">
          The unified stamp identification system for Stamps of Approval
        </p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="format">Code Format</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="implementation">Implementation</TabsTrigger>
          <TabsTrigger value="color-numbers">Color Numbers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>The SOA Universal Code System</CardTitle>
              <CardDescription>A standardized approach to stamp identification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The SOA Catalog Code System provides a unified approach to stamp identification that works alongside traditional
                catalog references. Each stamp is assigned both a simple numerical code and an expandable descriptive code.
              </p>

              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium mb-2">Key Benefits</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Compact & Logical: Easy to read and follow</li>
                  <li>Efficient Searching: Can be sorted by year, denomination, or feature</li>
                  <li>Expandable: Allows the addition of new pre-1860 varieties</li>
                  <li>Philatelic Accuracy: Includes imperforate, watermark, and special varieties</li>
                </ul>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <div className="font-medium">Interactive Example:</div>
                <SOACode
                  stampNumber={10}
                  country="NZ"
                  year="57"
                  denomination="6D"
                  features={["Imp"]}
                  description="1857 6d Brown Imperforate (Chalon Head)"
                />
                <span className="text-sm text-muted-foreground">(Click the code to expand it)</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="format" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Catalog Code Format</CardTitle>
              <CardDescription>Structure and organization of the SOA code system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p>The SOA catalog code follows this structure:</p>
                <div className="bg-muted p-3 rounded-md font-mono text-center">
                  Country-Year-Denomination-Feature
                </div>
                <p>Where:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Country:</strong> Two-letter country code (e.g., "NZ" for New Zealand)</li>
                  <li><strong>Year:</strong> Last two digits of the issue year (e.g., "57" for 1857)</li>
                  <li><strong>Denomination:</strong> Value in pence or shillings (e.g., "1D", "6D", "1S")</li>
                  <li><strong>Feature:</strong> Special identifiers if applicable (see feature codes below)</li>
                </ul>
              </div>

              <div className="mt-4">
                <h3 className="font-medium mb-2">Special Feature Codes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">Imp</Badge>
                    <span>Imperforate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">Wmk</Badge>
                    <span>Watermark</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">Rprt</Badge>
                    <span>Reprint</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">Oprt</Badge>
                    <span>Overprint</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">E</Badge>
                    <span>Error/Variety</span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-medium mb-2">Compound Features</h3>
                <p>
                  Multiple features can be combined using dots as separators:
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="font-mono">NZ-57-6D-Wmk.scr</Badge>
                  <span>→ New Zealand 1857 6d with Script Watermark</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Example Catalog Codes</CardTitle>
              <CardDescription>Real-world applications of the SOA code system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left font-medium p-2">Stamp Description</th>
                      <th className="text-left font-medium p-2">Traditional Code</th>
                      <th className="text-left font-medium p-2">SOA Code</th>
                      <th className="text-left font-medium p-2">Interactive</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2">1855 1d Red Imperforate (Chalon Head)</td>
                      <td className="p-2">SG 1</td>
                      <td className="p-2 font-mono">NZ-55-1D-Imp</td>
                      <td className="p-2">
                        <SOACode
                          stampNumber={1}
                          country="NZ"
                          year="55"
                          denomination="1D"
                          features={["Imp"]}
                          description="1855 1d Red Imperforate (Chalon Head)"
                        />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">1855 2d Blue with Watermark</td>
                      <td className="p-2">SG 2</td>
                      <td className="p-2 font-mono">NZ-55-2D-Wmk</td>
                      <td className="p-2">
                        <SOACode
                          stampNumber={2}
                          country="NZ"
                          year="55"
                          denomination="2D"
                          features={["Wmk"]}
                          description="1855 2d Blue with Watermark"
                        />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">1856 6d Brown Reprint</td>
                      <td className="p-2">SG 3R</td>
                      <td className="p-2 font-mono">NZ-56-6D-Rprt</td>
                      <td className="p-2">
                        <SOACode
                          stampNumber={3}
                          country="NZ"
                          year="56"
                          denomination="6D"
                          features={["Rprt"]}
                          description="1856 6d Brown Reprint"
                        />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">1857 1s Green Imperforate</td>
                      <td className="p-2">SG 6</td>
                      <td className="p-2 font-mono">NZ-57-1S-Imp</td>
                      <td className="p-2">
                        <SOACode
                          stampNumber={6}
                          country="NZ"
                          year="57"
                          denomination="1S"
                          features={["Imp"]}
                          description="1857 1s Green Imperforate"
                        />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">1857 6d Brown Imperforate (Chalon Head)</td>
                      <td className="p-2">SG 10</td>
                      <td className="p-2 font-mono">NZ-57-6D-Imp</td>
                      <td className="p-2">
                        <SOACode
                          stampNumber={10}
                          country="NZ"
                          year="57"
                          denomination="6D"
                          features={["Imp"]}
                          description="1857 6d Brown Imperforate (Chalon Head)"
                        />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">1857 6d Brown with Script Watermark</td>
                      <td className="p-2">SG 10a</td>
                      <td className="p-2 font-mono">NZ-57-6D-Wmk.scr</td>
                      <td className="p-2">
                        <SOACode
                          stampNumber={10}
                          country="NZ"
                          year="57"
                          denomination="6D"
                          features={["Wmk", "scr"]}
                          description="1857 6d Brown with Script Watermark"
                        />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">1859 2d Blue Overprint</td>
                      <td className="p-2">SG 14</td>
                      <td className="p-2 font-mono">NZ-59-2D-Oprt</td>
                      <td className="p-2">
                        <SOACode
                          stampNumber={14}
                          country="NZ"
                          year="59"
                          denomination="2D"
                          features={["Oprt"]}
                          description="1859 2d Blue Overprint"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="implementation" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Implementation Guidelines</CardTitle>
              <CardDescription>How to use the SOA code system in the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Progressive Disclosure</h3>
                <p>
                  The SOA code system implements progressive disclosure to provide different levels of detail:
                </p>
                <ol className="list-decimal pl-6 space-y-2 mt-2">
                  <li>
                    <strong>Simple Number:</strong> Starting from Number 1, each different denomination is assigned a sequential number.
                    <div className="mt-1 bg-muted p-2 rounded font-mono inline-block">10</div>
                  </li>
                  <li>
                    <strong>Basic Code:</strong> When clicked, expands to show country, year and denomination.
                    <div className="mt-1 bg-muted p-2 rounded font-mono inline-block">NZ-57-6D</div>
                  </li>
                  <li>
                    <strong>Full Code:</strong> When clicked again, expands to add features and variations.
                    <div className="mt-1 bg-muted p-2 rounded font-mono inline-block">NZ-57-6D-Imp</div>
                  </li>
                </ol>
              </div>

              <div className="mt-4">
                <h3 className="font-medium mb-2">Usage Examples</h3>
                <div className="space-y-2">
                  <p>The catalog code component can be used in various contexts:</p>
                  <div className="bg-muted p-3 rounded space-y-2">
                    <div className="flex items-center justify-between border-b pb-2">
                      <span>Stanley Gibbons SG 10</span>
                      <SOACode
                        stampNumber={10}
                        country="NZ"
                        year="57"
                        denomination="6D"
                        features={["Imp"]}
                        description="1857 6d Brown Imperforate (Chalon Head)"
                      />
                    </div>
                    <div className="flex items-center justify-between border-b pb-2">
                      <span>Scott #25</span>
                      <SOACode
                        stampNumber={25}
                        country="NZ"
                        year="59"
                        denomination="2D"
                        features={["Wmk", "Oprt"]}
                        description="1859 2d Blue with Watermark and Overprint"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Michel NZ 12a</span>
                      <SOACode
                        stampNumber={12}
                        country="NZ"
                        year="58"
                        denomination="1S"
                        features={["Wmk", "scr", "E"]}
                        description="1858 1s with Script Watermark (Error Variety)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="color-numbers" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>The Numbers Code</CardTitle>
              <CardDescription>Color numbers for stamp identification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The Numbers Code system assigns a unique number to each color and denomination combination in the
                Full Face Queens Group (the Chalons).
              </p>
              
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium mb-2">Example Color Numbers</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="flex items-center gap-2 p-2 bg-white/50 dark:bg-gray-800/50 rounded">
                    <Badge>1</Badge>
                    <span>1d Red</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-white/50 dark:bg-gray-800/50 rounded">
                    <Badge>3</Badge>
                    <span>2d Blue</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-white/50 dark:bg-gray-800/50 rounded">
                    <Badge>8</Badge>
                    <span>6d Brown</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-white/50 dark:bg-gray-800/50 rounded">
                    <Badge>11</Badge>
                    <span>1s Green</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center my-6">
                <div className="relative aspect-video w-full max-w-lg border rounded overflow-hidden">
                  <Image 
                    src="https://placehold.co/800x450/e2e8f0/1e293b?text=Color+Numbers+Chart"
                    alt="Color numbers chart"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              
              <p>
                When users click on a specific stamp type, they will see a hierarchy tree showing all the
                different varieties of that stamp type, organized by their features.
              </p>
              
              <div className="flex justify-center mt-4">
                <Button asChild>
                  <Link href="/admin/catalog-system/color-numbers">
                    View Complete Color Number System
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 