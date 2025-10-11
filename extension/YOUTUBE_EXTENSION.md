# 🎥 YouTube Özetleme - Browser Extension

Extension'da YouTube videoları artık tam olarak destekleniyor!

---

## ✨ Yenilikler

### YouTube Özetleme Entegrasyonu

- ✅ **Direkt API Entegrasyonu** - Backend `/api/summarize/youtube` endpoint'i kullanır
- ✅ **Otomatik Bullet Points** - YouTube özetleri otomatik madde işaretli
- ✅ **Sumwise Only** - Sadece Sumwise API ile çalışır (OpenAI desteklemiyor)
- ✅ **Tam Metadata** - Video ID, URL, transcript dili
- ✅ **Provider Aware** - OpenAI seçiliyse uyarı verir

---

## 🚀 Nasıl Kullanılır?

### Adım 1: Sumwise API Seçin

Extension'ı açın ve Settings'e gidin:
```
AI Provider: Sumwise API (Local) ✓
API URL: http://localhost:3000
```

**Önemli:** YouTube özetleme özelliği sadece Sumwise API ile çalışır!

### Adım 2: YouTube Videosuna Gidin

İki yöntem:
1. **Otomatik Detect:** YouTube videosuna gidin, extension otomatik algılar
2. **Manuel URL:** Content Type'ı "YouTube Video" seçin ve URL girin

### Adım 3: Ayarları Yapın

```
Content Type: YouTube (Auto-detected) ✓
Summary Language: 🇹🇷 TR  (veya Auto)
Character Limit: (isteğe bağlı)
```

### Adım 4: Summarize!

"Summarize" butonuna tıklayın ve bekleyin:
- ⏱️ İşlem süresi: 5-15 saniye (video uzunluğuna göre)
- 📝 Otomatik bullet points ile özet
- 💰 Maliyet bilgisi console'da

---

## 🔧 Teknik Detaylar

### Kod Yapısı

```typescript
// SummarizeComponent.tsx

case 'youtube':
  const videoUrl = youtubeUrl || currentUrl
  
  // Direkt endpoint'e gönder
  const youtubeResult = await summarizeYouTubeVideo(
    videoUrl, 
    effectiveCharLimit, 
    targetLang
  )
  
  setSummary({
    title: youtubeResult.title,
    summary: youtubeResult.summary,
    sourceUrl: youtubeResult.sourceUrl
  })
  
  return // Early return
```

### API Call

```typescript
const summarizeYouTubeWithSumwise = async (
  videoUrl: string,
  maxCharacters: number,
  targetLanguage: string,
  apiUrl: string
) => {
  const response = await fetch(`${apiUrl}/api/summarize/youtube`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: videoUrl,
      language: targetLanguage === 'auto' ? undefined : targetLanguage,
      summary_length: summaryLength, // based on character limit
      bullet_points: true // ✅ Otomatik bullet points
    })
  })
  
  const data = await response.json()
  
  return {
    title: `YouTube Video: ${data.video_id}`,
    summary: data.summary,
    sourceUrl: data.video_url
  }
}
```

---

## 📊 Özellikler

### ✅ Desteklenen

| Özellik | Durum | Açıklama |
|---------|-------|----------|
| **Otomatik URL Detect** | ✅ | YouTube sayfasında otomatik algılar |
| **Manuel URL Girişi** | ✅ | URL yazarak da özetleyebilirsiniz |
| **Bullet Points** | ✅ | Otomatik madde işaretli format |
| **Multi-language** | ✅ | Transcript ve özet dili ayrı |
| **Character Limit** | ✅ | İsteğe bağlı karakter limiti |
| **Cost Tracking** | ✅ | Console'da maliyet bilgisi |
| **Error Handling** | ✅ | Anlamlı hata mesajları |

### ❌ Limitler

| Limit | Açıklama |
|-------|----------|
| **Sadece Sumwise** | OpenAI ile YouTube özetleme yok |
| **Transcript Gerekli** | Video'da transcript olmalı |
| **Minimum 100 Karakter** | Çok kısa transcript'ler hata verir |

---

## 🎯 Kullanım Senaryoları

### Senaryo 1: Türkçe Tutorial Video

```
1. https://www.youtube.com/watch?v=TURKISH_VIDEO 'ya git
2. Extension aç
3. Content Type: YouTube (Auto-detected)
4. Language: 🇹🇷 TR
5. Summarize!

Sonuç:
• Ana konular madde madde
• 5-10 saniyede hazır
• Maliyet: ~$0.015
```

### Senaryo 2: Uzun İngilizce Konferans

```
1. 2 saatlik konferans videosu
2. Extension aç
3. Language: 🇬🇧 EN
4. Character Limit: Kapat (tam özet)
5. Summarize!

Sonuç:
• Detaylı bullet points
• Otomatik chunking
• 30-60 saniye
• Maliyet: ~$0.10
```

### Senaryo 3: Hızlı Haber Video

```
1. 5 dakikalık haber videosu
2. Extension aç (auto-detect)
3. Language: Auto
4. Character Limit: 300
5. Summarize!

Sonuç:
• Kısa özet bullet points
• 5 saniye
• Maliyet: ~$0.005
```

---

## 💡 UI/UX Detayları

### Provider Info

Extension'da aktif provider gösterilir:
```
┌─────────────────────────────────┐
│ Provider: 🚀 Sumwise API       │
│ (AWS Bedrock + Mistral)        │
└─────────────────────────────────┘
```

### Content Type

YouTube detect edildiğinde:
```
Content Type: YouTube (Auto-detected)
[Change] ← Manuel değişiklik için
```

### Error Messages

Provider uyumsuzluğu:
```
❌ YouTube summarization with OpenAI is not yet 
   implemented. Please use Sumwise API.
```

Transcript yok:
```
❌ No transcript available for this video
   Try a different video with captions.
```

---

## 🐛 Sorun Giderme

### "YouTube summarization with OpenAI is not yet implemented"

**Sebep:** OpenAI provider seçili  
**Çözüm:**
1. Settings'e git
2. AI Provider: Sumwise API seç
3. Save Settings
4. Tekrar dene

### "Failed to connect to Sumwise YouTube API"

**Sebep:** Backend server çalışmıyor  
**Çözüm:**
```bash
cd /Users/emreturgut/code/cyber-rabbit/ai-summarizer
npm run dev
```

### "No transcript available"

**Sebep:** Video'da transcript yok  
**Çözüm:**
- Manuel altyazılı video seç
- Otomatik altyazılı video dene
- Farklı video dene

### "Invalid YouTube URL"

**Sebep:** URL formatı yanlış  
**Çözüm:**
- Tam YouTube URL kullan: `https://www.youtube.com/watch?v=VIDEO_ID`
- Video ID'nin 11 karakter olduğundan emin ol

---

## 📈 Performance

### Beklenen Süreler

| Video Uzunluğu | İşlem Süresi | Maliyet |
|----------------|--------------|---------|
| 5 dakika | 5-8 saniye | $0.005 |
| 15 dakika | 10-15 saniye | $0.015 |
| 30 dakika | 15-25 saniye | $0.035 |
| 1 saat | 25-40 saniye | $0.075 |
| 2 saat | 40-60 saniye | $0.150 |

### Optimization Tips

```typescript
// ✅ İyi: Character limit kullan (daha hızlı)
Character Limit: 300 → ~5 saniye

// ✅ İyi: Short summary seç
Summary Length: Short → Daha az output token

// ❌ Kötü: Çok uzun video + Long summary
2 saat video + Long + Character Limit: OFF → 60+ saniye
```

---

## 🔒 Privacy & Security

### Data Flow

```
Extension → Sumwise API → YouTube Transcript API
                ↓
          Transcript Text
                ↓
          AWS Bedrock (Mistral)
                ↓
          Summary (bullet points)
                ↓
          Extension
```

### Ne Saklanır?

- ❌ Video URL'ler **saklanmaz** (sadece işlem sırasında)
- ❌ Transcript'ler **saklanmaz** (geçici)
- ❌ Özetler **saklanmaz** (client-side only)
- ✅ Logs: Development mode'da console'da görünür

---

## 📚 Kod Referansı

### İlgili Dosyalar

```
extension/src/popup/components/
└── SummarizeComponent.tsx
    ├── summarizeYouTubeVideo()         # Router function
    └── summarizeYouTubeWithSumwise()   # API call

app/api/summarize/youtube/
└── route.ts                             # Backend endpoint
```

### Key Functions

```typescript
// Extension
summarizeYouTubeVideo(url, charLimit, lang)
  → Routes to Sumwise
  → Returns { title, summary, sourceUrl }

summarizeYouTubeWithSumwise(url, charLimit, lang, apiUrl)
  → Calls /api/summarize/youtube
  → Passes bullet_points: true
  → Returns formatted result

// Backend  
POST /api/summarize/youtube
  → Extracts video ID
  → Fetches transcript
  → Summarizes with AI
  → Returns summary + metadata
```

---

## 🎉 Özet

YouTube özetleme artık extension'da tam entegre:

- ✅ **Kolay Kullanım** - Sadece video'ya git ve tıkla
- ✅ **Otomatik Bullet Points** - Her zaman madde işaretli
- ✅ **Provider Aware** - Sadece Sumwise ile çalışır
- ✅ **Full Metadata** - Video ID, URL, dil bilgileri
- ✅ **Error Handling** - Anlamlı hatalar
- ✅ **Cost Tracking** - Console'da maliyet

**YouTube videolarını extension'dan özetleyin! 🎥🚀**

