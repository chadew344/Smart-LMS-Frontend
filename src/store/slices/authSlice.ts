import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type {
  ApiResponse,
  AuthResponse,
  AuthState,
  LoginData,
  RegisterData,
} from "../../types";
import authService from "../../services/authService";

const initialState: AuthState = {
  user: null,
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
>("auth/login", async (userData: LoginData, thunkAPI) => {
  try {
    return await authService.login(userData);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, "Login failed"));
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

const getErrorMessage = (error: any, defaultMessage: string): string => {
  return error.response?.data?.message || error.message || defaultMessage;
};

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
        state.user = action.payload.user;
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
        state.user = action.payload.user;
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

      .addCase(refreshAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.isInitialized = true;
        state.message = "Token refresh successful";
      })
      .addCase(refreshAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload === "REFRESH_FAILED" ? "Session refresh failed" : null;
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

export const { reset, setAccessToken, setUser } = authSlice.actions;

export default authSlice.reducer;
