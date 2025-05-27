import { formatDistanceToNow } from 'date-fns';
import { Clock, ExternalLink, User, Volume2 } from 'lucide-react';
import React, { useState, useRef } from 'react';
import { Article } from '../types/news';
import { BookmarkButton } from './BookmarkButton';

interface ArticleCardProps {
  article: Article;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, isBookmarked, onToggleBookmark }) => {
  const [isReading, setIsReading] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const toggleTextToSpeech = () => {
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(
      `${article.title}. ${article.description}`
    );
    speechRef.current = utterance;
    
    utterance.onend = () => {
      setIsReading(false);
      speechRef.current = null;
    };

    window.speechSynthesis.speak(utterance);
    setIsReading(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
      <img 
        src={article.imageUrl} 
        alt={article.title}
        className="w-full h-48 object-cover"
        loading="lazy"
      />
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100">
              {article.category}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              {formatDistanceToNow(article.date, { addSuffix: true })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTextToSpeech}
              className={`p-2 rounded-full transition-colors ${
                isReading 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              aria-label={isReading ? 'Stop reading' : 'Read article'}
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <BookmarkButton
              article={article}
              isBookmarked={isBookmarked}
              onToggleBookmark={onToggleBookmark}
            />
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-2 line-clamp-2 dark:text-white">
          {article.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {article.description}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
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
                className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
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