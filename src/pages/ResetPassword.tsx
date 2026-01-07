import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  GraduationCap,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ThemeToggle } from "../components/common/ThemeToggle";
import { cn } from "../lib/utils";

export const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const getPasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "bg-destructive",
    "bg-warning",
    "bg-primary",
    "bg-success",
  ];

  const passwordsMatch =
    password === confirmPassword && confirmPassword.length > 0;
  const isValidPassword = passwordStrength >= 2 && password.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch || !isValidPassword) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsSuccess(true);
  };

  if (!token && !isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldCheck className="h-8 w-8 text-destructive" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Invalid or expired link
            </h2>
            <p className="text-muted-foreground mt-2">
              This password reset link is invalid or has expired. Please request
              a new one.
            </p>
          </div>
          <Button asChild className="w-full">
            <Link to="/forgot-password">Request new link</Link>
          </Button>
        </div>
      </div>
    );
  }

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
            Create New Password
          </h1>
          <p className="text-lg text-white/80 max-w-md">
            Choose a strong, unique password to protect your account and
            learning progress.
          </p>

          <div className="mt-12 space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-white/90 text-sm">✓ At least 8 characters</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-white/90 text-sm">
                ✓ Mix of uppercase and lowercase
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-white/90 text-sm">
                ✓ Include numbers and symbols
              </p>
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
            {!isSuccess ? (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to login
                </Link>

                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      Set new password
                    </h2>
                    <p className="text-muted-foreground mt-2">
                      Your new password must be different from previously used
                      passwords.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="password">New password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10"
                          required
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

                      {password.length > 0 && (
                        <div className="space-y-2 mt-2">
                          <div className="flex gap-1">
                            {[0, 1, 2, 3].map((index) => (
                              <div
                                key={index}
                                className={cn(
                                  "h-1.5 flex-1 rounded-full transition-colors",
                                  index < passwordStrength
                                    ? strengthColors[passwordStrength - 1]
                                    : "bg-border"
                                )}
                              />
                            ))}
                          </div>
                          <p
                            className={cn(
                              "text-xs",
                              passwordStrength <= 1
                                ? "text-destructive"
                                : passwordStrength === 2
                                ? "text-warning"
                                : passwordStrength === 3
                                ? "text-primary"
                                : "text-success"
                            )}
                          >
                            {passwordStrength > 0
                              ? strengthLabels[passwordStrength - 1]
                              : "Too weak"}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirm new password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={cn(
                            "pl-10 pr-10",
                            confirmPassword.length > 0 &&
                              (passwordsMatch
                                ? "border-success"
                                : "border-destructive")
                          )}
                          required
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
                      {confirmPassword.length > 0 && !passwordsMatch && (
                        <p className="text-xs text-destructive">
                          Passwords don't match
                        </p>
                      )}
                      {passwordsMatch && (
                        <p className="text-xs text-success">Passwords match</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={
                        isLoading || !passwordsMatch || !isValidPassword
                      }
                    >
                      {isLoading ? "Resetting..." : "Reset password"}
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="space-y-6 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Password reset successful
                  </h2>
                  <p className="text-muted-foreground mt-2">
                    Your password has been successfully reset. You can now sign
                    in with your new password.
                  </p>
                </div>

                <Button asChild className="w-full">
                  <Link to="/login">Sign in to your account</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
