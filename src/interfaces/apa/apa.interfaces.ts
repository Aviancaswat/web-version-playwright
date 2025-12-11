
export interface ReportData {
    workflowId: number;
    success: boolean;
    message?: string;
    jobs: any[];
    relevantLogs: string | null;
    jobsCount: number;
}

export interface DashboardContext {
    dashboardData: string;
}