'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { api } from '../../../services/api';
import React from 'react';

interface Topic {
  id: string;
  title: string;
  content: string;
  category: string;
}

export default function CategoryPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const params = useParams();
  const router = useRouter();
  const { category } = params;

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const allTopics = await api.getTopics();
        const filteredTopics = allTopics.filter(
          (topic: Topic) => topic.category.toLowerCase() === (category as string).toLowerCase()
        );
        setTopics(filteredTopics);
      } catch (error) {
        console.error('Failed to fetch topics:', error);
        router.push('/categories');
      }
    };

    if (category) {
      fetchTopics();
    }
  }, [category, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold mb-8 text-center capitalize">{category} Topics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {topics.map((topic) => (
            <Link key={topic.id} href={`/topics/${topic.id}`}>
              <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6 hover:bg-purple-100 transition duration-300">
                <h2 className="text-2xl font-semibold mb-2">{topic.title}</h2>
                <p className="text-gray-600">{topic.content.substring(0, 100)}...</p>
              </div>
            </Link>
          ))}
        </div>
        {topics.length === 0 && (
          <p className="text-center text-2xl mt-8">No topics found for this category.</p>
        )}
        <div className="mt-12 text-center">
          <Link href="/categories" className="inline-flex items-center bg-white text-purple-600 px-6 py-3 rounded-full hover:bg-purple-100 transition duration-300">
            <FaArrowLeft className="mr-2" />
            Back to Categories
          </Link>
        </div>
      </div>
    </div>
  );
}
