"use client"

import React from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SOACode } from "./soa-code"
import { Badge } from "@/components/ui/badge"

interface StampVariety {
  id: string
  name: string
  image: string
  features: string[]
  catalogNumbers: {
    soa: number
    sg?: string
    scott?: string
    michel?: string
  }
  description: string
  marketValue?: string
}

interface StampHierarchyProps {
  stampType: {
    id: string
    title: string
    image: string
    denomination: string
    country: string
    year: string
    description: string
    colorNumber: number
    colorName: string
  }
  varieties: StampVariety[]
  onClose: () => void
}

export function StampHierarchy({ stampType, varieties, onClose }: StampHierarchyProps) {
  // Group varieties by feature type
  const groupedVarieties: Record<string, StampVariety[]> = {}
  
  varieties.forEach(variety => {
    const primaryFeature = variety.features[0] || "Standard"
    
    if (!groupedVarieties[primaryFeature]) {
      groupedVarieties[primaryFeature] = []
    }
    
    groupedVarieties[primaryFeature].push(variety)
  })
  
  // Get feature explanations for display
  const featureLabels: Record<string, string> = {
    "Imp": "Imperforate",
    "Wmk": "Watermark",
    "Rprt": "Reprint",
    "Oprt": "Overprint",
    "E": "Error/Variety",
    "Standard": "Standard Issue"
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="border-b p-4 flex items-center justify-between sticky top-0 bg-background z-10">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 relative">
              <Image 
                src={stampType.image} 
                alt={stampType.title}
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold">{stampType.title}</h2>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono">
                  {stampType.country}-{stampType.year.slice(-2)}-{stampType.denomination}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Color #{stampType.colorNumber}: {stampType.colorName}
                </Badge>
              </div>
            </div>
          </div>
          
          <button 
            onClick={onClose} 
            className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-muted"
          >
            <span className="sr-only">Close</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium mb-3">Stamp Hierarchy Tree</h3>
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 p-2 bg-muted mb-2 rounded">
                    <div className="h-8 w-8 relative">
                      <Image 
                        src={stampType.image} 
                        alt={stampType.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="font-medium">{stampType.title}</span>
                  </div>
                  
                  <div className="ml-4 pl-4 border-l">
                    {Object.entries(groupedVarieties).map(([feature, vars]) => (
                      <div key={feature} className="mb-4">
                        <div className="flex items-center gap-2 p-2 bg-muted/70 rounded mb-2">
                          <Badge variant="outline">{featureLabels[feature] || feature}</Badge>
                          <span className="text-sm text-muted-foreground">({vars.length} varieties)</span>
                        </div>
                        
                        <div className="ml-4 pl-4 border-l">
                          {vars.map(variety => (
                            <div key={variety.id} className="flex items-center gap-2 p-2 hover:bg-muted/30 rounded my-1">
                              <div className="h-6 w-6 relative">
                                <Image 
                                  src={variety.image} 
                                  alt={variety.name}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm">{variety.name}</span>
                                <SOACode 
                                  stampNumber={variety.catalogNumbers.soa}
                                  country={stampType.country}
                                  year={stampType.year.slice(-2)}
                                  denomination={stampType.denomination}
                                  features={variety.features}
                                  description={variety.description}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Stamp Details</h3>
              <Card>
                <CardHeader>
                  <CardTitle>Full Face Queens Group - the Chalons</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-square max-w-xs mx-auto relative">
                    <Image 
                      src={stampType.image} 
                      alt={stampType.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Denomination:</span> {stampType.denomination}
                    </div>
                    <div>
                      <span className="font-medium">Color Number:</span> {stampType.colorNumber}
                    </div>
                    <div>
                      <span className="font-medium">Color Name:</span> {stampType.colorName}
                    </div>
                    <div>
                      <span className="font-medium">Year of Issue:</span> {stampType.year}
                    </div>
                    <div>
                      <span className="font-medium">Description:</span>
                      <p className="text-sm mt-1">{stampType.description}</p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-3 mt-3">
                    <p className="text-sm text-muted-foreground">
                      This stamp is part of the Full Face Queens Group (the Chalons) from New Zealand.
                      Click on any variety in the hierarchy tree to see more details.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 