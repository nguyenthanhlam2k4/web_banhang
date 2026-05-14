import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

interface AIState {
  messages: Message[];
  isOpen: boolean;
  isLoading: boolean;
  addMessage: (message: Message) => void;
  setIsOpen: (isOpen: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  clearHistory: () => void;
}

export const useAIStore = create<AIState>()(
  persist(
    (set) => ({
      messages: [
        {
          role: 'model',
          content: 'Hello! I am your PremiumStore assistant. How can I help you today?',
          timestamp: new Date(),
        },
      ],
      isOpen: false,
      isLoading: false,
      addMessage: (message) => set((state) => ({ 
        messages: [...state.messages, message] 
      })),
      setIsOpen: (isOpen) => set({ isOpen }),
      setIsLoading: (isLoading) => set({ isLoading }),
      clearHistory: () => set({ 
        messages: [{
          role: 'model',
          content: 'Hello! I am your PremiumStore assistant. How can I help you today?',
          timestamp: new Date(),
        }] 
      }),
    }),
    {
      name: 'ai-storage',
    }
  )
);
