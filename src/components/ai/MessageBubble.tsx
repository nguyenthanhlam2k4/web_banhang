import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface MessageBubbleProps {
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ role, content, timestamp }) => {
  const isBot = role === 'model';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn(
        "flex w-full mb-6",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      <div className={cn(
        "flex max-w-[85%] gap-4",
        isBot ? "flex-row" : "flex-row-reverse"
      )}>
        <div className={cn(
          "h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 shadow-sm",
          isBot ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"
        )}>
          {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
        </div>
        
        <div className={cn(
          "space-y-1 min-w-0 flex-1",
          !isBot && "flex flex-col items-end"
        )}>
          <div className={cn(
            "p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm break-words overflow-hidden",
            isBot 
              ? "bg-card border border-border/40 text-foreground rounded-tl-none shadow-[0_2px_10px_rgba(0,0,0,0.02)]" 
              : "bg-primary text-primary-foreground rounded-tr-none shadow-[0_10px_20px_rgba(0,0,0,0.1)] font-medium"
          )}>
            <div className={cn(
              "markdown-content prose prose-sm max-w-none",
              isBot ? "prose-neutral dark:prose-invert" : "prose-invert"
            )}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest px-2 opacity-50">
            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
