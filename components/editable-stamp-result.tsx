"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Plus, Trash } from "lucide-react"

interface EditableStampResultProps {
  data: {
    country: string
    year: number
    denomination: string
    color: string
    condition: string
    rarity: string
    designElements: string[]
    historicalSignificance: string
    estimatedValue: string
    catalogReference: string
  }
  onComplete: (editedData: any) => void
}

export default function EditableStampResult({ data, onComplete }: EditableStampResultProps) {
  const [editedData, setEditedData] = useState({ ...data })
  const [newDesignElement, setNewDesignElement] = useState("")

  const handleChange = (field: string, value: string | number) => {
    setEditedData({
      ...editedData,
      [field]: value,
    })
  }

  const handleAddDesignElement = () => {
    if (newDesignElement.trim()) {
      setEditedData({
        ...editedData,
        designElements: [...editedData.designElements, newDesignElement.trim()],
      })
      setNewDesignElement("")
    }
  }

  const handleRemoveDesignElement = (index: number) => {
    setEditedData({
      ...editedData,
      designElements: editedData.designElements.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = () => {
    onComplete(editedData)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Card className="bg-primary/5 p-6 rounded-lg">
            <div className="flex justify-center mb-4">
              <Badge className="text-sm">AI Identified</Badge>
            </div>
            <img
              src="/typography-chalk-king-george-v-silver-jubilee-medal-archives-new-zealand-postal-history-revenue-stamp-definitive-stamp-edward-vii-george-v-philately-monarchy-of-the-united-kingdom-thumbnail.png"
              alt="Stamp"
              className="mx-auto max-h-64 object-contain mb-4"
            />
            <p className="text-sm text-center text-muted-foreground">
              You can edit the details to ensure accuracy before adding to your collection or marketplace.
            </p>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={editedData.country}
                onChange={(e) => handleChange("country", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={editedData.year}
                onChange={(e) => handleChange("year", Number.parseInt(e.target.value) || editedData.year)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="denomination">Denomination</Label>
              <Input
                id="denomination"
                value={editedData.denomination}
                onChange={(e) => handleChange("denomination", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input id="color" value={editedData.color} onChange={(e) => handleChange("color", e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select value={editedData.condition} onValueChange={(value) => handleChange("condition", value)}>
                <SelectTrigger id="condition">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mint">Mint</SelectItem>
                  <SelectItem value="Excellent">Excellent</SelectItem>
                  <SelectItem value="Very Good">Very Good</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                  <SelectItem value="Poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rarity">Rarity</Label>
              <Select value={editedData.rarity} onValueChange={(value) => handleChange("rarity", value)}>
                <SelectTrigger id="rarity">
                  <SelectValue placeholder="Select rarity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Common">Common</SelectItem>
                  <SelectItem value="Uncommon">Uncommon</SelectItem>
                  <SelectItem value="Rare">Rare</SelectItem>
                  <SelectItem value="Very Rare">Very Rare</SelectItem>
                  <SelectItem value="Extremely Rare">Extremely Rare</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="catalogReference">Catalog Reference</Label>
            <Input
              id="catalogReference"
              value={editedData.catalogReference}
              onChange={(e) => handleChange("catalogReference", e.target.value)}
              placeholder="e.g., SG 573, Scott 185"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedValue">Estimated Value</Label>
            <Input
              id="estimatedValue"
              value={editedData.estimatedValue}
              onChange={(e) => handleChange("estimatedValue", e.target.value)}
              placeholder="e.g., $45 - $60"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Design Elements</Label>
          <div className="space-y-2">
            {editedData.designElements.map((element, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={element}
                  onChange={(e) => {
                    const newElements = [...editedData.designElements]
                    newElements[index] = e.target.value
                    handleChange("designElements", newElements)
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveDesignElement(index)}
                  className="text-destructive"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <Input
                placeholder="Add new design element"
                value={newDesignElement}
                onChange={(e) => setNewDesignElement(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddDesignElement()
                  }
                }}
              />
              <Button variant="outline" size="icon" onClick={handleAddDesignElement}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="historicalSignificance">Historical Significance</Label>
          <Textarea
            id="historicalSignificance"
            value={editedData.historicalSignificance}
            onChange={(e) => handleChange("historicalSignificance", e.target.value)}
            rows={4}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} className="gap-2">
          Confirm Details <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
