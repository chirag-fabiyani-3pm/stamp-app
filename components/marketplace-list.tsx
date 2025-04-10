"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Search, Filter, MessageSquare, ChevronLeft, ChevronRight, Flag, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { ReportDialog } from "@/components/report-dialog"

// Sample data for demonstration
const sampleListings = [
  {
    id: 1,
    title: "Silver Jubilee 1935 - New Zealand",
    type: "Trade",
    price: null,
    condition: "Excellent",
    seller: {
      name: "StampCollector123",
      avatar: "/placeholder.svg?height=40&width=40&text=SC",
      rating: 4.8,
    },
    image: "/silver-jubilee.jpg",
  },
  {
    id: 2,
    title: "Coronation Series 1953 - UK",
    type: "Sale",
    price: 45.0,
    condition: "Good",
    seller: {
      name: "VintageStamps",
      avatar: "/placeholder.svg?height=40&width=40&text=VS",
      rating: 4.9,
    },
    image: "/coronation-series.jpg",
  },
  {
    id: 3,
    title: "Independence Issue 1947 - India",
    type: "Trade",
    price: null,
    condition: "Fair",
    seller: {
      name: "StampExpert",
      avatar: "/placeholder.svg?height=40&width=40&text=SE",
      rating: 4.7,
    },
    image: "/independence-issue.jpg",
  },
  {
    id: 4,
    title: "Bicentennial 1976 - United States",
    type: "Sale",
    price: 25.0,
    condition: "Mint",
    seller: {
      name: "USACollector",
      avatar: "/placeholder.svg?height=40&width=40&text=UC",
      rating: 4.6,
    },
    image: "/bicentral.jpg",
  },
  {
    id: 5,
    title: "Olympic Games 2000 - Australia",
    type: "Sale",
    price: 15.5,
    condition: "Very Good",
    seller: {
      name: "DownUnderStamps",
      avatar: "/placeholder.svg?height=40&width=40&text=DS",
      rating: 4.5,
    },
    image: "/olympic-games.jpg",
  },
  {
    id: 6,
    title: "Flora Series 1961 - South Africa",
    type: "Trade",
    price: null,
    condition: "Good",
    seller: {
      name: "AfricaStamps",
      avatar: "/placeholder.svg?height=40&width=40&text=AS",
      rating: 4.3,
    },
    image: "/flora-series.jpg",
  },
]

export default function MarketplaceList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true"
    setIsLoggedIn(loggedInStatus)
  }, [])

  // Filter listings based on search term
  const filteredListings = sampleListings.filter(
    (listing) =>
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.seller.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedListings = filteredListings.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search marketplace listings..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1) // Reset to first page on search
              }}
            />
          </div>

          <div className="flex gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sale">For Sale</SelectItem>
                <SelectItem value="trade">For Trade</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                <SelectItem value="mint">Mint</SelectItem>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="very-good">Very Good</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              aria-expanded={isFilterOpen}
              aria-label="Filter listings"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isFilterOpen && (
          <div className="p-4 border rounded-md bg-background shadow-sm">
            <h3 className="font-medium mb-3">Advanced Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price-range">Price Range</Label>
                <div className="flex items-center gap-2">
                  <Input id="min-price" placeholder="Min $" type="number" className="w-24" />
                  <span>to</span>
                  <Input id="max-price" placeholder="Max $" type="number" className="w-24" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="seller-rating">Minimum Seller Rating</Label>
                <Select defaultValue="0">
                  <SelectTrigger id="seller-rating">
                    <SelectValue placeholder="Any rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any rating</SelectItem>
                    <SelectItem value="3">3+ stars</SelectItem>
                    <SelectItem value="4">4+ stars</SelectItem>
                    <SelectItem value="4.5">4.5+ stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="listing-date">Listed Within</Label>
                <Select defaultValue="any">
                  <SelectTrigger id="listing-date">
                    <SelectValue placeholder="Any time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any time</SelectItem>
                    <SelectItem value="day">Last 24 hours</SelectItem>
                    <SelectItem value="week">Last week</SelectItem>
                    <SelectItem value="month">Last month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stamp-year">Year of Issue</Label>
                <div className="flex items-center gap-2">
                  <Input id="min-year" placeholder="From" type="number" className="w-24" />
                  <span>to</span>
                  <Input id="max-year" placeholder="To" type="number" className="w-24" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={() => setIsFilterOpen(false)}>
                Cancel
              </Button>
              <Button size="sm">Apply Filters</Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Featured Listings</h2>
        {isLoggedIn ? (
          <Link href="/marketplace/create">
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Create Listing
            </Button>
          </Link>
        ) : (
          <Link href="/login">
            <Button className="gap-2">Log in to Create Listing</Button>
          </Link>
        )}
      </div>

      {filteredListings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No listings found matching your search criteria.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedListings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <img
                    src={listing.image || "/placeholder.svg"}
                    alt={listing.title}
                    className="object-cover w-full h-full"
                  />
                  <Badge
                    className={`absolute top-2 right-2 ${listing.type === "Trade" ? "bg-blue-500" : "bg-green-500"}`}
                  >
                    {listing.type}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-lg">{listing.title}</h3>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Condition: {listing.condition}</span>
                    {listing.price && <span className="font-medium">${listing.price.toFixed(2)}</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={listing.seller.avatar} alt={listing.seller.name} />
                      <AvatarFallback>{listing.seller.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{listing.seller.name}</span>
                    <div className="text-xs text-amber-500 ml-auto">★ {listing.seller.rating}</div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <Link href={`/marketplace/${listing.id}`} className="text-sm text-primary hover:underline">
                    View Details
                  </Link>
                  <div className="flex gap-2">
                    {isLoggedIn ? (
                      <Button variant="outline" size="sm" className="gap-1">
                        <MessageSquare className="h-3 w-3" /> Contact
                      </Button>
                    ) : null}
                    {isLoggedIn ? (
                      <ReportDialog
                        contentType="listing"
                        contentId={listing.id}
                        contentTitle={listing.title}
                        trigger={
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Flag className="h-3 w-3" />
                            <span className="sr-only">Report</span>
                          </Button>
                        }
                      />
                    ) : null}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
