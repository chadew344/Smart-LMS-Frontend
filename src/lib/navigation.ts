import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  FileQuestion,
  Users,
  Settings,
  BarChart3,
  MessageSquare,
  Calendar,
  FolderOpen,
  PlusCircle,
  FileDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { UserRole } from "../types";

export interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
  roles: UserRole[];
  badge?: string | number;
  children?: NavItem[];
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

const DASHBOARD_BASE = "/dashboard";

const dashboardPath = (path: string) => {
  if (path === "") return DASHBOARD_BASE;
  return `${DASHBOARD_BASE}/${path}`;
};

export const navigationConfig: Record<UserRole, NavSection[]> = {
  student: [
    {
      title: "Learning",
      items: [
        {
          label: "Dashboard",
          icon: LayoutDashboard,
          path: dashboardPath(""),
          roles: ["student"],
        },
        {
          label: "My Courses",
          icon: BookOpen,
          path: dashboardPath("my-courses"),
          roles: ["student"],
        },
        {
          label: "Browse Courses",
          icon: GraduationCap,
          path: dashboardPath("courses"),
          roles: ["student"],
        },
      ],
    },
    {
      title: "Activities",
      items: [
        {
          label: "Quizzes",
          icon: FileQuestion,
          path: dashboardPath("quizzes"),
          roles: ["student"],
        },
        {
          label: "Assignments",
          icon: FolderOpen,
          path: dashboardPath("assignments"),
          roles: ["student"],
        },
        {
          label: "Calendar",
          icon: Calendar,
          path: dashboardPath("calendar"),
          roles: ["student"],
        },
        {
          label: "Reports",
          icon: FileDown,
          path: "reports",
          roles: ["student"],
        },
      ],
    },
    {
      title: "Communication",
      items: [
        {
          label: "Messages",
          icon: MessageSquare,
          path: dashboardPath("messages"),
          roles: ["student"],
        },
      ],
    },
    {
      items: [
        {
          label: "Settings",
          icon: Settings,
          path: dashboardPath("settings"),
          roles: ["student"],
        },
      ],
    },
  ],
  instructor: [
    {
      title: "Teaching",
      items: [
        {
          label: "Dashboard",
          icon: LayoutDashboard,
          path: dashboardPath(""),
          roles: ["instructor"],
        },
        {
          label: "My Classes",
          icon: BookOpen,
          path: dashboardPath("teaching/my-classes"),
          roles: ["instructor"],
        },
        {
          label: "Create Course",
          icon: PlusCircle,
          path: dashboardPath("teaching/create-course"),
          roles: ["instructor"],
        },
      ],
    },
    {
      title: "Activities",
      items: [
        {
          label: "Quizzes",
          icon: FileQuestion,
          path: dashboardPath("quizzes"),
          roles: ["instructor"],
        },
        {
          label: "Assignments",
          icon: FolderOpen,
          path: dashboardPath("assignments"),
          roles: ["instructor"],
        },
        {
          label: "Calendar",
          icon: Calendar,
          path: dashboardPath("calendar"),
          roles: ["instructor"],
        },
        {
          label: "Reports",
          icon: FileDown,
          path: "reports",
          roles: ["instructor"],
        },
      ],
    },
    {
      title: "Communication",
      items: [
        {
          label: "Messages",
          icon: MessageSquare,
          path: dashboardPath("messages"),
          roles: ["instructor"],
        },
      ],
    },
    {
      items: [
        {
          label: "Settings",
          icon: Settings,
          path: dashboardPath("settings"),
          roles: ["instructor"],
        },
      ],
    },
  ],
  admin: [
    {
      title: "Administration",
      items: [
        {
          label: "Dashboard",
          icon: LayoutDashboard,
          path: dashboardPath(""),
          roles: ["admin"],
        },
        {
          label: "All Courses",
          icon: BookOpen,
          path: dashboardPath("admin/courses"),
          roles: ["admin"],
        },
        {
          label: "Users",
          icon: Users,
          path: dashboardPath("admin/users"),
          roles: ["admin"],
        },
        {
          label: "Analytics",
          icon: BarChart3,
          path: dashboardPath("admin/analytics"),
          roles: ["admin"],
        },
        {
          label: "Reports",
          icon: FileDown,
          path: "reports",
          roles: ["instructor"],
        },
      ],
    },
    {
      title: "Communication",
      items: [
        {
          label: "Messages",
          icon: MessageSquare,
          path: dashboardPath("messages"),
          roles: ["admin"],
        },
      ],
    },
    {
      items: [
        {
          label: "Settings",
          icon: Settings,
          path: dashboardPath("settings"),
          roles: ["admin"],
        },
      ],
    },
  ],
};

export const getNavigationForUser = (userRoles: UserRole): NavSection[] => {
  const primaryRole = userRoles;
  return navigationConfig[primaryRole] || [];
};
