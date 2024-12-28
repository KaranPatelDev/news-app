import React from 'react';
import { Newspaper, Bookmark as BookmarkIcon } from 'lucide-react';

interface HeaderProps {
  onOpenBookmarks: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenBookmarks }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Newspaper className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">News Hub</h1>
          </div>
          <button
            onClick={onOpenBookmarks}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <BookmarkIcon className="w-5 h-5" />
            <span>Bookmarks</span>
          </button>
        </div>
      </div>
    </header>
  );
};