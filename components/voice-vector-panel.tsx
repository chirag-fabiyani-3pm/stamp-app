'use client'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Mic, Square, Volume2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

interface VoiceVectorPanelProps {
    onClose: () => void
    onTranscript: (transcript: string) => void
    onSpeakResponse?: (text: string) => void
    onVoiceChange?: (voice: string) => void
    onListeningChange?: (isListening: boolean) => void
    onTranscribingChange?: (isTranscribing: boolean) => void
    onModeChange?: (mode: 'conversation' | 'precise') => void
    currentMode?: 'conversation' | 'precise'
    onVectorSearch?: (query: string) => Promise<void>
    isVoiceProcessing?: boolean
}

const VOICE_OPTIONS = [
    { value: 'alloy', label: 'Alloy' },
    { value: 'echo', label: 'Echo' },
    { value: 'fable', label: 'Fable' },
    { value: 'onyx', label: 'Onyx' },
    { value: 'nova', label: 'Nova' },
    { value: 'shimmer', label: 'Shimmer' }
]

export default function VoiceVectorPanel({
    onClose,
    onTranscript,
    onSpeakResponse,
    onVoiceChange,
    onListeningChange,
    onTranscribingChange,
    onModeChange,
    currentMode = 'precise',
    onVectorSearch,
    isVoiceProcessing = false
}: VoiceVectorPanelProps) {
    const router = useRouter()

    // State for voice chat
    const [isSessionActive, setIsSessionActive] = useState(false)
    const [isConnecting, setIsConnecting] = useState(false)
    const [isUserSpeaking, setIsUserSpeaking] = useState(false)
    const [isAISpeaking, setIsAISpeaking] = useState(false)
    const [selectedVoice, setSelectedVoice] = useState('alloy')
    const [voiceMode, setVoiceMode] = useState<'conversation' | 'precise'>(currentMode)

    // Transcription state for callback integration
    const [currentUserMessage, setCurrentUserMessage] = useState<string>('')
    const [isTranscriptProcessing, setIsTranscriptProcessing] = useState(false)
    const [hasStartedAIResponse, setHasStartedAIResponse] = useState(false)

    // Refs for WebRTC and audio
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
    const audioStreamRef = useRef<MediaStream | null>(null)
    const audioContextRef = useRef<AudioContext | null>(null)
    const audioIndicatorRef = useRef<HTMLDivElement | null>(null)
    const dataChannelRef = useRef<RTCDataChannel | null>(null)

    // State setters for refs
    const setPeerConnection = (pc: RTCPeerConnection | null) => {
        peerConnectionRef.current = pc
    }

    const setAudioStream = (stream: MediaStream | null) => {
        audioStreamRef.current = stream
    }

    // Modified transcription event handlers for vector search
    const handleDataChannelMessage = useCallback((event: MessageEvent) => {
        try {
            const msg = JSON.parse(event.data)
            console.log('🎤 Data channel message:', msg)

            // Skip AI response messages in precise mode
            if (msg.type && msg.type.includes('response') && voiceMode === 'precise') {
                console.log('🎤 Ignoring AI response in precise mode:', msg.type)
                return
            }

            switch (msg.type) {
                // User speech started
                case 'input_audio_buffer.speech_started': {
                    console.log('🎤 User started speaking')
                    setIsUserSpeaking(true)
                    setCurrentUserMessage('')
                    setIsTranscriptProcessing(false)
                    onTranscribingChange?.(true)
                    break
                }

                // User speech stopped
                case 'input_audio_buffer.speech_stopped': {
                    console.log('🎤 User stopped speaking')
                    setIsUserSpeaking(false)
                    setIsTranscriptProcessing(true)
                    break
                }

                // Audio buffer committed - processing speech
                case 'input_audio_buffer.committed': {
                    console.log('🎤 Processing speech...')
                    setIsTranscriptProcessing(true)
                    break
                }

                // Partial user transcription
                case 'conversation.item.input_audio_transcription': {
                    const partialText = msg.transcript || msg.text || 'User is speaking...'
                    console.log('🎤 Partial user transcription:', partialText)

                    setCurrentUserMessage(partialText)
                    setIsTranscriptProcessing(false)

                    // Send partial transcription to main chat interface
                    onTranscript?.(`\nYou: ${partialText}`)
                    break
                }

                // Final user transcription - THIS IS WHERE WE CALL VECTOR SEARCH
                case 'conversation.item.input_audio_transcription.completed': {
                    const finalText = msg.transcript || ''
                    console.log('🎤 Final user transcription:', finalText)

                    setCurrentUserMessage('')
                    setIsTranscriptProcessing(false)
                    onTranscribingChange?.(false)

                    // Send final user transcription to main chat interface
                    onTranscript?.(`\nYou: ${finalText}`)

                    // Call vector search for precise results
                    if (finalText.trim() && onVectorSearch) {
                        console.log('🎤 Calling vector search for:', finalText)
                        onVectorSearch(finalText.trim())
                    }
                    break
                }

                // AI responses are completely disabled in precise mode
                case 'response.audio_transcript.delta': {
                    console.log('🎤 AI response delta (completely ignored in precise mode):', msg.delta)
                    // Don't send AI responses to transcript handler in precise mode
                    return
                }

                case 'response.audio_transcript.done': {
                    console.log('🎤 AI response completed (completely ignored in precise mode)')
                    // Don't send AI responses to transcript handler in precise mode
                    return
                }

                default: {
                    // console.log('🎤 Unhandled message type:', msg.type)
                    break
                }
            }
        } catch (error) {
            console.error('🎤 Error handling data channel message:', error)
        }
    }, [onTranscript, onTranscribingChange, onVectorSearch, voiceMode])

    // Configure data channel for transcription only (no AI responses)
    const configureDataChannel = useCallback((dataChannel: RTCDataChannel) => {
        console.log('🎤 Configuring data channel for transcription only...')

        // Send session update to enable transcription only
        const sessionUpdate = {
            type: 'session.update',
            session: {
                modalities: ['text', 'audio'],
                input_audio_transcription: {
                    model: 'whisper-1'
                },
                // Try to disable AI responses
                response: {
                    modalities: []
                }
            }
        }

        dataChannel.send(JSON.stringify(sessionUpdate))
        console.log('🎤 Session update sent (transcription only):', sessionUpdate)
    }, [])

    // Handle voice selection change
    const handleVoiceChange = (value: string) => {
        setSelectedVoice(value)
        console.log('🎤 Voice changed to:', value)
        onVoiceChange?.(value)
    }

    // Handle mode change
    const handleModeChange = (mode: 'conversation' | 'precise') => {
        setVoiceMode(mode)
        console.log('🎤 Voice mode changed to:', mode)
        onModeChange?.(mode)
    }

    // Create OpenAI Realtime session
    const createRealtimeSession = useCallback(async () => {
        try {
            console.log('🎤 Creating OpenAI Realtime session for precise mode (transcription only)...')

            const response = await fetch('/api/realtime-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    voice: selectedVoice,
                    instructions: `You are a transcription service for precise stamp search mode. Your ONLY job is to transcribe user speech accurately. 

CRITICAL INSTRUCTIONS:
- Do NOT generate any responses or answers
- Do NOT provide any stamp information
- Do NOT engage in conversation
- Do NOT acknowledge questions
- Simply transcribe what the user says and wait for the next input

The vector search system will handle all responses. You are ONLY a transcription service.`,
                    disable_ai_responses: true
                })
            })

            if (!response.ok) {
                const errorText = await response.text()
                console.error('🎤 Session creation failed:', response.status, errorText)
                throw new Error(`Failed to create session: ${response.status} - ${errorText}`)
            }

            const data = await response.json()
            console.log('🎤 Session created:', data)

            // Extract the ephemeral token from the session response
            const ephemeralToken = data.client_secret?.value || data.client_secret

            if (!ephemeralToken) {
                console.error('🎤 Missing ephemeral token in session response:', data)
                throw new Error('Session creation response missing ephemeral token')
            }

            return { ephemeralToken }
        } catch (error) {
            console.error('🎤 Failed to create session:', error)
            throw error
        }
    }, [selectedVoice])

    // Setup WebRTC connection with OpenAI Realtime API
    const setupWebRTCConnection = useCallback(async (sessionData: { ephemeralToken: string }) => {
        try {
            console.log('🎤 Setting up WebRTC connection...')

            // Get microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            setAudioStream(stream)

            // Create peer connection
            const pc = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
            })

            // Create data channel for transcription
            const dataChannel = pc.createDataChannel('transcription')
            dataChannelRef.current = dataChannel

            dataChannel.onopen = () => {
                console.log('🎤 Data channel opened')
                configureDataChannel(dataChannel)
            }

            dataChannel.onmessage = handleDataChannelMessage

            // Add local audio track
            pc.addTrack(stream.getTracks()[0])

            // Handle remote audio from AI (disabled in precise mode)
            pc.ontrack = (event) => {
                console.log('🎤 Received remote audio track (ignored in precise mode)')
                // In precise mode, we don't want AI audio responses
                // The audio track is received but not played
            }

            // Create offer
            const offer = await pc.createOffer()
            await pc.setLocalDescription(offer)

            console.log('🎤 Connecting to OpenAI Realtime API...')

            // Connect to OpenAI Realtime API using the ephemeral token
            // For precise mode, we only want transcription, not AI responses
            const realtimeResponse = await fetch(`https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2025-06-03&voice=${selectedVoice}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${sessionData.ephemeralToken}`,
                    'Content-Type': 'application/sdp',
                },
                body: offer.sdp
            })

            if (!realtimeResponse.ok) {
                const errorText = await realtimeResponse.text()
                console.error('🎤 Realtime API error:', realtimeResponse.status, errorText)
                throw new Error(`Realtime API error: ${realtimeResponse.status} - ${errorText}`)
            }

            const answerSdp = await realtimeResponse.text()
            console.log('🎤 Received SDP answer from OpenAI')

            await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp })

            setPeerConnection(pc)
            setIsSessionActive(true)
            onListeningChange?.(true)

            console.log('🎤 WebRTC connection established successfully')

        } catch (error) {
            console.error('🎤 WebRTC setup failed:', error)
            throw error
        }
    }, [selectedVoice, onListeningChange, configureDataChannel, handleDataChannelMessage])

    // Start voice chat session
    const startVoiceChat = useCallback(async () => {
        try {
            console.log('🎤 Starting voice chat session...')
            setIsConnecting(true)

            // Step 1: Create OpenAI session
            const sessionData = await createRealtimeSession()

            // Step 2: Setup WebRTC connection
            await setupWebRTCConnection(sessionData)

            console.log('🎤 Voice chat session started successfully')

        } catch (error) {
            console.error('🎤 Failed to start voice chat:', error)
            // Don't reset session state on error - let user try again
            setIsConnecting(false)
            onListeningChange?.(false)
        } finally {
            setIsConnecting(false)
        }
    }, [createRealtimeSession, setupWebRTCConnection, onListeningChange])

    // Stop voice chat session
    const stopVoiceChat = useCallback(async () => {
        try {
            console.log('🎤 Stopping voice chat session...')

            // Close data channel
            if (dataChannelRef.current) {
                dataChannelRef.current.close()
                dataChannelRef.current = null
            }

            // Close peer connection
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close()
                setPeerConnection(null)
            }

            // Stop audio stream
            if (audioStreamRef.current) {
                audioStreamRef.current.getTracks().forEach(track => track.stop())
                setAudioStream(null)
            }

            // Close audio context
            if (audioContextRef.current) {
                audioContextRef.current.close()
                audioContextRef.current = null
            }

            // Reset state
            setIsSessionActive(false)
            setIsUserSpeaking(false)
            setIsAISpeaking(false)
            setCurrentUserMessage('')
            setIsTranscriptProcessing(false)
            setHasStartedAIResponse(false)
            onListeningChange?.(false)
            onTranscribingChange?.(false)

            console.log('🎤 Voice chat session stopped successfully')

        } catch (error) {
            console.error('🎤 Error stopping session:', error)
        }
    }, [onListeningChange, onTranscribingChange])

    // Add connection state monitoring
    useEffect(() => {
        if (peerConnectionRef.current) {
            const handleConnectionStateChange = () => {
                console.log('🎤 WebRTC connection state changed:', peerConnectionRef.current?.connectionState)

                if (peerConnectionRef.current?.connectionState === 'failed' || peerConnectionRef.current?.connectionState === 'disconnected') {
                    console.error('🎤 WebRTC connection failed or disconnected')
                    // Don't automatically stop - let user decide
                } else if (peerConnectionRef.current?.connectionState === 'connected') {
                    console.log('🎤 WebRTC connection established')
                }
            }

            const handleIceConnectionStateChange = () => {
                console.log('🎤 ICE connection state:', peerConnectionRef.current?.iceConnectionState)

                if (peerConnectionRef.current?.iceConnectionState === 'failed') {
                    console.error('🎤 ICE connection failed')
                }
            }

            peerConnectionRef.current.addEventListener('connectionstatechange', handleConnectionStateChange)
            peerConnectionRef.current.addEventListener('iceconnectionstatechange', handleIceConnectionStateChange)

            return () => {
                peerConnectionRef.current?.removeEventListener('connectionstatechange', handleConnectionStateChange)
                peerConnectionRef.current?.removeEventListener('iceconnectionstatechange', handleIceConnectionStateChange)
            }
        }
    }, [])

    // Setup audio visualization
    const setupAudioVisualization = useCallback((stream: MediaStream) => {
        if (!audioIndicatorRef.current) return

        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
            const source = audioContext.createMediaStreamSource(stream)
            const analyzer = audioContext.createAnalyser()

            analyzer.fftSize = 256
            source.connect(analyzer)

            const bufferLength = analyzer.frequencyBinCount
            const dataArray = new Uint8Array(bufferLength)

            const updateIndicator = () => {
                if (!audioContext || audioContext.state === 'closed') return

                analyzer.getByteFrequencyData(dataArray)
                const average = dataArray.reduce((a, b) => a + b) / bufferLength

                if (audioIndicatorRef.current) {
                    const isActive = average > 30
                    audioIndicatorRef.current.classList.toggle("animate-pulse", isActive)
                    audioIndicatorRef.current.classList.toggle("bg-green-500", isActive)
                    audioIndicatorRef.current.classList.toggle("bg-gray-400", !isActive)

                    // Track user speaking state
                    setIsUserSpeaking(isActive)
                }

                requestAnimationFrame(updateIndicator)
            }

            updateIndicator()
            audioContextRef.current = audioContext

        } catch (error) {
            console.error('🎤 Audio visualization setup failed:', error)
        }
    }, [])

    // Setup audio visualization when stream is available
    useEffect(() => {
        if (audioStreamRef.current && audioIndicatorRef.current) {
            setupAudioVisualization(audioStreamRef.current)
        }
    }, [setupAudioVisualization])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            console.log('🎤 Component unmounting, cleaning up...')
            stopVoiceChat()
        }
    }, [stopVoiceChat])

    return (
        <div className="space-y-4">
            {/* Connection Setup */}
            {!isSessionActive ? (
                <div className="text-center space-y-4">
                    {/* Voice Selection */}
                    <div className="flex items-center gap-3 justify-center">
                        <Select value={selectedVoice} onValueChange={handleVoiceChange}>
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {VOICE_OPTIONS.map((voice) => (
                                    <SelectItem key={voice.value} value={voice.value}>
                                        {voice.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Start Button */}
                        <Button
                            onClick={startVoiceChat}
                            disabled={isConnecting}
                            className="bg-primary hover:bg-primary/90 text-white px-6"
                        >
                            {isConnecting ? (
                                <>
                                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Connecting...
                                </>
                            ) : (
                                <>
                                    <Mic className="w-4 h-4 mr-2" />
                                    Start Listening
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            ) : (
                <>
                    {/* Active Session Controls */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 justify-center">
                            {/* Voice Settings */}
                            <Select value={selectedVoice} onValueChange={handleVoiceChange} disabled={isSessionActive}>
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {VOICE_OPTIONS.map((voice) => (
                                        <SelectItem key={voice.value} value={voice.value}>
                                            {voice.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Audio Indicator */}
                            <div
                                ref={audioIndicatorRef}
                                className="w-4 h-4 rounded-full bg-gray-400 transition-all duration-200"
                                title={isUserSpeaking ? 'You are speaking' : 'Listening for speech'}
                            />

                            {/* Stop Button */}
                            <Button
                                onClick={stopVoiceChat}
                                className="bg-red-500 hover:bg-red-600 text-white px-6"
                            >
                                <Square className="w-4 h-4 mr-2" />
                                Stop Session
                            </Button>
                        </div>

                        {/* Status Display */}
                        <div className="text-center space-y-2">
                            <div className="flex items-center justify-center gap-2">
                                {isUserSpeaking && (
                                    <div className="flex items-center gap-1 text-orange-600">
                                        <Mic className="w-4 h-4" />
                                        <span className="text-sm font-medium">You are speaking</span>
                                    </div>
                                )}
                                {isVoiceProcessing && (
                                    <div className="flex items-center gap-1 text-blue-600">
                                        <Volume2 className="w-4 h-4" />
                                        <span className="text-sm font-medium">Processing your question</span>
                                    </div>
                                )}
                            </div>

                            <div className="text-xs text-muted-foreground">
                                {isVoiceProcessing
                                    ? 'Searching our stamp database...'
                                    : isUserSpeaking
                                        ? 'AI will stop and listen to you'
                                        : 'Listening for your voice...'
                                }
                            </div>
                        </div>

                        {/* Live Transcription Preview */}
                        {currentUserMessage && (
                            <div className="mt-3 text-center">
                                <div className="text-xs text-muted-foreground mb-1">Live transcription:</div>
                                <div className="text-sm bg-muted/50 rounded px-3 py-2 max-w-full overflow-hidden">
                                    {currentUserMessage}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
