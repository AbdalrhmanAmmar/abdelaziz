import { Building2, Package, ClipboardList, Warehouse, Tag, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const actions = [
  { icon: Building2,     label: "Branches",    path: "/branches",    color: "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground" },
  { icon: ClipboardList, label: "Orders",      path: "/orders",      color: "bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white" },
  { icon: Package,       label: "Products",    path: "/Allproducts", color: "bg-success/10 text-success hover:bg-success hover:text-primary-foreground" },
  { icon: Warehouse,     label: "Warehouses",  path: "/warehouses",  color: "bg-info/10 text-info hover:bg-info hover:text-primary-foreground" },
];

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-card rounded-xl p-5 shadow-sm border opacity-0 animate-fade-up"
      style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
    >
      <h3 className="text-sm font-semibold text-foreground mb-3">Quick Navigation</h3>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              className={`flex items-center gap-2.5 p-3 rounded-xl transition-all duration-200 text-left text-sm font-medium ${action.color}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {action.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
