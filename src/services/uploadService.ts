import api from "./api";
import type { ApiResponse } from "../types";

export interface UploadResponse {
  url: string;
  publicId: string;
  resourceType: "image" | "video" | "raw";
  format: string;
  size: number;
}

const uploadService = {
  uploadImage: async (file: File): Promise<UploadResponse> => {
    if (!file.type.startsWith("image/")) {
      throw new Error("Please upload an image file (JPG, PNG, etc.)");
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error("Image size must be less than 5MB");
    }

    const formData = new FormData();
    formData.append("media", file);

    try {
      const response = await api.post<ApiResponse<UploadResponse>>(
        "/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to upload image"
      );
    }
  },

  uploadVideo: async (
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<UploadResponse> => {
    if (!file.type.startsWith("video/")) {
      throw new Error("Please upload a video file (MP4, MOV, etc.)");
    }

    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
      throw new Error("Video size must be less than 500MB");
    }

    const formData = new FormData();
    formData.append("media", file);

    try {
      const response = await api.post<ApiResponse<UploadResponse>>(
        "/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onProgress?.(percentCompleted);
            }
          },
        }
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to upload video"
      );
    }
  },

  deleteFile: async (publicId: string): Promise<void> => {
    try {
      await api.delete(`/upload/${publicId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to delete file");
    }
  },
};

export default uploadService;
