"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, PlusCircle, Check, Eye, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

// API Stamp interface to match the new structure
interface ApiStampData {
  id: string
  catalogId: string
  name: string
  publisher: string
  country: string
  stampImageUrl: string
  catalogName: string
  catalogNumber: string
  seriesName: string
  issueDate: string
  denominationValue: number
  denominationCurrency: string
  denominationSymbol: string
  color: string
  design: string
  theme: string
  artist: string
  engraver: string
  printing: string
  paperType: string
  perforation: string
  size: string
  specialNotes: string
  historicalContext: string
  printingQuantity: number
  usagePeriod: string
  rarenessLevel: string
  hasGum: boolean
  gumCondition: string
  description: string
  watermark: string | null
  confidence?: number
  matchReason?: string
}

interface StampMatch {
  id: string
  name: string
  imagePath: string
  country: string
  year: string
  description: string
  confidence: number
  matchReason: string
  apiData?: ApiStampData
  // Legacy properties for backward compatibility
  colors?: string[]
  watermarkOptions?: string[]
  perforationOptions?: string[]
  paperTypes?: string[]
  printTypes?: string[]
  millimeterMeasurements?: string[]
  grades?: string[]
  rarityRatings?: string[]
  // New API properties
  color?: string
  denominationValue?: number
  denominationSymbol?: string
  seriesName?: string
  catalogName?: string
  catalogNumber?: string
  catalogId?: string
  design?: string
  theme?: string
  artist?: string
  engraver?: string
  printing?: string
  paperType?: string
  perforation?: string
  size?: string
  specialNotes?: string
  historicalContext?: string
  printingQuantity?: number
  usagePeriod?: string
  rarenessLevel?: string
  hasGum?: boolean
  gumCondition?: string
  watermark?: string | null
}

interface StampOptionsProps {
  matches: StampMatch[]
  selectedIndex: number
  onSelect: (index: number) => void
  onConfirm: () => void
  onReject: () => void
}

// Comprehensive Stamp Detail Modal Component
const StampDetailModal = ({ stamp, isOpen, onClose }: { 
  stamp: StampMatch | null
  isOpen: boolean
  onClose: () => void
}) => {
  if (!stamp) return null
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-3">
          <DialogTitle className="text-lg flex items-center gap-2">
            {stamp.name}
            {stamp.confidence && (
              <Badge variant="default" className="text-xs">
                {stamp.confidence}% match
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image */}
          <div className="w-full aspect-square relative bg-white rounded-lg border overflow-hidden max-w-sm mx-auto">
            <Image
              src={stamp.imagePath}
              alt={stamp.name}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Comprehensive Information Display */}
          <div className="space-y-4">
            {/* Basic Information */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground border-b pb-1">Basic Information</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground block">Country</span>
                  <span className="font-medium">{stamp.country}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Year</span>
                  <span className="font-medium">{stamp.year}</span>
                </div>
                {stamp.seriesName && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground block">Series</span>
                    <span className="font-medium">{stamp.seriesName}</span>
            </div>
          )}
                {stamp.denominationValue && (
              <div>
                    <span className="text-muted-foreground block">Denomination</span>
                    <span className="font-medium">{stamp.denominationValue}{stamp.denominationSymbol}</span>
                  </div>
                )}
                <div className="col-span-2">
                  <span className="text-muted-foreground block">Description</span>
                  <p className="text-sm leading-relaxed">{stamp.description}</p>
                </div>
              </div>
            </div>

            {/* Catalog Information */}
            {(stamp.catalogName || stamp.catalogNumber || stamp.catalogId) && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground border-b pb-1">Catalog Information</h3>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  {stamp.catalogName && stamp.catalogNumber && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">{stamp.catalogName}</span>
                      <Badge variant="outline" className="text-xs">
                        {stamp.catalogNumber}
                      </Badge>
                    </div>
                  )}
                  {stamp.catalogId && (
              <div>
                      <span className="text-muted-foreground block">Catalog ID</span>
                      <span className="font-medium text-xs break-all">{stamp.catalogId}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Technical Specifications */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground border-b pb-1">Technical Details</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {(stamp.color || (stamp.colors && stamp.colors.length > 0)) && (
                  <div>
                    <span className="text-muted-foreground block">Color</span>
                    <Badge variant="secondary" className="text-xs">
                      {stamp.color || stamp.colors?.[0]}
                    </Badge>
                  </div>
                )}
                {stamp.design && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground block">Design</span>
                    <span className="font-medium text-sm">{stamp.design}</span>
                  </div>
                )}
                {stamp.theme && (
                  <div>
                    <span className="text-muted-foreground block">Theme</span>
                    <Badge variant="outline" className="text-xs">
                      {stamp.theme}
                    </Badge>
                  </div>
                )}
                {(stamp.watermark || (stamp.watermarkOptions && stamp.watermarkOptions.length > 0)) && (
                  <div>
                    <span className="text-muted-foreground block">Watermark</span>
                    <Badge variant="outline" className="text-xs">
                      {stamp.watermark || stamp.watermarkOptions?.[0]}
                    </Badge>
                  </div>
                )}
                {(stamp.perforation || (stamp.perforationOptions && stamp.perforationOptions.length > 0)) && (
                  <div>
                    <span className="text-muted-foreground block">Perforation</span>
                    <Badge variant="outline" className="text-xs">
                      {stamp.perforation || stamp.perforationOptions?.[0]}
                    </Badge>
                  </div>
                )}
                {(stamp.paperType || (stamp.paperTypes && stamp.paperTypes.length > 0)) && (
                  <div>
                    <span className="text-muted-foreground block">Paper</span>
                    <Badge variant="outline" className="text-xs">
                      {stamp.paperType || stamp.paperTypes?.[0]}
                    </Badge>
                  </div>
                )}
                {(stamp.printing || (stamp.printTypes && stamp.printTypes.length > 0)) && (
                  <div>
                    <span className="text-muted-foreground block">Printing</span>
                    <Badge variant="outline" className="text-xs">
                      {stamp.printing || stamp.printTypes?.[0]}
                    </Badge>
                  </div>
                )}
                {stamp.size && (
              <div>
                    <span className="text-muted-foreground block">Size</span>
                    <span className="font-medium text-xs">{stamp.size}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Production Information */}
            {(stamp.artist || stamp.engraver || stamp.printingQuantity || stamp.usagePeriod) && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground border-b pb-1">Production Details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {stamp.artist && (
                    <div>
                      <span className="text-muted-foreground block">Artist</span>
                      <span className="font-medium text-xs">{stamp.artist}</span>
                    </div>
                  )}
                  {stamp.engraver && (
                    <div>
                      <span className="text-muted-foreground block">Engraver</span>
                      <span className="font-medium text-xs">{stamp.engraver}</span>
                    </div>
                  )}
                  {stamp.printingQuantity && (
                    <div>
                      <span className="text-muted-foreground block">Print Quantity</span>
                      <span className="font-medium text-xs">{stamp.printingQuantity.toLocaleString()}</span>
                    </div>
                  )}
                  {stamp.usagePeriod && (
                    <div>
                      <span className="text-muted-foreground block">Usage Period</span>
                      <span className="font-medium text-xs">{stamp.usagePeriod}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Condition & Rarity */}
            {(stamp.rarenessLevel || stamp.hasGum !== undefined || stamp.gumCondition) && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground border-b pb-1">Condition & Rarity</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {stamp.rarenessLevel && (
                    <div>
                      <span className="text-muted-foreground block">Rarity</span>
                      <Badge variant="secondary" className="text-xs">
                        {stamp.rarenessLevel}
                      </Badge>
                    </div>
                  )}
                  {stamp.hasGum !== undefined && (
              <div>
                      <span className="text-muted-foreground block">Has Gum</span>
                      <Badge variant={stamp.hasGum ? "default" : "outline"} className="text-xs">
                        {stamp.hasGum ? "Yes" : "No"}
                      </Badge>
                    </div>
                  )}
                  {stamp.gumCondition && (
                    <div className="col-span-2">
                      <span className="text-muted-foreground block">Gum Condition</span>
                      <span className="font-medium text-xs">{stamp.gumCondition}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Historical Information */}
            {(stamp.specialNotes || stamp.historicalContext) && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground border-b pb-1">Historical Information</h3>
                <div className="space-y-3 text-sm">
                  {stamp.specialNotes && (
                    <div>
                      <span className="text-muted-foreground block mb-1">Special Notes</span>
                      <p className="text-xs leading-relaxed bg-muted/30 p-3 rounded">{stamp.specialNotes}</p>
                    </div>
                  )}
                  {stamp.historicalContext && (
              <div>
                      <span className="text-muted-foreground block mb-1">Historical Context</span>
                      <p className="text-xs leading-relaxed bg-muted/30 p-3 rounded">{stamp.historicalContext}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Match Information */}
            {stamp.confidence && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground border-b pb-1">Match Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Confidence</span>
                    <Badge variant="default" className="text-xs">
                      {stamp.confidence}%
                    </Badge>
                  </div>
                  {stamp.matchReason && (
                    <div>
                      <span className="text-muted-foreground block mb-1">Match Reason</span>
                      <p className="text-xs leading-relaxed bg-muted/30 p-3 rounded">{stamp.matchReason}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          </div>
      </DialogContent>
    </Dialog>
  )
}

export default function StampOptions({ matches, selectedIndex, onSelect, onConfirm, onReject }: StampOptionsProps) {
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [detailModalStamp, setDetailModalStamp] = useState<StampMatch | null>(null)

  const openStampDetail = (stamp: StampMatch) => {
    setDetailModalStamp(stamp)
    setDetailModalOpen(true)
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Select Matching Stamp</h2>
        <p className="text-muted-foreground">
          AI found {matches.length} possible match{matches.length !== 1 ? 'es' : ''}. 
          Select the one that best matches your stamp.
        </p>
      </div>
      
      {/* Stamp Grid */}
      <div className={`grid gap-4 ${
        matches.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' :
        matches.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto' :
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      }`}>
        {matches.map((match, index) => (
          <Card
            key={match.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
              selectedIndex === index
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => onSelect(index)}
          >
            <CardContent className="p-4 space-y-3">
              {/* Image */}
              <div className="aspect-square relative bg-white rounded border overflow-hidden">
                <Image
                  src={match.imagePath}
                  alt={match.name}
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              
              {/* Info */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm line-clamp-2 leading-tight">{match.name}</h3>
                
                {/* Badges */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">{match.country}</Badge>
                    <Badge variant="secondary" className="text-xs">{match.year}</Badge>
                    {match.confidence && (
                      <Badge variant="default" className="text-xs">{match.confidence}%</Badge>
                    )}
              </div>
              
                  {(match.denominationValue || match.seriesName) && (
                    <div className="flex flex-wrap gap-1">
                      {match.denominationValue && (
                        <Badge variant="outline" className="text-xs bg-muted/30">
                          {match.denominationValue}{match.denominationSymbol}
                        </Badge>
                      )}
                      {match.seriesName && (
                        <Badge variant="outline" className="text-xs bg-muted/30 max-w-[100px] truncate">
                          {match.seriesName}
                        </Badge>
                      )}
              </div>
                  )}
            </div>
            
                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                    className="flex-1 text-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      openStampDetail(match)
                    }}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Details
                    </Button>
                    <Button
                      size="sm"
                    className="flex-1 text-xs"
                    variant={selectedIndex === index ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelect(index)
                    }}
                  >
                    <Check className="w-3 h-3 mr-1" />
                    {selectedIndex === index ? "Selected" : "Select"}
                    </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
            </div>
            
      {/* Action Buttons */}
      <div className="flex justify-center gap-3 pt-4">
        <Button variant="outline" onClick={onReject} className="gap-2">
          <X className="w-4 h-4" />
          Start Over
        </Button>
        <Button 
          onClick={onConfirm} 
          className="gap-2"
          disabled={selectedIndex === undefined || selectedIndex < 0}
        >
          <Check className="w-4 h-4" />
          Confirm Selection
        </Button>
            </div>
            
      {/* Detail Modal */}
      <StampDetailModal
        stamp={detailModalStamp}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
      />
    </div>
  )
} 