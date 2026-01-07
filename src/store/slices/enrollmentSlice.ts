import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import enrollmentService from "../../services/enrollmentService";
import type {
  EnrollmentState,
  Enrollment,
  MarkLessonCompleteData,
  LessonProgress,
  CourseProgressResponse,
} from "../../types";
import { getErrorMessage } from "../../lib/error";

const initialState: EnrollmentState = {
  enrollments: [],
  currentEnrollment: null,
  courseProgress: {},
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
  message: null,
};

export const enrollInCourse = createAsyncThunk<
  Enrollment,
  string,
  { rejectValue: string }
>("enrollment/enroll", async (courseId, thunkAPI) => {
  try {
    return await enrollmentService.enrollInCourse(courseId);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "Failed to enroll in course")
    );
  }
});

export const getMyEnrollments = createAsyncThunk<
  Enrollment[],
  void,
  { rejectValue: string }
>("enrollment/getMyEnrollments", async (_, thunkAPI) => {
  try {
    return await enrollmentService.getMyEnrollments();
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "Failed to fetch enrollments")
    );
  }
});

export const getEnrollmentByCourse = createAsyncThunk<
  Enrollment,
  string,
  { rejectValue: string }
>("enrollment/getEnrollmentByCourse", async (courseId, thunkAPI) => {
  try {
    return await enrollmentService.getEnrollmentByCourse(courseId);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "Not enrolled in this course")
    );
  }
});

export const unenrollFromCourse = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("enrollment/unenroll", async (enrollmentId, thunkAPI) => {
  try {
    await enrollmentService.unenrollFromCourse(enrollmentId);
    return enrollmentId;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "Failed to unenroll")
    );
  }
});

export const markLessonComplete = createAsyncThunk<
  LessonProgress,
  MarkLessonCompleteData,
  { rejectValue: string }
>("enrollment/markLessonComplete", async (data, thunkAPI) => {
  try {
    return await enrollmentService.markLessonComplete(data);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "Failed to update progress")
    );
  }
});

export const getCourseProgress = createAsyncThunk<
  CourseProgressResponse,
  string,
  { rejectValue: string }
>("enrollment/getCourseProgress", async (courseId, thunkAPI) => {
  try {
    return await enrollmentService.getCourseProgress(courseId);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "Failed to fetch progress")
    );
  }
});

export const getLessonProgress = createAsyncThunk<
  LessonProgress,
  { courseId: string; lessonId: string },
  { rejectValue: string }
>("enrollment/getLessonProgress", async ({ courseId, lessonId }, thunkAPI) => {
  try {
    return await enrollmentService.getLessonProgress(courseId, lessonId);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "Failed to fetch lesson progress")
    );
  }
});

const enrollmentSlice = createSlice({
  name: "enrollment",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.error = null;
      state.message = null;
    },
    clearCurrentEnrollment: (state) => {
      state.currentEnrollment = null;
    },
    clearCourseProgress: (state, action) => {
      if (action.payload) {
        delete state.courseProgress[action.payload];
      } else {
        state.courseProgress = {};
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(enrollInCourse.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(enrollInCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentEnrollment = action.payload;
        state.enrollments.push(action.payload);
        state.message = "Enrolled successfully";
      })
      .addCase(enrollInCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload || "Failed to enroll";
      })

      .addCase(getMyEnrollments.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getMyEnrollments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.enrollments = action.payload;
      })
      .addCase(getMyEnrollments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload || "Failed to fetch enrollments";
      })

      .addCase(getEnrollmentByCourse.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getEnrollmentByCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentEnrollment = action.payload;
      })
      .addCase(getEnrollmentByCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload || "Not enrolled";
      })

      .addCase(unenrollFromCourse.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(unenrollFromCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.enrollments = state.enrollments.filter(
          (e) => e._id !== action.payload
        );
        if (state.currentEnrollment?._id === action.payload) {
          state.currentEnrollment = null;
        }
        state.message = "Unenrolled successfully";
      })
      .addCase(unenrollFromCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload || "Failed to unenroll";
      })

      .addCase(markLessonComplete.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(markLessonComplete.fulfilled, (state, _action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Progress updated";
      })
      .addCase(markLessonComplete.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload || "Failed to update progress";
      })

      .addCase(getCourseProgress.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getCourseProgress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const courseId = action.meta.arg;
        state.courseProgress[courseId] = action.payload;
      })
      .addCase(getCourseProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload || "Failed to fetch progress";
      });
  },
});

export const { reset, clearCurrentEnrollment, clearCourseProgress } =
  enrollmentSlice.actions;
export default enrollmentSlice.reducer;
