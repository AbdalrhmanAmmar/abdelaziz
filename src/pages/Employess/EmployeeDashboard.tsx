import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  TrendingUp,
  FileText,
  DollarSign,
  Calendar,
  Award,
  ShoppingCart,
  Clock,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuthStore } from "@/store/useAuthStore";

// بيانات محاكاة للمبيعات (يفضل لاحقاً جلبها من API)
const recentSales = [
  {
    id: 1,
    customer: "الشركة المصرية للاتصالات (WE)",
    amount: 12500,
    date: "2024-01-15",
    status: "completed",
  },
  { id: 2, customer: "أسواق فتح الله", amount: 8800, date: "2024-01-14", status: "completed" },
  { id: 3, customer: "صيدليات العزبي", amount: 3200, date: "2024-01-14", status: "pending" },
  {
    id: 4,
    customer: "شركة جهينة للصناعات الغذائية",
    amount: 24500,
    date: "2024-01-13",
    status: "completed",
  },
  {
    id: 5,
    customer: "محلات التوحيد والنور",
    amount: 7200,
    date: "2024-01-12",
    status: "completed",
  },
];

const recentInvoices = [
  {
    id: "فاتورة-٠٠١",
    customer: "شركة النساجون الشرقيون",
    amount: 15500,
    date: "2024-01-15",
    status: "paid",
  },
  {
    id: "فاتورة-٠٠٢",
    customer: "مجموعة طلعت مصطفى",
    amount: 48000,
    date: "2024-01-14",
    status: "paid",
  },
  {
    id: "فاتورة-٠٠٣",
    customer: "حلواني العبد",
    amount: 3200,
    date: "2024-01-14",
    status: "pending",
  },
  {
    id: "فاتورة-٠٠٤",
    customer: "شركة غبور أوتو",
    amount: 14500,
    date: "2024-01-13",
    status: "overdue",
  },
];

const EmployeeDashboard = () => {
  const { user } = useAuthStore();

  // بيانات افتراضية للهدف (Target) في حال لم تكن موجودة في بيانات المستخدم
  const targetData = {
    monthlyTarget: 150000,
    currentSales: 95400,
    totalInvoices: 45,
    pendingInvoices: 8,
  };

  const progressPercentage = (targetData.currentSales / targetData.monthlyTarget) * 100;
  const remaining = targetData.monthlyTarget - targetData.currentSales;

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
    > = {
      completed: { label: "مكتمل", variant: "default" },
      pending: { label: "معلق", variant: "secondary" },
      paid: { label: "مدفوع", variant: "default" },
      overdue: { label: "متأخر", variant: "destructive" },
    };
    const config = statusConfig[status] || { label: status, variant: "outline" };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header - استخدام بيانات المستخدم الحقيقية */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground">لوحة تحكم الموظف</h1>
          <p className="text-muted-foreground">
            مرحباً <span className="text-primary font-semibold">{user?.fullName || "الموظف"}</span>{" "}
            - {user?.role === "SALES" ? "مندوب مبيعات" : user?.role} في{" "}
            {user?.branch?.name || "الفرع الرئيسي"}
          </p>
        </div>

        {/* Target Card */}
        <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-primary" />
              متابعة الهدف الشهري (Target)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="text-4xl font-bold text-primary">
                  {targetData.currentSales.toLocaleString("ar-EG")} ج.م
                </p>
                <p className="text-muted-foreground mt-1">
                  إجمالي المبيعات الحالية من أصل {targetData.monthlyTarget.toLocaleString("ar-EG")}{" "}
                  ج.م
                </p>
              </div>
              <div className="text-right md:text-left">
                <p className="text-3xl font-bold text-foreground">
                  {progressPercentage.toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground">نسبة الإنجاز المحققة</p>
              </div>
            </div>

            <div className="space-y-2">
              <Progress value={progressPercentage} className="h-3 bg-primary/20" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  المتبقي لتحقيق الهدف:{" "}
                  <span className="font-bold text-destructive">
                    {remaining.toLocaleString("ar-EG")} ج.م
                  </span>
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  متبقي ١٥ يوم على نهاية الشهر
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {targetData.currentSales.toLocaleString("ar-EG")}
                  </p>
                  <p className="text-sm text-muted-foreground">المبيعات (ج.م)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-green-500/10">
                  <FileText className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{targetData.totalInvoices}</p>
                  <p className="text-sm text-muted-foreground">إجمالي الفواتير</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-500/10">
                  <Clock className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{targetData.pendingInvoices}</p>
                  <p className="text-sm text-muted-foreground">فواتير معلقة</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-purple-500/10">
                  <Award className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{progressPercentage.toFixed(0)}%</p>
                  <p className="text-sm text-muted-foreground">كفاءة الأداء</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-md">
                <ShoppingCart className="h-5 w-5 text-primary" />
                آخر عمليات البيع
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">العميل</TableHead>
                    <TableHead className="text-right">المبلغ</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">{sale.customer}</TableCell>
                      <TableCell>{sale.amount.toLocaleString("ar-EG")} ج.م</TableCell>
                      <TableCell>{getStatusBadge(sale.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-md">
                <FileText className="h-5 w-5 text-primary" />
                الفواتير الأخيرة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">رقم الفاتورة</TableHead>
                    <TableHead className="text-right">المبلغ</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-mono text-sm">{invoice.id}</TableCell>
                      <TableCell>{invoice.amount.toLocaleString("ar-EG")} ج.م</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-md">
              <TrendingUp className="h-5 w-5 text-primary" />
              مؤشر مبيعات الأسبوع الحالي (ج.م)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-end justify-between gap-2 px-4 border-b">
              {[65, 45, 80, 55, 90, 70, 85].map((height, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                  <div
                    className="w-full bg-primary/40 group-hover:bg-primary rounded-t-lg transition-all duration-300 relative"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] p-1 rounded shadow opacity-0 group-hover:opacity-100">
                      {Math.floor(height * 2000)}
                    </div>
                  </div>
                  <span className="text-[10px] md:text-xs text-muted-foreground font-medium pb-2">
                    {["سبت", "أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة"][index]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
