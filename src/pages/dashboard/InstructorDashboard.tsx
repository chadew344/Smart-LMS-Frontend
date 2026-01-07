import {
  BookOpen,
  Users,
  DollarSign,
  Star,
  FileQuestion,
  MessageSquare,
  TrendingUp,
  Eye,
} from "lucide-react";

import { StatCard } from "../../components/common/StateCard";
import { CourseCard } from "../../components/common/CourseCard";
import { ProgressBar } from "../../components/common/ProgressBar";
import { UserAvatar } from "../../components/common/UserAvatar";
import { mockInstructorStats } from "../../data/mockData";
import { useAppSelector } from "../../store/hook";

const recentStudents = [
  {
    id: "1",
    name: "Emma Wilson",
    course: "React Developer Course",
    progress: 75,
    enrolledAt: "2 days ago",
  },
  {
    id: "2",
    name: "James Miller",
    course: "TypeScript Patterns",
    progress: 45,
    enrolledAt: "3 days ago",
  },
  {
    id: "3",
    name: "Sophia Chen",
    course: "React Developer Course",
    progress: 90,
    enrolledAt: "1 week ago",
  },
  {
    id: "4",
    name: "Lucas Brown",
    course: "Node.js Backend",
    progress: 30,
    enrolledAt: "1 week ago",
  },
];

const coursePerformance = [
  {
    id: "1",
    title: "Complete React Developer Course",
    students: 4521,
    rating: 4.9,
    revenue: 12450,
  },
  {
    id: "2",
    title: "Advanced TypeScript Patterns",
    students: 2341,
    rating: 4.8,
    revenue: 8920,
  },
  {
    id: "3",
    title: "Node.js Backend Development",
    students: 1892,
    rating: 4.7,
    revenue: 7080,
  },
];

const InstructorDashboard = () => {
  const courses = useAppSelector((state) => state.course.courses);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
          Instructor Dashboard
        </h1>
        <p className="text-muted-foreground">
          Monitor your courses, students, and earnings
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard
          title="Total Students"
          value={mockInstructorStats.totalStudents.toLocaleString()}
          icon={Users}
          variant="primary"
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatCard
          title="Total Revenue"
          value={`$${mockInstructorStats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          variant="success"
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title="Average Rating"
          value={mockInstructorStats.averageRating}
          icon={Star}
          variant="warning"
        />
        <StatCard
          title="Active Courses"
          value={mockInstructorStats.totalCourses}
          icon={BookOpen}
          variant="accent"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-card rounded-xl p-6 shadow-card border border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">
                Course Performance
              </h2>
              <button className="text-sm text-primary hover:underline">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-sm font-medium text-muted-foreground pb-3">
                      Course
                    </th>
                    <th className="text-left text-sm font-medium text-muted-foreground pb-3">
                      Students
                    </th>
                    <th className="text-left text-sm font-medium text-muted-foreground pb-3">
                      Rating
                    </th>
                    <th className="text-left text-sm font-medium text-muted-foreground pb-3">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {coursePerformance.map((course) => (
                    <tr
                      key={course.id}
                      className="border-b border-border/50 last:border-0"
                    >
                      <td className="py-4">
                        <p className="font-medium text-foreground text-sm">
                          {course.title}
                        </p>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">
                            {course.students.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-warning fill-warning" />
                          <span className="text-sm font-medium text-foreground">
                            {course.rating}
                          </span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="text-sm font-medium text-success">
                          ${course.revenue.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-card rounded-xl p-6 shadow-card border border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">
                Recent Enrollments
              </h2>
              <button className="text-sm text-primary hover:underline">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {recentStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <UserAvatar name={student.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">
                      {student.name}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {student.course}
                    </p>
                  </div>
                  <div className="hidden sm:block w-24">
                    <ProgressBar
                      value={student.progress}
                      size="sm"
                      variant="success"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {student.progress}%
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {student.enrolledAt}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                My Courses
              </h2>
              <button className="text-sm text-primary hover:underline">
                Manage All
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {courses.slice(0, 2).map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  variant="compact"
                />
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-card rounded-xl p-6 shadow-card border border-border/50">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors">
                <BookOpen className="h-5 w-5" />
                <span className="font-medium">Create New Course</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
                <FileQuestion className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium text-foreground">Add Quiz</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium text-foreground">
                  View Messages
                </span>
              </button>
            </div>
          </section>

          <section className="bg-card rounded-xl p-6 shadow-card border border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Pending Reviews
              </h2>
              <span className="text-sm font-medium text-primary">
                {mockInstructorStats.pendingReviews}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              You have {mockInstructorStats.pendingReviews} student submissions
              waiting for review
            </p>
            <button className="w-full py-2 px-4 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors">
              Review Submissions
            </button>
          </section>

          <section className="bg-card rounded-xl p-6 shadow-card border border-border/50">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              This Week
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Eye className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">Course Views</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">2,847</p>
                  <p className="text-xs text-success">+12%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/10">
                    <Users className="h-4 w-4 text-success" />
                  </div>
                  <span className="text-sm text-foreground">New Students</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">156</p>
                  <p className="text-xs text-success">+8%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning/10">
                    <TrendingUp className="h-4 w-4 text-warning" />
                  </div>
                  <span className="text-sm text-foreground">
                    Completion Rate
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">78%</p>
                  <p className="text-xs text-success">+3%</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
