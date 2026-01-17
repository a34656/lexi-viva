import { GraduationCap, Settings, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExamHeader() {
  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center glow-primary">
          <GraduationCap className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-bold text-foreground tracking-tight">
            Lexicognition AI
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            Autonomous Viva Voce Interface
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <HelpCircle className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
