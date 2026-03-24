
import { GoogleGenAI, Content } from "@google/genai";
import { ChatMessage, Language } from "../types";

const API_KEY = process.env.API_KEY;

export const generateAssistantResponse = async (
  message: string,
  history: ChatMessage[],
  lang: Language
) => {
  if (!API_KEY) {
    return "API Key not configured.";
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const model = "gemini-3-flash-preview";

  const systemInstruction = `
    You are a friendly, modern, and spiritually wise assistant for "Church Without Walls" (Biserica Fără Ziduri / Церковь Без Стен) in Chișinău, Moldova.
    Your tone should be welcoming, inclusive, and non-judgmental.
    The church values: Community, Authentic Faith, Serving Chișinău, and Living without "walls" (meaning openness to all and influence beyond the building).
    Location: Strada Carierei, MD-2024, Chișinău, Moldova.
    Phone: +94 76 372 5520.
    Services: Sunday 10:00 AM and 12:00 PM.
    Language: Please respond in ${lang === 'ru' ? 'Russian' : 'Romanian'}.
    If asked about deep theology, provide balanced biblical perspectives but always encourage visiting a service for deeper conversation.
  `;

  try {
    // FIX: Convert message history to the format expected by the Gemini API.
    const geminiHistory: Content[] = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    }));

    const chat = ai.chats.create({
      model,
      // FIX: Pass the conversation history to the model to make the chat stateful.
      history: geminiHistory,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const response = await chat.sendMessage({ message });
    return response.text || "I'm sorry, I couldn't process that.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The assistant is currently contemplating. Please try again in a moment.";
  }
};
