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
import { BACKEND_URL } from '@/lib/constants'
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
import { useChatContext } from './chat-provider'
import { ImageSearch } from './image-search'
import { VoiceChatPopup } from './voice-chat-popup'
import { VoiceInteraction, useVoiceToText } from './voice-interaction'

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
                        onClick={() => window.open(`https://stamp-app-sand.vercel.app/catalog-2/${data.id}`, '_blank')}
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
                <div>
                    <h4 className="font-medium text-xs text-foreground mb-1">Summary</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed break-words">{currentItem.summary}</p>
                </div>
                <div>
                    <h4 className="font-medium text-xs text-foreground mb-1">Market Value</h4>
                    <p className="text-xs text-muted-foreground break-words">{currentItem.marketValue}</p>
                </div>
                <div>
                    <h4 className="font-medium text-xs text-foreground mb-1">Quick Facts</h4>
                    <div className="space-y-1">
                        {currentItem.quickFacts.map((fact, index) => (
                            <div key={index} className="text-xs text-muted-foreground break-words">• {fact}</div>
                        ))}
                    </div>
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
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Voice interaction
    const { isListening, transcript, handleTranscript, handleStartListening, handleStopListening, clearTranscript } = useVoiceToText()
    const [isVoiceChatOpen, setIsVoiceChatOpen] = useState(false)

    // Image search
    const [isImageSearchOpen, setIsImageSearchOpen] = useState(false)

    // Update input when transcript changes
    useEffect(() => {
        if (transcript) {
            setInput(transcript)
            // Don't clear transcript immediately - let handleSendMessage use it
        }
    }, [transcript])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

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
            // Check if this message came from voice input
            const isFromVoice = transcript && userMessage.content.toLowerCase().trim() === transcript.toLowerCase().trim()
            console.log('🎤 Voice chat detection:', {
                transcript,
                userMessageContent: userMessage.content,
                isFromVoice
            })

            const response = await fetch(`${BACKEND_URL}/api/philaguide`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage.content,
                    history: [],
                    stream: true,
                    voiceChat: isFromVoice // Enable voice chat mode if input came from voice
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to get response')
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
                            } else if (data.type === 'complete') {
                                // Streaming complete
                                console.log('Streaming complete')
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
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: 'I apologize, but I encountered an error while processing your request. Please try again.',
                role: 'assistant',
                timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
            setStreamingStatus('')
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
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
                            <AvatarFallback className="bg-primary-foreground/10 text-primary-foreground text-base">PG</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <h3 className="font-bold text-lg truncate">PhilaGuide AI</h3>
                            <p className="text-xs opacity-90 truncate">Your intelligent stamp assistant</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsOpen(false)}
                        className="text-primary-foreground hover:bg-primary-foreground/10 rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4 bg-background/70">
                    <div className="space-y-4">
                        {messages.length === 0 && (
                            <div className="text-center py-8 px-4">
                                <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center animate-pulse-slow">
                                    <MessageSquare className="w-10 h-10 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-3">Welcome to PhilaGuide AI!</h3>
                                <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                                    I'm your specialized stamp collecting assistant. Ask me about stamps, values, history, or collecting tips, or use the image search feature.
                                </p>
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
                            </div>
                        )}

                        {messages.map((message) => (
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
                                            ? "bg-primary text-primary-foreground rounded-tl-xl rounded-br-xl rounded-tr-sm rounded-bl-sm ml-auto"
                                            : "bg-muted text-foreground rounded-tr-xl rounded-bl-xl rounded-tl-sm rounded-br-sm mr-auto border border-input"
                                    )}>
                                        {message.content}
                                    </div>

                                    {/* Stamp Preview Display */}
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
                        {isLoading && (
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
                                        {streamingStatus && (
                                            <div className="text-xs text-muted-foreground mt-1">
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
                <div className="p-4 border-t border-input bg-card/60">
                    <div className="flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask PhilaGuide AI..."
                            disabled={isLoading}
                            className="flex-1 text-sm bg-background border-input px-4 py-2.5 rounded-full focus-visible:ring-offset-0 focus-visible:ring-primary"
                        />

                        <VoiceInteraction
                            onTranscript={handleTranscript}
                            isListening={isListening}
                            onStartListening={handleStartListening}
                            onStopListening={handleStopListening}
                            disabled={isLoading}
                        />
                        <Button
                            onClick={input.trim() ? handleSendMessage : () => setIsVoiceChatOpen(true)}
                            disabled={isLoading}
                            size="icon"
                            className={cn(
                                "transition-all duration-200 flex-shrink-0 rounded-full",
                                input.trim()
                                    ? "bg-primary hover:bg-primary/90"
                                    : "bg-accent/50 hover:bg-accent text-primary-foreground"
                            )}
                        >
                            {input.trim() ? (
                                <Send className="w-5 h-5" />
                            ) : (
                                <AudioLines className="w-5 h-5" />
                            )}
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        Press Enter to send, use voice, upload image, or ask about stamps, values, history, or collecting tips
                    </p>
                </div>
            </div>

            {/* Voice Chat Popup */}
            <VoiceChatPopup
                isOpen={isVoiceChatOpen}
                onClose={() => setIsVoiceChatOpen(false)}
                onSendMessage={handleVoiceChatMessage}
            />

            {/* Image Search Popup */}
            <ImageSearch
                isOpen={isImageSearchOpen}
                onClose={() => setIsImageSearchOpen(false)}
            />
        </>
    )
} 