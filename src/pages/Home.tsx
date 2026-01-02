import { Link, useNavigate } from "react-router-dom";
import { logout } from "../store/slices/authSlice";
import type { AppDispatch, RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import type { UserRole } from "../types";

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  const hasRole = (role: UserRole) => user?.roles?.includes(role);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl mb-4">
          Welcome {user?.firstName ?? "User"}!
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          {user
            ? `Roles: ${user.roles.join(", ")}`
            : "Learn new skills, share your knowledge, and connect with learners worldwide."}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user && (
            <>
              <Link
                to="/courses"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
              >
                Browse Courses
              </Link>
              {hasRole("instructor") && (
                <Link
                  to="/create-course"
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition"
                >
                  Create Course
                </Link>
              )}
            </>
          )}
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition disabled:opacity-50"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
