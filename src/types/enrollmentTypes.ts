import type { Course } from "./courseTypes";
import type { User } from "./userTypes";

export const ENROLLMENT_STATUS = {
  ACTIVE: "active",
  COMPLETED: "completed",
  SUSPENDED: "suspended",
} as const;

export type EnrollmentStatus =
  (typeof ENROLLMENT_STATUS)[keyof typeof ENROLLMENT_STATUS];

export const PROGRESS_STATUS = {
  COMPLETED: "completed",
  IN_PROGRESS: "in_progress",
  NOT_STARTED: "not_started",
} as const;

export type ProgressStatus =
  (typeof PROGRESS_STATUS)[keyof typeof PROGRESS_STATUS];

export interface Enrollment {
  _id: string;
  student: User | string;
  course: Course | string;
  status: EnrollmentStatus;
  enrolledAt: string;
  completedAt?: string;
  completionPercentage: number;
  certificateIssued: boolean;
  currentModuleId?: string;
  currentLessonId?: string;
  lastAccessedAt: string;
  timeSpent: number;
  createdAt: string;
  updatedAt: string;
}

export interface LessonProgress {
  _id: string;
  student: string;
  course: string;
  moduleId: string;
  lessonId: string;
  status: ProgressStatus;
  completedAt?: string;
  score?: number;
  attempts: number;
  timeSpent: number;
  createdAt: string;
  updatedAt: string;
}

export interface MarkLessonCompleteData {
  courseId: string;
  moduleId: string;
  lessonId: string;
  status: ProgressStatus;
  score?: number;
  timeSpent?: number;
}

export interface CourseProgressStats {
  totalLessons: number;
  completedLessons: number;
  inProgressLessons: number;
  completionPercentage: number;
}

export interface CourseProgressResponse {
  enrollment: {
    _id: string;
    completionPercentage: number;
    status: EnrollmentStatus;
    currentModuleId?: string;
    currentLessonId?: string;
    lastAccessedAt: string;
  };
  stats: CourseProgressStats;
  progress: LessonProgress[];
}

export interface EnrollmentState {
  enrollments: Enrollment[];
  currentEnrollment: Enrollment | null;
  courseProgress: Record<string, CourseProgressResponse>;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: string | null;
  message: string | null;
}
