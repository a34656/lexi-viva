import { cn } from "@/lib/utils";
import { Brain, User, BookOpen } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DifficultyBadge, DifficultyLevel } from "./DifficultyBadge";
import { GradingCard } from "./GradingCard";

export interface Message {
  id: string;
  role: "examiner" | "student";
  content: string;
  timestamp: Date;
  sourceReference?: {
    page: number;
    section: string;
  };
  difficulty?: DifficultyLevel;
  grading?: {
    score: number;
    feedback: string;
    devilsAdvocate?: string;
  };
}

interface ChatMessageProps {
  message: Message;
  isThinking?: boolean;
  className?: string;
}

export function ChatMessage({ message, isThinking = false, className }: ChatMessageProps) {
  if (message.role === "student") {
    return (
      <div className={cn("flex justify-end animate-slide-in", className)}>
        <div className="max-w-[80%] space-y-2">
          <div className="flex items-center justify-end gap-2 mb-1">
            <span className="text-xs text-muted-foreground font-mono">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <div className="w-7 h-7 rounded-full bg-secondary/30 flex items-center justify-center border border-secondary/50">
              <User className="w-3.5 h-3.5 text-secondary" />
            </div>
          </div>
          <div className="glass-panel rounded-lg rounded-tr-sm p-4 border-r-4 border-r-secondary/50">
            <p className="text-foreground leading-relaxed">
              {message.content}
            </p>
          </div>
          
          {/* Grading Card (appears after student answer) */}
          {message.grading && (
            <GradingCard
              score={message.grading.score}
              feedback={message.grading.feedback}
              devilsAdvocate={message.grading.devilsAdvocate}
            />
          )}
        </div>
      </div>
    );
  }

  // Examiner message
  return (
    <div className={cn("flex justify-start animate-slide-in", className)}>
      <div className="max-w-[85%] space-y-2">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <Brain className="w-4.5 h-4.5 text-primary" />
            </div>
            {isThinking && (
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full animate-pulse" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">AI Examiner</span>
            {message.difficulty && <DifficultyBadge level={message.difficulty} size="sm" />}
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          
          {message.sourceReference && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 hover:bg-muted transition-colors text-xs font-mono text-muted-foreground ml-auto">
                  <BookOpen className="w-3 h-3" />
                  <span>p.{message.sourceReference.page}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-xs font-medium">Source: Page {message.sourceReference.page}</p>
                <p className="text-xs text-muted-foreground">{message.sourceReference.section}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Message Content */}
        <div className="glass-panel rounded-lg rounded-tl-sm p-5 border-l-4 border-l-primary/50 ml-12">
          {isThinking ? (
            <div className="flex items-center gap-3 py-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-primary rounded-full thinking-pulse" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-primary rounded-full thinking-pulse" style={{ animationDelay: '200ms' }} />
                <span className="w-2 h-2 bg-primary rounded-full thinking-pulse" style={{ animationDelay: '400ms' }} />
              </div>
              <span className="text-muted-foreground text-sm font-mono">Formulating question...</span>
            </div>
          ) : (
            <p className="text-foreground leading-relaxed font-serif text-lg">
              {message.content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
