"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/components/ui/use-toast'
import { BACKEND_URL, FRONTEND_URL } from '@/lib/constants'
import { cn } from '@/lib/utils'
import {
    AudioLines,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    MessageSquare,
    MessageSquarePlus,
    Send,
    X
} from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useChatContext } from './chat-provider'
import { ImageSearch } from './image-search'
import VoiceChatPanel from './voice-chat-panel'

// Configuration flag for API version
const USE_RESPONSES_API = true // Set to true to use new Responses API, false for old Assistants API

interface Message {
    id: string
    content: string
    role: 'user' | 'assistant'
    timestamp: Date
    source?: 'knowledge_base' | 'internet' | 'partial_response' | 'processing_timeout' | 'fallback' // Source of the information
    sources?: string[] // Array of actual source URLs/names
    structuredData?: any
    allStamps?: StampCard[] // Store all parsed stamps for potential carousel view
    foundStamps?: number
    stampPreview?: {
        count: number
        stamps: Array<{
            name: string
            country: string
            year: string
            denomination: string
            color: string
        }>
    }
}

interface StampCard {
    type: 'card'
    id?: string
    title: string
    subtitle: string
    image: string
    content: Array<{
        section: string
        text?: string
        details?: Array<{ label: string; value: string }>
    }>
    significance: string
}

interface StampCarousel {
    type: 'carousel'
    title: string
    items: Array<{
        id: string
        title: string
        subtitle: string
        image: string
        summary: string
        marketValue: string
        quickFacts: string[]
        content?: Array<{
            section: string
            text?: string
            details?: Array<{ label: string; value: string }>
        }>
        significance?: string
        specialNotes?: string
    }>
}

interface StampCardDisplayProps {
    data: StampCard
}

interface StampCarouselDisplayProps {
    data: StampCarousel
}

interface StampPreviewDisplayProps {
    preview: {
        count: number
        stamps: Array<{
            name: string
            country: string
            year: string
            denomination: string
            color: string
        }>
    }
}

// NEW: Voice option interface (from original voice chat popup)
interface VoiceOption {
    id: string
    name: string
    description: string
}

// Function to parse structured stamp data from markdown response
function parseStructuredStampData(content: string): StampCard[] {
    const stamps: StampCard[] = []

    console.log('🔍 Parsing content for stamps:', content.substring(0, 200) + '...')

    // Split content by stamp sections - look for ## Stamp Information as the main separator
    const sections = content.split(/## Stamp Information/)
    console.log('🔍 Found ## Stamp Information sections:', sections.length)

    // Process each section (skip the first empty section)
    sections.slice(1).forEach((section, index) => {
        if (!section.trim()) return

        console.log('🔍 Processing section:', index, section.substring(0, 100) + '...')

        // Extract stamp information using regex patterns
        const stampNameMatch = section.match(/\*\*Stamp Name\*\*:\s*([^\n]+)/)
        const countryMatch = section.match(/\*\*Country\*\*:\s*([^\n]+)/)
        const idMatch = section.match(/\*\*ID\*\*:\s*([^\n]+)/)
        const imageUrlMatch = section.match(/\*\*Image URL\*\*:\s*\[([^\]]+)\]\(([^)]+)\)/)
        const descriptionMatch = section.match(/\*\*Description\*\*:\s*([^\n]+)/)
        const seriesMatch = section.match(/\*\*Series\*\*:\s*([^\n]+)/)
        const yearMatch = section.match(/\*\*Year\*\*:\s*([^\n]+)/)
        const denominationMatch = section.match(/\*\*Denomination\*\*:\s*([^\n]+)/)

        console.log('🔍 Matches:', {
            name: stampNameMatch?.[1],
            country: countryMatch?.[1],
            id: idMatch?.[1],
            imageUrl: imageUrlMatch?.[2],
            description: descriptionMatch?.[1]
        })

        if (stampNameMatch && countryMatch) {
            // Handle missing image URL - try to find any Azure blob storage URL in the section
            let imageUrl = imageUrlMatch?.[2]?.trim()
            if (!imageUrl || imageUrl === 'Not provided' || imageUrl === '(image not available)' || imageUrl === 'View Image') {
                const azureUrlMatch = section.match(/https:\/\/3pmplatformstorage\.blob\.core\.windows\.net\/[^\s)]+/)
                imageUrl = azureUrlMatch?.[0] || '/images/stamps/no-image-available.png'
            }

            const stamp: StampCard = {
                type: 'card',
                id: idMatch?.[1]?.trim() || `stamp-${index}`,
                title: stampNameMatch[1].trim(),
                subtitle: `${countryMatch[1].trim()} • ${yearMatch?.[1]?.trim() || 'Unknown Year'}`,
                image: imageUrl,
                content: [
                    {
                        section: 'Description',
                        text: descriptionMatch?.[1]?.trim() || 'No description available'
                    },
                    {
                        section: 'Details',
                        details: [
                            { label: 'Series', value: seriesMatch?.[1]?.trim() || 'Unknown' },
                            { label: 'Year', value: yearMatch?.[1]?.trim() || 'Unknown' },
                            { label: 'Denomination', value: denominationMatch?.[1]?.trim() || 'Unknown' },
                            { label: 'Country', value: countryMatch[1].trim() }
                        ]
                    }
                ],
                significance: descriptionMatch?.[1]?.trim() || 'Historical stamp from the collection'
            }

            console.log('🎴 Created stamp card:', stamp)
            stamps.push(stamp)
        }
    })

    console.log('🎴 Total stamps parsed:', stamps.length)
    return stamps
}

// Markdown message component for clean, organized formatting
function MarkdownMessage({ content }: { content: string }) {
    return (
        <div className="max-w-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    // Clean, minimal styling for better readability
                    h1: ({ children }) => <h1 className="text-lg font-semibold mb-4 text-foreground border-b border-border pb-2">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-base font-medium mb-3 text-foreground mt-4">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-sm font-medium mb-2 text-foreground/90 mt-3">{children}</h3>,
                    p: ({ children }) => <p className="mb-3 leading-relaxed text-sm text-foreground/90">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1 ml-3 text-sm">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1 ml-3 text-sm">{children}</ol>,
                    li: ({ children }) => <li className="text-sm leading-relaxed text-foreground/90">{children}</li>,
                    strong: ({ children }) => <strong className="font-medium text-foreground">{children}</strong>,
                    em: ({ children }) => <em className="italic text-foreground/80">{children}</em>,
                    code: ({ children }) => <code className="bg-muted/50 px-1.5 py-0.5 rounded text-xs font-mono border border-border">{children}</code>,
                    pre: ({ children }) => <pre className="bg-muted/50 p-3 rounded-md text-xs overflow-x-auto border border-border my-3">{children}</pre>,
                    blockquote: ({ children }) => <blockquote className="border-l-3 border-primary/20 pl-3 italic text-muted-foreground bg-muted/20 py-2 rounded-r-md my-3">{children}</blockquote>,
                    a: ({ href, children }) => <a href={href} className="text-primary hover:underline hover:text-primary/80 transition-colors" target="_blank" rel="noopener noreferrer">{children}</a>,
                    hr: () => <hr className="border-border my-4" />,
                    table: ({ children }) => <div className="overflow-x-auto my-3"><table className="min-w-full border border-border rounded-md">{children}</table></div>,
                    th: ({ children }) => <th className="border border-border px-3 py-2 text-left font-semibold bg-muted/50">{children}</th>,
                    td: ({ children }) => <td className="border border-border px-3 py-2 text-sm">{children}</td>,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
}

function StampPreviewDisplay({ preview }: StampPreviewDisplayProps) {
    return (
        <Card className="w-full max-w-full border-input bg-card/70 backdrop-blur-sm overflow-hidden shadow-md">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-foreground">
                    Found {preview.count} stamp{preview.count !== 1 ? 's' : ''}
                </CardTitle>
                <p className="text-xs text-muted-foreground">Loading detailed information...</p>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
                {preview.stamps.slice(0, 3).map((stamp, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-background rounded-lg border border-input shadow-sm">
                        <div className="w-8 h-10 bg-muted rounded animate-pulse"></div>
                        <div className="flex-1">
                            <div className="text-sm font-medium text-foreground">{stamp.name}</div>
                            <div className="text-xs text-muted-foreground">
                                {stamp.country} • {stamp.year} • {stamp.denomination} • {stamp.color}
                            </div>
                        </div>
                    </div>
                ))}
                {preview.stamps.length > 3 && (
                    <div className="text-xs text-muted-foreground text-center pt-2">
                        And {preview.stamps.length - 3} more stamps...
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

function StampCardDisplay({ data }: StampCardDisplayProps) {
    console.log('🎴 StampCardDisplay called with data:', data)
    console.log('🎴 StampCardDisplay - data type:', typeof data)
    console.log('🎴 StampCardDisplay - data keys:', Object.keys(data))

    return (
        <Card className="w-full max-w-full border-input bg-card/70 backdrop-blur-sm overflow-hidden shadow-md">
            <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                    <div className="relative w-16 h-20 flex-shrink-0 rounded-md overflow-hidden border border-input bg-muted">
                        <Image
                            src={data.image.replace(/^\/+/, '')}
                            alt={data.title}
                            fill
                            className="object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = '/images/stamps/no-image-available.png'
                            }}
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-base font-semibold text-foreground leading-tight break-words">
                            {data.title}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-1 break-words">{data.subtitle}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
                {data.content.map((section, index) => (
                    <div key={index}>
                        <h4 className="font-medium text-xs text-foreground mb-1">{section.section}</h4>
                        {section.text && (
                            <p className="text-xs text-muted-foreground leading-relaxed break-words">{section.text}</p>
                        )}
                        {section.details && (
                            <div className="space-y-1">
                                {section.details.map((detail, detailIndex) => (
                                    <div key={detailIndex} className="text-xs text-muted-foreground break-words">
                                        • {detail.label}: {detail.value}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                <div className="flex gap-2 pt-2">
                    <Button
                        variant="default"
                        size="sm"
                        onClick={() => window.open(`${FRONTEND_URL}/stamp-details/${data.id}`, '_blank')}
                        className="h-8 px-4 text-xs rounded-lg shadow-sm"
                    >
                        <ExternalLink className="w-3.5 h-3.5 mr-1" />
                        View Details
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

function StampCarouselDisplay({ data }: StampCarouselDisplayProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const currentItem = data.items[currentIndex]

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % data.items.length)
    }

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + data.items.length) % data.items.length)
    }

    return (
        <Card className="w-full max-w-full border-input bg-card/70 backdrop-blur-sm overflow-hidden shadow-md">
            <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                    <div className="relative w-16 h-20 flex-shrink-0 rounded-md overflow-hidden border border-input bg-muted">
                        <Image
                            src={currentItem.image.replace(/^\/+/, '')}
                            alt={currentItem.title}
                            fill
                            className="object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = '/images/stamps/no-image-available.png'
                            }}
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-base font-semibold text-foreground leading-tight break-words">
                            {currentItem.title}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-1 break-words">{currentItem.subtitle}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
                {/* Show detailed content if available, otherwise fall back to summary */}
                {currentItem.content ? (
                    // Use the new detailed content structure (same as single cards)
                    currentItem.content.map((section, index) => (
                        <div key={index}>
                            <h4 className="font-medium text-xs text-foreground mb-1">{section.section}</h4>
                            {section.text && (
                                <p className="text-xs text-muted-foreground leading-relaxed break-words">{section.text}</p>
                            )}
                            {section.details && (
                                <div className="space-y-1">
                                    {section.details.map((detail, detailIndex) => (
                                        <div key={detailIndex} className="text-xs text-muted-foreground break-words">
                                            • {detail.label}: {detail.value}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    // Fall back to summary display
                    <>
                        <p className="text-xs text-muted-foreground leading-relaxed break-words">{currentItem.summary}</p>
                        <div className="space-y-1">
                            <div className="text-xs text-muted-foreground break-words">
                                • Market Value: {currentItem.marketValue}
                            </div>
                            {currentItem.quickFacts.map((fact, index) => (
                                <div key={index} className="text-xs text-muted-foreground break-words">
                                    • {fact}
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {currentItem.significance && (
                    <div className="pt-2 border-t border-border">
                        <h4 className="font-medium text-xs text-foreground mb-1">Significance</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed break-words">{currentItem.significance}</p>
                    </div>
                )}

                {currentItem.specialNotes && (
                    <div className="pt-2 border-t border-border">
                        <h4 className="font-medium text-xs text-foreground mb-1">Special Notes</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed break-words">{currentItem.specialNotes}</p>
                    </div>
                )}

                <div className="flex gap-2 pt-2">
                    <Button
                        variant="default"
                        size="sm"
                        onClick={() => window.open(`${FRONTEND_URL}/stamp-details/${currentItem.id}`, '_blank')}
                        className="h-8 px-4 text-xs rounded-lg shadow-sm"
                    >
                        <ExternalLink className="w-3.5 h-3.5 mr-1" />
                        View Details
                    </Button>
                </div>
            </CardContent>
            <CardFooter className="pt-0">
                <div className="flex items-center justify-between w-full">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPrevious}
                        disabled={data.items.length <= 1}
                        className="h-8 px-3 text-xs"
                    >
                        <ChevronLeft className="w-3.5 h-3.5" />
                    </Button>
                    <span className="text-xs text-muted-foreground">
                        {currentIndex + 1} of {data.items.length}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={goToNext}
                        disabled={data.items.length <= 1}
                        className="h-8 px-3 text-xs"
                    >
                        <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}

// Component to display multiple stamps from structured data
function MultiStampDisplay({ stamps }: { stamps: StampCard[] }) {
    console.log('🎴 MultiStampDisplay called with stamps:', stamps)
    console.log('🎴 MultiStampDisplay - stamps type:', typeof stamps)
    console.log('🎴 MultiStampDisplay - stamps length:', stamps?.length)

    if (stamps.length === 1) {
        console.log('🎴 MultiStampDisplay - Single stamp, using StampCardDisplay')
        return <StampCardDisplay data={stamps[0]} />
    }

    if (stamps.length === 0) {
        console.log('🎴 MultiStampDisplay - No stamps, returning null')
        return null
    }

    console.log('🎴 MultiStampDisplay - Multiple stamps, creating carousel')

    // Convert to carousel format for multiple stamps
    const carouselData: StampCarousel = {
        type: 'carousel',
        title: `Found ${stamps.length} Stamps`,
        items: stamps.map(stamp => ({
            id: stamp.id || 'unknown',
            title: stamp.title,
            subtitle: stamp.subtitle,
            image: stamp.image,
            summary: stamp.significance,
            marketValue: 'Contact dealer for valuation',
            quickFacts: stamp.content
                .filter(c => c.details)
                .flatMap(c => c.details?.map(d => `${d.label}: ${d.value}`) || [])
                .slice(0, 3), // Show first 3 facts
            content: stamp.content,
            significance: stamp.significance
        }))
    }

    console.log('🎴 MultiStampDisplay - Carousel data created:', carouselData)
    return <StampCarouselDisplay data={carouselData} />
}

export function PhilaGuideChat() {
    const { isOpen, setIsOpen } = useChatContext()
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [streamingStatus, setStreamingStatus] = useState('')
    const [loadingStage, setLoadingStage] = useState<'searching' | 'analyzing' | 'processing' | 'compiling' | 'finalizing'>('searching')
    const [abortController, setAbortController] = useState<AbortController | null>(null)
    const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const { toast } = useToast()

    // Voice interaction
    const [isListening, setIsListening] = useState(false)
    const [transcript, setTranscript] = useState('')
    const [isStreamingAI, setIsStreamingAI] = useState(false) // Track if we're in the middle of streaming an AI response
    const [currentStreamingId, setCurrentStreamingId] = useState<string | null>(null) // Track current streaming message ID
    const isStreamingAIRef = useRef(false) // Immediate access to streaming state
    const currentStreamingIdRef = useRef<string | null>(null) // Immediate access to streaming ID
    const pendingAIMessage = useRef<{ id: string, deltas: string[] } | null>(null) // Queue AI message until user message is complete

    const handleTranscript = (text: string) => {
        setTranscript(text)

        // Handle voice transcripts and add them to appropriate messages array
        if (text.trim()) {
            console.log('🎤 handleTranscript received:', JSON.stringify(text))
            console.log('🎤 Voice mode active:', isVoiceMode)
            console.log('🎤 Current messages length:', messages.length)
            console.log('🎤 Current voiceMessages length:', voiceMessages.length)

            // Parse the transcript format from voice chat
            if (text.startsWith('\nYou: ')) {
                // User message from voice - first check for pending AI message BEFORE clearing state
                const pendingAI = pendingAIMessage.current // Save reference before clearing
                console.log('🎤 User message received, checking for pending AI:', !!pendingAI)

                if (pendingAI) {
                    console.log('🎤 Pending AI message details:', {
                        id: pendingAI.id,
                        deltasCount: pendingAI.deltas.length,
                        contentPreview: pendingAI.deltas.join('').substring(0, 100)
                    })
                }

                // Reset AI streaming state  
                isStreamingAIRef.current = false
                currentStreamingIdRef.current = null
                setIsStreamingAI(false)
                setCurrentStreamingId(null)
                const userMessage = text.replace('\nYou: ', '').trim()
                console.log('🎤 Extracted user message:', JSON.stringify(userMessage))

                if (userMessage) {
                    const newMessage: Message = {
                        id: Date.now().toString(),
                        content: userMessage,
                        role: 'user',
                        timestamp: new Date()
                    }

                    console.log('🎤 Creating user message:', newMessage)

                    // Add to both message arrays to keep them in sync
                    setMessages(prev => {
                        console.log('🎤 Adding to messages array, current length:', prev.length)
                        return [...prev, newMessage]
                    })
                    setVoiceMessages(prev => {
                        console.log('🎤 Adding to voiceMessages array, current length:', prev.length)
                        return [...prev, newMessage]
                    })
                    console.log('🎤 ✅ Successfully added user voice message:', userMessage)

                    // If there was a pending AI message, create it now after user message
                    if (pendingAI) {
                        const aiMessageId = pendingAI.id
                        const queuedDeltas = pendingAI.deltas

                        console.log('🎤 Creating AI message from pending queue - ID:', aiMessageId, 'Deltas count:', queuedDeltas.length)
                        console.log('🎤 Queued content preview:', queuedDeltas.join('').substring(0, 100) + '...')

                        const aiMessage: Message = {
                            id: aiMessageId,
                            content: queuedDeltas.join(''), // Combine all queued deltas
                            role: 'assistant',
                            timestamp: new Date(),
                            source: 'internet', // Voice chat uses direct API (internet-based)
                            sources: [] // Will be populated if sources are found
                        }

                        // Add AI message to both arrays
                        setMessages(prev => {
                            console.log('🎤 Adding queued AI message to messages array, current length:', prev.length)
                            return [...prev, aiMessage]
                        })
                        setVoiceMessages(prev => {
                            console.log('🎤 Adding queued AI message to voiceMessages array, current length:', prev.length)
                            return [...prev, aiMessage]
                        })

                        // Restore streaming state to continue receiving deltas for this message
                        isStreamingAIRef.current = true
                        currentStreamingIdRef.current = aiMessageId
                        setIsStreamingAI(true)
                        setCurrentStreamingId(aiMessageId)

                        console.log('🎤 ✅ Created AI message from queued deltas:', queuedDeltas.length, 'deltas')
                        console.log('🎤 ✅ Restored streaming state for continued AI response')
                    } else {
                        console.log('🎤 ⚠️ No pending AI message found when user message completed')
                    }

                    // Clear pending message after processing
                    pendingAIMessage.current = null
                }
            } else if (text.startsWith('\nAI: ')) {
                // Start of AI response - create it immediately if we have a user message, otherwise queue
                if (!isStreamingAIRef.current && !currentStreamingIdRef.current) {
                    const messageId = 'ai-streaming-' + Date.now()

                    // Set refs immediately for synchronous access
                    isStreamingAIRef.current = true
                    currentStreamingIdRef.current = messageId

                    // Set state for UI updates
                    setIsStreamingAI(true)
                    setCurrentStreamingId(messageId)

                    // Check if we have any user messages already
                    const hasUserMessages = messages.length > 0 && messages[messages.length - 1].role === 'user'

                    if (hasUserMessages) {
                        // Create AI message immediately since user message exists
                        const aiMessage: Message = {
                            id: messageId,
                            content: '',
                            role: 'assistant',
                            timestamp: new Date(),
                            source: 'internet', // Voice chat uses direct API (internet-based)
                            sources: [] // Will be populated if sources are found
                        }

                        setMessages(prev => {
                            console.log('🎤 Adding AI message immediately to messages array')
                            return [...prev, aiMessage]
                        })
                        setVoiceMessages(prev => {
                            console.log('🎤 Adding AI message immediately to voiceMessages array')
                            return [...prev, aiMessage]
                        })
                        console.log('🎤 ✅ Created AI message immediately - user message exists')
                    } else {
                        // Queue the AI message until user message completes
                        pendingAIMessage.current = {
                            id: messageId,
                            deltas: []
                        }
                        console.log('🎤 ✅ Queued AI response - waiting for user message')
                    }
                }
            } else if (text === '\n[AI_COMPLETE]') {
                // AI response is complete - mark streaming as finished
                isStreamingAIRef.current = false
                currentStreamingIdRef.current = null
                pendingAIMessage.current = null // Clear any pending message
                setIsStreamingAI(false)
                setCurrentStreamingId(null)
                console.log('🎤 AI response streaming complete')
            } else if (isStreamingAIRef.current && currentStreamingIdRef.current && text.trim() && !text.startsWith('\nYou: ') && !text.startsWith('\n[AI_COMPLETE]')) {
                // AI response delta - queue it if message is pending, otherwise update existing message
                if (pendingAIMessage.current) {
                    // Check for user input contamination before queueing
                    if (text.toLowerCase().includes('tell me about') || text.toLowerCase().includes('what is') || text.match(/^[A-Z][a-z\s]*\?$/)) {
                        console.log('🎤 🚨 CONTAMINATION DETECTED - User input in AI delta:', JSON.stringify(text))
                        console.log('🎤 🚨 Skipping contaminated delta to prevent mixing')
                        return
                    }

                    // Queue the delta
                    pendingAIMessage.current.deltas.push(text)
                    console.log('🎤 ✅ Queued AI delta:', JSON.stringify(text.substring(0, 20) + '...'), 'Total queued deltas:', pendingAIMessage.current.deltas.length)
                } else {
                    // Check for user input contamination before updating
                    if (text.toLowerCase().includes('tell me about') || text.toLowerCase().includes('what is') || text.match(/^[A-Z][a-z\s]*\?$/)) {
                        console.log('🎤 🚨 CONTAMINATION DETECTED - User input in AI update:', JSON.stringify(text))
                        console.log('🎤 🚨 Skipping contaminated delta to prevent mixing')
                        return
                    }

                    // Update existing message (AI message was created immediately)
                    const updateStreamingMessage = (prev: Message[]) => {
                        const updatedMessages = [...prev]
                        const messageIndex = updatedMessages.findIndex(msg => msg.id === currentStreamingIdRef.current)

                        if (messageIndex !== -1) {
                            updatedMessages[messageIndex] = {
                                ...updatedMessages[messageIndex],
                                content: updatedMessages[messageIndex].content + text
                            }
                            console.log('🎤 ✅ Updated AI message content, new length:', updatedMessages[messageIndex].content.length)
                        } else {
                            console.log('🎤 ❌ Could not find AI message with ID:', currentStreamingIdRef.current)
                        }

                        return updatedMessages
                    }

                    setMessages(updateStreamingMessage)
                    setVoiceMessages(updateStreamingMessage)
                    console.log('🎤 ✅ Updated AI response delta for ID:', currentStreamingIdRef.current, 'text:', text.substring(0, 20) + '...')
                }
            } else {
                console.log('🎤 ❌ handleTranscript: Text not processed:', JSON.stringify(text))
                console.log('🎤 ❌ Conditions - isStreamingAI (ref):', isStreamingAIRef.current, 'currentStreamingId (ref):', currentStreamingIdRef.current, 'text.trim():', !!text.trim())
            }
        }
    }

    const handleStartListening = () => {
        setIsListening(true)
        setTranscript('')
    }

    const handleStopListening = () => {
        setIsListening(false)
    }

    const clearTranscript = () => {
        setTranscript('')
    }

    // NEW: Voice chat mode state
    const [isVoiceMode, setIsVoiceMode] = useState(false)
    const [voiceMessages, setVoiceMessages] = useState<Message[]>([])
    const [isVoiceProcessing, setIsVoiceProcessing] = useState(false)
    const [voiceSessionId] = useState(() => `voice_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
    const [selectedVoiceFromPanel, setSelectedVoiceFromPanel] = useState('alloy')

    // NEW: Voice selection state (from original voice chat popup)
    const [selectedVoice, setSelectedVoice] = useState<VoiceOption | null>(null)
    const [availableVoices, setAvailableVoices] = useState<VoiceOption[]>([])
    const selectedVoiceRef = useRef<VoiceOption | null>(null)

    // Initialize with default voice to prevent undefined errors
    useEffect(() => {
        if (!selectedVoice && availableVoices.length > 0) {
            setSelectedVoice(availableVoices[0])
            selectedVoiceRef.current = availableVoices[0]
        }
    }, [availableVoices, selectedVoice])

    // Image search
    const [isImageSearchOpen, setIsImageSearchOpen] = useState(false)

    // Update input when transcript changes
    useEffect(() => {
        if (transcript) {
            setInput(transcript)
            // Don't clear transcript immediately - let handleSendMessage use it
        }
    }, [transcript])

    // NEW: Auto-send voice message when transcript is ready (from original voice chat popup)
    // DISABLED: Old voice chat system - now using new simplified system
    // useEffect(() => {
    //     if (transcript && isVoiceMode && !isVoiceProcessing) {
    //         // Auto-send after a short delay to allow user to review
    //         const timer = setTimeout(() => {
    //             if (transcript.trim()) {
    //                 console.log('🎤 Auto-sending voice message:', transcript)
    //                 handleVoiceMessage(transcript)
    //                 clearTranscript()
    //             }
    //         }, 1500) // 1.5 second delay

    //         return () => clearTimeout(timer)
    //     }
    // }, [transcript, isVoiceMode, isVoiceProcessing])

    // NEW: Debug voice messages changes
    useEffect(() => {
        console.log('🎤 Voice messages changed:', voiceMessages.length, 'messages')
        console.log('🎤 Voice mode state:', isVoiceMode)
        console.log('🎤 Voice processing state:', isVoiceProcessing)
    }, [voiceMessages, isVoiceMode, isVoiceProcessing])

    // NEW: Load available voices (from original voice chat popup)
    useEffect(() => {
        const loadVoices = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/voice-synthesis`)
                if (response.ok) {
                    const data = await response.json()
                    // Extract voices array from the response object
                    const voices = data.voices || data
                    // Ensure voices is an array
                    if (Array.isArray(voices)) {
                        setAvailableVoices(voices)
                        // Set default voice
                        if (voices.length > 0) {
                            setSelectedVoice(voices[0])
                            selectedVoiceRef.current = voices[0]
                        }
                    } else {
                        console.warn('Voices API did not return an array:', data)
                        throw new Error('Invalid voices format')
                    }
                } else {
                    throw new Error(`Voices API error: ${response.status}`)
                }
            } catch (error) {
                console.error('Failed to load voices:', error)
                // Set default voices if API fails
                const defaultVoices = [
                    { id: 'alloy', name: 'Alloy', description: 'Balanced and versatile voice' },
                    { id: 'echo', name: 'Echo', description: 'Clear and professional voice' },
                    { id: 'fable', name: 'Fable', description: 'Warm and engaging voice' },
                    { id: 'onyx', name: 'Onyx', description: 'Deep and authoritative voice' },
                    { id: 'nova', name: 'Nova', description: 'Bright and energetic voice' },
                    { id: 'shimmer', name: 'Shimmer', description: 'Smooth and melodic voice' }
                ]
                setAvailableVoices(defaultVoices)
                setSelectedVoice(defaultVoices[0])
                selectedVoiceRef.current = defaultVoices[0]
            }
        }

        loadVoices()
    }, [])

    // NEW: Handle voice chat mode switching
    const toggleVoiceMode = () => {
        if (isVoiceMode) {
            // Switching back to text mode
            setIsVoiceMode(false)
            // Keep the conversation history
        } else {
            // Switching to voice mode
            setIsVoiceMode(true)
            // Initialize voice messages with existing conversation
            setVoiceMessages([...messages])
        }
    }

    // Handle voice message
    const handleVoiceMessage = async (message: string) => {
        if (!message.trim()) return

        setIsVoiceProcessing(true)

        try {
            // Add user message to voice messages
            const userMessage: Message = {
                id: (Date.now()).toString(),
                content: message.trim(),
                role: 'user',
                timestamp: new Date()
            }
            setVoiceMessages(prev => [...prev, userMessage])

            // Use the new backend proxy system instead of old realtime-voice endpoint
            const sessionId = voiceSessionId || 'chat-session-' + Date.now()
            const response = await fetch(`/api/realtime-webrtc/${sessionId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    clientSecret: 'chat-secret',
                    voice: selectedVoiceFromPanel,
                    instructions: 'You are a knowledgeable stamp collecting expert. Answer questions about stamps, their history, and collecting. Keep responses concise and helpful.'
                }),
            })

            if (!response.ok) {
                throw new Error(`Realtime voice API error: ${response.status}`)
            }

            const data = await response.json()

            if (data.success) {
                // Backend proxy created session successfully
                // For now, we'll use a simulated response since the backend proxy doesn't handle text chat yet
                const simulatedResponse = "I'm your stamp collecting expert! I can help you with questions about stamps, their history, and collecting tips. What would you like to know?"

                // Add AI response to voice messages
                const assistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    content: simulatedResponse,
                    role: 'assistant',
                    timestamp: new Date()
                }
                setVoiceMessages(prev => [...prev, assistantMessage])
                console.log('🎤 AI response added to voice messages:', simulatedResponse)

                // Synthesize and play the AI response
                await speakResponse(simulatedResponse)
            } else {
                throw new Error(data.error || 'Invalid response format')
            }

            setIsVoiceProcessing(false)

        } catch (error) {
            console.error('❌ Voice message handling failed:', error)

            // Add error message
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: 'Sorry, I encountered an error processing your voice message. Please try again.',
                role: 'assistant',
                timestamp: new Date()
            }
            setVoiceMessages(prev => [...prev, errorMessage])
            setIsVoiceProcessing(false)
        }
    }

    // NEW: Handle voice input submission
    const handleVoiceInput = () => {
        if (transcript.trim()) {
            handleVoiceMessage(transcript)
            clearTranscript()
        }
    }

    // NEW: Speech synthesis function (from original voice chat popup)
    const speakResponse = async (text: string) => {
        console.log('🎤 speakResponse called with text:', text.substring(0, 50) + '...')

        try {
            // Use the voice selected in the voice chat panel
            const voiceToUse = selectedVoiceFromPanel
            console.log('🎤 Using voice from panel:', voiceToUse, 'for text:', text.substring(0, 30) + '...')

            const response = await fetch(`${BACKEND_URL}/api/voice-synthesis`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    voice: voiceToUse
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to synthesize speech')
            }

            // Get audio blob
            const audioBlob = await response.blob()
            const audioUrl = URL.createObjectURL(audioBlob)

            // Create audio element and play
            const audio = new Audio(audioUrl)

            audio.onended = () => {
                console.log('🎤 OpenAI speech ended')
                URL.revokeObjectURL(audioUrl) // Clean up
            }

            audio.onerror = (error) => {
                console.error('🎤 OpenAI speech error:', error)
                URL.revokeObjectURL(audioUrl) // Clean up
            }

            console.log('🎤 Playing OpenAI voice synthesis...')
            await audio.play()

        } catch (error) {
            console.error('🎤 Voice synthesis error:', error)
        }
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Cleanup effect to handle component unmounting
    useEffect(() => {
        return () => {
            // Clean up any ongoing requests when component unmounts
            if (abortController) {
                abortController.abort()
            }
        }
    }, [abortController])

    // Handle starting a new chat session
    const handleNewChat = () => {
        // Clear all messages
        setMessages([])
        setVoiceMessages([])

        // Clear input
        setInput('')

        // Reset loading states
        console.log('🔄 Setting loading state to false (new chat)')
        setIsLoading(false)
        setIsVoiceProcessing(false)
        setStreamingStatus('')

        // Cancel any ongoing requests
        if (abortController) {
            abortController.abort()
            setAbortController(null)
        }

        // Reset voice mode streaming states
        setIsStreamingAI(false)
        setCurrentStreamingId(null)
        isStreamingAIRef.current = false
        currentStreamingIdRef.current = null
        pendingAIMessage.current = null

        console.log('🔄 New chat session started')
    }

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return

        // Prevent rapid successive clicks
        if (isLoading) {
            console.log('🚫 Request already in progress, ignoring click')
            return
        }

        console.log('🚀 handleSendMessage called with input:', input.trim())

        const userMessage: Message = {
            id: Date.now().toString(),
            content: input.trim(),
            role: 'user',
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        console.log('🔄 Setting loading state to true')
        setIsLoading(true)
        setLoadingStage('searching')

        // Clear transcript after setting the message
        if (transcript) {
            clearTranscript()
        }

        try {
            // Create abort controller for this request
            const controller = new AbortController()
            setAbortController(controller)

            // Progress through loading stages
            const progressStages = () => {
                // Determine if this is a stamp-specific query
                const isStampQuery = userMessage.content.toLowerCase().includes('stamp') ||
                    userMessage.content.toLowerCase().includes('1d') ||
                    userMessage.content.toLowerCase().includes('bright') ||
                    userMessage.content.toLowerCase().includes('orange') ||
                    userMessage.content.toLowerCase().includes('vermillion')

                if (isStampQuery) {
                    // Stamp-specific loading sequence
                    setTimeout(() => setLoadingStage('analyzing'), 1500)
                    setTimeout(() => setLoadingStage('processing'), 3000)
                    setTimeout(() => setLoadingStage('compiling'), 5000)
                    setTimeout(() => setLoadingStage('finalizing'), 7000)
                } else {
                    // General query loading sequence
                    setTimeout(() => setLoadingStage('analyzing'), 2000)
                    setTimeout(() => setLoadingStage('processing'), 4000)
                    setTimeout(() => setLoadingStage('compiling'), 6000)
                    setTimeout(() => setLoadingStage('finalizing'), 8000)
                }
            }

            progressStages()

            // Check if this message came from voice input
            const isFromVoice = transcript && userMessage.content.toLowerCase().trim() === transcript.toLowerCase().trim()
            console.log('🎤 Voice chat detection:', {
                transcript,
                userMessageContent: userMessage.content,
                isFromVoice
            })

            // Quick health check before making the main request
            try {
                const healthCheckEndpoint = USE_RESPONSES_API ?
                    `${BACKEND_URL}/api/philaguide-v2/test` :
                    `${BACKEND_URL}/api/philaguide`

                const healthCheck = await fetch(healthCheckEndpoint, {
                    method: 'GET',
                    signal: AbortSignal.timeout(5000) // 5 second timeout for health check
                })
                if (!healthCheck.ok) {
                    throw new Error('Backend health check failed')
                }
                console.log('✅ Backend health check passed')
            } catch (healthError) {
                console.warn('⚠️ Backend health check failed, proceeding anyway:', healthError)
            }

            // Add a small delay to prevent rapid successive requests
            await new Promise(resolve => setTimeout(resolve, 100))

            // Choose API endpoint based on configuration
            const apiEndpoint = USE_RESPONSES_API ?
                `${BACKEND_URL}/api/philaguide-v2/working` :
                `${BACKEND_URL}/api/philaguide`

            console.log('🌐 Making API request to:', apiEndpoint)
            console.log('📤 Request payload:', {
                message: userMessage.content,
                sessionId: sessionId,
                isVoiceChat: isFromVoice
            })

            // Make the API request (no retry mechanism)
            let response: Response

            if (USE_RESPONSES_API) {
                // New Responses API call
                response = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: userMessage.content,
                        sessionId: sessionId,
                        isVoiceChat: isFromVoice
                    }),
                    signal: AbortSignal.any([controller.signal, AbortSignal.timeout(25000)]) // 25 second timeout
                })
            } else {
                // Old Assistants API call
                response = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: userMessage.content,
                        stream: true,
                        voiceChat: isFromVoice,
                        sessionId: sessionId
                    }),
                    signal: AbortSignal.any([controller.signal, AbortSignal.timeout(30000)]) // 30 second timeout
                })
            }

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} ${response.statusText}`)
            }

            let accumulatedContent = ''
            let structuredData: any = null
            let foundStamps: number = 0
            let assistantMessageId: string | null = null
            let stampPreview: any = null

            if (USE_RESPONSES_API) {
                // Handle new Responses API (JSON response)
                const jsonResponse = await response.json()

                console.log('🚀 Responses API - Raw response received:', jsonResponse)

                if (jsonResponse.success) {
                    // Create assistant message immediately
                    assistantMessageId = Date.now().toString()

                    console.log('🔍 Responses API - About to parse content:', jsonResponse.content.substring(0, 300) + '...')

                    // Parse the structured stamp data from the response
                    const parsedStamps = parseStructuredStampData(jsonResponse.content)
                    console.log('🎯 Responses API - Parsing results:', parsedStamps)

                    // Create new message with parsed stamp data
                    const newMessage: Message = {
                        id: `msg-${Date.now()}`,
                        role: 'assistant',
                        content: parsedStamps.length > 0 ? '' : jsonResponse.content, // Only store content if no stamps found
                        timestamp: new Date(),
                        structuredData: parsedStamps.length > 0 ? parsedStamps[0] : undefined,
                        allStamps: parsedStamps.length > 0 ? parsedStamps : undefined,
                        source: 'knowledge_base'
                    }

                    console.log('📝 Responses API - Creating new message:', newMessage)

                    setMessages(prev => {
                        console.log('🔄 Responses API - Previous messages count:', prev.length)
                        const updatedMessages = [...prev, newMessage]
                        console.log('🔄 Responses API - Updated messages count:', updatedMessages.length)
                        console.log('🔄 Responses API - Last message:', updatedMessages[updatedMessages.length - 1])
                        return updatedMessages
                    })

                    accumulatedContent = jsonResponse.content
                    console.log('✅ Responses API response received:', jsonResponse.content.substring(0, 100) + '...')
                    if (parsedStamps.length > 0) {
                        console.log('🎯 Found structured stamp data:', parsedStamps.length, 'stamps')
                    }

                    // Immediately hide loading state for Responses API
                    setIsLoading(false)
                    setStreamingStatus('')
                    console.log('✅ Responses API loading state cleared')
                } else {
                    throw new Error(jsonResponse.error || 'API request failed')
                }
            } else {
                // Handle old Assistants API (streaming response)
                const reader = response.body?.getReader()
                if (!reader) {
                    throw new Error('No response body')
                }

                while (true) {
                    const { done, value } = await reader.read()
                    if (done) break

                    const chunk = new TextDecoder().decode(value)
                    const lines = chunk.split('\n')

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.slice(6))

                                if (data.type === 'status') {
                                    // Update status for loading indicator
                                    if (data.status === 'fallback') {
                                        setStreamingStatus(data.message || 'Searching internet...')
                                        console.log('�� Fallback status:', data.message)
                                    } else if (data.status === 'processing') {
                                        // Handle custom processing messages
                                        setStreamingStatus(data.message || 'Processing...')
                                        console.log('🔄 Processing status:', data.message)
                                    } else {
                                        setStreamingStatus(data.status === 'queued' ? 'Initializing...' :
                                            data.status === 'in_progress' ? 'Processing...' : '')
                                    }
                                    console.log('Status:', data.status)
                                } else if (data.type === 'content') {
                                    // Create assistant message on first content
                                    if (!assistantMessageId) {
                                        assistantMessageId = (Date.now() + 1).toString()
                                        const assistantMessage: Message = {
                                            id: assistantMessageId,
                                            content: '',
                                            role: 'assistant',
                                            timestamp: new Date(),
                                            source: data.source || 'knowledge_base', // Include source information
                                            sources: data.sources || [] // Include actual source URLs/names
                                        }
                                        setMessages(prev => [...prev, assistantMessage])
                                    }

                                    // Accumulate content
                                    accumulatedContent += data.content

                                    // Update the message in real-time
                                    setMessages(prev => prev.map(msg =>
                                        msg.id === assistantMessageId
                                            ? { ...msg, content: accumulatedContent }
                                            : msg
                                    ))
                                } else if (data.type === 'stamp_preview') {
                                    // Handle stamp preview data
                                    stampPreview = data.data
                                    console.log('📋 Received stamp preview:', stampPreview)

                                    // Create assistant message if not exists
                                    if (!assistantMessageId) {
                                        assistantMessageId = (Date.now() + 1).toString()
                                        const assistantMessage: Message = {
                                            id: assistantMessageId,
                                            content: 'I found some stamps for you. Loading details...',
                                            role: 'assistant',
                                            timestamp: new Date(),
                                            stampPreview: stampPreview
                                        }
                                        setMessages(prev => [...prev, assistantMessage])
                                    } else {
                                        // Update existing message with preview
                                        setMessages(prev => prev.map(msg =>
                                            msg.id === assistantMessageId
                                                ? { ...msg, stampPreview: stampPreview }
                                                : msg
                                        ))
                                    }
                                } else if (data.type === 'structured_data') {
                                    // Handle structured data from function calls
                                    structuredData = data.data
                                    console.log('📊 Received structured data:', structuredData)

                                    // Update the message to remove "Loading details..." and show the actual content
                                    if (assistantMessageId) {
                                        console.log('🔄 Updating message with structured data:', structuredData)
                                        setMessages(prev => prev.map(msg =>
                                            msg.id === assistantMessageId
                                                ? {
                                                    ...msg,
                                                    content: accumulatedContent || msg.content.replace('Loading details...', ''),
                                                    structuredData: structuredData
                                                }
                                                : msg
                                        ))
                                    }
                                } else if (data.type === 'complete') {
                                    // Streaming complete - update message with sources if available
                                    console.log('✅ Streaming complete - updating message')
                                    if (assistantMessageId && data.sources) {
                                        setMessages(prev => prev.map(msg =>
                                            msg.id === assistantMessageId
                                                ? { ...msg, sources: data.sources }
                                                : msg
                                        ))
                                        console.log(`✅ Sources updated: ${data.sources.join(', ')}`)
                                    }

                                    // Handle completion based on content availability
                                    if (assistantMessageId && accumulatedContent.length > 0) {
                                        // We have actual content - hide loading and show response
                                        setIsLoading(false)
                                        setStreamingStatus('')
                                        console.log('✅ Hiding loading state - content received')
                                    } else if (data.content && data.content.trim().length > 0) {
                                        // Complete message has content - use it
                                        setMessages(prev => prev.map(msg =>
                                            msg.id === assistantMessageId
                                                ? { ...msg, content: data.content }
                                                : msg
                                        ))
                                        setIsLoading(false)
                                        setStreamingStatus('')
                                        console.log('✅ Using complete message content')
                                    } else {
                                        // No content available - keep progress visible until content appears
                                        console.log('⚠️ No content available - keeping progress visible')
                                        setStreamingStatus('⏳ Waiting for AI response...')
                                    }
                                } else if (data.type === 'keep-alive') {
                                    // Keep-alive signal received, connection is still active
                                    console.log('💓 Keep-alive signal received')
                                } else if (data.type === 'error') {
                                    throw new Error(data.error)
                                } else if (data.type === 'warning') {
                                    // Show warning message as a toast notification
                                    console.log('⚠️ Warning received:', data.message)
                                    toast({
                                        title: "⚠️ Processing Warning",
                                        description: data.message,
                                        variant: "destructive",
                                    })
                                } else if (data.type === 'source_info') {
                                    // Handle source information update
                                    if (assistantMessageId) {
                                        setMessages(prev => prev.map(msg =>
                                            msg.id === assistantMessageId
                                                ? { ...msg, source: data.source }
                                                : msg
                                        ))
                                        console.log(`✅ Source updated to: ${data.source}`)
                                    }
                                } else if (data.type === 'complete_response') {
                                    // Handle complete response with source information
                                    if (!assistantMessageId) {
                                        assistantMessageId = (Date.now() + 1).toString()
                                        const assistantMessage: Message = {
                                            id: assistantMessageId,
                                            content: data.content,
                                            role: 'assistant',
                                            timestamp: new Date(),
                                            source: data.source || 'knowledge_base',
                                            sources: data.sources || []
                                        }
                                        setMessages(prev => [...prev, assistantMessage])
                                    } else {
                                        setMessages(prev => prev.map(msg =>
                                            msg.id === assistantMessageId
                                                ? {
                                                    ...msg,
                                                    content: data.content,
                                                    source: data.source || 'knowledge_base',
                                                    sources: data.sources || []
                                                }
                                                : msg
                                        ))
                                    }
                                } else if (data.type === 'timeout') {
                                    if (!assistantMessageId) {
                                        assistantMessageId = (Date.now() + 1).toString()
                                        const assistantMessage: Message = {
                                            id: assistantMessageId,
                                            content: data.message,
                                            role: 'assistant',
                                            timestamp: new Date()
                                        }
                                        setMessages(prev => [...prev, assistantMessage])
                                    } else {
                                        setMessages(prev => prev.map(msg =>
                                            msg.id === assistantMessageId
                                                ? { ...msg, content: data.message }
                                                : msg
                                        ))
                                    }
                                }
                            } catch (parseError) {
                                console.error('Error parsing stream data:', parseError)
                            }
                        }
                    }
                }

                // Final update for old Assistants API with any structured data
                if (assistantMessageId) {
                    setMessages(prev => prev.map(msg =>
                        msg.id === assistantMessageId
                            ? {
                                ...msg,
                                content: accumulatedContent || msg.content,
                                structuredData,
                                foundStamps
                            }
                            : msg
                    ))

                    // Only hide loading if we actually have content to show
                    if (accumulatedContent.length > 0 || (structuredData && Object.keys(structuredData).length > 0)) {
                        setIsLoading(false)
                        setStreamingStatus('')
                        console.log('✅ Final content received - hiding loading state')
                    } else {
                        // Keep progress visible if no content yet
                        setStreamingStatus('⏳ Finalizing response...')
                        console.log('⚠️ No final content - keeping progress visible')
                    }
                }
            }

            // Final completion for both APIs
            setIsLoading(false)
            setStreamingStatus('')
            console.log(`✅ Message processing complete with ${USE_RESPONSES_API ? 'Responses' : 'Assistants'} API`)

        } catch (error) {
            console.error('Error sending message:', error)

            // Check if the request was aborted
            if (error instanceof Error && error.name === 'AbortError') {
                console.log('🛑 Request was aborted by user')
                // Don't add error message for aborted requests
            } else if (error instanceof Error && error.message.includes('timeout')) {
                console.log('⏰ Request timed out')
                const errorMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    content: 'The request took too long to process. This might happen if the chat has been idle for a while. Please try again with a fresh query.',
                    role: 'assistant',
                    timestamp: new Date()
                }
                setMessages(prev => [...prev, errorMessage])
            } else if (error instanceof Error && error.message.includes('fetch')) {
                console.log('🌐 Network connection error')
                const errorMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    content: 'Connection error. Please check your internet connection and try again.',
                    role: 'assistant',
                    timestamp: new Date()
                }
                setMessages(prev => [...prev, errorMessage])
            } else {
                // Check if this might be an idle connection issue
                const isIdleError = error instanceof Error && (
                    error.message.includes('Failed to fetch') ||
                    error.message.includes('NetworkError') ||
                    error.message.includes('connection') ||
                    error.message.includes('aborted')
                )

                const errorMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    content: isIdleError
                        ? 'The connection was interrupted, possibly due to inactivity. Please try your request again.'
                        : 'I apologize, but I encountered an error while processing your request. Please try again.',
                    role: 'assistant',
                    timestamp: new Date()
                }
                setMessages(prev => [...prev, errorMessage])
            }
        } finally {
            setIsLoading(false)
            setStreamingStatus('')
            setLoadingStage('searching')
            setAbortController(null) // Clear the abort controller
        }
    }

    const handleStopGeneration = () => {
        console.log('🛑 Stopping generation...')
        if (abortController) {
            abortController.abort()
            setAbortController(null)
        }
        setIsLoading(false)
        setStreamingStatus('')
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
        if (e.key === 'Escape' && isLoading) {
            e.preventDefault()
            handleStopGeneration()
        }
    }

    const handleVoiceChatMessage = async (message: string): Promise<string> => {
        console.log('🎤 handleVoiceChatMessage called with:', message)
        try {
            const voiceApiEndpoint = USE_RESPONSES_API ?
                `${BACKEND_URL}/api/philaguide-v2/working` :
                `${BACKEND_URL}/api/philaguide`

            console.log('🎤 Making API request to:', voiceApiEndpoint)
            const response = await fetch(voiceApiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message,
                    sessionId: 'voice-chat-' + Date.now(),
                    isVoiceChat: true
                }),
            })
            console.log('🎤 API response status:', response.status)

            let accumulatedContent = ''

            if (USE_RESPONSES_API) {
                // Handle new Responses API (JSON response)
                const jsonResponse = await response.json()

                if (jsonResponse.success) {
                    accumulatedContent = jsonResponse.content
                    console.log('🎤 Responses API voice response received:', jsonResponse.content.substring(0, 100) + '...')
                } else {
                    throw new Error(jsonResponse.error || 'Voice API request failed')
                }
            } else {
                // Handle old Assistants API (streaming response)
                const reader = response.body?.getReader()
                if (!reader) {
                    throw new Error('No response body')
                }

                while (true) {
                    const { done, value } = await reader.read()
                    if (done) break

                    const chunk = new TextDecoder().decode(value)
                    const lines = chunk.split('\n')

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.slice(6))

                                if (data.type === 'content') {
                                    // Accumulate content for voice response
                                    accumulatedContent += data.content
                                } else if (data.type === 'complete_response') {
                                    // Handle complete response with source information
                                    accumulatedContent = data.content
                                    console.log('🎤 Complete response received with source:', data.source)
                                } else if (data.type === 'error') {
                                    throw new Error(data.error)
                                } else if (data.type === 'timeout') {
                                    return 'I apologize, but the request is taking too long. Please try a more specific query about stamps.'
                                }
                            } catch (parseError) {
                                console.error('Error parsing voice stream data:', parseError)
                            }
                        }
                    }
                }
            }

            // For voice chat, use the accumulated content directly since the assistant generates conversational responses
            const voiceResponse = accumulatedContent || "I couldn't generate a response for that query."

            console.log('🎤 Voice response length:', voiceResponse.length)
            console.log('🎤 Voice response preview:', voiceResponse.substring(0, 100) + '...')
            return voiceResponse
        } catch (error) {
            console.error('Error sending voice message:', error)
            return 'Sorry, I encountered an error. Please try again.'
        }
    }

    return (
        <>
            {/* Chat button is now in HeaderActions */}
            <div
                className={cn(
                    "fixed right-0 top-0 h-full w-full max-w-sm flex flex-col z-50 border-l border-border bg-background shadow-xl transition-all duration-300 ease-in-out animate-in slide-in-from-right duration-300 delay-100",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
                data-state={isOpen ? "open" : "closed"}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/95 backdrop-blur-sm shadow-sm transition-all duration-200 animate-in slide-in-from-top duration-300 delay-150">
                    <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="w-9 h-9 flex-shrink-0 border-2 border-primary/20">
                            <AvatarImage src="/images/stamp-bot-avatar.png" alt="PhilaGuide AI" />
                            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">PG</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <h3 className="font-semibold text-base text-foreground truncate">PhilaGuide AI</h3>
                        </div>
                    </div>

                    {/* Header Actions */}
                    <div className="flex items-center gap-2">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-all duration-200 hover:scale-105 animate-in slide-in-from-top duration-300 delay-200"
                                    title="Start new chat session"
                                >
                                    <MessageSquarePlus className="w-4 h-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Start New Chat?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will clear your current conversation history. Are you sure you want to start a new chat session?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleNewChat}>
                                        Start New Chat
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsOpen(false)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-all duration-200 hover:scale-105 animate-in slide-in-from-top duration-300 delay-250"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-6 bg-background animate-in fade-in duration-300 delay-200">
                    <div className="space-y-6">
                        {/* NEW: Welcome message based on mode */}
                        {(isVoiceMode ? voiceMessages : messages).length === 0 && (
                            <div className="text-center py-8 px-4">
                                <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center animate-pulse-slow">
                                    {isVoiceMode ? (
                                        <AudioLines className="w-10 h-10 text-primary" />
                                    ) : (
                                        <MessageSquare className="w-10 h-10 text-primary" />
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-3">
                                    {isVoiceMode ? 'Voice Chat Mode' : 'Welcome to PhilaGuide AI!'}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                                    {isVoiceMode
                                        ? 'Speak naturally to ask about stamps, values, history, or collecting tips. Click the microphone to start speaking.'
                                        : 'I\'m your specialized stamp collecting assistant. Ask me about stamps, values, history, or collecting tips, or use the image search feature.'
                                    }
                                </p>

                                {!isVoiceMode && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <button
                                            onClick={() => setInput("Tell me about the Penny Black stamp")}
                                            className="text-left p-4 bg-background hover:bg-accent rounded-xl border border-input text-sm transition-colors w-full shadow-sm flex flex-col items-start"
                                        >
                                            <div className="font-semibold text-foreground mb-1">Tell me about the Penny Black stamp</div>
                                            <div className="text-xs text-muted-foreground">World's first postage stamp.</div>
                                        </button>
                                        <button
                                            onClick={() => setInput("Show me rare stamps from New Zealand")}
                                            className="text-left p-4 bg-background hover:bg-accent rounded-xl border border-input text-sm transition-colors w-full shadow-sm flex flex-col items-start"
                                        >
                                            <div className="font-semibold text-foreground mb-1">Show me rare stamps from New Zealand</div>
                                            <div className="text-xs text-muted-foreground">Discover valuable New Zealand issues.</div>
                                        </button>
                                        <button
                                            onClick={() => setInput("Give me collecting tips for beginners")}
                                            className="text-left p-4 bg-background hover:bg-accent rounded-xl border border-input text-sm transition-colors w-full shadow-sm flex flex-col items-start"
                                        >
                                            <div className="font-semibold text-foreground mb-1">Give me collecting tips for beginners</div>
                                            <div className="text-xs text-muted-foreground">Start your philatelic journey.</div>
                                        </button>
                                        <button
                                            onClick={() => setIsImageSearchOpen(true)}
                                            className="text-left p-4 bg-background hover:bg-accent rounded-xl border border-input text-sm transition-colors w-full shadow-sm flex flex-col items-start"
                                        >
                                            <div className="font-semibold text-foreground mb-1">Identify a stamp from an image</div>
                                            <div className="text-xs text-muted-foreground">Upload a photo of your stamp.</div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* NEW: Show messages based on current mode */}
                        {(isVoiceMode ? voiceMessages : messages).map((message) => (
                            <div key={message.id} className={cn(
                                "flex gap-4 animate-in slide-in-from-bottom duration-300",
                                message.role === 'user' ? "justify-end" : "justify-start"
                            )}>
                                {message.role === 'assistant' && (
                                    <Avatar className="w-9 h-9 flex-shrink-0 border-2 border-primary/20">
                                        <AvatarImage src="/images/stamp-bot-avatar.png" alt="PhilaGuide AI" />
                                        <AvatarFallback className="bg-primary/10 text-primary text-sm">PG</AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={cn(
                                    "max-w-[85%] space-y-2",
                                    message.role === 'user' ? "order-1" : "order-2"
                                )}>
                                    {/* Hide message bubble when stamp cards are available */}
                                    {(!message.allStamps || message.allStamps.length === 0) &&
                                        (!message.structuredData || message.structuredData.type !== 'card') && (
                                            <div className={cn(
                                                "px-4 py-3 text-sm break-words",
                                                message.role === 'user'
                                                    ? "bg-primary text-primary-foreground dark:text-black rounded-2xl rounded-bl-md ml-auto"
                                                    : "bg-muted text-foreground rounded-2xl rounded-tl-md mr-auto"
                                            )}>
                                                {message.role === 'assistant' ? (
                                                    <MarkdownMessage content={message.content} />
                                                ) : (
                                                    message.content
                                                )}

                                                {/* Timestamp */}
                                                {message.role === 'assistant' && (
                                                    <div className={cn(
                                                        "text-xs mt-2 opacity-70",
                                                        "text-muted-foreground"
                                                    )}>
                                                        {message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : 'Unknown time'}
                                                    </div>
                                                )}

                                                {/* Source Information */}
                                                {message.role === 'assistant' && message.source && (
                                                    <div className="text-xs mt-1 opacity-60">
                                                        {message.source === 'knowledge_base' ? (
                                                            <span className="text-green-600 dark:text-green-400">
                                                                📚 Knowledge Base
                                                            </span>
                                                        ) : message.source === 'internet' ? (
                                                            <div>
                                                                <span className="text-blue-600 dark:text-blue-400">
                                                                    🌐 Internet Source
                                                                </span>
                                                                {message.sources && message.sources.length > 0 && (
                                                                    <div className="mt-1 text-xs">
                                                                        {message.sources.map((source, index) => (
                                                                            <div key={index} className="text-blue-500 dark:text-blue-300 break-all">
                                                                                {source}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : message.source === 'partial_response' ? (
                                                            <span className="text-orange-600 dark:text-orange-400">
                                                                ⚠️ Partial Response
                                                            </span>
                                                        ) : message.source === 'processing_timeout' ? (
                                                            <span className="text-red-600 dark:text-red-400">
                                                                ⏰ Processing Timeout
                                                            </span>
                                                        ) : message.source === 'fallback' ? (
                                                            <span className="text-yellow-600 dark:text-yellow-400">
                                                                🔄 Fallback Response
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                    {/* Stamp Preview Display - Only show when no structured data is available */}
                                    {message.stampPreview && !message.structuredData && (
                                        <div className="mt-2 max-w-full">
                                            <StampPreviewDisplay preview={message.stampPreview} />
                                        </div>
                                    )}

                                    {/* Structured Data Display */}
                                    {message.structuredData && !message.allStamps && (
                                        <div className="mt-2 max-w-full">
                                            {(() => {
                                                console.log('🎴 Frontend received structured data:', message.structuredData)
                                                return null
                                            })()}

                                            {message.structuredData.type === 'card' && (
                                                <StampCardDisplay data={message.structuredData} />
                                            )}
                                            {message.structuredData.type === 'carousel' && (
                                                <StampCarouselDisplay data={message.structuredData} />
                                            )}
                                        </div>
                                    )}

                                    {/* Multi-Stamp Display for Responses API - Priority over structuredData */}
                                    {message.allStamps && message.allStamps.length > 0 && (
                                        <div className="mt-2 max-w-full">
                                            {(() => {
                                                console.log('🎴 Frontend received allStamps:', message.allStamps)
                                                console.log('🎴 Frontend - Message object:', message)
                                                console.log('🎴 Frontend - allStamps type:', typeof message.allStamps)
                                                console.log('🎴 Frontend - allStamps length:', message.allStamps?.length)
                                                return null
                                            })()}

                                            <MultiStampDisplay stamps={message.allStamps} />
                                        </div>
                                    )}

                                    {/* Debug: Show message structure */}
                                    {(() => {
                                        console.log('🔍 Rendering message:', {
                                            id: message.id,
                                            hasStructuredData: !!message.structuredData,
                                            hasAllStamps: !!message.allStamps,
                                            allStampsLength: message.allStamps?.length,
                                            messageKeys: Object.keys(message)
                                        })
                                        return null
                                    })()}
                                </div>
                            </div>
                        ))}

                        {/* NEW: Show loading state based on current mode */}
                        {(isVoiceMode ? isVoiceProcessing : isLoading) && (
                            <div className="flex gap-4 justify-start animate-in slide-in-from-bottom duration-300">
                                <Avatar className="w-9 h-9 flex-shrink-0 border-2 border-primary/20">
                                    <AvatarImage src="/images/stamp-bot-avatar.png" alt="PhilaGuide AI" />
                                    <AvatarFallback className="bg-primary/10 text-primary text-sm">PG</AvatarFallback>
                                </Avatar>
                                <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]">
                                    <div className="flex flex-col gap-2">
                                        {/* Interactive Loading Messages */}
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                            <span className="text-sm text-muted-foreground animate-in slide-in-from-left duration-300">
                                                {(() => {
                                                    const stageMessages = {
                                                        searching: "🔍 Searching the stamp database...",
                                                        analyzing: "📚 Analyzing philatelic information...",
                                                        processing: "🎴 Processing stamp details...",
                                                        compiling: "📖 Compiling comprehensive response...",
                                                        finalizing: "✨ Finalizing stamp information..."
                                                    }

                                                    return stageMessages[loadingStage] || "🤔 Thinking..."
                                                })()}
                                            </span>
                                            {/* Typing indicator */}
                                            <span className="text-primary animate-pulse">|</span>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="w-full bg-muted-foreground/20 rounded-full h-1 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-primary to-primary/80 h-1 rounded-full transition-all duration-1000 ease-out relative"
                                                style={{
                                                    width: `${(() => {
                                                        const stageProgress = {
                                                            searching: 20,
                                                            analyzing: 40,
                                                            processing: 60,
                                                            compiling: 80,
                                                            finalizing: 95
                                                        }
                                                        return stageProgress[loadingStage] || 0
                                                    })()}%`
                                                }}
                                            >
                                                {/* Shimmer effect */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                                            </div>
                                        </div>

                                        {/* Additional Context */}
                                        {streamingStatus && (
                                            <div className="text-xs text-muted-foreground mt-1 animate-in fade-in duration-300">
                                                {streamingStatus}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </ScrollArea>

                {/* Input */}
                <div className="p-6 border-t border-border bg-background animate-in slide-in-from-bottom duration-300 delay-250">
                    {isVoiceMode ? (
                        /* NEW: Voice Chat Input Interface */
                        <div className="space-y-4 animate-in slide-in-from-bottom duration-300 delay-300">
                            {/* Voice Input Display */}
                            <div className="bg-background rounded-xl border border-border shadow-md animate-in zoom-in duration-300">
                                <div className="flex items-center justify-between p-4 border-b border-border animate-in slide-in-from-top duration-300 delay-350">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                            <AudioLines className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="text-sm font-medium text-foreground">Voice Chat</span>
                                    </div>
                                </div>

                                {/* VoiceChatPanel Component */}
                                <div className="p-4 animate-in fade-in duration-300 delay-400">
                                    <VoiceChatPanel
                                        onTranscript={handleTranscript}
                                        onClose={() => setIsVoiceMode(false)}
                                        onVoiceChange={setSelectedVoiceFromPanel}
                                        onSpeakResponse={speakResponse}
                                    />
                                </div>
                            </div>

                            {/* Voice Chat Instructions and Text Toggle */}
                            <div className="flex items-center justify-between animate-in slide-in-from-bottom duration-300 delay-500">
                                <div className="text-xs text-muted-foreground">
                                    Speak naturally about stamps, values, history, or collecting tips
                                </div>
                                <Button
                                    onClick={() => setIsVoiceMode(false)}
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-3 text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 rounded-md animate-in slide-in-from-bottom duration-300 delay-400"
                                >
                                    <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                                    Text Chat
                                </Button>
                            </div>
                        </div>
                    ) : (
                        /* Text Chat Input Interface */
                        <div className="space-y-3 animate-in slide-in-from-bottom duration-300 delay-350">
                            <div className="flex gap-3">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={isLoading ? "AI is processing..." : "Ask PhilaGuide AI..."}
                                    disabled={isLoading}
                                    className="flex-1 text-sm bg-background border-border px-4 py-2.5 rounded-full focus-visible:ring-offset-0 focus-visible:ring-primary focus-visible:ring-2 transition-all duration-200 hover:border-primary/50 animate-in slide-in-from-left duration-300 delay-400"
                                />

                                {/* Voice Toggle Button */}
                                <Button
                                    onClick={() => setIsVoiceMode(true)}
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 border border-border hover:border-primary/30 hover:scale-105 animate-in slide-in-from-right duration-300 delay-450"
                                    title="Switch to voice chat"
                                >
                                    <AudioLines className="w-4 h-4" />
                                </Button>

                                <Button
                                    onClick={handleSendMessage}
                                    disabled={isLoading || !input.trim()}
                                    size="icon"
                                    className={cn(
                                        "transition-all duration-200 flex-shrink-0 rounded-full h-10 w-10 hover:scale-105 animate-in slide-in-from-right duration-300 delay-500",
                                        isLoading
                                            ? "bg-orange-500 hover:bg-orange-600 text-white"
                                            : input.trim()
                                                ? "bg-primary hover:bg-primary/90 text-white"
                                                : "bg-muted hover:bg-muted/80 text-muted-foreground border border-border"
                                    )}
                                    title={isLoading ? `Loading... (State: ${isLoading})` : 'Send message'}
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 flex items-center justify-center space-x-0.5">
                                            <div className="w-1 h-1 bg-yellow-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-1 h-1 bg-yellow-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-1 h-1 bg-yellow-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    ) : (
                                        <Send className="w-5 h-5" />
                                    )}
                                </Button>
                            </div>


                        </div>
                    )}
                </div>
            </div>

            {/* Image Search Popup */}
            <ImageSearch
                isOpen={isImageSearchOpen}
                onClose={() => setIsImageSearchOpen(false)}
            />

            {/* Toast Notifications */}
            <Toaster />
        </>
    )
} 