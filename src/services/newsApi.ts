import axios from 'axios';
import { articles as fallbackArticles } from '../data/articles';
import { Article, Category, NewsApiArticle, NewsApiResponse } from '../types/news';

const API_KEY = 'a836d2f4667e4f79ab21b26d6f4c16d7';
const BASE_URL = 'https://newsapi.org/v2';

const mapNewsApiCategory = (category: string): Category => {
  const categoryMap: Record<string, Category> = {
    'technology': 'Technology',
    'science': 'Science',
    'business': 'Business',
    'health': 'Health',
    'entertainment': 'Entertainment',
    'sports': 'Sports',
  };
  return categoryMap[category.toLowerCase()] as Category || 'Technology';
};

const transformNewsApiArticle = (article: NewsApiArticle, category: string): Article => ({
  id: article.url,
  title: article.title,
  description: article.description || '',
  category: mapNewsApiCategory(category),
  author: article.author || 'Unknown',
  date: new Date(article.publishedAt),
  imageUrl: article.urlToImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80',
  readTime: Math.ceil((article.content?.length || 0) / 1000) || 3,
  url: article.url,
  source: article.source.name,
});

export const fetchLiveNews = async (category: string = ''): Promise<Article[]> => {
  if (!API_KEY) {
    console.warn('No API key provided, using fallback data');
    return fallbackArticles;
  }

  try {
    const response = await axios.get<NewsApiResponse>(`${BASE_URL}/top-headlines`, {
      params: {
        country: 'us',
        category: category.toLowerCase(),
        apiKey: API_KEY,
      },
    });

    if (response.data.status !== 'ok') {
      throw new Error('API returned an error');
    }

    return response.data.articles.map(article => 
      transformNewsApiArticle(article, category)
    );
  } catch (error) {
    console.error('Error fetching live news:', error);
    return fallbackArticles;
  }
};

