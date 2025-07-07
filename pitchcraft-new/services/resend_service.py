import httpx
import os
import json
from typing import Dict, List, Optional
from datetime import datetime

class ResendService:
    def __init__(self):
        self.api_key = os.getenv("RESEND_API_KEY")
        self.base_url = os.getenv("RESEND_URL", "https://api.resend.com")
        
    async def check_health(self) -> bool:
        """Check if Resend service is available"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/domains",
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    timeout=10.0
                )
                return response.status_code == 200
        except:
            return False
    
    async def test_connection(self) -> Dict:
        """Test Resend API connection"""
        try:
            async with httpx.AsyncClient() as client:
                # Test by getting domains (doesn't send email)
                response = await client.get(
                    f"{self.base_url}/domains",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    timeout=15.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    return {
                        "status": "connected",
                        "message": "Resend API is working",
                        "domains": len(result.get("data", []))
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
    
    async def send_pitch_email(self, to_email: str, pitch_content: Dict, pitch_id: str) -> Dict:
        """Send complete pitch deck via email"""
        try:
            # Generate email content from pitch
            email_subject = self._generate_email_subject(pitch_content)
            email_html = self._generate_pitch_email_html(pitch_content, pitch_id)
            email_text = self._generate_pitch_email_text(pitch_content)
            
            # Send email using Resend API
            result = await self._send_email(
                to_email=to_email,
                subject=email_subject,
                html_content=email_html,
                text_content=email_text,
                from_email="pitchcraft@resend.dev"  # Default Resend email
            )
            
            return result
            
        except Exception as e:
            print(f"Error sending pitch email: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
    
    async def send_simple_pitch_email(self, to_email: str, pitch_id: str, subject: str) -> Dict:
        """Send simple pitch notification email"""
        try:
            # Generate simple email content
            html_content = f"""
            <html>
                <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
                        <h1>🚀 Your PitchCraft AI Deck is Ready!</h1>
                    </div>
                    
                    <div style="padding: 20px;">
                        <h2>Your AI-Generated Pitch Deck</h2>
                        <p>Your professional pitch deck has been generated successfully!</p>
                        
                        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <h3>Pitch ID: {pitch_id}</h3>
                            <p><strong>Generated:</strong> {datetime.now().strftime('%B %d, %Y at %I:%M %p')}</p>
                        </div>
                        
                        <h3>What's Included:</h3>
                        <ul>
                            <li>✅ 9 Professional Slides</li>
                            <li>✅ Market Research Insights</li>
                            <li>✅ AI-Generated Content</li>
                            <li>✅ Investment-Ready Format</li>
                        </ul>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <p style="color: #666;">Powered by PitchCraft AI</p>
                        </div>
                    </div>
                </body>
            </html>
            """
            
            text_content = f"""
            Your PitchCraft AI Deck is Ready!
            
            Your professional pitch deck has been generated successfully!
            
            Pitch ID: {pitch_id}
            Generated: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}
            
            What's Included:
            - 9 Professional Slides
            - Market Research Insights  
            - AI-Generated Content
            - Investment-Ready Format
            
            Powered by PitchCraft AI
            """
            
            result = await self._send_email(
                to_email=to_email,
                subject=subject,
                html_content=html_content,
                text_content=text_content,
                from_email="pitchcraft@resend.dev"
            )
            
            return result
            
        except Exception as e:
            print(f"Error sending simple email: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
    
    async def _send_email(self, to_email: str, subject: str, html_content: str, text_content: str, from_email: str = "pitchcraft@resend.dev") -> Dict:
        """Send email using Resend API"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/emails",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "from": from_email,
                        "to": [to_email],
                        "subject": subject,
                        "html": html_content,
                        "text": text_content
                    },
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    return {
                        "success": True,
                        "id": result.get("id"),
                        "message": f"Email sent successfully to {to_email}",
                        "timestamp": datetime.now().isoformat()
                    }
                else:
                    return {
                        "success": False,
                        "error": f"API error: {response.status_code}",
                        "message": response.text,
                        "timestamp": datetime.now().isoformat()
                    }
                    
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
    
    def _generate_email_subject(self, pitch_content: Dict) -> str:
        """Generate email subject from pitch content"""
        idea = pitch_content.get("idea", "Startup Idea")
        return f"🚀 Your {idea} Pitch Deck - Generated by PitchCraft AI"
    
    def _generate_pitch_email_html(self, pitch_content: Dict, pitch_id: str) -> str:
        """Generate HTML email content for pitch deck"""
        idea = pitch_content.get("idea", "Your Startup Idea")
        slides = pitch_content.get("slides", [])
        
        # Build slides HTML
        slides_html = ""
        for i, slide in enumerate(slides, 1):
            slides_html += f"""
                <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #667eea; background-color: #f8f9fa;">
                    <h3 style="color: #333; margin: 0 0 10px 0;">Slide {i}: {slide.get('title', 'Untitled')}</h3>
                    <p style="margin: 0 0 10px 0;">{slide.get('content', '')}</p>
                    {self._format_slide_details(slide.get('details', []))}
                </div>
            """
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; line-height: 1.6;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
                    <h1 style="margin: 0;">🚀 Your AI-Generated Pitch Deck</h1>
                    <h2 style="margin: 10px 0 0 0; font-weight: normal;">{idea}</h2>
                </div>
                
                <div style="padding: 30px;">
                    <div style="background-color: #e8f4f8; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                        <h3 style="color: #333; margin: 0 0 10px 0;">Pitch Details</h3>
                        <p><strong>Pitch ID:</strong> {pitch_id}</p>
                        <p><strong>Generated:</strong> {datetime.now().strftime('%B %d, %Y at %I:%M %p')}</p>
                        <p><strong>Total Slides:</strong> {len(slides)}</p>
                    </div>
                    
                    <h2 style="color: #333;">Pitch Deck Content</h2>
                    {slides_html}
                    
                    <div style="margin-top: 40px; padding: 20px; background-color: #f0f8ff; border-radius: 8px; text-align: center;">
                        <h3 style="color: #333;">Ready to Present? 🎯</h3>
                        <p>Your professional pitch deck is ready for investors. Good luck with your funding journey!</p>
                        <p style="color: #666; font-size: 0.9em;">Powered by PitchCraft AI - From idea to deck in minutes</p>
                    </div>
                </div>
            </body>
        </html>
        """
        
        return html_content
    
    def _generate_pitch_email_text(self, pitch_content: Dict) -> str:
        """Generate text email content for pitch deck"""
        idea = pitch_content.get("idea", "Your Startup Idea")
        slides = pitch_content.get("slides", [])
        
        text_content = f"""
Your AI-Generated Pitch Deck: {idea}

Generated: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}
Total Slides: {len(slides)}

PITCH DECK CONTENT:
==================

"""
        
        for i, slide in enumerate(slides, 1):
            text_content += f"""
Slide {i}: {slide.get('title', 'Untitled')}
{'-' * 40}
{slide.get('content', '')}

"""
            details = slide.get('details', [])
            if details:
                text_content += "Key Points:\n"
                for detail in details:
                    text_content += f"• {detail}\n"
                text_content += "\n"
        
        text_content += """
Ready to Present? 🎯
Your professional pitch deck is ready for investors. Good luck with your funding journey!

Powered by PitchCraft AI - From idea to deck in minutes
"""
        
        return text_content
    
    def _format_slide_details(self, details: List[str]) -> str:
        """Format slide details as HTML list"""
        if not details:
            return ""
        
        details_html = "<ul style='margin: 10px 0 0 20px; padding: 0;'>"
        for detail in details:
            details_html += f"<li style='margin: 5px 0;'>{detail}</li>"
        details_html += "</ul>"
        
        return details_html
    
    async def send_pitch_summary(self, to_email: str, summary_data: Dict) -> Dict:
        """Send pitch summary/analytics email"""
        try:
            html_content = f"""
            <html>
                <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
                        <h1>📊 Pitch Analytics Summary</h1>
                    </div>
                    
                    <div style="padding: 20px;">
                        <h2>Performance Insights</h2>
                        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px;">
                            <h3>Key Metrics:</h3>
                            <p><strong>Quality Score:</strong> {summary_data.get('quality_score', 'N/A')}/10</p>
                            <p><strong>Completeness:</strong> {summary_data.get('completeness', 'N/A')}%</p>
                            <p><strong>Market Research:</strong> ✅ Included</p>
                            <p><strong>AI Enhancement:</strong> ✅ Applied</p>
                        </div>
                        
                        <p style="margin-top: 20px; text-align: center; color: #666;">
                            Keep refining your pitch for the best results!
                        </p>
                    </div>
                </body>
            </html>
            """
            
            result = await self._send_email(
                to_email=to_email,
                subject="📊 Your Pitch Analytics Summary",
                html_content=html_content,
                text_content=f"Pitch Analytics Summary\n\nQuality Score: {summary_data.get('quality_score', 'N/A')}/10\nCompleteness: {summary_data.get('completeness', 'N/A')}%",
                from_email="analytics@resend.dev"
            )
            
            return result
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }