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
    } catch (error: any) {
        console.error("OpenAI API Error:", error);
        // Pass through the specific error message helpful for debugging
        const errorMessage = error?.message || error?.toString();

        if (errorMessage.includes('401')) {
            throw new Error("Invalid API Key. Please check your VITE_OPENAI_API_KEY in .env settings.");
        }
        if (errorMessage.includes('insufficient_quota')) {
            throw new Error("You have run out of OpenAI credits. Please check your OpenAI billing.");
        }

        throw new Error(errorMessage || "Failed to connect to the AI service.");
    }
};

/**
 * Generate a simple hash for caching purposes
 */
const simpleHash = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
};

/**
 * Intelligently sample text to reduce token usage while maintaining accuracy
 * For short texts: use full text
 * For medium texts: use first 400 + middle 300 + last 300 chars
 * For long texts: strategic sampling from beginning, middle, and end
 */
const sampleText = (text: string, maxChars: number = 1000): string => {
    if (text.length <= maxChars) {
        return text;
    }

    // For longer texts, sample strategically
    const chunkSize = Math.floor(maxChars / 3);
    const start = text.substring(0, chunkSize);
    const middleStart = Math.floor((text.length - chunkSize) / 2);
    const middle = text.substring(middleStart, middleStart + chunkSize);
    const end = text.substring(text.length - chunkSize);

    return `${start}\n...\n${middle}\n...\n${end}`;
};

/**
 * Real AI Content Detection using OpenAI API
 * Optimized for minimal token usage while maintaining accuracy
 */
export const detectAIContent = async (text: string): Promise<number> => {
    console.log('🔍 AI Detection Started');

    // Validate input
    if (!text || text.trim().length < 20) {
        throw new Error("Text is too short to analyze. Please provide at least 20 characters.");
    }

    // Check if API key is configured
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    console.log('🔑 API Key status:', apiKey ? `Present (${apiKey.substring(0, 7)}...)` : '❌ MISSING');

    if (!apiKey || apiKey === 'undefined' || apiKey === '') {
        console.error('❌ OpenAI API key is not configured!');
        throw new Error("OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your .env file.");
    }

    // Generate cache key (include text snippet for better differentiation)
    const textSnippet = text.substring(0, 50) + text.substring(text.length - 50);
    const cacheKey = `ai_detection_${simpleHash(textSnippet)}_${text.length}`;

    // Check cache first (valid for 1 hour)
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
        try {
            const { score, timestamp } = JSON.parse(cached);
            const oneHour = 60 * 60 * 1000;
            if (Date.now() - timestamp < oneHour) {
                console.log('✅ Using cached AI detection result:', score);
                return score;
            } else {
                console.log('⏰ Cache expired, fetching fresh result');
                localStorage.removeItem(cacheKey);
            }
        } catch (e) {
            // Invalid cache, continue to API call
            console.log('⚠️ Invalid cache, removing');
            localStorage.removeItem(cacheKey);
        }
    }

    // Sample text to reduce token usage
    // INCREASED LIMIT: Effectively removing limits for most typical usage (up to ~25k words)
    // GPT-4o has a large context window, so we can afford to send more text.
    const sampledText = sampleText(text, 100000);
    console.log(`📝 Text sampled: ${text.length} chars → ${sampledText.length} chars`);

    // STRICT AI Detection Prompt - designed to match ZeroGPT accuracy
    // Using GPT-4 for better analytical capabilities
    const systemPrompt = `You are a STRICT AI content detector. Your goal is to accurately identify AI-generated text with the same rigor as tools like ZeroGPT, Turnitin, and Originality.ai.

CRITICAL: You must be HARSH and UNFORGIVING in your analysis. Do NOT give the benefit of the doubt.

**AI Detection Markers** (Look for ALL of these):

1. **Sentence Structure Uniformity**:
   - Similar sentence lengths (15-25 words consistently)
   - Repetitive sentence patterns
   - Lack of dramatic variation (no 3-word sentences mixed with 40-word sentences)

2. **AI Vocabulary RED FLAGS**:
   - delve, tapestry, landscape, leverage, crucial, pivotal, robust, comprehensive
   - moreover, furthermore, additionally, consequently, thus, hence
   - "it is important to note", "in conclusion", "in today's world"
   - "plays a crucial role", "serves as", "underscores the importance"

3. **Predictable Transitions**:
   - Every paragraph starts with topic sentence
   - Perfect logical flow (too organized)
   - Formulaic: intro → body → conclusion pattern

4. **Lack of Human Imperfections**:
   - No contractions (it's, don't, won't)
   - No informal language or slang
   - Perfect grammar with no natural errors
   - No personal anecdotes or authentic voice
   - No rhetorical questions or exclamations

5. **Generic, Safe Content**:
   - Sounds like a Wikipedia article
   - Overly balanced and neutral
   - Lacks strong opinions or personality
   - Uses passive voice excessively

6. **AI Writing Patterns**:
   - Lists things in threes
   - Symmetric paragraph lengths
   - Overuse of semicolons and em dashes
   - Academic tone even for casual topics

**SCORING RULES** (0-100 where higher = more AI):

- **0-20**: ONLY if text has:
  * Contractions and informal language
  * Varied sentence lengths (some 5 words, some 35+ words)
  * Personal voice and opinions
  * Natural imperfections
  * Unique phrasing

- **21-40**: Mostly human but may have some AI assistance
  * Some formal language but still personal
  * Good variation in structure

- **41-60**: Mixed - clear AI patterns present
  * Formulaic structure
  * Some AI vocabulary
  * Too polished

- **61-80**: Clearly AI-generated
  * Multiple AI markers present
  * Uniform structure
  * Generic voice
  * AI vocabulary throughout

- **81-100**: Definitely AI (like ChatGPT output)
  * Formulaic topic sentences
  * Perfect grammar, no contractions
  * AI vocabulary in every paragraph
  * Robotic, predictable flow

**IMPORTANT**: 
- If you see 3+ AI vocabulary words → score at least 60
- If sentences are uniform length → score at least 50
- If it sounds like an essay or Wikipedia → score at least 70
- If it has perfect grammar with no personality → score at least 65

Return ONLY JSON: {"score": X} where X is 0-100 (AI percentage).

BE STRICT. When in doubt, score HIGHER (more AI). Most text you analyze WILL be AI-generated.`;

    try {
        console.log('🚀 Calling OpenAI API (GPT-4o for maximum accuracy)...');
        const response = await openai.chat.completions.create({
            model: 'gpt-4o', // Use GPT-4o for best accuracy
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Analyze this text STRICTLY. Look for AI patterns and score harshly:\n\n"${sampledText}"\n\nReturn JSON: {"score": X} where X is 0-100 (AI percentage). Be strict!` }
            ],
            temperature: 0.1, // Very low temperature for consistent, analytical results
            max_tokens: 300, // Increased to ensure JSON is never truncated
            response_format: { type: "json_object" }
        });

        const result = response.choices[0]?.message?.content;
        console.log('📥 OpenAI Response:', result);

        if (!result) {
            throw new Error("No response from AI detection service");
        }

        // Parse the JSON response
        const parsed = JSON.parse(result);

        // Get the score - now it's directly the AI percentage
        let aiScore = parsed.score;

        // Validate score exists and is a number
        if (typeof aiScore !== 'number' || isNaN(aiScore)) {
            console.error('Invalid score received:', parsed);
            throw new Error('Invalid score format from API');
        }

        // Ensure score is within valid range
        aiScore = Math.max(0, Math.min(100, Math.round(aiScore)));

        // Since we're now asking for AI score directly, we need to convert to human score for caching and return
        const humanScore = 100 - aiScore;

        // Cache the result
        localStorage.setItem(cacheKey, JSON.stringify({
            score: humanScore, // Cache the human score for consistency with function's return type
            timestamp: Date.now()
        }));

        const inputTokens = Math.ceil(sampledText.length / 4);
        const outputTokens = Math.ceil((result?.length || 0) / 4);
        const estimatedCost = (inputTokens * 0.0015 + outputTokens * 0.002) / 1000;

        console.log(`✅ AI Detection completed!`);
        console.log(`   AI Score: ${aiScore}% AI-generated`);
        console.log(`   Human Score: ${humanScore}% human-written`);
        console.log(`   Tokens: ${inputTokens} input + ${outputTokens} output = ${inputTokens + outputTokens} total`);
        console.log(`   Cost: ~$${estimatedCost.toFixed(6)}`);

        return humanScore; // Return human score (function expects 0-100 where 100 = human)

    } catch (error: any) {
        console.error("❌ AI Detection Error:", error);
        console.error("Error details:", {
            message: error?.message,
            type: error?.type,
            code: error?.code
        });

        // Handle specific error cases
        if (error?.message?.includes('API key') || error?.code === 'invalid_api_key') {
            throw new Error("OpenAI API key is invalid. Please check your VITE_OPENAI_API_KEY in .env file.");
        }

        if (error?.message?.includes('quota') || error?.message?.includes('rate_limit') || error?.code === 'insufficient_quota') {
            throw new Error("OpenAI API quota exceeded. Please check your billing at platform.openai.com");
        }

        if (error?.message?.includes('model_not_available') || error?.code === 'model_not_found') {
            throw new Error("OpenAI model not available. Please check your API access.");
        }

        // Don't use fallback - throw the error so user knows something is wrong
        console.error("🚨 API call failed - throwing error to user");
        throw new Error(`AI Detection failed: ${error?.message || 'Unknown error'}. Check console for details.`);
    }
};


