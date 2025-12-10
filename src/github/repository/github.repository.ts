import { Octokit } from "@octokit/core";
import JSZip from "jszip";

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

export type StatusWorkflow = "queued" | "in_progress" | "completed" | undefined;
export type ResultWorkflow =
    | "success"
    | "failure"
    | "neutral"
    | "cancelled"
    | undefined;

type TitleWorkflow = string;

type ResultWorkflowStatus = {
    workflowId?: number;
    title: TitleWorkflow;
    status: StatusWorkflow;
    result: ResultWorkflow;
};

type ArtifactsType = {
    id: number;
    node_id: string;
    name: string;
    size_in_bytes: number;
    url: string;
    archive_download_url: string;
    expired: boolean;
    created_at: string | null;
    expires_at: string | null;
    updated_at: string | null;
    digest?: string | null | undefined;
    workflow_run?: {
        id?: number | undefined;
        repository_id?: number | undefined;
        head_repository_id?: number | undefined;
        head_branch?: string | undefined;
        head_sha?: string | undefined;
    } | null | undefined;
}

const octokit = new Octokit({
    auth: import.meta.env.VITE_GITHUB_TOKEN, // admin
});

const owner: string = "Aviancaswat";
const repo: string = "avianca-test-core-nuxqa6";
const path: string = "data/config/dataTests.ts";
const branchRef: string = "develop";

export const GithubRepository = {
    async getFileData(retries = 3): Promise<any> {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await octokit.request(
                    "GET /repos/{owner}/{repo}/contents/{path}",
                    {
                        owner: owner,
                        repo: repo,
                        path: path,
                        ref: branchRef,
                        headers: {
                            "If-None-Match": "",
                        },
                    }
                );
                return response.data;
            } catch (error) {
                console.warn(`Intento ${i + 1} fallido al obtener archivo:`, error);
                if (i === retries - 1) throw error;
                const waitTime = (i + 1) * 2000;
                await new Promise((resolve) => setTimeout(resolve, waitTime));
            }
        }
    },

    async getTimestamp() {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, "0");
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const year = today.getFullYear();
        const hour = String(today.getHours()).padStart(2, "0");
        const minute = String(today.getMinutes()).padStart(2, "0");
        return `${day}-${month}-${year} ${hour}:${minute}`;
    },

    async replaceDataforNewTest(
        testListName: string,
        newTestData: string
    ): Promise<string | undefined> {

        if (!newTestData || newTestData === "") return;

        try {

            let fileData = await this.getFileData();

            let fileContent = atob(fileData.content);

            const updatedContent = fileContent.replace(
                /\[\s*{[\s\S]*?}\s*]/,
                newTestData
            );
            
            const {
                data: { commit },
            } = await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
                owner: owner,
                repo: repo,
                path: path,
                message: `${testListName} - ${await this.getTimestamp()}`,
                content: btoa(updatedContent),
                sha: fileData.sha,
                branch: branchRef,
            });

            const commitSHA = commit.sha;
            return commitSHA;
        } catch (error) {
            console.error(`Error en el proceso del commit ${error}`);
            throw error;
        }
    },

    async checkWorkflowStatus(
        commitSHA?: string
    ): Promise<ResultWorkflowStatus | undefined> {

        if (!commitSHA) return;

        try {

            const {
                data: { workflow_runs, total_count },
            } = await octokit.request("GET /repos/{owner}/{repo}/actions/runs", {
                owner: owner,
                repo: repo,
                headers: {
                    "X-GitHub-Api-Version": "2022-11-28",
                },
            });

            if (total_count === 0) return;
            const workflow = workflow_runs.find((e) => e.head_sha === commitSHA);

            if (!workflow) return;

            const statusWorkflow = workflow.status as StatusWorkflow;
            const resultWorkflow = workflow.conclusion as ResultWorkflow;
            const titleWorkflow = workflow.display_title as TitleWorkflow;

            return {
                status: statusWorkflow,
                result: resultWorkflow,
                title: titleWorkflow,
                workflowId: workflow.id,
            };
        } catch (error) {
            console.error(`Ha ocurrido un error al check workflow status ${error}`);
            throw error;
        }
    },

    async getReportByWorkflowId(workflowRunId?: number) {

        try {

            if (!workflowRunId) throw new Error("No hay workflow id asignado");

            const { artifacts, total_count } = await this.getArtefactsByRepo();

            if (total_count === 0) throw new Error("No hay reporte asociado al workflow");

            let reports = artifacts.filter((e) => e.name === "playwright-report");

            const reportFound = reports.find(
                (e) => e.workflow_run && e.workflow_run.id === workflowRunId
            );
            if (!reportFound)
                throw new Error("No hay reporte asociado al workflow");
            let artifactId = reportFound.id;


            const { data } = await octokit.request(
                "GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}",
                {
                    owner: owner,
                    repo: repo,
                    artifact_id: artifactId,
                    archive_format: "zip",
                    headers: {
                        "X-GitHub-Api-Version": "2022-11-28",
                    },
                }
            );

            return data;

        } catch (error) {
            console.error(`Ha ocurrido un error al obtener el reporte ${error}`);
            return null;
        }
    },

    async downLoadReportHTML(
        workflowRunId?: number,
        typeReport: "playwright" | "only-screenshots" = "playwright"
    ) {

        try {

            const data = await this.getReportByWorkflowId(workflowRunId);
            if (!data) throw new Error("No se ha podido obtener el reporte");

            const blob = new Blob([data as ArrayBuffer], { type: "application/zip" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download =
                typeReport === "playwright"
                    ? `reporte-html-${await this.getTimestamp()}.zip`
                    : `reporte-screenshots-${await this.getTimestamp()}.zip`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error(
                `Ha ocurrido un error al descargar el archivo del reporte | Error: ${error}`
            );
            throw error;
        }
    },

    async getAllWorkflowsByRepo() {
        try {
            const data = await octokit.request(
                "GET /repos/{owner}/{repo}/actions/workflows",
                {
                    owner: owner,
                    repo: repo,
                    headers: {
                        "X-GitHub-Api-Version": "2022-11-28",
                    },
                }
            );
            return data;
        } catch (error) {
            console.error(
                `Ha ocurrido un error al obtener la lista de workflows del repo ${error}`
            );
            throw error;
        }
    },

    async getRunsByRepo() {
        let allRuns: any[] = [];
        let page = 1;
        const perPage = 100;
        let hasNextPage = true;

        try {
            while (hasNextPage) {
                const { data } = await octokit.request(
                    "GET /repos/{owner}/{repo}/actions/runs",
                    {
                        owner: owner,
                        repo: repo,
                        page: page,
                        per_page: perPage,
                        headers: {
                            "X-GitHub-Api-Version": "2022-11-28",
                        },
                    }
                );
                allRuns = [...allRuns, ...data.workflow_runs];
                hasNextPage = data.workflow_runs.length === perPage;
                page++;
            }
            return allRuns;
        } catch (error) {
            console.error(
                `Ha ocurrido un error al obtener la lista de workflows del repo: ${error}`
            );
            throw error;
        }
    },

    async runWorkflowById(runId: number) {
        if (!runId) throw new Error("No hay run id asignado");

        try {
            const response = await octokit.request(
                "POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun",
                {
                    owner: owner,
                    repo: repo,
                    run_id: runId,
                    headers: {
                        "X-GitHub-Api-Version": "2022-11-28",
                    },
                }
            );
            return response;
        } catch (error) {
            console.error(`Ha ocurrido un error al ejecutar el workflow ${error}`);
            throw error;
        }
    },

    async getArtefactsByRepo() {
        let allRuns: any[] = [];
        let page = 1;
        const perPage = 100;
        let hasNextPage = true;

        try {

            while (hasNextPage) {
                const { data } = await octokit.request(
                    "GET /repos/{owner}/{repo}/actions/artifacts",
                    {
                        owner: owner,
                        repo: repo,
                        page: page,
                        per_page: perPage,
                        headers: {
                            "X-GitHub-Api-Version": "2022-11-28",
                        },
                    }
                );
                allRuns = [...allRuns, ...data.artifacts];
                hasNextPage = data.artifacts.length === perPage;
                page++;
            }

            return { artifacts: allRuns as ArtifactsType[], total_count: allRuns.length };
        } catch (error) {
            console.error(
                `Ha ocurrido un error al obtener la lista de artefactos del repo ${error}`
            );
            throw error;
        }
    },

    async deleteAllArtefacts() {
        try {
            const { artifacts } = await this.getArtefactsByRepo();
            if (artifacts.length === 0)
                throw new Error("No hay artefactos para eliminar");

            for (const artifact of artifacts) {
                await octokit.request(
                    "DELETE /repos/{owner}/{repo}/actions/artifacts/{artifact_id}",
                    {
                        owner: owner,
                        repo: repo,
                        artifact_id: artifact.id,
                        headers: {
                            "X-GitHub-Api-Version": "2022-11-28",
                        },
                    }
                );
            }
        } catch (error) {
            console.error(`Ha ocurrido un error al eliminar los artefactos ${error}`);
            throw error;
        }
    },

    async deleteArtefactById(workflowId: number) {

        if (!workflowId) throw new Error("No hay workflow id asignado");

        try {

            const { artifacts, total_count } = await this.getArtefactsByRepo();
            if (total_count === 0)
                throw new Error("No hay reporte asociado al workflow");
            const artifactsFound = artifacts.filter(
                (e) => e.workflow_run?.id === workflowId
            );
            if (artifactsFound.length === 0)
                throw new Error("No hay reporte asociado al workflow");

            for (const artifact of artifactsFound) {
                await octokit.request(
                    "DELETE /repos/{owner}/{repo}/actions/artifacts/{artifact_id}",
                    {
                        owner: owner,
                        repo: repo,
                        artifact_id: artifact.id,
                        headers: {
                            "X-GitHub-Api-Version": "2022-11-28",
                        },
                    }
                );
            }
        } catch (error) {
            console.error(`Ha ocurrido un error al eliminar el artefacto ${error}`);
            throw error;
        }
    },

    async GetActionsMinutesBilling() {

        try {

            const { data } = await octokit.request('GET /users/{username}/settings/billing/usage', {
                username: owner,
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            })
            return data;
        }
        catch (error) {
            console.error("Error api actions: ", error)
            throw new Error("Ha ocurrido un error al consulta los actions minutes | Error: " + error)
        }
    },

    async getReportHTMLPreview(
        workflowRunId?: number
    ) {

        try {

            const data = await this.getReportByWorkflowId(workflowRunId);

            if (!data) throw new Error("No se ha podido obtener el reporte");

            const zip = await JSZip.loadAsync(data as ArrayBuffer);

            const htmlFile = Object.keys(zip.files).find((file) =>
                file.endsWith("index.html")
            );

            if (!htmlFile) throw new Error("No se encontró index.html dentro del ZIP");
            let htmlContent = await zip.file(htmlFile)!.async("string");

            const assetsFolder = Object.keys(zip.files).filter((file) =>
                file.startsWith("data")
            );

            const assets = await Promise.all(
                assetsFolder.map(async (file) => {
                    const content = await zip.file(file)!.async("base64");
                    return { file, content };
                })
            );

            const injectedScript = `
                <script>
                document.addEventListener('click', function(event) {
                    let target = event.target;
                    while (target && target.tagName !== 'A') {
                    target = target.parentElement;
                    }
                    if (target && target.tagName === 'A') {
                    const href = target.getAttribute('href');
                    if (href && href.startsWith('#')) {
                        event.preventDefault();
                        window.location.hash = href;
                    }
                    }
                }, true);
                </script>
        `;

            const fixDynamicImagesScript = `
          <script>
            const fixImages = () => {
              document.querySelectorAll("img[src^='data/']").forEach(img => {
                const fileName = img.getAttribute("src");
                const base64Map = ${JSON.stringify(
                Object.fromEntries(assets.map(a => [a.file, a.content]))
            )};
                if (base64Map[fileName]) {
                  let mimeType = 'image/png';
                  if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) mimeType = 'image/jpeg';
                  if (fileName.endsWith('.svg')) mimeType = 'image/svg+xml';
                  img.src = \`data:\${mimeType};base64,\${base64Map[fileName]}\`;
                }
              });
            };
            document.addEventListener('click', () => setTimeout(fixImages, 500));
            window.addEventListener('hashchange', fixImages);
            window.addEventListener('load', fixImages);
          </script>
        `;

            let modifiedHtml = htmlContent.replace('</body>', `${injectedScript}${fixDynamicImagesScript}</body>`);

            return { modifiedHtml, assets };

        } catch (error) {
            console.error(
                `Ha ocurrido un error al descargar el archivo del reporte | Error: ${error}`
            );
            throw error;
        }
    },

    async getJobsByRunId(runId: number) {

        const { data } = await octokit.request('GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs', {
            owner: owner,
            repo: repo,
            run_id: runId,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        })

        return data;
    },

    async getLogsByJobId(jobId: number) {
        try {

            const { data } = await octokit.request("GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs", {
                owner: owner,
                repo: repo,
                job_id: jobId,
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            })

            return data;
        }
        catch (error) {
            console.error("Ha ocurrido un error al obtener los logs getLogByJobId")
            throw error;
        }
    }
}
