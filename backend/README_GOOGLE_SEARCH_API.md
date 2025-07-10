# Google Custom Search API Setup

This guide explains how to set up Google Custom Search API to enable the related articles feature in the Notes Sharing Platform.

## Prerequisites

1. A Google Cloud Platform account
2. A Google Custom Search API key
3. A Custom Search Engine (CSE) configured for educational content

## Setup Instructions

### 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable billing for your project (required for API usage)

### 2. Enable Custom Search API

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Custom Search API"
3. Click on it and press "Enable"

### 3. Create API Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key
4. (Optional) Restrict the API key to only Custom Search API for security

### 4. Create a Custom Search Engine (CSE)

1. Go to [Google Programmable Search Engine](https://programmablesearchengine.google.com/)
2. Click "Create a search engine"
3. Enter your website URL (can be any URL for general search)
4. Choose "Search the entire web" for broader educational content
5. Click "Create"
6. Go to "Setup" > "Basic" and copy your Search Engine ID (cx)

### 5. Configure CSE for Educational Content

1. In your CSE settings, go to "Setup" > "Advanced"
2. Add educational sites to "Sites to search" (optional):
   - `*.edu`
   - `*.org`
   - `medium.com`
   - `dev.to`
   - `stackoverflow.com`
   - `github.com`
   - `wikipedia.org`
3. Set "Search the entire web" to include educational content
4. Save your changes

### 6. Configure Environment Variables

Add your Google Search API credentials to your `.env` file:

```env
# Existing variables...
GOOGLE_SEARCH_API_KEY=your_google_search_api_key_here
GOOGLE_CUSTOM_SEARCH_ENGINE_ID=your_custom_search_engine_id_here
```

### 7. Test the Integration

1. Start your backend server
2. Upload a note with educational content
3. View the note details page
4. You should see a "Related Educational Articles" section

## API Usage Limits

- Google Custom Search API has a quota of 10,000 queries per day (free tier)
- Each search request costs 1 query
- Monitor your usage in the Google Cloud Console

## Troubleshooting

### Common Issues

1. **"Google Custom Search API not configured"**
   - Make sure both `GOOGLE_SEARCH_API_KEY` and `GOOGLE_CUSTOM_SEARCH_ENGINE_ID` are set
   - Restart your server after adding the environment variables

2. **"Quota exceeded"**
   - Check your API usage in Google Cloud Console
   - Consider implementing caching for search results

3. **"No related articles found"**
   - The note content might not have enough educational keywords
   - Try uploading notes with more specific educational content
   - Check your CSE configuration

4. **"Invalid API key"**
   - Verify your API key is correct
   - Ensure the Custom Search API is enabled in your project
   - Check if the API key has proper restrictions

### Security Best Practices

1. **Restrict API Key**: Limit your API key to only Custom Search API
2. **Monitor Usage**: Regularly check your API usage in Google Cloud Console
3. **Implement Caching**: Consider caching search results to reduce API calls
4. **Rate Limiting**: Implement rate limiting on your backend endpoints

## Features

The Google Custom Search integration provides:

- **Smart Keyword Extraction**: Automatically extracts educational keywords from note content
- **Relevant Articles**: Finds educational articles related to the note's subject
- **Article Metadata**: Displays title, snippet, domain, and publication date
- **Direct Links**: Click to read articles in a new tab
- **Error Handling**: Graceful fallback when API is unavailable
- **Image Support**: Displays article images when available

## Customization Options

### Educational Keywords

You can customize the educational keywords in `backend/utils/googleSearchApi.js`:

```javascript
const educationalKeywords = [
  'tutorial', 'guide', 'how to', 'explanation', 'introduction',
  'basics', 'fundamentals', 'concepts', 'examples', 'practice',
  // Add more keywords as needed
];
```

### Search Parameters

Modify search parameters in the `fetchRelatedArticles` function:

```javascript
const response = await axios.get(GOOGLE_SEARCH_API_BASE_URL, {
  params: {
    key: GOOGLE_SEARCH_API_KEY,
    cx: GOOGLE_CUSTOM_SEARCH_ENGINE_ID,
    q: query,
    num: 8, // Number of results (max 10)
    dateRestrict: 'y1', // Restrict to last year
    sort: 'relevance', // Sort by relevance
    safe: 'active' // Safe search
  }
});
```

## Future Enhancements

- Article caching to reduce API calls
- User preference-based article recommendations
- Integration with other educational content platforms
- Advanced keyword extraction using NLP
- Article categorization and filtering
- Reading time estimation
- Article quality scoring

## Cost Optimization

1. **Implement Caching**: Cache search results for 24 hours
2. **Smart Queries**: Use more specific keywords to get better results
3. **Monitor Usage**: Set up alerts for quota usage
4. **Batch Requests**: Consider batching multiple searches if needed

## Example Usage

```javascript
// The API will automatically:
// 1. Extract keywords from note content
// 2. Search for educational articles
// 3. Return structured results with metadata
// 4. Display in the frontend component

// Example note content:
// Title: "Data Structures and Algorithms"
// Subject: "Computer Science"
// Description: "Comprehensive guide to DSA concepts"

// Extracted keywords: ["data structures", "algorithms", "computer science"]
// Search query: "data structures algorithms computer science educational article tutorial guide"
``` 