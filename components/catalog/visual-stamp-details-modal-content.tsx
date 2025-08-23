import React from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, BookOpen, Share2, Calendar, MapPin, Award, AlertCircle } from "lucide-react"
import { StampData, ModalType, AdditionalCategoryOption, ParsedStampDetails } from "@/types/catalog"

import { Skeleton } from "@/components/ui/skeleton";

interface StampDetailsModalContentProps {
  data: { stamp?: StampData, stamps?: StampData[], partialCode?: string, missingFrom?: ModalType, categoryFilter?: AdditionalCategoryOption, baseStampCode?: string, showAsIndividualCards?: boolean, selectedAdditionalCategories?: string[], stampCode: string }
  onAdditionalCategoryClick?: (categoryType: string, stampCode: string) => void
  onStampClick?: (stamp: StampData, currentStampCode: string) => void
  isLoading: boolean;
}

export function StampDetailsModalContent({
  data,
  onAdditionalCategoryClick,
  onStampClick,
  isLoading
}: StampDetailsModalContentProps) {
  const { stamp, stamps, showAsIndividualCards, selectedAdditionalCategories, stampCode } = data;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Image Skeleton */}
          <div className="lg:w-1/3 space-y-4">
            <Skeleton className="w-full h-72 md:h-96 rounded-lg" />
            <Card className="bg-card text-card-foreground border border-border">
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details Skeleton */}
          <div className="lg:w-2/3 space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>

            <Card className="bg-gradient-to-r from-blue-900/10 to-green-900/10 border-blue-800/20 text-card-foreground">
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>

            <Card className="bg-card text-card-foreground border border-border">
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (stamps && stamps.length > 0) {
    if (showAsIndividualCards) {
      return (
        <div className="space-y-6 md:space-y-8">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Select Your Specimen</h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              Choose from these exceptional specimens to view detailed information.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {stamps.map((stampItem: StampData) => (
              <Card
                key={stampItem.id}
                className="hover:shadow-lg transition-shadow cursor-pointer bg-card text-card-foreground border border-border"
                onClick={() => onStampClick?.(stampItem, stampCode)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-center flex-shrink-0">
                      <Image
                        src={stampItem.stampImageUrl || '/images/stamps/no-image-available.png'}
                        alt={stampItem.name}
                        width={120}
                        height={160}
                        className="rounded border border-border"
                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                          const target = e.currentTarget;
                          if (target.src !== '/images/stamps/no-image-available.png') {
                            target.src = '/images/stamps/no-image-available.png';
                          }
                        }}
                      />
                    </div>
                    <div className="text-center space-y-2 min-w-0">
                      <h3 className="font-semibold text-sm break-words">{stampItem.name}</h3>
                      <p className="text-xs text-muted-foreground break-words">{stampItem.catalogNumber}</p>
                      <p className="text-xs text-muted-foreground break-words">
                        {stampItem.denominationValue}{stampItem.denominationSymbol} - {stampItem.color}
                      </p>
                      <p className="text-xs text-muted-foreground break-words">{stampItem.issueDate}</p>
                      <div className="mt-2 overflow-hidden">
                        <code className="bg-muted px-2 py-1 rounded text-xs break-all whitespace-pre-wrap word-break overflow-wrap-break-word max-w-full block text-foreground">
                          {decodeURIComponent(stampCode)}
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
    } else {
      return (
        <div className="space-y-6">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Collection Overview</h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              Multiple specimens found in this category.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {stamps.map((stampItem: StampData) => (
              <Card
                key={stampItem.id}
                className="hover:shadow-lg transition-shadow cursor-pointer bg-card text-card-foreground border border-border"
                onClick={() => onStampClick?.(stampItem, stampCode)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Image
                      src={stampItem.stampImageUrl}
                      alt={stampItem.name}
                      width={80}
                      height={100}
                      className="rounded border border-border"
                      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        const target = e.currentTarget;
                        if (target.src !== '/images/stamps/no-image-available.png') {
                          target.src = '/images/stamps/no-image-available.png';
                        }
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-foreground">{stampItem.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{stampItem.catalogNumber}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {stampItem.denominationValue}{stampItem.denominationSymbol} - {stampItem.color}
                        </span>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )
    }
  }

  if (!stamp) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          No Stamp Details Available
        </h3>
        <p className="text-muted-foreground">
          Unable to load stamp information at this time.
        </p>
      </div>
    )
  }

  const parsedDetails: ParsedStampDetails = stamp.stampDetailsJson ? JSON.parse(stamp.stampDetailsJson) : {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - Stamp Image and Basic Info */}
        <div className="lg:w-1/3 space-y-4">
          {/* Stamp Image */}
          <div className="relative w-full h-72 md:h-96">
            <Image
              src={stamp.stampImageUrl || '/images/stamps/no-image-available.png'}
              alt={stamp.name}
              fill
              className="object-contain rounded-lg border border-border shadow-lg"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                const target = e.currentTarget;
                if (target.src !== '/images/stamps/no-image-available.png') {
                  target.src = '/images/stamps/no-image-available.png';
                };
              }}
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="text-xs">
                {stamp.catalogNumber}
              </Badge>
            </div>
          </div>

          {/* Additional Categories (from image) */}
          <Card className="bg-card text-card-foreground border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-foreground">Additional Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Postal History Categories - Only show if not already selected */}
                {!selectedAdditionalCategories?.includes('postalHistory') && (
                  <button
                    className="p-2 text-xs bg-accent/20 hover:bg-accent/40 rounded border border-border text-left transition-colors text-foreground"
                    onClick={() => onAdditionalCategoryClick?.('postalHistory', stampCode)}
                  >
                    <div className="font-medium">Postal History</div>
                  </button>
                )}
                {!selectedAdditionalCategories?.includes('postmarks') && (
                  <button
                    className="p-2 text-xs bg-accent/20 hover:bg-accent/40 rounded border border-border text-left transition-colors text-foreground"
                    onClick={() => onAdditionalCategoryClick?.('postmarks', stampCode)}
                  >
                    <div className="font-medium">Postmarks</div>
                  </button>
                )}
                {!selectedAdditionalCategories?.includes('proofs') && (
                  <button
                    className="p-2 text-xs bg-accent/20 hover:bg-accent/40 rounded border border-border text-left transition-colors text-foreground"
                    onClick={() => onAdditionalCategoryClick?.('proofs', stampCode)}
                  >
                    <div className="font-medium">Proofs</div>
                  </button>
                )}
                {!selectedAdditionalCategories?.includes('essays') && (
                  <button
                    className="p-2 text-xs bg-accent/20 hover:bg-accent/40 rounded border border-border text-left transition-colors text-foreground"
                    onClick={() => onAdditionalCategoryClick?.('essays', stampCode)}
                  >
                    <div className="font-medium">Essays</div>
                  </button>
                )}
                {!selectedAdditionalCategories?.includes('onPiece') && (
                  <button
                    className="p-2 text-xs bg-accent/20 hover:bg-accent/40 rounded border border-border text-left transition-colors text-foreground"
                    onClick={() => onAdditionalCategoryClick?.('onPiece', stampCode)}
                  >
                    <div className="font-medium">On Piece</div>
                  </button>
                )}
                {!selectedAdditionalCategories?.includes('errors') && (
                  <button
                    className="p-2 text-xs bg-accent/20 hover:bg-accent/40 rounded border border-border text-left transition-colors text-foreground"
                    onClick={() => onAdditionalCategoryClick?.('errors', stampCode)}
                  >
                    <div className="font-medium">Errors</div>
                  </button>
                )}
                {!selectedAdditionalCategories?.includes('other') && (
                  <button
                    className="p-2 text-xs bg-accent/20 hover:bg-accent/40 rounded border border-border text-left transition-colors text-foreground"
                    onClick={() => onAdditionalCategoryClick?.('other', stampCode)}
                  >
                    <div className="font-medium">Other</div>
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Details and Market Data */}
        <div className="lg:w-2/3 space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-foreground">{stamp.name}</h2>
            <p className="text-lg text-muted-foreground">{stamp.seriesName}</p>
            <p className="text-sm text-muted-foreground">{stamp.country} • {stamp.issueDate}</p>
          </div>

          {/* Core Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  DESCRIPTION
                </label>
                <p className="text-sm font-semibold text-foreground">
                  {stamp.denominationValue}
                  {stamp.denominationSymbol} {stamp.color}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  CATALOGUE VALUE
                </label>
                <p className="text-sm font-semibold text-foreground">
                  ${parsedDetails.catalogPrice || "150.00"}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  MARKET PRICE
                </label>
                <p className="text-sm font-semibold text-foreground">
                  ${parsedDetails.currentMarketValue || "120.00"}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  PAPER TYPE
                </label>
                <p className="text-sm font-semibold text-foreground">
                  {stamp.paperType}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  CONDITION
                </label>
                <p className="text-sm font-semibold text-foreground">
                  {parsedDetails.condition || "Fine"}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  USAGE
                </label>
                <p className="text-sm font-semibold text-foreground">
                  {parsedDetails.usage || "Used"}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  PERFORATION
                </label>
                <p className="text-sm font-semibold text-foreground">
                  {parsedDetails.perforation || "12.0"}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  WATERMARK
                </label>
                <p className="text-sm font-semibold text-foreground">
                  {parsedDetails.watermark || "Star"}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  POSTAL HISTORY
                </label>
                <p className="text-sm font-semibold text-foreground">
                  {parsedDetails.postalHistoryType || "Standard"}
                </p>
              </div>
            </div>
          </div>

          {/* Market Value Box (Telescopic Style from Image) */}
          <Card className="bg-gradient-to-r from-blue-900/10 to-green-900/10 border-blue-800/20 text-card-foreground">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Market Value Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Price Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="bg-background rounded-lg p-3 border border-border">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">
                    Catalog
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    ${parsedDetails.catalogPrice || "150.00"}
                  </div>
                </div>
                <div className="bg-background rounded-lg p-3 border border-border">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">
                    Estimate
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    ${parsedDetails.estimatedValue || "120.00"}
                  </div>
                </div>
                <div className="bg-background rounded-lg p-3 border border-border">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">
                    Current
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    ${parsedDetails.currentMarketValue || "125.00"}
                  </div>
                </div>
              </div>

              {/* Price Factors */}
              <div className="bg-background rounded-lg p-4 border border-border">
                <h4 className="text-sm font-medium text-foreground mb-3">
                  Price Multipliers
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Condition:</span>
                    <span className="ml-2 font-semibold text-blue-600">
                      {parsedDetails.priceFactors?.condition || "1.0x"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Usage:</span>
                    <span className="ml-2 font-semibold text-green-600">
                      {parsedDetails.priceFactors?.usage || "1.0x"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <span className="ml-2 font-semibold text-purple-600">
                      {parsedDetails.priceFactors?.postalHistory || "1.0x"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Sales (Telescopic Chart Area) */}
              <div className="bg-background rounded-lg p-4 border border-border">
                <h4 className="text-sm font-medium text-foreground mb-3">
                  Recent Sales History
                </h4>
                <div className="space-y-2">
                  {parsedDetails.recentSales?.map((sale: any, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-border last:border-0"
                    >
                      <div className="text-sm text-muted-foreground">
                        {sale.date} • {sale.venue}
                      </div>
                      <div className="text-sm font-semibold text-green-600">
                        ${sale.adjustedPrice}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bibliography */}
          <Card className="bg-card text-card-foreground border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-foreground">Catalog Entry & Bibliography</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed font-sans">
                {stamp.stampDetailsJson ? JSON.parse(stamp.stampDetailsJson).bibliography : "No bibliography available."}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 
