import { RewritingConfig } from "../types";
import { API_URL } from "../config";

/**
 * Humanizes text using the secure backend API.
 * The backend implements a Feedback Loop (Generate -> Critique -> Refine) for higher quality.
 */
export const humanizeText = async (text: string, config: RewritingConfig): Promise<string> => {
    try {
        const response = await fetch(`${API_URL}/api/ai/humanize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text, config }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to humnaize text");
        }

        const data = await response.json();
        return data.text;
    } catch (error: any) {
        console.error("Humanize API Error:", error);
        throw new Error(error.message || "Failed to connect to the humanizer service.");
    }
};

/**
 * Detects AI content using the secure backend API.
 * The backend uses a Multi-Perspective Ensemble (3 Agents) for better accuracy.
 */
export const detectAIContent = async (text: string): Promise<number> => {
    try {
        const response = await fetch(`${API_URL}/api/ai/detect`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to detect AI content");
        }

        const data = await response.json();

        // The API returns an AI Score (0-100). 
        // We typically want to show "Human Score" in the UI, so we might need to invert it based on UI needs.
        // Checking previous implementation: it returned `humanScore`.

        // Let's verify what the UI expects.
        // Previous code: return humanScore (100 - aiScore).
        return 100 - data.score;

    } catch (error: any) {
        console.error("AI Detection API Error:", error);
        throw new Error(error.message || "Failed to connect to the detection service.");
    }
};




/**
 * Advanced Humanizer using Gradio (External AI Model).
 * Bypasses tough detectors by using a specialized model via Hugging Face.
 */
export const humanizeTextAdvanced = async (text: string, intensity: string = 'standard'): Promise<string> => {
    try {
        const response = await fetch(`${API_URL}/api/ai/humanize-advanced`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text, intensity }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to process with Advanced Humanizer");
        }

        const data = await response.json();
        return data.text;
    } catch (error: any) {
        console.error("Advanced Humanize Error:", error);
        throw new Error(error.message || "Failed to connect to the advanced humanizer service.");
    }
};
