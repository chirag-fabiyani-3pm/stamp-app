"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MoreHorizontal, Download, Filter, ChevronLeft, ChevronRight, Award } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"

// Sample reviewers data
const reviewers = [
  {
    id: 1,
    name: "StampCollector123",
    email: "collector123@example.com",
    avatar: "/placeholder.svg?height=40&width=40&text=SC",
    role: "user",
    status: "active",
    reviewerLevel: "apprentice",
    reviewCount: 12,
    successRate: 92,
    endorsements: 8,
    joinedAsReviewer: "Mar 20, 2023",
    progressToNextLevel: 40,
  },
  {
    id: 2,
    name: "VintageStamps",
    email: "vintage@example.com",
    avatar: "/placeholder.svg?height=40&width=40&text=VS",
    role: "user",
    status: "active",
    reviewerLevel: "certified",
    reviewCount: 48,
    successRate: 96,
    endorsements: 35,
    joinedAsReviewer: "Jan 15, 2022",
    progressToNextLevel: 65,
  },
  {
    id: 3,
    name: "StampExpert",
    email: "expert@example.com",
    avatar: "/placeholder.svg?height=40&width=40&text=SE",
    role: "admin",
    status: "active",
    reviewerLevel: "master",
    reviewCount: 156,
    successRate: 99,
    endorsements: 142,
    joinedAsReviewer: "Aug 25, 2022",
    progressToNextLevel: 100,
  },
  {
    id: 4,
    name: "AdminUser",
    email: "admin@example.com",
    avatar: "/placeholder.svg?height=40&width=40&text=AU",
    role: "admin",
    status: "active",
    reviewerLevel: "master",
    reviewCount: 203,
    successRate: 98,
    endorsements: 187,
    joinedAsReviewer: "Jun 12, 2022",
    progressToNextLevel: 100,
  },
  {
    id: 5,
    name: "NewCollector",
    email: "newbie@example.com",
    avatar: "/placeholder.svg?height=40&width=40&text=NC",
    role: "user",
    status: "active",
    reviewerLevel: "apprentice",
    reviewCount: 3,
    successRate: 67,
    endorsements: 1,
    joinedAsReviewer: "Apr 5, 2024",
    progressToNextLevel: 10,
  },
  {
    id: 6,
    name: "CollectorPro",
    email: "pro@example.com",
    avatar: "/placeholder.svg?height=40&width=40&text=CP",
    role: "user",
    status: "active",
    reviewerLevel: "certified",
    reviewCount: 67,
    successRate: 94,
    endorsements: 52,
    joinedAsReviewer: "Jan 20, 2022",
    progressToNextLevel: 75,
  },
  {
    id: 9,
    name: "TechEnthusiast",
    email: "tech@example.com",
    avatar: "/placeholder.svg?height=40&width=40&text=TE",
    role: "user",
    status: "active",
    reviewerLevel: "apprentice",
    reviewCount: 8,
    successRate: 88,
    endorsements: 5,
    joinedAsReviewer: "Mar 1, 2023",
    progressToNextLevel: 25,
  },
]

export default function ReviewersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Filter reviewers based on search and filters
  const filteredReviewers = reviewers.filter((reviewer) => {
    const matchesSearch =
      reviewer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reviewer.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesLevel = levelFilter === "all" || reviewer.reviewerLevel === levelFilter
    const matchesStatus = statusFilter === "all" || reviewer.status === statusFilter

    return matchesSearch && matchesLevel && matchesStatus
  })

  // Paginate reviewers
  const totalPages = Math.ceil(filteredReviewers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedReviewers = filteredReviewers.slice(startIndex, startIndex + itemsPerPage)

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

  // Get badge color based on status
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "outline"
      case "suspended":
        return "destructive"
      case "inactive":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Authenticators</h1>
          <p className="text-muted-foreground">Manage users with authentication privileges</p>
        </div>

        <Button className="gap-2" asChild>
          <Link href="/admin/authentication/settings">
            <Award className="h-4 w-4" /> Authentication Settings
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Authenticator Management</CardTitle>
          <CardDescription>View and manage users with authentication privileges</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search authenticators..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="apprentice">Apprentice</SelectItem>
                  <SelectItem value="certified">Certified</SelectItem>
                  <SelectItem value="master">Master</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>

              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Authenticator</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Reviews</TableHead>
                  <TableHead>Success Rate</TableHead>
                  <TableHead>Endorsements</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedReviewers.length > 0 ? (
                  paginatedReviewers.map((reviewer) => (
                    <TableRow key={reviewer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={reviewer.avatar} alt={reviewer.name} />
                            <AvatarFallback>{reviewer.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{reviewer.name}</div>
                            <div className="text-xs text-muted-foreground">Since {reviewer.joinedAsReviewer}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getReviewerLevelBadge(reviewer.reviewerLevel)}</TableCell>
                      <TableCell>{reviewer.reviewCount}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            reviewer.successRate >= 95
                              ? "bg-green-100 text-green-800"
                              : reviewer.successRate >= 80
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                          }
                        >
                          {reviewer.successRate}%
                        </Badge>
                      </TableCell>
                      <TableCell>{reviewer.endorsements}</TableCell>
                      <TableCell>
                        <div className="w-full flex items-center gap-2">
                          <Progress value={reviewer.progressToNextLevel} className="h-2" />
                          <span className="text-xs text-muted-foreground">{reviewer.progressToNextLevel}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/users/${reviewer.id}`}>View profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>View authentication history</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Promote to next level</DropdownMenuItem>
                            <DropdownMenuItem>Demote to previous level</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {reviewer.status === "active" ? (
                              <DropdownMenuItem className="text-destructive">Suspend authenticator</DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem>Reactivate authenticator</DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-destructive">Remove authenticator role</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No authenticators found matching your criteria.
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

      <Card>
        <CardHeader>
          <CardTitle>Authenticator Statistics</CardTitle>
          <CardDescription>Performance metrics for authenticators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Level Distribution</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Apprentice</span>
                    <span className="font-medium">3</span>
                  </div>
                  <Progress value={43} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Certified</span>
                    <span className="font-medium">2</span>
                  </div>
                  <Progress value={28} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Master</span>
                    <span className="font-medium">2</span>
                  </div>
                  <Progress value={28} className="h-2" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Review Types</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Authenticity</span>
                    <span className="font-medium">245</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Condition</span>
                    <span className="font-medium">112</span>
                  </div>
                  <Progress value={30} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Valuation</span>
                    <span className="font-medium">20</span>
                  </div>
                  <Progress value={5} className="h-2" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Top Authenticators</h3>
              <div className="space-y-3">
                {reviewers
                  .sort((a, b) => b.reviewCount - a.reviewCount)
                  .slice(0, 3)
                  .map((reviewer, index) => (
                    <div key={reviewer.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={reviewer.avatar} alt={reviewer.name} />
                          <AvatarFallback>{reviewer.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{reviewer.name}</div>
                          <div className="text-xs text-muted-foreground">{reviewer.reviewCount} reviews</div>
                        </div>
                      </div>
                      {getReviewerLevelBadge(reviewer.reviewerLevel)}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
