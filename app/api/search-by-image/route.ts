import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Vercel configuration
export const maxDuration = 10 // 10 seconds for Vercel hobby plan
export const dynamic = 'force-dynamic'

console.log('OPENAI_API_KEY (search-by-image): ', process.env.OPENAI_API_KEY)
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

// Add timeout configuration for Vercel
const TIMEOUT_MS = 8000 // 8 seconds to stay well under Vercel's 10s limit

// Timeout helper function
function createTimeoutPromise(ms: number): Promise<never> {
    return new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), ms)
    })
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const imageFile = formData.get('image') as File

        if (!imageFile) {
            return NextResponse.json({ error: 'No image file provided' }, { status: 400 })
        }

        // Validate file type
        if (!imageFile.type.startsWith('image/')) {
            return NextResponse.json({ error: 'Invalid file type. Please upload an image.' }, { status: 400 })
        }

        // Validate file size (max 5MB)
        if (imageFile.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'File size too large. Please upload an image smaller than 5MB.' }, { status: 400 })
        }

        console.log('🔍 Processing image search...')
        console.log('📁 File:', imageFile.name, 'Size:', imageFile.size, 'Type:', imageFile.type)

        // Convert file to base64
        const bytes = await imageFile.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const base64Image = buffer.toString('base64')

        // Process image with timeout
        try {
            // Create a timeout promise
            const timeoutPromise = createTimeoutPromise(TIMEOUT_MS)

            // Create the image processing promise
            const imageProcessingPromise = (async () => {
                // Step 1: Analyze if the image is a stamp
                const stampAnalysis = await analyzeStampImage(base64Image)

                if (!stampAnalysis.isStamp) {
                    return {
                        isStamp: false,
                        confidence: stampAnalysis.confidence,
                        message: 'This image does not appear to be a stamp.'
                    }
                }

                // Step 2: If it's a stamp, find similar stamps in our database
                const similarStamps = await findSimilarStamps(stampAnalysis.description)

                // Step 3: Get the best match
                const bestMatch = similarStamps.length > 0 ? similarStamps[0] : null

                return {
                    isStamp: true,
                    confidence: stampAnalysis.confidence,
                    stampDetails: bestMatch ? {
                        name: bestMatch.Name,
                        country: bestMatch.Country,
                        denomination: `${bestMatch.DenominationValue}${bestMatch.DenominationSymbol || ''}`,
                        year: bestMatch.IssueYear || 'Unknown',
                        color: bestMatch.Color || 'Unknown',
                        description: bestMatch.visualDescription || 'No description available',
                        imageUrl: bestMatch.StampImageUrl || '/images/stamps/no-image-available.png'
                    } : null,
                    suggestions: similarStamps.slice(0, 4).map((stamp: any) => ({
                        name: stamp.Name,
                        country: stamp.Country,
                        similarity: stamp.similarity || 0.8,
                        imageUrl: stamp.StampImageUrl || '/images/stamps/no-image-available.png'
                    }))
                }
            })()

            // Race between the image processing and timeout
            const result = await Promise.race([imageProcessingPromise, timeoutPromise])

            return NextResponse.json(result)

        } catch (error) {
            console.error('❌ Error in image processing:', error)

            // Check if it's a timeout error
            if (error instanceof Error && error.message === 'Request timeout') {
                return NextResponse.json({
                    error: 'Image processing timed out. Please try again with a simpler image.'
                }, { status: 408 })
            }

            return NextResponse.json({
                error: 'Failed to process image. Please try again.'
            }, { status: 500 })
        }

    } catch (error) {
        console.error('❌ Error in image search:', error)
        return NextResponse.json({
            error: 'Failed to process image. Please try again.'
        }, { status: 500 })
    }
}

async function analyzeStampImage(base64Image: string) {
    try {
        console.log('🔍 Analyzing image with OpenAI Vision...')

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `Analyze this image and determine if it's a postage stamp. Provide a detailed description of what you see.

Requirements:
1. Determine if this is a postage stamp (not a coin, banknote, or other item)
2. If it IS a stamp, provide a detailed description including:
   - Country name
   - Denomination/value
   - Colors used
   - Main subject/theme (portrait, animal, building, etc.)
   - Text elements visible
   - Any distinctive features
   - Approximate year/era if visible

3. If it's NOT a stamp, explain why not

4. Provide a confidence score (0-1) for your assessment

Format your response as JSON:
{
  "isStamp": true/false,
  "confidence": 0.95,
  "description": "Detailed description of the stamp...",
  "country": "Country name if visible",
  "denomination": "Value/denomination if visible",
  "colors": ["color1", "color2"],
  "subject": "Main subject/theme",
  "year": "Approximate year if visible"
}`
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${base64Image}`
                            }
                        }
                    ]
                }
            ],
            max_tokens: 1000
        })

        const analysisText = response.choices[0]?.message?.content
        console.log('📊 Analysis result:', analysisText)

        if (!analysisText) {
            throw new Error('No analysis result received')
        }

        // Try to parse JSON response
        try {
            const analysis = JSON.parse(analysisText)
            return {
                isStamp: analysis.isStamp || false,
                confidence: analysis.confidence || 0.5,
                description: analysis.description || '',
                country: analysis.country || '',
                denomination: analysis.denomination || '',
                colors: analysis.colors || [],
                subject: analysis.subject || '',
                year: analysis.year || ''
            }
        } catch (parseError) {
            console.log('⚠️ Could not parse JSON response, using text analysis')

            // Fallback: analyze the text response
            const text = analysisText.toLowerCase()
            const isStamp = text.includes('stamp') || text.includes('postage')
            const confidence = isStamp ? 0.7 : 0.3

            return {
                isStamp,
                confidence,
                description: analysisText,
                country: '',
                denomination: '',
                colors: [],
                subject: '',
                year: ''
            }
        }

    } catch (error) {
        console.error('❌ Error analyzing image:', error)
        return {
            isStamp: false,
            confidence: 0.1,
            description: 'Unable to analyze image',
            country: '',
            denomination: '',
            colors: [],
            subject: '',
            year: ''
        }
    }
}

async function findSimilarStamps(description: string) {
    try {
        console.log('🔍 Finding similar stamps...')

        // Load our stamp database
        const fs = require('fs')
        const stampsFile = 'stamps-with-descriptions.json'

        if (!fs.existsSync(stampsFile)) {
            console.log('⚠️ No enhanced stamps file found, using basic search')
            return []
        }

        const stamps = JSON.parse(fs.readFileSync(stampsFile, 'utf8'))
        console.log(`📊 Searching through ${stamps.length} stamps`)

        // Simple keyword-based similarity search
        const searchTerms = description.toLowerCase().split(' ')
        const results = stamps
            .filter((stamp: any) => {
                if (!stamp.visualDescription) return false

                const stampText = `${stamp.Name} ${stamp.Country} ${stamp.Color || ''} ${stamp.visualDescription}`.toLowerCase()

                // Count matching keywords
                const matches = searchTerms.filter(term =>
                    stampText.includes(term) && term.length > 2
                ).length

                return matches > 0
            })
            .map((stamp: any) => {
                const stampText = `${stamp.Name} ${stamp.Country} ${stamp.Color || ''} ${stamp.visualDescription}`.toLowerCase()
                const matches = searchTerms.filter(term =>
                    stampText.includes(term) && term.length > 2
                ).length

                return {
                    ...stamp,
                    similarity: Math.min(matches / searchTerms.length, 1)
                }
            })
            .sort((a: any, b: any) => (b.similarity || 0) - (a.similarity || 0))
            .slice(0, 5)

        console.log(`✅ Found ${results.length} similar stamps`)
        return results

    } catch (error) {
        console.error('❌ Error finding similar stamps:', error)
        return []
    }
} 