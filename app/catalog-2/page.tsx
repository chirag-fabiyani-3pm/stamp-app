"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ChevronRight, Search, Filter, Grid, List, ArrowLeft, Home, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

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

interface GroupedStamps {
  [key: string]: StampData[] | GroupedStamps
}

interface NavigationState {
  path: string[]
  level: number
}

type GroupingField = 'seriesName' | 'issueYear' | 'country' | 'color' | 'paperType' | 'denominationValue' | 'publisher'

const GROUPING_FIELDS: { value: GroupingField; label: string }[] = [
  { value: 'seriesName', label: 'Series Name' },
  { value: 'issueYear', label: 'Issue Year' },
  { value: 'country', label: 'Country' },
  { value: 'color', label: 'Color' },
  { value: 'paperType', label: 'Paper Type' },
  { value: 'denominationValue', label: 'Denomination' },
  { value: 'publisher', label: 'Publisher' },
]

export default function Catalog2Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const [stamps, setStamps] = useState<StampData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [groupingLevels, setGroupingLevels] = useState<GroupingField[]>([]) // Default to empty - show all stamps
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [groupSearchTerm, setGroupSearchTerm] = useState("")
  const [isInitialized, setIsInitialized] = useState(false) // Track initialization
  const [selectedStamp, setSelectedStamp] = useState<StampData | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  // Get navigation state from URL
  const navigation = useMemo(() => {
    const pathParam = searchParams.get('path')
    const path = pathParam ? decodeURIComponent(pathParam).split(',').filter(Boolean) : []
    return {
      path,
      level: path.length
    }
  }, [searchParams])

  // Initialize state from URL parameters
  useEffect(() => {
    const urlSearchTerm = searchParams.get('search')
    const urlGroupSearch = searchParams.get('groupSearch')
    const urlViewMode = searchParams.get('view') as 'grid' | 'list'
    const urlGrouping = searchParams.get('grouping')

    if (urlSearchTerm !== null) setSearchTerm(urlSearchTerm)
    if (urlGroupSearch !== null) setGroupSearchTerm(urlGroupSearch)
    if (urlViewMode && ['grid', 'list'].includes(urlViewMode)) setViewMode(urlViewMode)
    if (urlGrouping) {
      const groupingFields = urlGrouping.split(',').filter(field => 
        GROUPING_FIELDS.some(f => f.value === field)
      ) as GroupingField[]
      if (groupingFields.length > 0) {
        setGroupingLevels(groupingFields)
      }
    }
    setIsInitialized(true)
  }, [searchParams])

  // Update URL when search, view mode, or grouping changes
  useEffect(() => {
    // Only update URL after initial load to prevent overwriting pasted URLs
    if (!isInitialized) return
    
    const timeoutId = setTimeout(() => {
      updateURLParams()
    }, 300) // Debounce for search
    
    return () => clearTimeout(timeoutId)
  }, [searchTerm, groupSearchTerm, viewMode, groupingLevels, isInitialized])

  // Update URL when navigation changes
  const updateURL = (newPath: string[], preserveOtherParams: boolean = true) => {
    const params = new URLSearchParams()
    
    // Add navigation path
    if (newPath.length > 0) {
      params.set('path', encodeURIComponent(newPath.join(',')))
    }
    
    if (preserveOtherParams) {
      // Preserve other parameters
      if (searchTerm) params.set('search', searchTerm)
      if (groupSearchTerm) params.set('groupSearch', groupSearchTerm)
      if (viewMode !== 'grid') params.set('view', viewMode)
      // Only add grouping param if there are actual grouping levels set
      if (groupingLevels.length > 0) {
        params.set('grouping', groupingLevels.join(','))
      }
    }
    
    const queryString = params.toString()
    const url = queryString ? `/catalog-2?${queryString}` : '/catalog-2'
    router.push(url, { scroll: false })
  }

  // Update URL when other parameters change
  const updateURLParams = () => {
    updateURL(navigation.path, true)
  }

  // Mock data for development/demo purposes
  const mockStamps: StampData[] = [
    // US Stamps - American Bicentennial Series
    {
      id: "1",
      stampCode: "US001",
      status: 1,
      userId: "user1",
      stampCatalogId: "cat1",
      name: "Liberty Bell",
      publisher: "USPS",
      country: "United States",
      stampImageUrl: "/placeholder.svg",
      catalogName: "Scott",
      catalogNumber: "1595",
      seriesName: "American Bicentennial",
      issueDate: "1976-07-04",
      issueYear: 1976,
      denominationValue: 13,
      denominationCurrency: "USD",
      denominationSymbol: "¢",
      color: "Blue",
      paperType: "Regular",
      stampDetailsJson: "{}",
      estimatedMarketValue: 5.00,
      actualPrice: 3.50
    },
    {
      id: "2",
      stampCode: "US002",
      status: 1,
      userId: "user1",
      stampCatalogId: "cat2",
      name: "Independence Hall",
      publisher: "USPS",
      country: "United States",
      stampImageUrl: "/placeholder.svg",
      catalogName: "Scott",
      catalogNumber: "1596",
      seriesName: "American Bicentennial",
      issueDate: "1976-07-04",
      issueYear: 1976,
      denominationValue: 13,
      denominationCurrency: "USD",
      denominationSymbol: "¢",
      color: "Red",
      paperType: "Regular",
      stampDetailsJson: "{}",
      estimatedMarketValue: 5.00,
      actualPrice: 3.50
    },
    {
      id: "3",
      stampCode: "US003",
      status: 1,
      userId: "user1",
      stampCatalogId: "cat3",
      name: "American Flag",
      publisher: "USPS",
      country: "United States",
      stampImageUrl: "/placeholder.svg",
      catalogName: "Scott",
      catalogNumber: "1597",
      seriesName: "American Bicentennial",
      issueDate: "1976-07-04",
      issueYear: 1976,
      denominationValue: 13,
      denominationCurrency: "USD",
      denominationSymbol: "¢",
      color: "Multi-color",
      paperType: "Regular",
      stampDetailsJson: "{}",
      estimatedMarketValue: 6.00,
      actualPrice: 4.00
    },
    
    // US Stamps - Wildlife Series
    {
      id: "4",
      stampCode: "US004",
      status: 1,
      userId: "user1",
      stampCatalogId: "cat4",
      name: "Eagle",
      publisher: "USPS",
      country: "United States",
      stampImageUrl: "/placeholder.svg",
      catalogName: "Scott",
      catalogNumber: "2000",
      seriesName: "Wildlife Series",
      issueDate: "2000-01-01",
      issueYear: 2000,
      denominationValue: 34,
      denominationCurrency: "USD",
      denominationSymbol: "¢",
      color: "Brown",
      paperType: "Self-Adhesive",
      stampDetailsJson: "{}",
      estimatedMarketValue: 1.50,
      actualPrice: 1.00
    },
    {
      id: "5",
      stampCode: "US005",
      status: 1,
      userId: "user1",
      stampCatalogId: "cat5",
      name: "Wolf",
      publisher: "USPS",
      country: "United States",
      stampImageUrl: "/placeholder.svg",
      catalogName: "Scott",
      catalogNumber: "2001",
      seriesName: "Wildlife Series",
      issueDate: "2000-03-15",
      issueYear: 2000,
      denominationValue: 34,
      denominationCurrency: "USD",
      denominationSymbol: "¢",
      color: "Gray",
      paperType: "Self-Adhesive",
      stampDetailsJson: "{}",
      estimatedMarketValue: 1.50,
      actualPrice: 1.00
    },
    {
      id: "6",
      stampCode: "US006",
      status: 1,
      userId: "user1",
      stampCatalogId: "cat6",
      name: "Bear",
      publisher: "USPS",
      country: "United States",
      stampImageUrl: "/placeholder.svg",
      catalogName: "Scott",
      catalogNumber: "2002",
      seriesName: "Wildlife Series",
      issueDate: "2000-06-20",
      issueYear: 2000,
      denominationValue: 34,
      denominationCurrency: "USD",
      denominationSymbol: "¢",
      color: "Black",
      paperType: "Self-Adhesive",
      stampDetailsJson: "{}",
      estimatedMarketValue: 1.75,
      actualPrice: 1.25
    },

    // US Stamps - Space Exploration Series
    {
      id: "7",
      stampCode: "US007",
      status: 1,
      userId: "user1",
      stampCatalogId: "cat7",
      name: "Moon Landing",
      publisher: "USPS",
      country: "United States",
      stampImageUrl: "/placeholder.svg",
      catalogName: "Scott",
      catalogNumber: "2419",
      seriesName: "Space Exploration",
      issueDate: "1989-07-20",
      issueYear: 1989,
      denominationValue: 25,
      denominationCurrency: "USD",
      denominationSymbol: "¢",
      color: "Blue",
      paperType: "Regular",
      stampDetailsJson: "{}",
      estimatedMarketValue: 3.00,
      actualPrice: 2.50
    },
    {
      id: "8",
      stampCode: "US008",
      status: 1,
      userId: "user1",
      stampCatalogId: "cat8",
      name: "Space Shuttle",
      publisher: "USPS",
      country: "United States",
      stampImageUrl: "/placeholder.svg",
      catalogName: "Scott",
      catalogNumber: "2420",
      seriesName: "Space Exploration",
      issueDate: "1989-07-20",
      issueYear: 1989,
      denominationValue: 25,
      denominationCurrency: "USD",
      denominationSymbol: "¢",
      color: "White",
      paperType: "Regular",
      stampDetailsJson: "{}",
      estimatedMarketValue: 3.00,
      actualPrice: 2.50
    },

    // UK Stamps - Definitive Series
    {
      id: "9",
      stampCode: "UK001",
      status: 1,
      userId: "user1",
      stampCatalogId: "cat9",
      name: "Queen Elizabeth II",
      publisher: "Royal Mail",
      country: "United Kingdom",
      stampImageUrl: "/placeholder.svg",
      catalogName: "Stanley Gibbons",
      catalogNumber: "SG1234",
      seriesName: "Definitive Series",
      issueDate: "1990-03-15",
      issueYear: 1990,
      denominationValue: 20,
      denominationCurrency: "GBP",
      denominationSymbol: "p",
      color: "Green",
      paperType: "Phosphor",
      stampDetailsJson: "{}",
      estimatedMarketValue: 2.50,
      actualPrice: 1.80
    },
    {
      id: "10",
      stampCode: "UK002",
      status: 1,
      userId: "user1",
      stampCatalogId: "cat10",
      name: "Queen Elizabeth II Portrait",
      publisher: "Royal Mail",
      country: "United Kingdom",
      stampImageUrl: "/placeholder.svg",
      catalogName: "Stanley Gibbons",
      catalogNumber: "SG1235",
      seriesName: "Definitive Series",
      issueDate: "1990-03-15",
      issueYear: 1990,
      denominationValue: 50,
      denominationCurrency: "GBP",
      denominationSymbol: "p",
      color: "Purple",
      paperType: "Phosphor",
      stampDetailsJson: "{}",
      estimatedMarketValue: 4.50,
      actualPrice: 3.20
    },

    // UK Stamps - Castles Series
    {
      id: "11",
      stampCode: "UK003",
      status: 1,
      userId: "user1",
      stampCatalogId: "cat11",
      name: "Windsor Castle",
      publisher: "Royal Mail",
      country: "United Kingdom",
      stampImageUrl: "/placeholder.svg",
      catalogName: "Stanley Gibbons",
      catalogNumber: "SG1567",
      seriesName: "Castles Series",
      issueDate: "1992-05-20",
      issueYear: 1992,
      denominationValue: 50,
      denominationCurrency: "GBP",
      denominationSymbol: "p",
      color: "Purple",
      paperType: "Regular",
      stampDetailsJson: "{}",
      estimatedMarketValue: 8.00,
      actualPrice: 6.50
    },
    {
      id: "12",
      stampCode: "UK004",
      status: 1,
      userId: "user1",
      stampCatalogId: "cat12",
      name: "Edinburgh Castle",
      publisher: "Royal Mail",
      country: "United Kingdom",
      stampImageUrl: "/placeholder.svg",
      catalogName: "Stanley Gibbons",
      catalogNumber: "SG1568",
      seriesName: "Castles Series",
      issueDate: "1992-05-20",
      issueYear: 1992,
      denominationValue: 75,
      denominationCurrency: "GBP",
      denominationSymbol: "p",
      color: "Blue",
      paperType: "Regular",
      stampDetailsJson: "{}",
      estimatedMarketValue: 10.00,
      actualPrice: 8.00
    },
    {
      id: "13",
      stampCode: "UK005",
      status: 1,
      userId: "user1",
      stampCatalogId: "cat13",
      name: "Caerphilly Castle",
      publisher: "Royal Mail",
      country: "United Kingdom",
      stampImageUrl: "/placeholder.svg",
      catalogName: "Stanley Gibbons",
      catalogNumber: "SG1569",
      seriesName: "Castles Series",
      issueDate: "1992-05-20",
      issueYear: 1992,
      denominationValue: 100,
      denominationCurrency: "GBP",
      denominationSymbol: "p",
      color: "Brown",
      paperType: "Regular",
      stampDetailsJson: "{}",
      estimatedMarketValue: 12.00,
      actualPrice: 9.50
    },

    // UK Stamps - Royal Family Series
    {
      id: "14",
      stampCode: "UK006",
      status: 1,
      userId: "user1",
      stampCatalogId: "cat14",
      name: "Queen Mother Birthday",
      publisher: "Royal Mail",
      country: "United Kingdom",
      stampImageUrl: "/placeholder.svg",
      catalogName: "Stanley Gibbons",
      catalogNumber: "SG2000",
      seriesName: "Royal Family",
      issueDate: "1995-08-04",
      issueYear: 1995,
      denominationValue: 25,
      denominationCurrency: "GBP",
      denominationSymbol: "p",
      color: "Pink",
      paperType: "Regular",
      stampDetailsJson: "{}",
      estimatedMarketValue: 5.00,
      actualPrice: 4.00
    },

    // Canada Stamps - Canadian Symbols
    {
      id: "15",
      stampCode: "CA001",
      status: 1,
      userId: "user1",
      stampCatalogId: "cat15",
      name: "Maple Leaf",
      publisher: "Canada Post",
      country: "Canada",
      stampImageUrl: "/placeholder.svg",
      catalogName: "Unitrade",
      catalogNumber: "1234",
      seriesName: "Canadian Symbols",
      issueDate: "1995-07-01",
      issueYear: 1995,
      denominationValue: 45,
      denominationCurrency: "CAD",
      denominationSymbol: "¢",
      color: "Red",
      paperType: "Regular",
      stampDetailsJson: "{}",
      estimatedMarketValue: 3.00,
      actualPrice: 2.25
    },
    {
      id: "16",
      stampCode: "CA002",
      status: 1,
      userId: "user1",
      stampCatalogId: "cat16",
      name: "Canadian Flag",
      publisher: "Canada Post",
      country: "Canada",
      stampImageUrl: "/placeholder.svg",
      catalogName: "Unitrade",
      catalogNumber: "1235",
      seriesName: "Canadian Symbols",
      issueDate: "1995-07-01",
      issueYear: 1995,
      denominationValue: 45,
      denominationCurrency: "CAD",
      denominationSymbol: "¢",
      color: "Red",
      paperType: "Regular",
      stampDetailsJson: "{}",
      estimatedMarketValue: 3.00,
      actualPrice: 2.25
    },

    // Canada Stamps - Wildlife Series
    {
      id: "17",
      stampCode: "CA003",
      status: 1,
      userId: "user1",
      stampCatalogId: "cat17",
      name: "Polar Bear",
      publisher: "Canada Post",
      country: "Canada",
      stampImageUrl: "/placeholder.svg",
      catalogName: "Unitrade",
      catalogNumber: "1500",
      seriesName: "Canadian Wildlife",
      issueDate: "1998-04-15",
      issueYear: 1998,
      denominationValue: 50,
      denominationCurrency: "CAD",
      denominationSymbol: "¢",
      color: "White",
      paperType: "Regular",
      stampDetailsJson: "{}",
      estimatedMarketValue: 4.00,
      actualPrice: 3.00
    },
    {
      id: "18",
      stampCode: "CA004",
      status: 1,
      userId: "user1",
      stampCatalogId: "cat18",
      name: "Moose",
      publisher: "Canada Post",
      country: "Canada",
      stampImageUrl: "/placeholder.svg",
      catalogName: "Unitrade",
      catalogNumber: "1501",
      seriesName: "Canadian Wildlife",
      issueDate: "1998-04-15",
      issueYear: 1998,
      denominationValue: 50,
      denominationCurrency: "CAD",
      denominationSymbol: "¢",
      color: "Brown",
      paperType: "Regular",
      stampDetailsJson: "{}",
      estimatedMarketValue: 4.00,
      actualPrice: 3.00
    },

    // Australia Stamps - Flora and Fauna
    {
      id: "19",
      stampCode: "AU001",
      status: 1,
      userId: "user1",
      stampCatalogId: "cat19",
      name: "Kangaroo",
      publisher: "Australia Post",
      country: "Australia",
      stampImageUrl: "/placeholder.svg",
      catalogName: "Michel",
      catalogNumber: "AU2000",
      seriesName: "Flora and Fauna",
      issueDate: "2005-01-26",
      issueYear: 2005,
      denominationValue: 50,
      denominationCurrency: "AUD",
      denominationSymbol: "¢",
      color: "Orange",
      paperType: "Self-Adhesive",
      stampDetailsJson: "{}",
      estimatedMarketValue: 2.50,
      actualPrice: 2.00
    },
    {
      id: "20",
      stampCode: "AU002",
      status: 1,
      userId: "user1",
      stampCatalogId: "cat20",
      name: "Koala",
      publisher: "Australia Post",
      country: "Australia",
      stampImageUrl: "/placeholder.svg",
      catalogName: "Michel",
      catalogNumber: "AU2001",
      seriesName: "Flora and Fauna",
      issueDate: "2005-01-26",
      issueYear: 2005,
      denominationValue: 50,
      denominationCurrency: "AUD",
      denominationSymbol: "¢",
      color: "Gray",
      paperType: "Self-Adhesive",
      stampDetailsJson: "{}",
      estimatedMarketValue: 2.50,
      actualPrice: 2.00
    },

    // Germany Stamps - Architecture Series
    {
      id: "21",
      stampCode: "DE001",
      status: 1,
      userId: "user1",
      stampCatalogId: "cat21",
      name: "Brandenburg Gate",
      publisher: "Deutsche Post",
      country: "Germany",
      stampImageUrl: "/placeholder.svg",
      catalogName: "Michel",
      catalogNumber: "DE3000",
      seriesName: "German Architecture",
      issueDate: "2010-10-03",
      issueYear: 2010,
      denominationValue: 55,
      denominationCurrency: "EUR",
      denominationSymbol: "¢",
      color: "Blue",
      paperType: "Regular",
      stampDetailsJson: "{}",
      estimatedMarketValue: 3.50,
      actualPrice: 2.80
    },
    {
      id: "22",
      stampCode: "DE002",
      status: 1,
      userId: "user1",
      stampCatalogId: "cat22",
      name: "Neuschwanstein Castle",
      publisher: "Deutsche Post",
      country: "Germany",
      stampImageUrl: "/placeholder.svg",
      catalogName: "Michel",
      catalogNumber: "DE3001",
      seriesName: "German Architecture",
      issueDate: "2010-10-03",
      issueYear: 2010,
      denominationValue: 75,
      denominationCurrency: "EUR",
      denominationSymbol: "¢",
      color: "Purple",
      paperType: "Regular",
      stampDetailsJson: "{}",
      estimatedMarketValue: 4.50,
      actualPrice: 3.60
    },

    // France Stamps - Art Series
    {
      id: "23",
      stampCode: "FR001",
      status: 1,
      userId: "user1",
      stampCatalogId: "cat23",
      name: "Mona Lisa",
      publisher: "La Poste",
      country: "France",
      stampImageUrl: "/placeholder.svg",
      catalogName: "Yvert",
      catalogNumber: "FR4000",
      seriesName: "French Art Masterpieces",
      issueDate: "2015-05-01",
      issueYear: 2015,
      denominationValue: 70,
      denominationCurrency: "EUR",
      denominationSymbol: "¢",
      color: "Multi-color",
      paperType: "Regular",
      stampDetailsJson: "{}",
      estimatedMarketValue: 5.00,
      actualPrice: 4.20
    },
    {
      id: "24",
      stampCode: "FR002",
      status: 1,
      userId: "user1",
      stampCatalogId: "cat24",
      name: "The Thinker",
      publisher: "La Poste",
      country: "France",
      stampImageUrl: "/placeholder.svg",
      catalogName: "Yvert",
      catalogNumber: "FR4001",
      seriesName: "French Art Masterpieces",
      issueDate: "2015-05-01",
      issueYear: 2015,
      denominationValue: 70,
      denominationCurrency: "EUR",
      denominationSymbol: "¢",
      color: "Bronze",
      paperType: "Regular",
      stampDetailsJson: "{}",
      estimatedMarketValue: 5.00,
      actualPrice: 4.20
    },

    // Japan Stamps - Cherry Blossom Series
    {
      id: "25",
      stampCode: "JP001",
      status: 1,
      userId: "user1",
      stampCatalogId: "cat25",
      name: "Sakura Blossoms",
      publisher: "Japan Post",
      country: "Japan",
      stampImageUrl: "/placeholder.svg",
      catalogName: "JSCA",
      catalogNumber: "JP5000",
      seriesName: "Cherry Blossom Festival",
      issueDate: "2020-04-01",
      issueYear: 2020,
      denominationValue: 84,
      denominationCurrency: "JPY",
      denominationSymbol: "¥",
      color: "Pink",
      paperType: "Self-Adhesive",
      stampDetailsJson: "{}",
      estimatedMarketValue: 1.50,
      actualPrice: 1.20
    },
    {
      id: "26",
      stampCode: "JP002",
      status: 1,
      userId: "user1",
      stampCatalogId: "cat26",
      name: "Mount Fuji with Sakura",
      publisher: "Japan Post",
      country: "Japan",
      stampImageUrl: "/placeholder.svg",
      catalogName: "JSCA",
      catalogNumber: "JP5001",
      seriesName: "Cherry Blossom Festival",
      issueDate: "2020-04-01",
      issueYear: 2020,
      denominationValue: 84,
      denominationCurrency: "JPY",
      denominationSymbol: "¥",
      color: "Multi-color",
      paperType: "Self-Adhesive",
      stampDetailsJson: "{}",
      estimatedMarketValue: 2.00,
      actualPrice: 1.60
    }
  ]

  // Fetch stamps from API
  const fetchStamps = async () => {
    setLoading(true)
    setError(null)

    try {
      const userDataStr = localStorage.getItem('stamp_user_data')
      if (!userDataStr) {
        // Use mock data if not logged in
        setStamps(mockStamps)
        setLoading(false)
        return
      }
      
      const userData = JSON.parse(userDataStr)
      const jwt = userData.jwt

      const url = new URL('https://3pm-stampapp-prod.azurewebsites.net/api/v1/Stamp')
      url.searchParams.append('pageNumber', '1')
      url.searchParams.append('pageSize', '1000') // Large page size for grouping
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.status === 204) {
        setStamps(mockStamps) // Fall back to mock data if no stamps
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch stamps')
      }

      const data = await response.json()
      const fetchedStamps = data.items || []
      
      // If no stamps from API, use mock data for demo
      setStamps(fetchedStamps.length > 0 ? fetchedStamps : mockStamps)
    } catch (err) {
      console.warn('API error, using mock data:', err)
      // Fall back to mock data on error
      setStamps(mockStamps)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStamps()
  }, [])

  // Filter stamps based on search term
  const filteredStamps = useMemo(() => {
    if (!searchTerm) return stamps
    
    const lowerSearchTerm = searchTerm.toLowerCase()
    return stamps.filter(stamp => 
      stamp.name.toLowerCase().includes(lowerSearchTerm) ||
      stamp.seriesName.toLowerCase().includes(lowerSearchTerm) ||
      stamp.country.toLowerCase().includes(lowerSearchTerm) ||
      stamp.color.toLowerCase().includes(lowerSearchTerm) ||
      (stamp.denominationValue && stamp.denominationSymbol && 
       `${stamp.denominationValue}${stamp.denominationSymbol}`.toLowerCase().includes(lowerSearchTerm))
    )
  }, [stamps, searchTerm])

  // Group stamps by the selected grouping levels
  const groupedStamps = useMemo(() => {
    const groupStamps = (stamps: StampData[], levels: GroupingField[]): GroupedStamps => {
      if (levels.length === 0) {
        return { "All Stamps": stamps }
      }

      const [currentLevel, ...remainingLevels] = levels
      const grouped: GroupedStamps = {}

      stamps.forEach(stamp => {
        let groupKey: string
        
        switch (currentLevel) {
          case 'seriesName':
            groupKey = stamp.seriesName || 'Unknown Series'
            break
          case 'issueYear':
            groupKey = stamp.issueYear ? stamp.issueYear.toString() : 'Unknown Year'
            break
          case 'country':
            groupKey = stamp.country || 'Unknown Country'
            break
          case 'color':
            groupKey = stamp.color || 'Unknown Color'
            break
          case 'paperType':
            groupKey = stamp.paperType || 'Unknown Paper Type'
            break
          case 'denominationValue':
            groupKey = stamp.denominationValue 
              ? `${stamp.denominationValue}${stamp.denominationSymbol || ''}`
              : 'Unknown Denomination'
            break
          case 'publisher':
            groupKey = stamp.publisher || 'Unknown Publisher'
            break
          default:
            groupKey = 'Other'
        }

        if (!grouped[groupKey]) {
          grouped[groupKey] = []
        }

        if (Array.isArray(grouped[groupKey])) {
          (grouped[groupKey] as StampData[]).push(stamp)
        }
      })

      // If there are more levels, recursively group each sub-group
      if (remainingLevels.length > 0) {
        Object.keys(grouped).forEach(key => {
          if (Array.isArray(grouped[key])) {
            grouped[key] = groupStamps(grouped[key] as StampData[], remainingLevels)
          }
        })
      }

      return grouped
    }

    return groupStamps(filteredStamps, groupingLevels)
  }, [filteredStamps, groupingLevels])

  // Filter groups based on group search term
  const filteredGroups = useMemo(() => {
    if (!groupSearchTerm) return groupedStamps

    const filterGroups = (groups: GroupedStamps): GroupedStamps => {
      const filtered: GroupedStamps = {}
      const lowerSearchTerm = groupSearchTerm.toLowerCase()

      Object.entries(groups).forEach(([key, value]) => {
        // Check if the group key matches the search term
        if (key.toLowerCase().includes(lowerSearchTerm)) {
          filtered[key] = value
        } else if (!Array.isArray(value)) {
          // If it's a nested group, recursively filter
          const nestedFiltered = filterGroups(value as GroupedStamps)
          if (Object.keys(nestedFiltered).length > 0) {
            filtered[key] = nestedFiltered
          }
        }
      })

      return filtered
    }

    return filterGroups(groupedStamps)
  }, [groupedStamps, groupSearchTerm])

  // Get top-level group options for quick filter
  const topLevelGroups = useMemo(() => {
    if (groupingLevels.length === 0) return []
    
    const topLevel = Object.keys(groupedStamps)
    return topLevel.sort()
  }, [groupedStamps, groupingLevels])

  const setQuickGroupFilter = (groupName: string) => {
    setGroupSearchTerm(groupName)
  }

  const clearGroupSearch = () => {
    setGroupSearchTerm("")
  }

  // Count total stamps in filtered groups
  const countStampsInGroups = (groups: GroupedStamps | StampData[]): number => {
    if (Array.isArray(groups)) {
      return groups.length
    }
    
    return Object.values(groups).reduce((total, value) => {
      return total + countStampsInGroups(value)
    }, 0)
  }

  const filteredStampsCount = useMemo(() => {
    return countStampsInGroups(filteredGroups)
  }, [filteredGroups])

  // Navigation functions
  const navigateToGroup = (groupName: string) => {
    const newPath = [...navigation.path, groupName]
    updateURL(newPath)
  }

  const navigateToLevel = (level: number) => {
    const newPath = navigation.path.slice(0, level)
    updateURL(newPath)
  }

  const navigateBack = () => {
    if (navigation.level > 0) {
      navigateToLevel(navigation.level - 1)
    }
  }

  const navigateHome = () => {
    updateURL([])
  }

  // Share current URL
  const shareCurrentURL = async () => {
    const currentURL = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Catalog 2.0 - Stamp Collection',
          url: currentURL
        })
      } else {
        await navigator.clipboard.writeText(currentURL)
        toast({
          title: "URL copied to clipboard",
          description: "You can now share this URL with others",
        })
      }
    } catch (error) {
      console.error('Error sharing URL:', error)
    }
  }

  // Get current level data based on navigation path
  const getCurrentLevelData = useMemo(() => {
    let currentData: GroupedStamps | StampData[] = filteredGroups
    
    for (const pathSegment of navigation.path) {
      if (!Array.isArray(currentData) && currentData[pathSegment]) {
        currentData = currentData[pathSegment]
      } else {
        // Path doesn't exist, reset to root
        updateURL([])
        return filteredGroups
      }
    }
    
    return currentData
  }, [filteredGroups, navigation.path])

  const addGroupingLevel = (field: GroupingField) => {
    if (!groupingLevels.includes(field)) {
      setGroupingLevels([...groupingLevels, field])
      // Reset navigation when grouping changes
      updateURL([])
    }
  }

  const removeGroupingLevel = (index: number) => {
    const newLevels = groupingLevels.filter((_, i) => i !== index)
    setGroupingLevels(newLevels)
    // Reset navigation when grouping changes
    updateURL([])
  }

  const formatDenomination = (value: number, symbol: string) => {
    return value ? `${value}${symbol || ''}` : 'N/A'
  }

  const handleStampClick = (stamp: StampData) => {
    setSelectedStamp(stamp)
    setIsDetailsDialogOpen(true)
  }

  const handleCloseDetails = () => {
    setIsDetailsDialogOpen(false)
    setSelectedStamp(null)
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const renderStampCard = (stamp: StampData) => (
    <Card 
      key={stamp.id} 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => handleStampClick(stamp)}
    >
      <div className="aspect-square relative">
        <Image
          src={stamp.stampImageUrl || "/placeholder.svg"}
          alt={stamp.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
        />
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium text-sm truncate" title={stamp.name}>
          {stamp.name}
        </h3>
        <div className="space-y-1 mt-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Series</span>
            <span className="truncate ml-2" title={stamp.seriesName}>
              {stamp.seriesName}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Year</span>
            <span>{stamp.issueYear || 'N/A'}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Value</span>
            <span>{formatDenomination(stamp.denominationValue, stamp.denominationSymbol)}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Country</span>
            <span className="truncate ml-2" title={stamp.country}>
              {stamp.country}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderStampList = (stamp: StampData) => (
    <Card 
      key={stamp.id} 
      className="mb-2 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => handleStampClick(stamp)}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 relative flex-shrink-0">
            <Image
              src={stamp.stampImageUrl || "/placeholder.svg"}
              alt={stamp.name}
              fill
              className="object-cover rounded"
              sizes="64px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate" title={stamp.name}>
              {stamp.name}
            </h3>
            <div className="flex flex-wrap gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {stamp.seriesName}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {stamp.issueYear || 'Unknown Year'}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {formatDenomination(stamp.denominationValue, stamp.denominationSymbol)}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {stamp.country}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderCurrentLevel = () => {
    const currentData = getCurrentLevelData
    
    // If no grouping levels are set, show all filtered stamps directly
    if (groupingLevels.length === 0) {
      return (
        <div className={cn(
          viewMode === 'grid' 
            ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
            : "space-y-2"
        )}>
          {filteredStamps.map(stamp => 
            viewMode === 'grid' ? renderStampCard(stamp) : renderStampList(stamp)
          )}
        </div>
      )
    }
    
    if (Array.isArray(currentData)) {
      // We're at the final level - show stamps
      return (
        <div className={cn(
          viewMode === 'grid' 
            ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
            : "space-y-2"
        )}>
          {currentData.map(stamp => 
            viewMode === 'grid' ? renderStampCard(stamp) : renderStampList(stamp)
          )}
        </div>
      )
    }

    // We're at a group level - show groups as clickable cards
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Object.entries(currentData).map(([groupName, groupData]) => {
          const stampCount = countStampsInGroups(groupData)
          
          return (
            <Card 
              key={groupName} 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary/20"
              onClick={() => navigateToGroup(groupName)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-lg truncate" title={groupName}>
                    {groupName}
                  </h3>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-sm">
                    {stampCount} stamp{stampCount !== 1 ? 's' : ''}
                  </Badge>
                  {navigation.level < groupingLevels.length - 1 && (
                    <span className="text-xs text-muted-foreground">
                      {GROUPING_FIELDS.find(f => f.value === groupingLevels[navigation.level + 1])?.label}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  const renderBreadcrumbs = () => {
    if (navigation.path.length === 0) return null

    return (
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink 
              href="#" 
              onClick={(e) => { e.preventDefault(); navigateHome() }}
              className="flex items-center gap-1"
            >
              <Home className="h-4 w-4" />
              Catalog
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          {navigation.path.map((segment, index) => (
            <div key={index} className="flex items-center">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {index === navigation.path.length - 1 ? (
                  <BreadcrumbPage>{segment}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); navigateToLevel(index + 1) }}
                  >
                    {segment}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  const renderStampDetails = () => {
    if (!selectedStamp) return null

    return (
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{selectedStamp.name}</DialogTitle>
            <DialogDescription>
              Complete stamp information and details
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
            {/* Stamp Image */}
            <div className="space-y-4">
              <div className="aspect-square relative bg-gray-50 rounded-lg overflow-hidden">
                <Image
                  src={selectedStamp.stampImageUrl || "/placeholder.svg"}
                  alt={selectedStamp.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              
              {/* Quick Info Cards */}
              <div className="grid grid-cols-2 gap-2">
                <Card className="p-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {formatDenomination(selectedStamp.denominationValue, selectedStamp.denominationSymbol)}
                    </div>
                    <div className="text-xs text-muted-foreground">Face Value</div>
                  </div>
                </Card>
                <Card className="p-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {selectedStamp.issueYear || 'Unknown'}
                    </div>
                    <div className="text-xs text-muted-foreground">Issue Year</div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Stamp Details */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Basic Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stamp Code:</span>
                    <span className="font-medium">{selectedStamp.stampCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Country:</span>
                    <span className="font-medium">{selectedStamp.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Publisher:</span>
                    <span className="font-medium">{selectedStamp.publisher}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Series:</span>
                    <span className="font-medium">{selectedStamp.seriesName}</span>
                  </div>
                </div>
              </div>

              {/* Catalog Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Catalog Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Catalog:</span>
                    <span className="font-medium">{selectedStamp.catalogName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Catalog Number:</span>
                    <span className="font-medium">{selectedStamp.catalogNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Issue Date:</span>
                    <span className="font-medium">{formatDate(selectedStamp.issueDate)}</span>
                  </div>
                </div>
              </div>

              {/* Physical Properties */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Physical Properties
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Color:</span>
                    <span className="font-medium">{selectedStamp.color}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Paper Type:</span>
                    <span className="font-medium">{selectedStamp.paperType || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Denomination:</span>
                    <span className="font-medium">
                      {selectedStamp.denominationValue} {selectedStamp.denominationCurrency}
                    </span>
                  </div>
                </div>
              </div>

              {/* Value Information */}
              {(selectedStamp.estimatedMarketValue || selectedStamp.actualPrice) && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    Value Information
                  </h3>
                  <div className="space-y-3">
                    {selectedStamp.estimatedMarketValue && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Estimated Market Value:</span>
                        <span className="font-medium">${selectedStamp.estimatedMarketValue.toFixed(2)}</span>
                      </div>
                    )}
                    {selectedStamp.actualPrice && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Actual Price:</span>
                        <span className="font-medium">${selectedStamp.actualPrice.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Status Badge */}
              <div className="pt-4">
                <Badge variant={selectedStamp.status === 1 ? "default" : "secondary"} className="text-sm">
                  {selectedStamp.status === 1 ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading stamps...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchStamps}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Catalog 2.0</h1>
          <p className="text-muted-foreground">Advanced stamp catalog with flexible grouping</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={shareCurrentURL}
            title="Share current view"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Grouping & Search Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search Stamps</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by name, series, country, color, or denomination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Grouping Levels */}
          <div className="space-y-2">
            <Label>Grouping Levels (in order)</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {groupingLevels.map((level, index) => (
                <Badge key={index} variant="default" className="flex items-center gap-1">
                  {GROUPING_FIELDS.find(f => f.value === level)?.label}
                  <button
                    onClick={() => removeGroupingLevel(index)}
                    className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <Select onValueChange={(value) => addGroupingLevel(value as GroupingField)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Add grouping level" />
              </SelectTrigger>
              <SelectContent>
                {GROUPING_FIELDS.filter(field => !groupingLevels.includes(field.value)).map(field => (
                  <SelectItem key={field.value} value={field.value}>
                    {field.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Group Search */}
          {groupingLevels.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="groupSearch">Search Groups</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="groupSearch"
                  placeholder={`Search ${GROUPING_FIELDS.find(f => f.value === groupingLevels[0])?.label.toLowerCase() || 'groups'}...`}
                  value={groupSearchTerm}
                  onChange={(e) => setGroupSearchTerm(e.target.value)}
                  className="pl-10"
                />
                {groupSearchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8 p-0"
                    onClick={clearGroupSearch}
                  >
                    ×
                  </Button>
                )}
              </div>
              
              {/* Quick Group Filters */}
              {topLevelGroups.length > 0 && topLevelGroups.length <= 15 && (
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Quick filters:</Label>
                  <div className="flex flex-wrap gap-1">
                    {topLevelGroups.slice(0, 10).map(groupName => (
                      <Button
                        key={groupName}
                        variant={groupSearchTerm === groupName ? "default" : "outline"}
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => setQuickGroupFilter(groupName)}
                      >
                        {groupName}
                      </Button>
                    ))}
                    {topLevelGroups.length > 10 && (
                      <span className="text-xs text-muted-foreground flex items-center px-2">
                        +{topLevelGroups.length - 10} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            Found {filteredStamps.length} stamps
            {groupSearchTerm && ` • Showing ${filteredStampsCount} stamps in groups matching "${groupSearchTerm}"`}
          </div>
        </CardContent>
      </Card>

      {/* Grouped Stamps */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>
              {groupingLevels.length === 0 ? 'All Stamps' :
               navigation.level === 0 ? 'All Groups' : 
               navigation.level >= groupingLevels.length ? 'Stamps' :
               `${GROUPING_FIELDS.find(f => f.value === groupingLevels[navigation.level])?.label || 'Groups'}`}
            </CardTitle>
            {navigation.level > 0 && (
              <Button variant="outline" size="sm" onClick={navigateBack} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}
          </div>
          {renderBreadcrumbs()}
        </CardHeader>
        <CardContent className="p-6">
          {filteredStamps.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No stamps found</p>
            </div>
          ) : Object.keys(filteredGroups).length === 0 && groupSearchTerm ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No groups found matching "{groupSearchTerm}"</p>
              <Button variant="outline" className="mt-2" onClick={clearGroupSearch}>
                Clear group search
              </Button>
            </div>
          ) : (
            renderCurrentLevel()
          )}
        </CardContent>
      </Card>

      {renderStampDetails()}
    </div>
  )
} 