"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Calendar, BookOpen, Archive, Eye, ChevronRight, X, Grid, AlertCircle, ArrowLeft, MapPin, Palette, ImageIcon, ToggleLeft, ToggleRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { AuthGuard } from "@/components/auth/route-guard"

// Traditional catalog styling - simple and clean
const traditionalStyles = {
  background: "bg-white",
  card: "bg-white border border-gray-300 shadow-sm",
  header: "text-black border-b border-gray-300",
  text: "text-black",
  mutedText: "text-gray-600",
  accent: "text-black",
  vintage: "font-serif"
}

// Layout types
type CatalogLayout = 'campbell-paterson' | 'stanley-gibbons'

// Campbell Paterson interfaces
interface SeriesData {
  id: string
  name: string
  description: string
  totalTypes: number
  country: string
  periodStart: number
  periodEnd: number
}

interface TypeData {
  id: string
  name: string
  seriesId: string
  description: string
  totalStampGroups: number
  catalogPrefix: string
}

interface StampGroupData {
  id: string
  name: string
  typeId: string
  year: number
  issueDate: string
  description: string
  watermark: string
  perforation: string
  printingMethod: string
  printer: string
  totalStamps: number
}

// Stanley Gibbons interfaces
interface CountryData {
  id: string
  name: string
  code: string
  description: string
  totalYears: number
  yearStart: number
  yearEnd: number
}

interface YearData {
  id: string
  year: number
  countryId: string
  totalReleases: number
  description: string
}

interface ReleaseData {
  id: string
  name: string
  yearId: string
  dateRange: string
  description: string
  perforation: string
  totalCategories: number
  hasCategories: boolean
}

interface CategoryData {
  id: string
  name: string
  code: string
  releaseId: string
  description: string
  totalPaperTypes: number
  hasPaperTypes: boolean
}

interface PaperTypeData {
  id: string
  name: string
  code: string
  categoryId: string
  description: string
  totalStamps: number
}

interface StampData {
  id: string
  name: string
  country: string
  stampImageUrl: string
  catalogNumber: string
  stampGroupId?: string // Campbell Paterson
  paperTypeId?: string // Stanley Gibbons
  denominationValue: number
  denominationSymbol: string
  color: string
  paperType: string
  stampDetailsJson: string
  instances: StampInstance[]
}

interface StampInstance {
  id: string
  code: string
  description: string
  mintValue: string
  usedValue: string
  rarity: string
}

interface ParsedStampDetails {
  perforation?: string
  watermark?: string
  printingMethod?: string
  designer?: string
  printRun?: string
  paperType?: string
  gum?: string
  varieties?: string[]
  theme?: string
  size?: string
  errors?: string[]
  rarityRating?: string
}

interface StampDetailData extends StampData {
  parsedDetails: ParsedStampDetails
  relatedStamps: StampData[]
  varieties: {
    perforations: string[]
    colors: string[]
    paperTypes: string[]
    errors: string[]
  }
  marketInfo?: {
    mintValue?: string
    usedValue?: string
    rarity?: string
  }
  bibliography: string
}

export function CatalogContent() {
  const [catalogLayout, setCatalogLayout] = useState<CatalogLayout>('campbell-paterson')
  
  // Campbell Paterson state
  const [seriesData, setSeriesData] = useState<SeriesData[]>([])
  
  // Stanley Gibbons state
  const [countryData, setCountryData] = useState<CountryData[]>([])
  
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all")
  
  // Modal stack state - LIFO behavior with updated types
  const [modalStack, setModalStack] = useState<Array<{
    type: 'series' | 'type' | 'stampGroup' | 'stamps' | 'country' | 'year' | 'release' | 'category' | 'paperType'
    data: any
    title: string
  }>>([])

  useEffect(() => {
    if (catalogLayout === 'campbell-paterson') {
      generateSeriesData()
    } else {
      generateCountryData()
    }
  }, [catalogLayout])

  const generateSeriesData = async () => {
    try {
      setLoading(true)
      const series: SeriesData[] = []
      
      // Generate Campbell Paterson style series data
      const campbellPatersonSeries = [
        {
          id: "full-face-queens",
          name: "Full-Face Queens",
          description: "The first stamps of New Zealand, featuring Queen Victoria's full face portrait",
          totalTypes: 3,
          country: "New Zealand",
          periodStart: 1855,
          periodEnd: 1862
        },
        {
          id: "chalon-head",
          name: "Chalon Head",
          description: "Second design featuring Queen Victoria's profile by Alfred Edward Chalon",
          totalTypes: 4,
          country: "New Zealand",
          periodStart: 1862,
          periodEnd: 1867
        },
        {
          id: "second-sideface",
          name: "Second Sideface",
          description: "Third design with modified Queen Victoria profile",
          totalTypes: 5,
          country: "New Zealand",
          periodStart: 1867,
          periodEnd: 1873
        },
        {
          id: "long-type",
          name: "Long Type",
          description: "Fourth design with elongated format",
          totalTypes: 3,
          country: "New Zealand",
          periodStart: 1873,
          periodEnd: 1878
        },
        {
          id: "short-type",
          name: "Short Type",
          description: "Fifth design with compact format",
          totalTypes: 4,
          country: "New Zealand",
          periodStart: 1878,
          periodEnd: 1882
        },
        {
          id: "pictorials",
          name: "Pictorials",
          description: "First pictorial stamps featuring New Zealand landscapes and wildlife",
          totalTypes: 6,
          country: "New Zealand",
          periodStart: 1898,
          periodEnd: 1907
        },
        {
          id: "king-edward-vii",
          name: "King Edward VII",
          description: "Stamps featuring King Edward VII portrait",
          totalTypes: 3,
          country: "New Zealand",
          periodStart: 1902,
          periodEnd: 1910
        },
        {
          id: "king-george-v",
          name: "King George V",
          description: "Stamps featuring King George V portrait and various designs",
          totalTypes: 8,
          country: "New Zealand",
          periodStart: 1915,
          periodEnd: 1936
        },
        {
          id: "king-george-vi",
          name: "King George VI",
          description: "Stamps featuring King George VI and commemorative issues",
          totalTypes: 12,
          country: "New Zealand",
          periodStart: 1937,
          periodEnd: 1952
        },
        {
          id: "queen-elizabeth-ii",
          name: "Queen Elizabeth II",
          description: "Modern stamps featuring Queen Elizabeth II and diverse themes",
          totalTypes: 25,
          country: "New Zealand",
          periodStart: 1953,
          periodEnd: 2025
        }
      ]
      
      setSeriesData(campbellPatersonSeries)
    } catch (error) {
      console.error('Error generating series data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateCountryData = async () => {
    try {
      setLoading(true)
      const countries: CountryData[] = []
      
      // Generate Stanley Gibbons style country data
      const stanleyGibbonsCountries = [
        {
          id: "great-britain",
          name: "Great Britain",
          code: "GB",
          description: "Including England, Scotland, Wales, and Northern Ireland",
          totalYears: 175,
          yearStart: 1840,
          yearEnd: 2025
        },
        {
          id: "australia",
          name: "Australia",
          code: "AU",
          description: "Commonwealth of Australia including states and territories",
          totalYears: 125,
          yearStart: 1901,
          yearEnd: 2025
        },
        {
          id: "new-zealand",
          name: "New Zealand",
          code: "NZ",
          description: "Including North Island, South Island, and dependencies",
          totalYears: 170,
          yearStart: 1855,
          yearEnd: 2025
        },
        {
          id: "canada",
          name: "Canada",
          code: "CA",
          description: "Dominion of Canada including provinces and territories",
          totalYears: 158,
          yearStart: 1867,
          yearEnd: 2025
        },
        {
          id: "south-africa",
          name: "South Africa",
          code: "ZA",
          description: "Union and Republic of South Africa",
          totalYears: 115,
          yearStart: 1910,
          yearEnd: 2025
        },
        {
          id: "india",
          name: "India",
          code: "IN",
          description: "British India and Republic of India",
          totalYears: 178,
          yearStart: 1847,
          yearEnd: 2025
        },
        {
          id: "hong-kong",
          name: "Hong Kong",
          code: "HK",
          description: "British Crown Colony and Special Administrative Region",
          totalYears: 165,
          yearStart: 1860,
          yearEnd: 2025
        },
        {
          id: "singapore",
          name: "Singapore",
          code: "SG",
          description: "British Straits Settlements and Republic of Singapore",
          totalYears: 80,
          yearStart: 1945,
          yearEnd: 2025
        }
      ]
      
      setCountryData(stanleyGibbonsCountries)
    } catch (error) {
      console.error('Error generating country data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSeriesClick = async (series: SeriesData) => {
    // Generate type data for the clicked series
    const typeData = await generateTypeData(series)
    
    // Add series modal to stack
    setModalStack(prev => [...prev, {
      type: 'series',
      data: { series, types: typeData },
      title: `${series.name} Types`
    }])
  }

  const handleCountryClick = async (country: CountryData) => {
    // Generate year data for the clicked country
    const yearData = await generateYearData(country)
    
    // Add country modal to stack
    setModalStack(prev => [...prev, {
      type: 'country',
      data: { country, years: yearData },
      title: `${country.name} Years`
    }])
  }

  const generateTypeData = async (series: SeriesData): Promise<TypeData[]> => {
    const types: TypeData[] = []
    
    // Generate types based on series
    if (series.id === "full-face-queens") {
      types.push(
        {
          id: "type-a1",
          name: "Type A1",
          seriesId: series.id,
          description: "First printing with distinctive characteristics",
          totalStampGroups: 4,
          catalogPrefix: "A1"
        },
        {
          id: "type-a2",
          name: "Type A2",
          seriesId: series.id,
          description: "Second printing with modified design elements",
          totalStampGroups: 3,
          catalogPrefix: "A2"
        },
        {
          id: "type-a3",
          name: "Type A3",
          seriesId: series.id,
          description: "Third printing with further modifications",
          totalStampGroups: 2,
          catalogPrefix: "A3"
        }
      )
    } else {
      // Generate generic types for other series
      for (let i = 1; i <= series.totalTypes; i++) {
        types.push({
          id: `${series.id}-type-${i}`,
          name: `Type ${String.fromCharCode(64 + i)}${i}`,
          seriesId: series.id,
          description: `Type ${i} of the ${series.name} series`,
          totalStampGroups: Math.floor(Math.random() * 5) + 2,
          catalogPrefix: `${String.fromCharCode(64 + i)}${i}`
        })
      }
    }
    
    return types
  }

  const generateYearData = async (country: CountryData): Promise<YearData[]> => {
    const years: YearData[] = []
    
    // Generate Stanley Gibbons style year data
    const startYear = country.yearStart
    const endYear = Math.min(country.yearEnd, 2025)
    
    // Generate sample years (not all years for performance)
    const sampleYears = []
    for (let year = startYear; year <= endYear; year += Math.floor(Math.random() * 3) + 1) {
      if (sampleYears.length < 20) { // Limit to 20 years for demo
        sampleYears.push(year)
      }
    }
    
    sampleYears.forEach(year => {
      years.push({
        id: `${country.id}-${year}`,
        year: year,
        countryId: country.id,
        totalReleases: Math.floor(Math.random() * 8) + 2,
        description: `Stamp issues for ${year}`
      })
    })
    
    return years.sort((a, b) => a.year - b.year)
  }

  const closeModal = () => {
    setModalStack(prev => prev.slice(0, -1))
  }

  const filteredSeries = useMemo(() => {
    let filtered = seriesData
    
    // Filter by period
    if (selectedPeriod !== "all") {
      const period = parseInt(selectedPeriod)
      filtered = filtered.filter(series => 
        series.periodStart >= period && series.periodStart < period + 50
      )
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(series =>
        series.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        series.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        series.country.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    return filtered
  }, [seriesData, searchTerm, selectedPeriod])

  const filteredCountries = useMemo(() => {
    let filtered = countryData

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    return filtered
  }, [countryData, searchTerm])

  const periods = useMemo(() => {
    return [
      { value: "1850", label: "1850-1899" },
      { value: "1900", label: "1900-1949" },
      { value: "1950", label: "1950-1999" },
      { value: "2000", label: "2000-2025" }
    ]
  }, [])

  if (loading) {
    return (
      <div className={`min-h-screen ${traditionalStyles.background}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className={`${traditionalStyles.text} ${traditionalStyles.vintage}`}>
              Loading {catalogLayout === 'campbell-paterson' ? 'Campbell Paterson' : 'Stanley Gibbons'} catalog...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${traditionalStyles.background}`}>
      {/* Header */}
      <div className={`${traditionalStyles.card} mx-4 mt-4 mb-6`}>
        <div className="p-6">
          <div className="text-center mb-6">
            <h1 className={`text-3xl font-bold ${traditionalStyles.accent} ${traditionalStyles.vintage} mb-1`}>
              {catalogLayout === 'campbell-paterson' ? 'NEW ZEALAND STAMP CATALOGUE' : 'STANLEY GIBBONS CATALOGUE'}
            </h1>
            <p className={`${traditionalStyles.mutedText} text-sm`}>
              {catalogLayout === 'campbell-paterson' ? 'Campbell Paterson Style Comprehensive Listing' : 'Stanley Gibbons Style Comprehensive Listing'}
            </p>
          </div>

          {/* Layout Toggle */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-4 p-2 bg-gray-100 rounded-lg">
              <Button
                variant={catalogLayout === 'campbell-paterson' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCatalogLayout('campbell-paterson')}
                className={catalogLayout === 'campbell-paterson' ? 'bg-black text-white' : 'bg-white border-gray-300 text-black hover:bg-gray-50'}
              >
                Campbell Paterson
              </Button>
              <Button
                variant={catalogLayout === 'stanley-gibbons' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCatalogLayout('stanley-gibbons')}
                className={catalogLayout === 'stanley-gibbons' ? 'bg-black text-white' : 'bg-white border-gray-300 text-black hover:bg-gray-50'}
              >
                Stanley Gibbons
              </Button>
            </div>
          </div>

          <hr className="border-gray-300 mb-6" />

          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder={catalogLayout === 'campbell-paterson' ? 
                    "Search by series name, description, or country..." : 
                    "Search by country name, description, or code..."
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 border-gray-300 focus:border-gray-500 bg-white text-sm"
                />
              </div>
            </div>
            
            {catalogLayout === 'campbell-paterson' && (
              <div className="flex gap-2">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded bg-white text-black text-sm focus:border-gray-500 focus:outline-none"
                >
                  <option value="all">All Periods</option>
                  {periods.map(period => (
                    <option key={period.value} value={period.value}>
                      {period.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-4 gap-4 text-center text-sm border-t border-b border-gray-300 py-3">
            {catalogLayout === 'campbell-paterson' ? (
              <>
                <div>
                  <div className={`text-lg font-bold ${traditionalStyles.accent}`}>
                    {seriesData.length}
                  </div>
                  <div className={`text-xs ${traditionalStyles.mutedText}`}>Series</div>
                </div>
                <div>
                  <div className={`text-lg font-bold ${traditionalStyles.accent}`}>
                    {seriesData.reduce((sum, series) => sum + series.totalTypes, 0)}
                  </div>
                  <div className={`text-xs ${traditionalStyles.mutedText}`}>Types</div>
                </div>
                <div>
                  <div className={`text-lg font-bold ${traditionalStyles.accent}`}>
                    {seriesData.reduce((sum, series) => sum + (series.totalTypes * 3), 0)}
                  </div>
                  <div className={`text-xs ${traditionalStyles.mutedText}`}>Stamp Groups</div>
                </div>
                <div>
                  <div className={`text-lg font-bold ${traditionalStyles.accent}`}>
                    {seriesData[seriesData.length - 1]?.periodEnd - seriesData[0]?.periodStart || 170}
                  </div>
                  <div className={`text-xs ${traditionalStyles.mutedText}`}>Years Span</div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className={`text-lg font-bold ${traditionalStyles.accent}`}>
                    {countryData.length}
                  </div>
                  <div className={`text-xs ${traditionalStyles.mutedText}`}>Countries</div>
                </div>
                <div>
                  <div className={`text-lg font-bold ${traditionalStyles.accent}`}>
                    {countryData.reduce((sum, country) => sum + country.totalYears, 0)}
                  </div>
                  <div className={`text-xs ${traditionalStyles.mutedText}`}>Total Years</div>
                </div>
                <div>
                  <div className={`text-lg font-bold ${traditionalStyles.accent}`}>
                    {countryData.reduce((sum, country) => sum + (country.totalYears * 4), 0)}
                  </div>
                  <div className={`text-xs ${traditionalStyles.mutedText}`}>Releases</div>
                </div>
                <div>
                  <div className={`text-lg font-bold ${traditionalStyles.accent}`}>
                    {Math.max(...countryData.map(c => c.yearEnd)) - Math.min(...countryData.map(c => c.yearStart))}
                  </div>
                  <div className={`text-xs ${traditionalStyles.mutedText}`}>Years Span</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-gray-300 rounded">
            {catalogLayout === 'campbell-paterson' ? (
              <>
                {/* Campbell Paterson Table Header */}
                <div className="border-b border-gray-300 bg-gray-50 px-4 py-2">
                  <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    <div className="col-span-4">Series Name</div>
                    <div className="col-span-2 text-center">Period</div>
                    <div className="col-span-2 text-center">Types</div>
                    <div className="col-span-3">Description</div>
                    <div className="col-span-1"></div>
                  </div>
                </div>
                
                {/* Campbell Paterson Series Rows */}
                <div className="divide-y divide-gray-200">
                  {filteredSeries.map((series) => (
                    <div 
                      key={series.id}
                      className="cursor-pointer px-4 py-3 hover:bg-gray-50 transition-colors"
                      onClick={() => handleSeriesClick(series)}
                    >
                      <div className="grid grid-cols-12 gap-4 items-center text-sm">
                        <div className={`col-span-4 font-bold ${traditionalStyles.vintage}`}>
                          {series.name}
                        </div>
                        <div className="col-span-2 text-center text-gray-600">
                          {series.periodStart}-{series.periodEnd}
                        </div>
                        <div className="col-span-2 text-center text-gray-600">
                          {series.totalTypes}
                        </div>
                        <div className="col-span-3 text-gray-700 truncate">
                          {series.description}
                        </div>
                        <div className="col-span-1 text-right">
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Stanley Gibbons Table Header */}
                <div className="border-b border-gray-300 bg-gray-50 px-4 py-2">
                  <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    <div className="col-span-3">Country</div>
                    <div className="col-span-2 text-center">Code</div>
                    <div className="col-span-2 text-center">Years</div>
                    <div className="col-span-2 text-center">Period</div>
                    <div className="col-span-2">Description</div>
                    <div className="col-span-1"></div>
                  </div>
                </div>
                
                {/* Stanley Gibbons Country Rows */}
                <div className="divide-y divide-gray-200">
                  {filteredCountries.map((country) => (
                    <div 
                      key={country.id}
                      className="cursor-pointer px-4 py-3 hover:bg-gray-50 transition-colors"
                      onClick={() => handleCountryClick(country)}
                    >
                      <div className="grid grid-cols-12 gap-4 items-center text-sm">
                        <div className={`col-span-3 font-bold ${traditionalStyles.vintage}`}>
                          {country.name}
                        </div>
                        <div className="col-span-2 text-center text-gray-600 font-mono">
                          {country.code}
                        </div>
                        <div className="col-span-2 text-center text-gray-600">
                          {country.totalYears}
                        </div>
                        <div className="col-span-2 text-center text-gray-600">
                          {country.yearStart}-{country.yearEnd}
                        </div>
                        <div className="col-span-2 text-gray-700 truncate">
                          {country.description}
                        </div>
                        <div className="col-span-1 text-right">
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {((catalogLayout === 'campbell-paterson' && filteredSeries.length === 0) || 
          (catalogLayout === 'stanley-gibbons' && filteredCountries.length === 0)) && (
          <div className="text-center py-8">
            <p className={`${traditionalStyles.mutedText} text-sm`}>
              No {catalogLayout === 'campbell-paterson' ? 'series' : 'countries'} found. Adjust search criteria.
            </p>
          </div>
        )}
      </div>

      {/* Modal Stack - Render all modals in the stack with increasing z-index */}
      {modalStack.map((modal, index) => (
        <Dialog 
          key={index} 
          open={true} 
          onOpenChange={() => index === modalStack.length - 1 && closeModal()}
        >
          <DialogContent 
            className="max-w-6xl max-h-[95vh] overflow-y-auto bg-white"
            style={{ zIndex: 1000 + index * 10 }} // Increasing z-index for stack effect
          >
            <DialogHeader>
              <DialogTitle className={`text-xl font-bold ${traditionalStyles.accent} ${traditionalStyles.vintage} flex items-center justify-between`}>
                {modal.title}
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white border-gray-300 text-black hover:bg-gray-50"
                  onClick={closeModal}
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>
            
            {/* Campbell Paterson Modals */}
            {modal.type === 'series' && (
              <SeriesModalContent 
                series={modal.data.series} 
                types={modal.data.types}
                onTypeClick={(typeData) => {
                  setModalStack(prev => [...prev, {
                    type: 'type',
                    data: typeData,
                    title: `${modal.data.series.name} - ${typeData.name}`
                  }])
                }}
              />
            )}
            
            {modal.type === 'type' && (
              <TypeModalContent 
                typeData={modal.data}
                onStampGroupClick={(stampGroupData) => {
                  setModalStack(prev => [...prev, {
                    type: 'stampGroup',
                    data: stampGroupData,
                    title: stampGroupData.name
                  }])
                }}
              />
            )}
            
            {modal.type === 'stampGroup' && (
              <StampGroupModalContent 
                stampGroupData={modal.data}
                onStampClick={(stampData) => {
                  setModalStack(prev => [...prev, {
                    type: 'stamps',
                    data: stampData,
                    title: `${stampData.denominationValue}${stampData.denominationSymbol} ${stampData.color}`
                  }])
                }}
              />
            )}

            {/* Stanley Gibbons Modals */}
            {modal.type === 'country' && (
              <CountryModalContent 
                country={modal.data.country} 
                years={modal.data.years}
                onYearClick={(yearData) => {
                  setModalStack(prev => [...prev, {
                    type: 'year',
                    data: yearData,
                    title: `${modal.data.country.name} - ${yearData.year}`
                  }])
                }}
              />
            )}
            
            {modal.type === 'year' && (
              <YearModalContent 
                yearData={modal.data}
                onReleaseClick={(releaseData) => {
                  setModalStack(prev => [...prev, {
                    type: 'release',
                    data: releaseData,
                    title: releaseData.name
                  }])
                }}
              />
            )}
            
            {modal.type === 'release' && (
              <ReleaseModalContent 
                releaseData={modal.data}
                onCategoryClick={(categoryData) => {
                  setModalStack(prev => [...prev, {
                    type: 'category',
                    data: categoryData,
                    title: categoryData.name
                  }])
                }}
                onPaperTypeClick={(paperTypeData) => {
                  setModalStack(prev => [...prev, {
                    type: 'paperType',
                    data: paperTypeData,
                    title: paperTypeData.name
                  }])
                }}
              />
            )}
            
            {modal.type === 'category' && (
              <CategoryModalContent 
                categoryData={modal.data}
                onPaperTypeClick={(paperTypeData) => {
                  setModalStack(prev => [...prev, {
                    type: 'paperType',
                    data: paperTypeData,
                    title: paperTypeData.name
                  }])
                }}
              />
            )}
            
            {modal.type === 'paperType' && (
              <PaperTypeModalContent 
                paperTypeData={modal.data}
                onStampClick={(stampData) => {
                  setModalStack(prev => [...prev, {
                    type: 'stamps',
                    data: stampData,
                    title: `${stampData.denominationValue}${stampData.denominationSymbol} ${stampData.color}`
                  }])
                }}
              />
            )}
            
            {modal.type === 'stamps' && (
              <StampModalContent stampData={modal.data} />
            )}
          </DialogContent>
        </Dialog>
      ))}
    </div>
  )
}

// Stanley Gibbons Modal Components

// Country Modal Content Component - Shows Years within a Country
function CountryModalContent({ country, years, onYearClick }: { 
  country: CountryData
  years: YearData[]
  onYearClick: (year: YearData) => void 
}) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredYears = useMemo(() => {
    if (!searchTerm) return years
    
    return years.filter(year => 
      year.year.toString().includes(searchTerm) ||
      year.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [years, searchTerm])

  return (
    <div className="mt-4">
      {/* Header Info */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className={`${traditionalStyles.mutedText}`}>
              {country.description}
            </p>
            <p className={`${traditionalStyles.mutedText} text-sm mt-1`}>
              Period: {country.yearStart}-{country.yearEnd} | Code: {country.code}
            </p>
          </div>
        </div>

        <hr className="border-gray-300 mb-6" />

        {/* Search Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search years by year or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 border-gray-300 focus:border-gray-500 bg-white text-sm"
              />
            </div>
          </div>
        </div>

        {/* Country Statistics */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className={`text-2xl font-bold ${traditionalStyles.accent}`}>
              {years.length}
            </div>
            <div className={`text-sm ${traditionalStyles.mutedText}`}>Years</div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${traditionalStyles.accent}`}>
              {years.reduce((sum, year) => sum + year.totalReleases, 0)}
            </div>
            <div className={`text-sm ${traditionalStyles.mutedText}`}>Releases</div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${traditionalStyles.accent}`}>
              {country.yearEnd - country.yearStart}
            </div>
            <div className={`text-sm ${traditionalStyles.mutedText}`}>Years Span</div>
          </div>
        </div>
      </div>

      {/* Years Listing */}
      <div className="space-y-4">
        {filteredYears.map((yearData) => (
          <div key={yearData.id} className={`${traditionalStyles.card} p-6`}>
            <div className="grid lg:grid-cols-12 gap-6">
              
              {/* Left Column: Year Info */}
              <div className="lg:col-span-2">
                <div className="text-center lg:text-left space-y-2">
                  <div className={`text-2xl font-bold ${traditionalStyles.vintage}`}>
                    {yearData.year}
                  </div>
                  <div className="text-sm text-gray-600">
                    {yearData.totalReleases} releases
                  </div>
                </div>
              </div>

              {/* Center Column: Year Description */}
              <div className="lg:col-span-7">
                <div className="mb-4">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {yearData.description}
                  </p>
                </div>
              </div>

              {/* Right Column: Action Button */}
              <div className="lg:col-span-3">
                <div className="text-center lg:text-right">
                  <Button 
                    variant="outline" 
                    className="bg-white border-gray-300 text-black hover:bg-gray-50 w-full lg:w-auto"
                    onClick={() => onYearClick(yearData)}
                  >
                    View Releases
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {filteredYears.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className={`h-12 w-12 ${traditionalStyles.mutedText} mx-auto mb-4`} />
          <h3 className={`text-lg font-medium ${traditionalStyles.text} mb-2`}>
            No years found
          </h3>
          <p className={traditionalStyles.mutedText}>
            Try adjusting your search criteria
          </p>
        </div>
      )}
    </div>
  )
}

// Year Modal Content Component - Shows Releases within a Year
function YearModalContent({ yearData, onReleaseClick }: { 
  yearData: YearData
  onReleaseClick: (release: ReleaseData) => void 
}) {
  const [releases, setReleases] = useState<ReleaseData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    generateReleasesData()
  }, [])

  const generateReleasesData = async () => {
    try {
      setLoading(true)
      const releasesData: ReleaseData[] = []
      
      // Generate Stanley Gibbons style releases
      const sampleReleases = [
        {
          id: `${yearData.id}-release-1`,
          name: `${yearData.year} (24 July)-55. Imperf.`,
          yearId: yearData.id,
          dateRange: `${yearData.year} (24 July)-55`,
          description: "Imperforate issue with distinctive characteristics",
          perforation: "Imperf",
          totalCategories: 3,
          hasCategories: true
        },
        {
          id: `${yearData.id}-release-2`,
          name: `${yearData.year} (15 September). Perf 14.`,
          yearId: yearData.id,
          dateRange: `${yearData.year} (15 September)`,
          description: "Perforated issue with standard gauge",
          perforation: "Perf 14",
          totalCategories: 2,
          hasCategories: true
        },
        {
          id: `${yearData.id}-release-3`,
          name: `${yearData.year} (December). Perf 12½.`,
          yearId: yearData.id,
          dateRange: `${yearData.year} (December)`,
          description: "Late year issue with different perforation",
          perforation: "Perf 12½",
          totalCategories: 0,
          hasCategories: false
        }
      ]
      
      setReleases(sampleReleases.slice(0, yearData.totalReleases))
    } catch (error) {
      console.error('Error generating releases:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredReleases = useMemo(() => {
    if (!searchTerm) return releases
    
    return releases.filter(release => 
      release.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      release.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      release.perforation.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [releases, searchTerm])

  if (loading) {
    return <div className="text-center py-8">Loading releases...</div>
  }

  return (
    <div className="mt-4">
      {/* Header */}
      <div className="mb-6">
        <p className={`${traditionalStyles.mutedText}`}>
          {yearData.description}
        </p>
        
        <hr className="border-gray-300 my-6" />

        {/* Search Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search releases by name, description, or perforation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 border-gray-300 focus:border-gray-500 bg-white text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Releases Listing */}
      <div className="space-y-4">
        {filteredReleases.map((release) => (
          <div key={release.id} className={`${traditionalStyles.card} p-6`}>
            <div className="grid lg:grid-cols-12 gap-6">
              
              {/* Left Column: Basic Info */}
              <div className="lg:col-span-3">
                <div className="text-center lg:text-left space-y-2">
                  <div className="text-sm font-semibold text-gray-700">
                    {release.dateRange}
                  </div>
                  <div className="text-sm text-gray-600">
                    {release.perforation}
                  </div>
                  <div className="text-sm text-gray-600">
                    {release.hasCategories ? `${release.totalCategories} categories` : 'Direct to stamps'}
                  </div>
                </div>
              </div>

              {/* Center Column: Release Details */}
              <div className="lg:col-span-6">
                <div className="mb-4">
                  <h3 className={`text-lg font-bold ${traditionalStyles.vintage} mb-2`}>
                    {release.name}
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {release.description}
                  </p>
                </div>
              </div>

              {/* Right Column: Action Button */}
              <div className="lg:col-span-3">
                <div className="text-center lg:text-right">
                  <Button 
                    variant="outline" 
                    className="bg-white border-gray-300 text-black hover:bg-gray-50 w-full lg:w-auto"
                    onClick={() => onReleaseClick(release)}
                  >
                    {release.hasCategories ? 'View Categories' : 'View Stamps'}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {filteredReleases.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className={`h-12 w-12 ${traditionalStyles.mutedText} mx-auto mb-4`} />
          <h3 className={`text-lg font-medium ${traditionalStyles.text} mb-2`}>
            No releases found
          </h3>
          <p className={traditionalStyles.mutedText}>
            Try adjusting your search criteria
          </p>
        </div>
      )}
    </div>
  )
}

// Release Modal Content Component - Shows Categories or Paper Types
function ReleaseModalContent({ releaseData, onCategoryClick, onPaperTypeClick }: { 
  releaseData: ReleaseData
  onCategoryClick: (category: CategoryData) => void
  onPaperTypeClick: (paperType: PaperTypeData) => void
}) {
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [paperTypes, setPaperTypes] = useState<PaperTypeData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (releaseData.hasCategories) {
      generateCategoriesData()
    } else {
      generatePaperTypesData()
    }
  }, [])

  const generateCategoriesData = async () => {
    try {
      setLoading(true)
      const categoriesData: CategoryData[] = []
      
      // Generate Stanley Gibbons style categories (plates, papers, etc.)
      const sampleCategories = [
        {
          id: `${releaseData.id}-cat-1`,
          name: "(a) Plate I",
          code: "a",
          releaseId: releaseData.id,
          description: "First plate printing with clear impressions",
          totalPaperTypes: 3,
          hasPaperTypes: true
        },
        {
          id: `${releaseData.id}-cat-2`,
          name: "(b) Plate II",
          code: "b",
          releaseId: releaseData.id,
          description: "Second plate printing with slight variations",
          totalPaperTypes: 2,
          hasPaperTypes: true
        },
        {
          id: `${releaseData.id}-cat-3`,
          name: "(c) Medium greyish blue wove paper",
          code: "c",
          releaseId: releaseData.id,
          description: "Specific paper type categorization",
          totalPaperTypes: 4,
          hasPaperTypes: true
        }
      ]
      
      setCategories(sampleCategories.slice(0, releaseData.totalCategories))
    } catch (error) {
      console.error('Error generating categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const generatePaperTypesData = async () => {
    try {
      setLoading(true)
      const paperTypesData: PaperTypeData[] = []
      
      // Generate Stanley Gibbons style paper types
      const samplePaperTypes = [
        {
          id: `${releaseData.id}-paper-1`,
          name: "(i) Thick yellowish wove paper",
          code: "i",
          categoryId: releaseData.id,
          description: "Thick paper with yellowish tint",
          totalStamps: 4
        },
        {
          id: `${releaseData.id}-paper-2`,
          name: "(ii) Fine impressions, blue to greyish medium paper",
          code: "ii",
          categoryId: releaseData.id,
          description: "Fine quality impressions on medium paper",
          totalStamps: 3
        },
        {
          id: `${releaseData.id}-paper-3`,
          name: "(iii) Worn plate, blue to greyish medium paper",
          code: "iii",
          categoryId: releaseData.id,
          description: "Later impressions from worn plate",
          totalStamps: 2
        }
      ]
      
      setPaperTypes(samplePaperTypes)
    } catch (error) {
      console.error('Error generating paper types:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories
    
    return categories.filter(category => 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [categories, searchTerm])

  const filteredPaperTypes = useMemo(() => {
    if (!searchTerm) return paperTypes
    
    return paperTypes.filter(paperType => 
      paperType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paperType.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [paperTypes, searchTerm])

  if (loading) {
    return <div className="text-center py-8">Loading {releaseData.hasCategories ? 'categories' : 'paper types'}...</div>
  }

  return (
    <div className="mt-4">
      {/* Header */}
      <div className="mb-6">
        <p className={`${traditionalStyles.mutedText} max-w-2xl`}>
          {releaseData.description}
        </p>
        <div className="mt-2 text-sm text-gray-600">
          <span className="font-medium">Date Range:</span> {releaseData.dateRange} | 
          <span className="font-medium ml-2">Perforation:</span> {releaseData.perforation}
        </div>
        
        <hr className="border-gray-300 my-6" />

        {/* Search Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder={`Search ${releaseData.hasCategories ? 'categories' : 'paper types'} by name or description...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 border-gray-300 focus:border-gray-500 bg-white text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Categories or Paper Types Listing */}
      <div className="space-y-4">
        {(releaseData.hasCategories ? filteredCategories : filteredPaperTypes).map((item) => (
          <div key={item.id} className={`${traditionalStyles.card} p-6`}>
            <div className="grid lg:grid-cols-12 gap-6">
              
              {/* Left Column: Code */}
              <div className="lg:col-span-1">
                <div className="text-center lg:text-left">
                  <div className={`text-lg font-bold ${traditionalStyles.vintage}`}>
                    {item.code}
                  </div>
                </div>
              </div>

              {/* Center Column: Details */}
              <div className="lg:col-span-8">
                <div className="mb-4">
                  <h3 className={`text-lg font-bold ${traditionalStyles.vintage} mb-2`}>
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="mt-2 text-sm text-gray-600">
                    {releaseData.hasCategories ? 
                      `${(item as CategoryData).totalPaperTypes} paper types` : 
                      `${(item as PaperTypeData).totalStamps} stamps`
                    }
                  </div>
                </div>
              </div>

              {/* Right Column: Action Button */}
              <div className="lg:col-span-3">
                <div className="text-center lg:text-right">
                  <Button 
                    variant="outline" 
                    className="bg-white border-gray-300 text-black hover:bg-gray-50 w-full lg:w-auto"
                    onClick={() => releaseData.hasCategories ? 
                      onCategoryClick(item as CategoryData) : 
                      onPaperTypeClick(item as PaperTypeData)
                    }
                  >
                    {releaseData.hasCategories ? 'View Paper Types' : 'View Stamps'}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {(releaseData.hasCategories ? filteredCategories : filteredPaperTypes).length === 0 && (
        <div className="text-center py-12">
          <BookOpen className={`h-12 w-12 ${traditionalStyles.mutedText} mx-auto mb-4`} />
          <h3 className={`text-lg font-medium ${traditionalStyles.text} mb-2`}>
            No {releaseData.hasCategories ? 'categories' : 'paper types'} found
          </h3>
          <p className={traditionalStyles.mutedText}>
            Try adjusting your search criteria
          </p>
        </div>
      )}
    </div>
  )
}

// Category Modal Content Component - Shows Paper Types within a Category
function CategoryModalContent({ categoryData, onPaperTypeClick }: { 
  categoryData: CategoryData
  onPaperTypeClick: (paperType: PaperTypeData) => void 
}) {
  const [paperTypes, setPaperTypes] = useState<PaperTypeData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    generatePaperTypesData()
  }, [])

  const generatePaperTypesData = async () => {
    try {
      setLoading(true)
      const paperTypesData: PaperTypeData[] = []
      
      // Generate Stanley Gibbons style paper types for this category
      const samplePaperTypes = [
        {
          id: `${categoryData.id}-paper-1`,
          name: "(i) Thick yellowish wove paper",
          code: "i",
          categoryId: categoryData.id,
          description: "Thick paper with yellowish tint and clear impressions",
          totalStamps: 4
        },
        {
          id: `${categoryData.id}-paper-2`,
          name: "(ii) Fine impressions, blue to greyish medium paper",
          code: "ii",
          categoryId: categoryData.id,
          description: "Fine quality impressions on medium weight paper",
          totalStamps: 3
        },
        {
          id: `${categoryData.id}-paper-3`,
          name: "(iii) Worn plate, blue to greyish medium paper",
          code: "iii",
          categoryId: categoryData.id,
          description: "Later impressions from worn plate on medium paper",
          totalStamps: 2
        },
        {
          id: `${categoryData.id}-paper-4`,
          name: "(iv) Blued paper",
          code: "iv",
          categoryId: categoryData.id,
          description: "Distinctive blued paper variety",
          totalStamps: 2
        }
      ]
      
      setPaperTypes(samplePaperTypes.slice(0, categoryData.totalPaperTypes))
    } catch (error) {
      console.error('Error generating paper types:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPaperTypes = useMemo(() => {
    if (!searchTerm) return paperTypes
    
    return paperTypes.filter(paperType => 
      paperType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paperType.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [paperTypes, searchTerm])

  if (loading) {
    return <div className="text-center py-8">Loading paper types...</div>
  }

  return (
    <div className="mt-4">
      {/* Header */}
      <div className="mb-6">
        <p className={`${traditionalStyles.mutedText}`}>
          {categoryData.description}
        </p>
        
        <hr className="border-gray-300 my-6" />

        {/* Search Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search paper types by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 border-gray-300 focus:border-gray-500 bg-white text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Paper Types Listing */}
      <div className="space-y-4">
        {filteredPaperTypes.map((paperType) => (
          <div key={paperType.id} className={`${traditionalStyles.card} p-6`}>
            <div className="grid lg:grid-cols-12 gap-6">
              
              {/* Left Column: Code */}
              <div className="lg:col-span-1">
                <div className="text-center lg:text-left">
                  <div className={`text-lg font-bold ${traditionalStyles.vintage}`}>
                    {paperType.code}
                  </div>
                </div>
              </div>

              {/* Center Column: Paper Type Details */}
              <div className="lg:col-span-8">
                <div className="mb-4">
                  <h3 className={`text-lg font-bold ${traditionalStyles.vintage} mb-2`}>
                    {paperType.name}
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {paperType.description}
                  </p>
                  <div className="mt-2 text-sm text-gray-600">
                    {paperType.totalStamps} stamps
                  </div>
                </div>
              </div>

              {/* Right Column: Action Button */}
              <div className="lg:col-span-3">
                <div className="text-center lg:text-right">
                  <Button 
                    variant="outline" 
                    className="bg-white border-gray-300 text-black hover:bg-gray-50 w-full lg:w-auto"
                    onClick={() => onPaperTypeClick(paperType)}
                  >
                    View Stamps
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {filteredPaperTypes.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className={`h-12 w-12 ${traditionalStyles.mutedText} mx-auto mb-4`} />
          <h3 className={`text-lg font-medium ${traditionalStyles.text} mb-2`}>
            No paper types found
          </h3>
          <p className={traditionalStyles.mutedText}>
            Try adjusting your search criteria
          </p>
        </div>
      )}
    </div>
  )
}

// Paper Type Modal Content Component - Shows Stamps within a Paper Type
function PaperTypeModalContent({ paperTypeData, onStampClick }: { 
  paperTypeData: PaperTypeData
  onStampClick: (stamp: StampData) => void 
}) {
  const [stamps, setStamps] = useState<StampData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    generateStampsData()
  }, [])

  const generateStampsData = async () => {
    try {
      setLoading(true)
      const mockStamps: StampData[] = []
      
      // Generate Stanley Gibbons style stamps with instances
      const stanleyGibbonsStamps = [
        {
          denominationValue: 2,
          denominationSymbol: "d",
          color: "deep ultramarine",
          instances: [
            {
              id: `${paperTypeData.id}-stamp-1-mint`,
              code: "",
              description: "Mint",
              mintValue: "£125",
              usedValue: "",
              rarity: "Fine"
            },
            {
              id: `${paperTypeData.id}-stamp-1-used`,
              code: "",
              description: "Used",
              mintValue: "",
              usedValue: "£45",
              rarity: "Fine"
            },
            {
              id: `${paperTypeData.id}-stamp-1-waees`,
              code: 'a',
              description: '"WAEES" (R. 3/3)',
              mintValue: "£350",
              usedValue: "£150",
              rarity: "Scarce"
            }
          ]
        },
        {
          denominationValue: 2,
          denominationSymbol: "d",
          color: "indigo",
          instances: [
            {
              id: `${paperTypeData.id}-stamp-2-mint`,
              code: "",
              description: "Mint",
              mintValue: "£115",
              usedValue: "",
              rarity: "Fine"
            },
            {
              id: `${paperTypeData.id}-stamp-2-used`,
              code: "",
              description: "Used",
              mintValue: "",
              usedValue: "£40",
              rarity: "Fine"
            },
            {
              id: `${paperTypeData.id}-stamp-2-waees`,
              code: 'a',
              description: '"WAEES" (R. 3/3)',
              mintValue: "£350",
              usedValue: "£150",
              rarity: "Scarce"
            }
          ]
        }
      ]
      
      stanleyGibbonsStamps.forEach((stampTemplate, index) => {
        mockStamps.push({
          id: `${paperTypeData.id}-stamp-${index + 1}`,
          name: `${stampTemplate.denominationValue}${stampTemplate.denominationSymbol} ${stampTemplate.color}`,
          country: "Great Britain",
          stampImageUrl: "/placeholder.svg",
          catalogNumber: `SG${index + 1}`,
          paperTypeId: paperTypeData.id,
          denominationValue: stampTemplate.denominationValue,
          denominationSymbol: stampTemplate.denominationSymbol,
          color: stampTemplate.color,
          paperType: paperTypeData.name,
          instances: stampTemplate.instances,
          stampDetailsJson: JSON.stringify({
            perforation: "Imperf",
            watermark: "None",
            printingMethod: "Line Engraved",
            designer: "Unknown",
            printRun: "Unknown",
            paperType: paperTypeData.name,
            gum: "Original gum",
            theme: "Definitive",
            size: "Standard",
            rarityRating: "Fine"
          })
        })
      })
      
      setStamps(mockStamps.slice(0, paperTypeData.totalStamps))
    } catch (error) {
      console.error('Error generating stamps:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredStamps = useMemo(() => {
    if (!searchTerm) return stamps
    
    return stamps.filter(stamp => 
      stamp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stamp.catalogNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stamp.color.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [stamps, searchTerm])

  if (loading) {
    return <div className="text-center py-8">Loading stamps...</div>
  }

  return (
    <div className="mt-4">
      {/* Header */}
      <div className="mb-6">
        <p className={`${traditionalStyles.mutedText} max-w-2xl`}>
          {paperTypeData.description}
        </p>
        
        <hr className="border-gray-300 my-6" />

        {/* Search Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search stamps by name, catalog number, or color..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 border-gray-300 focus:border-gray-500 bg-white text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stanley Gibbons Style Stamp Catalog Table */}
      <div className={`${traditionalStyles.card} mb-8 max-w-5xl mx-auto`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {/* Table Header */}
            <thead>
              <tr className="border-b-2 border-gray-400">
                <th className="text-left py-3 px-4 font-semibold bg-gray-50">SG No.</th>
                <th className="text-left py-3 px-4 font-semibold bg-gray-50">Description</th>
                <th className="text-center py-3 px-4 font-semibold bg-gray-50">Mint</th>
                <th className="text-center py-3 px-4 font-semibold bg-gray-50">Used</th>
              </tr>
            </thead>
            <tbody>
              {filteredStamps.map((stamp, index) => {
                return (
                  <React.Fragment key={stamp.id}>
                    {/* Main stamp entry */}
                    <tr 
                      className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => onStampClick(stamp)}
                    >
                      <td className="py-3 px-4 font-medium text-black">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4 text-black">
                        {stamp.denominationValue}{stamp.denominationSymbol} {stamp.color}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 text-xs font-medium rounded">
                          {stamp.instances.find(i => i.mintValue)?.mintValue || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 text-xs font-medium rounded">
                          {stamp.instances.find(i => i.usedValue)?.usedValue || '-'}
                        </span>
                      </td>
                    </tr>
                    
                    {/* Varieties/instances listed as separate rows with indentation */}
                    {stamp.instances.filter(instance => instance.code).map((instance) => (
                      <tr 
                        key={instance.id}
                        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => onStampClick(stamp)}
                      >
                        <td className="py-2 px-4 text-xs text-gray-600"></td>
                        <td className="py-2 px-4 text-xs text-gray-700 pl-8">
                          {instance.code && `${instance.code}. `}{instance.description}
                        </td>
                        <td className="py-2 px-4 text-center text-xs">
                          {instance.mintValue && (
                            <span className={`px-1.5 py-0.5 text-xs rounded ${
                              instance.rarity === 'Rare' ? 'bg-red-100 text-red-800' : 
                              instance.rarity === 'Scarce' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {instance.mintValue}
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-4 text-center text-xs">
                          {instance.usedValue && (
                            <span className={`px-1.5 py-0.5 text-xs rounded ${
                              instance.rarity === 'Rare' ? 'bg-red-100 text-red-800' : 
                              instance.rarity === 'Scarce' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {instance.usedValue}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
        
        {/* Set Total Footer */}
        <div className="border-t-2 border-gray-300 bg-gray-50 px-4 py-3">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span>Paper Type Total ({filteredStamps.length} stamps + varieties)</span>
            <div className="flex gap-6">
              <span>Total Mint: {filteredStamps.reduce((sum, stamp) => {
                const mintInstance = stamp.instances.find(i => i.mintValue && !i.code);
                return sum + (mintInstance ? parseFloat(mintInstance.mintValue.replace('£', '')) : 0);
              }, 0).toFixed(0)} stamps</span>
              <span>Total Used: {filteredStamps.reduce((sum, stamp) => {
                const usedInstance = stamp.instances.find(i => i.usedValue && !i.code);
                return sum + (usedInstance ? parseFloat(usedInstance.usedValue.replace('£', '')) : 0);
              }, 0).toFixed(0)} stamps</span>
            </div>
          </div>
        </div>
      </div>

      {filteredStamps.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className={`h-12 w-12 ${traditionalStyles.mutedText} mx-auto mb-4`} />
          <h3 className={`text-lg font-medium ${traditionalStyles.text} mb-2`}>
            No stamps found
          </h3>
          <p className={traditionalStyles.mutedText}>
            Try adjusting your search criteria
          </p>
        </div>
      )}
    </div>
  )
}

// Campbell Paterson Modal Components

// Series Modal Content Component - Shows Types within a Series
function SeriesModalContent({ series, types, onTypeClick }: { 
  series: SeriesData
  types: TypeData[]
  onTypeClick: (type: TypeData) => void 
}) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTypes = useMemo(() => {
    if (!searchTerm) return types
    
    return types.filter(type => 
      type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.catalogPrefix.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [types, searchTerm])

  return (
    <div className="mt-4">
      {/* Header Info */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className={`${traditionalStyles.mutedText}`}>
              {series.description}
            </p>
            <p className={`${traditionalStyles.mutedText} text-sm mt-1`}>
              Period: {series.periodStart}-{series.periodEnd}
            </p>
          </div>
        </div>

        <hr className="border-gray-300 mb-6" />

        {/* Search Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search types by name, description, or catalog prefix..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 border-gray-300 focus:border-gray-500 bg-white text-sm"
              />
            </div>
          </div>
        </div>

        {/* Series Statistics */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className={`text-2xl font-bold ${traditionalStyles.accent}`}>
              {types.length}
            </div>
            <div className={`text-sm ${traditionalStyles.mutedText}`}>Types</div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${traditionalStyles.accent}`}>
              {types.reduce((sum, type) => sum + type.totalStampGroups, 0)}
            </div>
            <div className={`text-sm ${traditionalStyles.mutedText}`}>Stamp Groups</div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${traditionalStyles.accent}`}>
              {series.periodEnd - series.periodStart}
            </div>
            <div className={`text-sm ${traditionalStyles.mutedText}`}>Years</div>
          </div>
        </div>
      </div>

      {/* Types Listing */}
      <div className="space-y-4">
        {filteredTypes.map((typeData) => (
          <div key={typeData.id} className={`${traditionalStyles.card} p-6`}>
            <div className="grid lg:grid-cols-12 gap-6">
              
              {/* Left Column: Type Info */}
              <div className="lg:col-span-3">
                <div className="text-center lg:text-left space-y-2">
                  <div className={`text-lg font-bold ${traditionalStyles.vintage}`}>
                    {typeData.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    Catalog: {typeData.catalogPrefix}
                  </div>
                  <div className="text-sm text-gray-600">
                    {typeData.totalStampGroups} stamp groups
                  </div>
                </div>
              </div>

              {/* Center Column: Type Description */}
              <div className="lg:col-span-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {typeData.description}
                  </p>
                </div>
              </div>

              {/* Right Column: Action Button */}
              <div className="lg:col-span-3">
                <div className="text-center lg:text-right">
                  <Button 
                    variant="outline" 
                    className="bg-white border-gray-300 text-black hover:bg-gray-50 w-full lg:w-auto"
                    onClick={() => onTypeClick(typeData)}
                  >
                    View Stamp Groups
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {filteredTypes.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className={`h-12 w-12 ${traditionalStyles.mutedText} mx-auto mb-4`} />
          <h3 className={`text-lg font-medium ${traditionalStyles.text} mb-2`}>
            No types found
          </h3>
          <p className={traditionalStyles.mutedText}>
            Try adjusting your search criteria
          </p>
        </div>
      )}
    </div>
  )
}

// Type Modal Content Component - Shows Stamp Groups within a Type
function TypeModalContent({ typeData, onStampGroupClick }: { 
  typeData: TypeData
  onStampGroupClick: (stampGroup: StampGroupData) => void 
}) {
  const [stampGroups, setStampGroups] = useState<StampGroupData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    generateStampGroupsData()
  }, [])

  const generateStampGroupsData = async () => {
    try {
      setLoading(true)
      const groups: StampGroupData[] = []
      
      // Generate Campbell Paterson style stamp groups
      if (typeData.id === "type-a1") {
        groups.push(
          {
            id: "1855-july-20-large-star",
            name: '1855 (JULY 20 at Auckland), IMPERF, "LARGE STAR" WATERMARK (W.1), PRINTED BY PERKINS, BACON & CO., LONDON',
            typeId: typeData.id,
            year: 1855,
            issueDate: "1855-07-20",
            description: "First issue of New Zealand stamps with Large Star watermark",
            watermark: "Large Star (W.1)",
            perforation: "Imperforate",
            printingMethod: "Engraved",
            printer: "Perkins, Bacon & Co., London",
            totalStamps: 3
          },
          {
            id: "1857-trial-print",
            name: '1857 TRIAL PRINT? IMPERF, "LARGE STAR" WATERMARK (W.1), PRINTED BY RICHARDSON?',
            typeId: typeData.id,
            year: 1857,
            issueDate: "1857-01-01",
            description: "Trial printing with Large Star watermark",
            watermark: "Large Star (W.1)",
            perforation: "Imperforate",
            printingMethod: "Engraved",
            printer: "Richardson?",
            totalStamps: 2
          },
          {
            id: "1855-december-deep-blue",
            name: '1855 (17 DECEMBER), IMPERF, ON DEEP BLUE PAPER, NO WATERMARK, RICHARDSON PRINT',
            typeId: typeData.id,
            year: 1855,
            issueDate: "1855-12-17",
            description: "Issue on deep blue paper without watermark",
            watermark: "None",
            perforation: "Imperforate",
            printingMethod: "Engraved",
            printer: "Richardson",
            totalStamps: 2
          },
          {
            id: "1862-1864-large-star",
            name: '1862-1864 IMPERF, "LARGE STAR" WMK (W.1), (DAVIES PRINT, AUCKLAND)',
            typeId: typeData.id,
            year: 1862,
            issueDate: "1862-01-01",
            description: "Davies print from Auckland with Large Star watermark",
            watermark: "Large Star (W.1)",
            perforation: "Imperforate",
            printingMethod: "Engraved",
            printer: "Davies Print, Auckland",
            totalStamps: 4
          }
        )
      } else {
        // Generate generic stamp groups for other types
        for (let i = 1; i <= typeData.totalStampGroups; i++) {
          groups.push({
            id: `${typeData.id}-group-${i}`,
            name: `Stamp Group ${i} - ${typeData.name}`,
            typeId: typeData.id,
            year: 1855 + i,
            issueDate: `${1855 + i}-01-01`,
            description: `Stamp group ${i} description`,
            watermark: i % 2 === 0 ? "Large Star" : "None",
            perforation: i % 3 === 0 ? "Perf 14" : "Imperforate",
            printingMethod: "Engraved",
            printer: "Various",
            totalStamps: Math.floor(Math.random() * 5) + 2
          })
        }
      }
      
      setStampGroups(groups)
    } catch (error) {
      console.error('Error generating stamp groups:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredStampGroups = useMemo(() => {
    if (!searchTerm) return stampGroups
    
    return stampGroups.filter(group => 
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.watermark.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.printer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [stampGroups, searchTerm])

  if (loading) {
    return <div className="text-center py-8">Loading stamp groups...</div>
  }

  return (
    <div className="mt-4">
      {/* Header */}
      <div className="mb-6">
        <p className={`${traditionalStyles.mutedText}`}>
          {typeData.description}
        </p>
        
        <hr className="border-gray-300 my-6" />

        {/* Search Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search stamp groups by name, watermark, or printer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 border-gray-300 focus:border-gray-500 bg-white text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stamp Groups Listing */}
      <div className="space-y-4">
        {filteredStampGroups.map((stampGroup) => (
          <div key={stampGroup.id} className={`${traditionalStyles.card} p-6`}>
            <div className="grid lg:grid-cols-12 gap-6">
              
              {/* Left Column: Basic Info */}
              <div className="lg:col-span-2">
                <div className="text-center lg:text-left space-y-2">
                  <div className="text-sm font-semibold text-gray-700">
                    {stampGroup.year}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stampGroup.totalStamps} stamps
                  </div>
                </div>
              </div>

              {/* Center Column: Stamp Group Details */}
              <div className="lg:col-span-7">
                <div className="mb-4">
                  <h3 className={`text-lg font-bold ${traditionalStyles.vintage} mb-2`}>
                    {stampGroup.name}
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    {stampGroup.description}
                  </p>
                  
                  {/* Technical Details */}
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold text-gray-800">Watermark:</span>
                      <span className="ml-2 text-gray-700">{stampGroup.watermark}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800">Perforation:</span>
                      <span className="ml-2 text-gray-700">{stampGroup.perforation}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800">Printing:</span>
                      <span className="ml-2 text-gray-700">{stampGroup.printingMethod}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800">Printer:</span>
                      <span className="ml-2 text-gray-700">{stampGroup.printer}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Action Button */}
              <div className="lg:col-span-3">
                <div className="text-center lg:text-right">
                  <Button 
                    variant="outline" 
                    className="bg-white border-gray-300 text-black hover:bg-gray-50 w-full lg:w-auto"
                    onClick={() => onStampGroupClick(stampGroup)}
                  >
                    View Stamps
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {filteredStampGroups.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className={`h-12 w-12 ${traditionalStyles.mutedText} mx-auto mb-4`} />
          <h3 className={`text-lg font-medium ${traditionalStyles.text} mb-2`}>
            No stamp groups found
          </h3>
          <p className={traditionalStyles.mutedText}>
            Try adjusting your search criteria
          </p>
        </div>
      )}
    </div>
  )
}

// Stamp Group Modal Content Component - Shows Stamps and Instances within a Stamp Group
function StampGroupModalContent({ stampGroupData, onStampClick }: { 
  stampGroupData: StampGroupData
  onStampClick: (stamp: StampData) => void 
}) {
  const [stamps, setStamps] = useState<StampData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    generateStampsData()
  }, [])

  const generateStampsData = async () => {
    try {
      setLoading(true)
      const mockStamps: StampData[] = []
      let denominations: { value: number; symbol: string }[] = []
      let colors = ["Deep carmine-red", "Bright red", "Dull orange", "Bright orange-vermillion", "Carmine", "Vermillion"]
      
      // Generate denominations based on year
      if (stampGroupData.year >= 1970) {
        denominations = [
          { value: 10, symbol: "c" },
          { value: 20, symbol: "c" },
          { value: 30, symbol: "c" },
          { value: 50, symbol: "c" },
          { value: 80, symbol: "c" },
          { value: 1.00, symbol: "$" },
          { value: 1.50, symbol: "$" },
          { value: 2.00, symbol: "$" },
          { value: 3.00, symbol: "$" },
          { value: 5.00, symbol: "$" }
        ]
      } else {
        denominations = [
          { value: 1, symbol: "d" },
          { value: 2, symbol: "d" },
          { value: 3, symbol: "d" },
          { value: 4, symbol: "d" },
          { value: 6, symbol: "d" },
          { value: 8, symbol: "d" },
          { value: 1, symbol: "/-" },
          { value: 2, symbol: "/-" }
        ]
      }
      
      for (let i = 0; i < stampGroupData.totalStamps; i++) {
        const denom = denominations[i % denominations.length]
        const color = colors[i % colors.length]
        
        // Generate Campbell Paterson style instances
        const instances: StampInstance[] = [
          {
            id: `${stampGroupData.id}-stamp-${i + 1}-mint`,
            code: "",
            description: "Mint unhinged",
            mintValue: `$${(denom.value * 25).toFixed(2)}`,
            usedValue: "",
            rarity: "Common"
          },
          {
            id: `${stampGroupData.id}-stamp-${i + 1}-used`,
            code: "",
            description: "Fine used",
            mintValue: "",
            usedValue: `$${(denom.value * 12).toFixed(2)}`,
            rarity: "Common"
          }
        ]
        
        // Add varieties for some stamps
        if (i % 2 === 0) {
          instances.push({
            id: `${stampGroupData.id}-stamp-${i + 1}-reentry`,
            code: "(Z)",
            description: "Re-entries, various",
            mintValue: `$${(denom.value * 35).toFixed(2)}`,
            usedValue: `$${(denom.value * 18).toFixed(2)}`,
            rarity: "Scarce"
          })
        }
        
        if (i % 3 === 0) {
          instances.push({
            id: `${stampGroupData.id}-stamp-${i + 1}-cover`,
            code: "(Y)",
            description: "On cover, pair or two singles",
            mintValue: "",
            usedValue: `$${(denom.value * 45).toFixed(2)}`,
            rarity: "Rare"
          })
        }
        
        mockStamps.push({
          id: `${stampGroupData.id}-stamp-${i + 1}`,
          name: `${denom.value}${denom.symbol} ${color}`,
          country: "New Zealand",
          stampImageUrl: "/placeholder.svg",
          catalogNumber: `SG${stampGroupData.year}.${i + 1}`,
          stampGroupId: stampGroupData.id,
          denominationValue: denom.value,
          denominationSymbol: denom.symbol,
          color: color,
          paperType: stampGroupData.year >= 1990 ? "Self-adhesive" : "Gummed",
          instances: instances,
          stampDetailsJson: JSON.stringify({
            perforation: stampGroupData.perforation,
            watermark: stampGroupData.watermark,
            printingMethod: stampGroupData.printingMethod,
            designer: "Unknown",
            printRun: `${Math.floor(Math.random() * 900000) + 100000}`,
            paperType: stampGroupData.year >= 1990 ? "Self-adhesive coated paper" : "Gummed watermarked paper",
            gum: stampGroupData.year >= 1990 ? "Self-adhesive" : "Original gum",
            theme: "General",
            size: "Standard",
            rarityRating: "Common"
          })
        })
      }
      
      setStamps(mockStamps)
    } catch (error) {
      console.error('Error generating stamps:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredStamps = useMemo(() => {
    if (!searchTerm) return stamps
    
    return stamps.filter(stamp => 
      stamp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stamp.catalogNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stamp.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${stamp.denominationValue}${stamp.denominationSymbol}`.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [stamps, searchTerm])

  if (loading) {
    return <div className="text-center py-8">Loading stamps...</div>
  }

  return (
    <div className="mt-4">
            {/* Header */}
      <div className="mb-6">
        <p className={`${traditionalStyles.mutedText} max-w-2xl`}>
          {stampGroupData.description}
        </p>
        <div className="mt-2 text-sm text-gray-600">
          <span className="font-medium">Year:</span> {stampGroupData.year} | 
          <span className="font-medium ml-2">Watermark:</span> {stampGroupData.watermark} | 
          <span className="font-medium ml-2">Perforation:</span> {stampGroupData.perforation}
        </div>

        <hr className="border-gray-300 my-6" />

        {/* Search Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search stamps by name, catalog number, color..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 border-gray-300 focus:border-gray-500 bg-white text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Campbell Paterson Style Stamp Catalog Table */}
      <div className={`${traditionalStyles.card} mb-8 max-w-5xl mx-auto`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {/* Table Header */}
            <thead>
              <tr className="border-b-2 border-gray-400">
                <th className="text-left py-3 px-4 font-semibold bg-gray-50">Cat. No.</th>
                <th className="text-left py-3 px-4 font-semibold bg-gray-50">Description</th>
                <th className="text-center py-3 px-4 font-semibold bg-gray-50">Mint</th>
                <th className="text-center py-3 px-4 font-semibold bg-gray-50">Used</th>
                <th className="text-center py-3 px-4 font-semibold bg-gray-50">Form</th>
              </tr>
            </thead>
            <tbody>
              {filteredStamps.map((stamp, index) => {
                return (
                  <React.Fragment key={stamp.id}>
                    {/* Main stamp entry */}
                    <tr 
                      className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => onStampClick(stamp)}
                    >
                      <td className="py-3 px-4 font-medium text-black">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4 text-black">
                        {stamp.denominationValue}{stamp.denominationSymbol} {stamp.color}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 text-xs font-medium rounded">
                          ${(stamp.denominationValue * 25).toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 text-xs font-medium rounded">
                          ${(stamp.denominationValue * 12).toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-gray-600">
                        Mint/Used
                      </td>
                    </tr>
                    
                    {/* Instances (Campbell Paterson style) */}
                    {stamp.instances.map((instance) => (
                      <tr 
                        key={instance.id}
                        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => onStampClick(stamp)}
                      >
                        <td className="py-2 px-4 pl-8 text-xs text-gray-600 italic">
                          {instance.code}
                        </td>
                        <td className="py-2 px-4 text-xs text-gray-700">
                          {instance.description}
                        </td>
                        <td className="py-2 px-4 text-center text-xs">
                          {instance.mintValue && (
                            <span className={`px-1.5 py-0.5 text-xs rounded ${
                              instance.rarity === 'Rare' ? 'bg-red-100 text-red-800' : 
                              instance.rarity === 'Scarce' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {instance.mintValue}
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-4 text-center text-xs">
                          {instance.usedValue && (
                            <span className={`px-1.5 py-0.5 text-xs rounded ${
                              instance.rarity === 'Rare' ? 'bg-red-100 text-red-800' : 
                              instance.rarity === 'Scarce' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {instance.usedValue}
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-4 text-center text-xs text-gray-500">
                          {instance.rarity}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
        
        {/* Set Total Footer */}
        <div className="border-t-2 border-gray-300 bg-gray-50 px-4 py-3">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span>Stamp Group Total ({filteredStamps.length} stamps + varieties)</span>
            <div className="flex gap-6">
              <span>Total Mint: ${(filteredStamps.reduce((sum, stamp) => sum + (stamp.denominationValue * 25), 0)).toFixed(2)}</span>
              <span>Total Used: ${(filteredStamps.reduce((sum, stamp) => sum + (stamp.denominationValue * 12), 0)).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {filteredStamps.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className={`h-12 w-12 ${traditionalStyles.mutedText} mx-auto mb-4`} />
          <h3 className={`text-lg font-medium ${traditionalStyles.text} mb-2`}>
            No stamps found
          </h3>
          <p className={traditionalStyles.mutedText}>
            Try adjusting your search criteria
          </p>
        </div>
      )}
    </div>
  )
}

// Stamp Modal Content Component (Individual stamp details) - Campbell Paterson style
function StampModalContent({ stampData }: { stampData: StampData }) {

  const parseStampDetails = (stampDetailsJson: string): ParsedStampDetails => {
    try {
      const details = JSON.parse(stampDetailsJson);
      
      const getNestedValue = (obj: any, path: string): string => {
        const keys = path.split('.');
        let current = obj;
        for (const key of keys) {
          if (current && typeof current === 'object' && key in current) {
            current = current[key];
          } else {
            return '';
          }
        }
        return typeof current === 'string' ? current : '';
      };

      return {
        perforation: getNestedValue(details, 'perfsep.perftype.value') || getNestedValue(details, 'perftype.value') || details.perforation || 'Perf 14',
        watermark: getNestedValue(details, 'wmkchar.watermarkpresence.value') || details.watermark || 'None',
        printingMethod: getNestedValue(details, 'printchar.printmethods.printmethod.value') || getNestedValue(details, 'printmethod.value') || details.printingMethod || 'Engraved',
        designer: getNestedValue(details, 'design.designer.value') || details.designer || 'Unknown',
        printRun: getNestedValue(details, 'quantity.value') || details.printRun || 'Unknown',
        paperType: getNestedValue(details, 'paperchar.papertypes.papertype.value') || details.paperType || 'Standard',
        gum: getNestedValue(details, 'primarydetails.gum.value') || details.gum || 'Original gum',
        theme: getNestedValue(details, 'theme.value') || details.theme || 'General',
        size: getNestedValue(details, 'size.value') || details.size || 'Standard',
        rarityRating: getNestedValue(details, 'knownrarity.rarityrating.value') || details.rarityRating || 'Common'
      };
    } catch (error) {
      console.error('Error parsing stamp details:', error);
      return {
        perforation: 'Perf 14',
        watermark: 'None',
        printingMethod: 'Engraved',
        designer: 'Unknown',
        printRun: 'Unknown',
        paperType: 'Standard',
        gum: 'Original gum',
        theme: 'General',
        size: 'Standard',
        rarityRating: 'Common'
      };
    }
  };

  const createStampDetailData = (stamp: StampData): StampDetailData => {
    const parsedDetails = parseStampDetails(stamp.stampDetailsJson)
    
    return {
      ...stamp,
      parsedDetails,
      relatedStamps: [],
      varieties: {
        perforations: [parsedDetails.perforation || 'Perf 14'],
        colors: [stamp.color],
        paperTypes: [stamp.paperType || 'Standard'],
        errors: []
      },
      marketInfo: {
        mintValue: `$${(stamp.denominationValue * 25).toFixed(2)}`,
        usedValue: `$${(stamp.denominationValue * 12).toFixed(2)}`,
        rarity: parsedDetails.rarityRating || 'Common'
      },
      bibliography: `Catalog Entry: ${stamp.catalogNumber}\n\nIssue Details:\nThe ${stamp.denominationValue}${stamp.denominationSymbol} ${stamp.color} stamp from the Campbell Paterson catalog. This stamp represents part of a comprehensive stamp group showcasing ${parsedDetails.theme || 'various themes'}.\n\nTechnical Specifications:\n• Perforation: ${parsedDetails.perforation}\n• Printing Method: ${parsedDetails.printingMethod}\n• Paper Type: ${parsedDetails.paperType}\n• Watermark: ${parsedDetails.watermark}\n• Gum Type: ${parsedDetails.gum}\n• Designer: ${parsedDetails.designer}\n• Print Run: ${parsedDetails.printRun}\n\nCollector Notes:\nThis stamp has a rarity rating of "${parsedDetails.rarityRating}" among collectors. The ${stamp.color} color variant is particularly sought after for its vibrant hues and precise registration.\n\nVarieties and Errors:\nWhile no major varieties are currently documented, collectors should examine copies for minor plate flaws or color variations that may increase collectible value.\n\nReferences:\n• Official Postal Service Records\n• Specialized Philatelic Catalogues\n• Contemporary Collector Surveys`
    }
  }

  const stampDetailData = createStampDetailData(stampData)
  const selectedImage = stampData.stampImageUrl

  return (
    <div className="mt-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className={`text-2xl font-bold ${traditionalStyles.accent} ${traditionalStyles.vintage}`}>
          {stampDetailData.denominationValue}{stampDetailData.denominationSymbol} {stampDetailData.color}
        </h1>
        <h2 className={`text-lg ${traditionalStyles.text} mt-1`}>
          {stampDetailData.name}
        </h2>
        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
          <span>{stampDetailData.country}</span>
          <span>#{stampDetailData.catalogNumber}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Image */}
        <div className="lg:col-span-1">
          <div className={`${traditionalStyles.card} p-4`}>
            <h3 className={`text-lg font-medium ${traditionalStyles.text} mb-4 ${traditionalStyles.vintage} border-b border-gray-300 pb-2`}>
              Stamp Image
            </h3>
            
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-[3/4] border border-gray-300 bg-white">
                <Image
                  src={selectedImage}
                  alt={stampDetailData.name}
                  fill
                  className="object-contain p-2"
                />
              </div>
              
              {/* Image Controls */}
              <div className="flex items-center justify-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white border-gray-300 text-black hover:bg-gray-50"
                >
                  <Search className="h-4 w-4 mr-1" />
                  Magnify
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white border-gray-300 text-black hover:bg-gray-50"
                >
                  <Grid className="h-4 w-4 mr-1" />
                  Compare
                </Button>
              </div>

              {/* Quick Info */}
              <div className="bg-gray-50 border border-gray-300 p-3">
                <div className="space-y-2 text-sm">
                  <div className={`flex justify-between ${traditionalStyles.text}`}>
                    <span className="font-medium">Denomination:</span>
                    <span>{stampDetailData.denominationValue}{stampDetailData.denominationSymbol}</span>
                  </div>
                  <div className={`flex justify-between ${traditionalStyles.text}`}>
                    <span className="font-medium">Color:</span>
                    <span>{stampDetailData.color}</span>
                  </div>
                  <div className={`flex justify-between ${traditionalStyles.text}`}>
                    <span className="font-medium">Rarity:</span>
                    <Badge variant="outline" className="bg-white border-gray-300 text-gray-700">
                      {stampDetailData.parsedDetails.rarityRating}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Technical Specifications */}
          <div className={`${traditionalStyles.card} p-4`}>
            <h3 className={`text-lg font-medium ${traditionalStyles.text} mb-4 ${traditionalStyles.vintage} border-b border-gray-300 pb-2`}>
              Technical Specifications
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className={`text-sm font-medium ${traditionalStyles.text}`}>Perforation</label>
                  <div className={`${traditionalStyles.mutedText} text-sm`}>
                    {stampDetailData.parsedDetails.perforation}
                  </div>
                </div>
                <div>
                  <label className={`text-sm font-medium ${traditionalStyles.text}`}>Watermark</label>
                  <div className={`${traditionalStyles.mutedText} text-sm`}>
                    {stampDetailData.parsedDetails.watermark}
                  </div>
                </div>
                <div>
                  <label className={`text-sm font-medium ${traditionalStyles.text}`}>Printing Method</label>
                  <div className={`${traditionalStyles.mutedText} text-sm`}>
                    {stampDetailData.parsedDetails.printingMethod}
                  </div>
                </div>
                <div>
                  <label className={`text-sm font-medium ${traditionalStyles.text}`}>Paper Type</label>
                  <div className={`${traditionalStyles.mutedText} text-sm`}>
                    {stampDetailData.paperType}
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className={`text-sm font-medium ${traditionalStyles.text}`}>Designer</label>
                  <div className={`${traditionalStyles.mutedText} text-sm`}>
                    {stampDetailData.parsedDetails.designer}
                  </div>
                </div>
                <div>
                  <label className={`text-sm font-medium ${traditionalStyles.text}`}>Print Run</label>
                  <div className={`${traditionalStyles.mutedText} text-sm`}>
                    {stampDetailData.parsedDetails.printRun}
                  </div>
                </div>
                <div>
                  <label className={`text-sm font-medium ${traditionalStyles.text}`}>Gum Type</label>
                  <div className={`${traditionalStyles.mutedText} text-sm`}>
                    {stampDetailData.parsedDetails.gum}
                  </div>
                </div>
                <div>
                  <label className={`text-sm font-medium ${traditionalStyles.text}`}>Size</label>
                  <div className={`${traditionalStyles.mutedText} text-sm`}>
                    {stampDetailData.parsedDetails.size}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Market Information */}
          {stampDetailData.marketInfo && (
            <div className={`${traditionalStyles.card} p-4`}>
              <h3 className={`text-lg font-medium ${traditionalStyles.text} mb-4 ${traditionalStyles.vintage} border-b border-gray-300 pb-2`}>
                Market Information
              </h3>
              
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className={`text-lg font-bold ${traditionalStyles.accent}`}>
                    {stampDetailData.marketInfo.mintValue}
                  </div>
                  <div className={`text-sm ${traditionalStyles.mutedText}`}>Mint Value</div>
                </div>
                <div>
                  <div className={`text-lg font-bold ${traditionalStyles.accent}`}>
                    {stampDetailData.marketInfo.usedValue}
                  </div>
                  <div className={`text-sm ${traditionalStyles.mutedText}`}>Used Value</div>
                </div>
                <div>
                  <div className={`text-lg font-bold ${traditionalStyles.accent}`}>
                    {stampDetailData.marketInfo.rarity}
                  </div>
                  <div className={`text-sm ${traditionalStyles.mutedText}`}>Rarity</div>
                </div>
              </div>
            </div>
          )}

          {/* Bibliography */}
          <div className={`${traditionalStyles.card} p-4`}>
            <h3 className={`text-lg font-medium ${traditionalStyles.text} mb-4 ${traditionalStyles.vintage} border-b border-gray-300 pb-2`}>
              Catalog Entry & Bibliography
            </h3>
            
            <pre className={`${traditionalStyles.text} whitespace-pre-wrap leading-relaxed text-sm font-sans`}>
              {stampDetailData.bibliography}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Catalog4Page() {
  return (
    <AuthGuard>
      <CatalogContent />
    </AuthGuard>
  )
} 