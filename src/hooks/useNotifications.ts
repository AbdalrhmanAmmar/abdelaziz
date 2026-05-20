import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useNotificationStore } from "@/store/useNotificationStore";
import { notificationServices } from "@/api/notification";
import { INotification } from "@/shared";

export const useNotifications = (target: string) => {
  const { notifications, setNotifications, prepend, markAllRead } = useNotificationStore();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    if (!target) return;

    notificationServices.getForTarget(target).then(setNotifications).catch(console.error);

    const channel = supabase
      .channel(`notif-${target}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notification", filter: `target=eq.${target}` },
        (payload) => prepend(payload.new as INotification)
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [target]);

  const handleMarkAllRead = async () => {
    markAllRead();
    await notificationServices.markAllAsRead(target).catch(console.error);
  };

  return { notifications, unreadCount, handleMarkAllRead };
};
