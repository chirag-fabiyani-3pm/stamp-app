import React from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ArrowLeft, ImageIcon, Navigation, X } from "lucide-react"
import { StampData } from "@/types/catalog"

interface TraditionalPinnedStampCardProps {
  stamp: StampData
  isMinimized: boolean
  onToggleMinimized: () => void
  onUnpin: () => void
}

export function TraditionalPinnedStampCard({
  stamp,
  isMinimized,
  onToggleMinimized,
  onUnpin
}: TraditionalPinnedStampCardProps) {
  const details = stamp.stampDetailsJson ? JSON.parse(stamp.stampDetailsJson) : {}
  const [imageZoomed, setImageZoomed] = React.useState(false)

  const pinnedStampContent = (
    <div
      className={cn(
        "fixed bg-card shadow-lg border border-border transition-all duration-300 rounded-lg text-card-foreground",
        isMinimized
          ? "bottom-4 right-4 w-12 h-12"
          : imageZoomed
            ? "bottom-4 right-4 w-[calc(100vw-2rem)] md:w-[450px] max-h-[calc(100vh-2rem)] overflow-y-auto"
            : "bottom-4 right-4 w-[calc(100vw-2rem)] md:w-80"
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
        <div className="w-full h-full p-1">
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
            className="w-full h-full rounded bg-muted hover:bg-muted/70 flex items-center justify-center transition-colors group"
          >
            <div className="flex items-center space-x-1">
              <Image
                src={stamp.stampImageUrl}
                alt={stamp.name}
                width={20}
                height={25}
                className="rounded border border-border opacity-80 group-hover:opacity-100 transition-opacity"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  const target = e.currentTarget;
                  if (target.src !== '/images/stamps/no-image-available.png') {
                    target.src = '/images/stamps/no-image-available.png';
                  }
                }}
              />
              <Badge variant="secondary" className="text-xs">REF</Badge>
            </div>
          </button>
        </div>
      ) : (
        <div className={cn("p-3", imageZoomed && "p-4")}>
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <Badge variant="outline" className="text-xs">Reference Stamp</Badge>
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
                  className="h-6 w-6 p-0 hover:bg-muted/70 text-muted-foreground"
                  title="Zoom Image"
                >
                  <ImageIcon className="w-3 h-3" />
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
                className="h-6 w-6 p-0 hover:bg-muted/70 text-muted-foreground"
                title={imageZoomed ? "Close Zoom" : "Minimize"}
              >
                {imageZoomed ? <ArrowLeft className="w-3 h-3" /> : <Navigation className="w-3 h-3" />}
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
                className="h-6 w-6 p-0 hover:bg-red-900/10 hover:text-red-400 text-muted-foreground"
                title="Unpin"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {imageZoomed ? (
            /* Zoomed Image View */
            <div className="space-y-3">
              <div className="relative h-48 bg-muted rounded border border-border overflow-hidden flex-shrink-0">
                <Image
                  src={stamp.stampImageUrl}
                  alt={stamp.name}
                  fill
                  className="object-contain p-3"
                  sizes="(max-width: 768px) 100vw, 450px"
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    const target = e.currentTarget;
                    if (target.src !== '/images/stamps/no-image-available.png') {
                      target.src = '/images/stamps/no-image-available.png';
                    }
                  }}
                />
              </div>

              {/* Detailed Information */}
              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-sm text-foreground mb-1">{stamp.name}</h4>
                  <p className="text-xs text-muted-foreground">{stamp.catalogNumber}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Denomination</label>
                    <p className="font-semibold text-foreground">{stamp.denominationValue}{stamp.denominationSymbol}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Year</label>
                    <p className="font-semibold text-foreground">{stamp.issueYear}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Color</label>
                    <p className="font-semibold text-foreground">{stamp.color}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Country</label>
                    <p className="font-semibold text-foreground">{stamp.country}</p>
                  </div>
                </div>

                <div className="border border-border rounded p-2 bg-muted/50">
                  <p className="text-xs text-muted-foreground text-center">
                    Traditional table view with enhanced comparison details
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Compact View */
            <div>
              {/* Stamp Image and Basic Info */}
              <div className="flex items-start space-x-2 mb-3">
                <div
                  className="relative w-12 h-14 flex-shrink-0 cursor-pointer group"
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
                    className="object-cover rounded border border-border group-hover:shadow-sm transition-shadow"
                    sizes="48px"
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      const target = e.currentTarget;
                      if (target.src !== '/images/stamps/no-image-available.png') {
                        target.src = '/images/stamps/no-image-available.png';
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded transition-colors flex items-center justify-center">
                    <ImageIcon className="w-3 h-3 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-xs text-foreground leading-tight mb-1">
                    {stamp.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">{stamp.catalogNumber}</p>
                  <p className="text-xs text-muted-foreground">
                    {stamp.denominationValue}{stamp.denominationSymbol} - {stamp.color}
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-2 text-center border-t border-border pt-2 mb-2">
                <div>
                  <div className="text-xs font-semibold text-foreground">{stamp.issueYear}</div>
                  <div className="text-xs text-muted-foreground">Year</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground">{stamp.country}</div>
                  <div className="text-xs text-muted-foreground">Country</div>
                </div>
              </div>

              {/* Comparison Note */}
              <div className="p-2 bg-blue-900/10 rounded border border-blue-800/20">
                <p className="text-xs text-blue-400">
                  Click to zoom • Compare specimens
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )

  if (typeof window !== 'undefined') {
    return createPortal(pinnedStampContent, document.body)
  }

  return null
} 
