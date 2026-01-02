import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "../schema/auth.schema";
import { register } from "../store/slices/authSlice";
import type { AppDispatch, RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, isAuthenticated, error } = useSelector(
    (state: RootState) => state.auth
  );
  const navigate = useNavigate();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });

  const onSubmit = (data: RegisterInput) => {
    dispatch(
      register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: "student", // default role, adjust as needed
      })
    );
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          Register
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Create your account to access Smart LMS
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              {...formRegister("firstName")}
              className={`w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors.firstName ? "border-red-500" : "border-gray-400"
              }`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              {...formRegister("lastName")}
              className={`w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors.lastName ? "border-red-500" : "border-gray-400"
              }`}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              {...formRegister("email")}
              className={`w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors.email ? "border-red-500" : "border-gray-400"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              {...formRegister("password")}
              className={`w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors.password ? "border-red-500" : "border-gray-400"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              {...formRegister("confirmPassword")}
              className={`w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors.confirmPassword ? "border-red-500" : "border-gray-400"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              {...formRegister("termsAccepted")}
              className="mr-2"
            />
            <label className="text-gray-700">
              I accept the terms and conditions
            </label>
          </div>
          {errors.termsAccepted && (
            <p className="text-red-500 text-sm mt-1">
              {errors.termsAccepted.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg text-white font-semibold ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            } transition`}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>

          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Register;
