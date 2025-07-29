import React, { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookOpen, ChevronRight, Search } from "lucide-react"
import { CategoryData, PaperTypeData } from "@/types/catalog"
import { generatePaperTypesData } from "@/lib/data/list-catalog-data"
import { Skeleton } from "@/components/ui/skeleton"

interface CategoryModalContentProps {
  categoryData: CategoryData
  onPaperTypeClick: (paperType: PaperTypeData) => void
  isLoading: boolean;
}

export function CategoryModalContent({
  categoryData,
  onPaperTypeClick,
  isLoading
}: CategoryModalContentProps) {
  const [paperTypes, setPaperTypes] = useState<PaperTypeData[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const loadPaperTypes = async () => {
      const data = await generatePaperTypesData(categoryData.id, categoryData.totalPaperTypes)
      setPaperTypes(data)
    }
    if (!isLoading) {
      loadPaperTypes()
    }
  }, [categoryData, isLoading])

  const filteredPaperTypes = useMemo(() => {
    if (!searchTerm) return paperTypes
    
    return paperTypes.filter(paperType => 
      paperType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paperType.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [paperTypes, searchTerm])

  if (isLoading) {
    return (
      <div className="space-y-4 mt-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-6">
            <div className="grid lg:grid-cols-12 gap-6">
              <div className="lg:col-span-1">
                <Skeleton className="h-6 w-1/2" />
              </div>
              <div className="lg:col-span-8">
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-1/2 mt-2" />
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
        <p className="text-gray-600 dark:text-gray-400">
          {categoryData.description}
        </p>
        
        <hr className="border-gray-300 dark:border-gray-700 my-6" />

        {/* Search Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Search paper types by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 border-gray-300 focus:border-gray-500 bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:focus:border-amber-600 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Paper Types Listing */}
      <div className="space-y-4">
        {filteredPaperTypes.map((paperType) => (
          <div key={paperType.id} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-6">
            <div className="grid lg:grid-cols-12 gap-6">
              
              {/* Left Column: Code */}
              <div className="lg:col-span-1">
                <div className="text-center lg:text-left">
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {paperType.code}
                  </div>
                </div>
              </div>

              {/* Center Column: Paper Type Details */}
              <div className="lg:col-span-8">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{paperType.name}</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {paperType.description}
                  </p>
                  <div className="mt-2 text-sm text-gray-600">
                    {paperType.totalStamps} stamps
                  </div>
                </div>
              </div>

              {/* Right Column: Action Button */}
              <div className="lg:col-span-3">
                <div className="text-center lg:text-right">
                  <Button 
                    variant="outline" 
                    className="bg-white border-gray-300 text-black hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600 w-full lg:w-auto"
                    onClick={() => onPaperTypeClick(paperType)}
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

      {filteredPaperTypes.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            No paper types found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search criteria
          </p>
        </div>
      )}
    </div>
  )
} 