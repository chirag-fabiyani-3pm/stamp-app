import React, { useState } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ArrowLeft, ImageIcon, Navigation, Sparkles, X } from "lucide-react"
import { StampData } from "@/types/catalog"

interface PinnedStampCardProps {
  stamp: StampData
  isMinimized: boolean
  onToggleMinimized: () => void
  onUnpin: () => void
}

export default function PinnedStampCard({
  stamp,
  isMinimized,
  onToggleMinimized,
  onUnpin,
}: PinnedStampCardProps) {
  const details = stamp.stampDetailsJson ? JSON.parse(stamp.stampDetailsJson) : {}
  const [imageZoomed, setImageZoomed] = useState(false)

  const pinnedStampContent = (
    <div
      className={cn(
        "fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300",
        isMinimized
          ? "w-14 h-14 sm:w-16 sm:h-16"
          : imageZoomed
            ? "w-[90vw] h-[90vh] md:w-[500px] max-h-[calc(100vh-2rem)] overflow-y-auto"
            : "w-[90vw] max-w-sm md:w-96"
      )}
      style={{
        zIndex: 99999,
        pointerEvents: 'auto'
      }}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
      }}
      onMouseDown={(e) => {
        e.preventDefault()
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
      }}
      onPointerDown={(e) => {
        e.preventDefault()
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
      }}
      onTouchStart={(e) => {
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
      }}
    >
      {isMinimized ? (
        <div className="w-full h-full p-2">
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              e.nativeEvent.stopImmediatePropagation()
              onToggleMinimized()
            }}
            onMouseDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
              e.nativeEvent.stopImmediatePropagation()
            }}
            className="w-full h-full rounded-xl bg-gradient-to-br from-primary/10 to-orange-100 dark:from-primary/20 dark:to-orange-900 flex items-center justify-center hover:from-primary/20 hover:to-orange-200 dark:hover:from-primary/30 dark:hover:to-orange-800 transition-colors group"
          >
            <div className="flex items-center space-x-1">
              <Image
                src={stamp.stampImageUrl}
                alt={stamp.name}
                width={24}
                height={30}
                className="rounded border opacity-80 group-hover:opacity-100 transition-opacity"
              />
              <Badge className="bg-primary/80 text-white text-xs">REF</Badge>
            </div>
          </button>
        </div>
      ) : (
        <div className={cn("p-4", imageZoomed && "p-6")}>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Badge className="bg-primary/10 text-primary text-sm px-3 py-1">
                Reference Stamp
              </Badge>
            </div>
            <div className="flex items-center space-x-1">
              {!imageZoomed && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    e.nativeEvent.stopImmediatePropagation()
                    setImageZoomed(true)
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    e.nativeEvent.stopImmediatePropagation()
                  }}
                  className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"
                  title="Zoom Image"
                >
                  <ImageIcon className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  e.nativeEvent.stopImmediatePropagation()
                  if (imageZoomed) {
                    setImageZoomed(false)
                  } else {
                    onToggleMinimized()
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  e.nativeEvent.stopImmediatePropagation()
                }}
                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"
                title={imageZoomed ? "Close Zoom" : "Minimize"}
              >
                {imageZoomed ? <ArrowLeft className="w-4 h-4" /> : <Navigation className="w-4 h-4 transform rotate-45" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  e.nativeEvent.stopImmediatePropagation()
                  onUnpin()
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  e.nativeEvent.stopImmediatePropagation()
                }}
                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-400"
                title="Unpin"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {imageZoomed ? (
            /* Zoomed Image View */
            <div className="space-y-3">
              <div className="relative h-40 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-900 rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src={stamp.stampImageUrl}
                  alt={stamp.name}
                  fill
                  className="object-contain p-3"
                  sizes="500px"
                />
              </div>
              
              {/* Detailed Information */}
              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-base text-gray-900 dark:text-gray-100 mb-1">{stamp.name}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300">{stamp.seriesName}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Catalog</label>
                    <p className="font-semibold text-primary dark:text-amber-300">{stamp.catalogNumber}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Country</label>
                    <p className="font-semibold">{stamp.country}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Denomination</label>
                    <p className="font-semibold">{stamp.denominationValue}{stamp.denominationSymbol}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Year</label>
                    <p className="font-semibold">{stamp.issueYear}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Color</label>
                    <p className="font-semibold">{stamp.color}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Paper</label>
                    <p className="font-semibold">{stamp.paperType}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Perforation</label>
                    <p className="font-semibold">{details.perforation || '12.0'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Watermark</label>
                    <p className="font-semibold">{details.watermark || 'Crown'}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                  <div>
                    <div className="text-sm font-bold text-green-600 dark:text-green-400">${details.currentMarketValue || stamp.marketValue || '518'}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Market Value</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-orange-600 dark:text-orange-400">{stamp.rarity || 'Uncommon'}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Grade</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-blue-600 dark:text-blue-400">{details.condition || 'Premium'}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Condition</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Compact View */
            <div>
              {/* Stamp Image and Basic Info */}
              <div className="flex items-start space-x-3 mb-4">
                <div 
                  className="relative w-16 h-20 flex-shrink-0 cursor-pointer group"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    e.nativeEvent.stopImmediatePropagation()
                    setImageZoomed(true)
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    e.nativeEvent.stopImmediatePropagation()
                  }}
                >
                  <Image
                    src={stamp.stampImageUrl}
                    alt={stamp.name}
                    fill
                    className="object-cover rounded border shadow-sm group-hover:shadow-md transition-shadow"
                    sizes="64px"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded transition-colors flex items-center justify-center">
                    <ImageIcon className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 leading-tight mb-1">
                    {stamp.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-300 mb-1">{stamp.catalogNumber}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {stamp.denominationValue}{stamp.denominationSymbol} - {stamp.color}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {stamp.country} ({stamp.issueYear})
                  </p>
                </div>
              </div>

              {/* Detailed Stats */}
              <div className="grid grid-cols-2 gap-3 text-center border-t border-gray-100 dark:border-gray-700 pt-3 mb-3">
                <div>
                  <div className="text-sm font-bold text-green-600 dark:text-green-400">${details.currentMarketValue || stamp.marketValue || '125'}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Market Value</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-primary dark:text-amber-300">{stamp.rarity || 'Fine'}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Grade</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{details.perforation || '12.0'}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Perforation</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{details.watermark || 'Crown'}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Watermark</div>
                </div>
              </div>

              {/* Comparison Tip */}
              <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-700">
                <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  Click image to zoom • Compare with other specimens
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )

  // Render using portal to document.body to escape modal z-index issues
  if (typeof window !== 'undefined') {
    return createPortal(pinnedStampContent, document.body)
  }
  
  return null
} 