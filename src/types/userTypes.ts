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
