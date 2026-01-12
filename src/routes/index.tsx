import { lazy, Suspense, useEffect, useRef, type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import type { UserRole } from "../types";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { refreshAuth } from "../store/slices/authSlice";

import { Spinner } from "../components/ui/spinner";

const Index = lazy(() => import("../pages/Landing"));
const PublicLayout = lazy(() => import("../components/layout/PublicLayout"));
const BrowseCourse = lazy(() => import("../pages/BrowseCourse"));
const StudenntMyCourses = lazy(() => import("../pages/student/MyCourse"));
const InstructorCourseDetail = lazy(
  () => import("../pages/instructor/InstrcutorCourseDetails")
);

const DashboardLayout = lazy(
  () => import("../components/layout/DashboardLayout")
);
const DashboardIndex = lazy(() => import("../pages/DashboardIndex"));
const CourseDetail = lazy(() => import("../pages/courseDetails"));
const CreateCourse = lazy(() => import("../pages/CreateCourse"));
const Payment = lazy(() => import("../pages/Payment"));
const PaymentSuccess = lazy(() => import("../pages/PaymentSuccess"));

const MyCourses = lazy(() => import("../pages/instructor/MyCourses"));
const Auth = lazy(() => import("../pages/Auth"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Reports = lazy(() => import("../pages/Report"));
const FloatingChatButton = lazy(() => import("../components/features/AiChat"));

type RequireAuthProps = {
  children: ReactNode;
  roles?: UserRole[];
};

const RequireAuth = ({ children }: RequireAuthProps) => {
  const { isAuthenticated, isLoading, isInitialized } = useAppSelector(
    (state) => state.auth
  );

  if (!isInitialized || isLoading) {
    return <Spinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default function Router() {
  const dispatch = useAppDispatch();

  const ranOnce = useRef(false);

  useEffect(() => {
    if (ranOnce.current) return;
    ranOnce.current = true;

    dispatch(refreshAuth());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <DashboardLayout />
              </RequireAuth>
            }
          >
            <Route index element={<DashboardIndex />} />
            <Route path="courses" element={<BrowseCourse />} />
            <Route path="my-courses" element={<StudenntMyCourses />} />
            <Route path="reports" element={<Reports />} />

            <Route path="teaching">
              <Route path="create-course" element={<CreateCourse />} />
              <Route path="my-classes" element={<MyCourses />} />
              <Route
                path="my-classes/:courseId"
                element={<InstructorCourseDetail />}
              />
            </Route>
          </Route>

          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Index />} />
            <Route path="/courses" element={<BrowseCourse />} />
            <Route path="/courses/:courseId" element={<CourseDetail />} />
          </Route>

          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="payment/:courseId" element={<Payment />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <FloatingChatButton />
      </Suspense>
    </BrowserRouter>
  );
}
