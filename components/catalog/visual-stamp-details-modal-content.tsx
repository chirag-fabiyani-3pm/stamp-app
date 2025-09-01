import React from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, AlertCircle } from "lucide-react"
import { StampData, ModalType, AdditionalCategoryOption, ParsedStampDetails } from "@/types/catalog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
                      <p className="text-xs text-muted-foreground break-words">{stampItem.issueYear}</p>
                      <div className="mt-2 overflow-hidden">
                        <code className="bg-muted px-2 py-1 rounded text-xs break-all whitespace-pre-wrap word-break overflow-wrap-break-word max-w-full block text-foreground">
                          {decodeURIComponent(stampCode).split('|||').join('.')}
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
        <div className="lg:w-2/4 space-y-4">
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

          
        </div>

        {/* Right Column - Details and Market Data */}
        <div className="lg:w-2/4 space-y-6">
        {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-foreground">{stamp.name}</h2>
            <p className="text-lg text-muted-foreground">{stamp.seriesName}</p>
            <p className="text-sm text-muted-foreground">{stamp.country} • {stamp.issueYear}</p>
          </div>
          {/* Core Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  SERIES NAME
                </label>
                <p className="text-sm font-semibold text-foreground">
                  {stamp.seriesName}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  COLOR
                </label>
                <p className="text-sm font-semibold text-foreground">
                  {stamp.color}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  PERFORATION
                </label>
                <p className="text-sm font-semibold text-foreground">
                  {parsedDetails.perforation || "12.0"}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  DENOMINATION
                </label>
                <p className="text-sm font-semibold text-foreground">
                  {stamp.denominationValue}{stamp.denominationSymbol}
                </p>
              </div>
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
                  WATERMARK
                </label>
                <p className="text-sm font-semibold text-foreground">
                  {parsedDetails.watermark || "Star"}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  MINT VALUE
                </label>
                <p className="text-sm font-semibold text-foreground">
                  {stamp.mintValue ? `$${stamp.mintValue}` : "-"}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  FINEST USED PRICE
                </label>
                <p className="text-sm font-semibold text-foreground">
                  {stamp.finestUsedValue ? `$${stamp.finestUsedValue}` : "-"}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  USED PRICE
                </label>
                <p className="text-sm font-semibold text-foreground">
                  {stamp.usedValue ? `$${stamp.usedValue}` : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Stamp Instances */}
      <Card className="bg-gradient-to-r from-blue-900/10 to-green-900/10 border-blue-800/20 text-card-foreground">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-foreground">Stamp Instances</CardTitle>
            </CardHeader>
            <CardContent>
              {stamp.instances && stamp.instances.length > 0 ? (
                <div className="border rounded-lg overflow-hidden dark:border-gray-700">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-800">
                        <TableHead className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Name</TableHead>
                        <TableHead className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Mint</TableHead>
                        <TableHead className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Finest Used</TableHead>
                        <TableHead className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Used</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stamp.instances.map((instance) => (
                        <TableRow 
                          key={instance.id}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors bg-gray-50 dark:bg-gray-800"
                        >
                          <TableCell className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                            <div className="flex flex-col gap-1">
                              <span className="font-medium">{(instance as any).name}{(instance as any).catalogNumber ? ` (${(instance as any).catalogNumber})` : ''}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3 px-4 text-center">
                            {instance.mintValue ? (
                              <span className="bg-gray-100 text-gray-800 px-2 py-1 text-xs font-medium rounded dark:bg-gray-700 dark:text-gray-200">
                                ${instance.mintValue}
                              </span>
                            ) : (
                              <span className="text-gray-400 dark:text-gray-500 text-xs">-</span>
                            )}
                          </TableCell>
                          <TableCell className="py-3 px-4 text-center">
                            {instance.finestUsedValue ? (
                              <span className="bg-gray-100 text-gray-800 px-2 py-1 text-xs font-medium rounded dark:bg-gray-700 dark:text-gray-200">
                                ${instance.finestUsedValue}
                              </span>
                            ) : (
                              <span className="text-gray-400 dark:text-gray-500 text-xs">-</span>
                            )}
                          </TableCell>
                          <TableCell className="py-3 px-4 text-center">
                            {instance.usedValue ? (
                              <span className="bg-gray-100 text-gray-800 px-2 py-1 text-xs font-medium rounded dark:bg-gray-700 dark:text-gray-200">
                                ${instance.usedValue}
                              </span>
                            ) : (
                              <span className="text-gray-400 dark:text-gray-500 text-xs">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">No instances available</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">This stamp doesn't have any specific instances or varieties catalogued.</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
    </div>
  )
} 
