const axios = require('axios');

const GOOGLE_SEARCH_API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
const GOOGLE_CUSTOM_SEARCH_ENGINE_ID = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID;
const GOOGLE_SEARCH_API_BASE_URL = 'https://www.googleapis.com/customsearch/v1';

function extractArticleKeywords(title = '', description = '', subject = '') {
  const text = `${title} ${description} ${subject}`.toLowerCase();
  const educationalKeywords = [
    'tutorial', 'guide', 'how to', 'explanation', 'introduction',
    'basics', 'fundamentals', 'concepts', 'examples', 'practice',
    'theory', 'principles', 'methods', 'techniques', 'algorithms',
    'data structures', 'programming', 'mathematics', 'physics',
    'chemistry', 'biology', 'engineering', 'computer science',
    'learning', 'education', 'study', 'research', 'analysis'
  ];
  
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her',
    'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their'
  ]);
  
  const words = text.match(/\b\w+\b/g) || [];
  const filteredWords = words.filter(word => 
    word.length > 2 && !stopWords.has(word)
  );
  
  const wordCount = {};
  filteredWords.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  // Sort by frequency and prioritize educational keywords
  const sortedWords = Object.entries(wordCount)
    .sort((a, b) => {
      const aIsEducational = educationalKeywords.includes(a[0]);
      const bIsEducational = educationalKeywords.includes(b[0]);
      
      if (aIsEducational && !bIsEducational) return -1;
      if (!aIsEducational && bIsEducational) return 1;
      
      return b[1] - a[1];
    })
    .slice(0, 4) // Take top 4 keywords for article search
    .map(([word]) => word);
  
  return sortedWords;
}

// Fetch related educational articles using Google Custom Search
async function fetchRelatedArticles(keywords, maxResults = 8) {
  if (!GOOGLE_SEARCH_API_KEY || !GOOGLE_CUSTOM_SEARCH_ENGINE_ID) {
    console.warn('Google Custom Search API not configured');
    return [];
  }
  
  try {
    // Create search query from keywords
    const query = keywords.join(' ') + ' educational article tutorial guide';
    
    const response = await axios.get(GOOGLE_SEARCH_API_BASE_URL, {
      params: {
        key: GOOGLE_SEARCH_API_KEY,
        cx: GOOGLE_CUSTOM_SEARCH_ENGINE_ID,
        q: query,
        num: Math.min(maxResults, 10), // Google CSE max is 10
        dateRestrict: 'y1', // Restrict to articles from last year
        sort: 'relevance',
        safe: 'active'
      }
    });
    
    const items = response.data.items || [];
    
    return items.map(item => ({
      title: item.title,
      snippet: item.snippet,
      url: item.link,
      displayLink: item.displayLink,
      formattedUrl: item.formattedUrl,
      image: item.pagemap?.cse_image?.[0]?.src || null,
      publishedDate: item.pagemap?.metatags?.[0]?.['article:published_time'] || null
    }));
    
  } catch (error) {
    console.error('Error fetching Google Custom Search results:', error.message);
    return [];
  }
}

// Format date for display
function formatArticleDate(dateString) {
  if (!dateString) return null;
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return null;
  }
}

// Main function to get related articles for a note
async function getRelatedArticles(note) {
  const keywords = extractArticleKeywords(note.title, note.description, note.subject);
  const articles = await fetchRelatedArticles(keywords);
  
  return {
    keywords,
    articles: articles.map(article => ({
      ...article,
      publishedDate: formatArticleDate(article.publishedDate)
    }))
  };
}

module.exports = {
  extractArticleKeywords,
  fetchRelatedArticles,
  getRelatedArticles,
  formatArticleDate
}; 