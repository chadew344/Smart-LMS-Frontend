import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Edit3,
  Globe,
  Lock,
  Users,
  Star,
  Clock,
  BookOpen,
  Video,
  FileText,
  HelpCircle,
  Play,
  BarChart3,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { useAppSelector, useAppDispatch } from "../../store/hook";
import { publishCourse } from "../../store/slices/courseSlice";
import { cn } from "../../lib/utils";
import { toast } from "sonner";
import placeholderImage from "../../assets/course-placeholder.svg";

export const InstructorCourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const course = useAppSelector((state) =>
    state.course.myCourses.find((c) => c._id === courseId)
  );

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-foreground">
          Course not found
        </h2>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate("/my-courses")}
        >
          Back to My Courses
        </Button>
      </div>
    );
  }

  const handlePublish = () => {
    dispatch(publishCourse(course._id));
    toast.success("Course published!");
  };

  const handleUnpublish = () => {
    dispatch(publishCourse(course._id));
    toast.success("Course unpublished");
  };

  const totalLessons = course.modules.reduce(
    (acc, m) => acc + m.lessons.length,
    0
  );
  const videoLessons = course.modules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => l.type === "video").length,
    0
  );
  const quizLessons = course.modules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => l.type === "quiz").length,
    0
  );
  const readingLessons = course.modules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => l.type === "reading").length,
    0
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "reading":
        return <FileText className="h-4 w-4" />;
      case "quiz":
        return <HelpCircle className="h-4 w-4" />;
      default:
        return <Play className="h-4 w-4" />;
    }
  };

  const courseThumbnail = course.thumbnail?.url || placeholderImage;

  return (
    <div className="space-y-8 animate-fade-in">
      <Link
        to="../my-classes"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm">My Courses</span>
      </Link>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-80 shrink-0">
          <div className="aspect-video rounded-xl overflow-hidden bg-secondary relative">
            {course.thumbnail ? (
              <img
                src={courseThumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  className={cn(
                    course.isPublished
                      ? "bg-success/10 text-success border-success/30"
                      : "bg-warning/10 text-warning border-warning/30"
                  )}
                  variant="outline"
                >
                  {course.isPublished ? (
                    <>
                      <Globe className="h-3 w-3 mr-1" /> Published
                    </>
                  ) : (
                    <>
                      <Lock className="h-3 w-3 mr-1" /> Draft
                    </>
                  )}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {course.level}
                </Badge>
                <Badge variant="outline">
                  {course.category.replace("-", " ")}
                </Badge>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                {course.title}
              </h1>
              <p className="text-muted-foreground mt-2">{course.description}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 pt-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 text-sm">
              <BookOpen className="h-4 w-4 text-primary" />
              <span>{course.modules.length} modules</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{totalLessons} lessons</span>
            </div>
            {course.isPublished && (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {course.enrollmentCount.toLocaleString()} students
                  </span>
                </div>
                {course.rating && course.rating > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 text-sm">
                    <Star className="h-4 w-4 text-warning fill-warning" />
                    <span>{course.rating}</span>
                  </div>
                )}
              </>
            )}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-sm font-medium text-primary">
              {course.price ? `$${course.price}` : "Free"}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button onClick={() => navigate(`/edit-course/${course._id}`)}>
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Course
            </Button>
            {!course.isPublished ? (
              <Button variant="outline" onClick={handlePublish}>
                <Globe className="h-4 w-4 mr-2" />
                Publish
              </Button>
            ) : (
              <Button variant="outline" onClick={handleUnpublish}>
                <Lock className="h-4 w-4 mr-2" />
                Unpublish
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="content" className="space-y-6">
        <TabsList>
          <TabsTrigger value="content">Course Content</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          {/* Content Summary */}
          <div className="grid grid-cols-3 gap-4 max-w-lg">
            <div className="bg-primary/10 rounded-xl p-4 text-center">
              <Video className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-xl font-bold text-foreground">
                {videoLessons}
              </p>
              <p className="text-xs text-muted-foreground">Videos</p>
            </div>
            <div className="bg-accent/10 rounded-xl p-4 text-center">
              <FileText className="h-5 w-5 text-accent mx-auto mb-2" />
              <p className="text-xl font-bold text-foreground">
                {readingLessons}
              </p>
              <p className="text-xs text-muted-foreground">Readings</p>
            </div>
            <div className="bg-success/10 rounded-xl p-4 text-center">
              <HelpCircle className="h-5 w-5 text-success mx-auto mb-2" />
              <p className="text-xl font-bold text-foreground">{quizLessons}</p>
              <p className="text-xs text-muted-foreground">Quizzes</p>
            </div>
          </div>

          {/* Modules List */}
          <div className="space-y-4">
            {course.modules.map((module, i) => (
              <div
                key={module._id}
                className="bg-card rounded-xl border border-border/50 overflow-hidden"
              >
                <div className="flex items-center gap-3 p-4 bg-secondary/30">
                  <span className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                    {i + 1}
                  </span>
                  <span className="font-semibold text-foreground flex-1">
                    {module.title}
                  </span>
                  <Badge variant="outline">
                    {module.lessons.length} lessons
                  </Badge>
                </div>
                <div className="p-4 space-y-2">
                  {module.lessons.map((lesson) => (
                    <div
                      key={lesson._id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30"
                    >
                      <div
                        className={cn(
                          "h-8 w-8 rounded-lg flex items-center justify-center",
                          lesson.type === "video" &&
                            "bg-primary/10 text-primary",
                          lesson.type === "reading" &&
                            "bg-accent/10 text-accent",
                          lesson.type === "quiz" && "bg-success/10 text-success"
                        )}
                      >
                        {getTypeIcon(lesson.type)}
                      </div>
                      <span className="flex-1 text-sm text-foreground">
                        {lesson.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {lesson.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {!course.isPublished ? (
            <div className="bg-card rounded-xl border border-border/50 p-12 text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No analytics yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Publish your course to start tracking student engagement
              </p>
              <Button onClick={handlePublish}>
                <Globe className="h-4 w-4 mr-2" />
                Publish Course
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-card rounded-xl border border-border/50 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {course.enrollmentCount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Total Students
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-xl border border-border/50 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                    <Star className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {course.rating}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Average Rating
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-xl border border-border/50 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">68%</p>
                    <p className="text-xs text-muted-foreground">
                      Completion Rate
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InstructorCourseDetail;
