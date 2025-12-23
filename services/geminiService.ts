
import { GoogleGenAI, Type } from "@google/genai";
import { StudyPlan, IssueCategory, WellnessTip } from "../types";

// Always use the API key exclusively from process.env.API_KEY as a direct property
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStudyPlan = async (subject: string, time: string): Promise<StudyPlan> => {
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
  // Use .text property directly
  return JSON.parse(response.text || '{}');
};

export const categorizeIssue = async (title: string, description: string): Promise<{ category: IssueCategory; routing: string }> => {
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
  // Use .text property directly
  return JSON.parse(response.text || '{}');
};

export const getWellnessTips = async (stressLevel: number, query?: string): Promise<WellnessTip[]> => {
  const prompt = query 
    ? `Provide 3 wellness tips for a student facing this specific problem: "${query}". Current stress: ${stressLevel}/10.`
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
  // Use .text property directly
  return JSON.parse(response.text || '[]');
};

export const solveDoubt = async (doubt: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are an AI Tutor for students. Explain the following doubt in extremely easy language that a 10-year-old could understand. 
    
    CRITICAL RULES:
    1. Be very concise.
    2. DO NOT use hashtags (#).
    3. DO NOT use asterisks (*) for bolding or lists.
    4. If you need a list, use plain numbers (1. 2.) or simple dashes (-).
    5. No markdown formatting symbols should be visible in your text.
    
    Doubt: ${doubt}`,
    config: {
      temperature: 0.3, // Lower temperature for more focused, simpler answers
    },
  });
  
  // Post-process to remove any stray markdown symbols just in case
  // Access the .text property as a string as per guidelines
  return (response.text || "I couldn't find an answer. Try rephrasing.")
    .replace(/[#*]/g, '');
};
