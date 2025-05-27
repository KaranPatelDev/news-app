import axios from 'axios';
import { articles as fallbackArticles } from '../data/articles';
import { Article, Category, NewsDataArticle, NewsDataResponse } from '../types/news';

const API_KEY = 'pub_91258135157e4aff99b66aab7c7ddddb';
const BASE_URL = 'https://newsdata.io/api/1';

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 10000; // Increased to 10 seconds
const MAX_RETRY_DELAY = 120000; // Increased to 2 minutes

// Keep track of seen articles to prevent duplicates
const seenArticles = new Set<string>();

// Simple cache implementation
const cache = new Map<string, { data: Article[], timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const mapNewsDataCategory = (categories: string[]): Category => {
  const categoryMap: Record<string, Category> = {
    'technology': 'Technology',
    'science': 'Science',
    'business': 'Business',
    'health': 'Health',
    'entertainment': 'Entertainment',
    'sports': 'Sports',
  };

  const matchedCategory = categories.find(cat => 
    categoryMap[cat.toLowerCase()] !== undefined
  );

  return matchedCategory ? categoryMap[matchedCategory.toLowerCase()] : 'Technology';
};

const analyzeSentiment = (text: string): 'positive' | 'negative' | 'neutral' => {
  const positiveWords = ['success', 'breakthrough', 'innovation', 'achievement', 'growth'];
  const negativeWords = ['crisis', 'disaster', 'failure', 'loss', 'conflict'];

  const lowerText = text.toLowerCase();
  const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;

  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
};

const transformNewsDataArticle = (article: NewsDataArticle): Article | null => {
  // Skip if we've seen this article before
  if (seenArticles.has(article.article_id)) {
    return null;
  }

  seenArticles.add(article.article_id);

  const sentiment = analyzeSentiment(article.title + ' ' + article.description);

  return {
    id: article.article_id,
    title: article.title,
    description: article.description || '',
    category: mapNewsDataCategory(article.category),
    author: article.creator?.[0] || 'Unknown',
    date: new Date(article.pubDate),
    imageUrl: article.image_url || 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg',
    readTime: Math.ceil((article.content?.length || 0) / 1000) || 3,
    url: article.link,
    source: article.source_id,
    sentiment
  };
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (params: Record<string, string>, retryCount = 0): Promise<NewsDataResponse> => {
  try {
    // Add a small initial delay to prevent burst requests
    if (retryCount === 0) {
      await delay(1000);
    }
    
    const response = await axios.get<NewsDataResponse>(`${BASE_URL}/news`, { params });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 429 && retryCount < MAX_RETRIES) {
      const retryDelay = Math.min(
        INITIAL_RETRY_DELAY * Math.pow(2, retryCount),
        MAX_RETRY_DELAY
      );
      
      console.log(`Rate limit exceeded. Retrying in ${retryDelay / 1000} seconds...`);
      await delay(retryDelay);
      return fetchWithRetry(params, retryCount + 1);
    }
    throw error;
  }
};

const getCacheKey = (category: string, page: number): string => {
  return `${category}-${page}`;
};

export const fetchLiveNews = async (category: string = '', page: number = 1): Promise<Article[]> => {
  const cacheKey = getCacheKey(category, page);
  const now = Date.now();

  // Check cache first
  const cachedData = cache.get(cacheKey);
  if (cachedData && (now - cachedData.timestamp) < CACHE_DURATION) {
    console.log('Returning cached data for:', cacheKey);
    return cachedData.data;
  }

  try {
    const params: Record<string, string> = {
      apikey: API_KEY,
      country: 'us',
      language: 'en',
      page: page.toString()
    };

    if (category) {
      params.category = category.toLowerCase();
    }

    const data = await fetchWithRetry(params);

    if (data.status !== 'success') {
      throw new Error('API returned an error');
    }

    // Filter out null values (duplicates)
    const articles = data.results
      .map(transformNewsDataArticle)
      .filter((article): article is Article => article !== null);

    // Cache the results
    cache.set(cacheKey, {
      data: articles,
      timestamp: now
    });

    return articles;
  } catch (error) {
    console.error('Error fetching live news:', error);
    
    // If we have cached data, use it even if expired
    const expiredCache = cache.get(cacheKey);
    if (expiredCache) {
      console.log('Using expired cache data due to error');
      return expiredCache.data;
    }
    
    return fallbackArticles;
  }
};

// Clear seen articles cache when switching categories
export const clearSeenArticles = () => {
  seenArticles.clear();
};

// Clear the entire cache
export const clearCache = () => {
  cache.clear();
};