import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Vercel configuration
export const maxDuration = 15 // 15 seconds for Vercel hobby plan (allows for function calls)
export const dynamic = 'force-dynamic'

console.log('OPENAI_API_KEY (philaguide): ', process.env.OPENAI_API_KEY)
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

const ASSISTANT_ID = 'asst_AfsiDbpnx2WjgZV7O97eHhyb'

// Thread management - store active threads (in production, use a proper database)
const activeThreads = new Map<string, string>() // sessionId -> threadId



// Add timeout configuration for Vercel
const TIMEOUT_MS = 12000 // 12 seconds to allow for function calls while staying under Vercel's limit

// Timeout helper function
function createTimeoutPromise(ms: number): Promise<never> {
    return new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), ms)
    })
}

// Handle voice chat with direct chat completion (no assistant API)
async function handleVoiceChatDirect(message: string, conversationHistory: any[] = [], controller: ReadableStreamDefaultController, encoder: TextEncoder) {
    try {
        console.log('🎤 Starting direct voice chat for:', message)
        console.log('🎤 Conversation history length:', conversationHistory.length)

        // Send initial status
        const statusMessage = `data: ${JSON.stringify({ type: 'status', status: 'processing' })}\n\n`
        controller.enqueue(encoder.encode(statusMessage))

        // Build conversation context with history
        const messages = [
            {
                role: "system" as const,
                content: `You are a helpful stamp expert assistant specializing in conversational responses for voice synthesis. 

IMPORTANT GUIDELINES:
- Provide natural, conversational responses suitable for speech
- Use clear, descriptive language
- Avoid abbreviations and technical jargon
- Use complete sentences and natural speech patterns
- Be informative but friendly and engaging
- When describing stamps, include details like country, year, denomination, color, and interesting facts
- Use natural language for denominations (e.g., "one-third penny" instead of "1/3d")
- NEVER use function calls or structured data - provide direct conversational responses
- Focus on descriptive, engaging content that sounds natural when spoken
- Maintain conversation context from previous messages
- Reference previous topics when relevant to show continuity

Example: Instead of "1/3d stamp from NZ", say "This is a beautiful one-third penny stamp from New Zealand, issued in 1935, featuring a stunning blue color that makes it highly collectible."

You have access to stamp knowledge and can provide detailed, conversational information about stamps. Always respond in a natural, conversational manner suitable for voice synthesis.`
            },
            ...conversationHistory, // Include conversation history for context
            {
                role: "user" as const,
                content: message
            }
        ]

        console.log('🎤 Messages being sent to OpenAI:', messages.length, 'total messages')

        // Create a streaming chat completion with enhanced system prompt and conversation history
        const stream = await openai.chat.completions.create({
            model: "gpt-4o",
            messages,
            stream: true,
            max_tokens: 1500,
            temperature: 0.7
        })

        let accumulatedContent = ""

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content
            if (content) {
                accumulatedContent += content

                // Stream the content word by word
                const contentMessage = `data: ${JSON.stringify({ type: 'content', content: content })}\n\n`
                try {
                    controller.enqueue(encoder.encode(contentMessage))
                } catch (controllerError) {
                    console.log('🎤 Controller closed, stopping stream')
                    break
                }
            }
        }

        // Send complete signal
        const completeMessage = `data: ${JSON.stringify({ type: 'complete', content: accumulatedContent })}\n\n`
        try {
            controller.enqueue(encoder.encode(completeMessage))
            // Don't close controller here - let the main ReadableStream handle it
        } catch (controllerError) {
            console.log('🎤 Controller already closed')
        }

        console.log('🎤 Voice chat completed with content length:', accumulatedContent.length)

    } catch (error) {
        console.error('❌ Voice chat error:', error)
        const errorMessage = `data: ${JSON.stringify({ type: 'error', error: 'Failed to process voice chat request' })}\n\n`
        try {
            controller.enqueue(encoder.encode(errorMessage))
        } catch (controllerError) {
            console.log('🎤 Controller closed, cannot send error message')
        }
    }
}

// Streaming response handler
async function handleStreamingResponse(message: string, voiceChat: boolean = false, sessionId?: string, conversationHistory: any[] = []) {
    const encoder = new TextEncoder()

    const stream = new ReadableStream({
        async start(controller) {
            try {
                console.log('🔄 Starting streaming response for:', message)
                console.log('🔄 Conversation history length:', conversationHistory.length)

                // Step 1: Get or create thread based on session
                let threadId: string
                if (sessionId && activeThreads.has(sessionId)) {
                    // Use existing thread for conversation continuity
                    threadId = activeThreads.get(sessionId)!
                    console.log('🔄 Using existing thread:', threadId)

                    // Check if there are any runs in progress and wait for them to complete
                    try {
                        const runs = await openai.beta.threads.runs.list(threadId)
                        const activeRuns = runs.data.filter(run =>
                            run.status === 'queued' || run.status === 'in_progress' || run.status === 'requires_action'
                        )

                        if (activeRuns.length > 0) {
                            console.log(`⏳ Found ${activeRuns.length} active runs, waiting for completion...`)
                            for (const activeRun of activeRuns) {
                                console.log(`⏳ Waiting for run ${activeRun.id} (status: ${activeRun.status}) to complete...`)

                                // If run requires action, we need to handle it
                                if (activeRun.status === 'requires_action') {
                                    console.log('🔧 Run requires action, handling it...')
                                    // For now, just wait for it to complete - the main flow will handle it
                                    console.log('⏳ Waiting for requires_action run to complete...')
                                } else {
                                    // Wait for other runs to complete
                                    let runStatus: any = activeRun.status
                                    let attempts = 0
                                    const maxAttempts = 30 // Wait up to 30 seconds

                                    while ((runStatus === 'queued' || runStatus === 'in_progress') && attempts < maxAttempts) {
                                        await new Promise(resolve => setTimeout(resolve, 1000))
                                        try {
                                            const runResult = await openai.beta.threads.runs.retrieve(activeRun.id, { thread_id: threadId })
                                            runStatus = runResult.status
                                            attempts++
                                            console.log(`⏳ Active run status: ${runStatus} (attempt ${attempts}/${maxAttempts})`)

                                            if (runStatus === 'completed' || runStatus === 'failed' || runStatus === 'cancelled' || runStatus === 'requires_action') {
                                                break
                                            }
                                        } catch (error) {
                                            console.error('❌ Error checking active run status:', error)
                                            break
                                        }
                                    }
                                }
                            }
                            console.log('✅ All active runs completed')
                        }
                    } catch (error) {
                        console.error('❌ Error checking active runs:', error)
                        // Continue anyway, don't fail the request
                    }
                } else {
                    // Create new thread for new conversation
                    const thread = await openai.beta.threads.create()
                    threadId = thread.id
                    if (sessionId) {
                        activeThreads.set(sessionId, threadId)
                    }
                    console.log('✅ New thread created:', threadId)
                }

                // Step 2: Handle voice chat differently - use direct chat completion
                if (voiceChat) {
                    console.log('🎤 Using direct chat completion for voice chat with history length:', conversationHistory.length)
                    await handleVoiceChatDirect(message, conversationHistory, controller, encoder)
                    // Voice chat handles its own controller lifecycle
                } else {
                    // Add current message to thread (OpenAI manages history automatically)
                    await openai.beta.threads.messages.create(threadId, {
                        role: 'user',
                        content: message
                    })
                    console.log('✅ Message added to thread')

                    // Step 3: Create run with the assistant
                    const run = await openai.beta.threads.runs.create(threadId, {
                        assistant_id: ASSISTANT_ID
                    })
                    console.log('✅ Run created:', run.id)

                    // Step 4: Stream the response
                    await streamRunResponse(threadId, run.id, controller, encoder)
                    // Don't close controller here - streamRunResponse handles it
                }

                // Don't try to close controller here - it's already being closed elsewhere
                // The controller will be closed automatically when the stream ends
                console.log('🔒 All streaming complete, controller state:', controller.desiredSize)
                console.log('🔒 Skipping controller close - already handled elsewhere')

            } catch (error) {
                console.error('❌ Streaming error:', error)
                const errorMessage = `data: ${JSON.stringify({ error: 'Failed to process request' })}\n\n`
                try {
                    controller.enqueue(encoder.encode(errorMessage))
                } catch (controllerError) {
                    console.log('Controller closed, cannot send error message')
                }
                // Don't close controller here - let the natural flow handle it
            }
        }
    })

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Keep-Alive': 'timeout=30, max=1000',
        },
    })
}

// Stream run response
async function streamRunResponse(threadId: string, runId: string, controller: ReadableStreamDefaultController, encoder: TextEncoder) {
    let runStatus = 'queued'
    let attempts = 0
    const maxAttempts = 30 // 30 seconds max to allow for function calls and handle API delays

    try {
        while ((runStatus === 'queued' || runStatus === 'in_progress') && attempts < maxAttempts) {
            console.log(`⏳ Run status: ${runStatus} (attempt ${attempts + 1}/${maxAttempts})`)

            // Send status update
            const statusMessage = `data: ${JSON.stringify({ type: 'status', status: runStatus })}\n\n`
            try {
                controller.enqueue(encoder.encode(statusMessage))
            } catch (error) {
                console.log('Controller closed during status update, stopping')
                return
            }

            // Send keep-alive signal every 5 seconds to prevent idle timeout
            if (attempts % 5 === 0) {
                const keepAliveMessage = `data: ${JSON.stringify({ type: 'keep-alive', timestamp: Date.now() })}\n\n`
                try {
                    controller.enqueue(encoder.encode(keepAliveMessage))
                } catch (error) {
                    console.log('Keep-alive signal failed, connection may be closed')
                    break
                }
            }

            await new Promise(resolve => setTimeout(resolve, 1000))

            try {
                const runResult = await openai.beta.threads.runs.retrieve(runId, { thread_id: threadId })
                runStatus = runResult.status
                attempts++

                if (runResult.last_error) {
                    console.error('❌ Run error:', runResult.last_error)
                    const errorMessage = `data: ${JSON.stringify({ type: 'error', error: runResult.last_error })}\n\n`
                    try {
                        controller.enqueue(encoder.encode(errorMessage))
                    } catch (error) {
                        console.log('Controller closed during error message, stopping')
                        return
                    }
                    return
                }
            } catch (error) {
                console.error('❌ Error checking run status:', error)
                break
            }
        }

        console.log(`✅ Run completed with status: ${runStatus} after ${attempts} attempts (${attempts} seconds)`)

        // Handle different run statuses
        if (runStatus === 'failed' || runStatus === 'cancelled' || runStatus === 'expired') {
            const errorMessage = `data: ${JSON.stringify({ type: 'error', error: `Run ${runStatus}` })}\n\n`
            try {
                controller.enqueue(encoder.encode(errorMessage))
            } catch (error) {
                console.log('Controller closed during error message, stopping')
                return
            }
            return
        }

        if (runStatus === 'queued' || runStatus === 'in_progress') {
            console.log(`⏰ Run timed out after ${attempts} attempts with status: ${runStatus}`)
            const timeoutMessage = `data: ${JSON.stringify({ type: 'timeout', message: 'The AI is taking longer than usual to respond. This might be due to high demand on OpenAI servers. Please try your query again or rephrase it for better results.' })}\n\n`
            try {
                controller.enqueue(encoder.encode(timeoutMessage))
            } catch (error) {
                console.log('Controller closed during timeout message, stopping')
                return
            }
            return
        }

        // Handle requires_action (function calls)
        if (runStatus === 'requires_action') {
            console.log('🔧 Run requires action - handling function calls...')

            const runResult = await openai.beta.threads.runs.retrieve(runId, { thread_id: threadId })
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
                                console.log('📋 Stamp details:', stamps.map((s: any) => ({ name: s.Name, country: s.Country, year: s.IssueYear })))

                                // Send stamp preview immediately
                                const stampPreview = {
                                    count: stamps.length,
                                    stamps: stamps.slice(0, 5).map((s: any) => ({
                                        name: s.Name || 'Unknown',
                                        country: s.Country || 'Unknown',
                                        year: s.IssueYear || 'Unknown',
                                        denomination: `${s.DenominationValue || ''}${s.DenominationSymbol || ''}`,
                                        color: s.Color || 'Unknown'
                                    }))
                                }

                                const previewMessage = `data: ${JSON.stringify({ type: 'stamp_preview', data: stampPreview })}\n\n`
                                try {
                                    controller.enqueue(encoder.encode(previewMessage))
                                } catch (error) {
                                    console.log('Controller closed during preview message, stopping')
                                    return
                                }

                                // Also send raw stamp data for voice chat
                                const rawStampData = {
                                    count: stamps.length,
                                    stamps: stamps.slice(0, 5) // Send the raw stamp objects
                                }

                                console.log('📤 Sending raw stamp data for voice chat:', rawStampData)
                                const rawDataMessage = `data: ${JSON.stringify({ type: 'raw_stamp_data', data: rawStampData })}\n\n`
                                try {
                                    controller.enqueue(encoder.encode(rawDataMessage))
                                } catch (error) {
                                    console.log('Controller closed during raw data message, stopping')
                                    return
                                }
                            } else {
                                console.log('⚠️ No stamps array found in function call data')
                            }
                        } catch (error) {
                            console.log('❌ Error parsing function arguments:', error)
                        }
                    }

                    toolOutputs.push({
                        tool_call_id: toolCall.id,
                        output: JSON.stringify({
                            success: true,
                            stamps: stamps,
                            instructions: "🚨 CRITICAL INSTRUCTIONS - YOU MUST FOLLOW THESE EXACTLY: ❌ NEVER list basic stamp details like Country, Issue Date, Catalog Code, Denomination, Color, or Paper Type. These are already displayed in the card above. ✅ INSTEAD, write ONLY about: Historical significance, design elements, cultural importance, interesting stories, collecting insights, philatelic significance, and series context. Focus on the STORY behind the stamp, not repeating the data. Example: 'This stamp captures the dynamic beauty of New Zealand's native trout in a stunning artistic composition that celebrates the country's freshwater fishing heritage.' NOT 'Country: New Zealand, Issue Date: May 4, 1935, Color: Blue'"
                        })
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
                } else {
                    console.log('⚠️ No stamps found in function call data')
                }

                // Send structured data
                if (immediateStructuredData) {
                    console.log('📤 Sending structured data to frontend:', immediateStructuredData.type)
                    const structuredMessage = `data: ${JSON.stringify({ type: 'structured_data', data: immediateStructuredData })}\n\n`
                    try {
                        controller.enqueue(encoder.encode(structuredMessage))
                    } catch (error) {
                        console.log('Controller closed during structured data message, stopping')
                        return
                    }
                } else {
                    console.log('⚠️ No structured data to send')
                }

                // Let the AI assistant generate the proper response instead of hardcoded text
                // The AI will provide contextual, complementary information about the stamps

                // CRITICAL: Submit tool outputs back to the thread to complete the conversation
                if (toolOutputs.length > 0) {
                    try {
                        console.log('📤 Submitting tool outputs back to thread:', toolOutputs.length, 'outputs')
                        await openai.beta.threads.runs.submitToolOutputs(runId, {
                            thread_id: threadId,
                            tool_outputs: toolOutputs
                        })
                        console.log('✅ Tool outputs submitted successfully')

                        // Wait for the run to complete after submitting tool outputs
                        console.log('⏳ Waiting for run to complete after tool output submission...')
                        let finalRunStatus = 'in_progress'
                        let finalAttempts = 0
                        const maxFinalAttempts = 10 // Wait up to 10 seconds for completion

                        while (finalRunStatus === 'in_progress' && finalAttempts < maxFinalAttempts) {
                            await new Promise(resolve => setTimeout(resolve, 1000))
                            try {
                                const finalRunResult = await openai.beta.threads.runs.retrieve(runId, { thread_id: threadId })
                                finalRunStatus = finalRunResult.status
                                finalAttempts++
                                console.log(`⏳ Final run status: ${finalRunStatus} (attempt ${finalAttempts}/${maxFinalAttempts})`)

                                if (finalRunStatus === 'completed') {
                                    console.log('✅ Run completed successfully after tool output submission')
                                    break
                                } else if (finalRunStatus === 'failed' || finalRunStatus === 'cancelled') {
                                    console.log(`❌ Run ${finalRunStatus} after tool output submission`)
                                    break
                                }
                            } catch (error) {
                                console.error('❌ Error checking final run status:', error)
                                break
                            }
                        }

                        // If the run completed, stream the final response
                        if (finalRunStatus === 'completed') {
                            console.log('📤 Streaming final response after tool output submission')
                            console.log('📤 Controller state before calling streamMessages:', controller.desiredSize)
                            await streamMessages(threadId, controller, encoder)
                            console.log('✅ Final response streamed, exiting early')
                            console.log('📤 streamMessages completed, controller state:', controller.desiredSize)
                            // Don't return early - let the main flow handle completion
                            // This ensures the controller isn't closed prematurely
                        }

                    } catch (submitError) {
                        console.error('❌ Error submitting tool outputs:', submitError)
                        // Don't fail the request, but log the error
                    }
                }

                return
            }
        }

        // Get the messages and stream the response (only if we didn't handle it above)
        if (runStatus === 'completed') {
            console.log('📤 Streaming response for completed run (no tool outputs)')
            console.log('📤 Controller state before calling streamMessages:', controller.desiredSize)
            await streamMessages(threadId, controller, encoder)
            console.log('📤 streamMessages completed, controller state:', controller.desiredSize)
        } else {
            console.log(`📤 Run ended with status: ${runStatus}, no response to stream`)
        }
        // Note: streamMessages will handle closing the controller

    } catch (error) {
        console.error('❌ Error in streamRunResponse:', error)
        const errorMessage = `data: ${JSON.stringify({ type: 'error', error: 'Failed to process request' })}\n\n`
        try {
            controller.enqueue(encoder.encode(errorMessage))
        } catch (controllerError) {
            console.log('Controller closed during error message, stopping')
            return
        }
    }
}

// Stream messages from thread
async function streamMessages(threadId: string, controller: ReadableStreamDefaultController, encoder: TextEncoder) {
    try {
        console.log('📤 Starting streamMessages with controller state:', controller.desiredSize)

        const messages = await openai.beta.threads.messages.list(threadId)
        const assistantMessages = messages.data.filter(msg => msg.role === 'assistant')

        if (assistantMessages.length > 0) {
            const latestMessage = assistantMessages[0]

            if (latestMessage.content.length > 0) {
                const content = latestMessage.content[0]

                if (content.type === 'text') {
                    const text = content.text.value
                    const cleanedText = cleanResponseText(text)
                    console.log('📝 Streaming text content, length:', cleanedText.length)

                    // BULLETPROOF: Send complete response immediately to prevent any loss
                    const completeResponseMessage = `data: ${JSON.stringify({ type: 'complete_response', content: cleanedText })}\n\n`
                    try {
                        controller.enqueue(encoder.encode(completeResponseMessage))
                        console.log('✅ Complete response sent immediately to prevent loss')
                    } catch (completeError) {
                        console.log('❌ Could not send complete response')
                    }

                    // Send initial connection establishment signal
                    const connectionMessage = `data: ${JSON.stringify({ type: 'connection', status: 'established', contentLength: cleanedText.length })}\n\n`
                    try {
                        controller.enqueue(encoder.encode(connectionMessage))
                        console.log('🔗 Connection established signal sent')
                    } catch (connectionError) {
                        console.log('❌ Connection signal failed')
                    }

                    // Buffer the complete response in case streaming gets interrupted
                    let completeResponse = ''
                    let streamedWords = 0
                    const totalWords = cleanedText.split(' ').length

                    // Stream the text in larger chunks to reduce interruption risk
                    const words = cleanedText.split(' ')
                    const chunkSize = 5 // Send 5 words at a time instead of 1

                    for (let i = 0; i < words.length; i += chunkSize) {
                        const chunk = words.slice(i, i + chunkSize)
                        const chunkText = chunk.join(' ')
                        const message = `data: ${JSON.stringify({ type: 'content', content: chunkText + (i + chunkSize < words.length ? ' ' : '') })}\n\n`

                        // BULLETPROOF: Check controller state before every operation
                        if (controller.desiredSize === null) {
                            console.log('⚠️ Controller closed during streaming, stopping content stream at word', i)
                            console.log('📤 Complete response already sent at start - no content loss')
                            return
                        }

                        try {
                            controller.enqueue(encoder.encode(message))
                            streamedWords = Math.min(i + chunkSize, words.length)
                            completeResponse += chunkText + (i + chunkSize < words.length ? ' ' : '')
                            console.log(`📤 Streamed chunk ${Math.floor(i / chunkSize) + 1}/${Math.ceil(words.length / chunkSize)}: "${chunkText}" (words ${i + 1}-${streamedWords})`)

                            // Send keep-alive signal every 3 chunks to prevent timeout
                            if (Math.floor(i / chunkSize) % 3 === 0 && i > 0) {
                                const keepAliveMessage = `data: ${JSON.stringify({ type: 'keep-alive', chunk: Math.floor(i / chunkSize), total: Math.ceil(words.length / chunkSize) })}\n\n`
                                try {
                                    controller.enqueue(encoder.encode(keepAliveMessage))
                                    console.log(`📡 Keep-alive signal sent at chunk ${Math.floor(i / chunkSize)}`)
                                } catch (keepAliveError) {
                                    console.log('❌ Keep-alive signal failed')
                                }
                            }
                        } catch (error) {
                            console.log('❌ Controller closed during content streaming, stopping at word', i)
                            console.log('📤 Complete response already sent at start - no content loss')
                            return
                        }

                        // Reduced delay for faster chunked streaming
                        await new Promise(resolve => setTimeout(resolve, 50))
                    }

                    console.log('✅ Content streaming completed successfully')

                    // Send completion signal only if controller is still open
                    if (controller.desiredSize !== null) {
                        const completeMessage = `data: ${JSON.stringify({ type: 'complete' })}\n\n`
                        try {
                            controller.enqueue(encoder.encode(completeMessage))
                            console.log('✅ Completion signal sent successfully')
                        } catch (error) {
                            console.log('❌ Controller closed during completion message')
                            return
                        }
                    } else {
                        console.log('⚠️ Controller already closed, skipping completion message')
                    }
                } else {
                    console.log('⚠️ No text content found in message')
                }
            } else {
                console.log('⚠️ No content found in assistant message')
            }
        } else {
            console.log('⚠️ No assistant messages found')
        }
    } catch (error) {
        console.error('❌ Error streaming messages:', error)
        const errorMessage = `data: ${JSON.stringify({ type: 'error', error: 'Failed to get response' })}\n\n`

        // BULLETPROOF: Check controller state before sending error message
        if (controller.desiredSize !== null) {
            try {
                controller.enqueue(encoder.encode(errorMessage))
                console.log('✅ Error message sent successfully')
            } catch (controllerError) {
                console.log('❌ Controller closed during error message')
                return
            }
        } else {
            console.log('⚠️ Controller already closed, cannot send error message')
        }
    }

    console.log('📤 streamMessages function completed, controller state:', controller.desiredSize)
}

// Generate card format for single stamp
function generateStampCard(stamp: any) {
    // Map the vector store fields to card display format
    const year = stamp.issueYear || stamp.IssueYear || (stamp.issueDate ? stamp.issueDate.split('-')[0] : stamp.IssueDate ? stamp.IssueDate.split('-')[0] : 'Unknown')
    // Use denominationSymbol if available, otherwise construct from denominationValue
    const denomination = stamp.denominationSymbol || stamp.DenominationSymbol || `${stamp.denominationValue || stamp.DenominationValue}`
    const subtitle = `${stamp.country || stamp.Country} • ${year} • ${denomination}`

    // Handle different possible image URL field names
    const imageUrl = stamp.stampImageUrl || stamp.StampImageUrl || stamp.image || stamp.StampImage || '/images/stamps/no-image-available.png'

    return {
        type: 'card',
        id: stamp.id || stamp.Id, // Use lowercase 'id' first, then fallback to 'Id'
        title: stamp.name || stamp.Name || stamp.catalogNumber || stamp.StampCatalogCode || 'Stamp',
        subtitle: subtitle,
        image: imageUrl,
        content: [
            {
                section: 'Overview',
                text: `${stamp.name || stamp.Name} from ${stamp.country || stamp.Country}, issued in ${year}. Denomination: ${denomination}. Color: ${stamp.color || stamp.Color || 'Unknown'}.`
            },
            {
                section: 'Details',
                details: [
                    { label: 'Catalog Code', value: stamp.catalogNumber || stamp.StampCatalogCode || 'N/A' },
                    { label: 'Issue Date', value: stamp.issueDate || stamp.IssueDate || 'N/A' },
                    { label: 'Color', value: stamp.color || stamp.Color || 'N/A' },
                    { label: 'Paper Type', value: stamp.paperType || stamp.PaperType || 'N/A' }
                ]
            }
        ],
        significance: `A ${stamp.color || stamp.Color || 'colorful'} stamp from ${stamp.country || stamp.Country} issued in ${year}.`,
        specialNotes: stamp.seriesName || stamp.SeriesName ? `Part of the ${stamp.seriesName || stamp.SeriesName} series.` : ''
    }
}

// Generate carousel format for multiple stamps
function generateStampCarousel(stamps: any[]) {
    return {
        type: 'carousel',
        title: `Found ${stamps.length} stamp${stamps.length !== 1 ? 's' : ''}`,
        items: stamps.map(stamp => {
            const year = stamp.issueYear || stamp.IssueYear || (stamp.issueDate ? stamp.issueDate.split('-')[0] : stamp.IssueDate ? stamp.IssueDate.split('-')[0] : 'Unknown')
            // Use denominationSymbol if available, otherwise construct from denominationValue
            const denomination = stamp.denominationSymbol || stamp.DenominationSymbol || `${stamp.denominationValue || stamp.DenominationValue}`
            const subtitle = `${stamp.country || stamp.Country} • ${year} • ${denomination}`

            // Handle different possible image URL field names
            const imageUrl = stamp.stampImageUrl || stamp.StampImageUrl || stamp.image || stamp.StampImage || '/images/stamps/no-image-available.png'

            return {
                id: stamp.id || stamp.Id, // Use lowercase 'id' first, then fallback to 'Id'
                title: stamp.name || stamp.Name || stamp.catalogNumber || stamp.StampCatalogCode || 'Stamp',
                subtitle: subtitle,
                image: imageUrl,
                // Include the same detailed content as single cards
                content: [
                    {
                        section: 'Overview',
                        text: `${stamp.name || stamp.Name} from ${stamp.country || stamp.Country}, issued in ${year}. Denomination: ${denomination}. Color: ${stamp.color || stamp.Color || 'Unknown'}.`
                    },
                    {
                        section: 'Details',
                        details: [
                            { label: 'Catalog Code', value: stamp.catalogNumber || stamp.StampCatalogCode || 'N/A' },
                            { label: 'Issue Date', value: stamp.issueDate || stamp.IssueDate || 'N/A' },
                            { label: 'Color', value: stamp.color || stamp.Color || 'N/A' },
                            { label: 'Paper Type', value: stamp.paperType || stamp.PaperType || 'N/A' }
                        ]
                    }
                ],
                significance: `A ${stamp.color || stamp.Color || 'colorful'} stamp from ${stamp.country || stamp.Country} issued in ${year}.`,
                specialNotes: stamp.seriesName || stamp.SeriesName ? `Part of the ${stamp.seriesName || stamp.SeriesName} series.` : '',
                // Keep existing fields for backward compatibility
                summary: `${denomination} ${stamp.color || stamp.Color || 'Unknown'}`,
                marketValue: 'Value varies by condition',
                quickFacts: [
                    `${stamp.country || stamp.Country} ${year}`,
                    stamp.color || stamp.Color || 'Unknown',
                    denomination
                ]
            }
        })
    }
}

// Simple text cleaning - only remove technical references, preserve AI formatting
function cleanResponseText(text: string): string {
    // Only remove technical references and URLs, preserve AI's markdown formatting
    return text
        .replace(/download\.json/g, 'stamp database')
        .replace(/vector store/g, 'stamp collection')
        .replace(/file_search/g, 'search')
        .replace(/https:\/\/3pmplatformstorage\.blob\.core\.windows\.net\/[^\s\)\]]+/g, '')
        .replace(/ref as [^\s]+/g, '')
        .replace(/catalog number [A-Z0-9]+/gi, '')
        .replace(/Campbell Paterson Catalogue/g, 'stamp catalog')
        .replace(/catalog number/g, 'catalog')
        .trim()
}

// Health check endpoint
export async function GET() {
    return NextResponse.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        assistantId: ASSISTANT_ID,
        timeout: TIMEOUT_MS
    })
}

export async function POST(request: NextRequest) {
    try {
        const { message, stream = false, voiceChat = false, sessionId, history = [], conversationHistory = [] } = await request.json()
        // Use conversationHistory if available, otherwise fall back to history for backward compatibility
        const finalHistory = conversationHistory.length > 0 ? conversationHistory : history
        console.log('📨 API Request:', { message: message.substring(0, 50) + '...', stream, voiceChat, sessionId, historyLength: finalHistory.length })

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 })
        }

        // Check if streaming is requested
        if (stream) {
            return handleStreamingResponse(message, voiceChat, sessionId, finalHistory)
        }

        // Fallback for non-streaming requests
        console.log('Using non-streaming mode for:', message)

        // For voice chat, use direct chat completion even in non-streaming mode
        if (voiceChat) {
            console.log('🎤 Using direct chat completion for voice chat (non-streaming) with history length:', finalHistory.length)

            try {
                // Build conversation context with history for non-streaming voice chat
                const messages = [
                    {
                        role: "system" as const,
                        content: `You are a helpful stamp expert assistant specializing in conversational responses for voice synthesis. 

IMPORTANT GUIDELINES:
- Provide natural, conversational responses suitable for speech
- Use clear, descriptive language
- Avoid abbreviations and technical jargon
- Use complete sentences and natural speech patterns
- Be informative but friendly and engaging
- When describing stamps, include details like country, year, denomination, color, and interesting facts
- Use natural language for denominations (e.g., "one-third penny" instead of "1/3d")
- NEVER use function calls or structured data - provide direct conversational responses
- Focus on descriptive, engaging content that sounds natural when spoken
- Maintain conversation context from previous messages
- Reference previous topics when relevant to show continuity

Example: Instead of "1/3d stamp from NZ", say "This is a beautiful one-third penny stamp from New Zealand, issued in 1935, featuring a stunning blue color that makes it highly collectible."

You have access to stamp knowledge and can provide detailed, conversational information about stamps. Always respond in a natural, conversational manner suitable for voice synthesis.`
                    },
                    ...finalHistory, // Include conversation history for context
                    {
                        role: "user" as const,
                        content: message
                    }
                ]

                const completion = await openai.chat.completions.create({
                    model: "gpt-4o",
                    messages,
                    max_tokens: 1500,
                    temperature: 0.7
                })

                const response = completion.choices[0]?.message?.content || "I couldn't generate a response for that query."
                return NextResponse.json({ response })

            } catch (error) {
                console.error('❌ Voice chat error:', error)
                return NextResponse.json({ error: 'Failed to process voice chat request' }, { status: 500 })
            }
        }

        // Use OpenAI Assistant with file-based knowledge for non-voice chat
        console.log('Using OpenAI Assistant for:', message)

        // Call the assistant API with timeout
        let assistantResult
        try {
            // Create a timeout promise
            const timeoutPromise = createTimeoutPromise(TIMEOUT_MS)

            // Create the assistant call promise
            const assistantPromise = (async () => {
                // Step 1: First fetch the assistant (like in Flutter)
                const assistant = await openai.beta.assistants.retrieve(ASSISTANT_ID)
                console.log('✅ Assistant fetched:', assistant.id)

                // Step 2: Get or create thread based on session
                let threadId: string
                if (sessionId && activeThreads.has(sessionId)) {
                    // Use existing thread for conversation continuity
                    threadId = activeThreads.get(sessionId)!
                    console.log('🔄 Using existing thread:', threadId)

                    // OpenAI threads handle conversation history automatically
                    // await waitForThreadCompletion(threadId)
                } else {
                    // Create new thread for new conversation
                    const thread = await openai.beta.threads.create()
                    threadId = thread.id
                    if (sessionId) {
                        activeThreads.set(sessionId, threadId)
                    }
                    console.log('✅ New thread created:', threadId)
                }

                // Step 3: Add the user's message to the thread (OpenAI manages history automatically)
                const enhancedMessage = `${message}

🚨 CRITICAL - YOU MUST FOLLOW THESE INSTRUCTIONS EXACTLY:

❌ ABSOLUTELY FORBIDDEN - NEVER INCLUDE:
- Country names
- Issue dates  
- Catalog codes
- Denominations
- Colors
- Paper types
- ANY basic stamp details

✅ INSTEAD, WRITE ONLY ABOUT:
- Historical significance and stories
- Design and artistic elements
- Cultural importance
- Interesting facts and trivia
- Collecting insights
- Philatelic significance
- Series context and relationships

🚨 REMEMBER: The user already sees all basic details in the card above. Your job is to provide the STORY behind the stamp, not repeat the data.

Example of CORRECT response: "This stamp captures the dynamic beauty of New Zealand's native trout in a stunning artistic composition. The leaping fish design celebrates the country's world-renowned freshwater fishing heritage and represents the pristine natural ecosystems that make New Zealand unique. Part of the iconic 1935-1947 Pictorial Issue series, this stamp showcases the artistic excellence and cultural storytelling that defined this golden era of New Zealand philately."

Example of WRONG response: "Name: Trout Blue 1/3d, Country: New Zealand, Issue Date: May 4, 1935, Color: Blue" (NEVER DO THIS)

Focus on the STORY, not the DATA.`

                const threadMessage = await openai.beta.threads.messages.create(threadId, {
                    role: 'user',
                    content: enhancedMessage
                })
                console.log('✅ Message created:', threadMessage.id)

                // Step 5: Create run with the assistant
                const run = await openai.beta.threads.runs.create(threadId, {
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
                const maxAttempts = 4 // 4 seconds max wait (4 attempts × 1 second)

                while ((runStatus === 'queued' || runStatus === 'in_progress') && attempts < maxAttempts) {
                    console.log(`⏳ Run status: ${runStatus} (attempt ${attempts + 1}/${maxAttempts})`)
                    await new Promise(resolve => setTimeout(resolve, 1000)) // Reduced to 1 second

                    try {
                        const runResult = await openai.beta.threads.runs.retrieve(run.id, { thread_id: threadId })
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

                // If still in progress after timeout, return a quick response
                if (runStatus === 'queued' || runStatus === 'in_progress') {
                    console.log('⏰ Run still in progress after timeout, returning quick response')
                    return {
                        response: "I'm processing your request about stamps. This might take a moment. Please try again with a more specific query or check back in a few seconds.",
                        stampsFound: 0,
                        hasStructuredData: false,
                        stamps: [],
                        structuredData: null
                    }
                }

                // Handle requires_action (function calls)
                if (runStatus === 'requires_action') {
                    console.log('🔧 Run requires action - handling function calls...')

                    const runResult = await openai.beta.threads.runs.retrieve(run.id, { thread_id: threadId })
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

                        // CRITICAL: Submit tool outputs back to the thread to complete the conversation
                        if (toolOutputs.length > 0) {
                            try {
                                console.log('📤 Submitting tool outputs back to thread (non-streaming):', toolOutputs.length, 'outputs')
                                await openai.beta.threads.runs.submitToolOutputs(run.id, {
                                    thread_id: threadId,
                                    tool_outputs: toolOutputs
                                })
                                console.log('✅ Tool outputs submitted successfully (non-streaming)')

                                // Wait for the run to complete after submitting tool outputs
                                console.log('⏳ Waiting for run to complete after tool output submission (non-streaming)...')
                                let finalRunStatus = 'in_progress'
                                let finalAttempts = 0
                                const maxFinalAttempts = 10 // Wait up to 10 seconds for completion

                                while (finalRunStatus === 'in_progress' && finalAttempts < maxFinalAttempts) {
                                    await new Promise(resolve => setTimeout(resolve, 1000))
                                    try {
                                        const finalRunResult = await openai.beta.threads.runs.retrieve(run.id, { thread_id: threadId })
                                        finalRunStatus = finalRunResult.status
                                        finalAttempts++
                                        console.log(`⏳ Final run status (non-streaming): ${finalRunStatus} (attempt ${finalAttempts}/${maxFinalAttempts})`)

                                        if (finalRunStatus === 'completed') {
                                            console.log('✅ Run completed successfully after tool output submission (non-streaming)')
                                            break
                                        } else if (finalRunStatus === 'failed' || finalRunStatus === 'cancelled') {
                                            console.log(`❌ Run ${finalRunStatus} after tool output submission (non-streaming)`)
                                            break
                                        }
                                    } catch (error) {
                                        console.error('❌ Error checking final run status (non-streaming):', error)
                                        break
                                    }
                                }

                            } catch (submitError) {
                                console.error('❌ Error submitting tool outputs (non-streaming):', submitError)
                                // Don't fail the request, but log the error
                            }
                        }

                        // Return with function call data
                        return {
                            response: `I found ${stamps.length} stamp${stamps.length !== 1 ? 's' : ''} for you.`,
                            stampsFound: stamps.length,
                            hasStructuredData: stamps.length > 0,
                            stamps: stamps,
                            structuredData: immediateStructuredData
                        }
                    }
                }

                // Get the messages from the thread
                const messages = await openai.beta.threads.messages.list(threadId)
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
                                return {
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

                                return {
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

                return {
                    response: 'I apologize, but I encountered an error while processing your request. Please try again in a moment.',
                    stamps: []
                }
            })()

            // Race between the assistant call and timeout
            assistantResult = await Promise.race([assistantPromise, timeoutPromise])

        } catch (error) {
            console.error('Assistant API error:', error)
            console.error('Error details:', {
                message: error instanceof Error ? error.message : 'Unknown error',
                status: (error as any)?.status,
                type: (error as any)?.type
            })

            // Check if it's a timeout error
            if (error instanceof Error && error.message === 'Request timeout') {
                return NextResponse.json({
                    error: 'The assistant is taking too long to respond. Please try again with a more specific query about stamps, or try asking about a particular country or year.'
                }, { status: 408 })
            }

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