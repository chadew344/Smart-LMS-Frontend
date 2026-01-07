import { useState, useEffect } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  BookOpen,
  Shield,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { ThemeToggle } from "../components/common/ThemeToggle";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { login, register } from "../store/slices/authSlice";
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from "../schema/auth.schema";
import { cn } from "../lib/utils";

const roleConfig = {
  student: {
    icon: User,
    label: "Student",
    description: "Access courses, quizzes, and track your progress",
  },
  instructor: {
    icon: BookOpen,
    label: "Instructor",
    description: "Create courses, manage students, and view analytics",
  },
  admin: {
    icon: Shield,
    label: "Admin",
    description: "Manage the entire platform, users, and content",
  },
};

const GoogleIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const location = useLocation();
  const isRegister = location.pathname === "/register";

  const [activeTab, setActiveTab] = useState(isRegister ? "register" : "login");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();

  const { isLoading, isAuthenticated, error } = useAppSelector(
    (state) => state.auth
  );

  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const {
    register: registerRegister,
    handleSubmit: handleSubmitRegister,
    formState: { errors: registerErrors },
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

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectUrl, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectUrl]);

  const onLoginSubmit = (data: LoginInput) => {
    dispatch(login({ email: data.email, password: data.password }));
  };

  const onRegisterSubmit = (data: RegisterInput) => {
    dispatch(
      register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: "student",
      })
    );
  };

  const handleGoogleLogin = () => {
    console.log("Google login with role:");
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex lg:w-1/2 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <span className="font-bold text-2xl text-white">Edumate</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
            Welcome Back to Your Learning Journey
          </h1>
          <p className="text-lg text-white/80 max-w-md">
            Continue where you left off. Access your courses, track your
            progress, and achieve your goals.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
              <p className="text-3xl font-bold text-white">1000+</p>
              <p className="text-white/70 text-sm mt-1">Quality Courses</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
              <p className="text-3xl font-bold text-white">50K+</p>
              <p className="text-white/70 text-sm mt-1">Happy Learners</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4 lg:p-6">
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">Edumate</span>
          </Link>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
          <div className="w-full max-w-md">
            <Tabs
              value={activeTab}
              onValueChange={(value) => {
                setActiveTab(value);
                navigate(value === "register" ? "/register" : "/login", {
                  replace: true,
                });
              }}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-foreground">
                    Sign in to your account
                  </h2>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 gap-3 font-medium"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <GoogleIcon />
                  Continue with Google
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-3 text-muted-foreground">
                      or continue with email
                    </span>
                  </div>
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  {roleConfig["student"].description}
                </p>

                <form
                  onSubmit={handleSubmitLogin(onLoginSubmit)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        {...registerLogin("email")}
                        className={cn(
                          "pl-10",
                          loginErrors.email && "border-red-500"
                        )}
                        autoComplete="email"
                      />
                    </div>
                    {loginErrors.email && (
                      <p className="text-red-500 text-sm">
                        {loginErrors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...registerLogin("password")}
                        className={cn(
                          "pl-10 pr-10",
                          loginErrors.password && "border-red-500"
                        )}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <div className="flex justify-end">
                      <Link
                        to="/forgot-password"
                        className="text-xs text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    {loginErrors.password && (
                      <p className="text-red-500 text-sm">
                        {loginErrors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...registerLogin("rememberMe")}
                      className="mr-2 h-4 w-4"
                      id="rememberMe"
                    />
                    <Label
                      htmlFor="rememberMe"
                      className="text-sm font-normal cursor-pointer"
                    >
                      Remember me
                    </Label>
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                      <p className="text-red-600 dark:text-red-400 text-sm">
                        {error}
                      </p>
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-foreground">
                    Create an account
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    Start your learning journey today
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 gap-3 font-medium"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <GoogleIcon />
                  Sign up with Google
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-3 text-muted-foreground">
                      or continue with email
                    </span>
                  </div>
                </div>

                <form
                  onSubmit={handleSubmitRegister(onRegisterSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        {...registerRegister("firstName")}
                        className={registerErrors.firstName && "border-red-500"}
                        autoComplete="given-name"
                      />
                      {registerErrors.firstName && (
                        <p className="text-red-500 text-xs">
                          {registerErrors.firstName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        {...registerRegister("lastName")}
                        className={registerErrors.lastName && "border-red-500"}
                        autoComplete="family-name"
                      />
                      {registerErrors.lastName && (
                        <p className="text-red-500 text-xs">
                          {registerErrors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="name@example.com"
                        {...registerRegister("email")}
                        className={cn(
                          "pl-10",
                          registerErrors.email && "border-red-500"
                        )}
                        autoComplete="email"
                      />
                    </div>
                    {registerErrors.email && (
                      <p className="text-red-500 text-sm">
                        {registerErrors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        {...registerRegister("password")}
                        className={cn(
                          "pl-10 pr-10",
                          registerErrors.password && "border-red-500"
                        )}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {registerErrors.password && (
                      <p className="text-red-500 text-xs">
                        {registerErrors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        {...registerRegister("confirmPassword")}
                        className={cn(
                          "pl-10 pr-10",
                          registerErrors.confirmPassword && "border-red-500"
                        )}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {registerErrors.confirmPassword && (
                      <p className="text-red-500 text-xs">
                        {registerErrors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      {...registerRegister("termsAccepted")}
                      className="mr-2 h-4 w-4 mt-0.5"
                      id="termsAccepted"
                    />
                    <Label
                      htmlFor="termsAccepted"
                      className="text-xs font-normal cursor-pointer"
                    >
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className="text-primary hover:underline"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy"
                        className="text-primary hover:underline"
                      >
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                  {registerErrors.termsAccepted && (
                    <p className="text-red-500 text-xs">
                      {registerErrors.termsAccepted.message}
                    </p>
                  )}

                  {error && (
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                      <p className="text-red-600 dark:text-red-400 text-sm">
                        {error}
                      </p>
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
