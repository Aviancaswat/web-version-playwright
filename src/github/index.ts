import { Octokit } from "@octokit/core";

const octokit = new Octokit({
    auth: import.meta.env.VITE_GITHUB_TOKEN
})

export const executeWorkflow = async () => {
    //datos del repo
    const owner: string = "Aviancaswat";
    const repo: string = "avianca-test-core-nuxqa6";
    const workflow_id: string = "playwright.yml";
    const branchRef: string = "develop";
    const response = await octokit.request('POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches', {
        owner: owner,
        repo: repo,
        workflow_id: workflow_id,
        ref: branchRef,
        // inputs: {
        //     name: 'Mona the Octocat',
        //     home: 'San Francisco, CA'
        // },
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    })

    return response;
}