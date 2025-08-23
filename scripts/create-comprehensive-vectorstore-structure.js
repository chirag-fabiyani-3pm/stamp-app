const fs = require('fs');
const path = require('path');

/**
 * Script to create COMPREHENSIVE vector store data structure
 * This preserves ALL important fields for complete stamp information
 */

const CHUNKS_DIR = 'stamp_database_by_type/chunks/catalog_one';
const OUTPUT_DIR = 'stamp_database_by_type/comprehensive_vectorstore/catalog_one';

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function createComprehensiveStructure(record, index) {
    return {
        // Clear record identifier
        record_id: record.id,
        record_type: 'stamp',
        record_index: index,
        source_file: 'source_file_placeholder', // Will be set later

        // Core identification (for UI and basic info)
        stamp_core: {
            id: record.id,
            stampId: record.stampId,
            name: record.name,
            catalogNumber: record.catalogNumber,
            country: record.countryName,
            year: record.issueYear,
            denomination: record.denominationDisplay,
            color: record.colorName,
            series: record.seriesName
        },

        // COMPREHENSIVE descriptions (for search and detailed info)
        stamp_descriptions: {
            // Primary description
            description: record.description,

            // Series and group descriptions
            seriesDescription: record.seriesDescription,
            stampGroupDescription: record.stampGroupDescription,
            typeDescription: record.typeDescription,

            // Detailed descriptions
            colorDescription: record.colorDescription,
            paperDescription: record.paperDescription,
            watermarkDescription: record.watermarkDescription,
            perforationDescription: record.perforationDescription,

            // Context and notes
            issueContext: record.issueContext,
            specialNotes: record.specialNotes,
            collectorNotes: record.collectorNotes,
            conditionNotes: record.conditionNotes,
            rarityNotes: record.rarityNotes,
            marketNotes: record.marketNotes,
            researchNotes: record.researchNotes
        },

        // Market and valuation data (for price queries)
        stamp_market: {
            mintValue: record.mintValue,
            usedValue: record.usedValue,
            lastAuctionPrice: record.lastAuctionPrice,
            priceMultiplier: record.priceMultiplier,
            rarityRating: record.rarityRating,
            rarityScore: record.rarityScore,
            rarityScale: record.rarityScale,
            collectingPopularity: record.collectingPopularity,
            exhibitionFrequency: record.exhibitionFrequency
        },

        // Technical specifications (for detailed analysis)
        stamp_technical: {
            paperType: record.paperTypeName,
            paperCode: record.paperCode,
            paperFiber: record.paperFiber,
            paperThickness: record.paperThickness,
            paperOpacity: record.paperOpacity,

            watermark: record.watermarkName,
            watermarkCode: record.watermarkCode,
            watermarkPosition: record.watermarkPosition,
            watermarkClarity: record.watermarkClarity,

            perforation: record.perforationName,
            perforationCode: record.perforationCode,
            perforationMeasurement: record.perforationMeasurement,
            perforationGauge: record.perforationGauge,
            perforationCleanCut: record.perforationCleanCut,
            perforationComb: record.perforationComb,

            printingMethod: record.printingMethod,
            printingProcess: record.printingProcess,
            printingQuality: record.printingQuality,
            printer: record.printer,
            printerLocation: record.printerLocation,
            printerReputation: record.printerReputation,

            designer: record.designer,
            designerNotes: record.designerNotes,
            engraver: record.engraver,
            dieNumber: record.dieNumber,
            plateNumber: record.plateNumber,
            plateCharacteristics: record.plateCharacteristics
        },

        // Varieties and errors (for variety queries)
        stamp_varieties: {
            hasVarieties: record.hasVarieties,
            varietyCount: record.varietyCount,
            varietyType: record.varietyType,
            plateVariety: record.plateVariety,
            perforationVariety: record.perforationVariety,
            colorVariety: record.colorVariety,
            paperVariety: record.paperVariety,
            watermarkVariety: record.watermarkVariety,
            knownError: record.knownError,
            majorVariety: record.majorVariety,
            errorType: record.errorType
        },

        // Historical and philatelic context
        stamp_context: {
            historicalSignificance: record.historicalSignificance,
            culturalImportance: record.culturalImportance,
            philatelicImportance: record.philatelicImportance,
            researchStatus: record.researchStatus,
            bibliography: record.bibliography,

            issueDate: record.issueDate,
            issueLocation: record.issueLocation,
            issuePurpose: record.issuePurpose,
            firstDayIssue: record.firstDayIssue,
            periodStart: record.periodStart,
            periodEnd: record.periodEnd,

            postalHistoryType: record.postalHistoryType,
            postmarkType: record.postmarkType,
            proofType: record.proofType,
            essayType: record.essayType
        },

        // Authentication and certification
        stamp_authentication: {
            authenticationRequired: record.authenticationRequired,
            expertCommittee: record.expertCommittee,
            authenticationPoint: record.authenticationPoint,
            certificateAvailable: record.certificateAvailable,
            commonForgery: record.commonForgery
        },

        // Image data
        stamp_image: record.stampImageUrl ? {
            image_url: record.stampImageUrl,
            has_image: true
        } : {
            image_url: '/images/stamps/no-image-available.png',
            has_image: false
        },

        // Additional metadata
        stamp_metadata: {
            isInstance: record.isInstance,
            parentStampId: record.parentStampId,
            similarityScore: record.similarityScore,
            catalogExtractionProcessId: record.catalogExtractionProcessId,

            sizeWidth: record.sizeWidth,
            sizeHeight: record.sizeHeight,
            sizeFormat: record.sizeFormat,
            theme: record.theme,
            themeCategory: record.themeCategory,
            subject: record.subject,
            artisticStyle: record.artisticStyle,

            printRun: record.printRun,
            estimatedPrintRun: record.estimatedPrintRun,
            sheetsPrinted: record.sheetsPrinted,
            stampsPerSheet: record.stampsPerSheet,
            positionVarieties: record.positionVarieties,

            gumType: record.gumType,
            gumCondition: record.gumCondition,
            paperManufacturer: record.paperManufacturer
        },

        // Clear record boundary marker
        record_end: `---END_RECORD_${record.id}---`
    };
}

function processChunkFileComprehensive(chunkFile) {
    console.log(`\n🔄 Processing: ${chunkFile}`);

    try {
        const data = JSON.parse(fs.readFileSync(chunkFile, 'utf8'));
        console.log(`📊 Found ${data.length} records`);

        const comprehensiveRecords = [];

        data.forEach((record, index) => {
            const comprehensiveRecord = createComprehensiveStructure(record, index);
            comprehensiveRecord.source_file = path.basename(chunkFile);
            comprehensiveRecords.push(comprehensiveRecord);
        });

        // Create output filename
        const baseName = path.basename(chunkFile, '.json');
        const outputFile = path.join(OUTPUT_DIR, `${baseName}.json`);

        // Save comprehensive structure
        fs.writeFileSync(outputFile, JSON.stringify(comprehensiveRecords, null, 2));
        console.log(`✅ Comprehensive data saved to: ${outputFile}`);

        return {
            inputFile: chunkFile,
            outputFile: outputFile,
            recordCount: data.length,
            comprehensiveCount: comprehensiveRecords.length
        };

    } catch (error) {
        console.error(`❌ Error processing ${chunkFile}:`, error.message);
        return null;
    }
}

function processAllChunksComprehensive() {
    console.log('🚀 Processing ALL chunk files for COMPREHENSIVE vector store structure...');
    console.log('📝 This version preserves ALL important fields for complete stamp information');

    // Get all chunk files
    const chunkFiles = fs.readdirSync(CHUNKS_DIR)
        .filter(file => file.endsWith('.json') && file.includes('chunk'))
        .map(file => path.join(CHUNKS_DIR, file))
        .sort();

    console.log(`📁 Found ${chunkFiles.length} chunk files to process`);

    const results = [];

    chunkFiles.forEach(chunkFile => {
        const result = processChunkFileComprehensive(chunkFile);
        if (result) {
            results.push(result);
        }
    });

    // Create summary
    const totalRecords = results.reduce((sum, r) => sum + r.recordCount, 0);
    const totalComprehensive = results.reduce((sum, r) => sum + r.comprehensiveCount, 0);

    console.log('\n📊 Processing Summary:');
    console.log('='.repeat(60));
    results.forEach(result => {
        console.log(`✅ ${path.basename(result.inputFile)}: ${result.recordCount} → ${result.comprehensiveCount} records`);
    });
    console.log('='.repeat(60));
    console.log(`🎯 Total: ${totalRecords} → ${totalComprehensive} records processed`);

    // Create a master index file
    createComprehensiveMasterIndex(results);

    return results;
}

function createComprehensiveMasterIndex(results) {
    const masterIndex = {
        created_at: new Date().toISOString(),
        structure_type: 'comprehensive',
        description: 'Complete stamp data with ALL fields preserved for comprehensive AI responses',
        total_chunks: results.length,
        total_records: results.reduce((sum, r) => sum + r.recordCount, 0),
        chunks: results.map(r => ({
            original_file: path.basename(r.inputFile),
            comprehensive_file: path.basename(r.outputFile),
            record_count: r.recordCount
        }))
    };

    const indexFile = path.join(OUTPUT_DIR, 'COMPREHENSIVE_MASTER_INDEX.json');
    fs.writeFileSync(indexFile, JSON.stringify(masterIndex, null, 2));
    console.log(`📋 Comprehensive master index saved to: ${indexFile}`);
}

function createComprehensiveInstructions() {
    const instructions = `# COMPREHENSIVE Vector Store Data Structure Instructions

## Record Format
Each record contains COMPLETE stamp information with ALL fields preserved:

### Record Boundary
- Start: Each record begins with a unique record_id
- End: Each record ends with "---END_RECORD_{id}---"

### Data Hierarchy (COMPREHENSIVE)
1. **stamp_core**: Primary identification data (for UI and basic info)
2. **stamp_descriptions**: ALL description fields for comprehensive search
3. **stamp_market**: Market values, rarity, and pricing information
4. **stamp_technical**: Complete technical specifications
5. **stamp_varieties**: Variety and error information
6. **stamp_context**: Historical and philatelic context
7. **stamp_authentication**: Authentication and certification details
8. **stamp_image**: Image data with availability check
9. **stamp_metadata**: Additional metadata and characteristics

### AI Instructions for This Data
- ALWAYS respect record boundaries
- NEVER mix data from different records
- Use stamp_core for basic identification
- Use stamp_descriptions for comprehensive search and detailed responses
- Use stamp_market for price and value queries
- Use stamp_technical for detailed technical analysis
- Use stamp_varieties for variety and error queries
- Each record is completely independent

### Search Capabilities
- **Description Search**: Search across ALL description fields
- **Market Queries**: Access to mint/used values, auction prices, rarity
- **Technical Details**: Complete technical specifications
- **Variety Information**: Comprehensive variety and error data
- **Historical Context**: Rich historical and philatelic information

### Example Usage
When searching for stamp ID "abc123":
1. Find the record with record_id: "abc123"
2. Extract data ONLY from that record
3. Use appropriate sections based on query type:
   - Basic info: stamp_core
   - Descriptions: stamp_descriptions
   - Pricing: stamp_market
   - Technical: stamp_technical
   - Varieties: stamp_varieties
4. Stop at the record_end marker

This comprehensive structure enables detailed, accurate AI responses for all types of philatelic queries.
`;

    const instructionsFile = path.join(OUTPUT_DIR, 'COMPREHENSIVE_VECTORSTORE_INSTRUCTIONS.md');
    fs.writeFileSync(instructionsFile, instructions);
    console.log(`📋 Comprehensive vector store instructions saved to: ${instructionsFile}`);
}

// Main execution
try {
    const results = processAllChunksComprehensive();
    createComprehensiveInstructions();

    console.log('\n🎉 COMPREHENSIVE data restructuring complete!');
    console.log('📁 Check the "comprehensive_vectorstore" directory for the new structure.');
    console.log('🚀 This version preserves ALL fields for complete AI responses.');
    console.log('\n💡 Key improvements:');
    console.log('   ✅ ALL description fields preserved');
    console.log('   ✅ Market values and pricing data included');
    console.log('   ✅ Complete technical specifications');
    console.log('   ✅ Variety and error information');
    console.log('   ✅ Historical and philatelic context');
    console.log('   ✅ Authentication and certification details');

} catch (error) {
    console.error('❌ Error during processing:', error);
}
