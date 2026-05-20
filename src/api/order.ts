import { supabase } from "@/lib/supabase";
import { IOrder, ICreateOrder, ApiResponse, PaginatedResponse } from "@/shared";

class OrderService {
  async create(input: ICreateOrder): Promise<ApiResponse<IOrder>> {
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        branchId: input.branchId,
        branchName: input.branchName,
        notes: input.notes ?? null,
        status: "pending",
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (orderError) throw { message: orderError.message };

    const itemRows = input.items.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(itemRows);
    if (itemsError) throw { message: itemsError.message };

    await supabase.from("notification").insert({
      target: "admin",
      message: `New order from ${input.branchName} — ${input.items.length} item(s)`,
      orderId: order.id,
      isRead: false,
    });

    return { success: true, message: "Order submitted successfully", data: order as IOrder };
  }

  async getAll(): Promise<PaginatedResponse<IOrder>> {
    const { data, error, count } = await supabase
      .from("orders")
      .select("*, order_items(*)", { count: "exact" })
      .order("createdAt", { ascending: false });

    if (error) throw { message: error.message };

    const orders = (data ?? []).map((row: any) => ({
      ...row,
      items: row.order_items ?? [],
    })) as IOrder[];

    return {
      success: true,
      message: "OK",
      data: orders,
      meta: { total: count ?? 0, page: 1, limit: count ?? 0, totalPages: 1 },
    };
  }

  async getByBranch(branchId: string): Promise<PaginatedResponse<IOrder>> {
    const { data, error, count } = await supabase
      .from("orders")
      .select("*, order_items(*)", { count: "exact" })
      .eq("branchId", branchId)
      .order("createdAt", { ascending: false });

    if (error) throw { message: error.message };

    const orders = (data ?? []).map((row: any) => ({
      ...row,
      items: row.order_items ?? [],
    })) as IOrder[];

    return {
      success: true,
      message: "OK",
      data: orders,
      meta: { total: count ?? 0, page: 1, limit: count ?? 0, totalPages: 1 },
    };
  }

  async processOrder(
    orderId: string,
    action: "approve" | "reject",
    itemUpdates: { id: string; productId: string; approvedQuantity: number; requestedQuantity: number }[],
    adminNotes?: string
  ): Promise<ApiResponse<IOrder>> {
    let status: string;
    if (action === "reject") {
      status = "rejected";
    } else {
      const hasChanges = itemUpdates.some((u) => u.approvedQuantity !== u.requestedQuantity);
      status = hasChanges ? "modified" : "approved";
    }

    const { data: order, error } = await supabase
      .from("orders")
      .update({ status, adminNotes: adminNotes ?? null, updatedAt: new Date().toISOString() })
      .eq("id", orderId)
      .select()
      .single();

    if (error) throw { message: error.message };

    if (action === "approve") {
      for (const item of itemUpdates) {
        // Save approved quantity on the order item
        await supabase
          .from("order_items")
          .update({ approvedQuantity: item.approvedQuantity })
          .eq("id", item.id);

        // Deduct approved quantity from product stock
        const { data: product } = await supabase
          .from("products")
          .select("quantity")
          .eq("id", item.productId)
          .single();

        if (product) {
          await supabase
            .from("products")
            .update({ quantity: Math.max(0, product.quantity - item.approvedQuantity) })
            .eq("id", item.productId);
        }
      }
    }

    const msgMap: Record<string, string> = {
      approved: "Your order has been approved ✓",
      modified: "Your order has been approved with quantity changes",
      rejected: "Your order has been declined",
    };

    await supabase.from("notification").insert({
      target: (order as any).branchId,
      message: msgMap[status] ?? "Your order status has been updated",
      orderId: orderId,
      isRead: false,
    });

    return { success: true, message: "Order processed", data: order as IOrder };
  }
}

export const orderServices = new OrderService();
