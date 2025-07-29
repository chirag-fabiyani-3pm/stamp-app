"use client"

import React from "react"
import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bookmark, Eye } from "lucide-react"
import { SOACode } from "./soa-code"
import { StampHierarchy } from "./stamp-hierarchy"

// Sample variety data for demonstration
interface StampVariety {
  id: string
  name: string
  image: string
  features: string[]
  catalogNumbers: { soa: number; sg?: string; scott?: string; michel?: string }
  description: string
  marketValue?: string
}

const varietiesByStampId: Record<string, StampVariety[]> = {
  "stamp-1": [
    {
      id: "stamp-1-var1",
      name: "Standard Issue (No Watermark)",
      image: "https://placehold.co/400x400/e2e8f0/1e293b?text=1.1",
      features: ["Standard"],
      catalogNumbers: { soa: 1, sg: "1", scott: "1", michel: "1" },
      description: "1855 1d Red, Standard Issue without watermark",
      marketValue: "$5,000 - $7,500",
    },
    {
      id: "stamp-1-var2",
      name: "Damaged Plate",
      image: "https://placehold.co/400x400/e2e8f0/1e293b?text=1.2",
      features: ["E"],
      catalogNumbers: { soa: 1, sg: "1a", scott: "1var", michel: "1I" },
      description: "1855 1d Red with plate damage in corner",
      marketValue: "$7,500 - $9,000",
    },
    {
      id: "stamp-1-var3",
      name: "Local Rouletted",
      image: "https://placehold.co/400x400/e2e8f0/1e293b?text=1.3",
      features: ["E", "Imp"],
      catalogNumbers: { soa: 1, sg: "1b", scott: "1a", michel: "1II" },
      description: "1855 1d Red with local rouletted edges",
      marketValue: "$12,000 - $15,000",
    },
  ],
  "stamp-8": [
    {
      id: "stamp-8-var1",
      name: "Standard Issue",
      image: "https://placehold.co/400x400/e2e8f0/1e293b?text=8.1",
      features: ["Standard"],
      catalogNumbers: { soa: 8, sg: "8", scott: "8", michel: "8" },
      description: "6d Brown, Standard Issue",
      marketValue: "$4,500 - $5,500",
    },
    {
      id: "stamp-8-var2",
      name: "Watermark",
      image: "https://placehold.co/400x400/e2e8f0/1e293b?text=8.2",
      features: ["Wmk"],
      catalogNumbers: { soa: 8, sg: "8a", scott: "8a", michel: "8a" },
      description: "6d Brown with watermark",
      marketValue: "$6,000 - $7,200",
    },
  ],
  "stamp-10": [
    {
      id: "stamp-10-var1",
      name: "Standard Issue",
      image: "https://placehold.co/400x400/e2e8f0/1e293b?text=10.1",
      features: ["Imp"],
      catalogNumbers: { soa: 10, sg: "10", scott: "10", michel: "10" },
      description: "1857 6d Brown Imperforate (Chalon Head)",
      marketValue: "$6,500 - $8,200",
    },
    {
      id: "stamp-10-var2",
      name: "Script Watermark",
      image: "https://placehold.co/400x400/e2e8f0/1e293b?text=10.2",
      features: ["Wmk", "scr"],
      catalogNumbers: { soa: 10, sg: "10a", scott: "10var", michel: "10a" },
      description: "1857 6d Brown with Script Watermark",
      marketValue: "$8,500 - $12,000",
    },
    {
      id: "stamp-10-var3",
      name: "Damaged Plate",
      image: "https://placehold.co/400x400/e2e8f0/1e293b?text=10.3",
      features: ["Imp", "E"],
      catalogNumbers: { soa: 10, sg: "10b", scott: "10b", michel: "10c" },
      description: "1857 6d Brown with damaged plate in upper right",
      marketValue: "$10,000 - $12,500",
    },
    {
      id: "stamp-10-var4",
      name: "Double Impression",
      image: "https://placehold.co/400x400/e2e8f0/1e293b?text=10.4",
      features: ["Imp", "E"],
      catalogNumbers: { soa: 10, sg: "10c", scott: "10c", michel: "10d" },
      description: "1857 6d Brown with double impression",
      marketValue: "$15,000 - $18,000",
    },
  ],
}

// Color number mapping for Chalon stamps
const colorNumberMap: Record<string, {number: number, name: string}> = {
  "1D": { number: 1, name: "Red" },
  "1D-brown": { number: 2, name: "Brown" },
  "2D": { number: 3, name: "Blue" },
  "2D-orange": { number: 4, name: "Orange" },
  "3D": { number: 5, name: "Lilac" },
  "4D-rose": { number: 6, name: "Rose" },
  "4D": { number: 7, name: "Yellow" },
  "6D": { number: 8, name: "Brown" },
  "6D-black": { number: 9, name: "Black Brown" },
  "6D-blue": { number: 10, name: "Blue" },
  "1S": { number: 11, name: "Green" },
}

interface StampCardProps {
  id: string
  title: string
  image: string
  year: string
  country: string
  denomination: string
  catalogNumbers: {
    soa: number
    sg?: string
    scott?: string
    michel?: string
  }
  description?: string
  marketValue?: string
  features?: string[]
}

export function StampCard({
  id,
  title,
  image,
  year,
  country,
  denomination,
  catalogNumbers,
  description,
  marketValue,
  features = [],
}: StampCardProps) {
  const [showHierarchy, setShowHierarchy] = useState(false)
  
  // Two-letter year code
  const yearCode = year.slice(-2)
  
  // Get color details for the stamp
  const colorKey = denomination.toLowerCase() === denomination ? 
    denomination.toUpperCase() : denomination;
  const colorInfo = colorNumberMap[colorKey] || { number: 0, name: "Unknown" };
  
  // Get varieties for this stamp type, or empty array if none
  const stampVarieties = varietiesByStampId[id] || [];
  
  // Prepare stamp type data for the hierarchy component
  const stampTypeData = {
    id,
    title,
    image,
    denomination,
    country,
    year,
    description: description || "",
    colorNumber: colorInfo.number,
    colorName: colorInfo.name
  };
  
  return (
    <>
      <Card className="overflow-hidden cursor-pointer dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700" onClick={() => setShowHierarchy(true)}>
        <div className="relative aspect-square overflow-hidden bg-muted/20 dark:bg-gray-700">
          <Image 
            src={image} 
            alt={title}
            fill
            className="object-cover transition-all hover:scale-105"
          />
        </div>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <SOACode 
              stampNumber={catalogNumbers.soa}
              country={country}
              year={yearCode}
              denomination={denomination}
              features={features}
              description={description}
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                // Add to favorites logic would go here
              }}
            >
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
          <CardTitle className="text-base dark:text-gray-100">{title}</CardTitle>
          <CardDescription className="dark:text-gray-300">{description}</CardDescription>
        </CardHeader>
        <CardContent className="text-sm pb-2">
          <div className="grid grid-cols-2 gap-1">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground dark:text-gray-400">Country</span>
              <span>{country}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground dark:text-gray-400">Year</span>
              <span>{year}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground dark:text-gray-400">Denomination</span>
              <span>{denomination}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground dark:text-gray-400">Market Value</span>
              <span className="font-medium dark:text-gray-100">{marketValue || "—"}</span>
            </div>
          </div>
          
          {(catalogNumbers.sg || catalogNumbers.scott || catalogNumbers.michel) && (
            <div className="mt-3 pt-3 border-t dark:border-gray-700 flex flex-wrap gap-2">
              {catalogNumbers.sg && (
                <Badge variant="outline" className="text-xs dark:text-gray-300 dark:border-gray-600">
                  SG {catalogNumbers.sg}
                </Badge>
              )}
              {catalogNumbers.scott && (
                <Badge variant="outline" className="text-xs dark:text-gray-300 dark:border-gray-600">
                  Scott {catalogNumbers.scott}
                </Badge>
              )}
              {catalogNumbers.michel && (
                <Badge variant="outline" className="text-xs dark:text-gray-300 dark:border-gray-600">
                  Michel {catalogNumbers.michel}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-0">
          <Button 
            variant="secondary" 
            size="sm" 
            className="w-full gap-1 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
            onClick={(e) => {
              e.stopPropagation();
              setShowHierarchy(true);
            }}
          >
            <Eye className="h-4 w-4" />
            <span>View Varieties</span>
          </Button>
        </CardFooter>
      </Card>
      
      {showHierarchy && (
        <StampHierarchy 
          stampType={stampTypeData}
          varieties={stampVarieties}
          onClose={() => setShowHierarchy(false)}
        />
      )}
    </>
  )
} 