import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Archive, ChevronRight, X } from "lucide-react"
import ReactCountryFlag from "react-country-flag"
import { CountryOption, YearOption, CurrencyOption, DenominationOption, ColorOption, PaperOption, WatermarkOption, PerforationOption, ItemTypeOption, StampData, AdditionalCategoryOption, ModalType, ModalStackItem, SeriesOption } from "@/types/catalog"
import { groupStampsByCountry, groupStampsBySeries, groupStampsByYear, groupStampsByCurrency, groupStampsByDenomination, groupStampsByColor, groupStampsByPaper, groupStampsByWatermark, groupStampsByPerforation, groupStampsByItemType, getStampDetails, convertApiStampToStampData } from "@/lib/data/catalog-data"
import { useCatalogData } from "@/lib/context/catalog-data-context"
import { parseStampCode } from "@/lib/utils/parse-stamp-code"
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
import { VisualCatalogSkeleton } from "./investigate-search/loading-skeletons"

const formatStampCode = (stampCode: string | null | undefined): string => {
  if (!stampCode || typeof stampCode !== 'string') return ''
  // Assuming the watermark is the 8th part (index 7) of the stampCode if it's null
  const parts = stampCode.split('|||')
  if (parts.length > 7 && (parts[7] === 'null' || parts[7] == null || parts[7] === '')) {
    parts[7] = 'NoWmk'
  }
  return parts.join('.')
}

export function VisualCatalogContent() {
  const { stamps } = useCatalogData()
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

  // parseStampCode now shared via utility

  const totalStampsCount = useMemo(() => {
    return stamps.filter(stamp => stamp.isInstance === false).length;
  }, []);

  const totalSeriesCount = useMemo(() => {
    const seriesNames = new Set<string>();
    stamps.forEach(stamp => {
      if (stamp.seriesName && stamp.isInstance === false) {
        seriesNames.add(stamp.seriesName);
      }
    });
    return seriesNames.size;
  }, []);

  const totalVarietiesCount = useMemo(() => {
    return stamps.filter(stamp => stamp.isInstance === true).length;
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
        try {
            setLoading(true)
            const countriesData = groupStampsByCountry(stamps)
            setCountries(countriesData as CountryOption[])
        } catch (err) {
            console.error('Error loading initial data:', err)
        } finally {
            setLoading(false)
        }
    }
    loadInitialData()
  }, [stamps])

  // Navigation handlers
  const handleCountryClick = async (country: CountryOption) => {
    setLoadingModalContent(true);
    try {
      const seriesOfStamps = groupStampsBySeries(stamps, country.code)
      if (seriesOfStamps.length === 0) {
        const stampsList = getStampDetails(stamps, country.code)
        if (stampsList.length > 0) {
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
      const years = groupStampsByYear(stamps, countryCode, series.name)

      if(years?.length === 1 && (years[0] as any)?.stamps?.length === 1) {
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
            stampCode: baseStampCode ? `${baseStampCode}|||${stamp.categoryCode}` : '',
            selectedAdditionalCategories: currentSelectedCategories
        }])
        return
      }

      const encodedSeriesName = encodeURIComponent(series.name)
      const newStampCode = `${currentStampCode}|||${encodedSeriesName}`
      setModalStack(prev => [...prev, {
        type: 'year',
        title: `${series.name}`,
        data: { series, years, countryCode, seriesName: series.name },
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
      const currencies = groupStampsByCurrency(stamps, countryCode, actualSeriesName, year.year)
      if(currencies?.length === 1 && (currencies[0] as any)?.stamps?.length === 1) {
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
            stampCode: baseStampCode ? `${baseStampCode}|||${stamp.categoryCode}` : '',
            selectedAdditionalCategories: currentSelectedCategories
        }])
        return
      }
      const newStampCode = `${currentStampCode}|||${year.year}`
      setModalStack(prev => [...prev, {
        type: 'currency',
        title: `${year.year} Issues`,
        data: { year, currencies, countryCode, seriesName: actualSeriesName },
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
      const denominations = groupStampsByDenomination(stamps, countryCode, actualSeriesName, year, currency.code)
      if(denominations?.length === 1 && (denominations[0] as any)?.stamps?.length === 1) {
        const stamp = convertApiStampToStampData((denominations[0] as any)?.stamps[0])
        const instances = stamps.filter(s => s.parentStampId === stamp.stampId)
        stamp.instances = instances as never;
        const currentModal = modalStack[modalStack.length - 1]
        const currentSelectedCategories = currentModal?.selectedAdditionalCategories || []
        const baseStampCode = currentModal?.data?.baseStampCode || currentModal?.stampCode

        setModalStack(prev => [...prev, {
            type: 'stampDetails',
            title: `${stamp.name}`,
            data: { stamp, selectedAdditionalCategories: currentSelectedCategories },
            stampCode: baseStampCode ? `${baseStampCode}|||${stamp.categoryCode}` : '',
            selectedAdditionalCategories: currentSelectedCategories
        }])
        return
      }
      const newStampCode = `${currentStampCode}|||${currency.code}`
      setModalStack(prev => [...prev, {
        type: 'denomination',
        title: `${currency.name} Denominations`,
        data: { currency, denominations, countryCode, seriesName: actualSeriesName, year },
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
      const colors = groupStampsByColor(stamps, countryCode, actualSeriesName, year, currencyCode, denomination.value)
      if(colors?.length === 1 && (colors[0] as any)?.stamps?.length === 1) {
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
            stampCode: baseStampCode ? `${baseStampCode}|||${stamp.categoryCode}` : '',
            selectedAdditionalCategories: currentSelectedCategories
        }])
        return
      }
      const newStampCode = `${currentStampCode}|||${denomination.value}${denomination.symbol}`
      setModalStack(prev => [...prev, {
        type: 'color',
        title: `${denomination.displayName} Colors`,
        data: { denomination, colors, countryCode, seriesName: actualSeriesName, year, currencyCode },
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
      if(papers?.length === 1 && (papers[0] as any)?.stamps?.length === 1) {
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
            stampCode: baseStampCode ? `${baseStampCode}|||${stamp.categoryCode}` : '',
            selectedAdditionalCategories: currentSelectedCategories
        }])
        return
      }

      const newStampCode = `${currentStampCode}|||${color.code}`
      setModalStack(prev => [...prev, {
        type: 'paper',
        title: `${color.name} Paper Types`,
        data: { color, papers, countryCode, seriesName: actualSeriesName, year, currencyCode, denominationValue },
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
      if(watermarks?.length === 1 && (watermarks[0] as any)?.stamps?.length === 1) {
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
            stampCode: baseStampCode ? `${baseStampCode}|||${stamp.categoryCode}` : '',
            selectedAdditionalCategories: currentSelectedCategories
        }])
        return
      }
      const newStampCode = `${currentStampCode}|||${paper.code}`
      setModalStack(prev => [...prev, {
        type: 'watermark',
        title: `${paper.name} Watermarks`,
        data: { paper, watermarks, countryCode, seriesName: actualSeriesName, year, currencyCode, denominationValue, colorCode },
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
      if(perforations?.length === 1 && (perforations[0] as any)?.stamps?.length === 1) {
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
            stampCode: baseStampCode ? `${baseStampCode}|||${stamp.categoryCode}` : '',
            selectedAdditionalCategories: currentSelectedCategories
        }])
        return
      }
      const newStampCode = `${currentStampCode}|||${watermark.code}`
      setModalStack(prev => [...prev, {
        type: 'perforation',
        title: `${watermark.name} Perforations`,
        data: { watermark, perforations, countryCode, seriesName: actualSeriesName, year, currencyCode, denominationValue, colorCode, paperCode },
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
      if(itemTypes?.length === 1 && (itemTypes[0] as any)?.stamps?.length === 1) {
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
            stampCode: baseStampCode ? `${baseStampCode}|||${stamp.categoryCode}` : '',
            selectedAdditionalCategories: currentSelectedCategories
        }])
        return
      }
      const newStampCode = `${currentStampCode}|||${perforation.code}`
      setModalStack(prev => [...prev, {
        type: 'itemType',
        title: `${perforation.name} Item Types`,
        data: { perforation, itemTypes, countryCode, seriesName: actualSeriesName, year, currencyCode, denominationValue, colorCode, paperCode, watermarkCode },
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
      if(stampsList?.length === 1) {
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
            stampCode: baseStampCode ? `${baseStampCode}|||${stamp.categoryCode}` : '',
            selectedAdditionalCategories: currentSelectedCategories
        }])
        return
      }
      const newStampCode = `${currentStampCode}|||${itemType.code}`
      setModalStack(prev => [...prev, {
        type: 'stampDetails',
        title: `${itemType.name} Details`,
        data: { stamps: stampsList.map(convertApiStampToStampData), showAsIndividualCards: true, stampCode: newStampCode },
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
      const newStampCode = `${currentStampCode}|||${stamp.categoryCode}`
      const instances = stamps.filter(s => s.parentStampId === stamp.stampId)
      stamp.instances = instances as never;
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
    return <VisualCatalogSkeleton />
  }

  return (
    <div className="min-h-screen p-2 md:p-6">
      {/* Header */}
      <Card className="mx-auto mt-2 mb-4 w-full max-w-4xl border bg-card text-card-foreground shadow-sm">
        <CardContent className="p-3 md:p-6">
          <div className="text-center mb-3 md:mb-6">
            <h1 className="text-xl md:text-3xl font-bold text-foreground mb-1">
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-center text-sm border-y border-border py-2">
            <div>
              <div className="text-base font-bold text-foreground">
                {countries.length}
              </div>
              <div className="text-xs text-muted-foreground">Countries</div>
            </div>
            <div>
              <div className="text-base font-bold text-foreground">
                {totalStampsCount + totalVarietiesCount}
              </div>
              <div className="text-xs text-muted-foreground">Stamps</div>
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
                    <div className="col-span-2 text-center flex items-center justify-center">
                      <ReactCountryFlag
                        countryCode={country.code}
                        svg
                        style={{
                          width: '2em',
                          height: '2em',
                        }}
                        title={country.name}
                      />
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
                    Stamp Code: <code className="bg-muted px-1 py-0.5 rounded text-xs text-foreground break-all">{formatStampCode(decodeURIComponent(modal.stampCode))}</code>
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
                    onStampClick={(stamp, currentStampCode) => handleStampDetailClick(stamp, currentStampCode)}
                    isLoading={loadingModalContent}
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
