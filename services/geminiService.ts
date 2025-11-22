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
          description: "A detailed explanation of why this project is an excellent match for the user, highlighting skill alignment and potential for growth. Must be in Czech.",
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
        { projectId: 'p1', reasoning: "Tento projekt je perfektní shodou, protože jste zmínila zkušenosti s mobilním vývojem a Firebase, což jsou klíčové technologie. Také to odpovídá vašemu zájmu o aplikace se sociálním dopadem.", matchScore: 95 },
        { projectId: 'p2', reasoning: "Vaše dovednosti v Reactu a UI/UX designu jsou vysoce relevantní pro tento redesign webu. Tento projekt by byl skvělým způsobem, jak uplatnit vaše designérské schopnosti na platformě s velkým dopadem.", matchScore: 85 }
    ];
  }

  const projectSummaries = projects.map(p => ({
    id: p.id,
    title: p.title,
    summary: p.summary,
    requiredSkills: p.requiredSkills,
  }));

  const prompt = `
    Jsi expertní kariérní poradce pro univerzitní studenty v oboru technologií a designu. Tvým úkolem je propojit studenta s nejvhodnějšími dobrovolnickými projekty v českých neziskových organizacích.

    Zde je profil a zájmy studenta:
    ---
    ${userDescription}
    ---

    Zde je seznam dostupných projektů ve formátu JSON:
    ---
    ${JSON.stringify(projectSummaries, null, 2)}
    ---

    Na základě profilu studenta identifikuj TOP 2-3 projekty, které se nejlépe hodí. Pro každé doporučení poskytni přesvědčivý důvod (v češtině), proč je to dobrá shoda, a propoj jejich dovednosti a zájmy přímo s požadavky a cíli projektu. Uveď skóre shody od 0 do 100.

    Odpověď vrať jako pole JSON, které striktně dodržuje poskytnuté schéma. Nevkládej žádný jiný text ani markdown formátování. Odpovídej pouze v českém jazyce.
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
