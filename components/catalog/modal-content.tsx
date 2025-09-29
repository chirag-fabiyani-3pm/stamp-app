import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AlertCircle, Award, BookOpen, Calendar, ChevronRight, Clock, Coins, FileText, Gem, Globe, Palette, Package, Quote, Star, Zap, Menu, Layers, Loader2, Maximize2, X } from "lucide-react"
import { AdditionalCategoryOption, ColorOption, CurrencyOption, DenominationOption, ItemTypeOption, ModalStackItem, PaperOption, PerforationOption, StampData, WatermarkOption, YearOption, ParsedStampDetails, SeriesOption } from "@/types/catalog"
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import ReactCountryFlag from "react-country-flag"
import { useState, useMemo, useEffect, useRef, useCallback } from "react"

const formatStampCode = (stampCode: string | null | undefined): string => {
    if (!stampCode || typeof stampCode !== 'string') return ''
    // Assuming the watermark is the 8th part (index 7) of the stampCode if it's null
    const parts = stampCode.split('|||')
    if (parts.length > 7 && (parts[7] === 'null' || parts[7] == null || parts[7] === '')) {
        parts[7] = 'NoWmk'
    }
    return parts.join('.')
}

interface ModalContentProps {
    modalItem: ModalStackItem
    onSeriesClick: (series: SeriesOption, stampCode: string) => void
    onYearClick: (year: YearOption, stampCode: string) => void
    onCurrencyClick: (currency: CurrencyOption, stampCode: string) => void
    onDenominationClick: (denomination: DenominationOption, stampCode: string) => void
    onColorClick: (color: ColorOption, stampCode: string) => void
    onPaperClick: (paper: PaperOption, stampCode: string) => void
    onWatermarkClick: (watermark: WatermarkOption, stampCode: string) => void
    onPerforationClick: (perforation: PerforationOption, stampCode: string) => void
    onItemTypeClick: (itemType: ItemTypeOption, stampCode: string) => void
    onStampDetailClick: (stamp: StampData) => void
    isLoading: boolean;
}

export default function ModalContent({
    modalItem,
    onSeriesClick,
    onYearClick,
    onCurrencyClick,
    onDenominationClick,
    onColorClick,
    onPaperClick,
    onWatermarkClick,
    onPerforationClick,
    onItemTypeClick,
    onStampDetailClick,
    isLoading
}: ModalContentProps) {
    const { type, data, stampCode } = modalItem
    const decodedStampCode = decodeURIComponent(stampCode);

    // Pagination state for country series
    const [displayedCount, setDisplayedCount] = useState(20)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const loaderRef = useRef<HTMLDivElement>(null)

    // Enlarged image state
    const [enlargedImage, setEnlargedImage] = useState<string | null>(null)
    const countryData = data as { country: any, series: SeriesOption[] };
    const displayedSeries = useMemo(() => {
        return countryData?.series ? countryData?.series?.slice?.(0, displayedCount) : []
    }, [countryData?.series, displayedCount])

    // Pagination logic
    const loadMore = useCallback(() => {
        if (isLoadingMore) return
        setIsLoadingMore(true)
        // Simulate loading delay for better UX
        setTimeout(() => {
            setDisplayedCount(prev => prev + 20)
            setIsLoadingMore(false)
        }, 300)
    }, [isLoadingMore])

    // Intersection Observer for infinite scroll
    useEffect(() => {
        let observer: any, currentLoader: any;
        if (type === 'country') {

            observer = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && !isLoadingMore) {
                        loadMore()
                    }
                },
                { threshold: 1.0 }
            )

            currentLoader = loaderRef.current
            if (currentLoader) {
                observer.observe(currentLoader)
            }
        }

        return () => {
            if (currentLoader) {
                observer?.unobserve(currentLoader)
            }
        }
    }, [type, isLoadingMore, loadMore])

    if (isLoading) {
        return (
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
        );
    }

    switch (type) {
        case 'country':
            const hasMore = displayedCount < countryData.series.length

            return (
                <div className="space-y-6 md:space-y-8">
                    {/* Hero Section */}
                    <div className="text-center max-w-4xl mx-auto px-4">
                        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                            {countryData.country.historicalNote}
                        </p>
                    </div>

                    {/* All Series Grid */}
                    <div>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-6">Series</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                            {displayedSeries.map((series: SeriesOption) => (
                                <div
                                    key={series.id}
                                    className="group cursor-pointer bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all duration-200 p-3 md:p-4 border border-gray-100 dark:border-gray-700 hover:border-primary/30 dark:hover:border-amber-600 flex flex-col justify-center"
                                    onClick={() => onSeriesClick(series, stampCode)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <Image
                                            src={series.featuredStampUrl || '/images/stamps/no-image-available.png'}
                                            alt={series.name}
                                            width={40}
                                            height={50}
                                            className="rounded border"
                                            onError={(e) => {
                                                const target = e.currentTarget;
                                                if (target.src !== '/images/stamps/no-image-available.png') {
                                                    target.src = '/images/stamps/no-image-available.png';
                                                }
                                            }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <span className="flex items-center justify-between">
                                                <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate group-hover:text-primary transition-colors">
                                                    {series.name}
                                                </h4>
                                                <Badge variant="secondary" className="text-xs">
                                                    {series.totalStamps}
                                                </Badge>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Infinite scroll loader */}
                        {hasMore && (
                            <div
                                ref={loaderRef}
                                className="flex justify-center items-center py-8"
                            >
                                <div className="flex items-center space-x-2 text-muted-foreground">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span className="text-sm">Loading more series...</span>
                                </div>
                            </div>
                        )}

                        {/* No more results indicator */}
                        {!hasMore && displayedSeries.length > 20 && (
                            <div className="text-center py-8">
                                <p className="text-sm text-muted-foreground">
                                    Showing all {displayedSeries.length} series
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )

        case 'series':
            const seriesData = data as { series: any, years: YearOption[] };
            return (
                <div className="space-y-6 md:space-y-8">
                    <div className="text-center max-w-3xl mx-auto px-4">
                        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
                            Explore the timeline of this distinguished series, spanning decades of approved philatelic excellence.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                        {seriesData.years.map((year: YearOption) => (
                            <div
                                key={year.year}
                                className="group cursor-pointer text-center"
                                onClick={() => onYearClick(year, stampCode)}
                            >
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 md:p-6 border border-gray-100 dark:border-gray-700 hover:border-primary/30 dark:hover:border-amber-600">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                                        <Calendar className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{year.year}</h3>
                                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mb-3">{year.totalStamps} stamps</p>
                                    {year.highlightedSeries && (
                                        <Badge className="bg-primary/10 text-primary text-xs">
                                            {year.highlightedSeries}
                                        </Badge>
                                    )}
                                    {year.historicalEvents && (
                                        <div className="mt-2">
                                            {year.historicalEvents.map((event, idx) => (
                                                <Badge key={idx} variant="outline" className="text-xs mb-1 block">
                                                    {event}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )

        case 'year':
            const yearData = data as { year: any, currencies: CurrencyOption[] };
            return (
                <div className="space-y-6 md:space-y-8">
                    <div className="text-center max-w-3xl mx-auto px-4">
                        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
                            Discover the currencies that shaped this era of approved postal communication.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {yearData.currencies.map((currency: CurrencyOption) => (
                            <div
                                key={currency.code}
                                className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-600"
                                onClick={() => onCurrencyClick(currency, stampCode)}
                            >
                                <div className="p-4 md:p-6">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="w-14 h-14 md:w-16 md:h-16 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Coins className="w-7 h-7 md:w-8 md:h-8 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">{currency.name}</h3>
                                            <p className="text-xl md:text-2xl font-mono font-bold text-green-600 dark:text-green-400">{currency.symbol}</p>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">{currency.description}</p>

                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline" className="text-green-600 border-green-300 dark:text-green-400 dark:border-green-600">
                                            {currency.totalStamps} denominations
                                        </Badge>
                                        <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-green-500 transition-colors" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )

        case 'currency':
            const currencyData = data as { currency: any, denominations: DenominationOption[] };
            return (
                <div className="space-y-6 md:space-y-8">
                    <div className="text-center max-w-3xl mx-auto px-4">
                        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
                            Each denomination represents approved value standards and economic significance of its era.
                        </p>
                    </div>

                    {/* All Denominations */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                        {currencyData.denominations.map((denomination: DenominationOption) => (
                            <div
                                key={denomination.value}
                                className="group cursor-pointer bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all duration-200 p-3 md:p-4 text-center border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600"
                                onClick={() => onDenominationClick(denomination, stampCode)}
                            >
                                <div className="relative w-14 h-16 md:w-16 md:h-20 mx-auto mb-3">
                                    <Image
                                        src={denomination.featuredStampUrl || '/images/stamps/no-image-available.png'}
                                        alt={denomination.displayName}
                                        fill
                                        className="object-cover rounded border"
                                        sizes="64px"
                                        onError={(e) => {
                                            const target = e.currentTarget;
                                            if (target.src !== '/images/stamps/no-image-available.png') {
                                                target.src = '/images/stamps/no-image-available.png';
                                            }
                                        }}
                                    />
                                </div>
                                <h4 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {denomination.displayName}
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{denomination.totalStamps} stamps</p>
                            </div>
                        ))}
                    </div>
                </div>
            )

        case 'denomination':
            const denominationData = data as { denomination: any, colors: ColorOption[] };
            return (
                <div className="space-y-6 md:space-y-8">
                    <div className="text-center max-w-3xl mx-auto px-4">
                        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
                            The artistry of color reflects both aesthetic excellence and the technical mastery approved by collectors worldwide.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {denominationData.colors.map((color: ColorOption) => (
                            <div
                                key={color.code}
                                className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                                onClick={() => onColorClick(color, stampCode)}
                            >
                                <div
                                    className="relative h-28 md:h-32 flex items-center justify-center"
                                    style={color.hex === '#XXXXXX' ? {} : { backgroundColor: color.hex }}
                                >
                                    {color.hex === '#XXXXXX' && (
                                        <div className="absolute inset-0 bg-gradient-to-br from-red-400 via-orange-400 to-purple-400"></div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                    <h3 className="relative text-xl md:text-2xl font-bold text-white drop-shadow-lg">{color.name}</h3>
                                </div>

                                <div className="p-4 md:p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <Badge variant="outline" style={{ borderColor: color.hex, color: color.hex }}>
                                            {color.totalStamps} stamps
                                        </Badge>
                                        <div className="text-right">
                                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors inline" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )

        case 'color':
            const colorData = data as { color: any, papers: PaperOption[] };
            return (
                <div className="space-y-6 md:space-y-8">
                    <div className="text-center max-w-3xl mx-auto px-4">
                        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
                            Paper quality and composition play crucial roles in both appearance preservation and collector approval.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                        {colorData.papers.map((paper: PaperOption) => (
                            <div
                                key={paper.code}
                                className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-600"
                                onClick={() => onPaperClick(paper, stampCode)}
                            >
                                <div className="p-4 md:p-6">
                                    <div className="flex items-start space-x-4 mb-4">
                                        <div className="relative w-16 h-20 md:w-20 md:h-24 flex-shrink-0">
                                            <Image
                                                src={paper.featuredStampUrl || '/images/stamps/no-image-available.png'}
                                                alt={paper.name}
                                                fill
                                                className="object-cover rounded border shadow-sm"
                                                sizes="80px"
                                                onError={(e) => {
                                                    const target = e.currentTarget;
                                                    if (target.src !== '/images/stamps/no-image-available.png') {
                                                        target.src = '/images/stamps/no-image-available.png';
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                                {paper.name}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 leading-relaxed">{paper.description}</p>

                                            <div className="space-y-2">
                                                <div className="flex items-center gap-4 justify-between">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">Texture:</span>
                                                    <Badge variant="outline" className="text-orange-600 border-orange-300 dark:text-orange-400 dark:border-orange-600 flex-shrink-0">
                                                        {paper.texture !== 'N/A' ? paper.texture : 'Color texture not specified'}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-4 justify-between">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">Count:</span>
                                                    <span className="text-sm font-medium">{paper.totalStamps} stamps</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {paper.technicalNote && (
                                        <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-700 rounded-lg p-3 mb-4">
                                            <p className="text-orange-800 dark:text-orange-300 text-sm">{paper.technicalNote}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )

        case 'paper':
            const paperData = data as { paper: any, watermarks: WatermarkOption[] };
            return (
                <div className="space-y-6 md:space-y-8">
                    <div className="text-center max-w-3xl mx-auto px-4">
                        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
                            Watermarks are the authentic signatures that earn stamps their seal of approval and collector trust.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                        {paperData.watermarks.map((watermark: WatermarkOption) => (
                            <div
                                key={watermark.code}
                                className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-600"
                                onClick={() => onWatermarkClick(watermark, stampCode)}
                            >
                                <div className="p-4 md:p-6">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Gem className="w-7 h-7 md:w-8 md:h-8 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                                {watermark.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Position: {(watermark as any).position}</p>
                                        </div>
                                    </div>

                                    {watermark.historicalInfo && (
                                        <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-700 rounded-lg p-4 mb-4">
                                            <h4 className="font-medium text-purple-900 dark:text-purple-200 mb-2">Authentication History</h4>
                                            <p className="text-purple-800 dark:text-purple-300 text-sm">{watermark.historicalInfo}</p>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline" className="text-purple-600 border-purple-300 dark:text-purple-400 dark:border-purple-600">
                                            {watermark.totalStamps} stamps
                                        </Badge>
                                        <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )

        case 'watermark':
            const watermarkData = data as { watermark: any, perforations: PerforationOption[] };
            return (
                <div className="space-y-6 md:space-y-8">
                    <div className="text-center max-w-3xl mx-auto px-4">
                        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
                            Perforation patterns demonstrate the technical precision that earns stamps professional approval.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {watermarkData.perforations.map((perforation: PerforationOption) => (
                            <div
                                key={perforation.code}
                                className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center border border-gray-100 dark:border-gray-700 hover:border-yellow-200 dark:hover:border-yellow-600"
                                onClick={() => onPerforationClick(perforation, stampCode)}
                            >
                                <div className="p-4 md:p-6">
                                    <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                                        <Zap className="w-7 h-7 md:w-8 md:h-8 text-white" />
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                                        {perforation.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 font-mono">{perforation.measurement === '0' ? 'No perforation' : perforation.measurement}</p>

                                    <div className="space-y-2">
                                        <Badge variant="outline" className="text-yellow-600 border-yellow-300 dark:text-yellow-400 dark:border-yellow-600">
                                            {perforation.totalStamps} stamps
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )

        case 'perforation':
            const perforationData = data as { perforation: any, itemTypes: ItemTypeOption[] };
            return (
                <div className="space-y-6 md:space-y-8">
                    <div className="text-center max-w-3xl mx-auto px-4">
                        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
                            Different condition categories showcase the standards that earn stamps collector approval and premium status.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                        {perforationData.itemTypes.map((itemType: ItemTypeOption) => (
                            <div
                                key={itemType.code}
                                className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-teal-200 dark:hover:border-teal-600"
                                onClick={() => onItemTypeClick(itemType, stampCode)}
                            >
                                <div className="p-4 md:p-6 flex justify-between">
                                    <div className="flex items-start space-x-4">
                                        <div className="relative w-16 h-20 md:w-20 md:h-24 flex-shrink-0">
                                            <Image
                                                src={itemType.featuredStampUrl || '/images/stamps/no-image-available.png'}
                                                alt={itemType.name}
                                                fill
                                                className="object-cover rounded border shadow-sm"
                                                sizes="80px"
                                                onError={(e) => {
                                                    const target = e.currentTarget;
                                                    if (target.src !== '/images/stamps/no-image-available.png') {
                                                        target.src = '/images/stamps/no-image-available.png';
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="flex flex-col justify-between">
                                            <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                                {itemType.name}
                                            </h3>

                                            <div className="flex items-center space-x-3">
                                                <span className="text-sm text-gray-500 dark:text-gray-400">{itemType.totalStamps} stamps</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-end">
                                        <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                                            View Collection
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )

        case 'itemType':
            const itemTypeData = data as { itemType: any, stamps: StampData[], showAsIndividualCards?: boolean, selectedAdditionalCategories?: string[] };
            const stampsToRender = itemTypeData.stamps;

            return (
                <div className="space-y-6 md:space-y-8">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-900 border border-green-200 dark:border-green-700 rounded-xl p-4 text-center">
                        <div className="flex items-center justify-center space-x-2 mb-3">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-green-500 rounded-xl flex items-center justify-center">
                                <Award className="w-6 h-6 md:w-8 md:h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg lg:text-xl font-bold text-green-900 dark:text-green-100">Stamps of Approval</h3>
                                <p className="text-green-700 dark:text-green-300 text-sm">Your curated collection of authenticated specimens</p>
                            </div>
                        </div>
                        <code className="bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-lg px-2 py-0.5 md:px-4 md:py-2 text-green-800 dark:text-green-200 font-mono text-xs break-all">
                            SOA-{formatStampCode(decodeURIComponent(stampCode))}
                        </code>
                        <p className="text-green-700 dark:text-green-300 text-xs mt-2">
                            This unique identifier confirms authentication and approval in our premium catalog system.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                        {stampsToRender.map((stamp: StampData) => (
                            <article
                                key={stamp.id}
                                className="group cursor-pointer bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-primary/30 dark:hover:border-amber-600"
                                onClick={() => onStampDetailClick(stamp)}
                            >
                                <div className="relative h-56 md:h-64 overflow-hidden">
                                    <Image
                                        src={stamp.stampImageUrl || '/images/stamps/no-image-available.png'}
                                        alt={stamp.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        onError={(e) => {
                                            const target = e.currentTarget;
                                            if (target.src !== '/images/stamps/no-image-available.png') {
                                                target.src = '/images/stamps/no-image-available.png';
                                            }
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                                        <Badge className="bg-white/20 backdrop-blur text-white border-white/30">
                                            {stamp.catalogNumber}
                                        </Badge>
                                        <Badge className={cn(
                                            "backdrop-blur border-white/30",
                                            (JSON.parse(stamp.stampDetailsJson) as ParsedStampDetails).rarityRating === 'Collector Approved' && "bg-primary/80 text-white",
                                            (JSON.parse(stamp.stampDetailsJson) as ParsedStampDetails).rarityRating === 'Rare' && "bg-orange-500/80 text-white",
                                            (JSON.parse(stamp.stampDetailsJson) as ParsedStampDetails).rarityRating === 'Uncommon' && "bg-yellow-500/80 text-white",
                                            (JSON.parse(stamp.stampDetailsJson) as ParsedStampDetails).rarityRating === 'Common' && "bg-green-500/80 text-white"
                                        )}>
                                            {(JSON.parse(stamp.stampDetailsJson) as ParsedStampDetails).rarityRating}
                                        </Badge>
                                    </div>

                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h3 className="text-lg md:text-xl font-bold text-white mb-2">{stamp.name}</h3>
                                        <p className="text-gray-200 text-sm">{stamp.seriesName}</p>
                                    </div>
                                </div>

                                <div className="p-4 md:p-6">
                                    {(JSON.parse(stamp.stampDetailsJson)).story && (
                                        <blockquote className="text-gray-600 dark:text-gray-300 italic mb-4 text-sm leading-relaxed relative">
                                            <Quote className="w-3 h-3 text-primary absolute -top-1 -left-1" />
                                            <span className="ml-2">{(JSON.parse(stamp.stampDetailsJson)).story}</span>
                                        </blockquote>
                                    )}

                                    <div className="grid grid-cols-3 gap-3 md:gap-4 text-center mb-4">
                                        <div>
                                            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{stamp.denominationValue}{stamp.denominationSymbol}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Value</div>
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{stamp.issueYear}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Year</div>
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-green-600 dark:text-green-400">${(JSON.parse(stamp.stampDetailsJson) as ParsedStampDetails).currentMarketValue}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Market</div>
                                        </div>
                                    </div>

                                    <Button className="w-full bg-primary hover:bg-primary/90 text-white group-hover:shadow-lg transition-all">
                                        View Authentication
                                        <BookOpen className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            )

        case 'stampDetails':
            const stampDetailsData = data as { stamp?: StampData, stamps?: StampData[], showAsIndividualCards?: boolean, selectedAdditionalCategories?: string[] };
            const { stamp, stamps, showAsIndividualCards, selectedAdditionalCategories: dataSelectedCategories } = stampDetailsData;
            const selectedAdditionalCategories = modalItem.selectedAdditionalCategories || dataSelectedCategories || []

            // Handle multiple stamps case (when coming from additional categories)
            if (stamps && stamps.length > 0) {
                if (showAsIndividualCards) {
                    return (
                        <div className="space-y-6 md:space-y-8">
                            <div className="text-center mb-6 md:mb-8">
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Select Your Approved Specimen</h2>
                                <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                                    Choose from these exceptional specimens that have earned collector approval through expert authentication and grading.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                {stamps.map((stampItem: StampData) => (
                                    <article
                                        key={stampItem.id}
                                        className="group cursor-pointer bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-primary/30 dark:hover:border-amber-600"
                                        onClick={() => onStampDetailClick(stampItem)}
                                    >
                                        <div className="relative h-56 md:h-64 overflow-hidden">
                                            <Image
                                                src={stampItem.stampImageUrl || '/images/stamps/no-image-available.png'}
                                                alt={stampItem.name}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                onError={(e) => {
                                                    const target = e.currentTarget;
                                                    if (target.src !== '/images/stamps/no-image-available.png') {
                                                        target.src = '/images/stamps/no-image-available.png';
                                                    }
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                                            <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                                                <Badge className="bg-white/20 backdrop-blur text-white border-white/30">
                                                    {stampItem.catalogNumber}
                                                </Badge>
                                                <Badge className={cn(
                                                    "backdrop-blur border-white/30",
                                                    (JSON.parse(stampItem.stampDetailsJson) as ParsedStampDetails).rarityRating === 'Collector Approved' && "bg-primary/80 text-white",
                                                    (JSON.parse(stampItem.stampDetailsJson) as ParsedStampDetails).rarityRating === 'Rare' && "bg-orange-500/80 text-white",
                                                    (JSON.parse(stampItem.stampDetailsJson) as ParsedStampDetails).rarityRating === 'Uncommon' && "bg-yellow-500/80 text-white",
                                                    (JSON.parse(stampItem.stampDetailsJson) as ParsedStampDetails).rarityRating === 'Common' && "bg-green-500/80 text-white"
                                                )}>
                                                    {(JSON.parse(stampItem.stampDetailsJson) as ParsedStampDetails).rarityRating}
                                                </Badge>
                                            </div>

                                            <div className="absolute bottom-4 left-4 right-4">
                                                <h3 className="text-lg md:text-xl font-bold text-white mb-2">{stampItem.name}</h3>
                                                <p className="text-gray-200 text-sm">{stampItem.seriesName}</p>
                                            </div>
                                        </div>

                                        <div className="p-4 md:p-6">
                                            {(JSON.parse(stampItem.stampDetailsJson)).story && (
                                                <blockquote className="text-gray-600 dark:text-gray-300 italic mb-4 text-sm leading-relaxed relative">
                                                    <Quote className="w-3 h-3 text-primary absolute -top-1 -left-1" />
                                                    <span className="ml-2">{(JSON.parse(stampItem.stampDetailsJson)).story}</span>
                                                </blockquote>
                                            )}

                                            <div className="grid grid-cols-3 gap-3 md:gap-4 text-center mb-4">
                                                <div>
                                                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{stampItem.denominationValue}{stampItem.denominationSymbol}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">Value</div>
                                                </div>
                                                <div>
                                                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{stampItem.issueYear}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">Year</div>
                                                </div>
                                                <div>
                                                    <div className="text-lg font-bold text-green-600 dark:text-green-400">${(JSON.parse(stampItem.stampDetailsJson) as ParsedStampDetails).currentMarketValue}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">Market</div>
                                                </div>
                                            </div>

                                            <Button className="w-full bg-primary hover:bg-primary/90 text-white group-hover:shadow-lg transition-all">
                                                View Authentication
                                                <BookOpen className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    )
                } else {
                    // Regular multiple stamps list view
                    return (
                        <div className="space-y-6">
                            <div className="text-center mb-6 md:mb-8">
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Approved Collection</h2>
                                <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                                    Multiple specimens that have earned collector approval in this category.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                {stamps.map((stampItem: StampData) => (
                                    <div
                                        key={stampItem.id}
                                        className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 md:p-6 border border-gray-100 dark:border-gray-700 hover:border-primary/30 dark:hover:border-amber-600"
                                        onClick={() => onStampDetailClick(stampItem)}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <Image
                                                src={stampItem.stampImageUrl || '/images/stamps/no-image-available.png'}
                                                alt={stampItem.name}
                                                width={80}
                                                height={100}
                                                className="rounded border shadow-sm"
                                                onError={(e) => {
                                                    const target = e.currentTarget;
                                                    if (target.src !== '/images/stamps/no-image-available.png') {
                                                        target.src = '/images/stamps/no-image-available.png';
                                                    }
                                                }}
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors">
                                                    {stampItem.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">{stampItem.categoryCode}</p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-600 dark:text-gray-300">
                                                        {stampItem.denominationValue}{stampItem.denominationSymbol} - {stampItem.color}
                                                    </span>
                                                    <Badge variant="outline" className="text-primary border-primary/30 dark:text-amber-300 dark:border-amber-600">
                                                        View Details
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }
            }

            // Handle single stamp case
            if (!stamp) {
                return (
                    <div className="text-center py-12">
                        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Stamp Details Available</h3>
                        <p className="text-gray-600">Unable to load stamp information at this time.</p>
                    </div>
                )
            }

            return (
                <>
                <article className="max-w-6xl mx-auto px-2 pb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-12">
                        {/* Stamp Image */}
                        <div className="space-y-4">
                            <div className="mx-auto relative w-full md:w-80 h-96 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-900 rounded-xl overflow-hidden shadow-xl group">
                                <Image
                                    src={stamp.stampImageUrl || '/images/stamps/no-image-available.png'}
                                    alt={stamp.name}
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    onError={(e) => {
                                        const target = e.currentTarget;
                                        if (target.src !== '/images/stamps/no-image-available.png') {
                                            target.src = '/images/stamps/no-image-available.png';
                                        }
                                    }}
                                />
                                <button
                                    onClick={() => {
                                        console.log(stamp.stampImageUrl)
                                        setEnlargedImage(stamp.stampImageUrl || '/images/stamps/no-image-available.png')
                                    }}
                                    className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100 z-50"
                                    title="View larger image"
                                >
                                    <Maximize2 className="w-4 h-4 text-gray-700 dark:text-gray-900" />
                                </button>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                            </div>

                            <div className="text-center space-y-2">
                                <Badge className="bg-primary/10 text-primary text-sm px-2 py-0.5 dark:bg-primary/20 dark:text-amber-300">
                                    {stamp.categoryCode}
                                </Badge>
                            </div>

                            {/* Stamp Instances */}
                            {stamp.instances && stamp.instances.length > 0 ? (
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-4">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                                        <Layers className="w-4 h-4 mr-2 text-primary" />
                                        Stamp Instances
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-xs leading-relaxed">
                                        Discover the different varieties and instances of this stamp with their catalog values.
                                    </p>

                                    <div className="border rounded-lg overflow-hidden dark:border-gray-700">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-gray-50 dark:bg-gray-800 hidden sm:table-row">
                                                    <TableHead className="text-left py-3 px-4 font-semibold bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">Instance</TableHead>
                                                    <TableHead className="text-center py-3 px-4 font-semibold bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">Mint</TableHead>
                                                    <TableHead className="text-center py-3 px-4 font-semibold bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">Finest Used</TableHead>
                                                    <TableHead className="text-center py-3 px-4 font-semibold bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">Used</TableHead>
                                                </TableRow>
                                                <TableRow className="bg-gray-50 dark:bg-gray-800 sm:hidden">
                                                    <TableHead className="text-gray-700 dark:text-gray-300 w-1/2">Instance</TableHead>
                                                    <TableHead className="text-center text-gray-700 dark:text-gray-300 w-1/2">Values</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {stamp.instances.map((instance: any) => (
                                                    <TableRow
                                                        key={instance.id}
                                                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                                    >
                                                        <TableCell className="py-3 px-4 font-medium text-black dark:text-gray-100 hidden sm:table-cell">
                                                            <div className="flex flex-col gap-1">
                                                                <span className="font-medium">{(instance as any).name}{(instance as any).catalogNumber && (instance as any).catalogNumber !== '-' ? ` (${(instance as any).catalogNumber})` : ''}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-3 px-4 text-center hidden sm:table-cell">
                                                            <span className="bg-green-100 text-green-800 px-2 py-1 text-xs font-medium rounded dark:bg-green-700 dark:text-green-200">
                                                                {instance.mintValue ? new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(instance.mintValue) : '-'}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="py-3 px-4 text-center hidden sm:table-cell">
                                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium rounded dark:bg-blue-700 dark:text-blue-200">
                                                                {instance.finestUsedValue ? new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(instance.finestUsedValue) : '-'}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="py-3 px-4 text-center hidden sm:table-cell">
                                                            <span className="bg-orange-100 text-orange-800 px-2 py-1 text-xs font-medium rounded dark:bg-orange-700 dark:text-orange-200">
                                                                {instance.usedValue ? new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(instance.usedValue) : '-'}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="py-3 px-4 sm:hidden w-1/2">
                                                            <div className="flex flex-col gap-1">
                                                                <span className="font-medium text-black dark:text-gray-100 text-sm">{instance.code}</span>
                                                                <span className="text-gray-500 dark:text-gray-400 text-xs">{instance.description}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-3 px-4 sm:hidden w-1/2 text-right">
                                                            <div className="space-y-1">
                                                                <div className="text-xs">
                                                                    <span className="bg-green-100 text-green-800 px-2 py-1 text-xs font-medium rounded dark:bg-green-700 dark:text-green-200 block mb-1">
                                                                        Mint: {instance.mintValue ? new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(instance.mintValue) : '-'}
                                                                    </span>
                                                                </div>
                                                                <div className="text-xs">
                                                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium rounded dark:bg-blue-700 dark:text-blue-200 block mb-1">
                                                                        Finest Used: {instance.finestUsedValue ? new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(instance.finestUsedValue) : '-'}
                                                                    </span>
                                                                </div>
                                                                <div className="text-xs">
                                                                    <span className="bg-orange-100 text-orange-800 px-2 py-1 text-xs font-medium rounded dark:bg-orange-700 dark:text-orange-200 block">
                                                                        Used: {instance.usedValue ? new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(instance.usedValue) : '-'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-4">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                                        <Layers className="w-4 h-4 mr-2 text-primary" />
                                        Stamp Instances
                                    </h3>

                                    {/* Empty State */}
                                    <div className="flex flex-col items-center justify-center py-8 px-4">
                                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                                            <Package className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                        </div>
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No Instances Available</h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm text-center max-w-md leading-relaxed">
                                            This stamp doesn't have multiple instances or varieties catalogued. The main stamp information shows the primary catalog details.
                                        </p>
                                        <div className="mt-4 px-3 py-1.5 bg-gray-50 dark:bg-gray-700 rounded-full">
                                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                                Single Instance Stamp
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Authentication Details */}
                        <div className="space-y-4 md:space-y-8">
                            <header>
                                <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2 md:mb-4 leading-tight">{stamp.name}</h1>
                                <p className="text-base md:text-xl text-gray-600 dark:text-gray-300 mb-3 md:mb-6">{stamp.seriesName}</p>

                                <div className="flex flex-wrap gap-y-1 items-center space-x-2 md:space-x-6 text-xs text-gray-500 dark:text-gray-400 mb-4">
                                    <span className="flex items-center">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {stamp.issueYear}
                                    </span>
                                    <span className="flex items-center">
                                        <ReactCountryFlag countryCode={decodedStampCode?.split('|||')[0]} svg className="mr-1" />
                                        {stamp.country}
                                    </span>
                                    <span className="flex items-center">
                                        <Award className="w-3 h-3 mr-1 text-primary" />
                                        Approved
                                    </span>
                                </div>
                            </header>

                            {(JSON.parse(stamp.stampDetailsJson)).story && (
                                <div className="prose prose-sm max-w-none">
                                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{(JSON.parse(stamp.stampDetailsJson)).story}</p>
                                </div>
                            )}

                            {/* Authentication Specifications */}
                            <section className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                                <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                                    Authentication Details
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <div>
                                            <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">Denomination</dt>
                                            <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">{stamp.denominationValue}{stamp.denominationSymbol}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">Color</dt>
                                            <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">{stamp.color || 'Color Info Not Available'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">Paper Type</dt>
                                            <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">{stamp.paperType || 'Paper Type Info Not Available'}</dd>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div>
                                            <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">Perforation</dt>
                                            <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">{(JSON.parse(stamp.stampDetailsJson) as ParsedStampDetails).perforation || 'Perforation Info Not Available'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">Watermark</dt>
                                            <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">{(JSON.parse(stamp.stampDetailsJson) as ParsedStampDetails).watermark || 'Watermark Info Not Available'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">Printing Method</dt>
                                            <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">{(JSON.parse(stamp.stampDetailsJson) as ParsedStampDetails).printingMethod || 'Printing Method Info Not Available'}</dd>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Market Valuation */}
                            <section className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-900 rounded-xl p-4">
                                <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                                    Market Valuation
                                </h2>

                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div>
                                        <div className="text-xl md:text-3xl font-bold text-green-600 dark:text-green-400 mb-0.5">{stamp.mintValue ? new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(stamp.mintValue) : '-'}</div>
                                        <div className="text-xs text-green-700 dark:text-green-300">Mint Value</div>
                                    </div>
                                    <div>
                                        <div className="text-xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-0.5">{stamp.finestUsedValue ? new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(stamp.finestUsedValue) : '-'}</div>
                                        <div className="text-xs text-blue-700 dark:text-blue-300">Finest Used Value</div>
                                    </div>
                                    <div>
                                        <div className="text-xl md:text-3xl font-bold text-orange-600 dark:text-orange-400 mb-0.5">{stamp.usedValue ? new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(stamp.usedValue) : '-'}</div>
                                        <div className="text-xs text-orange-800 dark:text-orang-300">Used Value</div>
                                    </div>
                                </div>
                            </section>

                            {/* Catalog Code */}
                            <section className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4">
                                <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Stamps of Approval ID</h2>
                                <code className="bg-white dark:bg-gray-800 border border-primary/20 dark:border-primary/30 rounded-lg p-3 text-xs font-mono block break-all text-primary dark:text-amber-300">
                                    SOA-{formatStampCode(decodeURIComponent(modalItem.stampCode))}
                                </code>
                                <p className="text-primary/70 dark:text-amber-400 text-xs mt-2">
                                    This unique identifier confirms authentication and approval in our premium catalog system.
                                </p>
                            </section>
                        </div>
                    </div>
                </article>
                {/* Enlarged Image Modal */}
                {enlargedImage && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                        <div className="max-w-4xl max-h-[90vh] w-full">
                            <div className="bg-white rounded-lg shadow-2xl relative">
                                <div className="border-b flex justify-end p-3 pr-5">
                                    <button
                                        onClick={() => setEnlargedImage(null)}
                                        className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors duration-200 z-10"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <Image
                                    src={enlargedImage}
                                    alt="Enlarged stamp"
                                    width={800}
                                    height={750}
                                    className="w-full h-auto max-h-[85vh] object-contain rounded-xl p-2 shadow-inner"
                                />
                            </div>
                        </div>
                    </div>
                )}
                </>
            )

        default:
            return <div className="text-center text-gray-500 py-12">Content type not found</div>
    }
} 
