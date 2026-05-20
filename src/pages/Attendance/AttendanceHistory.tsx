import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Calendar as CalendarIcon, 
  Timer,
  Clock,
  CalendarDays,
  History
} from "lucide-react";
import { type IAttendance } from "@crm/shared";

// --- الإعدادات ---
const statusConfig: any = {
  PRESENT: { 
    label: "حاضر", 
    color: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800", 
    icon: CheckCircle2 
  },
  LATE: { 
    label: "متأخر", 
    color: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800", 
    icon: Timer 
  },
  ABSENT: { 
    label: "غائب", 
    color: "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800", 
    icon: XCircle 
  },
  ON_LEAVE: { 
    label: "إجازة", 
    color: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800", 
    icon: CalendarIcon 
  },
};

interface AttendanceDisplayProps {
  data: IAttendance[];
}

export const AttendanceDisplay = ({ data }: AttendanceDisplayProps) => {
  const stats = {
    present: data.filter((d) => d.status === "PRESENT").length,
    late: data.filter((d) => d.status === "LATE").length,
    absent: data.filter((d) => d.status === "ABSENT").length,
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* إحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { 
            label: "أيام الحضور", 
            value: stats.present, 
            color: "emerald", 
            gradient: "from-emerald-500/20 to-emerald-500/5",
            icon: CheckCircle2,
            borderColor: "border-emerald-200/50 dark:border-emerald-800/50"
          },
          { 
            label: "أيام التأخير", 
            value: stats.late, 
            color: "amber", 
            gradient: "from-amber-500/20 to-amber-500/5",
            icon: AlertCircle,
            borderColor: "border-amber-200/50 dark:border-amber-800/50"
          },
          { 
            label: "أيام الغياب", 
            value: stats.absent, 
            color: "rose", 
            gradient: "from-rose-500/20 to-rose-500/5",
            icon: XCircle,
            borderColor: "border-rose-200/50 dark:border-rose-800/50"
          },
        ].map((stat, i) => (
          <Card key={i} className={`border ${stat.borderColor} shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative group`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-50 group-hover:opacity-70 transition-opacity`} />
            <CardContent className="p-6 flex items-center justify-between relative z-10">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-4xl font-bold tabular-nums tracking-tight">{stat.value}</p>
              </div>
              <div className={`w-14 h-14 rounded-2xl bg-background/50 backdrop-blur-sm border ${stat.borderColor} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`h-7 w-7 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* جدول السجل */}
      <Card className="border-border/50 shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-xl">
                <History className="h-5 w-5 text-primary" />
                سجل الحضور والانصراف
              </CardTitle>
              <CardDescription>
                عرض تفصيلي لجميع حركات الحضور والانصراف الخاصة بك
              </CardDescription>
            </div>
            <Badge variant="outline" className="px-3 py-1 bg-background/50 backdrop-blur-sm border-primary/20 text-primary gap-2">
              <CalendarDays className="h-3.5 w-3.5" />
              آخر 30 يوم
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/60">
                  <TableHead className="text-right py-4 px-6 font-semibold text-muted-foreground w-[20%]">التاريخ</TableHead>
                  <TableHead className="text-right py-4 px-6 font-semibold text-muted-foreground w-[25%]">وقت الحضور</TableHead>
                  <TableHead className="text-right py-4 px-6 font-semibold text-muted-foreground w-[25%]">وقت الانصراف</TableHead>
                  <TableHead className="text-right py-4 px-6 font-semibold text-muted-foreground w-[15%]">مدة العمل</TableHead>
                  <TableHead className="text-right py-4 px-6 font-semibold text-muted-foreground w-[15%]">الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                          <History className="h-8 w-8 opacity-50" />
                        </div>
                        <p className="text-lg font-medium">لا يوجد سجلات حتى الآن</p>
                        <p className="text-sm opacity-70">ستظهر سجلات الحضور الخاصة بك هنا</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((record, index) => {
                    const statusInfo = statusConfig[record.status] || statusConfig.PRESENT;
                    const StatusIcon = statusInfo.icon;
                    
                    // حساب مدة العمل
                    let duration = "-";
                    if (record.checkIn && record.checkOut) {
                        const start = new Date(record.checkIn).getTime();
                        const end = new Date(record.checkOut).getTime();
                        const diff = end - start;
                        const hours = Math.floor(diff / (1000 * 60 * 60));
                        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                        duration = `${hours} س ${minutes} د`;
                    }

                    return (
                      <TableRow 
                        key={record.id} 
                        className="group hover:bg-muted/30 transition-colors border-b border-border/40 last:border-0"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <TableCell className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground">
                                {new Date(record.date).toLocaleDateString("ar-EG", { weekday: 'long' })}
                            </span>
                            <span className="text-xs text-muted-foreground font-mono">
                                {new Date(record.date).toLocaleDateString("ar-EG")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                            {record.checkIn ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                        <Clock className="h-4 w-4 text-emerald-600" />
                                    </div>
                                    <span className="font-mono font-medium text-emerald-700 dark:text-emerald-400">
                                        {new Date(record.checkIn).toLocaleTimeString("ar-EG", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: false
                                        })}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-muted-foreground/50 text-sm italic">--:--</span>
                            )}
                        </TableCell>
                        <TableCell className="py-4 px-6">
                            {record.checkOut ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                                        <Clock className="h-4 w-4 text-rose-600" />
                                    </div>
                                    <span className="font-mono font-medium text-rose-700 dark:text-rose-400">
                                        {new Date(record.checkOut).toLocaleTimeString("ar-EG", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: false
                                        })}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-muted-foreground/50 text-sm italic">--:--</span>
                            )}
                        </TableCell>
                        <TableCell className="py-4 px-6">
                            <span className="font-mono text-sm font-medium opacity-80">{duration}</span>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <Badge 
                            variant="outline" 
                            className={`${statusInfo.color} border px-3 py-1 gap-1.5 transition-all group-hover:scale-105`}
                          >
                            <StatusIcon className="h-3.5 w-3.5" />
                            {statusInfo.label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
