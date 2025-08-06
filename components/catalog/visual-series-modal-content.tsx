import React, { useState, useMemo } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, ChevronRight } from "lucide-react"
import { CountryOption, SeriesOption } from "@/types/catalog"
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
  const [searchTerm, setSearchTerm] = useState("")

  const filteredSeries = useMemo(() => {
    if (!searchTerm) return data.series

    return data.series.filter(series =>
      series.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      series.catalogNumber.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [data.series, searchTerm])

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
        {filteredSeries.map((series) => (
          <Card
            key={series.id}
            className="cursor-pointer hover:shadow-lg transition-shadow bg-card text-card-foreground border border-border"
            onClick={() => onSeriesClick(series)}
          >
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
                <Image
                  src={series.stampImageUrl}
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
    </div>
  )
} 
