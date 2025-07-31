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
import { cn } from '@/lib/utils'
import { BACKEND_URL, FETCH_OVERRIDE_URL } from '@/lib/constants';
import {
    AudioLines,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    Info,
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
        <Card className="w-full max-w-full border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-gray-900">
                    Found {preview.count} stamp{preview.count !== 1 ? 's' : ''}
                </CardTitle>
                <p className="text-xs text-gray-600">Loading detailed information...</p>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
                {preview.stamps.slice(0, 3).map((stamp, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border">
                        <div className="w-8 h-10 bg-gray-200 rounded animate-pulse"></div>
                        <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">{stamp.name}</div>
                            <div className="text-xs text-gray-600">
                                {stamp.country} • {stamp.year} • {stamp.denomination} • {stamp.color}
                            </div>
                        </div>
                    </div>
                ))}
                {preview.stamps.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                        And {preview.stamps.length - 3} more stamps...
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

function StampCardDisplay({ data }: StampCardDisplayProps) {
    return (
        <Card className="w-full max-w-full border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 overflow-hidden">
            <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                    <div className="relative w-16 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 border-orange-200 bg-gray-100">
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
                        <CardTitle className="text-sm font-semibold text-gray-900 leading-tight break-words">
                            {data.title}
                        </CardTitle>
                        <p className="text-xs text-gray-600 mt-1 break-words">{data.subtitle}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
                {data.content.map((section, index) => (
                    <div key={index}>
                        <h4 className="font-medium text-xs text-gray-800 mb-1">{section.section}</h4>
                        {section.text && (
                            <p className="text-xs text-gray-600 leading-relaxed break-words">{section.text}</p>
                        )}
                        {section.details && (
                            <div className="space-y-1">
                                {section.details.map((detail, detailIndex) => (
                                    <div key={detailIndex} className="text-xs text-gray-600 break-words">
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
                        className="h-6 px-2 bg-blue-600 hover:bg-blue-700 text-xs"
                    >
                        <ExternalLink className="w-3 h-3 mr-1" />
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
        <Card className="w-full max-w-full border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 overflow-hidden">
            <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                    <div className="relative w-16 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 border-orange-200 bg-gray-100">
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
                        <CardTitle className="text-sm font-semibold text-gray-900 leading-tight break-words">
                            {currentItem.title}
                        </CardTitle>
                        <p className="text-xs text-gray-600 mt-1 break-words">{currentItem.subtitle}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
                <div>
                    <h4 className="font-medium text-xs text-gray-800 mb-1">Summary</h4>
                    <p className="text-xs text-gray-600 leading-relaxed break-words">{currentItem.summary}</p>
                </div>
                <div>
                    <h4 className="font-medium text-xs text-gray-800 mb-1">Market Value</h4>
                    <p className="text-xs text-gray-600 break-words">{currentItem.marketValue}</p>
                </div>
                <div>
                    <h4 className="font-medium text-xs text-gray-800 mb-1">Quick Facts</h4>
                    <div className="space-y-1">
                        {currentItem.quickFacts.map((fact, index) => (
                            <div key={index} className="text-xs text-gray-600 break-words">• {fact}</div>
                        ))}
                    </div>
                </div>
                <div className="flex gap-2 pt-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPrevious}
                        disabled={data.items.length <= 1}
                        className="h-6 px-2 text-xs"
                    >
                        <ChevronLeft className="w-3 h-3 mr-1" />
                        Prev
                    </Button>
                    <span className="text-xs text-gray-500 flex items-center">
                        {currentIndex + 1} of {data.items.length}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={goToNext}
                        disabled={data.items.length <= 1}
                        className="h-6 px-2 text-xs"
                    >
                        Next
                        <ChevronRight className="w-3 h-3 ml-1" />
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
            clearTranscript()
        }
    }, [transcript, clearTranscript])

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

        try {
            const response = await fetch(`${FETCH_OVERRIDE_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: `${BACKEND_URL}/api/philaguide`,
                    options: {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            message: userMessage.content,
                            history: [],
                            stream: true
                        })
                    }
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
        try {
            const response = await fetch(`${FETCH_OVERRIDE_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: `${BACKEND_URL}/api/philaguide`,
                    options: {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: {
                            message,
                            history: [],
                            stream: false // Voice chat doesn't need streaming       
                        }
                    }
                }),
            })

            const data = await response.json()

            if (data.error) {
                throw new Error(data.error)
            }

            // For voice chat, provide more detailed responses
            let voiceResponse = data.response

            // If we have structured data (stamps found), enhance the voice response
            if (data.structuredData && data.stampsFound > 0) {
                const stamps = data.stamps || []

                if (stamps.length === 1) {
                    const stamp = stamps[0]
                    voiceResponse = `I found a stamp for you: ${stamp.Name} from ${stamp.Country}. This is a ${stamp.DenominationValue}${stamp.DenominationSymbol || ''} stamp issued in ${stamp.IssueYear || 'unknown year'}. The color is ${stamp.Color || 'unknown'}. ${stamp.visualDescription ? 'Based on the visual description, this stamp features ' + stamp.visualDescription.substring(0, 200) + '...' : ''}`
                } else if (stamps.length > 1) {
                    const stampNames = stamps.slice(0, 3).map((s: any) => s.Name).join(', ')
                    voiceResponse = `I found ${stamps.length} stamps for you. Here are some examples: ${stampNames}. ${stamps.length > 3 ? `And ${stamps.length - 3} more stamps.` : ''} Would you like me to provide more details about any specific stamp?`
                }
            } else if (data.stampsFound === 0) {
                voiceResponse = "I couldn't find any stamps matching your description. Could you try rephrasing your query or provide more specific details about the stamp you're looking for?"
            }

            return voiceResponse
        } catch (error) {
            console.error('Error sending voice message:', error)
            return 'Sorry, I encountered an error. Please try again.'
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            >
                <Info className="w-6 h-6" />
            </button>
        )
    }

    return (
        <>
            <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white border-l border-gray-200 shadow-xl flex flex-col z-50">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                    <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarImage src="/images/stamp-bot-avatar.png" alt="PhilaGuide AI" />
                            <AvatarFallback className="bg-orange-100 text-orange-700 text-xs">PG</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <h3 className="font-semibold text-sm truncate">PhilaGuide AI</h3>
                            <p className="text-xs opacity-90 truncate">Your stamp collecting assistant</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsOpen(false)}
                        className="text-white hover:bg-orange-700 flex-shrink-0"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                        {messages.length === 0 && (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                                    <Info className="w-8 h-8 text-orange-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to PhilaGuide AI!</h3>
                                <p className="text-sm text-gray-600 mb-6">
                                    I'm your specialized stamp collecting assistant. Ask me about stamps, values, history, or collecting tips.
                                </p>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setInput("Tell me about the Penny Black stamp")}
                                        className="text-left p-3 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 text-sm transition-colors w-full"
                                    >
                                        <div className="font-medium text-orange-800">Tell me about the Penny Black stamp</div>
                                        <div className="text-xs text-orange-600 mt-1">Learn about the world's first postage stamp</div>
                                    </button>
                                    <button
                                        onClick={() => setInput("Show me rare stamps from New Zealand")}
                                        className="text-left p-3 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 text-sm transition-colors w-full"
                                    >
                                        <div className="font-medium text-orange-800">Show me rare stamps from New Zealand</div>
                                        <div className="text-xs text-orange-600 mt-1">Discover valuable New Zealand issues</div>
                                    </button>
                                    <button
                                        onClick={() => setInput("Give me collecting tips for beginners")}
                                        className="text-left p-3 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 text-sm transition-colors w-full"
                                    >
                                        <div className="font-medium text-orange-800">Give me collecting tips for beginners</div>
                                        <div className="text-xs text-orange-600 mt-1">Start your philatelic journey</div>
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
                                    <Avatar className="w-8 h-8 flex-shrink-0">
                                        <AvatarImage src="/images/stamp-bot-avatar.png" alt="PhilaGuide AI" />
                                        <AvatarFallback className="bg-orange-100 text-orange-700 text-xs">PG</AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={cn(
                                    "max-w-[85%] space-y-2",
                                    message.role === 'user' ? "order-1" : "order-2"
                                )}>
                                    <div className={cn(
                                        "rounded-lg px-3 py-2 text-sm break-words",
                                        message.role === 'user'
                                            ? "bg-orange-500 text-white"
                                            : "bg-gray-100 text-gray-900"
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
                                <Avatar className="w-8 h-8 flex-shrink-0">
                                    <AvatarImage src="/images/stamp-bot-avatar.png" alt="PhilaGuide AI" />
                                    <AvatarFallback className="bg-orange-100 text-orange-700 text-xs">PG</AvatarFallback>
                                </Avatar>
                                <div className="bg-gray-100 rounded-lg px-3 py-2">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                        </div>
                                        {streamingStatus && (
                                            <div className="text-xs text-gray-500 mt-1">
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
                <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask PhilaGuide AI..."
                            disabled={isLoading}
                            className="flex-1 text-sm"
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
                            size="sm"
                            className={cn(
                                "transition-all duration-200 flex-shrink-0",
                                input.trim()
                                    ? "bg-orange-500 hover:bg-orange-600"
                                    : "bg-orange-500 hover:bg-orange-600"
                            )}
                        >
                            {input.trim() ? (
                                <Send className="w-4 h-4" />
                            ) : (
                                <AudioLines className="w-4 h-4" />
                            )}
                        </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
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