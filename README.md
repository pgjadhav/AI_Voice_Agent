ai_voice_agent/
│
├── app/
│   ├── main.py                # FastAPI entry point
│   ├── routes/
│   │   └── chat.py            # API endpoints
│   │
│   ├── services/
│   │   ├── rag_service.py     # RAG pipeline
│   │   ├── llm_service.py     # Gemini calls
│   │   ├── stt_service.py     # Speech-to-text
│   │   ├── tts_service.py     # Text-to-speech
│   │
│   ├── core/
│   │   ├── config.py          # API keys & config
│   │   ├── prompts.py         # Prompt templates
│   │
│   ├── data/
│   │   └── documents/         # Your RAG data
│   │
│   ├── vectorstore/
│   │   └── faiss_index/       # Saved embeddings
│
├── scripts/
│   └── ingest.py              # Create embeddings
│
├── requirements.txt
└── README.md


>> MAHARSHI ACCOUNT
GEMINI_API = "AIzaSyA6UF1UG-o5F0bYUONFMn__BnoMsOay0cs"
NAME : Voice_Agent_Api


User Query
   ↓
Embedding
   ↓
FAISS Search
   ↓
Top Documents
   ↓
Prompt + Context
   ↓
Gemini LLM
   ↓
Final Answer

uvicorn app.main:app --reload
Frontend → http://localhost:5173
Backend → http://127.0.0.1:8000


app_tsx 

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Send, Volume2, VolumeX } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
};

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hello! I am Prashant's AI voice assistant. Ask me anything about Prashant.",
      timestamp: new Date(),
    },
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // 🔽 Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🎤 Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;

      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setInput(text);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  // 🔊 Text-to-Speech
  const speak = (text: string) => {
    if (!voiceEnabled) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  // 🎤 Toggle mic
  const toggleRecording = () => {
    if (!recognitionRef.current) return alert("Speech not supported");

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }

    setIsRecording(!isRecording);
  };

  // 🚀 SEND MESSAGE (CONNECTED TO YOUR BACKEND)
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: input }),
      });

      const data = await response.json();

      const aiMessage: Message = {
        role: "assistant",
        text: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      // 🔊 Speak response
      speak(data.response);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Error connecting to backend.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* HEADER */}
      <div style={{ padding: 15, background: "#111", color: "#fff" }}>
        <h2>🎤 AI Voice Agent</h2>
        <button onClick={() => setVoiceEnabled(!voiceEnabled)}>
          {voiceEnabled ? "🔊 Voice ON" : "🔇 Voice OFF"}
        </button>
      </div>

      {/* CHAT */}
      <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.role === "user" ? "right" : "left",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: 10,
                borderRadius: 10,
                background:
                  msg.role === "user" ? "#4f46e5" : "#e5e7eb",
                color: msg.role === "user" ? "white" : "black",
                maxWidth: "70%",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isLoading && <p>AI is thinking...</p>}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div style={{ padding: 15, borderTop: "1px solid #ccc" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask something..."
          style={{ width: "70%", padding: 10 }}
        />

        <button onClick={toggleRecording} style={{ marginLeft: 10 }}>
          {isRecording ? <MicOff /> : <Mic />}
        </button>

        <button onClick={sendMessage} style={{ marginLeft: 10 }}>
          <Send />
        </button>
      </div>
    </div>
  );
}

export default App;