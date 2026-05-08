import { GoogleGenAI, Content } from '@google/genai';
import { ChatMessage, Language } from '../types';

const API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY;

const languageName = (lang: Language) => {
  if (lang === 'ru') return 'Russian';
  if (lang === 'ro') return 'Romanian';
  return 'English';
};

export const generateAssistantResponse = async (
  message: string,
  history: ChatMessage[],
  lang: Language
) => {
  if (!API_KEY) {
    if (lang === 'ru') return 'AI-ассистент пока не настроен. Добавьте GEMINI_API_KEY в .env.local.';
    if (lang === 'ro') return 'Asistentul AI nu este configurat inca. Adauga GEMINI_API_KEY in .env.local.';
    return 'The AI assistant is not configured yet. Add GEMINI_API_KEY to .env.local.';
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const model = 'gemini-2.5-flash';

  const systemInstruction = `
    You are a friendly, modern, and spiritually wise assistant for "Church Without Walls" (Biserica Fara Ziduri / Церковь Без Стен) in Chisinau, Moldova.
    Your tone should be welcoming, inclusive, and non-judgmental.
    The church values: community, authentic faith, serving Chisinau, and openness beyond the building.
    Location: Strada Carierei, MD-2024, Chisinau, Moldova.
    Phone: +373 76 372 552.
    Services: Sunday 10:00 AM and 12:00 PM.
    Social links: Facebook https://www.facebook.com/bisericafaraziduri, Instagram https://www.instagram.com/church.without.walls/, YouTube https://www.youtube.com/@Church_Without_Wallsm.
    Language: respond in ${languageName(lang)}.
    If asked about deep theology, provide balanced biblical perspectives and encourage visiting a service for deeper conversation.
  `;

  try {
    const geminiHistory: Content[] = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    }));

    const chat = ai.chats.create({
      model,
      history: geminiHistory,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const response = await chat.sendMessage({ message });
    return response.text || "I'm sorry, I couldn't process that.";
  } catch (error) {
    console.error('Gemini API Error:', error);
    if (lang === 'ru') return 'Ассистент временно недоступен. Попробуйте еще раз чуть позже.';
    if (lang === 'ro') return 'Asistentul este temporar indisponibil. Incearca din nou mai tarziu.';
    return 'The assistant is temporarily unavailable. Please try again later.';
  }
};
