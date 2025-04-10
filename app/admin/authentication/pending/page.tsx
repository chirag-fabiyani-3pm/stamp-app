"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, Eye, CheckCircle, XCircle, ChevronLeft, ChevronRight, Award } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample authentication reviews data
const pendingReviews = [
  {
    id: 1,
    stampName: "1935 King George V Silver Jubilee",
    stampOrigin: "New Zealand",
    reviewer: {
      name: "StampLearner",
      avatar: "/placeholder.svg?height=40&width=40&text=SL",
      level: "apprentice",
    },
    listingOwner: {
      name: "StampCollector123",
      avatar: "/placeholder.svg?height=40&width=40&text=SC",
    },
    reviewType: "authenticity",
    status: "pending",
    submittedAt: "3 hours ago",
    endorsements: 0,
  },
  {
    id: 2,
    stampName: "1922 Peace and Commerce Issue",
    stampOrigin: "France",
    reviewer: {
      name: "NewCollector",
      avatar: "/placeholder.svg?height=40&width=40&text=NC",
      level: "apprentice",
    },
    listingOwner: {
      name: "VintageStamps",
      avatar: "/placeholder.svg?height=40&width=40&text=VS",
    },
    reviewType: "condition",
    status: "pending",
    submittedAt: "5 hours ago",
    endorsements: 1,
  },
  {
    id: 3,
    stampName: "1947 Independence Issue",
    stampOrigin: "India",
    reviewer: {
      name: "StampExpert",
      avatar: "/placeholder.svg?height=40&width=40&text=SE",
      level: "certified",
    },
    listingOwner: {
      name: "GlobalTrader",
      avatar: "/placeholder.svg?height=40&width=40&text=GT",
    },
    reviewType: "authenticity",
    status: "pending",
    submittedAt: "1 day ago",
    endorsements: 2,
  },
  {
    id: 4,
    stampName: "1950 Definitive Series",
    stampOrigin: "Germany",
    reviewer: {
      name: "CollectorPro",
      avatar: "/placeholder.svg?height=40&width=40&text=CP",
      level: "certified",
    },
    listingOwner: {
      name: "StampCollector123",
      avatar: "/placeholder.svg?height=40&width=40&text=SC",
    },
    reviewType: "valuation",
    status: "pending",
    submittedAt: "2 days ago",
    endorsements: 1,
  },
  {
    id: 5,
    stampName: "1937 Coronation Issue",
    stampOrigin: "United Kingdom",
    reviewer: {
      name: "TechEnthusiast",
      avatar: "/placeholder.svg?height=40&width=40&text=TE",
      level: "apprentice",
    },
    listingOwner: {
      name: "VintageStamps",
      avatar: "/placeholder.svg?height=40&width=40&text=VS",
    },
    reviewType: "authenticity",
    status: "pending",
    submittedAt: "2 days ago",
    endorsements: 0,
  },
  {
    id: 6,
    stampName: "1932 Washington Bicentennial",
    stampOrigin: "United States",
    reviewer: {
      name: "StampLearner",
      avatar: "/placeholder.svg?height=40&width=40&text=SL",
      level: "apprentice",
    },
    listingOwner: {
      name: "USACollector",
      avatar: "/placeholder.svg?height=40&width=40&text=UC",
    },
    reviewType: "condition",
    status: "pending",
    submittedAt: "3 days ago",
    endorsements: 1,
  },
]

export default function PendingAuthenticationPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [reviewerLevelFilter, setReviewerLevelFilter] = useState("all")
  const [reviewTypeFilter, setReviewTypeFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState("all")
  const itemsPerPage = 5

  // Filter reviews based on search, filters, and active tab
  const filteredReviews = pendingReviews.filter((review) => {
    const matchesSearch =
      review.stampName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.stampOrigin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.reviewer.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesReviewerLevel = reviewerLevelFilter === "all" || review.reviewer.level === reviewerLevelFilter
    const matchesReviewType = reviewTypeFilter === "all" || review.reviewType === reviewTypeFilter

    // Filter based on active tab
    if (activeTab === "apprentice" && review.reviewer.level !== "apprentice") {
      return false
    } else if (activeTab === "certified" && review.reviewer.level !== "certified") {
      return false
    }

    return matchesSearch && matchesReviewerLevel && matchesReviewType
  })

  // Paginate reviews
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedReviews = filteredReviews.slice(startIndex, startIndex + itemsPerPage)

  // Get badge color based on reviewer level
  const getReviewerLevelBadge = (level: string) => {
    const variants = {
      apprentice: { bg: "bg-blue-100", text: "text-blue-800" },
      certified: { bg: "bg-green-100", text: "text-green-800" },
      master: { bg: "bg-purple-100", text: "text-purple-800" },
    }

    const variant =
      level in variants ? variants[level as keyof typeof variants] : { bg: "bg-gray-100", text: "text-gray-800" }

    return (
      <Badge variant="outline" className={`${variant.bg} ${variant.text} hover:${variant.bg}`}>
        <Award className="h-3 w-3 mr-1" />
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </Badge>
    )
  }

  // Get badge color based on review type
  const getReviewTypeBadge = (type: string) => {
    switch (type) {
      case "authenticity":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Authenticity
          </Badge>
        )
      case "condition":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Condition
          </Badge>
        )
      case "valuation":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Valuation
          </Badge>
        )
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Pending Authentication Reviews</h1>
          <p className="text-muted-foreground">Manage and approve authentication reviews</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Reviews</CardTitle>
          <CardDescription>Reviews awaiting approval or endorsement</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Reviews</TabsTrigger>
              <TabsTrigger value="apprentice">Apprentice Reviews</TabsTrigger>
              <TabsTrigger value="certified">Certified Reviews</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stamps or reviewers..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Select value={reviewerLevelFilter} onValueChange={setReviewerLevelFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Reviewer Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="apprentice">Apprentice</SelectItem>
                  <SelectItem value="certified">Certified</SelectItem>
                  <SelectItem value="master">Master</SelectItem>
                </SelectContent>
              </Select>

              <Select value={reviewTypeFilter} onValueChange={setReviewTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Review Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="authenticity">Authenticity</SelectItem>
                  <SelectItem value="condition">Condition</SelectItem>
                  <SelectItem value="valuation">Valuation</SelectItem>
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
                  <TableHead>Stamp</TableHead>
                  <TableHead>Reviewer</TableHead>
                  <TableHead>Review Type</TableHead>
                  <TableHead>Listing Owner</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Endorsements</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedReviews.length > 0 ? (
                  paginatedReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{review.stampName}</div>
                          <div className="text-xs text-muted-foreground">{review.stampOrigin}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={review.reviewer.avatar} alt={review.reviewer.name} />
                            <AvatarFallback>{review.reviewer.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium">{review.reviewer.name}</div>
                            <div>{getReviewerLevelBadge(review.reviewer.level)}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getReviewTypeBadge(review.reviewType)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={review.listingOwner.avatar} alt={review.listingOwner.name} />
                            <AvatarFallback>{review.listingOwner.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{review.listingOwner.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{review.submittedAt}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-gray-100 text-gray-800">
                          {review.endorsements}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/authentication/review/${review.id}`}>
                              <Eye className="h-4 w-4 mr-1" /> View
                            </Link>
                          </Button>
                          <Button variant="default" size="sm" className="gap-1">
                            <CheckCircle className="h-4 w-4" /> Approve
                          </Button>
                          <Button variant="destructive" size="sm" className="gap-1">
                            <XCircle className="h-4 w-4" /> Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No pending reviews found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

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
