import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

interface SourceReference {
  book: string;
  page?: string;
}

interface SourcesBlockProps {
  sources: SourceReference[];
  className?: string;
}

export const SourcesBlock = ({ sources, className }: SourcesBlockProps) => {
  return (
    <motion.div
      className={`mt-4 pt-3 border-t border-border/50 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">
        Sources
      </p>
      <div className="space-y-1.5">
        {sources.map((source, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-2 text-sm text-foreground/80"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <BookOpen className="w-3.5 h-3.5 text-siddha-turmeric" />
            <span className="font-medium">{source.book}</span>
            {source.page && source.page !== "0" && (
              <span className="text-muted-foreground">• Page {source.page}</span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
