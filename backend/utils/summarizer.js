const axios = require("axios");
const pdfParse = require("pdf-parse");
async function summarizeWithOllama(text) {
  const prompt = `Please summarize the following document:\n\n${text}`;
  try {
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3",
      prompt,
      stream: false
    });
    return response.data.response;
  } catch (err) {
    console.error(" Ollama summarization failed:", err.message);
    return "Ollama failed to generate summary.";
  }
}
async function summarizeText(fileUrl) {
  console.log("Calling summarizeText with fileUrl:", fileUrl);
  try {
    const response = await axios.get(fileUrl, {
      responseType: "arraybuffer",
      headers: {
        Accept: "application/pdf"
      }
    });
    const pdfData = await pdfParse(response.data);
    const text = pdfData.text;
    console.log("[PDF PARSE] Extracted text length:", text.length);
    console.log("[PDF PREVIEW]", text.slice(0, 500));
    const summary = await summarizeWithOllama(text);
    return summary;
  } catch (err) {
    console.error("summarizeText failed:", err.message);
    return "Could not read or summarize the file.";
  }
}
module.exports = { summarizeText };