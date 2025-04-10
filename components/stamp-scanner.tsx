"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Camera, Loader2, ArrowRight } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StampResult from "@/components/stamp-result"
import EditableStampResult from "@/components/editable-stamp-result"
import { useToast } from "@/components/ui/use-toast"

export default function StampScanner() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [image, setImage] = useState<string | null>(null)
  const [result, setResult] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<"upload" | "analyze" | "edit" | "confirm">("upload")
  const [editedResult, setEditedResult] = useState<any | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setImage(event.target.result as string)
        setResult(null)
        setError(null)
        setStep("upload")
      }
    }
    reader.readAsDataURL(file)
  }

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      const video = document.createElement("video")
      video.srcObject = stream
      video.play()

      setTimeout(() => {
        const canvas = document.createElement("canvas")
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext("2d")
        ctx?.drawImage(video, 0, 0)

        const tracks = stream.getTracks()
        tracks.forEach((track) => track.stop())

        const dataUrl = canvas.toDataURL("image/jpeg")
        setImage(dataUrl)
        setResult(null)
        setError(null)
        setStep("upload")
      }, 500)
    } catch (err) {
      setError("Could not access camera. Please check permissions.")
    }
  }

  const analyzeStamp = async () => {
    if (!image) return

    setIsLoading(true)
    setError(null)
    setStep("analyze")

    try {
      // Simulate a delay to mimic AI processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulated stamp data - this would normally come from the AI
      const stampData = {
        country: "New Zealand",
        year: 1935,
        denomination: "1 Penny (1d)",
        color: "Red",
        condition: "Very Good",
        rarity: "Uncommon",
        designElements: [
          "Portrait of King George V on the right",
          "Portrait of Queen Mary on the left",
          "Text 'SILVER JUBILEE' in the center",
          "Dates '1910' and '1935' marking the jubilee period",
          "Text 'NEW ZEALAND' at the top",
          "Text 'POSTAGE AND REVENUE' at the bottom",
        ],
        historicalSignificance:
          "This stamp was issued to celebrate the 25th anniversary (Silver Jubilee) of King George V's reign. It's part of a series of Silver Jubilee stamps released throughout the British Empire in 1935.",
        estimatedValue: "$45 - $60",
        catalogReference: "SG 573, Scott 185",
      }

      setResult(stampData)
      setEditedResult(stampData)
      setStep("edit")
    } catch (err) {
      setError("Failed to analyze stamp. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditComplete = (editedData: any) => {
    setEditedResult(editedData)
    setStep("confirm")
  }

  const handleAddToCollection = () => {
    // In a real app, this would save to a database
    toast({
      title: "Success!",
      description: "Stamp added to your collection.",
    })

    // Reset the form
    setImage(null)
    setResult(null)
    setEditedResult(null)
    setStep("upload")
  }

  const handleListToMarketplace = () => {
    // In a real app, this would redirect to the marketplace listing form with prefilled data
    toast({
      title: "Redirecting...",
      description: "Taking you to create a marketplace listing with these details.",
    })

    // Simulate the process of creating a listing
    setTimeout(() => {
      // Show success toast after "submission"
      toast({
        title: "Success!",
        description: "Your stamp has been listed on the marketplace.",
        variant: "default",
      })

      // Reset the form
      setImage(null)
      setResult(null)
      setEditedResult(null)
      setStep("upload")
    }, 2000)
  }

  const renderContent = () => {
    if (step === "upload" || step === "analyze") {
      return (
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="upload">Upload Image</TabsTrigger>
            <TabsTrigger value="camera">Use Camera</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div className="flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-12">
              {image ? (
                <div className="text-center">
                  <img
                    src={image || "/placeholder.svg"}
                    alt="Uploaded stamp"
                    className="max-h-64 mx-auto mb-4 rounded-md"
                  />
                  <Button variant="outline" onClick={() => setImage(null)}>
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Upload Stamp Image</h3>
                  <p className="text-sm text-muted-foreground mb-4">Drag and drop or click to browse</p>
                  <Button variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
                    Select File
                  </Button>
                  <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="camera" className="space-y-4">
            <div className="flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-12">
              {image ? (
                <div className="text-center">
                  <img
                    src={image || "/placeholder.svg"}
                    alt="Captured stamp"
                    className="max-h-64 mx-auto mb-4 rounded-md"
                  />
                  <Button variant="outline" onClick={() => setImage(null)}>
                    Take New Photo
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Camera className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Capture Stamp Image</h3>
                  <p className="text-sm text-muted-foreground mb-4">Use your device camera to take a photo</p>
                  <Button variant="outline" onClick={handleCameraCapture}>
                    Open Camera
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {image && !result && !isLoading && (
            <div className="flex justify-center">
              <Button onClick={analyzeStamp} className="gap-2">
                Analyze Stamp
              </Button>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Analyzing stamp image...</p>
            </div>
          )}

          {error && <div className="bg-destructive/10 text-destructive p-4 rounded-md">{error}</div>}
        </Tabs>
      )
    } else if (step === "edit" && result) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Edit Stamp Details</h2>
            <Button variant="ghost" size="sm" onClick={() => setStep("upload")}>
              Start Over
            </Button>
          </div>
          <EditableStampResult data={result} onComplete={handleEditComplete} />
        </div>
      )
    } else if (step === "confirm" && editedResult) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Confirm Stamp Details</h2>
            <Button variant="ghost" size="sm" onClick={() => setStep("edit")}>
              Edit Again
            </Button>
          </div>

          <StampResult data={editedResult} />

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4 border-t">
            <Button onClick={handleAddToCollection} variant="outline" className="gap-2">
              Add to Collection
            </Button>
            <Button onClick={handleListToMarketplace} className="gap-2">
              List on Marketplace <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )
    }
  }

  return (
    <Card className="border shadow-md">
      <CardContent className="p-6">{renderContent()}</CardContent>
    </Card>
  )
}
