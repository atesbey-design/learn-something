'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaUser, FaEnvelope, FaBook, FaCalendar, FaHeart, FaSignOutAlt, FaPlus } from 'react-icons/fa';
import { api } from '../../services/api';
import React from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  lastReadDate: string;
  dailyReadCount: number;
  lastFavoriteAdded: string;
}

interface Topic {
  _id: string;
  title: string;
  content: string;
  favoriteCount: number;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [favoriteTopics, setFavoriteTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('User ID not found');
      
      const userResponse = await api.getUser(userId);
      setUser(userResponse);

      const favoritesResponse = await api.getFavoriteTopics(userId);
      console.log('Favorite topics:', favoritesResponse); // Debugging için
      setFavoriteTopics(favoritesResponse);

      setError('');
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      setError('An error occurred while fetching your profile.');
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    router.push('/login');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(parseInt(dateString) * 1000); // Unix timestamp için
    // veya
    // const date = new Date(dateString); // ISO string için
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="inline-flex items-center text-white hover:text-gray-200 transition duration-300">
            <FaArrowLeft className="mr-2" />
            Back to Home
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition duration-300 text-sm md:text-base flex items-center"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Your Profile</h1>
        {isLoading ? (
          <p className="text-center text-xl">Loading profile...</p>
        ) : error ? (
          <p className="text-center text-xl text-red-300">{error}</p>
        ) : user ? (
          <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6 md:p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FaUser className="text-3xl mr-4 text-indigo-600" />
                <h2 className="text-2xl font-semibold">{user.name}</h2>
              </div>
              <Link href="/create-topic">
                <FaPlus className="text-green-500 hover:text-green-600 transition duration-300" size={24} />
              </Link>
            </div>
            <div className="flex items-center mb-4">
              <FaEnvelope className="text-xl mr-4 text-indigo-600" />
              <p className="text-lg">{user.email}</p>
            </div>
            <div className="flex items-center mb-4">
              <FaBook className="text-xl mr-4 text-indigo-600" />
              <p className="text-lg">Daily Read Count: {user.dailyReadCount}</p>
            </div>
            <div className="flex items-center mb-4">
              <FaCalendar className="text-xl mr-4 text-indigo-600" />
              <p className="text-lg">Last Read: {new Date(user.lastReadDate).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center mb-4">
              <FaHeart className="text-xl mr-4 text-indigo-600" />
              <p className="text-lg">Last Favorite Added: {user.lastFavoriteAdded ? new Date(user.lastFavoriteAdded).toLocaleDateString() : 'Never'}</p>
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Favorite Topics</h3>
              {favoriteTopics.length > 0 ? (
                <ul className="space-y-4">
                  {favoriteTopics.map((topic) => (
                    <li key={topic._id} className="bg-gray-100 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold mb-2">{topic.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{topic.content}</p>
                      <p className="text-sm text-indigo-600">
                        <FaHeart className="inline mr-1" />
                        Favorited by {topic.favoriteCount} {topic.favoriteCount === 1 ? 'user' : 'users'}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No favorite topics yet.</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-xl">No user data available.</p>
        )}
      </div>
    </div>
  );
}