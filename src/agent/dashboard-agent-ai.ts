import { Agent } from '@openai/agents';

const downloadReportAviancaAgent = new Agent({
    name: "download_report_dashboard_avianca_playwright",
    instructions: "Accede al dashboard de la aplicación web Avianca, navega hasta la sección de reportes generales y ejecuta la acción necesaria para descargar el reporte completo en el formato disponible (por ejemplo, .csv, .xlsx o .pdf). Asegúrate de esperar a que la descarga finalice correctamente y verifica que el archivo se haya guardado exitosamente."
});

const resumeDashboardAviancaAgent = new Agent({
    name: "resume_dashboard_avianca_playwright",
    instructions: "Accede al dashboard de la aplicación web Avianca y analiza todos los indicadores disponibles, incluyendo métricas clave de rendimiento y datos relevantes. Extrae también la información de la tabla de workflows de GitHub integrada en el dashboard. Con base en estos datos, genera un resumen claro y conciso que destaque los principales hallazgos, tendencias y posibles áreas de mejora. El resumen debe ser comprensible y estructurado para su revisión por parte del equipo."
});

const recomendationsDashboardAviancaAgent = new Agent({
    name: "recomendations_dashboard_avianca_playwright",
    instructions: "Accede al dashboard de la aplicación web Avianca y analiza todos los indicadores disponibles, incluyendo métricas clave de rendimiento y datos relevantes. Extrae también la información de la tabla de workflows de GitHub integrada en el dashboard. Con base en estos datos, genera recomendaciones de manera claro y conciso que destaque los principales hallazgos, tendencias y posibles áreas de mejora. El resumen debe ser comprensible y estructurado para su revisión por parte del equipo."
});

const dashboardAviancaAgent = Agent.create({
    name: 'dashboard_avianca_playwright',
    instructions: `Eres un asistente especializado en pruebas automatizadas con Playwright y CI/CD en GitHub.
    Tu tarea es analizar indicadores, interpretar resultados de workflows, detectar tendencias de fallos, generar resúmenes útiles y responder preguntas sobre los datos del dashboard.
    Usa un lenguaje claro y técnico cuando sea necesario.`,
    handoffs: [downloadReportAviancaAgent, resumeDashboardAviancaAgent, recomendationsDashboardAviancaAgent]
});