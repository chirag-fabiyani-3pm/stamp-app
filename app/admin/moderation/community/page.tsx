"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, Eye, CheckCircle, XCircle, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

// Sample community posts data
const communityPosts = [
  {
    id: 1,
    title: "Question about authentication services",
    author: {
      name: "NewCollector",
      avatar: "/placeholder.svg?height=40&width=40&text=NC",
    },
    category: "Identification",
    status: "pending",
    reportCount: 0,
    createdAt: "3 hours ago",
  },
  {
    id: 2,
    title: "Upcoming stamp exhibition in London",
    author: {
      name: "EventOrganizer",
      avatar: "/placeholder.svg?height=40&width=40&text=EO",
    },
    category: "Events",
    status: "pending",
    reportCount: 0,
    createdAt: "6 hours ago",
  },
  {
    id: 3,
    title: "Identifying rare 19th century European stamps",
    author: {
      name: "StampExpert",
      avatar: "/placeholder.svg?height=40&width=40&text=SE",
    },
    category: "Identification",
    status: "approved",
    reportCount: 0,
    createdAt: "1 day ago",
  },
  {
    id: 4,
    title: "Best storage methods for preserving stamp condition",
    author: {
      name: "CollectorPro",
      avatar: "/placeholder.svg?height=40&width=40&text=CP",
    },
    category: "Preservation",
    status: "approved",
    reportCount: 0,
    createdAt: "2 days ago",
  },
  {
    id: 5,
    title: "Value estimation for Silver Jubilee collection",
    author: {
      name: "StampAppraiser",
      avatar: "/placeholder.svg?height=40&width=40&text=SA",
    },
    category: "Valuation",
    status: "approved",
    reportCount: 0,
    createdAt: "3 days ago",
  },
  {
    id: 6,
    title: "Trading etiquette for new collectors",
    author: {
      name: "TradeMaster",
      avatar: "/placeholder.svg?height=40&width=40&text=TM",
    },
    category: "Trading",
    status: "approved",
    reportCount: 2,
    createdAt: "4 days ago",
  },
  {
    id: 7,
    title: "Upcoming stamp exhibitions and events 2025",
    author: {
      name: "EventOrganizer",
      avatar: "/placeholder.svg?height=40&width=40&text=EO",
    },
    category: "Events",
    status: "approved",
    reportCount: 0,
    createdAt: "5 days ago",
  },
  {
    id: 8,
    title: "Stamps of Approval recognition accuracy discussion",
    author: {
      name: "TechEnthusiast",
      avatar: "/placeholder.svg?height=40&width=40&text=TE",
    },
    category: "Technology",
    status: "rejected",
    reportCount: 3,
    createdAt: "1 week ago",
  },
]

export default function CommunityModerationPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(communityPosts.map((post) => post.category)))]

  // Filter posts based on search and filters
  const filteredPosts = communityPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || post.status === statusFilter
    const matchesCategory = categoryFilter === "all" || post.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  // Paginate posts
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + itemsPerPage)

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Community Moderation</h1>
          <p className="text-muted-foreground">Review and moderate community posts</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Community Posts</CardTitle>
          <CardDescription>Review, approve, or reject community content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
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

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
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
                  <TableHead>Post</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reports</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={post.author.avatar} alt={post.author.name} />
                          <AvatarFallback>{post.author.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{post.title}</div>
                          <div className="text-xs text-muted-foreground">by {post.author.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{post.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(post.status)}>{post.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {post.reportCount > 0 ? (
                        <Badge variant="destructive">{post.reportCount}</Badge>
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </TableCell>
                    <TableCell>{post.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/community/topic-${post.id}`}>
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Link>
                        </Button>

                        {post.status === "pending" && (
                          <>
                            <Button variant="default" size="sm" className="gap-1">
                              <CheckCircle className="h-4 w-4" /> Approve
                            </Button>
                            <Button variant="destructive" size="sm" className="gap-1">
                              <XCircle className="h-4 w-4" /> Reject
                            </Button>
                          </>
                        )}

                        {post.reportCount > 0 && (
                          <Button variant="outline" size="sm" className="gap-1">
                            <AlertTriangle className="h-4 w-4" /> Review Reports
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
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
