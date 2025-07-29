'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Loader2, Mic, MicOff } from 'lucide-react'
import { useRef, useState } from 'react'

// Type declarations for speech recognition
declare global {
    interface Window {
        SpeechRecognition: any
        webkitSpeechRecognition: any
    }
}

interface VoiceInteractionProps {
    onTranscript: (text: string) => void
    isListening: boolean
    onStartListening: () => void
    onStopListening: () => void
    disabled?: boolean
}

export function VoiceInteraction({
    onTranscript,
    isListening,
    onStartListening,
    onStopListening,
    disabled = false
}: VoiceInteractionProps) {
    const [isSupported, setIsSupported] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const recognitionRef = useRef<any>(null)
    const [isInitialized, setIsInitialized] = useState(false)

    const initializeSpeechRecognition = () => {
        if (isInitialized) return

        // Check if speech recognition is supported
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        if (SpeechRecognition) {
            setIsSupported(true)
            recognitionRef.current = new SpeechRecognition()
            recognitionRef.current.continuous = false
            recognitionRef.current.interimResults = false
            recognitionRef.current.lang = 'en-US'

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript
                onTranscript(transcript)
                setIsProcessing(false)
            }

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error)
                setIsProcessing(false)
            }

            recognitionRef.current.onend = () => {
                setIsProcessing(false)
            }

            setIsInitialized(true)
        }
    }

    const handleToggleListening = () => {
        // Initialize speech recognition on first use
        if (!isInitialized) {
            initializeSpeechRecognition()
        }

        if (!recognitionRef.current) return

        if (isListening) {
            recognitionRef.current.stop()
            onStopListening()
        } else {
            setIsProcessing(true)
            recognitionRef.current.start()
            onStartListening()
        }
    }

    if (!isSupported && !isInitialized) {
        return (
            <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleToggleListening}
                disabled={disabled}
                className="relative transition-all duration-200 bg-orange-500 hover:bg-orange-600 text-white"
            >
                <Mic className="h-4 w-4" />
                <span className="sr-only">Start listening</span>
            </Button>
        )
    }

    return (
        <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleToggleListening}
            disabled={disabled || isProcessing}
            className={cn(
                "relative transition-all duration-200 bg-orange-500 hover:bg-orange-600 text-white",
                isListening && "bg-red-500 hover:bg-red-600",
                isProcessing && "animate-pulse"
            )}
        >
            {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : isListening ? (
                <MicOff className="h-4 w-4" />
            ) : (
                <Mic className="h-4 w-4" />
            )}
            <span className="sr-only">
                {isListening ? 'Stop listening' : 'Start listening'}
            </span>
        </Button>
    )
}

// Voice-to-text hook
export function useVoiceToText() {
    const [isListening, setIsListening] = useState(false)
    const [transcript, setTranscript] = useState('')

    const handleTranscript = (text: string) => {
        setTranscript(text)
    }

    const handleStartListening = () => {
        setIsListening(true)
    }

    const handleStopListening = () => {
        setIsListening(false)
    }

    const clearTranscript = () => {
        setTranscript('')
    }

    return {
        isListening,
        transcript,
        handleTranscript,
        handleStartListening,
        handleStopListening,
        clearTranscript
    }
} 