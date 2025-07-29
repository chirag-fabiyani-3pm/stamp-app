// Load environment variables
require('dotenv').config({ path: '.env.local' })

const OpenAI = require('openai')

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

const ASSISTANT_ID = 'asst_AfsiDbpnx2WjgZV7O97eHhyb'

async function updateFunctionSchema() {
    try {
        console.log('🔄 Updating function schema to match vector store data...')

        // Define the function for returning stamp data with correct field mapping
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
                                    StampCatalogCode: {
                                        type: "string",
                                        description: "Catalog code for the stamp"
                                    },
                                    Country: {
                                        type: "string",
                                        description: "Country of origin"
                                    },
                                    StampImageUrl: {
                                        type: "string",
                                        description: "Image URL from knowledge base"
                                    },
                                    IssueDate: {
                                        type: "string",
                                        description: "Full issue date (YYYY-MM-DD)"
                                    },
                                    IssueYear: {
                                        type: "string",
                                        description: "Year of issue"
                                    },
                                    DenominationValue: {
                                        type: "number",
                                        description: "Denomination value"
                                    },
                                    DenominationSymbol: {
                                        type: "string",
                                        description: "Denomination symbol"
                                    },
                                    Color: {
                                        type: "string",
                                        description: "Color of the stamp"
                                    },
                                    PaperType: {
                                        type: "string",
                                        description: "Type of paper used"
                                    }
                                },
                                required: ["Id", "Name", "Country", "StampImageUrl", "StampCatalogCode", "IssueDate", "IssueYear", "DenominationValue", "DenominationSymbol", "Color", "PaperType"]
                            }
                        }
                    },
                    required: ["stamps"]
                }
            }
        }

        // Update the assistant with correct function schema
        const assistant = await openai.beta.assistants.update(ASSISTANT_ID, {
            instructions: `You are PhilaGuide AI, a specialized philatelic assistant.

 CRITICAL INSTRUCTIONS:
 1. When users ask about stamps, search your knowledge base
 2. If you find stamp information, ALWAYS call the return_stamp_data function
 3. IMPORTANT: Always include ALL fields in your function calls, especially:
    - StampCatalogCode (catalog code)
    - IssueDate (full date)
    - PaperType (paper type)
    - Color, Country, Name, etc.
 4. Provide conversational responses about the stamps you find
 5. Be helpful and informative

 RESPONSE FORMAT:
 - Use the return_stamp_data function when you find stamps
 - ALWAYS include StampCatalogCode, IssueDate, and PaperType in function calls
 - Provide conversational responses
 - Never show technical details or raw URLs

 IMPORTANT:
 - ALWAYS use function calling when you find stamps
 - ALWAYS include StampCatalogCode field in function calls
 - Provide helpful responses`,
            tools: [
                { type: "file_search" },
                stampFunction
            ]
        })

        console.log(`✅ Function schema updated to match vector store data!`)
        console.log(`🛠️ Tools: File Search + Function Calling`)
        console.log(`💡 The assistant will now use the correct field names from your vector store.`)

    } catch (error) {
        console.error('❌ Error updating function schema:', error)
        throw error
    }
}

// Run the update
updateFunctionSchema()
    .then(() => {
        console.log('✅ Function schema update completed successfully!')
        process.exit(0)
    })
    .catch((error) => {
        console.error('❌ Function schema update failed:', error)
        process.exit(1)
    }) 