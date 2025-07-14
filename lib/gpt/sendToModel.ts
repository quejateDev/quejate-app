import { openai } from "../openai";

export async function sendToGPT(prompt: string, errorMessage = "Error generando el contenido"): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 35000);

  try {
    const chatCompletion = await openai.chat.completions.create(
      {
        model: "gpt-4o-2024-11-20",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      },
      {
        signal: controller.signal,
      }
    );

    return chatCompletion.choices[0]?.message?.content || errorMessage;
  } catch (error: any) {
    console.error("[GPT_GENERATE_ERROR]", error?.response?.data || error?.message || error);
    return errorMessage;
  } finally {
    clearTimeout(timeoutId);
  }
}
