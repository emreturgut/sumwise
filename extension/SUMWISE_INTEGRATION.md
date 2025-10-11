# Sumwise API Integration Guide

Browser extension'ınız artık **2 farklı AI provider** ile çalışabilir:
1. **OpenAI** - API key gerektirir
2. **Sumwise API** - Local backend'inizle çalışır (AWS Bedrock + Mistral)

## ✨ Yeni Özellikler

### 1. Provider Seçimi
- Extension settings'te artık AI provider seçebilirsiniz
- OpenAI veya Sumwise API arasında seçim yapın

### 2. Sumwise API
- ✅ AWS Bedrock ile Mistral Pixtral Large model kullanır
- ✅ API key gerektirmez (local server kullanır)
- ✅ Türkçe ve çok dilli destek
- ✅ Uzun metinleri otomatik chunking ile işler
- ✅ Daha ekonomik (kendi AWS hesabınızı kullanırsınız)

## 🚀 Kurulum ve Kullanım

### Adım 1: Backend Server'ı Başlatın

```bash
cd /Users/emreturgut/code/cyber-rabbit/ai-summarizer

# Server'ı başlat
npm run dev
```

Server `http://localhost:3000` adresinde çalışacak.

### Adım 2: Extension'ı Yükleyin/Güncelleyin

```bash
cd extension

# Extension'ı build et
npm run build

# veya development mode
npm run dev
```

### Adım 3: Extension Settings'i Yapılandırın

1. **Extension'ı açın** (browser'da extension icon'una tıklayın)

2. **AI Provider seçin:**
   - **OpenAI** için:
     - "AI Provider" dropdown'dan "OpenAI" seçin
     - OpenAI API key'inizi girin
     - "Save Settings" tıklayın
   
   - **Sumwise API** için:
     - "AI Provider" dropdown'dan "Sumwise API (Local)" seçin
     - API URL'i kontrol edin (default: `http://localhost:3000/api/summarize`)
     - Local server'ınızın çalıştığından emin olun
     - "Save Settings" tıklayın

### Adım 4: Kullanım

1. Herhangi bir **web sayfasına** gidin
2. Extension'ı açın
3. **Provider bilgisini görün:**
   - 🚀 Sumwise API (AWS Bedrock + Mistral)
   - 🤖 OpenAI

4. İsteğe göre ayarları yapın:
   - **Content Type:** Web Page, PDF, YouTube
   - **Language:** Auto-detect, English, Turkish, vb.
   - **Character Limit:** İsteğe bağlı

5. **"Summarize"** butonuna tıklayın

## 🔧 Sumwise API Ayarları

### Default URL
```
http://localhost:3000/api/summarize
```

### Production'da Kullanım
Eğer backend'inizi deploy ettiyseniz, URL'i değiştirin:
```
https://yourdomain.com/api/summarize
```

### CORS Ayarları
Extension'dan API'ye istek yapabilmek için backend'inizde CORS ayarlanmalı. Next.js API route'larında default olarak CORS açıktır, ancak production'da aşağıdaki gibi ayarlayabilirsiniz:

```typescript
// app/api/summarize/route.ts içinde
export async function POST(request: NextRequest) {
    // ... mevcut kod ...
    
    return NextResponse.json(response, { 
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*', // veya specific domain
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    })
}
```

## 📊 Özellik Karşılaştırması

| Özellik | OpenAI | Sumwise API |
|---------|--------|-------------|
| **Model Seçimi** | ✅ 6 farklı model | ❌ Mistral Pixtral Large (sabit) |
| **API Key** | ✅ Gerekli | ❌ Gerekli değil |
| **Maliyet** | 💰 OpenAI fiyatlandırması | 💰 AWS Bedrock fiyatlandırması |
| **Türkçe** | ✅ Desteklenir | ✅ Optimize edilmiş |
| **Uzun Metinler** | ⚠️ 4000 karakter limit | ✅ Sınırsız (chunking) |
| **Local Çalışma** | ❌ İnternet gerekli | ✅ Local server |
| **Hız** | ⚡ Hızlı | ⚡ Hızlı (4-6 saniye) |

## 🐛 Sorun Giderme

### "Failed to connect to Sumwise API"
**Çözüm:**
1. Backend server'ın çalıştığından emin olun:
   ```bash
   npm run dev
   ```
2. URL'in doğru olduğunu kontrol edin (http://localhost:3000/api/summarize)
3. Browser console'da hata detaylarını inceleyin

### "Bedrock client is not initialized"
**Çözüm:**
1. Backend'de `.env.local` dosyasını kontrol edin
2. AWS credentials'ın doğru olduğundan emin olun:
   ```bash
   AWS_REGION=eu-central-1
   AWS_ACCESS_KEY_ID=your-key
   AWS_SECRET_ACCESS_KEY=your-secret
   ```
3. Server'ı yeniden başlatın

### "Text is too short"
**Çözüm:**
- En az 100 karakter metin gereklidir
- Daha uzun içerikler seçin veya bekleyin

### OpenAI API hatası
**Çözüm:**
1. API key'inizi kontrol edin
2. OpenAI hesabınızda kredi olduğundan emin olun
3. API key'i Settings'ten yeniden kaydedin

## 🔐 Güvenlik Notları

### OpenAI Kullanımı
- ⚠️ API key'iniz extension storage'da saklanır
- ⚠️ API key'i başkalarıyla paylaşmayın
- ⚠️ Public extension store'a yüklerken API key'i kaldırın

### Sumwise API Kullanımı
- ✅ API key gerektirmez
- ✅ Tüm data local server üzerinden işlenir
- ⚠️ Production'da HTTPS kullanın
- ⚠️ AWS credentials'ı güvenli tutun

## 📝 Kullanım Senaryoları

### Senaryo 1: OpenAI ile Hızlı Özetleme
```
1. OpenAI seç
2. API key gir
3. Dilediğin modeli seç (GPT-4, GPT-4o, vb.)
4. Summarize!
```

### Senaryo 2: Sumwise ile Uzun Makale Özetleme
```
1. Sumwise API seç
2. URL'i kontrol et
3. Uzun bir makaleye git (5000+ kelime)
4. Language: Turkish seç
5. Summarize! (Otomatik chunking yapılacak)
```

### Senaryo 3: PDF Özetleme
```
1. Provider seç (her ikisi de destekler)
2. PDF sayfasına git veya PDF yükle
3. Language seç
4. Summarize!
```

### Senaryo 4: YouTube Video Özetleme (Sumwise Only)
```
1. Sumwise API seç (YouTube için gerekli)
2. YouTube videosuna git veya URL gir
3. Language seç (Türkçe için optimize)
4. Summarize! (Otomatik bullet points ile)
```

## 🎯 Gelecek Özellikler

Planlanan iyileştirmeler:
- [ ] Birden fazla API URL kaydetme (dev, staging, prod)
- [ ] Sumwise API için model seçimi (farklı Bedrock modelleri)
- [ ] Özetleri kaydetme ve export etme
- [ ] Özetleme geçmişi
- [ ] Batch summarization (birden fazla sayfa)
- [ ] Browser side-panel entegrasyonu

## 📚 API Dokümantasyonu

Detaylı API dokümantasyonu için:
- Backend API: [API_DOCS.md](../API_DOCS.md)
- AWS Setup: [SETUP_AWS_BEDROCK.md](../SETUP_AWS_BEDROCK.md)
- Kullanım Örnekleri: [USAGE_EXAMPLE.md](../USAGE_EXAMPLE.md)

## 💡 İpuçları

1. **Hız için:** OpenAI'ın GPT-4o-mini modelini kullanın
2. **Kalite için:** GPT-4 veya Sumwise API kullanın
3. **Uzun metinler için:** Sumwise API (chunking desteği)
4. **Türkçe için:** Sumwise API (optimize edilmiş)
5. **Offline çalışma için:** Sumwise API (local server)

## 🤝 Destek

Sorularınız için:
- Backend issues: Main README.md'ye bakın
- Extension issues: extension/README.md'ye bakın
- API issues: API_DOCS.md'ye bakın

---

**Happy Summarizing! 🎉**

