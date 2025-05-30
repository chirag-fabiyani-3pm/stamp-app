"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"

// Define stamp data types
interface Stamp {
  id: string
  title: string
  image: string
  catalogNumber: string
  year: string
  denomination: string
  color: string
  condition: string
  rarity: string
  price: string
  description: string
}

// Generate stamps for each catalog type
const generateStampsForCatalog = (catalogId: string): Stamp[] => {
  // Base stamps that will be modified for each catalog
  const baseStamps: Stamp[] = [
    {
      id: "1",
      title: "Queen Victoria Chalon Head",
      image: "/images/stamps/new-zealand/1855-queen-victoria-chalon.png",
      catalogNumber: "001",
      year: "1855",
      denomination: "1d",
      color: "Red",
      condition: "Fine Used",
      rarity: "Rare",
      price: "$2,500",
      description:
        "The first stamp issued in New Zealand, featuring Queen Victoria's portrait based on the Chalon painting.",
    },
    {
      id: "2",
      title: "Full Face Queen Imperforate",
      image: "/images/stamps/new-zealand/1858-full-face-queen.png",
      catalogNumber: "002",
      year: "1858",
      denomination: "2d",
      color: "Blue",
      condition: "Mint",
      rarity: "Very Rare",
      price: "$3,800",
      description: "Early imperforate issue of the Full Face Queen series, printed on unwatermarked paper.",
    },
    {
      id: "3",
      title: "Penny Universal",
      image: "/images/stamps/new-zealand/1901-penny-universal.png",
      catalogNumber: "145",
      year: "1901",
      denomination: "1d",
      color: "Carmine",
      condition: "Mint Never Hinged",
      rarity: "Common",
      price: "$85",
      description:
        "Issued to commemorate New Zealand joining the Universal Postal Union, allowing uniform postal rates.",
    },
    {
      id: "4",
      title: "Kiwi Definitive",
      image: "/images/stamps/new-zealand/1935-kiwi-definitive.png",
      catalogNumber: "287",
      year: "1935",
      denomination: "6d",
      color: "Scarlet",
      condition: "Fine Used",
      rarity: "Common",
      price: "$45",
      description: "Part of the 1935 Pictorial Definitives series featuring New Zealand's iconic flightless bird.",
    },
    {
      id: "5",
      title: "Health Stamp - Children",
      image: "/images/stamps/new-zealand/1942-health-stamp-children.png",
      catalogNumber: "H42",
      year: "1942",
      denomination: "1d+½d",
      color: "Green",
      condition: "Mint",
      rarity: "Uncommon",
      price: "$12",
      description: "Annual charity stamp with surcharge to support children's health camps.",
    },
    {
      id: "6",
      title: "HMS Endeavour",
      image: "/images/stamps/new-zealand/1969-hms-endeavour.png",
      catalogNumber: "388",
      year: "1969",
      denomination: "4c",
      color: "Multicolor",
      condition: "Mint Never Hinged",
      rarity: "Common",
      price: "$2",
      description: "Commemorating Captain Cook's first voyage to New Zealand aboard the HMS Endeavour.",
    },
    {
      id: "7",
      title: "Mt. Cook",
      image: "/images/stamps/new-zealand/1898-mt-cook.png",
      catalogNumber: "107",
      year: "1898",
      denomination: "5d",
      color: "Brown",
      condition: "Used",
      rarity: "Uncommon",
      price: "$65",
      description: "From the 1898 Pictorial series featuring New Zealand's highest mountain.",
    },
    {
      id: "8",
      title: "Manuka Flower",
      image: "/images/stamps/new-zealand/1960-manuka-flower.png",
      catalogNumber: "456",
      year: "1960",
      denomination: "3d",
      color: "Yellow-Green",
      condition: "Mint",
      rarity: "Common",
      price: "$8",
      description: "Part of the native flowers definitive series.",
    },
    {
      id: "9",
      title: "Christchurch Exhibition",
      image: "/images/stamps/new-zealand/1906-christchurch-exhibition.png",
      catalogNumber: "E1",
      year: "1906",
      denomination: "½d",
      color: "Green",
      condition: "Mint",
      rarity: "Scarce",
      price: "$450",
      description: "Special issue for the New Zealand International Exhibition held in Christchurch.",
    },
    {
      id: "10",
      title: "Coat of Arms",
      image: "/images/stamps/new-zealand/1956-coat-of-arms.png",
      catalogNumber: "AR95",
      year: "1956",
      denomination: "10/-",
      color: "Blue",
      condition: "Used",
      rarity: "Uncommon",
      price: "$35",
      description: "High value definitive featuring the New Zealand Coat of Arms.",
    },
    {
      id: "11",
      title: "Queen Elizabeth II",
      image: "/images/stamps/new-zealand/1953-queen-elizabeth-ii.png",
      catalogNumber: "725",
      year: "1953",
      denomination: "3d",
      color: "Vermilion",
      condition: "Mint Never Hinged",
      rarity: "Common",
      price: "$4",
      description: "First definitive issue featuring Queen Elizabeth II after her coronation.",
    },
    {
      id: "12",
      title: "Tiki",
      image: "/images/stamps/new-zealand/1967-tiki.png",
      catalogNumber: "M12",
      year: "1967",
      denomination: "10c",
      color: "Brown & Blue",
      condition: "Mint",
      rarity: "Common",
      price: "$3",
      description: "Featuring a traditional Māori tiki pendant, symbolizing human origins.",
    },
  ]

  // Modify catalog numbers based on catalog type
  return baseStamps.map((stamp) => {
    let prefix = ""
    switch (catalogId) {
      case "cp":
        prefix = "CP-"
        break
      case "sg-nz":
        prefix = "SG"
        break
      case "nzpost":
        prefix = "NZP"
        break
      case "scott-nz":
        prefix = "SC"
        break
      case "michel-nz":
        prefix = "MI"
        break
      case "australia":
        prefix = "AU"
        break
      case "sg-world":
        prefix = "SGW"
        break
      case "scott-world":
        prefix = "SCW"
        break
      default:
        prefix = ""
    }
    return { ...stamp, catalogNumber: `${prefix}-${stamp.catalogNumber}` }
  })
}

// Sample stamp data for different catalogs
const getStampsByCatalog = (catalogId: string): Stamp[] => {
  return generateStampsForCatalog(catalogId)
}

interface StampCatalogProps {
  catalogId: string
}

export default function StampCatalog({ catalogId }: StampCatalogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("year")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const stamps = getStampsByCatalog(catalogId)

  // Filter stamps based on search
  const filteredStamps = stamps.filter(
    (stamp) =>
      stamp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stamp.catalogNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stamp.year.toString().includes(searchTerm),
  )

  // Sort stamps
  const sortedStamps = [...filteredStamps].sort((a, b) => {
    if (sortBy === "year") {
      return Number.parseInt(a.year) - Number.parseInt(b.year)
    } else if (sortBy === "price") {
      const priceA = Number.parseFloat(a.price.replace(/[^0-9.]/g, ""))
      const priceB = Number.parseFloat(b.price.replace(/[^0-9.]/g, ""))
      return priceA - priceB
    } else if (sortBy === "title") {
      return a.title.localeCompare(b.title)
    } else if (sortBy === "rarity") {
      const rarityOrder = { Common: 0, Uncommon: 1, Scarce: 2, Rare: 3, "Very Rare": 4, "Extremely Rare": 5, Unique: 6 }
      return rarityOrder[a.rarity as keyof typeof rarityOrder] - rarityOrder[b.rarity as keyof typeof rarityOrder]
    }
    return 0
  })

  // Calculate pagination
  const totalPages = Math.ceil(sortedStamps.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedStamps = sortedStamps.slice(startIndex, startIndex + itemsPerPage)

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {stamps.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <h3 className="text-lg font-medium">No stamps found for this catalog</h3>
          <p className="text-muted-foreground mt-2">Try selecting a different catalog</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Input
                placeholder="Search stamps..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
            <div className="w-full sm:w-48">
              <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="year">Year (Oldest first)</SelectItem>
                  <SelectItem value="price">Price (Low to High)</SelectItem>
                  <SelectItem value="title">Title (A-Z)</SelectItem>
                  <SelectItem value="rarity">Rarity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {paginatedStamps.map((stamp) => (
              <Card key={stamp.id} className="flex flex-col h-full">
                <CardContent className="p-3 sm:p-4 flex-grow">
                  <div className="aspect-[4/5] relative mb-3 sm:mb-4 border rounded-md overflow-hidden">
                    <Image
                      src={`/vintage-postage-stamp.png?height=300&width=240&query=Stamp ${stamp.catalogNumber} ${stamp.title}`}
                      alt={stamp.title}
                      width={240}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm sm:text-base line-clamp-2">{stamp.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {stamp.catalogNumber} ({stamp.year})
                    </p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {stamp.denomination}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {stamp.condition}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {stamp.rarity}
                      </Badge>
                    </div>
                    <p className="text-sm sm:text-base font-medium">{stamp.price}</p>
                  </div>
                </CardContent>
                <CardFooter className="p-3 sm:p-4 pt-0">
                  <Button asChild className="w-full text-xs sm:text-sm">
                    <Link href={`/stamp/${stamp.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination className="mt-6 sm:mt-8">
              <PaginationContent className="overflow-x-auto pb-2 sm:pb-0">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={`${currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} text-xs sm:text-sm`}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink 
                      onClick={() => handlePageChange(page)} 
                      isActive={page === currentPage}
                      className="text-xs sm:text-sm h-8 w-8 sm:h-9 sm:w-9"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={`${currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} text-xs sm:text-sm`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  )
}
