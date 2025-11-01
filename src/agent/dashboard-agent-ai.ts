import { Agent, run, setDefaultOpenAIClient, tool } from '@openai/agents';
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

const getReportByWorkflowIDGithubTool = tool({
    name: 'analyzer_report_github_tool',
    description: 'Obtiene la data del reporte desde la API de github',
    parameters: z.object({
        workflowId: z.number().describe('El ID numérico del workflow de GitHub. Ejemplo: 12345678')
    }),
    execute: async (_context, _, function_call) => {
        console.log("Llamando a function call: ", function_call?.toolCall.name)
        console.log('🔧 Tool ejecutado con workflowId:', _context.workflowId);

        try {

            const { modifiedHtml: contentHTML } = await getReportHTMLPreview(_context.workflowId);

            if (!contentHTML) {
                throw new Error(`No hay reporte asociado a este workflow: ${_context.workflowId}`)
            }

            (window as any).__playwrightReport = {
                workflowId: _context.workflowId,
                htmlContent: contentHTML
            }

            const { total_count, jobs } = await getJobsByRunId(_context.workflowId);
            let relevantLogs: string | null = null;

            if (total_count > 0) {
                const logs = await getLogsByJobId(jobs[0].id);
                relevantLogs = extractRelevantLogs(logs as string);
            }

            let responseData = JSON.stringify({
                workflowId: _context.workflowId,
                success: true,
                reportReady: true,
                message: "Reporte encontrado",
                Jobs: JSON.stringify(jobs),
                relevantLogs: relevantLogs
            });

            return responseData;
        } catch (error) {
            console.error('Error en tool:', error);
            throw new Error(`Error al obtener reporte: ${(error as Error).message}`);
        }
    }
})

const dashboardAviancaAgent = new Agent({
    name: 'avianca_playwright_agent',
    instructions: INSTRUCTIONS_MAIN_AGENT,
    model: MODEL,
    tools: [getReportByWorkflowIDGithubTool]
})

export const RunAgentDashboard = async (dataDashboard: string, questionUser: string) => {

    try {
        const response = await run(
            dashboardAviancaAgent,
            `
            la pregunta del usuario es: ${questionUser}
            Responde la pregunta del usuario con los datos que te proporciono, responde las preguntas del usuario de manera clara y consisa.
            Aquí están los datos del dashboard:
            ${JSON.stringify(dataDashboard)}    
            Si necesitas información de un workflow específico, usa la herramienta disponible.        
            Asegúrate de ser específico y detallar los puntos más importantes según los datos proporcionados.`
        );

        return response;
    }
    catch (error) {
        console.error("Ha ocurrido un error al llamar agent ai: ", error)
        throw error;
    }
}
