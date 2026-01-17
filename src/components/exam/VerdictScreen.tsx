import { cn } from "@/lib/utils";
import { Trophy, Award, RotateCcw, Download, Share2, CheckCircle, XCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface VerdictScreenProps {
  totalScore: number;
  maxScore: number;
  questionsAnswered: number;
  totalQuestions: number;
  strengths: StrengthWeakness[];
  onRetry: () => void;
  onNewExam: () => void;
}

export function VerdictScreen({
  totalScore,
  maxScore,
  questionsAnswered,
  totalQuestions,
  strengths,
  onRetry,
  onNewExam,
}: VerdictScreenProps) {
  const percentage = Math.round((totalScore / maxScore) * 100);
  const isPassed = percentage >= 60;
  
  const getGrade = () => {
    if (percentage >= 90) return { grade: "A+", label: "Exceptional", color: "text-grade-excellent" };
    if (percentage >= 80) return { grade: "A", label: "Excellent", color: "text-grade-excellent" };
    if (percentage >= 70) return { grade: "B", label: "Good", color: "text-grade-good" };
    if (percentage >= 60) return { grade: "C", label: "Satisfactory", color: "text-grade-average" };
    if (percentage >= 50) return { grade: "D", label: "Needs Improvement", color: "text-grade-average" };
    return { grade: "F", label: "Failed", color: "text-grade-poor" };
  };

  const gradeInfo = getGrade();

  return (
    <div className="min-h-screen flex items-center justify-center neural-container px-4 py-12">
      <div className="max-w-4xl w-full space-y-8 animate-scale-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className={cn(
              "w-24 h-24 rounded-full flex items-center justify-center animate-float",
              isPassed 
                ? "bg-grade-excellent/20 border-2 border-grade-excellent glow-primary" 
                : "bg-grade-poor/20 border-2 border-grade-poor"
            )}>
              {isPassed ? (
                <Trophy className="w-12 h-12 text-grade-excellent" />
              ) : (
                <XCircle className="w-12 h-12 text-grade-poor" />
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">
              {isPassed ? (
                <span className="gradient-text">Examination Complete</span>
              ) : (
                <span className="text-foreground">Examination Complete</span>
              )}
            </h1>
            <p className="text-lg text-muted-foreground">
              {isPassed 
                ? "Congratulations! You have successfully defended your research."
                : "Your defense requires additional preparation."
              }
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Score Card */}
          <div className="glass-panel-strong rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold">Final Verdict</h2>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground font-mono uppercase tracking-wider">
                  Total Score
                </p>
                <div className="flex items-baseline gap-2">
                  <span className={cn("text-5xl font-bold font-mono", gradeInfo.color)}>
                    {totalScore}
                  </span>
                  <span className="text-xl text-muted-foreground font-mono">
                    / {maxScore}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {questionsAnswered} of {totalQuestions} questions evaluated
                </p>
              </div>

              <div className={cn(
                "w-24 h-24 rounded-full flex flex-col items-center justify-center border-4",
                isPassed 
                  ? "border-grade-excellent bg-grade-excellent/10" 
                  : "border-grade-poor bg-grade-poor/10"
              )}>
                <span className={cn("text-3xl font-bold", gradeInfo.color)}>
                  {gradeInfo.grade}
                </span>
                <span className="text-xs text-muted-foreground mt-0.5">
                  {gradeInfo.label}
                </span>
              </div>
            </div>

            {/* Pass/Fail Status */}
            <div className={cn(
              "flex items-center gap-3 p-4 rounded-lg",
              isPassed ? "bg-grade-excellent/10" : "bg-grade-poor/10"
            )}>
              {isPassed ? (
                <CheckCircle className="w-5 h-5 text-grade-excellent" />
              ) : (
                <XCircle className="w-5 h-5 text-grade-poor" />
              )}
              <span className={cn("font-semibold", isPassed ? "text-grade-excellent" : "text-grade-poor")}>
                {isPassed ? "PASSED" : "FAILED"} — {percentage}% Overall Performance
              </span>
            </div>
          </div>

          {/* Radar Chart */}
          <div className="glass-panel-strong rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Star className="w-6 h-6 text-accent" />
              <h2 className="text-xl font-semibold">Performance Analysis</h2>
            </div>
            
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={strengths} cx="50%" cy="50%" outerRadius="75%">
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }}
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
        </div>

        {/* Certificate (only if passed) */}
        {isPassed && (
          <div className="certificate rounded-xl p-8 text-center space-y-4 animate-slide-up delay-200">
            <div className="flex justify-center gap-2">
              {[...Array(3)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-primary fill-primary" />
              ))}
            </div>
            <h3 className="text-2xl font-serif font-semibold gradient-text">
              Certificate of Defence
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              This certifies that the candidate has successfully defended their research 
              under rigorous AI examination with a score of <strong>{percentage}%</strong>.
            </p>
            <p className="text-sm font-mono text-muted-foreground">
              Issued by Lexicognition AI • {new Date().toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Button variant="outline" className="gap-2" onClick={onNewExam}>
            <RotateCcw className="w-4 h-4" />
            New Examination
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Download Report
          </Button>
          <Button variant="outline" className="gap-2">
            <Share2 className="w-4 h-4" />
            Share Results
          </Button>
          {!isPassed && (
            <Button className="gap-2 bg-primary hover:bg-primary/90" onClick={onRetry}>
              <RotateCcw className="w-4 h-4" />
              Retry Examination
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
