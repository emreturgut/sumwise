import { invokeBedrockMistral } from './bedrock'

// ==================== TYPES ====================

export interface SummarizeOptions {
    text: string
    length?: 'short' | 'medium' | 'long'
    bulletPoints?: boolean
    language?: string
    customPrompt?: string
}

export interface SummarizeResult {
    summary: string
    chunksProcessed: number
    inputTokens: number
    outputTokens: number
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Simple language detection based on character patterns
 */
export function detectLanguage(text: string): string {
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
export function countTokensEstimate(text: string): number {
    const words = text.split(/\s+/).length
    // Turkish/English average: 1 word ≈ 1.3 tokens
    return Math.floor(words * 1.3)
}

/**
 * Smart text chunking - splits by paragraphs and sentences
 */
export function chunkTextSmart(text: string, maxTokens: number = 6000): string[] {
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
export function getSummaryPrompt(
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

// ==================== MAIN SUMMARIZATION FUNCTION ====================

/**
 * Summarize text using AWS Bedrock (supports long texts with chunking)
 */
export async function summarizeText(options: SummarizeOptions): Promise<SummarizeResult> {
    const {
        text,
        length = 'medium',
        bulletPoints = false,
        language,
        customPrompt
    } = options
    
    // Detect language if not provided
    const detectedLang = language || detectLanguage(text)
    
    const totalTokens = countTokensEstimate(text)
    console.log(`📊 Total estimated tokens: ${totalTokens}`)
    
    let totalInputTokens = 0
    let totalOutputTokens = 0
    
    // If text fits in one chunk, summarize directly
    if (totalTokens < 6000) {
        const prompt = customPrompt 
            ? `${customPrompt}\n\nMETİN:\n${text}`
            : getSummaryPrompt(text, length, bulletPoints, detectedLang)
        
        totalInputTokens = countTokensEstimate(prompt)
        const summary = await invokeBedrockMistral({ prompt, maxTokens: 4000 })
        totalOutputTokens = countTokensEstimate(summary)
        
        return { 
            summary, 
            chunksProcessed: 1, 
            inputTokens: totalInputTokens, 
            outputTokens: totalOutputTokens 
        }
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
            : getSummaryPrompt(chunks[i], 'medium', false, detectedLang)
        
        totalInputTokens += countTokensEstimate(prompt)
        const chunkSummary = await invokeBedrockMistral({ prompt, maxTokens: 2000 })
        totalOutputTokens += countTokensEstimate(chunkSummary)
        chunkSummaries.push(chunkSummary)
    }
    
    // Combine chunk summaries
    const combinedText = chunkSummaries.join('\n\n')
    
    // Final summary
    console.log(`🔄 Creating final summary from ${chunkSummaries.length} chunk summaries...`)
    const finalPrompt = getSummaryPrompt(combinedText, length, bulletPoints, detectedLang)
    totalInputTokens += countTokensEstimate(finalPrompt)
    const finalSummary = await invokeBedrockMistral({ prompt: finalPrompt, maxTokens: 4000 })
    totalOutputTokens += countTokensEstimate(finalSummary)
    
    return { 
        summary: finalSummary, 
        chunksProcessed: chunks.length, 
        inputTokens: totalInputTokens, 
        outputTokens: totalOutputTokens 
    }
}

