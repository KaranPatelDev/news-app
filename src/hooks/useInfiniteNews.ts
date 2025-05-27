import { useState, useCallback } from 'react';
import { Article, Category } from '../types/news';
import { fetchLiveNews } from '../services/newsApi';

export const useInfiniteNews = (initialCategory: Category | 'All' = 'All') => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState(initialCategory);

  const loadMore = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const newArticles = await fetchLiveNews(
        category === 'All' ? '' : category,
        page
      );
      
      if (newArticles.length === 0) {
        setHasMore(false);
      } else {
        setArticles(prev => [...prev, ...newArticles]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error loading more articles:', error);
    } finally {
      setIsLoading(false);
    }
  }, [category, page, isLoading]);

  const refresh = useCallback(async () => {
    setPage(1);
    setHasMore(true);
    setArticles([]);
    
    try {
      const newArticles = await fetchLiveNews(
        category === 'All' ? '' : category,
        1
      );
      setArticles(newArticles);
      setPage(2);
    } catch (error) {
      console.error('Error refreshing articles:', error);
    }
  }, [category]);

  const changeCategory = useCallback((newCategory: Category | 'All') => {
    setCategory(newCategory);
    setPage(1);
    setHasMore(true);
    setArticles([]);
  }, []);

  return {
    articles,
    hasMore,
    isLoading,
    loadMore,
    refresh,
    changeCategory,
  };
};