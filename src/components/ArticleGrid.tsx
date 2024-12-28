import React from 'react';
import { ArticleCard } from './ArticleCard';
import { Article } from '../types/news';

interface ArticleGridProps {
  articles: Article[];
  isBookmarked: (id: string) => boolean;
  onToggleBookmark: (article: Article) => void;
}

export const ArticleGrid: React.FC<ArticleGridProps> = ({
  articles,
  isBookmarked,
  onToggleBookmark,
}) => {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No articles found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map(article => (
        <ArticleCard
          key={article.id}
          article={article}
          isBookmarked={isBookmarked(article.id)}
          onToggleBookmark={() => onToggleBookmark(article)}
        />
      ))}
    </div>
  );
};