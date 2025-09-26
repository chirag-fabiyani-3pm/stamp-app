#!/usr/bin/env node

/**
 * 🧹 CLEANUP OLD STAMP SCRIPTS
 * 
 * This script helps clean up the old individual scripts that are now replaced
 * by the unified pipeline. Run this AFTER confirming the unified script works.
 * 
 * USAGE:
 *   node scripts/cleanup-old-scripts.js --dry-run    # See what would be removed
 *   node scripts/cleanup-old-scripts.js --confirm    # Actually remove the files
 */

const fs = require('fs')
const path = require('path')

const OLD_SCRIPTS = [
    'scripts/fetch-stamp-api-data.js',
    'scripts/chunk-new-api-data.js',
    'scripts/create-comprehensive-vectorstore-structure.js',
    'scripts/clean-and-enhance-stamp-data.js'
]

const KEEP_SCRIPTS = [
    'scripts/unified-stamp-data-pipeline.js',
    'scripts/cleanup-old-scripts.js',
    'scripts/update-sw-version.js'
]

function parseArgs() {
    const args = process.argv.slice(2)
    return {
        dryRun: args.includes('--dry-run'),
        confirm: args.includes('--confirm')
    }
}

function checkScripts() {
    console.log('🔍 Checking old scripts...\n')

    const results = {
        found: [],
        missing: [],
        totalSize: 0
    }

    for (const script of OLD_SCRIPTS) {
        if (fs.existsSync(script)) {
            const stats = fs.statSync(script)
            results.found.push({
                path: script,
                size: stats.size,
                sizeMB: (stats.size / 1024 / 1024).toFixed(2)
            })
            results.totalSize += stats.size
        } else {
            results.missing.push(script)
        }
    }

    return results
}

function showResults(results) {
    console.log('📊 OLD SCRIPTS ANALYSIS:')
    console.log('='.repeat(50))

    if (results.found.length > 0) {
        console.log('\n✅ Found scripts to remove:')
        results.found.forEach(script => {
            console.log(`   ${script.path} (${script.sizeMB} MB)`)
        })
        console.log(`\n📏 Total size: ${(results.totalSize / 1024 / 1024).toFixed(2)} MB`)
    }

    if (results.missing.length > 0) {
        console.log('\n⚠️  Scripts not found (already removed?):')
        results.missing.forEach(script => {
            console.log(`   ${script}`)
        })
    }

    console.log('\n🛡️  Scripts that will be KEPT:')
    KEEP_SCRIPTS.forEach(script => {
        const exists = fs.existsSync(script) ? '✅' : '❌'
        console.log(`   ${exists} ${script}`)
    })
}

function removeScripts(results) {
    console.log('\n🗑️  Removing old scripts...')

    let removed = 0
    let errors = 0

    for (const script of results.found) {
        try {
            fs.unlinkSync(script.path)
            console.log(`   ✅ Removed: ${script.path}`)
            removed++
        } catch (error) {
            console.log(`   ❌ Failed to remove ${script.path}: ${error.message}`)
            errors++
        }
    }

    console.log(`\n📊 Cleanup complete: ${removed} removed, ${errors} errors`)
}

function main() {
    const args = parseArgs()

    console.log('🧹 OLD STAMP SCRIPTS CLEANUP')
    console.log('='.repeat(40))

    if (!args.dryRun && !args.confirm) {
        console.log('❌ Please specify --dry-run or --confirm')
        console.log('\nUsage:')
        console.log('  node scripts/cleanup-old-scripts.js --dry-run    # See what would be removed')
        console.log('  node scripts/cleanup-old-scripts.js --confirm    # Actually remove the files')
        process.exit(1)
    }

    const results = checkScripts()
    showResults(results)

    if (args.dryRun) {
        console.log('\n🔍 DRY RUN - No files were actually removed')
        console.log('Run with --confirm to actually remove the files')
    } else if (args.confirm) {
        if (results.found.length === 0) {
            console.log('\n✅ No old scripts found to remove')
        } else {
            console.log('\n⚠️  This will permanently delete the old script files!')
            console.log('Make sure you have confirmed the unified pipeline works correctly.')
            removeScripts(results)
        }
    }
}

if (require.main === module) {
    main()
}

module.exports = { checkScripts, removeScripts }
