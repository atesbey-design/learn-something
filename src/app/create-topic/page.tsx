'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../services/api';
import React from 'react';

interface Category {
  _id: string;
  name: string;
}

export default function CreateTopic() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await api.getCategories();
      setCategories(fetchedCategories);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError('Failed to fetch categories. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await api.createTopic(title, content, categoryId);
      router.push('/profile');
    } catch (err) {
      console.error('Failed to create topic:', err);
      setError('Failed to create topic. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-xl shadow-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create a New Topic</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select
              id="category"
              name="category"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              id="content"
              name="content"
              required
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? 'Creating...' : 'Create Topic'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
