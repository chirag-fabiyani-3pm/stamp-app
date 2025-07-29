import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Calendar, BookOpen, Archive, Eye, ChevronRight, X, Grid, AlertCircle, ArrowLeft, MapPin, Palette, ImageIcon, Globe, Coins, TrendingUp, Navigation, Bookmark } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { CountryOption, StampGroupOption, YearOption, CurrencyOption, DenominationOption, ColorOption, PaperOption, WatermarkOption, PerforationOption, ItemTypeOption, StampData, AdditionalCategoryOption, ModalType, ModalStackItem } from "@/types/catalog"
import { generateCountriesData, generateStampGroupsData, generateYearsData, generateCurrenciesData, generateDenominationsData, generateColorsData, generatePapersData, generateWatermarksData, generatePerforationsData, generateItemTypesData, generateStampDetails, generateAdditionalCategoriesData, generateStampsForAdditionalCategory, generateComprehensiveStampData, getColorName, getPaperName, getPerforation, getWatermarkName, getItemTypeName } from "@/lib/data/visual-catalog-data"
import { TraditionalPinnedStampCard } from "@/components/catalog/traditional-pinned-stamp-card"
import { AdditionalCategoryModalContent } from "@/components/catalog/additional-category-modal-content"
import { CountryModalContent as VisualCountryModalContent } from "@/components/catalog/visual-country-modal-content"
import { StampGroupModalContent as VisualStampGroupModalContent } from "@/components/catalog/visual-stamp-group-modal-content"
import { YearModalContent as VisualYearModalContent } from "@/components/catalog/visual-year-modal-content"
import { CurrencyModalContent as VisualCurrencyModalContent } from "@/components/catalog/visual-currency-modal-content"
import { DenominationModalContent as VisualDenominationModalContent } from "@/components/catalog/visual-denomination-modal-content"
import { PaperModalContent as VisualPaperModalContent } from "@/components/catalog/visual-paper-modal-content"
import { VisualWatermarkModalContent } from "@/components/catalog/visual-watermark-modal-content"
import { VisualPerforationModalContentNew } from "@/components/catalog/visual-perforation-modal-content-new"
import { VisualItemTypeModalContentNew } from "@/components/catalog/visual-item-type-modal-content-new"
import { ColorModalContent as VisualColorModalContent } from "@/components/catalog/visual-color-modal-content"
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

  useEffect(() => {
    setLoading(true);
    generateCountriesData().then(setCountries).catch(console.error).finally(() => setLoading(false))
  }, [])

  // Navigation handlers
  const handleCountryClick = async (country: CountryOption) => {
    setLoadingModalContent(true);
    try {
      const stampGroups = await generateStampGroupsData(country.code)
      setModalStack([{
        type: 'country',
        title: `${country.name} Stamp Catalog`,
        data: { country, stampGroups },
        stampCode: country.code
      }])
    } finally {
      setLoadingModalContent(false);
    }
  }

  const handleStampGroupClick = async (group: StampGroupOption, currentStampCode: string) => {
    setLoadingModalContent(true);
    try {
      const years = await generateYearsData(currentStampCode, group.catalogNumber)
      const newStampCode = `${currentStampCode}.${group.catalogNumber}`
      setModalStack(prev => [...prev, {
        type: 'stampGroup',
        title: `${group.name}`,
        data: { group, years },
        stampCode: newStampCode
      }])
    } finally {
      setLoadingModalContent(false);
    }
  }

  const handleYearClick = async (year: YearOption, currentStampCode: string) => {
    setLoadingModalContent(true);
    try {
      const currencies = await generateCurrenciesData(currentStampCode, year.year)
      const newStampCode = `${currentStampCode}.${year.year}`
      setModalStack(prev => [...prev, {
        type: 'year',
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
      const denominations = await generateDenominationsData(currentStampCode, currency.code)
      const newStampCode = `${currentStampCode}.${currency.code}`
      setModalStack(prev => [...prev, {
        type: 'currency',
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
      const colors = await generateColorsData(currentStampCode, denomination.value)
      const newStampCode = `${currentStampCode}.${denomination.value}${denomination.symbol}`
      setModalStack(prev => [...prev, {
        type: 'denomination',
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
      const papers = await generatePapersData(currentStampCode, color.code)
      const newStampCode = `${currentStampCode}.${color.code}`
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
      const watermarks = await generateWatermarksData(currentStampCode, paper.code)
      const newStampCode = `${currentStampCode}.${paper.code}`
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
      const perforations = await generatePerforationsData(currentStampCode, watermark.code)
      const newStampCode = `${currentStampCode}.${watermark.code}`
      setModalStack(prev => [...prev, {
        type: 'watermark',
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
      const itemTypes = await generateItemTypesData(currentStampCode, perforation.code)
      const newStampCode = `${currentStampCode}.${perforation.code}`
      setModalStack(prev => [...prev, {
        type: 'perforation',
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
      const stamps = await generateStampDetails(currentStampCode, itemType.code)
      const newStampCode = `${currentStampCode}.${itemType.code}`
      setModalStack(prev => [...prev, {
        type: 'itemType',
        title: `${itemType.name} Details`,
        data: { itemType, stamps },
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
  }

  const handleStampDetailClick = (stamp: StampData) => {
    setLoadingModalContent(true);
    try {
      const currentModal = modalStack[modalStack.length - 1]
      const currentSelectedCategories = currentModal?.selectedAdditionalCategories || []
      setModalStack(prev => [...prev, {
        type: 'stampDetails',
        title: `${stamp.name} Details`,
        data: { stamp, selectedAdditionalCategories: currentSelectedCategories },
        stampCode: stamp.stampCode || '',
        selectedAdditionalCategories: currentSelectedCategories
      }])
    } finally {
      setLoadingModalContent(false);
    }
  }

  const handleAdditionalCategoryClick = async (categoryType: string, currentStampCode: string) => {
    setLoadingModalContent(true);
    try {
      const categories = await generateAdditionalCategoriesData(categoryType, currentStampCode)
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
      const stamps = await generateStampsForAdditionalCategory(currentStampCode, categoryType, category.code)
      const currentModal = modalStack[modalStack.length - 1]
      const currentSelectedCategories = currentModal?.selectedAdditionalCategories || []
      if (stamps.length === 1) {
        setModalStack(prev => [...prev, {
          type: 'stampDetails',
          title: `${category.name} - Stamp Details`,
          data: {
            stamp: stamps[0],
            categoryFilter: category,
            baseStampCode: currentStampCode,
            selectedAdditionalCategories: currentSelectedCategories
          },
          stampCode: `${currentStampCode}.${category.code}`,
          selectedAdditionalCategories: currentSelectedCategories
        }])
      } else {
        setModalStack(prev => [...prev, {
          type: 'stampDetails',
          title: `${category.name} - Select Stamp`,
          data: {
            stamps,
            categoryFilter: category,
            baseStampCode: currentStampCode,
            showAsIndividualCards: true,
            selectedAdditionalCategories: currentSelectedCategories
          },
          stampCode: `${currentStampCode}.${category.code}`,
          selectedAdditionalCategories: currentSelectedCategories
        }])
      }
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

  const currentModal = modalStack[modalStack.length - 1]

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-6 bg-background">
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
    <div className="min-h-screen p-4 md:p-6 bg-background">
      {/* Header */}
      <Card className="mx-auto mt-4 mb-6 w-full max-w-4xl border bg-card text-card-foreground shadow-sm">
        <CardContent className="p-4 md:p-6">
          <div className="text-center mb-4 md:mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground font-serif mb-1">
              VISUAL CATALOGUE
            </h1>
            <p className="text-sm text-muted-foreground">
              Navigate through stamps by hierarchical categories
            </p>
          </div>

          <Separator className="my-4 md:my-6 bg-border" />

          {/* Search Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-4 md:mb-6">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm border-y border-border py-3">
            <div>
              <div className="text-lg font-bold text-foreground">
                {countries.length}
              </div>
              <div className="text-xs text-muted-foreground">Countries</div>
            </div>
            <div>
              <div className="text-lg font-bold text-foreground">
                {countries.reduce((sum, country) => sum + country.totalStamps, 0).toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Total Stamps</div>
            </div>
            <div>
              <div className="text-lg font-bold text-foreground">
                {Math.floor(Math.random() * 50) + 150}K
              </div>
              <div className="text-xs text-muted-foreground">Varieties</div>
            </div>
            <div>
              <div className="text-lg font-bold text-foreground">
                {Math.floor(Math.random() * 10) + 5}K
              </div>
              <div className="text-xs text-muted-foreground">Series</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Countries Table */}
      <div className="container mx-auto px-0 md:px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded shadow-sm">
            {/* Countries Table Header */}
            <div className="border-b border-border bg-muted/50 px-4 py-2">
              <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                <div className="col-span-2 sm:col-span-1 text-center">Flag</div>
                <div className="col-span-5 sm:col-span-5">Country</div>
                <div className="col-span-2 text-center">Code</div>
                <div className="col-span-3 sm:col-span-3 text-right">Total Stamps</div>
                <div className="hidden sm:block col-span-1"></div>
              </div>
            </div>

            {/* Countries Rows */}
            <div className="divide-y divide-border">
              {filteredCountries.map((country) => (
                <div
                  key={country.code}
                  className="cursor-pointer px-4 py-3 hover:bg-muted/70 transition-colors"
                  onClick={() => handleCountryClick(country)}
                >
                  <div className="grid grid-cols-12 gap-4 items-center text-sm">
                    <div className="col-span-2 sm:col-span-1 text-center">
                      <span className="text-2xl">{country.flag}</span>
                    </div>
                    <div className="col-span-5 sm:col-span-5 font-bold text-foreground">
                      {country.name}
                    </div>
                    <div className="col-span-2 text-center">
                      <Badge variant="outline">{country.code}</Badge>
                    </div>
                    <div className="col-span-3 sm:col-span-3 text-right text-muted-foreground">
                      <div className="flex items-center justify-end space-x-2">
                        <Archive className="h-4 w-4 text-muted-foreground" />
                        <span>{country.totalStamps.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="hidden sm:block col-span-1 text-right">
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
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
            <DialogHeader className="border-b border-border pb-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-xl md:text-2xl font-bold text-foreground">
                    {modal.title}
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground mt-1 break-words">
                    Stamp Code: <code className="bg-muted px-2 py-1 rounded text-sm text-foreground break-all">{modal.stampCode}</code>
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={closeModal} className="text-muted-foreground hover:bg-muted/70">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>

            {/* Render content based on modal type */}
            {loadingModalContent ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
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
              <div className="overflow-x-auto no-scrollbar">
                {modal.type === 'country' && (
                  <VisualCountryModalContent
                    data={modal.data}
                    onStampGroupClick={(group: StampGroupOption) => handleStampGroupClick(group, modal.stampCode)}
                    isLoading={loadingModalContent}
                  />
                )}
                {modal.type === 'stampGroup' && (
                  <VisualStampGroupModalContent
                    data={modal.data}
                    onYearClick={(year: YearOption) => handleYearClick(year, modal.stampCode)}
                    isLoading={loadingModalContent}
                  />
                )}
                {modal.type === 'year' && (
                  <VisualYearModalContent
                    data={modal.data}
                    onCurrencyClick={(currency: CurrencyOption) => handleCurrencyClick(currency, modal.stampCode)}
                    isLoading={loadingModalContent}
                  />
                )}
                {modal.type === 'currency' && (
                  <VisualCurrencyModalContent
                    data={modal.data}
                    onDenominationClick={(denomination: DenominationOption) => handleDenominationClick(denomination, modal.stampCode)}
                    isLoading={loadingModalContent}
                  />
                )}
                {modal.type === 'denomination' && (
                  <VisualDenominationModalContent
                    data={modal.data}
                    onColorClick={(color: ColorOption) => handleColorClick(color, modal.stampCode)}
                    isLoading={loadingModalContent}
                  />
                )}
                {modal.type === 'color' && (
                  <VisualColorModalContent
                    data={modal.data}
                    onPaperClick={(paper: PaperOption) => handlePaperClick(paper, modal.stampCode)}
                    isLoading={loadingModalContent}
                  />
                )}
                {modal.type === 'paper' && (
                  <VisualWatermarkModalContent
                    data={modal.data}
                    onWatermarkClick={(watermark: WatermarkOption) => handleWatermarkClick(watermark, modal.stampCode)}
                    isLoading={loadingModalContent}
                  />
                )}
                {modal.type === 'watermark' && (
                  <VisualPerforationModalContentNew
                    data={modal.data}
                    onPerforationClick={(perforation: PerforationOption) => handlePerforationClick(perforation, modal.stampCode)}
                    isLoading={loadingModalContent}
                  />
                )}
                {modal.type === 'perforation' && (
                  <VisualItemTypeModalContentNew
                    data={modal.data}
                    onItemTypeClick={(itemType: ItemTypeOption) => handleItemTypeClick(itemType, modal.stampCode)}
                    isLoading={loadingModalContent}
                  />
                )}
                {modal.type === 'itemType' && (
                  <VisualStampDetailsModalContent
                    data={modal.data}
                    onAdditionalCategoryClick={handleAdditionalCategoryClick}
                    onStampClick={(stamp) => handleStampDetailClick(stamp)}
                    isLoading={loadingModalContent}
                  />
                )}
                {modal.type === 'stampDetails' && (
                  <VisualStampDetailsModalContent
                    data={modal.data}
                    onAdditionalCategoryClick={handleAdditionalCategoryClick}
                    onStampClick={(stamp) => handleStampDetailClick(stamp)}
                    isLoading={loadingModalContent}
                  />
                )}
                {(modal.type === 'postalHistory' || modal.type === 'postmarks' || modal.type === 'proofs' ||
                  modal.type === 'essays' || modal.type === 'onPiece' || modal.type === 'errors' || modal.type === 'other') && (
                    <AdditionalCategoryModalContent
                      data={modal.data}
                      onCategoryOptionClick={handleAdditionalCategoryOptionClick}
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