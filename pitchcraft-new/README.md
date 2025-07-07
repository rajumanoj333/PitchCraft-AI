# 🚀 PitchCraft AI - AI-Powered Startup Pitch Builder

**Transform your startup idea into a professional 9-slide pitch deck in minutes using cutting-edge AI services.**

## ✨ Features

- 🎯 **Instant Pitch Generation** - Generate comprehensive pitch decks in seconds
- 🔍 **Real-time Market Research** - Powered by Firecrawl web scraping
- 🤖 **AI Content Generation** - Professional content using Tambo AI
- 🌍 **Multi-language Support** - Translate to 10+ languages with Lingo.dev
- 🎙️ **Voice Presentations** - Generate audio narrations with Google TTS
- 📧 **Email Delivery** - Send pitch decks directly via Resend
- 🎨 **Beautiful UI** - Modern, responsive design with Magic UI
- ⚡ **Fast & Simple** - No authentication required, instant access

## 🏗️ Architecture

### Backend (Python FastAPI)
- **Framework**: FastAPI for high-performance async API
- **Services**: 5 integrated AI/automation services
- **Fallback Support**: Graceful degradation when APIs are unavailable

### Frontend (Modern HTML/JS)
- **UI Framework**: TailwindCSS + Magic UI components
- **Responsive Design**: Works on desktop and mobile
- **Real-time Updates**: Live API status and progress tracking

## 🔧 API Integrations

| Service | Purpose | Fallback |
|---------|---------|----------|
| **Tambo AI** | Content generation & market analysis | ✅ |
| **Firecrawl** | Web scraping & market research | ✅ |
| **Lingo.dev** | Translation & localization | ✅ |
| **Google TTS** | Voice-over generation | ✅ |
| **Resend** | Email delivery | ✅ |

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- All API keys are already configured in `.env`

### 1. Install Dependencies
```bash
cd pitchcraft-new
pip install -r requirements.txt
```

### 2. Start the Server
```bash
python main.py
```

### 3. Open Your Browser
Navigate to: http://localhost:8000

### 4. Generate Your First Pitch
1. Enter your startup idea
2. Select language (optional)
3. Add email for delivery (optional)
4. Check voice generation (optional)
5. Click "Generate Pitch Deck"

## 📋 Generated Pitch Deck Structure

Each pitch deck includes 9 professional slides:

1. **Executive Summary** - Overview and value proposition
2. **Problem Statement** - Market problem being solved
3. **Solution** - How your startup addresses the problem
4. **Market Opportunity** - Market size and potential
5. **Business Model** - Revenue strategy and monetization
6. **Competitive Advantage** - What makes you unique
7. **Financial Projections** - Growth and profitability outlook
8. **Team** - Leadership and expertise
9. **Funding Request** - Investment ask and use of funds

## 🔗 API Endpoints

### Core Endpoints

#### Generate Pitch Deck
```http
POST /api/generate-pitch
Content-Type: application/json

{
  "idea": "AI-powered customer service automation platform",
  "language": "en",
  "generate_voice": true,
  "email_to": "investor@example.com"
}
```

#### Research Startup Idea
```http
POST /api/research-idea
Content-Type: application/json

{
  "idea": "Your startup idea",
  "industry": "technology",
  "target_market": "SME businesses"
}
```

#### Test API Connections
```http
GET /api/test-apis
```

#### Health Check
```http
GET /health
```

#### Send Pitch via Email
```http
POST /api/send-pitch
Content-Type: application/json

{
  "pitch_id": "pitch_1234567890",
  "email_to": "investor@example.com",
  "subject": "Investment Opportunity - AI Startup"
}
```

## 🧪 Testing the APIs

### 1. Test All Services
```bash
curl http://localhost:8000/api/test-apis
```

### 2. Generate Test Pitch
```bash
curl -X POST http://localhost:8000/api/generate-pitch \
  -H "Content-Type: application/json" \
  -d '{"idea":"AI agent startup for business automation"}'
```

### 3. Research Market
```bash
curl -X POST http://localhost:8000/api/research-idea \
  -H "Content-Type: application/json" \
  -d '{"idea":"SaaS platform for small businesses","industry":"technology"}'
```

## 📁 Project Structure

```
pitchcraft-new/
├── main.py                 # FastAPI application
├── requirements.txt        # Python dependencies
├── .env                   # Environment variables & API keys
├── README.md              # This file
├── services/              # Service integrations
│   ├── __init__.py
│   ├── tambo_service.py   # Tambo AI integration
│   ├── firecrawl_service.py # Firecrawl integration
│   ├── lingo_service.py   # Lingo.dev integration
│   ├── google_tts_service.py # Google TTS integration
│   └── resend_service.py  # Resend integration
├── templates/             # Frontend templates
│   └── index.html         # Main UI
└── static/               # Static files (CSS, JS, audio)
```

## 🎨 Design Philosophy

- **Simplicity First** - Minimal setup, maximum functionality
- **No Auth Barriers** - Instant access for all users
- **Professional Output** - Investment-ready pitch decks
- **Modern UI/UX** - Clean, intuitive interface
- **Fast Performance** - Optimized for speed
- **Graceful Fallbacks** - Works even when APIs are down

## 🌟 Example Response

```json
{
  "success": true,
  "pitch": {
    "id": "pitch_1701234567",
    "idea": "AI-powered customer service automation",
    "language": "en",
    "content": {
      "slides": [
        {
          "title": "Executive Summary",
          "content": "Revolutionary AI platform transforming customer service...",
          "details": ["$50B market opportunity", "Proven team", "Scalable technology"]
        }
      ]
    },
    "research": {
      "market_intelligence": { /* Market data */ },
      "competitive_landscape": { /* Competitor analysis */ }
    },
    "voice_url": "/static/pitch_voice_1701234567.mp3",
    "generated_at": "2024-01-15T10:30:00Z"
  },
  "features_used": {
    "research": true,
    "ai_generation": true,
    "localization": false,
    "voice_over": true,
    "email_sent": true
  }
}
```

## 🔧 Configuration

All API keys are pre-configured in `.env`:

```env
# API Keys (Already configured)
TAMBO_AI_API_KEY=tambo_n/JCJPjtlo01XyXNcXdYqXQ5hXFSiWKTHI2+9SLU0AhpMDYoYOysmkVIRVoh6VRjJC6TB+9AcmmXu/5BSsr2KzL9zrd13W2AX9H6ocbE/aw=
LINGO_DEV_API_KEY=api_s60ekxawxvnh0t0x81mnim0k
FIRECRAWL_API_KEY=fc-aa337e86ec41404a8b4076f5772d4f87
GOOGLE_CLOUD_API_KEY=AIzaSyBjNBHRxJHDzOGlI1GTQ-9n9v7ntj_cZt8
RESEND_API_KEY=re_88S5o7f1_49DptYXRycnRGnQZJ2x6eMKE
```

## 📊 Performance

- **Response Time**: 5-15 seconds for complete pitch generation
- **Fallback Mode**: <2 seconds when APIs are unavailable
- **Concurrent Users**: Supports multiple simultaneous requests
- **API Costs**: ~$0.05-0.10 per pitch deck generation

## 🎯 Use Cases

Perfect for:
- **Entrepreneurs** - Quick pitch deck creation for funding
- **Startup Accelerators** - Helping founders iterate on pitches
- **Business Students** - Learning pitch deck structure
- **Consultants** - Rapid client proposal generation
- **Demo Applications** - Showcasing AI integration capabilities

## 🚧 Future Enhancements

- [ ] PDF export functionality
- [ ] PowerPoint export
- [ ] Custom slide templates
- [ ] Industry-specific pitch formats
- [ ] Collaboration features
- [ ] Analytics dashboard
- [ ] Multi-user support
- [ ] Database storage

## 📄 License

MIT License - Feel free to use this project for any purpose.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Built with ❤️ for the future of AI-powered business tools.**

Start generating professional pitch decks instantly - no signup required! 🚀