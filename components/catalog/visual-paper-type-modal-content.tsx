import React from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import { ColorOption, PaperOption } from "@/types/catalog"
import { getFirstStampImage } from "@/lib/data/catalog-data"
import { useCatalogData } from "@/lib/context/catalog-data-context"
import { Skeleton } from "@/components/ui/skeleton";

interface PaperTypeModalContentProps {
  data: { color: ColorOption, papers: PaperOption[], countryCode: string, seriesName: string, year: number, currencyCode: string, denominationValue: string }
  onPaperClick: (paper: PaperOption) => void
  isLoading: boolean;
}

export function PaperTypeModalContent({
  data,
  onPaperClick,
  isLoading
}: PaperTypeModalContentProps) {
  const { stamps } = useCatalogData()
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="cursor-pointer bg-card text-card-foreground border border-border">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-16 h-20 rounded border" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-3 w-full" />
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.papers.map((paper) => (
          <Card
            key={paper.code}
            className="cursor-pointer hover:shadow-lg transition-shadow bg-card text-card-foreground border border-border"
            onClick={() => onPaperClick(paper)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Image
                  src={getFirstStampImage(stamps, data.countryCode, data.seriesName, data.year, data.currencyCode, data.denominationValue, data.color.code, paper.code)}
                  alt={paper.name}
                  width={60}
                  height={80}
                  className="rounded border border-border"
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    const target = e.currentTarget;
                    if (target.src !== '/images/stamps/no-image-available.png') {
                      target.src = '/images/stamps/no-image-available.png';
                    }
                  }}
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{paper.name}</h3>
                  <p className="text-sm text-muted-foreground">{paper.description}</p>
                  <p className="text-xs text-muted-foreground">{paper.totalStamps} stamps</p>
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
