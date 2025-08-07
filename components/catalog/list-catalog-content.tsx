import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Calendar, BookOpen, Archive, Eye, ChevronRight, X, Grid, AlertCircle, ArrowLeft, MapPin, Palette, ImageIcon, ToggleLeft, ToggleRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { CatalogLayout, SeriesData, CountryData, ListModalStackItem, TypeData, StampGroupData, YearData, ReleaseData, CategoryData, PaperTypeData, StampData } from "@/types/catalog"
import {
    getCampbellPatersonSeries, getStanleyGibbonsCountries, getTypesForSeries,
    getStampGroupsForType, getYearsForCountry, getReleasesForYear,
    getCategoriesForRelease, getPaperTypesForCategory, getStampsForPaperType, getStampsForStampGroup
} from "@/lib/data/list-catalog-data"
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

export function ListCatalogContent() {
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

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (catalogLayout === 'campbell-paterson') {
        try {
          const data = await getCampbellPatersonSeries();
          setSeriesData(data);
        } catch (error) {
          console.error("Error loading Campbell Paterson series:", error);
        }
      } else {
        try {
          const data = await getStanleyGibbonsCountries();
          setCountryData(data);
        } catch (error) {
          console.error("Error loading Stanley Gibbons countries:", error);
        }
      }
      setLoading(false);
    };
    loadData();
  }, [catalogLayout])

  const handleSeriesClick = async (series: SeriesData) => {
    setLoadingModalContent(true);
    try {
      const typeData = await getTypesForSeries(series.name);
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
      const yearData = await getYearsForCountry(country.code);
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
        series.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      <div className="min-h-screen p-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-sm mx-auto mt-4 mb-6 rounded-lg">
          <div className="p-4 sm:p-6">
            <div className="text-center mb-4 sm:mb-6">
              <Skeleton className="h-8 w-2/4 mb-1 mx-auto rounded-md" />
              <Skeleton className="h-5 w-1/3 mx-auto rounded-md" />
            </div>

            {/* Layout Toggle */}
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <Skeleton className="h-9 w-44 rounded-lg" />
                <Skeleton className="h-9 w-44 rounded-lg" />
              </div>
            </div>

            <hr className="border-gray-300 dark:border-700 mb-4 sm:mb-6" />

            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Skeleton className="h-10 w-full pl-9 rounded-md" />
                </div>
              </div>
              
              <Skeleton className="h-10 w-32 rounded-md" />
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm border-t border-b border-gray-300 dark:border-gray-700 py-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="text-center">
                  <Skeleton className="h-6 w-1/2 mx-auto mb-1 rounded-md" />
                  <Skeleton className="h-4 w-3/4 mx-auto rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2">
                <div className="grid grid-cols-2 sm:grid-cols-12 gap-4 text-xs font-semibold uppercase tracking-wide">
                  <Skeleton className="h-4 w-full col-span-1 sm:col-span-4 rounded-md" />
                  <Skeleton className="h-4 w-full col-span-1 sm:col-span-2 rounded-md" />
                  <Skeleton className="h-4 w-full hidden sm:block col-span-2 rounded-md" />
                  <Skeleton className="h-4 w-full hidden sm:block col-span-3 rounded-md" />
                  <Skeleton className="h-4 w-4 hidden sm:block col-span-1 rounded-md" />
                </div>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="grid grid-cols-2 sm:grid-cols-12 gap-4 items-center text-sm">
                      <Skeleton className="h-4 w-3/4 col-span-1 sm:col-span-4 rounded-md" />
                      <Skeleton className="h-4 w-1/2 col-span-1 sm:col-span-2 rounded-md text-center" />
                      <Skeleton className="h-4 w-1/2 hidden sm:block col-span-2 rounded-md text-center" />
                      <Skeleton className="h-4 w-3/4 hidden sm:block col-span-3 rounded-md" />
                      <Skeleton className="h-4 w-4 hidden sm:block col-span-1 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
                    {seriesData.reduce((sum, series) => sum + (series.totalTypes * 3), 0)}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Stamp Groups</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-black dark:text-white">
                    {seriesData[seriesData.length - 1]?.periodEnd - seriesData[0]?.periodStart || 170}
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
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
            {catalogLayout === 'campbell-paterson' ? (
              <>
                {/* Campbell Paterson Table Header */}
                <div className="border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2 hidden sm:block">
                  <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    <div className="col-span-4 text-gray-700 dark:text-gray-300">Series Name</div>
                    <div className="col-span-2 text-center text-gray-700 dark:text-gray-300">Period</div>
                    <div className="col-span-2 text-center text-gray-700 dark:text-gray-300">Types</div>
                    <div className="col-span-3 text-gray-700 dark:text-gray-300">Description</div>
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
                      key={series.id}
                      className="cursor-pointer px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      onClick={() => handleSeriesClick(series)}
                    >
                      <div className="grid grid-cols-12 gap-4 items-center text-sm">
                        <div className="col-span-4 font-bold text-gray-900 dark:text-gray-100">
                          {series.name}
                        </div>
                        <div className="col-span-2 text-center text-gray-600 dark:text-gray-400">
                          {series.periodStart}-{series.periodEnd}
                        </div>
                        <div className="col-span-2 text-center text-gray-600 dark:text-gray-400">
                          {series.totalTypes}
                        </div>
                        <div className="col-span-3 text-gray-700 dark:text-gray-300 truncate">
                          {series.description}
                        </div>
                        <div className="col-span-1 text-right dark:text-gray-400">
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      <div className="grid sm:hidden grid-cols-2 gap-4 items-center text-sm">
                        <div>
                          <div className="font-bold text-gray-900 dark:text-gray-100">{series.name}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{series.description}</div>
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
                    <div className="col-span-3 text-gray-700 dark:text-gray-300">Country</div>
                    <div className="col-span-2 text-center text-gray-700 dark:text-gray-300">Code</div>
                    <div className="col-span-2 text-center text-gray-700 dark:text-gray-300">Years</div>
                    <div className="col-span-2 text-center text-gray-700 dark:text-gray-300">Period</div>
                    <div className="col-span-2 text-gray-700 dark:text-gray-300">Description</div>
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
                        <div className="col-span-3 font-bold text-gray-900 dark:text-gray-100">
                          {country.name}
                        </div>
                        <div className="col-span-2 text-center text-gray-600 dark:text-gray-400 font-mono">
                          {country.code}
                        </div>
                        <div className="col-span-2 text-center text-gray-600 dark:text-gray-400">
                          {country.totalYears}
                        </div>
                        <div className="col-span-2 text-center text-gray-600 dark:text-gray-400">
                          {country.yearStart}-{country.yearEnd}
                        </div>
                        <div className="col-span-2 text-gray-700 dark:text-gray-300 truncate">
                          {country.description}
                        </div>
                        <div className="col-span-1 text-right dark:text-gray-400">
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      <div className="grid sm:hidden grid-cols-2 gap-4 items-center text-sm">
                        <div>
                          <div className="font-bold text-gray-900 dark:text-gray-100">{country.name}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{country.description}</div>
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
            className="max-w-md sm:max-w-6xl max-h-[95vh] overflow-y-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
            style={{ zIndex: 1000 + index * 10 }} // Increasing z-index for stack effect
          >
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
            {loadingModalContent ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
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
                        const stampGroupData = await getStampGroupsForType(modal.data.series.name, typeData.id);
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
                        const stampsData = await getStampsForStampGroup(stampGroupData.id, modal.data.typeData.id, modal.data.series.name);
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
                        const releaseData = await getReleasesForYear(modal.data.country.code, yearData.year);
                        setModalStack(prev => [...prev, {
                          type: 'year',
                          data: { yearData, releases: releaseData },
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
                        const categoryData = await getCategoriesForRelease(modal.data.yearData.countryId, modal.data.yearData.year, releaseData.id);
                        setModalStack(prev => [...prev, {
                          type: 'release',
                          data: { releaseData, categories: categoryData },
                          title: releaseData.name
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
                        const paperTypeData = await getPaperTypesForCategory(modal.data.releaseData.yearId.split('-')[0], parseInt(modal.data.releaseData.yearId.split('-')[1]), modal.data.releaseData.id, categoryData.id);
                        setModalStack(prev => [...prev, {
                          type: 'category',
                          data: { categoryData, paperTypes: paperTypeData },
                          title: categoryData.name
                        }])
                      } finally {
                        setLoadingModalContent(false);
                      }
                    }}
                    onPaperTypeClick={async (paperTypeData: PaperTypeData) => {
                      setLoadingModalContent(true);
                      try {
                        const stampsData = await getStampsForPaperType(modal.data.releaseData.yearId.split('-')[0], parseInt(modal.data.releaseData.yearId.split('-')[1]), modal.data.releaseData.id, 'unknown_category', paperTypeData.code); // Assuming unknown_category if coming directly from release
                        setModalStack(prev => [...prev, {
                          type: 'paperType',
                          data: { paperTypeData, stamps: stampsData },
                          title: paperTypeData.name
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
                        const stampsData = await getStampsForPaperType(modal.data.categoryData.releaseId.split('-')[0], parseInt(modal.data.categoryData.releaseId.split('-')[1]), modal.data.categoryData.releaseId, modal.data.categoryData.id, paperTypeData.code);
                        setModalStack(prev => [...prev, {
                          type: 'paperType',
                          data: { paperTypeData, stamps: stampsData },
                          title: paperTypeData.name
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
          </DialogContent>
        </Dialog>
      ))}
    </div>
  )
} 
