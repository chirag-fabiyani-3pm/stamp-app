import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookOpen, ChevronRight, Search, Tag } from "lucide-react"
import { SeriesData, TypeData } from "@/types/catalog"
import { Skeleton } from "@/components/ui/skeleton"

interface SeriesModalContentProps {
  series: SeriesData
  types: TypeData[]
  onTypeClick: (type: TypeData) => void
  isLoading: boolean;
}

export function SeriesModalContent({
  series,
  types,
  onTypeClick,
  isLoading
}: SeriesModalContentProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTypes = useMemo(() => {
    if (!searchTerm) return types

    return types.filter(
      (type) =>
        type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        type.catalogPrefix.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [types, searchTerm])

  if (isLoading) {
    return (
      <div className="space-y-4 mt-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1 min-w-0">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3 mt-1" />
              </div>
              <div className="flex justify-start md:justify-end">
                <Skeleton className="h-10 w-32 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Header Info */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Period: {series.periodStart}-{series.periodEnd}
            </p>
          </div>
        </div>

        {/* Series Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mb-6 border border-gray-300 dark:border-gray-700 py-4 rounded-lg">
          <div className="px-2">
            <div className="text-2xl font-bold text-black dark:text-white">
              {types.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Types</div>
          </div>
          <div className="px-2 sm:border-l sm:border-r border-gray-300 dark:border-gray-700">
            <div className="text-2xl font-bold text-black dark:text-white">
              {types.reduce((sum, type) => sum + type.totalStampGroups, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Stamp Groups</div>
          </div>
          <div className="px-2">
            <div className="text-2xl font-bold text-black dark:text-white">
              {series.periodEnd - series.periodStart}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Years</div>
          </div>
        </div>

        {/* Search Controls */}
        <div className="mb-4 md:mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              placeholder="Search types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 border-gray-300 focus:border-gray-500 bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:focus:border-amber-600 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Types Listing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredTypes.map((typeData) => (
          <div key={typeData.id} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-4 md:p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              {/* Type Info */}
              <div className="flex items-start space-x-3 flex-1 min-w-0">
                <div className="flex-shrink-0 mt-1">
                  <Tag className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                    {typeData.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {typeData.totalStampGroups} stamp groups
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex-shrink-0 w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto bg-white border-gray-300 text-black hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  onClick={() => onTypeClick(typeData)}
                >
                  View Details
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

            </div>
          </div>
        ))}
      </div>

      {filteredTypes.length === 0 && (
        <div className="text-center py-8 md:py-12">
          <BookOpen className="h-10 w-10 md:h-12 md:w-12 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
          <h3 className="text-base md:text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            No types found
          </h3>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
            Try adjusting your search criteria
          </p>
        </div>
      )}
    </div>
  )
} 
