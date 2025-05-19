"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Upload,
  Database,
  CheckCircle2,
  Clock,
  BookOpen,
  DollarSign,
  AlertCircle,
  RefreshCw,
} from "lucide-react"

// Sample data for demonstration
const recentIngestions = [
  {
    id: "ing-001",
    source: "Stanley Gibbons 2023 - Commonwealth",
    status: "completed",
    items: 2450,
    startDate: "2023-12-01",
    completionDate: "2023-12-02",
  },
  {
    id: "ing-002",
    source: "Scott 2023 Volume 3 (G-I)",
    status: "processing",
    items: 1820,
    startDate: "2023-12-03",
    completionDate: null,
    progress: 68,
  },
  {
    id: "ing-003",
    source: "Cherrystone Auction Dec 2023",
    status: "completed",
    items: 520,
    startDate: "2023-12-01",
    completionDate: "2023-12-01",
    type: "price",
  },
]

const sampleExtractedData = [
  {
    id: "ext-001",
    catalogCode: "SG 185",
    soaCode: "SOA-NZ-004.1",
    name: "Silver Jubilee",
    country: "New Zealand",
    year: "1935",
    description: "Silver Jubilee of King George V",
    catalogPrice: "£12.50",
    marketPrice: "£15.00",
  },
  {
    id: "ext-002",
    catalogCode: "SC 185",
    soaCode: "SOA-NZ-004.1",
    name: "Silver Jubilee",
    country: "New Zealand",
    year: "1935",
    description: "Silver Jubilee of King George V",
    catalogPrice: "$15.00",
    marketPrice: "$18.50",
  },
]

export default function CatalogIngestionPage() {
  const [activeTab, setActiveTab] = useState("upload")
  const [selectedCatalogType, setSelectedCatalogType] = useState("stamp")
  const [selectedProcessingType, setSelectedProcessingType] = useState("ai")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Completed
          </Badge>
        )
      case "processing":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" /> Processing
          </Badge>
        )
      case "queued":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="h-3 w-3 mr-1" /> Queued
          </Badge>
        )
      case "validation":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            <AlertCircle className="h-3 w-3 mr-1" /> Needs Validation
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  // Handle file selection
  const handleFileSelect = () => {
    // Simulate file selection and upload
    setIsUploading(true)
    setUploadProgress(0)
    
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Catalog Data Ingestion</h1>
          <p className="text-muted-foreground">Upload and process catalog and price data using AI</p>
        </div>
      </div>

      <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" /> Upload Data
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center gap-2">
            <Clock className="h-4 w-4" /> Recent Ingestions
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" /> Extracted Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6 pt-6">
            <Card>
              <CardHeader>
              <CardTitle>Upload Catalog or Price Data</CardTitle>
              <CardDescription>
                Upload scanned catalog pages or auction results for AI processing
              </CardDescription>
              </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dataType">Data Type</Label>
                    <Select value={selectedCatalogType} onValueChange={setSelectedCatalogType}>
                      <SelectTrigger id="dataType">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stamp">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-blue-500" />
                            <span>Stamp Catalog</span>
                      </div>
                        </SelectItem>
                        <SelectItem value="price">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            <span>Price/Auction Data</span>
                    </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                </div>

                  <div className="space-y-2">
                    <Label htmlFor="processingMethod">Processing Method</Label>
                    <Select value={selectedProcessingType} onValueChange={setSelectedProcessingType}>
                      <SelectTrigger id="processingMethod">
                        <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ai">AI Agent (Recommended)</SelectItem>
                        <SelectItem value="manual">Manual Processing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

                    <div className="space-y-2">
                  <Label htmlFor="sourceName">Source Name</Label>
                  <Input
                    id="sourceName"
                    placeholder={
                      selectedCatalogType === "stamp"
                        ? "e.g., Stanley Gibbons 2023 - Commonwealth"
                        : "e.g., Cherrystone Auction Dec 2023"
                    }
                  />
                  </div>

                <div className="border-2 border-dashed rounded-md p-8 text-center">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <Upload className="h-12 w-12 text-muted-foreground" />
                  <div>
                      <p className="font-medium">Drag and drop files or click to browse</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedCatalogType === "stamp"
                          ? "Upload scanned catalog pages (PDF, JPG, PNG)"
                          : "Upload auction results or price lists (PDF, CSV, XLS)"}
                      </p>
                          </div>
                    <Button onClick={handleFileSelect}>Select Files</Button>
                        </div>
                        </div>

                {isUploading && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                          </div>
                    <Progress value={uploadProgress} />
                      </div>
                    )}

                <div className="flex flex-col gap-2 p-4 rounded-md bg-blue-50 border border-blue-200">
                  <h3 className="font-medium flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-blue-500" />
                    How the AI Agent Works
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Our AI scanning agent will extract all catalog information into our system, including:
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside ml-4 space-y-1">
                    <li>Stamp descriptions and catalog references</li>
                    <li>Stamp images and visual characteristics</li>
                    <li>Pricing information and rarity indicators</li>
                    <li>Automatically generate SOA (Stamps of Approval) universal codes</li>
                    {selectedCatalogType === "price" && (
                      <li>Auction results and recent market prices</li>
                    )}
                  </ul>
                          </div>
                        </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Process with AI"
                  )}
                          </Button>
                </div>
              </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Ingestion Jobs</CardTitle>
              <CardDescription>
                Status of recent catalog and price data processing
              </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                    <TableHead>Source</TableHead>
                    <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Progress</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {recentIngestions.map((ingestion) => (
                    <TableRow key={ingestion.id}>
                      <TableCell className="font-medium">{ingestion.source}</TableCell>
                        <TableCell>
                        {ingestion.type === "price" ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            <DollarSign className="h-3 w-3 mr-1" /> Price Data
                                    </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            <BookOpen className="h-3 w-3 mr-1" /> Catalog
                                    </Badge>
                        )}
                                </TableCell>
                      <TableCell>{getStatusBadge(ingestion.status)}</TableCell>
                      <TableCell>{ingestion.items.toLocaleString()}</TableCell>
                      <TableCell>{ingestion.startDate}</TableCell>
                      <TableCell>{ingestion.completionDate || "-"}</TableCell>
                                <TableCell>
                        {ingestion.status === "processing" ? (
                          <div className="space-y-1">
                            <Progress value={ingestion.progress} className="h-2" />
                            <p className="text-xs text-right">{ingestion.progress}%</p>
                                  </div>
                        ) : ingestion.status === "completed" ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            100%
                                    </Badge>
                        ) : (
                          "-"
                        )}
                              </TableCell>
                            </TableRow>
                  ))}
                        </TableBody>
                      </Table>
                        </CardContent>
                      </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6 pt-6">
                  <Card>
                    <CardHeader>
              <CardTitle>Extracted Catalog Data</CardTitle>
                      <CardDescription>
                View stamps and pricing information extracted by the AI agent
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Catalog Codes</TableHead>
                              <TableHead>SOA Code</TableHead>
                    <TableHead>Catalog Price</TableHead>
                    <TableHead>Market Price</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                  {sampleExtractedData.map((item) => (
                    <TableRow key={item.id}>
                              <TableCell>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-muted-foreground">{item.description}</div>
                        </div>
                              </TableCell>
                      <TableCell>{item.country}</TableCell>
                      <TableCell>{item.year}</TableCell>
                      <TableCell>{item.catalogCode}</TableCell>
                              <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {item.soaCode}
                                </Badge>
                              </TableCell>
                      <TableCell>{item.catalogPrice}</TableCell>
                      <TableCell>{item.marketPrice}</TableCell>
                            </TableRow>
                  ))}
                          </TableBody>
                        </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
