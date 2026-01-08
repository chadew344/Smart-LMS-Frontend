import {
  BookOpen,
  Clock,
  Award,
  Flame,
  TrendingUp,
  Calendar,
} from "lucide-react";

import { StatCard } from "../../components/common/StateCard";
import { CourseCard } from "../../components/common/CourseCard";
import { QuizCard } from "../../components/common/QuizCard";
import { ProgressBar } from "../../components/common/ProgressBar";
import {
  mockCourses,
  mockQuizzes,
  mockStudentStats,
  mockRecentActivities,
} from "../../data/mockData";
import { useAppSelector } from "../../store/hook";
import { toTitleCase } from "../../lib/string";

export interface DashboardCourse {
  id: string;
  title: string;
  thumbnail?: string;
  progress?: number;
  instructor?: string;
  duration?: string;
}

const StudentDashboard = () => {
  const enrolledCourses = mockCourses.filter((c) => c.progress !== undefined);
  const upcomingQuizzes = mockQuizzes.filter((q) => q.status !== "completed");

  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
          Welcome back {toTitleCase(user?.firstName || "")}! 👋
        </h1>
        <p className="text-muted-foreground">
          Continue your learning journey. You're doing great!
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard
          title="Enrolled Courses"
          value={mockStudentStats.enrolledCourses}
          icon={BookOpen}
          variant="primary"
        />
        <StatCard
          title="Hours Learned"
          value={mockStudentStats.hoursLearned}
          icon={Clock}
          variant="accent"
        />
        <StatCard
          title="Certificates"
          value={mockStudentStats.certificates}
          icon={Award}
          variant="success"
        />
        <StatCard
          title="Day Streak"
          value={mockStudentStats.streak}
          icon={Flame}
          variant="warning"
          subtitle="Keep it up! 🔥"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Continue Learning
              </h2>
              <span className="text-sm text-muted-foreground">
                {enrolledCourses.length} courses in progress
              </span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {enrolledCourses.slice(0, 2).map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  variant="compact"
                  showProgress
                />
              ))}
            </div>
          </section>

          <section className="bg-card rounded-xl p-6 shadow-card border border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">
                Weekly Progress
              </h2>
              <div className="flex items-center gap-2 text-sm text-success">
                <TrendingUp className="h-4 w-4" />
                <span>+12% from last week</span>
              </div>
            </div>

            <div className="space-y-4">
              {enrolledCourses.slice(0, 3).map((course) => (
                <div key={course.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground truncate mr-4">
                      {course.title}
                    </span>
                    <span className="text-muted-foreground shrink-0">
                      {course.progress}%
                    </span>
                  </div>
                  <ProgressBar
                    value={course.progress || 0}
                    size="sm"
                    variant={
                      course.progress && course.progress > 70
                        ? "success"
                        : "default"
                    }
                  />
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Upcoming Quizzes
              </h2>
              <span className="text-sm text-muted-foreground">
                {upcomingQuizzes.length} pending
              </span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {upcomingQuizzes.slice(0, 2).map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} />
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-card rounded-xl p-6 shadow-card border border-border/50">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Overall Progress
            </h2>
            <div className="flex items-center justify-center mb-4">
              <div className="relative h-32 w-32">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    className="stroke-secondary"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    className="stroke-primary"
                    strokeWidth="3"
                    strokeDasharray={`${mockStudentStats.averageScore}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-foreground">
                    {mockStudentStats.averageScore}%
                  </span>
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Average score across all courses
            </p>
          </section>

          <section className="bg-card rounded-xl p-6 shadow-card border border-border/50">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {mockRecentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">
                      {activity.action}{" "}
                      <span className="font-medium">{activity.target}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-card rounded-xl p-6 shadow-card border border-border/50">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                Today's Schedule
              </h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <div className="text-xs font-medium text-primary">10:00</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    React Hooks Lecture
                  </p>
                  <p className="text-xs text-muted-foreground">Live session</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <div className="text-xs font-medium text-primary">14:00</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    Python Quiz Due
                  </p>
                  <p className="text-xs text-muted-foreground">Assessment</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <div className="text-xs font-medium text-primary">16:30</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    Study Group
                  </p>
                  <p className="text-xs text-muted-foreground">
                    TypeScript patterns
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
