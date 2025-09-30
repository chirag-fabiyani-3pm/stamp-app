import React, { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Maximize2, X } from "lucide-react"
import { StampData } from "@/types/catalog"
import { createStampDetailData } from "@/lib/data/list-catalog-data"
import { Skeleton } from "@/components/ui/skeleton";
import { generateStampCodeFromCatalogData } from "@/lib/utils/parse-stamp-code"

interface StampModalContentProps {
  stampData: StampData
  isLoading: boolean;
}

export function StampModalContent({ stampData, isLoading }: StampModalContentProps) {
  const stampDetailData = createStampDetailData(stampData)
  console.log(stampData)
  const selectedImage = stampData.stampImageUrl
  const details = stampData.stampDetailsJson ? JSON.parse(stampData.stampDetailsJson) : {}
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Image Skeleton */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-4">
            <Skeleton className="h-6 w-3/4 mb-4" />
            <Skeleton className="aspect-[3/4] w-full mb-4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>

        {/* Right Column - Details Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-4">
            <Skeleton className="h-6 w-1/2 mb-4" />
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-4">
            <Skeleton className="h-6 w-1/2 mb-4" />
            <div className="grid md:grid-cols-3 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-4">
            <Skeleton className="h-6 w-1/2 mb-4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg text-gray-700 dark:text-gray-300 mt-1">
          {stampDetailData.name}
        </h2>
        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
          <span>{stampDetailData.country}</span>
          <span>{generateStampCodeFromCatalogData(stampDetailData)}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Image */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
              Stamp Image
            </h3>
            
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-[3/4] border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 group">
                <Image
                  src={selectedImage}
                  alt={stampDetailData.name}
                  fill
                  className="object-contain p-2"
                />
                <button
                  onClick={() => setEnlargedImage(selectedImage)}
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
                  title="View larger image"
                >
                  <Maximize2 className="w-4 h-4 text-gray-700" />
                </button>
              </div>

              {/* Quick Info */}
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-3 rounded-lg">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Denomination:</span>
                    <span>{stampDetailData.denominationValue}{stampDetailData.denominationSymbol}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Color:</span>
                    <span>{stampDetailData.color}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Rarity:</span>
                    <Badge variant="outline" className="bg-white border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-200">
                      {stampDetailData.parsedDetails.rarityRating}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Technical Specifications */}
          <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
              Technical Specifications
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Perforation</label>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stampDetailData.parsedDetails.perforation}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Watermark</label>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stampDetailData.parsedDetails.watermark}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Printing Method</label>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stampDetailData.parsedDetails.printingMethod}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Paper Type</label>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stampDetailData.paperType}
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Gum Type</label>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stampDetailData.parsedDetails.gum}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Size</label>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stampDetailData.parsedDetails.size}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Market Information */}
          {stampDetailData.marketInfo && (
            <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                Market Information
              </h3>
              
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-black dark:text-white">
                    {stampDetailData.mintValue ? new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(stampDetailData.mintValue) : '-'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Mint Value</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-black dark:text-white">
                    {stampDetailData.usedValue ? new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(stampDetailData.usedValue) : '-'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Used Value</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-black dark:text-white">
                    {stampDetailData.rarity ? stampDetailData.rarity : '-'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Rarity</div>
                </div>
              </div>
            </div>
          )}

          {/* Bibliography */}
          <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
              Catalog Entry & Bibliography
            </h3>
            
            <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed font-sans">
              {stampDetailData.bibliography ? stampDetailData.bibliography : 'Bibliography Not Available'}
            </pre>
          </div>
        </div>
      </div>

      {/* Enlarged Image Modal */}
      {enlargedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="max-w-4xl max-h-[90vh] w-full">
            <div className="bg-white rounded-lg shadow-2xl relative">
              <div className="border-b flex justify-end p-3 pr-5">
                <button
                  onClick={() => setEnlargedImage(null)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors duration-200 z-10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <Image
                src={enlargedImage}
                alt="Enlarged stamp"
                width={800}
                height={750}
                className="w-full h-auto max-h-[85vh] object-contain rounded-xl p-2 shadow-inner"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 
