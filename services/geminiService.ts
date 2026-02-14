
import { GoogleGenAI, Type } from "@google/genai";
import { StudyPlan, IssueCategory, WellnessTip, SmartNotification } from "../types";

const getApiKey = () => {
  return process.env.API_KEY || '';
};

const handleApiError = (error: any): string => {
  const message = error?.message?.toLowerCase() || '';
  if (message.includes('401') || message.includes('api_key_invalid')) return "INVALID_KEY";
  if (message.includes('429')) return "RATE_LIMIT";
  if (message.includes('500')) return "SERVER_ERROR";
  if (message.includes('403')) return "PERMISSION_DENIED";
  if (!navigator.onLine) return "OFFLINE";
  return "UNKNOWN_ERROR";
};

export const getSmartPulse = async (userData: {
  tasks: any[],
  formalities: any[],
  stressLevel: number,
  streak: number
}): Promise<SmartNotification[]> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API_KEY_MISSING");

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const prompt = `
      Act as a proactive AI Student Mentor. Analyze the current student state:
      - Goals Completed: ${userData.tasks.filter(t => t.completed).length}/${userData.tasks.length}
      - Campus Deadlines: ${userData.formalities.length} total
      - Stress Level: ${userData.stressLevel}/10
      - Day Streak: ${userData.streak}
      
      Generate 2-3 "Smart Notifications" that are contextual. 
      If stress is high (>7), focus on health. 
      If goal completion is low (<30%), focus on productivity nudges. 
      If there are formality deadlines, mention them.
      Keep titles short and messages very punchy (max 15 words).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, enum: ['deadline', 'productivity', 'stress', 'motivation'] },
              title: { type: Type.STRING },
              message: { type: Type.STRING },
              priority: { type: Type.STRING, enum: ['high', 'medium', 'low'] },
              actionLabel: { type: Type.STRING },
              targetView: { type: Type.STRING },
            },
            required: ["type", "title", "message", "priority"],
          },
        },
      },
    });
    
    const raw = JSON.parse(response.text || '[]');
    return raw.map((n: any, i: number) => ({
      ...n,
      id: `sn-${Date.now()}-${i}`,
      timestamp: Date.now(),
      isRead: false
    }));
  } catch (e) {
    console.error("Pulse error:", e);
    return []; // Return empty on error to avoid breaking UI
  }
};

export const getWellnessTips = async (stressLevel: number, query?: string): Promise<WellnessTip[]> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API_KEY_MISSING");

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const prompt = query 
      ? `Provide 3 wellness tips for a student facing this specific problem: "${query}". Current stress: ${stressLevel}/10. Keep the advice practical and empathetic.`
      : `Provide 3 wellness tips for a student with a stress level of ${stressLevel}/10.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING, enum: ['mental', 'physical', 'social'] },
              tip: { type: Type.STRING },
              action: { type: Type.STRING },
            },
            required: ["category", "tip", "action"],
          },
        },
      },
    });
    
    return JSON.parse(response.text || '[]');
  } catch (e) {
    throw new Error(handleApiError(e));
  }
};

export const generateStudyPlan = async (subject: string, time: string): Promise<StudyPlan> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API_KEY_MISSING");

  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a study plan for ${subject} for a duration of ${time}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            duration: { type: Type.STRING },
            tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
            tips: { type: Type.STRING },
          },
          required: ["subject", "duration", "tasks", "tips"],
        },
      },
    });
    return JSON.parse(response.text || '{}');
  } catch (e) {
    throw new Error(handleApiError(e));
  }
};

export const categorizeIssue = async (title: string, description: string): Promise<{ category: IssueCategory; routing: string }> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API_KEY_MISSING");

  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this campus issue: Title: "${title}", Description: "${description}". Categorize it and suggest routing.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, enum: Object.values(IssueCategory) },
            routing: { type: Type.STRING },
          },
          required: ["category", "routing"],
        },
      },
    });
    return JSON.parse(response.text || '{}');
  } catch (e) {
    throw new Error(handleApiError(e));
  }
};

export const solveDoubt = async (doubt: string): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API_KEY_MISSING");

  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: doubt,
      config: { 
        temperature: 0.3,
        systemInstruction: "You are a clear and concise AI Tutor. Explain concepts in very simple language suitable for a tired student. Avoid unnecessary theory, complex formulas, and all mathematical symbols. Do not use bold (**) or headers (#). Provide only short, practical examples from daily life. Keep answers brief and easy to read. Use plain text only."
      },
    });
    return (response.text || "I'm sorry, I couldn't process that. Try rephrasing?").replace(/[#*\\$]/g, '');
  } catch (e) {
    throw new Error(handleApiError(e));
  }
};
