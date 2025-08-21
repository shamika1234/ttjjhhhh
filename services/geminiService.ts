
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { GEMINI_CHAT_MODEL, GEMINI_IMAGE_MODEL } from '../constants';
import { ChatMessage, Role } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
let chat: Chat | null = null;
let currentSystemInstruction: string | null = null;

function getChatHistoryForAPI(history: ChatMessage[]) {
    return history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
    }));
}

export async function* generateChatStream(
    history: ChatMessage[],
    newMessage: string,
    systemInstruction: string
): AsyncGenerator<string> {
    
    // If the system instruction has changed, we need a new chat instance.
    if (!chat || currentSystemInstruction !== systemInstruction) {
        currentSystemInstruction = systemInstruction;
        chat = ai.chats.create({
            model: GEMINI_CHAT_MODEL,
            config: {
                systemInstruction: currentSystemInstruction,
            },
            history: getChatHistoryForAPI(history.slice(0, -1)), // Send history excluding the last user message
        });
    }

    try {
        const responseStream = await chat.sendMessageStream({ message: newMessage });
        for await (const chunk of responseStream) {
            if (chunk.text) {
                yield chunk.text;
            }
        }
    } catch (error) {
        console.error("Error in generateChatStream:", error);
        yield "Sorry, I encountered an error. Please try again.";
    }
}


export const generateImage = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: GEMINI_IMAGE_MODEL,
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated.");
        }
    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Failed to generate image. The model may have refused the prompt.");
    }
};