import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageBubble, type Message } from "./MessageBubble";

interface ChatMessagesProps {
  messages: Message[];
  className?: string;
}

export const ChatMessages = ({ messages, className }: ChatMessagesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <motion.div
      ref={containerRef}
      className={`flex-1 overflow-y-auto px-4 py-6 space-y-6 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <AnimatePresence mode="popLayout">
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            isNew={index === messages.length - 1 && message.role === "assistant"}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};
