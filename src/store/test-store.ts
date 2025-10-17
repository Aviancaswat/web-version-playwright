import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FilterType } from "../components/TableWorkflowComponent/FilterComponent";
import type { DataWorkflows } from "../components/TableWorkflowComponent/TableWorkflowComponent.types";
import type { ResultWorkflow, StatusWorkflow } from "../github/api";

export type FilterGeneric = {
  type: FilterType
  values: string[]
}

export type JSONDashboardAgentAvianca = {
  users: string[]
  workflowsData: DataWorkflows[]
  recent_failures: DataWorkflows[]
  top_users: string[]
  summary: {
    total_workflows: number,
    total_passed: number,
    total_failed: number,
    total_cancelled: number,
    pass_rate: number,
    failure_rate: number,
    cancel_rate: number
  }
}

type State = {
  statusWorkflow: StatusWorkflow;
  resultWorkflow: ResultWorkflow;
  dataWorkflows: DataWorkflows[];
  selectedFilters: FilterGeneric[],
  dashboardDataAgentAvianca: JSONDashboardAgentAvianca
};

type Actions = {
  setStatusWorkflow: (newStatus: StatusWorkflow) => void;
  setResultWorkflow: (newResult: ResultWorkflow) => void;
  setDataWorkflows: (newData: DataWorkflows[]) => void;
  setSelectedFilters: (newFilter: FilterGeneric[]) => void;
  setDashboardDataAgentAvianca: (newData: JSONDashboardAgentAvianca) => void;
};

type Store = State & Actions;

const store = create<Store>()(
  persist(
    (set) => ({
      statusWorkflow: "queued",
      resultWorkflow: "neutral",
      dataWorkflows: [],
      selectedFilters: [],
      dashboardDataAgentAvianca: {
        workflowsData: [],
        recent_failures: [],
        top_users: [],
        users: [],
        summary: {
          cancel_rate: 0,
          failure_rate: 0,
          pass_rate: 0,
          total_cancelled: 0,
          total_failed: 0,
          total_passed: 0,
          total_workflows: 0
        }
      },
      setStatusWorkflow: (newState) =>
        set(() => ({ statusWorkflow: newState })),
      setResultWorkflow: (newResult) =>
        set(() => ({ resultWorkflow: newResult })),
      setDataWorkflows: (newData) => set(() => ({ dataWorkflows: newData })),
      setSelectedFilters: (newFilter) => set(() => ({ selectedFilters: newFilter })),
      setDashboardDataAgentAvianca: (newdata) => set(() => ({ dashboardDataAgentAvianca: newdata }))
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
    setSelectedFilters,
    dashboardDataAgentAvianca,
    setDashboardDataAgentAvianca
  } = store();
  return {
    statusWorkflow,
    resultWorkflow,
    setStatusWorkflow,
    setResultWorkflow,
    dataWorkflows,
    setDataWorkflows,
    selectedFilters,
    setSelectedFilters,
    dashboardDataAgentAvianca,
    setDashboardDataAgentAvianca
  };
};