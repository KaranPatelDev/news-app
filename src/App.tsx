import { useEffect, useMemo, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { ArticleGrid } from './components/ArticleGrid';
import { BookmarksDrawer } from './components/BookmarksDrawer';
import { CategoryFilter } from './components/CategoryFilter';
import { Header } from './components/Header';
import { LoadingGrid } from './components/LoadingGrid';
import { SearchBar } from './components/SearchBar';
import { useBookmarks } from './hooks/useBookmarks';
import { fetchLiveNews } from './services/newsApi';
import { Article, Category } from './types/news';

function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const { bookmarks, addBookmark, removeBookmark, isBookmarked } = useBookmarks();

  useEffect(() => {
    const loadNews = async () => {
      setIsLoading(true);
      try {
        const newsArticles = await fetchLiveNews(
          selectedCategory === 'All' ? '' : selectedCategory
        );
        setArticles(newsArticles);
      } catch (error) {
        console.error('Error loading news:', error);
        toast.error('Failed to load news articles');
      } finally {
        setIsLoading(false);
      }
    };

    loadNews();
    const interval = setInterval(loadNews, 300000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, [selectedCategory]);

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [articles, searchQuery]);

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
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Header onOpenBookmarks={() => setIsBookmarksOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {isLoading ? (
          <LoadingGrid />
        ) : (
          <ArticleGrid
            articles={filteredArticles}
            isBookmarked={isBookmarked}
            onToggleBookmark={handleToggleBookmark}
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