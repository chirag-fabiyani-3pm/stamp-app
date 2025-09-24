'use client'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Mic, Square, Volume2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

interface RealtimePrecisePanelProps {
    onClose: () => void
    onTranscript: (transcript: string) => void
    onSpeakResponse?: (text: string) => void
    onVoiceChange?: (voice: string) => void
    onListeningChange?: (isListening: boolean) => void
    onTranscribingChange?: (isTranscribing: boolean) => void
}

const VOICE_OPTIONS = [
    { value: 'alloy', label: 'Alloy' },
    { value: 'echo', label: 'Echo' },
    { value: 'fable', label: 'Fable' },
    { value: 'onyx', label: 'Onyx' },
    { value: 'nova', label: 'Nova' },
    { value: 'shimmer', label: 'Shimmer' }
]

export default function RealtimePrecisePanel({
    onClose,
    onTranscript,
    onSpeakResponse,
    onVoiceChange,
    onListeningChange,
    onTranscribingChange
}: RealtimePrecisePanelProps) {
    const router = useRouter()

    console.log('🎤 RealtimePrecisePanel rendered')

    // State for voice chat
    const [isSessionActive, setIsSessionActive] = useState(false)
    const [isConnecting, setIsConnecting] = useState(false)
    const [isUserSpeaking, setIsUserSpeaking] = useState(false)
    const [isAISpeaking, setIsAISpeaking] = useState(false)
    const [selectedVoice, setSelectedVoice] = useState('alloy')
    const [connectionState, setConnectionState] = useState<string>('disconnected')
    const [messageCount, setMessageCount] = useState(0)

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

    // Function calling handler for vector search
    const handleFunctionCall = useCallback(async (functionName: string, parameters: any) => {
        console.log('🎤 Function call received:', functionName, parameters)

        if (functionName === 'search_stamp_database') {
            try {
                const { query } = parameters
                console.log('🎤 Searching stamp database for:', query)

                // Call the existing vector search API
                const response = await fetch('/api/voice-vector-search', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        transcript: query,
                        sessionId: `realtime_${Date.now()}`,
                        mode: 'precise'
                    }),
                })

                if (!response.ok) {
                    throw new Error(`Vector search failed: ${response.status}`)
                }

                const data = await response.json()
                console.log('🎤 Vector search response:', data)

                // Return the search results for the AI to process
                return {
                    success: true,
                    results: data.results || [],
                    message: data.message || 'Search completed'
                }
            } catch (error) {
                console.error('🎤 Vector search error:', error)
                return {
                    success: false,
                    error: 'Failed to search stamp database',
                    message: 'Sorry, I encountered an error searching our stamp database. Please try again.'
                }
            }
        }

        return {
            success: false,
            error: 'Unknown function',
            message: 'Sorry, I don\'t know how to handle that request.'
        }
    }, [])

    // Transcription event handlers
    const handleDataChannelMessage = useCallback((event: MessageEvent) => {
        try {
            const msg = JSON.parse(event.data)
            console.log('🎤 Data channel message received:', msg.type, msg)

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

                    // Don't send partial transcription to main chat interface to avoid duplicates
                    break
                }

                // Delta user transcription (streaming)
                case 'conversation.item.input_audio_transcription.delta': {
                    const deltaText = msg.delta || ''
                    console.log('🎤 Delta user transcription:', deltaText)

                    setCurrentUserMessage(prev => prev + deltaText)
                    setIsTranscriptProcessing(false)

                    // Don't send delta transcription to main chat interface to avoid duplicates
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

                    // Trigger AI response by sending a message
                    console.log('🎤 Triggering AI response for:', finalText)
                    console.log('🎤 Data channel state before sending:', dataChannelRef.current?.readyState)
                    if (dataChannelRef.current && dataChannelRef.current.readyState === 'open') {
                        const userMessage = {
                            type: 'conversation.item.create',
                            item: {
                                type: 'message',
                                role: 'user',
                                content: [
                                    {
                                        type: 'input_text',
                                        text: finalText
                                    }
                                ]
                            }
                        }
                        dataChannelRef.current.send(JSON.stringify(userMessage))
                        console.log('🎤 User message sent to AI:', userMessage)
                    }
                    break
                }

                // Function call request
                case 'conversation.item.function_call': {
                    console.log('🎤 Function call request:', msg)
                    const { name, parameters } = msg.function_call || {}
                    console.log('🎤 Function name:', name, 'Parameters:', parameters)

                    if (name && parameters) {
                        // Handle the function call
                        console.log('🎤 Calling function:', name, 'with parameters:', parameters)
                        handleFunctionCall(name, parameters).then(result => {
                            console.log('🎤 Function call result:', result)
                            // Send function result back to the AI
                            const functionResult = {
                                type: 'conversation.item.create',
                                item: {
                                    type: 'function_call_output',
                                    call_id: msg.function_call?.id || msg.id,
                                    output: JSON.stringify(result)
                                }
                            }

                            if (dataChannelRef.current && dataChannelRef.current.readyState === 'open') {
                                dataChannelRef.current.send(JSON.stringify(functionResult))
                                console.log('🎤 Function result sent:', functionResult)

                                // Trigger AI to generate response after function call
                                const responseRequest = {
                                    type: 'response.create'
                                }
                                dataChannelRef.current.send(JSON.stringify(responseRequest))
                                console.log('🎤 Response create request sent')
                            } else {
                                console.error('🎤 Data channel not ready for function result, state:', dataChannelRef.current?.readyState)
                            }
                        }).catch(error => {
                            console.error('🎤 Function call error:', error)

                            // Send error result back to the AI
                            const errorResult = {
                                type: 'conversation.item.create',
                                item: {
                                    type: 'function_call_output',
                                    call_id: msg.function_call?.id || msg.id,
                                    output: JSON.stringify({
                                        success: false,
                                        error: error.message,
                                        message: 'Sorry, I encountered an error processing your request.'
                                    })
                                }
                            }

                            if (dataChannelRef.current) {
                                dataChannelRef.current.send(JSON.stringify(errorResult))
                                console.log('🎤 Function error result sent:', errorResult)

                                // Trigger AI to generate response after function call error
                                const responseRequest = {
                                    type: 'response.create'
                                }
                                dataChannelRef.current.send(JSON.stringify(responseRequest))
                                console.log('🎤 Response create request sent for error')
                            }
                        })
                    }
                    break
                }

                // Streaming AI response transcription
                case 'response.audio_transcript.delta': {
                    const deltaText = msg.delta || ''
                    console.log('🎤 AI response delta:', deltaText)

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

                // Conversation item created (AI response)
                case 'conversation.item.created': {
                    console.log('🎤 Conversation item created:', msg.item)
                    const item = msg.item

                    if (item.type === 'message' && item.role === 'assistant') {
                        console.log('🎤 AI message created:', item.content)

                        // Check if this is a function call
                        if (item.content && item.content[0] && item.content[0].type === 'function_call') {
                            console.log('🎤 AI made a function call:', item.content[0])
                            // Handle function call here if needed
                        } else if (item.content && item.content[0] && item.content[0].type === 'text') {
                            console.log('🎤 AI text response:', item.content[0].text)
                            // Send AI response to main chat interface
                            onTranscript?.(`\nAI: ${item.content[0].text}`)
                        }
                    }
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
    }, [handleFunctionCall, onTranscript, onTranscribingChange])

    // Configure data channel for transcription and function calling
    const configureDataChannel = useCallback((dataChannel: RTCDataChannel) => {
        console.log('🎤 Configuring data channel for transcription and function calling...')

        // Send session update to enable transcription and function calling
        const sessionUpdate = {
            type: 'session.update',
            session: {
                modalities: ['text', 'audio'],
                input_audio_transcription: {
                    model: 'whisper-1'
                },
                tools: [
                    {
                        type: 'function',
                        name: 'search_stamp_database',
                        description: 'Search the comprehensive stamp database for specific stamp information, values, history, and details',
                        parameters: {
                            type: 'object',
                            properties: {
                                query: {
                                    type: 'string',
                                    description: 'The search query for stamp information (e.g., "one day bright orange vermilion stamp", "US stamps from 1950s", "rare stamps from Germany")'
                                }
                            },
                            required: ['query']
                        }
                    }
                ]
            }
        }

        try {
            console.log('🎤 Attempting to send session update, data channel state:', dataChannel.readyState)
            console.log('🎤 Data channel label:', dataChannel.label)
            console.log('🎤 Session update payload:', JSON.stringify(sessionUpdate, null, 2))

            if (dataChannel.readyState === 'open') {
                dataChannel.send(JSON.stringify(sessionUpdate))
                console.log('🎤 ✅ Session update sent successfully!')
            } else {
                console.error('🎤 ❌ Data channel not ready, state:', dataChannel.readyState)
                // Retry after a short delay
                setTimeout(() => {
                    console.log('🎤 Retrying session update, data channel state:', dataChannel.readyState)
                    if (dataChannel.readyState === 'open') {
                        dataChannel.send(JSON.stringify(sessionUpdate))
                        console.log('🎤 ✅ Session update sent on retry!')
                    } else {
                        console.error('🎤 ❌ Data channel still not ready on retry:', dataChannel.readyState)
                    }
                }, 500)
            }
        } catch (error) {
            console.error('🎤 ❌ Failed to send session update:', error)
        }
    }, [])

    // Handle voice selection change
    const handleVoiceChange = (value: string) => {
        setSelectedVoice(value)
        console.log('🎤 Voice changed to:', value)
        onVoiceChange?.(value)
    }

    // Create OpenAI Realtime session
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
                    max_tokens: 200,
                    instructions: `You are PhilaGuide AI, a specialized stamp collecting expert providing precise search results. You ONLY respond to philatelic (stamp collecting) related queries.

CRITICAL RESTRICTION - PHILATELIC QUERIES ONLY:
- ONLY respond to questions about stamps, stamp collecting, philately, postal history, or related topics
- For ANY non-philatelic queries, politely redirect users back to stamp-related topics
- Do NOT answer questions about general topics, current events, weather, sports, app navigation, etc.

PRECISE SEARCH MODE:
- You have access to a comprehensive stamp database through the search_stamp_database function
- ALWAYS use the search_stamp_database function to find specific stamp information
- When users ask about stamps, immediately call the search function with their query
- Provide specific, accurate information about stamps when found in the database
- Include specific information like catalog numbers, years, denominations, and countries
- If you cannot find specific stamps, ask clarifying questions to narrow down the search

FUNCTION CALLING GUIDELINES:
- Always call search_stamp_database when users ask about specific stamps
- Use the exact words from the user's query as the search parameter
- Process the search results and present them in a clear, informative way
- If search returns no results, ask for more specific details about the stamp

VOICE RESPONSE GUIDELINES:
- Always respond in ENGLISH only, regardless of the user's language
- Use clear, descriptive language suitable for speech
- Avoid abbreviations and technical jargon
- Use complete sentences and natural speech patterns
- Be informative but friendly and engaging
- When describing stamps, include details like country, year, denomination, color, and interesting facts
- Use natural language for denominations (e.g., "one-third penny" instead of "1/3d")
- Keep responses VERY SHORT - maximum 1-2 sentences for voice
- Prioritize essential information only (value, denomination, year)
- Always respond in a natural, conversational manner suitable for voice synthesis
- Maintain conversation context from previous philatelic messages
- Reference previous stamp topics when relevant to show continuity

IMPORTANT: This is a continuous conversation session. Users can interrupt you at any time by speaking, and you should stop and listen to them.

REMEMBER: You are a stamp collecting expert with access to precise stamp data through function calling. Always search the database for specific stamp information.`
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

            // Create peer connection
            const peerConnection = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
            })

            setPeerConnection(peerConnection)

            // Create data channel for transcription
            const dataChannel = peerConnection.createDataChannel('transcription', {
                ordered: true
            })

            dataChannelRef.current = dataChannel

            // Configure data channel
            dataChannel.onopen = () => {
                console.log('🎤 Data channel opened, ready state:', dataChannel.readyState)
                console.log('🎤 Data channel label:', dataChannel.label)
                // Wait a bit for the data channel to be fully ready
                setTimeout(() => {
                    console.log('🎤 Configuring data channel after delay...')
                    configureDataChannel(dataChannel)
                }, 100)
            }

            dataChannel.onmessage = (event) => {
                setMessageCount(prev => prev + 1)
                console.log('🎤 Raw data channel message received (#', messageCount + 1, '):', event.data)
                console.log('🎤 Data channel ready state:', dataChannel.readyState)
                console.log('🎤 Message timestamp:', new Date().toISOString())
                handleDataChannelMessage(event)
            }

            dataChannel.onerror = (error) => {
                console.error('🎤 Data channel error:', error)
            }

            dataChannel.onclose = () => {
                console.log('🎤 Data channel closed')
            }

            // Handle ICE candidates
            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    console.log('🎤 ICE candidate generated')
                }
            }

            // Handle connection state changes
            peerConnection.onconnectionstatechange = () => {
                console.log('🎤 Connection state:', peerConnection.connectionState)
                setConnectionState(peerConnection.connectionState)

                if (peerConnection.connectionState === 'connected') {
                    console.log('🎤 WebRTC connection established')
                    setIsSessionActive(true)
                } else if (peerConnection.connectionState === 'disconnected' ||
                    peerConnection.connectionState === 'failed' ||
                    peerConnection.connectionState === 'closed') {
                    console.log('🎤 WebRTC connection lost')
                    setIsSessionActive(false)
                }
            }

            // Get user media
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            setAudioStream(stream)

            // Add audio tracks to peer connection
            stream.getTracks().forEach(track => {
                peerConnection.addTrack(track, stream)
            })

            // Create offer
            const offer = await peerConnection.createOffer()
            await peerConnection.setLocalDescription(offer)

            console.log('🎤 Local offer created')

            // Send offer to OpenAI Realtime API
            const response = await fetch('https://api.openai.com/v1/realtime', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${sessionData.ephemeralToken}`,
                    'Content-Type': 'application/sdp'
                },
                body: offer.sdp
            })

            if (!response.ok) {
                const errorText = await response.text()
                console.error('🎤 Offer failed:', response.status, errorText)
                throw new Error(`Offer failed: ${response.status} - ${errorText}`)
            }

            const answerSdp = await response.text()
            console.log('🎤 Answer received:', answerSdp)

            // Set remote description
            await peerConnection.setRemoteDescription({
                type: 'answer',
                sdp: answerSdp
            })

            console.log('🎤 WebRTC connection setup completed, waiting for ICE connection...')

            // Wait for connection to be established
            return new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('WebRTC connection timeout'))
                }, 10000) // 10 second timeout

                const checkConnection = () => {
                    if (peerConnection.connectionState === 'connected') {
                        clearTimeout(timeout)
                        console.log('🎤 WebRTC connection established successfully')

                        // Test data channel communication
                        setTimeout(() => {
                            if (dataChannelRef.current && dataChannelRef.current.readyState === 'open') {
                                console.log('🎤 Testing data channel communication...')
                                const testMessage = {
                                    type: 'conversation.item.create',
                                    item: {
                                        type: 'message',
                                        role: 'user',
                                        content: [
                                            {
                                                type: 'input_text',
                                                text: 'Hello, can you hear me? Please search for a stamp about "one day bright orange vermilion" and tell me about it.'
                                            }
                                        ]
                                    }
                                }
                                dataChannelRef.current.send(JSON.stringify(testMessage))
                                console.log('🎤 Test message sent:', testMessage)

                                // Set a timeout to detect if AI doesn't respond
                                setTimeout(() => {
                                    console.log('🎤 ⚠️ No response from AI after 5 seconds - this indicates a communication issue')
                                }, 5000)
                            }
                        }, 1000)

                        resolve(peerConnection)
                    } else if (peerConnection.connectionState === 'failed' ||
                        peerConnection.connectionState === 'disconnected') {
                        clearTimeout(timeout)
                        reject(new Error('WebRTC connection failed'))
                    } else {
                        // Still connecting, check again
                        setTimeout(checkConnection, 100)
                    }
                }

                // Start checking connection state
                checkConnection()
            })
        } catch (error) {
            console.error('🎤 WebRTC setup failed:', error)
            throw error
        }
    }, [configureDataChannel, handleDataChannelMessage])

    // Start voice chat session
    const startVoiceChat = useCallback(async () => {
        try {
            setIsConnecting(true)
            console.log('🎤 Starting voice chat session...')
            console.log('🎤 RealtimePrecisePanel startVoiceChat called')

            // Create session
            const sessionData = await createRealtimeSession()

            // Setup WebRTC connection
            await setupWebRTCConnection(sessionData)

            setIsConnecting(false)
            console.log('🎤 Voice chat session setup completed, waiting for connection...')

        } catch (error) {
            console.error('🎤 Failed to start voice chat:', error)
            setIsConnecting(false)
            setConnectionState('failed')
            // Handle error (show user-friendly message)
            alert(`Failed to start voice chat: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }, [createRealtimeSession, setupWebRTCConnection])

    // Stop voice chat session
    const stopVoiceChat = useCallback(() => {
        try {
            console.log('🎤 Stopping voice chat session...')

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

            // Close data channel
            if (dataChannelRef.current) {
                dataChannelRef.current.close()
                dataChannelRef.current = null
            }

            // Reset states
            setIsSessionActive(false)
            setIsUserSpeaking(false)
            setIsAISpeaking(false)
            setIsTranscriptProcessing(false)
            setCurrentUserMessage('')
            setHasStartedAIResponse(false)
            setConnectionState('disconnected')

            console.log('🎤 Voice chat session stopped')
        } catch (error) {
            console.error('🎤 Error stopping voice chat:', error)
        }
    }, [])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopVoiceChat()
        }
    }, [stopVoiceChat])

    return (
        <div className="flex flex-col space-y-4 p-4">
            {/* Voice Selection */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Voice</label>
                <Select value={selectedVoice} onValueChange={handleVoiceChange}>
                    <SelectTrigger>
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
            </div>

            {/* Status Indicators */}
            <div className="space-y-2">
                <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${isSessionActive ? 'bg-green-500' :
                        isConnecting ? 'bg-yellow-500 animate-pulse' :
                            'bg-gray-300'
                        }`} />
                    <span className="text-sm text-gray-600">
                        {isSessionActive ? 'Connected' :
                            isConnecting ? 'Connecting...' :
                                'Disconnected'}
                    </span>
                </div>

                {connectionState && connectionState !== 'disconnected' && (
                    <div className="text-xs text-gray-500">
                        State: {connectionState} | Messages: {messageCount}
                    </div>
                )}

                {isUserSpeaking && (
                    <div className="flex items-center space-x-2">
                        <Mic className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-blue-600">You are speaking...</span>
                    </div>
                )}

                {isAISpeaking && (
                    <div className="flex items-center space-x-2">
                        <Volume2 className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-600">AI is responding...</span>
                    </div>
                )}

                {isTranscriptProcessing && (
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm text-blue-600">Processing...</span>
                    </div>
                )}
            </div>

            {/* Live Transcription */}
            {currentUserMessage && (
                <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                        <strong>You:</strong> {currentUserMessage}
                    </p>
                </div>
            )}

            {/* Control Buttons */}
            <div className="flex space-x-2">
                {!isSessionActive ? (
                    <Button
                        onClick={startVoiceChat}
                        disabled={isConnecting}
                        className="flex-1"
                    >
                        {isConnecting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Connecting...
                            </>
                        ) : (
                            <>
                                <Mic className="w-4 h-4 mr-2" />
                                Start Precise Search
                            </>
                        )}
                    </Button>
                ) : (
                    <Button
                        onClick={stopVoiceChat}
                        variant="destructive"
                        className="flex-1"
                    >
                        <Square className="w-4 h-4 mr-2" />
                        Stop Search
                    </Button>
                )}
            </div>


        </div>
    )
}
