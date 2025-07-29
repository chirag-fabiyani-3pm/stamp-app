import React from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import { PaperOption, WatermarkOption } from "@/types/catalog"

interface PaperModalContentProps {
  data: { paper: PaperOption, watermarks: WatermarkOption[] }
  onWatermarkClick: (watermark: WatermarkOption) => void
}

export function PaperModalContent({
  data,
  onWatermarkClick,
}: PaperModalContentProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.watermarks.map((watermark) => (
          <Card
            key={watermark.code}
            className="cursor-pointer hover:shadow-lg transition-shadow bg-card text-card-foreground border border-border"
            onClick={() => onWatermarkClick(watermark)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Image
                  src={watermark.stampImageUrl}
                  alt={watermark.name}
                  width={60}
                  height={80}
                  className="rounded border border-border flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold break-words">{watermark.name}</h3>
                  <p className="text-sm text-muted-foreground break-words">{watermark.description}</p>
                  <p className="text-xs text-muted-foreground break-words">{watermark.totalStamps} stamps</p>
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