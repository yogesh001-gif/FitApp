'use client';

import { useState, useRef, useEffect } from 'react';
import { BentoCard } from '../../../components/dashboard/bento-card';
import { Sparkles, Send, User, Bot, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

export default function CoachPage() {
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [inputVal, setInputVal] = useState('');
  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: '/api/coach' }),
  });
  const isLoading = status === 'submitted' || status === 'streaming';

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    
    const messageContent = inputVal;
    setInputVal(''); // Clear input immediately
    
    try {
      sendMessage({ 
        id: Date.now().toString(), 
        role: 'user', 
        parts: [{ type: 'text', text: messageContent }] 
      });
    } catch (err) {
      console.error("Failed to append message:", err);
    }
  };

  // Load history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch('/api/coach/history');
        if (res.ok) {
          const data = await res.json();
          if (data.messages && data.messages.length > 0) {
            // Mapping the stored database format to the ai SDK format
            setMessages(data.messages.map((m: any) => ({
              id: m._id || Math.random().toString(),
              role: m.role,
              parts: [{ type: 'text', text: m.content || m.message || '' }]
            })));
          } else {
            // Set initial greeting if no history
            setMessages([
              { 
                id: 'greeting', 
                role: 'assistant', 
                parts: [{ type: 'text', text: "Hi! I'm your AI fitness coach. Ask me anything about your nutrition, training, recovery, or goal strategy!" }] 
              }
            ]);
          }
        }
      } catch (error) {
        console.error("Failed to load chat history:", error);
      } finally {
        setIsHistoryLoading(false);
      }
    };

    loadHistory();
  }, [setMessages]);

  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-12 max-w-4xl mx-auto">
      <div className="lg:col-span-12">
        <BentoCard className="flex flex-col h-[80vh] p-0 overflow-hidden bg-slate-50/40 dark:bg-black/40">
          {/* Header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200 dark:border-white/[0.06] bg-slate-100/50 dark:bg-slate-900/40 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
              <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight">AI Coach</h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">Always on expert guidance</p>
            </div>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {isHistoryLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
              </div>
            ) : (
              <>
                {messages.map((msg: any) => (
                  <div key={msg.id} className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 mt-1">
                        <Bot className="h-3.5 w-3.5" />
                      </div>
                    )}
                    
                    <div className={`rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-slate-900 text-white dark:bg-white dark:text-black rounded-tr-sm' : 'bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 rounded-tl-sm border border-slate-200 dark:border-white/[0.04] shadow-sm dark:shadow-none'}`}>
                      <div className="text-sm">
                        <ReactMarkdown
                          components={{
                            p: ({node, ...props}) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-semibold text-current" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />,
                            li: ({node, ...props}) => <li className="pl-1" {...props} />,
                            h1: ({node, ...props}) => <h1 className="text-sm font-bold text-current mb-1" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-sm font-bold text-current mb-1" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-sm font-bold text-current mb-1" {...props} />
                          }}
                        >
                          {msg.parts ? msg.parts.map((p: any) => p.text).join('') : msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && messages[messages.length - 1]?.role === 'user' && (
                  <div className="flex gap-4 justify-start mr-auto max-w-[85%]">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 mt-1">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                    <div className="bg-white dark:bg-slate-800/60 rounded-2xl rounded-tl-sm px-4 py-3 border border-slate-200 dark:border-white/[0.04] shadow-sm dark:shadow-none flex items-center h-[44px]">
                      <span className="flex gap-1">
                        <span className="h-1.5 w-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="h-1.5 w-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="h-1.5 w-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"></span>
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-slate-900/60 shrink-0">
            <form onSubmit={onFormSubmit} className="relative flex items-center">
              <input 
                type="text" 
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask about your plan, meals, or training..." 
                className="w-full rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-black/40 pl-4 pr-12 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-slate-300 dark:focus:border-white/[0.15] focus:bg-slate-50 dark:focus:bg-black/60 transition-colors shadow-sm dark:shadow-inner"
                disabled={isLoading || isHistoryLoading}
              />
              <button 
                type="submit" 
                disabled={isLoading || isHistoryLoading || !inputVal.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4 ml-0.5" />
              </button>
            </form>
          </div>
        </BentoCard>
      </div>
    </div>
  );
}
