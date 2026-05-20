import { supabase } from "@/lib/supabase";
import { SupabaseBaseService } from "./supabase.base";
import { IWarehouse, ICreateWarehouse, IUpdateWarehouse, PaginatedResponse } from "@/shared";

class WarehouseService extends SupabaseBaseService<IWarehouse, ICreateWarehouse, IUpdateWarehouse> {
  constructor() {
    super("warehouse");
  }

  async getAll(): Promise<PaginatedResponse<IWarehouse>> {
    const { data, error, count } = await supabase
      .from("warehouse")
      .select("*, products(count)", { count: "exact" })
      .order("createdAt", { ascending: false });

    if (error) throw { message: error.message };

    const warehouses: IWarehouse[] = (data ?? []).map((row: any) => ({
      id: row.id,
      name: row.name,
      createdAt: row.createdAt,
      productCount: row.products?.[0]?.count ?? 0,
    }));

    return {
      success: true,
      message: "OK",
      data: warehouses,
      meta: { total: count ?? 0, page: 1, limit: count ?? 0, totalPages: 1 },
    };
  }
}

export const warehouseServices = new WarehouseService();
export type { IWarehouse, ICreateWarehouse, IUpdateWarehouse };
