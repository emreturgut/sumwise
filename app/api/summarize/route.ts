import { NextRequest, NextResponse } from 'next/server'
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'

// ==================== CONFIGURATION ====================

const BEDROCK_CONFIG = {
    MODEL_ID: "eu.mistral.pixtral-large-2502-v1:0",
    MAX_TOKENS: 8000,
    TEMPERATURE: 0.3,
    TOP_P: 0.9,
    REGION: process.env.AWS_REGION || "eu-central-1"
}

// Mistral Pixtral Large pricing (per 1K tokens)
const PRICING = {
    INPUT_PER_1K: 0.002,   // $0.003 per 1K input tokens
    OUTPUT_PER_1K: 0.006   // $0.015 per 1K output tokens
}

console.log("process.env.AWS_ACCESS_KEY_ID", process.env.AWS_ACCESS_KEY_ID)
console.log("process.env.AWS_SECRET_ACCESS_KEY", process.env.AWS_SECRET_ACCESS_KEY)
console.log("process.env.AWS_REGION", process.env.AWS_REGION)
console.log("process.env.NODE_ENV", process.env.NODE_ENV)
console.log("process.env.NEXT_PUBLIC_API_URL", process.env.NEXT_PUBLIC_API_URL)

// Initialize Bedrock client
let bedrockClient: BedrockRuntimeClient | null = null
try {
    bedrockClient = new BedrockRuntimeClient({ 
        region: BEDROCK_CONFIG.REGION
    })
    console.log("✅ AWS Bedrock client initialized successfully")
} catch (error) {
    console.error("❌ Failed to initialize Bedrock client:", error)
}

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

// ==================== HELPER FUNCTIONS ====================

/**
 * Simple language detection based on character patterns
 */
function detectLanguage(text: string): string {
    // Check for Turkish-specific characters
    const turkishChars = /[çğıöşüÇĞİÖŞÜ]/g
    const turkishMatches = text.match(turkishChars)
    
    if (turkishMatches && turkishMatches.length > 5) {
        return 'tr'
    }
    
    // Default to English
    return 'en'
}

/**
 * Estimate token count (approximate)
 */
function countTokensEstimate(text: string): number {
    const words = text.split(/\s+/).length
    // Turkish/English average: 1 word ≈ 1.3 tokens
    return Math.floor(words * 1.3)
}

/**
 * Calculate cost based on token usage
 */
function calculateCost(inputTokens: number, outputTokens: number) {
    const inputCost = (inputTokens / 1000) * PRICING.INPUT_PER_1K
    const outputCost = (outputTokens / 1000) * PRICING.OUTPUT_PER_1K
    const totalCost = inputCost + outputCost
    
    return {
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        input_cost_usd: Number(inputCost.toFixed(6)),
        output_cost_usd: Number(outputCost.toFixed(6)),
        total_cost_usd: Number(totalCost.toFixed(6))
    }
}

/**
 * Smart text chunking - splits by paragraphs and sentences
 */
function chunkTextSmart(text: string, maxTokens: number = 6000): string[] {
    // Split by paragraphs
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim())
    const chunks: string[] = []
    let currentChunk: string[] = []
    let currentTokens = 0
    
    for (const paragraph of paragraphs) {
        const paraTokens = countTokensEstimate(paragraph)
        
        if (currentTokens + paraTokens > maxTokens && currentChunk.length > 0) {
            // Save current chunk
            chunks.push(currentChunk.join('\n\n'))
            currentChunk = [paragraph]
            currentTokens = paraTokens
        } else {
            currentChunk.push(paragraph)
            currentTokens += paraTokens
        }
    }
    
    // Add last chunk
    if (currentChunk.length > 0) {
        chunks.push(currentChunk.join('\n\n'))
    }
    
    // If still too long, split by sentences
    if (chunks.length === 1 && currentTokens > maxTokens) {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim())
        chunks.length = 0
        currentChunk = []
        currentTokens = 0
        
        for (const sentence of sentences) {
            const sentTokens = countTokensEstimate(sentence)
            
            if (currentTokens + sentTokens > maxTokens && currentChunk.length > 0) {
                chunks.push(currentChunk.join('. ') + '.')
                currentChunk = [sentence.trim()]
                currentTokens = sentTokens
            } else {
                currentChunk.push(sentence.trim())
                currentTokens += sentTokens
            }
        }
        
        if (currentChunk.length > 0) {
            chunks.push(currentChunk.join('. ') + '.')
        }
    }
    
    return chunks
}

/**
 * Generate summarization prompt
 */
function getSummaryPrompt(
    text: string, 
    length: 'short' | 'medium' | 'long', 
    bulletPoints: boolean, 
    language: string
): string {
    const lengthInstructions = {
        short: "çok kısa bir özet (2-3 paragraf)",
        medium: "orta uzunlukta detaylı bir özet (4-6 paragraf)",
        long: "kapsamlı ve detaylı bir özet (ana noktaları kaçırmadan)"
    }
    
    const lengthInstruction = lengthInstructions[length] || lengthInstructions.medium
    const formatInstruction = bulletPoints 
        ? "Özeti madde işaretli (bullet points) şekilde sun."
        : "Özeti akıcı paragraflar halinde sun."
    
    let langInstruction = ""
    if (language === "tr") {
        langInstruction = "Özeti Türkçe olarak yaz."
    } else if (language === "en") {
        langInstruction = "Summarize in English."
    } else {
        langInstruction = `Özeti aynı dilde (${language}) yaz.`
    }
    
    return `Aşağıdaki metni özetle.

İSTENENLER:
- ${lengthInstruction} hazırla
- ${formatInstruction}
- ${langInstruction}
- Ana fikirleri ve önemli detayları koru
- Gereksiz tekrarlardan kaçın
- Profesyonel ve anlaşılır bir dil kullan

METİN:
${text}

ÖZET:`
}

/**
 * Call AWS Bedrock with Mistral model
 */
async function callBedrockMistral(prompt: string, maxTokens: number = 4000): Promise<string> {
    if (!bedrockClient) {
        throw new Error("Bedrock client is not initialized. Please check your AWS credentials.")
    }
    
    try {
        const requestBody = {
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: maxTokens,
            temperature: BEDROCK_CONFIG.TEMPERATURE,
            top_p: BEDROCK_CONFIG.TOP_P,
        }
        
        const command = new InvokeModelCommand({
            modelId: BEDROCK_CONFIG.MODEL_ID,
            body: JSON.stringify(requestBody),
            contentType: "application/json",
            accept: "application/json"
        })
        
        const response = await bedrockClient.send(command)
        const responseBody = JSON.parse(new TextDecoder().decode(response.body))
        console.log("responseBody", responseBody)
        console.log("responseBody", responseBody.choices)
        // Parse Mistral response format
        let summary = ""
        if (responseBody.choices && responseBody.choices[0]) {
            summary = responseBody.choices[0].message.content
        } else {
            console.error("Unexpected response format:", responseBody)
            throw new Error("Unexpected response format from Bedrock", responseBody)
        }
        
        return summary.trim()
        
    } catch (error) {
        console.error("Bedrock API error:", error)
        throw new Error(`Failed to generate summary: ${error instanceof Error ? error.message : String(error)}`)
    }
}

/**
 * Summarize long text with chunking
 */
async function summarizeLongText(
    text: string,
    length: 'short' | 'medium' | 'long',
    bulletPoints: boolean,
    language: string,
    customPrompt?: string
): Promise<{ summary: string; chunksProcessed: number; inputTokens: number; outputTokens: number }> {
    const totalTokens = countTokensEstimate(text)
    console.log(`📊 Total estimated tokens: ${totalTokens}`)
    
    let totalInputTokens = 0
    let totalOutputTokens = 0
    
    // If text fits in one chunk, summarize directly
    if (totalTokens < 6000) {
        const prompt = customPrompt 
            ? `${customPrompt}\n\nMETİN:\n${text}`
            : getSummaryPrompt(text, length, bulletPoints, language)
        
        totalInputTokens = countTokensEstimate(prompt)
        const summary = await callBedrockMistral(prompt, 4000)
        totalOutputTokens = countTokensEstimate(summary)
        
        return { summary, chunksProcessed: 1, inputTokens: totalInputTokens, outputTokens: totalOutputTokens }
    }
    
    // Long text - split into chunks
    console.log(`📚 Text is long, chunking...`)
    const chunks = chunkTextSmart(text, 6000)
    console.log(`✂️ Split into ${chunks.length} chunks`)
    
    // Summarize each chunk
    const chunkSummaries: string[] = []
    for (let i = 0; i < chunks.length; i++) {
        console.log(`⚙️ Processing chunk ${i + 1}/${chunks.length}...`)
        
        const prompt = customPrompt
            ? `${customPrompt}\n\nMETİN:\n${chunks[i]}`
            : getSummaryPrompt(chunks[i], 'medium', false, language)
        
        totalInputTokens += countTokensEstimate(prompt)
        const chunkSummary = await callBedrockMistral(prompt, 2000)
        totalOutputTokens += countTokensEstimate(chunkSummary)
        chunkSummaries.push(chunkSummary)
    }
    
    // Combine chunk summaries
    const combinedText = chunkSummaries.join('\n\n')
    
    // Final summary
    console.log(`🔄 Creating final summary from ${chunkSummaries.length} chunk summaries...`)
    const finalPrompt = getSummaryPrompt(combinedText, length, bulletPoints, language)
    totalInputTokens += countTokensEstimate(finalPrompt)
    const finalSummary = await callBedrockMistral(finalPrompt, 4000)
    totalOutputTokens += countTokensEstimate(finalSummary)
    
    return { summary: finalSummary, chunksProcessed: chunks.length, inputTokens: totalInputTokens, outputTokens: totalOutputTokens }
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
        const { summary, chunksProcessed, inputTokens, outputTokens } = await summarizeLongText(
            text,
            summaryLength,
            bulletPoints,
            detectedLang,
            body.custom_prompt
        )
        
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
        bedrock_available: bedrockClient !== null,
        model_id: BEDROCK_CONFIG.MODEL_ID,
        region: BEDROCK_CONFIG.REGION
    })
}

