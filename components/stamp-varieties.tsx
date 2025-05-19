"use client"

import Link from "next/link"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { StampVariety } from "@/components/stamp-datastore"
import { useState } from "react"

interface StampVarietiesProps {
  varieties: StampVariety[]
  stampId: string
}

export default function StampVarieties({ varieties, stampId }: StampVarietiesProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredVarieties = varieties.filter(
    (variety) =>
      variety.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variety.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variety.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variety.color.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="relative">
        <Input
          placeholder="Search varieties..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md pr-10"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
      </div>

      {filteredVarieties.length === 0 ? (
        <div className="text-center py-12 border rounded-md">
          <h3 className="text-lg font-medium">No varieties found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVarieties.map((variety) => (
            <Card key={variety.id} className="overflow-hidden flex flex-col">
              <div className="aspect-square relative p-4 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <img
                  src={`/vintage-postage-stamp.png?height=200&width=160&query=${variety.name}, ${variety.color}, ${variety.year}`}
                  alt={variety.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <CardContent className="p-4 flex-grow">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {variety.code}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{variety.year}</span>
                </div>
                <h3 className="font-medium line-clamp-1">{variety.name}</h3>
                <div className="grid grid-cols-2 gap-x-2 text-xs mt-2">
                  <div>
                    <span className="font-medium">Color:</span> {variety.color}
                  </div>
                  <div>
                    <span className="font-medium">Condition:</span> {variety.condition}
                  </div>
                </div>
                <div className="mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {variety.rarity}
                  </Badge>
                </div>
                <p className="text-xs mt-2 line-clamp-2">{variety.description}</p>

                <div className="mt-2 text-xs">
                  <span className="font-medium">Catalog References:</span>
                  <div className="mt-1 grid grid-cols-2 gap-1">
                    {Object.entries(variety.catalogReferences).map(([catalog, code]) => (
                      <div key={catalog} className="flex justify-between">
                        <span className="text-muted-foreground">{catalog}:</span>
                        <span>{code}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button asChild className="w-full">
                  <Link href={`/catalog/${stampId}/${variety.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
