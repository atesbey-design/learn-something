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

export default function TopicPage() {
  const [topic, setTopic] = useState<Topic | null>(null);
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const fetchedTopic = await api.getTopic(id as string);
        setTopic(fetchedTopic);
      } catch (error) {
        console.error('Failed to fetch topic:', error);
        // Redirect to home page if topic not found
        router.push('/');
      }
    };

    if (id) {
      fetchTopic();
    }
  }, [id, router]);

  if (!topic) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="bg-white text-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-4">{topic.title}</h1>
          <p className="text-gray-600 mb-2">Category: {topic.category}</p>
          <div className="mt-6">
            <p className="text-lg">{topic.content}</p>
          </div>
        </div>
        <div className="text-center">
          <Link href="/" className="inline-flex items-center bg-white text-purple-600 px-6 py-3 rounded-full hover:bg-purple-100 transition duration-300">
            <FaArrowLeft className="mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
