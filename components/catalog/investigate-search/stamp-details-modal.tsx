import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { X, Tag, Calendar, MapPin, Palette, FileText, DollarSign, Maximize2 } from "lucide-react"
import { StampData } from "@/types/catalog"
import { Card } from "@/components/ui/card"
import { generateStampCodeFromCatalogData } from "@/lib/utils/parse-stamp-code"

const formatStampCode = (stampCode: string | null | undefined): string => {
  if (!stampCode || typeof stampCode !== 'string') return ''
  // Assuming the watermark is the 8th part (index 7) of the stampCode if it's null
  const parts = stampCode.split('|||')
  if (parts.length > 7 && (parts[7] === 'null' || parts[7] == null || parts[7] === '')) {
    parts[7] = 'NoWmk'
  }
  return parts.join('.')
}

interface StampDetailsModalProps {
  selectedStamp: StampData | null
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
}

export function StampDetailsModal({ selectedStamp, isModalOpen, setIsModalOpen }: StampDetailsModalProps) {
  const { toast } = useToast()
  const [enlargedImage, setEnlargedImage] = React.useState<string | null>(null)

  if (!selectedStamp) return null

  let stampDetails = null
  try {
    if (selectedStamp.stampDetailsJson) {
      stampDetails = JSON.parse(selectedStamp.stampDetailsJson)
    }
  } catch (error) {
    console.error('Error parsing stamp details JSON:', error)
  }

  const formatDenomination = (value: number, symbol: string) => {
    return value ? `${value}${symbol || ''}` : 'N/A'
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-5xl w-[calc(100vw-16px)] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] max-h-[95vh] overflow-hidden p-0 gap-0 flex flex-col">
          <DialogHeader className="px-3 py-3 border-b bg-background/95 backdrop-blur-sm z-10 sticky top-0 flex-shrink-0">
            <DialogTitle className="text-base md:text-lg font-semibold leading-tight pr-8 truncate">
              {selectedStamp.name}
            </DialogTitle>
            <p className="text-xs md:text-sm text-muted-foreground truncate">
              {selectedStamp.seriesName} • {selectedStamp.country}
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2 h-8 w-8 p-0 z-20"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

          <div className="overflow-y-auto flex-1 min-h-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Image Section */}
              <div className="p-2 md:p-4 space-y-3 md:border-r border-b md:border-b-0">
                <div className="aspect-square max-w-[280px] mx-auto relative bg-muted/10 rounded-lg overflow-hidden group">
                  <Image
                    src={selectedStamp.stampImageUrl || "/placeholder.svg"}
                    alt={selectedStamp.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <button
                    onClick={() => setEnlargedImage(selectedStamp.stampImageUrl || "/placeholder.svg")}
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
                    title="View larger image"
                  >
                    <Maximize2 className="w-4 h-4 text-primary" />
                  </button>
                </div>

                {/* Quick Info Cards */}
                <div className="grid grid-cols-2 gap-1 md:gap-2">
                  <Card className="p-1.5 md:p-2 bg-primary/5 border-primary/20">
                    <div className="flex items-center gap-1 md:gap-1.5 mb-1">
                      <Tag className="h-3 w-3 text-primary" />
                      <span className="text-xs font-medium text-primary">Denomination</span>
                    </div>
                    <p className="text-xs md:text-sm font-semibold">
                      {formatDenomination(selectedStamp.denominationValue, selectedStamp.denominationSymbol)}
                    </p>
                  </Card>

                  <Card className="p-1.5 md:p-2 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-1 md:gap-1.5 mb-1">
                      <Calendar className="h-3 w-3 text-blue-600" />
                      <span className="text-xs font-medium text-blue-600">Year</span>
                    </div>
                    <p className="text-xs md:text-sm font-semibold">
                      {(selectedStamp.issueYear && isNaN(selectedStamp.issueYear)) ? 'Unknown' : selectedStamp.issueYear}
                    </p>
                  </Card>

                  <Card className="p-1.5 md:p-2 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-1 md:gap-1.5 mb-1">
                      <MapPin className="h-3 w-3 text-green-600" />
                      <span className="text-xs font-medium text-green-600">Country</span>
                    </div>
                    <p className="text-xs md:text-sm font-semibold truncate" title={selectedStamp.country}>
                      {selectedStamp.country}
                    </p>
                  </Card>

                  <Card className="p-1.5 md:p-2 bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
                    <div className="flex items-center gap-1 md:gap-1.5 mb-1">
                      <Palette className="h-3 w-3 text-orange-600" />
                      <span className="text-xs font-medium text-orange-600">Color</span>
                    </div>
                    <p className="text-xs md:text-sm font-semibold truncate" title={selectedStamp.color}>
                      {selectedStamp.color}
                    </p>
                  </Card>
                </div>
              </div>

              {/* Details Section */}
              <div className="p-2 md:p-4 space-y-3 md:space-y-4">
                {/* Basic Information */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground border-b pb-1.5 flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5" />
                    Basic Information
                  </h3>

                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-3">
                      <span className="text-xs text-muted-foreground">Series:</span>
                      <span className="text-xs font-medium text-right break-words max-w-[65%]">
                        {selectedStamp.seriesName}
                      </span>
                    </div>

                    <div className="flex justify-between items-start gap-3">
                      <span className="text-xs text-muted-foreground">Publisher:</span>
                      <span className="text-xs font-medium text-right break-words max-w-[65%]">
                        {selectedStamp.publisher}
                      </span>
                    </div>

                    <div className="flex justify-between items-start gap-3">
                      <span className="text-xs text-muted-foreground">Stamp Catalog Code:</span>
                      <span className="text-xs font-medium text-right font-mono">
                        {selectedStamp.catalogNumber}
                      </span>
                    </div>

                    <div className="flex justify-between items-start gap-3">
                      <span className="text-xs text-muted-foreground">Issue Year:</span>
                      <span className="text-xs font-medium text-right">
                        {selectedStamp.issueYear}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Physical Characteristics */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground border-b pb-1.5 flex items-center gap-1.5">
                    <Palette className="h-3.5 w-3.5" />
                    Physical Details
                  </h3>

                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-3">
                      <span className="text-xs text-muted-foreground">Paper Type:</span>
                      <span className="text-xs font-medium text-right break-words max-w-[65%]">
                        {selectedStamp.paperType || 'Not specified'}
                      </span>
                    </div>

                    <div className="flex justify-between items-start gap-3">
                      <span className="text-xs text-muted-foreground">Currency:</span>
                      <span className="text-xs font-medium text-right">
                        {selectedStamp.denominationCurrency || 'Not specified'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Market Information */}
                {(!!selectedStamp.mintValue || !!selectedStamp.finestUsedValue || !!selectedStamp.usedValue) && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-foreground border-b pb-1.5 flex items-center gap-1.5">
                      <DollarSign className="h-3.5 w-3.5" />
                      Market Information
                    </h3>

                    <div className="space-y-2">
                      {selectedStamp.mintValue && (
                        <div className="flex justify-between items-start gap-3">
                          <span className="text-xs text-muted-foreground">Mint Value:</span>
                          <span className="text-xs font-semibold text-green-600">
                            {new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(selectedStamp.mintValue)}
                          </span>
                        </div>
                      )}

                      {selectedStamp.finestUsedValue && (
                        <div className="flex justify-between items-start gap-3">
                          <span className="text-xs text-muted-foreground">Finest Used Value:</span>
                          <span className="text-xs font-semibold text-blue-600">
                            {new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(selectedStamp.finestUsedValue)}
                          </span>
                        </div>
                      )}

                      {selectedStamp.usedValue && (
                        <div className="flex justify-between items-start gap-3">
                          <span className="text-xs text-muted-foreground">Used Value:</span>
                          <span className="text-xs font-semibold text-orange-600">
                            {new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(selectedStamp.usedValue)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Stamp Catalog Code */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground border-b pb-1.5 flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5" />
                    Stamp Catalog Code
                  </h3>
                  <div>
                    <span className="text-xs font-medium text-right font-mono">
                      {generateStampCodeFromCatalogData(selectedStamp)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!enlargedImage}>
        <DialogContent className="max-w-md p-4 justify-center">
          <DialogHeader className="border-b flex flex-row justify-end pb-4">
            <button
              onClick={() => setEnlargedImage(null)}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors duration-200 z-10 max-w-5"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogHeader>
          <Image
            src={enlargedImage || ""}
            alt="Enlarged stamp"
            width={400}
            height={500}
            className="max-h-[500px] max-w-[500px]"
          />
        </DialogContent>
      </Dialog>
    </>
  )
} 
