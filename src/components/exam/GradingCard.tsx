import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, AlertTriangle, Lightbulb } from "lucide-react";

interface GradingCardProps {
  score: number;
  maxScore?: number;
  feedback: string;
  devilsAdvocate?: string;
  className?: string;
}

export function GradingCard({ 
  score, 
  maxScore = 10, 
  feedback, 
  devilsAdvocate,
  className 
}: GradingCardProps) {
  const percentage = (score / maxScore) * 100;
  
  const getScoreColor = () => {
    if (percentage >= 80) return "text-grade-excellent";
    if (percentage >= 60) return "text-grade-good";
    if (percentage >= 40) return "text-grade-average";
    return "text-grade-poor";
  };

  const getScoreBg = () => {
    if (percentage >= 80) return "bg-grade-excellent/10 border-grade-excellent/30";
    if (percentage >= 60) return "bg-grade-good/10 border-grade-good/30";
    if (percentage >= 40) return "bg-grade-average/10 border-grade-average/30";
    return "bg-grade-poor/10 border-grade-poor/30";
  };

  const getIcon = () => {
    if (percentage >= 80) return <CheckCircle className="w-5 h-5 text-grade-excellent" />;
    if (percentage >= 60) return <CheckCircle className="w-5 h-5 text-grade-good" />;
    if (percentage >= 40) return <AlertTriangle className="w-5 h-5 text-grade-average" />;
    return <XCircle className="w-5 h-5 text-grade-poor" />;
  };

  return (
    <div className={cn("space-y-4 animate-slide-in", className)}>
      {/* Main Grading Card */}
      <div className={cn(
        "glass-panel rounded-lg p-5 border-l-4",
        getScoreBg()
      )}>
        {/* Score Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {getIcon()}
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Answer Graded
            </span>
          </div>
          <div className={cn(
            "px-4 py-2 rounded-full font-mono font-bold text-lg",
            getScoreBg(),
            getScoreColor()
          )}>
            {score}/{maxScore}
          </div>
        </div>

        {/* Feedback */}
        <div className="space-y-2">
          <p className="text-foreground leading-relaxed">
            {feedback}
          </p>
        </div>
      </div>

      {/* Devil's Advocate Challenge */}
      {devilsAdvocate && (
        <div className="glass-panel rounded-lg p-5 border-l-4 border-l-difficulty-devils bg-difficulty-devils/5 animate-slide-in delay-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-difficulty-devils/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Lightbulb className="w-4 h-4 text-difficulty-devils" />
            </div>
            <div className="space-y-2">
              <span className="text-sm font-semibold text-difficulty-devils uppercase tracking-wider">
                Devil's Advocate
              </span>
              <p className="text-foreground leading-relaxed font-serif italic">
                "{devilsAdvocate}"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
