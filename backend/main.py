import os
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY")
FRONTEND_URL = os.getenv("FRONTEND_URL")

try:
    if not GOOGLE_API_KEY:
        raise ValueError("GEMINI_API_KEY environment variable not set!")
    genai.configure(api_key=GOOGLE_API_KEY)
except Exception as e:
    logger.error(f"Error configuring Google GenAI SDK: {e}")

app = FastAPI()

origins = [ "http://localhost:8000" ]
if FRONTEND_URL:
    app_domain = FRONTEND_URL.split('//')[1]
    origins.append(FRONTEND_URL)
    origins.append(f"https://{app_domain.split('.')[0]}.ondigitalocean.app")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel): message: str; isFirstUserMessage: bool; chatId: str

@app.get("/")
def read_root(): return {"Status": "DoLegal Backend is running"}

@app.post("/api/chat")
async def handle_chat(request: ChatRequest):
    if not GOOGLE_API_KEY: raise HTTPException(status_code=500, detail="AI service is not configured.")
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = await model.generate_content_async(request.message)
        new_title = None
        if request.isFirstUserMessage:
            title_prompt = f"Generate a very short, concise title (3-5 words max) for a legal conversation starting with: '{request.message}'. Use the same language."
            title_response = await model.generate_content_async(title_prompt)
            new_title = title_response.text.strip().replace('"', '')
        return {
            "responseText": response.text,
            "citations": ["Armenian Civil Code, Article 123", "Law on Legal Acts, Section 4"],
            "newTitle": new_title,
            "chatId": request.chatId,
        }
    except Exception as e:
        logger.error(f"Error during AI chat generation: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to get response from AI model.")
