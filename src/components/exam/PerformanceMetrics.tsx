import { TrendingUp, TrendingDown, AlertTriangle, Target, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { DifficultyBadge, DifficultyLevel } from "./DifficultyBadge";

interface LogicalGap {
  id: string;
  description: string;
  severity: "low" | "medium" | "high";
}

interface PerformanceMetricsProps {
  score: number;
  maxScore: number;
  difficulty: DifficultyLevel;
  streak: number;
  logicalGaps: LogicalGap[];
  className?: string;
}

export function PerformanceMetrics({ 
  score, 
  maxScore, 
  difficulty, 
  streak,
  logicalGaps,
  className 
}: PerformanceMetricsProps) {
  const scorePercentage = (score / maxScore) * 100;
  const isPositiveScore = scorePercentage >= 60;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Current Difficulty */}
      <div className="glass-panel rounded-lg p-4">
        <h3 className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-3">
          Difficulty Level
        </h3>
        <DifficultyBadge level={difficulty} />
      </div>

      {/* Score */}
      <div className="glass-panel rounded-lg p-4">
        <h3 className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-3">
          Current Score
        </h3>
        <div className="flex items-end gap-2">
          <span className={cn(
            "text-4xl font-bold font-mono",
            isPositiveScore ? "text-metric-positive" : "text-metric-negative"
          )}>
            {score}
          </span>
          <span className="text-lg text-muted-foreground font-mono mb-1">
            / {maxScore}
          </span>
          {isPositiveScore ? (
            <TrendingUp className="w-5 h-5 text-metric-positive mb-1.5 ml-auto" />
          ) : (
            <TrendingDown className="w-5 h-5 text-metric-negative mb-1.5 ml-auto" />
          )}
        </div>
        <div className="mt-3 h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full transition-all duration-500 rounded-full",
              isPositiveScore ? "bg-metric-positive" : "bg-metric-negative"
            )}
            style={{ width: `${scorePercentage}%` }}
          />
        </div>
      </div>

      {/* Answer Streak */}
      <div className="glass-panel rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-1">
              Answer Streak
            </h3>
            <div className="flex items-center gap-2">
              <Zap className={cn(
                "w-5 h-5",
                streak > 0 ? "text-difficulty-hard" : "text-muted-foreground"
              )} />
              <span className={cn(
                "text-2xl font-bold font-mono",
                streak > 0 ? "text-difficulty-hard" : "text-muted-foreground"
              )}>
                {streak}
              </span>
            </div>
          </div>
          <Target className="w-8 h-8 text-muted-foreground/50" />
        </div>
      </div>

      {/* Logical Gaps */}
      <div className="glass-panel rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-difficulty-hard" />
          <h3 className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
            Logical Gaps Detected
          </h3>
        </div>
        
        {logicalGaps.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            No logical gaps detected yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {logicalGaps.map((gap) => (
              <li 
                key={gap.id}
                className={cn(
                  "text-sm p-2 rounded border-l-2",
                  gap.severity === "high" && "border-l-destructive bg-destructive/10 text-destructive",
                  gap.severity === "medium" && "border-l-difficulty-hard bg-difficulty-hard/10 text-difficulty-hard",
                  gap.severity === "low" && "border-l-muted-foreground bg-muted/50 text-muted-foreground"
                )}
              >
                {gap.description}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
