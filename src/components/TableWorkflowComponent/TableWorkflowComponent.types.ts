export type DataWorkflows = {
  id: number;
  display_title: string;
  status: string | null;
  conclusion: string | null;
  total_count: number;
  actor: {
    autorname: string,
    avatar: string
  }
};

export type TableWorkflowItemsProps = {
  data: DataWorkflows[];
};
