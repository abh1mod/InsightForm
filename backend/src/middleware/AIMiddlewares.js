import { GoogleGenAI, Type } from "@google/genai";

// Initialize GoogleGenAI client, gemini api key will be automatically picked up from env file
const ai = new GoogleGenAI({});

const questionSuggestionPrompt = (objective, neededQuestionData) => {
    const text = `
                    Objective:
                    ${objective}

                    Existing Questions (for context, do not repeat these):
                    ${JSON.stringify(neededQuestionData, null, 2)}

                    Task:
                    Based on the objective and existing questions, suggest 3 new, relevant, and distinct questions to add to the form.
        `;
    return text;
}

const questionSuggestionResponseSchema = {
            type: Type.OBJECT,
            properties: {
            suggestions: {
                type: Type.ARRAY,
                description: "An array of suggested questions.",
                items: {
                type: Type.OBJECT,
                properties: {
                    questionType: {
                    type: Type.STRING,
                    description: "The type of question.",
                    enum: ['text', 'mcq', 'rating'] // Enforce specific values
                    },
                    questionText: {
                    type: Type.STRING,
                    description: "The full text of the question."
                    },
                    options: {
                    type: Type.ARRAY,
                    description: "An array of string options for MCQ. Must be empty for other types.",
                    items: {
                        type: Type.STRING
                    }
                    }
                },
                required: ["questionType", "questionText", "options"]
                }
            }
            },
            required: ["suggestions"]
        };

const callAI = async (prompt, responseSchema) =>{
    try {
        const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema
        },
      });
      return response;
    } catch (error) {
        throw new Error("AI service error: " + error.message);
    }
}
        
export { questionSuggestionPrompt, questionSuggestionResponseSchema, callAI };