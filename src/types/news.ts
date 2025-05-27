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

export interface NewsDataResponse {
  status: string;
  totalResults: number;
  results: NewsDataArticle[];
}

export interface NewsDataArticle {
  article_id: string;
  title: string;
  description: string;
  category: string[];
  creator: string | null;
  pubDate: string;
  image_url: string | null;
  link: string;
  source_id: string;
  content: string;
}