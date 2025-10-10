import { NextRequest, NextResponse } from 'next/server'
import { BEDROCK_CONFIG, calculateCost } from '@/lib/bedrock'
import { summarizeText, detectLanguage, countTokensEstimate } from '@/lib/summarize'

// ==================== TYPES ====================

interface YouTubeSummarizeRequest {
    url: string
    language?: string
    summary_length?: 'short' | 'medium' | 'long'
    bullet_points?: boolean
    custom_prompt?: string
}

interface YouTubeTranscriptResponse {
    message: string
    video_id: string
    language: string
    transcript_text: string
}

interface SummarizeResponse {
    summary: string
    original_length: number
    summary_length: number
    detected_language: string
    processing_time: number
    model_used: string
    chunks_processed: number
    video_id: string
    video_url: string
    transcript_language: string
    cost_estimate: {
        input_tokens: number
        output_tokens: number
        input_cost_usd: number
        output_cost_usd: number
        total_cost_usd: number
    }
}

// ==================== YOUTUBE TRANSCRIPT API ====================

const YOUTUBE_TRANSCRIPT_API = 'https://p5toozt7p5.execute-api.eu-central-1.amazonaws.com/dev'

/**
 * Fetch YouTube video transcript from AWS API
 */
async function fetchYouTubeTranscript(videoUrl: string): Promise<YouTubeTranscriptResponse> {
    try {
        console.log(`🎥 Fetching transcript for: ${videoUrl}`)
        
        const response = await fetch(YOUTUBE_TRANSCRIPT_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: videoUrl })
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`YouTube API error (${response.status}): ${errorText}`)
        }

        const data: YouTubeTranscriptResponse = await response.json()
        
        if (!data.transcript_text || data.transcript_text.trim().length === 0) {
            throw new Error('No transcript available for this video')
        }

        console.log(`✅ Transcript received: ${data.transcript_text.length} characters`)
        console.log(`📝 Video ID: ${data.video_id}`)
        console.log(`🌍 Language: ${data.language}`)
        
        return data

    } catch (error) {
        console.error('❌ YouTube transcript fetch error:', error)
        throw new Error(`Failed to fetch YouTube transcript: ${error instanceof Error ? error.message : String(error)}`)
    }
}

/**
 * Extract video ID from YouTube URL
 */
function extractVideoId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
        /youtube\.com\/embed\/([^&\n?#]+)/,
        /youtube\.com\/v\/([^&\n?#]+)/
    ]
    
    for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match) return match[1]
    }
    
    return null
}

// ==================== API ENDPOINT ====================

export async function POST(request: NextRequest) {
    const startTime = Date.now()
    
    try {
        // Parse request body
        const body: YouTubeSummarizeRequest = await request.json()
        
        // Validate input
        if (!body.url) {
            return NextResponse.json(
                { error: "YouTube URL is required" },
                { status: 400 }
            )
        }

        // Validate YouTube URL
        const videoId = extractVideoId(body.url)
        if (!videoId) {
            return NextResponse.json(
                { error: "Invalid YouTube URL" },
                { status: 400 }
            )
        }

        console.log(`🎬 Processing YouTube video: ${videoId}`)
        
        // Step 1: Fetch transcript from YouTube API
        const transcriptData = await fetchYouTubeTranscript(body.url)
        
        // Check if transcript is long enough
        if (transcriptData.transcript_text.length < 100) {
            return NextResponse.json(
                { error: "Transcript is too short (minimum 100 characters)" },
                { status: 400 }
            )
        }

        const summaryLength = body.summary_length || 'medium'
        const bulletPoints = body.bullet_points || false
        
        // Detect language from transcript or use provided language
        const detectedLang = body.language || detectLanguage(transcriptData.transcript_text)
        console.log(`🌍 Target language: ${detectedLang}`)
        
        // Step 2: Summarize transcript using our summarization module
        console.log(`🚀 Starting summarization...`)
        const result = await summarizeText({
            text: transcriptData.transcript_text,
            length: summaryLength,
            bulletPoints,
            language: detectedLang,
            customPrompt: body.custom_prompt
        })
        
        const { summary, chunksProcessed, inputTokens, outputTokens } = result
        
        const processingTime = (Date.now() - startTime) / 1000
        console.log(`✅ YouTube summarization completed in ${processingTime.toFixed(2)}s`)
        
        // Calculate cost
        const costEstimate = calculateCost(inputTokens, outputTokens)
        console.log(`💰 Estimated cost: $${costEstimate.total_cost_usd} (Input: ${inputTokens} tokens, Output: ${outputTokens} tokens)`)
        
        // Build response
        const response: SummarizeResponse = {
            summary,
            original_length: transcriptData.transcript_text.split(/\s+/).length,
            summary_length: summary.split(/\s+/).length,
            detected_language: detectedLang,
            processing_time: Number(processingTime.toFixed(2)),
            model_used: BEDROCK_CONFIG.MODEL_ID,
            chunks_processed: chunksProcessed,
            video_id: transcriptData.video_id,
            video_url: body.url,
            transcript_language: transcriptData.language,
            cost_estimate: costEstimate
        }
        
        return NextResponse.json(response, { status: 200 })
        
    } catch (error) {
        console.error("❌ YouTube summarization error:", error)
        return NextResponse.json(
            { 
                error: error instanceof Error ? error.message : "An unexpected error occurred",
                details: process.env.NODE_ENV === 'development' ? String(error) : undefined
            },
            { status: 500 }
        )
    }
}

// Health check for YouTube summarization service
export async function GET(request: NextRequest) {
    return NextResponse.json({
        status: "healthy",
        service: "YouTube Video Summarization",
        transcript_api: YOUTUBE_TRANSCRIPT_API,
        model_id: BEDROCK_CONFIG.MODEL_ID
    })
}