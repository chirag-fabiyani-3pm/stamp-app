"use client"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Camera,
    FileImage,
    Loader2,
    Search,
    Upload,
    X
} from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

interface ImageSearchResult {
    isStamp: boolean
    confidence: number
    stampDetails?: {
        name: string
        country: string
        denomination: string
        year: string
        color: string
        description: string
        imageUrl: string
    }
    suggestions?: Array<{
        name: string
        country: string
        similarity: number
        imageUrl: string
    }>
}

interface ImageSearchProps {
    isOpen: boolean
    onClose: () => void
}

export function ImageSearch({ isOpen, onClose }: ImageSearchProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const [uploadedImage, setUploadedImage] = useState<string | null>(null)
    const [searchResult, setSearchResult] = useState<ImageSearchResult | null>(null)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setUploadedImage(null)
            setSearchResult(null)
            setError(null)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }, [isOpen])

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file (JPEG, PNG, etc.)')
            return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image file size must be less than 5MB')
            return
        }

        setError(null)
        setIsUploading(true)

        const reader = new FileReader()
        reader.onload = (e) => {
            setUploadedImage(e.target?.result as string)
            setIsUploading(false)
        }
        reader.readAsDataURL(file)
    }

    const handleSearch = async () => {
        if (!uploadedImage) return

        setIsSearching(true)
        setError(null)
        setSearchResult(null)

        try {
            // Convert base64 to blob
            const response = await fetch(uploadedImage)
            const blob = await response.blob()

            // Create FormData
            const formData = new FormData()
            formData.append('image', blob, 'stamp-image.jpg')

            const searchResponse = await fetch('/api/search-by-image', {
                method: 'POST',
                body: formData,
            })

            const result = await searchResponse.json()

            if (result.error) {
                throw new Error(result.error)
            }

            setSearchResult(result)
        } catch (error) {
            console.error('Error searching by image:', error)
            setError('Failed to search by image. Please try again.')
        } finally {
            setIsSearching(false)
        }
    }

    const handleReset = () => {
        setUploadedImage(null)
        setSearchResult(null)
        setError(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const triggerFileUpload = () => {
        fileInputRef.current?.click()
    }

    if (!isOpen) {
        return null
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src="/images/stamp-bot-avatar.png" alt="PhilaGuide AI" />
                            <AvatarFallback className="bg-orange-100 text-orange-700 text-xs">PG</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-lg">Image Search</CardTitle>
                            <p className="text-sm text-gray-600">Upload a stamp image to find details</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </CardHeader>

                <CardContent className="space-y-4 flex-1 overflow-y-auto">
                    <ScrollArea className="h-full">
                        <div className="space-y-4 pr-4">
                            {/* Upload Section */}
                            {!uploadedImage && (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-300 transition-colors">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                                            <Upload className="w-8 h-8 text-orange-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                Upload Stamp Image
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-4">
                                                Upload an image of a stamp to get detailed information
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button onClick={triggerFileUpload} disabled={isUploading}>
                                                {isUploading ? (
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                ) : (
                                                    <FileImage className="w-4 h-4 mr-2" />
                                                )}
                                                {isUploading ? 'Uploading...' : 'Choose Image'}
                                            </Button>
                                            <Button variant="outline" onClick={triggerFileUpload}>
                                                <Camera className="w-4 h-4 mr-2" />
                                                Camera
                                            </Button>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            Supports JPEG, PNG • Max 5MB
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Hidden file input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />

                            {/* Uploaded Image Preview */}
                            {uploadedImage && (
                                <div className="space-y-4">
                                    <div className="relative">
                                        <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-200">
                                            <Image
                                                src={uploadedImage}
                                                alt="Uploaded stamp"
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleReset}
                                            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            onClick={handleSearch}
                                            disabled={isSearching}
                                            className="flex-1"
                                        >
                                            {isSearching ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Searching...
                                                </>
                                            ) : (
                                                <>
                                                    <Search className="w-4 h-4 mr-2" />
                                                    Search Stamp
                                                </>
                                            )}
                                        </Button>
                                        <Button variant="outline" onClick={handleReset}>
                                            Reset
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <p className="text-red-700 text-sm">{error}</p>
                                </div>
                            )}

                            {/* Search Results */}
                            {searchResult && (
                                <div className="space-y-4">
                                    <div className="border-t pt-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Results</h3>

                                        {searchResult.isStamp ? (
                                            <div className="space-y-4">
                                                {/* Confidence Score */}
                                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                        <span className="text-green-700 font-medium">
                                                            This appears to be a stamp ({Math.round(searchResult.confidence * 100)}% confidence)
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Stamp Details */}
                                                {searchResult.stampDetails && (
                                                    <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
                                                        <CardHeader className="pb-3">
                                                            <div className="flex items-start gap-3">
                                                                <div className="relative w-16 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 border-orange-200 bg-gray-100">
                                                                    <Image
                                                                        src={searchResult.stampDetails.imageUrl}
                                                                        alt={searchResult.stampDetails.name}
                                                                        fill
                                                                        className="object-cover"
                                                                        onError={(e) => {
                                                                            const target = e.target as HTMLImageElement
                                                                            target.src = '/images/stamps/no-image-available.png'
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <CardTitle className="text-sm font-semibold text-gray-900 leading-tight break-words">
                                                                        {searchResult.stampDetails.name}
                                                                    </CardTitle>
                                                                    <p className="text-xs text-gray-600 mt-1 break-words">
                                                                        {searchResult.stampDetails.country} • {searchResult.stampDetails.year} • {searchResult.stampDetails.denomination}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </CardHeader>
                                                        <CardContent className="pt-0">
                                                            <div className="space-y-2">
                                                                <div className="text-sm text-gray-700">
                                                                    <span className="font-medium">Color:</span> {searchResult.stampDetails.color}
                                                                </div>
                                                                <div className="text-sm text-gray-700">
                                                                    <span className="font-medium">Description:</span> {searchResult.stampDetails.description}
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                )}

                                                {/* Similar Stamps */}
                                                {searchResult.suggestions && searchResult.suggestions.length > 0 && (
                                                    <div>
                                                        <h4 className="text-md font-medium text-gray-900 mb-3">Similar Stamps</h4>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                            {searchResult.suggestions.slice(0, 4).map((suggestion, index) => (
                                                                <Card key={index} className="border-gray-200">
                                                                    <CardContent className="p-3">
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="relative w-12 h-16 flex-shrink-0 rounded overflow-hidden border border-gray-200 bg-gray-100">
                                                                                <Image
                                                                                    src={suggestion.imageUrl}
                                                                                    alt={suggestion.name}
                                                                                    fill
                                                                                    className="object-cover"
                                                                                    onError={(e) => {
                                                                                        const target = e.target as HTMLImageElement
                                                                                        target.src = '/images/stamps/no-image-available.png'
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                            <div className="flex-1 min-w-0">
                                                                                <p className="text-xs font-medium text-gray-900 truncate">
                                                                                    {suggestion.name}
                                                                                </p>
                                                                                <p className="text-xs text-gray-600 truncate">
                                                                                    {suggestion.country}
                                                                                </p>
                                                                                <p className="text-xs text-orange-600">
                                                                                    {Math.round(suggestion.similarity * 100)}% match
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </CardContent>
                                                                </Card>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                                    <span className="text-yellow-700">
                                                        This doesn't appear to be a stamp image. Please upload a clear image of a stamp.
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
} 