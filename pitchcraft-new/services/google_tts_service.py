import httpx
import os
import json
import base64
from typing import Dict, List, Optional
from datetime import datetime

class GoogleTTSService:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_CLOUD_API_KEY")
        self.base_url = os.getenv("GOOGLE_CLOUD_TTS_URL", "https://texttospeech.googleapis.com/v1")
        
    async def check_health(self) -> bool:
        """Check if Google TTS service is available"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/voices?key={self.api_key}",
                    timeout=10.0
                )
                return response.status_code == 200
        except:
            return False
    
    async def test_connection(self) -> Dict:
        """Test Google TTS API connection"""
        try:
            async with httpx.AsyncClient() as client:
                # Test with a simple synthesis
                response = await client.post(
                    f"{self.base_url}/text:synthesize?key={self.api_key}",
                    headers={
                        "Content-Type": "application/json"
                    },
                    json={
                        "input": {"text": "Hello, this is a test from PitchCraft AI"},
                        "voice": {
                            "languageCode": "en-US",
                            "name": "en-US-Neural2-F"
                        },
                        "audioConfig": {
                            "audioEncoding": "MP3"
                        }
                    },
                    timeout=15.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    return {
                        "status": "connected",
                        "message": "Google TTS API is working",
                        "audio_length": len(result.get("audioContent", "")) if "audioContent" in result else 0
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
    
    async def generate_pitch_voice(self, pitch_content: Dict) -> Optional[str]:
        """Generate voice-over for the entire pitch deck"""
        try:
            # Extract text from slides
            pitch_text = self._extract_pitch_text(pitch_content)
            
            # Generate voice for the complete pitch
            audio_url = await self._synthesize_speech(
                pitch_text,
                voice_name="en-US-Neural2-F",
                language_code="en-US"
            )
            
            return audio_url
            
        except Exception as e:
            print(f"Error generating pitch voice: {str(e)}")
            return None
    
    async def generate_slide_voice(self, slide: Dict, voice_settings: Optional[Dict] = None) -> Optional[str]:
        """Generate voice-over for a single slide"""
        try:
            # Extract text from slide
            slide_text = self._extract_slide_text(slide)
            
            # Use custom voice settings or defaults
            voice_name = voice_settings.get("voice_name", "en-US-Neural2-F") if voice_settings else "en-US-Neural2-F"
            language_code = voice_settings.get("language_code", "en-US") if voice_settings else "en-US"
            
            # Generate voice for the slide
            audio_url = await self._synthesize_speech(
                slide_text,
                voice_name=voice_name,
                language_code=language_code
            )
            
            return audio_url
            
        except Exception as e:
            print(f"Error generating slide voice: {str(e)}")
            return None
    
    async def _synthesize_speech(self, text: str, voice_name: str = "en-US-Neural2-F", language_code: str = "en-US") -> Optional[str]:
        """Synthesize speech using Google TTS API"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/text:synthesize?key={self.api_key}",
                    headers={
                        "Content-Type": "application/json"
                    },
                    json={
                        "input": {"text": text},
                        "voice": {
                            "languageCode": language_code,
                            "name": voice_name
                        },
                        "audioConfig": {
                            "audioEncoding": "MP3",
                            "speakingRate": 1.0,
                            "pitch": 0.0,
                            "volumeGainDb": 0.0
                        }
                    },
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    audio_content = result.get("audioContent")
                    
                    if audio_content:
                        # Save audio file and return URL
                        audio_url = await self._save_audio_file(audio_content)
                        return audio_url
                    else:
                        return None
                else:
                    print(f"TTS API error: {response.status_code} - {response.text}")
                    return None
                    
        except Exception as e:
            print(f"Error in speech synthesis: {str(e)}")
            return None
    
    async def _save_audio_file(self, audio_content_base64: str) -> str:
        """Save audio content to file and return URL"""
        try:
            # Decode base64 audio content
            audio_data = base64.b64decode(audio_content_base64)
            
            # Generate unique filename
            timestamp = int(datetime.now().timestamp())
            filename = f"pitch_voice_{timestamp}.mp3"
            filepath = f"static/{filename}"
            
            # Ensure static directory exists
            os.makedirs("static", exist_ok=True)
            
            # Save audio file
            with open(filepath, "wb") as f:
                f.write(audio_data)
            
            # Return URL path
            return f"/static/{filename}"
            
        except Exception as e:
            print(f"Error saving audio file: {str(e)}")
            return None
    
    def _extract_pitch_text(self, pitch_content: Dict) -> str:
        """Extract text from pitch content for voice synthesis"""
        text_parts = []
        
        # Add introduction
        text_parts.append("Welcome to our startup pitch presentation.")
        
        # Extract text from slides
        if "slides" in pitch_content and isinstance(pitch_content["slides"], list):
            for i, slide in enumerate(pitch_content["slides"], 1):
                slide_text = self._extract_slide_text(slide)
                text_parts.append(f"Slide {i}. {slide_text}")
                text_parts.append("") # Add pause between slides
        
        # Add conclusion
        text_parts.append("Thank you for your attention. We look forward to discussing this opportunity with you.")
        
        return " ".join(text_parts)
    
    def _extract_slide_text(self, slide: Dict) -> str:
        """Extract text from a single slide"""
        text_parts = []
        
        # Add title
        if "title" in slide:
            text_parts.append(f"{slide['title']}.")
        
        # Add main content
        if "content" in slide:
            text_parts.append(slide["content"])
        
        # Add details
        if "details" in slide and isinstance(slide["details"], list):
            for detail in slide["details"]:
                text_parts.append(detail)
        
        return " ".join(text_parts)
    
    async def get_available_voices(self, language_code: str = "en-US") -> Dict:
        """Get available voices for a language"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/voices?key={self.api_key}&languageCode={language_code}",
                    timeout=10.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    voices = result.get("voices", [])
                    
                    # Format voice information
                    formatted_voices = []
                    for voice in voices:
                        formatted_voices.append({
                            "name": voice.get("name"),
                            "gender": voice.get("ssmlGender"),
                            "language_codes": voice.get("languageCodes", []),
                            "natural_sample_rate": voice.get("naturalSampleRateHertz")
                        })
                    
                    return {
                        "voices": formatted_voices,
                        "total": len(formatted_voices),
                        "language_code": language_code,
                        "status": "success"
                    }
                else:
                    return self._get_fallback_voices(language_code)
                    
        except Exception as e:
            print(f"Error getting voices: {str(e)}")
            return self._get_fallback_voices(language_code)
    
    def _get_fallback_voices(self, language_code: str = "en-US") -> Dict:
        """Get fallback voice list when API fails"""
        fallback_voices = [
            {
                "name": "en-US-Neural2-F",
                "gender": "FEMALE",
                "language_codes": ["en-US"],
                "natural_sample_rate": 24000
            },
            {
                "name": "en-US-Neural2-M",
                "gender": "MALE", 
                "language_codes": ["en-US"],
                "natural_sample_rate": 24000
            }
        ]
        
        return {
            "voices": fallback_voices,
            "total": len(fallback_voices),
            "language_code": language_code,
            "status": "fallback"
        }
    
    async def generate_voice_with_ssml(self, ssml: str, voice_settings: Dict) -> Optional[str]:
        """Generate voice using SSML for advanced control"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/text:synthesize?key={self.api_key}",
                    headers={
                        "Content-Type": "application/json"
                    },
                    json={
                        "input": {"ssml": ssml},
                        "voice": {
                            "languageCode": voice_settings.get("language_code", "en-US"),
                            "name": voice_settings.get("voice_name", "en-US-Neural2-F")
                        },
                        "audioConfig": {
                            "audioEncoding": "MP3",
                            "speakingRate": voice_settings.get("speaking_rate", 1.0),
                            "pitch": voice_settings.get("pitch", 0.0),
                            "volumeGainDb": voice_settings.get("volume_gain", 0.0)
                        }
                    },
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    audio_content = result.get("audioContent")
                    
                    if audio_content:
                        audio_url = await self._save_audio_file(audio_content)
                        return audio_url
                    else:
                        return None
                else:
                    return None
                    
        except Exception as e:
            print(f"Error in SSML synthesis: {str(e)}")
            return None