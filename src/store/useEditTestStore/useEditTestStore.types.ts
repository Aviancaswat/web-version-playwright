import type { Test } from "../useTestStore/useTestStore.types";

export interface EditTestStore {
  editTest: Test | null;
  testIndexToEdit: number | null;
  setEditTest: (test: Test, index: number) => void;
  cleanEditTest: () => void;
}
