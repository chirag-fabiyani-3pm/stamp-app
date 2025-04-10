"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, Eye, CheckCircle, XCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

// Sample marketplace listings data
const marketplaceListings = [
  {
    id: 1,
    title: "Silver Jubilee 1935 - New Zealand",
    type: "Trade",
    price: null,
    seller: {
      name: "StampCollector123",
      avatar: "/placeholder.svg?height=40&width=40&text=SC",
    },
    condition: "Excellent",
    status: "pending",
    reportCount: 0,
    createdAt: "2 hours ago",
  },
  {
    id: 2,
    title: "Rare German States Collection",
    type: "Sale",
    price: 250.0,
    seller: {
      name: "VintageStamps",
      avatar: "/placeholder.svg?height=40&width=40&text=VS",
    },
    condition: "Very Good",
    status: "pending",
    reportCount: 0,
    createdAt: "5 hours ago",
  },
  {
    id: 3,
    title: "US Bicentennial Complete Set",
    type: "Sale",
    price: 45.0,
    seller: {
      name: "USACollector",
      avatar: "/placeholder.svg?height=40&width=40&text=UC",
    },
    condition: "Mint",
    status: "pending",
    reportCount: 0,
    createdAt: "1 day ago",
  },
  {
    id: 4,
    title: "Coronation Series 1953 - UK",
    type: "Sale",
    price: 45.0,
    seller: {
      name: "VintageStamps",
      avatar: "/placeholder.svg?height=40&width=40&text=VS",
    },
    condition: "Good",
    status: "approved",
    reportCount: 0,
    createdAt: "2 days ago",
  },
  {
    id: 5,
    title: "Independence Issue 1947 - India",
    type: "Trade",
    price: null,
    seller: {
      name: "StampExpert",
      avatar: "/placeholder.svg?height=40&width=40&text=SE",
    },
    condition: "Fair",
    status: "approved",
    reportCount: 1,
    createdAt: "3 days ago",
  },
  {
    id: 6,
    title: "Olympic Games 2000 - Australia",
    type: "Sale",
    price: 15.5,
    seller: {
      name: "DownUnderStamps",
      avatar: "/placeholder.svg?height=40&width=40&text=DS",
    },
    condition: "Very Good",
    status: "approved",
    reportCount: 0,
    createdAt: "4 days ago",
  },
  {
    id: 7,
    title: "Flora Series 1961 - South Africa",
    type: "Trade",
    price: null,
    seller: {
      name: "AfricaStamps",
      avatar: "/placeholder.svg?height=40&width=40&text=AS",
    },
    condition: "Good",
    status: "rejected",
    reportCount: 2,
    createdAt: "5 days ago",
  },
]

export default function ListingsModerationPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Filter listings based on search and filters
  const filteredListings = marketplaceListings.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.seller.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || listing.status === statusFilter
    const matchesType = typeFilter === "all" || listing.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  // Paginate listings
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedListings = filteredListings.slice(startIndex, startIndex + itemsPerPage)

  // Get badge color based on status
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "default"
      case "pending":
        return "secondary"
      case "rejected":
        return "destructive"
      default:
        return "outline"
    }
  }

  // Get badge color based on listing type
  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "Sale":
        return "default"
      case "Trade":
        return "secondary"
      case "Auction":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Marketplace Moderation</h1>
          <p className="text-muted-foreground">Review and moderate marketplace listings</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Marketplace Listings</CardTitle>
          <CardDescription>Review, approve, or reject marketplace listings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search listings..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Sale">For Sale</SelectItem>
                  <SelectItem value="Trade">For Trade</SelectItem>
                  <SelectItem value="Auction">Auction</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Listing</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price/Condition</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reports</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedListings.map((listing) => (
                  <TableRow key={listing.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={listing.seller.avatar} alt={listing.seller.name} />
                          <AvatarFallback>{listing.seller.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{listing.title}</div>
                          <div className="text-xs text-muted-foreground">by {listing.seller.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getTypeBadgeVariant(listing.type)}>{listing.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        {listing.price ? (
                          <div className="font-medium">${listing.price.toFixed(2)}</div>
                        ) : (
                          <div className="text-muted-foreground">Trade only</div>
                        )}
                        <div className="text-xs text-muted-foreground">{listing.condition}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(listing.status)}>{listing.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {listing.reportCount > 0 ? (
                        <Badge variant="destructive">{listing.reportCount}</Badge>
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/marketplace/${listing.id}`}>
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Link>
                        </Button>

                        {listing.status === "pending" && (
                          <>
                            <Button variant="default" size="sm" className="gap-1">
                              <CheckCircle className="h-4 w-4" /> Approve
                            </Button>
                            <Button variant="destructive" size="sm" className="gap-1">
                              <XCircle className="h-4 w-4" /> Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredListings.length === 0 && (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No listings found matching your criteria.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
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
        </CardContent>
      </Card>
    </div>
  )
}
