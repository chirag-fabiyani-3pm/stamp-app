"use client"

import { useState, useEffect, Suspense, useRef } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Calendar,
  FileText,
  Share2,
  Bookmark,
  Maximize2,
  X,
} from "lucide-react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import ReactCountryFlag from "react-country-flag"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { toast } from "@/components/ui/use-toast"

interface StampDetailData {
  id: string
  catalogExtractionProcessId: string
  similarityScore?: number
  stampId?: string
  isInstance?: boolean
  parentStampId?: string
  catalogNumber: string
  stampCode: string
  name: string
  description?: string
  country?: string
  countryName?: string
  countryFlag?: string
  seriesId?: string
  seriesName?: string
  typeName?: string
  stampGroupName?: string
  releaseName?: string
  releaseDateRange?: string
  categoryName?: string
  paperTypeName?: string
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
  issueDate?: string
  issueYear?: number
  printingMethod?: string
  stampImageUrl?: string
  stampImageAlt?: string
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

const formatStampCode = (stampCode: string | null | undefined): string => {
  if (!stampCode || typeof stampCode !== 'string') return ''
  // Assuming the watermark is the 8th part (index 7) of the stampCode if it's null
  const parts = stampCode.split('|||')
  if (parts.length > 7 && (parts[7] === 'null' || parts[7] == null || parts[7] === '')) {
    parts[7] = 'NoWmk'
  }
  return parts.join('.')
}

function StampDetailContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [stamp, setStamp] = useState<StampDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeImageUrl, setActiveImageUrl] = useState<string | undefined>(undefined)
  const imageFrameRef = useRef<HTMLDivElement | null>(null)
  const [tilt, setTilt] = useState<{ rx: number; ry: number }>({ rx: 0, ry: 0 })
  const [showLens, setShowLens] = useState(false)
  const [lensPos, setLensPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const stampId = params.id as string

  useEffect(() => {
    const fetchStampDetails = async () => {
      if (!stampId) return

      try {
        setLoading(true)
        setError(null)

        // Get JWT from localStorage first, then check query parameters as fallback
        let jwt = null

        // Try localStorage first
        const userDataStr = localStorage.getItem('stamp_user_data')
        if (userDataStr) {
          try {
            const userData = JSON.parse(userDataStr)
            jwt = userData.jwt
          } catch (parseError) {
            console.warn('Failed to parse user data from localStorage:', parseError)
          }
        }

        // If no JWT from localStorage, check query parameters
        if (!jwt) {
          const jwtFromQuery = searchParams.get('jwt')
          if (jwtFromQuery) {
            jwt = decodeURIComponent(jwtFromQuery)
          }
        }

        if (!jwt) {
          setError('Authentication token not found. Please log in or access this page through the catalog.')
          return
        }

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

        if (!response.ok) {
          if (response.status === 404) {
            setError('Stamp not found')
          } else if (response.status === 401) {
            setError('Authentication expired. Please log in again.')
          } else {
            setError(`Failed to fetch stamp details: ${response.status}`)
          }
          return
        }

        const stampData: StampDetailData = await response.json()
        setStamp(stampData)
        setActiveImageUrl(stampData.stampImageUrl || undefined)
      } catch (err) {
        console.error('Error fetching stamp details:', err)
        setError('Failed to load stamp details. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchStampDetails()
  }, [stampId, searchParams])

  // Initialize saved state from localStorage
  useEffect(() => {
    if (!stampId) return
    try {
      const saved = JSON.parse(localStorage.getItem("saved_stamps") || "[]") as string[]
      setIsSaved(saved.includes(stampId))
    } catch {
      // ignore
    }
  }, [stampId])

  const formatDenomination = (value?: string, symbol?: string) => {
    return value ? `${value}${symbol || ''}` : 'N/A'
  }

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : ""
    const title = stamp?.name || "Stamp Details"
    try {
      const win: any = typeof window !== "undefined" ? window : undefined
      if (win?.navigator?.share) {
        await win.navigator.share({ title, url: shareUrl })
      } else if (win?.navigator?.clipboard?.writeText) {
        await win.navigator.clipboard.writeText(shareUrl)
        toast({ title: "Link copied", description: "Shareable link copied to clipboard." })
      }
    } catch {
      // swallow
    }
  }

  const handleToggleSave = () => {
    try {
      const key = "saved_stamps"
      const saved = JSON.parse(localStorage.getItem(key) || "[]") as string[]
      let next: string[]
      if (saved.includes(stampId)) {
        next = saved.filter((id) => id !== stampId)
        setIsSaved(false)
        toast({ title: "Removed", description: "Removed from your saved items." })
      } else {
        next = [...saved, stampId]
        setIsSaved(true)
        toast({ title: "Saved", description: "Added to your saved items." })
      }
      localStorage.setItem(key, JSON.stringify(next))
    } catch {
      // ignore
    }
  }


  if (loading) {
    return (
      <div className="container mx-auto p-4 lg:p-6 max-w-6xl">
        {/* Header skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>

        {/* Main content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Skeleton className="aspect-[3/4] w-full rounded-lg mb-4" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
          </div>
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-5 w-40" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 lg:p-6 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <Button variant="outline" size="sm" onClick={() => window.close()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Stamp Details</h1>
            <p className="text-sm text-muted-foreground">Error loading stamp information</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-red-600 mb-4">
              <FileText className="h-10 w-10 mx-auto mb-2" />
              <p className="text-base font-semibold">{error}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button size="sm" onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!stamp) {
    return (
      <div className="container mx-auto p-4 lg:p-6 max-w-6xl">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Stamp not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 lg:p-6 max-w-6xl">
      <article className="max-w-6xl mx-auto px-2 pb-20 lg:pb-12">
        <div className="mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Stamp details</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 md:gap-10">
          {/* Left panel: Sticky image + quick facts */}
          <div className="space-y-4 lg:sticky lg:top-6 self-start">
            <div
              ref={imageFrameRef}
              className="relative w-full h-[440px] rounded-2xl overflow-hidden shadow-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/60"
              style={{
                transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                transition: 'transform 120ms ease-out',
              }}
            >
              {stamp.colorHex && (
                <div
                  className="pointer-events-none absolute -inset-8 blur-3xl opacity-40"
                  style={{ background: `radial-gradient(600px 200px at 50% 20%, ${stamp.colorHex}55, transparent 60%)` }}
                />
              )}
              <Image
                src={activeImageUrl || stamp.stampImageUrl || '/images/stamps/no-image-available.png'}
                alt={stamp.stampImageAlt || stamp.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 380px"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement
                  if (target.src !== '/images/stamps/no-image-available.png') {
                    target.src = '/images/stamps/no-image-available.png'
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

              <div className="absolute top-3 left-3 flex items-center gap-2">
                <Badge className="bg-black/70 text-white backdrop-blur-sm border border-white/30 text-xs shadow-sm">
                  {stamp.denominationDisplay || formatDenomination(stamp.denominationValue, stamp.denominationSymbol)}
                </Badge>
                {stamp.colorHex && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/70 text-white backdrop-blur-sm border border-white/30 px-2 py-1 text-xs shadow-sm">
                    <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: stamp.colorHex }} />
                    {stamp.colorName}
                  </span>
                )}
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <Button size="icon" variant="secondary" className="h-8 w-8 bg-background/80 backdrop-blur border border-white/20"
                  onClick={() => setIsLightboxOpen(true)} aria-label="Open large view">
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>

              {showLens && (activeImageUrl || stamp.stampImageHighRes) && (
                <div
                  className="pointer-events-none absolute rounded-full border-2 border-white/70 shadow-xl"
                  style={{
                    width: 160,
                    height: 160,
                    left: Math.max(8, Math.min((lensPos.x || 0) - 80, (imageFrameRef.current?.clientWidth || 0) - 168)),
                    top: Math.max(8, Math.min((lensPos.y || 0) - 80, (imageFrameRef.current?.clientHeight || 0) - 168)),
                    backgroundImage: `url(${stamp.stampImageHighRes || activeImageUrl})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: `${(imageFrameRef.current?.clientWidth || 1) * 2}px ${(imageFrameRef.current?.clientHeight || 1) * 2}px`,
                    backgroundPosition: `${((lensPos.x / (imageFrameRef.current?.clientWidth || 1)) * 100).toFixed(2)}% ${((lensPos.y / (imageFrameRef.current?.clientHeight || 1)) * 100).toFixed(2)}%`,
                    backdropFilter: 'blur(0.5px)',
                  }}
                />
              )}
            </div>

            {/* Quick facts */}
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-center">
                <div className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">Year</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{typeof stamp.issueYear !== 'undefined' ? stamp.issueYear : '—'}</div>
              </div>
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-center">
                <div className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">Country</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-1">
                  {(stamp.countryFlag && stamp.countryFlag.length === 2) ? (
                    <ReactCountryFlag countryCode={stamp.countryFlag} svg className="" />
                  ) : null}
                  <span className="truncate max-w-[8rem]">{stamp.country || stamp.countryName || '—'}</span>
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-center">
                <div className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">Catalog</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{(stamp as any).categoryCode || '—'}</div>
              </div>
            </div>

            {Array.isArray(stamp.stampImageVariants) && stamp.stampImageVariants.length > 0 && (
              <div className="mt-2 grid grid-cols-4 gap-2">
                {stamp.stampImageVariants.slice(0, 8).map((url, idx) => (
                  <button
                    key={idx}
                    className={cn(
                      "relative aspect-square overflow-hidden rounded-lg border",
                      activeImageUrl === url ? "border-primary" : "border-gray-200 dark:border-gray-700"
                    )}
                    onClick={() => setActiveImageUrl(url)}
                    title={`Variant ${idx + 1}`}
                  >
                    <Image src={url} alt={`Variant ${idx + 1}`} fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right panel: Header + Sections */}
          <div className="space-y-6">
            <header className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight">{stamp.name}</h1>
                  {stamp.seriesName && (
                    <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mt-1">{stamp.seriesName}</p>
                  )}
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                    <Share2 className="h-4 w-4" /> Share
                  </Button>
                </div>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
                {typeof stamp.issueYear !== 'undefined' && (
                  <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" />{stamp.issueYear}</span>
                )}
                <span className="flex items-center">
                  <ReactCountryFlag countryCode={stamp.country || stamp.countryName || ''} svg className="mr-1" />
                  {stamp.country || stamp.countryName}
                </span>
              </div>
            </header>

            <Tabs defaultValue={stamp.description ? "overview" : "specs"} className="w-full">
              <TabsList className="mb-2">
                {stamp.description && <TabsTrigger value="overview">Overview</TabsTrigger>}
                <TabsTrigger value="specs">Specifications</TabsTrigger>
                <TabsTrigger value="market">Market</TabsTrigger>
                <TabsTrigger value="id">SOA ID</TabsTrigger>
              </TabsList>

              {stamp.description && (
                <TabsContent value="overview">
                  <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
                    <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Overview</h2>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{stamp.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
                      <div className="rounded-lg bg-gray-50 dark:bg-gray-800 px-3 py-2">
                        <div className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">Type</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{stamp.typeName || '—'}</div>
                      </div>
                      {stamp.releaseName && (
                        <div className="rounded-lg bg-gray-50 dark:bg-gray-800 px-3 py-2">
                          <div className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">Release</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{stamp.releaseName}</div>
                        </div>
                      )}
                      {stamp.itemTypeName && (
                        <div className="rounded-lg bg-gray-50 dark:bg-gray-800 px-3 py-2">
                          <div className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">Item Type</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{stamp.itemTypeName}</div>
                        </div>
                      )}
                    </div>
                  </section>
                </TabsContent>
              )}

              <TabsContent value="specs">
                <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
                  <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Authentication Specifications</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">Denomination</dt>
                        <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">{stamp.denominationDisplay || formatDenomination(stamp.denominationValue, stamp.denominationSymbol)}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">Color</dt>
                        <dd className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                          {stamp.colorHex && <span className="inline-block w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600" style={{ backgroundColor: stamp.colorHex }} />} {stamp.colorName || '—'}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">Paper Type</dt>
                        <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">{stamp.paperTypeName || '—'}</dd>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">Perforation</dt>
                        <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">{stamp.perforationName || stamp.perforationMeasurement || '—'}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">Watermark</dt>
                        <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">{stamp.watermarkName || '—'}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">Printing Method</dt>
                        <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">{stamp.printingMethod || '—'}</dd>
                      </div>
                    </div>
                  </div>
                  {(!isNaN(Number(stamp.sizeWidth)) || !isNaN(Number(stamp.sizeHeight))) ? (
                    <div className="mt-3">
                      <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">Size</dt>
                      <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">{[stamp.sizeWidth, stamp.sizeHeight].filter(s => !isNaN(Number(s))).join(' × ')}</dd>
                    </div>
                  ) : <div className="mt-3">
                    <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">Size</dt>
                    <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">Unknown</dd>
                  </div>}
                </section>
              </TabsContent>

              <TabsContent value="market">
                <section className="rounded-2xl border border-emerald-200/60 dark:border-emerald-900/40 p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-900">
                  <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Market Insights</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-xl md:text-3xl font-bold text-green-700 dark:text-green-300">{stamp.mintValue && typeof stamp.mintValue === 'number' ? `${new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(stamp.mintValue)}` : '—'}</div>
                      <div className="text-xs text-green-700/80 dark:text-green-300/80">Mint Value</div>
                    </div>
                    <div>
                      <div className="text-xl md:text-3xl font-bold text-blue-700 dark:text-blue-300">{stamp.usedValue && typeof stamp.usedValue === 'number' ? `${new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(stamp.usedValue)}` : '—'}</div>
                      <div className="text-xs text-blue-700/80 dark:text-blue-300/80">Used Value</div>
                    </div>
                    <div>
                      <Badge
                        className={cn(
                          "text-sm px-2 py-0.5",
                          (stamp.rarityRating || '').toLowerCase().includes('collector approved') && "bg-primary/10 text-primary",
                          (stamp.rarityRating || '').toLowerCase().includes('rare') && "bg-orange-100 text-orange-800",
                          (stamp.rarityRating || '').toLowerCase().includes('uncommon') && "bg-yellow-100 text-yellow-800",
                          (stamp.rarityRating || '').toLowerCase().includes('common') && "bg-green-100 text-green-800"
                        )}
                      >
                        {stamp.rarityRating || '—'}
                      </Badge>
                      <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">Status</div>
                    </div>
                  </div>
                  {(stamp.priceTrend || stamp.marketNotes) && (
                    <div className="mt-4 text-center">
                      {stamp.priceTrend && (
                        <span className="inline-block text-xs px-2 py-1 rounded bg-white/70 dark:bg-black/20 border border-white/40 dark:border-white/10 mr-2">Trend: {stamp.priceTrend}</span>
                      )}
                      {stamp.marketNotes && stamp.marketNotes !== "N/A" && (
                        <p className="text-xs mt-2 text-gray-800 dark:text-gray-200">{stamp.marketNotes}</p>
                      )}
                    </div>
                  )}
                </section>
              </TabsContent>

              <TabsContent value="id">
                <section className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-5">
                  <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Stamps of Approval ID</h2>
                  <code className="bg-white dark:bg-gray-800 border border-primary/20 dark:border-primary/30 rounded-lg p-3 text-xs font-mono block break-all text-primary dark:text-amber-300">
                    {`SOA-${formatStampCode(decodeURIComponent(stamp.stampCode || ''))}`}
                  </code>
                  <p className="text-primary/70 dark:text-amber-400 text-xs mt-2">This unique identifier confirms authentication and approval in our premium catalog system.</p>
                </section>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </article>

      {/* Mobile sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-3 flex items-center justify-between gap-2 sm:hidden">
        <div className="text-sm font-medium truncate pr-2">{stamp.name}</div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleShare} className="gap-1"><Share2 className="h-4 w-4" />Share</Button>
          <Button variant={isSaved ? "default" : "secondary"} size="sm" onClick={handleToggleSave} className="gap-1"><Bookmark className="h-4 w-4" />{isSaved ? "Saved" : "Save"}</Button>
          <Button variant="ghost" size="sm" onClick={() => window.close()} className="gap-1"><ArrowLeft className="h-4 w-4" />Close</Button>
        </div>
      </div>

      {/* Lightbox dialog */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-5xl p-0">
          <DialogHeader className="px-6 pt-6">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-base">{stamp.name}</DialogTitle>
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
            <div className="relative w-full aspect-[3/2] rounded-xl overflow-hidden bg-muted">
              <Image
                src={activeImageUrl || stamp.stampImageUrl || '/images/stamps/no-image-available.png'}
                alt={stamp.stampImageAlt || stamp.name}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 960px"
              />
            </div>
            {Array.isArray(stamp.stampImageVariants) && stamp.stampImageVariants.length > 0 && (
              <div className="mt-3 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {stamp.stampImageVariants.slice(0, 12).map((url, idx) => (
                  <button
                    key={`lb-${idx}`}
                    className={cn(
                      "relative aspect-square overflow-hidden rounded-md border",
                      activeImageUrl === url ? "border-primary ring-2 ring-primary/30" : "border-gray-200 dark:border-gray-700"
                    )}
                    onClick={() => setActiveImageUrl(url)}
                    title={`Variant ${idx + 1}`}
                  >
                    <Image src={url} alt={`Variant ${idx + 1}`} fill className="object-cover" sizes="120px" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Loading component for Suspense fallback
function StampDetailLoading() {
  return (
    <div className="container mx-auto p-4 lg:p-6 max-w-6xl">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Skeleton className="aspect-[3/4] w-full rounded-lg mb-4" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        </div>
        <div className="lg:col-span-2 space-y-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-5 w-40" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function StampDetailPage() {
  return (
    <Suspense fallback={<StampDetailLoading />}>
      <StampDetailContent />
    </Suspense>
  )
}