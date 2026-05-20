import { supabase } from "@/lib/supabase";
import { SupabaseBaseService } from "./supabase.base";
import { ICategory, ICreateCategory, IUpdateCategory, PaginatedResponse } from "@/shared";

class CategoryService extends SupabaseBaseService<ICategory, ICreateCategory, IUpdateCategory> {
  constructor() {
    super("category");
  }

  async getAll(): Promise<PaginatedResponse<ICategory>> {
    const { data, error, count } = await supabase
      .from("category")
      .select("*, products(count)", { count: "exact" })
      .order("createdAt", { ascending: false });

    if (error) throw { message: error.message };

    const categories: ICategory[] = (data ?? []).map((row: any) => ({
      id: row.id,
      name: row.name,
      createdAt: row.createdAt,
      productCount: row.products?.[0]?.count ?? 0,
    }));

    return {
      success: true,
      message: "OK",
      data: categories,
      meta: { total: count ?? 0, page: 1, limit: count ?? 0, totalPages: 1 },
    };
  }
}

export const categoryServices = new CategoryService();
export type { ICategory, ICreateCategory, IUpdateCategory };
