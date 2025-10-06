/**
 * Type definitions for the Text Summarization API
 * 
 * Use these types when calling the /api/summarize endpoint
 * from frontend components or other API routes.
 */

export type SummaryLength = 'short' | 'medium' | 'long'

export type LanguageCode = 'tr' | 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ja' | 'zh' | string

export interface SummarizeRequest {
    /** The text to summarize (minimum 100 characters) */
    text: string
    
    /** Language code (auto-detected if not provided) */
    language?: LanguageCode
    
    /** Length of the summary */
    summary_length?: SummaryLength
    
    /** Whether to return the summary as bullet points */
    bullet_points?: boolean
    
    /** Custom prompt for summarization (overrides default) */
    custom_prompt?: string
}

export interface SummarizeResponse {
    /** The generated summary */
    summary: string
    
    /** Number of words in the original text */
    original_length: number
    
    /** Number of words in the summary */
    summary_length: number
    
    /** Detected or specified language code */
    detected_language: string
    
    /** Processing time in seconds */
    processing_time: number
    
    /** AWS Bedrock model ID used */
    model_used: string
    
    /** Number of text chunks processed */
    chunks_processed: number
}

export interface SummarizeError {
    /** Error message */
    error: string
    
    /** Additional error details (only in development) */
    details?: string
}

export interface SummarizeHealthResponse {
    /** Service health status */
    status: string
    
    /** Service name */
    service: string
    
    /** Whether AWS Bedrock is available */
    bedrock_available: boolean
    
    /** AWS Bedrock model ID */
    model_id: string
    
    /** AWS region */
    region: string
}

/**
 * Helper function to call the summarization API
 * 
 * @example
 * ```typescript
 * const result = await summarizeText({
 *   text: "Your long text here...",
 *   summary_length: "medium",
 *   language: "tr"
 * })
 * 
 * if (result.success) {
 *   console.log(result.data.summary)
 * } else {
 *   console.error(result.error)
 * }
 * ```
 */
export async function summarizeText(
    request: SummarizeRequest,
    baseUrl: string = ''
): Promise<{ success: true; data: SummarizeResponse } | { success: false; error: string }> {
    try {
        const response = await fetch(`${baseUrl}/api/summarize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        })

        const data = await response.json()

        if (!response.ok) {
            return {
                success: false,
                error: data.error || `HTTP ${response.status}: ${response.statusText}`
            }
        }

        return {
            success: true,
            data: data as SummarizeResponse
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        }
    }
}

/**
 * Helper function to check summarization service health
 * 
 * @example
 * ```typescript
 * const health = await checkSummarizeHealth()
 * console.log('Bedrock available:', health.bedrock_available)
 * ```
 */
export async function checkSummarizeHealth(
    baseUrl: string = ''
): Promise<SummarizeHealthResponse | null> {
    try {
        const response = await fetch(`${baseUrl}/api/summarize`)
        if (!response.ok) return null
        
        return await response.json() as SummarizeHealthResponse
    } catch (error) {
        console.error('Health check failed:', error)
        return null
    }
}

/**
 * Estimate the cost of summarizing text
 * Based on AWS Bedrock pricing for Mistral Pixtral Large
 * 
 * @param textWordCount - Number of words in the text
 * @returns Estimated cost in USD
 */
export function estimateSummarizationCost(textWordCount: number): number {
    // Approximate token count (1 word ≈ 1.3 tokens)
    const inputTokens = Math.ceil(textWordCount * 1.3)
    
    // Assume output is ~20% of input
    const outputTokens = Math.ceil(inputTokens * 0.2)
    
    // Mistral Pixtral Large pricing (approximate)
    const inputCostPer1K = 0.003
    const outputCostPer1K = 0.015
    
    const inputCost = (inputTokens / 1000) * inputCostPer1K
    const outputCost = (outputTokens / 1000) * outputCostPer1K
    
    return Number((inputCost + outputCost).toFixed(4))
}

