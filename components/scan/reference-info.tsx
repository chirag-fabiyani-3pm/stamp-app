import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Check, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

type ReferenceInfoProps = {
  stamp: {
    name: string
    description: string
    country: string
    year: string
    perforationOptions: string[]
    watermarkOptions: string[]
    possibleErrors: string[]
  }
  onAccept: () => void
  onReject: () => void
}

export default function ReferenceInfo({ stamp, onAccept, onReject }: ReferenceInfoProps) {
  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-base md:text-lg">Reference Information</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Match your stamp with this reference data
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 md:p-4">
        <ScrollArea className="h-[calc(100vh-20rem)] md:h-[calc(100vh-22rem)] pr-3">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm md:text-base">{stamp.name}</h3>
              <p className="text-muted-foreground text-xs md:text-sm">{stamp.description}</p>
            </div>
            
            <Separator />
            
            <div className="space-y-3 text-sm">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-medium text-xs md:text-sm">Country:</span>
                <span className="text-xs md:text-sm">{stamp.country}</span>
              </div>
              
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-medium text-xs md:text-sm">Year:</span>
                <span className="text-xs md:text-sm">{stamp.year}</span>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="font-medium text-xs md:text-sm">Perforations:</span>
                <div className="flex flex-wrap gap-1">
                  {stamp.perforationOptions.map(perf => (
                    <Badge key={perf} variant="outline" className="text-xs">
                      {perf}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="font-medium text-xs md:text-sm">Watermarks:</span>
                <div className="flex flex-wrap gap-1">
                  {stamp.watermarkOptions.map(wm => (
                    <Badge key={wm} variant="outline" className="text-xs">
                      {wm}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="font-medium text-xs md:text-sm">Known errors:</span>
                <div className="flex flex-wrap gap-1">
                  {stamp.possibleErrors.slice(0, 5).map(err => (
                    <Badge key={err} variant="outline" className="text-xs">
                      {err}
                    </Badge>
                  ))}
                  {stamp.possibleErrors.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{stamp.possibleErrors.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <Separator />
            
            <p className="text-xs text-muted-foreground">
              This is a reference stamp from our database. Please record your observations 
              about your physical stamp on the next screen.
            </p>
          </div>
        </ScrollArea>
        
        <div className="flex flex-col sm:flex-row justify-between gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={onReject} className="w-full sm:w-auto order-2 sm:order-1">
            <X className="h-4 w-4 mr-1 sm:mr-0 sm:ml-1 order-2 sm:order-1" />
            <span className="order-1 sm:order-2">Reject Image</span>
          </Button>
          <Button size="sm" onClick={onAccept} className="w-full sm:w-auto order-1 sm:order-2">
            <span className="order-1">Accept Image</span>
            <Check className="h-4 w-4 ml-1 order-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 