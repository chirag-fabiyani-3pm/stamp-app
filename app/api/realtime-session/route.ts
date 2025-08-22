import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request: NextRequest) {
  try {
    const { voice = 'alloy', instructions } = await request.json()

    console.log('🎤 Creating OpenAI Realtime session:', {
      voice,
      instructions: instructions ? instructions.substring(0, 100) + '...' : 'Default instructions'
    })

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Create a Realtime session with the correct model name
    // Based on working examples, we use the specific model version
    const session = await openai.beta.realtime.sessions.create({
      model: 'gpt-4o-realtime-preview-2024-12-17', // Use the correct model name
      voice: voice,
      instructions: instructions || `You are a knowledgeable stamp collecting expert and navigation assistant.

CRITICAL: Always respond in the SAME LANGUAGE the user speaks. Detect the user's spoken language from their audio and match it exactly. If the language is unclear, respond in English by default.

You help with:
1. Stamp collecting (philatelly) questions, history, and values
2. App navigation and features
3. General philatelic knowledge

Keep responses concise, helpful, and always in the user's language. Respond naturally to user voice input.

IMPORTANT: This is a continuous conversation session. Users can interrupt you at any time by speaking, and you should stop and listen to them.`
    })

    console.log('🎤 Realtime session created successfully:', session)

    return NextResponse.json(session)

  } catch (error) {
    console.error('🎤 Error creating Realtime session:', error)

    return NextResponse.json(
      {
        error: 'Failed to create Realtime session',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

