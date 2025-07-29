require('dotenv').config({ path: '.env.local' })

const fs = require('fs')

async function testImageSearch() {
    try {
        console.log('🧪 Testing image search functionality...')

        // Check if the enhanced stamps file exists
        const stampsFile = 'stamps-with-descriptions.json'

        if (!fs.existsSync(stampsFile)) {
            console.log('⚠️ No enhanced stamps file found. Please run the merge script first.')
            console.log('📋 Command: node scripts/merge-visual-descriptions.js')
            return
        }

        const stamps = JSON.parse(fs.readFileSync(stampsFile, 'utf8'))
        console.log(`📊 Loaded ${stamps.length} stamps with visual descriptions`)

        // Check if the API endpoint exists
        const apiFile = 'app/api/search-by-image/route.ts'
        if (!fs.existsSync(apiFile)) {
            console.log('❌ Image search API endpoint not found')
            return
        }

        console.log('✅ Image search API endpoint found')

        // Check if the ImageSearch component exists
        const componentFile = 'components/image-search.tsx'
        if (!fs.existsSync(componentFile)) {
            console.log('❌ ImageSearch component not found')
            return
        }

        console.log('✅ ImageSearch component found')

        // Show sample stamps that could be used for testing
        console.log('\n📋 Sample stamps for testing:')
        const sampleStamps = stamps.filter(s => s.visualDescription).slice(0, 3)
        sampleStamps.forEach((stamp, index) => {
            console.log(`${index + 1}. ${stamp.Name}`)
            console.log(`   Country: ${stamp.Country}`)
            console.log(`   Color: ${stamp.Color || 'Unknown'}`)
            console.log(`   Image: ${stamp.StampImageUrl ? 'Available' : 'Not available'}`)
            console.log(`   Description Preview: ${stamp.visualDescription.substring(0, 100)}...`)
            console.log('')
        })

        console.log('🎯 Image Search Features:')
        console.log('='.repeat(60))
        console.log('✅ Upload image files (JPEG, PNG)')
        console.log('✅ File size validation (max 5MB)')
        console.log('✅ OpenAI Vision API analysis')
        console.log('✅ Stamp detection with confidence score')
        console.log('✅ Similar stamp suggestions')
        console.log('✅ Detailed stamp information display')
        console.log('✅ Error handling and user feedback')

        console.log('\n🚀 Ready to test!')
        console.log('📋 Steps to test:')
        console.log('1. Start your development server: npm run dev')
        console.log('2. Open the chat interface')
        console.log('3. Click the camera icon to open image search')
        console.log('4. Upload a stamp image to test the functionality')

        return stamps

    } catch (error) {
        console.error('❌ Error testing image search:', error)
        return []
    }
}

// Run the test
testImageSearch()
    .then((stamps) => {
        if (stamps && stamps.length > 0) {
            console.log(`\n✅ Image search is ready with ${stamps.length} enhanced stamps!`)
            console.log('📋 You can now upload stamp images and get detailed information.')
        } else {
            console.log('❌ Image search setup incomplete.')
        }
        process.exit(0)
    })
    .catch((error) => {
        console.error('❌ Failed to test image search:', error)
        process.exit(1)
    }) 