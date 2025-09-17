'use client'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AudioLines, Mic, Square } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'

interface PreciseVoicePanelProps {
    onTranscript: (transcript: string) => void
    onTranscribingChange?: (isTranscribing: boolean) => void
    onFunctionCallProgress?: (isInProgress: boolean, message?: string) => void
    className?: string
}

const VOICE_OPTIONS = [
    { value: 'alloy', label: 'Alloy' },
    { value: 'echo', label: 'Echo' },
    { value: 'fable', label: 'Fable' },
    { value: 'onyx', label: 'Onyx' },
    { value: 'nova', label: 'Nova' },
    { value: 'shimmer', label: 'Shimmer' }
]

export default function PreciseVoicePanel({
    onTranscript,
    onTranscribingChange,
    onFunctionCallProgress,
    className = ''
}: PreciseVoicePanelProps) {
    // State for voice chat
    const [isSessionActive, setIsSessionActive] = useState(false)
    const [isConnecting, setIsConnecting] = useState(false)
    const [isUserSpeaking, setIsUserSpeaking] = useState(false)
    const [isAISpeaking, setIsAISpeaking] = useState(false)
    const [selectedVoice, setSelectedVoice] = useState('alloy')
    const [connectionState, setConnectionState] = useState<string>('disconnected')

    // Transcription state
    const [currentUserMessage, setCurrentUserMessage] = useState<string>('')
    const [isTranscriptProcessing, setIsTranscriptProcessing] = useState(false)
    const [hasStartedAIResponse, setHasStartedAIResponse] = useState(false)
    const [isFunctionCallInProgress, setIsFunctionCallInProgress] = useState(false)

    // Refs for WebRTC and audio
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
    const audioStreamRef = useRef<MediaStream | null>(null)
    const dataChannelRef = useRef<RTCDataChannel | null>(null)

    // Handle function calls for stamp search
    const handleFunctionCall = useCallback(async (functionName: string, parameters: any) => {
        console.log('🎤 Executing function call:', functionName, parameters)

        try {
            if (functionName === 'search_stamp_database') {
                const query = parameters.query || parameters.search_query || ''
                const sessionId = `precise_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

                const response = await fetch('/api/voice-vector-search', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        transcript: query,
                        sessionId: sessionId,
                        mode: 'precise'
                    })
                })

                if (!response.ok) {
                    const errorText = await response.text()
                    console.error('🎤 Vector search error:', errorText)
                    throw new Error(`Vector search failed: ${response.status} - ${errorText}`)
                }

                const data = await response.json()
                console.log('🎤 Vector search result:', data)
                return data
            }

            return { error: 'Unknown function' }
        } catch (error) {
            console.error('🎤 Function call error:', error)
            return { error: error instanceof Error ? error.message : 'Unknown error' }
        }
    }, [])


    // Handle data channel messages (simplified like working implementation)
    const handleDataChannelMessage = useCallback((event: MessageEvent) => {
        try {
            const msg = JSON.parse(event.data)
            console.log('🎤 Precise data channel message:', msg)

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

                // Final user transcription
                case 'conversation.item.input_audio_transcription.completed': {
                    const finalText = msg.transcript || ''
                    console.log('🎤 Final user transcription:', finalText)

                    setCurrentUserMessage('')
                    setIsTranscriptProcessing(false)
                    onTranscribingChange?.(false)

                    // Send final user transcription to main chat interface
                    onTranscript?.(`\nYou: ${finalText}`)
                    break
                }

                // Response started
                case 'response.created': {
                    console.log('🎤 AI response started')
                    console.log('🎤 Response created event:', msg)
                    setIsAISpeaking(true)
                    break
                }

                // Streaming AI response transcription
                case 'response.audio_transcript.delta': {
                    const deltaText = msg.delta || ''
                    console.log('🎤 AI response delta:', deltaText)
                    console.log('🎤 Full delta event:', msg)

                    // Check if this is the first AI response delta
                    if (!hasStartedAIResponse) {
                        // Send AI response start signal
                        onTranscript?.('\nAI: ')
                        setHasStartedAIResponse(true)
                        setIsAISpeaking(true)
                    }

                    // Send AI response delta to main chat interface
                    onTranscript?.(deltaText)
                    break
                }

                // AI response transcription completed
                case 'response.audio_transcript.done': {
                    console.log('🎤 AI response completed')

                    // Send AI complete signal to main chat interface
                    onTranscript?.('\n[AI_COMPLETE]')

                    // Reset AI speaking state
                    setIsAISpeaking(false)
                    setHasStartedAIResponse(false)
                    break
                }

                // Response completed
                case 'response.done': {
                    console.log('🎤 AI response done')
                    console.log('🎤 Response done event:', msg)
                    setIsAISpeaking(false)
                    setHasStartedAIResponse(false)
                    break
                }

                // Response error
                case 'response.error': {
                    console.log('🎤 AI response error:', msg)
                    setIsAISpeaking(false)
                    setHasStartedAIResponse(false)
                    break
                }

                // Response audio delta (raw audio chunks)
                case 'response.audio.delta': {
                    console.log('🎤 AI audio delta received')
                    break
                }

                // Response audio done
                case 'response.audio.done': {
                    console.log('🎤 AI audio done')
                    break
                }

                // Response text delta (alternative to audio_transcript)
                case 'response.text.delta': {
                    const deltaText = msg.delta || ''
                    console.log('🎤 AI response text delta:', deltaText)
                    console.log('🎤 Full text delta event:', msg)

                    // Check if this is the first AI response delta
                    if (!hasStartedAIResponse) {
                        // Send AI response start signal
                        onTranscript?.('\nAI: ')
                        setHasStartedAIResponse(true)
                        setIsAISpeaking(true)
                    }

                    // Send AI response delta to main chat interface
                    onTranscript?.(deltaText)
                    break
                }

                // Response text done
                case 'response.text.done': {
                    console.log('🎤 AI response text done')
                    console.log('🎤 Response text done event:', msg)

                    // Send AI complete signal to main chat interface
                    onTranscript?.('\n[AI_COMPLETE]')

                    // Reset AI speaking state
                    setIsAISpeaking(false)
                    setHasStartedAIResponse(false)
                    break
                }

                // Function call created - just log it, don't execute here
                case 'conversation.item.created': {
                    if (msg.item && msg.item.type === 'function_call') {
                        console.log('🎤 Function call created (waiting for arguments):', msg.item)
                    }
                    break
                }

                // Function call arguments delta
                case 'response.function_call_arguments.delta': {
                    console.log('🎤 Function call arguments delta:', msg.arguments)
                    break
                }

                // Function call arguments done - execute function
                case 'response.function_call_arguments.done': {
                    console.log('🎤 Function call arguments done:', msg.arguments)
                    console.log('🎤 Function call call_id:', msg.call_id)
                    console.log('🎤 Function call name:', msg.name)

                    if (msg.arguments) {
                        try {
                            const parsedArgs = JSON.parse(msg.arguments)
                            console.log('🎤 Parsed function call arguments:', parsedArgs)

                            // Execute the function call
                            if (parsedArgs.query) {
                                console.log('🎤 Executing function call with query:', parsedArgs.query)
                                setIsFunctionCallInProgress(true)

                                // Send progress message to chat interface
                                onFunctionCallProgress?.(true, `🔍 Searching database for: "${parsedArgs.query}"`)

                                handleFunctionCall('search_stamp_database', parsedArgs).then(result => {
                                    console.log('🎤 Function call result:', result)

                                    // Send function result back to AI using conversation.item.create
                                    const functionResult = {
                                        type: 'conversation.item.create',
                                        item: {
                                            type: 'function_call_output',
                                            call_id: msg.call_id,
                                            output: result.content || result.message || 'Function executed successfully'
                                        }
                                    }

                                    console.log('🎤 Sending function result with call_id:', msg.call_id)

                                    if (dataChannelRef.current && dataChannelRef.current.readyState === 'open') {
                                        dataChannelRef.current.send(JSON.stringify(functionResult))
                                        console.log('🎤 Function result sent:', functionResult)

                                        // Trigger AI to generate response after function call
                                        const responseRequest = {
                                            type: 'response.create',
                                            response: {
                                                modalities: ['text', 'audio']
                                            }
                                        }
                                        dataChannelRef.current.send(JSON.stringify(responseRequest))
                                        console.log('🎤 Response create request sent')
                                    }
                                    setIsFunctionCallInProgress(false)

                                    // Clear progress message in chat interface
                                    onFunctionCallProgress?.(false)
                                }).catch(error => {
                                    console.error('🎤 Function call error:', error)

                                    const errorResult = {
                                        type: 'conversation.item.create',
                                        item: {
                                            type: 'function_call_output',
                                            call_id: msg.call_id,
                                            output: `Error: ${error.message}`
                                        }
                                    }

                                    if (dataChannelRef.current && dataChannelRef.current.readyState === 'open') {
                                        dataChannelRef.current.send(JSON.stringify(errorResult))
                                        console.log('🎤 Error result sent:', errorResult)

                                        // Trigger AI to generate response after function call error
                                        const responseRequest = {
                                            type: 'response.create',
                                            response: {
                                                modalities: ['text', 'audio']
                                            }
                                        }
                                        dataChannelRef.current.send(JSON.stringify(responseRequest))
                                        console.log('🎤 Response create request sent for error')
                                    }
                                    setIsFunctionCallInProgress(false)

                                    // Clear progress message in chat interface
                                    onFunctionCallProgress?.(false)
                                })
                            }
                        } catch (error) {
                            console.error('🎤 Error parsing function call arguments:', error)
                        }
                    }
                    break
                }

                // Error handling
                case 'error': {
                    console.error('🎤 Realtime API error:', msg.error)
                    break
                }

                default: {
                    console.log('🎤 Unhandled message type:', msg.type, msg)
                    break
                }
            }
        } catch (error) {
            console.error('🎤 Error handling data channel message:', error)
        }
    }, [onTranscript, onTranscribingChange, hasStartedAIResponse, handleFunctionCall])

    // Configure data channel for transcription only (no tools for now)
    const configureDataChannel = useCallback((dataChannel: RTCDataChannel) => {
        console.log('🎤 Configuring data channel for precise mode...')

        // Send session update to enable transcription for input
        const sessionUpdate = {
            type: 'session.update',
            session: {
                modalities: ['text', 'audio'],
                input_audio_transcription: {
                    model: 'whisper-1'
                }
            }
        }

        dataChannel.send(JSON.stringify(sessionUpdate))
        console.log('🎤 Session update sent:', sessionUpdate)
    }, [])

    // Create OpenAI Realtime session (same as working implementation)
    const createRealtimeSession = useCallback(async () => {
        try {
            console.log('🎤 Creating OpenAI Realtime session for precise mode...')

            const response = await fetch('/api/realtime-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    voice: selectedVoice,
                    instructions: `You are PhilaGuide AI, a specialized stamp collecting expert providing precise search results. You ONLY respond to philatelic (stamp collecting) related queries.

CRITICAL RESTRICTION - PHILATELIC QUERIES ONLY:
- ONLY respond to questions about stamps, stamp collecting, philately, postal history, or related topics
- For ANY non-philatelic queries, politely redirect users back to stamp-related topics
- Do NOT answer questions about general topics, current events, weather, sports, app navigation, etc.

PRECISE SEARCH MODE:
- You have access to a comprehensive stamp database through the search_stamp_database function
- ALWAYS use the search_stamp_database function when users ask about specific stamps
- Call the function with the user's query to find precise stamp information
- Provide specific, accurate information about stamps when available
- When you find matching stamps, describe them with precise details
- Include specific information like catalog numbers, years, denominations, and countries
- If you cannot find specific stamps, ask clarifying questions to narrow down the search

FUNCTION CALLING:
- Use search_stamp_database(query) for any stamp-related search
- The query should be the user's exact words or a refined version
- Examples: "1D bright orange vermilion", "Penny Black", "US stamps 1950s"
- Always call the function first, then provide a response based on the results

VOICE RESPONSE GUIDELINES:
- Always respond in ENGLISH only, regardless of the user's language
- Use clear, descriptive language suitable for speech
- Avoid abbreviations and technical jargon
- Use complete sentences and natural speech patterns
- Be informative but friendly and engaging
- When describing stamps, include details like country, year, denomination, color, and interesting facts
- Use natural language for denominations (e.g., "one-third penny" instead of "1/3d")
- Keep responses concise but informative (2-3 sentences max for voice)
- Always respond in a natural, conversational manner suitable for voice synthesis
- Maintain conversation context from previous philatelic messages
- Reference previous stamp topics when relevant to show continuity

IMPORTANT: This is a continuous conversation session. Users can interrupt you at any time by speaking, and you should stop and listen to them.

REMEMBER: You are a stamp collecting expert with access to precise stamp data. Always use the search function to provide accurate information. Stay focused on philatelic topics only.`,
                    tools: [
                        {
                            type: 'function',
                            name: 'search_stamp_database',
                            description: 'Search the stamp database for specific stamps based on user queries',
                            parameters: {
                                type: 'object',
                                properties: {
                                    query: {
                                        type: 'string',
                                        description: 'The search query for finding stamps (e.g., "1D bright orange vermilion", "Penny Black", "US stamps 1950s")'
                                    }
                                },
                                required: ['query']
                            }
                        }
                    ]
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

    // Setup WebRTC connection (same as working implementation)
    const setupWebRTCConnection = useCallback(async (sessionData: { ephemeralToken: string }) => {
        try {
            console.log('🎤 Setting up WebRTC connection for precise mode...')

            // Get microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            audioStreamRef.current = stream

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

            // Handle remote audio from AI
            pc.ontrack = (event) => {
                console.log('🎤 Received remote audio track from AI')
                const audioElement = document.createElement('audio')
                audioElement.autoplay = true
                audioElement.srcObject = event.streams[0]

                // Track when AI is speaking
                audioElement.onplay = () => setIsAISpeaking(true)
                audioElement.onpause = () => setIsAISpeaking(false)
                audioElement.onended = () => setIsAISpeaking(false)
            }

            // Create offer
            const offer = await pc.createOffer()
            await pc.setLocalDescription(offer)

            console.log('🎤 Connecting to OpenAI Realtime API...')

            // Connect to OpenAI Realtime API using the ephemeral token
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

            peerConnectionRef.current = pc
            setIsSessionActive(true)
            setConnectionState('connected')

            console.log('🎤 WebRTC connection established successfully')

        } catch (error) {
            console.error('🎤 WebRTC setup failed:', error)
            throw error
        }
    }, [selectedVoice, configureDataChannel, handleDataChannelMessage])

    // Start voice chat session
    const startVoiceChat = useCallback(async () => {
        try {
            console.log('🎤 Starting precise voice chat session...')
            setIsConnecting(true)

            // Step 1: Create OpenAI session
            const sessionData = await createRealtimeSession()

            // Step 2: Setup WebRTC connection
            await setupWebRTCConnection(sessionData)

            console.log('🎤 Precise voice chat session started successfully')

        } catch (error) {
            console.error('🎤 Failed to start voice chat:', error)
            setIsConnecting(false)
        } finally {
            setIsConnecting(false)
        }
    }, [createRealtimeSession, setupWebRTCConnection])

    // Stop voice chat session
    const stopVoiceChat = useCallback(async () => {
        try {
            console.log('🎤 Stopping precise voice chat session...')

            // Close data channel
            if (dataChannelRef.current) {
                dataChannelRef.current.close()
                dataChannelRef.current = null
            }

            // Close peer connection
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close()
                peerConnectionRef.current = null
            }

            // Stop audio stream
            if (audioStreamRef.current) {
                audioStreamRef.current.getTracks().forEach(track => track.stop())
                audioStreamRef.current = null
            }

            // Reset state
            setIsSessionActive(false)
            setIsUserSpeaking(false)
            setIsAISpeaking(false)
            setCurrentUserMessage('')
            setIsTranscriptProcessing(false)
            setHasStartedAIResponse(false)
            setIsFunctionCallInProgress(false)
            setConnectionState('disconnected')
            onTranscribingChange?.(false)
            onFunctionCallProgress?.(false)

            console.log('🎤 Precise voice chat session stopped successfully')

        } catch (error) {
            console.error('🎤 Error stopping session:', error)
        }
    }, [onTranscribingChange])

    // Handle voice selection change
    const handleVoiceChange = (value: string) => {
        setSelectedVoice(value)
        console.log('🎤 Voice changed to:', value)
    }

    return (
        <div className={`space-y-4 ${className}`}>
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
                                    Start Precise Search
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

                            {/* Stop Button */}
                            <Button
                                onClick={stopVoiceChat}
                                className="bg-red-500 hover:bg-red-600 text-white px-6"
                            >
                                <Square className="w-4 h-4 mr-2" />
                                Stop Search
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
                                {isFunctionCallInProgress && (
                                    <div className="flex items-center gap-1 text-yellow-600">
                                        <div className="w-4 h-4 animate-spin rounded-full border-2 border-yellow-300 border-t-yellow-600" />
                                        <span className="text-sm font-medium">Searching database...</span>
                                    </div>
                                )}
                                {isAISpeaking && (
                                    <div className="flex items-center gap-1 text-blue-600">
                                        <AudioLines className="w-4 h-4" />
                                        <span className="text-sm font-medium">AI is responding</span>
                                    </div>
                                )}
                            </div>

                            <div className="text-xs text-muted-foreground">
                                {isUserSpeaking
                                    ? 'AI will stop and listen to you'
                                    : isFunctionCallInProgress
                                        ? 'Searching stamp database for your query...'
                                        : isAISpeaking
                                            ? 'AI is speaking - wait for response'
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
