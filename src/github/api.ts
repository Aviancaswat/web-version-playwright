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
  //buscar la manera de obtener este id para mejorar la descarga del reporte.
  // que la descarga del reporte sea igual al workflow que se eeta ejecutando en tiempo real
  title: TitleWorkflow;
  status: StatusWorkflow;
  result: ResultWorkflow;
};

const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN, // admin
});

const owner: string = "Aviancaswat";
const repo: string = "avianca-test-core-nuxqa6";
const path: string = "data/config/dataTests.ts";
const workflow_id: number = 177616966;
const branchRef: string = "develop";

export const executeWorkflow = async () => {
  const response = await octokit.request(
    "POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches",
    {
      owner: owner,
      repo: repo,
      workflow_id: workflow_id,
      ref: branchRef,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  return response;
};

const getFileData = async (retries = 3): Promise<any> => {
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
};

export const getTimestamp = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  const hour = String(today.getHours()).padStart(2, "0");
  const minute = String(today.getMinutes()).padStart(2, "0");
  return `${day}-${month}-${year} ${hour}:${minute}`;
};

export const replaceDataforNewTest = async (
  testListName: string,
  newTestData: string
): Promise<string | undefined> => {
  if (!newTestData || newTestData === "") return;

  try {
    let fileData = await getFileData();

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
      message: `${testListName} - ${getTimestamp()}`,
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
};

export const checkWorkflowStatus = async (
  commitSHA?: string
): Promise<ResultWorkflowStatus | undefined> => {
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
};

export const downLoadReportHTML = async (
  workflowRunId?: number,
  typeReport: "playwright" | "only-screenshots" = "playwright"
) => {
  console.log("workflowRunId pasado a download report: ", workflowRunId);
  if (!workflowRunId) throw new Error("No hay workflow id asignado");

  try {
    const { artifacts, total_count } = await getArtefactsByRepo();

    console.log("artifacts: ", artifacts);

    if (total_count === 0)
      throw new Error("No se encontraron reportes asociados al workflow");

    let artifactId: number = 0;
    let reports: any[] = [];

    if (typeReport === "playwright") {
      reports = artifacts.filter((e) => e.name === "playwright-report");
    } else if (typeReport === "only-screenshots") {
      reports = artifacts.filter((e) => e.name === "results-by-test");
    }

    const reportFound = reports.find(
      (e) => e.workflow_run && e.workflow_run.id === workflowRunId
    );
    console.log("reportFound: ", reportFound);
    if (!reportFound)
      throw new Error("No se encontró ningun reporte asociado al workflow");
    artifactId = reportFound.id;

    console.log("artifactId: ", artifactId);
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

    const blob = new Blob([data as ArrayBuffer], { type: "application/zip" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download =
      typeReport === "playwright"
        ? `reporte-html-${getTimestamp()}.zip`
        : `reporte-screenshots-${getTimestamp()}.zip`;
    a.click();
    URL.revokeObjectURL(url);
    console.log("Reponse download: ", data);
  } catch (error) {
    console.error(
      `Ha ocurrido un error al descargar el archivo del reporte | Error: ${error}`
    );
    throw error;
  }
};

export const getAllWorkflowsByRepo = async () => {
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
    console.log("Data workflows: ", data);
    return data;
  } catch (error) {
    console.error(
      `Ha ocurrido un error al obtener la lista de workflows del repo ${error}`
    );
    throw error;
  }
};

export const getRunsByRepo = async () => {
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
};

export const runWorkflowById = async (runId: number) => {
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
};

export const getArtefactsByRepo = async () => {
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

    return { artifacts: allRuns, total_count: allRuns.length };
  } catch (error) {
    console.error(
      `Ha ocurrido un error al obtener la lista de artefactos del repo ${error}`
    );
    throw error;
  }
};

export const deleteAllArtefacts = async () => {
  try {
    const { artifacts } = await getArtefactsByRepo();
    console.log("artifacts to delete: ", artifacts);
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
      console.log(`Artefacto con ID ${artifact.id} eliminado.`);
    }
  } catch (error) {
    console.error(`Ha ocurrido un error al eliminar los artefactos ${error}`);
    throw error;
  }
};

export const deleteArtefactById = async (workflowId: number) => {
  if (!workflowId) throw new Error("No hay workflow id asignado");

  try {
    const { artifacts, total_count } = await getArtefactsByRepo();
    if (total_count === 0)
      throw new Error("No se encontró reportes asociados al workflow");
    const artifactsFound = artifacts.filter(
      (e) => e.workflow_run?.id === workflowId
    );
    if (artifactsFound.length === 0)
      throw new Error("No se encontró reportes asociados al workflow");

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
      console.log(`Artefacto con ID ${artifact.id} eliminado.`);
    }
  } catch (error) {
    console.error(`Ha ocurrido un error al eliminar el artefacto ${error}`);
    throw error;
  }
};
