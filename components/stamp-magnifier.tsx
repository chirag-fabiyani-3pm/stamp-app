"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, Info } from "lucide-react"

interface StampMagnifierProps {
  imageSrc: string
  imageAlt: string
}

export default function StampMagnifier({ imageSrc, imageAlt }: StampMagnifierProps) {
  const [zoomLevel, setZoomLevel] = useState(2.5)
  const [showMagnifier, setShowMagnifier] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [touchUsed, setTouchUsed] = useState(false)
  const [showHelp, setShowHelp] = useState(true)

  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle mouse movement over the image
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current || !containerRef.current) return

    const { left, top } = imgRef.current.getBoundingClientRect()
    const x = ((e.clientX - left) / imgRef.current.width) * 100
    const y = ((e.clientY - top) / imgRef.current.height) * 100

    setMousePosition({ x, y })

    if (!showMagnifier) {
      setShowMagnifier(true)
    }
  }

  // Handle touch movement for mobile devices
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!imgRef.current || !containerRef.current) return
    e.preventDefault() // Prevent scrolling while using magnifier

    const touch = e.touches[0]
    const { left, top } = imgRef.current.getBoundingClientRect()
    const x = ((touch.clientX - left) / imgRef.current.width) * 100
    const y = ((touch.clientY - top) / imgRef.current.height) * 100

    setMousePosition({ x, y })
    setTouchUsed(true)

    if (!showMagnifier) {
      setShowMagnifier(true)
    }
  }

  // Handle mouse/touch exit
  const handleMouseLeave = () => {
    if (!touchUsed) {
      setShowMagnifier(false)
    }
  }

  const handleTouchEnd = () => {
    setShowMagnifier(false)
    setTouchUsed(false)
  }

  // Increase/decrease zoom level
  const increaseZoom = () => setZoomLevel(Math.min(zoomLevel + 0.5, 5))
  const decreaseZoom = () => setZoomLevel(Math.max(zoomLevel - 0.5, 1.5))

  // Hide help message after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHelp(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Info className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {touchUsed ? "Tap and drag to examine" : "Hover to magnify"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={decreaseZoom} disabled={zoomLevel <= 1.5}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm w-12 text-center">{zoomLevel.toFixed(1)}x</span>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={increaseZoom} disabled={zoomLevel >= 5}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Main image container */}
        <div
          ref={containerRef}
          className="relative border rounded-lg overflow-hidden bg-white"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchStart={() => setTouchUsed(true)}
        >
          {/* Original image */}
          <div className="aspect-square">
            <img
              ref={imgRef}
              src={imageSrc || "/placeholder.svg"}
              alt={imageAlt}
              className="w-full h-full object-contain"
              draggable="false"
            />
          </div>

          {/* Magnifier lens indicator */}
          {showMagnifier && (
            <div
              className="absolute border-2 border-primary rounded-full pointer-events-none"
              style={{
                left: `${mousePosition.x}%`,
                top: `${mousePosition.y}%`,
                width: "40px",
                height: "40px",
                transform: "translate(-50%, -50%)",
              }}
            />
          )}

          {/* Help overlay */}
          {showHelp && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white pointer-events-none transition-opacity duration-500">
              <div className="text-center p-4 rounded-lg">
                <p className="text-lg font-medium mb-2">Stamp Magnifier</p>
                <p>{touchUsed ? "Tap and drag" : "Hover"} over the stamp to examine details</p>
              </div>
            </div>
          )}
        </div>

        {/* Magnified view container - outside the main image */}
        <div className="border rounded-lg overflow-hidden bg-white">
          <div className="aspect-square relative">
            {showMagnifier ? (
              <div
                className="w-full h-full bg-no-repeat"
                style={{
                  backgroundImage: `url(${imageSrc})`,
                  backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
                  backgroundSize: `${zoomLevel * 100}%`,
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <p className="text-muted-foreground text-center p-4">
                  {touchUsed ? "Tap and drag" : "Hover"} over the stamp image to see magnified details here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
