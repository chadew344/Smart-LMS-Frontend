import { useState, useEffect } from "react";
import { BookOpen, Clock, Award } from "lucide-react";
import { CourseCard } from "../../components/common/CourseCard";
import { SearchInput } from "../../components/common/SearchInput";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { cn } from "../../lib/utils";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { getMyEnrollments } from "../../store/slices/enrollmentSlice";

const MyCourses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "completed"
  >("all");

  const dispatch = useAppDispatch();
  const { enrollments, isLoading } = useAppSelector((state) => state.enroll);

  useEffect(() => {
    dispatch(getMyEnrollments());
  }, [dispatch]);

  const filteredEnrollments = enrollments.filter((enrollment) => {
    const course =
      typeof enrollment.course === "object" ? enrollment.course : null;
    if (!course) return false;

    const matchesSearch = searchQuery
      ? course.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesStatus =
      statusFilter === "all" ? true : enrollment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: enrollments.length,
    active: enrollments.filter((e) => e.status === "active").length,
    completed: enrollments.filter((e) => e.status === "completed").length,
    avgProgress:
      enrollments.length > 0
        ? Math.round(
            enrollments.reduce((sum, e) => sum + e.completionPercentage, 0) /
              enrollments.length
          )
        : 0,
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading your courses...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
          My Courses
        </h1>
        <p className="text-muted-foreground">
          Track your learning progress and continue where you left off
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<BookOpen className="h-5 w-5" />}
          label="Total Courses"
          value={stats.total}
        />
        <StatCard
          icon={<Clock className="h-5 w-5" />}
          label="In Progress"
          value={stats.active}
        />
        <StatCard
          icon={<Award className="h-5 w-5" />}
          label="Completed"
          value={stats.completed}
        />
        <StatCard
          icon={<Progress value={stats.avgProgress} className="h-2" />}
          label="Avg Progress"
          value={`${stats.avgProgress}%`}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search your courses..."
          className="flex-1"
        />
        <div className="flex gap-2">
          {(["all", "active", "completed"] as const).map((status) => (
            <Badge
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              className={cn(
                "cursor-pointer px-4 py-2 text-sm transition-colors capitalize",
                statusFilter === status
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "hover:bg-secondary"
              )}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </Badge>
          ))}
        </div>
      </div>

      {filteredEnrollments.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEnrollments.map((enrollment) => {
            const course =
              typeof enrollment.course === "object" ? enrollment.course : null;

            if (!course) return null;

            return (
              <div key={enrollment._id} className="relative">
                <CourseCard
                  course={course}
                  variant="default"
                  enrollmentData={{
                    progress: enrollment.completionPercentage,
                    status: enrollment.status,
                    lastAccessed: enrollment.lastAccessedAt,
                  }}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg font-medium text-foreground mb-2">
            {searchQuery ? "No matching courses" : "No courses enrolled"}
          </p>
          <p className="text-muted-foreground">
            {searchQuery
              ? "Try adjusting your search"
              : "Browse available courses to start learning"}
          </p>
        </div>
      )}
    </div>
  );
};

const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) => (
  <div className="bg-card border border-border rounded-lg p-4 space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="text-primary">{icon}</div>
    </div>
    <div className="text-2xl font-bold">{value}</div>
  </div>
);

export default MyCourses;
