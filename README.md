# 🎙️ Voice Agent

> An intelligent, AI-powered voice assistant that combines cutting-edge speech recognition, natural language processing, and retrieval-augmented generation (RAG) for context-aware conversations.

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.136+-green?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6+-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## ✨ Features

- 🎤 **Real-time Voice Input** - Seamless speech-to-text conversion using Vosk
- 🤖 **AI-Powered Responses** - Powered by Google Gemini API with intelligent temperature control
- 📚 **RAG Integration** - Retrieval-Augmented Generation for knowledge-aware responses
- ⚡ **Smart Caching** - Optimized query caching for faster repeated responses
- 💬 **Natural Chat Interface** - Modern, responsive React frontend with Vite
- 🔊 **Text-to-Speech** - Convert AI responses back to natural-sounding audio
- 🔒 **CORS Enabled** - Secure cross-origin resource sharing setup
- 📦 **FAISS Vector Store** - Efficient semantic search and document retrieval

---

## 🏗️ Architecture

```
Voice Agent
├── Backend (FastAPI)
│   ├── LLM Services (Google Gemini)
│   ├── Speech-to-Text (Vosk)
│   ├── Text-to-Speech
│   ├── RAG Pipeline
│   ├── Caching Layer
│   └── Vector Database (FAISS)
│
├── Frontend (React + TypeScript)
│   ├── Interactive Chat UI
│   ├── Voice Input Controls
│   └── Real-time Response Display
│
└── Data Pipeline
    ├── Document Ingestion
    ├── Embedding Generation
    └── Vector Store Management
```

---

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- pip & npm

### Backend Setup

1. **Clone and navigate to project:**
   ```bash
   cd "e:\prashant Jadhav\Voice Agent"
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv venv
   .\venv\Scripts\Activate.ps1  # Windows PowerShell
   # or
   source venv/bin/activate     # macOS/Linux
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   # Create .env file in app/ directory
   echo GEMINI_API_KEY=your_api_key_here > app/.env
   ```

5. **Start FastAPI server:**
   ```bash
   cd app
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. **Navigate to frontend:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

```
Voice Agent/
├── app/
│   ├── main.py                 # FastAPI application entry point
│   ├── core/
│   │   ├── config.py          # Configuration & secrets
│   │   ├── cache.py           # Query caching logic
│   │   ├── embeddings.py      # Embedding generation
│   │   └── prompts.py         # Prompt templates
│   ├── data/
│   │   └── documents/         # Source documents for RAG
│   ├── models/
│   │   └── vosk/              # Vosk speech recognition models
│   ├── services/
│   │   ├── llm_service.py     # Google Gemini LLM integration
│   │   ├── rag_service.py     # RAG pipeline
│   │   ├── stt_service.py     # Speech-to-text service
│   │   └── tts_service.py     # Text-to-speech service
│   ├── routes/
│   │   └── chat.py            # Chat API endpoints
│   └── vectorstore/
│       └── faiss_index/       # FAISS vector database
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx            # Main React component
│   │   ├── main.tsx           # React entry point
│   │   └── components/        # Reusable UI components
│   ├── public/                # Static assets
│   ├── package.json           # Node dependencies
│   ├── vite.config.ts         # Vite configuration
│   └── tsconfig.json          # TypeScript configuration
│
├── scripts/
│   └── ingest.py              # Document ingestion for RAG
│
└── requirements.txt           # Python dependencies
```

---

## 🔧 Key Technologies

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **LangChain** - LLM orchestration and RAG pipeline
- **Google Gemini API** - State-of-the-art language model
- **Vosk** - Offline speech-to-text recognition
- **FAISS** - Efficient similarity search and clustering
- **Sentence Transformers** - High-quality embeddings

### Frontend
- **React 19** - UI library with latest features
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next-generation build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

---

## 📖 API Documentation

Once the backend is running, interactive API docs are available at:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Example Endpoints

**Chat Endpoint:**
```bash
POST /chat
Content-Type: application/json

{
  "query": "What is artificial intelligence?",
  "context": "Retrieved from documents"
}
```

**Response:**
```json
{
  "response": "Artificial Intelligence refers to...",
  "cached": false,
  "processing_time": 1.23
}
```

---

## 🎯 How It Works

1. **User speaks** into the microphone
2. **Speech-to-Text** (Vosk) converts audio to text
3. **RAG Engine** retrieves relevant documents from vector store
4. **LLM** (Gemini) generates context-aware response
5. **Caching Layer** stores query for future optimization
6. **Text-to-Speech** converts response back to audio
7. **Frontend** displays text and plays audio response

---

## 🔄 Data Ingestion Pipeline

To add your own documents for RAG:

```bash
python scripts/ingest.py --path app/data/documents/
```

This will:
- Read documents from `app/data/documents/`
- Generate embeddings using Sentence Transformers
- Store in FAISS vector database
- Enable semantic search across documents

---

## ⚙️ Configuration

Edit `app/core/config.py` to customize:

```python
# API Keys
GEMINI_API_KEY = "your_key_here"

# LLM Settings
TEMPERATURE = 0.3              # Lower = more deterministic
MODEL_NAME = "gemini-2.5-flash-lite"

# Cache Settings
CACHE_TTL = 3600              # Cache time-to-live (seconds)

# Embedding Settings
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
```

---

## 🧪 Testing

Run tests for the backend:

```bash
pytest app/tests/

# With coverage
pytest --cov=app app/tests/
```

---

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Ensure backend CORS middleware is configured |
| Vosk not working | Download correct model for your language/OS |
| API Key errors | Verify GEMINI_API_KEY is set in `.env` |
| Slow responses | Check FAISS index size, increase cache TTL |

---

## 📊 Performance Metrics

- **STT Latency**: ~200-500ms (Vosk, offline)
- **LLM Response**: ~1-2s (Gemini API)
- **RAG Retrieval**: ~50-100ms (FAISS)
- **Cache Hit Rate**: Up to 80% for repeated queries

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙋 Support & Questions

- 📧 **Email**: [Your Email]
- 💬 **Issues**: [GitHub Issues](../../issues)
- 📚 **Documentation**: [Full Docs](./docs)

---

## 🔮 Future Enhancements

- [ ] Multi-language support
- [ ] Fine-tuned models for domain-specific queries
- [ ] Real-time streaming responses
- [ ] Conversation memory & context continuity
- [ ] Advanced document parsing (PDF, images)
- [ ] Custom voice models
- [ ] Integration with additional LLM providers

---

## 📈 Roadmap

**Q2 2026:**
- [ ] Production deployment guide
- [ ] Docker containerization
- [ ] CI/CD pipeline setup

**Q3 2026:**
- [ ] Mobile app support
- [ ] Advanced analytics dashboard
- [ ] User authentication

---

<div align="center">

### ⭐ If you find this project helpful, please give it a star!

Made with ❤️ by Prashant G Jadhav

[GitHub](https://github.com) •

</div>
