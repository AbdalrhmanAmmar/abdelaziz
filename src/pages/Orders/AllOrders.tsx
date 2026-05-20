import { useState, useMemo, useEffect } from "react";
import {
  ClipboardList,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Loader2,
  Building2,
  Package,
  MessageSquare,
  Filter,
  FileDown,
  FileBarChart2,
  CalendarDays,
  CalendarRange,
  Calendar,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Loading } from "@/components/shared/Loading";
import { orderServices } from "@/api/order";
import type { IOrder, IOrderItem, OrderStatus } from "@/shared";
import { generateOrderPdf } from "@/lib/generateOrderPdf";
import { generateReportPdf } from "@/lib/generateReportPdf";

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; icon: any; bg: string; text: string; border: string }
> = {
  pending:  { label: "Pending",  icon: Clock,        bg: "bg-amber-500/10",    text: "text-amber-600",    border: "border-amber-200" },
  approved: { label: "Approved", icon: CheckCircle2, bg: "bg-emerald-500/10",  text: "text-emerald-600",  border: "border-emerald-200" },
  modified: { label: "Modified", icon: AlertCircle,  bg: "bg-blue-500/10",     text: "text-blue-600",     border: "border-blue-200" },
  rejected: { label: "Rejected", icon: XCircle,      bg: "bg-destructive/10",  text: "text-destructive",  border: "border-destructive/20" },
};

const AllOrders = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Detail dialog state
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [approvedQtys, setApprovedQtys] = useState<Record<string, number>>({});
  const [adminNotes, setAdminNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchOrders = () => {
    setIsLoading(true);
    orderServices
      .getAll()
      .then((res) => setOrders(res.data))
      .catch((err) => {
        console.error("Orders fetch error:", err);
        toast({ title: "Failed to load orders", description: err?.message, variant: "destructive" });
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const openDetail = (order: IOrder) => {
    setSelectedOrder(order);
    const qtys: Record<string, number> = {};
    (order.items ?? []).forEach((item) => {
      qtys[item.id] = item.approvedQuantity ?? item.quantity;
    });
    setApprovedQtys(qtys);
    setAdminNotes(order.adminNotes ?? "");
    setIsDetailOpen(true);
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setSelectedOrder(null);
    setApprovedQtys({});
    setAdminNotes("");
  };

  const handleProcess = async (action: "approve" | "reject") => {
    if (!selectedOrder) return;
    try {
      setIsProcessing(true);
      const itemUpdates = (selectedOrder.items ?? []).map((item) => ({
        id: item.id,
        productId: item.productId,
        approvedQuantity: approvedQtys[item.id] ?? item.quantity,
        requestedQuantity: item.quantity,
      }));
      await orderServices.processOrder(selectedOrder.id, action, itemUpdates, adminNotes.trim() || undefined);
      toast({
        title: action === "approve" ? "Order approved" : "Order rejected",
        description: "Branch has been notified.",
      });
      fetchOrders();
      closeDetail();
    } catch (error: any) {
      toast({ title: "Failed to process order", description: error.message, variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      const matchesSearch = o.branchName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    approved: orders.filter((o) => o.status === "approved" || o.status === "modified").length,
    rejected: orders.filter((o) => o.status === "rejected").length,
  };

  const handleReport = async (period: "daily" | "weekly" | "monthly") => {
    try {
      setIsGeneratingReport(true);
      await generateReportPdf(orders, period);
    } catch {
      toast({ title: "Failed to generate report", variant: "destructive" });
    } finally {
      setIsGeneratingReport(false);
    }
  };

  if (isLoading)
    return (
      <DashboardLayout>
        <Loading text="Loading orders..." />
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ClipboardList className="w-7 h-7 text-primary" />
            Orders
          </h1>
          <p className="text-muted-foreground mt-1">Review and process branch orders</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="gap-2 border-primary/30 text-primary hover:bg-primary/5"
              disabled={isGeneratingReport}
            >
              {isGeneratingReport ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileBarChart2 className="w-4 h-4" />
              )}
              Reports
              <ChevronDown className="w-3.5 h-3.5 ml-1 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs text-muted-foreground">Generate PDF Report</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleReport("daily")} className="gap-2 cursor-pointer">
              <Calendar className="w-4 h-4 text-amber-500" />
              Daily Report
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleReport("weekly")} className="gap-2 cursor-pointer">
              <CalendarDays className="w-4 h-4 text-blue-500" />
              Weekly Report
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleReport("monthly")} className="gap-2 cursor-pointer">
              <CalendarRange className="w-4 h-4 text-emerald-500" />
              Monthly Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total",    value: stats.total,    icon: ClipboardList, color: "bg-primary/10 text-primary",        delay: "0s" },
          { label: "Pending",  value: stats.pending,  icon: Clock,         color: "bg-amber-500/10 text-amber-600",    delay: "0.1s" },
          { label: "Approved", value: stats.approved, icon: CheckCircle2,  color: "bg-emerald-500/10 text-emerald-600", delay: "0.2s" },
          { label: "Rejected", value: stats.rejected, icon: XCircle,       color: "bg-destructive/10 text-destructive", delay: "0.3s" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-card rounded-xl p-4 border shadow-sm flex items-center gap-3 animate-fade-up opacity-0"
              style={{ animationDelay: s.delay, animationFillMode: "forwards" }}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{s.value}</p>
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl p-4 mb-6 shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by branch name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="modified">Modified</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ClipboardList className="w-12 h-12 text-muted-foreground/30 mb-3" />
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {searchQuery || statusFilter !== "all" ? "No orders match" : "No orders yet"}
          </h3>
          <p className="text-muted-foreground text-sm">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "Branch orders will appear here once submitted"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order, index) => {
            const cfg = STATUS_CONFIG[order.status];
            const StatusIcon = cfg.icon;
            const isPending = order.status === "pending";

            return (
              <div
                key={order.id}
                className="bg-card rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 animate-fade-up opacity-0"
                style={{ animationDelay: `${index * 0.04}s`, animationFillMode: "forwards" }}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-semibold text-foreground">{order.branchName}</span>
                          <Badge
                            variant="outline"
                            className={`text-[10px] gap-1 ${cfg.bg} ${cfg.text} ${cfg.border}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {cfg.label}
                          </Badge>
                          {isPending && (
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleString("en-US", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {(order.items ?? []).length} product(s) requested
                        </p>
                        {order.notes && (
                          <p className="text-xs text-muted-foreground mt-1 italic line-clamp-1">
                            "{order.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {(order.status === "approved" || order.status === "modified") && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                          onClick={() => generateOrderPdf(order)}
                          title="Download PDF"
                        >
                          <FileDown className="w-4 h-4" />
                          PDF
                        </Button>
                      )}
                      <Button
                        variant={isPending ? "default" : "outline"}
                        size="sm"
                        className={isPending ? "gradient-coral" : ""}
                        onClick={() => openDetail(order)}
                      >
                        {isPending ? "Review" : "View"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Order Detail Dialog ─────────────────────── */}
      <Dialog open={isDetailOpen} onOpenChange={closeDetail}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" />
              Order Review
              {selectedOrder && (
                <Badge
                  variant="outline"
                  className={`ml-2 text-[11px] gap-1 ${STATUS_CONFIG[selectedOrder.status].bg} ${STATUS_CONFIG[selectedOrder.status].text} ${STATUS_CONFIG[selectedOrder.status].border}`}
                >
                  {selectedOrder.status}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <ScrollArea className="flex-1 overflow-auto">
              <div className="px-6 py-4 space-y-5">
                {/* Order info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-xl">
                  <div>
                    <p className="text-[11px] text-muted-foreground mb-0.5">Branch</p>
                    <p className="font-semibold text-foreground flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-primary" />
                      {selectedOrder.branchName}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground mb-0.5">Submitted</p>
                    <p className="text-sm font-medium">
                      {new Date(selectedOrder.createdAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  {selectedOrder.notes && (
                    <div className="col-span-2">
                      <p className="text-[11px] text-muted-foreground mb-0.5">Branch Notes</p>
                      <p className="text-sm text-foreground bg-card p-2.5 rounded-lg border">
                        {selectedOrder.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Items table */}
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" />
                    Requested Items
                  </h4>
                  <div className="space-y-2">
                    {(selectedOrder.items ?? []).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 bg-muted/20 rounded-xl border"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Package className="w-4 h-4 text-primary" />
                        </div>
                        <span className="flex-1 text-sm font-medium truncate">
                          {item.productName}
                        </span>
                        <div className="flex items-center gap-4 flex-shrink-0">
                          <div className="text-center">
                            <p className="text-[10px] text-muted-foreground">Requested</p>
                            <p className="text-sm font-bold">{item.quantity}</p>
                          </div>
                          {selectedOrder.status === "pending" ? (
                            <div className="text-center">
                              <p className="text-[10px] text-muted-foreground mb-1">Approve qty</p>
                              <input
                                type="number"
                                min={1}
                                max={item.quantity}
                                value={approvedQtys[item.id] ?? item.quantity}
                                onChange={(e) =>
                                  setApprovedQtys((prev) => ({
                                    ...prev,
                                    [item.id]: Math.max(1, Math.min(item.quantity, Number(e.target.value))),
                                  }))
                                }
                                className="w-16 h-8 text-center text-sm font-bold border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                              />
                            </div>
                          ) : (
                            item.approvedQuantity != null && (
                              <div className="text-center">
                                <p className="text-[10px] text-muted-foreground">Approved</p>
                                <p
                                  className={`text-sm font-bold ${
                                    item.approvedQuantity === item.quantity
                                      ? "text-emerald-600"
                                      : "text-blue-600"
                                  }`}
                                >
                                  {item.approvedQuantity}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Admin notes */}
                <div>
                  <Label htmlFor="admin-notes" className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    {selectedOrder.status === "pending" ? "Notes to Branch (optional)" : "Admin Notes"}
                  </Label>
                  {selectedOrder.status === "pending" ? (
                    <Textarea
                      id="admin-notes"
                      placeholder="Add any notes or explanations for the branch..."
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={3}
                      className="resize-none text-sm"
                    />
                  ) : (
                    <div className="p-3 bg-muted/30 rounded-lg text-sm text-foreground border">
                      {selectedOrder.adminNotes ?? <span className="text-muted-foreground italic">No notes</span>}
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          )}

          {selectedOrder?.status === "pending" && (
            <DialogFooter className="px-6 py-4 border-t gap-2 flex-shrink-0">
              <Button
                variant="outline"
                className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/5"
                disabled={isProcessing}
                onClick={() => handleProcess("reject")}
              >
                <X className="w-4 h-4" />
                Reject
              </Button>
              <Button
                className="gap-2 gradient-coral flex-1"
                disabled={isProcessing}
                onClick={() => handleProcess("approve")}
              >
                {isProcessing ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                ) : (
                  <><Check className="w-4 h-4" /> Approve Order</>
                )}
              </Button>
            </DialogFooter>
          )}

          {selectedOrder && (selectedOrder.status === "approved" || selectedOrder.status === "modified") && (
            <DialogFooter className="px-6 py-4 border-t flex-shrink-0">
              <Button
                variant="outline"
                className="gap-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                onClick={() => generateOrderPdf(selectedOrder)}
              >
                <FileDown className="w-4 h-4" />
                Download PDF
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AllOrders;
