"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { ChevronRight, Sparkles, Database, CloudDownload, Zap, Star, Heart, Clock } from "lucide-react"
import { useEffect, useState } from "react"

export const StampCardSkeleton = () => (
  <Card className="overflow-hidden animate-pulse">
    <div className="aspect-square relative bg-gradient-to-br from-muted/10 to-muted/20">
      <Skeleton className="w-full h-full rounded-none" />
      <div className="absolute top-2 left-2">
        <Skeleton className="h-5 w-12 rounded animate-pulse" />
      </div>
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
    </div>
    <div className="p-3 space-y-2">
      <div className="space-y-1">
        <Skeleton className="h-4 w-3/4 animate-pulse" />
        <Skeleton className="h-3 w-1/2 animate-pulse" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-3 w-16 animate-pulse" />
        <Skeleton className="h-3 w-20 animate-pulse" />
      </div>
      <Skeleton className="h-3 w-24 animate-pulse" />
    </div>
  </Card>
)

export const StampListSkeleton = () => (
  <Card className="mb-3 animate-pulse">
    <CardContent className="p-4">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Skeleton className="w-16 h-16 rounded animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer rounded" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="space-y-1">
            <Skeleton className="h-4 w-2/3 animate-pulse" />
            <Skeleton className="h-3 w-1/2 animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-12 rounded animate-pulse" />
            <Skeleton className="h-3 w-16 animate-pulse" />
            <Skeleton className="h-3 w-20 animate-pulse" />
          </div>
        </div>
        <Skeleton className="h-4 w-4 animate-pulse" />
      </div>
    </CardContent>
  </Card>
)

export const GroupCardSkeleton = () => (
  <Card className="animate-pulse">
    <CardContent className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="relative">
          <Skeleton className="h-5 w-32 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer rounded" />
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground animate-pulse" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-16 rounded animate-pulse" />
        <Skeleton className="h-3 w-20 animate-pulse" />
      </div>
    </CardContent>
  </Card>
)

// Country Catalog Skeleton
export const CountryCatalogSkeleton = () => (
  <div className="space-y-8">
    {/* Header Section */}
    <div className="text-center mb-8 md:mb-12">
      <Skeleton className="h-8 w-64 mx-auto mb-4" />
      <Skeleton className="h-5 w-96 mx-auto" />
    </div>

    {/* Search Section */}
    <div className="relative mb-8">
      <Skeleton className="h-12 w-full rounded-full" />
      <div className="absolute left-3 top-1/2 -translate-y-1/2">
        <Skeleton className="h-5 w-5" />
      </div>
    </div>

    {/* Country Cards Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="group cursor-pointer">
          <div className="relative overflow-hidden rounded-2xl bg-muted/10 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02] dark:bg-gray-800 dark:border-gray-700">
            {/* Image Section */}
            <div className="relative h-56 overflow-hidden w-full">
              <Skeleton className="w-full h-full rounded-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

              {/* Top Badge */}
              <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Skeleton className="h-5 w-16 rounded" />
                </div>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-0 left-0 right-0 px-4 py-2 rounded-lg bg-black/30 backdrop-blur-sm">
                {/* Flag and Country Name */}
                <div className="flex items-center mb-0.5">
                  <Skeleton className="h-6 w-6 rounded-sm mr-2" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-4 w-full mb-1" />
                <div className="flex items-center justify-between mt-2">
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="p-3 pt-2">
              <div className="flex items-center mb-2.5">
                <Skeleton className="h-2.5 w-2.5 mr-1.5 opacity-60" />
                <Skeleton className="h-3 w-full" />
              </div>
              <div className="flex items-center justify-between mt-2.5">
                <Skeleton className="h-6 w-24 rounded" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

// Visual Catalog Skeleton
export const VisualCatalogSkeleton = () => (
  <div className="min-h-screen p-2 md:p-6">
    {/* Header Card */}
    <div className="mx-auto mt-2 mb-4 w-full max-w-4xl border bg-card text-card-foreground shadow-sm rounded-lg">
      <div className="p-3 md:p-6">
        <div className="text-center mb-3 md:mb-6">
          <Skeleton className="h-8 w-48 mx-auto mb-1" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
        <Skeleton className="h-px w-full my-3 md:my-6 bg-border" />
        <div className="flex flex-col md:flex-row gap-3 mb-3 md:mb-6">
          <div className="flex-1">
            <div className="relative">
              <Skeleton className="h-10 w-full pl-9" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-sm border-y border-border py-2">
          <div>
            <Skeleton className="h-4 w-8 mx-auto mb-1" />
            <Skeleton className="h-3 w-12 mx-auto" />
          </div>
          <div>
            <Skeleton className="h-4 w-12 mx-auto mb-1" />
            <Skeleton className="h-3 w-16 mx-auto" />
          </div>
          <div>
            <Skeleton className="h-4 w-10 mx-auto mb-1" />
            <Skeleton className="h-3 w-14 mx-auto" />
          </div>
          <div>
            <Skeleton className="h-4 w-16 mx-auto mb-1" />
            <Skeleton className="h-3 w-18 mx-auto" />
          </div>
        </div>
      </div>
    </div>

    {/* Countries Table */}
    <div className="container mx-auto px-0 md:px-4 pb-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card border border-border rounded shadow-sm">
          {/* Table Header */}
          <div className="border-b border-border bg-muted/50 px-3 py-2">
            <div className="grid grid-cols-12 gap-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              <div className="col-span-2 text-center">
                <Skeleton className="h-4 w-8 mx-auto" />
              </div>
              <div className="col-span-4">
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="col-span-2 text-center">
                <Skeleton className="h-4 w-8 mx-auto" />
              </div>
              <div className="col-span-3 text-right">
                <Skeleton className="h-4 w-20 ml-auto" />
              </div>
              <div className="hidden sm:block col-span-1">
                <Skeleton className="h-4 w-4 ml-auto" />
              </div>
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-border">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="px-3 py-2 hover:bg-muted/70 transition-colors">
                <div className="grid grid-cols-12 gap-3 items-center text-sm">
                  <div className="col-span-2 text-center flex items-center justify-center">
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
                  <div className="col-span-4 font-bold text-foreground">
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="col-span-2 text-center">
                    <Skeleton className="h-5 w-12 rounded mx-auto" />
                  </div>
                  <div className="col-span-3 text-right text-muted-foreground">
                    <div className="flex items-center justify-end space-x-1">
                      <Skeleton className="h-3 w-3" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <div className="hidden col-span-1 text-right sm:flex justify-end">
                    <Skeleton className="h-3 w-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
)

// List Catalog Skeleton
export const ListCatalogSkeleton = () => (
  <div className="min-h-screen text-gray-900 dark:text-gray-100">
    {/* Header */}
    <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-sm mx-4 mt-4 mb-6 rounded-lg">
      <div className="p-4 sm:p-6">
        <div className="text-center mb-4 sm:mb-6">
          <Skeleton className="h-8 w-80 mx-auto mb-1" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>

        {/* Layout Toggle */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <Skeleton className="h-9 w-44 rounded-lg" />
            <Skeleton className="h-9 w-44 rounded-lg" />
          </div>
        </div>

        <Skeleton className="h-px w-full border-gray-300 dark:border-700 mb-4 sm:mb-6" />

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Skeleton className="h-10 w-full pl-9" />
            </div>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm border-t border-b border-gray-300 dark:border-gray-700 py-3">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="text-center">
              <Skeleton className="h-4 w-12 mx-auto mb-1" />
              <Skeleton className="h-3 w-16 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Main Content */}
    <div className="container mx-auto px-4 pb-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2 hidden sm:block">
            <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-700 uppercase tracking-wide">
              {Array.from({ length: 5 }, (_, i) => (
                <Skeleton key={i} className="h-4 w-full col-span-2" />
              ))}
            </div>
          </div>
          <div className="block sm:hidden border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2">
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-gray-700 uppercase tracking-wide">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="grid grid-cols-12 gap-4 items-center text-sm">
                  <Skeleton className="h-4 w-3/4 col-span-1 sm:col-span-4" />
                  <Skeleton className="h-4 w-1/2 col-span-1 sm:col-span-2 text-center" />
                  <Skeleton className="h-4 w-1/2 hidden sm:block col-span-2 text-center" />
                  <Skeleton className="h-4 w-3/4 hidden sm:block col-span-3" />
                  <Skeleton className="h-4 w-4 hidden sm:block col-span-1" />
                </div>
                <div className="grid sm:hidden grid-cols-2 gap-4 items-center text-sm">
                  <div>
                    <Skeleton className="h-4 w-full font-bold" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-4 inline-block ml-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
)

// Investigate Search Skeleton
export const InvestigateSearchSkeleton = () => (
  <div className="container mx-auto p-6 space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
      </div>
    </div>

    {/* Controls */}
    <div className="border bg-card text-card-foreground shadow-sm rounded-lg">
      <div className="p-6">
        <Skeleton className="h-6 w-48 mb-4" />
      </div>
      <div className="p-6 space-y-4">
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <div className="relative">
            <Skeleton className="h-10 w-full pl-10" />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-16" />
          </div>

          <div className="bg-muted/30 rounded-lg p-3 space-y-2">
            <Skeleton className="h-4 w-full" />
            <div className="flex items-center gap-2 flex-wrap">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>

          <Skeleton className="h-10 w-full mt-2" />
        </div>

        <div>
          <Skeleton className="h-4 w-32 mb-2" />
          <div className="relative">
            <Skeleton className="h-10 w-full pl-10" />
          </div>
        </div>

        <Skeleton className="h-4 w-40" />
      </div>
    </div>

    {/* Grouped Stamps */}
    <div className="border bg-card text-card-foreground shadow-sm rounded-lg">
      <div className="p-6 pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-16" />
        </div>
        {/* Breadcrumbs */}
        <div className="mt-4 bg-white px-4 py-2 rounded-lg shadow">
          <div className="flex items-center">
            <Skeleton className="h-8 w-16 rounded-full mr-2" />
            <Skeleton className="h-4 w-4 mr-2" />
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
        </div>
      </div>
      <div className="p-6">
        <LoadingStamps count={6} type="grid" />
      </div>
    </div>
  </div>
)

export const LoadingStamps = ({ count = 6, type = 'grid' }: { count?: number; type?: 'grid' | 'list' | 'groups' }) => (
  <div className="space-y-6">
    <div className={cn(
      type === 'grid'
        ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
        : type === 'list'
        ? "space-y-3"
        : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    )}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} style={{ animationDelay: `${i * 100}ms` }}>
          {type === 'grid' ? <StampCardSkeleton /> :
           type === 'list' ? <StampListSkeleton /> :
           <GroupCardSkeleton />}
        </div>
      ))}
    </div>
    <div className="text-center py-6">
      <div className="flex items-center justify-center space-x-3">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">Loading from cache...</p>
      </div>
    </div>
  </div>
)

// Enhanced progress component with real-time API data
export const DataFetchingProgress = ({
  progress = 0,
  totalItems = 0,
  currentItems = 0,
  currentPage = 0,
  totalPages = 0,
  isComplete = false
}: {
  progress?: number;
  totalItems?: number;
  currentItems?: number;
  currentPage?: number;
  totalPages?: number;
  isComplete?: boolean;
}) => {
  const [currentMessage, setCurrentMessage] = useState(0)
  const [iconIndex, setIconIndex] = useState(0)

  const messages = [
    "Connecting to stamp database...",
    "Fetching catalog records...",
    "Processing stamp information...",
    "Organizing by countries...",
    "Indexing for quick search...",
    "Almost ready...",
    "Finalizing your catalog..."
  ]

  const icons = [Database, CloudDownload, Zap, Star, Heart, Clock, Sparkles]
  const CurrentIcon = icons[iconIndex]

  useEffect(() => {
    if (isComplete) {
      setCurrentMessage(6)
      setIconIndex(6)
      return
    }

    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => {
        const next = (prev + 1) % messages.length
        setIconIndex(next)
        return next
      })
    }, 3000) // Change message every 3 seconds

    return () => clearInterval(messageInterval)
  }, [isComplete])

  // Show completion animation when progress reaches 100%
  const showCompletionAnimation = progress >= 100 && isComplete

  const getEstimatedTimeRemaining = () => {
    if (!currentPage || !totalPages) return ""
    const pagesRemaining = totalPages - currentPage
    const estimatedSeconds = pagesRemaining * 2 // Assuming ~2 seconds per page
    if (estimatedSeconds < 60) return `${estimatedSeconds}s remaining`
    const minutes = Math.floor(estimatedSeconds / 60)
    const seconds = estimatedSeconds % 60
    return `${minutes}m ${seconds}s remaining`
  }

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className={`w-full max-w-md mx-4 transition-all duration-500 ${showCompletionAnimation ? 'scale-105 shadow-2xl' : ''}`}>
        <CardContent className="p-8 text-center space-y-6">
          {/* Animated Icon */}
          <div className="relative">
            {showCompletionAnimation ? (
              <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center animate-celebrate">
                <Sparkles className="w-10 h-10 text-green-600 animate-success-pulse" />
              </div>
            ) : (
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                <CurrentIcon className="w-10 h-10 text-primary animate-bounce" />
              </div>
            )}
            {/* Pulsing rings */}
            {showCompletionAnimation ? (
              <div className="absolute inset-0 rounded-full border-2 border-green-200 animate-ping" />
            ) : (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
                <div className="absolute inset-2 rounded-full border border-primary/30 animate-ping" style={{ animationDelay: '0.5s' }} />
              </>
            )}
          </div>

          {/* Progress Text */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {isComplete ? "Ready!" : messages[currentMessage]}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isComplete
                ? "Your stamp catalog is now ready to explore!"
                : `Loading page ${currentPage} of ${totalPages} • ${currentItems.toLocaleString()} of ${totalItems.toLocaleString()} items`}
            </p>
            {!isComplete && getEstimatedTimeRemaining() && (
              <p className="text-xs text-muted-foreground/70">
                {getEstimatedTimeRemaining()}
              </p>
            )}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress
              value={isComplete ? 100 : progress}
              className={`h-3 ${showCompletionAnimation ? 'bg-green-50' : 'bg-muted'}`}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{Math.round(isComplete ? 100 : progress)}%</span>
              <span className={showCompletionAnimation ? 'text-green-600 font-semibold' : ''}>
                {isComplete ? "Complete! 🎉" : "Fetching..."}
              </span>
            </div>
          </div>

          {/* Additional Visual Elements */}
          <div className="flex justify-center space-x-2">
            <div className="flex space-x-1">
              {showCompletionAnimation ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                </>
              )}
            </div>
          </div>

          {/* Fun fact or tip */}
          <div className="text-xs text-muted-foreground/70 italic">
            {isComplete
              ? "💡 Tip: Use the search to find stamps by country, year, or series!"
              : "💡 Did you know? Our catalog contains stamps from over 100 countries!"}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Compact version for inline usage
export const InlineDataFetchingProgress = ({
  progress = 0,
  totalItems = 0,
  currentItems = 0,
  message = "Loading data..."
}: {
  progress?: number;
  totalItems?: number;
  currentItems?: number;
  message?: string;
}) => (
  <div className="w-full space-y-4 p-6">
    <div className="text-center space-y-2">
      <div className="flex items-center justify-center space-x-3">
        <CloudDownload className="w-5 h-5 text-primary animate-pulse" />
        <p className="text-sm text-muted-foreground">{message}</p>
        <div className="flex space-x-1">
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        {currentItems > 0 ? `${currentItems.toLocaleString()}${totalItems > 0 ? ` of ${totalItems.toLocaleString()}` : ''} items loaded` : ''}
      </p>
    </div>
    <Progress value={progress} className="h-2 bg-muted" />
    <div className="flex justify-between text-xs text-muted-foreground">
      <span>{Math.round(progress)}%</span>
      <span>Please wait, this may take a few minutes...</span>
    </div>
  </div>
) 
