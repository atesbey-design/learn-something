'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaBook, FaUser, FaCheck, FaHeart, FaBookmark } from 'react-icons/fa';
import { api } from '../services/api';

interface Topic {
  _id: string;
  title: string;
  content: string;
  category: {
    _id: string;
    name: string;
  };
  favoriteCount: number;
  createdBy: {
    _id: string;
    name: string;
  };
}

export default function Home() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isRead, setIsRead] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchTopics();
    }
  }, [router]);

  const fetchTopics = async () => {
    setIsLoading(true);
    try {
      const response = await api.getTopics();
      setTopics(response);
      setIsLoading(false);
      setMessage('');
    } catch (error) {
      console.error('Failed to fetch topics:', error);
      setMessage('An error occurred while fetching topics.');
      setIsLoading(false);
    }
  };

  const moveToNextTopic = () => {
    setIsAnimating(true);
    setTimeout(() => {
      if (currentTopicIndex < topics.length - 1) {
        setCurrentTopicIndex(prevIndex => prevIndex + 1);
      } else {
        fetchTopics(); // Fetch new topics if we've reached the end
      }
      setIsRead(false);
      setIsFavorite(false);
      setIsAnimating(false);
    }, 500); // Duration of the animation
  };

  const handleMarkAsRead = async () => {
    try {
      await api.markTopicAsRead(topics[currentTopicIndex]._id);
      setIsRead(true);
      setMessage("Great job! You've completed this topic.");
      moveToNextTopic();
    } catch (error) {
      console.error('Failed to mark topic as read:', error);
      if (error instanceof Error) {
        setMessage(error.message || 'An error occurred while marking the topic as read.');
      } else {
        setMessage('An unexpected error occurred.');
      }
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('User ID not found');

      if (isFavorite) {
        await api.removeFavoriteTopic(userId, topics[currentTopicIndex]._id);
        setMessage('Topic removed from favorites!');
      } else {
        await api.addFavoriteTopic(userId, topics[currentTopicIndex]._id);
        setMessage('Topic added to favorites!');
      }
      setIsFavorite(!isFavorite);
      moveToNextTopic();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      if (error instanceof Error) {
        setMessage(error.message || 'An error occurred while updating favorites.');
      } else {
        setMessage('An unexpected error occurred while updating favorites.');
      }
    }
  };

  const currentTopic = topics[currentTopicIndex];

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-8">Learn Something New</h1>
        {isLoading ? (
          <p className="text-center text-xl">Loading topics...</p>
        ) : currentTopic ? (
          <div className={`bg-white text-gray-800 rounded-lg shadow-lg p-6 md:p-8 mb-8 transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl md:text-3xl font-semibold">Topic: {currentTopic.title}</h2>
              <div className="flex items-center text-sm">
                <FaUser className="mr-2 text-gray-600" />
                <span className="text-gray-600">{currentTopic.createdBy?.name || 'Unknown User'}</span>
                {currentTopic.category && (
                  <span className="ml-2 text-gray-400">
                    • {currentTopic.category.name}
                  </span>
                )}
              </div>
            </div>
            <p className="text-base md:text-lg mb-6">{currentTopic.content}</p>
            <div className="flex justify-between items-center">
              <button 
                onClick={handleMarkAsRead}
                className={`flex items-center justify-center px-4 py-2 rounded-full text-sm transition duration-300 ${
                  isRead 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isRead ? <FaCheck className="mr-2" /> : <FaBookmark className="mr-2" />}
                {isRead ? 'Read' : 'Mark as Read'}
              </button>
              <button
                onClick={handleToggleFavorite}
                className={`flex items-center justify-center px-4 py-2 rounded-full text-sm transition duration-300 ${
                  isFavorite 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaHeart className={`mr-2 ${isFavorite ? 'text-red-700' : 'text-gray-400'}`} />
                {isFavorite ? 'Favorited' : 'Add to Favorites'}
              </button>
            </div>
            <div className="mt-4 text-right text-sm text-gray-600">
              <FaHeart className="inline mr-1 text-red-500" />
              {currentTopic.favoriteCount} {currentTopic.favoriteCount === 1 ? 'user' : 'users'} favorited this topic
            </div>
          </div>
        ) : (
          <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6 md:p-8 mb-8">
            <p className="text-xl text-center">{message || 'No topics available.'}</p>
          </div>
        )}
        <nav className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-8">
          <Link href="/categories" className="flex items-center justify-center bg-indigo-500 text-white px-6 py-3 rounded-full hover:bg-indigo-600 transition duration-300 text-sm md:text-base">
            <FaBook className="mr-2" />
            Categories
          </Link>
          <Link href="/profile" className="flex items-center justify-center bg-indigo-500 text-white px-6 py-3 rounded-full hover:bg-indigo-600 transition duration-300 text-sm md:text-base">
            <FaUser className="mr-2" />
            Profile
          </Link>
        </nav>
      </div>
    </main>
  );
}