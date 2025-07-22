"use client"

import React, { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Grid, List, ArrowUpDown, Calendar, Map, SlidersHorizontal } from "lucide-react"
import Link from "next/link"

// Update the StampVariety interface to include more comprehensive catalog references
export interface StampVariety {
  id: string
  code: string
  name: string
  year: string
  description: string
  color: string
  condition: string
  image: string
  rarity: string
  catalogReferences: {
    [key: string]: string
  }
  // Add pricing information with condition grades
  pricingByCondition?: {
    [condition: string]: number
  }
  // Add catalog notes for specialized information
  catalogNotes?: string
  // Add provenance or discovery information
  discoveryInfo?: string
}

// Update the Stamp interface to include catalog system information
export interface Stamp {
  id: string
  code: string
  title: string
  country: string
  issueDate: string
  denomination: string
  description: string
  image: string
  varieties: StampVariety[]
  issueSeries?: string
  printMethod?: string
  // Add catalog system information
  catalogSystems?: {
    [key: string]: {
      code: string
      notes?: string
    }
  }
  // Add specialized catalog information
  specializedCatalogs?: {
    name: string
    description: string
    countrySpecific: boolean
  }[]
}

// Enhance the generateStamps function to include more comprehensive catalog information
export const generateStamps = (): Stamp[] => {
  return [
    {
      id: "nz-chalon-head",
      code: "SOA-NZ-001",
      title: "Chalon Head",
      country: "New Zealand",
      issueDate: "1855-07-18",
      denomination: "1d - 1s",
      description:
        "The first stamp issue of New Zealand featuring Queen Victoria's portrait based on a painting by Alfred Edward Chalon",
      image: "/placeholder.svg?key=iqraa",
      issueSeries: "First Pictorials",
      printMethod: "Recess printing",
      catalogSystems: {
        "Stanley Gibbons": {
          code: "SG 1-6",
          notes: "Commonwealth specialist catalog with detailed listings for New Zealand",
        },
        Scott: {
          code: "1-5",
          notes: "American catalog with simplified listings",
        },
        Michel: {
          code: "1-6",
          notes: "German catalog with European focus",
        },
      },
      specializedCatalogs: [
        {
          name: "Campbell Paterson",
          description: "New Zealand's specialized catalog with detailed plate varieties",
          countrySpecific: true,
        },
        {
          name: "The Postage Stamps of New Zealand",
          description: "Royal Philatelic Society of NZ publication with extensive research",
          countrySpecific: true,
        },
      ],
      varieties: [
        {
          id: "nz-chalon-1d-red",
          code: "SOA-NZ-001.1",
          name: "1d Red on Blue Paper",
          year: "1855",
          description: "First printing on blue paper without watermark",
          color: "Red",
          condition: "Fine Used",
          image: "/placeholder.svg?key=9ihjl",
          rarity: "Very Rare",
          catalogReferences: {
            "Campbell Paterson": "A1a",
            "Stanley Gibbons": "SG 1",
            Scott: "1",
            Michel: "1",
            Yvert: "1",
          },
          pricingByCondition: {
            Mint: 25000,
            "Fine Used": 5000,
            Used: 2500,
            Poor: 500,
          },
          catalogNotes:
            "The first New Zealand stamp, printed by Perkins Bacon in London. Blue paper was used for the initial printing.",
          discoveryInfo: "First recorded by Sir John Richardson in his 1871 philatelic census.",
        },
        {
          id: "nz-chalon-2d-blue",
          code: "SOA-NZ-001.2",
          name: "2d Blue on Blue Paper",
          year: "1855",
          description: "First printing on blue paper without watermark",
          color: "Blue",
          condition: "Fine Used",
          image: "/placeholder.svg?key=z21tv",
          rarity: "Very Rare",
          catalogReferences: {
            "Campbell Paterson": "A2a",
            "Stanley Gibbons": "SG 2",
            Scott: "2",
            Michel: "2",
            Yvert: "2",
          },
          pricingByCondition: {
            Mint: 20000,
            "Fine Used": 4000,
            Used: 2000,
            Poor: 400,
          },
        },
        {
          id: "nz-chalon-1s-green",
          code: "SOA-NZ-001.3",
          name: "1s Green on Blue Paper",
          year: "1855",
          description: "First printing on blue paper without watermark",
          color: "Green",
          condition: "Fine Used",
          image: "/placeholder.svg?key=9n85y",
          rarity: "Extremely Rare",
          catalogReferences: {
            "Campbell Paterson": "A6a",
            "Stanley Gibbons": "SG 3",
            Scott: "3",
            Michel: "3",
            Yvert: "3",
          },
          pricingByCondition: {
            Mint: 50000,
            "Fine Used": 10000,
            Used: 5000,
            Poor: 1000,
          },
        },
        {
          id: "nz-chalon-1d-orange",
          code: "SOA-NZ-001.4",
          name: "1d Orange-Vermilion",
          year: "1861",
          description: "Printed on large star watermarked paper, perforated 12.5",
          color: "Orange-Vermilion",
          condition: "Mint",
          image: "/placeholder.svg?key=vm5vm",
          rarity: "Rare",
          catalogReferences: {
            "Campbell Paterson": "A1m",
            "Stanley Gibbons": "SG 97",
            Scott: "11",
            Michel: "11",
            Yvert: "11",
          },
          pricingByCondition: {
            Mint: 15000,
            "Fine Used": 3000,
            Used: 1500,
            Poor: 300,
          },
        },
      ],
    },
    {
      id: "nz-penny-universal",
      code: "SOA-NZ-002",
      title: "Penny Universal",
      country: "New Zealand",
      issueDate: "1901-01-01",
      denomination: "1d",
      description:
        "Issued to commemorate New Zealand joining the Universal Postal Union, allowing uniform postal rates",
      image: "/placeholder.svg?key=pbywy",
      issueSeries: "Commemoratives",
      printMethod: "Recess printing",
      catalogSystems: {
        "Stanley Gibbons": {
          code: "SG 300-331",
          notes: "Extensive listing of the many printings and varieties",
        },
        Scott: {
          code: "85-86",
          notes: "Simplified listing with major varieties only",
        },
      },
      specializedCatalogs: [
        {
          name: "Campbell Paterson",
          description: "Detailed listing with plate varieties and flaws",
          countrySpecific: true,
        },
        {
          name: "The Penny Universal of New Zealand",
          description: "Specialized monograph by Collins and Watts",
          countrySpecific: true,
        },
      ],
      varieties: [
        {
          id: "nz-penny-universal-blue",
          code: "SOA-NZ-002.1",
          name: "1d Universal Blue Trial Color",
          year: "1900",
          description: "Trial color proof in blue, extremely rare",
          color: "Blue",
          condition: "Mint",
          image: "/placeholder.svg?key=5aixb",
          rarity: "Extremely Rare",
          catalogReferences: {
            "Campbell Paterson": "G1a(TC)",
            "Stanley Gibbons": "SG 300(proof)",
            Scott: "TP1",
            Michel: "P1",
            Yvert: "E1",
          },
          pricingByCondition: {
            Mint: 10000,
            "Fine Used": 0, // Not known used
            Used: 0,
            Poor: 0,
          },
          catalogNotes:
            "Trial color proof produced before the final design was approved. Only a handful of examples are known to exist.",
          discoveryInfo: "First recorded in the Sir Gawaine Baillie collection, sold at auction in 2006.",
        },
        {
          id: "nz-penny-universal-carmine",
          code: "SOA-NZ-002.2",
          name: "1d Universal Carmine",
          year: "1901",
          description: "Standard issue on unwatermarked paper",
          color: "Carmine",
          condition: "Mint Never Hinged",
          image: "/placeholder.svg?key=xgcy1",
          rarity: "Common",
          catalogReferences: {
            "Campbell Paterson": "G1a",
            "Stanley Gibbons": "SG 300",
            Scott: "85",
            Michel: "85",
            Yvert: "85",
          },
          pricingByCondition: {
            "Mint Never Hinged": 120,
            "Mint Hinged": 85,
            "Fine Used": 45,
            Used: 25,
            Poor: 5,
          },
        },
        {
          id: "nz-penny-universal-double-print",
          code: "SOA-NZ-002.3",
          name: "1d Universal Double Print",
          year: "1901",
          description: "Error variety with double impression",
          color: "Carmine",
          condition: "Used",
          image: "/placeholder.svg?key=qkpsi",
          rarity: "Very Rare",
          catalogReferences: {
            "Campbell Paterson": "G1a(Z)",
            "Stanley Gibbons": "SG 300a",
            Scott: "85var",
            Michel: "85var",
            Yvert: "85var",
          },
          pricingByCondition: {
            Mint: 5000,
            "Fine Used": 2500,
            Used: 1500,
            Poor: 500,
          },
          catalogNotes:
            "Double impression error caused by paper slippage during printing. Fewer than 20 examples are known.",
        },
      ],
    },
    {
      id: "nz-kiwi",
      code: "SOA-NZ-003",
      title: "Kiwi Definitives",
      country: "New Zealand",
      issueDate: "1935-05-01",
      denomination: "Various",
      description: "Part of the 1935 Pictorial Definitives series featuring New Zealand's iconic flightless bird",
      image: "/placeholder.svg?key=gf0fw",
      issueSeries: "Second Pictorials",
      printMethod: "Recess printing",
      varieties: [
        {
          id: "nz-kiwi-6d-harvesting",
          code: "SOA-NZ-003.1",
          name: "6d Harvesting, Single Watermark",
          year: "1935",
          description: "Initial printing with single NZ and star watermark",
          color: "Scarlet",
          condition: "Mint",
          image: "/placeholder.svg?key=jilyx",
          rarity: "Common",
          catalogReferences: {
            "Campbell Paterson": "L9a",
            "Stanley Gibbons": "SG 563",
            Scott: "195",
          },
        },
        {
          id: "nz-kiwi-6d-harvesting-multi",
          code: "SOA-NZ-003.2",
          name: "6d Harvesting, Multiple Watermark",
          year: "1936",
          description: "Second printing with multiple NZ and star watermark",
          color: "Scarlet",
          condition: "Mint",
          image: "/placeholder.svg?key=88dxg",
          rarity: "Common",
          catalogReferences: {
            "Campbell Paterson": "L9b",
            "Stanley Gibbons": "SG 583",
            Scott: "195a",
          },
        },
        {
          id: "nz-kiwi-3d-maori-girl",
          code: "SOA-NZ-003.3",
          name: "3d Maori Girl, Multiple Watermark",
          year: "1936",
          description: "Second printing with multiple NZ and star watermark",
          color: "Brown",
          condition: "Mint",
          image: "/placeholder.svg?key=6kh2j",
          rarity: "Common",
          catalogReferences: {
            "Campbell Paterson": "L6b",
            "Stanley Gibbons": "SG 579",
            Scott: "192a",
          },
        },
      ],
    },
    {
      id: "nz-silver-jubilee",
      code: "SOA-NZ-004",
      title: "Silver Jubilee",
      country: "New Zealand",
      issueDate: "1935-05-07",
      denomination: "1d",
      description: "Commemorative stamp issued for the Silver Jubilee of King George V",
      image: "/placeholder.svg?key=lrq1y",
      issueSeries: "Commemoratives",
      printMethod: "Recess printing",
      varieties: [
        {
          id: "nz-silver-jubilee-1d",
          code: "SOA-NZ-004.1",
          name: "1d Silver Jubilee",
          year: "1935",
          description: "Standard issue with single NZ and star watermark",
          color: "Purple",
          condition: "Mint",
          image: "/placeholder.svg?key=a891u",
          rarity: "Uncommon",
          catalogReferences: {
            "Campbell Paterson": "S17a",
            "Stanley Gibbons": "SG 573",
            Scott: "185",
          },
        },
        {
          id: "nz-silver-jubilee-plate-flaw",
          code: "SOA-NZ-004.2",
          name: "1d Silver Jubilee Plate Flaw",
          year: "1935",
          description: "Variety with flaw on King's ear (position 4/6)",
          color: "Purple",
          condition: "Used",
          image: "/placeholder.svg?height=300&width=240&query=New Zealand Silver Jubilee plate flaw vintage stamp",
          rarity: "Rare",
          catalogReferences: {
            "Campbell Paterson": "S17a(Z)",
            "Stanley Gibbons": "SG 573var",
            Scott: "185var",
          },
        },
      ],
    },
    {
      id: "nz-health-stamps",
      code: "SOA-NZ-005",
      title: "Health Stamps",
      country: "New Zealand",
      issueDate: "1929-12-11",
      denomination: "Various",
      description: "Annual charity stamps with surcharge to support children's health camps",
      image: "/placeholder.svg?height=300&width=240&query=New Zealand Health vintage stamp",
      issueSeries: "Health Issues",
      printMethod: "Various",
      varieties: [
        {
          id: "nz-health-1929-nurse",
          code: "SOA-NZ-005.1",
          name: "1929 'Nurse' Health Stamp",
          year: "1929",
          description: "First health stamp showing a nurse with child",
          color: "Blue",
          condition: "Mint",
          image: "/placeholder.svg?height=300&width=240&query=New Zealand 1929 Nurse Health vintage stamp",
          rarity: "Scarce",
          catalogReferences: {
            "Campbell Paterson": "T1a",
            "Stanley Gibbons": "SG 544",
            Scott: "B1",
          },
        },
        {
          id: "nz-health-1931-red-boy",
          code: "SOA-NZ-005.2",
          name: "1931 'Red Boy' Health Stamp",
          year: "1931",
          description: "Smiling boy health stamp in red",
          color: "Red and Blue",
          condition: "Mint",
          image: "/placeholder.svg?height=300&width=240&query=New Zealand 1931 Red Boy Health vintage stamp",
          rarity: "Very Rare",
          catalogReferences: {
            "Campbell Paterson": "T3a",
            "Stanley Gibbons": "SG 547",
            Scott: "B3",
          },
        },
        {
          id: "nz-health-1931-blue-boy",
          code: "SOA-NZ-005.3",
          name: "1931 'Blue Boy' Health Stamp",
          year: "1931",
          description: "Smiling boy health stamp in blue",
          color: "Blue and Red",
          condition: "Mint",
          image: "/placeholder.svg?height=300&width=240&query=New Zealand 1931 Blue Boy Health vintage stamp",
          rarity: "Very Rare",
          catalogReferences: {
            "Campbell Paterson": "T3b",
            "Stanley Gibbons": "SG 548",
            Scott: "B4",
          },
        },
        {
          id: "nz-health-1942-children",
          code: "SOA-NZ-005.4",
          name: "1942 Beach Ball Health Stamp",
          year: "1942",
          description: "Shows two children playing with a beach ball",
          color: "Green",
          condition: "Mint",
          image: "/placeholder.svg?height=300&width=240&query=New Zealand 1942 Beach Ball Health vintage stamp",
          rarity: "Uncommon",
          catalogReferences: {
            "Campbell Paterson": "T14a",
            "Stanley Gibbons": "SG 634",
            Scott: "B19",
          },
        },
      ],
    },
    {
      id: "nz-coat-of-arms",
      code: "SOA-NZ-006",
      title: "Coat of Arms",
      country: "New Zealand",
      issueDate: "1956-01-10",
      denomination: "10/-",
      description: "High value definitive featuring the New Zealand Coat of Arms",
      image: "/placeholder.svg?height=300&width=240&query=New Zealand Coat of Arms vintage stamp",
      issueSeries: "Definitives",
      printMethod: "Recess printing",
      varieties: [
        {
          id: "nz-coat-of-arms-blue",
          code: "SOA-NZ-006.1",
          name: "10/- Coat of Arms - Blue",
          year: "1956",
          description: "Standard issue on multiple NZ and star watermarked paper",
          color: "Blue",
          condition: "Mint",
          image: "/placeholder.svg?height=300&width=240&query=New Zealand Coat of Arms blue vintage stamp",
          rarity: "Uncommon",
          catalogReferences: {
            "Campbell Paterson": "N40a",
            "Stanley Gibbons": "SG 732",
            Scott: "309",
          },
        },
        {
          id: "nz-coat-of-arms-inverted",
          code: "SOA-NZ-006.2",
          name: "10/- Coat of Arms - Inverted Watermark",
          year: "1956",
          description: "Error variety with inverted watermark",
          color: "Blue",
          condition: "Mint",
          image:
            "/placeholder.svg?height=300&width=240&query=New Zealand Coat of Arms inverted watermark vintage stamp",
          rarity: "Rare",
          catalogReferences: {
            "Campbell Paterson": "N40a(Z)",
            "Stanley Gibbons": "SG 732w",
            Scott: "309var",
          },
        },
      ],
    },
  ]
}

// Add a new component to explain catalog systems
export function CatalogSystemsInfo() {
  return (
    <div className="bg-white dark:bg-slate-800 border rounded-lg p-6 space-y-4">
      <h3 className="text-xl font-semibold">Understanding Stamp Catalogs</h3>

      <p className="text-muted-foreground">
        Stamp catalogs are essential reference works for collectors, providing standardized identification,
        descriptions, and valuations. Different catalog publishers use their own numbering systems and focus on
        different regions.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="border rounded-md p-4">
          <h4 className="font-medium mb-2">Major World Catalogs</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <span className="font-medium">Stanley Gibbons:</span> British and Commonwealth focus
            </li>
            <li>
              <span className="font-medium">Scott:</span> American catalog with worldwide coverage
            </li>
            <li>
              <span className="font-medium">Michel:</span> German catalog with European emphasis
            </li>
            <li>
              <span className="font-medium">Yvert et Tellier:</span> French catalog with worldwide coverage
            </li>
          </ul>
        </div>

        <div className="border rounded-md p-4">
          <h4 className="font-medium mb-2">Specialized Country Catalogs</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <span className="font-medium">Campbell Paterson:</span> New Zealand specialist
            </li>
            <li>
              <span className="font-medium">Sassone:</span> Italian specialist
            </li>
            <li>
              <span className="font-medium">Facit:</span> Scandinavian specialist
            </li>
            <li>
              <span className="font-medium">ACSC:</span> Australian Commonwealth Specialists&apos; Catalog
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800 border rounded-md p-4 mt-4">
        <h4 className="font-medium flex items-center text-amber-800 dark:text-amber-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          About SOA Catalog Codes
        </h4>
        <p className="text-sm text-amber-800 dark:text-amber-400 mt-2">
          Stamps Of Approval (SOA) uses its own reference system while providing cross-references to major catalog
          systems. Our SOA-XX-###.# format provides a logical, consistent approach to identifying stamps and their
          varieties.
        </p>
      </div>
    </div>
  )
}

// Enhance the StampDatastore component to include catalog filtering
export default function StampDatastore() {
  const [stamps, setStamps] = useState<Stamp[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [countryFilter, setCountryFilter] = useState("all")
  const [catalogFilter, setCatalogFilter] = useState("all") // Add catalog filter
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState("grid")

  const [showCatalogInfo, setShowCatalogInfo] = useState(false) // Toggle for catalog info

  // Load stamps with a simulated delay to show loading state
  useEffect(() => {
    const loadStamps = async () => {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))
      setStamps(generateStamps())
      setLoading(false)
    }

    loadStamps()
  }, [])

  // Get all available catalog systems from the data
  const catalogSystems = useMemo(() => {
    if (!stamps.length) return []

    const systems = new Set<string>()

    stamps.forEach((stamp) => {
      if (stamp.catalogSystems) {
        Object.keys(stamp.catalogSystems).forEach((system) => systems.add(system))
      }

      stamp.varieties.forEach((variety) => {
        if (variety.catalogReferences) {
          Object.keys(variety.catalogReferences).forEach((system) => systems.add(system))
        }
      })
    })

    return Array.from(systems)
  }, [stamps])

  // Filter stamps based on search query, country filter, and catalog filter
  const filteredStamps = useMemo(() => {
    if (!stamps.length) return []

    return stamps.filter((stamp) => {
      const matchesSearch =
        stamp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stamp.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stamp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stamp.country.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCountry = countryFilter === "all" || stamp.country === countryFilter

      // Check if stamp matches catalog filter
      const matchesCatalog =
        catalogFilter === "all" ||
        (stamp.catalogSystems && Object.keys(stamp.catalogSystems).includes(catalogFilter)) ||
        stamp.varieties.some((v) => v.catalogReferences && Object.keys(v.catalogReferences).includes(catalogFilter))

      return matchesSearch && matchesCountry && matchesCatalog
    })
  }, [stamps, searchQuery, countryFilter, catalogFilter])

  // Sort stamps based on the selected sort option
  const sortedStamps = useMemo(() => {
    if (!filteredStamps.length) return []

    return [...filteredStamps].sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime()
        case "newest":
          return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
        case "a-z":
          return a.title.localeCompare(b.title)
        case "z-a":
          return b.title.localeCompare(a.title)
        case "most-varieties":
          return b.varieties.length - a.varieties.length
        default:
          return 0
      }
    })
  }, [filteredStamps, sortBy])

  // Get unique countries for the filter
  const countries = useMemo(() => {
    if (!stamps.length) return []
    const uniqueCountries = new Set(stamps.map((stamp) => stamp.country))
    return Array.from(uniqueCountries)
  }, [stamps])

  const totalVarietiesCount = useMemo(() => {
    return stamps.reduce((count, stamp) => count + stamp.varieties.length, 0)
  }, [stamps])

  // Function to determine the color based on rarity
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Uncommon":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Scarce":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Rare":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "Very Rare":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "Extremely Rare":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  if (loading) {
    return <StampDatastoreLoading />
  }

  return (
    <div className="space-y-6">
      {/* Catalog Systems Information (toggleable) */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Stamp Catalog Database</h2>
        <Button variant="outline" onClick={() => setShowCatalogInfo(!showCatalogInfo)} className="gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          {showCatalogInfo ? "Hide Catalog Info" : "About Catalogs"}
        </Button>
      </div>

      {showCatalogInfo && <CatalogSystemsInfo />}

      {/* Search and filter controls */}
      <div className="bg-white dark:bg-slate-800 border rounded-lg p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, code, or description..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-[180px]">
                <Map className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Filter by country" />
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

            {/* Add catalog system filter */}
            <Select value={catalogFilter} onValueChange={setCatalogFilter}>
              <SelectTrigger className="w-[180px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-muted-foreground"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                </svg>
                <SelectValue placeholder="Filter by catalog" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Catalogs</SelectItem>
                {catalogSystems.map((system) => (
                  <SelectItem key={system} value={system}>
                    {system}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <ArrowUpDown className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Date</SelectLabel>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Name</SelectLabel>
                  <SelectItem value="a-z">A to Z</SelectItem>
                  <SelectItem value="z-a">Z to A</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Other</SelectLabel>
                  <SelectItem value="most-varieties">Most Varieties</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
                aria-label="Grid view"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground mt-4">
          Showing {filteredStamps.length} of {stamps.length} stamps with {totalVarietiesCount} total varieties
        </div>
      </div>

      {/* Stamps display */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedStamps.map((stamp) => (
            <Link
              href={`/catalogdetail/${stamp.id}`}
              key={stamp.id}
              className="block group"

            >
              <Card className="h-full overflow-hidden transition-all hover:shadow-md group-hover:border-slate-400 dark:group-hover:border-slate-600">
                <div className="relative">
                  <div className="aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={stamp.image || "/placeholder.svg"}
                      alt={stamp.title}
                      className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <Badge
                    className="absolute top-3 right-3 font-mono bg-white/90 dark:bg-black/80 backdrop-blur-sm text-xs"
                    variant="outline"
                  >
                    {stamp.code}
                  </Badge>

                  {/* Add catalog badges */}
                  {stamp.catalogSystems && Object.keys(stamp.catalogSystems).length > 0 && (
                    <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
                      {Object.keys(stamp.catalogSystems)
                        .slice(0, 2)
                        .map((system) => (
                          <Badge
                            key={system}
                            className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                          >
                            {system.split(" ")[0]}
                          </Badge>
                        ))}
                      {Object.keys(stamp.catalogSystems).length > 2 && (
                        <Badge className="text-xs bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                          +{Object.keys(stamp.catalogSystems).length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-amber-700 dark:group-hover:text-amber-500 transition-colors">
                    {stamp.title}
                  </h3>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Map className="h-3 w-3 mr-1" />
                    {stamp.country}
                    <span className="mx-2">•</span>
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(stamp.issueDate).getFullYear()}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{stamp.description}</p>

                  <div className="mt-3 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Denomination:</span>
                      <span className="font-medium">{stamp.denomination}</span>
                    </div>
                    {stamp.issueSeries && (
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Series:</span>
                        <span className="font-medium">{stamp.issueSeries}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Varieties:</span>
                      <span className="font-medium">{stamp.varieties.length}</span>
                    </div>
                    {/* Add catalog references count */}
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Catalog References:</span>
                      <span className="font-medium">
                        {stamp.catalogSystems ? Object.keys(stamp.catalogSystems).length : 0}
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                  <Button
                    variant="secondary"
                    className="w-full text-sm group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors"
                    asChild
                  >
                    <Link href={`/catalog/${stamp.id}`}>View Varieties</Link>
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedStamps.map((stamp) => (
            <Link
              href={`/catalogdetail/${stamp.id}`}
              key={stamp.id}
              className="block group"

            >
              <Card className="transition-all hover:shadow-md group-hover:border-slate-400 dark:group-hover:border-slate-600">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-48 p-4 relative">
                    <div className="aspect-[3/4] overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800">
                      <img
                        src={stamp.image || "/placeholder.svg"}
                        alt={stamp.title}
                        className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <Badge
                      className="absolute top-6 right-6 font-mono bg-white/90 dark:bg-black/80 backdrop-blur-sm text-xs"
                      variant="outline"
                    >
                      {stamp.code}
                    </Badge>

                    {/* Add catalog badges */}
                    {stamp.catalogSystems && Object.keys(stamp.catalogSystems).length > 0 && (
                      <div className="absolute bottom-6 left-6 flex flex-wrap gap-1">
                        {Object.keys(stamp.catalogSystems)
                          .slice(0, 2)
                          .map((system) => (
                            <Badge
                              key={system}
                              className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                            >
                              {system.split(" ")[0]}
                            </Badge>
                          ))}
                        {Object.keys(stamp.catalogSystems).length > 2 && (
                          <Badge className="text-xs bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                            +{Object.keys(stamp.catalogSystems).length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex flex-wrap justify-between items-start mb-2 gap-2">
                      <h3 className="font-semibold text-lg group-hover:text-amber-700 dark:group-hover:text-amber-500 transition-colors">
                        {stamp.title}
                      </h3>
                      <div className="flex items-center gap-1">
                        <Badge variant="secondary" className="text-xs">
                          {stamp.varieties.length} {stamp.varieties.length === 1 ? "variety" : "varieties"}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <Map className="h-3 w-3 mr-1" />
                      {stamp.country}
                      <span className="mx-2">•</span>
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(stamp.issueDate).getFullYear()}
                      {stamp.issueSeries && (
                        <>
                          <span className="mx-2">•</span>
                          <span>{stamp.issueSeries}</span>
                        </>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">{stamp.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 mb-4">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Denomination: </span>
                        <span className="font-medium">{stamp.denomination}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Issue Date: </span>
                        <span className="font-medium">{stamp.issueDate}</span>
                      </div>
                      {stamp.printMethod && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Print Method: </span>
                          <span className="font-medium">{stamp.printMethod}</span>
                        </div>
                      )}

                      {/* Add catalog systems information */}
                      {stamp.catalogSystems && Object.keys(stamp.catalogSystems).length > 0 && (
                        <div className="text-sm col-span-2">
                          <span className="text-muted-foreground">Catalog References: </span>
                          <span className="font-medium">
                            {Object.entries(stamp.catalogSystems).map(([system, info], index, arr) => (
                              <span key={system}>
                                {system} ({info.code}){index < arr.length - 1 ? ", " : ""}
                              </span>
                            ))}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {stamp.varieties.slice(0, 3).map((variety) => (
                        <Badge
                          key={variety.id}
                          variant="default"
                          className={`text-xs ${getRarityColor(variety.rarity)}`}
                        >
                          {variety.name.length > 30 ? variety.name.substring(0, 30) + "..." : variety.name}
                        </Badge>
                      ))}
                      {stamp.varieties.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{stamp.varieties.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <Button
                      variant="secondary"
                      className="mt-4 text-sm group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors"
                      asChild
                    >
                      <Link href={`/catalog/${stamp.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Empty state */}
      {sortedStamps.length === 0 && (
        <div className="text-center py-12 border rounded-lg bg-slate-50 dark:bg-slate-800">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
            <SlidersHorizontal className="h-8 w-8 text-slate-500 dark:text-slate-400" />
          </div>
          <h3 className="text-xl font-medium mb-2">No stamps found</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            No stamps match your current search criteria. Try adjusting your filters or search terms.
          </p>
          <Button
            variant="outline"
            className="mx-auto"
            onClick={() => {
              setSearchQuery("")
              setCountryFilter("all")
              setCatalogFilter("all")
            }}
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  )
}

// Loading skeleton component remains the same
function StampDatastoreLoading() {
  return (
    <div className="space-y-6">
      {/* Search bar loading */}
      <div className="bg-white dark:bg-slate-800 border rounded-lg p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <div className="flex flex-col sm:flex-row gap-2">
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-[88px]" />
          </div>
        </div>
        <Skeleton className="h-4 w-48 mt-4" />
      </div>

      {/* Grid view loading */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <Card key={n} className="overflow-hidden">
            <Skeleton className="aspect-[3/4] w-full" />
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <div className="space-y-2 pt-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
