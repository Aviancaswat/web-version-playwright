import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DataWorkflows } from "../components/TableWorkflowComponent/TableWorkflowComponent.types";
import type { ResultWorkflow, StatusWorkflow } from "../github/api";

type State = {
  statusWorkflow: StatusWorkflow;
  resultWorkflow: ResultWorkflow;
  dataWorkflows: DataWorkflows[];
};

type Actions = {
  setStatusWorkflow: (newStatus: StatusWorkflow) => void;
  setResultWorkflow: (newResult: ResultWorkflow) => void;
  setDataWorkflows: (newData: DataWorkflows[]) => void;
};

type Store = State & Actions;

const store = create<Store>()(
  persist(
    (set) => ({
      statusWorkflow: "queued",
      resultWorkflow: "neutral",
      dataWorkflows: [],
      setStatusWorkflow: (newState) =>
        set(() => ({ statusWorkflow: newState })),
      setResultWorkflow: (newResult) =>
        set(() => ({ resultWorkflow: newResult })),
      setDataWorkflows: (newData) => set(() => ({ dataWorkflows: newData })),
    }),
    {
      name: "test-store",
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
  } = store();
  return {
    statusWorkflow,
    resultWorkflow,
    setStatusWorkflow,
    setResultWorkflow,
    dataWorkflows,
    setDataWorkflows,
  };
};
