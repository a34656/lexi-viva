import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Share2, RotateCcw, Trophy, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

interface StrengthWeakness {
  subject: string;
  score: number;
  fullMark: number;
}

interface PostExamReportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  finalScore: number;
  maxScore: number;
  totalQuestions: number;
  correctAnswers: number;
  strengths: StrengthWeakness[];
  onRetry?: () => void;
}

export function PostExamReport({
  open,
  onOpenChange,
  finalScore,
  maxScore,
  totalQuestions,
  correctAnswers,
  strengths,
  onRetry,
}: PostExamReportProps) {
  const percentage = Math.round((finalScore / maxScore) * 100);
  const grade = 
    percentage >= 90 ? "A" :
    percentage >= 80 ? "B" :
    percentage >= 70 ? "C" :
    percentage >= 60 ? "D" : "F";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <Trophy className="w-6 h-6 text-primary" />
            Post-Exam Report
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Score Summary */}
          <div className="flex items-center justify-between p-6 glass-panel rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground font-mono uppercase tracking-wider mb-2">
                Final Score
              </p>
              <div className="flex items-baseline gap-2">
                <span className={cn(
                  "text-5xl font-bold font-mono",
                  percentage >= 60 ? "text-metric-positive" : "text-metric-negative"
                )}>
                  {finalScore}
                </span>
                <span className="text-xl text-muted-foreground font-mono">
                  / {maxScore}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {correctAnswers} of {totalQuestions} questions answered correctly
              </p>
            </div>
            
            <div className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center border-4",
              percentage >= 60 
                ? "border-metric-positive bg-metric-positive/20" 
                : "border-metric-negative bg-metric-negative/20"
            )}>
              <span className={cn(
                "text-3xl font-bold",
                percentage >= 60 ? "text-metric-positive" : "text-metric-negative"
              )}>
                {grade}
              </span>
            </div>
          </div>

          {/* Strengths vs Weaknesses Radar Chart */}
          <div className="glass-panel rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-accent" />
              <h3 className="font-semibold">Strengths vs. Weaknesses</h3>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={strengths} cx="50%" cy="50%" outerRadius="80%">
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                  />
                  <Radar
                    name="Performance"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" className="gap-2">
              <Share2 className="w-4 h-4" />
              Share Results
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Download Report
            </Button>
            {onRetry && (
              <Button onClick={onRetry} className="gap-2 bg-primary hover:bg-primary/90">
                <RotateCcw className="w-4 h-4" />
                Try Again
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
