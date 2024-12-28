import { formatDistanceToNow } from 'date-fns';
import { Clock, ExternalLink, User } from 'lucide-react';
import React from 'react';
import { Article } from '../types/news';
import { BookmarkButton } from './BookmarkButton';

interface ArticleCardProps {
  article: Article;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, isBookmarked, onToggleBookmark }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
      <img 
        src={article.imageUrl} 
        alt={article.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
              {article.category}
            </span>
            <span className="text-gray-500 text-sm">
              {formatDistanceToNow(article.date, { addSuffix: true })}
            </span>
          </div>
          <BookmarkButton
            article={article}
            isBookmarked={isBookmarked}
            onToggleBookmark={onToggleBookmark}
          />
        </div>
        <h2 className="text-xl font-semibold mb-2 line-clamp-2">{article.title}</h2>
        <p className="text-gray-600 mb-4 line-clamp-3">{article.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <User size={16} />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{article.readTime} min read</span>
            </div>
            {article.url && (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
              >
                <ExternalLink size={16} />
                <span>Read More</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};