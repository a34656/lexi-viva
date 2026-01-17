import { FileText, Brain, Target, TrendingUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { DifficultyBadge, DifficultyLevel } from "./DifficultyBadge";

interface ExamSidebarProps {
  documentName: string;
  currentQuestion: number;
  totalQuestions: number;
  score: number;
  maxScore: number;
  difficulty: DifficultyLevel;
  streak: number;
  className?: string;
}

export function ExamSidebar({
  documentName,
  currentQuestion,
  totalQuestions,
  score,
  maxScore,
  difficulty,
  streak,
  className,
}: ExamSidebarProps) {
  const progressPercentage = (currentQuestion / totalQuestions) * 100;
  const scorePercentage = (score / maxScore) * 100;

  const getScoreColor = () => {
    if (scorePercentage >= 80) return "text-grade-excellent";
    if (scorePercentage >= 60) return "text-grade-good";
    if (scorePercentage >= 40) return "text-grade-average";
    return "text-grade-poor";
  };

  return (
    <aside className={cn("w-72 border-r border-border bg-sidebar p-5 overflow-y-auto scrollbar-thin", className)}>
      <div className="space-y-6">
        {/* Document Info */}
        <div className="glass-panel rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText className="w-4 h-4" />
            <span className="text-xs font-mono uppercase tracking-wider">Active Document</span>
          </div>
          <p className="text-sm font-medium text-foreground truncate" title={documentName}>
            {documentName}
          </p>
        </div>

        {/* Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Exam Progress</span>
            <span className="text-sm font-mono text-foreground">
              {currentQuestion} / {totalQuestions}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Question {currentQuestion}</span>
            <span>{Math.round(progressPercentage)}% Complete</span>
          </div>
        </div>

        {/* Live Score */}
        <div className="glass-panel rounded-lg p-5 space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono uppercase tracking-wider">Live Score</span>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="relative w-28 h-28">
              {/* Background circle */}
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="8"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(scorePercentage / 100) * 301.6} 301.6`}
                  className="transition-all duration-500"
                />
              </svg>
              {/* Score text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={cn("text-3xl font-bold font-mono", getScoreColor())}>
                  {score}
                </span>
                <span className="text-xs text-muted-foreground">/ {maxScore}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Difficulty */}
        <div className="glass-panel rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Brain className="w-4 h-4 text-accent" />
            <span className="text-xs font-mono uppercase tracking-wider">Difficulty Level</span>
          </div>
          <div className="flex justify-center">
            <DifficultyBadge level={difficulty} size="lg" showLabel />
          </div>
        </div>

        {/* Answer Streak */}
        {streak > 0 && (
          <div className="glass-panel rounded-lg p-4 space-y-2 border-l-4 border-l-grade-excellent animate-slide-in">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-grade-excellent" />
              <span className="text-sm font-medium text-foreground">
                {streak} Answer Streak!
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Keep it up! Consistent performance unlocks harder questions.
            </p>
          </div>
        )}

        {/* Mode Indicator */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-mono">
              {currentQuestion <= 2 ? "EASY MODE • Fundamentals" : "HARD MODE • Synthesis"}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
