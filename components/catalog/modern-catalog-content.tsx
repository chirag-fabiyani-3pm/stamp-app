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
        fetchProgress,
        loadingType
    } = useCatalogData()

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
