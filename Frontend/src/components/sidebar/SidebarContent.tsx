import { motion } from "framer-motion";
import { BookOpen, Info, AlertTriangle, ChevronRight, History } from "lucide-react";
import type { Message } from "@/components/chat/MessageBubble";

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

interface SidebarContentProps {
  sessions?: Record<string, ChatSession>;
  currentSessionId?: string;
  onSelectChat?: (id: string) => void;
}

interface SidebarSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const SidebarSection = ({
  title,
  icon,
  children,
  defaultOpen = false,
}: SidebarSectionProps) => {
  return (
    <motion.details
      className="group"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      open={defaultOpen}
    >
      <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/5 rounded-lg transition-colors list-none">
        <span className="text-primary">{icon}</span>
        <span className="text-sm font-medium text-foreground flex-1">
          {title}
        </span>
        <ChevronRight className="w-4 h-4 text-muted-foreground transition-transform group-open:rotate-90" />
      </summary>
      <motion.div
        className="pl-11 pr-4 pb-3"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
      >
        {children}
      </motion.div>
    </motion.details>
  );
};

// Reference books data
const referenceBooks = [
  { title: "Agasthiyar Vaithiya Rathina Surukkam", author: "Agasthiyar" },
  { title: "Theraiyar Venba", author: "Theraiyar" },
  { title: "Bogar 7000", author: "Bogar" },
  { title: "Siddhar Padalgal", author: "Various Siddhars" },
  { title: "Yugi Vaithiya Chinthamani", author: "Yugi Muni" },
  { title: "Pathartha Guna Vilakkam", author: "Various" },
];

export const SidebarContent = ({ sessions, currentSessionId, onSelectChat }: SidebarContentProps) => {
  const sortedSessions = sessions 
    ? Object.values(sessions).sort((a, b) => b.createdAt - a.createdAt) 
    : [];

  return (
    <div className="space-y-6">
      {/* History Section - Flat List */}
      {sortedSessions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-2 text-muted-foreground/50 uppercase tracking-widest text-[10px] font-bold">
            <History className="w-3 h-3" />
            <span>Recent Chats</span>
          </div>
          <div className="space-y-1">
            {sortedSessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSelectChat?.(session.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200 truncate border ${
                  currentSessionId === session.id 
                    ? "bg-primary/10 border-primary/20 text-primary font-medium" 
                    : "border-transparent text-muted-foreground/80 hover:bg-white/5 hover:text-foreground"
                }`}
              >
                {session.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* About Section - Minimal & Neat */}
      <div className="px-1">
         <div className="p-4 rounded-xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent">
            <div className="flex items-center gap-2 mb-2 text-primary/80">
               <Info className="w-4 h-4" />
               <span className="text-xs font-bold uppercase tracking-wide">About Siddha AI</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Our AI is grounded in authentic Siddha manuscripts and the wisdom of potential Siddhars. We prioritize accuracy based on traditional texts over general internet knowledge.
            </p>
         </div>
      </div>
    </div>
  );
};
