import React from 'react';
import { Mood } from '../types/news';

interface MoodSelectorProps {
  currentMood: Mood;
  onMoodChange: (mood: Mood) => void;
}

const moodEmojis: Record<Mood, { emoji: string; label: string }> = {
  happy: { emoji: '😊', label: 'Happy' },
  stressed: { emoji: '😰', label: 'Stressed' },
  curious: { emoji: '🤔', label: 'Curious' },
  bored: { emoji: '😴', label: 'Bored' },
  angry: { emoji: '😠', label: 'Angry' }
};

export const MoodSelector: React.FC<MoodSelectorProps> = ({ currentMood, onMoodChange }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3 dark:text-white">How are you feeling today?</h2>
      <div className="flex flex-wrap gap-3">
        {Object.entries(moodEmojis).map(([mood, { emoji, label }]) => (
          <button
            key={mood}
            onClick={() => onMoodChange(mood as Mood)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${currentMood === mood
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
              }`}
          >
            <span className="text-xl">{emoji}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};