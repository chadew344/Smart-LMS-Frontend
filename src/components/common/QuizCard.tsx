import { FileQuestion, Clock, CheckCircle2, Trophy } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

export interface Quiz {
  id: string;
  title: string;
  description: string;
  courseName: string;
  questions: number;
  duration: number; // in minutes
  attempts?: number;
  bestScore?: number;
  status: "not-started" | "in-progress" | "completed";
  dueDate?: string;
}

interface QuizCardProps {
  quiz: Quiz;
  onStart?: (quizId: string) => void;
  onContinue?: (quizId: string) => void;
  onReview?: (quizId: string) => void;
  className?: string;
}

const statusConfig = {
  "not-started": {
    label: "Not Started",
    color: "bg-secondary text-secondary-foreground",
    icon: FileQuestion,
  },
  "in-progress": {
    label: "In Progress",
    color: "bg-warning/10 text-warning border-warning/20",
    icon: Clock,
  },
  completed: {
    label: "Completed",
    color: "bg-success/10 text-success border-success/20",
    icon: CheckCircle2,
  },
};

export const QuizCard = ({
  quiz,
  onStart,
  onContinue,
  onReview,
  className,
}: QuizCardProps) => {
  const status = statusConfig[quiz.status];
  const StatusIcon = status.icon;

  return (
    <div
      className={cn(
        "bg-card rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50",
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <FileQuestion className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{quiz.title}</h3>
            <p className="text-sm text-muted-foreground">{quiz.courseName}</p>
          </div>
        </div>
        <Badge className={cn("border", status.color)}>
          <StatusIcon className="h-3 w-3 mr-1" />
          {status.label}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {quiz.description}
      </p>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1.5">
          <FileQuestion className="h-4 w-4" />
          <span>{quiz.questions} questions</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          <span>{quiz.duration} min</span>
        </div>
      </div>

      {quiz.bestScore !== undefined && (
        <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-secondary/50">
          <Trophy className="h-4 w-4 text-warning" />
          <span className="text-sm font-medium">
            Best Score: {quiz.bestScore}%
          </span>
          {quiz.attempts && (
            <span className="text-sm text-muted-foreground">
              ({quiz.attempts} attempts)
            </span>
          )}
        </div>
      )}

      {quiz.dueDate && (
        <p className="text-sm text-muted-foreground mb-4">
          Due:{" "}
          <span className="font-medium text-foreground">{quiz.dueDate}</span>
        </p>
      )}

      <div className="flex gap-2">
        {quiz.status === "not-started" && (
          <Button className="flex-1" onClick={() => onStart?.(quiz.id)}>
            Start Quiz
          </Button>
        )}
        {quiz.status === "in-progress" && (
          <Button className="flex-1" onClick={() => onContinue?.(quiz.id)}>
            Continue
          </Button>
        )}
        {quiz.status === "completed" && (
          <>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onReview?.(quiz.id)}
            >
              Review Answers
            </Button>
            <Button className="flex-1" onClick={() => onStart?.(quiz.id)}>
              Retake
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
