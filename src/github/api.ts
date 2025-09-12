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

export type StatusWorkflow = 'queued' | 'in_progress' | 'completed'
export type ResultWorkflow = 'success' | 'failure' | 'neutral' | 'cancelled'

type ResultWorkflowStatus = {
    workflowId?: number,
    //buscar la manera de obtener este id para mejorar la descarga del reporte.
    // que la descarga del reporte sea igual al workflow que se eeta ejecutando en tiempo real
    status: StatusWorkflow,
    result: ResultWorkflow
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

export const replaceDataforNewTest = async (newTestData: string): Promise<string | undefined> => {

    if (!newTestData || newTestData === "") return;

    try {

        console.log(`\n--- Procesando commit ---`);
        let fileData = await getFileData();
        console.log(`SHA actual para el commit: `, fileData.sha);
        let fileContent = atob(fileData.content);
        console.log("fileContent: ", fileContent)
        const updatedContent = fileContent.replace(/\[\s*{[\s\S]*?}\s*]/, newTestData);
        console.log("Update content: ", updatedContent)

        const { data: { commit } } = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
            owner: owner,
            repo: repo,
            path: path,
            message: `Descargar reporte - ${getTimestamp()}`,
            content: btoa(updatedContent),
            sha: fileData.sha,
            branch: branchRef
        });

        console.log(`✅ Commit realizado exitosamente`);
        const commitSHA = commit.sha;
        return commitSHA

    }
    catch (error) {
        console.error(`Error en el proceso del commit ${error}`);
        throw error;
    }
};

export const getArtefactsByRepo = async () => {

    try {

        const { data } = await octokit.request('GET /repos/{owner}/{repo}/actions/artifacts', {
            owner: owner,
            repo: repo,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        })
        console.log("Data artefacts: ", data)
        return data;
    }
    catch (error) {
        console.error(`Ha ocurrido un error al obtener la lista de artefactos del repo ${error}`)
        throw error;
    }
}

const checkWorkflowStatus = async (commitSHA?: string): Promise<ResultWorkflowStatus | undefined> => {

    console.log("commitSHA Function: ", commitSHA)
    if (!commitSHA) return;

    try {

        const { data: { workflow_runs, total_count } } = await octokit.request('GET /repos/{owner}/{repo}/actions/runs', {
            owner: owner,
            repo: repo,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        })

        if (total_count === 0) return;
        const workflow = workflow_runs.find(e => e.head_sha === commitSHA);

        if (!workflow) return;

        const statusWorkflow = workflow.status as StatusWorkflow;
        const resultWorkflow = workflow.conclusion as ResultWorkflow;

        return {
            status: statusWorkflow,
            result: resultWorkflow,
            workflowId: workflow.id 
        }
        //si es undefined es porque el workflow apenas se está inicializando
    }
    catch (error) {
        console.error(`Ha ocurrido un error al check workflow status ${error}`)
        throw error
    }
}

export const checkStatusWorkflow = async (commitSHA?: string): Promise<ResultWorkflowStatus | undefined> => {
    if (!commitSHA) return;

    return new Promise<ResultWorkflowStatus>((resolve) => {
        const getStatus = async () => {
            console.log("fetch get status...")
            const response = await checkWorkflowStatus(commitSHA)
            console.log("Response status: ", response)

            if (!response) {
                resolve({
                    status: "queued",
                    result: "neutral"
                });
                return;
            }

            const { status } = response;

            if (status === "completed") {
                clearInterval(intervalId);
                console.log("Workflow completed...");
                resolve({
                    status: response.status,
                    result: response.result,
                });
            } else {
                console.log(`Workflow status: ${status}, se volverá a checkear en 30 segundos...`);
            }
        };

        getStatus();
        const intervalId = setInterval(getStatus, 30000);
    });
}

export const downLoadReportHTML = async () => {

    try {
        const { artifacts, total_count } = await getArtefactsByRepo()
        if (total_count === 0) return;
        const artifactFound = artifacts.find(e => e.name === "playwright-report");
        if (!artifactFound) return;
        const artifactId = artifactFound.id;
        const { data } = await octokit.request('GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}', {
            owner: owner,
            repo: repo,
            artifact_id: artifactId,
            archive_format: 'zip',
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        })

        const blob = new Blob([data as ArrayBuffer], { type: 'application/zip' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte-html-${getTimestamp()}.zip`;
        a.click();
        URL.revokeObjectURL(url);
        console.log("Reponse download: ", data)
    }
    catch (error) {
        console.error(`Ha ocurrido un error al descargar el archivo del reporte | Error: ${error}`)
        throw error;
    }
}