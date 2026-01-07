import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { SidebarContent } from "./SidebarContent";
import type { Message } from "@/components/chat/MessageBubble";

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

interface AppSidebarProps {
  sessions?: Record<string, ChatSession>;
  currentSessionId?: string;
  onSelectChat?: (id: string) => void;
  onNewChat?: () => void;
}

export const AppSidebar = ({ 
  sessions, 
  currentSessionId, 
  onSelectChat, 
  onNewChat 
}: AppSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle Button - Only visible when closed */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            onClick={() => setIsOpen(true)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-4 left-4 z-50 p-2.5 glass-strong rounded-xl hover:bg-secondary/20 transition-all duration-300 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="w-5 h-5 text-foreground group-hover:text-accent transition-colors" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-30 bg-background/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            className="fixed top-0 left-0 z-40 h-full w-80 shadow-2xl"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Main Sidebar Container */}
            <div className="relative h-full w-full overflow-hidden flex flex-col">
                {/* Glass Background with Gradient */}
                <div className="absolute inset-0 glass-strong border-r border-accent/20">
                   {/* Decorative subtle gradient blob */}
                   <div className="absolute -top-20 -left-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
                   <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                </div>

                {/* Content Container */}
                <div className="relative z-10 flex flex-col h-full">
                  {/* Header */}
                  <div className="px-6 pt-8 pb-6 border-b border-border/40 flex items-center justify-between shrink-0">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h2 className="text-2xl font-bold text-gradient-siddha tracking-tight">
                        Siddha AI
                      </h2>
                      <p className="text-xs text-muted-foreground mt-1 font-medium tracking-wide uppercase">
                        Ancient Wisdom
                      </p>
                    </motion.div>
                    
                    {onNewChat && (
                      <motion.button 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        onClick={() => {
                          onNewChat();
                          if (window.innerWidth < 768) setIsOpen(false);
                        }}
                        className="p-2.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl transition-colors border border-primary/20"
                        title="New Chat"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                      </motion.button>
                    )}
                  </div>

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto py-4 px-2 custom-scrollbar">
                    <SidebarContent 
                      sessions={sessions}
                      currentSessionId={currentSessionId}
                      onSelectChat={(id) => {
                        onSelectChat?.(id);
                        if (window.innerWidth < 768) setIsOpen(false);
                      }}
                    />
                  </div>

                  {/* Footer - Developer Tag & Medical Disclaimer */}
                  <div className="shrink-0">
                    {/* Developer Tag - Mobile & Tablet */}
                    <div className="lg:hidden px-4 py-3 border-t border-border/40">
                      <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl glass border-border/40">
                        {/* Avatar */}
                        <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-siddha-herb/40 shadow-md flex-shrink-0">
                          <img
                            src="/kamalesh-avatar.jpg"
                            alt="Kamalesh S A"
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                        {/* Name */}
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-foreground tracking-wide">
                            KAMALESH S A
                          </span>
                          <span className="text-[10px] text-siddha-turmeric font-medium">
                            Developer
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Medical Disclaimer */}
                    <div className="p-4 border-t border-border/40 bg-background/20 backdrop-blur-sm">
                      <div className="flex gap-3 px-2">
                         <div className="mt-0.5 text-accent shrink-0">
                           <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                         </div>
                         <div>
                           <p className="text-[10px] font-bold text-accent mb-0.5 uppercase tracking-wider">
                             Medical Disclaimer
                           </p>
                           <p className="text-[10px] text-muted-foreground leading-relaxed">
                             Information is educational only. Consult a Vaidya or doctor for medical advice.
                           </p>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>

            {/* Close Button - Positioned Half-Out on Right Edge */}
            <motion.button
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: "50%" }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ delay: 0.2 }}
              className="absolute top-6 right-0 z-50 p-2 glass-strong rounded-full border border-border/50 shadow-lg hover:bg-destructive/10 group cursor-pointer"
              title="Close Sidebar"
            >
               <X className="w-4 h-4 text-foreground group-hover:text-destructive transition-colors" />
            </motion.button>
          </motion.aside>
        )}
      </AnimatePresence>
    </>

  );
};
