import { useState } from "react";
import { ExamHeader } from "@/components/exam/ExamHeader";
import { DocumentStatus } from "@/components/exam/DocumentStatus";
import { ExaminerBubble } from "@/components/exam/ExaminerBubble";
import { ResponseBox } from "@/components/exam/ResponseBox";
import { PerformanceMetrics } from "@/components/exam/PerformanceMetrics";
import { PostExamReport } from "@/components/exam/PostExamReport";
import { DifficultyLevel } from "@/components/exam/DifficultyBadge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

// Mock data for demonstration
const mockQuestions = [
  {
    id: 1,
    question: "Can you explain the primary hypothesis of your research paper and how it differs from existing theories in the field?",
    source: { page: 3, section: "Abstract & Introduction" },
  },
  {
    id: 2,
    question: "Your methodology section mentions a novel sampling approach. Walk me through the rationale behind this choice and its potential limitations.",
    source: { page: 12, section: "Methodology" },
  },
  {
    id: 3,
    question: "The data shows an unexpected correlation in Figure 4. How do you account for this anomaly within your theoretical framework?",
    source: { page: 24, section: "Results & Analysis" },
  },
];

const mockStrengths = [
  { subject: "Methodology", score: 85, fullMark: 100 },
  { subject: "Analysis", score: 70, fullMark: 100 },
  { subject: "Theory", score: 90, fullMark: 100 },
  { subject: "Critical Thinking", score: 65, fullMark: 100 },
  { subject: "Communication", score: 80, fullMark: 100 },
  { subject: "Domain Knowledge", score: 75, fullMark: 100 },
];

const Index = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [score, setScore] = useState(72);
  const [streak, setStreak] = useState(3);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("hard");
  const [showReport, setShowReport] = useState(false);
  const [logicalGaps, setLogicalGaps] = useState([
    { id: "1", description: "Missing causal link between variables X and Y", severity: "medium" as const },
    { id: "2", description: "Incomplete justification for sample size", severity: "low" as const },
  ]);

  const currentQuestion = mockQuestions[currentQuestionIndex];

  const handleSubmitResponse = async (response: string) => {
    setIsSubmitting(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    
    // Simulate moving to next question
    setIsThinking(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setScore(prev => prev + Math.floor(Math.random() * 10) + 5);
      setStreak(prev => prev + 1);
      
      // Randomly adjust difficulty
      const difficulties: DifficultyLevel[] = ["easy", "hard", "devils-advocate"];
      setDifficulty(difficulties[Math.floor(Math.random() * difficulties.length)]);
    } else {
      setShowReport(true);
    }
    
    setIsThinking(false);
  };

  const handleRetry = () => {
    setShowReport(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setStreak(0);
    setDifficulty("easy");
    setLogicalGaps([]);
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <ExamHeader />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Document Status */}
        <aside className="w-72 border-r border-border bg-sidebar p-4 overflow-y-auto scrollbar-thin hidden lg:block">
          <DocumentStatus
            documentName="research_paper_2024_final.pdf"
            totalQuestions={mockQuestions.length}
            currentQuestion={currentQuestionIndex + 1}
          />
        </aside>

        {/* Main Content - Chat Interface */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 p-6">
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Previous questions could be rendered here */}
              
              {/* Current Question */}
              <ExaminerBubble
                question={currentQuestion.question}
                isThinking={isThinking}
                sourceReference={currentQuestion.source}
              />
            </div>
          </ScrollArea>

          {/* Response Area */}
          <div className="p-6 border-t border-border bg-card/30">
            <div className="max-w-3xl mx-auto">
              <ResponseBox
                onSubmit={handleSubmitResponse}
                isSubmitting={isSubmitting}
                disabled={isThinking}
                placeholder="Articulate your response to the examiner's question..."
              />
            </div>
          </div>
        </main>

        {/* Right Sidebar - Performance Metrics */}
        <aside className="w-72 border-l border-border bg-sidebar p-4 overflow-y-auto scrollbar-thin hidden xl:block">
          <PerformanceMetrics
            score={score}
            maxScore={100}
            difficulty={difficulty}
            streak={streak}
            logicalGaps={logicalGaps}
          />
        </aside>
      </div>

      {/* Mobile Toggle Buttons */}
      <div className="lg:hidden fixed bottom-24 right-4 flex flex-col gap-2">
        <Button
          size="sm"
          variant="secondary"
          className="rounded-full shadow-lg"
          onClick={() => setShowReport(true)}
        >
          View Report
        </Button>
      </div>

      {/* Post-Exam Report Modal */}
      <PostExamReport
        open={showReport}
        onOpenChange={setShowReport}
        finalScore={score}
        maxScore={100}
        totalQuestions={mockQuestions.length}
        correctAnswers={Math.floor(score / 30)}
        strengths={mockStrengths}
        onRetry={handleRetry}
      />
    </div>
  );
};

export default Index;
