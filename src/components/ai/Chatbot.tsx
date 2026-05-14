'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Loader2, 
  Trash2, 
  Sparkles,
  Bot,
  Zap,
  ShoppingBag,
  Info,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAIStore } from '@/store/useAIStore';
import { MessageBubble } from './MessageBubble';
import axios from 'axios';
import { cn } from '@/lib/utils';

const SUGGESTIONS = [
  { label: "Hot Products", icon: Zap },
  { label: "Help me choose", icon: ShoppingBag },
  { label: "Order Status", icon: Info },
];

export function Chatbot() {
  const { messages, isOpen, isLoading, addMessage, setIsOpen, setIsLoading, clearHistory } = useAIStore();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (text: string = input) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage = {
      role: 'user' as const,
      content: messageText,
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/ai/chat', {
        message: messageText,
        history: messages.slice(-10),
      });

      if (response.data.success) {
        addMessage({
          role: 'model',
          content: response.data.content,
          timestamp: new Date(),
        });
      } else {
        throw new Error(response.data.error || "Unknown error");
      }
    } catch (error: any) {
      addMessage({
        role: 'model',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment or contact support if the issue persists.",
        timestamp: new Date(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, y: 40, filter: 'blur(10px)' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="mb-6 w-[90vw] sm:w-[360px] h-[520px] max-h-[80vh] flex flex-col bg-background/80 backdrop-blur-2xl rounded-[2rem] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden"
          >
            {/* Premium Header */}
            <div className="relative p-5 bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
              <div className="relative flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                      <Sparkles className="h-5 w-5 text-white animate-pulse" />
                    </div>
                    <span className="absolute -bottom-1 -right-1 h-3 w-3 bg-emerald-400 rounded-full border-[3px] border-primary shadow-lg" />
                  </div>
                  <div>
                    <h3 className="font-black text-base tracking-tight leading-none">Assistant</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-70">Active</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 hover:bg-white/10 rounded-full text-white transition-all"
                    onClick={clearHistory}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 hover:bg-white/10 rounded-full text-white transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    <ChevronDown className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto overflow-x-hidden p-5 space-y-4 scroll-smooth bg-gradient-to-b from-transparent to-secondary/5 scrollbar-thin scrollbar-thumb-primary/10"
            >
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-3 opacity-40">
                <div className="h-16 w-16 rounded-3xl bg-secondary/20 flex items-center justify-center">
                  <Bot className="h-8 w-8" />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest">Beginning of conversation</p>
              </div>

              {messages.map((msg, idx) => (
                <MessageBubble key={idx} {...msg} />
              ))}
              
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-start mb-6"
                >
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                    <div className="bg-secondary/20 backdrop-blur-sm p-4 rounded-[2rem] rounded-tl-none flex items-center gap-3">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick Actions / Suggestions */}
            <AnimatePresence>
              {messages.length < 5 && !isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="px-6 py-2 flex gap-2 overflow-x-auto no-scrollbar"
                >
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(s.label)}
                      className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-primary/5 hover:bg-primary/10 border border-primary/10 rounded-full text-xs font-bold text-primary transition-all active:scale-95"
                    >
                      <s.icon className="h-3 w-3" />
                      {s.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Modern Input Area */}
            <div className="p-6 bg-background">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="relative flex items-center"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask our AI expert..."
                  className="w-full bg-secondary/30 border-none rounded-full pl-6 pr-16 py-4 text-sm font-medium focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-muted-foreground/50"
                  disabled={isLoading}
                />
                <div className="absolute right-2">
                  <Button 
                    type="submit" 
                    disabled={!input.trim() || isLoading}
                    className="rounded-full h-10 w-10 p-0 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Send className={cn("h-4 w-4", isLoading ? "hidden" : "block")} />
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  </Button>
                </div>
              </form>
              <div className="flex justify-center items-center gap-1.5 mt-4 opacity-30">
                <Zap className="h-3 w-3" />
                <p className="text-[9px] font-black uppercase tracking-widest">
                  Powered by Google Gemini
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative h-16 w-16 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.1)] flex items-center justify-center transition-all duration-500 overflow-hidden group",
          isOpen ? "bg-background text-foreground" : "bg-primary text-primary-foreground"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? (
          <ChevronDown className="h-8 w-8 animate-in zoom-in duration-300" />
        ) : (
          <div className="relative">
            <MessageCircle className="h-8 w-8 animate-in zoom-in duration-300" />
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-white animate-pulse" />
          </div>
        )}
        
        {!isOpen && messages.length > 1 && (
          <span className="absolute top-2 right-2 h-3 w-3 bg-emerald-400 rounded-full border-2 border-primary" />
        )}
      </motion.button>
    </div>
  );
}
