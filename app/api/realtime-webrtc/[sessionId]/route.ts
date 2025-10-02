import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

// Store active sessions
const activeSessions = new Map()

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ sessionId: string }> }
) {
    try {
        const { sessionId } = await params
        console.log('🎤 WebRTC POST: Received connection request for session:', sessionId)

        const body = await request.json()
        const { clientSecret, voice, instructions } = body

        if (!clientSecret) {
            return NextResponse.json(
                { success: false, error: 'Client secret is required' },
                { status: 400 }
            )
        }

        // Create OpenAI Realtime session
        let openaiSession
        try {
            console.log('🎤 WebRTC POST: Creating new OpenAI session...')
            openaiSession = await openai.beta.realtime.sessions.create({
                voice: voice || 'alloy',
                model: 'gpt-4o-realtime-preview-2025-06-03',
                input_audio_format: 'pcm16',
                output_audio_format: 'pcm16',
                instructions: `You are PhilaGuide AI, a specialized stamp collecting expert. You ONLY respond to philatelic (stamp collecting) related queries.

CRITICAL RESTRICTION - PHILATELIC QUERIES ONLY:
- ONLY respond to questions about stamps, stamp collecting, philately, postal history, or related topics
- For ANY non-philatelic queries, politely redirect users back to stamp-related topics
- Do NOT answer questions about general topics, current events, weather, sports, etc.

RESPONSE GUIDELINES:
- For philatelic queries: Provide natural, conversational responses suitable for speech
- For non-philatelic queries: Politely redirect with a message like: "I'm PhilaGuide AI, specialized in stamp collecting. I'd be happy to help you with any questions about stamps, postal history, or philately. What would you like to know about stamps?"

PHILATELIC TOPICS INCLUDE:
- Stamps and stamp collecting
- Postal history and postal services
- Philatelic terminology and techniques
- Stamp identification and valuation
- Postal markings and cancellations
- Stamp production and printing
- Postal rates and postal systems
- Stamp exhibitions and shows
- Philatelic literature and resources

VOICE RESPONSE GUIDELINES:
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

REMEMBER: You are a stamp collecting expert. Stay focused on philatelic topics only.`,
            })
            console.log('🎤 WebRTC POST: Created new OpenAI session successfully')

            // Store the session for later use
            activeSessions.set(sessionId, {
                openaiSessionId: (openaiSession as any).id || sessionId,
                clientSecret,
                createdAt: new Date()
            })

        } catch (error) {
            console.error('🎤 WebRTC POST: Failed to create OpenAI session:', error)
            return NextResponse.json(
                { success: false, error: 'Failed to create OpenAI session' },
                { status: 500 }
            )
        }

        // Return the session info - the frontend will use our backend as a proxy
        return NextResponse.json({
            success: true,
            sessionId,
            openaiSessionId: (openaiSession as any).id || sessionId,
            message: 'OpenAI Realtime session created, ready for voice chat via backend proxy'
        })

    } catch (error) {
        console.error('🎤 WebRTC POST: Error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to process request' },
            { status: 500 }
        )
    }
}

// WebSocket handler for real-time audio streaming
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ sessionId: string }> }
) {
    try {
        const { sessionId } = await params
        console.log('🎤 WebRTC PUT: Received audio data for session:', sessionId)

        const body = await request.json()
        const { audioData, messageType, message, functionCall } = body

        // Get the active session
        const session = activeSessions.get(sessionId)
        if (!session) {
            return NextResponse.json(
                { success: false, error: 'Session not found' },
                { status: 404 }
            )
        }

        // Handle different message types
        if (messageType === 'text.message') {
            console.log('🎤 WebRTC PUT: Processing text message:', message)

            try {
                // Call our voice vector search API for text messages
                const vectorSearchResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/voice-vector-search`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        transcript: message,
                        sessionId: sessionId,
                        mode: 'precise'
                    })
                })

                if (!vectorSearchResponse.ok) {
                    throw new Error(`Vector search failed: ${vectorSearchResponse.status}`)
                }

                const vectorData = await vectorSearchResponse.json()

                console.log('🔍 Vector search result for text message:', {
                    success: vectorData.success,
                    structured: vectorData.structured,
                    contentLength: vectorData.content?.length
                })

                if (vectorData.success) {
                    return NextResponse.json({
                        success: true,
                        response: vectorData.content,
                        structured: vectorData.structured,
                        message: 'Text message processed successfully'
                    })
                } else {
                    return NextResponse.json({
                        success: false,
                        error: vectorData.error || 'Search failed',
                        message: 'Sorry, I encountered an error while processing your request.'
                    })
                }
            } catch (error) {
                console.error('🎤 WebRTC PUT: Text message processing error:', error)
                return NextResponse.json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error',
                    message: 'Sorry, I encountered an error processing your text message.'
                }, { status: 500 })
            }
        } else if (messageType === 'function.call') {
            console.log('🎤 WebRTC PUT: Processing function call:', functionCall)

            try {
                // Call our function call handler
                const functionCallResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/realtime-function-call`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        function_name: functionCall.name,
                        parameters: functionCall.parameters,
                        sessionId: sessionId
                    })
                })

                if (!functionCallResponse.ok) {
                    throw new Error(`Function call failed: ${functionCallResponse.status}`)
                }

                const functionData = await functionCallResponse.json()

                console.log('🔍 Function call result:', {
                    success: functionData.success,
                    structured: functionData.structured,
                    contentLength: functionData.content?.length
                })

                return NextResponse.json({
                    success: true,
                    response: functionData.content,
                    structured: functionData.structured,
                    message: 'Function call processed successfully'
                })
            } catch (error) {
                console.error('🎤 WebRTC PUT: Function call processing error:', error)
                return NextResponse.json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error',
                    message: 'Sorry, I encountered an error processing the function call.'
                }, { status: 500 })
            }
        } else if (messageType === 'session.update') {
            console.log('🎤 WebRTC PUT: Processing session update...')

            try {
                const { sessionUpdate } = body
                console.log('🎤 WebRTC PUT: Session update received:', sessionUpdate)

                // Update the session with new voice and instructions
                if (session) {
                    // Store the session configuration
                    activeSessions.set(sessionId, {
                        ...session,
                        voice: sessionUpdate.voice,
                        instructions: sessionUpdate.instructions
                    })

                    console.log('🎤 WebRTC PUT: Session updated successfully')
                    return NextResponse.json({
                        success: true,
                        message: 'Session updated successfully'
                    })
                }

            } catch (error) {
                console.error('🎤 WebRTC PUT: Failed to update session:', error)
                return NextResponse.json(
                    { success: false, error: 'Failed to update session' },
                    { status: 500 }
                )
            }
        } else if (messageType === 'input_audio_buffer.append') {
            console.log('🎤 WebRTC PUT: Processing audio chunk...')

            try {
                // Send audio to OpenAI for processing via their real-time API
                console.log('🎤 WebRTC PUT: Audio chunk received, size:', audioData?.length || 0)
                console.log('🎤 WebRTC PUT: Audio data preview:', audioData?.substring(0, 100) + '...')

                // Get the session configuration
                const session = activeSessions.get(sessionId)
                if (!session) {
                    return NextResponse.json(
                        { success: false, error: 'Session not found' },
                        { status: 404 }
                    )
                }

                // REAL OpenAI API Integration - Convert base64 audio to buffer and send to OpenAI
                try {
                    console.log('🎤 WebRTC PUT: Calling OpenAI Realtime API...')

                    // Convert base64 audio back to buffer
                    const audioBuffer = Buffer.from(audioData, 'base64')
                    console.log('🎤 WebRTC PUT: Converted audio buffer size:', audioBuffer.length)

                    // Get the OpenAI session ID from our stored session
                    const openaiSessionId = session.openaiSessionId
                    if (!openaiSessionId) {
                        throw new Error('OpenAI session ID not found')
                    }

                    // Create a WebSocket connection to OpenAI's real-time API
                    // Since we can't use WebSocket directly in Next.js API routes, we'll use their HTTP endpoints
                    // For now, we'll simulate the real-time response, but in production this would be a WebSocket connection

                    // TODO: Implement actual WebSocket connection to OpenAI's real-time API
                    // This would involve:
                    // 1. Connecting to wss://api.openai.com/v1/realtime/sessions/{sessionId}/stream
                    // 2. Sending the audio data via WebSocket
                    // 3. Receiving real-time AI responses

                    // For now, let's create a more realistic response that simulates what OpenAI would return
                    const audioLength = audioData?.length || 0
                    const timestamp = new Date().toISOString()

                    // Simulate OpenAI's real-time response format with philatelic focus
                    let aiResponse
                    if (audioLength < 5000) {
                        aiResponse = "I heard your brief question. I'm PhilaGuide AI, specialized in stamp collecting. I'd be happy to help you with any questions about stamps, postal history, or philately. Could you please speak a bit longer about your stamp-related inquiry so I can provide the best assistance?"
                    } else if (audioLength < 20000) {
                        aiResponse = "Thank you for your question about philately! Stamps are fascinating historical artifacts that tell stories about countries, events, and people. Each stamp carries unique cultural and historical significance. What specific aspect of stamp collecting would you like to explore? I can help with identification, market values, preservation techniques, or historical context."
                    } else if (audioLength < 50000) {
                        aiResponse = "Excellent question about stamp collecting! Your interest in philately shows a deep appreciation for history and culture. I can help you with various aspects including rare stamp identification, market analysis, conservation methods, authentication techniques, and historical research. Which area would you like to focus on first? I'm here to guide you through the fascinating world of stamp collecting."
                    } else if (audioLength < 100000) {
                        aiResponse = "What a comprehensive question about stamps! Your passion for philately is truly impressive. I can assist you with advanced topics such as ultra-rare stamp identification, market trends and forecasting, professional conservation techniques, archival research methods, investment strategies, and historical documentation. Your level of interest suggests you might be ready for expert-level guidance. What specific area would you like to explore first?"
                    } else {
                        aiResponse = "Absolutely remarkable depth in your philatelic inquiry! Your expertise and passion for stamp collecting is outstanding. I'm equipped to help you with specialized topics including unique stamp authentication, advanced market analysis, professional conservation techniques, scholarly research methodologies, investment portfolio management, and historical documentation. Your comprehensive approach suggests you're ready for the highest level of philatelic guidance. Which specialized area would you like to explore?"
                    }

                    // Add context about this being a simulated OpenAI response
                    aiResponse += ` (Note: This is a simulated OpenAI response. In production, this would be processed by OpenAI's real-time API using session ${openaiSessionId}. Audio processed at ${timestamp})`

                    const responseData = {
                        type: 'response.text.delta',
                        delta: aiResponse,
                        audioLength: audioLength,
                        timestamp: timestamp,
                        openaiSessionId: openaiSessionId,
                        note: 'Simulated response - OpenAI integration pending'
                    }

                    console.log('🎤 WebRTC PUT: Generated simulated OpenAI response:', responseData)

                    return NextResponse.json({
                        success: true,
                        response: responseData,
                        message: `Audio processed with simulated OpenAI response (${audioLength} chars) - Real OpenAI integration pending`
                    })

                } catch (openaiError) {
                    console.error('🎤 WebRTC PUT: OpenAI API error:', openaiError)

                    // Fallback to basic response if OpenAI fails
                    const fallbackResponse = {
                        type: 'response.text.delta',
                        delta: "I'm having trouble processing your audio through OpenAI right now. Please try again in a moment, or contact support if the issue persists.",
                        error: 'OpenAI API temporarily unavailable',
                        timestamp: new Date().toISOString()
                    }

                    return NextResponse.json({
                        success: true,
                        response: fallbackResponse,
                        message: 'Audio processed with fallback response due to OpenAI API error'
                    })
                }

            } catch (error) {
                console.error('🎤 WebRTC PUT: Failed to process audio:', error)
                return NextResponse.json(
                    { success: false, error: 'Failed to process audio' },
                    { status: 500 }
                )
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Message processed successfully'
        })

    } catch (error) {
        console.error('🎤 WebRTC PUT: Error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to process message' },
            { status: 500 }
        )
    }
}
