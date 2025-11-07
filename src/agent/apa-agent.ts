import {
    Agent,
    imageGenerationTool,
    run,
    setDefaultOpenAIClient,
    tool,
    type AgentInputItem
} from '@openai/agents';
import OpenAI from 'openai';
import z from 'zod';
import { getJobsByRunId, getLogsByJobId, getReportHTMLPreview } from '../github/api';
import { extractRelevantLogs } from '../utils/extractLogsReleevant';
import { INSTRUCTIONS_MAIN_AGENT, MODEL } from './instructions';

interface ReportData {
    workflowId: number;
    success: boolean;
    reportReady: boolean;
    message: string;
    jobs: any[];
    relevantLogs: string | null;
    jobsCount: number;
}

interface PlaywrightReport {
    workflowId: number;
    htmlContent: string | undefined;
}

declare global {
    interface Window {
        __playwrightReport?: PlaywrightReport;
    }
}

// ============================================
// CONFIGURACIÓN DE OPENAI
// ============================================

const client = new OpenAI({
    apiKey: import.meta.env?.VITE_API_KEY_OPENAI!,
    dangerouslyAllowBrowser: true,
});

setDefaultOpenAIClient(client);

// ============================================
// DEFINICIÓN DE TOOLS
// ============================================

const getReportByWorkflowIDGithubTool = tool({
    name: 'analyzer_report_github_tool',
    description: `
    Usa esta herramienta cuando el usuario pide analizar, obtener o recuperar la información detallada de un 
    workflow específico de GitHub Actions, incluyendo jobs, logs y reporte HTML de Playwright. 
    (ej: "analiza el reporte del workflow: 12345678").
    No usar esta herramienta para graficas, crear imagenes o generar visualizaciones`,
    parameters: z.object({
        workflowId: z.number().positive().describe('El ID numérico del workflow de GitHub Actions')
    }),
    execute: async (context) => {
        console.log('🔧 [analyzer_report_github_tool] Iniciando con workflowId:', context.workflowId);

        const { workflowId } = context;

        try {
            // Obtener reporte HTML
            let isFoundReport = false;
            const { modifiedHtml: contentHTML } = await getReportHTMLPreview(workflowId);

            if (!contentHTML) {
                console.warn(`No se encontró reporte HTML para workflow ${workflowId}`);
            }

            if (typeof window !== 'undefined' && contentHTML) {
                isFoundReport = true;
                window.__playwrightReport = {
                    workflowId: context.workflowId,
                    htmlContent: contentHTML
                }
                console.log(`Reporte guardado en window.__playwrightReport`);
            }

            // Obtener jobs
            console.log(`Obteniendo jobs del workflow ${workflowId}`);
            const { total_count, jobs } = await getJobsByRunId(context.workflowId);
            console.log(`Jobs encontrados: ${jobs.length}`);

            // Obtener logs del primer job
            let relevantLogs: string | null = null;
            if (total_count > 0 && jobs.length > 0) {
                try {
                    console.log("Extrayendo logs relevantes...");
                    const logs = await getLogsByJobId(jobs[0].id);
                    relevantLogs = extractRelevantLogs(logs as string);
                    console.log("Logs extraídos exitosamente");
                }
                catch (error) {
                    console.error(`Error al obtener logs del Job ${jobs[0].id}: `, error);
                }
            }
            else {
                console.log("No hay jobs disponibles");
            }

            const responseData: ReportData = {
                workflowId,
                success: true,
                reportReady: isFoundReport,
                message: isFoundReport
                    ? `Reporte encontrado con ${total_count} job(s)`
                    : `No se encontró reporte para workflow ${workflowId}`,
                jobs: jobs || [],
                relevantLogs,
                jobsCount: total_count
            };

            console.log(`[analyzer_report_github_tool] Completado exitosamente`);

            return JSON.stringify(responseData, null, 2);

        } catch (error) {
            console.error('Error en analyzer_report_github_tool:', error);
            const errorMsg = `Error al obtener reporte del workflow ${workflowId}: ${(error as Error).message}`;
            return JSON.stringify({
                workflowId,
                success: false,
                error: errorMsg
            });
        }
    }
});

// ============================================
// CONTEXTO DEL AGENTE
// ============================================

interface DashboardContext {
    dashboardData: string;
}

// ============================================
// CONFIGURACIÓN DEL AGENTE
// ============================================

const dashboardAviancaAgent = new Agent<DashboardContext>({
    name: 'avianca_playwright_agent',
    instructions: INSTRUCTIONS_MAIN_AGENT,
    model: MODEL,
    tools: [
        imageGenerationTool({
            name: "image_gen",
            model: "gpt-image-1",
            quality: "high",
            outputFormat: 'png'
        }),
        getReportByWorkflowIDGithubTool
    ],
    toolUseBehavior: "run_llm_again",
    modelSettings: {
        toolChoice: "auto"
    }
});

// ============================================
// FUNCIÓN PRINCIPAL PARA EJECUTAR EL AGENTE
// ============================================

let messages: AgentInputItem[] = [];

export const RunAgentDashboard = async (
    dataDashboard: string,
    questionUser: string
) => {
    try {
        console.log(`\n${'='.repeat(60)} `);
        console.log(`Nueva consulta: "${questionUser}"`);
        console.log(`${'='.repeat(60)} \n`);

        const systemMessage = `
        # DATOS DEL DASHBOARD DISPONIBLES

        ${JSON.stringify(JSON.parse(dataDashboard), null, 2)}

        # INSTRUCCIONES
        - Para consultas sobre el dashboard, usa DIRECTAMENTE estos datos
        - Selecciona la herramienta a usar en base a la descripción del usuario
        - Solo llama herramientas si el usuario lo solicita EXPLÍCITAMENTE

        # USO DE HERRAMIENTAS
        ## CUANDO USAR LA HERRAMIENTA **analyzer_report_github_tool**:
        - Cuando el usuario pida ANALIZAR un reporte de un workflow en especifico.
        - Cuando el usuario pida OBTENER un reporte de un workflow en específico.
        - Cuando el usuario pida RECUPERAR un reporte de un workflow en específico.

        ## CUANDO USAR LA HERRAMIENTA **image_gen**:
        - Cuando el usuario pida GENERAR una imagen o visualización basado en los datos del dashboard.
        - Cuando el usuario pida CREAR una imagen o visualización basado en los datos del dashboard.
        - Cuando el usuario pida VISUALIZAR una imagen o visualización basado en los datos del dashboard.
        - Cuando el usuario pida GRAFICAR una imagen o visualización basado en los datos del dashboard.

        - Sé conciso y preciso en tus respuestas
        `.trimStart();

        if (messages.length === 0) {
            const findRoleSystem = messages.find((e: any) => e.role === "system");
            if (!findRoleSystem) {
                messages.push({
                    role: "system",
                    content: systemMessage
                })
            }
        }

        const context: DashboardContext = {
            dashboardData: dataDashboard
        };

        const response = await run(
            dashboardAviancaAgent,
            messages.concat({ role: "user", content: questionUser }),
            {
                context,
                maxTurns: 10
            }
        );

        messages = response.history;

        console.log(`\n Respuesta generada exitosamente`);
        console.log(`Turnos utilizados: ${response.history.length / 2} `);

        return response;
    }
    catch (error) {
        console.error("\nError al ejecutar el agente:", error);

        if (error instanceof Error) {
            if (error.message.includes('rate limit')) {
                throw new Error('Límite de tasa alcanzado. Por favor espera unos momentos e intenta de nuevo.');
            }
            if (error.message.includes('MaxTurnsExceededError')) {
                throw new Error('El agente alcanzó el máximo de iteraciones. Por favor reformula tu pregunta.');
            }
        }

        throw error;
    }
};

export const testToolDirectly = async (toolName: string, params: any) => {
    console.log(`\nTest directo de tool: ${toolName} `);
    console.log(`Parámetros: `, params);

    const tool = dashboardAviancaAgent.tools.find(
        // @ts-ignore
        t => t.name === toolName
    );

    if (!tool) {
        throw new Error(`Tool ${toolName} no encontrada`);
    }

    try {
        // @ts-ignore
        const result = await tool.execute(params, {});
        console.log(`Resultado: `, result);
        return result;
    } catch (error) {
        console.error(`Error: `, error);
        throw error;
    }
};