import { FileText, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { KnowledgeGraph } from "./KnowledgeGraph";

interface DocumentStatusProps {
  documentName: string;
  totalQuestions: number;
  currentQuestion: number;
  className?: string;
}

export function DocumentStatus({ 
  documentName, 
  totalQuestions, 
  currentQuestion,
  className 
}: DocumentStatusProps) {
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Document Info */}
      <div className="glass-panel rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-1">
              Active Document
            </p>
            <p className="text-sm font-medium text-foreground truncate">
              {documentName}
            </p>
          </div>
          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
        </div>
      </div>

      {/* Knowledge Graph */}
      <div className="glass-panel rounded-lg p-4">
        <h3 className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-3">
          Knowledge Graph
        </h3>
        <KnowledgeGraph />
      </div>

      {/* Exam Progress */}
      <div className="glass-panel rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
            Exam Progress
          </h3>
          <span className="text-xs font-mono text-foreground">
            {currentQuestion}/{totalQuestions}
          </span>
        </div>
        <Progress value={progress} className="h-2 bg-secondary" />
        <p className="text-xs text-muted-foreground mt-2 font-mono">
          {Math.round(progress)}% Complete
        </p>
      </div>
    </div>
  );
}
