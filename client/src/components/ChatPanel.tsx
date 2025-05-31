import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatPanelProps {
  streamId: number;
  currentUser: any;
  onSendMessage: (message: string) => void;
  isConnected: boolean;
}

export default function ChatPanel({ streamId, currentUser, onSendMessage, isConnected }: ChatPanelProps) {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: initialMessages } = useQuery({
    queryKey: [`/api/streams/${streamId}/messages`],
  });

  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && isConnected) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
    }
  };

  const addMessage = (message: any) => {
    setMessages(prev => [...prev, message]);
  };

  // Mock real-time message additions
  useEffect(() => {
    const interval = setInterval(() => {
      const mockMessages = [
        { user: { username: "SportsBeast", avatar: "SB" }, message: "Mike's shot is money! 🏀", type: "message" },
        { user: { username: "Sarah_B", avatar: "SB" }, message: "Betting on blue team next", type: "message" },
        { user: { username: "TylerDunks", avatar: "TD" }, message: "Anyone else see that crossover? 🔥", type: "message" },
      ];
      
      if (Math.random() > 0.7) {
        const randomMessage = mockMessages[Math.floor(Math.random() * mockMessages.length)];
        addMessage({
          id: Date.now(),
          streamId,
          userId: Math.floor(Math.random() * 100),
          ...randomMessage,
          createdAt: new Date().toISOString()
        });
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [streamId]);

  return (
    <div className="h-full bg-card border-l border-border flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-border">
        <CardTitle className="text-lg flex items-center space-x-2">
          <MessageCircle className="w-5 h-5 text-accent-blue" />
          <span>Live Chat</span>
          <span className="bg-accent-green/20 text-accent-green text-xs px-2 py-1 rounded-full">
            {messages.length + 234}
          </span>
        </CardTitle>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-3">
        {messages.map((message, index) => (
          <div 
            key={message.id || index} 
            className={`rounded-lg p-3 animate-fade-in ${
              message.type === 'bet_notification' ? 
              'bg-accent-green/10 border border-accent-green/30' : 
              'bg-background'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                {message.type === 'bet_notification' && (
                  <Trophy className="w-4 h-4 text-accent-green" />
                )}
                <span className={`text-sm font-medium ${
                  message.type === 'bet_notification' ? 'text-accent-green' : 'text-accent-blue'
                }`}>
                  {message.user?.username || 'Anonymous'}
                </span>
              </div>
              <span className="text-xs text-secondary">
                {new Date(message.createdAt).toLocaleTimeString()}
              </span>
            </div>
            <div className="text-sm">{message.message}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat Input */}
      <div className="p-4 border-t border-border">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
            disabled={!isConnected}
          />
          <Button 
            type="submit" 
            className="bg-accent-blue hover:bg-accent-blue/80 text-white"
            disabled={!newMessage.trim() || !isConnected}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
        <div className="flex items-center justify-between mt-2 text-xs text-secondary">
          <span>Press Enter to send</span>
          <span className={isConnected ? 'text-accent-green' : 'text-red-400'}>
            {isConnected ? '● Connected' : '● Disconnected'}
          </span>
        </div>
      </div>
    </div>
  );
}
