"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import {
  Eye,
  CheckCircle2,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
  Save,
  X,
  Image as ImageIcon,
  MapPin,
  Calendar,
  Trash2,
  AlertTriangle,
} from "lucide-react"

// API Response Types
interface StampReviewItem {
  id: string
  catalogExtractionProcessId: string
  stampCatalogCode: string
  name: string
  publisher: string
  country: string
  stampImageUrl: string
  catalogName: string
  catalogNumber: string
  seriesName: string
  issueDate: string
  issueYear: number
  denominationValue: number
  denominationCurrency: string
  denominationSymbol: string
  color: string
  paperType: string
  status: string
  createdAt: string
  updatedAt: string
  isPublished: boolean
  publishNotes?: string
}

interface StampReviewResponse {
  items: StampReviewItem[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

// Import the actual StampMasterCatalogItem type
import type { StampMasterCatalogItem } from "@/lib/api/stamp-master-catalog"

// Editable stamp data for the popup - uses actual API type
type EditableStampData = StampMasterCatalogItem & { publish: boolean; isPublished: boolean; publishNotes?: string }

// JWT helper function
const getJWT = (): string | null => {
  if (typeof window !== 'undefined') {
    try {
      const stampUserData = localStorage.getItem('stamp_user_data')
      if (stampUserData) {
        const userData = JSON.parse(stampUserData)
        if (userData && userData.jwt) {
          return userData.jwt
        }
      }
    } catch (error) {
      console.error('Error parsing stamp_user_data from localStorage:', error)
    }

    const cookies = document.cookie.split(';')
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=')
      if (name === 'stamp_jwt') {
        return value
      }
    }
  }
  return null
}

// API Functions
const fetchStampsForReview = async (
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<StampReviewResponse> => {
  const jwt = getJWT()
  if (!jwt) {
    throw new Error("Authentication required. Please log in again.")
  }

  const response = await fetch(
    `https://decoded-app-stamp-api-prod-01.azurewebsites.net/api/v1/StampMasterCatalog?pageNumber=${pageNumber}&pageSize=${pageSize}&catalogExtractionProcessId=254c793b-16d0-40a3-8b10-66d987b54474`,
    {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      }
    }
  )

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

const updateStamp = async (stampId: string, stampData: Partial<EditableStampData>): Promise<StampReviewItem> => {
  const jwt = getJWT()
  if (!jwt) {
    throw new Error("Authentication required. Please log in again.")
  }

  const response = await fetch(
    `https://decoded-app-stamp-api-prod-01.azurewebsites.net/api/v1/StampMasterCatalog/${stampId}`,
    {
      method: "PUT",
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(stampData)
    }
  )

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

const approveStamp = async (stampId: string, publishNotes: string): Promise<StampReviewItem> => {
  return updateStamp(stampId, { publish: true, publishNotes })
}

const deleteStamp = async (stampId: string): Promise<void> => {
  const jwt = getJWT()
  if (!jwt) {
    throw new Error("Authentication required. Please log in again.")
  }

  const response = await fetch(
    `https://decoded-app-stamp-api-prod-01.azurewebsites.net/api/v1/StampMasterCatalog/${stampId}`,
    {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      }
    }
  )

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
}

export default function StampReviewPage() {
  const [stamps, setStamps] = useState<StampReviewItem[]>([])
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [countryFilter, setCountryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Modal states
  const [selectedStamp, setSelectedStamp] = useState<EditableStampData | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [editFormData, setEditFormData] = useState<Partial<EditableStampData>>({})
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Publish Notes Modal states
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false)
  const [publishNotes, setPublishNotes] = useState("")
  const [stampToApprove, setStampToApprove] = useState<StampReviewItem | null>(null)

  const { toast } = useToast()

  // Load stamps data
  const loadStamps = async (page: number = 1, refresh: boolean = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }

      const response = await fetchStampsForReview(page, pageSize)
      setStamps(response.items || [])
      setPageNumber(response.pageNumber || page)
      setPageSize(response.pageSize || pageSize)
      setTotalCount(response.totalCount || 0)
      setTotalPages(response.totalPages || 0)

    } catch (error) {
      console.error("Error loading stamps:", error)
      toast({
        title: "Failed to Load Stamps",
        description: error instanceof Error ? error.message : "Unable to fetch stamps for review. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  // Handle opening publish notes modal
  const handleOpenPublishModal = (stamp: StampReviewItem) => {
    setStampToApprove(stamp)
    setPublishNotes("")
    setIsPublishModalOpen(true)
  }

  // Handle approve stamp with publish notes
  const handleApproveStamp = async () => {
    if (!stampToApprove || !publishNotes.trim()) {
      toast({
        title: "Validation Error",
        description: "Publish notes are required to approve this stamp.",
        variant: "destructive",
        duration: 5000,
      })
      return
    }

    try {
      setIsUpdating(true)
      await approveStamp(stampToApprove.id, publishNotes.trim())

      // Update local state
      setStamps(prev => prev.map(stamp =>
        stamp.id === stampToApprove.id ? { ...stamp, isPublished: true, publishNotes: publishNotes.trim() } : stamp
      ))

      setIsPublishModalOpen(false)
      setStampToApprove(null)
      setPublishNotes("")

      toast({
        title: "Stamp Approved",
        description: "The stamp has been successfully approved and published.",
        duration: 3000,
      })
    } catch (error) {
      console.error("Error approving stamp:", error)
      toast({
        title: "Approval Failed",
        description: error instanceof Error ? error.message : "Unable to approve stamp. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Handle save stamp changes
  const handleSaveStamp = async () => {
    if (!selectedStamp) return

    try {
      setIsUpdating(true)
      const updatedStamp = await updateStamp(selectedStamp.id, editFormData)

      // Update local state
      setStamps(prev => prev.map(stamp =>
        stamp.id === selectedStamp.id ? updatedStamp : stamp
      ))

      setIsEditModalOpen(false)
      setSelectedStamp(null)
      setEditFormData({})

      toast({
        title: "Stamp Updated",
        description: "The stamp details have been successfully updated.",
        duration: 3000,
      })
    } catch (error) {
      console.error("Error updating stamp:", error)
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Unable to update stamp. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Handle delete stamp
  const handleDeleteStamp = async () => {
    if (!selectedStamp) return

    try {
      setIsDeleting(true)
      await deleteStamp(selectedStamp.id)

      // Remove from local state
      setStamps(prev => prev.filter(stamp => stamp.id !== selectedStamp.id))

      setIsDeleteDialogOpen(false)
      setIsEditModalOpen(false)
      setSelectedStamp(null)
      setEditFormData({})

      toast({
        title: "Stamp Deleted",
        description: "The stamp has been successfully deleted.",
        duration: 3000,
      })
    } catch (error) {
      console.error("Error deleting stamp:", error)
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Unable to delete stamp. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Handle opening edit modal
  const handleEditStamp = (stamp: StampReviewItem) => {
    setSelectedStamp(stamp as unknown as EditableStampData)
    setEditFormData({ ...stamp } as unknown as Partial<EditableStampData>)
    setIsEditModalOpen(true)
  }

  // Filter stamps based on search and filters
  const filteredStamps = stamps.filter(stamp => {
    const matchesSearch =
      stamp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stamp.seriesName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stamp.catalogNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stamp.stampCatalogCode.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCountry = countryFilter === "all" || stamp.country === countryFilter
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "published" && stamp.isPublished) ||
      (statusFilter === "draft" && !stamp.isPublished)

    return matchesSearch && matchesCountry && matchesStatus
  })

  // Get unique countries for filter
  const countries = [...new Set(stamps.map(stamp => stamp.country))].sort()

  // Format denomination
  const formatDenomination = (value: number, symbol: string) => {
    return `${symbol}${value}`
  }

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage)
    loadStamps(newPage)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setPageNumber(1)
    loadStamps(1)
  }

  // Refresh data
  const refreshData = () => {
    loadStamps(pageNumber, true)
  }

  // Load data on component mount
  useEffect(() => {
    loadStamps(1)
  }, [])

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("")
    setCountryFilter("all")
    setStatusFilter("all")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Stamp Review</h1>
          <p className="text-muted-foreground">Review and approve stamps for publication</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Stamp Review Queue</CardTitle>
              <CardDescription>
                Review stamps extracted from catalogs and approve them for publication
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={pageSize.toString()} onValueChange={(value) => handlePageSizeChange(Number(value))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="25">25 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                  <SelectItem value="100">100 per page</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={refreshData}
                disabled={isLoading || isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search stamps by name, series, catalog number, or stamp code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" onClick={resetFilters}>
                Clear Filters
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Showing {filteredStamps.length} of {totalCount} stamps
              </span>
              <span>
                Page {pageNumber} of {totalPages}
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              <span>Loading stamps...</span>
            </div>
          ) : (
            <>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Actions</TableHead>
                      <TableHead className="min-w-[200px] max-w-[250px]">Stamp</TableHead>
                      <TableHead className="w-[120px]">Country</TableHead>
                      <TableHead className="w-[80px]">Year</TableHead>
                      <TableHead className="w-[120px]">Catalog Number</TableHead>
                      <TableHead className="w-[140px]">Stamp Code</TableHead>
                      <TableHead className="w-[100px]">Denomination</TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStamps.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          No stamps found matching your criteria.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStamps.map((stamp) => (
                        <TableRow key={stamp.id}>
                              <TableCell>
                                <div className="flex gap-1">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEditStamp(stamp)}
                                        title="View/Edit Stamp"
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    </DialogTrigger>
                                  </Dialog>

                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedStamp(stamp as unknown as EditableStampData)
                                      setIsDeleteDialogOpen(true)
                                    }}
                                    title="Delete Stamp"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                          <TableCell className="min-w-[200px] max-w-[250px]">
                            <div className="font-medium text-sm overflow-hidden text-ellipsis whitespace-nowrap pr-2" title={stamp.name}>
                              {stamp.name}
                            </div>
                          </TableCell>
                          <TableCell className="w-[120px]">
                            <div className="flex items-center gap-1 overflow-hidden">
                              <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                              <span className="overflow-hidden text-ellipsis whitespace-nowrap">{stamp.country}</span>
                            </div>
                          </TableCell>
                          <TableCell className="w-[80px]">
                            <div className="flex items-center gap-1 whitespace-nowrap">
                              <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                              <span>{stamp.issueYear}</span>
                            </div>
                          </TableCell>
                          <TableCell className="w-[120px]">
                            <div className="overflow-hidden text-ellipsis whitespace-nowrap" title={stamp.catalogNumber}>
                              <Badge variant="outline" className="font-mono text-xs max-w-full">
                                <span className="overflow-hidden text-ellipsis whitespace-nowrap">{stamp.catalogNumber}</span>
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="w-[140px]">
                            <div className="overflow-hidden text-ellipsis whitespace-nowrap" title={stamp.stampCatalogCode}>
                              <Badge className="font-mono text-xs max-w-full">
                                <span className="overflow-hidden text-ellipsis whitespace-nowrap">{stamp.stampCatalogCode}</span>
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium w-[100px] whitespace-nowrap">
                            {formatDenomination(stamp.denominationValue, stamp.denominationSymbol)}
                          </TableCell>
                          <TableCell className="w-[120px]">
                            {stamp.isPublished ? (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Published
                              </Badge>
                            ) : (
                              <Badge variant="outline">Draft</Badge>
                            )}
                          </TableCell>
                          <TableCell className="w-[100px]">
                            {!stamp.isPublished && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenPublishModal(stamp)}
                                disabled={isUpdating}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(1)}
                      disabled={pageNumber === 1 || totalPages <= 1}
                    >
                      <ChevronsLeft className="h-4 w-4 mr-1" />
                      First
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pageNumber - 1)}
                      disabled={pageNumber === 1 || totalPages <= 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                  </div>

                  <div className="flex items-center gap-1">
                    {totalPages > 1 && Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumberToShow
                      if (totalPages <= 5) {
                        pageNumberToShow = i + 1
                      } else if (pageNumber <= 3) {
                        pageNumberToShow = i + 1
                      } else if (pageNumber >= totalPages - 2) {
                        pageNumberToShow = totalPages - 4 + i
                      } else {
                        pageNumberToShow = pageNumber - 2 + i
                      }

                      return (
                        <Button
                          key={pageNumberToShow}
                          variant={pageNumber === pageNumberToShow ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNumberToShow)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNumberToShow}
                        </Button>
                      )
                    })}
                    {totalPages === 1 && (
                      <Button
                        variant="default"
                        size="sm"
                        className="w-8 h-8 p-0"
                        disabled
                      >
                        1
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pageNumber + 1)}
                      disabled={pageNumber === totalPages || totalPages <= 1}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(totalPages)}
                      disabled={pageNumber === totalPages || totalPages <= 1}
                    >
                      Last
                      <ChevronsRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Stamp Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Stamp Details
            </DialogTitle>
            <DialogDescription>
              Review and modify stamp information before approval
            </DialogDescription>
          </DialogHeader>

          {selectedStamp && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image */}
              <div className="space-y-4">
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  {selectedStamp.stampImageUrl ? (
                    <img
                      src={selectedStamp.stampImageUrl}
                      alt={selectedStamp.name}
                      className="max-w-full max-h-full object-contain rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-sm">No image available</p>
                    </div>
                  )}
                  <div className="hidden text-center text-muted-foreground">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm">Image not available</p>
                  </div>
                </div>
              </div>

              {/* All Fields Form - Single Continuous View */}
              <div className="max-h-[70vh] overflow-y-auto space-y-6">
                  {/* Basic Information */}
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="id">id</Label>
                        <Input
                          id="id"
                          value={editFormData.id || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, id: e.target.value }))}
                          disabled
                          className="bg-muted"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="catalogExtractionProcessId">catalogExtractionProcessId</Label>
                        <Input
                          id="catalogExtractionProcessId"
                          value={editFormData.catalogExtractionProcessId || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, catalogExtractionProcessId: e.target.value }))}
                          disabled={selectedStamp?.isPublished}
                          className={selectedStamp?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="similarityScore">similarityScore</Label>
                        <Input
                          id="similarityScore"
                          type="number"
                          step="0.01"
                          value={editFormData.similarityScore || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, similarityScore: Number(e.target.value) }))}
                          disabled={selectedStamp?.isPublished}
                          className={selectedStamp?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stampId">stampId</Label>
                        <Input
                          id="stampId"
                          value={editFormData.stampId || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, stampId: e.target.value }))}
                          disabled={selectedStamp?.isPublished}
                          className={selectedStamp?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="isInstance">isInstance</Label>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="isInstance"
                            checked={editFormData.isInstance || false}
                            onCheckedChange={(checked) => setEditFormData(prev => ({ ...prev, isInstance: checked as boolean }))}
                            disabled={selectedStamp?.isPublished}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="parentStampId">parentStampId</Label>
                        <Input
                          id="parentStampId"
                          value={editFormData.parentStampId || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, parentStampId: e.target.value }))}
                          disabled={selectedStamp?.isPublished}
                          className={selectedStamp?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="catalogNumber">catalogNumber</Label>
                        <Input
                          id="catalogNumber"
                          value={editFormData.catalogNumber || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, catalogNumber: e.target.value }))}
                          disabled={selectedStamp?.isPublished}
                          className={selectedStamp?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stampCode">stampCode</Label>
                        <Input
                          id="stampCode"
                          value={editFormData.stampCode || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, stampCode: e.target.value }))}
                          disabled={selectedStamp?.isPublished}
                          className={selectedStamp?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name">name</Label>
                        <Input
                          id="name"
                          value={editFormData.name || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                          disabled={selectedStamp?.isPublished}
                          className={selectedStamp?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">description</Label>
                        <Textarea
                          id="description"
                          value={editFormData.description || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                          rows={3}
                          disabled={selectedStamp?.isPublished}
                          className={selectedStamp?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Country & Geographic Information */}
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-4">Country & Geographic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="country">country</Label>
                        <Input
                          id="country"
                          value={editFormData.country || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, country: e.target.value }))}
                          disabled={selectedStamp?.isPublished}
                          className={selectedStamp?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="countryName">countryName</Label>
                        <Input
                          id="countryName"
                          value={editFormData.countryName || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, countryName: e.target.value }))}
                          disabled={selectedStamp?.isPublished}
                          className={selectedStamp?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="countryFlag">countryFlag</Label>
                        <Input
                          id="countryFlag"
                          value={editFormData.countryFlag || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, countryFlag: e.target.value }))}
                          disabled={selectedStamp?.isPublished}
                          className={selectedStamp?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="issueLocation">issueLocation</Label>
                        <Input
                          id="issueLocation"
                          value={editFormData.issueLocation || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, issueLocation: e.target.value }))}
                          disabled={selectedStamp?.isPublished}
                          className={selectedStamp?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Series & Classification */}
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-4">Series & Classification</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="seriesId">seriesId</Label>
                        <Input
                          id="seriesId"
                          value={editFormData.seriesId || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, seriesId: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="seriesName">seriesName</Label>
                        <Input
                          id="seriesName"
                          value={editFormData.seriesName || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, seriesName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="seriesDescription">seriesDescription</Label>
                        <Textarea
                          id="seriesDescription"
                          value={editFormData.seriesDescription || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, seriesDescription: e.target.value }))}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="typeId">typeId</Label>
                        <Input
                          id="typeId"
                          value={editFormData.typeId || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, typeId: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="typeName">typeName</Label>
                        <Input
                          id="typeName"
                          value={editFormData.typeName || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, typeName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="typeDescription">typeDescription</Label>
                        <Textarea
                          id="typeDescription"
                          value={editFormData.typeDescription || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, typeDescription: e.target.value }))}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stampGroupId">stampGroupId</Label>
                        <Input
                          id="stampGroupId"
                          value={editFormData.stampGroupId || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, stampGroupId: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stampGroupName">stampGroupName</Label>
                        <Input
                          id="stampGroupName"
                          value={editFormData.stampGroupName || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, stampGroupName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stampGroupDescription">stampGroupDescription</Label>
                        <Textarea
                          id="stampGroupDescription"
                          value={editFormData.stampGroupDescription || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, stampGroupDescription: e.target.value }))}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="releaseId">releaseId</Label>
                        <Input
                          id="releaseId"
                          value={editFormData.releaseId || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, releaseId: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="releaseName">releaseName</Label>
                        <Input
                          id="releaseName"
                          value={editFormData.releaseName || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, releaseName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="releaseDateRange">releaseDateRange</Label>
                        <Input
                          id="releaseDateRange"
                          value={editFormData.releaseDateRange || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, releaseDateRange: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="releaseDescription">releaseDescription</Label>
                        <Textarea
                          id="releaseDescription"
                          value={editFormData.releaseDescription || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, releaseDescription: e.target.value }))}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="categoryId">categoryId</Label>
                        <Input
                          id="categoryId"
                          value={editFormData.categoryId || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="categoryName">categoryName</Label>
                        <Input
                          id="categoryName"
                          value={editFormData.categoryName || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, categoryName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="categoryCode">categoryCode</Label>
                        <Input
                          id="categoryCode"
                          value={editFormData.categoryCode || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, categoryCode: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="categoryDescription">categoryDescription</Label>
                        <Textarea
                          id="categoryDescription"
                          value={editFormData.categoryDescription || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, categoryDescription: e.target.value }))}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paperTypeId">paperTypeId</Label>
                        <Input
                          id="paperTypeId"
                          value={editFormData.paperTypeId || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, paperTypeId: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paperTypeName">paperTypeName</Label>
                        <Input
                          id="paperTypeName"
                          value={editFormData.paperTypeName || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, paperTypeName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paperTypeCode">paperTypeCode</Label>
                        <Input
                          id="paperTypeCode"
                          value={editFormData.paperTypeCode || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, paperTypeCode: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paperTypeDescription">paperTypeDescription</Label>
                        <Textarea
                          id="paperTypeDescription"
                          value={editFormData.paperTypeDescription || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, paperTypeDescription: e.target.value }))}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="itemTypeCode">itemTypeCode</Label>
                        <Input
                          id="itemTypeCode"
                          value={editFormData.itemTypeCode || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, itemTypeCode: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="itemTypeName">itemTypeName</Label>
                        <Input
                          id="itemTypeName"
                          value={editFormData.itemTypeName || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, itemTypeName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="itemTypeDescription">itemTypeDescription</Label>
                        <Textarea
                          id="itemTypeDescription"
                          value={editFormData.itemTypeDescription || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, itemTypeDescription: e.target.value }))}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="itemFormat">itemFormat</Label>
                        <Input
                          id="itemFormat"
                          value={editFormData.itemFormat || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, itemFormat: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Currency & Denomination */}
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-4">Currency & Denomination</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currencyCode">currencyCode</Label>
                        <Input
                          id="currencyCode"
                          value={editFormData.currencyCode || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, currencyCode: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currencyName">currencyName</Label>
                        <Input
                          id="currencyName"
                          value={editFormData.currencyName || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, currencyName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currencySymbol">currencySymbol</Label>
                        <Input
                          id="currencySymbol"
                          value={editFormData.currencySymbol || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, currencySymbol: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currencyDescription">currencyDescription</Label>
                        <Textarea
                          id="currencyDescription"
                          value={editFormData.currencyDescription || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, currencyDescription: e.target.value }))}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="denominationValue">denominationValue</Label>
                        <Input
                          id="denominationValue"
                          value={editFormData.denominationValue || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, denominationValue: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="denominationSymbol">denominationSymbol</Label>
                        <Input
                          id="denominationSymbol"
                          value={editFormData.denominationSymbol || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, denominationSymbol: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="denominationDisplay">denominationDisplay</Label>
                        <Input
                          id="denominationDisplay"
                          value={editFormData.denominationDisplay || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, denominationDisplay: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="denominationDescription">denominationDescription</Label>
                        <Textarea
                          id="denominationDescription"
                          value={editFormData.denominationDescription || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, denominationDescription: e.target.value }))}
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Physical Characteristics */}
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-4">Physical Characteristics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="colorCode">colorCode</Label>
                        <Input
                          id="colorCode"
                          value={editFormData.colorCode || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, colorCode: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="colorName">colorName</Label>
                        <Input
                          id="colorName"
                          value={editFormData.colorName || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, colorName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="colorHex">colorHex</Label>
                        <Input
                          id="colorHex"
                          value={editFormData.colorHex || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, colorHex: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="colorDescription">colorDescription</Label>
                        <Textarea
                          id="colorDescription"
                          value={editFormData.colorDescription || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, colorDescription: e.target.value }))}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="colorVariant">colorVariant</Label>
                        <Input
                          id="colorVariant"
                          value={editFormData.colorVariant || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, colorVariant: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paperCode">paperCode</Label>
                        <Input
                          id="paperCode"
                          value={editFormData.paperCode || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, paperCode: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paperName">paperName</Label>
                        <Input
                          id="paperName"
                          value={editFormData.paperName || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, paperName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paperDescription">paperDescription</Label>
                        <Textarea
                          id="paperDescription"
                          value={editFormData.paperDescription || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, paperDescription: e.target.value }))}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paperFiber">paperFiber</Label>
                        <Input
                          id="paperFiber"
                          value={editFormData.paperFiber || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, paperFiber: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paperThickness">paperThickness</Label>
                        <Input
                          id="paperThickness"
                          value={editFormData.paperThickness || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, paperThickness: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paperOpacity">paperOpacity</Label>
                        <Input
                          id="paperOpacity"
                          value={editFormData.paperOpacity || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, paperOpacity: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="watermarkCode">watermarkCode</Label>
                        <Input
                          id="watermarkCode"
                          value={editFormData.watermarkCode || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, watermarkCode: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="watermarkName">watermarkName</Label>
                        <Input
                          id="watermarkName"
                          value={editFormData.watermarkName || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, watermarkName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="watermarkDescription">watermarkDescription</Label>
                        <Textarea
                          id="watermarkDescription"
                          value={editFormData.watermarkDescription || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, watermarkDescription: e.target.value }))}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="watermarkPosition">watermarkPosition</Label>
                        <Input
                          id="watermarkPosition"
                          value={editFormData.watermarkPosition || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, watermarkPosition: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="watermarkClarity">watermarkClarity</Label>
                        <Input
                          id="watermarkClarity"
                          value={editFormData.watermarkClarity || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, watermarkClarity: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="perforationCode">perforationCode</Label>
                        <Input
                          id="perforationCode"
                          value={editFormData.perforationCode || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, perforationCode: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="perforationName">perforationName</Label>
                        <Input
                          id="perforationName"
                          value={editFormData.perforationName || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, perforationName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="perforationMeasurement">perforationMeasurement</Label>
                        <Input
                          id="perforationMeasurement"
                          value={editFormData.perforationMeasurement || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, perforationMeasurement: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="perforationGauge">perforationGauge</Label>
                        <Input
                          id="perforationGauge"
                          value={editFormData.perforationGauge || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, perforationGauge: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="perforationCleanCut">perforationCleanCut</Label>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="perforationCleanCut"
                            checked={editFormData.perforationCleanCut || false}
                            onCheckedChange={(checked) => setEditFormData(prev => ({ ...prev, perforationCleanCut: checked as boolean }))}
                            disabled={selectedStamp?.isPublished}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="perforationComb">perforationComb</Label>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="perforationComb"
                            checked={editFormData.perforationComb || false}
                            onCheckedChange={(checked) => setEditFormData(prev => ({ ...prev, perforationComb: checked as boolean }))}
                            disabled={selectedStamp?.isPublished}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Issue & Date Information */}
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-4">Issue & Date Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="issueDate">issueDate</Label>
                        <Input
                          id="issueDate"
                          value={editFormData.issueDate || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, issueDate: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="issueYear">issueYear</Label>
                        <Input
                          id="issueYear"
                          type="number"
                          value={editFormData.issueYear || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, issueYear: Number(e.target.value) }))}
                          disabled={selectedStamp?.isPublished}
                          className={selectedStamp?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="issueMonth">issueMonth</Label>
                        <Input
                          id="issueMonth"
                          type="number"
                          value={editFormData.issueMonth || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, issueMonth: Number(e.target.value) }))}
                          disabled={selectedStamp?.isPublished}
                          className={selectedStamp?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="issueDay">issueDay</Label>
                        <Input
                          id="issueDay"
                          type="number"
                          value={editFormData.issueDay || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, issueDay: Number(e.target.value) }))}
                          disabled={selectedStamp?.isPublished}
                          className={selectedStamp?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="firstDayIssue">firstDayIssue</Label>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="firstDayIssue"
                            checked={editFormData.firstDayIssue || false}
                            onCheckedChange={(checked) => setEditFormData(prev => ({ ...prev, firstDayIssue: checked as boolean }))}
                            disabled={selectedStamp?.isPublished}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="periodStart">periodStart</Label>
                        <Input
                          id="periodStart"
                          type="number"
                          value={editFormData.periodStart || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, periodStart: Number(e.target.value) }))}
                          disabled={selectedStamp?.isPublished}
                          className={selectedStamp?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="periodEnd">periodEnd</Label>
                        <Input
                          id="periodEnd"
                          type="number"
                          value={editFormData.periodEnd || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, periodEnd: Number(e.target.value) }))}
                          disabled={selectedStamp?.isPublished}
                          className={selectedStamp?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="issuePurpose">issuePurpose</Label>
                        <Input
                          id="issuePurpose"
                          value={editFormData.issuePurpose || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, issuePurpose: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="issueContext">issueContext</Label>
                        <Textarea
                          id="issueContext"
                          value={editFormData.issueContext || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, issueContext: e.target.value }))}
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Technical & JSON Data */}
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-4">Technical & JSON Data</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="stampVectorJson">stampVectorJson</Label>
                        <Textarea
                          id="stampVectorJson"
                          value={editFormData.stampVectorJson || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, stampVectorJson: e.target.value }))}
                          rows={6}
                          className="font-mono text-xs"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stampDetailsJson">stampDetailsJson</Label>
                        <Textarea
                          id="stampDetailsJson"
                          value={editFormData.stampDetailsJson || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, stampDetailsJson: e.target.value }))}
                          rows={6}
                          className="font-mono text-xs"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="alternativeNames">alternativeNames</Label>
                        <Textarea
                          id="alternativeNames"
                          value={editFormData.alternativeNames || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, alternativeNames: e.target.value }))}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="plateFlaws">plateFlaws</Label>
                        <Textarea
                          id="plateFlaws"
                          value={editFormData.plateFlaws || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, plateFlaws: e.target.value }))}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="recentSales">recentSales</Label>
                        <Textarea
                          id="recentSales"
                          value={editFormData.recentSales || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, recentSales: e.target.value }))}
                          rows={4}
                          className="font-mono text-xs"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stampImageVariants">stampImageVariants (JSON Array)</Label>
                        <Textarea
                          id="stampImageVariants"
                          value={editFormData.stampImageVariants ? JSON.stringify(editFormData.stampImageVariants, null, 2) : ""}
                          onChange={(e) => {
                            try {
                              const parsed = JSON.parse(e.target.value || "[]");
                              setEditFormData(prev => ({ ...prev, stampImageVariants: Array.isArray(parsed) ? parsed : [] }));
                            } catch {
                              // Invalid JSON, keep as string for now
                              setEditFormData(prev => ({ ...prev, stampImageVariants: [] }));
                            }
                          }}
                          rows={4}
                          className="font-mono text-xs"
                          placeholder="Enter JSON array of image variants"
                        />
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          )}

          <div className="flex justify-between gap-2 mt-6">
            <Button
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={isUpdating || selectedStamp?.isPublished}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Stamp
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                disabled={isUpdating}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSaveStamp}
                disabled={isUpdating || selectedStamp?.isPublished}
              >
                {isUpdating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Stamp
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this stamp? This action cannot be undone.
              <br />
              <br />
              <strong>Stamp:</strong> {selectedStamp?.name}
              <br />
              <strong>Catalog Number:</strong> {selectedStamp?.catalogNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteStamp}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Stamp
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Publish Notes Modal */}
      <Dialog open={isPublishModalOpen} onOpenChange={setIsPublishModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Approve Stamp for Publication
            </DialogTitle>
            <DialogDescription>
              Please provide publish notes before approving this stamp for publication.
              <br />
              <br />
              <strong>Stamp:</strong> {stampToApprove?.name}
              <br />
              <strong>Catalog Number:</strong> {stampToApprove?.catalogNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="publishNotes" className="text-sm font-medium">
                Publish Notes <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="publishNotes"
                value={publishNotes}
                onChange={(e) => setPublishNotes(e.target.value)}
                placeholder="Enter notes about why this stamp is being approved for publication..."
                rows={4}
                className="resize-none"
                required
              />
              <p className="text-xs text-muted-foreground">
                These notes will be saved with the stamp approval and cannot be changed later.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setIsPublishModalOpen(false)
                setStampToApprove(null)
                setPublishNotes("")
              }}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApproveStamp}
              disabled={isUpdating || !publishNotes.trim()}
            >
              {isUpdating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Approve Stamp
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
