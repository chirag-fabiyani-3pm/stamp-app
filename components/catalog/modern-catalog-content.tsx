"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { ArrowLeft, X, AlertCircle, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { CountryOption, YearOption, CurrencyOption, DenominationOption, ColorOption, PaperOption, WatermarkOption, PerforationOption, ItemTypeOption, StampData, ModalType, ModalStackItem, AdditionalCategoryOption, SeriesOption } from "@/types/catalog"
import {
    groupStampsByCountry,
    groupStampsBySeries,
    groupStampsByYear,
    groupStampsByCurrency,
    groupStampsByDenomination,
    groupStampsByColor,
    groupStampsByPaper,
    groupStampsByWatermark,
    groupStampsByPerforation,
    groupStampsByItemType,
    getStampDetails,
    convertApiStampToStampData
} from "@/lib/data/catalog-data"
// DB seeding handled in CatalogDataProvider
import PinnedStampCard from "@/components/catalog/pinned-stamp-card"
import ModalContent from "@/components/catalog/modal-content"
import { VisualCatalogContent } from "@/components/catalog/visual-catalog-content"
import { ListCatalogContent } from "@/components/catalog/list-catalog-content"
import { Skeleton } from "@/components/ui/skeleton";
import { CatalogContent } from "@/components/catalog/investigate-search/catalog-content";
import { useIsMobile } from "@/hooks/use-mobile";
// Removed: country flag now handled inside child component
import { CountryCatalogContent } from "@/components/catalog/country-catalog-content";
import { CatalogDataProvider, useCatalogData } from "@/lib/context/catalog-data-context"
import { parseStampCode } from "@/lib/utils/parse-stamp-code"
import { useChatContext } from "@/components/chat-provider"
import { DataFetchingProgress, LoadingStamps, VisualCatalogSkeleton, ListCatalogSkeleton } from "./investigate-search/loading-skeletons"
import StampCollection from './stamp-collection'
// import { CatalogNavbar } from '../catalog-navbar'
import { useSidebarContext } from "../app-content"

function ModernCatalogContentInner() {
    // const searchParams = useSearchParams()

    // Navigation state - updated to include new tabs
    const [modalStack, setModalStack] = useState<ModalStackItem[]>([])
    // Moved to CountryCatalogContent
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    // const initialActiveSection = (searchParams.get('tab') as 'countries' | 'visual' | 'list' | 'investigate') || 'countries'
    // const [activeSection, setActiveSection] = useState<'countries' | 'visual' | 'list' | 'investigate' | 'stamp-collection'>(initialActiveSection)
    const [loadingModalContent, setLoadingModalContent] = useState(false)
    const { activeSection } = useSidebarContext()

    const isMobile = useIsMobile()
    const { isOpen: isChatOpen } = useChatContext()

    // Pinned stamp state for comparison
    const [pinnedStamp, setPinnedStamp] = useState<StampData | null>(null)
    const [isPinnedMinimized, setIsPinnedMinimized] = useState(false)

    // Data via shared provider
    const {
        stamps,
        loading: dataLoading,
        error: dataError,
        fetchProgress,
        loadingType
    } = useCatalogData()
    // Data states - derived from API data
    const [countries, setCountries] = useState<CountryOption[]>([])

    // Initialize component with API data from context
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

    // Filtering now handled inside CountryCatalogContent

    if (loading) {
        return (
            <div className="min-h-screen bg-background text-foreground">
                {/* Navbar Skeleton */}
                <div className="sticky top-0 z-30 w-full bg-background/95 backdrop-blur border-b border-border">
                    <div className="container flex h-16 items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-8 w-32" />
                            <div className="hidden sm:flex items-center gap-2">
                                <Skeleton className="h-6 w-px" />
                                <Skeleton className="h-6 w-20" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-9 w-9 rounded-md" />
                        </div>
                    </div>
                </div>

                {/* Main Content Skeleton */}
                <main className="w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                    <CountryCatalogContent countries={[]} onCountryClick={handleCountryClick} loading />
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background text-foreground">

                <div className="flex items-center justify-center min-h-[80vh]">
                    <div className="text-center space-y-6 max-w-md mx-auto">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto dark:bg-red-900">
                            <AlertCircle className="w-10 h-10 text-red-500 dark:text-red-400" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold">Catalog Unavailable</h2>
                            <p className="text-muted-foreground">{error}</p>
                        </div>
                        <Button onClick={() => {
                            setError(null)
                            setLoading(true)
                            try {
                                const countriesData = groupStampsByCountry(stamps)
                                setCountries(countriesData as CountryOption[])
                            } catch (err) {
                                console.error('Error retrying data load:', err)
                                setError('Failed to reload catalog data')
                            } finally {
                                setLoading(false)
                            }
                        }} className="bg-primary hover:bg-primary/90 text-white">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="text-foreground">
            <div className="relative h-[150px] bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
                {/* Video Background */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ filter: 'brightness(0.5) contrast(1.1)' }}
                >
                    <source src="/video/Stamp_Catalogue_Video_Generation_Complete.mp4" type="video/mp4" />
                    {/* Fallback background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"></div>
                </video>

                {/* Enhanced overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-gray-900/30"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/40"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-3xl font-bold text-white mb-3 leading-tight">
                            <span className="bg-gradient-to-r from-amber-300 to-orange-500 bg-clip-text text-transparent">Stamps</span> of Approval
                        </h1>

                        <p className="text-sm text-gray-200 max-w-2xl drop-shadow-lg leading-relaxed">
                            Discover exceptional stamps that have earned collector approval through decades of
                            careful curation. Each specimen represents the finest in philatelic excellence.
                        </p>
                    </div>
                </div>
            </div>
            {/* Main Content */}
            <main className="w-full p-10">
                {modalStack.length === 0 ? (
                    <>
                        {/* API Data Fetching Progress Overlay */}
                        {fetchProgress.isFetching && (
                            <DataFetchingProgress
                                progress={fetchProgress.progress}
                                totalItems={fetchProgress.totalItems}
                                currentItems={fetchProgress.currentItems}
                                currentPage={fetchProgress.currentPage}
                                totalPages={fetchProgress.totalPages}
                                isComplete={fetchProgress.isComplete}
                            />
                        )}

                        {/* IndexedDB Loading State */}
                        {loadingType === 'indexeddb' && !fetchProgress.isFetching && (
                            <div className="space-y-6">
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold mb-4">Loading Stamp Catalog</h2>
                                    <p className="text-muted-foreground mb-6">Retrieving data from local storage...</p>
                                </div>
                                {activeSection === 'countries' ? (
                                    <CountryCatalogContent countries={[]} onCountryClick={handleCountryClick} loading />
                                ) : activeSection === 'visual' ? (
                                    <VisualCatalogSkeleton />
                                ) : activeSection === 'list' ? (
                                    <ListCatalogSkeleton />
                                ) : (
                                    <LoadingStamps
                                        count={12}
                                        type="grid"
                                    />
                                )}
                            </div>
                        )}

                        {/* Normal Content - Show when not loading */}
                        {loadingType === 'none' && !loading && (
                            <>
                                {/* Visual Catalog Section */}
                                {activeSection === 'visual' && (
                                    <VisualCatalogContent />
                                )}

                                {/* List Catalog Section */}
                                {activeSection === 'list' && (
                                    <ListCatalogContent />
                                )}

                                {/* Investigate Search Section */}
                                {activeSection === 'investigate' && (
                                    <CatalogContent />
                                )}

                                {activeSection === 'stamp-collection' && (
                                    <StampCollection />
                                )}

                                {/* Country Catalogs Section */}
                                {activeSection === 'countries' && (
                                    <CountryCatalogContent countries={countries} onCountryClick={handleCountryClick} />
                                )}
                            </>
                        )}

                        {/* Regular Loading State (for other operations) */}
                        {loading && loadingType === 'none' && !fetchProgress.isFetching && (
                            <div className="space-y-6">
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold mb-4">Loading Stamp Catalog</h2>
                                    <p className="text-muted-foreground mb-6">Preparing your catalog...</p>
                                </div>
                                {activeSection === 'countries' ? (
                                    <CountryCatalogContent countries={[]} onCountryClick={handleCountryClick} loading />
                                ) : activeSection === 'visual' ? (
                                    <VisualCatalogSkeleton />
                                ) : activeSection === 'list' ? (
                                    <ListCatalogSkeleton />
                                ) : (
                                    <LoadingStamps
                                        count={8}
                                        type="grid"
                                    />
                                )}
                            </div>
                        )}

                        {/* Error State */}
                        {error && (
                            <div className="text-center py-12">
                                <div className="text-red-500 mb-4">
                                    <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                                    <h2 className="text-xl font-semibold mb-2">Error Loading Catalog</h2>
                                    <p className="text-muted-foreground">{error}</p>
                                </div>
                                <Button onClick={() => window.location.reload()} variant="outline">
                                    Try Again
                                </Button>
                            </div>
                        )}
                    </>
                ) : null}
            </main>

            {/* Premium Modal */}
            <div className="fixed inset-0 z-50 overflow-auto bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" style={{ display: modalStack.length > 0 ? 'block' : 'none' }}>
                <div className={cn(
                    "fixed inset-0 z-50 grid place-items-center p-4",
                    isChatOpen && "pr-[28rem]" // Leave space for chat modal (28rem = 448px, which is max-w-sm + padding)
                )}>
                    <div className={cn(
                        "relative w-full max-w-7xl h-[95vh] max-h-[95vh] overflow-y-auto bg-gradient-to-br from-orange-50 to-white dark:from-gray-900 dark:to-gray-950 border-0 shadow-2xl rounded-lg",
                        isChatOpen && "max-w-6xl" // Reduce max width when chat is open
                    )}>
                        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4 md:pb-6 mb-4 md:mb-6 px-6 py-4">
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
                            <Button variant="ghost" size="sm" onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                                <X className="w-5 h-5 md:w-6 md-6" />
                            </Button>
                        </div>

                        <div className="px-6">
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


            {/* Pinned Stamp Card */}
            {pinnedStamp && (
                <PinnedStampCard
                    stamp={pinnedStamp}
                    isMinimized={isPinnedMinimized}
                    onToggleMinimized={togglePinnedMinimized}
                    onUnpin={unpinStamp}
                />
            )}
        </div>
    )
}

export function ModernCatalogContent() {
    // Wrap with provider so child tabs share data and DB seed
    return (
        <CatalogDataProvider>
            <ModernCatalogContentInner />
        </CatalogDataProvider>
    )
}
