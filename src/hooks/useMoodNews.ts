import { useState, useEffect } from 'react';
import { Mood, Article } from '../types/news';

export const useMoodNews = (articles: Article[]) => {
  const [userMood, setUserMood] = useState<Mood>('happy');
  const [moodHistory, setMoodHistory] = useState<Array<{ mood: Mood; timestamp: Date }>>(() => {
    const saved = localStorage.getItem('moodHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
  }, [moodHistory]);

  const updateMood = (newMood: Mood) => {
    setUserMood(newMood);
    setMoodHistory(prev => [...prev, { mood: newMood, timestamp: new Date() }]);
  };

  const filterArticlesByMood = (articles: Article[]): Article[] => {
    switch (userMood) {
      case 'happy':
        return articles.filter(article => article.sentiment === 'positive');
      case 'stressed':
        return articles.filter(article => 
          article.category === 'Health' || 
          article.sentiment === 'positive'
        );
      case 'curious':
        return articles.filter(article => 
          article.category === 'Science' || 
          article.category === 'Technology'
        );
      case 'bored':
        return articles.filter(article => 
          article.category === 'Entertainment' || 
          article.category === 'Sports'
        );
      case 'angry':
        return articles.filter(article => 
          article.sentiment === 'neutral' || 
          article.category === 'Science'
        );
      default:
        return articles;
    }
  };

  const getMoodStats = () => {
    const last7Days = moodHistory.filter(entry => 
      new Date().getTime() - new Date(entry.timestamp).getTime() < 7 * 24 * 60 * 60 * 1000
    );

    return {
      mostFrequentMood: Object.entries(
        last7Days.reduce((acc, { mood }) => ({
          ...acc,
          [mood]: (acc[mood] || 0) + 1
        }), {} as Record<Mood, number>)
      ).sort(([, a], [, b]) => b - a)[0]?.[0] as Mood,
      total: last7Days.length
    };
  };

  return {
    userMood,
    updateMood,
    filteredArticles: filterArticlesByMood(articles),
    moodHistory,
    moodStats: getMoodStats()
  };
};