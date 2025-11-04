
import { GoogleGenAI, Type } from "@google/genai";
import type { Project } from "../types";

// This is a placeholder for the actual API key which should be set in environment variables
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd handle this more gracefully, but for this example, we'll throw an error.
  console.warn("API_KEY for Gemini is not set in environment variables. Using a mock response.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export interface AIProjectMatch {
    projectId: string;
    reasoning: string;
    matchScore: number;
}

const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        projectId: {
          type: Type.STRING,
          description: "The unique ID of the matched project.",
        },
        reasoning: {
          type: Type.STRING,
          description: "A detailed explanation of why this project is an excellent match for the user, highlighting skill alignment and potential for growth.",
        },
        matchScore: {
            type: Type.NUMBER,
            description: "A score from 0 to 100 indicating the quality of the match."
        }
      },
      required: ["projectId", "reasoning", "matchScore"],
    },
};


export const findMatchingProjects = async (
  userDescription: string,
  projects: Project[]
): Promise<AIProjectMatch[]> => {
  if (!ai) {
    // Mock response for development without an API key
    console.log("Using mock Gemini response.");
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    return [
        { projectId: 'p1', reasoning: "This project is a perfect match because you mentioned experience with mobile development and Firebase, which are the core technologies required. It also aligns with your interest in social impact apps.", matchScore: 95 },
        { projectId: 'p2', reasoning: "Your skills in React and UI/UX design are highly relevant for this website revamp. This project would be a great way to apply your design skills to a high-impact platform.", matchScore: 85 }
    ];
  }

  const projectSummaries = projects.map(p => ({
    id: p.id,
    title: p.title,
    summary: p.summary,
    requiredSkills: p.requiredSkills,
  }));

  const prompt = `
    You are an expert career advisor for university students in tech and design. Your task is to connect a student with the most suitable volunteer projects at Czech non-profits.

    Here is the student's profile and interests:
    ---
    ${userDescription}
    ---

    Here is a list of available projects in JSON format:
    ---
    ${JSON.stringify(projectSummaries, null, 2)}
    ---

    Based on the student's profile, identify the TOP 2-3 projects that are the best fit. For each recommendation, provide a compelling reason why it's a good match, linking their skills and interests directly to the project's requirements and goals. Provide a match score from 0 to 100.

    Return your response as a JSON array that strictly adheres to the provided schema. Do not include any other text or markdown formatting.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const responseText = response.text.trim();
    // The response should be a JSON string, so we parse it.
    const matches: AIProjectMatch[] = JSON.parse(responseText);
    return matches;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get project matches from AI.");
  }
};