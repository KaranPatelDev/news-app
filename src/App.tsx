import { useEffect, useMemo, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { ArticleGrid } from './components/ArticleGrid';
import { BookmarksDrawer } from './components/BookmarksDrawer';
import { CategoryFilter } from './components/CategoryFilter';
import { Header } from './components/Header';
import { LoadingGrid } from './components/LoadingGrid';
import { MoodSelector } from './components/MoodSelector';
import { SearchBar } from './components/SearchBar';
import { useBookmarks } from './hooks/useBookmarks';
import { useDarkMode } from './hooks/useDarkMode';
import { useMoodNews } from './hooks/useMoodNews';
import { useInfiniteNews } from './hooks/useInfiniteNews';
import { clearSeenArticles } from './services/newsApi';
import { Category } from './types/news';

function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const { bookmarks, addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const [isDark] = useDarkMode();

  const {
    articles,
    hasMore,
    isLoading,
    loadMore,
    refresh,
    changeCategory
  } = useInfiniteNews(selectedCategory);

  const { userMood, updateMood, filteredArticles, moodStats } = useMoodNews(articles);

  const handleCategoryChange = (category: Category | 'All') => {
    setSelectedCategory(category);
    clearSeenArticles();
    changeCategory(category);
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refresh();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', refresh);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', refresh);
    };
  }, [refresh]);

  const filteredAndSearchedArticles = useMemo(() => {
    return filteredArticles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [filteredArticles, searchQuery]);

  const handleToggleBookmark = (article: Article) => {
    if (isBookmarked(article.id)) {
      removeBookmark(article.id);
      toast.success('Removed from bookmarks');
    } else {
      addBookmark(article);
      toast.success('Added to bookmarks');
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isDark ? 'dark' : ''}`}>
      <Toaster position="top-right" />
      <Header onOpenBookmarks={() => setIsBookmarksOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MoodSelector currentMood={userMood} onMoodChange={updateMood} />
        
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        {isLoading && articles.length === 0 ? (
          <LoadingGrid />
        ) : (
          <ArticleGrid
            articles={filteredAndSearchedArticles}
            isBookmarked={isBookmarked}
            onToggleBookmark={handleToggleBookmark}
            onLoadMore={loadMore}
            hasMore={hasMore}
          />
        )}
      </main>

      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        onToggleBookmark={handleToggleBookmark}
        isBookmarked={isBookmarked}
      />
    </div>
  );
}

export default App;