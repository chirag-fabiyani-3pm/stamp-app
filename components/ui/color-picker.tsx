"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"

interface ColorPickerProps {
  value?: string
  onChange: (value: string) => void
  predefinedColors?: string[]
  placeholder?: string
}

// Predefined colors for stamp colors
const defaultStampColors = [
  "#8B4B9B", // Purple
  "#8B4513", // Brown
  "#DC143C", // Red
  "#0000FF", // Blue
  "#228B22", // Green
  "#000000", // Black
  "#808080", // Grey
  "#FFD700", // Yellow
  "#FFA500", // Orange
  "#FF69B4", // Pink
  "#40E0D0", // Turquoise
  "#4B0082", // Indigo
]

export function ColorPicker({ 
  value = "", 
  onChange, 
  predefinedColors = defaultStampColors,
  placeholder = "Select color" 
}: ColorPickerProps) {
  const [customColor, setCustomColor] = useState(value)
  const [isOpen, setIsOpen] = useState(false)

  const handlePredefinedColorSelect = (color: string) => {
    onChange(color)
    setCustomColor(color)
    setIsOpen(false)
  }

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color)
    onChange(color)
  }

  const getColorDisplayValue = (colorValue: string) => {
    if (!colorValue) return placeholder
    
    // If it's a hex color, show it
    if (colorValue.startsWith('#')) {
      return colorValue.toUpperCase()
    }
    
    // Otherwise show the text value
    return colorValue
  }

  const getColorDisplayColor = (colorValue: string) => {
    // If it's a hex color, use it directly
    if (colorValue.startsWith('#')) {
      return colorValue
    }
    
    // Map common color names to hex values
    const colorMap: Record<string, string> = {
      'purple': '#8B4B9B',
      'brown': '#8B4513',
      'red': '#DC143C',
      'blue': '#0000FF',
      'green': '#228B22',
      'black': '#000000',
      'grey': '#808080',
      'gray': '#808080',
      'yellow': '#FFD700',
      'orange': '#FFA500',
      'pink': '#FF69B4',
      'turquoise': '#40E0D0',
      'indigo': '#4B0082',
      'white': '#FFFFFF',
    }
    
    const colorLower = colorValue.toLowerCase()
    return colorMap[colorLower] || '#808080'
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start gap-2 h-9"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div 
            className="w-4 h-4 rounded border"
            style={{ backgroundColor: value ? getColorDisplayColor(value) : '#f3f4f6' }}
          />
          <span className="truncate">{getColorDisplayValue(value)}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="space-y-3">
          <div>
            <Label className="text-sm font-medium">Predefined Colors</Label>
            <div className="grid grid-cols-6 gap-2 mt-2">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded border-2 hover:scale-110 transition-transform ${
                    value === color ? 'border-primary' : 'border-border'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handlePredefinedColorSelect(color)}
                  title={color}
                />
              ))}
            </div>
          </div>
          
          <div className="border-t pt-3">
            <Label className="text-sm font-medium">Custom Color</Label>
            <div className="flex gap-2 mt-2">
              <Input
                type="color"
                value={customColor}
                onChange={(e) => handleCustomColorChange(e.target.value)}
                className="w-12 h-9 p-1 border"
              />
              <Input
                type="text"
                value={customColor}
                onChange={(e) => handleCustomColorChange(e.target.value)}
                placeholder="#RRGGBB"
                className="flex-1 h-9"
              />
            </div>
          </div>

          <div className="border-t pt-3">
            <Label className="text-sm font-medium">Color Names</Label>
            <div className="grid grid-cols-2 gap-1 mt-2">
              {['Purple', 'Brown', 'Red', 'Blue', 'Green', 'Black', 'Grey', 'Yellow'].map((colorName) => (
                <Button
                  key={colorName}
                  variant="ghost"
                  size="sm"
                  className="justify-start text-xs h-7"
                  onClick={() => {
                    onChange(colorName)
                    setIsOpen(false)
                  }}
                >
                  <div 
                    className="w-3 h-3 rounded mr-2"
                    style={{ backgroundColor: getColorDisplayColor(colorName) }}
                  />
                  {colorName}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
} 