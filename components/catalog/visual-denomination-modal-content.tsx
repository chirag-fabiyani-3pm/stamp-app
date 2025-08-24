import Image from "next/image"
import React, { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChevronRight, Search } from "lucide-react"
import { DenominationOption, CurrencyOption } from "@/types/catalog"
import { useCatalogData } from "@/lib/context/catalog-data-context"
import { Skeleton } from "@/components/ui/skeleton";

interface DenominationModalContentProps {
  data: { currency: CurrencyOption, denominations: DenominationOption[], countryCode: string, seriesName: string, year: number }
  onDenominationClick: (denomination: DenominationOption) => void
  isLoading: boolean;
}

export function DenominationModalContent({
  data,
  onDenominationClick,
  isLoading
}: DenominationModalContentProps) {
  const { stamps } = useCatalogData()
  const [searchTerm, setSearchTerm] = useState("")



  const filteredDenominations = useMemo(() => {
    if (!searchTerm) return data.denominations

    return data.denominations.filter(denomination =>
      denomination.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      denomination.value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [data.denominations, searchTerm])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full max-w-md mx-auto" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="cursor-pointer bg-card text-card-foreground border border-border">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-12 h-16 rounded border" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-4 w-4" />
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
          placeholder="Search denominations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-background text-foreground border border-input focus:border-primary"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredDenominations.map((denomination) => (
          <Card
            key={denomination.value}
            className="cursor-pointer hover:shadow-lg transition-shadow bg-card text-card-foreground border border-border"
            onClick={() => onDenominationClick(denomination)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Image
                  src={denomination.featuredStampImageUrl || '/images/stamps/no-image-available.png'}
                  alt={denomination.displayName}
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
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{denomination.displayName}</h3>
                  <p className="text-xs text-muted-foreground">{denomination.totalStamps} stamps</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 
