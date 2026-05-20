import { create } from "zustand";
import { INotification } from "@/shared";

interface NotificationState {
  notifications: INotification[];
  setNotifications: (items: INotification[]) => void;
  prepend: (item: INotification) => void;
  markAllRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  setNotifications: (items) => set({ notifications: items }),
  prepend: (item) => set((state) => ({ notifications: [item, ...state.notifications] })),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    })),
}));
