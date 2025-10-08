import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FilterType } from "../components/TableWorkflowComponent/FilterComponent";
import type { DataWorkflows } from "../components/TableWorkflowComponent/TableWorkflowComponent.types";
import type { ResultWorkflow, StatusWorkflow } from "../github/api";

export type FilterGeneric = {
  type: FilterType
  values: string[]
}

type State = {
  statusWorkflow: StatusWorkflow;
  resultWorkflow: ResultWorkflow;
  dataWorkflows: DataWorkflows[];
  selectedFilters: FilterGeneric[]
};

type Actions = {
  setStatusWorkflow: (newStatus: StatusWorkflow) => void;
  setResultWorkflow: (newResult: ResultWorkflow) => void;
  setDataWorkflows: (newData: DataWorkflows[]) => void;
  setSelectedFilters: (newFilter: FilterGeneric[]) => void
};

type Store = State & Actions;

const store = create<Store>()(
  persist(
    (set) => ({
      statusWorkflow: "queued",
      resultWorkflow: "neutral",
      dataWorkflows: [],
      selectedFilters: [],
      setStatusWorkflow: (newState) =>
        set(() => ({ statusWorkflow: newState })),
      setResultWorkflow: (newResult) =>
        set(() => ({ resultWorkflow: newResult })),
      setDataWorkflows: (newData) => set(() => ({ dataWorkflows: newData })),
      setSelectedFilters: (newFilter) => set(() => ({ selectedFilters: newFilter }))
    }),
    {
      name: "test-store"
    }
  )
);

export const useTestStore = () => {
  const {
    statusWorkflow,
    resultWorkflow,
    setStatusWorkflow,
    setResultWorkflow,
    dataWorkflows,
    setDataWorkflows,
    selectedFilters,
    setSelectedFilters
  } = store();
  return {
    statusWorkflow,
    resultWorkflow,
    setStatusWorkflow,
    setResultWorkflow,
    dataWorkflows,
    setDataWorkflows,
    selectedFilters,
    setSelectedFilters
  };
};