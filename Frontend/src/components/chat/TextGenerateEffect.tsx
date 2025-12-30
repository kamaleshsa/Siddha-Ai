import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TextGenerateEffectProps {
  text: string;
  className?: string;
  speed?: number;
  onComplete?: () => void;
}

export const TextGenerateEffect = ({
  text,
  className,
  speed = 15,
  onComplete,
}: TextGenerateEffectProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {displayedText}
      {!isComplete && (
        <motion.span
          className="inline-block w-0.5 h-4 ml-0.5 bg-primary align-middle"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </motion.span>
  );
};
