import api from "./api";
import type {
  ApiResponse,
  Enrollment,
  MarkLessonCompleteData,
  LessonProgress,
  CourseProgressResponse,
} from "../types";

const enrollmentService = {
  enrollInCourse: async (courseId: string): Promise<Enrollment> => {
    const response = await api.post<ApiResponse<Enrollment>>("/enrollments", {
      courseId,
    });
    return response.data.data;
  },

  getMyEnrollments: async (): Promise<Enrollment[]> => {
    const response = await api.get<ApiResponse<Enrollment[]>>(
      "/enrollments/my-courses"
    );
    return response.data.data;
  },

  getEnrollment: async (enrollmentId: string): Promise<Enrollment> => {
    const response = await api.get<ApiResponse<Enrollment>>(
      `/enrollments/${enrollmentId}`
    );
    return response.data.data;
  },

  getEnrollmentByCourse: async (courseId: string): Promise<Enrollment> => {
    const response = await api.get<ApiResponse<Enrollment>>(
      `/enrollments/course/${courseId}`
    );
    return response.data.data;
  },

  unenrollFromCourse: async (enrollmentId: string): Promise<void> => {
    await api.delete(`/enrollments/${enrollmentId}`);
  },

  markLessonComplete: async (
    data: MarkLessonCompleteData
  ): Promise<LessonProgress> => {
    const response = await api.post<ApiResponse<LessonProgress>>(
      "/progress",
      data
    );
    return response.data.data;
  },

  getCourseProgress: async (
    courseId: string
  ): Promise<CourseProgressResponse> => {
    const response = await api.get<ApiResponse<CourseProgressResponse>>(
      `/progress/course/${courseId}`
    );
    return response.data.data;
  },

  getLessonProgress: async (
    courseId: string,
    lessonId: string
  ): Promise<LessonProgress> => {
    const response = await api.get<ApiResponse<LessonProgress>>(
      `/progress/lesson/${courseId}/${lessonId}`
    );
    return response.data.data;
  },
};

export default enrollmentService;
