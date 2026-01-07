import {
  PlayCircle,
  FileQuestion,
  BookOpen,
  FolderOpen,
  Lock,
  CheckCircle2,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import type { Module, Lesson } from "../../data/lessonData";
import { cn } from "../../lib/utils";

interface LessonListProps {
  modules: Module[];
  currentLessonId: string;
  onSelectLesson: (lesson: Lesson) => void;
}

const lessonTypeIcons = {
  video: PlayCircle,
  quiz: FileQuestion,
  reading: BookOpen,
  assignment: FolderOpen,
};

export const LessonList = ({
  modules,
  currentLessonId,
  onSelectLesson,
}: LessonListProps) => {
  const getModuleProgress = (module: Module) => {
    const completed = module.lessons.filter((l) => l.isCompleted).length;
    return Math.round((completed / module.lessons.length) * 100);
  };

  return (
    <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Course Content</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons
        </p>
      </div>

      <Accordion type="multiple" defaultValue={["1"]} className="w-full">
        {modules.map((module) => (
          <AccordionItem
            key={module.id}
            value={module.id}
            className="border-border"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-secondary/50">
              <div className="flex items-center gap-3 text-left">
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">
                    {module.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {module.lessons.length} lessons •{" "}
                    {getModuleProgress(module)}% complete
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-0">
              <div className="divide-y divide-border/50">
                {module.lessons.map((lesson) => {
                  const Icon = lessonTypeIcons[lesson.type];
                  const isActive = lesson.id === currentLessonId;

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => !lesson.isLocked && onSelectLesson(lesson)}
                      disabled={lesson.isLocked}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                        isActive ? "bg-primary/10" : "hover:bg-secondary/50",
                        lesson.isLocked && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <div
                        className={cn(
                          "p-2 rounded-lg",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary"
                        )}
                      >
                        {lesson.isLocked ? (
                          <Lock className="h-4 w-4" />
                        ) : lesson.isCompleted ? (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        ) : (
                          <Icon
                            className={cn(
                              "h-4 w-4",
                              isActive && "text-primary-foreground"
                            )}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-sm font-medium truncate",
                            isActive ? "text-primary" : "text-foreground"
                          )}
                        >
                          {lesson.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {lesson.duration}
                        </p>
                      </div>
                      {lesson.isCompleted && !lesson.isLocked && (
                        <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
