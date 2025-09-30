#!/usr/bin/env node

/**
 * 🚀 UNIFIED STAMP DATA PIPELINE
 * 
 * This script combines all stamp data processing steps into a single pipeline:
 * 1. Fetch data from API → NDJSON
 * 2. Chunk NDJSON into manageable files
 * 3. Build comprehensive vector store structure
 * 4. (Optional) Enhance with Vision API descriptions
 * 
 * All outputs are organized under a single named folder for easy management.
 * 
 * Data hygiene:
 * - Comprehensive outputs prune fields with null values
 * - Enhancement step also prunes null fields after updates
 * 
 * USAGE:
 *   node scripts/unified-stamp-data-pipeline.js --name my_catalog
 *   node scripts/unified-stamp-data-pipeline.js --name production --vision --chunkSize 500
 *   node scripts/unified-stamp-data-pipeline.js --name test --pageSize 100 --chunkSize 250
 * 
 * OPTIONS:
 *   --name, -n        Output folder name (default: catalog_run)
 *   --pageSize        API page size (default: 200)
 *   --chunkSize       Records per chunk file (default: 1000)
 *   --vision          Enable Vision API enhancement (costs money!)
 * 
 * OUTPUT STRUCTURE:
 *   stamp_database_by_type/{name}/
 *   ├── {name}.ndjson                           # Raw API data
 *   ├── chunks/
 *   │   ├── {name}_chunk_01_1000_records.json  # Chunked data
 *   │   └── {name}_chunk_02_500_records.json
 *   └── comprehensive_vectorstore/
 *       ├── {name}_chunk_01_1000_records.json  # Vector store ready
 *       └── {name}_chunk_02_500_records.json
 * 
 * ENVIRONMENT VARIABLES:
 *   OPENAI_API_KEY                    Required for --vision option
 *   STAMP_API_USERNAME                API username (REQUIRED)
 *   STAMP_API_PASSWORD                API password (REQUIRED)
 *   STAMP_API_DEVICE_ID               Device ID (default: stamp-fetcher-script)
 *   STAMP_API_IS_APPLE_DEVICE         true/false (default: true)
 *   STAMP_API_BASE_URL                API base URL (has default)
 *   STAMP_CATALOG_EXTRACTION_PROCESS_ID Process ID (has default)
 * 
 * SETUP:
 *   1. Copy env.example to .env: cp env.example .env
 *   2. Update credentials in .env file
 *   3. Run the pipeline
 * 
 * EXAMPLES:
 *   # Basic run with default settings
 *   node scripts/unified-stamp-data-pipeline.js --name basic_run
 * 
 *   # Production run with smaller chunks and vision enhancement
 *   node scripts/unified-stamp-data-pipeline.js --name production --chunkSize 500 --vision
 * 
 *   # Quick test with smaller page size
 *   node scripts/unified-stamp-data-pipeline.js --name test --pageSize 50 --chunkSize 100
 * 
 *   # Large dataset with bigger chunks (no vision to save costs)
 *   node scripts/unified-stamp-data-pipeline.js --name large --chunkSize 2000
 * 
 * WHAT THIS REPLACES:
 *   - scripts/fetch-stamp-api-data.js (Stage 1)
 *   - scripts/chunk-new-api-data.js (Stage 2) 
 *   - scripts/create-comprehensive-vectorstore-structure.js (Stage 3)
 *   - scripts/clean-and-enhance-stamp-data.js (Stage 4)
 * 
 * The old scripts can be removed after confirming this unified version works correctly.
 */

const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config()

// ==========================
// Configuration (from env or defaults)
// ==========================
const API_BASE_URL = process.env.STAMP_API_BASE_URL || 'https://decoded-app-stamp-api-prod-01.azurewebsites.net'

// Validate required environment variables
if (!process.env.STAMP_API_USERNAME) {
    console.error('❌ STAMP_API_USERNAME environment variable is required')
    console.error('   Please set it in your .env file or environment')
    process.exit(1)
}

if (!process.env.STAMP_API_PASSWORD) {
    console.error('❌ STAMP_API_PASSWORD environment variable is required')
    console.error('   Please set it in your .env file or environment')
    process.exit(1)
}

const CREDENTIALS = {
    username: process.env.STAMP_API_USERNAME,
    password: process.env.STAMP_API_PASSWORD,
    deviceId: process.env.STAMP_API_DEVICE_ID || 'stamp-fetcher-script',
    isAppleDevice: process.env.STAMP_API_IS_APPLE_DEVICE === 'true' || true,
}
const CATALOG_EXTRACTION_PROCESS_ID = process.env.STAMP_CATALOG_EXTRACTION_PROCESS_ID || '254c793b-16d0-40a3-8b10-66d987b54474'
const DEFAULT_PAGE_SIZE = 200
const DEFAULT_CHUNK_SIZE = 1000

// ==========================
// CLI Args
// ==========================
function parseArgs() {
    const args = process.argv.slice(2)
    const parsed = {}
    for (let i = 0; i < args.length; i++) {
        const arg = args[i]
        if (arg.startsWith('--')) {
            const key = arg.replace(/^--/, '')
            const next = args[i + 1]
            if (next && !next.startsWith('--')) {
                parsed[key] = next
                i++
            } else {
                parsed[key] = true
            }
        }
    }
    return parsed
}

// ==========================
// HTTP helper
// ==========================
let authToken = null
async function makeRequest(url, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'StampPipeline/1.0',
            ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
    }

    const finalOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    }

    const res = await fetch(url, finalOptions)
    if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(`HTTP ${res.status}: ${res.statusText}\n${text}`)
    }
    return res.json()
}

async function authenticate() {
    console.log('🔐 Authenticating...')
    const sessionUrl = `${API_BASE_URL}/api/v1/Session`
    const response = await makeRequest(sessionUrl, { method: 'POST', body: JSON.stringify(CREDENTIALS) })
    const token = response.jwt || response.token || response.accessToken || response.authToken || response.access_token
    if (!token) throw new Error('No token in auth response')
    authToken = token
    console.log('✅ Authenticated')
}

// ==========================
// Stage 1: Fetch NDJSON
// ==========================
async function fetchAllStampsToNdjson(outDir, baseName, pageSize = DEFAULT_PAGE_SIZE) {
    const outputFile = path.join(outDir, `${baseName}.ndjson`)
    fs.mkdirSync(outDir, { recursive: true })
    fs.writeFileSync(outputFile, '', 'utf8')

    let currentPage = 1
    let totalFetched = 0
    let expectedTotal = 0
    let hasMore = true

    while (hasMore) {
        const url = `${API_BASE_URL}/hierarchy?pageNumber=${currentPage}&pageSize=${pageSize}&catalogExtractionProcessId=${CATALOG_EXTRACTION_PROCESS_ID}`
        console.log(`📄 Fetching page ${currentPage}...`)
        const response = await makeRequest(url, { method: 'GET' })
        const stamps = response.baseItems || response.items || response.data || []
        const totalCount = response.totalInstances || response.totalCount || 0
        if (currentPage === 1) {
            expectedTotal = totalCount
            console.log(`📊 API total count: ${expectedTotal}`)
        }
        if (!Array.isArray(stamps) || stamps.length === 0) break
        for (const stamp of stamps) {
            fs.appendFileSync(outputFile, JSON.stringify(stamp) + '\n', 'utf8')
            totalFetched++
        }
        console.log(`✅ Page ${currentPage} done. Total: ${totalFetched}`)
        hasMore = response.hasNextPage !== undefined ? response.hasNextPage : stamps.length === pageSize
        currentPage++
        await new Promise((r) => setTimeout(r, 400))
    }

    return { outputFile, totalFetched, expectedTotal, pages: currentPage - 1 }
}

// ==========================
// Stage 2: Chunk NDJSON
// ==========================
function loadNdjson(file) {
    const content = fs.readFileSync(file, 'utf8')
    return content
        .split('\n')
        .filter((l) => l.trim())
        .map((l, i) => {
            try {
                return JSON.parse(l)
            } catch (e) {
                console.warn(`⚠️ Bad NDJSON at line ${i + 1}`)
                return null
            }
        })
        .filter(Boolean)
}

function pruneNulls(obj) {
    if (obj === null || obj === undefined) return null
    if (Array.isArray(obj)) return obj.map(pruneNulls).filter((v) => v !== null)
    if (typeof obj === 'object') {
        const cleaned = {}
        for (const [k, v] of Object.entries(obj)) {
            if (v !== null && v !== undefined) {
                const cv = pruneNulls(v)
                if (cv !== null && cv !== undefined) cleaned[k] = cv
            }
        }
        return Object.keys(cleaned).length > 0 ? cleaned : null
    }
    return obj
}

function writeChunks(records, chunksDir, baseName, chunkSize = DEFAULT_CHUNK_SIZE) {
    fs.mkdirSync(chunksDir, { recursive: true })
    const chunks = []
    const totalChunks = Math.ceil(records.length / chunkSize)
    for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize
        const end = Math.min(start + chunkSize, records.length)
        const data = records.slice(start, end).map((r) => pruneNulls(r)).filter(Boolean)
        const filename = `${baseName}_chunk_${String(i + 1).padStart(2, '0')}_${data.length}_records.json`
        const filepath = path.join(chunksDir, filename)
        fs.writeFileSync(filepath, JSON.stringify(data), 'utf8')
        chunks.push({ index: i + 1, filepath, count: data.length })
        console.log(`📦 Wrote ${path.basename(filepath)} (${data.length})`)
    }
    return chunks
}

// ==========================
// Stage 3: Comprehensive structure
// ==========================
function processVarieties(varieties) {
    if (!Array.isArray(varieties)) return []

    return varieties.map(variety => ({
        id: variety.id,
        name: variety.name,
        mintValue: variety.mintValue,
        usedValue: variety.usedValue,
        finestUsedValue: variety.finestUsedValue,
        stampImageUrl: variety.stampImageUrl,
        catalogNumber: variety.catalogNumber
    }))
}

function toComprehensive(record, index, sourceFile) {
    // Handle new structure with instance and varieties
    const instance = record.instance || record
    const varieties = processVarieties(record.varieties || [])

    return {
        record_id: instance.id,
        record_type: 'stamp',
        record_index: index,
        source_file: sourceFile,
        stamp_core: {
            id: instance.id,
            stampId: instance.stampId,
            name: instance.name,
            catalogNumber: instance.catalogNumber,
            country: instance.countryName,
            year: instance.issueYear,
            denomination: instance.denominationDisplay,
            color: instance.colorName,
            series: instance.seriesName,
        },
        stamp_descriptions: {
            description: instance.description,
            seriesDescription: instance.seriesDescription,
            stampGroupDescription: instance.stampGroupDescription,
            typeDescription: instance.typeDescription,
            colorDescription: instance.colorDescription,
            paperDescription: instance.paperDescription,
            watermarkDescription: instance.watermarkDescription,
            perforationDescription: instance.perforationDescription,
            issueContext: instance.issueContext,
            specialNotes: instance.specialNotes,
            collectorNotes: instance.collectorNotes,
            conditionNotes: instance.conditionNotes,
            rarityNotes: instance.rarityNotes,
            marketNotes: instance.marketNotes,
            researchNotes: instance.researchNotes,
        },
        stamp_market: {
            mintValue: instance.mintValue,
            usedValue: instance.usedValue,
            lastAuctionPrice: instance.lastAuctionPrice,
            priceMultiplier: instance.priceMultiplier,
            rarityRating: instance.rarityRating,
            rarityScore: instance.rarityScore,
            rarityScale: instance.rarityScale,
            collectingPopularity: instance.collectingPopularity,
            exhibitionFrequency: instance.exhibitionFrequency,
        },
        stamp_technical: {
            paperType: instance.paperTypeName,
            paperCode: instance.paperCode,
            paperFiber: instance.paperFiber,
            paperThickness: instance.paperThickness,
            paperOpacity: instance.paperOpacity,
            watermark: instance.watermarkName,
            watermarkCode: instance.watermarkCode,
            watermarkPosition: instance.watermarkPosition,
            watermarkClarity: instance.watermarkClarity,
            perforation: instance.perforationName,
            perforationCode: instance.perforationCode,
            perforationMeasurement: instance.perforationMeasurement,
            perforationGauge: instance.perforationGauge,
            perforationCleanCut: instance.perforationCleanCut,
            perforationComb: instance.perforationComb,
            printingMethod: instance.printingMethod,
            printingProcess: instance.printingProcess,
            printingQuality: instance.printingQuality,
            printer: instance.printer,
            printerLocation: instance.printerLocation,
            printerReputation: instance.printerReputation,
            designer: instance.designer,
            designerNotes: instance.designerNotes,
            engraver: instance.engraver,
            dieNumber: instance.dieNumber,
            plateNumber: instance.plateNumber,
            plateCharacteristics: instance.plateCharacteristics,
        },
        stamp_varieties: {
            hasVarieties: varieties.length > 0,
            varietyCount: varieties.length,
            varieties: varieties,
            varietyType: instance.varietyType,
            plateVariety: instance.plateVariety,
            perforationVariety: instance.perforationVariety,
            colorVariety: instance.colorVariety,
            paperVariety: instance.paperVariety,
            watermarkVariety: instance.watermarkVariety,
            knownError: instance.knownError,
            majorVariety: instance.majorVariety,
            errorType: instance.errorType,
        },
        stamp_context: {
            historicalSignificance: instance.historicalSignificance,
            culturalImportance: instance.culturalImportance,
            philatelicImportance: instance.philatelicImportance,
            researchStatus: instance.researchStatus,
            bibliography: instance.bibliography,
            issueDate: instance.issueDate,
            issueLocation: instance.issueLocation,
            issuePurpose: instance.issuePurpose,
            firstDayIssue: instance.firstDayIssue,
            periodStart: instance.periodStart,
            periodEnd: instance.periodEnd,
            postalHistoryType: instance.postalHistoryType,
            postmarkType: instance.postmarkType,
            proofType: instance.proofType,
            essayType: instance.essayType,
        },
        stamp_authentication: {
            authenticationRequired: instance.authenticationRequired,
            expertCommittee: instance.expertCommittee,
            authenticationPoint: instance.authenticationPoint,
            certificateAvailable: instance.certificateAvailable,
            commonForgery: instance.commonForgery,
        },
        stamp_image: instance.stampImageUrl
            ? { image_url: instance.stampImageUrl, has_image: true }
            : { image_url: '/images/stamps/no-image-available.png', has_image: false },
        stamp_metadata: {
            isInstance: instance.isInstance,
            parentStampId: instance.parentStampId,
            similarityScore: instance.similarityScore,
            catalogExtractionProcessId: instance.catalogExtractionProcessId,
            sizeWidth: instance.sizeWidth,
            sizeHeight: instance.sizeHeight,
            sizeFormat: instance.sizeFormat,
            theme: instance.theme,
            themeCategory: instance.themeCategory,
            subject: instance.subject,
            artisticStyle: instance.artisticStyle,
            printRun: instance.printRun,
            estimatedPrintRun: instance.estimatedPrintRun,
            sheetsPrinted: instance.sheetsPrinted,
            stampsPerSheet: instance.stampsPerSheet,
            positionVarieties: instance.positionVarieties,
            gumType: instance.gumType,
            gumCondition: instance.gumCondition,
            paperManufacturer: instance.paperManufacturer,
        },
        record_end: `---END_RECORD_${instance.id}---`,
    }
}

function buildComprehensiveFromChunks(chunks, outDir) {
    const comprehensiveDir = path.join(outDir, 'comprehensive_vectorstore')
    fs.mkdirSync(comprehensiveDir, { recursive: true })
    const outputs = []
    for (const chunk of chunks) {
        const data = JSON.parse(fs.readFileSync(chunk.filepath, 'utf8'))
        const comprehensive = data.map((r, idx) => toComprehensive(r, idx, path.basename(chunk.filepath)))
            .map((r) => pruneNulls(r))
            .filter(Boolean)
        const outFile = path.join(comprehensiveDir, `${path.basename(chunk.filepath)}`)
        fs.writeFileSync(outFile, JSON.stringify(comprehensive, null, 2))
        outputs.push(outFile)
        console.log(`🧱 Comprehensive: ${path.basename(outFile)} (${comprehensive.length})`)
    }
    return outputs
}

// ==========================
// Stage 4: Enhance (optional Vision)
// ==========================
function removeNAValues(obj) {
    if (obj === null || obj === undefined) return null
    if (Array.isArray(obj)) return obj.map(removeNAValues).filter((x) => x !== null)
    if (typeof obj === 'object') {
        const cleaned = {}
        for (const [k, v] of Object.entries(obj)) {
            if (v !== 'N/A' && v !== null && v !== undefined) {
                const cv = removeNAValues(v)
                if (cv !== null && cv !== undefined) cleaned[k] = cv
            }
        }
        return Object.keys(cleaned).length > 0 ? cleaned : null
    }
    return obj
}

async function maybeEnhanceComprehensive(files, useVision = false) {
    let OpenAI = null
    let openai = null
    let lastCall = 0
    const RATE_LIMIT_DELAY = 1000
    if (useVision) {
        OpenAI = require('openai')
        openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    }

    for (const file of files) {
        console.log(`🎨 Enhancing: ${path.basename(file)}`)
        const data = JSON.parse(fs.readFileSync(file, 'utf8'))
        const total = data.length
        const enhanced = []
        let visionApiCount = 0
        let fallbackCount = 0
        let imageCount = 0

        let processed = 0

        for (const rec of data) {
            let cleaned = removeNAValues(rec)
            if (!cleaned) continue
            const hasImage = cleaned.stamp_image?.has_image && cleaned.stamp_image?.image_url && cleaned.stamp_image?.image_url !== '/images/stamps/no-image-available.png'
            if (hasImage) imageCount++

            if (useVision) {
                try {
                    const now = Date.now()
                    const delta = now - lastCall
                    if (delta < RATE_LIMIT_DELAY) await new Promise((r) => setTimeout(r, RATE_LIMIT_DELAY - delta))
                    lastCall = Date.now()
                    const imgUrl = cleaned.stamp_image?.image_url
                    const resp = await openai.chat.completions.create({
                        model: 'gpt-4o',
                        messages: [
                            {
                                role: 'user',
                                content: [
                                    { type: 'text', text: 'Provide a concise visual description and 5-10 keywords for this stamp image.' },
                                    { type: 'image_url', image_url: { url: imgUrl } },
                                ],
                            },
                        ],
                        max_tokens: 250,
                        temperature: 0.3,
                    })
                    const text = resp.choices?.[0]?.message?.content || ''
                    cleaned.stamp_descriptions = cleaned.stamp_descriptions || {}
                    cleaned.stamp_descriptions.visual_description = text
                    cleaned.stamp_descriptions.description_type = 'vision_api_analysis'
                    visionApiCount++
                } catch (e) {
                    cleaned.stamp_descriptions = cleaned.stamp_descriptions || {}
                    const imgUrl = cleaned.stamp_image?.image_url
                    cleaned.stamp_descriptions.visual_description = `Stamp image available at: ${imgUrl}.`
                    cleaned.stamp_descriptions.description_type = 'fallback_analysis'
                    fallbackCount++
                }
            }

            // Final prune of nulls
            enhanced.push(pruneNulls(cleaned))

            processed++
            if (processed % 25 === 0 || processed === total) {
                const pct = ((processed / total) * 100).toFixed(1)
                process.stdout.write(`\r⏳ Enhancing progress: ${processed}/${total} (${pct}%)`)
            }
        }
        process.stdout.write('\n')

        fs.writeFileSync(file, JSON.stringify(enhanced, null, 2))
        const summary = {
            file: path.basename(file),
            timestamp: new Date().toISOString(),
            records: enhanced.length,
            vision_api_analysis_count: visionApiCount,
            fallback_analysis_count: fallbackCount,
            records_with_images: imageCount,
        }
        fs.writeFileSync(file.replace(/\.json$/, '_summary.json'), JSON.stringify(summary, null, 2))
        console.log(`✅ Enhanced + summary written for ${path.basename(file)}`)
    }
}

// ==========================
// Main
// ==========================
async function main() {
    const args = parseArgs()
    const name = args.name || args.n || 'catalog_run'
    const pageSize = args.pageSize ? parseInt(args.pageSize, 10) : DEFAULT_PAGE_SIZE
    const chunkSize = args.chunkSize ? parseInt(args.chunkSize, 10) : DEFAULT_CHUNK_SIZE
    const useVision = !!args.vision

    const baseOutDir = path.resolve('stamp_database_by_type', name)
    console.log('🚀 Unified Stamp Data Pipeline')
    console.log(`📁 Output root: ${baseOutDir}`)
    console.log(`📄 Page size: ${pageSize}`)
    console.log(`📦 Chunk size: ${chunkSize}`)
    console.log(`🖼️ Vision enhancement: ${useVision ? 'ON' : 'OFF'}`)

    try {
        await authenticate()

        // Stage 1: Fetch
        const fetchRes = await fetchAllStampsToNdjson(baseOutDir, name, pageSize)
        console.log('📊 Fetch summary:', fetchRes)

        // Stage 2: Chunk
        const records = loadNdjson(fetchRes.outputFile)
        const chunksDir = path.join(baseOutDir, 'chunks')
        const chunks = writeChunks(records, chunksDir, name, chunkSize)

        // Stage 3: Comprehensive
        const comprehensiveFiles = buildComprehensiveFromChunks(chunks, baseOutDir)

        // Stage 4: Enhance (optional)
        if (useVision) {
            await maybeEnhanceComprehensive(comprehensiveFiles, true)
        }

        console.log('\n🎉 Pipeline complete!')
        console.log(`📁 Data stored under: ${baseOutDir}`)
        console.log('✅ Stages: fetch → chunk → comprehensive' + (useVision ? ' → enhance' : ''))
        process.exit(0)
    } catch (e) {
        console.error('❌ Pipeline failed:', e.message)
        process.exit(1)
    }
}

// Export functions for testing
module.exports = {
    processVarieties,
    toComprehensive,
    pruneNulls,
    removeNAValues
}

if (require.main === module) {
    main()
}


