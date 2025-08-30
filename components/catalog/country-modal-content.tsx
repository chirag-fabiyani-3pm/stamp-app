import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, BookOpen, ChevronRight } from "lucide-react"
import { CountryData, YearData } from "@/types/catalog"
import { Skeleton } from "@/components/ui/skeleton"

interface CountryModalContentProps {
  country: CountryData
  years: YearData[]
  onYearClick: (year: YearData) => void
  isLoading: boolean;
}

export function CountryModalContent({
  country,
  years,
  onYearClick,
  isLoading
}: CountryModalContentProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredYears = useMemo(() => {
    if (!searchTerm) return years

    return years.filter(
      (year) =>
        year.year.toString().includes(searchTerm) ||
        year.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [years, searchTerm])

  if (isLoading) {
    return (
      <div className="space-y-4 mt-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-6">
            <div className="grid lg:grid-cols-12 gap-6">
              <div className="lg:col-span-2">
                <Skeleton className="h-6 w-1/2 mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="lg:col-span-7">
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
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
      {/* Header Info */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-gray-600 dark:text-gray-400">
              {country.description}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Period: {country.yearStart}-{country.yearEnd} | Code: {country.code}
            </p>
          </div>
        </div>

        <hr className="border-gray-300 dark:border-gray-700 mb-6" />

        {/* Search Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Search years by year or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 border-gray-300 focus:border-gray-500 bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:focus:border-amber-600 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Country Statistics */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-black dark:text-white">
              {years.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Years</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-black dark:text-white">
              {years.reduce((sum, year) => sum + year.totalReleases, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Releases</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-black dark:text-white">
              {country.yearEnd - country.yearStart}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Years Span</div>
          </div>
        </div>
      </div>

      {/* Years Listing */}
      <div className="space-y-4">
        {filteredYears.map((yearData) => (
          <div key={yearData.id} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-6">
            <div className="grid lg:grid-cols-12 gap-6">
              
              {/* Left Column: Year Info */}
              <div className="lg:col-span-2">
                <div className="text-center lg:text-left space-y-2">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {yearData.year}
                  </div>
                  <div className="text-sm text-gray-600">
                    {yearData.totalReleases} releases
                  </div>
                </div>
              </div>

              {/* Center Column: Year Description */}
              <div className="lg:col-span-7">
                <div className="mb-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {yearData.description}
                  </p>
                </div>
              </div>

              {/* Right Column: Action Button */}
              <div className="lg:col-span-3">
                <div className="text-center lg:text-right">
                  <Button 
                    variant="outline" 
                    className="bg-white border-gray-300 text-black hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600 w-full lg:w-auto"
                    onClick={() => onYearClick(yearData)}
                  >
                    View Releases
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {filteredYears.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            No years found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search criteria
          </p>
        </div>
      )}
    </div>
  )
} 
