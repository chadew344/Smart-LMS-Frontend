import { useNavigate } from "react-router-dom";
import {
  User,
  RefreshCw,
  StarHalf,
  Settings,
  CreditCard,
  HelpCircle,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { UserAvatar } from "../common/UserAvatar";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { USER_ROLES, type UserRole } from "../../types";
import {
  logout,
  setActiveRole,
  upgradeToInstructor,
} from "../../store/slices/authSlice";
import { toast } from "sonner";
import { toTitleCase } from "../../lib/string";
import { useState } from "react";

interface ProfileDropdownProps {
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export const ProfileDropdown = ({
  name,
  email,
  role,
  avatar,
}: ProfileDropdownProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const { user, activeRole } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleUpgration = () => {
    if (!user?.roles.includes(USER_ROLES.INSTRUCTOR)) {
      dispatch(upgradeToInstructor());
      toast.success(
        "Your account has been successfully upgraded to instructor"
      );
      setUpgradeDialogOpen(false);
    }
  };

  const canSwitchRole =
    !user?.roles.includes(USER_ROLES.ADMIN) &&
    user?.roles.includes(USER_ROLES.INSTRUCTOR);

  const targetRole =
    activeRole === USER_ROLES.STUDENT
      ? USER_ROLES.INSTRUCTOR
      : USER_ROLES.STUDENT;

  const isStudent = activeRole === USER_ROLES.STUDENT;

  const menuLabel = isStudent ? "Instructor Dashboard" : "Student Dashboard";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-3 pl-2 ml-2 border-l border-border hover:opacity-80 transition-opacity cursor-pointer focus:outline-none">
            <UserAvatar name={name} image={avatar} />
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-foreground">
                {toTitleCase(name)}
              </p>
              <p className="text-xs text-muted-foreground capitalize">{role}</p>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 bg-popover border border-border shadow-lg z-50"
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-foreground">{name}</p>
              <p className="text-xs text-muted-foreground">{email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer"
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          {canSwitchRole ? (
            <DropdownMenuItem
              onClick={() => {
                dispatch(setActiveRole(targetRole));
                navigate("/dashboard");
              }}
              className="cursor-pointer"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              <span>{menuLabel}</span>
            </DropdownMenuItem>
          ) : (
            isStudent && (
              <DropdownMenuItem
                onClick={() => setUpgradeDialogOpen(true)}
                className="cursor-pointer"
              >
                <StarHalf className="mr-2 h-4 w-4 text-yellow-500 dark:text-yellow-400 stroke-3" />
                <span className="text-yellow-800 dark:text-red-200">
                  Become an Instructor
                </span>
              </DropdownMenuItem>
            )
          )}
          <DropdownMenuItem
            onClick={() => navigate("/settings")}
            className="cursor-pointer"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => navigate("/billing")}
            className="cursor-pointer"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => navigate("/help")}
            className="cursor-pointer"
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Help & Support</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Start Your Instructor Journey 🎗️
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are currently registered as a student. By becoming an
              instructor, you'll be able to create and manage courses, share
              your expertise, and teach learners on our platform.
              <br />
              <br />
              Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUpgration}
              className="bg-primary text-accent-foreground hover:bg-accent/90"
            >
              Become an Instructor
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
