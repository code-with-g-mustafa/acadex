"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { getAIAnswer } from '@/app/actions';
import { useToast } from "@/hooks/use-toast"

type Message = {
  role: 'user' | 'ai';
  content: string;
};

type QAChatProps = {
  documentContent: string;
};

export function QAChat({ documentContent }: QAChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await getAIAnswer(documentContent, input);
      const aiMessage: Message = { role: 'ai', content: aiResponse };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error getting AI answer:", error);
      const errorMessage: Message = { role: 'ai', content: 'Sorry, I encountered an error. Please try again.' };
       setMessages((prev) => [...prev, errorMessage]);
       toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "There was a problem with the AI assistant.",
      })
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[400px]">
      <ScrollArea className="flex-grow p-1 pr-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                message.role === 'user' ? 'justify-end' : ''
              }`}
            >
              {message.role === 'ai' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary" />
                </div>
              )}
              <div
                className={`rounded-lg p-3 text-sm max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.content}
              </div>
               {message.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/30 flex items-center justify-center">
                    <User className="w-5 h-5 text-accent-foreground" />
                </div>
              )}
            </div>
          ))}
           {isLoading && (
            <div className="flex items-start gap-3">
               <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary" />
                </div>
              <div className="rounded-lg p-3 text-sm bg-muted flex items-center">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          disabled={isLoading}
        />
        <Button type="submit" size="icon" disabled={isLoading}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
