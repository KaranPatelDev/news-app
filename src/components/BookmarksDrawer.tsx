import React from 'react';
import { X } from 'lucide-react';
import { Article } from '../types/news';
import { ArticleCard } from './ArticleCard';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: Article[];
  onToggleBookmark: (article: Article) => void;
  isBookmarked: (id: string) => boolean;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  isOpen,
  onClose,
  bookmarks,
  onToggleBookmark,
  isBookmarked,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
      <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-xl">
        <div className="h-full flex flex-col">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="text-xl font-semibold">Bookmarked Articles</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Close bookmarks"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            {bookmarks.length === 0 ? (
              <p className="text-center text-gray-500 mt-8">
                No bookmarked articles yet
              </p>
            ) : (
              <div className="grid gap-6">
                {bookmarks.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    isBookmarked={isBookmarked(article.id)}
                    onToggleBookmark={() => onToggleBookmark(article)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};