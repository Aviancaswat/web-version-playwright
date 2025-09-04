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
    auth: import.meta.env.VITE_GITHUB_TOKEN, // admin
})

const owner: string = "Aviancaswat";
const repo: string = "avianca-test-core-nuxqa6";
const path: string = "data/config/dataTests.ts";
const workflow_id: number = 177616966;
const branchRef: string = "develop";

export const executeWorkflow = async () => {
    const response = await octokit.request('POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches', {
        owner: owner,
        repo: repo,
        workflow_id: workflow_id,
        ref: branchRef,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28',
        }
    })

    return response;
}

export const getFileData = async () => {
    const { data } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner: owner,
        repo: repo,
        path: path,
        ref: branchRef,
    })

    return data as GitHubContentFile;
}

const getTimestamp = () => {

    const today = new Date().toISOString();

    if (today.includes("T")) {
        return `${today.split("T")[0]}-${today.split("T")[1]}`
    }
    return today;
}

const transformerData = (data: string) => {
    const jsonData = JSON.parse(data);
    if (jsonData.length === 0) return;

    let arrayAllData = [];

    for (let i = 0; i < jsonData.length; i++) {
        let newArray = [];
        const element = jsonData[i];
        newArray.push(element);
        arrayAllData.push(newArray);
    }

    return arrayAllData;
}

export const replaceDataforNewTest = async (newTestData: string) => {
    const datas = transformerData(newTestData); // Transformar el string JSON en un array de arrays
    console.log("datas: ", datas);

    if (!datas || datas.length === 0) return;

    const promises = datas.map(async (data: any[], index) => {
        const fileData = await getFileData();
        console.log(`sha version ${index}: `, fileData.sha)
        const fileContent = atob(fileData.content);
        const updatedContent = fileContent.replace(/\[\s*{[\s\S]*?}\s*]/, JSON.stringify(data, null, 2));

        await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
            owner: owner,
            repo: repo,
            path: path,
            message: `Commit desde la api - ${getTimestamp()}`,
            content: btoa(updatedContent),
            sha: fileData.sha,
            branch: branchRef
        })
    })

    for await (const response of promises) {
        console.log("Response commit: ", response);
    }
}