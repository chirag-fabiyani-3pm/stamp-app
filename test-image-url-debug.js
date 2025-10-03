#!/usr/bin/env node

/**
 * Test script to debug image URL extraction issue
 * Run this to see what the AI is actually returning
 */

const testQuery = "Show me the 1d Bright Orange-Vermilion stamp from New Zealand 1862";

async function testImageUrlExtraction() {
    console.log('🔍 Testing Image URL Extraction...');
    console.log('Query:', testQuery);
    console.log('API Endpoint: /api/philaguide-v2/working');
    console.log('');

    try {
        // Make the API call
        const response = await fetch('http://localhost:3000/api/philaguide-v2/working', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: testQuery,
                sessionId: `test-session-${Date.now()}`,
                isVoiceChat: false
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        console.log('✅ API Response Received:');
        console.log('Success:', result.success);
        console.log('Source:', result.source);
        console.log('Response ID:', result.responseId);
        console.log('');

        console.log('🔍 Content Analysis:');
        console.log('Content length:', result.content?.length || 0);
        console.log('');

        // Check for image URLs in the content
        const content = result.content || '';

        // Look for Image URL field
        const imageUrlMatch = content.match(/Image URL[:\s]*([^\n\r]+)/i);
        if (imageUrlMatch) {
            console.log('🎯 Found Image URL field:', imageUrlMatch[1].trim());
        } else {
            console.log('❌ No Image URL field found in response');
        }

        // Check for placeholder images
        if (content.includes('/images/stamps/no-image-available.png')) {
            console.log('🚨 PROBLEM: Response contains placeholder image!');
        } else {
            console.log('✅ Good: No placeholder images found');
        }

        // Check for Azure blob URLs
        const azureUrls = content.match(/https:\/\/decodedstampstorage01\.blob\.core\.windows\.net[^\s\n\r]+/g);
        if (azureUrls) {
            console.log('✅ Found Azure blob URLs:', azureUrls.length);
            azureUrls.forEach((url, index) => {
                console.log(`  ${index + 1}. ${url}`);
            });
        } else {
            console.log('❌ No Azure blob URLs found');
        }

        // Check for stampImageUrl references
        if (content.includes('stampImageUrl')) {
            console.log('✅ Response mentions stampImageUrl field');
        } else {
            console.log('❌ Response does NOT mention stampImageUrl field');
        }

        console.log('');
        console.log('📋 Full Response Content (first 1000 chars):');
        console.log('='.repeat(80));
        console.log(content.substring(0, 1000));
        if (content.length > 1000) {
            console.log('... (truncated)');
        }
        console.log('='.repeat(80));

    } catch (error) {
        console.error('❌ Error testing API:', error.message);
        console.error('Full error:', error);
    }
}

// Run the test
testImageUrlExtraction().then(() => {
    console.log('');
    console.log('🏁 Test completed. Check the console output above for debug information.');
    console.log('');
    console.log('🔍 Next steps:');
    console.log('1. Look at the debug logs in your server console');
    console.log('2. Check if the AI is using file_search tool');
    console.log('3. Verify if stampImageUrl data is being returned');
    console.log('4. Check if the AI instructions are being followed');
});
