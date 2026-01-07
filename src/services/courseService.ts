import api from "./api";
import type {
  ApiResponse,
  Course,
  CoursesResponse,
  CreateCourseData,
  UpdateCourseData,
  CourseFilters,
} from "../types";

const courseService = {
  getCourses: async (filters?: CourseFilters): Promise<CoursesResponse> => {
    const params = new URLSearchParams();
    if (filters?.category) params.append("category", filters.category);
    if (filters?.level) params.append("level", filters.level);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    console.log(filters);

    const response = await api.get<ApiResponse<CoursesResponse>>(
      `/courses?${params.toString()}`
    );
    return response.data.data;
  },

  getCourse: async (courseId: string): Promise<Course> => {
    const response = await api.get<ApiResponse<Course>>(`/courses/${courseId}`);
    return response.data.data;
  },

  createCourse: async (courseData: CreateCourseData): Promise<Course> => {
    console.log(courseData);
    const response = await api.post<ApiResponse<Course>>(
      "/courses",
      courseData
    );
    return response.data.data;
  },

  updateCourse: async (
    courseId: string,
    courseData: UpdateCourseData
  ): Promise<Course> => {
    const response = await api.patch<ApiResponse<Course>>(
      `/courses/${courseId}`,
      courseData
    );
    return response.data.data;
  },

  deleteCourse: async (courseId: string): Promise<void> => {
    await api.delete(`/courses/${courseId}`);
  },

  publishCourse: async (courseId: string): Promise<Course> => {
    const response = await api.put<ApiResponse<Course>>(
      `/courses/${courseId}/publish`
    );
    return response.data.data;
  },

  getInstructorCourses: async (): Promise<Course[]> => {
    const response = await api.get<ApiResponse<Course[]>>(
      "/courses/instructor/my-courses"
    );
    return response.data.data;
  },
};

export default courseService;
