'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { BACKEND_URL } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { AudioLines, Loader2, Mic, MicIcon, MicOff, Settings, Volume2, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

// Type declarations for speech recognition
declare global {
    interface Window {
        SpeechRecognition: any
        webkitSpeechRecognition: any
    }
}

interface VoiceChatPopupProps {
    isOpen: boolean
    onClose: () => void
}

interface VoiceOption {
    id: string
    name: string
    description: string
}

interface StampDetails {
    type: 'single_stamp' | 'multiple_stamps'
    stamp?: any
    stamps?: any[]
    imageUrl?: string
    count?: number
}

interface ConversationMessage {
    role: 'user' | 'assistant'
    content: string
    stampDetails?: StampDetails
    source?: 'stamp_knowledge_base' | 'general_knowledge'
}

export function VoiceChatPopup({
    isOpen,
    onClose
}: VoiceChatPopupProps) {
    const [isListening, setIsListening] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isMicEnabled, setIsMicEnabled] = useState(true)
    const [transcript, setTranscript] = useState('')
    const [conversation, setConversation] = useState<ConversationMessage[]>([])
    const [isSupported, setIsSupported] = useState(false)
    const [showVoiceSettings, setShowVoiceSettings] = useState(false)
    const [selectedVoice, setSelectedVoice] = useState<VoiceOption | null>(null)
    const [availableVoices, setAvailableVoices] = useState<VoiceOption[]>([])

    // Use ref to persist selected voice across renders
    const selectedVoiceRef = useRef<VoiceOption | null>(null)

    // Generate a consistent session ID for the entire conversation
    const sessionIdRef = useRef<string>(`voice-chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)

    const recognitionRef = useRef<any>(null)
    const synthesisRef = useRef<any>(null)
    const abortControllerRef = useRef<AbortController | null>(null)

    // Simple function to get default voice
    const getDefaultVoice = (): string => {
        return 'alloy' // Default OpenAI voice
    }

    // Load OpenAI voices when component mounts
    useEffect(() => {
        const loadOpenAIVoices = async () => {
            console.log('🎤 Loading OpenAI voices...')

            try {
                const response = await fetch(`${BACKEND_URL}/api/voice-synthesis`)
                if (response.ok) {
                    const data = await response.json()
                    const voiceOptions: VoiceOption[] = data.voices || []

                    setAvailableVoices(voiceOptions)
                    console.log('🎤 OpenAI voices loaded:', voiceOptions.map(v => `${v.name} - ${v.description}`))

                    // Set default voice if none selected
                    if (!selectedVoice && voiceOptions.length > 0) {
                        const defaultVoice = voiceOptions[0]
                        setSelectedVoice(defaultVoice)
                        selectedVoiceRef.current = defaultVoice
                        console.log('🎤 Set default OpenAI voice:', defaultVoice.name)
                    }
                } else {
                    console.error('🎤 Failed to load OpenAI voices')
                }
            } catch (error) {
                console.error('🎤 Error loading OpenAI voices:', error)
            }
        }

        loadOpenAIVoices()
    }, []) // Remove selectedVoice dependency to prevent infinite loop

    // Ensure selectedVoice is set when availableVoices changes
    useEffect(() => {
        if (availableVoices.length > 0 && !selectedVoice) {
            setSelectedVoice(availableVoices[0])
            selectedVoiceRef.current = availableVoices[0]
            console.log('🎤 Auto-set selectedVoice from availableVoices:', availableVoices[0].name)
        }
    }, [availableVoices, selectedVoice])

    useEffect(() => {
        // Check if speech recognition is supported
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        if (SpeechRecognition) {
            setIsSupported(true)
            recognitionRef.current = new SpeechRecognition()
            recognitionRef.current.continuous = false
            recognitionRef.current.interimResults = true
            recognitionRef.current.lang = 'en-US'

            recognitionRef.current.onresult = (event: any) => {
                let finalTranscript = ''
                let interimTranscript = ''

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript
                    } else {
                        interimTranscript += transcript
                    }
                }

                if (finalTranscript) {
                    console.log('🎤 Final transcript received:', finalTranscript)
                    setTranscript(finalTranscript)
                    // Auto-send when final transcript is available
                    console.log('🎤 Auto-sending voice message...')
                    handleSendVoiceMessage(finalTranscript)
                } else {
                    setTranscript(interimTranscript)
                }
            }

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error)
                setIsListening(false)
            }

            recognitionRef.current.onend = () => {
                setIsListening(false)
            }

            recognitionRef.current.onstart = () => {
                setIsListening(true)
            }
        }

        // Initialize speech synthesis
        synthesisRef.current = window.speechSynthesis
    }, [])

    // Cleanup function to stop all voice activities
    const cleanupVoiceActivities = () => {
        // Abort ongoing API request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
            abortControllerRef.current = null
        }

        // Stop speech recognition
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop()
            } catch (error) {
                console.log('Error stopping recognition:', error)
            }
        }

        // Stop speech synthesis
        if (synthesisRef.current) {
            try {
                synthesisRef.current.cancel()
            } catch (error) {
                console.log('Error stopping synthesis:', error)
            }
        }

        // Reset all states
        setIsListening(false)
        setIsProcessing(false)
        setIsSpeaking(false)
        setTranscript('')
    }

    // Cleanup when popup is closed
    useEffect(() => {
        if (!isOpen) {
            cleanupVoiceActivities()
        }
    }, [isOpen])

    const startListening = () => {
        console.log('🎤 startListening called')
        if (!recognitionRef.current || !isMicEnabled || isSpeaking || isProcessing) {
            console.log('🎤 Cannot start listening:', {
                hasRecognition: !!recognitionRef.current,
                isMicEnabled,
                isSpeaking,
                isProcessing
            })
            return
        }
        setTranscript('')
        try {
            console.log('🎤 Starting speech recognition...')
            recognitionRef.current.start()
        } catch (error) {
            console.log('Error starting recognition:', error)
        }
    }

    const stopListening = () => {
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop()
            } catch (error) {
                console.log('Error stopping recognition:', error)
            }
        }
    }

    const toggleMic = () => {
        if (isListening) {
            stopListening()
        }
        setIsMicEnabled(!isMicEnabled)
    }

    const interruptAI = () => {
        // Abort ongoing API request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
            abortControllerRef.current = null
        }

        if (synthesisRef.current) {
            try {
                synthesisRef.current.cancel()
            } catch (error) {
                console.log('Error canceling synthesis:', error)
            }
            setIsSpeaking(false)
        }

        setIsProcessing(false)
        // Don't auto-start listening - user must click microphone button
    }

    const handleSendVoiceMessage = async (messageText: string) => {
        console.log('🎤 handleSendVoiceMessage called with:', messageText)
        if (!messageText.trim()) return

        const userMessage = messageText.trim()
        console.log('🎤 Adding user message to conversation:', userMessage)
        setConversation(prev => [...prev, { role: 'user', content: userMessage }])
        setTranscript('')

        // Stop listening and start processing
        stopListening()
        setIsProcessing(true)

        try {
            console.log('🎤 Making conversational voice chat request...')

            // Create abort controller for this request
            const controller = new AbortController()
            abortControllerRef.current = controller

            // Prepare conversation history for the API
            const conversationHistory = conversation.map(msg => ({
                role: msg.role,
                content: msg.content
            }))

            const response = await fetch(`${BACKEND_URL}/api/voice-chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: messageText,
                    conversationHistory: conversationHistory,
                    sessionId: sessionIdRef.current // Use consistent session ID
                }),
                signal: controller.signal
            })

            if (!response.ok) {
                throw new Error('Failed to get conversational response')
            }

            // Handle JSON response
            const data = await response.json()

            if (data.error) {
                throw new Error(data.error)
            }

            // Get the conversational response
            const voiceResponse = data.response || "I'm sorry, I didn't catch that. Could you repeat it?"

            console.log('🎤 Conversational response received:', voiceResponse.length, 'characters')
            console.log('🎤 Response source:', data.source)
            console.log('🎤 Has stamps:', data.hasStamps)

            // Add assistant response to conversation with stamp details if available
            const assistantMessage: ConversationMessage = {
                role: 'assistant',
                content: voiceResponse,
                source: data.source,
                stampDetails: data.stampDetails
            }

            setConversation(prev => [...prev, assistantMessage])

            // Debug: Check selected voice before speaking
            console.log('🎤 About to speak with OpenAI voice:', selectedVoice?.name)

            // Speak the conversational response
            speakResponse(voiceResponse)
        } catch (error) {
            console.error('Error sending voice message:', error)

            // Check if the request was aborted
            if (error instanceof Error && error.name === 'AbortError') {
                console.log('🛑 Voice chat request was aborted by user')
                // Don't add error message for aborted requests
            } else {
                setConversation(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }])
            }
            setIsProcessing(false)
        } finally {
            abortControllerRef.current = null // Clear the abort controller
        }
    }

    const verifyAndApplyVoice = (utterance: SpeechSynthesisUtterance) => {
        // This function is no longer needed as we are using a default voice
        return true
    }

    const speakResponse = async (text: string) => {
        console.log('🎤 speakResponse called with text:', text.substring(0, 50) + '...')

        // Start speaking immediately without delay
        setIsSpeaking(true)
        setIsProcessing(false)

        try {
            // Use OpenAI voice synthesis with selected voice
            const voiceToUse = selectedVoice?.id || selectedVoiceRef.current?.id || 'alloy'
            console.log('🎤 Using voice:', voiceToUse, 'for text:', text.substring(0, 30) + '...')

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
                setIsSpeaking(false)
                URL.revokeObjectURL(audioUrl) // Clean up
            }

            audio.onerror = (error) => {
                console.error('🎤 OpenAI speech error:', error)
                setIsSpeaking(false)
                URL.revokeObjectURL(audioUrl) // Clean up
            }

            console.log('🎤 Playing OpenAI voice synthesis...')
            await audio.play()

        } catch (error) {
            console.error('🎤 Voice synthesis error:', error)
            setIsSpeaking(false)

            // Fallback to browser speech synthesis
            console.log('🎤 Falling back to browser speech synthesis...')
            const utterance = new SpeechSynthesisUtterance(text)
            utterance.onend = () => setIsSpeaking(false)
            utterance.onerror = () => setIsSpeaking(false)
            window.speechSynthesis.speak(utterance)
        }
    }

    const getVoiceSettings = (voiceName: string) => {
        // This function is no longer needed as we are using a default voice
        return { rate: 0.95, pitch: 1.0, volume: 0.85 }
    }

    const clearConversation = () => {
        setConversation([])
        setTranscript('')
        // Generate new session ID for fresh conversation context
        sessionIdRef.current = `voice-chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        console.log('🎤 New session ID generated for fresh conversation:', sessionIdRef.current)
    }

    const testVoice = () => {
        // This function is no longer needed as we are using a default voice
        const utterance = new SpeechSynthesisUtterance("Hello, this is a test of the voice.")
        utterance.rate = 0.9
        utterance.pitch = 1.0
        utterance.volume = 0.8
        window.speechSynthesis.speak(utterance)
    }

    const forceSetVoice = (voiceName: string) => {
        // This function is no longer needed as we are using a default voice
        return true
    }

    const getVoiceDescription = (voiceName: string): string => {
        // This function is no longer needed as we are using a default voice
        return "Voice option"
    }

    // Convert structured stamp data to conversational voice response
    const convertToVoiceResponse = (response: string, structuredData?: any): string => {
        // If response contains JSON or structured data, convert to conversational format
        if (structuredData) {
            if (structuredData.type === 'card') {
                const stamp = structuredData
                return `I found information about the ${stamp.title}. This stamp is from ${stamp.subtitle.split(' • ')[0]} and was issued in ${stamp.subtitle.split(' • ')[1]}. ${stamp.significance || 'This is a significant stamp in philatelic history.'}`
            } else if (structuredData.type === 'carousel') {
                const stamps = structuredData.items
                if (stamps.length === 1) {
                    const stamp = stamps[0]
                    // Use new detailed content structure if available
                    if (stamp.content && stamp.content.length > 0) {
                        const overviewSection = stamp.content.find((s: any) => s.section === 'Overview')
                        if (overviewSection && overviewSection.text) {
                            return `I found one stamp matching your query: ${stamp.title}. ${overviewSection.text} ${stamp.significance || 'This is a significant stamp in philatelic history.'}`
                        }
                    }
                    // Fall back to old format
                    return `I found one stamp matching your query: ${stamp.title}. This stamp is from ${stamp.subtitle} and ${stamp.summary}.`
                } else {
                    const firstStamp = stamps[0]
                    // Use new detailed content structure if available
                    if (firstStamp.content && firstStamp.content.length > 0) {
                        const overviewSection = firstStamp.content.find((s: any) => s.section === 'Overview')
                        if (overviewSection && overviewSection.text) {
                            return `I found ${stamps.length} stamps matching your query. The first one is ${firstStamp.title}. ${overviewSection.text} Would you like me to tell you about a specific stamp?`
                        }
                    }
                    // Fall back to old format
                    return `I found ${stamps.length} stamps matching your query. The first one is ${firstStamp.title} from ${firstStamp.subtitle}. Would you like me to tell you about a specific stamp?`
                }
            }
        }

        // For general responses, clean up any remaining technical language
        let cleanResponse = response
            .replace(/\n+/g, ' ') // Replace newlines with spaces
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim()

        // If response is empty or very short, provide a default response
        if (cleanResponse.length < 20) {
            return "I found some information about stamps for you. Would you like me to tell you more details?"
        }

        return cleanResponse
    }

    // Clean response for display (remove any technical content)
    const cleanDisplayResponse = (response: string): string => {
        let cleanResponse = response
            .replace(/\n+/g, ' ') // Replace newlines with spaces
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim()

        // If response is empty or very short after cleaning, provide a default response
        if (cleanResponse.length < 20) {
            return "I found some information about stamps for you. Would you like me to tell you more details?"
        }

        return cleanResponse
    }

    // Handle popup close with cleanup
    const handleClose = () => {
        cleanupVoiceActivities()
        onClose()
    }

    if (!isSupported) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-md bg-black border-gray-800">
                    <DialogHeader>
                        <DialogTitle className="text-white">Voice Chat</DialogTitle>
                    </DialogHeader>
                    <div className="text-center py-8">
                        <p className="text-gray-400">
                            Voice chat is not supported in your browser. Please use a modern browser with speech recognition support.
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    // Render stamp image component
    const renderStampImage = (stampDetails: StampDetails) => {
        if (stampDetails.type === 'single_stamp' && stampDetails.imageUrl) {
            return (
                <div className="mt-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="flex items-start gap-3">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                            <img
                                src={stampDetails.imageUrl}
                                alt="Stamp"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.src = '/images/stamps/no-image-available.png'
                                }}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-200 font-medium mb-1">
                                {stampDetails.stamp?.name || stampDetails.stamp?.title || 'Stamp'}
                            </p>
                            <div className="space-y-1 text-xs text-gray-400">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">Country:</span>
                                    <span>{stampDetails.stamp?.country || 'Unknown'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">Year:</span>
                                    <span>{stampDetails.stamp?.issueYear || 'Unknown'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">Color:</span>
                                    <span>{stampDetails.stamp?.color || 'Unknown'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">Denomination:</span>
                                    <span>
                                        {stampDetails.stamp?.denominationValue || ''}
                                        {stampDetails.stamp?.denominationSymbol || ''}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else if (stampDetails.type === 'multiple_stamps' && stampDetails.stamps) {
            return (
                <div className="mt-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <p className="text-xs text-gray-400 mb-3">
                        Found {stampDetails.count} stamps
                    </p>
                    <div className="space-y-3">
                        {stampDetails.stamps.slice(0, 3).map((stamp, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                                    <img
                                        src={stamp.image || '/images/stamps/no-image-available.png'}
                                        alt={stamp.name || stamp.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement
                                            target.src = '/images/stamps/no-image-available.png'
                                        }}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-200 font-medium mb-1">
                                        {stamp.name || stamp.title}
                                    </p>
                                    <div className="space-y-0.5 text-xs text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">Country:</span>
                                            <span>{stamp.country || 'Unknown'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">Year:</span>
                                            <span>{stamp.issueYear || 'Unknown'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">Color:</span>
                                            <span>{stamp.color || 'Unknown'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">Denomination:</span>
                                            <span>
                                                {stamp.denominationValue || ''}
                                                {stamp.denominationSymbol || ''}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
        }
        return null
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-md bg-black border-gray-800 text-white p-0">
                    {/* Mobile-style header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-800">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-sm text-gray-400">Voice Chat</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClose}
                            className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex flex-col h-96">
                        {/* Conversation History */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {conversation.map((message, index) => (
                                <div key={index}>
                                    <div
                                        className={cn(
                                            "p-3 rounded-lg text-sm max-w-[80%]",
                                            message.role === 'user'
                                                ? "bg-orange-600 text-white ml-auto"
                                                : "bg-gray-700 text-white"
                                        )}
                                    >
                                        {message.content}
                                    </div>

                                    {/* Show stamp details if available */}
                                    {message.role === 'assistant' && message.stampDetails && (
                                        <div className="mt-2 ml-0">
                                            {renderStampImage(message.stampDetails)}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Current Transcript */}
                        {transcript && (
                            <div className="px-4 pb-2">
                                <div className="p-3 bg-blue-900 rounded-lg border border-blue-700">
                                    <p className="text-sm text-blue-200">
                                        <strong>You said:</strong> {transcript}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Central Animation Area */}
                        <div className="flex-1 flex flex-col items-center justify-center px-4">
                            {/* State 1: Listening - User is speaking */}
                            {isListening && (
                                <div className="flex flex-col items-center mb-4">
                                    <div className="w-20 h-20 rounded-full bg-red-600 animate-pulse flex items-center justify-center mb-2">
                                        <Mic className="h-8 w-8 text-white" />
                                    </div>
                                    <div className="flex space-x-1 mb-2">
                                        <div className="w-1 h-4 bg-red-400 rounded-full animate-pulse"></div>
                                        <div className="w-1 h-6 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-1 h-8 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-1 h-6 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                                        <div className="w-1 h-4 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                    <p className="text-sm text-red-400 font-medium">Listening...</p>
                                </div>
                            )}

                            {/* State 2: Processing - AI is processing request */}
                            {isProcessing && (
                                <div className="flex flex-col items-center mb-4">
                                    <div className="w-20 h-20 rounded-full bg-yellow-600 flex items-center justify-center mb-2">
                                        <Loader2 className="h-8 w-8 text-white animate-spin" />
                                    </div>
                                    <div className="flex space-x-1 mb-2">
                                        <div className="w-1 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                                        <div className="w-1 h-6 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-1 h-8 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-1 h-6 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                                        <div className="w-1 h-4 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm text-yellow-400 font-medium">Processing your request...</p>
                                        <Button
                                            onClick={() => {
                                                // Abort ongoing API request
                                                if (abortControllerRef.current) {
                                                    abortControllerRef.current.abort()
                                                    abortControllerRef.current = null
                                                }
                                                setIsProcessing(false)
                                                setIsSpeaking(false)
                                                // Stop any ongoing speech
                                                window.speechSynthesis.cancel()
                                            }}
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0 text-yellow-400 hover:text-red-400"
                                        >
                                            <div className="h-2.5 w-2.5 bg-yellow-400 rounded-sm" />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* State 3: Speaking - AI is speaking response */}
                            {isSpeaking && (
                                <div className="flex flex-col items-center mb-4">
                                    <div className="w-20 h-20 rounded-full bg-green-600 animate-pulse flex items-center justify-center mb-2">
                                        <Volume2 className="h-8 w-8 text-white" />
                                    </div>
                                    <div className="flex space-x-1 mb-2">
                                        <div className="w-1 h-4 bg-green-400 rounded-full animate-pulse"></div>
                                        <div className="w-1 h-6 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-1 h-8 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-1 h-6 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                                        <div className="w-1 h-4 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                    <p className="text-sm text-green-400 font-medium">AI Speaking...</p>
                                </div>
                            )}

                            {/* State 4: Ready - Ready to start listening */}
                            {!isListening && !isProcessing && !isSpeaking && (
                                <div className="flex flex-col items-center mb-4">
                                    <Button
                                        onClick={startListening}
                                        disabled={!isMicEnabled}
                                        className={cn(
                                            "w-20 h-20 rounded-full transition-all duration-200 mb-4",
                                            !isMicEnabled
                                                ? "bg-gray-600 hover:bg-gray-700 text-white"
                                                : "bg-orange-600 hover:bg-orange-700 text-white"
                                        )}
                                    >
                                        {!isMicEnabled ? (
                                            <MicIcon className="h-8 w-8" />
                                        ) : (
                                            <AudioLines className="h-8 w-8" />
                                        )}
                                    </Button>
                                    <p className="text-sm text-gray-400 text-center">
                                        {!isMicEnabled ? "Microphone disabled" : "Tap to start speaking"}
                                    </p>
                                </div>
                            )}

                            {/* Tap to Interrupt - Only show when AI is speaking */}
                            {isSpeaking && (
                                <Button
                                    onClick={interruptAI}
                                    variant="ghost"
                                    className="mt-4 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                >
                                    Tap to interrupt
                                </Button>
                            )}
                        </div>

                        {/* Bottom Control Bar */}
                        <div className="flex items-center justify-between p-4 border-t border-gray-800">
                            {/* Microphone Toggle */}
                            <Button
                                onClick={toggleMic}
                                variant="ghost"
                                size="sm"
                                className={cn(
                                    "flex items-center gap-2 text-gray-300 hover:text-white hover:bg-gray-800",
                                    !isMicEnabled && "text-red-400"
                                )}
                            >
                                {isMicEnabled ? (
                                    <Mic className="h-5 w-5" />
                                ) : (
                                    <MicOff className="h-5 w-5" />
                                )}
                            </Button>

                            {/* Voice Settings Button */}
                            <Button
                                onClick={() => setShowVoiceSettings(true)}
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-gray-800"
                            >
                                <span className="text-sm">{selectedVoice?.name || 'Voice'}</span>
                                <Settings className="h-4 w-4" />
                            </Button>

                            {/* Clear Chat */}
                            <Button
                                onClick={clearConversation}
                                variant="ghost"
                                size="sm"
                                className="text-gray-300 hover:text-white hover:bg-gray-800"
                            >
                                Clear
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Voice Settings Modal */}
            <Dialog open={showVoiceSettings} onOpenChange={setShowVoiceSettings}>
                <DialogContent className="sm:max-w-md bg-black border-gray-800 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-white">Voice Settings</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <p className="text-sm text-gray-400">
                            Select a voice for the AI assistant:
                        </p>
                        <div className="space-y-2">
                            {availableVoices.map((voiceOption) => (
                                <div
                                    key={voiceOption.id}
                                    className={cn(
                                        "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors",
                                        selectedVoice?.id === voiceOption.id
                                            ? "border-orange-500 bg-orange-900/20"
                                            : "border-gray-700 hover:border-gray-600"
                                    )}
                                    onClick={() => {
                                        setSelectedVoice(voiceOption)
                                        selectedVoiceRef.current = voiceOption
                                        console.log('🎤 OpenAI voice selected:', voiceOption.name)
                                        console.log('🎤 Full voiceOption:', voiceOption)
                                        console.log('🎤 Ref updated:', selectedVoiceRef.current?.name)
                                        // Close settings modal after selection
                                        setShowVoiceSettings(false)
                                    }}
                                >
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-white">
                                            {voiceOption.name}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {voiceOption.description}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                // Test OpenAI voice synthesis
                                                speakResponse("Hello, this is a test of the voice.")
                                                console.log('🧪 Testing OpenAI voice:', voiceOption.name)
                                            }}
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                                        >
                                            <Volume2 className="h-4 w-4" />
                                        </Button>
                                        {selectedVoice?.id === voiceOption.id && (
                                            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end gap-2 pt-4 border-t border-gray-700">
                            <Button
                                onClick={() => setShowVoiceSettings(false)}
                                variant="outline"
                                size="sm"
                                className="border-gray-600 text-gray-300 hover:bg-gray-800"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
} 