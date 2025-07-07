# PitchCraft AI - API Setup Guide

This application now uses **real, working AI APIs** to generate professional pitch decks. You'll need to obtain API keys from these services:

## Required API Keys

### 1. OpenAI API (Content Generation)
- **Service**: OpenAI GPT for generating pitch deck content
- **Website**: https://platform.openai.com/
- **How to get**:
  1. Sign up at https://platform.openai.com/
  2. Go to API Keys section
  3. Create a new API key
  4. Copy the key (starts with `sk-`)

### 2. Google Gemini API (Content Enhancement)
- **Service**: Google Gemini for enhancing and validating content  
- **Website**: https://ai.google.dev/
- **How to get**:
  1. Visit https://ai.google.dev/
  2. Click "Get API key in Google AI Studio"
  3. Create a new project or select existing
  4. Generate API key
  5. Copy the key (starts with `AIza`)

### 3. Perplexity AI API (Market Research)
- **Service**: Perplexity for real-time market research and competitive analysis
- **Website**: https://www.perplexity.ai/
- **How to get**:
  1. Sign up at https://www.perplexity.ai/
  2. Go to Settings → API
  3. Generate API key
  4. Copy the key (starts with `pplx-`)

## Setting Up Your Environment

1. **Copy the environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit the .env file** and add your API keys:
   ```env
   PORT=3000
   
   # Real AI API Keys
   OPENAI_API_KEY=sk-your-openai-key-here
   GOOGLE_GEMINI_API_KEY=AIza-your-gemini-key-here  
   PERPLEXITY_API_KEY=pplx-your-perplexity-key-here
   
   # API URLs (Already configured)
   OPENAI_URL=https://api.openai.com/v1
   GOOGLE_GEMINI_URL=https://generativelanguage.googleapis.com/v1beta
   PERPLEXITY_URL=https://api.perplexity.ai
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the server**:
   ```bash
   npm start
   ```

## API Costs (Approximate)

- **OpenAI GPT-3.5-turbo**: ~$0.002 per 1000 tokens (~$0.01 per pitch)
- **Google Gemini**: Free tier available, then ~$0.001 per 1000 tokens
- **Perplexity AI**: Free tier available, then ~$0.02 per request

**Total cost per pitch deck**: ~$0.05-0.10 depending on complexity

## Fallback Behavior

The application is designed to work even if APIs are unavailable:

- **No API keys**: Uses high-quality fallback content generation
- **API timeouts**: Gracefully falls back to backup methods
- **Rate limits**: Automatically switches to fallback mode

## Testing the Setup

1. Start the server: `npm start`
2. Check health: `curl http://localhost:3000/health`
3. Generate a test pitch:
   ```bash
   curl -X POST http://localhost:3000/api/generate-pitch \
     -H "Content-Type: application/json" \
     -d '{"idea":"AI-powered fitness app"}'
   ```

## Features You Get With Real APIs

✅ **Real market research** with current data from the web
✅ **Professional AI-generated content** tailored to your idea  
✅ **Content enhancement** for investor-ready language
✅ **Quality validation** with scoring and feedback
✅ **Competitive analysis** with real company data
✅ **Market trends** and funding information

## Support

If you have issues:
1. Check that all API keys are correctly set in `.env`
2. Verify API keys are valid by testing them directly
3. Check the console logs for specific error messages
4. The app will work with fallback content even without API keys

---

**Note**: The previous version used fake API endpoints that returned 404 errors. This new version uses real, working AI services that will significantly improve the quality of your pitch decks!