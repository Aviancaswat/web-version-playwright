export type AIMessage = {
  role: "user" | "assistant";
  content: string;
};


export async function sendMessageToAI(
  messages: AIMessage[]
): Promise<string> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages,
    }),
  });

  if (!response.ok) {
    throw new Error("Error llamando a la IA");
  }

  const data = await response.json();
  return data.message; // <-- respuesta del bot
}
