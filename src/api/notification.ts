import { supabase } from "@/lib/supabase";
import { INotification } from "@/shared";

class NotificationService {
  async getForTarget(target: string): Promise<INotification[]> {
    const { data, error } = await supabase
      .from("notification")
      .select("*")
      .eq("target", target)
      .order("createdAt", { ascending: false })
      .limit(50);

    if (error) throw { message: error.message };
    return (data ?? []) as INotification[];
  }

  async markAllAsRead(target: string): Promise<void> {
    await supabase
      .from("notification")
      .update({ isRead: true })
      .eq("target", target)
      .eq("isRead", false);
  }
}

export const notificationServices = new NotificationService();
