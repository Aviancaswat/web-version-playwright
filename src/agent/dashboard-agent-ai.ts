
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

export const RunAgentDashboard = async (fetch_user: string) => {
    try {
        const response = run(dashboardAviancaAgent, fetch_user)
        return response;
    }
    catch (error) {
        console.error("Ha ocurrido un error al llamar agent ai: ", error)
        throw error;
    }
}
