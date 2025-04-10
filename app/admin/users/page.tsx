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
import { Search, MoreHorizontal, UserPlus, Download, Filter, ChevronLeft, ChevronRight, Award } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample user data
const users = [
  {
    id: 1,
    name: "StampCollector123",
    email: "collector123@example.com",
    avatar: "/placeholder.svg?height=40&width=40&text=SC",
    role: "user",
    status: "active",
    joinDate: "Mar 15, 2023",
    lastActive: "10 minutes ago",
    reviewerLevel: "apprentice",
    reviewCount: 12,
  },
  {
    id: 2,
    name: "VintageStamps",
    email: "vintage@example.com",
    avatar: "/placeholder.svg?height=40&width=40&text=VS",
    role: "user",
    status: "active",
    joinDate: "Jan 5, 2022",
    lastActive: "2 hours ago",
    reviewerLevel: "certified",
    reviewCount: 48,
  },
  {
    id: 3,
    name: "StampExpert",
    email: "expert@example.com",
    avatar: "/placeholder.svg?height=40&width=40&text=SE",
    role: "admin",
    status: "active",
    joinDate: "Aug 20, 2023",
    lastActive: "1 hour ago",
    reviewerLevel: "master",
    reviewCount: 156,
  },
  {
    id: 4,
    name: "AdminUser",
    email: "admin@example.com",
    avatar: "/placeholder.svg?height=40&width=40&text=AU",
    role: "admin",
    status: "active",
    joinDate: "Jun 10, 2022",
    lastActive: "25 minutes ago",
    reviewerLevel: "master",
    reviewCount: 203,
  },
  {
    id: 5,
    name: "NewCollector",
    email: "newbie@example.com",
    avatar: "/placeholder.svg?height=40&width=40&text=NC",
    role: "user",
    status: "active",
    joinDate: "Apr 2, 2024",
    lastActive: "1 hour ago",
    reviewerLevel: "apprentice",
    reviewCount: 3,
  },
  {
    id: 6,
    name: "CollectorPro",
    email: "pro@example.com",
    avatar: "/placeholder.svg?height=40&width=40&text=CP",
    role: "user",
    status: "active",
    joinDate: "Jan 12, 2022",
    lastActive: "3 hours ago",
    reviewerLevel: "certified",
    reviewCount: 67,
  },
  {
    id: 7,
    name: "TradeMaster",
    email: "trader@example.com",
    avatar: "/placeholder.svg?height=40&width=40&text=TM",
    role: "user",
    status: "suspended",
    joinDate: "Sep 8, 2022",
    lastActive: "2 days ago",
    reviewerLevel: null,
    reviewCount: 0,
  },
  {
    id: 8,
    name: "EventOrganizer",
    email: "events@example.com",
    avatar: "/placeholder.svg?height=40&width=40&text=EO",
    role: "user",
    status: "active",
    joinDate: "Nov 15, 2022",
    lastActive: "5 hours ago",
    reviewerLevel: null,
    reviewCount: 0,
  },
  {
    id: 9,
    name: "TechEnthusiast",
    email: "tech@example.com",
    avatar: "/placeholder.svg?height=40&width=40&text=TE",
    role: "user",
    status: "active",
    joinDate: "Feb 28, 2023",
    lastActive: "1 day ago",
    reviewerLevel: "apprentice",
    reviewCount: 8,
  },
  {
    id: 10,
    name: "GlobalTrader",
    email: "global@example.com",
    avatar: "/placeholder.svg?height=40&width=40&text=GT",
    role: "user",
    status: "inactive",
    joinDate: "Jul 19, 2023",
    lastActive: "2 weeks ago",
    reviewerLevel: null,
    reviewCount: 0,
  },
]

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [reviewerFilter, setReviewerFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState("all")
  const itemsPerPage = 8

  // Filter users based on search, filters, and active tab
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesReviewer = reviewerFilter === "all" || user.reviewerLevel === reviewerFilter

    // Filter based on active tab
    if (activeTab === "reviewers" && !user.reviewerLevel) {
      return false
    }

    return matchesSearch && matchesRole && matchesStatus && matchesReviewer
  })

  // Paginate users
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage)

  // Get badge color based on role
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "moderator":
        return "default"
      default:
        return "secondary"
    }
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

  // Get badge for reviewer level
  const getReviewerBadge = (level: string | null) => {
    if (!level) return null

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage and monitor user accounts</p>
        </div>

        <Button className="gap-2">
          <UserPlus className="h-4 w-4" /> Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="reviewers">Authenticators</TabsTrigger>
              <TabsTrigger value="admins">Administrators</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
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

              {activeTab === "reviewers" && (
                <Select value={reviewerFilter} onValueChange={setReviewerFilter}>
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
              )}

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
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  {activeTab === "reviewers" && <TableHead>Reviewer Level</TableHead>}
                  {activeTab === "reviewers" && <TableHead>Reviews</TableHead>}
                  <TableHead>Join Date</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(user.status)}>{user.status}</Badge>
                      </TableCell>
                      {activeTab === "reviewers" && (
                        <TableCell>{user.reviewerLevel ? getReviewerBadge(user.reviewerLevel) : "—"}</TableCell>
                      )}
                      {activeTab === "reviewers" && <TableCell>{user.reviewCount}</TableCell>}
                      <TableCell>{user.joinDate}</TableCell>
                      <TableCell>{user.lastActive}</TableCell>
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
                            <DropdownMenuItem>View profile</DropdownMenuItem>
                            <DropdownMenuItem>Edit user</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Change role</DropdownMenuItem>
                            {user.reviewerLevel ? (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Manage reviewer status</DropdownMenuItem>
                                <DropdownMenuItem>View authentication history</DropdownMenuItem>
                              </>
                            ) : (
                              <DropdownMenuItem>Make reviewer</DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            {user.status === "active" ? (
                              <DropdownMenuItem className="text-destructive">Suspend user</DropdownMenuItem>
                            ) : user.status === "suspended" ? (
                              <DropdownMenuItem>Reactivate user</DropdownMenuItem>
                            ) : null}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={activeTab === "reviewers" ? 8 : 6}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No users found matching your criteria.
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
