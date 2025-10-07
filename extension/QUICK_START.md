# 🚀 Extension + Sumwise API - Hızlı Başlangıç

## 1️⃣ Backend Server'ı Başlat (2 dk)

```bash
# Ana dizine git
cd /Users/emreturgut/code/cyber-rabbit/ai-summarizer

# Server'ı başlat
npm run dev
```

✅ Server `http://localhost:3000` adresinde çalışmalı

## 2️⃣ Extension'ı Build Et (1 dk)

```bash
# Extension dizinine git
cd extension

# Build et
npm run build
```

✅ Build `extension/dist` klasöründe oluşacak

## 3️⃣ Extension'ı Browser'a Yükle (1 dk)

### Chrome/Edge:
1. `chrome://extensions` adresine git
2. **Developer mode**'u aktif et (sağ üst)
3. **Load unpacked** tıkla
4. `extension/dist` klasörünü seç
5. ✅ Extension yüklendi!

### Firefox:
1. `about:debugging#/runtime/this-firefox` adresine git
2. **Load Temporary Add-on** tıkla
3. `extension/dist/manifest.json` dosyasını seç
4. ✅ Extension yüklendi!

## 4️⃣ Extension'ı Yapılandır (30 sn)

1. **Extension icon'una** tıkla (toolbar'da)
2. **AI Provider** seç: **"Sumwise API (Local)"**
3. **API URL** kontrol et: `http://localhost:3000/api/summarize`
4. **Save Settings** tıkla
5. ✅ Yapılandırma tamamlandı!

## 5️⃣ Test Et! (1 dk)

1. Herhangi bir **web sayfasına** git (örn: Wikipedia makalesi)
2. **Extension icon'una** tıkla
3. **Language** seç (örn: Turkish veya Auto)
4. **Summarize** butonuna tıkla
5. 🎉 Özet hazır!

---

## 🧪 Test URL'leri

Şu sayfalarda test edebilirsiniz:

### Türkçe İçerik
- https://tr.wikipedia.org/wiki/Yapay_zeka
- https://www.hurriyet.com.tr (herhangi bir haber)

### İngilizce İçerik
- https://en.wikipedia.org/wiki/Artificial_intelligence
- https://www.bbc.com/news (herhangi bir haber)

### PDF
- Herhangi bir online PDF belgesi
- Veya local PDF yükle

---

## ⚡ Hızlı Komutlar

### Backend
```bash
# Start server
cd /Users/emreturgut/code/cyber-rabbit/ai-summarizer && npm run dev

# Test API
curl http://localhost:3000/api/summarize

# Test with sample
node test-summarize.js
```

### Extension
```bash
# Build
cd extension && npm run build

# Development mode (hot reload)
cd extension && npm run dev

# Clean and rebuild
cd extension && rm -rf dist && npm run build
```

---

## 🔍 Sorun Giderme

### ❌ "Failed to connect to Sumwise API"

**Çözüm:**
```bash
# Server çalışıyor mu kontrol et
curl http://localhost:3000/api/summarize
```

Eğer çalışmıyorsa:
```bash
cd /Users/emreturgut/code/cyber-rabbit/ai-summarizer
npm run dev
```

### ❌ "Bedrock client is not initialized"

**Çözüm:**
```bash
# .env.local dosyasını kontrol et
cat .env.local

# Olması gereken:
AWS_REGION=eu-central-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
```

Server'ı yeniden başlat:
```bash
npm run dev
```

### ❌ Extension çalışmıyor

**Çözüm:**
1. Extension'ı yeniden build et:
   ```bash
   cd extension && npm run build
   ```
2. Browser'da extension'ı reload et (chrome://extensions)
3. Extension icon'una tıkla ve Settings'te provider'ı kontrol et

---

## 📊 Beklenen Sonuçlar

### Başarılı Özetleme:
```
🚀 Sumwise API (AWS Bedrock + Mistral)

Content Type: Web Page (Auto-detected)
Language: 🇹🇷 TR

[Summarize butonu]

✅ Summary:
"Yapay zeka, makinelerin insan benzeri düşünme ve öğrenme 
yeteneklerini simüle etmesidir. Makine öğrenimi ve derin 
öğrenme teknikleri sayesinde..."

Processing time: 3.2s
```

### Log Output (Console):
```
Calling Sumwise API: http://localhost:3000/api/summarize
Content length: 2547
Summary length: medium
Language: tr
✅ Sumwise API response: { summary: "...", ... }
```

---

## 🎯 Kullanım Senaryoları

### 1. Hızlı Haber Özeti
```
1. Haber sitesine git
2. Extension aç
3. Language: Auto-detect
4. Summarize → 3-4 saniyede özet!
```

### 2. Araştırma Makalesi
```
1. Wikipedia/Academic makaleye git
2. Extension aç
3. Language: Turkish/English
4. Character Limit: Kapat (tam özet için)
5. Summarize → Detaylı özet!
```

### 3. PDF Belge
```
1. PDF dosyasını aç
2. Extension aç (otomatik PDF detect eder)
3. Language seç
4. Summarize → PDF özeti!
```

---

## 💡 Pro İpuçları

1. **Auto-detect Language** genelde en iyi sonucu verir
2. **Character Limit** kapalı bırakın (daha detaylı özet)
3. **Uzun metinler** otomatik olarak chunk'lara bölünür
4. **Backend logs** için terminal'e bakın (debugging için)
5. **Browser console** açık tutun (extension debugging için)

---

## 📸 Ekran Görüntüleri

### Settings Ekranı:
```
┌─────────────────────────────────┐
│     AI Configuration            │
├─────────────────────────────────┤
│ AI Provider: ▼                  │
│  • OpenAI                       │
│  • Sumwise API (Local) ✓        │
├─────────────────────────────────┤
│ Sumwise API URL:                │
│ http://localhost:3000/api/...   │
│ ℹ Make sure your local server...│
├─────────────────────────────────┤
│        [Save Settings]          │
└─────────────────────────────────┘
```

### Summarize Ekranı:
```
┌─────────────────────────────────┐
│     AI Summarizer    [Settings] │
├─────────────────────────────────┤
│ Provider: 🚀 Sumwise API        │
│           (AWS Bedrock+Mistral) │
├─────────────────────────────────┤
│ Content Type:                   │
│ Web Page (Auto-detected)        │
├─────────────────────────────────┤
│ Summary Language: 🇹🇷 TR ▼      │
├─────────────────────────────────┤
│        [Summarize]              │
└─────────────────────────────────┘
```

---

## 🆘 Yardım

### Dokümantasyon:
- 📖 [SUMWISE_INTEGRATION.md](./SUMWISE_INTEGRATION.md) - Detaylı kullanım
- 📖 [../API_DOCS.md](../API_DOCS.md) - API dokümantasyonu
- 📖 [../SETUP_AWS_BEDROCK.md](../SETUP_AWS_BEDROCK.md) - AWS setup

### Test Scripts:
```bash
# Backend API test
node test-summarize.js

# Health check
curl http://localhost:3000/api/summarize

# Full test with Turkish
node test-summarize.js --turkish
```

---

**İyi özetlemeler! 🎉**

