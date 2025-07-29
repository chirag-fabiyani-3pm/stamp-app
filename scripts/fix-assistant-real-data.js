require('dotenv').config({ path: '.env.local' })
const OpenAI = require('openai')

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

const ASSISTANT_ID = 'asst_AfsiDbpnx2WjgZV7O97eHhyb'

async function fixAssistantRealData() {
    try {
        console.log('🔧 Fixing assistant to use real vector store data...')

        // Define the function for returning stamp data with strict requirements
        const stampFunction = {
            type: "function",
            function: {
                name: "return_stamp_data",
                description: "Return structured stamp data ONLY when real stamps are found in the vector store knowledge base",
                parameters: {
                    type: "object",
                    properties: {
                        stamps: {
                            type: "array",
                            description: "Array of real stamp objects from the vector store knowledge base",
                            items: {
                                type: "object",
                                properties: {
                                    Id: {
                                        type: "string",
                                        description: "Real unique identifier from vector store"
                                    },
                                    Name: {
                                        type: "string",
                                        description: "Real stamp name from vector store"
                                    },
                                    StampCatalogCode: {
                                        type: "string",
                                        description: "Real catalog code from vector store"
                                    },
                                    Country: {
                                        type: "string",
                                        description: "Real country from vector store"
                                    },
                                    StampImageUrl: {
                                        type: "string",
                                        description: "Real Azure blob storage image URL from vector store"
                                    },
                                    IssueDate: {
                                        type: "string",
                                        description: "Real issue date from vector store"
                                    },
                                    IssueYear: {
                                        type: "string",
                                        description: "Real issue year from vector store"
                                    },
                                    DenominationValue: {
                                        type: "number",
                                        description: "Real denomination value from vector store"
                                    },
                                    DenominationSymbol: {
                                        type: "string",
                                        description: "Real denomination symbol from vector store"
                                    },
                                    Color: {
                                        type: "string",
                                        description: "Real color from vector store"
                                    },
                                    PaperType: {
                                        type: "string",
                                        description: "Real paper type from vector store"
                                    },
                                    SeriesName: {
                                        type: "string",
                                        description: "Real series name from vector store"
                                    }
                                },
                                required: ["Id", "Name", "Country", "StampImageUrl", "StampCatalogCode", "IssueDate", "Color", "PaperType"]
                            }
                        }
                    },
                    required: ["stamps"]
                }
            }
        }

        // Update the assistant with strict instructions
        const assistant = await openai.beta.assistants.update(ASSISTANT_ID, {
            instructions: `You are PhilaGuide AI, a specialized philatelic assistant with access to a comprehensive stamp database.

CRITICAL DATA REQUIREMENTS:
1. You MUST use the file_search tool to search your vector store knowledge base
2. You MUST ONLY return REAL data from your vector store - NEVER use example or placeholder data
3. Image URLs MUST be real Azure blob storage URLs (https://3pmplatformstorage.blob.core.windows.net/...)
4. IDs MUST be real unique identifiers from your vector store
5. All stamp data MUST come from your actual knowledge base

FUNCTION CALLING RULES:
1. ONLY use return_stamp_data when you find REAL stamps in your vector store
2. NEVER use function calls for general philatelic advice or tips
3. ALWAYS include ALL required fields: Id, Name, Country, StampImageUrl, StampCatalogCode, IssueDate, Color, PaperType
4. NEVER return example data like "https://example.com/image.jpg" or ID "1"

SEARCH PROCESS:
1. When user asks about stamps, ALWAYS search your vector store first
2. Use file_search tool with relevant keywords (stamp name, country, year, denomination, etc.)
3. Only call return_stamp_data if you find REAL matching stamps
4. If no real stamps found, provide helpful conversational response without function call

RESPONSE FORMAT:
- For real stamps found: Use return_stamp_data with complete real data
- For general questions: Provide conversational response without function call
- Never show technical details or raw URLs in conversation
- Be helpful and informative

IMPORTANT: 
- ALWAYS search vector store before responding
- ONLY return REAL data from your knowledge base
- NEVER use placeholder or example data
- Use function calls ONLY for real stamp queries with real data`,
            tools: [
                { type: "file_search" },
                stampFunction
            ]
        })

        console.log('✅ Assistant updated to use real vector store data only!')
        console.log('🔍 Assistant will now:')
        console.log('  - Always search vector store first')
        console.log('  - Only return real data from knowledge base')
        console.log('  - Never use example or placeholder data')
        console.log('  - Use real Azure blob storage image URLs')
        console.log('  - Include all required fields in function calls')

        return assistant

    } catch (error) {
        console.error('❌ Error fixing assistant:', error)
        return null
    }
}

fixAssistantRealData()
    .then((assistant) => {
        if (assistant) {
            console.log('🎯 Assistant configuration updated successfully!')
        } else {
            console.log('❌ Failed to update assistant configuration')
        }
    })
    .catch((error) => {
        console.error('❌ Error:', error)
    }) 