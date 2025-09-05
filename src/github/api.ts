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
    console.log("newTestData: ", newTestData)
    const datas = transformerData(newTestData);
    console.log("datas: ", datas);

    if (!datas || datas.length === 0) return;

    const commitResults = [];

    for (let i = 0; i < datas.length; i++) {
        const data = datas[i];

        try {

            console.log(`\n--- Procesando commit ${i + 1}/${datas.length} ---`);

            let fileData = await getFileData();
            console.log(`SHA actual para commit ${i + 1}: `, fileData.sha);

            let fileContent = atob(fileData.content);

            const updatedContent = fileContent.replace(
                /\[\s*{[\s\S]*?}\s*]/,
                JSON.stringify(data, null, 2)
            );

            const response = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
                owner: owner,
                repo: repo,
                path: path,
                message: `Prueba Paralelismo - Test ${i + 1} - ${getTimestamp()}`,
                content: btoa(updatedContent),
                sha: fileData.sha,
                branch: branchRef
            });

            console.log(`✅ Commit ${i + 1} realizado exitosamente`);

            commitResults.push({
                index: i + 1,
                success: true,
                commitSha: response.data.commit?.sha,
                contentSha: response.data.content?.sha,
                data: data
            });

            if (i < datas.length - 1) {
                console.log(`Esperando 2 segundos antes del siguiente commit...`);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

        } catch (error) {
            console.error(`❌ Error en commit ${i + 1}:`, error);
            commitResults.push({
                index: i + 1,
                success: false,
                error: error,
                data: data
            });
        }
    }

    console.log('\n=== RESUMEN DE COMMITS ===');
    console.log(`Total de elementos procesados: ${datas.length}`);
    console.log(`Commits exitosos: ${commitResults.filter(r => r.success).length}`);
    console.log(`Commits fallidos: ${commitResults.filter(r => !r.success).length}`);

    commitResults.forEach(result => {
        if (result.success) {
            console.log(`✅ Commit ${result.index}: SHA ${result.commitSha}`);
        } else {
            console.log(`❌ Commit ${result.index}: ${result.error}`);
        }
    });
};