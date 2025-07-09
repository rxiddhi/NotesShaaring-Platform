// Simple Difficulty Estimator for Notes
// This can be replaced with a more advanced ML/NLP model in the future

function estimateDifficulty({ title = '', description = '', summary = '' }) {
  const text = `${title} ${description} ${summary}`.toLowerCase();
  const words = text.match(/\b\w+\b/g) || [];
  const uniqueWords = new Set(words);
  const wordCount = words.length;
  const uniqueWordCount = uniqueWords.size;

  // Heuristic: more unique words and longer description = harder
  if (wordCount < 50 || uniqueWordCount < 30) return 'Easy';
  if (wordCount < 150 || uniqueWordCount < 70) return 'Medium';
  return 'Hard';
}

module.exports = { estimateDifficulty }; 