// client/src/services/attendance.service.ts

import { type IAttendance, CreateAttendanceInput, UpdateAttendanceInput } from "@crm/shared";
import { BaseService } from "./base.service";
import client from "./api";

// سنمرر الـ Attendance كـ DataType، والـ Create كـ CreateInput
class AttendanceServiceClass extends BaseService<
  IAttendance,
  CreateAttendanceInput,
  UpdateAttendanceInput
> {
  constructor() {
    super("/attendance");
  }

  /**
   * تسجيل حضور جديد
   */
  async checkIn(data: CreateAttendanceInput) {
    const response = await client.post(`${this.endpoint}/check-in`, data);
    return response.data;
  }

  /**
   * تسجيل انصراف (تحديث سجل اليوم)
   * نستخدم PATCH لأننا نعدل حقل checkOut فقط
   */
  async checkOut(id: string, data: UpdateAttendanceInput) {
    const response = await client.patch(`${this.endpoint}/check-out/${id}`, data);
    return response.data;
  }

  /**
   * جلب سجلات الموظف الحالي
   */
  async getMyHistory() {
    const response = await client.get(`${this.endpoint}/my-history`);
    return response.data;
  }
}

export const attendanceServices = new AttendanceServiceClass();
