import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request: NextRequest) {
    try {
        const { message, conversationHistory = [], sessionId, voice = 'alloy' } = await request.json()

        console.log('🎤 Realtime voice chat request:', {
            message: message ? message.substring(0, 50) + '...' : 'No message',
            historyLength: conversationHistory.length,
            sessionId,
            voice
        })

        // If no message provided, return error
        if (!message) {
            return NextResponse.json({
                success: false,
                error: 'No message provided'
            }, { status: 400 })
        }

        // Prepare conversation context
        const messages = [
            {
                role: 'system',
                content: `You are a knowledgeable stamp collecting expert specializing in conversational responses for voice synthesis. 

IMPORTANT GUIDELINES:
- Provide natural, conversational responses suitable for speech
- Use clear, descriptive language
- Avoid abbreviations and technical jargon
- Use complete sentences and natural speech patterns
- Be informative but friendly and engaging
- When describing stamps, include details like country, year, denomination, color, and interesting facts
- Use natural language for denominations (e.g., "one-third penny" instead of "1/3d")
- Focus on descriptive, engaging content that sounds natural when spoken
- Maintain conversation context from previous messages
- Reference previous topics when relevant to show continuity
- Keep responses concise but informative (2-3 sentences max for voice)
- Always respond in a natural, conversational manner suitable for voice synthesis`
            },
            ...conversationHistory,
            { role: 'user', content: message }
        ]

        // Get AI response using regular chat completion
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: messages,
            max_tokens: 150,
            temperature: 0.7
        })

        const aiResponse = completion.choices[0]?.message?.content || 'I apologize, but I cannot provide a response at the moment.'

        console.log('🎤 AI response generated:', aiResponse.substring(0, 50) + '...')

        // Return the AI response
        return NextResponse.json({
            success: true,
            response: aiResponse,
            sessionId: sessionId || `session_${Date.now()}`
        })

    } catch (error) {
        console.error('❌ Realtime voice API error:', error)
        return NextResponse.json({
            success: false,
            error: 'Failed to process voice message',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}
