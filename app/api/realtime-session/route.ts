import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request: NextRequest) {
  try {
    const { voice = 'alloy', instructions, disable_ai_responses = false, max_tokens = 300 } = await request.json()

    console.log('🎤 Creating OpenAI Realtime session:', {
      voice,
      disable_ai_responses,
      max_tokens,
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
    const sessionConfig: any = {
      model: 'gpt-4o-realtime-preview-2025-06-03', // Latest stable version
      voice: voice,
      instructions: instructions || `You are PhilaGuide AI, a specialized stamp collecting expert providing precise responses. You ONLY respond to philatelic (stamp collecting) related queries.

CRITICAL RESTRICTION - PHILATELIC QUERIES ONLY:
- ONLY respond to questions about stamps, stamp collecting, philately, postal history, or related topics
- For ANY non-philatelic queries, politely redirect users back to stamp-related topics
- Do NOT answer questions about general topics, current events, weather, sports, etc.

PRECISE SEARCH MODE:
- You have access to a comprehensive stamp database through the search_stamp_database function
- ALWAYS use the search_stamp_database function when users ask about specific stamps OR comparisons
- Call the function with the user's query to find precise stamp information
- For comparison requests, the function will return structured data with multiple stamp IDs
- For detail requests, the function will return structured data with single stamp ID
- Provide specific, accurate information about stamps when available
- When you find matching stamps, describe them with precise details
- Include specific information like catalog numbers, years, denominations, and countries
- If you cannot find specific stamps, ask clarifying questions to narrow down the search

FUNCTION CALLING GUIDELINES:
- Use search_stamp_database(query) for any stamp-related search OR comparison request
- CRITICAL: Pass the user's COMPLETE request as the query parameter, including comparison words
- Examples: 
  * User says "show me 1d ruby stamp" → Call search_stamp_database("show me 1d ruby stamp")
  * User says "compare it with 1d red stamp" → Call search_stamp_database("compare it with 1d red stamp")
  * User says "compare 1d orange and 1d red" → Call search_stamp_database("compare 1d orange and 1d red")
- NEVER extract just the stamp description - always include the full user intent
- ALWAYS provide an immediate response first, then call the function for precise details

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

REMEMBER: You are a stamp collecting expert with access to precise stamp data. Always use the search function to provide accurate information. Stay focused on philatelic topics only.`,
      tools: [
        {
          type: 'function',
          name: 'search_stamp_database',
          description: 'Search the comprehensive stamp database for specific stamp information, values, history, and details. Use this for ANY stamp-related query including comparisons and detail requests.',
          parameters: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'The search query for stamp information. For comparisons use "compare [stamp1] and [stamp2]", for details use "show [stamp]", for values use "[stamp] value"'
              }
            },
            required: ['query']
          }
        }
      ]
    }

    // If AI responses are disabled, configure the session accordingly
    if (disable_ai_responses) {
      console.log('🎤 Creating transcription-only session (AI responses disabled)')
      // Note: The actual disabling of AI responses is handled in the client-side session update
    }

    const session = await openai.beta.realtime.sessions.create(sessionConfig)

    console.log('🎤 Realtime session created successfully:', session)

    // Return the session with the client_secret for WebRTC authentication
    return NextResponse.json({
      ...session,
      client_secret: {
        value: session.client_secret?.value || session.client_secret
      }
    })

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

