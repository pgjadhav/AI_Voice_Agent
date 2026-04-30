import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Send, Volume2, VolumeX, Sparkles } from "lucide-react";

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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --gradient-1: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          --gradient-2: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          --gradient-3: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          --gradient-glow: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
          
          --bg-main: #0f0f23;
          --bg-card: #1a1a2e;
          --bg-elevated: #16213e;
          --bg-input: rgba(255, 255, 255, 0.03);
          
          --text-primary: #ffffff;
          --text-secondary: #a0a0c0;
          --text-muted: #6b6b8e;
          
          --border: rgba(255, 255, 255, 0.08);
          --border-focus: rgba(102, 126, 234, 0.4);
          
          --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.2);
          --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.3);
          --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.4);
          --shadow-glow: 0 0 40px rgba(102, 126, 234, 0.3);
        }

        body {
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          background: var(--bg-main);
          color: var(--text-primary);
          overflow: hidden;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .app-container {
          height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
          background: 
            radial-gradient(ellipse 100% 60% at 50% -10%, rgba(102, 126, 234, 0.12), transparent 70%),
            radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.08), transparent 50%),
            var(--bg-main);
        }

        /* Animated background orbs */
        .background-orbs {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
          pointer-events: none;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
          animation: float 20s ease-in-out infinite;
        }

        .orb-1 {
          width: 500px;
          height: 500px;
          background: var(--gradient-1);
          top: -250px;
          left: -250px;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 400px;
          height: 400px;
          background: var(--gradient-2);
          bottom: -200px;
          right: -200px;
          animation-delay: 7s;
        }

        .orb-3 {
          width: 300px;
          height: 300px;
          background: var(--gradient-3);
          top: 50%;
          right: 10%;
          animation-delay: 14s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        /* Header */
        .header {
          position: relative;
          z-index: 10;
          padding: 1.5rem 2rem;
          background: rgba(26, 26, 46, 0.7);
          backdrop-filter: blur(30px) saturate(180%);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .brand-icon {
          width: 48px;
          height: 48px;
          background: var(--gradient-1);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-glow);
          position: relative;
          animation: brandPulse 4s ease-in-out infinite;
        }

        @keyframes brandPulse {
          0%, 100% { transform: scale(1); box-shadow: var(--shadow-glow); }
          50% { transform: scale(1.05); box-shadow: 0 0 60px rgba(102, 126, 234, 0.5); }
        }

        .brand-icon::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: var(--gradient-1);
          border-radius: 16px;
          z-index: -1;
          opacity: 0.3;
          filter: blur(10px);
        }

        .brand-text h1 {
          font-family: 'Outfit', sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          background: var(--gradient-1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.02em;
        }

        .brand-text p {
          font-size: 0.813rem;
          color: var(--text-secondary);
          margin-top: 2px;
          font-weight: 500;
        }

        .voice-control {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.625rem 1.25rem;
          background: var(--bg-input);
          border: 1.5px solid var(--border);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .voice-control:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: var(--border-focus);
          transform: translateY(-2px);
        }

        .voice-control.active {
          background: var(--gradient-glow);
          border-color: rgba(102, 126, 234, 0.5);
          color: var(--text-primary);
        }

        .voice-control svg {
          width: 18px;
          height: 18px;
        }

        /* Messages Container */
        .messages-wrapper {
          flex: 1;
          position: relative;
          z-index: 1;
          overflow: hidden;
        }

        .messages-container {
          height: 100%;
          overflow-y: auto;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .messages-container::-webkit-scrollbar {
          width: 6px;
        }

        .messages-container::-webkit-scrollbar-track {
          background: transparent;
        }

        .messages-container::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        .messages-container::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        /* Message */
        .message {
          display: flex;
          gap: 1rem;
          animation: messageSlide 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          max-width: 85%;
        }

        @keyframes messageSlide {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message.user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .message.assistant {
          align-self: flex-start;
        }

        .avatar {
          width: 42px;
          height: 42px;
          border-radius: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-weight: 700;
          font-size: 0.875rem;
          letter-spacing: 0.02em;
          position: relative;
        }

        .avatar.user {
          background: var(--gradient-2);
          color: white;
          box-shadow: 0 4px 16px rgba(245, 87, 108, 0.3);
        }

        .avatar.assistant {
          background: var(--gradient-1);
          color: white;
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
        }

        .message-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .message-bubble {
          padding: 1rem 1.25rem;
          border-radius: 18px;
          line-height: 1.6;
          font-size: 0.938rem;
          word-wrap: break-word;
          position: relative;
          backdrop-filter: blur(10px);
        }

        .message.user .message-bubble {
          background: linear-gradient(135deg, rgba(240, 147, 251, 0.15) 0%, rgba(245, 87, 108, 0.15) 100%);
          border: 1.5px solid rgba(245, 87, 108, 0.2);
          border-top-right-radius: 4px;
          box-shadow: var(--shadow-sm);
        }

        .message.assistant .message-bubble {
          background: rgba(26, 26, 46, 0.6);
          border: 1.5px solid var(--border);
          border-top-left-radius: 4px;
          box-shadow: var(--shadow-sm);
        }

        .message-time {
          font-size: 0.75rem;
          color: var(--text-muted);
          padding: 0 0.5rem;
          font-weight: 500;
        }

        .message.user .message-time {
          text-align: right;
        }

        /* Loading */
        .loading-message {
          display: flex;
          gap: 1rem;
          align-self: flex-start;
          max-width: 85%;
        }

        .loading-dots {
          display: flex;
          gap: 0.5rem;
          padding: 1rem 1.25rem;
        }

        .loading-dot {
          width: 8px;
          height: 8px;
          background: var(--gradient-1);
          border-radius: 50%;
          animation: loadingBounce 1.4s ease-in-out infinite;
        }

        .loading-dot:nth-child(1) { animation-delay: -0.32s; }
        .loading-dot:nth-child(2) { animation-delay: -0.16s; }
        .loading-dot:nth-child(3) { animation-delay: 0s; }

        @keyframes loadingBounce {
          0%, 80%, 100% { 
            transform: scale(0.6);
            opacity: 0.5;
          }
          40% { 
            transform: scale(1);
            opacity: 1;
          }
        }

        /* Input Area */
        .input-area {
          position: relative;
          z-index: 10;
          padding: 2rem;
          background: rgba(26, 26, 46, 0.7);
          backdrop-filter: blur(30px) saturate(180%);
          border-top: 1px solid var(--border);
        }

        .input-wrapper {
          max-width: 1100px;
          margin: 0 auto;
        }

        .input-container {
          display: flex;
          gap: 0.75rem;
          align-items: flex-end;
          background: var(--bg-input);
          border: 2px solid var(--border);
          border-radius: 20px;
          padding: 1rem 1.25rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .input-container::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: var(--gradient-1);
          border-radius: 22px;
          opacity: 0;
          transition: opacity 0.3s;
          z-index: -1;
          filter: blur(8px);
        }

        .input-container:focus-within {
          border-color: var(--border-focus);
          background: rgba(255, 255, 255, 0.05);
        }

        .input-container:focus-within::before {
          opacity: 0.2;
        }

        .input-container.recording {
          border-color: rgba(245, 87, 108, 0.5);
          animation: recordingPulse 2s ease-in-out infinite;
        }

        @keyframes recordingPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245, 87, 108, 0.4); }
          50% { box-shadow: 0 0 0 12px rgba(245, 87, 108, 0); }
        }

        .text-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-size: 0.938rem;
          line-height: 1.5;
          resize: none;
          max-height: 120px;
          font-family: inherit;
          font-weight: 500;
        }

        .text-input::placeholder {
          color: var(--text-muted);
        }

        .input-actions {
          display: flex;
          gap: 0.625rem;
          align-items: center;
        }

        .action-button {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          border: none;
          background: var(--bg-elevated);
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0;
          position: relative;
        }

        .action-button:hover:not(:disabled) {
          background: var(--gradient-1);
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }

        .action-button:active:not(:disabled) {
          transform: translateY(-1px);
        }

        .action-button.recording {
          background: var(--gradient-2);
          color: white;
          animation: micPulse 1.5s ease-in-out infinite;
        }

        @keyframes micPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245, 87, 108, 0.5); }
          50% { box-shadow: 0 0 0 10px rgba(245, 87, 108, 0); }
        }

        .action-button.send {
          background: var(--gradient-1);
          color: white;
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
        }

        .action-button.send:hover:not(:disabled) {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 12px 28px rgba(102, 126, 234, 0.5);
        }

        .action-button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .action-button:disabled:hover {
          transform: none;
          background: var(--bg-elevated);
          box-shadow: none;
        }

        .action-button svg {
          width: 20px;
          height: 20px;
        }

        /* Recording indicator */
        .recording-indicator {
          position: absolute;
          bottom: -2.5rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.625rem 1.25rem;
          background: rgba(245, 87, 108, 0.15);
          border: 1.5px solid rgba(245, 87, 108, 0.3);
          border-radius: 24px;
          font-size: 0.813rem;
          color: #f5576c;
          font-weight: 600;
          animation: slideUp 0.3s ease-out;
          backdrop-filter: blur(10px);
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        .recording-pulse {
          width: 8px;
          height: 8px;
          background: #f5576c;
          border-radius: 50%;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .header {
            padding: 1rem 1.25rem;
          }

          .brand-icon {
            width: 40px;
            height: 40px;
          }

          .brand-text h1 {
            font-size: 1.25rem;
          }

          .brand-text p {
            font-size: 0.75rem;
          }

          .voice-control {
            padding: 0.5rem 1rem;
            font-size: 0.813rem;
          }

          .messages-container {
            padding: 1.25rem;
          }

          .message {
            max-width: 95%;
          }

          .input-area {
            padding: 1.25rem;
          }

          .orb {
            filter: blur(60px);
          }
        }
      `}</style>

      <div className="app-container">
        {/* Background orbs */}
        <div className="background-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>

        {/* HEADER */}
        <div className="header">
          <div className="brand">
            <div className="brand-icon">
              <Sparkles size={24} />
            </div>
            <div className="brand-text">
              <h1>Prashant's Asistant</h1>
              {/* <p>Personal Assistant</p> */}
            </div>
          </div>

          <div
            className={`voice-control ${voiceEnabled ? "active" : ""}`}
            onClick={() => setVoiceEnabled(!voiceEnabled)}
          >
            {voiceEnabled ? <Volume2 /> : <VolumeX />}
            <span>{voiceEnabled ? "Voice On" : "Voice Off"}</span>
          </div>
        </div>

        {/* CHAT */}
        <div className="messages-wrapper">
          <div className="messages-container">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.role}`}>
                <div className={`avatar ${msg.role}`}>
                  {msg.role === "user" ? "You" : "AI"}
                </div>
                <div className="message-content">
                  <div className="message-bubble">{msg.text}</div>
                  <div className="message-time">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="loading-message">
                <div className="avatar assistant">AI</div>
                <div className="message-content">
                  <div className="message-bubble">
                    <div className="loading-dots">
                      <div className="loading-dot"></div>
                      <div className="loading-dot"></div>
                      <div className="loading-dot"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* INPUT */}
        <div className="input-area">
          <div className="input-wrapper">
            {isRecording && (
              <div className="recording-indicator">
                <div className="recording-pulse"></div>
                <span>Listening...</span>
              </div>
            )}

            <div
              className={`input-container ${isRecording ? "recording" : ""}`}
            >
              <textarea
                className="text-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={
                  isRecording
                    ? "Listening to your voice..."
                    : "Ask anything about Prashant..."
                }
                rows={1}
                disabled={isRecording}
              />

              <div className="input-actions">
                <button
                  className={`action-button ${isRecording ? "recording" : ""}`}
                  onClick={toggleRecording}
                  disabled={isLoading}
                  title={isRecording ? "Stop recording" : "Start recording"}
                >
                  {isRecording ? <MicOff /> : <Mic />}
                </button>

                <button
                  className="action-button send"
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  title="Send message"
                >
                  <Send />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;