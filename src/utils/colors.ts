export const getColor = (): string[] => {
    const colors = [["orange.100", "orange.600"], ["cyan.100", "blue.600"]]
    const colorRandom = colors[Math.floor(Math.random() * colors.length)];
    return colorRandom;
}