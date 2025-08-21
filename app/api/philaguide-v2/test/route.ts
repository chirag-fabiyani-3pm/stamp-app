import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function GET() {
    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        })

        // Test basic Responses API connection
        const response = await openai.responses.create({
            model: 'gpt-4o',
            input: 'Hello, can you tell me about stamp collecting?'
        })

        return NextResponse.json({
            success: true,
            message: 'Responses API connection successful!',
            responseId: response.id,
            outputText: response.output_text
        })

    } catch (error) {
        console.error('❌ Responses API test failed:', error)
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            details: error
        }, { status: 500 })
    }
}
