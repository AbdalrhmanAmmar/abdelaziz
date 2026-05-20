import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, LogIn, LogOut, Loader2, StickyNote, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/useAuthStore";
import { attendanceServices } from "@/api/attendance";

interface AttendanceActionsProps {
  getCurrentTime: () => string;
  checkedIn: boolean;
  checkInTime: string | null;
  checkOutTime: string | null;
  todayRecordId: string | null;
  onSuccess: () => Promise<void>;
}

export const AttendanceActions = ({
  getCurrentTime,
  checkedIn,
  checkInTime,
  checkOutTime,
  todayRecordId,
  onSuccess,
}: AttendanceActionsProps) => {
  const { toast } = useToast();
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);

  // Debugging log on render
  console.log("AttendanceActions Rendered", { checkedIn, checkOutTime, loading, user });

  const handleCheckIn = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior
    e.stopPropagation(); // Stop propagation

    console.log("🖱️ Check-in button clicked");
    console.log("👤 User state:", user);

    if (!user?.id) {
      console.error("❌ No user ID found");
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "لم يتم العثور على بيانات المستخدم",
      });
      return;
    }

    setLoading(true);
    try {
      console.log("🔵 Sending check-in request...");

      const response = await attendanceServices.checkIn({
        userId: user.id,
        date: new Date(),
        note: note || "",
      });

      console.log("✅ Check-in response:", response);

      toast({
        title: "تم بنجاح",
        description: response.message || "تم تسجيل الحضور بنجاح",
      });

      setNote("");
      setShowNoteInput(false);

      // تحديث البيانات
      await onSuccess();
    } catch (error: any) {
      console.error("❌ Check-in error:", error);

      toast({
        variant: "destructive",
        title: "فشل التسجيل",
        description: error.response?.data?.message || error.message || "حدث خطأ ما",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("🖱️ Check-out button clicked");
    
    if (!todayRecordId) {
      console.error("❌ No record ID for today");
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "لا يوجد سجل حضور لليوم",
      });
      return;
    }

    setLoading(true);
    try {
      console.log("🔵 Sending check-out request...");

      const response = await attendanceServices.checkOut(todayRecordId, {
        checkOut: new Date(),
      });

      console.log("✅ Check-out response:", response);

      toast({
        title: "تم تسجيل الانصراف",
        description: response.message || "تم تسجيل الانصراف بنجاح",
      });

      await onSuccess();
    } catch (error: any) {
      console.error("❌ Check-out error:", error);

      toast({
        variant: "destructive",
        title: "خطأ",
        description: error.response?.data?.message || error.message || "فشل تسجيل الانصراف",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border/50 shadow-xl overflow-hidden relative z-10 bg-card/50 backdrop-blur-sm transition-all hover:shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
      <CardContent className="p-8 space-y-8 relative z-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* عرض الوقت */}
          <div className="flex items-center gap-6 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-background to-muted border border-border/50 flex items-center justify-center relative shadow-inner">
                <Clock className="h-10 w-10 text-primary animate-pulse" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">الوقت الحالي</p>
              <p className="text-5xl font-bold tabular-nums tracking-tight text-foreground/90 font-mono">
                {getCurrentTime()}
              </p>
            </div>
          </div>

          {/* عرض الأوقات المسجلة اليوم */}
          <div className="flex-1 w-full lg:w-auto">
            <div className="grid grid-cols-2 gap-4 bg-muted/20 p-4 rounded-2xl border border-border/50 backdrop-blur-md">
              <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-background/50 border border-border/30 transition-colors hover:bg-background/80">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <p className="text-xs font-medium text-muted-foreground">وقت الحضور</p>
                </div>
                <p className={`text-xl font-bold font-mono ${checkInTime ? "text-success" : "text-muted-foreground/50"}`}>
                  {checkInTime || "--:--"}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-background/50 border border-border/30 transition-colors hover:bg-background/80">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                  <p className="text-xs font-medium text-muted-foreground">وقت الانصراف</p>
                </div>
                <p className={`text-xl font-bold font-mono ${checkOutTime ? "text-destructive" : "text-muted-foreground/50"}`}>
                  {checkOutTime || "--:--"}
                </p>
              </div>
            </div>
          </div>

          {/* الأزرار */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            {!checkedIn && !checkOutTime && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setShowNoteInput(!showNoteInput)}
                className={`h-16 w-16 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                  showNoteInput 
                    ? "bg-primary/10 text-primary border-primary shadow-[0_0_20px_rgba(var(--primary),0.3)]" 
                    : "hover:border-primary/50 hover:text-primary hover:bg-primary/5"
                }`}
              >
                <StickyNote className="h-6 w-6" />
              </Button>
            )}

            <Button
              type="button"
              onClick={(e) => (checkedIn && !checkOutTime ? handleCheckOut(e) : handleCheckIn(e))}
              disabled={loading || (checkedIn && !!checkOutTime)}
              className={`h-16 px-10 gap-3 rounded-2xl text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 flex-1 lg:flex-none lg:min-w-[200px] ${
                checkedIn && !checkOutTime
                  ? "bg-gradient-to-r from-destructive to-destructive/80 hover:shadow-destructive/30 border-b-4 border-destructive/50"
                  : "bg-gradient-to-r from-success to-success/80 hover:shadow-success/30 border-b-4 border-success/50"
              }`}
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : checkedIn && !checkOutTime ? (
                <LogOut className="h-6 w-6" />
              ) : (
                <LogIn className="h-6 w-6" />
              )}
              {checkedIn && !checkOutTime ? "تسجيل انصراف" : "تسجيل حضور"}
            </Button>
          </div>
        </div>

        {/* حقل الملاحظة */}
        {!checkedIn && showNoteInput && (
          <div className="relative animate-in slide-in-from-top-4 fade-in duration-300">
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <MessageSquare className="h-5 w-5 text-primary/50" />
            </div>
            <Input
              placeholder="هل لديك أي ملاحظات لإضافتها مع تسجيل الحضور؟"
              className="pr-12 h-14 bg-muted/30 border-border/50 rounded-xl text-lg focus-visible:ring-primary/20 transition-all focus-visible:bg-background shadow-inner"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              autoFocus
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
