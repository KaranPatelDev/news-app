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
  sentiment?: 'positive' | 'negative' | 'neutral';
  isLatest?: boolean;
}

export type Category = 'Technology' | 'Science' | 'Business' | 'Health' | 'Entertainment' | 'Sports';

export type Mood = 'happy' | 'stressed' | 'curious' | 'bored' | 'angry';

export interface NewsDataResponse {
  status: string;
  totalResults: number;
  results: NewsDataArticle[];
  nextPage?: string;
}

export interface NewsDataArticle {
  article_id: string;
  title: string;
  description: string;
  category: string[];
  creator: string[] | null;
  pubDate: string;
  image_url: string | null;
  link: string;
  source_id: string;
  content: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}