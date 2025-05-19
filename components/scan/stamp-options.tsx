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
import { CalendarIcon, PlusCircle } from "lucide-react"
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

type StampOptionsProps = {
  stampData: {
    id: string,
    name: string,
    certifier: string,
    itemType: string,
    colour: string,
    country: string,
    wordsSymbols: string,
    imageDescription: string,
    dateOfIssue: string,
    paperType: string,
    perforationType: string,
    watermarkType: string,
    error: string,
    cancellation: string,
    plates: string,
    plating: {
      positionNumber: string,
      gridReference: string,
      flawDescription: string,
      textOnFace: string,
      plateNumber: string,
      settingNumber: string,
      textColor: string,
      flawImage: string | null
    },
    collectorGroup: string,
    rarityRating: string,
    grade: string,
    purchasePrice: string,
    purchaseDate: string,
    notes: string,
    visualAppeal: number
  }
  onUpdate: (field: string, value: any) => void
  onSave: () => void
  onOpenDefectiveFolder: () => void
  referenceData?: any // Reference data for auto-population
}

type CustomSelectProps = {
  value: string
  onValueChange: (value: string) => void
  options: string[]
  placeholder: string
  label: string
  allowCustom?: boolean
}

// Component for Selects that allow custom values
const CustomSelect = ({ value, onValueChange, options, placeholder, label, allowCustom = true }: CustomSelectProps) => {
  const [customValue, setCustomValue] = useState("")
  const [isAddingCustom, setIsAddingCustom] = useState(false)
  
  const handleAddCustom = () => {
    if (customValue.trim()) {
      onValueChange(customValue.trim())
      setCustomValue("")
      setIsAddingCustom(false)
    }
  }
  
  return (
    <>
      <Select 
        value={value} 
        onValueChange={onValueChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>{option}</SelectItem>
          ))}
          {allowCustom && (
            <div className="px-2 py-1.5">
              <Button 
                variant="ghost" 
                className="w-full flex items-center justify-start text-muted-foreground"
                onClick={() => setIsAddingCustom(true)}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add custom {label.toLowerCase()}
              </Button>
            </div>
          )}
        </SelectContent>
      </Select>
      
      {allowCustom && isAddingCustom && (
        <Dialog open={isAddingCustom} onOpenChange={setIsAddingCustom}>
          <DialogContent className="sm:max-w-[425px] max-w-[95vw] rounded-lg">
            <DialogHeader>
              <DialogTitle>Add Custom {label}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="custom-value">New {label}</Label>
                <Input
                  id="custom-value"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  className="mt-2"
                  placeholder={`Enter custom ${label.toLowerCase()}`}
                />
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setIsAddingCustom(false)} className="w-full sm:w-auto">Cancel</Button>
              <Button onClick={handleAddCustom} className="w-full sm:w-auto">Add</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

// Component to display plating information summary
const PlatingInfoCard = ({ 
  plating, 
  plates, 
  onEditClick 
}: { 
  plating: any, 
  plates: string, 
  onEditClick: () => void 
}) => {
  const hasPlatingInfo = plating && (
    plating.positionNumber || 
    plating.gridReference || 
    plating.flawDescription || 
    plating.textOnFace || 
    plating.plateNumber || 
    plating.settingNumber || 
    plating.textColor || 
    plating.flawImage
  );

  return (
    <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={onEditClick}>
      <CardHeader className="py-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>Plating Information <span className="text-xs text-primary/80">(Plg)</span></span>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <PlusCircle className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="py-2">
        {hasPlatingInfo ? (
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-xs text-muted-foreground block">Plate:</span>
                <span className="font-medium">{plates || "Not set"}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Position:</span>
                <span className="font-medium">{plating.positionNumber || "Not set"}</span>
              </div>
            </div>
            
            {plating.gridReference && (
              <div>
                <span className="text-xs text-muted-foreground block">Grid Reference:</span>
                <span className="font-medium">{plating.gridReference}</span>
              </div>
            )}
            
            {plating.flawDescription && (
              <div>
                <span className="text-xs text-muted-foreground block">Flaw:</span>
                <span className="line-clamp-2 text-xs">{plating.flawDescription}</span>
              </div>
            )}
            
            {plating.flawImage && (
              <div className="mt-2 flex justify-center">
                <div className="border rounded w-16 h-16 flex items-center justify-center overflow-hidden">
                  <img 
                    src={plating.flawImage} 
                    alt="Flaw" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-2">
            <span className="text-sm text-muted-foreground">No plating information</span>
            <p className="text-xs text-muted-foreground mt-1">Click to add position and flaw details</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function StampOptions({ 
  stampData, 
  onUpdate, 
  onSave, 
  onOpenDefectiveFolder,
  referenceData
}: StampOptionsProps) {
  // State for managing the date picker
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"primary" | "secondary">("primary")
  const [isPlatingDialogOpen, setIsPlatingDialogOpen] = useState(false)
  
  // Update functions for plating data
  const updatePlatingField = (field: string, value: string) => {
    const updatedPlating = {
      ...stampData.plating,
      [field]: value
    }
    onUpdate("plating", updatedPlating)
  }
  
  // Handler for plating image upload
  const handlePlatingImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string
        updatePlatingField("flawImage", imageDataUrl)
      }
      reader.readAsDataURL(file)
    }
  }
  
  // Standard options for dropdowns
  const certifierOptions = ["None", "Expert Committee", "RPSNZ", "BPA", "APS"]
  const itemTypeOptions = ["Single", "Block", "Sheet", "Cover", "First Day Cover"]
  const paperTypeOptions = ["Thick", "Thin", "Wove", "Laid"]
  const perforationTypeOptions = ["Imperforate", "10", "12.5", "Roulette 7"]
  const watermarkTypeOptions = ["None", "Large Star", "Small Star", "NZ", "Script", "Small Crown"]
  const errorTypeOptions = ["None", "Colour Shift", "Double Print", "Doctor Blade", "Ink Blob", "White Spots", "Colour Omitted", "Re-Entries", "Re-Touch", "Offset", "Print Process Error"]
  const gradeOptions = ["Superb", "Very Fine", "Fine", "Good", "Poor"]
  const rarityRatingOptions = [
    "Common (C) - Over 1,000,000 exist", 
    "Scarce (S) - 100,000-1,000,000 exist", 
    "Rare (R) - 1,000-10,000 exist", 
    "Very Rare (VR) - 100-1,000 exist", 
    "Extremely Rare (ER) - Under 100 exist"
  ]
  const textColorOptions = ["Black", "Red", "Blue", "Green", "Purple", "Brown", "Other"]
  
  // Options organized into tabs for mobile responsiveness
  const primaryOptions = (
    <div className="space-y-4">
      {/* Certifier */}
      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-sm font-medium">Certifier <span className="text-xs text-primary/80">(Certr)</span></CardTitle>
        </CardHeader>
        <CardContent>
          <CustomSelect 
            value={stampData.certifier} 
            onValueChange={(value) => onUpdate("certifier", value)}
            options={certifierOptions}
            placeholder="Select certifier"
            label="Certifier"
          />
        </CardContent>
      </Card>

      {/* Item Type */}
      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-sm font-medium">Item Type <span className="text-xs text-primary/80">(ItTyp)</span></CardTitle>
        </CardHeader>
        <CardContent>
          <CustomSelect 
            value={stampData.itemType} 
            onValueChange={(value) => onUpdate("itemType", value)}
            options={itemTypeOptions}
            placeholder="Select item type"
            label="Item Type"
          />
        </CardContent>
      </Card>

      {/* Plating Information Card */}
      <PlatingInfoCard
        plating={stampData.plating}
        plates={stampData.plates}
        onEditClick={() => setIsPlatingDialogOpen(true)}
      />

      {/* Colour */}
      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-sm font-medium">Colour <span className="text-xs text-primary/80">(C)</span></CardTitle>
        </CardHeader>
        <CardContent>
          <Input 
            value={stampData.colour}
            onChange={(e) => onUpdate("colour", e.target.value)}
            placeholder="Enter colour"
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Country */}
      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-sm font-medium">Country <span className="text-xs text-primary/80">(Ctry)</span></CardTitle>
        </CardHeader>
        <CardContent>
          <Input 
            value={stampData.country}
            onChange={(e) => onUpdate("country", e.target.value)}
            placeholder="Enter country"
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Date of Issue */}
      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-sm font-medium">Date of Issue <span className="text-xs text-primary/80">(DtOfIss)</span></CardTitle>
        </CardHeader>
        <CardContent>
          <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {stampData.dateOfIssue ? format(new Date(stampData.dateOfIssue), "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={stampData.dateOfIssue ? new Date(stampData.dateOfIssue) : undefined}
                onSelect={(date) => {
                  onUpdate("dateOfIssue", date ? date.toISOString() : "")
                  setIsDatePickerOpen(false)
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      {/* Error */}
      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-sm font-medium">Error <span className="text-xs text-primary/80">(Err)</span></CardTitle>
        </CardHeader>
        <CardContent>
          <CustomSelect 
            value={stampData.error} 
            onValueChange={(value) => onUpdate("error", value)}
            options={errorTypeOptions}
            placeholder="Select error type"
            label="Error Type"
          />
        </CardContent>
      </Card>

      {/* Rarity Rating */}
      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-sm font-medium">Rarity Rating <span className="text-xs text-primary/80">(Rr)</span></CardTitle>
        </CardHeader>
        <CardContent>
          <CustomSelect 
            value={stampData.rarityRating} 
            onValueChange={(value) => onUpdate("rarityRating", value)}
            options={rarityRatingOptions}
            placeholder="Select rarity rating"
            label="Rarity Rating"
          />
        </CardContent>
      </Card>
    </div>
  );
  
  const secondaryOptions = (
    <div className="space-y-4">
      {/* Words/Symbols on Stamp */}
      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-sm font-medium">Words/Symbols on Stamp <span className="text-xs text-primary/80">(WdsOSt)</span></CardTitle>
        </CardHeader>
        <CardContent>
          <Input 
            value={stampData.wordsSymbols}
            onChange={(e) => onUpdate("wordsSymbols", e.target.value)}
            placeholder="Enter words or symbols"
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Image Description of Stamp */}
      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-sm font-medium">Image Description <span className="text-xs text-primary/80">(ImDescOSt)</span></CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            className="min-h-[80px]"
            value={stampData.imageDescription}
            onChange={(e) => onUpdate("imageDescription", e.target.value)}
            placeholder="Enter image description"
          />
        </CardContent>
      </Card>

      {/* Paper Type */}
      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-sm font-medium">Paper Type <span className="text-xs text-primary/80">(Pa)</span></CardTitle>
        </CardHeader>
        <CardContent>
          <CustomSelect 
            value={stampData.paperType} 
            onValueChange={(value) => onUpdate("paperType", value)}
            options={paperTypeOptions}
            placeholder="Select paper type"
            label="Paper Type"
          />
        </CardContent>
      </Card>

      {/* Perforation Type */}
      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-sm font-medium">Perforation Type <span className="text-xs text-primary/80">(P)</span></CardTitle>
        </CardHeader>
        <CardContent>
          <CustomSelect 
            value={stampData.perforationType} 
            onValueChange={(value) => onUpdate("perforationType", value)}
            options={perforationTypeOptions}
            placeholder="Select perforation type"
            label="Perforation Type"
          />
        </CardContent>
      </Card>

      {/* Watermark Type */}
      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-sm font-medium">Watermark Type <span className="text-xs text-primary/80">(W)</span></CardTitle>
        </CardHeader>
        <CardContent>
          <CustomSelect 
            value={stampData.watermarkType} 
            onValueChange={(value) => onUpdate("watermarkType", value)}
            options={watermarkTypeOptions}
            placeholder="Select watermark type"
            label="Watermark Type"
          />
        </CardContent>
      </Card>

      {/* Cancellation */}
      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-sm font-medium">Cancellation <span className="text-xs text-primary/80">(Can)</span></CardTitle>
        </CardHeader>
        <CardContent>
          <Input 
            value={stampData.cancellation}
            onChange={(e) => onUpdate("cancellation", e.target.value)}
            placeholder="Enter cancellation details"
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Grade */}
      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-sm font-medium">Grade <span className="text-xs text-primary/80">(Grd)</span></CardTitle>
        </CardHeader>
        <CardContent>
          <CustomSelect 
            value={stampData.grade} 
            onValueChange={(value) => onUpdate("grade", value)}
            options={gradeOptions}
            placeholder="Select grade"
            label="Grade"
          />
        </CardContent>
      </Card>

      {/* Visual Appeal */}
      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-sm font-medium">Visual Appeal <span className="text-xs text-primary/80">(VisApl)</span></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">{stampData.visualAppeal}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={stampData.visualAppeal}
              onChange={(e) => onUpdate("visualAppeal", parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Poor</span>
              <span>Excellent</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* Purchase Price */}
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm font-medium">Purchase Price <span className="text-xs text-primary/80">(PurcPrc)</span></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                $
              </span>
              <Input 
                type="text"
                value={stampData.purchasePrice}
                onChange={(e) => onUpdate("purchasePrice", e.target.value)}
                placeholder="0.00"
                className="pl-7"
              />
            </div>
          </CardContent>
        </Card>

        {/* Purchase Date */}
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm font-medium">Purchase Date <span className="text-xs text-primary/80">(PurcDt)</span></CardTitle>
          </CardHeader>
          <CardContent>
            <Input 
              type="date"
              value={stampData.purchaseDate}
              onChange={(e) => onUpdate("purchaseDate", e.target.value)}
            />
          </CardContent>
        </Card>
      </div>

      {/* Defective Image Folder */}
      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-sm font-medium">Defective Image Folder</CardTitle>
        </CardHeader>
        <CardContent className="p-2 flex justify-center">
          <Button onClick={onOpenDefectiveFolder} className="w-full sm:w-auto">Open</Button>
        </CardContent>
      </Card>
      
      {/* Notes on stamp image */}
      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-sm font-medium">Notes <span className="text-xs text-primary/80">(NtOStIm)</span></CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            className="min-h-[80px]"
            value={stampData.notes}
            onChange={(e) => onUpdate("notes", e.target.value)}
            placeholder="Enter notes about the stamp"
          />
        </CardContent>
      </Card>
    </div>
  );
  
  return (
    <div className="p-4">
      {/* Mobile Tabs - Only visible on small screens */}
      <div className="md:hidden mb-4">
        <Tabs 
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "primary" | "secondary")}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="primary">Basic Details</TabsTrigger>
            <TabsTrigger value="secondary">Additional Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="primary">
            <ScrollArea className="h-[65vh]">
              {primaryOptions}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="secondary">
            <ScrollArea className="h-[65vh]">
              {secondaryOptions}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Desktop Layout - Visible on medium and larger screens */}
      <div className="hidden md:block">
        <ScrollArea className="h-[70vh] rounded-md">
          <div className="space-y-6 p-1">
            <div className="grid grid-cols-2 gap-4">
              {/* Left column - Main options */}
              <div className="space-y-4">
                {primaryOptions}
              </div>
              
              {/* Right column - Additional options */}
              <div className="space-y-4">
                {secondaryOptions}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Apply/Close button - Always visible */}
      <div className="flex justify-center mt-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="lg" className="px-10 w-full sm:w-auto" onClick={onSave}>
                Apply/Close
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Save stamp information and return to scan</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Plates/Plating Dialog */}
      <Dialog open={isPlatingDialogOpen} onOpenChange={setIsPlatingDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-xl md:max-w-2xl rounded-lg">
          <DialogHeader>
            <DialogTitle>Plating Information</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Plate Number */}
              <div>
                <Label htmlFor="plateNumber" className="text-sm">Plate Number</Label>
                <Input
                  id="plateNumber"
                  value={stampData.plates}
                  onChange={(e) => onUpdate("plates", e.target.value)}
                  className="mt-1"
                  placeholder="Enter plate number"
                />
              </div>
              
              {/* Position Number */}
              <div>
                <Label htmlFor="positionNumber" className="text-sm">Position Number</Label>
                <Input
                  id="positionNumber"
                  value={stampData.plating?.positionNumber || ""}
                  onChange={(e) => updatePlatingField("positionNumber", e.target.value)}
                  className="mt-1"
                  placeholder="Enter individual position number"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Grid Reference */}
              <div>
                <Label htmlFor="gridReference" className="text-sm">Grid Reference</Label>
                <Input
                  id="gridReference"
                  value={stampData.plating?.gridReference || ""}
                  onChange={(e) => updatePlatingField("gridReference", e.target.value)}
                  className="mt-1"
                  placeholder="e.g. r2-3 (Row 2, Column 3)"
                />
              </div>
              
              {/* Setting Number */}
              <div>
                <Label htmlFor="settingNumber" className="text-sm">Setting Number</Label>
                <Input
                  id="settingNumber"
                  value={stampData.plating?.settingNumber || ""}
                  onChange={(e) => updatePlatingField("settingNumber", e.target.value)}
                  className="mt-1"
                  placeholder="If applicable"
                />
              </div>
            </div>
            
            {/* Text on Face */}
            <div>
              <Label htmlFor="textOnFace" className="text-sm">Text on Face (Front/Back)</Label>
              <Input
                id="textOnFace"
                value={stampData.plating?.textOnFace || ""}
                onChange={(e) => updatePlatingField("textOnFace", e.target.value)}
                className="mt-1"
                placeholder="Enter text visible on stamp face"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Text Color */}
              <div>
                <Label htmlFor="textColor" className="text-sm">Text Color</Label>
                <Select
                  value={stampData.plating?.textColor || ""}
                  onValueChange={(value) => updatePlatingField("textColor", value)}
                >
                  <SelectTrigger id="textColor" className="mt-1">
                    <SelectValue placeholder="Select color of text" />
                  </SelectTrigger>
                  <SelectContent>
                    {textColorOptions.map(color => (
                      <SelectItem key={color} value={color}>{color}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Flaw Image Upload */}
              <div>
                <Label htmlFor="flawImage" className="text-sm">Flaw Image</Label>
                <div className="mt-1 flex items-center gap-2">
                  <div className="relative">
                    <Button
                      variant="outline"
                      className="w-full"
                      size="sm"
                      type="button"
                    >
                      {stampData.plating?.flawImage ? "Change Image" : "Upload Image"}
                    </Button>
                    <input
                      id="flawImage"
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handlePlatingImageUpload}
                    />
                  </div>
                  {stampData.plating?.flawImage && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={() => updatePlatingField("flawImage", "")}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Flaw Description */}
            <div>
              <Label htmlFor="flawDescription" className="text-sm">Flaw Description</Label>
              <Textarea
                id="flawDescription"
                value={stampData.plating?.flawDescription || ""}
                onChange={(e) => updatePlatingField("flawDescription", e.target.value)}
                className="mt-1 min-h-[100px]"
                placeholder="Describe the specific flaws or characteristics of this stamp position"
              />
            </div>
            
            {/* Flaw Image Preview */}
            {stampData.plating?.flawImage && (
              <div className="border rounded-md p-2">
                <Label className="text-sm mb-2 block">Flaw Image Preview:</Label>
                <div className="flex justify-center">
                  <img 
                    src={stampData.plating.flawImage} 
                    alt="Stamp flaw" 
                    className="max-h-[200px] max-w-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsPlatingDialogOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 