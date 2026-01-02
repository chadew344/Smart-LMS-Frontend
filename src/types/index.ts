export const USER_ROLES = {
  STUDENT: "student",
  INSTRUCTOR: "instructor",
  ADMIN: "admin",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export type RegisterRole = Exclude<UserRole, "admin">;

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: UserRole[];
  profileImage?: string;
  bio?: string;
  expertise?: string[];
}

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  message: string | null;
}

export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: RegisterRole;
}
