'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaSearch, FaFilter } from 'react-icons/fa';

type Celebrity = {
  _id: string;
  name: string;
  profession: string;
  imageUrl: string;
  bio: string;
  slug: string;
};





export default function CelebritiesPage() {
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [professions, setProfessions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCelebrities = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '12',
          ...(searchQuery && { search: searchQuery }),
          ...(selectedProfession !== 'All' && { profession: selectedProfession })
        });

        const res = await fetch(`/api/celebrities?${params}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to fetch celebrities');
        }

        const data = await res.json();
        setCelebrities(data.celebrities);
        setProfessions(['All', ...data.professions]);
        setTotalPages(data.pagination.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCelebrities();
  }, [page, searchQuery, selectedProfession]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Celebrities</h1>
          <p className="text-xl text-gray-400">
            Book exclusive experiences with your favorite celebrities
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search celebrities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:w-auto px-6 py-3 bg-white/5 rounded-lg text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
            >
              <FaFilter />
              Filters
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-white/5 rounded-lg">
              {/* Profession Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Profession
                </label>
                <select
                  value={selectedProfession}
                  onChange={(e) => {
                    setSelectedProfession(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-4 py-2 bg-white/5 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {professions.map((profession) => (
                    <option key={profession} value={profession} className="bg-gray-900">
                      {profession}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Celebrity Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-white/5 rounded-xl overflow-hidden">
                  <div className="h-80 bg-gray-800" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-800 rounded w-3/4" />
                    <div className="h-4 bg-gray-800 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-xl">{error}</p>
            <button
              onClick={() => setPage(1)}
              className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {celebrities.map((celebrity) => (
            <div key={celebrity._id} className="group relative">
              {/* Celebrity Card */}
              <div className="bg-white/5 rounded-xl overflow-hidden">
                {/* Image */}
                <div className="relative h-80">
                  <Image
                    src={celebrity.imageUrl}
                    alt={celebrity.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  

                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{celebrity.name}</h3>
                      <p className="text-gray-400">{celebrity.profession}</p>
                    </div>
                    <div className="text-right">
  
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-gray-400 mb-4 line-clamp-2">{celebrity.bio}</p>

                  {/* Book Now Button */}
                  <Link
                    href={`/booking/${celebrity._id}`} // MongoDB IDs don't need encoding in Next.js dynamic routes
                    className="block w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-center font-semibold text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white/5 rounded-lg text-white disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-white">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-white/5 rounded-lg text-white disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {!loading && !error && celebrities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-xl">No celebrities found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
