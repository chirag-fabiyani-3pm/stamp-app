"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Calendar, BookOpen, Archive, Eye, ArrowLeft, Home, Sparkles, Coins, Palette, Grid, Filter, Share2, Layers, Globe, Star, Zap, Gem, Heart, Navigation, MapPin, Clock, DollarSign, FileText, Package, Menu, User, Settings, X, TrendingUp, AlertCircle, Play, Camera, Image as ImageIcon, ExternalLink, Stamp, List, MenuSquare, PanelLeft, AlignJustify, GripVertical, PanelRightOpen, AlignLeft, GripHorizontal, MoreHorizontal, MoreVertical, EllipsisVertical, SlidersHorizontal, Rows2, Grid3x3, LayoutGrid, Telescope } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { CountryOption, YearOption, CurrencyOption, DenominationOption, ColorOption, PaperOption, WatermarkOption, PerforationOption, ItemTypeOption, StampData, ModalType, ModalStackItem, FeaturedStory, AdditionalCategoryOption, SeriesOption } from "@/types/catalog"
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
import { DataFetchingProgress, LoadingStamps } from "./investigate-search/loading-skeletons"

function ModernCatalogContentInner() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const mainContentRef = React.useRef<HTMLDivElement>(null);

    // Navigation state - updated to include new tabs
    const [modalStack, setModalStack] = useState<ModalStackItem[]>([])
    // Moved to CountryCatalogContent
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const initialActiveSection = (searchParams.get('tab') as 'countries' | 'visual' | 'list' | 'investigate') || 'countries'
    const [activeSection, setActiveSection] = useState<'countries' | 'visual' | 'list' | 'investigate'>(initialActiveSection)
    const [loadingModalContent, setLoadingModalContent] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false) // State for mobile menu

    const isMobile = useIsMobile()

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
            // Use the series name directly, encoded to avoid issues with special characters
            const encodedSeriesName = encodeURIComponent(series.name)
            const newStampCode = `${currentStampCode}.${encodedSeriesName}`
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
            const pathParts = currentStampCode.split('.')
            const countryCode = pathParts[0]
            const encodedSeriesName = pathParts[1] // This is the encoded series name
            
            // Decode the series name
            const actualSeriesName = decodeURIComponent(encodedSeriesName)
            
            const currencies = groupStampsByCurrency(stamps, countryCode, actualSeriesName, year.year)
            
            // If no currencies available, show stamp details directly
            if (currencies.length === 0) {
                const stampsList = getStampDetails(stamps, countryCode, actualSeriesName, year.year)
                if (stampsList.length > 0) {
                    const convertedStamps = stampsList.map(convertApiStampToStampData)
                    setModalStack(prev => [...prev, {
                        type: 'stampDetails',
                        title: `${year.year} Stamps`,
                        data: { stamps: convertedStamps },
                        stampCode: `${currentStampCode}.${year.year}`
                    }])
                    return
                }
            }
            
            const newStampCode = `${currentStampCode}.${year.year}`
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
            const pathParts = currentStampCode.split('.')
            const countryCode = pathParts[0]
            const encodedSeriesName = pathParts[1]
            const year = parseInt(pathParts[2])
            
            // Decode the series name
            const actualSeriesName = decodeURIComponent(encodedSeriesName)
            
            const denominations = groupStampsByDenomination(stamps, countryCode, actualSeriesName, year, currency.code)
            
            // Check if there are no denominations (broken hierarchy)
            if (denominations.length === 0) {
                const stampsList = getStampDetails(stamps, countryCode, actualSeriesName, year, currency.code)
                if (stampsList.length > 0) {
                    setModalStack(prev => [...prev, {
                        type: 'stampDetails',
                        title: `${currency.name} Stamps`,
                        data: { stamps: stampsList.map(convertApiStampToStampData) },
                        stampCode: `${currentStampCode}.${currency.code}`
                    }])
                    return
                }
            }
            
            const newStampCode = `${currentStampCode}.${currency.code}`
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
            const pathParts = currentStampCode.split('.')
            const countryCode = pathParts[0]
            const encodedSeriesName = pathParts[1]
            const year = parseInt(pathParts[2])
            const currencyCode = pathParts[3]
            
            // Decode the series name
            const actualSeriesName = decodeURIComponent(encodedSeriesName)
            
            const colors = groupStampsByColor(stamps, countryCode, actualSeriesName, year, currencyCode, denomination.value)
            
            // If no colors available, show stamp details directly
            if (colors.length === 0) {
                const stampsList = getStampDetails(stamps, countryCode, actualSeriesName, year, currencyCode, denomination.value)
                if (stampsList.length > 0) {
                    setModalStack(prev => [...prev, {
                        type: 'stampDetails',
                        title: `${denomination.displayName} Stamps`,
                        data: { stamps: stampsList.map(convertApiStampToStampData) },
                        stampCode: `${currentStampCode}.${denomination.value}${denomination.symbol}`
                    }])
                    return
                }
            }
            
            const newStampCode = `${currentStampCode}.${denomination.value}${denomination.symbol}`
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
            if (papers.length === 0) {
                const stampsList = getStampDetails(stamps, countryCode, actualSeriesName, year, currencyCode, denominationValue, color.code)
                if (stampsList.length > 0) {
                    const convertedStamps = stampsList.map(convertApiStampToStampData)
                    setModalStack(prev => [...prev, {
                        type: 'stampDetails',
                        title: `${color.name} Stamps`,
                        data: { stamps: convertedStamps },
                        stampCode: `${currentStampCode}.${color.code}`
                    }])
                    return
                }
            }
            
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
            const { countryCode, actualSeriesName, year, currencyCode, denominationValue, colorCode } = parseStampCode(currentStampCode)
            
            const watermarks = groupStampsByWatermark(stamps, countryCode, actualSeriesName, year, currencyCode, denominationValue, colorCode, paper.code)
            
            // If no watermarks available, show stamp details directly
            if (watermarks.length === 0) {
                const stampsList = getStampDetails(stamps, countryCode, actualSeriesName, year, currencyCode, denominationValue, colorCode, paper.code)
                if (stampsList.length > 0) {
                    setModalStack(prev => [...prev, {
                        type: 'stampDetails',
                        title: `${paper.name} Stamps`,
                        data: { stamps: stampsList.map(convertApiStampToStampData) },
                        stampCode: `${currentStampCode}.${paper.code}`
                    }])
                    return
                }
            }
            
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
            const { countryCode, actualSeriesName, year, currencyCode, denominationValue, colorCode, paperCode } = parseStampCode(currentStampCode)
            
            const perforations = groupStampsByPerforation(stamps, countryCode, actualSeriesName, year, currencyCode, denominationValue, colorCode, paperCode, watermark.code)
            
            // If no perforations available, show stamp details directly
            if (perforations.length === 0) {
                const stampsList = getStampDetails(stamps, countryCode, actualSeriesName, year, currencyCode, denominationValue, colorCode, paperCode, watermark.code)
                if (stampsList.length > 0) {
                    setModalStack(prev => [...prev, {
                        type: 'stampDetails',
                        title: `${watermark.name} Stamps`,
                        data: { stamps: stampsList.map(convertApiStampToStampData) },
                        stampCode: `${currentStampCode}.${watermark.code}`
                    }])
                    return
                }
            }
            
            const newStampCode = `${currentStampCode}.${watermark.code}`
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
            if (itemTypes.length === 0) {
                const stampsList = getStampDetails(stamps, countryCode, actualSeriesName, year, currencyCode, denominationValue, colorCode, paperCode, watermarkCode, perforation.code)
                if (stampsList.length > 0) {
                    setModalStack(prev => [...prev, {
                        type: 'stampDetails',
                        title: `${perforation.name} Stamps`,
                        data: { stamps: stampsList.map(convertApiStampToStampData) },
                        stampCode: `${currentStampCode}.${perforation.code}`
                    }])
                    return
                }
            }
            
            const newStampCode = `${currentStampCode}.${perforation.code}`
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
            
            // Always go directly to stamp details - additional categories will be handled within the stamp details modal
            const newStampCode = `${currentStampCode}.${itemType.code}`
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

        setModalStack(prev => [...prev, {
            type: 'stampDetails',
            title: `${stamp.name}`,
            data: { stamp, selectedAdditionalCategories: currentSelectedCategories },
            stampCode: baseStampCode ? `${baseStampCode}.${stamp.catalogNumber}` : (stamp.stampCode || ''),
            selectedAdditionalCategories: currentSelectedCategories
        }])
    }

    // Additional Category Handlers
    const handleAdditionalCategoryClick = async (categoryType: string, currentStampCode: string) => {
        setLoadingModalContent(true);
        try {
            const currentModal = modalStack[modalStack.length - 1];
            const baseStampCode = currentModal?.stampCode; // Get the full stamp code from the current modal

            const { countryCode, actualSeriesName, year, currencyCode, denominationValue, colorCode, paperCode, watermarkCode, perforationCode, itemTypeCode } = parseStampCode(baseStampCode || '')

            // Get all stamps matching the path
            const allStamps = getStampDetails(stamps, countryCode, actualSeriesName, year, currencyCode, denominationValue, colorCode, paperCode, watermarkCode, perforationCode, itemTypeCode)
            
            // Filter stamps by category type
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

            // Group the filtered stamps by their specific category values
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
                        stampImageUrl: stamp.stampImageUrl || '/images/stamps/no-image-available.png'
                    })
                }
            })

            // Get current modal to track selected categories
            const currentSelectedCategories = currentModal?.selectedAdditionalCategories || []

            // Pin the current stamp for comparison if it's not already pinned and we have stamp data
            if (!pinnedStamp && currentModal?.data?.stamp) {
                setPinnedStamp(currentModal.data.stamp)
                setIsPinnedMinimized(false)
            }

            setModalStack(prev => [...prev, {
                type: categoryType as ModalType,
                title: `${categoryType.charAt(0).toUpperCase() + categoryType.slice(1)} Categories`,
                data: { categoryType, categories, stampCode: baseStampCode }, // Pass baseStampCode here
                stampCode: baseStampCode || '',
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

            // Get all stamps matching the path and specific category
            const allStamps = getStampDetails(stamps, countryCode, actualSeriesName, year, currencyCode, denominationValue, colorCode, paperCode, watermarkCode, perforationCode, itemTypeCode)
            
            // Filter stamps by the specific category option
            const filteredStamps = allStamps.filter(stamp => {
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
            })

            // Get current modal to propagate selected categories
            const currentModal = modalStack[modalStack.length - 1]
            const currentSelectedCategories = currentModal?.selectedAdditionalCategories || []

            // Always go to stamp details for additional category options
                setModalStack(prev => [...prev, {
                    type: 'stampDetails',
                    title: `${category.name} - Stamp Details`,
                    data: {
                        stamps: filteredStamps.map(convertApiStampToStampData),
                        categoryFilter: category,
                        baseStampCode: currentStampCode,
                        selectedAdditionalCategories: currentSelectedCategories,
                        // showAsIndividualCards: true
                    },
                    stampCode: `${currentStampCode}.${category.code}`,
                    selectedAdditionalCategories: currentSelectedCategories,
                }])
        } finally {
            setLoadingModalContent(false);
        }
    }

    // Filtering now handled inside CountryCatalogContent

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
                {/* Header Skeleton */}
                <header className="relative overflow-hidden">
                    <div className="relative h-[200px] sm:h-[300px] md:h-[350px] bg-gray-900 flex items-center justify-center">
                        <Skeleton className="absolute inset-0 w-full h-full" />
                        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center w-full">
                            <div className="max-w-3xl w-full">
                                <Skeleton className="h-12 w-3/4 mb-4" />
                                <Skeleton className="h-6 w-full mb-8" />
                                <Skeleton className="h-14 w-full max-w-xl mb-8 rounded-full" />
                                <div className="flex items-center space-x-4">
                                    <Skeleton className="h-10 w-32 rounded-full" />
                                    <Skeleton className="h-10 w-32 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/90 backdrop-blur border-b border-gray-200 dark:bg-gray-900/90 dark:border-gray-700">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex items-center justify-between h-16">
                                <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto pb-2 no-scrollbar w-full">
                                    <Skeleton className="h-8 w-32 rounded-md" />
                                    <Skeleton className="h-8 w-32 rounded-md" />
                                    <Skeleton className="h-8 w-32 rounded-md" />
                                </nav>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Skeleton */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                    <div className="text-center mb-8 md:mb-12">
                        <Skeleton className="h-10 w-1/2 mx-auto mb-4" />
                        <Skeleton className="h-6 w-3/4 mx-auto" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Card key={i} className="w-full rounded-2xl overflow-hidden shadow-lg">
                                <div className="relative h-64 overflow-hidden rounded-t-2xl bg-gray-200 dark:bg-gray-700">
                                    <Skeleton className="h-full w-full" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                                    <div className="absolute top-4 left-4 flex items-center space-x-2">
                                        <Skeleton className="h-8 w-12 rounded-full" /> {/* Flag placeholder */}
                                        <Skeleton className="h-6 w-24 rounded-full" /> {/* Stamp count badge */}
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4 space-y-2">
                                        <Skeleton className="h-8 w-3/4 mb-2" /> {/* Country name */}
                                        <Skeleton className="h-5 w-full" /> {/* Description */}
                                        <div className="flex justify-between items-center">
                                            <Skeleton className="h-4 w-24" /> {/* Dates */}
                                            <Skeleton className="h-4 w-32" /> {/* Approved Collection badge */}
                                        </div>
                                    </div>
                                </div>
                                <CardContent className="p-6 space-y-4">
                                    <Skeleton className="h-16 w-full mb-4" /> {/* Historical note */}
                                    <div className="flex justify-between items-center">
                                        <Skeleton className="h-10 w-32 rounded-full" /> {/* Browse Catalog button */}
                                        <div className="flex space-x-2">
                                            <Skeleton className="h-6 w-6 rounded-full" /> {/* Bookmark icon */}
                                            <Skeleton className="h-6 w-6 rounded-full" /> {/* Telescope icon */}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
                <div className="text-center space-y-6 max-w-md mx-auto">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto dark:bg-red-900">
                        <AlertCircle className="w-10 h-10 text-red-500 dark:text-red-400" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Catalog Unavailable</h2>
                        <p className="text-gray-600 dark:text-gray-300">{error}</p>
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
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
            {/* Premium Header */}
            <header className="relative overflow-hidden">
                {/* Hero Section */}
                <div className="relative h-[200px] sm:h-[300px] md:h-[350px] bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
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
                        <div className="max-w-3xl">
                            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-3 leading-tight">
                                <span className="bg-gradient-to-r from-amber-300 to-orange-500 bg-clip-text text-transparent">Stamps</span> of Approval
                            </h1>

                            <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-6 max-w-2xl drop-shadow-lg leading-relaxed">
                                Discover exceptional stamps that have earned collector approval through decades of
                                careful curation. Each specimen represents the finest in philatelic excellence.
                            </p>

                            {modalStack.length > 0 && (
                                <div className="flex items-center space-x-4">
                                    <Button variant="outline" onClick={closeModal} className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm">
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Previous Level
                                    </Button>
                                    <Button variant="outline" onClick={closeAllModals} className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm">
                                        <Home className="w-4 h-4 mr-2" />
                                        Start Over
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Navigation Bar */}
                <div className="bg-white/90 backdrop-blur border-b border-gray-200 dark:bg-gray-900/90 dark:border-gray-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {isMobile && (
                                <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="sm:hidden">
                                            <LayoutGrid className="h-6 w-6" />
                                            <span className="sr-only">Toggle Navigation</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="fixed -translate-x-9 w-screen rounded-none bg-white dark:bg-gray-900 p-4 shadow-lg animate-in fade-in-0 slide-in-from-top-2 duration-300 ease-out-sine data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=closed]:duration-300 data-[state=closed]:ease-in-sine">
                                        <div className="grid grid-cols-2 gap-4">
                                            <DropdownMenuItem
                                                onClick={(e) => {
                                                    setActiveSection('countries');
                                                    router.push(`?tab=countries`, { scroll: false });
                                                    const yOffset = -64;
                                                    const y = (e.target as HTMLElement).getBoundingClientRect().top + window.scrollY + yOffset;
                                                    window.scrollTo({ top: y, behavior: 'smooth' });
                                                    setIsDropdownOpen(false);
                                                }}
                                                className={cn(
                                                    "flex flex-col items-center justify-center h-24 text-center cursor-pointer",
                                                    activeSection === 'countries'
                                                        ? "bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-amber-400 dark:text-gray-900 dark:hover:bg-amber-500"
                                                        : "bg-secondary text-secondary-foreground hover:bg-secondary/90 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                                                )}
                                            >
                                                <Globe className="h-6 w-6 mb-2" />
                                                Country Catalogs
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={(e) => {
                                                    setActiveSection('visual');
                                                    router.push(`?tab=visual`, { scroll: false });
                                                    const yOffset = -64;
                                                    const y = (e.target as HTMLElement).getBoundingClientRect().top + window.scrollY + yOffset;
                                                    window.scrollTo({ top: y, behavior: 'smooth' });
                                                    setIsDropdownOpen(false);
                                                }}
                                                className={cn(
                                                    "flex flex-col items-center justify-center h-24 text-center cursor-pointer",
                                                    activeSection === 'visual'
                                                        ? "bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-amber-400 dark:text-gray-900 dark:hover:bg-amber-500"
                                                        : "bg-secondary text-secondary-foreground hover:bg-secondary/90 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                                                )}
                                            >
                                                <Eye className="h-6 w-6 mb-2" />
                                                Visual Catalog
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={(e) => {
                                                    setActiveSection('list');
                                                    router.push(`?tab=list`, { scroll: false });
                                                    const yOffset = -64;
                                                    const y = (e.target as HTMLElement).getBoundingClientRect().top + window.scrollY + yOffset;
                                                    window.scrollTo({ top: y, behavior: 'smooth' });
                                                    setIsDropdownOpen(false);
                                                }}
                                                className={cn(
                                                    "flex flex-col items-center justify-center h-24 text-center cursor-pointer",
                                                    activeSection === 'list'
                                                        ? "bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-amber-400 dark:text-gray-900 dark:hover:bg-amber-500"
                                                        : "bg-secondary text-secondary-foreground hover:bg-secondary/90 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                                                )}
                                            >
                                                <Archive className="h-6 w-6 mb-2" />
                                                List Catalog
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={(e) => {
                                                    setActiveSection('investigate');
                                                    router.push(`?tab=investigate`, { scroll: false });
                                                    const yOffset = -64;
                                                    const y = (e.target as HTMLElement).getBoundingClientRect().top + window.scrollY + yOffset;
                                                    window.scrollTo({ top: y, behavior: 'smooth' });
                                                    setIsDropdownOpen(false);
                                                }}
                                                className={cn(
                                                    "flex flex-col items-center justify-center h-24 text-center cursor-pointer",
                                                    activeSection === 'investigate'
                                                        ? "bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-amber-400 dark:text-gray-900 dark:hover:bg-amber-500"
                                                        : "bg-secondary text-secondary-foreground hover:bg-secondary/90 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                                                )}
                                            >
                                                <Eye className="h-6 w-6 mb-2" />
                                                Investigate Search
                                            </DropdownMenuItem>
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                            <nav className="hidden sm:flex flex-1 space-x-4 sm:space-x-8 overflow-x-auto pb-2 no-scrollbar">
                                <button
                                    onClick={(ele) => {
                                        setActiveSection('countries');
                                        router.push(`?tab=countries`, { scroll: false });
                                        const yOffset = -64;
                                        const y = (ele?.target as HTMLElement)?.getBoundingClientRect().top + window.scrollY + yOffset;
                                        window.scrollTo({ top: y, behavior: 'smooth' });
                                    }}
                                    className={cn(
                                        "py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                                        activeSection === 'countries'
                                            ? "border-primary text-primary dark:border-amber-400 dark:text-amber-400"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500"
                                    )}
                                >
                                    Country Catalogs
                                </button>
                                <button
                                    onClick={(ele) => {
                                        setActiveSection('visual');
                                        router.push(`?tab=visual`, { scroll: false });
                                        const yOffset = -64;
                                        const y = (ele?.target as HTMLElement)?.getBoundingClientRect().top + window.scrollY + yOffset;
                                        window.scrollTo({ top: y, behavior: 'smooth' });
                                    }}
                                    className={cn(
                                        "py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                                        activeSection === 'visual'
                                            ? "border-primary text-primary dark:border-amber-400 dark:text-amber-400"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    )}
                                >
                                    Visual Catalog
                                </button>
                                <button
                                    onClick={(ele) => {
                                        setActiveSection('list');
                                        router.push(`?tab=list`, { scroll: false });
                                        const yOffset = -64;
                                        const y = (ele?.target as HTMLElement)?.getBoundingClientRect().top + window.scrollY + yOffset;
                                        window.scrollTo({ top: y, behavior: 'smooth' });
                                    }}
                                    className={cn(
                                        "py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                                        activeSection === 'list'
                                            ? "border-primary text-primary dark:border-amber-400 dark:text-amber-400"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    )}
                                >
                                    List Catalog
                                </button>
                                <button
                                    onClick={(ele) => {
                                        setActiveSection('investigate');
                                        router.push(`?tab=investigate`, { scroll: false });
                                        const yOffset = -64;
                                        const y = (ele?.target as HTMLElement)?.getBoundingClientRect().top + window.scrollY + yOffset;
                                        window.scrollTo({ top: y, behavior: 'smooth' });
                                    }}
                                    className={cn(
                                        "py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                                        activeSection === 'investigate'
                                            ? "border-primary text-primary dark:border-amber-400 dark:text-amber-400"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500"
                                    )}
                                >
                                    Investigate Search
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
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
                                <LoadingStamps
                                    count={12}
                                    type={activeSection === 'list' ? 'list' : activeSection === 'investigate' ? 'grid' : 'groups'}
                                />
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
                                <LoadingStamps
                                    count={8}
                                    type={activeSection === 'list' ? 'list' : activeSection === 'investigate' ? 'grid' : 'groups'}
                                />
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
                <div className="fixed inset-0 z-50 grid place-items-center p-4">
                    <div className="relative w-full max-w-7xl h-[95vh] max-h-[95vh] overflow-y-auto bg-gradient-to-br from-orange-50 to-white dark:from-gray-900 dark:to-gray-950 border-0 shadow-2xl rounded-lg">
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
                                            {decodeURIComponent(modalStack[modalStack.length - 1].stampCode)}
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
                                    onAdditionalCategoryClick={handleAdditionalCategoryClick}
                                    onAdditionalCategoryOptionClick={handleAdditionalCategoryOptionClick}
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
