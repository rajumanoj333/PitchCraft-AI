from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel
from typing import Optional, List, Dict
import os
from dotenv import load_dotenv
import asyncio
import json
from datetime import datetime

# Import services
from services.tambo_service import TamboService
from services.firecrawl_service import FirecrawlService
from services.lingo_service import LingoService
from services.google_tts_service import GoogleTTSService
from services.resend_service import ResendService

# Load environment variables
load_dotenv()

app = FastAPI(
    title="PitchCraft AI",
    description="AI-Powered Startup Pitch Builder - From idea to deck in minutes",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
os.makedirs("static", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Initialize services
tambo_service = TamboService()
firecrawl_service = FirecrawlService()
lingo_service = LingoService()
google_tts_service = GoogleTTSService()
resend_service = ResendService()

# Pydantic models
class StartupIdea(BaseModel):
    idea: str
    industry: Optional[str] = None
    target_market: Optional[str] = None
    language: Optional[str] = "en"

class PitchRequest(BaseModel):
    idea: str
    language: Optional[str] = "en"
    generate_voice: Optional[bool] = False
    email_to: Optional[str] = None

class EmailRequest(BaseModel):
    pitch_id: str
    email_to: str
    subject: Optional[str] = "Your AI-Generated Pitch Deck"

# Root endpoint
@app.get("/", response_class=HTMLResponse)
async def root():
    with open("templates/index.html", "r") as f:
        return HTMLResponse(content=f.read())

# Health check
@app.get("/health")
async def health_check():
    """Health check endpoint with service status"""
    service_status = {
        "tambo_ai": await tambo_service.check_health(),
        "firecrawl": await firecrawl_service.check_health(),
        "lingo_dev": await lingo_service.check_health(),
        "google_tts": await google_tts_service.check_health(),
        "resend": await resend_service.check_health()
    }
    
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": service_status,
        "version": "1.0.0"
    }

# Test all APIs
@app.get("/api/test-apis")
async def test_all_apis():
    """Test all API integrations"""
    results = {}
    
    # Test Tambo AI
    try:
        tambo_result = await tambo_service.test_connection()
        results["tambo_ai"] = {"status": "success", "result": tambo_result}
    except Exception as e:
        results["tambo_ai"] = {"status": "error", "error": str(e)}
    
    # Test Firecrawl
    try:
        firecrawl_result = await firecrawl_service.test_connection()
        results["firecrawl"] = {"status": "success", "result": firecrawl_result}
    except Exception as e:
        results["firecrawl"] = {"status": "error", "error": str(e)}
    
    # Test Lingo
    try:
        lingo_result = await lingo_service.test_connection()
        results["lingo_dev"] = {"status": "success", "result": lingo_result}
    except Exception as e:
        results["lingo_dev"] = {"status": "error", "error": str(e)}
    
    # Test Google TTS
    try:
        tts_result = await google_tts_service.test_connection()
        results["google_tts"] = {"status": "success", "result": tts_result}
    except Exception as e:
        results["google_tts"] = {"status": "error", "error": str(e)}
    
    # Test Resend
    try:
        resend_result = await resend_service.test_connection()
        results["resend"] = {"status": "success", "result": resend_result}
    except Exception as e:
        results["resend"] = {"status": "error", "error": str(e)}
    
    return {"test_results": results, "timestamp": datetime.now().isoformat()}

# Research startup idea
@app.post("/api/research-idea")
async def research_startup_idea(startup_idea: StartupIdea):
    """Research startup idea using Firecrawl + Tambo AI"""
    try:
        # Step 1: Research market trends and competitors
        print(f"🔍 Researching idea: {startup_idea.idea}")
        research_data = await firecrawl_service.research_startup_idea(
            startup_idea.idea, 
            startup_idea.industry
        )
        
        # Step 2: Generate insights using Tambo AI
        print("🧠 Generating AI insights...")
        ai_insights = await tambo_service.analyze_market_research(
            startup_idea.idea, 
            research_data
        )
        
        return {
            "success": True,
            "idea": startup_idea.idea,
            "research": research_data,
            "insights": ai_insights,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Research failed: {str(e)}")

# Generate complete pitch deck
@app.post("/api/generate-pitch")
async def generate_pitch_deck(request: PitchRequest):
    """Generate complete pitch deck with all features"""
    try:
        pitch_id = f"pitch_{int(datetime.now().timestamp())}"
        print(f"🚀 Generating pitch deck: {pitch_id}")
        
        # Step 1: Research the idea
        print("🔍 Step 1: Researching startup idea...")
        research_data = await firecrawl_service.research_startup_idea(request.idea)
        
        # Step 2: Generate pitch content with Tambo AI
        print("✍️ Step 2: Generating pitch content...")
        pitch_content = await tambo_service.generate_pitch_deck(request.idea, research_data)
        
        # Step 3: Localize if needed
        if request.language != "en":
            print(f"🌍 Step 3: Localizing to {request.language}...")
            pitch_content = await lingo_service.translate_pitch(pitch_content, request.language)
        
        # Step 4: Generate voice-over if requested
        voice_url = None
        if request.generate_voice:
            print("🎙️ Step 4: Generating voice presentation...")
            voice_url = await google_tts_service.generate_pitch_voice(pitch_content)
        
        # Step 5: Send email if requested
        if request.email_to:
            print(f"📧 Step 5: Sending pitch to {request.email_to}...")
            await resend_service.send_pitch_email(request.email_to, pitch_content, pitch_id)
        
        # Create final pitch object
        pitch_deck = {
            "id": pitch_id,
            "idea": request.idea,
            "language": request.language,
            "content": pitch_content,
            "research": research_data,
            "voice_url": voice_url,
            "generated_at": datetime.now().isoformat(),
            "status": "completed"
        }
        
        return {
            "success": True,
            "pitch": pitch_deck,
            "message": "Pitch deck generated successfully!",
            "features_used": {
                "research": True,
                "ai_generation": True,
                "localization": request.language != "en",
                "voice_over": request.generate_voice,
                "email_sent": bool(request.email_to)
            }
        }
        
    except Exception as e:
        print(f"❌ Error generating pitch: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Pitch generation failed: {str(e)}")

# Email pitch deck
@app.post("/api/send-pitch")
async def send_pitch_email(request: EmailRequest):
    """Send existing pitch deck via email"""
    try:
        # In a real app, you'd fetch from database
        # For now, we'll use a simple response
        result = await resend_service.send_simple_pitch_email(
            request.email_to, 
            request.pitch_id,
            request.subject
        )
        
        return {
            "success": True,
            "message": f"Pitch deck sent to {request.email_to}",
            "email_id": result.get("id"),
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Email failed: {str(e)}")

# Get pitch by ID (simple in-memory storage for demo)
@app.get("/api/pitch/{pitch_id}")
async def get_pitch(pitch_id: str):
    """Get pitch deck by ID"""
    # In a real app, this would fetch from database
    return {
        "success": True,
        "message": "In a real app, this would fetch the pitch from database",
        "pitch_id": pitch_id
    }

# API documentation
@app.get("/api/docs-json")
async def api_documentation():
    """API documentation in JSON format"""
    return {
        "name": "PitchCraft AI API",
        "version": "1.0.0",
        "description": "AI-Powered Startup Pitch Builder",
        "endpoints": {
            "POST /api/research-idea": "Research startup idea with market analysis",
            "POST /api/generate-pitch": "Generate complete pitch deck",
            "POST /api/send-pitch": "Send pitch deck via email",
            "GET /api/test-apis": "Test all API integrations",
            "GET /health": "Health check and service status"
        },
        "features": [
            "Market research with Firecrawl",
            "AI content generation with Tambo AI",
            "Multi-language support with Lingo.dev",
            "Voice-over generation with Google TTS",
            "Email delivery with Resend"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))