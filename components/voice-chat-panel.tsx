'use client'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Mic, MicOff, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface VoiceChatPanelProps {
    onTranscript: (text: string) => void
    onClose: () => void
    onVoiceChange?: (voice: string) => void
}

const VOICE_OPTIONS = [
    { value: 'alloy', label: 'Alloy' },
    { value: 'echo', label: 'Echo' },
    { value: 'fable', label: 'Fable' },
    { value: 'onyx', label: 'Onyx' },
    { value: 'nova', label: 'Nova' },
    { value: 'shimmer', label: 'Shimmer' }
]

export default function VoiceChatPanel({ onTranscript, onClose, onVoiceChange }: VoiceChatPanelProps) {
    const [isListening, setIsListening] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [selectedVoice, setSelectedVoice] = useState('alloy')
    const [debugInfo, setDebugInfo] = useState('Ready to start voice chat')

    // Audio refs
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<Blob[]>([])
    const streamRef = useRef<MediaStream | null>(null)
    const sessionIdRef = useRef<string | null>(null)

    // Handle voice selection change
    const handleVoiceChange = (voice: string) => {
        setSelectedVoice(voice)
        onVoiceChange?.(voice)
    }

    // Start/Stop voice chat
    const toggleVoiceChat = async () => {
        if (isListening) {
            stopListening()
        } else {
            await startListening()
        }
    }

    // Start listening
    const startListening = async () => {
        try {
            setDebugInfo('Starting voice chat...')
            setIsProcessing(true)

            // Get microphone access
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: 44100,
                    channelCount: 1
                }
            })

            streamRef.current = stream

            // Create MediaRecorder
            const supportedTypes = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' :
                MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/webm'

            const mediaRecorder = new MediaRecorder(stream, { mimeType: supportedTypes })
            mediaRecorderRef.current = mediaRecorder

            // Handle audio data
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data)
                }
            }

            // Handle recording stop
            mediaRecorder.onstop = async () => {
                console.log('🎤 MediaRecorder stopped, processing audio...')
                await processAudio()
            }

            // Handle recording errors
            mediaRecorder.onerror = (event) => {
                console.error('🎤 MediaRecorder error:', event)
                setDebugInfo('Recording error occurred')
                setIsProcessing(false)
            }

            // Start recording
            mediaRecorder.start(1000)
            setIsListening(true)
            setIsProcessing(false)
            setDebugInfo('🎤 Listening... Speak naturally')

        } catch (error) {
            console.error('Failed to start listening:', error)
            setDebugInfo(`Failed to start: ${error}`)
            setIsProcessing(false)
        }
    }

    // Stop listening
    const stopListening = () => {
        if (mediaRecorderRef.current && isListening) {
            mediaRecorderRef.current.stop()
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop())
            streamRef.current = null
        }

        setIsListening(false)
        setDebugInfo('Voice chat stopped')
    }

    // Process recorded audio
    const processAudio = async () => {
        try {
            console.log('🎤 processAudio: Starting audio processing...')
            if (audioChunksRef.current.length === 0) {
                console.log('🎤 processAudio: No audio chunks, skipping processing')
                return
            }

            setIsProcessing(true)
            setDebugInfo('🔄 Processing your voice...')

            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
            console.log('🎤 processAudio: Audio blob created, size:', audioBlob.size, 'bytes')
            audioChunksRef.current = []

            // Convert to base64
            const arrayBuffer = await audioBlob.arrayBuffer()
            const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
            console.log('🎤 processAudio: Audio converted to base64, length:', base64Audio.length)

            // Send to speech-to-text
            console.log('🎤 processAudio: Sending to speech-to-text API...')
            const response = await fetch('/api/speech-to-text', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    audio: base64Audio,
                    sessionId: sessionIdRef.current
                })
            })

            console.log('🎤 processAudio: Speech-to-text response status:', response.status)

            if (!response.ok) {
                const errorText = await response.text()
                console.error('🎤 processAudio: Speech-to-text failed:', response.status, errorText)
                throw new Error(`Speech-to-text failed: ${response.status}`)
            }

            const data = await response.json()
            console.log('🎤 processAudio: Speech-to-text response:', data)

            if (data.text) {
                const newTranscript = data.text
                console.log('🎤 processAudio: Setting transcript:', newTranscript)
                onTranscript(newTranscript)

                // Clear transcript after a delay
                setTimeout(() => onTranscript(''), 3000)
            }

            // Clear timeout and reset state
            setIsProcessing(false)
            setDebugInfo('🎤 Ready for next input')
            console.log('🎤 processAudio: Audio processing completed successfully')

        } catch (error) {
            console.error('🎤 processAudio: Audio processing failed:', error)
            setDebugInfo(`Processing failed: ${error}`)
            setIsProcessing(false)
        }
    }

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopListening()
        }
    }, [])

    return (
        <div className="space-y-3 p-3 bg-gray-900 rounded-lg border border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Voice Chat</h3>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-gray-400 hover:text-white h-6 w-6 p-0"
                >
                    <X className="h-3 w-3" />
                </Button>
            </div>

            {/* Voice Selection - Compact */}
            <div className="flex items-center space-x-2">
                <label className="text-xs text-gray-300">Voice:</label>
                <Select value={selectedVoice} onValueChange={handleVoiceChange}>
                    <SelectTrigger className="h-7 text-xs bg-gray-800 border-gray-600 text-white w-24">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                        {VOICE_OPTIONS.map((voice) => (
                            <SelectItem key={voice.value} value={voice.value} className="text-white text-xs">
                                {voice.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Main Voice Chat Button - Centered */}
            <div className="flex justify-center">
                <Button
                    onClick={toggleVoiceChat}
                    disabled={isProcessing}
                    className={`w-16 h-16 rounded-full text-white ${isListening
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    {isListening ? (
                        <MicOff className="h-6 w-6" />
                    ) : (
                        <Mic className="h-6 w-6" />
                    )}
                </Button>
            </div>

            {/* Status - Compact */}
            <div className="text-center">
                <div className={`text-xs font-medium ${isListening ? 'text-green-400' : 'text-gray-400'}`}>
                    {isListening ? '🎤 Listening...' : '🎤 Click to start'}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                    {debugInfo}
                </div>
            </div>

            {/* Processing Status */}
            {isProcessing && (
                <div className="flex items-center justify-center space-x-2 text-xs text-blue-400">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-400" />
                    <span>Processing...</span>
                </div>
            )}
        </div>
    )
}
