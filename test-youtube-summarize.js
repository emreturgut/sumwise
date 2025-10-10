#!/usr/bin/env node

/**
 * Test script for YouTube video summarization
 * 
 * Usage:
 *   node test-youtube-summarize.js
 *   node test-youtube-summarize.js --short
 *   node test-youtube-summarize.js --bullets
 *   node test-youtube-summarize.js --url "https://www.youtube.com/watch?v=VIDEO_ID"
 */

// Test video URLs
const testVideos = {
    turkish: "https://www.youtube.com/watch?v=eVGCGlBt5fo",
    english: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Replace with actual video
    short: "https://youtu.be/eVGCGlBt5fo" // Short URL format
}

async function testYouTubeSummarize(options = {}) {
    const {
        url = testVideos.turkish,
        language = 'auto',
        summaryLength = 'medium',
        bulletPoints = false,
        baseUrl = 'http://localhost:3000'
    } = options

    console.log('\n🎥 Testing YouTube Video Summarization\n')
    console.log('Configuration:')
    console.log(`  - Video URL: ${url}`)
    console.log(`  - Language: ${language}`)
    console.log(`  - Summary Length: ${summaryLength}`)
    console.log(`  - Bullet Points: ${bulletPoints}\n`)

    try {
        console.log('📡 Sending request to', `${baseUrl}/api/summarize/youtube`, '...\n')
        
        const startTime = Date.now()
        const response = await fetch(`${baseUrl}/api/summarize/youtube`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url,
                language: language === 'auto' ? undefined : language,
                summary_length: summaryLength,
                bullet_points: bulletPoints
            })
        })

        const data = await response.json()
        const requestTime = ((Date.now() - startTime) / 1000).toFixed(2)

        if (!response.ok) {
            console.error('❌ Error:', data.error)
            if (data.details) {
                console.error('Details:', data.details)
            }
            process.exit(1)
        }

        console.log('✅ YouTube video summarized successfully!\n')
        
        console.log('🎬 Video Information:')
        console.log(`  - Video ID: ${data.video_id}`)
        console.log(`  - Video URL: ${data.video_url}`)
        console.log(`  - Transcript Language: ${data.transcript_language}\n`)
        
        console.log('📊 Statistics:')
        console.log(`  - Original Length: ${data.original_length} words (transcript)`)
        console.log(`  - Summary Length: ${data.summary_length} words`)
        console.log(`  - Compression Ratio: ${(data.summary_length / data.original_length * 100).toFixed(1)}%`)
        console.log(`  - Detected Language: ${data.detected_language}`)
        console.log(`  - Processing Time: ${data.processing_time}s (server) / ${requestTime}s (total)`)
        console.log(`  - Model Used: ${data.model_used}`)
        console.log(`  - Chunks Processed: ${data.chunks_processed}\n`)
        
        console.log('💰 Cost Estimate:')
        console.log(`  - Input Tokens: ${data.cost_estimate.input_tokens.toLocaleString()}`)
        console.log(`  - Output Tokens: ${data.cost_estimate.output_tokens.toLocaleString()}`)
        console.log(`  - Input Cost: $${data.cost_estimate.input_cost_usd.toFixed(6)}`)
        console.log(`  - Output Cost: $${data.cost_estimate.output_cost_usd.toFixed(6)}`)
        console.log(`  - Total Cost: $${data.cost_estimate.total_cost_usd.toFixed(6)}\n`)
        
        console.log('📝 Summary:')
        console.log('─'.repeat(80))
        console.log(data.summary)
        console.log('─'.repeat(80))
        console.log('\n✨ Test completed successfully!\n')

    } catch (error) {
        console.error('\n❌ Test failed:', error.message)
        console.error('\nMake sure:')
        console.error('  1. The development server is running (npm run dev)')
        console.error('  2. AWS credentials are configured in .env.local')
        console.error('  3. The YouTube transcript API is accessible')
        console.error('  4. The server is accessible at', baseUrl)
        process.exit(1)
    }
}

async function testHealth(baseUrl = 'http://localhost:3000') {
    console.log('\n🏥 Testing YouTube Summarization Service Health\n')
    
    try {
        const response = await fetch(`${baseUrl}/api/summarize/youtube`)
        const data = await response.json()
        
        console.log('✅ Service is healthy')
        console.log(`  - Status: ${data.status}`)
        console.log(`  - Service: ${data.service}`)
        console.log(`  - Transcript API: ${data.transcript_api}`)
        console.log(`  - Model ID: ${data.model_id}\n`)
    } catch (error) {
        console.error('❌ Health check failed:', error.message)
        console.error('   Make sure the development server is running\n')
        process.exit(1)
    }
}

async function testTranscriptAPI(videoUrl = testVideos.turkish) {
    console.log('\n🔍 Testing YouTube Transcript API directly\n')
    console.log(`Video URL: ${videoUrl}\n`)
    
    try {
        const response = await fetch('https://p5toozt7p5.execute-api.eu-central-1.amazonaws.com/dev', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: videoUrl })
        })
        
        const data = await response.json()
        
        if (!response.ok) {
            console.error('❌ Transcript API error:', data)
            process.exit(1)
        }
        
        console.log('✅ Transcript fetched successfully')
        console.log(`  - Video ID: ${data.video_id}`)
        console.log(`  - Language: ${data.language}`)
        console.log(`  - Transcript Length: ${data.transcript_text.length} characters`)
        console.log(`  - Transcript Preview: ${data.transcript_text.substring(0, 150)}...\n`)
        
    } catch (error) {
        console.error('❌ Transcript API test failed:', error.message)
        process.exit(1)
    }
}

// Parse command line arguments
const args = process.argv.slice(2)
const options = {
    summaryLength: 'medium',
    bulletPoints: false,
    language: 'auto',
    url: testVideos.turkish
}

// Parse flags
if (args.includes('--short')) {
    options.summaryLength = 'short'
} else if (args.includes('--long')) {
    options.summaryLength = 'long'
}

if (args.includes('--bullets')) {
    options.bulletPoints = true
}

if (args.includes('--turkish') || args.includes('--tr')) {
    options.language = 'tr'
    options.url = testVideos.turkish
} else if (args.includes('--english') || args.includes('--en')) {
    options.language = 'en'
    options.url = testVideos.english
}

// Custom URL
const urlIndex = args.indexOf('--url')
if (urlIndex !== -1 && args[urlIndex + 1]) {
    options.url = args[urlIndex + 1]
}

// Test modes
if (args.includes('--health')) {
    testHealth().catch(console.error)
} else if (args.includes('--test-transcript')) {
    const url = args[args.indexOf('--test-transcript') + 1] || testVideos.turkish
    testTranscriptAPI(url).catch(console.error)
} else {
    // Run health check first, then summarization test
    testHealth()
        .then(() => testYouTubeSummarize(options))
        .catch(console.error)
}

