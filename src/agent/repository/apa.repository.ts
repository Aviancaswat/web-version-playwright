import { GithubService } from "@/github/service/github.service";
import { extractRelevantLogs } from "@/utils/extractLogsReleevant";
import { setDefaultOpenAIClient, tool, type FunctionTool } from "@openai/agents";
import OpenAI from "openai";
import z, { ZodObject } from "zod";
import { MODEL } from "../instructions";
import type { ReportData } from "../types/apa.types";

export class APARepository {

    private static genAI: OpenAI | undefined;
    private static modelName: string = MODEL;
    private static getReportByWorkflowIDGithubTool:FunctionTool<any, ZodObject<any>>

    private static ensureClient() {
        if (!this.genAI) {
            const apiKey = import.meta.env.VITE_API_KEY_OPENAI || "";
            if (!apiKey) throw new Error("VITE_API_KEY_OPENAI no es válida");
            this.genAI = new OpenAI({
                apiKey: apiKey,
                dangerouslyAllowBrowser: true,
            });
            setDefaultOpenAIClient(this.genAI);
        }
    }

    private static ensureTools() {
        this.getReportByWorkflowIDGithubTool = tool({
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
    }

    static async *generateTextTargetScan(
        historyChat: Content[],
        userPrompt: string,
        files: File[] = []
    ): AsyncGenerator<string, void, unknown> {

        const trimmedPrompt = userPrompt.trim();
        if (!trimmedPrompt && files.length === 0) {
            throw new Error("User prompt and files cannot both be empty");
        }

        this.ensureClient();

        const fileParts = files.length > 0 ? await this.filesToParts(files) : [];

        const textParts: Part[] = [];
        if (trimmedPrompt) {
            textParts.push({ text: trimmedPrompt });
        }

        const userParts: Part[] = [
            ...textParts,
            ...fileParts
        ];

        if (userParts.length === 0) {
            throw new Error("Content for user must have at least one part");
        }

        const userContent: Content = {
            role: "user",
            parts: userParts
        };

        const contentsArray: Content[] = [
            ...historyChat,
            userContent
        ];

        const contents: ContentListUnion = contentsArray;

        const response = await this.genAI!.models.generateContentStream({
            model: this.modelName,
            contents,
            config: { systemInstruction: PROMPT_TARGET_SCAN_MAIN }
        });

        for await (const part of response) {
            const text = part.text ?? "";
            yield text;
        }
    }
}
