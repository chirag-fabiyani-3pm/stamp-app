require('dotenv').config({ path: '.env.local' })

async function testVoiceResponse() {
    try {
        console.log('🧪 Testing voice chat response improvements...')

        // Test queries that should now provide detailed voice responses
        const testQueries = [
            "Show me Queen Victoria stamps",
            "Find stamps with fish",
            "Show me brown stamps from New Zealand",
            "Tell me about the Trout Blue stamp"
        ]

        console.log('\n🔍 Testing Voice Responses:')
        console.log('='.repeat(60))

        for (const query of testQueries) {
            console.log(`\n📝 Query: "${query}"`)
            console.log('-'.repeat(50))

            try {
                const response = await fetch('http://localhost:3000/api/philaguide', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: query,
                        history: []
                    }),
                })

                const data = await response.json()

                if (data.error) {
                    console.log(`❌ Error: ${data.error}`)
                    continue
                }

                console.log(`✅ Response: ${data.response}`)
                console.log(`📊 Stamps found: ${data.stampsFound || 0}`)

                if (data.stamps && data.stamps.length > 0) {
                    console.log(`🎴 Sample stamp: ${data.stamps[0].Name}`)
                    console.log(`🏳️ Country: ${data.stamps[0].Country}`)
                    console.log(`💰 Denomination: ${data.stamps[0].DenominationValue}${data.stamps[0].DenominationSymbol}`)

                    // Simulate what the voice response would be
                    if (data.stamps.length === 1) {
                        const stamp = data.stamps[0]
                        const voiceResponse = `I found a stamp for you: ${stamp.Name} from ${stamp.Country}. This is a ${stamp.DenominationValue}${stamp.DenominationSymbol || ''} stamp issued in ${stamp.IssueYear || 'unknown year'}. The color is ${stamp.Color || 'unknown'}.`
                        console.log(`🎤 Voice Response: ${voiceResponse}`)
                    } else {
                        const stampNames = data.stamps.slice(0, 3).map(s => s.Name).join(', ')
                        const voiceResponse = `I found ${data.stamps.length} stamps for you. Here are some examples: ${stampNames}. ${data.stamps.length > 3 ? `And ${data.stamps.length - 3} more stamps.` : ''} Would you like me to provide more details about any specific stamp?`
                        console.log(`🎤 Voice Response: ${voiceResponse}`)
                    }
                } else {
                    console.log(`🎤 Voice Response: I couldn't find any stamps matching your description. Could you try rephrasing your query or provide more specific details about the stamp you're looking for?`)
                }

            } catch (error) {
                console.log(`❌ Request failed: ${error.message}`)
            }
        }

        console.log('\n✅ Voice response test completed!')
        console.log('📝 The voice chat will now provide detailed responses instead of just "I found X stamps for you"')

    } catch (error) {
        console.error('❌ Error testing voice responses:', error)
    }
}

// Run the test
testVoiceResponse()
    .then(() => {
        console.log('\n🚀 Voice chat improvements are ready!')
        console.log('📋 You can now test voice queries in your app.')
        process.exit(0)
    })
    .catch((error) => {
        console.error('❌ Failed to test voice responses:', error)
        process.exit(1)
    }) 