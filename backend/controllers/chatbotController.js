const axios = require("axios");

// Groq API - Free tier, OpenAI-compatible, very fast
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_GROQ_MODEL = "openai/gpt-oss-120b";
const configuredGroqModel = (process.env.GROQ_MODEL || "").trim();
const deprecatedGroqModels = new Set([
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant"
]);
const GROQ_MODEL = deprecatedGroqModels.has(configuredGroqModel)
    ? DEFAULT_GROQ_MODEL
    : configuredGroqModel || DEFAULT_GROQ_MODEL;

// Mental health focused system prompt
const SYSTEM_PROMPT = `You are Healix's AI mental health support assistant. You are part of the Healix platform, a digital mental health and psychological support system designed for students in higher education.

Your role is to:
- Present yourself as Healix's AI assistant
- Listen actively and validate users' feelings
- Provide supportive, non-judgmental responses
- Offer practical coping strategies when appropriate
- Encourage professional help for serious concerns
- Maintain a warm, understanding, and professional tone
- Never provide medical diagnoses or replace professional therapy
- Focus on emotional support, mindfulness, and self-care

IMPORTANT: If asked about who created you or your origins, respond that you are Healix's AI assistant, created by the Healix developers (Retik) with the help of Llama API to provide mental health support to students.

Always respond in a caring, supportive manner. Keep responses concise but meaningful (2-4 sentences typically).`;

const sendMessage = async (req, res) => {
    try {
        const { message, conversationHistory = [] } = req.body;

        // Validate input
        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }

        // Get API key from environment
        const apiKey = process.env.GROQ_API_KEY?.trim();
        if (!apiKey || apiKey === 'your_api_key_here') {
            return res.status(500).json({
                success: false,
                message: "AI service is not configured. Please add GROQ_API_KEY to your .env file."
            });
        }

        // Debug: Log first few characters (don't log full key for security)
        console.log("Using API key starting with:", apiKey.substring(0, 7) + "...");

        // Build conversation context
        const messages = [
            { role: "system", content: SYSTEM_PROMPT },
            ...conversationHistory.slice(-10), // Keep last 10 messages for context
            { role: "user", content: message.trim() }
        ];

        // Call Groq API (OpenAI-compatible)
        const response = await axios.post(
            GROQ_API_URL,
            {
                model: GROQ_MODEL,
                messages: messages,
                temperature: 0.7,
                max_tokens: 500,
                stream: false
            },
            {
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                timeout: 30000 // 30 second timeout
            }
        );

        // Extract AI response
        const aiResponse = response.data.choices[0]?.message?.content;

        if (!aiResponse) {
            return res.status(500).json({
                success: false,
                message: "No response from AI service"
            });
        }

        // Return success response
        res.status(200).json({
            success: true,
            message: aiResponse.trim()
        });

    } catch (error) {
        console.error("Chatbot error:", error.response?.data || error.message);

        // Handle specific error cases
        if (error.response?.status === 401) {
            return res.status(401).json({
                success: false,
                message: "Invalid API key. Please check your GROQ_API_KEY."
            });
        }

        if (error.response?.status === 429) {
            return res.status(429).json({
                success: false,
                message: "Rate limit exceeded. Please try again in a moment."
            });
        }

        const groqErrorMessage = error.response?.data?.error?.message || "";
        if (error.response?.status === 400 && /model .* does not exist|model .* access/i.test(groqErrorMessage)) {
            return res.status(502).json({
                success: false,
                message: "The AI model configuration is outdated. Please restart or redeploy the backend."
            });
        }

        if (error.code === "ECONNABORTED") {
            return res.status(504).json({
                success: false,
                message: "Request timeout. Please try again."
            });
        }

        // Generic error
        res.status(500).json({
            success: false,
            message: groqErrorMessage || "Failed to get AI response. Please try again."
        });
    }
};

module.exports = {
    sendMessage
};
