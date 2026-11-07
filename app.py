from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_mistralai import ChatMistralAI
from langchain_core.messages import AIMessage, SystemMessage, HumanMessage
import os

load_dotenv()

app = FastAPI(title="Mistral Chatbot UI")

# Initialize ChatMistralAI model as in chat_bot.py
model = ChatMistralAI(
    model="ministral-3b-2512",
    temperature=0.5
)

# Maintain conversation messages history
messages = [
    SystemMessage(content="you are a funny ai agent")
]

class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat")
async def chat_endpoint(req: ChatRequest):
    global messages
    user_msg = req.message.strip()
    if not user_msg:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    if user_msg == "0":
        # Reset or handle exit signal if needed
        return {"response": "Goodbye! Chat reset.", "reset": True}

    try:
        messages.append(HumanMessage(content=user_msg))
        response = model.invoke(messages)
        ai_content = response.content
        messages.append(AIMessage(content=ai_content))
        return {"response": ai_content, "reset": False}
    except Exception as e:
        # Fallback or error detail
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/reset")
async def reset_chat():
    global messages
    messages = [
        SystemMessage(content="you are a funny ai agent")
    ]
    return {"status": "reset success"}

# Serve static files from 'ui' directory
ui_dir = os.path.join(os.path.dirname(__file__), "ui")
if os.path.exists(ui_dir):
    app.mount("/static", StaticFiles(directory=ui_dir), name="static")

    @app.get("/")
    async def read_index():
        return FileResponse(os.path.join(ui_dir, "index.html"))
else:
    @app.get("/")
    async def read_index():
        return {"error": "ui directory not found"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
