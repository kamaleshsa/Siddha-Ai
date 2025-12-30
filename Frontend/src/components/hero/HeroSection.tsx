import { motion } from "framer-motion";
import { Leaf, Sparkles } from "lucide-react";

interface ExamplePromptProps {
  prompt: string;
  onClick: (prompt: string) => void;
}

const ExamplePrompt = ({ prompt, onClick }: ExamplePromptProps) => (
  <motion.button
    onClick={() => onClick(prompt)}
    className="px-4 py-2.5 glass rounded-xl text-sm text-foreground/80 hover:text-foreground hover:bg-secondary/50 transition-all duration-200 text-left"
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
  >
    {prompt}
  </motion.button>
);

interface HeroSectionProps {
  onPromptClick: (prompt: string) => void;
}

export const HeroSection = ({ onPromptClick }: HeroSectionProps) => {
  const examplePrompts = [
    "Uses of Nilavembu",
    "Siddha view on digestion",
    "Herbal remedies for fever",
    "Benefits of Ashwagandha",
  ];

  return (
    <motion.div
      className="flex-1 flex flex-col items-center justify-center px-6 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Animated Siddha-inspired illustration */}
      <motion.div
        className="relative mb-8"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <div className="relative w-32 h-32">
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Middle ring */}
          <motion.div
            className="absolute inset-3 rounded-full border border-accent/40"
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Inner glow */}
          <motion.div
            className="absolute inset-6 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 blur-md"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Leaf className="w-10 h-10 text-primary" />
            </motion.div>
          </div>

          {/* Floating sparkles */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                top: `${20 + i * 25}%`,
                left: `${10 + i * 35}%`,
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            >
              <Sparkles className="w-3 h-3 text-accent" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        className="text-3xl md:text-4xl font-semibold text-center mb-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <span className="text-gradient-siddha">Ask questions.</span>
        <br />
        <span className="text-foreground/90">Get answers from Siddha books.</span>
      </motion.h1>

      <motion.p
        className="text-muted-foreground text-center mb-10 max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        AI-powered insights from ancient Tamil medical texts
      </motion.p>

      {/* Example prompts */}
      <motion.div
        className="flex flex-wrap justify-center gap-3 max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {examplePrompts.map((prompt, index) => (
          <motion.div
            key={prompt}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + index * 0.1 }}
          >
            <ExamplePrompt prompt={prompt} onClick={onPromptClick} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};
