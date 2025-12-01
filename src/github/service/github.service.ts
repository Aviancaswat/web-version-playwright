import { GithubRepository } from "../repository/github.repository";

export const GithubService = {
    async deleteAllArtefactsGithub() {
        return await GithubRepository.deleteAllArtefacts();
    },
    async downLoadReportHTMLGithub(workflowID: number) {
        return await GithubRepository.downLoadReportHTML(workflowID);
    },
    async runWorkflowByIdGithub(runId: number) {
        return await GithubRepository.runWorkflowById(runId);
    },
    async deleteArtefactByIdGithub(workflowId: number) {
        return await GithubRepository.deleteArtefactById(workflowId);
    },
    async getReportHTMLPreviewGithub(workflowId: number) {
        return await GithubRepository.getReportHTMLPreview(workflowId);
    },
    async getRunsByRepoGithub() {
        return await GithubRepository.getRunsByRepo();
    },
    async checkWorkflowStatusGithub(commitSHA: string) {
        return await GithubRepository.checkWorkflowStatus(commitSHA);
    },
    async replaceDataforNewTestGithub(testListName: string, newdata: string) {
        return await GithubRepository.replaceDataforNewTest(testListName, newdata);
    },
    async getJobsByRunIdGithub(runId: number) {
        return await GithubRepository.getJobsByRunId(runId);
    },
    async getLogsByJobIdGithub(jobId: number) {
        return await GithubRepository.getLogsByJobId(jobId);
    },
    async getArtefactsByRepoGithub() {
        return await GithubRepository.getArtefactsByRepo();
    },
    async GetActionsMinutesBillingGithub(){
        return await GithubRepository.GetActionsMinutesBilling();
    }
}