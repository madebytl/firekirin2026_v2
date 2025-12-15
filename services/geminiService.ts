import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const generatePitBossResponse = async (
  history: { role: string; text: string }[],
  playerAction: string,
  currentBalance: number
): Promise<string> => {
  const ai = getClient();
  if (!ai) return "CONNECTING TO NETWORK...";

  try {
    // Use gemini-2.5-flash with Google Search grounding
    const model = "gemini-2.5-flash";
    const systemInstruction = `
      You are the "Fire Kirin Pit Boss", an energetic, hype-man AI host for a casino arcade app.
      Your personality: Loud, superstitious, encouraging, slightly edgy, uses arcade slang.
      Your goal: Keep the player engaged, celebrate their wins, encourage them when they lose (but responsibly), and give "lucky tips".
      Current Player Balance: ${currentBalance} coins.
      
      If the user asks about real-world events, news, or facts, use your search tool to get the answer.
      Keep responses short (under 2 sentences) and punchy. Use emojis.
    `;

    // History formatting
    const formattedHistory = history.map(h => ({
      role: h.role === 'model' ? 'model' : 'user',
      parts: [{ text: h.text }]
    }));

    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction,
        temperature: 1.2,
        tools: [{ googleSearch: {} }], // Enable Search Grounding
      },
      history: formattedHistory
    });

    const response = await chat.sendMessage({ message: playerAction });
    
    // Extract text
    let text = response.text || "";

    // Extract grounding metadata (Sources)
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
        const sources = chunks
            .map((c: any) => c.web?.uri)
            .filter((uri: string) => uri)
            .map((uri: string, i: number) => `[${i+1}] ${uri}`)
            .join('\n');
        
        if (sources) {
            text += `\n\nSources:\n${sources}`;
        }
    }

    return text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "SYSTEM OFFLINE: REBOOTING LUCK MODULE...";
  }
};

export const generateCasinoImage = async (prompt: string, size: '1K' | '2K' | '4K'): Promise<string | null> => {
    const ai = getClient();
    if (!ai) throw new Error("API Key missing");

    try {
        // Gemini 3 Pro Image for high quality generation
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: {
                parts: [{ text: prompt }]
            },
            config: {
                imageConfig: {
                    imageSize: size,
                    aspectRatio: "1:1" // Square for profile/icon style
                }
            }
        });

        // Extract image
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (e) {
        console.error("Image Gen Error", e);
        throw e;
    }
};

export const editCasinoImage = async (base64Image: string, prompt: string): Promise<string | null> => {
    const ai = getClient();
    if (!ai) throw new Error("API Key missing");

    try {
        // Strip prefix if present for the API call
        const base64Data = base64Image.split(',')[1] || base64Image;

        // Gemini 2.5 Flash Image for editing/multimodal tasks
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType: 'image/png',
                            data: base64Data
                        }
                    },
                    { text: prompt }
                ]
            }
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (e) {
        console.error("Image Edit Error", e);
        throw e;
    }
};
