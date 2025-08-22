#!/usr/bin/env node

/**
 * 📦 NEW API DATA CHUNKER
 * 
 * This script takes the new API data (stamp_master_catalog.ndjson)
 * and creates chunks of 2500 records for upload while preserving ALL fields.
 * 
 * Usage: node scripts/chunk-new-api-data.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const INPUT_FILE = 'stamp_master_catalog.ndjson';
const OUTPUT_DIR = 'stamp_database_by_type';
const CHUNK_SIZE = 2500;

class NewApiDataChunker {
    constructor() {
        this.stats = {
            totalRecords: 0,
            chunksCreated: 0,
            fileSizes: {},
            errors: []
        };
    }

    log(message, level = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌',
            progress: '🔄'
        }[level] || 'ℹ️';

        console.log(`${prefix} [${timestamp}] ${message}`);
    }

    async createOutputDirectory() {
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR, { recursive: true });
            this.log(`Created output directory: ${OUTPUT_DIR}`);
        }
    }

    async loadApiData() {
        this.log(`Loading new API data from: ${INPUT_FILE}`);

        if (!fs.existsSync(INPUT_FILE)) {
            throw new Error(`Input file not found: ${INPUT_FILE}`);
        }

        const content = fs.readFileSync(INPUT_FILE, 'utf8');

        // Handle NDJSON format (newline-delimited JSON)
        const lines = content.trim().split('\n');
        const data = lines.map((line, index) => {
            try {
                return JSON.parse(line);
            } catch (error) {
                this.stats.errors.push(`Failed to parse line ${index + 1}: ${error.message}`);
                return null;
            }
        }).filter(record => record !== null);

        this.stats.totalRecords = data.length;
        this.log(`Loaded ${data.length.toLocaleString()} records from NDJSON`);

        return data;
    }

    cleanNullValues(record) {
        // Remove fields with null values while preserving all other data
        const cleaned = {};
        Object.entries(record).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                cleaned[key] = value;
            }
        });
        return cleaned;
    }

    async createChunks(data) {
        this.log(`Creating chunks with ${CHUNK_SIZE.toLocaleString()} records each...`);

        const chunks = [];
        const totalChunks = Math.ceil(data.length / CHUNK_SIZE);

        for (let i = 0; i < totalChunks; i++) {
            const startIndex = i * CHUNK_SIZE;
            const endIndex = Math.min(startIndex + CHUNK_SIZE, data.length);
            const chunk = data.slice(startIndex, endIndex);

            chunks.push({
                index: i + 1,
                data: chunk,
                recordCount: chunk.length,
                startId: chunk[0]?.id || 'unknown',
                endId: chunk[chunk.length - 1]?.id || 'unknown'
            });
        }

        this.log(`Created ${chunks.length} chunks`);
        return chunks;
    }

    async writeChunkFiles(chunks) {
        const chunkDir = path.join(OUTPUT_DIR, 'chunks');
        if (!fs.existsSync(chunkDir)) {
            fs.mkdirSync(chunkDir, { recursive: true });
        }

        this.log('Writing chunk files...');

        for (const chunk of chunks) {
            const filename = `stamp_database_new_api_chunk_${chunk.index.toString().padStart(2, '0')}_${chunk.recordCount}_records.json`;
            const filepath = path.join(chunkDir, filename);

            try {
                // Clean null values while preserving all other data
                const cleanedChunk = chunk.data.map(record => this.cleanNullValues(record));

                // Write with compact formatting to reduce size
                const content = JSON.stringify(cleanedChunk);
                fs.writeFileSync(filepath, content, 'utf8');

                const sizeMB = (fs.statSync(filepath).size / (1024 * 1024)).toFixed(2);
                this.stats.fileSizes[chunk.index] = sizeMB;
                this.stats.chunksCreated++;

                this.log(`📦 Chunk ${chunk.index}: ${filename} (${sizeMB} MB)`);
            } catch (error) {
                this.log(`❌ Failed to write chunk ${chunk.index}: ${error.message}`, 'error');
                this.stats.errors.push(`Failed to write chunk ${chunk.index}: ${error.message}`);
            }
        }
    }

    async createSummaryReport() {
        const summaryFile = path.join(OUTPUT_DIR, 'NEW_API_CHUNK_SUMMARY.md');

        let content = `# 📦 New API Data Chunk Summary

Generated on: ${new Date().toISOString()}

## 📈 Statistics

- **Total Records**: ${this.stats.totalRecords.toLocaleString()}
- **Chunks Created**: ${this.stats.chunksCreated}
- **Chunk Size**: ${CHUNK_SIZE.toLocaleString()} records per chunk
- **Total Size**: ${Object.values(this.stats.fileSizes).reduce((sum, size) => sum + parseFloat(size), 0).toFixed(2)} MB

## 📁 Generated Chunks

| Chunk | Records | File Size | File Name |
|-------|---------|-----------|-----------|
`;

        // Sort chunks by index
        const sortedChunks = Object.entries(this.stats.fileSizes)
            .sort(([a], [b]) => parseInt(a) - parseInt(b));

        for (const [chunkIndex, fileSize] of sortedChunks) {
            const recordCount = chunkIndex == Math.ceil(this.stats.totalRecords / CHUNK_SIZE)
                ? this.stats.totalRecords % CHUNK_SIZE || CHUNK_SIZE
                : CHUNK_SIZE;

            content += `| ${chunkIndex} | ${recordCount.toLocaleString()} | ${fileSize} MB | \`stamp_database_new_api_chunk_${chunkIndex.toString().padStart(2, '0')}_${recordCount}_records.json\` |\n`;
        }

        content += `
## 🎯 Upload Strategy

Since the new API data has a unified structure with comprehensive information,
you can upload chunks in any order. Each chunk contains complete stamp records
with all fields including image URLs.

## 📋 Upload Commands

\`\`\`bash
# Upload all chunks
node scripts/upload-stamp-database-to-vectorstore.js --file stamp_database_by_type/chunks/stamp_database_new_api_chunk_*.json

# Or upload specific chunks
node scripts/upload-stamp-database-to-vectorstore.js --file stamp_database_by_type/chunks/stamp_database_new_api_chunk_01_*.json
node scripts/upload-stamp-database-to-vectorstore.js --file stamp_database_by_type/chunks/stamp_database_new_api_chunk_02_*.json
# ... etc
\`\`\`

## ⚠️ Notes

- Each chunk contains exactly ${CHUNK_SIZE.toLocaleString()} records (except the last chunk)
- **ALL fields are preserved** including:
  - Image URLs: \`stampImageUrl\`, \`stampImageHighRes\`, \`stampImageAlt\`
  - Technical details: \`perforationName\`, \`paperTypeName\`, \`printingMethod\`
  - Market info: \`rarityRating\`, \`rarityScore\`, \`auctionFrequency\`
  - Varieties: \`varietyType\`, \`varietyCount\`, \`errorType\`
  - And many more fields
- Only null/undefined values are removed to clean the data
- Files are optimized for vector store upload
- Can be uploaded incrementally to test each chunk
`;

        if (this.stats.errors.length > 0) {
            content += `
## ❌ Errors Encountered

${this.stats.errors.map(error => `- ${error}`).join('\n')}
`;
        }

        fs.writeFileSync(summaryFile, content, 'utf8');
        this.log(`📝 Summary report written: ${summaryFile}`);
    }

    async run() {
        try {
            this.log('🚀 Starting New API Data Chunking');

            // Create output directory
            await this.createOutputDirectory();

            // Load API data
            const data = await this.loadApiData();

            // Create chunks
            const chunks = await this.createChunks(data);

            // Write chunk files
            await this.writeChunkFiles(chunks);

            // Create summary report
            await this.createSummaryReport();

            // Final statistics
            this.log('🎉 New API data chunking completed successfully!', 'success');
            this.log(`📊 Total records processed: ${this.stats.totalRecords.toLocaleString()}`);
            this.log(`📁 Files created in: ${OUTPUT_DIR}/chunks/`);
            this.log(`📦 Total chunks created: ${this.stats.chunksCreated}`);

            if (this.stats.errors.length > 0) {
                this.log(`⚠️  ${this.stats.errors.length} errors encountered`, 'warning');
            }

        } catch (error) {
            this.log(`❌ Chunking failed: ${error.message}`, 'error');
            process.exit(1);
        }
    }
}

// Main execution
if (require.main === module) {
    const chunker = new NewApiDataChunker();
    chunker.run().catch(error => {
        console.error('❌ Fatal error:', error.message);
        process.exit(1);
    });
}

module.exports = NewApiDataChunker;
