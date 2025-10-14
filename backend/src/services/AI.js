import { GoogleGenAI, Type } from "@google/genai";

// Initialize GoogleGenAI client, gemini api key will be automatically picked up from env file
const ai = new GoogleGenAI({});

// Function to create the prompt for question suggestions
// It takes the form's objective and existing questions as input
// It returns a structured prompt string that guides the AI to generate relevant questions
const questionSuggestionPrompt = (objective, neededQuestionData) => {
    const text = `
                    Objective:
                    ${objective}

                    Existing Questions (for context, do not repeat these):
                    ${JSON.stringify(neededQuestionData, null, 2)}

                    Task:
                    Based on the objective and existing questions, suggest 3 new, relevant, and distinct questions to add to the form.
        `;
    console.log(text);
    
    return text;
}

// Function to create the prompt for generating summary and suggestions
// It takes the form's objective and pre-processed response data as input
// It returns a structured prompt string that guides the AI to generate a summary and actionable suggestions
const summaryAndSuggestionPrompt = (objective, responseData) => {
    // console.log(responseData);
    
    const text = `
                    Objective:
                    ${objective}
                    
                    Aggregated responses for each question:
                    ${JSON.stringify(responseData, null, 2)}

                    Task:
                    1. Provide a concise summary of the overall responses.
                    2. Suggest 3 to 5 actionable suggestions based on the summarized data.
                    `
    // console.log(text);
    
    return text;
}

// response schema for summary and suggestions
// This schema defines the expected structure of the AI's response
// It ensures that the AI returns a summary and an array of suggestions
// Each suggestion includes a title, detail, and suggestionType
const summaryAndSuggestionResponseSchema = {
    type: Type.OBJECT,
    properties: {
        summary: {
            type: Type.STRING,
            description: "A concise summary of the overall responses."
        },
        suggestions: {
            type: Type.ARRAY,
            description: "An array of actionable suggestions based on the summarized data.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: {
                        type: Type.STRING,
                        description: "A short heading for the suggestion."
                    },
                    detail: {
                        type: Type.STRING,
                        description: "A detailed description of the suggestion."
                    },
                    suggestionType: {
                        type: Type.STRING,
                        description: "The type of suggestion, e.g., 'insight', 'action', 'warning'.",
                        enum: ['insight', 'action', 'warning'] // Enforce specific values
                    }
                },
                required: ["title", "detail", "suggestionType"]
            }
        }
    },
    required: ["summary", "suggestions"]
};

// Define the expected structure of the AI's response for question suggestions
// This schema ensures that the AI returns data in a predictable format
// The response should be a JSON object with a "suggestions" array
// Each suggestion should include "questionType", "questionText", and "options" (if applicable)
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



// Function to call the AI service with a given prompt and response schema
// It uses the Google Gemini API to generate content based on the prompt
// The response is expected to conform to the provided response schema
// The function returns the AI's response, which can then be processed further
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
        
export { questionSuggestionPrompt, questionSuggestionResponseSchema, summaryAndSuggestionPrompt, summaryAndSuggestionResponseSchema, callAI };