import { useState, useMemo } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { GraduationCap, LogOut, Menu, ChevronLeft } from "lucide-react";
import { Button } from "../ui/button";
import { ThemeToggle } from "../common/ThemeToggle";
import { NotificationBell } from "../common/NotificationBell";
import { SearchInput } from "../common/SearchInput";
import { cn } from "../../lib/utils";
import { logout } from "../../store/slices/authSlice";
import { getNavigationForUser } from "../../lib/navigation";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { ProfileDropdown } from "../common/ProfileDropdown";
import { mockNotifications } from "../../lib/notification";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, activeRole } = useAppSelector((state) => state.auth);

  const navigationSections = useMemo(() => {
    if (!user) return [];
    return getNavigationForUser(activeRole);
  }, [user, activeRole]);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const NavContent = () => (
    <>
      <div className="p-4 border-b border-border">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          {sidebarOpen && (
            <span className="font-bold text-lg text-foreground">Edumate</span>
          )}
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-6 ">
        {navigationSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-1">
            {section.title && sidebarOpen && (
              <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {section.title}
              </h3>
            )}
            {section.items.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {sidebarOpen ? (
                    <span className="flex items-center justify-between flex-1">
                      {item.label}
                      {item.badge && (
                        <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </span>
                  ) : (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary w-full transition-colors group relative"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {sidebarOpen ? (
            <span>Logout</span>
          ) : (
            <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
              Logout
            </div>
          )}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background flex">
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-card border-r border-border transition-all duration-300 fixed h-screen z-30",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <NavContent />
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-card shadow-sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <ChevronLeft
            className={cn(
              "h-3 w-3 transition-transform",
              !sidebarOpen && "rotate-180"
            )}
          />
        </Button>
      </aside>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 w-64 bg-card border-r border-border z-50 transform transition-transform duration-300 lg:hidden flex flex-col",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <NavContent />
      </aside>

      <div
        className={cn(
          "flex-1 flex flex-col",
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        )}
      >
        <header className="sticky top-0 z-20 bg-card/80 backdrop-blur-xl border-b border-border">
          <div className="flex items-center justify-between px-4 lg:px-6 h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search courses, quizzes..."
                className="hidden sm:block w-64 lg:w-80"
              />
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <NotificationBell notifications={mockNotifications} />
              <ProfileDropdown
                name={`${user.firstName} ${user.lastName}`}
                email={user.email}
                role={activeRole}
                // avatar={}
              />
              {/* <div className="flex items-center gap-3 pl-2 ml-2 border-l border-border">
                <UserAvatar name={user.firstName} image={undefined} />
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-foreground">
                    {user.firstName}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {Array.isArray(user.roles)
                      ? user.roles.join(", ")
                      : user.roles}
                  </p>
                </div>
              </div> */}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
