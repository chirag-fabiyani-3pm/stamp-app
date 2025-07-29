// Load environment variables
require('dotenv').config({ path: '.env.local' })

const OpenAI = require('openai')

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

const ASSISTANT_ID = 'asst_AfsiDbpnx2WjgZV7O97eHhyb'

async function simplifyFunctionCalling() {
    try {
        console.log('🔄 Simplifying assistant to use function calling...')

        // Define the function for returning stamp data
        const stampFunction = {
            type: "function",
            function: {
                name: "return_stamp_data",
                description: "Return structured stamp data when stamps are found in the knowledge base",
                parameters: {
                    type: "object",
                    properties: {
                        stamps: {
                            type: "array",
                            description: "Array of stamp objects found in the knowledge base",
                            items: {
                                type: "object",
                                properties: {
                                    Id: {
                                        type: "string",
                                        description: "Unique identifier for the stamp"
                                    },
                                    Name: {
                                        type: "string",
                                        description: "Name of the stamp"
                                    },
                                    Country: {
                                        type: "string",
                                        description: "Country of origin"
                                    },
                                    IssueYear: {
                                        type: "string",
                                        description: "Year of issue"
                                    },
                                    IssueDate: {
                                        type: "string",
                                        description: "Full issue date (YYYY-MM-DD)"
                                    },
                                    DenominationValue: {
                                        type: "number",
                                        description: "Denomination value"
                                    },
                                    DenominationSymbol: {
                                        type: "string",
                                        description: "Denomination symbol"
                                    },
                                    StampImageUrl: {
                                        type: "string",
                                        description: "Image URL from knowledge base"
                                    },
                                    Color: {
                                        type: "string",
                                        description: "Color of the stamp"
                                    },
                                    StampCatalogCode: {
                                        type: "string",
                                        description: "Catalog code for the stamp"
                                    },
                                    PaperType: {
                                        type: "string",
                                        description: "Type of paper used"
                                    }
                                },
                                required: ["Id", "Name", "Country", "StampImageUrl"]
                            }
                        }
                    },
                    required: ["stamps"]
                }
            }
        }

        // Update the assistant with simplified instructions
        const assistant = await openai.beta.assistants.update(ASSISTANT_ID, {
            instructions: `You are PhilaGuide AI, a specialized philatelic assistant.

CRITICAL INSTRUCTIONS:
1. When users ask about stamps, search your knowledge base
2. If you find stamp information, ALWAYS call the return_stamp_data function
3. Provide conversational responses about the stamps you find
4. Be helpful and informative

RESPONSE FORMAT:
- Use the return_stamp_data function when you find stamps
- Provide conversational responses
- Never show technical details or raw URLs

IMPORTANT: 
- ALWAYS use function calling when you find stamps
- Provide helpful responses`,
            tools: [
                { type: "file_search" },
                stampFunction
            ]
        })

        console.log(`✅ Assistant simplified for function calling!`)
        console.log(`🛠️ Tools: File Search + Function Calling`)
        console.log(`💡 The assistant will now use function calling when it finds stamps.`)

    } catch (error) {
        console.error('❌ Error simplifying function calling:', error)
        throw error
    }
}

// Run the simplification
simplifyFunctionCalling()
    .then(() => {
        console.log('✅ Function calling simplification completed successfully!')
        process.exit(0)
    })
    .catch((error) => {
        console.error('❌ Function calling simplification failed:', error)
        process.exit(1)
    }) 