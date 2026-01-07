import StudentDashboard from "./dashboard/StudentDashboard";
import InstructorDashboard from "./dashboard/InstructorDashboard";
import AdminDashboard from "./dashboard/AdminDashboard";
import { USER_ROLES } from "../types";
import { useAppSelector } from "../store/hook";

const DashboardIndex = () => {
  const { user, activeRole } = useAppSelector((state) => state.auth);

  if (!user) return null;

  if (user.roles.includes(USER_ROLES.ADMIN) && activeRole == USER_ROLES.ADMIN)
    return <AdminDashboard />;

  if (
    user.roles.includes(USER_ROLES.INSTRUCTOR) &&
    activeRole == USER_ROLES.INSTRUCTOR
  )
    return <InstructorDashboard />;

  return <StudentDashboard />;
};

export default DashboardIndex;
