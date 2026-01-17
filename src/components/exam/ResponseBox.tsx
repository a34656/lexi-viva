import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Mic, MicOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResponseBoxProps {
  onSubmit: (response: string) => void;
  isSubmitting?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function ResponseBox({ 
  onSubmit, 
  isSubmitting = false, 
  disabled = false,
  placeholder = "Type your response here...",
  className 
}: ResponseBoxProps) {
  const [response, setResponse] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = () => {
    if (response.trim() && !isSubmitting && !disabled) {
      onSubmit(response.trim());
      setResponse("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Voice recording functionality would be implemented here
  };

  return (
    <div className={cn("relative", className)}>
      <div className="glass-panel rounded-lg p-4">
        <Textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isSubmitting}
          className={cn(
            "min-h-[120px] bg-transparent border-0 resize-none text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0",
            "font-sans text-base leading-relaxed"
          )}
        />
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <span>⌘ + Enter to submit</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={toggleRecording}
              disabled={disabled || isSubmitting}
              className={cn(
                "h-9 w-9 rounded-full transition-all",
                isRecording && "bg-destructive/20 text-destructive hover:bg-destructive/30"
              )}
            >
              {isRecording ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              onClick={handleSubmit}
              disabled={!response.trim() || isSubmitting || disabled}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Answer
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
