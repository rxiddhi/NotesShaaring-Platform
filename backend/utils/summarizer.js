
const summarizeText = async (text) => {
  if (!text || text.length < 20) return "Summary not available";
  return text.split(" ").slice(0, 50).join(" ") + "...";
};

module.exports = summarizeText;
