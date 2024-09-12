'use client';
import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { FaFolder } from 'react-icons/fa';

interface Category {
  _id: string;
  name: string;
  description: string;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const fetchedCategories = await api.getCategories();
      setCategories(fetchedCategories);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError('Failed to fetch categories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading categories...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Categories</h1>
          
          {categories.length === 0 ? (
            <p className="text-gray-600">No categories found.</p>
          ) : (
            <ul className="space-y-4">
              {categories.map((category) => (
                <li key={category._id} className="flex items-center bg-gray-100 p-4 rounded-md">
                  <FaFolder className="text-indigo-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}