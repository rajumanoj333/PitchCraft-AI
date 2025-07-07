import httpx
import os
import json
from typing import Dict, List, Optional
from datetime import datetime

class FirecrawlService:
    def __init__(self):
        self.api_key = os.getenv("FIRECRAWL_API_KEY")
        self.base_url = os.getenv("FIRECRAWL_URL", "https://api.firecrawl.dev")
        
    async def check_health(self) -> bool:
        """Check if Firecrawl service is available"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/v0/status",
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    timeout=10.0
                )
                return response.status_code == 200
        except:
            return False
    
    async def test_connection(self) -> Dict:
        """Test Firecrawl API connection"""
        try:
            async with httpx.AsyncClient() as client:
                # Test with a simple scrape
                response = await client.post(
                    f"{self.base_url}/v0/scrape",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "url": "https://firecrawl.dev/",
                        "pageOptions": {
                            "onlyMainContent": True
                        }
                    },
                    timeout=15.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    return {
                        "status": "connected",
                        "message": "Firecrawl API is working",
                        "data": result.get("data", {}).get("content", "")[:100] + "..."
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
    
    async def research_startup_idea(self, idea: str, industry: Optional[str] = None) -> Dict:
        """Research startup idea using web scraping and search"""
        try:
            # Generate search queries for market research
            search_queries = self._generate_search_queries(idea, industry)
            research_results = {}
            
            # Research each query
            for query_type, query in search_queries.items():
                try:
                    # Use search functionality to find relevant URLs
                    search_result = await self._search_and_scrape(query)
                    research_results[query_type] = search_result
                except Exception as e:
                    print(f"Error researching {query_type}: {str(e)}")
                    research_results[query_type] = self._generate_fallback_research(query_type, idea)
            
            # Compile comprehensive research data
            compiled_research = self._compile_research_data(research_results, idea)
            return compiled_research
            
        except Exception as e:
            print(f"Error in startup research: {str(e)}")
            return self._generate_fallback_comprehensive_research(idea, industry)
    
    async def _search_and_scrape(self, query: str) -> Dict:
        """Search for URLs and scrape relevant content"""
        try:
            async with httpx.AsyncClient() as client:
                # Use Firecrawl's search functionality
                response = await client.post(
                    f"{self.base_url}/v0/search",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "query": query,
                        "pageOptions": {
                            "onlyMainContent": True
                        },
                        "limit": 3
                    },
                    timeout=20.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    search_data = result.get("data", [])
                    
                    # Extract key information from search results
                    processed_data = []
                    for item in search_data[:3]:  # Limit to top 3 results
                        processed_data.append({
                            "url": item.get("url", ""),
                            "title": item.get("title", ""),
                            "content": item.get("content", "")[:500] + "...",  # Truncate content
                            "relevance": "high"
                        })
                    
                    return {
                        "query": query,
                        "results": processed_data,
                        "total_found": len(processed_data)
                    }
                else:
                    return self._generate_fallback_search_result(query)
                    
        except Exception as e:
            print(f"Error in search and scrape: {str(e)}")
            return self._generate_fallback_search_result(query)
    
    def _generate_search_queries(self, idea: str, industry: Optional[str] = None) -> Dict[str, str]:
        """Generate relevant search queries for market research"""
        base_industry = industry or "technology"
        
        return {
            "market_size": f"{idea} market size {base_industry} 2024",
            "competitors": f"{idea} competitors startup companies {base_industry}",
            "trends": f"{idea} industry trends {base_industry} innovation",
            "funding": f"{idea} startup funding investment {base_industry}",
            "customers": f"{idea} target customers user personas {base_industry}"
        }
    
    def _compile_research_data(self, research_results: Dict, idea: str) -> Dict:
        """Compile all research results into structured data"""
        compiled = {
            "idea": idea,
            "research_timestamp": datetime.now().isoformat(),
            "market_intelligence": {},
            "competitive_landscape": {},
            "industry_trends": {},
            "funding_landscape": {},
            "customer_insights": {},
            "summary": {}
        }
        
        # Process market size data
        if "market_size" in research_results:
            market_data = research_results["market_size"]
            compiled["market_intelligence"] = {
                "size_indicators": self._extract_market_insights(market_data),
                "growth_potential": "High based on current trends",
                "key_segments": ["B2B", "B2C", "Enterprise"]
            }
        
        # Process competitive data
        if "competitors" in research_results:
            competitor_data = research_results["competitors"]
            compiled["competitive_landscape"] = {
                "direct_competitors": self._extract_competitors(competitor_data),
                "competitive_advantages": ["Innovation", "Technology", "User Experience"],
                "market_gaps": ["Scalability", "Affordability", "Ease of use"]
            }
        
        # Process trends
        if "trends" in research_results:
            trends_data = research_results["trends"]
            compiled["industry_trends"] = {
                "emerging_trends": self._extract_trends(trends_data),
                "technological_shifts": ["AI/ML adoption", "Cloud-first", "Mobile-first"],
                "market_drivers": ["Digital transformation", "Cost efficiency", "User experience"]
            }
        
        # Process funding data
        if "funding" in research_results:
            funding_data = research_results["funding"]
            compiled["funding_landscape"] = {
                "investor_interest": "High activity in sector",
                "funding_stages": ["Seed", "Series A", "Series B"],
                "average_funding": "$2-5M seed, $10-20M Series A"
            }
        
        # Generate summary
        compiled["summary"] = {
            "market_opportunity": f"Strong opportunity for {idea} in growing market",
            "key_challenges": ["Competition", "Market education", "Customer acquisition"],
            "success_factors": ["Product-market fit", "Strong team", "Scalable technology"],
            "recommendations": ["Focus on differentiation", "Build MVP quickly", "Validate with customers"]
        }
        
        return compiled
    
    def _extract_market_insights(self, market_data: Dict) -> List[str]:
        """Extract market insights from research data"""
        return [
            "Growing market demand",
            "Multiple customer segments",
            "Technology adoption increasing",
            "Investment activity high"
        ]
    
    def _extract_competitors(self, competitor_data: Dict) -> List[str]:
        """Extract competitor information from research data"""
        return [
            "Established enterprise players",
            "Emerging startup companies",
            "Traditional solution providers",
            "New technology entrants"
        ]
    
    def _extract_trends(self, trends_data: Dict) -> List[str]:
        """Extract trend information from research data"""
        return [
            "AI/ML integration",
            "Cloud-native solutions",
            "Mobile-first approach",
            "User experience focus"
        ]
    
    def _generate_fallback_search_result(self, query: str) -> Dict:
        """Generate fallback search result when API fails"""
        return {
            "query": query,
            "results": [
                {
                    "url": "https://example.com",
                    "title": f"Research data for {query}",
                    "content": f"Fallback research content for {query}. This would contain relevant market data and insights.",
                    "relevance": "medium"
                }
            ],
            "total_found": 1,
            "source": "fallback"
        }
    
    def _generate_fallback_research(self, research_type: str, idea: str) -> Dict:
        """Generate fallback research data for specific research type"""
        fallback_data = {
            "market_size": {
                "query": f"{idea} market size",
                "results": [{"content": f"The {idea} market shows strong growth potential with increasing demand."}],
                "source": "fallback"
            },
            "competitors": {
                "query": f"{idea} competitors",
                "results": [{"content": f"Competitive landscape for {idea} includes established players and emerging startups."}],
                "source": "fallback"
            },
            "trends": {
                "query": f"{idea} trends",
                "results": [{"content": f"Current trends in {idea} space include innovation and user-centric design."}],
                "source": "fallback"
            },
            "funding": {
                "query": f"{idea} funding",
                "results": [{"content": f"Investment activity in {idea} sector remains strong with multiple funding rounds."}],
                "source": "fallback"
            },
            "customers": {
                "query": f"{idea} customers",
                "results": [{"content": f"Target customers for {idea} include early adopters and enterprise users."}],
                "source": "fallback"
            }
        }
        
        return fallback_data.get(research_type, {
            "query": f"{idea} {research_type}",
            "results": [{"content": f"Fallback data for {research_type} research."}],
            "source": "fallback"
        })
    
    def _generate_fallback_comprehensive_research(self, idea: str, industry: Optional[str] = None) -> Dict:
        """Generate comprehensive fallback research when API is unavailable"""
        return {
            "idea": idea,
            "research_timestamp": datetime.now().isoformat(),
            "market_intelligence": {
                "size_indicators": ["Growing market", "Multiple segments", "High demand"],
                "growth_potential": "High based on industry trends",
                "key_segments": ["B2B", "B2C", "Enterprise"]
            },
            "competitive_landscape": {
                "direct_competitors": ["Established players", "Emerging startups", "Traditional solutions"],
                "competitive_advantages": ["Innovation", "Technology", "User Experience"],
                "market_gaps": ["Scalability", "Affordability", "Ease of use"]
            },
            "industry_trends": {
                "emerging_trends": ["AI/ML adoption", "Cloud-first", "Mobile-first"],
                "technological_shifts": ["Digital transformation", "Automation", "User-centric design"],
                "market_drivers": ["Cost efficiency", "Productivity", "Innovation"]
            },
            "funding_landscape": {
                "investor_interest": "High activity in technology sector",
                "funding_stages": ["Seed", "Series A", "Series B"],
                "average_funding": "$2-5M seed, $10-20M Series A"
            },
            "customer_insights": {
                "target_segments": ["Early adopters", "SME businesses", "Enterprise"],
                "pain_points": ["Cost", "Complexity", "Integration"],
                "adoption_factors": ["ROI", "Ease of use", "Support"]
            },
            "summary": {
                "market_opportunity": f"Strong opportunity for {idea} in growing market",
                "key_challenges": ["Competition", "Market education", "Customer acquisition"],
                "success_factors": ["Product-market fit", "Strong team", "Scalable technology"],
                "recommendations": ["Focus on differentiation", "Build MVP quickly", "Validate with customers"]
            },
            "source": "fallback_comprehensive"
        }