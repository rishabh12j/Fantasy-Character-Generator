import { GoogleGenAI, Type } from "@google/genai";
import { Character } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCharacter = async (): Promise<Character> => {
  const model = "gemini-3-flash-preview";
  
  const schema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "The unique name of the character" },
      title: { type: Type.STRING, description: "An epic title, e.g., 'The Firewalker'" },
      characterClass: { type: Type.STRING, description: "Class like Mage, Rogue, Paladin, etc." },
      race: { type: Type.STRING, description: "Race like Human, Elf, Dwarf, Orc, etc." },
      alignment: { type: Type.STRING, description: "D&D style alignment, e.g., Chaotic Good" },
      bio: { type: Type.STRING, description: "A short, engaging backstory (max 2 sentences)." },
      skills: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "2 unique skills or spells" 
      },
      tcgStats: {
        type: Type.OBJECT,
        properties: {
          health: { type: Type.INTEGER, description: "Health points (1-50)" },
          mana: { type: Type.INTEGER, description: "Mana/Energy points (1-50)" },
          strength: { type: Type.INTEGER, description: "Attack strength (1-20)" },
        },
        required: ["health", "mana", "strength"]
      }
    },
    required: ["name", "characterClass", "race", "bio", "tcgStats", "title", "alignment", "skills"]
  };

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: "Generate a unique fantasy TCG card character. Stats should be balanced for a trading card game.",
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 1.1, 
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response generated");
    }

    const data = JSON.parse(text);
    return {
        ...data,
        id: crypto.randomUUID()
    } as Character;
  } catch (error) {
    console.error("Failed to generate character:", error);
    throw error;
  }
};

export const generateCharacterPortrait = async (character: Character): Promise<string> => {
  const prompt = `Fantasy trading card illustration. 
  Subject: ${character.name}, a ${character.race} ${character.characterClass}.
  Appearance: ${character.bio}
  Style: High fantasy digital art, dynamic lighting, detailed background. Aspect ratio 4:3.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        // responseMimeType is not supported for nano banana series models
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData && part.inlineData.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Failed to generate character portrait:", error);
    throw error;
  }
};

export const generateBackstory = async (character: Character): Promise<string> => {
  const model = "gemini-3-flash-preview";
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: `Rewrite the flavor text/backstory for this TCG card character. 
      Name: ${character.name}
      Class: ${character.characterClass}
      Keep it short, punchy, and atmospheric (max 2 sentences).`,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Failed to generate backstory:", error);
    throw error;
  }
};