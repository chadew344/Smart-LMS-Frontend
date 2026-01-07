import { Outlet, Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { ThemeToggle } from "../common/ThemeToggle";
import { Button } from "../ui/button";
import { useAppSelector } from "../../store/hook";
import { NotificationBell } from "../common/NotificationBell";
import { ProfileDropdown } from "../common/ProfileDropdown";
import { mockNotifications } from "../../lib/notification";

const PublicLayout = () => {
  const { user, isAuthenticated, activeRole } = useAppSelector(
    (state) => state.auth
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-foreground">Edumate</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link
                to="/courses"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Courses
              </Link>
              <Link
                to="/about"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
              <Link
                to="/pricing"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              {isAuthenticated && user ? (
                <>
                  <NotificationBell notifications={mockNotifications} />
                  <ProfileDropdown
                    name={`${user.firstName} ${user.lastName}`}
                    email={user.email}
                    role={activeRole}
                    // avatar={}
                  />
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="sm">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                <GraduationCap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">Edumate</span>
            </div>

            <p className="text-sm text-muted-foreground">
              © 2025 Edumate. All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              <Link
                to="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms
              </Link>
              <Link
                to="/contact"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
