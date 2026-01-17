import { useState, useCallback } from "react";
import { Upload, FileText, Brain, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { NeuralAnimation } from "./NeuralAnimation";

interface LandingUploadProps {
  onFileUpload: (file: File) => void;
  isProcessing?: boolean;
}

export function LandingUpload({ onFileUpload, isProcessing = false }: LandingUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === "application/pdf") {
      onFileUpload(files[0]);
    }
  }, [onFileUpload]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileUpload(files[0]);
    }
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center neural-container">
        <div className="text-center space-y-8 animate-fade-in">
          <NeuralAnimation />
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">
              Extracting Core Concepts...
            </h2>
            <p className="text-muted-foreground font-mono text-sm">
              Building Knowledge Graph • Preparing Examination Protocol
            </p>
          </div>
          <div className="flex justify-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full thinking-pulse" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-accent rounded-full thinking-pulse" style={{ animationDelay: '200ms' }} />
            <span className="w-2 h-2 bg-secondary rounded-full thinking-pulse" style={{ animationDelay: '400ms' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center neural-container px-4">
      <div className="max-w-2xl w-full space-y-12 animate-slide-up">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 flex items-center justify-center border border-primary/30 glow-dual">
                <Brain className="w-10 h-10 text-primary" />
              </div>
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-accent animate-float" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="gradient-text">Lexicognition</span>
            <span className="text-foreground"> AI</span>
          </h1>
          
          <p className="text-xl text-muted-foreground font-serif italic">
            "Defend your research. Face the AI Examiner."
          </p>
        </div>

        {/* Upload Zone */}
        <div
          className={cn(
            "upload-zone cursor-pointer group",
            isDragging && "drag-over"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <input
            id="file-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <div className="flex flex-col items-center gap-6">
            <div className={cn(
              "w-16 h-16 rounded-full bg-muted flex items-center justify-center transition-all duration-300",
              "group-hover:bg-primary/20 group-hover:scale-110",
              isDragging && "bg-primary/20 scale-110"
            )}>
              {isDragging ? (
                <FileText className="w-8 h-8 text-primary" />
              ) : (
                <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
              )}
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-lg font-medium text-foreground">
                {isDragging ? "Drop your research paper here" : "Drag & drop your PDF"}
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse • PDF files only
              </p>
            </div>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground font-mono">
            DEMO MODE: Upload any PDF or click to simulate with "Attention Is All You Need"
          </p>
          <button 
            onClick={() => onFileUpload(new File([], "attention_is_all_you_need.pdf", { type: "application/pdf" }))}
            className="mt-3 text-sm text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
          >
            Try Demo Paper →
          </button>
        </div>
      </div>
    </div>
  );
}
