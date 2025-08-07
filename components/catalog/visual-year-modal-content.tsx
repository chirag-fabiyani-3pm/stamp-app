import React, { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Archive, Calendar, ChevronRight, Search } from "lucide-react"
import { SeriesOption, YearOption } from "@/types/catalog"
import { Skeleton } from "@/components/ui/skeleton";

interface YearModalContentProps {
  data: { series: SeriesOption, years: YearOption[] }
  onYearClick: (year: YearOption) => void
  isLoading: boolean;
}

export function YearModalContent({
  data,
  onYearClick,
  isLoading
}: YearModalContentProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredYears = useMemo(() => {
    if (!searchTerm) return data.years

    return data.years.filter(year =>
      year.year.toString().includes(searchTerm) ||
      year.firstIssue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      year.lastIssue.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [data.years, searchTerm])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full max-w-md mx-auto" />
        <div className="w-full overflow-x-auto">
          <div className="bg-card rounded-lg border border-border shadow-sm min-w-[600px] w-full">
            <div className="border-b border-border bg-muted/50 px-4 py-2">
              <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                <Skeleton className="h-4 w-10 col-span-1 hidden md:block" />
                <Skeleton className="h-4 w-1/2 col-span-2" />
                <Skeleton className="h-4 w-1/2 col-span-3 hidden md:block" />
                <Skeleton className="h-4 w-1/2 col-span-3 hidden lg:block" />
                <Skeleton className="h-4 w-1/2 col-span-2" />
                <Skeleton className="h-4 w-4 col-span-1 hidden md:block" />
              </div>
            </div>
            <div className="divide-y divide-border">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-4 py-3">
                  <div className="grid grid-cols-12 gap-4 items-center text-sm">
                    <Skeleton className="h-5 w-5 col-span-1 hidden md:block" />
                    <Skeleton className="h-6 w-1/3 col-span-2" />
                    <Skeleton className="h-4 w-3/4 col-span-3 hidden md:block" />
                    <Skeleton className="h-4 w-3/4 col-span-3 hidden lg:block" />
                    <Skeleton className="h-4 w-1/3 col-span-2" />
                    <Skeleton className="h-4 w-4 col-span-1 hidden md:block" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search years..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-background text-foreground border border-input focus:border-primary"
        />
      </div>

      <div className="w-full overflow-x-auto">
        <div className="bg-card rounded-lg border border-border shadow-sm min-w-[600px] max-w-[600px] mx-auto">
          {/* Years Table Header */}
          <div className="border-b border-border bg-muted/50 px-4 py-2">
            <div className="grid grid-cols-4 gap-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              <div className="col-span-1 text-center"></div>
              <div className="col-span-1 text-left">Year</div>
              <div className="col-span-1 text-right">Total Stamps</div>
              <div className="col-span-1 text-right"></div>
            </div>
          </div>

          {/* Years Rows */}
          <div className="divide-y divide-border">
            {filteredYears.map((year) => (
              <div
                key={year.year}
                className="cursor-pointer px-4 py-3 hover:bg-muted/70 transition-colors"
                onClick={() => onYearClick(year)}
              >
                <div className="grid grid-cols-4 gap-4 items-center text-sm">
                  <div className="col-span-1 text-center">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="col-span-1 font-bold text-lg text-foreground">
                    {year.year}
                  </div>
                  <div className="col-span-1 text-right font-medium text-muted-foreground">
                    <div className="flex items-center justify-end space-x-1">
                      <Archive className="h-4 w-4 text-muted-foreground" />
                      <span>{year.totalStamps}</span>
                    </div>
                  </div>
                  <div className="col-span-1 text-right flex justify-end">
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 
