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

const getFileData = async (retries = 3): Promise<any> => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
                owner: owner,
                repo: repo,
                path: path,
                ref: branchRef,
                headers: {
                    'If-None-Match': ''
                }
            });
            return response.data;
        } catch (error) {
            console.warn(`Intento ${i + 1} fallido al obtener archivo:`, error);
            if (i === retries - 1) throw error;
            const waitTime = (i + 1) * 2000;
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }
};

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

    if (!newTestData || newTestData === "") return;

    try {

        console.log(`\n--- Procesando commit ---`);
        let fileData = await getFileData();
        console.log(`SHA actual para el commit: `, fileData.sha);
        let fileContent = atob(fileData.content);
        console.log("fileContent: ", fileContent)
        const updatedContent = fileContent.replace(/\[\s*{[\s\S]*?}\s*]/, newTestData);
        console.log("Update content: ", updatedContent)

        await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
            owner: owner,
            repo: repo,
            path: path,
            message: `Nueva Prueba Paralelismo - Test - ${getTimestamp()}`,
            content: btoa(updatedContent),
            sha: fileData.sha,
            branch: branchRef
        });

        console.log(`✅ Commit realizado exitosamente`);
    }
    catch (error) {
        console.error(`Error en el proceso del commit ${error}`)
        throw error;
    }
};