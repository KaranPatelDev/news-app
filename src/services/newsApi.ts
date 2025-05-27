import axios from 'axios';
import { articles as fallbackArticles } from '../data/articles';
import { Article, Category, NewsDataArticle, NewsDataResponse } from '../types/news';

const API_KEY = 'pub_91258135157e4aff99b66aab7c7ddddb';
const BASE_URL = 'https://newsdata.io/api/1';

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 5000; // 5 seconds
const MAX_RETRY_DELAY = 60000; // 1 minute

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

const transformNewsDataArticle = (article: NewsDataArticle): Article => ({
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
});

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (params: Record<string, string>, retryCount = 0): Promise<NewsDataResponse> => {
  try {
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

export const fetchLiveNews = async (category: string = ''): Promise<Article[]> => {
  try {
    const params: Record<string, string> = {
      apikey: API_KEY,
      country: 'us',
      language: 'en',
    };

    if (category) {
      params.category = category.toLowerCase();
    }

    const data = await fetchWithRetry(params);

    if (data.status !== 'success') {
      throw new Error('API returned an error');
    }

    return data.results.map(transformNewsDataArticle);
  } catch (error) {
    console.error('Error fetching live news:', error);
    return fallbackArticles;
  }
};