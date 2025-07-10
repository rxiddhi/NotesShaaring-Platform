# YouTube Data API Setup

This guide explains how to set up the YouTube Data API to enable the related videos feature in the Notes Sharing Platform.

## Prerequisites

1. A Google Cloud Platform account
2. A YouTube Data API v3 API key

## Setup Instructions

### 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable billing for your project (required for API usage)

### 2. Enable YouTube Data API v3

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "YouTube Data API v3"
3. Click on it and press "Enable"

### 3. Create API Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key
4. (Optional) Restrict the API key to only YouTube Data API v3 for security

### 4. Configure Environment Variables

Add your YouTube API key to your `.env` file:

```env
# Existing variables...
YOUTUBE_API_KEY=your_youtube_api_key_here
```

### 5. Test the Integration

1. Start your backend server
2. Upload a note with educational content
3. View the note details page
4. You should see a "Related Educational Videos" section

## API Usage Limits

- YouTube Data API v3 has a quota of 10,000 units per day
- Each search request costs 100 units
- Each video details request costs 1 unit
- Monitor your usage in the Google Cloud Console

## Troubleshooting

### Common Issues

1. **"YouTube API key not configured"**
   - Make sure `YOUTUBE_API_KEY` is set in your `.env` file
   - Restart your server after adding the environment variable

2. **"Quota exceeded"**
   - Check your API usage in Google Cloud Console
   - Consider implementing caching for video results

3. **"No related videos found"**
   - The note content might not have enough educational keywords
   - Try uploading notes with more specific educational content

### Security Best Practices

1. **Restrict API Key**: Limit your API key to only YouTube Data API v3
2. **Monitor Usage**: Regularly check your API usage in Google Cloud Console
3. **Implement Caching**: Consider caching video results to reduce API calls
4. **Rate Limiting**: Implement rate limiting on your backend endpoints

## Features

The YouTube integration provides:

- **Keyword Extraction**: Automatically extracts educational keywords from note content
- **Relevant Videos**: Finds educational videos related to the note's subject
- **Video Metadata**: Displays duration, view count, likes, and publication date
- **Direct Links**: Click to open videos on YouTube in a new tab
- **Error Handling**: Graceful fallback when API is unavailable

## Future Enhancements

- Video caching to reduce API calls
- User preference-based video recommendations
- Integration with other educational video platforms
- Advanced keyword extraction using NLP 