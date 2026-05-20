import { ClipboardList, Building2, ChevronRight, Clock, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { IOrder, OrderStatus } from "@/shared";

const STATUS_CFG: Record<OrderStatus, { label: string; icon: any; cls: string }> = {
  pending:  { label: "Pending",  icon: Clock,        cls: "bg-amber-500/10 text-amber-600" },
  approved: { label: "Approved", icon: CheckCircle2, cls: "bg-emerald-500/10 text-emerald-600" },
  modified: { label: "Modified", icon: AlertCircle,  cls: "bg-blue-500/10 text-blue-600" },
  rejected: { label: "Rejected", icon: XCircle,      cls: "bg-destructive/10 text-destructive" },
};

interface Props {
  orders: IOrder[];
  isLoading?: boolean;
  onViewAll?: () => void;
}

const RecentInvoices = ({ orders, isLoading, onViewAll }: Props) => {
  return (
    <div
      className="bg-card rounded-xl shadow-sm border opacity-0 animate-fade-up"
      style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
    >
      <div className="p-5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-primary" />
          <h3 className="text-base font-semibold text-foreground">Recent Orders</h3>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center gap-1 text-xs text-primary hover:underline font-medium"
          >
            View all <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground gap-2">
          <ClipboardList className="w-10 h-10 opacity-20" />
          <p className="text-sm">No orders yet</p>
        </div>
      ) : (
        <div className="divide-y divide-border/50">
          {orders.map((order) => {
            const cfg = STATUS_CFG[order.status] ?? STATUS_CFG.pending;
            const StatusIcon = cfg.icon;
            return (
              <div
                key={order.id}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/30 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-4 h-4 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{order.branchName}</p>
                  <p className="text-xs text-muted-foreground">
                    {(order.items ?? []).length} item(s) ·{" "}
                    {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                  </p>
                </div>

                <span className={`flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${cfg.cls}`}>
                  <StatusIcon className="w-3 h-3" />
                  {cfg.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentInvoices;
