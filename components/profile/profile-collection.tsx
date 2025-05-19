"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Grid3X3, List, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Sample stamps data
const sampleStamps = [
  {
    id: 1,
    name: "Silver Jubilee",
    country: "New Zealand",
    year: 1935,
    denomination: "1d",
    condition: "Excellent",
    image: "/images/silver-jubilee.png",
    addedDate: "Mar 15, 2023",
    description:
      "Silver Jubilee stamp from New Zealand in excellent condition. Part of the 1935 series commemorating King George V's 25th year on the throne.",
  },
  {
    id: 2,
    name: "Coronation Series",
    country: "United Kingdom",
    year: 1953,
    denomination: "3d",
    condition: "Good",
    image: "/images/coronation-series.png",
    addedDate: "Apr 2, 2023",
    description:
      "Coronation stamp from the United Kingdom issued in 1953 to commemorate the coronation of Queen Elizabeth II.",
  },
  {
    id: 3,
    name: "Independence Issue",
    country: "India",
    year: 1947,
    denomination: "1 Anna",
    condition: "Fair",
    image: "/images/independence-issue.png",
    addedDate: "May 10, 2023",
    description:
      "Independence issue stamp from India released in 1947 to commemorate India's independence from British rule.",
  },
  {
    id: 4,
    name: "Bicentennial",
    country: "United States",
    year: 1976,
    denomination: "13c",
    condition: "Mint",
    image: "/images/bicentennial.png",
    addedDate: "Jun 22, 2023",
    description:
      "Mint condition Bicentennial stamp from the United States issued in 1976 to commemorate the 200th anniversary of American independence.",
  },
  {
    id: 5,
    name: "Olympic Games",
    country: "Australia",
    year: 2000,
    denomination: "45c",
    condition: "Very Good",
    image: "/images/olympic-games.png",
    addedDate: "Jul 5, 2023",
    description: "Olympic Games stamp from Australia issued in 2000 to commemorate the Sydney Olympics.",
  },
  {
    id: 6,
    name: "Flora Series",
    country: "South Africa",
    year: 1961,
    denomination: "12c",
    condition: "Good",
    image: "/images/flora-series.png",
    addedDate: "Aug 12, 2023",
    description: "Flora Series stamp from South Africa issued in 1961 featuring native South African plants.",
  },
  {
    id: 7,
    name: "Maple Leaf",
    country: "Canada",
    year: 1982,
    denomination: "30c",
    condition: "Very Good",
    image: "/images/maple-leaf.png",
    addedDate: "Sep 3, 2023",
    description: "Maple Leaf stamp from Canada issued in 1982.",
  },
  {
    id: 8,
    name: "Emperor Series",
    country: "Japan",
    year: 1967,
    denomination: "50 Yen",
    condition: "Good",
    image: "/images/emperor-series.png",
    addedDate: "Oct 15, 2023",
    description: "Emperor Series stamp from Japan issued in 1967.",
  },
  {
    id: 9,
    name: "Cultural Heritage",
    country: "China",
    year: 1990,
    denomination: "2 Yuan",
    condition: "Excellent",
    image: "/images/cultural-heritage.png",
    addedDate: "Nov 20, 2023",
    description: "Cultural Heritage stamp from China issued in 1990.",
  },
]

export default function ProfileCollection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [countryFilter, setCountryFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedStamp, setSelectedStamp] = useState<any>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const itemsPerPage = 6

  // Filter stamps based on search and filters
  const filteredStamps = sampleStamps.filter((stamp) => {
    const matchesSearch =
      stamp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stamp.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stamp.year.toString().includes(searchTerm)

    const matchesCountry = countryFilter === "all" || stamp.country === countryFilter

    return matchesSearch && matchesCountry
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredStamps.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedStamps = filteredStamps.slice(startIndex, startIndex + itemsPerPage)

  // Get unique countries for filter
  const countries = ["all", ...Array.from(new Set(sampleStamps.map((stamp) => stamp.country)))]

  // Handle deleting a stamp
  const handleDeleteStamp = (stamp: any) => {
    setSelectedStamp(stamp)
    setIsDeleteDialogOpen(true)
  }

  // Handle viewing stamp details
  const handleViewDetails = (stamp: any) => {
    setSelectedStamp(stamp)
    setIsDetailsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Stamps</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <div className="relative flex-1 md:w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stamps..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={countryFilter} onValueChange={setCountryFilter}>
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

            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                className="rounded-r-none"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                className="rounded-l-none"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <TabsContent value="all">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-medium">Your Stamps</h2>
              <p className="text-sm text-muted-foreground">{filteredStamps.length} stamps found</p>
            </div>
            <Link href="/scan">
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Add New Stamp
              </Button>
            </Link>
          </div>

          {renderStampsList(paginatedStamps)}
        </TabsContent>
      </Tabs>

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
                    src={selectedStamp.image || "/placeholder.svg"}
                    alt={selectedStamp.name}
                    className="w-full rounded-md"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{selectedStamp.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedStamp.country}, {selectedStamp.year} • {selectedStamp.denomination}
                  </p>
                  <p className="text-sm text-muted-foreground">Condition: {selectedStamp.condition}</p>
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

      {/* Stamp Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl">
          {selectedStamp && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedStamp.name}</DialogTitle>
                <DialogDescription>
                  {selectedStamp.country}, {selectedStamp.year}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div>
                  <img
                    src={selectedStamp.image || "/placeholder.svg"}
                    alt={selectedStamp.name}
                    className="w-full rounded-md"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Details</h3>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <p className="text-sm font-medium">Country</p>
                        <p className="text-sm">{selectedStamp.country}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Year</p>
                        <p className="text-sm">{selectedStamp.year}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Denomination</p>
                        <p className="text-sm">{selectedStamp.denomination}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Condition</p>
                        <p className="text-sm">{selectedStamp.condition}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Added to Collection</p>
                        <p className="text-sm">{selectedStamp.addedDate}</p>
                      </div>
                    </div>
                  </div>

                  {selectedStamp.description && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                      <p className="text-sm mt-1">{selectedStamp.description}</p>
                    </div>
                  )}

                  <div className="pt-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Actions</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/catalog/stamp-${selectedStamp.id}`}>View in Catalog</Link>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsDetailsDialogOpen(false)
                          handleDeleteStamp(selectedStamp)
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )

  function renderStampsList(stamps: any[]) {
    if (stamps.length === 0) {
      return (
        <div className="text-center py-12 bg-muted rounded-lg">
          <p className="text-muted-foreground mb-4">No stamps found matching your criteria.</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("")
              setCountryFilter("all")
            }}
          >
            Clear Filters
          </Button>
        </div>
      )
    }

    return viewMode === "grid" ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {stamps.map((stamp) => (
          <Card key={stamp.id} className="overflow-hidden">
            <div className="aspect-square relative">
              <img
                src={stamp.image || "/placeholder.svg"}
                alt={`${stamp.country} ${stamp.name} stamp`}
                className="object-cover w-full h-full"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium">{stamp.name}</h3>
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>{stamp.country}</span>
                <span>{stamp.year}</span>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span
                  className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-md"
                  title="Stamp denomination (face value)"
                >
                  {stamp.denomination}
                </span>
                <span className="text-xs text-muted-foreground">Condition: {stamp.condition}</span>
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleViewDetails(stamp)}>
                  Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    ) : (
      <div className="border rounded-md divide-y">
        {stamps.map((stamp) => (
          <div key={stamp.id} className="flex items-center p-4 gap-4">
            <div className="h-16 w-16 flex-shrink-0 relative">
              <img
                src={stamp.image || "/placeholder.svg"}
                alt={`${stamp.country} ${stamp.name} stamp`}
                className="object-cover w-full h-full rounded-md"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{stamp.name}</h3>
              <div className="flex gap-2 text-sm text-muted-foreground">
                <span>
                  {stamp.country}, {stamp.year}
                </span>
                <span>•</span>
                <span>{stamp.denomination}</span>
                <span>•</span>
                <span>Condition: {stamp.condition}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleViewDetails(stamp)}>
                Details
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDeleteStamp(stamp)}>
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    )
  }
}
