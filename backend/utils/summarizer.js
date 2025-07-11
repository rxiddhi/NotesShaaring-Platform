
const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent';;

const summarizeText = async (text) => {
  if (!text || text.length < 20) return "Summary not available";
  if (!GEMINI_API_KEY) {
    console.error("[GEMINI SUMMARY] No Gemini API key found in environment variables.");
    return text.split(" ").slice(0, 50).join(" ") + "...";
  }
  try {
    console.log("[GEMINI SUMMARY] Input text:", text);
    const prompt = `Summarize the following note in 2-3 sentences:\n\n${text}`;
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          { parts: [{ text: prompt }] }
        ]
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      }
    );
    console.log("[GEMINI SUMMARY] Gemini response:", response.data);
    if (
      response.data &&
      response.data.candidates &&
      response.data.candidates[0] &&
      response.data.candidates[0].content &&
      response.data.candidates[0].content.parts &&
      response.data.candidates[0].content.parts[0] &&
      response.data.candidates[0].content.parts[0].text
    ) {
      return response.data.candidates[0].content.parts[0].text.trim();
    } else {
      console.error("[GEMINI SUMMARY] Unexpected Gemini response structure:", response.data);
      return text.split(" ").slice(0, 50).join(" ") + "...";
    }
  } catch (err) {
    console.error("[GEMINI SUMMARY] Gemini summary error:", err);
    return text.split(" ").slice(0, 50).join(" ") + "...";
  }
};

module.exports = summarizeText;
