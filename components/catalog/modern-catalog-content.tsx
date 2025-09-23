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

    const [modalStack, setModalStack] = useState<ModalStackItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { activeSection } = useSidebarContext()

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
                    <CountryCatalogContent />
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
                                    <CountryCatalogContent />
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
                                    <CountryCatalogContent />
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
                                    <CountryCatalogContent />
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
