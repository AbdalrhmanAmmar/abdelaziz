import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Package, User, Warehouse, Tag, Building2, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard",   path: "/" },
  { icon: Users,           label: "Users",        path: "/employees" },
  { icon: Building2,       label: "Branches",     path: "/branches" },
  { icon: ClipboardList,   label: "Orders",       path: "/orders" },
  { icon: Warehouse,       label: "Warehouses",   path: "/warehouses" },
  { icon: Tag,             label: "Categories",   path: "/categories" },
  { icon: Package,         label: "Products",     path: "/Allproducts" },
  { icon: User,            label: "Profile",      path: "/profile" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ collapsed }: SidebarProps) => {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border z-40",
        "w-64 transform transition-all duration-300 ease-in-out",
        collapsed ? "-translate-x-full" : "translate-x-0"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-sidebar-border px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-coral flex items-center justify-center overflow-hidden">
            <img src="./favicon.ico" alt="logo" className="w-full h-full object-cover" />
          </div>
          {!collapsed && (
            <span className="font-bold text-lg text-foreground tracking-tight">Al Abdulghani</span>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <nav className="p-4 space-y-1">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "sidebar-item flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground",
                collapsed && "justify-center px-3"
              )}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
