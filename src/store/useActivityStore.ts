// src/store/useActivityStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IActivity } from "@crm/shared";

interface ActivityState {
  activities: IActivity[];
  unreadCount: number;
  setActivities: (activities: IActivity[]) => void;
  addActivity: (activity: IActivity) => void;
  resetUnread: () => void;
}

export const useActivityStore = create<ActivityState>()(
  persist(
    (set) => ({
      activities: [],
      unreadCount: 0,
      setActivities: (activities) => set({ activities }),
      addActivity: (activity) =>
        set((state) => ({
          activities: [activity, ...state.activities].slice(0, 50), // نحتفظ بآخر 50 نشاط فقط
          unreadCount: state.unreadCount + 1,
        })),
      resetUnread: () => set({ unreadCount: 0 }),
    }),
    {
      name: "activity-storage", // اسم المفتاح في localStorage
      partialize: (state) => ({ unreadCount: state.unreadCount }), // نحفظ فقط العداد لو أردت
    }
  )
);
