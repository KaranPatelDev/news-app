import { useState, useEffect } from 'react';
import { Article } from '../types/news';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Article[]>(() => {
    const saved = localStorage.getItem('bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = (article: Article) => {
    setBookmarks(prev => {
      if (prev.some(bookmark => bookmark.id === article.id)) {
        return prev;
      }
      return [...prev, article];
    });
  };

  const removeBookmark = (articleId: string) => {
    setBookmarks(prev => prev.filter(bookmark => bookmark.id !== articleId));
  };

  const isBookmarked = (articleId: string) => {
    return bookmarks.some(bookmark => bookmark.id === articleId);
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
  };
};