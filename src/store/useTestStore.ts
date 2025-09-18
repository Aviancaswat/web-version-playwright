import { create } from "zustand";
import { persist } from "zustand/middleware";

//Types
import type { TestStore } from "./useTestStore.types";

const useTestStore = create<TestStore>()(
  persist(
    (set) => ({
      tests: [],
      addTest: (test) =>
        set((state) => ({
          tests: [...state.tests, test],
        })),
      removeTest: (index) =>
        set((state) => ({
          tests: state.tests.filter((_, i) => i !== index),
        })),
      clearTests: () => set({ tests: [] }),
      isBlocked: false,
      blockForm: () => set({ isBlocked: true }),
      unblockForm: () => set({ isBlocked: false }),
    }),
    {
      name: "test-list",
      storage: {
        getItem: (name) => {
          const value = sessionStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        },
      },
    }
  )
);

export default useTestStore;
