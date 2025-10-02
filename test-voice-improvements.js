#!/usr/bin/env node

/**
 * Test script to verify voice chat improvements
 * Tests comparison and detail view functionality
 */

const BASE_URL = 'http://localhost:3000'

async function testVoiceVectorSearch(transcript, sessionId = 'test-session') {
    try {
        console.log(`\n🧪 Testing: "${transcript}"`)

        const response = await fetch(`${BASE_URL}/api/voice-vector-search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                transcript: transcript,
                sessionId: sessionId,
                mode: 'precise'
            })
        })

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()

        console.log('✅ Response received:')
        console.log('  - Success:', data.success)
        console.log('  - Content length:', data.content?.length || 0)
        console.log('  - Structured data:', data.structured ? 'Present' : 'None')

        if (data.structured) {
            console.log('  - Mode:', data.structured.mode)
            if (data.structured.mode === 'cards') {
                console.log('  - Cards count:', data.structured.cards?.length || 0)
                if (data.structured.cards?.length > 0) {
                    console.log('  - First card ID:', data.structured.cards[0].id)
                    console.log('  - First card name:', data.structured.cards[0].stampName)
                }
            } else if (data.structured.mode === 'comparison') {
                console.log('  - Stamp IDs:', data.structured.stampIds?.length || 0)
                if (data.structured.stampIds?.length > 0) {
                    console.log('  - Stamp IDs:', data.structured.stampIds)
                }
            }
        }

        return data
    } catch (error) {
        console.error('❌ Test failed:', error.message)
        return null
    }
}

async function testRealtimeAPI(transcript, sessionId = 'test-session') {
    try {
        console.log(`\n🧪 Testing Realtime API: "${transcript}"`)

        // First create a session
        const sessionResponse = await fetch(`${BASE_URL}/api/realtime-webrtc/${sessionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                clientSecret: 'chat-secret',
                voice: 'alloy',
                instructions: `You are PhilaGuide AI, a specialized stamp collecting expert. You ONLY respond to philatelic (stamp collecting) related queries.

CRITICAL RESTRICTION - PHILATELIC QUERIES ONLY:
- ONLY respond to questions about stamps, stamp collecting, philately, postal history, or related topics
- For ANY non-philatelic queries, politely redirect users back to stamp-related topics
- Do NOT answer questions about general topics, current events, weather, sports, etc.

RESPONSE GUIDELINES:
- For philatelic queries: Provide natural, conversational responses suitable for speech
- For non-philatelic queries: Politely redirect with a message like: "I'm PhilaGuide AI, specialized in stamp collecting. I'd be happy to help you with any questions about stamps, postal history, or philately. What would you like to know about stamps?"

PHILATELIC TOPICS INCLUDE:
- Stamps and stamp collecting
- Postal history and postal services
- Philatelic terminology and techniques
- Stamp identification and valuation
- Postal markings and cancellations
- Stamp production and printing
- Postal rates and postal systems
- Stamp exhibitions and shows
- Philatelic literature and resources

REMEMBER: You are a stamp collecting expert. Stay focused on philatelic topics only.`
            })
        })

        if (!sessionResponse.ok) {
            throw new Error(`Session creation failed: ${sessionResponse.status}`)
        }

        const sessionData = await sessionResponse.json()
        console.log('✅ Session created:', sessionData.success)

        // Now send a text message
        const messageResponse = await fetch(`${BASE_URL}/api/realtime-webrtc/${sessionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messageType: 'text.message',
                message: transcript
            })
        })

        if (!messageResponse.ok) {
            throw new Error(`HTTP ${messageResponse.status}: ${messageResponse.statusText}`)
        }

        const data = await messageResponse.json()

        console.log('✅ Realtime API Response received:')
        console.log('  - Success:', data.success)
        console.log('  - Response:', data.response?.substring(0, 100) + '...')
        console.log('  - Structured data:', data.structured ? 'Present' : 'None')

        if (data.structured) {
            console.log('  - Mode:', data.structured.mode)
            if (data.structured.mode === 'cards') {
                console.log('  - Cards count:', data.structured.cards?.length || 0)
                if (data.structured.cards?.length > 0) {
                    console.log('  - First card ID:', data.structured.cards[0].id)
                    console.log('  - First card name:', data.structured.cards[0].stampName)
                }
            } else if (data.structured.mode === 'comparison') {
                console.log('  - Stamp IDs:', data.structured.stampIds?.length || 0)
                if (data.structured.stampIds?.length > 0) {
                    console.log('  - Stamp IDs:', data.structured.stampIds)
                }
            }
        }

        return data
    } catch (error) {
        console.error('❌ Realtime API Test failed:', error.message)
        return null
    }
}

async function runTests() {
    console.log('🚀 Starting voice chat functionality tests...\n')

    const sessionId = `test-session-${Date.now()}`

    console.log('📋 Testing Voice Vector Search API:')
    // Test 1: Search for a stamp (should return cards mode)
    await testVoiceVectorSearch('show me the one penny bright orange vermilion stamp from 1862', sessionId)

    // Test 2: Search for another stamp (should be stored in context)
    await testVoiceVectorSearch('show me the Mount Cook stamp from 1901', sessionId)

    // Test 3: Compare the two stamps (should return comparison mode)
    await testVoiceVectorSearch('compare them', sessionId)

    // Test 4: Compare with specific request
    await testVoiceVectorSearch('compare the one penny orange with the Mount Cook stamp', sessionId)

    // Test 5: Detail request
    await testVoiceVectorSearch('tell me about the one penny stamp', sessionId)

    // Test 6: Show comparison request
    await testVoiceVectorSearch('show comparison between these stamps', sessionId)

    console.log('\n📋 Testing Realtime API Integration:')
    const realtimeSessionId = `realtime-test-session-${Date.now()}`

    // Test 7: Realtime API with detail request
    await testRealtimeAPI('show me the one penny bright orange vermilion stamp from 1862', realtimeSessionId)

    // Test 8: Realtime API with comparison request
    await testRealtimeAPI('compare the one penny orange with Mount Cook stamp', realtimeSessionId)

    console.log('\n✅ All tests completed!')
    console.log('\n📋 Expected behavior:')
    console.log('  - Tests 1 & 2: Should return cards mode with stamp details')
    console.log('  - Tests 3, 4, 6: Should return comparison mode with multiple stamp IDs')
    console.log('  - Test 5: Should return cards mode for detail view')
    console.log('  - Tests 7-8: Realtime API should integrate with vector search')
    console.log('\n🔍 Check the console output above to verify the structured data responses.')
}

// Run the tests
runTests().catch(console.error)
