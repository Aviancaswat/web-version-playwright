import { GithubService } from "@/github/service/github.service";
import type { DashboardContext, ReportData } from "@/interfaces/apa/apa.interfaces";
import { extractRelevantLogs } from "@/utils/extractLogsReleevant";
import { getPromptSystem, INSTRUCTIONS_MAIN_AGENT } from "@/utils/prompt";
import { Agent, imageGenerationTool, run, setDefaultOpenAIClient, tool, type AgentInputItem } from "@openai/agents";
import OpenAI from "openai";
import z from "zod";

export class APARepository {
    private static genAI: OpenAI | undefined;
    private static modelName: string = "gpt-4.1-nano-2025-04-14";
    private static agentName: string = "avianca_playwright_agent";
    private static messages: AgentInputItem[] = [];

    private static ensureClient() {
        if (!this.genAI) {
            const apiKey = import.meta.env.VITE_API_KEY_OPENAI || "";
            if (!apiKey) {
                throw new Error("VITE_API_KEY_OPENAI no es válida");
            }
            this.genAI = new OpenAI({
                apiKey: import.meta.env?.VITE_API_KEY_OPENAI!,
                dangerouslyAllowBrowser: true,
            });

            setDefaultOpenAIClient(this.genAI);
        }
    }

    private static getToolsAgent = () => {
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

                    const { modifiedHtml: contentHTML } = await GithubService.getReportHTMLPreviewGithub(workflowId);

                    if (!contentHTML) {
                        console.warn(`No se encontró reporte HTML para workflow ${workflowId}`);
                    }

                    console.log(`Obteniendo jobs del workflow ${workflowId}`);
                    const { total_count, jobs } = await GithubService.getJobsByRunIdGithub(context.workflowId);
                    console.log(`Jobs encontrados: ${jobs.length}`);

                    let relevantLogs: string | null = null;
                    if (total_count > 0 && jobs.length > 0) {

                        try {
                            console.log("Extrayendo logs relevantes...");
                            const logs = await GithubService.getLogsByJobIdGithub(jobs[0].id);
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

        return [
            imageGenerationTool({
                name: "image_gen",
                model: "gpt-image-1",
                quality: "high",
                outputFormat: 'png'
            }),
            getReportByWorkflowIDGithubTool
        ];
    }

    static buildAgent(): Agent<DashboardContext, "text"> {
        this.ensureClient();
        const tools = this.getToolsAgent();
        const dashboardAviancaAgent = new Agent<DashboardContext>({
            name: this.agentName,
            instructions: INSTRUCTIONS_MAIN_AGENT,
            model: this.modelName,
            tools,
            toolUseBehavior: "run_llm_again",
            modelSettings: {
                toolChoice: "auto"
            }
        });

        return dashboardAviancaAgent;
    }

    //@ts-ignore
    private static async evaluateTools(toolName: string, params: any) {
        console.log(`\nTest directo de tool: ${toolName} `);
        console.log(`Parámetros: `, params);

        const dashboardAviancaAgent = this.buildAgent();

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
    }

    static async *generateContentDashboard(
        dataDashboard: string,
        questionUser: string
    ): AsyncGenerator<string, any, unknown> {

        try {

            console.log(`\n${'='.repeat(60)} `);
            console.log(`Nueva consulta: "${questionUser}"`);
            console.log(`${'='.repeat(60)} \n`);

            const dashboardContext = getPromptSystem(dataDashboard);
            const userMessage = `${dashboardContext}\n\n# 📝 SOLICITUD DEL USUARIO:\n${questionUser}`;
            const messagesToSend = this.messages.concat({ role: "user", content: userMessage });

            const dashboardAviancaAgent = this.buildAgent();

            const response = await run(
                dashboardAviancaAgent,
                messagesToSend,
                {
                    maxTurns: 10,
                    stream: true
                }
            );

            this.messages = response.history;

            console.log(`\n Respuesta generada exitosamente`);
            console.log(`Turnos utilizados: ${response.history.length / 2} `);

            for await (const part of response) {
                if (part.type === 'raw_model_stream_event') {
                    console.log(`${part.type} %o`, part.data);
                    if (part.data.type === "output_text_delta") {
                        yield part.data.delta;
                    }
                }
            }
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
}