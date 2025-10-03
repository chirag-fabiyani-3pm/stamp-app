#!/usr/bin/env node

/**
 * Voice Comparison Test Script
 * 
 * This script tests the voice comparison functionality across all scenarios
 * defined in the test plan.
 */

const BASE_URL = 'http://localhost:3000'

// Test scenarios from the test plan
const testScenarios = [
    // 1. Direct Comparison Queries
    {
        name: "Direct Comparison - Orange vs Red",
        transcript: "Compare 1d orange and 1d red stamps",
        expectedMode: "comparison",
        expectedStampCount: 2,
        description: "Should return comparison mode with 2 stamp IDs"
    },
    {
        name: "Direct Comparison - Orange Vermilion vs Red Vermilion",
        transcript: "Show me comparison between orange vermilion and red vermilion",
        expectedMode: "comparison",
        expectedStampCount: 2,
        description: "Should return comparison mode with 2 stamp IDs"
    },
    {
        name: "Direct Comparison - VS Format",
        transcript: "Compare these two stamps: 1d orange vs 1d red",
        expectedMode: "comparison",
        expectedStampCount: 2,
        description: "Should return comparison mode with 2 stamp IDs"
    },
    {
        name: "Direct Comparison - Simple",
        transcript: "I want to compare the orange and red stamps",
        expectedMode: "comparison",
        expectedStampCount: 2,
        description: "Should return comparison mode with 2 stamp IDs"
    },

    // 2. Sequential Search + Comparison
    {
        name: "Sequential - Orange then Compare with Red",
        steps: [
            { transcript: "1d bright orange vermilion stamp", expectedMode: "cards" },
            { transcript: "compare it with 1d red vermilion", expectedMode: "comparison", expectedStampCount: 2 }
        ],
        description: "First search returns cards, second returns comparison"
    },
    {
        name: "Sequential - Show Orange then Compare",
        steps: [
            { transcript: "show me orange stamp", expectedMode: "cards" },
            { transcript: "now compare with red stamp", expectedMode: "comparison", expectedStampCount: 2 }
        ],
        description: "First search returns cards, second returns comparison"
    },

    // 3. Context-Based Comparison
    {
        name: "Context - Compare with Previous",
        steps: [
            { transcript: "1d orange stamp", expectedMode: "cards" },
            { transcript: "compare it with the red one", expectedMode: "comparison", expectedStampCount: 2 }
        ],
        description: "Uses context from previous search"
    },
    {
        name: "Context - Compare Both",
        steps: [
            { transcript: "show orange stamp", expectedMode: "cards" },
            { transcript: "compare with red vermilion", expectedMode: "comparison", expectedStampCount: 2 }
        ],
        description: "Uses context stamp + searches for new stamp"
    },

    // 4. Multiple Stamp Context
    {
        name: "Multiple Context - Compare Them",
        steps: [
            { transcript: "1d orange stamp", expectedMode: "cards" },
            { transcript: "1d red stamp", expectedMode: "cards" },
            { transcript: "compare them", expectedMode: "comparison", expectedStampCount: 2 }
        ],
        description: "Uses multiple previous searches for comparison"
    },

    // 5. Edge Cases
    {
        name: "Edge Case - Vague Comparison",
        transcript: "Compare stamp",
        expectedMode: "clarify",
        description: "Should request clarification"
    },
    {
        name: "Edge Case - Single Stamp",
        transcript: "Compare orange stamp",
        expectedMode: "clarify",
        description: "Should request clarification for second stamp"
    }
]

async function testVoiceComparison() {
    console.log('🧪 Starting Voice Comparison Tests\n')

    let passedTests = 0
    let totalTests = 0

    for (const scenario of testScenarios) {
        console.log(`\n📋 Testing: ${scenario.name}`)
        console.log(`📝 Description: ${scenario.description}`)

        if (scenario.steps) {
            // Multi-step scenario
            const sessionId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            let stepResults = []

            for (let i = 0; i < scenario.steps.length; i++) {
                const step = scenario.steps[i]
                console.log(`  Step ${i + 1}: "${step.transcript}"`)

                try {
                    const result = await testVoiceRequest(step.transcript, sessionId)
                    stepResults.push(result)

                    // Check if this step passed
                    const stepPassed = checkStepResult(result, step, i + 1)
                    if (stepPassed) {
                        console.log(`  ✅ Step ${i + 1} PASSED`)
                    } else {
                        console.log(`  ❌ Step ${i + 1} FAILED`)
                    }
                } catch (error) {
                    console.log(`  ❌ Step ${i + 1} ERROR:`, error.message)
                    stepResults.push({ error: error.message })
                }
            }

            // Overall scenario result
            const allStepsPassed = stepResults.every((result, i) =>
                !result.error && checkStepResult(result, scenario.steps[i], i + 1)
            )

            if (allStepsPassed) {
                console.log(`✅ ${scenario.name} PASSED`)
                passedTests++
            } else {
                console.log(`❌ ${scenario.name} FAILED`)
            }
            totalTests++

        } else {
            // Single-step scenario
            const sessionId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            console.log(`  Transcript: "${scenario.transcript}"`)

            try {
                const result = await testVoiceRequest(scenario.transcript, sessionId)
                const passed = checkStepResult(result, scenario, 1)

                if (passed) {
                    console.log(`✅ ${scenario.name} PASSED`)
                    passedTests++
                } else {
                    console.log(`❌ ${scenario.name} FAILED`)
                }
                totalTests++

            } catch (error) {
                console.log(`❌ ${scenario.name} ERROR:`, error.message)
                totalTests++
            }
        }
    }

    console.log(`\n📊 Test Results:`)
    console.log(`✅ Passed: ${passedTests}/${totalTests}`)
    console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`)
    console.log(`📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`)

    if (passedTests === totalTests) {
        console.log(`\n🎉 All tests passed! Voice comparison is working correctly.`)
    } else {
        console.log(`\n⚠️ Some tests failed. Check the implementation.`)
    }
}

async function testVoiceRequest(transcript, sessionId) {
    const response = await fetch(`${BASE_URL}/api/voice-vector-search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            transcript,
            sessionId,
            mode: 'precise'
        })
    })

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`  Response:`, {
        success: data.success,
        mode: data.structured?.mode,
        stampCount: data.structured?.stampIds?.length || data.structured?.cards?.length || 0,
        hasError: !!data.error
    })

    return data
}

function checkStepResult(result, expected, stepNumber) {
    if (result.error) {
        console.log(`  ❌ Request failed: ${result.error}`)
        return false
    }

    if (!result.success) {
        console.log(`  ❌ Response not successful`)
        return false
    }

    const actualMode = result.structured?.mode
    const expectedMode = expected.expectedMode

    if (actualMode !== expectedMode) {
        console.log(`  ❌ Mode mismatch: expected "${expectedMode}", got "${actualMode}"`)
        return false
    }

    if (expected.expectedStampCount) {
        const actualCount = result.structured?.stampIds?.length || result.structured?.cards?.length || 0
        if (actualCount < expected.expectedStampCount) {
            console.log(`  ❌ Stamp count mismatch: expected at least ${expected.expectedStampCount}, got ${actualCount}`)
            return false
        }
    }

    return true
}

// Run the tests
if (require.main === module) {
    testVoiceComparison().catch(console.error)
}

module.exports = { testVoiceComparison, testScenarios }
