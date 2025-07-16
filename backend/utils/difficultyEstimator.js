function estimateDifficulty({ title = "", description = "", summary = "" }) {
  const text = `${title} ${description} ${summary}`.toLowerCase();
  const words = text.match(/\b\w+\b/g) || [];
  const uniqueWords = new Set(words);
  const wordCount = words.length;
  const uniqueWordCount = uniqueWords.size;

  // Count sentences
  const sentenceCount = (text.match(/[.!?]/g) || []).length || 1;
  // Average sentence length
  const avgSentenceLength = wordCount / sentenceCount;

  // List of technical terms (expand as needed)
  const technicalTerms = [
    "algorithm",
    "theorem",
    "proof",
    "derivative",
    "integral",
    "complexity",
    "recursion",
    "matrix",
    "vector",
    "differential",
    "quantum",
    "entropy",
    "polynomial",
    "function",
    "limit",
    "sequence",
    "series",
    "graph",
    "tree",
    "data",
    "structure",
    "pointer",
    "array",
    "linked",
    "list",
    "stack",
    "queue",
    "sort",
    "search",
    "hash",
    "binary",
    "logic",
    "circuit",
    "compiler",
    "syntax",
    "semantics",
    "grammar",
    "parse",
    "automata",
    "turing",
    "machine",
    "probability",
    "statistics",
    "distribution",
    "variance",
    "mean",
    "median",
    "mode",
    "regression",
    "calculus",
    "geometry",
    "trigonometry",
    "physics",
    "force",
    "energy",
    "momentum",
    "wave",
    "particle",
    "electron",
    "proton",
    "neutron",
    "atom",
    "molecule",
    "bond",
    "reaction",
    "equation",
    "balance",
    "oxidation",
    "reduction",
    "acid",
    "base",
    "solution",
    "solvent",
    "solute",
    "concentration",
    "pressure",
    "volume",
    "temperature",
  ];
  const techTermCount = words.filter((word) =>
    technicalTerms.includes(word)
  ).length;

  // Heuristic scoring
  let score = 0;
  if (wordCount > 200) score += 1;
  if (uniqueWordCount > 100) score += 1;
  if (avgSentenceLength > 15) score += 1;
  if (techTermCount > 3) score += 1;

  if (score <= 1) return "Easy";
  if (score === 2) return "Medium";
  return "Hard";
}

module.exports = { estimateDifficulty };
