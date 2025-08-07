import React from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import { PerforationOption, WatermarkOption } from "@/types/catalog"
import { Skeleton } from "@/components/ui/skeleton";

interface VisualPerforationModalContentProps {
  data: { watermark: WatermarkOption, perforations: PerforationOption[] }
  onPerforationClick: (perforation: PerforationOption) => void
  isLoading: boolean;
}

export function VisualPerforationModalContent({
  data,
  onPerforationClick,
  isLoading
}: VisualPerforationModalContentProps) {
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
        {data.perforations.map((perforation) => (
          <Card
            key={perforation.code}
            className="cursor-pointer hover:shadow-lg transition-shadow bg-card text-card-foreground border border-border"
            onClick={() => onPerforationClick(perforation)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Image
                  src={perforation.stampImageUrl}
                  alt={perforation.name}
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
                  <h3 className="font-semibold break-words">{perforation.name}</h3>
                  <p className="text-sm text-muted-foreground break-words">{perforation.measurement}</p>
                  <p className="text-xs text-muted-foreground break-words">{perforation.totalStamps} stamps</p>
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
