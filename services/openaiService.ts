import OpenAI from 'openai';
import { RewritingConfig, Tone } from "../types";

// Initialize OpenAI Client
// Note: dangerouslyAllowBrowser is required for client-side usage. 
// In a production environment, API calls should be routed through a backend to protect the API key.
const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

export const humanizeText = async (text: string, config: RewritingConfig): Promise<string> => {
    // Use 'gpt-4o' for best quality, or fallback to 'gpt-3.5-turbo' if needed.
    const modelId = 'gpt-4o';

    let prompt = "";

    // ULTRA-AGGRESSIVE Anti-Detection System Instruction (Preserved from GeminiService)
    const baseInstruction = `You are an expert human ghostwriter and editor. Your SINGLE objective is to rewrite the provided text to completely bypass AI detection systems like ZeroGPT, Turnitin, and GPTZero.

  AI detectors look for:
  1. Low Perplexity (predictable word choices)
  2. Low Burstiness (consistent sentence lengths)
  3. Specific "AI" vocabulary (e.g., "delve", "moreover")

  YOUR INSTRUCTIONS TO BEAT THEM:
  1. **Disrupt Rhythm (High Burstiness)**: You MUST vary sentence structures aggressively. Alternate between very short, punchy sentences (2-5 words) and longer, complex, flowing sentences. Never write three sentences of the same length in a row.
  2. **Vocabulary Shift (High Perplexity)**: Do not use the most statistically probable words. Use more colorful, specific, or casual language depending on the tone. Avoid the "safe" choice.
  3. **Remove AI Markers**: STRICTLY FORBIDDEN words/phrases: "delve", "tapestry", "landscape", "testament", "underscore", "harness", "leverage", "crucial", "pivotal", "in conclusion", "furthermore", "moreover", "it is important to note", "nuance", "realm", "foster", "myriad".
  4. **Structure**: Do not use standard 5-paragraph essay structure unless requested. Avoid "topic sentence -> explanation -> transition" loops.
  5. **Voice**: Use active voice. Be direct. Use contractions (don't, won't, it's) to sound natural. Start sentences with conjunctions (And, But, So) to mimic human thought patterns.

  PRESERVE MEANING: Keep the original message and facts 100% intact, but completely overhaul the syntax and word choice.
  `;

    let specificInstruction = "";

    switch (config.mode) {
        case 'shorten':
            specificInstruction = `Constraint: Make the output concise and punchy. Cut fluff. Aim for a 30% reduction in word count while retaining impact.`;
            break;
        case 'expand':
            specificInstruction = `Constraint: Add depth, specific examples, and natural elaboration. Connect ideas with unique transitions, not formulaic ones.`;
            break;
        case 'simplify':
            specificInstruction = `Constraint: Write like you are explaining it to a friend. Use simple vocabulary (Grade 8 reading level) but keep the sentence structure varied and interesting.`;
            break;
        case 'humanize':
        default:
            specificInstruction = `Constraint: Focus purely on making this undetectable as AI. Maximize sentence variation. Make it sound like a real person wrote it with conviction.`;
            break;
    }

    const systemPrompt = `${baseInstruction}\n\n${specificInstruction}\n\nTarget Tone: ${config.tone}`;

    try {
        const response = await openai.chat.completions.create({
            model: modelId,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Input Text to Humanize:\n"${text}"\n\nReturn ONLY the rewritten text. Do not add introductory or concluding remarks.` }
            ],
            temperature: 1.0, // Increased temperature for higher perplexity (randomness)
            top_p: 0.95,      // High quality generation
        });

        return response.choices[0]?.message?.content || "Failed to generate text. Please try again.";
    } catch (error) {
        console.error("OpenAI API Error:", error);
        throw new Error("Failed to connect to the AI service. Please check your connection or API key.");
    }
};

export const detectAIContent = async (text: string): Promise<number> => {
    // Mock simulation of AI detection analysis
    // In a real app, you would call an external API like GPTZero or CopyLeaks here.

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Logic to simulate "Real" detection based on text characteristics
    const length = text.length;

    // If text is very short, it's harder to detect, usually gets a middle score
    if (length < 50) return 50;

    // Return a randomized score that generally leans towards "AI" (0-50% human)
    // to encourage the user to use the Humanize button.
    // Weighted to mostly show ~20-40% human (High AI detection)
    const baseScore = Math.floor(Math.random() * 40) + 10;

    return baseScore;
};
