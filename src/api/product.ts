import { supabase } from "@/lib/supabase";
import { SupabaseBaseService } from "./supabase.base";
import { IProduct, ICreateProduct, IUpdateProduct, PaginatedResponse, ApiResponse } from "@/shared";

class ProductService extends SupabaseBaseService<IProduct, ICreateProduct, IUpdateProduct> {
  constructor() {
    super("products");
  }

  async getAll(): Promise<PaginatedResponse<IProduct>> {
    const { data, error, count } = await supabase
      .from("products")
      .select("*, category(id, name), warehouse(id, name)", { count: "exact" })
      .order("createdAt", { ascending: false });

    if (error) throw { message: error.message };

    return {
      success: true,
      message: "OK",
      data: (data ?? []) as IProduct[],
      meta: { total: count ?? 0, page: 1, limit: count ?? 0, totalPages: 1 },
    };
  }

  async getById(id: string): Promise<ApiResponse<IProduct>> {
    const { data, error } = await supabase
      .from("products")
      .select("*, category(id, name), warehouse(id, name)")
      .eq("id", id)
      .single();

    if (error) throw { message: error.message };
    return { success: true, message: "OK", data: data as IProduct };
  }

  async getOrderHistory(productId: string): Promise<IProductOrderHistory[]> {
    const { data, error } = await supabase
      .from("order_items")
      .select("id, quantity, approvedQuantity, createdAt, orders(id, branchName, status, createdAt)")
      .eq("productId", productId)
      .order("createdAt", { ascending: false });

    if (error) throw { message: error.message };

    return (data ?? []).map((row: any) => ({
      id: row.id,
      quantity: row.quantity,
      approvedQuantity: row.approvedQuantity,
      createdAt: row.createdAt,
      order: row.orders,
    }));
  }
}

export interface IProductOrderHistory {
  id: string;
  quantity: number;
  approvedQuantity: number | null;
  createdAt: string | Date;
  order: {
    id: string;
    branchName: string;
    status: string;
    createdAt: string | Date;
  } | null;
}

export const productServices = new ProductService();
export type { IProduct, ICreateProduct, IUpdateProduct };
