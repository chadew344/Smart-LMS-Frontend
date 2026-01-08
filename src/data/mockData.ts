import type { Quiz } from "../components/common/QuizCard";
import {
  COURSE_CATEGORIES,
  COURSE_LEVELS,
  type CourseCategory,
  type CourseLevel,
  type Media,
} from "../types";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: Media;
  instructor: string;
  category: CourseCategory;
  duration: string;
  lessons: number;
  students: number;
  rating: number;
  progress?: number;
  price: number;
  isFree?: boolean;
  level: CourseLevel;

  _id: string;
  modules: [];
  enableSequentialLearning: boolean;
  enrollmentCount: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export const mockCourses: Course[] = [
  {
    _id: "1",
    title: "Complete React Developer Course",
    description:
      "Master React.js from scratch. Build modern web applications with hooks, context, and best practices.",

    thumbnail: {
      url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60",
      publicId: "react-course",
      format: "jpg",
      size: 0,
      resourceType: "image",
    },

    instructor: "Dr. Sarah Chen",

    category: COURSE_CATEGORIES.WEB_DEV,
    level: COURSE_LEVELS.INTERMEDIATE,

    price: 49.99,

    modules: [],
    enableSequentialLearning: false,

    enrollmentCount: 12453,
    rating: 4.9,

    isPublished: true,

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),

    id: "1",
    duration: "24h 30m",
    lessons: 48,
    students: 12453,
    progress: 65,
  },

  {
    _id: "2",
    title: "Python for Data Science",
    description:
      "Learn Python programming for data analysis, visualization, and machine learning fundamentals.",

    thumbnail: {
      url: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=60",
      publicId: "python-course",
      format: "jpg",
      size: 0,
      resourceType: "image",
    },

    instructor: "Prof. Michael Torres",

    category: COURSE_CATEGORIES.DATA_SCIENCE,
    level: COURSE_LEVELS.BEGINNER,

    price: 59.99,

    modules: [],

    enableSequentialLearning: false,

    enrollmentCount: 8921,
    rating: 4.8,

    isPublished: true,

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),

    id: "2",
    duration: "32h 15m",
    lessons: 62,
    students: 8921,
    progress: 30,
  },

  {
    _id: "3",
    title: "UI/UX Design Masterclass",
    description:
      "Create stunning user interfaces and experiences. Learn Figma, design systems, and user research.",

    thumbnail: {
      url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=60",
      publicId: "uiux-course",
      format: "jpg",
      size: 0,
      resourceType: "image",
    },

    instructor: "Emma Wilson",

    category: COURSE_CATEGORIES.UI_UX,
    level: COURSE_LEVELS.BEGINNER,

    price: 0,

    modules: [],

    enableSequentialLearning: false,

    enrollmentCount: 6234,
    rating: 4.7,

    isPublished: true,

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),

    id: "3",
    duration: "18h 45m",
    lessons: 36,
    students: 6234,
    isFree: true,
  },

  {
    _id: "4",
    title: "Advanced TypeScript Patterns",
    description:
      "Deep dive into TypeScript generics, decorators, and advanced type manipulation techniques.",

    thumbnail: {
      url: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&auto=format&fit=crop&q=60",
      publicId: "ts-course",
      format: "jpg",
      size: 0,
      resourceType: "image",
    },

    instructor: "Alex Johnson",

    category: COURSE_CATEGORIES.PROGRAMMING,
    level: COURSE_LEVELS.ADVANCED,

    price: 69.99,

    modules: [],

    enableSequentialLearning: false,

    enrollmentCount: 4521,
    rating: 4.9,

    isPublished: true,

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),

    id: "4",
    duration: "14h 20m",
    lessons: 28,
    students: 4521,
    progress: 85,
  },

  {
    _id: "5",
    title: "Node.js Backend Development",
    description:
      "Build scalable REST APIs and backend services with Node.js, Express, and MongoDB.",

    thumbnail: {
      url: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop&q=60",
      publicId: "node-course",
      format: "jpg",
      size: 0,
      resourceType: "image",
    },

    instructor: "James Miller",

    category: COURSE_CATEGORIES.PROGRAMMING,
    level: COURSE_LEVELS.INTERMEDIATE,

    price: 54.99,

    modules: [],

    enableSequentialLearning: false,

    enrollmentCount: 7832,
    rating: 4.6,

    isPublished: true,

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),

    id: "5",
    duration: "28h 10m",
    lessons: 54,
    students: 7832,
  },

  {
    _id: "6",
    title: "Machine Learning Fundamentals",
    description:
      "Introduction to ML algorithms, neural networks, and practical applications with TensorFlow.",

    thumbnail: {
      url: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&auto=format&fit=crop&q=60",
      publicId: "ml-course",
      format: "jpg",
      size: 0,
      resourceType: "image",
    },

    instructor: "Dr. Lisa Park",

    category: COURSE_CATEGORIES.AI_ML,
    level: COURSE_LEVELS.ADVANCED,

    price: 79.99,

    modules: [],

    enableSequentialLearning: false,

    enrollmentCount: 9123,
    rating: 4.8,

    isPublished: true,

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),

    id: "6",
    duration: "40h 30m",
    lessons: 72,
    students: 9123,
  },
];

export const mockQuizzes: Quiz[] = [
  {
    id: "1",
    title: "React Hooks Assessment",
    description:
      "Test your understanding of useState, useEffect, and custom hooks in React applications.",
    courseName: "Complete React Developer Course",
    questions: 20,
    duration: 30,
    attempts: 2,
    bestScore: 85,
    status: "completed",
  },
  {
    id: "2",
    title: "Python Basics Quiz",
    description:
      "Evaluate your knowledge of Python syntax, data types, and basic programming concepts.",
    courseName: "Python for Data Science",
    questions: 15,
    duration: 20,
    status: "in-progress",
    dueDate: "Tomorrow, 11:59 PM",
  },
  {
    id: "3",
    title: "TypeScript Generics",
    description:
      "Advanced quiz on generic types, constraints, and utility types in TypeScript.",
    courseName: "Advanced TypeScript Patterns",
    questions: 25,
    duration: 45,
    status: "not-started",
    dueDate: "Dec 28, 2025",
  },
  {
    id: "4",
    title: "Design Principles",
    description:
      "Test your understanding of core UI/UX design principles and best practices.",
    courseName: "UI/UX Design Masterclass",
    questions: 18,
    duration: 25,
    attempts: 1,
    bestScore: 92,
    status: "completed",
  },
];

export const mockStudentStats = {
  enrolledCourses: 6,
  completedCourses: 2,
  hoursLearned: 48,
  certificates: 2,
  averageScore: 87,
  streak: 12,
};

export const mockInstructorStats = {
  totalCourses: 8,
  totalStudents: 4521,
  totalRevenue: 28450,
  averageRating: 4.8,
  pendingReviews: 23,
  activeQuizzes: 12,
};

export const mockAdminStats = {
  totalUsers: 45892,
  totalCourses: 342,
  totalRevenue: 892450,
  monthlyGrowth: 12.5,
  activeInstructors: 89,
  pendingApprovals: 15,
};

export const mockRecentActivities = [
  {
    id: "1",
    action: "Completed lesson",
    target: "React Hooks Deep Dive",
    time: "2 hours ago",
  },
  {
    id: "2",
    action: "Scored 95% on",
    target: "JavaScript Basics Quiz",
    time: "5 hours ago",
  },
  {
    id: "3",
    action: "Started course",
    target: "Advanced TypeScript Patterns",
    time: "1 day ago",
  },
  {
    id: "4",
    action: "Earned certificate",
    target: "Python for Data Science",
    time: "3 days ago",
  },
];
