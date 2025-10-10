import { NextRequest, NextResponse } from 'next/server'

interface SummarizeRequest {
    url: string
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

export async function POST(request: NextRequest) {
    const body = await request.json()
    const { url } = body

    const summary = await summarizeYoutubeVideo(url)

    return NextResponse.json({ summary })
}