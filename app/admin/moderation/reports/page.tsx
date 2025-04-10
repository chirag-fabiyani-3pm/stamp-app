"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Tag,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

// Sample reports data
const reportedContent = [
  {
    id: 1,
    contentType: "listing",
    title: "Potentially counterfeit stamp listing",
    content: "Silver Jubilee 1935 - New Zealand",
    reporter: {
      name: "StampExpert",
      avatar: "/placeholder.svg?height=40&width=40&text=SE",
    },
    reportedUser: {
      name: "StampCollector123",
      avatar: "/placeholder.svg?height=40&width=40&text=SC",
    },
    reason: "Counterfeit item",
    status: "pending",
    createdAt: "1 hour ago",
  },
  {
    id: 2,
    contentType: "comment",
    title: "Inappropriate comment in discussion",
    content: "Comment in 'Best storage methods' topic",
    reporter: {
      name: "CollectorPro",
      avatar: "/placeholder.svg?height=40&width=40&text=CP",
    },
    reportedUser: {
      name: "NewCollector",
      avatar: "/placeholder.svg?height=40&width=40&text=NC",
    },
    reason: "Offensive language",
    status: "pending",
    createdAt: "4 hours ago",
  },
  {
    id: 3,
    contentType: "listing",
    title: "Misleading description",
    content: "Coronation Series 1953 - UK",
    reporter: {
      name: "VintageStamps",
      avatar: "/placeholder.svg?height=40&width=40&text=VS",
    },
    reportedUser: {
      name: "GlobalTrader",
      avatar: "/placeholder.svg?height=40&width=40&text=GT",
    },
    reason: "Misleading information",
    status: "pending",
    createdAt: "1 day ago",
  },
  {
    id: 4,
    contentType: "topic",
    title: "Spam content",
    content: "Unrelated promotional post",
    reporter: {
      name: "StampAppraiser",
      avatar: "/placeholder.svg?height=40&width=40&text=SA",
    },
    reportedUser: {
      name: "TechEnthusiast",
      avatar: "/placeholder.svg?height=40&width=40&text=TE",
    },
    reason: "Spam",
    status: "resolved",
    createdAt: "2 days ago",
  },
  {
    id: 5,
    contentType: "listing",
    title: "Duplicate listing",
    content: "Independence Issue 1947 - India",
    reporter: {
      name: "TradeMaster",
      avatar: "/placeholder.svg?height=40&width=40&text=TM",
    },
    reportedUser: {
      name: "StampCollector123",
      avatar: "/placeholder.svg?height=40&width=40&text=SC",
    },
    reason: "Duplicate content",
    status: "dismissed",
    createdAt: "3 days ago",
  },
]

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Filter reports based on search and filters
  const filteredReports = reportedContent.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reporter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedUser.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || report.status === statusFilter
    const matchesType = typeFilter === "all" || report.contentType === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  // Paginate reports
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedReports = filteredReports.slice(startIndex, startIndex + itemsPerPage)

  // Get badge color based on status
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "resolved":
        return "default"
      case "dismissed":
        return "outline"
      default:
        return "outline"
    }
  }

  // Get icon based on content type
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "listing":
        return <Tag className="h-4 w-4" />
      case "topic":
        return <MessageSquare className="h-4 w-4" />
      case "comment":
        return <MessageSquare className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Reported Content</h1>
          <p className="text-muted-foreground">Review and handle reported content</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reports</CardTitle>
          <CardDescription>Review and take action on reported content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
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
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="dismissed">Dismissed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Content Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="listing">Listings</SelectItem>
                  <SelectItem value="topic">Topics</SelectItem>
                  <SelectItem value="comment">Comments</SelectItem>
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
                  <TableHead>Report</TableHead>
                  <TableHead>Reported Content</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reported</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={report.reporter.avatar} alt={report.reporter.name} />
                          <AvatarFallback>{report.reporter.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{report.title}</div>
                          <div className="text-xs text-muted-foreground">by {report.reporter.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getContentTypeIcon(report.contentType)}
                        <div>
                          <div className="text-sm">{report.content}</div>
                          <div className="text-xs text-muted-foreground">Posted by {report.reportedUser.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{report.reason}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(report.status)}>{report.status}</Badge>
                    </TableCell>
                    <TableCell>{report.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href="#">
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Link>
                        </Button>

                        {report.status === "pending" && (
                          <>
                            <Button variant="default" size="sm" className="gap-1">
                              <CheckCircle className="h-4 w-4" /> Resolve
                            </Button>
                            <Button variant="outline" size="sm" className="gap-1">
                              Dismiss
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

          {filteredReports.length === 0 && (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No reports found matching your criteria.</p>
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
