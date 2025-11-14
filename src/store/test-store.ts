import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FilterType } from "../components/TableWorkflowComponent/FilterComponent";
import type { DataWorkflows } from "../components/TableWorkflowComponent/TableWorkflowComponent.types";
import type { ResultWorkflow, StatusWorkflow } from "../github/api";
import type { Messages } from "../pages/Chat/ChatAgentPage";

export type FilterGeneric = {
  type: FilterType
  values: string[]
}

export interface TopUser {
  user: string;
  avatar: string;
  executions: number;
  passes: number;
  failures: number;
  cancelled: number;
}

export interface JSONDashboardAgentAvianca {
  users: string[]
  workflowsData: DataWorkflows[]
  recent_failures: DataWorkflows[]
  top_users: TopUser[]
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

export interface ConversationsAPA {
  converdationId: string
  title?: string
  messages: Messages[]
}

type State = {
  statusWorkflow: StatusWorkflow;
  resultWorkflow: ResultWorkflow;
  dataWorkflows: DataWorkflows[];
  selectedFilters: FilterGeneric[],
  dashboardDataAgentAvianca: JSONDashboardAgentAvianca,
  conversationsAPA: ConversationsAPA[],
  currentConversationId: string | undefined,
  currentMessages: Messages[]
};

type Actions = {
  setStatusWorkflow: (newStatus: StatusWorkflow) => void;
  setResultWorkflow: (newResult: ResultWorkflow) => void;
  setDataWorkflows: (newData: DataWorkflows[]) => void;
  setSelectedFilters: (newFilter: FilterGeneric[]) => void;
  setDashboardDataAgentAvianca: (newData: JSONDashboardAgentAvianca) => void;
  setConversationsAPA: (update: (data: ConversationsAPA[]) => ConversationsAPA[]) => void;
  setCurrentConversationId: (id: string) => void;
  setCurrentMessages: (
    messages: Messages[] | ((prev: Messages[]) => Messages[])
  ) => void;
  resetCurrentConversation: () => void;
};

type Store = State & Actions;

const store = create<Store>()(
  persist(
    (set) => ({
      statusWorkflow: "queued",
      resultWorkflow: "neutral",
      dataWorkflows: [],
      selectedFilters: [],
      conversationsAPA: [],
      currentConversationId: undefined,
      currentMessages: [],
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
      setDashboardDataAgentAvianca: (newdata) => set(() => ({ dashboardDataAgentAvianca: newdata })),
      setConversationsAPA: (updater: (prev: ConversationsAPA[]) => ConversationsAPA[]) =>
        set((state) => ({
          conversationsAPA: updater(state.conversationsAPA),
        })),
      setCurrentConversationId: (id: string) => set({ currentConversationId: id }),
      setCurrentMessages: (updater) =>
        set((state) => ({
          currentMessages:
            typeof updater === "function"
              ? updater(state.currentMessages)
              : updater,
        })),
      resetCurrentConversation: () => set({
        currentConversationId: undefined,
        currentMessages: []
      })
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
    dataWorkflows,
    selectedFilters,
    dashboardDataAgentAvianca,
    conversationsAPA,
    currentConversationId,
    currentMessages,
    setStatusWorkflow,
    setResultWorkflow,
    setDataWorkflows,
    setSelectedFilters,
    setDashboardDataAgentAvianca,
    setConversationsAPA,
    setCurrentConversationId,
    setCurrentMessages
  } = store();

  return {
    statusWorkflow,
    resultWorkflow,
    dataWorkflows,
    selectedFilters,
    dashboardDataAgentAvianca,
    conversationsAPA,
    currentConversationId,
    currentMessages,
    setStatusWorkflow,
    setResultWorkflow,
    setDataWorkflows,
    setSelectedFilters,
    setDashboardDataAgentAvianca,
    setConversationsAPA,
    setCurrentConversationId,
    setCurrentMessages
  };
};