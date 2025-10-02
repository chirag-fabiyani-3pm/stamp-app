import { NextRequest, NextResponse } from 'next/server'

// Function call handler for realtime API
export async function POST(request: NextRequest) {
    try {
        const { function_name, parameters, sessionId } = await request.json()

        console.log('🎤 Function call received:', {
            function_name,
            parameters,
            sessionId
        })

        if (function_name === 'search_stamp_database') {
            const { query } = parameters

            if (!query) {
                return NextResponse.json({
                    success: false,
                    error: 'Query parameter is required'
                }, { status: 400 })
            }

            console.log('🔍 Processing stamp database search:', query)

            // Call our enhanced voice vector search API
            const vectorSearchResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/voice-vector-search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    transcript: query,
                    sessionId: sessionId || `realtime-${Date.now()}`,
                    mode: 'precise'
                })
            })

            if (!vectorSearchResponse.ok) {
                throw new Error(`Vector search failed: ${vectorSearchResponse.status}`)
            }

            const vectorData = await vectorSearchResponse.json()

            console.log('🔍 Vector search result:', {
                success: vectorData.success,
                structured: vectorData.structured,
                contentLength: vectorData.content?.length
            })

            if (vectorData.success) {
                // Return the structured data for navigation
                return NextResponse.json({
                    success: true,
                    content: vectorData.content,
                    structured: vectorData.structured,
                    message: 'Search completed successfully'
                })
            } else {
                return NextResponse.json({
                    success: false,
                    error: vectorData.error || 'Search failed',
                    message: 'Sorry, I encountered an error while searching our stamp database.'
                })
            }
        }

        return NextResponse.json({
            success: false,
            error: 'Unknown function',
            message: 'Sorry, I don\'t know how to handle that request.'
        })

    } catch (error) {
        console.error('❌ Function call handler error:', error)
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            message: 'Sorry, I encountered an error processing your request.'
        }, { status: 500 })
    }
}

