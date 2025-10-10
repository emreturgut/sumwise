# 📚 Lib Directory - Reusable Utilities

Bu klasör, projenin tüm yeniden kullanılabilir utility fonksiyonlarını içerir.

---

## 📁 Dosyalar

### `bedrock.ts` - AWS Bedrock Client & API
AWS Bedrock ile etkileşim için tüm fonksiyonlar.

**Exports:**
```typescript
// Configuration
export const BEDROCK_CONFIG: {
  MODEL_ID: string
  MAX_TOKENS: number
  TEMPERATURE: number
  TOP_P: number
  REGION: string
}

export const PRICING: {
  INPUT_PER_1K: number
  OUTPUT_PER_1K: number
}

// Functions
export function getBedrockClient(): BedrockRuntimeClient
export function isBedrockAvailable(): boolean
export function invokeBedrockMistral(options: BedrockInvokeOptions): Promise<string>
export function calculateCost(inputTokens: number, outputTokens: number): CostEstimate
```

**Kullanım:**
```typescript
import { invokeBedrockMistral, calculateCost } from '@/lib/bedrock'

const response = await invokeBedrockMistral({
  prompt: "Summarize this...",
  maxTokens: 4000
})

const cost = calculateCost(2000, 400)
console.log(`Cost: $${cost.total_cost_usd}`)
```

---

### `summarize.ts` - Text Summarization Logic
Metin özetleme için tüm fonksiyonlar.

**Exports:**
```typescript
// Types
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

// Functions
export function detectLanguage(text: string): string
export function countTokensEstimate(text: string): number
export function chunkTextSmart(text: string, maxTokens?: number): string[]
export function getSummaryPrompt(text: string, length: SummaryLength, bulletPoints: boolean, language: string): string
export async function summarizeText(options: SummarizeOptions): Promise<SummarizeResult>
```

**Kullanım:**
```typescript
import { summarizeText } from '@/lib/summarize'

const result = await summarizeText({
  text: "Long article text...",
  length: "medium",
  bulletPoints: false,
  language: "tr"
})

console.log(result.summary)
console.log(`Processed ${result.chunksProcessed} chunks`)
console.log(`Cost: ${result.inputTokens} in / ${result.outputTokens} out tokens`)
```

---

### `summarize-types.ts` - TypeScript Type Definitions
Public API için type definitions.

**Exports:**
```typescript
export type SummaryLength = 'short' | 'medium' | 'long'
export type LanguageCode = 'tr' | 'en' | 'es' | ...

export interface SummarizeRequest { ... }
export interface SummarizeResponse { ... }
export interface SummarizeError { ... }
export interface SummarizeHealthResponse { ... }

// Helper functions
export async function summarizeText(request: SummarizeRequest, baseUrl?: string): Promise<...>
export async function checkSummarizeHealth(baseUrl?: string): Promise<...>
export function estimateSummarizationCost(textWordCount: number): number
```

---

### `database.ts` - Database Utilities
PostgreSQL database bağlantısı ve query'ler.

### `auth.ts` - Authentication Utilities  
JWT, password hashing, session management.

### `utils.ts` - General Utilities
Diğer genel amaçlı helper fonksiyonlar.

---

## 🎯 Design Principles

### 1. Single Responsibility
Her modül tek bir sorumluluğa sahip:
- `bedrock.ts` → AWS Bedrock
- `summarize.ts` → Text summarization
- `auth.ts` → Authentication
- `database.ts` → Database operations

### 2. Dependency Injection
```typescript
// ✅ İyi: Bağımlılıklar inject edilebilir
export function calculateCost(inputTokens: number, outputTokens: number) {
  // Pricing dışarıdan alınabilir
}

// ❌ Kötü: Hard-coded dependencies
function calculate() {
  const price = HARDCODED_PRICE
}
```

### 3. Type Safety
Tüm fonksiyonlar type-safe:
```typescript
const result: SummarizeResult = await summarizeText({ text: "..." })
```

### 4. Error Handling
Her fonksiyon düzgün hata yönetimi yapıyor:
```typescript
try {
  const result = await invokeBedrockMistral({ prompt })
} catch (error) {
  // Anlamlı hata mesajı
  throw new Error(`Failed to invoke Bedrock: ${error.message}`)
}
```

---

## 📖 Kullanım Örnekleri

### API Route'tan
```typescript
// app/api/custom/route.ts
import { summarizeText } from '@/lib/summarize'

export async function POST(request: NextRequest) {
  const { text } = await request.json()
  const result = await summarizeText({ text, length: 'short' })
  return NextResponse.json({ summary: result.summary })
}
```

### Server Component'ten
```typescript
// app/page.tsx
import { summarizeText } from '@/lib/summarize'

export default async function HomePage() {
  const article = await fetchArticle()
  const result = await summarizeText({ text: article.content })
  
  return <div>{result.summary}</div>
}
```

### Client Component'ten (API üzerinden)
```typescript
'use client'
import { summarizeText } from '@/lib/summarize-types'

export default function ClientComponent() {
  const handleSummarize = async () => {
    const result = await summarizeText({ text: "..." })
    // result.success check
  }
}
```

---

## 🧪 Testing

### Unit Test
```typescript
import { countTokensEstimate, detectLanguage } from '@/lib/summarize'

describe('summarize utilities', () => {
  it('should estimate token count', () => {
    const tokens = countTokensEstimate('Hello world')
    expect(tokens).toBeGreaterThan(0)
  })
  
  it('should detect Turkish', () => {
    const lang = detectLanguage('Merhaba dünya')
    expect(lang).toBe('tr')
  })
})
```

### Integration Test
```typescript
import { summarizeText } from '@/lib/summarize'

describe('summarizeText', () => {
  it('should summarize text', async () => {
    const result = await summarizeText({
      text: 'Long text...',
      length: 'short'
    })
    expect(result.summary).toBeDefined()
    expect(result.chunksProcessed).toBeGreaterThan(0)
  })
})
```

---

## 🔧 Configuration

### Environment Variables
```bash
# .env.local
AWS_REGION=eu-central-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

### Bedrock Config
`lib/bedrock.ts` içinde:
```typescript
export const BEDROCK_CONFIG = {
  MODEL_ID: "eu.mistral.pixtral-large-2502-v1:0",
  MAX_TOKENS: 8000,
  TEMPERATURE: 0.3,
  TOP_P: 0.9,
  REGION: process.env.AWS_REGION || "eu-central-1"
}
```

---

## 📊 Performance

### Caching
```typescript
// Tekrarlanan özetlemeler için cache kullanın
const cache = new Map<string, SummarizeResult>()

async function getCachedSummary(text: string) {
  const key = hashText(text)
  if (cache.has(key)) return cache.get(key)
  
  const result = await summarizeText({ text })
  cache.set(key, result)
  return result
}
```

### Batch Processing
```typescript
// Çoklu özetlemeleri paralel yapın
const results = await Promise.all(
  texts.map(text => summarizeText({ text, length: 'short' }))
)
```

---

## 🆘 Troubleshooting

### "Module not found"
```typescript
// ✅ Doğru import path
import { summarizeText } from '@/lib/summarize'

// ❌ Yanlış
import { summarizeText } from 'lib/summarize'
```

### "Bedrock client not initialized"
```bash
# AWS credentials'ları kontrol edin
echo $AWS_ACCESS_KEY_ID
echo $AWS_SECRET_ACCESS_KEY

# .env.local dosyasını kontrol edin
cat .env.local
```

---

## 📚 Daha Fazla Bilgi

- [REFACTORING.md](../REFACTORING.md) - Refactoring detayları
- [COST_TRACKING.md](../COST_TRACKING.md) - Maliyet hesaplama
- [SETUP_AWS_BEDROCK.md](../SETUP_AWS_BEDROCK.md) - AWS setup

---

**Happy Coding! 🚀**

