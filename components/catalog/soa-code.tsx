"use client"

import React, { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { InfoIcon } from "lucide-react"

interface SOACodeProps {
  stampNumber: number
  country: string
  year: string
  denomination: string
  features?: string[]
  description?: string
}

export function SOACode({
  stampNumber,
  country,
  year,
  denomination,
  features = [],
  description,
}: SOACodeProps) {
  const [expanded, setExpanded] = useState<number>(0)
  
  // Format code with just the number
  const simpleCode = `${stampNumber}`
  
  // Format basic catalog code
  const basicCode = `${country}-${year}-${denomination}`
  
  // Format full catalog code with features
  const fullCode = features.length > 0 ? `${basicCode}-${features.join(".")}` : basicCode
  
  // Feature explanations
  const featureExplanations: Record<string, string> = {
    "Imp": "Imperforate",
    "Wmk": "Watermark",
    "Rprt": "Reprint",
    "Oprt": "Overprint",
    "E": "Error/Variety",
    "scr": "Script watermark"
  }
  
  const handleClick = () => {
    setExpanded((prev) => (prev + 1) % 3)
  }
  
  const getDisplayCode = () => {
    switch (expanded) {
      case 0:
        return simpleCode
      case 1:
        return basicCode
      case 2:
        return fullCode
      default:
        return simpleCode
    }
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      <Badge 
        variant="outline" 
        className="font-mono cursor-pointer hover:bg-primary/10 transition-colors dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-600"
        onClick={handleClick}
      >
        {getDisplayCode()}
      </Badge>
      
      {features.length > 0 && expanded > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help dark:text-gray-400" />
            </TooltipTrigger>
            <TooltipContent className="w-64 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
              <div className="space-y-2">
                <p className="font-medium">{description || "Stamp Details"}</p>
                <div className="text-sm">
                  <div><strong>Country:</strong> {country}</div>
                  <div><strong>Year:</strong> 18{year}</div>
                  <div><strong>Denomination:</strong> {denomination}</div>
                  {features.length > 0 && (
                    <div>
                      <strong>Features:</strong>
                      <ul className="list-disc pl-4 mt-1">
                        {features.map((feature, index) => (
                          <li key={index}>
                            {featureExplanations[feature] || feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}

// Preset feature combinations
export const Features = {
  IMPERFORATE: "Imp",
  WATERMARK: "Wmk",
  REPRINT: "Rprt",
  OVERPRINT: "Oprt",
  ERROR: "E",
  SCRIPT_WATERMARK: "Wmk.scr",
} 
