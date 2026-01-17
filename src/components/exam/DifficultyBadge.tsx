import { cn } from "@/lib/utils";

export type DifficultyLevel = "easy" | "hard" | "devils-advocate";

interface DifficultyBadgeProps {
  level: DifficultyLevel;
  className?: string;
}

const difficultyConfig = {
  easy: {
    label: "Easy",
    className: "bg-difficulty-easy/20 text-difficulty-easy border-difficulty-easy/50",
  },
  hard: {
    label: "Hard",
    className: "bg-difficulty-hard/20 text-difficulty-hard border-difficulty-hard/50",
  },
  "devils-advocate": {
    label: "Devil's Advocate",
    className: "bg-difficulty-devils/20 text-difficulty-devils border-difficulty-devils/50",
  },
};

export function DifficultyBadge({ level, className }: DifficultyBadgeProps) {
  const config = difficultyConfig[level];

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border font-mono uppercase tracking-wider transition-all duration-300",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
