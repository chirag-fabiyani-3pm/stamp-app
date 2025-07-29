require('dotenv').config({ path: '.env.local' })

const OpenAI = require('openai')

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

const ASSISTANT_ID = 'asst_AfsiDbpnx2WjgZV7O97eHhyb'

async function testFunctionCallResponse() {
    try {
        console.log('🧪 Testing function call response...')

        // Create a thread
        const thread = await openai.beta.threads.create()
        console.log('✅ Thread created:', thread.id)

        // Add the message to the thread
        const message = await openai.beta.threads.messages.create(thread.id, {
            role: 'user',
            content: 'Show me queen victoria stamp'
        })
        console.log('✅ Message added to thread')

        // Run the assistant
        const run = await openai.beta.threads.runs.create(thread.id, {
            assistant_id: ASSISTANT_ID
        })
        console.log('✅ Run started:', run.id)

        // Wait for the run to complete
        let runStatus = run.status
        let attempts = 0
        const maxAttempts = 30

        while ((runStatus === 'queued' || runStatus === 'in_progress') && attempts < maxAttempts) {
            console.log(`⏳ Run status: ${runStatus} (attempt ${attempts + 1}/${maxAttempts})`)
            await new Promise(resolve => setTimeout(resolve, 2000))

            try {
                const runResult = await openai.beta.threads.runs.retrieve(run.id, { thread_id: thread.id })
                runStatus = runResult.status
                attempts++

                if (runResult.last_error) {
                    console.error('❌ Run error:', runResult.last_error)
                }
            } catch (error) {
                console.error('❌ Error checking run status:', error)
                break
            }
        }

        console.log(`✅ Run completed with status: ${runStatus}`)

        if (runStatus === 'requires_action') {
            console.log('🔧 Run requires action - checking function calls...')

            const runResult = await openai.beta.threads.runs.retrieve(run.id, { thread_id: thread.id })

            if (runResult.required_action && runResult.required_action.type === 'submit_tool_outputs') {
                const toolCalls = runResult.required_action.submit_tool_outputs.tool_calls
                console.log('🔧 Tool calls found:', toolCalls.length)

                for (const toolCall of toolCalls) {
                    if (toolCall.function.name === 'return_stamp_data') {
                        try {
                            const functionArgs = JSON.parse(toolCall.function.arguments)
                            console.log('📊 Function call data:', JSON.stringify(functionArgs, null, 2))

                            if (functionArgs.stamps && Array.isArray(functionArgs.stamps)) {
                                const stamp = functionArgs.stamps[0]
                                console.log('🎴 Stamp fields found:')
                                console.log('- Id:', stamp.Id)
                                console.log('- Name:', stamp.Name)
                                console.log('- StampCatalogCode:', stamp.StampCatalogCode)
                                console.log('- Country:', stamp.Country)
                                console.log('- IssueDate:', stamp.IssueDate)
                                console.log('- IssueYear:', stamp.IssueYear)
                                console.log('- DenominationValue:', stamp.DenominationValue)
                                console.log('- DenominationSymbol:', stamp.DenominationSymbol)
                                console.log('- StampImageUrl:', stamp.StampImageUrl)
                                console.log('- Color:', stamp.Color)
                                console.log('- PaperType:', stamp.PaperType)
                            }
                        } catch (error) {
                            console.log('❌ Error parsing function arguments:', error)
                        }
                    }
                }
            }
        }

    } catch (error) {
        console.error('❌ Error testing function call response:', error)
    }
}

testFunctionCallResponse()
    .then(() => {
        console.log('✅ Test completed')
        process.exit(0)
    })
    .catch((error) => {
        console.error('❌ Test failed:', error)
        process.exit(1)
    }) 