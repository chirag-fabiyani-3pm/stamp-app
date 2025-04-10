"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Search, ChevronLeft, ChevronRight, BookOpen } from "lucide-react"
import Link from "next/link"

// Sample data for demonstration
const sampleCatalogs = [
  // New Zealand Catalogs
  {
    id: "cp",
    name: "Campbell Paterson Catalogue",
    country: "New Zealand",
    publisher: "Campbell Paterson Ltd",
    established: 1952,
    lastUpdated: "2023",
    description:
      "The definitive specialized catalog for New Zealand stamps, featuring detailed listings of all New Zealand stamps with specialized varieties, errors, and detailed pricing information.",
    image: "/campbell-paterson-catalogue.jpg",
  },
  {
    id: "sg-nz",
    name: "Stanley Gibbons New Zealand",
    country: "New Zealand",
    publisher: "Stanley Gibbons Ltd",
    established: 1865,
    lastUpdated: "2022",
    description:
      "The New Zealand section of the renowned Stanley Gibbons catalog, offering comprehensive coverage of New Zealand stamps with the internationally recognized SG numbering system.",
    image: "/stanley-gibbons-new-zealand.jpg",
  },
  {
    id: "nzpost",
    name: "New Zealand Post Stamps Catalogue",
    country: "New Zealand",
    publisher: "New Zealand Post",
    established: 1988,
    lastUpdated: "2023",
    description:
      "The official catalog from New Zealand Post, featuring all commemorative and definitive stamps issued by New Zealand, with official issue information and background stories.",
    image: "/new-zealand-post-stamps-catalogue.jpg",
  },
  {
    id: "scott-nz",
    name: "Scott New Zealand Listings",
    country: "New Zealand",
    publisher: "Amos Media Company",
    established: 1868,
    lastUpdated: "2023",
    description:
      "The New Zealand section of the Scott Standard Postage Stamp Catalogue, using the Scott numbering system widely recognized by collectors worldwide.",
    image: "/scott-new-zealand-listings.jpg",
  },

  // Australia Catalogs
  {
    id: "australia",
    name: "Australian Commonwealth Specialists' Catalogue",
    country: "Australia",
    publisher: "Brusden-White",
    established: 1926,
    lastUpdated: "2022",
    description:
      "The definitive specialized catalog for Australian stamps, with detailed information on varieties, errors, and printing details.",
    image: "/australian-commonwealth-specialists-catalogue.jpg",
  },
  {
    id: "sg-au",
    name: "Stanley Gibbons Australia",
    country: "Australia",
    publisher: "Stanley Gibbons Ltd",
    established: 1865,
    lastUpdated: "2022",
    description:
      "The Australia section of the Stanley Gibbons catalog, with comprehensive listings of all Australian stamps.",
    image: "/stanley-gibbons-australia.jpg",
  },

  // UK Catalogs
  {
    id: "sg-uk",
    name: "Stanley Gibbons Great Britain Concise",
    country: "United Kingdom",
    publisher: "Stanley Gibbons Ltd",
    established: 1865,
    lastUpdated: "2023",
    description: "The definitive catalog for Great Britain stamps, with detailed listings and pricing information.",
    image: "/stanley-gibbons-great-britain-concise.jpg",
  },
  {
    id: "sg-commonwealth",
    name: "Stanley Gibbons Commonwealth & British Empire",
    country: "Commonwealth",
    publisher: "Stanley Gibbons Ltd",
    established: 1865,
    lastUpdated: "2023",
    description: "Comprehensive catalog covering stamps from all Commonwealth and former British Empire territories.",
    image: "/stanley-gibbons-commonwealth-and-british-empire.jpg",
  },

  // US Catalogs
  {
    id: "scott-us",
    name: "Scott United States Specialized",
    country: "United States",
    publisher: "Amos Media Company",
    established: 1868,
    lastUpdated: "2023",
    description:
      "The specialized catalog for United States stamps, with detailed information on varieties, errors, and printing details.",
    image: "/scott-united-states-specialized.jpg",
  },

  // Worldwide Catalogs
  {
    id: "sg-world",
    name: "Stanley Gibbons Simplified Catalogue",
    country: "Worldwide",
    publisher: "Stanley Gibbons Ltd",
    established: 1865,
    lastUpdated: "2023",
    description:
      "A comprehensive worldwide stamp catalog covering stamps from all countries, with the internationally recognized Stanley Gibbons numbering system.",
    image: "/stanley-gibbons-simplified-catalogue.jpg",
  },
  {
    id: "scott-world",
    name: "Scott Standard Postage Stamp Catalogue",
    country: "Worldwide",
    publisher: "Amos Media Company",
    established: 1868,
    lastUpdated: "2023",
    description:
      "The most comprehensive catalog of worldwide stamps, published annually in multiple volumes with detailed listings and pricing information.",
    image: "/scott-standard-postage-stamp-catalogue.jpg",
  },
  {
    id: "michel",
    name: "MICHEL Overseas Catalogue",
    country: "Worldwide",
    publisher: "Schwaneberger Verlag GmbH",
    established: 1910,
    lastUpdated: "2023",
    description:
      "A detailed European catalog with comprehensive coverage of worldwide stamps, particularly strong in European and former colonial territories.",
    image: "/michel-overseas-catalogue.jpg",
  },
]

export default function CatalogList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [countryFilter, setCountryFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Filter catalogs based on search and country filter
  const filteredCatalogs = sampleCatalogs.filter(
    (catalog) =>
      (countryFilter === "all" || catalog.country === countryFilter) &&
      (catalog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        catalog.publisher.toLowerCase().includes(searchTerm.toLowerCase()) ||
        catalog.description.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredCatalogs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCatalogs = filteredCatalogs.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search catalogs by name or publisher..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1) // Reset to first page on search
            }}
          />
        </div>

        <Select
          value={countryFilter}
          onValueChange={(value) => {
            setCountryFilter(value)
            setCurrentPage(1) // Reset to first page on filter change
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            <SelectItem value="New Zealand">New Zealand</SelectItem>
            <SelectItem value="Australia">Australia</SelectItem>
            <SelectItem value="United Kingdom">United Kingdom</SelectItem>
            <SelectItem value="United States">United States</SelectItem>
            <SelectItem value="Commonwealth">Commonwealth</SelectItem>
            <SelectItem value="Worldwide">Worldwide</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredCatalogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No catalogs found matching your search criteria.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedCatalogs.map((catalog) => (
              <Card key={catalog.id} className="flex flex-col h-full">
                <div className="aspect-video relative bg-muted">
                  <img
                    src={catalog.image || "/placeholder.svg"}
                    alt={`${catalog.name} cover`}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardContent className="flex-grow p-6">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-medium text-lg">{catalog.name}</h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md whitespace-nowrap">
                      {catalog.country}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">
                    <p>Published by {catalog.publisher}</p>
                    <p>
                      Est. {catalog.established} • Updated {catalog.lastUpdated}
                    </p>
                  </div>
                  <p className="text-sm line-clamp-3">{catalog.description}</p>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Link href={`/catalog/${catalog.id}`} className="w-full">
                    <Button className="w-full gap-2">
                      <BookOpen className="h-4 w-4" /> Browse Catalog
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-2 mt-8">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    // Show first page, last page, current page, and pages around current
                    let pageToShow: number | null = null

                    if (totalPages <= 5) {
                      // If 5 or fewer pages, show all page numbers
                      pageToShow = i + 1
                    } else if (i === 0) {
                      // First button is always page 1
                      pageToShow = 1
                    } else if (i === 4) {
                      // Last button is always the last page
                      pageToShow = totalPages
                    } else if (currentPage <= 2) {
                      // Near the start
                      pageToShow = i + 1
                    } else if (currentPage >= totalPages - 1) {
                      // Near the end
                      pageToShow = totalPages - 4 + i
                    } else {
                      // In the middle
                      pageToShow = currentPage - 1 + i
                    }

                    // If we have a gap, show ellipsis
                    if ((i === 1 && pageToShow > 2) || (i === 3 && pageToShow < totalPages - 1)) {
                      return (
                        <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center">
                          ...
                        </span>
                      )
                    }

                    return (
                      <Button
                        key={pageToShow}
                        variant={currentPage === pageToShow ? "default" : "outline"}
                        size="icon"
                        className="w-8 h-8"
                        onClick={() => setCurrentPage(pageToShow!)}
                      >
                        {pageToShow}
                      </Button>
                    )
                  })}
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

              <div className="text-sm text-muted-foreground mt-2">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredCatalogs.length)} of{" "}
                {filteredCatalogs.length} catalogs
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
