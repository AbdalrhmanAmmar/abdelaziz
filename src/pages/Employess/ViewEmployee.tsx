import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Phone,
  Mail,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  TrendingUp,
  User,
  Clock,
  Activity,
  Shield,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Mock employee data
const employeeData = {
  id: "1",
  name: "أحمد محمد",
  username: "ahmed.m",
  phone: "01012345678",
  salary: 8500,
  branch: "الفرع الرئيسي",
  joinDate: "2023-05-15",
  email: "ahmed@company.com",
  totalSales: 156000,
  invoicesCount: 245,
  status: "نشط",
  department: "المبيعات",
  position: "مندوب مبيعات",
  performance: 92,
  avatarColor: "from-blue-500 to-purple-600",
};

// Mock invoices data
const invoices = [
  { id: "INV-001", date: "2024-01-15", customer: "محمد علي", total: 1250, status: "مكتملة" },
  { id: "INV-002", date: "2024-01-14", customer: "فاطمة أحمد", total: 890, status: "مكتملة" },
  { id: "INV-003", date: "2024-01-14", customer: "عمر حسن", total: 2100, status: "معلقة" },
  { id: "INV-004", date: "2024-01-13", customer: "سارة محمود", total: 560, status: "مكتملة" },
  { id: "INV-005", date: "2024-01-12", customer: "خالد إبراهيم", total: 1800, status: "مكتملة" },
  { id: "INV-006", date: "2024-01-11", customer: "نور الدين", total: 3200, status: "ملغاة" },
];

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "مكتملة":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20";
      case "معلقة":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20";
      case "ملغاة":
        return "bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/employees")}
              className="rounded-xl h-10 w-10 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all"
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">بروفايل الموظف</h1>
              <p className="text-muted-foreground text-sm mt-1">
                تفاصيل الموظف والأداء والإحصائيات
              </p>
            </div>
          </div>

          {/* Edit Button */}
          <Button
            className="gap-2 rounded-xl gradient-primary hover:opacity-90 transition-all shadow-lg shadow-primary/25 h-11 px-6"
            onClick={() => navigate(`/employees/edit/${id}`)}
          >
            <Edit className="h-4 w-4" />
            تعديل البيانات
          </Button>
        </div>

        {/* Profile Card - Updated Design */}
        <Card className="border-0 shadow-2xl overflow-hidden relative bg-gradient-to-br from-background via-background to-primary/5">
          {/* Background Gradient Effect */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full -translate-y-32 translate-x-32" />

          <CardContent className="p-6 md:p-8 relative">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center lg:items-start gap-4">
                <div className="relative">
                  <Avatar className="h-32 w-32 border-4 border-background shadow-2xl">
                    <AvatarFallback
                      className={`bg-gradient-to-br ${employeeData.avatarColor} text-white text-3xl font-bold`}
                    >
                      {employeeData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {/* Status Badge on Avatar */}
                  <div className="absolute -bottom-2 -right-2">
                    <Badge className="bg-emerald-500 text-white px-3 py-1 rounded-full border-2 border-background shadow-lg">
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        {employeeData.status}
                      </div>
                    </Badge>
                  </div>
                </div>

                {/* Performance Score */}
                <div className="text-center lg:text-right">
                  <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-2xl hover:bg-primary/20 transition-colors cursor-pointer">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">نقاط الأداء</span>
                    <span className="text-xl font-bold text-primary">
                      {employeeData.performance}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Info Section */}
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    {employeeData.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <Badge
                      variant="secondary"
                      className="gap-1.5 px-3 py-1 rounded-lg hover:bg-secondary/80 transition-colors"
                    >
                      <Building2 className="h-3.5 w-3.5" />
                      {employeeData.department}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="gap-1.5 px-3 py-1 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Shield className="h-3.5 w-3.5" />
                      {employeeData.position}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="gap-1.5 px-3 py-1 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(employeeData.joinDate).toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Badge>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-muted/30 rounded-xl p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                    <p className="text-2xl font-bold text-primary">{employeeData.invoicesCount}</p>
                    <p className="text-xs text-muted-foreground mt-1">إجمالي الفواتير</p>
                  </div>
                  <div className="bg-muted/30 rounded-xl p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                    <p className="text-2xl font-bold text-emerald-600">
                      {(employeeData.totalSales / 1000).toFixed(0)}K
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">مبيعات</p>
                  </div>
                  <div className="bg-muted/30 rounded-xl p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                    <p className="text-2xl font-bold text-amber-600">
                      {Math.round(
                        employeeData.totalSales / employeeData.invoicesCount
                      ).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">متوسط فاتورة</p>
                  </div>
                  <div className="bg-muted/30 rounded-xl p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                    <p className="text-2xl font-bold text-purple-600">
                      {employeeData.salary.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">الراتب</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm font-medium" dir="ltr">
                      {employeeData.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm font-medium">{employeeData.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <Building2 className="h-4 w-4" />
                    <span className="text-sm font-medium">{employeeData.branch}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-primary/5 to-primary/2">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">اسم المستخدم</p>
                <p className="font-semibold text-foreground">{employeeData.username}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-emerald-500/5 to-emerald-500/2">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Phone className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">رقم الهاتف</p>
                <p className="font-semibold text-foreground" dir="ltr">
                  {employeeData.phone}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-amber-500/5 to-amber-500/2">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">المرتب</p>
                <p className="font-semibold text-foreground">
                  {employeeData.salary.toLocaleString()} ج.م
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-secondary/5 to-secondary/2">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-secondary/30 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">تاريخ الانضمام</p>
                <p className="font-semibold text-foreground">
                  {new Date(employeeData.joinDate).toLocaleDateString("ar-EG")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-primary/10 via-primary/5 to-background">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي المبيعات</p>
                  <p className="text-3xl font-bold text-primary mt-1">
                    {employeeData.totalSales.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">جنيه مصري</p>
                </div>
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-background">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">عدد الفواتير</p>
                  <p className="text-3xl font-bold text-emerald-600 mt-1">
                    {employeeData.invoicesCount}
                  </p>
                  <p className="text-sm text-muted-foreground">فاتورة</p>
                </div>
                <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-background">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">متوسط الفاتورة</p>
                  <p className="text-3xl font-bold text-amber-600 mt-1">
                    {Math.round(
                      employeeData.totalSales / employeeData.invoicesCount
                    ).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">جنيه مصري</p>
                </div>
                <div className="h-16 w-16 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <DollarSign className="h-8 w-8 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invoices Table */}
        <Card className="border-0 shadow-2xl">
          <CardHeader className="border-b border-border/50">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                آخر الفواتير
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
              >
                عرض الكل
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="text-right font-semibold">رقم الفاتورة</TableHead>
                  <TableHead className="text-right font-semibold">التاريخ</TableHead>
                  <TableHead className="text-right font-semibold">العميل</TableHead>
                  <TableHead className="text-right font-semibold">المبلغ</TableHead>
                  <TableHead className="text-right font-semibold">الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice, index) => (
                  <TableRow
                    key={invoice.id}
                    className="hover:bg-muted/30 transition-colors cursor-pointer group"
                  >
                    <TableCell className="font-medium">
                      <span className="text-primary font-semibold group-hover:text-primary/80 transition-colors">
                        {invoice.id}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        {new Date(invoice.date).toLocaleDateString("ar-EG")}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium group-hover:text-foreground/80 transition-colors">
                      {invoice.customer}
                    </TableCell>
                    <TableCell className="font-semibold group-hover:text-primary transition-colors">
                      {invoice.total.toLocaleString()} ج.م
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${getStatusColor(
                          invoice.status
                        )} px-3 py-1 rounded-lg transition-all group-hover:scale-105`}
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeProfile;
