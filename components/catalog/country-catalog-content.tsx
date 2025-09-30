"use client"

import React, { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import ReactCountryFlag from "react-country-flag"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, ChevronRight, Quote, X } from "lucide-react"

import { ColorOption, CountryOption, CurrencyOption, DenominationOption, ItemTypeOption, ModalStackItem, PaperOption, PerforationOption, SeriesOption, StampData, WatermarkOption, YearOption } from "@/types/catalog"
import isoCountries from "i18n-iso-countries"
import enLocale from "i18n-iso-countries/langs/en.json"
import { CountryCatalogSkeleton } from "./investigate-search/loading-skeletons"
import PinnedStampCard from "./pinned-stamp-card"
import ModalContent from "./modal-content"
import { cn } from "@/lib/utils"
import { useCatalogData } from "@/lib/context/catalog-data-context"
import { useChatContext } from "../chat-provider"
import { convertApiStampToStampData, getStampDetails, groupStampsByColor, groupStampsByCountry, groupStampsByCurrency, groupStampsByDenomination, groupStampsByItemType, groupStampsByPaper, groupStampsByPerforation, groupStampsBySeries, groupStampsByWatermark, groupStampsByYear } from "@/lib/data/catalog-data"
import { parseStampCode } from "@/lib/utils/parse-stamp-code"

isoCountries.registerLocale(enLocale as any)

export function CountryCatalogContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [countries, setCountries] = useState<CountryOption[]>([])
  // Data via shared provider
  const {
    stamps,
} = useCatalogData()
const { isOpen: isChatOpen } = useChatContext()

// Pinned stamp state for comparison
const [pinnedStamp, setPinnedStamp] = useState<StampData | null>(null)
const [isPinnedMinimized, setIsPinnedMinimized] = useState(false)
const [loadingModalContent, setLoadingModalContent] = useState(false)
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)
const [modalStack, setModalStack] = useState<ModalStackItem[]>([])

  const filteredCountries = useMemo(() => {
    if (!searchTerm) return countries
    const term = searchTerm.toLowerCase()
    return countries.filter((country) =>
      (country.name && country.name.toLowerCase().includes(term)) ||
      country.description?.toLowerCase().includes(term) ||
      country.code.toLowerCase().includes(term)
    )
  }, [searchTerm, countries])

  useEffect(() => {
    try {
        setLoading(true)
        if (stamps && stamps.length > 0) {
            const countriesData = groupStampsByCountry(stamps)
            setCountries(countriesData as CountryOption[])
        } else {
            setCountries([])
        }
    } catch (err) {
        console.error('Error loading initial data:', err)
        setError('Failed to load catalog data')
    } finally {
        setLoading(false)
    }
}, [stamps])

  
    // Navigation handlers updated to use API data grouping
    const handleCountryClick = async (country: CountryOption) => {
      setLoadingModalContent(true);
      try {
          const series = groupStampsBySeries(stamps, country.code)

          // Check if there are no series (broken hierarchy)
          if (series.length === 0) {
              // Get stamps without series for this country
              const stampsList = getStampDetails(stamps, country.code)
              if (stampsList.length > 0) {
                  // Go directly to stamp details
                  setModalStack([{
                      type: 'stampDetails',
                      title: `${country.name} Stamps`,
                      data: { stamps: stampsList.map(convertApiStampToStampData) },
                      stampCode: country.code
                  }])
                  return
              }
          }

          setModalStack([{
              type: 'country',
              title: `${country.name} Catalog`,
              data: { country, series },
              stampCode: country.code
          }])
      } finally {
          setLoadingModalContent(false);
      }
  }

  const handleSeriesClick = async (series: SeriesOption, currentStampCode: string) => {
      setLoadingModalContent(true);
      try {
          const years = groupStampsByYear(stamps, currentStampCode, series.name)

          if (years?.length === 1 && (years[0] as any)?.stamps?.length === 1) {
              const stamp = convertApiStampToStampData((years[0] as any)?.stamps[0])
              const instances = stamps.filter(s => s.parentStampId === stamp.stampId)
              stamp.instances = instances as never;
              const currentModal = modalStack[modalStack.length - 1]
              const currentSelectedCategories = currentModal?.selectedAdditionalCategories || []
              const baseStampCode = currentModal?.data?.baseStampCode || currentModal?.stampCode

              setModalStack(prev => [...prev, {
                  type: 'stampDetails',
                  title: `${stamp.name}`,
                  data: { stamp, selectedAdditionalCategories: currentSelectedCategories },
                  stampCode: baseStampCode ? `${baseStampCode}|||${stamp.categoryCode}` : (stamp.catalogNumber || ''),
                  selectedAdditionalCategories: currentSelectedCategories
              }])
              return
          }
          // Use the series name directly, encoded to avoid issues with special characters
          const encodedSeriesName = encodeURIComponent(series.name)
          const newStampCode = `${currentStampCode}|||${encodedSeriesName}`
          setModalStack(prev => [...prev, {
              type: 'series',
              title: `${series.name} Timeline`,
              data: { series, years },
              stampCode: newStampCode
          }])
      } finally {
          setLoadingModalContent(false);
      }
  }

  const handleYearClick = async (year: YearOption, currentStampCode: string) => {
      setLoadingModalContent(true);
      try {
          // Extract series name from the stamp code
          const pathParts = currentStampCode.split('|||')
          const countryCode = pathParts[0]
          const encodedSeriesName = pathParts[1] // This is the encoded series name

          // Decode the series name
          const actualSeriesName = decodeURIComponent(encodedSeriesName)

          const currencies = groupStampsByCurrency(stamps, countryCode, actualSeriesName, year.year)

          // If no currencies available, show stamp details directly
          if (currencies?.length === 1 && (currencies[0] as any)?.stamps?.length === 1) {
              const stamp = convertApiStampToStampData((currencies[0] as any)?.stamps[0])
              const instances = stamps.filter(s => s.parentStampId === stamp.stampId)
              stamp.instances = instances as never;
              const currentModal = modalStack[modalStack.length - 1]
              const currentSelectedCategories = currentModal?.selectedAdditionalCategories || []
              const baseStampCode = currentModal?.data?.baseStampCode || currentModal?.stampCode

              setModalStack(prev => [...prev, {
                  type: 'stampDetails',
                  title: `${stamp.name}`,
                  data: { stamp, selectedAdditionalCategories: currentSelectedCategories },
                  stampCode: baseStampCode ? `${baseStampCode}|||${stamp.categoryCode}` : (stamp.catalogNumber || ''),
                  selectedAdditionalCategories: currentSelectedCategories
              }])
              return
          }

          const newStampCode = `${currentStampCode}|||${year.year}`
          setModalStack(prev => [...prev, {
              type: 'year',
              title: `${year.year} Collection`,
              data: { year, currencies },
              stampCode: newStampCode
          }])
      } finally {
          setLoadingModalContent(false);
      }
  }

  const handleCurrencyClick = async (currency: CurrencyOption, currentStampCode: string) => {
      setLoadingModalContent(true);
      try {
          // Extract parameters from stamp code
          const pathParts = currentStampCode.split('|||')
          const countryCode = pathParts[0]
          const encodedSeriesName = pathParts[1]
          const year = parseInt(pathParts[2])

          // Decode the series name
          const actualSeriesName = decodeURIComponent(encodedSeriesName)

          const denominations = groupStampsByDenomination(stamps, countryCode, actualSeriesName, year, currency.code)

          // Check if there are no denominations (broken hierarchy)
          if (denominations?.length === 1 && (denominations[0] as any)?.stamps?.length === 1) {
              const stamp = convertApiStampToStampData((denominations[0] as any)?.stamps[0])
              const instances = stamps.filter(s => s.parentStampId === stamp.stampId)
              stamp.instances = instances as never;
              console.log('Hello', stamp)
              const currentModal = modalStack[modalStack.length - 1]
              const currentSelectedCategories = currentModal?.selectedAdditionalCategories || []
              const baseStampCode = currentModal?.data?.baseStampCode || currentModal?.stampCode

              setModalStack(prev => [...prev, {
                  type: 'stampDetails',
                  title: `${stamp.name}`,
                  data: { stamp, selectedAdditionalCategories: currentSelectedCategories },
                  stampCode: baseStampCode ? `${baseStampCode}|||${stamp.categoryCode}` : (stamp.catalogNumber || ''),
                  selectedAdditionalCategories: currentSelectedCategories
              }])
              return
          }

          const newStampCode = `${currentStampCode}|||${currency.code}`
          setModalStack(prev => [...prev, {
              type: 'currency',
              title: `${currency.name} Values`,
              data: { currency, denominations },
              stampCode: newStampCode
          }])
      } finally {
          setLoadingModalContent(false);
      }
  }

  const handleDenominationClick = async (denomination: DenominationOption, currentStampCode: string) => {
      setLoadingModalContent(true);
      try {
          // Extract parameters from stamp code
          const pathParts = currentStampCode.split('|||')
          const countryCode = pathParts[0]
          const encodedSeriesName = pathParts[1]
          const year = parseInt(pathParts[2])
          const currencyCode = pathParts[3]

          // Decode the series name
          const actualSeriesName = decodeURIComponent(encodedSeriesName)

          const colors = groupStampsByColor(stamps, countryCode, actualSeriesName, year, currencyCode, denomination.value)

          // If no colors available, show stamp details directly
          if (colors?.length === 1 && (colors[0] as any)?.stamps?.length === 1) {
              const stamp = convertApiStampToStampData((colors[0] as any)?.stamps[0])
              const instances = stamps.filter(s => s.parentStampId === stamp.stampId)
              stamp.instances = instances as never;
              const currentModal = modalStack[modalStack.length - 1]
              const currentSelectedCategories = currentModal?.selectedAdditionalCategories || []
              const baseStampCode = currentModal?.data?.baseStampCode || currentModal?.stampCode

              setModalStack(prev => [...prev, {
                  type: 'stampDetails',
                  title: `${stamp.name}`,
                  data: { stamp, selectedAdditionalCategories: currentSelectedCategories },
                  stampCode: baseStampCode ? `${baseStampCode}|||${stamp.categoryCode}` : (stamp.catalogNumber || ''),
                  selectedAdditionalCategories: currentSelectedCategories
              }])
              return
          }

          const newStampCode = `${currentStampCode}|||${denomination.value}${denomination.symbol}`
          setModalStack(prev => [...prev, {
              type: 'denomination',
              title: `${denomination.displayName} Color Variations`,
              data: { denomination, colors },
              stampCode: newStampCode
          }])
      } finally {
          setLoadingModalContent(false);
      }
  }

  const handleColorClick = async (color: ColorOption, currentStampCode: string) => {
      setLoadingModalContent(true);
      try {
          const { countryCode, actualSeriesName, year, currencyCode, denominationValue } = parseStampCode(currentStampCode)

          const papers = groupStampsByPaper(stamps, countryCode, actualSeriesName, year, currencyCode, denominationValue, color.code)

          // If no papers available, show stamp details directly
          if (papers?.length === 1 && (papers[0] as any)?.stamps?.length === 1) {
              const stamp = convertApiStampToStampData((papers[0] as any)?.stamps[0])
              const instances = stamps.filter(s => s.parentStampId === stamp.stampId)
              stamp.instances = instances as never;
              const currentModal = modalStack[modalStack.length - 1]
              const currentSelectedCategories = currentModal?.selectedAdditionalCategories || []
              const baseStampCode = currentModal?.data?.baseStampCode || currentModal?.stampCode

              setModalStack(prev => [...prev, {
                  type: 'stampDetails',
                  title: `${stamp.name}`,
                  data: { stamp, selectedAdditionalCategories: currentSelectedCategories },
                  stampCode: baseStampCode ? `${baseStampCode}|||${stamp.categoryCode}` : (stamp.catalogNumber || ''),
                  selectedAdditionalCategories: currentSelectedCategories
              }])
              return
          }

          const newStampCode = `${currentStampCode}|||${color.code}`
          setModalStack(prev => [...prev, {
              type: 'color',
              title: `${color.name} Paper Types`,
              data: { color, papers },
              stampCode: newStampCode
          }])
      } finally {
          setLoadingModalContent(false);
      }
  }

  const handlePaperClick = async (paper: PaperOption, currentStampCode: string) => {
      setLoadingModalContent(true);
      try {
          const { countryCode, actualSeriesName, year, currencyCode, denominationValue, colorCode } = parseStampCode(currentStampCode)

          const watermarks = groupStampsByWatermark(stamps, countryCode, actualSeriesName, year, currencyCode, denominationValue, colorCode, paper.code)

          // If no watermarks available, show stamp details directly
          if (watermarks?.length === 1 && (watermarks[0] as any)?.stamps?.length === 1) {
              const stamp = convertApiStampToStampData((watermarks[0] as any)?.stamps[0])
              const instances = stamps.filter(s => s.parentStampId === stamp.stampId)
              stamp.instances = instances as never;
              const currentModal = modalStack[modalStack.length - 1]
              const currentSelectedCategories = currentModal?.selectedAdditionalCategories || []
              const baseStampCode = currentModal?.data?.baseStampCode || currentModal?.stampCode

              setModalStack(prev => [...prev, {
                  type: 'stampDetails',
                  title: `${stamp.name}`,
                  data: { stamp, selectedAdditionalCategories: currentSelectedCategories },
                  stampCode: baseStampCode ? `${baseStampCode}|||${stamp.categoryCode}` : (stamp.catalogNumber || ''),
                  selectedAdditionalCategories: currentSelectedCategories
              }])
              return
          }

          const newStampCode = `${currentStampCode}|||${paper.code}`
          setModalStack(prev => [...prev, {
              type: 'paper',
              title: `${paper.name} Watermarks`,
              data: { paper, watermarks },
              stampCode: newStampCode
          }])
      } finally {
          setLoadingModalContent(false);
      }
  }

  const handleWatermarkClick = async (watermark: WatermarkOption, currentStampCode: string) => {
      setLoadingModalContent(true);
      try {
          const { countryCode, actualSeriesName, year, currencyCode, denominationValue, colorCode, paperCode } = parseStampCode(currentStampCode)

          const perforations = groupStampsByPerforation(stamps, countryCode, actualSeriesName, year, currencyCode, denominationValue, colorCode, paperCode, watermark.code)

          // If no perforations available, show stamp details directly
          if (perforations?.length === 1 && (perforations[0] as any)?.stamps?.length === 1) {
              const stamp = convertApiStampToStampData((perforations[0] as any)?.stamps[0])
              const instances = stamps.filter(s => s.parentStampId === stamp.stampId)
              stamp.instances = instances as never;
              const currentModal = modalStack[modalStack.length - 1]
              const currentSelectedCategories = currentModal?.selectedAdditionalCategories || []
              const baseStampCode = currentModal?.data?.baseStampCode || currentModal?.stampCode

              setModalStack(prev => [...prev, {
                  type: 'stampDetails',
                  title: `${stamp.name}`,
                  data: { stamp, selectedAdditionalCategories: currentSelectedCategories },
                  stampCode: baseStampCode ? `${baseStampCode}|||${stamp.categoryCode}` : (stamp.catalogNumber || ''),
                  selectedAdditionalCategories: currentSelectedCategories
              }])
              return
          }

          const newStampCode = `${currentStampCode}|||${watermark.code}`
          setModalStack(prev => [...prev, {
              type: 'watermark',
              title: `Perforation Specifications`,
              data: { watermark, perforations },
              stampCode: newStampCode
          }])
      } finally {
          setLoadingModalContent(false);
      }
  }

  const handlePerforationClick = async (perforation: PerforationOption, currentStampCode: string) => {
      setLoadingModalContent(true);
      try {
          const { countryCode, actualSeriesName, year, currencyCode, denominationValue, colorCode, paperCode, watermarkCode } = parseStampCode(currentStampCode)

          const itemTypes = groupStampsByItemType(stamps, countryCode, actualSeriesName, year, currencyCode, denominationValue, colorCode, paperCode, watermarkCode, perforation.code)

          // If no item types available, show stamp details directly
          if (itemTypes?.length === 1 && (itemTypes[0] as any)?.stamps?.length === 1) {
              const stamp = convertApiStampToStampData((itemTypes[0] as any)?.stamps[0])
              const instances = stamps.filter(s => s.parentStampId === stamp.stampId)
              stamp.instances = instances as never;
              const currentModal = modalStack[modalStack.length - 1]
              const currentSelectedCategories = currentModal?.selectedAdditionalCategories || []
              const baseStampCode = currentModal?.data?.baseStampCode || currentModal?.stampCode

              setModalStack(prev => [...prev, {
                  type: 'stampDetails',
                  title: `${stamp.name}`,
                  data: { stamp, selectedAdditionalCategories: currentSelectedCategories },
                  stampCode: baseStampCode ? `${baseStampCode}|||${stamp.categoryCode}` : (stamp.catalogNumber || ''),
                  selectedAdditionalCategories: currentSelectedCategories
              }])
              return
          }

          const newStampCode = `${currentStampCode}|||${perforation.code}`
          setModalStack(prev => [...prev, {
              type: 'perforation',
              title: `Condition Categories`,
              data: { perforation, itemTypes },
              stampCode: newStampCode
          }])
      } finally {
          setLoadingModalContent(false);
      }
  }

  const handleItemTypeClick = async (itemType: ItemTypeOption, currentStampCode: string) => {
      setLoadingModalContent(true);
      try {
          const { countryCode, actualSeriesName, year, currencyCode, denominationValue, colorCode, paperCode, watermarkCode, perforationCode } = parseStampCode(currentStampCode)

          const stampsList = getStampDetails(stamps, countryCode, actualSeriesName, year, currencyCode, denominationValue, colorCode, paperCode, watermarkCode, perforationCode, itemType.code)

          if (stampsList?.length === 1) {
              const stamp = convertApiStampToStampData(stampsList[0])
              const instances = stamps.filter(s => s.parentStampId === stamp.stampId)
              stamp.instances = instances as never;
              const currentModal = modalStack[modalStack.length - 1]
              const currentSelectedCategories = currentModal?.selectedAdditionalCategories || []
              const baseStampCode = currentModal?.data?.baseStampCode || currentModal?.stampCode

              setModalStack(prev => [...prev, {
                  type: 'stampDetails',
                  title: `${stamp.name}`,
                  data: { stamp, selectedAdditionalCategories: currentSelectedCategories },
                  stampCode: baseStampCode ? `${baseStampCode}|||${stamp.categoryCode}` : (stamp.catalogNumber || ''),
                  selectedAdditionalCategories: currentSelectedCategories
              }])
              return
          }

          // Always go directly to stamp details - additional categories will be handled within the stamp details modal
          const newStampCode = `${currentStampCode}|||${itemType.code}`
          setModalStack(prev => [...prev, {
              type: 'stampDetails',
              title: `Approved Collection`,
              data: { stamps: stampsList.map(convertApiStampToStampData) },
              stampCode: newStampCode
          }])
      } finally {
          setLoadingModalContent(false);
      }
  }

  const closeModal = () => {
      setModalStack(prev => prev.slice(0, -1))
  }

  const closeAllModals = () => {
      setModalStack([])
      // Clear pinned stamp when closing all modals
      setPinnedStamp(null)
  }

  // Pinned stamp handlers
  const unpinStamp = () => {
      setPinnedStamp(null)
      setIsPinnedMinimized(false)
  }

  const togglePinnedMinimized = () => {
      setIsPinnedMinimized(prev => !prev)
  }

  const handleStampDetailClick = (stamp: StampData) => {
      // Get current modal to propagate selected categories and baseStampCode
      const currentModal = modalStack[modalStack.length - 1]
      const currentSelectedCategories = currentModal?.selectedAdditionalCategories || []
      const baseStampCode = currentModal?.data?.baseStampCode || currentModal?.stampCode
      const instances = stamps.filter(s => s.parentStampId === stamp.stampId)
      stamp.instances = instances as never;

      setModalStack(prev => [...prev, {
          type: 'stampDetails',
          title: `${stamp.name}`,
          data: { stamp, selectedAdditionalCategories: currentSelectedCategories },
          stampCode: baseStampCode ? `${baseStampCode}|||${stamp.categoryCode}` : (stamp.catalogNumber || ''),
          selectedAdditionalCategories: currentSelectedCategories
      }])
  }

  if (loading) {
    return <CountryCatalogSkeleton />
  }

  return (
    <>
      <section>
        <div className="relative mb-8 w-1/2 mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
          <Input
            type="text"
            placeholder="Search countries..."
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-primary dark:focus:ring-amber-500 focus:border-transparent transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8">
          {filteredCountries.map((country) => {
            const countriesForFlag = country.name && country.name.includes(',') ? country.name.split(',').map(c => c.trim()) : [country.name || '']
            const countryCodes: string[] = []
            countriesForFlag.forEach(country => {
              countryCodes.push(isoCountries.getAlpha2Code(country, "en") || "")
            })
            return <article
              key={country.code}
              className="group cursor-pointer"
              onClick={() => handleCountryClick(country)}
            >
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02] dark:bg-gray-800 dark:border-gray-700">
                <div className="relative h-56 overflow-hidden w-full">
                  <Image
                    src={country.featuredStampUrl || "/images/stamps/no-image-available.png"}
                    alt={`Premium stamps from ${country.name || 'Unknown Country'}`}
                    fill
                    className="object-contain transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement
                      if (target.src !== "/images/stamps/no-image-available.png") {
                        target.src = "/images/stamps/no-image-available.png"
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <Badge className="bg-primary text-white border-white/30 text-xs font-medium">
                        {country.totalStamps.toLocaleString()} stamps
                      </Badge>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 px-4 py-2 rounded-lg bg-black/30 backdrop-blur-sm">
                    <h3 className="text-xl font-extrabold text-white leading-tight mb-0.5 flex items-center">
                      {countryCodes.map((code) => (
                        <>
                          {code ?
                            <ReactCountryFlag
                              countryCode={code.toUpperCase()}
                              svg
                              style={{
                                width: '1.2em',
                                height: '1.2em',
                                marginRight: '0.5em',
                              }}
                              title={country.name || 'Unknown Country'}
                              className="rounded-sm"
                            /> : <></>}
                        </>
                      ))}
                      {country.name || 'Unknown Country'}
                    </h3>
                    <p className="text-gray-200 text-sm line-clamp-2">{country.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-gray-300 text-xs font-medium">
                        {country.firstIssue} - {country.lastIssue}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 pt-2">
                  <p className="text-gray-600 text-xs italic mb-2.5 relative dark:text-gray-300 line-clamp-3">
                    <Quote className="w-2.5 h-2.5 text-primary dark:text-amber-400 absolute -top-0.5 -left-0.5 opacity-60" />
                    <span className="ml-3.5">{country.historicalNote}</span>
                  </p>

                  <div className="flex items-center justify-between mt-2.5">
                    <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 dark:border-amber-600 dark:text-amber-400 dark:hover:bg-amber-900 group-hover:scale-105 transition-transform duration-300 px-2.5 py-0.5 text-xs h-auto">
                      Browse Catalog
                      <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          })}
        </div>

        {filteredCountries.length === 0 && searchTerm && (
          <div className="text-center py-12 md:py-16">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Catalogs Found</h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
              We couldn't find any countries matching your search. Try a different term or explore our featured collections.
            </p>
          </div>
        )}
      </section>

      {/* Premium Modal */}
      <div className="fixed inset-0 z-50 overflow-auto bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" style={{ display: modalStack.length > 0 ? 'block' : 'none' }}>
        <div className={cn(
          "fixed inset-0 z-50 grid place-items-center p-4",
          isChatOpen && "pr-[28rem]" // Leave space for chat modal (28rem = 448px, which is max-w-sm + padding)
        )}>
          <div className={cn(
            "relative w-full max-w-7xl h-[95vh] max-h-[95vh] bg-gradient-to-br from-orange-50 to-white dark:from-gray-900 dark:to-gray-950 border-0 shadow-2xl rounded-lg flex flex-col",
            isChatOpen && "max-w-6xl" // Reduce max width when chat is open
          )}>
            {/* Sticky Close Button */}
            <div className="sticky top-0 z-20 flex justify-between items-center px-6 pt-4 pb-6 rounded-t-lg border-b border-gray-200 dark:border-gray-700">
              {/* Header Section */}
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 md:mb-2">
                  {modalStack[modalStack.length - 1]?.title}
                </h3>
                {modalStack.length > 0 && (
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>Level {modalStack.length}</span>
                    <span>•</span>
                    <code className="bg-primary/10 dark:bg-primary/20 px-2 py-1 rounded font-mono text-xs text-primary dark:text-amber-300 break-all">
                      {decodeURIComponent(modalStack[modalStack.length - 1].stampCode).split('|||').join('.')}
                    </code>
                  </div>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200">
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </Button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto">

              {/* Modal Content */}
              <div className="px-6 py-4">
                {modalStack.length > 0 && (
                  <ModalContent
                    modalItem={modalStack[modalStack.length - 1]}
                    onSeriesClick={handleSeriesClick}
                    onYearClick={handleYearClick}
                    onCurrencyClick={handleCurrencyClick}
                    onDenominationClick={handleDenominationClick}
                    onColorClick={handleColorClick}
                    onPaperClick={handlePaperClick}
                    onWatermarkClick={handleWatermarkClick}
                    onPerforationClick={handlePerforationClick}
                    onItemTypeClick={handleItemTypeClick}
                    onStampDetailClick={handleStampDetailClick}
                    isLoading={loadingModalContent}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Pinned Stamp Card */}
      {pinnedStamp && (
        <PinnedStampCard
          stamp={pinnedStamp}
          isMinimized={isPinnedMinimized}
          onToggleMinimized={togglePinnedMinimized}
          onUnpin={unpinStamp}
        />
      )}
    </>
  )
}


