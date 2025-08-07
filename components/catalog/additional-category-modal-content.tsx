import React, { useState, useMemo } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ChevronRight } from "lucide-react"
import { AdditionalCategoryOption } from "@/types/catalog"

interface AdditionalCategoryModalContentProps {
  data: { categoryType: string; categories: AdditionalCategoryOption[]; stampCode: string }
  onCategoryOptionClick: (
    category: AdditionalCategoryOption,
    categoryType: string,
    stampCode: string
  ) => void
}

export function AdditionalCategoryModalContent({
  data,
  onCategoryOptionClick,
}: AdditionalCategoryModalContentProps) {
  const { categoryType, categories, stampCode } = data
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories

    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.code.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [categories, searchTerm])

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder={`Search ${categoryType}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-background text-foreground border border-input focus:border-primary"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((category) => (
          <Card
            key={category.code}
            className="cursor-pointer hover:shadow-lg transition-shadow bg-card text-card-foreground border border-border"
            onClick={() => onCategoryOptionClick(category, categoryType, stampCode)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Image
                  src={category.stampImageUrl}
                  alt={category.name}
                  width={60}
                  height={80}
                  className="rounded border border-border flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = "/images/stamps/no-image-available.png"
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold break-words">{category.name}</h3>
                  <p className="text-sm text-muted-foreground break-words">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {category.totalStamps} stamps
                    </Badge>
                    {category.rarity && (
                      <Badge variant="outline" className="text-xs">
                        Rarity: {category.rarity}
                      </Badge>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 
