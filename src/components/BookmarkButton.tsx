import React from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Article } from '../types/news';

interface BookmarkButtonProps {
  article: Article;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  isBookmarked,
  onToggleBookmark,
}) => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        onToggleBookmark();
      }}
      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
      aria-label={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
    >
      {isBookmarked ? (
        <BookmarkCheck className="w-5 h-5 text-blue-600" />
      ) : (
        <Bookmark className="w-5 h-5 text-gray-500" />
      )}
    </button>
  );
};