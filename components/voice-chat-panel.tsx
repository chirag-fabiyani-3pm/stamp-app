'use client'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AudioLines, Mic, MicOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

interface VoiceChatPanelProps {
    onClose: () => void
    onTranscript: (transcript: string) => void
    onSpeakResponse?: (text: string) => void  // Add this prop for text-to-speech
    onVoiceChange?: (voice: string) => void   // Add this prop for voice selection
}



const VOICE_OPTIONS = [
    { value: 'alloy', label: 'Alloy' },
    { value: 'echo', label: 'Echo' },
    { value: 'fable', label: 'Fable' },
    { value: 'onyx', label: 'Onyx' },
    { value: 'nova', label: 'Nova' },
    { value: 'shimmer', label: 'Shimmer' }
]

export default function VoiceChatPanel({ onClose, onTranscript, onSpeakResponse, onVoiceChange }: VoiceChatPanelProps) {
    const router = useRouter()

    // Voice chat state
    const [isListening, setIsListening] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [selectedVoice, setSelectedVoice] = useState('alloy')
    const [debugInfo, setDebugInfo] = useState('🎤 Ready to start voice chat')

    // WebSocket connection to our server
    const [wsConnection, setWsConnection] = useState<WebSocket | null>(null)
    const [isWebSocketConnected, setIsWebSocketConnected] = useState(false)
    const [clientId, setClientId] = useState<string | null>(null)
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [sessionReady, setSessionReady] = useState(false)
    const [isCreatingSession, setIsCreatingSession] = useState(false)

    // Streaming response accumulation for speech
    const [accumulatedResponse, setAccumulatedResponse] = useState('')
    const [isStreamingResponse, setIsStreamingResponse] = useState(false)
    const [lastTranscription, setLastTranscription] = useState<string>('')

    // Audio streaming for direct playback
    const [isStreamingAudio, setIsStreamingAudio] = useState(false)
    const audioContextRef = useRef<AudioContext | null>(null)
    const isStreamingAudioRef = useRef<boolean>(false) // Immediate access without React state delay
    const nextStartTimeRef = useRef<number>(0) // Track when to start next audio chunk

    // Audio recording refs
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const recordingAudioChunksRef = useRef<Blob[]>([])

    // Handle voice selection change
    const handleVoiceChange = (value: string) => {
        setSelectedVoice(value)
        console.log('🎤 Voice changed to:', value)
        onVoiceChange?.(value) // Notify parent component
    }

    // Convert WebM/Opus audio to PCM16 format for OpenAI Realtime API
    const convertToPCM16 = useCallback(async (audioBlob: Blob): Promise<Uint8Array> => {
        try {
            console.log('🎤 convertToPCM16: Converting audio format...')

            // Create audio context with 24kHz sample rate (OpenAI Realtime API requirement)
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 })

            // Convert blob to array buffer
            const arrayBuffer = await audioBlob.arrayBuffer()

            // Decode audio data
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
            console.log('🎤 convertToPCM16: Audio decoded, channels:', audioBuffer.numberOfChannels, 'sample rate:', audioBuffer.sampleRate)

            // Get the first channel (mono)
            const channelData = audioBuffer.getChannelData(0)

            // Convert float32 to int16 (PCM16)
            const pcm16 = new Uint8Array(channelData.length * 2)
            const dataView = new DataView(pcm16.buffer)

            for (let i = 0; i < channelData.length; i++) {
                // Convert float (-1 to 1) to int16 (-32768 to 32767)
                const sample = Math.max(-1, Math.min(1, channelData[i]))
                const int16Value = sample < 0 ? sample * 0x8000 : sample * 0x7FFF
                dataView.setInt16(i * 2, int16Value, true) // true for little-endian
            }

            console.log('🎤 convertToPCM16: Conversion complete, PCM16 size:', pcm16.length)
            await audioContext.close()

            return pcm16
        } catch (error) {
            console.error('🎤 convertToPCM16: Failed to convert audio:', error)
            throw error
        }
    }, [])

    // Initialize audio context for direct audio playback
    const initializeAudioContext = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
        }
        return audioContextRef.current
    }, [])

    // Create WAV header for PCM16 audio data
    const createWavHeader = useCallback((sampleRate: number, numChannels: number, numSamples: number) => {
        const header = new ArrayBuffer(44)
        const view = new DataView(header)

        // RIFF identifier 'RIFF'
        view.setUint32(0, 0x52494646, false)
        // File length minus RIFF identifier length and file description length
        view.setUint32(4, 36 + numSamples * numChannels * 2, true)
        // RIFF type 'WAVE'
        view.setUint32(8, 0x57415645, false)
        // Format chunk identifier 'fmt '
        view.setUint32(12, 0x666d7420, false)
        // Format chunk length
        view.setUint32(16, 16, true)
        // Sample format (1 = PCM)
        view.setUint16(20, 1, true)
        // Number of channels
        view.setUint16(22, numChannels, true)
        // Sample rate
        view.setUint32(24, sampleRate, true)
        // Byte rate (sample rate * block align)
        view.setUint32(28, sampleRate * numChannels * 2, true)
        // Block align (number of channels * bytes per sample)
        view.setUint16(32, numChannels * 2, true)
        // Bits per sample
        view.setUint16(34, 16, true)
        // Data chunk identifier 'data'
        view.setUint32(36, 0x64617461, false)
        // Data chunk length
        view.setUint32(40, numSamples * numChannels * 2, true)

        return header
    }, [])

    // Convert base64 PCM16 audio to AudioBuffer directly (faster for streaming)
    const decodeAudioChunk = useCallback(async (base64Audio: string): Promise<AudioBuffer | null> => {
        try {
            console.log(`🎤 Decoding audio chunk: ${base64Audio.length} characters`)
            const audioContext = initializeAudioContext()

            // Decode base64 to binary data
            const binaryString = atob(base64Audio)
            const pcmArrayBuffer = new ArrayBuffer(binaryString.length)
            const pcmView = new Uint8Array(pcmArrayBuffer)
            for (let i = 0; i < binaryString.length; i++) {
                pcmView[i] = binaryString.charCodeAt(i)
            }

            // OpenAI Realtime API specs: PCM16, 24kHz, mono
            const sampleRate = 24000
            const numChannels = 1
            const numSamples = pcmArrayBuffer.byteLength / 2 // 16-bit = 2 bytes per sample

            // Create audio buffer directly from PCM data
            const audioBuffer = audioContext.createBuffer(numChannels, numSamples, sampleRate)
            const channelData = audioBuffer.getChannelData(0)

            // Convert PCM16 to Float32Array
            const dataView = new DataView(pcmArrayBuffer)
            for (let i = 0; i < numSamples; i++) {
                const sample = dataView.getInt16(i * 2, true) // Read 16-bit signed integer (little-endian)
                channelData[i] = sample / 32768.0 // Convert to float32 range [-1.0, 1.0]
            }

            console.log(`🎤 Audio chunk decoded: ${audioBuffer.duration.toFixed(3)}s duration`)
            return audioBuffer
        } catch (error) {
            console.error('🎤 Error decoding audio chunk:', error)
            return null
        }
    }, [initializeAudioContext])

    // Handle navigation commands from voice input
    const handleNavigationCommand = useCallback((text: string) => {
        const lowerText = text.toLowerCase()
        console.log('🧭 Checking navigation command for text:', JSON.stringify(text))
        console.log('🧭 Lowercase version:', JSON.stringify(lowerText))

        // Define navigation patterns
        const navigationCommands = [
            {
                patterns: ['open profile', 'go to profile', 'show profile', 'profile page', 'my profile', 'profile'],
                route: '/profile',
                action: 'Opening your profile page'
            },
            {
                patterns: ['open scan', 'go to scan', 'scan page', 'scanner', 'scan stamp', 'scan stamps', 'scan'],
                route: '/scan',
                action: 'Opening stamp scanner'
            },
            {
                patterns: ['go home', 'home page', 'main page', 'homepage', 'home'],
                route: '/',
                action: 'Going to home page'
            },
            {
                patterns: ['open help', 'help page', 'get help', 'support', 'help'],
                route: '/help',
                action: 'Opening help page'
            },
            {
                patterns: ['contact us', 'contact page', 'contact support', 'contact'],
                route: '/contact',
                action: 'Opening contact page'
            },
            {
                patterns: ['privacy policy', 'privacy page', 'privacy'],
                route: '/privacy',
                action: 'Opening privacy policy'
            },
            {
                patterns: ['test navigation', 'test nav', 'test', 'testing'],
                route: '/profile',
                action: 'Testing navigation - opening profile'
            }
        ]

        // Check if the text contains any navigation command
        for (const command of navigationCommands) {
            console.log(`🧭 Checking command patterns:`, command.patterns)
            for (const pattern of command.patterns) {
                console.log(`🧭 Testing pattern "${pattern}" against "${lowerText}"`)
                if (lowerText.includes(pattern)) {
                    console.log(`🎤 ✅ Navigation command detected: ${pattern} -> ${command.route}`)
                    setDebugInfo(`🧭 ${command.action}...`)

                    // Provide audio feedback if available
                    if (onSpeakResponse) {
                        onSpeakResponse(command.action)
                    }

                    // Add a small delay so user can hear the confirmation
                    setTimeout(() => {
                        router.push(command.route)
                    }, 1500)

                    return true // Command was handled
                } else {
                    console.log(`🧭 ❌ Pattern "${pattern}" not found in "${lowerText}"`)
                }
            }
        }

        console.log('🧭 No navigation command found in text:', JSON.stringify(lowerText))
        return false // No navigation command found
    }, [router])

    // Perform local speech recognition using browser API
    const performLocalSpeechRecognition = useCallback((audioBlob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            // For now, let's disable local speech recognition and rely on OpenAI transcription
            // The Web Speech API doesn't work well with recorded audio blobs
            reject(new Error('Local speech recognition disabled - using OpenAI transcription'))
        })
    }, [])

    // Play audio chunk with proper queueing for seamless playback
    const playAudioChunk = useCallback(async (base64Audio: string) => {
        try {
            const audioBuffer = await decodeAudioChunk(base64Audio)
            if (!audioBuffer) {
                console.error('🎤 Failed to decode audio chunk')
                return
            }

            const audioContext = initializeAudioContext()

            // Ensure AudioContext is running
            if (audioContext.state === 'suspended') {
                console.log('🎤 Resuming audio context...')
                await audioContext.resume()
            }

            if (audioContext.state !== 'running') {
                console.error('🎤 AudioContext is not running:', audioContext.state)
                return
            }

            const source = audioContext.createBufferSource()
            source.buffer = audioBuffer
            source.connect(audioContext.destination)

            // Calculate when to start this chunk for seamless playback
            const currentTime = audioContext.currentTime
            let startTime = currentTime

            // If this is the first chunk of the stream, start immediately with small buffer
            if (nextStartTimeRef.current <= currentTime) {
                startTime = currentTime + 0.05 // 50ms buffer for first chunk
            } else {
                // Queue subsequent chunks to start when previous chunk ends
                startTime = nextStartTimeRef.current
            }

            // Update next start time for the following chunk
            nextStartTimeRef.current = startTime + audioBuffer.duration

            source.onended = () => {
                console.log(`🎤 Audio chunk completed (${audioBuffer.duration.toFixed(3)}s)`)
            }

            source.addEventListener('error', (error) => {
                console.error('🎤 Audio chunk playback error:', error)
            })

            console.log(`🎤 Queueing audio chunk: ${audioBuffer.duration.toFixed(3)}s at ${startTime.toFixed(3)}s (current: ${currentTime.toFixed(3)}s)`)
            source.start(startTime)

        } catch (error) {
            console.error('🎤 Error playing audio chunk:', error)
        }
    }, [initializeAudioContext, decodeAudioChunk])

    // Connect to our WebSocket server for OpenAI integration
    const connectToWebSocketServer = useCallback(async () => {
        try {
            console.log('🎤 connectToWebSocketServer: Connecting to WebSocket server...')
            setDebugInfo('🔌 Connecting to WebSocket server...')

            // Connect to our WebSocket server
            const ws = new WebSocket('ws://localhost:3002/webrtc')

            ws.onopen = () => {
                console.log('🎤 connectToWebSocketServer: Connected to WebSocket server')
                setDebugInfo('✅ Connected to WebSocket server')
                setIsWebSocketConnected(true)
                setWsConnection(ws)
            }

            ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data)
                    console.log('🎤 connectToWebSocketServer: Received message:', message)

                    switch (message.type) {
                        case 'connection.established':
                            setClientId(message.clientId)
                            setDebugInfo(`✅ Connected with client ID: ${message.clientId}`)
                            break

                        case 'session.created':
                            console.log('🎤 connectToWebSocketServer: OpenAI session created:', message.sessionId)
                            setDebugInfo(`🎯 Session ready! Click "Start Recording" to begin`)
                            setSessionId(message.sessionId)
                            setSessionReady(true)
                            setIsCreatingSession(false)

                            // Session is ready, user can now click Start Recording
                            console.log('🎤 connectToWebSocketServer: Session ready, user can start recording')
                            break

                        case 'response.text.delta':
                            console.log('🎤 connectToWebSocketServer: AI text response delta:', message.delta)

                            // Start streaming if this is the first delta
                            if (!isStreamingResponse) {
                                setIsStreamingResponse(true)
                                setAccumulatedResponse('')
                                onTranscript('\nAI: ') // Start AI response line
                            }

                            // Accumulate response for speech synthesis
                            setAccumulatedResponse(prev => prev + message.delta)

                            // Send delta for real-time text display
                            onTranscript(message.delta)
                            setDebugInfo('🤖 AI streaming response...')
                            break

                        case 'response.complete':
                            console.log('🎤 connectToWebSocketServer: AI response complete')
                            setDebugInfo('✅ AI response complete! Speaking...')
                            setIsStreamingResponse(false)

                            // AI response complete - transcript already sent via onTranscript

                            // Now speak the complete accumulated response
                            if (onSpeakResponse && accumulatedResponse.trim()) {
                                console.log('🎤 Speaking complete response:', accumulatedResponse.substring(0, 50) + '...')
                                onSpeakResponse(accumulatedResponse.trim())
                            }

                            // Clear accumulated response
                            setAccumulatedResponse('')
                            break

                        case 'transcription.complete':
                            console.log('🎤 connectToWebSocketServer: Transcription:', message.text)
                            console.log('🎤 Raw transcription text for navigation check:', JSON.stringify(message.text))

                            // Store transcription for display first
                            setLastTranscription(message.text)

                            // Send user transcription to chat immediately
                            const userTranscriptText = `\nYou: ${message.text}`
                            console.log('🎤 Sending user transcript to chat:', JSON.stringify(userTranscriptText))
                            console.log('🎤 onTranscript function exists:', typeof onTranscript)

                            if (onTranscript) {
                                onTranscript(userTranscriptText)
                                console.log('🎤 ✅ User transcript sent to parent')
                            } else {
                                console.error('🎤 ❌ onTranscript function is missing!')
                            }

                            // Show transcription in debug info temporarily
                            setDebugInfo(`📝 Transcribed: "${message.text}"`)

                            // IMMEDIATE navigation check with simple word matching
                            const text = message.text.toLowerCase().trim()
                            console.log('🧭 IMMEDIATE navigation check for:', text)

                            // Simple direct word matching for demo reliability
                            if (text.includes('profile') || text.includes('open profile')) {
                                console.log('✅ PROFILE navigation triggered!')
                                setDebugInfo('🧭 Opening Profile Page...')

                                // Send AI navigation response to chat BEFORE navigating
                                onTranscript('\nAI: ')
                                setTimeout(() => {
                                    onTranscript('Opening your profile page...')
                                }, 50)

                                if (onSpeakResponse) onSpeakResponse('Opening your profile page')
                                setTimeout(() => router.push('/profile'), 800)
                                break
                            } else if (text.includes('scan') || text.includes('scanner')) {
                                console.log('✅ SCAN navigation triggered!')
                                setDebugInfo('🧭 Opening Scan Page...')

                                // Send AI navigation response to chat BEFORE navigating
                                onTranscript('\nAI: ')
                                setTimeout(() => {
                                    onTranscript('Opening the stamp scanner...')
                                }, 50)

                                if (onSpeakResponse) onSpeakResponse('Opening stamp scanner')
                                setTimeout(() => router.push('/scan'), 800)
                                break
                            } else if (text.includes('home')) {
                                console.log('✅ HOME navigation triggered!')
                                setDebugInfo('🧭 Going Home...')

                                // Send AI navigation response to chat BEFORE navigating
                                onTranscript('\nAI: ')
                                setTimeout(() => {
                                    onTranscript('Going to the home page...')
                                }, 50)

                                if (onSpeakResponse) onSpeakResponse('Going to home page')
                                setTimeout(() => router.push('/'), 800)
                                break
                            } else if (text.includes('help')) {
                                console.log('✅ HELP navigation triggered!')
                                setDebugInfo('🧭 Opening Help...')

                                // Send AI navigation response to chat BEFORE navigating
                                onTranscript('\nAI: ')
                                setTimeout(() => {
                                    onTranscript('Opening the help page...')
                                }, 50)

                                if (onSpeakResponse) onSpeakResponse('Opening help page')
                                setTimeout(() => router.push('/help'), 800)
                                break
                            }

                            // If no navigation command, continue with AI response
                            setDebugInfo('🎯 Transcription complete, getting AI response...')
                            break

                        case 'response.audio.delta':
                            console.log('🎤 connectToWebSocketServer: AI audio delta received')
                            setDebugInfo('🔊 Streaming AI audio...')

                            // Initialize streaming audio state only once per response
                            if (!isStreamingAudioRef.current) {
                                isStreamingAudioRef.current = true
                                setIsStreamingAudio(true)
                                // Reset timing for new response - start fresh
                                const audioContext = audioContextRef.current || initializeAudioContext()
                                nextStartTimeRef.current = audioContext.currentTime
                                console.log('🎤 Starting new audio stream, reset timing to:', nextStartTimeRef.current)
                            }

                            // Play audio chunk immediately as it arrives
                            if (message.audio && message.audio.length > 0) {
                                console.log(`🎤 Received audio chunk: ${message.audio.length} characters`)
                                playAudioChunk(message.audio) // Play immediately for real-time streaming
                            } else {
                                console.log('🎤 Received empty audio chunk')
                            }
                            break

                        case 'response.audio.done':
                            console.log('🎤 connectToWebSocketServer: AI audio streaming complete')
                            setDebugInfo('✅ AI audio streaming complete!')
                            setIsStreamingAudio(false)
                            isStreamingAudioRef.current = false // Reset ref for next response
                            // No need to do anything else - chunks were played as they arrived
                            break

                        case 'error':
                            console.error('🎤 connectToWebSocketServer: Server error:', message.error)
                            setDebugInfo(`❌ Server error: ${message.error}`)
                            break

                        default:
                            console.log('🎤 connectToWebSocketServer: Unknown message type:', message.type)
                    }
                } catch (error) {
                    console.error('🎤 connectToWebSocketServer: Error parsing message:', error)
                }
            }

            ws.onerror = (error) => {
                console.error('🎤 connectToWebSocketServer: WebSocket error:', error)
                setDebugInfo('❌ WebSocket connection error')
                setIsWebSocketConnected(false)
                setSessionId(null)
                setSessionReady(false)
                setIsCreatingSession(false)
            }

            ws.onclose = (event) => {
                console.log('🎤 connectToWebSocketServer: WebSocket closed:', event.code, event.reason)
                setDebugInfo('🔌 WebSocket connection closed')
                setIsWebSocketConnected(false)
                setWsConnection(null)
                setSessionId(null)
                setSessionReady(false)
                setIsCreatingSession(false)
            }

        } catch (error) {
            console.error('🎤 connectToWebSocketServer: Failed to connect:', error)
            setDebugInfo('❌ Failed to connect to WebSocket server')
        }
    }, [onTranscript])

    // Start actual voice chat communication
    const startVoiceChat = useCallback(async () => {
        try {
            console.log('🎤 startVoiceChat: Starting voice chat...')
            setDebugInfo('🎤 Starting voice chat...')

            // First, connect to WebSocket server if not connected
            if (!isWebSocketConnected || !wsConnection) {
                console.log('🎤 startVoiceChat: Connecting to WebSocket server first...')
                await connectToWebSocketServer()
                // Wait a bit for connection to establish
                await new Promise(resolve => setTimeout(resolve, 1000))
            }

            if (!wsConnection) {
                throw new Error('WebSocket connection not available')
            }

            // If we already have a session, just start recording
            if (sessionReady && sessionId) {
                console.log('🎤 startVoiceChat: Session already exists, starting recording directly...')
                return startRecordingWithExistingSession()
            }

            // Create OpenAI session via WebSocket only if we don't have one
            if (!sessionReady || !sessionId) {
                if (isCreatingSession) {
                    console.log('🎤 startVoiceChat: Session creation already in progress...')
                    setDebugInfo('⏳ Session creation in progress, please wait...')
                    return
                }

                console.log('🎤 startVoiceChat: Creating OpenAI session...')
                setIsCreatingSession(true)
                setDebugInfo('⏳ Creating session, please wait...')

                wsConnection.send(JSON.stringify({
                    type: 'session.create',
                    voice: selectedVoice || 'alloy',
                    instructions: 'You are a knowledgeable stamp collecting expert. Answer questions about stamps, their history, and collecting. Keep responses concise and helpful. Respond naturally to user voice input.'
                }))

                // Wait for session to be created before proceeding
                console.log('🎤 startVoiceChat: Waiting for session creation...')
                return // Exit early, wait for session.created message
            } else {
                console.log('🎤 startVoiceChat: Session already exists:', sessionId)
            }

            // Initialize media recorder if not already done
            if (!mediaRecorderRef.current) {
                console.log('🎤 startVoiceChat: Initializing media recorder...')
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                mediaRecorderRef.current = new MediaRecorder(stream, {
                    mimeType: 'audio/webm;codecs=opus'
                })

                // Store audio chunks
                const audioChunks: Blob[] = []

                mediaRecorderRef.current.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        audioChunks.push(event.data)
                    }
                }

                mediaRecorderRef.current.onstop = async () => {
                    console.log('🎤 startVoiceChat: Recording stopped, processing audio...')
                    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
                    await processRecordedAudio(audioBlob)
                    audioChunks.length = 0 // Clear chunks
                }
            }

            // Start recording
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
                console.log('🎤 startVoiceChat: Starting recording...')
                mediaRecorderRef.current.start(100) // Record in 100ms chunks
                setIsListening(true) // Keep isListening state for UI
                setDebugInfo('🎤 Recording... Speak now!')
            }

        } catch (error) {
            console.error('🎤 startVoiceChat: Failed to start voice chat:', error)
            setDebugInfo('❌ Failed to start voice chat')
        }
    }, [isWebSocketConnected, wsConnection, selectedVoice, connectToWebSocketServer])

    // Stop voice chat and process recorded audio
    const stopVoiceChat = async () => {
        try {
            console.log('🎤 stopVoiceChat: Stopping voice chat...')

            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop()
                setIsListening(false)
                setDebugInfo('🔄 Processing your voice...')
            }
        } catch (error) {
            console.error('🎤 stopVoiceChat: Failed to stop voice chat:', error)
            setDebugInfo(`❌ Failed to stop: ${error}`)
        }
    }

    // Process the recorded audio when recording stops
    const processRecordedAudio = async (audioBlob: Blob) => {
        try {
            console.log('🎤 processRecordedAudio: Processing recorded audio...')

            // First, try local speech recognition for navigation commands
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                try {
                    console.log('🎤 processRecordedAudio: Attempting local speech recognition first...')
                    const localTranscript = await performLocalSpeechRecognition(audioBlob)

                    if (localTranscript) {
                        console.log('🎤 processRecordedAudio: Local transcript:', localTranscript)
                        setLastTranscription(localTranscript)
                        onTranscript(`\nYou: ${localTranscript}`)

                        // Check if this is a navigation command
                        const isNavigationCommand = handleNavigationCommand(localTranscript)

                        if (isNavigationCommand) {
                            console.log('🎤 processRecordedAudio: Navigation command handled locally, not sending to OpenAI')
                            setDebugInfo('🧭 Navigation command processed locally')
                            return // Don't send to OpenAI
                        }
                    }
                } catch (localError) {
                    console.log('🎤 processRecordedAudio: Local speech recognition failed, falling back to OpenAI:', localError)
                }
            }

            // Convert WebM/Opus audio to PCM16 format for OpenAI Realtime API
            console.log('🎤 processRecordedAudio: Converting audio to PCM16 format...')
            const pcm16Audio = await convertToPCM16(audioBlob)
            const base64Audio = btoa(String.fromCharCode(...pcm16Audio))

            // Send audio via WebSocket to OpenAI
            if (wsConnection && isWebSocketConnected && sessionReady && sessionId) {
                console.log('🎤 processRecordedAudio: Sending PCM16 audio via WebSocket...')
                wsConnection.send(JSON.stringify({
                    type: 'input_audio_buffer.append',
                    audio: base64Audio
                }))
                setDebugInfo('🎤 PCM16 audio sent to OpenAI via WebSocket')
            } else if (!sessionReady || !sessionId) {
                console.log('🎤 processRecordedAudio: Session not ready yet, audio will be queued')
                setDebugInfo('⏳ Session not ready, audio will be processed when ready')
            } else {
                console.log('🎤 processRecordedAudio: WebSocket not connected')
                setDebugInfo('❌ WebSocket not connected')
            }

        } catch (error) {
            console.error('🎤 processRecordedAudio: Failed to process audio:', error)
            setDebugInfo('❌ Failed to process audio')
        }
    }

    // Start recording with existing session (without creating new connection)
    const startRecordingWithExistingSession = useCallback(async () => {
        try {
            console.log('🎤 startRecordingWithExistingSession: Starting recording with existing session...')

            if (!wsConnection || !sessionReady || !sessionId) {
                console.log('🎤 startRecordingWithExistingSession: Session not ready or connection not available')
                setDebugInfo('❌ Session not ready for recording')
                return
            }

            // Initialize media recorder if not already done
            if (!mediaRecorderRef.current) {
                console.log('🎤 startRecordingWithExistingSession: Initializing media recorder...')
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                mediaRecorderRef.current = new MediaRecorder(stream, {
                    mimeType: 'audio/webm;codecs=opus'
                })

                // Store audio chunks
                const audioChunks: Blob[] = []

                mediaRecorderRef.current.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        audioChunks.push(event.data)
                    }
                }

                mediaRecorderRef.current.onstop = async () => {
                    console.log('🎤 startRecordingWithExistingSession: Recording stopped, processing audio...')
                    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
                    await processRecordedAudio(audioBlob)
                    audioChunks.length = 0 // Clear chunks
                }
            }

            // Start recording
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
                console.log('🎤 startRecordingWithExistingSession: Starting recording...')
                mediaRecorderRef.current.start(100) // Record in 100ms chunks
                setIsListening(true)
                setDebugInfo('🎤 Recording... Speak now!')
            }

        } catch (error) {
            console.error('🎤 startRecordingWithExistingSession: Failed to start recording:', error)
            setDebugInfo('❌ Failed to start recording')
        }
    }, [wsConnection, sessionReady, sessionId, processRecordedAudio])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop()
            }
            if (wsConnection) {
                wsConnection.close()
            }
        }
    }, [wsConnection])

    return (
        <div className="space-y-4">
            {/* Connection Setup */}
            {!isWebSocketConnected ? (
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                        <AudioLines className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-foreground mb-2">Connect to Voice Assistant</h3>
                        <p className="text-xs text-muted-foreground mb-4">
                            Start voice conversations with AI-powered navigation and chat
                        </p>
                    </div>
                    <Button
                        onClick={connectToWebSocketServer}
                        className="bg-primary hover:bg-primary/90 text-white"
                    >
                        <AudioLines className="w-4 h-4 mr-2" />
                        Connect Now
                    </Button>
                </div>
            ) : (
                <>
                    {/* Voice Input Controls */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            {/* Voice Settings */}
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

                            {/* Voice Recording Button */}
                            <Button
                                onClick={() => {
                                    console.log('🎤 Button clicked: Start Recording')
                                    if (sessionReady && sessionId) {
                                        startRecordingWithExistingSession()
                                    } else {
                                        startVoiceChat()
                                    }
                                }}
                                disabled={isListening || isCreatingSession}
                                className={`flex-1 py-3 rounded-lg font-medium transition-all duration-200 ${isListening
                                    ? 'bg-red-500 hover:bg-red-600 animate-pulse text-white'
                                    : 'bg-primary hover:bg-primary/90 text-white'
                                    } disabled:bg-muted disabled:cursor-not-allowed disabled:text-muted-foreground`}
                            >
                                {isListening ? (
                                    <>
                                        <MicOff className="w-4 h-4 mr-2" />
                                        Stop Recording
                                    </>
                                ) : isCreatingSession ? (
                                    <>
                                        <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Connecting...
                                    </>
                                ) : sessionReady ? (
                                    <>
                                        <Mic className="w-4 h-4 mr-2" />
                                        Start Recording
                                    </>
                                ) : (
                                    <>
                                        <AudioLines className="w-4 h-4 mr-2" />
                                        Create Session
                                    </>
                                )}
                            </Button>

                            {/* Stop Button (when recording) */}
                            {isListening && (
                                <Button
                                    onClick={() => {
                                        console.log('🎤 Button clicked: Stop & Process')
                                        stopVoiceChat()
                                    }}
                                    variant="destructive"
                                    size="icon"
                                    className="flex-shrink-0"
                                >
                                    <MicOff className="w-4 h-4" />
                                </Button>
                            )}
                        </div>

                        {/* Status Display */}
                        <div className="text-center">
                            <div className={`text-sm font-medium ${isListening ? 'text-primary' : 'text-muted-foreground'}`}>
                                {isListening
                                    ? '🎙️ Listening... Speak clearly'
                                    : isCreatingSession
                                        ? '⏳ Connecting to voice assistant...'
                                        : '🎤 Click to start voice recording'
                                }
                            </div>
                            {debugInfo && (
                                <div className="text-xs text-muted-foreground mt-1">
                                    {debugInfo}
                                </div>
                            )}
                            {lastTranscription && (
                                <div className="text-xs bg-muted p-2 rounded mt-2">
                                    <strong>Last Transcription:</strong> "{lastTranscription}"
                                </div>
                            )}
                        </div>

                        {/* Voice Navigation Commands */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-muted rounded-lg p-2 text-center">
                                <strong>"Profile"</strong> - Opens profile
                            </div>
                            <div className="bg-muted rounded-lg p-2 text-center">
                                <strong>"Scan"</strong> - Opens scanner
                            </div>
                            <div className="bg-muted rounded-lg p-2 text-center">
                                <strong>"Home"</strong> - Goes home
                            </div>
                            <div className="bg-muted rounded-lg p-2 text-center">
                                <strong>"Help"</strong> - Opens help
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
