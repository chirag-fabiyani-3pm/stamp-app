import React from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ItemTypeOption, StampData } from "@/types/catalog"

interface ItemTypeModalContentProps {
  data: { itemType: ItemTypeOption, stamps: StampData[] }
  onStampClick: (stamp: StampData) => void
}

export function ItemTypeModalContent({
  data,
  onStampClick,
}: ItemTypeModalContentProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.stamps.map((stamp) => (
          <Card
            key={stamp.id}
            className="hover:shadow-lg transition-shadow cursor-pointer bg-card text-card-foreground border border-border"
            onClick={() => onStampClick(stamp)}
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-center flex-shrink-0">
                  <Image
                    src={stamp.stampImageUrl}
                    alt={stamp.name}
                    width={120}
                    height={160}
                    className="rounded border border-border"
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      e.currentTarget.src = '/images/stamps/no-image-available.png'
                    }}
                  />
                </div>
                <div className="text-center space-y-2 min-w-0">
                  <h3 className="font-semibold text-sm break-words">{stamp.name}</h3>
                  <p className="text-xs text-muted-foreground break-words">{stamp.catalogNumber}</p>
                  <p className="text-xs text-muted-foreground break-words">
                    {stamp.denominationValue}{stamp.denominationSymbol} - {stamp.color}
                  </p>
                  <p className="text-xs text-muted-foreground break-words">{stamp.issueDate}</p>
                  <div className="mt-2 overflow-hidden">
                    <code className="bg-muted px-2 py-1 rounded text-xs break-all whitespace-pre-wrap word-break overflow-wrap-break-word max-w-full block text-foreground">
                      {stamp.stampCode}
                    </code>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 