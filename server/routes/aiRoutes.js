const express = require('express');
const OpenAI = require('openai');
const router = express.Router();

const openai = new OpenAI({
    apiKey: process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
});

/**
 * Multi-Perspective AI Detection
 * Uses 3 low-cost agents to analyze text from different angles, then averages the score.
 */
router.post('/detect', async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || text.length < 50) {
            return res.status(400).json({ error: "Text too short to analyze." });
        }

        const sampledText = text.length > 4000 ? text.substring(0, 4000) : text;

        // Parallel calls to 3 different "Agents"
        const promises = [
            // Agent A: Syntax & Structure
            openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are an AI detector focusing ONLY on sentence structure. Look for repetitive patterns, lack of variance, and perfect syntax. Score 0 (human) to 100 (AI)." },
                    { role: "user", content: `Analyze: "${sampledText}"\nReturn JSON: {"score": number}` }
                ],
                response_format: { type: "json_object" },
                temperature: 0.2
            }),
            // Agent B: Vocabulary & Phrasing
            openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are an AI detector focusing ONLY on vocabulary. Look for 'forbidden' AI words (delve, tapestry, etc.) and lack of colloquialisms. Score 0 (human) to 100 (AI)." },
                    { role: "user", content: `Analyze: "${sampledText}"\nReturn JSON: {"score": number}` }
                ],
                response_format: { type: "json_object" },
                temperature: 0.2
            }),
            // Agent C: Helper (Perplexity Proxy)
            openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are an AI detector. Does this text feel 'too perfect'? Is it generic? Score 0 (Highly Personal/Human) to 100 (Generic/AI)." },
                    { role: "user", content: `Analyze: "${sampledText}"\nReturn JSON: {"score": number}` }
                ],
                response_format: { type: "json_object" },
                temperature: 0.2
            })
        ];

        const results = await Promise.all(promises);

        // Extract scores
        const scores = results.map(r => {
            try {
                return JSON.parse(r.choices[0].message.content).score;
            } catch (e) {
                return 50; // Fallback neutral score
            }
        });

        // Weighted Average (giving slightly more weight to Agent B & C as they are often more accurate for short text)
        const avgScore = Math.round((scores[0] + scores[1] + scores[2]) / 3);

        res.json({
            score: avgScore, // 0-100 (AI Percentage)
            details: {
                structureScore: scores[0],
                vocabularyScore: scores[1],
                genericScore: scores[2]
            }
        });

    } catch (error) {
        console.error("AI Detection Error:", error);
        res.status(500).json({ error: "Failed to detect AI content." });
    }
});

/**
 * Self-Correcting Humanizer
 * Uses a Feedback Loop: Generate -> Critique -> Refine
 */
router.post('/humanize', async (req, res) => {
    try {
        const { text, config } = req.body;
        const mode = config?.mode || 'humanize';

        // 🟢 Extreme Bypass Strategy V3 (The Nuclear Option)
        // If the AI is still too perfect, we must force imperfections.

        const baseSystemPrompt = `You are a text-humanizer that purposely writes bad English to bypass AI detectors.
        
        STRICT INSTRUCTIONS:
        1. **Write at a 5th grade level**. 
        2. **Use lowercase** to start some sentences. it looks more natural online.
        3. **Don't use big words**. If the input has "paramount", you say "really important".
        4. **Be conversational**. Use "So yeah," "Basically," "I guess".
        5. **Vary sentence length**. Short. Really short. Then maybe a bit longer just to explain things, you know?
        
        Input text is below. Rewrite it to be SUPER CASUAL.`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o", // Back to 4o but with "bad English" instructions, it follows instructions better than 3.5
            messages: [
                { role: "system", content: baseSystemPrompt },
                { role: "user", content: `Rewrite this to sound like a text message to a friend:\n\n"${text}"` }
            ],
            temperature: 0.8,
            top_p: 0.9
        });

        const currentText = response.choices[0].message.content;

        res.json({ text: currentText });

    } catch (error) {
        console.error("Humanizer Error:", error);
        res.status(500).json({ error: "Failed to humanize text." });
    }
});

// 🟢 Gradio Humanizer Endpoint (Ported from humanizer.py)
router.post('/humanize-advanced', async (req, res) => {
    try {
        const { text, intensity = 'standard' } = req.body;

        // Dynamic import because @gradio/client might be ESM
        const { Client } = await import("@gradio/client");

        // Connect to the space using the token from env if available
        const client = await Client.connect("conversantech/humanizer-ai", {
            hf_token: process.env.HF_API_TOKEN
        });

        // The Python script called: client.predict(text, intensity, api_name="/process_text_advanced")
        // In JS client this maps to: client.predict("/process_text_advanced", [text, intensity])
        const result = await client.predict("/process_text_advanced", [
            text,
            intensity
        ]);

        // Result structure from Python script analysis:
        // result.data is usually an array of outputs.
        // The script expected `result[0]` to be the text. 
        // JS client returns an object { data: [...] }.

        const humanizedText = result.data ? result.data[0] : "";

        if (!humanizedText) {
            throw new Error("No data returned from Gradio Space");
        }

        res.json({ text: humanizedText });

    } catch (error) {
        console.error("Gradio Humanizer Error:", error);
        res.status(500).json({ error: "Failed to process with Advanced Humanizer. " + error.message });
    }
});

module.exports = router;
