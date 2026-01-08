import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  MoreVertical,
  Edit3,
  Trash2,
  Eye,
  Globe,
  Lock,
  Users,
  Star,
  Clock,
  BookOpen,
  Search,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { useAppSelector, useAppDispatch } from "../../store/hook";
import {
  deleteCourse,
  getInstructorCourses,
  publishCourse,
  unPublishCourse,
} from "../../store/slices/courseSlice";
import { cn } from "../../lib/utils";
import { toast } from "sonner";

export const MyCourses = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { myCourses: instructorCourses } = useAppSelector(
    (state) => state.course
  );

  useEffect(() => {
    dispatch(getInstructorCourses());
  }, [dispatch]);

  console.log(instructorCourses);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "published" | "draft">(
    "all"
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

  const filteredCourses = instructorCourses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || course.isPublished;
    return matchesSearch && matchesTab;
  });

  const handlePublish = (courseId: string) => {
    dispatch(publishCourse(courseId));
    toast.success("Course published successfully!");
  };

  const handleUnpublish = (courseId: string) => {
    dispatch(unPublishCourse(courseId));
    toast.success("Course unpublished");
  };

  const handleDelete = () => {
    if (courseToDelete) {
      dispatch(deleteCourse(courseToDelete));
      toast.success("Course deleted");
      setCourseToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const totalLessons = (modules: (typeof instructorCourses)[0]["modules"]) => {
    return modules.reduce((acc, m) => acc + m.lessons.length, 0);
  };

  const stats = {
    total: instructorCourses.length,
    published: instructorCourses.filter((c) => c.isPublished).length,
    // draft: instructorCourses.filter((c) => c.status === "draft").length,
    draft: instructorCourses.filter((c) => c.isPublished === false).length,
    totalStudents: instructorCourses.reduce(
      (acc, c) => acc + c.enrollmentCount,
      0
    ),
  };

  return (
    <div className="px-4 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            My Courses
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and organize your course content
          </p>
        </div>
        <Button
          onClick={() => navigate("/dashboard/create-course")}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Course
        </Button>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {stats.total}
              </p>
              <p className="text-xs text-muted-foreground">Total Courses</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Globe className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {stats.published}
              </p>
              <p className="text-xs text-muted-foreground">Published</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Lock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {stats.draft}
              </p>
              <p className="text-xs text-muted-foreground">Drafts</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {stats.totalStudents.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Total Students</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as typeof activeTab)}
        >
          <TabsList>
            <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
            <TabsTrigger value="published">
              Published ({stats.published})
            </TabsTrigger>
            <TabsTrigger value="draft">Drafts ({stats.draft})</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border/50 p-12 text-center">
          <div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No courses found
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery
              ? "Try a different search term"
              : "Create your first course to get started"}
          </p>
          {!searchQuery && (
            <Button onClick={() => navigate("/dashboard/create-course")}>
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredCourses.map((course) => (
            <div
              key={course._id}
              className="bg-card rounded-xl border border-border/50 p-4 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Thumbnail */}
                <div className="sm:w-48 shrink-0">
                  <div className="aspect-video rounded-lg overflow-hidden bg-secondary relative">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail.url}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <Badge
                      className={cn(
                        "absolute top-2 left-2 text-xs",
                        course.isPublished === true
                          ? "bg-success/90 text-success-foreground"
                          : "bg-warning/90 text-warning-foreground"
                      )}
                    >
                      {course.isPublished === true ? (
                        <>
                          <Globe className="h-3 w-3 mr-1" /> Published
                        </>
                      ) : (
                        <>
                          <Lock className="h-3 w-3 mr-1" /> Draft
                        </>
                      )}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground text-lg truncate">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {course.description}
                      </p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() => navigate(`/edit-course/${course._id}`)}
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit Course
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigate(`/my-classses/${course._id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {/* course.isPublished === "draft" */}
                        {!course.isPublished ? (
                          <DropdownMenuItem
                            onClick={() => handlePublish(course._id)}
                          >
                            <Globe className="h-4 w-4 mr-2" />
                            Publish Course
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handleUnpublish(course._id)}
                          >
                            <Lock className="h-4 w-4 mr-2" />
                            Unpublish
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => {
                            setCourseToDelete(course._id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Course
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Stats Row */}
                  <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      <span>{course.modules.length} modules</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{totalLessons(course.modules)} lessons</span>
                    </div>
                    {course.isPublished && (
                      <>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{course.enrollmentCount} students</span>
                        </div>
                        {/* course.rating > 0 */}
                        {Math.floor(Math.random() * 5) + 0.5 > 0 && (
                          <div className="flex items-center gap-1.5">
                            <Star className="h-4 w-4 text-warning fill-warning" />
                            <span className="font-medium text-foreground">
                              {course.rating}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                    <div className="flex items-center gap-1.5 ml-auto">
                      <Badge variant="outline" className="capitalize">
                        {course.level}
                      </Badge>
                      <Badge variant="secondary">
                        {course.price ? `$${course.price}` : "Free"}
                      </Badge>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/edit-course/${course._id}`)}
                    >
                      <Edit3 className="h-3.5 w-3.5 mr-1.5" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`${course._id}`)}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1.5" />
                      Preview
                    </Button>
                    {/* course.status === "draft" */}
                    {!course.isPublished ? (
                      <Button
                        size="sm"
                        onClick={() => handlePublish(course._id)}
                      >
                        <Globe className="h-3.5 w-3.5 mr-1.5" />
                        Publish
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleUnpublish(course._id)}
                      >
                        <Lock className="h-3.5 w-3.5 mr-1.5" />
                        Unpublish
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this course? This action cannot be
              undone and will remove all course content, modules, and lessons.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyCourses;
