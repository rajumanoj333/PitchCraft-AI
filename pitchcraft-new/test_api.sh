#!/bin/bash

echo "🚀 PitchCraft AI - API Testing Script"
echo "====================================="
echo ""
echo "Make sure the server is running first: python main.py"
echo ""

# Test 1: Health Check
echo "1. Testing Health Check..."
curl -X GET http://localhost:8000/health
echo -e "\n"

# Test 2: Test API Connections
echo "2. Testing API Connections..."
curl -X GET http://localhost:8000/api/test-apis
echo -e "\n"

# Test 3: Generate Pitch Deck
echo "3. Testing Pitch Generation..."
curl -X POST http://localhost:8000/api/generate-pitch \
  -H "Content-Type: application/json" \
  -d '{"idea":"AI agent startup for business automation"}'
echo -e "\n"

# Test 4: Research Idea
echo "4. Testing Market Research..."
curl -X POST http://localhost:8000/api/research-idea \
  -H "Content-Type: application/json" \
  -d '{"idea":"SaaS platform for small businesses","industry":"technology"}'
echo -e "\n"

# Test 5: Send Pitch via Email
echo "5. Testing Email Delivery..."
curl -X POST http://localhost:8000/api/send-pitch \
  -H "Content-Type: application/json" \
  -d '{"pitch_id":"test_123","email_to":"investor@example.com","subject":"Investment Opportunity"}'
echo -e "\n"

echo "✅ API Testing Complete!"
echo "Visit http://localhost:8000 to use the web interface"