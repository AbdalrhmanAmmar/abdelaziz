import { create } from "zustand";

interface FilterState {
  selectedBranchId: string;
  setSelectedBranchId: (id: string) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  selectedBranchId: "all", // القيمة الافتراضية "الكل"
  setSelectedBranchId: (id) => set({ selectedBranchId: id }),
}));
