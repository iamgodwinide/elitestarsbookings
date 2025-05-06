'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FC } from 'react';

type Celebrity = {
  _id: string;
  name: string;
  profession: string;
  imageUrl: string;
  slug: string;
};



const Celebrities: FC = () => {
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCelebrities = async () => {
      try {
        const res = await fetch('/api/celebrities/featured');
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to fetch celebrities');
        }

        const data = await res.json();
        console.log('Fetched celebrities:', data);
        
        if (!Array.isArray(data)) {
          throw new Error('Invalid response format');
        }

        setCelebrities(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load celebrities');
      } finally {
        setLoading(false);
      }
    };

    fetchCelebrities();
  }, []);

  return (
    <div className="py-24 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 opacity-0 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Featured Celebrities
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Book world-class talent for your next event
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            // Loading skeletons
            [...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-w-3 aspect-h-4 bg-gray-800 rounded-xl"></div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-full text-center text-red-500">{error}</div>
          ) : celebrities.length === 0 ? (
            <div className="col-span-full text-center text-gray-400">No featured celebrities available</div>
          ) : (
            celebrities.map((celebrity, index) => (
            <div
              key={index}
              className="group relative rounded-xl overflow-hidden opacity-0 animate-fade-in-delay-2"
            >
              <div className="aspect-w-3 aspect-h-4 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                <Image
                  src={celebrity.imageUrl || '/placeholder-celebrity.jpg'}
                  alt={celebrity.name}
                  width={300}
                  height={400}
                  className="object-cover w-full h-full bg-no-repeat group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-purple-400">
                    {celebrity.profession}
                  </p>
                  <h3 className="text-xl font-bold text-white">
                    {celebrity.name}
                  </h3>
                </div>
              </div>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Link 
                    href={`/booking/${celebrity._id}`} // MongoDB IDs don't need encoding in Next.js dynamic routes
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full transform -translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:from-purple-700 hover:to-pink-700"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          )))}
        </div>

        <div className="mt-16 text-center opacity-0 animate-fade-in-delay-4">
          <Link 
            href="/celebrities"
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold text-lg text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
          >
            View All Celebrities
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Celebrities;
