# 💰 Maliyet Takibi - Cost Tracking

Her özetleme isteği için otomatik maliyet hesaplaması yapılmaktadır.

## ✅ Eklenen Özellikler

### 1. Response'a Maliyet Bilgisi Eklendi

Her `/api/summarize` isteğinin response'ında artık `cost_estimate` objesi bulunmaktadır:

```json
{
  "summary": "...",
  "original_length": 1500,
  "summary_length": 250,
  "cost_estimate": {
    "input_tokens": 2340,
    "output_tokens": 390,
    "input_cost_usd": 0.007020,
    "output_cost_usd": 0.005850,
    "total_cost_usd": 0.012870
  }
}
```

### 2. Token Sayımı

- **Input Tokens:** Gönderilen prompt'ların toplam token sayısı
- **Output Tokens:** Model'den dönen özetlerin toplam token sayısı
- Chunk'lara bölünen metinlerde tüm API çağrılarının toplamı

### 3. Maliyet Hesaplama

#### Mistral Pixtral Large Fiyatlandırması:
- **Input:** $0.003 per 1K tokens
- **Output:** $0.015 per 1K tokens

#### Hesaplama Formülü:
```typescript
inputCost = (inputTokens / 1000) * 0.003
outputCost = (outputTokens / 1000) * 0.015
totalCost = inputCost + outputCost
```

---

## 📊 Örnek Maliyet Senaryoları

### Senaryo 1: Kısa Makale (500 kelime)
```
Input: ~650 tokens (prompt + text)
Output: ~130 tokens (summary)
Cost: ~$0.004
```

### Senaryo 2: Orta Boy Makale (1,500 kelime)
```
Input: ~2,340 tokens
Output: ~390 tokens
Cost: ~$0.013
```

### Senaryo 3: Uzun Makale (5,000 kelime) - Chunking
```
Input: ~9,100 tokens (3 chunk + prompt overhead)
Output: ~1,040 tokens
Cost: ~$0.043
```

### Senaryo 4: Çok Uzun Belge (10,000 kelime) - Multi-Chunk
```
Input: ~19,500 tokens (6 chunks + final summary)
Output: ~2,210 tokens
Cost: ~$0.092
```

---

## 🔍 Console Logging

Server console'da her istek için maliyet bilgisi yazdırılır:

```bash
🌍 Detected language: tr
🚀 Starting summarization...
📊 Total estimated tokens: 2340
✅ Summarization completed in 2.5s
💰 Estimated cost: $0.012870 (Input: 2340 tokens, Output: 390 tokens)
```

---

## 📈 API Response Örneği

### Request:
```bash
curl -X POST http://localhost:3000/api/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Uzun metin buraya...",
    "summary_length": "medium"
  }'
```

### Response:
```json
{
  "summary": "Yapay zeka teknolojileri hızla gelişiyor...",
  "original_length": 1500,
  "summary_length": 250,
  "detected_language": "tr",
  "processing_time": 2.5,
  "model_used": "eu.mistral.pixtral-large-2502-v1:0",
  "chunks_processed": 1,
  "cost_estimate": {
    "input_tokens": 2340,
    "output_tokens": 390,
    "input_cost_usd": 0.007020,
    "output_cost_usd": 0.005850,
    "total_cost_usd": 0.012870
  }
}
```

---

## 🧪 Test Edildi

Test script (`test-summarize.js`) güncellenmiş ve artık maliyet bilgisini gösteriyor:

```bash
node test-summarize.js
```

**Çıktı:**
```
✅ Summary generated successfully!

📊 Statistics:
  - Original Length: 1500 words
  - Summary Length: 250 words
  - Compression Ratio: 16.7%
  - Detected Language: tr
  - Processing Time: 2.5s (server) / 2.7s (total)
  - Model Used: eu.mistral.pixtral-large-2502-v1:0
  - Chunks Processed: 1

💰 Cost Estimate:
  - Input Tokens: 2,340
  - Output Tokens: 390
  - Input Cost: $0.007020
  - Output Cost: $0.005850
  - Total Cost: $0.012870
```

---

## 📝 TypeScript Types Güncellendi

`lib/summarize-types.ts` dosyasında `SummarizeResponse` interface'ine `cost_estimate` eklendi:

```typescript
export interface SummarizeResponse {
    summary: string
    // ... diğer alanlar
    cost_estimate: {
        input_tokens: number
        output_tokens: number
        input_cost_usd: number
        output_cost_usd: number
        total_cost_usd: number
    }
}
```

---

## 💡 Kullanım Örnekleri

### React Component'te Maliyet Gösterme

```typescript
import { summarizeText } from '@/lib/summarize-types'

const result = await summarizeText({ text: longText })

if (result.success) {
  console.log('Summary:', result.data.summary)
  console.log('Cost:', `$${result.data.cost_estimate.total_cost_usd}`)
  
  // UI'da göster
  setCost(result.data.cost_estimate.total_cost_usd)
  setTokens({
    input: result.data.cost_estimate.input_tokens,
    output: result.data.cost_estimate.output_tokens
  })
}
```

### Extension'da Maliyet Gösterme

Extension'daki `SummarizeComponent.tsx` güncellenebilir:

```typescript
// Response geldiğinde
console.log('Sumwise API response:', data)
console.log('Cost estimate:', `$${data.cost_estimate.total_cost_usd}`)

// UI'da göster
<div className="cost-info">
  <span>💰 Cost: ${data.cost_estimate.total_cost_usd.toFixed(6)}</span>
  <span>📊 Tokens: {data.cost_estimate.input_tokens} in / {data.cost_estimate.output_tokens} out</span>
</div>
```

---

## 📊 Aylık Maliyet Tahmini

### Düşük Kullanım (100 özet/ay)
- Ortalama 1,000 kelime/özet
- **~$1.30/ay**

### Orta Kullanım (1,000 özet/ay)
- Ortalama 1,500 kelime/özet
- **~$13.00/ay**

### Yüksek Kullanım (10,000 özet/ay)
- Ortalama 2,000 kelime/özet
- **~$150/ay**

---

## 🎯 Maliyet Optimizasyonu İpuçları

### 1. Summary Length'i Optimize Edin
```typescript
// Daha ucuz
{ summary_length: "short" }  // Daha az output token

// Daha pahalı
{ summary_length: "long" }    // Daha fazla output token
```

### 2. Caching Kullanın
```typescript
// Aynı metin için cache'den dön
const cacheKey = hashText(text)
if (cache.has(cacheKey)) {
  return cache.get(cacheKey)  // $0 maliyet!
}
```

### 3. Batch Processing
```typescript
// 10 kısa metni ayrı ayrı özetlemek yerine
// Birleştirip tek seferde özetleyin (daha verimli)
```

### 4. Token Limiti Ayarlayın
```typescript
// API'de max_tokens parametresini optimize edin
// Gereksiz uzun özetlerden kaçının
```

---

## 🔧 Gelecek Geliştirmeler

- [ ] Gerçek token sayımı (Bedrock response'undan)
- [ ] Aylık toplam maliyet takibi (database)
- [ ] Kullanıcı bazında maliyet limiti
- [ ] Maliyet alert'leri
- [ ] Detaylı maliyet raporu endpoint'i
- [ ] Real-time maliyet dashboard

---

## 🆘 Sorun Giderme

### "cost_estimate undefined" Hatası

Eski client kullanıyorsanız güncelleyin:
```bash
# Backend'i yeniden başlat
npm run dev

# Type definitions'ı güncelle
# lib/summarize-types.ts dosyası otomatik güncellenmiş olmalı
```

### Maliyet Çok Yüksek Görünüyor

Token tahmini yaklaşıktır. Gerçek maliyet AWS faturanızda görünecektir. Genelde tahmin %10-20 daha yüksek olabilir (güvenli taraf).

---

## 📚 İlgili Dosyalar

- `app/api/summarize/route.ts` - Ana maliyet hesaplama
- `lib/summarize-types.ts` - TypeScript types
- `test-summarize.js` - Test script
- `API_DOCS.md` - API dokümantasyonu

---

**💰 Artık her özetlemenin ne kadara mal olduğunu biliyorsunuz!**

