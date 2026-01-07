export const LESSON_TYPES = {
  VIDEO: "video",
  QUIZ: "quiz",
  READING: "reading",
  ASSIGNMENT: "assignment",
} as const;

export type LessonType = (typeof LESSON_TYPES)[keyof typeof LESSON_TYPES];

export const COURSE_LEVELS = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
} as const;

export type CourseLevel = (typeof COURSE_LEVELS)[keyof typeof COURSE_LEVELS];

export const LevelLabels: Record<CourseLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export const levels = ["all", ...Object.values(COURSE_LEVELS)] as const;

export type SelectedLevel = "all" | CourseLevel;

export const COURSE_CATEGORIES = {
  PROGRAMMING: "programming",
  WEB_DEV: "web_dev",
  MOBILE_DEV: "mobile_dev",
  DATA_SCIENCE: "data_science",
  AI_ML: "ai_ml",
  CYBERSECURITY: "cybersecurity",
  CLOUD: "cloud",
  DEVOPS: "devops",
  UI_UX: "ui_ux",
  BUSINESS: "business",
  OTHER: "other",
} as const;

export type CourseCategory =
  (typeof COURSE_CATEGORIES)[keyof typeof COURSE_CATEGORIES];

export const CategoryLabels: Record<CourseCategory, string> = {
  programming: "Programming",
  web_dev: "Web Development",
  mobile_dev: "Mobile Development",
  data_science: "Data Science",
  cybersecurity: "cybersecurity",
  ai_ml: "AI / ML",
  cloud: "Cloud",
  devops: "DevOps",
  ui_ux: "Design",
  business: "Business",
  other: "Other",
};

export const categories = ["all", ...Object.values(COURSE_CATEGORIES)] as const;

export type SelectedCategory = "all" | CourseCategory;

export interface Media {
  url: string;
  publicId: string;
  format: string;
  size: number;
  resourceType: any;
}

export interface Lesson {
  _id?: string;
  title: string;
  description?: string;
  type: LessonType;
  duration?: number;
  order: number;
  video?: Media;
  readingContent?: string;
  quizId?: string;
  resources?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Module {
  _id?: string;
  title: string;
  description?: string;
  order: number;
  lessons: Lesson[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Instructor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  bio?: string;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail?: Media;
  instructor: Instructor | string;
  category: CourseCategory;
  level: CourseLevel;
  price: number;
  modules: Module[];
  requirements?: string[];
  learningOutcomes?: string[];
  enableSequentialLearning: boolean;
  totalDuration?: number;
  totalLessons?: number;
  enrollmentCount: number;
  rating?: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseData {
  title: string;
  description: string;
  category: CourseCategory;
  level: CourseLevel;
  price: number;
  thumbnail?: Media;
  modules: Omit<Module, "_id" | "createdAt" | "updatedAt">[];
  requirements?: string[];
  learningOutcomes?: string[];
  enableSequentialLearning?: boolean;
}

export interface UpdateCourseData extends Partial<CreateCourseData> {}

export interface CourseFilters {
  category?: string;
  level?: CourseLevel;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CoursesResponse {
  courses: Course[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CourseState {
  courses: Course[];
  currentCourse: Course | null;
  myCourses: Course[];
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: string | null;
  message: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
}

export interface LessonUI extends Omit<Lesson, "_id"> {
  id: string;
  videoFile?: string;
  uploadProgress?: number;
}

export interface ModuleUI {
  id: string;
  title: string;
  description?: string;
  isExpanded: boolean;
  lessons: LessonUI[];
}
