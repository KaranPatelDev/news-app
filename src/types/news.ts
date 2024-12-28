export interface Article {
  id: string;
  title: string;
  description: string;
  category: Category;
  author: string;
  date: Date;
  imageUrl: string;
  readTime: number;
  url?: string;
  source?: string;
}

export type Category = 'Technology' | 'Science' | 'Business' | 'Health' | 'Entertainment' | 'Sports';

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsApiArticle[];
}

export interface NewsApiArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string;
}