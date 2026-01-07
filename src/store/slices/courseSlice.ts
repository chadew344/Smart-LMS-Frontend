import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import courseService from "../../services/courseService";
import type {
  CourseState,
  Course,
  CreateCourseData,
  UpdateCourseData,
  CourseFilters,
  CoursesResponse,
} from "../../types";
import { getErrorMessage } from "../../lib/error";
getErrorMessage;

const initialState: CourseState = {
  courses: [],
  currentCourse: null,
  myCourses: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
  message: null,
  pagination: null,
};

export const getCourses = createAsyncThunk<
  CoursesResponse,
  CourseFilters,
  { rejectValue: string }
>("course/getAll", async (filters, thunkAPI) => {
  try {
    return await courseService.getCourses(filters);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "Failed to fetch courses")
    );
  }
});

export const getCourse = createAsyncThunk<
  Course,
  string,
  { rejectValue: string }
>("course/getOne", async (courseId, thunkAPI) => {
  try {
    return await courseService.getCourse(courseId);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "Failed to fetch course")
    );
  }
});

export const createCourse = createAsyncThunk<
  Course,
  CreateCourseData,
  { rejectValue: string }
>("course/create", async (courseData, thunkAPI) => {
  try {
    return await courseService.createCourse(courseData);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "Failed to create course")
    );
  }
});

export const updateCourse = createAsyncThunk<
  Course,
  { courseId: string; courseData: UpdateCourseData },
  { rejectValue: string }
>("course/update", async ({ courseId, courseData }, thunkAPI) => {
  try {
    return await courseService.updateCourse(courseId, courseData);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "Failed to update course")
    );
  }
});

export const deleteCourse = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("course/delete", async (courseId, thunkAPI) => {
  try {
    await courseService.deleteCourse(courseId);
    return courseId;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "Failed to delete course")
    );
  }
});

export const publishCourse = createAsyncThunk<
  Course,
  string,
  { rejectValue: string }
>("course/publish", async (courseId, thunkAPI) => {
  try {
    return await courseService.publishCourse(courseId);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "Failed to publish course")
    );
  }
});

export const unPublishCourse = createAsyncThunk<
  Course,
  string,
  { rejectValue: string }
>("course/publish", async (courseId, thunkAPI) => {
  try {
    return await courseService.publishCourse(courseId);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "Failed to publish course")
    );
  }
});

export const getInstructorCourses = createAsyncThunk<
  Course[],
  void,
  { rejectValue: string }
>("course/getInstructorCourses", async (_, thunkAPI) => {
  try {
    return await courseService.getInstructorCourses();
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "Failed to fetch instructor courses")
    );
  }
});

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.error = null;
      state.message = null;
    },
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
    },
    clearCourses: (state) => {
      state.courses = [];
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCourses.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.courses = action.payload.courses;
        state.pagination = action.payload.pagination;
      })
      .addCase(getCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload || "Failed to fetch courses";
      })

      .addCase(getCourse.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentCourse = action.payload;
      })
      .addCase(getCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload || "Failed to fetch course";
      })

      .addCase(createCourse.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentCourse = action.payload;
        state.message = "Course created successfully";
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload || "Failed to create course";
      })

      .addCase(updateCourse.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentCourse = action.payload;
        state.message = "Course updated successfully";
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload || "Failed to update course";
      })

      .addCase(deleteCourse.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.courses = state.courses.filter(
          (course) => course._id !== action.payload
        );
        state.myCourses = state.myCourses.filter(
          (course) => course._id !== action.payload
        );
        state.message = "Course deleted successfully";
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload || "Failed to delete course";
      })

      .addCase(publishCourse.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(publishCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentCourse = action.payload;
        state.message = action.payload.isPublished
          ? "Course published successfully"
          : "Course unpublished successfully";
      })
      .addCase(publishCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload || "Failed to publish course";
      })

      .addCase(getInstructorCourses.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getInstructorCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.myCourses = action.payload;
      })
      .addCase(getInstructorCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload || "Failed to fetch instructor courses";
      });
  },
});

export const { reset, clearCurrentCourse, clearCourses } = courseSlice.actions;
export default courseSlice.reducer;
