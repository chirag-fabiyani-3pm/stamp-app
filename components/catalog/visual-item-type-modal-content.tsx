import React from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import { ItemTypeOption, PerforationOption } from "@/types/catalog"
import { useCatalogData } from "@/lib/context/catalog-data-context"
import { Skeleton } from "@/components/ui/skeleton";

interface VisualItemTypeModalContentProps {
  data: { perforation: PerforationOption, itemTypes: ItemTypeOption[], countryCode: string, seriesName: string, year: number, currencyCode: string, denominationValue: string, colorCode: string, paperCode: string, watermarkCode: string }
  onItemTypeClick: (itemType: ItemTypeOption) => void
  isLoading: boolean;
}

export function VisualItemTypeModalContent({
  data,
  onItemTypeClick,
  isLoading
}: VisualItemTypeModalContentProps) {
  const { stamps } = useCatalogData()
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="cursor-pointer bg-card text-card-foreground border border-border">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-16 h-20 rounded border" />
                  <div className="flex-1 min-w-0 space-y-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-1/2" />
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.itemTypes.map((itemType) => (
          <Card
            key={itemType.code}
            className="cursor-pointer hover:shadow-lg transition-shadow bg-card text-card-foreground border border-border"
            onClick={() => onItemTypeClick(itemType)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Image
                  src={itemType.featuredStampImageUrl || '/images/stamps/no-image-available.png'}
                  alt={itemType.name}
                  width={60}
                  height={80}
                  className="rounded border border-border flex-shrink-0"
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    const target = e.currentTarget;
                    if (target.src !== '/images/stamps/no-image-available.png') {
                      target.src = '/images/stamps/no-image-available.png';
                    }
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold break-words">{itemType.name}</h3>
                  <p className="text-sm text-muted-foreground break-words">{itemType.description}</p>
                  <p className="text-xs text-muted-foreground break-words">{itemType.totalStamps} stamps</p>
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
