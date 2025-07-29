"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Calendar, BookOpen, Archive, Eye, ChevronRight, ArrowLeft, Home, Sparkles, Coins, Palette, Grid, Filter, Share2, Layers, Globe, Star, Zap, Gem, Heart, Navigation, MapPin, Clock, DollarSign, FileText, Package, Menu, User, Settings, X, TrendingUp, AlertCircle, Play, Camera, Image as ImageIcon, Quote, Bookmark, BookmarkPlus, ExternalLink, Award, Telescope, Stamp } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { CountryOption, StampGroupOption, YearOption, CurrencyOption, DenominationOption, ColorOption, PaperOption, WatermarkOption, PerforationOption, ItemTypeOption, StampData, ModalType, ModalStackItem, FeaturedStory, AdditionalCategoryOption } from "@/types/catalog"
import { generateCountriesData, generateStampGroupsData, generateYearsData, generateCurrenciesData, generateDenominationsData, generateColorsData, generatePapersData, generateWatermarksData, generatePerforationsData, generateItemTypesData, generateStampDetails, generateAdditionalCategoriesData, generateStampsForAdditionalCategory, featuredStories } from "@/lib/data/catalog-data"
import PinnedStampCard from "@/components/catalog/pinned-stamp-card"
import ModalContent from "@/components/catalog/modal-content"
import { VisualCatalogContent } from "@/components/catalog/visual-catalog-content"
import { ListCatalogContent } from "@/components/catalog/list-catalog-content"
import { Skeleton } from "@/components/ui/skeleton";
import { CatalogContent } from "@/components/catalog/investigate-search/catalog-content";

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

    // Pinned stamp state for comparison
    const [pinnedStamp, setPinnedStamp] = useState<StampData | null>(null)
    const [isPinnedMinimized, setIsPinnedMinimized] = useState(false)

    // Data states
    const [countries, setCountries] = useState<CountryOption[]>([])

    // Initialize component
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoading(true)
                const countriesData = await generateCountriesData()
                setCountries(countriesData)
            } catch (err) {
                console.error('Error loading initial data:', err)
                setError('Failed to load catalog data')
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
            const stampGroups = await generateStampGroupsData(country.code)
            setModalStack([{
                type: 'country',
                title: `${country.name} Catalog`,
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
                title: `${group.name} Timeline`,
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
            const denominations = await generateDenominationsData(currentStampCode, currency.code)
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
            const colors = await generateColorsData(currentStampCode, denomination.value)
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
            const itemTypes = await generateItemTypesData(currentStampCode, perforation.code)
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
            const stamps = await generateStampDetails(currentStampCode, itemType.code)
            const newStampCode = `${currentStampCode}.${itemType.code}`
            setModalStack(prev => [...prev, {
                type: 'itemType',
                title: `Approved Collection`,
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
        // Get current modal to propagate selected categories
        const currentModal = modalStack[modalStack.length - 1]
        const currentSelectedCategories = currentModal?.selectedAdditionalCategories || []

        setModalStack(prev => [...prev, {
            type: 'stampDetails',
            title: `${stamp.name}`,
            data: { stamp, selectedAdditionalCategories: currentSelectedCategories },
            stampCode: stamp.stampCode || '', // Ensure stampCode is never undefined
            selectedAdditionalCategories: currentSelectedCategories
        }])
    }

    // Additional Category Handlers
    const handleAdditionalCategoryClick = async (categoryType: string, currentStampCode: string) => {
        setLoadingModalContent(true);
        try {
            const categories = await generateAdditionalCategoriesData(categoryType, currentStampCode)

            // Get current modal to track selected categories
            const currentModal = modalStack[modalStack.length - 1]
            const currentSelectedCategories = currentModal?.selectedAdditionalCategories || []

            // Pin the current stamp for comparison if it's not already pinned and we have stamp data
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
            // Generate stamps for the selected additional category
            const stamps = await generateStampsForAdditionalCategory(currentStampCode, categoryType, category.code)

            // Get current modal to propagate selected categories
            const currentModal = modalStack[modalStack.length - 1]
            const currentSelectedCategories = currentModal?.selectedAdditionalCategories || []

            if (stamps.length === 1) {
                // If only one stamp, go directly to stamp details
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
                // If multiple stamps, show them as individual stamp detail options
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
                    <div className="relative h-[400px] sm:h-[500px] md:h-[600px] bg-gray-900 flex items-center justify-center">
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
                        generateCountriesData().then(setCountries).catch(err => {
                            console.error('Error retrying data load:', err)
                            setError('Failed to reload catalog data')
                        }).finally(() => setLoading(false))
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
                <div className="relative h-[300px] sm:h-[400px] md:h-[500px] bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
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
                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                                <span className="bg-gradient-to-r from-amber-300 to-orange-500 bg-clip-text text-transparent">Stamps</span> of Approval
                            </h1>

                            <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-8 max-w-2xl drop-shadow-lg leading-relaxed">
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
                            <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto pb-2 no-scrollbar">
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

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                    {filteredCountries.map((country, index) => (
                                        <article
                                            key={country.code}
                                            className="group cursor-pointer"
                                            onClick={() => handleCountryClick(country)}
                                        >
                                            <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02] dark:bg-gray-800 dark:border-gray-700">
                                                <div className="relative h-64 overflow-hidden">
                                                    {country.featuredStampUrl && (
                                                        <Image
                                                            src={country.featuredStampUrl}
                                                            alt={`Premium stamps from ${country.name}`}
                                                            fill
                                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                            sizes="(max-width: 768px) 100vw, 50vw"
                                                        />
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                                                    <div className="absolute top-4 left-4">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-3xl">{country.flag}</span>
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
            <Dialog open={modalStack.length > 0} onOpenChange={(open) => !open && closeModal()}>
                <DialogContent className="max-w-7xl w-[95vw] h-[95vh] max-h-[95vh] overflow-y-auto bg-gradient-to-br from-orange-50 to-white dark:from-gray-900 dark:to-gray-950 border-0 shadow-2xl">
                    <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-4 md:pb-6 mb-4 md:mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <DialogTitle className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 md:mb-2">
                                    {modalStack[modalStack.length - 1]?.title}
                                </DialogTitle>
                                {modalStack.length > 0 && (
                                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span>Level {modalStack.length}</span>
                                        <span>•</span>
                                        <code className="bg-primary/10 dark:bg-primary/20 px-2 py-1 rounded font-mono text-xs text-primary dark:text-amber-300 break-all">
                                            {modalStack[modalStack.length - 1].stampCode}
                                        </code>

                                    </div>
                                )}
                            </div>
                            <Button variant="ghost" size="sm" onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                                <X className="w-5 h-5 md:w-6 md-6" />
                            </Button>
                        </div>
                    </DialogHeader>

                    <div>
                        {modalStack.length > 0 && (
                            <ModalContent
                                modalItem={modalStack[modalStack.length - 1]}
                                onStampGroupClick={handleStampGroupClick}
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
                </DialogContent>
            </Dialog>

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