import { Search, Moon, Sun, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { NotificationBell } from "@/components/shared/NotificationBell";

interface TopBarProps {
  sidebarCollapsed: boolean;
  onToggle: () => void;
}

const TopBar = ({ sidebarCollapsed, onToggle }: TopBarProps) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const initials = user?.username?.substring(0, 2).toUpperCase() ?? "U";

  return (
    <header
      className={cn(
        "fixed top-0 right-0 h-16 bg-card/95 backdrop-blur-md border-b border-border z-30 transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "left-0" : "left-64"
      )}
    >
      <div className="h-full px-6 flex items-center justify-between flex-row-reverse">
        {/* Sidebar Toggle */}
        <button
          onClick={onToggle}
          className="w-10 h-10 flex items-center justify-center rounded-lg
                   bg-card border border-border hover:bg-muted
                   transition-all duration-200 hover:scale-105 active:scale-95"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          )}
        </button>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="w-64 h-10 pl-10 pr-4 bg-muted/50 border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Moon className="w-5 h-5 text-muted-foreground" />
            )}
          </button>

          <NotificationBell target="admin" />

          <div className="h-8 w-px bg-border" />

          {/* User */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full gradient-coral flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">{initials}</span>
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">{user?.username ?? "User"}</p>
              <p className="text-xs text-muted-foreground mt-0.5">System User</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
