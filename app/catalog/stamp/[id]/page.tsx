"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SOACode } from "@/components/catalog/soa-code"
import { StampHierarchy } from "@/components/catalog/stamp-hierarchy"
import { ArrowLeft, Heart, List, Eye, Star, ExternalLink, Share2, ThumbsUp } from "lucide-react"

// Mock data for demonstration
const mockStampData = {
  id: "stamp-1",
  title: "1d Chalon London Print",
  description: "1d full carmine on white paper with a large star watermark. Known as a \"Chalon\" from the 1855 by Perkins, Bacon. The first date of issue is recognized as Jul 20 1855.",
  country: "New Zealand",
  region: "Chalons",
  subGroup: "Full Face Queens",
  year: "1855",
  denomination: "1D",
  color: "Red",
  colorNumber: 1,
  condition: "Very Fine",
  catalogNumbers: {
    soa: 1,
    sg: "1",
    scott: "1",
    michel: "1"
  },
  features: ["Imp"],
  images: [
    "/placeholder-stamp-detail.jpg"
  ],
  estimatedValue: {
    mint: "$85,000.00",
    used: "$32,500.00"
  },
  grading: {
    soa: "FINE",
    resolution: "High",
    authenticity: "Certified Original",
  },
  lastSalePrice: "$33,400.00",
  totalSales: 8,
  interestedBuyers: 10,
  interestedSellers: 2,
  rarityRating: "VERY RARE",
  watermarkImage: "/placeholder-watermark.jpg",
  alternativeCodes: ["SOA 1", "SG 1", "Scott 1", "Michel 1"]
}

// Mock varieties for demonstration
const mockVarieties = [
  {
    id: "stamp-1-var1",
    name: "Standard Issue (No Watermark)",
    image: "https://placehold.co/400x400/e2e8f0/1e293b?text=1.1",
    features: ["Standard"],
    catalogNumbers: { soa: 1, sg: "1", scott: "1", michel: "1" },
    description: "1855 1d Red, Standard Issue without watermark",
    marketValue: "$5,000 - $7,500",
  },
  {
    id: "stamp-1-var2",
    name: "Damaged Plate",
    image: "https://placehold.co/400x400/e2e8f0/1e293b?text=1.2",
    features: ["E"],
    catalogNumbers: { soa: 1, sg: "1a", scott: "1var", michel: "1I" },
    description: "1855 1d Red with plate damage in corner",
    marketValue: "$7,500 - $9,000",
  },
  {
    id: "stamp-1-var3",
    name: "Local Rouletted",
    image: "https://placehold.co/400x400/e2e8f0/1e293b?text=1.3",
    features: ["E", "Imp"],
    catalogNumbers: { soa: 1, sg: "1b", scott: "1a", michel: "1II" },
    description: "1855 1d Red with local rouletted edges",
    marketValue: "$12,000 - $15,000",
  },
]

export default function StampDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [showHierarchy, setShowHierarchy] = useState(false)
  const [approvalStatus, setApprovalStatus] = useState("I Have")
  const [inWishList, setInWishList] = useState(false)
  const [inLookoutList, setInLookoutList] = useState(false)
  
  // Placeholder stamp image for demo
  const stampImage = "https://placehold.co/800x800/e2e8f0/1e293b?text=1d+Red"
  
  // Select image resolution
  const [selectedResolution, setSelectedResolution] = useState("medium")
  
  // Format stamp data for hierarchy component
  const stampTypeData = {
    id: mockStampData.id,
    title: mockStampData.title,
    image: stampImage,
    denomination: mockStampData.denomination,
    country: mockStampData.country.split(" ")[0], // Just get first word (e.g., "New" from "New Zealand")
    year: mockStampData.year,
    description: mockStampData.description,
    colorNumber: mockStampData.colorNumber,
    colorName: mockStampData.color
  }
  
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/catalog">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Catalog
            </Link>
          </Button>
        </div>
        
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold">{mockStampData.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">
                {mockStampData.country}
              </Badge>
              <Badge variant="outline">
                {mockStampData.year}
              </Badge>
              <Badge variant="secondary" className="font-mono">
                CNo: {mockStampData.colorNumber}
              </Badge>
              <SOACode
                stampNumber={mockStampData.catalogNumbers.soa}
                country={mockStampData.country.split(" ")[0]}
                year={mockStampData.year.slice(-2)}
                denomination={mockStampData.denomination}
                features={mockStampData.features}
                description={mockStampData.description}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant={inWishList ? "default" : "outline"} 
              size="sm"
              onClick={() => setInWishList(!inWishList)}
              className="gap-1"
            >
              <Heart className="h-4 w-4" fill={inWishList ? "currentColor" : "none"} />
              {inWishList ? "In Wish List" : "Add to Wish List"}
            </Button>
            
            <Button 
              variant={inLookoutList ? "default" : "outline"} 
              size="sm"
              onClick={() => setInLookoutList(!inLookoutList)}
              className="gap-1"
            >
              <Eye className="h-4 w-4" />
              {inLookoutList ? "In Look Out List" : "Add to Look Out List"}
            </Button>
            
            <Button 
              variant={approvalStatus === "I Want to Approve" ? "secondary" : "outline"} 
              size="sm"
              onClick={() => setApprovalStatus(approvalStatus === "I Want to Approve" ? "" : "I Want to Approve")}
              className="gap-1"
            >
              <ThumbsUp className="h-4 w-4" />
              {approvalStatus === "I Want to Approve" ? "Approval Pending" : "I Want to Approve"}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Stamp Image and Info */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <div className="relative aspect-square border rounded-lg overflow-hidden bg-white">
                    <Image
                      src={stampImage}
                      alt={mockStampData.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <div className="space-x-1">
                      <Badge 
                        variant={selectedResolution === "low" ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSelectedResolution("low")}
                      >
                        Low
                      </Badge>
                      <Badge 
                        variant={selectedResolution === "medium" ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSelectedResolution("medium")}
                      >
                        Medium
                      </Badge>
                      <Badge 
                        variant={selectedResolution === "high" ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSelectedResolution("high")}
                      >
                        High
                      </Badge>
                    </div>
                    
                    <Button variant="outline" size="sm" className="gap-1">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
                
                <div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">SOA Short Code</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="font-mono">{mockStampData.alternativeCodes[0]}</Badge>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Approval Status</h3>
                      <div className="mt-1">
                        <select 
                          className="w-full p-2 rounded-md border" 
                          value={approvalStatus}
                          onChange={(e) => setApprovalStatus(e.target.value)}
                        >
                          <option value="">Select Status</option>
                          <option value="I Have">I Have</option>
                          <option value="I Had">I Had</option>
                          <option value="I Want to Approve">I Want to Approve</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Estimated Value</h3>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <div className="border rounded p-2 text-center">
                          <div className="text-xs text-muted-foreground">Mint</div>
                          <div className="font-medium">{mockStampData.estimatedValue.mint}</div>
                        </div>
                        <div className="border rounded p-2 text-center">
                          <div className="text-xs text-muted-foreground">Used</div>
                          <div className="font-medium">{mockStampData.estimatedValue.used}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Last Sale Price</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{mockStampData.lastSalePrice}</Badge>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Rarity Rating</h3>
                      <Badge className="mt-1">{mockStampData.rarityRating}</Badge>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">SOA Grading</h3>
                      <div className="flex flex-col gap-1 mt-1">
                        <Badge variant="outline">{mockStampData.grading.soa}</Badge>
                        <div className="text-xs text-muted-foreground">
                          Image Resolution: {mockStampData.grading.resolution}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{mockStampData.description}</p>
              
              <div className="mt-4 pt-4 border-t">
                <h3 className="font-medium mb-2">Alternative Codes</h3>
                <div className="flex flex-wrap gap-2">
                  {mockStampData.alternativeCodes.map((code, index) => (
                    <Badge key={index} variant="outline" className="font-mono">{code}</Badge>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <h3 className="font-medium mb-2">Watermark</h3>
                <div className="flex justify-center">
                  <div className="relative h-40 w-64 border rounded-md overflow-hidden">
                    <Image
                      src={mockStampData.watermarkImage}
                      alt="Watermark"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <Button 
                  variant="outline" 
                  className="w-full gap-1"
                  onClick={() => setShowHierarchy(true)}
                >
                  <List className="h-4 w-4" />
                  View Stamp Hierarchy Tree
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column - Details, Stats and Metadata */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stamp Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <div className="grid grid-cols-3 gap-1 py-1 border-b">
                  <dt className="text-muted-foreground">Country:</dt>
                  <dd className="col-span-2 font-medium">{mockStampData.country}</dd>
                </div>
                <div className="grid grid-cols-3 gap-1 py-1 border-b">
                  <dt className="text-muted-foreground">Group:</dt>
                  <dd className="col-span-2 font-medium">{mockStampData.subGroup}</dd>
                </div>
                <div className="grid grid-cols-3 gap-1 py-1 border-b">
                  <dt className="text-muted-foreground">Variation:</dt>
                  <dd className="col-span-2 font-medium">London Prints</dd>
                </div>
                <div className="grid grid-cols-3 gap-1 py-1 border-b">
                  <dt className="text-muted-foreground">Year:</dt>
                  <dd className="col-span-2 font-medium">{mockStampData.year}</dd>
                </div>
                <div className="grid grid-cols-3 gap-1 py-1 border-b">
                  <dt className="text-muted-foreground">Denomination:</dt>
                  <dd className="col-span-2 font-medium">{mockStampData.denomination}</dd>
                </div>
                <div className="grid grid-cols-3 gap-1 py-1 border-b">
                  <dt className="text-muted-foreground">Color:</dt>
                  <dd className="col-span-2 font-medium">{mockStampData.color} (#{mockStampData.colorNumber})</dd>
                </div>
                <div className="grid grid-cols-3 gap-1 py-1 border-b">
                  <dt className="text-muted-foreground">Condition:</dt>
                  <dd className="col-span-2 font-medium">{mockStampData.condition}</dd>
                </div>
                <div className="grid grid-cols-3 gap-1 py-1">
                  <dt className="text-muted-foreground">Features:</dt>
                  <dd className="col-span-2 font-medium">Imperforate</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Catalog References</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <div className="grid grid-cols-3 gap-1 py-1 border-b">
                  <dt className="text-muted-foreground">SOA:</dt>
                  <dd className="col-span-2 font-medium">{mockStampData.catalogNumbers.soa}</dd>
                </div>
                <div className="grid grid-cols-3 gap-1 py-1 border-b">
                  <dt className="text-muted-foreground">Stanley Gibbons:</dt>
                  <dd className="col-span-2 font-medium">SG {mockStampData.catalogNumbers.sg}</dd>
                </div>
                <div className="grid grid-cols-3 gap-1 py-1 border-b">
                  <dt className="text-muted-foreground">Scott:</dt>
                  <dd className="col-span-2 font-medium">#{mockStampData.catalogNumbers.scott}</dd>
                </div>
                <div className="grid grid-cols-3 gap-1 py-1">
                  <dt className="text-muted-foreground">Michel:</dt>
                  <dd className="col-span-2 font-medium">{mockStampData.catalogNumbers.michel}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Market Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">All Sales</h3>
                <div className="flex items-center justify-between">
                  <span>{mockStampData.totalSales} recorded sales</span>
                  <Button variant="link" size="sm" className="h-auto p-0">
                    View as GRAPH or LIST
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Interest</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Buyers Interested:</span>
                    <Badge variant="outline">{mockStampData.interestedBuyers}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Sellers Interested:</span>
                    <Badge variant="outline">{mockStampData.interestedSellers}</Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 pt-2">
                <Button className="gap-1">
                  <Star className="h-4 w-4" />
                  Register Buyer/Seller Interest
                </Button>
                
                <Button variant="secondary" className="gap-1">
                  <ExternalLink className="h-4 w-4" />
                  Go to Stamp Sales
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>My Collections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Add to collection:</span>
                    <select className="w-40 p-1 rounded-md border text-sm">
                      <option value="">Select...</option>
                      <option value="my-collection-1">New Zealand</option>
                      <option value="my-collection-2">Chalons</option>
                      <option value="my-collection-3">19th Century</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Add to exhibition:</span>
                    <select className="w-40 p-1 rounded-md border text-sm">
                      <option value="">Select...</option>
                      <option value="my-exhibit-1">Queen Victoria</option>
                      <option value="my-exhibit-2">First Issues</option>
                      <option value="my-exhibit-3">Classics</option>
                    </select>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  View My Collections
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Stamp Hierarchy Modal */}
      {showHierarchy && (
        <StampHierarchy 
          stampType={stampTypeData}
          varieties={mockVarieties}
          onClose={() => setShowHierarchy(false)}
        />
      )}
    </div>
  )
} 