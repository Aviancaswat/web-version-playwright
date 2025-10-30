export const extractRelevantLogs = (fullLogs: string, options?: {
    errorContext?: number; // Líneas antes y después del error
    includeErrors?: boolean;
    includeWarnings?: boolean;
    maxLines?: number;
}): string => {
    const {
        errorContext = 20,
        includeErrors = true,
        includeWarnings = true,
        maxLines = 200
    } = options || {};

    const lines = fullLogs.split('\n');
    const relevantLines: string[] = [];

    // Buscar líneas con errores o warnings
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lowerLine = line.toLowerCase();

        // Detectar errores
        if (includeErrors && (
            lowerLine.includes('error') ||
            lowerLine.includes('failed') ||
            lowerLine.includes('##[error]') ||
            lowerLine.includes('exception')
        )) {
            // Agregar contexto antes del error
            const start = Math.max(0, i - errorContext);
            const end = Math.min(lines.length, i + errorContext + 1);

            for (let j = start; j < end; j++) {
                if (!relevantLines.includes(lines[j])) {
                    relevantLines.push(lines[j]);
                }
            }
        }

        // Detectar warnings si está habilitado
        if (includeWarnings && (
            lowerLine.includes('warning') ||
            lowerLine.includes('warn')
        )) {
            relevantLines.push(line);
        }
    }

    // Si no se encontraron errores, tomar las últimas N líneas
    if (relevantLines.length === 0) {
        return lines.slice(-maxLines).join('\n');
    }

    // Limitar el número de líneas
    return relevantLines.slice(0, maxLines).join('\n');
}