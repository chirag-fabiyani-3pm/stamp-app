"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { 
  Droplet, 
  Grid3X3, 
  FileText, 
  PaintBucket, 
  Check, 
  Sparkles, 
  Search,
  Info,
  ArrowRight
} from "lucide-react"

interface StampRefinementModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (refinedData: any) => void
  stampData: any
}

export default function StampRefinementModal({ 
  isOpen, 
  onClose, 
  onComplete,
  stampData 
}: StampRefinementModalProps) {
  const [activeTab, setActiveTab] = useState("watermark")
  const [selectedVariety, setSelectedVariety] = useState<string | null>(
    stampData.possibleVarieties?.[0]?.id || null
  )
  const [refinementSelections, setRefinementSelections] = useState({
    watermark: "",
    perforation: "",
    paperType: "",
    colorVariant: ""
  })

  const handleRefinementChange = (category: string, value: string) => {
    setRefinementSelections({
      ...refinementSelections,
      [category]: value
    })

    // Logic to determine which variety this matches
    // This is simplified; in a real app, you would have more complex matching logic
    if (category === "watermark" && value === "inverted") {
      setSelectedVariety("nz-silver-jubilee-1d-purple-inv")
    } else if (category === "perforation" && value === "imperforate") {
      setSelectedVariety("nz-silver-jubilee-1d-purple-imperf")
    } else if (
      (category === "watermark" && value === "normal") ||
      (category === "perforation" && value === "normal")
    ) {
      // If the user selects normal for both features, we select the standard variety
      if (
        (category === "watermark" && value === "normal" && refinementSelections.perforation === "normal") ||
        (category === "perforation" && value === "normal" && refinementSelections.watermark === "normal")
      ) {
        setSelectedVariety("nz-silver-jubilee-1d-purple")
      }
    }
  }

  const handleComplete = () => {
    // In a real app, you would use the refinementSelections to identify the exact variety
    const identifiedVariety = stampData.possibleVarieties.find(
      (v: any) => v.id === selectedVariety
    )

    onComplete({
      ...stampData,
      refinedIdentification: identifiedVariety || stampData.possibleVarieties[0],
      refinementSelections
    })
  }

  const getMatchConfidence = () => {
    switch (selectedVariety) {
      case "nz-silver-jubilee-1d-purple":
        return { label: "High Confidence", percentage: 95, color: "text-green-600" }
      case "nz-silver-jubilee-1d-purple-inv":
        return { label: "Medium Confidence", percentage: 85, color: "text-amber-600" }
      case "nz-silver-jubilee-1d-purple-imperf":
        return { label: "Medium Confidence", percentage: 80, color: "text-amber-600" }
      default:
        return { label: "Low Confidence", percentage: 60, color: "text-red-600" }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Refine Stamp Identification</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-primary/5 p-4 rounded-lg">
            <h3 className="font-medium mb-1">Identified Stamp Group</h3>
            <div className="flex items-start gap-3">
              <div className="w-20 h-20 bg-muted rounded shrink-0 flex items-center justify-center">
                <img 
                  src="/placeholder.svg?height=80&width=80&query=Stamp Silver Jubilee" 
                  alt="Identified Stamp" 
                  className="max-w-full max-h-full"
                />
              </div>
              <div>
                <div className="font-semibold">{stampData.country} {stampData.year}</div>
                <div>{stampData.denomination} - Silver Jubilee Series</div>
                <div className="text-sm text-muted-foreground mt-1">SOA Code: {stampData.soaCode}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="font-medium">Examine Specific Features</h3>
            <div className="flex items-center gap-1">
              <Info className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">These details help identify exact varieties</span>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="watermark" className="text-xs">
                <Droplet className="h-3 w-3 mr-1" />
                Watermark
              </TabsTrigger>
              <TabsTrigger value="perforation" className="text-xs">
                <Grid3X3 className="h-3 w-3 mr-1" />
                Perforation
              </TabsTrigger>
              <TabsTrigger value="paper" className="text-xs">
                <FileText className="h-3 w-3 mr-1" />
                Paper
              </TabsTrigger>
              <TabsTrigger value="color" className="text-xs">
                <PaintBucket className="h-3 w-3 mr-1" />
                Color
              </TabsTrigger>
            </TabsList>

            <TabsContent value="watermark" className="space-y-4">
              <div className="text-sm text-muted-foreground mb-4">
                <p>Watermarks are subtle designs impressed into the paper during manufacturing. They are visible when held up to light.</p>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <RadioGroup 
                  value={refinementSelections.watermark} 
                  onValueChange={(value) => handleRefinementChange("watermark", value)}
                  className="space-y-2"
                >
                  <div className="flex items-start space-x-2 border rounded-md p-3">
                    <RadioGroupItem value="normal" id="watermark-normal" className="mt-1" />
                    <div className="grid gap-1 w-full">
                      <Label htmlFor="watermark-normal" className="font-medium">Normal Watermark</Label>
                      <div className="text-sm text-muted-foreground">Standard Crown and NZ watermark, right side up</div>
                      <div className="h-16 bg-slate-100 rounded flex items-center justify-center">
                        <img 
                          src="/placeholder.svg?height=60&width=150&query=Normal Watermark" 
                          alt="Normal Watermark" 
                          className="max-h-full"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2 border rounded-md p-3">
                    <RadioGroupItem value="inverted" id="watermark-inverted" className="mt-1" />
                    <div className="grid gap-1 w-full">
                      <Label htmlFor="watermark-inverted" className="font-medium">Inverted Watermark</Label>
                      <div className="text-sm text-muted-foreground">Crown and NZ watermark appears upside down</div>
                      <div className="h-16 bg-slate-100 rounded flex items-center justify-center">
                        <img 
                          src="/placeholder.svg?height=60&width=150&query=Inverted Watermark" 
                          alt="Inverted Watermark" 
                          className="max-h-full transform rotate-180"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2 border rounded-md p-3">
                    <RadioGroupItem value="none" id="watermark-none" className="mt-1" />
                    <div className="grid gap-1 w-full">
                      <Label htmlFor="watermark-none" className="font-medium">No Watermark Visible</Label>
                      <div className="text-sm text-muted-foreground">Cannot determine if watermark is present</div>
                    </div>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-md text-sm">
                <div className="flex items-center gap-2 font-medium text-blue-800 mb-1">
                  <Search className="h-4 w-4" />
                  <span>Watermark Detection Tips</span>
                </div>
                <ul className="text-blue-700 space-y-1 ml-6 list-disc">
                  <li>Place stamp face down on a dark surface</li>
                  <li>Apply a few drops of watermark fluid or try viewing with backlighting</li>
                  <li>The Silver Jubilee issues typically use the Crown and NZ watermark</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="perforation" className="space-y-4">
              <div className="text-sm text-muted-foreground mb-4">
                <p>Perforations are the small holes around stamp edges that allow for easy separation.</p>
              </div>

              <RadioGroup 
                value={refinementSelections.perforation} 
                onValueChange={(value) => handleRefinementChange("perforation", value)}
                className="space-y-2"
              >
                <div className="flex items-start space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="normal" id="perf-normal" className="mt-1" />
                  <div className="grid gap-1 w-full">
                    <Label htmlFor="perf-normal" className="font-medium">Standard Perforation (14 x 14.5)</Label>
                    <div className="text-sm text-muted-foreground">Regular perforation found on most Silver Jubilee issues</div>
                    <div className="h-16 bg-slate-100 rounded flex items-center justify-center">
                      <img 
                        src="/placeholder.svg?height=60&width=150&query=Normal Perforation" 
                        alt="Normal Perforation" 
                        className="max-h-full"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="imperforate" id="perf-imperforate" className="mt-1" />
                  <div className="grid gap-1 w-full">
                    <Label htmlFor="perf-imperforate" className="font-medium">Imperforate (No Perforations)</Label>
                    <div className="text-sm text-muted-foreground">Rare error stamps with no perforations</div>
                    <div className="h-16 bg-slate-100 rounded flex items-center justify-center">
                      <img 
                        src="/placeholder.svg?height=60&width=150&query=Imperforate Stamp" 
                        alt="Imperforate" 
                        className="max-h-full"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="line" id="perf-line" className="mt-1" />
                  <div className="grid gap-1 w-full">
                    <Label htmlFor="perf-line" className="font-medium">Line Perforation</Label>
                    <div className="text-sm text-muted-foreground">Alternative perforation method used on some issues</div>
                    <div className="h-16 bg-slate-100 rounded flex items-center justify-center">
                      <img 
                        src="/placeholder.svg?height=60&width=150&query=Line Perforation" 
                        alt="Line Perforation" 
                        className="max-h-full"
                      />
                    </div>
                  </div>
                </div>
              </RadioGroup>
              
              <div className="bg-blue-50 p-3 rounded-md text-sm">
                <div className="flex items-center gap-2 font-medium text-blue-800 mb-1">
                  <Search className="h-4 w-4" />
                  <span>Perforation Measurement</span>
                </div>
                <p className="text-blue-700 mb-2">
                  Use a perforation gauge to count the number of perforations in a 2cm span.
                  The Silver Jubilee series typically has 14 perforations horizontally and 14.5 vertically in a 2cm span.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="paper" className="space-y-4">
              <div className="text-sm text-muted-foreground mb-4">
                <p>Paper type can significantly affect a stamp's value and help identify specific printings.</p>
              </div>

              <RadioGroup 
                value={refinementSelections.paperType} 
                onValueChange={(value) => handleRefinementChange("paperType", value)}
                className="space-y-2"
              >
                <div className="flex items-start space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="standard" id="paper-standard" className="mt-1" />
                  <div className="grid gap-1">
                    <Label htmlFor="paper-standard" className="font-medium">Standard Paper</Label>
                    <div className="text-sm text-muted-foreground">
                      Medium thickness, slightly cream-colored paper used for most issues
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="thick" id="paper-thick" className="mt-1" />
                  <div className="grid gap-1">
                    <Label htmlFor="paper-thick" className="font-medium">Thick Paper</Label>
                    <div className="text-sm text-muted-foreground">
                      Heavier stock used for some special printings, feels more substantial
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="thin" id="paper-thin" className="mt-1" />
                  <div className="grid gap-1">
                    <Label htmlFor="paper-thin" className="font-medium">Thin Paper</Label>
                    <div className="text-sm text-muted-foreground">
                      Lighter, more translucent paper that may show more details when backlit
                    </div>
                  </div>
                </div>
              </RadioGroup>
              
              <div className="bg-blue-50 p-3 rounded-md text-sm">
                <div className="flex items-center gap-2 font-medium text-blue-800 mb-1">
                  <Search className="h-4 w-4" />
                  <span>Paper Testing Tips</span>
                </div>
                <ul className="text-blue-700 space-y-1 ml-6 list-disc">
                  <li>Hold stamp up to light to gauge thickness and translucency</li>
                  <li>Compare against known examples when possible</li>
                  <li>Be careful with chemicals as they can damage stamps</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="color" className="space-y-4">
              <div className="text-sm text-muted-foreground mb-4">
                <p>Color variations can indicate different printings or even valuable errors.</p>
              </div>

              <RadioGroup 
                value={refinementSelections.colorVariant} 
                onValueChange={(value) => handleRefinementChange("colorVariant", value)}
                className="space-y-2"
              >
                <div className="flex items-start space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="standard" id="color-standard" className="mt-1" />
                  <div className="grid gap-1 w-full">
                    <Label htmlFor="color-standard" className="font-medium">Standard Purple</Label>
                    <div className="text-sm text-muted-foreground">
                      The common purple color of the 1d Silver Jubilee stamp
                    </div>
                    <div className="h-12 w-12 rounded bg-purple-700 border"></div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="deep" id="color-deep" className="mt-1" />
                  <div className="grid gap-1 w-full">
                    <Label htmlFor="color-deep" className="font-medium">Deep Purple</Label>
                    <div className="text-sm text-muted-foreground">
                      A darker, more intense purple shade from later printings
                    </div>
                    <div className="h-12 w-12 rounded bg-purple-900 border"></div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="light" id="color-light" className="mt-1" />
                  <div className="grid gap-1 w-full">
                    <Label htmlFor="color-light" className="font-medium">Light Purple</Label>
                    <div className="text-sm text-muted-foreground">
                      A lighter purple shade often seen in early printings
                    </div>
                    <div className="h-12 w-12 rounded bg-purple-500 border"></div>
                  </div>
                </div>
              </RadioGroup>
              
              <div className="bg-blue-50 p-3 rounded-md text-sm">
                <div className="flex items-center gap-2 font-medium text-blue-800 mb-1">
                  <Search className="h-4 w-4" />
                  <span>Color Identification</span>
                </div>
                <p className="text-blue-700">
                  Examine stamps in natural daylight for most accurate color assessment.
                  Artificial lighting can significantly affect how colors appear.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <Separator />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Identified Variety</h3>
              <Badge className="bg-primary/10 text-primary border-primary/20">
                {getMatchConfidence().percentage}% <span className={getMatchConfidence().color}>{getMatchConfidence().label}</span>
              </Badge>
            </div>

            {stampData.possibleVarieties.map((variety: any) => (
              <div 
                key={variety.id} 
                className={`border p-3 rounded-lg flex items-start gap-3 transition-colors ${
                  selectedVariety === variety.id ? 'border-primary bg-primary/5' : ''
                }`}
                onClick={() => setSelectedVariety(variety.id)}
              >
                <div className="pt-0.5">
                  {selectedVariety === variety.id ? (
                    <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{variety.name}</div>
                  <div className="text-sm text-muted-foreground">Probability: {variety.probability}%</div>
                  {selectedVariety === variety.id && (
                    <div className="mt-2 text-sm">
                      <Badge variant="outline" className="bg-primary/10 text-primary mb-1">
                        <Sparkles className="h-3 w-3 mr-1" /> 
                        Best Match Based on Your Selections
                      </Badge>
                      <div className="text-muted-foreground mt-1">
                        <p>This variety matches the features you've identified.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleComplete} disabled={!selectedVariety}>
            Confirm Identification 
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 