'use client';

import { useState, useRef, useEffect } from 'react';
import { BentoCard } from '../../../components/dashboard/bento-card';
import { Sparkles, Send, User, Bot, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useChat } from '@ai-sdk/react';

export default function CoachPage() {
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat(
    // @ts-ignore
    { api: '/api/coach' }
  ) as any;

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
              content: m.content
            })));
          } else {
            // Set initial greeting if no history
            setMessages([
              { id: 'greeting', role: 'assistant', content: "Hi! I'm your AI fitness coach. Ask me anything about your nutrition, training, recovery, or goal strategy!" }
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
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-12 max-w-5xl mx-auto">
      <div className="lg:col-span-12">
        <BentoCard className="flex flex-col h-[80vh] p-0 overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 p-6 border-b border-white/5 bg-white/5 backdrop-blur-xl shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-neon-primary">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-display font-semibold text-white">AI Coach</h2>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Always on expert guidance</p>
            </div>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {isHistoryLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {messages.map((msg: any) => (
                  <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary border border-primary/30 mt-1">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}
                    
                    <div className={`max-w-[85%] rounded-2xl px-5 py-4 ${msg.role === 'user' ? 'bg-white/10 text-white rounded-tr-sm border border-white/5' : 'bg-primary/10 text-slate-200 rounded-tl-sm border border-primary/20 shadow-glow'}`}>
                      <div className="text-sm">
                        <ReactMarkdown
                          components={{
                            p: ({node, ...props}) => <p className="mb-3 last:mb-0 leading-relaxed" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
                            li: ({node, ...props}) => <li className="pl-1" {...props} />,
                            h1: ({node, ...props}) => <h1 className="text-lg font-bold text-white mb-2" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-base font-bold text-white mb-2" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-sm font-bold text-white mb-2" {...props} />
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                    
                    {msg.role === 'user' && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white border border-white/20 mt-1">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && messages[messages.length - 1]?.role === 'user' && (
                  <div className="flex gap-4 justify-start">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary border border-primary/30 mt-1">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-primary/10 rounded-2xl rounded-tl-sm px-5 py-4 border border-primary/20 shadow-glow flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-white/5 bg-black/20 shrink-0">
            <form onSubmit={handleSubmit} className="relative flex items-center">
              <input 
                type="text" 
                value={input || ''}
                onChange={handleInputChange}
                placeholder="Ask about your plan, meals, or training..." 
                className="w-full rounded-2xl border border-white/10 bg-white/5 pl-6 pr-14 py-4 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                disabled={isLoading || isHistoryLoading}
              />
              <button 
                type="submit" 
                disabled={isLoading || isHistoryLoading || !(input || '').trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4 ml-1" />
              </button>
            </form>
          </div>
        </BentoCard>
      </div>
    </div>
  );
}
