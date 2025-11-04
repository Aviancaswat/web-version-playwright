import { Agent, run, setDefaultOpenAIClient, tool, type AgentInputItem } from '@openai/agents';
import OpenAI from 'openai';
import z from 'zod';
import { getJobsByRunId, getLogsByJobId, getReportHTMLPreview } from '../github/api';
import { extractRelevantLogs } from '../utils/extractLogsReleevant';
import { INSTRUCTIONS_MAIN_AGENT, MODEL } from './instructions';

const client = new OpenAI({
    apiKey: import.meta.env?.VITE_API_KEY_OPENAI!,
    dangerouslyAllowBrowser: true,
});

setDefaultOpenAIClient(client);

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
    htmlContent: string;
}

declare global {
    interface Window {
        __playwrightReport?: PlaywrightReport;
    }
}

const getReportByWorkflowIDGithubTool = tool({
    name: 'analyzer_report_github_tool',
    description: 'Obtiene la data del reporte desde la API de github',
    parameters: z.object({
        workflowId: z.number().positive().describe('El ID numérico del workflow de GitHub. Ejemplo: 12345678')
    }),
    execute: async (_context, _, function_call) => {
        console.log("Llamando a function call: ", function_call?.toolCall.name)
        console.log('🔧 Tool ejecutado con workflowId:', _context.workflowId);

        const { workflowId } = _context;

        try {

            const { modifiedHtml: contentHTML } = await getReportHTMLPreview(workflowId);

            if (!contentHTML) {
                const errorMsg = `No se encontró reporte HTML para el workflow ${workflowId}`;
                console.warn(`${errorMsg}`);

                return JSON.stringify({
                    workflowId,
                    success: false,
                    reportReady: false,
                    message: errorMsg,
                    jobs: [],
                    relevantLogs: null,
                    jobsCount: 0
                } as ReportData);
            }

            if (typeof window !== undefined) {
                window.__playwrightReport = {
                    workflowId: _context.workflowId,
                    htmlContent: contentHTML
                }
                console.log(`Reporte guardado en window.__playwrightReport`);
            }

            console.log(`Obteniendo los jobs del workflow ${workflowId}`)
            const { total_count, jobs } = await getJobsByRunId(_context.workflowId);
            console.log(`Se finalizó la obtención de los jobs: ${jobs.length} encontrados`);
            let relevantLogs: string | null = null;

            if (total_count > 0 && jobs.length > 0) {
                try {
                    console.log("Extrayendo los logs...")
                    const logs = await getLogsByJobId(jobs[0].id);
                    relevantLogs = extractRelevantLogs(logs as string);
                    console.log("se finaliza extracción de logs relevantes");
                }
                catch (error) {
                    console.error(`Error al obtener los logs para el Job ${jobs[0].id}`)
                }
            }
            else {
                console.log("No hya jobs diaponibles para extraer los logs");
            }

            const responseData: ReportData = {
                workflowId,
                success: true,
                reportReady: true,
                message: `Reporte encontrado exitosamente con ${total_count} job(s)`,
                jobs: jobs || [],
                relevantLogs,
                jobsCount: total_count
            };

            console.log(`✅ [${function_call?.toolCall.name}] Completado exitosamente`);
            return JSON.stringify(responseData, null, 2);

        } catch (error) {
            console.error('Error en tool:', error);
            throw new Error(`Error al obtener reporte: ${(error as Error).message}`);
        }
    }
})

let thread: AgentInputItem[] = []

const dashboardAviancaAgent = new Agent({
    name: 'avianca_playwright_agent',
    instructions: INSTRUCTIONS_MAIN_AGENT,
    model: MODEL,
    tools: [getReportByWorkflowIDGithubTool]
})

export const RunAgentDashboard = async (dataDashboard: string, questionUser: string) => {

    try {

        const systemPrompt = `
            Responde la pregunta del usuario con los datos que te proporciono, responde las preguntas del usuario de manera clara y consisa.
            # DATOS DEL DASHBOARD
            ${JSON.stringify(dataDashboard)}    
            Si necesitas información de un workflow específico, usa la herramienta disponible.        
            Asegúrate de ser específico y detallar los puntos más importantes según los datos proporcionados.`

        if (thread.length === 0) {
            thread.push({
                role: "system",
                content: systemPrompt
            })
        }

        const response = await run(
            dashboardAviancaAgent,
            thread.concat({ role: "user", content: questionUser })
        );

        thread = response.history;
        return response;
    }
    catch (error) {
        console.error("Ha ocurrido un error al llamar agent ai: ", error)
        throw error;
    }
}