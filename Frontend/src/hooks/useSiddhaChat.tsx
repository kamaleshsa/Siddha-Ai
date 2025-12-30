import { useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import type { Message } from "@/components/chat/MessageBubble";

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

export function useSiddhaChat() {
  const [sessions, setSessions] = useState<Record<string, ChatSession>>(() => {
    const initialId = Date.now().toString();
    return {
      [initialId]: {
        id: initialId,
        title: "New Chat",
        messages: [],
        createdAt: Date.now(),
      },
    };
  });
  
  const [currentsessionId, setCurrentSessionId] = useState<string>(() => Object.keys(sessions)[0]);
  const [isLoading, setIsLoading] = useState(false);

  // Helper to update current session messages
  const updateCurrentMessages = (updater: (prev: Message[]) => Message[]) => {
    setSessions((prev) => {
      const current = prev[currentsessionId];
      if (!current) return prev;
      
      const newMessages = updater(current.messages);
      
      // Update title if it's the first user message
      let newTitle = current.title;
      if (current.messages.length === 0 && newMessages.length > 0) {
         const firstMsg = newMessages.find(m => m.role === "user");
         if (firstMsg) {
             newTitle = firstMsg.content.slice(0, 30) + (firstMsg.content.length > 30 ? "..." : "");
         }
      }

      return {
        ...prev,
        [currentsessionId]: {
          ...current,
          messages: newMessages,
          title: newTitle,
        },
      };
    });
  };

  const createNewChat = useCallback(() => {
    const newId = Date.now().toString();
    setSessions((prev) => ({
      ...prev,
      [newId]: {
        id: newId,
        title: "New Chat",
        messages: [],
        createdAt: Date.now(),
      },
    }));
    setCurrentSessionId(newId);
  }, []);

  const selectChat = useCallback((id: string) => {
    if (sessions[id]) {
      setCurrentSessionId(id);
    }
  }, [sessions]);

  const sendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content,
      };
      
      updateCurrentMessages((prev) => [...prev, userMessage]);

      // Add temporary typing indicator
      const typingId = "typing-" + Date.now();
      updateCurrentMessages((prev) => [
        ...prev,
        { id: typingId, role: "assistant", content: "", isTyping: true },
      ]);

      const start = Date.now();
      
      // API Call
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: content }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to fetch response");
      }

      const data = await response.json();
      
      // Minimum loading time
      const elapsed = Date.now() - start;
      if (elapsed < 600) {
         await new Promise(resolve => setTimeout(resolve, 600 - elapsed));
      }

      // Replace typing indicator
      updateCurrentMessages((prev) =>
        prev.map((msg) =>
          msg.id === typingId
            ? {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.answer,
                sources: data.sources,
                isTyping: false,
              }
            : msg
        )
      );
      
    } catch (error) {
      console.error("Chat error:", error);
      
      // Remove typing indicator
      updateCurrentMessages((prev) => prev.filter(msg => !msg.isTyping));

      toast({
        title: "Connection Error",
        description: "Could not connect to the Siddha AI Backend.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages: sessions[currentsessionId]?.messages || [],
    currentsessionId,
    sessions,
    isLoading,
    sendMessage,
    createNewChat,
    selectChat,
  };
}
