"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle, Edit, ThumbsDown, ThumbsUp, X } from "lucide-react"

interface CatalogDataValidationProps {
  itemId: string
  onValidate: (id: string, isValid: boolean, corrections?: any) => void
  onSkip: (id: string) => void
}

export default function CatalogDataValidation({ itemId, onValidate, onSkip }: CatalogDataValidationProps) {
  const [activeTab, setActiveTab] = useState("details")
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    catalogCode: "SG 573var",
    soaCode: "SOA-NZ-004.2",
    name: "Silver Jubilee Plate Flaw",
    country: "New Zealand",
    year: "1935",
    denomination: "1d",
    color: "Purple",
    description: "Variety with flaw on King's ear (position 4/6)",
    condition: "Used",
    catalogPrice: "£85.00",
    marketPrice: "£110.00",
  })

  // Sample data for demonstration
  const extractedData = {
    id: "ext-003",
    catalogCode: "SG 573var",
    soaCode: "SOA-NZ-004.2",
    name: "Silver Jubilee Plate Flaw",
    country: "New Zealand",
    year: "1935",
    denomination: "1d",
    color: "Purple",
    description: "Variety with flaw on King's ear (position 4/6)",
    condition: "Used",
    catalogPrice: "£85.00",
    marketPrice: "£110.00",
    confidence: 92.1,
    status: "needs_review",
    issues: [
      {
        field: "catalogCode",
        message: "Low confidence in catalog code recognition",
        suggestedValue: "SG 573var",
        confidence: 82.5,
      },
      {
        field: "description",
        message: "Description may be incomplete",
        suggestedValue: "Variety with flaw on King's ear (position 4/6)",
        confidence: 88.3,
      },
    ],
    image: "/placeholder.svg?key=9vp5s",
    sourceImage: "/placeholder.svg?key=7r8hn",
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleValidate = (isValid: boolean) => {
    onValidate(itemId, isValid, isEditing ? formData : undefined)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Validate Catalog Data</h2>
          <p className="text-muted-foreground">Review and correct extracted catalog information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onSkip(itemId)}>
            Skip
          </Button>
          <Button variant="destructive" size="sm" onClick={() => handleValidate(false)}>
            <ThumbsDown className="h-4 w-4 mr-2" />
            Reject
          </Button>
          <Button variant="default" size="sm" onClick={() => handleValidate(true)}>
            <ThumbsUp className="h-4 w-4 mr-2" />
            Approve
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Extracted Data</CardTitle>
                  <CardDescription>Information extracted from catalog source</CardDescription>
                </div>
                <Button variant={isEditing ? "default" : "outline"} size="sm" onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Cancel Editing
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Data
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="issues">
                    Issues
                    <Badge className="ml-2 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                      {extractedData.issues.length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="pt-4 space-y-4">
                  {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="catalogCode">Catalog Code</Label>
                          <Input
                            id="catalogCode"
                            value={formData.catalogCode}
                            onChange={(e) => handleInputChange("catalogCode", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="soaCode">SOA Code</Label>
                          <Input
                            id="soaCode"
                            value={formData.soaCode}
                            onChange={(e) => handleInputChange("soaCode", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            value={formData.country}
                            onChange={(e) => handleInputChange("country", e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="year">Year</Label>
                            <Input
                              id="year"
                              value={formData.year}
                              onChange={(e) => handleInputChange("year", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="denomination">Denomination</Label>
                            <Input
                              id="denomination"
                              value={formData.denomination}
                              onChange={(e) => handleInputChange("denomination", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="color">Color</Label>
                          <Input
                            id="color"
                            value={formData.color}
                            onChange={(e) => handleInputChange("color", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="condition">Condition</Label>
                          <Select
                            value={formData.condition}
                            onValueChange={(value) => handleInputChange("condition", value)}
                          >
                            <SelectTrigger id="condition">
                              <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Mint">Mint</SelectItem>
                              <SelectItem value="Mint NH">Mint Never Hinged</SelectItem>
                              <SelectItem value="Used">Used</SelectItem>
                              <SelectItem value="Fine Used">Fine Used</SelectItem>
                              <SelectItem value="CTO">CTO</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="catalogPrice">Catalog Price</Label>
                          <Input
                            id="catalogPrice"
                            value={formData.catalogPrice}
                            onChange={(e) => handleInputChange("catalogPrice", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="marketPrice">Market Price</Label>
                          <Input
                            id="marketPrice"
                            value={formData.marketPrice}
                            onChange={(e) => handleInputChange("marketPrice", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium mb-1">Catalog Code</h3>
                          <div className="flex items-center gap-2">
                            <p className="text-base">{extractedData.catalogCode}</p>
                            {extractedData.issues.some((issue) => issue.field === "catalogCode") && (
                              <Badge variant="outline" className="text-amber-500 border-amber-200">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Low confidence
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium mb-1">SOA Code</h3>
                          <p className="text-base font-mono">{extractedData.soaCode}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium mb-1">Name</h3>
                          <p className="text-base">{extractedData.name}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium mb-1">Country</h3>
                          <p className="text-base">{extractedData.country}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-medium mb-1">Year</h3>
                            <p className="text-base">{extractedData.year}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium mb-1">Denomination</h3>
                            <p className="text-base">{extractedData.denomination}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium mb-1">Color</h3>
                          <p className="text-base">{extractedData.color}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium mb-1">Condition</h3>
                          <p className="text-base">{extractedData.condition}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium mb-1">Catalog Price</h3>
                          <p className="text-base">{extractedData.catalogPrice}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium mb-1">Market Price</h3>
                          <p className="text-base">{extractedData.marketPrice}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium mb-1">Description</h3>
                          <div className="flex items-center gap-2">
                            <p className="text-base">{extractedData.description}</p>
                            {extractedData.issues.some((issue) => issue.field === "description") && (
                              <Badge variant="outline" className="text-amber-500 border-amber-200">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Low confidence
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="issues" className="pt-4">
                  <div className="space-y-4">
                    {extractedData.issues.map((issue, index) => (
                      <div
                        key={index}
                        className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 rounded-md p-4"
                      >
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                          <div className="flex-1">
                            <h3 className="font-medium text-amber-800 dark:text-amber-300">
                              Issue with {issue.field.charAt(0).toUpperCase() + issue.field.slice(1)}
                            </h3>
                            <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">{issue.message}</p>
                            <div className="mt-3 space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-amber-700 dark:text-amber-400">Confidence:</span>
                                <span className="font-medium text-amber-800 dark:text-amber-300">
                                  {issue.confidence}%
                                </span>
                              </div>
                              <Progress value={issue.confidence} className="h-2 bg-amber-200 dark:bg-amber-800" />
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-amber-700 dark:text-amber-400">Extracted Value:</p>
                                <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                                  {extractedData[issue.field as keyof typeof extractedData] as string}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-amber-700 dark:text-amber-400">Suggested Value:</p>
                                <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                                  {issue.suggestedValue}
                                </p>
                              </div>
                            </div>
                            {isEditing ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-3 bg-white dark:bg-amber-900 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700"
                                onClick={() => handleInputChange(issue.field, issue.suggestedValue)}
                              >
                                Use Suggested Value
                              </Button>
                            ) : (
                              <div className="mt-3 flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-white dark:bg-amber-900 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700"
                                >
                                  <ThumbsDown className="h-3.5 w-3.5 mr-1" />
                                  Reject
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-white dark:bg-amber-900 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700"
                                >
                                  <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                                  Accept
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            {isEditing && (
              <CardFooter className="flex justify-end gap-2 pt-0">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsEditing(false)}>Save Changes</Button>
              </CardFooter>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Source Material</CardTitle>
              <CardDescription>Original catalog page from which data was extracted</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md p-4 flex justify-center">
                <img
                  src={extractedData.sourceImage || "/placeholder.svg"}
                  alt="Catalog page"
                  className="max-h-[400px] object-contain"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stamp Image</CardTitle>
              <CardDescription>Extracted stamp image</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md p-4 flex justify-center">
                <img
                  src={extractedData.image || "/placeholder.svg"}
                  alt={extractedData.name}
                  className="max-h-[300px] object-contain"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Extraction Confidence</CardTitle>
              <CardDescription>AI confidence levels for extracted data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Confidence</span>
                  <span className={extractedData.confidence > 95 ? "text-green-600" : "text-amber-600"}>
                    {extractedData.confidence}%
                  </span>
                </div>
                <Progress
                  value={extractedData.confidence}
                  className={`h-2 ${
                    extractedData.confidence > 95
                      ? "bg-green-100"
                      : extractedData.confidence > 90
                        ? "bg-amber-100"
                        : "bg-red-100"
                  }`}
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Catalog Code</span>
                    <span className="font-medium text-amber-600">82.5%</span>
                  </div>
                  <Progress value={82.5} className="h-1.5 bg-amber-100" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Description</span>
                    <span className="font-medium text-amber-600">88.3%</span>
                  </div>
                  <Progress value={88.3} className="h-1.5 bg-amber-100" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Country & Year</span>
                    <span className="font-medium text-green-600">98.7%</span>
                  </div>
                  <Progress value={98.7} className="h-1.5 bg-green-100" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Denomination & Color</span>
                    <span className="font-medium text-green-600">97.2%</span>
                  </div>
                  <Progress value={97.2} className="h-1.5 bg-green-100" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Pricing Information</span>
                    <span className="font-medium text-green-600">95.8%</span>
                  </div>
                  <Progress value={95.8} className="h-1.5 bg-green-100" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Validation Actions</CardTitle>
              <CardDescription>Review and approve extracted data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="justify-start gap-2" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4" />
                  Edit Data
                </Button>
                <Button variant="outline" className="justify-start gap-2" onClick={() => onSkip(itemId)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                  Skip to Next Item
                </Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button variant="destructive" className="w-full gap-2" onClick={() => handleValidate(false)}>
                  <ThumbsDown className="h-4 w-4" />
                  Reject Data
                </Button>
                <Button variant="default" className="w-full gap-2" onClick={() => handleValidate(true)}>
                  <CheckCircle className="h-4 w-4" />
                  Approve Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
