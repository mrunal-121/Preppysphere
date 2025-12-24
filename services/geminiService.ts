
import { GoogleGenAI, Type } from "@google/genai";
import { StudyPlan, IssueCategory, WellnessTip } from "../types";

// The API key is injected via vite.config.ts from process.env.API_KEY
const API_KEY = process.env.API_KEY;

export const getWellnessTips = async (stressLevel: number, query?: string): Promise<WellnessTip[]> => {
  if (!API_KEY || API_KEY === 'undefined') {
    throw new Error("API_KEY_MISSING");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
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
  
  const text = response.text || '[]';
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error("INVALID_AI_RESPONSE");
  }
};

export const generateStudyPlan = async (subject: string, time: string): Promise<StudyPlan> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
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
};

export const categorizeIssue = async (title: string, description: string): Promise<{ category: IssueCategory; routing: string }> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this campus issue: Title: "${title}", Description: "${description}". Categorize it and suggest which department/club (e.g., Campus Maintenance, Student Union, Dean of Academics, etc.) should handle it.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: { 
            type: Type.STRING, 
            enum: Object.values(IssueCategory) 
          },
          routing: { type: Type.STRING },
        },
        required: ["category", "routing"],
      },
    },
  });
  return JSON.parse(response.text || '{}');
};

export const solveDoubt = async (doubt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are an AI Tutor for students. Explain the following doubt in extremely easy language that a 10-year-old could understand. Doubt: ${doubt}`,
    config: { temperature: 0.3 },
  });
  return (response.text || "I couldn't find an answer.").replace(/[#*]/g, '');
};
