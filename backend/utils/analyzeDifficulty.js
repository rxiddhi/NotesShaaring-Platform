const TextStatistics = require('text-statistics');


  
/**
 * @param {string} text 
 * @returns {"Basic"|"Intermediate"|"Advanced"} 
 */
function estimateDifficulty(text) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return "Basic";
  }
  
  const ts = new TextStatistics(text);
  const score = ts.fleschKincaidReadingEase();
  if (score >= 70) return "Basic";
  if (score >= 50) return "Intermediate";
  return "Advanced";
}

module.exports = { estimateDifficulty }; 