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

let thread: AgentInputItem[] = []

const dashboardAviancaAgent = new Agent({
    name: 'avianca_playwright_agent',
    instructions: INSTRUCTIONS_MAIN_AGENT,
    model: MODEL,
    tools: [getReportByWorkflowIDGithubTool]
})

export const RunAgentDashboard = async (dataDashboard: string, questionUser: string) => {

    try {

        // const systemPrompt = `
        //     Responde la pregunta del usuario con los datos que te proporciono, responde las preguntas del usuario de manera clara y consisa.
        //     Aquí están los datos del dashboard:
        //     ${JSON.stringify(dataDashboard)}    
        //     Si necesitas información de un workflow específico, usa la herramienta disponible.        
        //     Asegúrate de ser específico y detallar los puntos más importantes según los datos proporcionados.`

        const systemPrompt = `
            Eres un asistente experto en análisis de dashboards de Avianca. Tu objetivo es ayudar a los usuarios a comprender y extraer insights valiosos de los datos del dashboard.

            ## DATOS DEL DASHBOARD
            ${JSON.stringify(dataDashboard, null, 2)}

            ## TUS RESPONSABILIDADES
            1. Analizar los datos del dashboard para responder preguntas de manera precisa y útil
            2. Proporcionar respuestas claras, concisas y bien estructuradas
            3. Destacar métricas clave, tendencias y patrones importantes
            4. Comparar datos cuando sea relevante (períodos, categorías, workflows, etc.)
            5. Usar las herramientas disponibles cuando necesites información adicional de workflows específicos

            ## FORMATO DE RESPUESTA
            - Sé directo y ve al punto rápidamente
            - Usa números y porcentajes específicos cuando estén disponibles
            - Estructura respuestas largas con bullets o secciones cuando sea apropiado
            - Si detectas algo importante o inusual en los datos, menciónalo proactivamente
            - Para comparaciones, muestra diferencias absolutas y porcentuales

            ## EJEMPLOS DE BUENAS RESPUESTAS
            ✓ "Hay 24 workflows activos con un total de 1,458 ejecuciones este mes. Los 3 workflows con más ejecuciones son..."
            ✓ "La tasa de éxito general es del 87.3%, que está 2.5% por debajo del mes anterior debido principalmente a..."
            ✓ "El workflow 'Reservas' muestra un incremento del 23% en ejecuciones, pasando de 450 a 553..."

            ## EJEMPLOS DE RESPUESTAS A EVITAR
            ✗ "Según los datos..." (ve directo al punto)
            ✗ "Hay varios workflows" (sé específico con números)
            ✗ Respuestas genéricas sin datos concretos

            ## IMPORTANTE
            - Si los datos no contienen información para responder la pregunta, indícalo claramente
            - Si necesitas consultar detalles de un workflow específico, usa la herramienta correspondiente
            - Siempre basa tus respuestas en los datos reales proporcionados, no inventes información
            `;

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
        console.log("History: ", thread)
        return response;
    }
    catch (error) {
        console.error("Ha ocurrido un error al llamar agent ai: ", error)
        throw error;
    }
}
