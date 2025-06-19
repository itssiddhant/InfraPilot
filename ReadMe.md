### 🔍 RCA Engine with Suggested Fixes

This module accepts log entries and returns an automated Root Cause Analysis (RCA) summary, along with an LLM-generated fix.

#### 📦 Dependencies
- FastAPI
- SQLAlchemy
- Ollama (local LLM runner) with model `mistral` loaded

#### 🔧 Setup
1. Install requirements:
   ```bash
   pip install -r requirements.txt
   ```
2. Start the Ollama Model:
   ```bash
   ollama run mistral
   ```
3. Run the Backend:
   ```bash
   uvicorn main:app --reload
   ```