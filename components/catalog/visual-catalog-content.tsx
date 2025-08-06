import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Archive, ChevronRight, X } from "lucide-react"
import { CountryOption, YearOption, CurrencyOption, DenominationOption, ColorOption, PaperOption, WatermarkOption, PerforationOption, ItemTypeOption, StampData, AdditionalCategoryOption, ModalType, ModalStackItem, SeriesOption } from "@/types/catalog"
import { apiStampData, groupStampsByCountry, groupStampsBySeries, groupStampsByYear, groupStampsByCurrency, groupStampsByDenomination, groupStampsByColor, groupStampsByPaper, groupStampsByWatermark, groupStampsByPerforation, groupStampsByItemType, getStampDetails, convertApiStampToStampData, generateAdditionalCategoriesData, generateStampsForAdditionalCategory } from "@/lib/data/catalog-data"
import { TraditionalPinnedStampCard } from "@/components/catalog/traditional-pinned-stamp-card"
import { AdditionalCategoryModalContent } from "@/components/catalog/additional-category-modal-content"
import { SeriesModalContent as VisualSeriesModalContent } from "@/components/catalog/visual-series-modal-content"
import { YearModalContent as VisualYearModalContent } from "@/components/catalog/visual-year-modal-content"
import { CurrencyModalContent as VisualCurrencyModalContent } from "@/components/catalog/visual-currency-modal-content"
import { DenominationModalContent as VisualDenominationModalContent } from "@/components/catalog/visual-denomination-modal-content"
import { ColorModalContent as VisualColorModalContent } from "@/components/catalog/visual-color-modal-content"
import { VisualWatermarkModalContent } from "@/components/catalog/visual-watermark-modal-content"
import { VisualPerforationModalContent } from "@/components/catalog/visual-perforation-modal-content"
import { VisualItemTypeModalContent } from "@/components/catalog/visual-item-type-modal-content"
import { PaperTypeModalContent as VisualPaperTypeModalContent } from "@/components/catalog/visual-paper-type-modal-content"
import { StampDetailsModalContent as VisualStampDetailsModalContent } from "@/components/catalog/visual-stamp-details-modal-content"
import { Skeleton } from "@/components/ui/skeleton"

export function VisualCatalogContent() {
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // Modal stack state - LIFO behavior
  const [modalStack, setModalStack] = useState<ModalStackItem[]>([])
  const [loadingModalContent, setLoadingModalContent] = useState(false)

  // Pinned stamp state for comparison
  const [pinnedStamp, setPinnedStamp] = useState<StampData | null>(null)
  const [isPinnedMinimized, setIsPinnedMinimized] = useState(false)

  // Countries data
  const [countries, setCountries] = useState<CountryOption[]>([])

  // Helper function to properly parse stamp codes with decimal points
  const parseStampCode = (stampCode: string) => {
    const parts = stampCode.split('.')
    const countryCode = parts[0] || ''
    const encodedSeriesName = parts[1] || ''
    const year = parseInt(parts[2] || '0')
    const currencyCode = parts[3] || ''
    
    // Handle decimal in denomination: parts[4] = "1", parts[5] = "5d" -> "1.5d"
    let denominationPart = parts[4] || ''
    let nextIndex = 5
    
    // Check if the next part starts with a digit (indicating it's part of the decimal)
    if (parts[5] && /^\d/.test(parts[5])) {
        denominationPart = `${parts[4] || ''}.${parts[5]}`
        nextIndex = 6
    }
    
    const denominationValue = denominationPart.replace(/[^\d.]/g, '')
    const actualSeriesName = decodeURIComponent(encodedSeriesName)
    
    // Extract remaining path components and handle additional decimal points
    const remainingParts = []
    let i = nextIndex
    
    while (i < parts.length) {
        let currentPart = parts[i] || ''
        
        // Check if next part could be a decimal continuation
        // This handles cases like watermark "W.7" being split into "W" and "7"
        if (i + 1 < parts.length && /^\d+$/.test(parts[i + 1])) {
            // If current part is a letter/code and next is purely numeric, combine them
            currentPart = `${parts[i] || ''}.${parts[i + 1]}`
            i += 2 // Skip both parts
        } else {
            i += 1
        }
        
        remainingParts.push(currentPart)
    }
    
    return {
        countryCode,
        actualSeriesName,
        year,
        currencyCode,
        denominationValue,
        remainingParts,
        // Legacy support - map to indexed positions for existing code
        colorCode: remainingParts[0] || '',
        paperCode: remainingParts[1] || '',
        watermarkCode: remainingParts[2] || '',
        perforationCode: remainingParts[3] || '',
        itemTypeCode: remainingParts[4] || ''
    }
  }

  const totalStampsCount = useMemo(() => {
    return apiStampData.filter(stamp => stamp.isInstance === false).length;
  }, []);

  const totalSeriesCount = useMemo(() => {
    const seriesNames = new Set<string>();
    apiStampData.forEach(stamp => {
      if (stamp.seriesName) {
        seriesNames.add(stamp.seriesName);
      }
    });
    return seriesNames.size;
  }, []);

  const totalVarietiesCount = useMemo(() => {
    let varieties = 0;
    apiStampData.filter(stamp => stamp.isInstance === true).forEach(stamp => {
      if (stamp.hasVarieties && stamp.varietyCount) {
        varieties += stamp.varietyCount;
      } else {
        varieties += 1;
      }
    });
    return varieties;
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
        try {
            setLoading(true)
            const countriesData = groupStampsByCountry(apiStampData)
            setCountries(countriesData as CountryOption[])
        } catch (err) {
            console.error('Error loading initial data:', err)
        } finally {
            setLoading(false)
        }
    }
    loadInitialData()
  }, [])

  // Navigation handlers
  const handleCountryClick = async (country: CountryOption) => {
    setLoadingModalContent(true);
    try {
      const seriesOfStamps = groupStampsBySeries(apiStampData, country.code)
      if (seriesOfStamps.length === 0) {
        const stamps = getStampDetails(apiStampData, country.code)
        if (stamps.length > 0) {
          setModalStack([{
            type: 'stampDetails',
            title: `${country.name} Stamps`,
            data: { stamps: stamps.map(convertApiStampToStampData) },
            stampCode: country.code
          }])
          return
        }
      }
      setModalStack([{
        type: 'series',
        title: `${country.name} Stamp Catalog`,
        data: { country, series: seriesOfStamps },
        stampCode: country.code
      }])
    } finally {
      setLoadingModalContent(false);
    }
  }

  const handleSeriesClick = async (series: SeriesOption, currentStampCode: string) => {
    setLoadingModalContent(true);
    try {
      const { countryCode } = parseStampCode(currentStampCode)
      const years = groupStampsByYear(apiStampData, countryCode, series.name)
      const encodedSeriesName = encodeURIComponent(series.name)
      const newStampCode = `${currentStampCode}.${encodedSeriesName}`
      setModalStack(prev => [...prev, {
        type: 'year',
        title: `${series.name}`,
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
      const { countryCode, actualSeriesName } = parseStampCode(currentStampCode)
      const currencies = groupStampsByCurrency(apiStampData, countryCode, actualSeriesName, year.year)
      if (currencies.length === 0) {
        const stamps = getStampDetails(apiStampData, countryCode, actualSeriesName, year.year)
        if (stamps.length > 0) {
          setModalStack(prev => [...prev, {
            type: 'stampDetails',
            title: `${year.year} Stamps`,
            data: { stamps: stamps.map(convertApiStampToStampData) },
            stampCode: `${currentStampCode}.${year.year}`
          }])
          return
        }
      }
      const newStampCode = `${currentStampCode}.${year.year}`
      setModalStack(prev => [...prev, {
        type: 'currency',
        title: `${year.year} Issues`,
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
      const { countryCode, actualSeriesName, year } = parseStampCode(currentStampCode)
      const denominations = groupStampsByDenomination(apiStampData, countryCode, actualSeriesName, year, currency.code)
      if (denominations.length === 0) {
        const stamps = getStampDetails(apiStampData, countryCode, actualSeriesName, year, currency.code)
        if (stamps.length > 0) {
          setModalStack(prev => [...prev, {
            type: 'stampDetails',
            title: `${currency.name} Stamps`,
            data: { stamps: stamps.map(convertApiStampToStampData) },
            stampCode: `${currentStampCode}.${currency.code}`
          }])
          return
        }
      }
      const newStampCode = `${currentStampCode}.${currency.code}`
      setModalStack(prev => [...prev, {
        type: 'denomination',
        title: `${currency.name} Denominations`,
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
      const { countryCode, actualSeriesName, year, currencyCode } = parseStampCode(currentStampCode)
      const colors = groupStampsByColor(apiStampData, countryCode, actualSeriesName, year, currencyCode, denomination.value)
      if (colors.length === 0) {
        const stamps = getStampDetails(apiStampData, countryCode, actualSeriesName, year, currencyCode, denomination.value)
        if (stamps.length > 0) {
          setModalStack(prev => [...prev, {
            type: 'stampDetails',
            title: `${denomination.displayName} Stamps`,
            data: { stamps: stamps.map(convertApiStampToStampData) },
            stampCode: `${currentStampCode}.${denomination.value}${denomination.symbol}`
          }])
          return
        }
      }
      const newStampCode = `${currentStampCode}.${denomination.value}${denomination.symbol}`
      setModalStack(prev => [...prev, {
        type: 'color',
        title: `${denomination.displayName} Colors`,
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
      const papers = groupStampsByPaper(apiStampData, countryCode, actualSeriesName, year, currencyCode, denominationValue, color.code)
      if (papers.length === 0) {
        const stamps = getStampDetails(apiStampData, countryCode, actualSeriesName, year, currencyCode, denominationValue, color.code)
        if (stamps.length > 0) {
          setModalStack(prev => [...prev, {
            type: 'stampDetails',
            title: `${color.name} Stamps`,
            data: { stamps: stamps.map(convertApiStampToStampData) },
            stampCode: `${currentStampCode}.${color.code}`
          }])
          return
        }
      }
      const newStampCode = `${currentStampCode}.${color.code}`
      setModalStack(prev => [...prev, {
        type: 'paper',
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
      const watermarks = groupStampsByWatermark(apiStampData, countryCode, actualSeriesName, year, currencyCode, denominationValue, colorCode, paper.code)
      if (watermarks.length === 0) {
        const stamps = getStampDetails(apiStampData, countryCode, actualSeriesName, year, currencyCode, denominationValue, colorCode, paper.code)
        if (stamps.length > 0) {
          setModalStack(prev => [...prev, {
            type: 'stampDetails',
            title: `${paper.name} Stamps`,
            data: { stamps: stamps.map(convertApiStampToStampData) },
            stampCode: `${currentStampCode}.${paper.code}`
          }])
          return
        }
      }
      const newStampCode = `${currentStampCode}.${paper.code}`
      setModalStack(prev => [...prev, {
        type: 'watermark',
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
      const perforations = groupStampsByPerforation(apiStampData, countryCode, actualSeriesName, year, currencyCode, denominationValue, colorCode, paperCode, watermark.code)
      if (perforations.length === 0) {
        const stamps = getStampDetails(apiStampData, countryCode, actualSeriesName, year, currencyCode, denominationValue, colorCode, paperCode, watermark.code)
        if (stamps.length > 0) {
          setModalStack(prev => [...prev, {
            type: 'stampDetails',
            title: `${watermark.name} Stamps`,
            data: { stamps: stamps.map(convertApiStampToStampData) },
            stampCode: `${currentStampCode}.${watermark.code}`
          }])
          return
        }
      }
      const newStampCode = `${currentStampCode}.${watermark.code}`
      setModalStack(prev => [...prev, {
        type: 'perforation',
        title: `${watermark.name} Perforations`,
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
      const itemTypes = groupStampsByItemType(apiStampData, countryCode, actualSeriesName, year, currencyCode, denominationValue, colorCode, paperCode, watermarkCode, perforation.code)
      if (itemTypes.length === 0) {
        const stamps = getStampDetails(apiStampData, countryCode, actualSeriesName, year, currencyCode, denominationValue, colorCode, paperCode, watermarkCode, perforation.code)
        if (stamps.length > 0) {
          setModalStack(prev => [...prev, {
            type: 'stampDetails',
            title: `${perforation.name} Stamps`,
            data: { stamps: stamps.map(convertApiStampToStampData) },
            stampCode: `${currentStampCode}.${perforation.code}`
          }])
          return
        }
      }
      const newStampCode = `${currentStampCode}.${perforation.code}`
      setModalStack(prev => [...prev, {
        type: 'itemType',
        title: `${perforation.name} Item Types`,
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
      const stamps = getStampDetails(apiStampData, countryCode, actualSeriesName, year, currencyCode, denominationValue, colorCode, paperCode, watermarkCode, perforationCode, itemType.code)
      const newStampCode = `${currentStampCode}.${itemType.code}`
      setModalStack(prev => [...prev, {
        type: 'stampDetails',
        title: `${itemType.name} Details`,
        data: { stamps: stamps.map(convertApiStampToStampData), showAsIndividualCards: true, stampCode: newStampCode },
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
    setPinnedStamp(null)
  }

  const handleStampDetailClick = (stamp: StampData, currentStampCode: string) => {
    setLoadingModalContent(true);
    try {
      const currentModal = modalStack[modalStack.length - 1]
      const currentSelectedCategories = currentModal?.selectedAdditionalCategories || []
      const newStampCode = `${currentStampCode}.${stamp.catalogNumber}`
      setModalStack(prev => [...prev, {
        type: 'stampDetails',
        title: `${stamp.name} Details`,
        data: { stamp, selectedAdditionalCategories: currentSelectedCategories, stampCode: newStampCode },
        stampCode: newStampCode,
        selectedAdditionalCategories: currentSelectedCategories
      }])
    } finally {
      setLoadingModalContent(false);
    }
  }

  const handleAdditionalCategoryClick = async (categoryType: string, currentStampCode: string) => {
    setLoadingModalContent(true);
    try {
      const { countryCode, actualSeriesName, year, currencyCode, denominationValue, colorCode, paperCode, watermarkCode, perforationCode, itemTypeCode } = parseStampCode(currentStampCode)
      const allStamps = getStampDetails(apiStampData, countryCode, actualSeriesName, year, currencyCode, denominationValue, colorCode, paperCode, watermarkCode, perforationCode, itemTypeCode)
      
      let filteredStamps = []
      switch (categoryType) {
        case 'postalHistory':
          filteredStamps = allStamps.filter(s => s.postalHistoryType)
          break
        case 'errors':
          filteredStamps = allStamps.filter(s => s.errorType)
          break
        case 'proofs':
          filteredStamps = allStamps.filter(s => s.proofType)
          break
        case 'essays':
          filteredStamps = allStamps.filter(s => s.essayType)
          break
        default:
          filteredStamps = allStamps
      }

      const categories: AdditionalCategoryOption[] = []
      const seenTypes = new Set()
      
      filteredStamps.forEach(stamp => {
        let categoryValue = null
        let categoryName = null
        
        switch (categoryType) {
            case 'postalHistory':
                categoryValue = stamp.postalHistoryType
                categoryName = stamp.postalHistoryType
                break
            case 'errors':
                categoryValue = stamp.errorType
                categoryName = stamp.errorType
                break
            case 'proofs':
                categoryValue = stamp.proofType
                categoryName = stamp.proofType
                break
            case 'essays':
                categoryValue = stamp.essayType
                categoryName = stamp.essayType
                break
        }
        
        if (categoryValue && !seenTypes.has(categoryValue)) {
            seenTypes.add(categoryValue)
            categories.push({
                code: categoryValue.replace(/\s+/g, '_').toLowerCase(),
                name: categoryName,
                description: `${categoryName} category stamps`,
                totalStamps: filteredStamps.filter(s => {
                    switch (categoryType) {
                        case 'postalHistory': return s.postalHistoryType === categoryValue
                        case 'errors': return s.errorType === categoryValue
                        case 'proofs': return s.proofType === categoryValue
                        case 'essays': return s.essayType === categoryValue
                        default: return false
                    }
                }).length,
                stampImageUrl: stamp.stampImageUrl || '/images/stamps/stamp.png'
            })
        }
      })
      
      const currentModal = modalStack[modalStack.length - 1]
      const currentSelectedCategories = currentModal?.selectedAdditionalCategories || []
      
      if (!pinnedStamp && currentModal?.data?.stamp) {
        setPinnedStamp(currentModal.data.stamp)
        setIsPinnedMinimized(false)
      }
      setModalStack(prev => [...prev, {
        type: categoryType as ModalType,
        title: `${categoryType.charAt(0).toUpperCase() + categoryType.slice(1)} Categories`,
        data: { categoryType, categories, stampCode: currentStampCode },
        stampCode: currentStampCode,
        selectedAdditionalCategories: [...currentSelectedCategories, categoryType]
      }])
    } finally {
      setLoadingModalContent(false);
    }
  }

  const handleAdditionalCategoryOptionClick = async (category: AdditionalCategoryOption, categoryType: string, currentStampCode: string) => {
    setLoadingModalContent(true);
    try {
      const { countryCode, actualSeriesName, year, currencyCode, denominationValue, colorCode, paperCode, watermarkCode, perforationCode, itemTypeCode } = parseStampCode(currentStampCode)
      const allStamps = getStampDetails(apiStampData, countryCode, actualSeriesName, year, currencyCode, denominationValue, colorCode, paperCode, watermarkCode, perforationCode, itemTypeCode)
      
      const stamps = allStamps.filter(stamp => {
          switch (categoryType) {
              case 'postalHistory':
                  return stamp.postalHistoryType === category.name
              case 'errors':
                  return stamp.errorType === category.name
              case 'proofs':
                  return stamp.proofType === category.name
              case 'essays':
                  return stamp.essayType === category.name
              default:
                  return false
          }
      }).map(convertApiStampToStampData)

      const currentModal = modalStack[modalStack.length - 1]
      const currentSelectedCategories = currentModal?.selectedAdditionalCategories || []
      
      setModalStack(prev => [...prev, {
        type: 'stampDetails',
        title: `${category.name} - Stamp Details`,
        data: {
          stamps,
          categoryFilter: category,
          baseStampCode: currentStampCode,
          showAsIndividualCards: true,
          selectedAdditionalCategories: currentSelectedCategories,
          stampCode: `${currentStampCode}.${category.code}`
        },
        stampCode: `${currentStampCode}.${category.code}`,
        selectedAdditionalCategories: currentSelectedCategories
      }])
    } finally {
      setLoadingModalContent(false);
    }
  }

  const unpinStamp = () => {
    setPinnedStamp(null)
    setIsPinnedMinimized(false)
  }

  const togglePinnedMinimized = () => {
    setIsPinnedMinimized(prev => !prev)
  }

  const filteredCountries = useMemo(() => {
    if (!searchTerm) return countries
    return countries.filter(country =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [countries, searchTerm])

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-6">
        <Card className="mx-auto mt-4 mb-6 w-full max-w-4xl border bg-card text-card-foreground shadow-sm">
          <CardContent className="p-4 md:p-6">
            <Skeleton className="h-8 w-1/2 mb-4 mx-auto" />
            <Skeleton className="h-4 w-3/4 mb-6 mx-auto" />
            <Skeleton className="h-4 w-full mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="text-center">
                  <Skeleton className="h-6 w-1/2 mx-auto mb-1" />
                  <Skeleton className="h-4 w-3/4 mx-auto" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="container mx-auto px-0 md:px-4 pb-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded shadow-sm">
              <div className="border-b border-border bg-muted/50 px-4 py-2">
                <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full col-span-2" />
                  ))}
                </div>
              </div>
              <div className="divide-y divide-border">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="px-4 py-3">
                    <div className="grid grid-cols-12 gap-4 items-center text-sm">
                      <Skeleton className="h-6 w-6 rounded-full col-span-1" />
                      <Skeleton className="h-4 w-3/4 col-span-5" />
                      <Skeleton className="h-4 w-1/2 col-span-2" />
                      <Skeleton className="h-4 w-full col-span-3" />
                      <Skeleton className="h-4 w-4 col-span-1" />
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
    <div className="min-h-screen p-2 md:p-6">
      {/* Header */}
      <Card className="mx-auto mt-2 mb-4 w-full max-w-4xl border bg-card text-card-foreground shadow-sm">
        <CardContent className="p-3 md:p-6">
          <div className="text-center mb-3 md:mb-6">
            <h1 className="text-xl md:text-3xl font-bold text-foreground font-serif mb-1">
              VISUAL CATALOGUE
            </h1>
            <p className="text-sm text-muted-foreground">
              Navigate through stamps by hierarchical categories
            </p>
          </div>

          <Separator className="my-3 md:my-6 bg-border" />

          {/* Search Controls */}
          <div className="flex flex-col md:flex-row gap-3 mb-3 md:mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 border border-input focus:border-primary bg-background text-foreground text-sm"
                />
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-sm border-y border-border py-2">
            <div>
              <div className="text-base font-bold text-foreground">
                {countries.length}
              </div>
              <div className="text-xs text-muted-foreground">Countries</div>
            </div>
            <div>
              <div className="text-base font-bold text-foreground">
                {totalStampsCount.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Total Stamps</div>
            </div>
            <div>
              <div className="text-base font-bold text-foreground">
                {totalVarietiesCount.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Varieties</div>
            </div>
            <div>
              <div className="text-base font-bold text-foreground">
                {totalSeriesCount.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Series</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Countries Table */}
      <div className="container mx-auto px-0 md:px-4 pb-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded shadow-sm">
            {/* Countries Table Header */}
            <div className="border-b border-border bg-muted/50 px-3 py-2">
              <div className="grid grid-cols-12 gap-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                <div className="col-span-2 text-center">Flag</div>
                <div className="col-span-4">Country</div>
                <div className="col-span-2 text-center">Code</div>
                <div className="col-span-3 text-right">Total Stamps</div>
                <div className="hidden sm:block col-span-1"></div>
              </div>
            </div>

            {/* Countries Rows */}
            <div className="divide-y divide-border">
              {filteredCountries.map((country) => (
                <div
                  key={country.code}
                  className="cursor-pointer px-3 py-2 hover:bg-muted/70 transition-colors"
                  onClick={() => handleCountryClick(country)}
                >
                  <div className="grid grid-cols-12 gap-3 items-center text-sm">
                    <div className="col-span-2 text-center">
                      <span className="text-xl">{country.flag}</span>
                    </div>
                    <div className="col-span-4 font-bold text-foreground">
                      {country.name}
                    </div>
                    <div className="col-span-2 text-center">
                      <Badge variant="outline" className="text-xs">{country.code}</Badge>
                    </div>
                    <div className="col-span-3 text-right text-muted-foreground">
                      <div className="flex items-center justify-end space-x-1">
                        <Archive className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">{country.totalStamps.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="hidden col-span-1 text-right sm:flex justify-end">
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Stack Rendering - LIFO with stacked positioning */}
      {modalStack.map((modal, index) => (
        <Dialog key={index} open={true} onOpenChange={() => {
          // Close only the top modal (LIFO)
          if (index === modalStack.length - 1) {
            closeModal()
          }
        }}>
          <DialogContent
            className="max-w-[calc(100vw-2rem)] md:max-w-6xl max-h-[90vh] overflow-y-auto bg-background text-foreground border border-border shadow-lg"
            style={{
              zIndex: 50 + index * 10,
            }}
          >
            <DialogHeader className="border-b border-border pb-3 mb-3">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-lg md:text-2xl font-bold text-foreground">
                    {modal.title}
                  </DialogTitle>
                  <p className="text-xs text-muted-foreground mt-1 break-words">
                    Stamp Code: <code className="bg-muted px-1 py-0.5 rounded text-xs text-foreground break-all">{decodeURIComponent(modal.stampCode)}</code>
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={closeModal} className="text-muted-foreground hover:bg-muted/70 w-8 h-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>

            {/* Render content based on modal type */}
            {loadingModalContent ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="w-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-7 w-7 rounded-full" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-3 w-1/2 mb-1" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-20 w-full mt-3" />
                      <Skeleton className="h-8 w-full mt-3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto no-scrollbar">
                {modal.type === 'series' && (
                  <VisualSeriesModalContent
                    data={modal.data}
                    onSeriesClick={(series: SeriesOption) => handleSeriesClick(series, modal.stampCode)}
                    isLoading={loadingModalContent}
                  />
                )}
                {modal.type === 'year' && (
                  <VisualYearModalContent
                    data={modal.data}
                    onYearClick={(year: YearOption) => handleYearClick(year, modal.stampCode)}
                    isLoading={loadingModalContent}
                  />
                )}
                {modal.type === 'currency' && (
                  <VisualCurrencyModalContent
                    data={modal.data}
                    onCurrencyClick={(currency: CurrencyOption) => handleCurrencyClick(currency, modal.stampCode)}
                    isLoading={loadingModalContent}
                  />
                )}
                {modal.type === 'denomination' && (
                  <VisualDenominationModalContent
                    data={modal.data}
                    onDenominationClick={(denomination: DenominationOption) => handleDenominationClick(denomination, modal.stampCode)}
                    isLoading={loadingModalContent}
                  />
                )}
                {modal.type === 'color' && (
                  <VisualColorModalContent
                    data={modal.data}
                    onColorClick={(color: ColorOption) => handleColorClick(color, modal.stampCode)}
                    isLoading={loadingModalContent}
                  />
                )}
                {modal.type === 'paper' && (
                  <VisualPaperTypeModalContent
                    data={modal.data}
                    onPaperClick={(paper: PaperOption) => handlePaperClick(paper, modal.stampCode)}
                    isLoading={loadingModalContent}
                  />
                )}
                {modal.type === 'watermark' && (
                  <VisualWatermarkModalContent
                    data={modal.data}
                    onWatermarkClick={(watermark: WatermarkOption) => handleWatermarkClick(watermark, modal.stampCode)}
                    isLoading={loadingModalContent}
                  />
                )}
                {modal.type === 'perforation' && (
                  <VisualPerforationModalContent
                    data={modal.data}
                    onPerforationClick={(perforation: PerforationOption) => handlePerforationClick(perforation, modal.stampCode)}
                    isLoading={loadingModalContent}
                  />
                )}
                {modal.type === 'itemType' && (
                  <VisualItemTypeModalContent
                    data={modal.data}
                    onItemTypeClick={(itemType: ItemTypeOption) => handleItemTypeClick(itemType, modal.stampCode)}
                    isLoading={loadingModalContent}
                  />
                )}
                {modal.type === 'stampDetails' && (
                  <VisualStampDetailsModalContent
                    data={modal.data}
                    onAdditionalCategoryClick={handleAdditionalCategoryClick}
                    onStampClick={(stamp, currentStampCode) => handleStampDetailClick(stamp, currentStampCode)}
                    isLoading={loadingModalContent}
                  />
                )}
                {(modal.type === 'postalHistory' || modal.type === 'postmarks' || modal.type === 'proofs' ||
                  modal.type === 'essays' || modal.type === 'onPiece' || modal.type === 'errors' || modal.type === 'other') && (
                    <AdditionalCategoryModalContent
                      data={modal.data}
                      onCategoryOptionClick={handleAdditionalCategoryOptionClick}
                    />
                  )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      ))}

      {/* Pinned Stamp Card */}
      {pinnedStamp && (
        <TraditionalPinnedStampCard
          stamp={pinnedStamp}
          isMinimized={isPinnedMinimized}
          onToggleMinimized={togglePinnedMinimized}
          onUnpin={unpinStamp}
        />
      )}
    </div>
  )
} 
