"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StampCard } from "@/components/catalog/stamp-card"
import { Search, Filter } from "lucide-react"

// Sample stamp data
const sampleStamps = [
  {
    id: "stamp-1",
    title: "Chalon Head Imperforate",
    image: "/placeholder-stamp.jpg",
    year: "1855",
    country: "NZ",
    denomination: "1D",
    catalogNumbers: {
      soa: 1,
      sg: "1",
      scott: "1",
      michel: "1",
    },
    description: "1855 1d Red Imperforate (Chalon Head)",
    marketValue: "$5,000 - $7,500",
    features: ["Imp"],
  },
  {
    id: "stamp-2",
    title: "Blue with Watermark",
    image: "/placeholder-stamp.jpg",
    year: "1855",
    country: "NZ",
    denomination: "2D",
    catalogNumbers: {
      soa: 2,
      sg: "2",
      scott: "2",
      michel: "2",
    },
    description: "1855 2d Blue with Watermark",
    marketValue: "$3,500 - $4,200",
    features: ["Wmk"],
  },
  {
    id: "stamp-3",
    title: "Brown Reprint",
    image: "/placeholder-stamp.jpg",
    year: "1856",
    country: "NZ",
    denomination: "6D",
    catalogNumbers: {
      soa: 3,
      sg: "3R",
      scott: "3a",
      michel: "3R",
    },
    description: "1856 6d Brown Reprint",
    marketValue: "$2,800 - $3,200",
    features: ["Rprt"],
  },
  {
    id: "stamp-6",
    title: "Green Imperforate",
    image: "/placeholder-stamp.jpg",
    year: "1857",
    country: "NZ",
    denomination: "1S",
    catalogNumbers: {
      soa: 6,
      sg: "6",
      scott: "6",
      michel: "6",
    },
    description: "1857 1s Green Imperforate",
    marketValue: "$4,200 - $5,800",
    features: ["Imp"],
  },
  {
    id: "stamp-10",
    title: "Brown Imperforate",
    image: "/placeholder-stamp.jpg",
    year: "1857",
    country: "NZ",
    denomination: "6D",
    catalogNumbers: {
      soa: 10,
      sg: "10",
      scott: "10",
      michel: "10",
    },
    description: "1857 6d Brown Imperforate (Chalon Head)",
    marketValue: "$6,500 - $8,200",
    features: ["Imp"],
  },
  {
    id: "stamp-10a",
    title: "Brown Script Watermark",
    image: "/placeholder-stamp.jpg",
    year: "1857",
    country: "NZ",
    denomination: "6D",
    catalogNumbers: {
      soa: 10,
      sg: "10a",
      scott: "10var",
      michel: "10a",
    },
    description: "1857 6d Brown with Script Watermark",
    marketValue: "$8,500 - $12,000",
    features: ["Wmk", "scr"],
  },
  {
    id: "stamp-14",
    title: "Blue Overprint",
    image: "/placeholder-stamp.jpg",
    year: "1859",
    country: "NZ",
    denomination: "2D",
    catalogNumbers: {
      soa: 14,
      sg: "14",
      scott: "14",
      michel: "14",
    },
    description: "1859 2d Blue Overprint",
    marketValue: "$3,200 - $4,500",
    features: ["Oprt"],
  },
  {
    id: "stamp-12",
    title: "Green Error Variety",
    image: "/placeholder-stamp.jpg",
    year: "1858",
    country: "NZ",
    denomination: "1S",
    catalogNumbers: {
      soa: 12,
      sg: "12a",
      scott: "12var",
      michel: "12a",
    },
    description: "1858 1s with Script Watermark (Error Variety)",
    marketValue: "$15,000 - $22,000",
    features: ["Wmk", "scr", "E"],
  },
]

export default function CatalogBrowserPage() {
  const [searchQuery, setSearchQuery] = useState("")
  
  // Add placeholder images since we don't have real images
  const stampsWithPlaceholders = sampleStamps.map(stamp => ({
    ...stamp,
    image: `https://placehold.co/400x400/e2e8f0/1e293b?text=${stamp.catalogNumbers.soa}`
  }))
  
  // Filter stamps based on search query
  const filteredStamps = stampsWithPlaceholders.filter(stamp => {
    const query = searchQuery.toLowerCase()
    
    return (
      stamp.title.toLowerCase().includes(query) ||
      stamp.description?.toLowerCase().includes(query) ||
      stamp.country.toLowerCase().includes(query) ||
      stamp.year.includes(query) ||
      stamp.denomination.toLowerCase().includes(query) ||
      stamp.catalogNumbers.soa.toString().includes(query) ||
      (stamp.catalogNumbers.sg && stamp.catalogNumbers.sg.toLowerCase().includes(query)) ||
      (stamp.catalogNumbers.scott && stamp.catalogNumbers.scott.toLowerCase().includes(query))
    )
  })

  return (
    <div className="space-y-6">
        <div>
        <h1 className="text-2xl font-bold">Catalog Browser</h1>
        <p className="text-muted-foreground mt-1">
          Browse and manage stamp catalog entries
        </p>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
            placeholder="Search by name, code, country..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-32">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              <SelectItem value="nz">New Zealand</SelectItem>
              <SelectItem value="au">Australia</SelectItem>
              <SelectItem value="gb">Great Britain</SelectItem>
                </SelectContent>
              </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              <SelectItem value="1855">1855</SelectItem>
              <SelectItem value="1856">1856</SelectItem>
              <SelectItem value="1857">1857</SelectItem>
              <SelectItem value="1858">1858</SelectItem>
              <SelectItem value="1859">1859</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredStamps.map((stamp) => (
          <StampCard key={stamp.id} {...stamp} />
                ))}
              </div>

      {filteredStamps.length === 0 && (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">No stamps found matching your search criteria.</p>
            </div>
          )}
    </div>
  )
}
