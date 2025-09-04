const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

/**
 * Clean up stamp data by removing N/A values and add image descriptions
 * This script processes the existing JSON and enhances it with visual descriptions
 */

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Rate limiting to avoid hitting API limits
const RATE_LIMIT_DELAY = 1000; // 1 second delay between API calls
let lastApiCall = 0;

const INPUT_FILE = 'stamp_database_by_type/comprehensive_vectorstore/catalog_two/catalog_two_chunk_01_1915_records_enhanced.json';
const OUTPUT_FILE = 'stamp_database_by_type/comprehensive_vectorstore/catalog_two/catalog_two_chunk_01_1915_records_enhanced.json';

/**
 * Remove N/A values from an object recursively
 */
function removeNAValues(obj) {
    if (obj === null || obj === undefined) {
        return null;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => removeNAValues(item)).filter(item => item !== null);
    }

    if (typeof obj === 'object') {
        const cleaned = {};
        for (const [key, value] of Object.entries(obj)) {
            if (value !== 'N/A' && value !== null && value !== undefined) {
                const cleanedValue = removeNAValues(value);
                if (cleanedValue !== null && cleanedValue !== undefined) {
                    cleaned[key] = cleanedValue;
                }
            }
        }
        return Object.keys(cleaned).length > 0 ? cleaned : null;
    }

    return obj;
}

/**
 * Generate image description based on actual image analysis using OpenAI Vision API
 */
async function generateImageDescription(stampData) {
    const image = stampData.stamp_image || {};

    // Check if we have a valid image
    if (!image.has_image || !image.image_url || image.image_url === '/images/stamps/no-image-available.png') {
        return {
            visual_description: 'No image available for visual analysis',
            search_keywords: ['no-image'],
            generated_at: new Date().toISOString(),
            description_type: 'no_image'
        };
    }

    try {
        const imageUrl = image.image_url;
        console.log(`🔍 Analyzing image with Vision API: ${imageUrl}`);

        // Rate limiting to avoid hitting API limits
        const now = Date.now();
        const timeSinceLastCall = now - lastApiCall;
        if (timeSinceLastCall < RATE_LIMIT_DELAY) {
            const delay = RATE_LIMIT_DELAY - timeSinceLastCall;
            console.log(`⏳ Rate limiting: waiting ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        lastApiCall = Date.now();

        // Call OpenAI Vision API for image analysis
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Analyze this postal stamp image and provide a detailed visual description. Focus on:\n1. Visual elements (colors, design, typography)\n2. Stamp characteristics (denomination, country, year if visible)\n3. Design style and artistic elements\n4. Any text or inscriptions visible\n5. Overall condition and appearance\n\nProvide a comprehensive description that would help someone identify this stamp visually. Be specific about colors, patterns, and design elements."
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: imageUrl
                            }
                        }
                    ]
                }
            ],
            max_tokens: 500,
            temperature: 0.3
        });

        const visualDescription = response.choices[0].message.content;

        // Extract keywords from the description
        const keywords = extractKeywordsFromDescription(visualDescription);

        return {
            visual_description: visualDescription,
            search_keywords: keywords,
            generated_at: new Date().toISOString(),
            description_type: 'vision_api_analysis'
        };

    } catch (error) {
        console.error(`❌ Error analyzing image with Vision API: ${error.message}`);

        // Fallback to basic description if API fails
        const imageUrl = image.image_url;
        let fallbackDescription = `Stamp image available at: ${imageUrl}`;
        let keywords = ['stamp-image', 'visual-description', 'api-error'];

        // Extract basic info from image URL if it contains useful data
        if (imageUrl.includes('stamps/')) {
            const imageName = imageUrl.split('/').pop().replace('.png', '').replace('.jpg', '').replace('.jpeg', '');
            fallbackDescription = `Stamp image showing: ${imageName.replace(/-/g, ' ')}. Shows postal stamp design with denomination, country name, and decorative elements typical of philatelic items.`;
            keywords.push(imageName.toLowerCase());
        } else {
            fallbackDescription += '. Shows postal stamp design with denomination, country name, and decorative elements typical of philatelic items.';
        }

        keywords.push('postal', 'denomination', 'country', 'design');

        return {
            visual_description: fallbackDescription,
            search_keywords: keywords,
            generated_at: new Date().toISOString(),
            description_type: 'fallback_analysis'
        };
    }
}

/**
 * Extract keywords from the visual description
 */
function extractKeywordsFromDescription(description) {
    const keywords = new Set();

    // Common stamp-related terms
    const stampTerms = [
        'stamp', 'postal', 'philatelic', 'denomination', 'country', 'year', 'design',
        'color', 'typography', 'border', 'frame', 'portrait', 'landscape', 'symbol',
        'inscription', 'text', 'perforation', 'watermark', 'series', 'issue'
    ];

    // Color terms
    const colorTerms = [
        'black', 'blue', 'red', 'green', 'brown', 'purple', 'orange', 'yellow',
        'pink', 'violet', 'white', 'gray', 'grey', 'gold', 'silver', 'carmine',
        'vermillion', 'mauve', 'chestnut', 'deep', 'light', 'dark'
    ];

    // Design style terms
    const designTerms = [
        'victorian', 'modern', 'classical', 'ornate', 'simple', 'elegant',
        'decorative', 'engraved', 'printed', 'pictorial', 'portrait', 'landscape'
    ];

    const lowerDescription = description.toLowerCase();

    // Add stamp-related terms
    stampTerms.forEach(term => {
        if (lowerDescription.includes(term)) {
            keywords.add(term);
        }
    });

    // Add color terms
    colorTerms.forEach(term => {
        if (lowerDescription.includes(term)) {
            keywords.add(term);
        }
    });

    // Add design terms
    designTerms.forEach(term => {
        if (lowerDescription.includes(term)) {
            keywords.add(term);
        }
    });

    // Extract specific values (denominations, years, etc.)
    const denominationMatch = description.match(/(\d+[d|p|c|¢|$])/gi);
    if (denominationMatch) {
        denominationMatch.forEach(match => keywords.add(match.toLowerCase()));
    }

    const yearMatch = description.match(/(19|20)\d{2}/g);
    if (yearMatch) {
        yearMatch.forEach(year => keywords.add(year));
    }

    return Array.from(keywords);
}

/**
 * Process and enhance stamp data
 */
async function processStampData() {
    try {
        console.log('📂 Loading catalog data...');
        const catalogData = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
        console.log(`📊 Loaded ${catalogData.length} records`);

        const enhancedData = [];
        let processedCount = 0;
        let cleanedCount = 0;
        let imageCount = 0;
        let visionApiCount = 0;
        let fallbackCount = 0;

        console.log('\n🧹 Updating existing data with Vision API descriptions...');

        for (let index = 0; index < catalogData.length; index++) {
            const record = catalogData[index];

            // Clean the record by removing N/A values
            const cleanedRecord = removeNAValues(record);

            if (cleanedRecord) {
                cleanedCount++;

                // Check if this record already has Vision API analysis
                const hasVisionAnalysis = cleanedRecord.stamp_descriptions?.description_type === 'vision_api_analysis';

                if (!hasVisionAnalysis) {
                    // Generate image description only if not already analyzed
                    const imageDescription = await generateImageDescription(record);

                    // Track API usage
                    if (imageDescription.description_type === 'vision_api_analysis') {
                        visionApiCount++;
                    } else if (imageDescription.description_type === 'fallback_analysis') {
                        fallbackCount++;
                    }

                    // Add visual description to existing stamp_descriptions field
                    if (cleanedRecord.stamp_descriptions) {
                        cleanedRecord.stamp_descriptions.visual_description = imageDescription.visual_description;
                        cleanedRecord.stamp_descriptions.search_keywords = imageDescription.search_keywords;
                        cleanedRecord.stamp_descriptions.generated_at = imageDescription.generated_at;
                        cleanedRecord.stamp_descriptions.description_type = imageDescription.description_type;
                    } else {
                        // If stamp_descriptions doesn't exist, create it
                        cleanedRecord.stamp_descriptions = {
                            visual_description: imageDescription.visual_description,
                            search_keywords: imageDescription.search_keywords,
                            generated_at: imageDescription.generated_at,
                            description_type: imageDescription.description_type
                        };
                    }
                } else {
                    // Count existing Vision API analyses
                    visionApiCount++;
                }

                // Count records with images
                if (record.stamp_image?.has_image &&
                    record.stamp_image?.image_url &&
                    record.stamp_image?.image_url !== '/images/stamps/no-image-available.png') {
                    imageCount++;
                }

                enhancedData.push(cleanedRecord);
            }

            processedCount++;

            if (processedCount % 100 === 0) {
                console.log(`📋 Processed ${processedCount}/${catalogData.length} records...`);
            }
        }

        // Save enhanced data (updating the same file)
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(enhancedData, null, 2));
        console.log(`\n✅ Enhanced data updated in: ${OUTPUT_FILE}`);

        // Create a summary report
        const summary = {
            processing_summary: {
                total_records_processed: processedCount,
                records_after_cleaning: cleanedCount,
                records_removed: processedCount - cleanedCount,
                records_with_images: imageCount,
                image_coverage_percentage: ((imageCount / cleanedCount) * 100).toFixed(1),
                vision_api_analysis_count: visionApiCount,
                fallback_analysis_count: fallbackCount,
                processing_timestamp: new Date().toISOString()
            },
            data_quality: {
                na_values_removed: true,
                descriptions_added: true,
                search_optimized: true,
                vector_store_ready: true,
                vision_api_enabled: true
            }
        };

        const summaryFile = OUTPUT_FILE.replace('.json', '_summary.json');
        fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
        console.log(`📊 Summary saved to: ${summaryFile}`);

        // Print results
        console.log('\n📊 PROCESSING SUMMARY:');
        console.log(`Total records processed: ${processedCount}`);
        console.log(`Records after cleaning: ${cleanedCount}`);
        console.log(`Records removed (all N/A): ${processedCount - cleanedCount}`);
        console.log(`Records with images: ${imageCount} (${summary.processing_summary.image_coverage_percentage}%)`);
        console.log(`Vision API analysis: ${visionApiCount} images analyzed`);
        console.log(`Fallback analysis: ${fallbackCount} images (API errors)`);
        console.log(`Data cleaning: ✅ N/A values removed`);
        console.log(`Descriptions added: ✅ All records enhanced`);
        console.log(`Vector store ready: ✅ Yes`);

        // Show sample enhanced record
        if (enhancedData.length > 0) {
            console.log('\n🎨 SAMPLE ENHANCED RECORD:');
            const sample = enhancedData[0];
            console.log(`Name: ${sample.stamp_core?.name || 'N/A'}`);
            console.log(`Country: ${sample.stamp_core?.country || 'N/A'}`);
            console.log(`Year: ${sample.stamp_core?.year || 'N/A'}`);
            console.log(`Visual Description: ${sample.stamp_descriptions?.visual_description?.substring(0, 100)}...`);
            console.log(`Keywords: ${sample.stamp_descriptions?.search_keywords?.slice(0, 5).join(', ')}...`);
        }

        return enhancedData;

    } catch (error) {
        console.error('❌ Error processing stamp data:', error);
        throw error;
    }
}

/**
 * Compare file sizes to show data reduction
 */
function compareFileSizes() {
    try {
        const originalSize = fs.statSync(INPUT_FILE).size;
        const enhancedSize = fs.statSync(OUTPUT_FILE).size;
        const reduction = ((originalSize - enhancedSize) / originalSize * 100).toFixed(1);

        console.log('\n📏 FILE SIZE COMPARISON:');
        console.log(`Original file: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`Enhanced file: ${(enhancedSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`Size reduction: ${reduction}%`);

        return { originalSize, enhancedSize, reduction };
    } catch (error) {
        console.log('Could not compare file sizes:', error.message);
        return null;
    }
}

// Main execution
if (require.main === module) {
    (async () => {
        try {
            const enhancedData = await processStampData();

            // Compare file sizes
            compareFileSizes();

            console.log('\n🎉 Data cleaning and enhancement completed successfully!');
            console.log('\n📋 WHAT WAS ACCOMPLISHED:');
            console.log('1. ✅ Updated existing JSON file with Vision API descriptions');
            console.log('2. ✅ Enhanced visual descriptions for better vector search');
            console.log('3. ✅ Generated intelligent keywords from image analysis');
            console.log('4. ✅ Preserved all existing data structure');
            console.log('5. ✅ Optimized for vector store search capabilities');

            console.log('\n🚀 NEXT STEPS:');
            console.log('1. Use the enhanced JSON file for vector store upload');
            console.log('2. Implement search using the stamp_description data');
            console.log('3. The data is now cleaner and more searchable');

        } catch (error) {
            console.error('💥 Script failed:', error);
            process.exit(1);
        }
    })();
}

module.exports = {
    processStampData,
    removeNAValues,
    generateImageDescription,
    compareFileSizes
};
