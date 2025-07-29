import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

console.log('OPENAI_API_KEY (philaguide): ', process.env.OPENAI_API_KEY)
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

const ASSISTANT_ID = 'asst_AfsiDbpnx2WjgZV7O97eHhyb'

// Generate card format for single stamp
function generateStampCard(stamp: any) {
    // Map the vector store fields to card display format
    const year = stamp.IssueYear || (stamp.IssueDate ? stamp.IssueDate.split('-')[0] : 'Unknown')
    const denomination = `${stamp.DenominationValue}${stamp.DenominationSymbol}`
    const subtitle = `${stamp.Country} • ${year} • ${denomination}`

    // Handle different possible image URL field names
    const imageUrl = stamp.StampImageUrl || stamp.image || stamp.StampImage || '/images/stamps/no-image-available.png'

    return {
        type: 'card',
        id: stamp.Id || stamp.id,
        title: stamp.Name || stamp.StampCatalogCode || 'Stamp',
        subtitle: subtitle,
        image: imageUrl,
        content: [
            {
                section: 'Overview',
                text: `${stamp.Name} from ${stamp.Country}, issued in ${year}. Denomination: ${denomination}. Color: ${stamp.Color || 'Unknown'}.`
            },
            {
                section: 'Details',
                details: [
                    { label: 'Catalog Code', value: stamp.StampCatalogCode || 'N/A' },
                    { label: 'Issue Date', value: stamp.IssueDate || 'N/A' },
                    { label: 'Color', value: stamp.Color || 'N/A' },
                    { label: 'Paper Type', value: stamp.PaperType || 'N/A' }
                ]
            }
        ],
        significance: `A ${stamp.Color || 'colorful'} stamp from ${stamp.Country} issued in ${year}.`,
        specialNotes: stamp.SeriesName ? `Part of the ${stamp.SeriesName} series.` : ''
    }
}

// Generate carousel format for multiple stamps
function generateStampCarousel(stamps: any[]) {
    return {
        type: 'carousel',
        title: `Found ${stamps.length} stamp${stamps.length !== 1 ? 's' : ''}`,
        items: stamps.map(stamp => {
            const year = stamp.IssueYear || (stamp.IssueDate ? stamp.IssueDate.split('-')[0] : 'Unknown')
            const denomination = `${stamp.DenominationValue}${stamp.DenominationSymbol}`

            // Handle different possible image URL field names
            const imageUrl = stamp.StampImageUrl || stamp.image || stamp.StampImage || '/images/stamps/no-image-available.png'

            return {
                id: stamp.Id || stamp.id,
                title: stamp.Name || stamp.StampCatalogCode || 'Stamp',
                subtitle: `${stamp.Country} • ${year}`,
                image: imageUrl,
                summary: `${denomination} ${stamp.Color || 'Unknown'}`,
                marketValue: 'Value varies by condition',
                quickFacts: [
                    `${stamp.Country} ${year}`,
                    stamp.Color || 'Unknown',
                    denomination
                ]
            }
        })
    }
}

// Clean response text to remove technical references
function cleanResponseText(text: string): string {
    // Remove technical references
    let cleaned = text
        .replace(/download\.json/g, 'stamp database')
        .replace(/vector store/g, 'stamp collection')
        .replace(/file_search/g, 'search')
        .replace(/https:\/\/3pmplatformstorage\.blob\.core\.windows\.net\/[^\s\)\]]+/g, '')
        .replace(/ref as [^\s]+/g, '')
        .replace(/catalog number [A-Z0-9]+/gi, '')
        .replace(/Campbell Paterson Catalogue/g, 'stamp catalog')
        .replace(/catalog number/g, 'catalog')

    // Remove markdown syntax and raw data
    cleaned = cleaned
        .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // Remove markdown image syntax
        .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold markdown
        .replace(/`([^`]+)`/g, '$1') // Remove code markdown
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // Remove link markdown
        .replace(/\{[\s\S]*?\}/g, '') // Remove JSON objects
        .replace(/```[\s\S]*?```/g, '') // Remove code blocks

    // Remove any remaining technical jargon
    cleaned = cleaned
        .replace(/technical details[^.]*\./g, '')
        .replace(/file reference[^.]*\./g, '')
        .replace(/database entry[^.]*\./g, '')
        .replace(/raw data[^.]*\./g, '')
        .replace(/function call[^.]*\./g, '')

    // Clean up extra spaces and punctuation
    cleaned = cleaned
        .replace(/\s+/g, ' ')
        .replace(/\s+\./g, '.')
        .replace(/\s+,/g, ',')
        .replace(/\s+-/g, ' - ')
        .trim()

    return cleaned
}

export async function POST(request: NextRequest) {
    try {
        const { message, history = [] } = await request.json()

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 })
        }

        // Use OpenAI Assistant with file-based knowledge
        console.log('Using OpenAI Assistant for:', message)

        // Call the assistant API directly
        let assistantResult
        try {
            // Step 1: First fetch the assistant (like in Flutter)
            const assistant = await openai.beta.assistants.retrieve(ASSISTANT_ID)
            console.log('✅ Assistant fetched:', assistant.id)

            // Step 2: Create a new thread
            console.log('🔄 Creating new thread...')
            const thread = await openai.beta.threads.create()
            console.log('✅ Thread created:', thread)
            console.log('✅ Thread ID:', thread.id)
            console.log('✅ Thread object keys:', Object.keys(thread))

            if (!thread.id) {
                console.error('❌ Thread creation failed - no ID returned')
                console.error('❌ Thread object:', JSON.stringify(thread, null, 2))
                throw new Error('Failed to create thread - no thread ID returned')
            }

            // Step 3: Add the user's message to the thread
            const threadMessage = await openai.beta.threads.messages.create(thread.id, {
                role: 'user',
                content: message
            })
            console.log('✅ Message created:', threadMessage.id)

            // Step 4: Create run with the assistant
            const run = await openai.beta.threads.runs.create(thread.id, {
                assistant_id: assistant.id
            })
            console.log('✅ Run created:', run.id)

            if (!run.id) {
                throw new Error('Failed to create run - no run ID returned')
            }

            // Wait for run to complete with proper status checking
            console.log('⏳ Waiting for run to complete...')
            let runStatus = run.status
            let attempts = 0
            const maxAttempts = 30 // 60 seconds max wait

            while ((runStatus === 'queued' || runStatus === 'in_progress') && attempts < maxAttempts) {
                console.log(`⏳ Run status: ${runStatus} (attempt ${attempts + 1}/${maxAttempts})`)
                await new Promise(resolve => setTimeout(resolve, 2000))

                try {
                    const runResult = await openai.beta.threads.runs.retrieve(run.id, { thread_id: thread.id })
                    runStatus = runResult.status
                    attempts++

                    // Log any errors
                    if (runResult.last_error) {
                        console.error('❌ Run error:', runResult.last_error)
                    }
                } catch (error) {
                    console.error('❌ Error checking run status:', error)
                    break
                }
            }

            console.log(`✅ Run completed with status: ${runStatus}`)

            // Check if run failed
            if (runStatus === 'failed') {
                console.error('❌ Run failed')
                throw new Error('Assistant run failed')
            }

            if (runStatus === 'cancelled') {
                console.error('❌ Run cancelled')
                throw new Error('Assistant run cancelled')
            }

            if (runStatus === 'expired') {
                console.error('❌ Run expired')
                throw new Error('Assistant run expired')
            }

            // Handle requires_action (function calls)
            if (runStatus === 'requires_action') {
                console.log('🔧 Run requires action - handling function calls...')

                const runResult = await openai.beta.threads.runs.retrieve(run.id, { thread_id: thread.id })
                console.log('📊 Run result:', runResult)

                if (runResult.required_action && runResult.required_action.type === 'submit_tool_outputs') {
                    console.log('🔧 Found tool outputs to submit')

                    const toolCalls = runResult.required_action.submit_tool_outputs.tool_calls
                    console.log('🔧 Tool calls found:', toolCalls.length)

                    const toolOutputs = []
                    let stamps = []
                    let structuredData = null

                    for (const toolCall of toolCalls) {
                        console.log('🔧 Processing tool call:', toolCall)
                        if (toolCall.function.name === 'return_stamp_data') {
                            try {
                                const functionArgs = JSON.parse(toolCall.function.arguments)
                                console.log('📊 Function call data:', functionArgs)

                                if (functionArgs.stamps && Array.isArray(functionArgs.stamps)) {
                                    stamps = functionArgs.stamps
                                    structuredData = functionArgs
                                    console.log(`✅ Found ${stamps.length} stamps from function call`)
                                }
                            } catch (error) {
                                console.log('❌ Error parsing function arguments:', error)
                            }
                        }

                        toolOutputs.push({
                            tool_call_id: toolCall.id,
                            output: JSON.stringify({ success: true, stamps: stamps })
                        })
                    }

                    // Create structured data immediately from function call
                    let immediateStructuredData = null
                    if (stamps.length === 1) {
                        console.log('🎴 Creating single stamp card with data:', stamps[0])
                        immediateStructuredData = generateStampCard(stamps[0])
                        console.log('🎴 Generated card data:', immediateStructuredData)
                    } else if (stamps.length > 1) {
                        console.log(`🎠 Creating carousel with ${stamps.length} stamps`)
                        immediateStructuredData = generateStampCarousel(stamps.slice(0, 5))
                        console.log('🎠 Generated carousel data:', immediateStructuredData)
                    }

                    // Return immediately with function call data
                    assistantResult = {
                        response: `I found ${stamps.length} stamp${stamps.length !== 1 ? 's' : ''} for you.`,
                        stampsFound: stamps.length,
                        hasStructuredData: stamps.length > 0,
                        stamps: stamps,
                        structuredData: immediateStructuredData
                    }

                    console.log('📤 Returning immediate result:', assistantResult)
                    return NextResponse.json(assistantResult)
                }
            }

            // Get the messages from the thread
            const messages = await openai.beta.threads.messages.list(thread.id)
            console.log('📨 Messages in thread:', messages.data.length)

            // Get the latest assistant message
            const assistantMessages = messages.data.filter(msg => msg.role === 'assistant')
            console.log('🤖 Assistant messages found:', assistantMessages.length)

            if (assistantMessages.length > 0) {
                const latestAssistantMessage = assistantMessages[0] // Most recent is first
                console.log('📝 Latest assistant message content length:', latestAssistantMessage.content.length)

                if (latestAssistantMessage.content.length > 0) {
                    const content = latestAssistantMessage.content[0]
                    console.log('📄 Content type:', content.type)

                    if (content.type === 'text') {
                        const rawResponse = content.text.value
                        console.log('🤖 Assistant response:', rawResponse)
                        console.log('Response length:', rawResponse.length)
                        console.log('Contains JSON:', rawResponse.includes('{'))
                        console.log('Contains real image URLs:', rawResponse.includes('3pmplatformstorage.blob.core.windows.net'))

                        // Clean the response to remove technical references
                        const response = cleanResponseText(rawResponse)
                        console.log('🧹 Cleaned response:', response)

                        // Check for function calls in the message
                        let stamps = []
                        let structuredData = null
                        let hasFunctionCalls = false

                        // Look for function calls in the message
                        for (const contentItem of latestAssistantMessage.content as any[]) {
                            if (contentItem.type === 'tool_calls') {
                                console.log('🔧 Found function calls in assistant message')
                                console.log('🔧 Tool calls content:', contentItem)
                                hasFunctionCalls = true

                                for (const toolCall of contentItem.tool_calls) {
                                    console.log('🔧 Tool call:', toolCall)
                                    if (toolCall.function.name === 'return_stamp_data') {
                                        try {
                                            const functionArgs = JSON.parse(toolCall.function.arguments)
                                            console.log('📊 Function call data:', functionArgs)

                                            if (functionArgs.stamps && Array.isArray(functionArgs.stamps)) {
                                                stamps = functionArgs.stamps
                                                structuredData = functionArgs
                                                console.log(`✅ Found ${stamps.length} stamps from function call`)
                                            }
                                        } catch (error) {
                                            console.log('❌ Error parsing function arguments:', error)
                                        }
                                    }
                                }
                            }
                        }

                        // If we have function calls, submit the results and get final response
                        if (hasFunctionCalls) {
                            console.log('🔄 Function call detected - displaying data immediately')

                            // Create structured data immediately from function call
                            let immediateStructuredData = null
                            if (stamps.length === 1) {
                                immediateStructuredData = generateStampCard(stamps[0])
                            } else if (stamps.length > 1) {
                                immediateStructuredData = generateStampCarousel(stamps.slice(0, 5))
                            }

                            // Return immediately with function call data
                            assistantResult = {
                                response: `I found ${stamps.length} stamp${stamps.length !== 1 ? 's' : ''} for you.`,
                                stampsFound: stamps.length,
                                hasStructuredData: stamps.length > 0,
                                stamps: stamps,
                                structuredData: immediateStructuredData
                            }

                            // Optionally, you can still submit tool outputs and get conversational response
                            // But for now, let's just return the immediate data
                        } else {
                            // No function calls - this is a generic response, no structured data needed
                            console.log('🔍 No function calls found - this is a generic response')

                            assistantResult = {
                                response: response,
                                stampsFound: 0,
                                hasStructuredData: false,
                                stamps: [],
                                structuredData: null
                            }
                        }
                    } else {
                        console.log('❌ Content is not text type:', content.type)
                    }
                } else {
                    console.log('❌ Assistant message has no content')
                }
            } else {
                console.log('❌ No assistant messages found in thread')
            }

            if (!assistantResult) {
                console.log('❌ No assistant message found')
                assistantResult = {
                    response: 'I apologize, but I encountered an error while processing your request. Please try again in a moment.',
                    stamps: []
                }
            }

        } catch (error) {
            console.error('Assistant API error:', error)
            console.error('Error details:', {
                message: error instanceof Error ? error.message : 'Unknown error',
                status: (error as any)?.status,
                type: (error as any)?.type
            })
            assistantResult = {
                response: 'I apologize, but I encountered an error while processing your request. Please try again in a moment.',
                stamps: []
            }
        }

        let foundStamps: any[] = []
        let aiResponse = assistantResult.response

        console.log('Assistant result:', {
            response: assistantResult.response,
            stampsFound: assistantResult.stamps?.length || 0,
            hasStructuredData: !!assistantResult.structuredData
        })

        // Use assistant results - even if no structured data, use the response
        if (assistantResult.stamps && assistantResult.stamps.length > 0) {
            console.log(`Assistant found ${assistantResult.stamps.length} stamps`)
            foundStamps = assistantResult.stamps

            // Use the full assistant response for conversational display
            aiResponse = assistantResult.response
        } else {
            console.log('No structured data found, but using assistant response')
            aiResponse = assistantResult.response || "I couldn't find specific stamps matching your query in my database. Try searching for different terms or ask about general philatelic topics."
        }

        // Generate structured data for UI display ONLY if we have stamps from function calls
        let structuredData = null
        if (foundStamps.length === 1) {
            console.log('🎴 Generating single stamp card with data:', foundStamps[0])
            structuredData = generateStampCard(foundStamps[0])
            console.log('🎴 Generated card data:', structuredData)
        } else if (foundStamps.length > 1) {
            console.log(`🎠 Generating carousel with ${foundStamps.length} stamps`)
            structuredData = generateStampCarousel(foundStamps.slice(0, 5)) // Limit to 5 stamps in carousel
            console.log('🎠 Generated carousel data:', structuredData)
        } else {
            console.log('📝 No stamps found - no structured data generated')
        }

        console.log('📤 Final response data:', {
            response: aiResponse,
            structuredData: structuredData,
            foundStamps: foundStamps.length
        })

        return NextResponse.json({
            response: aiResponse,
            structuredData,
            foundStamps: foundStamps.length,
            metadata: {
                source: foundStamps.length > 0 ? 'openai_assistant' : 'internet_search'
            }
        })

    } catch (error) {
        console.error('PhilaGuide API error:', error)
        return NextResponse.json({
            error: 'Request timed out. Please try again.'
        }, { status: 408 })
    }
}

// Parse response for stamp data
function parseResponse(response: string): { stamps: any[], structuredData?: any } {
    try {
        console.log('Parsing response:', response.substring(0, 200) + '...')

        // Try to extract JSON from the response - look for JSON blocks
        const jsonMatch = response.match(/```json\s*(\{[\s\S]*?\})\s*```/)
        if (jsonMatch) {
            console.log('Found JSON block in response')
            const jsonData = JSON.parse(jsonMatch[1])

            if (jsonData.stamps && Array.isArray(jsonData.stamps)) {
                console.log('Successfully parsed stamps from JSON block')
                return {
                    stamps: jsonData.stamps,
                    structuredData: jsonData
                }
            }
        }

        // Try to extract JSON without code blocks
        const jsonMatch2 = response.match(/\{[\s\S]*\}/)
        if (jsonMatch2) {
            console.log('Found JSON in response (no code blocks)')
            const jsonData = JSON.parse(jsonMatch2[0])

            if (jsonData.stamps && Array.isArray(jsonData.stamps)) {
                console.log('Successfully parsed stamps from JSON')
                return {
                    stamps: jsonData.stamps,
                    structuredData: jsonData
                }
            }
        }

        // Check if response contains real image URLs but no JSON structure
        if (response.includes('3pmplatformstorage.blob.core.windows.net')) {
            console.log('Response contains real image URLs but no JSON structure')
            // Try to extract stamp information from text
            const stampInfo = extractStampInfoFromText(response)
            if (stampInfo) {
                return {
                    stamps: [stampInfo],
                    structuredData: { stamps: [stampInfo] }
                }
            }
        }

        // New: Try to extract stamp data from conversational responses
        const extractedStamps = extractStampsFromConversation(response)
        if (extractedStamps.length > 0) {
            console.log('Successfully extracted stamps from conversational response')
            return {
                stamps: extractedStamps,
                structuredData: { stamps: extractedStamps }
            }
        }

        console.log('No valid JSON or stamp data found in response')
        return { stamps: [] }
    } catch (error) {
        console.log('❌ Failed to parse response:', error)
        return { stamps: [] }
    }
}

// Extract stamp information from conversational text
function extractStampsFromConversation(text: string): any[] {
    const stamps = []

    // Look for patterns like "Trout Blue 1/3d" stamp from New Zealand
    const stampPatterns = [
        /"([^"]+)"\s+stamp\s+from\s+([^,]+)/gi,
        /([^"]+)\s+stamp\s+from\s+([^,]+)/gi,
        /([^"]+)\s+from\s+([^,]+)/gi
    ]

    for (const pattern of stampPatterns) {
        const matches = text.matchAll(pattern)
        for (const match of matches) {
            const stampName = match[1]?.trim()
            const country = match[2]?.trim()

            if (stampName && country) {
                // Look for additional details in the text
                const yearMatch = text.match(/(\d{4})/)
                const year = yearMatch ? yearMatch[1] : 'Unknown'

                const denominationMatch = text.match(/(\d+[\/\d]*\s*[a-z]+)/i)
                const denomination = denominationMatch ? denominationMatch[1] : 'Unknown'

                const colorMatch = text.match(/(blue|red|green|yellow|brown|grey|gray|black|white|orange|purple|pink)/i)
                const color = colorMatch ? colorMatch[1] : 'Unknown'

                // Look for image URL
                const imageUrlMatch = text.match(/https:\/\/3pmplatformstorage\.blob\.core\.windows\.net\/[^\s\)\]]+/)
                const imageUrl = imageUrlMatch ? imageUrlMatch[0] : '/images/stamps/no-image-available.png'

                stamps.push({
                    Id: `extracted-${Date.now()}-${stamps.length}`,
                    Name: stampName,
                    Country: country,
                    IssueYear: year,
                    DenominationValue: denomination.includes('/') ? 1 : parseFloat(denomination.match(/\d+/)?.[0] || '1'),
                    DenominationSymbol: denomination.includes('d') ? 'd' : denomination.includes('c') ? 'c' : '',
                    StampImageUrl: imageUrl,
                    Color: color,
                    SeriesName: 'Extracted from response',
                    IssueDate: year !== 'Unknown' ? `${year}-01-01` : null,
                    PaperType: 'Unknown',
                    CatalogNumber: 'N/A'
                })
            }
        }
    }

    return stamps
}

// Extract stamp information from text when JSON parsing fails
function extractStampInfoFromText(text: string): any | null {
    try {
        // Look for image URLs in the text
        const imageUrlMatch = text.match(/https:\/\/3pmplatformstorage\.blob\.core\.windows\.net\/[^\s\)\]]+/)
        if (imageUrlMatch) {
            const imageUrl = imageUrlMatch[0]

            // Try to extract basic stamp info from the text
            const nameMatch = text.match(/\*\*([^*]+)\*\*/)
            const countryMatch = text.match(/Country[:\s]+([^\n]+)/i)
            const yearMatch = text.match(/Year[:\s]+([^\n]+)/i) || text.match(/(\d{4})/)
            const denominationMatch = text.match(/Denomination[:\s]+([^\n]+)/i)

            return {
                id: `extracted-${Date.now()}`,
                name: nameMatch ? nameMatch[1].trim() : 'Stamp',
                country: countryMatch ? countryMatch[1].trim() : 'Unknown',
                year: yearMatch ? yearMatch[1].trim() : 'Unknown',
                denomination: denominationMatch ? denominationMatch[1].trim() : 'Unknown',
                image: imageUrl,
                description: text.substring(0, 200) + '...',
                marketValue: 'Unknown',
                rarity: 'Unknown'
            }
        }

        return null
    } catch (error) {
        console.log('Failed to extract stamp info from text:', error)
        return null
    }
} 