import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const DeveloperTag = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className="hidden lg:block fixed bottom-6 right-6 z-[1000]"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: 0.5,
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
    >
      <motion.div
        className="relative cursor-pointer group"
        onHoverStart={() => setIsExpanded(true)}
        onHoverEnd={() => setIsExpanded(false)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Main Tag Container - Siddha Theme */}
        <motion.div
          className="flex items-center rounded-full glass-strong border-border/60 shadow-xl overflow-hidden relative"
          style={{
            minWidth: "52px",
            height: "52px",
            paddingLeft: "6px",
            paddingRight: "6px",
          }}
          animate={{
            paddingRight: isExpanded ? "12px" : "6px",
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {/* Subtle Animated Gradient Background - Siddha Colors */}
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              background: "linear-gradient(90deg, hsl(var(--siddha-herb)), hsl(var(--siddha-turmeric)), hsl(var(--siddha-sandalwood)))",
              backgroundSize: "200% 100%",
            }}
            animate={{
              backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Avatar with Herbal Glow */}
          <motion.div
            className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-siddha-herb/40 shadow-md flex-shrink-0"
            animate={{
              boxShadow: [
                "0 0 15px hsl(var(--siddha-herb) / 0.3)",
                "0 0 25px hsl(var(--siddha-turmeric) / 0.4)",
                "0 0 15px hsl(var(--siddha-herb) / 0.3)",
              ],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <img
              src="/kamalesh-avatar.jpg"
              alt="Kamalesh S A"
              className="w-full h-full object-cover object-center"
            />
          </motion.div>

          {/* Name Text - Siddha Typography */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                animate={{ opacity: 1, width: "auto", marginLeft: 12 }}
                exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col relative z-10"
              >
                <motion.span
                  className="text-xs font-semibold text-foreground whitespace-nowrap tracking-wide"
                  initial={{ x: -10 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  KAMALESH S A
                </motion.span>
                <motion.span
                  className="text-[10px] text-siddha-turmeric whitespace-nowrap font-medium"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  Developer
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Subtle Floating Particles - Turmeric Glow */}
        {[...Array(2)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 bg-siddha-turmeric/60 rounded-full pointer-events-none"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              y: [-10, -25, -10],
              opacity: [0, 0.6, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};
