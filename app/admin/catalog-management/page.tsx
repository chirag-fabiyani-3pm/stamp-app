"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Upload,
  Database,
  CheckCircle2,
  Clock,
  BookOpen,
  DollarSign,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Calendar,
  MapPin,
  Tag,
  Image as ImageIcon,
} from "lucide-react"

// Sample data for demonstration
const recentIngestions = [
  {
    id: "ing-001",
    source: "Stanley Gibbons 2023 - Commonwealth",
    status: "completed",
    items: 2450,
    startDate: "2023-12-01",
    completionDate: "2023-12-02",
  },
  {
    id: "ing-002",
    source: "Scott 2023 Volume 3 (G-I)",
    status: "processing",
    items: 1820,
    startDate: "2023-12-03",
    completionDate: null,
    progress: 68,
  },
  {
    id: "ing-003",
    source: "Cherrystone Auction Dec 2023",
    status: "completed",
    items: 520,
    startDate: "2023-12-01",
    completionDate: "2023-12-01",
    type: "price",
  },
]

const sampleExtractedData = [
  {
    id: "ext-001",
    catalogCode: "SG 185",
    soaCode: "SOA-NZ-004.1",
    name: "Silver Jubilee",
    country: "New Zealand",
    year: "1935",
    description: "Silver Jubilee of King George V",
    catalogPrice: "£12.50",
    marketPrice: "£15.00",
    condition: "Mint",
    rarity: "Common",
    color: "Purple",
    denomination: "1d",
    perforation: "14",
    watermark: "Single NZ and Star",
    designer: "R.M. Savage",
    printer: "Government Printing Office",
    imageUrl: "/stamps/nz-silver-jubilee.jpg",
    notes: "First commemorative stamp issued by New Zealand",
    category: "Commemorative",
    series: "Royal Events",
  },
  {
    id: "ext-002",
    catalogCode: "SC 185",
    soaCode: "SOA-NZ-004.1",
    name: "Silver Jubilee",
    country: "New Zealand",
    year: "1935",
    description: "Silver Jubilee of King George V",
    catalogPrice: "$15.00",
    marketPrice: "$18.50",
    condition: "Used",
    rarity: "Common",
    color: "Purple",
    denomination: "1d",
    perforation: "14",
    watermark: "Single NZ and Star",
    designer: "R.M. Savage",
    printer: "Government Printing Office",
    imageUrl: "/stamps/nz-silver-jubilee.jpg",
    notes: "Scott catalog variant",
    category: "Commemorative",
    series: "Royal Events",
  },
  {
    id: "ext-003",
    catalogCode: "SG 556",
    soaCode: "SOA-GB-012.3",
    name: "Penny Black",
    country: "Great Britain",
    year: "1840",
    description: "World's first adhesive postage stamp",
    catalogPrice: "£3,000.00",
    marketPrice: "£3,500.00",
    condition: "Mint",
    rarity: "Very Rare",
    color: "Black",
    denomination: "1d",
    perforation: "Imperforate",
    watermark: "None",
    designer: "Rowland Hill",
    printer: "Perkins Bacon",
    imageUrl: "/stamps/penny-black.jpg",
    notes: "Historic first postage stamp",
    category: "Definitive",
    series: "Victorian",
  },
  {
    id: "ext-004",
    catalogCode: "SG 102",
    soaCode: "SOA-AU-008.2",
    name: "Kangaroo and Map",
    country: "Australia",
    year: "1913",
    description: "First Australian Commonwealth stamp",
    catalogPrice: "£45.00",
    marketPrice: "£52.00",
    condition: "Used",
    rarity: "Uncommon",
    color: "Red",
    denomination: "2d",
    perforation: "11½ x 12",
    watermark: "Crown over A",
    designer: "Blamire Young",
    printer: "Commonwealth Bank Note Printing Branch",
    imageUrl: "/stamps/kangaroo-map.jpg",
    notes: "First stamp of independent Australia",
    category: "Definitive",
    series: "Kangaroo",
  },
  {
    id: "ext-005",
    catalogCode: "SG 245",
    soaCode: "SOA-CA-015.1",
    name: "Maple Leaf",
    country: "Canada",
    year: "1851",
    description: "Three-penny Beaver",
    catalogPrice: "$2,500.00",
    marketPrice: "$2,800.00",
    condition: "Mint",
    rarity: "Rare",
    color: "Orange-red",
    denomination: "3d",
    perforation: "Imperforate",
    watermark: "None",
    designer: "Sandford Fleming",
    printer: "Rawdon, Wright, Hatch & Edson",
    imageUrl: "/stamps/three-penny-beaver.jpg",
    notes: "First stamp to feature an animal",
    category: "Definitive",
    series: "Provincial",
  },
  {
    id: "ext-006",
    catalogCode: "SG 78",
    soaCode: "SOA-US-003.4",
    name: "Inverted Jenny",
    country: "United States",
    year: "1918",
    description: "24-cent airmail stamp with inverted airplane",
    catalogPrice: "$1,350,000.00",
    marketPrice: "$1,500,000.00",
    condition: "Mint",
    rarity: "Extremely Rare",
    color: "Carmine rose and blue",
    denomination: "24¢",
    perforation: "11",
    watermark: "None",
    designer: "Clair Aubrey Huston",
    printer: "Bureau of Engraving and Printing",
    imageUrl: "/stamps/inverted-jenny.jpg",
    notes: "Famous error stamp - only 100 copies exist",
    category: "Airmail",
    series: "Aviation",
  },
  {
    id: "ext-007",
    catalogCode: "SG 334",
    soaCode: "SOA-IN-022.1",
    name: "King George VI",
    country: "India",
    year: "1937",
    description: "Coronation commemorative",
    catalogPrice: "₹150.00",
    marketPrice: "₹180.00",
    condition: "Used",
    rarity: "Common",
    color: "Green",
    denomination: "1a",
    perforation: "13½ x 14",
    watermark: "Multiple Stars",
    designer: "Edmund Dulac",
    printer: "Security Printing Press",
    imageUrl: "/stamps/george-vi-coronation.jpg",
    notes: "Part of coronation series",
    category: "Commemorative",
    series: "Royal Events",
  },
  {
    id: "ext-008",
    catalogCode: "SG 445",
    soaCode: "SOA-ZA-018.3",
    name: "Union Buildings",
    country: "South Africa",
    year: "1926",
    description: "Architectural landmark",
    catalogPrice: "R85.00",
    marketPrice: "R95.00",
    condition: "Mint",
    rarity: "Uncommon",
    color: "Blue",
    denomination: "2½d",
    perforation: "14",
    watermark: "Multiple Crown CA",
    designer: "Herbert Baker",
    printer: "Waterlow & Sons",
    imageUrl: "/stamps/union-buildings.jpg",
    notes: "Features government buildings in Pretoria",
    category: "Definitive",
    series: "Architecture",
  },
  {
    id: "ext-009",
    catalogCode: "SG 667",
    soaCode: "SOA-FR-025.7",
    name: "Marianne",
    country: "France",
    year: "1945",
    description: "Liberation of France",
    catalogPrice: "€25.00",
    marketPrice: "€30.00",
    condition: "Mint",
    rarity: "Common",
    color: "Blue",
    denomination: "2F",
    perforation: "14 x 13½",
    watermark: "None",
    designer: "Pierre Gandon",
    printer: "Imprimerie des Timbres-Poste",
    imageUrl: "/stamps/marianne-liberation.jpg",
    notes: "Symbol of French Republic",
    category: "Definitive",
    series: "Marianne",
  },
  {
    id: "ext-010",
    catalogCode: "SG 889",
    soaCode: "SOA-DE-031.2",
    name: "Brandenburg Gate",
    country: "Germany",
    year: "1966",
    description: "Historic landmark in Berlin",
    catalogPrice: "€8.50",
    marketPrice: "€12.00",
    condition: "Used",
    rarity: "Common",
    color: "Brown",
    denomination: "20pf",
    perforation: "14",
    watermark: "Multiple DBP",
    designer: "Karl Oskar Blase",
    printer: "Bundesdruckerei",
    imageUrl: "/stamps/brandenburg-gate.jpg",
    notes: "Part of German landmarks series",
    category: "Definitive",
    series: "Architecture",
  },
  {
    id: "ext-011",
    catalogCode: "SG 1234",
    soaCode: "SOA-JP-045.8",
    name: "Cherry Blossoms",
    country: "Japan",
    year: "1961",
    description: "National flower of Japan",
    catalogPrice: "¥450.00",
    marketPrice: "¥520.00",
    condition: "Mint",
    rarity: "Uncommon",
    color: "Pink",
    denomination: "10¥",
    perforation: "13",
    watermark: "None",
    designer: "Hiroshi Tanaka",
    printer: "Government Printing Bureau",
    imageUrl: "/stamps/cherry-blossoms.jpg",
    notes: "Beautiful floral design",
    category: "Definitive",
    series: "Flora",
  },
  {
    id: "ext-012",
    catalogCode: "SG 456",
    soaCode: "SOA-IT-019.4",
    name: "Colosseum",
    country: "Italy",
    year: "1953",
    description: "Ancient Roman amphitheater",
    catalogPrice: "€35.00",
    marketPrice: "€42.00",
    condition: "Mint",
    rarity: "Uncommon",
    color: "Brown",
    denomination: "100L",
    perforation: "14",
    watermark: "Winged Wheel",
    designer: "Renato Mura",
    printer: "Istituto Poligrafico dello Stato",
    imageUrl: "/stamps/colosseum.jpg",
    notes: "UNESCO World Heritage Site",
    category: "Definitive",
    series: "Architecture",
  },
  {
    id: "ext-013",
    catalogCode: "SG 789",
    soaCode: "SOA-BR-028.1",
    name: "Christ the Redeemer",
    country: "Brazil",
    year: "1959",
    description: "Iconic statue in Rio de Janeiro",
    catalogPrice: "R$45.00",
    marketPrice: "R$55.00",
    condition: "Used",
    rarity: "Common",
    color: "Green",
    denomination: "2.50Cr",
    perforation: "11½",
    watermark: "Multiple Stars",
    designer: "Aldo Malagoli",
    printer: "Casa da Moeda do Brasil",
    imageUrl: "/stamps/christ-redeemer.jpg",
    notes: "One of the New Seven Wonders",
    category: "Commemorative",
    series: "Landmarks",
  },
  {
    id: "ext-014",
    catalogCode: "SG 321",
    soaCode: "SOA-RU-012.9",
    name: "Sputnik",
    country: "Russia",
    year: "1957",
    description: "First artificial satellite",
    catalogPrice: "₽850.00",
    marketPrice: "₽1,200.00",
    condition: "Mint",
    rarity: "Rare",
    color: "Red",
    denomination: "40k",
    perforation: "12½",
    watermark: "None",
    designer: "Vasily Zavyalov",
    printer: "Goznak",
    imageUrl: "/stamps/sputnik.jpg",
    notes: "Space age commemorative",
    category: "Commemorative",
    series: "Space",
  },
  {
    id: "ext-015",
    catalogCode: "SG 654",
    soaCode: "SOA-ES-033.6",
    name: "Sagrada Familia",
    country: "Spain",
    year: "1969",
    description: "Gaudí's masterpiece in Barcelona",
    catalogPrice: "€18.00",
    marketPrice: "€22.00",
    condition: "Mint",
    rarity: "Common",
    color: "Purple",
    denomination: "3Pts",
    perforation: "13",
    watermark: "None",
    designer: "José María Sánchez",
    printer: "Fábrica Nacional de Moneda y Timbre",
    imageUrl: "/stamps/sagrada-familia.jpg",
    notes: "Architectural marvel",
    category: "Definitive",
    series: "Architecture",
  },
  {
    id: "ext-016",
    catalogCode: "SG 987",
    soaCode: "SOA-CH-041.3",
    name: "Matterhorn",
    country: "Switzerland",
    year: "1965",
    description: "Iconic Alpine peak",
    catalogPrice: "CHF 12.00",
    marketPrice: "CHF 15.00",
    condition: "Used",
    rarity: "Common",
    color: "Blue",
    denomination: "30c",
    perforation: "11½",
    watermark: "None",
    designer: "Hans Erni",
    printer: "PTT",
    imageUrl: "/stamps/matterhorn.jpg",
    notes: "Swiss natural landmark",
    category: "Definitive",
    series: "Landscapes",
  },
  {
    id: "ext-017",
    catalogCode: "SG 543",
    soaCode: "SOA-EG-016.7",
    name: "Pyramids of Giza",
    country: "Egypt",
    year: "1954",
    description: "Ancient wonder of the world",
    catalogPrice: "£E 25.00",
    marketPrice: "£E 35.00",
    condition: "Mint",
    rarity: "Uncommon",
    color: "Yellow",
    denomination: "4m",
    perforation: "13½ x 13",
    watermark: "Multiple UAR",
    designer: "Hussein Bicar",
    printer: "Survey Department",
    imageUrl: "/stamps/pyramids-giza.jpg",
    notes: "Last surviving ancient wonder",
    category: "Definitive",
    series: "Monuments",
  },
  {
    id: "ext-018",
    catalogCode: "SG 876",
    soaCode: "SOA-MX-024.5",
    name: "Aztec Calendar",
    country: "Mexico",
    year: "1963",
    description: "Pre-Columbian artifact",
    catalogPrice: "$85.00",
    marketPrice: "$95.00",
    condition: "Mint",
    rarity: "Uncommon",
    color: "Gold",
    denomination: "20c",
    perforation: "14",
    watermark: "None",
    designer: "Francisco Eppens",
    printer: "Talleres de Impresión",
    imageUrl: "/stamps/aztec-calendar.jpg",
    notes: "Ancient Mesoamerican culture",
    category: "Commemorative",
    series: "Heritage",
  },
  {
    id: "ext-019",
    catalogCode: "SG 432",
    soaCode: "SOA-SE-037.2",
    name: "Nobel Prize",
    country: "Sweden",
    year: "1968",
    description: "Alfred Nobel commemoration",
    catalogPrice: "SEK 45.00",
    marketPrice: "SEK 55.00",
    condition: "Used",
    rarity: "Common",
    color: "Gold",
    denomination: "55ö",
    perforation: "12½",
    watermark: "None",
    designer: "Sven Markelius",
    printer: "Postens Frimärkstyckeri",
    imageUrl: "/stamps/nobel-prize.jpg",
    notes: "Prestigious international award",
    category: "Commemorative",
    series: "Nobel",
  },
  {
    id: "ext-020",
    catalogCode: "SG 765",
    soaCode: "SOA-NO-029.8",
    name: "Northern Lights",
    country: "Norway",
    year: "1971",
    description: "Aurora Borealis phenomenon",
    catalogPrice: "NOK 28.00",
    marketPrice: "NOK 35.00",
    condition: "Mint",
    rarity: "Common",
    color: "Green",
    denomination: "90ö",
    perforation: "13",
    watermark: "None",
    designer: "Arne Johnson",
    printer: "Emil Moestue A/S",
    imageUrl: "/stamps/northern-lights.jpg",
    notes: "Natural light display",
    category: "Definitive",
    series: "Nature",
  },
]

export default function CatalogManagementPage() {
  const [activeTab, setActiveTab] = useState("upload")
  const [selectedCatalogType, setSelectedCatalogType] = useState("stamp")
  const [selectedProcessingType, setSelectedProcessingType] = useState("ai")
  const [selectedSource, setSelectedSource] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  // Catalog database state
  const [searchTerm, setSearchTerm] = useState("")
  const [countryFilter, setCountryFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [rarityFilter, setRarityFilter] = useState("all")
  const [conditionFilter, setConditionFilter] = useState("all")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedStamp, setSelectedStamp] = useState<any>(null)

  // New Zealand stamp catalogs
  const nzStampCatalogs = [
    // Stanley Gibbons (Most comprehensive)
    "Stanley Gibbons Commonwealth & Empire 2024 - New Zealand",
    "Stanley Gibbons Pacific 2024 - New Zealand",
    "Stanley Gibbons New Zealand Specialized 2024",
    
    // Scott Catalogs
    "Scott Standard Postage Stamp Catalogue 2024 - Volume 4 (New Zealand)",
    "Scott Classic Specialized 2024 - New Zealand",
    
    // Michel Catalogs
    "Michel Übersee-Katalog 2024 - Australien/Ozeanien (New Zealand)",
    "Michel New Zealand Specialized 2024",
    
    // Local New Zealand Catalogs
    "Handbook of New Zealand Stamps - 10th Edition (2023)",
    "New Zealand Postage Stamps Catalogue - Warwick Paterson (2024)",
    "Campbell Paterson New Zealand Catalogue - 71st Edition (2024)",
    "Simplified Catalogue of New Zealand Stamps - 63rd Edition (2023)",
    
    // Auction Houses & Price Guides
    "Cherrystone Auctions - New Zealand Specialized (2024)",
    "Spink Auctions - British Commonwealth including New Zealand (2024)",
    "Grosvenor Auctions - New Zealand Collection (2024)",
    "Leski Auctions - New Zealand Stamps (2024)",
    "Webb's Auction House - New Zealand Philatelic (2024)",
    
    // Online Catalogs & Databases
    "New Zealand Post Official Catalogue 2024",
    "Colnect New Zealand Stamps Database",
    "StampWorld New Zealand Collection",
    "WorthPoint New Zealand Stamps Price Guide",
    
    // Specialized Publications
    "New Zealand Stamp Collector Magazine Annual (2024)",
    "Kiwi Journal - Royal Philatelic Society of New Zealand (2024)",
    "New Zealand Postmark Gazette Annual (2023)",
    "Postmarks of New Zealand - Specialized Study (2024)",
    
    // First Day Cover Catalogs
    "New Zealand First Day Cover Catalogue - Millennium Edition (2024)",
    "FDC Publishing - New Zealand Covers (2024)",
    
    // Revenue & Fiscal Catalogs
    "Barefoot New Zealand Revenue Catalogue - 8th Edition (2023)",
    "New Zealand Fiscal & Revenue Stamps - Specialized (2024)",
    
    // Postal History
    "New Zealand Postal History & Postmarks - 4th Edition (2024)",
    "Maritime Mail of New Zealand - Specialized Study (2023)",
    
    // Other
    "Custom/Other Catalog"
  ]

  // Auction houses for price data
  const nzAuctionHouses = [
    "Cherrystone Auctions - New Zealand Sale (2024)",
    "Spink Auctions - British Commonwealth Sale (2024)", 
    "Grosvenor Auctions - New Zealand Specialized (2024)",
    "Leski Auctions - Australian & New Zealand (2024)",
    "Webb's Auction House - Philatelic Sale (2024)",
    "Mowbray Collectibles - New Zealand Auction (2024)",
    "John Mowbray International - NZ Stamps (2024)",
    "Custom/Other Auction House"
  ]

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Completed
          </Badge>
        )
      case "processing":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" /> Processing
          </Badge>
        )
      case "queued":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="h-3 w-3 mr-1" /> Queued
          </Badge>
        )
      case "validation":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            <AlertCircle className="h-3 w-3 mr-1" /> Needs Validation
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  // Handle file selection
  const handleFileSelect = () => {
    // Simulate file selection and upload
    setIsUploading(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  // Filter and sort data
  const filteredAndSortedData = sampleExtractedData
    .filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.catalogCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.soaCode.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCountry = countryFilter === "all" || item.country === countryFilter
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
      const matchesRarity = rarityFilter === "all" || item.rarity === rarityFilter
      const matchesCondition = conditionFilter === "all" || item.condition === conditionFilter

      return matchesSearch && matchesCountry && matchesCategory && matchesRarity && matchesCondition
    })
    .sort((a, b) => {
      const aValue = a[sortField as keyof typeof a]
      const bValue = b[sortField as keyof typeof b]

      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

  // Pagination
  const totalItems = filteredAndSortedData.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = filteredAndSortedData.slice(startIndex, endIndex)

  // Get unique values for filters
  const countries = [...new Set(sampleExtractedData.map(item => item.country))].sort()
  const categories = [...new Set(sampleExtractedData.map(item => item.category))].sort()
  const rarities = [...new Set(sampleExtractedData.map(item => item.rarity))].sort()
  const conditions = [...new Set(sampleExtractedData.map(item => item.condition))].sort()

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Get sort icon
  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />
    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("")
    setCountryFilter("all")
    setCategoryFilter("all")
    setRarityFilter("all")
    setConditionFilter("all")
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Catalog Management</h1>
          <p className="text-muted-foreground">Manage stamp catalog data through AI-powered ingestion and processing</p>
        </div>
      </div>

      <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" /> Data Ingestion
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center gap-2">
            <Clock className="h-4 w-4" /> Processing History
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" /> Catalog Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Catalog Data Ingestion</CardTitle>
              <CardDescription>
                Upload and process catalog pages or auction data to expand the stamp catalog database
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sourceName">Source Catalog</Label>
                  <Select value={selectedSource} onValueChange={setSelectedSource}>
                    <SelectTrigger id="sourceName">
                      <SelectValue placeholder={
                        selectedCatalogType === "stamp"
                          ? "Select a stamp catalog..."
                          : "Select an auction house..."
                      } />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] overflow-y-auto">
                      {selectedCatalogType === "stamp" 
                        ? nzStampCatalogs.map((catalog) => (
                            <SelectItem key={catalog} value={catalog}>
                              {catalog}
                            </SelectItem>
                          ))
                        : nzAuctionHouses.map((auction) => (
                            <SelectItem key={auction} value={auction}>
                              {auction}
                            </SelectItem>
                          ))
                      }
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border-2 border-dashed rounded-md p-8 text-center">
                <div className="flex flex-col items-center justify-center gap-4">
                  <Upload className="h-12 w-12 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Drag and drop files or click to browse</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedCatalogType === "stamp"
                        ? "Upload scanned catalog pages (PDF, JPG, PNG)"
                        : "Upload auction results or price lists (PDF, CSV, XLS)"}
                    </p>
                  </div>
                  <Button onClick={handleFileSelect}>Select Files</Button>
                </div>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}

              <div className="flex flex-col gap-2 p-4 rounded-md bg-blue-50 border border-blue-200">
                <h3 className="font-medium flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                  How the AI Agent Works
                </h3>
                <p className="text-sm text-muted-foreground">
                  Our AI scanning agent will extract all catalog information into our system, including:
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside ml-4 space-y-1">
                  <li>Stamp descriptions and catalog references</li>
                  <li>Stamp images and visual characteristics</li>
                  <li>Pricing information and rarity indicators</li>
                  <li>Automatically generate SOA (Stamps of Approval) universal codes</li>
                  {selectedCatalogType === "price" && (
                    <li>Auction results and recent market prices</li>
                  )}
                </ul>
              </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button disabled={isUploading}>
                {isUploading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Process with AI"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="recent" className="space-y-6 pt-6">
        <Card>
          <CardHeader>
            <CardTitle>Processing History</CardTitle>
            <CardDescription>
              Track the status and progress of catalog data processing jobs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Completed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentIngestions.map((ingestion) => (
                  <TableRow key={ingestion.id}>
                    <TableCell className="font-medium">{ingestion.source}</TableCell>
                    <TableCell>
                      {ingestion.type === "price" ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          <DollarSign className="h-3 w-3 mr-1" /> Price Data
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          <BookOpen className="h-3 w-3 mr-1" /> Catalog
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(ingestion.status)}</TableCell>
                    <TableCell>{ingestion.status === "processing" ? "-" : ingestion.items.toLocaleString()}</TableCell>
                    <TableCell>{ingestion.startDate}</TableCell>
                    <TableCell>{ingestion.completionDate || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="data" className="space-y-6 pt-6">
        <Card>
          <CardHeader>
            <CardTitle>Catalog Database</CardTitle>
            <CardDescription>
              Browse and manage stamps and pricing information in the catalog database
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col gap-4">
              {/* Search Bar */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search stamps by name, description, catalog code, or SOA code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" onClick={resetFilters}>
                  Clear Filters
                </Button>
              </div>

              {/* Filters Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
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

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={rarityFilter} onValueChange={setRarityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Rarity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Rarities</SelectItem>
                    {rarities.map((rarity) => (
                      <SelectItem key={rarity} value={rarity}>
                        {rarity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={conditionFilter} onValueChange={setConditionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Conditions</SelectItem>
                    {conditions.map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 per page</SelectItem>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="25">25 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Results Summary */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} stamps
                </span>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
              </div>
            </div>

            {/* Table */}
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Actions</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("name")}
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                      >
                        Stamp {getSortIcon("name")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("country")}
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                      >
                        Country {getSortIcon("country")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("year")}
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                      >
                        Year {getSortIcon("year")}
                      </Button>
                    </TableHead>
                    <TableHead>Catalog Code</TableHead>
                    <TableHead>SOA Code</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("catalogPrice")}
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                      >
                        Catalog Price {getSortIcon("catalogPrice")}
                      </Button>
                    </TableHead>
                    <TableHead>Market Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedStamp(item)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <ImageIcon className="h-5 w-5" />
                                {item.name} ({item.year})
                              </DialogTitle>
                              <DialogDescription>
                                Detailed information for {item.catalogCode}
                              </DialogDescription>
                            </DialogHeader>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Image Placeholder */}
                              <div className="space-y-4">
                                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                                  <div className="text-center text-muted-foreground">
                                    <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                                    <p className="text-sm">Stamp Image</p>
                                    <p className="text-xs">{item.imageUrl}</p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="text-center p-3 bg-muted rounded-lg">
                                    <div className="text-lg font-semibold">{item.catalogPrice}</div>
                                    <div className="text-sm text-muted-foreground">Catalog Price</div>
                                  </div>
                                  <div className="text-center p-3 bg-muted rounded-lg">
                                    <div className="text-lg font-semibold">{item.marketPrice}</div>
                                    <div className="text-sm text-muted-foreground">Market Price</div>
                                  </div>
                                </div>
                              </div>

                              {/* Details */}
                              <div className="space-y-4">
                                <div>
                                  <h3 className="font-semibold mb-2">Basic Information</h3>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Name:</span>
                                      <span className="font-medium">{item.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Description:</span>
                                      <span className="font-medium text-right">{item.description}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Country:</span>
                                      <span className="font-medium flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {item.country}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Year:</span>
                                      <span className="font-medium flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {item.year}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Category:</span>
                                      <Badge variant="outline">{item.category}</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Series:</span>
                                      <span className="font-medium">{item.series}</span>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h3 className="font-semibold mb-2">Catalog Information</h3>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Catalog Code:</span>
                                      <Badge variant="outline" className="font-mono">{item.catalogCode}</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">SOA Code:</span>
                                      <Badge className="font-mono">{item.soaCode}</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Condition:</span>
                                      <Badge variant={item.condition === "Mint" ? "default" : "secondary"}>
                                        {item.condition}
                                      </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Rarity:</span>
                                      <Badge
                                        variant={
                                          item.rarity === "Extremely Rare" ? "destructive" :
                                            item.rarity === "Very Rare" ? "destructive" :
                                              item.rarity === "Rare" ? "default" :
                                                item.rarity === "Uncommon" ? "secondary" : "outline"
                                        }
                                      >
                                        {item.rarity}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h3 className="font-semibold mb-2">Technical Details</h3>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Denomination:</span>
                                      <span className="font-medium">{item.denomination}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Color:</span>
                                      <span className="font-medium">{item.color}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Perforation:</span>
                                      <span className="font-medium">{item.perforation}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Watermark:</span>
                                      <span className="font-medium">{item.watermark}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Designer:</span>
                                      <span className="font-medium">{item.designer}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Printer:</span>
                                      <span className="font-medium text-right">{item.printer}</span>
                                    </div>
                                  </div>
                                </div>

                                {item.notes && (
                                  <div>
                                    <h3 className="font-semibold mb-2">Notes</h3>
                                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                                      {item.notes}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {item.country}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {item.year}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">
                          {item.catalogCode}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="font-mono text-xs">
                          {item.soaCode}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{item.catalogPrice}</TableCell>
                      <TableCell className="font-medium">{item.marketPrice}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNumber}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNumber)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
    </div >
  )
}
