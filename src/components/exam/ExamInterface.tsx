import { useState, useEffect, useRef } from "react";
import { ExamSidebar } from "./ExamSidebar";
import { ChatMessage, Message } from "./ChatMessage";
import { ResponseBox } from "./ResponseBox";
import { DifficultyLevel } from "./DifficultyBadge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Settings, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExamInterfaceProps {
  documentName: string;
  onExamComplete: (score: number, maxScore: number, strengths: any[]) => void;
}

// Mock exam data for "Attention Is All You Need"
const mockExamFlow = [
  {
    question: "Let's begin with the fundamentals. Can you explain what Self-Attention is and why it's considered revolutionary in the context of sequence modeling?",
    difficulty: "easy" as DifficultyLevel,
    source: { page: 3, section: "Introduction" },
    mockGrading: {
      high: { score: 9, feedback: "Excellent explanation! You've correctly identified that self-attention allows the model to weigh the importance of different positions in a sequence. Your understanding of the relationship between query, key, and value vectors is precise.", devilsAdvocate: "But wouldn't computing attention between all positions lead to quadratic complexity? How does the Transformer address this scalability concern?" },
      medium: { score: 6, feedback: "Good attempt, but you missed some key details. Self-attention isn't just about relating positions—it's specifically about computing a weighted sum where weights are determined by compatibility between elements.", devilsAdvocate: undefined },
      low: { score: 3, feedback: "Your answer conflates attention mechanisms with other concepts. Self-attention specifically refers to relating different positions of a single sequence to compute a representation. Review Section 3.2.", devilsAdvocate: undefined },
    }
  },
  {
    question: "Why does the Transformer architecture use Multi-Head Attention instead of a single attention function? What specific benefits does this design choice provide?",
    difficulty: "easy" as DifficultyLevel,
    source: { page: 5, section: "Multi-Head Attention" },
    mockGrading: {
      high: { score: 8, feedback: "Good understanding. Multi-head attention allows the model to jointly attend to information from different representation subspaces. You correctly noted that different heads can focus on different aspects of relationships.", devilsAdvocate: "If multi-head is so beneficial, why not use more heads indefinitely? What's the trade-off?" },
      medium: { score: 5, feedback: "Partially correct. While you mentioned parallel attention, the key insight is that each head learns different types of relationships. The concatenation and projection step is crucial for combining these perspectives.", devilsAdvocate: undefined },
      low: { score: 2, feedback: "Your answer suggests multi-head attention is primarily for computational parallelism. The actual motivation is representational—allowing the model to capture different types of relationships simultaneously.", devilsAdvocate: undefined },
    }
  },
  {
    question: "The paper introduces Positional Encoding using sinusoidal functions. Why was this approach chosen over learned positional embeddings, and what mathematical property makes sinusoids particularly suitable?",
    difficulty: "hard" as DifficultyLevel,
    source: { page: 6, section: "Positional Encoding" },
    mockGrading: {
      high: { score: 9, feedback: "Outstanding! You correctly identified that sinusoidal encodings allow the model to extrapolate to sequence lengths longer than those seen during training. The property that PE(pos+k) can be represented as a linear function of PE(pos) is key to learning relative positions.", devilsAdvocate: "Modern architectures like GPT use learned positional embeddings. Does this mean the original reasoning was flawed?" },
      medium: { score: 6, feedback: "You understand the extrapolation benefit but missed the linear relationship property. The sinusoids were specifically chosen because they encode relative position information implicitly through their mathematical properties.", devilsAdvocate: undefined },
      low: { score: 3, feedback: "The answer focuses on implementation simplicity, but the actual reason is more nuanced. Review the paper's hypothesis about the model learning to attend by relative positions.", devilsAdvocate: undefined },
    }
  },
  {
    question: "Analyze the computational complexity trade-offs between the Transformer's self-attention mechanism and traditional recurrent approaches. In what scenarios might RNNs still be preferable?",
    difficulty: "hard" as DifficultyLevel,
    source: { page: 7, section: "Computational Complexity" },
    mockGrading: {
      high: { score: 10, feedback: "Masterful analysis! You correctly compared O(n²·d) for self-attention vs O(n·d²) for recurrence, and identified that for very long sequences where n > d, self-attention becomes less efficient. Your point about streaming scenarios favoring RNNs demonstrates deep understanding.", devilsAdvocate: "Given these limitations, how do you explain the Transformer's dominance in virtually all sequence modeling tasks today?" },
      medium: { score: 7, feedback: "Good complexity analysis, but the scenario comparison could be deeper. Consider memory constraints, not just computation. RNNs process tokens one at a time, which can be beneficial for memory-limited streaming applications.", devilsAdvocate: undefined },
      low: { score: 4, feedback: "The complexity comparison is incomplete. Self-attention has O(n²) space complexity which becomes prohibitive for very long sequences. This is a practical limitation not addressed in your answer.", devilsAdvocate: undefined },
    }
  },
  {
    question: "The Transformer has become the foundation for models like BERT and GPT. Based on the original paper's design, what do you consider the most significant architectural innovation, and how has it influenced the trajectory of NLP research?",
    difficulty: "devils-advocate" as DifficultyLevel,
    source: { page: 10, section: "Conclusion" },
    mockGrading: {
      high: { score: 10, feedback: "Exceptional synthesis! You've connected the paper's innovations to their broader impact. The observation that eliminating recurrence enabled unprecedented parallelization, which in turn enabled scaling, which enabled emergent capabilities—this is exactly the kind of deep reasoning we expect at this level.", devilsAdvocate: "Some argue the Transformer's success is more about scale than architecture. How would you respond to this critique?" },
      medium: { score: 7, feedback: "Good high-level understanding, but the analysis could be more precise. The key isn't just 'attention is useful'—it's that the specific combination of self-attention, layer normalization, and feed-forward networks created a highly scalable architecture.", devilsAdvocate: undefined },
      low: { score: 5, feedback: "While you mentioned important concepts, the answer lacks the synthesis expected at this stage. Connect the architectural choices to why they specifically enabled the subsequent breakthroughs in NLP.", devilsAdvocate: undefined },
    }
  }
];

export function ExamInterface({ documentName, onExamComplete }: ExamInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("easy");
  const scrollRef = useRef<HTMLDivElement>(null);

  const maxScore = mockExamFlow.length * 10;
  const totalQuestions = mockExamFlow.length;

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  // Initial question
  useEffect(() => {
    const timer = setTimeout(() => {
      const firstQuestion = mockExamFlow[0];
      setMessages([{
        id: "q1",
        role: "examiner",
        content: firstQuestion.question,
        timestamp: new Date(),
        sourceReference: firstQuestion.source,
        difficulty: firstQuestion.difficulty,
      }]);
      setDifficulty(firstQuestion.difficulty);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmitResponse = async (response: string) => {
    setIsSubmitting(true);
    
    // Add student message
    const studentMsgId = `s${currentQuestionIndex}`;
    const studentMessage: Message = {
      id: studentMsgId,
      role: "student",
      content: response,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, studentMessage]);
    
    // Simulate grading delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Determine grading based on response length (mock logic)
    const currentQ = mockExamFlow[currentQuestionIndex];
    let gradingLevel: "high" | "medium" | "low";
    if (response.length > 200) {
      gradingLevel = "high";
    } else if (response.length > 100) {
      gradingLevel = "medium";
    } else {
      gradingLevel = "low";
    }
    
    const grading = currentQ.mockGrading[gradingLevel];
    
    // Update student message with grading
    setMessages(prev => prev.map(m => 
      m.id === studentMsgId 
        ? { ...m, grading: { score: grading.score, feedback: grading.feedback, devilsAdvocate: grading.devilsAdvocate } }
        : m
    ));
    
    setTotalScore(prev => prev + grading.score);
    
    // Update streak
    if (grading.score >= 7) {
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
    
    setIsSubmitting(false);

    // Check if exam is complete
    if (currentQuestionIndex >= mockExamFlow.length - 1) {
      // Exam complete
      await new Promise(resolve => setTimeout(resolve, 2000));
      const strengths = [
        { subject: "Fundamentals", score: 85, fullMark: 100 },
        { subject: "Architecture", score: 70, fullMark: 100 },
        { subject: "Complexity Analysis", score: 90, fullMark: 100 },
        { subject: "Critical Thinking", score: 75, fullMark: 100 },
        { subject: "Synthesis", score: 80, fullMark: 100 },
        { subject: "Communication", score: 85, fullMark: 100 },
      ];
      onExamComplete(totalScore + grading.score, maxScore, strengths);
      return;
    }
    
    // Move to next question after delay
    setIsThinking(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const nextIndex = currentQuestionIndex + 1;
    const nextQuestion = mockExamFlow[nextIndex];
    
    setMessages(prev => [...prev, {
      id: `q${nextIndex + 1}`,
      role: "examiner",
      content: nextQuestion.question,
      timestamp: new Date(),
      sourceReference: nextQuestion.source,
      difficulty: nextQuestion.difficulty,
    }]);
    
    setCurrentQuestionIndex(nextIndex);
    setDifficulty(nextQuestion.difficulty);
    setIsThinking(false);
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-border bg-card/50 backdrop-blur-lg flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
            <Brain className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground text-sm">Lexicognition AI</h1>
            <p className="text-xs text-muted-foreground font-mono">Viva Voce Examination</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <ExamSidebar
          documentName={documentName}
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={totalQuestions}
          score={totalScore}
          maxScore={maxScore}
          difficulty={difficulty}
          streak={streak}
          className="hidden lg:block"
        />

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 p-6" ref={scrollRef}>
            <div className="max-w-3xl mx-auto space-y-6 pb-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              
              {/* Thinking indicator */}
              {isThinking && (
                <ChatMessage
                  message={{
                    id: "thinking",
                    role: "examiner",
                    content: "",
                    timestamp: new Date(),
                  }}
                  isThinking
                />
              )}
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
      </div>
    </div>
  );
}
