import React, { useState, useMemo, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, ChevronRight, Loader2 } from "lucide-react"
import { CountryOption, SeriesOption } from "@/types/catalog"
import { useCatalogData } from "@/lib/context/catalog-data-context"
import { Skeleton } from "@/components/ui/skeleton";

interface SeriesModalContentProps {
  data: { country: CountryOption, series: SeriesOption[] }
  onSeriesClick: (series: SeriesOption) => void
  isLoading: boolean;
}

export function SeriesModalContent({
  data,
  onSeriesClick,
  isLoading
}: SeriesModalContentProps) {
  const { stamps } = useCatalogData()
  const [searchTerm, setSearchTerm] = useState("")
  const [displayedCount, setDisplayedCount] = useState(20)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const loaderRef = useRef<HTMLDivElement>(null)

  const filteredSeries = useMemo(() => {
    if (!searchTerm) return data.series

    return data.series.filter(series =>
      series.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      series.catalogNumber.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [data.series, searchTerm])

  const displayedSeries = useMemo(() => {
    return filteredSeries.slice(0, displayedCount)
  }, [filteredSeries, displayedCount])

  const hasMore = displayedCount < filteredSeries.length

  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return

    setIsLoadingMore(true)
    // Simulate loading delay for better UX
    setTimeout(() => {
      setDisplayedCount(prev => Math.min(prev + 20, filteredSeries.length))
      setIsLoadingMore(false)
    }, 300)
  }, [isLoadingMore, hasMore, filteredSeries.length])

  // Reset displayed count when search term changes
  useEffect(() => {
    setDisplayedCount(20)
  }, [searchTerm])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore()
        }
      },
      { threshold: 1.0 }
    )

    const currentLoader = loaderRef.current
    if (currentLoader) {
      observer.observe(currentLoader)
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader)
      }
    }
  }, [hasMore, isLoadingMore, loadMore])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full max-w-md mx-auto" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="cursor-pointer bg-card text-card-foreground border border-border">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
                  <Skeleton className="w-16 h-20 rounded border" />
                  <div className="flex-1 text-center sm:text-left w-full space-y-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                  <Skeleton className="h-4 w-4 hidden sm:block" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search stamp groups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-background text-foreground border border-input focus:border-primary"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedSeries.map((series) => (
          <Card
            key={series.id}
            className="cursor-pointer hover:shadow-lg transition-shadow bg-card text-card-foreground border border-border"
            onClick={() => onSeriesClick(series)}
          >
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
                <Image
                  src={series.featuredStampUrl || '/images/stamps/no-image-available.png'}
                  alt={series.name}
                  width={60}
                  height={80}
                  className="rounded border border-border flex-shrink-0"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== '/images/stamps/no-image-available.png') {
                      target.src = '/images/stamps/no-image-available.png';
                    }
                  }}
                />
                <div className="flex-1 text-center sm:text-left w-full">
                  <h3 className="font-semibold text-sm break-words">{series.name}</h3>
                  <p className="text-xs text-muted-foreground break-words">#{series.catalogNumber}</p>
                  <p className="text-xs text-muted-foreground break-words">{series.totalStamps} stamps</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 hidden sm:block" />
              </div>
            </CardContent>
          </Card>
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

      {/* Empty state for filtered results */}
      {!hasMore && displayedSeries.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            No series found matching "{searchTerm}"
          </p>
        </div>
      )}
    </div>
  )
} 
