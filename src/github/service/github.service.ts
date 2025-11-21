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
    }
}