import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'

// ==================== CONFIGURATION ====================

export const BEDROCK_CONFIG = {
    MODEL_ID: "eu.mistral.pixtral-large-2502-v1:0",
    MAX_TOKENS: 8000,
    TEMPERATURE: 0.3,
    TOP_P: 0.9,
    REGION: process.env.AWS_REGION || "eu-central-1"
}

// Mistral Pixtral Large pricing (per 1K tokens)
export const PRICING = {
    INPUT_PER_1K: 0.002,   // $0.002 per 1K input tokens
    OUTPUT_PER_1K: 0.006   // $0.006 per 1K output tokens
}

// ==================== CLIENT INITIALIZATION ====================

let bedrockClientInstance: BedrockRuntimeClient | null = null

/**
 * Get or create Bedrock client instance (singleton pattern)
 */
export function getBedrockClient(): BedrockRuntimeClient {
    if (!bedrockClientInstance) {
        try {
            bedrockClientInstance = new BedrockRuntimeClient({ 
                region: BEDROCK_CONFIG.REGION
            })
            console.log("✅ AWS Bedrock client initialized successfully")
        } catch (error) {
            console.error("❌ Failed to initialize Bedrock client:", error)
            throw new Error("Failed to initialize Bedrock client")
        }
    }
    return bedrockClientInstance
}

/**
 * Check if Bedrock client is available
 */
export function isBedrockAvailable(): boolean {
    try {
        getBedrockClient()
        return true
    } catch {
        return false
    }
}

// ==================== API FUNCTIONS ====================

export interface BedrockInvokeOptions {
    prompt: string
    maxTokens?: number
    temperature?: number
    topP?: number
    modelId?: string
}

/**
 * Call AWS Bedrock with Mistral model
 */
export async function invokeBedrockMistral(options: BedrockInvokeOptions): Promise<string> {
    const client = getBedrockClient()
    
    const {
        prompt,
        maxTokens = 4000,
        temperature = BEDROCK_CONFIG.TEMPERATURE,
        topP = BEDROCK_CONFIG.TOP_P,
        modelId = BEDROCK_CONFIG.MODEL_ID
    } = options
    
    try {
        const requestBody = {
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: maxTokens,
            temperature,
            top_p: topP,
        }
        
        const command = new InvokeModelCommand({
            modelId,
            body: JSON.stringify(requestBody),
            contentType: "application/json",
            accept: "application/json"
        })
        
        const response = await client.send(command)
        const responseBody = JSON.parse(new TextDecoder().decode(response.body))
        
        // Parse Mistral response format
        let result = ""
        if (responseBody.choices && responseBody.choices[0]) {
            result = responseBody.choices[0].message.content
        } else {
            console.error("Unexpected response format:", responseBody)
            throw new Error("Unexpected response format from Bedrock")
        }
        
        return result.trim()
        
    } catch (error) {
        console.error("Bedrock API error:", error)
        throw new Error(`Failed to invoke Bedrock: ${error instanceof Error ? error.message : String(error)}`)
    }
}

/**
 * Calculate cost based on token usage
 */
export function calculateCost(inputTokens: number, outputTokens: number) {
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

