import { cn } from "@/lib/utils";
import { Brain, BookOpen } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ExaminerBubbleProps {
  question: string;
  isThinking?: boolean;
  sourceReference?: {
    page: number;
    section: string;
  };
  className?: string;
}

export function ExaminerBubble({ 
  question, 
  isThinking = false, 
  sourceReference,
  className 
}: ExaminerBubbleProps) {
  return (
    <div
      className={cn(
        "relative glass-panel rounded-lg p-6 border-l-4 border-l-primary animate-slide-in",
        "before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r before:from-primary/5 before:to-transparent before:pointer-events-none",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            {isThinking && (
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI Examiner</h3>
            <p className="text-xs text-muted-foreground font-mono">LEXICOGNITION v2.1</p>
          </div>
        </div>

        {sourceReference && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/50 hover:bg-secondary transition-colors text-xs font-mono text-muted-foreground">
                <BookOpen className="w-3.5 h-3.5" />
                <span>p.{sourceReference.page}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-xs">
              <p className="text-sm font-medium">Source Reference</p>
              <p className="text-xs text-muted-foreground mt-1">
                Page {sourceReference.page}: {sourceReference.section}
              </p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Question Content */}
      <div className="relative">
        {isThinking ? (
          <div className="flex items-center gap-3 py-4">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-primary rounded-full thinking-pulse" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-primary rounded-full thinking-pulse" style={{ animationDelay: '200ms' }} />
              <span className="w-2 h-2 bg-primary rounded-full thinking-pulse" style={{ animationDelay: '400ms' }} />
            </div>
            <span className="text-muted-foreground text-sm font-mono">Formulating question...</span>
          </div>
        ) : (
          <p className="text-foreground leading-relaxed text-lg">
            {question}
          </p>
        )}
      </div>
    </div>
  );
}
