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
import { useToast } from "@/hooks/use-toast"
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
  FileText,
  X,
} from "lucide-react"

// API Response Types
interface ModelError {
  key: string;
  value: string;
}

// The actual API response - returns this object directly
interface CatalogExtractionResult {
  id: string;
  catalogName: string;
  processStartDatetime: string | null;
  processEndDatetime: string | null;
  status: number;
  statusName: string;
  totalPagesInCatalog: number;
  totalStampsInCatalog: number;
  stampsExtractedCount: number;
  stage: number;
  stageName: string;
  error: string | null;
}

// This was the expected structure but API returns CatalogExtractionResult directly
interface CatalogExtractionResponse {
  id: string;
  isSuccess: boolean;
  notFound: boolean;
  message: string;
  modelErrors: ModelError[];
  result: CatalogExtractionResult;
}

// Processing History API Response Types
interface ProcessingHistoryItem {
  id: string;
  catalogName: string;
  processStartDatetime: string | null;
  processEndDatetime: string | null;
  status: number;
  statusName: string;
  totalPagesInCatalog: number;
  totalStampsInCatalog: number;
  stampsExtractedCount: number;
  stage: number;
  stageName: string;
  error: string | null;
}

interface ProcessingHistoryResponse {
  items: ProcessingHistoryItem[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// Status and Stage mappings
const CatalogUploadStatus = {
  0: "Idle",
  1: "Processing", 
  2: "Completed",
  3: "Failed"
} as const;

const CatalogUploadStage = {
  0: "Ready",
  1: "Conversion",
  2: "Extraction", 
  3: "Generation"
} as const;

// API Response Types for Stamp Catalog
interface StampCatalogItem {
  id: string;
  catalogExtractionProcessId: string | null;
  stampCatalogCode: string;
  name: string;
  publisher: string | null;
  country: string;
  stampImageUrl: string;
  catalogName: string;
  catalogNumber: string;
  seriesName: string;
  issueDate: string;
  issueYear: number | null;
  denominationValue: number;
  denominationCurrency: string;
  denominationSymbol: string;
  color: string;
  paperType: string | null;
}

interface StampCatalogResponse {
  items: StampCatalogItem[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

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

// Add JWT helper function
const getJWT = (): string | null => {
  // Try to get from localStorage first
  if (typeof window !== 'undefined') {
    try {
      const stampUserData = localStorage.getItem('stamp_user_data');
      if (stampUserData) {
        const userData = JSON.parse(stampUserData);
        if (userData && userData.jwt) {
          return userData.jwt;
        }
      }
    } catch (error) {
      console.error('Error parsing stamp_user_data from localStorage:', error);
    }

    // Try to get from cookies
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'stamp_jwt') {
        return value;
      }
    }
  }
  return null;
};

export default function CatalogManagementPage() {
  const [activeTab, setActiveTab] = useState("upload")
  const [selectedCatalogType, setSelectedCatalogType] = useState("stamp")
  const [selectedProcessingType, setSelectedProcessingType] = useState("ai")
  const [selectedSource, setSelectedSource] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Processing History state
  const [processingHistory, setProcessingHistory] = useState<ProcessingHistoryItem[]>([])
  const [historyPageNumber, setHistoryPageNumber] = useState(1)
  const [historyPageSize, setHistoryPageSize] = useState(10)
  const [historyTotalCount, setHistoryTotalCount] = useState(0)
  const [historyTotalPages, setHistoryTotalPages] = useState(0)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [isRefreshingHistory, setIsRefreshingHistory] = useState(false)

  // Catalog data state
  const [catalogData, setCatalogData] = useState<StampCatalogItem[]>([])
  const [catalogPageNumber, setCatalogPageNumber] = useState(1)
  const [catalogPageSize, setCatalogPageSize] = useState(10)
  const [catalogTotalCount, setCatalogTotalCount] = useState(0)
  const [catalogTotalPages, setCatalogTotalPages] = useState(0)
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(false)
  const [isRefreshingCatalog, setIsRefreshingCatalog] = useState(false)

  const { toast } = useToast()

  // Catalog database state
  const [searchTerm, setSearchTerm] = useState("")
  const [countryFilter, setCountryFilter] = useState("all")
  const [catalogFilter, setCatalogFilter] = useState("all")
  const [seriesFilter, setSeriesFilter] = useState("all")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [selectedStamp, setSelectedStamp] = useState<StampCatalogItem | null>(null)

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
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/20">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Completed
          </Badge>
        )
      case "processing":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/20">
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" /> Processing
          </Badge>
        )
      case "queued":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:hover:bg-yellow-900/20">
            <Clock className="h-3 w-3 mr-1" /> Queued
          </Badge>
        )
      case "validation":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/20">
            <AlertCircle className="h-3 w-3 mr-1" /> Needs Validation
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  // API call to submit catalog for processing
  const submitCatalogForProcessing = async (catalogName: string, files: File[]) => {
    try {
      setIsSubmitting(true)
      
      // Get JWT token
      const jwt = getJWT()
      if (!jwt) {
        throw new Error("Authentication required. Please log in again.")
      }
      
      // Create FormData for each file (assuming we process one file at a time for now)
      const file = files[0] // Take the first file for now
      if (!file) {
        throw new Error("No file selected")
      }

      const formData = new FormData()
      formData.append("CatalogName", catalogName)
      formData.append("StampFileAttachment", file)

      const response = await fetch("https://3pm-stampapp-prod.azurewebsites.net/api/v1/CatalogExtractionProcess", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${jwt}`
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: CatalogExtractionResult = await response.json()

      // Check if the response contains an error
      if (result.error) {
        throw new Error(result.error)
      }

      // Success case - the API returns the result object directly
      toast({
        title: "Catalog Processing Initiated",
        description: `${catalogName} has been submitted for processing. Status: ${result.statusName}. You can track progress in the Processing History tab.`,
        duration: 5000,
      })

      // Reset form
      setSelectedFiles([])
      setSelectedSource("")
      setUploadProgress(0)
      
      // Switch to processing history tab to show the new job
      setActiveTab("recent")
      
      return result
    } catch (error) {
      console.error("Error submitting catalog:", error)
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to submit catalog for processing. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle file selection
  const handleFileSelect = (event?: React.ChangeEvent<HTMLInputElement>) => {
    const files = event?.target?.files
    if (files && files.length > 0) {
      setSelectedFiles(Array.from(files))
      setUploadProgress(0)
    }
  }

  // Handle drag and drop
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const files = event.dataTransfer.files
    if (files && files.length > 0) {
      setSelectedFiles(Array.from(files))
      setUploadProgress(0)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  // Remove selected file
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Submit for processing
  const handleSubmitForProcessing = async () => {
    if (!selectedSource) {
      toast({
        title: "Source Required",
        description: "Please select a catalog source before uploading.",
        variant: "destructive",
      })
      return
    }

    if (selectedFiles.length === 0) {
      toast({
        title: "File Required",
        description: "Please select at least one file to upload.",
        variant: "destructive",
      })
      return
    }

    try {
      await submitCatalogForProcessing(selectedSource, selectedFiles)
    } catch (error) {
      // Error is already handled in submitCatalogForProcessing
    }
  }

  // Validate file types
  const isValidFileType = (file: File) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
    return allowedTypes.includes(file.type)
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Fetch catalog data from API
  const fetchCatalogData = async (pageNumber: number = 1, pageSize: number = 10, isRefresh: boolean = false) => {
    try {
      if (isRefresh) {
        setIsRefreshingCatalog(true)
      } else {
        setIsLoadingCatalog(true)
      }

      // Get JWT token
      const jwt = getJWT()
      if (!jwt) {
        throw new Error("Authentication required. Please log in again.")
      }

      const response = await fetch(
        `https://3pm-stampapp-prod.azurewebsites.net/api/v1/StampCatalog?pageNumber=${pageNumber}&pageSize=${pageSize}`,
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

      const result: StampCatalogResponse = await response.json()

      setCatalogData(result.items || [])
      setCatalogPageNumber(result.pageNumber || pageNumber)
      setCatalogPageSize(result.pageSize || pageSize)
      setCatalogTotalCount(result.totalCount || 0)
      setCatalogTotalPages(result.totalPages || 0)

    } catch (error) {
      console.error("Error fetching catalog data:", error)
      toast({
        title: "Failed to Load Catalog Data",
        description: error instanceof Error ? error.message : "Unable to fetch catalog data. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsLoadingCatalog(false)
      setIsRefreshingCatalog(false)
    }
  }

  // Load data when switching to tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (value === "recent") {
      // Always load fresh data when switching to the processing history tab
      fetchProcessingHistory(1, historyPageSize)
    } else if (value === "data") {
      // Load catalog data when switching to the catalog data tab
      fetchCatalogData(1, catalogPageSize)
    }
  }

  // Fetch processing history from API
  const fetchProcessingHistory = async (pageNumber: number = 1, pageSize: number = 10, isRefresh: boolean = false) => {
    try {
      if (isRefresh) {
        setIsRefreshingHistory(true)
      } else {
        setIsLoadingHistory(true)
      }

      // Get JWT token
      const jwt = getJWT()
      if (!jwt) {
        throw new Error("Authentication required. Please log in again.")
      }

      const response = await fetch(
        `https://3pm-stampapp-prod.azurewebsites.net/api/v1/CatalogExtractionProcess?pageNumber=${pageNumber}&pageSize=${pageSize}`,
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

      const result: ProcessingHistoryResponse = await response.json()

      setProcessingHistory(result.items || [])
      setHistoryPageNumber(result.pageNumber || pageNumber)
      setHistoryPageSize(result.pageSize || pageSize)
      setHistoryTotalCount(result.totalCount || 0)
      setHistoryTotalPages(result.totalPages || 0)

    } catch (error) {
      console.error("Error fetching processing history:", error)
      toast({
        title: "Failed to Load Processing History",
        description: error instanceof Error ? error.message : "Unable to fetch processing history. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsLoadingHistory(false)
      setIsRefreshingHistory(false)
    }
  }

  // Refresh processing history
  const refreshProcessingHistory = () => {
    fetchProcessingHistory(historyPageNumber, historyPageSize, true)
  }

  // Refresh catalog data
  const refreshCatalogData = () => {
    fetchCatalogData(catalogPageNumber, catalogPageSize, true)
  }

  // Handle page changes for processing history
  const handleHistoryPageChange = (newPage: number) => {
    setHistoryPageNumber(newPage)
    fetchProcessingHistory(newPage, historyPageSize)
  }

  // Handle page size changes for processing history
  const handleHistoryPageSizeChange = (newPageSize: number) => {
    setHistoryPageSize(newPageSize)
    setHistoryPageNumber(1) // Reset to first page
    fetchProcessingHistory(1, newPageSize)
  }

  // Handle page changes for catalog data
  const handleCatalogPageChange = (newPage: number) => {
    setCatalogPageNumber(newPage)
    fetchCatalogData(newPage, catalogPageSize)
  }

  // Handle page size changes for catalog data
  const handleCatalogPageSizeChange = (newPageSize: number) => {
    setCatalogPageSize(newPageSize)
    setCatalogPageNumber(1) // Reset to first page
    fetchCatalogData(1, newPageSize)
  }

  // Get status badge for processing history
  const getProcessingStatusBadge = (status: number) => {
    const statusName = CatalogUploadStatus[status as keyof typeof CatalogUploadStatus] || "Unknown"
    
    switch (status) {
      case 2: // Completed
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/20">
            <CheckCircle2 className="h-3 w-3 mr-1" /> {statusName}
          </Badge>
        )
      case 1: // Processing
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/20">
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" /> {statusName}
          </Badge>
        )
      case 0: // Idle
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:hover:bg-yellow-900/20">
            <Clock className="h-3 w-3 mr-1" /> {statusName}
          </Badge>
        )
      case 3: // Failed
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/20">
            <AlertCircle className="h-3 w-3 mr-1" /> {statusName}
          </Badge>
        )
      default:
        return <Badge variant="outline">{statusName}</Badge>
    }
  }

  // Format datetime for display
  const formatDateTime = (dateTime: string | null) => {
    if (!dateTime) return "-"
    try {
      return new Date(dateTime).toLocaleString()
    } catch {
      return dateTime
    }
  }

  // Filter and sort data (now works with API data)
  const filteredAndSortedData = catalogData
    .filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.seriesName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.catalogNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.stampCatalogCode.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCountry = countryFilter === "all" || item.country === countryFilter
      const matchesCatalog = catalogFilter === "all" || item.catalogName === catalogFilter
      const matchesSeries = seriesFilter === "all" || item.seriesName === seriesFilter

      return matchesSearch && matchesCountry && matchesCatalog && matchesSeries
    })
    .sort((a, b) => {
      const aValue = a[sortField as keyof StampCatalogItem]
      const bValue = b[sortField as keyof StampCatalogItem]

      // Handle null/undefined values and convert to strings for comparison
      const aString = aValue ? String(aValue) : ''
      const bString = bValue ? String(bValue) : ''

      if (sortDirection === "asc") {
        return aString < bString ? -1 : aString > bString ? 1 : 0
      } else {
        return aString > bString ? -1 : aString < bString ? 1 : 0
      }
    })

  // Get unique values for filters (now from API data)
  const countries = [...new Set(catalogData.map(item => item.country))].sort()
  const catalogs = [...new Set(catalogData.map(item => item.catalogName))].sort()
  const series = [...new Set(catalogData.map(item => item.seriesName))].sort()

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
    setCatalogFilter("all")
    setSeriesFilter("all")
  }

  // Format year from issue date
  const formatYear = (issueDate: string) => {
    try {
      return new Date(issueDate).getFullYear().toString()
    } catch {
      return "Unknown"
    }
  }

  // Format denomination
  const formatDenomination = (value: number, symbol: string) => {
    return `${symbol}${value}`
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Catalog Management</h1>
          <p className="text-muted-foreground">Manage stamp catalog data through AI-powered ingestion and processing</p>
        </div>
      </div>

      <Tabs defaultValue="upload" value={activeTab} onValueChange={handleTabChange}>
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

              {/* File Upload Area */}
              <div 
                className="border-2 border-dashed rounded-md p-8 text-center border-border transition-colors hover:border-primary/50"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div className="flex flex-col items-center justify-center gap-4">
                  <Upload className="h-12 w-12 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Drag and drop files or click to browse</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedCatalogType === "stamp"
                        ? "Upload scanned catalog pages (PDF, JPG, PNG)"
                        : "Upload auction results or price lists (PDF, CSV, XLS)"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Maximum file size: 50MB per file
                    </p>
                  </div>
                  <div>
                    <Input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button asChild>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        Select Files
                      </label>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Selected Files Display */}
              {selectedFiles.length > 0 && (
                <div className="space-y-3">
                  <Label>Selected Files ({selectedFiles.length})</Label>
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)} • {file.type}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!isValidFileType(file) && (
                            <Badge variant="destructive" className="text-xs">
                              Invalid Type
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            disabled={isSubmitting}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}

              <div className="flex flex-col gap-2 p-4 rounded-md bg-blue-50 border border-blue-200 dark:bg-blue-950/30 dark:border-blue-800/30">
                <h3 className="font-medium flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-500 dark:text-blue-400" />
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
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedFiles([])
                    setSelectedSource("")
                    setUploadProgress(0)
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmitForProcessing}
                  disabled={isSubmitting || selectedFiles.length === 0 || !selectedSource || selectedFiles.some(file => !isValidFileType(file))}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
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
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Processing History</CardTitle>
                  <CardDescription>
                    Track the status and progress of catalog data processing jobs
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={historyPageSize.toString()} onValueChange={(value) => handleHistoryPageSizeChange(Number(value))}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 per page</SelectItem>
                      <SelectItem value="10">10 per page</SelectItem>
                      <SelectItem value="25">25 per page</SelectItem>
                      <SelectItem value="50">50 per page</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    onClick={refreshProcessingHistory}
                    disabled={isLoadingHistory || isRefreshingHistory}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshingHistory ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingHistory ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading processing history...</span>
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Catalog Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Stage</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Started</TableHead>
                        <TableHead>Completed</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {processingHistory.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            No processing history found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        processingHistory.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.catalogName}</TableCell>
                            <TableCell>{getProcessingStatusBadge(item.status)}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {CatalogUploadStage[item.stage as keyof typeof CatalogUploadStage] || "Unknown"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {item.totalStampsInCatalog > 0 ? (
                                <div className="flex items-center gap-2">
                                  <Progress 
                                    value={(item.stampsExtractedCount / item.totalStampsInCatalog) * 100} 
                                    className="h-2 flex-1" 
                                  />
                                  <span className="text-sm text-muted-foreground">
                                    {item.stampsExtractedCount}/{item.totalStampsInCatalog}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-sm text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>{formatDateTime(item.processStartDatetime)}</TableCell>
                            <TableCell>{formatDateTime(item.processEndDatetime)}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  {historyTotalPages > 0 && (
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleHistoryPageChange(1)}
                          disabled={historyPageNumber === 1 || historyTotalPages <= 1}
                        >
                          <ChevronsLeft className="h-4 w-4 mr-1" />
                          First
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleHistoryPageChange(historyPageNumber - 1)}
                          disabled={historyPageNumber === 1 || historyTotalPages <= 1}
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Previous
                        </Button>
                      </div>

                      <div className="flex items-center gap-1">
                        {historyTotalPages > 1 && Array.from({ length: Math.min(5, historyTotalPages) }, (_, i) => {
                          let pageNumber;
                          if (historyTotalPages <= 5) {
                            pageNumber = i + 1;
                          } else if (historyPageNumber <= 3) {
                            pageNumber = i + 1;
                          } else if (historyPageNumber >= historyTotalPages - 2) {
                            pageNumber = historyTotalPages - 4 + i;
                          } else {
                            pageNumber = historyPageNumber - 2 + i;
                          }

                          return (
                            <Button
                              key={pageNumber}
                              variant={historyPageNumber === pageNumber ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleHistoryPageChange(pageNumber)}
                              className="w-8 h-8 p-0"
                            >
                              {pageNumber}
                            </Button>
                          );
                        })}
                        {historyTotalPages === 1 && (
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
                          onClick={() => handleHistoryPageChange(historyPageNumber + 1)}
                          disabled={historyPageNumber === historyTotalPages || historyTotalPages <= 1}
                        >
                          Next
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleHistoryPageChange(historyTotalPages)}
                          disabled={historyPageNumber === historyTotalPages || historyTotalPages <= 1}
                        >
                          Last
                          <ChevronsRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Results Summary */}
                  {historyTotalCount > 0 && (
                    <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
                      <span>
                        Showing {((historyPageNumber - 1) * historyPageSize) + 1}-{Math.min(historyPageNumber * historyPageSize, historyTotalCount)} of {historyTotalCount} records
                      </span>
                      <span>
                        Page {historyPageNumber} of {historyTotalPages}
                      </span>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Catalog Database</CardTitle>
                  <CardDescription>
                    Browse and manage stamps and pricing information in the catalog database
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={catalogPageSize.toString()} onValueChange={(value) => handleCatalogPageSizeChange(Number(value))}>
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
                    onClick={refreshCatalogData}
                    disabled={isLoadingCatalog || isRefreshingCatalog}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshingCatalog ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and Filters */}
              <div className="flex flex-col gap-4">
                {/* Search Bar */}
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

                {/* Filters Row */}
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

                  <Select value={catalogFilter} onValueChange={setCatalogFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Catalog" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Catalogs</SelectItem>
                      {catalogs.map((catalog) => (
                        <SelectItem key={catalog} value={catalog}>
                          {catalog}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={seriesFilter} onValueChange={setSeriesFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Series" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Series</SelectItem>
                      {series.map((seriesItem) => (
                        <SelectItem key={seriesItem} value={seriesItem}>
                          {seriesItem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Results Summary */}
                {catalogTotalCount > 0 && (
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      Showing page {catalogPageNumber} of {catalogTotalPages}
                    </span>
                    <span>
                      Total: {catalogTotalCount} stamps
                    </span>
                  </div>
                )}
              </div>

              {isLoadingCatalog ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading catalog data...</span>
                </div>
              ) : (
                <>
                  {/* Table */}
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">Actions</TableHead>
                          <TableHead className="min-w-[200px] max-w-[250px]">
                            <Button
                              variant="ghost"
                              onClick={() => handleSort("name")}
                              className="h-auto p-0 font-semibold hover:bg-transparent"
                            >
                              Stamp {getSortIcon("name")}
                            </Button>
                          </TableHead>
                          <TableHead className="w-[120px]">
                            <Button
                              variant="ghost"
                              onClick={() => handleSort("country")}
                              className="h-auto p-0 font-semibold hover:bg-transparent"
                            >
                              Country {getSortIcon("country")}
                            </Button>
                          </TableHead>
                          <TableHead className="w-[80px]">
                            <Button
                              variant="ghost"
                              onClick={() => handleSort("issueDate")}
                              className="h-auto p-0 font-semibold hover:bg-transparent"
                            >
                              Year {getSortIcon("issueDate")}
                            </Button>
                          </TableHead>
                          <TableHead className="w-[120px]">Catalog Number</TableHead>
                          <TableHead className="w-[140px]">Stamp Code</TableHead>
                          <TableHead className="w-[100px]">Denomination</TableHead>
                          <TableHead className="min-w-[150px] max-w-[200px]">Series</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {catalogData.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                              No catalog data found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          catalogData.map((item) => (
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
                                        {item.name} ({formatYear(item.issueDate)})
                                      </DialogTitle>
                                      <DialogDescription>
                                        Detailed information for {item.catalogNumber}
                                      </DialogDescription>
                                    </DialogHeader>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      {/* Image */}
                                      <div className="space-y-4">
                                        <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                                          {item.stampImageUrl ? (
                                            <img 
                                              src={item.stampImageUrl} 
                                              alt={item.name}
                                              className="max-w-full max-h-full object-contain rounded-lg"
                                              onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
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
                                              <span className="text-muted-foreground">Country:</span>
                                              <span className="font-medium flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {item.country}
                                              </span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Issue Date:</span>
                                              <span className="font-medium flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {formatDateTime(item.issueDate)}
                                              </span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Series:</span>
                                              <Badge variant="outline">{item.seriesName}</Badge>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Publisher:</span>
                                              <span className="font-medium">{item.publisher || "Not specified"}</span>
                                            </div>
                                          </div>
                                        </div>

                                        <div>
                                          <h3 className="font-semibold mb-2">Catalog Information</h3>
                                          <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Catalog:</span>
                                              <span className="font-medium text-right">{item.catalogName}</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Catalog Number:</span>
                                              <Badge variant="outline" className="font-mono">{item.catalogNumber}</Badge>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Stamp Code:</span>
                                              <Badge className="font-mono text-xs">
                                                {item.stampCatalogCode}
                                              </Badge>
                                            </div>
                                          </div>
                                        </div>

                                        <div>
                                          <h3 className="font-semibold mb-2">Technical Details</h3>
                                          <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Denomination:</span>
                                              <span className="font-medium">{formatDenomination(item.denominationValue, item.denominationSymbol)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Currency:</span>
                                              <span className="font-medium">{item.denominationCurrency}</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Color:</span>
                                              <span className="font-medium">{item.color}</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Paper Type:</span>
                                              <span className="font-medium">{item.paperType || "Not specified"}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                              <TableCell className="min-w-[200px] max-w-[250px]">
                                <div className="font-medium text-sm overflow-hidden text-ellipsis whitespace-nowrap pr-2" title={item.name}>
                                  {item.name}
                                </div>
                              </TableCell>
                              <TableCell className="w-[120px]">
                                <div className="flex items-center gap-1 overflow-hidden">
                                  <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                  <span className="overflow-hidden text-ellipsis whitespace-nowrap">{item.country}</span>
                                </div>
                              </TableCell>
                              <TableCell className="w-[80px]">
                                <div className="flex items-center gap-1 whitespace-nowrap">
                                  <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                  <span>{formatYear(item.issueDate)}</span>
                                </div>
                              </TableCell>
                              <TableCell className="w-[120px]">
                                <div className="overflow-hidden text-ellipsis whitespace-nowrap" title={item.catalogNumber}>
                                  <Badge variant="outline" className="font-mono text-xs max-w-full">
                                    <span className="overflow-hidden text-ellipsis whitespace-nowrap">{item.catalogNumber}</span>
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell className="w-[140px]">
                                <div className="overflow-hidden text-ellipsis whitespace-nowrap" title={item.stampCatalogCode}>
                                  <Badge className="font-mono text-xs max-w-full">
                                    <span className="overflow-hidden text-ellipsis whitespace-nowrap">{item.stampCatalogCode}</span>
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell className="font-medium w-[100px] whitespace-nowrap">
                                {formatDenomination(item.denominationValue, item.denominationSymbol)}
                              </TableCell>
                              <TableCell className="min-w-[150px] max-w-[200px]">
                                <div className="overflow-hidden text-ellipsis whitespace-nowrap" title={item.seriesName}>
                                  <Badge variant="outline" className="text-xs max-w-full inline-block">
                                    <span className="overflow-hidden text-ellipsis whitespace-nowrap block">{item.seriesName}</span>
                                  </Badge>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {catalogTotalPages > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCatalogPageChange(1)}
                          disabled={catalogPageNumber === 1 || catalogTotalPages <= 1}
                        >
                          <ChevronsLeft className="h-4 w-4 mr-1" />
                          First
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCatalogPageChange(catalogPageNumber - 1)}
                          disabled={catalogPageNumber === 1 || catalogTotalPages <= 1}
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Previous
                        </Button>
                      </div>

                      <div className="flex items-center gap-1">
                        {catalogTotalPages > 1 && Array.from({ length: Math.min(5, catalogTotalPages) }, (_, i) => {
                          let pageNumber;
                          if (catalogTotalPages <= 5) {
                            pageNumber = i + 1;
                          } else if (catalogPageNumber <= 3) {
                            pageNumber = i + 1;
                          } else if (catalogPageNumber >= catalogTotalPages - 2) {
                            pageNumber = catalogTotalPages - 4 + i;
                          } else {
                            pageNumber = catalogPageNumber - 2 + i;
                          }

                          return (
                            <Button
                              key={pageNumber}
                              variant={catalogPageNumber === pageNumber ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleCatalogPageChange(pageNumber)}
                              className="w-8 h-8 p-0"
                            >
                              {pageNumber}
                            </Button>
                          );
                        })}
                        {catalogTotalPages === 1 && (
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
                          onClick={() => handleCatalogPageChange(catalogPageNumber + 1)}
                          disabled={catalogPageNumber === catalogTotalPages || catalogTotalPages <= 1}
                        >
                          Next
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCatalogPageChange(catalogTotalPages)}
                          disabled={catalogPageNumber === catalogTotalPages || catalogTotalPages <= 1}
                        >
                          Last
                          <ChevronsRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Results Summary */}
                  {catalogTotalCount > 0 && (
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>
                        Showing page {catalogPageNumber} of {catalogTotalPages}
                      </span>
                      <span>
                        Total: {catalogTotalCount} stamps
                      </span>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
