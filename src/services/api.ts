import axios, { AxiosError } from "axios";
import type { RootState } from "../store/store";

const PUBLIC_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/google",
];

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

let store: any;

export const injectStore = (_store: any) => {
  store = _store;
};

api.interceptors.request.use((config) => {
  const isPublic = PUBLIC_ENDPOINTS.some((url) => config.url?.includes(url));

  if (!isPublic && store) {
    const state = store.getState() as RootState;
    const token = state.auth.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (
      error.response?.status === 401 &&
      !PUBLIC_ENDPOINTS.some((url) => originalRequest.url?.includes(url)) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const { data } = await api.post("/auth/refresh", {});

        if (store && data.accessToken) {
          const { setAccessToken } = await import("../store/slices/authSlice");
          store.dispatch(setAccessToken(data.accessToken));
        }

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        return api(originalRequest);
      } catch (refreshErr) {
        if (store) {
          const { logout } = await import("../store/slices/authSlice");
          store.dispatch(logout());
        }

        window.location.href = "/login";

        console.error(refreshErr);
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
