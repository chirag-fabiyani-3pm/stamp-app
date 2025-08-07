"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Search, Calendar, BookOpen, Archive, Eye, ChevronRight, ArrowLeft, Home, Sparkles, Coins, Palette, Grid, Filter, Share2, Layers, Globe, Star, Zap, Gem, Heart, Navigation, MapPin, Clock, DollarSign, FileText, Package, Menu, User, Settings, X, TrendingUp, AlertCircle, Play, Camera, Image as ImageIcon, Quote, Bookmark, BookmarkPlus, ExternalLink, Award, Telescope, Stamp, List, MenuSquare, PanelLeft, AlignJustify, GripVertical, PanelRightOpen, AlignLeft, GripHorizontal, MoreHorizontal, MoreVertical, EllipsisVertical, SlidersHorizontal, Rows2, Grid3x3, LayoutGrid } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { CountryOption, YearOption, CurrencyOption, DenominationOption, ColorOption, PaperOption, WatermarkOption, PerforationOption, ItemTypeOption, StampData, ModalType, ModalStackItem, FeaturedStory, AdditionalCategoryOption, SeriesOption } from "@/types/catalog"
import { 
    apiStampData, 
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
import PinnedStampCard from "@/components/catalog/pinned-stamp-card"
import ModalContent from "@/components/catalog/modal-content"
import { VisualCatalogContent } from "@/components/catalog/visual-catalog-content"
import { ListCatalogContent } from "@/components/catalog/list-catalog-content"
import { Skeleton } from "@/components/ui/skeleton";
import { CatalogContent } from "@/components/catalog/investigate-search/catalog-content";
import { useIsMobile } from "@/hooks/use-mobile";
import ReactCountryFlag from "react-country-flag";

export function ModernCatalogContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const mainContentRef = React.useRef<HTMLDivElement>(null);

    // Navigation state - updated to include new tabs
    const [modalStack, setModalStack] = useState<ModalStackItem[]>([])
    const [searchTerm, setSearchTerm] = useState("")
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

    // Data states - now using API data
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

    // Initialize component with API data
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoading(true)
                // Use our dummy API data for now
                const countriesData = groupStampsByCountry(apiStampData)
                setCountries(countriesData as CountryOption[])
            } catch (err) {
                console.error('Error loading initial data:', err)
                setError('Failed to load catalog data')
            } finally {
                setLoading(false)
            }
        }
        loadInitialData()
    }, [])

    // Navigation handlers updated to use API data grouping
    const handleCountryClick = async (country: CountryOption) => {
        setLoadingModalContent(true);
        try {
            const series = groupStampsBySeries(apiStampData, country.code)
            
            // Check if there are no series (broken hierarchy)
            if (series.length === 0) {
                // Get stamps without series for this country
                const stamps = getStampDetails(apiStampData, country.code)
                if (stamps.length > 0) {
                    // Go directly to stamp details
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
            const years = groupStampsByYear(apiStampData, currentStampCode, series.name)
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
            
            const currencies = groupStampsByCurrency(apiStampData, countryCode, actualSeriesName, year.year)
            
            // If no currencies available, show stamp details directly
            if (currencies.length === 0) {
                const stamps = getStampDetails(apiStampData, countryCode, actualSeriesName, year.year)
                if (stamps.length > 0) {
                    const convertedStamps = stamps.map(convertApiStampToStampData)
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
            
            const denominations = groupStampsByDenomination(apiStampData, countryCode, actualSeriesName, year, currency.code)
            
            // Check if there are no denominations (broken hierarchy)
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
            
            const colors = groupStampsByColor(apiStampData, countryCode, actualSeriesName, year, currencyCode, denomination.value)
            
            // If no colors available, show stamp details directly
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
            
            const papers = groupStampsByPaper(apiStampData, countryCode, actualSeriesName, year, currencyCode, denominationValue, color.code)
            
            // If no papers available, show stamp details directly
            if (papers.length === 0) {
                const stamps = getStampDetails(apiStampData, countryCode, actualSeriesName, year, currencyCode, denominationValue, color.code)
                if (stamps.length > 0) {
                    const convertedStamps = stamps.map(convertApiStampToStampData)
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
            
            const watermarks = groupStampsByWatermark(apiStampData, countryCode, actualSeriesName, year, currencyCode, denominationValue, colorCode, paper.code)
            
            // If no watermarks available, show stamp details directly
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
            
            const perforations = groupStampsByPerforation(apiStampData, countryCode, actualSeriesName, year, currencyCode, denominationValue, colorCode, paperCode, watermark.code)
            
            // If no perforations available, show stamp details directly
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
            
            const itemTypes = groupStampsByItemType(apiStampData, countryCode, actualSeriesName, year, currencyCode, denominationValue, colorCode, paperCode, watermarkCode, perforation.code)
            
            // If no item types available, show stamp details directly
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
            
            const stamps = getStampDetails(apiStampData, countryCode, actualSeriesName, year, currencyCode, denominationValue, colorCode, paperCode, watermarkCode, perforationCode, itemType.code)
            
            // Always go directly to stamp details - additional categories will be handled within the stamp details modal
            const newStampCode = `${currentStampCode}.${itemType.code}`
            setModalStack(prev => [...prev, {
                type: 'stampDetails',
                title: `Approved Collection`,
                data: { stamps: stamps.map(convertApiStampToStampData) },
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
            const allStamps = getStampDetails(apiStampData, countryCode, actualSeriesName, year, currencyCode, denominationValue, colorCode, paperCode, watermarkCode, perforationCode, itemTypeCode)
            
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
                        stampImageUrl: stamp.stampImageUrl || '/images/stamps/stamp.png'
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
            const allStamps = getStampDetails(apiStampData, countryCode, actualSeriesName, year, currencyCode, denominationValue, colorCode, paperCode, watermarkCode, perforationCode, itemTypeCode)
            
            // Filter stamps by the specific category option
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
            })

            // Get current modal to propagate selected categories
            const currentModal = modalStack[modalStack.length - 1]
            const currentSelectedCategories = currentModal?.selectedAdditionalCategories || []

            // Always go to stamp details for additional category options
                setModalStack(prev => [...prev, {
                    type: 'stampDetails',
                    title: `${category.name} - Stamp Details`,
                    data: {
                        stamps: stamps.map(convertApiStampToStampData),
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

    // Filter countries based on search term
    const filteredCountries = useMemo(() => {
        if (!searchTerm) return countries

        return countries.filter(country =>
            country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            country.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            country.code.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [searchTerm, countries])

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
                            // Use our dummy API data for now
                            const countriesData = groupStampsByCountry(apiStampData)
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
                                                <Telescope className="h-6 w-6 mb-2" />
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
                            <section>
                                <div className="text-center mb-8 md:mb-12">
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Explore by Country</h2>
                                    <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                                        Browse our premium catalog of stamps organized by country. Each collection features stamps that have earned collector approval through careful authentication and grading.
                                    </p>
                                </div>

                                <div className="relative mb-8">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                                    <Input
                                        type="text"
                                        placeholder="Search countries..."
                                        className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-primary dark:focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                    {filteredCountries.map((country, index) => (
                                        <article
                                            key={country.code}
                                            className="group cursor-pointer"
                                            onClick={() => handleCountryClick(country)}
                                        >
                                            <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02] dark:bg-gray-800 dark:border-gray-700">
                                                <div className="relative h-56 overflow-hidden">
                                                        <Image
                                                        src={country.featuredStampUrl || '/images/stamps/no-image-available.png'}
                                                            alt={`Premium stamps from ${country.name}`}
                                                            fill
                                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                            sizes="(max-width: 768px) 100vw, 50vw"
                                                        onError={(e) => {
                                                            const target = e.currentTarget;
                                                            if (target.src !== '/images/stamps/no-image-available.png') {
                                                                target.src = '/images/stamps/no-image-available.png';
                                                            }
                                                        }}
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                                                    <div className="absolute top-4 left-4">
                                                        <div className="flex items-center space-x-2">
                                                            <ReactCountryFlag countryCode={country.code} svg />
                                                            <Badge className="bg-white/20 backdrop-blur text-white border-white/30">
                                                                {country.totalStamps.toLocaleString()} stamps
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    <div className="absolute bottom-4 left-4 right-4">
                                                        <h3 className="text-2xl font-bold text-white mb-2">{country.name}</h3>
                                                        <p className="text-gray-200 text-sm mb-3">{country.description}</p>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-gray-300 text-sm">
                                                                {country.firstIssue} - {country.lastIssue}
                                                            </span>
                                                            <div className="flex items-center space-x-2">
                                                                <Award className="w-4 h-4 text-primary dark:text-amber-400" />
                                                                <span className="text-primary text-sm font-medium dark:text-amber-400">Approved Collection</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-6">
                                                    <blockquote className="text-gray-600 italic mb-4 relative dark:text-gray-300">
                                                        <Quote className="w-4 h-4 text-primary dark:text-amber-400 absolute -top-1 -left-1" />
                                                        <span className="ml-3">{country.historicalNote}</span>
                                                    </blockquote>

                                                    <div className="flex items-center justify-between">
                                                        <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 dark:border-amber-600 dark:text-amber-400 dark:hover:bg-amber-900">
                                                            Browse Catalog
                                                            <ChevronRight className="w-4 h-4 ml-2" />
                                                        </Button>
                                                        <div className="flex items-center space-x-1">
                                                            <BookmarkPlus className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity dark:text-gray-600 dark:group-hover:text-gray-400" />
                                                            <Telescope className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity dark:text-gray-600 dark:group-hover:text-gray-400" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
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
