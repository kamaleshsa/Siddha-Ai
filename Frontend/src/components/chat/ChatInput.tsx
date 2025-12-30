import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput = ({
  onSend,
  disabled = false,
  placeholder = "Ask based on Siddha books only…",
}: ChatInputProps) => {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150
      )}px`;
    }
  }, [value]);

  const handleSubmit = () => {
    if (value.trim() && !disabled) {
      onSend(value.trim());
      setValue("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div
      className={`relative glass rounded-2xl transition-all duration-300 ${
        isFocused ? "glow-accent ring-1 ring-accent/30" : ""
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated gradient border on focus */}
      {isFocused && (
        <motion.div
          className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-primary via-accent to-siddha-sandalwood opacity-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          style={{ backgroundSize: "200% 200%" }}
        />
      )}

      <div className="relative flex items-center gap-2 p-3">
        <Sparkles className="w-5 h-5 text-accent mb-0.5 flex-shrink-0" />
        
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="flex-1 bg-transparent border-none outline-none resize-none text-foreground placeholder:text-muted-foreground text-sm leading-relaxed max-h-[150px]"
        />

        <motion.button
          onClick={handleSubmit}
          disabled={!value.trim() || disabled}
          className={`p-2.5 rounded-xl transition-all duration-200 ${
            value.trim() && !disabled
              ? "bg-gradient-to-br from-primary to-siddha-herb text-primary-foreground glow-primary"
              : "bg-muted text-muted-foreground"
          }`}
          whileHover={value.trim() && !disabled ? { scale: 1.05 } : {}}
          whileTap={value.trim() && !disabled ? { scale: 0.95 } : {}}
        >
          <Send className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};
