import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export const getGeminiResponse = async (prompt: string, history: any[] = []) => {
  try {
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables.");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    // Filter and format history to ensure it starts with 'user' and alternates roles
    const formattedHistory = history
      .filter(msg => msg.role === "user" || msg.role === "model")
      .map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

    // Gemini requires history to start with a 'user' message
    // If the first message is from 'model', we skip it for the API call
    if (formattedHistory.length > 0 && formattedHistory[0].role === "model") {
      formattedHistory.shift();
    }

    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateContent = async (prompt: string) => {
  try {
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables.");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Gemini Content Generation Error:", error);
    throw error;
  }
};
