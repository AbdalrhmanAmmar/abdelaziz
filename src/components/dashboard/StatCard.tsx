import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
  pulse?: boolean;
  delay?: number;
}

const StatCard = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "bg-primary/10 text-primary",
  pulse = false,
  delay = 0,
}: StatCardProps) => {
  return (
    <div
      className="bg-card rounded-xl p-5 border shadow-sm flex items-start justify-between opacity-0 animate-fade-up group hover:shadow-md transition-all duration-200 overflow-hidden relative"
      style={{ animationDelay: `${delay}s`, animationFillMode: "forwards" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground font-medium mb-2">{title}</p>
        <p className="text-3xl font-bold text-foreground">{value}</p>
        {change && (
          <div className="flex items-center gap-1 mt-2">
            <span
              className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full",
                changeType === "positive" && "bg-success/10 text-success",
                changeType === "negative" && "bg-destructive/10 text-destructive",
                changeType === "neutral" && "bg-muted text-muted-foreground"
              )}
            >
              {change}
            </span>
            <span className="text-xs text-muted-foreground">vs last month</span>
          </div>
        )}
      </div>

      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 relative", iconColor)}>
        <Icon className="w-6 h-6" />
        {pulse && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-500">
            <span className="absolute inset-0 rounded-full bg-amber-500 animate-ping opacity-75" />
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
