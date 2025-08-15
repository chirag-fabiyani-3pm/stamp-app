'use client'

import { Mic, MicOff, Settings, VolumeX } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Message, VoiceOption } from '../types/voice-chat'
import { Button } from './ui/button'

interface RealtimeVoiceChatProps {
    onTranscript: (transcript: string) => void
    isListening: boolean
    onStartListening: () => void
    onStopListening: () => void
    disabled?: boolean
    onMessageReceived: (message: Message) => void
    conversationHistory: Message[]
}

export default function RealtimeVoiceChat({
    onTranscript,
    isListening,
    onStartListening,
    onStopListening,
    disabled = false,
    onMessageReceived,
    conversationHistory
}: RealtimeVoiceChatProps) {
    const [isProcessing, setIsProcessing] = useState(false)
    const [selectedVoice, setSelectedVoice] = useState<string>('alloy')
    const [availableVoices] = useState<VoiceOption[]>([
        { id: 'alloy', name: 'Alloy', description: 'Balanced and clear' },
        { id: 'echo', name: 'Echo', description: 'Warm and friendly' },
        { id: 'fable', name: 'Fable', description: 'Storytelling voice' },
        { id: 'onyx', name: 'Onyx', description: 'Deep and authoritative' },
        { id: 'nova', name: 'Nova', description: 'Bright and energetic' },
        { id: 'shimmer', name: 'Shimmer', description: 'Smooth and melodic' }
    ])

    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<Blob[]>([])
    const streamRef = useRef<MediaStream | null>(null)

    // Initialize media recorder
    const initializeMediaRecorder = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            streamRef.current = stream

            const mediaRecorder = new MediaRecorder(stream)
            mediaRecorderRef.current = mediaRecorder

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data)
                }
            }

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
                audioChunksRef.current = []

                // Convert audio to text using OpenAI Whisper or similar
                await processAudioToText(audioBlob)
            }

            console.log('🎤 Media recorder initialized')

        } catch (error) {
            console.error('❌ Media recorder initialization failed:', error)
        }
    }, [])

    // Process audio to text
    const processAudioToText = async (audioBlob: Blob) => {
        try {
            setIsProcessing(true)

            // For now, we'll simulate speech-to-text
            // In a real implementation, you'd send the audio to OpenAI Whisper API
            const mockTranscript = "This is a test transcript from voice input"
            onTranscript(mockTranscript)

            // Simulate processing delay
            setTimeout(() => {
                setIsProcessing(false)
            }, 2000)

        } catch (error) {
            console.error('❌ Audio processing failed:', error)
            setIsProcessing(false)
        }
    }

    // Start listening
    const handleStartListening = useCallback(async () => {
        if (!mediaRecorderRef.current) {
            await initializeMediaRecorder()
        }

        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
            mediaRecorderRef.current.start()
            onStartListening()
            console.log('🎤 Started recording')
        }
    }, [initializeMediaRecorder, onStartListening])

    // Stop listening
    const handleStopListening = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop()
            onStopListening()
            console.log('🎤 Stopped recording')
        }
    }, [onStopListening])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop())
            }
        }
    }, [])

    return (
        <div className="flex flex-col items-center space-y-4 p-4">
            {/* Voice Selection */}
            <div className="flex items-center space-x-2">
                <Settings className="w-4 h-4 text-gray-500" />
                <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="text-xs bg-background border border-input rounded px-2 py-1"
                >
                    {availableVoices.map((voice) => (
                        <option key={voice.id} value={voice.id}>
                            {voice.name} - {voice.description}
                        </option>
                    ))}
                </select>
            </div>

            {/* Voice Control Buttons */}
            <div className="flex items-center space-x-4">
                <Button
                    onClick={handleStartListening}
                    disabled={disabled || isProcessing}
                    className={`rounded-full w-16 h-16 ${isListening
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                >
                    {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </Button>

                {isListening && (
                    <Button
                        onClick={handleStopListening}
                        disabled={disabled || isProcessing}
                        className="rounded-full w-12 h-12 bg-gray-500 hover:bg-gray-600"
                    >
                        <VolumeX className="w-5 h-5" />
                    </Button>
                )}
            </div>

            {/* Processing Status */}
            {isProcessing && (
                <div className="flex items-center space-x-2 text-sm text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                    <span>Processing audio...</span>
                </div>
            )}

            {/* Instructions */}
            <div className="text-center text-xs text-muted-foreground">
                <p>Click the microphone to start speaking</p>
                <p>Click the stop button when finished</p>
            </div>
        </div>
    )
}
