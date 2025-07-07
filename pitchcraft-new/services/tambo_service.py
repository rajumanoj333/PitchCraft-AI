import httpx
import os
import json
from typing import Dict, List, Optional
from datetime import datetime

class TamboService:
    def __init__(self):
        self.api_key = os.getenv("TAMBO_AI_API_KEY")
        self.base_url = os.getenv("TAMBO_AI_URL", "https://api.tambo.ai")
        
    async def check_health(self) -> bool:
        """Check if Tambo AI service is available"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/health",
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    timeout=10.0
                )
                return response.status_code == 200
        except:
            return False
    
    async def test_connection(self) -> Dict:
        """Test Tambo AI API connection"""
        try:
            async with httpx.AsyncClient() as client:
                # Simple test prompt
                response = await client.post(
                    f"{self.base_url}/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "tambo-chat",
                        "messages": [
                            {"role": "user", "content": "Hello, test connection"}
                        ],
                        "max_tokens": 50
                    },
                    timeout=15.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    return {
                        "status": "connected",
                        "response": result.get("choices", [{}])[0].get("message", {}).get("content", "Success")
                    }
                else:
                    return {
                        "status": "error",
                        "code": response.status_code,
                        "message": response.text
                    }
                    
        except Exception as e:
            return {
                "status": "error",
                "message": f"Connection failed: {str(e)}"
            }
    
    async def analyze_market_research(self, idea: str, research_data: Dict) -> Dict:
        """Analyze market research data and generate insights"""
        try:
            prompt = f"""
            Analyze this startup idea and market research data:
            
            Startup Idea: {idea}
            
            Market Research: {json.dumps(research_data, indent=2)}
            
            Provide insights on:
            1. Market opportunity size
            2. Key competitors and differentiation
            3. Target customer segments
            4. Potential challenges
            5. Revenue model recommendations
            
            Format as JSON with clear categories.
            """
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "tambo-chat",
                        "messages": [
                            {"role": "user", "content": prompt}
                        ],
                        "max_tokens": 1000,
                        "temperature": 0.7
                    },
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    insights_text = result.get("choices", [{}])[0].get("message", {}).get("content", "")
                    
                    # Try to parse as JSON, fallback to structured text
                    try:
                        insights = json.loads(insights_text)
                    except:
                        insights = {
                            "analysis": insights_text,
                            "generated_at": datetime.now().isoformat()
                        }
                    
                    return insights
                else:
                    # Fallback insights
                    return self._generate_fallback_insights(idea, research_data)
                    
        except Exception as e:
            print(f"Error in market analysis: {str(e)}")
            return self._generate_fallback_insights(idea, research_data)
    
    async def generate_pitch_deck(self, idea: str, research_data: Dict) -> Dict:
        """Generate complete pitch deck content"""
        try:
            prompt = f"""
            Create a professional 9-slide pitch deck for this startup idea:
            
            Startup Idea: {idea}
            Market Research: {json.dumps(research_data, indent=2)}
            
            Generate content for these slides:
            1. Executive Summary
            2. Problem Statement
            3. Solution
            4. Market Opportunity
            5. Business Model
            6. Competitive Advantage
            7. Financial Projections
            8. Team
            9. Funding Request
            
            For each slide, provide:
            - Title
            - Main content (2-3 bullet points)
            - Supporting details
            
            Format as JSON with slide array.
            """
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "tambo-chat",
                        "messages": [
                            {"role": "user", "content": prompt}
                        ],
                        "max_tokens": 2000,
                        "temperature": 0.7
                    },
                    timeout=45.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    content_text = result.get("choices", [{}])[0].get("message", {}).get("content", "")
                    
                    # Try to parse as JSON, fallback to structured content
                    try:
                        pitch_content = json.loads(content_text)
                    except:
                        pitch_content = self._parse_pitch_content(content_text, idea)
                    
                    return pitch_content
                else:
                    return self._generate_fallback_pitch(idea, research_data)
                    
        except Exception as e:
            print(f"Error generating pitch deck: {str(e)}")
            return self._generate_fallback_pitch(idea, research_data)
    
    def _generate_fallback_insights(self, idea: str, research_data: Dict) -> Dict:
        """Generate fallback insights when API fails"""
        return {
            "market_opportunity": f"Large addressable market for {idea} with growing demand",
            "key_competitors": ["Established players", "Emerging startups", "Traditional alternatives"],
            "target_segments": ["Early adopters", "SME businesses", "Enterprise customers"],
            "challenges": ["Market competition", "Customer acquisition", "Technology scalability"],
            "revenue_model": ["Subscription-based", "Freemium model", "Enterprise licensing"],
            "generated_at": datetime.now().isoformat(),
            "source": "fallback_analysis"
        }
    
    def _generate_fallback_pitch(self, idea: str, research_data: Dict) -> Dict:
        """Generate fallback pitch deck when API fails"""
        return {
            "slides": [
                {
                    "title": "Executive Summary",
                    "content": f"{idea} addresses a significant market opportunity with innovative technology and strong growth potential.",
                    "details": ["Scalable business model", "Experienced team", "Clear path to profitability"]
                },
                {
                    "title": "Problem Statement",
                    "content": f"Current solutions in the {idea} space face significant challenges and limitations.",
                    "details": ["High costs", "Complex user experience", "Limited scalability"]
                },
                {
                    "title": "Our Solution",
                    "content": f"Our {idea} platform provides a comprehensive, user-friendly solution.",
                    "details": ["Innovative technology", "Intuitive design", "Proven results"]
                },
                {
                    "title": "Market Opportunity",
                    "content": "Large addressable market with strong growth trends and increasing demand.",
                    "details": ["$X billion market size", "X% annual growth", "Expanding customer base"]
                },
                {
                    "title": "Business Model",
                    "content": "Scalable revenue model with multiple income streams.",
                    "details": ["Subscription revenue", "Enterprise licensing", "Premium features"]
                },
                {
                    "title": "Competitive Advantage",
                    "content": "Unique technology and strategic positioning create sustainable advantages.",
                    "details": ["Patent-pending technology", "First-mover advantage", "Strong partnerships"]
                },
                {
                    "title": "Financial Projections",
                    "content": "Strong growth trajectory with positive unit economics.",
                    "details": ["3-year revenue projection", "Path to profitability", "Conservative estimates"]
                },
                {
                    "title": "Team",
                    "content": "Experienced leadership team with proven track record.",
                    "details": ["Industry expertise", "Technical excellence", "Business development"]
                },
                {
                    "title": "Funding Request",
                    "content": "Seeking strategic investment to accelerate growth and market expansion.",
                    "details": ["Product development", "Market expansion", "Team growth"]
                }
            ],
            "generated_at": datetime.now().isoformat(),
            "source": "fallback_generation"
        }
    
    def _parse_pitch_content(self, content_text: str, idea: str) -> Dict:
        """Parse pitch content from text when JSON parsing fails"""
        # Simple parsing logic - in real app, use more sophisticated parsing
        slides = []
        slide_titles = [
            "Executive Summary", "Problem Statement", "Solution", 
            "Market Opportunity", "Business Model", "Competitive Advantage",
            "Financial Projections", "Team", "Funding Request"
        ]
        
        for i, title in enumerate(slide_titles):
            slides.append({
                "title": title,
                "content": f"AI-generated content for {title} slide of {idea}",
                "details": ["Key point 1", "Key point 2", "Key point 3"]
            })
        
        return {
            "slides": slides,
            "generated_at": datetime.now().isoformat(),
            "source": "text_parsing"
        }