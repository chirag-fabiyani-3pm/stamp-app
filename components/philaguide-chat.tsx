"use client"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BACKEND_URL, FRONTEND_URL } from '@/lib/constants'
import { cn } from '@/lib/utils'
import {
    AudioLines,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    MessageSquare,
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

interface Message {
    id: string
    content: string
    role: 'user' | 'assistant'
    timestamp: Date
    structuredData?: any
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
                    // Fall back to old summary format for backward compatibility
                    <>
                        <div>
                            <h4 className="font-medium text-xs text-foreground mb-1">Overview</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed break-words">{currentItem.summary}</p>
                        </div>
                        <div>
                            <h4 className="font-medium text-xs text-foreground mb-1">Details</h4>
                            <div className="space-y-1">
                                <div className="text-xs text-muted-foreground break-words">• Market Value: {currentItem.marketValue}</div>
                                {currentItem.quickFacts?.map((fact, index) => (
                                    <div key={index} className="text-xs text-muted-foreground break-words">• {fact}</div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* Show significance and special notes if available */}
                {currentItem.significance && (
                    <div>
                        <h4 className="font-medium text-xs text-foreground mb-1">Significance</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed break-words">{currentItem.significance}</p>
                    </div>
                )}

                {currentItem.specialNotes && (
                    <div>
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
                <div className="flex gap-2 pt-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPrevious}
                        disabled={data.items.length <= 1}
                        className="h-8 px-4 text-xs rounded-lg shadow-sm border-input bg-background hover:bg-accent hover:text-accent-foreground"
                    >
                        <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                        Prev
                    </Button>
                    <span className="text-xs text-muted-foreground flex items-center">
                        {currentIndex + 1} of {data.items.length}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={goToNext}
                        disabled={data.items.length <= 1}
                        className="h-8 px-4 text-xs rounded-lg shadow-sm border-input bg-background hover:bg-accent hover:text-accent-foreground"
                    >
                        Next
                        <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export function PhilaGuideChat() {
    const { isOpen, setIsOpen } = useChatContext()
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [streamingStatus, setStreamingStatus] = useState<string>('')
    const [abortController, setAbortController] = useState<AbortController | null>(null)
    const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Voice interaction
    const [isListening, setIsListening] = useState(false)
    const [transcript, setTranscript] = useState('')

    const handleTranscript = (text: string) => {
        setTranscript(text)
        // Auto-send the voice message after getting transcript
        if (text.trim()) {
            handleVoiceMessage(text)
            // Clear transcript after processing
            setTimeout(() => setTranscript(''), 1000)
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
    useEffect(() => {
        if (transcript && isVoiceMode && !isVoiceProcessing) {
            // Auto-send after a short delay to allow user to review
            const timer = setTimeout(() => {
                if (transcript.trim()) {
                    console.log('🎤 Auto-sending voice message:', transcript)
                    handleVoiceMessage(transcript)
                    clearTranscript()
                }
            }, 1500) // 1.5 second delay

            return () => clearTimeout(timer)
        }
    }, [transcript, isVoiceMode, isVoiceProcessing])

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
                    const voices = await response.json()
                    // Ensure voices is an array
                    if (Array.isArray(voices)) {
                        setAvailableVoices(voices)
                        // Set default voice
                        if (voices.length > 0) {
                            setSelectedVoice(voices[0])
                            selectedVoiceRef.current = voices[0]
                        }
                    } else {
                        console.warn('Voices API did not return an array:', voices)
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

            // Use the realtime-voice API endpoint
            const response = await fetch('/api/realtime-voice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message.trim(),
                    conversationHistory: voiceMessages.map(msg => ({
                        role: msg.role,
                        content: msg.content
                    })),
                    sessionId: voiceSessionId
                }),
            })

            if (!response.ok) {
                throw new Error(`Realtime voice API error: ${response.status}`)
            }

            const data = await response.json()

            if (data.success && data.response) {
                // Add AI response to voice messages
                const assistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    content: data.response,
                    role: 'assistant',
                    timestamp: new Date()
                }
                setVoiceMessages(prev => [...prev, assistantMessage])
                console.log('🎤 AI response added to voice messages:', data.response)

                // Synthesize and play the AI response
                await speakResponse(data.response)
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

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            content: input.trim(),
            role: 'user',
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        // Clear transcript after setting the message
        if (transcript) {
            clearTranscript()
        }

        try {
            // Create abort controller for this request
            const controller = new AbortController()
            setAbortController(controller)

            // Check if this message came from voice input
            const isFromVoice = transcript && userMessage.content.toLowerCase().trim() === transcript.toLowerCase().trim()
            console.log('🎤 Voice chat detection:', {
                transcript,
                userMessageContent: userMessage.content,
                isFromVoice
            })

            // Quick health check before making the main request
            try {
                const healthCheck = await fetch(`${BACKEND_URL}/api/philaguide`, {
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

            // Retry mechanism for failed requests
            let response: Response | undefined
            let retryCount = 0
            const maxRetries = 2

            while (retryCount <= maxRetries) {
                try {
                    response = await fetch(`${BACKEND_URL}/api/philaguide`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            message: userMessage.content,
                            stream: true,
                            voiceChat: isFromVoice, // Enable voice chat mode if input came from voice
                            sessionId: sessionId
                        }),
                        signal: AbortSignal.any([controller.signal, AbortSignal.timeout(30000)]) // 30 second timeout
                    })

                    if (response.ok) {
                        break // Success, exit retry loop
                    } else {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
                    }
                } catch (fetchError) {
                    retryCount++
                    console.log(`🔄 Request attempt ${retryCount} failed:`, fetchError)

                    if (retryCount > maxRetries) {
                        throw fetchError // Re-throw if max retries reached
                    }

                    // Wait before retrying (exponential backoff)
                    await new Promise(resolve => setTimeout(resolve, 1000 * retryCount))
                }
            }

            if (!response) {
                throw new Error('Failed to get response after retries')
            }

            const reader = response.body?.getReader()
            if (!reader) {
                throw new Error('No response body')
            }

            let accumulatedContent = ''
            let structuredData: any = null
            let foundStamps: number = 0
            let assistantMessageId: string | null = null
            let stampPreview: any = null

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
                                setStreamingStatus(data.status === 'queued' ? 'Initializing...' :
                                    data.status === 'in_progress' ? 'Processing...' : '')
                                console.log('Status:', data.status)
                            } else if (data.type === 'content') {
                                // Create assistant message on first content
                                if (!assistantMessageId) {
                                    assistantMessageId = (Date.now() + 1).toString()
                                    const assistantMessage: Message = {
                                        id: assistantMessageId,
                                        content: '',
                                        role: 'assistant',
                                        timestamp: new Date()
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
                                // Streaming complete
                                console.log('✅ Streaming complete - resetting loading state')
                                setIsLoading(false)
                                setStreamingStatus('')
                            } else if (data.type === 'keep-alive') {
                                // Keep-alive signal received, connection is still active
                                console.log('💓 Keep-alive signal received')
                            } else if (data.type === 'error') {
                                throw new Error(data.error)
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

            // Final update with any structured data
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
            }

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
            console.log('🎤 Making API request to:', `${BACKEND_URL}/api/philaguide`)
            const response = await fetch(`${BACKEND_URL}/api/philaguide`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message,
                    history: [],
                    stream: true, // Use streaming for voice chat
                    voiceChat: true // Enable voice chat mode
                }),
            })
            console.log('🎤 API response status:', response.status)

            // For streaming voice chat, get the response directly
            const reader = response.body?.getReader()
            if (!reader) {
                throw new Error('No response body')
            }

            let accumulatedContent = ''

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
                    "fixed right-0 top-0 h-full w-full max-w-sm flex flex-col z-50 border-l border-input bg-background/80 backdrop-blur-xl shadow-2xl transition-transform duration-500 ease-in-out",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
                data-state={isOpen ? "open" : "closed"}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-input bg-primary text-primary-foreground shadow-sm">
                    <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="w-11 h-11 flex-shrink-0 border-2 border-primary-foreground/30">
                            <AvatarImage src="/images/stamp-bot-avatar.png" alt="PhilaGuide AI" />
                            <AvatarFallback className="bg-primary-foreground/10 text-primary-foreground text-base dark:text-black">PG</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <h3 className="font-bold text-lg truncate dark:text-black">PhilaGuide AI</h3>
                            <p className="text-xs opacity-90 truncate dark:text-black">Your intelligent stamp assistant</p>
                        </div>
                    </div>

                    {/* NEW: Voice Chat Toggle Button */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleVoiceMode}
                            className={cn(
                                "h-8 px-3 text-xs rounded-md transition-all duration-200",
                                isVoiceMode
                                    ? "bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30"
                                    : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                            )}
                        >
                            <AudioLines className="w-4 h-4 mr-1" />
                            {isVoiceMode ? 'Text' : 'Voice'}
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsOpen(false)}
                            className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800 dark:text-black dark:hover:text-black dark:hover:bg-gray-200"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4 bg-background/70">
                    <div className="space-y-4">
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
                                "flex gap-3",
                                message.role === 'user' ? "justify-end" : "justify-start"
                            )}>
                                {message.role === 'assistant' && (
                                    <Avatar className="w-9 h-9 flex-shrink-0 border border-input">
                                        <AvatarImage src="/images/stamp-bot-avatar.png" alt="PhilaGuide AI" />
                                        <AvatarFallback className="bg-primary/10 text-primary text-sm">PG</AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={cn(
                                    "max-w-[85%] space-y-2",
                                    message.role === 'user' ? "order-1" : "order-2"
                                )}>
                                    <div className={cn(
                                        "px-4 py-2 text-sm break-words shadow-sm",
                                        message.role === 'user'
                                            ? "bg-primary text-primary-foreground dark:text-black rounded-tl-xl rounded-br-xl rounded-tr-sm rounded-bl-sm ml-auto"
                                            : "bg-muted text-foreground rounded-tr-xl rounded-bl-xl rounded-tl-sm rounded-br-sm mr-auto border border-input"
                                    )}>
                                        {message.role === 'assistant' ? (
                                            <MarkdownMessage content={message.content} />
                                        ) : (
                                            message.content
                                        )}

                                        {/* Timestamp */}
                                        <div className={cn(
                                            "text-xs mt-2 opacity-70",
                                            message.role === 'user'
                                                ? "text-primary-foreground/70 dark:text-black/70"
                                                : "text-muted-foreground"
                                        )}>
                                            {message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : 'Unknown time'}
                                        </div>
                                    </div>

                                    {/* Stamp Preview Display - Only show when no structured data is available */}
                                    {message.stampPreview && !message.structuredData && (
                                        <div className="mt-2 max-w-full">
                                            <StampPreviewDisplay preview={message.stampPreview} />
                                        </div>
                                    )}

                                    {/* Structured Data Display */}
                                    {message.structuredData && (
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
                                </div>
                            </div>
                        ))}

                        {/* NEW: Show loading state based on current mode */}
                        {(isVoiceMode ? isVoiceProcessing : isLoading) && (
                            <div className="flex gap-3 justify-start">
                                <Avatar className="w-9 h-9 flex-shrink-0 border border-input">
                                    <AvatarImage src="/images/stamp-bot-avatar.png" alt="PhilaGuide AI" />
                                    <AvatarFallback className="bg-primary/10 text-primary text-sm">PG</AvatarFallback>
                                </Avatar>
                                <div className="bg-muted rounded-tr-xl rounded-bl-xl rounded-tl-sm rounded-br-sm px-4 py-2 shadow-sm border border-input">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                        </div>
                                        {isVoiceMode ? (
                                            <div className="text-xs text-muted-foreground mt-1">
                                                Processing voice message...
                                            </div>
                                        ) : (
                                            streamingStatus && (
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    {streamingStatus}
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </ScrollArea>

                {/* Input */}
                <div className="p-4 border-t border-input bg-card/60">
                    {isVoiceMode ? (
                        /* NEW: Voice Chat Input Interface */
                        <div className="space-y-4">
                            {/* Voice Input Display */}
                            <div className="bg-muted/50 rounded-lg p-4 border border-input">
                                <div className="flex items-center gap-3 mb-3">
                                    <AudioLines className="w-5 h-5 text-primary" />
                                    <span className="text-sm font-medium text-foreground">Voice Input</span>
                                </div>

                                {/* VoiceChatPanel Component */}
                                <VoiceChatPanel
                                    onTranscript={handleTranscript}
                                    onClose={() => setIsVoiceMode(false)}
                                    onVoiceChange={setSelectedVoiceFromPanel}
                                />
                            </div>

                            {/* Voice Chat Instructions */}
                            <div className="text-xs text-muted-foreground text-center">
                                Speak naturally about stamps, values, history, or collecting tips
                            </div>
                        </div>
                    ) : (
                        /* Text Chat Input Interface */
                        <div className="space-y-2">
                            <div className="flex gap-2">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={isLoading ? "AI is processing..." : "Ask PhilaGuide AI..."}
                                    disabled={isLoading}
                                    className="flex-1 text-sm bg-background border-input px-4 py-2.5 rounded-full focus-visible:ring-offset-0 focus-visible:ring-primary"
                                />

                                <Button
                                    onClick={handleSendMessage}
                                    disabled={isLoading || !input.trim()}
                                    size="icon"
                                    className={cn(
                                        "transition-all duration-200 flex-shrink-0 rounded-full",
                                        isLoading ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
                                    )}
                                >
                                    {isLoading ? (
                                        <div className="w-4 h-4 bg-yellow-400 rounded-sm" />
                                    ) : (
                                        <Send className="w-5 h-5" />
                                    )}
                                </Button>
                            </div>

                            {/* Voice Mode Toggle */}
                            <div className="flex justify-center">
                                <Button
                                    onClick={() => setIsVoiceMode(true)}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs"
                                >
                                    🎤 Switch to Voice Chat
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
        </>
    )
} 