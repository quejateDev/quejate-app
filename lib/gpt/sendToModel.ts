import { openai } from "../openai";


export async function sendToGPT(prompt: string): Promise<string> {
  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
  });

  return chatCompletion.choices[0]?.message?.content || "Error generando la tutela";
}
