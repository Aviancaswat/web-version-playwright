import { create } from "zustand";

//Types
import type { LoadingStore } from "./useLoadingStore.types";

const useLoadingStore = create<LoadingStore>((set) => ({
  showLoading: false,
  setShowLoading: (value: boolean) => set({ showLoading: value }),
}));

export default useLoadingStore;
