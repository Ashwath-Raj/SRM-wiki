"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { AIChatResponse, AISourceItem } from "@/types";
import { Sparkles, Send, Bot, User, ExternalLink, ArrowRight, CornerDownLeft, ShieldCheck } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "assistant";
  content: string;
  intent?: string;
  sources?: AISourceItem[];
  followups?: string[];
}

function AIChatContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [input, setInput] = useState(initialQuery);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "intro",
      sender: "assistant",
      content:
        "Hello! I am the **SRM AP Wiki Navigation Assistant**. I answer natural-language questions grounded strictly in verified university circulars, portals, event schedules, and academic regulations.\n\nHow can I help you navigate SRM AP today?",
      followups: [
        "Where is the examination portal?",
        "What events are happening today?",
        "What is the minimum attendance requirement?",
        "Show student AI and robotics projects",
      ],
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // If query param passed in URL, auto submit
  useEffect(() => {
    if (initialQuery.trim()) {
      handleSend(initialQuery);
    }
  }, []);

  const handleSend = async (userPrompt?: string) => {
    const text = (userPrompt || input).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/v1/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (res.ok) {
        const data: AIChatResponse = await res.json();
        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: "assistant",
          content: data.answer,
          intent: data.intent,
          sources: data.sources,
          followups: data.suggested_followups,
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        const errorMsg: Message = {
          id: `err-${Date.now()}`,
          sender: "assistant",
          content: "I encountered an error querying the knowledge base. Please try asking again.",
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch (err) {
      console.error("AI error:", err);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: "assistant",
        content: "Could not reach the SRM AP Wiki backend. Ensure the server is online.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="wiki-container py-6 max-w-4xl mx-auto flex flex-col h-[calc(100vh-8.5rem)]">
      <Breadcrumbs items={[{ label: "Explore", href: "/explore" }, { label: "AI Discovery" }]} />

      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 my-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Ask SRM AP Wiki
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold uppercase">
                Grounded Navigation
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              Natural-language discovery backed by official university sources
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          <ShieldCheck className="w-4 h-4" />
          <span>Anti-Hallucination Guard active</span>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto pr-1 py-4 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* Avatar */}
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === "user"
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "bg-blue-600 text-white shadow-sm"
              }`}
            >
              {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div className={`max-w-[85%] space-y-3 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-tr-none inline-block text-left"
                    : "wiki-card rounded-tl-none prose dark:prose-invert"
                }`}
              >
                <div className="whitespace-pre-line">{msg.content}</div>
              </div>

              {/* Source Cards per uiux.md Section 33 */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="space-y-1.5 pt-1 text-left">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                    Verified Information Sources ({msg.sources.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {msg.sources.map((s, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate">
                              {s.title}
                            </span>
                            <SourceBadge sourceType={s.source_type} size="sm" />
                          </div>
                          {s.snippet && (
                            <p className="text-[11px] text-slate-500 line-clamp-1 mb-1.5">{s.snippet}</p>
                          )}
                        </div>

                        <a
                          href={s.url}
                          target={s.url.startsWith("http") ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline pt-1 border-t border-slate-100 dark:border-slate-800"
                        >
                          <span>{s.url.startsWith("http") ? "Official Source" : "View Details"}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Follow-up suggestions */}
              {msg.followups && msg.followups.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-1.5 text-left">
                  {msg.followups.map((f, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(f)}
                      className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1"
                    >
                      <span>{f}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="wiki-card p-3.5 rounded-2xl rounded-tl-none text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              <span>Retrieving verified campus evidence...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center"
        >
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about examination schedules, clubs, attendance rules, or portals... (Enter to send)"
            className="w-full text-xs sm:text-sm pl-4 pr-12 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-blue-500 resize-none shadow-sm placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <span className="text-[10px] text-slate-400 text-center block mt-1.5">
          AI answers strictly from verified SRM AP records. Never fabricates URLs.
        </span>
      </div>
    </div>
  );
}

export default function AIPage() {
  return (
    <Suspense fallback={<div className="wiki-container py-12 text-center text-xs text-slate-400">Loading AI Assistant...</div>}>
      <AIChatContent />
    </Suspense>
  );
}
