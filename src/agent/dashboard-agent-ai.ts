
// const downloadReportAviancaAgent = new Agent({
//     name: "download_report_dashboard_avianca_playwright",
//     instructions: "Accede al dashboard de la aplicación web Avianca, navega hasta la sección de reportes generales y ejecuta la acción necesaria para descargar el reporte completo en el formato disponible (por ejemplo, .csv, .xlsx o .pdf). Asegúrate de esperar a que la descarga finalice correctamente y verifica que el archivo se haya guardado exitosamente."
// });

// const resumeDashboardAviancaAgent = new Agent({
//     name: "resume_dashboard_avianca_playwright",
//     instructions: "Accede al dashboard de la aplicación web Avianca y analiza todos los indicadores disponibles, incluyendo métricas clave de rendimiento y datos relevantes. Extrae también la información de la tabla de workflows de GitHub integrada en el dashboard. Con base en estos datos, genera un resumen claro y conciso que destaque los principales hallazgos, tendencias y posibles áreas de mejora. El resumen debe ser comprensible y estructurado para su revisión por parte del equipo."
// });

// const recomendationsDashboardAviancaAgent = new Agent({
//     name: "recomendations_dashboard_avianca_playwright",
//     instructions: "Accede al dashboard de la aplicación web Avianca y analiza todos los indicadores disponibles, incluyendo métricas clave de rendimiento y datos relevantes. Extrae también la información de la tabla de workflows de GitHub integrada en el dashboard. Con base en estos datos, genera recomendaciones de manera claro y conciso que destaque los principales hallazgos, tendencias y posibles áreas de mejora. El resumen debe ser comprensible y estructurado para su revisión por parte del equipo."
// });

import { Agent, run, setDefaultOpenAIClient } from '@openai/agents';
import OpenAI from 'openai';
import { INTRUCTIONS_MAIN_AGENT } from './instructions';

const client = new OpenAI({
    apiKey: import.meta.env?.VITE_API_KEY_OPENAI!,
    dangerouslyAllowBrowser: true,
});

setDefaultOpenAIClient(client);
const dashboardAviancaAgent = new Agent({
    name: 'dashboard_avianca_playwright',
    instructions: INTRUCTIONS_MAIN_AGENT,
    model: 'gpt-5-nano-2025-08-07'
});

// Responde de la siguiente manera:
//             1. Proporciona un análisis general sobre la salud del pipeline (tasa de éxito, fallos, cancelaciones, etc.).
//             2. Analiza el desempeño de los usuarios principales (incluyendo métricas como tasa de éxito, fallos, etc.).
//             3. Identifica cualquier tendencia o patrón crítico relacionado con los fallos o cualquier otro problema.
//             4. Resume las métricas clave y cualquier hallazgo importante relacionado con la estabilidad del sistema.
//             5. Si encuentras algún problema, proporciona recomendaciones para mejorarlo.

export const RunAgentDashboard = async (dataDashboard: string, questionUser: string) => {

    try {
        const response = await run(
            dashboardAviancaAgent,
            `
            la pregunta del usuario es: ${questionUser}
            Responde la pregunta del usuario con los datos que te proporciono responde las preguntas del usuario de manera clara y consisa.
            Aquí están los datos del dashboard:
            ${JSON.stringify(dataDashboard)}            
            Asegúrate de ser específico y detallar los puntos más importantes según los datos proporcionados.`,
            {
                stream: true
            }
        );

        return response;
    }
    catch (error) {
        console.error("Ha ocurrido un error al llamar agent ai: ", error)
        throw error;
    }
}
