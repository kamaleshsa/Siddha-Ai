import { motion } from "framer-motion";
import { Sparkles, BookCheck } from "lucide-react";

export const Header = () => {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-20 px-4 py-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        {/* Logo section - offset for sidebar toggle */}
        <div className="pl-12">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-5 h-5 text-accent" />
            <div>
              <h1 className="text-lg font-semibold text-gradient-siddha leading-tight">
                Siddha AI
              </h1>
              <div className="relative">
                <p className="text-[10px] text-muted-foreground">
                  AI-assisted answers from Siddha texts
                </p>
                {/* Animated gradient underline */}
                <motion.div
                  className="absolute -bottom-0.5 left-0 h-[1px] bg-gradient-to-r from-primary via-accent to-siddha-sandalwood"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Badge */}
        <motion.div
          className="flex items-center gap-1.5 px-3 py-1.5 glass rounded-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            animate={{ 
              boxShadow: [
                "0 0 5px hsl(var(--accent))",
                "0 0 15px hsl(var(--accent))",
                "0 0 5px hsl(var(--accent))",
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="rounded-full"
          >
            <BookCheck className="w-3.5 h-3.5 text-accent" />
          </motion.div>
          <span className="text-[11px] text-foreground/80 font-medium">
            Book-Referenced
          </span>
        </motion.div>
      </div>
    </motion.header>
  );
};
