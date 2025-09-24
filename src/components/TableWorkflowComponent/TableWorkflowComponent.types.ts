export type DataWorkflows = {
  id: number;
  display_title: string;
  status: string | null;
  conclusion: string | null;
  total_count: number;
};

export type TableWorkflowItemsProps = {
  data: DataWorkflows[];
};
