"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Search, Calendar, BookOpen, Archive, Eye, ChevronRight, ArrowLeft, Home, Sparkles, Coins, Palette, Grid, Filter, Share2, Layers, Globe, Star, Zap, Gem, Heart, Navigation, MapPin, Clock, DollarSign, FileText, Package, Menu, User, Settings } from "lucide-react"
import Image from "next/image"
import { AuthGuard } from "@/components/auth/route-guard"
import { cn } from "@/lib/utils"
import { useRef } from "react"

// Enhanced interfaces for modern catalog
interface StampData {
  id: string
  name: string
  country: string
  stampImageUrl: string
  catalogNumber: string
  seriesName: string
  issueDate: string
  issueYear: number
  denominationValue: number
  denominationSymbol: string
  color: string
  paperType: string
  stampDetailsJson: string
  stampCode: string
  marketValue?: number
  rarity?: string
  condition?: string
}

interface NavigationLevel {
  type: string
  id: string
  name: string
  code?: string
}

interface CountryData {
  code: string
  name: string
  flag: string
  totalStamps: number
  firstIssue: string
  lastIssue: string
  featuredStampUrl?: string
}

interface StampGroupData {
  id: string
  name: string
  catalogNumber: string
  totalStamps: number
  stampImageUrl: string
  description?: string
  period: string
}

interface YearData {
  year: number
  totalStamps: number
  firstIssue: string
  lastIssue: string
  highlightedSeries?: string
}

interface CurrencyData {
  code: string
  name: string
  symbol: string
  totalStamps: number
  country: string
}

interface DenominationData {
  value: string
  symbol: string
  displayName: string
  totalStamps: number
  stampImageUrl: string
  commonColors: string[]
}

interface ColorData {
  code: string
  name: string
  hexColor: string
  totalStamps: number
  stampImageUrl: string
  popularity: number
}

interface PaperData {
  code: string
  name: string
  description: string
  totalStamps: number
  stampImageUrl: string
  texture: string
}

interface WatermarkData {
  code: string
  name: string
  description: string
  totalStamps: number
  stampImageUrl: string
  pattern: string
}

interface PerforationData {
  code: string
  name: string
  measurement: string
  totalStamps: number
  stampImageUrl: string
  style: string
}

interface ItemTypeData {
  code: string
  name: string
  description: string
  totalStamps: number
  stampImageUrl: string
  category: string
}

// Navigation levels configuration
const NAVIGATION_LEVELS = [
  { 
    key: 'countries', 
    title: 'Countries & Territories', 
    icon: Globe, 
    description: 'Explore stamps by country of origin'
  },
  { 
    key: 'stampGroups', 
    title: 'Stamp Series & Groups', 
    icon: Layers, 
    description: 'Browse different stamp series and collections'
  },
  { 
    key: 'years', 
    title: 'Issue Years', 
    icon: Calendar, 
    description: 'Filter by year of issue'
  },
  { 
    key: 'currencies', 
    title: 'Currencies', 
    icon: Coins, 
    description: 'Browse by currency denomination'
  },
  { 
    key: 'denominations', 
    title: 'Denominations', 
    icon: Star, 
    description: 'Filter by stamp value'
  },
  { 
    key: 'colors', 
    title: 'Colors', 
    icon: Palette, 
    description: 'Browse by dominant color'
  },
  { 
    key: 'papers', 
    title: 'Paper Types', 
    icon: BookOpen, 
    description: 'Filter by paper characteristics'
  },
  { 
    key: 'watermarks', 
    title: 'Watermarks', 
    icon: Gem, 
    description: 'Browse by watermark patterns'
  },
  { 
    key: 'perforations', 
    title: 'Perforations', 
    icon: Grid, 
    description: 'Filter by perforation measurements'
  },
  { 
    key: 'itemTypes', 
    title: 'Item Types', 
    icon: Archive, 
    description: 'Browse by condition and type'
  },
  { 
    key: 'stamps', 
    title: 'Stamp Collection', 
    icon: Heart, 
    description: 'View individual stamps'
  }
]

// Sidebar navigation config
const SIDEBAR_LEVELS = [
  { key: 'countries', icon: Globe, label: 'Countries' },
  { key: 'stampGroups', icon: Layers, label: 'Groups' },
  { key: 'years', icon: Calendar, label: 'Years' },
  { key: 'currencies', icon: Coins, label: 'Currencies' },
  { key: 'denominations', icon: DollarSign, label: 'Denominations' },
  { key: 'colors', icon: Palette, label: 'Colors' },
  { key: 'papers', icon: FileText, label: 'Papers' },
  { key: 'watermarks', icon: Gem, label: 'Watermarks' },
  { key: 'perforations', icon: Zap, label: 'Perforations' },
  { key: 'itemTypes', icon: Package, label: 'Types' },
  { key: 'stamps', icon: Star, label: 'Stamps' },
]

export function ModernCatalogContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Navigation state from URL
  const [navigationPath, setNavigationPath] = useState<NavigationLevel[]>([])
  const [currentLevel, setCurrentLevel] = useState<string>('countries')
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Data states
  const [countries, setCountries] = useState<CountryData[]>([])
  const [stampGroups, setStampGroups] = useState<StampGroupData[]>([])
  const [years, setYears] = useState<YearData[]>([])
  const [currencies, setCurrencies] = useState<CurrencyData[]>([])
  const [denominations, setDenominations] = useState<DenominationData[]>([])
  const [colors, setColors] = useState<ColorData[]>([])
  const [papers, setPapers] = useState<PaperData[]>([])
  const [watermarks, setWatermarks] = useState<WatermarkData[]>([])
  const [perforations, setPerforations] = useState<PerforationData[]>([])
  const [itemTypes, setItemTypes] = useState<ItemTypeData[]>([])
  const [stamps, setStamps] = useState<StampData[]>([])

  // Add a fade transition for catalogue level changes
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in')
  const prevLevelRef = useRef(currentLevel)

  // Smooth transition on navigation
  useEffect(() => {
    if (prevLevelRef.current !== currentLevel) {
      setFadeState('out')
      const timeout = setTimeout(() => {
        setFadeState('in')
        prevLevelRef.current = currentLevel
      }, 250)
      return () => clearTimeout(timeout)
    }
  }, [currentLevel])

  // Initialize from URL parameters
  useEffect(() => {
    const pathParam = searchParams.get('path')
    const searchParam = searchParams.get('search')
    
    if (pathParam) {
      try {
        const decodedPath = decodeURIComponent(pathParam)
        const pathItems = decodedPath.split(',').filter(Boolean)
        reconstructNavigationFromPath(pathItems)
      } catch (error) {
        console.error('Error parsing path parameter:', error)
        loadInitialData()
      }
    } else {
      loadInitialData()
    }
    
    if (searchParam) {
      setSearchTerm(decodeURIComponent(searchParam))
    }
  }, [searchParams])

  // Update URL when navigation changes
  const updateURL = (newPath: NavigationLevel[], preserveSearch: boolean = true) => {
    const params = new URLSearchParams()
    
    if (newPath.length > 0) {
      const pathString = newPath.map(level => `${level.type}:${level.id}:${level.name}`).join(',')
      params.set('path', encodeURIComponent(pathString))
    }
    
    if (preserveSearch && searchTerm) {
      params.set('search', encodeURIComponent(searchTerm))
    }
    
    const queryString = params.toString()
    const url = queryString ? `/modern-catalogue?${queryString}` : '/modern-catalogue'
    router.push(url, { scroll: false })
  }

  // Reconstruct navigation from URL path
  const reconstructNavigationFromPath = async (pathItems: string[]) => {
    const path: NavigationLevel[] = []
    
    for (const item of pathItems) {
      const [type, id, name] = item.split(':')
      if (type && id && name) {
        path.push({ type, id, name })
      }
    }
    
    setNavigationPath(path)
    setCurrentLevel(getNextLevelType(path))
    await loadDataForCurrentLevel(path)
  }

  // Get next level type based on current path
  const getNextLevelType = (path: NavigationLevel[]): string => {
    const levelTypes = ['countries', 'stampGroups', 'years', 'currencies', 'denominations', 'colors', 'papers', 'watermarks', 'perforations', 'itemTypes', 'stamps']
    return levelTypes[path.length] || 'stamps'
  }

  // Navigation functions
  const navigateToLevel = (type: string, id: string, name: string) => {
    const newPath = [...navigationPath, { type, id, name }]
    setNavigationPath(newPath)
    setCurrentLevel(getNextLevelType(newPath))
    updateURL(newPath)
    loadDataForCurrentLevel(newPath)
  }

  const navigateBack = () => {
    if (navigationPath.length > 0) {
      const newPath = navigationPath.slice(0, -1)
      setNavigationPath(newPath)
      setCurrentLevel(getNextLevelType(newPath))
      updateURL(newPath)
      loadDataForCurrentLevel(newPath)
    }
  }

  const navigateHome = () => {
    setNavigationPath([])
    setCurrentLevel('countries')
    updateURL([])
    loadInitialData()
  }

  const navigateToBreadcrumb = (index: number) => {
    const newPath = navigationPath.slice(0, index + 1)
    setNavigationPath(newPath)
    setCurrentLevel(getNextLevelType(newPath))
    updateURL(newPath)
    loadDataForCurrentLevel(newPath)
  }

  // Data loading functions
  const loadInitialData = async () => {
    setLoading(true)
    setError(null)
    try {
      await loadCountries()
    } catch (err) {
      setError('Failed to load catalog data')
      console.error('Error loading initial data:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadDataForCurrentLevel = async (path: NavigationLevel[]) => {
    setLoading(true)
    setError(null)
    try {
      const level = getNextLevelType(path)
      
      switch (level) {
        case 'countries':
          await loadCountries()
          break
        case 'stampGroups':
          await loadStampGroups(path[0]?.id)
          break
        case 'years':
          await loadYears(path[0]?.id, path[1]?.id)
          break
        case 'currencies':
          await loadCurrencies(path[0]?.id, path[2]?.id)
          break
        case 'denominations':
          await loadDenominations(path[0]?.id, path[3]?.id)
          break
        case 'colors':
          await loadColors(path[0]?.id, path[4]?.id)
          break
        case 'papers':
          await loadPapers(path[0]?.id, path[5]?.id)
          break
        case 'watermarks':
          await loadWatermarks(path[0]?.id, path[6]?.id)
          break
        case 'perforations':
          await loadPerforations(path[0]?.id, path[7]?.id)
          break
        case 'itemTypes':
          await loadItemTypes(path[0]?.id, path[8]?.id)
          break
        case 'stamps':
          await loadStamps(path[0]?.id, path[9]?.id)
          break
      }
    } catch (err) {
      setError('Failed to load data for current level')
      console.error('Error loading level data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Mock data generation functions (replace with real API calls)
  const loadCountries = async () => {
    const mockCountries: CountryData[] = [
      {
        code: 'US',
        name: 'United States',
        flag: '🇺🇸',
        totalStamps: 2547,
        firstIssue: '1847',
        lastIssue: '2024',
        featuredStampUrl: '/images/stamps/stamp.png'
      },
      {
        code: 'GB',
        name: 'United Kingdom',
        flag: '🇬🇧',
        totalStamps: 1823,
        firstIssue: '1840',
        lastIssue: '2024',
        featuredStampUrl: '/images/stamps/stamp.png'
      },
      {
        code: 'CA',
        name: 'Canada',
        flag: '🇨🇦',
        totalStamps: 1456,
        firstIssue: '1851',
        lastIssue: '2024',
        featuredStampUrl: '/images/stamps/stamp.png'
      },
      {
        code: 'AU',
        name: 'Australia',
        flag: '🇦🇺',
        totalStamps: 1234,
        firstIssue: '1856',
        lastIssue: '2024',
        featuredStampUrl: '/images/stamps/stamp.png'
      },
      {
        code: 'DE',
        name: 'Germany',
        flag: '🇩🇪',
        totalStamps: 2156,
        firstIssue: '1872',
        lastIssue: '2024',
        featuredStampUrl: '/images/stamps/stamp.png'
      },
      {
        code: 'FR',
        name: 'France',
        flag: '🇫🇷',
        totalStamps: 1987,
        firstIssue: '1849',
        lastIssue: '2024',
        featuredStampUrl: '/images/stamps/stamp.png'
      }
    ]
    
    setCountries(mockCountries)
  }

  const loadStampGroups = async (countryCode?: string) => {
    const mockGroups: StampGroupData[] = [
      {
        id: 'commemorative',
        name: 'Commemorative Issues',
        catalogNumber: 'COM-001',
        totalStamps: 456,
        stampImageUrl: '/images/stamps/stamp.png',
        description: 'Special commemorative stamps celebrating important events and figures',
        period: '1920-2024'
      },
      {
        id: 'definitive',
        name: 'Definitive Series',
        catalogNumber: 'DEF-001',
        totalStamps: 234,
        stampImageUrl: '/images/stamps/stamp.png',
        description: 'Regular postal stamps for everyday use',
        period: '1900-2024'
      },
      {
        id: 'airmail',
        name: 'Airmail',
        catalogNumber: 'AIR-001',
        totalStamps: 123,
        stampImageUrl: '/images/stamps/stamp.png',
        description: 'Stamps specifically designed for airmail service',
        period: '1925-1980'
      }
    ]
    
    setStampGroups(mockGroups)
  }

  const loadYears = async (countryCode?: string, groupId?: string) => {
    const mockYears: YearData[] = Array.from({ length: 20 }, (_, i) => ({
      year: 2024 - i,
      totalStamps: Math.floor(Math.random() * 50) + 10,
      firstIssue: `${2024 - i}-01-01`,
      lastIssue: `${2024 - i}-12-31`,
      highlightedSeries: i % 3 === 0 ? 'Special Edition' : undefined
    }))
    
    setYears(mockYears)
  }

  const loadCurrencies = async (countryCode?: string, year?: string) => {
    const mockCurrencies: CurrencyData[] = [
      { code: 'USD', name: 'US Dollar', symbol: '$', totalStamps: 456, country: 'United States' },
      { code: 'GBP', name: 'British Pound', symbol: '£', totalStamps: 234, country: 'United Kingdom' },
      { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', totalStamps: 123, country: 'Canada' }
    ]
    
    setCurrencies(mockCurrencies)
  }

  const loadDenominations = async (countryCode?: string, currencyCode?: string) => {
    const mockDenominations: DenominationData[] = [
      {
        value: '1',
        symbol: '¢',
        displayName: '1 Cent',
        totalStamps: 89,
        stampImageUrl: '/images/stamps/stamp.png',
        commonColors: ['Red', 'Blue']
      },
      {
        value: '5',
        symbol: '¢',
        displayName: '5 Cents',
        totalStamps: 67,
        stampImageUrl: '/images/stamps/stamp.png',
        commonColors: ['Green', 'Purple']
      }
    ]
    
    setDenominations(mockDenominations)
  }

  const loadColors = async (countryCode?: string, denomination?: string) => {
    const mockColors: ColorData[] = [
      {
        code: 'red',
        name: 'Red',
        hexColor: '#dc2626',
        totalStamps: 45,
        stampImageUrl: '/images/stamps/stamp.png',
        popularity: 8
      },
      {
        code: 'blue',
        name: 'Blue',
        hexColor: '#2563eb',
        totalStamps: 67,
        stampImageUrl: '/images/stamps/stamp.png',
        popularity: 9
      },
      {
        code: 'green',
        name: 'Green',
        hexColor: '#16a34a',
        totalStamps: 34,
        stampImageUrl: '/images/stamps/stamp.png',
        popularity: 7
      }
    ]
    
    setColors(mockColors)
  }

  const loadPapers = async (countryCode?: string, colorCode?: string) => {
    const mockPapers: PaperData[] = [
      {
        code: 'wove',
        name: 'Wove Paper',
        description: 'Standard wove paper with smooth texture',
        totalStamps: 234,
        stampImageUrl: '/images/stamps/white-paper.png',
        texture: 'Smooth'
      },
      {
        code: 'laid',
        name: 'Laid Paper',
        description: 'Laid paper with visible watermark lines',
        totalStamps: 123,
        stampImageUrl: '/images/stamps/white-paper.png',
        texture: 'Textured'
      }
    ]
    
    setPapers(mockPapers)
  }

  const loadWatermarks = async (countryCode?: string, paperCode?: string) => {
    const mockWatermarks: WatermarkData[] = [
      {
        code: 'crown',
        name: 'Crown Watermark',
        description: 'Traditional royal crown pattern embedded in paper',
        totalStamps: 156,
        stampImageUrl: '/images/stamps/stamp.png',
        pattern: 'Crown'
      },
      {
        code: 'star',
        name: 'Star Watermark',
        description: 'Decorative star pattern watermark',
        totalStamps: 89,
        stampImageUrl: '/images/stamps/stamp.png',
        pattern: 'Star'
      }
    ]
    
    setWatermarks(mockWatermarks)
  }

  const loadPerforations = async (countryCode?: string, watermarkCode?: string) => {
    const mockPerforations: PerforationData[] = [
      {
        code: 'perf12',
        name: 'Perforated 12',
        measurement: '12 x 12',
        totalStamps: 234,
        stampImageUrl: '/images/stamps/stamp.png',
        style: 'Standard'
      },
      {
        code: 'perf14',
        name: 'Perforated 14',
        measurement: '14 x 14',
        totalStamps: 123,
        stampImageUrl: '/images/stamps/stamp.png',
        style: 'Fine'
      }
    ]
    
    setPerforations(mockPerforations)
  }

  const loadItemTypes = async (countryCode?: string, perforationCode?: string) => {
    const mockItemTypes: ItemTypeData[] = [
      {
        code: 'mint',
        name: 'Mint Condition',
        description: 'Never hinged, pristine condition stamps',
        totalStamps: 89,
        stampImageUrl: '/images/stamps/stamp.png',
        category: 'Condition'
      },
      {
        code: 'used',
        name: 'Used',
        description: 'Postally used stamps with cancellation marks',
        totalStamps: 156,
        stampImageUrl: '/images/stamps/stamp.png',
        category: 'Condition'
      }
    ]
    
    setItemTypes(mockItemTypes)
  }

  const loadStamps = async (countryCode?: string, itemTypeCode?: string) => {
    const mockStamps: StampData[] = Array.from({ length: 20 }, (_, i) => ({
      id: `stamp-${i + 1}`,
      name: `Historic Stamp ${i + 1}`,
      country: 'United States',
      stampImageUrl: '/images/stamps/stamp.png',
      catalogNumber: `SC-${1000 + i}`,
      seriesName: 'Heritage Collection',
      issueDate: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-01`,
      issueYear: 2023,
      denominationValue: [1, 5, 10, 25, 50][Math.floor(Math.random() * 5)],
      denominationSymbol: '¢',
      color: ['Red', 'Blue', 'Green', 'Purple', 'Orange'][Math.floor(Math.random() * 5)],
      paperType: 'Wove',
      stampDetailsJson: '{}',
      stampCode: `SC${1000 + i}`,
      marketValue: Math.floor(Math.random() * 1000) + 50,
      rarity: ['Common', 'Uncommon', 'Rare', 'Very Rare'][Math.floor(Math.random() * 4)],
      condition: ['Mint', 'Near Mint', 'Fine', 'Good'][Math.floor(Math.random() * 4)]
    }))
    
    setStamps(mockStamps)
  }

  const getCurrentLevelData = () => {
    switch (currentLevel) {
      case 'countries': return countries
      case 'stampGroups': return stampGroups
      case 'years': return years
      case 'currencies': return currencies
      case 'denominations': return denominations
      case 'colors': return colors
      case 'papers': return papers
      case 'watermarks': return watermarks
      case 'perforations': return perforations
      case 'itemTypes': return itemTypes
      case 'stamps': return stamps
      default: return []
    }
  }

  // Filter data based on search term
  const filteredData = useMemo(() => {
    const data = getCurrentLevelData()
    if (!searchTerm) return data
    
    if (!Array.isArray(data)) return data
    
    return data.filter((item: any) => 
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.catalogNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm, currentLevel, countries, stampGroups, years, currencies, denominations, colors, papers, watermarks, perforations, itemTypes, stamps])

  const getCurrentLevelConfig = () => {
    return NAVIGATION_LEVELS.find(level => level.key === currentLevel) || NAVIGATION_LEVELS[0]
  }

  // Render breadcrumbs
  const renderBreadcrumbs = () => {
    if (navigationPath.length === 0) return null

    return (
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="#"
                onClick={(e) => { e.preventDefault(); navigateHome() }}
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Home className="h-4 w-4" />
                Catalog
              </BreadcrumbLink>
            </BreadcrumbItem>

            {navigationPath.map((level, index) => (
              <BreadcrumbItem key={index}>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                {index === navigationPath.length - 1 ? (
                  <BreadcrumbPage className="font-medium text-primary">
                    {level.name}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href="#"
                    onClick={(e) => { e.preventDefault(); navigateToBreadcrumb(index) }}
                    className="hover:text-primary transition-colors"
                  >
                    {level.name}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    )
  }

  const renderCountries = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {(filteredData as CountryData[]).map((country) => (
        <div
          key={country.code}
          className={
            `group relative cursor-pointer bg-white dark:bg-[#232b3b] shadow-md rounded-2xl transition-all duration-300
            hover:shadow-xl hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-primary/30`
          }
          tabIndex={0}
          onClick={() => navigateToLevel('countries', country.code, country.name)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigateToLevel('countries', country.code, country.name) }}
          aria-label={`View ${country.name}`}
          style={{ minHeight: 180 }}
        >
          <div className="flex items-center gap-4 p-5">
            <div className="text-3xl drop-shadow-sm">{country.flag}</div>
            <div className="flex-1">
              <div className="text-lg font-bold font-sans text-foreground mb-1">{country.name}</div>
              <div className="text-xs text-muted-foreground font-sans">{country.firstIssue} - {country.lastIssue}</div>
            </div>
          </div>
          <div className="flex items-center justify-between px-5 pb-5">
            <Badge variant="secondary" className="bg-neutral-100 dark:bg-[#2a3142] text-neutral-700 dark:text-neutral-200 font-normal px-3 py-1 rounded-full">
              {country.totalStamps.toLocaleString()} stamps
            </Badge>
            {country.featuredStampUrl && (
              <div className="w-12 h-12 relative bg-muted/20 rounded-xl overflow-hidden shadow-sm">
                <Image
                  src={country.featuredStampUrl}
                  alt={`Featured from ${country.name}`}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )

  const groups: { id: string; name: string; period: string; totalStamps: number }[] = [
    { id: 'commemorative', name: 'Commemorative Issues', period: '1920-2024', totalStamps: 456 },
    { id: 'definitive', name: 'Definitive Series', period: '1900-2024', totalStamps: 234 },
    { id: 'airmail', name: 'Airmail', period: '1925-1980', totalStamps: 123 },
    { id: 'thematic', name: 'Thematic Stamps', period: '1950-2024', totalStamps: 312 },
  ];

  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = (country: CountryData) => { setSelectedCountry(country); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setTimeout(() => setSelectedCountry(null), 200); };

  // Kanban Board/Card Columns UI
  const timelineSteps = [
    { key: 'countries', label: 'Countries', icon: Globe, data: countries },
    { key: 'groups', label: 'Groups', icon: Layers, data: groups },
    { key: 'years', label: 'Years', icon: Calendar, data: years },
  ];
  const totalSteps = timelineSteps.length;
  const completedSteps = 1; // For demo, mark only the first as completed

  return (
    <div className="min-h-screen w-full bg-neutral-50 dark:bg-[#181c24] flex flex-col">
      {/* Progress and search bar */}
      <div className="sticky top-0 z-20 bg-white/90 dark:bg-[#1a2233]/90 backdrop-blur-md shadow-sm border-b border-border/40 px-2 sm:px-8 py-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Progress:</span>
            <div className="relative w-32 h-2 bg-muted/60 rounded-full overflow-hidden">
              <div className="absolute left-0 top-0 h-2 bg-primary rounded-full transition-all" style={{ width: `${(completedSteps / totalSteps) * 100}%` }} />
            </div>
            <span className="text-xs font-semibold text-muted-foreground">{completedSteps}/{totalSteps}</span>
          </div>
        </div>
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search catalogue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-2 rounded-full border border-border bg-white/80 dark:bg-[#232b3b]/80 focus:ring-2 focus:ring-primary/30 font-sans text-base shadow"
          />
        </div>
      </div>
      {/* Timeline */}
      <div className="flex-1 w-full max-w-5xl mx-auto px-2 sm:px-8 py-10 flex flex-col items-center">
        <div className="relative w-full flex flex-col items-center">
          {/* Vertical line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-8 bottom-8 w-1 bg-muted/40 z-0" style={{ minHeight: 300 }} />
          {/* Timeline steps */}
          {timelineSteps.map((step, idx) => (
            <div key={step.key} className="relative z-10 w-full flex flex-col items-center mb-16">
              {/* Timeline dot and label */}
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${idx < completedSteps ? 'bg-primary border-primary' : 'bg-muted/40 border-muted-foreground'}`}>
                  {React.createElement(step.icon, { className: `h-4 w-4 ${idx < completedSteps ? 'text-white' : 'text-muted-foreground'}` })}
                </div>
                <span className={`font-bold text-lg ${idx < completedSteps ? 'text-primary' : 'text-muted-foreground'}`}>{step.label}</span>
              </div>
              {/* Horizontal scrollable row of cards */}
              <div className="w-full overflow-x-auto pb-2">
                <div className="flex gap-6 px-2">
                  {step.key === 'countries' && (step.data as CountryData[]).map((country) => (
                    <div
                      key={country.code}
                      className="group relative cursor-pointer bg-white dark:bg-[#232b3b] shadow-lg rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.04] focus:outline-none focus:ring-2 focus:ring-primary/30 overflow-hidden min-w-[220px] max-w-[220px]"
                      tabIndex={0}
                      aria-label={`View details for ${country.name}`}
                    >
                      <div className="relative w-full h-28 overflow-hidden">
                        <Image
                          src={country.featuredStampUrl || '/images/stamps/stamp.png'}
                          alt={`Featured from ${country.name}`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          sizes="220px"
                        />
                        <div className="absolute top-2 left-2 text-2xl drop-shadow-sm">{country.flag}</div>
                      </div>
                      <div className="p-4 flex flex-col gap-2">
                        <div className="text-base font-bold font-sans text-foreground mb-1">{country.name}</div>
                        <div className="text-xs text-muted-foreground font-sans">{country.firstIssue} - {country.lastIssue}</div>
                        <Badge variant="secondary" className="w-fit bg-neutral-100 dark:bg-[#2a3142] text-neutral-700 dark:text-neutral-200 font-normal px-2 py-0.5 rounded-full">
                          {country.totalStamps.toLocaleString()} stamps
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {step.key === 'groups' && (step.data as { id: string; name: string; period: string; totalStamps: number }[]).map((group) => (
                    <div key={group.id} className="bg-white dark:bg-[#232b3b] shadow-lg rounded-2xl p-4 flex flex-col gap-2 min-w-[220px] max-w-[220px]">
                      <div className="font-bold text-base text-foreground">{group.name}</div>
                      <div className="text-xs text-muted-foreground">{group.period}</div>
                      <Badge variant="secondary" className="w-fit bg-neutral-100 dark:bg-[#2a3142] text-neutral-700 dark:text-neutral-200 font-normal px-2 py-0.5 rounded-full">
                        {group.totalStamps} stamps
                      </Badge>
                    </div>
                  ))}
                  {step.key === 'years' && (step.data as { year: number; totalStamps: number }[]).map((year) => (
                    <div key={year.year} className="bg-white dark:bg-[#232b3b] shadow-lg rounded-2xl p-4 flex flex-col gap-2 items-center min-w-[120px] max-w-[120px]">
                      <div className="font-bold text-lg text-foreground">{year.year}</div>
                      <Badge variant="secondary" className="w-fit bg-neutral-100 dark:bg-[#2a3142] text-neutral-700 dark:text-neutral-200 font-normal px-2 py-0.5 rounded-full">
                        {year.totalStamps} stamps
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Modal for country details */}
      {modalOpen && selectedCountry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-all">
          <div className="bg-white dark:bg-[#232b3b] rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in">
            <button
              className="absolute top-4 right-4 text-muted-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/40 rounded-full"
              onClick={closeModal}
              aria-label="Close details"
            >
              <span aria-hidden>×</span>
            </button>
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-40 h-40 rounded-xl overflow-hidden shadow">
                <Image
                  src={selectedCountry.featuredStampUrl || '/images/stamps/stamp.png'}
                  alt={`Featured from ${selectedCountry.name}`}
                  fill
                  className="object-cover"
                  sizes="160px"
                />
                <div className="absolute top-2 left-2 text-4xl drop-shadow-sm">{selectedCountry.flag}</div>
              </div>
              <div className="text-2xl font-bold text-foreground text-center">{selectedCountry.name}</div>
              <div className="text-sm text-muted-foreground">{selectedCountry.firstIssue} - {selectedCountry.lastIssue}</div>
              <Badge variant="secondary" className="w-fit bg-neutral-100 dark:bg-[#2a3142] text-neutral-700 dark:text-neutral-200 font-normal px-3 py-1 rounded-full">
                {selectedCountry.totalStamps.toLocaleString()} stamps
              </Badge>
              <div className="flex gap-4 mt-4">
                <Button variant="default">Add to Collection</Button>
                <Button variant="outline">Share</Button>
              </div>
            </div>
          </div>
          {/* Modal background click to close */}
          <button className="fixed inset-0 z-40" onClick={closeModal} aria-label="Close modal background" tabIndex={-1} />
        </div>
      )}
      {/* Placeholder for other levels */}
      {/* You can add more grids for groups, years, etc. as needed */}
    </div>
  )
}

export default function ModernCataloguePage() {
  return (
    <AuthGuard>
      <ModernCatalogContent />
    </AuthGuard>
  )
} 