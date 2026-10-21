'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../lib/types';
import { sendChatMessage } from '../lib/api';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  ExternalLink,
  ShieldAlert,
  BookOpen,
  ArrowRight,
  HelpCircle,
  Copy,
  Check,
} from 'lucide-react';

interface AiChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiChatWidget: React.FC<AiChatWidgetProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      content:
        'Akwaaba! I am your Antigravity Academic & Placement Copilot. Ask me about official CSSPS secondary placement rules, Category A cut-off standards, BECE raw score computations, or TVET technical pathways.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      disclaimer: 'This system provides academic guidance and cannot guarantee CSSPS placements.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async (queryText?: string) => {
    const q = (queryText || input).trim();
    if (!q || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sender: 'user',
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await sendChatMessage(q);
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        sender: 'assistant',
        content: res.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: res.sources,
        disclaimer: res.disclaimer,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        sender: 'assistant',
        content:
          'I encountered an issue connecting to the AI policy knowledge base. Please try asking again shortly.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-[#070b14]/98 backdrop-blur-2xl border-l border-white/10 shadow-[0_0_60px_-15px_rgba(0,0,0,0.9)] flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between bg-black/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-emerald-400 to-teal-500 p-[1.5px] shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-[#080d1a] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white">Antigravity Copilot</h3>
              <span className="px-1.5 py-0.2 text-[9px] font-extrabold uppercase rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                pgvector RAG
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Grounded in official GES & CSSPS policy briefs
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors"
          aria-label="Close AI Guide"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Mandatory CSSPS Compliance Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-amber-200/90 leading-tight">
          <strong>Mandatory Compliance Notice:</strong> Answers are retrieved strictly from verified policy documents. This AI guide <strong>cannot guarantee</strong> CSSPS school placements or admissions.
        </p>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-1 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-3xl p-4 text-xs ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold rounded-tr-none shadow-md shadow-emerald-500/15'
                  : 'bg-black/60 border border-white/[0.08] text-slate-200 rounded-tl-none shadow-md'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="whitespace-pre-line leading-relaxed font-normal">{m.content}</p>
                {m.sender === 'assistant' && (
                  <button
                    type="button"
                    onClick={() => handleCopyMessage(m.id, m.content)}
                    className="p-1 rounded text-slate-400 hover:text-white transition-colors"
                    title="Copy response"
                  >
                    {copiedId === m.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 opacity-60 hover:opacity-100" />
                    )}
                  </button>
                )}
              </div>

              {/* Source Citations with Match Confidence */}
              {m.sources && m.sources.length > 0 && (
                <div className="mt-3.5 pt-3 border-t border-white/[0.08]">
                  <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block mb-1.5 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    Verified Policy Citations:
                  </span>
                  <div className="space-y-1.5">
                    {m.sources.map((s, idx) => (
                      <a
                        key={idx}
                        href={s.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 text-[11px] text-emerald-400 transition-colors"
                      >
                        <span className="truncate font-semibold max-w-[240px]">
                          {s.title || s.source_url}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                          {s.similarity_score && (
                            <span className="text-emerald-400 font-bold">
                              {Math.round(s.similarity_score * 100)}% match
                            </span>
                          )}
                          <ExternalLink className="w-3 h-3 text-slate-500" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <span
                className={`text-[9px] block text-right mt-2 font-medium ${
                  m.sender === 'user' ? 'text-slate-900/70' : 'text-slate-500'
                }`}
              >
                {m.timestamp}
              </span>
            </div>

            {m.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 flex-shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 items-center text-slate-400 text-xs">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 bg-black/60 border border-white/10 rounded-2xl rounded-tl-none flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] text-slate-400 font-medium ml-1">
                Querying pgvector policy embeddings...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Inquiry Chips */}
      <div className="px-4 py-2.5 border-t border-white/[0.06] bg-black/40 overflow-x-auto no-scrollbar flex items-center gap-2">
        {[
          'How is BECE raw score computed?',
          'What are Category A school criteria?',
          'How does the 30% public school quota work?',
          'Are there STEM scholarships for girls?',
        ].map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="text-[10px] font-bold whitespace-nowrap px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-emerald-500/15 border border-white/5 hover:border-emerald-500/30 text-slate-300 hover:text-emerald-300 transition-all flex items-center gap-1"
          >
            <span>{prompt}</span>
            <ArrowRight className="w-2.5 h-2.5 opacity-60" />
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-white/[0.08] bg-black/70">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about CSSPS placement or BECE..."
            className="flex-1 px-4 py-2.5 text-xs font-semibold rounded-2xl bg-black/60 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black hover:brightness-110 active:scale-95 disabled:opacity-40 transition-all"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
