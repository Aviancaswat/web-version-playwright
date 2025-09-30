import { create } from "zustand";

//Types
import type { EditTestStore } from "./useEditTestStore.types";

const useEditTestStore = create<EditTestStore>((set) => ({
  editTest: null,
  testIndexToEdit: null,
  setEditTest: (test, index) => set({ editTest: test, testIndexToEdit: index }),
  cleanEditTest: () => set({ editTest: null, testIndexToEdit: null }),
}));

export default useEditTestStore;
