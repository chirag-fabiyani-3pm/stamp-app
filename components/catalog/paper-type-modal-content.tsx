import React, { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookOpen, ChevronRight, Search } from "lucide-react"
import { PaperTypeData, StampData } from "@/types/catalog"
import { getStampsForPaperType } from "@/lib/data/list-catalog-data"
import { Skeleton } from "@/components/ui/skeleton"

interface PaperTypeModalContentProps {
  paperTypeData: PaperTypeData
  stamps: StampData[]
  onStampClick: (stamp: StampData) => void
  isLoading: boolean;
}

export function PaperTypeModalContent({
  paperTypeData,
  stamps,
  onStampClick,
  isLoading
}: PaperTypeModalContentProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredStamps = useMemo(() => {
    if (!searchTerm) return stamps

    return stamps.filter(
      (stamp) =>
        stamp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stamp.catalogNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stamp.color.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [stamps, searchTerm])

  if (isLoading) {
    return (
      <div className="mt-4 p-4">
        <Skeleton className="h-8 w-1/2 mb-4" />
        <Skeleton className="h-4 w-3/4 mb-6" />

        <div className="border rounded-lg overflow-hidden dark:border-gray-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-400 dark:border-gray-600">
                <th className="text-left py-3 px-4 font-semibold bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"><Skeleton className="h-4 w-16" /></th>
                <th className="text-left py-3 px-4 font-semibold bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"><Skeleton className="h-4 w-32" /></th>
                <th className="text-center py-3 px-4 font-semibold bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"><Skeleton className="h-4 w-16" /></th>
                <th className="text-center py-3 px-4 font-semibold bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"><Skeleton className="h-4 w-16" /></th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-3 px-4"><Skeleton className="h-4 w-16" /></td>
                  <td className="py-3 px-4"><Skeleton className="h-4 w-48" /></td>
                  <td className="py-3 px-4 text-center"><Skeleton className="h-6 w-12 mx-auto" /></td>
                  <td className="py-3 px-4 text-center"><Skeleton className="h-6 w-12 mx-auto" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {/* Header */}
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
          {paperTypeData.description}
        </p>
        
        <hr className="border-gray-300 dark:border-gray-700 my-6" />

        {/* Search Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Search stamps by name, catalog number, or color..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 border-gray-300 focus:border-gray-500 bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:focus:border-amber-600 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stanley Gibbons Style Stamp Catalog Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-sm mb-8 max-w-5xl mx-auto rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {/* Table Header */}
            <thead>
              <tr className="border-b-2 border-gray-400 dark:border-gray-600">
                <th className="text-left py-3 px-4 font-semibold bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">SG No.</th>
                <th className="text-left py-3 px-4 font-semibold bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">Description</th>
                <th className="text-center py-3 px-4 font-semibold bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">Mint</th>
                <th className="text-center py-3 px-4 font-semibold bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">Used</th>
              </tr>
            </thead>
            <tbody>
              {filteredStamps.map((stamp, index) => {
                return (
                  <React.Fragment key={stamp.id}>
                    {/* Main stamp entry */}
                    <tr 
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                      onClick={() => onStampClick(stamp)}
                    >
                      <td className="py-3 px-4 font-medium text-black dark:text-gray-100">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4 text-black dark:text-gray-100">
                        {stamp.denominationValue}{stamp.denominationSymbol} {stamp.color}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 text-xs font-medium rounded dark:bg-gray-700 dark:text-gray-200">
                          {stamp.estimatedMarketValue ? `$${stamp.estimatedMarketValue.toFixed(2)}` : '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 text-xs font-medium rounded dark:bg-gray-700 dark:text-gray-200">
                          {stamp.actualPrice ? `$${stamp.actualPrice.toFixed(2)}` : '-'}
                        </span>
                      </td>
                    </tr>
                    
                    {/* Varieties/instances listed as separate rows with indentation */}
                    {stamp.instances && stamp.instances.map((instance) => (
                      <tr 
                        key={instance.id}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                        onClick={() => onStampClick(stamp)}
                      >
                        <td className="py-2 px-4 text-xs text-gray-600 dark:text-gray-400"></td>
                        <td className="py-2 px-4 text-xs text-gray-700 dark:text-gray-300 pl-8">
                          {instance.code && `${instance.code}. `}{instance.description}
                        </td>
                        <td className="py-2 px-4 text-center text-xs">
                          {instance.mintValue ? (
                            <span className={`px-1.5 py-0.5 text-xs rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200`}>
                              {instance.mintValue}
                            </span>
                          ) : <span className="px-1.5 py-0.5 text-xs rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200">-</span>}
                        </td>
                        <td className="py-2 px-4 text-center text-xs">
                          {instance.usedValue ? (
                            <span className={`px-1.5 py-0.5 text-xs rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200`}>
                              {instance.usedValue}
                            </span>
                          ) : <span className="px-1.5 py-0.5 text-xs rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200">-</span>}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredStamps.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            No stamps found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search criteria
          </p>
        </div>
      )}
    </div>
  )
} 
