import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AlertCircle, Award, BookOpen, Calendar, ChevronRight, Clock, Coins, ExternalLink, FileText, Gem, Globe, Palette, Package, Quote, Star, Stamp, Zap, Menu, Layers, Share2 } from "lucide-react"
import { AdditionalCategoryOption, ColorOption, CurrencyOption, DenominationOption, ItemTypeOption, ModalStackItem, PaperOption, PerforationOption, StampData, StampGroupOption, WatermarkOption, YearOption, ParsedStampDetails } from "@/types/catalog"
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ModalContentProps {
    modalItem: ModalStackItem
    onStampGroupClick: (group: StampGroupOption, stampCode: string) => void
    onYearClick: (year: YearOption, stampCode: string) => void
    onCurrencyClick: (currency: CurrencyOption, stampCode: string) => void
    onDenominationClick: (denomination: DenominationOption, stampCode: string) => void
    onColorClick: (color: ColorOption, stampCode: string) => void
    onPaperClick: (paper: PaperOption, stampCode: string) => void
    onWatermarkClick: (watermark: WatermarkOption, stampCode: string) => void
    onPerforationClick: (perforation: PerforationOption, stampCode: string) => void
    onItemTypeClick: (itemType: ItemTypeOption, stampCode: string) => void
    onStampDetailClick: (stamp: StampData) => void
    onAdditionalCategoryClick: (categoryType: string, currentStampCode: string) => void
    onAdditionalCategoryOptionClick: (category: AdditionalCategoryOption, categoryType: string, currentStampCode: string) => void
    isLoading: boolean;
}

export default function ModalContent({
    modalItem,
    onStampGroupClick,
    onYearClick,
    onCurrencyClick,
    onDenominationClick,
    onColorClick,
    onPaperClick,
    onWatermarkClick,
    onPerforationClick,
    onItemTypeClick,
    onStampDetailClick,
    onAdditionalCategoryClick,
    onAdditionalCategoryOptionClick,
    isLoading
}: ModalContentProps) {
    const { type, data, stampCode } = modalItem

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
            const countryData = data as { country: any, stampGroups: StampGroupOption[] };
            return (
                <div className="space-y-6 md:space-y-8">
                    {/* Hero Section */}
                    <div className="text-center max-w-4xl mx-auto px-4">
                        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                            {countryData.country.historicalNote}
                        </p>
                    </div>

                    {/* Featured Series */}
                    <div className="mb-6 md:mb-8">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-6">Premium Series</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {countryData.stampGroups.filter((group: StampGroupOption) => group.featured).map((group: StampGroupOption) => (
                                <div
                                    key={group.id}
                                    className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                                    onClick={() => onStampGroupClick(group, stampCode)}
                                >
                                    <div className="relative h-40 md:h-48 overflow-hidden">
                                        <Image
                                            src={group.stampImageUrl}
                                            alt={group.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <h4 className="font-bold text-white text-base md:text-lg mb-1">{group.name}</h4>
                                            <p className="text-gray-200 text-xs md:text-sm">{group.period}</p>
                                        </div>
                                    </div>
                                    <div className="p-4 md:p-6">
                                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{group.description}</p>
                                        <div className="flex items-center justify-between">
                                            <Badge variant="outline" className="text-primary border-primary/30 dark:text-amber-300 dark:border-amber-600">
                                                {group.totalStamps} stamps
                                            </Badge>
                                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* All Series Grid */}
                    <div>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-6">Complete Catalog</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                            {countryData.stampGroups.map((group: StampGroupOption) => (
                                <div
                                    key={group.id}
                                    className="group cursor-pointer bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all duration-200 p-3 md:p-4 border border-gray-100 dark:border-gray-700 hover:border-primary/30 dark:hover:border-amber-600"
                                    onClick={() => onStampGroupClick(group, stampCode)}
                                >
                                    <div className="flex items-start space-x-3">
                                        <Image
                                            src={group.stampImageUrl}
                                            alt={group.name}
                                            width={40}
                                            height={50}
                                            className="rounded border"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate group-hover:text-primary transition-colors">
                                                {group.name}
                                            </h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{group.catalogNumber}</p>
                                            <Badge variant="secondary" className="mt-2 text-xs">
                                                {group.totalStamps}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )

        case 'stampGroup':
            const stampGroupData = data as { group: any, years: YearOption[] };
            return (
                <div className="space-y-6 md:space-y-8">
                    <div className="text-center max-w-3xl mx-auto px-4">
                        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
                            Explore the timeline of this distinguished series, spanning decades of approved philatelic excellence.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                        {stampGroupData.years.map((year: YearOption) => (
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

                    {/* Featured Denominations */}
                    <div className="mb-6 md:mb-8">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-6">Most Sought After</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            {currencyData.denominations.filter((denom: DenominationOption) => denom.featured).map((denomination: DenominationOption) => (
                                <div
                                    key={denomination.value}
                                    className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                                    onClick={() => onDenominationClick(denomination, stampCode)}
                                >
                                    <div className="relative h-32 md:h-40 overflow-hidden">
                                        <Image
                                            src={denomination.stampImageUrl}
                                            alt={denomination.displayName}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <h4 className="text-xl md:text-2xl font-bold text-white">{denomination.displayName}</h4>
                                        </div>
                                    </div>
                                    <div className="p-4 md:p-6">
                                        <Badge variant="outline" className="text-blue-600 border-blue-300 dark:text-blue-400 dark:border-blue-600">
                                            {denomination.totalStamps} approved variants
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
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
                                        src={denomination.stampImageUrl}
                                        alt={denomination.displayName}
                                        fill
                                        className="object-cover rounded border"
                                        sizes="64px"
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
                                <div className="relative h-28 md:h-32 flex items-center justify-center" style={{ backgroundColor: color.hexColor }}>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                    <h3 className="relative text-xl md:text-2xl font-bold text-white drop-shadow-lg">{color.name}</h3>
                                </div>

                                <div className="p-4 md:p-6">
                                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 leading-relaxed">{color.description}</p>

                                    <div className="flex items-center justify-between mb-3">
                                        <Badge variant="outline" style={{ borderColor: color.hexColor, color: color.hexColor }}>
                                            {color.totalStamps} approved
                                        </Badge>

                                        {color.popularity && (
                                            <div className="flex items-center space-x-1">
                                                {Array.from({ length: 5 }, (_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-3 h-3 ${i < Math.floor((color.popularity || 0) / 2) ? 'text-primary fill-current' : 'text-gray-300'}`}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-right">
                                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors inline" />
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
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
                                                src={paper.stampImageUrl}
                                                alt={paper.name}
                                                fill
                                                className="object-cover rounded border shadow-sm"
                                                sizes="80px"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                                {paper.name}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 leading-relaxed">{paper.description}</p>

                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">Texture:</span>
                                                    <Badge variant="outline" className="text-orange-600 border-orange-300 dark:text-orange-400 dark:border-orange-600">
                                                        {paper.texture}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">Count:</span>
                                                    <span className="text-sm font-medium">{paper.totalStamps} approved</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {paper.technicalNote && (
                                        <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-700 rounded-lg p-3 mb-4">
                                            <p className="text-orange-800 dark:text-orange-300 text-sm">{paper.technicalNote}</p>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">Premium Quality</Badge>
                                        <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                                    </div>
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
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Pattern: {watermark.pattern}</p>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">{watermark.description}</p>

                                    {watermark.historicalInfo && (
                                        <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-700 rounded-lg p-4 mb-4">
                                            <h4 className="font-medium text-purple-900 dark:text-purple-200 mb-2">Authentication History</h4>
                                            <p className="text-purple-800 dark:text-purple-300 text-sm">{watermark.historicalInfo}</p>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline" className="text-purple-600 border-purple-300 dark:text-purple-400 dark:border-purple-600">
                                            {watermark.totalStamps} authenticated
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
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 font-mono">{perforation.measurement}</p>

                                    {perforation.technicalDetail && (
                                        <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3 mb-4">
                                            <p className="text-yellow-800 dark:text-yellow-300 text-xs">{perforation.technicalDetail}</p>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Badge variant="outline" className="text-yellow-600 border-yellow-300 dark:text-yellow-400 dark:border-yellow-600">
                                            {perforation.totalStamps} approved
                                        </Badge>
                                        {perforation.style && (
                                            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs block">
                                                {perforation.style}
                                            </Badge>
                                        )}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                        {perforationData.itemTypes.map((itemType: ItemTypeOption) => (
                            <div
                                key={itemType.code}
                                className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-teal-200 dark:hover:border-teal-600"
                                onClick={() => onItemTypeClick(itemType, stampCode)}
                            >
                                <div className="p-4 md:p-6">
                                    <div className="flex items-start space-x-4 mb-4">
                                        <div className="relative w-16 h-20 md:w-20 md:h-24 flex-shrink-0">
                                            <Image
                                                src={itemType.stampImageUrl}
                                                alt={itemType.name}
                                                fill
                                                className="object-cover rounded border shadow-sm"
                                                sizes="80px"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                                {itemType.name}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 leading-relaxed">{itemType.description}</p>

                                            <div className="flex items-center space-x-3">
                                                <Badge variant="outline" className="text-teal-600 border-teal-300 dark:text-teal-400 dark:border-teal-600">
                                                    {itemType.category}
                                                </Badge>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">{itemType.totalStamps} approved</span>
                                            </div>
                                        </div>
                                    </div>

                                    {itemType.collectorsNote && (
                                        <div className="bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-700 rounded-lg p-4 mb-4">
                                            <h4 className="font-medium text-teal-900 dark:text-teal-200 mb-2">Collector Approval</h4>
                                            <p className="text-teal-800 dark:text-teal-300 text-sm">{itemType.collectorsNote}</p>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                                            View Collection
                                            <ChevronRight className="w-4 h-4 ml-2" />
                                        </Button>
                                        <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-teal-500 transition-colors" />
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
                            SOA-{stampCode}
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
                                        src={stamp.stampImageUrl}
                                        alt={stamp.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                                                src={stampItem.stampImageUrl}
                                                alt={stampItem.name}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                                                src={stampItem.stampImageUrl}
                                                alt={stampItem.name}
                                                width={80}
                                                height={100}
                                                className="rounded border shadow-sm"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors">
                                                    {stampItem.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">{stampItem.catalogNumber}</p>
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

            const details = stamp.stampDetailsJson ? JSON.parse(stamp.stampDetailsJson) : {}

            return (
                <article className="max-w-6xl mx-auto px-2">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-12">
                        {/* Stamp Image */}
                        <div className="space-y-4">
                            <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-900 rounded-xl overflow-hidden shadow-xl">
                                <Image
                                    src={stamp.stampImageUrl}
                                    alt={stamp.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                            </div>

                            <div className="text-center space-y-2">
                                <Badge className="bg-primary/10 text-primary text-sm px-2 py-0.5 dark:bg-primary/20 dark:text-amber-300">
                                    {stamp.catalogNumber}
                                </Badge>
                                <div className="flex flex-wrap items-center justify-center gap-2">
                                    <Button variant="outline" size="sm" className="text-xs h-8">
                                        <BookOpen className="w-3 h-3 mr-1" />
                                        View Authentication
                                    </Button>
                                    <Button variant="outline" size="sm" className="text-xs h-8">
                                        <Share2 className="w-3 h-3 mr-1" />
                                        Share
                                    </Button>
                                </div>
                            </div>

                            {/* Additional Categories */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-4">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                                    <Layers className="w-4 h-4 mr-2 text-primary" />
                                    Explore Additional Categories
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-4 text-xs leading-relaxed">
                                    Discover specialized varieties and collecting opportunities that have earned collector approval across different categories.
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {!selectedAdditionalCategories.includes('postalHistory') && (
                                        <button
                                            className="group p-3 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 dark:from-blue-950 dark:to-indigo-900 dark:hover:from-blue-900 dark:hover:to-indigo-800 rounded-lg border border-blue-200 hover:border-blue-300 dark:border-blue-700 dark:hover:border-blue-600 text-left transition-all duration-200 hover:shadow-sm"
                                            onClick={() => onAdditionalCategoryClick('postalHistory', stamp.stampCode ?? '')}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <Globe className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                                                <div>
                                                    <div className="font-semibold text-blue-900 dark:text-blue-100 text-xs">Postal History</div>
                                                    <div className="text-blue-700 dark:text-blue-300 text-xs">Covers & Usage</div>
                                                </div>
                                            </div>
                                        </button>
                                    )}

                                    {!selectedAdditionalCategories.includes('postmarks') && (
                                        <button
                                            className="group p-3 bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 dark:from-purple-950 dark:to-pink-900 dark:hover:from-purple-900 dark:hover:to-pink-800 rounded-lg border border-purple-200 hover:border-purple-300 dark:border-purple-700 dark:hover:border-purple-600 text-left transition-all duration-200 hover:shadow-sm"
                                            onClick={() => onAdditionalCategoryClick('postmarks', stamp.stampCode ?? '')}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <Clock className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                                                <div>
                                                    <div className="font-semibold text-purple-900 dark:text-purple-100 text-xs">Postmarks</div>
                                                    <div className="text-purple-700 dark:text-purple-300 text-xs">Cancellations</div>
                                                </div>
                                            </div>
                                        </button>
                                    )}

                                    {!selectedAdditionalCategories.includes('proofs') && (
                                        <button
                                            className="group p-3 bg-gradient-to-br from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 dark:from-emerald-950 dark:to-teal-900 dark:hover:from-emerald-900 dark:hover:to-teal-800 rounded-lg border border-emerald-200 hover:border-emerald-300 dark:border-emerald-700 dark:hover:border-emerald-600 text-left transition-all duration-200 hover:shadow-sm"
                                            onClick={() => onAdditionalCategoryClick('proofs', stamp.stampCode ?? '')}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <FileText className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                                                <div>
                                                    <div className="font-semibold text-emerald-900 dark:text-emerald-100 text-xs">Proofs</div>
                                                    <div className="text-emerald-700 dark:text-emerald-300 text-xs">Printer Proofs</div>
                                                </div>
                                            </div>
                                        </button>
                                    )}

                                    {!selectedAdditionalCategories.includes('essays') && (
                                        <button
                                            className="group p-3 bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 dark:from-amber-950 dark:to-orange-900 dark:hover:from-amber-900 dark:hover:to-orange-800 rounded-lg border border-amber-200 hover:border-amber-300 dark:border-amber-700 dark:hover:border-amber-600 text-left transition-all duration-200 hover:shadow-sm"
                                            onClick={() => onAdditionalCategoryClick('essays', stamp.stampCode ?? '')}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <Palette className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
                                                <div>
                                                    <div className="font-semibold text-amber-900 dark:text-amber-100 text-xs">Essays</div>
                                                    <div className="text-amber-700 dark:text-amber-300 text-xs">Design Studies</div>
                                                </div>
                                            </div>
                                        </button>
                                    )}

                                    {!selectedAdditionalCategories.includes('onPiece') && (
                                        <button
                                            className="group p-3 bg-gradient-to-br from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100 dark:from-gray-950 dark:to-slate-900 dark:hover:from-gray-900 dark:hover:to-slate-800 rounded-lg border border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 text-left transition-all duration-200 hover:shadow-sm"
                                            onClick={() => onAdditionalCategoryClick('onPiece', stamp.stampCode ?? '')}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <Package className="w-4 h-4 text-gray-600 group-hover:scale-110 transition-transform" />
                                                <div>
                                                    <div className="font-semibold text-gray-900 dark:text-gray-100 text-xs">On Piece</div>
                                                    <div className="text-gray-700 dark:text-gray-300 text-xs">Fragments</div>
                                                </div>
                                            </div>
                                        </button>
                                    )}

                                    {!selectedAdditionalCategories.includes('errors') && (
                                        <button
                                            className="group p-3 bg-gradient-to-br from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 dark:from-red-950 dark:to-rose-900 dark:hover:from-red-900 dark:hover:to-rose-800 rounded-lg border border-red-200 hover:border-red-300 dark:border-red-700 dark:hover:border-red-600 text-left transition-all duration-200 hover:shadow-sm"
                                            onClick={() => onAdditionalCategoryClick('errors', stamp.stampCode ?? '')}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <AlertCircle className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform" />
                                                <div>
                                                    <div className="font-semibold text-red-900 dark:text-red-100 text-xs">Errors</div>
                                                    <div className="text-red-700 dark:text-red-300 text-xs">Varieties</div>
                                                </div>
                                            </div>
                                        </button>
                                    )}

                                    {!selectedAdditionalCategories.includes('other') && (
                                        <button
                                            className="group p-3 bg-gradient-to-br from-violet-50 to-indigo-50 hover:from-violet-100 hover:to-indigo-100 dark:from-violet-950 dark:to-indigo-900 dark:hover:from-violet-900 dark:hover:to-indigo-800 rounded-lg border border-violet-200 hover:border-violet-300 dark:border-violet-700 dark:hover:border-violet-600 text-left transition-all duration-200 hover:shadow-sm"
                                            onClick={() => onAdditionalCategoryClick('other', stamp.stampCode ?? '')}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <Menu className="w-4 h-4 text-violet-600 group-hover:scale-110 transition-transform" />
                                                <div>
                                                    <div className="font-semibold text-violet-900 dark:text-violet-100 text-xs">Other</div>
                                                    <div className="text-violet-700 dark:text-violet-300 text-xs">Specialists</div>
                                                </div>
                                            </div>
                                        </button>
                                    )}
                                </div>
                            </div>
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
                                            <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">{stamp.color}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">Paper Type</dt>
                                            <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">{stamp.paperType}</dd>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div>
                                            <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">Perforation</dt>
                                            <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">{(JSON.parse(stamp.stampDetailsJson) as ParsedStampDetails).perforation}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">Watermark</dt>
                                            <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">{(JSON.parse(stamp.stampDetailsJson) as ParsedStampDetails).watermark}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">Printing Method</dt>
                                            <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">{(JSON.parse(stamp.stampDetailsJson) as ParsedStampDetails).printingMethod}</dd>
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
                                        <div className="text-xl md:text-3xl font-bold text-green-600 dark:text-green-400 mb-0.5">{(JSON.parse(stamp.stampDetailsJson) as ParsedStampDetails).catalogPrice}</div>
                                        <div className="text-xs text-green-700 dark:text-green-300">Catalog Price</div>
                                    </div>
                                    <div>
                                        <div className="text-xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-0.5">{(JSON.parse(stamp.stampDetailsJson) as ParsedStampDetails).currentMarketValue}</div>
                                        <div className="text-xs text-blue-700 dark:text-blue-300">Current Market</div>
                                    </div>
                                    <div>
                                        <Badge
                                            className={cn(
                                                "text-sm px-2 py-0.5",
                                                (JSON.parse(stamp.stampDetailsJson) as ParsedStampDetails).rarityRating === 'Collector Approved' && "bg-primary/10 text-primary",
                                                (JSON.parse(stamp.stampDetailsJson) as ParsedStampDetails).rarityRating === 'Rare' && "bg-orange-100 text-orange-800",
                                                (JSON.parse(stamp.stampDetailsJson) as ParsedStampDetails).rarityRating === 'Uncommon' && "bg-yellow-100 text-yellow-800",
                                                (JSON.parse(stamp.stampDetailsJson) as ParsedStampDetails).rarityRating === 'Common' && "bg-green-100 text-green-800"
                                            )}
                                        >
                                            {(JSON.parse(stamp.stampDetailsJson) as ParsedStampDetails).rarityRating}
                                        </Badge>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Status</div>
                                    </div>
                                </div>
                            </section>

                            {/* Catalog Code */}
                            <section className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4">
                                <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Stamps of Approval ID</h2>
                                <code className="bg-white dark:bg-gray-800 border border-primary/20 dark:border-primary/30 rounded-lg p-3 text-xs font-mono block break-all text-primary dark:text-amber-300">
                                    SOA-{stamp.stampCode}
                                </code>
                                <p className="text-primary/70 dark:text-amber-400 text-xs mt-2">
                                    This unique identifier confirms authentication and approval in our premium catalog system.
                                </p>
                            </section>
                        </div>
                    </div>
                </article>
            )

        case 'postalHistory':
        case 'postmarks':
        case 'proofs':
        case 'essays':
        case 'onPiece':
        case 'errors':
        case 'other':
            const categoryData = data as { categoryType: string, categories: AdditionalCategoryOption[], stampCode: string };
            return (
                <div className="space-y-6 md:space-y-8">
                    <div className="text-center mb-6 md:mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                            {categoryData.categoryType.charAt(0).toUpperCase() + categoryData.categoryType.slice(1)} Collection
                        </h2>
                        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Specialized {categoryData.categoryType} varieties that have earned collector approval through expert authentication and grading.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {categoryData.categories?.map((category: AdditionalCategoryOption) => (
                            <div
                                key={category.code}
                                className="group cursor-pointer bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-primary/30 dark:hover:border-amber-600"
                                onClick={() => onAdditionalCategoryOptionClick(category, type, stampCode ?? '')}
                            >
                                <div className="p-4 md:p-6">
                                    <div className="flex items-start space-x-4 mb-4">
                                        <div className="relative w-16 h-20 md:w-20 md:h-24 flex-shrink-0">
                                            <Image
                                                src={category.stampImageUrl}
                                                alt={category.name}
                                                fill
                                                className="object-cover rounded border shadow-sm"
                                                sizes="80px"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary transition-colors">
                                                {category.name}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 leading-relaxed">{category.description}</p>

                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500 dark:text-gray-400">{category.totalStamps} approved specimens</span>
                                                <div className="flex items-center space-x-2">
                                                    {category.priceMultiplier && (
                                                        <Badge variant="outline" className="text-primary border-primary/30 dark:text-amber-300 dark:border-amber-600">
                                                            {category.priceMultiplier}x value
                                                        </Badge>
                                                    )}
                                                    {category.rarity && (
                                                        <Badge
                                                            className={cn(
                                                                "text-xs",
                                                                category.rarity === 'unique' && "bg-purple-100 text-purple-800",
                                                                category.rarity === 'extremely rare' && "bg-red-100 text-red-800",
                                                                category.rarity === 'very rare' && "bg-orange-100 text-orange-800",
                                                                category.rarity === 'rare' && "bg-yellow-100 text-yellow-800",
                                                                category.rarity === 'uncommon' && "bg-blue-100 text-blue-800",
                                                                category.rarity === 'common' && "bg-green-100 text-green-800"
                                                            )}
                                                        >
                                                            {category.rarity}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                                            View Collection
                                            <ChevronRight className="w-4 h-4 ml-2" />
                                        </Button>
                                        <Star className="w-4 h-4 md:w-5 md:h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )

        default:
            return <div className="text-center text-gray-500 py-12">Content type not found</div>
    }
} 