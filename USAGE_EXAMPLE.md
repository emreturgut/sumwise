# Summarization API - Usage Examples

## Table of Contents
- [Quick Start](#quick-start)
- [API Endpoint Usage](#api-endpoint-usage)
- [React Component Example](#react-component-example)
- [Node.js/Server-Side Example](#nodejs-server-side-example)
- [Using the Helper Functions](#using-the-helper-functions)
- [Testing](#testing)

---

## Quick Start

### 1. Configure AWS Credentials

Create `.env.local` in the project root:

```bash
AWS_REGION=eu-central-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
```

### 2. Start the Development Server

```bash
npm run dev
```

### 3. Test the Endpoint

```bash
# Run the test script
node test-summarize.js

# Or test with curl
curl -X POST http://localhost:3000/api/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your text here (minimum 100 characters)...",
    "summary_length": "medium"
  }'
```

---

## API Endpoint Usage

### Basic Request

```typescript
const response = await fetch('/api/summarize', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: "Your long text to summarize..."
  })
})

const data = await response.json()
console.log(data.summary)
```

### Advanced Request

```typescript
const response = await fetch('/api/summarize', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: "Your long text...",
    language: "tr",              // Force Turkish language
    summary_length: "short",     // short | medium | long
    bullet_points: true,         // Get bullet points
    custom_prompt: "Özetle ve ana noktaları vurgula"
  })
})

const data = await response.json()
```

### Response Format

```typescript
{
  "summary": "The generated summary text...",
  "original_length": 1500,
  "summary_length": 250,
  "detected_language": "en",
  "processing_time": 2.5,
  "model_used": "eu.mistral.pixtral-large-2502-v1:0",
  "chunks_processed": 1
}
```

---

## React Component Example

### Simple Summarizer Component

```typescript
'use client'

import { useState } from 'react'
import { summarizeText, SummarizeResponse } from '@/lib/summarize-types'

export default function TextSummarizer() {
  const [text, setText] = useState('')
  const [summary, setSummary] = useState<SummarizeResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSummarize = async () => {
    if (text.length < 100) {
      setError('Text must be at least 100 characters long')
      return
    }

    setLoading(true)
    setError(null)

    const result = await summarizeText({
      text,
      summary_length: 'medium',
      bullet_points: false
    })

    if (result.success) {
      setSummary(result.data)
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Text Summarizer</h1>
      
      {/* Input Area */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Enter text to summarize (min 100 characters)
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-48 p-3 border rounded-lg"
          placeholder="Paste your text here..."
        />
        <p className="text-sm text-gray-500 mt-1">
          {text.length} characters / {text.split(/\s+/).length} words
        </p>
      </div>

      {/* Summarize Button */}
      <button
        onClick={handleSummarize}
        disabled={loading || text.length < 100}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Summarizing...' : 'Summarize'}
      </button>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Summary Display */}
      {summary && (
        <div className="mt-6 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <p className="text-gray-800 whitespace-pre-wrap mb-4">
            {summary.summary}
          </p>
          
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Original</p>
              <p className="font-semibold">{summary.original_length} words</p>
            </div>
            <div>
              <p className="text-gray-500">Summary</p>
              <p className="font-semibold">{summary.summary_length} words</p>
            </div>
            <div>
              <p className="text-gray-500">Compression</p>
              <p className="font-semibold">
                {((summary.summary_length / summary.original_length) * 100).toFixed(0)}%
              </p>
            </div>
            <div>
              <p className="text-gray-500">Time</p>
              <p className="font-semibold">{summary.processing_time}s</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
```

### Advanced Component with Options

```typescript
'use client'

import { useState } from 'react'
import { summarizeText, SummaryLength } from '@/lib/summarize-types'

export default function AdvancedSummarizer() {
  const [text, setText] = useState('')
  const [language, setLanguage] = useState('auto')
  const [summaryLength, setSummaryLength] = useState<SummaryLength>('medium')
  const [bulletPoints, setBulletPoints] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSummarize = async () => {
    setLoading(true)
    
    const result = await summarizeText({
      text,
      language: language === 'auto' ? undefined : language,
      summary_length: summaryLength,
      bullet_points: bulletPoints
    })

    if (result.success) {
      setSummary(result.data.summary)
    }
    
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm mb-2">Language</label>
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="auto">Auto-detect</option>
            <option value="tr">Turkish</option>
            <option value="en">English</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-2">Length</label>
          <select 
            value={summaryLength} 
            onChange={(e) => setSummaryLength(e.target.value as SummaryLength)}
            className="w-full p-2 border rounded"
          >
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-2">Format</label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={bulletPoints}
              onChange={(e) => setBulletPoints(e.target.checked)}
              className="mr-2"
            />
            Bullet Points
          </label>
        </div>
      </div>

      {/* Text Input */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-64 p-4 border rounded-lg"
        placeholder="Enter text to summarize..."
      />

      <button
        onClick={handleSummarize}
        disabled={loading}
        className="bg-blue-600 text-white px-8 py-3 rounded-lg"
      >
        {loading ? 'Processing...' : 'Summarize'}
      </button>

      {summary && (
        <div className="p-6 bg-white border rounded-lg">
          <h3 className="font-bold mb-4">Summary:</h3>
          <p className="whitespace-pre-wrap">{summary}</p>
        </div>
      )}
    </div>
  )
}
```

---

## Node.js Server-Side Example

### In an API Route

```typescript
// app/api/some-route/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { articleText } = await request.json()
  
  // Call the summarize endpoint internally
  const summaryResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/summarize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: articleText,
      summary_length: 'short',
      bullet_points: true
    })
  })
  
  const summary = await summaryResponse.json()
  
  return NextResponse.json({
    success: true,
    summary: summary.summary
  })
}
```

### In a Server Component

```typescript
// app/article/[id]/page.tsx
import { summarizeText } from '@/lib/summarize-types'

export default async function ArticlePage({ params }: { params: { id: string } }) {
  // Fetch article
  const article = await fetchArticle(params.id)
  
  // Generate summary on the server
  const result = await summarizeText({
    text: article.content,
    summary_length: 'short'
  }, 'http://localhost:3000') // Use full URL for server-side

  return (
    <div>
      <h1>{article.title}</h1>
      
      {result.success && (
        <div className="bg-blue-50 p-4 rounded mb-6">
          <h2 className="font-semibold mb-2">Quick Summary</h2>
          <p>{result.data.summary}</p>
        </div>
      )}
      
      <div>{article.content}</div>
    </div>
  )
}
```

---

## Using the Helper Functions

### Import the Helpers

```typescript
import { 
  summarizeText, 
  checkSummarizeHealth,
  estimateSummarizationCost 
} from '@/lib/summarize-types'
```

### Check Service Health

```typescript
const health = await checkSummarizeHealth()

if (health?.bedrock_available) {
  console.log('✅ Summarization service is ready')
} else {
  console.log('❌ Summarization service is unavailable')
}
```

### Estimate Cost

```typescript
const text = "Your long text here..."
const wordCount = text.split(/\s+/).length

const estimatedCost = estimateSummarizationCost(wordCount)
console.log(`Estimated cost: $${estimatedCost}`)
```

---

## Testing

### Using the Test Script

```bash
# Test with English text (default)
node test-summarize.js

# Test with Turkish text
node test-summarize.js --turkish

# Test different lengths
node test-summarize.js --short
node test-summarize.js --long

# Test with bullet points
node test-summarize.js --bullets

# Health check only
node test-summarize.js --health
```

### Using curl

```bash
# Basic request
curl -X POST http://localhost:3000/api/summarize \
  -H "Content-Type: application/json" \
  -d @- << 'EOF'
{
  "text": "Artificial intelligence is transforming how we work and live. From healthcare to transportation, AI is making significant impacts across industries...",
  "summary_length": "short"
}
EOF

# Turkish example
curl -X POST http://localhost:3000/api/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Yapay zeka günümüzün en önemli teknolojik gelişmelerinden biridir...",
    "language": "tr",
    "summary_length": "medium",
    "bullet_points": true
  }'

# Health check
curl http://localhost:3000/api/summarize
```

### Programmatic Testing

```typescript
import { summarizeText } from '@/lib/summarize-types'

async function runTests() {
  console.log('Running summarization tests...')
  
  // Test 1: Short summary
  const test1 = await summarizeText({
    text: "Your test text here...",
    summary_length: 'short'
  })
  
  console.assert(test1.success, 'Test 1 failed')
  
  // Test 2: Bullet points
  const test2 = await summarizeText({
    text: "Your test text here...",
    bullet_points: true
  })
  
  console.assert(test2.success, 'Test 2 failed')
  
  console.log('✅ All tests passed!')
}
```

---

## Best Practices

### 1. Error Handling

Always handle errors gracefully:

```typescript
const result = await summarizeText({ text: longText })

if (!result.success) {
  // Show user-friendly error message
  alert(`Failed to summarize: ${result.error}`)
  return
}

// Use the summary
console.log(result.data.summary)
```

### 2. Loading States

Show loading indicators during processing:

```typescript
const [loading, setLoading] = useState(false)

const handleSummarize = async () => {
  setLoading(true)
  try {
    const result = await summarizeText({ text })
    // Handle result...
  } finally {
    setLoading(false)
  }
}
```

### 3. Input Validation

Validate text length before sending:

```typescript
if (text.length < 100) {
  alert('Text must be at least 100 characters')
  return
}

if (text.split(/\s+/).length > 10000) {
  alert('Text is too long (max 10,000 words)')
  return
}
```

### 4. Caching

Cache summaries to avoid repeated API calls:

```typescript
const summaryCache = new Map<string, string>()

async function getCachedSummary(text: string) {
  const cacheKey = hashText(text) // Create a hash of the text
  
  if (summaryCache.has(cacheKey)) {
    return summaryCache.get(cacheKey)
  }
  
  const result = await summarizeText({ text })
  if (result.success) {
    summaryCache.set(cacheKey, result.data.summary)
    return result.data.summary
  }
  
  return null
}
```

---

## Troubleshooting

### Issue: "Bedrock client is not initialized"

**Solution:** Check your `.env.local` file has the correct AWS credentials.

### Issue: "Text is too short"

**Solution:** Ensure your text is at least 100 characters long.

### Issue: Slow processing

**Solution:** 
- Long texts are automatically chunked and may take longer
- Check the `chunks_processed` field in the response
- Consider using 'short' summary length for faster results

### Issue: High costs

**Solution:**
- Use the `estimateSummarizationCost()` function before processing
- Implement caching to avoid re-summarizing the same content
- Consider batching multiple short texts into one request

---

## Additional Resources

- [AWS Bedrock Setup Guide](./SETUP_AWS_BEDROCK.md)
- [API Documentation](./API_DOCS.md)
- [AWS Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
- [Mistral AI Documentation](https://docs.mistral.ai/)

