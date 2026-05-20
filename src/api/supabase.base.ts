import { supabase } from "@/lib/supabase";
import { ApiResponse, PaginatedResponse } from "@/shared";

export class SupabaseBaseService<T, CreateInput = Partial<T>, UpdateInput = Partial<T>> {
  constructor(protected readonly table: string) {}

  async getAll(): Promise<PaginatedResponse<T>> {
    const { data, error, count } = await supabase
      .from(this.table)
      .select("*", { count: "exact" })
      .order("createdAt", { ascending: false });

    if (error) throw { message: error.message };

    return {
      success: true,
      message: "OK",
      data: (data ?? []) as T[],
      meta: {
        total: count ?? 0,
        page: 1,
        limit: count ?? 0,
        totalPages: 1,
      },
    };
  }

  async getById(id: string): Promise<ApiResponse<T>> {
    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw { message: error.message };
    return { success: true, message: "OK", data: data as T };
  }

  async create(input: CreateInput): Promise<ApiResponse<T>> {
    const { data, error } = await supabase
      .from(this.table)
      .insert(input as any)
      .select()
      .single();

    if (error) throw { message: error.message };
    return { success: true, message: "Created successfully", data: data as T };
  }

  async update(id: string, input: UpdateInput): Promise<ApiResponse<T>> {
    const { data, error } = await supabase
      .from(this.table)
      .update(input as any)
      .eq("id", id)
      .select()
      .single();

    if (error) throw { message: error.message };
    return { success: true, message: "Updated successfully", data: data as T };
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    const { error } = await supabase.from(this.table).delete().eq("id", id);

    if (error) throw { message: error.message };
    return { success: true, message: "Deleted successfully", data: undefined as void };
  }
}
