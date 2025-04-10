"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Search, Filter, ChevronLeft, ChevronRight, Flag } from "lucide-react"
import Link from "next/link"
import { ReportDialog } from "@/components/report-dialog"

// Expanded sample data with more stamps for each catalog
const allStamps = [
  // Campbell Paterson (CP) Catalog stamps - New Zealand
  {
    id: "cp-1",
    catalogId: "cp",
    catalogNumber: "CP A1a",
    name: "Chalon Head",
    country: "New Zealand",
    year: 1855,
    denomination: "1d",
    color: "Red",
    image: "/chalon-head-new-zealand-red.jpg",
    rarity: "Very Rare",
  },
  {
    id: "cp-2",
    catalogId: "cp",
    catalogNumber: "CP A2a",
    name: "Chalon Head",
    country: "New Zealand",
    year: 1855,
    denomination: "2d",
    color: "Blue",
    image: "/chalon-head-new-zealand-blue.jpg",
    rarity: "Very Rare",
  },
  {
    id: "cp-3",
    catalogId: "cp",
    catalogNumber: "CP S1a",
    name: "Smiling Boys Health",
    country: "New Zealand",
    year: 1931,
    denomination: "1d + 1d",
    color: "Carmine",
    image: "/smiling-boys-health-red.jpg",
    rarity: "Rare",
  },
  {
    id: "cp-4",
    catalogId: "cp",
    catalogNumber: "CP S2a",
    name: "Smiling Boys Health",
    country: "New Zealand",
    year: 1931,
    denomination: "2d + 1d",
    color: "Blue",
    image: "/smiling-boys-health.jpg",
    rarity: "Rare",
  },
  {
    id: "cp-5",
    catalogId: "cp",
    catalogNumber: "CP L1a",
    name: "Queen Elizabeth II",
    country: "New Zealand",
    year: 1953,
    denomination: "1d",
    color: "Orange",
    image: "/queen-elizabeth-2-orange.webp",
    rarity: "Common",
  },
  {
    id: "cp-6",
    catalogId: "cp",
    catalogNumber: "CP L2a",
    name: "Queen Elizabeth II",
    country: "New Zealand",
    year: 1953,
    denomination: "2d",
    color: "Green",
    image: "/queen-elizabeth-2-green.jpg",
    rarity: "Common",
  },
  {
    id: "cp-7",
    catalogId: "cp",
    catalogNumber: "CP L3a",
    name: "Queen Elizabeth II",
    country: "New Zealand",
    year: 1953,
    denomination: "3d",
    color: "Vermilion",
    image: "/queen-elizabeth-2-vermilion.jpg",
    rarity: "Common",
  },
  {
    id: "cp-8",
    catalogId: "cp",
    catalogNumber: "CP L4a",
    name: "Queen Elizabeth II",
    country: "New Zealand",
    year: 1953,
    denomination: "4d",
    color: "Blue",
    image: "/queen-elizabeth-2-blue.jpg",
    rarity: "Common",
  },
  {
    id: "cp-9",
    catalogId: "cp",
    catalogNumber: "CP L5a",
    name: "Queen Elizabeth II",
    country: "New Zealand",
    year: 1953,
    denomination: "6d",
    color: "Purple",
    image: "/queen-elizabeth-2-purple.jpg",
    rarity: "Common",
  },
  {
    id: "cp-10",
    catalogId: "cp",
    catalogNumber: "CP L6a",
    name: "Queen Elizabeth II",
    country: "New Zealand",
    year: 1953,
    denomination: "8d",
    color: "Rose",
    image: "/queen-elizabeth-2-rose.jpg",
    rarity: "Common",
  },
  {
    id: "cp-11",
    catalogId: "cp",
    catalogNumber: "CP L7a",
    name: "Queen Elizabeth II",
    country: "New Zealand",
    year: 1953,
    denomination: "9d",
    color: "Brown",
    image: "/queen-elizabeth-2-brown.jpg",
    rarity: "Common",
  },
  {
    id: "cp-12",
    catalogId: "cp",
    catalogNumber: "CP L8a",
    name: "Queen Elizabeth II",
    country: "New Zealand",
    year: 1953,
    denomination: "1/-",
    color: "Black",
    image: "/queen-elizabeth-2-black.jpg",
    rarity: "Common",
  },
  {
    id: "cp-13",
    catalogId: "cp",
    catalogNumber: "CP L9a",
    name: "Queen Elizabeth II",
    country: "New Zealand",
    year: 1953,
    denomination: "1/6d",
    color: "Black & Blue",
    image: "/queen-elizabeth-2-black-and-blue.jpg",
    rarity: "Uncommon",
  },
  {
    id: "cp-14",
    catalogId: "cp",
    catalogNumber: "CP L10a",
    name: "Queen Elizabeth II",
    country: "New Zealand",
    year: 1953,
    denomination: "3/-",
    color: "Green",
    image: "/queen-elizabeth-2-green.jpg",
    rarity: "Uncommon",
  },
  {
    id: "cp-15",
    catalogId: "cp",
    catalogNumber: "CP L11a",
    name: "Queen Elizabeth II",
    country: "New Zealand",
    year: 1953,
    denomination: "5/-",
    color: "Carmine",
    image: "/queen-elizabeth-2-carmine.jpg",
    rarity: "Uncommon",
  },
  {
    id: "cp-16",
    catalogId: "cp",
    catalogNumber: "CP L12a",
    name: "Queen Elizabeth II",
    country: "New Zealand",
    year: 1953,
    denomination: "10/-",
    color: "Blue",
    image: "/queen-elizabeth-2-blue.jpg",
    rarity: "Rare",
  },
  {
    id: "cp-17",
    catalogId: "cp",
    catalogNumber: "CP L13a",
    name: "Queen Elizabeth II",
    country: "New Zealand",
    year: 1953,
    denomination: "£1",
    color: "Pink",
    image: "/queen-elizabeth-2-pink.jpg",
    rarity: "Rare",
  },
  {
    id: "cp-18",
    catalogId: "cp",
    catalogNumber: "CP T27a",
    name: "Pohutu Geyser",
    country: "New Zealand",
    year: 1960,
    denomination: "2d",
    color: "Green",
    image: "/pohutu-geyser-green.jpg",
    rarity: "Common",
  },
  {
    id: "cp-19",
    catalogId: "cp",
    catalogNumber: "CP T28a",
    name: "Manuka",
    country: "New Zealand",
    year: 1960,
    denomination: "3d",
    color: "Vermilion",
    image: "/manuka-vermilion.jpg",
    rarity: "Common",
  },
  {
    id: "cp-20",
    catalogId: "cp",
    catalogNumber: "CP T29a",
    name: "Kowhai",
    country: "New Zealand",
    year: 1960,
    denomination: "4d",
    color: "Blue",
    image: "/kowhai-blue.jpg",
    rarity: "Common",
  },

  // Stanley Gibbons New Zealand (SG-NZ) Catalog stamps
  {
    id: "sg-nz-1",
    catalogId: "sg-nz",
    catalogNumber: "SG 1",
    name: "Chalon Head",
    country: "New Zealand",
    year: 1855,
    denomination: "1d",
    color: "Red",
    image: "/placeholder.svg?height=300&width=300&text=SG+1",
    rarity: "Very Rare",
  },
  {
    id: "sg-nz-2",
    catalogId: "sg-nz",
    catalogNumber: "SG 2",
    name: "Chalon Head",
    country: "New Zealand",
    year: 1855,
    denomination: "2d",
    color: "Blue",
    image: "/placeholder.svg?height=300&width=300&text=SG+2",
    rarity: "Very Rare",
  },
  {
    id: "sg-nz-3",
    catalogId: "sg-nz",
    catalogNumber: "SG 546",
    name: "Smiling Boys Health",
    country: "New Zealand",
    year: 1931,
    denomination: "1d + 1d",
    color: "Carmine",
    image: "/placeholder.svg?height=300&width=300&text=SG+546",
    rarity: "Rare",
  },
  {
    id: "sg-nz-4",
    catalogId: "sg-nz",
    catalogNumber: "SG 547",
    name: "Smiling Boys Health",
    country: "New Zealand",
    year: 1931,
    denomination: "2d + 1d",
    color: "Blue",
    image: "/placeholder.svg?height=300&width=300&text=SG+547",
    rarity: "Rare",
  },
  {
    id: "sg-nz-5",
    catalogId: "sg-nz",
    catalogNumber: "SG 723",
    name: "Queen Elizabeth II",
    country: "New Zealand",
    year: 1953,
    denomination: "1d",
    color: "Orange",
    image: "/placeholder.svg?height=300&width=300&text=SG+723",
    rarity: "Common",
  },
  {
    id: "sg-nz-6",
    catalogId: "sg-nz",
    catalogNumber: "SG 724",
    name: "Queen Elizabeth II",
    country: "New Zealand",
    year: 1953,
    denomination: "2d",
    color: "Green",
    image: "/placeholder.svg?height=300&width=300&text=SG+724",
    rarity: "Common",
  },
  {
    id: "sg-nz-7",
    catalogId: "sg-nz",
    catalogNumber: "SG 725",
    name: "Queen Elizabeth II",
    country: "New Zealand",
    year: 1953,
    denomination: "3d",
    color: "Vermilion",
    image: "/placeholder.svg?height=300&width=300&text=SG+725",
    rarity: "Common",
  },
  {
    id: "sg-nz-8",
    catalogId: "sg-nz",
    catalogNumber: "SG 726",
    name: "Queen Elizabeth II",
    country: "New Zealand",
    year: 1953,
    denomination: "4d",
    color: "Blue",
    image: "/placeholder.svg?height=300&width=300&text=SG+726",
    rarity: "Common",
  },
  {
    id: "sg-nz-9",
    catalogId: "sg-nz",
    catalogNumber: "SG 727",
    name: "Queen Elizabeth II",
    country: "New Zealand",
    year: 1953,
    denomination: "6d",
    color: "Purple",
    image: "/placeholder.svg?height=300&width=300&text=SG+727",
    rarity: "Common",
  },
  {
    id: "sg-nz-10",
    catalogId: "sg-nz",
    catalogNumber: "SG 728",
    name: "Queen Elizabeth II",
    country: "New Zealand",
    year: 1953,
    denomination: "8d",
    color: "Rose",
    image: "/placeholder.svg?height=300&width=300&text=SG+728",
    rarity: "Common",
  },
  {
    id: "sg-nz-11",
    catalogId: "sg-nz",
    catalogNumber: "SG 729",
    name: "Queen Elizabeth II",
    country: "New Zealand",
    year: 1953,
    denomination: "9d",
    color: "Brown",
    image: "/placeholder.svg?height=300&width=300&text=SG+729",
    rarity: "Common",
  },
  {
    id: "sg-nz-12",
    catalogId: "sg-nz",
    catalogNumber: "SG 730",
    name: "Queen Elizabeth II",
    country: "New Zealand",
    year: 1953,
    denomination: "1/-",
    color: "Black",
    image: "/placeholder.svg?height=300&width=300&text=SG+730",
    rarity: "Common",
  },
  {
    id: "sg-nz-13",
    catalogId: "sg-nz",
    catalogNumber: "SG 731",
    name: "Queen Elizabeth II",
    country: "New Zealand",
    year: 1953,
    denomination: "1/6d",
    color: "Black & Blue",
    image: "/placeholder.svg?height=300&width=300&text=SG+731",
    rarity: "Uncommon",
  },
  {
    id: "sg-nz-14",
    catalogId: "sg-nz",
    catalogNumber: "SG 732",
    name: "Queen Elizabeth II",
    country: "New Zealand",
    year: 1953,
    denomination: "3/-",
    color: "Green",
    image: "/placeholder.svg?height=300&width=300&text=SG+732",
    rarity: "Uncommon",
  },
  {
    id: "sg-nz-15",
    catalogId: "sg-nz",
    catalogNumber: "SG 733",
    name: "Queen Elizabeth II",
    country: "New Zealand",
    year: 1953,
    denomination: "5/-",
    color: "Carmine",
    image: "/placeholder.svg?height=300&width=300&text=SG+733",
    rarity: "Uncommon",
  },

  // New Zealand Post (NZPost) Catalog stamps
  {
    id: "nzpost-1",
    catalogId: "nzpost",
    catalogNumber: "NZP 1",
    name: "Kiwi Definitive",
    country: "New Zealand",
    year: 1988,
    denomination: "1c",
    color: "Brown",
    image: "/placeholder.svg?height=300&width=300&text=NZP+1",
    rarity: "Common",
  },
  {
    id: "nzpost-2",
    catalogId: "nzpost",
    catalogNumber: "NZP 2",
    name: "Kiwi Definitive",
    country: "New Zealand",
    year: 1988,
    denomination: "2c",
    color: "Green",
    image: "/placeholder.svg?height=300&width=300&text=NZP+2",
    rarity: "Common",
  },
  {
    id: "nzpost-3",
    catalogId: "nzpost",
    catalogNumber: "NZP 100",
    name: "Lord of the Rings",
    country: "New Zealand",
    year: 2001,
    denomination: "$1.50",
    color: "Multicolor",
    image: "/placeholder.svg?height=300&width=300&text=NZP+100",
    rarity: "Uncommon",
  },
  {
    id: "nzpost-4",
    catalogId: "nzpost",
    catalogNumber: "NZP 101",
    name: "Lord of the Rings",
    country: "New Zealand",
    year: 2001,
    denomination: "$2.00",
    color: "Multicolor",
    image: "/placeholder.svg?height=300&width=300&text=NZP+101",
    rarity: "Uncommon",
  },
  {
    id: "nzpost-5",
    catalogId: "nzpost",
    catalogNumber: "NZP 200",
    name: "Rugby World Cup",
    country: "New Zealand",
    year: 2011,
    denomination: "$1.90",
    color: "Black",
    image: "/placeholder.svg?height=300&width=300&text=NZP+200",
    rarity: "Common",
  },
  {
    id: "nzpost-6",
    catalogId: "nzpost",
    catalogNumber: "NZP 201",
    name: "Rugby World Cup",
    country: "New Zealand",
    year: 2011,
    denomination: "$2.40",
    color: "Silver",
    image: "/placeholder.svg?height=300&width=300&text=NZP+201",
    rarity: "Common",
  },
  {
    id: "nzpost-7",
    catalogId: "nzpost",
    catalogNumber: "NZP 202",
    name: "Rugby World Cup",
    country: "New Zealand",
    year: 2011,
    denomination: "$3.00",
    color: "Gold",
    image: "/placeholder.svg?height=300&width=300&text=NZP+202",
    rarity: "Uncommon",
  },
  {
    id: "nzpost-8",
    catalogId: "nzpost",
    catalogNumber: "NZP 300",
    name: "Kiwiana",
    country: "New Zealand",
    year: 2015,
    denomination: "$1.00",
    color: "Multicolor",
    image: "/placeholder.svg?height=300&width=300&text=NZP+300",
    rarity: "Common",
  },
  {
    id: "nzpost-9",
    catalogId: "nzpost",
    catalogNumber: "NZP 301",
    name: "Kiwiana",
    country: "New Zealand",
    year: 2015,
    denomination: "$2.00",
    color: "Multicolor",
    image: "/placeholder.svg?height=300&width=300&text=NZP+301",
    rarity: "Common",
  },
  {
    id: "nzpost-10",
    catalogId: "nzpost",
    catalogNumber: "NZP 302",
    name: "Kiwiana",
    country: "New Zealand",
    year: 2015,
    denomination: "$2.50",
    color: "Multicolor",
    image: "/placeholder.svg?height=300&width=300&text=NZP+302",
    rarity: "Common",
  },
  {
    id: "nzpost-11",
    catalogId: "nzpost",
    catalogNumber: "NZP 400",
    name: "Native Birds",
    country: "New Zealand",
    year: 2017,
    denomination: "$1.20",
    color: "Multicolor",
    image: "/placeholder.svg?height=300&width=300&text=NZP+400",
    rarity: "Common",
  },
  {
    id: "nzpost-12",
    catalogId: "nzpost",
    catalogNumber: "NZP 401",
    name: "Native Birds",
    country: "New Zealand",
    year: 2017,
    denomination: "$2.40",
    color: "Multicolor",
    image: "/placeholder.svg?height=300&width=300&text=NZP+401",
    rarity: "Common",
  },
  {
    id: "nzpost-13",
    catalogId: "nzpost",
    catalogNumber: "NZP 402",
    name: "Native Birds",
    country: "New Zealand",
    year: 2017,
    denomination: "$3.00",
    color: "Multicolor",
    image: "/placeholder.svg?height=300&width=300&text=NZP+402",
    rarity: "Common",
  },
  {
    id: "nzpost-14",
    catalogId: "nzpost",
    catalogNumber: "NZP 500",
    name: "Space Pioneers",
    country: "New Zealand",
    year: 2019,
    denomination: "$1.30",
    color: "Multicolor",
    image: "/placeholder.svg?height=300&width=300&text=NZP+500",
    rarity: "Common",
  },
  {
    id: "nzpost-15",
    catalogId: "nzpost",
    catalogNumber: "NZP 501",
    name: "Space Pioneers",
    country: "New Zealand",
    year: 2019,
    denomination: "$2.60",
    color: "Multicolor",
    image: "/placeholder.svg?height=300&width=300&text=NZP+501",
    rarity: "Common",
  },
  {
    id: "nzpost-16",
    catalogId: "nzpost",
    catalogNumber: "NZP 502",
    name: "Space Pioneers",
    country: "New Zealand",
    year: 2019,
    denomination: "$3.30",
    color: "Multicolor",
    image: "/placeholder.svg?height=300&width=300&text=NZP+502",
    rarity: "Common",
  },
  {
    id: "nzpost-17",
    catalogId: "nzpost",
    catalogNumber: "NZP 503",
    name: "Space Pioneers",
    country: "New Zealand",
    year: 2019,
    denomination: "$4.00",
    color: "Multicolor",
    image: "/placeholder.svg?height=300&width=300&text=NZP+503",
    rarity: "Uncommon",
  },

  // Scott New Zealand (Scott-NZ) Catalog stamps
  {
    id: "scott-nz-1",
    catalogId: "scott-nz",
    catalogNumber: "Scott 1",
    name: "Chalon Head",
    country: "New Zealand",
    year: 1855,
    denomination: "1d",
    color: "Red",
    image: "/placeholder.svg?height=300&width=300&text=Scott+1",
    rarity: "Very Rare",
  },
  {
    id: "scott-nz-2",
    catalogId: "scott-nz",
    catalogNumber: "Scott 2",
    name: "Chalon Head",
    country: "New Zealand",
    year: 1855,
    denomination: "2d",
    color: "Blue",
    image: "/placeholder.svg?height=300&width=300&text=Scott+2",
    rarity: "Very Rare",
  },
  {
    id: "scott-nz-3",
    catalogId: "scott-nz",
    catalogNumber: "Scott B3",
    name: "Smiling Boys Health",
    country: "New Zealand",
    year: 1931,
    denomination: "1d + 1d",
    color: "Carmine",
    image: "/placeholder.svg?height=300&width=300&text=Scott+B3",
    rarity: "Rare",
  },
  {
    id: "scott-nz-4",
    catalogId: "scott-nz",
    catalogNumber: "Scott B4",
    name: "Smiling Boys Health",
    country: "New Zealand",
    year: 1931,
    denomination: "2d + 1d",
    color: "Blue",
    image: "/placeholder.svg?height=300&width=300&text=Scott+B4",
    rarity: "Rare",
  },
  {
    id: "scott-nz-5",
    catalogId: "scott-nz",
    catalogNumber: "Scott 288",
    name: "Queen Elizabeth II",
    country: "New Zealand",
    year: 1953,
    denomination: "1d",
    color: "Orange",
    image: "/placeholder.svg?height=300&width=300&text=Scott+288",
    rarity: "Common",
  },
  {
    id: "scott-nz-6",
    catalogId: "scott-nz",
    catalogNumber: "Scott 289",
    name: "Queen Elizabeth II",
    country: "New Zealand",
    year: 1953,
    denomination: "2d",
    color: "Green",
    image: "/placeholder.svg?height=300&width=300&text=Scott+289",
    rarity: "Common",
  },
  {
    id: "scott-nz-7",
    catalogId: "scott-nz",
    catalogNumber: "Scott 290",
    name: "Queen Elizabeth II",
    country: "New Zealand",
    year: 1953,
    denomination: "3d",
    color: "Vermilion",
    image: "/placeholder.svg?height=300&width=300&text=Scott+290",
    rarity: "Common",
  },
  {
    id: "scott-nz-8",
    catalogId: "scott-nz",
    catalogNumber: "Scott 291",
    name: "Queen Elizabeth II",
    country: "New Zealand",
    year: 1953,
    denomination: "4d",
    color: "Blue",
    image: "/placeholder.svg?height=300&width=300&text=Scott+291",
    rarity: "Common",
  },
  {
    id: "scott-nz-9",
    catalogId: "scott-nz",
    catalogNumber: "Scott 292",
    name: "Queen Elizabeth II",
    country: "New Zealand",
    year: 1953,
    denomination: "6d",
    color: "Purple",
    image: "/placeholder.svg?height=300&width=300&text=Scott+292",
    rarity: "Common",
  },
  {
    id: "scott-nz-10",
    catalogId: "scott-nz",
    catalogNumber: "Scott 293",
    name: "Queen Elizabeth II",
    country: "New Zealand",
    year: 1953,
    denomination: "8d",
    color: "Rose",
    image: "/placeholder.svg?height=300&width=300&text=Scott+293",
    rarity: "Common",
  },
  {
    id: "scott-nz-11",
    catalogId: "scott-nz",
    catalogNumber: "Scott 294",
    name: "Queen Elizabeth II",
    country: "New Zealand",
    year: 1953,
    denomination: "9d",
    color: "Brown",
    image: "/placeholder.svg?height=300&width=300&text=Scott+294",
    rarity: "Common",
  },
  {
    id: "scott-nz-12",
    catalogId: "scott-nz",
    catalogNumber: "Scott 295",
    name: "Queen Elizabeth II",
    country: "New Zealand",
    year: 1953,
    denomination: "1/-",
    color: "Black",
    image: "/placeholder.svg?height=300&width=300&text=Scott+295",
    rarity: "Common",
  },
  {
    id: "scott-nz-13",
    catalogId: "scott-nz",
    catalogNumber: "Scott 296",
    name: "Queen Elizabeth II",
    country: "New Zealand",
    year: 1953,
    denomination: "1/6d",
    color: "Black & Blue",
    image: "/placeholder.svg?height=300&width=300&text=Scott+296",
    rarity: "Uncommon",
  },
  {
    id: "scott-nz-14",
    catalogId: "scott-nz",
    catalogNumber: "Scott 297",
    name: "Queen Elizabeth II",
    country: "New Zealand",
    year: 1953,
    denomination: "3/-",
    color: "Green",
    image: "/placeholder.svg?height=300&width=300&text=Scott+297",
    rarity: "Uncommon",
  },
  {
    id: "scott-nz-15",
    catalogId: "scott-nz",
    catalogNumber: "Scott 298",
    name: "Queen Elizabeth II",
    country: "New Zealand",
    year: 1953,
    denomination: "5/-",
    color: "Carmine",
    image: "/placeholder.svg?height=300&width=300&text=Scott+298",
    rarity: "Uncommon",
  },
  {
    id: "scott-nz-16",
    catalogId: "scott-nz",
    catalogNumber: "Scott 299",
    name: "Queen Elizabeth II",
    country: "New Zealand",
    year: 1953,
    denomination: "10/-",
    color: "Blue",
    image: "/placeholder.svg?height=300&width=300&text=Scott+299",
    rarity: "Rare",
  },
  {
    id: "scott-nz-17",
    catalogId: "scott-nz",
    catalogNumber: "Scott 300",
    name: "Queen Elizabeth II",
    country: "New Zealand",
    year: 1953,
    denomination: "£1",
    color: "Pink",
    image: "/placeholder.svg?height=300&width=300&text=Scott+300",
    rarity: "Rare",
  },
]

interface StampCatalogProps {
  catalogId?: string
}

export default function StampCatalog({ catalogId }: StampCatalogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [yearFilter, setYearFilter] = useState("all")
  const [rarityFilter, setRarityFilter] = useState("all")
  const [stamps, setStamps] = useState<typeof allStamps>([])

  useEffect(() => {
    // Filter stamps based on catalogId
    const filteredStamps = catalogId ? allStamps.filter((stamp) => stamp.catalogId === catalogId) : allStamps

    setStamps(filteredStamps)
    setCurrentPage(1) // Reset to first page when changing catalogs
  }, [catalogId])

  const itemsPerPage = 6

  // Apply filters and search
  const filteredStamps = stamps.filter((stamp) => {
    // Search term filter
    const matchesSearch =
      stamp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stamp.catalogNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stamp.year.toString().includes(searchTerm)

    // Year filter
    let matchesYear = true
    if (yearFilter !== "all") {
      if (yearFilter === "pre-1900") {
        matchesYear = stamp.year < 1900
      } else if (yearFilter === "1900-1950") {
        matchesYear = stamp.year >= 1900 && stamp.year <= 1950
      } else if (yearFilter === "1951-2000") {
        matchesYear = stamp.year >= 1951 && stamp.year <= 2000
      } else if (yearFilter === "post-2000") {
        matchesYear = stamp.year > 2000
      }
    }

    // Rarity filter
    const matchesRarity = rarityFilter === "all" || stamp.rarity.toLowerCase() === rarityFilter.toLowerCase()

    return matchesSearch && matchesYear && matchesRarity
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredStamps.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedStamps = filteredStamps.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, catalog number, or year..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1) // Reset to first page on search
            }}
          />
        </div>

        <div className="flex gap-2">
          <Select
            value={yearFilter}
            onValueChange={(value) => {
              setYearFilter(value)
              setCurrentPage(1) // Reset to first page on filter change
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              <SelectItem value="pre-1900">Pre-1900</SelectItem>
              <SelectItem value="1900-1950">1900-1950</SelectItem>
              <SelectItem value="1951-2000">1951-2000</SelectItem>
              <SelectItem value="post-2000">Post-2000</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={rarityFilter}
            onValueChange={(value) => {
              setRarityFilter(value)
              setCurrentPage(1) // Reset to first page on filter change
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Rarity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rarities</SelectItem>
              <SelectItem value="common">Common</SelectItem>
              <SelectItem value="uncommon">Uncommon</SelectItem>
              <SelectItem value="rare">Rare</SelectItem>
              <SelectItem value="very rare">Very Rare</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            aria-expanded={isFilterOpen}
            aria-label="Filter stamps"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="mt-4 p-4 border rounded-md bg-background shadow-sm">
          <h3 className="font-medium mb-3">Advanced Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year-range">Year Range</Label>
              <div className="flex items-center gap-2">
                <Input id="min-year" placeholder="From" type="number" className="w-24" />
                <span>to</span>
                <Input id="max-year" placeholder="To" type="number" className="w-24" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="denomination">Denomination</Label>
              <Input id="denomination" placeholder="e.g., 1d, 5c" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Select defaultValue="all">
                <SelectTrigger id="color">
                  <SelectValue placeholder="Any color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any color</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="brown">Brown</SelectItem>
                  <SelectItem value="black">Black</SelectItem>
                  <SelectItem value="multicolor">Multicolor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={() => setIsFilterOpen(false)}>
              Cancel
            </Button>
            <Button size="sm">Apply Filters</Button>
          </div>
        </div>
      )}

      {filteredStamps.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No stamps found matching your search criteria.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedStamps.map((stamp) => (
              <Card key={stamp.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <img
                    src={stamp.image || "/placeholder.svg"}
                    alt={`${stamp.country} ${stamp.name} stamp`}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-lg">{stamp.name}</h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md">
                      {stamp.catalogNumber}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>{stamp.country}</span>
                    <span>{stamp.year}</span>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-md">
                      {stamp.denomination}
                    </span>
                    <span className="text-xs text-muted-foreground">{stamp.rarity}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <Link href={`/stamps/stamp-${stamp.id}`} className="text-sm text-primary hover:underline">
                    View Details
                  </Link>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      Add to Collection
                    </Button>
                    <ReportDialog
                      contentType="stamp"
                      contentId={stamp.id}
                      contentTitle={`${stamp.name} (${stamp.catalogNumber})`}
                      trigger={
                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                          <Flag className="h-4 w-4" />
                          <span className="sr-only">Report</span>
                        </Button>
                      }
                    />
                  </div>
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
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredStamps.length)} of{" "}
                {filteredStamps.length} stamps
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
