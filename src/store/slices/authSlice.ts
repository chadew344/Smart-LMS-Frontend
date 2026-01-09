import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  USER_ROLES,
  type ApiResponse,
  type AuthResponse,
  type AuthState,
  type LoginData,
  type RegisterData,
  type UserRole,
} from "../../types";
import authService from "../../services/authService";
import { getErrorMessage } from "../../lib/error";
getErrorMessage;

const initialState: AuthState = {
  user: null,
  activeRole:
    (localStorage.getItem("activeRole") as UserRole) ?? USER_ROLES.STUDENT,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,
  message: "",
};

export const register = createAsyncThunk<
  AuthResponse,
  RegisterData,
  { rejectValue: string }
>("auth/register", async (userData, thunkAPI) => {
  try {
    return await authService.register(userData);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "Registration failed")
    );
  }
});

export const login = createAsyncThunk<
  AuthResponse,
  LoginData,
  { rejectValue: string }
>("auth/login", async (userData, thunkAPI) => {
  try {
    return await authService.login(userData);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, "Login failed"));
  }
});

export const loginWithGoogle = createAsyncThunk<
  AuthResponse,
  string,
  { rejectValue: string }
>("auth/google", async (code, thunkAPI) => {
  try {
    return await authService.loginWithGoogle(code);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, "Login failed"));
  }
});

export const upgradeToInstructor = createAsyncThunk<
  AuthResponse,
  void,
  { rejectValue: string }
>("auth/upgradeToInstructor", async (_, thunkAPI) => {
  try {
    return await authService.upgradeToInstructor();
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const refreshAuth = createAsyncThunk<
  AuthResponse,
  void,
  { rejectValue: string }
>("auth/refresh", async (_, thunkAPI) => {
  try {
    return await authService.refreshToken();
  } catch (error: any) {
    console.log(error);
    if (error?.response?.status === 401 || error?.response?.status === 400) {
      return thunkAPI.rejectWithValue("NO_SESSION");
    }

    return thunkAPI.rejectWithValue("REFRESH_FAILED");
  }
});

export const logout = createAsyncThunk<
  ApiResponse<null>,
  void,
  { rejectValue: string }
>("auth/logout", async (_, thunkAPI) => {
  try {
    return await authService.logout();
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const normalizeUser = (user: any) => ({
  ...user,
  roles: user.roles?.map((r: string) => r.toLowerCase()),
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.message = "";
    },

    setUser: (state, action) => {
      state.user = action.payload;
    },

    setActiveRole: (state, action) => {
      if (!state.user) return;

      const role = action.payload;

      if (state.user.roles.includes(USER_ROLES.ADMIN)) return;

      if (
        role === USER_ROLES.INSTRUCTOR &&
        !state.user.roles.includes(USER_ROLES.INSTRUCTOR)
      )
        return;

      state.activeRole = role;
      localStorage.setItem("activeRole", role);
    },

    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = normalizeUser(action.payload.user);
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.message = "Registration successful";
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Registration failed";
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.message = "";
      })

      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = normalizeUser(action.payload.user);
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.message = "Login successful";
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Login failed";
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.message = "";
      })

      .addCase(loginWithGoogle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = normalizeUser(action.payload.user);
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.message = "Login successful";
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Login failed";
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.message = "";
      })

      .addCase(upgradeToInstructor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(upgradeToInstructor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = normalizeUser(action.payload.user);
        state.activeRole = USER_ROLES.INSTRUCTOR;
        state.isAuthenticated = true;
        state.message =
          "Your account has been successfully upgraded to instructor";
      })
      .addCase(upgradeToInstructor.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload ?? "Unable to upgrade account to instructor";
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.message = "";
      })

      .addCase(refreshAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = normalizeUser(action.payload.user);
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.isInitialized = true;
        state.message = "Token refresh successful";
      })
      .addCase(refreshAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload === "REFRESH_FAILED" ? "" : null;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
        state.message = "";
      })

      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.message = action.payload.message ?? "Logout successful";
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Logout failed";
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      });
  },
});

export const { reset, setAccessToken, setUser, setActiveRole } =
  authSlice.actions;

export default authSlice.reducer;
