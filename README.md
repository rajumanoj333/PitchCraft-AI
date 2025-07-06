# 🚀 PitchCraft AI - Simple Pitch Deck Generator

A clean, simple, and powerful AI-driven pitch deck generator with **no authentication required**. Transform your startup idea into a professional 9-slide pitch deck instantly.

## ✨ Features

- **🎯 Instant Pitch Generation** - Generate comprehensive pitch decks in seconds
- **🎨 Beautiful UI** - Modern, responsive design with gradient backgrounds  
- **🚫 No Auth Required** - No signups, logins, or user accounts needed
- **📱 9-Slide Structure** - Professional pitch deck format
- **⚡ Fast & Simple** - Minimal dependencies, maximum performance
- **🔧 Easy Setup** - Get running in under 2 minutes

## 🎯 Demo

1. **Enter your startup idea** - Describe what your startup does
2. **Generate instantly** - AI creates a 9-slide pitch deck
3. **Review & use** - Professional pitch deck ready for investors

## 🏗️ Architecture

### Backend (`pitchcraft-ai`)
- **Simple Express server** (Node.js)
- **Single endpoint:** `/api/generate-pitch`
- **No database** - Stateless operation
- **Dependencies:** `express` + `cors` only

### Frontend (`pitchcraft-frontend`)  
- **Single React component** (IdeaForm)
- **Vite build system** for fast development
- **Direct API calls** with axios
- **Dependencies:** `react` + `react-dom` + `axios` only

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### 1. Start Backend
```bash
cd pitchcraft-ai
npm install
npm start
```
Backend runs on: http://localhost:3000

### 2. Start Frontend  
```bash
cd pitchcraft-frontend
npm install
npm run dev
```
Frontend runs on: http://localhost:5173

### 3. Use the App
1. Open http://localhost:5173
2. Enter your startup idea
3. Click "Generate Pitch Deck"  
4. View your professional pitch deck!

## 📋 Generated Pitch Deck Structure

Each generated pitch deck includes 9 professional slides:

1. **Executive Summary** - Overview and value proposition
2. **Problem Statement** - Market problem being solved  
3. **Our Solution** - How your startup addresses the problem
4. **Market Opportunity** - Market size and potential
5. **Business Model** - Revenue strategy and monetization
6. **Competitive Advantage** - What makes you unique
7. **Financial Projections** - Growth and profitability outlook
8. **Team** - Leadership and expertise
9. **Funding Request** - Investment ask and use of funds

## 🔧 API Documentation

### Generate Pitch Deck
```
POST /api/generate-pitch
Content-Type: application/json

{
  "idea": "Your startup idea description"
}
```

**Response:**
```json
{
  "success": true,
  "pitch": {
    "id": "1234567890",
    "idea": "Your startup idea",
    "slides": [
      {
        "title": "Executive Summary", 
        "content": "Generated content..."
      }
    ],
    "generatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Health Check
```
GET /health

Response: {"status": "healthy", "timestamp": "..."}
```

## 📁 Project Structure

```
pitchcraft-ai/                 # Backend
├── server.js                  # Express server
├── package.json              # Dependencies
└── node_modules/             

pitchcraft-frontend/           # Frontend  
├── src/
│   ├── components/
│   │   └── IdeaForm.jsx      # Main component
│   ├── services/
│   │   └── apiService.js     # API calls
│   ├── App.jsx               # App root
│   ├── main.jsx              # Entry point
│   └── index.css             # Styles
├── package.json              # Dependencies
└── node_modules/
```

## 🎨 Design Philosophy

- **Simplicity First** - Minimal code, maximum functionality
- **No Auth Barriers** - Instant access for all users
- **Professional Output** - High-quality pitch deck generation
- **Modern UI/UX** - Clean, intuitive interface
- **Fast Performance** - Optimized for speed

## 🚫 What We Removed

This version intentionally removes complexity:

- ❌ User authentication & authorization
- ❌ Database dependencies  
- ❌ User accounts & sessions
- ❌ Complex middleware layers
- ❌ External API integrations (Supabase, etc.)
- ❌ Multi-page routing
- ❌ State management libraries

## 💻 Development

### Backend Development
```bash
cd pitchcraft-ai
npm run dev  # Uses nodemon for auto-reload
```

### Frontend Development  
```bash
cd pitchcraft-frontend
npm run dev  # Vite dev server with hot reload
```

### Production Build
```bash
cd pitchcraft-frontend
npm run build  # Creates optimized production build
```

## 🌟 Use Cases

Perfect for:
- **Entrepreneurs** - Quick pitch deck creation
- **Startup Accelerators** - Helping founders iterate on pitches  
- **Business Students** - Learning pitch deck structure
- **Consultants** - Rapid client proposal generation
- **Demo Applications** - Showcasing AI text generation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes  
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - Feel free to use this project for any purpose.

## 🎯 Next Steps

Potential enhancements:
- Export to PDF/PowerPoint
- Custom slide templates  
- Industry-specific pitch formats
- Multi-language support
- Collaboration features

---

**Built with ❤️ for simplicity and effectiveness.**

Start generating professional pitch decks instantly - no signup required!