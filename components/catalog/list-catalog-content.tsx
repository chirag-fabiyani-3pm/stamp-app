import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, ChevronRight, X } from "lucide-react"
import { CatalogLayout, SeriesData, CountryData, ListModalStackItem, TypeData, StampGroupData, YearData, ReleaseData, CategoryData, PaperTypeData, StampData } from "@/types/catalog"
// All deeper levels derived from shared API data
import { useCatalogData } from "@/lib/context/catalog-data-context"
import { CountryModalContent } from "@/components/catalog/country-modal-content"
import { YearModalContent } from "@/components/catalog/year-modal-content"
import { ReleaseModalContent } from "@/components/catalog/release-modal-content"
import { CategoryModalContent } from "@/components/catalog/category-modal-content"
import { PaperTypeModalContent } from "@/components/catalog/paper-type-modal-content"
import { StampModalContent } from "@/components/catalog/stamp-modal-content"
import { SeriesModalContent } from "@/components/catalog/series-modal-content"
import { TypeModalContent } from "@/components/catalog/type-modal-content"
import { StampGroupModalContent } from "@/components/catalog/stamp-group-modal-content"
import { Skeleton } from "@/components/ui/skeleton";
import { ListCatalogSkeleton } from "./investigate-search/loading-skeletons"
import { convertApiStampToStampData } from "@/lib/data/catalog-data"

export function ListCatalogContent() {
  const { normalizedStamps, stamps: rawStamps, loading: providerLoading } = useCatalogData()
  const [catalogLayout, setCatalogLayout] = useState<CatalogLayout>('campbell-paterson')
  
  // Campbell Paterson state
  const [seriesData, setSeriesData] = useState<SeriesData[]>([])
  
  // Stanley Gibbons state
  const [countryData, setCountryData] = useState<CountryData[]>([])
  
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all")
  const [loadingModalContent, setLoadingModalContent] = useState(false)
  
  // Modal stack state - LIFO behavior with updated types
  const [modalStack, setModalStack] = useState<ListModalStackItem[]>([])

  // Helper builders using raw and normalized stamps
  const buildTypesForSeries = (seriesName: string): TypeData[] => {
    const items = rawStamps.filter(i => (i.seriesName || '') === seriesName && !i.isInstance)
    const map = new Map<string, TypeData & { _groupSet?: Set<string> }>()
    for (const i of items) {
      const typeKey = i.typeName
      const entry = map.get(typeKey) || {
        id: typeKey,
        name: i.typeName || 'Type',
        seriesId: i.seriesName || seriesName,
        totalStampGroups: 0,
        catalogPrefix: (i.catalogNumber || '').split(/\d/)[0] || (i.typeName || '')
      }
      ;(entry as any)._groupSet = (entry as any)._groupSet || new Set<string>()
      if (i.stampGroupName) (entry as any)._groupSet.add(i.stampGroupName)
      map.set(typeKey, entry)
    }
    return Array.from(map.values()).map(e => ({
      ...e,
      totalStampGroups: ((e as any)._groupSet ? (e as any)._groupSet.size : e.totalStampGroups) || 0
    }))
  }

  const buildStampGroupsForType = (seriesName: string, typeId: string): StampGroupData[] => {
    const items = rawStamps.filter(i => (i.seriesName || '') === seriesName && (i.typeName === typeId) && !i.isInstance)
    const map = new Map<string, StampGroupData & { _count?: number }>()
    for (const i of items) {
      const groupKey = i.stampGroupName
      const entry = map.get(groupKey) || {
        id: groupKey,
        name: i.stampGroupName || groupKey,
        typeId,
        year: i.issueYear || 0,
        issueDate: i.issueDate || '',
        watermark: i.watermarkName || '',
        perforation: i.perforationName || '',
        printingMethod: i.printingMethod || '',
        printer: i.printer || '',
        totalStamps: 0,
      }
      entry.year = Math.min(entry.year || i.issueYear || 0, i.issueYear || entry.year || 0)
      ;(entry as any)._count = ((entry as any)._count || 0) + 1
      map.set(groupKey, entry)
    }
    return Array.from(map.values()).map(e => ({ ...e, totalStamps: (e as any)._count || e.totalStamps }))
  }

  const buildYearsForCountry = (countryCode: string): YearData[] => {
    const items = rawStamps.filter(i => ((i.country || '').toLowerCase() === countryCode.toLowerCase() || (i.countryName || '') === countryCode) && !i.isInstance)
    const set = new Map<number, YearData & { _releaseSet?: Set<string> }>()
    for (const i of items) {
      if (i.issueYear == null) continue
      const entry = set.get(i.issueYear) || {
        id: `${countryCode}-${i.issueYear}`,
        year: i.issueYear,
        countryId: countryCode,
        totalReleases: 0,
        description: ''
      }
      ;(entry as any)._releaseSet = (entry as any)._releaseSet || new Set<string>()
      if (i.stampGroupName) (entry as any)._releaseSet.add(i.stampGroupName)
      set.set(i.issueYear, entry)
    }
    return Array.from(set.values()).map(e => ({ ...e, totalReleases: ((e as any)._releaseSet ? (e as any)._releaseSet.size : e.totalReleases) || 0 }))
  }

  const buildReleasesForYear = (countryCode: string, year: number): ReleaseData[] => {
    const items = rawStamps.filter(i => ((i.country || '').toLowerCase() === countryCode.toLowerCase() || (i.countryName || '') === countryCode) && i.issueYear === year && !i.isInstance)
    const map = new Map<string, ReleaseData & { _categorySet?: Set<string> }>()
    for (const i of items) {
      const key = i.stampGroupName
      const entry = map.get(key) || {
        id: key,
        name: i.stampGroupName || 'Group',
        yearId: `${countryCode}-${year}`,
        dateRange: `${i.periodStart}-${i.periodEnd}`,
        perforation: i.perforationName || '',
        totalCategories: 0,
        hasCategories: false,
      }
      ;(entry as any)._categorySet = (entry as any)._categorySet || new Set<string>()
      if (i.categoryCode) (entry as any)._categorySet.add(i.categoryCode)
      map.set(key, entry)
    }
    return Array.from(map.values()).map(e => ({ ...e, totalCategories: ((e as any)._categorySet ? (e as any)._categorySet.size : e.totalCategories) || 0, hasCategories: (((e as any)._categorySet)?.size || 0) > 0 }))
  }

  const buildCategoriesForRelease = (countryCode: string, year: number, stampGroupId: string): CategoryData[] => {
    const items = rawStamps.filter(i => ((i.country || '').toLowerCase() === countryCode.toLowerCase() || (i.countryName || '') === countryCode) && i.issueYear === year && (i.stampGroupName || '') === stampGroupId && !i.isInstance)
    const map = new Map<string, CategoryData & { _paperSet?: Set<string> }>()
    for (const i of items) {
      const key = i.categoryCode
      const entry = map.get(key) || {
        id: key,
        name: i.categoryCode || key,
        code: i.categoryCode || key,
        stampGroupId,
        totalPaperTypes: 0,
        hasPaperTypes: false,
      }
      ;(entry as any)._paperSet = (entry as any)._paperSet || new Set<string>()
      if (i.paperName) (entry as any)._paperSet.add(i.paperName)
      map.set(key, entry)
    }
    return Array.from(map.values()).map(e => ({ ...e, totalPaperTypes: ((e as any)._paperSet ? (e as any)._paperSet.size : e.totalPaperTypes) || 0, hasPaperTypes: (((e as any)._paperSet)?.size || 0) > 0 }))
  }

  const buildPaperTypesForCategory = (countryCode: string, year: number, stampGroupId: string, categoryId: string): PaperTypeData[] => {
    const items = rawStamps.filter(i => ((i.country || '').toLowerCase() === countryCode.toLowerCase() || (i.countryName || '') === countryCode) && i.issueYear === year && (i.stampGroupName || '') === stampGroupId && ((i.categoryCode) === categoryId) && !i.isInstance)
    const map = new Map<string, PaperTypeData & { _count?: number }>()
    for (const i of items) {
      const key = i.paperName
      const entry = map.get(key) || {
        id: key,
        name: i.paperName || key,
        code: key,
        categoryId,
        totalStamps: 0,
      }
      ;(entry as any)._count = ((entry as any)._count || 0) + 1
      map.set(key, entry)
    }
    return Array.from(map.values()).map(e => ({ ...e, totalStamps: (e as any)._count || e.totalStamps }))
  }

  const buildStampsForPaperType = (countryCode: string, year: number, stampGroupId: string, categoryId: string, paperCode: string): StampData[] => {
    const set = new Set<string>()
    rawStamps.forEach(r => {
      if (((r.country || '').toLowerCase() === countryCode.toLowerCase() || (r.countryName || '') === countryCode) && r.issueYear === year && (r.stampGroupName || '') === stampGroupId && ((r.categoryCode) === categoryId)  && ((r.paperName) === paperCode) && !r.isInstance) {
        set.add(r.id)
      }
    })
    const baseStamps = normalizedStamps.filter(s => set.has(s.id))
    baseStamps.forEach((s: any) => {
      const instances = rawStamps.filter(r => r.parentStampId === (s as any).stampId)
      s.instances = instances.map(convertApiStampToStampData)
    })
    return baseStamps
  }

  const buildStampsForStampGroup = (seriesName: string, typeId: string, stampGroupId: string): StampData[] => {
    // Join normalized with raw to filter by stampGroupId reliably
    const set = new Set<string>()
    rawStamps.forEach(r => {
      if ((r.seriesName || '') === seriesName && (r.typeName === typeId) && (r.stampGroupName === stampGroupId) && !r.isInstance) {
        set.add(r.id)
      }
    })
    const baseStamps = normalizedStamps.filter(s => set.has(s.id))
    baseStamps.forEach((s: any) => {
      const instances = rawStamps.filter(r => r.parentStampId === (s as any).stampId)
      s.instances = instances.map(convertApiStampToStampData)
    })
    return baseStamps
  }

  useEffect(() => {
    const buildFromStamps = () => {
      setLoading(true)
      try {
        const stamps = normalizedStamps || []

        if (catalogLayout === 'campbell-paterson') {
          // Group by seriesName
          const series: Record<string, SeriesData & { typeNames: Record<string, boolean> }> = {}
          stamps.forEach(s => {
            if(s.isInstance) return
            const key = s.seriesName || 'Unknown Series'
            if (!series[key]) {
              series[key] = {
                id: key,
                name: key,
                country: s.country || 'Unknown',
                periodStart: s.issueYear || 0,
                periodEnd: s.issueYear || 0,
                totalTypes: 0,
                totalStampGroups: 0,
                typeNames: {},
                stampGroupNames: {}
              }
            }

            const entry = series[key]
            entry.country = entry.country || s.country || 'Unknown'
            if (s.issueYear) {
              entry.periodStart = Math.min(entry.periodStart, s.issueYear)
              entry.periodEnd = Math.max(entry.periodEnd, s.issueYear)
            }
            // Track distinct stamp groups per series
            if (s.typeName) entry.typeNames[s.typeName] = true
            if (s.typeName && s.stampGroupName){
              entry.stampGroupNames[s.typeName] = {
                ...entry.stampGroupNames[s.typeName],
                [s.stampGroupName]: true
              }
            }
          })

          const builtSeries = Object.values(series).map(seriesItem => ({
            id: seriesItem.id,
            name: seriesItem.name,
            country: seriesItem.country,
            periodStart: seriesItem.periodStart,
            periodEnd: seriesItem.periodEnd,
            totalTypes: Object.keys(seriesItem.typeNames).length,
            totalStampGroups: Object.values(seriesItem.stampGroupNames).reduce((sum, group) => sum + Object.keys(group).length, 0),
            typeNames: seriesItem.typeNames,
            stampGroupNames: seriesItem.stampGroupNames            
          }))
          setSeriesData(builtSeries as SeriesData[])
        } else {
          // Group by country
          const countryMap = new Map<string, CountryData>()
          stamps.forEach(s => {
            if(s.isInstance) return
            const code = s.countryCode || 'XX'
            const entry = countryMap.get(code) || {
              id: code,
              code,
              name: s.country || code,
              description: '',
              totalYears: 0,
              yearStart: s.issueYear || 0,
              yearEnd: s.issueYear || 0,
            } as CountryData

            entry.name = entry.name || s.country || code
            entry.description = entry.description || s.publisher || ''
            if (s.issueYear) {
              entry.yearStart = Math.min(entry.yearStart || s.issueYear, s.issueYear)
              entry.yearEnd = Math.max(entry.yearEnd || s.issueYear, s.issueYear)
            }
            ;(entry as any)._yearSet = (entry as any)._yearSet || new Set<number>()
            if (s.issueYear != null) (entry as any)._yearSet.add(s.issueYear)
            countryMap.set(code, entry)
          })

          const builtCountries = Array.from(countryMap.values()).map(e => ({
            ...e,
            totalYears: ((e as any)._yearSet ? (e as any)._yearSet.size : e.totalYears) || 0,
          }))
          setCountryData(builtCountries)
        }
      } finally {
        setLoading(false)
      }
    }

    if (!providerLoading) buildFromStamps()
  }, [catalogLayout, normalizedStamps, providerLoading])

  const handleSeriesClick = async (series: SeriesData) => {
    setLoadingModalContent(true);
    try {
      const typeData = buildTypesForSeries(series.name);
      setModalStack(prev => [...prev, {
        type: 'series',
        data: { series, types: typeData },
        title: `${series.name} Types`
      }])
    } finally {
      setLoadingModalContent(false);
    }
  }

  const handleCountryClick = async (country: CountryData) => {
    setLoadingModalContent(true);
    try {
      const yearData = buildYearsForCountry(country.code);
      setModalStack(prev => [...prev, {
        type: 'country',
        data: { country, years: yearData },
        title: `${country.name} Years`
      }])
    } finally {
      setLoadingModalContent(false);
    }
  }

  const closeModal = () => {
    setModalStack(prev => prev.slice(0, -1))
  }

  const filteredSeries = useMemo(() => {
    let filtered = seriesData
    if (selectedPeriod !== "all") {
      const period = parseInt(selectedPeriod)
      filtered = filtered.filter(series => 
        series.periodStart >= period && series.periodStart < period + 50
      )
    }
    if (searchTerm) {
      filtered = filtered.filter(series =>
        series.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        series.country.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    return filtered
  }, [seriesData, searchTerm, selectedPeriod])

  const filteredCountries = useMemo(() => {
    let filtered = countryData
    if (searchTerm) {
      filtered = filtered.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    return <ListCatalogSkeleton layout={catalogLayout} />
  }

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-sm mx-4 mt-4 mb-6 rounded-lg">
        <div className="p-4 sm:p-6">
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-1">
              {catalogLayout === 'campbell-paterson' ? 'NEW ZEALAND STAMP CATALOGUE' : 'STANLEY GIBBONS CATALOGUE'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
              {catalogLayout === 'campbell-paterson' ? 'Campbell Paterson Style Comprehensive Listing' : 'Stanley Gibbons Style Comprehensive Listing'}
            </p>
          </div>

          {/* Layout Toggle */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <Button
                variant={catalogLayout === 'campbell-paterson' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCatalogLayout('campbell-paterson')}
                className={catalogLayout === 'campbell-paterson' ? 'bg-black text-white dark:bg-amber-600 dark:text-white' : 'bg-white border-gray-300 text-black hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600'}
              >
                Campbell Paterson
              </Button>
              <Button
                variant={catalogLayout === 'stanley-gibbons' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCatalogLayout('stanley-gibbons')}
                className={catalogLayout === 'stanley-gibbons' ? 'bg-black text-white dark:bg-amber-600 dark:text-white' : 'bg-white border-gray-300 text-black hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600'}
              >
                Stanley Gibbons
              </Button>
            </div>
          </div>

          <hr className="border-gray-300 dark:border-gray-700 mb-4 sm:mb-6" />

          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  placeholder={catalogLayout === 'campbell-paterson' ? 
                    "Search by series name, description, or country..." : 
                    "Search by country name, description, or code..."
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 border-gray-300 focus:border-gray-500 bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:focus:border-amber-600 text-sm"
                />
              </div>
            </div>
            
            {catalogLayout === 'campbell-paterson' && (
              <div className="flex gap-2">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded bg-white dark:bg-gray-800 text-black dark:text-gray-100 dark:border-gray-600 text-sm focus:border-gray-500 dark:focus:border-amber-600 focus:outline-none"
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm border-t border-b border-gray-300 dark:border-gray-700 py-3">
            {catalogLayout === 'campbell-paterson' ? (
              <>
                <div>
                  <div className="text-lg font-bold text-black dark:text-white">
                    {seriesData.length}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Series</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-black dark:text-white">
                    {seriesData.reduce((sum, series) => sum + series.totalTypes, 0)}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Types</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-black dark:text-white">
                    {seriesData.reduce((sum, series) => sum + series.totalStampGroups, 0)}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Stamp Groups</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-black dark:text-white">
                    {seriesData.length > 0 ? Math.max(...seriesData.map(s => s.periodEnd || 0)) - Math.min(...seriesData.map(s => s.periodStart || 0)) : 0}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Years Span</div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="text-lg font-bold text-black dark:text-white">
                    {countryData.length}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Countries</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-black dark:text-white">
                    {countryData.reduce((sum, country) => sum + country.totalYears, 0)}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Total Years</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-black dark:text-white">
                    {countryData.reduce((sum, country) => sum + (country.totalYears * 4), 0)}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Releases</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-black dark:text-white">
                    {Math.max(...countryData.map(c => c.yearEnd)) - Math.min(...countryData.map(c => c.yearStart))}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Years Span</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
            {catalogLayout === 'campbell-paterson' ? (
              <>
                {/* Campbell Paterson Table Header */}
                <div className="border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2 hidden sm:block">
                  <div className="grid grid-cols-9 gap-4 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    <div className="col-span-4 text-gray-700 dark:text-gray-300">Series Name</div>
                    <div className="col-span-2 text-center text-gray-700 dark:text-gray-300">Period</div>
                    <div className="col-span-2 text-center text-gray-700 dark:text-gray-300">Types</div>
                    <div className="col-span-1"></div>
                  </div>
                </div>
                <div className="block sm:hidden border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2">
                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    <div className="text-gray-700 dark:text-gray-300">Series Name</div>
                    <div className="text-center text-gray-700 dark:text-gray-300">Period</div>
                  </div>
                </div>
                
                {/* Campbell Paterson Series Rows */}
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredSeries.map((series) => (
                    <div 
                      key={series.name}
                      className="cursor-pointer px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      onClick={() => handleSeriesClick(series)}
                    >
                      <div className="hidden sm:grid grid-cols-9 gap-4 items-center text-sm">
                        <div className="col-span-4 font-bold text-gray-900 dark:text-gray-100">
                          {series.name}
                        </div>
                        <div className="col-span-2 text-center text-gray-600 dark:text-gray-400">
                          {series.periodStart}-{series.periodEnd}
                        </div>
                        <div className="col-span-2 text-center text-gray-600 dark:text-gray-400">
                          {series.totalTypes}
                        </div>
                        <div className="col-span-1 text-right dark:text-gray-400">
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      <div className="grid sm:hidden grid-cols-2 gap-4 items-center text-sm">
                        <div>
                          <div className="font-bold text-gray-900 dark:text-gray-100">{series.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-600 dark:text-gray-400">{series.periodStart}-{series.periodEnd}</div>
                          <div className="text-gray-600 dark:text-gray-400 text-xs">{series.totalTypes} Types</div>
                          <ChevronRight className="h-4 w-4 text-gray-400 inline-block ml-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Stanley Gibbons Table Header */}
                <div className="border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2 hidden sm:block">
                  <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    <div className="col-span-4 text-gray-700 dark:text-gray-300">Country</div>
                    <div className="col-span-2 text-center text-gray-700 dark:text-gray-300">Code</div>
                    <div className="col-span-2 text-center text-gray-700 dark:text-gray-300">Years</div>
                    <div className="col-span-3 text-center text-gray-700 dark:text-gray-300">Period</div>
                    <div className="col-span-1"></div>
                  </div>
                </div>
                <div className="grid sm:hidden border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2">
                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    <div className="text-gray-700 dark:text-gray-300">Country</div>
                    <div className="text-center text-gray-700 dark:text-gray-300">Years</div>
                  </div>
                </div>
                
                {/* Stanley Gibbons Country Rows */}
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredCountries.map((country) => (
                    <div 
                      key={country.id}
                      className="cursor-pointer px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      onClick={() => handleCountryClick(country)}
                    >
                      <div className="hidden sm:grid grid-cols-12 gap-4 items-center text-sm">
                        <div className="col-span-4 font-bold text-gray-900 dark:text-gray-100">
                          {country.name}
                        </div>
                        <div className="col-span-2 text-center text-gray-600 dark:text-gray-400 font-mono">
                          {country.code}
                        </div>
                        <div className="col-span-2 text-center text-gray-600 dark:text-gray-400">
                          {country.totalYears}
                        </div>
                        <div className="col-span-3 text-center text-gray-600 dark:text-gray-400">
                          {country.yearStart}-{country.yearEnd}
                        </div>
                        <div className="col-span-1 text-right dark:text-gray-400">
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      <div className="grid sm:hidden grid-cols-2 gap-4 items-center text-sm">
                        <div>
                          <div className="font-bold text-gray-900 dark:text-gray-100">{country.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-600 dark:text-gray-400">{country.yearStart}-{country.yearEnd} ({country.totalYears} Years)</div>
                          <ChevronRight className="h-4 w-4 text-gray-400 inline-block ml-2" />
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
            <p className="text-gray-600 dark:text-gray-400 text-sm">
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
            className="max-w-md sm:max-w-6xl max-h-[95vh] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-0 flex flex-col border-0 rounded-lg"
            style={{ zIndex: 1000 + index * 10 }} // Increasing z-index for stack effect
          >
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 pb-4 rounded-t-lg">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-black dark:text-white flex items-center justify-between">
                  {modal.title}
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-white border-gray-300 text-black hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                    onClick={closeModal}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </DialogTitle>
              </DialogHeader>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 pt-2">
            {loadingModalContent ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="w-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-1/2 mb-2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-24 w-full mt-4" />
                      <Skeleton className="h-10 w-full mt-4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                {/* Campbell Paterson Modals */}
                {modal.type === 'series' && (
                  <SeriesModalContent 
                    series={modal.data.series} 
                    types={modal.data.types}
                    onTypeClick={async (typeData: TypeData) => {
                      setLoadingModalContent(true);
                      try {
                        const stampGroupData = buildStampGroupsForType(modal.data.series.name, typeData.id);
                        setModalStack(prev => [...prev, {
                          type: 'type',
                          data: { typeData, stampGroups: stampGroupData, series: modal.data.series },
                          title: `${modal.data.series.name} - ${typeData.name}`
                        }])
                      } finally {
                        setLoadingModalContent(false);
                      }
                    }}
                    isLoading={loadingModalContent}
                  />
                )}
                
                {modal.type === 'type' && (
                  <TypeModalContent 
                    typeData={modal.data.typeData}
                    stampGroups={modal.data.stampGroups}
                    onStampGroupClick={async (stampGroupData: StampGroupData) => {
                      setLoadingModalContent(true);
                      try {
                        const stampsData = buildStampsForStampGroup(modal.data.series.name, modal.data.typeData.id, stampGroupData.id);
                        setModalStack(prev => [...prev, {
                          type: 'stampGroup',
                          data: { stampGroupData, stamps: stampsData },
                          title: stampGroupData.name
                        }])
                      } finally {
                        setLoadingModalContent(false);
                      }
                    }}
                    isLoading={loadingModalContent}
                  />
                )}
                
                {modal.type === 'stampGroup' && (
                  <StampGroupModalContent 
                    stampGroupData={modal.data.stampGroupData}
                    stamps={modal.data.stamps}
                    onStampClick={(stampData: StampData) => {
                      setModalStack(prev => [...prev, {
                        type: 'stamps',
                        data: stampData,
                        title: `${stampData.denominationValue}${stampData.denominationSymbol} ${stampData.color}`
                      }])
                    }}
                    isLoading={loadingModalContent}
                  />
                )}

                {/* Stanley Gibbons Modals */}
                {modal.type === 'country' && (
                  <CountryModalContent 
                    country={modal.data.country} 
                    years={modal.data.years}
                    onYearClick={async (yearData: YearData) => {
                      setLoadingModalContent(true);
                      try {
                        const releaseData = buildReleasesForYear(modal.data.country.code, yearData.year);
                        setModalStack(prev => [...prev, {
                          type: 'year',
                          data: { countryId: modal.data.country.code, yearData, releases: releaseData },
                          title: `${modal.data.country.name} - ${yearData.year}`
                        }])
                      } finally {
                        setLoadingModalContent(false);
                      }
                    }}
                    isLoading={loadingModalContent}
                  />
                )}
                
                {modal.type === 'year' && (
                  <YearModalContent 
                    yearData={modal.data.yearData}
                    releases={modal.data.releases}
                    onReleaseClick={async (releaseData: ReleaseData) => {
                      setLoadingModalContent(true);
                      try {
                        const categoryData = buildCategoriesForRelease(modal.data.countryId, modal.data.yearData.year, releaseData.id);
                        setModalStack(prev => [...prev, {
                          type: 'release',
                          data: { countryId: modal.data.countryId, year: modal.data.yearData.year, releaseData, categories: categoryData },
                          title: releaseData.name && releaseData.name !== 'N/A' ? releaseData.name : 'Stamps with Unknown Release'
                        }])
                      } finally {
                        setLoadingModalContent(false);
                      }
                    }}
                    isLoading={loadingModalContent}
                  />
                )}
                
                {modal.type === 'release' && (
                  <ReleaseModalContent 
                    releaseData={modal.data.releaseData}
                    categories={modal.data.categories}
                    onCategoryClick={async (categoryData: CategoryData) => {
                      setLoadingModalContent(true);
                      try {
                        const paperTypeData = buildPaperTypesForCategory(modal.data.countryId, modal.data.year, modal.data.releaseData.id, categoryData.id);
                        setModalStack(prev => [...prev, {
                          type: 'category',
                          data: { countryId: modal.data.countryId, year: modal.data.year, stampGroupId: modal.data.releaseData.id, categoryData, paperTypes: paperTypeData },
                          title: categoryData.name && categoryData.name !== 'N/A' ? categoryData.name : 'Stamps with Unknown Category'
                        }])
                      } finally {
                        setLoadingModalContent(false);
                      }
                    }}
                    onPaperTypeClick={async (paperTypeData: PaperTypeData) => {
                      setLoadingModalContent(true);
                      try {
                        const stampsData = buildStampsForPaperType(modal.data.countryId, modal.data.year, modal.data.stampGroupId, modal.data.categoryData.id, paperTypeData.code)
                        setModalStack(prev => [...prev, {
                          type: 'paperType',
                          data: { countryId: modal.data.countryId, year: modal.data.year, stampGroupId: modal.data.stampGroupId, categoryId: modal.data.categoryData.id, paperTypeData, stamps: stampsData },
                          title: paperTypeData.name && paperTypeData.name !== 'N/A' ? paperTypeData.name : 'Stamps with Unknown Paper Type'
                        }])
                      } finally {
                        setLoadingModalContent(false);
                      }
                    }}
                    isLoading={loadingModalContent}
                  />
                )}
                
                {modal.type === 'category' && (
                  <CategoryModalContent 
                    categoryData={modal.data.categoryData}
                    paperTypes={modal.data.paperTypes}
                    onPaperTypeClick={async (paperTypeData: PaperTypeData) => {
                      setLoadingModalContent(true);
                      try {
                        const stampsData = buildStampsForPaperType(modal.data.countryId, modal.data.year, modal.data.stampGroupId, modal.data.categoryData.id, paperTypeData.code)
                        setModalStack(prev => [...prev, {
                          type: 'paperType',
                          data: { countryId: modal.data.countryId, year: modal.data.year, stampGroupId: modal.data.stampGroupId, categoryId: modal.data.categoryData.id, paperTypeData, stamps: stampsData },
                          title: paperTypeData.name && paperTypeData.name !== 'N/A' ? paperTypeData.name : 'Stamps with Unknown Paper Type'
                        }])
                      } finally {
                        setLoadingModalContent(false);
                      }
                    }}
                    isLoading={loadingModalContent}
                  />
                )}
                
                {modal.type === 'paperType' && (
                  <PaperTypeModalContent 
                    paperTypeData={modal.data.paperTypeData}
                    stamps={modal.data.stamps}
                    onStampClick={(stampData: StampData) => {
                      setModalStack(prev => [...prev, {
                        type: 'stamps',
                        data: stampData,
                        title: `${stampData.denominationValue}${stampData.denominationSymbol} ${stampData.color}`
                      }])
                    }}
                    isLoading={loadingModalContent}
                  />
                )}
                
                {modal.type === 'stamps' && (
                  <StampModalContent stampData={modal.data} isLoading={loadingModalContent} />
                )}
              </>
            )}
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  )
} 
