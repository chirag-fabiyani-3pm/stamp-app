"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Star, MapPin, Calendar, Palette, FileText, DollarSign, Eye, Share2, BookOpen, Globe, Zap } from "lucide-react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"

interface StampDetailData {
  id: string
  catalogExtractionProcessId: string
  stampCatalogCode: string
  name: string
  publisher: string
  country: string
  stampImageUrl: string
  catalogName: string
  catalogNumber: string
  seriesName: string
  issueDate: string
  issueYear: number
  denominationValue: number
  denominationCurrency: string
  denominationSymbol: string
  color: string
  paperType: string
  stampDetailsJson: string
}

function StampDetailContent() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [stamp, setStamp] = useState<StampDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
          `https://3pm-stampapp-prod.azurewebsites.net/api/v1/StampCatalog/${stampId}`,
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
      } catch (err) {
        console.error('Error fetching stamp details:', err)
        setError('Failed to load stamp details. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchStampDetails()
  }, [stampId, searchParams])

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const formatDenomination = (value: number, symbol: string) => {
    return value ? `${value}${symbol || ''}` : 'N/A'
  }

  const shareStamp = async () => {
    const currentURL = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${stamp?.name} - Stamp Details`,
          text: `Check out this stamp: ${stamp?.name} from ${stamp?.country}`,
          url: currentURL
        })
      } else {
        await navigator.clipboard.writeText(currentURL)
        toast({
          title: "URL copied to clipboard",
          description: "You can now share this stamp with others",
        })
      }
    } catch (error) {
      console.error('Error sharing stamp:', error)
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
              <Button variant="outline" size="sm" onClick={() => window.close()}>
                Close Window
              </Button>
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
            <Button className="mt-4" size="sm" onClick={() => window.close()}>
              Close Window
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 lg:p-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div className="flex items-start space-x-3">
          <Button variant="ghost" size="sm" onClick={() => window.close()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-semibold leading-tight text-foreground">{stamp.name || 'Untitled Stamp'}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs border-muted-foreground/20">{stamp.seriesName || 'General Series'}</Badge>
              <span className="text-muted-foreground/60 text-sm">•</span>
              <span className="text-muted-foreground text-sm">#{stamp.catalogNumber || 'N/A'}</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2 shrink-0">
          <Button variant="ghost" size="sm" onClick={shareStamp} title="Share this stamp">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Image and Quick Stats */}
        <div className="lg:col-span-1 space-y-4">
          {/* Stamp Image */}
          <div className="overflow-hidden rounded-xl border border-border/50">
            <div className="aspect-[3/4] relative bg-gradient-to-br from-muted/30 to-muted/60">
              <Image
                src={stamp.stampImageUrl || "/placeholder.svg"}
                alt={stamp.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority
              />
              <div className="absolute top-3 left-3">
                <Badge variant="secondary" className="bg-background/95 border-border/50 backdrop-blur-sm text-sm font-medium px-2 py-1 shadow-sm">
                  {formatDenomination(stamp.denominationValue, stamp.denominationSymbol) || 'No Value'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/30 rounded-lg p-4 text-center">
              <Calendar className="h-5 w-5 mx-auto mb-2 text-blue-600/80" />
              <div className="text-base font-semibold text-blue-700 dark:text-blue-300">
                {stamp.issueYear || 'Unknown'}
              </div>
              <div className="text-xs text-blue-600/70 dark:text-blue-400/70">Issue Year</div>
            </div>
            <div className="bg-green-50/70 dark:bg-green-950/30 border border-green-200/50 dark:border-green-800/30 rounded-lg p-4 text-center">
              <Globe className="h-5 w-5 mx-auto mb-2 text-green-600/80" />
              <div className="text-base font-semibold text-green-700 dark:text-green-300 truncate">
                {stamp.country || 'Unknown Country'}
              </div>
              <div className="text-xs text-green-600/70 dark:text-green-400/70">Country</div>
            </div>
          </div>
        </div>

        {/* Right Column - Detailed Information */}
        <div className="lg:col-span-2 space-y-4">
          {/* Basic Information */}
          <div className="bg-card/50 border border-border/50 rounded-lg p-4">
            <h3 className="flex items-center gap-2 text-sm font-medium mb-3 text-muted-foreground">
              <div className="w-1.5 h-1.5 bg-primary/60 rounded-full"></div>
              Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <BookOpen className="h-4 w-4 text-muted-foreground/60 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground/80">Stamp Code</div>
                  <div className="font-medium text-sm truncate">{stamp.stampCatalogCode || 'No Code Available'}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Zap className="h-4 w-4 text-muted-foreground/60 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground/80">Publisher</div>
                  <div className="font-medium text-sm truncate">{stamp.publisher || 'Unknown Publisher'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Catalog Information */}
          <div className="bg-card/50 border border-border/50 rounded-lg p-4">
            <h3 className="flex items-center gap-2 text-sm font-medium mb-3 text-muted-foreground">
              <div className="w-1.5 h-1.5 bg-blue-500/60 rounded-full"></div>
              Catalog Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-start gap-4">
                <span className="text-muted-foreground/80 text-sm">Catalog Name:</span>
                <span className="font-medium text-sm text-right">{stamp.catalogName || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <span className="text-muted-foreground/80 text-sm">Catalog Number:</span>
                <span className="font-medium text-sm text-right">{stamp.catalogNumber}</span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <span className="text-muted-foreground/80 text-sm">Issue Date:</span>
                <span className="font-medium text-sm text-right">{stamp.issueDate ? formatDate(stamp.issueDate) : 'Date Unknown'}</span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <span className="text-muted-foreground/80 text-sm">Series:</span>
                <span className="font-medium text-sm text-right">{stamp.seriesName || 'General Series'}</span>
              </div>
            </div>
          </div>

          {/* Physical Properties */}
          <div className="bg-card/50 border border-border/50 rounded-lg p-4">
            <h3 className="flex items-center gap-2 text-sm font-medium mb-3 text-muted-foreground">
              <div className="w-1.5 h-1.5 bg-green-500/60 rounded-full"></div>
              Physical Properties
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Palette className="h-4 w-4 text-muted-foreground/60 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground/80">Color</div>
                    <div className="font-medium text-sm">{stamp.color || 'Multicolor'}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FileText className="h-4 w-4 text-muted-foreground/60 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground/80">Paper Type</div>
                    <div className="font-medium text-sm">{stamp.paperType || 'Standard Paper'}</div>
                  </div>
                </div>
              </div>
              <div className="pt-3 border-t border-border/30">
                <div className="flex justify-between items-center gap-4">
                  <span className="text-muted-foreground/80 text-sm">Denomination:</span>
                  <div className="text-right">
                    <div className="font-semibold text-sm">
                      {stamp.denominationValue || 'N/A'} {stamp.denominationCurrency || ''}
                    </div>
                    <div className="text-xs text-muted-foreground/70">
                      ({formatDenomination(stamp.denominationValue, stamp.denominationSymbol) || 'No Value'})
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Close Window Button */}
      <div className="mt-6 text-center">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => window.close()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Close Window
        </Button>
      </div>
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