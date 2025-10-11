# AI Summarizer - Browser Extension

Akıllı içerik özetleme extension'ı. Web sayfaları, PDF'ler ve YouTube videolarını AI ile özetler.

## ✨ Özellikler

### 🤖 Dual AI Provider Support
- **OpenAI** - GPT-4, GPT-4o, GPT-4 Turbo ve diğer modeller
- **Sumwise API** - AWS Bedrock + Mistral Pixtral Large (Local Backend)

### 📄 Çoklu İçerik Desteği
- ✅ Web sayfaları (auto-detect)
- ✅ PDF belgeleri (embedded & uploaded)
- ✅ YouTube videoları (placeholder)

### 🌍 Çok Dilli Destek
- Auto-detect (otomatik dil tespiti)
- English, Turkish, Arabic, German, French, Italian
- Her dil için optimize edilmiş özetleme

### ⚙️ Özelleştirilebilir Ayarlar
- Summary language seçimi
- Character limit (100-2000 karakter)
- Provider seçimi (OpenAI / Sumwise)
- Model seçimi (OpenAI için)

---

## 🚀 Hızlı Başlangıç

### Ön Gereksinimler
- Node.js 18+
- Chrome, Edge veya Firefox browser
- (Opsiyonel) Sumwise Backend Server

### 1. Dependencies Yükle
```bash
npm install
```

### 2. Build Et
```bash
npm run build
```

### 3. Browser'a Yükle

**Chrome/Edge:**
1. `chrome://extensions` aç
2. "Developer mode" aktif et
3. "Load unpacked" → `dist` klasörünü seç

**Firefox:**
1. `about:debugging#/runtime/this-firefox` aç
2. "Load Temporary Add-on" → `dist/manifest.json` seç

### 4. Yapılandır

**OpenAI için:**
1. Extension'ı aç
2. AI Provider: OpenAI seç
3. API key'ini gir
4. Save Settings

**Sumwise API için:**
1. Backend server'ı başlat: `cd .. && npm run dev`
2. Extension'ı aç
3. AI Provider: Sumwise API seç
4. API URL kontrol et: `http://localhost:3000/api/summarize`
5. Save Settings

📖 **Detaylı Guide:** [QUICK_START.md](./QUICK_START.md)

---

## 📁 Proje Yapısı

```
extension/
├── src/
│   ├── popup/              # Extension UI
│   │   ├── components/
│   │   │   ├── AISelectionForm.tsx      # Provider seçimi
│   │   │   └── SummarizeComponent.tsx   # Ana özetleme UI
│   │   ├── styles/         # CSS dosyaları
│   │   ├── Popup.tsx       # Ana popup component
│   │   └── index.tsx       # Entry point
│   ├── background/         # Background script
│   │   └── index.ts
│   ├── contentScript/      # Web sayfalarında çalışan script
│   │   └── index.tsx
│   └── static/
│       └── manifest.json   # Extension manifest
├── public/
│   └── js/                 # PDF.js worker
├── dist/                   # Build output
├── QUICK_START.md         # Hızlı başlangıç kılavuzu
├── SUMWISE_INTEGRATION.md # Sumwise entegrasyon detayları
└── README.md              # Bu dosya
```

---

## 🛠️ Development

### Development Mode
```bash
npm run dev
```
Hot module replacement ile otomatik reload.

### Production Build
```bash
npm run build
```

### Linting
```bash
npm run lint
```

---

## 🎯 Kullanım

### Web Sayfası Özetleme
1. Herhangi bir web sayfasına git
2. Extension icon'una tıkla
3. Content Type otomatik detect edilir
4. Language seç (veya Auto-detect)
5. "Summarize" tıkla

### PDF Özetleme
1. PDF dosyasını aç VEYA PDF yükle
2. Extension icon'una tıkla
3. Otomatik olarak PDF detect edilir
4. Language seç
5. "Summarize" tıkla

### YouTube Özetleme
1. **Sumwise API seçili olmalı** (OpenAI YouTube desteklemiyor)
2. YouTube videosuna git veya URL gir
3. Extension icon'una tıkla
4. Video otomatik algılanır
5. Language seç
6. "Summarize" tıkla
7. Otomatik olarak bullet points ile özet oluşturulur

**Not:** YouTube özetleme özelliği sadece Sumwise API ile çalışır.

---

## 🔧 Yapılandırma

### OpenAI Setup
```typescript
// Settings'te
Provider: OpenAI
API Key: sk-...
Model: gpt-4o (veya istediğiniz model)
```

### Sumwise API Setup
```typescript
// Settings'te
Provider: Sumwise API (Local)
API URL: http://localhost:3000/api/summarize

// Backend .env.local
AWS_REGION=eu-central-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
```

---

## 📊 Provider Karşılaştırması

| Özellik | OpenAI | Sumwise API |
|---------|--------|-------------|
| **Setup** | API key | Local server |
| **Model Seçimi** | ✅ 6 model | ❌ Mistral sabit |
| **Türkçe** | ✅ İyi | ✅ Çok iyi |
| **Uzun Metinler** | ⚠️ 4K limit | ✅ Sınırsız |
| **Hız** | ⚡⚡⚡ | ⚡⚡ |
| **Maliyet** | OpenAI API | AWS Bedrock |
| **Offline** | ❌ | ✅ (Local) |

---

## 🐛 Sorun Giderme

### Extension yüklenmiyor
```bash
# Yeniden build et
rm -rf dist
npm run build
```

### "API key not found"
- Settings'e git
- API key'i tekrar gir ve kaydet
- Extension'ı yeniden aç

### "Failed to connect to Sumwise API"
```bash
# Backend server'ın çalıştığını kontrol et
curl http://localhost:3000/api/summarize

# Çalışmıyorsa başlat
cd .. && npm run dev
```

### PDF özetleme çalışmıyor
- PDF.js worker'ın yüklendiğini kontrol et
- Browser console'da hata var mı kontrol et
- Extension'ı reload et

📖 **Detaylı Troubleshooting:** [SUMWISE_INTEGRATION.md](./SUMWISE_INTEGRATION.md)

---

## 🔐 Güvenlik

### OpenAI
- ⚠️ API key browser storage'da saklanır
- ⚠️ API key'i paylaşmayın
- ⚠️ Production'da secure storage kullanın

### Sumwise API
- ✅ API key gerektirmez
- ✅ Local server kullanır
- ⚠️ Production'da HTTPS zorunlu
- ⚠️ CORS ayarlarını yapın

---

## 📚 Dokümantasyon

- **[QUICK_START.md](./QUICK_START.md)** - 5 dakikada başla
- **[SUMWISE_INTEGRATION.md](./SUMWISE_INTEGRATION.md)** - Sumwise entegrasyonu
- **[../API_DOCS.md](../API_DOCS.md)** - Backend API docs
- **[../SETUP_AWS_BEDROCK.md](../SETUP_AWS_BEDROCK.md)** - AWS Bedrock setup

---

## 🚀 Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite + @crxjs/vite-plugin
- **Extension:** Chrome Manifest V3
- **PDF Processing:** PDF.js
- **Styling:** Custom CSS
- **AI Providers:** OpenAI API, AWS Bedrock (Mistral)

---

## 📝 To-Do

- [ ] YouTube transcript extraction (gerçek implementasyon)
- [ ] Batch summarization (birden fazla sayfa)
- [ ] Summary history (geçmiş özetler)
- [ ] Export summaries (PDF, TXT)
- [ ] Browser side-panel entegrasyonu
- [ ] Firefox ve Safari desteği
- [ ] Sumwise için model seçimi
- [ ] Offline mode

---

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing`)
5. Pull Request açın

---

## 📄 License

MIT License - Detaylar için LICENSE dosyasına bakın.

---

## 🆘 Destek

- 🐛 **Bug Report:** GitHub Issues
- 💡 **Feature Request:** GitHub Issues
- 📖 **Dokümantasyon:** Bu README ve ilgili MD dosyaları
- 💬 **Sorular:** GitHub Discussions

---

**Happy Summarizing! 🎉** 