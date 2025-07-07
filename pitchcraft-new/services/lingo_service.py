import httpx
import os
import json
from typing import Dict, List, Optional
from datetime import datetime

class LingoService:
    def __init__(self):
        self.api_key = os.getenv("LINGO_DEV_API_KEY")
        self.base_url = os.getenv("LINGO_DEV_URL", "https://api.lingo.dev")
        
    async def check_health(self) -> bool:
        """Check if Lingo service is available"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/v1/status",
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    timeout=10.0
                )
                return response.status_code == 200
        except:
            return False
    
    async def test_connection(self) -> Dict:
        """Test Lingo API connection"""
        try:
            async with httpx.AsyncClient() as client:
                # Test with a simple translation
                response = await client.post(
                    f"{self.base_url}/v1/translate",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "text": "Hello, this is a test",
                        "source_language": "en",
                        "target_language": "es"
                    },
                    timeout=15.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    return {
                        "status": "connected",
                        "message": "Lingo API is working",
                        "sample_translation": result.get("translated_text", "Translation successful")
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
    
    async def translate_pitch(self, pitch_content: Dict, target_language: str) -> Dict:
        """Translate pitch deck content to target language"""
        try:
            translated_content = pitch_content.copy()
            
            # If slides are present, translate each slide
            if "slides" in pitch_content and isinstance(pitch_content["slides"], list):
                translated_slides = []
                
                for slide in pitch_content["slides"]:
                    translated_slide = await self._translate_slide(slide, target_language)
                    translated_slides.append(translated_slide)
                
                translated_content["slides"] = translated_slides
            
            # Add translation metadata
            translated_content["translation"] = {
                "target_language": target_language,
                "translated_at": datetime.now().isoformat(),
                "service": "lingo_dev"
            }
            
            return translated_content
            
        except Exception as e:
            print(f"Error translating pitch: {str(e)}")
            return self._generate_fallback_translation(pitch_content, target_language)
    
    async def _translate_slide(self, slide: Dict, target_language: str) -> Dict:
        """Translate individual slide content"""
        try:
            translated_slide = slide.copy()
            
            # Translate title
            if "title" in slide:
                translated_title = await self._translate_text(slide["title"], target_language)
                translated_slide["title"] = translated_title
            
            # Translate content
            if "content" in slide:
                translated_content = await self._translate_text(slide["content"], target_language)
                translated_slide["content"] = translated_content
            
            # Translate details if present
            if "details" in slide and isinstance(slide["details"], list):
                translated_details = []
                for detail in slide["details"]:
                    translated_detail = await self._translate_text(detail, target_language)
                    translated_details.append(translated_detail)
                translated_slide["details"] = translated_details
            
            return translated_slide
            
        except Exception as e:
            print(f"Error translating slide: {str(e)}")
            return slide  # Return original if translation fails
    
    async def _translate_text(self, text: str, target_language: str) -> str:
        """Translate individual text using Lingo API"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/v1/translate",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "text": text,
                        "source_language": "en",
                        "target_language": target_language,
                        "preserve_formatting": True
                    },
                    timeout=20.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    return result.get("translated_text", text)
                else:
                    return text  # Return original if API fails
                    
        except Exception as e:
            print(f"Error translating text: {str(e)}")
            return text  # Return original if translation fails
    
    async def detect_language(self, text: str) -> Dict:
        """Detect the language of given text"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/v1/detect",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "text": text
                    },
                    timeout=15.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    return {
                        "detected_language": result.get("language", "en"),
                        "confidence": result.get("confidence", 0.95),
                        "status": "success"
                    }
                else:
                    return {
                        "detected_language": "en",
                        "confidence": 0.5,
                        "status": "fallback"
                    }
                    
        except Exception as e:
            return {
                "detected_language": "en",
                "confidence": 0.5,
                "status": "error",
                "error": str(e)
            }
    
    async def get_supported_languages(self) -> Dict:
        """Get list of supported languages"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/v1/languages",
                    headers={
                        "Authorization": f"Bearer {self.api_key}"
                    },
                    timeout=10.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    return {
                        "languages": result.get("languages", self._get_fallback_languages()),
                        "total": len(result.get("languages", [])),
                        "status": "success"
                    }
                else:
                    return {
                        "languages": self._get_fallback_languages(),
                        "total": len(self._get_fallback_languages()),
                        "status": "fallback"
                    }
                    
        except Exception as e:
            return {
                "languages": self._get_fallback_languages(),
                "total": len(self._get_fallback_languages()),
                "status": "error",
                "error": str(e)
            }
    
    def _get_fallback_languages(self) -> List[Dict]:
        """Get fallback list of supported languages"""
        return [
            {"code": "en", "name": "English"},
            {"code": "es", "name": "Spanish"},
            {"code": "fr", "name": "French"},
            {"code": "de", "name": "German"},
            {"code": "it", "name": "Italian"},
            {"code": "pt", "name": "Portuguese"},
            {"code": "ru", "name": "Russian"},
            {"code": "zh", "name": "Chinese"},
            {"code": "ja", "name": "Japanese"},
            {"code": "ko", "name": "Korean"}
        ]
    
    def _generate_fallback_translation(self, pitch_content: Dict, target_language: str) -> Dict:
        """Generate fallback 'translation' when API fails"""
        fallback_content = pitch_content.copy()
        
        # Add fallback translation notice
        if "slides" in fallback_content and isinstance(fallback_content["slides"], list):
            for slide in fallback_content["slides"]:
                if "title" in slide:
                    slide["title"] = f"[{target_language.upper()}] {slide['title']}"
                if "content" in slide:
                    slide["content"] = f"[{target_language.upper()}] {slide['content']}"
        
        fallback_content["translation"] = {
            "target_language": target_language,
            "translated_at": datetime.now().isoformat(),
            "service": "fallback",
            "note": "Translation service unavailable - showing original content with language prefix"
        }
        
        return fallback_content
    
    async def translate_text_batch(self, texts: List[str], target_language: str) -> List[str]:
        """Translate multiple texts in batch"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/v1/translate/batch",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "texts": texts,
                        "source_language": "en",
                        "target_language": target_language
                    },
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    return result.get("translated_texts", texts)
                else:
                    return texts  # Return originals if API fails
                    
        except Exception as e:
            print(f"Error in batch translation: {str(e)}")
            return texts  # Return originals if translation fails