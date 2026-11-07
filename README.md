# Basic Generative Text Generation Chatbot Using Multiple Providers

## 📖 Overview

This repository contains a **light‑weight, enterprise‑grade chatbot** built on top of a **FastAPI** backend that can talk to multiple LLM providers (Mistral, OpenRouter, HuggingFace, etc.) and a **modern, Claude‑style UI** that launches via a double‑click on `index.html` or the convenience batch file `Launch Chatbot.bat`.

The UI is **minimalist, responsive, and fully theme‑light**, with a persona selector that lets you switch the system prompt on‑the-fly (funny, angry, sad). All chat history is stored locally in the browser (via `localStorage`) and can be re‑opened from the sidebar.

---

## 🚀 Live Demo

Experience the live interactive application directly in your browser:
🔗 **[https://prathambaraskar.github.io/Basic-Generative-Text-Generation-Chatbot-Using-Multiple-Providers/](https://prathambaraskar.github.io/Basic-Generative-Text-Generation-Chatbot-Using-Multiple-Providers/)**

---

## ✨ Features

| Feature | Description |
|---|---|
| **Multiple providers** | `chatmodels/` contains adapters for **Mistral**, **OpenRouter**, **HuggingFace**, and **local models**. You can drop in a new provider by adding a class that follows the same interface. |
| **Persona selector** | Choose a system prompt (funny, angry, sad) and the backend automatically updates the system message before the next request. |
| **Zero‑setup UI launch** | Double‑click `ui/index.html` (or run `Launch Chatbot.bat`) – no terminal command needed. |
| **Persisted chat history** | Recent chats are stored in the browser and can be re‑loaded from the sidebar. |
| **Responsive layout** | Works on desktop and mobile – the sidebar collapses on small screens. |
| **Enterprise‑ready styling** | Uses Google Fonts, CSS variables, subtle shadows, hover lifts, and accessible colour contrast. |
| **Automated repository creation** | The repo is created public with an MIT licence, ready for CI/CD pipelines. |

---

## 🏗️ Architecture

```
project-root/
│
├─ app.py                     # FastAPI entry‑point (served by uvicorn if needed)
├─ ui/
│   ├─ index.html            # Main UI page (no build step required)
│   ├─ style.css             # Light‑theme, responsive stylesheet
│   └─ script.js             # Front‑end logic – direct Mistral API calls
│
├─ chatmodels/                # Provider adapters (Mistral, OpenRouter, HuggingFace, local)
│   ├─ chat.py               # Base abstract class
│   ├─ chat_bot.py           # Example cli‑style chatbot (used for reference)
│   ├─ huggingface.py        # HuggingFace 🤗 integration
│   ├─ localmodel.py         # Local model wrapper
│   └─ openrouter_chat.py    # OpenRouter integration
│
├─ embeddingmodels/            # Embedding adapters (future extensions)
│   ├─ embeddings.py
│   └─ huggingface_embeddings.py
│
├─ requirements.txt           # Python dependencies
├─ Launch Chatbot.bat         # Convenience batch file to open the UI
├─ notes.txt                  # Project notes & todo list
└─ README.md                  # *(this file)*
```

### Backend Flow
1. The UI talks directly to the **Mistral API** (or any other provider you configure in `script.js`).
2. A **system message** is built from the selected persona and stored as the first element of `conversationMessages`.
3. Each user message is appended to the array and sent as a single request to the provider, preserving full context.
4. Responses are rendered in the message pane with animated typing indicators.

### Front‑end Flow
1. On first load the landing hero displays a greeting and the centred input box.
2. Submitting a message (Enter or send button) hides the hero, shows the chat view and the bottom input.
3. Recent chats are saved to `localStorage` and rendered in the sidebar for quick recall.
4. The persona selector updates the system prompt on‑the‑fly without a page reload.

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.14+** (the repository includes a `requirements.txt` that works on Windows/macOS/Linux).
- **Git** and **GitHub CLI** (`gh`) – both are already installed in the sandbox.
- **Internet access** – the UI makes direct calls to the selected LLM provider.

### Installation
```bash
# Clone the repository (once it exists – see the next section for repo creation)
git clone https://github.com/<your‑username>/Basic-Generative-Text-Generation-Chatbot-Using-Multiple-Providers.git
cd Basic-Generative-Text-Generation-Chatbot-Using-Multiple-Providers

# Create a virtual environment (recommended)
python -m venv .venv
.venv\Scripts\activate  # on Windows
# source .venv/bin/activate  # on macOS/Linux

# Install Python dependencies
pip install -r requirements.txt
```

### Environment Variables
Create a `.env` file in the project root (or add the variables to your system) with the required API keys:
```dotenv
MISTRAL_API_KEY=your‑mistral‑key
OPENROUTER_API_KEY=your‑openrouter‑key   # optional – used by openrouter_chat.py
HUGGINGFACE_API_TOKEN=your‑hf‑token   # optional – used by huggingface adapters
```

### Running the UI
- **Option 1 – Double‑click**: Open Windows Explorer, navigate to `ui/` and double‑click `index.html`.  The page opens in your default browser and is ready to chat.
- **Option 2 – Batch file**: Double‑click `Launch Chatbot.bat` from the repo root – it launches the same page.

> **Note**: The UI talks directly to the LLM endpoint; no local server is required unless you want to serve the UI via FastAPI (`app.py`).

### Running the FastAPI backend (optional)
If you prefer to proxy the requests through FastAPI (e.g., for logging or rate‑limit handling):
```bash
uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```
Update `script.js` to point to `http://127.0.0.1:8000/api/chat` instead of the direct provider URL.

---

## 🛠️ Adding a New Provider
1. **Create a new file** in `chatmodels/` that subclasses `ChatBase` (see `chat.py`).
2. Implement the `generate(messages: List[Message]) -> str` method using the provider’s SDK or REST API.
3. Export the class in `__init__.py` (if you create one) and import it in `app.py` or any custom script.
4. Update `ui/script.js` to point to the new endpoint (or change the `API_URL` constant).

---

## 📄 License

This project is released under the **MIT License** – see `LICENSE` for full text.

---

## 📚 Additional Resources
- **Mistral API Docs**: https://docs.mistral.ai/
- **OpenRouter Docs**: https://openrouter.ai/docs
- **HuggingFace Transformers**: https://huggingface.co/docs/transformers
- **FastAPI Documentation**: https://fastapi.tiangolo.com/

---

## 🤝 Contributing
Contributions are welcome! Feel free to open issues, submit pull requests, or suggest new providers. When adding a provider, please update the `README` with usage instructions.
