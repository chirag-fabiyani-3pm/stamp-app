import React, { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookOpen, ChevronRight, Search } from "lucide-react"
import { StampGroupData, TypeData } from "@/types/catalog"
import { getStampGroupsForType } from "@/lib/data/list-catalog-data"
import { Skeleton } from "@/components/ui/skeleton"

interface TypeModalContentProps {
  typeData: TypeData
  stampGroups: StampGroupData[]
  onStampGroupClick: (stampGroup: StampGroupData) => void
  isLoading: boolean;
}

export function TypeModalContent({
  typeData,
  stampGroups,
  onStampGroupClick,
  isLoading
}: TypeModalContentProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredStampGroups = useMemo(() => {
    if (!searchTerm) return stampGroups
    
    return stampGroups.filter(group => 
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.watermark.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.printer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [stampGroups, searchTerm])

  if (isLoading) {
    return (
      <div className="space-y-4 mt-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-6">
            <div className="grid lg:grid-cols-12 gap-6">
              <div className="lg:col-span-2">
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="lg:col-span-7">
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="lg:col-span-3 flex justify-center lg:justify-end items-center">
                <Skeleton className="h-10 w-32 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-4">
            {/* Header */}
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
          {typeData.description}
        </p>
        
        <hr className="border-gray-300 dark:border-gray-700 my-6" />

        {/* Search Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Search stamp groups by name, watermark, or printer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 border-gray-300 focus:border-gray-500 bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:focus:border-amber-600 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stamp Groups Listing */}
      <div className="space-y-4">
        {filteredStampGroups.map((stampGroup) => (
          <div key={stampGroup.id} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-6">
            <div className="grid lg:grid-cols-12 gap-6">
              
              {/* Left Column: Basic Info */}
              <div className="lg:col-span-2">
                <div className="text-center lg:text-left space-y-2">
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {stampGroup.year}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stampGroup.totalStamps} stamps
                  </div>
                </div>
              </div>

              {/* Center Column: Stamp Group Details */}
              <div className="lg:col-span-7">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {stampGroup.name}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    {stampGroup.description}
                  </p>
                  
                  {/* Technical Details */}
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">Watermark:</span>
                      <span className="ml-2 text-gray-700 dark:text-gray-300">{stampGroup.watermark}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">Perforation:</span>
                      <span className="ml-2 text-gray-700 dark:text-gray-300">{stampGroup.perforation}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">Printing:</span>
                      <span className="ml-2 text-gray-700 dark:text-gray-300">{stampGroup.printingMethod}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">Printer:</span>
                      <span className="ml-2 text-gray-700 dark:text-gray-300">{stampGroup.printer}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Action Button */}
              <div className="lg:col-span-3">
                <div className="text-center lg:text-right">
                  <Button 
                    variant="outline" 
                    className="bg-white border-gray-300 text-black hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600 w-full lg:w-auto"
                    onClick={() => onStampGroupClick(stampGroup)}
                  >
                    View Stamps
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {filteredStampGroups.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            No stamp groups found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search criteria
          </p>
        </div>
      )}
    </div>
  )
} 
