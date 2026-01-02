import { Link } from "react-router-dom";
import type { RootState } from "../store/store";
import { useSelector } from "react-redux";

const Landing = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Welcome to Smart LMS
        </h1>
        <p className="text-gray-600 text-lg">
          Manage courses, track progress, and enhance learning easily.
        </p>
      </header>

      <div className="flex flex-wrap justify-center gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow-md w-64 text-center hover:shadow-xl transition">
          <h2 className="text-2xl font-semibold mb-2">Courses</h2>
          <p className="text-gray-500 text-sm">
            Explore available courses and enroll in the ones that fit your
            learning goals.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md w-64 text-center hover:shadow-xl transition">
          <h2 className="text-2xl font-semibold mb-2">Progress Tracker</h2>
          <p className="text-gray-500 text-sm">
            Monitor your learning progress and achieve your targets efficiently.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md w-64 text-center hover:shadow-xl transition">
          <h2 className="text-2xl font-semibold mb-2">Community</h2>
          <p className="text-gray-500 text-sm">
            Join discussions, collaborate with peers, and enhance your
            knowledge.
          </p>
        </div>
      </div>

      <div>
        {isAuthenticated ? (
          <Link
            to="/home"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            Go to Home
          </Link>
        ) : (
          <div className="flex space-x-4">
            <Link
              to="/login"
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Landing;
