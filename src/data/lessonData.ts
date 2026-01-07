export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: "video" | "quiz" | "reading" | "assignment";
  videoUrl?: string;
  isCompleted: boolean;
  isLocked: boolean;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export const mockModules: Module[] = [
  {
    id: "1",
    title: "Getting Started with React",
    lessons: [
      {
        id: "1-1",
        title: "Introduction to React",
        duration: "12:30",
        type: "video",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        isCompleted: true,
        isLocked: false,
      },
      {
        id: "1-2",
        title: "Setting Up Your Environment",
        duration: "8:45",
        type: "video",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        isCompleted: true,
        isLocked: false,
      },
      {
        id: "1-3",
        title: "Your First React Component",
        duration: "15:20",
        type: "video",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        isCompleted: false,
        isLocked: false,
      },
      {
        id: "1-4",
        title: "Module 1 Quiz",
        duration: "10 min",
        type: "quiz",
        isCompleted: false,
        isLocked: false,
      },
    ],
  },
  {
    id: "2",
    title: "React Hooks Deep Dive",
    lessons: [
      {
        id: "2-1",
        title: "Understanding useState",
        duration: "18:10",
        type: "video",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        isCompleted: false,
        isLocked: false,
      },
      {
        id: "2-2",
        title: "Working with useEffect",
        duration: "22:35",
        type: "video",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        isCompleted: false,
        isLocked: true,
      },
      {
        id: "2-3",
        title: "Custom Hooks",
        duration: "16:45",
        type: "video",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        isCompleted: false,
        isLocked: true,
      },
      {
        id: "2-4",
        title: "Hooks Best Practices",
        duration: "8 min read",
        type: "reading",
        isCompleted: false,
        isLocked: true,
      },
      {
        id: "2-5",
        title: "Module 2 Quiz",
        duration: "15 min",
        type: "quiz",
        isCompleted: false,
        isLocked: true,
      },
    ],
  },
  {
    id: "3",
    title: "State Management",
    lessons: [
      {
        id: "3-1",
        title: "Context API Basics",
        duration: "20:00",
        type: "video",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        isCompleted: false,
        isLocked: true,
      },
      {
        id: "3-2",
        title: "useReducer for Complex State",
        duration: "25:15",
        type: "video",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        isCompleted: false,
        isLocked: true,
      },
      {
        id: "3-3",
        title: "State Management Assignment",
        duration: "1 hour",
        type: "assignment",
        isCompleted: false,
        isLocked: true,
      },
    ],
  },
];
