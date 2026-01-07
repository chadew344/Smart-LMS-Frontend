import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useMatch } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Users,
  Star,
  Award,
  BookOpen,
  CheckCircle2,
  Play,
  Lock,
  Globe,
  Share2,
  Heart,
  Loader2,
} from "lucide-react";
import { VideoPlayer } from "../components/features/VideoPlayer";
import { LessonList } from "../components/features/LessonList";
import { ProgressBar } from "../components/common/ProgressBar";
import { UserAvatar } from "../components/common/UserAvatar";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  enrollInCourse,
  markLessonComplete,
  getCourseProgress,
} from "../store/slices/enrollmentSlice";
import { getCourse } from "../store/slices/courseSlice";
import { cn } from "../lib/utils";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { toast } from "sonner";
import type { Lesson, Module } from "../types";
import placeholderImage from "../assets/course-placeholder.svg";

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

const transformLessonToUI = (lesson: Lesson) => ({
  id: lesson._id || "",
  title: lesson.title,
  description: lesson.description || "",
  duration: lesson.duration ? `${lesson.duration} min` : "N/A",
  type: lesson.type,
  videoUrl: lesson.video?.url,
  isCompleted: false,
  isLocked: false,
  order: lesson.order,
});

const transformModuleToUI = (module: Module, index: number) => ({
  id: module._id || `module-${index}`,
  title: module.title,
  description: module.description,
  lessons: module.lessons.map(transformLessonToUI),
  isExpanded: index === 0, // First module expanded by default
});

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const {
    currentCourse,
    isLoading: courseLoading,
    isError: courseError,
  } = useAppSelector((state) => state.course);
  const {
    enrollments,
    courseProgress,
    isLoading: enrollmentLoading,
  } = useAppSelector((state) => state.enroll);

  const isCoursesRoot = useMatch({ path: "/courses", end: false });

  const [modules, setModules] = useState<any[]>([]);
  const [currentLesson, setCurrentLesson] = useState<any | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (courseId) {
      dispatch(getCourse(courseId));
    }
  }, [courseId, dispatch]);

  useEffect(() => {
    if (currentCourse?.modules) {
      const transformedModules = currentCourse.modules.map((module, index) =>
        transformModuleToUI(module, index)
      );
      setModules(transformedModules);

      if (isEnrolled && !currentLesson && transformedModules.length > 0) {
        setCurrentLesson(transformedModules[0].lessons[0]);
      }
    }
  }, [currentCourse]);

  const isEnrolled = enrollments.some(
    (e) => (typeof e.course === "string" ? e.course : e.course._id) === courseId
  );

  const progress = courseId ? courseProgress[courseId] : null;

  useEffect(() => {
    if (isEnrolled && courseId) {
      dispatch(getCourseProgress(courseId));
    }
  }, [isEnrolled, courseId, dispatch]);

  useEffect(() => {
    if (progress?.progress) {
      const completedLessonIds = progress.progress
        .filter((p) => p.status === "completed")
        .map((p) => p.lessonId);

      setModules((prev) =>
        prev.map((module) => ({
          ...module,
          lessons: module.lessons.map((lesson: any) => ({
            ...lesson,
            isCompleted: completedLessonIds.includes(lesson.id),
          })),
        }))
      );
    }
  }, [progress?.progress]);

  const totalLessons =
    progress?.stats.totalLessons ||
    currentCourse?.totalLessons ||
    modules.reduce((acc, m) => acc + m.lessons.length, 0);

  const completedLessons = progress?.stats.completedLessons || 0;
  const progressPercentage = progress?.stats.completionPercentage || 0;

  const isFree = !currentCourse?.price || currentCourse.price === 0;
  const courseThumbnail = currentCourse?.thumbnail?.url || placeholderImage;

  const getInstructorName = () => {
    if (!currentCourse?.instructor) return "Unknown Instructor";
    if (typeof currentCourse.instructor === "string")
      return "Unknown Instructor";
    return `${currentCourse.instructor.firstName} ${currentCourse.instructor.lastName}`;
  };

  const getInstructorAvatar = () => {
    if (!currentCourse?.instructor) return undefined;
    if (typeof currentCourse.instructor === "string") return undefined;
    return currentCourse.instructor.avatar;
  };

  const duration = currentCourse?.totalDuration
    ? `${Math.ceil(currentCourse.totalDuration / 60)}h`
    : "—";

  const handleLessonComplete = () => {
    if (!currentLesson || !courseId) return;

    const currentModule = modules.find((m) =>
      m.lessons.some((l: any) => l.id === currentLesson.id)
    );
    if (!currentModule) return;

    setModules((prev) =>
      prev.map((module) => ({
        ...module,
        lessons: module.lessons.map((lesson: any) =>
          lesson.id === currentLesson.id
            ? { ...lesson, isCompleted: true }
            : lesson
        ),
      }))
    );

    dispatch(
      markLessonComplete({
        courseId,
        moduleId: currentModule.id,
        lessonId: currentLesson.id,
        status: "completed",
      })
    ).then(() => {
      dispatch(getCourseProgress(courseId));
    });
  };

  const handleSelectLesson = (lesson: any) => {
    if (isEnrolled || !lesson.isLocked) {
      setCurrentLesson(lesson);
    }
  };

  const handleEnroll = async () => {
    if (!courseId) return;

    if (!isAuthenticated) {
      navigate(`/login?redirect=/course/${courseId}`);
      return;
    }

    if (isFree) {
      try {
        await dispatch(enrollInCourse(courseId)).unwrap();
        toast.success("Enrolled successfully! Starting course...");
        if (modules.length > 0 && modules[0].lessons.length > 0) {
          setCurrentLesson(modules[0].lessons[0]);
        }
      } catch (error) {
        toast.error("Failed to enroll. Please try again.");
      }
    } else {
      navigate(`/payment/${courseId}`);
    }
  };

  if (courseLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (courseError || !currentCourse) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Course not found
          </h2>
          <p className="text-muted-foreground">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/browse")}>Browse Courses</Button>
        </div>
      </div>
    );
  }

  if (!isEnrolled) {
    return (
      <div
        className={cn(
          "container mx-auto space-y-8 animate-fade-in",
          isCoursesRoot && "my-5"
        )}
      >
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Browse Courses</span>
        </Link>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge
                  variant="outline"
                  className="text-primary border-primary/30"
                >
                  {currentCourse.category}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(levelColors[currentCourse.level])}
                >
                  {getLevelDisplay(currentCourse.level)}
                </Badge>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-4">
                {currentCourse.title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {currentCourse.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50">
                <Star className="h-4 w-4 text-warning fill-warning" />
                <span className="font-semibold text-foreground">
                  {currentCourse.rating?.toFixed(1) || "0.0"}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-foreground">
                  {currentCourse.enrollmentCount.toLocaleString()} students
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">English</span>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/50">
              <UserAvatar
                name={getInstructorName()}
                image={getInstructorAvatar()}
                size="lg"
              />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Created by</p>
                <p className="font-semibold text-foreground">
                  {getInstructorName()}
                </p>
                {typeof currentCourse.instructor !== "string" &&
                  currentCourse.instructor.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {currentCourse.instructor.bio}
                    </p>
                  )}
              </div>
            </div>

            {currentCourse.learningOutcomes &&
              currentCourse.learningOutcomes.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-foreground">
                    What you'll learn
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {currentCourse.learningOutcomes.map((outcome, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-xl bg-success/5"
                      >
                        <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">
                          {outcome}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {currentCourse.requirements &&
              currentCourse.requirements.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-foreground">
                    Requirements
                  </h2>
                  <ul className="space-y-2">
                    {currentCourse.requirements.map((req, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-muted-foreground"
                      >
                        <span className="text-primary mt-1">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                  Course content
                </h2>
                <div className="text-sm text-muted-foreground">
                  {modules.length} modules • {totalLessons} lessons • {duration}
                </div>
              </div>
              <div className="space-y-2">
                {modules.map((module, i) => (
                  <div
                    key={module.id}
                    className="bg-card rounded-xl border border-border/50 overflow-hidden"
                  >
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <span className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                          {i + 1}
                        </span>
                        <div>
                          <span className="font-medium text-foreground block">
                            {module.title}
                          </span>
                          {module.description && (
                            <span className="text-sm text-muted-foreground">
                              {module.description}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {module.lessons.length} lessons
                      </span>
                    </div>
                    {i === 0 && (
                      <div className="border-t border-border/50 p-4 space-y-2">
                        {module.lessons
                          .slice(0, 3)
                          .map((lesson: any, li: number) => (
                            <div
                              key={lesson.id}
                              className="flex items-center gap-3 text-sm text-muted-foreground"
                            >
                              {li === 0 ? (
                                <Play className="h-4 w-4" />
                              ) : (
                                <Lock className="h-4 w-4" />
                              )}
                              <span
                                className={li === 0 ? "text-foreground" : ""}
                              >
                                {lesson.title}
                              </span>
                              <span className="ml-auto">{lesson.duration}</span>
                              {li === 0 && (
                                <Badge variant="outline" className="text-xs">
                                  Preview
                                </Badge>
                              )}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-secondary group cursor-pointer">
                <img
                  src={courseThumbnail}
                  alt={currentCourse.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="h-16 w-16 rounded-full bg-white/90 flex items-center justify-center">
                    <Play
                      className="h-6 w-6 text-foreground ml-1"
                      fill="currentColor"
                    />
                  </div>
                </div>
                <Badge className="absolute top-4 left-4 bg-black/70 text-white">
                  Preview available
                </Badge>
              </div>

              <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-5">
                <div className="flex items-baseline gap-2">
                  {isFree ? (
                    <span className="text-3xl font-bold text-success">
                      Free
                    </span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold text-foreground">
                        ${currentCourse.price.toFixed(2)}
                      </span>
                    </>
                  )}
                </div>

                <Button
                  className="w-full h-12 text-base"
                  onClick={handleEnroll}
                  disabled={enrollmentLoading}
                >
                  {enrollmentLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Enrolling...
                    </>
                  ) : isFree ? (
                    "Enroll for Free"
                  ) : (
                    "Enroll Now"
                  )}
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                  >
                    <Heart
                      className={cn(
                        "h-4 w-4",
                        isWishlisted && "fill-destructive text-destructive"
                      )}
                    />
                    Wishlist
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>

                <div className="pt-4 border-t border-border space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">
                      {duration} of content
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">
                      {totalLessons} lessons
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">
                      Certificate of completion
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">
                      Full lifetime access
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "container mx-auto space-y-8 animate-fade-in",
        isCoursesRoot && "my-5"
      )}
    >
      <Link
        to="/courses"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm">Back to Courses</span>
      </Link>

      <div className="bg-card rounded-xl p-5 shadow-card border border-border/50">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl lg:text-2xl font-bold text-foreground truncate">
              {currentCourse.title}
            </h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              <span>{getInstructorName()}</span>
              <span>•</span>
              <span>{totalLessons} lessons</span>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 lg:w-80">
            <div className="flex-1">
              <ProgressBar
                value={progressPercentage}
                size="md"
                variant="success"
              />
              <div className="flex items-center justify-between mt-2 text-sm">
                <span className="text-muted-foreground">
                  {completedLessons}/{totalLessons} completed
                </span>
                <span className="font-semibold text-foreground">
                  {progressPercentage}%
                </span>
              </div>
            </div>
            {progressPercentage === 100 && (
              <Button size="sm" className="shrink-0">
                <Award className="h-4 w-4 mr-1" />
                Certificate
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {currentLesson?.type === "video" && currentLesson.videoUrl && (
            <VideoPlayer
              videoUrl={currentLesson.videoUrl}
              title={currentLesson.title}
              onComplete={handleLessonComplete}
            />
          )}

          {currentLesson && currentLesson.type !== "video" && (
            <div className="bg-card rounded-xl p-12 text-center border border-border/50">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                {currentLesson.type === "quiz" && (
                  <span className="text-2xl">📝</span>
                )}
                {currentLesson.type === "reading" && (
                  <span className="text-2xl">📖</span>
                )}
                {currentLesson.type === "assignment" && (
                  <span className="text-2xl">📋</span>
                )}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {currentLesson.title}
              </h3>
              <p className="text-muted-foreground mb-4">
                {currentLesson.type === "quiz" &&
                  "Ready to test your knowledge?"}
                {currentLesson.type === "reading" &&
                  "Estimated reading time: " + currentLesson.duration}
                {currentLesson.type === "assignment" &&
                  "Complete this assignment to continue"}
              </p>
              <Button onClick={handleLessonComplete}>
                {currentLesson.type === "quiz" && "Start Quiz"}
                {currentLesson.type === "reading" && "Mark as Read"}
                {currentLesson.type === "assignment" && "Submit Assignment"}
              </Button>
            </div>
          )}

          {currentLesson && (
            <Tabs
              defaultValue="overview"
              className="bg-card rounded-xl border border-border/50"
            >
              <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent p-0">
                <TabsTrigger
                  value="overview"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="notes"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Notes
                </TabsTrigger>
                <TabsTrigger
                  value="resources"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Resources
                </TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="p-6">
                <h3 className="font-semibold text-foreground mb-3">
                  Lesson: {currentLesson.title}
                </h3>
                {currentLesson.description && (
                  <p className="text-muted-foreground">
                    {currentLesson.description}
                  </p>
                )}
              </TabsContent>
              <TabsContent value="notes" className="p-6">
                <p className="text-muted-foreground">
                  Your notes for this lesson will appear here.
                </p>
              </TabsContent>
              <TabsContent value="resources" className="p-6">
                {currentLesson.resources &&
                currentLesson.resources.length > 0 ? (
                  <ul className="space-y-2 text-muted-foreground">
                    {currentLesson.resources.map(
                      (resource: string, i: number) => (
                        <li key={i}>• {resource}</li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">
                    No additional resources for this lesson.
                  </p>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>

        <div className="lg:col-span-1">
          <LessonList
            modules={modules}
            currentLessonId={currentLesson?.id || ""}
            onSelectLesson={handleSelectLesson}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
