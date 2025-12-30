import { motion } from "framer-motion";
import { Bot, User, Copy, Check } from "lucide-react";
import { TextGenerateEffect } from "./TextGenerateEffect";
import { SourcesBlock } from "./SourcesBlock";
import { TypingIndicator } from "./TypingIndicator";
import { useState } from "react";

interface SourceReference {
  book: string;
  page?: string;
  url?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: SourceReference[];
  isTyping?: boolean;
}

interface MessageBubbleProps {
  message: Message;
  isNew?: boolean;
}

export const MessageBubble = ({ message, isNew = false }: MessageBubbleProps) => {
  const isUser = message.role === "user";
  const [showSources, setShowSources] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <motion.div
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Avatar */}
      <motion.div
        className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${
          isUser
            ? "bg-gradient-to-br from-siddha-sandalwood to-siddha-earth"
            : "bg-gradient-to-br from-primary to-siddha-herb glow-primary"
        }`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
      >
        {isUser ? (
          <User className="w-4 h-4 text-foreground" />
        ) : (
          <Bot className="w-4 h-4 text-primary-foreground" />
        )}
      </motion.div>

      {/* Message Content */}
      <div
        className={`flex-1 max-w-[80%] ${isUser ? "text-right" : "text-left"}`}
      >
        <motion.div
          className={`inline-block px-4 py-3 rounded-2xl ${
            isUser
              ? "bg-secondary text-secondary-foreground rounded-br-md"
              : "glass rounded-bl-md"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          {message.isTyping ? (
            <TypingIndicator />
          ) : isNew && !isUser && !showSources ? (
            <TextGenerateEffect
              text={message.content}
              className="text-sm leading-relaxed"
              onComplete={() => setShowSources(true)}
            />
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
            </p>
          )}

          {!isUser && !message.isTyping && (!isNew || showSources) && (
            <div className="flex justify-end mt-2">
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg hover:bg-black/5 text-muted-foreground hover:text-foreground transition-colors"
                title="Copy to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}

          {/* Sources */}
          {message.sources && message.sources.length > 0 && (isUser || !isNew || showSources) && (
            <SourcesBlock sources={message.sources} />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export type { Message, SourceReference };
