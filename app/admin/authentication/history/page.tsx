"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, Eye, ChevronLeft, ChevronRight, Award } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import type { DateRange } from "react-day-picker"
import { addDays } from "date-fns"

// Sample authentication history data
const authenticationHistory = [
  {
    id: 1,
    stampName: "1935 King George V Silver Jubilee",
    stampOrigin: "New Zealand",
    reviewer: {
      name: "StampLearner",
      avatar: "/placeholder.svg?height=40&width=40&text=SL",
      level: "apprentice",
    },
    approvedBy: {
      name: "AdminUser",
      avatar: "/placeholder.svg?height=40&width=40&text=AU",
      level: "master",
    },
    reviewType: "authenticity",
    result: "genuine",
    completedAt: "2 days ago",
    endorsements: 2,
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
    approvedBy: {
      name: "StampExpert",
      avatar: "/placeholder.svg?height=40&width=40&text=SE",
      level: "master",
    },
    reviewType: "condition",
    result: "very fine",
    completedAt: "3 days ago",
    endorsements: 3,
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
    approvedBy: {
      name: "AdminUser",
      avatar: "/placeholder.svg?height=40&width=40&text=AU",
      level: "master",
    },
    reviewType: "authenticity",
    result: "genuine",
    completedAt: "5 days ago",
    endorsements: 4,
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
    approvedBy: {
      name: "StampExpert",
      avatar: "/placeholder.svg?height=40&width=40&text=SE",
      level: "master",
    },
    reviewType: "valuation",
    result: "$120-150",
    completedAt: "1 week ago",
    endorsements: 2,
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
    approvedBy: {
      name: "CollectorPro",
      avatar: "/placeholder.svg?height=40&width=40&text=CP",
      level: "certified",
    },
    reviewType: "authenticity",
    result: "genuine",
    completedAt: "1 week ago",
    endorsements: 1,
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
    approvedBy: {
      name: "AdminUser",
      avatar: "/placeholder.svg?height=40&width=40&text=AU",
      level: "master",
    },
    reviewType: "condition",
    result: "fine",
    completedAt: "2 weeks ago",
    endorsements: 2,
  },
  {
    id: 7,
    stampName: "1948 Gandhi Memorial Issue",
    stampOrigin: "India",
    reviewer: {
      name: "VintageStamps",
      avatar: "/placeholder.svg?height=40&width=40&text=VS",
      level: "certified",
    },
    approvedBy: {
      name: "StampExpert",
      avatar: "/placeholder.svg?height=40&width=40&text=SE",
      level: "master",
    },
    reviewType: "authenticity",
    result: "counterfeit",
    completedAt: "2 weeks ago",
    endorsements: 5,
  },
  {
    id: 8,
    stampName: "1840 Penny Black",
    stampOrigin: "United Kingdom",
    reviewer: {
      name: "StampExpert",
      avatar: "/placeholder.svg?height=40&width=40&text=SE",
      level: "master",
    },
    approvedBy: {
      name: "AdminUser",
      avatar: "/placeholder.svg?height=40&width=40&text=AU",
      level: "master",
    },
    reviewType: "authenticity",
    result: "genuine",
    completedAt: "3 weeks ago",
    endorsements: 8,
  },
]

export default function AuthenticationHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [reviewerLevelFilter, setReviewerLevelFilter] = useState("all")
  const [reviewTypeFilter, setReviewTypeFilter] = useState("all")
  const [resultFilter, setResultFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState("all")
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  })
  const itemsPerPage = 5

  // Filter reviews based on search, filters, and active tab
  const filteredReviews = authenticationHistory.filter((review) => {
    const matchesSearch =
      review.stampName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.stampOrigin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.reviewer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.approvedBy.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesReviewerLevel = reviewerLevelFilter === "all" || review.reviewer.level === reviewerLevelFilter
    const matchesReviewType = reviewTypeFilter === "all" || review.reviewType === reviewTypeFilter
    const matchesResult =
      resultFilter === "all" ||
      (resultFilter === "genuine" && review.result === "genuine") ||
      (resultFilter === "counterfeit" && review.result === "counterfeit") ||
      (resultFilter === "condition" && ["very fine", "fine", "good", "fair", "poor"].includes(review.result))

    // Filter based on active tab
    if (activeTab === "authenticity" && review.reviewType !== "authenticity") {
      return false
    } else if (activeTab === "condition" && review.reviewType !== "condition") {
      return false
    } else if (activeTab === "valuation" && review.reviewType !== "valuation") {
      return false
    }

    return matchesSearch && matchesReviewerLevel && matchesReviewType && matchesResult
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
                  level in variants ? variants[level as keyof typeof variants] : { bg: "bg-muted", text: "text-muted-foreground" }

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

  // Get badge color based on result
  const getResultBadge = (result: string) => {
    if (result === "genuine") {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
          Genuine
        </Badge>
      )
    } else if (result === "counterfeit") {
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
          Counterfeit
        </Badge>
      )
    } else if (["very fine", "fine", "good", "fair", "poor"].includes(result)) {
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          {result}
        </Badge>
      )
    } else if (result.startsWith("$")) {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
          {result}
        </Badge>
      )
    } else {
      return <Badge variant="outline">{result}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Authentication History</h1>
          <p className="text-muted-foreground">View completed authentication reviews</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Completed Reviews</CardTitle>
          <CardDescription>History of approved authentication reviews</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Reviews</TabsTrigger>
              <TabsTrigger value="authenticity">Authenticity</TabsTrigger>
              <TabsTrigger value="condition">Condition</TabsTrigger>
              <TabsTrigger value="valuation">Valuation</TabsTrigger>
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

              <Select value={resultFilter} onValueChange={setResultFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Result" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Results</SelectItem>
                  <SelectItem value="genuine">Genuine</SelectItem>
                  <SelectItem value="counterfeit">Counterfeit</SelectItem>
                  <SelectItem value="condition">Condition Grades</SelectItem>
                </SelectContent>
              </Select>

              <DatePickerWithRange date={date} setDate={setDate} />

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
                  <TableHead>Approved By</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Completed</TableHead>
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
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={review.approvedBy.avatar} alt={review.approvedBy.name} />
                            <AvatarFallback>{review.approvedBy.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium">{review.approvedBy.name}</div>
                            <div>{getReviewerLevelBadge(review.approvedBy.level)}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getReviewTypeBadge(review.reviewType)}</TableCell>
                      <TableCell>{getResultBadge(review.result)}</TableCell>
                      <TableCell>{review.completedAt}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/authentication/review/${review.id}`}>
                            <Eye className="h-4 w-4 mr-1" /> View Details
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No authentication history found matching your criteria.
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
