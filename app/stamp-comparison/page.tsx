"use client"

import { Badge } from "@/components/ui/badge"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { ArrowLeft, Maximize2, Share2, X } from "lucide-react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useMemo, useState } from "react"
import ReactCountryFlag from "react-country-flag"

interface StampDetailData {
    id: string
    catalogExtractionProcessId: string
    similarityScore?: number
    stampId?: string
    isInstance?: boolean
    parentStampId?: string
    catalogNumber: string
    name: string
    description?: string
    country?: string
    countryName?: string
    seriesName?: string
    typeName?: string
    stampGroupName?: string
    currencySymbol?: string
    denominationValue?: string
    denominationSymbol?: string
    denominationDisplay?: string
    colorName?: string
    colorHex?: string
    watermarkCode?: string | null
    watermarkName?: string
    perforationName?: string
    perforationMeasurement?: string
    itemTypeName?: string
    paperName?: string
    issueDate?: string
    issueYear?: number
    printingMethod?: string
    stampImageUrl?: string
    stampImageHighRes?: string
    stampImageVariants?: string[]
    rarityRating?: string
    rarityScale?: string
    mintValue?: number
    usedValue?: number
    finestUsedValue?: number
    priceTrend?: string
    marketNotes?: string
    sizeWidth?: string
    sizeHeight?: string
    stampDetailsJson?: string
}

function StampComparisonContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [stamps, setStamps] = useState<StampDetailData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [lightboxStamp, setLightboxStamp] = useState<StampDetailData | null>(null)
    const [isLightboxOpen, setIsLightboxOpen] = useState(false)

    // Get stamp IDs from URL parameters
    const stampIds = useMemo(() => {
        const ids = searchParams.get('ids')?.split(',').filter(Boolean) || []
        console.log('🔍 Comparison page - Stamp IDs from URL:', ids)
        return ids
    }, [searchParams])

    useEffect(() => {
        const fetchStampDetails = async () => {
            console.log('🔍 Comparison page - Processing stamp IDs:', stampIds)

            if (stampIds.length === 0) {
                console.log('❌ No stamp IDs found in URL')
                setError('No stamps to compare')
                setLoading(false)
                return
            }

            if (stampIds.length > 3) {
                console.log('❌ Too many stamps to compare:', stampIds.length)
                setError('Cannot compare more than 3 stamps')
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                setError(null)

                // Get JWT from localStorage
                let jwt = null
                const userDataStr = localStorage.getItem('stamp_user_data')
                if (userDataStr) {
                    try {
                        const userData = JSON.parse(userDataStr)
                        jwt = userData.jwt
                        console.log('✅ JWT found in localStorage')
                    } catch (parseError) {
                        console.warn('Failed to parse user data from localStorage:', parseError)
                    }
                }

                if (!jwt) {
                    console.log('❌ No JWT found in localStorage')
                    setError('Authentication token not found. Please log in.')
                    return
                }

                // Fetch all stamps in parallel
                console.log('🔄 Starting to fetch stamp details for:', stampIds)
                const stampPromises = stampIds.map(async (stampId) => {
                    console.log(`🔄 Fetching stamp ${stampId}...`)
                    console.log(`🔄 Full API URL: https://decoded-app-stamp-api-prod-01.azurewebsites.net/api/v1/StampMasterCatalog/${stampId}`)
                    const response = await fetch(
                        `https://decoded-app-stamp-api-prod-01.azurewebsites.net/api/v1/StampMasterCatalog/${stampId}`,
                        {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${jwt}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    )

                    console.log(`📡 Response for stamp ${stampId}:`, response.status, response.statusText)
                    if (!response.ok) {
                        console.error(`❌ Failed to fetch stamp ${stampId}:`, response.status, response.statusText)
                        const errorText = await response.text()
                        console.error(`❌ Error response body:`, errorText)
                        throw new Error(`Failed to fetch stamp ${stampId}: ${response.status}`)
                    }

                    const data = await response.json()
                    console.log(`✅ Successfully fetched stamp ${stampId}:`, data.name || 'Unknown')
                    return data
                })

                const stampData = await Promise.all(stampPromises)
                console.log('✅ All stamps fetched successfully:', stampData.length)
                setStamps(stampData)
            } catch (err) {
                console.error('❌ Error fetching stamp details:', err)
                setError(`Failed to load stamp details: ${err instanceof Error ? err.message : 'Unknown error'}`)
            } finally {
                console.log('🏁 Finished loading stamps')
                setLoading(false)
            }
        }

        fetchStampDetails()
    }, [stampIds])

    const formatDenomination = (value?: string, symbol?: string) => {
        return value ? `${value}${symbol || ''}` : 'N/A'
    }

    const handleShare = async () => {
        const shareUrl = typeof window !== "undefined" ? window.location.href : ""
        const title = `Comparing ${stamps.length} stamps`
        try {
            const win: any = typeof window !== "undefined" ? window : undefined
            if (win?.navigator?.share) {
                await win.navigator.share({ title, url: shareUrl })
            } else if (win?.navigator?.clipboard?.writeText) {
                await win.navigator.clipboard.writeText(shareUrl)
                toast({ title: "Link copied", description: "Comparison link copied to clipboard." })
            }
        } catch {
            // swallow
        }
    }

    const handleBack = () => {
        router.back()
    }

    const openLightbox = (stamp: StampDetailData) => {
        setLightboxStamp(stamp)
        setIsLightboxOpen(true)
    }

    if (loading) {
        return (
            <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
                <div className="flex items-center justify-between mb-6">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-8 w-24" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: Math.min(stampIds.length, 3) }, (_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="aspect-[3/4] w-full rounded-lg mb-4" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
                <div className="flex items-center justify-between mb-6">
                    <Button variant="outline" size="sm" onClick={handleBack}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-xl sm:text-2xl font-bold">Stamp Comparison</h1>
                </div>
                <Card>
                    <CardContent className="p-6 text-center">
                        <div className="text-red-600 mb-4">
                            <p className="text-base font-semibold">{error}</p>
                        </div>
                        <Button size="sm" onClick={handleBack}>Go Back</Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (stamps.length === 0) {
        return (
            <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">No stamps found to compare</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
            <article className="max-w-7xl mx-auto px-2 pb-20 lg:pb-12">
                <div className="mb-4">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Stamp Comparison</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">Stamp Comparison</h1>
                        <p className="text-muted-foreground">Comparing {stamps.length} stamp{stamps.length > 1 ? 's' : ''}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleShare}>
                            <Share2 className="h-4 w-4" /> Share
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleBack}>
                            <ArrowLeft className="h-4 w-4" /> Back
                        </Button>
                    </div>
                </div>

                {/* Comparison Grid */}
                <div className={cn(
                    "grid gap-6",
                    stamps.length === 1 && "grid-cols-1 max-w-2xl mx-auto",
                    stamps.length === 2 && "grid-cols-1 md:grid-cols-2",
                    stamps.length === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                )}>
                    {stamps.map((stamp, index) => (
                        <Card key={stamp.id} className="overflow-hidden">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg leading-tight mb-1">{stamp.name}</CardTitle>
                                        {stamp.seriesName && (
                                            <p className="text-sm text-muted-foreground">{stamp.seriesName}</p>
                                        )}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => openLightbox(stamp)}
                                    >
                                        <Maximize2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {/* Stamp Image */}
                                <div className="relative aspect-[3/4] w-1/2 mx-auto rounded-lg overflow-hidden bg-muted">
                                    <Image
                                        src={stamp.stampImageUrl || '/images/stamps/no-image-available.png'}
                                        alt={stamp.name}
                                        fill
                                        className="object-contain"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        onError={(e) => {
                                            const target = e.currentTarget as HTMLImageElement
                                            if (target.src !== '/images/stamps/no-image-available.png') {
                                                target.src = '/images/stamps/no-image-available.png'
                                            }
                                        }}
                                    />
                                    <div className="absolute top-2 left-2 flex items-center gap-2">
                                        <Badge className="bg-black/70 text-white backdrop-blur-sm border border-white/30 text-xs">
                                            {stamp.denominationDisplay || formatDenomination(stamp.denominationValue, stamp.denominationSymbol)}
                                        </Badge>
                                        {stamp.colorHex && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-black/70 text-white backdrop-blur-sm border border-white/30 px-2 py-1 text-xs">
                                                <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: stamp.colorHex }} />
                                                {stamp.colorName}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Facts */}
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <div className="text-xs text-muted-foreground">Year</div>
                                        <div className="font-medium">{stamp.issueYear || '—'}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground">Country</div>
                                        <div className="font-medium flex items-center gap-1">
                                            <ReactCountryFlag countryCode={stamp.country || ''} svg className="w-4" />
                                            <span className="truncate">{stamp.country || stamp.countryName || '—'}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground">Type</div>
                                        <div className="font-medium">{stamp.typeName || '—'}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground">Paper</div>
                                        <div className="font-medium">{stamp.paperName || '—'}</div>
                                    </div>
                                </div>

                                {/* Technical Details */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Perforation:</span>
                                        <span className="font-medium">{stamp.perforationName || stamp.perforationMeasurement || '—'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Watermark:</span>
                                        <span className="font-medium">{stamp.watermarkName || '—'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Printing:</span>
                                        <span className="font-medium">{stamp.printingMethod || '—'}</span>
                                    </div>
                                    {(!isNaN(Number(stamp.sizeWidth)) || !isNaN(Number(stamp.sizeHeight))) && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Size:</span>
                                            <span className="font-medium">{[stamp.sizeWidth, stamp.sizeHeight].filter(s => !isNaN(Number(s))).join(' × ')}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Market Values */}
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-900 rounded-lg p-3">
                                    <div className="text-xs text-muted-foreground mb-2">Market Values</div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <div className="text-green-700 dark:text-green-300 font-semibold">
                                                {stamp.mintValue && typeof stamp.mintValue === 'number'
                                                    ? `${new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(stamp.mintValue)}`
                                                    : '—'
                                                }
                                            </div>
                                            <div className="text-xs text-green-700/80 dark:text-green-300/80">Mint</div>
                                        </div>
                                        <div>
                                            <div className="text-blue-700 dark:text-blue-300 font-semibold">
                                                {stamp.usedValue && typeof stamp.usedValue === 'number'
                                                    ? `${new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(stamp.usedValue)}`
                                                    : '—'
                                                }
                                            </div>
                                            <div className="text-xs text-blue-700/80 dark:text-blue-300/80">Used</div>
                                        </div>
                                    </div>
                                    {stamp.rarityRating && (
                                        <div className="mt-2">
                                            <Badge
                                                className={cn(
                                                    "text-xs",
                                                    (stamp.rarityRating || '').toLowerCase().includes('collector approved') && "bg-primary/10 text-primary",
                                                    (stamp.rarityRating || '').toLowerCase().includes('rare') && "bg-orange-100 text-orange-800",
                                                    (stamp.rarityRating || '').toLowerCase().includes('uncommon') && "bg-yellow-100 text-yellow-800",
                                                    (stamp.rarityRating || '').toLowerCase().includes('common') && "bg-green-100 text-green-800"
                                                )}
                                            >
                                                {stamp.rarityRating}
                                            </Badge>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-2">
                                    <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() => router.push(`/stamp-details/${stamp.id}`)}
                                        className="flex-1"
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </article>

            {/* Lightbox Dialog */}
            <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
                <DialogContent className="max-w-4xl p-0">
                    <DialogHeader className="px-6 pt-6">
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-base">{lightboxStamp?.name}</DialogTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setIsLightboxOpen(false)}
                                aria-label="Close image popup"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </DialogHeader>
                    <div className="px-6 pb-6">
                        {lightboxStamp && (
                            <div className="relative w-full aspect-[3/2] rounded-xl overflow-hidden bg-muted">
                                <Image
                                    src={lightboxStamp.stampImageUrl || '/images/stamps/no-image-available.png'}
                                    alt={lightboxStamp.name}
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 1024px) 100vw, 960px"
                                />
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

// Loading component for Suspense fallback
function StampComparisonLoading() {
    return (
        <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
            <div className="flex items-center justify-between mb-6">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-24" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }, (_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="aspect-[3/4] w-full rounded-lg mb-4" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default function StampComparisonPage() {
    return (
        <Suspense fallback={<StampComparisonLoading />}>
            <StampComparisonContent />
        </Suspense>
    )
}
