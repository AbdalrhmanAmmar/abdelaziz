import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { type IAttendance } from "@crm/shared";
import { useAuthStore } from "@/store/useAuthStore";
import { attendanceServices } from "@/api/attendance";
import { AttendanceActions } from "./AttendanceActions";
import { AttendanceDisplay } from "./AttendanceHistory";

// --- المكون الرئيسي ---
const Attendance = () => {
  const { user } = useAuthStore();
  const [attendanceData, setAttendanceData] = useState<IAttendance[]>([]);
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const [todayRecordId, setTodayRecordId] = useState<string | null>(null);

  const fetchAttendance = useCallback(async () => {
    if (!user?.id) {
        console.log("No user ID, skipping fetch");
        return;
    }
    console.log("Fetching attendance for user:", user.id);
    try {
      const response = await attendanceServices.getMyHistory();
      console.log("Attendance history fetched:", response);
      const history = response.data as IAttendance[];
      setAttendanceData(history);

      const today = new Date().toISOString().split("T")[0];
      const todayRecord = history.find(
        (r) => new Date(r.date).toISOString().split("T")[0] === today
      );

      if (todayRecord) {
        console.log("Today's record found:", todayRecord);
        setTodayRecordId(todayRecord.id);
        setCheckInTime(
          todayRecord.checkIn
            ? new Date(todayRecord.checkIn).toLocaleTimeString("ar-EG", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            : null
        );
        setCheckOutTime(
          todayRecord.checkOut
            ? new Date(todayRecord.checkOut).toLocaleTimeString("ar-EG", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            : null
        );
        setCheckedIn(!!todayRecord.checkIn);
      } else {
        console.log("No record for today");
        setCheckedIn(false);
        setCheckInTime(null);
        setCheckOutTime(null);
        setTodayRecordId(null);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">نظام الحضور الذكي</h1>
            <p className="text-muted-foreground">
              {new Date().toLocaleDateString("ar-EG", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <AttendanceActions
          getCurrentTime={() =>
            new Date().toLocaleTimeString("ar-EG", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          }
          checkedIn={checkedIn}
          checkInTime={checkInTime}
          checkOutTime={checkOutTime}
          todayRecordId={todayRecordId}
          onSuccess={fetchAttendance}
        />

        <AttendanceDisplay data={attendanceData} />
      </div>
    </DashboardLayout>
  );
};

export default Attendance;
