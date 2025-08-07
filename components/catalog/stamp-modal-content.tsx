import React from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { BookOpen, Share2, Calendar, MapPin, Award } from "lucide-react"
import { StampData, ParsedStampDetails, StampDetailData } from "@/types/catalog"
import { parseStampDetails, createStampDetailData } from "@/lib/data/list-catalog-data"
import { Skeleton } from "@/components/ui/skeleton";

interface StampModalContentProps {
  stampData: StampData
  isLoading: boolean;
}

export function StampModalContent({ stampData, isLoading }: StampModalContentProps) {
  const stampDetailData = createStampDetailData(stampData)
  const selectedImage = stampData.stampImageUrl
  const details = stampData.stampDetailsJson ? JSON.parse(stampData.stampDetailsJson) : {}

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
          <span>#{stampDetailData.catalogNumber}</span>
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
              <div className="relative aspect-[3/4] border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
                <Image
                  src={selectedImage}
                  alt={stampDetailData.name}
                  fill
                  className="object-contain p-2"
                />
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
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Designer</label>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stampDetailData.parsedDetails.designer}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Print Run</label>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stampDetailData.parsedDetails.printRun}
                  </div>
                </div>
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
                    {stampDetailData.marketInfo.mintValue}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Mint Value</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-black dark:text-white">
                    {stampDetailData.marketInfo.usedValue}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Used Value</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-black dark:text-white">
                    {stampDetailData.marketInfo.rarity}
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
              {stampDetailData.bibliography}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
} 
