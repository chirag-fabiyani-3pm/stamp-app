import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export const maxDuration = 30
export const dynamic = 'force-dynamic'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

const VECTOR_STORE_ID = 'vs_687f86f65d84819182d812c5184813a5'

// Session management for context - maps sessionId to previousResponseId
const activeSessions = new Map<string, string>()

// Request deduplication - prevent multiple identical requests
const activeRequests = new Map<string, Promise<any>>() // requestKey -> Promise

export async function POST(request: NextRequest) {
    let requestKey: string | undefined

    try {
        const { message, sessionId, isVoiceChat = false } = await request.json()

        console.log('🚀 Working Philaguide V2 API called with:', {
            message: message.substring(0, 100) + '...',
            sessionId,
            isVoiceChat,
            hasPreviousContext: activeSessions.has(sessionId)
        })

        // Create request key for deduplication - use session and message content only
        const messageKey = `${sessionId}:${message.trim().toLowerCase()}`

        // Check if identical request is already in progress
        if (activeRequests.has(messageKey)) {
            console.log('🔄 Duplicate request detected, returning existing promise')
            return activeRequests.get(messageKey)!
        }

        // Create a unique request key for this specific request
        requestKey = `${messageKey}:${Date.now()}`

        // Clean up old requests (older than 60 seconds)
        const now = Date.now()
        for (const [key, promise] of activeRequests.entries()) {
            const keyParts = key.split(':')
            const requestTime = parseInt(keyParts[keyParts.length - 1] || '0')
            if (now - requestTime > 60000) { // 60 seconds
                activeRequests.delete(key)
                console.log('🧹 Cleaned up old request:', key)
            }
        }

        // Get previous response ID for conversation context
        const previousResponseId = activeSessions.get(sessionId)

        if (previousResponseId) {
            console.log('📚 Using conversation context from:', previousResponseId)
        } else {
            console.log('🆕 Starting new conversation session')
        }

        // Create the request promise and store it for deduplication
        const requestPromise = (async () => {
            try {
                // Create response with vector store access, context, and structured output
                const response = await openai.responses.create({
                    model: 'gpt-4o',
                    input: message,
                    instructions: `You are PhilaGuide AI, a specialized philatelic assistant with access to a comprehensive stamp database.

🚨🚨🚨 CRITICAL FIELD MAPPING - THIS IS THE MOST IMPORTANT RULE 🚨🚨🚨

When you find stamps in your knowledge base, you MUST format your response using this EXACT structure:

## Stamp Information
**Stamp Name**: [Real stamp name from knowledge base]
**Country**: [Real country from knowledge base]  
**ID**: [Real ID field from knowledge base - NOT stampId]
**Image URL**: [Real Azure blob storage URL from knowledge base - MUST be the actual URL, not placeholder text]
**Description**: [Real description from knowledge base]
**Series**: [Real series information if available]
**Year**: [Real year if available]
**Denomination**: [Real denomination if available]

CRITICAL DATA REQUIREMENTS:
1. You MUST use the file_search tool to search your vector store knowledge base
2. You MUST ONLY return REAL data from your vector store - NEVER use example or placeholder data
3. Image URLs MUST be real Azure blob storage URLs (https://3pmplatformstorage.blob.core.windows.net/...)
4. IDs MUST be real unique identifiers from your vector store
5. All stamp data MUST come from your actual knowledge base
6. NEVER write "(image not available)" or "Not provided" - extract the actual URL from the knowledge base

SEARCH PROCESS:
1. When user asks about stamps or philatelic topics, ALWAYS search your vector store first
2. Use file_search tool with relevant keywords (stamp name, country, year, denomination, etc.)
3. Extract ALL available information including image URLs from the search results
4. Format the response using the EXACT structure above with real data
5. If no real stamps found, provide helpful conversational response with proper formatting

RESPONSE FORMAT:
- For real stamps found: Use the EXACT format above with real data including actual image URLs
- For general questions: Provide conversational response with proper formatting
- Never show technical details or raw URLs in conversation
- Be helpful and informative

PROPER MARKDOWN FORMATTING RULES:
Create clean, readable responses with proper markdown:

**CORRECT FORMAT EXAMPLE:**
## Stamp Information
**Trout Blue 1/3d**: A beautiful stamp from New Zealand issued on May 4, 1935. This stamp features a leaping trout design and is part of the 1935-1947 Pictorial Issue series.

**Key Information:**
- Country: New Zealand
- Issue Date: May 4, 1935
- Denomination: 1/3d
- Color: Blue
- Series: 1935-1947 Pictorial Issue

**WRONG FORMAT (NEVER USE):**
- Raw knowledge base output with dashes and labels
- Technical data or URLs in conversation
- Example data or placeholder information
- "(image not available)" or "Not provided" - extract the actual data

**REMEMBER:**
1. ALWAYS search vector store before responding
2. ONLY return REAL data from your knowledge base
3. Use the EXACT format above for stamp information
4. NEVER invent or make up stamp details
5. ALWAYS extract actual image URLs from the knowledge base`,
                    tools: [
                        { type: 'file_search', vector_store_ids: [VECTOR_STORE_ID] },
                        { type: 'web_search_preview' }
                    ],
                    // Add conversation context if available
                    ...(previousResponseId && { previous_response_id: previousResponseId })
                })

                const result = {
                    success: true,
                    responseId: response.id,
                    content: response.output_text,
                    source: 'knowledge_base',
                    message: 'Response generated successfully!',
                    hasContext: !!previousResponseId
                }

                // Store the new response ID for future context
                activeSessions.set(sessionId, response.id)
                console.log('💾 Stored conversation context:', response.id)

                return result
            } catch (error) {
                // Clean up the request from active requests on error
                activeRequests.delete(messageKey)
                throw error
            }
        })()

        // Store the request promise for deduplication
        activeRequests.set(messageKey, requestPromise)

        // Wait for the request to complete
        const result = await requestPromise

        // Clean up the request from active requests
        activeRequests.delete(messageKey)

        return NextResponse.json(result)
    } catch (error) {
        // Clean up the request from active requests on error
        if (requestKey) {
            activeRequests.delete(requestKey)
        }

        console.error('❌ Error in Working Philaguide V2 API:', error)
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            details: error
        }, { status: 500 })
    }
}

// Optional: Add a GET endpoint to check session status
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (sessionId) {
        const hasContext = activeSessions.has(sessionId)
        return NextResponse.json({
            sessionId,
            hasContext,
            previousResponseId: activeSessions.get(sessionId) || null
        })
    }

    return NextResponse.json({
        totalSessions: activeSessions.size,
        sessions: Array.from(activeSessions.keys())
    })
}
