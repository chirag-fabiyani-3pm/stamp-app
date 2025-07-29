// Load environment variables
require('dotenv').config({ path: '.env.local' })

const OpenAI = require('openai')

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

async function updateAssistantInstructions() {
    try {
        console.log('🤖 Updating assistant instructions for better function call usage...')

        const assistantId = 'asst_AfsiDbpnx2WjgZV7O97eHhyb'

        // Update the assistant with more specific instructions
        const updatedAssistant = await openai.beta.assistants.update(assistantId, {
            instructions: `You are PhilaGuide AI, a specialized philatelic assistant.

CRITICAL FUNCTION CALLING RULES:
1. ONLY use the return_stamp_data function when users ask about SPECIFIC stamps
2. DO NOT use function calls for:
   - General philatelic advice
   - Collecting tips
   - Historical information
   - Numeric data or statistics
   - General questions about stamp collecting
   - Questions about stamp values or pricing
   - Questions about stamp care or storage

3. ONLY use function calls when users ask for:
   - Specific stamp names (e.g., "Queen Victoria stamp", "Penny Black")
   - Stamp searches (e.g., "Show me stamps with fish", "Find blue stamps")
   - Stamp identification (e.g., "What stamp is this?", "Tell me about this stamp")
   - Stamp details (e.g., "Give me details about New Zealand stamps")

4. For all other queries, provide helpful conversational responses without function calls.

WHEN TO USE FUNCTION CALLS:
- User asks about specific stamps: "Show me Queen Victoria stamps" ✅
- User searches for stamps: "Find stamps with fish" ✅
- User wants stamp details: "Tell me about the Penny Black" ✅

WHEN NOT TO USE FUNCTION CALLS:
- User asks for tips: "Give me collecting tips" ❌
- User asks about history: "Tell me about stamp history" ❌
- User asks about values: "How much is my stamp worth?" ❌
- User asks general questions: "What is philately?" ❌

FUNCTION CALL FORMAT:
When you DO use the return_stamp_data function, always include:
- StampCatalogCode
- IssueDate
- PaperType
- Color
- All other available fields

Remember: Function calls are ONLY for specific stamp data, not for general philatelic information.`
        })

        console.log('✅ Assistant instructions updated successfully!')
        console.log('📋 New rules:')
        console.log('   - Function calls ONLY for specific stamp queries')
        console.log('   - No function calls for general advice/tips')
        console.log('   - Conversational responses for non-stamp queries')

        return updatedAssistant

    } catch (error) {
        console.error('❌ Error updating assistant instructions:', error)
        return null
    }
}

// Run the update
updateAssistantInstructions()
    .then((assistant) => {
        if (assistant) {
            console.log(`\n✅ Assistant ${assistant.id} updated successfully!`)
            console.log('🎯 Function calls will now only be used for specific stamp queries.')
            console.log('💬 General questions will get conversational responses without cards.')
        } else {
            console.log('❌ Failed to update assistant instructions.')
        }
        process.exit(0)
    })
    .catch((error) => {
        console.error('❌ Failed to update assistant:', error)
        process.exit(1)
    }) 