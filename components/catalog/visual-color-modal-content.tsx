import React, { useState, useMemo } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChevronRight, Search } from "lucide-react"
import { ColorOption, DenominationOption } from "@/types/catalog"
import { useCatalogData } from "@/lib/context/catalog-data-context"
import { Skeleton } from "@/components/ui/skeleton";

interface ColorModalContentProps {
  data: { denomination: DenominationOption, colors: ColorOption[], countryCode: string, seriesName: string, year: number, currencyCode: string }
  onColorClick: (color: ColorOption) => void
  isLoading: boolean;
}

export function ColorModalContent({
  data,
  onColorClick,
  isLoading
}: ColorModalContentProps) {
  const { stamps } = useCatalogData()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredColors = useMemo(() => {
    if (!searchTerm) return data.colors

    return data.colors.filter(color =>
      color.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      color.code.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [data.colors, searchTerm])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full max-w-md mx-auto" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="cursor-pointer bg-card text-card-foreground border border-border">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Skeleton className="w-6 h-6 rounded border" />
                    <Skeleton className="w-12 h-16 rounded border" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                  <Skeleton className="h-4 w-4 flex-shrink-0" />
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
          placeholder="Search colors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-background text-foreground border border-input focus:border-primary"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredColors.map((color) => (
          <Card
            key={color.code}
            className="cursor-pointer hover:shadow-lg transition-shadow bg-card text-card-foreground border border-border"
            onClick={() => onColorClick(color)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 flex-shrink-0">
                  {color.hex === '#XXXXXX' ? (
                    <div className="w-6 h-6 rounded border border-border bg-gradient-to-br from-red-400 via-orange-400 to-purple-400"></div>
                  ) : <div
                    className="w-6 h-6 rounded border border-border"
                    style={{ backgroundColor: color.hex }}
                  />}
                  <Image
                    src={color.featuredStampUrl || '/images/stamps/no-image-available.png'}
                    alt={color.name}
                    width={50}
                    height={60}
                    className="rounded border border-border"
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      const target = e.currentTarget;
                      if (target.src !== '/images/stamps/no-image-available.png') {
                        target.src = '/images/stamps/no-image-available.png';
                      }
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold break-words">{color.name}</h3>
                  <p className="text-sm text-muted-foreground break-words">{color.code}</p>
                  <p className="text-xs text-muted-foreground break-words">{color.totalStamps} stamps</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 
