import type { Quiz } from "../components/common/QuizCard";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: {
    name: string;
    avatar?: string;
  };
  category: string;
  duration: string;
  lessons: number;
  students: number;
  rating: number;
  progress?: number;
  price?: number;
  isFree?: boolean;
  level: "Beginner" | "Intermediate" | "Advanced";
}

export const mockCourses: Course[] = [
  {
    id: "1",
    title: "Complete React Developer Course",
    description:
      "Master React.js from scratch. Build modern web applications with hooks, context, and best practices.",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60",
    instructor: { name: "Dr. Sarah Chen" },
    category: "Web Development",
    duration: "24h 30m",
    lessons: 48,
    students: 12453,
    rating: 4.9,
    progress: 65,
    level: "Intermediate",
    price: 49.99,
  },
  {
    id: "2",
    title: "Python for Data Science",
    description:
      "Learn Python programming for data analysis, visualization, and machine learning fundamentals.",
    thumbnail:
      "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=60",
    instructor: { name: "Prof. Michael Torres" },
    category: "Data Science",
    duration: "32h 15m",
    lessons: 62,
    students: 8921,
    rating: 4.8,
    progress: 30,
    level: "Beginner",
    price: 59.99,
  },
  {
    id: "3",
    title: "UI/UX Design Masterclass",
    description:
      "Create stunning user interfaces and experiences. Learn Figma, design systems, and user research.",
    thumbnail:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=60",
    instructor: { name: "Emma Wilson" },
    category: "Design",
    duration: "18h 45m",
    lessons: 36,
    students: 6234,
    rating: 4.7,
    level: "Beginner",
    isFree: true,
  },
  {
    id: "4",
    title: "Advanced TypeScript Patterns",
    description:
      "Deep dive into TypeScript generics, decorators, and advanced type manipulation techniques.",
    thumbnail:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&auto=format&fit=crop&q=60",
    instructor: { name: "Alex Johnson" },
    category: "Programming",
    duration: "14h 20m",
    lessons: 28,
    students: 4521,
    rating: 4.9,
    progress: 85,
    level: "Advanced",
    price: 69.99,
  },
  {
    id: "5",
    title: "Node.js Backend Development",
    description:
      "Build scalable REST APIs and backend services with Node.js, Express, and MongoDB.",
    thumbnail:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop&q=60",
    instructor: { name: "James Miller" },
    category: "Backend",
    duration: "28h 10m",
    lessons: 54,
    students: 7832,
    rating: 4.6,
    level: "Intermediate",
    price: 54.99,
  },
  {
    id: "6",
    title: "Machine Learning Fundamentals",
    description:
      "Introduction to ML algorithms, neural networks, and practical applications with TensorFlow.",
    thumbnail:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&auto=format&fit=crop&q=60",
    instructor: { name: "Dr. Lisa Park" },
    category: "AI/ML",
    duration: "40h 30m",
    lessons: 72,
    students: 9123,
    rating: 4.8,
    level: "Advanced",
    price: 79.99,
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
