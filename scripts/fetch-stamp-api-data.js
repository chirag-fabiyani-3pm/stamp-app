#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const API_BASE_URL = 'https://decoded-app-stamp-api-prod-01.azurewebsites.net';
const OUTPUT_FILE = 'stamp_master_catalog.ndjson';
const CREDENTIALS = {
    username: "harshit.joshi@decoded.digital",
    password: "harshit",
    deviceId: "stamp-fetcher-script",
    isAppleDevice: true
};
const CATALOG_EXTRACTION_PROCESS_ID = "254c793b-16d0-40a3-8b10-66d987b54474";
const PAGE_SIZE = 200;
const EXPECTED_TOTAL_STAMPS = 1915;

// Global variables
let authToken = null;
let totalStampsFetched = 0;
let currentPage = 1;

// Utility function to make HTTP requests
async function makeRequest(url, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'StampFetcher/1.0',
            ...(authToken && { 'Authorization': `Bearer ${authToken}` })
        }
    };

    const finalOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };

    try {
        const response = await fetch(url, finalOptions);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ HTTP Error ${response.status}:`, errorText);
            throw new Error(`HTTP ${response.status}: ${response.statusText}\nResponse: ${errorText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
            console.error(`❌ JSON parsing failed for ${url}. Response might not be JSON.`);
        }
        console.error(`❌ Request failed for ${url}:`, error.message);
        throw error;
    }
}

// Step 1: Authenticate and get token
async function authenticate() {
    console.log('🔐 Authenticating with API...');

    const sessionUrl = `${API_BASE_URL}/api/v1/Session`;

    const response = await makeRequest(sessionUrl, {
        method: 'POST',
        body: JSON.stringify(CREDENTIALS)
    });

    // Try different possible token field names
    const token = response.jwt || response.token || response.accessToken || response.authToken || response.access_token;

    if (token) {
        authToken = token;
        console.log('✅ Authentication successful!');
        console.log(`🎫 Token: ${authToken.substring(0, 20)}...`);
        return authToken;
    } else {
        console.log('❌ Full authentication response:', JSON.stringify(response, null, 2));
        throw new Error('Authentication failed: No token received in response');
    }
}

// Step 2: Fetch stamp data with pagination
async function fetchStampPage(pageNumber) {
    const url = `${API_BASE_URL}/api/v1/StampMasterCatalog/Published?pageNumber=${pageNumber}&pageSize=${PAGE_SIZE}&catalogExtractionProcessId=${CATALOG_EXTRACTION_PROCESS_ID}`;

    console.log(`📄 Fetching page ${pageNumber} (${PAGE_SIZE} stamps per page)...`);

    const response = await makeRequest(url, {
        method: 'GET'
    });

    // Handle different response structures - try 'items' first (most likely), then 'data'
    const stamps = response.items || response.data || [];
    const totalCount = response.totalCount || 0;
    const hasNextPage = response.hasNextPage !== undefined ? response.hasNextPage : (stamps.length === PAGE_SIZE);

    if (Array.isArray(stamps) && stamps.length > 0) {
        console.log(`✅ Page ${pageNumber}: Received ${stamps.length} stamps`);
        return {
            stamps: stamps,
            totalCount: totalCount,
            hasMorePages: hasNextPage
        };
    } else {
        console.log(`⚠️  Page ${pageNumber}: No stamps received`);
        return {
            stamps: [],
            totalCount: totalCount,
            hasMorePages: false
        };
    }
}

// Step 3: Fetch all stamp data with pagination
async function fetchAllStamps() {
    console.log('📊 Starting to fetch all stamp data...');

    const outputPath = path.resolve(OUTPUT_FILE);

    // Clear/create output file
    fs.writeFileSync(outputPath, '', 'utf8');
    console.log(`📝 Created output file: ${outputPath}`);

    let hasMorePages = true;
    let totalCount = 0;

    while (hasMorePages) {
        try {
            const pageResult = await fetchStampPage(currentPage);

            if (pageResult.stamps.length === 0) {
                console.log(`🔚 No more stamps found on page ${currentPage}`);
                break;
            }

            // Update total count from first page
            if (currentPage === 1 && pageResult.totalCount > 0) {
                totalCount = pageResult.totalCount;
                console.log(`📊 API reports total stamps available: ${totalCount}`);
            }

            // Write stamps to NDJSON file (one JSON object per line)
            for (const stamp of pageResult.stamps) {
                fs.appendFileSync(outputPath, JSON.stringify(stamp) + '\n', 'utf8');
                totalStampsFetched++;
            }

            console.log(`✅ Page ${currentPage} processed. Total stamps so far: ${totalStampsFetched}`);

            // Check if we have more pages
            hasMorePages = pageResult.hasMorePages && pageResult.stamps.length === PAGE_SIZE;
            currentPage++;

            // Add a small delay to be respectful to the API
            await new Promise(resolve => setTimeout(resolve, 500));

        } catch (error) {
            console.error(`❌ Error fetching page ${currentPage}:`, error.message);

            // Try to continue with next page after error
            console.log('⏭️  Attempting to continue with next page...');
            currentPage++;

            // If we've had too many consecutive errors, stop
            if (currentPage > 100) { // Safety net
                console.error('🛑 Too many pages attempted, stopping to prevent infinite loop');
                break;
            }
        }
    }

    return totalStampsFetched;
}

// Step 4: Validate and report results
function validateResults() {
    console.log('\n📊 FETCH RESULTS:');
    console.log('================');
    console.log(`✅ Total stamps fetched: ${totalStampsFetched}`);
    console.log(`🎯 Expected stamps: ${EXPECTED_TOTAL_STAMPS}`);
    console.log(`📄 Pages processed: ${currentPage - 1}`);

    if (fs.existsSync(OUTPUT_FILE)) {
        const stats = fs.statSync(OUTPUT_FILE);
        console.log(`📁 Output file: ${OUTPUT_FILE}`);
        console.log(`💾 File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

        // Count lines in file to verify
        const content = fs.readFileSync(OUTPUT_FILE, 'utf8');
        const lineCount = content.split('\n').filter(line => line.trim()).length;
        console.log(`📝 Lines in file: ${lineCount}`);

        if (lineCount === totalStampsFetched) {
            console.log('✅ File line count matches fetched count');
        } else {
            console.log('⚠️  File line count does not match fetched count');
        }
    }

    const percentage = totalStampsFetched > 0 ? ((totalStampsFetched / EXPECTED_TOTAL_STAMPS) * 100).toFixed(1) : 0;
    console.log(`📈 Completion: ${percentage}%`);

    if (totalStampsFetched >= EXPECTED_TOTAL_STAMPS * 0.95) {
        console.log('🎉 SUCCESS: Fetched majority of expected stamps!');
    } else if (totalStampsFetched > 0) {
        console.log('⚠️  WARNING: Fetched fewer stamps than expected');
    } else {
        console.log('❌ ERROR: No stamps were fetched');
    }
}

// Main execution function
async function main() {
    console.log('🚀 STAMP API DATA FETCHER');
    console.log('==========================');
    console.log(`🎯 Target: ${EXPECTED_TOTAL_STAMPS} stamps`);
    console.log(`📄 Page size: ${PAGE_SIZE} stamps`);
    console.log(`📁 Output: ${OUTPUT_FILE}`);
    console.log('');

    try {
        // Step 1: Authenticate
        await authenticate();

        // Step 2: Fetch all stamp data
        const totalFetched = await fetchAllStamps();

        // Step 3: Validate and report
        validateResults();

        console.log('\n🎉 Script completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Script failed:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

// Handle process interruption gracefully
process.on('SIGINT', () => {
    console.log('\n\n⏹️  Script interrupted by user');
    validateResults();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n\n⏹️  Script terminated');
    validateResults();
    process.exit(0);
});

// Run the script
if (require.main === module) {
    main();
}

module.exports = { main, authenticate, fetchStampPage, fetchAllStamps };
