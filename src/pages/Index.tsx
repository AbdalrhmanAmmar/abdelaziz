import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Building2, ClipboardList, Warehouse, Car } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import SalesChart from "@/components/dashboard/SalesChart";
import BranchComparison from "@/components/dashboard/BranchComparison";
import RecentInvoices from "@/components/dashboard/RecentInvoices";
import QuickActions from "@/components/dashboard/QuickActions";
import TopProducts from "@/components/dashboard/TopProducts";

import { useAuthStore } from "@/store/useAuthStore";
import { productServices } from "@/api/product";
import { branchServices } from "@/api/branch";
import { orderServices } from "@/api/order";
import { warehouseServices } from "@/api/warehouse";
import type { IProduct, IOrder } from "@/shared";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
};

const Index = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ products: 0, branches: 0, pending: 0, warehouses: 0 });
  const [trendData, setTrendData] = useState<{ month: string; orders: number }[]>([]);
  const [statusData, setStatusData] = useState<{ label: string; count: number; color: string }[]>([]);
  const [recentOrders, setRecentOrders] = useState<IOrder[]>([]);
  const [lowStock, setLowStock] = useState<IProduct[]>([]);

  useEffect(() => {
    Promise.all([
      productServices.getAll(),
      branchServices.getAll(),
      orderServices.getAll(),
      warehouseServices.getAll(),
    ])
      .then(([prodRes, branchRes, ordersRes, whRes]) => {
        const orders = ordersRes.data;
        const products = prodRes.data;

        setStats({
          products: prodRes.meta.total,
          branches: branchRes.meta.total,
          pending: orders.filter((o) => o.status === "pending").length,
          warehouses: whRes.meta.total,
        });

        setTrendData(
          MONTHS.map((month, i) => ({
            month,
            orders: orders.filter((o) => new Date(o.createdAt).getMonth() === i).length,
          }))
        );

        const total = orders.length || 1;
        setStatusData([
          { label: "Pending",  count: orders.filter((o) => o.status === "pending").length,  color: "bg-amber-500" },
          { label: "Approved", count: orders.filter((o) => o.status === "approved").length, color: "bg-emerald-500" },
          { label: "Modified", count: orders.filter((o) => o.status === "modified").length, color: "bg-blue-500" },
          { label: "Rejected", count: orders.filter((o) => o.status === "rejected").length, color: "bg-destructive" },
        ]);

        setRecentOrders(orders.slice(0, 5));

        setLowStock(
          products
            .filter((p) => p.quantity > 0 && p.quantity < 10)
            .sort((a, b) => a.quantity - b.quantity)
            .slice(0, 5)
        );
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const statCards = [
    {
      title: "Total Products",
      value: isLoading ? "—" : stats.products.toLocaleString(),
      icon: Package,
      iconColor: "bg-primary/10 text-primary",
      delay: 0,
    },
    {
      title: "Active Branches",
      value: isLoading ? "—" : stats.branches.toLocaleString(),
      icon: Building2,
      iconColor: "bg-info/10 text-info",
      delay: 0.1,
    },
    {
      title: "Pending Orders",
      value: isLoading ? "—" : stats.pending.toLocaleString(),
      icon: ClipboardList,
      iconColor: stats.pending > 0 ? "bg-amber-500/10 text-amber-600" : "bg-success/10 text-success",
      pulse: stats.pending > 0,
      delay: 0.2,
    },
    {
      title: "Warehouses",
      value: isLoading ? "—" : stats.warehouses.toLocaleString(),
      icon: Warehouse,
      iconColor: "bg-success/10 text-success",
      delay: 0.3,
    },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-11 h-11 rounded-xl gradient-coral flex items-center justify-center shadow-sm">
          <Car className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {greeting()}, {user?.username ?? "Admin"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Al Abdulghani Motors — Inventory & Branch Management
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((card, i) => (
          <StatCard key={i} {...card} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <SalesChart data={trendData} isLoading={isLoading} />
        </div>
        <div>
          <BranchComparison data={statusData} isLoading={isLoading} />
        </div>
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentInvoices
            orders={recentOrders}
            isLoading={isLoading}
            onViewAll={() => navigate("/orders")}
          />
        </div>
        <div className="space-y-4">
          <QuickActions />
          <TopProducts products={lowStock} isLoading={isLoading} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
