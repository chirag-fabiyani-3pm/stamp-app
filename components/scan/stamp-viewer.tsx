"use client"

import React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Printer, ChevronLeft, ZoomIn, ZoomOut } from "lucide-react"

type StampViewerProps = {
  stamp: {
    name: string
    imagePath: string
    description: string
  }
  scanID: string
  onBack: () => void
  mode?: "reference" | "observation"
}

export default function StampViewer({ stamp, scanID, onBack, mode = "reference" }: StampViewerProps) {
  const [zoomLevel, setZoomLevel] = React.useState(1);
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };
  
  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-base md:text-lg">Stamp Viewer</CardTitle>
        <CardDescription className="text-xs md:text-sm line-clamp-2">
          {stamp.name} - {stamp.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 md:p-4">
        <div className="relative aspect-square w-full max-w-[300px] mx-auto mb-4 border rounded-lg overflow-hidden bg-card">
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s ease-in-out' }}
          >
            <Image 
              src={stamp.imagePath}
              alt={stamp.name}
              width={300}
              height={300}
              className="object-contain"
              priority
            />
          </div>
        </div>
        
        <div className="flex justify-center space-x-3 mb-4">
          <Button variant="outline" size="sm" onClick={handleZoomOut} className="flex-1 sm:flex-none w-full sm:w-auto">
            <ZoomOut className="h-4 w-4 mr-1" />
            <span className="sr-only sm:not-sr-only sm:inline">Zoom Out</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomIn} className="flex-1 sm:flex-none w-full sm:w-auto">
            <ZoomIn className="h-4 w-4 mr-1" />
            <span className="sr-only sm:not-sr-only sm:inline">Zoom In</span>
          </Button>
        </div>
        
        {mode === "observation" && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full mb-4">
                <Printer className="h-4 w-4 mr-2" />
                Print Image
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-md rounded-lg p-3 md:p-6">
              <DialogHeader>
                <DialogTitle>Print Preview</DialogTitle>
                <DialogDescription>
                  Print this image for your records.
                </DialogDescription>
              </DialogHeader>
              <div className="p-3 md:p-6 border rounded-md">
                <Image 
                  src={stamp.imagePath}
                  alt={stamp.name}
                  width={300}
                  height={300}
                  className="mx-auto"
                />
                <div className="mt-4 text-center">
                  <h3 className="font-semibold">{stamp.name}</h3>
                  <p className="text-sm">{stamp.description}</p>
                  <p className="text-xs mt-2">Scan ID: {scanID}</p>
                </div>
              </div>
              <Button onClick={() => window.print()} className="w-full sm:w-auto mt-2">Print</Button>
            </DialogContent>
          </Dialog>
        )}
        
        <div className="flex justify-between mt-2">
          <Button variant="outline" size="sm" onClick={onBack} className="w-full sm:w-auto">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 