# 🔧 Code Refactoring - Modular Architecture

Özetleme ve Bedrock ile ilgili tüm kod **modüler ve yeniden kullanılabilir** hale getirildi.

---

## 📦 Yeni Modül Yapısı

### 1. `lib/bedrock.ts` - AWS Bedrock Client & Utilities

AWS Bedrock ile ilgili tüm işlemler:

```typescript
import { getBedrockClient, invokeBedrockMistral, calculateCost } from '@/lib/bedrock'

// Bedrock client'ı al (singleton)
const client = getBedrockClient()

// Model invoke et
const result = await invokeBedrockMistral({
  prompt: "Your prompt here",
  maxTokens: 4000
})

// Maliyet hesapla
const cost = calculateCost(inputTokens, outputTokens)
```

**Exports:**
- `BEDROCK_CONFIG` - Model ve API ayarları
- `PRICING` - Token fiyatlandırması
- `getBedrockClient()` - Singleton client instance
- `isBedrockAvailable()` - Client availability check
- `invokeBedrockMistral()` - Model invoke fonksiyonu
- `calculateCost()` - Maliyet hesaplama

---

### 2. `lib/summarize.ts` - Text Summarization Logic

Özetleme ile ilgili tüm işlemler:

```typescript
import { summarizeText, detectLanguage, chunkTextSmart } from '@/lib/summarize'

// Basit özetleme
const result = await summarizeText({
  text: "Long text...",
  length: "medium",
  bulletPoints: false,
  language: "tr"
})

// Dil tespit et
const lang = detectLanguage(text)

// Metni chunk'la
const chunks = chunkTextSmart(text, 6000)
```

**Exports:**
- `detectLanguage()` - Dil tespiti
- `countTokensEstimate()` - Token sayısı tahmini
- `chunkTextSmart()` - Akıllı metin bölme
- `getSummaryPrompt()` - Prompt oluşturma
- `summarizeText()` - **Ana özetleme fonksiyonu**

**Types:**
- `SummarizeOptions` - Özetleme parametreleri
- `SummarizeResult` - Özetleme sonucu

---

### 3. `app/api/summarize/route.ts` - API Endpoint (Temizlendi)

Artık **sadece API endpoint logic'i** var:

```typescript
import { summarizeText } from '@/lib/summarize'
import { calculateCost } from '@/lib/bedrock'

export async function POST(request: NextRequest) {
  // 1. Parse request
  // 2. Validate input
  // 3. Call summarizeText()
  // 4. Calculate cost
  // 5. Return response
}
```

**Daha temiz:**
- ❌ 300+ satır → ✅ ~110 satır
- ❌ Helper fonksiyonlar route içinde → ✅ Ayrı modüllerde
- ❌ Bedrock client route içinde → ✅ `lib/bedrock.ts`'de

---

## 🎯 Kullanım Örnekleri

### Başka Bir API Route'tan Kullanma

```typescript
// app/api/batch-summarize/route.ts
import { summarizeText } from '@/lib/summarize'

export async function POST(request: NextRequest) {
  const { articles } = await request.json()
  
  const summaries = await Promise.all(
    articles.map(article => 
      summarizeText({
        text: article.content,
        length: 'short',
        language: 'tr'
      })
    )
  )
  
  return NextResponse.json({ summaries })
}
```

### Server Component'te Kullanma

```typescript
// app/article/[id]/page.tsx
import { summarizeText } from '@/lib/summarize'

export default async function ArticlePage({ params }) {
  const article = await fetchArticle(params.id)
  
  // Server-side özetleme
  const result = await summarizeText({
    text: article.content,
    length: 'short'
  })
  
  return (
    <div>
      <h1>{article.title}</h1>
      <div className="summary">{result.summary}</div>
      <div className="content">{article.content}</div>
    </div>
  )
}
```

### Scheduled Job'da Kullanma

```typescript
// lib/jobs/daily-summary.ts
import { summarizeText } from '@/lib/summarize'
import { calculateCost } from '@/lib/bedrock'

export async function generateDailySummaries() {
  const articles = await getArticlesFromToday()
  
  let totalCost = 0
  
  for (const article of articles) {
    const result = await summarizeText({
      text: article.content,
      length: 'medium'
    })
    
    const cost = calculateCost(result.inputTokens, result.outputTokens)
    totalCost += cost.total_cost_usd
    
    await saveArticleSummary(article.id, result.summary)
  }
  
  console.log(`📊 Processed ${articles.length} articles`)
  console.log(`💰 Total cost: $${totalCost.toFixed(4)}`)
}
```

### CLI Tool'dan Kullanma

```typescript
// scripts/summarize-cli.ts
import { summarizeText } from '@/lib/summarize'
import { readFileSync } from 'fs'

async function main() {
  const filePath = process.argv[2]
  const text = readFileSync(filePath, 'utf-8')
  
  console.log('🚀 Summarizing...')
  
  const result = await summarizeText({
    text,
    length: 'medium',
    language: 'auto'
  })
  
  console.log('📝 Summary:')
  console.log(result.summary)
  console.log(`\n💰 Cost: $${calculateCost(result.inputTokens, result.outputTokens).total_cost_usd}`)
}

main()
```

---

## 🔄 Migration Guide

### Eski Kod (Route içinde):

```typescript
// ❌ Eski: Her şey route.ts içinde
import { BedrockRuntimeClient } from '@aws-sdk/client-bedrock-runtime'

const bedrockClient = new BedrockRuntimeClient({ region: '...' })

async function callBedrock(prompt: string) {
  // ... Bedrock logic
}

async function summarizeLongText(text: string) {
  // ... Özetleme logic
}

export async function POST(request: NextRequest) {
  const result = await summarizeLongText(text)
  // ...
}
```

### Yeni Kod (Modüler):

```typescript
// ✅ Yeni: Temiz ve modüler
import { summarizeText } from '@/lib/summarize'
import { calculateCost, BEDROCK_CONFIG } from '@/lib/bedrock'

export async function POST(request: NextRequest) {
  const result = await summarizeText({ text, length: 'medium' })
  const cost = calculateCost(result.inputTokens, result.outputTokens)
  // ...
}
```

---

## 📊 Faydaları

### 1. **Code Reusability** ✅
- Özetleme fonksiyonları artık herhangi bir yerden kullanılabilir
- API route, Server Component, CLI tool, scheduled job, vb.

### 2. **Separation of Concerns** ✅
- Bedrock logic → `lib/bedrock.ts`
- Özetleme logic → `lib/summarize.ts`
- API endpoint → `route.ts`

### 3. **Easier Testing** ✅
```typescript
// Test summarize fonksiyonunu
import { summarizeText } from '@/lib/summarize'

describe('summarizeText', () => {
  it('should summarize short text', async () => {
    const result = await summarizeText({
      text: 'Short text...',
      length: 'short'
    })
    expect(result.summary).toBeDefined()
  })
})
```

### 4. **Better Maintainability** ✅
- Her modül tek bir sorumluluğa sahip
- Değişiklikler daha kolay
- Debugging daha basit

### 5. **Type Safety** ✅
```typescript
// Tüm fonksiyonlar type-safe
const result: SummarizeResult = await summarizeText({...})
const cost: CostEstimate = calculateCost(input, output)
```

---

## 🧪 Test

Refactoring'den sonra test edin:

```bash
# Server'ı başlat
npm run dev

# Test script'i çalıştır
node test-summarize.js --turkish

# API'yi test et
curl -X POST http://localhost:3000/api/summarize \
  -H "Content-Type: application/json" \
  -d '{"text":"Test text..."}'
```

---

## 📁 Dosya Yapısı

```
ai-summarizer/
├── app/
│   └── api/
│       └── summarize/
│           └── route.ts          # ✅ Temiz API endpoint (110 satır)
└── lib/
    ├── bedrock.ts                # ✅ AWS Bedrock utilities
    ├── summarize.ts              # ✅ Text summarization logic
    └── summarize-types.ts        # ✅ TypeScript types
```

---

## 🎉 Sonuç

Artık özetleme ve Bedrock fonksiyonları:
- ✅ **Modüler** - Ayrı dosyalarda
- ✅ **Reusable** - Her yerden kullanılabilir
- ✅ **Testable** - Test edilmesi kolay
- ✅ **Maintainable** - Sürdürülmesi kolay
- ✅ **Type-Safe** - Tam TypeScript desteği

**Code quality significantly improved! 🚀**

