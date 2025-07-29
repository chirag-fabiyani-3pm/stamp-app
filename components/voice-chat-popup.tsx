'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
    onSendMessage: (message: string) => Promise<string>
}

interface VoiceOption {
    id: string
    name: string
    voice: SpeechSynthesisVoice | null
}

export function VoiceChatPopup({
    isOpen,
    onClose,
    onSendMessage
}: VoiceChatPopupProps) {
    const [isListening, setIsListening] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isMicEnabled, setIsMicEnabled] = useState(true)
    const [transcript, setTranscript] = useState('')
    const [conversation, setConversation] = useState<{ role: 'user' | 'assistant'; content: string }[]>([])
    const [isSupported, setIsSupported] = useState(false)
    const [showVoiceSettings, setShowVoiceSettings] = useState(false)
    const [selectedVoice, setSelectedVoice] = useState<VoiceOption | null>(null)
    const [availableVoices, setAvailableVoices] = useState<VoiceOption[]>([])

    // Use ref to persist selected voice across renders
    const selectedVoiceRef = useRef<VoiceOption | null>(null)

    const recognitionRef = useRef<any>(null)
    const synthesisRef = useRef<any>(null)

    // Simple function to get default voice
    const getDefaultVoice = (): SpeechSynthesisVoice | null => {
        const voices = window.speechSynthesis.getVoices()
        return voices.find(voice => voice.lang.startsWith('en')) || voices[0] || null
    }

    // Load voices when component mounts
    useEffect(() => {
        const loadVoices = () => {
            console.log('🎤 Loading voices...')

            // Force refresh voices
            window.speechSynthesis.getVoices()

            // Wait a bit for voices to load
            setTimeout(() => {
                const voices = window.speechSynthesis.getVoices()
                console.log('🎤 Total system voices available:', voices.length)
                console.log('🎤 All system voices:', voices.map(v => v.name))

                // Filter English voices
                const englishVoices = voices.filter(voice =>
                    voice.lang.startsWith('en') && voice.default === false
                )
                console.log('🎤 English voices found:', englishVoices.length)
                console.log('🎤 English voice names:', englishVoices.map(v => v.name))

                // Take first 4 English voices
                const selectedVoices = englishVoices.slice(0, 4)

                const voiceOptions: VoiceOption[] = selectedVoices.map((voice, index) => ({
                    id: `voice-${index}`,
                    name: `Voice ${index + 1}`,
                    voice: voice
                }))

                setAvailableVoices(voiceOptions)
                console.log('🎤 Available voice options:', voiceOptions.map(v => `${v.name} -> ${v.voice?.name || 'unknown'}`))

                // Set default voice if none selected
                if (!selectedVoice && voiceOptions.length > 0) {
                    setSelectedVoice(voiceOptions[0])
                    console.log('🎤 Set default voice:', voiceOptions[0].name, '->', voiceOptions[0].voice?.name || 'unknown')
                }
            }, 100)
        }

        // Try loading voices multiple times
        loadVoices()

        // Also try after a longer delay
        setTimeout(loadVoices, 500)
        setTimeout(loadVoices, 1000)

        // Listen for voices changed event
        window.speechSynthesis.onvoiceschanged = loadVoices

        // Cleanup
        return () => {
            window.speechSynthesis.onvoiceschanged = null
        }
    }, [])

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
                    setTranscript(finalTranscript)
                    // Auto-send when final transcript is available
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
        if (!recognitionRef.current || !isMicEnabled || isSpeaking || isProcessing) {
            return
        }
        setTranscript('')
        try {
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
        if (synthesisRef.current) {
            try {
                synthesisRef.current.cancel()
            } catch (error) {
                console.log('Error canceling synthesis:', error)
            }
            setIsSpeaking(false)
        }
        // Don't auto-start listening - user must click microphone button
    }

    const handleSendVoiceMessage = async (messageText: string) => {
        if (!messageText.trim()) return

        const userMessage = messageText.trim()
        setConversation(prev => [...prev, { role: 'user', content: userMessage }])
        setTranscript('')

        // Stop listening and start processing
        stopListening()
        setIsProcessing(true)

        try {
            const apiResponse = await onSendMessage(messageText)

            // Parse the API response to extract structured data
            let response = apiResponse
            let structuredData = null

            try {
                const parsedResponse = JSON.parse(apiResponse)
                if (parsedResponse.structuredData) {
                    structuredData = parsedResponse.structuredData
                    response = parsedResponse.response || apiResponse
                }
            } catch (error) {
                // If not JSON, use the response as-is
                response = apiResponse
            }

            // Convert response to conversational format for voice
            const voiceResponse = convertToVoiceResponse(response, structuredData)

            // Clean response for display and add to conversation
            const cleanResponse = cleanDisplayResponse(response)
            setConversation(prev => [...prev, {
                role: 'assistant',
                content: cleanResponse
            }])

            // Debug: Check selected voice before speaking
            console.log('🎤 About to speak with voice:', selectedVoice?.name, '->', selectedVoice?.voice?.name)

            // Speak the conversational version
            speakResponse(voiceResponse)
        } catch (error) {
            console.error('Error sending voice message:', error)
            setConversation(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }])
            setIsProcessing(false)
        }
    }

    const verifyAndApplyVoice = (utterance: SpeechSynthesisUtterance) => {
        // This function is no longer needed as we are using a default voice
        return true
    }

    const speakResponse = (text: string) => {
        console.log('🎤 speakResponse called with text:', text.substring(0, 50) + '...')
        console.log('🎤 selectedVoice state:', selectedVoice)
        console.log('🎤 selectedVoiceRef current:', selectedVoiceRef.current)
        console.log('🎤 availableVoices:', availableVoices)

        if (!synthesisRef.current) {
            console.log('❌ synthesisRef is null')
            return
        }

        // If no voices are loaded, try to load them first
        if (availableVoices.length === 0) {
            console.log('🎤 No voices loaded, attempting to load voices...')
            const voices = window.speechSynthesis.getVoices()
            console.log('🎤 Immediate voices check:', voices.length, 'voices found')

            if (voices.length > 0) {
                const englishVoices = voices.filter(voice =>
                    voice.lang.startsWith('en') && voice.default === false
                )
                const voiceOptions: VoiceOption[] = englishVoices.slice(0, 4).map((voice, index) => ({
                    id: `voice-${index}`,
                    name: `Voice ${index + 1}`,
                    voice: voice
                }))
                setAvailableVoices(voiceOptions)
                console.log('🎤 Loaded voices on demand:', voiceOptions.length, 'voices')
            }
        }

        setIsSpeaking(true)
        setIsProcessing(false)

        // Stop any current speech
        window.speechSynthesis.cancel()

        // Create utterance
        const utterance = new SpeechSynthesisUtterance(text)
        console.log('🎤 Created utterance')

        // Enhanced voice application with fallback to first available voice
        let voiceToUse = selectedVoiceRef.current || selectedVoice

        // If no voice is selected, use the first available voice
        if (!voiceToUse && availableVoices.length > 0) {
            voiceToUse = availableVoices[0]
            console.log('🎤 No voice selected, using first available:', voiceToUse.name, '->', voiceToUse.voice?.name)
        }

        if (voiceToUse && voiceToUse.voice) {
            console.log('🎤 Attempting to apply voice:', voiceToUse.name, '->', voiceToUse.voice.name)

            // Method 1: Direct assignment
            utterance.voice = voiceToUse.voice

            // Method 2: Force refresh voices and try again
            window.speechSynthesis.getVoices()

            // Method 3: Try to find the voice by name
            const voices = window.speechSynthesis.getVoices()
            const voiceByName = voices.find(v => v.name === voiceToUse.voice?.name)
            if (voiceByName) {
                utterance.voice = voiceByName
                console.log('✅ Found voice by name:', voiceByName.name)
            }

            // Method 4: Try to find voice by index (if availableVoices has the same index)
            const voiceIndex = availableVoices.findIndex(v => v.id === voiceToUse.id)
            if (voiceIndex >= 0 && voices[voiceIndex]) {
                utterance.voice = voices[voiceIndex]
                console.log('✅ Found voice by index:', voices[voiceIndex].name)
            }

            console.log('✅ Final voice applied:', utterance.voice?.name)
        } else {
            console.log('❌ No voice available, using system default')
        }

        // Set basic properties
        utterance.rate = 0.9
        utterance.pitch = 1.0
        utterance.volume = 0.8

        // Event handlers
        utterance.onstart = () => {
            console.log('🎤 Speech started with voice:', utterance.voice?.name || 'default')
            console.log('🎤 Actual voice being used:', utterance.voice)
        }

        utterance.onend = () => {
            console.log('🎤 Speech ended')
            setIsSpeaking(false)
        }

        utterance.onerror = (event) => {
            console.log('❌ Speech error:', event)
            setIsSpeaking(false)
        }

        // Speak immediately
        try {
            window.speechSynthesis.speak(utterance)
            console.log('🎤 Speech synthesis started')
        } catch (error) {
            console.log('❌ Error starting speech:', error)
            setIsSpeaking(false)
        }
    }

    const getVoiceSettings = (voiceName: string) => {
        // This function is no longer needed as we are using a default voice
        return { rate: 0.95, pitch: 1.0, volume: 0.85 }
    }

    const clearConversation = () => {
        setConversation([])
        setTranscript('')
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
                    return `I found one stamp matching your query: ${stamp.title}. This stamp is from ${stamp.subtitle} and ${stamp.summary}.`
                } else {
                    return `I found ${stamps.length} stamps matching your query. The first one is ${stamps[0].title} from ${stamps[0].subtitle}. Would you like me to tell you about a specific stamp?`
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
                                <div
                                    key={index}
                                    className={cn(
                                        "p-3 rounded-lg text-sm max-w-[80%]",
                                        message.role === 'user'
                                            ? "bg-orange-600 text-white ml-auto"
                                            : "bg-gray-700 text-white"
                                    )}
                                >
                                    {message.content}
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
                                    <p className="text-sm text-yellow-400 font-medium">Processing your request...</p>
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
                                        console.log('🎤 Voice selected and set:', voiceOption.name, '->', voiceOption.voice?.name)
                                        console.log('🎤 Full voiceOption:', voiceOption)
                                        console.log('🎤 Ref updated:', selectedVoiceRef.current?.name)
                                    }}
                                >
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-white">
                                            {voiceOption.name}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {voiceOption.voice?.name || 'No voice available'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                if (voiceOption.voice) {
                                                    const utterance = new SpeechSynthesisUtterance("Hello, this is a test.")
                                                    utterance.voice = voiceOption.voice
                                                    utterance.rate = 0.9
                                                    utterance.pitch = 1.0
                                                    utterance.volume = 0.8
                                                    window.speechSynthesis.speak(utterance)
                                                    console.log('🧪 Testing voice:', voiceOption.name)
                                                }
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