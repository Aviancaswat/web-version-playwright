import { Octokit } from "@octokit/core";

export interface GitHubContentFile {
    type: "file";
    encoding: "base64";
    size: number;
    name: string;
    path: string;
    content: string;
    sha: string;
    url: string;
    git_url: string;
    html_url: string;
    download_url: string;
}

const octokit = new Octokit({
    auth: import.meta.env.VITE_GITHUB_TOKEN
})

export const executeWorkflow = async () => {
    const owner: string = "Aviancaswat";
    const repo: string = "avianca-test-core-nuxqa6";
    const workflow_id: number = 177616966;
    const branchRef: string = "develop";
    const response = await octokit.request('POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches', {
        owner: owner,
        repo: repo,
        workflow_id: workflow_id,
        ref: branchRef,
        // inputs: {
        //     name: 'Mona the Octocat',
        // },
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    })

    return response;
}

export const getFileData = async () => {
    const owner: string = "Aviancaswat";
    const repo: string = "avianca-test-core-nuxqa6";
    const path: string = "data/config/dataTests.ts";
    const branchRef: string = "develop";
    const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner: owner,
        repo: repo,
        path: path,
        ref: branchRef
    })

    return response.data as GitHubContentFile;
}

export const replaceDataforNewTest = async (newData: string) => {
    const owner: string = "Aviancaswat";
    const repo: string = "avianca-test-core-nuxqa6";
    const path: string = "data/config/dataTests.ts";
    const branchRef: string = "develop";
    const fileData = await getFileData();
    const fileContent = atob(fileData.content);
    console.log("fileContent 1: \n", fileContent)
    const updatedContent = fileContent.replace(/\[\s*{[\s\S]*?}\s*]/, newData);
    console.log("fileContent 2: \n\n", updatedContent)

    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner: owner,
        repo: repo,
        path: path,
        message: 'Update test data from api',
        content: btoa(updatedContent),
        sha: fileData.sha,
        branch: branchRef
    })
}