import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  Send, 
  X, 
  MessageSquare, 
  Bot, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw,
  TrendingUp,
  Briefcase,
  Layers,
  MapPin
} from "lucide-react";
import { AIHelpMessage } from "../types";

export default function AIConversationalAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIHelpMessage[]>([
    {
      id: "init",
      sender: "ai",
      text: "Welcome to **EVENTRA Intelligent Hub**! I am your AI event consultant. Let me assist you in drafting budgets, creating comprehensive timelines, suggesting keynote speakers, or evaluating venue risk strategies. \n\nSelect a preset shortcut below to begin or type any custom prompt.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    setErrorText(null);
    const userMsg: AIHelpMessage = {
      id: Math.random().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Send previous messages for conversational memory context
      const chatHistory = [...messages, userMsg].slice(-8); // Limit history size
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Internal Server Error");
      }

      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        sender: "ai",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

    } catch (err: any) {
      setErrorText(err.message || "Something went wrong.");
      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        sender: "ai",
        text: "⚠️ **Error:** I was unable to connect to the Gemini API engine. Please verify your `GEMINI_API_KEY` is configured correctly inside **Secrets**.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    { text: "Draft executive budget for 500 people", category: "Budget", icon: Briefcase },
    { text: "Suggest 3 AI speakers for Keynote Summit", category: "Speakers", icon: Sparkles },
    { text: "Create marketing timeline for a university hackathon", category: "Marketing", icon: Layers },
    { text: "Suggest venue logistics for Moscone Hall B", category: "Venue", icon: MapPin }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded assistant panel */}
      {isOpen && (
        <div 
          id="ai-assistant-panel"
          className="w-80 sm:w-96 h-[500px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col mb-4 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-250"
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-sans font-bold text-sm text-slate-100 flex items-center">
                  Eventra Copilot
                  <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] bg-blue-500/15 text-blue-400 font-mono font-medium tracking-wider uppercase">Flash-3.5</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono block leading-none">Status: Live Engine</span>
              </div>
            </div>
            <button 
              id="ai-close-btn"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar bg-slate-950/25">
            {messages.map((msg) => {
              const isAI = msg.sender === "ai";
              return (
                <div 
                  key={msg.id} 
                  className={`flex items-start space-x-2.5 max-w-[85%] ${isAI ? "" : "ml-auto flex-row-reverse space-x-reverse"}`}
                >
                  {isAI && (
                    <div className="w-6 h-6 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                  )}
                  <div 
                    className={`rounded-2xl px-3.5 py-2.5 text-xs font-sans leading-relaxed
                      ${isAI 
                        ? "bg-slate-900 border border-slate-800 text-slate-300 rounded-tl-sm" 
                        : "bg-blue-600 text-white rounded-tr-sm"}`}
                  >
                    <div className="whitespace-pre-line prose prose-invert prose-xs">
                      {msg.text}
                    </div>
                    <span className="text-[9px] font-mono opacity-50 block mt-1.5 text-right">{msg.timestamp}</span>
                  </div>
                </div>
              );
            })}

            {/* Loading / Typing effect */}
            {isLoading && (
              <div className="flex items-start space-x-2.5 max-w-[85%]">
                <div className="w-6 h-6 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-sm px-3.5 py-3 text-xs text-slate-400 flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}

            {errorText && (
              <div className="p-3 bg-red-950/25 border border-red-900/30 rounded-2xl flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-[11px] font-sans text-red-400 block font-semibold">Engine Pipeline Interrupted</span>
                  <p className="text-[10px] font-sans text-slate-400 mt-0.5 leading-relaxed">{errorText}</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick presets (only show when no user messages sent yet, or as suggestions) */}
          <div className="px-4 py-2 bg-slate-950/10 border-t border-slate-850 flex flex-wrap gap-1.5 max-h-32 overflow-y-auto custom-scrollbar">
            {suggestions.map((sug, i) => {
              const Icon = sug.icon;
              return (
                <button
                  key={i}
                  onClick={() => handleSendMessage(sug.text)}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-full text-[10px] font-sans font-medium text-slate-400 hover:text-slate-200 transition-all flex items-center space-x-1"
                >
                  <Icon className="w-3 h-3 text-blue-400" />
                  <span>{sug.category}</span>
                </button>
              );
            })}
          </div>

          {/* Form */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="p-3 border-t border-slate-800 bg-slate-950/40 flex items-center space-x-2"
          >
            <input
              id="ai-prompt-input"
              type="text"
              placeholder="Ask for schedule recommendations..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-sans text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 disabled:opacity-50"
            />
            <button
              id="ai-send-btn"
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/10 hover:shadow-blue-600/20 disabled:opacity-50 transition-all flex items-center justify-center flex-shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Trigger floating action button */}
      <button
        id="ai-assistant-toggle"
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all relative border border-blue-500/20"
        title="Open Eventra AI Companion"
      >
        {isOpen ? (
          <X className="w-5 h-5 animate-in spin-in-90 duration-200" />
        ) : (
          <div className="relative">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
          </div>
        )}
      </button>
    </div>
  );
}
