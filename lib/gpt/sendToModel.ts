import { openai } from "../openai";

export async function sendToGPT(prompt: string): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);

  try {
    const chatCompletion = await openai.chat.completions.create(
      {
        model: "gpt-4o-mini",
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

    return chatCompletion.choices[0]?.message?.content || "Error generando la tutela";
  } catch (error: any) {
    console.error("[TUTELA_GENERATE_ERROR]", error?.response?.data || error?.message || error);
    return "Error generando la tutela";
  } finally {
    clearTimeout(timeoutId);
  }
}
