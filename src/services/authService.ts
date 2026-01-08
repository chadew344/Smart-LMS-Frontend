import api from "./api";
import type {
  ApiResponse,
  AuthResponse,
  LoginData,
  RegisterData,
} from "../types";

const authService = {
  register: async (userData: RegisterData) => {
    const response = await api.post("/auth/register", userData);
    return response.data.data;
  },

  login: async (userData: LoginData): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      userData
    );
    return response.data.data;
  },

  upgradeToInstructor: async (): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>(
      "/auth/instructor"
    );
    return response.data.data;
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>("/auth/refresh");
    return response.data.data;
  },

  logout: async (): Promise<ApiResponse<null>> => {
    const response = await api.post<ApiResponse<null>>("/auth/logout");
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data.data;
  },
};

export default authService;
