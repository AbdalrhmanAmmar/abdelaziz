import client from "./api";
import { ApiResponse, PaginatedResponse } from "@crm/shared";
import { saveAs } from "file-saver";

export class BaseService<T, CreateInput = any, UpdateInput = any> {
  constructor(protected readonly endpoint: string) {}

  /**
   * دالة داخلية لتنظيف الفلاتر المرسلة للسيرفر
   * تقوم بحذف القيم التي تساوي "all" أو النصوص الفارغة
   */
  private cleanParams(params?: any) {
    if (!params) return params;

    const clean = { ...params };
    Object.keys(clean).forEach((key) => {
      const value = clean[key];
      if (value === "all" || value === "" || value === undefined || value === null) {
        delete clean[key];
      }
    });
    return clean;
  }

  // جلب الكل مع تنظيف الفلاتر تلقائياً
  async getAll(params?: any): Promise<PaginatedResponse<T>> {
    const cleanParams = this.cleanParams(params);
    const response = await client.get<PaginatedResponse<T>>(this.endpoint, {
      params: cleanParams,
    });
    return response.data;
  }

  // جلب عنصر واحد بالـ ID
  async getById(id: string): Promise<ApiResponse<T>> {
    const response = await client.get<ApiResponse<T>>(`${this.endpoint}/${id}`);
    return response.data;
  }

  async create(data: CreateInput): Promise<ApiResponse<T>> {
    const response = await client.post<ApiResponse<T>>(this.endpoint, data);
    return response.data;
  }

  async update(id: string, data: UpdateInput): Promise<ApiResponse<T>> {
    const response = await client.patch<ApiResponse<T>>(`${this.endpoint}/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await client.delete<ApiResponse<void>>(`${this.endpoint}/${id}`);
    return response.data;
  }

  async exportToExcel(params?: any, fileName: string = "export"): Promise<void> {
    const cleanParams = this.cleanParams(params);

    const response = await client.get(`${this.endpoint}/export/excel`, {
      params: cleanParams,
      responseType: "blob",
    });

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `${fileName}-${new Date().getTime()}.xlsx`);
  }
}
