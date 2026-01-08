import {
  Users,
  BookOpen,
  DollarSign,
  UserPlus,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { StatCard } from "../../components/common/StateCard";
import { UserAvatar } from "../../components/common/UserAvatar";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { mockAdminStats } from "../../data/mockData";

const pendingApprovals = [
  {
    id: "1",
    type: "course",
    title: "Advanced Machine Learning",
    author: "Dr. Lisa Park",
    submitted: "2 hours ago",
  },
  {
    id: "2",
    type: "instructor",
    title: "Instructor Application",
    author: "Michael Chen",
    submitted: "5 hours ago",
  },
  {
    id: "3",
    type: "course",
    title: "Blockchain Fundamentals",
    author: "Alex Johnson",
    submitted: "1 day ago",
  },
];

const recentUsers = [
  {
    id: "1",
    name: "Emma Wilson",
    email: "emma@example.com",
    role: "student",
    status: "active",
    joined: "2 hours ago",
  },
  {
    id: "2",
    name: "James Miller",
    email: "james@example.com",
    role: "instructor",
    status: "pending",
    joined: "5 hours ago",
  },
  {
    id: "3",
    name: "Sophia Chen",
    email: "sophia@example.com",
    role: "student",
    status: "active",
    joined: "1 day ago",
  },
  {
    id: "4",
    name: "Lucas Brown",
    email: "lucas@example.com",
    role: "student",
    status: "active",
    joined: "2 days ago",
  },
];

const platformMetrics = [
  { label: "Daily Active Users", value: "12,456", change: "+5.2%" },
  { label: "Course Completions", value: "1,234", change: "+12.8%" },
  { label: "Avg. Session Duration", value: "24 min", change: "+3.1%" },
  { label: "Support Tickets", value: "23", change: "-15%" },
];

const AdminDashboard = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Platform overview and management
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard
          title="Total Users"
          value={mockAdminStats.totalUsers.toLocaleString()}
          icon={Users}
          variant="primary"
          trend={{ value: 8.5, isPositive: true }}
        />
        <StatCard
          title="Total Courses"
          value={mockAdminStats.totalCourses}
          icon={BookOpen}
          variant="accent"
          trend={{ value: 4.2, isPositive: true }}
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${mockAdminStats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          variant="success"
          trend={{ value: mockAdminStats.monthlyGrowth, isPositive: true }}
        />
        <StatCard
          title="Active Instructors"
          value={mockAdminStats.activeInstructors}
          icon={UserPlus}
          variant="warning"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-card rounded-xl p-6 shadow-card border border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">
                Platform Metrics
              </h2>
              <select className="text-sm bg-secondary rounded-lg px-3 py-1.5 border-0 text-foreground">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {platformMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="p-4 rounded-xl bg-secondary/50"
                >
                  <p className="text-sm text-muted-foreground mb-1">
                    {metric.label}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {metric.value}
                  </p>
                  <p
                    className={`text-sm mt-1 ${
                      metric.change.startsWith("+")
                        ? "text-success"
                        : metric.change.startsWith("-")
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`}
                  >
                    {metric.change}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-card rounded-xl p-6 shadow-card border border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">
                Recent Users
              </h2>
              <button className="text-sm text-primary hover:underline">
                View All Users
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-sm font-medium text-muted-foreground pb-3">
                      User
                    </th>
                    <th className="text-left text-sm font-medium text-muted-foreground pb-3 hidden sm:table-cell">
                      Role
                    </th>
                    <th className="text-left text-sm font-medium text-muted-foreground pb-3">
                      Status
                    </th>
                    <th className="text-left text-sm font-medium text-muted-foreground pb-3 hidden md:table-cell">
                      Joined
                    </th>
                    <th className="text-right text-sm font-medium text-muted-foreground pb-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-border/50 last:border-0"
                    >
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <UserAvatar name={user.name} size="sm" />
                          <div>
                            <p className="font-medium text-foreground text-sm">
                              {user.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 hidden sm:table-cell">
                        <Badge variant="outline" className="capitalize">
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <Badge
                          className={
                            user.status === "active"
                              ? "bg-success/10 text-success border-success/20"
                              : "bg-warning/10 text-warning border-warning/20"
                          }
                        >
                          {user.status === "active" ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          {user.status}
                        </Badge>
                      </td>
                      <td className="py-4 text-sm text-muted-foreground hidden md:table-cell">
                        {user.joined}
                      </td>
                      <td className="py-4 text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-card rounded-xl p-6 shadow-card border border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Pending Approvals
              </h2>
              <Badge variant="destructive" className="rounded-full">
                {mockAdminStats.pendingApprovals}
              </Badge>
            </div>

            <div className="space-y-4">
              {pendingApprovals.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-lg bg-secondary/50 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Badge
                        variant="outline"
                        className="mb-2 capitalize text-xs"
                      >
                        {item.type}
                      </Badge>
                      <p className="font-medium text-foreground text-sm">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        by {item.author}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {item.submitted}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-card rounded-xl p-6 shadow-card border border-border/50">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="h-5 w-5 text-warning" />
              <h2 className="text-lg font-semibold text-foreground">
                System Alerts
              </h2>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                <p className="text-sm font-medium text-foreground">
                  Storage usage at 85%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Consider upgrading your plan
                </p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm font-medium text-foreground">
                  5 new instructor applications
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Review pending applications
                </p>
              </div>
            </div>
          </section>

          <section className="bg-card rounded-xl p-6 shadow-card border border-border/50">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Revenue Breakdown
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Course Sales</span>
                  <span className="font-medium text-foreground">$542,320</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: "65%" }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Subscriptions</span>
                  <span className="font-medium text-foreground">$285,130</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success rounded-full"
                    style={{ width: "35%" }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Certificates</span>
                  <span className="font-medium text-foreground">$65,000</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full"
                    style={{ width: "10%" }}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
