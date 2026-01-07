export * from "./authTypes";
export * from "./userTypes";
export * from "./themeTypes";

export * from "./courseTypes";
export * from "./enrollmentTypes";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};
