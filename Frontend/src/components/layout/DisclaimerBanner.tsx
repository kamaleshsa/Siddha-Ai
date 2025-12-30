import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export const DisclaimerBanner = () => {
  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-10 px-4 py-2 backdrop-blur-md border-t border-border/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-2">
        <AlertTriangle className="w-3.5 h-3.5 text-accent flex-shrink-0" />
        <p className="text-[11px] text-muted-foreground text-center">
          This AI provides information strictly from Siddha texts. It is not a substitute for professional medical advice.
        </p>
      </div>
    </motion.div>
  );
};
