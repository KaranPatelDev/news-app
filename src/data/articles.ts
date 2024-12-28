import { Article } from '../types/news';

export const articles: Article[] = [
  {
    id: '1',
    title: 'The Future of Artificial Intelligence in Healthcare',
    description: 'How AI is revolutionizing medical diagnosis and treatment planning, leading to more accurate and efficient healthcare delivery.',
    category: 'Technology',
    author: 'Dr. Sarah Chen',
    date: new Date('2024-03-15'),
    imageUrl: 'https://images.unsplash.com/photo-1587369768374-3221cf3daf2b?auto=format&fit=crop&q=80',
    readTime: 5
  },
  {
    id: '2',
    title: 'Breakthrough in Quantum Computing',
    description: 'Scientists achieve major milestone in quantum computing, bringing us closer to solving complex problems instantaneously.',
    category: 'Science',
    author: 'Prof. James Wilson',
    date: new Date('2024-03-14'),
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80',
    readTime: 4
  },
  {
    id: '3',
    title: 'Global Markets React to Economic Shifts',
    description: 'Markets worldwide respond to major policy changes and economic indicators, showing significant volatility.',
    category: 'Business',
    author: 'Emma Thompson',
    date: new Date('2024-03-13'),
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80',
    readTime: 6
  },
  {
    id: '4',
    title: 'Breakthrough in Renewable Energy Storage',
    description: 'New battery technology promises to revolutionize how we store and use renewable energy, making it more efficient than ever.',
    category: 'Science',
    author: 'Dr. Michael Chang',
    date: new Date('2024-03-12'),
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80',
    readTime: 4
  }
];