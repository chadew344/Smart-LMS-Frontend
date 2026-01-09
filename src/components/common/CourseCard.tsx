import { useNavigate } from "react-router-dom";
import { Clock, Users, Star, BookOpen, PlayCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ProgressBar } from "./ProgressBar";
import { UserAvatar } from "./UserAvatar";
import { cn } from "../../lib/utils";
import {
  CategoryLabels,
  type Course,
  type EnrollmentStatus,
} from "../../types";
import placeholderImage from "../../assets/course-placeholder.svg";
import { useAppSelector } from "../../store/hook";

interface CourseCardProps {
  course: Course;
  variant?: "default" | "compact" | "horizontal";
  showProgress?: boolean;
  progress?: number;
  onEnroll?: (courseId: string) => void;
  onContinue?: (courseId: string) => void;
  className?: string;
  enrollmentData?: {
    progress: number;
    status: EnrollmentStatus;
    lastAccessed: string;
  };
}

const levelColors = {
  beginner: "bg-success/10 text-success border-success/20",
  intermediate: "bg-warning/10 text-warning border-warning/20",
  advanced: "bg-destructive/10 text-destructive border-destructive/20",
};

const getLevelDisplay = (
  level: string
): "Beginner" | "Intermediate" | "Advanced" => {
  if (level === "beginner") return "Beginner";
  if (level === "intermediate") return "Intermediate";
  return "Advanced";
};

const formatLastAccessed = (date: string) => {
  const now = new Date();
  const accessed = new Date(date);
  const diffInMs = now.getTime() - accessed.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return accessed.toLocaleDateString();
};

export const CourseCard = ({
  course,
  variant = "default",
  showProgress = false,
  progress,
  onEnroll,
  onContinue,
  className,
  enrollmentData, // NEW
}: CourseCardProps) => {
  const navigate = useNavigate();
  const { enrollments, isLoading: enrollmentLoading } = useAppSelector(
    (state) => state.enroll
  );

  const isEnrolled =
    !!enrollmentData ||
    enrollments.some(
      (e) =>
        (typeof e.course === "string" ? e.course : e.course._id) === course._id
    );

  const displayProgress = enrollmentData?.progress ?? progress;
  const enrollmentStatus = enrollmentData?.status;

  const getInstructorName = () => {
    if (typeof course.instructor === "string") return "Unknown Instructor";
    return `${course.instructor.firstName} ${course.instructor.lastName}`;
  };

  const getInstructorAvatar = () => {
    if (typeof course.instructor === "string") return undefined;
    return course.instructor.avatar;
  };

  const totalLessons =
    course.totalLessons ||
    (Array.isArray(course.modules)
      ? course.modules.reduce((sum, m) => sum + m.lessons.length, 0)
      : 0);

  const duration = course.totalDuration
    ? `${Math.ceil(course.totalDuration / 60)}h`
    : "—";

  const isFree = !course.price || course.price === 0;
  const levelDisplay = getLevelDisplay(course.level);
  const courseThumbnail = course.thumbnail?.url || placeholderImage;

  const handleContinue = () => {
    navigate(`/courses/${course._id}`);
    onContinue?.(course._id);
  };

  const handleEnroll = async () => {
    navigate(`/courses/${course._id}`);
    onEnroll?.(course._id);
  };

  if (variant === "horizontal") {
    return (
      <div
        className={cn(
          "flex flex-col sm:flex-row bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50 group",
          className
        )}
      >
        <div className="relative w-full sm:w-48 h-36 sm:h-auto shrink-0 overflow-hidden">
          <img
            src={courseThumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <Badge
            className={cn(
              "absolute top-3 left-3 border",
              levelColors[course.level]
            )}
          >
            {levelDisplay}
          </Badge>
          {enrollmentStatus && (
            <Badge
              className={cn(
                "absolute top-3 right-3",
                enrollmentStatus === "completed"
                  ? "bg-success text-success-foreground"
                  : "bg-primary text-primary-foreground"
              )}
            >
              {enrollmentStatus === "completed" ? "Completed" : "In Progress"}
            </Badge>
          )}
        </div>

        <div className="flex-1 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-primary mb-1">
                {CategoryLabels[course.category]}
              </p>
              <h3 className="font-semibold text-foreground text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                {course.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {course.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{duration}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" />
                  <span>{totalLessons} lessons</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-warning fill-warning" />
                  <span className="font-medium text-foreground">
                    {course.rating?.toFixed(1) || "0.0"}
                  </span>
                </div>
              </div>

              {/* NEW: Show progress and last accessed for enrolled courses */}
              {(showProgress || enrollmentData) &&
                isEnrolled &&
                displayProgress !== undefined && (
                  <div className="space-y-1">
                    <ProgressBar
                      value={displayProgress}
                      size="sm"
                      variant="success"
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{displayProgress}% complete</span>
                      {enrollmentData?.lastAccessed && (
                        <span>
                          Last accessed{" "}
                          {formatLastAccessed(enrollmentData.lastAccessed)}
                        </span>
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50 group",
          className
        )}
      >
        <div className="relative h-32 overflow-hidden">
          <img
            src={courseThumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {enrollmentStatus && (
            <Badge
              className={cn(
                "absolute top-2 right-2 text-xs",
                enrollmentStatus === "completed"
                  ? "bg-success text-success-foreground"
                  : "bg-primary text-primary-foreground"
              )}
            >
              {enrollmentStatus === "completed" ? "Completed" : "In Progress"}
            </Badge>
          )}
        </div>

        <div className="p-4">
          <p className="text-xs font-medium text-primary mb-1">
            {CategoryLabels[course.category]}
          </p>
          <h3 className="font-semibold text-foreground text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>

          {(showProgress || enrollmentData) &&
            isEnrolled &&
            displayProgress !== undefined && (
              <div className="mt-2">
                <ProgressBar
                  value={displayProgress}
                  size="sm"
                  variant="success"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {displayProgress}% complete
                </p>
              </div>
            )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50 group",
        className
      )}
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={courseThumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />

        <Badge
          className={cn(
            "absolute top-3 left-3 border",
            levelColors[course.level]
          )}
        >
          {levelDisplay}
        </Badge>

        {enrollmentStatus ? (
          <Badge
            className={cn(
              "absolute top-3 right-3",
              enrollmentStatus === "completed"
                ? "bg-success text-success-foreground"
                : "bg-primary text-primary-foreground"
            )}
          >
            {enrollmentStatus === "completed" ? "Completed" : "In Progress"}
          </Badge>
        ) : isFree ? (
          <Badge className="absolute top-3 right-3 bg-success text-success-foreground">
            Free
          </Badge>
        ) : (
          <Badge className="absolute top-3 right-3 bg-card text-foreground">
            ${course.price.toFixed(2)}
          </Badge>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <UserAvatar
            name={getInstructorName()}
            image={getInstructorAvatar()}
            size="sm"
          />
          <span className="text-sm text-muted-foreground">
            {getInstructorName()}
          </span>
        </div>

        <p className="text-xs font-medium text-primary mb-1">
          {CategoryLabels[course.category]}
        </p>
        <h3 className="font-semibold text-foreground text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {course.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span>{(course.enrollmentCount || 0).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 text-warning fill-warning" />
            <span className="font-medium text-foreground">
              {course.rating?.toFixed(1) || "0.0"}
            </span>
          </div>
        </div>

        {(showProgress || enrollmentData) &&
        isEnrolled &&
        displayProgress !== undefined ? (
          <div className="space-y-2">
            <ProgressBar value={displayProgress} size="sm" variant="success" />
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <p className="text-xs text-muted-foreground">
                  {displayProgress}% complete
                </p>
                {enrollmentData?.lastAccessed && (
                  <p className="text-xs text-muted-foreground">
                    Last accessed{" "}
                    {formatLastAccessed(enrollmentData.lastAccessed)}
                  </p>
                )}
              </div>
              <Button size="sm" onClick={handleContinue} className="gap-2">
                <PlayCircle className="h-4 w-4" />
                Continue Learning
              </Button>
            </div>
          </div>
        ) : (
          <Button
            className="w-full"
            onClick={handleEnroll}
            disabled={enrollmentLoading}
          >
            {enrollmentLoading ? (
              <>
                <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                Enrolling...
              </>
            ) : isEnrolled ? (
              <>
                <PlayCircle className="h-4 w-4 mr-2" />
                Start Learning
              </>
            ) : isFree ? (
              "Start Free Course"
            ) : (
              "Enroll Now"
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
