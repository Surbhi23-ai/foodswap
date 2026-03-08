import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error(
    "Missing OPENAI_API_KEY. Add it to your .env.local file."
  );
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const NUTRITION_SYSTEM_PROMPT = `
You are FoodSwap AI, an expert nutrition assistant.
Your responsibilities:
- Provide accurate nutrition data per 100g for any food item.
- Classify foods as Safe, Moderate, or Avoid based on health impact.
- Suggest 3 realistic, healthier alternative foods with reasons.
- Answer diet and nutrition questions clearly and concisely.
- Always return valid JSON when asked for structured data.
Do not include markdown in JSON responses.
`.trim();

export async function analyzeFoodByName(foodName: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: NUTRITION_SYSTEM_PROMPT },
      {
        role: "user",
        content: `
Analyze the food item: "${foodName}".

Return a JSON object with this exact shape:
{
  "name": string,
  "healthLabel": "Safe" | "Moderate" | "Avoid",
  "explanation": string,
  "nutrition": {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number,
    "fiber": number,
    "sugar": number
  },
  "alternatives": [
    {
      "name": string,
      "reason": string,
      "healthLabel": "Safe" | "Moderate" | "Avoid",
      "nutrition": {
        "calories": number,
        "protein": number,
        "carbs": number,
        "fat": number
      }
    }
  ]
}
        `.trim(),
      },
    ],
  });

  const content = completion.choices[0].message.content;
  if (!content) throw new Error("Empty response from OpenAI.");
  return JSON.parse(content);
}

export async function analyzeFoodImage(base64Image: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: NUTRITION_SYSTEM_PROMPT },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `
Identify the food in this image and analyze it.

Return a JSON object with this exact shape:
{
  "name": string,
  "healthLabel": "Safe" | "Moderate" | "Avoid",
  "explanation": string,
  "nutrition": {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number,
    "fiber": number,
    "sugar": number
  },
  "alternatives": [
    {
      "name": string,
      "reason": string,
      "healthLabel": "Safe" | "Moderate" | "Avoid",
      "nutrition": {
        "calories": number,
        "protein": number,
        "carbs": number,
        "fat": number
      }
    }
  ]
}
            `.trim(),
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
              detail: "low",
            },
          },
        ],
      },
    ],
  });

  const content = completion.choices[0].message.content;
  if (!content) throw new Error("Empty response from OpenAI.");
  return JSON.parse(content);
}

export async function chatWithNutritionAI(
  message: string,
  history: Array<{ role: "user" | "assistant"; content: string }>
) {
  const recentHistory = history.slice(-10);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 700,
    temperature: 0.7,
    messages: [
      { role: "system", content: NUTRITION_SYSTEM_PROMPT },
      ...recentHistory,
      { role: "user", content: message },
    ],
  });

  const content = completion.choices[0].message.content;
  if (!content) throw new Error("Empty response from OpenAI.");
  return content;
}
