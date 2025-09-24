"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, ChevronLeft, ChevronRight, Loader2, Edit, AlertCircle, RefreshCw, X } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import StampEditForm from "./stamp-edit-form"

interface StampData {
  id: string
  stampCode: string
  status: number
  userId: string
  stampCatalogId: string | null
  name: string
  publisher: string
  country: string
  stampImageUrl: string
  catalogName: string | null
  catalogNumber: string
  seriesName: string
  issueDate: string
  issueYear: number | null
  denominationValue: number
  denominationCurrency: string
  denominationSymbol: string
  color: string
  paperType: string | null
  stampDetailsJson: string
  estimatedMarketValue: number | null
  actualPrice: number | null
}

interface StampsResponse {
  items: StampData[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

interface ParsedStampDetails {
  country?: string
  issueDate?: string
  denomination?: string
  condition?: string
  designer?: string
  printer?: string
  catalogueNumber?: string
  rarityscale?: string
  colorType?: string
  paperType?: string
  watermarkPresence?: string
  perfType?: string
  printMethod?: string
}

export default function ProfileCollection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [countryFilter, setCountryFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedStamp, setSelectedStamp] = useState<StampData | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  
  // API state
  const [stamps, setStamps] = useState<StampData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [hasPreviousPage, setHasPreviousPage] = useState(false)

  // Parse stamp details JSON to extract relevant information for display
  const parseStampDetails = (stampDetailsJson: string): ParsedStampDetails => {
    try {
      const details = JSON.parse(stampDetailsJson)
      const parsed: ParsedStampDetails = {}

      const findValueByKey = (obj: Record<string, any>, targetKey: string): string => {
        if (Array.isArray(obj)) {
          for (const item of obj) {
            const result = findValueByKey(item, targetKey)
            if (result) return result
          }
        } else if (typeof obj === 'object' && obj !== null) {
          if (obj.key === targetKey && obj.value) {
            return obj.value
          }
          if (obj.children) {
            const result = findValueByKey(obj.children, targetKey)
            if (result) return result
          }
          for (const value of Object.values(obj)) {
            const result = findValueByKey(value, targetKey)
            if (result) return result
          }
        }
        return ""
      }

      // Extract key information
      parsed.country = findValueByKey(details, "country")
      parsed.issueDate = findValueByKey(details, "issuedate")
      parsed.denomination = findValueByKey(details, "denomination")
      parsed.condition = findValueByKey(details, "condition")
      parsed.designer = findValueByKey(details, "designer")
      parsed.printer = findValueByKey(details, "printer")
      parsed.catalogueNumber = findValueByKey(details, "cataloguenumber")
      parsed.rarityscale = findValueByKey(details, "rarityscale")
      parsed.colorType = findValueByKey(details, "colortype")
      parsed.paperType = findValueByKey(details, "papertype")
      parsed.watermarkPresence = findValueByKey(details, "watermarkpresence")
      parsed.perfType = findValueByKey(details, "perftype")
      parsed.printMethod = findValueByKey(details, "printmethod")

      return parsed
    } catch (error) {
      console.error('Error parsing stamp details:', error)
      return {}
    }
  }

  // Fetch stamps from API
  const fetchStamps = async (page: number = 1, _search: string = "", _country: string = "all", pageSize: number = itemsPerPage) => {
    setLoading(true)
    setError(null)

    try {
      const userDataStr = localStorage.getItem('stamp_user_data')
      if (!userDataStr) {
        throw new Error('No user data found. Please log in again.')
      }
      
      const userData = JSON.parse(userDataStr)
      const jwt = userData.jwt

      const url = new URL('https://decoded-app-stamp-api-prod-01.azurewebsites.net/api/v1/Stamp')
      url.searchParams.append('pageNumber', page.toString())
      url.searchParams.append('pageSize', pageSize.toString())
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      })

      // Handle 204 No Content as a valid empty response
      if (response.status === 204) {
        const emptyData: StampsResponse = {
          items: [],
          pageNumber: 1,
          pageSize: itemsPerPage,
          totalCount: 0,
          totalPages: 0,
          hasPreviousPage: false,
          hasNextPage: false
        }
        
        setStamps(emptyData.items)
        setTotalCount(emptyData.totalCount)
        setTotalPages(emptyData.totalPages)
        setHasNextPage(emptyData.hasNextPage)
        setHasPreviousPage(emptyData.hasPreviousPage)
        setCurrentPage(emptyData.pageNumber)
        return
      }

      if (!response.ok) {
        // Handle specific HTTP status codes with user-friendly messages
        if (response.status === 401) {
          throw new Error('Your session has expired. Please log in again.')
        } else if (response.status === 403) {
          throw new Error('You do not have permission to access this collection.')
        } else if (response.status === 404) {
          throw new Error('Collection not found.')
        } else if (response.status >= 500) {
          throw new Error('Server is currently unavailable. Please try again later.')
        } else {
          throw new Error(`Unable to load collection. Please try again.`)
        }
      }

      // Check if response has content before parsing as JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Received invalid response from server. Please try again.')
      }

      const responseText = await response.text()
      
      let data: StampsResponse
      try {
        // Handle empty response as valid (might indicate no stamps)
        if (!responseText.trim()) {
          data = {
            items: [],
            pageNumber: 1,
            pageSize: itemsPerPage,
            totalCount: 0,
            totalPages: 0,
            hasPreviousPage: false,
            hasNextPage: false
          }
        } else {
          data = JSON.parse(responseText)
        }
      } catch {
        throw new Error('Unable to process server response. Please try again.')
      }
      
      // Validate response structure
      if (!data || typeof data !== 'object' || !Array.isArray(data.items)) {
        throw new Error('Received invalid response format from server. Please try again.')
      }
      
      setStamps(data.items)
      setTotalCount(data.totalCount)
      setTotalPages(data.totalPages)
      setHasNextPage(data.hasNextPage)
      setHasPreviousPage(data.hasPreviousPage)
      setCurrentPage(data.pageNumber)
      
    } catch (error) {
      console.error('Error fetching stamps:', error)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unexpected error occurred while loading your collection.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchStamps(1, searchTerm, countryFilter, itemsPerPage)
  }, [itemsPerPage])

  // Prevent body scroll when edit dialog is open
  useEffect(() => {
    if (isEditDialogOpen) {
      document.body.style.overflow = 'hidden'
      
      // Add escape key handler
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsEditDialogOpen(false)
        }
      }
      
      document.addEventListener('keydown', handleEscape)
      
      return () => {
        document.body.style.overflow = 'unset'
        document.removeEventListener('keydown', handleEscape)
      }
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isEditDialogOpen])

  // Handle page change
  const handlePageChange = (page: number) => {
    fetchStamps(page, searchTerm, countryFilter, itemsPerPage)
  }

  // Handle search
  const handleSearch = () => {
    fetchStamps(1, searchTerm, countryFilter, itemsPerPage)
  }

  // Handle filter change
  const handleCountryFilter = (country: string) => {
    setCountryFilter(country)
    fetchStamps(1, searchTerm, country, itemsPerPage)
  }

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1) // Reset to first page when changing items per page
  }

  // Generate visible page numbers with ellipsis for mobile
  const getVisiblePages = () => {
    const delta = 2 // Number of pages to show on each side of current page
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else {
      if (totalPages > 1) rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  // Get filtered stamps based on search and country filter
  const filteredStamps = stamps.filter((stamp) => {
    // For the new API structure, we can search directly in the response fields
    const matchesSearch = searchTerm === "" || 
      stamp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stamp.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${stamp.denominationValue}${stamp.denominationSymbol}`.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCountry = countryFilter === "all" || stamp.country === countryFilter

    return matchesSearch && matchesCountry
  })

  // Get unique countries for filter - use the country field directly from API response
  const countries = ["all", ...Array.from(new Set(stamps.map(stamp => stamp.country).filter((country): country is string => Boolean(country))))]



  // Handle viewing stamp details
  const handleViewDetails = (stamp: StampData) => {
    setSelectedStamp(stamp)
    setIsDetailsDialogOpen(true)
  }

  // Handle editing a stamp
  const handleEditStamp = (stamp: StampData) => {
    setSelectedStamp(stamp)
    setIsEditDialogOpen(true)
  }

  // Handle save from edit form
  const handleSaveStamp = async (updatedStamp: StampData) => {
    try {
      // Update local state with the updated stamp
      setStamps(prev => prev.map(stamp => 
        stamp.id === updatedStamp.id ? updatedStamp : stamp
      ))

      // Close edit dialog
      setIsEditDialogOpen(false)
      setSelectedStamp(null)

    } catch (error) {
      console.error('Error updating stamp:', error)
      // You could add error handling UI here if needed
    }
  }

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString()
    } catch {
      return dateString
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading your collection...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-2 w-full flex-col md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 text-muted-foreground" />
              <Input
                placeholder="Search stamps..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>

            <Select value={countryFilter} onValueChange={handleCountryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country === "all" ? "All Countries" : country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={handleSearch} variant="outline">
              Search
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center py-8">
          <div className="text-center space-y-3 p-6 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-slate-700">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium">{error}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => fetchStamps(currentPage, searchTerm, countryFilter, itemsPerPage)}
              className="text-xs hover:bg-slate-100"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex gap-2 w-full flex-col md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stamps..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          <Select value={countryFilter} onValueChange={handleCountryFilter}>
            <SelectTrigger className="md:w-[150px]">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country === "all" ? "All Countries" : country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleSearch} variant="outline">
            Search
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-medium">Your Stamps</h2>
          <p className="text-sm text-muted-foreground">{totalCount} stamps in collection</p>
        </div>
        <Link href="/scan">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add New Stamp
          </Button>
        </Link>
      </div>

      {renderStampsList(filteredStamps)}

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-slate-200 pt-6">
          {/* Pagination Info */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-sm text-slate-600">
              <span>
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} stamps
              </span>
              
              {/* Items per page selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs">Show:</span>
                <Select value={itemsPerPage.toString()} onValueChange={(value) => handleItemsPerPageChange(Number(value))}>
                  <SelectTrigger className="w-20 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6</SelectItem>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="24">24</SelectItem>
                    <SelectItem value="48">48</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-xs">per page</span>
              </div>
            </div>

            {/* Quick jump */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-600">Jump to:</span>
              <Select value={currentPage.toString()} onValueChange={(value) => handlePageChange(Number(value))}>
                <SelectTrigger className="w-20 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <SelectItem key={page} value={page.toString()}>
                      {page}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-slate-600">of {totalPages}</span>
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center">
            <div className="flex items-center gap-1">
              {/* First page button (desktop only) */}
          <Button
            variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1 || loading}
                className="hidden sm:flex text-xs px-2"
              >
                First
          </Button>

              {/* Previous button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!hasPreviousPage || loading}
                className="text-xs px-2"
              >
                <ChevronLeft className="h-3 w-3 sm:mr-1" />
                <span className="hidden sm:inline">Prev</span>
              </Button>

              {/* Page numbers */}
              <div className="flex items-center gap-1 mx-2">
                {getVisiblePages().map((page, index) => (
                  <div key={index}>
                    {page === '...' ? (
                      <span className="px-2 py-1 text-slate-500 text-xs">…</span>
                    ) : (
                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        className={`w-8 h-8 text-xs ${
                          currentPage === page 
                            ? "bg-[#f4831f] hover:bg-[#e67317] text-white border-[#f4831f]" 
                            : "hover:bg-slate-50"
                        }`}
                        onClick={() => handlePageChange(page as number)}
                        disabled={loading}
                      >
                        {page}
                      </Button>
                    )}
                  </div>
            ))}
          </div>

              {/* Next button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasNextPage || loading}
                className="text-xs px-2"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-3 w-3 sm:ml-1" />
              </Button>

              {/* Last page button (desktop only) */}
          <Button
            variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || loading}
                className="hidden sm:flex text-xs px-2"
              >
                Last
          </Button>
            </div>
          </div>

          {/* Mobile pagination summary */}
          <div className="sm:hidden text-center mt-3 text-xs text-slate-500">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      )}

      {/* Delete Stamp Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          {selectedStamp && (
            <>
              <DialogHeader>
                <DialogTitle>Delete Stamp</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this stamp from your collection? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-[100px_1fr] gap-4 py-4">
                <div>
                  <img
                    src={selectedStamp.stampImageUrl || "/placeholder.svg"}
                    alt={selectedStamp.name}
                    className="w-full rounded-md object-cover aspect-square"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{selectedStamp.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedStamp.country && `${selectedStamp.country}, `}
                    {selectedStamp.issueYear && selectedStamp.issueYear}
                    {selectedStamp.denominationValue && ` • ${selectedStamp.denominationValue}${selectedStamp.denominationSymbol}`}
                  </p>
                  {selectedStamp.catalogNumber && (
                    <p className="text-sm text-muted-foreground">Catalog: {selectedStamp.catalogNumber}</p>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(false)}>
                  Delete Stamp
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit with StampEditForm */}
      {isEditDialogOpen && selectedStamp && (
        <div 
          className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center p-2 sm:p-4"
          style={{
            background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            margin: '0',
            height: '100vh',
            width: '100vw'
          }}
          onClick={(e) => {
            // Close dialog when clicking on backdrop
            if (e.target === e.currentTarget) {
              setIsEditDialogOpen(false)
            }
          }}
        >
          <div className="w-full max-w-5xl h-[95vh] bg-background/95 backdrop-blur-sm border border-border/50 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300 m-0">
            <StampEditForm
              stamp={selectedStamp}
              onClose={() => setIsEditDialogOpen(false)}
              onSave={handleSaveStamp}
            />
          </div>
        </div>
      )}

      {/* Stamp Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden p-0 bg-gradient-to-br from-background to-muted/20 border-2 border-border/50 shadow-2xl">
          {selectedStamp && (() => {
            const parsedDetails = parseStampDetails(selectedStamp.stampDetailsJson || '{}')
            
            return (
              <>
                <div className="relative">
                  {/* Header with gradient background */}
                  <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b border-border/50">
                    <DialogHeader className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 pr-4">
                          <DialogTitle className="text-2xl font-semibold text-foreground/90 line-clamp-2">
                            {selectedStamp.name}
                          </DialogTitle>
                          <DialogDescription className="text-base text-muted-foreground/80 flex items-center gap-2 mt-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary/60"></div>
                            {selectedStamp.country && `${selectedStamp.country}`}
                            {selectedStamp.issueYear && ` • ${selectedStamp.issueYear}`}
                            {selectedStamp.stampCode && (
                              <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                                {selectedStamp.stampCode}
                              </span>
                            )}
                          </DialogDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-10 w-10 p-0 hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors duration-200 flex-shrink-0"
                          onClick={() => setIsDetailsDialogOpen(false)}
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                    </DialogHeader>
                  </div>

                  {/* Scrollable content area */}
                  <div className="overflow-y-auto max-h-[calc(95vh-120px)] pb-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
                      {/* Image Section */}
                      <div className="space-y-4">
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <img
                            src={selectedStamp.stampImageUrl || "/placeholder.svg"}
                            alt={selectedStamp.name}
                            className="w-full max-w-sm mx-auto rounded-xl object-contain shadow-lg border border-border/50 h-64 sm:h-72 lg:h-80 bg-muted/20"
                          />
                          <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium">
                            {selectedStamp.denominationValue && `${selectedStamp.denominationValue}${selectedStamp.denominationSymbol}`}
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 p-4 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
                            <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Issue Year</div>
                            <div className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                              {selectedStamp.issueYear || 'Unknown'}
                            </div>
                          </div>
                          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30 p-4 rounded-lg border border-green-200/50 dark:border-green-800/50">
                            <div className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">Status</div>
                            <div className="text-lg font-semibold text-green-900 dark:text-green-100">
                              {selectedStamp.status === 1 ? 'Active' : selectedStamp.status === 0 ? 'Draft' : 'Unknown'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Details Section */}
                      <div className="space-y-6">
                        {/* Basic Information */}
                        <div className="bg-gradient-to-br from-background to-muted/20 p-5 rounded-xl border border-border/50 shadow-sm">
                          <h3 className="text-lg font-semibold text-foreground/90 mb-4 flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                            Basic Information
                          </h3>
                          <div className="grid grid-cols-1 gap-4">
                            {[
                              { label: 'Publisher', value: selectedStamp.publisher },
                              { label: 'Series', value: selectedStamp.seriesName },
                              { label: 'Catalog Name', value: selectedStamp.catalogName },
                              { label: 'Catalog Number', value: selectedStamp.catalogNumber },
                              { label: 'Country', value: selectedStamp.country },
                              { label: 'Issue Year', value: selectedStamp.issueYear }
                            ].filter(item => item.value).map((item, index) => (
                              <div key={index} className="flex justify-between items-center py-2 border-b border-border/30 last:border-b-0">
                                <span className="text-sm font-medium text-muted-foreground">{item.label}:</span>
                                <span className="text-sm font-medium text-foreground/90 text-right">{item.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Denomination & Value */}
                        <div className="bg-gradient-to-br from-background to-muted/20 p-5 rounded-xl border border-border/50 shadow-sm">
                          <h3 className="text-lg font-semibold text-foreground/90 mb-4 flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                            Denomination & Value
                          </h3>
                          <div className="grid grid-cols-1 gap-4">
                            {[
                              { label: 'Face Value', value: selectedStamp.denominationValue ? `${selectedStamp.denominationValue}${selectedStamp.denominationSymbol}` : null },
                              { label: 'Currency', value: selectedStamp.denominationCurrency },
                              { label: 'Estimated Market Value', value: selectedStamp.estimatedMarketValue ? `$${selectedStamp.estimatedMarketValue}` : null },
                              { label: 'Actual Price', value: selectedStamp.actualPrice ? `$${selectedStamp.actualPrice}` : null }
                            ].filter(item => item.value).map((item, index) => (
                              <div key={index} className="flex justify-between items-center py-2 border-b border-border/30 last:border-b-0">
                                <span className="text-sm font-medium text-muted-foreground">{item.label}:</span>
                                <span className="text-sm font-semibold text-foreground/90 text-right">{item.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Physical Characteristics */}
                        <div className="bg-gradient-to-br from-background to-muted/20 p-5 rounded-xl border border-border/50 shadow-sm">
                          <h3 className="text-lg font-semibold text-foreground/90 mb-4 flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                            Physical Characteristics
                          </h3>
                          <div className="grid grid-cols-1 gap-4">
                            {[
                              { label: 'Color', value: selectedStamp.color },
                              { label: 'Paper Type', value: selectedStamp.paperType },
                              { label: 'Color Type', value: parsedDetails.colorType },
                              { label: 'Paper Type (Detailed)', value: parsedDetails.paperType },
                              { label: 'Watermark', value: parsedDetails.watermarkPresence },
                              { label: 'Perforation Type', value: parsedDetails.perfType },
                              { label: 'Print Method', value: parsedDetails.printMethod }
                            ].filter(item => item.value).map((item, index) => (
                              <div key={index} className="flex justify-between items-center py-2 border-b border-border/30 last:border-b-0">
                                <span className="text-sm font-medium text-muted-foreground">{item.label}:</span>
                                <span className="text-sm font-medium text-foreground/90 text-right">{item.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Additional Details from Parsed JSON */}
                        {Object.keys(parsedDetails).length > 0 && (
                          <div className="bg-gradient-to-br from-background to-muted/20 p-5 rounded-xl border border-border/50 shadow-sm">
                            <h3 className="text-lg font-semibold text-foreground/90 mb-4 flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                              Additional Details
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                              {[
                                { label: 'Condition', value: parsedDetails.condition },
                                { label: 'Designer', value: parsedDetails.designer },
                                { label: 'Printer', value: parsedDetails.printer },
                                { label: 'Rarity Scale', value: parsedDetails.rarityscale }
                              ].filter(item => item.value).map((item, index) => (
                                <div key={index} className="flex justify-between items-center py-2 border-b border-border/30 last:border-b-0">
                                  <span className="text-sm font-medium text-muted-foreground">{item.label}:</span>
                                  <span className="text-sm font-medium text-foreground/90 text-right">{item.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Technical Information */}
                        <div className="bg-gradient-to-br from-background to-muted/20 p-5 rounded-xl border border-border/50 shadow-sm">
                          <h3 className="text-lg font-semibold text-foreground/90 mb-4 flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-red-500"></div>
                            Technical Information
                          </h3>
                          <div className="grid grid-cols-1 gap-4">
                            {[
                              { label: 'Stamp ID', value: selectedStamp.id },
                              { label: 'User ID', value: selectedStamp.userId },
                              { label: 'Catalog ID', value: selectedStamp.stampCatalogId }
                            ].filter(item => item.value).map((item, index) => (
                              <div key={index} className="flex justify-between items-center py-2 border-b border-border/30 last:border-b-0">
                                <span className="text-sm font-medium text-muted-foreground">{item.label}:</span>
                                <span className="text-xs font-mono text-foreground/70 text-right break-all">{item.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )

  function renderStampsList(stamps: StampData[]) {
    if (stamps.length === 0) {
      // Check if this is due to filters or genuinely no stamps in collection
      const hasActiveFilters = searchTerm !== "" || countryFilter !== "all"
      const isEmptyCollection = totalCount === 0 && !hasActiveFilters
      
      if (isEmptyCollection) {
        return (
          <div className="text-center py-16 bg-gradient-to-br from-muted/30 to-muted/60 rounded-lg">
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <Plus className="h-12 w-12 text-primary/60" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Start Your Collection</h3>
                <p className="text-muted-foreground mb-6">
                  You haven&apos;t added any stamps to your collection yet. Start by scanning or adding your first stamp!
                </p>
              </div>
              <Link href="/scan">
                <Button className="gap-2" size="lg">
                  <Plus className="h-4 w-4" /> Add Your First Stamp
                </Button>
              </Link>
            </div>
          </div>
        )
      } else {
        return (
          <div className="text-center py-12 bg-muted/50 rounded-lg">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No Stamps Found</h3>
              <p className="text-muted-foreground mb-4">
                No stamps match your current search criteria. Try adjusting your filters or search terms.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setCountryFilter("all")
                  fetchStamps(1, "", "all", itemsPerPage)
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )
      }
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {stamps.map((stamp) => {
          return (
          <Card key={stamp.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="aspect-square relative bg-gradient-to-br from-muted/30 to-muted/60 p-4">
              <img
                  src={stamp.stampImageUrl || "/placeholder.svg"}
                  alt={stamp.name}
                className="object-contain w-full h-full rounded-md"
              />
            </div>
            <CardContent className="p-4">
                <h3 className="font-medium line-clamp-2 min-h-[2.5rem]">{stamp.name}</h3>
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>{stamp.country || "Unknown"}</span>
                  <span>{stamp.issueYear ? stamp.issueYear : "Unknown"}</span>
              </div>
              <div className="mt-2 flex justify-between items-center">
                  {stamp.denominationValue && (
                <span
                  className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-md"
                  title="Stamp denomination (face value)"
                >
                      {stamp.denominationValue}{stamp.denominationSymbol}
                    </span>
                  )}
              </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditStamp(stamp)}>
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleViewDetails(stamp)}>
                  Details
                </Button>
              </div>
            </CardContent>
          </Card>
          )
        })}
      </div>
    )
  }
}
