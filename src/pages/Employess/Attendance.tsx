import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Clock,
  LogIn,
  LogOut,
  Calendar,
  Timer,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock attendance data
const mockAttendanceData = [
  {
    id: 1,
    date: "2024-01-15",
    dayName: "الإثنين",
    checkIn: "08:55",
    checkOut: "17:05",
    totalHours: "8:10",
    status: "present",
  },
  {
    id: 2,
    date: "2024-01-14",
    dayName: "الأحد",
    checkIn: "09:15",
    checkOut: "17:30",
    totalHours: "8:15",
    status: "late",
  },
  {
    id: 3,
    date: "2024-01-13",
    dayName: "السبت",
    checkIn: null,
    checkOut: null,
    totalHours: "-",
    status: "absent",
  },
  {
    id: 4,
    date: "2024-01-12",
    dayName: "الجمعة",
    checkIn: null,
    checkOut: null,
    totalHours: "-",
    status: "holiday",
  },
  {
    id: 5,
    date: "2024-01-11",
    dayName: "الخميس",
    checkIn: "08:45",
    checkOut: "17:00",
    totalHours: "8:15",
    status: "present",
  },
  {
    id: 6,
    date: "2024-01-10",
    dayName: "الأربعاء",
    checkIn: "08:50",
    checkOut: "17:10",
    totalHours: "8:20",
    status: "present",
  },
  {
    id: 7,
    date: "2024-01-09",
    dayName: "الثلاثاء",
    checkIn: "09:30",
    checkOut: "17:00",
    totalHours: "7:30",
    status: "late",
  },
];

const statusConfig = {
  present: { label: "حاضر", color: "bg-success/10 text-success", icon: CheckCircle2 },
  late: { label: "متأخر", color: "bg-warning/10 text-warning", icon: AlertCircle },
  absent: { label: "غائب", color: "bg-destructive/10 text-destructive", icon: XCircle },
  holiday: { label: "إجازة", color: "bg-muted text-muted-foreground", icon: Calendar },
};

const Attendance = () => {
  const { toast } = useToast();
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString("ar-EG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleCheckIn = () => {
    const time = getCurrentTime();
    setCheckInTime(time);
    setCheckedIn(true);
    toast({
      title: "تم تسجيل الحضور",
      description: `تم تسجيل حضورك في الساعة ${time}`,
    });
  };

  const handleCheckOut = () => {
    const time = getCurrentTime();
    setCheckOutTime(time);
    toast({
      title: "تم تسجيل الانصراف",
      description: `تم تسجيل انصرافك في الساعة ${time}`,
    });
  };

  // Stats
  const presentDays = mockAttendanceData.filter((d) => d.status === "present").length;
  const lateDays = mockAttendanceData.filter((d) => d.status === "late").length;
  const absentDays = mockAttendanceData.filter((d) => d.status === "absent").length;

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">الحضور والانصراف</h1>
            <p className="text-muted-foreground mt-1">{getCurrentDate()}</p>
          </div>
        </div>

        {/* Check In/Out Card */}
        <Card className="border-border/50 shadow-lg overflow-hidden">
          <div className="h-2 bg-gradient-to-l from-primary via-primary/80 to-primary/60" />
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Current Time Display */}
              <div className="text-center md:text-right">
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">الوقت الحالي</p>
                    <p className="text-3xl font-bold text-foreground">{getCurrentTime()}</p>
                  </div>
                </div>
              </div>

              {/* Today's Status */}
              <div className="flex items-center gap-6 text-center">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">وقت الحضور</p>
                  <p className="text-lg font-semibold text-foreground">{checkInTime || "--:--"}</p>
                </div>
                <div className="h-10 w-px bg-border" />
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">وقت الانصراف</p>
                  <p className="text-lg font-semibold text-foreground">{checkOutTime || "--:--"}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleCheckIn}
                  disabled={checkedIn}
                  className="h-14 px-8 gap-2 bg-success hover:bg-success/90 text-white"
                >
                  <LogIn className="h-5 w-5" />
                  تسجيل حضور
                </Button>
                <Button
                  onClick={handleCheckOut}
                  disabled={!checkedIn || checkOutTime !== null}
                  variant="outline"
                  className="h-14 px-8 gap-2 border-destructive/50 text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-5 w-5" />
                  تسجيل انصراف
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{presentDays}</p>
                <p className="text-sm text-muted-foreground">أيام الحضور</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{lateDays}</p>
                <p className="text-sm text-muted-foreground">أيام التأخير</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{absentDays}</p>
                <p className="text-sm text-muted-foreground">أيام الغياب</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Table */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-5 w-5 text-primary" />
                سجل الحضور والانصراف
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                آخر 7 أيام
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="text-right font-semibold">التاريخ</TableHead>
                    <TableHead className="text-right font-semibold">اليوم</TableHead>
                    <TableHead className="text-right font-semibold">وقت الحضور</TableHead>
                    <TableHead className="text-right font-semibold">وقت الانصراف</TableHead>
                    <TableHead className="text-right font-semibold">ساعات العمل</TableHead>
                    <TableHead className="text-right font-semibold">الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAttendanceData.map((record) => {
                    const statusInfo = statusConfig[record.status as keyof typeof statusConfig];
                    const StatusIcon = statusInfo.icon;
                    return (
                      <TableRow key={record.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{record.date}</TableCell>
                        <TableCell>{record.dayName}</TableCell>
                        <TableCell>
                          {record.checkIn ? (
                            <span className="font-mono">{record.checkIn}</span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {record.checkOut ? (
                            <span className="font-mono">{record.checkOut}</span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="font-mono">{record.totalHours}</span>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${statusInfo.color} gap-1`}>
                            <StatusIcon className="h-3 w-3" />
                            {statusInfo.label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Attendance;
