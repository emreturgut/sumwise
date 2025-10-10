import { NextRequest, NextResponse } from 'next/server'
import { BEDROCK_CONFIG, isBedrockAvailable, calculateCost } from '@/lib/bedrock'
import { summarizeText, detectLanguage, countTokensEstimate } from '@/lib/summarize'

// ==================== TYPES ====================

interface SummarizeRequest {
    text: string
    language?: string
    summary_length?: 'short' | 'medium' | 'long'
    bullet_points?: boolean
    custom_prompt?: string
}

interface SummarizeResponse {
    summary: string
    original_length: number
    summary_length: number
    detected_language: string
    processing_time: number
    model_used: string
    chunks_processed: number
    cost_estimate: {
        input_tokens: number
        output_tokens: number
        input_cost_usd: number
        output_cost_usd: number
        total_cost_usd: number
    }
}


// ==================== API ENDPOINT ====================

export async function POST(request: NextRequest) {
    const startTime = Date.now()
    
    try {
        // Parse request body
        const body: SummarizeRequest = await request.json()
        
        // Validate input
        if (!body.text || body.text.trim().length < 100) {
            return NextResponse.json(
                { error: "Text is too short (minimum 100 characters)" },
                { status: 400 }
            )
        }
        
        const text = body.text.trim()
        const summaryLength = body.summary_length || 'medium'
        const bulletPoints = body.bullet_points || false
        
        // Detect language
        const detectedLang = body.language || detectLanguage(text)
        console.log(`🌍 Detected language: ${detectedLang}`)
        
        // Summarize
        console.log(`🚀 Starting summarization...`)
        const result = await summarizeText({
            text,
            length: summaryLength,
            bulletPoints,
            language: detectedLang,
            customPrompt: body.custom_prompt
        })
        
        const { summary, chunksProcessed, inputTokens, outputTokens } = result
        
        const processingTime = (Date.now() - startTime) / 1000
        console.log(`✅ Summarization completed in ${processingTime.toFixed(2)}s`)
        
        // Calculate cost
        const costEstimate = calculateCost(inputTokens, outputTokens)
        console.log(`💰 Estimated cost: $${costEstimate.total_cost_usd} (Input: ${inputTokens} tokens, Output: ${outputTokens} tokens)`)
        
        // Build response
        const response: SummarizeResponse = {
            summary,
            original_length: text.split(/\s+/).length,
            summary_length: summary.split(/\s+/).length,
            detected_language: detectedLang,
            processing_time: Number(processingTime.toFixed(2)),
            model_used: BEDROCK_CONFIG.MODEL_ID,
            chunks_processed: chunksProcessed,
            cost_estimate: costEstimate
        }
        
        return NextResponse.json(response, { status: 200 })
        
    } catch (error) {
        console.error("❌ Error:", error)
        return NextResponse.json(
            { 
                error: error instanceof Error ? error.message : "An unexpected error occurred",
                details: process.env.NODE_ENV === 'development' ? String(error) : undefined
            },
            { status: 500 }
        )
    }
}

// Health check for summarization service
export async function GET(request: NextRequest) {
    return NextResponse.json({
        status: "healthy",
        service: "Sumwise Text Summarization",
        bedrock_available: isBedrockAvailable(),
        model_id: BEDROCK_CONFIG.MODEL_ID,
        region: BEDROCK_CONFIG.REGION
    })
}

