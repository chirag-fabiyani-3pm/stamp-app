"use client"

import React from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// Sample image URLs for demonstration
const stampImages = {
  "1d-red": "https://placehold.co/400x400/e2e8f0/1e293b?text=1",
  "1d-brown": "https://placehold.co/400x400/e2e8f0/1e293b?text=2",
  "2d-blue": "https://placehold.co/400x400/e2e8f0/1e293b?text=3",
  "2d-orange": "https://placehold.co/400x400/e2e8f0/1e293b?text=4",
  "3d-lilac": "https://placehold.co/400x400/e2e8f0/1e293b?text=5",
  "4d-rose": "https://placehold.co/400x400/e2e8f0/1e293b?text=6",
  "4d-yellow": "https://placehold.co/400x400/e2e8f0/1e293b?text=7",
  "6d-brown": "https://placehold.co/400x400/e2e8f0/1e293b?text=8",
  "6d-black-brown": "https://placehold.co/400x400/e2e8f0/1e293b?text=9",
  "6d-blue": "https://placehold.co/400x400/e2e8f0/1e293b?text=10",
  "1s-green": "https://placehold.co/400x400/e2e8f0/1e293b?text=11",
}

// Color number data
const colorNumbers = [
  { id: 1, denomination: "1d", color: "Red", colorNumber: 1, image: stampImages["1d-red"] },
  { id: 2, denomination: "1d", color: "Brown", colorNumber: 2, image: stampImages["1d-brown"] },
  { id: 3, denomination: "2d", color: "Blue", colorNumber: 3, image: stampImages["2d-blue"] },
  { id: 4, denomination: "2d", color: "Orange", colorNumber: 4, image: stampImages["2d-orange"] },
  { id: 5, denomination: "3d", color: "Lilac", colorNumber: 5, image: stampImages["3d-lilac"] },
  { id: 6, denomination: "4d", color: "Rose", colorNumber: 6, image: stampImages["4d-rose"] },
  { id: 7, denomination: "4d", color: "Yellow", colorNumber: 7, image: stampImages["4d-yellow"] },
  { id: 8, denomination: "6d", color: "Brown", colorNumber: 8, image: stampImages["6d-brown"] },
  { id: 9, denomination: "6d", color: "Black Brown", colorNumber: 9, image: stampImages["6d-black-brown"] },
  { id: 10, denomination: "6d", color: "Blue", colorNumber: 10, image: stampImages["6d-blue"] },
  { id: 11, denomination: "1 Shilling", color: "Green", colorNumber: 11, image: stampImages["1s-green"] },
]

export default function ColorNumbersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/catalog-system">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Catalog System
          </Link>
        </Button>
      </div>
      
      <div>
        <h1 className="text-2xl font-bold">The Numbers Code</h1>
        <p className="text-muted-foreground mt-1">
          Color numbers for the Full Face Queens Group (the Chalons)
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Full Face Queens Group – the Chalons – the Colour Numbers (CNo)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p>
            As most characteristics are known and put into the datastore at the commencement of each country 
            (certain characteristics being the same across multiple countries), numbers can be appointed to each characteristic.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {colorNumbers.slice(0, 6).map(stamp => (
                  <div key={stamp.id} className="flex flex-col items-center text-center">
                    <div className="relative w-full aspect-square border rounded-md overflow-hidden">
                      <Image
                        src={stamp.image}
                        alt={`${stamp.denomination} ${stamp.color}`}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="mt-2">
                      <div className="font-medium">{stamp.denomination} {stamp.color}</div>
                      <Badge variant="outline" className="mt-1">{stamp.colorNumber}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {colorNumbers.slice(6).map(stamp => (
                  <div key={stamp.id} className="flex flex-col items-center text-center">
                    <div className="relative w-full aspect-square border rounded-md overflow-hidden">
                      <Image
                        src={stamp.image}
                        alt={`${stamp.denomination} ${stamp.color}`}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="mt-2">
                      <div className="font-medium">{stamp.denomination} {stamp.color}</div>
                      <Badge variant="outline" className="mt-1">{stamp.colorNumber}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6 border-t pt-4">
            <p>
              If the user decides to click on any of the stamp types, then they will be provided with a 
              hierarchy tree of all the different varieties of that type.
            </p>
            
            <div className="flex justify-center mt-6">
              <div className="relative w-full max-w-lg h-80 border rounded-md overflow-hidden">
                <Image
                  src="https://placehold.co/800x600/e2e8f0/1e293b?text=Hierarchy+Tree+Example"
                  alt="Stamp Hierarchy Tree Example"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-muted p-4 rounded-lg mt-6">
            <h3 className="font-medium mb-2">Notes on the Color Number System</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Each color is assigned a specific number (1-11) for the Chalon Head stamps
              </li>
              <li>
                Multiple denominations can have the same color, but each unique denomination-color 
                combination has its own color number
              </li>
              <li>
                Color numbers are referenced in the SOA Catalog Code system for quick identification
              </li>
              <li>
                This approach creates a concise universal reference that works across different catalog systems
              </li>
            </ul>
          </div>
          
          <div className="flex justify-end">
            <Button asChild>
              <Link href="/admin/catalog">
                Browse Catalog
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 