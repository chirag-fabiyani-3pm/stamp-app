'use client'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AudioLines, Loader2, Mic, Square } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useRef, useState } from 'react'

interface RealtimePrecisePanelV2Props {
    onTranscript?: (text: string) => void
    onTranscribingChange?: (isTranscribing: boolean) => void
    className?: string
}

interface FunctionCall {
    name: string
    parameters: Record<string, any>
}

interface FunctionResult {
    result: string
}

export default function RealtimePrecisePanelV2({
    onTranscript,
    onTranscribingChange,
    className = ''
}: RealtimePrecisePanelV2Props) {
    const router = useRouter()

    const [isConnecting, setIsConnecting] = useState(false)
    const [isSessionActive, setIsSessionActive] = useState(false)
    const [isTranscribing, setIsTranscribing] = useState(false)
    const [connectionState, setConnectionState] = useState<string>('disconnected')
    const [selectedVoice, setSelectedVoice] = useState('alloy')
    const [currentUserMessage, setCurrentUserMessage] = useState('')
    const [messageCount, setMessageCount] = useState(0)

    const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
    const dataChannelRef = useRef<RTCDataChannel | null>(null)
    const sessionIdRef = useRef<string | null>(null)
    const abortControllerRef = useRef<AbortController | null>(null)
    const audioStreamRef = useRef<MediaStream | null>(null)

    // Create Realtime API session
    const createRealtimeSession = useCallback(async () => {
        try {
            console.log('🎤 Creating Realtime API session...')

            const response = await fetch('/api/realtime-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    instructions: `You are a stamp expert assistant. You MUST respond ONLY in English. When users ask about stamps, use the search_stamp_database function to find relevant information. Always provide detailed and accurate information about stamps, their values, history, and characteristics.`,
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
                                        description: 'The search query for finding stamp information'
                                    }
                                },
                                required: ['query']
                            }
                        }
                    ]
                })
            })

            if (!response.ok) {
                throw new Error(`Session creation failed: ${response.status} - ${await response.text()}`)
            }

            const sessionData = await response.json()
            console.log('🎤 Session created:', sessionData)

            // Extract the ephemeral token from the session response
            const ephemeralToken = sessionData.client_secret?.value || sessionData.client_secret

            if (!ephemeralToken) {
                console.error('🎤 Missing ephemeral token in session response:', sessionData)
                throw new Error('Session creation response missing ephemeral token')
            }

            sessionIdRef.current = sessionData.id
            return { ephemeralToken, sessionId: sessionData.id }
        } catch (error) {
            console.error('🎤 Failed to create session:', error)
            throw error
        }
    }, [])

    // Handle function calls
    const handleFunctionCall = useCallback(async (name: string, parameters: Record<string, any>) => {
        console.log('🎤 Handling function call:', name, parameters)

        try {
            if (name === 'search_stamp_database') {
                const response = await fetch('/api/voice-vector-search', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query: parameters.query,
                        limit: 5
                    })
                })

                if (!response.ok) {
                    throw new Error(`Vector search failed: ${response.status}`)
                }

                const data = await response.json()
                console.log('🎤 Vector search result:', data)

                // Check for structured data with stamp ID and navigate if found
                if (data.structured?.mode === 'cards' && data.structured.cards?.length > 0) {
                    const firstStamp = data.structured.cards[0]
                    if (firstStamp.id) {
                        console.log('🎤 Realtime precise v2 search found stamp with ID, navigating to:', firstStamp.id)
                        router.push(`/stamp-details/${firstStamp.id}`)
                    }
                } else if (data.structured?.mode === 'comparison' && data.structured.stampIds?.length > 0) {
                    const stampIds = data.structured.stampIds.filter(Boolean)
                    if (stampIds.length > 0) {
                        console.log('🎤 Realtime precise v2 search found comparison request, navigating to comparison view with IDs:', stampIds)
                        router.push(`/stamp-comparison?ids=${stampIds.join(',')}`)
                    }
                } else if (data.structured?.id) {
                    console.log('🎤 Realtime precise v2 search found single stamp ID, navigating to:', data.structured.id)
                    router.push(`/stamp-details/${data.structured.id}`)
                }

                // Format the result for the AI
                const formattedResult = {
                    success: true,
                    results: data.results || [],
                    totalResults: data.totalResults || 0,
                    query: parameters.query
                }

                return formattedResult
            }

            throw new Error(`Unknown function: ${name}`)
        } catch (error) {
            console.error('🎤 Function call error:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                query: parameters.query
            }
        }
    }, [])

    // Handle data channel messages
    const handleDataChannelMessage = useCallback((event: MessageEvent) => {
        try {
            const message = JSON.parse(event.data)
            setMessageCount(prev => prev + 1)

            console.log('🎤 Data channel message received:', message)

            switch (message.type) {
                case 'session.created':
                    console.log('🎤 Session created:', message.session)
                    break

                case 'session.updated':
                    console.log('🎤 Session updated:', message.session)
                    break

                case 'conversation.item.created':
                    console.log('🎤 Conversation item created:', message.item)
                    const item = message.item

                    if (item.type === 'message' && item.role === 'assistant') {
                        console.log('🎤 AI message created:', item.content)

                        // Handle AI response
                        if (item.content && item.content[0]) {
                            const content = item.content[0]

                            if (content.type === 'text') {
                                console.log('🎤 AI text response:', content.text)
                                onTranscript?.(`\nAI: ${content.text}`)
                            } else if (content.type === 'function_call') {
                                console.log('🎤 AI function call:', content)
                                // The function call will be handled by the function_call event
                            }
                        }
                    } else if (item.type === 'message' && item.role === 'user') {
                        console.log('🎤 User message created:', item.content)
                        if (item.content && item.content[0] && item.content[0].type === 'input_text') {
                            onTranscript?.(`\nYou: ${item.content[0].text}`)
                        }
                    } else if (item.type === 'function_call') {
                        console.log('🎤 Function call created:', item)
                        // Handle function call
                        if (item.name && item.parameters) {
                            handleFunctionCall(item.name, item.parameters).then(result => {
                                console.log('🎤 Function call result:', result)

                                // Send function result back to AI
                                const functionResult = {
                                    type: 'conversation.item.create',
                                    item: {
                                        type: 'function_call_output',
                                        call_id: item.id,
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
                                }
                            }).catch(error => {
                                console.error('🎤 Function call error:', error)

                                const errorResult = {
                                    type: 'conversation.item.create',
                                    item: {
                                        type: 'function_call_output',
                                        call_id: item.id,
                                        output: JSON.stringify({
                                            success: false,
                                            error: error.message
                                        })
                                    }
                                }

                                if (dataChannelRef.current && dataChannelRef.current.readyState === 'open') {
                                    dataChannelRef.current.send(JSON.stringify(errorResult))
                                    console.log('🎤 Error result sent:', errorResult)

                                    // Trigger AI to generate response after function call error
                                    const responseRequest = {
                                        type: 'response.create'
                                    }
                                    dataChannelRef.current.send(JSON.stringify(responseRequest))
                                    console.log('🎤 Response create request sent for error')
                                }
                            })
                        }
                    }
                    break

                case 'conversation.item.input_audio_transcription.delta':
                    console.log('🎤 Transcription delta:', message.delta)
                    setCurrentUserMessage(prev => prev + (message.delta || ''))
                    break

                case 'conversation.item.input_audio_transcription.completed':
                    console.log('🎤 Transcription completed:', message.transcript)
                    setCurrentUserMessage('')
                    setIsTranscribing(false)
                    onTranscribingChange?.(false)
                    break

                case 'conversation.item.function_call':
                    console.log('🎤 Function call request:', message)
                    const { name, parameters } = message.function_call || {}

                    if (name && parameters) {
                        handleFunctionCall(name, parameters).then(result => {
                            console.log('🎤 Function call result:', result)

                            // Send function result back to AI
                            const functionResult = {
                                type: 'conversation.item.create',
                                item: {
                                    type: 'function_call_output',
                                    function_call_id: message.item?.id,
                                    content: JSON.stringify(result)
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
                            }
                        }).catch(error => {
                            console.error('🎤 Function call error:', error)

                            const errorResult = {
                                type: 'conversation.item.create',
                                item: {
                                    type: 'function_call_output',
                                    function_call_id: message.item?.id,
                                    content: JSON.stringify({
                                        success: false,
                                        error: error.message
                                    })
                                }
                            }

                            if (dataChannelRef.current && dataChannelRef.current.readyState === 'open') {
                                dataChannelRef.current.send(JSON.stringify(errorResult))
                                console.log('🎤 Error result sent:', errorResult)
                            }
                        })
                    }
                    break

                case 'response.audio_transcript.delta':
                    console.log('🎤 Audio transcript delta:', message.transcript)
                    // Accumulate the transcript as it comes in
                    setCurrentUserMessage(prev => prev + (message.transcript || ''))
                    break

                case 'response.audio_transcript.done':
                    console.log('🎤 Audio transcript done:', message)
                    break

                case 'response.content_part.done':
                    console.log('🎤 Content part done:', message)
                    break

                case 'response.output_item.done':
                    console.log('🎤 Output item done:', message)
                    if (message.item && message.item.content) {
                        console.log('🎤 AI response content:', message.item.content)
                        // Extract text from the response
                        if (message.item.content[0] && message.item.content[0].type === 'text') {
                            const aiText = message.item.content[0].text
                            console.log('🎤 AI text response:', aiText)
                            onTranscript?.(`\nAI: ${aiText}`)
                        } else if (message.item.content[0] && message.item.content[0].type === 'audio') {
                            // Handle audio response with transcript
                            const audioContent = message.item.content[0]
                            if (audioContent.transcript) {
                                console.log('🎤 AI audio response transcript:', audioContent.transcript)
                                onTranscript?.(`\nAI: ${audioContent.transcript}`)
                            }
                        } else if (message.item.content[0] && message.item.content[0].type === 'function_call') {
                            console.log('🎤 AI function call in response:', message.item.content[0])
                            // Handle function call from response
                            const functionCall = message.item.content[0]
                            if (functionCall.name && functionCall.parameters) {
                                handleFunctionCall(functionCall.name, functionCall.parameters).then(result => {
                                    console.log('🎤 Function call result:', result)

                                    // Send function result back to AI
                                    const functionResult = {
                                        type: 'conversation.item.create',
                                        item: {
                                            type: 'function_call_output',
                                            call_id: item.id,
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
                                    }
                                }).catch(error => {
                                    console.error('🎤 Function call error:', error)
                                })
                            }
                        } else {
                            console.log('🎤 Unknown response content type:', message.item.content[0])
                        }
                    }
                    break

                case 'response.done':
                    console.log('🎤 Response done:', message)
                    break

                case 'rate_limits.updated':
                    console.log('🎤 Rate limits updated:', message.rate_limits)
                    break

                case 'response.audio.done':
                    console.log('🎤 Response audio done:', message)
                    break

                case 'response.output_item.added':
                    console.log('🎤 Output item added:', message)
                    break

                case 'response.function_call_arguments.delta':
                    console.log('🎤 Function call arguments delta:', message)
                    if (message.arguments) {
                        console.log('🎤 Function call arguments:', message.arguments)
                    }
                    break

                case 'response.function_call_arguments.done':
                    console.log('🎤 Function call arguments done:', message)
                    if (message.arguments) {
                        console.log('🎤 Final function call arguments:', message.arguments)
                        try {
                            const parsedArgs = JSON.parse(message.arguments)
                            console.log('🎤 Parsed function call arguments:', parsedArgs)

                            // Execute the function call
                            if (parsedArgs.query) {
                                console.log('🎤 Executing function call with query:', parsedArgs.query)
                                handleFunctionCall('search_stamp_database', parsedArgs).then(result => {
                                    console.log('🎤 Function call result:', result)

                                    // Send function result back to AI
                                    const functionResult = {
                                        type: 'conversation.item.create',
                                        item: {
                                            type: 'function_call_output',
                                            call_id: message.item_id,
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
                                    }
                                }).catch(error => {
                                    console.error('🎤 Function call error:', error)
                                })
                            }
                        } catch (error) {
                            console.error('🎤 Error parsing function call arguments:', error)
                        }
                    }
                    break

                case 'output_audio_buffer.stopped':
                    console.log('🎤 Output audio buffer stopped:', message)
                    break

                case 'error':
                    console.error('🎤 Realtime API error:', message.error)
                    break

                default:
                    console.log('🎤 Unhandled message type:', message.type)
            }
        } catch (error) {
            console.error('🎤 Error handling data channel message:', error)
        }
    }, [handleFunctionCall, onTranscript, onTranscribingChange])

    // Setup WebRTC connection
    const setupWebRTCConnection = useCallback(async (sessionData: { ephemeralToken: string, sessionId: string }) => {
        try {
            console.log('🎤 Setting up WebRTC connection...')

            // Get microphone access first (this is crucial for audio tracks)
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            audioStreamRef.current = stream
            console.log('🎤 Microphone access granted')

            const peerConnection = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
            })

            peerConnectionRef.current = peerConnection

            // Add audio tracks to the peer connection (this is what was missing!)
            stream.getTracks().forEach(track => {
                console.log('🎤 Adding audio track to peer connection:', track.kind)
                peerConnection.addTrack(track, stream)
            })

            // Handle ICE candidates
            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    console.log('🎤 ICE candidate generated:', event.candidate)
                }
            }

            // Handle connection state changes
            peerConnection.onconnectionstatechange = () => {
                const state = peerConnection.connectionState
                console.log('🎤 Connection state changed:', state)
                setConnectionState(state)

                if (state === 'connected') {
                    setIsSessionActive(true)
                    console.log('🎤 WebRTC connection established!')
                } else if (state === 'disconnected' || state === 'failed') {
                    setIsSessionActive(false)
                    console.log('🎤 WebRTC connection lost')
                }
            }

            // Create data channel
            const dataChannel = peerConnection.createDataChannel('messages', {
                ordered: true
            })

            dataChannelRef.current = dataChannel

            dataChannel.onopen = () => {
                console.log('🎤 Data channel opened')

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
                                            description: 'The search query for finding stamp information'
                                        }
                                    },
                                    required: ['query']
                                }
                            }
                        ]
                    }
                }

                console.log('🎤 Sending session update:', JSON.stringify(sessionUpdate, null, 2))
                dataChannel.send(JSON.stringify(sessionUpdate))
                console.log('🎤 Session update sent successfully!')

                // Send a test message to verify communication
                setTimeout(() => {
                    const testMessage = {
                        type: 'conversation.item.create',
                        item: {
                            type: 'message',
                            role: 'user',
                            content: [
                                {
                                    type: 'input_text',
                                    text: 'Hello! I need help finding information about stamps. Please search for "one day bright orange vermilion" stamp.'
                                }
                            ]
                        }
                    }

                    console.log('🎤 Sending test message:', testMessage)
                    dataChannel.send(JSON.stringify(testMessage))
                }, 1000)
            }

            dataChannel.onmessage = handleDataChannelMessage

            dataChannel.onerror = (error) => {
                console.error('🎤 Data channel error:', error)
            }

            dataChannel.onclose = () => {
                console.log('🎤 Data channel closed')
            }

            // Create offer (now with audio tracks)
            const offer = await peerConnection.createOffer()
            await peerConnection.setLocalDescription(offer)

            console.log('🎤 Created offer with audio tracks:', offer)

            // Connect to OpenAI Realtime API directly (same as working implementation)
            const realtimeResponse = await fetch(`https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2025-06-03&voice=${selectedVoice}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${sessionData.ephemeralToken}`,
                    'Content-Type': 'application/sdp',
                },
                body: offer.sdp
            })

            if (!realtimeResponse.ok) {
                throw new Error(`Offer failed: ${realtimeResponse.status} - ${await realtimeResponse.text()}`)
            }

            const answerSdp = await realtimeResponse.text()
            console.log('🎤 Received answer:', answerSdp)

            // Set remote description
            await peerConnection.setRemoteDescription({
                type: 'answer',
                sdp: answerSdp
            })

            console.log('🎤 WebRTC setup completed')

        } catch (error) {
            console.error('🎤 WebRTC setup failed:', error)
            throw error
        }
    }, [handleDataChannelMessage])

    // Start voice chat
    const startVoiceChat = useCallback(async () => {
        try {
            setIsConnecting(true)
            console.log('🎤 Starting voice chat session...')

            // Create session
            const sessionData = await createRealtimeSession()

            // Setup WebRTC connection
            await setupWebRTCConnection(sessionData)

            setIsConnecting(false)
            console.log('🎤 Voice chat session started successfully!')

        } catch (error) {
            console.error('🎤 Failed to start voice chat:', error)
            setIsConnecting(false)
        }
    }, [createRealtimeSession, setupWebRTCConnection])

    // Stop voice chat
    const stopVoiceChat = useCallback(() => {
        console.log('🎤 Stopping voice chat...')

        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }

        if (dataChannelRef.current) {
            dataChannelRef.current.close()
        }

        if (peerConnectionRef.current) {
            peerConnectionRef.current.close()
        }

        // Stop audio stream
        if (audioStreamRef.current) {
            audioStreamRef.current.getTracks().forEach(track => track.stop())
            audioStreamRef.current = null
        }

        setIsSessionActive(false)
        setIsTranscribing(false)
        setConnectionState('disconnected')
        setCurrentUserMessage('')

        console.log('🎤 Voice chat stopped')
    }, [])

    // Handle voice selection
    const handleVoiceChange = (value: string) => {
        setSelectedVoice(value)
    }

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <AudioLines className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold">Precise Voice Search</h3>
                </div>
                <div className="flex items-center space-x-2">
                    <span className={`text-sm px-2 py-1 rounded-full ${connectionState === 'connected'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                        }`}>
                        {connectionState === 'connected' ? 'Connected' : 'Disconnected'}
                    </span>
                </div>
            </div>

            {/* Voice Selection */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Voice</label>
                <Select value={selectedVoice} onValueChange={handleVoiceChange}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="alloy">Alloy</SelectItem>
                        <SelectItem value="echo">Echo</SelectItem>
                        <SelectItem value="fable">Fable</SelectItem>
                        <SelectItem value="onyx">Onyx</SelectItem>
                        <SelectItem value="nova">Nova</SelectItem>
                        <SelectItem value="shimmer">Shimmer</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
                <div className="text-sm text-gray-600">
                    Messages received: {messageCount}
                </div>
                {currentUserMessage && (
                    <div className="text-sm text-blue-600">
                        Transcribing: {currentUserMessage}
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="flex space-x-2">
                {!isSessionActive ? (
                    <Button
                        onClick={startVoiceChat}
                        disabled={isConnecting}
                        className="flex-1"
                    >
                        {isConnecting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Connecting...
                            </>
                        ) : (
                            <>
                                <Mic className="mr-2 h-4 w-4" />
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
                        <Square className="mr-2 h-4 w-4" />
                        Stop Search
                    </Button>
                )}
            </div>

        </div>
    )
}
