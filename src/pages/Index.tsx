import { useState } from "react";
import { LandingUpload } from "@/components/exam/LandingUpload";
import { ExamInterface } from "@/components/exam/ExamInterface";
import { VerdictScreen } from "@/components/exam/VerdictScreen";
import { TooltipProvider } from "@/components/ui/tooltip";

type AppState = "landing" | "processing" | "exam" | "verdict";

interface ExamResult {
  score: number;
  maxScore: number;
  strengths: { subject: string; score: number; fullMark: number }[];
}

const Index = () => {
  const [appState, setAppState] = useState<AppState>("landing");
  const [documentName, setDocumentName] = useState("");
  const [examResult, setExamResult] = useState<ExamResult | null>(null);

  const handleFileUpload = (file: File) => {
    setDocumentName(file.name || "attention_is_all_you_need.pdf");
    setAppState("processing");
    
    // Simulate processing time
    setTimeout(() => {
      setAppState("exam");
    }, 3000);
  };

  const handleExamComplete = (score: number, maxScore: number, strengths: any[]) => {
    setExamResult({ score, maxScore, strengths });
    setAppState("verdict");
  };

  const handleRetry = () => {
    setExamResult(null);
    setAppState("exam");
  };

  const handleNewExam = () => {
    setDocumentName("");
    setExamResult(null);
    setAppState("landing");
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {appState === "landing" && (
          <LandingUpload onFileUpload={handleFileUpload} isProcessing={false} />
        )}
        
        {appState === "processing" && (
          <LandingUpload onFileUpload={handleFileUpload} isProcessing={true} />
        )}
        
        {appState === "exam" && (
          <ExamInterface 
            documentName={documentName} 
            onExamComplete={handleExamComplete} 
          />
        )}
        
        {appState === "verdict" && examResult && (
          <VerdictScreen
            totalScore={examResult.score}
            maxScore={examResult.maxScore}
            questionsAnswered={5}
            totalQuestions={5}
            strengths={examResult.strengths}
            onRetry={handleRetry}
            onNewExam={handleNewExam}
          />
        )}
      </div>
    </TooltipProvider>
  );
};

export default Index;
