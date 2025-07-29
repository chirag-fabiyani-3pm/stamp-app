import React, { useState, useMemo } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ChevronRight } from "lucide-react"
import { CountryOption, StampGroupOption } from "@/types/catalog"
import { Skeleton } from "@/components/ui/skeleton";

interface CountryModalContentProps {
  data: { country: CountryOption, stampGroups: StampGroupOption[] }
  onStampGroupClick: (group: StampGroupOption) => void
  isLoading: boolean;
}

export function CountryModalContent({
  data,
  onStampGroupClick,
  isLoading
}: CountryModalContentProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredStampGroups = useMemo(() => {
    if (!searchTerm) return data.stampGroups

    return data.stampGroups.filter(group =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.catalogNumber.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [data.stampGroups, searchTerm])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full max-w-md mx-auto" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="cursor-pointer bg-card text-card-foreground border border-border">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
                  <Skeleton className="w-16 h-20 rounded border" />
                  <div className="flex-1 text-center sm:text-left w-full space-y-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                  <Skeleton className="h-4 w-4 hidden sm:block" />
                </div>
              </CardContent>
            </Card>
          ))}
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
          placeholder="Search stamp groups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-background text-foreground border border-input focus:border-primary"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStampGroups.map((group) => (
          <Card
            key={group.id}
            className="cursor-pointer hover:shadow-lg transition-shadow bg-card text-card-foreground border border-border"
            onClick={() => onStampGroupClick(group)}
          >
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
                <Image
                  src={group.stampImageUrl}
                  alt={group.name}
                  width={60}
                  height={80}
                  className="rounded border border-border flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = '/images/stamps/no-image-available.png'
                  }}
                />
                <div className="flex-1 text-center sm:text-left w-full">
                  <h3 className="font-semibold text-sm break-words">{group.name}</h3>
                  <p className="text-xs text-muted-foreground break-words">#{group.catalogNumber}</p>
                  <p className="text-xs text-muted-foreground break-words">{group.totalStamps} stamps</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 hidden sm:block" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 